# Ticket Appeal App (Toronto)

Free web app (Next.js, App Router + TypeScript) that helps a Toronto driver
draft a parking-ticket dispute letter and file it with the City.

**v1 scope:** manual entry → pick offence + grounds → template-fill letter →
copy-paste + how-to-file guide. No OCR, no LLM generation, no accounts, no
payments (all deferred to v2+).

## Getting started

```bash
npm install
npm run dev   # http://localhost:3000
```

## Structure

```
app/
  page.tsx               Landing page
  appeal/page.tsx        3-step flow: details -> grounds -> letter & filing
  api/generate/route.ts  Template-fill: ticket + ground -> letter (no LLM)
  api/ocr/route.ts        v2 placeholder (returns 501)
lib/
  defenseLibrary.ts      THE PRODUCT: offence codes -> bylaw -> grounds ->
                         templates -> evidence. Edit this to add codes.
  types.ts               Manual-entry form model
```

## Before launch — VERIFY the law

`lib/defenseLibrary.ts` is drafted from public sources and every legal detail is
flagged `VERIFY`. Confirm each offence code, bylaw section, fine, and the
grace-period figure against the live Toronto Municipal Code Chapter 950
(Schedule B) and the City's APS guidance before going live. Do not ship an
unverified legal claim.

## Deploy

Designed for Vercel: connect the repo, deploy. No env vars needed for v1 (no
external APIs). Get this live early so every change ships continuously.

## Privacy

v1 is browser-only — no database, nothing stored server-side. Keep it that way
for launch; tickets contain personal data.

See `v1-launch-plan.md` for the full breakdown.
