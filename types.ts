import type { ClassValue } from 'clsx'

export interface ClassNameProps {
  className?: ClassValue
}

export interface SiteInfo {
  cover: string | null
  title: string | null
  description: string | null
}
