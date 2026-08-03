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
