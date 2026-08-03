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
      const id = createId()
      const achieved = false
      const createdAt = Date.now()
      const newGoal: Goal =
        input.type === 'weight'
          ? {
              id,
              achieved,
              createdAt,
              type: 'weight',
              startWeight: input.startWeight,
              startDate: input.startDate,
              targetWeight: input.targetWeight,
              targetDate: input.targetDate,
            }
          : {
              id,
              achieved,
              createdAt,
              type: 'text',
              period: input.period,
              title: input.title.trim(),
            }
      setGoals((prev) => [newGoal, ...prev])
    },
    [setGoals],
  )

  const updateGoal = useCallback(
    (id: string, input: GoalInput) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== id) return g
          if (input.type === 'weight' && g.type === 'weight') {
            return {
              ...g,
              startWeight: input.startWeight,
              startDate: input.startDate,
              targetWeight: input.targetWeight,
              targetDate: input.targetDate,
            }
          }
          if (input.type === 'text' && g.type === 'text') {
            return { ...g, period: input.period, title: input.title.trim() }
          }
          return g
        }),
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

  const reorderGoals = useCallback(
    (orderedIds: string[]) => {
      setGoals((prev) =>
        orderedIds.map((id) => prev.find((g) => g.id === id)).filter((g): g is Goal => !!g),
      )
    },
    [setGoals],
  )

  return { goals, addGoal, updateGoal, deleteGoal, reorderGoals }
}
