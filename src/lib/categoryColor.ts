import type { CSSProperties } from 'react'

export interface CategoryColor {
  light: string
  dark: string
}

const PRESET_COLORS: Record<string, CategoryColor> = {
  運動: { light: '#e34948', dark: '#e66767' },
  勉強: { light: '#2a78d6', dark: '#3987e5' },
  仕事: { light: '#4a3aa7', dark: '#9085e9' },
  生活: { light: '#008300', dark: '#008300' },
}

const NEUTRAL: CategoryColor = { light: '#71717a', dark: '#a1a1aa' }

const AUTO_PALETTE: CategoryColor[] = [
  { light: '#eb6834', dark: '#d95926' },
  { light: '#1baf7a', dark: '#199e70' },
  { light: '#eda100', dark: '#c98500' },
  { light: '#e87ba4', dark: '#d55181' },
]

function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function getCategoryColor(category: string): CategoryColor {
  if (!category || category === 'その他') return NEUTRAL
  const preset = PRESET_COLORS[category]
  if (preset) return preset
  return AUTO_PALETTE[hashString(category) % AUTO_PALETTE.length]
}

export function categoryColorStyle(category: string): CSSProperties {
  const color = getCategoryColor(category)
  return {
    '--badge-color-light': color.light,
    '--badge-color-dark': color.dark,
  } as CSSProperties
}
