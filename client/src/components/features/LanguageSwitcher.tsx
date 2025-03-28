import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeIcon, CheckIcon, ChevronDownIcon } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  cultural: string;
}

const languages: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸', 
    cultural: 'Modern & Dynamic'
  },
  { 
    code: 'fr', 
    name: 'Français', 
    flag: '🇫🇷', 
    cultural: 'Elegant & Refined'
  },
  { 
    code: 'es', 
    name: 'Español', 
    flag: '🇪🇸', 
    cultural: 'Vibrant & Expressive'
  },
  { 
    code: 'ja', 
    name: '日本語', 
    flag: '🇯🇵', 
    cultural: 'Minimal & Precise'
  },
  { 
    code: 'zh', 
    name: '中文', 
    flag: '🇨🇳', 
    cultural: 'Bold & Balanced'
  }
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [languageChangeEffect, setLanguageChangeEffect] = useState(false);

  // Sync state with i18n and update chatbot language
  useEffect(() => {
    const foundLang = languages.find(lang => lang.code === i18n.language);
    if (foundLang && foundLang.code !== currentLanguage.code) {
      setCurrentLanguage(foundLang);
      
      // Update HTML lang attribute
      document.documentElement.lang = foundLang.code;
      
      // Save language preference
      localStorage.setItem('preferredLanguage', foundLang.code);
    }
  }, [i18n.language]);

  // Store preferred language in localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      const foundLang = languages.find(lang => lang.code === savedLang);
      if (foundLang) {
        changeLanguage(foundLang, false);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const changeLanguage = (language: Language, showEffect = true) => {
    try {
      // Store preference in localStorage
      localStorage.setItem('preferredLanguage', language.code);
      
      // Change language via i18next
      i18n.changeLanguage(language.code).catch(err => {
        console.error("Error changing language:", err);
      });
      
      setCurrentLanguage(language);
      setIsOpen(false);
      
      // Visual transition effect
      if (showEffect) {
        setLanguageChangeEffect(true);
        document.body.classList.add('language-transition');
        setTimeout(() => {
          document.body.classList.remove('language-transition');
          setLanguageChangeEffect(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20, // Changed to animate from bottom to top
      scale: 0.95,
      transformOrigin: "bottom right"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, // Changed to animate from top to bottom on exit
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 10 // Changed to vertical animation for better UX
    },
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
      y: -3, // Changed to move up on hover for better feedback
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative z-50" 
      data-cursor="Switch Language"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-2 hover:bg-black/40 transition-all duration-300 shadow-lg hover:shadow-xl"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('theme.select')} // Use translation
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="hidden md:inline-block text-sm">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="inline-block md:hidden">{currentLanguage.flag}</span>
        <ChevronDownIcon className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="absolute bottom-full mb-2 right-0 w-64 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-2 overflow-hidden"
            role="listbox"
            aria-label={t('theme.select')}
          >
            <div className="divide-y divide-white/10">
              {languages.map((language, index) => (
                <motion.button
                  key={language.code}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => changeLanguage(language)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                    currentLanguage.code === language.code 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-white hover:text-primary'
                  }`}
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                  tabIndex={isOpen ? 0 : -1}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-semibold">{language.name}</div>
                      <div className="text-xs opacity-70">{language.cultural}</div>
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <CheckIcon className="h-4 w-4 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Language change effect overlay */}
      <AnimatePresence>
        {languageChangeEffect && (
          <motion.div 
            className="fixed inset-0 z-[1000] pointer-events-none bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;