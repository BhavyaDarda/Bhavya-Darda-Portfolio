import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../lib/theme';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeStore();
  
  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorDot) return;
    
    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    };
    
    document.addEventListener('mousemove', updateCursor);
    
    // Handle cursor appearance when over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.classList.contains('magnetic')
      ) {
        cursor.classList.add('scale-150');
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      cursor.classList.remove('scale-150');
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    // Add cursor-none class to body to hide default cursor
    document.body.classList.add('cursor-none');
    
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.classList.remove('cursor-none');
    };
  }, []);
  
  // Get theme-based color
  const getCursorColor = () => {
    switch (currentTheme) {
      case 'emerald': return '#10b981';
      case 'platinum': return '#e5e5e5';
      case 'gold':
      default: return '#d4af37';
    }
  };
  
  return (
    <>
      <motion.div
        ref={cursorRef}
        className="w-10 h-10 border-2 rounded-full fixed pointer-events-none z-50 backdrop-blur-sm transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ 
          borderColor: 'rgb(0, 247, 255)',
          transformOrigin: 'center',
        }}
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        ref={cursorDotRef}
        className="w-2 h-2 rounded-full fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ backgroundColor: getCursorColor() }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

export default CustomCursor;
