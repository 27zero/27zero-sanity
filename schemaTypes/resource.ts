import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resource',
  title: 'Resources',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
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
      title: 'Descripción corta',
      type: 'string',
      description: 'Resumen breve mostrado en el card del listado.',
    }),

    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
    }),

    defineField({
      name: 'cardThumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen mostrada en el card del listado de Resources.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'heroBanner',
      title: 'Banner principal',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen de cabecera en la página interna del recurso.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
})
