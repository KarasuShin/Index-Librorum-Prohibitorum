import { defineField, defineType } from 'sanity'

export const bookmarkType = defineType({
  name: 'bookmark',
  title: 'Bookmark',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: Rule => Rule.required().regex(/https?:\/\/.+/),
    }),
    defineField({
      name: 'cover',
      title: 'Cover',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
  ],
})
