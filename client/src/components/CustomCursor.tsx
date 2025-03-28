import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/theme';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeStore();
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isPointer, setIsPointer] = useState<boolean>(false);
  const [isClick, setIsClick] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Get theme-based colors
  const getCursorColor = () => {
    switch (currentTheme) {
      case 'emerald': return '#10b981';
      case 'platinum': return '#e5e5e5';
      case 'gold':
      default: return '#d4af37';
    }
  };
  
  const getCursorGlow = () => {
    switch (currentTheme) {
      case 'emerald': return '0 0 15px rgba(16, 185, 129, 0.8)';
      case 'platinum': return '0 0 15px rgba(229, 229, 229, 0.8)';
      case 'gold':
      default: return '0 0 15px rgba(212, 175, 55, 0.8)';
    }
  };
  
  useEffect(() => {
    // Show cursor only after a small delay to ensure it loads properly
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const updateCursor = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Handle cursor appearance when over clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the element or its parents have data-cursor attributes
      let currentElement: HTMLElement | null = target;
      let cursorAttr = '';
      
      while (currentElement && !cursorAttr) {
        cursorAttr = currentElement.getAttribute('data-cursor') || '';
        if (!cursorAttr) {
          currentElement = currentElement.parentElement;
        }
      }
      
      // Handle specific data-cursor values
      if (cursorAttr) {
        setCursorText(cursorAttr);
        setIsHovering(true);
        return;
      }
      
      // Default behavior for interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('magnetic') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (!relatedTarget || 
          (relatedTarget.tagName !== 'A' && 
           relatedTarget.tagName !== 'BUTTON' && 
           !relatedTarget.closest('a') && 
           !relatedTarget.closest('button') && 
           !relatedTarget.classList.contains('cursor-pointer') &&
           !relatedTarget.classList.contains('magnetic') &&
           getComputedStyle(relatedTarget).cursor !== 'pointer')) {
        setIsHovering(false);
        setIsPointer(false);
        setCursorText('');
      }
    };
    
    const handleMouseDown = () => {
      setIsClick(true);
    };
    
    const handleMouseUp = () => {
      setIsClick(false);
    };
    
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add cursor-none class to body to hide default cursor
    document.body.classList.add('cursor-none');
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-none');
    };
  }, []);
  
  // Apply spring animation to cursor position with damping
  const cursorVariants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      transition: { 
        type: "spring", 
        mass: 0.6,
        damping: 28,
        stiffness: 600
      }
    }
  };
  
  // Faster, more responsive inner cursor
  const dotVariants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      transition: { 
        type: "spring", 
        mass: 0.2,
        damping: 28,
        stiffness: 800
      }
    }
  };
  
  const cursorColor = getCursorColor();
  const cursorGlow = getCursorGlow();
  
  if (!isVisible) {
    return null; // Don't render until ready
  }
  
  return (
    <>
      {/* Outer ring cursor */}
      <motion.div
        ref={cursorOuterRef}
        className="fixed pointer-events-none z-[100] top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform"
        style={{ 
          top: mousePosition.y,
          left: mousePosition.x,
          mixBlendMode: 'difference'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: 0,
          y: 0
        }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="rounded-full flex items-center justify-center"
          animate={{
            width: isHovering ? '120px' : isPointer ? '50px' : '40px',
            height: isHovering ? '120px' : isPointer ? '50px' : '40px',
            backgroundColor: isHovering ? `${cursorColor}20` : 'rgba(0, 0, 0, 0)',
            borderColor: cursorColor,
            borderWidth: isClick ? '1px' : '2px',
            boxShadow: isPointer ? cursorGlow : 'none'
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Text inside cursor when hovering special elements */}
          <AnimatePresence>
            {isHovering && cursorText && (
              <motion.div
                ref={cursorTextRef}
                className="text-center text-xs font-medium uppercase tracking-wider"
                style={{ color: cursorColor }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {cursorText}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      
      {/* Inner dot cursor */}
      <motion.div
        ref={cursorInnerRef}
        className="fixed pointer-events-none z-[101] rounded-full top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{ 
          top: mousePosition.y,
          left: mousePosition.x
        }}
        animate={{
          width: isHovering ? '0' : isPointer ? '8px' : '5px',
          height: isHovering ? '0' : isPointer ? '8px' : '5px',
          backgroundColor: cursorColor,
          opacity: isHovering ? 0 : 1,
          boxShadow: isPointer ? cursorGlow : 'none',
          x: 0,
          y: 0
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Cursor styles are added in index.css */}
    </>
  );
};

export default CustomCursor;
