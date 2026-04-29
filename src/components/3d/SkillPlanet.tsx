import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webgl';

interface SkillNode {
  name: string;
  icon: string;
  color: string;
  position: [number, number, number];
}

const SKILLS: SkillNode[] = [
  { name: 'React', icon: '⚛️', color: '#00F0FF', position: [1.2, 0.8, 0.5] },
  { name: 'TypeScript', icon: '📘', color: '#B829F7', position: [-0.8, 1.0, 0.8] },
  { name: 'Vue', icon: '🟢', color: '#00F0FF', position: [0.5, -1.0, 0.9] },
  { name: 'Webpack', icon: '📦', color: '#B829F7', position: [-1.0, -0.5, 0.7] },
  { name: '可视化', icon: '📊', color: '#FF0080', position: [0.8, 0.3, -1.0] },
  { name: 'AI', icon: '🤖', color: '#FF0080', position: [-0.5, 0.6, -1.1] },
];

function WireframeSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 2]} />
      <meshBasicMaterial
        color="#00F0FF"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function SkillNodes({
  onHover,
}: {
  onHover: (skill: SkillNode | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  const nodes = useMemo(() => {
    return SKILLS.map((skill) => {
      const vec = new THREE.Vector3(...skill.position).normalize().multiplyScalar(1.55);
      return { ...skill, worldPos: vec.toArray() as [number, number, number] };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {nodes.map((skill) => (
        <mesh
          key={skill.name}
          position={skill.worldPos}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(skill.name);
            onHover(skill);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(null);
            onHover(null);
            document.body.style.cursor = 'auto';
          }}
          scale={hovered === skill.name ? 1.6 : 1}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={hovered === skill.name ? 1 : 0.7}
          />
          <Html
            distanceFactor={8}
            style={{
              pointerEvents: 'none',
              transition: 'all 0.3s',
              opacity: hovered === skill.name ? 1 : 0.5,
              transform: `scale(${hovered === skill.name ? 1.2 : 1})`,
            }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-lg"
              style={{
                background: `${skill.color}20`,
                border: `1px solid ${skill.color}60`,
                boxShadow: `0 0 15px ${skill.color}40`,
              }}
            >
              {skill.icon}
            </div>
          </Html>
        </mesh>
      ))}
    </group>
  );
}

function ConnectingLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const nodes = SKILLS.map((s) =>
      new THREE.Vector3(...s.position).normalize().multiplyScalar(1.55)
    );

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        points.push(nodes[i], nodes[j]);
      }
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += delta * 0.15;
      linesRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00F0FF" transparent opacity={0.08} />
    </lineSegments>
  );
}

function FallbackPlanet() {
  return (
    <div className="flex items-center justify-center h-[400px] md:h-[500px]">
      <div className="relative">
        {/* CSS fallback - rotating rings */}
        <div
          className="w-64 h-64 rounded-full border border-[#00F0FF]/20 animate-spin-slow"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute inset-4 rounded-full border border-[#B829F7]/20"
          style={{ animation: 'spin-slow 15s linear infinite reverse' }}
        />
        <div
          className="absolute inset-8 rounded-full border border-[#FF0080]/15"
          style={{ animation: 'spin-slow 10s linear infinite' }}
        />
        {/* Skill dots */}
        {SKILLS.map((skill, i) => {
          const angle = (i / SKILLS.length) * Math.PI * 2;
          const x = Math.cos(angle) * 80;
          const y = Math.sin(angle) * 80;
          return (
            <div
              key={skill.name}
              className="absolute w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                left: `calc(50% + ${x}px - 20px)`,
                top: `calc(50% + ${y}px - 20px)`,
                background: `${skill.color}15`,
                border: `1px solid ${skill.color}40`,
                boxShadow: `0 0 15px ${skill.color}30`,
              }}
            >
              {skill.icon}
            </div>
          );
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-gradient-cyber">技能</span>
        </div>
      </div>
    </div>
  );
}

export default function SkillPlanet() {
  const [hoveredSkill, setHoveredSkill] = useState<SkillNode | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setWebglAvailable(isWebGLAvailable());
  }, []);

  if (!webglAvailable) {
    return <FallbackPlanet />;
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <WireframeSphere />
        <ConnectingLines />
        <SkillNodes onHover={setHoveredSkill} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Hover tooltip */}
      {hoveredSkill && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-center pointer-events-none"
          style={{
            background: 'rgba(10, 10, 18, 0.9)',
            border: `1px solid ${hoveredSkill.color}50`,
            boxShadow: `0 0 20px ${hoveredSkill.color}30`,
          }}
        >
          <span className="text-lg mr-2">{hoveredSkill.icon}</span>
          <span className="font-semibold" style={{ color: hoveredSkill.color }}>
            {hoveredSkill.name}
          </span>
        </div>
      )}
    </div>
  );
}
