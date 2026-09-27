/**
 * edtechMarketingPractice.ts — EdTech Marketing Practice document.
 *
 * 27zero organiza su oferta en Practices: cada una nombrada por el motivo real
 * que trae a un cliente a la agencia (un rebranding, un lanzamiento, una entrada
 * a un nuevo mercado), no por la metodología interna usada para resolverlo.
 * La lista de Practices es abierta — hoy son nueve, pero se espera que crezca
 * a medida que surjan nuevos triggers recurrentes en conversaciones reales con
 * clientes. No hardcodear una cantidad ni un listado fijo en comentarios ni en
 * el front — el `order` de abajo controla la grilla, no un enum cerrado.
 *
 * Cada practice aparece en tres contextos:
 *
 *   1. Home page — pcard (card chica: title + shortDescription + clientNames + href)
 *   2. EdTech Marketing index — practices-card (title + shortDescription + cardImage).
 *      El ícono NO sale de acá: se resuelve en el sitio (PRACTICE_ICONS en
 *      edtech-marketing.astro).
 *   3. Practice detail page — página completa con hero, sección de capacidad,
 *      bloque de clientes, practice scopes ("conversation engine"), y menú de
 *      servicios relacionados (relatedServices)
 *
 * Field groups siguen las secciones editoriales de la página de detalle para
 * que los editores de contenido vean exactamente lo que están editando.
 */

import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'edtechMarketingPractice',
  title: 'EdTech Marketing Practices',
  type: 'document',

  groups: [
    {name: 'card',         title: 'Card',                default: true},
    {name: 'images', title: 'Images'},
    {name: 'pageContent',  title: 'Page Content'},
    {name: 'conversation', title: 'Conversation Engine'},
    {name: 'pageCta',      title: 'Page CTA'},
    {name: 'meta',         title: 'Metadata'},
    {name: 'seo',          title: 'SEO'},
  ],

  fieldsets: [
    {name: 'hero',            title: 'Hero'},
    {name: 'intro',           title: 'Intro'},
    {name: 'clients',         title: 'Clients'},
    {name: 'practiceScopes',  title: 'Practice Scopes'},
  ],

  fields: [

    // ── Card (home pcard + agency practices-card) ──────────────────────

    // CAMBIO (conflicto 4): antes 'title' hacía doble función — nombre corto
    // de la práctica Y encabezado mostrado en la card. Ahora 'title' es solo el
    // titular en voz del comprador que se muestra grande en la card (el H1 de
    // la página de detalle sale de 'heroHeadline', no de acá), y 'practiceName'
    // es el nombre de trabajo corto, mostrado con su propio estilo (bold/label)
    // en la card. Separar los dos evita necesitar texto enriquecido en
    // shortDescription para poder poner en negrita solo el nombre.
    defineField({
      name: 'title',
      title: 'Title (buyer-voice headline)',
      type: 'string',
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'Titular en voz del comprador, mostrado en grande en la card. ej. "You\'ve Outgrown Your Brand"',
    }),

    defineField({
      name: 'practiceName',
      title: 'Practice Name',
      type: 'string',
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'Nombre corto de trabajo de la práctica, mostrado con estilo propio (bold/label) en la card, antes de la Short Description. ej. "Brand Evolution". También es la fuente sugerida para el slug.',
    }),

    // Source 'practiceName' (antes 'title'): la URL no depende del titular en
    // voz del comprador, que puede ser largo y cambiar más seguido.
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'practiceName', maxLength: 96},
      validation: Rule => Rule.required(),
      description: 'ej. "brand-evolution" → /edtech-marketing/practices/brand-evolution',
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'card',
      validation: Rule => Rule.required(),
      description: 'Descripción corta mostrada en el pcard de Home y en el practices-card de Agency, después del Practice Name.',
    }),

    // CAMBIO (conflicto 3): no existía ningún campo para personalizar el texto
    // del link/CTA de cada card. Opcional — si queda vacío, el front cae al
    // texto genérico actual ("Explore the practice").
    defineField({
      name: 'cardCtaLabel',
      title: 'Card CTA Label',
      type: 'string',
      group: 'card',
      description: 'Texto del link de la card, específico al contenido de esta práctica. ej. "Turn community into growth". Si queda vacío, el front usa el texto genérico por default.',
    }),

    defineField({
      name: 'cardImage',
      title: 'Card Image',
      type: 'image',
            group: ['card', 'images'],
      options: {hotspot: true},
      description: 'Imagen de la card de la práctica en el índice de EdTech Marketing. Recomendado: 800×600 px.',
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      group: 'meta',
      initialValue: 10,
      description: 'Posición en la grilla de prácticas (menor = primero).',
    }),

    // ── Hero (página de detalle) ───────────────────────────────────────

    // NOTA: heroHeadline es el H1 real de la página de detalle, y es distinto
    // de 'title' (que es el titular de la card). Acá va el nombre corto de la
    // práctica — mismo valor que 'practiceName' en la mayoría de los casos.
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline (page H1)',
      type: 'string',
      group: 'pageContent',
      fieldset: 'hero',
      description: 'H1 real de la página de detalle. ej. "Brand Evolution" — el nombre corto, no el titular en voz del comprador.',
    }),

    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 3,
      group: 'pageContent',
      fieldset: 'hero',
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
            group: ['pageContent', 'images'],
      fieldset: 'hero',
      options: {hotspot: true},
      // CAMBIO (conflicto 5): faltaba 'alt'. Por convención del proyecto
      // (CLAUDE.md §8.1, ver también aboutHero/aboutProofPoint/bookCard en
      // settings.ts), el front no renderiza ninguna imagen sin alt text,
      // aunque el asset esté cargado — esto es lo que hacía que la imagen
      // "cargara en Sanity pero no se desplegara" en el sitio.
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required()}),
      ],
    }),

    // ── Intro ────────────────────────────────────────────────────────

    defineField({
      name: 'introTitle',
      title: 'Intro Title',
      type: 'string',
      group: 'pageContent',
      fieldset: 'intro',
      description: 'Título de la sección introductoria',
    }),

    defineField({
      name: 'introDescription',
      title: 'Intro Description',
      type: 'text',
      group: 'pageContent',
      fieldset: 'intro',
      description: 'Texto introductorio de la práctica',
    }),

    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      group: 'pageContent',
      fieldset: 'intro',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Listado de capacidades, una por línea.',
    }),

    // ── Servicios relacionados ──────────────────────────────────────────

    // CAMBIO (conflicto 2): antes 'relatedServiceCategory' era un string único
    // (dropdown de una sola categoría), lo que no permitía ni multi-categoría
    // ni curaduría a nivel de servicio individual. Reemplazado por un array de
    // referencias directas a edtechMarketingService: cada práctica elige
    // exactamente qué servicios mostrar, en el orden que quiera, sin importar
    // a qué categoría pertenezcan. Vacío → el front debe renderizar el
    // fallback "For all" (link al índice completo de servicios), igual que
    // ya se ve hoy en Marketing Partner.
    // Vive en 'pageContent' y no en 'meta': decide qué bloque de servicios
    // ("What's on the menu?") se renderiza en la interna.
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      group: 'pageContent',
      of: [defineArrayMember({type: 'reference', to: [{type: 'edtechMarketingService'}]})],
      description: 'Servicios específicos a mostrar en "What\'s on the menu?" de esta página, en el orden elegido. Vacío = renderizar "For all" en vez de una lista curada.',
    }),

    // ── Clientes ────────────────────────────────────────────────────────

    defineField({
      name: 'clientSectionTitle',
      title: 'Section Title',
      type: 'string',
      group: 'card',
      fieldset: 'clients',
      description: 'Título mostrado sobre el listado de clientes',
    }),

    defineField({
      name: 'clientNames',
      title: 'Featured Clients',
      type: 'array',
      group: 'card',
      fieldset: 'clients',
      of: [defineArrayMember({type: 'string'})],
      description: 'Nombres de clientes mostrados en el pcard de Home. ej. ["Busuu", "D2L", "Anthology", "Instructure"]',
    }),

    // ── Alcances de la práctica ──────────────────────────────────────────

    defineField({
      name: 'practiceScopesTitle',
      title: 'Section Title',
      type: 'string',
      group: 'conversation',
      fieldset: 'practiceScopes',
      description: 'Título mostrado sobre los alcances de la práctica',
    }),

    defineField({
      name: 'practiceScopes',
      title: 'Scopes',
      type: 'array',
      group: 'conversation',
      fieldset: 'practiceScopes',
      description: 'Listado de alcances de la práctica, cada uno con su propio CTA.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'practiceScope',
          fields: [
            defineField({name: 'title',      title: 'Title',        type: 'string'}),
            defineField({name: 'description', title: 'Description',  type: 'text', rows: 3}),
            defineField({name: 'ctaLabel',   title: 'CTA Label', type: 'string'}),
            defineField({name: 'ctaHref',    title: 'CTA URL',   type: 'string'}),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
    }),

    // ── CTA de página ──────────────────────────────────────────────────

    defineField({
      name: 'ctaTitle',
      title: 'CTA Title',
      type: 'string',
      group: 'pageCta',
    }),

    defineField({
      name: 'ctaLabel',
      title: 'Button Text',
      type: 'string',
      group: 'pageCta',
    }),

    defineField({
      name: 'ctaHref',
      title: 'CTA Link',
      type: 'url',
      group: 'pageCta',
      validation: Rule => Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
      description: 'Puede ser ruta interna (ej. "/contact") o URL externa.',
    }),

    // ── SEO ─────────────────────────────────────────────────────────────

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
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
      title:    'practiceName',
      subtitle: 'shortDescription',
      media:    'heroImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title:    title ?? 'Unnamed practice',
        subtitle: subtitle ? subtitle.slice(0, 60) + '…' : '',
        media,
      }
    },
  },
})
