import { ThemeProvider } from '~/components/provider'
import '../globals.css'
import type { Metadata } from 'next'
import { SideBar } from '~/components/sidebar'
import { KeybindingsProvider } from '~/components/provider/keybindings-provider'
import { Header } from '~/components/header'
import { Toaster } from '~/components/ui/toaster'
import { QueryProvider } from '~/components/provider/query-provider'
import { TooltipProvider } from '~/components/ui/tooltip'
import { ScrollArea } from '~/components/ui/scroll-area'
import { I18NProvider } from '~/components/provider/i18n-provider'
import { getMessages } from '~/lib/i18n'

export async function generateMetadata(
  { params }: { params: { locale: string } },
): Promise<Metadata> {
  return {
    title: params.locale === 'zh-CN' ? '魔法禁书目录' : 'Index Librorum Prohibitorum',
    description: 'All for Index',
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    locale: string
  }
}) {
  const m = await getMessages(params.locale)

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="bg-slate-200 dark:bg-slate-900">
        <QueryProvider>
          <KeybindingsProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <I18NProvider messages={m} locale="zh-CN">
                <TooltipProvider>
                  <div className="h-full flex">
                    <SideBar />
                    <div className="w-[calc(100%-theme(space.14))]">
                      <Header />
                      <main className="pt-4 h-[calc(100%-theme(space.14))]">
                        <ScrollArea className="h-full px-4">
                          {children}
                        </ScrollArea>
                      </main>
                    </div>
                  </div>
                  <Toaster />
                </TooltipProvider>
              </I18NProvider>
            </ThemeProvider>
          </KeybindingsProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
