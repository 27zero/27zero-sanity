/**
 * settings.ts — Global site settings singleton.
 *
 * One document of this type exists in the dataset.
 * Organised by editorial sections so content editors find their
 * destination immediately without navigating a flat field list.
 *
 * Tabs (groups):
 *   Identity · SEO · Analytics · Social
 *   Navbar · Footer
 *   Home · About · Work · Mentor · Resources · Contact
 *
 * Backwards compatibility
 * -----------------------
 * Fields that existed in the previous schema are preserved exactly:
 *   siteTitle, siteDescription, siteUrl, logo (Identity)
 *   defaultSeoTitle, defaultSeoDescription, defaultOgImage (SEO)
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

  groups: [
    // ── Technical / global ──────────────────────────────────────────
    {name: 'identity',  title: 'Identity',  default: true},
    {name: 'seo',       title: 'SEO'},
    {name: 'analytics', title: 'Analytics'},
    {name: 'social',    title: 'Social'},
    // ── UI chrome ───────────────────────────────────────────────────
    {name: 'navbar',    title: 'Navbar'},
    {name: 'footer',    title: 'Footer'},
    // ── Page sections ───────────────────────────────────────────────
    {name: 'home',      title: 'Home'},
    {name: 'about',     title: 'About'},
    {name: 'work',      title: 'Work'},
    {name: 'mentor',    title: 'Mentor'},
    {name: 'resources', title: 'Resources'},
    {name: 'contact',   title: 'Contact'},
  ],

  fields: [

    // ════════════════════════════════════════════════════════════════
    // IDENTITY — existing, unchanged
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
      description: 'Production URL, e.g. https://www.27zero.agency',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'identity',
      options: {hotspot: true},
    }),

    // ════════════════════════════════════════════════════════════════
    // SEO — existing, unchanged
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.max(70),
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      group: 'seo',
      options: {hotspot: true},
    }),

    // ════════════════════════════════════════════════════════════════
    // ANALYTICS — existing, unchanged
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'gaId',
      title: 'Google Analytics 4 ID',
      type: 'string',
      group: 'analytics',
      description: 'e.g. G-XXXXXXXXXX',
    }),
    defineField({
      name: 'hubspotId',
      title: 'HubSpot Portal ID',
      type: 'string',
      group: 'analytics',
    }),

    // ════════════════════════════════════════════════════════════════
    // SOCIAL — existing, unchanged
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
    // NAVBAR — new
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'navbarCta',
      title: 'CTA Button',
      type: 'object',
      group: 'navbar',
      description: 'The primary call-to-action button that appears in the top-right of the navbar.',
      fields: [
        defineField({name: 'text',  title: 'Button Text', type: 'string',
          description: 'e.g. "Let\'s Talk!"'}),
        defineField({name: 'url',   title: 'Button URL',  type: 'string',
          description: 'e.g. "/lets-talk"'}),
        defineField({name: 'micro', title: 'Micro Copy',  type: 'string',
          description: 'Small text shown below the CTA in hero sections. e.g. "Free. 30 min. No sales pitch."'}),
      ],
    }),

    defineField({
      name: 'navbarWorkDropdown',
      title: 'Work Dropdown',
      type: 'object',
      group: 'navbar',
      description: 'Links shown in the "Work" dropdown menu.',
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
    // FOOTER — new
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'footerCta',
      title: 'CTA Section',
      type: 'object',
      group: 'footer',
      description: 'The call-to-action section at the bottom of every page.',
      fields: [
        defineField({name: 'eyebrow',    title: 'Eyebrow',      type: 'string',
          description: 'e.g. "Begin your journey to growth"'}),
        defineField({name: 'headline',   title: 'Headline',     type: 'string',
          description: 'Main heading of the CTA block.'}),
        defineField({name: 'text',       title: 'Body Text',    type: 'text', rows: 2,
          description: 'Optional supporting text below the headline.'}),
        defineField({name: 'buttonText', title: 'Button Text',  type: 'string',
          description: 'e.g. "Book a strategy session"'}),
      ],
    }),

    defineField({
      name: 'footerNavigation',
      title: 'Navigation',
      type: 'object',
      group: 'footer',
      description: 'Links shown in the footer columns.',
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
          description: 'e.g. "2026"'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // HOME — new
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'homeHero',
      title: 'Hero',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string',
          description: 'e.g. "Turn EdTech purpose into brand power."'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
        defineField({name: 'video',    title: 'Background Video URL', type: 'url',
          description: 'Direct URL to the .mp4 file (served from assets/).'}),
        defineField({name: 'poster',   title: 'Video Poster Image', type: 'image',
          options: {hotspot: true},
          description: 'Shown while the video loads.'}),
      ],
    }),

    defineField({
      name: 'homeWork',
      title: 'Work Section',
      type: 'object',
      group: 'home',
      fields: [
        defineField({name: 'headline',    title: 'Headline',     type: 'string'}),
        defineField({name: 'showreelUrl', title: 'Showreel URL', type: 'url',
          description: 'YouTube or Vimeo URL for the showreel button.'}),
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
          description: 'e.g. "you@institution.edu"'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // ABOUT — new
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
      description: '"Creativity is our DNA" section.',
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

    // ════════════════════════════════════════════════════════════════
    // WORK — new
    // ════════════════════════════════════════════════════════════════

    defineField({
      name: 'workHero',
      title: 'Hero',
      type: 'object',
      group: 'work',
      fields: [
        defineField({name: 'eyebrow',  title: 'Eyebrow',  type: 'string',
          description: 'e.g. "Work: Behind the fastest-growing EdTech brands"'}),
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'subtitle', title: 'Subtitle', type: 'string'}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // MENTOR — new
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
      description: 'The "Begin your journey" CTA at the bottom of the Mentor index page.',
      fields: [
        defineField({name: 'headline', title: 'Headline', type: 'string'}),
        defineField({name: 'text',     title: 'Text',     type: 'text', rows: 2}),
      ],
    }),

    // ════════════════════════════════════════════════════════════════
    // RESOURCES — new
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
    // CONTACT — existing fields preserved + new objects added
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

    // Existing field — preserved
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),

    // New structured object (alongside legacy text field)
    defineField({
      name: 'officeUSNew',
      title: 'Office US',
      type: 'object',
      group: 'contact',
      description: 'Replaces the legacy "US Office Address" text field once content is migrated.',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
        defineField({name: 'phone',   title: 'Phone',   type: 'string'}),
        defineField({name: 'email',   title: 'Email',   type: 'string'}),
      ],
    }),

    // Existing field — preserved during migration
    defineField({
      name: 'officeUS',
      title: 'US Office Address (legacy — migrate to Office US above)',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),

    // New structured object (alongside legacy text field)
    defineField({
      name: 'officeCONew',
      title: 'Office CO',
      type: 'object',
      group: 'contact',
      description: 'Replaces the legacy "Colombia Office Address" text field once content is migrated.',
      fields: [
        defineField({name: 'address', title: 'Address', type: 'text', rows: 2}),
        defineField({name: 'phone',   title: 'Phone',   type: 'string'}),
        defineField({name: 'email',   title: 'Email',   type: 'string'}),
      ],
    }),

    // Existing field — preserved during migration
    defineField({
      name: 'officeCO',
      title: 'Colombia Office Address (legacy — migrate to Office CO above)',
      type: 'text',
      rows: 3,
      group: 'contact',
    }),

  ],

  preview: {
    select: {title: 'siteTitle'},
    prepare: ({title}) => ({title: title ?? 'Site Settings'}),
  },
})
