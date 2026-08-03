import type { WeightEntry } from '../types'

interface WeightLogListProps {
  entries: WeightEntry[]
  onDelete: (id: string) => void
}

export function WeightLogList({ entries, onDelete }: WeightLogListProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  if (sorted.length === 0) return null

  return (
    <ul className="weight-log">
      {sorted.map((e) => (
        <li key={e.id} className="weight-log__row">
          <span className="weight-log__date">{e.date}</span>
          <span className="weight-log__value">{e.weight}kg</span>
          <button
            type="button"
            className="todo-item__delete"
            aria-label="削除"
            onClick={() => onDelete(e.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
