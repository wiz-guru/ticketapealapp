"use client";

import { useState } from "react";
import { EMPTY_TICKET, TicketData } from "@/lib/types";
import { OFFENCE_CODES, FILING_STEPS } from "@/lib/defenseLibrary";

type Step = "details" | "ground" | "result";

export default function AppealPage() {
  const [step, setStep] = useState<Step>("details");
  const [ticket, setTicket] = useState<TicketData>(EMPTY_TICKET);
  const [offenceIndex, setOffenceIndex] = useState<number>(0);
  const [groundId, setGroundId] = useState<string>("");
  const [details, setDetails] = useState("");
  const [letter, setLetter] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const offence = OFFENCE_CODES[offenceIndex];
  const ground = offence?.grounds.find((g) => g.id === groundId);
  const set = (k: keyof TicketData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setTicket({ ...ticket, [k]: e.target.value });

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, offenceIndex, groundId, details }),
      });
      if (!res.ok) throw new Error("Could not generate the letter. Try again.");
      const data = await res.json();
      setLetter(data.letter);
      setEvidence(data.evidence || []);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="steps">
        <span className={step === "details" ? "active" : ""}>1. Ticket details</span>
        <span>&rsaquo;</span>
        <span className={step === "ground" ? "active" : ""}>2. Your grounds</span>
        <span>&rsaquo;</span>
        <span className={step === "result" ? "active" : ""}>3. Letter &amp; filing</span>
      </div>

      {error && <p style={{ color: "#ff8b8b" }}>{error}</p>}

      {step === "details" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Enter your ticket details</h2>
          <p className="muted">
            Copy these straight off your Parking Violation Notice. (Snap-a-photo
            auto-fill is coming in a later version.)
          </p>
          <div className="row">
            <div>
              <label>Violation / notice number</label>
              <input value={ticket.citationNumber} onChange={set("citationNumber")} />
            </div>
            <div>
              <label>Licence plate</label>
              <input value={ticket.plateNumber} onChange={set("plateNumber")} />
            </div>
            <div>
              <label>Date of violation</label>
              <input value={ticket.violationDate} onChange={set("violationDate")} placeholder="YYYY-MM-DD" />
            </div>
            <div>
              <label>Time of violation</label>
              <input value={ticket.violationTime} onChange={set("violationTime")} placeholder="e.g. 6:40 PM" />
            </div>
            <div>
              <label>Location on the notice</label>
              <input value={ticket.location} onChange={set("location")} />
            </div>
            <div>
              <label>Vehicle (make / model / colour)</label>
              <input value={ticket.vehicleDesc} onChange={set("vehicleDesc")} />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => setStep("ground")}>
              Next: choose your grounds
            </button>
          </div>
        </div>
      )}

      {step === "ground" && (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>What kind of ticket, and why is it wrong?</h2>

          <label>Type of violation</label>
          <select
            value={offenceIndex}
            onChange={(e) => { setOffenceIndex(Number(e.target.value)); setGroundId(""); }}
          >
            {OFFENCE_CODES.map((o, i) => (
              <option key={i} value={i}>{o.shortName}</option>
            ))}
          </select>
          <p className="muted" style={{ fontSize: 13 }}>{offence?.description}</p>

          <label>Your grounds to dispute</label>
          <select value={groundId} onChange={(e) => setGroundId(e.target.value)}>
            <option value="">— select —</option>
            {offence?.grounds.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>

          {ground && (
            <div style={{ marginTop: 12 }}>
              <p className="muted" style={{ fontSize: 13 }}>{ground.whenToUse}</p>
              <p style={{ fontSize: 13, marginBottom: 4 }}>Evidence to attach:</p>
              <ul style={{ marginTop: 0 }}>
                {ground.evidence.map((ev, i) => (
                  <li key={i} className="muted" style={{ fontSize: 13 }}>{ev}</li>
                ))}
              </ul>
            </div>
          )}

          <label>Anything specific to add? (fills into the letter)</label>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} />

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setStep("details")}>Back</button>
            <button className="btn" onClick={generate} disabled={busy || !ground}>
              {busy ? "Generating…" : "Generate my letter"}
            </button>
          </div>
        </div>
      )}

      {step === "result" && (
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Your draft — paste this into the City portal</h2>
            <div className="letter">{letter}</div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => navigator.clipboard.writeText(letter)}>
                Copy letter
              </button>
              <button className="btn btn-secondary" onClick={() => setStep("ground")}>
                Edit grounds
              </button>
            </div>
          </div>

          {evidence.length > 0 && (
            <div className="card">
              <h2 style={{ marginTop: 0 }}>Attach this evidence</h2>
              <ul>{evidence.map((ev, i) => <li key={i}>{ev}</li>)}</ul>
            </div>
          )}

          <div className="card">
            <h2 style={{ marginTop: 0 }}>How to file with the City of Toronto</h2>
            <ol>{FILING_STEPS.map((s, i) => <li key={i} style={{ margin: "6px 0" }}>{s}</li>)}</ol>
            <p className="muted" style={{ fontSize: 13 }}>
              Review every detail before submitting. This is a self-help tool, not
              legal advice — you remain the named disputant.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
