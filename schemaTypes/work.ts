/**
 * work.ts — Work / Case Study document type.
 *
 * Each document represents one client engagement (a case study).
 *
 * `title` is internal only (identifies the project in the Studio). The public
 * title is `headline`: H1 of the detail page and title of the Work cards.
 *
 * The "Project Brief" tab holds the client details block of the detail page:
 * Headline, the intro paragraph and the Project Type / Agency Role /
 * Location / Year details.
 *
 * The "Case Study" tab follows a fixed editorial flow:
 *
 *   Results
 *   ────────────────────────────────────────
 *   The Business Problem → Communication Challenge → Strategic Idea → Client Quote
 *   ────────────────────────────────────────
 *   Additional Sections
 *   ────────────────────────────────────────
 *   Final CTA Section
 *
 * Client Quote has no field here: it is the testimonials slider, fed by the
 * `testimonial` documents whose `workProject` points to this case study.
 *
 * Final CTA Section is a reference to a reusable `cta` document, not an
 * embedded object: the same CTA is shared across case studies.
 *
 * The 3 narrative sections with content (Business Problem, Communication
 * Challenge, Strategic Idea) each carry their own editable "Section
 * Label" field. It ships with a standard default (e.g. "Business Problem")
 * but can be overridden per project (e.g. "RFP Brief") for clients that use
 * their own terminology — the label is content, not code.
 *
 * Field groups separate editorial concerns from SEO and metadata
 * so the Studio UI stays clean for content editors.
 */

import {defineField, defineType} from 'sanity'
import {paletteColorField} from './lib/paletteColor'

/**
 * Altura de las imágenes de una sección del Case Study. Los valores reales (rem/vh)
 * de Low / Medium / High viven en el sitio; acá solo se elige la variante. Una por
 * sección, porque cada sección tiene un único array de imágenes.
 *
 * "Custom" habilita `customHeight`: la altura en px del diseño desktop, que el sitio
 * escala proporcionalmente en mobile.
 */
const imageHeightFields = () => [
  defineField({
    name: 'heightVariant',
    title: 'Images Height',
    type: 'string',
    options: {
      list: [
        {title: 'Low', value: 'low'},
        {title: 'Medium', value: 'medium'},
        {title: 'High', value: 'high'},
        {title: 'Custom', value: 'custom'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'medium',
    description: 'Altura con la que se muestran las imágenes de esta sección en la página de detalle.',
  }),
  defineField({
    name: 'customHeight',
    title: 'Custom Height (px)',
    type: 'number',
    hidden: ({parent}) => parent?.heightVariant !== 'custom',
    validation: Rule =>
      Rule.min(80)
        .max(1200)
        .custom((value, context) => {
          const parent = context.parent as {heightVariant?: string} | undefined
          return parent?.heightVariant === 'custom' && value === undefined
            ? 'Requerido cuando la altura es Custom.'
            : true
        }),
    description: 'Altura de las imágenes en píxeles, tal como aparece en el diseño desktop. En mobile se reduce de forma proporcional automáticamente.',
  }),
]

export default defineType({
  name: 'work',
  title: 'Work',
  type: 'document',

  groups: [
    {name: 'overview',  title: 'Overview',     default: true},
    {name: 'brief',     title: 'Project Brief'},
    {name: 'case',      title: 'Case Study'},
    {name: 'media',     title: 'Media'},
    {name: 'seo',       title: 'SEO & Social'},
    {name: 'meta',      title: 'Metadata'},
  ],

  fieldsets: [
    {
      name: 'narrative',
      title: 'Case Narrative — Business Problem → Communication Challenge → Strategic Idea → Client Quote',
      description: 'Cada sección tiene su propio "Section Label" editable: úsalo para renombrar la sección en proyectos donde el cliente usa su propia terminología (ej. "Business Problem" → "RFP Brief"). El Client Quote no se carga acá: sale de los Testimonials cuyo "Related Work Project" apunta a este caso.',
    },
    {
      name: 'additionalSections',
      title: 'Additional Sections',
      description: 'Bloques de contenido flexible extra, después de la narrativa principal (opcional).',
    },
  ],

  fields: [

    // ── Identidad ──────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Project Title (internal)',
      type: 'string',
      group: 'overview',
      description: 'Nombre interno del proyecto para identificarlo en el Studio. No se muestra en el sitio.',
      validation: Rule => Rule.required().max(120),
    }),

    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'overview',
      description: 'Subtítulo corto mostrado junto al título en la página de detalle (opcional).',
      validation: Rule => Rule.max(160),
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
      description: 'El cliente al que pertenece este caso de estudio.',
      validation: Rule => Rule.required(),
    }),

    // ── Campos de resumen (usados en el índice y el hero de detalle) ────

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'overview',
      to: [{type: 'workCategory'}],
      description: 'Categoría principal para filtrar/agrupar en el índice de Work.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'services',
      title: 'Services Delivered',
      type: 'array',
      group: 'overview',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Todos los servicios involucrados; se usa para relacionar proyectos similares.',
    }),

    // ── Project Brief (bloque de detalles del cliente en la página de detalle) ──

    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'brief',
      description: 'Titular principal del proyecto. Se muestra como H1 en la página de detalle y como título en las cards de Work.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'briefParagraph',
      title: 'Brief Paragraph',
      type: 'text',
      group: 'brief',
      rows: 5,
      description: 'Párrafo de introducción del caso: brief del cliente y contexto. Si el SEO no tiene Meta Description, se usan sus primeros 160 caracteres.',
    }),

    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'brief',
      description: 'Tipo de proyecto (ej. campaña, rediseño de sitio, video)',
    }),

    defineField({
      name: 'agencyRole',
      title: 'Agency Role',
      type: 'string',
      group: 'brief',
      description: 'Rol de 27zero en este proyecto',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'brief',
      description: 'ej. "New York, USA"',
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'brief',
      validation: Rule => Rule.integer().min(2000).max(2099),
    }),

    // ── Metadata ─────────────────────────────────────────────────────────

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      description: 'Los números más bajos aparecen primero dentro de su categoría. Default: 100.',
      initialValue: 100,
    }),

    // ── Media (card thumbnail, hero image, video, galería) ─────────────

    defineField({
      name: 'thumbnail',
      title: 'Card Thumbnail',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      description: 'Se muestra en la card del índice de Work. Recomendado: 800×600 px.',
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
      description: 'Imagen a todo el ancho en la parte superior de la página de detalle. Recomendado: 1600×900 px.',
    }),

    defineField({
      name: 'heroVideo',
      title: 'Hero Video URL',
      type: 'url',
      group: 'media',
      description: 'URL opcional de YouTube o Vimeo. Se muestra en lugar de la imagen principal cuando está presente.',
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
      description: 'Imágenes adicionales mostradas en la galería de la página de detalle.',
    }),

    // ═══════════════════════════════════════════════════════════════════
    // CASE STUDY TAB — flujo editorial estándar
    // ═══════════════════════════════════════════════════════════════════

    // ── 1. Results ───────────────────────────────────────────────────────

    defineField({
      name: 'results',
      title: 'Results',
      type: 'array',
      group: 'case',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'number',      title: 'Stat / Number', type: 'string',
            description: 'ej. "20%", "1K", "95%"'}),
          defineField({name: 'description', title: 'Description',   type: 'text', rows: 2}),
        ],
        preview: {select: {title: 'number', subtitle: 'description'}},
      }],
      description: 'Hasta 4 estadísticas de resultado mostradas en la sección de Resultados.',
    }),

    // ── 2. Case Narrative: Business Problem → Communication Challenge → Strategic Idea → Client Quote

    defineField({
      name: 'challenge',
      title: 'The Business Problem',
      type: 'object',
      group: 'case',
      fieldset: 'narrative',
      description: '¿Qué problema de negocio estábamos resolviendo?',
      fields: [
        defineField({
          name: 'challengeTitle',
          title: 'Section Label',
          type: 'string',
          initialValue: 'Business Problem',
          description: 'Título mostrado sobre esta sección. Editable por proyecto (ej. "RFP Brief" si así lo llama el cliente).',
        }),
        defineField({
          name: 'challengeContent',
          title: 'Content',
          type: 'blockContent',
          description: '¿Qué problema estábamos resolviendo?',
        }),
        defineField({
          name: 'challengeImages',
          title: 'Images',
          type: 'array',
          description: 'Imágenes de esta sección',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Caption', type: 'string'}),
              ],
            },
          ],
        }),
        ...imageHeightFields(),
      ],
    }),

    defineField({
      name: 'communicationChallenge',
      title: 'Communication Challenge',
      type: 'object',
      group: 'case',
      fieldset: 'narrative',
      description: 'El reto de comunicación/marketing específico que se desprende del problema de negocio.',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          initialValue: 'Communication Challenge',
          description: 'Título mostrado sobre esta sección. Editable por proyecto.',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'blockContent',
          description: '¿Cuál era el reto de comunicación?',
        }),
        defineField({
          name: 'images',
          title: 'Images',
          type: 'array',
          description: 'Imágenes de esta sección',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Caption', type: 'string'}),
              ],
            },
          ],
        }),
        ...imageHeightFields(),
      ],
    }),

    defineField({
      name: 'solution',
      title: 'Strategic Idea',
      type: 'object',
      group: 'case',
      fieldset: 'narrative',
      description: 'La gran idea / solución estratégica de 27zero.',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          initialValue: 'Strategic Idea',
          description: 'Título mostrado sobre esta sección. Editable por proyecto.',
        }),
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "Changing the nature of the traditional B2B event."'}),
        defineField({name: 'body', title: 'Body', type: 'blockContent'}),
        defineField({
          name: 'solutionImages',
          title: 'Images',
          type: 'array',
          description: 'Imágenes de esta sección',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Caption', type: 'string'}),
              ],
            },
          ],
        }),
        ...imageHeightFields(),
      ],
    }),

    // ── 3. Additional Sections ───────────────────────────────────────────

    defineField({
      name: 'contentSections',
      title: 'Additional Sections',
      type: 'array',
      group: 'case',
      fieldset: 'additionalSections',
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
          ...imageHeightFields(),
          paletteColorField({
            name: 'bgColor',
            title: 'Background Color',
            description: 'Color de fondo de la sección. Si se deja vacío, el fondo es blanco.',
          }),
          paletteColorField({
            name: 'textColor',
            title: 'Text Color',
            description: 'Color del texto de la sección.',
          }),
        ],
        preview: {select: {title: 'title'}},
      }],
      description: 'Secciones de contenido flexible adicionales, después de la narrativa principal.',
    }),

    // ── 4. Final CTA Section ─────────────────────────────────────────────

    defineField({
      name: 'cta',
      title: 'Final CTA Section',
      type: 'reference',
      group: 'case',
      to: [{type: 'cta'}],
      description: "CTA que se muestra al final del caso de estudio. Los CTAs se crean y editan en 'CTAs' en el menú lateral.",
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
      title: 'Display order',
      name: 'displayOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'},
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
      title:  'title',
      client: 'client.name',
      media:  'thumbnail',
    },
    prepare({title, client, media}) {
      return {
        title:    title || 'Untitled',
        subtitle: client ?? '',
        media,
      }
    },
  },
})
