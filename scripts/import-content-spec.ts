/**
 * scripts/import-content-spec.ts
 *
 * Carga en Sanity el "27zero Site Content: Import Specification"
 * (`scripts/data/27zero-site-content-import-spec.md`).
 *
 * Qué hace, en este orden:
 *   1. CREATE  — documentos nuevos (servicios). `createIfNotExists`: si ya existe, se
 *                trata como PATCH. Nunca reemplaza un documento entero.
 *   2. PATCH   — parte del documento REAL (con imágenes), aplica solo las filas FIX,
 *                STYLE, REPLACE, FILL y NEW, y hace `set` de los campos de primer nivel
 *                que cambiaron. Lo que el spec no menciona queda intacto.
 *                Si el documento tiene un draft abierto, le aplica lo mismo al draft,
 *                para que publicarlo después no pise los cambios.
 *   3. DELETE  — draft twins y servicios retirados, al final (las prácticas ya no los
 *                referencian para entonces).
 *
 * KEEP, REVIEW y NEEDS INPUT no se escriben: se listan en el reporte. Para aprobar un
 * REVIEW, cambiar su status a FILL o REPLACE en el .md y volver a correr.
 *
 * Idempotente: correrlo dos veces no cambia nada la segunda vez (salvo arrays de
 * referencias, que se reescriben con el mismo contenido).
 *
 * Uso (sesión del CLI, sin token en .env — `npx sanity login` antes):
 *   npx sanity exec scripts/import-content-spec.ts --with-user-token              # dry-run
 *   npx sanity exec scripts/import-content-spec.ts --with-user-token -- --apply   # escribe
 *
 * Flags:
 *   --apply           escribe en el dataset (sin esto solo muestra el plan)
 *   --only=<texto>    procesa solo documentos cuyo _id o _type contenga <texto>
 *   --spec=<ruta>     otro archivo de spec
 *   --verbose         muestra antes → después de cada campo
 */

import {readFileSync, writeFileSync, mkdirSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'
import {applySpec, parseSpec, serviceIndex, WRITABLE, type SpecDoc} from './lib/contentSpec'

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const VERBOSE = args.includes('--verbose')
const ONLY = args.find((a) => a.startsWith('--only='))?.slice(7)
const SPEC_PATH = resolve(
  args.find((a) => a.startsWith('--spec='))?.slice(7) ??
    'scripts/data/27zero-site-content-import-spec.md',
)

const client = getCliClient({apiVersion: '2025-08-15'})

type Json = any // eslint-disable-line @typescript-eslint/no-explicit-any

const short = (v: Json) => {
  if (v === undefined) return '∅'
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return s.length > 90 ? `${s.slice(0, 87)}…` : s
}

async function fetchAll(ids: string[]): Promise<Map<string, Json>> {
  const map = new Map<string, Json>()
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100)
    const docs = await client.getDocuments(batch)
    docs.forEach((doc, idx) => doc && map.set(batch[idx], doc))
  }
  return map
}

interface Totals {
  created: number
  patched: number
  draftsPatched: number
  deleted: number
  unchanged: number
  errors: string[]
}

async function writePatch(id: string, doc: Json, touched: Set<string>) {
  const set: Record<string, Json> = {}
  const unset: string[] = []
  for (const key of touched) {
    if (doc[key] === undefined) unset.push(key)
    else set[key] = doc[key]
  }
  let patch = client.patch(id)
  if (Object.keys(set).length) patch = patch.set(set)
  if (unset.length) patch = patch.unset(unset)
  await patch.commit({autoGenerateArrayKeys: true})
}

async function main() {
  const docs = parseSpec(readFileSync(SPEC_PATH, 'utf8')).filter(
    (d) => d.action !== 'REPORT' && (!ONLY || d.id.includes(ONLY) || d.type.includes(ONLY)),
  )
  const ctx = {serviceIdsByTitle: serviceIndex(parseSpec(readFileSync(SPEC_PATH, 'utf8')))}

  const deleteIds = new Set(docs.filter((d) => d.action === 'DELETE').map((d) => d.id))
  const writable = docs.filter((d) => d.action !== 'DELETE')
  const existing = await fetchAll([
    ...new Set([
      ...docs.map((d) => d.id),
      ...writable.map((d) => `drafts.${d.id}`),
    ]),
  ])

  const config = client.config()
  console.log(
    `\n${APPLY ? '✍️  APPLY' : '👀 DRY-RUN (nada se escribe)'} — ${config.projectId}/${config.dataset}`,
  )
  console.log(`Spec: ${SPEC_PATH}`)
  console.log(`Documentos: ${docs.length} (${writable.length} a crear/editar, ${deleteIds.size} a borrar)\n`)

  const totals: Totals = {created: 0, patched: 0, draftsPatched: 0, deleted: 0, unchanged: 0, errors: []}
  const pending: {id: string; label: string; path: string; status: string; note: string}[] = []

  // CREATE primero: los servicios nuevos tienen que existir antes de que las prácticas
  // los referencien en `relatedServices`.
  const ordered: SpecDoc[] = [
    ...writable.filter((d) => d.action === 'CREATE'),
    ...writable.filter((d) => d.action === 'PATCH'),
  ]

  for (const spec of ordered) {
    for (const row of spec.rows) {
      if (!WRITABLE.has(row.status) && row.status !== 'KEEP') {
        pending.push({id: spec.id, label: spec.label, path: row.path, status: row.status, note: row.value})
      }
    }

    const current = existing.get(spec.id) ?? null
    if (!current && spec.action === 'PATCH') {
      totals.errors.push(`${spec.id} (${spec.label}): no existe en el dataset, se omite`)
      continue
    }

    const targets: {id: string; current: Json | null; isDraft: boolean}[] = [
      {id: spec.id, current, isDraft: false},
    ]
    const draft = existing.get(`drafts.${spec.id}`)
    if (draft && !deleteIds.has(`drafts.${spec.id}`)) {
      targets.push({id: `drafts.${spec.id}`, current: draft, isDraft: true})
    }

    for (const target of targets) {
      const result = applySpec(spec, target.current, ctx)
      result.errors.forEach((e) => totals.errors.push(`${target.id}: ${e}`))

      if (!result.changes.length && target.current) {
        totals.unchanged++
        continue
      }

      const verb = target.current ? 'PATCH ' : 'CREATE'
      console.log(`${verb} ${target.id}  ·  ${spec.label}  ·  ${result.changes.length} campo(s)`)
      for (const c of result.changes) {
        console.log(`   ${c.status.padEnd(7)} ${c.path}${VERBOSE ? `\n           ${short(c.before)}\n         → ${short(c.after)}` : ''}`)
      }

      if (!APPLY) continue
      try {
        if (!target.current) {
          await client.createIfNotExists(result.doc)
          totals.created++
        } else {
          await writePatch(target.id, result.doc, result.touched)
          if (target.isDraft) totals.draftsPatched++
          else totals.patched++
        }
      } catch (error) {
        totals.errors.push(`${target.id}: ${(error as Error).message}`)
      }
    }
  }

  // DELETE al final.
  for (const spec of docs.filter((d) => d.action === 'DELETE')) {
    if (!existing.has(spec.id)) {
      console.log(`DELETE ${spec.id}  ·  ya no existe, nada que hacer`)
      continue
    }
    console.log(`DELETE ${spec.id}  ·  ${spec.label}`)
    if (!APPLY) continue
    try {
      await client.delete(spec.id)
      totals.deleted++
    } catch (error) {
      totals.errors.push(`${spec.id} (DELETE): ${(error as Error).message}`)
    }
  }

  // Reporte
  const reportPath = resolve(`scripts/data/import-report-${APPLY ? 'apply' : 'dry-run'}.json`)
  mkdirSync(dirname(reportPath), {recursive: true})
  writeFileSync(reportPath, JSON.stringify({apply: APPLY, totals, pending}, null, 2))

  console.log('\n──────── Resumen ────────')
  if (APPLY) {
    console.log(`Creados: ${totals.created} · Editados: ${totals.patched} · Drafts editados: ${totals.draftsPatched} · Borrados: ${totals.deleted}`)
  }
  console.log(`Sin cambios: ${totals.unchanged}`)
  console.log(`Pendientes del equipo (REVIEW / NEEDS INPUT, no escritos): ${pending.length}`)
  console.log(`Reporte: ${reportPath}`)
  if (totals.errors.length) {
    console.log(`\n⚠️  ${totals.errors.length} error(es):`)
    totals.errors.forEach((e) => console.log(`   - ${e}`))
    process.exitCode = 1
  }
  if (!APPLY) console.log('\nTodo bien → correr de nuevo con `-- --apply` para escribir.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
