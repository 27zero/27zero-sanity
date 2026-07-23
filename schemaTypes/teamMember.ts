/**
 * teamMember.ts — 27zero team member document.
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
  name: 'teamMember',
  title: 'Team',
  type: 'document',

  fields: [

    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g. "Chief Strategy Officer — Industry & Growth"',
    }),

    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Professional headshot. Shown in the About page team grid.',
    }),

    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide from the About page without deleting the record.',
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 10,
      description: 'Lower numbers appear first in the grid.',
    }),

  ],

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title:    'name',
      subtitle: 'role',
      media:    'photo',
      active:   'active',
    },
    prepare({title, subtitle, media, active}) {
      return {
        title:    (active === false ? '○ ' : '') + (title ?? 'Unnamed'),
        subtitle: subtitle ?? '',
        media,
      }
    },
  },
})
