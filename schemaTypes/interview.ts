import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'interview',
  title: 'EdTech Mentor Interviews',
  type: 'document',
  fields: [
    defineField({
      name: 'guestName',
      title: 'Guest Name',
      type: 'string',
    }),

    defineField({
      name: 'guestCompany',
      title: 'Company',
      type: 'string',
    }),

    defineField({
      name: 'guestRole',
      title: 'Role',
      type: 'string',
    }),

    defineField({
      name: 'guestPhoto',
      title: 'Photo',
      type: 'image',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'guestName',
      },
    }),

    defineField({
      name: 'body',
      title: 'Interview',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})
