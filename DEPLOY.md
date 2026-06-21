# Deploy guide — Ticket Appeal App

Standard Next.js project, ready to deploy. v1 needs **no environment variables**
(no external APIs). Path: GitHub → Vercel.

## One-time: confirm it runs locally

```bash
npm install
npm run dev      # http://localhost:3000 — click through the appeal flow
npm run build    # should finish with no errors
```

## Step 1 — Initialize git locally

A stray `.git` folder may exist from the editor environment — delete it first so
you start clean, then init on your own machine:

```bash
# from the project folder
rm -rf .git            # (Windows: delete the .git folder in File Explorer)
git init
git add -A
git commit -m "v1: Toronto parking appeal"
```

## Step 2 — Push to GitHub

Create an empty **public** repo on github.com (public = the open-source brand),
then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## Step 3 — Deploy on Vercel (free)

1. Go to vercel.com and sign in **with your GitHub account**.
2. **Add New… → Project**, then **Import** the repo.
3. It auto-detects **Next.js** — leave build settings default.
4. No environment variables needed for v1 — skip that.
5. **Deploy**. ~1 minute later you get a live `*.vercel.app` URL.

Every future `git push` to `main` auto-deploys — that's your pipeline.

## Step 4 — Custom domain (optional, when you pick a name)

Vercel project → **Settings → Domains → Add** → enter your `.ca` domain → add the
DNS records it shows at your registrar. HTTPS is automatic.

## What needs your accounts (can't be done for you)

- GitHub: create repo + `git push` (your login/token).
- Vercel: import + deploy (your Vercel login).

## Pre-launch checklist (full version in v1-launch-plan.md)

- [ ] Verify the `VERIFY` items in `lib/defenseLibrary.ts` (grace period; fines unchanged since 2024).
- [ ] Have a lawyer skim `/legal`.
- [ ] Click through the flow on a phone.
- [ ] Confirm browser-only: nothing stored server-side.
