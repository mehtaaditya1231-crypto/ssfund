import React from "react";

interface CapablePeoplePanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function CapablePeoplePanel({
  className = "",
  isTriggered = false,
}: CapablePeoplePanelProps) {
  // SVG Convergence Paths
  const pathTop = "M 205,35 C 290,35 330,90 395,90";
  const pathMiddle = "M 205,90 L 395,90";
  const pathBottom = "M 205,145 C 290,145 330,90 395,90";

  return (
    <article
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-500 ease-out border border-[rgba(245,241,232,0.16)] bg-gradient-to-b from-[#0d2648]/85 via-[#081F3C]/95 to-[#061830] hover:border-[rgba(245,241,232,0.3)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_24px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between ${className}`}
    >
      {/* Background ambient glow behind convergence node */}
      <div
        className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-[#B87332]/15 blur-[45px] transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative z-10">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/90 font-medium">
          CAPABLE PEOPLE
        </span>
        <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#F5F1E8]/70 font-normal">
          We seek management teams with integrity, intelligent capital allocation and the ambition to build enduring institutions.
        </p>
      </div>

      {/* Visual Convergence Diagram */}
      <div className="relative w-full mt-4 sm:mt-6 overflow-hidden">
        <svg
          viewBox="0 0 540 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible select-none"
          aria-label="Three principles Integrity, Capital Allocation, and Long-Term Ambition converging into an Enduring Business"
          role="img"
        >
          <defs>
            <linearGradient id="peoplePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B87332" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#D48D48" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E5A968" stopOpacity="1" />
            </linearGradient>

            <filter id="nodeGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Inputs: INTEGRITY, CAPITAL ALLOCATION, LONG-TERM AMBITION */}
          <g
            className={`transition-all duration-700 ease-out ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 1. Integrity */}
            <text
              x="192"
              y="39"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.18em"
              textAnchor="end"
              className="select-none font-sans"
              opacity="0.85"
            >
              INTEGRITY
            </text>
            <circle cx="205" cy="35" r="3" fill="#E5A968" />
            <circle cx="205" cy="35" r="6" stroke="#B87332" strokeWidth="1" opacity="0.4" />

            {/* 2. Capital Allocation */}
            <text
              x="192"
              y="94"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.18em"
              textAnchor="end"
              className="select-none font-sans"
              opacity="0.85"
            >
              CAPITAL ALLOCATION
            </text>
            <circle cx="205" cy="90" r="3" fill="#E5A968" />
            <circle cx="205" cy="90" r="6" stroke="#B87332" strokeWidth="1" opacity="0.4" />

            {/* 3. Long-Term Ambition */}
            <text
              x="192"
              y="149"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="500"
              letterSpacing="0.18em"
              textAnchor="end"
              className="select-none font-sans"
              opacity="0.85"
            >
              LONG-TERM AMBITION
            </text>
            <circle cx="205" cy="145" r="3" fill="#E5A968" />
            <circle cx="205" cy="145" r="6" stroke="#B87332" strokeWidth="1" opacity="0.4" />
          </g>

          {/* Converging Bezier Paths */}
          <g>
            {/* Top path */}
            <path
              d={pathTop}
              stroke="url(#peoplePathGrad)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out delay-200 ${
                isTriggered
                  ? "[stroke-dasharray:250] [stroke-dashoffset:0]"
                  : "[stroke-dasharray:250] [stroke-dashoffset:250]"
              }`}
            />

            {/* Middle path */}
            <path
              d={pathMiddle}
              stroke="url(#peoplePathGrad)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out delay-250 ${
                isTriggered
                  ? "[stroke-dasharray:250] [stroke-dashoffset:0]"
                  : "[stroke-dasharray:250] [stroke-dashoffset:250]"
              }`}
            />

            {/* Bottom path */}
            <path
              d={pathBottom}
              stroke="url(#peoplePathGrad)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out delay-200 ${
                isTriggered
                  ? "[stroke-dasharray:250] [stroke-dashoffset:0]"
                  : "[stroke-dasharray:250] [stroke-dashoffset:250]"
              }`}
            />
          </g>

          {/* Convergence Node: ENDURING BUSINESS */}
          <g
            className={`transition-all duration-700 ease-out delay-500 ${
              isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ transformOrigin: "395px 90px" }}
          >
            {/* Outer halo */}
            <circle
              cx="395"
              cy="90"
              r="14"
              fill="#B87332"
              opacity="0.3"
              filter="url(#nodeGlowFilter)"
              className="animate-pulse"
            />
            {/* Middle glow ring */}
            <circle
              cx="395"
              cy="90"
              r="7"
              fill="#E5A968"
              opacity="0.75"
            />
            {/* Core bright dot */}
            <circle
              cx="395"
              cy="90"
              r="3"
              fill="#FFFFFF"
            />

            {/* Target Label: ENDURING BUSINESS */}
            <text
              x="422"
              y="85"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.2em"
              className="select-none font-sans"
            >
              ENDURING
            </text>
            <text
              x="422"
              y="101"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.2em"
              className="select-none font-sans"
            >
              BUSINESS
            </text>
          </g>
        </svg>
      </div>
    </article>
  );
}
