"use client";

import { useEffect, useRef, useState } from "react";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "#calculators", label: "Calculators" },
  { href: "#ask", label: "Ask" },
  { href: "#about", label: "About" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const focusables = sheet?.querySelectorAll<HTMLElement>("a, button");
    focusables?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
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
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-sm">
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
              className="bg-ink px-4 py-2 text-paper hover:bg-accent"
            >
              Join waitlist
            </a>
          </li>
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 p-2 text-sm md:hidden"
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
