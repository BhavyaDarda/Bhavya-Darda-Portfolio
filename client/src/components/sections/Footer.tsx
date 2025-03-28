
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' }
  ];

  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-background/50 backdrop-blur-lg border-t border-primary/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#hero" className="text-xl font-outfit font-semibold">
              <span className="gradient-text">Bhavya Darda</span>
            </a>
            <p className="mt-2 text-sm opacity-70">
              &copy; {currentYear} {t('footer.rights')}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-6">
            {footerLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Back to Top */}
          <div className="flex justify-center md:justify-end">
            <a 
              href="#hero" 
              className="group flex items-center gap-2 text-sm hover:text-primary transition-colors duration-300"
            >
              <span>{t('Back to Top')}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform duration-300"
              >
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
