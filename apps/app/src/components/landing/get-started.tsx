import { CtaButton } from '@wusel-capture/ui';
import { Download } from '@wusel-capture/icons';

import { CommandBlock } from '@/components/landing/command-block';
import { site } from '@/lib/site';

export function GetStarted() {
  return (
    <section
      id="get-started"
      className="bg-lavender-600 px-6 py-24 text-white md:px-10 lg:px-12 lg:py-32"
    >
      <div className="mx-auto w-full max-w-3xl text-center">
        <h2 className="section-title-gap text-[clamp(2.2rem,5.5vw,5rem)] leading-[1.1] font-medium tracking-tight">
          Get started
        </h2>
        <p className="section-title-gap mx-auto max-w-xl text-[clamp(1rem,1.7vw,1.5rem)] leading-[1.5] text-white/80">
          Two installs and you are live: the Chrome extension to capture, and the skill so your AI
          can implement.
        </p>

        <div className="mx-auto max-w-xl text-left">
          <CommandBlock label="Install skill" command={site.skillCommand} />
        </div>

        <div className="mt-10">
          <CtaButton
            asChild
            className="bg-white text-lavender-700 hover:bg-white hover:text-lavender-800"
          >
            <a href={site.extensionDownload} target="_blank" rel="noreferrer">
              <Download /> Download Chrome extension
            </a>
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
