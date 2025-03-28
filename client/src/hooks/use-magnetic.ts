import { useRef, useEffect, RefObject } from 'react';

interface UseMagneticOptions {
  strength?: number;
  radius?: number;
  releaseSpeed?: number;
}

export const useMagnetic = <T extends HTMLElement>(
  options: UseMagneticOptions = {}
): RefObject<T> => {
  const {
    strength = 0.1,
    radius = 150,
    releaseSpeed = 0.1,
  } = options;
  
  const elementRef = useRef<T>(null);
  const animationRef = useRef<number>();
  const isAnimating = useRef(false);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < radius) {
        isAnimating.current = true;
        targetPosition.current = {
          x: distanceX * strength,
          y: distanceY * strength,
        };
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      }
    };
    
    const handleMouseLeave = () => {
      targetPosition.current = { x: 0, y: 0 };
    };
    
    const animate = () => {
      // Move current position towards target with easing
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * releaseSpeed;
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * releaseSpeed;
      
      // Apply transform
      element.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px)`;
      
      // Stop animation if close enough to target
      const distanceToTarget = Math.abs(currentPosition.current.x - targetPosition.current.x) + 
                             Math.abs(currentPosition.current.y - targetPosition.current.y);
      
      if (distanceToTarget < 0.1 && targetPosition.current.x === 0 && targetPosition.current.y === 0) {
        isAnimating.current = false;
        element.style.transform = '';
        cancelAnimationFrame(animationRef.current!);
        animationRef.current = undefined;
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [strength, radius, releaseSpeed]);
  
  return elementRef;
};
