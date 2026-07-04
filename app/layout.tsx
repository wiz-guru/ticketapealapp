import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeTicketAppeal — fight your Toronto parking ticket for free",
  description:
    "Free, open-source self-help tool to draft a Toronto parking-ticket dispute letter and file it with the City. No account, no fees.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="bar">
            <a href="/" className="brand">Free<span>Ticket</span>Appeal</a>
            <nav className="nav">
              <a href="/#how">How it works</a>
              <a href="/#faq">FAQ</a>
              <a href="/appeal" className="btn" style={{ padding: "9px 16px", fontSize: 14 }}>Start</a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="inner">
            <span>A free, open-source self-help tool. Not legal advice.</span>
            <span><a href="/legal">Terms, Privacy &amp; Disclaimer</a> · Toronto parking (APS) only</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
