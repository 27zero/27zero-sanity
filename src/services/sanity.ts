/**
 * src/services/sanity.ts
 *
 * Sanity Content Lake service.
 *
 * Responsibilities
 * ─────────────────
 * - Create and update `post` documents
 * - Upload images (returns asset _id for the mapper)
 * - Publish documents (set _id without `drafts.` prefix)
 * - Resolve author and category references by name
 * - Check for existing imports (idempotency via _pillarbaseId)
 *
 * Configuration
 * ─────────────
 * Reads from environment variables:
 *
 *   SANITY_PROJECT_ID   — Sanity project ID (also in sanity.config.ts)
 *   SANITY_DATASET      — e.g. 'production'
 *   SANITY_API_TOKEN    — token with write access (Editor or above)
 *
 * The values in sanity.config.ts (projectId / dataset) are intentionally
 * NOT imported here so this module works as a standalone script too.
 */

import {createClient, type SanityClient} from '@sanity/client'
import type {MappedSanityPost} from '../mappers/pillarbaseToSanity'

// ── Client factory ────────────────────────────────────────────────────────────

let _client: SanityClient | null = null

/**
 * Returns a singleton Sanity client configured from environment variables.
 * Throws if required variables are missing.
 */
export function getSanityClient(): SanityClient {
  if (_client) return _client

  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const token = process.env.SANITY_API_TOKEN

  if (!projectId) throw new Error('[Sanity] SANITY_PROJECT_ID is not set in environment.')
  if (!dataset) throw new Error('[Sanity] SANITY_DATASET is not set in environment.')
  if (!token) throw new Error('[Sanity] SANITY_API_TOKEN is not set in environment.')

  _client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',  // pin to a stable API date
    useCdn: false,              // always bypass CDN for writes
  })

  return _client
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface UploadImageResult {
  assetId: string
  url: string
}

export interface UpsertResult {
  sanityId: string
  isNew: boolean
  slug: string
}

// ── Image upload ──────────────────────────────────────────────────────────────

/**
 * Download an image from a URL and upload it to Sanity's asset store.
 *
 * Returns the Sanity asset document _id (e.g. "image-abc123-800x600-jpg").
 * Call this before mapping so the mapper can embed the asset reference.
 *
 * @param imageUrl    Public URL of the image to upload
 * @param filename    Hint for the asset filename (e.g. 'featured-image.jpg')
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  filename = 'image.jpg',
): Promise<UploadImageResult> {
  const client = getSanityClient()

  // Fetch the image bytes
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(
      `[Sanity] Failed to download image from ${imageUrl}: HTTP ${response.status}`,
    )
  }

  const buffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') ?? 'image/jpeg'

  const asset = await client.assets.upload('image', Buffer.from(buffer), {
    filename,
    contentType,
  })

  return {assetId: asset._id, url: asset.url}
}

// ── Idempotency helpers ───────────────────────────────────────────────────────

/**
 * Look up an existing Sanity post by its Pillarbase source ID.
 *
 * The `_pillarbaseId` field is stored on the document specifically for this.
 * Returns the Sanity document `_id` if found, `null` otherwise.
 */
export async function findByPillarbaseId(pillarbaseId: string): Promise<string | null> {
  const client = getSanityClient()

  // Search both published and draft documents
  const result = await client.fetch<Array<{_id: string}>>(
    `*[_type == "post" && _pillarbaseId == $id][0]{_id}`,
    {id: pillarbaseId},
  )

  return result?._id ?? null
}

// ── Author & category resolution ─────────────────────────────────────────────

/**
 * Find a Sanity author document by exact name match.
 * Returns the Sanity _id or null if not found.
 */
export async function findAuthorByName(name: string): Promise<string | null> {
  const client = getSanityClient()
  const result = await client.fetch<{_id: string} | null>(
    `*[_type == "author" && name == $name][0]{_id}`,
    {name},
  )
  return result?._id ?? null
}

/**
 * Find Sanity category documents by title.
 * Returns a map of { categoryTitle → sanityId } for found categories.
 */
export async function findCategoriesByTitles(
  titles: string[],
): Promise<Record<string, string>> {
  if (titles.length === 0) return {}

  const client = getSanityClient()
  const results = await client.fetch<Array<{_id: string; title: string}>>(
    `*[_type == "category" && title in $titles]{_id, title}`,
    {titles},
  )

  return Object.fromEntries(results.map(r => [r.title, r._id]))
}

/**
 * Find or create a category by title.
 *
 * Use this when you want Pillarbase categories to automatically appear in
 * Sanity even if they don't exist yet. Set `createIfMissing = false` to
 * silently skip unknown categories instead.
 */
export async function findOrCreateCategory(
  title: string,
  createIfMissing = true,
): Promise<string | null> {
  const client = getSanityClient()

  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "category" && title == $title][0]{_id}`,
    {title},
  )

  if (existing) return existing._id
  if (!createIfMissing) return null

  const slugCurrent = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  const created = await client.create({
    _type: 'category',
    title,
    slug: {_type: 'slug', current: slugCurrent},
  })

  console.log(`[Sanity] Created category "${title}" → ${created._id}`)
  return created._id
}

// ── Document write ────────────────────────────────────────────────────────────

/**
 * Create a new post as a DRAFT in Sanity.
 *
 * Returns the new document _id (e.g. "drafts.abc123").
 */
export async function createPost(doc: MappedSanityPost): Promise<string> {
  const client = getSanityClient()

  // Remove internal tracking field before writing (_pillarbaseId is stored as a
  // custom field — ensure post.ts allows unknown fields OR add it to the schema.
  // It is stored as a plain string field for idempotency.)
  const result = await client.create({
    ...doc,
    // Sanity will auto-generate _id; doc lives in drafts until published
  })

  console.log(`[Sanity] Created draft post "${doc.title}" → ${result._id}`)
  return result._id
}

/**
 * Update an existing post document (patch strategy: replace all mapped fields).
 *
 * @param sanityId    The existing document _id (may be a drafts.* id)
 * @param doc         Updated mapped document
 */
export async function updatePost(sanityId: string, doc: MappedSanityPost): Promise<void> {
  const client = getSanityClient()

  // Destructure to omit _type (can't patch the type) and build a clean patch set
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {_type, _pillarbaseId, ...patchFields} = doc

  await client.patch(sanityId).set(patchFields).commit()
  console.log(`[Sanity] Updated post "${doc.title}" → ${sanityId}`)
}

/**
 * Create or update a post based on whether a document with this Pillarbase ID
 * already exists.  This is the main idempotent upsert operation.
 *
 * @returns UpsertResult with the Sanity _id, whether it was newly created, and the slug.
 */
export async function upsertPost(doc: MappedSanityPost): Promise<UpsertResult> {
  const existing = await findByPillarbaseId(doc._pillarbaseId)

  if (existing) {
    await updatePost(existing, doc)
    return {sanityId: existing, isNew: false, slug: doc.slug.current}
  }

  const newId = await createPost(doc)
  return {sanityId: newId, isNew: true, slug: doc.slug.current}
}

/**
 * Publish a document — moves it from `drafts.*` to the published namespace.
 *
 * @param draftId    Document _id (with or without the "drafts." prefix)
 */
export async function publishDocument(draftId: string): Promise<void> {
  const client = getSanityClient()

  // Derive both IDs
  const id = draftId.replace(/^drafts\./, '')
  const draftDocId = `drafts.${id}`

  // Fetch the draft
  const draft = await client.getDocument(draftDocId)
  if (!draft) {
    throw new Error(`[Sanity] Cannot publish: draft not found for id "${draftDocId}"`)
  }

  // Publish via transaction: create (or replace) the published doc, delete draft
  await client
    .transaction()
    .createOrReplace({...draft, _id: id})
    .delete(draftDocId)
    .commit()

  console.log(`[Sanity] Published document → ${id}`)
}
