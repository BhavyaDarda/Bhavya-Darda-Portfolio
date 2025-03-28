import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../lib/theme';

interface ShaderMaterialWithUniforms extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    color: { value: THREE.Color };
  };
}

class ParticleSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: THREE.Points<THREE.BufferGeometry, ShaderMaterialWithUniforms>;
  private particleCount: number = 2000;
  private particleGeometry: THREE.BufferGeometry;
  private particleMaterial: ShaderMaterialWithUniforms;
  private animationFrameId: number | null = null;
  private themeColor: string;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private windowHalfX: number = window.innerWidth / 2;
  private windowHalfY: number = window.innerHeight / 2;
  private clock: THREE.Clock;

  constructor(container: HTMLElement, themeColor: string) {
    this.themeColor = themeColor;
    this.clock = new THREE.Clock();
    
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      2000
    );
    this.camera.position.z = 1000;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    
    // Create particles
    this.particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    
    const color = new THREE.Color(this.themeColor);
    
    for (let i = 0; i < this.particleCount; i++) {
      // Positions - scatter in a 3D space
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      
      // Colors - base on theme with slight variations
      colors[i * 3] = color.r * (0.8 + Math.random() * 0.2);
      colors[i * 3 + 1] = color.g * (0.8 + Math.random() * 0.2);
      colors[i * 3 + 2] = color.b * (0.8 + Math.random() * 0.2);
      
      // Sizes - vary for depth effect
      sizes[i] = Math.random() * 5 + 1;
    }
    
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(this.themeColor) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Subtle movement
          vec3 pos = position;
          pos.x += sin(pos.z * 0.01 + time * 0.1) * 20.0;
          pos.y += cos(pos.x * 0.01 + time * 0.1) * 20.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular particles with soft edges
          float r = 0.5 * length(gl_PointCoord - vec2(0.5, 0.5));
          float alpha = 1.0 - smoothstep(0.4, 0.5, r);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    this.particleMaterial = shaderMaterial;
    this.particles = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particles);
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle mouse movement
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  onWindowResize(): void {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  onMouseMove(event: MouseEvent): void {
    this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
  }
  
  updateThemeColor(color: string): void {
    this.themeColor = color;
    
    // Update shader uniform
    if (this.particleMaterial.uniforms && this.particleMaterial.uniforms.color) {
      this.particleMaterial.uniforms.color.value = new THREE.Color(color);
    }
    
    // Update particles colors
    const colors = this.particleGeometry.attributes.color as THREE.BufferAttribute;
    const threeColor = new THREE.Color(color);
    
    for (let i = 0; i < this.particleCount; i++) {
      colors.setXYZ(
        i,
        threeColor.r * (0.8 + Math.random() * 0.2),
        threeColor.g * (0.8 + Math.random() * 0.2),
        threeColor.b * (0.8 + Math.random() * 0.2)
      );
    }
    
    colors.needsUpdate = true;
  }
  
  animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    // Update time uniform
    if (this.particleMaterial.uniforms && this.particleMaterial.uniforms.time) {
      this.particleMaterial.uniforms.time.value = this.clock.getElapsedTime();
    }
    
    // Rotate particles based on mouse movement
    this.particles.rotation.x += 0.0001;
    this.particles.rotation.y += 0.0002;
    
    // Move camera based on mouse position
    this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01;
    this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.01;
    this.camera.lookAt(this.scene.position);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  start(): void {
    if (!this.animationFrameId) {
      this.animate();
    }
  }
  
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  dispose(): void {
    this.stop();
    
    this.particleGeometry.dispose();
    this.particleMaterial.dispose();
    this.renderer.dispose();
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }
}

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
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
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      // Initialize particle system
      const color = getParticleColor();
      particleSystemRef.current = new ParticleSystem(containerRef.current, color);
      particleSystemRef.current.start();
      
      // Cleanup
      return () => {
        if (particleSystemRef.current) {
          particleSystemRef.current.dispose();
          particleSystemRef.current = null;
        }
      };
    } catch (error) {
      console.error("Failed to initialize Three.js:", error);
      return undefined;
    }
  }, []);
  
  // Update theme color when it changes
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.updateThemeColor(getParticleColor());
    }
  }, [currentTheme]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;