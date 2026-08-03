import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'
import type { TextGoal } from '../types'

export function GoalsSection() {
  const { goals, addGoal, updateGoal, toggleAchieved, deleteGoal } = useGoals()
  const [editingGoal, setEditingGoal] = useState<TextGoal | null>(null)

  return (
    <>
      <p className="app__subtitle">週間・月間の目標を記録しましょう</p>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">週間目標</h2>
        <GoalForm
          period="weekly"
          editingGoal={editingGoal?.period === 'weekly' ? editingGoal : null}
          onSubmit={(input) => {
            if (editingGoal?.period === 'weekly') {
              updateGoal(editingGoal.id, input)
              setEditingGoal(null)
            } else {
              addGoal(input)
            }
          }}
          onCancelEdit={() => setEditingGoal(null)}
        />
        <GoalList
          goals={goals}
          period="weekly"
          onToggleAchieved={toggleAchieved}
          onEdit={setEditingGoal}
          onDelete={(id) => {
            deleteGoal(id)
            if (editingGoal?.id === id) setEditingGoal(null)
          }}
        />
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">月間目標</h2>
        <GoalForm
          period="monthly"
          editingGoal={editingGoal?.period === 'monthly' ? editingGoal : null}
          onSubmit={(input) => {
            if (editingGoal?.period === 'monthly') {
              updateGoal(editingGoal.id, input)
              setEditingGoal(null)
            } else {
              addGoal(input)
            }
          }}
          onCancelEdit={() => setEditingGoal(null)}
        />
        <GoalList
          goals={goals}
          period="monthly"
          onToggleAchieved={toggleAchieved}
          onEdit={setEditingGoal}
          onDelete={(id) => {
            deleteGoal(id)
            if (editingGoal?.id === id) setEditingGoal(null)
          }}
        />
      </div>
    </>
  )
}
