import { categoryColorStyle } from '../lib/categoryColor'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit?: (todo: Todo) => void
  onDelete: (id: string) => void
  draggable?: boolean
  isDragging?: boolean
  isDragOver?: boolean
  onDragStart?: () => void
  onDragOver?: () => void
  onDrop?: () => void
  onDragEnd?: () => void
}

const priorityLabel: Record<Todo['priority'], string> = {
  high: '高',
  medium: '中',
  low: '低',
}

function formatDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function isOverdue(dueDate: string | null, completed: boolean) {
  if (!dueDate || completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${dueDate}T00:00:00`) < today
}

export function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  draggable,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TodoItemProps) {
  const overdue = isOverdue(todo.dueDate, todo.completed)

  return (
    <li
      className={[
        'todo-item',
        todo.completed ? 'todo-item--done' : '',
        isDragging ? 'todo-item--dragging' : '',
        isDragOver ? 'todo-item--drag-over' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onDragOver={
        draggable
          ? (e) => {
              e.preventDefault()
              onDragOver?.()
            }
          : undefined
      }
      onDrop={draggable ? onDrop : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
    >
      {draggable && <span className="todo-item__handle" aria-hidden="true">⠿</span>}

      <label className="todo-item__checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span aria-hidden="true" />
      </label>

      <div
        className={`todo-item__body ${onEdit ? '' : 'todo-item__body--static'}`}
        onClick={onEdit ? () => onEdit(todo) : undefined}
      >
        <div className="todo-item__meta">
          <span className={`badge badge--priority-${todo.priority}`}>
            {priorityLabel[todo.priority]}
          </span>
          {todo.category && (
            <span className="badge badge--category" style={categoryColorStyle(todo.category)}>
              {todo.category}
            </span>
          )}
          {todo.dueDate && (
            <span className={`badge badge--due ${overdue ? 'badge--overdue' : ''}`}>
              {overdue ? '期限切れ ' : ''}
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
        <p className="todo-item__title">{todo.title}</p>
        {todo.memo && <p className="todo-item__memo">{todo.memo}</p>}
      </div>

      <button
        type="button"
        className="todo-item__delete"
        aria-label="削除"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </li>
  )
}
