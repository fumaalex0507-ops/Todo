import { useState } from 'react'
import type { GoalInput, GoalPeriod } from '../types'

interface WeightGoalFormProps {
  onSubmit: (input: GoalInput) => void
}

export function WeightGoalForm({ onSubmit }: WeightGoalFormProps) {
  const [period, setPeriod] = useState<GoalPeriod>('monthly')
  const [targetWeight, setTargetWeight] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const weightNum = Number(targetWeight)
    if (!targetWeight || Number.isNaN(weightNum)) return
    onSubmit({ type: 'weight', period, targetWeight: weightNum, targetDate: targetDate || null })
    setTargetWeight('')
    setTargetDate('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <div className="segmented">
          <button
            type="button"
            className={`segmented__btn ${period === 'weekly' ? 'segmented__btn--active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >
            週間
          </button>
          <button
            type="button"
            className={`segmented__btn ${period === 'monthly' ? 'segmented__btn--active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >
            月間
          </button>
        </div>
      </div>

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
          <span>達成期限(任意)</span>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
        </label>
        <button type="submit" className="btn btn--primary">
          追加
        </button>
      </div>
    </form>
  )
}
