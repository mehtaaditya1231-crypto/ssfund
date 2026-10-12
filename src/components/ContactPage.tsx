"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface ContactPageProps {
  onNavigate?: (href: string) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  preferredMethod: "Email" | "Phone" | "Either" | "";
  consent: boolean;
  website_url: string; // Honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  preferredMethod?: string;
  consent?: string;
  general?: string;
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage({ onNavigate }: ContactPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Field refs for accessible focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const methodRadioRef = useRef<HTMLInputElement>(null);
  const consentCheckboxRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    preferredMethod: "",
    consent: false,
    website_url: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Update document title and meta description
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Contact | SS Value Plus Fund";

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute("content") : "";
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Start a conversation with the team behind SS Value Plus Fund."
      );
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute("content", originalDesc);
      }
    };
  }, []);

  // GSAP Entrance and Scroll Animations
  useEffect(() => {
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const hero = containerRef.current?.querySelector(".contact-hero");
      if (hero) {
        const label = hero.querySelector(".contact-hero-label");
        const lines = hero.querySelectorAll(".contact-hero-line");
        const supporting = hero.querySelector(".contact-hero-supporting");
        const emailLink = hero.querySelector(".contact-hero-email");
        const indicator = hero.querySelector(".contact-hero-indicator");

        if (isReduced) {
          if (label) gsap.set(label, { opacity: 1, y: 0 });
          if (lines) gsap.set(lines, { opacity: 1, y: "0%" });
          if (supporting) gsap.set(supporting, { opacity: 1, y: 0 });
          if (emailLink) gsap.set(emailLink, { opacity: 1, y: 0 });
          if (indicator) gsap.set(indicator, { opacity: 1, y: 0 });
        } else {
          gsap.set(label, { opacity: 0, y: 12 });
          gsap.set(lines, { opacity: 0, y: "105%" });
          gsap.set(supporting, { opacity: 0, y: 16 });
          gsap.set(emailLink, { opacity: 0, y: 12 });
          gsap.set(indicator, { opacity: 0, y: 12 });

          const heroTl = gsap.timeline({ delay: 0.12 });

          // 1. Reveal small label first
          heroTl
            .to(label, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            })
            // 2. Reveal heading line by line through overflow mask
            .to(
              lines,
              {
                opacity: 1,
                y: "0%",
                duration: 0.95,
                stagger: 0.12,
                ease: "power3.out",
              },
              "-=0.25"
            )
            // 3. Fade and raise supporting paragraph slightly
            .to(
              supporting,
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              "-=0.45"
            )
            // 4. Reveal email and scroll indicator last
            .to(
              [emailLink, indicator],
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out",
              },
              "-=0.35"
            );
        }
      }

      // 2. Section 2 Divider & Form Rows Reveal (IntersectionObserver + GSAP)
      if (!isReduced) {
        const formSection = containerRef.current?.querySelector(".contact-form-section");
        if (formSection) {
          const dividers = formSection.querySelectorAll(".editorial-divider");
          const formRows = formSection.querySelectorAll(".contact-form-row");
          const formLeft = formSection.querySelector(".contact-form-lead");

          gsap.set(dividers, { scaleX: 0, transformOrigin: "left" });
          gsap.set(formRows, { opacity: 0, y: 16 });
          if (formLeft) gsap.set(formLeft, { opacity: 0, y: 16 });

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();

                if (formLeft) {
                  tl.to(formLeft, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                  });
                }

                tl.to(
                  dividers,
                  {
                    scaleX: 1,
                    duration: 0.85,
                    stagger: 0.08,
                    ease: "power2.out",
                  },
                  formLeft ? "-=0.4" : 0
                ).to(
                  formRows,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.06,
                    ease: "power3.out",
                  },
                  "-=0.6"
                );

                observer.disconnect();
              }
            },
            { threshold: 0.1 }
          );

          observer.observe(formSection);
        }

        // 3. Section 3 Contact Meta Info Reveal
        const infoSection = containerRef.current?.querySelector(".contact-info-section");
        if (infoSection) {
          const infoDividers = infoSection.querySelectorAll(".info-divider");
          const infoCols = infoSection.querySelectorAll(".contact-info-col");

          gsap.set(infoDividers, { scaleX: 0, transformOrigin: "left" });
          gsap.set(infoCols, { opacity: 0, y: 14 });

          const infoObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                const tl = gsap.timeline();
                tl.to(infoDividers, {
                  scaleX: 1,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: "power2.out",
                }).to(
                  infoCols,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    ease: "power3.out",
                  },
                  "-=0.5"
                );
                infoObserver.disconnect();
              }
            },
            { threshold: 0.15 }
          );

          infoObserver.observe(infoSection);
        }

        // 4. Section 4 Alignment Statement Reveal
        const alignmentSection = containerRef.current?.querySelector(".contact-alignment-section");
        if (alignmentSection) {
          const alignmentContent = alignmentSection.querySelector(".alignment-content");
          if (alignmentContent) {
            gsap.set(alignmentContent, { opacity: 0, y: 20 });

            const alignObserver = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  gsap.to(alignmentContent, {
                    opacity: 1,
                    y: 0,
                    duration: 0.85,
                    ease: "power3.out",
                  });
                  alignObserver.disconnect();
                }
              },
              { threshold: 0.2 }
            );

            alignObserver.observe(alignmentSection);
          }
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // Handle Input Changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Preferred method selection
  const handleMethodSelect = (method: "Email" | "Phone" | "Either") => {
    setFormData((prev) => ({ ...prev, preferredMethod: method }));
    if (errors.preferredMethod) {
      setErrors((prev) => ({ ...prev, preferredMethod: undefined }));
    }
  };

  // Validate form client-side
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let firstInvalidRef: React.RefObject<HTMLElement | null> | null = null;

    // 01 Full name
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your full name.";
      if (!firstInvalidRef) firstInvalidRef = nameInputRef;
    }

    // 02 Email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
      if (!firstInvalidRef) firstInvalidRef = emailInputRef;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid email address (e.g. name@domain.com).";
      if (!firstInvalidRef) firstInvalidRef = emailInputRef;
    }

    // 05 Message
    if (!formData.message.trim()) {
      newErrors.message = "Please share what you would like to discuss.";
      if (!firstInvalidRef) firstInvalidRef = messageInputRef;
    }

    // 06 Preferred contact method
    if (!formData.preferredMethod) {
      newErrors.preferredMethod = "Please select a preferred contact method.";
      if (!firstInvalidRef) firstInvalidRef = methodRadioRef;
    }

    // Consent checkbox
    if (!formData.consent) {
      newErrors.consent = "Your consent is required to submit this enquiry.";
      if (!firstInvalidRef) firstInvalidRef = consentCheckboxRef;
    }

    setErrors(newErrors);

    // Accessible focus management: shift focus to first invalid element
    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status === "submitting") return;

    if (!validateForm()) {
      setStatus("error");
      setStatusMessage("Please resolve the highlighted fields above.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("Sending your enquiry…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          message: formData.message.trim(),
          preferredMethod: formData.preferredMethod,
          consent: formData.consent,
          website_url: formData.website_url, // Honeypot
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus("success");
        setStatusMessage("Enquiry received successfully.");
        // Scroll smoothly to form section top to reveal the inline success message
        const formEl = document.getElementById("enquiry-form");
        if (formEl) {
          formEl.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        setStatus("error");
        setStatusMessage(
          data.error || "Unable to send enquiry at this moment. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setStatusMessage(
        "Network connection issue. Please check your connection and try again."
      );
    }
  };

  const handleReturnHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate("/");
    } else {
      window.location.href = "/";
    }
  };

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("enquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="contact-page bg-white text-black selection:bg-black selection:text-white"
    >
      {/* =========================================================================
          SECTION 1 — CONTACT INTRODUCTION
          Spacious pure-white opening section, optical spacing below fixed navbar.
          ========================================================================= */}
      <section
        className="contact-hero min-h-[72svh] flex flex-col justify-center relative px-[var(--pad,2rem)] pt-[calc(6.5rem+env(safe-area-inset-top,0px))] pb-16 sm:pb-24 bg-white"
        aria-label="Contact introduction"
      >
        <div className="w-full max-w-[1180px] mx-auto">
          {/* Small label */}
          <p className="contact-hero-label font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] uppercase text-black/60 mb-6 sm:mb-8 m-0">
            START A CONVERSATION
          </p>

          {/* Large heading with preserved line break and overflow mask */}
          <h1 className="contact-hero-title font-serif text-[clamp(44px,7.5vw,104px)] font-normal leading-[0.96] tracking-[-0.04em] text-black m-0 max-w-[980px]">
            <span className="block overflow-hidden py-[0.04em]">
              <span className="contact-hero-line block">Let’s talk</span>
            </span>
            <span className="block overflow-hidden py-[0.04em]">
              <span className="contact-hero-line block">value.</span>
            </span>
          </h1>

          {/* Supporting copy */}
          <p className="contact-hero-supporting font-sans text-[clamp(16px,1.3vw,19px)] leading-[1.68] font-normal text-black/75 max-w-[620px] mt-7 sm:mt-10 m-0">
            If our way of thinking resonates with yours, we would be glad to begin a conversation.
          </p>

          {/* Verified existing email */}
          <div className="contact-hero-email mt-6 sm:mt-8">
            <a
              href="mailto:info@ssvalueplus.com"
              className="font-sans text-[15px] sm:text-[16px] text-black font-medium border-b border-black/35 hover:border-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs inline-block"
              aria-label="Direct email to info@ssvalueplus.com"
            >
              info@ssvalueplus.com
            </a>
          </div>

          {/* Subtle scroll indicator */}
          <div className="contact-hero-indicator mt-12 sm:mt-16">
            <a
              href="#enquiry-form"
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 font-sans text-[11px] sm:text-xs font-medium uppercase tracking-[0.22em] text-black/60 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs"
              aria-label="Scroll to enquiry form"
            >
              <span>TELL US A LITTLE ABOUT YOURSELF ↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — CONTACT-REQUEST FORM
          Editorial numbered form directly below introduction. No card container.
          ========================================================================= */}
      <section
        id="enquiry-form"
        className="contact-form-section bg-white text-black px-[var(--pad,2rem)] py-[clamp(4.5rem,8vw,8rem)] border-t"
        style={{ borderColor: "rgba(0, 0, 0, 0.18)" }}
        aria-label="Contact request form"
      >
        <div className="w-full max-w-[1180px] mx-auto">
          {status === "success" ? (
            /* ===================================================================
               INLINE SUCCESS STATE
               =================================================================== */
            <div
              className="contact-success-state py-12 sm:py-20 max-w-[760px]"
              role="status"
              aria-live="polite"
            >
              <p className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] uppercase text-black/60 mb-6 m-0">
                ENQUIRY RECEIVED
              </p>

              <h2 className="font-serif text-[clamp(36px,5.5vw,72px)] font-normal leading-[1.02] tracking-[-0.035em] text-black m-0 mb-6">
                Thank you for
                <br />
                reaching out.
              </h2>

              <p className="font-sans text-[clamp(16px,1.25vw,19px)] leading-[1.7] font-normal text-black/75 m-0 mb-10 max-w-[580px]">
                The team has received your request and will respond using your preferred contact method.
              </p>

              <a
                href="/"
                onClick={handleReturnHome}
                className="inline-flex items-center gap-2 font-sans text-[15px] sm:text-[16px] font-medium text-black border-b border-black pb-1 hover:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs"
              >
                <span>Return home</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : (
            /* ===================================================================
               EDITORIAL FORM LAYOUT
               =================================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-start">
              {/* Left Column: Editorial Heading & Supporting Copy */}
              <div className="contact-form-lead lg:col-span-5 flex flex-col items-start lg:sticky lg:top-28">
                <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.22em] uppercase text-black/60 block mb-4 sm:mb-6">
                  YOUR ENQUIRY
                </span>

                <h2 className="font-serif text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.02] tracking-[-0.035em] text-black m-0 mb-6">
                  A considered
                  <br />
                  beginning.
                </h2>

                <p className="font-sans text-[clamp(15px,1.2vw,17.5px)] leading-[1.72] font-normal text-black/70 max-w-[420px] m-0">
                  Share a few details below so the team can understand your enquiry before responding.
                </p>
              </div>

              {/* Right Column: Numbered Rows & Editorial Inputs */}
              <div className="lg:col-span-7 flex flex-col w-full">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="w-full flex flex-col"
                  aria-label="Enquiry Form"
                >
                  {/* Honeypot anti-spam field (hidden from view and screen readers) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      opacity: 0,
                      pointerEvents: "none",
                      height: 0,
                      width: 0,
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="website_url">Website</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 01 — FULL NAME (Required)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <label
                          htmlFor="contact-name"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          01 — Full name{" "}
                          <span className="text-black/60 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (required)
                          </span>
                        </label>
                        {errors.name && (
                          <span
                            id="name-error"
                            className="font-sans text-xs text-black font-semibold flex items-center gap-1.5"
                            role="alert"
                          >
                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                            {errors.name}
                          </span>
                        )}
                      </div>

                      <input
                        ref={nameInputRef}
                        type="text"
                        id="contact-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                        placeholder="Your full name"
                        className={`w-full min-h-[48px] px-0 py-2.5 bg-transparent font-sans text-[16px] sm:text-[17px] text-black placeholder:text-black/30 border-b transition-colors focus:outline-none ${
                          errors.name
                            ? "border-black font-medium"
                            : "border-black/25 focus:border-black"
                        }`}
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 02 — EMAIL ADDRESS (Required)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <label
                          htmlFor="contact-email"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          02 — Email address{" "}
                          <span className="text-black/60 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (required)
                          </span>
                        </label>
                        {errors.email && (
                          <span
                            id="email-error"
                            className="font-sans text-xs text-black font-semibold flex items-center gap-1.5"
                            role="alert"
                          >
                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                            {errors.email}
                          </span>
                        )}
                      </div>

                      <input
                        ref={emailInputRef}
                        type="email"
                        id="contact-email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                        required
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        placeholder="name@domain.com"
                        className={`w-full min-h-[48px] px-0 py-2.5 bg-transparent font-sans text-[16px] sm:text-[17px] text-black placeholder:text-black/30 border-b transition-colors focus:outline-none ${
                          errors.email
                            ? "border-black font-medium"
                            : "border-black/25 focus:border-black"
                        }`}
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 03 — PHONE NUMBER (Optional)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <label
                          htmlFor="contact-phone"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          03 — Phone number{" "}
                          <span className="text-black/50 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (optional)
                          </span>
                        </label>
                      </div>

                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                        placeholder="+91 98000 00000"
                        className="w-full min-h-[48px] px-0 py-2.5 bg-transparent font-sans text-[16px] sm:text-[17px] text-black placeholder:text-black/30 border-b border-black/25 focus:border-black transition-colors focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 04 — CITY / COUNTRY (Optional)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <label
                          htmlFor="contact-location"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          04 — City / Country{" "}
                          <span className="text-black/50 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (optional)
                          </span>
                        </label>
                      </div>

                      <input
                        type="text"
                        id="contact-location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        autoComplete="address-level2"
                        placeholder="Mumbai, India"
                        className="w-full min-h-[48px] px-0 py-2.5 bg-transparent font-sans text-[16px] sm:text-[17px] text-black placeholder:text-black/30 border-b border-black/25 focus:border-black transition-colors focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 05 — WHAT WOULD YOU LIKE TO DISCUSS? (Required Textarea)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <label
                          htmlFor="contact-message"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          05 — What would you like to discuss?{" "}
                          <span className="text-black/60 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (required)
                          </span>
                        </label>
                        {errors.message && (
                          <span
                            id="message-error"
                            className="font-sans text-xs text-black font-semibold flex items-center gap-1.5"
                            role="alert"
                          >
                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                            {errors.message}
                          </span>
                        )}
                      </div>

                      <textarea
                        ref={messageInputRef}
                        id="contact-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        placeholder="Share your interest, background or questions regarding SS Value Plus Fund…"
                        className={`w-full px-0 py-2.5 bg-transparent font-sans text-[16px] sm:text-[17px] leading-[1.6] text-black placeholder:text-black/30 border-b transition-colors focus:outline-none resize-y min-h-[110px] ${
                          errors.message
                            ? "border-black font-medium"
                            : "border-black/25 focus:border-black"
                        }`}
                      />
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      ROW 06 — PREFERRED CONTACT METHOD (Required)
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-7">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <span
                          id="preferred-method-label"
                          className="font-sans text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] uppercase text-black"
                        >
                          06 — Preferred contact method{" "}
                          <span className="text-black/60 font-normal lowercase tracking-normal text-[11px] sm:text-[12px]">
                            (required)
                          </span>
                        </span>
                        {errors.preferredMethod && (
                          <span
                            id="method-error"
                            className="font-sans text-xs text-black font-semibold flex items-center gap-1.5"
                            role="alert"
                          >
                            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                            {errors.preferredMethod}
                          </span>
                        )}
                      </div>

                      <div
                        role="radiogroup"
                        aria-labelledby="preferred-method-label"
                        aria-describedby={errors.preferredMethod ? "method-error" : undefined}
                        className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1"
                      >
                        {(["Email", "Phone", "Either"] as const).map((method, idx) => {
                          const isSelected = formData.preferredMethod === method;
                          return (
                            <label
                              key={method}
                              className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border cursor-pointer select-none transition-all duration-200 min-h-[44px] ${
                                isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-black/25 hover:border-black"
                              }`}
                            >
                              <input
                                ref={idx === 0 ? methodRadioRef : undefined}
                                type="radio"
                                name="preferredMethod"
                                value={method}
                                checked={isSelected}
                                onChange={() => handleMethodSelect(method)}
                                className="sr-only"
                              />
                              <span
                                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "border-white bg-white"
                                    : "border-black/40 group-hover:border-black"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                                )}
                              </span>
                              <span className="font-sans text-[14px] sm:text-[15px] font-medium tracking-[0.02em]">
                                {method}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* -------------------------------------------------------------
                      CONSENT CHECKBOX & REGULATORY NOTE
                      ------------------------------------------------------------- */}
                  <div className="contact-form-row relative py-6 sm:py-8">
                    <div
                      className="editorial-divider absolute top-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />

                    <div className="flex flex-col gap-3">
                      <label className="flex items-start gap-3.5 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input
                            ref={consentCheckboxRef}
                            type="checkbox"
                            name="consent"
                            id="consent-checkbox"
                            checked={formData.consent}
                            onChange={handleInputChange}
                            required
                            aria-required="true"
                            aria-invalid={!!errors.consent}
                            aria-describedby={errors.consent ? "consent-error" : undefined}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-5 h-5 border rounded-xs transition-colors flex items-center justify-center ${
                              formData.consent
                                ? "bg-black border-black text-white"
                                : errors.consent
                                ? "border-black bg-black/5"
                                : "border-black/35 group-hover:border-black bg-white"
                            }`}
                          >
                            {formData.consent && (
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                viewBox="0 0 16 16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <span className="font-sans text-[14px] sm:text-[15px] leading-[1.55] text-black select-none">
                          I consent to Sneh Sagar Wealth Management LLP using the information provided to respond to my enquiry.
                        </span>
                      </label>

                      {errors.consent && (
                        <span
                          id="consent-error"
                          className="font-sans text-xs text-black font-semibold flex items-center gap-1.5 pl-8"
                          role="alert"
                        >
                          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                          {errors.consent}
                        </span>
                      )}

                      <p className="font-sans text-[12px] sm:text-[13px] leading-[1.6] text-black/55 m-0 pl-8">
                        Submitting this form does not constitute an application to invest or an offer, recommendation or solicitation.
                      </p>
                    </div>

                    {/* Bottom Divider */}
                    <div
                      className="editorial-divider absolute bottom-0 inset-x-0 h-[1px]"
                      style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
                    />
                  </div>

                  {/* -------------------------------------------------------------
                      SUBMIT BUTTON & LIVE STATUS
                      ------------------------------------------------------------- */}
                  <div className="pt-8 sm:pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={`inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 rounded-full border font-sans text-[13px] sm:text-[14px] font-medium tracking-[0.14em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 select-none ${
                        status === "submitting"
                          ? "bg-black/75 text-white border-black/75 cursor-not-allowed"
                          : "bg-black text-white border-black hover:bg-white hover:text-black cursor-pointer"
                      }`}
                      aria-label="Submit enquiry"
                    >
                      <span>
                        {status === "submitting"
                          ? "SENDING…"
                          : status === "error"
                          ? "TRY AGAIN"
                          : "REQUEST A CALL ↗"}
                      </span>
                    </button>

                    {/* Accessible Live Region for Screen Readers & Visual Feedback */}
                    <div
                      className="min-h-[24px] flex items-center"
                      aria-live="polite"
                      role="status"
                    >
                      {statusMessage && (
                        <p
                          className={`font-sans text-xs sm:text-[13px] m-0 ${
                            status === "error"
                              ? "text-black font-semibold"
                              : "text-black/65"
                          }`}
                        >
                          {statusMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — EXISTING CONTACT INFORMATION
          Three-column layout on desktop, stacked on mobile. Thin line dividers.
          ========================================================================= */}
      <section
        className="contact-info-section bg-white text-black px-[var(--pad,2rem)] py-[clamp(4rem,7vw,6.5rem)]"
        aria-label="Fund details and contact summary"
      >
        <div className="w-full max-w-[1180px] mx-auto">
          {/* Top Divider */}
          <div
            className="info-divider w-full h-[1px] mb-10 sm:mb-14"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Column 1: Email */}
            <div className="contact-info-col flex flex-col">
              <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 block mb-3">
                Email
              </span>
              <a
                href="mailto:info@ssvalueplus.com"
                className="font-serif text-[clamp(22px,2.2vw,30px)] font-normal text-black leading-[1.2] hover:opacity-70 transition-opacity border-b border-black/20 hover:border-black w-fit pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-xs"
              >
                info@ssvalueplus.com
              </a>
            </div>

            {/* Column 2: Minimum Investment */}
            <div className="contact-info-col flex flex-col">
              <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 block mb-3">
                Minimum investment
              </span>
              <p className="font-serif text-[clamp(22px,2.2vw,30px)] font-normal text-black leading-[1.2] m-0">
                ₹1 crore
              </p>
            </div>

            {/* Column 3: Investment Focus */}
            <div className="contact-info-col flex flex-col">
              <span className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 block mb-3">
                Investment focus
              </span>
              <p className="font-serif text-[clamp(22px,2.2vw,30px)] font-normal text-black leading-[1.2] m-0">
                Indian small- and mid-cap companies
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — ALIGNMENT STATEMENT
          Short pale-beige accent section near the bottom (#F4F0E7).
          ========================================================================= */}
      <section
        className="contact-alignment-section px-[var(--pad,2rem)] py-[clamp(5rem,9vw,8rem)]"
        style={{ backgroundColor: "#F4F0E7" }}
        aria-label="Alignment statement"
      >
        <div className="w-full max-w-[960px] mx-auto text-center flex flex-col items-center">
          <div className="alignment-content flex flex-col items-center max-w-[760px]">
            <h2 className="font-serif text-[clamp(34px,5.2vw,66px)] font-normal leading-[1.04] tracking-[-0.035em] text-black m-0 mb-6 sm:mb-8">
              Alignment matters
              <br />
              before capital does.
            </h2>

            <p className="font-sans text-[clamp(15px,1.25vw,18px)] leading-[1.72] font-normal text-black/75 m-0 max-w-[620px]">
              SS Value Plus Fund is built around patience, independent thinking and a long-term view of value. A conversation is the first step in understanding whether that perspective is shared.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
