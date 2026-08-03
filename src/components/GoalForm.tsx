import { useEffect, useState } from 'react'
import type { GoalInput, GoalPeriod, TextGoal } from '../types'

interface GoalFormProps {
  period: GoalPeriod
  editingGoal: TextGoal | null
  onSubmit: (input: GoalInput) => void
  onCancelEdit: () => void
}

export function GoalForm({ period, editingGoal, onSubmit, onCancelEdit }: GoalFormProps) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    setTitle(editingGoal ? editingGoal.title : '')
  }, [editingGoal])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ type: 'text', period, title })
    if (!editingGoal) setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          className="todo-form__title"
          type="text"
          placeholder="例: TOEIC 800点を取る"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="btn btn--primary">
          {editingGoal ? '更新' : '追加'}
        </button>
        {editingGoal && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
