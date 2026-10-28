import React, { useEffect, useState, useCallback } from "react";
import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav";
import ApproachBentoSection from "@/components/approach-bento/ApproachBentoSection";
import Hero from "@/components/Hero";
import FoundersSection from "@/components/FoundersSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";
import TheFundPage from "@/components/TheFundPage";
import ApproachPage from "@/components/ApproachPage";
import ContactPage from "@/components/ContactPage";

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
  if (clean.includes("contact")) {
    return "/contact";
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
      if (window.location.pathname !== "/contact") {
        window.history.pushState({}, "", "/contact");
        setCurrentPath("/contact");
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
  const isContactPage = currentPath === "/contact";

  return (
    <>
      <ImmersiveFullscreenNav
        agencyName="Sneh Sagar Wealth Management LLP"
        overlayBg="#081F3C"
        headerOpenColor="#F5F1E8"
        linkColor="#F5F1E8"
        linkHoverColor="#B87332"
        currentPath={currentPath}
        onNavigate={handleNavigate}
        links={[
          { label: "Home", href: "/" },
          { label: "The Fund", href: "/the-fund" },
          { label: "Approach", href: "/approach" },
          { label: "Founders", href: "/founders" },
          { label: "Contact", href: "/contact" },
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
      ) : isContactPage ? (
        /* Dedicated Contact Page */
        <>
          <main id="top" className="contact-main">
            <ContactPage onNavigate={handleNavigate} />
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

            <ApproachBentoSection />

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
                  <div className="criterion-icon-container">
                    <img
                      src="/assets/durable-fundamentals-icon.png"
                      alt="Durable fundamentals"
                      className="criterion-icon"
                      width="76"
                      height="76"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3>Durable fundamentals</h3>
                    <p>Sound balance sheets, resilient cash flows and business models that can hold their ground across cycles.</p>
                  </div>
                </article>
                <article className="criterion reveal">
                  <div className="criterion-icon-container">
                    <img
                      src="/assets/room-to-grow-icon.png"
                      alt="Room to grow"
                      className="criterion-icon"
                      width="76"
                      height="76"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3>Room to grow</h3>
                    <p>Businesses participating in long structural opportunities, with the ability to reinvest capital productively.</p>
                  </div>
                </article>
                <article className="criterion reveal">
                  <div className="criterion-icon-container">
                    <img
                      src="/assets/aligned-leadership-icon.png"
                      alt="Aligned leadership"
                      className="criterion-icon"
                      width="76"
                      height="76"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3>Aligned leadership</h3>
                    <p>Promoters and management teams whose decisions reflect long-term ownership rather than short-term optics.</p>
                  </div>
                </article>
                <article className="criterion reveal">
                  <div className="criterion-icon-container">
                    <img
                      src="/assets/meaningful-discount-icon.png"
                      alt="A meaningful discount"
                      className="criterion-icon"
                      width="76"
                      height="76"
                      loading="lazy"
                    />
                  </div>
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
