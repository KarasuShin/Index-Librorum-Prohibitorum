import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { SettingIcon } from '~/components/icon/SettingIcon'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next-intl/client'

export const SettingMenu = () => {
  const { setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const t = useTranslations()

  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <a className="hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-md transition ease-in cursor-pointer flex">
        <SettingIcon className="text-xl" />
      </a>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" >
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t('settings.language')}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => router.push(`zh-CN${pathname}`)}>简体中文</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`en${pathname}`)}>English</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t('settings.theme')}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>{t('themes.light')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>{t('themes.dark')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>{t('themes.system')}</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Log out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
