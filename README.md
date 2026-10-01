# R&R Glimzo website

Marketing site for R&R Glimzo, built with React, TypeScript and Vite.
It has two pages: the home page with the domestic and commercial request forms, and the privacy notice.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev       # local dev server with hot reload
npm run build     # type-check and build to dist/
npm run preview   # serve the built dist/ locally
npm run lint
```

## Admin panel and API

Requests from the forms are stored by the separate API in the `rr-glimzo-server` repo (Express + PostgreSQL).
Start it first (see its README), then `npm run dev` here: Vite proxies `/api` to `http://localhost:3001`
(override with `API_URL`).

The admin panel is part of this app, at `/0/v1/admin` (quotes as cards) and `/0/v1/admin/board`
(drag-and-drop board: Pending → Discussion ongoing → Confirmed → Done). It signs in through the API.

## Project layout

```
index.html                 Page shell (title, meta, favicon) — Vite entry point
src/main.tsx               Home page entry
src/App.tsx                Hash routing between the home, privacy and terms pages
src/pages/                 HomePage, PrivacyPage
src/components/            Page sections and form fields
src/requests/              Request panels/forms: open state, pre-selection, copy flow
src/lib/api.ts             Fetch helper for the API
src/shared/quotes.ts       Quote model and validation shared by site, admin and server
src/admin/                 Admin panel (login, quotes cards, board)
src/data/options.ts        Services, building types and other select options
src/styles/site.css        All styling and responsive layouts
src/assets/                Logo
```

## Current enquiry behaviour

The forms validate entries and send them to `POST /api/quotes`, where they are stored as `pending`.
Nothing is emailed: the team sees new requests in the admin panel.

Update the privacy notice to cover this storage (lawful basis, retention, who can see it).

Service areas, contact details, pricing, credentials and insurance claims should
be added only when confirmed. Healthcare work is described as subject to a site
assessment and agreed scope; the site does not claim NHS or CQC accreditation.
