import { CONTACT_EMAIL } from '../data/contact.ts'
import { PRIVACY_HASH } from '../lib/routes.ts'
import { SiteFooter } from '../components/SiteFooter.tsx'
import { SiteHeader } from '../components/SiteHeader.tsx'

export function PrivacyPage() {
  return (
    <>
      <SiteHeader brandHref="#">
        <a className="ghost" href="#quote">
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
            Your entries are used in your browser to create an email for you to review. Preparing a request does not
            send it to R&amp;R Glimzo and does not confirm a quote, site visit or booking. The forms do not send their
            contents to a server or save them in a website database.
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

          <h2>Sending your request</h2>
          <p>
            If you open the request in Gmail or paste it into an email, that service handles it under its own privacy
            terms. R&amp;R Glimzo receives your details only if you send the email to {CONTACT_EMAIL}, and will use them
            to reply to your enquiry.
          </p>

          <h2>Cookies and website access</h2>
          <p>
            We have not added advertising, analytics or tracking cookies to this website. The hosting and account
            sign-in services may process technical information to deliver and secure the page under their own privacy
            information. This notice describes the request forms; it does not replace those services’ notices.
          </p>

          <h2>How received enquiries are kept</h2>
          <p>
            Emails you send arrive in R&amp;R Glimzo’s inbox. Information about the lawful basis for using them, how
            long they are kept and how to exercise your data protection rights will be added to this notice.
          </p>

          <h2>Privacy questions</h2>
          <p>
            You can find independent information about your rights and how to raise a concern on the{' '}
            <a href="https://ico.org.uk/for-the-public/">Information Commissioner’s Office website</a>. You can also contact the
            business at {CONTACT_EMAIL}.
          </p>
          <p>
            <a href="#quote">Return to the enquiry forms</a>
          </p>
        </article>
      </main>
      <SiteFooter>
        <a href="#">Home</a>
        <a href={PRIVACY_HASH} aria-current="page">
          Privacy notice
        </a>
      </SiteFooter>
    </>
  )
}
