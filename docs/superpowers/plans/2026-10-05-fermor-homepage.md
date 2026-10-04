# Fermor Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Fermor homepage ("The math behind your money, made visible.") as a responsive, working Next.js site with a live SIP hero widget, working mini-calculators, and a deployed Vercel URL.

**Architecture:** One route (`/`). Pure, unit-tested calculation functions in `lib/finance/`. Server components for static sections; small client components only where interaction is needed. Hand-rolled SVG chart. Waitlist posts to a stub API route that stores nothing.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind v4, Vitest, Playwright, `next/font`.

**Spec:** `docs/superpowers/specs/2026-10-05-fermor-homepage-design.md`

## Global Constraints

- One route only (`/`); no backend, auth, real market data or blog.
- No chart library; the chart is hand-rolled SVG.
- No gradients, glassmorphism, card shadows or phone mockups; 1px rules instead of shadows.
- Fonts: serif display (Fraunces or Instrument Serif), Geist or Inter for UI, tabular mono (JetBrains Mono or Geist Mono) for every figure.
- One deep green accent; muted green/red only for gains/losses; warm off-white background, near-black ink.
- 8px spacing scale.
- All motion disabled under `prefers-reduced-motion`.
- Currency is INR with Indian grouping (lakh/crore).
- Copy states: not a SEBI-registered adviser; calculations run in-browser; data stays on device.
- Wordmark is typographic (no logo asset); app badges link nowhere.
- Verified at 375, 768 and 1280px.
- Do not push to GitHub or deploy until the user says so.

## Review Focus

1. 0% return or 0% interest rate: SIP and EMI formulas divide by zero. Expect a finite, correct result (no NaN/Infinity).
2. Zero or out-of-range slider/typed input (0 years, negative amount, empty string): expect clamped values, never NaN in the UI.
3. Income below the tax threshold, or income exactly at the 87A rebate edge: expect ₹0 tax, not a negative number.
4. Very large figures (₹100 Cr+) at 375px: expect no horizontal overflow.
5. Waitlist input: whitespace-padded, uppercase, malformed email, empty body: expect trimmed/lowercased valid emails accepted, others rejected with a clear message and 400.

---

### Task 1: Scaffold, design tokens, layout shell

**Files:**
- Create: Next.js app in `~/Developer/fermor` (keep existing `docs/`), `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/Wordmark.tsx`
- Modify: `package.json` (add `test`, `test:e2e` scripts)

**Interfaces:**
- Produces: CSS tokens in `globals.css` (`--color-paper`, `--color-ink`, `--color-accent`, `--color-gain`, `--color-loss`, `--color-rule`); Tailwind font utilities `font-display`, `font-sans`, `font-mono`; `<Section id title?>` wrapper in `components/Section.tsx` (max-width container, 8px-scale vertical padding); `<Nav />`, `<Footer />`.

- [ ] **Step 1:** Scaffold with `create-next-app` (TypeScript, Tailwind, App Router, no src dir) into the existing directory; add Vitest and Playwright as dev dependencies.
- [ ] **Step 2:** Define the tokens and load the three fonts via `next/font` in `layout.tsx`; set `body` background to `--color-paper`.
- [ ] **Step 3:** Build `Nav` (wordmark, Calculators, Ask, About anchor links, "Join waitlist" button; mobile sheet with focus trap and Escape-to-close) and `Footer` (links, SEBI/educational disclosure).
- [ ] **Step 4:** Run `npm run build`. Expected: succeeds with no type errors. Run `npm run dev` and confirm Nav and Footer render at 375px and 1280px.
- [ ] **Step 5:** Commit: `chore: scaffold app with tokens and layout shell`.

### Task 2: Finance library (TDD)

**Files:**
- Create: `lib/finance/format.ts`, `lib/finance/sip.ts`, `lib/finance/emi.ts`, `lib/finance/tax.ts`
- Test: `lib/finance/finance.test.ts`

**Interfaces:**
- Produces:
  - `formatINR(n: number): string`
  - `formatCompactINR(n: number): string`
  - `sipFutureValue(monthly: number, years: number, annualReturnPct: number): { invested: number; corpus: number; gains: number; series: { year: number; invested: number; corpus: number }[] }`
  - `emi(principal: number, annualRatePct: number, years: number): { emi: number; totalInterest: number; totalPayable: number }`
  - `computeTax(grossIncome: number, regime: "old" | "new"): { taxable: number; tax: number }`

- [ ] **Step 1: Write failing tests** in `finance.test.ts` with these assertions:
  - `formatINR(1234567)` is `"₹12,34,567"`.
  - `formatCompactINR(2323391)` is `"₹23.23 L"`; `formatCompactINR(16400000)` is `"₹1.64 Cr"`; `formatCompactINR(0)` is `"₹0"`; `formatCompactINR(9999)` is `"₹9,999"`.
  - `sipFutureValue(10000, 10, 12).corpus` rounds to `2323391`; `.invested` is `1200000`; `series` has 10 entries and the last `corpus` equals `.corpus`.
  - `sipFutureValue(10000, 10, 0).corpus` is `1200000` (0% edge, finite).
  - `emi(6000000, 8.5, 20).emi` is within 50 of `52073`; `emi(1200000, 0, 10).emi` is `10000` (0% edge).
  - `computeTax(1275000, "new")` is `{ taxable: 1200000, tax: 0 }`.
  - `computeTax(1500000, "new")` is `{ taxable: 1425000, tax: 97500 }`.
  - `computeTax(1000000, "old")` is `{ taxable: 950000, tax: 106600 }`.
  - `computeTax(0, "new").tax` and `computeTax(200000, "old").tax` are `0` (never negative).
- [ ] **Step 2:** Run `npx vitest run`. Expected: FAIL (modules not defined).
- [ ] **Step 3:** Implement. SIP uses monthly compounding with annuity-due: `P * ((1+r)^n - 1) / r * (1+r)`, `r = annual/12/100`, falling back to `P * n` when `r === 0`. EMI is the standard reducing-balance formula with the same zero-rate fallback. Tax uses FY2025-26 slabs: new regime 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, above 24L 30%, standard deduction 75,000, 87A rebate to zero tax when taxable income is 12L or less; old regime 0-2.5L nil, 2.5-5L 5%, 5-10L 20%, above 10L 30%, standard deduction 50,000, rebate to zero when taxable income is 5L or less; 4% cess on both; return rounded integers. Before implementing, check the slabs against the current Income Tax Department figures and note the assessment year in a code comment.
- [ ] **Step 4:** Run `npx vitest run`. Expected: all PASS.
- [ ] **Step 5:** Commit: `feat: add finance calculation library with tests`.

### Task 3: Hero with live SIP widget

**Files:**
- Create: `components/hero/Hero.tsx` (server), `components/hero/SipWidget.tsx` (client), `components/hero/GrowthChart.tsx`, `components/ui/Slider.tsx`, `components/ui/AnimatedNumber.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `sipFutureValue`, `formatCompactINR`, `formatINR` from Task 2.
- Produces: `<Slider label value min max step format onChange />` (native `input[type=range]` with a visible numeric readout and an editable number input; values clamped to min/max, NaN/empty falls back to the previous value); `<AnimatedNumber value format />` (tweens; renders the final value instantly under reduced motion); `<GrowthChart series />` (SVG, invested vs corpus areas, `role="img"` with an `aria-label` summarizing the result).

- [ ] **Step 1:** Write a Vitest test for the clamping helper (`clamp(value, min, max)` returns `min` for NaN) placed in `lib/clamp.ts`; run it to see it fail, then implement.
- [ ] **Step 2:** Build `SipWidget` with defaults ₹10,000/month, 10 years, 12%, slider ranges ₹500-₹1,00,000, 1-30 years, 1-20%. Show the corpus (`AnimatedNumber`), invested vs gains split, the chart, and a "Show the formula" toggle revealing `FV = P × [((1+r)ⁿ − 1) / r] × (1+r)` with the current numbers substituted.
- [ ] **Step 3:** Compose `Hero`: headline "The math behind your money, made visible.", one supporting sentence, widget beside it on desktop, stacked on mobile.
- [ ] **Step 4:** Verify in the browser: moving each slider updates the corpus and chart; at 375px nothing scrolls horizontally; with 0% return and a ₹1,00,000 × 30 year input the display stays correct.
- [ ] **Step 5:** Commit: `feat: add hero with live SIP widget`.

### Task 4: Understand / Act / Grow and trust band

**Files:**
- Create: `components/sections/Pillars.tsx`, `components/sections/TrustBand.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `<Section>` from Task 1.
- Produces: `<Pillars />`, `<TrustBand />` (both server components).

- [ ] **Step 1:** Build `Pillars`: three columns separated by 1px rules, each with a numeral, the pillar name (Understand, Act, Grow), a one-line promise and the Fermor capability it maps to (portfolio tracking and calculators; stocks, mutual funds, ETFs and SIPs; goals and forecasting).
- [ ] **Step 2:** Build `TrustBand` with the three statements: not a SEBI-registered adviser; calculations run in your browser; your data stays on your device.
- [ ] **Step 3:** Verify visually at 375, 768 and 1280px (columns stack below 768px).
- [ ] **Step 4:** Commit: `feat: add pillars and trust sections`.

### Task 5: Ask Fermor demo

**Files:**
- Create: `components/sections/AskFermor.tsx` (client), `lib/data/ask-script.ts`

**Interfaces:**
- Consumes: `emi`, `formatINR` from Task 2.
- Produces: `askScript: { id: string; question: string; steps: { label: string; value: string }[]; answer: string }[]` (three scripted questions, the first being "Can I afford a ₹60L home loan?" computed from `emi(6000000, 8.5, 20)`).

- [ ] **Step 1:** Implement `AskFermor`: a list of suggested questions as buttons; selecting one plays the reply in a few timed steps (user bubble, then a working breakdown line by line, then the answer). Under reduced motion the full reply appears at once. The reply is labelled as a demo.
- [ ] **Step 2:** Verify with the keyboard only (Tab to a question, Enter to play, replay works) and confirm the figures match the Task 2 EMI test value.
- [ ] **Step 3:** Commit: `feat: add Ask Fermor demo`.

### Task 6: Calculators section

**Files:**
- Create: `components/sections/Calculators.tsx` (client), `components/calculators/SipCalc.tsx`, `EmiCalc.tsx`, `TaxCalc.tsx`

**Interfaces:**
- Consumes: `Slider`, `sipFutureValue`, `emi`, `computeTax`, `formatINR`.
- Produces: `<Calculators />` with an ARIA tab list (SIP, EMI, Tax regime), arrow-key navigation, and a link grid to the other tools (PPF, FD, Lumpsum, Gratuity, SWP, NPS) pointing to `#`.

- [ ] **Step 1:** Build the three calculators. The tax tab takes annual gross income and shows old vs new tax side by side with the lower one marked.
- [ ] **Step 2:** Verify the tab keyboard behavior (Left/Right/Home/End), and that tax for ₹10,00,000 shows ₹1,06,600 (old) and ₹0 (new).
- [ ] **Step 3:** Commit: `feat: add working calculators section`.

### Task 7: Portfolio section

**Files:**
- Create: `components/sections/Portfolio.tsx`, `lib/data/portfolio.ts`

**Interfaces:**
- Produces: `holdings: { name: string; type: "Stock" | "Mutual fund" | "ETF"; invested: number; current: number }[]` (6-8 realistic Indian holdings); `<Portfolio />` showing net worth, total gain, and a table with per-row gain % (green/red only on the gain figure). Derived totals are computed from `holdings`, not hardcoded.

- [ ] **Step 1:** Write the data and a Vitest test that total current value equals the sum of holdings; run it, see it fail, implement the helper, see it pass.
- [ ] **Step 2:** Build the section; on mobile the table collapses to stacked rows with no horizontal scroll.
- [ ] **Step 3:** Commit: `feat: add portfolio overview section`.

### Task 8: Waitlist, FAQ, final CTA

**Files:**
- Create: `app/api/waitlist/route.ts`, `lib/validate-email.ts`, `components/sections/Waitlist.tsx` (client), `components/sections/Faq.tsx` (client)
- Test: `lib/validate-email.test.ts`

**Interfaces:**
- Produces: `normalizeEmail(input: unknown): string | null` (trims, lowercases, returns null if malformed or not a string); `POST /api/waitlist` accepts `{ email }`, returns 200 `{ ok: true }` or 400 `{ error: string }`; stores nothing.

- [ ] **Step 1: Write failing tests:** `normalizeEmail("  Foo@Bar.com ")` is `"foo@bar.com"`; `normalizeEmail("nope")`, `normalizeEmail("")` and `normalizeEmail(42)` are `null`. Run, see FAIL.
- [ ] **Step 2:** Implement `normalizeEmail` and the route (invalid JSON body also returns 400). Run tests, see PASS.
- [ ] **Step 3:** Build `Waitlist` (inline validation message, loading, success state, `aria-live` region) and `Faq` (five questions covering what Fermor is, whether calculators are free, whether it is advice, data privacy, and how to get started; accessible accordion). Add the app badges (non-linking) and final CTA.
- [ ] **Step 4:** Commit: `feat: add waitlist, FAQ and CTA`.

### Task 9: Polish, motion, end-to-end tests

**Files:**
- Create: `components/ui/Reveal.tsx`, `e2e/home.spec.ts`, `playwright.config.ts`
- Modify: section components for responsive and accessibility fixes

**Interfaces:**
- Consumes: all sections from Tasks 3-8.
- Produces: `<Reveal>` (IntersectionObserver fade-up, no-op under reduced motion or without JS).

- [ ] **Step 1:** Write the Playwright spec: (a) at 1280px, moving the hero years slider changes the displayed corpus; (b) the waitlist rejects `"nope"` with a visible message and accepts `"a@b.com"`; (c) at 375px, `document.documentElement.scrollWidth <= 375`; (d) the Calculators tabs respond to the ArrowRight key. Run `npx playwright test`; expect failures where behavior is missing.
- [ ] **Step 2:** Add `Reveal` to section headers, fix responsive/accessibility defects the tests and manual passes uncover (visible focus rings, contrast, heading order, skip link).
- [ ] **Step 3:** Run `npx playwright test` and `npx vitest run`. Expected: all PASS.
- [ ] **Step 4:** Run Lighthouse on `next build && next start`. Expected: Accessibility ≥ 95, Best Practices ≥ 95, Performance ≥ 90 on mobile; fix regressions.
- [ ] **Step 5:** Commit: `feat: add motion, e2e tests and accessibility fixes`.

### Task 10: README and deploy prep

**Files:**
- Create: `README.md`

- [ ] **Step 1:** Write the README: what it is, live URL placeholder, setup (`npm install`, `npm run dev`, `npm test`, `npm run test:e2e`), and decisions (why show-the-math, why a hand-rolled chart, why a stub waitlist API, tax slabs and their assessment year, what is mocked).
- [ ] **Step 2:** Run `npm run build` once more and confirm success.
- [ ] **Step 3:** Commit: `docs: add README`.
- [ ] **Step 4:** Stop and ask the user before creating the GitHub repo, pushing, or deploying to Vercel.
