import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { useThemeStore } from '../lib/theme';

// Memoized Particles component to improve performance and prevent unnecessary re-renders
const Particles = ({ count = 3000 }) => {
  const points = useRef<THREE.Points>(null);
  const { currentTheme } = useThemeStore();
  
  // Get particle color based on theme
  const getParticleColor = (): string => {
    switch (currentTheme) {
      case 'emerald': return '#10b981';
      case 'platinum': return '#e5e5e5';
      case 'gold':
      default: return '#d4af37';
    }
  };
  
  // Create particles geometry using useMemo to prevent recreating on every render
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      // Random positions in a sphere
      posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    return geometry;
  }, [count]);
  
  // Create material using useMemo to prevent recreating on every render
  const particlesMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      color: new THREE.Color(getParticleColor()),
      transparent: true,
      opacity: 0.8,
    });
  }, [currentTheme]); // Recreate material only when theme changes
  
  // Apply slow rotation animation
  useFrame(() => {
    if (points.current) {
      points.current.rotation.x += 0.0002;
      points.current.rotation.y += 0.0002;
    }
  });
  
  // Update material color when theme changes
  useEffect(() => {
    if (particlesMaterial) {
      particlesMaterial.color.set(getParticleColor());
    }
  }, [currentTheme, particlesMaterial]);
  
  return (
    <points ref={points} geometry={particlesGeometry} material={particlesMaterial} />
  );
};

// Error boundary for Canvas component to prevent entire app from crashing
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="fixed inset-0 -z-10 bg-background"></div>;
    }

    return this.props.children;
  }
}

// Main ParticleBackground component
const ParticleBackground: React.FC = () => {
  return (
    <ErrorBoundary>
      <div id="particles-js" className="fixed inset-0 -z-10">
        <Canvas 
          camera={{ position: [0, 0, 1], fov: 75 }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.5} />
          <Particles />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default ParticleBackground;
