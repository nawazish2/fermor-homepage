"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { normalizeEmail } from "@/lib/validate-email";

type Status = "idle" | "loading" | "done";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The input unmounts on success; move focus to the confirmation so it is not lost.
  useEffect(() => {
    if (status === "done") doneRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!normalizeEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <div aria-live="polite">
        {status === "done" ? (
          <p
            ref={doneRef}
            tabIndex={-1}
            className="rounded-lg border border-white/40 px-4 py-3 outline-none"
          >
            You&apos;re on the list. We&apos;ll write when Fermor opens up.
          </p>
        ) : (
          <>
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "waitlist-error" : undefined}
                className="min-w-0 flex-1 rounded-lg border border-white/40 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:border-white"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-accent hover:bg-accent-soft disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </div>
            {error && (
              <p id="waitlist-error" className="mt-2 text-sm text-[#ffd0c7]">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </form>
  );
}
