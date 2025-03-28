import React, { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  // Create refs for all cursor elements
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<(HTMLDivElement | null)[]>([]);
  const magneticRef = useRef<HTMLDivElement>(null);
  
  // Store theme and interaction states
  const { currentTheme } = useThemeStore();
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isPointer, setIsPointer] = useState<boolean>(false);
  const [isMagnetic, setIsMagnetic] = useState<boolean>(false);
  const [isClick, setIsClick] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [magneticTarget, setMagneticTarget] = useState<HTMLElement | null>(null);
  
  // Store positions for calculations
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const moveTimeoutRef = useRef<number | null>(null);
  
  // Animation and effect-related state
  const [cursorVelocity, setCursorVelocity] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Number of trail elements to create
  const TRAIL_COUNT = 8;
  
  // Get theme-based colors with enhanced variations
  const getThemeColors = () => {
    let primary, secondary, accent, glow;
    
    switch (currentTheme) {
      case 'emerald':
        primary = '#10b981';
        secondary = '#065f46';
        accent = '#34d399';
        glow = '0 0 20px rgba(16, 185, 129, 0.7)';
        break;
      case 'platinum':
        primary = '#e5e5e5';
        secondary = '#a3a3a3';
        accent = '#f5f5f5';
        glow = '0 0 20px rgba(229, 229, 229, 0.7)';
        break;
      case 'gold':
      default:
        primary = '#d4af37';
        secondary = '#856b0e';
        accent = '#f7df8b';
        glow = '0 0 20px rgba(212, 175, 55, 0.7)';
    }
    
    return { primary, secondary, accent, glow };
  };
  
  // Initialize cursor when component mounts
  useEffect(() => {
    // Show cursor after a slight delay to avoid jumpy start
    const loadTimer = setTimeout(() => {
      setHasLoaded(true);
      setIsVisible(true);
    }, 300);
    
    // Handle user mouse interaction
    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);
    
    // Add event listeners for cursor visibility
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      clearTimeout(loadTimer);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);
  
  // Setup main cursor interactions and behavior
  useEffect(() => {
    if (!hasLoaded) return;
    
    const cursorOuter = cursorOuterRef.current;
    const cursorInner = cursorInnerRef.current;
    const cursorTextElement = cursorTextRef.current;
    const magneticElement = magneticRef.current;
    
    if (!cursorOuter || !cursorInner || !cursorTextElement || !magneticElement) return;
    
    // Track cursor position with custom smoothing
    const updateCursor = (e: MouseEvent) => {
      // Store previous position before updating
      setPrevMousePosition({ x: mousePosition.x, y: mousePosition.y });
      
      // Update current position
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Calculate velocity for effects
      const now = Date.now();
      const dt = now - lastMoveTime.current;
      lastMoveTime.current = now;
      
      if (dt > 0) {
        const dx = e.clientX - prevMousePosition.x;
        const dy = e.clientY - prevMousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const velocity = Math.min(distance / dt * 20, 100); // Cap at reasonable value
        setCursorVelocity(velocity);
        
        // Set moving state for animation effects
        setIsMoving(velocity > 5);
        
        // Auto-reset moving state after a delay
        if (velocity > 5) {
          if (moveTimeoutRef.current) {
            clearTimeout(moveTimeoutRef.current);
          }
          moveTimeoutRef.current = window.setTimeout(() => {
            setIsMoving(false);
            moveTimeoutRef.current = null;
          }, 100);
        }
      }
    };
    
    // Track elements for interactions
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // First check for magnetic elements - highest priority
      const closestMagnetic = target.closest('.magnetic');
      if (target.classList.contains('magnetic') || closestMagnetic) {
        setIsMagnetic(true);
        // If target itself is magnetic, use that, otherwise use the closest magnetic element
        if (target.classList.contains('magnetic')) {
          setMagneticTarget(target);
        } else if (closestMagnetic instanceof HTMLElement) {
          setMagneticTarget(closestMagnetic);
        }
        return;
      }
      
      // Next check for data-cursor attributes for custom text
      let currentElement: HTMLElement | null = target;
      let cursorAttr = '';
      
      while (currentElement && !cursorAttr) {
        cursorAttr = currentElement.getAttribute('data-cursor') || '';
        if (!cursorAttr) {
          currentElement = currentElement.parentElement;
        }
      }
      
      // Apply custom cursor text if found
      if (cursorAttr) {
        setCursorText(cursorAttr);
        setIsHovering(true);
        return;
      }
      
      // Default behavior for standard interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsPointer(true);
      }
    };
    
    // Reset states when not hovering elements
    const handleMouseOut = () => {
      setIsHovering(false);
      setIsPointer(false);
      setIsMagnetic(false);
      setMagneticTarget(null);
      setCursorText('');
    };
    
    // Track mouse clicks for click animation
    const handleMouseDown = () => {
      setIsClick(true);
    };
    
    const handleMouseUp = () => {
      setIsClick(false);
    };
    
    // Apply magnetic effect when hovering magnetic elements
    const handleMagneticEffect = () => {
      if (isMagnetic && magneticTarget) {
        const element = magneticTarget;
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate distance between cursor and element center
        const distX = mousePosition.x - elementCenterX;
        const distY = mousePosition.y - elementCenterY;
        
        // Apply magnetic effect to cursor
        gsap.to(magneticElement, {
          x: mousePosition.x - distX * 0.5,
          y: mousePosition.y - distY * 0.5,
          duration: 0.2,
          ease: "power2.out"
        });
        
        // Also slightly move the element itself for a more interactive feel
        gsap.to(element, {
          x: distX * 0.1,
          y: distY * 0.1,
          duration: 0.3,
          ease: "power2.out"
        });
      } else if (magneticElement) {
        // Reset magnetic cursor position when not hovering
        gsap.to(magneticElement, {
          x: mousePosition.x,
          y: mousePosition.y,
          duration: 0.2,
          ease: "power3.out"
        });
        
        // Reset any previously affected elements
        document.querySelectorAll('.magnetic').forEach((el) => {
          gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "elastic.out(1, 0.3)"
          });
        });
      }
    };
    
    // Set up animation frame for magnetic effect
    const magneticFrameId = setInterval(handleMagneticEffect, 16);
    
    // Add all event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Hide default cursor
    document.body.classList.add('cursor-none');
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('cursor-none');
      clearInterval(magneticFrameId);
    };
  }, [hasLoaded, mousePosition, prevMousePosition, isMagnetic, magneticTarget]);
  
  // Update trail positions with delay
  useEffect(() => {
    if (!hasLoaded || !isVisible) return;
    
    // Animate trail elements with staggered delay
    trailsRef.current.forEach((trail, index) => {
      if (!trail) return;
      
      // Calculate delay based on index
      const delay = index * 0.03;
      
      gsap.to(trail, {
        x: mousePosition.x,
        y: mousePosition.y,
        duration: 0.5 + delay,
        ease: "power2.out",
        delay: delay
      });
    });
  }, [mousePosition, hasLoaded, isVisible]);
  
  // Get theme colors
  const { primary, secondary, accent, glow } = getThemeColors();
  
  // Main cursor animation variants with spring physics
  const cursorVariants = {
    default: {
      opacity: isVisible ? 1 : 0,
      scale: isClick ? 0.8 : isPointer ? 1.2 : 1,
      x: mousePosition.x,
      y: mousePosition.y,
      transition: { 
        opacity: { duration: 0.2 },
        scale: { duration: 0.15, ease: "easeOut" },
        x: { type: "spring", mass: 0.3, damping: 14, stiffness: 150 },
        y: { type: "spring", mass: 0.3, damping: 14, stiffness: 150 }
      }
    }
  };
  
  // Inner dot with faster response time
  const dotVariants = {
    default: {
      opacity: isVisible ? (isHovering ? 0 : 1) : 0,
      scale: isClick ? 0.6 : isPointer ? 1.4 : 1,
      x: mousePosition.x,
      y: mousePosition.y,
      transition: { 
        opacity: { duration: 0.2 },
        scale: { duration: 0.15, ease: "easeOut" },
        x: { type: "spring", mass: 0.1, damping: 14, stiffness: 300 },
        y: { type: "spring", mass: 0.1, damping: 14, stiffness: 300 }
      }
    }
  };
  
  // Generate trail variants dynamically
  const getTrailVariant = (index: number) => {
    const delay = index * 0.04;
    const opacityBase = isVisible ? 0.3 : 0;
    const opacityFactor = (TRAIL_COUNT - index) / TRAIL_COUNT;
    
    return {
      opacity: isMoving ? opacityBase * opacityFactor : 0,
      scale: 0.8 - index * (0.8 / TRAIL_COUNT),
      transition: {
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 }
      }
    };
  };
  
  return (
    <>
      {/* Cursor glow effect - only visible during movement or interactions */}
      <motion.div
        className="fixed pointer-events-none z-[99] blur-[30px] rounded-full opacity-40"
        style={{ 
          backgroundColor: primary,
          width: isPointer ? '60px' : '40px',
          height: isPointer ? '60px' : '40px',
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isMoving ? 1.5 + (cursorVelocity * 0.01) : 1,
          opacity: isVisible ? (isMoving || isPointer ? 0.4 : 0.1) : 0,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{
          x: { type: "spring", mass: 0.1, damping: 14, stiffness: 150 },
          y: { type: "spring", mass: 0.1, damping: 14, stiffness: 150 },
          scale: { duration: 0.5, ease: "easeOut" },
          opacity: { duration: 0.3 }
        }}
      />
      
      {/* Trail elements with decreasing opacity */}
      {Array.from({ length: TRAIL_COUNT }).map((_, index) => (
        <motion.div
          key={`trail-${index}`}
          ref={el => trailsRef.current[index] = el}
          className="fixed pointer-events-none z-[99] rounded-full"
          style={{ 
            backgroundColor: isPointer ? accent : primary,
            width: '8px',
            height: '8px',
            x: mousePosition.x,
            y: mousePosition.y,
            marginLeft: '-4px',
            marginTop: '-4px'
          }}
          animate={getTrailVariant(index)}
          initial={{ opacity: 0, scale: 0 }}
        />
      ))}
      
      {/* Magnetic cursor element - visible only when hovering magnetic elements */}
      <motion.div
        ref={magneticRef}
        className="fixed pointer-events-none z-[100] flex items-center justify-center"
        style={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          marginLeft: '-25px',
          marginTop: '-25px'
        }}
        animate={{
          opacity: isVisible && isMagnetic ? 1 : 0,
          scale: isMagnetic ? 1 : 0,
        }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ 
          opacity: { duration: 0.2 },
          scale: { duration: 0.3, ease: "backOut" }
        }}
      >
        <div
          className="w-[50px] h-[50px] rounded-full border-2 flex items-center justify-center"
          style={{ 
            borderColor: accent,
            boxShadow: glow
          }}
        >
          <div 
            className="w-[20px] h-[20px] rounded-full" 
            style={{ backgroundColor: accent }}
          />
        </div>
      </motion.div>
      
      {/* Main outer cursor ring */}
      <motion.div
        ref={cursorOuterRef}
        className="fixed pointer-events-none z-[100] flex items-center justify-center"
        style={{ 
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: 'difference'
        }}
        variants={cursorVariants}
        animate="default"
        initial={{ opacity: 0, scale: 0.5 }}
      >
        <motion.div 
          className="rounded-full flex items-center justify-center"
          animate={{
            width: isHovering ? '120px' : isPointer ? '50px' : '40px',
            height: isHovering ? '120px' : isPointer ? '50px' : '40px',
            backgroundColor: isHovering ? `${primary}20` : 'rgba(0, 0, 0, 0)',
            borderColor: primary,
            borderWidth: isClick ? '1px' : '2px',
            boxShadow: isPointer ? glow : 'none',
            scale: isMoving ? 1 + (cursorVelocity * 0.002) : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated pulse effect for interactions */}
          {(isPointer || isHovering) && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 opacity-80"
              style={{ borderColor: isPointer ? accent : primary }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.5, 1] 
              }}
            />
          )}
          
          {/* Inner pulse when moving rapidly */}
          {isMoving && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: primary }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 0.2, 0], 
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.8,
                ease: "easeInOut" 
              }}
            />
          )}
          
          {/* Text inside cursor when hovering elements with data-cursor */}
          <AnimatePresence>
            {isHovering && cursorText && (
              <motion.div
                ref={cursorTextRef}
                className="text-center text-xs font-medium uppercase tracking-wider"
                style={{ color: accent }}
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
        className="fixed pointer-events-none z-[101] rounded-full"
        style={{ 
          translateX: '-50%',
          translateY: '-50%'
        }}
        variants={dotVariants}
        animate="default"
        initial={{ opacity: 0, scale: 0.5 }}
      >
        <motion.div
          animate={{
            width: isPointer ? '8px' : '5px',
            height: isPointer ? '8px' : '5px',
            backgroundColor: isPointer ? accent : primary,
            boxShadow: isPointer ? glow : 'none'
          }}
          className="rounded-full"
          transition={{ duration: 0.15 }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;
