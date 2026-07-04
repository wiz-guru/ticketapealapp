# Competitive brief — AppealPro.ca

_Researched July 2026. AppealPro's app pages are client-rendered (a direct fetch
returns an empty shell), so this is built from their indexed blog/guide content
and third-party sources. Treat per-city pricing and account details as "likely"
rather than confirmed._

## What AppealPro is

A paid Ontario parking-ticket dispute-letter generator. You upload a photo of
your ticket, it gives a free "success score" / case evaluation in under 3
minutes, and if you proceed it generates a structured, bylaw-cited dispute letter
formatted to paste into the city portal.

## Model & pricing

- **Free evaluation / "success score,"** then **$9.99 per dispute letter.**
- Anchored explicitly as "less than the late-payment surcharge" on a Toronto
  ticket (that surcharge is $32.10).
- No outcome guarantee — they're careful not to promise a win.

## The flow (their funnel)

1. Upload ticket photo.
2. OCR reads it and **auto-detects the cited bylaw section** (e.g. which Chapter
   950 provision).
3. Cross-references the offence against "grounds screening officers accept."
4. Shows a free **success score** to entice the paid step.
5. On payment, outputs a **structured letter formatted to paste into the portal.**

## Coverage (their biggest advantage)

Multi-city Ontario APS/AMPS — reported cities include **Toronto, Ottawa,
Mississauga, Brampton, Hamilton, London, Kitchener, Windsor, Barrie, Kingston**
(~10). We are Toronto-only.

## Grounds they market

Signage missing/obscured/contradictory · accessible permit held but not displayed
· payment-app session active at time of infraction · officer recorded wrong
time/location/plate · duplicate tickets already paid · mismatched offence
descriptions. (Heavy overlap with our 12-offence library.)

## Content / SEO

Extensive blog: city-by-city dispute guides, an APS portal walkthrough, "how long
to fight" deadline guides, "how to win." This is how they win Google — it's a
real moat we don't have.

## A useful insight they publish

"Most denied disputes lose on **procedural** grounds (evidence, structure,
deadline) — not on the merits." Their structured letter is positioned as the fix.

---

## Head-to-head vs. FreeTicketAppeal

| | AppealPro | FreeTicketAppeal (ours) |
|---|---|---|
| Price | $9.99 / letter | **Free** |
| Photo OCR | Yes, auto-detects the cited section | Yes (client-side beta) — does **not** auto-detect the offence yet |
| "Success score" | Yes | No |
| Grounds identification | Yes | Yes (guided Q&A) |
| Bylaw-cited letter | Yes | Yes — **verified against live Ch. 610/910/950** |
| Paste-into-portal | Yes | Yes |
| Deadline awareness | Yes | Yes (countdown + add-to-calendar) |
| Cities | ~10 Ontario | Toronto only |
| Accounts required | Likely (to pay) | None |
| Open source | No | **Yes** |
| Content/SEO | Extensive | None |
| AI letter polish | Unclear | Yes (optional) |
| Turnaround info | Cites **4–8 weeks** (stale) | **~10 months** (current — verified) |

## Where we already win

- **Free** vs their $9.99 — our whole reason to exist, and it beats even their
  "cheaper than the late fee" anchor.
- **Accuracy/trust** — their public content still cites 4–8 weeks; the City now
  says up to ~10 months. Our figures are current and sourced.
- **No account, no data resale, open source** — a cleaner trust story.

## Where they beat us / gaps to close

1. **Multi-city** (biggest strategic gap). Each city = its own bylaws/AMPS. A
   real v3 project, not a quick add. Toronto-only is fine and honest for now.
2. **Auto-detect the offence from the photo.** Our OCR reads date/plate/etc. but
   the user still picks the offence type. Parsing the offence code from the photo
   and pre-selecting it would match their slickest feature. Feasible next step.
3. **"Success/strength" indicator.** A lightweight, honest "this ground tends to
   be strong/moderate" hint per ground — without overpromising outcomes.
4. **Content/SEO.** A few honest guide pages (how APS works, deadlines, how to
   photograph signage) would help us get found. Marketing, not core code.

## Recommended next moves (priority order)

1. **Lean the messaging into "free + accurate + open."** Add a one-line
   comparison ("others charge ~$10 and cite outdated timelines; this is $0 and
   verified against the current by-law").
2. **OCR → auto-select offence.** Extend `parseTicket()` to detect the offence
   code and pre-select the dropdown. Highest-impact UX parity win.
3. **Per-ground strength hint** (honest, non-guaranteeing).
4. **A small content section / blog** for SEO, if reach matters.
5. **Multi-city** only once Toronto is proven.

## Sources

- AppealPro — How to Dispute a Parking Ticket in Toronto (2026): https://appealpro.ca/blog/how-to-dispute-parking-ticket-toronto
- AppealPro — Toronto APS Portal Walkthrough & How to Win (2026): https://appealpro.ca/blog/toronto-aps-portal-guide
- AppealPro — Ontario APS deadlines: https://appealpro.ca/blog/how-long-to-fight-parking-ticket-ontario
- AppealPro — Toronto city page: https://appealpro.ca/cities/toronto
- City of Toronto — Dispute Your Parking Violation: https://www.toronto.ca/services-payments/tickets-fines-penalties/parking-violations/dispute-your-parking-violation/
