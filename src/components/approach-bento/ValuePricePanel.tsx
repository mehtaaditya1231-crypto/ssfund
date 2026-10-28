import React, { useRef } from "react";

interface ValuePricePanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function ValuePricePanel({
  className = "",
  isTriggered = false,
}: ValuePricePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // SVG Coordinates for exact visual parity with creative target
  // Intrinsic Value Curve path
  const intrinsicPath =
    "M 40,240 C 160,240 250,228 380,196 C 500,162 600,118 710,78 C 790,50 850,56 920,84 C 950,96 970,106 980,112";

  // Market Price Curve path
  const marketPath =
    "M 40,265 C 160,270 260,260 380,245 C 500,230 580,220 680,214 C 760,208 830,202 885,198 C 930,194 960,185 980,180";

  // Enclosed area between the two curves
  const ribbonPath =
    "M 40,240 C 160,240 250,228 380,196 C 500,162 600,118 710,78 C 790,50 850,56 920,84 C 950,96 970,106 980,112 L 980,180 C 960,185 930,194 885,198 C 830,202 760,208 680,214 C 580,220 500,230 380,245 C 260,260 160,270 40,265 Z";

  return (
    <article
      ref={panelRef}
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-8 md:p-9 overflow-hidden transition-all duration-500 ease-out border border-[rgba(245,241,232,0.16)] bg-gradient-to-b from-[#0e274a]/85 via-[#081F3C]/95 to-[#061830] hover:border-[rgba(245,241,232,0.3)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_24px_50px_rgba(0,0,0,0.45)] ${className}`}
    >
      {/* Background ambient luminous glow */}
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 -translate-y-1/2 w-[550px] h-[220px] rounded-full bg-[#B87332]/12 blur-[90px] transition-opacity duration-700 group-hover:opacity-100 opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-16 top-1/3 w-[300px] h-[150px] rounded-full bg-[#F5F1E8]/6 blur-[70px]"
        aria-hidden="true"
      />

      {/* Top Left Header Copy */}
      <div className="relative z-10 max-w-[420px]">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/90 font-medium">
          VALUE / PRICE
        </span>
        <p className="mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-[#F5F1E8]/70 font-normal">
          We seek businesses whose intrinsic value may be meaningfully higher than their current market price.
        </p>
      </div>

      {/* Diagram Canvas */}
      <div className="relative w-full mt-4 sm:mt-6 overflow-hidden">
        <svg
          viewBox="0 0 1000 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible select-none"
          aria-label="Conceptual diagram showing Intrinsic Value higher than Market Price, creating a Margin of Safety"
          role="img"
        >
          <defs>
            {/* Illuminated gap gradient */}
            <linearGradient id="marginGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B87332" stopOpacity="0.05" />
              <stop offset="30%" stopColor="#B87332" stopOpacity="0.22" />
              <stop offset="65%" stopColor="#D48D48" stopOpacity="0.38" />
              <stop offset="82%" stopColor="#E5A968" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#B87332" stopOpacity="0.08" />
            </linearGradient>

            {/* Soft inner glow gradient */}
            <linearGradient id="glowRibbonGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#D48D48" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B87332" stopOpacity="0.1" />
            </linearGradient>

            {/* Copper stroke gradient */}
            <linearGradient id="copperLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A4F1D" />
              <stop offset="40%" stopColor="#B87332" />
              <stop offset="80%" stopColor="#E5A968" />
              <stop offset="100%" stopColor="#D48D48" />
            </linearGradient>

            {/* Ivory stroke gradient */}
            <linearGradient id="ivoryLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F5F1E8" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#F5F1E8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Margin ribbon blur */}
            <filter id="ribbonBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          {/* Reference baseline grids */}
          <g opacity="0.4" className="motion-safe:transition-opacity duration-700">
            <line
              x1="40"
              y1="130"
              x2="980"
              y2="130"
              stroke="rgba(245, 241, 232, 0.08)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="195"
              x2="980"
              y2="195"
              stroke="rgba(245, 241, 232, 0.08)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
            <line
              x1="40"
              y1="255"
              x2="980"
              y2="255"
              stroke="rgba(245, 241, 232, 0.08)"
              strokeDasharray="4 6"
              strokeWidth="1"
            />
          </g>

          {/* Layer 1: Illuminated "Margin of Safety" Blurred Underlay */}
          <path
            d={ribbonPath}
            fill="url(#marginGrad)"
            filter="url(#ribbonBlur)"
            className={`transition-opacity duration-1000 ease-out ${
              isTriggered ? "opacity-90" : "opacity-0"
            }`}
          />

          {/* Layer 2: Illuminated "Margin of Safety" Sharp Shaded Ribbon */}
          <path
            d={ribbonPath}
            fill="url(#marginGrad)"
            className={`transition-opacity duration-1000 ease-out delay-200 ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Layer 3: Secondary highlight ribbon within the margin */}
          <path
            d="M 280,215 C 440,190 560,150 670,115 C 750,90 810,88 885,110 L 885,198 C 830,202 760,208 680,214 C 580,220 500,230 380,245 Z"
            fill="url(#glowRibbonGrad)"
            opacity="0.4"
            className={`transition-opacity duration-1000 ease-out delay-300 ${
              isTriggered ? "opacity-40" : "opacity-0"
            }`}
          />

          {/* Layer 4: Market Price Curve (Copper) */}
          <path
            d={marketPath}
            stroke="url(#copperLineGrad)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out delay-150 group-hover:brightness-110 ${
              isTriggered
                ? "[stroke-dasharray:1100] [stroke-dashoffset:0]"
                : "[stroke-dasharray:1100] [stroke-dashoffset:1100]"
            }`}
          />

          {/* Layer 5: Intrinsic Value Curve (Warm Ivory) */}
          <path
            d={intrinsicPath}
            stroke="url(#ivoryLineGrad)"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            filter="url(#subtleGlow)"
            className={`transition-all duration-1000 ease-out group-hover:brightness-110 ${
              isTriggered
                ? "[stroke-dasharray:1100] [stroke-dashoffset:0]"
                : "[stroke-dasharray:1100] [stroke-dashoffset:1100]"
            }`}
          />

          {/* Margin of Safety Indicator: Double-headed Arrow & Text */}
          <g
            className={`transition-all duration-700 ease-out delay-500 ${
              isTriggered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {/* Label "MARGIN OF SAFETY" */}
            <text
              x="735"
              y="152"
              fill="#F5F1E8"
              fontSize="11"
              fontWeight="500"
              letterSpacing="0.22em"
              textAnchor="end"
              className="select-none font-sans"
              opacity="0.95"
            >
              MARGIN OF SAFETY
            </text>

            {/* Vertical Double-Headed Arrow */}
            <line
              x1="760"
              y1="98"
              x2="760"
              y2="202"
              stroke="#F5F1E8"
              strokeWidth="1.3"
              strokeDasharray="2 2"
              opacity="0.85"
            />
            {/* Top arrow tip */}
            <path
              d="M 756,105 L 760,97 L 764,105"
              stroke="#F5F1E8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Bottom arrow tip */}
            <path
              d="M 756,195 L 760,203 L 764,195"
              stroke="#F5F1E8"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>

          {/* Right Endpoint Annotations */}
          <g
            className={`transition-all duration-700 ease-out delay-600 ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* INTRINSIC VALUE Endpoint */}
            {/* Vertical guide from curve up to label */}
            <line
              x1="875"
              y1="70"
              x2="875"
              y2="105"
              stroke="rgba(245, 241, 232, 0.4)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            {/* Dot on intrinsic curve at x=875, y=70 */}
            <circle cx="875" cy="70" r="3.5" fill="#F5F1E8" />
            <circle
              cx="875"
              cy="70"
              r="7"
              stroke="#F5F1E8"
              strokeWidth="1"
              opacity="0.4"
              className="animate-pulse"
            />
            {/* Label text */}
            <text
              x="888"
              y="74"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.18em"
              className="select-none font-sans"
            >
              INTRINSIC VALUE
            </text>

            {/* MARKET PRICE Endpoint */}
            {/* Vertical guide from curve down to label */}
            <line
              x1="875"
              y1="198"
              x2="875"
              y2="232"
              stroke="rgba(184, 115, 50, 0.5)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
            {/* Dot on market curve at x=875, y=198 */}
            <circle cx="875" cy="198" r="3.5" fill="#E5A968" />
            <circle
              cx="875"
              cy="198"
              r="7"
              stroke="#B87332"
              strokeWidth="1"
              opacity="0.5"
            />
            {/* Label text */}
            <text
              x="888"
              y="235"
              fill="#E5A968"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.18em"
              className="select-none font-sans"
            >
              MARKET PRICE
            </text>
          </g>
        </svg>
      </div>
    </article>
  );
}
