/**
 * seo.ts — Shared SEO object, embedded in documentTypes that render their own page.
 *
 * Per CLAUDE.md §8.1: one reusable object instead of seoTitle/seoDescription/
 * ogImage duplicated as loose fields on every document type.
 * Empty fields fall back to `settings.seo` (site-wide default) at query time.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',

  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      validation: Rule => Rule.max(70),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      options: {hotspot: true},
      description: '1200×630 px recommended.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
