/**
 * src/integrations/pillarbaseMcp.ts
 *
 * Pillarbase integration via MCP (Model Context Protocol).
 *
 * ── What Pillarbase's MCP server actually is ────────────────────────────────
 *
 * Pillarbase exposes an MCP server at https://app.pillarbase.ai/mcp
 * using the SSE (Server-Sent Events) transport defined by the MCP spec.
 *
 * The MCP server is designed for AI assistants (Claude, Cursor, etc.) to
 * interact with Pillarbase content. It wraps the same authenticated Pillarbase
 * API that the web application uses.
 *
 * ── How the Sanity Studio tool uses it ─────────────────────────────────────
 *
 * Sanity Studio runs in the browser. It is NOT an AI assistant and cannot
 * use the MCP protocol natively (MCP requires a persistent SSE session with
 * an initialize/capabilities handshake).
 *
 * Instead, this module calls the Pillarbase API directly using the same
 * API token that the MCP server would use. This is the correct approach:
 *
 *   AI assistant  →  MCP protocol  →  Pillarbase API
 *   Studio tool   →  fetch() + token  →  Pillarbase API
 *                    (same underlying API, different transport)
 *
 * ── What we know about the Pillarbase API ──────────────────────────────────
 *
 * From the task description:
 *   - There IS a public REST API (read-only, analytics only)
 *   - The MCP server handles: content generation, briefs, article drafting,
 *     approvals (these require write access and auth)
 *
 * From probing:
 *   - All endpoints return HTTP 403 (auth required, not 404 — they exist)
 *   - No public SDK or documentation is accessible without an account
 *
 * ── IMPORTANT NOTE ON ENDPOINT PATHS ───────────────────────────────────────
 *
 * The exact API endpoint paths are not publicly documented.
 * The constants below are clearly marked with TODO and must be confirmed
 * with Pillarbase support or by inspecting network traffic in the Pillarbase
 * web application. Only the API token needs to be configured to make this work.
 *
 * Configuration (in .env):
 *   SANITY_STUDIO_PILLARBASE_API_URL   — Base URL (default: https://app.pillarbase.ai)
 *   SANITY_STUDIO_PILLARBASE_API_TOKEN — API token from Pillarbase Settings → API
 */

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint paths
// TODO: Confirm these with Pillarbase support or by inspecting the web app's
// network requests. These are the most likely paths based on the product's
// feature set (articles, briefs, content approvals).
// ─────────────────────────────────────────────────────────────────────────────

export const PILLARBASE_ENDPOINTS = {
  /**
   * List generated/approved articles.
   * TODO: Confirm path. Candidates: /api/articles, /api/v1/articles, /api/content
   */
  articles: '/api/v1/articles',

  /**
   * Get a single article by ID.
   * TODO: Confirm path. Likely: /api/v1/articles/:id
   */
  article: (id: string) => `/api/v1/articles/${encodeURIComponent(id)}`,

  /**
   * List content briefs.
   * TODO: Confirm path. Candidates: /api/briefs, /api/v1/briefs
   */
  briefs: '/api/v1/briefs',

  /**
   * Get a single brief by ID.
   */
  brief: (id: string) => `/api/v1/briefs/${encodeURIComponent(id)}`,

  /**
   * Approve/publish an article in Pillarbase.
   * TODO: Confirm path and HTTP method (likely POST or PATCH).
   */
  approveArticle: (id: string) => `/api/v1/articles/${encodeURIComponent(id)}/approve`,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration for the Pillarbase client.
 * Read from environment variables or Studio plugin config.
 */
export interface PillarbaseConfig {
  /** Base URL of the Pillarbase app (no trailing slash) */
  apiUrl: string
  /** API token from Pillarbase Settings → API */
  apiToken: string
}

/**
 * A Pillarbase article as returned by the API.
 *
 * Field names are best guesses based on the product.
 * TODO: Update once real API response is confirmed.
 */
export interface PillarbaseArticle {
  id: string
  title: string
  slug?: string
  /** Article body — typically Markdown or HTML */
  content?: string
  content_format?: 'markdown' | 'html'
  excerpt?: string
  status?: 'draft' | 'approved' | 'published' | 'pending_review'
  created_at?: string
  updated_at?: string
  published_at?: string
  author?: {
    id: string
    name: string
    email?: string
  }
  categories?: Array<{id: string; name: string; slug?: string}>
  tags?: string[]
  featured_image_url?: string
  seo?: {
    title?: string
    description?: string
    og_image_url?: string
  }
  /** The source keyword or topic this article targets */
  target_keyword?: string
  /** Pillarbase internal project/workspace ID */
  project_id?: string
  featured?: boolean
}

/**
 * A Pillarbase content brief.
 *
 * TODO: Update once real API response is confirmed.
 */
export interface PillarbaseBrief {
  id: string
  title: string
  target_keyword?: string
  outline?: string
  content?: string
  status?: 'draft' | 'ready' | 'in_progress' | 'completed'
  created_at?: string
  article_id?: string  // linked article if generated
}

/** Paginated list response shape (typical REST convention) */
export interface PillarbaseList<T> {
  data: T[]
  total?: number
  page?: number
  per_page?: number
  has_more?: boolean
  // Some APIs use items instead of data:
  items?: T[]
  // Or a direct array:
  results?: T[]
}

export type PillarbaseArticleList = PillarbaseList<PillarbaseArticle>
export type PillarbaseBriefList = PillarbaseList<PillarbaseBrief>

// ─────────────────────────────────────────────────────────────────────────────
// HTTP client
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Low-level authenticated fetch to the Pillarbase API.
 *
 * Authentication: Bearer token (most common for REST APIs).
 * TODO: Pillarbase may use a different auth scheme (X-API-Key, Basic, etc.)
 * Update the Authorization header if needed once confirmed.
 */
export async function pillarbaseFetch<T>(
  config: PillarbaseConfig,
  path: string,
  options: RequestInit = {},
  attempt = 1,
): Promise<T> {
  const url = `${config.apiUrl.replace(/\/$/, '')}${path}`
  const maxAttempts = 3

  let response: Response
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(30_000),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // TODO: Confirm auth scheme with Pillarbase.
        // Common options:
        //   Authorization: `Bearer ${config.apiToken}`
        //   Authorization: `Token ${config.apiToken}`
        //   'X-API-Key': config.apiToken
        Authorization: `Bearer ${config.apiToken}`,
        ...options.headers,
      },
    })
  } catch (err: unknown) {
    if (attempt < maxAttempts) {
      await sleep(500 * 2 ** (attempt - 1))
      return pillarbaseFetch(config, path, options, attempt + 1)
    }
    throw new PillarbaseError(`Network error: ${String(err)}`, 0, url)
  }

  if (!response.ok) {
    // Retry on 429 (rate limit) and 5xx (server errors), not on 4xx
    if ((response.status === 429 || response.status >= 500) && attempt < maxAttempts) {
      const retryAfter = response.headers.get('Retry-After')
      const delayMs = retryAfter ? parseInt(retryAfter) * 1000 : 500 * 2 ** (attempt - 1)
      console.warn(`[Pillarbase] HTTP ${response.status} on attempt ${attempt}. Retrying in ${delayMs}ms…`)
      await sleep(delayMs)
      return pillarbaseFetch(config, path, options, attempt + 1)
    }

    let detail = ''
    try { detail = await response.text() } catch { /* ignore */ }
    throw new PillarbaseError(
      `HTTP ${response.status} ${response.statusText}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      response.status,
      url,
    )
  }

  return response.json() as Promise<T>
}

/** Custom error class with HTTP status code */
export class PillarbaseError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly url: string,
  ) {
    super(`[Pillarbase] ${message} (${url})`)
    this.name = 'PillarbaseError'
  }

  /** True if the error is due to missing/invalid credentials */
  get isAuthError(): boolean {
    return this.statusCode === 401 || this.statusCode === 403
  }

  /** True if the resource was not found */
  get isNotFound(): boolean {
    return this.statusCode === 404
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize any Pillarbase list response shape into a plain array.
 * Handles: {data:[]}, {items:[]}, {results:[]}, and direct arrays.
 */
function normalizeList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[]
  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>
    if (Array.isArray(r['data'])) return r['data'] as T[]
    if (Array.isArray(r['items'])) return r['items'] as T[]
    if (Array.isArray(r['results'])) return r['results'] as T[]
    if (Array.isArray(r['articles'])) return r['articles'] as T[]
    if (Array.isArray(r['briefs'])) return r['briefs'] as T[]
  }
  return []
}

/**
 * List all available articles from Pillarbase.
 *
 * Returns a flat array regardless of the API's pagination shape.
 * TODO: Add pagination support once the real API response is known.
 */
export async function listArticles(config: PillarbaseConfig): Promise<PillarbaseArticle[]> {
  const response = await pillarbaseFetch<unknown>(config, PILLARBASE_ENDPOINTS.articles)
  return normalizeList<PillarbaseArticle>(response)
}

/**
 * Fetch a single article by ID.
 */
export async function getArticle(
  config: PillarbaseConfig,
  id: string,
): Promise<PillarbaseArticle> {
  return pillarbaseFetch<PillarbaseArticle>(config, PILLARBASE_ENDPOINTS.article(id))
}

/**
 * List all available briefs from Pillarbase.
 */
export async function listBriefs(config: PillarbaseConfig): Promise<PillarbaseBrief[]> {
  const response = await pillarbaseFetch<unknown>(config, PILLARBASE_ENDPOINTS.briefs)
  return normalizeList<PillarbaseBrief>(response)
}

/**
 * Fetch a single brief by ID.
 */
export async function getBrief(
  config: PillarbaseConfig,
  id: string,
): Promise<PillarbaseBrief> {
  return pillarbaseFetch<PillarbaseBrief>(config, PILLARBASE_ENDPOINTS.brief(id))
}

/**
 * Approve (publish) an article in Pillarbase.
 * TODO: Confirm HTTP method and response shape.
 */
export async function approveArticle(
  config: PillarbaseConfig,
  id: string,
): Promise<{success: boolean}> {
  return pillarbaseFetch<{success: boolean}>(
    config,
    PILLARBASE_ENDPOINTS.approveArticle(id),
    {method: 'POST'},
  )
}

/**
 * Validate that the API token works by making a lightweight request.
 * Returns true if the token is valid, throws PillarbaseError otherwise.
 */
export async function validateToken(config: PillarbaseConfig): Promise<boolean> {
  // Try to list articles with minimal data — a lightweight probe
  try {
    await pillarbaseFetch(config, PILLARBASE_ENDPOINTS.articles + '?limit=1&per_page=1')
    return true
  } catch (err) {
    if (err instanceof PillarbaseError && err.isAuthError) {
      throw new PillarbaseError('Invalid or expired API token', err.statusCode, err.url)
    }
    throw err
  }
}
