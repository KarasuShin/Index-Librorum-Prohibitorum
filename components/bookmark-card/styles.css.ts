import { globalStyle, style } from '@vanilla-extract/css'

export const container = style({})

export const actionBar = style({})

globalStyle(`${container}:hover ${actionBar}`, {
  opacity: 1,
})
