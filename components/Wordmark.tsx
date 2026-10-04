export function Wordmark({
  className = "",
  plain = false,
}: {
  className?: string;
  /** No highlighter stroke, for dark backgrounds. */
  plain?: boolean;
}) {
  return (
    <span className={`font-display text-2xl ${className}`}>
      <span className={plain ? "" : "marker px-0.5"}>Fermor</span>
    </span>
  );
}
