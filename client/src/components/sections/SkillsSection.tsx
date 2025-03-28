import React, { useEffect, useRef } from 'react';
import { skills, tools } from '../../data/portfolioData';
import { Glassmorphism } from '../ui/glassmorphism';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SkillsSection: React.FC = () => {
  const skillRingRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate skill items in the ring
    if (skillRingRef.current) {
      const skillRing = skillRingRef.current;
      const skillItems = [
        'React', 'Node.js', 'JavaScript', 'Python', 
        'TensorFlow', 'UI/UX', 'Next.js', 'AI/ML'
      ];
      
      skillItems.forEach((skill, index) => {
        const angle = (index / skillItems.length) * 2 * Math.PI;
        const radius = 125;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item glassmorphism px-3 py-1 rounded-full text-xs absolute';
        skillItem.textContent = skill;
        skillItem.style.transform = `translate(${x}px, ${y}px)`;
        
        skillRing.appendChild(skillItem);
      });
      
      // Animate the skill ring
      gsap.to(skillRing, {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none"
      });
    }
    
    // GSAP animations with ScrollTrigger
    gsap.from('.skills-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.skill-card', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.skill-ring-container', {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      scrollTrigger: {
        trigger: '.skill-ring-container',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.tools-container', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.tools-container',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }, []);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'globe':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'brain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        );
      case 'paintBrush':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="skills" className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 skills-title">
          <h2 className="text-xl font-space uppercase tracking-wider text-primary mb-2">My Toolkit</h2>
          <h3 className="text-3xl md:text-4xl font-outfit font-semibold">The Tech Arsenal</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 skills-grid">
              {skills.map((skillCategory, index) => (
                <Glassmorphism
                  key={index}
                  className="rounded-xl p-6 hover:transform hover:scale-105 transition-transform skill-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {getIconComponent(skillCategory.icon)}
                    </div>
                    <h4 className="font-outfit font-medium text-lg">{skillCategory.category}</h4>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {skillCategory.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Glassmorphism>
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center mb-12 lg:mb-0 skill-ring-container">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div ref={skillRingRef} className="skill-ring absolute inset-0 border-2 border-primary rounded-full flex items-center justify-center">
                {/* Skill items will be generated by JS */}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Glassmorphism className="w-24 h-24 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">Skills</span>
                </Glassmorphism>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 tools-container">
          <Glassmorphism className="rounded-xl p-6">
            <h4 className="font-outfit font-medium text-lg mb-4">Tools & Technologies</h4>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, index) => (
                <span key={index} className="px-4 py-2 bg-white/5 rounded-full text-xs">
                  {tool}
                </span>
              ))}
            </div>
          </Glassmorphism>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
