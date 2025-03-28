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
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const changeLanguage = (language: Language) => {
    i18n.changeLanguage(language.code);
    setCurrentLanguage(language);
    setIsOpen(false);
    
    // Add language change class to body for global transition effect
    document.body.classList.add('language-transition');
    setTimeout(() => {
      document.body.classList.remove('language-transition');
    }, 1000);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transformOrigin: "top right"
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
      y: -10,
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
      x: -10 
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    hover: { 
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      x: 5,
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
        className="flex items-center space-x-2 text-white bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="hidden md:inline-block">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="inline-block md:hidden">{currentLanguage.flag}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl p-2 overflow-hidden"
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
    </div>
  );
};

export default LanguageSwitcher;