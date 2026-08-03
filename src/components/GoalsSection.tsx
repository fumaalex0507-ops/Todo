import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { useGoalDeadlines } from '../hooks/useGoalDeadlines'
import { formatMonthDay } from '../lib/date'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'
import type { TextGoal } from '../types'

export function GoalsSection() {
  const { goals, addGoal, updateGoal, deleteGoal, reorderGoals } = useGoals()
  const { deadlines, setDeadline } = useGoalDeadlines()
  const [editingGoal, setEditingGoal] = useState<TextGoal | null>(null)

  const handleReorder = (draggedId: string, targetId: string) => {
    const ids = goals.map((g) => g.id)
    const fromIndex = ids.indexOf(draggedId)
    const toIndex = ids.indexOf(targetId)
    if (fromIndex === -1 || toIndex === -1) return
    ids.splice(fromIndex, 1)
    ids.splice(ids.indexOf(targetId), 0, draggedId)
    reorderGoals(ids)
  }

  return (
    <>
      <p className="app__subtitle">週間・月間の目標を記録しましょう</p>

      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">
            週間目標{deadlines.weekly ? `(~${formatMonthDay(deadlines.weekly)})` : ''}
          </h2>
          <input
            type="date"
            className="dashboard-card__deadline"
            value={deadlines.weekly ?? ''}
            onChange={(e) => setDeadline('weekly', e.target.value || null)}
          />
        </div>
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
          onEdit={setEditingGoal}
          onDelete={(id) => {
            deleteGoal(id)
            if (editingGoal?.id === id) setEditingGoal(null)
          }}
          onReorder={handleReorder}
        />
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">
            月間目標{deadlines.monthly ? `(~${formatMonthDay(deadlines.monthly)})` : ''}
          </h2>
          <input
            type="date"
            className="dashboard-card__deadline"
            value={deadlines.monthly ?? ''}
            onChange={(e) => setDeadline('monthly', e.target.value || null)}
          />
        </div>
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
          onEdit={setEditingGoal}
          onDelete={(id) => {
            deleteGoal(id)
            if (editingGoal?.id === id) setEditingGoal(null)
          }}
          onReorder={handleReorder}
        />
      </div>
    </>
  )
}
