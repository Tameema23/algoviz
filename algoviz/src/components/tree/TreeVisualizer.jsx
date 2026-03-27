import { useState } from 'react';
import { TreeNode, insertBSTHelper, searchBST, inorder, preorder, postorder, buildDefaultTree, treeToLayout, TREE_ALGORITHMS } from '../../algorithms/tree';
import AlgoInfo from '../ui/AlgoInfo';
import PseudoCode from '../ui/PseudoCode';

export default function TreeVisualizer() {
  const [root, setRoot] = useState(() => buildDefaultTree());
  const [selectedAlgo, setSelectedAlgo] = useState('inorder');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = { current: null };

  const layout = treeToLayout(root);
  const step = steps[currentStep] || null;
  const algo = TREE_ALGORITHMS[selectedAlgo];

  // SVG viewport
  const minX = Math.min(...layout.nodes.map(n => n.x), 0) - 40;
  const maxX = Math.max(...layout.nodes.map(n => n.x), 0) + 40;
  const minY = Math.min(...layout.nodes.map(n => n.y), 0) - 40;
  const maxY = Math.max(...layout.nodes.map(n => n.y), 0) + 80;
  const vw = maxX - minX || 400;
  const vh = maxY - minY || 300;

  function runTraversal(type) {
    setSelectedAlgo(type);
    let result;
    if (type === 'inorder') result = inorder(root);
    else if (type === 'preorder') result = preorder(root);
    else if (type === 'postorder') result = postorder(root);
    else if (type === 'search') {
      const val = parseInt(inputVal);
      if (isNaN(val)) return;
      result = searchBST(root, val);
    }
    setSteps(result || []);
    setCurrentStep(0);
  }

  function handleInsert() {
    const val = parseInt(inputVal);
    if (isNaN(val)) return;
    const newRoot = cloneTree(root);
    const stepsArr = [];
    insertBSTHelper(newRoot, val, stepsArr);
    setRoot(newRoot);
    setInputVal('');
  }

  function cloneTree(node) {
    if (!node) return null;
    const n = new TreeNode(node.val);
    n.id = node.id;
    n.left = cloneTree(node.left);
    n.right = cloneTree(node.right);
    return n;
  }

  function resetTree() {
    setRoot(buildDefaultTree());
    setSteps([]);
    setCurrentStep(0);
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
      }, 700);
    }
  }

  function getNodeColor(id) {
    if (!step) return '#1E3A5F';
    const node = layout.nodes.find(n => n.id === id);
    if (!node) return '#1E3A5F';
    if (step.action === 'visit' && step.node === node.val) return '#00D9FF';
    if (step.action === 'compare' && step.node === node.val) return '#F59E0B';
    if (step.action === 'found' && step.node === node.val) return '#10B981';
    if (step.action === 'goLeft' && step.node === node.val) return '#7C3AED';
    if (step.action === 'goRight' && step.node === node.val) return '#7C3AED';
    if (step.action === 'insert' && step.node === node.val) return '#10B981';
    return '#1E3A5F';
  }

  const visitedVals = steps.slice(0, currentStep + 1).filter(s => s.action === 'visit').map(s => s.node);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {['inorder', 'preorder', 'postorder'].map(t => (
            <button key={t} onClick={() => runTraversal(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background: selectedAlgo === t ? 'rgba(0,217,255,0.15)' : 'rgba(17,24,39,0.8)',
                border: `1px solid ${selectedAlgo === t ? '#00D9FF' : '#1E2D40'}`,
                color: selectedAlgo === t ? '#00D9FF' : '#94A3B8',
              }}>
              {TREE_ALGORITHMS[t].name}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex gap-2 items-center">
          <input value={inputVal} onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInsert()}
            placeholder="Value"
            className="w-20 bg-card border border-border rounded-lg px-2 py-1.5 text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
          <button onClick={handleInsert} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-accent hover:border-accent/40 transition-all">Insert</button>
          <button onClick={() => { setSelectedAlgo('search'); runTraversal('search'); }} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-accent hover:border-accent/40 transition-all">Search</button>
        </div>

        <div className="h-6 w-px bg-border" />

        {steps.length > 0 && (
          <>
            <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} className="px-2 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-text transition-all">◀</button>
            <button onClick={togglePlay}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{ background: 'rgba(0,217,255,0.1)', border: '1px solid #00D9FF', color: '#00D9FF' }}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))} className="px-2 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-text transition-all">▶</button>
            <span className="font-mono text-xs text-dim">Step {currentStep + 1}/{steps.length}</span>
          </>
        )}

        <button onClick={resetTree} className="px-3 py-1.5 rounded-lg text-xs bg-card border border-border text-dim hover:text-text transition-all ml-auto">Reset Tree</button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 glass rounded-2xl overflow-hidden flex flex-col">
          <svg width="100%" height="100%" viewBox={`${minX} ${minY} ${vw} ${vh}`} style={{ minHeight: '380px' }} preserveAspectRatio="xMidYMid meet">
            {/* Edges */}
            {layout.edges.map((e, i) => (
              <line key={i} x1={e.fx} y1={e.fy} x2={e.tx} y2={e.ty} stroke="#1E3A5F" strokeWidth="2" />
            ))}
            {/* Nodes */}
            {layout.nodes.map(n => {
              const color = getNodeColor(n.id);
              const isVisited = visitedVals.includes(n.val);
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`}>
                  <circle r={22} fill={color}
                    stroke={isVisited ? 'rgba(0,217,255,0.4)' : 'rgba(255,255,255,0.05)'}
                    strokeWidth={isVisited ? 2 : 1}
                    style={{ filter: color !== '#1E3A5F' ? 'drop-shadow(0 0 8px rgba(0,217,255,0.5))' : 'none', transition: 'fill 0.3s' }} />
                  <text textAnchor="middle" dy="0.35em" fill="white" fontSize="12" fontWeight="700"
                    fontFamily="JetBrains Mono, monospace" style={{ userSelect: 'none' }}>
                    {n.val}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Traversal order */}
          {visitedVals.length > 0 && (
            <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-dim font-mono">Order:</span>
              {visitedVals.map((v, i) => (
                <span key={i} className="font-mono text-xs px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,217,255,0.1)', color: '#00D9FF', border: '1px solid rgba(0,217,255,0.2)' }}>
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-56 flex flex-col gap-4">
          <AlgoInfo name={algo.name} time={algo.time} space={algo.space} description={algo.description} />
          <PseudoCode lines={algo.pseudocode} />
          {step && (
            <div className="glass rounded-xl p-3">
              <p className="text-xs font-mono text-dim mb-1">Current step</p>
              <p className="text-xs text-text">{step.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
