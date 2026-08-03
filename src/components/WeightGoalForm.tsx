import { useState } from 'react'
import { today } from '../lib/date'
import type { GoalInput } from '../types'

interface WeightGoalFormProps {
  latestWeight: number | null
  onSubmit: (input: GoalInput) => void
}

export function WeightGoalForm({ latestWeight, onSubmit }: WeightGoalFormProps) {
  const [startWeight, setStartWeight] = useState(() => (latestWeight != null ? String(latestWeight) : ''))
  const [startDate, setStartDate] = useState(today)
  const [targetWeight, setTargetWeight] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const startNum = Number(startWeight)
    const targetNum = Number(targetWeight)
    if (!startWeight || Number.isNaN(startNum) || !startDate) return
    if (!targetWeight || Number.isNaN(targetNum) || !targetDate) return
    onSubmit({ type: 'weight', startWeight: startNum, startDate, targetWeight: targetNum, targetDate })
    setTargetWeight('')
    setTargetDate('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row todo-form__row--details">
        <label className="todo-form__field">
          <span>スタート時体重(kg)</span>
          <input
            type="number"
            step="0.1"
            placeholder="68.0"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
            required
          />
        </label>
        <label className="todo-form__field">
          <span>開始日</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
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
