import React, { useEffect } from 'react';
import { aboutInfo } from '../../data/portfolioData';
import { Glassmorphism } from '../ui/glassmorphism';
import { Neomorphism } from '../ui/neomorphism';
import { useMagnetic } from '../../hooks/use-magnetic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutSection: React.FC = () => {
  const skillsBtnRef = useMagnetic<HTMLAnchorElement>();
  const resumeBtnRef = useMagnetic<HTMLAnchorElement>();
  
  useEffect(() => {
    // GSAP animations with ScrollTrigger
    gsap.from('.about-image', {
      opacity: 0,
      x: -50,
      duration: 1,
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.about-content', {
      opacity: 0,
      x: 50,
      duration: 1,
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.expertise-card', {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.expertise-grid',
        start: 'top 85%',
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
      case 'terminal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="about" className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          <div className="w-full lg:w-5/12 about-image">
            <div className="relative">
              <Glassmorphism className="rounded-2xl overflow-hidden aspect-square w-full max-w-md mx-auto">
                <img
                  src="/IMG-20240912-WA0001~2.jpg"
                  alt="Bhavya Darda"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent"></div>
              </Glassmorphism>
              
              <div className="absolute -bottom-6 -right-6">
                <Glassmorphism className="rounded-xl p-4 w-48 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <p className="text-xs font-space tracking-wider">AVAILABLE FOR WORK</p>
                  </div>
                </Glassmorphism>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-7/12 about-content">
            <h2 className="text-xl font-space uppercase tracking-wider text-primary mb-2">About Me</h2>
            <h3 className="text-3xl md:text-4xl font-outfit font-semibold mb-6">The Visionary Developer & AI Engineer</h3>
            
            <Glassmorphism className="rounded-xl p-6 mb-8 text-sm lg:text-base leading-relaxed">
              <p className="mb-4">
                I am a passionate and innovative <span className="gradient-text font-medium">Web Application Developer, AI/ML Engineer, User Interface Designer, and Prompt Engineer</span> dedicated to crafting cutting-edge solutions that seamlessly blend technology and design.
              </p>
              <p>
                With a strong foundation in full-stack development and a keen eye for aesthetics, I strive to create applications that are both functional and visually captivating. My goal is to push the boundaries of web development and artificial intelligence, delivering products that enhance user experiences and drive technological advancement.
              </p>
            </Glassmorphism>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 expertise-grid">
              {aboutInfo.expertise.map((item, index) => (
                <Neomorphism key={index} className="rounded-xl p-5 expertise-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">
                      {getIconComponent(item.icon)}
                    </div>
                    <h4 className="font-outfit font-medium">{item.title}</h4>
                  </div>
                  <p className="text-sm opacity-80">{item.description}</p>
                </Neomorphism>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href="#skills" 
                ref={skillsBtnRef}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-primary-foreground rounded-full text-sm font-medium transition-colors"
              >
                View My Skills
              </a>
              <a 
                href="#resume" 
                ref={resumeBtnRef}
                className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full text-sm font-medium transition-all"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
