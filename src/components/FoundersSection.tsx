import React from "react";

export default function FoundersSection() {
  return (
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
  );
}
