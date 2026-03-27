import { useState, useRef, useCallback } from 'react';
import { PATHFINDING_ALGORITHMS } from '../../algorithms/pathfinding';
import AlgoInfo from '../ui/AlgoInfo';
import PseudoCode from '../ui/PseudoCode';

const ROWS = 20, COLS = 40;
const START = [10, 5], END = [10, 34];

function makeGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

const CELL = 22;

export default function PathfindingVisualizer() {
  const [grid, setGrid] = useState(makeGrid);
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [selectedAlgo, setSelectedAlgo] = useState('bfs');
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState('wall'); // 'wall' | 'start' | 'end'
  const [start, setStart] = useState(START);
  const [end, setEnd] = useState(END);
  const isDrawing = useRef(false);
  const algo = PATHFINDING_ALGORITHMS[selectedAlgo];

  const toggleCell = useCallback((r, c) => {
    if (r === start[0] && c === start[1]) return;
    if (r === end[0] && c === end[1]) return;
    if (mode === 'wall') {
      setGrid(g => {
        const ng = g.map(row => [...row]);
        ng[r][c] = ng[r][c] === 1 ? 0 : 1;
        return ng;
      });
    } else if (mode === 'start') {
      setStart([r, c]);
    } else if (mode === 'end') {
      setEnd([r, c]);
    }
  }, [mode, start, end]);

  async function visualize() {
    setIsAnimating(true);
    setVisited([]);
    setPath([]);
    const result = algo.fn(grid, start, end);
    const speed = 18;

    for (let i = 0; i < result.visited.length; i++) {
      await new Promise(r => setTimeout(r, speed));
      setVisited(result.visited.slice(0, i + 1));
    }
    for (let i = 0; i < result.path.length; i++) {
      await new Promise(r => setTimeout(r, 40));
      setPath(result.path.slice(0, i + 1));
    }
    setIsAnimating(false);
  }

  function reset() {
    setGrid(makeGrid());
    setVisited([]);
    setPath([]);
    setStart(START);
    setEnd(END);
  }

  function clearPath() {
    setVisited([]);
    setPath([]);
  }

  function getCellColor(r, c) {
    if (r === start[0] && c === start[1]) return '#00D9FF';
    if (r === end[0] && c === end[1]) return '#F59E0B';
    if (grid[r][c] === 1) return '#1E2D40';
    const inPath = path.some(([pr, pc]) => pr === r && pc === c);
    if (inPath) return '#F59E0B';
    const inVisited = visited.some(([vr, vc]) => vr === r && vc === c);
    if (inVisited) return 'rgba(124,58,237,0.4)';
    return '#080C14';
  }

  function getCellBorder(r, c) {
    if (r === start[0] && c === start[1]) return '2px solid #00D9FF';
    if (r === end[0] && c === end[1]) return '2px solid #F59E0B';
    const inPath = path.some(([pr, pc]) => pr === r && pc === c);
    if (inPath) return '1px solid #F59E0B';
    return '1px solid #111827';
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {Object.entries(PATHFINDING_ALGORITHMS).map(([key, a]) => (
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

        <div className="flex gap-2">
          {[['wall', 'Draw Walls'], ['start', 'Move Start'], ['end', 'Move End']].map(([m, label]) => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background: mode === m ? 'rgba(124,58,237,0.15)' : 'rgba(17,24,39,0.8)',
                border: `1px solid ${mode === m ? '#7C3AED' : '#1E2D40'}`,
                color: mode === m ? '#A78BFA' : '#94A3B8',
              }}>
              {label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-border" />

        <button onClick={visualize} disabled={isAnimating}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid #00D9FF', color: '#00D9FF' }}>
          {isAnimating ? 'Running...' : 'Visualize'}
        </button>
        <button onClick={clearPath} disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-card border border-border text-dim hover:text-text transition-all">
          Clear Path
        </button>
        <button onClick={reset} disabled={isAnimating}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-card border border-border text-dim hover:text-text transition-all">
          Reset
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Grid */}
        <div className="flex-1 glass rounded-2xl p-4 overflow-auto">
          <div
            style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: '1px', userSelect: 'none' }}
            onMouseLeave={() => { isDrawing.current = false; }}
          >
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div key={`${r}-${c}`}
                  style={{
                    width: CELL, height: CELL,
                    background: getCellColor(r, c),
                    border: getCellBorder(r, c),
                    borderRadius: '2px',
                    cursor: 'crosshair',
                    transition: 'background 0.1s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px',
                  }}
                  onMouseDown={() => { isDrawing.current = true; toggleCell(r, c); }}
                  onMouseEnter={() => { if (isDrawing.current && mode === 'wall') toggleCell(r, c); }}
                  onMouseUp={() => { isDrawing.current = false; }}
                >
                  {r === start[0] && c === start[1] && <span style={{ color: '#080C14', fontWeight: 'bold' }}>S</span>}
                  {r === end[0] && c === end[1] && <span style={{ color: '#080C14', fontWeight: 'bold' }}>E</span>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-56 flex flex-col gap-4">
          <AlgoInfo name={algo.name} time={algo.time} space={algo.space} description={algo.description} />
          <PseudoCode lines={algo.pseudocode} />
          {/* Legend */}
          <div className="glass rounded-2xl p-4 space-y-2">
            <p className="text-xs font-mono text-dim uppercase tracking-widest mb-2">Legend</p>
            {[
              ['#00D9FF', 'Start'],
              ['#F59E0B', 'End / Path'],
              ['rgba(124,58,237,0.4)', 'Visited'],
              ['#1E2D40', 'Wall'],
              ['#080C14', 'Empty'],
            ].map(([color, label]) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-border" style={{ background: color }} />
                <span className="text-xs text-dim">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
