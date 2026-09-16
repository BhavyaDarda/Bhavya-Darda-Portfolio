import { useCallback, useRef } from 'react'

export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }, [strength])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
