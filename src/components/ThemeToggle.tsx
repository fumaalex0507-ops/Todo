import type { Theme } from '../types'

interface ThemeToggleProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

const order: Theme[] = ['system', 'light', 'dark']
const icon: Record<Theme, string> = { system: '🖥️', light: '☀️', dark: '🌙' }
const label: Record<Theme, string> = { system: '端末設定', light: 'ライト', dark: 'ダーク' }

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const handleClick = () => {
    const next = order[(order.indexOf(theme) + 1) % order.length]
    onChange(next)
  }

  return (
    <button type="button" className="theme-toggle" onClick={handleClick} title={label[theme]}>
      <span aria-hidden="true">{icon[theme]}</span>
      <span className="theme-toggle__label">{label[theme]}</span>
    </button>
  )
}
