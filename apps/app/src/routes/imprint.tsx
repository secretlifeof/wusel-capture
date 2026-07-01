import { createFileRoute } from '@tanstack/react-router';

import { A, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';

export const Route = createFileRoute('/imprint')({
  head: () => ({ meta: [{ title: 'Imprint · Wusel Capture' }] }),
  component: ImprintPage,
});

function ImprintPage() {
  return (
    <LegalLayout title="Imprint">
      <LegalSection title="Information pursuant to § 5 DDG">
        <P>
          [PLACEHOLDER: Legal/company name]
          <br />
          [PLACEHOLDER: Street and number]
          <br />
          [PLACEHOLDER: Postal code and city]
          <br />
          [PLACEHOLDER: Country]
        </P>
      </LegalSection>

      <LegalSection title="Represented by">
        <P>[PLACEHOLDER: Managing director / authorised representative]</P>
      </LegalSection>

      <LegalSection title="Contact">
        <UL>
          <li>
            Email: <A href="mailto:[PLACEHOLDER-EMAIL]">[PLACEHOLDER-EMAIL]</A>
          </li>
          <li>Phone: [PLACEHOLDER: phone number]</li>
        </UL>
      </LegalSection>

      <LegalSection title="VAT identification number">
        <P>
          VAT identification number pursuant to § 27a of the German Value Added Tax Act (UStG):
          [PLACEHOLDER: VAT ID, or remove this section if not applicable].
        </P>
      </LegalSection>

      <LegalSection title="Responsible for content pursuant to § 18 (2) MStV">
        <P>
          [PLACEHOLDER: Name]
          <br />
          [PLACEHOLDER: Address]
        </P>
      </LegalSection>

      <LegalSection title="EU online dispute resolution">
        <P>
          The European Commission provides a platform for online dispute resolution (ODR):{' '}
          <A href="https://ec.europa.eu/consumers/odr/">https://ec.europa.eu/consumers/odr/</A>. You
          can find our email address in the Contact section above. We are neither obliged nor willing
          to participate in dispute resolution proceedings before a consumer arbitration board.
        </P>
      </LegalSection>

      <LegalSection title="Liability for content">
        <P>
          As a service provider we are responsible for our own content on these pages in accordance
          with § 7 (1) DDG and general law. However, pursuant to §§ 8 to 10 DDG we are not obliged to
          monitor transmitted or stored third-party information, or to investigate circumstances that
          indicate unlawful activity. Obligations to remove or block the use of information under
          general law remain unaffected. Liability in this respect is only possible from the point in
          time at which we become aware of a specific infringement. Upon becoming aware of such
          infringements, we will remove the content concerned without undue delay.
        </P>
      </LegalSection>

      <LegalSection title="Liability for links">
        <P>
          Our website contains links to external third-party websites over whose content we have no
          influence. We therefore cannot accept any liability for this third-party content. The
          respective provider or operator of the linked pages is always responsible for their
          content. The linked pages were checked for possible legal violations at the time of
          linking; no unlawful content was discernible at that time. Permanent monitoring of the
          content of the linked pages is not reasonable without concrete evidence of an infringement.
          Upon becoming aware of legal violations, we will remove such links without undue delay.
        </P>
      </LegalSection>

      <LegalSection title="Copyright">
        <P>
          The content and works created by the site operators on these pages are subject to copyright
          law. The source code of Wusel Capture is published separately under the MIT license; see
          the <A href="/terms">Terms</A> and the project repository for details. Contributions,
          duplication, processing, distribution and any kind of use of website content beyond what
          the applicable licenses permit require the prior written consent of the respective author
          or creator.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
