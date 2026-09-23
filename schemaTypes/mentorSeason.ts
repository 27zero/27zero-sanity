/**
 * mentorSeason.ts — EdTech Mentor season (taxonomy for `edtechMentor.season`).
 *
 * Más chica que `mentorCategory` a propósito: sin `order`, `ctaUrl` ni copy de
 * sección, porque la season no tiene página ni sección propia — solo alimenta el
 * pill de las cards. Sin campo de color de texto: el contraste se calcula en el sitio.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'mentorSeason',
  title: 'Mentor Seasons',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description:
        'Color hexadecimal usado para el pill de season en las cards, ej. #4b3df2. Si se deja vacío, el pill usa el color oscuro por defecto.',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'color'},
  },
})
