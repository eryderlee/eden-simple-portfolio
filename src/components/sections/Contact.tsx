'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';

/* ──────────────────────────────────────────────────────────────────
   Drop-in replacement for components/sections/Contact.tsx
   ──────────────────────────────────────────────────────────────────
   How it integrates with ScrollLine.tsx:
   - ScrollLine targets the element with id="contact-cta" and ends the
     trace at that element's top edge, horizontal centre.
   - We mount an invisible 1px <span id="contact-cta"> at the bottom
     of the email block — exactly where the sonar dot lands. So the
     scroll line lands precisely on the dot.
   - The sonar's shockwave + radar ripple fire when the CTA scrolls
     into view (same threshold the line uses), so the visual handoff
     between ScrollLine and the impact effect is in sync.
   ────────────────────────────────────────────────────────────────── */

// ─── BRAND ICONS (matching the existing site) ───────────────────────
const ICON_LINKEDIN = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const ICON_GITHUB = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);
const ICON_UPWORK = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.545-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
  </svg>
);
const ICON_YOUTUBE = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SOCIALS = [
  { label: 'LinkedIn', handle: '/in/edenryderlee', href: 'https://linkedin.com/in/edenryderlee',         icon: ICON_LINKEDIN },
  { label: 'GitHub',   handle: '/eryderlee',       href: 'https://github.com/eryderlee',                 icon: ICON_GITHUB },
  { label: 'Upwork',   handle: '/eryderlee',       href: 'https://www.upwork.com/freelancers/eryderlee', icon: ICON_UPWORK },
  { label: 'YouTube',  handle: '/@eryderlee',      href: 'https://youtu.be/HAOkVh_K5Kk',                 icon: ICON_YOUTUBE },
];

const RADAR_RADII = [120, 240, 360, 480, 600, 720, 840];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef   = useRef<HTMLAnchorElement>(null);

  // section dimensions (drive the SVG viewBox so circles stay circular
  // at any width / height without preserveAspectRatio stretching them).
  const [size, setSize]         = useState({ w: 1200, h: 1300 });
  const [impactY, setImpactY]   = useState(420);
  // `revealed` is sticky once the ScrollLine first reaches the CTA —
  // the content below the heading stays visible on subsequent scrolls.
  // `rippling` toggles each time the line crosses in/out so the radar
  // ripple + shockwave replay every entry.
  const [revealed, setRevealed] = useState(false);
  const [rippling, setRippling] = useState(false);

  // form
  const [name, setName] = useState('');
  const [subj, setSubj] = useState('');
  const [body, setBody] = useState('');

  // waveform signal-strength meter (24 bars, idle-pulse until lit)
  const N_BARS    = 24;
  const sig       = Math.min(100, Math.round((body.length / 220) * 100));
  const litCount  = Math.round((sig / 100) * N_BARS);
  const bars = useMemo(() => {
    if (!body) return Array.from({ length: N_BARS }, (_, i) => 3 + (i % 6));
    return Array.from({ length: N_BARS }, (_, i) => {
      const c = body.charCodeAt(i % body.length) || 0;
      return Math.max(3, Math.min(26, ((c * (i + 7)) % 24) + 4));
    });
  }, [body]);

  // ── Measure section + email-bottom (impact point) ────────────────
  useEffect(() => {
    const measure = () => {
      const sec   = sectionRef.current;
      const email = emailRef.current;
      if (!sec || !email) return;
      const sr = sec.getBoundingClientRect();
      const er = email.getBoundingClientRect();
      if (sr.height === 0) return;
      setSize({ w: sr.width, h: sr.height });
      const pxY = er.bottom - sr.top;
      if (Number.isFinite(pxY) && pxY > 80) setImpactY(pxY);
    };
    measure();
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 400);
    const t3 = window.setTimeout(measure, 1200);
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      ro.disconnect();
    };
  }, []);

  // ── Fire impact sequence when ScrollLine's tip reaches the CTA ────
  useEffect(() => {
    const onReached = () => {
      setRevealed(true);
      setRippling(true);
    };
    const onLeft = () => {
      // Drop the rippling class so CSS animations reset for the next entry.
      setRippling(false);
    };
    document.addEventListener('cta-line-reached', onReached);
    document.addEventListener('cta-line-left', onLeft);

    // Fallback: on mobile, fast scrolling or ScrollLine timing can miss
    // the cta-line-reached dispatch. Once the CTA is well inside the
    // viewport, fire the reveal ourselves so the section never stays
    // visibly broken.
    const cta = document.getElementById('contact-cta');
    let fallbackIO: IntersectionObserver | null = null;
    if (cta) {
      fallbackIO = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            setRippling(true);
          } else {
            setRippling(false);
          }
        },
        { threshold: 0, rootMargin: '0px 0px -20% 0px' },
      );
      fallbackIO.observe(cta);
    }

    return () => {
      document.removeEventListener('cta-line-reached', onReached);
      document.removeEventListener('cta-line-left', onLeft);
      fallbackIO?.disconnect();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const sigLine = name ? `\n\n— ${name}` : '';
    window.location.href = `mailto:eden@ryderlee.me?subject=${encodeURIComponent(
      subj || 'Hello',
    )}&body=${encodeURIComponent(body + sigLine)}`;
  };

  const W         = size.w;
  const H         = size.h;
  const lineEndX  = W / 2;
  const lineEndY  = impactY;

  const cssVars = {
    '--impact-x': `${(lineEndX / W) * 100}%`,
    '--impact-y': `${(lineEndY / H) * 100}%`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`section-grain relative bg-black border-t border-white/[0.04] pt-24 pb-16 md:pt-36 md:pb-20 px-5 overflow-x-clip overflow-y-visible ${rippling ? 'is-rippling' : ''} ${revealed ? 'is-revealed' : ''}`}
      style={cssVars}
    >
      {/* Left architectural accent line (matches the rest of the site) */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent z-[1]"
      />

      {/* ── Radar grid (concentric rings + cross-hairs) ───────────── */}
      <svg
        className="sn-radar"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {RADAR_RADII.map((r, i) => (
          <circle
            key={r}
            cx={lineEndX}
            cy={lineEndY}
            r={r}
            className={`sn-rc sn-rc-${i}`}
            fill="none"
          />
        ))}
        <line className="sn-cx" x1={0}        y1={lineEndY} x2={W}        y2={lineEndY} />
        <line className="sn-cx" x1={lineEndX} y1={0}        x2={lineEndX} y2={H}        />
      </svg>

      {/* ── Shockwave (SVG — needs to grow from r=6 to r=850, so it has
            to inherit the rippling section's coordinate space) ─────── */}
      <svg
        className="sn-rings"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <circle cx={lineEndX} cy={lineEndY} r={6} className="sn-shockwave" />
      </svg>

      {/* ── Core dot — same SVG <circle> as before, but in its own SVG
            with a fixed viewBox and default preserveAspectRatio. The
            previous arrangement put the dot inside the section-sized
            rings SVG (preserveAspectRatio="none"), which on mobile
            stretched the circle into an oval whenever the section
            aspect ratio was tall-and-narrow. With its own 20x20 viewBox
            the circle is always a true circle on every viewport. */}
      <svg
        className="sn-core-svg"
        style={{ left: `${lineEndX}px`, top: `${lineEndY}px` }}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <circle cx={10} cy={10} className="sn-core-c" />
      </svg>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative max-w-[1000px] mx-auto w-full sn-wrap">
        <div className="sn-label">
          <div className="sn-dash" />
          <span>Contact</span>
        </div>
        <h2 className="sn-heading">
          Let&apos;s build<br />
          <span className="sn-accent">something</span>
          <span className="sn-period">.</span>
        </h2>

        {/* Everything below the heading stays hidden until ScrollLine's tip
            actually reaches #contact-cta — at which point phase flips. */}
        <div className="sn-reveal">
        <p className="sn-intro">
          Open to freelance projects, full-time roles, and interesting collaborations.
          Based in Point Cook, VIC &mdash; available remotely worldwide.
        </p>

        {/* Reveal block: email + meta + socials */}
        <div className="crv">
          <a
            ref={emailRef}
            href="mailto:eden@ryderlee.me"
            className="crv-email"
          >
            {/* Corner brackets — terminal-field frame around the email */}
            <span aria-hidden="true" className="crv-corner crv-corner-tl" />
            <span aria-hidden="true" className="crv-corner crv-corner-tr" />
            <span aria-hidden="true" className="crv-corner crv-corner-bl" />
            <span aria-hidden="true" className="crv-corner crv-corner-br" />

            <span className="crv-email-key">Write to me at</span>
            <span className="crv-email-val">
              eden<span className="crv-at">@</span>ryderlee.me
              <span className="crv-email-underline" />
            </span>
            {/* This is the anchor ScrollLine.tsx targets. Its TOP edge sits
                at the email block's BOTTOM (where the impact dot lands). */}
            <span
              id="contact-cta"
              aria-hidden="true"
              className="crv-cta-anchor"
            />
          </a>

          <div className="crv-meta-strip">
            <div className="crv-meta">
              <span className="crv-meta-key">Open for</span>
              <span className="crv-meta-val">Freelance · Full-time · Collabs</span>
            </div>
            <div className="crv-meta">
              <span className="crv-meta-key">Based</span>
              <span className="crv-meta-val">Point Cook, VIC · remote worldwide</span>
            </div>
            <div className="crv-meta">
              <span className="crv-meta-key">Reply</span>
              <span className="crv-meta-val">Within ~24 hours</span>
            </div>
          </div>

          <nav className="crv-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="crv-soc"
              >
                <span className="crv-soc-icon">{s.icon}</span>
                <span className="crv-soc-text">
                  <span className="crv-soc-label">{s.label}</span>
                  <span className="crv-soc-handle">{s.handle}</span>
                </span>
                <span className="crv-soc-arrow" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>
            ))}
          </nav>
        </div>

        {/* ── Email form (Dispatch Manifest variant) ──────────────── */}
        <form id="contact-form" className="fm-man" onSubmit={handleSubmit} data-cursor="FILL OUT THE FORM!">
          <header className="fm-man-head">
            <span className="fm-man-stamp">EMAIL · 0001</span>
            <span className="fm-man-date">2026 · POINT COOK, VIC</span>
          </header>

          <div className="fm-man-row">
            <span className="fm-man-num">01.</span>
            <span className="fm-man-key">FROM</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="who you are"
              autoComplete="name"
            />
          </div>
          <div className="fm-man-row">
            <span className="fm-man-num">02.</span>
            <span className="fm-man-key">SUBJECT</span>
            <input
              type="text"
              value={subj}
              onChange={(e) => setSubj(e.target.value)}
              placeholder="what about"
            />
          </div>
          <div className="fm-man-row fm-man-row-body">
            <span className="fm-man-num">03.</span>
            <span className="fm-man-key">MESSAGE</span>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="what's on your mind"
            />
          </div>

          <footer className="fm-man-foot">
            <div className="fm-man-sig">
              <span className="fm-man-sig-key">SIG STR.</span>
              <div className="fm-man-sig-bars">
                {bars.map((h, i) => (
                  <span
                    key={i}
                    className={`fm-vox-bar ${i < litCount ? 'is-lit' : ''}`}
                    style={
                      {
                        height: `${h}px`,
                        '--bar-i': i,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <span className="fm-man-sig-val">
                {String(sig).padStart(3, '0')}%
              </span>
            </div>
            <button
              type="submit"
              className="fm-man-send"
              disabled={!body.trim()}
            >
              Send
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </footer>
        </form>

        {/* Bottom ERL mark — matches the original Contact's footer rhythm */}
        <div className="sn-foot">
          <div className="sn-foot-rule" />
          <span className="sn-foot-mark">ERL</span>
          <div className="sn-foot-rule" />
        </div>
        </div>
      </div>

      {/* ── Scoped styles ─────────────────────────────────────────── */}
      <style>{contactStyles}</style>
    </section>
  );
}


/* ──────────────────────────────────────────────────────────────────
   CSS — kept as a template string so the whole component is one file.
   All selectors use prefixes (sn-, crv-, fm-) to avoid collisions.
   ────────────────────────────────────────────────────────────────── */
const contactStyles = `
  #contact {
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  #contact, #contact *, #contact *::before, #contact *::after { box-sizing: border-box; }

  /* Radar grid — concentric rings + cross-hairs centred on the impact.
     overflow:visible lets the top half of the largest rings extend up
     into the Skills section above so the full circle is visible. */
  #contact .sn-radar {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: visible;
    transform-origin: var(--impact-x) var(--impact-y);
  }
  #contact .sn-rings { overflow: visible; }

  /* Pre-reveal: hide everything below the heading until the scroll line
     reaches #contact-cta. Layout stays so ScrollLine can still measure. */
  #contact .sn-reveal {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.7s cubic-bezier(.2,.7,.2,1),
                transform 0.7s cubic-bezier(.2,.7,.2,1);
    pointer-events: none;
  }
  #contact.is-revealed .sn-reveal {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  @media (prefers-reduced-motion: reduce) {
    #contact .sn-reveal { transition: none; }
  }
  #contact .sn-rc {
    stroke: rgba(255,255,255,0.05);
    stroke-width: 0.8;
    fill: none;
    transform-box: fill-box;
    transform-origin: center;
    transform: scale(1);
    vector-effect: non-scaling-stroke;
  }
  #contact .sn-cx {
    stroke: rgba(255,255,255,0.08);
    stroke-width: 1;
    fill: none;
    vector-effect: non-scaling-stroke;
  }

  /* Ripple wave — each ring flashes red with a delay timed to when the
     shockwave actually passes through it. */
  #contact.is-rippling .sn-rc-0 { animation: rc-flash 1.3s ease-out 0.30s forwards; }
  #contact.is-rippling .sn-rc-1 { animation: rc-flash 1.3s ease-out 0.70s forwards; }
  #contact.is-rippling .sn-rc-2 { animation: rc-flash 1.3s ease-out 1.10s forwards; }
  #contact.is-rippling .sn-rc-3 { animation: rc-flash 1.3s ease-out 1.55s forwards; }
  #contact.is-rippling .sn-rc-4 { animation: rc-flash 1.4s ease-out 2.00s forwards; }
  #contact.is-rippling .sn-rc-5 { animation: rc-flash 1.5s ease-out 2.50s forwards; }
  #contact.is-rippling .sn-rc-6 { animation: rc-flash 1.6s ease-out 3.05s forwards; }
  @keyframes rc-flash {
    0%   { stroke: rgba(255,255,255,0.05); stroke-width: 0.8; transform: scale(1);     filter: none; }
    16%  { stroke: rgba(230,57,70,1);      stroke-width: 1.8; transform: scale(1.025); filter: drop-shadow(0 0 5px rgba(230,57,70,0.8)); }
    55%  { stroke: rgba(230,57,70,0.45);   stroke-width: 1.2; transform: scale(1.012); filter: drop-shadow(0 0 2px rgba(230,57,70,0.35)); }
    100% { stroke: rgba(255,255,255,0.05); stroke-width: 0.8; transform: scale(1);     filter: none; }
  }
  #contact.is-rippling .sn-cx {
    animation: cx-flash 1.6s ease-out 0.05s forwards;
  }
  @keyframes cx-flash {
    0%   { stroke: rgba(255,255,255,0.08); stroke-width: 1; }
    14%  { stroke: rgba(230,57,70,0.65);   stroke-width: 1.4; filter: drop-shadow(0 0 4px rgba(230,57,70,0.5)); }
    100% { stroke: rgba(255,255,255,0.08); stroke-width: 1; filter: none; }
  }
  #contact.is-rippling .sn-radar {
    animation: radar-pump 1.3s cubic-bezier(.2,.7,.2,1);
  }
  @keyframes radar-pump {
    0%   { transform: scale(1); }
    10%  { transform: scale(1.03); }
    100% { transform: scale(1); }
  }

  /* Shockwave + core dot */
  #contact .sn-rings {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    z-index: 2;
    pointer-events: none;
    overflow: visible;
  }
  /* Core dot — the original drop-shadow SVG treatment, hosted in its
     own absolutely-positioned SVG (see JSX) so the rings SVG's
     preserveAspectRatio="none" can't distort it. */
  #contact .sn-core-svg {
    position: absolute;
    width: 20px;
    height: 20px;
    transform: translate(-50%, -50%);
    z-index: 3;
    pointer-events: none;
    overflow: visible;
  }
  #contact .sn-core-c {
    r: 7;
    fill: #e63946;
    opacity: 0;
    filter: drop-shadow(0 0 10px rgba(230,57,70,0.9))
            drop-shadow(0 0 2px rgba(230,57,70,1));
    transition: opacity .25s, r .35s cubic-bezier(.2,.7,.2,1);
  }
  /* Sticky once revealed — keeps glowing on subsequent scrolls */
  #contact.is-revealed .sn-core-c {
    opacity: 1;
    animation: sn-core-breathe 2.6s ease-in-out infinite;
  }
  @keyframes sn-core-breathe {
    0%, 100% { r: 7; filter: drop-shadow(0 0 10px rgba(230,57,70,0.9)) drop-shadow(0 0 2px rgba(230,57,70,1)); }
    50%      { r: 8; filter: drop-shadow(0 0 16px rgba(230,57,70,1))   drop-shadow(0 0 3px rgba(230,57,70,1)); }
  }
  #contact .sn-shockwave {
    r: 6;
    fill: none;
    stroke: rgba(230,57,70,1);
    stroke-width: 3;
    opacity: 0;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 8px rgba(230,57,70,0.55));
  }
  /* Shockwave replays each time the section becomes rippling.
     Removing/re-adding .is-rippling restarts the animation, which is
     how the re-trigger on scroll-in works. */
  #contact.is-rippling .sn-shockwave {
    animation: sn-shockwave-grow 4.6s cubic-bezier(.22,.55,.30,1) forwards;
  }
  @keyframes sn-shockwave-grow {
    0%   { r: 6;   opacity: 1;    stroke-width: 3.5; stroke: rgba(230,57,70,1);   filter: drop-shadow(0 0 12px rgba(230,57,70,0.85)); }
    15%  {         opacity: 1;    stroke-width: 3;   }
    45%  {         opacity: 0.7;  stroke-width: 2.2; filter: drop-shadow(0 0 6px rgba(230,57,70,0.55)); }
    75%  {         opacity: 0.28; stroke-width: 1.4; }
    100% { r: 850; opacity: 0;    stroke-width: 0.6; stroke: rgba(230,57,70,0.1); filter: drop-shadow(0 0 0 transparent); }
  }

  /* Wrap + intro text */
  #contact .sn-wrap {
    position: relative; z-index: 5;
    text-align: center;
  }
  #contact .sn-label {
    display: flex; justify-content: center; align-items: center;
    gap: 14px; margin-bottom: 16px;
  }
  #contact .sn-dash { height: 1px; width: 32px; background: #e63946; }
  #contact .sn-label span {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.3em;
    text-transform: uppercase; color: rgba(240,240,240,0.45);
  }
  #contact .sn-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 900;
    font-size: clamp(2.4rem, 6.5vw, 5.5rem);
    line-height: 0.9; letter-spacing: -0.035em;
    margin-bottom: 14px; color: #f0f0f0;
  }
  #contact .sn-accent {
    color: #e63946; font-weight: 500; font-style: italic;
  }
  #contact .sn-period { color: #e63946; }
  #contact .sn-intro {
    font-size: 13.5px; color: rgba(240,240,240,0.45);
    max-width: 56ch; margin: 0 auto 64px;
  }

  /* ─── Reveal block (email + meta + socials) ──────────────────── */
  #contact .crv-email {
    position: relative;
    display: block;
    text-decoration: none;
    color: #f0f0f0;
    padding: 36px 28px 40px;
    text-align: center;
    transition: background .35s ease-out;
  }

  /* Corner-bracket frame — replaces the old top divider + red gradient.
     Four 18px L-shapes drawn with borders, one per corner. */
  #contact .crv-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1.5px solid rgba(230,57,70,0.55);
    pointer-events: none;
    transition: border-color .25s, width .25s, height .25s;
  }
  #contact .crv-corner-tl { top: 0;    left: 0;     border-right: none; border-bottom: none; }
  #contact .crv-corner-tr { top: 0;    right: 0;    border-left:  none; border-bottom: none; }
  #contact .crv-corner-bl { bottom: 0; left: 0;     border-right: none; border-top:    none; }
  #contact .crv-corner-br { bottom: 0; right: 0;    border-left:  none; border-top:    none; }
  #contact .crv-email:hover .crv-corner {
    border-color: #e63946;
    width: 22px;
    height: 22px;
  }
  #contact .crv-cta-anchor {
    position: absolute;
    left: 50%; bottom: 0;
    width: 1px; height: 1px;
    pointer-events: none;
  }
  #contact .crv-email-key {
    display: block;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: rgba(240,240,240,0.25);
    margin-bottom: 16px;
  }
  #contact .crv-email-val {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 3.6rem);
    letter-spacing: -0.03em;
    color: #f0f0f0;
    position: relative;
    transition: color .25s;
  }
  #contact .crv-at { color: #e63946; }
  #contact .crv-email-underline {
    display: block;
    height: 2px;
    width: 0;
    max-width: 480px;
    background: #e63946;
    margin: 6px auto 0;
    transition: width .35s cubic-bezier(.2,.7,.2,1);
  }
  #contact .crv-email:hover .crv-email-underline { width: 100%; }
  #contact .crv-email:hover .crv-email-val { color: #e63946; }

  #contact .crv-meta-strip {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
    margin: 36px 0 44px;
    text-align: left;
  }
  #contact .crv-meta-key {
    display: block;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px; letter-spacing: 0.28em;
    text-transform: uppercase; color: rgba(240,240,240,0.25);
    margin-bottom: 6px;
  }
  #contact .crv-meta-val { font-family: 'Inter', sans-serif; font-size: 13px; color: rgba(240,240,240,0.7); }

  #contact .crv-socials {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  #contact .crv-soc {
    position: relative;
    padding: 22px 18px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 14px;
    border-right: 1px solid rgba(255,255,255,0.06);
    text-decoration: none;
    color: #f0f0f0;
    transition: background .25s;
  }
  #contact .crv-soc:last-child { border-right: none; }
  #contact .crv-soc:hover { background: rgba(230,57,70,0.06); }
  #contact .crv-soc::before {
    content: ''; position: absolute; left: 0; top: 0;
    width: 0%; height: 2px;
    background: #e63946;
    transition: width .3s;
  }
  #contact .crv-soc:hover::before { width: 100%; }
  #contact .crv-soc-icon {
    display: inline-flex; align-items: center;
    color: rgba(240,240,240,0.25);
    transition: color .25s;
  }
  #contact .crv-soc-icon svg { width: 22px; height: 22px; }
  #contact .crv-soc:hover .crv-soc-icon { color: #e63946; }
  #contact .crv-soc-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  #contact .crv-soc-label {
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 15.5px; color: #f0f0f0; line-height: 1.1;
  }
  #contact .crv-soc-handle {
    font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 10.5px;
    color: rgba(240,240,240,0.25); letter-spacing: 0.06em;
  }
  #contact .crv-soc-arrow {
    display: inline-flex; align-items: center;
    color: rgba(240,240,240,0.25);
    transition: color .2s, transform .25s;
  }
  #contact .crv-soc:hover .crv-soc-arrow { color: #e63946; transform: translate(2px, -2px); }

  /* ─── Email form (Dispatch Manifest variant) ─────────────────── */
  #contact .fm-man {
    position: relative;
    z-index: 5;
    margin: 72px auto 0;
    max-width: 720px;
    text-align: left;
    font-family: 'Inter', sans-serif;
    background: #161616;
    padding: 20px 18px;
  }
  #contact .fm-man-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 6px 16px;
    border-bottom: 1px dashed rgba(255,255,255,0.12);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase;
  }
  #contact .fm-man-stamp {
    color: #e63946;
    border: 1px solid rgba(230,57,70,0.4);
    padding: 4px 10px;
  }
  #contact .fm-man-date { color: rgba(240,240,240,0.25); }
  #contact .fm-man-row {
    display: grid;
    grid-template-columns: 40px 110px 1fr;
    align-items: start; gap: 16px;
    padding: 12px 6px;
    border-bottom: 1px dotted rgba(255,255,255,0.06);
  }
  #contact .fm-man-row-body { border-bottom: none; }
  #contact .fm-man-num {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; color: #e63946;
    letter-spacing: 0.04em; padding-top: 7px;
  }
  #contact .fm-man-key {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.25em;
    text-transform: uppercase; color: rgba(240,240,240,0.25);
    padding-top: 9px;
  }
  #contact .fm-man-row input,
  #contact .fm-man-row textarea {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    outline: none;
    color: #f0f0f0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px; padding: 6px 0;
    resize: none; line-height: 1.55;
    transition: border-color .2s;
  }
  #contact .fm-man-row input::placeholder,
  #contact .fm-man-row textarea::placeholder { color: rgba(240,240,240,0.12); }
  #contact .fm-man-row input:focus,
  #contact .fm-man-row textarea:focus { border-bottom-color: #e63946; }
  #contact .fm-man-row textarea { min-height: 90px; }
  #contact .fm-man-foot {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 6px 0;
    border-top: 1px dashed rgba(255,255,255,0.12);
    margin-top: 6px;
    gap: 20px;
  }
  #contact .fm-man-send {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 10px 18px;
    background: transparent; color: #e63946;
    border: 1px solid #e63946;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px; letter-spacing: 0.22em;
    text-transform: uppercase; cursor: pointer;
    transition: background .2s, color .2s;
  }
  #contact .fm-man-send:hover:not(:disabled) { background: #e63946; color: #fff; }
  #contact .fm-man-send:disabled { opacity: 0.4; cursor: not-allowed; }

  #contact .fm-man-sig {
    display: flex; align-items: center; gap: 14px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(240,240,240,0.25);
  }
  #contact .fm-man-sig-val { color: rgba(240,240,240,0.45); font-variant-numeric: tabular-nums; min-width: 38px; }
  #contact .fm-man-sig-bars {
    display: flex; align-items: center; gap: 2px;
    height: 30px; width: 130px;
    justify-content: flex-start;
  }

  /* Sig-strength waveform bars (used in form footer) */
  #contact .fm-vox-bar {
    display: inline-block;
    width: 2px;
    background: #e63946;
    border-radius: 1px;
    opacity: 0.35;
    transform-origin: center;
    transition: height .55s cubic-bezier(.2,.7,.2,1),
                opacity .55s ease-out,
                transform .55s ease-out,
                box-shadow .55s ease-out;
    transition-delay: calc(var(--bar-i, 0) * 22ms);
  }
  #contact .fm-vox-bar:not(.is-lit) {
    animation: bar-idle 1.5s ease-in-out infinite alternate;
    animation-delay: calc(var(--bar-i, 0) * -130ms);
  }
  #contact .fm-vox-bar.is-lit {
    opacity: 0.95;
    transform: scaleY(1);
    box-shadow: 0 0 4px rgba(230,57,70,0.6);
  }
  @keyframes bar-idle {
    from { transform: scaleY(0.25); }
    to   { transform: scaleY(1);    }
  }

  /* ERL foot mark */
  #contact .sn-foot {
    margin-top: 56px;
    display: flex; align-items: center; gap: 18px;
  }
  #contact .sn-foot-rule {
    flex: 1; height: 1px;
    background: linear-gradient(to right, transparent, rgba(230,57,70,0.3), transparent);
  }
  #contact .sn-foot-mark {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 900;
    font-size: 10px; letter-spacing: 0.4em;
    color: rgba(230,57,70,0.4);
  }

  /* Mobile tweaks */
  @media (max-width: 720px) {
    #contact .sn-intro       { font-size: 13px; margin-bottom: 44px; }
    #contact .crv-email      { padding: 26px 14px 30px; }
    /* Match desktop size so the label doesn't look tiny next to the
       big email; nudge letter-spacing tighter so it reads as one phrase
       rather than disconnected letters. */
    #contact .crv-email-key  {
      font-size: 10px; margin-bottom: 14px;
      letter-spacing: 0.24em;
    }
    #contact .crv-email-val  {
      font-size: clamp(1.4rem, 7vw, 2rem);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    #contact .crv-email-underline { max-width: 320px; }
    #contact .crv-corner     { width: 16px; height: 16px; border-width: 1.25px; }
    #contact .crv-email:hover .crv-corner { width: 18px; height: 18px; }
    #contact .crv-meta-strip { grid-template-columns: 1fr; gap: 18px; margin: 28px 0 36px; }
    #contact .crv-socials    { grid-template-columns: repeat(2, 1fr); }
    #contact .crv-soc        { padding: 18px 14px; gap: 10px; }
    #contact .crv-soc-icon svg { width: 18px; height: 18px; }
    #contact .crv-soc-label  { font-size: 14px; }
    #contact .crv-soc-handle { font-size: 9.5px; }
    #contact .crv-soc:nth-child(2) { border-right: none; }
    #contact .crv-soc:nth-child(-n+2) { border-bottom: 1px solid rgba(255,255,255,0.06); }
    #contact .fm-man         { margin-top: 56px; padding: 16px 14px; }
    /* "EMAIL · 0001" + "2026 · POINT COOK, VIC" together are wider than
       a phone — stack them on top of each other instead of squeezing
       them on one row. */
    #contact .fm-man-head    {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding-bottom: 14px;
      font-size: 9px;
      letter-spacing: 0.22em;
    }
    #contact .fm-man-stamp   { padding: 3px 8px; }
    #contact .fm-man-row     { grid-template-columns: 28px 1fr; gap: 8px; padding: 10px 4px; }
    #contact .fm-man-num     { padding-top: 0; font-size: 11px; grid-row: 1; }
    #contact .fm-man-key     { padding-top: 0; font-size: 9px; grid-row: 1; grid-column: 2; }
    #contact .fm-man-row input,
    #contact .fm-man-row textarea { grid-column: 1 / -1; }
    #contact .fm-man-foot    { flex-direction: column; align-items: stretch; gap: 14px; }
    #contact .fm-man-sig     { justify-content: space-between; }
    #contact .fm-man-sig-bars { width: 100px; }
  }
`;
