import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'todo-app:daily-ratings'

export function useDailyRatings() {
  const [ratings, setRatings] = useLocalStorage<Record<string, number>>(STORAGE_KEY, {})

  const setRating = useCallback(
    (date: string, rating: number) => {
      setRatings((prev) => ({ ...prev, [date]: rating }))
    },
    [setRatings],
  )

  return { ratings, setRating }
}
