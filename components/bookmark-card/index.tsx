import type { Bookmark } from '~/schemas/bookmark'
import { EditIcon } from '../icon/EditIcon'
import { cn } from '~/lib/utils'
import * as styles from './styles.css'
import type { MouseEventHandler } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu'
import { setEditBookmark, setEditBookmarkSheetOpen } from '~/state/bookmark.state'
import { http } from '~/lib/http'
import { useToast } from '../ui/use-toast'
import { useTranslations } from 'next-intl'
import useSWRMutation from 'swr/mutation'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export const BookmarkCard = ({
  bookmark,
}: BookmarkCardProps) => {
  const { toast } = useToast()
  const t = useTranslations()
  const delBookmark = useSWRMutation('/bookmark', (url: string) => http.delete(`${url}?id=${bookmark.id}`), {
    populateCache: (_, data: Bookmark[]) => data.filter(item => item.id !== bookmark.id),
    revalidate: false,
  })

  const onClickCard = () => {
    window.open(bookmark.url, '_blank')
  }

  const onClickEdit: MouseEventHandler = e => {
    e.stopPropagation()
    setEditBookmark(bookmark)
    setEditBookmarkSheetOpen(true)
  }

  const onClickDel: MouseEventHandler = async e => {
    e.stopPropagation()
    delBookmark.trigger()
    toast({
      title: t('bookmarkForm.delete.success'),
    })
  }

  return <ContextMenu>
    <ContextMenuTrigger
      onClick={onClickCard}
      key={bookmark.id}
      className={cn('relative bg-white dark:bg-slate-700 rounded-md p-2 shadow hover:shadow-md cursor-pointer transition ease-in h-32 flex', styles.container)}>
      <div className="flex-1">
        <div className="line-clamp-1 font-bold mb-2" title={bookmark.title}>{bookmark.title}</div>
        <div className="line-clamp-3 text-xs mb-2 text-slate-600 dark:text-slate-300" title={bookmark.description}>{bookmark.description}</div>
      </div>
      {bookmark.cover && <div className="w-20 h-20 p-1">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${bookmark.cover})`,
          }} />
      </div>}
      <div className={cn('absolute bottom-2 opacity-0 transition-opacity', styles.actionBar)}>
        <EditIcon
          onClick={onClickEdit}
          className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors" />
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-32">
      <ContextMenuItem onClick={onClickEdit}>
        {t('bookmarkContextMenu.edit')}
      </ContextMenuItem>
      <ContextMenuItem onClick={onClickDel}>
        {t('bookmarkContextMenu.del')}
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
}
