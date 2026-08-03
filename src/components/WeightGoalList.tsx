import { computeDateProgress, computeWeightProgress } from '../lib/goalProgress'
import { DualProgressBars } from './DualProgressBars'
import type { Goal, WeightEntry, WeightGoal } from '../types'

interface WeightGoalListProps {
  goals: Goal[]
  weightEntries: WeightEntry[]
  onDelete: (id: string) => void
}

export function WeightGoalList({ goals, weightEntries, onDelete }: WeightGoalListProps) {
  const filtered = goals.filter((g): g is WeightGoal => g.type === 'weight')

  if (filtered.length === 0) {
    return <p className="todo-list__empty">体重目標はまだありません</p>
  }

  return (
    <ul className="goal-progress-list">
      {filtered.map((goal) => {
        const progress = computeWeightProgress(goal, weightEntries)
        const dateProgress = computeDateProgress(goal)
        return (
          <li key={goal.id} className="goal-progress-item">
            <div className="goal-progress-item__body">
              <p className="goal-progress-item__title">
                目標体重 {goal.targetWeight}kg({goal.startDate}〜{goal.targetDate})
              </p>
              <DualProgressBars weightPercent={progress.percent} datePercent={dateProgress} />
              <p className="goal-progress-item__detail">
                開始 {goal.startWeight}kg
                {progress.current != null ? ` → 現在 ${progress.current}kg` : ''}
              </p>
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
