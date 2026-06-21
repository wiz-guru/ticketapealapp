export default function Home() {
  return (
    <div>
      <h1>Fight your Toronto parking ticket — for free</h1>
      <p className="muted">
        Answer a few questions about your ticket and get a draft dispute letter
        that cites the right grounds, plus step-by-step instructions to file it
        with the City. No account, no fees, no catch.
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>How it works</h2>
        <ol>
          <li>Enter the details from your Parking Violation Notice.</li>
          <li>Pick the type of ticket and why it&apos;s wrong — we explain the valid grounds.</li>
          <li>Get a ready-to-paste letter and a guide to filing your screening review.</li>
        </ol>
        <a href="/appeal" className="btn">Start your appeal</a>
      </div>

      <p className="muted" style={{ fontSize: 13 }}>
        Toronto parking tickets only (Administrative Penalty System). This is a
        self-help tool, not legal advice — you remain the named disputant.
      </p>
    </div>
  );
}
