import { Camera, Heart, ShieldCheck } from '@wusel-capture/icons';

const features = [
  {
    icon: ShieldCheck,
    title: 'Private by design',
    body: 'Captures are processed locally in your browser and handed to your own Claude Code. Never sent to our servers.',
  },
  {
    icon: Camera,
    title: 'Any page',
    body: 'Grab the full page, the viewport, or a region you select. Annotate with text, arrows, boxes, and redaction.',
  },
  {
    icon: Heart,
    title: 'Open source',
    body: 'MIT-licensed and transparent. Add the skill your AI uses with a single npx command.',
  },
] as const;

export function Features() {
  return (
    <section className="bg-public-landing-feature-bg-alt py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 flex items-center justify-center gap-2 text-[clamp(1rem,1.4vw,1.4rem)] font-medium tracking-wide text-lavender-500">
            <span className="inline-block size-2 rounded-full bg-lavender-500" />
            Why Wusel Capture
          </h2>
          <p className="section-title-gap text-[clamp(1.75rem,3.8vw,3.75rem)] leading-[1.15] font-semibold tracking-tight text-balance text-public-landing-feature-title">
            Built for the way you work
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-2xl border border-public-footer-divider bg-white/70 p-7 text-center backdrop-blur-sm"
            >
              <feature.icon className="size-10 text-lavender-500" />
              <h3 className="mt-5 text-lg font-semibold text-public-landing-feature-title">
                {feature.title}
              </h3>
              <p className="mt-2 text-[clamp(0.875rem,1.05vw,1rem)] leading-[1.55] text-public-landing-feature-body">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
