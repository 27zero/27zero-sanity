/**
 * team.ts — 27zero team member document.
 *
 * Used on the About page team grid.
 * Each document is one person on the team.
 *
 * Distinct from `author` (which is for content writers with public
 * profiles, slugs, bios, and LinkedIn URLs).  Team members are
 * internal — they appear on the About page grid, can be marked
 * inactive without deletion, and are ordered independently.
 *
 * Current template fields (pages/about/overview.html):
 *   team-card-name      — person's name
 *   team-card-position  — role / title
 *   (photo placeholder exists in CSS but no <img> yet — field added
 *    here so editors can upload photos before the template is wired)
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'team',
  title: 'Team',
  type: 'document',

  fields: [

    defineField({
      name: 'name',
      title: 'Nombre completo',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Rol / Cargo',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'ej. "Chief Strategy Officer — Industry & Growth"',
    }),

    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      options: {hotspot: true},
      description: 'Foto profesional. Se muestra en la grilla de team de la página About.',
    }),

    defineField({
      name: 'isActive',
      title: 'Activo',
      type: 'boolean',
      initialValue: true,
      description: 'Desmarcar para ocultar de la página About sin eliminar el registro.',
    }),

    defineField({
      name: 'order',
      title: 'Orden de visualización',
      type: 'number',
      initialValue: 10,
      description: 'Los números más bajos aparecen primero en la grilla.',
    }),

  ],

  orderings: [
    {
      title: 'Orden de visualización',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Nombre A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title:     'name',
      subtitle:  'role',
      media:     'photo',
      isActive:  'isActive',
    },
    prepare({title, subtitle, media, isActive}) {
      return {
        title:    (isActive === false ? '○ ' : '') + (title ?? 'Unnamed'),
        subtitle: subtitle ?? '',
        media,
      }
    },
  },
})
