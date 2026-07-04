import { NextResponse } from "next/server";

// NOT USED. OCR now runs entirely CLIENT-SIDE (Tesseract.js in /appeal), so the
// photo never leaves the user's device and there is no server cost or API key.
// This route is kept only as a placeholder in case a future opt-in server-side
// vision upgrade is added (which would require disclosure + an API key).
export async function POST() {
  return NextResponse.json(
    { error: "OCR runs client-side in the browser; no server endpoint is used." },
    { status: 501 }
  );
}
