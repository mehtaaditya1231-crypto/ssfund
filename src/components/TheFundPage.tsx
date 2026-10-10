"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TheFundPageProps {
  onNavigate?: (href: string) => void;
}

const PRODUCT_INFO = [
  {
    label: "Investment universe",
    value: "Indian small- and mid-cap companies",
    nowrap: false,
  },
  {
    label: "Minimum investment",
    value: "₹1 crore",
    nowrap: true,
  },
  {
    label: "Inception date",
    value: "5 August 2026",
    nowrap: false,
  },
  {
    label: "Typical holding period",
    value: "3–5 years",
    nowrap: true,
  },
  {
    label: "Single-stock exposure",
    value: "Less than 10%",
    nowrap: false,
  },
];

export default function TheFundPage({ onNavigate }: TheFundPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Update document title and description
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "The Fund — SS Value Plus Fund | Sneh Sagar Wealth Management LLP";

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "SS Value Plus Fund — A research-led investment fund focused on finding value in Indian small- and mid-cap businesses."
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
    };
  }, []);

  // GSAP scroll and entrance animations
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

        if (isReduced) {
          if (label) gsap.set(label, { opacity: 1, y: 0 });
          if (lines) gsap.set(lines, { opacity: 1, y: "0%" });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
        } else {
          gsap.set(label, { opacity: 0, y: 10 });
          gsap.set(lines, { opacity: 0, y: "105%" });
          gsap.set(supporting, { opacity: 0, y: 14 });

          const heroTl = gsap.timeline({ delay: 0.15 });

          // Reveal label
          heroTl
            .to(label, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
            })
            // Reveal heading line by line
            .to(
              lines,
              {
                opacity: 1,
                y: "0%",
                duration: 1.05,
                stagger: 0.14,
                ease: "power3.out",
              },
              "-=0.3"
            )
            // Fade supporting copy upward slightly
            .to(
              supporting,
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
              },
              "-=0.55"
            );
        }
      }

      // 2. Section 2 — About our product Animation
      const productSection = containerRef.current?.querySelector(".fund-product");
      if (productSection) {
        const label = productSection.querySelector(".product-label");
        const heading = productSection.querySelector(".product-heading");
        const paragraphs = productSection.querySelectorAll(".product-p");
        const dividers = productSection.querySelectorAll(".product-divider");
        const infoContent = productSection.querySelectorAll(".product-info-content");

        if (isReduced) {
          if (label) gsap.set(label, { opacity: 1, y: 0 });
          if (heading) gsap.set(heading, { opacity: 1, y: 0 });
          paragraphs.forEach((p) => gsap.set(p, { opacity: 1, y: 0 }));
          dividers.forEach((d) => gsap.set(d, { scaleX: 1, opacity: 1 }));
          infoContent.forEach((c) => gsap.set(c, { opacity: 1, y: 0 }));
        } else {
          if (label) gsap.set(label, { opacity: 0, y: 12 });
          if (heading) gsap.set(heading, { opacity: 0, y: 16 });
          paragraphs.forEach((p) => gsap.set(p, { opacity: 0, y: 14 }));
          dividers.forEach((d) =>
            gsap.set(d, { scaleX: 0, transformOrigin: "left center" })
          );
          infoContent.forEach((c) => gsap.set(c, { opacity: 0, y: 12 }));

          const productObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();

                // Reveal label and heading first
                if (label) {
                  tl.to(label, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                  });
                }
                if (heading) {
                  tl.to(
                    heading,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.75,
                      ease: "power3.out",
                    },
                    "-=0.3"
                  );
                }

                // Reveal paragraphs sequentially
                if (paragraphs.length) {
                  tl.to(
                    paragraphs,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.65,
                      stagger: 0.16,
                      ease: "power2.out",
                    },
                    "-=0.35"
                  );
                }

                // Draw dividers from left to right
                if (dividers.length) {
                  tl.to(
                    dividers,
                    {
                      scaleX: 1,
                      duration: 0.7,
                      stagger: 0.08,
                      ease: "power2.out",
                    },
                    "-=0.6"
                  );
                }

                // Reveal information labels and values with subtle stagger
                if (infoContent.length) {
                  tl.to(
                    infoContent,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.55,
                      stagger: 0.08,
                      ease: "power2.out",
                    },
                    "-=0.55"
                  );
                }

                productObserver.disconnect();
              }
            },
            { threshold: 0.12 }
          );

          productObserver.observe(productSection);
        }
      }

      // 3. Section 3 — Closing transition Animation
      const closingSection = containerRef.current?.querySelector(".fund-closing");
      if (closingSection) {
        const heading = closingSection.querySelector(".closing-heading");
        const supporting = closingSection.querySelector(".closing-supporting");
        const link = closingSection.querySelector(".closing-link");

        if (isReduced) {
          if (heading) gsap.set(heading, { opacity: 1, y: 0 });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
          if (link) gsap.set(link, { opacity: 1, y: 0 });
        } else {
          if (heading) gsap.set(heading, { opacity: 0, y: 16 });
          if (supporting) gsap.set(supporting, { opacity: 0, y: 12 });
          if (link) gsap.set(link, { opacity: 0, y: 10 });

          const closingObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                if (heading) {
                  tl.to(heading, {
                    opacity: 1,
                    y: 0,
                    duration: 0.75,
                    ease: "power3.out",
                  });
                }
                if (supporting) {
                  tl.to(
                    supporting,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.65,
                      ease: "power2.out",
                    },
                    "-=0.4"
                  );
                }
                if (link) {
                  tl.to(
                    link,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.55,
                      ease: "power2.out",
                    },
                    "-=0.35"
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
    <div
      ref={containerRef}
      className="fund-page bg-white text-black selection:bg-black selection:text-white"
    >
      {/* =========================================================================
          SECTION 1 — HERO
          Spacious, minimal pure-white hero (~75svh). Does not occupy more than
          one viewport.
          ========================================================================= */}
      <section
        className="fund-hero min-h-[75svh] flex flex-col items-center justify-center text-center relative px-[var(--pad)] pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-12 sm:pb-16 bg-white"
        aria-label="SS Value Plus Fund Hero"
      >
        <div className="w-full max-w-[1020px] flex flex-col items-center justify-center">
          <p className="fund-hero-label font-sans text-[11px] sm:text-[13px] font-medium tracking-[0.22em] uppercase text-black mb-6 sm:mb-8">
            SS VALUE PLUS FUND
          </p>

          <h1 className="fund-hero-title font-serif text-[clamp(42px,7.5vw,104px)] font-normal leading-[0.98] tracking-[-0.04em] text-black m-0 max-w-[940px]">
            <span className="block overflow-hidden py-[0.04em]">
              <span className="fund-hero-line block">Built for investors</span>
            </span>
            <span className="block overflow-hidden py-[0.04em]">
              <span className="fund-hero-line block">who think in years.</span>
            </span>
          </h1>

          <p className="fund-hero-supporting font-sans text-[clamp(15px,1.25vw,17.5px)] leading-[1.65] font-normal text-black/80 max-w-[580px] mt-7 sm:mt-10">
            A research-led investment fund focused on finding value in Indian small- and mid-cap businesses.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — ABOUT OUR PRODUCT
          Directly below hero. Two-column editorial layout on desktop.
          Left: Heading and approved paragraphs.
          Right: Clean info rows separated by thin black dividers.
          ========================================================================= */}
      <section
        className="fund-product bg-white text-black px-[var(--pad)] py-[clamp(4.5rem,8.5vw,7.5rem)]"
        aria-label="About our product"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
            {/* Left column: Approved editorial copy */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="product-label font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 block mb-4 sm:mb-6">
                ABOUT OUR PRODUCT
              </span>

              <h2 className="product-heading font-serif text-[clamp(34px,5vw,66px)] font-normal leading-[1.04] tracking-[-0.035em] text-black m-0 mb-8 sm:mb-10">
                <span className="block">Focused ideas.</span>
                <span className="block">Measured exposure.</span>
                <span className="block">Long-term thinking.</span>
              </h2>

              <div className="product-paragraphs space-y-5 sm:space-y-6 max-w-[620px]">
                <p className="product-p font-sans text-[clamp(15px,1.2vw,17px)] leading-[1.72] font-normal text-black/75 m-0">
                  SS Value Plus Fund focuses on small- and mid-cap companies through fundamentally driven investment ideas.
                </p>
                <p className="product-p font-sans text-[clamp(15px,1.2vw,17px)] leading-[1.72] font-normal text-black/75 m-0">
                  We typically pursue the second- or third-largest players within a sector when they are available at a significant discount to the market leader.
                </p>
                <p className="product-p font-sans text-[clamp(15px,1.2vw,17px)] leading-[1.72] font-normal text-black/75 m-0">
                  From a risk-management perspective, exposure to any single stock is restricted to less than 10% of the portfolio. Through a typical holding period of three to five years, the portfolio endeavours to generate alpha and create long-term wealth.
                </p>
              </div>
            </div>

            {/* Right column: Clean information rows */}
            <div className="lg:col-span-5 flex flex-col w-full pt-4 lg:pt-2">
              <div className="product-info-list flex flex-col w-full">
                {PRODUCT_INFO.map((item, idx, arr) => (
                  <div
                    key={item.label}
                    className="product-info-row relative py-5 sm:py-6"
                  >
                    {/* Top divider */}
                    <div
                      className="product-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="product-info-content">
                      <span className="font-sans text-[11px] sm:text-[12px] font-medium tracking-[0.16em] uppercase text-black/60 block">
                        {item.label}
                      </span>
                      <span
                        className={`font-serif text-[clamp(22px,2.3vw,32px)] font-normal text-black leading-[1.2] mt-1.5 sm:mt-2 block ${
                          item.nowrap ? "whitespace-nowrap" : ""
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>

                    {/* Bottom divider for the last row */}
                    {idx === arr.length - 1 && (
                      <div
                        className="product-divider absolute bottom-0 inset-x-0 h-[1px]"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — CLOSING TRANSITION
          Compact closing section leading to /approach with thin top divider.
          ========================================================================= */}
      <section
        className="fund-closing bg-white text-black px-[var(--pad)] py-[clamp(4.5rem,8vw,7.5rem)] border-t"
        style={{ borderColor: "rgba(0, 0, 0, 0.18)" }}
        aria-label="Closing Transition"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col items-start">
          <h2 className="closing-heading font-serif text-[clamp(34px,5vw,68px)] font-normal leading-[1.04] tracking-[-0.035em] text-black m-0">
            See how conviction
            <br />
            becomes a process.
          </h2>

          <p className="closing-supporting font-sans text-[clamp(15px,1.2vw,17.5px)] leading-[1.65] font-normal text-black/75 max-w-[560px] mt-6 sm:mt-8">
            Explore how investment ideas are researched, questioned and developed over time.
          </p>

          <a
            href="/approach"
            onClick={handleApproachClick}
            className="closing-link inline-flex items-center gap-2 mt-8 sm:mt-10 font-sans text-[15px] sm:text-[16px] font-medium text-black border-b border-black/35 pb-1 hover:border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs"
          >
            <span>Discover our approach</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
