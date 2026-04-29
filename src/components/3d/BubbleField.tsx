import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ForestScene3D — A Three.js powered hero background
 * Features:
 *   1. Morphing organic sphere with vertex displacement (nature-inspired)
 *   2. Orbiting leaf/petal particles using THREE.Points
 *   3. Mouse-reactive distortion + gentle auto-animation
 *   4. Falling 2D leaves & petals overlay via Canvas 2D
 */

// ============ 2D Overlay Types ============
type FallingType = 'leaf' | 'petal' | 'dandelion';

interface FallingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  type: FallingType;
  color: string;
  alpha: number;
  baseAlpha: number;
  phase: number;
  phaseSpeed: number;
  swayAmplitude: number;
  swayFrequency: number;
}

const LEAF_COLORS = ['#6DB33F', '#8CC63F', '#5A9E3F', '#7BB848', '#4A8B2C', '#9ACD5A'];
const PETAL_COLORS = ['#F4D03F', '#FDEAA8', '#FFFFFF', '#FFE4B5', '#FFF8DC', '#F5E6CC'];

export default function BubbleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafOverlayRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const timeRef = useRef(0);
  const windRef = useRef({ x: 0.3, y: 0 });
  const particlesRef = useRef<FallingParticle[]>([]);

  // ============ 3D Scene Setup ============
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Three.js core ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // --- Morphing Organic Sphere ---
    const sphereGeometry = new THREE.IcosahedronGeometry(1.6, 64);
    const positionAttr = sphereGeometry.getAttribute('position');
    const originalPositions = new Float32Array(positionAttr.array);

    // Custom shader material for organic look
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#6DB33F') },
        uColor2: { value: new THREE.Color('#5BA3D9') },
        uColor3: { value: new THREE.Color('#F4D03F') },
        uOpacity: { value: 0.12 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        // Simplex-like noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
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
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vNormal = normal;
          vPosition = position;

          // Multi-octave noise displacement
          float noise1 = snoise(position * 1.5 + uTime * 0.15) * 0.25;
          float noise2 = snoise(position * 3.0 + uTime * 0.3) * 0.1;
          float noise3 = snoise(position * 6.0 - uTime * 0.2) * 0.05;
          float displacement = noise1 + noise2 + noise3;

          // Mouse influence — push vertices toward/away from mouse direction
          float mouseInfluence = dot(normalize(position.xy), uMouse) * 0.3;
          displacement += mouseInfluence * (0.5 + 0.5 * sin(uTime * 2.0 + length(position) * 3.0));

          vDisplacement = displacement;

          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uOpacity;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vDisplacement;

        void main() {
          // Fresnel-like edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.5);

          // Color mixing based on position + displacement
          float t = vPosition.y * 0.5 + 0.5 + vDisplacement * 0.5;
          vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, t));
          color = mix(color, uColor3, smoothstep(0.5, 1.0, t));

          // Add shimmer
          float shimmer = sin(vPosition.x * 10.0 + uTime * 1.5) * sin(vPosition.z * 10.0 + uTime * 1.2) * 0.15;

          float alpha = (fresnel * 0.6 + 0.15 + shimmer) * uOpacity * 5.0;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // --- Wireframe overlay for extra detail ---
    const wireMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color('#6DB33F') },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vPosition;

        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ * ns.x + ns.yyyy;
          vec4 y = y_ * ns.x + ns.yyyy;
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
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        void main() {
          vPosition = position;
          float noise1 = snoise(position * 1.5 + uTime * 0.15) * 0.25;
          float noise2 = snoise(position * 3.0 + uTime * 0.3) * 0.1;
          float noise3 = snoise(position * 6.0 - uTime * 0.2) * 0.05;
          float displacement = noise1 + noise2 + noise3;
          float mouseInfluence = dot(normalize(position.xy), uMouse) * 0.3;
          displacement += mouseInfluence * (0.5 + 0.5 * sin(uTime * 2.0 + length(position) * 3.0));
          vec3 newPosition = position + normal * displacement;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          gl_FragColor = vec4(uColor, 0.06);
        }
      `,
      transparent: true,
      wireframe: true,
      depthWrite: false,
    });

    const wireframe = new THREE.Mesh(sphereGeometry.clone(), wireMaterial);
    scene.add(wireframe);

    // --- Orbiting 3D particles (small glowing dots) ---
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);

    const colors3D = [
      new THREE.Color('#6DB33F'),
      new THREE.Color('#8CC63F'),
      new THREE.Color('#5BA3D9'),
      new THREE.Color('#F4D03F'),
      new THREE.Color('#FFFFFF'),
    ];

    for (let i = 0; i < particleCount; i++) {
      // Distribute on a sphere shell with some randomness
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 1.5;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
      particleSizes[i] = Math.random() * 3 + 1;
      particlePhases[i] = Math.random() * Math.PI * 2;

      const color = colors3D[Math.floor(Math.random() * colors3D.length)];
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeometry.setAttribute('phase', new THREE.BufferAttribute(particlePhases, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        attribute float size;
        attribute float phase;
        uniform float uTime;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Orbit animation
          float angle = uTime * 0.1 + phase;
          float cosA = cos(angle * 0.3);
          float sinA = sin(angle * 0.3);
          mat2 rot = mat2(cosA, -sinA, sinA, cosA);
          pos.xz = rot * pos.xz;

          // Breathing
          float breathe = sin(uTime * 0.5 + phase * 3.0) * 0.15;
          pos *= 1.0 + breathe;

          // Pulsing alpha
          vAlpha = 0.3 + 0.5 * pow(sin(uTime * 0.8 + phase * 5.0) * 0.5 + 0.5, 2.0);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor, glow * vAlpha * 0.5);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // --- Animation ---
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      if (!isVisibleRef.current) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseVec = new THREE.Vector2(mouseRef.current.x, mouseRef.current.y);

      // Update sphere uniforms
      sphereMaterial.uniforms.uTime.value = elapsed;
      sphereMaterial.uniforms.uMouse.value = mouseVec;
      wireMaterial.uniforms.uTime.value = elapsed;
      wireMaterial.uniforms.uMouse.value = mouseVec;
      particleMaterial.uniforms.uTime.value = elapsed;

      // Gentle auto-rotation
      sphere.rotation.y = elapsed * 0.08;
      sphere.rotation.x = Math.sin(elapsed * 0.05) * 0.15;
      wireframe.rotation.y = elapsed * 0.08;
      wireframe.rotation.x = Math.sin(elapsed * 0.05) * 0.15;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- Event handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ============ 2D Overlay for falling leaves & petals ============
  useEffect(() => {
    const canvas = canvasOverlayRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    const createParticle = (type: FallingType): FallingParticle => {
      switch (type) {
        case 'leaf':
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.3) * 0.4,
            vy: Math.random() * 0.4 + 0.2,
            size: Math.random() * 10 + 6,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
            type: 'leaf',
            color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
            alpha: Math.random() * 0.35 + 0.15,
            baseAlpha: Math.random() * 0.35 + 0.15,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.02 + 0.01,
            swayAmplitude: Math.random() * 1.5 + 0.5,
            swayFrequency: Math.random() * 0.02 + 0.01,
          };
        case 'petal':
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.3) * 0.3,
            vy: Math.random() * 0.3 + 0.15,
            size: Math.random() * 6 + 3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            type: 'petal',
            color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
            alpha: Math.random() * 0.3 + 0.1,
            baseAlpha: Math.random() * 0.3 + 0.1,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.025 + 0.01,
            swayAmplitude: Math.random() * 2 + 1,
            swayFrequency: Math.random() * 0.025 + 0.015,
          };
        case 'dandelion':
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.3) * 0.2,
            vy: -(Math.random() * 0.15 + 0.05),
            size: Math.random() * 3 + 2,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.01,
            type: 'dandelion',
            color: '#FFFFFF',
            alpha: Math.random() * 0.25 + 0.08,
            baseAlpha: Math.random() * 0.25 + 0.08,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.015 + 0.008,
            swayAmplitude: Math.random() * 2 + 1,
            swayFrequency: Math.random() * 0.015 + 0.008,
          };
      }
    };

    // Init 2D particles
    const particles: FallingParticle[] = [];
    for (let i = 0; i < 30; i++) particles.push(createParticle('leaf'));
    for (let i = 0; i < 25; i++) particles.push(createParticle('petal'));
    for (let i = 0; i < 15; i++) particles.push(createParticle('dandelion'));
    particlesRef.current = particles;

    const drawLeaf = (x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.6);
      ctx.bezierCurveTo(size * 0.4, -size * 0.4, size * 0.5, size * 0.2, 0, size * 0.6);
      ctx.bezierCurveTo(-size * 0.5, size * 0.2, -size * 0.4, -size * 0.4, 0, -size * 0.6);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha * 0.4;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.5);
      ctx.lineTo(0, size * 0.5);
      ctx.stroke();
      ctx.restore();
    };

    const drawPetal = (x: number, y: number, size: number, rotation: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawDandelion = (x: number, y: number, size: number, rotation: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#E8DCC8';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.3, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.3;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI - Math.PI / 2;
        const len = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(Math.cos(angle) * len, Math.sin(angle) * len, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const animateOverlay = () => {
      if (!isVisibleRef.current) {
        rafOverlayRef.current = requestAnimationFrame(animateOverlay);
        return;
      }

      timeRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      windRef.current.x = Math.sin(timeRef.current * 0.003) * 0.4 + 0.15;
      windRef.current.y = Math.cos(timeRef.current * 0.002) * 0.05;

      const parts = particlesRef.current;
      for (const p of parts) {
        p.phase += p.phaseSpeed;

        const windFactor = p.type === 'dandelion' ? 1.5 : p.type === 'petal' ? 1.2 : 0.8;
        p.vx += windRef.current.x * 0.005 * windFactor;
        p.vy += windRef.current.y * 0.003 * windFactor;

        p.x += Math.sin(p.phase * p.swayFrequency * 60) * p.swayAmplitude * 0.3;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.995;
        p.vy *= 0.995;

        if (p.type === 'leaf' || p.type === 'petal') {
          p.vy += 0.003;
          if (p.vy > 0.8) p.vy = 0.8;
          p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.06;
        } else {
          p.vy -= 0.002;
          if (p.vy < -0.3) p.vy = -0.3;
          p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.04;
        }

        const margin = 50;
        if (p.y > canvas.height + margin) { p.y = -margin; p.x = Math.random() * canvas.width; }
        if (p.y < -margin) { p.y = canvas.height + margin; p.x = Math.random() * canvas.width; }
        if (p.x < -margin) p.x = canvas.width + margin;
        if (p.x > canvas.width + margin) p.x = -margin;

        switch (p.type) {
          case 'leaf': drawLeaf(p.x, p.y, p.size, p.rotation, p.color, p.alpha); break;
          case 'petal': drawPetal(p.x, p.y, p.size, p.rotation, p.color, p.alpha); break;
          case 'dandelion': drawDandelion(p.x, p.y, p.size, p.rotation, p.alpha); break;
        }
      }

      ctx.globalAlpha = 1;
      rafOverlayRef.current = requestAnimationFrame(animateOverlay);
    };

    window.addEventListener('resize', debouncedResize);
    rafOverlayRef.current = requestAnimationFrame(animateOverlay);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      cancelAnimationFrame(rafOverlayRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {/* Three.js 3D scene */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ opacity: 0.85 }}
      />
      {/* 2D falling particles overlay */}
      <canvas
        ref={canvasOverlayRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
