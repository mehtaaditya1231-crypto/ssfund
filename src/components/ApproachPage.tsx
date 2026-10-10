"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import InvestmentProcessTimeline from "@/components/ui/investment-process-timeline";

export interface ApproachPageProps {
  onNavigate: (to: string) => void;
}

export default function ApproachPage({ onNavigate }: ApproachPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Update document title and meta description
  useEffect(() => {
    const originalTitle = document.title;
    document.title =
      "Investment Approach — SS Value Plus Fund | Sneh Sagar Wealth Management LLP";

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "SS Value Plus Fund Investment Approach — Conviction is built, not assumed. Explore our disciplined seven-stage research and ownership process for Indian equities."
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
    };
  }, []);

  // Hero, Section 3, and Section 4 GSAP Animations
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const hero = containerRef.current?.querySelector(".approach-hero");
      if (hero) {
        const label = hero.querySelector(".approach-hero-label");
        const lines = hero.querySelectorAll(".approach-hero-line");
        const supporting = hero.querySelector(".approach-hero-supporting");
        const scrollIndicator = hero.querySelector(".approach-hero-scroll");

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

          heroTl
            .to(label, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            })
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
            .to(
              scrollIndicator,
              {
                opacity: 0.6,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              "-=0.3"
            );
        }
      }

      // 2. Section 3 — Continuous Review Animation
      const reviewSection = containerRef.current?.querySelector(".approach-review");
      if (reviewSection) {
        const divider = reviewSection.querySelector(".review-divider");
        const label = reviewSection.querySelector(".review-label");
        const lines = reviewSection.querySelectorAll(".review-heading-line");
        const supporting = reviewSection.querySelector(".review-supporting");

        if (isReduced) {
          if (divider) gsap.set(divider, { scaleX: 1, opacity: 1 });
          if (label) gsap.set(label, { opacity: 1 });
          if (lines) gsap.set(lines, { opacity: 1, y: "0%" });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
        } else {
          if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
          if (label) gsap.set(label, { opacity: 0 });
          if (lines) gsap.set(lines, { opacity: 0, y: "105%" });
          if (supporting) gsap.set(supporting, { opacity: 0, y: 16 });

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                if (divider) {
                  tl.to(divider, {
                    scaleX: 1,
                    duration: 0.85,
                    ease: "power2.out",
                  });
                }
                if (label) {
                  tl.to(
                    label,
                    {
                      opacity: 1,
                      duration: 0.5,
                      ease: "power2.out",
                    },
                    "-=0.5"
                  );
                }
                if (lines) {
                  tl.to(
                    lines,
                    {
                      opacity: 1,
                      y: "0%",
                      duration: 1.0,
                      stagger: 0.14,
                      ease: "power3.out",
                    },
                    "-=0.4"
                  );
                }
                if (supporting) {
                  tl.to(
                    supporting,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.8,
                      ease: "power2.out",
                    },
                    "-=0.5"
                  );
                }
                observer.disconnect();
              }
            },
            { threshold: 0.15 }
          );
          observer.observe(reviewSection);
        }
      }

      // 3. Section 4 — Closing Transition Reveal
      const closingSection = containerRef.current?.querySelector(".approach-closing");
      if (closingSection) {
        const heading = closingSection.querySelector(".closing-heading");
        const supporting = closingSection.querySelector(".closing-supporting");
        const links = closingSection.querySelector(".closing-links");

        if (isReduced) {
          if (heading) gsap.set(heading, { opacity: 1, y: 0 });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
          if (links) gsap.set(links, { opacity: 1, y: 0 });
        } else {
          if (heading) gsap.set(heading, { opacity: 0, y: 16 });
          if (supporting) gsap.set(supporting, { opacity: 0, y: 14 });
          if (links) gsap.set(links, { opacity: 0, y: 12 });

          const closingObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                if (heading) {
                  tl.to(heading, {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power3.out",
                  });
                }
                if (supporting) {
                  tl.to(
                    supporting,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.75,
                      ease: "power2.out",
                    },
                    "-=0.5"
                  );
                }
                if (links) {
                  tl.to(
                    links,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.65,
                      ease: "power2.out",
                    },
                    "-=0.4"
                  );
                }
                closingObserver.disconnect();
              }
            },
            { threshold: 0.2 }
          );
          closingObserver.observe(closingSection);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToProcess = () => {
    const el = document.getElementById("investment-process");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="approach-page bg-white text-black min-h-screen selection:bg-black selection:text-white"
    >
      {/* =========================================================================
          Section 1 — Opening Hero (~1 viewport tall, pure white #FFFFFF)
          ========================================================================= */}
      <section
        className="approach-hero relative min-h-[100svh] flex flex-col justify-between items-center text-center px-[var(--pad,2rem)] pt-[calc(7rem+env(safe-area-inset-top,0px))] pb-12"
        aria-label="Investment Approach Hero"
      >
        <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center my-auto">
          {/* Small label */}
          <p className="approach-hero-label font-sans text-xs sm:text-[13px] font-medium uppercase tracking-[0.22em] text-black/60 m-0 mb-6 sm:mb-8">
            OUR APPROACH
          </p>

          {/* Heading revealed line-by-line via overflow mask */}
          <h1 className="font-serif text-[clamp(42px,7.5vw,112px)] font-normal leading-[0.92] tracking-[-0.04em] text-black m-0 max-w-[1050px]">
            <span className="block overflow-hidden py-[0.05em]">
              <span className="approach-hero-line block">
                Conviction is built,
              </span>
            </span>
            <span className="block overflow-hidden py-[0.05em]">
              <span className="approach-hero-line block">
                not assumed.
              </span>
            </span>
          </h1>

          {/* Supporting copy */}
          <p className="approach-hero-supporting font-sans text-[clamp(15px,1.25vw,18px)] leading-[1.65] text-black/62 max-w-[620px] m-0 mt-8 sm:mt-10">
            Every investment begins with questions. Research, evidence and valuation
            determine whether those questions develop into long-term conviction.
          </p>
        </div>

        {/* Downward indicator with "Follow the process" */}
        <div
          onClick={handleScrollToProcess}
          className="approach-hero-scroll flex flex-col items-center gap-3 cursor-pointer pt-6 pb-2 transition-opacity hover:opacity-90 focus:outline-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleScrollToProcess();
            }
          }}
          aria-label="Follow the process"
        >
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-black/60">
            Follow the process
          </span>
          <div className="w-px h-8 bg-black/20 overflow-hidden relative">
            <div className="w-full h-full bg-black animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          Section 2 — Horizontal Investment Process (The 7 Stages)
          ========================================================================= */}
      <InvestmentProcessTimeline
        textColor="#000000"
        mutedTextColor="rgba(0, 0, 0, 0.62)"
        activeColor="#000000"
        backgroundColor="#ffffff"
        duration={1.2}
      />

      {/* =========================================================================
          Section 3 — Research is Continuous (Editorial Section)
          ========================================================================= */}
      <section
        className="approach-review relative w-full bg-white px-[var(--pad,2rem)] py-24 sm:py-32 md:py-44"
        aria-label="Continuous Review Philosophy"
      >
        <div className="max-w-[1100px] mx-auto">
          {/* Animated thin horizontal divider (draws left to right) */}
          <div className="review-divider w-full h-px bg-black/[0.18] mb-12 sm:mb-16 origin-left" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            <div className="lg:col-span-4">
              <span className="review-label font-sans text-xs uppercase tracking-[0.24em] text-black/60 block">
                CONTINUOUS REVIEW
              </span>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-8">
              <h2 className="font-serif text-[clamp(36px,5.5vw,82px)] font-normal leading-[0.94] tracking-[-0.04em] text-black m-0">
                <span className="block overflow-hidden py-[0.05em]">
                  <span className="review-heading-line block">
                    Ownership does not
                  </span>
                </span>
                <span className="block overflow-hidden py-[0.05em]">
                  <span className="review-heading-line block">
                    end the research.
                  </span>
                </span>
              </h2>

              <p className="review-supporting font-sans text-[clamp(16px,1.25vw,19px)] leading-[1.65] text-black/62 max-w-[620px] m-0">
                New information, changing economics and management decisions are
                continuously considered against the original investment thesis.
                Patience remains valuable only while the underlying reasoning
                continues to hold.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Section 4 — Closing Transition
          ========================================================================= */}
      <section
        className="approach-closing relative w-full bg-white border-t border-black/[0.18] px-[var(--pad,2rem)] py-24 sm:py-32 md:py-40"
        aria-label="Explore the Fund Closing Transition"
      >
        <div className="max-w-[1100px] mx-auto flex flex-col items-start">
          <h2 className="closing-heading font-serif text-[clamp(34px,5vw,72px)] font-normal leading-[0.96] tracking-[-0.035em] text-black m-0 max-w-[16ch]">
            Understand the fund
            <br />
            behind the process.
          </h2>

          <p className="closing-supporting font-sans text-[clamp(15px,1.2vw,18px)] leading-[1.65] text-black/62 max-w-[560px] m-0 mt-6 sm:mt-8">
            Explore the investment focus and long-term perspective that guide SS
            Value Plus Fund.
          </p>

          <div className="closing-links flex flex-wrap items-center gap-8 sm:gap-12 mt-10 sm:mt-12">
            <a
              href="/the-fund"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/the-fund");
              }}
              className="inline-flex items-center gap-2 font-sans text-base font-medium text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
            >
              Explore the fund <span aria-hidden="true">→</span>
            </a>

            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("/contact");
              }}
              className="inline-flex items-center gap-2 font-sans text-sm font-normal text-black/62 hover:text-black border-b border-black/20 hover:border-black pb-1 transition-colors"
            >
              Start a conversation <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
