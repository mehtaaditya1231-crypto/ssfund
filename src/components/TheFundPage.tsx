import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TheFundPageProps {
  onNavigate?: (href: string) => void;
}

export default function TheFundPage({ onNavigate }: TheFundPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monogramRef = useRef<HTMLDivElement>(null);

  // Update document title and description
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "The Fund — SS Value Plus Fund | Sneh Sagar Wealth Management LLP";

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "SS Value Plus Fund — A research-led investment fund focused on finding value in Indian businesses whose long-term potential may not yet be fully recognised."
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
    };
  }, []);

  // GSAP animations and scroll interactions
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const hero = containerRef.current?.querySelector(".fund-hero");
      if (hero) {
        const label = hero.querySelector(".fund-hero-label");
        const lines = hero.querySelectorAll(".fund-hero-line");
        const supporting = hero.querySelector(".fund-hero-supporting");
        const scrollIndicator = hero.querySelector(".fund-hero-scroll");

        if (isReduced) {
          if (label) gsap.set(label, { opacity: 1, y: 0 });
          if (lines) gsap.set(lines, { opacity: 1, y: "0%" });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
          if (scrollIndicator) gsap.set(scrollIndicator, { opacity: 0.6, y: 0 });
        } else {
          gsap.set(label, { opacity: 0, y: 10 });
          gsap.set(lines, { opacity: 0, y: "105%" });
          gsap.set(supporting, { opacity: 0, y: 14 });
          gsap.set(scrollIndicator, { opacity: 0, y: 10 });

          const heroTl = gsap.timeline({ delay: 0.15 });

          // 1. Reveal small label gently
          heroTl.to(label, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          })
            // 2. Reveal heading lines using masked upward motion (~1.1s, power3.out)
            .to(
              lines,
              {
                opacity: 1,
                y: "0%",
                duration: 1.1,
                stagger: 0.14,
                ease: "power3.out",
              },
              "-=0.3"
            )
            // 3. Fade and slightly raise supporting paragraph (~0.8s)
            .to(
              supporting,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.55"
            )
            // 4. Reveal subtle scroll indicator last
            .to(
              scrollIndicator,
              {
                opacity: 0.55,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              "-=0.3"
            );
        }
      }

      // 2. Section 2 — Central belief animation
      const beliefSection = containerRef.current?.querySelector(".fund-belief");
      if (beliefSection) {
        const beliefLines = beliefSection.querySelectorAll(".belief-heading-line");
        const beliefParagraph = beliefSection.querySelector(".belief-paragraph");

        if (isReduced) {
          if (beliefLines) gsap.set(beliefLines, { opacity: 1, y: "0%" });
          if (beliefParagraph) gsap.set(beliefParagraph, { opacity: 1, y: 0 });
        } else {
          gsap.set(beliefLines, { opacity: 0, y: "105%" });
          gsap.set(beliefParagraph, { opacity: 0, y: 16 });

          const beliefObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                tl.to(beliefLines, {
                  opacity: 1,
                  y: "0%",
                  duration: 1.1,
                  stagger: 0.15,
                  ease: "power3.out",
                }).to(
                  beliefParagraph,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                  },
                  "-=0.5"
                );
                beliefObserver.disconnect();
              }
            },
            { threshold: 0.2 }
          );
          beliefObserver.observe(beliefSection);
        }
      }

      // 3. Section 3 — Where we invest
      const investSection = containerRef.current?.querySelector(".fund-invest");
      if (investSection) {
        const dividers = investSection.querySelectorAll(".invest-divider");
        const columns = investSection.querySelectorAll(".invest-col");

        if (isReduced) {
          dividers.forEach((d) => gsap.set(d, { scaleY: 1, scaleX: 1, opacity: 1 }));
          columns.forEach((c) => gsap.set(c, { opacity: 1, y: 0 }));
        } else {
          dividers.forEach((d) => gsap.set(d, { opacity: 0 }));
          columns.forEach((c) => gsap.set(c, { opacity: 0, y: 22 }));

          const investObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                tl.to(dividers, {
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.1,
                  ease: "power2.out",
                }).to(
                  columns,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.12,
                    ease: "power3.out",
                  },
                  "-=0.4"
                );
                investObserver.disconnect();
              }
            },
            { threshold: 0.15 }
          );
          investObserver.observe(investSection);
        }
      }

      // 4. Section 4 — What capital is looking for (Row-by-row reveals)
      const valuesSection = containerRef.current?.querySelector(".fund-values");
      if (valuesSection) {
        const rows = valuesSection.querySelectorAll<HTMLElement>(".value-row");

        rows.forEach((row) => {
          const divider = row.querySelector(".value-divider");
          const num = row.querySelector(".value-num");
          const heading = row.querySelector(".value-title");
          const desc = row.querySelector(".value-desc");

          if (isReduced) {
            if (divider) gsap.set(divider, { scaleX: 1, opacity: 1 });
            if (num) gsap.set(num, { opacity: 1 });
            if (heading) gsap.set(heading, { opacity: 1, y: 0 });
            if (desc) gsap.set(desc, { opacity: 1, y: 0 });
          } else {
            if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
            if (num) gsap.set(num, { opacity: 0 });
            if (heading) gsap.set(heading, { opacity: 0, y: 14 });
            if (desc) gsap.set(desc, { opacity: 0, y: 10 });

            const rowObserver = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  const tl = gsap.timeline();
                  if (divider) {
                    tl.to(divider, {
                      scaleX: 1,
                      duration: 0.65,
                      ease: "power2.out",
                    });
                  }
                  if (num) {
                    tl.to(
                      num,
                      {
                        opacity: 1,
                        duration: 0.35,
                        ease: "power1.out",
                      },
                      "-=0.4"
                    );
                  }
                  if (heading) {
                    tl.to(
                      heading,
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        ease: "power3.out",
                      },
                      "-=0.3"
                    );
                  }
                  if (desc) {
                    tl.to(
                      desc,
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.55,
                        ease: "power2.out",
                      },
                      "-=0.4"
                    );
                  }
                  rowObserver.disconnect();
                }
              },
              { threshold: 0.2 }
            );
            rowObserver.observe(row);
          }
        });
      }

      // 5. Section 5 — The role of time
      const timeSection = containerRef.current?.querySelector(".fund-time");
      if (timeSection) {
        const sentence1 = timeSection.querySelector(".time-sentence-1");
        const sentence2 = timeSection.querySelector(".time-sentence-2");

        if (isReduced) {
          if (sentence1) gsap.set(sentence1, { opacity: 1, y: 0 });
          if (sentence2) gsap.set(sentence2, { opacity: 1, y: 0 });
        } else {
          if (sentence1) gsap.set(sentence1, { opacity: 0, y: 18 });
          if (sentence2) gsap.set(sentence2, { opacity: 0, y: 16 });

          const timeObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                if (sentence1) {
                  tl.to(sentence1, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out",
                  });
                }
                if (sentence2) {
                  tl.to(
                    sentence2,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.8,
                      ease: "power2.out",
                    },
                    "-=0.4"
                  );
                }
                timeObserver.disconnect();
              }
            },
            { threshold: 0.25 }
          );
          timeObserver.observe(timeSection);
        }
      }

      // 6. Section 6 — Investor alignment
      const alignSection = containerRef.current?.querySelector(".fund-align");
      if (alignSection) {
        const statements = alignSection.querySelectorAll(".align-statement-item");
        const dividers = alignSection.querySelectorAll(".align-divider");

        if (isReduced) {
          statements.forEach((s) => gsap.set(s, { opacity: 1, y: 0 }));
          dividers.forEach((d) => gsap.set(d, { scaleX: 1, opacity: 1 }));
        } else {
          statements.forEach((s) => gsap.set(s, { opacity: 0, y: 20 }));
          dividers.forEach((d) => gsap.set(d, { scaleX: 0, transformOrigin: "left center" }));

          const alignObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                dividers.forEach((divider, idx) => {
                  tl.to(
                    divider,
                    {
                      scaleX: 1,
                      duration: 0.6,
                      ease: "power2.out",
                    },
                    idx === 0 ? "0" : "-=0.3"
                  );
                });
                tl.to(
                  statements,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    stagger: 0.16,
                    ease: "power3.out",
                  },
                  "-=0.5"
                );
                alignObserver.disconnect();
              }
            },
            { threshold: 0.18 }
          );
          alignObserver.observe(alignSection);
        }
      }

      // 7. Section 7 — Fund at a glance
      const glanceSection = containerRef.current?.querySelector(".fund-glance");
      if (glanceSection) {
        const rows = glanceSection.querySelectorAll<HTMLElement>(".glance-row");

        if (isReduced) {
          rows.forEach((row) => {
            const line = row.querySelector(".glance-divider");
            const label = row.querySelector(".glance-label");
            const val = row.querySelector(".glance-val");
            if (line) gsap.set(line, { scaleX: 1, opacity: 1 });
            if (label) gsap.set(label, { opacity: 1 });
            if (val) gsap.set(val, { opacity: 1 });
          });
        } else {
          rows.forEach((row) => {
            const line = row.querySelector(".glance-divider");
            const label = row.querySelector(".glance-label");
            const val = row.querySelector(".glance-val");
            if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
            if (label) gsap.set(label, { opacity: 0, y: 8 });
            if (val) gsap.set(val, { opacity: 0, y: 8 });

            const glanceObserver = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  const tl = gsap.timeline();
                  if (line) {
                    tl.to(line, {
                      scaleX: 1,
                      duration: 0.6,
                      ease: "power2.out",
                    });
                  }
                  if (label) {
                    tl.to(
                      label,
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out",
                      },
                      "-=0.4"
                    );
                  }
                  if (val) {
                    tl.to(
                      val,
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: "power2.out",
                      },
                      "-=0.35"
                    );
                  }
                  glanceObserver.disconnect();
                }
              },
              { threshold: 0.2 }
            );
            glanceObserver.observe(row);
          });
        }
      }

      // 8. Subtle vertical parallax for Section 2 SS Monogram
      const onScrollParallax = () => {
        if (isReduced) return;
        const belief = beliefSection as HTMLElement | null;
        const mono = monogramRef.current;
        if (belief && mono) {
          const rect = belief.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < window.innerHeight) {
            // Subtle vertical drift: ~30px travel across the entire section
            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const translateY = (progress - 0.5) * -35;
            mono.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
          }
        }
      };

      window.addEventListener("scroll", onScrollParallax, { passive: true });
      onScrollParallax();

      return () => {
        window.removeEventListener("scroll", onScrollParallax);
      };
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleApproachClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("/approach");
    } else {
      window.location.href = "/approach";
    }
  };

  return (
    <div ref={containerRef} className="fund-page bg-white text-black selection:bg-black selection:text-white">
      {/* =========================================================================
          SECTION 1 — HERO
          Near-full-screen white hero, centrally placed with substantial whitespace.
          ========================================================================= */}
      <section
        className="fund-hero min-h-[94svh] flex flex-col items-center justify-center text-center relative px-[var(--pad)] pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-16 bg-white"
        aria-label="The Fund Hero"
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center justify-center -translate-y-2 sm:-translate-y-4">
          <p className="fund-hero-label font-sans text-[11px] sm:text-[13px] font-medium tracking-[0.22em] uppercase text-black mb-6 sm:mb-8">
            SS VALUE PLUS FUND
          </p>

          <h1 className="fund-hero-title font-serif text-[clamp(44px,7.8vw,110px)] font-normal leading-[0.96] tracking-[-0.04em] text-black m-0 max-w-[940px]">
            <span className="block overflow-hidden py-[0.04em]">
              <span className="fund-hero-line block">Built for investors</span>
            </span>
            <span className="block overflow-hidden py-[0.04em]">
              <span className="fund-hero-line block">who think in years.</span>
            </span>
          </h1>

          <p className="fund-hero-supporting font-sans text-[clamp(15px,1.25vw,17.5px)] leading-[1.62] font-normal text-black/80 max-w-[580px] mt-7 sm:mt-10">
            A research-led investment fund focused on finding value in Indian businesses whose long-term potential may
            not yet be fully recognised.
          </p>
        </div>

        {/* Very subtle downward scroll indicator near the bottom */}
        <div
          className="fund-hero-scroll absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-black/40">Scroll</span>
          <div className="w-[1px] h-8 bg-black/25 relative overflow-hidden">
            <span className="block w-full h-full bg-black/70 animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — CENTRAL BELIEF
          Full-width pure-black section with oversized white editorial text,
          large translucent "SS" monogram moving slowly in subtle parallax.
          ========================================================================= */}
      <section
        className="fund-belief relative bg-black text-white px-[var(--pad)] py-[clamp(5.5rem,11vw,10.5rem)] overflow-hidden"
        data-nav-dark="true"
        aria-label="Central Belief"
      >
        {/* Large translucent SS Monogram behind the text */}
        <div
          ref={monogramRef}
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden pr-[2vw] sm:pr-[6vw]"
          style={{ willChange: "transform" }}
          aria-hidden="true"
        >
          <span
            className="font-serif leading-none tracking-[-0.08em]"
            style={{
              fontSize: "clamp(22rem, 50vw, 52rem)",
              color: "rgba(255, 255, 255, 0.06)",
            }}
          >
            SS
          </span>
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col items-start">
          <h2 className="font-serif text-[clamp(38px,6.8vw,92px)] font-normal leading-[1.02] tracking-[-0.045em] text-white m-0 max-w-[960px]">
            <span className="block overflow-hidden py-[0.03em]">
              <span className="belief-heading-line block">The market does not always</span>
            </span>
            <span className="block overflow-hidden py-[0.03em]">
              <span className="belief-heading-line block">recognise value immediately.</span>
            </span>
          </h2>

          <p className="belief-paragraph font-sans text-[clamp(15px,1.3vw,18px)] leading-[1.68] font-normal text-white/70 max-w-[620px] mt-8 sm:mt-12">
            Short-term attention can move away from what matters: the quality of a business, the people behind it and
            its ability to create value over time. We seek opportunities where our understanding differs from the
            market’s current view.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — WHERE WE INVEST
          White background. Three editorial columns separated by thin vertical
          dividers on desktop, stacked with horizontal dividers on mobile.
          ========================================================================= */}
      <section
        className="fund-invest bg-white text-black px-[var(--pad)] py-[clamp(5rem,10vw,9.5rem)] border-t border-black/10"
        aria-label="Where We Invest"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 sm:mb-16">
            <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/55 block mb-3">
              WHERE WE INVEST
            </span>
            <h2 className="font-serif text-[clamp(34px,5.4vw,74px)] font-normal leading-[1.0] tracking-[-0.04em] text-black m-0">
              Opportunity begins
              <br />
              with understanding.
            </h2>
          </div>

          {/* Three editorial columns with thin dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 relative">
            {/* Column 1 */}
            <article className="invest-col pr-0 md:pr-10 lg:pr-14 pb-8 md:pb-0">
              <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] font-normal leading-[1.15] text-black m-0 mb-4">
                Indian businesses
              </h3>
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.62] text-black/70 m-0">
                Our focus remains on businesses participating in India’s long-term economic opportunity.
              </p>
            </article>

            {/* Divider 1: Horizontal on mobile, vertical on desktop */}
            <div className="invest-divider w-full md:w-[1px] h-[1px] md:h-auto bg-black/15 my-6 md:my-0 md:absolute md:left-1/3 md:inset-y-0" />

            {/* Column 2 */}
            <article className="invest-col px-0 md:px-10 lg:px-14 py-2 md:py-0">
              <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] font-normal leading-[1.15] text-black m-0 mb-4">
                Small- and mid-cap companies
              </h3>
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.62] text-black/70 m-0">
                We look for companies where quality, opportunity and valuation can come together before they receive
                wider market recognition.
              </p>
            </article>

            {/* Divider 2: Horizontal on mobile, vertical on desktop */}
            <div className="invest-divider w-full md:w-[1px] h-[1px] md:h-auto bg-black/15 my-6 md:my-0 md:absolute md:left-2/3 md:inset-y-0" />

            {/* Column 3 */}
            <article className="invest-col pl-0 md:pl-10 lg:pl-14 pt-2 md:pt-0">
              <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] font-normal leading-[1.15] text-black m-0 mb-4">
                Derivative opportunities
              </h3>
              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.62] text-black/70 m-0">
                Where appropriate, the fund may also consider opportunities through derivatives within its broader
                investment framework.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — WHAT CAPITAL IS LOOKING FOR
          Vertically stacked list: 01 to 06 with thin dividers, restrained numbers,
          large serif titles, right-aligned descriptions, restrained hover.
          ========================================================================= */}
      <section
        className="fund-values bg-white text-black px-[var(--pad)] py-[clamp(5rem,10vw,9.5rem)] border-t border-black/10"
        aria-label="What We Value"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 sm:mb-16">
            <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/55 block mb-3">
              WHAT WE VALUE
            </span>
            <h2 className="font-serif text-[clamp(34px,5.4vw,74px)] font-normal leading-[1.0] tracking-[-0.04em] text-black m-0">
              What capital
              <br />
              is looking for.
            </h2>
          </div>

          <div className="flex flex-col">
            {[
              {
                num: "01",
                title: "Understandable economics",
                desc: "We favour businesses whose economics can be understood clearly—how they earn, reinvest and protect their position.",
              },
              {
                num: "02",
                title: "Capable and aligned management",
                desc: "We look for leaders who act with integrity and allocate capital with a long-term owner’s perspective.",
              },
              {
                num: "03",
                title: "A defensible market position",
                desc: "We consider what allows a business to remain relevant and competitive as its market develops.",
              },
              {
                num: "04",
                title: "Intelligent capital allocation",
                desc: "The way a company deploys its resources can determine how effectively value compounds over time.",
              },
              {
                num: "05",
                title: "A meaningful margin of safety",
                desc: "Price matters. We look for sufficient room between market expectations and our assessment of intrinsic value.",
              },
              {
                num: "06",
                title: "Room for long-term value creation",
                desc: "We seek businesses with the opportunity and ability to grow without compromising the quality of their economics.",
              },
            ].map((item, idx, arr) => (
              <div
                key={item.num}
                className="value-row group relative py-7 sm:py-9 transition-colors duration-300"
              >
                {/* Thin top divider */}
                <div className="value-divider absolute top-0 inset-x-0 h-[1px] bg-black/15" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
                  {/* Left: Restrained number */}
                  <div className="md:col-span-1">
                    <span className="value-num font-mono text-[12px] sm:text-[13px] tracking-[0.14em] text-black/50 block">
                      {item.num}
                    </span>
                  </div>

                  {/* Middle: Large serif title */}
                  <div className="md:col-span-6">
                    <h3 className="value-title font-serif text-[clamp(24px,3vw,42px)] font-normal leading-[1.1] text-black m-0 group-hover:text-black/85 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: Short explanation aligned right on desktop */}
                  <div className="md:col-span-5 md:pl-4">
                    <p className="value-desc font-sans text-[14.5px] sm:text-[15.5px] leading-[1.62] text-black/70 m-0 group-hover:translate-x-1 transition-transform duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom divider on the very last row */}
                {idx === arr.length - 1 && (
                  <div className="absolute bottom-0 inset-x-0 h-[1px] bg-black/15" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — THE ROLE OF TIME
          Full-width pale-pink section using the exact tone #F5E1DE from QuoteSection.
          Black text. No red text. No italics.
          ========================================================================= */}
      <section
        className="fund-time px-[var(--pad)] py-[clamp(6rem,12vw,11.5rem)] text-black"
        style={{ backgroundColor: "#F5E1DE" }}
        aria-label="The Role of Time"
      >
        <div className="max-w-[1100px] mx-auto">
          <h2 className="time-sentence-1 font-serif text-[clamp(34px,5.8vw,82px)] font-normal leading-[1.04] tracking-[-0.04em] text-black m-0 max-w-[980px]">
            Time is not the thesis.
            <br />
            It is what allows a sound thesis to unfold.
          </h2>

          <p className="time-sentence-2 font-sans text-[clamp(15px,1.3vw,18px)] leading-[1.68] font-normal text-black/80 max-w-[640px] mt-8 sm:mt-12">
            Long-term investing does not mean holding without question. It means remaining patient while the
            underlying business continues to support the original reasoning.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — INVESTOR ALIGNMENT
          Pure-black section with white text.
          Label: INVESTOR ALIGNMENT
          Three large editorial statements divided by subtle white lines.
          ========================================================================= */}
      <section
        className="fund-align relative bg-black text-white px-[var(--pad)] py-[clamp(5.5rem,11vw,10.5rem)]"
        data-nav-dark="true"
        aria-label="Investor Alignment"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-14 sm:mb-20">
            <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-white/55 block mb-3">
              INVESTOR ALIGNMENT
            </span>
            <h2 className="font-serif text-[clamp(34px,5.4vw,74px)] font-normal leading-[1.0] tracking-[-0.04em] text-white m-0 mb-6">
              A shared understanding
              <br />
              of the journey.
            </h2>
            <p
              className="font-sans text-[clamp(15px,1.25vw,17.5px)] leading-[1.65] max-w-[620px] m-0"
              style={{ color: "rgba(255, 255, 255, 0.68)" }}
            >
              The fund is built for investors who recognise that meaningful outcomes may require patience, independent
              thinking and the ability to remain measured through changing market conditions.
            </p>
          </div>

          {/* Three large editorial statements */}
          <div className="flex flex-col">
            {[
              "A long-term perspective",
              "Comfort with periods of market uncertainty",
              "Trust in research-led decision-making",
            ].map((statement, idx, arr) => (
              <div key={statement} className="align-statement relative py-8 sm:py-12">
                {/* Subtle top divider */}
                <div
                  className="align-divider absolute top-0 inset-x-0 h-[1px]"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}
                />

                <h3 className="align-statement-item font-serif text-[clamp(26px,4vw,56px)] font-normal leading-[1.12] tracking-[-0.035em] text-white m-0">
                  {statement}
                </h3>

                {/* Bottom divider on the last item */}
                {idx === arr.length - 1 && (
                  <div
                    className="absolute bottom-0 inset-x-0 h-[1px]"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — FUND AT A GLANCE
          White background. Two-column facts layout with thin horizontal dividers.
          ========================================================================= */}
      <section
        className="fund-glance bg-white text-black px-[var(--pad)] py-[clamp(5rem,10vw,9.5rem)] border-t border-black/10"
        aria-label="Fund at a Glance"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12 sm:mb-16">
            <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/55 block mb-3">
              FUND AT A GLANCE
            </span>
            <h2 className="font-serif text-[clamp(34px,5vw,68px)] font-normal leading-[1.05] tracking-[-0.04em] text-black m-0">
              Overview & structure
            </h2>
          </div>

          <div className="flex flex-col">
            {[
              { label: "Market", value: "India" },
              { label: "Primary focus", value: "Small- and mid-cap businesses" },
              { label: "Investment style", value: "Fundamental and value-oriented" },
              { label: "Time horizon", value: "Long term" },
              { label: "Minimum investment", value: "₹1 crore" },
              { label: "Investment manager", value: "Sneh Sagar Wealth Management LLP" },
            ].map((fact, idx, arr) => (
              <div
                key={fact.label}
                className="glance-row relative py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
              >
                {/* Thin divider */}
                <div className="glance-divider absolute top-0 inset-x-0 h-[1px] bg-black/12" />

                <div className="sm:col-span-5">
                  <span className="glance-label font-sans text-[13px] sm:text-[14px] font-medium tracking-[0.04em] text-black/60 uppercase">
                    {fact.label}
                  </span>
                </div>

                <div className="sm:col-span-7">
                  <span className="glance-val font-serif text-[clamp(19px,2vw,26px)] font-normal text-black block">
                    {fact.value}
                  </span>
                </div>

                {idx === arr.length - 1 && (
                  <div className="absolute bottom-0 inset-x-0 h-[1px] bg-black/12" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8 — CLOSING TRANSITION
          Spacious final white section leading to /approach.
          ========================================================================= */}
      <section
        className="fund-closing bg-white text-black px-[var(--pad)] py-[clamp(6rem,12vw,11rem)] border-t border-black/10"
        aria-label="Closing Transition"
      >
        <div className="max-w-[1000px] mx-auto flex flex-col items-start">
          <h2 className="font-serif text-[clamp(36px,6vw,84px)] font-normal leading-[1.0] tracking-[-0.04em] text-black m-0">
            Conviction begins
            <br />
            with a process.
          </h2>

          <p className="font-sans text-[clamp(15px,1.25vw,18px)] leading-[1.65] text-black/75 max-w-[580px] mt-6 sm:mt-8">
            Explore how ideas are researched, questioned and developed into long-term investment decisions.
          </p>

          <a
            href="/approach"
            onClick={handleApproachClick}
            className="inline-flex items-center gap-2 mt-8 sm:mt-10 font-sans text-[15px] sm:text-[16px] font-medium text-black border-b border-black/35 pb-1 hover:border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs"
          >
            <span>Discover our approach</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
