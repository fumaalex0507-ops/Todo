import { today } from './date'
import type { WeightEntry, WeightGoal } from '../types'

export interface WeightProgress {
  percent: number
  current: number | null
  baseline: number
}

export function computeWeightProgress(goal: WeightGoal, entries: WeightEntry[]): WeightProgress {
  const baseline = goal.startWeight
  const target = goal.targetWeight

  if (entries.length === 0) return { percent: 0, current: null, baseline }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const current = sorted[sorted.length - 1].weight

  if (baseline === target) {
    return { percent: current === target ? 100 : 0, current, baseline }
  }

  const totalDistance = target - baseline
  const progressDistance = current - baseline
  const percent = Math.max(0, Math.min(100, (progressDistance / totalDistance) * 100))

  return { percent, current, baseline }
}

export function computeDateProgress(goal: WeightGoal): number {
  if (!goal.targetDate) return 0

  const start = new Date(`${goal.startDate}T00:00:00`).getTime()
  const target = new Date(`${goal.targetDate}T00:00:00`).getTime()
  const now = new Date(`${today()}T00:00:00`).getTime()

  if (target === start) return now >= target ? 100 : 0

  const percent = ((now - start) / (target - start)) * 100
  return Math.max(0, Math.min(100, percent))
}
