import { useMemo, useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { useTheme } from './hooks/useTheme'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { FilterBar } from './components/FilterBar'
import { ThemeToggle } from './components/ThemeToggle'
import type { SortKey, StatusFilter, Todo } from './types'
import './App.css'

const priorityWeight: Record<Todo['priority'], number> = { high: 0, medium: 1, low: 2 }

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos()
  const [theme, setTheme] = useTheme()

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

    const sorted = [...list].sort((a, b) => {
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

    return sorted
  }, [todos, statusFilter, categoryFilter, searchQuery, sortKey])

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title">
          <h1>やることリスト</h1>
          <p className="app__subtitle">
            {remainingCount > 0 ? `未完了 ${remainingCount} 件` : 'すべて完了しました 🎉'}
          </p>
        </div>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>

      <main className="app__main">
        <TodoForm
          categories={categories}
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
      </main>
    </div>
  )
}

export default App
