import { useState, useEffect } from 'react'

export function VerticalNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

  const navItems = [
    { id: 'hero',     index: '00', label: 'Home' },
    { id: 'about',    index: '01', label: 'About' },
    { id: 'skills',   index: '02', label: 'Skills' },
    { id: 'timeline', index: '03', label: 'Timeline' },
    { id: 'projects', index: '04', label: 'Projects' },
    { id: 'contact',  index: '06', label: 'Contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      if (aboutSection) {
        const aboutTop = aboutSection.offsetTop
        setIsVisible(window.scrollY >= aboutTop - 100)
      }

      const sections = navItems.map(item => item.id)
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 150 && rect.bottom >= 150
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const activeIndex = navItems.findIndex(item => item.id === activeSection)

  return (
    <nav className={`
      fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block
      transition-all duration-500 ease-in-out pointer-events-none
      ${isVisible ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-4'}
    `}>
      <div className="relative flex flex-col items-end gap-4 pr-4">
        {/* Vertical track line with moving indicator */}
        <div className="absolute right-1 top-0 bottom-0 w-px bg-white/[0.10]">
          <div
            className="absolute w-px bg-cosmic-primary transition-all duration-500 ease-out"
            style={{
              top: `${(activeIndex / (navItems.length - 1)) * 100}%`,
              height: `${100 / navItems.length}%`,
            }}
          />
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="group relative flex items-center gap-3"
              title={item.label}
            >
              <span
                className={`mono-label text-[10px] transition-all duration-300 whitespace-nowrap
                  ${isActive ? 'text-cosmic-primary opacity-100 translate-x-0' : 'text-white/40 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}
              >
                {item.index} — {item.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 shrink-0
                  ${isActive ? 'w-2.5 h-2.5 bg-cosmic-primary shadow-[0_0_10px_hsl(var(--cosmic-primary))]' : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-cosmic-primary/70 group-hover:scale-125'}`}
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
