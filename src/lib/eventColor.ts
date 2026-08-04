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

// パレット内の色同士がどれだけ似て見えるかをOKLab色空間の距離で判定する
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function srgbToLinear(c: number) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function rgbToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ]
}

function oklabDistance(hexA: string, hexB: string) {
  const [l1, a1, b1] = rgbToOklab(hexToRgb(hexA))
  const [l2, a2, b2] = rgbToOklab(hexToRgb(hexB))
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2) * 100
}

// この距離未満のペアは「違う色だが似て見える」とみなし、同時に使わないようにする
const SIMILAR_THRESHOLD = 16

const SIMILAR_INDEXES: number[][] = PALETTE.map((color, i) =>
  PALETTE.reduce<number[]>((acc, other, j) => {
    if (i !== j && oklabDistance(color.light, other.light) < SIMILAR_THRESHOLD) acc.push(j)
    return acc
  }, []),
)

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
 * 月内の予定キー一覧(上から順)を受け取り、パレットに余裕がある限り月内で色(見た目が
 * 近い色も含む)が被らないように調整したキー → 色 のマップを返す。キーにはタイトルを渡す
 * ことで、同じタイトルの予定は常に同じ色になる。パレットの空きがなくなった場合は、
 * その時点で最も衝突の少ない色にフォールバックする(=被りを許容する)。
 */
export function assignEventColors(orderedKeys: string[]): Map<string, EventColor> {
  const assigned = new Map<string, EventColor>()
  const usedThisMonth = new Set<number>()

  const conflicts = (idx: number) =>
    usedThisMonth.has(idx) || SIMILAR_INDEXES[idx].some((i) => usedThisMonth.has(i))

  for (const key of orderedKeys) {
    if (assigned.has(key)) continue
    let idx = hashString(key) % PALETTE.length
    let attempts = 0
    while (conflicts(idx) && attempts < PALETTE.length) {
      idx = (idx + 1) % PALETTE.length
      attempts++
    }
    usedThisMonth.add(idx)
    assigned.set(key, PALETTE[idx])
  }

  return assigned
}
