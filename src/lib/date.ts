export function today() {
  return new Date().toISOString().slice(0, 10)
}

export type DateRangeKey = '1w' | '1m' | '3m' | 'thisMonth' | 'all'

function pad2(n: number) {
  return n.toString().padStart(2, '0')
}

export function toDateStr(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

export function formatMonthDay(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function mostRecentMonday(): string {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diff)
  return toDateStr(monday)
}

export function dateRange(startStr: string, endStr: string): string[] {
  const start = new Date(`${startStr}T00:00:00`)
  const end = new Date(`${endStr}T00:00:00`)
  const dates: string[] = []
  const cur = new Date(start)
  while (cur <= end) {
    dates.push(toDateStr(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dates
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
