import { useEffect, useMemo, useRef, useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useEvents } from '../hooks/useEvents'
import { useDailyRatings } from '../hooks/useDailyRatings'
import { today, toDateStr } from '../lib/date'
import { fetchHolidays } from '../lib/holidays'
import { eventColorStyle } from '../lib/eventColor'
import { TodoList } from './TodoList'
import { EventForm } from './EventForm'
import { StarRating } from './StarRating'
import type { Event } from '../types'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

interface DayCell {
  dateStr: string
  day: number
  inMonth: boolean
  weekday: number
}

interface EventBar {
  event: Event
  startCol: number
  endCol: number
  continuesFromPrev: boolean
  continuesToNext: boolean
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

function chunkIntoWeeks(cells: DayCell[]): DayCell[][] {
  const weeks: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

function computeWeekBars(week: DayCell[], events: Event[]): EventBar[] {
  const weekStart = week[0].dateStr
  const weekEnd = week[6].dateStr

  return events
    .filter((e) => e.date <= weekEnd && (e.endDate ?? e.date) >= weekStart)
    .map((e) => {
      const end = e.endDate ?? e.date
      const startCol = e.date <= weekStart ? 0 : week.findIndex((c) => c.dateStr === e.date)
      const endCol = end >= weekEnd ? 6 : week.findIndex((c) => c.dateStr === end)
      return {
        event: e,
        startCol,
        endCol,
        continuesFromPrev: e.date < weekStart,
        continuesToNext: end > weekEnd,
      }
    })
    .sort(
      (a, b) =>
        a.event.date.localeCompare(b.event.date) ||
        (a.event.time ?? '').localeCompare(b.event.time ?? ''),
    )
}

export function CalendarSection() {
  const { todos, toggleComplete, deleteTodo } = useTodos()
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()
  const { ratings, setRating } = useDailyRatings()

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

  const weeks = useMemo(
    () => chunkIntoWeeks(buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth())),
    [viewDate],
  )

  const selectedTodos = useMemo(
    () => todos.filter((t) => t.dueDate === selectedDate),
    [todos, selectedDate],
  )

  const selectedEvents = useMemo(
    () =>
      events
        .filter((e) => selectedDate >= e.date && selectedDate <= (e.endDate ?? e.date))
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

        <div className="calendar-weeks">
          {weeks.map((week) => {
            const bars = computeWeekBars(week, events)
            const todayCell = week.find((c) => c.dateStr === today())
            return (
              <div key={week[0].dateStr} className="calendar-week">
                {week.map((cell) => {
                  const holidayName = holidays[cell.dateStr]
                  return (
                    <button
                      key={cell.dateStr}
                      type="button"
                      title={holidayName}
                      style={{ gridColumn: cell.weekday + 1, gridRow: 1 }}
                      className={[
                        'calendar-day',
                        cell.weekday === 0 || holidayName ? 'calendar-day--sun' : '',
                        cell.weekday === 6 ? 'calendar-day--sat' : '',
                        !cell.inMonth ? 'calendar-day--muted' : '',
                        cell.dateStr === selectedDate ? 'calendar-day--selected' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => setSelectedDate(cell.dateStr)}
                    >
                      <span className="calendar-day__num">{cell.day}</span>
                      {ratings[cell.dateStr] > 0 && (
                        <span className="calendar-day__rating">
                          {'★'.repeat(ratings[cell.dateStr])}
                        </span>
                      )}
                    </button>
                  )
                })}

                {bars.map((bar, i) => (
                  <div
                    key={bar.event.id}
                    className={[
                      'calendar-event-bar',
                      bar.continuesFromPrev ? 'calendar-event-bar--open-start' : '',
                      bar.continuesToNext ? 'calendar-event-bar--open-end' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{
                      gridColumn: `${bar.startCol + 1} / ${bar.endCol + 2}`,
                      gridRow: i + 2,
                      ...eventColorStyle(bar.event.id),
                    }}
                    onClick={() => setSelectedDate(bar.event.date)}
                  >
                    {bar.event.time ? `${bar.event.time} ` : ''}
                    {bar.event.title}
                  </div>
                ))}

                {todayCell && (
                  <div
                    className="calendar-day__today-outline"
                    style={{
                      gridColumn: todayCell.weekday + 1,
                      gridRow: `1 / ${bars.length + 2}`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__title-row">
          <h2 className="dashboard-card__title">{selectedDate} の予定・Todo</h2>
          <StarRating value={ratings[selectedDate] ?? 0} onChange={(n) => setRating(selectedDate, n)} />
        </div>

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
                <span className="calendar-dot calendar-dot--event" style={eventColorStyle(ev.id)} />
                <div className="calendar-event-row__info">
                  {ev.endDate && (
                    <span className="calendar-event-row__range">
                      {ev.date}〜{ev.endDate}
                    </span>
                  )}
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
