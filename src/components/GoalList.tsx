import type { Goal, GoalPeriod, TextGoal } from '../types'

interface GoalListProps {
  goals: Goal[]
  period: GoalPeriod
  onToggleAchieved: (id: string) => void
  onDelete: (id: string) => void
}

export function GoalList({ goals, period, onToggleAchieved, onDelete }: GoalListProps) {
  const filtered = goals.filter(
    (g): g is TextGoal => g.type === 'text' && g.period === period,
  )

  if (filtered.length === 0) {
    return <p className="todo-list__empty">目標はまだありません</p>
  }

  return (
    <ul className="todo-list">
      {filtered.map((goal) => (
        <li key={goal.id} className={`todo-item ${goal.achieved ? 'todo-item--done' : ''}`}>
          <label className="todo-item__checkbox">
            <input
              type="checkbox"
              checked={goal.achieved}
              onChange={() => onToggleAchieved(goal.id)}
            />
            <span aria-hidden="true" />
          </label>

          <div className="todo-item__body">
            <p className="todo-item__title">{goal.title}</p>
          </div>

          <button
            type="button"
            className="todo-item__delete"
            aria-label="削除"
            onClick={() => onDelete(goal.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
