import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThemeStore } from '../lib/theme';
import { gsap } from 'gsap';

// Advanced material interfaces for TypeScript
interface FluidShaderMaterial extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    resolution: { value: THREE.Vector2 };
    mouse: { value: THREE.Vector2 };
    primaryColor: { value: THREE.Color };
    secondaryColor: { value: THREE.Color };
    accentColor: { value: THREE.Color };
    noiseIntensity: { value: number };
    pixelRatio: { value: number };
    waveSpeed: { value: number };
    distortionScale: { value: number };
  };
}

interface BackgroundShaderMaterial extends THREE.ShaderMaterial {
  uniforms: {
    time: { value: number };
    resolution: { value: THREE.Vector2 };
    baseColor: { value: THREE.Color };
    noiseScale: { value: number };
    aspectRatio: { value: number };
  };
}

class LuxuryBackground {
  // Core Three.js elements
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  
  // Background and fluid planes
  private backgroundMesh: THREE.Mesh;
  private fluidPlane: THREE.Mesh;
  private flyingLightPoints: THREE.Points;
  
  // Materials with custom shaders
  private backgroundMaterial: BackgroundShaderMaterial;
  private fluidMaterial: FluidShaderMaterial;
  
  // Animation and interaction props
  private raycaster: THREE.Raycaster;
  private animationFrameId: number | null = null;
  private mouse: THREE.Vector2 = new THREE.Vector2(0, 0);
  private lastTouch: THREE.Vector2 = new THREE.Vector2(0, 0);
  private targetMouse: THREE.Vector2 = new THREE.Vector2(0, 0);
  private touchActive: boolean = false;
  private currentThemeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };

  constructor(container: HTMLElement, themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  }) {
    // Store theme colors
    this.currentThemeColors = themeColors;
    
    // Initialize core components
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      70, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      5000
    );
    this.camera.position.z = 1000;
    
    // Create renderer with premium settings
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Use tone mapping for more realistic lighting
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);
    
    // Create dark gradient background
    this.backgroundMaterial = this.createBackgroundMaterial();
    const backgroundGeometry = new THREE.PlaneGeometry(2, 2);
    this.backgroundMesh = new THREE.Mesh(backgroundGeometry, this.backgroundMaterial);
    this.backgroundMesh.position.z = -1000;
    this.scene.add(this.backgroundMesh);
    
    // Create interactive fluid plane
    this.fluidMaterial = this.createFluidMaterial();
    const fluidGeometry = new THREE.PlaneGeometry(
      window.innerWidth * 1.5, 
      window.innerHeight * 1.5, 
      200, 200
    );
    this.fluidPlane = new THREE.Mesh(fluidGeometry, this.fluidMaterial);
    this.fluidPlane.position.z = -800;
    this.scene.add(this.fluidPlane);
    
    // Add flying light points
    this.flyingLightPoints = this.createFlyingLightPoints();
    this.scene.add(this.flyingLightPoints);
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Handle mouse/touch movement
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    document.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
  }
  
  private createFlyingLightPoints(): THREE.Points {
    // Create flying points with custom parameters
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // Parse theme colors
    const primaryColor = new THREE.Color(this.currentThemeColors.primary);
    const secondaryColor = new THREE.Color(this.currentThemeColors.secondary);
    const accentColor = new THREE.Color(this.currentThemeColors.accent);
    
    // Calculate depth range
    const maxDepth = 2000;
    const minDepth = -500;
    
    // Create particles with strategic placement
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a wide, deep field
      positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight * 3;
      positions[i * 3 + 2] = Math.random() * (maxDepth - minDepth) + minDepth;
      
      // Size varies with depth
      const z = positions[i * 3 + 2];
      const depthFactor = 1 - ((z - minDepth) / (maxDepth - minDepth));
      sizes[i] = 2 + 8 * depthFactor * depthFactor;
      
      // Color based on position and depth
      let particleColor;
      const colorRand = Math.random();
      
      if (colorRand < 0.5) {
        // Primary color with variation
        particleColor = primaryColor.clone();
      } else if (colorRand < 0.85) {
        // Secondary color with variation
        particleColor = secondaryColor.clone();
      } else {
        // Accent color (rarer, for highlights)
        particleColor = accentColor.clone();
        // Make accent colors slightly brighter
        particleColor.r = Math.min(1, particleColor.r * 1.2);
        particleColor.g = Math.min(1, particleColor.g * 1.2);
        particleColor.b = Math.min(1, particleColor.b * 1.2);
      }
      
      // Add slight color variations
      colors[i * 3] = particleColor.r * (0.85 + Math.random() * 0.15);
      colors[i * 3 + 1] = particleColor.g * (0.85 + Math.random() * 0.15);
      colors[i * 3 + 2] = particleColor.b * (0.85 + Math.random() * 0.15);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3)); // Renamed to avoid conflict
    
    // Create shader material for high-quality points
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 aColor; // Renamed to avoid conflict with Three.js built-in attributes
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = aColor;
          
          // Animate position based on sine waves
          vec3 pos = position;
          float speed = 0.2;
          float amplitude = 20.0;
          
          // Different wave patterns for each axis to create organic motion
          pos.x += sin(time * speed + position.z * 0.01) * amplitude * (0.3 + 0.7 * sin(position.y * 0.01));
          pos.y += cos(time * speed + position.x * 0.01) * amplitude * (0.3 + 0.7 * sin(position.z * 0.01));
          
          // Project to view space
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size attenuation based on distance
          gl_PointSize = size * pixelRatio * (1000.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Calculate distance from center for circular particles with smooth edges
          vec2 center = vec2(0.5, 0.5);
          float dist = length(gl_PointCoord - center) * 2.0;
          
          // Create gradient from center to edge
          float alpha = 1.0 - smoothstep(0.5, 1.0, dist);
          
          // Apply special bloom effect with inner core
          float coreSize = 0.4;
          float core = smoothstep(coreSize, 0.0, dist);
          vec3 finalColor = vColor * (1.0 + core * 0.5); // Brighter core
          
          // Apply special glow effect
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });
    
    return new THREE.Points(particleGeometry, pointMaterial);
  }
  
  private createBackgroundMaterial(): BackgroundShaderMaterial {
    // Parse background color
    const bgColor = new THREE.Color(this.currentThemeColors.background);
    
    // Create shader material for dynamic background
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        baseColor: { value: bgColor },
        noiseScale: { value: 0.6 },
        aspectRatio: { value: window.innerWidth / window.innerHeight }
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 baseColor;
        uniform float noiseScale;
        uniform float aspectRatio;
        
        varying vec2 vUv;
        
        // High-quality noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }
        
        void main() {
          // Create coordinate system with proper aspect ratio
          vec2 uv = vUv;
          uv.x *= aspectRatio;
          
          // Create multiple layers of noise for a rich background
          float noiseTime = time * 0.05;
          float scale1 = noiseScale * 0.8;
          float scale2 = noiseScale * 2.0;
          float scale3 = noiseScale * 4.0;
          
          // Multi-layered noise with different scales and speeds
          float noise1 = snoise(uv * scale1 + vec2(noiseTime * 0.2, noiseTime * 0.1)) * 0.5 + 0.5;
          float noise2 = snoise(uv * scale2 + vec2(-noiseTime * 0.1, noiseTime * 0.3)) * 0.3 + 0.5;
          float noise3 = snoise(uv * scale3 + vec2(noiseTime * 0.4, -noiseTime * 0.2)) * 0.2 + 0.5;
          
          // Combine noise layers
          float finalNoise = noise1 * 0.6 + noise2 * 0.3 + noise3 * 0.1;
          
          // Create radial gradient from center
          vec2 center = vec2(0.5 * aspectRatio, 0.5);
          float dist = length(uv - center) / (aspectRatio * 0.8);
          float radialGradient = 1.0 - smoothstep(0.0, 1.0, dist);
          
          // Apply vignette effect
          float vignette = radialGradient * 0.7 + 0.3;
          
          // Mix base color with noise and gradients
          vec3 color1 = baseColor;
          vec3 color2 = baseColor * 0.2; // Darker version for contrast
          
          // Final color with all effects combined
          vec3 finalColor = mix(color2, color1, finalNoise) * vignette;
          
          // Add subtle pulsing glow at center
          float pulse = 0.5 + 0.5 * sin(time * 0.2);
          float centerGlow = smoothstep(0.8, 0.0, dist) * 0.2 * pulse;
          finalColor += baseColor * centerGlow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: false
    }) as BackgroundShaderMaterial;
  }
  
  private createFluidMaterial(): FluidShaderMaterial {
    // Parse theme colors
    const primaryColor = new THREE.Color(this.currentThemeColors.primary);
    const secondaryColor = new THREE.Color(this.currentThemeColors.secondary);
    const accentColor = new THREE.Color(this.currentThemeColors.accent);
    
    // Create premium fluid shader
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        primaryColor: { value: primaryColor },
        secondaryColor: { value: secondaryColor },
        accentColor: { value: accentColor },
        noiseIntensity: { value: 1.0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        waveSpeed: { value: 0.5 },
        distortionScale: { value: 1.0 },
      },
      vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        uniform float distortionScale;
        
        varying vec2 vUv;
        varying float vDistortion;
        
        // Noise functions
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
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
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;

          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);

          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);

          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);

          vec4 s0 = floor(b0) * 2.0 + 1.0;
          vec4 s1 = floor(b1) * 2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));

          vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);

          // Normalise gradients
          vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;

          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
        }
        
        void main() {
          vUv = uv;
          
          // Multi-layered distortion effect
          float noiseScale = 0.1;
          float timeSpeed = time * 0.2;
          
          // Calculate distance from mouse for reactive waves
          vec2 mouseInfluence = mouse - uv;
          float mouseDistance = length(mouseInfluence);
          float mouseEffect = smoothstep(0.5, 0.0, mouseDistance) * 2.0;
          
          // Create base noise pattern
          float noise1 = snoise(vec3(position.x * noiseScale, position.y * noiseScale, timeSpeed)) * 30.0;
          float noise2 = snoise(vec3(position.x * noiseScale * 2.0, position.y * noiseScale * 2.0, timeSpeed * 1.5)) * 20.0;
          float noise3 = snoise(vec3(position.x * noiseScale * 4.0, position.y * noiseScale * 4.0, timeSpeed * 0.7)) * 10.0;
          
          // Combined noise with different frequencies
          float combinedNoise = noise1 + noise2 * 0.5 + noise3 * 0.25;
          
          // Add mouse-reactive ripples
          float rippleEffect = sin(mouseDistance * 20.0 - time * 5.0) * mouseEffect * 50.0;
          
          // Apply distortion to Z coordinate
          float finalDistortion = combinedNoise + rippleEffect;
          finalDistortion *= distortionScale;
          
          // Pass distortion value to fragment shader
          vDistortion = finalDistortion;
          
          // Apply the z-distortion to the vertex
          vec3 newPosition = position;
          newPosition.z += finalDistortion;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 primaryColor;
        uniform vec3 secondaryColor;
        uniform vec3 accentColor;
        uniform float noiseIntensity;
        uniform float waveSpeed;
        
        varying vec2 vUv;
        varying float vDistortion;
        
        // Hash function
        vec3 hash33(vec3 p3) {
          p3 = fract(p3 * vec3(443.897, 441.423, 437.195));
          p3 += dot(p3, p3.yxz + 19.19);
          return -1.0 + 2.0 * fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
        }
        
        // Smooth noise with 3D gradient interpolation
        float gradientNoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          
          // Cubic interpolation
          vec3 u = f * f * (3.0 - 2.0 * f);
          
          // Generate random vectors at each grid point
          vec3 v000 = hash33(i + vec3(0.0, 0.0, 0.0));
          vec3 v100 = hash33(i + vec3(1.0, 0.0, 0.0));
          vec3 v010 = hash33(i + vec3(0.0, 1.0, 0.0));
          vec3 v110 = hash33(i + vec3(1.0, 1.0, 0.0));
          vec3 v001 = hash33(i + vec3(0.0, 0.0, 1.0));
          vec3 v101 = hash33(i + vec3(1.0, 0.0, 1.0));
          vec3 v011 = hash33(i + vec3(0.0, 1.0, 1.0));
          vec3 v111 = hash33(i + vec3(1.0, 1.0, 1.0));
          
          // Calculate dot products between random vectors and distances
          float a000 = dot(v000, f - vec3(0.0, 0.0, 0.0));
          float a100 = dot(v100, f - vec3(1.0, 0.0, 0.0));
          float a010 = dot(v010, f - vec3(0.0, 1.0, 0.0));
          float a110 = dot(v110, f - vec3(1.0, 1.0, 0.0));
          float a001 = dot(v001, f - vec3(0.0, 0.0, 1.0));
          float a101 = dot(v101, f - vec3(1.0, 0.0, 1.0));
          float a011 = dot(v011, f - vec3(0.0, 1.0, 1.0));
          float a111 = dot(v111, f - vec3(1.0, 1.0, 1.0));
          
          // Trilinear interpolation
          return mix(
            mix(mix(a000, a100, u.x), mix(a010, a110, u.x), u.y),
            mix(mix(a001, a101, u.x), mix(a011, a111, u.x), u.y),
            u.z
          ) * 0.5 + 0.5;
        }
        
        void main() {
          // Create coordinate system
          vec2 uv = vUv;
          
          // Use distortion value from vertex shader to affect color
          float d = vDistortion * 0.01;
          
          // Create dynamic waves with multiple frequencies
          float t = time * waveSpeed;
          float wave1 = sin(uv.x * 10.0 + t) * 0.1 + sin(uv.y * 12.0 - t * 0.7) * 0.1;
          float wave2 = sin(uv.x * 20.0 - t * 1.3) * 0.05 + sin(uv.y * 24.0 + t * 0.9) * 0.05;
          float wave = wave1 + wave2;
          
          // Create multiple noise layers
          float noise1 = gradientNoise(vec3(uv * 3.0, t * 0.1)) * 0.5 + 0.5;
          float noise2 = gradientNoise(vec3(uv * 6.0, t * 0.2)) * 0.25 + 0.5;
          float noise3 = gradientNoise(vec3(uv * 12.0, t * 0.3)) * 0.125 + 0.5;
          
          // Combine noise layers
          float noise = (noise1 + noise2 + noise3) / 1.875;
          
          // Enhance contrast
          noise = pow(noise, 1.2);
          
          // Create smooth fluid-like color transitions
          vec3 baseColor = mix(secondaryColor, primaryColor, noise + d);
          vec3 highlightColor = mix(primaryColor, accentColor, noise * noise);
          
          // Apply wave patterns
          float waveIntensity = smoothstep(0.4, 0.6, noise);
          vec3 color = mix(baseColor, highlightColor, waveIntensity);
          
          // Add iridescent highlights
          float iridescence = pow(sin(d * 30.0 + noise * 5.0 + t), 2.0) * 0.5;
          color += accentColor * iridescence;
          
          // Add subtle glow based on distortion
          float glow = smoothstep(0.0, 0.1, abs(d)) * 0.2;
          color += primaryColor * glow;
          
          // Adjust luminance based on distortion to create depth effect
          float luminanceAdjust = smoothstep(-0.05, 0.05, d) * 0.2;
          color = mix(color * 0.9, color * 1.1, luminanceAdjust);
          
          // Create transparency for a flowing liquid effect
          float alpha = smoothstep(0.1, 0.3, noise + abs(d) * 5.0);
          alpha = min(0.9, alpha); // Limit maximum opacity
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    }) as FluidShaderMaterial;
  }
  
  onWindowResize(): void {
    // Update camera
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update shader uniforms
    if (this.fluidMaterial && this.fluidMaterial.uniforms) {
      this.fluidMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      this.fluidMaterial.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
    
    if (this.backgroundMaterial && this.backgroundMaterial.uniforms) {
      this.backgroundMaterial.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      this.backgroundMaterial.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
    }
  }
  
  onMouseMove(event: MouseEvent): void {
    // Calculate normalized mouse coordinates
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  }
  
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.touchActive = true;
      this.lastTouch.x = event.touches[0].clientX;
      this.lastTouch.y = event.touches[0].clientY;
      
      // Update target mouse position for fluid
      this.targetMouse.x = (this.lastTouch.x / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -((this.lastTouch.y / window.innerHeight) * 2 - 1);
    }
  }
  
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0 && this.touchActive) {
      this.lastTouch.x = event.touches[0].clientX;
      this.lastTouch.y = event.touches[0].clientY;
      
      // Update target mouse position for fluid
      this.targetMouse.x = (this.lastTouch.x / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -((this.lastTouch.y / window.innerHeight) * 2 - 1);
    }
  }
  
  onTouchEnd(): void {
    this.touchActive = false;
  }
  
  updateThemeColors(themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  }): void {
    this.currentThemeColors = themeColors;
    
    // Update fluid material colors with animation
    if (this.fluidMaterial && this.fluidMaterial.uniforms) {
      // Animate the color change smoothly
      const primaryColor = new THREE.Color(themeColors.primary);
      const secondaryColor = new THREE.Color(themeColors.secondary);
      const accentColor = new THREE.Color(themeColors.accent);
      
      gsap.to(this.fluidMaterial.uniforms.primaryColor.value, {
        r: primaryColor.r,
        g: primaryColor.g,
        b: primaryColor.b,
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(this.fluidMaterial.uniforms.secondaryColor.value, {
        r: secondaryColor.r,
        g: secondaryColor.g,
        b: secondaryColor.b,
        duration: 0.8,
        ease: "power2.inOut"
      });
      
      gsap.to(this.fluidMaterial.uniforms.accentColor.value, {
        r: accentColor.r,
        g: accentColor.g,
        b: accentColor.b,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
    
    // Update background material
    if (this.backgroundMaterial && this.backgroundMaterial.uniforms) {
      const bgColor = new THREE.Color(themeColors.background);
      gsap.to(this.backgroundMaterial.uniforms.baseColor.value, {
        r: bgColor.r,
        g: bgColor.g,
        b: bgColor.b,
        duration: 0.8,
        ease: "power2.inOut"
      });
    }
    
    // Update flying points
    this.updateFlyingPointsColors(themeColors);
  }
  
  updateFlyingPointsColors(themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  }): void {
    // Get point geometry and colors
    const pointsGeometry = this.flyingLightPoints.geometry;
    const colors = pointsGeometry.attributes.aColor as THREE.BufferAttribute; // Updated to match our renamed attribute
    
    // Parse theme colors
    const primaryColor = new THREE.Color(themeColors.primary);
    const secondaryColor = new THREE.Color(themeColors.secondary);
    const accentColor = new THREE.Color(themeColors.accent);
    
    // Update all particle colors
    const particleCount = colors.count;
    for (let i = 0; i < particleCount; i++) {
      let particleColor;
      const colorRand = i / particleCount; // Use consistent "random" based on index
      
      if (colorRand < 0.5) {
        // Primary color with variation
        particleColor = primaryColor.clone();
      } else if (colorRand < 0.85) {
        // Secondary color with variation
        particleColor = secondaryColor.clone();
      } else {
        // Accent color (rarer, for highlights)
        particleColor = accentColor.clone();
        // Make accent colors slightly brighter
        particleColor.r = Math.min(1, particleColor.r * 1.2);
        particleColor.g = Math.min(1, particleColor.g * 1.2);
        particleColor.b = Math.min(1, particleColor.b * 1.2);
      }
      
      // Add slight variations based on particle index
      const variationFactor = 0.85 + ((i * 137.5) % 100) / 100 * 0.15;
      colors.setXYZ(
        i,
        particleColor.r * variationFactor,
        particleColor.g * variationFactor,
        particleColor.b * variationFactor
      );
    }
    
    colors.needsUpdate = true;
  }
  
  animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    
    // Get elapsed time
    const elapsedTime = this.clock.getElapsedTime();
    
    // Smoothly interpolate mouse position for fluid motion
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
    
    // Update fluid shader uniforms
    if (this.fluidMaterial && this.fluidMaterial.uniforms) {
      // Update time for animation
      this.fluidMaterial.uniforms.time.value = elapsedTime;
      
      // Update mouse position (normalized 0-1 for shader)
      const normalizedMouseX = (this.mouse.x + 1) * 0.5;
      const normalizedMouseY = (this.mouse.y + 1) * 0.5;
      this.fluidMaterial.uniforms.mouse.value.set(normalizedMouseX, normalizedMouseY);
      
      // Animate wave speed based on mouse movement
      const mouseSpeed = Math.abs(this.targetMouse.x - this.mouse.x) + 
                         Math.abs(this.targetMouse.y - this.mouse.y);
      const targetWaveSpeed = 0.5 + mouseSpeed * 2.0;
      this.fluidMaterial.uniforms.waveSpeed.value += 
        (targetWaveSpeed - this.fluidMaterial.uniforms.waveSpeed.value) * 0.01;
    }
    
    // Update background shader
    if (this.backgroundMaterial && this.backgroundMaterial.uniforms) {
      this.backgroundMaterial.uniforms.time.value = elapsedTime;
    }
    
    // Update flying points
    if (this.flyingLightPoints && this.flyingLightPoints.material instanceof THREE.ShaderMaterial) {
      this.flyingLightPoints.material.uniforms.time.value = elapsedTime;
      
      // Rotate the points system for additional movement
      this.flyingLightPoints.rotation.y = elapsedTime * 0.03;
      this.flyingLightPoints.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
    }
    
    // Animate fluid plane
    if (this.fluidPlane) {
      // Scale plane with a subtle breathing effect
      const breatheFreq = 0.2;
      const breatheAmp = 0.02;
      const breatheFactor = 1 + Math.sin(elapsedTime * breatheFreq) * breatheAmp;
      
      this.fluidPlane.scale.set(breatheFactor, breatheFactor, 1);
      
      // Respond to mouse movement with subtle rotation
      const rotateAmplitude = 0.05;
      const targetRotationX = this.mouse.y * rotateAmplitude;
      const targetRotationY = -this.mouse.x * rotateAmplitude;
      
      this.fluidPlane.rotation.x += (targetRotationX - this.fluidPlane.rotation.x) * 0.02;
      this.fluidPlane.rotation.y += (targetRotationY - this.fluidPlane.rotation.y) * 0.02;
    }
    
    // Render scene
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
    
    // Clean up geometries and materials
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
    
    // Dispose renderer
    this.renderer.dispose();
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('touchstart', this.onTouchStart.bind(this));
    document.removeEventListener('touchmove', this.onTouchMove.bind(this));
    document.removeEventListener('touchend', this.onTouchEnd.bind(this));
  }
}

const LuxuryBackgroundComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<LuxuryBackground | null>(null);
  const { currentTheme } = useThemeStore();
  const [initialized, setInitialized] = useState(false);
  
  // Get theme colors for the background
  const getThemeColors = (): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  } => {
    switch (currentTheme) {
      case 'emerald':
        return {
          primary: '#10b981',
          secondary: '#065f46',
          accent: '#34d399',
          background: '#022c22'
        };
      case 'platinum':
        return {
          primary: '#e5e5e5',
          secondary: '#a3a3a3',
          accent: '#f5f5f5',
          background: '#171717'
        };
      case 'gold':
      default:
        return {
          primary: '#d4af37',
          secondary: '#856b0e',
          accent: '#f7df8b',
          background: '#0a0a0a'
        };
    }
  };
  
  // Initialize the background when component mounts
  useEffect(() => {
    if (containerRef.current && !initialized) {
      try {
        const themeColors = getThemeColors();
        backgroundRef.current = new LuxuryBackground(containerRef.current, themeColors);
        backgroundRef.current.start();
        setInitialized(true);
        
        // Cleanup
        return () => {
          if (backgroundRef.current) {
            backgroundRef.current.dispose();
            backgroundRef.current = null;
          }
        };
      } catch (error) {
        console.error("Failed to initialize Three.js background:", error);
      }
    }
  }, [initialized]);
  
  // Update theme colors when theme changes
  useEffect(() => {
    if (backgroundRef.current && initialized) {
      const newThemeColors = getThemeColors();
      backgroundRef.current.updateThemeColors(newThemeColors);
    }
  }, [currentTheme, initialized]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{ background: 'black' }}
    />
  );
};

export default LuxuryBackgroundComponent;