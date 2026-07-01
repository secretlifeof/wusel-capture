import { SidePanel, Toolbar, type CapturePayload } from '@wusel-capture/extension/editor';
import { CtaButton } from '@wusel-capture/ui';
import { ArrowRight, Download } from '@wusel-capture/icons';
import { useEffect, useRef, useState } from 'react';

import { site } from '@/lib/site';

const ROTATOR_WORDS = ['Refine', 'Redesign', 'Change'] as const;
const TYPE_MS = 80; // per character
const HOLD_MS = 1600; // pause on the finished word
const BLUR_MS = 450; // blur-out duration before the next word

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-public-landing-hero-bg">
      {/* Soft glow behind the headline */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-48 flex justify-center">
        <div className="size-[42rem] rounded-full bg-lavender-300/40 blur-[150px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 pt-[max(9vw,7rem)] pb-[max(8vw,3rem)] md:px-10">
        <div className="flex flex-col items-center text-center">
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-lavender-400/40 bg-white/60 px-4 py-1.5 text-sm font-medium text-lavender-700 backdrop-blur">
            <span className="size-1.5 rounded-full bg-lavender-500" />
            Browser → AI, in one step
          </span> */}

          <h1 className="section-title-gap mt-[3vw] text-[clamp(2.2rem,min(5.5vw,7.5vh),5rem)] leading-[1.1] font-medium tracking-tight text-public-landing-hero-subtitle">
            <WordRotator /> in the browser.
            <br className="hidden sm:block" /> Ship with your LLM.
          </h1>

          <p className="section-title-gap max-w-2xl text-[clamp(1rem,min(1.7vw,2.4vh),1.5rem)] leading-[1.5] tracking-[0.01em] text-public-landing-hero-subtitle">
            Wusel Capture lets you mark up any web page, then let Claude/Codex implement your changes. All open source and free.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaButton asChild>
              <a href={site.extensionDownload} target="_blank" rel="noreferrer">
                <Download /> Download extension
              </a>
            </CtaButton>
            <CtaButton asChild variant="outline">
              <a href="#get-started">
                Install skill <ArrowRight />
              </a>
            </CtaButton>
          </div>
        </div>

        <BrowserMock />
      </div>
    </section>
  );
}

/** Renders a word as one span per character. When `animate`, each character
 *  fades in on a stagger (the typing effect). Non-animated is used both for the
 *  reduced-motion fallback and the off-screen width measurement, so the measured
 *  width matches the animated word exactly (same per-character layout). */
function CharSpans({ word, animate }: { word: string; animate: boolean }) {
  return word.split('').map((char, i) => (
    // eslint-disable-next-line react/no-array-index-key -- fixed word, stable order
    <span key={i} className={animate ? 'wc-char' : undefined} style={animate ? { animationDelay: `${i * TYPE_MS}ms` } : undefined}>
      {char}
    </span>
  ));
}

/** Cycles the leading headline word (Refine → Redesign → Change): each word
 *  types in one character at a time, holds, then blurs out before the next.
 *  An invisible sizer holds the measured width of the current word and
 *  transitions between words, so "in the browser." glides to its new spot on
 *  each swap; the animated word is clipped to that slot so it never overlaps
 *  the following text. A React state machine drives the timing (see app.css). */
function WordRotator() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'holding' | 'leaving'>('typing');
  const [reduced, setReduced] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Respect prefers-reduced-motion: show a static "Refine", run no timers.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Measure each word's rendered width so the slot can glide between them.
  // Re-measures on resize (the title font-size is a responsive clamp()) and once
  // the web font (Geist) has loaded — otherwise widths are measured against the
  // fallback font and the slot clips the word. Round up so it can't undershoot.
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      const el = measureRef.current;
      if (cancelled || !el) return;
      setWidths(Array.from(el.children).map((child) => Math.ceil(child.getBoundingClientRect().width)));
    };
    measure();
    window.addEventListener('resize', measure);
    void document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const word = ROTATOR_WORDS[index];
    let t: number;
    if (phase === 'typing') {
      t = window.setTimeout(() => setPhase('holding'), word.length * TYPE_MS + 120);
    } else if (phase === 'holding') {
      t = window.setTimeout(() => setPhase('leaving'), HOLD_MS);
    } else {
      t = window.setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATOR_WORDS.length);
        setPhase('typing');
      }, BLUR_MS);
    }
    return () => window.clearTimeout(t);
  }, [index, phase, reduced]);

  const active = reduced ? 0 : index;
  const current = ROTATOR_WORDS[active];
  const slotWidth = widths[active];

  return (
    <span className="relative inline-block align-baseline text-lavender-500">
      {/* sr-only keeps the headline readable for AT / SEO */}
      <span className="sr-only">{ROTATOR_WORDS[0]}</span>

      {/* Off-flow measuring layer: sizes each word (per-character, to match). */}
      <span ref={measureRef} aria-hidden className="invisible absolute whitespace-nowrap">
        {ROTATOR_WORDS.map((word) => (
          <span key={word} className="inline-block">
            <CharSpans word={word} animate={false} />
          </span>
        ))}
      </span>

      {/* Invisible in-flow sizer drives the slot width (and the baseline). */}
      <span aria-hidden className="wc-slot invisible inline-block" style={slotWidth ? { width: `${slotWidth}px` } : undefined}>
        {current}
      </span>

      {/* Animating word. Clipped to the slot only while typing (so a growing
          word can't spill past the gliding text); overflow is visible while it
          blurs out, so the blur isn't hard-cut into a box. */}
      <span aria-hidden data-phase={reduced ? 'static' : phase} className="wc-clip absolute inset-0">
        <span key={index} data-phase={reduced ? 'static' : phase} className="wc-word">
          <CharSpans word={current} animate={!reduced} />
        </span>
      </span>
    </span>
  );
}

/** Decorative browser window whose content is a faithful, scaled-down replica of the
 *  real Wusel Capture editor — the product itself, shown in miniature. */
function BrowserMock() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-4xl md:mt-20">
      <div className="overflow-hidden rounded-2xl border border-bark-900/10 bg-white shadow-[0_40px_80px_-30px_rgba(40,30,60,0.45)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-bark-900/10 bg-sand-50 px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-full border border-bark-900/10 bg-white px-3 text-xs text-public-text-muted">
            wusel.app
          </div>
        </div>

        <EditorMock />
      </div>
    </div>
  );
}

// The real editor is a full desktop app; render it at this fixed base size and scale
// it down to the mock's width so text + controls shrink proportionally (exact miniature).
const EDITOR_W = 1280;
const EDITOR_H = 800;

const noop = () => {};

// Static stand-in for the capture the editor normally reads from IndexedDB.
const DEMO_PAYLOAD: CapturePayload = {
  id: 'demo',
  capturedAt: '2026-07-01T10:24:27.000Z',
  captureMode: 'fullpage',
  imageDataUrl: '/hero-demo.png',
  imageWidth: 2692,
  imageHeight: 2170,
  page: {
    url: 'https://wusel.app',
    title: 'Wusel — You care for children, we care for you',
    userAgent: 'Mozilla/5.0',
    viewport: { width: 1440, height: 900 },
    devicePixelRatio: 2,
    scroll: { x: 0, y: 0 },
    browser: {
      name: 'Chrome',
      version: '120.0',
      platform: 'macOS',
      language: 'en-US',
      screen: { width: 2560, height: 1440 },
      mobile: false,
      touchPoints: 0,
    },
  },
  diagnostics: { consoleErrors: [], failedRequests: [] },
};

/** Reuses the real editor's `Toolbar` + `SidePanel` (composed exactly like `editor.tsx`)
 *  around a lightweight canvas replica (screenshot + an animated black-box annotation),
 *  then scales the whole 1280×800 editor down to the mock's width via `transform: scale`.
 *  A `ResizeObserver` keeps the scale in sync on resize. Decorative + non-interactive
 *  (`aria-hidden`, `pointer-events-none`), mounted client-side only. */
function EditorMock() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(896 / EDITOR_W); // max-w-4xl ≈ first paint
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / EDITOR_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={viewportRef} aria-hidden className="relative aspect-1280/800 w-full overflow-hidden bg-sand-100">
      {mounted ? (
        <div
          className="pointer-events-none absolute left-0 top-0 origin-top-left"
          style={{ width: EDITOR_W, height: EDITOR_H, transform: `scale(${scale})` }}
        >
          {/* mirrors editor.tsx: canvas (flex, floating toolbar) | side panel (340px) */}
          <div className="flex h-full">
            <div className="relative flex min-w-0 flex-1 flex-col">
              <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
                <div className="pointer-events-auto">
                  <Toolbar
                    tool="rect"
                    color="#1a1a1a"
                    canUndo
                    canRedo={false}
                    hasSelection={false}
                    onToolChange={noop}
                    onColorChange={noop}
                    onUndo={noop}
                    onRedo={noop}
                    onDelete={noop}
                  />
                </div>
              </div>
              {/* Canvas workspace — mirrors editor.tsx canvas styling. The screenshot
                  fits the canvas area (863×696 within the 1280×800 base); a black
                  annotation box + the animated hand-written note sit on top of it. */}
              <div className="flex flex-1 items-start justify-center overflow-hidden bg-sand-100 px-6 pb-6 pt-20">
                <div className="relative h-[696px] w-[863px] shrink-0 select-none overflow-hidden rounded-sm shadow-sm">
                  <img
                    src="/hero-demo.png"
                    alt="Screenshot of wusel.app being marked up"
                    className="block h-full w-full rounded-sm"
                    draggable={false}
                  />
                  <AnnotationOverlay />
                </div>
              </div>
            </div>
            <SidePanel
              payload={DEMO_PAYLOAD}
              note="Change the headline font colour to lavender."
              onNoteChange={noop}
              onDownload={noop}
              downloading={false}
              onSend={noop}
              sending={false}
              sendStatus={null}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const NOTE_LEN = 403; // measured "Change font color to lavender" width, viewBox units (Caveat 40)
const NOTE_X = 298; // note baseline start — centres its 403-wide run in the box (centre 499)
const NOTE_Y = 341; // baseline — sits inside the box (box spans y 261–394), centred vertically
const NOTE_CLIP_W = NOTE_LEN + 12; // clip a touch wider so the ink is fully covered

/** The drawn markup on the canvas: a static black box around the screenshot's headline
 *  (like a real rectangle annotation) with the note "Change font color to lavender"
 *  hand-written inside it — a Caveat <text> revealed left→right by a clip rect whose
 *  width grows (SMIL, since CSS geometry can't animate a <rect> inside <clipPath>). The
 *  clip width is a constant so SMIL never re-initialises. Coordinates live in a 1000×806
 *  viewBox (matches the screenshot aspect) so they track the stage. Decorative
 *  (aria-hidden); prefers-reduced-motion shows the finished note with no animation. */
function AnnotationOverlay() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 806"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <clipPath id="wc-anno-reveal" clipPathUnits="userSpaceOnUse">
          <rect x={NOTE_X - 6} y={NOTE_Y - 38} width={reduced ? NOTE_CLIP_W : 0} height="54">
            {!reduced && (
              <animate
                attributeName="width"
                dur="9s"
                repeatCount="indefinite"
                calcMode="linear"
                keyTimes="0;0.18;0.52;1"
                values={`0;0;${NOTE_CLIP_W};${NOTE_CLIP_W}`}
              />
            )}
          </rect>
        </clipPath>
      </defs>

      {/* black annotation box hugging the headline (static — the drawn rectangle) */}
      <rect className="wc-anno-box" x="232" y="261" width="534" height="133" />

      {/* hand-written note, revealed left→right via the clip above, inside the box */}
      <text className="wc-anno-write" x={NOTE_X} y={NOTE_Y} clipPath="url(#wc-anno-reveal)">
        Change font color to lavender
      </text>
    </svg>
  );
}
