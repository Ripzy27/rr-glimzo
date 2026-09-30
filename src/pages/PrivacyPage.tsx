import { SiteFooter } from '../components/SiteFooter.tsx'
import { SiteHeader } from '../components/SiteHeader.tsx'

export function PrivacyPage() {
  return (
    <>
      <SiteHeader brandHref="index.html">
        <a className="ghost" href="index.html#quote">
          Back to enquiries
        </a>
      </SiteHeader>
      <main className="wrap privacy-page">
        <article className="privacy-text">
          <div className="kicker">Your information</div>
          <h1>Website privacy notice</h1>
          <p className="updated">Last updated: 28 September 2026</p>
          <p>This notice explains how the request forms on the R&amp;R Glimzo website work in their current version.</p>

          <h2>Preparing a request</h2>
          <p>
            The forms help you prepare a domestic cleaning enquiry or a commercial site visit request. They ask for your
            name, email address, optional phone number and details about the property, cleaning and preferred timing.
            Commercial requests also include your organisation.
          </p>
          <p>
            Your entries are used in your browser to create a message for you to review and copy. Preparing or copying
            a request does not send it to R&amp;R Glimzo and does not confirm a quote, site visit or booking. The forms
            do not send their contents to a server or save them in a website database.
          </p>

          <h2>Your device and copied information</h2>
          <p>
            The website does not use browser storage to save your request. Entries remain in the open page; your
            browser may also retain form information through its own autofill or page-restore settings. If you select
            “Copy request”, the message is placed on your device’s clipboard. Clipboard history or device sync may
            retain it according to your settings.
          </p>
          <p>
            Only enter information needed to discuss the clean. Please leave out access codes, patient or child
            information and personal health details.
          </p>

          <h2>Sending your request elsewhere</h2>
          <p>
            If you paste the message into email or WhatsApp, that service handles it under its own privacy terms.
            R&amp;R Glimzo receives your details only if you separately send them to the business. No email or WhatsApp
            connection is currently enabled on these forms.
          </p>

          <h2>Cookies and website access</h2>
          <p>
            We have not added advertising, analytics or tracking cookies to this website. The hosting and account
            sign-in services may process technical information to deliver and secure the page under their own privacy
            information. This notice describes the request forms; it does not replace those services’ notices.
          </p>

          <h2>Before direct enquiries are enabled</h2>
          <p>
            R&amp;R Glimzo’s business contact details and information about how received enquiries are used, stored
            and shared will be added before direct form submission is enabled. This will include the relevant lawful
            basis, retention periods and how to exercise your data protection rights.
          </p>

          <h2>Privacy questions</h2>
          <p>
            You can find independent information about your rights and how to raise a concern on the{' '}
            <a href="https://ico.org.uk/for-the-public/">Information Commissioner’s Office website</a>. The business’s
            privacy contact will be published with its contact details.
          </p>
          <p>
            <a href="index.html#quote">Return to the enquiry forms</a>
          </p>
        </article>
      </main>
      <SiteFooter>
        <a href="index.html">Home</a>
        <a href="privacy.html" aria-current="page">
          Privacy notice
        </a>
      </SiteFooter>
    </>
  )
}
