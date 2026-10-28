import React, { useState } from "react";
import { Search, FileText, BarChart3, RotateCcw, ArrowRight } from "lucide-react";

interface ResearchLoopPanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function ResearchLoopPanel({
  className = "",
  isTriggered = false,
}: ResearchLoopPanelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const steps = [
    {
      id: "discover",
      label: "DISCOVER",
      icon: Search,
      desc: "Identify mispriced opportunities",
    },
    {
      id: "understand",
      label: "UNDERSTAND",
      icon: FileText,
      desc: "Deep economic & moat research",
    },
    {
      id: "value",
      label: "VALUE",
      icon: BarChart3,
      desc: "Conservative intrinsic valuation",
    },
    {
      id: "review",
      label: "REVIEW",
      icon: RotateCcw,
      desc: "Continuous thesis validation",
    },
  ];

  return (
    <article
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-500 ease-out border border-[rgba(245,241,232,0.16)] bg-gradient-to-b from-[#0d2648]/85 via-[#081F3C]/95 to-[#061830] hover:border-[rgba(245,241,232,0.3)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_24px_50px_rgba(0,0,0,0.45)] flex flex-col justify-between ${className}`}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute right-12 bottom-8 w-40 h-40 rounded-full bg-[#B87332]/10 blur-[45px] transition-opacity duration-500 group-hover:opacity-100 opacity-50"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 max-w-[360px]">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/90 font-medium">
          RESEARCH LOOP
        </span>
        <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#F5F1E8]/70 font-normal">
          A repeatable process to find, understand and revisit value with discipline.
        </p>
      </div>

      {/* Visual Loop Process */}
      <div className="relative z-10 mt-6 sm:mt-8">
        {/* Horizontal Chain of 4 Steps */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredIndex === index;

            return (
              <React.Fragment key={step.id}>
                {/* Step Node */}
                <div
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-500 ${
                    isTriggered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{
                    transitionDelay: `${200 + index * 100}ms`,
                  }}
                >
                  {/* Circular Icon Container */}
                  <div
                    className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isHovered
                        ? "border-[#E5A968] bg-[#B87332]/25 shadow-[0_0_18px_rgba(229,169,104,0.4)] scale-105"
                        : "border border-[rgba(245,241,232,0.2)] bg-white/[0.03] group-hover:border-[rgba(245,241,232,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={`transition-colors duration-300 ${
                        isHovered ? "text-[#FFF0D6]" : "text-[#F5F1E8]/85"
                      }`}
                      strokeWidth={1.5}
                    />

                    {/* Subtle pulse ring on active hover */}
                    {isHovered && (
                      <span className="absolute inset-0 rounded-full border border-[#E5A968]/40 animate-ping opacity-60" />
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`mt-2.5 text-[9px] sm:text-[9.5px] tracking-[0.2em] uppercase font-semibold transition-colors duration-300 ${
                      isHovered ? "text-[#E5A968]" : "text-[#F5F1E8]/75"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Arrow connector between nodes */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex items-center justify-center pb-5 transition-all duration-500 ${
                      isTriggered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      transitionDelay: `${250 + index * 100}ms`,
                    }}
                  >
                    <ArrowRight
                      size={14}
                      className="text-[#F5F1E8]/35 transition-colors duration-300 group-hover:text-[#F5F1E8]/50"
                      strokeWidth={1.4}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Looping return indicator: curved dashed loop connecting Review back to Discover */}
        <div className="relative mt-3 sm:mt-4 w-full flex items-center justify-center">
          <svg
            viewBox="0 0 360 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[340px] h-6 overflow-visible select-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="loopReturnGrad" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#B87332" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#E5A968" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Curved reconnecting loop path */}
            <path
              d="M 330,6 C 330,24 30,24 30,6"
              stroke="url(#loopReturnGrad)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              fill="none"
              className={`transition-opacity duration-1000 delay-700 ${
                isTriggered ? "opacity-80" : "opacity-0"
              }`}
            />
            {/* Arrowhead pointing back up into Discover (x=30, y=6) */}
            <path
              d="M 26,12 L 30,5 L 34,12"
              stroke="#F5F1E8"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className={`transition-opacity duration-1000 delay-700 ${
                isTriggered ? "opacity-75" : "opacity-0"
              }`}
            />
          </svg>
        </div>
      </div>
    </article>
  );
}
