import type { WeightEntry, WeightGoal } from '../types'

export interface WeightProgress {
  percent: number
  current: number | null
  baseline: number | null
}

export function computeWeightProgress(goal: WeightGoal, entries: WeightEntry[]): WeightProgress {
  if (entries.length === 0) return { percent: 0, current: null, baseline: null }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const goalDate = new Date(goal.createdAt).toISOString().slice(0, 10)
  const baselineEntry = sorted.find((e) => e.date >= goalDate) ?? sorted[0]
  const baseline = baselineEntry.weight
  const current = sorted[sorted.length - 1].weight
  const target = goal.targetWeight

  if (baseline === target) {
    return { percent: current === target ? 100 : 0, current, baseline }
  }

  const totalDistance = target - baseline
  const progressDistance = current - baseline
  const percent = Math.max(0, Math.min(100, (progressDistance / totalDistance) * 100))

  return { percent, current, baseline }
}
