/**
 * edtechMarketingService.ts — EdTech Marketing Service document.
 *
 * Scaffold — fields de contenido pendientes de Etapa 5 (mapeo contra Figma, ver PLANNING.md).
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'edtechMarketingService',
  title: 'EdTech Marketing Services',
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
  ],

  preview: {
    select: {title: 'title'},
  },
})
