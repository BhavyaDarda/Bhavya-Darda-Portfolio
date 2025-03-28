import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    
    // Animate progress 0 to 100
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 70);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-satin-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center">
        <div className="loader mb-4 w-12 h-12 border-4 border-primary border-b-transparent rounded-full animate-spin"></div>
        <p className="text-primary font-space text-sm tracking-wider">
          LOADING EXPERIENCE {Math.round(loadingProgress)}%
        </p>
      </div>
    </motion.div>
  );
};

export default Loader;
