import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/theme';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  // References for cursor elements
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  
  // Get current theme from the store
  const { currentTheme } = useThemeStore();
  
  // State variables for cursor behavior
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isPointer, setIsPointer] = useState<boolean>(false);
  const [isClick, setIsClick] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [mouseSpeed, setMouseSpeed] = useState<number>(0);
  
  // Use motion values for smoother animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Apply spring physics for premium, realistic cursor movement
  const springConfig = { damping: 25, stiffness: 400, mass: 0.15 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // For inner dot cursor - faster, more responsive
  const dotSpringConfig = { damping: 30, stiffness: 800, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);
  
  // Variables for measuring mouse speed
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(performance.now());
  
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
      case 'emerald': 
        return '0 0 10px rgba(16, 185, 129, 0.9), 0 0 20px rgba(16, 185, 129, 0.7), 0 0 35px rgba(16, 185, 129, 0.4), 0 0 50px rgba(16, 185, 129, 0.2)';
      case 'platinum': 
        return '0 0 10px rgba(229, 229, 229, 0.9), 0 0 20px rgba(229, 229, 229, 0.7), 0 0 35px rgba(229, 229, 229, 0.4), 0 0 50px rgba(229, 229, 229, 0.2)';
      case 'gold':
      default: 
        return '0 0 10px rgba(212, 175, 55, 0.9), 0 0 20px rgba(212, 175, 55, 0.7), 0 0 35px rgba(212, 175, 55, 0.4), 0 0 50px rgba(212, 175, 55, 0.2)';
    }
  };
  
  // Get secondary color for particles and accents
  const getSecondaryColor = () => {
    switch (currentTheme) {
      case 'emerald': return 'rgba(16, 185, 129, 0.4)';
      case 'platinum': return 'rgba(229, 229, 229, 0.4)';
      case 'gold':
      default: return 'rgba(212, 175, 55, 0.4)';
    }
  };
  
  useEffect(() => {
    // Show cursor only after a small delay to ensure everything loads properly
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);
    
    // Optimized, high-performance mouse tracking
    const updateCursor = (e: MouseEvent) => {
      // Track mouse speed
      const now = performance.now();
      const dt = now - lastMoveTime.current;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = Math.min(distance / (dt || 16.67), 1.5); // Cap max speed
      
      // Update mouse positions
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Update state only when meaningful movement occurs (optimization)
      if (speed > 0.05) {
        setIsMoving(true);
        setMouseSpeed(speed);
        // Reset moving state after a short delay
        clearTimeout(window.cursorMoveTimeout);
        window.cursorMoveTimeout = setTimeout(() => setIsMoving(false), 100);
      }
      
      // Store values for next calculation
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastMoveTime.current = now;
    };
    
    // Enhanced cursor appearance detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Detect interactive elements with improved traversal
      let currentElement: HTMLElement | null = target;
      let cursorAttr = '';
      let maxDepth = 5; // Limit depth for performance
      
      while (currentElement && !cursorAttr && maxDepth > 0) {
        cursorAttr = currentElement.getAttribute('data-cursor') || '';
        
        // Check if element is interactive through various means
        const computedStyle = window.getComputedStyle(currentElement);
        const isInteractive = 
          currentElement.tagName === 'A' || 
          currentElement.tagName === 'BUTTON' ||
          currentElement.tagName === 'INPUT' ||
          currentElement.tagName === 'SELECT' ||
          currentElement.tagName === 'TEXTAREA' ||
          currentElement.hasAttribute('role') ||
          currentElement.hasAttribute('tabindex') ||
          currentElement.classList.contains('cursor-pointer') ||
          currentElement.classList.contains('magnetic') ||
          computedStyle.cursor === 'pointer';
        
        if (isInteractive && !cursorAttr) {
          setIsPointer(true);
          return;
        }
        
        currentElement = currentElement.parentElement;
        maxDepth--;
      }
      
      // Handle custom cursor text
      if (cursorAttr) {
        setCursorText(cursorAttr);
        setIsHovering(true);
      } else {
        setIsPointer(false);
      }
    };
    
    // Mouse out with improved detection and fewer false negatives
    const handleMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget) {
        setIsHovering(false);
        setIsPointer(false);
        setCursorText('');
        return;
      }
      
      // Check if the new element is interactive
      let current: HTMLElement | null = relatedTarget;
      let isTargetInteractive = false;
      let maxDepth = 5;
      
      while (current && !isTargetInteractive && maxDepth > 0) {
        const computedStyle = window.getComputedStyle(current);
        isTargetInteractive = 
          current.tagName === 'A' || 
          current.tagName === 'BUTTON' ||
          current.tagName === 'INPUT' ||
          current.tagName === 'SELECT' ||
          current.tagName === 'TEXTAREA' ||
          current.hasAttribute('role') ||
          current.hasAttribute('tabindex') ||
          current.classList.contains('cursor-pointer') ||
          current.classList.contains('magnetic') ||
          computedStyle.cursor === 'pointer' ||
          !!current.getAttribute('data-cursor');
        
        current = current.parentElement;
        maxDepth--;
      }
      
      // Only reset if we're not over another interactive element
      if (!isTargetInteractive) {
        setIsHovering(false);
        setIsPointer(false);
        setCursorText('');
      }
    };
    
    // Click animation enhancements
    const handleMouseDown = () => {
      setIsClick(true);
    };
    
    const handleMouseUp = () => {
      setIsClick(false);
    };
    
    // Register event listeners with { passive: true } for performance
    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    // Hide default cursor
    document.body.classList.add('cursor-none');
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(window.cursorMoveTimeout);
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-none');
    };
  }, [mouseX, mouseY]); // Dependencies
  
  // Apply theme colors
  const cursorColor = getCursorColor();
  const cursorGlow = getCursorGlow();
  const secondaryColor = getSecondaryColor();
  
  // Don't render until visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <>
      {/* Premium cursor trail effect */}
      <motion.div 
        ref={cursorTrailRef}
        className="fixed pointer-events-none z-[99] top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 will-change-transform backdrop-blur-[1px] gpu-accelerated"
        style={{
          x: springX,
          y: springY,
          opacity: isMoving ? Math.min(mouseSpeed * 0.9, 0.5) : 0,
          scale: isMoving ? Math.min(1 + mouseSpeed * 0.7, 1.8) : 1,
          mixBlendMode: 'overlay'
        }}
      >
        <div 
          className="rounded-full"
          style={{
            width: '120px',
            height: '120px',
            background: `radial-gradient(circle, ${secondaryColor} 0%, rgba(0, 0, 0, 0.001) 75%)`,
            filter: `blur(${isMoving ? 12 : 8}px)`
          }}
        />
      </motion.div>
      
      {/* Main outer cursor ring */}
      <motion.div
        ref={cursorOuterRef}
        className="fixed pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center will-change-transform gpu-accelerated"
        style={{ 
          x: springX,
          y: springY,
          mixBlendMode: 'difference'
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className="flex items-center justify-center backdrop-blur-[2px] gpu-accelerated"
          style={{
            borderRadius: isHovering ? '50%' : '8px',
            clipPath: isPointer ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
          }}
          animate={{
            width: isHovering ? '130px' : isPointer ? '52px' : '44px',
            height: isHovering ? '130px' : isPointer ? '52px' : '44px',
            backgroundColor: isHovering ? `${cursorColor}15` : 'rgba(0, 0, 0, 0.001)',
            borderColor: cursorColor,
            borderWidth: isClick ? '1px' : '2px',
            boxShadow: isPointer ? cursorGlow : 'none',
            rotate: isPointer ? (isMoving ? mouseSpeed * 45 : 45) : isMoving ? mouseSpeed * 10 : 0,
          }}
          transition={{ 
            duration: 0.2,
            type: 'spring',
            damping: 20,
            stiffness: 300
          }}
        >
          {/* Animated inner glow effect */}
          <motion.div
            className="absolute z-0 gpu-accelerated"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.001)', // Set initial backgroundColor to avoid animation warning
              borderRadius: isHovering ? '50%' : '6px',
              clipPath: isPointer ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
            }}
            animate={{
              width: isHovering ? '128px' : isPointer ? '50px' : '40px',
              height: isHovering ? '128px' : isPointer ? '50px' : '40px',
              opacity: isClick ? 0.8 : 0.4,
              borderColor: cursorColor,
              borderWidth: '1px',
              scale: isClick ? 0.9 : 1,
              rotate: isPointer ? (isMoving ? mouseSpeed * 45 : 45) : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Text inside cursor when hovering special elements */}
          <AnimatePresence>
            {isHovering && cursorText && (
              <motion.div
                ref={cursorTextRef}
                className="text-center text-xs font-medium uppercase tracking-widest relative z-10 gpu-accelerated"
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
      
      {/* Highly responsive inner dot cursor */}
      <motion.div
        ref={cursorInnerRef}
        className="fixed pointer-events-none z-[101] transform -translate-x-1/2 -translate-y-1/2 will-change-transform gpu-accelerated"
        style={{ 
          x: dotX, 
          y: dotY,
          borderRadius: isPointer ? '0' : '50%',
          clipPath: isPointer ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
        }}
        animate={{
          width: isHovering ? '0' : isPointer ? '12px' : '6px',
          height: isHovering ? '0' : isPointer ? '12px' : '6px',
          backgroundColor: cursorColor,
          opacity: isHovering ? 0 : 1,
          boxShadow: isPointer ? cursorGlow : 'none',
          scale: isClick ? 0.5 : 1,
          rotate: isPointer ? 45 : 0
        }}
        transition={{ 
          duration: 0.08,
          ease: 'easeOut'
        }}
      />
    </>
  );
};

// For TypeScript
declare global {
  interface Window {
    cursorMoveTimeout: any;
  }
}

export default CustomCursor;
