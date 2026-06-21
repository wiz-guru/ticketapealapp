import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ticket Appeal — fight your Toronto parking ticket for free",
  description:
    "Draft a Toronto parking-ticket dispute letter and learn how to file it with the City. Free self-help tool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a href="/" className="brand">Ticket Appeal</a>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <p>
            A free self-help tool — not legal advice.{" "}
            <a href="/legal">Terms, Privacy &amp; Disclaimer</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
