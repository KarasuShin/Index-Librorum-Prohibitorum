'use client'

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import type { ThemeProviderProps as NextThemeProviderProps } from 'next-themes/dist/types'

interface ThemeProviderProps extends NextThemeProviderProps {}

export const ThemeProvider = (props: ThemeProviderProps) => <NextThemeProvider {...props} />
