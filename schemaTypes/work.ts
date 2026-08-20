/**
 * work.ts — Work / Case Study document type.
 *
 * Each document represents one client engagement (a case study).
 * The schema is designed to cover:
 *   - Work index page (thumbnail, title, client, category, excerpt)
 *   - Work detail page (full case study: brief → challenge → solution → impact)
 *   - SEO on both pages
 *   - Related projects (via category)
 *
 * Field groups separate editorial concerns from SEO and metadata
 * so the Studio UI stays clean for content editors.
 */

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',

  groups: [
    {name: 'overview',  title: 'Overview',     default: true},
    {name: 'case',      title: 'Case Study'},
    {name: 'media',     title: 'Media'},
    {name: 'seo',       title: 'SEO & Social'},
    {name: 'meta',      title: 'Metadata'},
  ],

  fields: [

    // ── Identity ───────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Anthology — Legacy Conversations"',
      validation: Rule => Rule.required().max(120),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'overview',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      group: 'overview',
      to: [{type: 'client'}],
      description: 'The client this case study belongs to.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'clientLogo',
      title: 'Client Logo',
      type: 'image',
      group: 'overview',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
    }),

    // ── Overview fields (used on index page and detail hero) ──────────

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'overview',
      to: [{type: 'workCategory'}],
      description: 'Primary category for filtering/grouping on the Work index.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'services',
      title: 'Services Delivered',
      type: 'array',
      group: 'overview',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'All services involved, used for "Related projects" matching.',
    }),

    defineField({
      name: 'industry',
      title: 'Industry',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Higher Education", "Corporate Learning", "K-12"',
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'overview',
      validation: Rule => Rule.integer().min(2000).max(2099),
    }),

    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      group: 'overview',
      rows: 2,
      description: 'One-sentence summary shown on the Work index card.',
      validation: Rule => Rule.required().max(220),
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Featured projects appear first and larger on the index page.',
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      description: 'Lower numbers appear first within their category. Default: 100.',
      initialValue: 100,
    }),

    // ── Media ─────────────────────────────────────────────────────────

    defineField({
      name: 'thumbnail',
      title: 'Index Thumbnail',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      description: 'Displayed on the Work index card. Recommended: 800×600 px.',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      description: 'Full-width image at the top of the detail page. Recommended: 1600×900 px.',
    }),

    defineField({
      name: 'heroVideo',
      title: 'Hero Video URL',
      type: 'url',
      group: 'media',
      description: 'Optional YouTube or Vimeo URL. Shown instead of hero image when present.',
    }),

    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt',     title: 'Alt text', type: 'string'},
            {name: 'caption', title: 'Caption',  type: 'string'},
          ],
        },
      ],
      description: 'Additional images shown in the detail page gallery.',
    }),

    // ── Case study narrative ──────────────────────────────────────────

    defineField({
      name: 'brief',
      title: 'The Brief',
      type: 'text',
      group: 'case',
      rows: 3,
      description: 'One-paragraph client brief / context.',
    }),

    defineField({
      name: 'challenge',
      title: 'Challenge',
      type: 'blockContent',
      group: 'case',
      description: 'What problem were we solving?',
    }),

    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'object',
      group: 'case',
      fields: [
        defineField({name: 'headline', title: 'Solution Headline', type: 'string',
          description: 'e.g. "Changing the nature of the traditional B2B event."'}),
        defineField({name: 'body', title: 'Solution Body', type: 'blockContent'}),
      ],
    }),

    defineField({
      name: 'impact',
      title: 'The Impact',
      type: 'array',
      group: 'case',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'verb',   title: 'Verb',   type: 'string', description: 'e.g. "Fueled"'},
            {name: 'result', title: 'Result', type: 'text',   description: 'e.g. "The sales cycle with more than 50 key accounts."'},
          ],
          preview: {
            select: {title: 'verb', subtitle: 'result'},
          },
        },
      ],
      description: 'Impact bullet points: verb + result pairs (used in look-list layout).',
    }),

    // ── SEO ───────────────────────────────────────────────────────────

    // ── CMS detail page fields ───────────────────────────────────────
    // Used by pages/work/work-cms/index.html

    defineField({
      name: 'clientTagline',
      title: 'Client Tagline',
      type: 'string',
      group: 'overview',
      description: 'Short tagline shown under the client name on the detail page.',
    }),

    defineField({
      name: 'contributions',
      title: 'Contributions',
      type: 'array',
      group: 'case',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'List of contributions/services delivered, shown as bullet list.',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'case',
      description: 'e.g. "New York, USA"',
    }),

    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'blockContent',
      group: 'case',
      description: 'Full project description shown in the client info section.',
    }),

    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      group: 'case',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'number',      title: 'Stat / Number', type: 'string',
            description: 'e.g. "20%", "1K", "95%"'}),
          defineField({name: 'description', title: 'Description',   type: 'text', rows: 2}),
        ],
        preview: {select: {title: 'number', subtitle: 'description'}},
      }],
      description: 'Up to 4 result stats shown in the Results section.',
    }),

    defineField({
      name: 'contentSections',
      title: 'Content Sections',
      type: 'array',
      group: 'case',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title',  title: 'Section Title', type: 'string'}),
          defineField({name: 'body',   title: 'Body Text',     type: 'text', rows: 4}),
          defineField({
            name: 'images', title: 'Images', type: 'array',
            of: [{
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
            }],
          }),
        ],
        preview: {select: {title: 'title'}},
      }],
      description: 'Flexible content sections (sections 5–8 of the CMS detail page).',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Featured first, then by order',
      name: 'featuredOrder',
      by: [
        {field: 'isFeatured', direction: 'desc'},
        {field: 'order',      direction: 'asc'},
        {field: 'title',      direction: 'asc'},
      ],
    },
    {
      title: 'Year (newest first)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
    {
      title: 'Client A–Z',
      name: 'clientAsc',
      by: [{field: 'client.name', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title:      'title',
      client:     'client.name',
      category:   'category.title',
      isFeatured: 'isFeatured',
      media:      'thumbnail',
    },
    prepare({title, client, category, isFeatured, media}) {
      const star  = isFeatured ? '⭐ ' : ''
      return {
        title:    `${star}${title ?? 'Untitled'}`,
        subtitle: [client, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
