# Deploy guide — FreeTicketAppeal

Repo: https://github.com/wiz-guru/ticketapealapp
Standard Next.js app. **No environment variables needed** (no external APIs).

## Every time you make changes: push with GitHub Desktop

1. Open GitHub Desktop — it lists the changed files.
2. Write a short summary (e.g. "redesign + guided flow"), click **Commit to main**.
3. Click **Push origin**.

If Vercel is already connected (below), each push auto-deploys in ~1 minute.

## One-time: connect Vercel (free hosting)

1. Go to https://vercel.com and **Log in with GitHub**.
2. Click **Add New… → Project**.
3. Find `wiz-guru/ticketapealapp` and click **Import**.
   - Not listed? Click **Adjust GitHub App Permissions** and grant Vercel access
     to this repo, then come back.
4. Framework preset auto-detects **Next.js** — leave all build settings default.
5. **Environment Variables: none.** Skip that section.
6. Click **Deploy**. In ~1 minute you get a live `https://<name>.vercel.app` URL.

That URL is your live site. Every future push to `main` redeploys automatically.

## Custom domain (optional, when you pick a name)

Vercel project → **Settings → Domains → Add** → enter your `.ca` domain → add the
DNS records it shows at your registrar. HTTPS is automatic.

## First smoke test (do this on your phone)

- Open the live URL. Landing page loads, "Start my appeal" works.
- Run one full flow: enter a ticket → tap a couple of "which are true" chips →
  a ground shows a **Recommended** badge → generate → **Copy letter** works.
- Open `/legal` from the footer. Check the FAQ accordion on the homepage.

## Before you promote it publicly

- Verify the `VERIFY`-flagged items in `lib/defenseLibrary.ts` (grace period; that
  fines haven't changed since 2024).
- Confirm the screening-vs-hearing question (does the screening officer decide
  merits, or is that really the hearing stage?).
- Have a lawyer skim `/legal`.
- Pick a real name/domain to replace the "FreeTicketAppeal" placeholder.

## Troubleshooting

- **Build fails on Vercel** but works locally: make sure `node_modules` and
  `.next` are NOT committed (they're in `.gitignore`). Vercel installs and builds
  fresh.
- **Old version showing**: you didn't push the latest commit — Push origin in
  GitHub Desktop, Vercel redeploys automatically.

## Optional: enable the "Polish with AI" button

The core app needs no env vars. The optional AI-polish button on the result step
needs an Anthropic API key:

1. Get a key at console.anthropic.com.
2. Vercel → your project → Settings → Environment Variables → add
   `ANTHROPIC_API_KEY` = your key. (Optional: `POLISH_MODEL`, default
   `claude-sonnet-4-6`.)
3. Redeploy. Until the key is set, the button shows a friendly "not configured"
   message and the deterministic letter still works fully.

Note: with AI polish enabled, the letter text is sent to Anthropic's API to be
rewritten (the citations/facts are instructed to stay locked). This is the one
feature where data leaves the browser — worth a line in your privacy copy before
you promote it.
