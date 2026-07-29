/**
 * src/integrations/pillarbase.ts
 *
 * Integration layer for the Pillarbase API.
 *
 * Responsibilities
 * ─────────────────
 * - Authenticate with Pillarbase using an API key
 * - Fetch a list of available blog posts
 * - Fetch a single post by ID
 * - Publish / trigger post generation on Pillarbase
 *
 * Configuration
 * ─────────────
 * Reads exclusively from environment variables.  Never hardcode values here.
 *
 *   PILLARBASE_API_URL  — Base URL of the Pillarbase API (no trailing slash)
 *   PILLARBASE_API_KEY  — API key issued by Pillarbase
 *
 * Usage (CLI or Studio tool)
 * ──────────────────────────
 *   import { getPosts, getPost } from '../integrations/pillarbase'
 *
 *   const posts  = await getPosts()
 *   const single = await getPost('abc123')
 */

// ── Types ────────────────────────────────────────────────────────────────────

/** Author shape returned by Pillarbase */
export interface PillarbaseAuthor {
  id: string
  name: string
  email?: string
  avatar_url?: string
  bio?: string
}

/** Category / tag shape returned by Pillarbase */
export interface PillarbaseCategory {
  id: string
  name: string
  slug?: string
}

/** SEO metadata shape returned by Pillarbase */
export interface PillarbaseSeo {
  title?: string
  description?: string
  og_image_url?: string
}

/**
 * A blog post as returned by the Pillarbase API.
 *
 * Fields marked `?` are optional — the mapper handles missing values gracefully.
 * Adjust field names here if the real Pillarbase response differs.
 */
export interface PillarbasePost {
  id: string
  title: string
  slug?: string
  excerpt?: string
  /** Post body as Markdown or HTML — the converter in utils/markdownToPortableText handles both */
  content: string
  /** 'markdown' | 'html' — defaults to 'markdown' if absent */
  content_format?: 'markdown' | 'html'
  featured_image_url?: string
  author?: PillarbaseAuthor
  categories?: PillarbaseCategory[]
  published_at?: string       // ISO-8601
  created_at?: string         // ISO-8601
  updated_at?: string         // ISO-8601
  featured?: boolean
  status?: 'draft' | 'published' | 'scheduled'
  seo?: PillarbaseSeo
}

/** Paginated list response */
export interface PillarbasePostList {
  data: PillarbasePost[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

/** Options for getPosts() */
export interface GetPostsOptions {
  page?: number
  perPage?: number
  status?: 'draft' | 'published' | 'all'
  /** Pillarbase workspace / project ID if multi-tenant */
  workspaceId?: string
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function getConfig(): {baseUrl: string; apiKey: string} {
  const baseUrl = process.env.PILLARBASE_API_URL
  const apiKey = process.env.PILLARBASE_API_KEY

  if (!baseUrl) throw new Error('[Pillarbase] PILLARBASE_API_URL is not set in environment.')
  if (!apiKey) throw new Error('[Pillarbase] PILLARBASE_API_KEY is not set in environment.')

  return {baseUrl: baseUrl.replace(/\/$/, ''), apiKey}
}

/** Shared fetch wrapper with auth headers, timeout, and error normalisation */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const {baseUrl, apiKey} = getConfig()
  const url = `${baseUrl}${path}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30_000) // 30 s timeout

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Pillarbase uses Bearer token authentication.
        // Update the header name below if Pillarbase uses a different scheme
        // e.g. 'X-API-Key': apiKey
        Authorization: `Bearer ${apiKey}`,
        ...options.headers,
      },
    })
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(`[Pillarbase] Request to ${url} timed out after 30 s.`)
    }
    throw new Error(`[Pillarbase] Network error fetching ${url}: ${String(err)}`)
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.message ?? body?.error ?? JSON.stringify(body)
    } catch {
      detail = await response.text().catch(() => '')
    }
    throw new Error(
      `[Pillarbase] HTTP ${response.status} ${response.statusText} — ${url}\n${detail}`,
    )
  }

  return response.json() as Promise<T>
}

// ── Retry helper ─────────────────────────────────────────────────────────────

/** Retry `fn` up to `attempts` times with exponential back-off */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, baseDelayMs = 500): Promise<T> {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        const delay = baseDelayMs * 2 ** i
        console.warn(`[Pillarbase] Attempt ${i + 1} failed. Retrying in ${delay} ms…`)
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }
  throw lastError
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of posts from Pillarbase.
 *
 * @example
 *   const {data, total} = await getPosts({status: 'published', perPage: 50})
 */
export async function getPosts(options: GetPostsOptions = {}): Promise<PillarbasePostList> {
  const {page = 1, perPage = 20, status = 'all', workspaceId} = options

  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
    ...(status !== 'all' && {status}),
    ...(workspaceId && {workspace_id: workspaceId}),
  })

  // Adjust the path below to match the actual Pillarbase endpoint
  return withRetry(() => apiFetch<PillarbasePostList>(`/api/v1/posts?${params}`))
}

/**
 * Fetch a single post by its Pillarbase ID.
 *
 * @throws  If the post is not found or the API returns an error.
 */
export async function getPost(id: string): Promise<PillarbasePost> {
  if (!id) throw new Error('[Pillarbase] getPost: id is required.')
  return withRetry(() => apiFetch<PillarbasePost>(`/api/v1/posts/${encodeURIComponent(id)}`))
}

/**
 * Fetch multiple posts by ID in parallel (max 5 concurrent requests).
 *
 * Returns results in the same order as `ids`.  Failed fetches are returned
 * as Error objects so callers can handle partial failures gracefully.
 */
export async function getPostsByIds(
  ids: string[],
): Promise<Array<PillarbasePost | Error>> {
  const CONCURRENCY = 5
  const results: Array<PillarbasePost | Error> = new Array(ids.length)

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const batch = ids.slice(i, i + CONCURRENCY)
    const settled = await Promise.allSettled(batch.map(id => getPost(id)))
    settled.forEach((result, j) => {
      results[i + j] =
        result.status === 'fulfilled' ? result.value : result.reason as Error
    })
  }

  return results
}

/**
 * Trigger Pillarbase to publish / generate a post.
 *
 * This is a placeholder — adjust the endpoint and body
 * to match the actual Pillarbase publish API.
 */
export async function publishPost(id: string): Promise<{success: boolean; message?: string}> {
  if (!id) throw new Error('[Pillarbase] publishPost: id is required.')
  return apiFetch(`/api/v1/posts/${encodeURIComponent(id)}/publish`, {method: 'POST'})
}
