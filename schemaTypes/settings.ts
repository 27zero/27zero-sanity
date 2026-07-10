/**
 * settings.ts — Global site settings singleton.
 *
 * One document of this type exists in the dataset.
 * Referenced by helpers/sanity.py → get_settings().
 *
 * To make this a singleton in the Sanity Studio, add a custom structure
 * builder to sanity.config.ts (not done here to keep the config minimal).
 */

import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',

  groups: [
    {name: 'identity',  title: 'Identity',  default: true},
    {name: 'seo',       title: 'SEO'},
    {name: 'social',    title: 'Social'},
    {name: 'analytics', title: 'Analytics'},
    {name: 'contact',   title: 'Contact'},
  ],

  fields: [
    defineField({name: 'siteTitle',       title: 'Site Title',       type: 'string', group: 'identity'}),
    defineField({name: 'siteDescription', title: 'Site Description', type: 'text',   group: 'identity', rows: 2}),
    defineField({name: 'siteUrl',         title: 'Site URL',         type: 'url',    group: 'identity',
      description: 'Production URL, e.g. https://www.27zero.agency'}),
    defineField({name: 'logo',            title: 'Logo',             type: 'image',  group: 'identity', options: {hotspot: true}}),

    defineField({name: 'defaultSeoTitle',       title: 'Default SEO Title',       type: 'string', group: 'seo', validation: Rule => Rule.max(70)}),
    defineField({name: 'defaultSeoDescription', title: 'Default SEO Description', type: 'text',   group: 'seo', rows: 2, validation: Rule => Rule.max(160)}),
    defineField({name: 'defaultOgImage',        title: 'Default OG Image',        type: 'image',  group: 'seo', options: {hotspot: true}}),

    defineField({name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url', group: 'social'}),
    defineField({name: 'twitterUrl',  title: 'Twitter / X URL', type: 'url', group: 'social'}),

    defineField({name: 'gaId',       title: 'Google Analytics 4 ID',   type: 'string', group: 'analytics', description: 'e.g. G-XXXXXXXXXX'}),
    defineField({name: 'hubspotId',  title: 'HubSpot Portal ID',        type: 'string', group: 'analytics'}),

    defineField({name: 'contactEmail', title: 'Contact Email', type: 'string', group: 'contact'}),
    defineField({name: 'officeUS',     title: 'US Office Address',     type: 'text',   group: 'contact', rows: 3}),
    defineField({name: 'officeCO',     title: 'Colombia Office Address', type: 'text', group: 'contact', rows: 3}),
  ],

  preview: {
    select: {title: 'siteTitle'},
    prepare: ({title}) => ({title: title ?? 'Site Settings'}),
  },
})
