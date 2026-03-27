export default function StepMessage({ message }) {
  if (!message) return null;
  return (
    <div className="glass rounded-xl px-4 py-2 border-l-2 border-accent">
      <p className="font-mono text-xs text-accent">{message}</p>
    </div>
  );
}
