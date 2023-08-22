import { z } from 'zod'

const basicSchema = z.object({
  title: z.string(),
  url: z.string().url({
    message: 'bookmarkForm.validate.url',
  }),
  cover: z.string(),
  description: z.string(),
})

export const bookmarkSchema = z.object({
  ...basicSchema.shape,
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createBookSchema = z.object(basicSchema.shape)

export const updateBookSchema = z.object({
  ...basicSchema.shape,
  id: z.string(),
})

export type Bookmark = z.infer<typeof bookmarkSchema>

export type CreateBookmarkDto = z.infer<typeof createBookSchema>

export type UpdateBookmarkDto = z.infer<typeof updateBookSchema>
