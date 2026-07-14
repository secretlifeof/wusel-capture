import { createFileRoute } from '@tanstack/react-router';

import { A, Callout, LegalLayout, LegalSection, P, UL } from '@/components/legal/legal-layout';
import { site } from '@/lib/site';

export const Route = createFileRoute('/privacy')({
  head: () => ({ meta: [{ title: 'Privacy Policy · Wusel Capture' }] }),
  component: PrivacyPage,
});

const LAST_UPDATED = '14 July 2026';

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated={LAST_UPDATED}>
      <Callout title="The short version">
        <P>
          Wusel Capture has no servers, no backend, no accounts, no analytics and no telemetry. Your
          screenshots and page data are processed entirely on your own machine and are never
          transmitted to us. We are incapable of receiving them.
        </P>
        <P>
          The one exception worth understanding: when <em>you</em> choose to send a capture to your
          AI coding assistant, that assistant is a separate product with its own privacy policy. See{' '}
          <A href="#assistants">section 5</A>.
        </P>
      </Callout>

      <LegalSection id="controller" title="1. Controller">
        <P>
          Wusel Capture is an open-source project maintained by an individual, not a company. The
          controller responsible for this website is:
        </P>
        <P>
          {site.maintainer}
          <br />
          Email: <A href={`mailto:${site.contactEmail}`}>{site.contactEmail}</A>
        </P>
        <P>
          The full source code is published under the MIT licence at{' '}
          <A href={site.github}>github.com/secretlifeof/wusel-capture</A>. Every claim in this
          policy can be checked against it.
        </P>
      </LegalSection>

      <LegalSection id="website" title="2. This website">
        <P>
          This site is a static set of pages. It sets no cookies, runs no analytics, embeds no
          trackers, and loads no third-party scripts. Our fonts are served from this site rather
          than from a font CDN, specifically so that no third party learns your IP address when you
          read this page. There is nothing to consent to, which is why you see no cookie banner. See
          the <A href="/cookies">Cookie Policy</A>.
        </P>
        <P>
          The site is hosted on GitHub Pages by GitHub, Inc. (a Microsoft company). Like any web
          host, GitHub processes technical connection data — including your IP address, the page
          requested, and your browser's user agent — in order to serve the page to you and to keep
          the service secure. We have no access to those logs and receive no reports from them. This
          processing rests on Art. 6 (1) (f) GDPR (our legitimate interest in operating a
          functioning website). GitHub is a US provider; transfers are covered by the EU Standard
          Contractual Clauses and the EU–US Data Privacy Framework. See{' '}
          <A href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement">
            GitHub&apos;s privacy statement
          </A>
          .
        </P>
      </LegalSection>

      <LegalSection id="extension-data" title="3. What the browser extension handles">
        <P>
          The extension does nothing until you click its toolbar icon and take a capture. When you
          do, it assembles a capture on your device from the following:
        </P>
        <UL>
          <li>
            <strong>A screenshot</strong> of the page — the visible viewport, the full page, or a
            region you draw. Images only: no video, no audio, no camera or microphone access.
          </li>
          <li>
            <strong>Page context</strong> — the page URL and title, your browser&apos;s user agent,
            viewport size, device pixel ratio, scroll position, screen size, browser name and
            version, platform and language.
          </li>
          <li>
            <strong>Diagnostics</strong> — a rolling in-memory buffer of the most recent console
            errors and warnings, and of <em>failed</em> network requests, so your assistant can see
            what went wrong. For a failed request we record only the URL, method, status and
            timestamp. We never record request or response bodies, HTTP headers, cookies, or the
            contents of page storage.
          </li>
          <li>
            <strong>Your own input</strong> — the note you type and the annotations you draw.
          </li>
        </UL>
        <P>
          The extension does not log keystrokes, clicks or mouse movement; does not read your
          browsing history, bookmarks, cookies or passwords; does not read the page&apos;s text or
          form values; and does not track you across sites. It observes only the page you explicitly
          capture.
        </P>
        <P>
          Because this processing happens on your device and the result is delivered only to tools
          you control, we are not the controller for the contents of your captures. You are
          responsible for any personal data contained in pages you choose to capture.
        </P>
      </LegalSection>

      <LegalSection id="where" title="4. Where a capture goes">
        <P>
          Nowhere near us. A finished capture takes one of two local paths, and you choose which:
        </P>
        <UL>
          <li>
            <strong>Download (default).</strong> The annotated image is saved to your own disk
            through the browser&apos;s normal &quot;Save file&quot; dialog. Your editor is then
            opened via a{' '}
            <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">vscode://</code> or{' '}
            <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">codex://</code> link
            pointing at that local file.
          </li>
          <li>
            <strong>Native host (optional).</strong> If you deliberately install our companion host,
            the capture is written straight into the matching project folder on your disk and your
            locally installed editor is opened on it. The host is open source, runs entirely on your
            machine, and makes no network connections.
          </li>
        </UL>
      </LegalSection>

      <LegalSection id="assistants" title="5. Your AI assistant is a third party">
        <Callout>
          <P>
            Please read this section carefully — it is the only way capture data can leave your
            machine.
          </P>
          <P>
            The whole point of Wusel Capture is to hand your annotated screenshot to an AI coding
            assistant such as <strong>Claude Code</strong> (Anthropic) or <strong>Codex</strong>{' '}
            (OpenAI). Those are separate products, installed by you, running under your own account.
            When you send a capture, that assistant transmits the image and your note to its
            vendor&apos;s servers in order to answer you.
          </P>
          <P>
            That transmission is between you and your assistant&apos;s vendor, under <em>their</em>{' '}
            privacy policy and terms — not ours. We are not a party to it and never see the data. If
            a capture contains something sensitive, it will reach that vendor just like anything
            else you paste into your assistant. Use the built-in <strong>Redact</strong> tool (
            <A href="#redaction">section 7</A>) before you send.
          </P>
        </Callout>
      </LegalSection>

      <LegalSection id="storage" title="6. Storage and retention">
        <UL>
          <li>
            <strong>IndexedDB (in your browser).</strong> Pending captures are held locally, purely
            to hand a capture from the popup to the editor tab — a full-page screenshot is far too
            large for extension storage. Automatically pruned to the 10 most recent captures.
          </li>
          <li>
            <strong>Extension storage.</strong> Exactly two UI preferences: which assistant you
            picked, and an optional Claude Code session id you may type in. No images, no page
            content, no URLs.
          </li>
          <li>
            <strong>Your disk.</strong> Captures you chose to save or send. They are yours; delete
            them whenever you like.
          </li>
        </UL>
        <P>
          Uninstalling the extension removes everything it stored in your browser. Files you already
          saved to disk remain, because they belong to you.
        </P>
      </LegalSection>

      <LegalSection id="redaction" title="7. Redaction">
        <P>Two protections are built in, and both apply before a capture is exported or sent:</P>
        <UL>
          <li>
            <strong>The Redact tool</strong> pixelates any region of the image you mark. The
            pixelation is baked into the exported bitmap, so the original pixels cannot be recovered
            from the file that leaves the editor.
          </li>
          <li>
            <strong>Automatic URL redaction.</strong> Query parameters in captured request URLs
            whose names look credential-like — token, secret, password, authorization, cookie,
            session, jwt, api_key, access — have their values replaced with{' '}
            <code className="rounded bg-bark-900/5 px-1 font-mono text-[0.9em]">[REDACTED]</code>.
          </li>
        </UL>
        <P>
          These are safety nets, not guarantees. A screenshot shows whatever was on your screen —
          review it before you send it.
        </P>
      </LegalSection>

      <LegalSection id="cli" title="8. The skill, the CLI and the native host">
        <P>
          The Wusel Capture skill and the optional native messaging host run on your own machine.
          The host writes a capture into a local project folder you configure and opens it in your
          editor. These components transmit no captures, source code or configuration to us, and
          make no network connections of their own.
        </P>
      </LegalSection>

      <LegalSection id="rights" title="9. Your rights">
        <P>
          Under the GDPR you have the rights of access (Art. 15), rectification (Art. 16), erasure
          (Art. 17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21), and
          the right to withdraw consent at any time (Art. 7 (3)).
        </P>
        <P>
          In practice we hold nothing to which those rights could attach: your captures never reach
          us, and we operate no database, no accounts and no logs of our own. You exercise complete
          control by deleting your saved captures or uninstalling the extension. If you would like
          to ask us anything about this, write to{' '}
          <A href={`mailto:${site.contactEmail}`}>{site.contactEmail}</A>.
        </P>
        <P>
          You also have the right to lodge a complaint with a data protection supervisory authority —
          in particular the one where you live, where you work, or where you believe the issue
          occurred.
        </P>
      </LegalSection>

      <LegalSection id="children" title="10. Children">
        <P>
          Wusel Capture is a developer tool and is not directed at children. It collects no data
          from anyone, of any age.
        </P>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to this policy">
        <P>
          If the extension&apos;s behaviour ever changes in a way that affects your privacy, this
          policy will be updated before that version ships and the date at the top of this page will
          change. The full revision history is public in the Git repository.
        </P>
      </LegalSection>
    </LegalLayout>
  );
}
