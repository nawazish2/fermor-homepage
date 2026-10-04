"use client";

import { useMemo, useState, type ReactNode } from "react";
import { NumberField } from "@/components/ui/NumberField";
import { Slider } from "@/components/ui/Slider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GrowthChart } from "./GrowthChart";
import { sipFutureValue } from "@/lib/finance/sip";
import { formatCompactINR, formatINR } from "@/lib/finance/format";

/** A figure inside the sentence that the reader can edit. */
function Marked({
  prefix,
  suffix,
  children,
}: {
  prefix?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <span className="marker mx-0.5 inline-block whitespace-nowrap rounded-sm px-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
      {prefix}
      {children}
      {suffix}
    </span>
  );
}

const fieldClass = "text-center [font:inherit]";

export function SipWidget() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [showWorking, setShowWorking] = useState(false);

  const result = useMemo(
    () => sipFutureValue(monthly, years, rate),
    [monthly, years, rate],
  );

  return (
    <div>
      <h1 className="max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.2]">
        If I put{" "}
        <Marked prefix="₹">
          <NumberField
            autoWidth
            className={fieldClass}
            label="Monthly investment value"
            value={monthly}
            min={500}
            max={100000}
            step={500}
            onChange={setMonthly}
          />
        </Marked>{" "}
        in every month, for{" "}
        <Marked suffix=" years">
          <NumberField
            autoWidth
            className={fieldClass}
            label="Years value"
            value={years}
            min={1}
            max={30}
            step={1}
            onChange={setYears}
          />
        </Marked>{" "}
        at{" "}
        <Marked suffix="%">
          <NumberField
            autoWidth
            className={fieldClass}
            label="Expected return value"
            value={rate}
            min={1}
            max={20}
            step={0.5}
            onChange={setRate}
          />
        </Marked>{" "}
        a year, I&rsquo;ll have
      </h1>

      <AnimatedNumber
        fromZero
        testId="corpus"
        value={result.corpus}
        format={formatCompactINR}
        className="mt-3 block font-display text-[clamp(3rem,9vw,6rem)] leading-none tabular-nums text-accent"
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start lg:gap-14">
        <div>
          <p className="max-w-md leading-relaxed text-ink-soft">
            That&rsquo;s the math behind your money, made visible. Fermor shows
            the working behind every number you invest, track or plan.
          </p>

          <dl className="mt-6 flex gap-10 text-sm">
            <div>
              <dt className="text-ink-soft">You put in</dt>
              <dd className="mt-1 text-xl tabular-nums">
                {formatCompactINR(result.invested)}
              </dd>
            </div>
            <div>
              <dt className="text-ink-soft">It earns</dt>
              <dd className="mt-1 text-xl tabular-nums text-gain">
                +{formatCompactINR(result.gains)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
            <Slider
              hideValue
              label="Monthly investment"
              value={monthly}
              min={500}
              max={100000}
              step={500}
              format={formatINR}
              onChange={setMonthly}
            />
            <Slider
              hideValue
              label="For"
              value={years}
              min={1}
              max={30}
              step={1}
              format={(v) => `${v} years`}
              onChange={setYears}
            />
            <Slider
              hideValue
              label="Expected return"
              value={rate}
              min={1}
              max={20}
              step={0.5}
              format={(v) => `${v}% a year`}
              onChange={setRate}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#waitlist"
              className="rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white hover:bg-ink"
            >
              Join the waitlist
            </a>
            <button
              type="button"
              onClick={() => setShowWorking((v) => !v)}
              aria-expanded={showWorking}
              aria-controls="sip-working"
              className="text-sm underline underline-offset-4 hover:text-accent"
            >
              {showWorking ? "Hide the working" : "Show the working"}
            </button>
          </div>

          {showWorking && (
            <div
              id="sip-working"
              className="mt-5 space-y-1.5 rounded-xl border border-rule bg-white p-4 text-sm leading-relaxed tabular-nums"
            >
              <p className="font-medium">
                Value = P × [((1 + r)ⁿ − 1) ÷ r] × (1 + r)
              </p>
              <p className="text-ink-soft">P = {formatINR(monthly)} a month</p>
              <p className="text-ink-soft">
                r = {rate}% ÷ 12 = {(rate / 12).toFixed(3)}% a month
              </p>
              <p className="text-ink-soft">
                n = {years} × 12 = {years * 12} months
              </p>
              <p className="font-medium">
                Value = {formatINR(Math.round(result.corpus))}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rule bg-white p-4 sm:p-6">
          <GrowthChart series={result.series} />
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-soft">
            <span className="flex items-center gap-2">
              <span className="inline-block h-0.5 w-5 rounded bg-accent" />{" "}
              Value of your SIP
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block w-5 border-t-2 border-dashed border-ink" />{" "}
              What you put in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
