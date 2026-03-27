import { useState, useRef } from 'react';
import { GRAPH_ALGORITHMS } from '../../algorithms/graph';
import AlgoInfo from '../ui/AlgoInfo';
import PseudoCode from '../ui/PseudoCode';

const DEFAULT_NODES = [
  { id: 'A', x: 200, y: 120 },
  { id: 'B', x: 100, y: 240 },
  { id: 'C', x: 300, y: 240 },
  { id: 'D', x: 60, y: 360 },
  { id: 'E', x: 180, y: 360 },
  { id: 'F', x: 340, y: 360 },
];
const DEFAULT_EDGES = [['A','B'],['A','C'],['B','D'],['B','E'],['C','F']];

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [selectedAlgo, setSelectedAlgo] = useState('bfs');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startNode, setStartNode] = useState('A');
  const [dragging, setDragging] = useState(null);
  const [addingEdge, setAddingEdge] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  const svgRef = useRef();
  const intervalRef = useRef();
  const algo = GRAPH_ALGORITHMS[selectedAlgo];

  const step = steps[currentStep] || null;

  function buildAdjList() {
    const adj = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(([a, b]) => {
      if (!adj[a]) adj[a] = [];
      adj[a].push(b);
    });
    return adj;
  }

  function runAlgo() {
    const adj = buildAdjList();
    const nodeIds = nodes.map(n => n.id);
    let result;
    if (selectedAlgo === 'topological' || selectedAlgo === 'cycle') {
      result = algo.fn(adj, nodeIds);
    } else {
      result = algo.fn(adj, startNode);
    }
    setSteps(result);
    setCurrentStep(0);
    setIsPlaying(false);
  }

  function togglePlay() {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 600);
    }
  }

  function getNodeColor(id) {
    if (!step) return '#1E3A5F';
    if (step.cycleFound && step.cycleNode === id) return '#EF4444';
    if (step.current === id) return '#00D9FF';
    if (step.inStack && step.inStack.has(id)) return '#F59E0B';
    if (step.visited && step.visited.has(id)) return '#7C3AED';
    return '#1E3A5F';
  }

  function addNode() {
    const name = newNodeName.trim().toUpperCase();
    if (!name || nodes.find(n => n.id === name)) return;
    setNodes(prev => [...prev, { id: name, x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 }]);
    setNewNodeName('');
  }

  function handleSvgMouseDown(e) {
    if (e.target.tagName === 'svg' || e.target.tagName === 'rect') {
      const rect = svgRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
    }
  }

  function handleNodeMouseDown(e, id) {
    e.stopPropagation();
    if (e.shiftKey) {
      if (!addingEdge) { setAddingEdge(id); }
      else {
        if (addingEdge !== id && !edges.some(([a, b]) => a === addingEdge && b === id)) {
          setEdges(prev => [...prev, [addingEdge, id]]);
        }
        setAddingEdge(null);
      }
      return;
    }
    setDragging(id);
  }

  function handleMouseMove(e) {
    if (!dragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    setNodes(prev => prev.map(n => n.id === dragging ? { ...n, x: e.clientX - rect.left, y: e.clientY - rect.top } : n));
  }

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(GRAPH_ALGORITHMS).map(([key, a]) => (
            <button key={key} onClick={() => setSelectedAlgo(key)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background: selectedAlgo === key ? 'rgba(0,217,255,0.15)' : 'rgba(17,24,39,0.8)',
                border: `1px solid ${selectedAlgo === key ? '#00D9FF' : '#1E2D40'}`,
                color: selectedAlgo === key ? '#00D9FF' : '#94A3B8',
              }}>
              {a.name}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        {(selectedAlgo === 'bfs' || selectedAlgo === 'dfs') && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-dim font-mono">Start:</span>
            <select value={startNode} onChange={e => setStartNode(e.target.value)}
              className="bg-card border border-border rounded-lg px-2 py-1 text-xs font-mono text-text focus:outline-none focus:border-accent/50">
              {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
          </div>
        )}

        <button onClick={runAlgo}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid #00D9FF', color: '#00D9FF' }}>
          Run
        </button>

        {steps.length > 0 && (
          <>
            <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-text transition-all">◀</button>
            <button onClick={togglePlay}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{ background: isPlaying ? 'rgba(124,58,237,0.15)' : 'rgba(0,217,255,0.1)', border: `1px solid ${isPlaying ? '#7C3AED' : '#00D9FF'}`, color: isPlaying ? '#A78BFA' : '#00D9FF' }}>
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-text transition-all">▶</button>
            <span className="font-mono text-xs text-dim">Step {currentStep + 1}/{steps.length}</span>
          </>
        )}

        <div className="h-6 w-px bg-border" />

        <div className="flex gap-2 items-center">
          <input value={newNodeName} onChange={e => setNewNodeName(e.target.value)}
            placeholder="Node name" maxLength={3}
            className="w-24 bg-card border border-border rounded-lg px-2 py-1.5 text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={addNode} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-accent hover:border-accent/40 transition-all">+ Node</button>
        </div>

        <span className="text-xs text-dim">Shift+click 2 nodes to add edge</span>
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* SVG canvas */}
        <div className="flex-1 glass rounded-2xl overflow-hidden">
          <svg ref={svgRef} width="100%" height="100%" style={{ minHeight: '400px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(null)}
            onMouseDown={handleSvgMouseDown}>

            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#4B5563" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map(([a, b], i) => {
              const na = nodeMap[a], nb = nodeMap[b];
              if (!na || !nb) return null;
              return (
                <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="#4B5563" strokeWidth="2" markerEnd="url(#arrow)"
                  strokeDasharray={step && step.visited && step.visited.has(a) && step.visited.has(b) ? '0' : '4,4'} />
              );
            })}

            {/* Nodes */}
            {nodes.map(n => (
              <g key={n.id} transform={`translate(${n.x},${n.y})`}
                style={{ cursor: addingEdge ? 'crosshair' : 'grab' }}
                onMouseDown={e => handleNodeMouseDown(e, n.id)}>
                <circle r={26} fill={getNodeColor(n.id)}
                  stroke={addingEdge === n.id ? '#F59E0B' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={addingEdge === n.id ? 3 : 1}
                  style={{ filter: getNodeColor(n.id) !== '#1E3A5F' ? 'drop-shadow(0 0 8px currentColor)' : 'none', transition: 'fill 0.3s' }} />
                <text textAnchor="middle" dy="0.35em" fill="white" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono, monospace" style={{ userSelect: 'none', pointerEvents: 'none' }}>
                  {n.id}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Right panel */}
        <div className="w-56 flex flex-col gap-4">
          <AlgoInfo name={algo.name} time={algo.time} space={algo.space} description={algo.description} />
          <PseudoCode lines={algo.pseudocode} />
          {step && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs font-mono text-dim mb-2">Current</p>
              <p className="font-mono text-accent text-sm">{step.current || '—'}</p>
              {step.order && <p className="text-xs text-dim mt-1">Order: {step.order.join(' → ')}</p>}
              {step.result && <p className="text-xs text-dim mt-1">Topo: {step.result.join(' → ')}</p>}
              {step.cycleFound && <p className="text-xs text-red-400 mt-1">Cycle detected!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
