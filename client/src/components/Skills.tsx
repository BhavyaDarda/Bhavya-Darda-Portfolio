import { Badge } from '@/components/ui/badge'
import { ShaderCanvas } from '@/components/ui/radial-shader'
import { SectionLabel } from '@/components/ui/section-label'
import { useTiltSpotlight } from '@/hooks/use-tilt-spotlight'
import { Code2, BarChart2, Wrench, Brain, Award, Globe } from 'lucide-react'

const SHADER_SRC = `#version 300 es
precision highp float;
out vec4 fragColor;
in vec2 v_uv;
uniform vec3  iResolution;
uniform float iTime;
uniform int   iFrame;
uniform vec4  iMouse;
void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2  r  = iResolution.xy;
    float t  = iTime;
    vec3  FC = vec3(fragCoord, t);
    vec4  o  = vec4(0.0);
    vec2 p = FC.xy - r * 0.5;
    for (float i, a; i++ < 7.0; ){
        a = length(p) / r.y - (i * i) / 50.0;
        float denom = max(a, -a * 4.0) + 2.0 / r.y;
        a = atan(p.y, p.x) * 3.0 + t * sin(i * i) + i * i;
        float gate = smoothstep(0.0, 0.6, cos(a));
        o += 0.02 / denom * gate * (1.0 + sin(a - i + vec4(0.0, 0.2, 0.5, 0.0)));
    }
    o = tanh(o);
    fragColor = vec4(o.rgb, 1.0);
}
void main(){ mainImage(fragColor, gl_FragCoord.xy); }
`

const categoryMeta = [
  { icon: Code2 },
  { icon: BarChart2 },
  { icon: Wrench },
  { icon: Brain },
  { icon: Award },
  { icon: Globe },
]

const skillCategories = [
  { title: "Programming Languages", skills: ["Java", "JavaScript", "Python", "C"] },
  { title: "Data Visualization & Productivity", skills: ["Google Workspace", "MS 365 Suite", "matplotlib", "seaborn", "Python Data Libraries"] },
  { title: "Technical Systems & Tools", skills: ["VS Code", "Cursor", "Claude", "Git", "Inventory Management Systems", "Internal Diagnostic Tools", "Technical Assistance", "Device Setup & Configuration"] },
  { title: "AI & Development", skills: ["AI Agent Development", "Generative AI", "Prompt Engineering", "Agentic AI", "Rapid Prototyping", "MVP Building", "Full-Stack Development", "SEO Optimization", "AI Search Optimization"] },
  { title: "Certifications", skills: ["Gen AI Mastermind — Outskill (Feb 2025)", "Build Real World Apps with Gemini & Imagen — Google (May 2025)", "Developing Gen AI Apps with Gemini & Streamlit — Google (Jun 2025)", "Agentic AI Development with Oracle AI & Agent Studio — Oracle (Aug 2025)"] },
  { title: "Languages", skills: ["English", "Hindi", "German (A1)"] },
]

function SkillCard({ category, index }: { category: typeof skillCategories[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltSpotlight(2.5)
  const Icon = categoryMeta[index].icon

  return (
    <li className="min-h-[14rem]">
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="tilt-spotlight liquid-glass group relative flex h-full flex-col gap-5 rounded-2xl px-6 pt-6 pb-5 overflow-hidden"
      >
        <span className="corner-bracket tl" />
        <span className="corner-bracket br" />
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cosmic-primary/10 border border-cosmic-primary/20 shrink-0">
            <Icon className="h-[18px] w-[18px] text-cosmic-primary" />
          </div>
          <h3 className="text-sm font-semibold text-white/85 leading-tight">
            {category.title}
          </h3>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-cosmic-primary/20 via-white/[0.04] to-transparent" />

        <div className="relative flex flex-wrap gap-1.5">
          {category.skills.map((skill, skillIndex) => (
            <Badge
              key={skillIndex}
              variant="secondary"
              className="bg-white/[0.05] text-white/60 border border-white/[0.10] hover:bg-cosmic-primary/10 hover:text-cosmic-primary hover:border-cosmic-primary/30 transition-all duration-300 text-[11px] px-2.5 py-0.5 font-normal rounded-full shadow-none"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </li>
  )
}

export function Skills() {
  const learningTilt = useTiltSpotlight(1.5)

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <ShaderCanvas fragSource={SHADER_SRC} />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

      <span className="giant-numeral top-6 left-4 md:left-12 select-none">02</span>

      <div className="relative z-10 container mx-auto px-6">

        <div className="flex flex-col items-center text-center mb-16">
          <SectionLabel index="02" label="Toolkit" />
          <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-foreground uppercase">
            Skills &amp; <span className="text-cosmic-primary">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
            A practical toolkit built across technical roles, AI development, and hands-on product experience.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 list-none">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} index={index} />
          ))}
        </ul>

        <div className="mt-5">
          <div
            ref={learningTilt.ref}
            onMouseMove={learningTilt.onMouseMove}
            onMouseLeave={learningTilt.onMouseLeave}
            className="tilt-spotlight liquid-glass group relative rounded-2xl overflow-hidden max-w-5xl mx-auto"
          >
            <span className="corner-bracket tl" />
            <span className="corner-bracket tr" />
            <span className="corner-bracket bl" />
            <span className="corner-bracket br" />
            <div className="relative grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
              <div className="px-8 pt-8 pb-8 flex flex-col justify-center gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cosmic-primary/10 border border-cosmic-primary/20 shrink-0">
                    <Brain className="h-[18px] w-[18px] text-cosmic-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/85 leading-tight">Always Learning</h3>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-cosmic-primary/20 via-white/[0.04] to-transparent" />
                <p className="text-white/55 text-sm leading-relaxed">
                  Staying at the cutting edge through Google, Oracle, and Outskill certifications —
                  continuously building with Gemini, Streamlit, Oracle AI Cloud, and the latest agentic frameworks.
                </p>
              </div>

              <div className="px-8 pt-8 pb-8 flex items-center justify-center">
                <div className="code-block w-full">
                  <span className="token-keyword">while</span><span className="token-punctuation">(</span><span className="token-variable">technology</span><span className="token-punctuation">.</span><span className="token-property">evolves</span><span className="token-punctuation">)</span> <span className="token-bracket">{"{"}</span>
                  <br />
                  &nbsp;&nbsp;<span className="token-variable">bhavya</span><span className="token-punctuation">.</span><span className="token-property">keepLearning</span><span className="token-punctuation">();</span>
                  <br />
                  &nbsp;&nbsp;<span className="token-variable">bhavya</span><span className="token-punctuation">.</span><span className="token-property">buildWithAI</span><span className="token-punctuation">();</span>
                  <br />
                  <span className="token-bracket">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
