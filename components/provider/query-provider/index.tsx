'use client'
import { SWRConfig } from 'swr'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig>{children}</SWRConfig>
  )
}

