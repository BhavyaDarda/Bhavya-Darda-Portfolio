import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Menu, ArrowUpRight } from 'lucide-react'

const navItems = [
  { href: '#about',        label: 'About',        index: '01' },
  { href: '#skills',       label: 'Skills',       index: '02' },
  { href: '#timeline',     label: 'Timeline',     index: '03' },
  { href: '#projects',     label: 'Projects',     index: '04' },
  { href: '#testimonials', label: 'Achievements', index: '05' },
  { href: '#contact',      label: 'Contact',      index: '06' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setOpen(false)
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-cosmic-primary hover:bg-white/10 rounded-full transition-all duration-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="bg-black/95 backdrop-blur-2xl border-white/[0.08] w-full sm:w-96 p-0">
          <div className="flex flex-col h-full px-8 pt-10 pb-8">
            <SheetTitle className="mono-label text-cosmic-primary/70 text-xs mb-1">
              Navigation
            </SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation menu with links to different sections of the portfolio
            </SheetDescription>

            <div className="font-editorial text-3xl uppercase tracking-tight text-white/90 mb-10">
              Bhavya Darda
            </div>

            <div className="flex flex-col divide-y divide-white/[0.08] flex-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="group flex items-center justify-between py-4 text-left"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="mono-label text-cosmic-primary/50 text-[10px]">{item.index}</span>
                    <span className="font-editorial text-2xl uppercase tracking-tight text-white/70 group-hover:text-cosmic-primary transition-colors duration-300">
                      {item.label}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-cosmic-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </button>
              ))}
            </div>

            <div className="pt-6 mt-auto">
              <div className="font-mono text-xs text-white/35 bg-white/[0.03] p-3 rounded-xl border border-white/[0.08]">
                <span className="text-cosmic-secondary">const</span> menu = {"{"}
                <br />
                &nbsp;&nbsp;<span className="text-cosmic-tertiary">status</span>: <span className="text-cosmic-primary">'ready'</span>,
                <br />
                &nbsp;&nbsp;<span className="text-cosmic-tertiary">mode</span>: <span className="text-cosmic-primary">'editorial'</span>
                <br />
                {"};"}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
