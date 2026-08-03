import type { Goal, GoalPeriod, TextGoal } from '../types'

interface GoalProgressListProps {
  goals: Goal[]
  period: GoalPeriod
  onToggleAchieved: (id: string) => void
}

export function GoalProgressList({ goals, period, onToggleAchieved }: GoalProgressListProps) {
  const filtered = goals.filter(
    (g): g is TextGoal => g.type === 'text' && g.period === period,
  )

  if (filtered.length === 0) {
    return <p className="todo-list__empty">目標はまだありません</p>
  }

  return (
    <ul className="goal-progress-list">
      {filtered.map((goal) => (
        <li key={goal.id} className={`goal-progress-item ${goal.achieved ? 'goal-progress-item--done' : ''}`}>
          <label className="todo-item__checkbox">
            <input
              type="checkbox"
              checked={goal.achieved}
              onChange={() => onToggleAchieved(goal.id)}
            />
            <span aria-hidden="true" />
          </label>
          <span className="goal-progress-item__title">{goal.title}</span>
        </li>
      ))}
    </ul>
  )
}
