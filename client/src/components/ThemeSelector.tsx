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
    <div className="fixed right-4 bottom-4 z-30">
      <button
        onClick={toggleThemeSelector}
        className="glassmorphism p-3 rounded-full hover:scale-110 transition-transform"
        aria-label="Toggle theme selector"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isThemeSelectorOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 min-w-[180px]"
          >
            <Glassmorphism className="p-4 rounded-xl">
              <div className="flex flex-col space-y-3">
                {themeOptions.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`flex items-center space-x-3 p-2 rounded transition-all ${
                      currentTheme === theme.id ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span>{theme.name}</span>
                  </button>
                ))}
              </div>
            </Glassmorphism>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSelector;
