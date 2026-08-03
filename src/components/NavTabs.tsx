export type TabKey = 'dashboard' | 'todo' | 'goals' | 'weight' | 'settings'

interface NavTabsProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const tabs: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: 'ダッシュボード' },
  { key: 'todo', label: 'Todo' },
  { key: 'goals', label: '目標' },
  { key: 'weight', label: '体重管理' },
  { key: 'settings', label: '設定' },
]

export function NavTabs({ active, onChange }: NavTabsProps) {
  return (
    <nav className="nav-tabs">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          className={`nav-tabs__btn ${active === t.key ? 'nav-tabs__btn--active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
