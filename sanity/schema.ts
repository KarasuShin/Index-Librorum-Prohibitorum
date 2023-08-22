import { type SchemaTypeDefinition } from 'sanity'
import { bookmarkType } from './schemas/bookmark'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    bookmarkType,
  ],
}
