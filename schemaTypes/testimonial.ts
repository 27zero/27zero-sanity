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

    // ── El testimonio en sí ──────────────────────────────────────────

    defineField({
      name: 'quote',
      title: 'Cita',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required(),
      description: 'El texto del testimonio del cliente.',
    }),

    // ── Información del autor ────────────────────────────────────────
    // authorName es un resguardo para cuando no hay client vinculado.
    // Cuando client está vinculado, GROQ usa coalesce(client->name, authorName).

    defineField({
      name: 'authorName',
      title: 'Nombre del autor',
      type: 'string',
      description: 'Se usa cuando no hay un documento Client vinculado. ej. "Wesley Matthews"',
    }),

    defineField({
      name: 'authorRole',
      title: 'Rol del autor',
      type: 'string',
      description: 'Rol y empresa de la persona. ej. "Founder and CEO at Doctums"',
    }),

    defineField({
      name: 'avatarPhoto',
      title: 'Foto del autor',
      type: 'image',
      options: {hotspot: true},
      description: 'Foto de la persona. Se muestra como avatar circular pequeño en el slide.',
    }),

    // ── Imágenes del slide ──────────────────────────────────────────────

    defineField({
      name: 'backgroundPhoto',
      title: 'Foto de fondo',
      type: 'image',
      options: {hotspot: true},
      description: 'Imagen atmosférica grande que llena el lado izquierdo del slide.',
    }),

    // ── Controles de visualización ───────────────────────────────────────

    defineField({
      name: 'isFeatured',
      title: 'Mostrar en Home',
      type: 'boolean',
      initialValue: true,
      description: 'Cuando está activo, este testimonio aparece en el slider de la página de inicio.',
    }),

    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      initialValue: 10,
      description: 'Los números más bajos aparecen primero. Usar incrementos de 10 para dejar espacio a reordenar.',
    }),

    // ── Referencias opcionales ────────────────────────────────────────

    defineField({
      name: 'client',
      title: 'Cliente (opcional)',
      type: 'reference',
      to: [{type: 'client'}],
      description: 'Link al documento Client. Cuando está vinculado, el nombre del cliente pasa a ser la fuente de verdad.',
      // weak reference: deleting a client won't break the testimonial
      options: {disableNew: false},
    }),

    defineField({
      name: 'workProject',
      title: 'Proyecto de Work relacionado (opcional)',
      type: 'reference',
      to: [{type: 'work'}],
      description: 'Link al caso de estudio de este cliente. Habilita referencias cruzadas a futuro.',
      options: {disableNew: false},
    }),

  ],

  orderings: [
    {
      title: 'Orden de visualización',
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
      isFeatured:  'isFeatured',
    },
    prepare({quote, authorName, clientName, media, isFeatured}) {
      const name  = clientName || authorName || 'Unnamed'
      const star  = isFeatured ? '⭐ ' : '○ '
      const blurb = quote ? quote.slice(0, 60) + (quote.length > 60 ? '…' : '') : 'No quote'
      return {
        title:    `${star}${name}`,
        subtitle: blurb,
        media,
      }
    },
  },
})
