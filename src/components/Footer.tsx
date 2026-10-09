import React from "react";

export default function Footer() {
  return (
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
  );
}
