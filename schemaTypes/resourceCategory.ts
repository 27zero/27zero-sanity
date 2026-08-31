/**
 * resourceCategory.ts — Resources category (taxonomy for `resource.category`).
 *
 * Más simple que `workCategory`/`mentorCategory` a propósito: no lleva `order`,
 * `ctaUrl` ni copy de sección porque todavía no hay diseño de página que consuma
 * estas categorías. Solo clasifica, y el color viene tal cual de Webflow.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'resourceCategory',
  title: 'Resource Categories',
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
      name: 'color',
      title: 'Accent Color',
      type: 'string',
      description: 'Color hexadecimal de la categoría, ej. #f79009',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
