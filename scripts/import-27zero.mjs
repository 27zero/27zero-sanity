// scripts/import-27zero.mjs
// Importa Services, Practices y Settings (grupo agency) de 27zero a Sanity.
//
// Correr desde la raíz del Studio:
//   npx sanity exec scripts/import-27zero.mjs --with-user-token -- --dry-run
//   npx sanity exec scripts/import-27zero.mjs --with-user-token
//
// Qué hace:
//  - Busca cada documento por slug. Si ya existe, lo actualiza; si no, lo crea.
//  - Usa patch.set, así que NO borra campos que no vienen en el JSON
//    (imágenes, proof points ya cargados, etc.).
//  - Orden: 1) 28 services  2) 9 practices (con referencias)  3) settings.

import { getCliClient } from 'sanity/cli'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const here = path.dirname(fileURLToPath(import.meta.url))
const dataFile =
  process.argv.find((a) => a.endsWith('.json')) || path.join(here, 'contenido-27zero.json')

const SERVICE_TYPE = 'edtechMarketingService'
const PRACTICE_TYPE = 'edtechMarketingPractice'
const SETTINGS_TYPE = 'settings'

const client = getCliClient({ apiVersion: '2024-01-01' })

// ---------------------------------------------------------------- utilidades

const keyFrom = (text, i) =>
  `${i}-${String(text || 'item')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`

const withKeys = (arr = []) => arr.map((obj, i) => ({ _key: keyFrom(obj.title, i), ...obj }))

// Convierte {agencyHero: {headline: 'x'}} en {'agencyHero.headline': 'x'}
// para no pisar campos hermanos (p. ej. la imagen del hero).
function flatten(obj, prefix = '') {
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, p))
    else out[p] = v
  }
  return out
}

async function findIdBySlug(type, slug) {
  return client.fetch(
    `*[_type == $type && slug.current == $slug && !(_id in path("drafts.**"))][0]._id`,
    { type, slug }
  )
}

const drafts = []
async function checkDraft(id) {
  const d = await client.fetch(`*[_id == $id][0]._id`, { id: `drafts.${id}` })
  if (d) drafts.push(d)
}

// ---------------------------------------------------------------- builders

function serviceFields(s) {
  const { slug, features, seo, ...rest } = s
  return {
    ...rest,
    slug: { _type: 'slug', current: slug },
    features: withKeys(features),
    ...(seo ? { seo } : {}),
  }
}

function practiceFields(p, serviceIdBySlug) {
  const { slug, relatedServices = [], practiceScopes, seo, ...rest } = p
  const fields = {
    ...rest,
    slug: { _type: 'slug', current: slug },
    relatedServices: relatedServices.map((s, i) => {
      const ref = serviceIdBySlug[s]
      if (!ref) throw new Error(`Practice "${slug}": no se encontró el service "${s}"`)
      return { _key: keyFrom(s, i), _type: 'reference', _ref: ref }
    }),
    ...(seo ? { seo } : {}),
  }
  if (practiceScopes) fields.practiceScopes = withKeys(practiceScopes)
  return fields
}

// ---------------------------------------------------------------- upsert

async function upsert(type, slug, fields) {
  const existing = await findIdBySlug(type, slug)
  const id = existing || `${type}-${slug}`
  await checkDraft(id)
  return { id, isNew: !existing, fields }
}

async function commit(label, items, type) {
  if (DRY_RUN) {
    console.log(`\n[dry-run] ${label}:`)
    items.forEach((it) => console.log(`  ${it.isNew ? '+ crear  ' : '~ update '} ${it.id}`))
    return
  }
  const tx = client.transaction()
  for (const it of items) {
    tx.createIfNotExists({ _id: it.id, _type: type })
    tx.patch(it.id, (p) => p.set(it.fields))
  }
  await tx.commit({ autoGenerateArrayKeys: true })
  console.log(`✔ ${label}: ${items.length} documento(s)`)
}

// ---------------------------------------------------------------- main

async function main() {
  const data = JSON.parse(await readFile(dataFile, 'utf8'))
  const { projectId, dataset } = client.config()
  console.log(`Proyecto ${projectId} · dataset ${dataset}${DRY_RUN ? ' · DRY RUN' : ''}`)

  // 1) Services
  const serviceItems = []
  for (const s of data.services) serviceItems.push(await upsert(SERVICE_TYPE, s.slug, serviceFields(s)))
  await commit('Services', serviceItems, SERVICE_TYPE)

  const serviceIdBySlug = Object.fromEntries(data.services.map((s, i) => [s.slug, serviceItems[i].id]))

  // 2) Practices
  const practiceItems = []
  for (const p of data.practices)
    practiceItems.push(await upsert(PRACTICE_TYPE, p.slug, practiceFields(p, serviceIdBySlug)))
  await commit('Practices', practiceItems, PRACTICE_TYPE)

  // 3) Settings (singleton)
  const settingsId = (await client.fetch(`*[_type == $t && !(_id in path("drafts.**"))][0]._id`, { t: SETTINGS_TYPE })) || 'settings'
  await checkDraft(settingsId)
  await commit('Settings', [{ id: settingsId, isNew: false, fields: flatten(data.settings) }], SETTINGS_TYPE)

  if (drafts.length) {
    console.log(`\n⚠ Estos documentos tienen un borrador abierto en el Studio, que se muestra por encima de lo publicado.`)
    console.log(`  Revísalos y descarta o publica el borrador:`)
    drafts.forEach((d) => console.log(`  - ${d}`))
  }
  console.log(DRY_RUN ? '\nNada fue enviado. Quita --dry-run para importar.' : '\nListo.')
}

main().catch((err) => {
  console.error('\n✖ Error:', err.message)
  process.exit(1)
})
