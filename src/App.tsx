import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { NavTabs, type TabKey } from './components/NavTabs'
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

function App() {
  const [theme, setTheme] = useTheme()
  const [tab, setTab] = useState<TabKey>('dashboard')

  return (
    <div className="app">
      <NavTabs active={tab} onChange={setTab} />

      <header className="app__header">
        <div className="app__title">
          <h1>{titleByTab[tab]}</h1>
        </div>
      </header>

      <main className="app__main">
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
