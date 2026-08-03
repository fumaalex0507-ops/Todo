import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { ThemeToggle } from './components/ThemeToggle'
import { NavTabs, type TabKey } from './components/NavTabs'
import { TodoSection } from './components/TodoSection'
import { GoalsSection } from './components/GoalsSection'
import { WeightSection } from './components/WeightSection'
import './App.css'

const titleByTab: Record<TabKey, string> = {
  todo: 'やることリスト',
  goals: '目標管理',
  weight: '体重管理',
}

function App() {
  const [theme, setTheme] = useTheme()
  const [tab, setTab] = useState<TabKey>('todo')

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title">
          <h1>{titleByTab[tab]}</h1>
        </div>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>

      <NavTabs active={tab} onChange={setTab} />

      <main className="app__main">
        {tab === 'todo' && <TodoSection />}
        {tab === 'goals' && <GoalsSection />}
        {tab === 'weight' && <WeightSection />}
      </main>
    </div>
  )
}

export default App
