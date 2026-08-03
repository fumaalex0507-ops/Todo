import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { TodoTemplate } from '../types'

const STORAGE_KEY = 'todo-app:todo-templates'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useTodoTemplates() {
  const [templates, setTemplates] = useLocalStorage<TodoTemplate[]>(STORAGE_KEY, [])

  const addTemplate = useCallback(
    (title: string) => {
      setTemplates((prev) => [...prev, { id: createId(), title: title.trim() }])
    },
    [setTemplates],
  )

  const deleteTemplate = useCallback(
    (id: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    },
    [setTemplates],
  )

  return { templates, addTemplate, deleteTemplate }
}
