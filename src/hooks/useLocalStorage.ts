import { useEffect, useState } from 'react'

function readValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : initialValue
  } catch (error) {
    console.warn(`LocalStorageの読み込みに失敗しました (key: ${key})`, error)
    return initialValue
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`LocalStorageの書き込みに失敗しました (key: ${key})`, error)
    }
  }, [key, value])

  return [value, setValue] as const
}
