import { useStore } from '../../store';
import { usePlayback } from '../../hooks/usePlayback';

export default function Controls() {
  const { isPlaying, setIsPlaying, speed, setSpeed, prevStep, nextStep, reset, currentStep, steps } = useStore();
  usePlayback();

  const progress = steps.length > 0 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-border rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          useStore.getState().setCurrentStep(Math.floor(pct * (steps.length - 1)));
        }}>
        <div className="h-full bg-gradient-to-r from-accent to-accent2 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-between">
        {/* Step counter */}
        <span className="font-mono text-xs text-dim">
          Step {currentStep + 1} / {steps.length || 1}
        </span>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button onClick={reset} className="w-8 h-8 rounded-lg bg-card border border-border hover:border-accent/40 flex items-center justify-center text-dim hover:text-accent transition-all text-xs">
            ⏮
          </button>
          <button onClick={prevStep} className="w-8 h-8 rounded-lg bg-card border border-border hover:border-accent/40 flex items-center justify-center text-dim hover:text-accent transition-all text-xs">
            ◀
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all text-sm"
            style={{ background: isPlaying ? 'rgba(124,58,237,0.2)' : 'rgba(0,217,255,0.15)', border: `1px solid ${isPlaying ? '#7C3AED' : '#00D9FF'}`, color: isPlaying ? '#7C3AED' : '#00D9FF' }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={nextStep} className="w-8 h-8 rounded-lg bg-card border border-border hover:border-accent/40 flex items-center justify-center text-dim hover:text-accent transition-all text-xs">
            ▶
          </button>
          <button onClick={() => useStore.getState().setCurrentStep(steps.length - 1)} className="w-8 h-8 rounded-lg bg-card border border-border hover:border-accent/40 flex items-center justify-center text-dim hover:text-accent transition-all text-xs">
            ⏭
          </button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-dim font-mono">Speed</span>
          <input
            type="range" min="20" max="800" step="20"
            value={820 - speed}
            onChange={(e) => setSpeed(820 - Number(e.target.value))}
            className="w-20 accent-accent cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
