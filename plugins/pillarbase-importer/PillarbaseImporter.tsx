/**
 * plugins/pillarbase-importer/PillarbaseImporter.tsx
 *
 * Sanity Studio custom tool: Pillarbase Importer.
 *
 * Imports articles from Pillarbase into Sanity as post documents.
 */

import React, {useState, useCallback, useRef} from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  TextInput,
  Select,
} from '@sanity/ui'
import {useClient} from 'sanity'

import type {
  PillarbaseArticle,
  PillarbaseConfig,
} from '../../src/integrations/pillarbaseMcp'

import {
  listArticles,
  getArticle,
  PillarbaseError,
  validateToken,
} from '../../src/integrations/pillarbaseMcp'

import {mapArticleToPost} from '../../src/mappers/pillarbaseToSanity'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ImportStatus =
  | 'idle'
  | 'pending'
  | 'importing'
  | 'done'
  | 'error'

interface ArticleRow {
  article: PillarbaseArticle
  status: ImportStatus
  error?: string
  sanityId?: string
  slug?: string
}

type MessageTone = 'positive' | 'critical' | 'caution'

interface MessageState {
  tone: MessageTone
  title: string
  description?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Slugify
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Markdown → Portable Text
// ─────────────────────────────────────────────────────────────────────────────

function mdToBlocks(md: string) {
  const lines = (md || '').split(/\n+/)
  let key = 0

  const blocks = []

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) continue

    let style = 'normal'
    let text = line

    if (/^### /.test(line)) {
      style = 'h3'
      text = line.slice(4)
    } else if (/^## /.test(line)) {
      style = 'h2'
      text = line.slice(3)
    } else if (/^# /.test(line)) {
      style = 'h1'
      text = line.slice(2)
    } else if (/^> /.test(line)) {
      style = 'blockquote'
      text = line.slice(2)
    }

    text = text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')

    blocks.push({
      _type: 'block',
      _key: `b${key++}`,
      style,
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `s${key++}`,
          text,
          marks: [],
        },
      ],
    })
  }

  return blocks
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML → Portable Text
// ─────────────────────────────────────────────────────────────────────────────

function htmlToBlocks(html: string) {
  const text = (html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim()

  return mdToBlocks(text)
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function PillarbaseImporter() {
  const sanityClient = useClient({
    apiVersion: '2024-01-01',
  })

  // ───────────────────────────────────────────────────────────────────────────
  // Environment configuration
  // ───────────────────────────────────────────────────────────────────────────

  const envApiUrl =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.SANITY_STUDIO_PILLARBASE_API_URL ?? ''
      : ''

  const envToken =
    typeof import.meta !== 'undefined'
      ? import.meta.env?.SANITY_STUDIO_PILLARBASE_API_TOKEN ?? ''
      : ''

  const [apiUrl, setApiUrl] = useState<string>(
    envApiUrl || 'https://app.pillarbase.ai',
  )

  const [apiToken, setApiToken] = useState<string>(
    envToken || '',
  )

  const [showConfig, setShowConfig] = useState<boolean>(
    !envToken,
  )

  // ───────────────────────────────────────────────────────────────────────────
  // State
  // ───────────────────────────────────────────────────────────────────────────

  const [rows, setRows] = useState<ArticleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [publishMode, setPublishMode] =
    useState<'draft' | 'publish'>('draft')

  const [createCategories, setCreateCategories] =
    useState(true)

  const [fetched, setFetched] = useState(false)

  const [message, setMessage] =
    useState<MessageState | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const pillarbaseConfig: PillarbaseConfig = {
    apiUrl,
    apiToken,
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Message helper
  // ───────────────────────────────────────────────────────────────────────────

  const showMessage = useCallback(
    (
      tone: MessageTone,
      title: string,
      description?: string,
    ) => {
      setMessage({
        tone,
        title,
        description,
      })
    },
    [],
  )

  // ───────────────────────────────────────────────────────────────────────────
  // Load articles
  // ───────────────────────────────────────────────────────────────────────────

  const loadArticles = useCallback(async () => {
    setMessage(null)

    if (!apiToken.trim()) {
      showMessage(
        'critical',
        'API token required',
        'Enter your Pillarbase API token in the configuration panel.',
      )

      setShowConfig(true)
      return
    }

    setLoading(true)
    setRows([])
    setSelected(new Set())

    try {
      await validateToken(pillarbaseConfig)

      const articles = await listArticles(
        pillarbaseConfig,
      )

      setRows(
        articles.map((article) => ({
          article,
          status: 'idle',
        })),
      )

      setFetched(true)

      showMessage(
        'positive',
        `Loaded ${articles.length} article${
          articles.length === 1 ? '' : 's'
        }`,
      )
    } catch (err) {
      const msg =
        err instanceof PillarbaseError && err.isAuthError
          ? 'Invalid API token. Check your Pillarbase Settings → API.'
          : err instanceof PillarbaseError &&
              err.statusCode === 404
            ? 'Articles endpoint not found. The API path may need updating — see configuration.'
            : err instanceof Error
              ? err.message
              : String(err)

      showMessage(
        'critical',
        'Failed to load articles',
        msg,
      )
    } finally {
      setLoading(false)
    }
  }, [
    apiToken,
    pillarbaseConfig,
    showMessage,
  ])

  // ───────────────────────────────────────────────────────────────────────────
  // Selection
  // ───────────────────────────────────────────────────────────────────────────

  const toggleRow = (id: string) => {
    setSelected((previous) => {
      const next = new Set(previous)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const toggleAll = () => {
    setSelected(
      selected.size === rows.length
        ? new Set()
        : new Set(rows.map((row) => row.article.id)),
    )
  }

  const updateRow = (
    id: string,
    update: Partial<ArticleRow>,
  ) => {
    setRows((previous) =>
      previous.map((row) =>
        row.article.id === id
          ? {
              ...row,
              ...update,
            }
          : row,
      ),
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Import
  // ───────────────────────────────────────────────────────────────────────────

  const runImport = useCallback(async () => {
    setMessage(null)

    if (selected.size === 0) {
      showMessage(
        'caution',
        'No articles selected',
      )
      return
    }

    abortRef.current = new AbortController()

    const ids = Array.from(selected)

    ids.forEach((id) => {
      updateRow(id, {
        status: 'pending',
        error: undefined,
      })
    })

    let successCount = 0
    let errorCount = 0

    for (const id of ids) {
      if (abortRef.current.signal.aborted) {
        break
      }

      updateRow(id, {
        status: 'importing',
      })

      try {
        // ─────────────────────────────────────────────────────────────────────
        // Fetch full article
        // ─────────────────────────────────────────────────────────────────────

        const article = await getArticle(
          pillarbaseConfig,
          id,
        )

        // ─────────────────────────────────────────────────────────────────────
        // Resolve author
        // ─────────────────────────────────────────────────────────────────────

        let authorId: string | undefined

        if (article.author?.name) {
          const found =
            await sanityClient.fetch<{_id: string} | null>(
              `*[_type == "author" && name == $name][0]{_id}`,
              {
                name: article.author.name,
              },
            )

          if (found) {
            authorId = found._id
          }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Resolve / create categories
        // ─────────────────────────────────────────────────────────────────────

        const categoryIds: Record<string, string> = {}

        for (const cat of article.categories ?? []) {
          if (!cat.name?.trim()) {
            continue
          }

          let existing =
            await sanityClient.fetch<{_id: string} | null>(
              `*[_type == "category" && title == $title][0]{_id}`,
              {
                title: cat.name,
              },
            )

          if (!existing && createCategories) {
            existing = await sanityClient.create({
              _type: 'category',
              title: cat.name,
              slug: {
                _type: 'slug',
                current: slugify(cat.name),
              },
            })
          }

          if (existing) {
            categoryIds[cat.name] = existing._id
          }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Convert body
        // ─────────────────────────────────────────────────────────────────────

        const body =
          article.content_format === 'html'
            ? htmlToBlocks(article.content ?? '')
            : mdToBlocks(article.content ?? '')

        // ─────────────────────────────────────────────────────────────────────
        // Map article
        // ─────────────────────────────────────────────────────────────────────

        const mapped = mapArticleToPost(article, {
          authorId,
          categoryIds,
        })

        // Override body with browser-safe conversion
        if (body.length > 0) {
          ;(mapped as Record<string, unknown>).body =
            body
        }

        // ─────────────────────────────────────────────────────────────────────
        // Find existing document
        // ─────────────────────────────────────────────────────────────────────

        const existing =
          await sanityClient.fetch<{_id: string} | null>(
            `*[_type == "post" && _pillarbaseId == $id][0]{_id}`,
            {
              id: article.id,
            },
          )

        let sanityId: string

        // ─────────────────────────────────────────────────────────────────────
        // Update existing
        // ─────────────────────────────────────────────────────────────────────

        if (existing) {
          const {
            _type,
            _pillarbaseId,
            ...patch
          } = mapped

          void _type
          void _pillarbaseId

          await sanityClient
            .patch(existing._id)
            .set(patch)
            .commit()

          sanityId = existing._id
        }

        // ─────────────────────────────────────────────────────────────────────
        // Create new
        // ─────────────────────────────────────────────────────────────────────

        else {
          const created =
            await sanityClient.create(mapped)

          sanityId = created._id
        }

        // ─────────────────────────────────────────────────────────────────────
        // Publish
        // ─────────────────────────────────────────────────────────────────────

        if (
          publishMode === 'publish' &&
          sanityId.startsWith('drafts.')
        ) {
          const cleanId = sanityId.replace(
            /^drafts\./,
            '',
          )

          const draft =
            await sanityClient.getDocument(
              sanityId,
            )

          if (draft) {
            await sanityClient
              .transaction()
              .createOrReplace({
                ...draft,
                _id: cleanId,
              })
              .delete(sanityId)
              .commit()

            sanityId = cleanId
          }
        }

        // ─────────────────────────────────────────────────────────────────────
        // Success
        // ─────────────────────────────────────────────────────────────────────

        updateRow(id, {
          status: 'done',
          sanityId,
          slug: mapped.slug.current,
        })

        successCount++
      } catch (err) {
        const errMsg =
          err instanceof Error
            ? err.message
            : String(err)

        updateRow(id, {
          status: 'error',
          error: errMsg,
        })

        errorCount++
      }
    }

    if (abortRef.current.signal.aborted) {
      showMessage(
        'caution',
        'Import cancelled',
        `${successCount} imported${
          errorCount > 0
            ? `, ${errorCount} failed`
            : ''
        }.`,
      )
    } else {
      showMessage(
        errorCount === 0
          ? 'positive'
          : errorCount === ids.length
            ? 'critical'
            : 'caution',
        'Import complete',
        `${successCount} imported${
          errorCount > 0
            ? `, ${errorCount} failed`
            : ''
        }.`,
      )
    }
  }, [
    selected,
    pillarbaseConfig,
    sanityClient,
    publishMode,
    createCategories,
    showMessage,
  ])

  // ───────────────────────────────────────────────────────────────────────────
  // Derived state
  // ───────────────────────────────────────────────────────────────────────────

  const isImporting = rows.some(
    (row) => row.status === 'importing',
  )

  const allSelected =
    rows.length > 0 &&
    selected.size === rows.length

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <Box
      padding={4}
      style={{
        minHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <Container width={2}>
        <Stack space={5}>
          {/* Header */}

          <Stack space={2}>
            <Heading as="h1" size={3}>
              Pillarbase Importer
            </Heading>

            <Text muted size={1}>
              Import articles from Pillarbase into
              Sanity as <code>post</code> documents.
            </Text>
          </Stack>

          {/* Message */}

          {message && (
            <Card
              padding={3}
              radius={2}
              tone={message.tone}
            >
              <Stack space={2}>
                <Text weight="semibold">
                  {message.title}
                </Text>

                {message.description && (
                  <Text size={1} muted>
                    {message.description}
                  </Text>
                )}
              </Stack>
            </Card>
          )}

          {/* Configuration */}

          <Card
            padding={4}
            radius={2}
            shadow={1}
          >
            <Stack space={3}>
              <Flex
                justify="space-between"
                align="center"
              >
                <Text weight="semibold">
                  Configuration
                </Text>

                <Button
                  text={
                    showConfig ? 'Hide' : 'Edit'
                  }
                  mode="ghost"
                  fontSize={1}
                  padding={2}
                  onClick={() =>
                    setShowConfig(
                      (value) => !value,
                    )
                  }
                />
              </Flex>

              {showConfig && (
                <Stack space={3}>
                  {/* API URL */}

                  <Stack space={2}>
                    <Text
                      size={1}
                      weight="semibold"
                    >
                      Pillarbase API URL
                    </Text>

                    <TextInput
                      value={apiUrl}
                      onChange={(event) =>
                        setApiUrl(
                          (
                            event.target as HTMLInputElement
                          ).value,
                        )
                      }
                      placeholder="https://app.pillarbase.ai"
                      fontSize={1}
                    />
                  </Stack>

                  {/* API Token */}

                  <Stack space={2}>
                    <Text
                      size={1}
                      weight="semibold"
                    >
                      API Token
                    </Text>

                    <TextInput
                      value={apiToken}
                      onChange={(event) =>
                        setApiToken(
                          (
                            event.target as HTMLInputElement
                          ).value,
                        )
                      }
                      placeholder="your-pillarbase-api-token"
                      type="password"
                      fontSize={1}
                    />

                    <Text size={0} muted>
                      Find your token in Pillarbase
                      → Settings → API. Set{' '}
                      <code>
                        SANITY_STUDIO_PILLARBASE_API_TOKEN
                      </code>{' '}
                      in <code>.env</code> to avoid
                      entering it each time.
                    </Text>
                  </Stack>

                  {/* Endpoint information */}

                  <Card
                    padding={3}
                    radius={2}
                    tone="caution"
                  >
                    <Stack space={2}>
                      <Text
                        size={1}
                        weight="semibold"
                      >
                        About API endpoint paths
                      </Text>

                      <Text size={0} muted>
                        Pillarbase does not publish API
                        documentation publicly. If
                        loading articles fails with a
                        404 error, the endpoint paths
                        need to be updated. Contact
                        Pillarbase support to confirm:
                      </Text>

                      <Box
                        padding={2}
                        style={{
                          fontFamily:
                            'monospace',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto',
                        }}
                      >
                        <Text size={0}>
                          {`Articles list: ${apiUrl}/api/v1/articles
Single article: ${apiUrl}/api/v1/articles/:id`}
                        </Text>
                      </Box>

                      <Text size={0} muted>
                        Update{' '}
                        <code>
                          src/integrations/pillarbaseMcp.ts
                        </code>{' '}
                        →{' '}
                        <code>
                          PILLARBASE_ENDPOINTS
                        </code>{' '}
                        once confirmed.
                      </Text>
                    </Stack>
                  </Card>
                </Stack>
              )}
            </Stack>
          </Card>

          {/* Import options */}

          <Card
            padding={4}
            radius={2}
            shadow={1}
          >
            <Stack space={3}>
              <Text weight="semibold">
                Import options
              </Text>

              <Flex
                gap={4}
                wrap="wrap"
              >
                <Stack space={2}>
                  <Text size={1}>
                    After import
                  </Text>

                  <Select
                    value={publishMode}
                    onChange={(event) =>
                      setPublishMode(
                        (
                          event.target as HTMLSelectElement
                        ).value as
                          | 'draft'
                          | 'publish',
                      )
                    }
                    fontSize={1}
                  >
                    <option value="draft">
                      Save as draft
                    </option>

                    <option value="publish">
                      Publish immediately
                    </option>
                  </Select>
                </Stack>

                <Flex
                  align="center"
                  gap={2}
                >
                  <Checkbox
                    id="create-cats"
                    checked={createCategories}
                    onChange={(event) =>
                      setCreateCategories(
                        (
                          event.target as HTMLInputElement
                        ).checked,
                      )
                    }
                  />

                  <label htmlFor="create-cats">
                    <Text size={1}>
                      Create missing categories
                    </Text>
                  </label>
                </Flex>
              </Flex>
            </Stack>
          </Card>

          {/* Actions */}

          <Flex
            gap={3}
            wrap="wrap"
            align="center"
          >
            <Button
              text={
                loading
                  ? 'Loading…'
                  : fetched
                    ? 'Refresh articles'
                    : 'Load articles from Pillarbase'
              }
              tone="primary"
              onClick={loadArticles}
              disabled={
                loading ||
                isImporting ||
                !apiToken.trim()
              }
              icon={
                loading ? Spinner : undefined
              }
            />

            {rows.length > 0 && (
              <Button
                text={`Import selected (${selected.size})`}
                tone="positive"
                onClick={runImport}
                disabled={
                  selected.size === 0 ||
                  isImporting
                }
              />
            )}

            {isImporting && (
              <Button
                text="Cancel"
                tone="critical"
                mode="ghost"
                onClick={() =>
                  abortRef.current?.abort()
                }
              />
            )}
          </Flex>

          {/* Loading */}

          {loading && (
            <Flex
              justify="center"
              padding={6}
            >
              <Spinner muted />
            </Flex>
          )}

          {/* Empty state */}

          {fetched &&
            !loading &&
            rows.length === 0 && (
              <Card
                padding={5}
                radius={2}
                tone="transparent"
              >
                <Stack space={2}>
                  <Text weight="semibold">
                    No articles found
                  </Text>

                  <Text muted size={1}>
                    Either no articles exist in
                    Pillarbase, or the API endpoint
                    path needs to be updated in{' '}
                    <code>
                      src/integrations/pillarbaseMcp.ts
                    </code>
                    .
                  </Text>
                </Stack>
              </Card>
            )}

          {/* Article list */}

          {rows.length > 0 && (
            <Card
              radius={2}
              shadow={1}
              overflow="hidden"
            >
              {/* Select all */}

              <Box
                padding={3}
                style={{
                  borderBottom:
                    '1px solid var(--card-border-color)',
                }}
              >
                <Flex
                  align="center"
                  gap={3}
                >
                  <Checkbox
                    id="select-all"
                    checked={allSelected}
                    onChange={toggleAll}
                  />

                  <label htmlFor="select-all">
                    <Text
                      size={1}
                      weight="semibold"
                    >
                      {allSelected
                        ? 'Deselect all'
                        : 'Select all'}{' '}
                      ({rows.length})
                    </Text>
                  </label>
                </Flex>
              </Box>

              {/* Rows */}

              {rows.map((row, index) => {
                const {
                  article,
                  status,
                  error,
                  sanityId,
                  slug,
                } = row

                const isSelected =
                  selected.has(article.id)

                return (
                  <Box
                    key={article.id}
                    padding={3}
                    style={{
                      borderBottom:
                        index <
                        rows.length - 1
                          ? '1px solid var(--card-border-color)'
                          : 'none',

                      background: isSelected
                        ? 'rgba(0,0,0,.04)'
                        : 'transparent',
                    }}
                  >
                    <Flex
                      align="flex-start"
                      gap={3}
                    >
                      <Box
                        style={{
                          paddingTop: 2,
                        }}
                      >
                        <Checkbox
                          id={`row-${article.id}`}
                          checked={isSelected}
                          onChange={() =>
                            toggleRow(
                              article.id,
                            )
                          }
                          disabled={isImporting}
                        />
                      </Box>

                      <Box flex={1}>
                        <label
                          htmlFor={`row-${article.id}`}
                          style={{
                            cursor: 'pointer',
                            display: 'block',
                          }}
                        >
                          <Text
                            size={1}
                            weight="semibold"
                          >
                            {article.title ||
                              '(untitled)'}
                          </Text>

                          <Text
                            size={0}
                            muted
                          >
                            ID: {article.id}

                            {article.target_keyword &&
                              ` · 🔑 ${article.target_keyword}`}

                            {article.published_at &&
                              ` · ${new Date(
                                article.published_at,
                              ).toLocaleDateString()}`}
                          </Text>
                        </label>
                      </Box>

                      <Flex
                        gap={2}
                        align="center"
                        style={{
                          flexShrink: 0,
                        }}
                      >
                        {article.status && (
                          <Badge
                            tone={
                              article.status ===
                              'published'
                                ? 'positive'
                                : article.status ===
                                    'approved'
                                  ? 'primary'
                                  : 'caution'
                            }
                            size={0}
                          >
                            {article.status}
                          </Badge>
                        )}

                        {status ===
                          'importing' && (
                          <Spinner muted />
                        )}

                        {status === 'done' && (
                          <Badge
                            tone="positive"
                            size={0}
                          >
                            ✓ imported
                          </Badge>
                        )}

                        {status === 'error' && (
                          <Badge
                            tone="critical"
                            size={0}
                          >
                            ✗ error
                          </Badge>
                        )}
                      </Flex>
                    </Flex>

                    {status === 'done' &&
                      slug && (
                        <Box
                          marginTop={1}
                          marginLeft={6}
                        >
                          <Text
                            size={0}
                            muted
                          >
                            Slug:{' '}
                            <code>
                              {slug}
                            </code>
                            {' · '}
                            <code>
                              {sanityId}
                            </code>
                          </Text>
                        </Box>
                      )}

                    {status === 'error' &&
                      error && (
                        <Box
                          marginTop={1}
                          marginLeft={6}
                        >
                          <Text
                            size={0}
                            style={{
                              color:
                                'var(--card-critical-fg-color)',
                            }}
                          >
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