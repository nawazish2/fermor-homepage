import { Section } from "@/components/Section";
import { holdings, portfolioTotals } from "@/lib/data/portfolio";
import { formatCompactINR, formatINR } from "@/lib/finance/format";

function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function Portfolio() {
  const t = portfolioTotals(holdings);
  const tone = (n: number) => (n >= 0 ? "text-gain" : "text-loss");
  const rows = holdings.map((h) => ({
    ...h,
    gain: h.current - h.invested,
    gainPct: ((h.current - h.invested) / h.invested) * 100,
  }));
  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.gainPct)));

  return (
    <Section id="portfolio">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">
            Everything you own, in one honest view.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
            Stocks, mutual funds and ETFs side by side, with gains shown against
            what you actually put in. Sample data shown.
          </p>
          <dl className="mt-8">
            <dt className="text-sm text-ink-soft">Current value</dt>
            <dd className="font-display text-5xl tabular-nums">
              {formatCompactINR(t.current)}
            </dd>
          </dl>
          <dl className="mt-5 flex gap-10">
            <div>
              <dt className="text-sm text-ink-soft">Invested</dt>
              <dd className="text-lg tabular-nums">
                {formatCompactINR(t.invested)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-soft">Total gain</dt>
              <dd className={`text-lg tabular-nums ${tone(t.gain)}`}>
                {t.gain >= 0 ? "+" : ""}
                {formatCompactINR(t.gain)} ({pct(t.gainPct)})
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-rule bg-white px-4 py-2 sm:px-6">
          <table className="w-full text-sm">
            <caption className="sr-only">Sample holdings</caption>
            <thead className="hidden text-left text-ink-soft sm:table-header-group">
              <tr className="border-b border-rule">
                <th className="py-3 font-medium">Holding</th>
                <th className="py-3 text-right font-medium">Invested</th>
                <th className="py-3 text-right font-medium">Current</th>
                <th className="py-3 pl-6 font-medium">Gain</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.name}
                  role="row"
                  className="block border-b border-rule py-4 last:border-b-0 sm:table-row sm:py-0"
                >
                  <td role="cell" className="block sm:table-cell sm:py-4">
                    <span className="block font-medium">{r.name}</span>
                    <span className="text-xs text-ink-soft">{r.type}</span>
                  </td>
                  <td
                    role="cell"
                    className="hidden text-right tabular-nums sm:table-cell"
                  >
                    {formatINR(r.invested)}
                  </td>
                  <td
                    role="cell"
                    className="mt-2 flex justify-between tabular-nums sm:mt-0 sm:table-cell sm:text-right"
                  >
                    <span className="text-xs text-ink-soft sm:hidden">
                      Current
                    </span>
                    {formatINR(r.current)}
                  </td>
                  <td
                    role="cell"
                    className="mt-1 flex items-center justify-between gap-3 sm:mt-0 sm:table-cell sm:pl-6"
                  >
                    <span className="text-xs text-ink-soft sm:hidden">
                      Gain
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-paper-deep sm:block">
                        <span
                          className={`block h-full rounded-full ${r.gain >= 0 ? "bg-gain" : "bg-loss"}`}
                          style={{
                            width: `${(Math.abs(r.gainPct) / maxAbs) * 100}%`,
                          }}
                        />
                      </span>
                      <span className={`tabular-nums ${tone(r.gain)}`}>
                        {pct(r.gainPct)}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
