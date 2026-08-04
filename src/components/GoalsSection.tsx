import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'
import { useGoalDeadlines } from '../hooks/useGoalDeadlines'
import { GoalForm } from './GoalForm'
import { GoalList } from './GoalList'
import type { GoalPeriod, TextGoal } from '../types'

export function GoalsSection() {
  const { goals, addGoal, updateGoal, deleteGoal, reorderGoals } = useGoals()
  const { deadlines, setDeadline } = useGoalDeadlines()
  const [editingGoal, setEditingGoal] = useState<TextGoal | null>(null)
  const [openForms, setOpenForms] = useState<Record<GoalPeriod, boolean>>({
    weekly: false,
    monthly: false,
  })

  const toggleForm = (period: GoalPeriod) => {
    setOpenForms((prev) => ({ ...prev, [period]: !prev[period] }))
    if (editingGoal?.period === period) setEditingGoal(null)
  }

  const handleReorder = (draggedId: string, targetId: string) => {
    const ids = goals.map((g) => g.id)
    const fromIndex = ids.indexOf(draggedId)
    const toIndex = ids.indexOf(targetId)
    if (fromIndex === -1 || toIndex === -1) return
    ids.splice(fromIndex, 1)
    ids.splice(ids.indexOf(targetId), 0, draggedId)
    reorderGoals(ids)
  }

  const renderSection = (period: GoalPeriod, title: string) => {
    const isOpen = openForms[period] || editingGoal?.period === period

    return (
      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">{title}</h2>
          <label className="dashboard-card__deadline-field">
            <span>期限</span>
            <input
              type="date"
              className="dashboard-card__deadline"
              value={deadlines[period] ?? ''}
              onChange={(e) => setDeadline(period, e.target.value || null)}
            />
          </label>
          <button
            type="button"
            className="dashboard-card__add-btn"
            aria-label={isOpen ? `${title}の入力欄を閉じる` : `${title}を追加`}
            aria-expanded={isOpen}
            onClick={() => toggleForm(period)}
          >
            {isOpen ? '−' : '+'}
          </button>
        </div>
        {isOpen && (
          <GoalForm
            period={period}
            editingGoal={editingGoal?.period === period ? editingGoal : null}
            onSubmit={(input) => {
              if (editingGoal?.period === period) {
                updateGoal(editingGoal.id, input)
                setEditingGoal(null)
              } else {
                addGoal(input)
              }
            }}
            onCancelEdit={() => setEditingGoal(null)}
          />
        )}
        <GoalList
          goals={goals}
          period={period}
          onEdit={(goal) => {
            setEditingGoal(goal)
            setOpenForms((prev) => ({ ...prev, [period]: true }))
          }}
          onDelete={(id) => {
            deleteGoal(id)
            if (editingGoal?.id === id) setEditingGoal(null)
          }}
          onReorder={handleReorder}
        />
      </div>
    )
  }

  return (
    <>
      <p className="app__subtitle">週間・月間の目標を記録しましょう</p>

      {renderSection('weekly', '週間目標')}
      {renderSection('monthly', '月間目標')}
    </>
  )
}
