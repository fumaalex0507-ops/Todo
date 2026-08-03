export type TabKey = 'dashboard' | 'todo' | 'calendar' | 'goals' | 'weight' | 'settings'

export const TABS: { key: TabKey; label: string }[] = [
  { key: 'dashboard', label: 'ダッシュボード' },
  { key: 'todo', label: 'Todo' },
  { key: 'calendar', label: 'カレンダー' },
  { key: 'goals', label: '目標' },
  { key: 'weight', label: '体重管理' },
  { key: 'settings', label: '設定' },
]

export const TAB_ORDER: TabKey[] = TABS.map((t) => t.key)
