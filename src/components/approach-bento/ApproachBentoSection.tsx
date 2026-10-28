import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ValuePricePanel from "./ValuePricePanel";
import BusinessQualityPanel from "./BusinessQualityPanel";
import RiskDisciplinePanel from "./RiskDisciplinePanel";
import CapablePeoplePanel from "./CapablePeoplePanel";
import TimeToWorkPanel from "./TimeToWorkPanel";
import ResearchLoopPanel from "./ResearchLoopPanel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ApproachBentoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);

  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const isReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotion) {
      setIsSectionVisible(true);
      return;
    }

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // Main section ScrollTrigger
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top 78%",
        once: true,
        onEnter: () => {
          setIsSectionVisible(true);

          // Animate section header elements
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (headingRef.current) {
            tl.fromTo(
              headingRef.current.querySelectorAll(".heading-line"),
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }
            );
          }

          if (copyRef.current) {
            tl.fromTo(
              copyRef.current,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8 },
              "-=0.5"
            );
          }

          // Animate Bento Cards Entrance
          if (bentoGridRef.current) {
            const cards = bentoGridRef.current.querySelectorAll("article");
            tl.fromTo(
              cards,
              { y: 35, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
              },
              "-=0.4"
            );
          }
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      data-section="03"
      data-nav-dark="true"
      className="relative w-full bg-[#081F3C] text-[#F5F1E8] overflow-hidden py-24 sm:py-28 md:py-32 lg:py-36 px-4 sm:px-6 md:px-10 lg:px-16"
      style={{
        backgroundColor: "#081F3C",
      }}
    >
      {/* Background SS Monogram Watermark */}
      <div
        className="pointer-events-none absolute right-[-0.04em] bottom-[-0.32em] select-none font-serif text-[clamp(18rem,46vw,46rem)] leading-none font-normal z-0"
        style={{
          color: "rgba(245, 241, 232, 0.025)",
        }}
        aria-hidden="true"
      >
        SS
      </div>

      {/* Ambient background illumination */}
      <div
        className="pointer-events-none absolute top-10 left-1/4 w-[600px] h-[300px] rounded-full bg-[#B87332]/6 blur-[120px] z-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-20 right-1/4 w-[700px] h-[350px] rounded-full bg-[#0d2c54]/40 blur-[130px] z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Section Header: Left Heading, Right Supporting Copy */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 pb-10 sm:pb-14 md:pb-16 border-b border-[rgba(245,241,232,0.14)]">
          <h2
            ref={headingRef}
            className="font-serif text-[clamp(2.8rem,6.8vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-[#F5F1E8] m-0 max-w-[750px]"
          >
            <span className="heading-line block">A clearer way</span>
            <span className="heading-line block">of seeing value.</span>
          </h2>

          <p
            ref={copyRef}
            className="font-sans text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed text-[#F5F1E8]/70 max-w-[380px] m-0"
          >
            Our approach is grounded in research, guided by fundamentals and measured over years—not quarters.
          </p>
        </div>

        {/* Bento Grid Composition */}
        {/* 
          Grid Specification:
          - Gaps: 14-16px (gap-3.5 sm:gap-4)
          - Corner Radii: 22-24px (rounded-[22px] md:rounded-[24px])
          - Borders: rgba(245, 241, 232, 0.16)
          - Desktop: 12-column asymmetrical layout
          - Tablet (md):
              * Value/Price: full width (col-span-12)
              * Business Quality & Capable People: equal halves (col-span-6)
              * Risk Discipline: compact row (col-span-12)
              * Time & Loop: stacked or responsive
          - Mobile (<md):
              * Strict order:
                1. Value / Price
                2. Business Quality
                3. Capable People
                4. Risk Discipline
                5. Time to Work
                6. Research Loop
        */}
        <div
          ref={bentoGridRef}
          className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4"
        >
          {/* Panel 1: VALUE / PRICE (Dominant Wide Hero Panel) */}
          <ValuePricePanel
            isTriggered={isSectionVisible}
            className="order-1 col-span-1 md:col-span-12"
          />

          {/* Panel 2: BUSINESS QUALITY */}
          <BusinessQualityPanel
            isTriggered={isSectionVisible}
            className="order-2 col-span-1 md:col-span-6 lg:col-span-4 lg:order-2"
          />

          {/* Panel 3: RISK DISCIPLINE (Accent Card) */}
          {/* On mobile: order-4. On tablet: order-4 (compact full width). On desktop: order-3 (center col-span-3) */}
          <RiskDisciplinePanel
            isTriggered={isSectionVisible}
            className="order-4 col-span-1 md:col-span-12 lg:col-span-3 lg:order-3"
          />

          {/* Panel 4: CAPABLE PEOPLE */}
          {/* On mobile: order-3. On tablet: order-3 (equal half col-span-6). On desktop: order-4 (col-span-5) */}
          <CapablePeoplePanel
            isTriggered={isSectionVisible}
            className="order-3 col-span-1 md:col-span-6 lg:col-span-5 lg:order-4"
          />

          {/* Panel 5: TIME TO WORK */}
          <TimeToWorkPanel
            isTriggered={isSectionVisible}
            className="order-5 col-span-1 md:col-span-12 lg:col-span-7"
          />

          {/* Panel 6: RESEARCH LOOP */}
          <ResearchLoopPanel
            isTriggered={isSectionVisible}
            className="order-6 col-span-1 md:col-span-12 lg:col-span-5"
          />
        </div>
      </div>
    </section>
  );
}
