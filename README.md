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
