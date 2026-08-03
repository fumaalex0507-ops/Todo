import { useEffect, useRef, type CSSProperties } from 'react'
import { TABS, type TabKey } from '../tabs'

interface NavTabsProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function NavTabs({ active, onChange }: NavTabsProps) {
  const buttonRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({})

  useEffect(() => {
    buttonRefs.current[active]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [active])

  return (
    <nav className="nav-tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          ref={(el) => {
            buttonRefs.current[t.key] = el
          }}
          type="button"
          className={`nav-tabs__btn ${active === t.key ? 'nav-tabs__btn--active' : ''}`}
          style={{ '--tab-theme': `var(--theme-${t.key})` } as CSSProperties}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
