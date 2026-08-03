import { useState } from 'react'
import type { GoalInput, GoalPeriod } from '../types'

interface GoalFormProps {
  period: GoalPeriod
  onSubmit: (input: GoalInput) => void
}

export function GoalForm({ period, onSubmit }: GoalFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ type: 'text', period, title })
    setTitle('')
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
          追加
        </button>
      </div>
    </form>
  )
}
