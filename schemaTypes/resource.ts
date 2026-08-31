import {defineType, defineField} from 'sanity'

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
      name: 'heroBanner',
      title: 'Hero Banner',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen de cabecera en la página interna del recurso.',
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
