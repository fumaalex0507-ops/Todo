import { useMemo, useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'
import { FilterBar } from './FilterBar'
import type { SortKey, StatusFilter, Todo } from '../types'

const priorityWeight: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }

export function TodoSection() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
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

  return (
    <>
      <p className="app__subtitle">
        {remainingCount > 0 ? `未完了 ${remainingCount} 件` : 'すべて完了しました 🎉'}
      </p>

      <TodoForm
        editingTodo={editingTodo}
        onSubmit={(input) => {
          if (editingTodo) {
            updateTodo(editingTodo.id, input)
            setEditingTodo(null)
          } else {
            addTodo(input)
          }
        }}
        onCancelEdit={() => setEditingTodo(null)}
      />

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
      />

      <TodoList
        todos={visibleTodos}
        onToggle={toggleComplete}
        onEdit={setEditingTodo}
        onDelete={(id) => {
          deleteTodo(id)
          if (editingTodo?.id === id) setEditingTodo(null)
        }}
      />
    </>
  )
}
