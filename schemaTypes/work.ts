/**
 * work.ts — Work / Case Study document type.
 *
 * Each document represents one client engagement (a case study).
 *
 * The "Case Study" tab follows a fixed editorial flow:
 *
 *   Hero Image → Intro (Brief) → Results
 *   ────────────────────────────────────────
 *   The Business Problem → Communication Challenge → Strategic Idea → Client Quote
 *   ────────────────────────────────────────
 *   Additional Sections
 *   ────────────────────────────────────────
 *   (Other / legacy fields, collapsed — kept for backward compatibility)
 *
 * The 4 "narrative" sections (Business Problem, Communication Challenge,
 * Strategic Idea, Client Quote) each carry their own editable "Section
 * Label" field. It ships with a standard default (e.g. "Business Problem")
 * but can be overridden per project (e.g. "RFP Brief") for clients that use
 * their own terminology — the label is content, not code.
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

  fieldsets: [
    {
      name: 'narrative',
      title: 'Case Narrative — Business Problem → Communication Challenge → Strategic Idea → Client Quote',
      description: 'Cada sección tiene su propio "Section Label" editable: úsalo para renombrar la sección en proyectos donde el cliente usa su propia terminología (ej. "Business Problem" → "RFP Brief").',
    },
    {
      name: 'additionalSections',
      title: 'Additional Sections',
      description: 'Bloques de contenido flexible extra, después de la narrativa principal (opcional).',
    },
    {
      name: 'legacy',
      title: 'Other Case Fields',
      description: 'Campos existentes que no forman parte del flujo estándar de arriba. Se conservan por compatibilidad — no se pierde información.',
      options: {collapsible: true, collapsed: true},
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

    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'overview',
      description: 'Tipo de proyecto (ej. campaña, rediseño de sitio, video)',
    }),

    defineField({
      name: 'agencyRole',
      title: '27zero Role',
      type: 'string',
      group: 'overview',
      description: 'Rol de 27zero en este proyecto',
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
      rows: 4,
      description: 'Resumen mostrado en la card del índice de Work.',
      validation: Rule => Rule.required().max(660),
    }),

    defineField({
      name: 'clientTagline',
      title: 'Client Tagline',
      type: 'string',
      group: 'overview',
      description: 'Tagline corto mostrado debajo del nombre del cliente en la página de detalle.',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Los proyectos destacados aparecen primero y más grandes en la página de índice.',
    }),

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

    // ── 1. Hero → Intro → Results ────────────────────────────────────────

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
      name: 'brief',
      title: 'Intro (Brief)',
      type: 'text',
      group: 'case',
      rows: 3,
      description: 'Brief del cliente / contexto, en un párrafo. Se muestra como la sección de introducción del caso.',
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
      ],
    }),

    defineField({
      name: 'clientQuote',
      title: 'Client Quote',
      type: 'object',
      group: 'case',
      fieldset: 'narrative',
      description: 'Cita del cliente para esta sección. Enlaza un documento "Testimonial" existente (créalo en Testimonials si no existe aún, y enlaza su campo "Related Work Project" a este mismo caso).',
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          initialValue: 'Client Quote',
          description: 'Título mostrado sobre esta sección. Editable por proyecto.',
        }),
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'reference',
          to: [{type: 'testimonial'}],
          description: 'Testimonial a mostrar en esta sección del caso de estudio.',
        }),
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
        ],
        preview: {select: {title: 'title'}},
      }],
      description: 'Secciones de contenido flexible adicionales, después de la narrativa principal.',
    }),

    // ── 4. Other / legacy case fields (kept for backward compatibility) ──

    defineField({
      name: 'impact',
      title: 'The Impact',
      type: 'array',
      group: 'case',
      fieldset: 'legacy',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'verb',   title: 'Verb',   type: 'string', description: 'ej. "Fueled"'},
            {name: 'result', title: 'Result', type: 'text',   description: 'ej. "El ciclo de ventas con más de 50 cuentas clave."'},
          ],
          preview: {
            select: {title: 'verb', subtitle: 'result'},
          },
        },
      ],
      description: 'Puntos de impacto: pares verbo + resultado (usado en el layout de lista destacada).',
    }),

    defineField({
      name: 'contributions',
      title: 'Contributions',
      type: 'array',
      group: 'case',
      fieldset: 'legacy',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Lista de contribuciones/servicios entregados, mostrada como lista de viñetas.',
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'case',
      fieldset: 'legacy',
      description: 'ej. "New York, USA"',
    }),

    defineField({
      name: 'description',
      title: 'Project Description',
      type: 'object',
      group: 'case',
      fieldset: 'legacy',
      description: 'Sección de contenido/descripción del proyecto',
      fields: [
        defineField({
          name: 'projectTitle',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Project Content',
          description: 'Título mostrado sobre el contenido del proyecto',
        }),
        defineField({
          name: 'projectContent',
          title: 'Project Content',
          type: 'blockContent',
          description: 'Descripción completa del proyecto mostrada en la sección de información del cliente.',
        }),
        defineField({
          name: 'projectImages',
          title: 'Project Images',
          type: 'array',
          description: 'Imágenes de la sección de contenido del proyecto',
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
      title:         'title',
      clientTagline: 'clientTagline',
      client:        'client.name',
      category:      'category.title',
      isFeatured:    'isFeatured',
      media:         'thumbnail',
    },
    prepare({title, clientTagline, client, category, isFeatured, media}) {
      const star = isFeatured ? '⭐ ' : ''
      // En la lista del Studio mostramos el Client Tagline (más corto y
      // fácil de identificar entre muchos proyectos). Si el proyecto
      // todavía no tiene tagline, usamos el Project Title como respaldo.
      return {
        title:    `${star}${clientTagline || title || 'Untitled'}`,
        subtitle: [client, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
