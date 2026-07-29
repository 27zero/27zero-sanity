/**
 * plugins/pillarbase-importer/PillarbaseImporter.tsx
 *
 * Custom Sanity Studio tool: Pillarbase Importer.
 *
 * Renders a full-page tool in Sanity Studio that allows editors to:
 *   1. Connect to Pillarbase and list available posts
 *   2. Select one or multiple posts
 *   3. Import them into Sanity as drafts (or published)
 *   4. See real-time progress and success/error feedback
 *
 * Accessing from Studio
 * ─────────────────────
 * The tool appears in the Studio navigation bar as "Pillarbase Importer".
 * It is registered in sanity.config.ts via the pillarbaseImporterPlugin.
 *
 * Architecture note
 * ─────────────────
 * This component runs entirely inside the browser (Studio is a React app).
 * It calls the Pillarbase API and Sanity client directly from the browser.
 * No server-side route is needed.
 *
 * IMPORTANT: The Pillarbase API key is read from the environment variable
 * SANITY_STUDIO_PILLARBASE_API_KEY (Sanity Studio exposes only variables
 * prefixed with SANITY_STUDIO_ to the browser bundle).
 * SANITY_STUDIO_PILLARBASE_API_URL similarly.
 */

import React, {useState, useCallback} from 'react'
import {
  Box,
  Button,
  Card,
  Checkbox,
  Code,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  Badge,
  useToast,
} from '@sanity/ui'
import {useClient} from 'sanity'

// ── Pillarbase API (browser-safe inline fetch — no Node-only imports) ──────────

interface PillarbaseListItem {
  id: string
  title: string
  status?: string
  published_at?: string
  slug?: string
}

async function fetchPillarbasePosts(
  apiUrl: string,
  apiKey: string,
): Promise<PillarbaseListItem[]> {
  const url = `${apiUrl.replace(/\/$/, '')}/api/v1/posts?per_page=50&status=all`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  })
  if (!res.ok) throw new Error(`Pillarbase API returned HTTP ${res.status}`)
  const json = await res.json()
  // Handle both {data: [...]} and plain array responses
  return Array.isArray(json) ? json : (json.data ?? [])
}

interface PillarbaseFullPost {
  id: string
  title: string
  slug?: string
  excerpt?: string
  content: string
  content_format?: 'markdown' | 'html'
  featured_image_url?: string
  author?: {id: string; name: string; email?: string}
  categories?: Array<{id: string; name: string; slug?: string}>
  published_at?: string
  created_at?: string
  featured?: boolean
  status?: string
  seo?: {title?: string; description?: string; og_image_url?: string}
}

async function fetchFullPost(
  apiUrl: string,
  apiKey: string,
  postId: string,
): Promise<PillarbaseFullPost> {
  const url = `${apiUrl.replace(/\/$/, '')}/api/v1/posts/${encodeURIComponent(postId)}`
  const res = await fetch(url, {
    headers: {Authorization: `Bearer ${apiKey}`, Accept: 'application/json'},
  })
  if (!res.ok) throw new Error(`Pillarbase API returned HTTP ${res.status} for post ${postId}`)
  return res.json()
}

// ── Simple slug generator ─────────────────────────────────────────────────────

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

// ── Minimal Markdown → Portable Text for browser context ─────────────────────
// (A simplified version — the full converter is in src/utils/markdownToPortableText.ts)

function simpleMdToBlocks(markdown: string) {
  const lines = markdown.split(/\n+/)
  const blocks = []
  let key = 0

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    let style: string = 'normal'
    let text = trimmed

    if (trimmed.startsWith('### ')) { style = 'h3'; text = trimmed.slice(4) }
    else if (trimmed.startsWith('## ')) { style = 'h2'; text = trimmed.slice(3) }
    else if (trimmed.startsWith('# ')) { style = 'h1'; text = trimmed.slice(2) }
    else if (trimmed.startsWith('> ')) { style = 'blockquote'; text = trimmed.slice(2) }

    // Strip inline markdown markers for simplicity
    text = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')

    blocks.push({
      _type: 'block',
      _key: `b${key++}`,
      style,
      markDefs: [],
      children: [{_type: 'span', _key: `s${key++}`, text, marks: []}],
    })
  }
  return blocks
}

// ── Importer component ────────────────────────────────────────────────────────

type ImportStatus = {
  id: string
  status: 'pending' | 'importing' | 'done' | 'error'
  message?: string
  sanityId?: string
  slug?: string
}

export function PillarbaseImporter() {
  const toast = useToast()
  const client = useClient({apiVersion: '2024-01-01'})

  // Config from env (SANITY_STUDIO_ prefix required for browser exposure)
  const apiUrl = (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PILLARBASE_API_URL) || ''
  const apiKey = (typeof process !== 'undefined' && process.env.SANITY_STUDIO_PILLARBASE_API_KEY) || ''

  const [posts, setPosts] = useState<PillarbaseListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [publishImmediately, setPublishImmediately] = useState(false)
  const [importStatuses, setImportStatuses] = useState<ImportStatus[]>([])
  const [fetched, setFetched] = useState(false)

  // ── Load posts from Pillarbase ──────────────────────────────────────────────

  const loadPosts = useCallback(async () => {
    if (!apiUrl || !apiKey) {
      toast.push({
        status: 'error',
        title: 'Configuration missing',
        description:
          'Set SANITY_STUDIO_PILLARBASE_API_URL and SANITY_STUDIO_PILLARBASE_API_KEY in your .env file.',
      })
      return
    }

    setLoading(true)
    try {
      const data = await fetchPillarbasePosts(apiUrl, apiKey)
      setPosts(data)
      setFetched(true)
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Failed to load posts',
        description: String(err),
      })
    } finally {
      setLoading(false)
    }
  }, [apiUrl, apiKey, toast])

  // ── Selection ───────────────────────────────────────────────────────────────

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === posts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(posts.map(p => p.id)))
    }
  }

  // ── Import ──────────────────────────────────────────────────────────────────

  const updateStatus = (id: string, update: Partial<ImportStatus>) => {
    setImportStatuses(prev => prev.map(s => (s.id === id ? {...s, ...update} : s)))
  }

  const runImport = useCallback(async () => {
    if (selected.size === 0) {
      toast.push({status: 'warning', title: 'No posts selected'})
      return
    }

    const ids = Array.from(selected)
    setImportStatuses(ids.map(id => ({id, status: 'pending'})))

    let successCount = 0
    let errorCount = 0

    for (const id of ids) {
      updateStatus(id, {status: 'importing'})

      try {
        // Fetch full post
        const post = await fetchFullPost(apiUrl, apiKey, id)

        // Resolve author
        let authorRef: {_type: 'reference'; _ref: string} | undefined
        if (post.author?.name) {
          const authors = await client.fetch<Array<{_id: string}>>(
            `*[_type == "author" && name == $name][0]{_id}`,
            {name: post.author.name},
          )
          if (authors?._id) authorRef = {_type: 'reference', _ref: authors._id}
        }

        // Resolve / create categories
        const catRefs: Array<{_type: 'reference'; _ref: string} & {_key: string}> = []
        for (const cat of (post.categories ?? [])) {
          if (!cat.name?.trim()) continue
          let existing = await client.fetch<{_id: string} | null>(
            `*[_type == "category" && title == $title][0]{_id}`,
            {title: cat.name},
          )
          if (!existing) {
            existing = await client.create({
              _type: 'category',
              title: cat.name,
              slug: {_type: 'slug', current: slugify(cat.name)},
            })
          }
          if (existing) {
            catRefs.push({_type: 'reference', _ref: existing._id, _key: existing._id})
          }
        }

        // Build document
        const slugCurrent = post.slug?.trim()
          ? post.slug.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 96)
          : slugify(post.title)

        const body =
          post.content_format === 'html'
            ? simpleMdToBlocks(post.content.replace(/<[^>]+>/g, ''))
            : simpleMdToBlocks(post.content)

        const doc: Record<string, unknown> = {
          _type: 'post',
          contentType: 'blog',
          title: post.title,
          slug: {_type: 'slug', current: slugCurrent},
          featured: post.featured ?? false,
          _pillarbaseId: post.id,
          publishedAt: post.published_at ?? post.created_at ?? new Date().toISOString(),
          ...(post.excerpt?.trim() && {excerpt: post.excerpt.trim().slice(0, 300)}),
          ...(body.length > 0 && {body}),
          ...(authorRef && {author: authorRef}),
          ...(catRefs.length > 0 && {categories: catRefs}),
          ...(post.seo?.title && {seoTitle: post.seo.title.slice(0, 70)}),
          ...(post.seo?.description && {seoDescription: post.seo.description.slice(0, 160)}),
        }

        // Check for existing
        const existing = await client.fetch<{_id: string} | null>(
          `*[_type == "post" && _pillarbaseId == $id][0]{_id}`,
          {id: post.id},
        )

        let sanityId: string

        if (existing) {
          const {_type, _pillarbaseId: _pb, ...patchFields} = doc
          void _type; void _pb
          await client.patch(existing._id).set(patchFields).commit()
          sanityId = existing._id
        } else {
          const created = await client.create(doc)
          sanityId = created._id
        }

        // Publish if requested
        if (publishImmediately && sanityId.startsWith('drafts.')) {
          const cleanId = sanityId.replace(/^drafts\./, '')
          const draft = await client.getDocument(sanityId)
          if (draft) {
            await client.transaction()
              .createOrReplace({...draft, _id: cleanId})
              .delete(sanityId)
              .commit()
            sanityId = cleanId
          }
        }

        updateStatus(id, {status: 'done', sanityId, slug: slugCurrent, message: post.title})
        successCount++
      } catch (err) {
        updateStatus(id, {status: 'error', message: String(err)})
        errorCount++
      }
    }

    toast.push({
      status: errorCount === 0 ? 'success' : 'warning',
      title: `Import complete`,
      description: `${successCount} imported, ${errorCount} failed.`,
    })
  }, [selected, apiUrl, apiKey, client, publishImmediately, toast])

  // ── Render ──────────────────────────────────────────────────────────────────

  const isConfigured = Boolean(apiUrl && apiKey)
  const allSelected = posts.length > 0 && selected.size === posts.length
  const importing = importStatuses.some(s => s.status === 'importing')

  return (
    <Box padding={4} style={{minHeight: '100vh', overflowY: 'auto'}}>
      <Container width={2}>
        <Stack space={5}>

          {/* Header */}
          <Stack space={2}>
            <Heading as="h1" size={3}>Pillarbase Importer</Heading>
            <Text muted size={1}>
              Import blog posts from Pillarbase into Sanity as drafts or published documents.
            </Text>
          </Stack>

          {/* Config warning */}
          {!isConfigured && (
            <Card padding={4} radius={2} tone="caution">
              <Stack space={2}>
                <Text weight="semibold">Configuration required</Text>
                <Text size={1} muted>
                  Add the following to your <Code size={1}>.env</Code> file and restart the Studio:
                </Text>
                <Code size={1} language="bash">
                  {`SANITY_STUDIO_PILLARBASE_API_URL=https://app.pillarbase.ai\nSANITY_STUDIO_PILLARBASE_API_KEY=your_key_here`}
                </Code>
              </Stack>
            </Card>
          )}

          {/* Actions */}
          <Flex gap={3} align="center" wrap="wrap">
            <Button
              text={fetched ? 'Refresh posts' : 'Load posts from Pillarbase'}
              tone="primary"
              onClick={loadPosts}
              disabled={loading || !isConfigured || importing}
              icon={loading ? Spinner : undefined}
            />

            {posts.length > 0 && (
              <>
                <Flex align="center" gap={2}>
                  <Checkbox
                    id="publish-immediately"
                    checked={publishImmediately}
                    onChange={e => setPublishImmediately((e.target as HTMLInputElement).checked)}
                  />
                  <label htmlFor="publish-immediately">
                    <Text size={1}>Publish immediately</Text>
                  </label>
                </Flex>

                <Button
                  text={`Import selected (${selected.size})`}
                  tone="positive"
                  onClick={runImport}
                  disabled={selected.size === 0 || importing}
                />
              </>
            )}
          </Flex>

          {/* Post list */}
          {loading && (
            <Flex justify="center" padding={6}>
              <Spinner muted />
            </Flex>
          )}

          {fetched && !loading && posts.length === 0 && (
            <Card padding={4} radius={2} tone="transparent">
              <Text muted>No posts found in Pillarbase.</Text>
            </Card>
          )}

          {posts.length > 0 && (
            <Card radius={2} shadow={1} overflow="hidden">
              {/* Select-all header */}
              <Box padding={3} style={{borderBottom: '1px solid var(--card-border-color)'}}>
                <Flex align="center" gap={3}>
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                  <label htmlFor="select-all">
                    <Text size={1} weight="semibold">
                      {allSelected ? 'Deselect all' : 'Select all'} ({posts.length} posts)
                    </Text>
                  </label>
                </Flex>
              </Box>

              {/* Post rows */}
              {posts.map((post, i) => {
                const statusEntry = importStatuses.find(s => s.id === post.id)

                return (
                  <Box
                    key={post.id}
                    padding={3}
                    style={{
                      borderBottom: i < posts.length - 1 ? '1px solid var(--card-border-color)' : 'none',
                      background: selected.has(post.id) ? 'var(--card-selected-bg, rgba(0,0,0,.04))' : 'transparent',
                    }}
                  >
                    <Flex align="center" gap={3}>
                      <Checkbox
                        id={`post-${post.id}`}
                        checked={selected.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        disabled={importing}
                      />

                      <Box flex={1}>
                        <label htmlFor={`post-${post.id}`} style={{cursor: 'pointer'}}>
                          <Text size={1} weight="semibold">{post.title || '(untitled)'}</Text>
                          <Text size={0} muted>
                            ID: {post.id}
                            {post.published_at && ` · ${new Date(post.published_at).toLocaleDateString()}`}
                          </Text>
                        </label>
                      </Box>

                      <Flex gap={2} align="center">
                        {post.status && (
                          <Badge
                            tone={post.status === 'published' ? 'positive' : 'caution'}
                            size={0}
                          >
                            {post.status}
                          </Badge>
                        )}

                        {statusEntry && (
                          <>
                            {statusEntry.status === 'importing' && <Spinner muted />}
                            {statusEntry.status === 'done' && (
                              <Badge tone="positive" size={0}>✓ imported</Badge>
                            )}
                            {statusEntry.status === 'error' && (
                              <Badge tone="critical" size={0} title={statusEntry.message}>✗ error</Badge>
                            )}
                          </>
                        )}
                      </Flex>
                    </Flex>

                    {/* Error detail */}
                    {statusEntry?.status === 'error' && statusEntry.message && (
                      <Box marginTop={2}>
                        <Text size={0} style={{color: 'var(--card-critical-fg-color)'}}>
                          {statusEntry.message}
                        </Text>
                      </Box>
                    )}

                    {/* Success detail */}
                    {statusEntry?.status === 'done' && statusEntry.slug && (
                      <Box marginTop={1}>
                        <Text size={0} muted>
                          Slug: <Code size={0}>{statusEntry.slug}</Code>
                          {' · '}
                          Sanity ID: <Code size={0}>{statusEntry.sanityId}</Code>
                        </Text>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Card>
          )}

        </Stack>
      </Container>
    </Box>
  )
}
