import type { CSSProperties } from 'react'

export interface EventColor {
  light: string
  dark: string
}

const PALETTE: EventColor[] = [
  { light: '#2a78d6', dark: '#3987e5' },
  { light: '#eb6834', dark: '#d95926' },
  { light: '#1baf7a', dark: '#199e70' },
  { light: '#eda100', dark: '#c98500' },
  { light: '#e87ba4', dark: '#d55181' },
  { light: '#008300', dark: '#008300' },
  { light: '#4a3aa7', dark: '#9085e9' },
  { light: '#e34948', dark: '#e66767' },
]

function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getEventColor(id: string): EventColor {
  return PALETTE[hashString(id) % PALETTE.length]
}

export function eventColorStyle(id: string): CSSProperties {
  const color = getEventColor(id)
  return {
    '--event-color-light': color.light,
    '--event-color-dark': color.dark,
  } as CSSProperties
}
