/**
 * edtechMarketingService.ts — EdTech Marketing Service document.
 *
 * Renders its own detail page (`edtechMarketingService` detail, Etapa 6), so it
 * carries the shared `seo` object like `work` and `edtechMentor`.
 */

import {defineType, defineField} from 'sanity'

// ── Service categories — distinct taxonomy from workCategory, does not share
//    ids/labels with Work's categories (see servicesByCategory.ts in 27zero-sitio).
const SERVICE_CATEGORIES = [
  {title: 'UX/UI & Web Design',            value: 'ux-ui-web-design'},
  {title: 'Brand & Messaging Strategy',    value: 'brand-messaging-strategy'},
  {title: 'Project Management',            value: 'project-management'},
  {title: 'Events',                        value: 'events'},
  {title: 'Content Development',           value: 'content-development'},
  {title: 'Marketing Programs',            value: 'marketing-programs'},
  {title: 'Strategic Services',            value: 'strategic-services'},
  {title: 'Others',                        value: 'others'},
]

const ICON_OPTIONS = [
  {title: 'Asterisk',   value: 'asterisk'},
  {title: 'Quatrefoil', value: 'quatrefoil'},
  {title: 'Arc',        value: 'arc'},
]

export default defineType({
  name: 'edtechMarketingService',
  title: 'EdTech Marketing Services',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {list: SERVICE_CATEGORIES, layout: 'dropdown'},
      description: 'Menu grouping on the EdTech Marketing index. Distinct taxonomy from Work categories.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'iconId',
      title: 'Icon',
      type: 'string',
      options: {list: ICON_OPTIONS, layout: 'dropdown'},
      description: 'Decorative brand frame — rotates 1→2→3 across service cards, does not represent the service itself. Maps to ServiceIcon.astro in the sitio repo.',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'category'},
    prepare({title, subtitle}) {
      const label = SERVICE_CATEGORIES.find(c => c.value === subtitle)?.title ?? subtitle ?? ''
      return {title: title ?? 'Untitled', subtitle: label}
    },
  },
})
