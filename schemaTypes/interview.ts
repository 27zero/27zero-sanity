import {defineType, defineField, defineArrayMember} from 'sanity'

const SERIES_OPTIONS = [
  {title: 'Essential Series', value: 'essencial'},
  {title: 'Investor Series', value: 'investor'},
  {title: 'Founders Series', value: 'founders'},
]

export default defineType({
  name: 'interview',
  title: 'EdTech Mentor Interviews',
  type: 'document',

  groups: [
    {
      name: 'guest',
      title: 'Guest',
      default: true,
    },
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'meta',
      title: 'Metadata',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],

  fields: [
    // ─────────────────────────────────────────────────────────────
    // GUEST
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestCompany',
      title: 'Company',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestRole',
      title: 'Role',
      type: 'string',
      group: 'guest',
    }),

    // ─────────────────────────────────────────────────────────────
    // CONTENT
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'thumbnail',
      title: 'Miniatura',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      description: 'Imagen miniatura de la card del mentor. Recomendado: 800 × 600 px.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
    }),

    defineField({
      name: 'imageHighlight',
      title: 'Image Highlight 1920x1080',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Imagen horizontal destacada. Proporción recomendada: 1920 × 1080 px.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),

    defineField({
      name: 'imageSquare',
      title: 'Image Square 1080x1080',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Imagen cuadrada. Proporción recomendada: 1080 × 1080 px.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),

    defineField({
      name: 'bannerPost',
      title: 'Banner Post',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Banner del post para uso en cabeceras y destacados.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {
        source: 'guestName',
      },
    }),

    defineField({
      name: 'body',
      title: 'Interview Body',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),

    defineField({
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      group: 'content',
      description: 'Headline shown on cards and the detail page header.',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Short description shown on index cards (1–2 sentences).',
      validation: (Rule) => Rule.max(280),
    }),

    defineField({
      name: 'pearlOfWisdom',
      title: 'Pearl of Wisdom',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Key pull-quote highlighted in the article layout.',
    }),

    defineField({
      name: 'rapidFire',
      title: 'Rapid Fire Questions',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'rapidFireItem',
          title: 'Q&A Pair',

          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
            }),

            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 2,
            }),
          ],

          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        }),
      ],
    }),

    // ─────────────────────────────────────────────────────────────
    // METADATA
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      group: 'meta',
      options: {
        list: SERIES_OPTIONS,
        layout: 'radio',
      },
      description: 'Determines which slider this interview appears in on the index page.',
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
      description:
        'Ej. CEOs, Founders, Investors. Para crear, editar o eliminar categorías, usa la opción "Create new" al elegir una aquí, o entra a "Categories" en el menú lateral del Studio.',
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Mark as featured to show in the prominent featured card on the index page.',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
    }),

    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn Post URL',
      type: 'url',
      group: 'meta',
      description: 'URL of the LinkedIn post for this episode.',
    }),

    defineField({
      name: 'mediumUrl',
      title: 'Medium Article URL',
      type: 'url',
      group: 'meta',
      description: 'URL of the Medium article for this episode.',
    }),

    // ─────────────────────────────────────────────────────────────
    // SEO
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides the page <title>. Leave blank to use the episode title.',
      validation: (Rule) => Rule.max(70),
    }),

    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      rows: 2,
      description: '120–160 characters recommended.',
      validation: (Rule) => Rule.max(160),
    }),

    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      options: {
        hotspot: true,
      },
      description: '1200×630 px recommended. Falls back to guest photo if empty.',
    }),
  ],

  // ─────────────────────────────────────────────────────────────
  // ORDERING
  // ─────────────────────────────────────────────────────────────

  orderings: [
    {
      title: 'Published (newest first)',
      name: 'publishedAtDesc',
      by: [
        {
          field: 'publishedAt',
          direction: 'desc',
        },
      ],
    },

    {
      title: 'Featured first',
      name: 'featuredFirst',
      by: [
        {
          field: 'featured',
          direction: 'desc',
        },
        {
          field: 'publishedAt',
          direction: 'desc',
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────
  // PREVIEW
  // ─────────────────────────────────────────────────────────────

  preview: {
    select: {
      title: 'guestName',
      subtitle: 'title',
      series: 'series',
      featured: 'featured',
      media: 'guestPhoto',
    },

    prepare({title, subtitle, series, featured, media}) {
      const seriesLabel =
        SERIES_OPTIONS.find((item) => item.value === series)?.title ?? series ?? ''

      const star = featured ? '⭐ ' : ''

      return {
        title: `${star}${title ?? 'Unnamed guest'}`,
        subtitle: [subtitle, seriesLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
