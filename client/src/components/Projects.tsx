import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Github, Globe, Zap, ArrowUpRight } from 'lucide-react'
import { SectionLabel } from '@/components/ui/section-label'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useTiltSpotlight } from '@/hooks/use-tilt-spotlight'
import { useMagnetic } from '@/hooks/use-magnetic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const marqueeTech = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AI Agents',
  'Data Visualization', 'Prompt Engineering', 'REST APIs', 'PostgreSQL',
]

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltSpotlight(3)
  const magneticBtn = useMagnetic(0.25)

  return (
    <div className={`project-card group relative ${project.span}`}>
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="tilt-spotlight liquid-glass relative h-full rounded-3xl p-8 flex flex-col overflow-hidden"
      >
        <span className="corner-bracket tl rounded-tl-md" />
        <span className="corner-bracket tr rounded-tr-md" />
        <span className="corner-bracket bl rounded-bl-md" />
        <span className="corner-bracket br rounded-br-md" />

        {/* Header row */}
        <div className="relative flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cosmic-primary/10 border border-cosmic-primary/20">
              <project.icon className="h-5 w-5 text-cosmic-primary" />
            </div>
            <span className="index-number">0{index + 1}</span>
          </div>
          <Badge variant="outline" className="border-white/[0.15] text-white/50 text-[10px] font-normal mono-label tracking-[0.2em]">
            {project.category}
          </Badge>
        </div>

        <h3 className="font-editorial text-3xl md:text-4xl tracking-tight text-white/95 mb-3 uppercase group-hover:text-cosmic-primary transition-colors duration-500">
          {project.title}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xl">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.tech.map((tech, techIndex) => (
            <Badge
              key={techIndex}
              variant="secondary"
              className="bg-white/[0.05] text-white/55 border border-white/[0.10] hover:bg-cosmic-primary/10 hover:text-cosmic-primary hover:border-cosmic-primary/30 transition-all duration-300 text-[10px] px-2.5 py-0.5 font-normal rounded-full shadow-none"
            >
              {tech}
            </Badge>
          ))}
        </div>

        <button
          ref={magneticBtn.ref as any}
          onMouseMove={magneticBtn.onMouseMove as any}
          onMouseLeave={magneticBtn.onMouseLeave}
          onClick={() => window.open(project.githubUrl, '_blank')}
          className="ghost-btn mt-auto w-fit rounded-full"
        >
          <Github className="h-3.5 w-3.5" />
          <ScrambleText text="View on GitHub" />
          <ArrowUpRight className="chevron h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

const projects = [
  {
    title: "Internet Speed-Test Application",
    description: "A specialized application built to test internet speeds across various frequencies and bandwidths. Features an intuitive real-time network graph with live performance statistics and comprehensive metrics across multiple network parameters.",
    tech: ["JavaScript", "Network Analysis", "Real-time Stats", "Data Visualization", "Performance Metrics"],
    icon: Globe,
    category: "Web Application",
    githubUrl: "https://github.com/BhavyaDarda",
    span: "md:col-span-3 md:row-span-2"
  },
  {
    title: "Research Ninja",
    description: "A platform dedicated to content research and marketing strategy for business niches. Performs deep research for content ideas, provides full-fledged business metrics including success:failure ratios, business viability scores, and actionable content recommendations that actually work.",
    tech: ["Python", "Data Analysis", "Business Metrics", "Content Strategy", "Market Research"],
    icon: Zap,
    category: "Marketing Tool",
    githubUrl: "https://github.com/BhavyaDarda",
    span: "md:col-span-3 md:row-span-2"
  }
]

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
      gsap.from('.projects-header', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="projects" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* faint background grid, additive atmosphere only */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--cosmic-primary)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--cosmic-primary)/0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <span className="giant-numeral top-8 right-4 md:right-12 select-none">04</span>

      <div className="container mx-auto px-6 relative z-10">
        <div className="projects-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <SectionLabel index="04" label="Selected Work" />
            <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-foreground uppercase">
              Featured <span className="text-cosmic-primary">Projects</span>
            </h2>
          </div>
        </div>

        {/* Marquee strip of technologies used, editorial motion accent */}
        <div className="marquee-row relative mb-14 overflow-hidden border-y border-white/[0.08] py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track gap-10 pr-10">
            {[...marqueeTech, ...marqueeTech].map((tech, i) => (
              <span key={i} className="mono-label text-white/30 whitespace-nowrap flex items-center gap-3">
                {tech}
                <span className="w-1 h-1 rounded-full bg-cosmic-primary/50" />
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-6 gap-5 auto-rows-[minmax(120px,auto)]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        <div className="text-center mt-16">
          <MagneticGhostLink
            onClick={() => window.open('https://github.com/BhavyaDarda?tab=repositories', '_blank')}
            className="rounded-full px-8 py-4 text-cosmic-primary border-cosmic-primary/30"
          >
            <Github className="h-4 w-4" />
            <ScrambleText text="View All on GitHub" />
            <ArrowUpRight className="chevron h-4 w-4" />
          </MagneticGhostLink>
        </div>
      </div>
    </section>
  )
}

function MagneticGhostLink({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.2)
  return (
    <button
      ref={ref as any}
      onMouseMove={onMouseMove as any}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`ghost-btn ${className ?? ''}`}
    >
      {children}
    </button>
  )
}
