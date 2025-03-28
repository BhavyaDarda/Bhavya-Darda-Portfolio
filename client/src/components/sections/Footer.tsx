import React from 'react';
import { navLinks } from '../../data/portfolioData';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-8 px-4 sm:px-6 lg:px-8 bg-background border-t border-primary/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a href="#" className="text-xl font-outfit font-semibold">
              <span className="gradient-text">Bhavya Darda</span>
            </a>
          </div>
          
          <div className="hidden md:flex space-x-6 mb-4 md:mb-0">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-xs hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="text-sm opacity-70 mb-4 md:mb-0">
            <p>&copy; {currentYear} Bhavya Darda. All rights reserved.</p>
          </div>
          
          <div>
            <a href="#hero" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <span>Back to Top</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
