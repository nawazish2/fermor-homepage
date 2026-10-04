export function ResultRow({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: "gain" | "loss";
  strong?: boolean;
}) {
  const color =
    tone === "gain" ? "text-gain" : tone === "loss" ? "text-loss" : "";
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd
        className={`tabular-nums ${color} ${strong ? "text-xl sm:text-2xl" : "text-base"}`}
      >
        {value}
      </dd>
    </div>
  );
}
