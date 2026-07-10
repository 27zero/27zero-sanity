/**
 * blockContent.ts — Rich text field definition.
 *
 * Used by the `post` document's `body` field.
 * Supports headings H1–H4, paragraphs, blockquote, ordered and
 * bullet lists, links, strong, emphasis, underline, code,
 * and inline images.
 */

import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal',     value: 'normal'},
        {title: 'H1',         value: 'h1'},
        {title: 'H2',         value: 'h2'},
        {title: 'H3',         value: 'h3'},
        {title: 'H4',         value: 'h4'},
        {title: 'Quote',      value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet',  value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong',        value: 'strong'},
          {title: 'Emphasis',      value: 'em'},
          {title: 'Underline',     value: 'underline'},
          {title: 'Strike',        value: 'strike-through'},
          {title: 'Inline Code',   value: 'code'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: Rule =>
                  Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: {hotspot: true},
      fields: [
        {name: 'alt',     title: 'Alt text', type: 'string'},
        {name: 'caption', title: 'Caption',  type: 'string'},
      ],
    }),
  ],
})
