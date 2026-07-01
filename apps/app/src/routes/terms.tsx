import { createFileRoute } from '@tanstack/react-router';

import { A, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';

export const Route = createFileRoute('/terms')({
  head: () => ({ meta: [{ title: 'Terms · Wusel Capture' }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="[PLACEHOLDER: date]">
      <LegalSection id="scope" title="1. Scope and acceptance">
        <P>
          These Terms of Use govern your use of this website and of Wusel Capture (the &quot;browser
          extension&quot;, the &quot;skill&quot;, and the optional &quot;native host&quot;, together
          the &quot;Software&quot;), provided by [PLACEHOLDER: legal/company name] (&quot;we&quot;,
          &quot;us&quot;). By using the website or the Software, you agree to these terms. If you do
          not agree, please do not use them.
        </P>
      </LegalSection>

      <LegalSection id="service" title="2. The service">
        <P>
          Wusel Capture lets you capture and annotate a web page in your browser and hand the result
          to your own AI coding assistant so it can implement the change. The Software runs on your
          device; we do not host your captures or your source code.
        </P>
      </LegalSection>

      <LegalSection id="license" title="3. License">
        <P>
          The Software is open source and licensed under the MIT License. You may use, copy, modify,
          and distribute it in accordance with that license. The full license text is included with
          the source code in the project repository — see <A href="/imprint">Imprint</A> for our
          details and the repository for the{' '}
          <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">LICENSE</code> file.
        </P>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <P>When using the website or the Software, you agree not to:</P>
        <UL>
          <li>use them in violation of applicable law or third-party rights;</li>
          <li>
            capture or process content you are not authorised to access, or that infringes the
            privacy or intellectual property rights of others;
          </li>
          <li>attempt to disrupt, overload, or gain unauthorised access to our systems.</li>
        </UL>
        <P>
          You are responsible for the pages you choose to capture and for any personal data they may
          contain.
        </P>
      </LegalSection>

      <LegalSection id="third-party" title="5. Third-party services">
        <P>
          The Software works together with third-party tools that are subject to their own terms, in
          particular the Google Chrome browser, your AI coding assistant (for example Claude Code,
          which uses Anthropic&apos;s services), Visual Studio Code, and the npm registry. We are not
          responsible for these third-party services, and your use of them is governed by their
          respective agreements.
        </P>
      </LegalSection>

      <LegalSection id="warranty" title="6. No warranty">
        <P>
          The Software is provided &quot;as is&quot;, without warranty of any kind, express or
          implied, including but not limited to the warranties of merchantability, fitness for a
          particular purpose, and non-infringement, as set out in the MIT License. We do not warrant
          that the website or Software will be uninterrupted, error-free, or secure.
        </P>
      </LegalSection>

      <LegalSection id="liability" title="7. Limitation of liability">
        <P>
          To the extent permitted by applicable law, and consistent with the MIT License, we shall
          not be liable for any claim, damages, or other liability arising from or in connection with
          the Software or its use. Mandatory statutory liability — in particular for intent, gross
          negligence, injury to life, body, or health, and under applicable product liability law —
          remains unaffected. [PLACEHOLDER: adjust this clause to your jurisdiction with legal
          advice.]
        </P>
      </LegalSection>

      <LegalSection id="changes" title="8. Changes to the service and these terms">
        <P>
          We may modify, suspend, or discontinue the website or the Software, and we may update these
          terms, at any time. The current version is always available on this page. Material changes
          take effect when published here.
        </P>
      </LegalSection>

      <LegalSection id="law" title="9. Governing law and jurisdiction">
        <P>
          These terms are governed by the laws of [PLACEHOLDER: jurisdiction, e.g. Germany], excluding
          its conflict-of-law rules and mandatory consumer protections of your country of residence.
          The place of jurisdiction is [PLACEHOLDER: city], to the extent permitted by law.
        </P>
      </LegalSection>

      <LegalSection id="contact" title="10. Contact">
        <P>
          Questions about these terms? Contact us at{' '}
          <A href="mailto:[PLACEHOLDER-EMAIL]">[PLACEHOLDER-EMAIL]</A>.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
