import { useMemo, useState } from 'react'
import { useWeightEntries } from '../hooks/useWeightEntries'
import { useGoals } from '../hooks/useGoals'
import { WeightForm } from './WeightForm'
import { WeightChart } from './WeightChart'
import { WeightGoalForm } from './WeightGoalForm'
import { WeightGoalList } from './WeightGoalList'

export function WeightSection() {
  const { entries, addEntry } = useWeightEntries()
  const { goals, addGoal, deleteGoal } = useGoals()
  const [showGoalForm, setShowGoalForm] = useState(false)

  const activeWeightGoal = useMemo(
    () =>
      goals
        .filter((g) => g.type === 'weight' && !g.achieved)
        .sort((a, b) => b.createdAt - a.createdAt)[0],
    [goals],
  )

  const latestWeight = useMemo(() => {
    if (entries.length === 0) return null
    return [...entries].sort((a, b) => b.date.localeCompare(a.date))[0].weight
  }, [entries])

  return (
    <>
      <p className="app__subtitle">
        {latestWeight != null ? `最新の記録: ${latestWeight}kg` : '体重を記録してみましょう'}
      </p>

      <WeightForm onSubmit={addEntry} />

      <div className="weight-chart-card">
        <WeightChart
          entries={entries}
          targetWeight={activeWeightGoal?.type === 'weight' ? activeWeightGoal.targetWeight : null}
        />
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">体重目標</h2>
          <button type="button" className="btn btn--ghost" onClick={() => setShowGoalForm((v) => !v)}>
            {showGoalForm ? '閉じる' : '目標を設定'}
          </button>
        </div>
        {showGoalForm && (
          <WeightGoalForm
            latestWeight={latestWeight}
            onSubmit={(input) => {
              addGoal(input)
              setShowGoalForm(false)
            }}
          />
        )}
        <WeightGoalList goals={goals} weightEntries={entries} onDelete={deleteGoal} />
      </div>
    </>
  )
}
