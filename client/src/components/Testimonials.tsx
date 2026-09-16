import { Badge } from '@/components/ui/badge'
import { FadingVideo } from '@/components/ui/fading-video'
import { SectionLabel } from '@/components/ui/section-label'
import { useTiltSpotlight } from '@/hooks/use-tilt-spotlight'
import { Trophy, Star, Mic, Users } from 'lucide-react'

const achievements = [
  {
    icon: Mic,
    title: "International Conference Organizer",
    description: "Organized an international conference on cyber-physical systems at Christ University, Delhi-NCR.",
    badge: "Leadership"
  },
  {
    icon: Star,
    title: "Student Ambassador — OnePlus India",
    description: "Represented OnePlus India Pvt. Ltd. across college campuses, expos, and product launches as an official Student Ambassador.",
    badge: "Brand Ambassador"
  },
  {
    icon: Users,
    title: "Samsung Galaxy AI Summit",
    description: "Attended the Galaxy AI Summit by Samsung India Pvt. Ltd. — hands-on exposure to cutting-edge AI-integrated mobile technology.",
    badge: "Industry Event"
  },
  {
    icon: Trophy,
    title: "Apple Specialist — Key Metrics",
    description: "Maintained AppleCare attachment >25%, Accessory Attach >27%, Trade-ins >60%, business revenue growth >10%, and 20+ business intros per quarter at Apple Inc.",
    badge: "Apple Inc."
  }
]

const stats = [
  { value: "25%+", label: "AppleCare Attachment Rate" },
  { value: "60%+", label: "Trade-In Rate at Apple" },
  { value: "4",    label: "AI Certifications" },
  { value: "10%",  label: "Revenue Growth Contributed" },
]

function StatCard({ stat }: { stat: typeof stats[number] }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltSpotlight(3)
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="tilt-spotlight liquid-glass group relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-6 overflow-hidden"
    >
      <span className="corner-bracket tl" />
      <span className="corner-bracket br" />
      <div className="text-3xl font-editorial text-cosmic-primary relative">
        {stat.value}
      </div>
      <div className="text-xs text-white/60 text-center leading-snug relative">
        {stat.label}
      </div>
    </div>
  )
}

function AchievementCard({ item, index }: { item: typeof achievements[number]; index: number }) {
  const { ref, onMouseMove, onMouseLeave } = useTiltSpotlight(2)
  const Icon = item.icon
  return (
    <li className="min-h-[12rem]">
      <div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="tilt-spotlight liquid-glass group relative flex h-full flex-col gap-4 rounded-2xl px-6 pt-6 pb-5 overflow-hidden"
      >
        <span className="corner-bracket tl" />
        <span className="corner-bracket br" />
        <div className="relative flex items-center gap-3">
          <span className="index-number">0{index + 1}</span>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cosmic-primary/10 border border-cosmic-primary/20 shrink-0">
            <Icon className="h-[18px] w-[18px] text-cosmic-primary" />
          </div>
          <h4 className="text-sm font-semibold text-white/90 leading-tight">
            {item.title}
          </h4>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-cosmic-primary/20 via-white/[0.04] to-transparent" />

        <p className="relative text-white/65 text-sm leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="relative">
          <Badge
            variant="outline"
            className="border-cosmic-primary/25 text-cosmic-primary/80 bg-cosmic-primary/[0.06] text-[11px] font-normal rounded-full px-2.5 py-0.5"
          >
            {item.badge}
          </Badge>
        </div>
      </div>
    </li>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">

      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/45 to-black/70 pointer-events-none" />

      <span className="giant-numeral top-6 right-4 md:right-12 select-none z-[1]">05</span>

      <div className="relative z-10 container mx-auto px-6">

        <div className="flex flex-col items-center text-center mb-16">
          <SectionLabel index="05" label="Impact" />
          <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-white uppercase drop-shadow-lg">
            Achievements &amp; <span className="text-cosmic-primary">Impact</span>
          </h2>
          <p className="text-white/65 max-w-xl mx-auto mt-4 text-sm md:text-base leading-relaxed drop-shadow-md">
            Real milestones from real roles — in tech, AI, product, and community.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <ul className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto list-none">
          {achievements.map((item, index) => (
            <AchievementCard key={index} item={item} index={index} />
          ))}
        </ul>

      </div>
    </section>
  )
}
