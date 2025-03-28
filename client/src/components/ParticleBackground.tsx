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
    
    // Create particles with more interesting distribution patterns
    this.particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);
    
    const color = new THREE.Color(this.themeColor);
    
    // Create a mix of different distribution patterns
    for (let i = 0; i < this.particleCount; i++) {
      let x, y, z;
      
      // Apply different distribution patterns based on particle index
      if (i < this.particleCount * 0.3) {
        // 30% - Uniform random distribution in a cube
        x = (Math.random() - 0.5) * 2000;
        y = (Math.random() - 0.5) * 2000;
        z = (Math.random() - 0.5) * 2000;
      } 
      else if (i < this.particleCount * 0.6) {
        // 30% - Spherical distribution for a galaxy-like effect
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 500 + Math.random() * 1000;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }
      else if (i < this.particleCount * 0.8) {
        // 20% - Disk/spiral galaxy shape
        const radius = 200 + Math.pow(Math.random(), 2) * 1000;
        const theta = Math.random() * Math.PI * 20; // Multiple rotations for spiral
        
        x = radius * Math.cos(theta);
        y = (Math.random() - 0.5) * 200; // Thin disk
        z = radius * Math.sin(theta);
        
        // Add some noise to the disk
        x += (Math.random() - 0.5) * (radius * 0.1);
        z += (Math.random() - 0.5) * (radius * 0.1);
      } 
      else {
        // 20% - Nebula cloud effect with Gaussian distribution
        // Box-Muller transform for Gaussian distribution
        const u = Math.random();
        const v = Math.random();
        const r = Math.sqrt(-2 * Math.log(u));
        const theta = 2 * Math.PI * v;
        
        x = r * Math.cos(theta) * 600;
        y = r * Math.sin(theta) * 600;
        z = ((Math.random() - 0.5) * 2) * 600;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Enhanced color variations based on position
      const distanceFromCenter = Math.sqrt(x*x + y*y + z*z);
      const normalizedDistance = Math.min(1, distanceFromCenter / 1500);
      
      // Create color gradient based on distance
      let particleColor;
      if (normalizedDistance < 0.3) {
        // Core particles - brighter version of theme color
        particleColor = new THREE.Color(this.themeColor);
        particleColor.r = Math.min(1, particleColor.r * 1.5);
        particleColor.g = Math.min(1, particleColor.g * 1.5);
        particleColor.b = Math.min(1, particleColor.b * 1.5);
      } else if (normalizedDistance < 0.7) {
        // Mid-range particles - theme color with variation
        particleColor = new THREE.Color(this.themeColor);
      } else {
        // Outer particles - darker variant of theme color
        particleColor = new THREE.Color(this.themeColor);
        particleColor.r *= 0.7;
        particleColor.g *= 0.7;
        particleColor.b *= 0.7;
      }
      
      // Add some random variation to each particle
      colors[i * 3] = particleColor.r * (0.85 + Math.random() * 0.15);
      colors[i * 3 + 1] = particleColor.g * (0.85 + Math.random() * 0.15);
      colors[i * 3 + 2] = particleColor.b * (0.85 + Math.random() * 0.15);
      
      // Size variation: smaller particles in dense areas, larger particles in outer areas
      const baseSize = 2 + Math.random() * 6;
      const distanceEffect = normalizedDistance * 1.5;
      sizes[i] = baseSize * (0.5 + distanceEffect);
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
        varying float vDistance;
        uniform float time;
        
        // Noise functions for more organic movement
        // Based on improved Perlin noise
        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        
        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }
        
        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          // First corner
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          
          // Other corners
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          
          // Permutations
          i = mod289(i);
          vec4 p = permute(permute(permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
          // Gradients
          float n_ = 0.142857142857; // 1.0/7.0
          vec3 ns = n_ * D.wyz - D.xzx;
          
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        void main() {
          vColor = color;
          
          // Advanced organic movement using noise
          float noiseScale = 0.05;
          float timeScale = 0.2;
          vec3 pos = position;
          
          // Layer multiple noise frequencies for more complex movement
          float noise1 = snoise(vec3(pos.x * noiseScale, pos.y * noiseScale, time * timeScale)) * 25.0;
          float noise2 = snoise(vec3(pos.z * noiseScale * 2.0, pos.x * noiseScale * 2.0, time * timeScale * 1.5)) * 15.0;
          float noise3 = snoise(vec3(pos.y * noiseScale * 3.0, pos.z * noiseScale * 3.0, time * timeScale * 0.7)) * 10.0;
          
          // Apply noise to position
          pos.x += noise1;
          pos.y += noise2;
          pos.z += noise3;
          
          // Add subtle sine wave movement
          float waveX = sin(pos.z * 0.02 + time * 0.3) * 10.0;
          float waveY = cos(pos.x * 0.02 + time * 0.2) * 10.0;
          float waveZ = sin(pos.y * 0.02 + time * 0.25) * 10.0;
          
          pos.x += waveX;
          pos.y += waveY;
          pos.z += waveZ;
          
          // Calculate view-space position for distance effects
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float dist = -mvPosition.z;
          vDistance = dist;
          
          // Size attenuation with distance
          gl_PointSize = size * (300.0 / dist);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistance;
        uniform float time;
        
        void main() {
          // Improved circular particles with dynamic glow
          vec2 center = vec2(0.5, 0.5);
          float dist = length(gl_PointCoord - center);
          
          // Core of the particle
          float core = smoothstep(0.5, 0.0, dist);
          
          // Outer glow that pulses slightly
          float pulseFreq = 0.5;
          float pulseAmp = 0.1;
          float pulse = 1.0 + sin(time * pulseFreq) * pulseAmp;
          float glow = smoothstep(0.5 * pulse, 0.2, dist);
          
          // Distance fade to create depth
          float depthFade = min(1.0, 4000.0 / vDistance);
          
          // Combine core and glow with color
          vec3 finalColor = vColor * (core + glow * 0.6);
          
          // Adjust alpha based on core, glow, and distance
          float alpha = (core * 0.7 + glow * 0.3) * depthFade;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    }) as ShaderMaterialWithUniforms;
    
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
    
    // Update particles colors with preserved distribution patterns
    const colors = this.particleGeometry.attributes.color as THREE.BufferAttribute;
    const positions = this.particleGeometry.attributes.position as THREE.BufferAttribute;
    const threeColor = new THREE.Color(color);
    
    for (let i = 0; i < this.particleCount; i++) {
      // Get position data for the current particle
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      // Calculate distance from center to maintain spatial distribution effects
      const distanceFromCenter = Math.sqrt(x*x + y*y + z*z);
      const normalizedDistance = Math.min(1, distanceFromCenter / 1500);
      
      // Create color gradient based on distance
      let particleColor;
      if (normalizedDistance < 0.3) {
        // Core particles - brighter version of theme color
        particleColor = new THREE.Color(color);
        particleColor.r = Math.min(1, particleColor.r * 1.5);
        particleColor.g = Math.min(1, particleColor.g * 1.5);
        particleColor.b = Math.min(1, particleColor.b * 1.5);
      } else if (normalizedDistance < 0.7) {
        // Mid-range particles - theme color with variation
        particleColor = new THREE.Color(color);
      } else {
        // Outer particles - darker variant of theme color
        particleColor = new THREE.Color(color);
        particleColor.r *= 0.7;
        particleColor.g *= 0.7;
        particleColor.b *= 0.7;
      }
      
      // Add some random but stable variation to each particle
      // Use particle index as seed to maintain consistent look during theme changes
      const randomVariation = 0.85 + ((i * 137.5) % 100) / 100 * 0.15;
      colors.setXYZ(
        i,
        particleColor.r * randomVariation,
        particleColor.g * randomVariation,
        particleColor.b * randomVariation
      );
    }
    
    colors.needsUpdate = true;
  }
  
  animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    // Get elapsed time for animations
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update time uniform for shader animations
    if (this.particleMaterial.uniforms && this.particleMaterial.uniforms.time) {
      this.particleMaterial.uniforms.time.value = elapsedTime;
    }
    
    // Create dynamic rotation patterns
    // Slower base rotation
    const baseRotationSpeed = 0.00005;
    this.particles.rotation.x += baseRotationSpeed;
    this.particles.rotation.y += baseRotationSpeed * 2;
    
    // Add breathing motion to the entire system
    const breatheFrequency = 0.1;
    const breatheAmplitude = 0.03;
    const breatheEffect = Math.sin(elapsedTime * breatheFrequency) * breatheAmplitude;
    
    // Scale slightly with breathing
    this.particles.scale.x = 1 + breatheEffect;
    this.particles.scale.y = 1 + breatheEffect;
    this.particles.scale.z = 1 + breatheEffect;
    
    // Enhanced mouse influence with damping and momentum
    // Calculate target rotation based on mouse position
    const targetRotationX = this.mouseY * 0.0005;
    const targetRotationY = -this.mouseX * 0.0005;
    
    // Gradually ease the current rotation toward the target rotation
    this.particles.rotation.x += (targetRotationX - this.particles.rotation.x) * 0.01;
    this.particles.rotation.y += (targetRotationY - this.particles.rotation.y) * 0.01;
    
    // Add a gentle orbital motion
    const orbitRadius = 30;
    const orbitSpeed = 0.1;
    this.camera.position.x += (this.mouseX * 0.5 - this.camera.position.x + Math.sin(elapsedTime * orbitSpeed) * orbitRadius) * 0.01;
    this.camera.position.y += (-this.mouseY * 0.5 - this.camera.position.y + Math.cos(elapsedTime * orbitSpeed) * orbitRadius * 0.5) * 0.01;
    this.camera.position.z = 1000 + Math.sin(elapsedTime * 0.05) * 100;
    
    // Always look at the center of the scene
    this.camera.lookAt(this.scene.position);
    
    // Render with enhanced settings
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