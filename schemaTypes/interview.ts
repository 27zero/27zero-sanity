/**
 * interview.ts — EdTech Mentor Interview document.
 *
 * Existing fields (guestName, guestCompany, guestRole, guestPhoto, slug, body)
 * are preserved exactly — no type changes, no removals.
 *
 * New fields added in this revision:
 *   title          — episode headline shown on cards and detail page
 *   excerpt        — short description for index cards
 *   series         — groups interviews into the three slider series
 *   featured       — marks the interview for the featured card
 *   publishedAt    — publication date (sitemap + ordering)
 *   pearlOfWisdom  — pull-quote highlighted in the CMS detail layout
 *   rapidFire      — rapid-fire Q&A pairs
 *   linkedinUrl    — episode LinkedIn post URL
 *   mediumUrl      — episode Medium article URL
 *   seoTitle       — overrides <title> on the detail page
 *   seoDescription — overrides meta description
 *   ogImage        — Open Graph image for social sharing
 *
 * guestPhoto now has hotspot enabled (non-breaking — only affects the
 * Studio crop UI, not existing stored values).
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

const SERIES_OPTIONS = [
  {title: 'Essential Series',  value: 'essencial'},
  {title: 'Investor Series',   value: 'investor'},
  {title: 'Founders Series',   value: 'founders'},
]

export default defineType({
  name: 'interview',
  title: 'EdTech Mentor Interviews',
  type: 'document',

  groups: [
    {name: 'guest',   title: 'Guest',    default: true},
    {name: 'content', title: 'Content'},
    {name: 'meta',    title: 'Metadata'},
    {name: 'seo',     title: 'SEO'},
  ],

  fields: [

    // ── Existing fields — preserved exactly ────────────────────────────

    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestCompany',
      title: 'Company',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestRole',
      title: 'Role',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestPhoto',
      title: 'Photo',
      type: 'image',
      group: 'guest',
      options: {hotspot: true},   // added — non-breaking
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'guestName'},
    }),

    defineField({
      name: 'body',
      title: 'Interview Body',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),

    // ── New fields ─────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      group: 'content',
      description: 'Headline shown on cards and the detail page header.',
      validation: Rule => Rule.max(120),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Short description shown on index cards (1–2 sentences).',
      validation: Rule => Rule.max(280),
    }),

    defineField({
      name: 'pearlOfWisdom',
      title: 'Pearl of Wisdom',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Key pull-quote highlighted in the article layout.',
    }),

    defineField({
      name: 'rapidFire',
      title: 'Rapid Fire Questions',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'rapidFireItem',
          title: 'Q&A Pair',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string'}),
            defineField({name: 'answer',   title: 'Answer',   type: 'text', rows: 2}),
          ],
          preview: {
            select: {title: 'question', subtitle: 'answer'},
          },
        }),
      ],
    }),

    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      group: 'meta',
      options: {list: SERIES_OPTIONS, layout: 'radio'},
      description: 'Determines which slider this interview appears in on the index page.',
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Mark as featured to show in the prominent featured card on the index page.',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
    }),

    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn Post URL',
      type: 'url',
      group: 'meta',
      description: 'URL of the LinkedIn post for this episode.',
    }),

    defineField({
      name: 'mediumUrl',
      title: 'Medium Article URL',
      type: 'url',
      group: 'meta',
      description: 'URL of the Medium article for this episode.',
    }),

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title>. Leave blank to use the episode title.',
      validation: Rule => Rule.max(70),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: '120–160 characters recommended.',
      validation: Rule => Rule.max(160),
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      options: {hotspot: true},
      description: '1200×630 px recommended. Falls back to guest photo if empty.',
    }),

  ],

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Featured first',
      name: 'featuredFirst',
      by: [
        {field: 'featured',    direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'},
      ],
    },
  ],

  preview: {
    select: {
      title:     'guestName',
      subtitle:  'title',
      series:    'series',
      featured:  'featured',
      media:     'guestPhoto',
    },
    prepare({title, subtitle, series, featured, media}) {
      const seriesLabel = SERIES_OPTIONS.find(s => s.value === series)?.title ?? series ?? ''
      const star = featured ? '⭐ ' : ''
      return {
        title:    `${star}${title ?? 'Unnamed guest'}`,
        subtitle: [subtitle, seriesLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
