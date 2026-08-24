import {defineType, defineField, defineArrayMember} from 'sanity'

const INTERVIEW_CATEGORY_OPTIONS = [
  {title: 'Essential Series', value: 'essential'},
  {title: 'Investor Series', value: 'investor'},
  {title: 'Founders Series', value: 'founders'},
]

export default defineType({
  name: 'edtechMentor',
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

  fieldsets: [
    {
      name: 'interviewIntro',
      title: 'Interview Intro',
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

    defineField({
      name: 'guestPhoto',
      title: 'Guest Photo',
      type: 'image',
      group: 'guest',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ─────────────────────────────────────────────────────────────
    // CONTENT
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
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
      name: 'highlightTitle',
      title: 'Highlight Title',
      type: 'string',
      group: 'content',
      description: 'Titular corto mostrado en la sección destacada de la entrevista',
    }),

    defineField({
      name: 'introText',
      title: 'Intro Paragraph',
      type: 'text',
      group: 'content',
      fieldset: 'interviewIntro',
      description: 'Texto introductorio que acompaña la imagen principal de la entrevista',
    }),

    defineField({
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      group: 'content',
      fieldset: 'interviewIntro',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Alt text', type: 'string'}),
        defineField({name: 'caption', title: 'Caption', type: 'string'}),
      ],
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
      description: "Contenido de la entrevista; insertar bloques de 'Pearl of Wisdom' donde corresponda en el flujo del texto",
      of: [
        {type: 'block'},
        defineArrayMember({
          type: 'object',
          name: 'pearlOfWisdom',
          title: 'Pearl of Wisdom',
          fields: [
            defineField({name: 'quote', title: 'Quote', type: 'text'}),
          ],
          preview: {select: {title: 'quote'}},
        }),
      ],
    }),

    defineField({
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      group: 'content',
      description: 'Titular mostrado en cards y en la cabecera de la página de detalle.',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Resumen breve mostrado en cards y listados',
      validation: (Rule) => Rule.max(280),
    }),

    defineField({
      name: 'rapidFire',
      title: 'Rapid Fire',
      type: 'object',
      group: 'content',
      description: 'Sección de preguntas rápidas de la entrevista',
      fields: [
        defineField({
          name: 'description',
          title: 'Description',
          type: 'string',
          description: 'Texto introductorio de la sección Rapid Fire',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          description: 'Imagen de la sección Rapid Fire',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}),
          ],
        }),
        defineField({
          name: 'questions',
          title: 'Questions',
          type: 'array',
          description: 'Preguntas y respuestas de la sección Rapid Fire',
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
      ],
    }),

    // ─────────────────────────────────────────────────────────────
    // METADATA
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'interviewCategory',
      title: 'Interview Category',
      type: 'string',
      group: 'meta',
      options: {
        list: INTERVIEW_CATEGORY_OPTIONS,
        layout: 'radio',
      },
      description: 'Determina en qué slider aparece esta entrevista en la página de índice.',
    }),

    defineField({
<<<<<<< HEAD:schemaTypes/interview.ts
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
=======
      name: 'isFeatured',
>>>>>>> 612215b4a6347ad658886c5b8b04c714e83afbc6:schemaTypes/edtechMentor.ts
      title: 'Featured',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Marcar como destacado para mostrar en la card destacada de la página de índice.',
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
      description: 'URL del post de LinkedIn para este episodio.',
    }),

    defineField({
      name: 'mediumUrl',
      title: 'Medium Article URL',
      type: 'url',
      group: 'meta',
      description: 'URL del artículo de Medium para este episodio.',
    }),

    // ─────────────────────────────────────────────────────────────
    // SEO
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      description: 'Si se deja vacío, usa la foto del invitado / título del episodio como resguardo.',
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
          field: 'isFeatured',
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
      interviewCategory: 'interviewCategory',
      isFeatured: 'isFeatured',
      media: 'guestPhoto',
    },

    prepare({title, subtitle, interviewCategory, isFeatured, media}) {
      const interviewCategoryLabel =
        INTERVIEW_CATEGORY_OPTIONS.find((item) => item.value === interviewCategory)?.title ??
        interviewCategory ??
        ''

      const star = isFeatured ? '⭐ ' : ''

      return {
        title: `${star}${title ?? 'Unnamed guest'}`,
        subtitle: [subtitle, interviewCategoryLabel].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
