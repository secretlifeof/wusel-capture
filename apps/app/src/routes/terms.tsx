import { createFileRoute } from '@tanstack/react-router';

import { A, Callout, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';
import { site } from '@/lib/site';

export const Route = createFileRoute('/terms')({
  head: () => ({ meta: [{ title: 'Terms · Wusel Capture' }] }),
  component: TermsPage,
});

const LAST_UPDATED = '14 July 2026';

function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated={LAST_UPDATED}>
      <Callout title="The short version">
        <P>
          Wusel Capture is free, open-source software under the MIT licence. There is no account, no
          payment and no service we operate on your behalf — everything runs on your machine. The
          MIT licence governs the software; these terms simply describe what that means in practice.
        </P>
      </Callout>

      <LegalSection id="scope" title="1. Scope">
        <P>
          These terms cover this website and Wusel Capture itself — the browser extension, the skill
          and the optional native host (together, the &quot;Software&quot;), maintained by{' '}
          {site.maintainer}. By using them, you accept these terms. If you do not, please do not use
          them.
        </P>
      </LegalSection>

      <LegalSection id="service" title="2. What the Software does">
        <P>
          Wusel Capture lets you capture and annotate a web page in your browser and hand the result
          to your own AI coding assistant so it can implement the change. The Software runs on your
          device. We do not host your captures or your source code, and we operate no server that
          takes part in this.
        </P>
      </LegalSection>

      <LegalSection id="license" title="3. Licence">
        <P>
          The Software is open source and licensed under the MIT License. You may use, copy, modify
          and distribute it in accordance with that licence, including commercially. The full text
          is in the{' '}
          <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">LICENSE</code> file at{' '}
          <A href={site.github}>github.com/secretlifeof/wusel-capture</A>.
        </P>
      </LegalSection>

      <LegalSection id="acceptable-use" title="4. Acceptable use">
        <P>When using the website or the Software, you agree not to:</P>
        <UL>
          <li>use them in violation of applicable law or the rights of others;</li>
          <li>
            capture or process content you are not authorised to access, or that infringes the
            privacy or intellectual property rights of others;
          </li>
          <li>attempt to disrupt or gain unauthorised access to the site.</li>
        </UL>
        <P>
          You are responsible for the pages you choose to capture and for any personal data they
          contain. See the <A href="/privacy">Privacy Policy</A>.
        </P>
      </LegalSection>

      <LegalSection id="third-party" title="5. Third-party services">
        <P>
          The Software works alongside third-party tools that have their own terms — in particular
          your browser, your AI coding assistant (for example Claude Code, which uses
          Anthropic&apos;s services, or Codex, which uses OpenAI&apos;s), Visual Studio Code, and
          the npm registry. We do not control those services and are not responsible for them. When
          you send a capture to your assistant, that vendor&apos;s terms and privacy policy apply to
          what happens next.
        </P>
      </LegalSection>

      <LegalSection id="warranty" title="6. No warranty">
        <P>
          The Software is provided &quot;as is&quot;, without warranty of any kind, express or
          implied, including the warranties of merchantability, fitness for a particular purpose and
          non-infringement, as set out in the MIT License. We do not warrant that it will be
          uninterrupted, error-free or secure.
        </P>
      </LegalSection>

      <LegalSection id="liability" title="7. Limitation of liability">
        <P>
          To the extent permitted by law, and consistent with the MIT License, we are not liable for
          any claim, damages or other liability arising from the Software or its use. Mandatory
          statutory liability — in particular for intent, gross negligence, injury to life, body or
          health, and under applicable product liability law — remains unaffected.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="8. Changes">
        <P>
          We may modify or discontinue the website or the Software, and we may update these terms,
          at any time. The current version is always on this page, and its history is public in the
          Git repository. The MIT licence already granted for a given release cannot be revoked.
        </P>
      </LegalSection>

      <LegalSection id="contact" title="9. Contact">
        <P>
          Questions about these terms? Write to{' '}
          <A href={`mailto:${site.contactEmail}`}>{site.contactEmail}</A>, or see the{' '}
          <A href="/imprint">Imprint</A>.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
