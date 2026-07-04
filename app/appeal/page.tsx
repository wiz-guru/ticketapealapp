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
      setLetter(data.letter); setEvidence(data.evidence || []); setStep("result");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally { setBusy(false); }
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
          <p className="muted small">Copy these straight off your Parking Violation Notice. Photo auto-fill is coming later.</p>
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
            {sortedGrounds.map((g) => (
              <div key={g.id} className={"opt" + (groundId === g.id ? " sel" : "")} onClick={() => setGroundId(g.id)}>
                <div className="top">
                  <h3>{g.label}</h3>
                  {recommended.has(g.id) && <span className="badge">Recommended</span>}
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
            </div>
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
