import React, { useEffect, useRef } from "react";

export default function QuoteSection() {
  const quoteRef = useRef<HTMLElement>(null);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);
  const citeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const q = quoteRef.current;
    const box = q?.querySelector<HTMLElement>(".quote-inner");

    // Scroll listener for quote parallax
    const onScroll = () => {
      if (q && box) {
        const r = q.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height * 0.35)));
        box.style.setProperty("--quote-scale", (0.93 + p * 0.07).toFixed(3));
        box.style.setProperty("--quote-mark", `${(p - 0.5) * -45}px`);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Quote assembly animation
    const bq = blockquoteRef.current;
    let quoteIO: IntersectionObserver | null = null;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (bq && !bq.dataset.processed) {
      bq.dataset.processed = "true";
      const text = bq.textContent || "";
      const words = text.trim().split(/\s+/);
      bq.innerHTML = words.map((w) => `<span class="quote-word">${w}&nbsp;</span>`).join("");

      quoteIO = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            const wordEls = bq.querySelectorAll(".quote-word");
            wordEls.forEach((w, i) => {
              const t = setTimeout(() => w.classList.add("assembled"), i * 42);
              timeouts.push(t);
            });
            const citeT = setTimeout(() => {
              if (citeRef.current) citeRef.current.classList.add("assembled");
            }, words.length * 42);
            timeouts.push(citeT);
            quoteIO?.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      quoteIO.observe(bq);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      quoteIO?.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section ref={quoteRef} className="quote" data-section="04">
      <div className="quote-inner reveal">
        <blockquote ref={blockquoteRef}>
          Our edge is not predicting every turn. It is knowing what we own, why we own it, and when patience deserves to be rewarded.
        </blockquote>
        <cite ref={citeRef}>Sneh Sagar Wealth Management LLP</cite>
      </div>
    </section>
  );
}
