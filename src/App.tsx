import React, { useEffect } from "react";
import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";
import Hero from "@/components/Hero";

export default function App() {
  useEffect(() => {
    // Check if initial route is /founders or /founders.html
    const path = window.location.pathname;
    if (path.includes("founders")) {
      setTimeout(() => {
        const teamEl = document.getElementById("founders") || document.getElementById("team");
        if (teamEl) {
          teamEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }

    // Scroll listener for quote parallax
    const onScroll = () => {
      const q = document.querySelector<HTMLElement>(".quote");
      const box = document.querySelector<HTMLElement>(".quote-inner");
      if (q && box) {
        const r = q.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height * 0.35)));
        box.style.setProperty("--quote-scale", (0.93 + p * 0.07).toFixed(3));
        box.style.setProperty("--quote-mark", `${(p - 0.5) * -45}px`);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Reveal on scroll observer
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Quote assembly animation
    const quote = document.querySelector<HTMLElement>(".quote blockquote");
    if (quote && !quote.dataset.processed) {
      quote.dataset.processed = "true";
      const text = quote.textContent || "";
      const words = text.trim().split(/\s+/);
      quote.innerHTML = words.map((w) => `<span class="quote-word">${w}&nbsp;</span>`).join("");

      const quoteIO = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            document.querySelectorAll(".quote-word").forEach((w, i) => {
              setTimeout(() => w.classList.add("assembled"), i * 42);
            });
            setTimeout(() => {
              const cite = document.querySelector(".quote cite");
              if (cite) cite.classList.add("assembled");
            }, words.length * 42);
            quoteIO.disconnect();
          }
        },
        { threshold: 0.35 }
      );
      quoteIO.observe(quote);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <ImmersiveFullscreenNav
        agencyName="Sneh Sagar Wealth Management LLP"
        overlayBg="#000000"
        headerOpenColor="#FFFFFF"
        linkColor="#FFFFFF"
        linkHoverColor="#A3A3A3"
        links={[
          { label: "Home", href: "/" },
          { label: "The Fund", href: "/#about" },
          { label: "Approach", href: "/#approach" },
          { label: "Founders", href: "/founders" },
          { label: "Contact", href: "/#contact" },
        ]}
      />

      <main id="top">
        {/* Minimal Black & White Hero Section */}
        <Hero />

        <section className="intro reveal" id="about" data-section="02">
          <div>
            <span className="eyebrow">The fund / 01</span>
            <p className="small-note">
              For investors who believe meaningful outcomes are built through patience, discipline and independent thinking.
            </p>
          </div>
          <h2 className="intro-copy serif">
            We invest in businesses the market may be <em>underestimating today</em>—and stay invested as their true value unfolds.
          </h2>
        </section>

        <section className="philosophy" id="approach" data-section="03">
          <div className="section-head reveal">
            <h2 className="serif">
              A clearer way
              <br />
              of seeing value.
            </h2>
            <p>Our approach is grounded in research, guided by fundamentals and measured over years—not quarters.</p>
          </div>
          <div className="principles">
            <article className="principle reveal">
              <span className="eyebrow">01</span>
              <h3>Understand the business</h3>
              <p>We begin with the economics of the business: how it creates value, where it is defensible and what could change.</p>
            </article>
            <article className="principle reveal">
              <span className="eyebrow">02</span>
              <h3>Back capable people</h3>
              <p>We seek management teams with integrity, intelligent capital allocation and the ambition to build enduring institutions.</p>
            </article>
            <article className="principle reveal">
              <span className="eyebrow">03</span>
              <h3>Buy with a margin of safety</h3>
              <p>Price matters. We invest when our estimate of intrinsic value offers room for uncertainty and meaningful upside.</p>
            </article>
            <article className="principle reveal">
              <span className="eyebrow">04</span>
              <h3>Allow time to work</h3>
              <p>When the thesis remains intact, patience can become an advantage. We give strong businesses time to compound.</p>
            </article>
          </div>
        </section>

        <section className="lens">
          <div className="lens-title reveal">
            <span className="eyebrow">Our lens / 02</span>
            <h2 className="serif">
              What we
              <br />
              <em>look for.</em>
            </h2>
          </div>
          <div className="criteria">
            <article className="criterion reveal">
              <div>
                <h3>Durable fundamentals</h3>
                <p>Sound balance sheets, resilient cash flows and business models that can hold their ground across cycles.</p>
              </div>
            </article>
            <article className="criterion reveal">
              <div>
                <h3>Room to grow</h3>
                <p>Businesses participating in long structural opportunities, with the ability to reinvest capital productively.</p>
              </div>
            </article>
            <article className="criterion reveal">
              <div>
                <h3>Aligned leadership</h3>
                <p>Promoters and management teams whose decisions reflect long-term ownership rather than short-term optics.</p>
              </div>
            </article>
            <article className="criterion reveal">
              <div>
                <h3>A meaningful discount</h3>
                <p>A gap between market price and our assessment of value, supported by research rather than sentiment.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="quote" data-section="04">
          <div className="quote-inner reveal">
            <blockquote>
              Our edge is not predicting every turn. It is knowing what we own, why we own it, and when patience deserves to be rewarded.
            </blockquote>
            <cite>Sneh Sagar Wealth Management LLP</cite>
          </div>
        </section>

        <section id="team" className="team-wrap" data-section="04">
          <span id="founders" style={{ position: "relative", top: "-100px", visibility: "hidden" }} />
          <div className="team-head reveal">
            <h2 className="serif">
              Long-term
              <br />
              thinkers.
            </h2>
            <p>
              The fund is led by investors who combine fundamental research with the perspective to remain independent when markets
              become distracted.
            </p>
          </div>
          <div className="people">
            <article className="person reveal">
              <div className="portrait">
                <img src="/assets/jay-ostwal.png" alt="Jay Ostwal - Fund Leadership" width="903" height="1024" loading="lazy" />
              </div>
              <span className="eyebrow">Fund leadership</span>
              <h3>Jay Ostwal</h3>
              <p>Focused on identifying overlooked small- and mid-cap businesses where quality, opportunity and valuation come together.</p>
            </article>
            <article className="person reveal">
              <div className="portrait">
                <img src="/assets/hemant-ostwal.png" alt="Hemant Ostwal - Fund Leadership" width="911" height="1024" loading="lazy" />
              </div>
              <span className="eyebrow">Fund leadership</span>
              <h3>Hemant Ostwal</h3>
              <p>
                Bringing a disciplined approach to research, risk and portfolio construction, with a shared belief in long-term value creation.
              </p>
            </article>
          </div>
        </section>
      </main>

      <section className="footer-region">
        <footer className="footer-sticky site-footer contact" id="contact" data-section="05">
          <div className="contact-top reveal">
            <div>
              <span className="eyebrow">Start a conversation</span>
              <h2 className="serif">
                Let’s talk
                <br />
                value.
              </h2>
            </div>
            <a className="round-link" href="mailto:info@ssvalueplus.com">
              Write to us <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="contact-meta reveal">
            <div>
              <span className="eyebrow">Email</span>
              <p>
                <a href="mailto:info@ssvalueplus.com">info@ssvalueplus.com</a>
              </p>
            </div>
            <div>
              <span className="eyebrow">Minimum investment</span>
              <p>₹1 crore</p>
            </div>
            <div>
              <span className="eyebrow">Focus</span>
              <p>Indian public equities</p>
            </div>
          </div>
          <div className="legal">
            <span>© 2026 Sneh Sagar Wealth Management LLP</span>
            <div className="legal-links">
              <a href="#">Disclaimer</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
            <span>Past performance is not indicative of future results.</span>
          </div>
        </footer>
      </section>
    </>
  );
}
