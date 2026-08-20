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
    {name: 'overview',  title: 'Resumen',        default: true},
    {name: 'case',      title: 'Caso de estudio'},
    {name: 'media',     title: 'Media'},
    {name: 'seo',       title: 'SEO y Social'},
    {name: 'meta',      title: 'Metadatos'},
  ],

  fields: [

    // ── Identidad ──────────────────────────────────────────────────────

    defineField({
      name: 'title',
      title: 'Título del proyecto',
      type: 'string',
      group: 'overview',
      description: 'ej. "Anthology — Legacy Conversations"',
      validation: Rule => Rule.required().max(120),
    }),

    defineField({
      name: 'slug',
      title: 'Slug de URL',
      type: 'slug',
      group: 'overview',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'reference',
      group: 'overview',
      to: [{type: 'client'}],
      description: 'El cliente al que pertenece este caso de estudio.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'clientLogo',
      title: 'Logo del cliente',
      type: 'image',
      group: 'overview',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Texto alternativo', type: 'string'}),
      ],
    }),

    // ── Campos de resumen (usados en el índice y el hero de detalle) ────

    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      group: 'overview',
      to: [{type: 'workCategory'}],
      description: 'Categoría principal para filtrar/agrupar en el índice de Work.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'services',
      title: 'Servicios entregados',
      type: 'array',
      group: 'overview',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Todos los servicios involucrados; se usa para relacionar proyectos similares.',
    }),

    defineField({
      name: 'projectType',
      title: 'Tipo de proyecto',
      type: 'string',
      group: 'overview',
      description: 'Tipo de proyecto (ej. campaña, rediseño de sitio, video)',
    }),

    defineField({
      name: 'agencyRole',
      title: 'Rol de 27zero',
      type: 'string',
      group: 'overview',
      description: 'Rol de 27zero en este proyecto',
    }),

    defineField({
      name: 'year',
      title: 'Año',
      type: 'number',
      group: 'overview',
      validation: Rule => Rule.integer().min(2000).max(2099),
    }),

    defineField({
      name: 'excerpt',
      title: 'Descripción corta',
      type: 'text',
      group: 'overview',
      rows: 2,
      description: 'Resumen de una oración mostrado en la card del índice de Work.',
      validation: Rule => Rule.required().max(220),
    }),

    defineField({
      name: 'clientTagline',
      title: 'Tagline del cliente',
      type: 'string',
      group: 'overview',
      description: 'Tagline corto mostrado debajo del nombre del cliente en la página de detalle.',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Los proyectos destacados aparecen primero y más grandes en la página de índice.',
    }),

    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      group: 'meta',
      description: 'Los números más bajos aparecen primero dentro de su categoría. Default: 100.',
      initialValue: 100,
    }),

    // ── Media ─────────────────────────────────────────────────────────

    defineField({
      name: 'thumbnail',
      title: 'Miniatura del índice',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Texto alternativo', type: 'string'}),
      ],
      description: 'Se muestra en la card del índice de Work. Recomendado: 800×600 px.',
    }),

    defineField({
      name: 'heroImage',
      title: 'Imagen principal',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Texto alternativo', type: 'string'}),
      ],
      description: 'Imagen a todo el ancho en la parte superior de la página de detalle. Recomendado: 1600×900 px.',
    }),

    defineField({
      name: 'heroVideo',
      title: 'URL de video principal',
      type: 'url',
      group: 'media',
      description: 'URL opcional de YouTube o Vimeo. Se muestra en lugar de la imagen principal cuando está presente.',
    }),

    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {name: 'alt',     title: 'Texto alternativo', type: 'string'},
            {name: 'caption', title: 'Leyenda',           type: 'string'},
          ],
        },
      ],
      description: 'Imágenes adicionales mostradas en la galería de la página de detalle.',
    }),

    // ── Narrativa del caso de estudio ────────────────────────────────────

    defineField({
      name: 'brief',
      title: 'El brief',
      type: 'text',
      group: 'case',
      rows: 3,
      description: 'Brief del cliente / contexto, en un párrafo.',
    }),

    defineField({
      name: 'challenge',
      title: 'El desafío',
      type: 'object',
      group: 'case',
      description: 'Sección del desafío del proyecto',
      fields: [
        defineField({
          name: 'challengeTitle',
          title: 'Título de sección',
          type: 'string',
          initialValue: 'The Challenge',
          description: 'Título mostrado sobre el desafío',
        }),
        defineField({
          name: 'challengeContent',
          title: 'Contenido del desafío',
          type: 'blockContent',
          description: '¿Qué problema estábamos resolviendo?',
        }),
        defineField({
          name: 'challengeImages',
          title: 'Imágenes del desafío',
          type: 'array',
          description: 'Imágenes de la sección del desafío',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Texto alternativo', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Leyenda', type: 'string'}),
              ],
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'solution',
      title: 'Solución',
      type: 'object',
      group: 'case',
      fields: [
        defineField({name: 'headline', title: 'Título de la solución', type: 'string',
          description: 'ej. "Changing the nature of the traditional B2B event."'}),
        defineField({name: 'body', title: 'Cuerpo de la solución', type: 'blockContent'}),
        defineField({
          name: 'solutionImages',
          title: 'Imágenes de la solución',
          type: 'array',
          description: 'Imágenes de la sección de solución',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Texto alternativo', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Leyenda', type: 'string'}),
              ],
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'impact',
      title: 'El impacto',
      type: 'array',
      group: 'case',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'verb',   title: 'Verbo',     type: 'string', description: 'ej. "Fueled"'},
            {name: 'result', title: 'Resultado', type: 'text',   description: 'ej. "El ciclo de ventas con más de 50 cuentas clave."'},
          ],
          preview: {
            select: {title: 'verb', subtitle: 'result'},
          },
        },
      ],
      description: 'Puntos de impacto: pares verbo + resultado (usado en el layout de lista destacada).',
    }),

    // ── Campos de la página de detalle CMS ───────────────────────────
    // Usados por pages/work/work-cms/index.html

    defineField({
      name: 'contributions',
      title: 'Contribuciones',
      type: 'array',
      group: 'case',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
      description: 'Lista de contribuciones/servicios entregados, mostrada como lista de viñetas.',
    }),

    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      group: 'case',
      description: 'ej. "New York, USA"',
    }),

    defineField({
      name: 'description',
      title: 'Descripción del proyecto',
      type: 'object',
      group: 'case',
      description: 'Sección de contenido/descripción del proyecto',
      fields: [
        defineField({
          name: 'projectTitle',
          title: 'Título de sección',
          type: 'string',
          initialValue: 'Project Content',
          description: 'Título mostrado sobre el contenido del proyecto',
        }),
        defineField({
          name: 'projectContent',
          title: 'Contenido del proyecto',
          type: 'blockContent',
          description: 'Descripción completa del proyecto mostrada en la sección de información del cliente.',
        }),
        defineField({
          name: 'projectImages',
          title: 'Imágenes del proyecto',
          type: 'array',
          description: 'Imágenes de la sección de contenido del proyecto',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({name: 'alt', title: 'Texto alternativo', type: 'string', validation: Rule => Rule.required()}),
                defineField({name: 'caption', title: 'Leyenda', type: 'string'}),
              ],
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'results',
      title: 'Resultados',
      type: 'array',
      group: 'case',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'number',      title: 'Estadística / Número', type: 'string',
            description: 'ej. "20%", "1K", "95%"'}),
          defineField({name: 'description', title: 'Descripción',   type: 'text', rows: 2}),
        ],
        preview: {select: {title: 'number', subtitle: 'description'}},
      }],
      description: 'Hasta 4 estadísticas de resultado mostradas en la sección de Resultados.',
    }),

    defineField({
      name: 'contentSections',
      title: 'Secciones de contenido',
      type: 'array',
      group: 'case',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title',  title: 'Título de sección', type: 'string'}),
          defineField({name: 'body',   title: 'Texto del cuerpo',  type: 'text', rows: 4}),
          defineField({
            name: 'images', title: 'Imágenes', type: 'array',
            of: [{
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', title: 'Texto alternativo', type: 'string'})],
            }],
          }),
        ],
        preview: {select: {title: 'title'}},
      }],
      description: 'Secciones de contenido flexible (secciones 5–8 de la página de detalle CMS).',
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
      title: 'Destacados primero, luego por orden',
      name: 'featuredOrder',
      by: [
        {field: 'isFeatured', direction: 'desc'},
        {field: 'order',      direction: 'asc'},
        {field: 'title',      direction: 'asc'},
      ],
    },
    {
      title: 'Año (más reciente primero)',
      name: 'yearDesc',
      by: [{field: 'year', direction: 'desc'}],
    },
    {
      title: 'Cliente A–Z',
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
