import React, { useEffect } from 'react';
import { achievements } from '../../data/portfolioData';
import { Glassmorphism } from '../ui/glassmorphism';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AchievementsSection: React.FC = () => {
  useEffect(() => {
    // GSAP animations with ScrollTrigger
    gsap.from('.achievements-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#achievements',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.achievement-card', {
      opacity: 0,
      y: 40,
      stagger: 0.2,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.achievements-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }, []);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'robot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'microchip':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <section id="achievements" className="relative py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 achievements-title">
          <h2 className="text-xl font-space uppercase tracking-wider text-primary mb-2">Recognition</h2>
          <h3 className="text-3xl md:text-4xl font-outfit font-semibold mb-4">Achievements & Certifications</h3>
          <p className="max-w-2xl mx-auto opacity-80">Milestones that highlight my expertise and professional growth</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 achievements-grid">
          {achievements.map((achievement) => (
            <Glassmorphism
              key={achievement.id}
              className="rounded-xl p-6 hover:transform hover:scale-105 transition-transform achievement-card"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-6 mx-auto text-primary-foreground">
                {getIconComponent(achievement.icon)}
              </div>
              <h4 className="font-outfit font-semibold text-xl mb-3 text-center">{achievement.title}</h4>
              <p className="text-sm text-center opacity-80 mb-4">{achievement.description}</p>
              <div className="text-center">
                <span className="text-xs text-primary inline-block">{achievement.year}</span>
              </div>
            </Glassmorphism>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
