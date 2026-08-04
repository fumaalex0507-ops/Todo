import { useMemo, useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useTodoTemplates } from '../hooks/useTodoTemplates'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'
import { FilterBar } from './FilterBar'
import type { SortKey, StatusFilter, Todo } from '../types'

const priorityWeight: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }

export function TodoSection() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos } = useTodos()
  const { templates } = useTodoTemplates()

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')

  const categories = useMemo(() => {
    const set = new Set(todos.map((t) => t.category).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ja'))
  }, [todos])

  const visibleTodos = useMemo(() => {
    let list = todos

    if (statusFilter === 'active') list = list.filter((t) => !t.completed)
    if (statusFilter === 'completed') list = list.filter((t) => t.completed)

    if (categoryFilter !== 'all') {
      list = list.filter((t) => t.category === categoryFilter)
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(query) || t.memo.toLowerCase().includes(query),
      )
    }

    if (sortKey === 'manual') return list

    return [...list].sort((a, b) => {
      if (sortKey === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      }
      if (sortKey === 'priority') {
        return priorityWeight[a.priority] - priorityWeight[b.priority]
      }
      return b.createdAt - a.createdAt
    })
  }, [todos, statusFilter, categoryFilter, searchQuery, sortKey])

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])

  const reorderable = statusFilter === 'all' && categoryFilter === 'all' && !searchQuery.trim()
  const isFormOpen = showForm || editingTodo !== null

  const handleReorder = (draggedId: string, targetId: string) => {
    const ids = todos.map((t) => t.id)
    const fromIndex = ids.indexOf(draggedId)
    const toIndex = ids.indexOf(targetId)
    if (fromIndex === -1 || toIndex === -1) return
    ids.splice(fromIndex, 1)
    ids.splice(ids.indexOf(targetId), 0, draggedId)
    reorderTodos(ids)
    if (sortKey !== 'manual') setSortKey('manual')
  }

  return (
    <>
      <p className="app__subtitle">
        {remainingCount > 0 ? `未完了 ${remainingCount} 件` : 'すべて完了しました 🎉'}
      </p>

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        sortKey={sortKey}
        onSortKeyChange={setSortKey}
        isFormOpen={isFormOpen}
        onToggleForm={() => {
          setShowForm((v) => !v)
          if (editingTodo) setEditingTodo(null)
        }}
      />

      {isFormOpen && (
        <TodoForm
          editingTodo={editingTodo}
          templates={templates}
          onSubmit={(input) => {
            if (editingTodo) {
              updateTodo(editingTodo.id, input)
              setEditingTodo(null)
            } else {
              addTodo(input)
            }
            setShowForm(false)
          }}
          onCancelEdit={() => {
            setEditingTodo(null)
            setShowForm(false)
          }}
        />
      )}

      {!reorderable && (
        <p className="todo-list__hint">絞り込み・検索がない状態でドラッグして並び替えできます</p>
      )}

      <TodoList
        todos={visibleTodos}
        onToggle={toggleComplete}
        onEdit={setEditingTodo}
        onDelete={(id) => {
          deleteTodo(id)
          if (editingTodo?.id === id) setEditingTodo(null)
        }}
        reorderable={reorderable}
        onReorder={handleReorder}
      />
    </>
  )
}
