import React, { useEffect, useState } from 'react';
import { projects } from '../../data/portfolioData';
import { Glassmorphism } from '../ui/glassmorphism';
import { useCardHover } from '../../hooks/use-card-hover';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  // Create refs for each project card
  const projectRefs = projects.map(() => useCardHover<HTMLDivElement>({ scale: 1.03 }));
  const moreProjectsRef = useCardHover<HTMLDivElement>({ scale: 1.03 });
  
  // For filtering projects
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(projects.map(project => project.category)))];
  
  // Filter projects based on selected category
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);
  
  useEffect(() => {
    // GSAP animations with ScrollTrigger
    gsap.from('.projects-title', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // Cleanup function to kill ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  // Animate project cards when filter changes
  useEffect(() => {
    gsap.fromTo('.project-card', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.08, 
        duration: 0.6,
        ease: "power2.out"
      }
    );
  }, [filter]);
  
  return (
    <section id="projects" className="section-padding overflow-hidden bg-[#0a0a0a]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute -top-[30%] -right-[20%] w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -left-[20%] w-96 h-96 rounded-full bg-primary/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 projects-title">
          <h2 className="section-title">My Portfolio</h2>
          <h3 className="section-heading text-shadow-md">The Masterpieces</h3>
          <p className="section-description">Explore my featured projects showcasing web development, AI integration, and design excellence</p>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === filter
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10 projects-grid">
          {filteredProjects.length > 0 ? (
            <>
              {filteredProjects.map((project, index) => (
                <Glassmorphism 
                  key={project.id}
                  className="rounded-xl overflow-hidden group project-card premium-card"
                  ref={projectRefs[index % projectRefs.length]}
                >
                  <div className="relative h-52">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-outfit font-semibold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{project.title}</h4>
                    <p className="text-sm opacity-80 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex} 
                          className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={project.liveUrl} 
                        className="text-primary text-sm font-medium hover:underline flex items-center gap-1 group/link"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        View Project
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          fill="currentColor" 
                          viewBox="0 0 16 16"
                          className="transition-transform duration-300 group-hover/link:translate-x-1"
                        >
                          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                      </a>
                      <div className="flex space-x-3">
                        <a 
                          href={project.githubUrl} 
                          className="hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="GitHub Repository"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                          </svg>
                        </a>
                        <a 
                          href={project.liveUrl} 
                          className="hover:text-primary transition-colors p-2 rounded-full hover:bg-white/5"
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label="Live Project"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                            <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              ))}
              
              {/* Show "More Projects" card only on "All" view */}
              {filter === 'All' && (
                <Glassmorphism
                  className="rounded-xl overflow-hidden flex items-center justify-center p-8 h-full project-card premium-card"
                  ref={moreProjectsRef}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-6 text-primary border border-primary/30">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h4 className="font-outfit font-semibold text-xl mb-3">More Projects</h4>
                    <p className="text-sm opacity-80 mb-6">Discover my complete project collection and latest works on GitHub</p>
                    <a
                      href="https://github.com/BhavyaDarda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      <span>Visit GitHub</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </a>
                  </div>
                </Glassmorphism>
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-20 h-20 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-primary/70">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-2xl font-medium mb-3">No projects found</h4>
              <p className="opacity-70 mb-6">Sorry, no projects match the selected category.</p>
              <button 
                onClick={() => setFilter('All')}
                className="btn-outline"
              >
                View All Projects
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
