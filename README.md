# Aureumpay

Aureumpay is a React application powered by Vite, React Router, and Firebase.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Project structure

- `src/pages/` — home, about, login, registration, dashboard, and admin screens.
- `src/components/` — shared page layout, page styles, and page initialization.
- `src/scripts/` — per-page Firebase integration and existing page interactions.
- `src/styles/` — styles kept separate for each page.
- `src/firebase.js` — shared Firebase app configuration and initialization.
- `src/main.jsx` — application router and entry point.

Both the original `.html` routes and the shorter React paths are supported.
`vercel.json` configures Vercel to serve the SPA entry point for client-side routes such
as `/login`, `/register`, `/dashboard`, and `/admin`, including on browser refresh.
For other production hosts, configure an equivalent SPA fallback.

## Transactional email with Resend

The Vercel API at `/api/notifications` sends registration emails (to the user
and admins), local and international transfer-request emails (to admins), and
emails when a user's balance actually changes. Resend and Firebase Admin
credentials are server-only. Never put them in `VITE_` variables or the
frontend `.env` file.

Configure these variables in the Vercel project's Environment Variables for
every deployment environment you use:

- `RESEND_API_KEY` — a newly generated Resend API key.
- `RESEND_FROM_EMAIL` — a sender address on a domain verified in Resend.
- `ADMIN_NOTIFICATION_EMAILS` — comma-separated admin recipient addresses.
- `FIREBASE_DATABASE_URL` — the Realtime Database URL for this Firebase project.
- `FIREBASE_SERVICE_ACCOUNT_JSON` — the full JSON service-account key for the
  same Firebase project. Create it from Firebase Console → Project settings →
  Service accounts. Treat it as a private credential.

If a Resend API key has ever been pasted into a chat or committed to source
control, revoke it in Resend and create a replacement. Do not send the
replacement through chat or add it to this repository.

Redeploy the Vercel project after setting the variables. Registration emails
are sent only for registrations made after deployment. Check Vercel Function
logs and the Resend dashboard if a message is missing. The browser reports if
an account or transaction was saved but its notification could not be sent.
