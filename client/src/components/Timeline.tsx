import { SectionLabel } from '@/components/ui/section-label'
import FUITimelineCarousel from '@/components/ui/timeline-carousel'

export function Timeline() {
  return (
    <section id="timeline" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-14">
          <SectionLabel index="03" label="The Journey" />
          <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-foreground uppercase">
            Career <span className="text-cosmic-primary">Timeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
            Five checkpoints across computer applications, AI development, software engineering, community, and technical support.
          </p>
        </div>
      </div>

      {/* Full-width carousel — outside container so it can bleed edge-to-edge */}
      <div className="mt-4 relative z-10">
        <FUITimelineCarousel />
      </div>
    </section>
  )
}
