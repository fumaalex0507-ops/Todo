import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { mostRecentMonday } from '../lib/date'
import type { Todo, TodoInput } from '../types'

const STORAGE_KEY = 'todo-app:todos'
const LAST_CLEANUP_KEY = 'todo-app:last-completed-cleanup'

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [])
  const [lastCleanup, setLastCleanup] = useLocalStorage<string | null>(LAST_CLEANUP_KEY, null)

  useEffect(() => {
    const monday = mostRecentMonday()
    if (lastCleanup === monday) return
    setTodos((prev) => prev.filter((todo) => !todo.completed))
    setLastCleanup(monday)
  }, [lastCleanup, setTodos, setLastCleanup])

  const addTodo = useCallback(
    (input: TodoInput) => {
      const now = Date.now()
      const newTodo: Todo = {
        id: createId(),
        title: input.title.trim(),
        memo: input.memo.trim(),
        completed: false,
        dueDate: input.dueDate,
        priority: input.priority,
        category: input.category.trim(),
        createdAt: now,
        updatedAt: now,
      }
      setTodos((prev) => [newTodo, ...prev])
    },
    [setTodos],
  )

  const updateTodo = useCallback(
    (id: string, input: TodoInput) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                title: input.title.trim(),
                memo: input.memo.trim(),
                dueDate: input.dueDate,
                priority: input.priority,
                category: input.category.trim(),
                updatedAt: Date.now(),
              }
            : todo,
        ),
      )
    },
    [setTodos],
  )

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    },
    [setTodos],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
            : todo,
        ),
      )
    },
    [setTodos],
  )

  const reorderTodos = useCallback(
    (orderedIds: string[]) => {
      setTodos((prev) =>
        orderedIds.map((id) => prev.find((todo) => todo.id === id)).filter((t): t is Todo => !!t),
      )
    },
    [setTodos],
  )

  return { todos, addTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos }
}
