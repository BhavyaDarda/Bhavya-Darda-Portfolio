import { Code2, Brain, Apple, Users } from 'lucide-react'
import { ShaderAnimation } from '@/components/ui/shader-animation'
import { SectionLabel } from '@/components/ui/section-label'
import { useTiltSpotlight } from '@/hooks/use-tilt-spotlight'

const highlights = [
  {
    icon: Apple,
    title: "Apple Product Specialist",
    description: "Delivered exceptional customer experience, technical support, and drove sales at Apple Inc., DLF Mall of India, Noida — maintaining AppleCare attachment over 25% and trade-in rates over 60%."
  },
  {
    icon: Brain,
    title: "AI Agent Development",
    description: "Built AI Agents — Personal Assistants, Automated Marketing Agents, and Social Media Agents — through rapid prototyping, MVP building, and deployment at OLL.co."
  },
  {
    icon: Code2,
    title: "Full-Stack Development",
    description: "Designed and optimized web applications for real clients, delivering a 25% improvement in website performance and clean UI/UX with strong CTAs and measurable engagement growth."
  },
  {
    icon: Users,
    title: "Community & Brand Leadership",
    description: "Student Ambassador for OnePlus India, community moderator for Oppo India — led product testing, organized campus events, brand campaigns, and attended the Samsung Galaxy AI Summit."
  }
]

function HighlightCard({ item }: { item: typeof highlights[number] }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltSpotlight(2.5)
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="tilt-spotlight liquid-glass group relative rounded-2xl p-5 overflow-hidden"
    >
      <span className="corner-bracket tl" />
      <span className="corner-bracket br" />
      <div className="relative flex items-start gap-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cosmic-primary/10 border border-cosmic-primary/20 shrink-0">
          <item.icon className="h-[17px] w-[17px] text-cosmic-primary" />
        </div>
        <div>
          <h4 className="font-semibold text-white/90 mb-1 text-sm">{item.title}</h4>
          <p className="text-white/52 text-xs leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  )
}

export function About() {
  const journeyTilt = useTiltSpotlight(1.5)

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <ShaderAnimation />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />


      <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <SectionLabel index="01" label="Who I Am" />
          <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-white uppercase">
            About <span className="text-cosmic-primary">Me</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
            Apple Specialist and BCA graduate with a passion for generative AI, prompt engineering, and full-stack development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          <div
            ref={journeyTilt.ref}
            onMouseMove={journeyTilt.onMouseMove}
            onMouseLeave={journeyTilt.onMouseLeave}
            className="tilt-spotlight liquid-glass group relative rounded-2xl p-8 overflow-hidden"
          >
            <span className="corner-bracket tl" />
            <span className="corner-bracket tr" />
            <span className="corner-bracket bl" />
            <span className="corner-bracket br" />
            <span className="mono-label text-cosmic-primary/60 block mb-4">My Journey</span>
            <h3 className="font-editorial text-3xl uppercase tracking-tight mb-6 text-white/95">The Path So Far</h3>
            <div className="space-y-4 text-white/65 text-sm leading-relaxed">
              <p>
                I'm a BCA graduate from Christ University, Delhi-NCR (2022–2025) with a keen interest in generative AI,
                prompt engineering, and data analytics. My work spans full-stack AI development, product testing, and customer-facing technical roles.
              </p>
              <p>
                Most recently, I served as a Product Specialist at Apple Inc. (DLF Mall of India, Noida), where I led sales,
                technical support, Genius Bar facilitation, and visual merchandising. Prior to that, I built AI agents at OLL.co,
                interned as an SDE at Durapid Technologies, and moderated communities for Oppo India.
              </p>
              <div className="code-block">
                <span className="token-keyword">const</span> <span className="token-variable">bhavya</span> <span className="token-operator">=</span> <span className="token-bracket">{'{'}</span>
                <br />
                &nbsp;&nbsp;<span className="token-property">focus</span><span className="token-punctuation">:</span> <span className="token-string">'AI + Full-Stack'</span><span className="token-punctuation">,</span>
                <br />
                &nbsp;&nbsp;<span className="token-property">background</span><span className="token-punctuation">:</span> <span className="token-string">'Apple • OLL.co • Durapid'</span><span className="token-punctuation">,</span>
                <br />
                &nbsp;&nbsp;<span className="token-property">goal</span><span className="token-punctuation">:</span> <span className="token-string">'Technical Excellence'</span>
                <br />
                <span className="token-bracket">{'}'}</span><span className="token-punctuation">;</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {highlights.map((item, index) => (
              <HighlightCard key={index} item={item} />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
