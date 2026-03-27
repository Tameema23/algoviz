export default function AlgoInfo({ name, time, space, description }) {
  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      <h3 className="font-display font-bold text-text text-lg">{name}</h3>
      <p className="text-sm text-dim leading-relaxed">{description}</p>
      <div className="flex gap-3">
        <div className="flex-1 bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-dim mb-1">Time</p>
          <p className="font-mono text-accent text-sm font-semibold">{time}</p>
        </div>
        <div className="flex-1 bg-card rounded-xl p-3 border border-border">
          <p className="text-xs text-dim mb-1">Space</p>
          <p className="font-mono text-accent2 text-sm font-semibold">{space}</p>
        </div>
      </div>
    </div>
  );
}
