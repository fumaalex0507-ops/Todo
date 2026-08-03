import type { Goal } from '../types'

interface GoalListProps {
  goals: Goal[]
  onToggleAchieved: (id: string) => void
  onDelete: (id: string) => void
}

const periodLabel = { weekly: '週間', monthly: '月間' } as const

export function GoalList({ goals, onToggleAchieved, onDelete }: GoalListProps) {
  if (goals.length === 0) {
    return <p className="todo-list__empty">目標はまだありません</p>
  }

  return (
    <ul className="todo-list">
      {goals.map((goal) => (
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
            <p className="todo-item__title">
              {goal.type === 'weight'
                ? `目標体重 ${goal.targetWeight}kg${goal.targetDate ? `(${goal.targetDate}まで)` : ''}`
                : goal.title}
            </p>
            <div className="todo-item__meta">
              <span className="badge badge--category">{periodLabel[goal.period]}目標</span>
            </div>
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
