import { useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import { useTheme } from './hooks/useTheme'
import { NavTabs } from './components/NavTabs'
import { TAB_ORDER, type TabKey } from './tabs'
import { DashboardSection } from './components/DashboardSection'
import { TodoSection } from './components/TodoSection'
import { CalendarSection } from './components/CalendarSection'
import { GoalsSection } from './components/GoalsSection'
import { WeightSection } from './components/WeightSection'
import { SettingsSection } from './components/SettingsSection'
import './App.css'

const titleByTab: Record<TabKey, string> = {
  dashboard: 'ダッシュボード',
  todo: 'やることリスト',
  calendar: 'カレンダー',
  goals: '目標管理',
  weight: '体重管理',
  settings: '設定',
}

const SWIPE_THRESHOLD = 60

function App() {
  const [theme, setTheme] = useTheme()
  const [tab, setTab] = useState<TabKey>('dashboard')
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return

    const currentIndex = TAB_ORDER.indexOf(tab)
    if (dx < 0 && currentIndex < TAB_ORDER.length - 1) {
      setTab(TAB_ORDER[currentIndex + 1])
    } else if (dx > 0 && currentIndex > 0) {
      setTab(TAB_ORDER[currentIndex - 1])
    }
  }

  return (
    <div className="app" style={{ '--page-theme': `var(--theme-${tab})` } as CSSProperties}>
      <NavTabs active={tab} onChange={setTab} />

      <header className="app__header">
        <div className="app__title">
          <h1>{titleByTab[tab]}</h1>
        </div>
      </header>

      <main className="app__main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {tab === 'dashboard' && <DashboardSection />}
        {tab === 'todo' && <TodoSection />}
        {tab === 'calendar' && <CalendarSection />}
        {tab === 'goals' && <GoalsSection />}
        {tab === 'weight' && <WeightSection />}
        {tab === 'settings' && <SettingsSection theme={theme} onThemeChange={setTheme} />}
      </main>
    </div>
  )
}

export default App
