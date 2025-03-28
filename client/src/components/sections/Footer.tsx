
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Neomorphism } from '../ui/neomorphism';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const container = containerRef.current;
    
    if (footer && container) {
      gsap.fromTo(container.children,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom-=100",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);
  
  const footerLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' }
  ];

  const socialLinks = [
    { icon: 'github', href: 'https://github.com/bhavya-darda', label: 'GitHub' },
    { icon: 'linkedin', href: 'https://linkedin.com/in/bhavya-darda', label: 'LinkedIn' }
  ];

  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer ref={footerRef} className="relative mt-auto">
      <Neomorphism className="backdrop-blur-xl bg-background/30 relative overflow-hidden group border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <motion.div 
          ref={containerRef}
          className="container mx-auto px-4 py-8 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-4">
              <a href="#hero" className="inline-block">
                <h3 className="text-2xl font-outfit font-semibold">
                  <span className="gradient-text">Bhavya Darda</span>
                </h3>
              </a>
              <p className="mt-4 text-sm opacity-70 max-w-sm">
                {t('footer.description', 'Crafting digital experiences through innovative web development and design.')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-4">
              <h4 className="font-outfit font-medium mb-4 text-lg">{t('footer.quickLinks', 'Quick Links')}</h4>
              <nav className="grid grid-cols-2 gap-3">
                {footerLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="text-sm hover:text-primary transition-all duration-300 inline-flex items-center group relative"
                    whileHover={{ x: 8, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </span>
                    <motion.span
                      className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.span>
                  </motion.a>
                ))}
              </nav>
            </div>

            {/* Social & Back to Top */}
            <div className="md:col-span-4">
              <h4 className="font-outfit font-medium mb-4 text-lg">{t('footer.connect', 'Connect')}</h4>
              <div className="flex gap-4 mb-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-3 rounded-xl overflow-hidden group"
                    aria-label={link.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10 text-white group-hover:text-primary transition-colors duration-300">
                      {renderSocialIcon(link.icon)}
                    </span>
                    <span className="absolute inset-0 border border-primary/20 rounded-xl group-hover:border-primary/50 transition-colors duration-300"></span>
                  </motion.a>
                ))}
              </div>
              <a
                href="#hero"
                className="group inline-flex items-center gap-2 text-sm hover:text-primary transition-colors duration-300 p-2"
              >
                <span>{t('footer.backToTop', 'Back to Top')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 relative">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center gap-4 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.p 
                className="text-sm text-white/70 hover:text-white/90 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                &copy; {currentYear} {t('footer.rights', 'Bhavya Darda. All rights reserved.')}
              </motion.p>
              <motion.p 
                className="text-sm text-white/70 hover:text-white/90 transition-colors duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                {t('footer.madeWith', 'Made with')} 
                <motion.span
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  ❤️
                </motion.span> 
                {t('footer.using', 'using React & TypeScript')}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </Neomorphism>
    </footer>
  );
};

export default Footer;
