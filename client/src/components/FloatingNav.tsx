import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp, Home, User, Code, Briefcase, MessageCircle } from 'lucide-react';
export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navItems = [{
    id: 'hero',
    icon: Home,
    label: 'Home'
  }, {
    id: 'about',
    icon: User,
    label: 'About'
  }, {
    id: 'skills',
    icon: Code,
    label: 'Skills'
  }, {
    id: 'projects',
    icon: Briefcase,
    label: 'Projects'
  }, {
    id: 'contact',
    icon: MessageCircle,
    label: 'Contact'
  }];
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return null;
}