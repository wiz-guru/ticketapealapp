"use client";

import { useMemo, useState } from "react";
import { EMPTY_TICKET, TicketData } from "@/lib/types";
import { OFFENCE_CODES, FILING_STEPS } from "@/lib/defenseLibrary";

type Step = "details" | "ground" | "result";

// Guided questionnaire: each question maps to one or more ground ids.
const GUIDE: { q: string; ids: string[] }[] = [
  { q: "I had valid payment or a permit, or was only a few minutes late", ids: ["valid-payment", "grace-period"] },
  { q: "A required sign was missing, hidden, faded, or hard to see", ids: ["signage-defect"] },
  { q: "The ticket time or day was outside the posted restriction", ids: ["outside-hours"] },
  { q: "A detail on the ticket is wrong (plate, place, time, vehicle)", ids: ["factual-error"] },
  { q: "I was actually farther away than the rule requires", ids: ["distance"] },
  { q: "I was within the time limit, or moved my car in time", ids: ["within-time", "moved-within"] },
  { q: "My vehicle wasn't actually where the ticket claims", ids: ["not-located", "not-in-zone", "not-obstructing"] },
  { q: "My plate was valid and properly displayed", ids: ["plate-valid"] },
  { q: "The winter parking ban wasn't actually in effect", ids: ["no-ban"] },
  { q: "I can't reasonably afford to pay this penalty", ids: ["undue-hardship"] },
];

// Best-effort parse of OCR text from a ticket photo into form fields.
// Runs on whatever Tesseract returns; the user confirms/edits everything after.
function parseTicket(text: string): Partial<TicketData> {
  const out: Partial<TicketData> = {};
  const clean = text.replace(/[ \t]+/g, " ");
  const dm =
    clean.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/) ||
    clean.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](20\d{2})\b/);
  if (dm) {
    let y: string, mo: string, d: string;
    if (dm[1].length === 4) { y = dm[1]; mo = dm[2]; d = dm[3]; }
    else { d = dm[1]; mo = dm[2]; y = dm[3]; }
    out.violationDate = y + "-" + mo.padStart(2, "0") + "-" + d.padStart(2, "0");
  }
  const tm = clean.match(/\b(\d{1,2}:\d{2})\s*([AaPp]\.?[Mm]\.?)?\b/);
  if (tm) out.violationTime = (tm[1] + (tm[2] ? " " + tm[2].toUpperCase().replace(/\./g, "") : "")).trim();
  const vn = clean.match(/(?:violation|notice|penalty|infraction)[^\d]{0,12}([A-Za-z]?\d[\d\s-]{5,})/i);
  if (vn) out.citationNumber = vn[1].replace(/\s/g, "").trim();
  const pl = clean.match(/(?:plate|licence|license|marker)[^A-Z0-9]{0,8}([A-Z0-9]{2,4}[\s-]?[A-Z0-9]{2,4})/i);
  if (pl) out.plateNumber = pl[1].replace(/\s/g, "").toUpperCase().trim();
  return out;
}

// Try to detect which offence a ticket photo is about, aligned to OFFENCE_CODES
// order. Returns an index into OFFENCE_CODES, or -1 if unsure.
const OFFENCE_PATTERNS: RegExp[] = [
  /910-?4|parking machine|pay[- ]?and[- ]?display|\bmeter\b|fail to (activate|display)/i,
  /950-?405a|signed highway.*prohibited|prohibited \(?day|no parking/i,
  /950-?405d|no stopping|stop.*prohibited|rush hour/i,
  /950-?405f|excess of permitted|permitted time/i,
  /400d\(?1|driveway|laneway/i,
  /400d\(?2|fire hydrant|hydrant/i,
  /400d\(?3|intersecting roadway/i,
  /400d\(?5|longer than 3|3 hours/i,
  /400d\(?10|number plate|valid.*plate/i,
  /400b\(?2|intersection|pedestrian crossover|crosswalk/i,
  /400f\(?1|transit stop|bus stop|streetcar/i,
  /950-?406|snow route|snow removal/i,
];
function detectOffence(text: string): number {
  for (let i = 0; i < OFFENCE_PATTERNS.length; i++) {
    if (OFFENCE_PATTERNS[i].test(text)) return i;
  }
  return -1;
}

// Honest, non-guaranteeing strength of each argument type (by ground id).
const STRENGTH: Record<string, string> = {
  "grace-period": "Commonly strong",
  "valid-payment": "Commonly strong",
  "signage-defect": "Commonly strong",
  "factual-error": "Commonly strong",
  "outside-hours": "Commonly strong",
  "plate-valid": "Commonly strong",
  "not-located": "Commonly strong",
  "not-in-zone": "Commonly strong",
  "not-obstructing": "Commonly strong",
  "distance": "Evidence-dependent",
  "within-time": "Evidence-dependent",
  "moved-within": "Evidence-dependent",
  "no-ban": "Evidence-dependent",
  "undue-hardship": "Situational",
};

export default function AppealPage() {
  const [step, setStep] = useState<Step>("details");
  const [ticket, setTicket] = useState<TicketData>(EMPTY_TICKET);
  const [offenceIndex, setOffenceIndex] = useState<number>(0);
  const [groundId, setGroundId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [details, setDetails] = useState("");
  const [letter, setLetter] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrPct, setOcrPct] = useState(0);
  const [ocrDone, setOcrDone] = useState(false);
  const [polishBusy, setPolishBusy] = useState(false);
  const [original, setOriginal] = useState("");
  const [ocrOffence, setOcrOffence] = useState<string>("");

  const offence = OFFENCE_CODES[offenceIndex];
  const groundIdsHere = useMemo(() => new Set(offence?.grounds.map((g) => g.id)), [offence]);

  // only show questions relevant to this offence's available grounds
  const questions = useMemo(
    () => GUIDE.map((g, i) => ({ ...g, i })).filter((g) => g.ids.some((id) => groundIdsHere.has(id))),
    [groundIdsHere]
  );

  // recommended ground ids from the checked questions
  const recommended = useMemo(() => {
    const s = new Set<string>();
    questions.forEach((g) => { if (answers[g.i]) g.ids.forEach((id) => groundIdsHere.has(id) && s.add(id)); });
    return s;
  }, [answers, questions, groundIdsHere]);

  // grounds sorted recommended-first
  const sortedGrounds = useMemo(() => {
    const gs = offence ? [...offence.grounds] : [];
    return gs.sort((a, b) => Number(recommended.has(b.id)) - Number(recommended.has(a.id)));
  }, [offence, recommended]);

  // 15-day screening deadline computed from the violation date.
  const deadline = useMemo(() => {
    const d = new Date(ticket.violationDate);
    if (isNaN(d.getTime())) return null;
    const due = new Date(d);
    due.setDate(due.getDate() + 15);
    const days = Math.ceil((due.getTime() - Date.now()) / 86400000);
    return { iso: due.toISOString().slice(0, 10), days };
  }, [ticket.violationDate]);

  function addToCalendar() {
    if (!deadline) return;
    const dt = deadline.iso.replace(/-/g, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FreeTicketAppeal//EN",
      "BEGIN:VEVENT", "UID:taa-" + (ticket.citationNumber || Date.now()),
      "DTSTART;VALUE=DATE:" + dt,
      "SUMMARY:Parking ticket dispute deadline" + (ticket.citationNumber ? " (" + ticket.citationNumber + ")" : ""),
      "DESCRIPTION:Last day to request a screening review with the City of Toronto (secure.toronto.ca/webapps/parking).",
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url; a.download = "parking-dispute-deadline.ics"; a.click();
    URL.revokeObjectURL(url);
  }

  const set = (k: keyof TicketData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setTicket({ ...ticket, [k]: e.target.value });

  function pickOffence(i: number) {
    setOffenceIndex(i); setGroundId(""); setAnswers({});
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrBusy(true); setOcrPct(0); setOcrDone(false); setError("");
    try {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(file, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setOcrPct(Math.round(m.progress * 100));
        },
      });
      const text = data.text || "";
      const parsed = parseTicket(text);
      setTicket((t) => ({ ...t, ...parsed }));
      const oi = detectOffence(text);
      if (oi >= 0) {
        setOffenceIndex(oi); setGroundId(""); setAnswers({});
        setOcrOffence(OFFENCE_CODES[oi].shortName);
      } else {
        setOcrOffence("");
      }
      setOcrDone(true);
    } catch {
      setError("Couldn't read that photo. Please enter the details manually below.");
    } finally {
      setOcrBusy(false);
    }
  }

  async function generate() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, offenceIndex, groundId, details }),
      });
      if (!res.ok) throw new Error("Could not generate the letter. Try again.");
      const data = await res.json();
      setLetter(data.letter); setEvidence(data.evidence || []); setOriginal(""); setStep("result");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally { setBusy(false); }
  }

  async function polish() {
    setPolishBusy(true); setError("");
    try {
      const res = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letter }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not polish the letter.");
      if (!original) setOriginal(letter);
      setLetter(data.letter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Polish failed.");
    } finally { setPolishBusy(false); }
  }

  return (
    <div className="container">
      <div className="steps">
        <span className={step === "details" ? "active" : ""}>1. Ticket details</span>
        <span>&rsaquo;</span>
        <span className={step === "ground" ? "active" : ""}>2. Find your grounds</span>
        <span>&rsaquo;</span>
        <span className={step === "result" ? "active" : ""}>3. Letter &amp; filing</span>
      </div>

      {error && <p style={{ color: "#c0392b" }}>{error}</p>}

      {step === "details" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Enter your ticket details</h2>
          <div style={{ margin: "0 0 14px" }}>
            <label htmlFor="ticketPhoto" className="btn btn-secondary" style={{ cursor: "pointer" }}>
              {ocrBusy ? "Reading photo… " + ocrPct + "%" : "Auto-fill from a photo (beta)"}
            </label>
            <input id="ticketPhoto" type="file" accept="image/*" capture="environment"
              style={{ display: "none" }} onChange={onPhoto} disabled={ocrBusy} />
            {ocrDone && !ocrBusy && (
              <span className="small" style={{ marginLeft: 10, color: "var(--ok)" }}>
                Filled what we could{ocrOffence ? " — detected: " + ocrOffence : ""} — please check every field.
              </span>
            )}
            <p className="muted small" style={{ marginTop: 6 }}>
              Your photo is read on your device and never uploaded. OCR is imperfect —
              always confirm the fields below. Or just type them in.
            </p>
          </div>
          <div className="row">
            <div><label>Violation / notice number</label><input value={ticket.citationNumber} onChange={set("citationNumber")} /></div>
            <div><label>Licence plate</label><input value={ticket.plateNumber} onChange={set("plateNumber")} /></div>
            <div><label>Date of violation</label><input value={ticket.violationDate} onChange={set("violationDate")} placeholder="YYYY-MM-DD" /></div>
            <div><label>Time of violation</label><input value={ticket.violationTime} onChange={set("violationTime")} placeholder="e.g. 6:40 PM" /></div>
            <div><label>Location on the notice</label><input value={ticket.location} onChange={set("location")} /></div>
            <div><label>Vehicle (make / model / colour)</label><input value={ticket.vehicleDesc} onChange={set("vehicleDesc")} /></div>
          </div>
          <div style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => setStep("ground")}>Next: find your grounds →</button>
          </div>
        </div>
      )}

      {step === "ground" && (
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>What kind of ticket is it?</h2>
            <label>Type of violation</label>
            <select value={offenceIndex} onChange={(e) => pickOffence(Number(e.target.value))}>
              {OFFENCE_CODES.map((o, i) => (<option key={i} value={i}>{o.shortName}</option>))}
            </select>
            <p className="muted small" style={{ marginTop: 8 }}>{offence?.description}</p>
            <p className="muted small">Bylaw: {offence?.bylaw} · Set fine: {offence?.setFine}</p>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Which of these are true?</h2>
            <p className="muted small">Tap any that apply — we&apos;ll recommend your strongest grounds.</p>
            <div>
              {questions.map((g) => (
                <span key={g.i} className={"chip" + (answers[g.i] ? " on" : "")}
                  onClick={() => setAnswers({ ...answers, [g.i]: !answers[g.i] })}>
                  {answers[g.i] ? "✓ " : ""}{g.q}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Choose your grounds</h2>
            <p className="muted small" style={{ marginTop: 0 }}>
              Strength reflects how these arguments generally fare — not a prediction for your case.
            </p>
            {sortedGrounds.map((g) => (
              <div key={g.id} className={"opt" + (groundId === g.id ? " sel" : "")} onClick={() => setGroundId(g.id)}>
                <div className="top">
                  <h3>{g.label}</h3>
                  <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {STRENGTH[g.id] && (
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".02em", background: "#eef1f6", color: "#5b6675", borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>
                        {STRENGTH[g.id]}
                      </span>
                    )}
                    {recommended.has(g.id) && <span className="badge">Recommended</span>}
                  </span>
                </div>
                <p className="muted small" style={{ margin: "6px 0 0" }}>{g.whenToUse}</p>
                {groundId === g.id && (
                  <div style={{ marginTop: 8 }}>
                    <p className="small" style={{ margin: "0 0 4px", fontWeight: 600 }}>Evidence to attach:</p>
                    <ul className="clean small muted" style={{ margin: 0 }}>
                      {g.evidence.map((ev, i) => (<li key={i}>{ev}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <label style={{ marginTop: 16 }}>Anything specific to add? (goes into the letter)</label>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. the No Parking sign was covered by a tree branch" />

            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setStep("details")}>Back</button>
              <button className="btn" onClick={generate} disabled={busy || !groundId}>
                {busy ? "Generating…" : "Generate my letter →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "result" && (
        <div>
          {deadline && (
            <div
              className="notice"
              style={{
                marginBottom: 16,
                ...(deadline.days <= 3
                  ? { background: "#fdeeea", borderColor: "#f0b4a8", color: "#8a2c14" }
                  : {}),
              }}
            >
              <strong>
                {deadline.days > 0
                  ? deadline.days + (deadline.days === 1 ? " day" : " days") + " left to file"
                  : deadline.days === 0
                  ? "Your deadline is today"
                  : "The 15-day deadline has passed"}
              </strong>{" "}
              — request your screening review by {deadline.iso} (15 days from the
              violation date).{" "}
              {deadline.days < 0
                ? "You may still request an extension (up to 60 days) with reasons. "
                : ""}
              <a href="#" onClick={(e) => { e.preventDefault(); addToCalendar(); }}>
                Add to calendar
              </a>
            </div>
          )}
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Your draft — paste this into the City portal</h2>
            <div className="letter">{letter}</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <button className="btn" onClick={() => navigator.clipboard.writeText(letter)}>Copy letter</button>
              <button className="btn btn-secondary" onClick={() => setStep("ground")}>Edit grounds</button>
              <button className="btn btn-secondary" onClick={polish} disabled={polishBusy}>
                {polishBusy ? "Polishing…" : original ? "Re-polish with AI" : "Polish with AI (beta)"}
              </button>
              {original && (
                <button className="btn btn-secondary" onClick={() => { setLetter(original); setOriginal(""); }}>Revert</button>
              )}
            </div>
            <p className="muted small" style={{ marginTop: 10 }}>
              &ldquo;Polish with AI&rdquo; rewrites the wording to read more persuasively; the bylaw
              citations and facts are kept as-is. Always review before submitting.
            </p>
          </div>

          {evidence.length > 0 && (
            <div className="card">
              <h2 style={{ marginTop: 0 }}>Attach this evidence</h2>
              <ul className="clean">{evidence.map((ev, i) => (<li key={i}>{ev}</li>))}</ul>
            </div>
          )}

          <div className="card">
            <h2 style={{ marginTop: 0 }}>How to file with the City of Toronto</h2>
            <ol className="clean">{FILING_STEPS.map((s, i) => (<li key={i} style={{ margin: "6px 0" }}>{s}</li>))}</ol>
            <div className="notice" style={{ marginTop: 12 }}>
              Deadline: generally 15 days from the notice date. Review every detail before you submit — this is a self-help tool, not legal advice, and you remain the named disputant.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
