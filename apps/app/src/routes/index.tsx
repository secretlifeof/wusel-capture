import { createFileRoute } from '@tanstack/react-router';

import { Features } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { GetStarted } from '@/components/landing/get-started';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ScrollToTop } from '@/components/landing/scroll-to-top';
import { SiteHeader } from '@/components/landing/site-header';
import { TheSkill } from '@/components/landing/the-skill';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="landing-page relative">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <TheSkill />
        <GetStarted />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
