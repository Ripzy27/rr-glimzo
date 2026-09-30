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

## Deploying

`npm run build` produces a static site in `dist/`. Upload the **contents** of `dist/`
(`index.html` and the `assets/` folder) to your server's web root, or any
subfolder, because asset paths are relative. No server-side runtime is needed.

## Project layout

```
index.html                 Page shell (title, meta, favicon) — Vite entry point
src/main.tsx               Home page entry
src/App.tsx                Hash routing between the home, privacy and terms pages
src/pages/                 HomePage, PrivacyPage
src/components/            Page sections and form fields
src/requests/              Request panels/forms: open state, pre-selection, copy flow
src/lib/requestText.ts     Builds the copyable request message
src/data/options.ts        Services, building types and other select options
src/styles/site.css        All styling and responsive layouts
src/assets/                Logo
```

## Current enquiry behaviour

The forms validate entries and prepare an email addressed to the business
(`src/data/contact.ts`). The visitor opens it in Gmail or copies it, and sends it
themselves. Nothing is sent to a server, and the site cannot tell whether the
email was sent. Automatic delivery would need a backend or form service.

Update the privacy notice with the lawful basis and retention arrangements, and
review its hosting-related wording for your server.

Service areas, contact details, pricing, credentials and insurance claims should
be added only when confirmed. Healthcare work is described as subject to a site
assessment and agreed scope; the site does not claim NHS or CQC accreditation.

The site is now a React + TypeScript project built with Vite. npm run build (type-check and bundle) and npm run lint both pass. I haven't opened it in a browser yet, so the forms and links are untested. Run npm run dev and click through them before you rely on it.

Structure

One page, one bundle. index.html is a small shell that loads the React app; the privacy policy and terms are shown at `index.html#privacy` and `index.html#terms`, rendered from `src/data/legal/`.
Components. The page sections are in src/components/ and the two pages in src/pages/. All the text and CSS classes are unchanged, and site.css was moved without edits.
Form logic. requests.js is replaced by React code in src/requests/:
Only one form panel can be open at a time.
The #domestic-request and #commercial-request links in the URL still open the right form.
Buttons like "Offices" or "End of tenancy" still open the form with that option already selected.
Validation, building the request text, and copy (with the fallback that selects the text if copying fails) all behave as before.
Checked options. The services and building types are listed once in options.ts. If a button tries to pre-select an option that isn't in the list, the build fails, so typos get caught.
Hosting. hosting.json is deleted and the ChatGPT-hosting notes are gone from the README. npm run build writes a static site to dist/, and you upload what's inside that folder to your server. Links inside the site are relative, so it works at your domain's root or in a subfolder.
README.txt is replaced by README.md, which has the commands and the folder layout.
One behaviour change: the old site showed the page but kept the forms locked until JavaScript loaded. Now the whole page is drawn by JavaScript, so visitors with JavaScript turned off only see a message asking them to enable it.

Worth changing:

The logo PNG is 2.9 MB. Converting it to WebP or shrinking it would speed up page loads a lot.
The "Cookies and website access" section of the privacy notice mentions "account sign-in services", which came from the ChatGPT hosting. Update that for your own server.
Nothing is committed yet.