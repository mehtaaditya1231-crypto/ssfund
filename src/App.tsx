import React, { useEffect, useState, useCallback } from "react";
import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";
import Hero from "@/components/Hero";
import FoundersSection from "@/components/FoundersSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";
import TheFundPage from "@/components/TheFundPage";
import ApproachPage from "@/components/ApproachPage";

function normalizePath(pathname: string): string {
  const clean = pathname.replace(/\/$/, "");
  if (clean.includes("the-fund")) {
    return "/the-fund";
  }
  if (clean.includes("founders")) {
    return "/founders";
  }
  if (clean.includes("approach")) {
    return "/approach";
  }
  return "/";
}

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== "undefined") {
      return normalizePath(window.location.pathname);
    }
    return "/";
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      const nextPath = normalizePath(window.location.pathname);
      setCurrentPath(nextPath);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Reveal on scroll observer for current route
  useEffect(() => {
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

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, [currentPath]);

  // Navigate handler for menu items and internal links
  const handleNavigate = useCallback((to: string) => {
    if (to === "/the-fund") {
      if (window.location.pathname !== "/the-fund") {
        window.history.pushState({}, "", "/the-fund");
        setCurrentPath("/the-fund");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (to === "/founders" || to === "/founders.html") {
      if (window.location.pathname !== "/founders") {
        window.history.pushState({}, "", "/founders");
        setCurrentPath("/founders");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (to === "/approach") {
      if (window.location.pathname !== "/approach") {
        window.history.pushState({}, "", "/approach");
        setCurrentPath("/approach");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (to === "/contact") {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/#contact");
        setCurrentPath("/");
        setTimeout(() => {
          const contactEl = document.getElementById("contact");
          if (contactEl) {
            contactEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
      return;
    }

    if (to === "/" || to === "#top") {
      if (window.location.pathname !== "/") {
        window.history.pushState({}, "", "/");
        setCurrentPath("/");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Anchor hash link on homepage (e.g. /#about, /#approach, /#contact)
    const hash = to.includes("#") ? to.split("#")[1] : "";
    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", to.startsWith("/") ? to : `/${to}`);
      setCurrentPath("/");
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo(0, 0);
        }
      }, 100);
    } else {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const isFundPage = currentPath === "/the-fund";
  const isFoundersPage = currentPath === "/founders";
  const isApproachPage = currentPath === "/approach";

  return (
    <>
      <ImmersiveFullscreenNav
        agencyName="Sneh Sagar Wealth Management LLP"
        overlayBg="#000000"
        headerOpenColor="#FFFFFF"
        linkColor="#FFFFFF"
        linkHoverColor="#A3A3A3"
        currentPath={currentPath}
        onNavigate={handleNavigate}
        links={[
          { label: "Home", href: "/" },
          { label: "The Fund", href: "/the-fund" },
          { label: "Approach", href: "/approach" },
          { label: "Founders", href: "/founders" },
          { label: "Contact", href: "/#contact" },
        ]}
      />

      {isFundPage ? (
        /* Dedicated The Fund Page */
        <>
          <main id="top" className="fund-main">
            <TheFundPage onNavigate={handleNavigate} />
          </main>
          <Footer />
        </>
      ) : isFoundersPage ? (
        /* Dedicated Founders Page */
        <>
          <main id="top" className="founders-main">
            {/* 1. Founders section */}
            <FoundersSection />

            {/* 2. Pale-pink quote section */}
            <QuoteSection />
          </main>
          <Footer />
        </>
      ) : isApproachPage ? (
        /* Dedicated Investment Approach Page */
        <>
          <main id="top" className="approach-main">
            <ApproachPage onNavigate={handleNavigate} />
          </main>
          <Footer />
        </>
      ) : (
        /* Landing Page */
        <>
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
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
