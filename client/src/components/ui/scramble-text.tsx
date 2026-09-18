import { useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#'
const SCRAMBLE_INTERVAL_MS = 42

interface ScrambleTextProps {
  text: string
  className?: string
  as?: 'span' | 'div'
}

export function ScrambleText({ text, className, as = 'span' }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  const scramble = useCallback(() => {
    const el = ref.current
    if (!el) return
    let iteration = 0
    if (frame.current) window.clearInterval(frame.current)

    frame.current = window.setInterval(() => {
      el.textContent = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' '
          if (index < iteration) return text[index]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (iteration >= text.length) {
        if (frame.current) window.clearInterval(frame.current)
        el.textContent = text
      }
      iteration += 1 / 2
    }, SCRAMBLE_INTERVAL_MS)
  }, [text])

  const reset = useCallback(() => {
    if (frame.current) window.clearInterval(frame.current)
    if (ref.current) ref.current.textContent = text
  }, [text])

  const Tag = as
  return (
    <Tag
      ref={ref as any}
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {text}
    </Tag>
  )
}
