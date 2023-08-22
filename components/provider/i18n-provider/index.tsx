'use client'

import type { AbstractIntlMessages } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'

interface I18NProviderProps {
  messages: AbstractIntlMessages
  locale: string
  children: React.ReactNode
}

export const I18NProvider = ({ messages, locale, children }: I18NProviderProps) => <NextIntlClientProvider
  messages={messages}
  locale={locale}
>
  {children}
</NextIntlClientProvider>
