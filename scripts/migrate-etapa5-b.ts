#!/usr/bin/env ts-node
/**
 * scripts/migrate-etapa5-b.ts
 *
 * One-off dataset migration for Etapa 5 — Sesión B.
 * ALREADY RUN AGAINST PRODUCTION on 2026-08-19 — kept as a record of what
 * changed. Re-running will fail: it tries to `create` documents (client-*,
 * workCategory-*, edtechMarketingPractice-*) with ids that already exist.
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

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function main() {
  // ── Phase 0: deletes first, own commit ───────────────────────────────
  // Sanity validates "_type is immutable" against server state, not against
  // earlier mutations in the same transaction — so a delete+create pair
  // reusing the same _id must land in separate commits.
  const delTx = client.transaction()
  delTx.delete('af31f680-bac9-4026-a35f-1f10119e4f82') // practice "Jon Aleckson"
  delTx.delete('400bedbb-2b4d-4dea-ba99-0d9b9a427072') // teamMember Junior Gomez
  delTx.delete('609302af-bca5-4412-9213-0dd41205490c') // category "Marketing Programs"
  await delTx.commit()
  console.log('Phase 0 (deletes) committed.')

  const tx = client.transaction()

  // ── 1/2. practice → edtechMarketingPractice ────────────────────────────
  // Create the 3 real practices (title only); stray doc already deleted above.
  const PRACTICES = ['Customer Marketing', 'Granular Marketing Programs', 'Agile Brand Development']
  for (const title of PRACTICES) {
    tx.create({
      _id: `edtechMarketingPractice-${slugify(title)}`,
      _type: 'edtechMarketingPractice',
      title,
      slug: {_type: 'slug', current: slugify(title)},
    })
  }

  // ── 3. resource: heroDescription → description ─────────────────────────
  tx.patch('fa6bddaf-bb30-408e-b665-668d81c522b0', (p) =>
    p
      .set({
        description:
          'Education technology is transforming how learners, educators, and institutions engage with knowledge. But in a sector defined by rapid innovation and complex decision-making, even the most groundbreaking EdTech solutions can struggle to gain traction. Success requires more than a compelling product—it calls for a marketing approach grounded in deep sector expertise, agile content operations, and bold creative thinking. This article unpacks what sets an Edtech Marketing Agency apart, how these agencies deliver measurable results, and why specialized support is essential for education brands determined to accelerate their growth and impact.',
      })
      .unset(['heroDescription'])
  )

  // ── 4. teamMember → team (same _id, deleted in Phase 0) ─────────────────
  tx.create({
    _id: '400bedbb-2b4d-4dea-ba99-0d9b9a427072',
    _type: 'team',
    name: 'Junior Gomez',
    role: 'Marketing Technology Specialist ',
    isActive: true,
    order: 10,
    photo: {
      _type: 'image',
      asset: {_type: 'reference', _ref: 'image-5cae9beca08e97fbb6b803ebee3f1a0f9f90533c-474x711-webp'},
    },
  })

  // ── 6. category → workCategory (reuse existing "Marketing Programs",
  //      deleted in Phase 0) ───────────────────────────────────────────
  const MARKETING_PROGRAMS_ID = '609302af-bca5-4412-9213-0dd41205490c'
  tx.create({
    _id: MARKETING_PROGRAMS_ID,
    _type: 'workCategory',
    title: 'Marketing Programs',
    slug: {_type: 'slug', current: 'marketing-programs'},
    description:
      'Success hinges on understanding your audience, market dynamics, and unique selling points. From innovative campaign concepts to compelling visuals and storytelling, we design marketing programs that resonate with your audience, elevate brand identity, and drive tangible results.',
    color: '#4b3df2',
  })

  // 7 new workCategory docs (workByCategory.ts mock — 8 total incl. reused one above)
  const NEW_WORK_CATEGORIES = [
    'Los mejores',
    'Ux/Ui & Web Design',
    'Brand & Messaging Strategy',
    'Events',
    'Content Marketing',
    'Thought Leadership Programs',
    'Strategic Services',
  ]
  const workCategoryIds: Record<string, string> = {'Marketing Programs': MARKETING_PROGRAMS_ID}
  for (const title of NEW_WORK_CATEGORIES) {
    const id = `workCategory-${slugify(title)}`
    workCategoryIds[title] = id
    tx.create({
      _id: id,
      _type: 'workCategory',
      title,
      slug: {_type: 'slug', current: slugify(title)},
    })
  }

  // ── 5. client docs: 3 real (used by work) + 8 from mock (Doctums exists) ─
  const DOCTUMS_ID = '942bbfc1-2e1c-4379-8916-bee259f33679'
  const NEW_CLIENTS = [
    'Anthology',
    'Busuu',
    'Universidad de los Andes',
    'Skillwell',
    'Student First',
    'WQL',
    'OES',
    'IEE',
    'D2L',
    'Scholarship Magic',
  ]
  const clientIds: Record<string, string> = {Doctums: DOCTUMS_ID}
  for (const name of NEW_CLIENTS) {
    const id = `client-${slugify(name)}`
    clientIds[name] = id
    tx.create({_id: id, _type: 'client', name})
  }

  // ── 5+6. work: client string → reference, category string → reference ──
  // 18401da5 — Anthology / marketing-programs → matches "Marketing Programs"
  tx.patch('18401da5-2a30-4ae7-b369-79c6545a0b93', (p) =>
    p
      .set({
        client: {_type: 'reference', _ref: clientIds['Anthology']},
        category: {_type: 'reference', _ref: workCategoryIds['Marketing Programs']},
      })
      .unset(['testimonial'])
  )
  // 337244ed — Busuu / customer-spotlights → NO 1:1 match in new 8 categories, leave unassigned
  tx.patch('337244ed-ba6a-4c5e-8fa9-59f6305a13ae', (p) =>
    p
      .set({client: {_type: 'reference', _ref: clientIds['Busuu']}})
      .unset(['testimonial', 'category'])
  )
  // b11c00c6 — Universidad de los Andes / marketing-programs → matches "Marketing Programs"
  tx.patch('b11c00c6-e761-46c9-9267-09aeb3ee5c91', (p) =>
    p
      .set({
        client: {_type: 'reference', _ref: clientIds['Universidad de los Andes']},
        category: {_type: 'reference', _ref: workCategoryIds['Marketing Programs']},
      })
      .unset(['testimonial'])
  )

  // ── 8. edtechMentor: series → interviewCategory, fix "essencial" typo ───
  const SERIES_FIX: Record<string, string> = {essencial: 'essential', investor: 'investor', founders: 'founders'}
  const mentorDocs: {_id: string; series: string}[] = [
    {_id: '1682c7ff-b315-447f-b31e-d9344fa735df', series: 'investor'},
    {_id: '25a3990d-e01c-43fa-8b44-601b5376d27e', series: 'founders'},
    {_id: '5f92a854-e164-4b8c-bdc1-6b17d6fd9680', series: 'essencial'},
    {_id: '6de86114-5208-482e-8ba7-75bb78a26adb', series: 'essencial'},
    {_id: '72581749-f28c-44d9-9110-e30036f700e7', series: 'investor'},
    {_id: '7b8ab4df-13ae-451b-81af-22621ed6e406', series: 'essencial'},
    {_id: 'fff1a519-663b-4e0e-bdfb-a5f7638fcc51', series: 'investor'},
  ]
  for (const doc of mentorDocs) {
    tx.patch(doc._id, (p) =>
      p.set({interviewCategory: SERIES_FIX[doc.series]}).unset(['series'])
    )
  }

  const result = await tx.commit()
  console.log(`Committed ${result.results?.length ?? 0} mutations.`)
  console.log('client IDs:', clientIds)
  console.log('workCategory IDs:', workCategoryIds)
}

main().catch((e) => {
  console.error('MIGRATION FAILED:', e.message)
  process.exit(1)
})
