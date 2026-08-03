import { useState } from 'react'
import { today } from '../lib/date'

interface WeightFormProps {
  onSubmit: (date: string, weight: number) => void
}

export function WeightForm({ onSubmit }: WeightFormProps) {
  const [date, setDate] = useState(today)
  const [weight, setWeight] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const weightNum = Number(weight)
    if (!weight || Number.isNaN(weightNum)) return
    onSubmit(date, weightNum)
    setWeight('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row todo-form__row--details">
        <label className="todo-form__field">
          <span>日付</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="todo-form__field">
          <span>体重(kg)</span>
          <input
            type="number"
            step="0.1"
            placeholder="65.0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn--primary">
          記録
        </button>
      </div>
    </form>
  )
}
