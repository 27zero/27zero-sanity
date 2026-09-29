import {defineType, defineField} from 'sanity'
import {BG_COLOR_OPTIONS, TEXT_COLOR_OPTIONS} from './lib/palette'

export default defineType({
  name: 'resource',
  title: 'Resources',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Resumen breve mostrado en el card del listado.',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
      description:
        'Requerido para el structured data (JSON-LD) de Google. Identifica quién escribió el artículo.',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'resourceCategory'}],
      description:
        'Categoría del recurso. Opcional: hoy no se muestra en el sitio, el diseño de Resources todavía no tiene dónde ponerla.',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Marcar como destacado para mostrar en la card destacada del listado de Resources.',
    }),

    defineField({
      name: 'cardThumbnail',
      title: 'Card Thumbnail',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen mostrada en el card del listado de Resources.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'heroBgColor',
      title: 'Hero BG Color',
      type: 'string',
      options: {list: BG_COLOR_OPTIONS, layout: 'dropdown'},
      description: 'Color de fondo del hero. Vacío = Dark.',
    }),

    defineField({
      name: 'heroTextColor',
      title: 'Hero Text Color',
      type: 'string',
      options: {list: TEXT_COLOR_OPTIONS, layout: 'dropdown'},
      description: 'Color del texto, ícono y botón del hero. Revisar que se lea bien sobre el fondo elegido. Vacío = Light.',
    }),

    defineField({
      name: 'heroBanner',
      title: 'Hero Banner',
      type: 'image',
      options: {hotspot: true},
      description: '⚠️ Campo migrado de Webflow, actualmente NO visible en el sitio (el hero usa Hero BG Color). Pendiente de decidir si se borra o se mantiene.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'contentCta',
      title: 'Content CTA',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Bloque de cierre al final del artículo, debajo del contenido.',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})
