/**
 * workCategory.ts — Work / Case Study category (taxonomy for `work.category`).
 *
 * Una categoría marcada como destacada (`isFeaturedCategory`) es dueña de la selección
 * curada de proyectos destacados del índice de Work (`featuredWorks`). Reemplaza al
 * viejo `work.isFeatured`: el destacado se elige desde la categoría, no por proyecto.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'workCategory',
  title: 'Work Categories',
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
      description: 'Orden de aparición en los pills de Work (menor = primero)',
      validation: (Rule) => Rule.required().integer().min(0),
    }),

    defineField({
      name: 'isFeaturedCategory',
      title: 'Featured Category',
      type: 'boolean',
      initialValue: false,
      description:
        'Marcar para que esta categoría muestre sus proyectos destacados en el índice de Work. Si hay más de una marcada, se ordenan por "Order".',
    }),

    // Sin campo de orden aparte: el orden del array es el orden en el sitio.
    defineField({
      name: 'featuredWorks',
      title: 'Featured Works',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'work'}]})],
      hidden: ({parent}) => !parent?.isFeaturedCategory,
      validation: (Rule) => Rule.max(10).unique(),
      description:
        'Proyectos destacados de esta categoría (máximo 10). El orden en que los arrastres acá es el orden en que aparecen en el sitio.',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
