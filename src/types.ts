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

export const CATEGORY_PRESETS = ['運動', '勉強', '仕事', '生活', 'その他'] as const

export type GoalPeriod = 'weekly' | 'monthly'

export interface WeightGoal {
  id: string
  achieved: boolean
  createdAt: number
  type: 'weight'
  startWeight: number
  startDate: string
  targetWeight: number
  targetDate: string | null
}

export interface TextGoal {
  id: string
  achieved: boolean
  createdAt: number
  type: 'text'
  period: GoalPeriod
  title: string
}

export type Goal = WeightGoal | TextGoal

export interface WeightGoalInput {
  type: 'weight'
  startWeight: number
  startDate: string
  targetWeight: number
  targetDate: string | null
}

export interface TextGoalInput {
  type: 'text'
  period: GoalPeriod
  title: string
}

export type GoalInput = WeightGoalInput | TextGoalInput

export interface WeightEntry {
  id: string
  date: string
  weight: number
  createdAt: number
}

export interface Location {
  id: string
  name: string
  url: string
}

export interface Event {
  id: string
  date: string
  time: string | null
  title: string
  memo: string
  createdAt: number
}

export interface EventInput {
  date: string
  time: string | null
  title: string
  memo: string
}
