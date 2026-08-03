import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Theme } from '../types'

const STORAGE_KEY = 'todo-app:theme'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, 'system')

  useEffect(() => {
    const root = document.documentElement
    const applySystem = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
    }

    if (theme === 'system') {
      applySystem()
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', applySystem)
      return () => media.removeEventListener('change', applySystem)
    }

    root.setAttribute('data-theme', theme)
  }, [theme])

  return [theme, setTheme] as const
}
