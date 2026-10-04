import { Wordmark } from "./Wordmark";

const columns = [
  { title: "Product", links: ["Market", "Portfolio", "Ask", "Calculators"] },
  { title: "Company", links: ["About", "Contact", "Blog"] },
  { title: "Legal", links: ["Privacy policy", "Terms of use", "Disclosures"] },
];

export function Footer() {
  return (
    <footer id="about" className="border-t border-rule bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            The math behind your money, made visible. Built for investors in
            India.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <h2 className="text-xs font-medium uppercase tracking-widest text-ink-soft">
              {c.title}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-accent">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-rule">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-ink-soft sm:px-6">
          Fermor is educational and is not a SEBI-registered investment adviser.
          Calculators show arithmetic, not advice. Investments in securities
          markets are subject to market risk.
        </p>
      </div>
    </footer>
  );
}
