import { NextRequest, NextResponse } from "next/server";

// OPTIONAL AI polish. Rewrites the deterministic draft into more persuasive,
// personalized prose WITHOUT changing any citation, fine, date, or fact.
// Requires ANTHROPIC_API_KEY (set it in Vercel env). If absent, returns 501.

const SYSTEM =
  "You refine a self-represented person's parking-ticket dispute letter to the " +
  "City of Toronto Administrative Penalty System. Rewrite it to be more " +
  "persuasive, professional, well-structured, and personalized to the facts " +
  "given. STRICT RULES: do NOT add, remove, or change any bylaw/section number, " +
  "fine amount, date, time, licence plate, citation number, or factual claim; do " +
  "NOT invent new legal grounds or facts; keep any bracketed placeholders like " +
  "[Your name] intact; keep the final disclaimer line after '---' unchanged; keep " +
  "it concise and respectful. Output ONLY the finished letter, no preamble.";

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "AI polish isn't configured yet. Add ANTHROPIC_API_KEY in your Vercel project settings to enable it." },
      { status: 501 }
    );
  }
  const { letter } = (await req.json()) as { letter?: string };
  if (!letter || letter.length < 20) {
    return NextResponse.json({ error: "Nothing to polish." }, { status: 400 });
  }
  const model = process.env.POLISH_MODEL || "claude-sonnet-4-6";
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1500,
        system: SYSTEM,
        messages: [{ role: "user", content: "Rewrite this letter:\n\n" + letter }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: "AI service error: " + t.slice(0, 200) }, { status: 502 });
    }
    const data = await r.json();
    const text = data?.content?.[0]?.text;
    if (!text) return NextResponse.json({ error: "No text returned." }, { status: 502 });
    return NextResponse.json({ letter: text.trim() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Polish failed." }, { status: 500 });
  }
}
