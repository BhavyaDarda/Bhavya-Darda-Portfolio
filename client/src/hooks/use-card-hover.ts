import { useRef, useEffect, RefObject } from 'react';

interface UseCardHoverOptions {
  perspective?: number;
  max?: number;
  scale?: number;
}

export const useCardHover = <T extends HTMLElement>(
  options: UseCardHoverOptions = {}
): RefObject<T> => {
  const {
    perspective = 1000,
    max = 10,
    scale = 1.05
  } = options;
  
  const cardRef = useRef<T>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * max;
      const rotateY = (centerX - x) / centerX * max;
      
      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [perspective, max, scale]);
  
  return cardRef;
};
