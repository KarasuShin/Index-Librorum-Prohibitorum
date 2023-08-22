import type { SWRResponse } from 'swr'
import { proxy } from 'valtio'
import type { Bookmark } from '~/schemas/bookmark'

export const bookmarkState = proxy<{
  createBookmarkOpen: boolean
  editBookmarkOpen: boolean
  editBookmark: Bookmark | null
  query: SWRResponse<Bookmark[], unknown> | null
}>({
  createBookmarkOpen: false,
  editBookmarkOpen: false,
  editBookmark: null,
  query: null,
})

export const setCreateBookmarkOpen = (open: boolean) => {
  bookmarkState.createBookmarkOpen = open
}

export const setEditBookmarkSheetOpen = (open: boolean) => {
  bookmarkState.editBookmarkOpen = open
}

export const setEditBookmark = (bookmark: Bookmark) => {
  bookmarkState.editBookmark = bookmark
}

export const removeEditBookmark = () => {
  bookmarkState.editBookmark = null
}
