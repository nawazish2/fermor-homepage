import { Section } from "@/components/Section";
import { Reveal } from "@/components/ui/Reveal";
import { holdings, portfolioTotals } from "@/lib/data/portfolio";
import { formatCompactINR, formatINR } from "@/lib/finance/format";

function pct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function Portfolio() {
  const t = portfolioTotals(holdings);
  const tone = (n: number) => (n >= 0 ? "text-gain" : "text-loss");

  return (
    <Section>
      <Reveal>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Portfolio
            </p>
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Everything you own, in one honest view.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              Stocks, mutual funds and ETFs side by side, with gains shown
              against what you actually put in. Sample data shown.
            </p>
            <dl className="mt-8">
              <dt className="text-sm text-ink-soft">Current value</dt>
              <dd className="font-mono text-4xl tabular-nums tracking-tight">
                {formatCompactINR(t.current)}
              </dd>
            </dl>
            <dl className="mt-4 flex gap-10">
              <div>
                <dt className="text-sm text-ink-soft">Invested</dt>
                <dd className="font-mono tabular-nums">
                  {formatCompactINR(t.invested)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">Total gain</dt>
                <dd className={`font-mono tabular-nums ${tone(t.gain)}`}>
                  {t.gain >= 0 ? "+" : ""}
                  {formatCompactINR(t.gain)} ({pct(t.gainPct)})
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <table className="w-full text-sm">
              <caption className="sr-only">Sample holdings</caption>
              <thead className="hidden text-left text-xs uppercase tracking-widest text-ink-soft sm:table-header-group">
                <tr className="border-b border-rule">
                  <th className="py-3 font-medium">Holding</th>
                  <th className="py-3 text-right font-medium">Invested</th>
                  <th className="py-3 text-right font-medium">Current</th>
                  <th className="py-3 text-right font-medium">Gain</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const g = h.current - h.invested;
                  const gp = (g / h.invested) * 100;
                  return (
                    <tr
                      key={h.name}
                      className="block border-b border-rule py-4 sm:table-row sm:py-0"
                    >
                      <td className="block sm:table-cell sm:py-4">
                        <span className="block">{h.name}</span>
                        <span className="text-xs text-ink-soft">{h.type}</span>
                      </td>
                      <td className="hidden text-right font-mono tabular-nums sm:table-cell">
                        {formatINR(h.invested)}
                      </td>
                      <td className="mt-2 flex justify-between font-mono tabular-nums sm:mt-0 sm:table-cell sm:text-right">
                        <span className="text-xs text-ink-soft sm:hidden">
                          Current
                        </span>
                        {formatINR(h.current)}
                      </td>
                      <td
                        className={`flex justify-between font-mono tabular-nums sm:table-cell sm:text-right ${tone(g)}`}
                      >
                        <span className="text-xs text-ink-soft sm:hidden">
                          Gain
                        </span>
                        {pct(gp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
