import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Mail, MapPin, Phone, Send, Github, Linkedin, Loader2, ArrowUpRight } from 'lucide-react'
import { contactFormSchema, type ContactFormData } from '@shared/schema'
import { SectionLabel } from '@/components/ui/section-label'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useTiltSpotlight } from '@/hooks/use-tilt-spotlight'
import { useMagnetic } from '@/hooks/use-magnetic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function MagneticGhostButton({ children, className, type = 'button', onClick, disabled }: {
  children: React.ReactNode; className?: string; type?: 'button' | 'submit'; onClick?: () => void; disabled?: boolean
}) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(0.15)
  return (
    <button
      ref={ref as any}
      onMouseMove={onMouseMove as any}
      onMouseLeave={onMouseLeave}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`ghost-btn ${className ?? ''}`}
    >
      {children}
    </button>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-header', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.contact-panel', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = contactFormSchema.safeParse(formData)
    if (!validation.success) {
      const newErrors: Record<string, string> = {}
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message
      })
      setErrors(newErrors)
      return
    }

    setIsPending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: 'Message sent!',
          description: data.message ?? "Your inquiry was structured and sent. I'll get back to you soon.",
        })
        setFormData({ name: '', email: '', subject: '', message: '', website: '' })
        setErrors({})
      } else {
        toast({
          title: 'Failed to send message',
          description: data.error ?? 'Please try again or email me directly.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Could not reach the server. Please email workbhavya404@gmail.com directly.',
        variant: 'destructive',
      })
    } finally {
      setIsPending(false)
    }
  }

  const contactInfo = [
    { icon: Mail,   title: 'Email',    value: 'workbhavya404@gmail.com',      link: 'mailto:workbhavya404@gmail.com' },
    { icon: Phone,  title: 'Phone',    value: '+91 7073348496',               link: 'tel:+917073348496'              },
    { icon: MapPin, title: 'Location', value: 'Kishangarh, Rajasthan, India', link: null                             },
  ]

  const socialLinks = [
    { icon: Github,   href: 'https://github.com/BhavyaDarda',               label: 'GitHub'   },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/bhavya-darda5090', label: 'LinkedIn' },
  ]

  const formTilt = useTiltSpotlight(1.5)
  const infoTilt = useTiltSpotlight(2)
  const statusTilt = useTiltSpotlight(2)

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Subtle depth behind this section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(234,88,12,0.07),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_100%,rgba(245,158,11,0.04),transparent)] pointer-events-none" />

      <span className="giant-numeral top-4 right-4 md:right-12 select-none">06</span>

      <div className="container mx-auto px-6 relative z-10">
        <div className="contact-header mb-16">
          <SectionLabel index="06" label="Get In Touch" />
          <h2 className="font-editorial text-5xl md:text-7xl tracking-tight mt-4 text-foreground uppercase">
            Let's Build <span className="text-cosmic-primary">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mt-4 text-sm md:text-base leading-relaxed">
            Ready to collaborate on your next project? Let's discuss how we can bring
            your ideas to life with cutting-edge web development and AI solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Contact Form */}
          <div
            ref={formTilt.ref}
            onMouseMove={formTilt.onMouseMove}
            onMouseLeave={formTilt.onMouseLeave}
            className="contact-panel tilt-spotlight liquid-glass lg:col-span-3 p-8 md:p-10 rounded-3xl"
          >
            <span className="mono-label text-cosmic-primary/70 block mb-2">01 / Message</span>
            <h3 className="font-editorial text-3xl uppercase tracking-tight mb-6 text-white/95">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <input
                type="text"
                name="website"
                value={formData.website ?? ''}
                onChange={e => handleInputChange('website', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="mono-label block mb-2 text-white/40">Name</label>
                  <Input
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Your name"
                    className={`bg-white/[0.03] border-white/[0.12] focus-visible:border-cosmic-primary focus-visible:ring-cosmic-primary/30 rounded-xl ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="mono-label block mb-2 text-white/40">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={`bg-white/[0.03] border-white/[0.12] focus-visible:border-cosmic-primary focus-visible:ring-cosmic-primary/30 rounded-xl ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="mono-label block mb-2 text-white/40">Subject</label>
                <Input
                  value={formData.subject}
                  onChange={e => handleInputChange('subject', e.target.value)}
                  placeholder="Project inquiry"
                  className={`bg-white/[0.03] border-white/[0.12] focus-visible:border-cosmic-primary focus-visible:ring-cosmic-primary/30 rounded-xl ${errors.subject ? 'border-red-500' : ''}`}
                />
                {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="mono-label block mb-2 text-white/40">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  placeholder="Tell me about your project..."
                  rows={6}
                  className={`bg-white/[0.03] border-white/[0.12] focus-visible:border-cosmic-primary focus-visible:ring-cosmic-primary/30 resize-none rounded-xl ${errors.message ? 'border-red-500' : ''}`}
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="ghost-btn w-full justify-center rounded-full py-4 text-cosmic-primary border-cosmic-primary/40 disabled:opacity-60"
              >
                {isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</>
                  : <><Send className="h-4 w-4" /><ScrambleText text="Send Message" /></>
                }
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div
              ref={infoTilt.ref}
              onMouseMove={infoTilt.onMouseMove}
              onMouseLeave={infoTilt.onMouseLeave}
              className="contact-panel tilt-spotlight liquid-glass p-6 rounded-3xl"
            >
              <span className="mono-label text-cosmic-primary/70 block mb-4">02 / Details</span>
              <div className="space-y-4 mb-5">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cosmic-primary/10 border border-cosmic-primary/20 shrink-0">
                      <item.icon className="h-4 w-4 text-cosmic-primary" />
                    </div>
                    <div>
                      <h4 className="mono-label text-white/35 mb-0.5">{item.title}</h4>
                      {item.link
                        ? <a href={item.link} className="text-white/80 hover:text-cosmic-primary transition-colors text-sm">{item.value}</a>
                        : <p className="text-white/80 text-sm">{item.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-white/[0.07] mb-4" />
              <span className="mono-label text-cosmic-primary/50 block mb-3">03 / Social</span>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <MagneticGhostButton key={label} className="rounded-full !px-4 !py-3" onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}>
                    <Icon className="h-4 w-4" />
                    <ArrowUpRight className="chevron h-3 w-3" />
                  </MagneticGhostButton>
                ))}
              </div>
            </div>

            <div
              ref={statusTilt.ref}
              onMouseMove={statusTilt.onMouseMove}
              onMouseLeave={statusTilt.onMouseLeave}
              className="contact-panel tilt-spotlight liquid-glass p-6 rounded-3xl"
            >
              <span className="mono-label text-cosmic-primary/70 block mb-3">04 / Status</span>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Currently accepting new projects and collaborations.
                Let's build something amazing together!
              </p>
              <div className="font-mono text-xs bg-black/30 p-3 rounded-xl border border-white/[0.08]">
                <span className="text-cosmic-secondary">status</span>: <span className="text-green-400">"available"</span>,<br />
                <span className="text-cosmic-secondary">response_time</span>: <span className="text-cosmic-tertiary">"&lt; 24 hours"</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
