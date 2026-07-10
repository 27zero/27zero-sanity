/**
 * post.ts — Unified content document.
 *
 * This schema replaces the fragmented post/resource/interview trio
 * with a single document type discriminated by `contentType`.
 *
 * Migration path
 * --------------
 * 1. Deploy this schema update to the studio.
 * 2. Existing `post` documents are unchanged — they just gain a
 *    `contentType` field defaulting to "blog".
 * 3. Run a GROQ migration (or manual re-save) to stamp existing
 *    documents with `contentType: "blog"`.
 * 4. Migrate `resource` documents into this type with
 *    `contentType: "resource"`.
 * 5. Migrate `interview` documents with `contentType: "interview"`.
 * 6. Remove the old `resource` and `interview` schema files.
 * 7. Update helpers/sanity.py to query by contentType instead of _type.
 *
 * Backwards compatibility
 * -----------------------
 * The `body` field name is preserved.
 * The `mainImage` field is preserved (but also aliased as `featuredImage`
 * in GROQ projections).
 * The `slug` field is preserved.
 * Existing documents continue to load without modification.
 */

import {defineField, defineType} from 'sanity'

const CONTENT_TYPES = [
  {title: 'Blog Post',   value: 'blog'},
  {title: 'Resource',    value: 'resource'},
  {title: 'Interview',   value: 'interview'},
  {title: 'Guide',       value: 'guide'},
  {title: 'Case Study',  value: 'case-study'},
  {title: 'News',        value: 'news'},
  {title: 'Webinar',     value: 'webinar'},
]

export default defineType({
  name: 'post',
  title: 'Content',
  type: 'document',

  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo',     title: 'SEO & Social'},
    {name: 'meta',    title: 'Metadata'},
  ],

  fields: [
    // ── Discriminator ─────────────────────────────────────────────────
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      group: 'meta',
      initialValue: 'blog',
      options: {list: CONTENT_TYPES, layout: 'radio'},
      validation: Rule => Rule.required(),
    }),

    // ── Core content fields ───────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required().max(120),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short summary shown in listings and used as meta description fallback.',
      validation: Rule => Rule.max(300),
    }),

    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
    }),

    // ── Authorship & taxonomy ─────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'meta',
      to: [{type: 'author'}],
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Pin this piece to the top of listings.',
    }),

    // ── Interview-specific fields ─────────────────────────────────────
    // Shown for all content types; editors only fill them for interviews.
    // A future iteration can use `hidden: ({document}) => document?.contentType !== 'interview'`.
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      group: 'content',
      description: 'Interview only — guest\'s full name.',
    }),

    defineField({
      name: 'guestRole',
      title: 'Guest Role',
      type: 'string',
      group: 'content',
      description: 'Interview only — e.g. "CEO at Acme EdTech".',
    }),

    defineField({
      name: 'guestCompany',
      title: 'Guest Company',
      type: 'string',
      group: 'content',
    }),

    defineField({
      name: 'guestPhoto',
      title: 'Guest Photo',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
    }),

    // ── SEO fields ────────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title>. Leave blank to use the content title.',
      validation: Rule => Rule.max(70),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: 'Overrides the meta description. 120–160 characters recommended.',
      validation: Rule => Rule.max(160),
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      description: 'Image shown when shared on LinkedIn, Twitter, etc. 1200×630 px recommended.',
      options: {hotspot: true},
    }),
  ],

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title:       'title',
      contentType: 'contentType',
      author:      'author.name',
      media:       'mainImage',
      guestName:   'guestName',
    },
    prepare({title, contentType, author, media, guestName}) {
      const label = CONTENT_TYPES.find(t => t.value === contentType)?.title ?? contentType ?? 'Content'
      const name  = title || guestName || 'Untitled'
      const sub   = [label, author && `by ${author}`].filter(Boolean).join(' · ')
      return {title: name, subtitle: sub, media}
    },
  },
})
