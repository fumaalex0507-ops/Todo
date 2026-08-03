import { computeWeightProgress } from '../lib/goalProgress'
import type { Goal, GoalPeriod, WeightEntry } from '../types'

interface GoalProgressListProps {
  goals: Goal[]
  period: GoalPeriod
  weightEntries: WeightEntry[]
  onToggleAchieved: (id: string) => void
}

export function GoalProgressList({ goals, period, weightEntries, onToggleAchieved }: GoalProgressListProps) {
  const filtered = goals.filter((g) => g.period === period)

  if (filtered.length === 0) {
    return <p className="todo-list__empty">目標はまだありません</p>
  }

  return (
    <ul className="goal-progress-list">
      {filtered.map((goal) => {
        if (goal.type === 'text') {
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
              <span className="goal-progress-item__title">{goal.title}</span>
            </li>
          )
        }

        const progress = computeWeightProgress(goal, weightEntries)
        return (
          <li key={goal.id} className={`goal-progress-item ${goal.achieved ? 'goal-progress-item--done' : ''}`}>
            <div className="goal-progress-item__body">
              <div className="goal-progress-item__head">
                <span className="goal-progress-item__title">
                  目標体重 {goal.targetWeight}kg
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
          </li>
        )
      })}
    </ul>
  )
}
