/**
 * src/importPost.ts
 *
 * Orchestrator: fetches one post from Pillarbase, maps it, and upserts it
 * into Sanity.  Used by both the CLI script and the Studio custom tool.
 *
 * Flow
 * ────
 *   1. Fetch the post from Pillarbase
 *   2. Upload featured image to Sanity (if present)
 *   3. Resolve author & category references
 *   4. Map PillarbasePost → MappedSanityPost
 *   5. Upsert into Sanity (create if new, update if exists)
 *   6. Optionally publish the document
 */

import {getPost} from './integrations/pillarbase'
import type {PillarbasePost} from './integrations/pillarbase'
import {mapPillarbasePost} from './mappers/pillarbaseToSanity'
import type {ResolvedRefs} from './mappers/pillarbaseToSanity'
import {
  uploadImageFromUrl,
  findAuthorByName,
  findOrCreateCategory,
  upsertPost,
  publishDocument,
} from './services/sanity'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ImportOptions {
  /** Pillarbase post ID to import */
  pillarbaseId: string
  /**
   * If true, immediately publish the document after creating/updating it.
   * If false (default), the document is left as a draft for editorial review.
   */
  publishImmediately?: boolean
  /**
   * If true, Pillarbase categories that don't exist in Sanity will be
   * created automatically.  Defaults to true.
   */
  createMissingCategories?: boolean
}

export interface ImportResult {
  success: true
  sanityId: string
  slug: string
  isNew: boolean
  published: boolean
  title: string
}

export interface ImportError {
  success: false
  pillarbaseId: string
  error: string
}

export type ImportOutcome = ImportResult | ImportError

/**
 * Import a single post from Pillarbase into Sanity.
 *
 * @example
 *   const result = await importPost({
 *     pillarbaseId: 'abc123',
 *     publishImmediately: false,
 *   })
 *   if (result.success) console.log('Imported:', result.slug)
 *   else console.error('Failed:', result.error)
 */
export async function importPost(options: ImportOptions): Promise<ImportOutcome> {
  const {
    pillarbaseId,
    publishImmediately = false,
    createMissingCategories = true,
  } = options

  try {
    // ── 1. Fetch from Pillarbase ─────────────────────────────────────────────
    console.log(`[Import] Fetching post ${pillarbaseId} from Pillarbase…`)
    const post: PillarbasePost = await getPost(pillarbaseId)

    // ── 2. Upload images ─────────────────────────────────────────────────────
    const refs: ResolvedRefs = {}

    if (post.featured_image_url) {
      try {
        console.log(`[Import] Uploading featured image…`)
        const {assetId} = await uploadImageFromUrl(
          post.featured_image_url,
          `${post.slug ?? post.id}-featured.jpg`,
        )
        refs.featuredImageAssetId = assetId
      } catch (err) {
        // Non-fatal: log and continue without the image
        console.warn(`[Import] Could not upload featured image: ${String(err)}`)
      }
    }

    if (post.seo?.og_image_url && post.seo.og_image_url !== post.featured_image_url) {
      try {
        console.log(`[Import] Uploading OG image…`)
        const {assetId} = await uploadImageFromUrl(
          post.seo.og_image_url,
          `${post.slug ?? post.id}-og.jpg`,
        )
        refs.ogImageAssetId = assetId
      } catch (err) {
        console.warn(`[Import] Could not upload OG image: ${String(err)}`)
      }
    }

    // ── 3. Resolve author ────────────────────────────────────────────────────
    if (post.author?.name) {
      const authorId = await findAuthorByName(post.author.name)
      if (authorId) {
        refs.authorId = authorId
      } else {
        console.warn(
          `[Import] Author "${post.author.name}" not found in Sanity. ` +
          `Create an author document in Studio and re-import to link it.`,
        )
      }
    }

    // ── 4. Resolve categories ────────────────────────────────────────────────
    if (post.categories && post.categories.length > 0) {
      refs.categoryIds = {}
      for (const cat of post.categories) {
        if (!cat.name?.trim()) continue
        const catId = await findOrCreateCategory(cat.name.trim(), createMissingCategories)
        if (catId) {
          refs.categoryIds[cat.name.trim()] = catId
        }
      }
    }

    // ── 5. Map ───────────────────────────────────────────────────────────────
    console.log(`[Import] Mapping post "${post.title}"…`)
    const mapped = mapPillarbasePost(post, refs)

    // ── 6. Upsert ────────────────────────────────────────────────────────────
    const {sanityId, isNew, slug} = await upsertPost(mapped)

    // ── 7. Optionally publish ────────────────────────────────────────────────
    if (publishImmediately) {
      console.log(`[Import] Publishing document ${sanityId}…`)
      await publishDocument(sanityId)
    }

    console.log(
      `[Import] ✅ ${isNew ? 'Created' : 'Updated'} "${post.title}" ` +
      `(slug: ${slug}) ${publishImmediately ? '— published' : '— left as draft'}`,
    )

    return {
      success: true,
      sanityId,
      slug,
      isNew,
      published: publishImmediately,
      title: post.title,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`[Import] ❌ Failed to import post ${pillarbaseId}: ${message}`)
    return {success: false, pillarbaseId, error: message}
  }
}

/**
 * Import multiple posts from Pillarbase in sequence.
 *
 * Sequential (not parallel) to avoid overwhelming the Sanity API rate limits.
 * Returns an array of outcomes in the same order as `pillarbaseIds`.
 */
export async function importPosts(
  pillarbaseIds: string[],
  options: Omit<ImportOptions, 'pillarbaseId'> = {},
): Promise<ImportOutcome[]> {
  const results: ImportOutcome[] = []

  for (const id of pillarbaseIds) {
    const outcome = await importPost({...options, pillarbaseId: id})
    results.push(outcome)
  }

  return results
}
