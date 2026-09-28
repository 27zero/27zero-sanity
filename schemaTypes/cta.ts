/**
 * cta.ts — CTA reutilizable (bloque de cierre con headline, bajada y un botón).
 *
 * Reemplaza al objeto `work.finalCta`, que estaba embebido en cada caso de estudio:
 * el mismo CTA se usa en varios proyectos, así que pasa a ser un documento propio que
 * se edita una vez y se referencia desde `work.cta`.
 *
 * Los colores salen de la paleta cerrada del design system (`lib/paletteColor.ts`).
 */

import {defineField, defineType} from 'sanity'
import {paletteColorField} from './lib/paletteColor'

export default defineType({
  name: 'cta',
  title: 'CTAs',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: "Nombre interno del CTA, ej. 'CTA general EdTech'. No se muestra en el sitio.",
      validation: Rule => Rule.required(),
    }),

    defineField({name: 'headline', title: 'Headline', type: 'string'}),

    defineField({name: 'bodyText', title: 'Body Text', type: 'text', rows: 3}),

    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      description: 'Texto del botón, ej. "Book a strategy session".',
    }),

    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'url',
      validation: Rule => Rule.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
      description: 'Destino del botón. Acepta rutas internas (ej. /contact) o URLs completas.',
    }),

    paletteColorField({
      name: 'bgColor',
      title: 'Background Color',
      description: 'Color de fondo de la sección.',
    }),

    paletteColorField({
      name: 'headlineColor',
      title: 'Headline Color',
    }),

    paletteColorField({
      name: 'bodyTextColor',
      title: 'Body Text Color',
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'headline'},
  },
})
