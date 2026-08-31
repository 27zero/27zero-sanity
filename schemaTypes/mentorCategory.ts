/**
 * mentorCategory.ts — EdTech Mentor category (taxonomy for `edtechMentor.category`).
 *
 * Además de clasificar entrevistas, cada categoría es dueña del copy de su propia
 * sección en la página de índice de EdTech Mentor (headline, subtitle y link a la
 * página de la serie).
 */

import {defineType, defineField} from 'sanity'

import {accentHeadingOf} from './lib/accentHeading'

export default defineType({
  name: 'mentorCategory',
  title: 'Mentor Categories',
  type: 'document',

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
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Color hexadecimal usado para el pill de categoría en la UI, ej. #4b3df2',
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Orden de aparición en los pills de EdTech Mentor (menor = primero)',
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    // ── Copy de la sección en la página de índice ───────────────────

    defineField({
      name: 'sectionHeadline',
      title: 'Section Headline',
      type: 'array',
      of: accentHeadingOf('h2'),
      validation: (Rule) => Rule.required().max(1),
      description:
        'Encabezado de la sección en la página de índice. Para resaltar la palabra de acento con el acento tipográfico del diseño (Inter medium en vez de Lora), seleccionala y ponela en cursiva (italic) — no se va a ver en cursiva en el sitio. ej. "Essential series *Interviews*".',
    }),

    defineField({
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'string',
      description: 'Texto corto debajo del encabezado de la sección.',
    }),

    defineField({
      name: 'ctaUrl',
      title: 'Series Page URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https'], allowRelative: true}),
      description:
        'Link de la página interna de la categoría. Vacío hasta que el cliente confirme esas páginas — mientras esté vacío, el botón "Go to [categoría]" no se renderiza.',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
