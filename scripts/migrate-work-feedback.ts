/**
 * scripts/migrate-work-feedback.ts
 *
 * One-off — migración de contenido del feedback de Work / [slug] (sanity-changes-work.md).
 * Acompaña al cambio de schema que elimina `clientLogo`, `excerpt`, `brief`, `impact`,
 * `contributions`, `clientQuote` e `isFeatured` de `work`, y `logoLight` de `client`.
 *
 *   1. `work.briefParagraph` = `brief` + `excerpt` (Nota 6.4), como punto de partida
 *      para que el editor lo pula. Si el `excerpt` es solo un recorte del inicio del
 *      `brief` (pasa en el dataset real), se usa el `brief` solo para no duplicar texto.
 *   2. `work.isFeatured` → `workCategory.isFeaturedCategory` + `featuredWorks` (Nota 9):
 *      la categoría de cada `work` destacado pasa a ser destacada y lo lista, así no se
 *      pierde la selección actual.
 *   3. Se borran (`unset`) los fields eliminados del schema, para que el Studio no los
 *      muestre como "Unknown fields". Los assets de imagen quedan en la media library.
 *
 * No toca `work.description`: el documento que todavía lo tiene no está migrado.
 *
 * Idempotente: un documento que ya tiene `briefParagraph` no se reescribe.
 *
 * Uso (sesión del CLI, sin token en .env):
 *   npx sanity exec scripts/migrate-work-feedback.ts --with-user-token -- --dry-run
 *   npx sanity exec scripts/migrate-work-feedback.ts --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-08-15'})
const DRY_RUN = process.argv.includes('--dry-run')

const WORK_REMOVED_FIELDS = [
  'clientLogo',
  'excerpt',
  'brief',
  'impact',
  'contributions',
  'clientQuote',
  'isFeatured',
]

interface WorkDoc {
  _id: string
  title?: string
  brief?: string
  excerpt?: string
  briefParagraph?: string
  isFeatured?: boolean
  categoryId?: string
}

/** Colapsa espacios para comparar textos que solo difieren en saltos o espacios finales. */
const flatten = (text: string) => text.replace(/\s+/g, ' ').trim()

function toBriefParagraph(brief?: string, excerpt?: string): string | undefined {
  const b = brief?.trim()
  const e = excerpt?.trim()
  if (!b) return e || undefined
  if (!e || flatten(b).startsWith(flatten(e))) return b
  return `${b}\n\n${e}`
}

async function main() {
  const works: WorkDoc[] = await client.fetch(
    `*[_type == "work" && !(_id in path("drafts.**"))]{
      _id, title, brief, excerpt, briefParagraph, isFeatured, "categoryId": category._ref
    }`
  )

  const tx = client.transaction()

  for (const work of works) {
    const set: Record<string, unknown> = {}
    if (!work.briefParagraph) {
      const briefParagraph = toBriefParagraph(work.brief, work.excerpt)
      if (briefParagraph) set.briefParagraph = briefParagraph
    }

    console.log(`\n[work] ${work.title}`)
    if (set.briefParagraph) console.log(`  briefParagraph ←\n    ${String(set.briefParagraph).replace(/\n/g, '\n    ')}`)
    console.log(`  unset: ${WORK_REMOVED_FIELDS.join(', ')}`)

    tx.patch(work._id, (patch) => (Object.keys(set).length ? patch.set(set) : patch).unset(WORK_REMOVED_FIELDS))
  }

  // Nota 9 — la selección de destacados pasa de `work` a su categoría.
  const featuredByCategory = new Map<string, string[]>()
  for (const work of works.filter((w) => w.isFeatured && w.categoryId)) {
    const list = featuredByCategory.get(work.categoryId!) ?? []
    list.push(work._id)
    featuredByCategory.set(work.categoryId!, list)
  }

  for (const [categoryId, workIds] of featuredByCategory) {
    console.log(`\n[workCategory] ${categoryId} → isFeaturedCategory: true, featuredWorks: ${workIds.join(', ')}`)
    tx.patch(categoryId, (patch) =>
      patch
        .set({isFeaturedCategory: true})
        .setIfMissing({featuredWorks: []})
        .append(
          'featuredWorks',
          workIds.map((id) => ({_type: 'reference', _ref: id, _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}))
        )
    )
  }

  const clientsWithLogoLight: {_id: string; name?: string}[] = await client.fetch(
    `*[_type == "client" && defined(logoLight) && !(_id in path("drafts.**"))]{_id, name}`
  )
  for (const doc of clientsWithLogoLight) {
    console.log(`\n[client] ${doc.name} → unset logoLight`)
    tx.patch(doc._id, (patch) => patch.unset(['logoLight']))
  }

  if (DRY_RUN) {
    console.log('\nDRY RUN — nada se escribió.')
    return
  }

  const result = await tx.commit()
  console.log(`\nCommitted ${result.results?.length ?? 0} mutations.`)
}

main().catch((error) => {
  console.error('MIGRATION FAILED:', error.message)
  process.exit(1)
})
