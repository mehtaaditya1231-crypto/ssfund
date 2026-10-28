"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CLIPS = {
  bottom: {
    closedInitial: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    open: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    closedFinal: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  },
};

export interface ImmersiveNavProps {
  clipOrigin?: "bottom";
  overlayBg?: string;
  headerOpenColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
  openDuration?: number;
  closeDuration?: number;
  ease?: string;
  agencyName?: string;
  tagline?: string;
  location?: string;
  links?: { label: string; href: string }[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
}

const DEFAULT_LINKS = [
  { label: "Home", href: "/" },
  { label: "The Fund", href: "/the-fund" },
  { label: "Approach", href: "/approach" },
  { label: "Founders", href: "/founders" },
  { label: "Contact", href: "/contact" },
];

function AnimatedNavLink({
  label,
  href,
  onClick,
  linkColor,
  linkHoverColor,
}: {
  label: string;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  linkColor: string;
  linkHoverColor: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = label.split("");

  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group relative inline-block py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-white rounded-sm"
      style={{
        color: linkColor,
        fontFamily: '"Bodoni Moda", serif',
      }}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="inline-flex overflow-hidden text-[clamp(2.4rem,5.5vw,5rem)] font-normal leading-[1.08] tracking-[-0.035em]"
      >
        {characters.map((char, index) => (
          <span
            key={index}
            className="relative inline-block overflow-hidden"
            style={{ minWidth: char === " " ? "0.3em" : undefined }}
          >
            <span
              className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
              style={{
                transform: isHovered ? "translateY(-105%)" : "translateY(0%)",
                transitionDelay: `${index * 16}ms`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
            <span
              className="absolute inset-0 inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
              style={{
                color: linkHoverColor,
                transform: isHovered ? "translateY(0%)" : "translateY(105%)",
                transitionDelay: `${index * 16}ms`,
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>
    </a>
  );
}

export default function ImmersiveFullscreenNav({
  clipOrigin = "bottom",
  overlayBg = "#081F3C",
  headerOpenColor = "#F5F1E8",
  linkColor = "#F5F1E8",
  linkHoverColor = "#B87332",
  openDuration = 1.1,
  closeDuration = 0.9,
  ease = "power4.inOut",
  agencyName = "Sneh Sagar Wealth Management LLP",
  tagline = "Value investing, built on conviction.",
  location = "India",
  links = DEFAULT_LINKS,
  currentPath = "/",
  onNavigate,
}: ImmersiveNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const overlayRef = useRef<HTMLElement | null>(null);
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const reduceMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true;

  // Detect section background to adapt closed header color over remaining sections,
  // and handle landing page scroll threshold for company name hiding
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;

      // Stable hysteresis threshold around 90px to prevent flickering:
      // Hide full name when scrollY > 95px, restore when scrollY < 65px
      setIsScrolled((prev) => {
        if (!prev && scrollY > 95) return true;
        if (prev && scrollY < 65) return false;
        return prev;
      });

      // Light pages: Approach, Contact, and The Fund
      if (
        currentPath === "/approach" ||
        currentPath === "/contact" ||
        currentPath === "/the-fund" ||
        document.querySelector(".approach-main") ||
        document.querySelector(".contact-main") ||
        document.querySelector(".fund-main")
      ) {
        setIsDarkSection(false);
        return;
      }

      // Dark navy page: Founders
      if (currentPath === "/founders" || document.querySelector(".founders-main")) {
        setIsDarkSection(true);
        return;
      }

      // On landing page, detect dark navy sections
      const darkElements = document.querySelectorAll(
        "#approach, #team, [data-nav-dark='true'], .dark-section, [data-theme='dark'], .site-footer, #contact"
      );
      const headerThreshold = 55;

      let dark = false;
      darkElements.forEach((el) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerThreshold && rect.bottom >= 15) {
            dark = true;
          }
        }
      });
      setIsDarkSection(dark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    const timer = setTimeout(handleScroll, 30);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [currentPath]);

  // Lock and unlock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap inside open menu + Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const container = overlayRef.current;
    if (!container) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseMenu();
        return;
      }

      if (e.key === "Tab") {
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  const onOpenMenu = () => {
    if (isAnimatingRef.current) return;
    setIsOpen(true);
    isAnimatingRef.current = true;
    timelineRef.current?.kill();

    const { closedInitial, open: openClip } = CLIPS[clipOrigin] ?? CLIPS.bottom;

    if (reduceMotion()) {
      gsap.set(overlayRef.current, { clipPath: openClip, autoAlpha: 0 });
      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      return;
    }

    gsap.set(overlayRef.current, { clipPath: closedInitial, autoAlpha: 1 });
    gsap.set(contentWrapperRef.current, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    timelineRef.current = tl;

    tl.to(overlayRef.current, {
      clipPath: openClip,
      duration: openDuration,
      ease,
    }).to(
      contentWrapperRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      },
      "-=0.5"
    );

    const navLinkItems = contentWrapperRef.current?.querySelectorAll(".nav-link-item");
    if (navLinkItems && navLinkItems.length > 0) {
      gsap.set(navLinkItems, { opacity: 0, y: 25 });
      tl.to(
        navLinkItems,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.4"
      );
    }
  };

  const onCloseMenu = (onClosedCallback?: () => void) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    timelineRef.current?.kill();

    // Restore body scroll immediately
    document.body.style.overflow = "";

    const { closedFinal } = CLIPS[clipOrigin] ?? CLIPS.bottom;

    if (reduceMotion()) {
      timelineRef.current = gsap.to(overlayRef.current, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setIsOpen(false);
          isAnimatingRef.current = false;
          if (onClosedCallback) onClosedCallback();
        },
      });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        isAnimatingRef.current = false;
        if (overlayRef.current) {
          gsap.set(overlayRef.current, { clipPath: CLIPS.bottom.closedInitial });
        }
        if (onClosedCallback) onClosedCallback();
      },
    });

    timelineRef.current = tl;

    tl.to(contentWrapperRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: "power2.in",
    }).to(
      overlayRef.current,
      {
        clipPath: closedFinal,
        duration: closeDuration,
        ease,
      },
      "-=0.1"
    );
  };

  const onToggle = () => {
    if (isAnimatingRef.current) return;
    if (isOpen) {
      onCloseMenu();
    } else {
      onOpenMenu();
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    e.preventDefault();

    onCloseMenu(() => {
      if (onNavigate) {
        onNavigate(targetHref);
        return;
      }

      if (targetHref === "/" || targetHref === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (targetHref === "/the-fund") {
        window.location.href = "/the-fund";
        return;
      }

      if (targetHref === "/approach") {
        window.location.href = "/approach";
        return;
      }

      if (targetHref === "/contact") {
        window.location.href = "/contact";
        return;
      }

      if (targetHref === "/founders" || targetHref === "/founders.html") {
        window.location.href = "/founders";
        return;
      }

      const hashIndex = targetHref.indexOf("#");
      if (hashIndex !== -1) {
        const hash = targetHref.slice(hashIndex + 1);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  };

  // Header element colors:
  // When menu is open -> headerOpenColor (#F5F1E8)
  // When closed over dark navy section -> #F5F1E8
  // When closed over light sections -> #081F3C (navy)
  const currentHeaderColor = isOpen ? headerOpenColor : isDarkSection ? "#F5F1E8" : "#081F3C";

  // The full company name beside the logo appears in exactly one place:
  // the initial, unscrolled state of the landing-page header.
  const isLandingPage = currentPath === "/" || currentPath === "" || currentPath === "#top";
  const showCompanyName = isLandingPage && !isScrolled && !isOpen;

  return (
    <div ref={rootRef}>
      {/* Top Header Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-colors duration-400"
        style={{
          padding: "1.15rem var(--pad, 2rem)",
          background: "transparent",
        }}
      >
        {/* Brand Group: Official Logo + Optional Company Name on Landing Page */}
        <a
          href="#top"
          onClick={(e) => {
            if (isOpen) {
              handleLinkClick(e, "/");
            } else {
              e.preventDefault();
              if (onNavigate) {
                onNavigate("/");
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="flex items-center group transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-xs"
          style={{ color: currentHeaderColor }}
          aria-label="Sneh Sagar Wealth Management LLP, Home"
        >
          {/* Official Sneh Sagar Logo with smooth variant crossfade (no white square) */}
          <div className="relative h-[36px] sm:h-[44px] aspect-[465/500] shrink-0">
            {/* Navy & Copper variant (for white and warm-ivory sections) */}
            <img
              src="/assets/sneh-sagar-logo-navy.png"
              alt="Sneh Sagar Wealth Management LLP"
              className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
                isDarkSection || isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            />
            {/* Warm Ivory & Copper variant (for navy sections and open fullscreen menu) */}
            <img
              src="/assets/sneh-sagar-logo-ivory.png"
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-auto object-contain transition-opacity duration-300 ${
                isDarkSection || isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          </div>

          {/* Full company name visible only at the unscrolled top of the landing page */}
          <div
            className={`overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity ${
              showCompanyName
                ? "max-w-[240px] xs:max-w-[280px] sm:max-w-[460px] opacity-100 translate-x-0 ml-3 sm:ml-4"
                : "max-w-0 opacity-0 -translate-x-2 ml-0 pointer-events-none"
            }`}
            aria-hidden="true"
          >
            <span
              className="block font-sans text-[10.5px] xs:text-[11.5px] sm:text-[12.5px] font-medium tracking-[0.11em] leading-[1.25] sm:leading-none uppercase whitespace-normal sm:whitespace-nowrap transition-colors duration-300 select-none"
              style={{ color: currentHeaderColor }}
            >
              {agencyName}
            </span>
          </div>
        </a>

        {/* Minimal 3-Line Menu Button */}
        <button
          ref={toggleButtonRef}
          onClick={onToggle}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          className="relative flex flex-col justify-center items-center w-11 h-11 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-full transition-colors"
        >
          <div className="relative w-6 h-[18px] flex flex-col justify-between">
            <span
              className="block w-full h-[1.75px] rounded-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
              style={{
                backgroundColor: currentHeaderColor,
                transformOrigin: "center",
                transform: isOpen ? "translateY(8.1px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-full h-[1.75px] rounded-full transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{
                backgroundColor: currentHeaderColor,
                opacity: isOpen ? 0 : 1,
                transform: isOpen ? "scaleX(0)" : "scaleX(1)",
              }}
            />
            <span
              className="block w-full h-[1.75px] rounded-full transition-all duration-400 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
              style={{
                backgroundColor: currentHeaderColor,
                transformOrigin: "center",
                transform: isOpen ? "translateY(-8.1px) rotate(-45deg)" : "none",
              }}
            />
          </div>
        </button>
      </header>

      {/* Fullscreen Overlay Menu */}
      <nav
        ref={overlayRef}
        style={{
          clipPath: CLIPS.bottom.closedInitial,
          backgroundColor: overlayBg,
        }}
        className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto ${isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        aria-hidden={!isOpen}
        role="navigation"
        aria-label="Full screen primary navigation"
      >
        <div
          ref={contentWrapperRef}
          className="w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-20 lg:px-28 pt-28 pb-12 text-[#FFFFFF]"
        >
          {/* Top Meta Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/20 text-xs uppercase tracking-[0.16em] text-white/70">
            <span className="text-[#F5F1E8] font-medium">{agencyName}</span>
            <span className="hidden sm:inline font-normal lowercase text-[0.85rem] tracking-normal font-serif text-[#F5F1E8]/80">
              {tagline}
            </span>
            <span>{location}</span>
          </div>

          {/* Main Section: Links + Founder Images Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-auto py-10 items-center">
            {/* Left: Editorial Navigation Links */}
            <div className="lg:col-span-7 flex flex-col gap-1 sm:gap-2">
              {links.map((link) => (
                <div key={link.label} className="nav-link-item">
                  <AnimatedNavLink
                    label={link.label}
                    href={link.href}
                    onClick={handleLinkClick}
                    linkColor={linkColor}
                    linkHoverColor={linkHoverColor}
                  />
                </div>
              ))}
            </div>

            {/* Right: Authentic Founder Portraits Showcase */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row gap-6 items-start lg:items-center justify-start lg:justify-end">
              {/* Founder 1: Jay Ostwal */}
              <a
                href="/founders"
                onClick={(e) => handleLinkClick(e, "/founders")}
                className="group relative w-full sm:w-44 lg:w-48 aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.04] border border-white/20 hover:border-[#B87332]/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer block"
                aria-label="Jay Ostwal - Fund Leadership"
              >
                <img
                  src="/assets/founders/jay-ostwal-transparent.png"
                  alt="Jay Ostwal"
                  className="w-full h-full object-contain object-bottom p-2 grayscale contrast-115 group-hover:grayscale-0 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#081F3C] via-[#081F3C]/80 to-transparent">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#F5F1E8]">
                    Jay Ostwal
                  </p>
                  <p className="text-[11px] text-white/70 tracking-normal font-sans">
                    Fund leadership
                  </p>
                </div>
              </a>

              {/* Founder 2: Hemant Ostwal */}
              <a
                href="/founders"
                onClick={(e) => handleLinkClick(e, "/founders")}
                className="group relative w-full sm:w-44 lg:w-48 aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.04] border border-white/20 hover:border-[#B87332]/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer block"
                aria-label="Hemant Ostwal - Fund Leadership"
              >
                <img
                  src="/assets/founders/hemant-ostwal-transparent.png"
                  alt="Hemant Ostwal"
                  className="w-full h-full object-contain object-bottom p-2 grayscale contrast-115 group-hover:grayscale-0 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#081F3C] via-[#081F3C]/80 to-transparent">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#F5F1E8]">
                    Hemant Ostwal
                  </p>
                  <p className="text-[11px] text-white/70 tracking-normal font-sans">
                    Fund leadership
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Bottom Footnote / Focus */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/20 text-xs text-white/70">
            <p>© 2026 Sneh Sagar Wealth Management LLP</p>
            <p className="font-serif text-sm text-[#F5F1E8]">
              Indian public equities
            </p>
          </div>
        </div>
      </nav>
    </div>
  );
}
