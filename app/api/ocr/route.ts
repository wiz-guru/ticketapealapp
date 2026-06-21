import { NextResponse } from "next/server";

// v2 FEATURE -- NOT in v1.
// v1 uses manual entry (a simple form). Photo OCR auto-fill is planned for v2:
// accept an image, send it to a vision model, and pre-fill the TicketData form.
export async function POST() {
  return NextResponse.json(
    { error: "OCR is a v2 feature. v1 uses manual entry." },
    { status: 501 }
  );
}
