import { useMemo } from 'react'
import { useWeightEntries } from '../hooks/useWeightEntries'
import { useGoals } from '../hooks/useGoals'
import { WeightForm } from './WeightForm'
import { WeightChart } from './WeightChart'
import { WeightLogList } from './WeightLogList'

export function WeightSection() {
  const { entries, addEntry, deleteEntry } = useWeightEntries()
  const { goals } = useGoals()

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

      <WeightLogList entries={entries} onDelete={deleteEntry} />
    </>
  )
}
