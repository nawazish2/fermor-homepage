"use client";

import { useEffect, useRef, useState } from "react";
import { formatAxisINR, formatCompactINR } from "@/lib/finance/format";
import type { CurvePoint } from "@/lib/finance/sip";

const W = 460;
const H = 270;
const PAD = { top: 14, right: 12, bottom: 28, left: 56 };
const TWEEN_MS = 320;

function mix(a: CurvePoint[], b: CurvePoint[], k: number): CurvePoint[] {
  return b.map((p, i) => ({
    t: p.t,
    invested: a[i].invested + (p.invested - a[i].invested) * k,
    corpus: a[i].corpus + (p.corpus - a[i].corpus) * k,
  }));
}

export function GrowthChart({ points }: { points: CurvePoint[] }) {
  // Points on screen; they glide to the new curve when inputs change.
  const [shown, setShown] = useState(points);
  const shownRef = useRef(points);

  useEffect(() => {
    const from = shownRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t =
        reduce || from.length !== points.length
          ? 1
          : Math.min(1, (now - start) / TWEEN_MS);
      const next = t === 1 ? points : mix(from, points, 1 - Math.pow(1 - t, 3));
      shownRef.current = next;
      setShown(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points]);

  const years = points[points.length - 1].t;
  const maxVal = Math.max(1, ...shown.map((p) => p.corpus));
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (shown.length - 1)) * iw;
  const y = (v: number) => PAD.top + ih - (v / maxVal) * ih;

  const line = (key: "invested" | "corpus") =>
    shown
      .map(
        (p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`,
      )
      .join(" ");
  const corpusArea = `${line("corpus")} L${x(shown.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = points[points.length - 1];

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxVal);
  const xTicks = [
    { at: 0, label: "Today", anchor: "start" },
    { at: 0.5, label: `${Math.round(years / 2)} yr`, anchor: "middle" },
    { at: 1, label: `${years} yr`, anchor: "end" },
  ] as const;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Growth over ${years} years: you put in ${formatCompactINR(last.invested)}, it grows to ${formatCompactINR(last.corpus)}`}
      className="h-auto w-full"
    >
      {gridValues.map((v, i) => (
        <g key={i}>
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
      {xTicks.map((t) => (
        <text
          key={t.at}
          x={PAD.left + t.at * iw}
          y={H - 8}
          textAnchor={t.anchor}
          fontSize="12"
          fill="var(--color-ink-soft)"
          className="tabular-nums"
        >
          {t.label}
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
