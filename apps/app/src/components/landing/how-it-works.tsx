const steps = [
  {
    title: 'Install the extension',
    body: 'Add Wusel Capture to Chrome and pin it. You are ready to capture on any site.',
  },
  {
    title: 'Annotate the change',
    body: 'Screenshot the page, mark what needs to change.',
  },
  {
    title: 'Your AI ships it',
    body: 'Send to VS Code (Claude/Codex), which implements the changes.',
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-public-landing-feature-bg py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 flex items-center justify-center gap-2 text-[clamp(1rem,1.4vw,1.4rem)] font-medium tracking-wide text-lavender-500">
            <span className="inline-block size-2 rounded-full bg-lavender-500" />
            How it works
          </h2>
          <p className="section-title-gap text-[clamp(1.75rem,3.8vw,3.75rem)] leading-[1.15] font-semibold tracking-tight text-balance text-public-landing-feature-title">
            From sketch to shipped in three steps
          </p>
        </div>

        <ol className="wc-steps mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="wc-step relative flex flex-col items-center rounded-2xl border border-public-footer-divider bg-white p-7 text-center"
            >
              <span className="text-4xl font-semibold text-lavender-500 tabular-nums">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-public-landing-feature-title">
                {step.title}
              </h3>
              <p className="mt-2 leading-[1.55] text-public-landing-feature-body">{step.body}</p>
              <span className="wc-glow" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
