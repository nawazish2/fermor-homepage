"use client";

import { useState, type FormEvent } from "react";
import { normalizeEmail } from "@/lib/validate-email";

type Status = "idle" | "loading" | "done";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

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
          <p className="border border-paper/30 px-4 py-3">
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
                className="min-w-0 flex-1 border border-paper/40 bg-transparent px-4 py-3 text-paper placeholder:text-paper/50 focus:border-paper focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-paper px-6 py-3 text-sm font-medium text-ink hover:bg-accent-soft disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </div>
            {error && (
              <p id="waitlist-error" className="mt-2 text-sm text-[#f3b4a6]">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </form>
  );
}
