export default function PseudoCode({ lines = [], currentLine = -1 }) {
  return (
    <div className="glass rounded-2xl p-4 h-full">
      <p className="text-xs font-mono text-dim uppercase tracking-widest mb-3">Pseudocode</p>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div key={i}
            className="font-mono text-xs px-2 py-1 rounded-md transition-all duration-200"
            style={{
              background: i === currentLine ? 'rgba(0,217,255,0.1)' : 'transparent',
              borderLeft: i === currentLine ? '2px solid #00D9FF' : '2px solid transparent',
              color: i === currentLine ? '#00D9FF' : '#94A3B8',
              paddingLeft: line.startsWith('  ') ? '1.5rem' : '0.5rem',
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
