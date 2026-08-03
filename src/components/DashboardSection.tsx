import { useMemo } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useGoals } from '../hooks/useGoals'
import { useWeightEntries } from '../hooks/useWeightEntries'
import { today } from '../lib/date'
import { WeatherCard } from './WeatherCard'
import { TodoList } from './TodoList'
import { GoalProgressList } from './GoalProgressList'
import { WeightChart } from './WeightChart'
import type { Todo } from '../types'

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
        .filter((g) => g.type === 'weight' && !g.achieved)
        .sort((a, b) => b.createdAt - a.createdAt)[0],
    [goals],
  )

  return (
    <>
      <p className="app__subtitle">今日のやること・目標をまとめて確認できます</p>

      <WeatherCard />

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">今日のTodo</h2>
        <TodoList todos={todayTodos} onToggle={toggleComplete} onDelete={deleteTodo} />
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">体重推移</h2>
        <WeightChart
          entries={entries}
          targetWeight={activeWeightGoal?.type === 'weight' ? activeWeightGoal.targetWeight : null}
        />
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">週間目標</h2>
        <GoalProgressList
          goals={goals}
          period="weekly"
          weightEntries={entries}
          onToggleAchieved={toggleAchieved}
        />
      </div>

      <div className="dashboard-card">
        <h2 className="dashboard-card__title">月間目標</h2>
        <GoalProgressList
          goals={goals}
          period="monthly"
          weightEntries={entries}
          onToggleAchieved={toggleAchieved}
        />
      </div>
    </>
  )
}
