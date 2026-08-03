import { computeWeightProgress } from '../lib/goalProgress'
import type { Goal, WeightEntry, WeightGoal } from '../types'

interface WeightGoalListProps {
  goals: Goal[]
  weightEntries: WeightEntry[]
  onToggleAchieved: (id: string) => void
  onDelete: (id: string) => void
}

const periodLabel = { weekly: '週間', monthly: '月間' } as const

export function WeightGoalList({ goals, weightEntries, onToggleAchieved, onDelete }: WeightGoalListProps) {
  const filtered = goals.filter((g): g is WeightGoal => g.type === 'weight')

  if (filtered.length === 0) {
    return <p className="todo-list__empty">体重目標はまだありません</p>
  }

  return (
    <ul className="goal-progress-list">
      {filtered.map((goal) => {
        const progress = computeWeightProgress(goal, weightEntries)
        return (
          <li key={goal.id} className={`goal-progress-item ${goal.achieved ? 'goal-progress-item--done' : ''}`}>
            <label className="todo-item__checkbox">
              <input
                type="checkbox"
                checked={goal.achieved}
                onChange={() => onToggleAchieved(goal.id)}
              />
              <span aria-hidden="true" />
            </label>

            <div className="goal-progress-item__body">
              <div className="goal-progress-item__head">
                <span className="goal-progress-item__title">
                  {periodLabel[goal.period]}目標 {goal.targetWeight}kg
                  {goal.targetDate ? `(${goal.targetDate}まで)` : ''}
                </span>
                <span className="goal-progress-item__percent">{Math.round(progress.percent)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${progress.percent}%` }} />
              </div>
              {progress.current != null && (
                <p className="goal-progress-item__detail">現在 {progress.current}kg</p>
              )}
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
        )
      })}
    </ul>
  )
}
