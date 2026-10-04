# Fermor Homepage: Design Spec

Date: 2026-10-05
Status: approved in conversation, pending written-spec review

## Purpose

Frontend assignment for Fermor (India-focused personal finance platform, fermor.in). Build a new homepage that is polished, responsive and working, not a static design. Deadline: two days. Deliverables: GitHub repo, live deploy (Vercel), short README with setup and decisions.

Evaluation: product thinking, visual quality, frontend skills, responsiveness, attention to detail, own decisions. The output must not look AI-generated.

## Product understanding

- Fermor serves Indian retail investors and money managers (roughly 22-40, mobile-first, digitally fluent).
- Offering: stocks, mutual funds, ETFs, portfolio tracking, planning, an AI "Ask" feature, and 20+ free calculators (SIP, EMI, tax, PPF and others) that run in the browser with no login.
- Positioning: educational, not a SEBI-registered adviser. Transparent arithmetic is the differentiator.
- Existing homepage problems: hero shows no product, 13 equal-weight sections, calculators buried in the footer, dashboard screenshot instead of something usable.

## Direction

Headline: **"The math behind your money, made visible."**
Understand / Act / Grow is the structural spine of the page, not the headline.

Visual: editorial and calm. Not a teal-gradient fintech template, no phone mockups, no glassmorphism.

## Architecture

- Next.js App Router, TypeScript, Tailwind v4. One route (`/`). No backend.
- `lib/finance/`: pure functions (SIP future value, EMI, old vs new tax regime, INR lakh/crore formatting). Unit-tested with Vitest.
- Sections are server components. Client components only for: hero calculator, calculator tabs, Ask demo, FAQ accordion, waitlist form, mobile nav sheet.
- Chart is hand-rolled SVG, no chart library.
- `app/api/waitlist/route.ts` validates input and returns 200. It stores nothing; the README states this.
- Mock data is typed and lives in `lib/data/`.

## Visual system (revised 2026-10-05, supersedes "editorial and calm")

Approved in conversation after a design critique: the first build (cream paper, high-contrast serif, tracked all-caps labels, numbered markers) matched common generated-page patterns.

- Concept: the page is a worked calculation on graph paper. The hero headline is an editable sentence.
- Colors: graph-paper white `#F3F5FA`, ink navy `#101A3A`, ballpoint ultramarine `#2438E0`, highlighter marigold `#FFC93C` (only on editable figures), gain `#0A7A4B`, loss `#BE3427`.
- Type: Bricolage Grotesque (headlines, big figures), Geist (text and UI), tabular figures for numbers. No serif, no monospace.
- Shape: small radius on controls, larger on panels, 1px rules, no shadows. No eyebrow labels, no numbered markers.
- Motion: one load moment (count-up and line draw). No scroll reveals. All off under `prefers-reduced-motion`.

## Page structure

1. **Nav**: typographic wordmark, Calculators, Ask, About, "Join waitlist". Sheet on mobile.
2. **Hero**: the headline is an editable sentence (monthly amount, years, return) with the result as the largest element, a growth chart, sliders, and a "show the working" toggle.
3. **Understand / Act / Grow**: three columns, each mapped to a product capability.
4. **Ask Fermor**: scripted chat demo ("Can I afford a 60L home loan?") with the working shown inline.
5. **Calculators**: tabs for SIP, EMI, Tax regime, each a working mini-calculator. Link grid for the remaining tools.
6. **Portfolio**: mock holdings and net-worth view from typed mock data.
7. **Trust band**: not SEBI-registered, calculations run in-browser, data stays on device. Then FAQ, final CTA (waitlist and app badges), footer with disclosures.

## Testing and quality

- Vitest for `lib/finance/`.
- Playwright smoke test: hero sliders, waitlist validation, mobile viewport.
- Lighthouse pass, keyboard navigation, visible focus states.
- Layout checked at 375, 768 and 1280px.

## Delivery

- Repo at `~/Developer/fermor`. Push to GitHub (`nawazish2`) only on the user's go-ahead. Deploy on Vercel afterward.
- README: setup, decisions (why show-the-math, why no chart library, why a stub API).
- Placeholders: typographic wordmark (no official logo available), app badges link nowhere.

## Out of scope

Real backend or auth, real market data, the 20+ individual calculator pages, blog, CMS.
