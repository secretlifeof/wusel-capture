import { Heading } from '@wusel-capture/ui';
import type { ReactNode } from 'react';

import { Footer } from '@/components/landing/footer';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { SiteHeader } from '@/components/landing/site-header';

// Page chrome for the legal pages — mirrors the reference design (landing nav,
// on-brand header, prose body, footer), minus the multi-jurisdiction selector.

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="landing-page relative">
      <SiteHeader />
      <main>
        <section className="bg-public-hero-bg px-6 pt-32 pb-12 md:px-10 md:pt-40 md:pb-14 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <Heading as="h1" size="lg" className="text-public-text-heading">
              {title}
            </Heading>
            {updated ? (
              <p className="mt-4 text-sm text-public-text-muted">Last updated: {updated}</p>
            ) : null}
          </div>
        </section>
        <section className="bg-public-bg-page px-6 py-16 md:px-10 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-10">{children}</div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Prose primitives — same typography as the reference LegalDocumentRenderer.
// -----------------------------------------------------------------------------

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-3">
      <Heading as="h2" size="sm" className="text-public-text-heading">
        {title}
      </Heading>
      {children}
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-public-text-body">{children}</p>;
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-base font-semibold text-public-text-heading">{children}</h3>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc space-y-1.5 ps-5 leading-relaxed text-public-text-body">{children}</ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal space-y-1.5 ps-5 leading-relaxed text-public-text-body">
      {children}
    </ol>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http') || href.startsWith('mailto');
  // Root-absolute in-app hrefs like "/privacy" need the base prefix, because
  // GitHub Pages serves the site under /wusel-capture/ rather than at the root.
  // Same-page anchors ("#rights") and external links are left alone.
  const internalPath = !external && href.startsWith('/');
  const to = internalPath
    ? `${import.meta.env.BASE_URL}${href.slice(1)}`.replace(/\/{2,}/g, '/')
    : href;
  return (
    <a
      href={to}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="text-public-text-link underline underline-offset-2 transition-colors hover:text-public-text-link-hover"
    >
      {children}
    </a>
  );
}

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg bg-public-bg-section-alt p-5">
      {title ? <div className="font-semibold text-public-text-heading">{title}</div> : null}
      {children}
    </div>
  );
}
