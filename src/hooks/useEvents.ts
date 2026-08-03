import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Event, EventInput } from '../types'

const STORAGE_KEY = 'todo-app:events'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useEvents() {
  const [events, setEvents] = useLocalStorage<Event[]>(STORAGE_KEY, [])

  const addEvent = useCallback(
    (input: EventInput) => {
      const newEvent: Event = {
        id: createId(),
        date: input.date,
        endDate: input.endDate && input.endDate > input.date ? input.endDate : null,
        time: input.time,
        title: input.title.trim(),
        memo: input.memo.trim(),
        createdAt: Date.now(),
      }
      setEvents((prev) => [...prev, newEvent])
    },
    [setEvents],
  )

  const updateEvent = useCallback(
    (id: string, input: EventInput) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                date: input.date,
                endDate: input.endDate && input.endDate > input.date ? input.endDate : null,
                time: input.time,
                title: input.title.trim(),
                memo: input.memo.trim(),
              }
            : e,
        ),
      )
    },
    [setEvents],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    },
    [setEvents],
  )

  return { events, addEvent, updateEvent, deleteEvent }
}
