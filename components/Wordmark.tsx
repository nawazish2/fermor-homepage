export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-2xl font-semibold tracking-tight ${className}`}
    >
      Fermor<span className="text-accent">.</span>
    </span>
  );
}
