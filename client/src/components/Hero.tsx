import { Code, Zap, Download, Brain, ArrowDown } from 'lucide-react'
import { Beams } from '@/components/ui/ethereal-beams'
import { useToast } from '@/hooks/use-toast'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useMagnetic } from '@/hooks/use-magnetic'

const isWebGLAvailable: boolean = (() => {
  try {
    const c = document.createElement('canvas')
    const ctx =
      c.getContext('webgl') ||
      c.getContext('experimental-webgl' as 'webgl')
    return !!ctx
  } catch {
    return false
  }
})()

const marqueeTags = [
  'Full Stack Dev', 'AI & Prompt Eng.', 'Apple Specialist',
  'Generative AI', 'Agentic Systems', 'Data Analytics',
]

function MagneticButton({ children, className, onClick, variant = 'primary' }: {
  children: React.ReactNode; className?: string; onClick?: () => void; variant?: 'primary' | 'ghost'
}) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.2)
  return (
    <button
      ref={ref as any}
      onMouseMove={onMouseMove as any}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={variant === 'primary' ? `ghost-btn-solid ${className ?? ''}` : `ghost-btn ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

export function Hero() {
  const { toast } = useToast()

  const handleResumeDownload = async () => {
    try {
      const res = await fetch('/resume.pdf', { method: 'HEAD' })
      if (res.ok) {
        const link = document.createElement('a')
        link.href = '/resume.pdf'
        link.download = 'Bhavya_Darda_Resume.pdf'
        link.click()
      } else {
        throw new Error('not found')
      }
    } catch {
      toast({
        title: 'Resume coming soon!',
        description: "Email me at workbhavya404@gmail.com and I'll send it right over.",
      })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 bg-black">

      {isWebGLAvailable && (
        <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={2.5}
            beamHeight={18}
            beamNumber={15}
            lightColor="#ffffff"
            speed={2.5}
            noiseIntensity={2}
            scale={0.15}
            rotation={43}
          />
        </div>
      )}

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Section label — floated below nav, independent of center content */}
      <div className="absolute top-32 sm:top-36 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 whitespace-nowrap">
        <span className="h-px w-8 bg-cosmic-primary/50" />
        <span className="mono-label text-cosmic-primary/70">00 / Introduction</span>
        <span className="h-px w-8 bg-cosmic-primary/50" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 flex flex-col items-center flex-1 justify-center pt-20 sm:pt-24">

        <h1 className="font-editorial text-7xl sm:text-8xl md:text-[9rem] leading-[0.85] mb-6 tracking-tight uppercase text-white">
          Bhavya
          <br />
          <span className="text-cosmic-primary">Darda</span>
        </h1>

        <p className="mono-label text-white/40 mb-12 tracking-widest">
          APPLE SPECIALIST · FULL-STACK AI DEVELOPER · PROMPT ENGINEER
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <MagneticButton
            className="rounded-full px-8 py-4"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Code className="h-4 w-4" />
            View Projects
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            className="rounded-full px-8 py-4"
            onClick={handleResumeDownload}
          >
            <Download className="h-4 w-4" />
            Resume
          </MagneticButton>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mt-10 pb-6 sm:pb-8 flex flex-col items-center gap-2 text-white/25 hover:text-white/45 transition-colors duration-300">
        <span className="mono-label text-[10px]">Scroll</span>
        <ArrowDown className="h-3.5 w-3.5 animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
      </div>
    </section>
  )
}
