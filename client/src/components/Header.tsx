import { useState, useEffect } from 'react'
import { MobileNav } from './MobileNav'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useMagnetic } from '@/hooks/use-magnetic'
import bdLogo from '@assets/BD_(1)_1784202143032.png'

const navLinks = [
  { href: '#about',        label: 'About',        index: '01' },
  { href: '#skills',       label: 'Skills',       index: '02' },
  { href: '#timeline',     label: 'Timeline',     index: '03' },
  { href: '#projects',     label: 'Projects',     index: '04' },
  { href: '#testimonials', label: 'Achievements', index: '05' },
  { href: '#contact',      label: 'Contact',      index: '06' },
]

function MagneticLogo() {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.2)
  return (
    <a
      href="#hero"
      ref={ref as any}
      onMouseMove={onMouseMove as any}
      onMouseLeave={onMouseLeave}
      className="group relative flex items-center"
      aria-label="Bhavya Darda — home"
    >
      <div className="h-9 w-20 overflow-hidden flex items-center justify-center flex-shrink-0">
        <img
          src={bdLogo}
          alt="BD logo"
          className="h-9 w-9 object-contain flex-shrink-0 border-t-[0px] border-r-[0px] border-b-[0px] border-l-[0px] rounded-tl-[0px] rounded-tr-[0px] rounded-br-[0px] rounded-bl-[0px] mt-[10px] mb-[0px] ml-[0px] mr-[10px] pt-[0px] pb-[0px] pl-[0px] pr-[0px]"
          style={{
            mixBlendMode: 'screen',
            filter: 'brightness(7) contrast(1.1) saturate(0.35)',
            transform: 'scale(3.3)',
            transformOrigin: '47% 50%',
          }}
        />
      </div>
    </a>
  );
}

export function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about')
      const threshold = aboutSection
        ? aboutSection.offsetTop - 80
        : window.innerHeight * 0.85
      setIsVisible(window.scrollY < threshold)
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4
        transition-all duration-500 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
    >
      <div className="w-full max-w-5xl">
        <nav
          className={`relative flex items-center justify-between px-5 py-3 rounded-full border transition-all duration-500
            ${scrolled
              ? 'border-white/[0.12] bg-black/55 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'border-white/[0.06] bg-black/20 backdrop-blur-sm'}`}
        >
          <MagneticLogo />

          {/* Desktop nav — numbered editorial links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, index }) => (
              <a
                key={href}
                href={href}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/[0.06] transition-colors duration-300"
              >
                <span className="mono-label text-cosmic-primary/40 group-hover:text-cosmic-primary transition-colors duration-300 text-[10px]">
                  {index}
                </span>
                <ScrambleText
                  text={label}
                  className="text-sm text-white/60 group-hover:text-white transition-colors duration-300"
                />
                <span className="absolute bottom-0.5 left-3 right-3 h-px bg-cosmic-primary/70 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center">
            <MobileNav />
          </div>
        </nav>
      </div>
    </header>
  )
}
