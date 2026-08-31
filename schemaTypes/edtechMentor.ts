import {defineType, defineField, defineArrayMember} from 'sanity'

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
            defineField({
              name: 'title',
              title: 'Pearl Title',
              type: 'string',
              description:
                'Titular propio de la perla. Opcional: las entrevistas migradas de Webflow que nunca lo personalizaron quedan sin él.',
            }),
            defineField({name: 'quote', title: 'Quote', type: 'text'}),
          ],
          // `title` es opcional, así que la perla cae de vuelta a la cita para no
          // quedar sin encabezado en la lista del Studio.
          preview: {
            select: {title: 'title', quote: 'quote'},
            prepare: ({title, quote}) => ({
              title: title || quote,
              subtitle: title ? quote : undefined,
            }),
          },
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'meta',
      to: [{type: 'mentorCategory'}],
      validation: (Rule) => Rule.required(),
      description:
        'Categoría única de la entrevista — determina en qué sección aparece en la página de índice. Ej. Essential, Investor, Founders, CEOs. Para crear, editar o eliminar categorías, usa la opción "Create new" al elegir una aquí, o entra a "Mentor Categories" en el menú lateral del Studio.',
    }),

    defineField({
      name: 'isFeatured',
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
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'meta',
      validation: (Rule) => Rule.required(),
      description:
        'Requerido para el structured data (JSON-LD) de Google. En las entrevistas el author es 27zero (quien produce la entrevista) — la persona entrevistada va en Guest Name, no acá.',
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
      category: 'category.title',
      isFeatured: 'isFeatured',
      media: 'guestPhoto',
    },

    prepare({title, subtitle, category, isFeatured, media}) {
      const star = isFeatured ? '⭐ ' : ''

      return {
        title: `${star}${title ?? 'Unnamed guest'}`,
        subtitle: [subtitle, category].filter(Boolean).join(' · '),
        media,
      }
    },
  },
})
