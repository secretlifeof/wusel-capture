import { CtaButton } from '@wusel-capture/ui';
import { ArrowRight } from '@wusel-capture/icons';

const abilities = [
  {
    title: 'Locate the page',
    body: 'From the captured URL, it finds the route and source file that renders the page you marked up.',
  },
  {
    title: 'Locate the component',
    body: 'It matches your arrows, boxes, and notes to the exact component and markup on the page.',
  },
  {
    title: 'Reuse what exists',
    body: 'It edits with your existing components, design tokens, and fonts following your patterns, not reinventing them.',
  },
] as const;

export function TheSkill() {
  return (
    <section id="skill" className="bg-public-landing-feature-bg py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 flex items-center justify-center gap-2 text-[clamp(1rem,1.4vw,1.4rem)] font-medium tracking-wide text-lavender-500">
            <span className="inline-block size-2 rounded-full bg-lavender-500" />
            The skill
          </h2>
          <p className="section-title-gap text-[clamp(1.75rem,3.8vw,3.75rem)] leading-[1.15] font-semibold tracking-tight text-balance text-public-landing-feature-title">
            Your AI changes exactly what you marked
          </p>
          <p className="mt-4 text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.55] text-public-landing-feature-body">
            The skill teaches your AI how to read a capture and implement it inside your codebase —
            following your design system instead of bolting on something new.
          </p>
        </div>

        <ol className="wc-steps mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {abilities.map((ability, i) => (
            <li
              key={ability.title}
              className="wc-step relative flex flex-col items-center rounded-2xl border border-public-footer-divider bg-white p-7 text-center"
            >
              <span className="text-4xl font-semibold text-lavender-500 tabular-nums">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-public-landing-feature-title">
                {ability.title}
              </h3>
              <p className="mt-2 leading-[1.55] text-public-landing-feature-body">{ability.body}</p>
              <span className="wc-glow" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <CtaButton asChild>
            <a href="#get-started">
              Install skill<ArrowRight />
            </a>
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
