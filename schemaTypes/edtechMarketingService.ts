/**
 * edtechMarketingService.ts — EdTech Marketing Service document.
 *
 * Renders its own detail page (`edtechMarketingService` detail, Etapa 6), so it
 * carries the shared `seo` object like `work` and `edtechMentor`.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

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

  fieldsets: [
    {name: 'intro',      title: 'Intro'},
    {name: 'features',   title: 'Features'},
    {name: 'proofPoint',  title: 'Proof Point'},
    {name: 'pageCta',     title: 'Page CTA'},
  ],

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
      description: 'Agrupación en el menú del índice de EdTech Marketing. Taxonomía distinta a la de Work.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'iconId',
      title: 'Icon',
      type: 'string',
      options: {list: ICON_OPTIONS, layout: 'dropdown'},
      description: 'Marco de marca decorativo — rota 1→2→3 entre las cards de servicio, no representa al servicio en sí. Mapea a ServiceIcon.astro en el repo sitio.',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      description: 'Descripción general del servicio',
    }),

    defineField({
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen de la card del servicio en el índice de EdTech Marketing. Recomendado: 800×600 px.',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    // ── Intro ────────────────────────────────────────────────────────

    defineField({
      name: 'introTitle',
      title: 'Intro Title',
      type: 'string',
      fieldset: 'intro',
      description: 'Título de la sección introductoria',
    }),

    defineField({
      name: 'introDescription',
      title: 'Intro Description',
      type: 'text',
      fieldset: 'intro',
      description: 'Texto introductorio del servicio',
    }),

    // ── Features ─────────────────────────────────────────────────────

    defineField({
      name: 'featuresTitle',
      title: 'Section Title',
      type: 'string',
      fieldset: 'features',
      description: 'Título mostrado sobre el listado de features',
    }),

    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      fieldset: 'features',
      description: 'Listado de características del servicio, cada una con título y descripción.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            defineField({name: 'title',       title: 'Title',       type: 'string'}),
            defineField({name: 'description', title: 'Description',  type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    // ── Proof Point ──────────────────────────────────────────────────

    defineField({
      name: 'proofPointTitle',
      title: 'Title',
      type: 'string',
      fieldset: 'proofPoint',
      initialValue: 'Proof Point',
      description: 'Título de la sección Proof Point',
    }),

    defineField({
      name: 'proofPointDescription',
      title: 'Description',
      type: 'text',
      fieldset: 'proofPoint',
      description: 'Texto de la sección Proof Point',
    }),

    defineField({
      name: 'proofPointImage',
      title: 'Image',
      type: 'image',
      fieldset: 'proofPoint',
      options: {hotspot: true},
      description: 'Imagen de la sección Proof Point',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    // ── CTA de página ──────────────────────────────────────────────────

    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      fieldset: 'pageCta',
    }),

    defineField({
      name: 'ctaLabel',
      title: 'Button Text',
      type: 'string',
      fieldset: 'pageCta',
    }),

    defineField({
      name: 'ctaHref',
      title: 'CTA Link',
      type: 'url',
      fieldset: 'pageCta',
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
