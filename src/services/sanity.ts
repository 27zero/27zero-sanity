/**
 * src/services/sanity.ts
 *
 * Sanity Content Lake operations for the Pillarbase importer.
 * Uses @sanity/client (already available in the project via the 'sanity' package).
 *
 * All writes go to Sanity's draft namespace first.
 * publishDocument() moves a draft to the published namespace.
 */

import {createClient, type SanityClient} from '@sanity/client'
import type {MappedPost} from '../mappers/pillarbaseToSanity'

// ── Client ────────────────────────────────────────────────────────────────────

let _client: SanityClient | null = null

export function getSanityClient(): SanityClient {
  if (_client) return _client

  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN

  if (!projectId) throw new Error('[Sanity] SANITY_PROJECT_ID missing from environment')
  if (!dataset) throw new Error('[Sanity] SANITY_DATASET missing from environment')
  if (!token) throw new Error('[Sanity] SANITY_API_TOKEN missing from environment')

  _client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
  })
  return _client
}

// ── Idempotency ───────────────────────────────────────────────────────────────

/**
 * Find an existing post by its Pillarbase source ID.
 * Returns the Sanity _id or null.
 */
export async function findByPillarbaseId(
  client: SanityClient,
  pillarbaseId: string,
): Promise<string | null> {
  const result = await client.fetch<{_id: string} | null>(
    `*[_type == "post" && _pillarbaseId == $id][0]{_id}`,
    {id: pillarbaseId},
  )
  return result?._id ?? null
}

// ── Reference resolution ──────────────────────────────────────────────────────

export async function findAuthorByName(
  client: SanityClient,
  name: string,
): Promise<string | null> {
  const r = await client.fetch<{_id: string} | null>(
    `*[_type == "author" && name == $name][0]{_id}`,
    {name},
  )
  return r?._id ?? null
}

export async function findOrCreateCategory(
  client: SanityClient,
  title: string,
): Promise<string> {
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "category" && title == $title][0]{_id}`,
    {title},
  )
  if (existing) return existing._id

  const slugCurrent = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-')
  const created = await client.create({
    _type: 'category',
    title,
    slug: {_type: 'slug', current: slugCurrent},
  })
  return created._id
}

// ── Image upload ──────────────────────────────────────────────────────────────

export async function uploadImageFromUrl(
  client: SanityClient,
  imageUrl: string,
  filename = 'image.jpg',
): Promise<string> {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to download image: HTTP ${response.status}`)

  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') ?? 'image/jpeg'

  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename,
    contentType,
  })
  return asset._id
}

// ── Document write ────────────────────────────────────────────────────────────

export interface UpsertResult {
  sanityId: string
  isNew: boolean
  slug: string
}

export async function upsertPost(
  client: SanityClient,
  doc: MappedPost,
): Promise<UpsertResult> {
  const existing = await findByPillarbaseId(client, doc._pillarbaseId)

  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_type, _pillarbaseId, ...patch} = doc
    await client.patch(existing).set(patch).commit()
    return {sanityId: existing, isNew: false, slug: doc.slug.current}
  }

  const created = await client.create(doc)
  return {sanityId: created._id, isNew: true, slug: doc.slug.current}
}

export async function publishDocument(
  client: SanityClient,
  draftId: string,
): Promise<void> {
  const id = draftId.replace(/^drafts\./, '')
  const draftDocId = `drafts.${id}`
  const draft = await client.getDocument(draftDocId)
  if (!draft) throw new Error(`[Sanity] Draft not found: ${draftDocId}`)
  await client.transaction().createOrReplace({...draft, _id: id}).delete(draftDocId).commit()
}
