import { Section } from "@/components/Section";
import { holdings } from "@/lib/data/portfolio";
import { formatCompactINR } from "@/lib/finance/format";

const byType = (["Mutual fund", "Stock", "ETF"] as const).map((type) => ({
  type,
  value: holdings
    .filter((h) => h.type === type)
    .reduce((s, h) => s + h.current, 0),
}));
const total = byType.reduce((s, t) => s + t.value, 0);
const swatch = [
  "bg-accent",
  "bg-ink",
  "bg-accent-soft border border-accent/40",
];

function Sample({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-xl border border-rule bg-white p-4 text-sm">
      {children}
      <p className="mt-4 text-xs text-ink-soft">Sample data</p>
    </div>
  );
}

export function Pillars() {
  return (
    <Section>
      <h2 className="max-w-3xl font-display text-3xl leading-[1.1] sm:text-4xl">
        One place to see your money, move it and grow it.
      </h2>

      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        <article>
          <h3 className="font-display text-2xl">Understand</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">
            See stocks, mutual funds and ETFs together, and what each one is
            worth against what you put in.
          </p>
          <Sample>
            <div className="flex h-3 overflow-hidden rounded-full">
              {byType.map((t, i) => (
                <div
                  key={t.type}
                  className={swatch[i]}
                  style={{ width: `${(t.value / total) * 100}%` }}
                />
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {byType.map((t, i) => (
                <li
                  key={t.type}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`inline-block h-2.5 w-2.5 rounded-full ${swatch[i]}`}
                    />
                    {t.type === "Mutual fund"
                      ? "Mutual funds"
                      : t.type === "Stock"
                        ? "Stocks"
                        : "ETFs"}
                  </span>
                  <span className="tabular-nums">
                    {formatCompactINR(t.value)}
                    <span className="ml-3 inline-block w-9 text-right text-ink-soft">
                      {Math.round((t.value / total) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Sample>
        </article>

        <article>
          <h3 className="font-display text-2xl">Act</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Start a SIP from ₹500 a month, or buy a stock or ETF. The cost is on
            the screen before you confirm.
          </p>
          <Sample>
            <p className="font-medium">Parag Parikh Flexi Cap Fund</p>
            <p className="text-ink-soft">Direct plan, growth</p>
            <dl className="mt-4 divide-y divide-rule border-y border-rule">
              <div className="flex justify-between py-2">
                <dt className="text-ink-soft">Amount</dt>
                <dd className="tabular-nums">₹500 a month</dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-ink-soft">Commission</dt>
                <dd className="tabular-nums">₹0</dd>
              </div>
            </dl>
            <div
              aria-hidden="true"
              className="mt-4 rounded-lg bg-ink py-2.5 text-center font-medium text-paper"
            >
              Start SIP
            </div>
          </Sample>
        </article>

        <article>
          <h3 className="font-display text-2xl">Grow</h3>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Set a goal and see how far you are. Change the amount or the time
            and watch the date move.
          </p>
          <Sample>
            <p className="font-medium">House down payment</p>
            <p className="text-ink-soft">Target ₹20 L</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-accent-soft">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: "62%" }}
              />
            </div>
            <p className="mt-3 flex justify-between tabular-nums">
              <span>₹12.4 L saved</span>
              <span className="text-ink-soft">62%</span>
            </p>
          </Sample>
        </article>
      </div>
    </Section>
  );
}
