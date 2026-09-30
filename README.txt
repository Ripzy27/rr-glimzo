R&R GLIMZO — COMPLETE WEBSITE SOURCE
Exported: 30 September 2026

This is the full editable source for the latest website, including the lavender
ombre design, correctly proportioned logo, domestic and commercial request forms,
hospital and nursery information, and website privacy notice.

FILES
  dist/index.html                Main website and enquiry forms
  dist/privacy.html              Website privacy notice
  dist/site.css                  All page styling and responsive layouts
  dist/requests.js               Form preparation, copying and section navigation
  dist/assets/glimzo-logo.png     Original company logo
  .openai/hosting.json            Configuration for the existing ChatGPT Site

This is a static HTML, CSS and JavaScript website. No framework, npm installation,
build step or database is needed. The files in dist are the editable source and
also the files you upload to a web host.

VIEW ON YOUR COMPUTER
1. Extract this ZIP.
2. Open dist/index.html in your web browser to view the design.
3. If clipboard access is unavailable, the request form selects the prepared text
   so you can copy it manually.

For an optional local web server, if Python is installed, open a terminal in this
project folder and run:
  python -m http.server 8080 --directory dist
Then visit http://localhost:8080 in your browser.

UPLOAD TO YOUR WEB HOST
1. Choose a hosting option for a custom HTML/static website.
2. Upload the CONTENTS of dist into the host's website root (often public_html).
   index.html, privacy.html, site.css, requests.js and the assets folder should
   sit together at that root. Do not upload the outer dist folder as the home page.
3. Keep the assets folder and file names unchanged.
4. Connect your domain and enable HTTPS using your host's setup instructions.
5. Check both enquiry forms, the privacy page and the mobile layout.

The .openai configuration is included to preserve the original project. It is
not required on another hosting provider. The archive contains no account tokens,
passwords, Git history or runtime credentials.

EDITING
- Edit dist/index.html to change the main website text and form fields.
- Edit dist/site.css to change colours, spacing and layout.
- Edit dist/requests.js to change form behaviour or add a sending integration.
- Edit dist/privacy.html when your business data handling changes.
- Replace dist/assets/glimzo-logo.png to change the logo.
Any code editor can open these files. Keep a copy before editing.

CURRENT ENQUIRY BEHAVIOUR
The forms validate entries and prepare a message that the visitor can copy.
They do not send emails, submit to WhatsApp, save customer details to a server,
or confirm bookings. An email/WhatsApp destination or backend form service still
needs to be connected before customers can send enquiries through the website.

The privacy notice accurately describes these local-only forms. Before enabling
message delivery, update it with the business contact, lawful basis, retention,
recipient/service-provider information and data rights arrangements. Review the
hosting-related wording for your selected provider as part of that update.

Service areas, contact details, pricing, credentials and insurance claims should
be added only when confirmed. Healthcare work is described as subject to a site
assessment and agreed scope; the site does not claim NHS or CQC accreditation.
