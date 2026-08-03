import { useEffect, useMemo, useRef, useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useEvents } from '../hooks/useEvents'
import { today, toDateStr } from '../lib/date'
import { fetchHolidays } from '../lib/holidays'
import { TodoList } from './TodoList'
import { EventForm } from './EventForm'
import type { Event } from '../types'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

interface DayCell {
  dateStr: string
  day: number
  inMonth: boolean
  weekday: number
}

function buildMonthGrid(year: number, month: number): DayCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart)
    d.setDate(gridStart.getDate() + i)
    return {
      dateStr: toDateStr(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
      weekday: d.getDay(),
    }
  })
}

export function CalendarSection() {
  const { todos, toggleComplete, deleteTodo } = useTodos()
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()

  const [viewDate, setViewDate] = useState(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(today)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [holidaysByYear, setHolidaysByYear] = useState<Record<number, Record<string, string>>>({})
  const fetchedYearsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    const year = viewDate.getFullYear()
    if (fetchedYearsRef.current.has(year)) return
    fetchedYearsRef.current.add(year)
    fetchHolidays(year).then((data) => {
      setHolidaysByYear((prev) => ({ ...prev, [year]: data }))
    })
  }, [viewDate])

  const holidays = holidaysByYear[viewDate.getFullYear()] ?? {}

  const grid = useMemo(
    () => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate],
  )

  const todosByDate = useMemo(() => {
    const map = new Map<string, number>()
    todos.forEach((t) => {
      if (t.dueDate) map.set(t.dueDate, (map.get(t.dueDate) ?? 0) + 1)
    })
    return map
  }, [todos])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, number>()
    events.forEach((e) => {
      map.set(e.date, (map.get(e.date) ?? 0) + 1)
    })
    return map
  }, [events])

  const selectedTodos = useMemo(
    () => todos.filter((t) => t.dueDate === selectedDate),
    [todos, selectedDate],
  )

  const selectedEvents = useMemo(
    () =>
      events
        .filter((e) => e.date === selectedDate)
        .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')),
    [events, selectedDate],
  )

  return (
    <>
      <p className="app__subtitle">Todoの期限と個人予定をまとめて確認できます</p>

      <div className="dashboard-card">
        <div className="calendar-header">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
          >
            ←
          </button>
          <span className="calendar-header__title">
            {viewDate.getFullYear()}年{viewDate.getMonth() + 1}月
          </span>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
          >
            →
          </button>
        </div>

        <div className="calendar-grid calendar-grid__weekdays">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={[
                'calendar-weekday',
                i === 0 ? 'calendar-weekday--sun' : '',
                i === 6 ? 'calendar-weekday--sat' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {w}
            </div>
          ))}
        </div>

        <div className="calendar-grid calendar-grid--days">
          {grid.map((cell) => {
            const hasTodo = todosByDate.has(cell.dateStr)
            const hasEvent = eventsByDate.has(cell.dateStr)
            const holidayName = holidays[cell.dateStr]
            return (
              <button
                key={cell.dateStr}
                type="button"
                title={holidayName}
                className={[
                  'calendar-day',
                  cell.weekday === 0 || holidayName ? 'calendar-day--sun' : '',
                  cell.weekday === 6 ? 'calendar-day--sat' : '',
                  !cell.inMonth ? 'calendar-day--muted' : '',
                  cell.dateStr === today() ? 'calendar-day--today' : '',
                  cell.dateStr === selectedDate ? 'calendar-day--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => setSelectedDate(cell.dateStr)}
              >
                <span className="calendar-day__num">{cell.day}</span>
                <span className="calendar-day__dots">
                  {hasTodo && <span className="calendar-dot calendar-dot--todo" />}
                  {hasEvent && <span className="calendar-dot calendar-dot--event" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">{selectedDate} の予定・Todo</h2>

        {selectedTodos.length > 0 && (
          <>
            <p className="calendar-section-label">Todo</p>
            <TodoList todos={selectedTodos} onToggle={toggleComplete} onDelete={deleteTodo} />
          </>
        )}

        <p className="calendar-section-label">個人予定</p>
        {selectedEvents.length === 0 ? (
          <p className="todo-list__empty">この日の予定はありません</p>
        ) : (
          <ul className="calendar-event-list">
            {selectedEvents.map((ev) => (
              <li key={ev.id} className="calendar-event-row">
                <div className="calendar-event-row__info">
                  {ev.time && <span className="calendar-event-row__time">{ev.time}</span>}
                  <span className="calendar-event-row__title">{ev.title}</span>
                  {ev.memo && <span className="calendar-event-row__memo">{ev.memo}</span>}
                </div>
                <div className="calendar-event-row__actions">
                  <button type="button" className="btn btn--ghost" onClick={() => setEditingEvent(ev)}>
                    編集
                  </button>
                  <button
                    type="button"
                    className="todo-item__delete"
                    aria-label="削除"
                    onClick={() => deleteEvent(ev.id)}
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <EventForm
          date={selectedDate}
          editingEvent={editingEvent}
          onSubmit={(input) => {
            if (editingEvent) {
              updateEvent(editingEvent.id, input)
              setEditingEvent(null)
            } else {
              addEvent(input)
            }
          }}
          onCancelEdit={() => setEditingEvent(null)}
        />
      </div>
    </>
  )
}
