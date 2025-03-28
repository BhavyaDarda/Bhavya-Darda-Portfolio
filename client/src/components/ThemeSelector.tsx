import React from 'react';
import { Glassmorphism } from './ui/glassmorphism';
import { themeOptions } from '../data/portfolioData';
import { useThemeStore, applyTheme } from '../lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, isThemeSelectorOpen, toggleThemeSelector } = useThemeStore();
  
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
    applyTheme(themeId as any);
    toggleThemeSelector();
  };
  
  return (
    <div className="relative z-50" data-cursor="Change Theme">
      <button
        onClick={toggleThemeSelector}
        className="flex items-center space-x-2 text-white bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-xl"
        aria-label="Toggle theme selector"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span className="hidden md:inline-block text-sm">Theme</span>
      </button>
      
      <AnimatePresence>
        {isThemeSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-2 overflow-hidden"
          >
            <div className="divide-y divide-white/10">
              {themeOptions.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  custom={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    currentTheme === theme.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-white hover:text-primary'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full mr-3" style={{ backgroundColor: theme.color }} />
                    <div className="text-left font-semibold">{theme.name}</div>
                  </div>
                  {currentTheme === theme.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
