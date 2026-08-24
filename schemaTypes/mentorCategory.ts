/**
 * mentorCategory.ts — EdTech Mentor category (taxonomy for `edtechMentor.categories`).
 */

import {defineType, defineField} from 'sanity'

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
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
