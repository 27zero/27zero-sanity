/**
 * testimonial.ts — Client testimonial document.
 *
 * Used on the home page slider ("Client voices" section).
 * Each document is one testimonial slide.
 *
 * Reference model (Modelo B — optional references with fallback):
 *   client      → optional reference to a client Document.
 *                 When linked, authorName is derived from client.name via GROQ
 *                 coalesce(client->name, authorName), eliminating duplication.
 *                 Not required — allows testimonials from entities that have
 *                 no client Document yet.
 *   workProject → optional reference to the work project related to this
 *                 testimonial. Enables future cross-referencing (e.g. show
 *                 testimonial on the case study page).
 *
 * Fields that always live on this document (not derivable from client):
 *   authorRole      — person-level data ("Founder and CEO at Doctums")
 *   avatarPhoto     — headshot of the person (≠ company logo)
 *   backgroundPhoto — atmospheric scene image for the slide background
 *   quote           — the testimonial text itself
 *
 * Frontend impact:
 *   Replaces the 3 hardcoded testi-slide divs in pages/home/index.html.
 *   Query: *[_type=='testimonial' && featured==true] | order(order asc)
 *   No breaking changes — existing hardcoded HTML is replaced by a Jinja loop.
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',

  fields: [

    // ── The testimonial itself ─────────────────────────────────────────

    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
      description: 'The client\'s testimonial text.',
    }),

    // ── Author information ─────────────────────────────────────────────
    // authorName is a fallback for when no client reference is set.
    // When client is linked, GROQ uses coalesce(client->name, authorName).

    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Used when no Client document is linked. e.g. "Wesley Matthews"',
    }),

    defineField({
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      description: 'Person\'s role and company. e.g. "Founder and CEO at Doctums"',
    }),

    defineField({
      name: 'avatarPhoto',
      title: 'Author Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Headshot of the person. Shown as a small circular avatar in the slide.',
    }),

    // ── Slide imagery ──────────────────────────────────────────────────

    defineField({
      name: 'backgroundPhoto',
      title: 'Background Photo',
      type: 'image',
      options: {hotspot: true},
      description: 'Large atmospheric image filling the left side of the slide.',
    }),

    // ── Display controls ───────────────────────────────────────────────

    defineField({
      name: 'featured',
      title: 'Show on Home',
      type: 'boolean',
      initialValue: true,
      description: 'When enabled, this testimonial appears in the home page slider.',
    }),

    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 10,
      description: 'Lower numbers appear first. Use increments of 10 to leave room for reordering.',
    }),

    // ── Optional references ────────────────────────────────────────────

    defineField({
      name: 'client',
      title: 'Client (optional)',
      type: 'reference',
      to: [{type: 'client'}],
      description: 'Link to the Client document. When linked, the client name becomes the source of truth.',
      // weak reference: deleting a client won't break the testimonial
      options: {disableNew: false},
    }),

    defineField({
      name: 'workProject',
      title: 'Related Work Project (optional)',
      type: 'reference',
      to: [{type: 'workProject'}],
      description: 'Link to the case study for this client. Enables future cross-referencing.',
      options: {disableNew: false},
    }),

  ],

  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      quote:       'quote',
      authorName:  'authorName',
      clientName:  'client.name',
      media:       'avatarPhoto',
      featured:    'featured',
    },
    prepare({quote, authorName, clientName, media, featured}) {
      const name  = clientName || authorName || 'Unnamed'
      const star  = featured ? '⭐ ' : '○ '
      const blurb = quote ? quote.slice(0, 60) + (quote.length > 60 ? '…' : '') : 'No quote'
      return {
        title:    `${star}${name}`,
        subtitle: blurb,
        media,
      }
    },
  },
})
