import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const createParticleSystem = (container: HTMLElement): () => void => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000;
  
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  const primaryColor = new THREE.Color(0xd4af37);
  const secondaryColor = new THREE.Color(0xa0a0a0);
  
  for (let i = 0; i < count * 3; i += 3) {
    // Position
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
    
    // Color
    const colorMix = Math.random();
    const color = primaryColor.clone().lerp(secondaryColor, colorMix);
    
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });
  
  // Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // Lines between particles
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xa0a0a0,
    transparent: true,
    opacity: 0.2
  });
  
  const lines: THREE.Line[] = [];
  const maxConnections = 200; // Limit number of connections for performance
  const connectionDistance = 1.5;
  
  // Find close particles and connect them
  let connectionCount = 0;
  for (let i = 0; i < count; i++) {
    if (connectionCount >= maxConnections) break;
    
    const p1 = new THREE.Vector3(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );
    
    for (let j = i + 1; j < count; j++) {
      const p2 = new THREE.Vector3(
        positions[j * 3],
        positions[j * 3 + 1],
        positions[j * 3 + 2]
      );
      
      const distance = p1.distanceTo(p2);
      
      if (distance < connectionDistance) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
        lines.push(line);
        connectionCount++;
        
        if (connectionCount >= maxConnections) break;
      }
    }
  }
  
  // Animation
  const animate = () => {
    const animationId = requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;
    
    // Update line positions
    lines.forEach(line => {
      line.rotation.x += 0.0005;
      line.rotation.y += 0.0005;
    });
    
    renderer.render(scene, camera);
    
    // Store animation ID for cleanup
    animationIdRef.current = animationId;
  };
  
  const animationIdRef = { current: 0 };
  animate();
  
  // Handle resize
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationIdRef.current);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
};

export const useParticleBackground = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!containerRef.current) return;
    
    const cleanup = createParticleSystem(containerRef.current);
    return cleanup;
  }, [containerRef]);
};

export const createRotatingSkillRing = (scene: THREE.Scene, skills: string[]): THREE.Group => {
  const group = new THREE.Group();
  const radius = 2;
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
  
  // Placeholder spheres while waiting for text
  skills.forEach((skill, i) => {
    const angle = (i / skills.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = 0;
    
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xd4af37 })
    );
    
    sphere.position.set(x, y, z);
    group.add(sphere);
  });
  
  scene.add(group);
  
  // Animate rotation
  gsap.to(group.rotation, {
    y: Math.PI * 2,
    duration: 20,
    repeat: -1,
    ease: "none"
  });
  
  return group;
};