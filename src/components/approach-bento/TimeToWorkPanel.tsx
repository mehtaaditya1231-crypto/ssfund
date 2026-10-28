import React from "react";

interface TimeToWorkPanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function TimeToWorkPanel({
  className = "",
  isTriggered = false,
}: TimeToWorkPanelProps) {
  // Rising curve path
  const curvePath = "M 240,145 C 330,142 420,132 500,110 C 550,92 578,74 600,58";

  return (
    <article
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-500 ease-out border border-[rgba(245,241,232,0.16)] bg-gradient-to-b from-[#0d2648]/85 via-[#081F3C]/95 to-[#061830] hover:border-[rgba(245,241,232,0.3)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_24px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between ${className}`}
    >
      {/* Background ambient warm glow */}
      <div
        className="pointer-events-none absolute right-24 top-12 w-48 h-48 rounded-full bg-[#B87332]/12 blur-[50px] transition-opacity duration-500 group-hover:opacity-100 opacity-60"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 max-w-[380px]">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/90 font-medium">
          TIME TO WORK
        </span>
        <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#F5F1E8]/70 font-normal">
          When the thesis remains intact, patience can become an advantage. We give strong businesses time to compound.
        </p>
      </div>

      {/* Timeline & Compounding Curve Visual */}
      <div className="relative w-full mt-4 sm:mt-6 overflow-hidden">
        <svg
          viewBox="0 0 680 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible select-none"
          aria-label="Timeline from Today to Year 5 showing thesis remaining intact through patience"
          role="img"
        >
          <defs>
            <linearGradient id="timeCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A4F1D" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#B87332" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#E5A968" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFF0D6" stopOpacity="1" />
            </linearGradient>

            <filter id="timeDotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Baseline horizontal rule */}
          <line
            x1="200"
            y1="145"
            x2="630"
            y2="145"
            stroke="rgba(245, 241, 232, 0.15)"
            strokeWidth="1"
            className={`transition-all duration-700 ease-out ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Vertical dashed guide lines at milestone years */}
          <g opacity="0.35">
            <line
              x1="360"
              y1="138"
              x2="360"
              y2="145"
              stroke="rgba(245, 241, 232, 0.3)"
              strokeDasharray="2 2"
            />
            <line
              x1="480"
              y1="116"
              x2="480"
              y2="145"
              stroke="rgba(245, 241, 232, 0.3)"
              strokeDasharray="2 2"
            />
            <line
              x1="600"
              y1="64"
              x2="600"
              y2="145"
              stroke="rgba(229, 169, 104, 0.4)"
              strokeDasharray="2 2"
            />
          </g>

          {/* Rising copper curve */}
          <path
            d={curvePath}
            stroke="url(#timeCurveGrad)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out delay-200 group-hover:brightness-110 ${
              isTriggered
                ? "[stroke-dasharray:450] [stroke-dashoffset:0]"
                : "[stroke-dasharray:450] [stroke-dashoffset:450]"
            }`}
          />

          {/* Milestone Dots & Labels on Baseline */}
          <g
            className={`transition-all duration-700 ease-out delay-300 ${
              isTriggered ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* TODAY */}
            <circle cx="240" cy="145" r="3" fill="#F5F1E8" />
            <text
              x="240"
              y="166"
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              textAnchor="middle"
              className="select-none font-sans"
              opacity="0.8"
            >
              TODAY
            </text>

            {/* YEAR 1 */}
            <circle cx="360" cy="145" r="2.5" fill="rgba(245, 241, 232, 0.7)" />
            <text
              x="360"
              y="166"
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              textAnchor="middle"
              className="select-none font-sans"
              opacity="0.8"
            >
              YEAR 1
            </text>

            {/* YEAR 3 */}
            <circle cx="480" cy="145" r="2.5" fill="rgba(245, 241, 232, 0.7)" />
            <text
              x="480"
              y="166"
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              textAnchor="middle"
              className="select-none font-sans"
              opacity="0.8"
            >
              YEAR 3
            </text>

            {/* YEAR 5 */}
            <circle cx="600" cy="145" r="3" fill="#E5A968" />
            <text
              x="600"
              y="166"
              fill="#F5F1E8"
              fontSize="9"
              fontWeight="600"
              letterSpacing="0.18em"
              textAnchor="middle"
              className="select-none font-sans"
              opacity="0.8"
            >
              YEAR 5
            </text>
          </g>

          {/* Endpoint: THESIS REMAINS INTACT */}
          <g
            className={`transition-all duration-700 ease-out delay-500 ${
              isTriggered ? "opacity-100 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ transformOrigin: "600px 58px" }}
          >
            {/* Glowing endpoint dot */}
            <circle
              cx="600"
              cy="58"
              r="12"
              fill="#B87332"
              opacity="0.3"
              filter="url(#timeDotGlow)"
              className="animate-pulse"
            />
            <circle cx="600" cy="58" r="5" fill="#E5A968" opacity="0.8" />
            <circle cx="600" cy="58" r="2.5" fill="#FFFFFF" />

            {/* Label above endpoint */}
            <text
              x="590"
              y="32"
              fill="#F5F1E8"
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.2em"
              textAnchor="middle"
              className="select-none font-sans"
            >
              THESIS REMAINS INTACT
            </text>
          </g>
        </svg>
      </div>
    </article>
  );
}
