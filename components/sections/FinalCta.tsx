import { Waitlist } from "./Waitlist";

function Badge({ store, line }: { store: string; line: string }) {
  return (
    <div className="rounded-lg border border-white/30 px-4 py-2 text-left">
      <p className="text-xs text-white/70">{line}</p>
      <p className="text-sm font-medium">{store}</p>
    </div>
  );
}

export function FinalCta() {
  return (
    <section
      id="waitlist"
      data-on-dark
      className="scroll-mt-16 bg-accent text-white"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-end">
        <div>
          <h2 className="font-display text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
            See the math. Then make the move.
          </h2>
          <p className="mt-5 max-w-md text-white/80">
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
