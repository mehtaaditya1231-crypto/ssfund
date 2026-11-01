"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  // ── Existing entrance-animation refs ──────────────────────────────────────
  const labelRef     = useRef<HTMLParagraphElement>(null);
  const line1Ref     = useRef<HTMLSpanElement>(null);
  const line2Ref     = useRef<HTMLSpanElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);

  // ── Background / parallax refs ────────────────────────────────────────────
  const heroRef        = useRef<HTMLElement>(null);
  const bgImgRef       = useRef<HTMLImageElement>(null);
  const copperPathRef  = useRef<SVGPathElement>(null);
  const ivoryLayer1Ref = useRef<SVGGElement>(null);
  const ivoryLayer2Ref = useRef<SVGGElement>(null);
  const ivoryLayer3Ref = useRef<SVGGElement>(null);
  const copperGroupRef = useRef<SVGGElement>(null);

  // ── Existing entrance animations ─────────────────────────────────────────
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (isReduced) {
      if (labelRef.current)      gsap.set(labelRef.current,      { opacity: 1, y: 0 });
      if (line1Ref.current)      gsap.set(line1Ref.current,      { opacity: 1, y: 0 });
      if (line2Ref.current)      gsap.set(line2Ref.current,      { opacity: 1, y: 0 });
      if (supportingRef.current) gsap.set(supportingRef.current, { opacity: 1, y: 0 });
      // Show copper line immediately for reduced-motion users
      if (copperPathRef.current) {
        const len = copperPathRef.current.getTotalLength();
        gsap.set(copperPathRef.current, { strokeDasharray: len, strokeDashoffset: 0 });
      }
      return;
    }

    gsap.set(labelRef.current,      { opacity: 0, y: 8 });
    gsap.set([line1Ref.current, line2Ref.current], { opacity: 0, y: "105%" });
    gsap.set(supportingRef.current, { opacity: 0, y: 12 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(labelRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
      .to(line1Ref.current, { opacity: 1, y: "0%", duration: 0.85, ease: "power3.out" }, "-=0.25")
      .to(line2Ref.current, { opacity: 1, y: "0%", duration: 0.85, ease: "power3.out" }, "-=0.6")
      .to(supportingRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.4");

    return () => { tl.kill(); };
  }, []);

  // ── Background animations + parallax ─────────────────────────────────────
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      // 1. Copper line draw-on
      if (copperPathRef.current) {
        const len = copperPathRef.current.getTotalLength();
        gsap.set(copperPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        if (!isReduced) {
          gsap.to(copperPathRef.current, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: "power2.inOut",
            delay: 0.3,
          });
        } else {
          gsap.set(copperPathRef.current, { strokeDashoffset: 0 });
        }
      }

      if (isReduced) return; // No motion below this point for reduced-motion

      // 2. Background drift
      if (bgImgRef.current) {
        gsap.to(bgImgRef.current, {
          scale: 1.045,
          x: "-0.6%",
          y: "-0.3%",
          duration: 21,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "center center",
        });
      }

      // 3. Ivory contour parallax floats
      if (ivoryLayer1Ref.current) {
        gsap.to(ivoryLayer1Ref.current, { x: 6, y: -2, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
      if (ivoryLayer2Ref.current) {
        gsap.to(ivoryLayer2Ref.current, { x: -4, y: 0, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
      if (ivoryLayer3Ref.current) {
        gsap.to(ivoryLayer3Ref.current, { x: 5, y: -1.5, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }

      // 4. Pointer parallax (desktop fine-pointer only)
      const isFinePointer =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (isFinePointer && heroRef.current) {
        const heroEl = heroRef.current;

        const qxIv1 = gsap.quickTo(ivoryLayer1Ref.current, "x", { duration: 1.0, ease: "power1.out" });
        const qyIv1 = gsap.quickTo(ivoryLayer1Ref.current, "y", { duration: 1.0, ease: "power1.out" });
        const qxIv2 = gsap.quickTo(ivoryLayer2Ref.current, "x", { duration: 1.2, ease: "power1.out" });
        const qyIv2 = gsap.quickTo(ivoryLayer2Ref.current, "y", { duration: 1.2, ease: "power1.out" });
        const qxIv3 = gsap.quickTo(ivoryLayer3Ref.current, "x", { duration: 0.9, ease: "power1.out" });
        const qyIv3 = gsap.quickTo(ivoryLayer3Ref.current, "y", { duration: 0.9, ease: "power1.out" });
        const qxCu  = gsap.quickTo(copperGroupRef.current, "x", { duration: 1.1, ease: "power1.out" });
        const qyCu  = gsap.quickTo(copperGroupRef.current, "y", { duration: 1.1, ease: "power1.out" });
        const qxBg  = gsap.quickTo(bgImgRef.current, "x", { duration: 1.8, ease: "power1.out" });
        const qyBg  = gsap.quickTo(bgImgRef.current, "y", { duration: 1.8, ease: "power1.out" });

        const onMove = (e: MouseEvent) => {
          const rect = heroEl.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
          const ny = (e.clientY - rect.top)  / rect.height - 0.5;

          qxIv1(nx * 3);   qyIv1(ny * 3);
          qxIv2(nx * 6);   qyIv2(ny * 6);
          qxIv3(nx * 4);   qyIv3(ny * 4);
          qxCu(nx * -4);   qyCu(ny * -3);   // copper moves opposite
          qxBg(nx * -8);   qyBg(ny * -6);   // bg moves opposite (depth)
        };

        const onLeave = () => {
          qxIv1(0); qyIv1(0);
          qxIv2(0); qyIv2(0);
          qxIv3(0); qyIv3(0);
          qxCu(0);  qyCu(0);
          qxBg(0);  qyBg(0);
        };

        heroEl.addEventListener("mousemove", onMove);
        heroEl.addEventListener("mouseleave", onLeave);

        return () => {
          heroEl.removeEventListener("mousemove", onMove);
          heroEl.removeEventListener("mouseleave", onLeave);
        };
      }
    }, heroRef);

    return () => { ctx.revert(); };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero"
      data-section="01"
      aria-label="Sneh Sagar Wealth Management LLP Hero"
    >
      {/* ── Background image layer ──────────────────────────────────────── */}
      <div className="hero-bg-layer" aria-hidden="true">
        <img
          ref={bgImgRef}
          src="/assets/sneh-sagar-hero-landscape.jpg"
          alt=""
          role="presentation"
          draggable={false}
          className="hero-bg-img"
        />
      </div>

      {/* ── Very subtle warm overlay for text contrast ───────────────────── */}
      <div className="hero-bg-overlay" aria-hidden="true" />

      {/* ── SVG decorative contour + copper line ─────────────────────────── */}
      <svg
        aria-hidden="true"
        className="hero-svg-overlay"
        viewBox="0 0 1600 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Ivory contour lines (ambient float layers) */}
        <g ref={ivoryLayer1Ref} style={{ willChange: "transform" }}>
          <path
            d="M -50 350 C 400 330 800 360 1200 310 L 1660 290"
            fill="none"
            stroke="rgba(245,241,232,0.14)"
            strokeWidth="1.4"
          />
        </g>
        <g ref={ivoryLayer2Ref} style={{ willChange: "transform" }}>
          <path
            d="M -50 410 C 350 395 700 420 1000 380 C 1200 360 1400 370 1660 350"
            fill="none"
            stroke="rgba(245,241,232,0.11)"
            strokeWidth="1.2"
          />
          <path
            d="M -50 470 C 300 455 600 475 950 445 C 1200 425 1420 440 1660 420"
            fill="none"
            stroke="rgba(245,241,232,0.09)"
            strokeWidth="1.0"
          />
        </g>
        <g ref={ivoryLayer3Ref} style={{ willChange: "transform" }}>
          <path
            d="M -50 520 C 400 505 750 530 1100 500 C 1300 485 1500 495 1660 480"
            fill="none"
            stroke="rgba(245,241,232,0.08)"
            strokeWidth="1.0"
          />
        </g>

        {/* Copper curve — draw-on animation */}
        <g ref={copperGroupRef} style={{ willChange: "transform" }}>
          <path
            ref={copperPathRef}
            d="M -20 500 C 200 480 450 440 700 390 C 900 352 1150 310 1400 270 L 1640 240"
            fill="none"
            stroke="#B87332"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* ── Fine-grain texture overlay ────────────────────────────────────── */}
      <div className="hero-grain" aria-hidden="true" />

      {/* ── Existing hero content (unchanged) ────────────────────────────── */}
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
