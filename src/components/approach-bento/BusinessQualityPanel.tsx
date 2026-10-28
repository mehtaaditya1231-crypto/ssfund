import React, { useState } from "react";

interface BusinessQualityPanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function BusinessQualityPanel({
  className = "",
  isTriggered = false,
}: BusinessQualityPanelProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Helper to convert polar coordinates (degrees, radius) to Cartesian (x, y)
  // 180deg is left, 90deg is top, 0deg is right
  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx - r * Math.cos(rad),
      y: cy - r * Math.sin(rad),
    };
  };

  // Helper to create an annular segment (thick curved arc slice)
  const describeArcSegment = (
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number
  ) => {
    const p1 = polarToCartesian(cx, cy, rOuter, startAngle);
    const p2 = polarToCartesian(cx, cy, rOuter, endAngle);
    const p3 = polarToCartesian(cx, cy, rInner, endAngle);
    const p4 = polarToCartesian(cx, cy, rInner, startAngle);

    return `M ${p1.x},${p1.y} A ${rOuter},${rOuter} 0 0,1 ${p2.x},${p2.y} L ${p3.x},${p3.y} A ${rInner},${rInner} 0 0,0 ${p4.x},${p4.y} Z`;
  };

  // Helper to create a single arc curve for SVG textPath
  const describeTextArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    const p1 = polarToCartesian(cx, cy, r, startAngle);
    const p2 = polarToCartesian(cx, cy, r, endAngle);
    return `M ${p1.x},${p1.y} A ${r},${r} 0 0,1 ${p2.x},${p2.y}`;
  };

  const cx = 200;
  const cy = 215;
  const rOuter = 165;
  const rInner = 112;
  const rText = 138;

  // Segment angles
  // Economics: 178° down to 123°
  // Moat: 119° down to 61°
  // Resilience: 57° down to 2°
  const pathEconomics = describeArcSegment(cx, cy, rOuter, rInner, 177, 124);
  const pathMoat = describeArcSegment(cx, cy, rOuter, rInner, 120, 60);
  const pathResilience = describeArcSegment(cx, cy, rOuter, rInner, 56, 3);

  const textArcEconomics = describeTextArc(cx, cy, rText, 175, 126);
  const textArcMoat = describeTextArc(cx, cy, rText, 118, 62);
  const textArcResilience = describeTextArc(cx, cy, rText, 54, 5);

  return (
    <article
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-500 ease-out border border-[rgba(245,241,232,0.16)] bg-gradient-to-b from-[#0d2648]/85 via-[#081F3C]/95 to-[#061830] hover:border-[rgba(245,241,232,0.3)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_24px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between ${className}`}
    >
      {/* Top Header */}
      <div className="relative z-10">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/90 font-medium">
          BUSINESS QUALITY
        </span>
        <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#F5F1E8]/70 font-normal">
          We begin with the economics of the business: how it creates value, where it is defensible and what could change.
        </p>
      </div>

      {/* Semicircular Segmented Gauge Visual */}
      <div className="relative w-full mt-4 flex items-center justify-center">
        <svg
          viewBox="0 0 400 235"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[340px] h-auto overflow-visible select-none"
          aria-label="Semicircular segmented gauge with Economics, Moat, and Resilience segments centered on Understand"
          role="img"
        >
          <defs>
            {/* Moat segment copper/bronze gradient */}
            <linearGradient id="moatSegmentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8A4F1D" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#B87332" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#4A2609" stopOpacity="0.85" />
            </linearGradient>

            {/* Standard segment dark navy gradient */}
            <linearGradient id="segmentDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#102D54" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#081F3C" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing dot copper filter */}
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* Hidden text paths */}
            <path id="arcEconomics" d={textArcEconomics} fill="none" />
            <path id="arcMoat" d={textArcMoat} fill="none" />
            <path id="arcResilience" d={textArcResilience} fill="none" />
          </defs>

          {/* Outer track boundary arc (faint guide) */}
          <path
            d="M 20,215 A 180,180 0 0,1 380,215"
            stroke="rgba(245, 241, 232, 0.08)"
            strokeWidth="1"
            strokeDasharray="3 4"
            fill="none"
          />

          {/* Segment 1: ECONOMICS */}
          <g
            onMouseEnter={() => setHoveredSegment("economics")}
            onMouseLeave={() => setHoveredSegment(null)}
            className="cursor-pointer transition-all duration-300"
          >
            <path
              d={pathEconomics}
              fill="url(#segmentDarkGrad)"
              stroke={
                hoveredSegment === "economics"
                  ? "rgba(245, 241, 232, 0.5)"
                  : "rgba(245, 241, 232, 0.2)"
              }
              strokeWidth="1.2"
              className={`transition-all duration-700 ease-out ${
                isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transformOrigin: "200px 215px" }}
            />
            {/* Curved text */}
            <text
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              opacity={hoveredSegment === "economics" ? "1" : "0.85"}
              className={`transition-opacity duration-700 delay-200 ${
                isTriggered ? "opacity-90" : "opacity-0"
              }`}
            >
              <textPath href="#arcEconomics" startOffset="50%" textAnchor="middle">
                ECONOMICS
              </textPath>
            </text>
          </g>

          {/* Segment 2: MOAT (Illuminated Central Anchor) */}
          <g
            onMouseEnter={() => setHoveredSegment("moat")}
            onMouseLeave={() => setHoveredSegment(null)}
            className="cursor-pointer transition-all duration-300"
          >
            <path
              d={pathMoat}
              fill="url(#moatSegmentGrad)"
              stroke={
                hoveredSegment === "moat"
                  ? "rgba(229, 169, 104, 0.8)"
                  : "rgba(184, 115, 50, 0.45)"
              }
              strokeWidth="1.5"
              className={`transition-all duration-700 ease-out delay-150 ${
                isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transformOrigin: "200px 215px" }}
            />
            {/* Curved text */}
            <text
              fill="#F5F1E8"
              fontSize="9.5"
              fontWeight="600"
              letterSpacing="0.22em"
              opacity={hoveredSegment === "moat" ? "1" : "0.95"}
              className={`transition-opacity duration-700 delay-300 ${
                isTriggered ? "opacity-100" : "opacity-0"
              }`}
            >
              <textPath href="#arcMoat" startOffset="50%" textAnchor="middle">
                MOAT
              </textPath>
            </text>

            {/* Glowing copper indicator dot at base of MOAT segment */}
            <circle
              cx="200"
              cy="104"
              r="3.5"
              fill="#E5A968"
              filter="url(#dotGlow)"
              className={`transition-all duration-700 delay-400 ${
                isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{ transformOrigin: "200px 104px" }}
            />
            <circle
              cx="200"
              cy="104"
              r="7"
              stroke="#B87332"
              strokeWidth="1"
              opacity="0.6"
              className="animate-pulse"
            />
          </g>

          {/* Segment 3: RESILIENCE */}
          <g
            onMouseEnter={() => setHoveredSegment("resilience")}
            onMouseLeave={() => setHoveredSegment(null)}
            className="cursor-pointer transition-all duration-300"
          >
            <path
              d={pathResilience}
              fill="url(#segmentDarkGrad)"
              stroke={
                hoveredSegment === "resilience"
                  ? "rgba(245, 241, 232, 0.5)"
                  : "rgba(245, 241, 232, 0.2)"
              }
              strokeWidth="1.2"
              className={`transition-all duration-700 ease-out delay-250 ${
                isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transformOrigin: "200px 215px" }}
            />
            {/* Curved text */}
            <text
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              opacity={hoveredSegment === "resilience" ? "1" : "0.85"}
              className={`transition-opacity duration-700 delay-350 ${
                isTriggered ? "opacity-90" : "opacity-0"
              }`}
            >
              <textPath href="#arcResilience" startOffset="50%" textAnchor="middle">
                RESILIENCE
              </textPath>
            </text>
          </g>

          {/* Inner Central Hub Arc */}
          <path
            d="M 104,215 A 96,96 0 0,1 296,215"
            stroke="rgba(245, 241, 232, 0.25)"
            strokeWidth="1.2"
            fill="rgba(6, 22, 44, 0.6)"
            className={`transition-all duration-700 ease-out delay-400 ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Inner Accent Indicator Dot on inner ring */}
          <circle
            cx="140"
            cy="158"
            r="2"
            fill="#F5F1E8"
            opacity="0.4"
          />
          <circle
            cx="260"
            cy="158"
            r="2"
            fill="#F5F1E8"
            opacity="0.4"
          />

          {/* Center Label: UNDERSTAND */}
          <text
            x="200"
            y="196"
            fill="#F5F1E8"
            fontSize="11"
            fontWeight="500"
            letterSpacing="0.25em"
            textAnchor="middle"
            className={`select-none font-sans transition-all duration-700 ease-out delay-500 ${
              isTriggered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            UNDERSTAND
          </text>
        </svg>
      </div>
    </article>
  );
}
