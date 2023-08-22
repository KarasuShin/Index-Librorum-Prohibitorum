import * as React from 'react'
import type { DialogProps } from '@radix-ui/react-alert-dialog'
import { useTheme } from 'next-themes'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
import { SunIcon } from '../icon/SunIcon'
import { MoonIcon } from '../icon/MoonIcon'
import { LaptopIcon } from '../icon/LaptopIcon'
import { PlusIcon } from '../icon/PlusIcon'
import { bookmarkState, setCreateBookmarkOpen } from '~/state/bookmark.state'
import { useTranslations } from 'next-intl'
import { useSnapshot } from 'valtio'
import { useState } from 'react'
import { isApple } from '~/lib/is'

export function CommandMenu({ ...props }: DialogProps) {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const { setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const t = useTranslations()
  const { query } = useSnapshot(bookmarkState)

  const queryData = React.useMemo(() => {
    if (!text) {
      return []
    }
    return query?.data?.filter(bookmark => bookmark.title.toLowerCase().includes(text.toLowerCase()))
  }, [query?.data, text])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="inline-flex">{t('commandMenu.search')}</span>
        <kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs mr-1">{isApple() ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={v => {
        setOpen(v)
        setText('')
      }}>
        <CommandInput placeholder={t('commandMenu.placeholder')} onInput={e => {
          setText(e.currentTarget.value)
        }} />
        <CommandList>
          <CommandEmpty>{t('commandMenu.noResult')}</CommandEmpty>
          <CommandGroup heading={t('commandMenu.action')}>
            <CommandItem onSelect={() => runCommand(() => setCreateBookmarkOpen(true))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('commandMenu.actions.addBookmark')}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t('settings.theme')}>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <SunIcon className="mr-2 h-4 w-4" />
              {t('themes.light')}
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              {t('themes.dark')}
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              {t('themes.system')}
            </CommandItem>
          </CommandGroup>
          {queryData?.length
            ? (
              <>
                <CommandSeparator />
                <CommandGroup heading={t('commandMenu.bookmark')}>
                  {query?.data?.map(bookmark => (
                    <CommandItem key={bookmark.id} onSelect={() => runCommand(() => window.open(bookmark.url))}>
                      {bookmark.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )
            : <></>}
        </CommandList>
      </CommandDialog>
    </>
  )
}
