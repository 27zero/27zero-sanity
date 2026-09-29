/**
 * palette.ts — Opciones de color de fondo y de texto para heros y cards.
 *
 * Las usan los heros de `edtechMarketingPractice`, `edtechMarketingService`,
 * `resource` y `settings` (`agencyHero`, `aboutHero`), y la card de Practice.
 * Todos esos campos son opcionales y sin `initialValue`: vacío = el sitio aplica
 * su fallback (fondo `dark`, texto `light`). Se guarda el nombre del token, nunca
 * el hex: el sitio lo mapea a `src/styles/global.css`.
 *
 * No confundir con `paletteColor.ts`: esa es la paleta de `cta` y
 * `work.contentSections`, con otro set de valores (incluye `white`, no `light`).
 */

export const BG_COLOR_OPTIONS = [
  {title: 'Dark',   value: 'dark'},
  {title: 'Light',  value: 'light'},
  {title: 'Black',  value: 'black'},
  {title: 'Purple', value: 'purple'},
  {title: 'Indigo', value: 'indigo'},
  {title: 'Blue',   value: 'blue'},
  {title: 'Yellow', value: 'yellow'},
]

export const TEXT_COLOR_OPTIONS = [
  {title: 'Light', value: 'light'},
  {title: 'Dark',  value: 'dark'},
]
