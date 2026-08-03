import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Goal, GoalInput } from '../types'

const STORAGE_KEY = 'todo-app:goals'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useGoals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>(STORAGE_KEY, [])

  const addGoal = useCallback(
    (input: GoalInput) => {
      const base = {
        id: createId(),
        period: input.period,
        achieved: false,
        createdAt: Date.now(),
      }
      const newGoal: Goal =
        input.type === 'weight'
          ? {
              ...base,
              type: 'weight',
              targetWeight: input.targetWeight,
              targetDate: input.targetDate,
            }
          : { ...base, type: 'text', title: input.title.trim() }
      setGoals((prev) => [newGoal, ...prev])
    },
    [setGoals],
  )

  const toggleAchieved = useCallback(
    (id: string) => {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, achieved: !g.achieved } : g)),
      )
    },
    [setGoals],
  )

  const deleteGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id))
    },
    [setGoals],
  )

  return { goals, addGoal, toggleAchieved, deleteGoal }
}
