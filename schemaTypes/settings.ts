/**
 * settings.ts — Global site settings singleton.
 *
 * Singleton via __experimental_actions: create/delete are blocked so the
 * Studio's default document actions can't spawn duplicates or remove the
 * one settings document.
 *
 * Organised by editorial sections so content editors find their
 * destination immediately without navigating a flat field list.
 *
 * Tabs (groups):
 *   Identity · SEO · Analytics · Social
 *   Navbar · Footer
 *   Home · About · Work · Mentor · Resources · Contact · Agency
 *
 * SEO uses the shared `seo` object (see seo.ts) as the site-wide fallback,
 * replacing the previous loose defaultSeoTitle/defaultSeoDescription/defaultOgImage fields.
 *
 * Backwards compatibility
 * -----------------------
 * Fields that existed in the previous schema are preserved exactly:
 *   siteTitle, siteDescription, siteUrl, logo (Identity)
 *   gaId, hubspotId (Analytics)
 *   linkedinUrl, twitterUrl (Social)
 *   contactEmail, officeUS, officeCO (Contact — kept as text fields)
 *
 * New office objects (officeUSNew, officeCONew) are added alongside
 * the legacy text fields during migration.  Once content is transferred
 * the legacy fields will be removed in a future commit.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',

  // Singleton: blocks create/delete from the Studio's default document
  // actions so editors can only update the one settings document.
  // Valid Sanity Studio API, not present in this version's type defs.
  // @ts-expect-error — __experimental_actions is untyped but functional
  __experimental_actions: ['update', 'publish'],

  groups: [
    // ── Técnico / global ────────────────────────────────────────────
    {name: 'identity',  title: 'Identity',  default: true},
    {name: 'seo',       title: 'SEO'},
    {name: 'analytics', title: 'Analytics'},
    {name: 'social',    title: 'Social'},
    // ── Chrome de UI ────────────────────────────────────────────────
    {name: 'navbar',    title: 'Navbar'},
    {name: 'footer',    title: 'Footer'},
    // ── Secciones de página ─────────────────────────────────────────
    {name: 'home',      title: 'Home'},
    {name: 'about',     title: 'About'},
    {name: 'work',      title: 'Work'},
    {name: 'mentor',    title: 'Mentor'},
    {name: 'resources', title: 'Resources'},
    {name: 'contact',   title: 'Contact'},
    {name: 'agency',    title: 'EdTech Marketing'},
  ],

  fieldsets: [
    {name: 'services', title: 'Services'},
  ],

  fields: [

    // ════════════════════════════════════════════════════════════════
    // IDENTIDAD — existente, sin cambios
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      group: 'identity',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      group: 'identity',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      group: 'identity',
      description: 'URL de producción, ej. https://www.27zero.agency',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      options: {hotspot: true},
    }),

    // ════════════════════════════════════════════════════════════════
    // SEO — existente, sin cambios
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      description: 'Resguardo a nivel de sitio, usado cuando una página/documento no tiene sus propios campos de SEO configurados.',
    }),

    // ════════════════════════════════════════════════════════════════
    // ANALYTICS — existente, sin cambios
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'gaId',
      title: 'Google Analytics 4 ID',
      type: 'string',
      group: 'analytics',
      description: 'ej. G-XXXXXXXXXX',
    }),
    defineField({
      name: 'hubspotId',
      title: 'HubSpot Portal ID',
      type: 'string',
      group: 'analytics',
    }),

    // ════════════════════════════════════════════════════════════════
    // SOCIAL — existente, sin cambios
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
    }),
    defineField({
      name: 'twitterUrl',
      title: 'Twitter / X URL',
      type: 'url',
      group: 'social',
    }),

    // ════════════════════════════════════════════════════════════════
    // NAVBAR
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'navbarCta',
      title: 'CTA Button',
      type: 'object',
      group: 'navbar',
      description: 'El botón principal de llamado a la acción en la esquina superior derecha del navbar.',
      fields: [
        defineField({name: 'text',  title: 'Button Text', type: 'string',
          description: 'ej. "Let\'s Talk!"'}),
        defineField({name: 'url',   title: 'Button URL',  type: 'string',
          description: 'ej. "/lets-talk"'}),
        defineField({name: 'micro', title: 'Micro Copy',  type: 'string',
          description: 'Texto pequeño mostrado debajo del CTA en secciones hero. ej. "Free. 30 min. No sales pitch."'}),
      ],
    }),

    defineField({
      name: 'navbarWorkDropdown',
      title: 'Work Dropdown',
      type: 'object',
      group: 'navbar',
      description: 'Links mostrados en el menú desplegable "Work".',
      fields: [
        defineField({
          name: 'items',
          title: 'Links',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'linkItem',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'href',  title: 'URL',   type: 'string'}),
              ],
              preview: {select: {title: 'label', subtitle: 'href'}},
            }),
          ],
        }),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // FOOTER
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'footerCta',
      title: 'CTA Section',
      type: 'object',
      group: 'footer',
      description: 'La sección de llamado a la acción al final de cada página.',
      fields: [
        defineField({name: 'eyebrow',    title: 'Eyebrow',      type: 'string',
          description: 'ej. "Begin your journey to growth"'}),
        defineField({name: 'headline',   title: 'Headline',     type: 'string',
          description: 'Título principal del bloque CTA.'}),
        defineField({name: 'text',       title: 'Body Text',    type: 'text', rows: 2,
          description: 'Texto de apoyo opcional debajo del título.'}),
        defineField({name: 'buttonText', title: 'Button Text',  type: 'string',
          description: 'ej. "Book a strategy session"'}),
      ],
    }),

    defineField({
      name: 'footerNavigation',
      title: 'Navigation',
      type: 'object',
      group: 'footer',
      description: 'Links mostrados en las columnas del footer.',
      fields: [
        defineField({
          name: 'links',
          title: 'Links',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'footerLink',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string'}),
                defineField({name: 'href',  title: 'URL',   type: 'string'}),
              ],
              preview: {select: {title: 'label', subtitle: 'href'}},
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'footerCopyright',
      title: 'Copyright',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({name: 'year', title: 'Year', type: 'string',
          description: 'ej. "2026"'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // HOME
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'homeHero',
      title: 'Hero',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "Turn EdTech purpose into brand power."'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
        defineField({name: 'video',    title: 'Background Video URL', type: 'url',
          description: 'URL directa al archivo .mp4 (servido desde assets/).'}),
        defineField({name: 'poster',   title: 'Video Poster Image', type: 'image',
          options: {hotspot: true},
          description: 'Se muestra mientras carga el video.'}),
      ],
    }),

    defineField({
      name: 'homeWork',
      title: 'Work Section',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline',    title: 'Headline',     type: 'string'}),
        defineField({name: 'subtitle',    title: 'Subtitle',     type: 'string',
          description: 'Texto corto debajo del título. ej. "First-hand expertise, innovative conceptual thinking & design, client-first approach."'}),
        defineField({name: 'showreelUrl', title: 'Showreel URL', type: 'url',
          description: 'URL de YouTube o Vimeo para el botón del showreel.'}),
      ],
    }),

    defineField({
      name: 'homeMentor',
      title: 'EdTech Mentor Section',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
      ],
    }),

    defineField({
      name: 'homeApart',
      title: '"What Sets 27zero Apart" Section',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline',    title: 'Headline',    type: 'string'}),
        defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
        defineField({
          name: 'slides',
          title: 'Slides',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'apartSlide',
              fields: [
                defineField({name: 'title', title: 'Title', type: 'string'}),
                defineField({name: 'text',  title: 'Text',  type: 'text', rows: 2}),
              ],
              preview: {select: {title: 'title', subtitle: 'text'}},
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'homeNewsletter',
      title: 'Newsletter Section',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline',    title: 'Headline',         type: 'string'}),
        defineField({name: 'placeholder', title: 'Input Placeholder', type: 'string',
          description: 'ej. "you@institution.edu"'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // ABOUT
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'aboutHero',
      title: 'Hero',
      type: 'object',
      group: 'about',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 3}),
        defineField({name: 'image',    title: 'Background Image', type: 'image',
          options: {hotspot: true}}),
      ],
    }),

    defineField({
      name: 'aboutDna',
      title: 'DNA Section',
      type: 'object',
      group: 'about',
      description: 'Sección "Creativity is our DNA".',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 3}),
      ],
    }),

    defineField({
      name: 'aboutProofPoint',
      title: 'Proof Point',
      type: 'object',
      group: 'about',
      fields: [
        defineField({name: 'title', title: 'Title', type: 'string'}),
        defineField({name: 'text',  title: 'Text',  type: 'text', rows: 3}),
        defineField({name: 'image', title: 'Image', type: 'image',
          options: {hotspot: true}}),
      ],
    }),

    defineField({
      name: 'aboutTeam',
      title: 'Team Section',
      type: 'object',
      group: 'about',
      description: 'La sección "The people behind the work" en la página About.',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "The people behind the work."'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2,
          description: 'Párrafo de apoyo debajo del título.'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // WORK
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'workHero',
      title: 'Hero',
      type: 'object',
      group: 'work',
      fields: [
        defineField({name: 'eyebrow',  title: 'Eyebrow',  type: 'string',
          description: 'ej. "Work: Behind the fastest-growing EdTech brands"'}),
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // MENTOR
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'mentorHero',
      title: 'Hero',
      type: 'object',
      group: 'mentor',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2}),
      ],
    }),

    defineField({
      name: 'mentorCta',
      title: 'CTA Section',
      type: 'object',
      group: 'mentor',
      description: 'El CTA "Begin your journey" al final de la página de índice de Mentor.',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // RESOURCES
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'resourcesHero',
      title: 'Hero',
      type: 'object',
      group: 'resources',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // CONTACT — campos existentes preservados + objetos nuevos agregados
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'contactHero',
      title: 'Hero',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2}),
      ],
    }),

    // Campo existente — preservado
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),

    // Objeto estructurado nuevo (junto al campo de texto legado)
    defineField({
      name: 'officeUSNew',
      title: 'Office US',
      type: 'object',
      group: 'contact',
      description: 'Reemplaza el campo de texto legado "US Office Address" una vez migrado el contenido.',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
        defineField({name: 'phone',   title: 'Phone',   type: 'string'}),
        defineField({name: 'email',   title: 'Email',   type: 'string'}),
      ],
    }),

    // Campo existente — preservado durante la migración
    defineField({
      name: 'officeUS',
      title: 'US Office Address (legacy — migrate to Office US above)',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),

    // Objeto estructurado nuevo (junto al campo de texto legado)
    defineField({
      name: 'officeCONew',
      title: 'Office CO',
      type: 'object',
      group: 'contact',
      description: 'Reemplaza el campo de texto legado "Colombia Office Address" una vez migrado el contenido.',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
        defineField({name: 'phone',   title: 'Phone',   type: 'string'}),
        defineField({name: 'email',   title: 'Email',   type: 'string'}),
      ],
    }),

    // Campo existente — preservado durante la migración
    defineField({
      name: 'officeCO',
      title: 'Colombia Office Address (legacy — migrate to Office CO above)',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),

    // ════════════════════════════════════════════════════════════════
    // EDTECH MARKETING AGENCY
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'agencyHero',
      title: 'Hero',
      type: 'object',
      group: 'agency',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "The first and only agency built for EdTech."'}),
        defineField({name: 'text',     title: 'Subtitle', type: 'string',
          description: 'ej. "Three practices. One goal: helping EdTech brands..."'}),
      ],
    }),

    defineField({
      name: 'agencyPracticesSection',
      title: 'Practices Section',
      type: 'object',
      group: 'agency',
      description: 'El encabezado de la sección "Three practices. One goal."',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "Three practices. One goal."'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2}),
      ],
    }),

    defineField({
      name: 'agencyClosingCta',
      title: 'Closing CTA',
      type: 'object',
      group: 'agency',
      description: 'La sección CTA al final de la página EdTech Marketing Agency.',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'ej. "Let\'s partner to articulate and unpack meaningful results."'}),
      ],
    }),

    // ── Services (nuevo) ─────────────────────────────────────────────

    defineField({
      name: 'servicesTitle',
      title: 'Title',
      type: 'string',
      group: 'agency',
      fieldset: 'services',
      description: 'Título de la sección de Services en la página EdTech Marketing',
    }),

    defineField({
      name: 'servicesDescription',
      title: 'Description',
      type: 'text',
      group: 'agency',
      fieldset: 'services',
      description: 'Texto introductorio de la sección de Services',
    }),
  ],

  preview: {
    select: {title: 'siteTitle'},
    prepare: ({title}) => ({title: title ?? 'Site Settings'}),
  },
})
