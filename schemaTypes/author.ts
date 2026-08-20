/**
 * author.ts — Content author.
 *
 * Authors are referenced from `post` documents.  The photo, role,
 * and linkedin fields were not present in the original schema —
 * they are added here because they already exist in the live site's
 * editorial structure and are needed for author bylines.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Nombre completo',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name'},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Rol / Cargo',
      type: 'string',
      description: 'ej. "Chief Strategy Officer"',
    }),

    defineField({
      name: 'company',
      title: 'Empresa',
      type: 'string',
    }),

    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'linkedin',
      title: 'URL de LinkedIn',
      type: 'url',
    }),

    defineField({
      name: 'email',
      title: 'Email (opcional)',
      type: 'string',
      description: 'No se muestra públicamente — solo para contacto interno.',
    }),
  ],

  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
