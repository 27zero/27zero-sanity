#!/usr/bin/env ts-node
/**
 * scripts/migrate-etapa12-mentor.ts
 *
 * Etapa 12 — Webflow "EdTech Mentors" collection → Sanity `edtechMentor` documents.
 *
 * Sibling of migrate-etapa12-resources.ts; same guarantees. Documented exception
 * to "Claude Code touches code, not content": this script creates documents, but
 * ONLY ever as drafts (`drafts.` prefix) and never publishes.
 *
 * Source data
 * ───────────
 * Same staging mechanism as the Resources migration: Webflow has no API token
 * here (the MCP connector is OAuth and unreachable from Node), so the agent
 * reads items via MCP and stages the verbatim `list_collection_items` response
 * to a JSON file consumed with --input. Image binaries come from the public
 * Webflow CDN, which needs no credentials.
 *
 * Usage
 * ─────
 *   npx ts-node -T scripts/migrate-etapa12-mentor.ts --input <staged.json> --dry-run
 *   npx ts-node -T scripts/migrate-etapa12-mentor.ts --input <staged.json> --limit 5
 *
 * `-T` (transpile-only) is required: @types/node is not installed in this repo,
 * so full type-checking fails on `process`/`Buffer` for every script in here.
 *
 * Flags
 * ─────
 *   --input <path>   Staged Webflow JSON response (required)
 *   --limit <n>      Max items to process (default 5 — the pilot batch)
 *   --dry-run        Convert and report, but perform no writes and no uploads
 *   --out <path>     Report file (default scripts/reports/etapa12-mentor-<ts>.json)
 *
 * Requires SANITY_WRITE_TOKEN (Editor+) in .env — read from the environment
 * only, never logged and never written to the report.
 *
 * Idempotency: deterministic ids (`drafts.edtechMentor-webflow-<id>`) written
 * with createOrReplace, so a re-run refreshes the same drafts instead of
 * duplicating them — and DISCARDS manual Studio edits to those drafts.
 *
 * Heading levels — read this before changing the parser
 * ─────────────────────────────────────────────────────
 * The Webflow field help text tells editors to mark questions as H2, and the
 * Etapa 12 brief says H3. The real data does neither consistently: across the
 * first five interviews the question heading is H2 in one, H4 in two, and a
 * genuine H2/H3 outline hierarchy in another. There is no reliable signal that
 * separates "question" from "section heading", so this script does NOT try to
 * classify them. It preserves the heading hierarchy and only remaps levels the
 * site cannot style: the mentor page (ARTICLE_CLASSES in
 * src/pages/edtech-mentor/[slug].astro) styles h2 and h3 only, so h1 → h2 and
 * h4/h5/h6 → h3. Every remap is logged as a warning.
 */

import 'dotenv/config'
import {createClient} from '@sanity/client'
import {randomBytes} from 'crypto'
import {readFileSync, writeFileSync, mkdirSync} from 'fs'
import {dirname, resolve} from 'path'

// ── Reference documents already in the dataset (verified via MCP) ────────────
const AUTHOR_27ZERO_ID = '6467c01d-ed37-487f-8e2d-85d53b233803'
/** Fallback category, per the Etapa 11 precedent set with "Ready Education". */
const CATEGORY_CEOS_ID = '087d6a0e-10cc-4b3a-a330-e6b7429aff97'

/**
 * `type` is a Webflow Option field, so items carry the option's id, not its
 * name. Ids come from data_cms_tool > get_collection_details.
 */
const WEBFLOW_TYPE_OPTIONS: Record<string, string> = {
  '56a9355aab64de7898ec3257acb35651': 'Founders',
  a21d5b2223fecc362b3c9c7ce9fe5ebf: 'Essentials',
  '5dd8edf7435ad5709c9a935e7d931ce4': 'Investors',
}

/** Webflow pluralises, Sanity does not ("Investors" vs "Investor"). */
const normalizeCategory = (s: string) => s.toLowerCase().trim().replace(/s$/, '')

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
  `scripts/reports/etapa12-mentor-${new Date().toISOString().replace(/[:.]/g, '-')}.json`

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
const seenWarnings = new Set<string>()
const warn = (field: string, reason: string) => {
  // Collapse repeats — one <figure> message per document, not per occurrence.
  const k = `${field}::${reason}`
  if (seenWarnings.has(k)) return
  seenWarnings.add(k)
  warnings.push({webflowId: currentId, field, reason})
}

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

/** RichText → plain text, for `introText` (a `text` field, not Portable Text). */
function htmlToPlainText(html: string): string {
  if (!html) return ''
  return decodeEntities(
    html
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/\s*(p|div|h[1-6]|li)\s*>/gi, '\n\n')
      .replace(/<[^>]*>/g, ''),
  )
    .replace(/ /g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

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
const TRANSPARENT_TAGS = new Set(['span', 'div', 'font', 'sup', 'sub', 'small'])

function parseInline(html: string): {children: any[]; markDefs: any[]} {
  const children: any[] = []
  const markDefs: any[] = []
  const stack: string[] = []

  const push = (text: string) => {
    if (!text) return
    const marks = [...stack].filter(Boolean)
    const last = children[children.length - 1]
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
        warn('body', 'inline <img> dropped — no image block type in the interview body')
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
          stack.push('')
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

/**
 * The mentor page styles h2 and h3 only — anything else renders unstyled, so it
 * is remapped to the nearest level the template can paint.
 */
function headingStyle(tag: string): string {
  if (tag === 'h2' || tag === 'h3') return tag
  const mapped = tag === 'h1' ? 'h2' : 'h3'
  warn(
    'body',
    `<${tag}> remapped to <${mapped}> — the mentor template styles h2/h3 only`,
  )
  return mapped
}

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

/**
 * `<div class="highlight">` → a `pearlOfWisdom` block, per the pattern the
 * Webflow field help text tells editors to paste.
 *
 * The inner `<span class="highlight-pearl">` is a per-pearl label ("✨ Blank
 * Sheet, No Classrooms") and maps to `pearlOfWisdom.title`. It is kept verbatim,
 * leading sparkle included, because that decoration is part of what the editors
 * typed — stripping it is a content decision, not a migration one.
 *
 * Interviews that never customised the label carry the literal template default
 * ("✨ Pearl of wisdom"). Those get no title at all: the field is optional and
 * the site already renders that exact heading itself.
 *
 * Per the Etapa 12 brief: the quote text also appears verbatim as a normal
 * paragraph elsewhere in the body. That duplication is intentional and is NOT
 * deduplicated here.
 */
const PEARL_DEFAULT_LABEL = /^\s*(?:✨\s*)?pearl of wisdom\s*$/i

function pearlBlock(inner: string): any | null {
  const label = /<span[^>]*class\s*=\s*["'][^"']*highlight-pearl[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(
    inner,
  )
  let title: string | undefined
  if (label) {
    const text = htmlToPlainText(label[1])
    if (PEARL_DEFAULT_LABEL.test(text)) {
      warn('body', 'pearl label is the template default — title left unset')
    } else if (text) {
      title = text
    }
  } else {
    warn('body', 'pearl has no highlight-pearl label — title left unset')
  }

  const quote = htmlToPlainText(inner.replace(/<span[^>]*highlight-pearl[\s\S]*?<\/span>/i, ''))
  if (!quote) {
    warn('body', 'empty pearlOfWisdom block skipped')
    return null
  }
  return {_key: key(), _type: 'pearlOfWisdom', ...(title ? {title} : {}), quote}
}

const isHighlight = (attrs: string, inner: string) =>
  /class\s*=\s*["'][^"']*\bhighlight\b[^"']*["']/i.test(attrs) ||
  /^\s*<div[^>]*class\s*=\s*["'][^"']*\bhighlight\b/i.test(inner)

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
      tag === 'figure' ||
      tag === 'div'
    if (!isBlockTag) continue
    if (m.index < cursor) continue

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
      const b = block(headingStyle(tag), inner)
      if (b) out.push(b)
    } else if (tag === 'blockquote') {
      const b = block('blockquote', inner)
      if (b) out.push(b)
    } else if (tag === 'div') {
      // Either a pearl, or a transparent wrapper Webflow adds around embeds.
      if (isHighlight(m[2] ?? '', inner)) {
        const p = pearlBlock(inner)
        if (p) out.push(p)
      } else {
        out.push(...htmlToBlocks(inner, level))
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const listItem = tag === 'ul' ? 'bullet' : 'number'
      const liRe = /<li\b[^>]*>/gi
      let lm: RegExpExecArray | null
      while ((lm = liRe.exec(inner)) !== null) {
        const liEnd = matchingClose(inner, lm.index, 'li')
        let liInner = inner.slice(lm.index + lm[0].length, liEnd).replace(/<\/li\s*>$/i, '')
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
      warn(
        'body',
        '<figure> (video/image embed) dropped — no matching block type in the interview schema',
      )
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

// ── Rapid fire ──────────────────────────────────────────────────────────────
/**
 * Pair 5's answer field is misspelled `fire-asnwer-5` in the live Webflow
 * collection (confirmed in get_collection_details — the display name is right,
 * the slug is not). Only pair 5; the other nine follow the pattern.
 */
const fireAnswerField = (n: number) => (n === 5 ? 'fire-asnwer-5' : `fire-answer-${n}`)

function buildRapidFire(f: Record<string, any>) {
  const questions: any[] = []
  for (let n = 1; n <= 10; n++) {
    const question = f[`fire-question-${n}`]
    if (!question || !String(question).trim()) continue
    const answer = f[fireAnswerField(n)]
    if (!answer || !String(answer).trim()) {
      warn('rapidFire', `pair ${n} has a question but no answer — answer left empty`)
    }
    questions.push({
      _key: key(),
      _type: 'rapidFireItem',
      question: String(question).trim(),
      ...(answer ? {answer: String(answer).trim()} : {}),
    })
  }
  return questions
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

  const categories: {_id: string; title: string}[] = await client.fetch(
    `*[_type == "mentorCategory"]{_id, title}`,
  )
  const byTitle = new Map(categories.map((c) => [normalizeCategory(c.title), c._id]))
  const ceosExists = categories.some((c) => c._id === CATEGORY_CEOS_ID)
  console.log(
    `Loaded ${categories.length} mentorCategory docs: ${categories.map((c) => c.title).join(', ')}`,
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
    seenWarnings.clear()
    const f = item.fieldData ?? {}
    const label = String(f.name ?? item.id).slice(0, 58)

    try {
      const guestName = f['interviewee-name'] ?? null
      if (!guestName) warn('guestName', 'interviewee-name empty in source')

      const title = f['article-name'] ?? null
      if (!title) warn('title', 'article-name empty in source')
      else if (String(title).length > 120)
        warn('title', `article-name is ${String(title).length} chars — schema caps title at 120`)

      const slug = f.slug ?? null
      if (!slug) warn('slug', 'no slug in source')

      if (!f['position-company']) warn('guestCompany', 'position-company empty in source')

      // Category is REQUIRED by the schema, so an unresolved one is a failure,
      // not a warning — the fallback to CEOs follows the Etapa 11 precedent.
      const rawType = f.type
      const typeName = rawType ? WEBFLOW_TYPE_OPTIONS[rawType] : undefined
      let categoryId: string | undefined
      if (typeName) {
        categoryId = byTitle.get(normalizeCategory(typeName))
        if (!categoryId) {
          warn('category', `no mentorCategory matched "${typeName}" — fell back to CEOs`)
        }
      } else {
        warn(
          'category',
          rawType
            ? `unknown Webflow type option "${rawType}" — fell back to CEOs`
            : 'no type in source — fell back to CEOs',
        )
      }
      if (!categoryId) {
        if (!ceosExists) {
          throw new Error(
            'category could not be resolved and the CEOs fallback document is missing — ' +
              'the schema requires category, so this document would fail validation',
          )
        }
        categoryId = CATEGORY_CEOS_ID
      }

      const body = htmlToBlocks(f.answer ?? '')
      if (!body.length) warn('body', 'answer empty or produced no blocks')
      const pearls = body.filter((b) => b._type === 'pearlOfWisdom').length

      const introText = htmlToPlainText(f['article-intro-new'] ?? '')
      if (!introText) warn('introText', 'article-intro-new empty in source')

      const rapidFireQuestions = buildRapidFire(f)
      if (!rapidFireQuestions.length) warn('rapidFire', 'no rapid-fire pairs in source')

      // Images. guestPhoto.alt is required by the schema; the other three are
      // optional but get the same defaulted alt for consistency.
      const portraitUrl = f.portrait?.url
      let guestPhoto: any
      if (!portraitUrl) {
        warn('guestPhoto', 'no portrait in source — left unset')
      } else {
        const assetId = DRY_RUN ? '(dry-run)' : await uploadImage(portraitUrl, 'guestPhoto')
        if (assetId) {
          if (!f.portrait.alt)
            warn('guestPhoto', 'alt missing in Webflow — defaulted to the guest name, needs review')
          guestPhoto = {
            _type: 'image',
            asset: {_type: 'reference', _ref: assetId},
            alt: f.portrait.alt ?? guestName ?? '',
          }
        }
      }

      // One Webflow image feeds mainImage, bannerPost and thumbnail — an
      // explicit Etapa 12 decision: better filled with the real image than empty.
      const cardUrl = f['homepage-card-image']?.url
      let mainImage: any
      let bannerPost: any
      let thumbnail: any
      if (!cardUrl) {
        warn('mainImage', 'no homepage-card-image in source — mainImage/bannerPost/thumbnail unset')
      } else {
        const assetId = DRY_RUN ? '(dry-run)' : await uploadImage(cardUrl, 'mainImage')
        if (assetId) {
          const alt = f['homepage-card-image'].alt ?? title ?? guestName ?? ''
          if (!f['homepage-card-image'].alt)
            warn(
              'mainImage',
              'alt missing in Webflow — defaulted to the title for mainImage/bannerPost/thumbnail, needs review',
            )
          const img = () => ({
            _type: 'image',
            asset: {_type: 'reference', _ref: assetId},
            alt,
          })
          mainImage = img()
          bannerPost = img()
          thumbnail = img()
        }
      }

      const _id = `drafts.edtechMentor-webflow-${item.id}`
      const doc: any = {
        _id,
        _type: 'edtechMentor',
        guestName,
        guestCompany: f['position-company'] ?? undefined,
        guestPhoto,
        title,
        slug: slug ? {_type: 'slug', current: slug} : undefined,
        introText: introText || undefined,
        body,
        mainImage,
        bannerPost,
        thumbnail,
        rapidFire: rapidFireQuestions.length ? {questions: rapidFireQuestions} : undefined,
        category: {_type: 'reference', _ref: categoryId},
        author: {_type: 'reference', _ref: AUTHOR_27ZERO_ID},
        isFeatured: false,
      }
      for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k]

      if (!DRY_RUN) await client.createOrReplace(doc)
      createdIds.push(_id)

      const categoryTitle =
        categories.find((c) => c._id === categoryId)?.title ?? '(unknown)'

      if (warnings.length) {
        withWarnings++
        console.log(
          `  ~ ${label}\n    ${_id}\n    ${body.length} blocks · ${pearls} pearls · ${rapidFireQuestions.length} rapid-fire · ${categoryTitle}  (${warnings.length} warning(s))`,
        )
        for (const w of warnings) console.log(`      · ${w.field}: ${w.reason}`)
      } else {
        ok++
        console.log(
          `  + ${label}\n    ${_id}\n    ${body.length} blocks · ${pearls} pearls · ${rapidFireQuestions.length} rapid-fire · ${categoryTitle}`,
        )
      }

      report.push({
        webflowId: item.id,
        guestName,
        title,
        slug,
        sanityId: _id,
        status: warnings.length ? 'warnings' : 'ok',
        blocks: body.length,
        pearls,
        rapidFirePairs: rapidFireQuestions.length,
        category: categoryTitle,
        warnings,
      })
    } catch (err: any) {
      failed++
      console.log(`  ! ${label}\n    FAILED: ${err.message}`)
      report.push({
        webflowId: item.id,
        guestName: f['interviewee-name'] ?? null,
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
