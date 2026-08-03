export function today() {
  return new Date().toISOString().slice(0, 10)
}

export type DateRangeKey = '1w' | '1m' | '3m' | 'thisMonth' | 'all'

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function rangeStartDate(key: DateRangeKey): string | null {
  const now = new Date()

  switch (key) {
    case 'all':
      return null
    case 'thisMonth':
      return toDateStr(new Date(now.getFullYear(), now.getMonth(), 1))
    case '1w': {
      const d = new Date(now)
      d.setDate(d.getDate() - 7)
      return toDateStr(d)
    }
    case '1m': {
      const d = new Date(now)
      d.setMonth(d.getMonth() - 1)
      return toDateStr(d)
    }
    case '3m': {
      const d = new Date(now)
      d.setMonth(d.getMonth() - 3)
      return toDateStr(d)
    }
  }
}
