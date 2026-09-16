import { useEffect, useRef } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'
import bdLogo from '@assets/BD_(1)_1784202143032.png'

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1;   }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0);    }
  to   { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1);   filter: drop-shadow(0 0 5px  hsl(var(--cosmic-primary) / 0.5)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px hsl(var(--cosmic-primary) / 0.8)); }
  30%      { transform: scale(1);   }
}

.animate-footer-breathe      { animation: footer-breathe       8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 40s linear infinite; }
.animate-footer-heartbeat     { animation: footer-heartbeat     2s cubic-bezier(0.25, 1, 0.5, 1) infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right,  color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    hsl(var(--cosmic-primary) / 0.15) 0%,
    hsl(var(--cosmic-secondary) / 0.15) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, color-mix(in oklch, #ffffff 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px hsl(var(--cosmic-glow) / 0.3));
}
`

type MagneticProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType
  }

function MagneticButton({ className, children, as: Component = 'button', ...props }: MagneticProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(el, { x: x * 0.4, y: y * 0.4, rotationX: -y * 0.15, rotationY: x * 0.15, scale: 1.05, ease: 'power2.out', duration: 0.4 })
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: 'elastic.out(1,0.3)', duration: 1.2 })
    }

    el.addEventListener('mousemove', onMove as EventListener)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove as EventListener)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <Component
      ref={ref}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </Component>
  )
}

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Full-Stack Development</span> <span className="text-cosmic-primary/60">✦</span>
    <span>AI Solutions</span> <span className="text-cosmic-secondary/60">✦</span>
    <span>React &amp; TypeScript</span> <span className="text-cosmic-primary/60">✦</span>
    <span>Node.js Backend</span> <span className="text-cosmic-secondary/60">✦</span>
    <span>Machine Learning</span> <span className="text-cosmic-primary/60">✦</span>
    <span>Open to Opportunities</span> <span className="text-cosmic-secondary/60">✦</span>
  </div>
)

const socialLinks = [
  { icon: Github,   href: 'https://github.com/BhavyaDarda',               label: 'GitHub'   },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/bhavya-darda5090', label: 'LinkedIn' },
  { icon: Mail,     href: 'mailto:workbhavya404@gmail.com',               label: 'Email'    },
]

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="relative w-full cinematic-footer-wrapper">
        <footer className="relative flex w-full flex-col justify-between overflow-hidden bg-[#050507] text-foreground py-0">

          {/* Aurora glow */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />

          {/* Grid background */}
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Scrolling marquee */}
          <div className="relative top-0 left-0 w-full overflow-hidden border-y border-white/[0.06] bg-black/60 backdrop-blur-md py-4 z-10 -rotate-1 scale-105 shadow-xl mt-0">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.25em] text-white/30 uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Centre content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 w-full max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black footer-text-glow tracking-tighter mb-4 text-center">
              Let's Build Together
            </h2>
            <p className="text-white/40 text-sm md:text-base mb-12 text-center max-w-md">
              Got a project in mind or want to chat? Reach out — I'm always open to interesting conversations.
            </p>

            {/* Social link pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white/60 hover:text-white font-semibold text-sm flex items-center gap-3 group"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </MagneticButton>
              ))}
            </div>

            {/* Nav pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {['#about', '#skills', '#projects', '#contact'].map((href) => (
                <MagneticButton
                  key={href}
                  as="a"
                  href={href}
                  className="footer-glass-pill px-5 py-2 rounded-full text-white/30 font-medium text-xs hover:text-white/70 capitalize"
                >
                  {href.replace('#', '')}
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Logo + copyright */}
            <div className="order-2 md:order-1 flex flex-col items-center md:items-start gap-1.5">
              <div className="h-8 w-[68px] overflow-hidden flex items-center justify-center">
                <img
                  src={bdLogo}
                  alt="BD"
                  className="h-[100px] w-[100px] object-contain"
                  style={{
                    mixBlendMode: 'screen',
                    filter: 'brightness(6) contrast(1.1) saturate(0.35)',
                  }}
                />
              </div>
              <div className="text-white/20 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                © 2026 Bhavya Darda. All rights reserved.
              </div>
            </div>

            {/* Crafted with love pill */}
            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/[0.06]">
              <span className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-widest">Made with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base">💜</span>
              <span className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-widest">BY Bhavya
</span>
            </div>

            {/* Scroll to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-white/30 hover:text-white group order-3"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}
