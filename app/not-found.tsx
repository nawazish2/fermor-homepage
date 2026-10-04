import Link from "next/link";
import { Section } from "@/components/Section";

export default function NotFound() {
  return (
    <div className="graph-paper border-b border-rule">
      <Section className="min-h-[60vh] pt-20">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          The link may be old or mistyped. The calculators and everything else
          are on the homepage.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-ink"
        >
          Go to the homepage
        </Link>
      </Section>
    </div>
  );
}
