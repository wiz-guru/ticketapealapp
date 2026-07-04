export const metadata = {
  title: "Terms, Privacy & Disclaimer — Ticket Appeal",
};

export default function LegalPage() {
  const updated = "June 2026";
  return (
    <div className="container">
      <h1>Terms, Privacy &amp; Disclaimer</h1>
      <p className="muted">Last updated: {updated}</p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Not legal advice</h2>
        <p>
          This is a free self-help tool for disputing City of Toronto parking
          Penalty / Violation Notices through the Administrative Penalty System
          (APS). It does not provide legal advice and using it does not create a
          lawyer–client or paralegal–client relationship. We are not your legal
          representative. You remain the named disputant and are solely
          responsible for what you submit to the City.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your responsibility &amp; accuracy</h2>
        <p>
          The draft letters are generated from templates and the information you
          enter. You must review every detail for accuracy before submitting.
          Providing false or misleading information or evidence to the City is an
          offence under the Administrative Penalty By-law (Toronto Municipal Code
          Chapter 610). We make no guarantee that any dispute will succeed or that
          a penalty will be cancelled or reduced. Bylaw references and fine
          amounts are provided for convenience and may change — confirm them
          against the current Toronto Municipal Code.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Privacy</h2>
        <p>
          This tool runs in your browser. The ticket details you type are used
          only to generate your letter on your device and are not saved to an
          account or sold to anyone. We do not run advertising and we do not share
          your information with insurers or third-party marketers. If basic,
          privacy-respecting analytics are added, they will be limited to
          aggregate usage and will never include the contents of your ticket.
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Limitation of liability</h2>
        <p>
          The tool is provided &quot;as is,&quot; without warranties of any kind.
          To the fullest extent permitted by law, the creator is not liable for
          any loss arising from your use of the tool, including any unsuccessful
          dispute, missed deadline, or penalty that remains payable. You are
          responsible for meeting the City&apos;s deadlines (generally 15 days
          from the notice date).
        </p>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Scope</h2>
        <p>
          This tool covers City of Toronto parking notices under the APS only. It
          does not handle Provincial Offences Act matters (e.g. speeding, red-light
          or careless-driving charges), which are heard in court and may require a
          licensed paralegal or lawyer.
        </p>
      </div>

      <p className="muted" style={{ fontSize: 13 }}>
        This page is a plain-language starting point, not a substitute for a
        lawyer&apos;s review. Have it reviewed before you launch publicly.
      </p>
    </div>
  );
}
