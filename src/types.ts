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

interface GoalBase {
  id: string
  period: GoalPeriod
  achieved: boolean
  createdAt: number
}

export interface WeightGoal extends GoalBase {
  type: 'weight'
  targetWeight: number
  targetDate: string | null
}

export interface TextGoal extends GoalBase {
  type: 'text'
  title: string
}

export type Goal = WeightGoal | TextGoal

export interface WeightGoalInput {
  type: 'weight'
  period: GoalPeriod
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
