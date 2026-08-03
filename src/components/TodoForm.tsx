import { useEffect, useState } from 'react'
import { categoryColorStyle } from '../lib/categoryColor'
import { today } from '../lib/date'
import { CATEGORY_PRESETS } from '../types'
import type { Priority, Todo, TodoInput } from '../types'

interface TodoFormProps {
  editingTodo: Todo | null
  onSubmit: (input: TodoInput) => void
  onCancelEdit: () => void
}

function createEmptyForm(): TodoInput {
  return {
    title: '',
    memo: '',
    dueDate: today(),
    priority: 'medium',
    category: '',
  }
}

export function TodoForm({ editingTodo, onSubmit, onCancelEdit }: TodoFormProps) {
  const [form, setForm] = useState<TodoInput>(createEmptyForm)

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title,
        memo: editingTodo.memo,
        dueDate: editingTodo.dueDate,
        priority: editingTodo.priority,
        category: editingTodo.category,
      })
    } else {
      setForm(createEmptyForm())
    }
  }, [editingTodo])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.title.trim()) return
    onSubmit(form)
    if (!editingTodo) setForm(createEmptyForm())
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-form__row">
        <input
          className="todo-form__title"
          type="text"
          placeholder="やることを入力…"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <button type="submit" className="btn btn--primary">
          {editingTodo ? '更新' : '追加'}
        </button>
        {editingTodo && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            キャンセル
          </button>
        )}
      </div>

      <div className="todo-form__row todo-form__row--details">
        <label className="todo-form__field">
          <span>期限日</span>
          <input
            type="date"
            value={form.dueDate ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, dueDate: e.target.value || null }))
            }
          />
        </label>

        <label className="todo-form__field">
          <span>優先度</span>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm((f) => ({ ...f, priority: e.target.value as Priority }))
            }
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </label>
      </div>

      <div className="todo-form__field">
        <span>カテゴリ</span>
        <div className="todo-form__category-chips">
          {CATEGORY_PRESETS.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip chip--category ${form.category === c ? 'chip--active' : ''}`}
              style={categoryColorStyle(c)}
              onClick={() => setForm((f) => ({ ...f, category: c }))}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <label className="todo-form__field todo-form__field--memo">
        <span>メモ</span>
        <textarea
          placeholder="詳細メモ(任意)"
          value={form.memo}
          onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
          rows={2}
        />
      </label>
    </form>
  )
}
