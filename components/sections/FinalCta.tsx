import { Waitlist } from "./Waitlist";

function Badge({ store, line }: { store: string; line: string }) {
  return (
    <div className="border border-paper/30 px-4 py-2 text-left">
      <p className="text-[10px] uppercase tracking-widest text-paper/60">{line}</p>
      <p className="text-sm">{store}</p>
    </div>
  );
}

export function FinalCta() {
  return (
    <section id="waitlist" className="scroll-mt-16 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-end">
        <div>
          <h2 className="font-display text-4xl tracking-tight sm:text-5xl md:text-6xl">
            See the math. Then make the move.
          </h2>
          <p className="mt-5 max-w-md text-paper/70">
            Join the waitlist for early access. We&apos;ll email once, when
            Fermor is ready for you.
          </p>
        </div>
        <div className="space-y-6">
          <Waitlist />
          <div className="flex flex-wrap gap-3">
            <Badge line="Coming soon on the" store="App Store" />
            <Badge line="Coming soon on" store="Google Play" />
          </div>
        </div>
      </div>
    </section>
  );
}
