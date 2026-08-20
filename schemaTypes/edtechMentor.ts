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
      title: 'Invitado',
      default: true,
    },
    {
      name: 'content',
      title: 'Contenido',
    },
    {
      name: 'meta',
      title: 'Metadatos',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],

  fieldsets: [
    {
      name: 'interviewIntro',
      title: 'Intro de la entrevista',
    },
  ],

  fields: [
    // ─────────────────────────────────────────────────────────────
    // INVITADO
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'guestName',
      title: 'Nombre del invitado',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestCompany',
      title: 'Empresa',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestRole',
      title: 'Rol',
      type: 'string',
      group: 'guest',
    }),

    defineField({
      name: 'guestPhoto',
      title: 'Foto del invitado',
      type: 'image',
      group: 'guest',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    // ─────────────────────────────────────────────────────────────
    // CONTENIDO
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
          title: 'Texto alternativo',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'highlightTitle',
      title: 'Título destacado',
      type: 'string',
      group: 'content',
      description: 'Titular corto mostrado en la sección destacada de la entrevista',
    }),

    defineField({
      name: 'introText',
      title: 'Párrafo introductorio',
      type: 'text',
      group: 'content',
      fieldset: 'interviewIntro',
      description: 'Texto introductorio que acompaña la imagen principal de la entrevista',
    }),

    defineField({
      name: 'mainImage',
      title: 'Imagen destacada',
      type: 'image',
      group: 'content',
      fieldset: 'interviewIntro',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Texto alternativo', type: 'string'}),
        defineField({name: 'caption', title: 'Leyenda', type: 'string'}),
      ],
    }),

    defineField({
      name: 'bannerPost',
      title: 'Banner del post',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      description: 'Banner del post para uso en cabeceras y destacados.',
      fields: [defineField({name: 'alt', title: 'Texto alternativo', type: 'string'})],
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
      title: 'Cuerpo de la entrevista',
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
            defineField({name: 'quote', title: 'Cita', type: 'text'}),
          ],
          preview: {select: {title: 'quote'}},
        }),
      ],
    }),

    defineField({
      name: 'title',
      title: 'Título del episodio',
      type: 'string',
      group: 'content',
      description: 'Titular mostrado en cards y en la cabecera de la página de detalle.',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Descripción corta',
      type: 'text',
      group: 'content',
      rows: 2,
      description: 'Resumen breve mostrado en cards y listados',
      validation: (Rule) => Rule.max(280),
    }),

    defineField({
      name: 'pearlOfWisdom',
      title: 'Pearl of Wisdom',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Frase destacada del invitado, resaltada en el layout del artículo.',
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
          title: 'Descripción',
          type: 'string',
          description: 'Texto introductorio de la sección Rapid Fire',
        }),
        defineField({
          name: 'image',
          title: 'Imagen',
          type: 'image',
          description: 'Imagen de la sección Rapid Fire',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Texto alternativo', type: 'string', validation: (Rule) => Rule.required()}),
          ],
        }),
        defineField({
          name: 'questions',
          title: 'Preguntas',
          type: 'array',
          description: 'Preguntas y respuestas de la sección Rapid Fire',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'rapidFireItem',
              title: 'Par pregunta y respuesta',

              fields: [
                defineField({
                  name: 'question',
                  title: 'Pregunta',
                  type: 'string',
                }),

                defineField({
                  name: 'answer',
                  title: 'Respuesta',
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
    // METADATOS
    // ─────────────────────────────────────────────────────────────

    defineField({
      name: 'interviewCategory',
      title: 'Categoría de la entrevista',
      type: 'string',
      group: 'meta',
      options: {
        list: INTERVIEW_CATEGORY_OPTIONS,
        layout: 'radio',
      },
      description: 'Determina en qué slider aparece esta entrevista en la página de índice.',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Destacado',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Marcar como destacado para mostrar en la card destacada de la página de índice.',
    }),

    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      group: 'meta',
    }),

    defineField({
      name: 'linkedinUrl',
      title: 'URL del post de LinkedIn',
      type: 'url',
      group: 'meta',
      description: 'URL del post de LinkedIn para este episodio.',
    }),

    defineField({
      name: 'mediumUrl',
      title: 'URL del artículo de Medium',
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
  // ORDEN
  // ─────────────────────────────────────────────────────────────

  orderings: [
    {
      title: 'Publicación (más reciente primero)',
      name: 'publishedAtDesc',
      by: [
        {
          field: 'publishedAt',
          direction: 'desc',
        },
      ],
    },

    {
      title: 'Destacados primero',
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
