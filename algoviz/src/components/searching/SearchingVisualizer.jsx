import { useState } from 'react';
import { SEARCHING_ALGORITHMS } from '../../algorithms/searching';
import { useStore } from '../../store';
import Controls from '../ui/Controls';
import AlgoInfo from '../ui/AlgoInfo';
import PseudoCode from '../ui/PseudoCode';

export default function SearchingVisualizer() {
  const { steps, currentStep, setSteps } = useStore();
  const [selectedAlgo, setSelectedAlgo] = useState('linear');
  const [target, setTarget] = useState('');
  const [arraySize, setArraySize] = useState(20);
  const algo = SEARCHING_ALGORITHMS[selectedAlgo];
  const step = steps[currentStep];

  function generateAndSearch() {
    const t = parseInt(target);
    const arr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 5);
    if (!isNaN(t) && Math.random() > 0.4) arr[Math.floor(Math.random() * arr.length)] = t;
    setSteps(algo.fn(arr, isNaN(t) ? arr[0] : t));
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Controls */}
      <div className="glass rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {Object.entries(SEARCHING_ALGORITHMS).map(([key, a]) => (
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

        <div className="flex items-center gap-2">
          <label className="text-xs text-dim font-mono">Target:</label>
          <input value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g. 42"
            className="w-20 bg-card border border-border rounded-lg px-2 py-1.5 text-xs font-mono text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-dim font-mono">Size: {arraySize}</label>
          <input type="range" min="5" max="40" value={arraySize} onChange={e => setArraySize(Number(e.target.value))}
            className="w-24 accent-accent cursor-pointer" />
        </div>

        <button onClick={generateAndSearch}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid #00D9FF', color: '#00D9FF' }}>
          Generate & Search
        </button>
      </div>

      {/* Main area */}
      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col gap-4">
          {/* Array bars */}
          {step && (
            <div className="glass rounded-2xl p-6 flex-1 flex flex-col justify-end gap-2">
              {/* Binary search range indicator */}
              {selectedAlgo === 'binary' && step.low !== undefined && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-dim">low={step.low}</span>
                  <span className="text-xs font-mono text-dim">mid={step.mid}</span>
                  <span className="text-xs font-mono text-dim">high={step.high}</span>
                </div>
              )}
              <div className="flex items-end gap-1 justify-center flex-1">
                {step.array.map((val, i) => {
                  let color = '#1E3A5F';
                  let label = '';
                  if (step.current === i) { color = step.found ? '#10B981' : '#F59E0B'; }
                  if (selectedAlgo === 'binary') {
                    if (i === step.mid) { color = '#F59E0B'; label = 'mid'; }
                    if (i === step.low && !step.found) { color = i === step.mid ? color : 'rgba(0,217,255,0.3)'; }
                    if (i < step.low || (step.high !== undefined && i > step.high)) { color = '#0D1320'; }
                  }
                  if (step.found && i === step.current) color = '#10B981';

                  const maxVal = Math.max(...step.array);
                  const height = `${(val / maxVal) * 200}px`;

                  return (
                    <div key={i} className="flex flex-col items-center gap-1 transition-all">
                      {label && <span className="text-xs font-mono text-accent" style={{ fontSize: '9px' }}>{label}</span>}
                      <div style={{ width: Math.max(16, 480 / step.array.length) + 'px', height, background: color, borderRadius: '4px 4px 0 0', transition: 'all 0.2s', border: i === step.current ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '2px' }}>
                        {step.array.length <= 25 && <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{val}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {step.message && (
                <div className="glass rounded-xl px-4 py-2 border-l-2 border-accent mt-2">
                  <p className="font-mono text-xs text-accent">{step.message}</p>
                </div>
              )}
            </div>
          )}

          {!step && (
            <div className="glass rounded-2xl flex-1 flex items-center justify-center">
              <p className="text-dim font-mono text-sm">Generate an array to start searching</p>
            </div>
          )}

          <Controls />
        </div>

        {/* Right panel */}
        <div className="w-56 flex flex-col gap-4">
          <AlgoInfo name={algo.name} time={algo.time} space={algo.space} description={algo.description} />
          <PseudoCode lines={algo.pseudocode} />
          <div className="glass rounded-2xl p-4 space-y-2">
            <p className="text-xs font-mono text-dim uppercase tracking-widest mb-2">Legend</p>
            {[['#F59E0B','Checking'],['#10B981','Found'],['rgba(0,217,255,0.3)','Active Range'],['#0D1320','Eliminated'],['#1E3A5F','Default']].map(([c,l])=>(
              <div key={l} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{background:c,border:'1px solid rgba(255,255,255,0.1)'}}/>
                <span className="text-xs text-dim">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
