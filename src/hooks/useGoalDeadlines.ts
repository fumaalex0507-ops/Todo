import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { GoalPeriod } from '../types'

const STORAGE_KEY = 'todo-app:goal-deadlines'

interface GoalDeadlines {
  weekly: string | null
  monthly: string | null
}

export function useGoalDeadlines() {
  const [deadlines, setDeadlines] = useLocalStorage<GoalDeadlines>(STORAGE_KEY, {
    weekly: null,
    monthly: null,
  })

  const setDeadline = useCallback(
    (period: GoalPeriod, date: string | null) => {
      setDeadlines((prev) => ({ ...prev, [period]: date }))
    },
    [setDeadlines],
  )

  return { deadlines, setDeadline }
}
