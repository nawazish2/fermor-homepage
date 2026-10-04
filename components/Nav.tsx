"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "#ask", label: "Ask" },
  { href: "#calculators", label: "Calculators" },
  { href: "#portfolio", label: "Portfolio" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const sheetLinks = Array.from(
      sheetRef.current?.querySelectorAll<HTMLElement>("a") ?? [],
    );
    // The toggle sits outside the sheet but is part of the trap, so Close stays reachable.
    const stops = [toggleRef.current, ...sheetLinks].filter(
      (el): el is HTMLElement => el !== null,
    );
    sheetLinks[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || stops.length === 0) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
      >
        <a href="#top" aria-label="Fermor home">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-ink-soft hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#waitlist"
              className="rounded-lg bg-accent px-4 py-2 font-medium text-white hover:bg-ink"
            >
              Join waitlist
            </a>
          </li>
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 rounded-lg p-2 text-sm font-medium md:hidden"
          aria-expanded={open}
          aria-controls="mobile-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-sheet"
          ref={sheetRef}
          className="border-t border-rule bg-paper px-4 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {[...links, { href: "#waitlist", label: "Join waitlist" }].map(
              (l) => (
                <li key={l.href} className="border-b border-rule">
                  <a
                    href={l.href}
                    className="block py-4 text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
