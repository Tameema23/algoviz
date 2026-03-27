import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function FloatingBars() {
  const groupRef = useRef();
  const bars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 3 - 1,
      z: (Math.random() - 0.5) * 20,
      height: Math.random() * 3 + 0.5,
      color: ['#00D9FF', '#7C3AED', '#F59E0B', '#1E3A5F'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.children.forEach((child, i) => {
        const bar = bars[i];
        if (bar) {
          child.scale.y = bar.height + Math.sin(state.clock.elapsedTime * bar.speed + bar.phase) * 0.5;
          child.position.y = child.scale.y / 2 - 1;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[bar.x, bar.height / 2, bar.z]} scale={[0.4, bar.height, 0.4]}>
          <boxGeometry />
          <meshStandardMaterial color={bar.color} metalness={0.4} roughness={0.3} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function ParticleField() {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 300; i++) {
      pts.push((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30);
    }
    return new Float32Array(pts);
  }, []);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00D9FF" transparent opacity={0.4} />
    </points>
  );
}

const CATEGORIES = [
  { id: 'sorting', label: 'Sorting', icon: '▦', desc: 'Bubble, Merge, Quick, Heap...', color: '#00D9FF' },
  { id: 'pathfinding', label: 'Pathfinding', icon: '◈', desc: 'BFS, DFS, Dijkstra, A*...', color: '#7C3AED' },
  { id: 'graph', label: 'Graph', icon: '⬡', desc: 'BFS, DFS, Topological Sort...', color: '#F59E0B' },
  { id: 'tree', label: 'Trees', icon: '⌥', desc: 'BST, Inorder, Preorder...', color: '#10B981' },
  { id: 'searching', label: 'Searching', icon: '⊕', desc: 'Linear, Binary Search...', color: '#EC4899' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} />
            <pointLight position={[0, 0, 0]} intensity={1} color="#00D9FF" />
            <FloatingBars />
            <ParticleField />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Canvas>
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(8,12,20,0.3) 0%, rgba(8,12,20,0.85) 70%, rgba(8,12,20,1) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Algorithm Visualizer</p>
            <h1 className="font-display font-extrabold text-6xl md:text-8xl text-text leading-none mb-6">
              See the
              <span className="text-gradient block">Logic</span>
            </h1>
            <p className="text-dim text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Interactive 3D visualizations of sorting, pathfinding, graph, tree, and searching algorithms.
              Step through every comparison, swap, and traversal in real time.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            <button onClick={() => navigate('/sorting')}
              className="px-8 py-4 rounded-2xl font-display font-bold text-lg transition-all hover:scale-105"
              style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid #00D9FF', color: '#00D9FF', boxShadow: '0 0 30px rgba(0,217,255,0.2)' }}>
              Start Exploring
            </button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-5 h-8 rounded-full border border-dim flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-dim rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Category cards */}
      <div className="px-6 py-20 max-w-5xl mx-auto w-full">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="font-mono text-dim text-xs uppercase tracking-widest text-center mb-12">Choose a category</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                onClick={() => navigate(`/${cat.id}`)}
                className="glass rounded-2xl p-6 text-left transition-all group"
                style={{ borderColor: 'rgba(30,45,64,0.8)' }}>
                <div className="text-2xl mb-3" style={{ color: cat.color }}>{cat.icon}</div>
                <h3 className="font-display font-bold text-text mb-1 group-hover:text-gradient transition-all">{cat.label}</h3>
                <p className="text-xs text-dim leading-relaxed">{cat.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
