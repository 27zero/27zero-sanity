#!/usr/bin/env ts-node
/**
 * scripts/migrate-etapa5-c.ts
 *
 * One-off dataset migration for Etapa 5 — Sesión C (curación de fields de detalle).
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

async function main() {
  const tx = client.transaction()

  // ── Drafts obsoletos: contenido idéntico al publicado, sin ediciones
  //    reales pendientes — se descartan para que nadie vea una sombra
  //    vieja del shape anterior tras la migración de los publicados. ──
  tx.delete('drafts.18401da5-2a30-4ae7-b369-79c6545a0b93') // work: Anthology
  tx.delete('drafts.b11c00c6-e761-46c9-9267-09aeb3ee5c91') // work: Universidad de los Andes
  tx.delete('drafts.25a3990d-e01c-43fa-8b44-601b5376d27e') // edtechMentor: Laureano Diaz

  // ── work.challenge / work.description: blockContent plano → object ────
  const CHALLENGE_ANTHOLOGY = [
    {
      _key: '75f0ba710a29',
      _type: 'block',
      children: [
        {
          _key: '60bcbc01fb1b',
          _type: 'span',
          marks: [],
          text: 'The primary challenge was to unify multiple teams and stakeholders to visualize and understand the benefits of the project. Additionally, with only four months to schedule and eleven months to execute, the project required meticulous planning and coordination to ensure timely delivery and high-quality production.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ]

  const CHALLENGE_ANDES = [
    {
      _key: '134e3a05ec64',
      _type: 'block',
      children: [
        {
          _key: 'bd132815a813',
          _type: 'span',
          marks: [],
          text: 'Position Universidad de los Andes as a leading educational institution beyond its local network. Build a marketing campaign with aspirational animations and art pieces to promote cutting-edge programs, serving as a platform to showcase the university at the forefront of innovation and knowledge.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ]

  const DESCRIPTION_ANDES = [
    {
      _key: '433f40da7366',
      _type: 'block',
      children: [
        {
          _key: '5d88b1dc535d',
          _type: 'span',
          marks: [],
          text: 'global reach and influence, positioning Universidad de los Andes as a key player in shaping the future in various fields.',
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ]

  // 18401da5 — Anthology: solo challenge tenía contenido, description no
  tx.patch('18401da5-2a30-4ae7-b369-79c6545a0b93', (p) =>
    p.set({
      challenge: {
        challengeTitle: 'The Challenge',
        challengeContent: CHALLENGE_ANTHOLOGY,
      },
    })
  )

  // b11c00c6 — Universidad de los Andes: challenge Y description tenían contenido
  tx.patch('b11c00c6-e761-46c9-9267-09aeb3ee5c91', (p) =>
    p.set({
      challenge: {
        challengeTitle: 'The Challenge',
        challengeContent: CHALLENGE_ANDES,
      },
      description: {
        projectTitle: 'Project Content',
        projectContent: DESCRIPTION_ANDES,
      },
    })
  )

  // 337244ed — Busuu: ni challenge ni description tenían contenido, nada que migrar.

  // ── edtechMentor.excerpt → shortDescription (7 de 8 docs tenían excerpt;
  //    "Jose" — 6de86114 — no lo tenía seteado, se omite). ────────────────
  const MENTOR_EXCERPTS: {_id: string; excerpt: string}[] = [
    {_id: '1682c7ff-b315-447f-b31e-d9344fa735df', excerpt: "Thanks for having me. I'm delighted to be here, following in the footsteps of others connected to 1EdTech. "},
    {_id: '25a3990d-e01c-43fa-8b44-601b5376d27e', excerpt: 'Leads strategic thinking to ensure the work is smart, relevant, and delivers meaningful results.'},
    {_id: '5f92a854-e164-4b8c-bdc1-6b17d6fd9680', excerpt: 'Scott blevins'},
    {_id: '72581749-f28c-44d9-9110-e30036f700e7', excerpt: 'With an estimated 100 billion LTI transactions occurring annually'},
    {_id: '7b8ab4df-13ae-451b-81af-22621ed6e406', excerpt: 'carlos marquez'},
    {_id: 'JAcz1wRJdCJKn52cD28E9K', excerpt: "Ready Education’s CEO Jim Brigadier Explains How Authentic Leadership Fuels EdTech and Growth"},
    {_id: 'fff1a519-663b-4e0e-bdfb-a5f7638fcc51', excerpt: 'f'},
  ]
  for (const doc of MENTOR_EXCERPTS) {
    tx.patch(doc._id, (p) =>
      p.set({shortDescription: doc.excerpt}).unset(['excerpt'])
    )
  }

  // ── resource.featuredImage → cardThumbnail ──────────────────────────
  tx.patch('fa6bddaf-bb30-408e-b665-668d81c522b0', (p) =>
    p
      .set({
        cardThumbnail: {
          _type: 'image',
          alt: 'EdTech Marketing Agency',
          asset: {_type: 'reference', _ref: 'image-5341bf7b4bc6b600388e33afcd091c6138a4f653-1920x1080-jpg'},
        },
      })
      .unset(['featuredImage'])
  )

  const result = await tx.commit()
  console.log(`Committed ${result.results?.length ?? 0} mutations.`)
}

main().catch((e) => {
  console.error('MIGRATION FAILED:', e.message)
  process.exit(1)
})
