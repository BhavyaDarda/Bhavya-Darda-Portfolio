import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Timeline } from '@/components/Timeline'
import { Projects } from '@/components/Projects'
import { Testimonials } from '@/components/Testimonials'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/ScrollProgress'
import { FloatingNav } from '@/components/FloatingNav'
import { VerticalNav } from '@/components/VerticalNav'

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <Projects />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
      <FloatingNav />
      <VerticalNav />
    </div>
  );
};

export default Index;