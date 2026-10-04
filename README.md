# Fermor homepage

A homepage for [Fermor](https://www.fermor.in), built for the frontend assignment.

**Live:** _add the deployed URL here_

The page is built around one idea: Fermor's real strength is that it shows its working, so the homepage should too. Instead of a hero image and a waitlist form, the first thing you see is a SIP calculator you can move.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # unit tests (Vitest)
npm run test:e2e     # browser tests (Playwright), builds and serves the app itself
npm run build        # production build
```

Node 20+ is fine. The first e2e run needs `npx playwright install chromium`.

## What's on the page

1. **Hero:** a live SIP widget. Sliders for amount, years and return update the corpus and chart. "Show the formula" prints the working with your numbers substituted.
2. **Understand / Act / Grow:** Fermor's own three-step framing, used as the page structure rather than the headline.
3. **Ask Fermor:** a scripted demo. Each reply lists the figures it used before giving the answer.
4. **Calculators:** working SIP, EMI and old-vs-new tax regime calculators.
5. **Portfolio:** a mock holdings view. Totals are computed from the data.
6. **Trust, FAQ, waitlist.**

## Decisions

- **"The math behind your money, made visible."** The existing site opens with "Build your wealth" and a waitlist, with no product visible and the calculators buried in the footer. I moved the calculators to the front.
- **Editorial look, not fintech-template.** Warm paper background, a serif for headlines, one deep green, and tabular monospace for every figure so numbers line up and read as data. No gradients, shadows or phone mockups.
- **No chart library.** The one chart is a small SVG component, so there is nothing extra to load and every pixel is styled by hand.
- **Finance functions are plain, tested code** (`lib/finance/`). A wrong number on a finance homepage costs more than an ugly layout, so the SIP, EMI and tax maths have unit tests, including 0% rates and the 87A rebate edge.
- **Tax slabs** are FY 2025-26 (the old regime and the new regime, salaried, standard deduction only, 4% cess). Budget 2026 left them unchanged for FY 2026-27. Marginal relief just above the ₹12L rebate limit is not modelled.
- **The waitlist API is a stub.** `/api/waitlist` validates the email and returns 200. It stores nothing; there is no database in this project.
- **Mock data:** the portfolio, the Ask replies and the app-store badges are illustrative. The wordmark is typographic because I don't have Fermor's logo files.
- **Motion** is limited to number tweening and a fade-up on scroll, and is off under `prefers-reduced-motion`. Content is visible without JavaScript.

## Stack

Next.js (App Router), TypeScript, Tailwind v4, Vitest, Playwright.
