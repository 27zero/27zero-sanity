/**
 * category.ts — Content category.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Categories',
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
      description: 'Hex color used for category pill UI, e.g. #4b3df2',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
