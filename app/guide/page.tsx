export const metadata = {
  title: "How to dispute a Toronto parking ticket (free 2026 guide)",
  description:
    "A plain-English guide to disputing a City of Toronto parking ticket through the Administrative Penalty System (APS): deadlines, the strongest grounds, evidence, and how to file your screening review — free.",
};

export default function GuidePage() {
  return (
    <div className="container">
      <h1>How to dispute a Toronto parking ticket</h1>
      <p className="lead">
        A plain-English walkthrough of the City of Toronto&apos;s Administrative
        Penalty System (APS) — the deadlines, the grounds that actually work, the
        evidence to gather, and how to file. Free, and you stay in control.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>The deadline comes first</h2>
        <p className="muted">
          You have <strong>15 days from the notice date</strong> to request a
          screening review. Miss it and you have up to 60 days to ask for an
          extension, but you must give reasons. Do not pay first — once you pay
          (even partially), the matter is closed and you can no longer dispute it.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>What a screening officer can actually do</h2>
        <p className="muted">
          Under the Administrative Penalty By-law (Toronto Municipal Code Chapter
          610, § 610-2.2B), a screening officer decides whether it was reasonable
          for the officer to issue the penalty, and may cancel it if you show, on
          a balance of probabilities, that <em>the violation was not committed as
          set out in the penalty notice</em>. They can also cancel, reduce, or
          extend time to pay for genuine undue hardship. If you disagree with the
          screening decision, you have 15 days to request a final hearing review.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Grounds that tend to work</h2>
        <ul className="clean muted">
          <li><strong>Signage missing, obscured, or not visible</strong> — for offences that depend on a posted sign.</li>
          <li><strong>A material error on the ticket</strong> — wrong plate, location, date/time, or vehicle description.</li>
          <li><strong>You had valid payment or a permit</strong>, or were within the 10-minute pay-and-display grace period (Ch. 910 § 910-2C).</li>
          <li><strong>The time/day was outside the posted restriction.</strong></li>
          <li><strong>Distance is wrong</strong> — you were actually farther than 3 m from the hydrant, or 9 m from the intersection.</li>
          <li><strong>Undue hardship</strong> — a separate path if you genuinely can&apos;t pay.</li>
        </ul>
        <p className="muted small">
          Most disputes that fail lose on <em>procedure</em> — weak evidence, poor
          structure, or a missed deadline — not on the merits. Strong, specific
          evidence is what wins.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Evidence: photograph it right</h2>
        <ul className="clean muted">
          <li>Take dated photos <strong>from the driver&apos;s viewpoint</strong> showing what a reasonable person would (or wouldn&apos;t) see.</li>
          <li>For signage: a wide shot for context <em>and</em> a close-up of the sign (or the gap where it should be).</li>
          <li>For payment: your pay-and-display receipt or parking-app transaction with the time visible.</li>
          <li>For distance: include a reference point so the measurement is clear.</li>
        </ul>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>How to file</h2>
        <ol className="clean muted">
          <li>Go to the City&apos;s Parking Violation Lookup and find your notice by violation number + plate.</li>
          <li>Choose <strong>Request a Screening Review</strong> and paste your letter into the explanation field.</li>
          <li>Upload your evidence. You get <strong>one</strong> screening review, so include everything now.</li>
          <li>Submit. You don&apos;t pay while it&apos;s pending. Current City turn-around is up to about 10 months.</li>
        </ol>
      </div>

      <div style={{ textAlign: "center", margin: "28px 0 8px" }}>
        <a href="/appeal" className="btn btn-lg">Draft my appeal — free →</a>
      </div>
      <p className="muted small" style={{ textAlign: "center" }}>
        This is a self-help guide, not legal advice. You remain the named
        disputant and are responsible for what you submit.
      </p>
    </div>
  );
}
