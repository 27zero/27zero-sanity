/**
 * practice.ts — EdTech Marketing Practice document.
 *
 * 27zero has exactly three practices:
 *   Customer Marketing       /edtech-marketing-agency/customer-marketing
 *   Granular Marketing Programs  /edtech-marketing-agency/granular-marketing-programs
 *   Agile Brand Development  /edtech-marketing-agency/agile-brand-development
 *
 * Each practice appears in two frontend contexts:
 *
 *   1. Home page — pcard (small card: title + description + clients list + href)
 *   2. EdTech Marketing index — practices-card (icon + title + description)
 *   3. Practice detail page — full page with hero, credibility section,
 *      conversation engine dropdowns, and services menu
 *
 * Field groups follow the editorial sections of the detail page so
 * content editors see exactly what they're editing.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'practice',
  title: 'Practices',
  type: 'document',

  groups: [
    {name: 'card',         title: 'Card (Home & Agency)',  default: true},
    {name: 'hero',         title: 'Hero'},
    {name: 'credibility',  title: 'Credibility'},
    {name: 'conversation', title: 'Conversation Engine'},
    {name: 'meta',         title: 'Metadata'},
  ],

  fields: [

    // ── Card fields (home pcard + agency practices-card) ───────────────

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'e.g. "Customer Marketing"',
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
      description: 'e.g. "customer-marketing" → /edtech-marketing-agency/customer-marketing',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'Short description shown on home pcard and agency practices-card.',
    }),

    defineField({
      name: 'clientNames',
      title: 'Featured Clients',
      type: 'array',
      group: 'card',
      of: [defineArrayMember({type: 'string'})],
      description: 'Client names shown on the home pcard. e.g. ["Busuu", "D2L", "Anthology", "Instructure"]',
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      initialValue: 10,
      description: 'Position in the practices grid (lower = first).',
    }),

    // ── Hero (detail page) ─────────────────────────────────────────────

    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Turning communities into growth engines."',
    }),

    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: {hotspot: true},
    }),

    // ── Credibility section ────────────────────────────────────────────

    defineField({
      name: 'credibilityHeadline',
      title: 'Credibility Headline',
      type: 'string',
      group: 'credibility',
      description: 'e.g. "We do not just observe the EdTech market, we help shape it."',
    }),

    defineField({
      name: 'credibilityText',
      title: 'Credibility Text',
      type: 'text',
      rows: 4,
      group: 'credibility',
    }),

    defineField({
      name: 'credibilityItems',
      title: 'Credibility Items',
      type: 'array',
      group: 'credibility',
      of: [defineArrayMember({type: 'string'})],
      description: 'Dot-separated list items. e.g. ["Case study production", "Customer Spotlights video series"]',
    }),

    // ── Conversation engine (accordion dropdowns) ──────────────────────

    defineField({
      name: 'conversationItems',
      title: 'Conversation Engine Items',
      type: 'array',
      group: 'conversation',
      description: 'Accordion items in the "From a single conversation to a content engine" section.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'conversationItem',
          fields: [
            defineField({name: 'title',      title: 'Title',      type: 'string'}),
            defineField({name: 'body',       title: 'Body',       type: 'text', rows: 3}),
            defineField({name: 'ctaLabel',   title: 'CTA Label',  type: 'string',
              description: 'Button label. Leave empty for no button.'}),
            defineField({name: 'ctaHref',    title: 'CTA URL',    type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),

    // ── Closing CTA ────────────────────────────────────────────────────

    defineField({
      name: 'closingCtaHeadline',
      title: 'Closing CTA Headline',
      type: 'string',
      group: 'hero',
      description: 'e.g. "Turn your customers into your growth engine."',
    }),

  ],

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'description',
      media:    'heroImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title:    title ?? 'Unnamed practice',
        subtitle: subtitle ? subtitle.slice(0, 60) + '…' : '',
        media,
      }
    },
  },
})
