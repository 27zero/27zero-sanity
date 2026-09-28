/**
 * paletteColor.ts — Paleta cerrada de colores para fondos y textos de sección.
 *
 * El editor elige entre los tokens de color del design system en vez de escribir
 * un hex libre, así ningún bloque sale con un color fuera de marca. Se guarda el
 * nombre del token (ej. "indigo"), nunca el hex: el sitio lo mapea a
 * `var(--color-<valor>)` de `src/styles/global.css`, que es la fuente de verdad de
 * los hex. Los hex de los títulos son solo una referencia visual para el editor:
 * si cambia un token en `global.css`, se actualiza el título acá.
 *
 * Vive en su propio módulo porque lo usan varios documentTypes (`cta` y
 * `work.contentSections` hoy). Su espejo en el sitio es `PaletteColor` en
 * `src/types/sanity.ts`.
 *
 * No aplica a los accent de pills (`mentorCategory.color`, `mentorSeason.color`):
 * esos siguen con hex libre.
 */

import {defineField} from 'sanity'

export const PALETTE_COLORS = [
  {title: 'Indigo (#440E92)', value: 'indigo'},
  {title: 'Purple (#B382F9)', value: 'purple'},
  {title: 'Black (#101010)',  value: 'black'},
  {title: 'White (#FFFFFF)',  value: 'white'},
]

interface PaletteColorFieldOptions {
  name: string
  title: string
  description?: string
}

export function paletteColorField({name, title, description}: PaletteColorFieldOptions) {
  return defineField({
    name,
    title,
    type: 'string',
    description,
    options: {
      list: PALETTE_COLORS,
      layout: 'radio',
      direction: 'horizontal',
    },
  })
}
