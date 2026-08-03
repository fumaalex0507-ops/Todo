import { useEffect, useState } from 'react'
import type { Event, EventInput } from '../types'

interface EventFormProps {
  date: string
  editingEvent: Event | null
  onSubmit: (input: EventInput) => void
  onCancelEdit: () => void
}

export function EventForm({ date, editingEvent, onSubmit, onCancelEdit }: EventFormProps) {
  const [startDate, setStartDate] = useState(date)
  const [endDate, setEndDate] = useState('')
  const [time, setTime] = useState('')
  const [title, setTitle] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => {
    if (editingEvent) {
      setStartDate(editingEvent.date)
      setEndDate(editingEvent.endDate ?? '')
      setTime(editingEvent.time ?? '')
      setTitle(editingEvent.title)
      setMemo(editingEvent.memo)
    } else {
      setStartDate(date)
      setEndDate('')
      setTime('')
      setTitle('')
      setMemo('')
    }
  }, [editingEvent, date])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    onSubmit({ date: startDate, endDate: endDate || null, time: time || null, title, memo })
    setEndDate('')
    setTime('')
    setTitle('')
    setMemo('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          className="todo-form__title"
          type="text"
          placeholder="予定を入力…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="btn btn--primary">
          {editingEvent ? '更新' : '追加'}
        </button>
        {editingEvent && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            キャンセル
          </button>
        )}
      </div>

      <div className="todo-form__row todo-form__row--details">
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
          <span>終了日(任意・期間予定の場合)</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label className="todo-form__field">
          <span>時間(任意)</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <label className="todo-form__field">
          <span>メモ(任意)</span>
          <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </label>
      </div>
    </form>
  )
}
