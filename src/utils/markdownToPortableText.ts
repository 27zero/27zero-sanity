/**
 * src/utils/markdownToPortableText.ts
 *
 * Converts Markdown (or raw HTML) content into Sanity Portable Text blocks.
 *
 * The output schema matches blockContent.ts exactly:
 *   - Styles:     normal, h1, h2, h3, h4, blockquote
 *   - Lists:      bullet, number
 *   - Decorators: strong, em, underline, strike-through, code
 *   - Annotations: link (href)
 *   - Array members: block | image (inline images)
 *
 * Strategy
 * ────────
 * 1. Parse Markdown → HTML tokens using `marked`
 * 2. Walk the token tree and emit Portable Text block objects
 *
 * This avoids a DOM dependency (no jsdom needed) and works in both
 * Node.js (CLI script) and the browser (Studio custom tool).
 */

import {marked, type Token, type Tokens} from 'marked'

// ── Portable Text types (minimal — enough to match blockContent.ts) ──────────

type PTDecorator = 'strong' | 'em' | 'underline' | 'strike-through' | 'code'

interface PTMark {
  _type: 'link'
  href: string
}

interface PTSpan {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

interface PTBlock {
  _type: 'block'
  _key: string
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
  markDefs: PTMark[]
  children: PTSpan[]
}

interface PTImage {
  _type: 'image'
  _key: string
  alt?: string
  caption?: string
  /** External URL — the Sanity service uploads this separately */
  url?: string
  /** Asset reference is set after upload; left empty here */
  asset?: {_type: 'reference'; _ref: string}
}

export type PortableTextBlock = PTBlock | PTImage

// ── Key generator ─────────────────────────────────────────────────────────────

let _keyCounter = 0
function nextKey(): string {
  return `pt${(++_keyCounter).toString(36)}`
}

// ── Active marks context ──────────────────────────────────────────────────────

interface MarksContext {
  decorators: PTDecorator[]
  /** Mark key → PTMark definition */
  annotations: Map<string, PTMark>
}

function emptyMarksContext(): MarksContext {
  return {decorators: [], annotations: new Map()}
}

// ── Inline token → spans ───────────────────────────────────────────────────────

function inlineTokensToSpans(
  tokens: Token[],
  ctx: MarksContext,
  markDefs: PTMark[],
): PTSpan[] {
  const spans: PTSpan[] = []

  for (const token of tokens) {
    if (token.type === 'text') {
      const t = token as Tokens.Text
      // marks = active decorators + active annotation keys
      const marks: string[] = [
        ...ctx.decorators,
        ...Array.from(ctx.annotations.keys()),
      ]
      spans.push({_type: 'span', _key: nextKey(), text: t.text, marks})

      // Recurse into nested tokens (e.g. bold inside a list item)
      if (t.tokens && t.tokens.length > 0) {
        // Replace the simple span with the recursed version
        spans.pop()
        spans.push(...inlineTokensToSpans(t.tokens, ctx, markDefs))
      }
    } else if (token.type === 'strong') {
      const t = token as Tokens.Strong
      const newCtx: MarksContext = {
        ...ctx,
        decorators: [...ctx.decorators, 'strong'],
      }
      spans.push(...inlineTokensToSpans(t.tokens ?? [], newCtx, markDefs))
    } else if (token.type === 'em') {
      const t = token as Tokens.Em
      const newCtx: MarksContext = {
        ...ctx,
        decorators: [...ctx.decorators, 'em'],
      }
      spans.push(...inlineTokensToSpans(t.tokens ?? [], newCtx, markDefs))
    } else if (token.type === 'codespan') {
      const t = token as Tokens.Codespan
      const marks: string[] = [...ctx.decorators, ...Array.from(ctx.annotations.keys()), 'code']
      spans.push({_type: 'span', _key: nextKey(), text: t.text, marks})
    } else if (token.type === 'del') {
      const t = token as Tokens.Del
      const newCtx: MarksContext = {
        ...ctx,
        decorators: [...ctx.decorators, 'strike-through'],
      }
      spans.push(...inlineTokensToSpans(t.tokens ?? [], newCtx, markDefs))
    } else if (token.type === 'link') {
      const t = token as Tokens.Link
      const markKey = nextKey()
      const markDef: PTMark = {_type: 'link', href: t.href}
      markDefs.push(markDef)
      const newAnnotations = new Map(ctx.annotations)
      newAnnotations.set(markKey, markDef)
      const newCtx: MarksContext = {...ctx, annotations: newAnnotations}
      // Spread so the span receives the link mark key
      const inner = inlineTokensToSpans(t.tokens ?? [], newCtx, markDefs)
      if (inner.length === 0) {
        inner.push({
          _type: 'span',
          _key: nextKey(),
          text: t.text,
          marks: [...ctx.decorators, markKey],
        })
      } else {
        // Add the link mark key to each child span
        inner.forEach(s => {
          if (!s.marks.includes(markKey)) s.marks.push(markKey)
        })
      }
      spans.push(...inner)
    } else if (token.type === 'image') {
      // Inline image rendered as plain text fallback (block images handled separately)
      const t = token as Tokens.Image
      const marks: string[] = [...ctx.decorators, ...Array.from(ctx.annotations.keys())]
      spans.push({_type: 'span', _key: nextKey(), text: t.text || t.href, marks})
    } else if (token.type === 'space') {
      // ignore pure whitespace tokens
    } else if ('text' in token && typeof (token as {text: unknown}).text === 'string') {
      // Fallback for unknown inline token types that carry text
      const marks: string[] = [...ctx.decorators, ...Array.from(ctx.annotations.keys())]
      spans.push({
        _type: 'span',
        _key: nextKey(),
        text: (token as {text: string}).text,
        marks,
      })
    }
  }

  return spans
}

// ── Block token → PTBlock ──────────────────────────────────────────────────────

function headingStyle(depth: number): PTBlock['style'] {
  const map: Record<number, PTBlock['style']> = {1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4'}
  return map[depth] ?? 'h4'
}

function tokensToBlocks(tokens: Token[]): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []

  for (const token of tokens) {
    if (token.type === 'heading') {
      const t = token as Tokens.Heading
      const markDefs: PTMark[] = []
      const children = inlineTokensToSpans(t.tokens ?? [], emptyMarksContext(), markDefs)
      blocks.push({
        _type: 'block',
        _key: nextKey(),
        style: headingStyle(t.depth),
        markDefs,
        children: children.length > 0
          ? children
          : [{_type: 'span', _key: nextKey(), text: t.text, marks: []}],
      })
    } else if (token.type === 'paragraph') {
      const t = token as Tokens.Paragraph
      const markDefs: PTMark[] = []
      const children = inlineTokensToSpans(t.tokens ?? [], emptyMarksContext(), markDefs)
      blocks.push({
        _type: 'block',
        _key: nextKey(),
        style: 'normal',
        markDefs,
        children: children.length > 0
          ? children
          : [{_type: 'span', _key: nextKey(), text: t.text, marks: []}],
      })
    } else if (token.type === 'blockquote') {
      const t = token as Tokens.Blockquote
      const markDefs: PTMark[] = []
      // Strip any nested paragraph wrapper so the quote text is flat
      const innerTokens = t.tokens.flatMap(inner =>
        inner.type === 'paragraph' ? ((inner as Tokens.Paragraph).tokens ?? []) : [inner],
      )
      const children = inlineTokensToSpans(innerTokens, emptyMarksContext(), markDefs)
      blocks.push({
        _type: 'block',
        _key: nextKey(),
        style: 'blockquote',
        markDefs,
        children: children.length > 0
          ? children
          : [{_type: 'span', _key: nextKey(), text: t.text, marks: []}],
      })
    } else if (token.type === 'code') {
      const t = token as Tokens.Code
      // Render code blocks as a single code-decorated span inside a normal block
      blocks.push({
        _type: 'block',
        _key: nextKey(),
        style: 'normal',
        markDefs: [],
        children: [{_type: 'span', _key: nextKey(), text: t.text, marks: ['code']}],
      })
    } else if (token.type === 'list') {
      const t = token as Tokens.List
      const listType: 'bullet' | 'number' = t.ordered ? 'number' : 'bullet'
      for (const item of t.items) {
        const markDefs: PTMark[] = []
        const itemTokens = item.tokens.flatMap(inner =>
          inner.type === 'text' ? ((inner as Tokens.Text).tokens ?? [inner]) : [inner],
        )
        const children = inlineTokensToSpans(itemTokens, emptyMarksContext(), markDefs)
        blocks.push({
          _type: 'block',
          _key: nextKey(),
          style: 'normal',
          listItem: listType,
          level: 1,
          markDefs,
          children: children.length > 0
            ? children
            : [{_type: 'span', _key: nextKey(), text: item.text, marks: []}],
        })
      }
    } else if (token.type === 'image') {
      const t = token as Tokens.Image
      // Standalone image block — url will be uploaded by the Sanity service
      blocks.push({
        _type: 'image',
        _key: nextKey(),
        alt: t.text || undefined,
        caption: t.title || undefined,
        url: t.href,
      })
    } else if (token.type === 'space') {
      // ignore
    } else if (token.type === 'html') {
      // Emit HTML as a plain text span — full HTML parsing is out of scope
      const t = token as Tokens.HTML
      const text = t.text.replace(/<[^>]+>/g, '').trim()
      if (text) {
        blocks.push({
          _type: 'block',
          _key: nextKey(),
          style: 'normal',
          markDefs: [],
          children: [{_type: 'span', _key: nextKey(), text, marks: []}],
        })
      }
    } else if (token.type === 'hr') {
      // Horizontal rule — not in blockContent, skip
    } else if ('tokens' in token && Array.isArray((token as {tokens: Token[]}).tokens)) {
      // Recurse into any other container token
      blocks.push(...tokensToBlocks((token as {tokens: Token[]}).tokens))
    }
  }

  return blocks
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Convert a Markdown string to an array of Sanity Portable Text blocks.
 *
 * Matches the `blockContent` schema defined in blockContent.ts.
 *
 * @param markdown  Raw Markdown string
 * @returns         Array of Portable Text block objects ready to write to Sanity
 *
 * @example
 *   const blocks = markdownToPortableText('## Hello\n\nWorld')
 *   // [{_type:'block', style:'h2', ...}, {_type:'block', style:'normal', ...}]
 */
export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  if (!markdown?.trim()) return []

  _keyCounter = 0 // reset per call so keys are short and predictable in tests

  const tokens = marked.lexer(markdown)
  return tokensToBlocks(tokens)
}

/**
 * Convert an HTML string to Portable Text.
 *
 * Strips all tags and falls back to a single normal paragraph.
 * For full HTML fidelity, use markdownToPortableText on the original Markdown.
 */
export function htmlToPortableText(html: string): PortableTextBlock[] {
  if (!html?.trim()) return []

  // Convert basic HTML to Markdown-like plain text, then wrap in a normal block.
  // For simple Pillarbase HTML this is sufficient.  If Pillarbase returns rich HTML,
  // switch to a library like rehype-remark for a proper conversion pipeline.
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()

  return markdownToPortableText(text)
}
