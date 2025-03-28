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
            <Neomorphism className="rounded-xl p-4 aspect-[3/4] relative overflow-hidden">
              <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-outfit font-medium text-lg">Bhavya Darda</h4>
                    <span className="text-sm text-primary">Full Stack Developer</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-primary">Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML'].map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-white/5 rounded-md">{skill}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-primary">Experience</h5>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <div className="font-medium">Senior Developer</div>
                          <div className="text-xs opacity-70">2021 - Present</div>
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">Full Stack Engineer</div>
                          <div className="text-xs opacity-70">2019 - 2021</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-primary">Education</h5>
                      <div className="text-sm">
                        <div className="font-medium">B.Tech in Computer Science</div>
                        <div className="text-xs opacity-70">2015 - 2019</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-primary/80">
                    Download for full details
                  </div>
                </div>
              </div>
            </Neomorphism>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
