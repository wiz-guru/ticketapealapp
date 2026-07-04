export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <span className="pill">Free · Open-source · Toronto only</span>
        <h1>Fight your Toronto parking ticket — for free</h1>
        <p className="lead">
          Answer a few questions, get a dispute letter that cites the right City
          bylaw, and file it yourself in minutes. No account. No fees. No catch.
        </p>
        <a href="/appeal" className="btn btn-lg">Start my appeal →</a>
        <p className="small muted" style={{ marginTop: 14 }}>
          Others charge ~$10 per ticket and guarantee nothing. This is $0.
        </p>
      </section>

      <div className="container-wide">
        {/* HOW IT WORKS */}
        <section id="how" style={{ padding: "24px 0 8px" }}>
          <h2 style={{ textAlign: "center" }}>How it works</h2>
          <div className="grid3" style={{ marginTop: 20 }}>
            <div className="card">
              <div className="step-num">1</div>
              <h3>Enter your ticket</h3>
              <p className="muted small">Copy the details straight off your Parking Violation Notice.</p>
            </div>
            <div className="card">
              <div className="step-num">2</div>
              <h3>Find your grounds</h3>
              <p className="muted small">A few quick questions point you to the strongest reason to dispute — with the exact bylaw.</p>
            </div>
            <div className="card">
              <div className="step-num">3</div>
              <h3>Get your letter</h3>
              <p className="muted small">Copy a ready-to-paste letter and follow the steps to file your screening review with the City.</p>
            </div>
          </div>
        </section>

        {/* WHY FREE */}
        <section style={{ padding: "40px 0 8px" }}>
          <div className="card" style={{ background: "var(--brand-tint)", borderColor: "#d6e4ff" }}>
            <h2>Why is this free?</h2>
            <p className="muted">
              It was built by a law student who thinks fighting an unfair $75 ticket
              shouldn&apos;t cost you $10 and a data-harvesting sign-up. The tool cites
              real City of Toronto bylaws, keeps everything in your browser, sells
              nothing, and shows no ads. The code is open-source so anyone can check
              how it works — or improve it.
            </p>
            <ul className="clean muted">
              <li>No account and no payment, ever.</li>
              <li>Your ticket details stay in your browser — we store nothing on a server.</li>
              <li>No insurance referrals, no data resale, no ads.</li>
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ padding: "32px 0 56px" }}>
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Frequently asked questions</h2>

          <details>
            <summary>Is this really free?</summary>
            <div className="a">Yes. There is no charge, no account, and no upsell. You do the filing yourself through the City&apos;s own portal, which is also free.</div>
          </details>
          <details>
            <summary>Does it guarantee my ticket gets cancelled?</summary>
            <div className="a">No — and be wary of anyone who claims to. The tool helps you make the strongest honest case using real bylaws. The City&apos;s screening officer decides the outcome.</div>
          </details>
          <details>
            <summary>Is this legal advice?</summary>
            <div className="a">No. It&apos;s a self-help tool. You remain the named disputant and are responsible for what you submit. For complex matters, talk to a licensed paralegal or lawyer.</div>
          </details>
          <details>
            <summary>What kinds of tickets does it cover?</summary>
            <div className="a">City of Toronto <strong>parking</strong> notices handled under the Administrative Penalty System (APS) — 12 of the most common offences. It does not cover court/POA matters like speeding or red-light tickets.</div>
          </details>
          <details>
            <summary>How long do I have to dispute?</summary>
            <div className="a">Generally 15 days from the notice date to request a screening review (up to 60 days to ask for an extension with reasons). Don&apos;t wait — the tool reminds you of the deadlines.</div>
          </details>
          <details>
            <summary>What happens to my data?</summary>
            <div className="a">Your ticket details are used in your browser to build the letter. There&apos;s no account and no server-side database, and nothing is sold or shared. The one exception is the optional &ldquo;Polish with AI&rdquo; button (see below), which you choose to use.</div>
          </details>
          <details>
            <summary>What is &ldquo;Polish with AI&rdquo;?</summary>
            <div className="a">An optional button on the letter screen. If you use it, your draft letter is sent to an AI service that rewrites it to read more smoothly — the bylaw citations and facts are kept unchanged. It&apos;s entirely optional; skip it and everything stays in your browser. Always review the result before submitting.</div>
          </details>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <a href="/appeal" className="btn btn-lg">Start my appeal →</a>
          </div>
        </section>
      </div>
    </div>
  );
}
