import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Location } from '../types'

const STORAGE_KEY = 'todo-app:locations'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useLocations() {
  const [locations, setLocations] = useLocalStorage<Location[]>(STORAGE_KEY, [])

  const addLocation = useCallback(
    (name: string, url: string) => {
      setLocations((prev) => [...prev, { id: createId(), name, url }])
    },
    [setLocations],
  )

  const updateLocation = useCallback(
    (id: string, name: string, url: string) => {
      setLocations((prev) => prev.map((l) => (l.id === id ? { ...l, name, url } : l)))
    },
    [setLocations],
  )

  const removeLocation = useCallback(
    (id: string) => {
      setLocations((prev) => prev.filter((l) => l.id !== id))
    },
    [setLocations],
  )

  return { locations, addLocation, updateLocation, removeLocation }
}
