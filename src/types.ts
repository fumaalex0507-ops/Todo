export type Priority = 'high' | 'medium' | 'low'

export type StatusFilter = 'all' | 'active' | 'completed'

export type SortKey = 'dueDate' | 'priority' | 'createdAt'

export interface Todo {
  id: string
  title: string
  memo: string
  completed: boolean
  dueDate: string | null
  priority: Priority
  category: string
  createdAt: number
  updatedAt: number
}

export interface TodoInput {
  title: string
  memo: string
  dueDate: string | null
  priority: Priority
  category: string
}

export type Theme = 'light' | 'dark' | 'system'
