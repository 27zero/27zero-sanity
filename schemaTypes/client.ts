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
 *   logo — full client logo (Work detail page)
 *   icon — small mark for the circle on the Work card
 *
 * Display controls
 * ----------------
 *   isFeatured — appears in the home logo strip
 *   logoOrder  — position in the home strip (lower = first)
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'client',
  title: 'Clients',
  type: 'document',

  fields: [

    // ── Identidad ──────────────────────────────────────────────────────

    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'ej. "Anthology", "Doctums", "D2L"',
    }),

    defineField({
      name: 'url',
      title: 'Website URL',
      type: 'url',
      description: 'Sitio web público del cliente.',
    }),

    // ── Logos ───────────────────────────────────────────────────────────

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      description: 'Logo completo del cliente, usado en la página de detalle de Work. Se prefiere SVG.',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {hotspot: true},
      description: 'Isotipo o marca reducida del cliente, usado en el círculo pequeño de la card de Work. Se prefiere SVG cuadrado.',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    // ── Controles del logo strip de Home ────────────────────────────────

    defineField({
      name: 'isFeatured',
      title: 'Show in Home Logo Strip',
      type: 'boolean',
      initialValue: false,
      description: 'Cuando está activo, este cliente aparece en el logo strip animado de la página de inicio.',
    }),

    defineField({
      name: 'logoHeight',
      title: 'Logo Display Height (px)',
      type: 'number',
      initialValue: 24,
      description: 'Alto en píxeles para el logo strip de Home. Cada logo tiene su propio alto para mantener el balance visual. ej. 28 para Scholarship Magic, 22 para Anthology.',
      validation: Rule => Rule.min(10).max(80).integer(),
    }),

    defineField({
      name: 'logoOrder',
      title: 'Logo Strip Order',
      type: 'number',
      initialValue: 100,
      description: 'Posición en el logo strip de Home. Los números más bajos aparecen primero.',
    }),

    // ── Descripción en página de Practice ───────────────────────────────

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Descripción corta usada en la sección de logos de marca de la página de Practice. ej. "Language learning platform. We produced a series of filmed customer spotlights..."',
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
      title:      'name',
      subtitle:   'url',
      media:      'logo',
      isFeatured: 'isFeatured',
    },
    prepare({title, subtitle, media, isFeatured}) {
      return {
        title:    (isFeatured ? '⭐ ' : '') + (title ?? 'Unnamed client'),
        subtitle: subtitle ?? '',
        media,
      }
    },
  },
})
