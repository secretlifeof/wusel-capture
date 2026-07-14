import { createFileRoute } from '@tanstack/react-router';

import { A, Callout, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';

export const Route = createFileRoute('/cookies')({
  head: () => ({ meta: [{ title: 'Cookie Policy · Wusel Capture' }] }),
  component: CookiesPage,
});

const LAST_UPDATED = '14 July 2026';

function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated={LAST_UPDATED}>
      <Callout title="The short version">
        <P>
          This website sets <strong>no cookies at all</strong> — not even &quot;strictly
          necessary&quot; ones. It runs no analytics, no advertising and no cross-site tracking, and
          it loads nothing from a third-party CDN. That is why you will never see a cookie banner
          here: there is nothing to accept and nothing to reject.
        </P>
      </Callout>

      <LegalSection id="what-are-cookies" title="1. What cookies are">
        <P>
          Cookies are small text files a website can store in your browser. Related technologies
          such as{' '}
          <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">localStorage</code>{' '}
          and <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">IndexedDB</code>{' '}
          also let a site or an extension keep data on your device. They can serve essential
          functions or they can be used to track people. We use no cookies, and use device storage
          only inside the extension, on your own machine.
        </P>
      </LegalSection>

      <LegalSection id="this-site" title="2. What this website stores">
        <P>
          Nothing. These pages are static HTML, CSS and a little JavaScript. They set no cookies,
          write nothing to your browser&apos;s storage, and contain no analytics, tag managers,
          advertising pixels or social embeds.
        </P>
        <P>
          Our fonts are served from this site rather than from Google Fonts or any other font CDN,
          so that reading these pages does not hand your IP address to a third party.
        </P>
        <P>
          The only party that necessarily sees your request is our host, GitHub Pages, which
          processes standard connection data in order to deliver the page. That is described in the{' '}
          <A href="/privacy">Privacy Policy</A>.
        </P>
      </LegalSection>

      <LegalSection id="extension-storage" title="3. Storage used by the browser extension">
        <P>
          The extension is a separate thing from this website, and it does use local storage on your
          own device — never a cookie, and never a server:
        </P>
        <UL>
          <li>
            <strong>IndexedDB</strong> holds a capture briefly while it travels from the popup to
            the editor tab, and keeps only the 10 most recent.
          </li>
          <li>
            <strong>Extension storage</strong> keeps exactly two UI preferences: which AI assistant
            you picked, and an optional session id you may type in.
          </li>
        </UL>
        <P>
          None of this is used to identify or track you, and none of it is shared with anyone. See
          the <A href="/privacy">Privacy Policy</A> for the full picture.
        </P>
      </LegalSection>

      <LegalSection id="manage" title="4. Clearing this storage">
        <P>
          You can clear browser storage at any time in your browser settings. Uninstalling the
          extension removes everything it stored. Nothing here will break as a result — there are no
          preferences we depend on.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="5. If this ever changes">
        <P>
          If we ever introduce a cookie that is not strictly necessary, we will update this page and
          ask for your consent beforehand where the law requires it. We have no plans to.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
