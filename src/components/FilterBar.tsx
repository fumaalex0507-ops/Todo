import type { StatusFilter, SortKey } from '../types'

interface FilterBarProps {
  statusFilter: StatusFilter
  onStatusFilterChange: (value: StatusFilter) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: string[]
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  sortKey: SortKey
  onSortKeyChange: (value: SortKey) => void
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
]

export function FilterBar({
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  searchQuery,
  onSearchQueryChange,
  sortKey,
  onSortKeyChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__status">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`chip ${statusFilter === opt.value ? 'chip--active' : ''}`}
            onClick={() => onStatusFilterChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="filter-bar__controls">
        <input
          type="search"
          className="filter-bar__search"
          placeholder="検索…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />

        <select
          className="filter-bar__select"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="all">全カテゴリ</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="filter-bar__select"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
        >
          <option value="createdAt">追加順</option>
          <option value="dueDate">期限日順</option>
          <option value="priority">優先度順</option>
        </select>
      </div>
    </div>
  )
}
