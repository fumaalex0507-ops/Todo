import { useState } from 'react'
import type { Todo } from '../types'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onEdit?: (todo: Todo) => void
  onDelete: (id: string) => void
  reorderable?: boolean
  onReorder?: (draggedId: string, targetId: string) => void
}

export function TodoList({ todos, onToggle, onEdit, onDelete, reorderable, onReorder }: TodoListProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  if (todos.length === 0) {
    return <p className="todo-list__empty">タスクはありません</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          draggable={reorderable}
          isDragging={draggedId === todo.id}
          isDragOver={overId === todo.id && draggedId !== todo.id}
          onDragStart={() => setDraggedId(todo.id)}
          onDragOver={() => setOverId(todo.id)}
          onDrop={() => {
            if (draggedId && draggedId !== todo.id) onReorder?.(draggedId, todo.id)
            setDraggedId(null)
            setOverId(null)
          }}
          onDragEnd={() => {
            setDraggedId(null)
            setOverId(null)
          }}
        />
      ))}
    </ul>
  )
}
