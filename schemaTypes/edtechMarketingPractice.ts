/**
 * edtechMarketingPractice.ts — EdTech Marketing Practice document.
 *
 * 27zero has exactly three practices:
 *   Customer Marketing       /edtech-marketing-agency/customer-marketing
 *   Granular Marketing Programs  /edtech-marketing-agency/granular-marketing-programs
 *   Agile Brand Development  /edtech-marketing-agency/agile-brand-development
 *
 * Each practice appears in two frontend contexts:
 *
 *   1. Home page — pcard (small card: title + shortDescription + clients list + href)
 *   2. EdTech Marketing index — practices-card (title + shortDescription + cardImage).
 *      El ícono NO sale de acá: los 3 de la grilla son fijos y posicionales, resueltos
 *      en el sitio (PRACTICE_ICONS en edtech-marketing.astro).
 *   3. Practice detail page — full page with hero, credibility section,
 *      conversation engine dropdowns, and services menu
 *
 * Field groups follow the editorial sections of the detail page so
 * content editors see exactly what they're editing.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

// ── Misma taxonomía que edtechMarketingService.category — string + list,
//    no reference (category en edtechMarketingService tampoco es un documento).
const RELATED_SERVICE_CATEGORIES = [
  {title: 'UX/UI & Web Design',            value: 'ux-ui-web-design'},
  {title: 'Brand & Messaging Strategy',    value: 'brand-messaging-strategy'},
  {title: 'Project Management',            value: 'project-management'},
  {title: 'Events',                        value: 'events'},
  {title: 'Content Development',           value: 'content-development'},
  {title: 'Marketing Programs',            value: 'marketing-programs'},
  {title: 'Strategic Services',            value: 'strategic-services'},
  {title: 'Others',                        value: 'others'},
]

export default defineType({
  name: 'edtechMarketingPractice',
  title: 'EdTech Marketing Practices',
  type: 'document',

  groups: [
    {name: 'card',         title: 'Card',                default: true},
    {name: 'pageContent',  title: 'Page Content'},
    {name: 'conversation', title: 'Conversation Engine'},
    {name: 'pageCta',      title: 'Page CTA'},
    {name: 'meta',         title: 'Metadata'},
  ],

  fieldsets: [
    {name: 'hero',            title: 'Hero'},
    {name: 'intro',           title: 'Intro'},
    {name: 'clients',         title: 'Clients'},
    {name: 'practiceScopes',  title: 'Practice Scopes'},
  ],

  fields: [

    // ── Card (home pcard + agency practices-card) ──────────────────────

    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'ej. "Customer Marketing"',
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
      description: 'ej. "customer-marketing" → /edtech-marketing-agency/customer-marketing',
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'Descripción corta mostrada en el pcard de Home y en el practices-card de Agency.',
    }),

    defineField({
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
      group: 'card',
      options: {hotspot: true},
      description: 'Imagen de la card de la práctica en el índice de EdTech Marketing. Recomendado: 800×600 px.',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      initialValue: 10,
      description: 'Posición en la grilla de prácticas (menor = primero).',
    }),

    // ── Hero (página de detalle) ───────────────────────────────────────

    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'pageContent',
      fieldset: 'hero',
      description: 'ej. "Turning communities into growth engines."',
    }),

    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 3,
      group: 'pageContent',
      fieldset: 'hero',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'pageContent',
      fieldset: 'hero',
      options: {hotspot: true},
    }),

    // ── Intro ────────────────────────────────────────────────────────

    defineField({
      name: 'introTitle',
      title: 'Intro Title',
      type: 'string',
      group: 'pageContent',
      fieldset: 'intro',
      description: 'Título de la sección introductoria',
    }),

    defineField({
      name: 'introDescription',
      title: 'Intro Description',
      type: 'text',
      group: 'pageContent',
      fieldset: 'intro',
      description: 'Texto introductorio de la práctica',
    }),

    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      group: 'pageContent',
      fieldset: 'intro',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Listado de capacidades, una por línea.',
    }),

    // ── Servicios relacionados ──────────────────────────────────────────

    // Vive en 'pageContent' y no en 'meta' porque es contenido de la página, no
    // metadato: decide qué bloque de servicios ("What's on the menu?") se renderiza
    // en la interna. Estaba en 'meta' y ahí nadie lo encontraba.
    defineField({
      name: 'relatedServiceCategory',
      title: 'Related Service Category',
      type: 'string',
      group: 'pageContent',
      options: {list: RELATED_SERVICE_CATEGORIES, layout: 'dropdown'},
      description: 'Categoría de EdTech Marketing Service a mostrar en esta página.',
    }),

    // ── Clientes ────────────────────────────────────────────────────────

    defineField({
      name: 'clientSectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'card',
      fieldset: 'clients',
      description: 'Título mostrado sobre el listado de clientes',
    }),

    defineField({
      name: 'clientNames',
      title: 'Featured Clients',
      type: 'array',
      group: 'card',
      fieldset: 'clients',
      of: [defineArrayMember({type: 'string'})],
      description: 'Nombres de clientes mostrados en el pcard de Home. ej. ["Busuu", "D2L", "Anthology", "Instructure"]',
    }),

    // ── Alcances de la práctica ──────────────────────────────────────────

    defineField({
      name: 'practiceScopesTitle',
      title: 'Section Title',
      type: 'string',
      group: 'conversation',
      fieldset: 'practiceScopes',
      description: 'Título mostrado sobre los alcances de la práctica',
    }),

    defineField({
      name: 'practiceScopes',
      title: 'Scopes',
      type: 'array',
      group: 'conversation',
      fieldset: 'practiceScopes',
      description: 'Listado de alcances de la práctica, cada uno con su propio CTA.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceScope',
          fields: [
            defineField({name: 'title',      title: 'Title',        type: 'string'}),
            defineField({name: 'description', title: 'Description',  type: 'text', rows: 3}),
            defineField({name: 'ctaLabel',   title: 'CTA Label', type: 'string'}),
            defineField({name: 'ctaHref',    title: 'CTA URL',   type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    // ── CTA de página ──────────────────────────────────────────────────

    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'pageCta',
    }),

    defineField({
      name: 'ctaLabel',
      title: 'Button Text',
      type: 'string',
      group: 'pageCta',
    }),

    defineField({
      name: 'ctaHref',
      title: 'CTA Link',
      type: 'url',
      group: 'pageCta',
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
      subtitle: 'shortDescription',
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
