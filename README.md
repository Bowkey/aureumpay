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
For production hosting, configure the host to serve `index.html` for client-side routes.
