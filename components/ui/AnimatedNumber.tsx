"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Writes the tweened text straight into the DOM node so a count-up does not
// re-render React 60 times a second. The server-rendered text is the real value.
export function AnimatedNumber({
  value,
  format,
  className,
  fromZero = false,
  testId,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  /** Count up from zero on first paint. */
  fromZero?: boolean;
  testId?: string;
}) {
  const [initialText] = useState(() => format(value));
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isFirst = first.current;
    first.current = false;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const from = isFirst && fromZero ? 0 : shown.current;
    if (reduce || from === value) {
      shown.current = value;
      el.textContent = format(value);
      return;
    }
    shown.current = from;
    el.textContent = format(from);
    const start = performance.now();
    const duration = isFirst ? 1400 : 350;
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      shown.current = from + (value - from) * eased;
      el!.textContent = format(shown.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, format, fromZero]);

  return (
    <span ref={ref} className={className} data-testid={testId}>
      {initialText}
    </span>
  );
}
