import { createFileRoute } from '@tanstack/react-router';

import { A, Callout, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';

export const Route = createFileRoute('/cookies')({
  head: () => ({ meta: [{ title: 'Cookie Policy · Wusel Capture' }] }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="[PLACEHOLDER: date]">
      <Callout title="In short">
        <P>
          This website does not use tracking, advertising, or analytics cookies, so there is no
          consent banner to manage. Any storage we use is strictly necessary to make the site work,
          and the browser extension stores its data locally on your own device.
        </P>
      </Callout>

      <LegalSection id="what-are-cookies" title="1. What are cookies and similar technologies?">
        <P>
          Cookies are small text files that a website can store in your browser. Similar technologies
          such as <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">localStorage</code>{' '}
          and{' '}
          <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">IndexedDB</code> let a
          site or extension store data on your device. They can be used for essential functions or
          for tracking; we use them only where strictly necessary.
        </P>
      </LegalSection>

      <LegalSection id="no-banner" title="2. No consent banner required">
        <P>
          We do not set any cookies that require consent. We do not run advertising or cross-site
          tracking, and we do not build user profiles. Because of this, there is nothing for you to
          accept or reject here.
        </P>
      </LegalSection>

      <LegalSection id="essential" title="3. Strictly necessary storage">
        <P>
          Strictly necessary storage is used solely to provide functionality you have requested. On
          this website that is limited to items such as remembering a display preference. These items
          do not identify you and are not shared with third parties.
        </P>
        <UL>
          <li>
            [PLACEHOLDER: list each strictly necessary item — name, purpose, and duration — or state
            &quot;none&quot; if the site stores nothing.]
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="extension-storage" title="4. Storage used by the browser extension">
        <P>
          The Wusel Capture browser extension stores your captures (screenshots and notes) in your
          browser&apos;s <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">IndexedDB</code>{' '}
          on your device. This data never leaves your machine except when you choose to send a
          capture to your own AI tool or download it. See the <A href="/privacy">Privacy Policy</A>{' '}
          for details.
        </P>
      </LegalSection>

      <LegalSection id="manage" title="5. How to clear this storage">
        <P>
          You can delete cookies and local storage at any time in your browser settings, and you can
          remove the extension&apos;s stored captures by clearing site/extension data or by deleting
          individual captures inside the extension. Clearing strictly necessary storage may reset
          preferences but will not break the site.
        </P>
      </LegalSection>

      <LegalSection id="more" title="6. Further information">
        <P>
          If we introduce any non-essential cookies in the future, we will update this policy and
          request your consent beforehand where the law requires it.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
