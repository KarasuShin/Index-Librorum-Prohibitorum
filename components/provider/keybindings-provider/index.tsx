'use client'
import type { ReactNode } from 'react'
import { useMount, useUnmount } from 'react-use'
import KeyboardJS from 'keyboardjs'

export const KeybindingsProvider = ({ children }: {
  children: ReactNode
}) => {
  useMount(() => {
    KeyboardJS.bind('command + ,', e => {
      e?.preventDefault()
    })
  })

  useUnmount(() => {
    KeyboardJS.stop()
  })

  return children
}
