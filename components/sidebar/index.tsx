'use client'

import { SettingMenu } from './SettingMenu'
import { MixIcon } from '../icon/MixIcon'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import { usePathname } from 'next-intl/client'

export const SideBar = () => {
  const pathName = usePathname()

  return <aside className="w-14 h-full bg-slate-100 dark:bg-slate-800 flex flex-col justify-between items-center py-8">
    <div>
      <Link href="/" className={cn('hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-md transition ease-in cursor-pointer flex', {
        'bg-slate-200 dark:bg-slate-700': pathName === '/',
      })}>
        <MixIcon className="text-xl" />
      </Link>
    </div>
    <div>
      <SettingMenu />
    </div>
  </aside>
}
