import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GlobeIcon, CheckIcon, ChevronDownIcon } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' }
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const [languageChangeEffect, setLanguageChangeEffect] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const language = LANGUAGES.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
        i18n.changeLanguage(language.code);
      }
    }
  }, []);

  const handleLanguageChange = async (language: Language, showEffect = true) => {
    try {
      localStorage.setItem('preferredLanguage', language.code);
      await i18n.changeLanguage(language.code);
      setCurrentLanguage(language);
      setIsOpen(false);

      if (showEffect) {
        setLanguageChangeEffect(true);
        setTimeout(() => setLanguageChangeEffect(false), 500);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transformOrigin: "bottom right"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.3,
        stiffness: 200,
        damping: 20
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    hover: { 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      y: -3,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-xl"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="hidden md:inline-block text-sm">{currentLanguage.flag} {currentLanguage.name}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-48 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {LANGUAGES.map((language, index) => (
              <motion.button
                key={language.code}
                custom={index}
                variants={itemVariants}
                whileHover="hover"
                onClick={() => handleLanguageChange(language)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm ${
                  currentLanguage.code === language.code
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
                {currentLanguage.code === language.code && (
                  <CheckIcon className="h-4 w-4 ml-auto" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {languageChangeEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-none z-50"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;