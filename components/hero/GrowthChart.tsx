import { formatAxisINR, formatCompactINR } from "@/lib/finance/format";
import type { SipPoint } from "@/lib/finance/sip";

const W = 460;
const H = 270;
const PAD = { top: 14, right: 12, bottom: 28, left: 56 };

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
      aria-label={`Growth over ${maxYear} years: invested ${formatCompactINR(last.invested)}, value ${formatCompactINR(last.corpus)}`}
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
            x={PAD.left - 8}
            y={y(v) + 4}
            textAnchor="end"
            fontSize="12"
            fill="var(--color-ink-soft)"
            className="tabular-nums"
          >
            {formatAxisINR(v)}
          </text>
        </g>
      ))}
      {xTicks.map((t, i) => (
        <text
          key={`${t}-${i}`}
          x={x(t)}
          y={H - 8}
          textAnchor={
            i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"
          }
          fontSize="12"
          fill="var(--color-ink-soft)"
          className="tabular-nums"
        >
          {t === 0 ? "Today" : `${t} yr`}
        </text>
      ))}
      <path
        className="draw-area"
        d={corpusArea}
        fill="var(--color-accent-soft)"
      />
      <path
        d={line("invested")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.75"
        strokeDasharray="5 4"
      />
      <path
        className="draw-line"
        pathLength={1}
        d={line("corpus")}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
