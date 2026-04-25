# Huruma TeacherHub

An offline-friendly MVP web prototype for Compassion Kenya teachers and partner staff.

## What is included
- `Role-aware sign-in` for teacher, FCP lead, safeguarding lead, and education coordinator demo workspaces
- `Server-enforced data scoping` so each role only receives its allowed learner, case, and contact slice
- `Read-only oversight mode` for education coordinators, with classroom write controls locked
- `Audit trail` for oversight roles to review recent protected workspace activity
- `Today dashboard` for classes, attendance, alerts, and field notes
- `Learner support desk` with strengths, needs, competencies, and caregiver details
- `Lesson planner` that blends CBC strands with Compassion holistic outcomes
- `Referral workflow` for follow-up and escalation
- `Caregiver message center`
- `Leadership insights`
- `Neon PostgreSQL persistence` through the local API
- `Local fallback snapshot` via `localStorage`
- `Offline cache` through a service worker

## Run locally
From this folder:

```powershell
npm start
```

Then open:

`http://localhost:4173`

This now starts the local Huruma API and serves the app from the same process.

## Environment
- The app reads `DATABASE_URL` and `SESSION_SECRET` from `.env.local` or `.env`.
- A sample format is in `.env.example`.

## Demo access
- `grace@huruma.local` / `2401` - Teacher
- `joseph@huruma.local` / `2402` - FCP Lead
- `anne@huruma.local` / `2403` - Safeguarding Lead
- `ruth@huruma.local` / `2404` - Education Coordinator

## Files
- `index.html` - app shell and screens
- `styles.css` - UI styling and responsive layout
- `assets/app.js` - seeded data, rendering, and interactions
- `seed-state.json` - backend seed snapshot used for bootstrap and reset flows
- `huruma-api.js` - shared local/Vercel API, Neon/PostgreSQL persistence, and session handling
- `api/[route].js` - Vercel function entrypoint for `/api/*`
- `manifest.webmanifest` - installable app metadata
- `service-worker.js` - offline cache
- `scripts/verify-roles.js` - role rendering verification

## Notes
- This is a functional MVP prototype, not a production system.
- Data is demo data for product design purposes.
- Runtime state is saved to PostgreSQL when `DATABASE_URL` is available.
- The server falls back to `data/state.json` only if the database is unavailable.
- The browser still keeps a local snapshot for offline fallback.
- Sensitive case masking and caregiver phone masking are now enforced by the API, not just the browser.
- Signed-out bootstrap and export routes do not expose the workspace dataset.
- The Vercel deploy uses static site assets plus `/api/*` serverless routes that share the same backend logic as local development.

## Verification
With the local server running:

```powershell
npm run verify:roles
npm run verify:security
```
