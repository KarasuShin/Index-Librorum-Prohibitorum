'use client'

import { CommandMenu } from '~/components/command-menu'
import { AddBookmarkDialog } from '~/components/add-bookmark-dialog'

export const Header = () => <header className="h-14 flex items-center justify-between px-4">
  <div>
    <CommandMenu />
  </div>

  <div>
    <AddBookmarkDialog />
  </div>
</header>
