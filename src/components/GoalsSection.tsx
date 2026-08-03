import { useGoals } from '../hooks/useGoals'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'

export function GoalsSection() {
  const { goals, addGoal, toggleAchieved, deleteGoal } = useGoals()

  return (
    <>
      <p className="app__subtitle">週間・月間の目標を記録しましょう</p>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">週間目標</h2>
        <GoalForm period="weekly" onSubmit={addGoal} />
        <GoalList
          goals={goals}
          period="weekly"
          onToggleAchieved={toggleAchieved}
          onDelete={deleteGoal}
        />
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">月間目標</h2>
        <GoalForm period="monthly" onSubmit={addGoal} />
        <GoalList
          goals={goals}
          period="monthly"
          onToggleAchieved={toggleAchieved}
          onDelete={deleteGoal}
        />
      </div>
    </>
  )
}
