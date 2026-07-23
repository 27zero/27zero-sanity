/**
 * client.ts — Client / Brand document.
 *
 * Represents a company that 27zero works with or has worked with.
 * Used in three frontend contexts:
 *
 *   1. Home logo strip     — 9 client logos in a scrolling marquee
 *                            (currently hardcoded from Webflow CDN)
 *   2. Work page marquee   — 5 SVG logos (currently from assets/logos/)
 *   3. Practice page       — brand logos with descriptions
 *
 * Also referenced (optionally) from:
 *   testimonial.client     — makes client.name the source of truth for
 *                            the testimonial author name
 *
 * Logo fields
 * -----------
 * Two separate image fields are provided because logos often need
 * different versions depending on background colour:
 *   logo      — dark version (for white/light backgrounds)
 *   logoLight — light/white version (for dark/indigo backgrounds)
 *
 * Display controls
 * ----------------
 *   featured  — appears in the home logo strip
 *   logoOrder — position in the home strip (lower = first)
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'client',
  title: 'Clients',
  type: 'document',

  fields: [

    // ── Identity ────────────────────────────────────────────────────────

    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'e.g. "Anthology", "Doctums", "D2L"',
    }),

    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: 'Client\'s public website.',
    }),

    // ── Logos ───────────────────────────────────────────────────────────

    defineField({
      name: 'logo',
      title: 'Logo (dark)',
      type: 'image',
      options: {hotspot: true},
      description: 'Dark version — used on white or light backgrounds. SVG preferred.',
    }),

    defineField({
      name: 'logoLight',
      title: 'Logo (light)',
      type: 'image',
      options: {hotspot: true},
      description: 'Light/white version — used on dark or indigo backgrounds.',
    }),

    // ── Home logo strip controls ────────────────────────────────────────

    defineField({
      name: 'featured',
      title: 'Show in Home Logo Strip',
      type: 'boolean',
      initialValue: false,
      description: 'When enabled, this client appears in the scrolling logo strip on the home page.',
    }),

    defineField({
      name: 'logoHeight',
      title: 'Logo Display Height (px)',
      type: 'number',
      initialValue: 24,
      description: 'Height in pixels for the home logo strip. Each logo has its own height to maintain visual balance. e.g. 28 for Scholarship Magic, 22 for Anthology.',
      validation: Rule => Rule.min(10).max(80).integer(),
    }),

    defineField({
      name: 'logoOrder',
      title: 'Logo Strip Order',
      type: 'number',
      initialValue: 100,
      description: 'Position in the home logo strip. Lower numbers appear first.',
    }),

    // ── Practice page description ───────────────────────────────────────

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short description used on the practice page brand logos section. e.g. "Language learning platform. We produced a series of filmed customer spotlights..."',
    }),

  ],

  orderings: [
    {
      title: 'Logo strip order',
      name: 'logoOrderAsc',
      by: [{field: 'logoOrder', direction: 'asc'}],
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
      subtitle: 'url',
      media:    'logo',
      featured: 'featured',
    },
    prepare({title, subtitle, media, featured}) {
      return {
        title:    (featured ? '⭐ ' : '') + (title ?? 'Unnamed client'),
        subtitle: subtitle ?? '',
        media,
      }
    },
  },
})
