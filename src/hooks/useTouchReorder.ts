import { useCallback, useEffect, useRef, useState } from 'react'

export function useTouchReorder(onReorder: (draggedId: string, targetId: string) => void) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const containerRef = useRef<HTMLUListElement | null>(null)
  const draggingRef = useRef<string | null>(null)
  const overRef = useRef<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMove = (e: TouchEvent) => {
      if (!draggingRef.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const target = document.elementFromPoint(touch.clientX, touch.clientY)
      const li = target instanceof Element ? target.closest<HTMLElement>('[data-drag-id]') : null
      const id = li?.dataset.dragId ?? null
      if (id !== overRef.current) {
        overRef.current = id
        setOverId(id)
      }
    }

    const handleEnd = () => {
      if (draggingRef.current && overRef.current && draggingRef.current !== overRef.current) {
        onReorder(draggingRef.current, overRef.current)
      }
      draggingRef.current = null
      overRef.current = null
      setDraggedId(null)
      setOverId(null)
    }

    el.addEventListener('touchmove', handleMove, { passive: false })
    el.addEventListener('touchend', handleEnd)
    el.addEventListener('touchcancel', handleEnd)
    return () => {
      el.removeEventListener('touchmove', handleMove)
      el.removeEventListener('touchend', handleEnd)
      el.removeEventListener('touchcancel', handleEnd)
    }
  }, [onReorder])

  const startTouch = useCallback((id: string) => {
    draggingRef.current = id
    overRef.current = id
    setDraggedId(id)
  }, [])

  return { containerRef, draggedId, overId, startTouch, setDraggedId, setOverId }
}
