const statements = [
  {
    title: "Educational, not advice",
    body: "Fermor is not a SEBI-registered investment adviser. We show the arithmetic; the decision is yours.",
  },
  {
    title: "Runs in your browser",
    body: "Every calculation happens on your device. Nothing you type is sent anywhere.",
  },
  {
    title: "Your data stays with you",
    body: "Inputs stay on your device unless you choose to save a result.",
  },
];

export function TrustBand() {
  return (
    <section
      aria-label="How Fermor handles your data"
      className="border-y border-rule bg-paper-deep"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-12">
        {statements.map((s) => (
          <div key={s.title}>
            <h3 className="font-medium">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
