"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);

    ctxRef.current = gsap.context(() => {}, el ?? undefined);

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;

    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
  }, deps);
}

export type JourneyItem = {
  id: string;
  stage: string;
  label: string;
  title: string;
  content: string;
  position: "top" | "bottom";
};

type SplitTextInstance = InstanceType<typeof SplitText>;

export type InvestmentProcessTimelineProps = {
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  duration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  );
}

export const topJourneyData: JourneyItem[] = [
  {
    id: "discover",
    stage: "01",
    label: "Discover",
    title: "Look beyond the obvious",
    content:
      "We search for small- and mid-cap businesses whose underlying quality or long-term opportunity may not yet be fully recognised.",
    position: "top",
  },
  {
    id: "assess",
    stage: "03",
    label: "Assess",
    title: "Know the people",
    content:
      "We evaluate management integrity, capital allocation and the ability to build an enduring institution.",
    position: "top",
  },
  {
    id: "question",
    stage: "05",
    label: "Question",
    title: "Test the thesis",
    content:
      "Before committing capital, we challenge the assumptions, risks and evidence behind the opportunity.",
    position: "top",
  },
  {
    id: "reassess",
    stage: "07",
    label: "Reassess",
    title: "Remain independent",
    content:
      "Ownership does not end the research process. We continuously review whether the original reasoning continues to hold.",
    position: "top",
  },
];

export const bottomJourneyData: JourneyItem[] = [
  {
    id: "understand",
    stage: "02",
    label: "Understand",
    title: "Study the economics",
    content:
      "We examine how the business earns, competes, reinvests capital and protects its position over time.",
    position: "bottom",
  },
  {
    id: "value",
    stage: "04",
    label: "Value",
    title: "Define what it is worth",
    content:
      "We estimate intrinsic value and invest only when the price provides sufficient room for uncertainty.",
    position: "bottom",
  },
  {
    id: "allow-time",
    stage: "06",
    label: "Allow time",
    title: "Let the business compound",
    content:
      "When the thesis remains intact, we stay patient and allow business performance—not market noise—to drive the outcome.",
    position: "bottom",
  },
];

export const allJourneyItems: JourneyItem[] = [
  topJourneyData[0], // 01 Discover
  bottomJourneyData[0], // 02 Understand
  topJourneyData[1], // 03 Assess
  bottomJourneyData[1], // 04 Value
  topJourneyData[2], // 05 Question
  bottomJourneyData[2], // 06 Allow time
  topJourneyData[3], // 07 Reassess
];

export default function InvestmentProcessTimeline({
  textColor = "#000000",
  mutedTextColor = "rgba(0, 0, 0, 0.62)",
  activeColor = "#000000",
  backgroundColor = "#ffffff",
  duration = 1.2,
}: InvestmentProcessTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const horizontalTweenRef = useRef<gsap.core.Tween | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };

  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };

  // GSAP pinned horizontal scroll effect (for desktop / non-reduced motion)
  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track || reducedMotion || isMobile) return;

      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      horizontalTweenRef.current = horizontalTween;

      // Animate central connecting progress line as scroll progresses
      const progressLine = section.querySelector(".process-progress-line");
      let progressTween: gsap.core.Tween | null = null;
      if (progressLine) {
        progressTween = gsap.fromTo(
          progressLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Refresh ScrollTrigger after layout and fonts stabilize
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);

      const onWindowResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onWindowResize, { passive: true });

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }

      return () => {
        clearTimeout(refreshTimeout);
        window.removeEventListener("resize", onWindowResize);
        progressTween?.scrollTrigger?.kill();
        progressTween?.kill();
        horizontalTween.scrollTrigger?.kill();
        horizontalTween.kill();
        horizontalTweenRef.current = null;
      };
    },
    {
      dependencies: [reducedMotion, isMobile],
      scope: sectionRef,
    }
  );

  // GSAP item reveal animations linked to container horizontal scroll
  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section || isMobile) return;

      const titleSplits: SplitTextInstance[] = [];
      const descriptionSplits: SplitTextInstance[] = [];
      const itemTriggers: ScrollTrigger[] = [];

      if (reducedMotion) {
        allJourneyItems.forEach((item) => {
          gsap.set(`.process-line-${item.id}`, { scaleY: 1 });
          gsap.set(`.process-dot-${item.id}`, { scale: 1 });
          gsap.set(`.process-title-${item.id}`, {
            opacity: 1,
            clearProps: "transform",
          });
          gsap.set(`.process-description-${item.id}`, {
            opacity: 1,
            clearProps: "transform",
          });
        });

        return;
      }

      const horizontalTween = horizontalTweenRef.current;

      allJourneyItems.forEach((item) => {
        const line = section.querySelector(`.process-line-${item.id}`);
        const dot = section.querySelector(`.process-dot-${item.id}`);
        const title = section.querySelector(`.process-title-${item.id}`);
        const description = section.querySelector(
          `.process-description-${item.id}`
        );
        const column = section.querySelector(`.process-col-${item.id}`);

        if (!line || !dot || !title || !description || !column) return;

        gsap.set(line, {
          scaleY: 0,
          transformOrigin: item.position === "top" ? "bottom center" : "top center",
        });

        gsap.set(dot, { scale: 0 });

        let titleLines: Element[] = [];
        let descriptionLines: Element[] = [];

        try {
          const titleSplit = new SplitText(title, {
            type: "lines",
            linesClass: "split-line overflow-hidden",
          });

          const descriptionSplit = new SplitText(description, {
            type: "lines",
            linesClass: "split-line overflow-hidden",
          });

          titleSplits.push(titleSplit);
          descriptionSplits.push(descriptionSplit);
          titleLines = titleSplit.lines;
          descriptionLines = descriptionSplit.lines;
        } catch (_) {
          // Graceful fallback if SplitText cannot parse DOM
          titleLines = [title];
          descriptionLines = [description];
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: column,
            containerAnimation: horizontalTween ?? undefined,
            start: "left 85%",
            end: "left 48%",
            scrub: true,
          },
        });

        timeline
          .to(dot, {
            scale: 1,
            duration: duration * 0.35,
            ease: "power2.out",
          })
          .to(
            line,
            {
              scaleY: 1,
              duration: duration * 0.35,
              ease: "power2.out",
            },
            "<"
          );

        if (titleLines.length > 0) {
          timeline.fromTo(
            titleLines,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: duration * 0.45,
              stagger: 0.04,
              ease: "power2.out",
            },
            "-=0.1"
          );
        }

        if (descriptionLines.length > 0) {
          timeline.fromTo(
            descriptionLines,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: duration * 0.45,
              stagger: 0.03,
              ease: "power2.out",
            },
            "<"
          );
        }

        if (timeline.scrollTrigger) {
          itemTriggers.push(timeline.scrollTrigger);
        }
      });

      return () => {
        itemTriggers.forEach((trigger) => trigger.kill());
        titleSplits.forEach((split) => {
          try {
            split.revert();
          } catch (_) {}
        });
        descriptionSplits.forEach((split) => {
          try {
            split.revert();
          } catch (_) {}
        });
      };
    },
    {
      dependencies: [duration, reducedMotion, isMobile],
      scope: sectionRef,
    }
  );

  // Reduced motion view OR clean mobile vertical timeline
  if (reducedMotion || isMobile) {
    return (
      <section
        ref={sectionRef}
        id="investment-process"
        className="w-full bg-white px-6 py-20 text-black md:px-12 lg:px-20"
        style={sectionStyle}
        aria-label="Investment Process Stages"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-black/60">
            An investment’s journey
          </p>

          <h2 className="mt-6 max-w-[15ch] font-serif text-[clamp(2.5rem,5.5vw,5rem)] leading-[0.94] text-black">
            From the first question to lasting conviction.
          </h2>

          <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-black/50">
            Research → Ownership
          </p>

          {/* Clean vertical sequential timeline */}
          <div className="relative mt-16 pl-6 sm:pl-10">
            {/* Continuous vertical line */}
            <div className="absolute left-2 sm:left-3 top-3 bottom-8 w-px bg-black/[0.18]" />

            <div className="space-y-12 sm:space-y-16">
              {allJourneyItems.map((item) => (
                <article
                  key={item.id}
                  className="relative group"
                >
                  {/* Dot on vertical line */}
                  <div
                    className="absolute -left-6 sm:-left-10 top-1.5 size-3 rounded-full bg-black ring-4 ring-white"
                    style={activeStyle}
                  />

                  <div className="flex flex-col gap-2">
                    <p className="font-sans text-xs uppercase tracking-[0.22em] text-black/60">
                      {item.stage} / {item.label}
                    </p>

                    <h3 className="font-serif text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight text-black">
                      {item.title}
                    </h3>

                    <p
                      className="max-w-xl font-sans text-[clamp(14px,1.2vw,16px)] leading-relaxed mt-1"
                      style={mutedTextStyle}
                    >
                      {item.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop horizontal scroll experience
  return (
    <section
      ref={sectionRef}
      id="investment-process"
      className="relative w-full overflow-hidden bg-white text-black"
      style={sectionStyle}
      aria-label="Investment Process Interactive Journey"
    >
      <div
        ref={stickyRef}
        className="flex min-h-screen w-full items-center overflow-hidden"
      >
        <div
          ref={trackRef}
          className="flex min-w-max items-center h-full pl-[5vw] pr-[6vw]"
        >
          {/* Opening Typographic Panel (No stock imagery) */}
          <div className="relative flex h-[66vh] w-[44vw] min-w-[480px] max-w-[700px] shrink-0 flex-col justify-between border-y border-black/[0.18] py-10 px-8 mr-[4vw] bg-white">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.25em] text-black/60">
                An investment’s journey
              </p>

              <h2 className="mt-8 max-w-[13ch] font-serif text-[clamp(3.2rem,5.2vw,6.2rem)] leading-[0.92] text-black">
                From the first question
                <br />
                to lasting conviction.
              </h2>
            </div>

            {/* Large translucent SS Monogram watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
              <span className="font-serif text-[26vw] leading-none text-black/[0.06]">
                SS
              </span>
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-black/[0.12] pt-4">
              <p
                className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.22em]"
                style={mutedTextStyle}
              >
                Research → Ownership
                <span aria-hidden="true" className="text-black">→</span>
              </p>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-black/40">
                01 — 07
              </span>
            </div>
          </div>

          {/* Sequential 7-Stage Horizontal Timeline */}
          <div className="relative flex h-[72vh] items-center shrink-0">
            {/* Center horizontal line guide running through all stages */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-black/[0.18]" />

            {/* Active progressive line drawn as user scrolls */}
            <div
              className="process-progress-line absolute left-0 top-1/2 -translate-y-1/2 w-full h-px origin-left"
              style={{
                backgroundColor: activeColor,
                transform: "scaleX(0)",
              }}
            />

            {/* Seven Sequential Stage Columns (Alternating Top / Bottom) */}
            {allJourneyItems.map((item) => {
              const isTop = item.position === "top";

              return (
                <div
                  key={item.id}
                  className={`process-col-${item.id} relative flex flex-col h-full w-[27vw] min-w-[340px] max-w-[440px] shrink-0 px-6`}
                >
                  {isTop ? (
                    <>
                      {/* Top text card */}
                      <article className="h-1/2 flex flex-col justify-end pb-8">
                        <p className="font-sans text-xs uppercase tracking-[0.22em] text-black/60">
                          {item.stage} / {item.label}
                        </p>

                        <h3
                          className={`process-title-${item.id} mt-3 font-serif text-[clamp(1.85rem,2.5vw,3rem)] leading-[0.98] text-black`}
                        >
                          {item.title}
                        </h3>

                        <p
                          className={`process-description-${item.id} mt-3 max-w-[340px] font-sans text-[clamp(14px,1vw,15.5px)] leading-relaxed`}
                          style={mutedTextStyle}
                        >
                          {item.content}
                        </p>
                      </article>

                      {/* Connecting stem from center line upwards */}
                      <span
                        className={`process-line-${item.id} absolute left-6 bottom-1/2 h-[56px] w-px origin-bottom`}
                        style={activeStyle}
                      />

                      {/* Dot on the central horizontal line */}
                      <span
                        className={`process-dot-${item.id} absolute left-6 top-1/2 -translate-y-1/2 size-3 rounded-full`}
                        style={activeStyle}
                      />

                      {/* Bottom placeholder for optical balance */}
                      <div className="h-1/2" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      {/* Top placeholder for optical balance */}
                      <div className="h-1/2" aria-hidden="true" />

                      {/* Dot on the central horizontal line */}
                      <span
                        className={`process-dot-${item.id} absolute left-6 top-1/2 -translate-y-1/2 size-3 rounded-full`}
                        style={activeStyle}
                      />

                      {/* Connecting stem from center line downwards */}
                      <span
                        className={`process-line-${item.id} absolute left-6 top-1/2 h-[56px] w-px origin-top`}
                        style={activeStyle}
                      />

                      {/* Bottom text card */}
                      <article className="h-1/2 flex flex-col justify-start pt-8">
                        <p className="font-sans text-xs uppercase tracking-[0.22em] text-black/60">
                          {item.stage} / {item.label}
                        </p>

                        <h3
                          className={`process-title-${item.id} mt-3 font-serif text-[clamp(1.85rem,2.5vw,3rem)] leading-[0.98] text-black`}
                        >
                          {item.title}
                        </h3>

                        <p
                          className={`process-description-${item.id} mt-3 max-w-[340px] font-sans text-[clamp(14px,1vw,15.5px)] leading-relaxed`}
                          style={mutedTextStyle}
                        >
                          {item.content}
                        </p>
                      </article>
                    </>
                  )}
                </div>
              );
            })}

            {/* Ending stage buffer */}
            <div className="w-[6vw] shrink-0" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
