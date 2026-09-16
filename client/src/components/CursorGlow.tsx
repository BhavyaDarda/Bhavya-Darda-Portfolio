import { useEffect, useRef } from 'react'

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      current.current.x += (pos.current.x - current.current.x) * 0.08
      current.current.y += (pos.current.y - current.current.y) * 0.08
      if (ref.current) {
        ref.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
      style={{
        width: 560,
        height: 560,
        marginLeft: -280,
        marginTop: -280,
        background: 'radial-gradient(circle, hsl(var(--cosmic-primary) / 0.10) 0%, hsl(var(--cosmic-primary) / 0.03) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  )
}
