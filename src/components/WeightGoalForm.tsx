import { useState } from 'react'
import type { GoalInput } from '../types'

interface WeightGoalFormProps {
  onSubmit: (input: GoalInput) => void
}

export function WeightGoalForm({ onSubmit }: WeightGoalFormProps) {
  const [targetWeight, setTargetWeight] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const weightNum = Number(targetWeight)
    if (!targetWeight || Number.isNaN(weightNum) || !targetDate) return
    onSubmit({ type: 'weight', targetWeight: weightNum, targetDate })
    setTargetWeight('')
    setTargetDate('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row todo-form__row--details">
        <label className="todo-form__field">
          <span>目標体重(kg)</span>
          <input
            type="number"
            step="0.1"
            placeholder="65.0"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            required
          />
        </label>
        <label className="todo-form__field">
          <span>達成期限</span>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn--primary">
          追加
        </button>
      </div>
    </form>
  )
}
