/**
 * mentorCategory.ts — EdTech Mentor category (taxonomy for `edtechMentor.category`).
 *
 * Además de clasificar entrevistas, cada categoría es dueña del copy de su propia
 * sección en la página de índice de EdTech Mentor (headline y subtitle) y de la
 * selección curada de entrevistas de su slider. La URL de su página propia sale del
 * `slug` (o del `title` si el slug está vacío) — no hay campo de link aparte.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

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
      description:
        'Define la URL de la página de la categoría (/edtech-mentor/[slug]). Si se deja vacío, la URL se arma a partir del título.',
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
      name: 'textColor',
      title: 'Accent Color Text',
      type: 'string',
      description:
        'Color hexadecimal del texto de los pills que usan el Accent Color, ej. #ffffff. En los pills de filtro se ve al hacer hover. Si se deja vacío, se elige blanco o negro automáticamente según el Accent Color.',
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

    // Sin campo de orden aparte: el orden del array es el orden del slider.
    defineField({
      name: 'featuredInterviews',
      title: 'Featured Interviews',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'edtechMentor'}]})],
      validation: (Rule) => Rule.max(10).unique(),
      description:
        'Entrevistas que se muestran en el slider de esta sección (máximo 10). El orden en que las arrastres acá es el orden en que aparecen en el slider.',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
