import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webgl';

// Skill data - pure data, no React icons in 3D scene
interface SkillData {
  name: string;
  color: string;
  level: string;
  icon: string; // emoji or text symbol
  phi: number;   // spherical coordinate
  theta: number; // spherical coordinate
}

const SKILLS: SkillData[] = [
  { name: 'React', color: '#61DAFB', level: '精通', icon: '⚛', phi: 0.8, theta: 0.5 },
  { name: 'TypeScript', color: '#3178C6', level: '精通', icon: 'TS', phi: 2.2, theta: 1.0 },
  { name: 'Vue', color: '#42B883', level: '熟练', icon: '◆', phi: 1.5, theta: 2.1 },
  { name: 'Webpack', color: '#8DD6F9', level: '熟练', icon: '⬡', phi: 0.5, theta: 3.5 },
  { name: '可视化', color: '#FF6B9D', level: '擅长', icon: '📊', phi: 2.5, theta: 4.2 },
  { name: 'AI', color: '#F5C542', level: '探索中', icon: '🤖', phi: 1.2, theta: 5.5 },
];

const SPHERE_RADIUS = 2.2;

// Pause rendering when page is not visible
function VisibilityController() {
  const { gl } = useThree();

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        gl.setAnimationLoop(null);
      } else {
        gl.setAnimationLoop(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [gl]);

  return null;
}

// Particle sphere - hundreds of tiny dots forming a sphere outline
function ParticleSphere() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const baseColors = [
      new THREE.Color('#5A9E3F'),
      new THREE.Color('#3D8B5E'),
      new THREE.Color('#4A90C4'),
      new THREE.Color('#D4A017'),
      new THREE.Color('#6DB33F'),
    ];

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution for even spacing
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const theta = goldenAngle * i;

      const r = SPHERE_RADIUS + (Math.random() - 0.5) * 0.15;
      pos[i * 3] = Math.cos(theta) * radiusAtY * r;
      pos[i * 3 + 1] = y * r;
      pos[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;

      const color = baseColors[i % baseColors.length];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      siz[i] = 2.5 + Math.random() * 3;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Inner wireframe sphere for depth + nebula glow core
function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
      meshRef.current.rotation.x += delta * 0.02;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 0.05;
      // Gentle breathing scale
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
      glowRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <>
      {/* Nebula glow core - soft inner sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[SPHERE_RADIUS * 0.7, 32, 32]} />
        <meshBasicMaterial
          color="#6DB33F"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Second glow layer */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS * 0.5, 32, 32]} />
        <meshBasicMaterial
          color="#5BA3D9"
          transparent
          opacity={0.06}
        />
      </mesh>
      {/* Wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[SPHERE_RADIUS * 0.85, 2]} />
        <meshBasicMaterial
          color="#5A9E3F"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
    </>
  );
}

// Connection lines between skill nodes
function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);

  const lineData = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    const nodePositions = SKILLS.map((s) => {
      const x = SPHERE_RADIUS * Math.sin(s.phi) * Math.cos(s.theta);
      const y = SPHERE_RADIUS * Math.cos(s.phi);
      const z = SPHERE_RADIUS * Math.sin(s.phi) * Math.sin(s.theta);
      return new THREE.Vector3(x, y, z);
    });

    // Connect each node to its 3 nearest neighbors for denser network
    for (let i = 0; i < nodePositions.length; i++) {
      const distances = nodePositions
        .map((p, j) => ({ dist: nodePositions[i].distanceTo(p), index: j }))
        .filter((d) => d.index !== i)
        .sort((a, b) => a.dist - b.dist);

      for (let k = 0; k < Math.min(3, distances.length); k++) {
        const j = distances[k].index;
        if (j > i) {
          lines.push({
            start: nodePositions[i],
            end: nodePositions[j],
            color: SKILLS[i].color,
          });
        }
      }
    }
    return lines;
  }, []);

  useFrame((_, delta) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.08;
    }
  });

  const lineObjects = useMemo(() => {
    return lineData.map((ld) => {
      const points = [ld.start, ld.end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: ld.color,
        transparent: true,
        opacity: 0.45,
        linewidth: 1,
      });
      return new THREE.Line(geometry, material);
    });
  }, [lineData]);

  return (
    <group ref={linesRef}>
      {lineObjects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
}

// Floating skill labels
function SkillNodes({
  onHover,
  hoveredName,
}: {
  onHover: (name: string | null) => void;
  hoveredName: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const nodePositions = useMemo(() => {
    return SKILLS.map((s) => {
      const x = SPHERE_RADIUS * Math.sin(s.phi) * Math.cos(s.theta);
      const y = SPHERE_RADIUS * Math.cos(s.phi);
      const z = SPHERE_RADIUS * Math.sin(s.phi) * Math.sin(s.theta);
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {SKILLS.map((skill, i) => {
        const pos = nodePositions[i];
        const isHovered = hoveredName === skill.name;

        return (
          <group key={skill.name} position={[pos.x, pos.y, pos.z]}>
            {/* Glowing dot at node position */}
            <mesh>
              <sphereGeometry args={[isHovered ? 0.12 : 0.08, 16, 16]} />
              <meshBasicMaterial
                color={skill.color}
                transparent
                opacity={isHovered ? 1 : 0.9}
              />
            </mesh>

            {/* Glow ring */}
            {isHovered && (
              <mesh>
                <ringGeometry args={[0.12, 0.18, 32]} />
                <meshBasicMaterial
                  color={skill.color}
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* HTML label */}
            <Html
              distanceFactor={6}
              style={{
                pointerEvents: 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `scale(${isHovered ? 1.15 : 1})`,
              }}
              center
              position={[0, 0.3, 0]}
            >
              <div
                onMouseEnter={() => onHover(skill.name)}
                onMouseLeave={() => onHover(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isHovered ? '6px 14px' : '4px 10px',
                  borderRadius: '12px',
                  background: isHovered
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.8)',
                  border: `1.5px solid ${isHovered ? skill.color : skill.color + '60'}`,
                  boxShadow: isHovered
                    ? `0 4px 24px ${skill.color}50, 0 0 40px ${skill.color}20`
                    : `0 2px 12px rgba(0,0,0,0.06)`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  userSelect: 'none',
                  fontSize: isHovered ? '13px' : '12px',
                  fontWeight: isHovered ? 600 : 500,
                  color: isHovered ? skill.color : '#4A6B4A',
                  letterSpacing: '0.02em',
                }}
              >
                <span style={{ fontSize: '14px' }}>{skill.icon}</span>
                <span>{skill.name}</span>
                {isHovered && (
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      background: skill.color + '18',
                      color: skill.color,
                      fontWeight: 600,
                    }}
                  >
                    {skill.level}
                  </span>
                )}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// Ambient floating particles around the sphere
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 150;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = SPHERE_RADIUS * (1.3 + Math.random() * 1.2);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      // Gentle floating
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < posArray.length / 3; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.001;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#5A9E3F"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// CSS Fallback for non-WebGL browsers
function FallbackPlanet() {
  return (
    <div className="flex items-center justify-center h-[400px] md:h-[480px]">
      <div className="relative w-72 h-72">
        {/* Orbit rings */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px dashed rgba(109, 179, 63, 0.3)',
            animation: 'spin-slow 20s linear infinite',
          }}
        />
        <div
          className="absolute inset-6 rounded-full"
          style={{
            border: '1px dashed rgba(91, 163, 217, 0.25)',
            animation: 'spin-slow 15s linear infinite reverse',
          }}
        />
        <div
          className="absolute inset-12 rounded-full"
          style={{
            border: '1px dashed rgba(244, 208, 63, 0.2)',
            animation: 'spin-slow 10s linear infinite',
          }}
        />
        {/* Skill nodes */}
        {SKILLS.map((skill, i) => {
          const angle = (i / SKILLS.length) * Math.PI * 2;
          const x = Math.cos(angle) * 110;
          const y = Math.sin(angle) * 110;
          return (
            <div
              key={skill.name}
              className="absolute flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                left: `calc(50% + ${x}px - 30px)`,
                top: `calc(50% + ${y}px - 14px)`,
                background: 'rgba(255, 255, 255, 0.85)',
                border: `1px solid ${skill.color}50`,
                boxShadow: `0 2px 12px ${skill.color}20`,
                color: '#4A6B4A',
              }}
            >
              <span>{skill.icon}</span>
              <span>{skill.name}</span>
            </div>
          );
        })}
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(109, 179, 63, 0.25), rgba(91, 163, 217, 0.2))',
              border: '1.5px solid rgba(109, 179, 63, 0.4)',
            }}
          >
            <span className="text-xl font-bold text-gradient-spring">技能</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillPlanet() {
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);

  const handleHover = useCallback((name: string | null) => {
    setHoveredName(name);
  }, []);

  if (!webglAvailable) {
    return <FallbackPlanet />;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[480px]">
      <Canvas
        camera={{ position: [0, 0.5, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <VisibilityController />

        {/* Soft ambient light */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} color="#8CC63F" />

        {/* Particle sphere outline */}
        <ParticleSphere />

        {/* Inner wireframe for depth */}
        <WireframeSphere />

        {/* Connection lines */}
        <ConnectionLines />

        {/* Floating skill labels */}
        <SkillNodes onHover={handleHover} hoveredName={hoveredName} />

        {/* Ambient particles */}
        <AmbientParticles />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.4}
          dampingFactor={0.1}
          enableDamping
        />
      </Canvas>

      {/* Bottom hint */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs pointer-events-none"
        style={{ color: 'rgba(90, 107, 107, 0.4)' }}
      >
        拖拽旋转 · 悬停查看
      </div>
    </div>
  );
}
