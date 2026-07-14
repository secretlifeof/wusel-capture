import { createFileRoute } from '@tanstack/react-router';

import { A, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';
import { site } from '@/lib/site';

export const Route = createFileRoute('/imprint')({
  head: () => ({ meta: [{ title: 'Imprint · Wusel Capture' }] }),
  component: ImprintPage,
});

function ImprintPage() {
  return (
    <LegalLayout title="Imprint">
      <LegalSection title="Who runs this project">
        <P>
          Wusel Capture is a free, non-commercial open-source project maintained by an individual.
          It is not a company, it sells nothing, it carries no advertising, and it collects no
          payments.
        </P>
        <P>
          {site.maintainer}
          <br />
          Email: <A href={`mailto:${site.contactEmail}`}>{site.contactEmail}</A>
        </P>
        <P>
          Email is the quickest way to reach us. For anything about the software itself, an issue on
          the repository is usually better:{' '}
          <A href={`${site.github}/issues`}>github.com/secretlifeof/wusel-capture/issues</A>.
        </P>
      </LegalSection>

      <LegalSection title="Licence and source code">
        <P>
          Wusel Capture — the browser extension, the skill and the optional native host — is
          published under the MIT licence. You are free to read, use, modify and redistribute it
          under that licence.
        </P>
        <UL>
          <li>
            Source code: <A href={site.github}>github.com/secretlifeof/wusel-capture</A>
          </li>
          <li>
            Licence: the{' '}
            <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">LICENSE</code> file
            in the repository
          </li>
          <li>
            Terms that apply to your use: <A href="/terms">Terms of Use</A>
          </li>
          <li>
            How your data is handled: <A href="/privacy">Privacy Policy</A>
          </li>
        </UL>
      </LegalSection>

      <LegalSection title="Liability for links">
        <P>
          These pages link to external websites over whose content we have no influence, and for
          which we therefore accept no liability. The respective provider or operator is always
          responsible for the content of a linked page. The links were checked for legal violations
          when they were added, and none were apparent. We will remove any link promptly if we
          become aware of a violation.
        </P>
      </LegalSection>

      <LegalSection title="Copyright">
        <P>
          The content of this website is subject to copyright. The Wusel Capture software itself is
          licensed permissively under the MIT licence — see the repository. Where third-party assets
          are used, their own licences apply: the Geist and Caveat typefaces are used under the SIL
          Open Font License.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
