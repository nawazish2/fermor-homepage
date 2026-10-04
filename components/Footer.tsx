import { Wordmark } from "./Wordmark";

const columns = [
  { title: "Product", links: ["Market", "Portfolio", "Ask", "Calculators"] },
  { title: "Company", links: ["About", "Contact", "Blog"] },
  { title: "Legal", links: ["Privacy policy", "Terms of use", "Disclosures"] },
];

export function Footer() {
  return (
    <footer id="about" data-on-dark className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Wordmark plain />
          <p className="mt-4 max-w-xs text-sm text-paper/70">
            The math behind your money, made visible. Built for investors in
            India.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <h2 className="font-medium">{c.title}</h2>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-paper">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-paper/60 sm:px-6">
          Fermor is educational and is not a SEBI-registered investment adviser.
          Calculators show arithmetic, not advice. Investments in securities
          markets are subject to market risk.
        </p>
      </div>
    </footer>
  );
}
