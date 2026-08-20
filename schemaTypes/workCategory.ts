/**
 * workCategory.ts — Work / Case Study category (taxonomy for `work.category`).
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'workCategory',
  title: 'Work Categories',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
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
      title: 'Descripción',
      type: 'text',
      rows: 2,
    }),

    defineField({
      name: 'color',
      title: 'Color de acento',
      type: 'string',
      description: 'Color hexadecimal usado para el pill de categoría en la UI, ej. #4b3df2',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
