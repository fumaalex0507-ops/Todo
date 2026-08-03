import { useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useGoals } from '../hooks/useGoals'
import { useWeightEntries } from '../hooks/useWeightEntries'
import { today } from '../lib/date'
import { computeDateProgress, computeWeightProgress } from '../lib/goalProgress'
import { WeatherCard } from './WeatherCard'
import { TodoList } from './TodoList'
import { GoalProgressList } from './GoalProgressList'
import { WeightChart } from './WeightChart'
import { DualProgressBars } from './DualProgressBars'
import type { Todo, WeightGoal } from '../types'

const priorityWeight: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }

export function DashboardSection() {
  const { todos, toggleComplete, deleteTodo } = useTodos()
  const { goals, toggleAchieved } = useGoals()
  const { entries } = useWeightEntries()

  const todayTodos = useMemo(() => {
    const t = today()
    return todos
      .filter((todo) => todo.dueDate === t)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1
        return priorityWeight[a.priority] - priorityWeight[b.priority]
      })
  }, [todos])

  const activeWeightGoal = useMemo(
    () =>
      goals
        .filter((g): g is WeightGoal => g.type === 'weight' && !g.achieved)
        .sort((a, b) => b.createdAt - a.createdAt)[0],
    [goals],
  )

  const weightProgress = useMemo(
    () => (activeWeightGoal ? computeWeightProgress(activeWeightGoal, entries) : null),
    [activeWeightGoal, entries],
  )

  const dateProgress = useMemo(
    () => (activeWeightGoal ? computeDateProgress(activeWeightGoal) : 0),
    [activeWeightGoal],
  )

  return (
    <>
      <p className="app__subtitle">今日のやること・目標をまとめて確認できます</p>

      <div className="dashboard-card dashboard-card--goal">
        <h2 className="dashboard-card__title">🎯 月間目標</h2>
        <GoalProgressList goals={goals} period="monthly" onToggleAchieved={toggleAchieved} />
      </div>

      <div className="dashboard-card dashboard-card--goal">
        <h2 className="dashboard-card__title">🎯 週間目標</h2>
        <GoalProgressList goals={goals} period="weekly" onToggleAchieved={toggleAchieved} />
      </div>

      <WeatherCard />

      <div className="dashboard-card dashboard-card--todo">
        <h2 className="dashboard-card__title">✅ 今日のTodo</h2>
        <TodoList todos={todayTodos} onToggle={toggleComplete} onDelete={deleteTodo} />
      </div>

      <div className="dashboard-card dashboard-card--weight">
        <h2 className="dashboard-card__title">⚖️ 体重推移</h2>
        {activeWeightGoal && weightProgress && (
          <div className="goal-progress-item__body goal-progress-item__body--standalone">
            <p className="goal-progress-item__title">
              目標体重 {activeWeightGoal.targetWeight}kg({activeWeightGoal.startDate}〜{activeWeightGoal.targetDate})
            </p>
            <DualProgressBars weightPercent={weightProgress.percent} datePercent={dateProgress} />
            <p className="goal-progress-item__detail">
              開始 {weightProgress.baseline}kg
              {weightProgress.current != null ? ` → 現在 ${weightProgress.current}kg` : ''}
            </p>
          </div>
        )}
        <WeightChart entries={entries} targetWeight={activeWeightGoal?.targetWeight ?? null} />
      </div>
    </>
  )
}
