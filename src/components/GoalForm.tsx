import { useState } from 'react'
import type { GoalInput, GoalPeriod } from '../types'

interface GoalFormProps {
  onSubmit: (input: GoalInput) => void
}

export function GoalForm({ onSubmit }: GoalFormProps) {
  const [period, setPeriod] = useState<GoalPeriod>('weekly')
  const [type, setType] = useState<'weight' | 'text'>('text')
  const [title, setTitle] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [targetDate, setTargetDate] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (type === 'text') {
      if (!title.trim()) return
      onSubmit({ type: 'text', period, title })
      setTitle('')
      return
    }

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

        <div className="segmented">
          <button
            type="button"
            className={`segmented__btn ${type === 'text' ? 'segmented__btn--active' : ''}`}
            onClick={() => setType('text')}
          >
            テキスト目標
          </button>
          <button
            type="button"
            className={`segmented__btn ${type === 'weight' ? 'segmented__btn--active' : ''}`}
            onClick={() => setType('weight')}
          >
            体重目標
          </button>
        </div>
      </div>

      {type === 'text' ? (
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
      ) : (
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
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--primary">
            追加
          </button>
        </div>
      )}
    </form>
  )
}
