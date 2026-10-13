/**
 * scripts/lib/contentSpec.ts
 *
 * Parser + transformador del "27zero Site Content: Import Specification" (markdown).
 * Sin I/O ni cliente de Sanity: recibe el texto del spec y el documento actual, y
 * devuelve el documento nuevo. Así se puede probar offline y el script que escribe
 * (`import-content-spec.ts`) queda chico.
 *
 * Formato que se parsea (ver §1 del spec):
 *
 *   #### <label>
 *   `<_type>` | `_id`: `<_id>` | document action: **PATCH|CREATE|DELETE|REPORT**
 *   - **<field.path>** [STATUS]: <value>
 *     - was: …   ← ignorado
 *     - note: …  ← ignorado
 *
 * Solo se escriben FIX, STYLE, REPLACE, FILL y NEW. KEEP, REVIEW y NEEDS INPUT se
 * reportan y no se tocan: para aprobar un REVIEW, cambiar su status a FILL/REPLACE en
 * el .md antes de correr.
 */

export const WRITABLE = new Set(['FIX', 'STYLE', 'REPLACE', 'FILL', 'NEW'])

export type Action = 'PATCH' | 'CREATE' | 'DELETE' | 'REPORT'

export interface Row {
  path: string
  status: string
  value: string
  line: number
}

export interface SpecDoc {
  label: string
  type: string
  id: string
  action: Action
  rows: Row[]
}

type Json = any // eslint-disable-line @typescript-eslint/no-explicit-any

const HEADER_RE = /^`(\w+)` \| `_id`: `([^`]+)` \| document action: \*\*(\w+)\*\*/
const ROW_RE = /^- \*\*(.+?)\*\* \[([A-Z ]+)\](?::(.*))?$/

export function parseSpec(markdown: string): SpecDoc[] {
  const lines = markdown.split(/\r?\n/)
  const docs: SpecDoc[] = []
  let label = ''
  let current: SpecDoc | null = null

  lines.forEach((line, index) => {
    if (line.startsWith('#### ')) {
      label = line.slice(5).trim()
      current = null
      return
    }
    if (line.startsWith('## ')) {
      current = null
      return
    }
    const header = line.match(HEADER_RE)
    if (header) {
      current = {label, type: header[1], id: header[2], action: header[3] as Action, rows: []}
      docs.push(current)
      return
    }
    const row = line.match(ROW_RE)
    if (row && current) {
      current.rows.push({
        path: row[1].trim(),
        status: row[2].trim(),
        // `\n` literal en el spec = salto de línea real en el valor.
        value: (row[3] ?? '').trim().replace(/\\n/g, '\n'),
        line: index + 1,
      })
    }
  })

  return docs
}

/* ───────────────────────── Conocimiento del schema ───────────────────────── */

/** Campos `blockContent` (Portable Text): el valor plano se convierte a bloques. */
const PORTABLE_TEXT: Record<string, Set<string>> = {
  work: new Set(['challenge.challengeContent', 'communicationChallenge.content', 'solution.body']),
}

/** Arrays de referencias (el resto de las referencias son simples). */
const REFERENCE_ARRAYS: Record<string, Set<string>> = {
  work: new Set(['projectType']),
  edtechMarketingPractice: new Set(['relatedServices']),
}

/** `_type` de los miembros de arrays de objetos con nombre propio en el schema. */
const ARRAY_MEMBER_TYPES: Record<string, string> = {
  'edtechMarketingService.features': 'feature',
  'settings.navbarWorkDropdown.items': 'linkItem',
}

/** `_type` de objetos con tipo propio, cuando hay que crearlos desde cero. */
const OBJECT_TYPES: Record<string, string> = {
  slug: 'slug',
  seo: 'seo',
}

const BOOLEAN_FIELDS = new Set(['noIndex', 'isFeatured'])
const NUMBER_FIELDS = new Set(['year', 'order'])

/* ───────────────────────────── Utilidades ────────────────────────────────── */

let keySeed = 0
/** `_key` único para ítems nuevos de arrays (Sanity lo exige en arrays de objetos). */
export function newKey(): string {
  keySeed += 1
  return `spec${Date.now().toString(36).slice(-4)}${keySeed.toString(36)}`
}

export function toPortableText(text: string): Json[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: 'block',
      _key: newKey(),
      style: 'normal',
      markDefs: [],
      children: [{_type: 'span', _key: newKey(), text: paragraph, marks: []}],
    }))
}

type Segment = {key: string} | {index: number}

export function parsePath(path: string): Segment[] {
  const segments: Segment[] = []
  for (const part of path.split('.')) {
    const match = part.match(/^([^[\]]+)((?:\[\d+\])*)$/)
    if (!match) throw new Error(`Path no soportado: "${path}"`)
    segments.push({key: match[1]})
    for (const idx of match[2].matchAll(/\[(\d+)\]/g)) segments.push({index: Number(idx[1])})
  }
  return segments
}

/** Path del schema sin índices: `features[2].title` → `features.title`. */
const schemaPath = (path: string) => path.replace(/\[\d+\]/g, '')

/**
 * Escribe `value` en `doc` en `path`, creando objetos/arrays intermedios. `undefined`
 * borra la hoja. Un índice de array solo puede apuntar a un ítem existente o al
 * siguiente (append); un hueco es un error del spec, no se rellena.
 */
export function setPath(doc: Json, docType: string, path: string, value: Json): void {
  const segments = parsePath(path)
  let node = doc
  let keyPath = docType

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const last = i === segments.length - 1
    const next = segments[i + 1]

    if ('key' in seg) {
      keyPath += `.${seg.key}`
      if (last) {
        if (value === undefined) delete node[seg.key]
        else node[seg.key] = value
        return
      }
      if (node[seg.key] === undefined || node[seg.key] === null) {
        if ('index' in next) node[seg.key] = []
        else node[seg.key] = OBJECT_TYPES[seg.key] ? {_type: OBJECT_TYPES[seg.key]} : {}
      }
      node = node[seg.key]
    } else {
      if (!Array.isArray(node)) throw new Error(`"${path}": se esperaba un array`)
      if (seg.index > node.length) {
        throw new Error(`"${path}": índice ${seg.index} con solo ${node.length} ítems`)
      }
      if (seg.index === node.length) {
        const memberType = ARRAY_MEMBER_TYPES[schemaPath(keyPath)]
        node.push(last ? value : {_key: newKey(), ...(memberType ? {_type: memberType} : {})})
        if (last) return
      } else if (last) {
        if (value === undefined) node.splice(seg.index, 1)
        else node[seg.index] = value
        return
      }
      node = node[seg.index]
    }
  }
}

export function getPath(doc: Json, path: string): Json {
  let node = doc
  for (const seg of parsePath(path)) {
    if (node === undefined || node === null) return undefined
    node = 'key' in seg ? node[seg.key] : node[seg.index]
  }
  return node
}

/* ──────────────────────── Valor del spec → valor Sanity ─────────────────── */

export interface ConvertContext {
  /** Título de servicio → `_id` (para `relatedServices`). */
  serviceIdsByTitle: Map<string, string>
}

const ref = (id: string, inArray: boolean) =>
  inArray ? {_type: 'reference', _ref: id, _key: newKey()} : {_type: 'reference', _ref: id}

/**
 * Convierte un valor del spec al shape de Sanity. Devuelve `{merge}` cuando el valor
 * es un objeto parcial que se fusiona con el ítem existente (`contentSections[0]`).
 */
export function convertValue(
  docType: string,
  row: Row,
  ctx: ConvertContext,
): {value: Json} | {merge: Record<string, Json>} {
  const path = schemaPath(row.path)
  const leaf = path.split('.').pop() as string
  const raw = row.value

  if (REFERENCE_ARRAYS[docType]?.has(path)) {
    if (path === 'relatedServices') {
      const ids = raw.split('|').map((title) => {
        const id = ctx.serviceIdsByTitle.get(title.trim())
        if (!id) throw new Error(`relatedServices: servicio "${title.trim()}" no existe en el spec`)
        return ref(id, true)
      })
      return {value: ids}
    }
    const ids = [...raw.matchAll(/reference: ([\w.-]+)/g)].map((m) => ref(m[1], true))
    if (!ids.length) throw new Error(`${row.path}: no se encontró "reference: <id>"`)
    return {value: ids}
  }

  const single = raw.match(/^(?:.*\()?reference: ([\w.-]+)\)?$/)
  if (single) return {value: ref(single[1], false)}

  if (PORTABLE_TEXT[docType]?.has(path)) return {value: toPortableText(raw)}

  if (BOOLEAN_FIELDS.has(leaf)) {
    if (!/^(true|false)$/i.test(raw)) throw new Error(`${row.path}: booleano inválido "${raw}"`)
    return {value: raw.toLowerCase() === 'true'}
  }

  if (NUMBER_FIELDS.has(leaf)) {
    const n = Number(raw)
    if (Number.isNaN(n)) throw new Error(`${row.path}: número inválido "${raw}"`)
    return {value: n}
  }

  // Ítem de array de objetos escrito como "title: X | body: Y".
  if (/\[\d+\]$/.test(row.path) && /^\w+: /.test(raw)) {
    const merge: Record<string, Json> = {}
    for (const pair of raw.split(' | ')) {
      const m = pair.match(/^(\w+): ([\s\S]*)$/)
      if (!m) throw new Error(`${row.path}: par inválido "${pair}"`)
      merge[m[1]] = m[2].trim()
    }
    return {merge}
  }

  // REPLACE/FILL con valor vacío = vaciar el campo.
  if (raw === '') return {value: undefined}

  return {value: raw}
}

/* ─────────────────────────── Plan por documento ─────────────────────────── */

export interface Change {
  path: string
  status: string
  before: Json
  after: Json
}

export interface ApplyResult {
  doc: Json
  changes: Change[]
  /** Campos de primer nivel tocados: el script hace `set` de su valor completo. */
  touched: Set<string>
  errors: string[]
}

/**
 * Aplica las filas escribibles de `spec` sobre una copia de `current` (o un documento
 * vacío si es CREATE). Las imágenes y todo lo que el spec no menciona se conservan,
 * porque se parte del documento real, no del export `--no-assets`.
 */
export function applySpec(spec: SpecDoc, current: Json | null, ctx: ConvertContext): ApplyResult {
  const doc = current ? structuredClone(current) : {_id: spec.id, _type: spec.type}
  const changes: Change[] = []
  const touched = new Set<string>()
  const errors: string[] = []

  for (const row of spec.rows) {
    if (!WRITABLE.has(row.status)) continue
    if (row.path.includes(' / ') || row.path.startsWith('(')) continue // filas resumen

    try {
      const before = getPath(doc, row.path)
      const converted = convertValue(spec.type, row, ctx)
      let after: Json

      if ('merge' in converted) {
        const base = before && typeof before === 'object' ? before : {_key: newKey()}
        after = {...base, ...converted.merge}
      } else {
        after = converted.value
      }

      // Valores de solo texto ya iguales: no generar cambio.
      if (JSON.stringify(before) === JSON.stringify(after)) continue

      setPath(doc, spec.type, row.path, after)
      touched.add((parsePath(row.path)[0] as {key: string}).key)
      changes.push({path: row.path, status: row.status, before, after})
    } catch (error) {
      errors.push(`línea ${row.line}: ${(error as Error).message}`)
    }
  }

  return {doc, changes, touched, errors}
}

/** Título de servicio → `_id`, sacado del propio spec (header `[Categoría] Título`). */
export function serviceIndex(docs: SpecDoc[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const d of docs) {
    if (d.type !== 'edtechMarketingService' || d.action === 'DELETE') continue
    const title =
      d.rows.find((r) => r.path === 'title' && r.value)?.value ??
      d.label.replace(/^\[[^\]]+\]\s*/, '')
    map.set(title.trim(), d.id)
  }
  return map
}
