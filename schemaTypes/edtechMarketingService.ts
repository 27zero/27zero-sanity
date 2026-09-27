/**
 * edtechMarketingService.ts — EdTech Marketing Service document.
 *
 * Renders its own detail page (`edtechMarketingService` detail, Etapa 6), so it
 * carries the shared `seo` object like `work` and `edtechMentor`.
 *
 * Los servicios son la capa de cumplimiento/ejecución de la oferta: cada
 * Practice (ver edtechMarketingPractice.ts) referencia explícitamente los
 * servicios que la resuelven vía `relatedServices`, así que esta taxonomía de
 * categorías ya no necesita coincidir con ninguna lista aparte en Practice —
 * es la única fuente de verdad para category en todo el proyecto.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

// ── Service categories — distinct taxonomy from workCategory, does not share
//    ids/labels with Work's categories. El sitio espeja ids, labels y orden a mano
//    (SERVICE_CATEGORY_* en src/types/sanity.ts de 27zero-sitio): cambiar esta
//    lista obliga a actualizar ese archivo.
//
// CAMBIO (conflicto 1): taxonomía de 8 categorías alineada con el RFC de
// oferta ("27zero Offering Taxonomy Project"). Reemplaza la lista anterior
// (UX/UI & Web Design, Brand & Messaging Strategy, Project Management, Events,
// Content Development, Marketing Programs, Strategic Services, Others), que no
// correspondía a la taxonomía actual salvo en 'Strategic Services' y
// 'UX/UI & Web Design'.
//
// ATENCIÓN AL MIGRAR: cualquier documento de Service ya publicado con un
// valor viejo (project-management, marketing-programs, content-development,
// brand-messaging-strategy) va a quedar con un campo category inválido/vacío
// en el Studio hasta que se reasigne a mano a uno de los 8 valores nuevos.
const SERVICE_CATEGORIES = [
  {title: 'Strategic Services',        value: 'strategic-services'},
  {title: 'Brand & Identity',          value: 'brand-identity'},
  {title: 'UX/UI & Web Design',        value: 'ux-ui-web-design'},
  {title: 'Content Marketing',         value: 'content-marketing'},
  {title: 'Demand Generation',         value: 'demand-generation'},
  {title: 'Marketing Operations',      value: 'marketing-operations'},
  {title: 'Sales Enablement',          value: 'sales-enablement'},
  {title: 'Events & Experiences',      value: 'events-experiences'},
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
      description: 'Agrupación en el menú del índice de EdTech Marketing y fuente de verdad para relatedServices en Practice.',
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

    // CAMBIO (conflicto 6): edtechMarketingService no tenía ningún campo de
    // imagen para el hero — a diferencia de edtechMarketingPractice, que sí
    // tiene 'heroImage' (ver Conflicto 5). No es un bug de un campo mal
    // armado: directamente no existía dónde cargar la imagen. Se agrega acá
    // con el mismo patrón ya corregido en Practice (alt requerido desde el
    // inicio, para no repetir el mismo problema).
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen del hero de la página de detalle del servicio.',
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
      validation: Rule => Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
      description: 'Puede ser ruta interna (ej. "/contact") o URL externa.',
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
