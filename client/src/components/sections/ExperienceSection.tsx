import React, { useEffect } from 'react';
import { experiences } from '../../data/portfolioData';
import { Glassmorphism } from '../ui/glassmorphism';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ExperienceSection: React.FC = () => {
  useEffect(() => {
    // GSAP animations with ScrollTrigger
    gsap.from('.experience-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.timeline-connector', {
      height: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.experience-item', {
      opacity: 0,
      y: 40,
      stagger: 0.3,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.timeline-dot', {
      scale: 0,
      stagger: 0.3,
      duration: 0.5,
      scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }, []);
  
  return (
    <section id="experience" className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 experience-title">
          <h2 className="text-xl font-space uppercase tracking-wider text-primary mb-2">Professional Journey</h2>
          <h3 className="text-3xl md:text-4xl font-outfit font-semibold mb-4">Career Timeline</h3>
          <p className="max-w-2xl mx-auto opacity-80">A chronological overview of my professional experience and key milestones</p>
        </div>
        
        <div className="relative timeline-container">
          {/* Timeline connector */}
          <div className="timeline-connector absolute left-1/2 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent transform -translate-x-1/2 z-0"></div>
          
          <div className="space-y-16">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="relative experience-item">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {experience.alignment === 'left' ? (
                    <>
                      <div className="order-1 md:order-1 md:w-1/2 md:text-right flex flex-col items-center md:items-end">
                        <Glassmorphism className="rounded-xl p-6 md:ml-auto w-full max-w-md">
                          <span className="text-primary text-sm font-medium mb-2 block">{experience.period}</span>
                          <h4 className="font-outfit font-semibold text-xl mb-3">{experience.role}</h4>
                          <p className="text-sm opacity-80 mb-4">{experience.description}</p>
                          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                            {experience.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-black/40 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </Glassmorphism>
                      </div>
                      
                      <div className="absolute left-1/2 md:left-1/2 top-0 transform -translate-x-1/2 bg-primary w-6 h-6 rounded-full border-4 border-background z-10 timeline-dot"></div>
                      
                      <div className="order-2 md:order-2 md:w-1/2"></div>
                    </>
                  ) : (
                    <>
                      <div className="order-1 md:order-2 md:w-1/2 flex flex-col items-center md:items-start">
                        <Glassmorphism className="rounded-xl p-6 md:mr-auto w-full max-w-md">
                          <span className="text-primary text-sm font-medium mb-2 block">{experience.period}</span>
                          <h4 className="font-outfit font-semibold text-xl mb-3">{experience.role}</h4>
                          <p className="text-sm opacity-80 mb-4">{experience.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {experience.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-black/40 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </Glassmorphism>
                      </div>
                      
                      <div className="absolute left-1/2 md:left-1/2 top-0 transform -translate-x-1/2 bg-primary w-6 h-6 rounded-full border-4 border-background z-10 timeline-dot"></div>
                      
                      <div className="order-2 md:order-1 md:w-1/2"></div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
