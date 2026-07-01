import { createFileRoute } from '@tanstack/react-router';

import { A, Callout, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';

export const Route = createFileRoute('/privacy')({
  head: () => ({ meta: [{ title: 'Privacy Policy · Wusel Capture' }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="[PLACEHOLDER: date]">
      <Callout title="The essentials at a glance">
        <P>
          Wusel Capture is a browser extension and a small library that help you mark up a web page
          and hand the result to your own AI coding assistant. Captures (screenshots and your notes)
          are created and processed locally in your browser and are delivered only to your own tools
          — they are <strong>not</strong> transmitted to or stored on our servers.
        </P>
        <P>
          This website is a simple, static marketing and download page. We aim to collect as little
          personal data as possible.
        </P>
      </Callout>

      <LegalSection id="controller" title="1. Controller">
        <P>The controller responsible for data processing on this website is:</P>
        <P>
          [PLACEHOLDER: Legal/company name]
          <br />
          [PLACEHOLDER: Address]
          <br />
          Email: <A href="mailto:[PLACEHOLDER-EMAIL]">[PLACEHOLDER-EMAIL]</A>
        </P>
      </LegalSection>

      <LegalSection id="contact" title="2. Data protection contact">
        <P>
          For any questions about data protection you can reach us at{' '}
          <A href="mailto:[PLACEHOLDER-EMAIL]">[PLACEHOLDER-EMAIL]</A>. [PLACEHOLDER: insert the name
          and contact details of your data protection officer here if you are required to appoint
          one under Art. 37 GDPR.]
        </P>
      </LegalSection>

      <LegalSection id="legal-bases" title="3. General information and legal bases">
        <P>
          We process personal data only where a legal basis applies. Depending on the case, the
          relevant bases under Art. 6 (1) of the General Data Protection Regulation (GDPR) are:
        </P>
        <UL>
          <li>
            <strong>Art. 6 (1) (a) GDPR</strong> — your consent;
          </li>
          <li>
            <strong>Art. 6 (1) (b) GDPR</strong> — performance of a contract or pre-contractual
            measures;
          </li>
          <li>
            <strong>Art. 6 (1) (c) GDPR</strong> — compliance with a legal obligation;
          </li>
          <li>
            <strong>Art. 6 (1) (f) GDPR</strong> — our legitimate interests (e.g. operating a secure,
            functional website), provided your interests do not override them.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="server-logs" title="4. Visiting the website and server log files">
        <P>
          When you visit this website, our hosting provider automatically collects and stores
          information in server log files that your browser transmits. This may include: the
          requested page or file, browser type and version, operating system, referrer URL, the
          abbreviated/anonymised IP address, and the time of the request. This data is not merged
          with other data sources and is processed on the basis of Art. 6 (1) (f) GDPR for the
          purpose of delivering the site securely and reliably.
        </P>
      </LegalSection>

      <LegalSection id="hosting" title="5. Hosting">
        <P>
          This website is hosted by [PLACEHOLDER: hosting provider name and address]. The provider
          processes the data described above on our behalf as a processor under a data processing
          agreement pursuant to Art. 28 GDPR. [PLACEHOLDER: state the hosting region, e.g. an EU data
          centre.]
        </P>
      </LegalSection>

      <LegalSection id="analytics" title="6. Analytics and tracking">
        <P>
          [PLACEHOLDER: We do not use any tracking or analytics on this site. If you add analytics
          later, describe the tool, what it collects, the legal basis, and — where consent is
          required — how it is obtained here.]
        </P>
      </LegalSection>

      <LegalSection id="cookies" title="7. Cookies and local storage">
        <P>
          This website does not set tracking or marketing cookies. Any storage we use is strictly
          necessary to provide the site (for example, remembering a display preference) and is stored
          locally in your browser. For details, see our <A href="/cookies">Cookie Policy</A>.
        </P>
      </LegalSection>

      <LegalSection id="extension" title="8. The Wusel Capture browser extension">
        <P>
          The browser extension runs entirely on your device. It is designed so that your captures
          stay with you:
        </P>
        <UL>
          <li>
            <strong>Local processing.</strong> Screenshots and the notes you add are created and
            edited in your browser. The annotated image and a JSON description of your capture are
            sent to your own local Claude Code / VS Code instance, or downloaded to your computer —
            they are not sent to us.
          </li>
          <li>
            <strong>Browser permissions.</strong> The extension requests the permissions it needs to
            capture and deliver a page (for example: taking screenshots of the active tab, reading
            the page you choose to capture, and downloads). It does not collect your browsing
            history.
          </li>
          <li>
            <strong>Page context.</strong> To help your AI reproduce an issue, the extension may
            include limited technical context such as the page URL, console errors, and failed
            network requests. It does not capture cookies, authorization headers, or request bodies,
            and token-like query parameters are redacted.
          </li>
          <li>
            <strong>Redaction.</strong> A redaction tool lets you pixelate sensitive regions before
            you export or send a capture.
          </li>
          <li>
            <strong>Local storage.</strong> Captures are held in your browser&apos;s IndexedDB on your
            device until you delete them or clear your browser data.
          </li>
        </UL>
        <P>
          Because this processing happens locally and the data is delivered only to tools you
          control, we are not the controller for the content of your captures. You are responsible
          for any personal data contained in pages you choose to capture.
        </P>
      </LegalSection>

      <LegalSection id="cli" title="9. The skill, the npm CLI and the native host">
        <P>
          The Wusel Capture skill and the optional native messaging host run on your own machine. The
          host writes a capture into a local project folder you configure and opens it in your editor.
          These components do not transmit your captures, source code, or configuration to us.
        </P>
      </LegalSection>

      <LegalSection id="ai" title="10. AI processing through your own tools">
        <P>
          Wusel Capture hands your capture to the AI coding assistant you have installed (for example
          Claude Code, which uses Anthropic&apos;s models). When you choose to send a capture, that
          assistant processes the image and notes under <em>your</em> agreement with the respective
          provider. Please review that provider&apos;s privacy terms. We do not control and are not
          responsible for their processing.
        </P>
      </LegalSection>

      <LegalSection id="recipients" title="11. Recipients and processors">
        <P>
          For the operation of this website we use the processor(s) listed below, each engaged under
          a data processing agreement pursuant to Art. 28 GDPR:
        </P>
        <UL>
          <li>[PLACEHOLDER: hosting provider — purpose: website hosting — location].</li>
          <li>[PLACEHOLDER: any further processors, e.g. email or CDN provider.]</li>
        </UL>
      </LegalSection>

      <LegalSection id="third-countries" title="12. Transfers to third countries">
        <P>
          We aim to process data within the EU/EEA. Where a processor transfers data to a third
          country, this is safeguarded by an adequacy decision or the EU Standard Contractual Clauses
          pursuant to Art. 46 GDPR. [PLACEHOLDER: list any third-country transfers and safeguards.]
        </P>
      </LegalSection>

      <LegalSection id="retention" title="13. Storage period">
        <P>
          We store personal data only for as long as necessary for the purposes described or as
          required by statutory retention periods. Server log files are deleted or anonymised after a
          short period. [PLACEHOLDER: state your concrete retention periods.]
        </P>
      </LegalSection>

      <LegalSection id="rights" title="14. Your rights">
        <P>Under the GDPR you have the following rights regarding your personal data:</P>
        <UL>
          <li>Right of access (Art. 15 GDPR);</li>
          <li>Right to rectification (Art. 16 GDPR);</li>
          <li>Right to erasure (Art. 17 GDPR);</li>
          <li>Right to restriction of processing (Art. 18 GDPR);</li>
          <li>Right to data portability (Art. 20 GDPR);</li>
          <li>Right to object to processing (Art. 21 GDPR);</li>
          <li>Right to withdraw consent at any time with effect for the future (Art. 7 (3) GDPR).</li>
        </UL>
        <P>
          To exercise any of these rights, contact us at{' '}
          <A href="mailto:[PLACEHOLDER-EMAIL]">[PLACEHOLDER-EMAIL]</A>.
        </P>
      </LegalSection>

      <LegalSection id="complaint" title="15. Right to lodge a complaint">
        <P>
          You have the right to lodge a complaint with a data protection supervisory authority,
          in particular in the EU member state of your habitual residence, place of work, or the
          place of the alleged infringement. [PLACEHOLDER: name and contact details of your competent
          supervisory authority.]
        </P>
      </LegalSection>

      <LegalSection id="changes" title="16. Changes to this Privacy Policy">
        <P>
          We may update this Privacy Policy to reflect changes to our service or legal requirements.
          The current version is always available on this page.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
