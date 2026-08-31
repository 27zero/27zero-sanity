/**
 * accentHeading.ts — Shared Portable Text config for single-line headings
 * with "accent text".
 *
 * El editor selecciona un tramo y lo pone en cursiva (Italic) — el frontend lo
 * renderiza como el acento tipográfico del design system (Inter medium en vez de
 * Lora; no tiene color propio, hereda el del heading), no como texto en cursiva
 * real. Un solo decorador disponible a propósito, para que no haya ambigüedad
 * con qué logra qué.
 *
 * Vive en su propio módulo y no dentro de un schema porque lo usan varios
 * documentTypes (`settings` y `mentorCategory` hoy): duplicar la definición
 * garantizaría que se desincronicen. Su contraparte del lado del sitio es
 * `accentMarkComponents` en `src/lib/utils/portableText.ts`.
 */

import {defineArrayMember} from 'sanity'

export function accentHeadingOf(style: 'h1' | 'h2') {
  return [
    defineArrayMember({
      type: 'block',
      styles: [{title: style.toUpperCase(), value: style}],
      lists: [],
      marks: {
        decorators: [{title: 'Italic (= texto de acento)', value: 'em'}],
        annotations: [],
      },
    }),
  ]
}
