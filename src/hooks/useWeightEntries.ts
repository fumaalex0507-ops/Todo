import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { WeightEntry } from '../types'

const STORAGE_KEY = 'todo-app:weight-entries'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useWeightEntries() {
  const [entries, setEntries] = useLocalStorage<WeightEntry[]>(STORAGE_KEY, [])

  const addEntry = useCallback(
    (date: string, weight: number) => {
      setEntries((prev) => {
        const withoutSameDate = prev.filter((e) => e.date !== date)
        const newEntry: WeightEntry = { id: createId(), date, weight, createdAt: Date.now() }
        return [...withoutSameDate, newEntry].sort((a, b) => a.date.localeCompare(b.date))
      })
    },
    [setEntries],
  )

  const deleteEntry = useCallback(
    (id: string) => {
      setEntries((prev) => prev.filter((e) => e.id !== id))
    },
    [setEntries],
  )

  return { entries, addEntry, deleteEntry }
}
