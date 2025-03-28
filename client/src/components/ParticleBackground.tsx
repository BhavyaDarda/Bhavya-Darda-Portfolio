import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { useThemeStore } from '../lib/theme';

const ParticlesMaterial = () => {
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
  
  return new THREE.PointsMaterial({
    size: 0.015,
    sizeAttenuation: true,
    color: new THREE.Color(getParticleColor()),
    transparent: true,
    opacity: 0.8,
  });
};

const Particles = ({ count = 5000 }) => {
  const points = useRef<THREE.Points>(null);
  const { currentTheme } = useThemeStore();
  
  // Create particles geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i++) {
    // Random positions in a sphere
    posArray[i] = (Math.random() - 0.5) * 5;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  useFrame(() => {
    if (points.current) {
      points.current.rotation.x += 0.0002;
      points.current.rotation.y += 0.0002;
    }
  });
  
  // Update material when theme changes
  useEffect(() => {
    if (points.current && points.current.material) {
      const material = points.current.material as THREE.PointsMaterial;
      switch (currentTheme) {
        case 'emerald':
          material.color.set('#10b981');
          break;
        case 'platinum':
          material.color.set('#e5e5e5');
          break;
        case 'gold':
        default:
          material.color.set('#d4af37');
          break;
      }
    }
  }, [currentTheme]);
  
  return (
    <points ref={points} geometry={particlesGeometry} material={ParticlesMaterial()} />
  );
};

const ParticleBackground: React.FC = () => {
  return (
    <div id="particles-js" className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
