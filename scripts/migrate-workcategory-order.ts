#!/usr/bin/env ts-node
/**
 * scripts/migrate-workcategory-order.ts
 *
 * One-off fix — asigna `order` a los 7 documentos existentes de `workCategory`,
 * según el orden del vanilla (mismo criterio que `SERVICE_CATEGORY_ORDER` en
 * 27zero-sitio, que también toma "orden del vanilla" como fuente de verdad para
 * esta taxonomía sin campo `order` previo).
 * Requires SANITY_API_TOKEN (Editor+) in .env.
 */

import 'dotenv/config'
import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// Orden de las pills de Work en el vanilla (dev/27zero-vanilla/work/index.html).
const WORK_CATEGORY_ORDER: string[] = [
  'ux-ui-web-design',
  'brand-messaging-strategy',
  'events',
  'content-marketing',
  'marketing-programs',
  'thought-leadership-programs',
  'strategic-services',
]

async function main() {
  const docs: {_id: string; slug: string}[] = await client.fetch(
    `*[_type == "workCategory"]{_id, "slug": slug.current}`
  )

  if (docs.length !== WORK_CATEGORY_ORDER.length) {
    throw new Error(
      `Expected ${WORK_CATEGORY_ORDER.length} workCategory docs, found ${docs.length}.`
    )
  }

  const tx = client.transaction()
  for (const doc of docs) {
    const order = WORK_CATEGORY_ORDER.indexOf(doc.slug)
    if (order === -1) {
      throw new Error(`Unrecognized workCategory slug: ${doc.slug}`)
    }
    tx.patch(doc._id, (p) => p.set({order}))
  }

  const result = await tx.commit()
  console.log(`Committed ${result.results?.length ?? 0} mutations.`)
}

main().catch((e) => {
  console.error('MIGRATION FAILED:', e.message)
  process.exit(1)
})
