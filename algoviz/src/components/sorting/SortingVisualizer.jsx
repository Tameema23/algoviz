import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef } from 'react';
import { useStore } from '../../store';
import { SORTING_ALGORITHMS } from '../../algorithms/sorting';
import Controls from '../ui/Controls';
import PseudoCode from '../ui/PseudoCode';
import AlgoInfo from '../ui/AlgoInfo';
import StepMessage from '../ui/StepMessage';
import { useState } from 'react';

function Bar({ value, maxValue, index, total, state }) {
  const meshRef = useRef();
  const height = (value / maxValue) * 4 + 0.2;
  const width = Math.min(0.8, 8 / total);
  const spacing = Math.min(1.0, 10 / total);
  const x = (index - total / 2) * spacing;

  let color = '#1E3A5F';
  if (state === 'comparing') color = '#F59E0B';
  else if (state === 'swapping') color = '#EF4444';
  else if (state === 'sorted') color = '#00D9FF';
  else if (state === 'pivot') color = '#7C3AED';

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y += (height - meshRef.current.scale.y) * 0.15;
      meshRef.current.position.y = meshRef.current.scale.y / 2 - 0.1;
    }
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh ref={meshRef} scale={[width, height, width]} position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
      </mesh>
      {total <= 20 && (
        <Text position={[0, -0.4, 0]} fontSize={0.18} color="#94A3B8" anchorX="center">
          {value}
        </Text>
      )}
    </group>
  );
}

function Scene({ step }) {
  if (!step) return null;
  const { array, comparing, swapping, sorted, pivot } = step;
  const maxVal = Math.max(...array);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 10, -5]} intensity={0.3} color="#00D9FF" />
      <pointLight position={[10, 5, 5]} intensity={0.2} color="#7C3AED" />

      {array.map((val, i) => {
        let state = 'default';
        if (sorted && sorted.includes(i)) state = 'sorted';
        if (pivot === i) state = 'pivot';
        if (comparing && comparing.includes(i)) state = 'comparing';
        if (swapping && swapping.includes(i)) state = 'swapping';
        return <Bar key={i} value={val} maxValue={maxVal} index={i} total={array.length} state={state} />;
      })}

      {/* Floor grid */}
      <gridHelper args={[20, 20, '#1E2D40', '#111827']} position={[0, -0.1, 0]} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={25} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

const ALGO_KEYS = Object.keys(SORTING_ALGORITHMS);

export default function SortingVisualizer() {
  const { steps, currentStep, setSteps } = useStore();
  const [selectedAlgo, setSelectedAlgo] = useState('bubble');
  const [arraySize, setArraySize] = useState(20);
  const [customInput, setCustomInput] = useState('');
  const algo = SORTING_ALGORITHMS[selectedAlgo];
  const step = steps[currentStep];

  function generateRandom() {
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10);
    setSteps(algo.fn(arr));
  }

  function handleCustom() {
    const arr = customInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (arr.length > 0) setSteps(algo.fn(arr));
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        {/* Algorithm select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Algorithm</label>
          <div className="flex gap-2 flex-wrap">
            {ALGO_KEYS.map(key => (
              <button key={key}
                onClick={() => setSelectedAlgo(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: selectedAlgo === key ? 'rgba(0,217,255,0.15)' : 'rgba(17,24,39,0.8)',
                  border: `1px solid ${selectedAlgo === key ? '#00D9FF' : '#1E2D40'}`,
                  color: selectedAlgo === key ? '#00D9FF' : '#94A3B8',
                }}
              >
                {SORTING_ALGORITHMS[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Size: {arraySize}</label>
          <input type="range" min="5" max="50" value={arraySize}
            onChange={e => setArraySize(Number(e.target.value))}
            className="w-28 accent-accent cursor-pointer" />
        </div>

        {/* Custom input */}
        <div className="flex flex-col gap-1 flex-1 min-w-40">
          <label className="text-xs text-dim font-mono uppercase tracking-wider">Custom (comma separated)</label>
          <div className="flex gap-2">
            <input value={customInput} onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. 5, 3, 8, 1, 9"
              className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
            <button onClick={handleCustom}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-card border border-border text-dim hover:text-accent hover:border-accent/40 transition-all">
              Apply
            </button>
          </div>
        </div>

        <button onClick={generateRandom}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid #00D9FF', color: '#00D9FF' }}>
          Generate
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 3D Canvas */}
        <div className="flex-1 glass rounded-2xl overflow-hidden" style={{ minHeight: '400px' }}>
          <Canvas camera={{ position: [0, 4, 14], fov: 50 }} shadows>
            <Scene step={step} />
          </Canvas>
        </div>

        {/* Right panel */}
        <div className="w-56 flex flex-col gap-4">
          <AlgoInfo name={algo.name} time={algo.time} space={algo.space} description={algo.description} />
          <PseudoCode lines={algo.pseudocode} />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 items-center px-2">
        {[['#F59E0B', 'Comparing'], ['#EF4444', 'Swapping'], ['#00D9FF', 'Sorted'], ['#7C3AED', 'Pivot'], ['#1E3A5F', 'Unsorted']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-xs text-dim">{label}</span>
          </div>
        ))}
      </div>

      {step?.message && <StepMessage message={step.message} />}
      <Controls />
    </div>
  );
}
