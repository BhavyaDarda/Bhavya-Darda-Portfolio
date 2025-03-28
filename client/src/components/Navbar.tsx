import React, { useEffect, useState } from 'react';
import { Glassmorphism } from './ui/glassmorphism';
import { navLinks } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { useThemeStore } from '../lib/theme';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const { currentTheme } = useThemeStore();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <Glassmorphism className="flex items-center justify-between rounded-xl px-4 py-2">
          <a href="#" className="text-2xl font-outfit font-semibold">
            <span className="gradient-text">BD</span>
          </a>
          
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={onMenuToggle}
              className="text-platinum hover:text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Glassmorphism>
      </div>
    </motion.nav>
  );
};

export default Navbar;
