import React, { useEffect } from 'react';
import { useMagnetic } from '../../hooks/use-magnetic';
import { Neomorphism } from '../ui/neomorphism';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ResumeSection: React.FC = () => {
  const downloadBtnRef = useMagnetic<HTMLAnchorElement>({ strength: 0.15 });
  
  useEffect(() => {
    // GSAP animations with ScrollTrigger
    gsap.from('.resume-content', {
      opacity: 0,
      x: -50,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#resume',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.resume-preview', {
      opacity: 0,
      x: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#resume',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }, []);
  
  return (
    <section id="resume" className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="w-full md:w-1/2 resume-content">
            <h2 className="text-xl font-space uppercase tracking-wider text-primary mb-2">My Resume</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-semibold mb-6">Download My CV</h3>
            
            <p className="opacity-80 mb-8 text-sm md:text-base">
              For a comprehensive overview of my skills, experience, and qualifications, download my resume. It includes detailed information about my professional background, technical expertise, and achievements.
            </p>
            
            <a 
              href="#"
              ref={downloadBtnRef}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-light transition-colors group"
            >
              <span>Download Resume</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-5 h-5 group-hover:translate-y-1 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
          
          <div className="w-full md:w-1/2 resume-preview">
            <Neomorphism className="rounded-xl p-4 relative overflow-hidden">
              <div className="w-full aspect-[3/4] relative">
                <object
                  data="/resume.pdf"
                  type="application/pdf"
                  className="absolute inset-0 w-full h-full rounded-lg bg-background"
                  style={{ minHeight: '600px' }}
                >
                  <embed src="/resume.pdf" type="application/pdf" />
                </object>
              </div>
            </Neomorphism>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
