import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, TicketData } from "@/lib/types";
import { OFFENCE_CODES, SCREENING_FRAMING, DISCLAIMER } from "@/lib/defenseLibrary";

// v1 base letter = TEMPLATE-FILL (deterministic, no LLM). Assembled from the
// verified defense library so it can never invent a bylaw or legal claim.
// An optional /api/polish step can rewrite the prose while keeping citations.

function fill(template: string, ticket: TicketData, details: string): string {
  const map: Record<string, string> = {
    citationNumber: ticket.citationNumber || "[citation number]",
    plateNumber: ticket.plateNumber || "[plate]",
    violationDate: ticket.violationDate || "[date]",
    violationTime: ticket.violationTime || "[time]",
    location: ticket.location || "[location]",
    vehicleDesc: ticket.vehicleDesc || "[vehicle]",
    details: details?.trim() || "",
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => map[k] ?? "").trim();
}

export async function POST(req: NextRequest) {
  const { ticket, offenceIndex, groundId, details } =
    (await req.json()) as GenerateRequest;

  const offence = OFFENCE_CODES[offenceIndex];
  if (!offence) return NextResponse.json({ error: "Unknown offence" }, { status: 400 });
  const ground = offence.grounds.find((g) => g.id === groundId);
  if (!ground) return NextResponse.json({ error: "Unknown ground" }, { status: 400 });

  const today = new Date().toISOString().slice(0, 10);
  const cite = ticket.citationNumber || "[citation number]";
  const body = fill(ground.template, ticket, details);
  const evidenceLines = ground.evidence.map((e) => "  • " + e);

  const lines: (string | null)[] = [
    today,
    "",
    "To: Screening Review, City of Toronto Administrative Penalty System",
    "",
    "Re: Request for a Screening Review — Parking Violation Notice " + cite,
    "Licence plate: " + (ticket.plateNumber || "[plate]"),
    "Alleged offence: " + offence.shortName + " (" + offence.code + ")",
    "Date of alleged violation: " + (ticket.violationDate || "[date]") +
      (ticket.violationTime ? " at " + ticket.violationTime : ""),
    ticket.location ? "Location: " + ticket.location : null,
    "",
    ground.framing || SCREENING_FRAMING,
    "",
    body,
    "",
    "In support of this request, I am submitting the following:",
    ...evidenceLines,
    "",
    "For these reasons, I respectfully request that this Parking Violation Notice " +
      "be cancelled, or that other appropriate relief be granted. I am happy to " +
      "provide any further information required.",
    "",
    "Sincerely,",
    "[Your name]",
    "[Contact information]",
    "",
    "---",
    DISCLAIMER,
  ];
  const letter = lines.filter((x) => x !== null).join("\n");

  return NextResponse.json({ letter, evidence: ground.evidence });
}
