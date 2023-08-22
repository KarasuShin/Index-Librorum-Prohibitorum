import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { PlusIcon } from '~/components/icon/PlusIcon'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { bookmarkState, setCreateBookmarkOpen } from '~/state/bookmark.state'
import { useSnapshot } from 'valtio'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { http } from '~/lib/http'
import { useToast } from '../ui/use-toast'
import useSWRMutation from 'swr/mutation'
import { Loader2 } from 'lucide-react'
import type { Bookmark } from '~/schemas/bookmark'
import { createBookSchema } from '~/schemas/bookmark'
import { useTranslations } from 'next-intl'

const formSchema = z.object({
  url: createBookSchema.shape.url,
  title: createBookSchema.shape.title.optional(),
})

type FormData = z.infer<typeof formSchema>

export const AddBookmarkDialog = () => {
  const { createBookmarkOpen } = useSnapshot(bookmarkState)
  const createBookmark = useSWRMutation('/bookmark', (url: string, { arg }: {
    arg: FormData
  }) => http.post(url, arg), {
    populateCache: (newData, data: Bookmark[]) => [newData, ...data],
    revalidate: false,
  })
  const { toast } = useToast()
  const t = useTranslations()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    await createBookmark.trigger(data)
    setCreateBookmarkOpen(false)
    toast({
      title: t('bookmarkForm.create.success'),
    })
  }

  const onOpenChange = (open: boolean) => {
    setCreateBookmarkOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return <Dialog open={createBookmarkOpen} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <button type="button" className="hover:bg-slate-300 dark:hover:bg-slate-700 p-2 rounded-md transition ease-in">
        <PlusIcon />
      </button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{t('bookmarkForm.create.title')}</DialogTitle>
      </DialogHeader>
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
                <FormControl>
                  <Input {...field}/>
                </FormControl>
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
          <DialogFooter>
            <Button type="submit" disabled={createBookmark.isMutating}>
              {createBookmark.isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('bookmarkForm.create.submit')}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
}
