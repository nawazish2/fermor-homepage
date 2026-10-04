import { formatCompactINR } from "@/lib/finance/format";
import type { SipPoint } from "@/lib/finance/sip";

const W = 400;
const H = 240;
const PAD = { top: 12, right: 8, bottom: 24, left: 52 };

export function GrowthChart({ series }: { series: SipPoint[] }) {
  const points = [{ year: 0, invested: 0, corpus: 0 }, ...series];
  const maxYear = Math.max(1, points[points.length - 1].year);
  const maxVal = Math.max(1, ...points.map((p) => p.corpus));
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (year: number) => PAD.left + (year / maxYear) * iw;
  const y = (v: number) => PAD.top + ih - (v / maxVal) * ih;

  const line = (key: "invested" | "corpus") =>
    points.map((p, i) => `${i ? "L" : "M"}${x(p.year)},${y(p[key])}`).join(" ");
  const corpusArea = `${line("corpus")} L${x(maxYear)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = points[points.length - 1];

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxVal);
  const xTicks = [0, Math.round(maxYear / 2), maxYear];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Growth over ${maxYear} years: invested ${formatCompactINR(last.invested)}, corpus ${formatCompactINR(last.corpus)}`}
      className="h-auto w-full"
    >
      {gridValues.map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(v)}
            y2={y(v)}
            stroke="var(--color-rule)"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={y(v) + 3.5}
            textAnchor="end"
            fontSize="10"
            fill="var(--color-ink-soft)"
            className="font-mono"
          >
            {formatCompactINR(v).replace("₹", "")}
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <text
          key={`${t}-${i}`}
          x={x(t)}
          y={H - 6}
          textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
          fontSize="10"
          fill="var(--color-ink-soft)"
          className="font-mono"
        >
          {t === 0 ? "0" : `${t}y`}
        </text>
      ))}
      <path d={corpusArea} fill="var(--color-accent-soft)" />
      <path d={line("corpus")} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      <path
        d={line("invested")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
    </svg>
  );
}
