'use client'
import useSWR from 'swr'
import { BookmarkCard } from '~/components/bookmark-card'
import { EditBookmarkSheet } from '~/components/edit-bookmark-sheet'
import { http } from '~/lib/http'
import type { Bookmark } from '~/schemas/bookmark'
import { bookmarkState } from '~/state/bookmark.state'

export default function Home() {
  const { data } = bookmarkState.query = useSWR('/bookmark', (url: string) => http.get<Bookmark[]>(url))

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {data?.map(bookmark => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
      <EditBookmarkSheet />
    </div>
  )
}
