/**
 * src/mappers/pillarbaseToSanity.ts
 *
 * Converts a PillarbasePost (from the Pillarbase API) into a Sanity post
 * document that matches the `post` schema defined in schemaTypes/post.ts.
 *
 * No external data fetching happens here.  Author and category references
 * are resolved by the Sanity service (services/sanity.ts) and passed in
 * as pre-resolved Sanity document IDs.
 */

import type {PillarbasePost} from '../integrations/pillarbase'
import {markdownToPortableText, htmlToPortableText} from '../utils/markdownToPortableText'
import type {PortableTextBlock} from '../utils/markdownToPortableText'

// ── Types ────────────────────────────────────────────────────────────────────

/** Sanity reference object */
interface SanityReference {
  _type: 'reference'
  _ref: string
}

/** Sanity image asset reference (after upload) */
interface SanityImageAsset {
  _type: 'image'
  asset: SanityReference
  alt?: string
  caption?: string
}

/** Slug object as Sanity expects it */
interface SanitySlug {
  _type: 'slug'
  current: string
}

/**
 * Mapped Sanity post document ready to be written via the Mutations API.
 *
 * Fields map directly to post.ts field names.
 * Fields left `undefined` are omitted from the mutation payload.
 */
export interface MappedSanityPost {
  _type: 'post'
  contentType: 'blog'
  title: string
  slug: SanitySlug
  excerpt?: string
  body?: PortableTextBlock[]
  mainImage?: SanityImageAsset
  author?: SanityReference
  categories?: SanityReference[]
  publishedAt?: string
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  /** ogImage asset reference — set after upload; undefined until then */
  ogImage?: SanityImageAsset
  /** Pillarbase source ID stored for idempotency checks */
  _pillarbaseId: string
}

/**
 * Pre-resolved reference IDs supplied by the Sanity service before calling
 * the mapper. The mapper never hits the Sanity API directly.
 */
export interface ResolvedRefs {
  /** Sanity document _id of the matched author (or undefined if not found) */
  authorId?: string
  /** Map from Pillarbase category name → Sanity category document _id */
  categoryIds?: Record<string, string>
  /** Sanity asset _id of the uploaded featured image (or undefined) */
  featuredImageAssetId?: string
  /** Sanity asset _id of the uploaded OG image (or undefined) */
  ogImageAssetId?: string
}

// ── Slug generation ───────────────────────────────────────────────────────────

/**
 * Generate a URL-safe slug from a title string.
 * Mirrors the behaviour of Sanity's built-in slug generator.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')                        // decompose accents
    .replace(/[\u0300-\u036f]/g, '')         // strip accent marks
    .replace(/[^a-z0-9\s-]/g, '')           // keep only alphanumeric, spaces, hyphens
    .trim()
    .replace(/[\s]+/g, '-')                  // spaces → hyphens
    .replace(/-+/g, '-')                     // collapse consecutive hyphens
    .slice(0, 96)                            // max 96 chars (post.ts validation)
}

// ── Body conversion ───────────────────────────────────────────────────────────

function convertBody(post: PillarbasePost): PortableTextBlock[] {
  if (!post.content?.trim()) return []

  if (post.content_format === 'html') {
    return htmlToPortableText(post.content)
  }
  // Default: treat as Markdown
  return markdownToPortableText(post.content)
}

// ── Main mapper ───────────────────────────────────────────────────────────────

/**
 * Map a PillarbasePost to a MappedSanityPost.
 *
 * @param post          Raw post data from the Pillarbase API
 * @param resolvedRefs  Author / category / image IDs resolved by services/sanity.ts
 * @returns             Document ready for Sanity's mutation API
 *
 * @example
 *   const mapped = mapPillarbasePost(pillarbasePost, {
 *     authorId: 'author-123',
 *     categoryIds: {'Marketing': 'cat-456'},
 *     featuredImageAssetId: 'image-789',
 *   })
 */
export function mapPillarbasePost(
  post: PillarbasePost,
  resolvedRefs: ResolvedRefs = {},
): MappedSanityPost {
  // ── Title ──────────────────────────────────────────────────────────────────
  const title = post.title?.trim()
  if (!title) throw new Error(`[Mapper] Post ${post.id} has no title.`)

  // ── Slug ───────────────────────────────────────────────────────────────────
  const slugCurrent = post.slug?.trim()
    ? post.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 96)
    : slugify(title)

  // ── Excerpt ────────────────────────────────────────────────────────────────
  // Truncate to 300 chars (post.ts validation rule)
  const excerpt = post.excerpt?.trim().slice(0, 300) || undefined

  // ── Body (Portable Text) ───────────────────────────────────────────────────
  const body = convertBody(post)

  // ── Featured image ─────────────────────────────────────────────────────────
  let mainImage: SanityImageAsset | undefined
  if (resolvedRefs.featuredImageAssetId) {
    mainImage = {
      _type: 'image',
      asset: {_type: 'reference', _ref: resolvedRefs.featuredImageAssetId},
      alt: title,
    }
  }

  // ── Author reference ───────────────────────────────────────────────────────
  const author: SanityReference | undefined = resolvedRefs.authorId
    ? {_type: 'reference', _ref: resolvedRefs.authorId}
    : undefined

  // ── Category references ────────────────────────────────────────────────────
  const categories: SanityReference[] = []
  if (post.categories && resolvedRefs.categoryIds) {
    for (const cat of post.categories) {
      const catName = cat.name?.trim()
      if (catName && resolvedRefs.categoryIds[catName]) {
        categories.push({_type: 'reference', _ref: resolvedRefs.categoryIds[catName]})
      }
    }
  }

  // ── Published date ─────────────────────────────────────────────────────────
  const publishedAt =
    post.published_at ?? post.created_at ?? new Date().toISOString()

  // ── SEO fields ─────────────────────────────────────────────────────────────
  const seoTitle = post.seo?.title?.trim().slice(0, 70) || undefined
  const seoDescription = post.seo?.description?.trim().slice(0, 160) || undefined

  // ── OG image ───────────────────────────────────────────────────────────────
  let ogImage: SanityImageAsset | undefined
  if (resolvedRefs.ogImageAssetId) {
    ogImage = {
      _type: 'image',
      asset: {_type: 'reference', _ref: resolvedRefs.ogImageAssetId},
    }
  }

  // ── Assemble document ──────────────────────────────────────────────────────
  const doc: MappedSanityPost = {
    _type: 'post',
    contentType: 'blog',
    title,
    slug: {_type: 'slug', current: slugCurrent},
    featured: post.featured ?? false,
    _pillarbaseId: post.id,
    publishedAt,
    ...(excerpt && {excerpt}),
    ...(body.length > 0 && {body}),
    ...(mainImage && {mainImage}),
    ...(author && {author}),
    ...(categories.length > 0 && {categories}),
    ...(seoTitle && {seoTitle}),
    ...(seoDescription && {seoDescription}),
    ...(ogImage && {ogImage}),
  }

  return doc
}

/**
 * Map multiple Pillarbase posts at once.
 * Posts that fail mapping are returned as Error objects (partial failure safe).
 */
export function mapPillarbasePosts(
  posts: PillarbasePost[],
  resolvedRefsMap: Record<string, ResolvedRefs> = {},
): Array<MappedSanityPost | Error> {
  return posts.map(post => {
    try {
      return mapPillarbasePost(post, resolvedRefsMap[post.id] ?? {})
    } catch (err) {
      return err instanceof Error ? err : new Error(String(err))
    }
  })
}
