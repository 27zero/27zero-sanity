#!/usr/bin/env ts-node
/**
 * scripts/migrate-etapa12-resources.ts
 *
 * Etapa 12 — Webflow "Resources" collection → Sanity `resource` documents.
 *
 * Documented exception to the project rule "Claude Code touches code, not
 * content": this script creates documents. It ONLY ever writes drafts
 * (`drafts.` prefix) and never publishes. A human reviews before publishing.
 *
 * Source data
 * ───────────
 * Webflow has no API token in this project — the Webflow MCP connector is
 * OAuth-based and is not reachable from a Node process. So the collection
 * items are read via the MCP connector by the agent and staged to a JSON file,
 * which this script consumes with --input. The file is the verbatim
 * `data_cms_tool > list_collection_items` response. Image binaries are pulled
 * straight from the public Webflow CDN, which needs no credentials.
 *
 * Usage
 * ─────
 *   npx ts-node scripts/migrate-etapa12-resources.ts --input <staged.json> --dry-run
 *   npx ts-node scripts/migrate-etapa12-resources.ts --input <staged.json> --limit 5
 *
 * Flags
 * ─────
 *   --input <path>   Staged Webflow JSON response (required)
 *   --limit <n>      Max items to process (default 5 — the pilot batch)
 *   --dry-run        Convert and report, but perform no writes and no uploads
 *   --out <path>     Report file (default scripts/reports/etapa12-resources-<ts>.json)
 *
 * Requires SANITY_WRITE_TOKEN (Editor+) in .env. The token is read from the
 * environment only — never logged, never written to the report.
 *
 * Idempotency: documents use a deterministic id derived from the Webflow item
 * id (`drafts.resource-webflow-<id>`) and are written with createOrReplace, so
 * re-running refreshes the same drafts instead of duplicating them. Note that a
 * re-run therefore DISCARDS manual edits made to those drafts in the Studio.
 */

import 'dotenv/config'
import {createClient} from '@sanity/client'
import {randomBytes} from 'crypto'
import {readFileSync, writeFileSync, mkdirSync} from 'fs'
import {dirname, resolve} from 'path'

// ── Reference documents already in the dataset (verified via MCP) ────────────
const AUTHOR_27ZERO_ID = '6467c01d-ed37-487f-8e2d-85d53b233803'

// ── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const flagValue = (f: string) => {
  const i = args.indexOf(f)
  return i !== -1 ? args[i + 1] : undefined
}
const DRY_RUN = args.includes('--dry-run')
const INPUT = flagValue('--input')
const LIMIT = Number(flagValue('--limit') ?? 5)
const OUT =
  flagValue('--out') ??
  `scripts/reports/etapa12-resources-${new Date().toISOString().replace(/[:.]/g, '-')}.json`

if (!INPUT) {
  console.error('error: --input <staged-webflow.json> is required. See the header docblock.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// ── Per-item warning collector ──────────────────────────────────────────────
type Warning = {webflowId: string; field: string; reason: string}
let warnings: Warning[] = []
let currentId = ''
const warn = (field: string, reason: string) =>
  warnings.push({webflowId: currentId, field, reason})

const key = () => randomBytes(6).toString('hex')

// ── HTML entities ───────────────────────────────────────────────────────────
const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
}

function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, body) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10)
      return Number.isFinite(code) ? String.fromCodePoint(code) : m
    }
    return ENTITIES[body] ?? ENTITIES[body.toLowerCase()] ?? m
  })
}

/** Webflow pads empty paragraphs with ZWJ/ZWSP; those are not real content. */
const isBlank = (s: string) => !s.replace(/[​-‍﻿\s]/g, '')

// ── Inline HTML → Portable Text spans ───────────────────────────────────────
const DECORATOR_TAGS: Record<string, string> = {
  strong: 'strong',
  b: 'strong',
  em: 'em',
  i: 'em',
  u: 'underline',
  s: 'strike-through',
  strike: 'strike-through',
  code: 'code',
}
const VOID_TAGS = new Set(['br', 'img', 'hr', 'input', 'source', 'meta'])
/** Inline wrappers that carry no semantics we keep — unwrap, do not warn. */
const TRANSPARENT_TAGS = new Set(['span', 'div', 'font', 'sup', 'sub', 'small'])

function parseInline(html: string): {children: any[]; markDefs: any[]} {
  const children: any[] = []
  const markDefs: any[] = []
  const stack: string[] = [] // active mark keys/decorators, innermost last

  const push = (text: string) => {
    if (!text) return
    const marks = [...stack].filter(Boolean)
    const last = children[children.length - 1]
    // Merge with the previous span when the mark set is identical.
    if (
      last &&
      last.marks.length === marks.length &&
      last.marks.every((mk: string, i: number) => mk === marks[i])
    ) {
      last.text += text
      return
    }
    children.push({_key: key(), _type: 'span', marks, text})
  }

  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g
  let cursor = 0
  let m: RegExpExecArray | null

  while ((m = tagRe.exec(html)) !== null) {
    push(decodeEntities(html.slice(cursor, m.index)))
    cursor = m.index + m[0].length

    const tag = m[1].toLowerCase()
    const isClose = m[0][1] === '/'

    if (VOID_TAGS.has(tag)) {
      if (tag === 'br') push('\n')
      else if (tag === 'img')
        warn('body', 'inline <img> dropped — images inside rich text are not migrated')
      continue
    }

    if (!isClose) {
      if (DECORATOR_TAGS[tag]) {
        stack.push(DECORATOR_TAGS[tag])
      } else if (tag === 'a') {
        const href = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(m[2] ?? '')
        const url = decodeEntities(href?.[2] ?? href?.[3] ?? href?.[4] ?? '')
        if (!url) {
          warn('body', '<a> without href — kept as plain text')
          stack.push('') // placeholder keeps the stack balanced for the close tag
        } else {
          const k = key()
          markDefs.push({_key: k, _type: 'link', href: url})
          stack.push(k)
        }
      } else if (TRANSPARENT_TAGS.has(tag)) {
        stack.push('')
      } else {
        warn('body', `unexpected inline <${tag}> — tag dropped, text kept`)
        stack.push('')
      }
    } else {
      stack.pop()
    }
  }
  push(decodeEntities(html.slice(cursor)))

  const used = new Set(children.flatMap((c: any) => c.marks))
  return {children, markDefs: markDefs.filter((d) => used.has(d._key))}
}

// ── Block-level HTML → Portable Text ────────────────────────────────────────
const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

/** Index just past the close tag matching the tag opened at `from`. */
function matchingClose(html: string, from: number, tag: string): number {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi')
  re.lastIndex = from
  let depth = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    depth += m[1] ? -1 : 1
    if (depth === 0) return re.lastIndex
  }
  return html.length
}

function block(style: string, inner: string, listItem?: string, level?: number) {
  const {children, markDefs} = parseInline(inner)
  if (!children.length || isBlank(children.map((c) => c.text).join(''))) return null
  for (const c of children) c.text = c.text.replace(/ /g, ' ')
  const b: any = {_key: key(), _type: 'block', style, children, markDefs}
  if (listItem) {
    b.listItem = listItem
    b.level = level ?? 1
  }
  return b
}

function htmlToBlocks(html: string, level = 1): any[] {
  const out: any[] = []
  if (!html) return out

  const openRe = /<([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g
  let cursor = 0
  let m: RegExpExecArray | null

  while ((m = openRe.exec(html)) !== null) {
    const tag = m[1].toLowerCase()
    const isBlockTag =
      tag === 'p' ||
      HEADINGS.has(tag) ||
      tag === 'ul' ||
      tag === 'ol' ||
      tag === 'blockquote' ||
      tag === 'figure'
    if (!isBlockTag) continue
    if (m.index < cursor) continue

    // Loose text before this block becomes its own paragraph.
    const before = html.slice(cursor, m.index)
    if (!isBlank(before.replace(/<[^>]*>/g, ''))) {
      const b = block('normal', before)
      if (b) out.push(b)
    }

    const end = matchingClose(html, m.index, tag)
    const inner = html
      .slice(m.index + m[0].length, end)
      .replace(new RegExp(`</${tag}\\s*>$`, 'i'), '')

    if (tag === 'p') {
      const b = block('normal', inner)
      if (b) out.push(b)
    } else if (HEADINGS.has(tag)) {
      const b = block(tag, inner)
      if (b) out.push(b)
    } else if (tag === 'blockquote') {
      const b = block('blockquote', inner)
      if (b) out.push(b)
    } else if (tag === 'ul' || tag === 'ol') {
      const listItem = tag === 'ul' ? 'bullet' : 'number'
      const liRe = /<li\b[^>]*>/gi
      let lm: RegExpExecArray | null
      while ((lm = liRe.exec(inner)) !== null) {
        const liEnd = matchingClose(inner, lm.index, 'li')
        let liInner = inner.slice(lm.index + lm[0].length, liEnd).replace(/<\/li\s*>$/i, '')
        // A nested list inside the <li> becomes deeper-level blocks.
        const nested: any[] = []
        liInner = liInner.replace(/<(ul|ol)\b[\s\S]*?<\/\1\s*>/gi, (sub) => {
          nested.push(...htmlToBlocks(sub, level + 1))
          return ''
        })
        const b = block('normal', liInner, listItem, level)
        if (b) out.push(b)
        out.push(...nested)
        liRe.lastIndex = liEnd
      }
    } else if (tag === 'figure') {
      warn('body', '<figure> (embed/video) dropped — no matching block type in the resource schema')
    }

    cursor = end
    openRe.lastIndex = end
  }

  const tail = html.slice(cursor)
  if (!isBlank(tail.replace(/<[^>]*>/g, ''))) {
    const b = block('normal', tail)
    if (b) out.push(b)
  }
  return out
}

// ── Image upload (cached per source URL) ────────────────────────────────────
const assetCache = new Map<string, string>()

async function uploadImage(url: string, field: string): Promise<string | null> {
  if (assetCache.has(url)) return assetCache.get(url)!
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    const buf = Buffer.from(await res.arrayBuffer())
    const filename = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image')
    const asset = await client.assets.upload('image', buf, {
      filename,
      contentType: res.headers.get('content-type') ?? undefined,
    })
    assetCache.set(url, asset._id)
    return asset._id
  } catch (err: any) {
    warn(field, `image upload failed (${url}): ${err.message}`)
    return null
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.SANITY_WRITE_TOKEN && !DRY_RUN) {
    console.error('error: SANITY_WRITE_TOKEN is not set in .env')
    process.exit(1)
  }

  const staged = JSON.parse(readFileSync(resolve(INPUT!), 'utf8'))
  const items = (staged.result?.items ?? staged.items ?? []).slice(0, LIMIT)
  if (!items.length) {
    console.error('error: no items found in the staged input file')
    process.exit(1)
  }

  // Category lookup, matched by title (case-insensitive) as the plan specifies.
  const categories: {_id: string; title: string}[] = await client.fetch(
    `*[_type == "resourceCategory"]{_id, title}`,
  )
  const byTitle = new Map(categories.map((c) => [c.title.toLowerCase().trim(), c._id]))
  console.log(
    `Loaded ${categories.length} resourceCategory docs: ${categories.map((c) => c.title).join(', ')}`,
  )
  console.log(
    `Processing ${items.length} of ${staged.result?.pagination?.total ?? '?'} Webflow items${
      DRY_RUN ? ' (DRY RUN — no writes)' : ''
    }\n`,
  )

  const report: any[] = []
  const createdIds: string[] = []
  let ok = 0
  let withWarnings = 0
  let failed = 0

  for (const item of items) {
    currentId = item.id
    warnings = []
    const f = item.fieldData ?? {}
    const label = String(f.name ?? item.id).slice(0, 60)

    try {
      const title = f.name ?? f['title-card'] ?? null
      if (!title) warn('title', 'no name/title-card in source')

      const slug = f.slug ?? null
      if (!slug) warn('slug', 'no slug in source')

      if (!f['description-card']) warn('shortDescription', 'description-card empty in source')

      // Rich text
      const body = htmlToBlocks(f['blog-content'] ?? '')
      if (!body.length) warn('body', 'blog-content empty or produced no blocks')
      const contentCta = htmlToBlocks(f['content-cta'] ?? '')
      if (!contentCta.length) warn('contentCta', 'content-cta empty or produced no blocks')

      // Category — Webflow stores a raw item id; match by title against Sanity.
      let category: any = undefined
      const rawCat = f['category-2']
      if (!rawCat) {
        warn('category', 'category-2 empty in source — left unset')
      } else {
        const catTitle = staged.categoryTitlesById?.[rawCat] ?? rawCat
        const matchId = byTitle.get(String(catTitle).toLowerCase().trim())
        if (matchId) category = {_type: 'reference', _ref: matchId}
        else warn('category', `no resourceCategory matched "${catTitle}" — left unset`)
      }

      // Date
      let publishedAt: string | undefined
      if (f['date-publish']) publishedAt = new Date(f['date-publish']).toISOString()
      else warn('publishedAt', 'date-publish empty in source — left unset')

      // Images. The schema requires alt text but Webflow has none on any of
      // these assets, so alt falls back to the title and is flagged for review.
      const buildImage = async (src: any, target: string) => {
        if (!src?.url) {
          warn(target, 'no image in source — left unset')
          return undefined
        }
        const assetId = DRY_RUN ? '(dry-run)' : await uploadImage(src.url, target)
        if (!assetId) return undefined
        const alt = src.alt ?? title ?? ''
        if (!src.alt) warn(target, 'alt missing in Webflow — defaulted to the title, needs review')
        return {_type: 'image', asset: {_type: 'reference', _ref: assetId}, alt}
      }
      const cardThumbnail = await buildImage(f['image-post'], 'cardThumbnail')
      const heroBanner = await buildImage(f['image-page'], 'heroBanner')

      const _id = `drafts.resource-webflow-${item.id}`
      const doc: any = {
        _id,
        _type: 'resource',
        title,
        slug: slug ? {_type: 'slug', current: slug} : undefined,
        shortDescription: f['description-card'] ?? undefined,
        body,
        contentCta,
        category,
        isFeatured: Boolean(f.featured),
        publishedAt,
        author: {_type: 'reference', _ref: AUTHOR_27ZERO_ID},
        cardThumbnail,
        heroBanner,
      }
      for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]

      if (!DRY_RUN) await client.createOrReplace(doc)
      createdIds.push(_id)

      if (warnings.length) {
        withWarnings++
        console.log(`  ~ ${label}\n    ${_id}  (${warnings.length} warning(s))`)
        for (const w of warnings) console.log(`      · ${w.field}: ${w.reason}`)
      } else {
        ok++
        console.log(`  + ${label}\n    ${_id}`)
      }
      report.push({
        webflowId: item.id,
        title,
        slug,
        sanityId: _id,
        status: warnings.length ? 'warnings' : 'ok',
        blocks: body.length,
        ctaBlocks: contentCta.length,
        warnings,
      })
    } catch (err: any) {
      failed++
      console.log(`  ! ${label}\n    FAILED: ${err.message}`)
      report.push({
        webflowId: item.id,
        title: f.name ?? null,
        sanityId: null,
        status: 'failed',
        error: err.message,
        warnings,
      })
    }
  }

  const summary = {
    ranAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    processed: items.length,
    ok,
    withWarnings,
    failed,
    createdDraftIds: createdIds,
    items: report,
  }
  mkdirSync(dirname(resolve(OUT)), {recursive: true})
  writeFileSync(resolve(OUT), JSON.stringify(summary, null, 2))

  console.log(`\n── Pilot summary ──────────────────────────────`)
  console.log(`  clean:    ${ok}`)
  console.log(`  warnings: ${withWarnings}`)
  console.log(`  failed:   ${failed}`)
  console.log(`  drafts:   ${createdIds.length}${DRY_RUN ? ' (dry run — nothing written)' : ''}`)
  console.log(`  report:   ${OUT}`)
  console.log(`\nStopping after the pilot batch. Rerun with a larger --limit only after review.`)
}

main().catch((err) => {
  console.error('fatal:', err)
  process.exit(1)
})
