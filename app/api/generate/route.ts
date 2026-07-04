import { NextRequest, NextResponse } from "next/server";
import { GenerateRequest, TicketData } from "@/lib/types";
import {
  OFFENCE_CODES,
  SCREENING_FRAMING,
  DISCLAIMER,
} from "@/lib/defenseLibrary";

// v1 = TEMPLATE-FILL (no LLM). The letter is assembled deterministically from
// the verified defense library, so it can never invent a bylaw or legal claim.
// Optional LLM polishing is a later, separate decision -- not v1.

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
  if (!offence) {
    return NextResponse.json({ error: "Unknown offence" }, { status: 400 });
  }
  const ground = offence.grounds.find((g) => g.id === groundId);
  if (!ground) {
    return NextResponse.json({ error: "Unknown ground" }, { status: 400 });
  }

  const body = fill(ground.template, ticket, details);

  const letter = [
    "Re: Parking Violation Notice " + (ticket.citationNumber || "[citation number]"),
    "Licence plate: " + (ticket.plateNumber || "[plate]"),
    "Date of violation: " + (ticket.violationDate || "[date]"),
    "",
    ground.framing || SCREENING_FRAMING,
    "",
    body,
    "",
    "For these reasons, I respectfully request that this Parking Violation Notice be cancelled, or that other appropriate relief be granted.",
    "",
    "Sincerely,",
    "[Your name]",
    "",
    "---",
    DISCLAIMER,
  ].join("\n");

  return NextResponse.json({ letter, evidence: ground.evidence });
}
