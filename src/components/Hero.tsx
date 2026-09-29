"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const labelRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (isReduced) {
      if (labelRef.current) gsap.set(labelRef.current, { opacity: 1, y: 0 });
      if (line1Ref.current) gsap.set(line1Ref.current, { opacity: 1, y: 0 });
      if (line2Ref.current) gsap.set(line2Ref.current, { opacity: 1, y: 0 });
      if (supportingRef.current) gsap.set(supportingRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Set initial states for entrance animation
    gsap.set(labelRef.current, { opacity: 0, y: 8 });
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: "105%" });
    gsap.set(supportingRef.current, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ delay: 0.1 });

    // 1. The small label fades in
    tl.to(labelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    })
      // 2. The first heading line rises gently from behind a clipping mask
      .to(
        line1Ref.current,
        {
          opacity: 1,
          y: "0%",
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.25"
      )
      // 3. The second heading line follows with a slight delay
      .to(
        line2Ref.current,
        {
          opacity: 1,
          y: "0%",
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.6"
      )
      // 4. Supporting text fades in last
      .to(
        supportingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section className="hero" data-section="01" aria-label="SS Value Plus Fund Hero">
      <div className="hero-content">
        <p className="hero-label" ref={labelRef}>
          VALUE INVESTING · INDIA FOCUSED
        </p>
        <h1 className="hero-title serif">
          <span className="hero-line-mask">
            <span className="hero-line" ref={line1Ref}>
              Built on conviction.
            </span>
          </span>
          <span className="hero-line-mask">
            <span className="hero-line" ref={line2Ref}>
              Focused on value.
            </span>
          </span>
        </h1>
        <p className="hero-supporting" ref={supportingRef}>
          We invest in undervalued small- and mid-cap businesses with strong fundamentals and long-term growth potential.
        </p>
      </div>
    </section>
  );
}
