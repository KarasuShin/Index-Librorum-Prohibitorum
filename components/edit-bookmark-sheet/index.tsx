'use client'

import { useSnapshot } from 'valtio'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { bookmarkState, setEditBookmarkSheetOpen } from '~/state/bookmark.state'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { UpdateIcon } from '../icon/UpdateIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import useSWRMutation from 'swr/mutation'
import { http } from '~/lib/http'
import type { SiteInfo } from '~/types'
import { cn } from '~/lib/utils'
import { ScrollArea } from '../ui/scroll-area'
import type { Bookmark } from '~/schemas/bookmark'
import { type UpdateBookmarkDto, updateBookSchema } from '~/schemas/bookmark'
import { useToast } from '../ui/use-toast'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const EditBookmarkSheet = () => {
  const { editBookmarkOpen, editBookmark } = useSnapshot(bookmarkState)
  const { toast } = useToast()
  const t = useTranslations()

  const form = useForm<UpdateBookmarkDto>({
    resolver: zodResolver(updateBookSchema),
  })

  const updateSite = useSWRMutation('/siteinfo', (url: string) => http.get<SiteInfo>(url, {
    url: form.getValues('url'),
  }), {
    onSuccess: siteInfo => {
      form.setValue('title', siteInfo.title ?? '')
    },
  })

  const updateBookmark = useSWRMutation('/bookmark', (url, { arg }: { arg: UpdateBookmarkDto }) => http.put<Bookmark>(url, arg), {
    populateCache: (newData, data: Bookmark[]) => data.map(bookmark => {
      if (bookmark.id === newData.id) {
        return newData
      }
      return bookmark
    }),
    revalidate: false,
  })

  const onSubmit = async (data: UpdateBookmarkDto) => {
    await updateBookmark.trigger(data)
    setEditBookmarkSheetOpen(false)
    toast({
      title: t('bookmarkForm.update.success'),
    })
  }

  useEffect(() => {
    if (editBookmark) {
      form.reset(editBookmark)
    }
  }, [editBookmark])

  useEffect(() => {
    if (!editBookmarkOpen) {
      form.reset({
        url: '',
        title: '',
      })
    }
  }, [editBookmarkOpen])

  return <Sheet open={editBookmarkOpen} onOpenChange={setEditBookmarkSheetOpen}>
    <SheetContent className="p-0">
      <SheetHeader className="px-6 pt-3">
        <SheetTitle>{t('bookmarkForm.update.title')}</SheetTitle>
      </SheetHeader>
      <ScrollArea className="h-[calc(100%-theme(space.10))] px-6 py-3" scrollHideDelay={50}>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-600 pr-1">*</span>
                    {t('bookmarkForm.label.url')}
                  </FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                    <div className="pl-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <UpdateIcon className={cn('cursor-pointer', {
                            'animate-spin': updateSite.isMutating,
                          })} onClick={e => {
                            e.preventDefault()
                            updateSite.trigger()
                          }} />
                        </TooltipTrigger>
                        <TooltipContent>
                          {t('bookmarkForm.update.syncSite')}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bookmarkForm.label.title')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bookmarkForm.label.desc')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('bookmarkForm.label.cover')}</FormLabel>
                  <FormControl>
                    <div className="relative pb-[50%]">
                      <div className="absolute h-full w-full bg-cover" style={{
                        backgroundImage: `url(${field.value})`,
                      }} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" disabled={updateBookmark.isMutating}>
                {updateBookmark.isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('bookmarkForm.update.submit')}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </ScrollArea>

    </SheetContent>
  </Sheet>
}
