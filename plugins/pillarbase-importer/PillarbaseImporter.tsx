/**
 * plugins/pillarbase-importer/PillarbaseImporter.tsx
 *
 * Sanity Studio custom tool: Pillarbase Importer.
 *
 * ── Architecture ─────────────────────────────────────────────────────────────
 *
 * Pillarbase exposes an MCP server for AI assistants and a REST API for
 * programmatic access. This Studio tool communicates with the same Pillarbase
 * API that the MCP server wraps, using the user's API token directly.
 *
 * The tool does NOT embed an MCP client (Sanity Studio is a React app, not
 * an AI assistant). Instead it calls the Pillarbase API with fetch() + token.
 *
 * ── Endpoint Configuration ───────────────────────────────────────────────────
 *
 * The exact Pillarbase API endpoint paths are not publicly documented.
 * This tool includes a configuration panel where you can set them once
 * you confirm them with Pillarbase support.
 *
 * Required env variables (SANITY_STUDIO_ prefix = exposed to browser):
 *   SANITY_STUDIO_PILLARBASE_API_URL   — e.g. https://app.pillarbase.ai
 *   SANITY_STUDIO_PILLARBASE_API_TOKEN — API token from Pillarbase Settings
 *
 * ── What the tool does ───────────────────────────────────────────────────────
 *  1. Connect to Pillarbase using the configured token
 *  2. List available articles/briefs
 *  3. Let editors select one or multiple items
 *  4. Convert content to Sanity Portable Text
 *  5. Create/update post documents in Sanity (idempotent)
 *  6. Show per-item progress + success/error feedback
 */

import React, {useState, useCallback, useRef} from 'react'
import {
  Badge,
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
  TextInput,
  Select,
  useToast,
} from '@sanity/ui'
import {useClient} from 'sanity'
import type {PillarbaseArticle, PillarbaseConfig} from '../../src/integrations/pillarbaseMcp'
import {
  listArticles,
  getArticle,
  PillarbaseError,
  validateToken,
} from '../../src/integrations/pillarbaseMcp'
import {mapArticleToPost} from '../../src/mappers/pillarbaseToSanity'

// ── Types ─────────────────────────────────────────────────────────────────────

type ImportStatus = 'idle' | 'pending' | 'importing' | 'done' | 'error'

interface ArticleRow {
  article: PillarbaseArticle
  status: ImportStatus
  error?: string
  sanityId?: string
  slug?: string
}

// ── Slugify (browser-safe) ────────────────────────────────────────────────────

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

// ── Minimal Markdown → Portable Text (browser-safe, no Node deps) ─────────────

function mdToBlocks(md: string) {
  const lines = (md || '').split(/\n+/)
  let key = 0
  const blocks = []
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    let style = 'normal'
    let text = line
    if (/^### /.test(line)) { style = 'h3'; text = line.slice(4) }
    else if (/^## /.test(line)) { style = 'h2'; text = line.slice(3) }
    else if (/^# /.test(line)) { style = 'h1'; text = line.slice(2) }
    else if (/^> /.test(line)) { style = 'blockquote'; text = line.slice(2) }
    text = text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
    blocks.push({
      _type: 'block', _key: `b${key++}`, style, markDefs: [],
      children: [{_type: 'span', _key: `s${key++}`, text, marks: []}],
    })
  }
  return blocks
}

function htmlToBlocks(html: string) {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .trim()
  return mdToBlocks(text)
}

// ── Importer component ────────────────────────────────────────────────────────

export function PillarbaseImporter() {
  const toast = useToast()
  const sanityClient = useClient({apiVersion: '2024-01-01'})

  // ── Config from env ──────────────────────────────────────────────────────────
  // Sanity Studio exposes SANITY_STUDIO_* vars in import.meta.env
  const envApiUrl = (
    // @ts-expect-error — Vite/Sanity env type not declared in this scope
    typeof import.meta !== 'undefined' ? import.meta.env?.SANITY_STUDIO_PILLARBASE_API_URL : ''
  ) ?? ''
  const envToken = (
    // @ts-expect-error
    typeof import.meta !== 'undefined' ? import.meta.env?.SANITY_STUDIO_PILLARBASE_API_TOKEN : ''
  ) ?? ''

  const [apiUrl, setApiUrl] = useState<string>(envApiUrl || 'https://app.pillarbase.ai')
  const [apiToken, setApiToken] = useState<string>(envToken || '')
  const [showConfig, setShowConfig] = useState(!envToken)

  // ── State ────────────────────────────────────────────────────────────────────
  const [rows, setRows] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [publishMode, setPublishMode] = useState<'draft' | 'publish'>('draft')
  const [createCategories, setCreateCategories] = useState(true)
  const [fetched, setFetched] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const pillarbaseConfig: PillarbaseConfig = {apiUrl, apiToken}

  // ── Load articles ────────────────────────────────────────────────────────────

  const loadArticles = useCallback(async () => {
    if (!apiToken.trim()) {
      toast.push({status: 'error', title: 'API token required', description: 'Enter your Pillarbase API token in the configuration panel.'})
      setShowConfig(true)
      return
    }

    setLoading(true)
    setRows([])
    try {
      // First validate the token
      await validateToken(pillarbaseConfig)
      const articles = await listArticles(pillarbaseConfig)
      setRows(articles.map(a => ({article: a, status: 'idle'})))
      setFetched(true)
      toast.push({status: 'success', title: `Loaded ${articles.length} article${articles.length === 1 ? '' : 's'}`})
    } catch (err) {
      const msg = err instanceof PillarbaseError && err.isAuthError
        ? 'Invalid API token. Check your Pillarbase Settings → API.'
        : err instanceof PillarbaseError && err.statusCode === 404
          ? 'Articles endpoint not found. The API path may need updating — see configuration.'
          : String(err)
      toast.push({status: 'error', title: 'Failed to load articles', description: msg})
    } finally {
      setLoading(false)
    }
  }, [apiUrl, apiToken, toast]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Selection ────────────────────────────────────────────────────────────────

  const toggleRow = (id: string) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAll = () => setSelected(
    selected.size === rows.length ? new Set() : new Set(rows.map(r => r.article.id))
  )

  const updateRow = (id: string, update: Partial<ArticleRow>) => {
    setRows(prev => prev.map(r => r.article.id === id ? {...r, ...update} : r))
  }

  // ── Import ───────────────────────────────────────────────────────────────────

  const runImport = useCallback(async () => {
    if (selected.size === 0) { toast.push({status: 'warning', title: 'No articles selected'}); return }

    abortRef.current = new AbortController()
    const ids = Array.from(selected)

    // Mark all selected as pending
    ids.forEach(id => updateRow(id, {status: 'pending', error: undefined}))

    let successCount = 0, errorCount = 0

    for (const id of ids) {
      if (abortRef.current.signal.aborted) break
      updateRow(id, {status: 'importing'})

      try {
        // Fetch the full article content
        const article = await getArticle(pillarbaseConfig, id)

        // ── Resolve author ──────────────────────────────────────────────────
        let authorId: string | undefined
        if (article.author?.name) {
          const found = await sanityClient.fetch<{_id: string} | null>(
            `*[_type == "author" && name == $name][0]{_id}`,
            {name: article.author.name},
          )
          if (found) authorId = found._id
        }

        // ── Resolve/create categories ───────────────────────────────────────
        const categoryIds: Record<string, string> = {}
        for (const cat of (article.categories ?? [])) {
          if (!cat.name?.trim()) continue
          let existing = await sanityClient.fetch<{_id: string} | null>(
            `*[_type == "category" && title == $title][0]{_id}`,
            {title: cat.name},
          )
          if (!existing && createCategories) {
            existing = await sanityClient.create({
              _type: 'category',
              title: cat.name,
              slug: {_type: 'slug', current: slugify(cat.name)},
            })
          }
          if (existing) categoryIds[cat.name] = existing._id
        }

        // ── Convert body ────────────────────────────────────────────────────
        const body = article.content_format === 'html'
          ? htmlToBlocks(article.content ?? '')
          : mdToBlocks(article.content ?? '')

        // ── Map ─────────────────────────────────────────────────────────────
        const mapped = mapArticleToPost(article, {authorId, categoryIds})
        // Override body with browser-converted version (avoids Node.js dep)
        if (body.length > 0) {
          (mapped as Record<string, unknown>)['body'] = body
        }

        // ── Upsert ──────────────────────────────────────────────────────────
        const existing = await sanityClient.fetch<{_id: string} | null>(
          `*[_type == "post" && _pillarbaseId == $id][0]{_id}`,
          {id: article.id},
        )

        let sanityId: string
        if (existing) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {_type, _pillarbaseId, ...patch} = mapped
          await sanityClient.patch(existing._id).set(patch).commit()
          sanityId = existing._id
        } else {
          const created = await sanityClient.create(mapped)
          sanityId = created._id
        }

        // ── Publish ─────────────────────────────────────────────────────────
        if (publishMode === 'publish' && sanityId.startsWith('drafts.')) {
          const cleanId = sanityId.replace(/^drafts\./, '')
          const draft = await sanityClient.getDocument(sanityId)
          if (draft) {
            await sanityClient.transaction()
              .createOrReplace({...draft, _id: cleanId})
              .delete(sanityId)
              .commit()
            sanityId = cleanId
          }
        }

        updateRow(id, {status: 'done', sanityId, slug: mapped.slug.current})
        successCount++
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err)
        updateRow(id, {status: 'error', error: errMsg})
        errorCount++
      }
    }

    toast.push({
      status: errorCount === 0 ? 'success' : errorCount === ids.length ? 'error' : 'warning',
      title: 'Import complete',
      description: `${successCount} imported${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
    })
  }, [selected, pillarbaseConfig, sanityClient, publishMode, createCategories, toast]) // eslint-disable-line react-hooks/exhaustive-deps

  const isImporting = rows.some(r => r.status === 'importing')
  const allSelected = rows.length > 0 && selected.size === rows.length

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Box padding={4} style={{minHeight: '100vh', overflowY: 'auto'}}>
      <Container width={2}>
        <Stack space={5}>

          {/* Header */}
          <Stack space={2}>
            <Heading as="h1" size={3}>Pillarbase Importer</Heading>
            <Text muted size={1}>
              Import articles from Pillarbase into Sanity as{' '}
              <Code size={1}>post</Code> documents.
            </Text>
          </Stack>

          {/* Configuration panel */}
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Flex justify="space-between" align="center">
                <Text weight="semibold">Configuration</Text>
                <Button
                  text={showConfig ? 'Hide' : 'Edit'}
                  mode="ghost"
                  fontSize={1}
                  padding={2}
                  onClick={() => setShowConfig(v => !v)}
                />
              </Flex>

              {showConfig && (
                <Stack space={3}>
                  <Stack space={2}>
                    <Text size={1} weight="semibold">Pillarbase API URL</Text>
                    <TextInput
                      value={apiUrl}
                      onChange={e => setApiUrl((e.target as HTMLInputElement).value)}
                      placeholder="https://app.pillarbase.ai"
                      fontSize={1}
                    />
                  </Stack>

                  <Stack space={2}>
                    <Text size={1} weight="semibold">API Token</Text>
                    <TextInput
                      value={apiToken}
                      onChange={e => setApiToken((e.target as HTMLInputElement).value)}
                      placeholder="your-pillarbase-api-token"
                      type="password"
                      fontSize={1}
                    />
                    <Text size={0} muted>
                      Find your token in Pillarbase → Settings → API.
                      Set <Code size={0}>SANITY_STUDIO_PILLARBASE_API_TOKEN</Code> in{' '}
                      <Code size={0}>.env</Code> to avoid entering it each time.
                    </Text>
                  </Stack>

                  <Card padding={3} radius={2} tone="caution">
                    <Stack space={2}>
                      <Text size={1} weight="semibold">About API endpoint paths</Text>
                      <Text size={0} muted>
                        Pillarbase does not publish API documentation publicly.
                        If loading articles fails with a 404 error, the endpoint paths
                        need to be updated. Contact Pillarbase support to confirm:
                      </Text>
                      <Code size={0}>
                        {`Articles list: ${apiUrl}/api/v1/articles\nSingle article: ${apiUrl}/api/v1/articles/:id`}
                      </Code>
                      <Text size={0} muted>
                        Update <Code size={0}>src/integrations/pillarbaseMcp.ts</Code>{' '}
                        → <Code size={0}>PILLARBASE_ENDPOINTS</Code> once confirmed.
                      </Text>
                    </Stack>
                  </Card>
                </Stack>
              )}
            </Stack>
          </Card>

          {/* Import options */}
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text weight="semibold">Import options</Text>
              <Flex gap={4} wrap="wrap">
                <Stack space={2}>
                  <Text size={1}>After import</Text>
                  <Select
                    value={publishMode}
                    onChange={e => setPublishMode((e.target as HTMLSelectElement).value as 'draft' | 'publish')}
                    fontSize={1}
                  >
                    <option value="draft">Save as draft</option>
                    <option value="publish">Publish immediately</option>
                  </Select>
                </Stack>

                <Flex align="center" gap={2}>
                  <Checkbox
                    id="create-cats"
                    checked={createCategories}
                    onChange={e => setCreateCategories((e.target as HTMLInputElement).checked)}
                  />
                  <label htmlFor="create-cats">
                    <Text size={1}>Create missing categories</Text>
                  </label>
                </Flex>
              </Flex>
            </Stack>
          </Card>

          {/* Actions */}
          <Flex gap={3} wrap="wrap" align="center">
            <Button
              text={loading ? 'Loading…' : fetched ? 'Refresh articles' : 'Load articles from Pillarbase'}
              tone="primary"
              onClick={loadArticles}
              disabled={loading || isImporting || !apiToken.trim()}
              icon={loading ? Spinner : undefined}
            />

            {rows.length > 0 && (
              <Button
                text={`Import selected (${selected.size})`}
                tone="positive"
                onClick={runImport}
                disabled={selected.size === 0 || isImporting}
              />
            )}

            {isImporting && (
              <Button
                text="Cancel"
                tone="critical"
                mode="ghost"
                onClick={() => abortRef.current?.abort()}
              />
            )}
          </Flex>

          {/* Loading */}
          {loading && (
            <Flex justify="center" padding={6}>
              <Spinner muted />
            </Flex>
          )}

          {/* Empty state */}
          {fetched && !loading && rows.length === 0 && (
            <Card padding={5} radius={2} tone="transparent">
              <Stack space={2}>
                <Text weight="semibold">No articles found</Text>
                <Text muted size={1}>
                  Either no articles exist in Pillarbase, or the API endpoint path needs
                  to be updated in <Code size={1}>src/integrations/pillarbaseMcp.ts</Code>.
                </Text>
              </Stack>
            </Card>
          )}

          {/* Article list */}
          {rows.length > 0 && (
            <Card radius={2} shadow={1} overflow="hidden">
              {/* Select-all header */}
              <Box
                padding={3}
                style={{borderBottom: '1px solid var(--card-border-color)'}}
              >
                <Flex align="center" gap={3}>
                  <Checkbox id="select-all" checked={allSelected} onChange={toggleAll} />
                  <label htmlFor="select-all">
                    <Text size={1} weight="semibold">
                      {allSelected ? 'Deselect all' : 'Select all'} ({rows.length})
                    </Text>
                  </label>
                </Flex>
              </Box>

              {/* Rows */}
              {rows.map((row, i) => {
                const {article, status, error, sanityId, slug} = row
                const isSelected = selected.has(article.id)

                return (
                  <Box
                    key={article.id}
                    padding={3}
                    style={{
                      borderBottom: i < rows.length - 1 ? '1px solid var(--card-border-color)' : 'none',
                      background: isSelected ? 'rgba(0,0,0,.04)' : 'transparent',
                    }}
                  >
                    <Flex align="flex-start" gap={3}>
                      <Box style={{paddingTop: 2}}>
                        <Checkbox
                          id={`row-${article.id}`}
                          checked={isSelected}
                          onChange={() => toggleRow(article.id)}
                          disabled={isImporting}
                        />
                      </Box>

                      <Box flex={1}>
                        <label htmlFor={`row-${article.id}`} style={{cursor: 'pointer', display: 'block'}}>
                          <Text size={1} weight="semibold">
                            {article.title || '(untitled)'}
                          </Text>
                          <Text size={0} muted>
                            ID: {article.id}
                            {article.target_keyword && ` · 🔑 ${article.target_keyword}`}
                            {article.published_at && ` · ${new Date(article.published_at).toLocaleDateString()}`}
                          </Text>
                        </label>
                      </Box>

                      <Flex gap={2} align="center" style={{flexShrink: 0}}>
                        {article.status && (
                          <Badge
                            tone={article.status === 'published' ? 'positive' : article.status === 'approved' ? 'primary' : 'caution'}
                            size={0}
                          >
                            {article.status}
                          </Badge>
                        )}
                        {status === 'importing' && <Spinner muted />}
                        {status === 'done' && <Badge tone="positive" size={0}>✓ imported</Badge>}
                        {status === 'error' && <Badge tone="critical" size={0}>✗ error</Badge>}
                      </Flex>
                    </Flex>

                    {status === 'done' && slug && (
                      <Box marginTop={1} marginLeft={6}>
                        <Text size={0} muted>
                          Slug: <Code size={0}>{slug}</Code>
                          {' · '}
                          <Code size={0}>{sanityId}</Code>
                        </Text>
                      </Box>
                    )}
                    {status === 'error' && error && (
                      <Box marginTop={1} marginLeft={6}>
                        <Text size={0} style={{color: 'var(--card-critical-fg-color)'}}>
                          {error}
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
