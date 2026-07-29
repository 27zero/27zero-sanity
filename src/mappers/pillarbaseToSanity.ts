/**
 * src/mappers/pillarbaseToSanity.ts
 *
 * Maps a PillarbaseArticle to a Sanity `post` document.
 *
 * Reuses the existing schemas WITHOUT modification:
 *   - post (schemaTypes/post.ts)
 *   - author (schemaTypes/author.ts)
 *   - category (schemaTypes/category.ts)
 *   - blockContent (schemaTypes/blockContent.ts)
 *
 * The mapper is a pure function — no API calls, no side effects.
 * Author/category/image references must be pre-resolved and passed in.
 */

import type {PillarbaseArticle} from '../integrations/pillarbaseMcp'
import {markdownToPortableText, htmlToPortableText} from '../utils/markdownToPortableText'
import type {PortableTextBlock} from '../utils/markdownToPortableText'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SanityRef {
  _type: 'reference'
  _ref: string
}

interface SanityImage {
  _type: 'image'
  asset: SanityRef
  alt?: string
}

interface SanitySlug {
  _type: 'slug'
  current: string
}

/**
 * A fully-mapped Sanity post document, ready to write.
 * All fields correspond exactly to schemaTypes/post.ts.
 */
export interface MappedPost {
  _type: 'post'
  /** Discriminates the post type — always 'blog' for Pillarbase imports */
  contentType: 'blog'
  title: string
  slug: SanitySlug
  excerpt?: string
  body?: PortableTextBlock[]
  mainImage?: SanityImage
  author?: SanityRef
  categories?: SanityRef[]
  publishedAt?: string
  featured: boolean
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
  /**
   * Tracks the Pillarbase source ID for idempotency.
   * Stored as a custom field on the post document.
   * NOTE: If post.ts doesn't have a _pillarbaseId field, add one or use
   * a GROQ query on title+slug for duplicate detection instead.
   */
  _pillarbaseId: string
}

/**
 * Pre-resolved Sanity reference IDs supplied by the caller.
 * The mapper never calls the Sanity API directly.
 */
export interface ResolvedRefs {
  authorId?: string
  /** pillarbase category name → sanity category _id */
  categoryIds?: Record<string, string>
  featuredImageAssetId?: string
  ogImageAssetId?: string
}

// ── Slug generation ───────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 96)
}

// ── Body conversion ───────────────────────────────────────────────────────────

function toPortableText(article: PillarbaseArticle): PortableTextBlock[] {
  if (!article.content?.trim()) return []
  if (article.content_format === 'html') return htmlToPortableText(article.content)
  return markdownToPortableText(article.content)
}

// ── Main mapper ───────────────────────────────────────────────────────────────

export function mapArticleToPost(
  article: PillarbaseArticle,
  refs: ResolvedRefs = {},
): MappedPost {
  const title = article.title?.trim()
  if (!title) throw new Error(`[Mapper] Article ${article.id} has no title`)

  const slugCurrent = article.slug?.trim()
    ? article.slug.trim().toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 96)
    : slugify(title)

  const excerpt = article.excerpt?.trim().slice(0, 300)
  const body = toPortableText(article)

  const mainImage: SanityImage | undefined = refs.featuredImageAssetId
    ? {_type: 'image', asset: {_type: 'reference', _ref: refs.featuredImageAssetId}, alt: title}
    : undefined

  const author: SanityRef | undefined = refs.authorId
    ? {_type: 'reference', _ref: refs.authorId}
    : undefined

  const categories: SanityRef[] = []
  if (article.categories && refs.categoryIds) {
    for (const cat of article.categories) {
      const ref = refs.categoryIds[cat.name?.trim()]
      if (ref) categories.push({_type: 'reference', _ref: ref})
    }
  }

  const ogImage: SanityImage | undefined = refs.ogImageAssetId
    ? {_type: 'image', asset: {_type: 'reference', _ref: refs.ogImageAssetId}}
    : undefined

  const doc: MappedPost = {
    _type: 'post',
    contentType: 'blog',
    title,
    slug: {_type: 'slug', current: slugCurrent},
    featured: article.featured ?? false,
    _pillarbaseId: article.id,
    publishedAt: article.published_at ?? article.created_at ?? new Date().toISOString(),
    ...(excerpt && {excerpt}),
    ...(body.length > 0 && {body}),
    ...(mainImage && {mainImage}),
    ...(author && {author}),
    ...(categories.length > 0 && {categories}),
    ...(article.seo?.title?.trim() && {seoTitle: article.seo.title.trim().slice(0, 70)}),
    ...(article.seo?.description?.trim() && {seoDescription: article.seo.description.trim().slice(0, 160)}),
    ...(ogImage && {ogImage}),
  }

  return doc
}
