export type TabKey = 'dashboard' | 'todo' | 'calendar' | 'goals' | 'weight' | 'settings'

interface NavTabsProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'ダッシュボード', icon: '📊' },
  { key: 'todo', label: 'Todo', icon: '✅' },
  { key: 'calendar', label: 'カレンダー', icon: '📅' },
  { key: 'goals', label: '目標', icon: '🎯' },
  { key: 'weight', label: '体重管理', icon: '⚖️' },
  { key: 'settings', label: '設定', icon: '⚙️' },
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
          <span aria-hidden="true">{t.icon}</span> {t.label}
        </button>
      ))}
    </nav>
  )
}
