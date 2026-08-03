import { useGoals } from '../hooks/useGoals'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'

export function GoalsSection() {
  const { goals, addGoal, toggleAchieved, deleteGoal } = useGoals()

  return (
    <>
      <p className="app__subtitle">週間・月間の目標を記録しましょう</p>
      <GoalForm onSubmit={addGoal} />
      <GoalList goals={goals} onToggleAchieved={toggleAchieved} onDelete={deleteGoal} />
    </>
  )
}
