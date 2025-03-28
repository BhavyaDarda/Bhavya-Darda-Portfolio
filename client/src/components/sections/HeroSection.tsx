import React, { useEffect } from 'react';
import { useMagnetic } from '../../hooks/use-magnetic';
import { aboutInfo } from '../../data/portfolioData';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const HeroSection: React.FC = () => {
  const exploreBtnRef = useMagnetic<HTMLAnchorElement>();
  const contactBtnRef = useMagnetic<HTMLAnchorElement>();
  const { t } = useTranslation();
  
  useEffect(() => {
    // GSAP animations
    const tl = gsap.timeline();
    
    tl.from('.hero-subtitle', { 
      opacity: 0, 
      y: 20, 
      duration: 0.8, 
      ease: 'power3.out',
      delay: 0.5
    });
    
    tl.from('.hero-title', { 
      opacity: 0, 
      y: 30, 
      duration: 1, 
      ease: 'power4.out' 
    }, '-=0.4');
    
    tl.from('.hero-description', { 
      opacity: 0, 
      y: 20, 
      duration: 0.8, 
      ease: 'power3.out' 
    }, '-=0.6');
    
    tl.from('.hero-buttons', { 
      opacity: 0, 
      y: 20, 
      duration: 0.8, 
      stagger: 0.2,
      ease: 'power3.out' 
    }, '-=0.4');
    
    tl.from('.scroll-indicator', { 
      opacity: 0, 
      y: -10, 
      duration: 0.5, 
      ease: 'power2.out' 
    }, '-=0.2');
  }, []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-secondary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.p 
            className="hero-subtitle text-sm sm:text-base font-space tracking-[0.25em] mb-4 opacity-80"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {t('hero.greeting')}
          </motion.p>
          
          <h1 className="hero-title relative text-4xl md:text-6xl lg:text-7xl font-outfit font-bold mb-6">
            <span className="block gradient-text animate-glow">{aboutInfo.name}</span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary rounded"></div>
          </h1>
          
          <p className="hero-description max-w-2xl text-base sm:text-lg opacity-80 mb-10">
            <span>{t('hero.title')}</span>
            <br />
            <span className="opacity-75 text-sm">{t('hero.subtitle')}</span>
          </p>
          
          <div className="hero-buttons flex flex-wrap justify-center gap-4">
            <a 
              href="#projects" 
              ref={exploreBtnRef}
              className="relative glassmorphism px-6 py-3 rounded-full text-sm font-medium group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <span className="relative z-10">{t('hero.cta')}</span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-[1]"></span>
            </a>
            
            <a 
              href="#contact" 
              ref={contactBtnRef}
              className="relative neomorphism px-6 py-3 rounded-full text-sm font-medium group hover:text-primary transition-all duration-300"
            >
              <span className="relative z-10">{t('contact.title')}</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <a href="#about" className="flex flex-col items-center text-sm opacity-60 hover:opacity-100 transition-opacity">
          <span className="mb-2">{t('nav.scroll_down')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 animate-bounce">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
