import { useState } from 'react'
import type { Goal, GoalPeriod, TextGoal } from '../types'

interface GoalListProps {
  goals: Goal[]
  period: GoalPeriod
  onToggleAchieved: (id: string) => void
  onEdit: (goal: TextGoal) => void
  onDelete: (id: string) => void
  onReorder: (draggedId: string, targetId: string) => void
}

export function GoalList({ goals, period, onToggleAchieved, onEdit, onDelete, onReorder }: GoalListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const filtered = goals.filter(
    (g): g is TextGoal => g.type === 'text' && g.period === period,
  )

  if (filtered.length === 0) {
    return <p className="todo-list__empty">目標はまだありません</p>
  }

  return (
    <ul className="todo-list">
      {filtered.map((goal) => (
        <li
          key={goal.id}
          className={[
            'todo-item',
            goal.achieved ? 'todo-item--done' : '',
            draggedId === goal.id ? 'todo-item--dragging' : '',
            overId === goal.id && draggedId !== goal.id ? 'todo-item--drag-over' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          draggable
          onDragStart={() => setDraggedId(goal.id)}
          onDragOver={(e) => {
            e.preventDefault()
            setOverId(goal.id)
          }}
          onDrop={() => {
            if (draggedId && draggedId !== goal.id) onReorder(draggedId, goal.id)
            setDraggedId(null)
            setOverId(null)
          }}
          onDragEnd={() => {
            setDraggedId(null)
            setOverId(null)
          }}
        >
          <span className="todo-item__handle" aria-hidden="true">⠿</span>

          <label className="todo-item__checkbox">
            <input
              type="checkbox"
              checked={goal.achieved}
              onChange={() => onToggleAchieved(goal.id)}
            />
            <span aria-hidden="true" />
          </label>

          <div className="todo-item__body">
            <p className="todo-item__title">{goal.title}</p>
          </div>

          <div className="todo-item__actions">
            <button type="button" className="todo-item__edit" onClick={() => onEdit(goal)}>
              編集
            </button>

            <button
              type="button"
              className="todo-item__delete"
              aria-label="削除"
              onClick={() => onDelete(goal.id)}
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
