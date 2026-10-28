import React from "react";

interface RiskDisciplinePanelProps {
  className?: string;
  isTriggered?: boolean;
}

export default function RiskDisciplinePanel({
  className = "",
  isTriggered = false,
}: RiskDisciplinePanelProps) {
  const segments = Array.from({ length: 10 });

  return (
    <article
      className={`group relative rounded-[22px] md:rounded-[24px] p-6 sm:p-7 md:p-8 overflow-hidden transition-all duration-500 ease-out border border-[rgba(229,169,104,0.35)] bg-gradient-to-br from-[#8A4F1D] via-[#633510] to-[#3A1B06] hover:border-[rgba(229,169,104,0.6)] hover:-translate-y-[3px] shadow-[inset_0_1px_1px_rgba(255,230,200,0.3),inset_0_0_30px_rgba(184,115,50,0.25),0_18px_40px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_2px_rgba(255,240,220,0.45),inset_0_0_40px_rgba(229,169,104,0.35),0_24px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between ${className}`}
    >
      {/* Top warm radial illumination */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rounded-full bg-[#E5A968]/20 blur-[50px] transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-36 h-36 rounded-full bg-[#B87332]/25 blur-[40px]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10">
        <span className="eyebrow inline-block text-[11px] tracking-[0.22em] text-[#F5F1E8]/95 font-medium">
          RISK DISCIPLINE
        </span>
        <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-[#F5F1E8]/85 font-normal">
          We restrict exposure to any single stock to less than 10% of the portfolio.
        </p>
      </div>

      {/* Dominant Value Display & Allocation Strip */}
      <div className="relative z-10 mt-6 sm:mt-8">
        {/* Masked reveal of <10% */}
        <div className="overflow-hidden">
          <div
            className={`font-serif text-[clamp(44px,4.5vw,58px)] leading-none text-[#F5F1E8] tracking-tight transition-transform duration-700 ease-out ${
              isTriggered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            &lt;10%
          </div>
        </div>

        {/* Supporting Label */}
        <div
          className={`mt-2 text-[10px] tracking-[0.24em] text-[#F5F1E8]/75 uppercase font-medium transition-opacity duration-700 delay-200 ${
            isTriggered ? "opacity-100" : "opacity-0"
          }`}
        >
          SINGLE-STOCK EXPOSURE
        </div>

        {/* Ten-Segment Allocation Strip */}
        <div
          className="mt-4 flex items-center gap-1.5 sm:gap-2"
          role="img"
          aria-label="Ten-segment allocation bar showing one active segment representing less than 10 percent single-stock exposure"
        >
          {segments.map((_, index) => {
            const isFirst = index === 0;

            return (
              <div
                key={index}
                className={`h-7 sm:h-8 flex-1 rounded-[4px] transition-all duration-500 ease-out ${
                  isFirst
                    ? "bg-gradient-to-b from-[#FFF5E6] to-[#E5A968] shadow-[0_0_14px_rgba(255,220,180,0.85)] border border-white/60"
                    : "border border-[rgba(245,241,232,0.22)] bg-[#05162B]/50 backdrop-blur-xs"
                } ${
                  isTriggered
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                style={{
                  transitionDelay: `${300 + index * 40}ms`,
                }}
              />
            );
          })}
        </div>
      </div>
    </article>
  );
}
