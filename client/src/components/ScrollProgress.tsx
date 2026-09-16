import { useEffect, useState, useCallback, useRef } from 'react'

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef<number>()

  const updateScrollProgress = useCallback(() => {
    const currentScroll = window.scrollY
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (totalHeight <= 0) {
      setScrollProgress(0)
      return
    }
    
    const progress = Math.min((currentScroll / totalHeight) * 100, 100)
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      
      rafRef.current = requestAnimationFrame(updateScrollProgress)
    }

    // Initial calculation
    updateScrollProgress()
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateScrollProgress, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateScrollProgress)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [updateScrollProgress])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-background/80 backdrop-blur z-50">
      <div 
        className="h-full cosmic-gradient"
        style={{ 
          width: `${scrollProgress}%`,
          transform: `translateZ(0)`, // Force hardware acceleration
          willChange: 'width' // Optimize for width changes
        }}
      />
    </div>
  )
}