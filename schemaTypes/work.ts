/**
 * work.ts — Work / Case Study document type.
 *
 * Each document represents one client engagement (a case study).
 *
 * The "Project Brief" tab holds the client details block of the detail page:
 * Client Tagline, the intro paragraph and the Project Type / Agency Role /
 * Location / Year details.
 *
 * The "Case Study" tab follows a fixed editorial flow:
 *
 *   Hero Image → Results
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

/**
 * Altura de las imágenes de una sección del Case Study. Los valores reales (rem/vh)
 * viven en el sitio; acá solo se elige la variante. Una por sección, porque cada
 * sección tiene un único array de imágenes.
 */
const heightVariantField = () =>
  defineField({
    name: 'heightVariant',
    title: 'Images Height',
    type: 'string',
    options: {
      list: [
        {title: 'Low', value: 'low'},
        {title: 'Medium', value: 'medium'},
        {title: 'High', value: 'high'},
      ],
      layout: 'radio',
      direction: 'horizontal',
    },
    initialValue: 'medium',
    description: 'Altura con la que se muestran las imágenes de esta sección en la página de detalle.',
  })

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
      title: 'Project Title',
      type: 'string',
      group: 'overview',
      description: 'ej. "Anthology — Legacy Conversations"',
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
      name: 'clientTagline',
      title: 'Client Tagline',
      type: 'string',
      group: 'brief',
      description: 'Tagline corto mostrado debajo del nombre del cliente en la página de detalle. También es el título del proyecto en la lista del Studio.',
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

    // ── Media (index thumbnail, video, galería) ─────────────────────────

    defineField({
      name: 'thumbnail',
      title: 'Index Thumbnail',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      description: 'Se muestra en la card del índice de Work. Recomendado: 800×600 px.',
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

    // ── 1. Hero → Results ────────────────────────────────────────────────

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'case',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
      ],
      description: 'Imagen a todo el ancho en la parte superior de la página de detalle. Recomendado: 1600×900 px.',
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
        heightVariantField(),
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
        heightVariantField(),
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
        heightVariantField(),
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
          heightVariantField(),
          defineField({
            name: 'bgColor',
            title: 'Background Color',
            type: 'string',
            description: 'Color hexadecimal del fondo de la sección, ej. #f5f5f5. Si se deja vacío, el fondo es blanco.',
          }),
          defineField({
            name: 'textColor',
            title: 'Text Color',
            type: 'string',
            description: 'Color hexadecimal del texto de la sección, ej. #101010.',
          }),
        ],
        preview: {select: {title: 'title'}},
      }],
      description: 'Secciones de contenido flexible adicionales, después de la narrativa principal.',
    }),

    // ── 4. Final CTA Section ─────────────────────────────────────────────

    defineField({
      name: 'finalCta',
      title: 'Final CTA Section',
      type: 'object',
      group: 'case',
      description: 'Bloque de cierre de la página de detalle, con llamado a la acción.',
      fields: [
        defineField({
          name: 'sectionBgColor',
          title: 'Section Background Color',
          type: 'string',
          description: 'Color hexadecimal del fondo de la sección, ej. #4b3df2.',
        }),
        defineField({
          name: 'sectionHeadlineColor',
          title: 'Headline Color',
          type: 'string',
          description: 'Color hexadecimal del headline, ej. #ffffff.',
        }),
        defineField({
          name: 'sectionBodyTextColor',
          title: 'Body Text Color',
          type: 'string',
          description: 'Color hexadecimal del texto del cuerpo, ej. #ffffff.',
        }),
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'bodyText', title: 'Body Text', type: 'text', rows: 3}),
        defineField({
          name: 'ctaText',
          title: 'CTA Text',
          type: 'string',
          description: 'Texto del botón, ej. "Book a strategy session".',
        }),
        defineField({
          name: 'ctaLink',
          title: 'CTA Link',
          type: 'url',
          validation: Rule => Rule.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
          description: 'Destino del botón. Acepta rutas internas (ej. /contact) o URLs completas.',
        }),
      ],
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
      title:         'title',
      clientTagline: 'clientTagline',
      client:        'client.name',
      media:         'thumbnail',
    },
    prepare({title, clientTagline, client, media}) {
      // En la lista del Studio mostramos el Client Tagline (más corto y
      // fácil de identificar entre muchos proyectos). Si el proyecto
      // todavía no tiene tagline, usamos el Project Title como respaldo.
      return {
        title:    clientTagline || title || 'Untitled',
        subtitle: client ?? '',
        media,
      }
    },
  },
})
