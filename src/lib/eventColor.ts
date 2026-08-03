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

export function eventColorStyleFor(color: EventColor): CSSProperties {
  return {
    '--event-color-light': color.light,
    '--event-color-dark': color.dark,
  } as CSSProperties
}

export function eventColorStyle(id: string): CSSProperties {
  return eventColorStyleFor(getEventColor(id))
}

/**
 * 週ごとの予定キー一覧(上から順)を受け取り、同じ週内で色が被らないように調整した
 * キー → 色 のマップを返す。キーにはタイトルを渡すことで、同じタイトルの予定は
 * 全期間を通じて常に同じ色になり、異なるタイトル同士は同じ週内でなるべく色が
 * 被らないようになる。
 */
export function assignEventColors(weeksOfKeys: string[][]): Map<string, EventColor> {
  const assigned = new Map<string, EventColor>()

  for (const keys of weeksOfKeys) {
    const usedThisWeek = new Set<number>()

    for (const key of keys) {
      const existing = assigned.get(key)
      if (existing) usedThisWeek.add(PALETTE.indexOf(existing))
    }

    for (const key of keys) {
      if (assigned.has(key)) continue
      let idx = hashString(key) % PALETTE.length
      let attempts = 0
      while (usedThisWeek.has(idx) && attempts < PALETTE.length) {
        idx = (idx + 1) % PALETTE.length
        attempts++
      }
      usedThisWeek.add(idx)
      assigned.set(key, PALETTE[idx])
    }
  }

  return assigned
}
