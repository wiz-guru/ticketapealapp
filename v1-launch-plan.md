# Ticket Appeal App — v1 Launch Plan

**Target go-live:** Sunday, June 28, 2026
**Today:** Saturday, June 20, 2026 (8-day runway)
**Stack:** Web app (Next.js + TypeScript) · **Team:** You + Claude
**Scope (revised to match the brainstorm):** Toronto parking tickets only (APS).
Manual entry → pick offence + grounds → template-fill dispute letter →
copy-paste + how-to-file guide. **No OCR, no LLM generation, no accounts, no
payments in v1.**

---

## What changed from the first draft (and why)

- **Manual entry, not photo OCR.** OCR is deferred to v2. v1 is a smart form.
- **Template-fill, not LLM generation.** Letters are assembled from a verified
  defense library so the tool can never invent a bylaw or legal claim — the
  right call for a legal tool built by a future lawyer.
- **The defense library is the product.** Offence code → bylaw → valid grounds →
  template paragraph → evidence list. Starts with 3 codes, expands to 8–12.
- **Toronto-APS-specific.** Real Ch. 950 citations (to be verified), framed
  around the City's "violation did not occur" screening standard, copy-paste
  output for the City portal, and a filing walkthrough.

## Two research findings that affect v1 (from the official City page, Mar 2026)

- **Turn-around is now up to ~10 months** (not the 4–8 weeks older guides cite).
  Set user expectations accordingly in the UI.
- **Screening cancels a penalty because it "did not occur"** (factual/legal
  error) **or for undue hardship.** Every generated letter is framed to that
  standard. Confirm this framing as you verify the bylaws.

---

## Phase 1 — Scope, scaffold, defense library (Sat 20 – Mon 22)

- DONE: Next.js scaffold, manual-entry flow, template-fill engine, 3-code
  defense library, filing guide, deploy-ready config (builds clean).
- YOU: verify every `VERIFY` flag in `lib/defenseLibrary.ts` against the live
  Toronto Municipal Code Ch. 950 (Schedule B) — offence codes, sections, fines,
  grace-period minutes. This is the law-student moat; it can't be skipped.
- Get the skeleton deployed to Vercel so every later change ships continuously.

## Phase 2 — Finalize the 3 starter offence codes (Mon 22 – Tue 23)

- Confirm the 3 highest-volume Toronto codes and lock their grounds + templates.
- Tighten template wording so filled letters read cleanly with real inputs.
- Add the grace-period figure once verified.

## Phase 3 — Flow, polish & content (Wed 24 – Thu 25)

- End-to-end pass: details → grounds → letter → copy → filing steps.
- Responsive/mobile pass; loading and error states.
- Landing copy + the "free, self-help, not legal advice, no data-selling" story.
- Prominent disclaimer baked into every screen (already in place).

## Phase 4 — QA & testing (Fri 26 – Sat 27)

- Run 8–10 real Toronto tickets through the flow; check the letters read right.
- Confirm every cited bylaw/fine against the City source one final time.
- Cross-browser + mobile checks. Fix priority bugs; freeze scope.

## Phase 5 — Launch (Sat 27 – Sun 28)

- Final deploy to production domain; live smoke test.
- Confirm no personal data is stored (v1 is browser-only — verify).
- Add Terms + Privacy ("self-help tool, you are the disputant").
- GO LIVE June 28. Open-source the repo (README + licence) for the brand.

---

## Deferred to v2+ (hold the line)

Photo OCR auto-fill · accounts/saved cases · outcome tracking · tip jar ·
PDF/mail output · more offence codes · other cities · POA traffic tickets.

## Top risks

- **Unverified citations** — the one thing that would discredit the tool. Verify
  before launch; the `VERIFY` flags mark every spot.
- **Overclaiming outcomes** — the City won't say why a ticket was cancelled.
  Don't claim credit you can't prove.
- **Scope creep** — OCR and accounts will tempt you. v1 is a form + templates.
