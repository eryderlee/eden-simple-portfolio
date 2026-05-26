'use client';

import { useEffect, useRef } from 'react';

/* ───────────────────────────────────────────── */
/* Types & Data                                    */
/* ───────────────────────────────────────────── */

type RoleType = 'work' | 'edu' | 'service' | 'cert';

interface Role {
  name: string;
  org: string;
  type: Exclude<RoleType, 'cert'>;
  start: number; // month index from Jan 2021 = 0
  end: number;
  active: boolean;
  period: string;
  desc: string;
}

interface Cert {
  name: string;
  type: 'cert';
  at: number;
  period: string;
  badge?: string;
  desc: string;
}

const SPAN = 65; // Jan 2021 (0) → Jun 2026 (65)
const mIdx = (y: number, mo: number) => (y - 2021) * 12 + mo;
const pct = (mi: number) => (mi / SPAN) * 100;

const ROLES: Role[] = [
  { name: 'IB Studies',    org: 'Queensland Academy of Health Science', type: 'edu',     start: mIdx(2021, 0),  end: mIdx(2023, 11), active: false, period: '2021 – 2023',         desc: 'International Baccalaureate. High grade. Dragon dancing, tai chi, badminton, volleyball, jiu-jitsu on the side.' },
  { name: 'Chef',          org: 'Sushi Train',                            type: 'service', start: mIdx(2022, 11), end: mIdx(2023, 11), active: false, period: 'Dec 2022 – Dec 2023', desc: 'Year of night shifts through high school. Where the work-under-pressure habit started.' },
  { name: 'BSc Computing', org: 'University of Melbourne',                type: 'edu',     start: mIdx(2024, 0),  end: mIdx(2026, 5),  active: true,  period: '2024 – Present',      desc: 'Computing & Software Systems undergrad. Concurrent with everything else listed here.' },
  { name: 'Web Developer', org: 'Freelance / RyderAgency',                type: 'work',    start: mIdx(2024, 0),  end: mIdx(2026, 5),  active: true,  period: '2024 – Present',      desc: 'Sites for car companies, accountants, agencies. SEO-first, responsive, conversion-focused.' },
  { name: 'Waiter',        org: 'Jade Stream',                            type: 'service', start: mIdx(2024, 7),  end: mIdx(2024, 11), active: false, period: 'Aug – Dec 2024',      desc: 'Service shifts while at uni. Paid rent.' },
  { name: 'CTO',           org: 'Baseaim',                                type: 'work',    start: mIdx(2025, 5),  end: mIdx(2026, 5),  active: true,  period: 'Jun 2025 – Present',  desc: 'Marketing agency for accountants. Built the AI chatbot, voice agent, automated CRM, 93 n8n workflows shipped.' },
  { name: 'Partner',       org: 'CoFarming-Hub',                          type: 'work',    start: mIdx(2025, 0),  end: mIdx(2026, 5),  active: true,  period: '2025 – Present',      desc: 'Sustainable agriculture startup. Website, e-commerce, investor decks, business systems.' },
];

const CERTS: Cert[] = [
  { name: 'HubSpot Inbound', type: 'cert', at: mIdx(2026, 1), period: 'Feb 2026',                  desc: 'Inbound Marketing certification.' },
  { name: 'Lyra Certified',  type: 'cert', at: mIdx(2026, 2), period: 'Mar 2026', badge: 'Top 5%', desc: 'Lyra Certified Full-Stack Engineer · Top 5% in cohort.' },
];

const NOW_PCT = pct(mIdx(2026, 4));
const SWEEP_DURATION = 5500;

/* ───────────────────────────────────────────── */
/* Component                                       */
/* ───────────────────────────────────────────── */

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const tlBodyRef = useRef<HTMLDivElement>(null);
  const sweepLineRef = useRef<HTMLDivElement>(null);
  const sweepYearRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  /* Popover */
  const showPop = (e: React.MouseEvent, item: Role | Cert, type: RoleType) => {
    const pop = popoverRef.current;
    if (!pop) return;
    pop.className = `role-popover ${type} visible`;
    (pop.querySelector('.pop-name') as HTMLElement).textContent = item.name;
    (pop.querySelector('.pop-org') as HTMLElement).textContent =
      'org' in item ? item.org : 'badge' in item && item.badge ? item.badge : 'Certification';
    (pop.querySelector('.pop-period') as HTMLElement).textContent = item.period;
    (pop.querySelector('.pop-desc') as HTMLElement).textContent = item.desc;
    posPop(e);
  };
  const posPop = (e: React.MouseEvent) => {
    const pop = popoverRef.current;
    if (!pop) return;
    const pad = 16;
    const safe = 8;
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    // Flip to the other side if it would escape the right edge…
    if (x + w > window.innerWidth - safe) x = e.clientX - w - pad;
    // …then clamp to the left edge in case the cursor itself is near 0.
    if (x < safe) x = safe;
    if (y + h > window.innerHeight - safe) y = e.clientY - h - pad;
    if (y < safe) y = safe;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
  };
  const hidePop = () => {
    popoverRef.current?.classList.remove('visible');
  };

  /* Sweep + reveal animations */
  useEffect(() => {
    const timelineEl = timelineRef.current;
    const tlBody = tlBodyRef.current;
    const sweepYearEl = sweepYearRef.current;
    if (!timelineEl || !tlBody || !sweepYearEl) return;

    function startSweep() {
      timelineEl!.classList.add('animate');
      const bars = tlBody!.querySelectorAll<HTMLElement>('.tl-bar');
      const dots = tlBody!.querySelectorAll<HTMLElement>('.tl-cert-dot');
      const sweepEl = sweepLineRef.current;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduced ? 0 : SWEEP_DURATION;
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        const t = duration === 0 ? 1 : Math.min(1, elapsed / duration);
        const currentPct = t * NOW_PCT;
        const monthIdx = (currentPct / 100) * SPAN;
        const yr = Math.min(2026, 2021 + Math.floor(monthIdx / 12));
        sweepYearEl!.textContent = String(yr);
        if (sweepEl) {
          sweepEl.style.left = `${currentPct}%`;
          // Fade in over the first 3% of the sweep, matching the original keyframe
          sweepEl.style.opacity = String(Math.min(1, t * 33));
        }
        bars.forEach((el) => {
          const startPct = parseFloat(el.dataset.startPct || '0');
          const endPct = parseFloat(el.dataset.endPct || '0');
          let reveal: number;
          if (currentPct <= startPct) reveal = 0;
          else if (currentPct >= endPct) reveal = 1;
          else reveal = (currentPct - startPct) / (endPct - startPct);
          el.style.setProperty('--reveal', reveal.toFixed(4));
        });
        dots.forEach((el) => {
          const startPct = parseFloat(el.dataset.startPct || '0');
          if (currentPct >= startPct) el.classList.add('revealed');
        });
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startSweep();
            io.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    io.observe(timelineEl);

    /* Generic reveal observer for the rest of the page */
    const revealEls = sectionRef.current?.querySelectorAll('.reveal-up, .reveal-left, .reveal-stagger');
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );
    revealEls?.forEach((el) => revealIO.observe(el));

    return () => {
      io.disconnect();
      revealIO.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section-grain relative bg-black border-t border-white/[0.04] pt-24 pb-24 md:pt-36 px-5"
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-0 md:px-8 w-full" style={{ zIndex: 2 }}>

        {/* Heading */}
        <div className="reveal-up flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            Experience
          </span>
        </div>
        <h2 className="reveal-left font-display font-black text-[clamp(2rem,5vw,5rem)] leading-[0.92] tracking-[-0.03em] text-[#f0f0f0] mb-3">
          Trajectory<br />
          <span className="text-[#e63946]">2021 → Now</span>
        </h2>
        <p className="reveal-up text-[14px] text-[#f0f0f0]/45 max-w-[56ch] mb-10">
          The timeline shows everything overlapping. Below it, the active stuff first, then the path to get here.
        </p>

        {/* Legend */}
        <div className="reveal-up flex flex-wrap gap-x-[18px] gap-y-2 mb-4 font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0f0f0]/45">
          <Legend swatchClass="bg-[#e63946]" label="Work" />
          <Legend swatchClass="bg-[#61afef]" label="Education" />
          <Legend swatchClass="bg-[#f0a500]" label="Service" />
          <Legend dot label="Certification" color="#22c55e" />
          <div className="hidden sm:block ml-auto text-[#f0f0f0]/25">↪ Hover for details</div>
        </div>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className="timeline relative bg-[#141414]/60 border border-white/[0.06] rounded overflow-hidden mb-14"
        >
          {/* Header */}
          <div className="relative h-10 border-b border-white/[0.06] bg-black/20">
            {[2021, 2022, 2023, 2024, 2025, 2026].map((y, i) => (
              <div
                key={y}
                className="absolute top-0 bottom-0 flex items-center font-mono text-[11px] text-[#f0f0f0]/45 tracking-[0.1em] h-full"
                style={{
                  left: `${pct(mIdx(y, 0))}%`,
                  paddingLeft: i === 0 ? 16 : 12,
                  borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {y}
              </div>
            ))}
            {/* Sweep line */}
            <div
              ref={sweepLineRef}
              className="sweep-line"
              style={{ left: 0, ['--now-left' as string]: `${NOW_PCT}%` }}
            >
              <span ref={sweepYearRef} className="sweep-year">2021</span>
            </div>
          </div>

          {/* Body */}
          <div
            ref={tlBodyRef}
            className="relative py-4"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: 'calc(100% / 5) 100%',
              backgroundPosition: '18.5% 0, 36.9% 0, 55.4% 0, 73.8% 0, 92.3% 0',
            }}
          >
            {ROLES.map((r) => (
              <div key={r.name} className="relative h-11 my-1">
                <div
                  className="tl-bar"
                  data-type={r.type}
                  data-start-pct={pct(r.start)}
                  data-end-pct={pct(r.end)}
                  style={{
                    left: `${pct(r.start)}%`,
                    width: `${pct(r.end - r.start)}%`,
                  }}
                  onMouseEnter={(e) => showPop(e, r, r.type)}
                  onMouseMove={posPop}
                  onMouseLeave={hidePop}
                >
                  <span className="bar-title">{r.name}</span>
                  <span className="bar-org">{r.org}</span>
                </div>
              </div>
            ))}

            {/* Cert dots row */}
            <div className="tl-cert-dots-row">
              {CERTS.map((c) => (
                <div
                  key={c.name}
                  className="tl-cert-dot"
                  data-start-pct={pct(c.at)}
                  style={{ left: `${pct(c.at)}%` }}
                  onMouseEnter={(e) => showPop(e, c, 'cert')}
                  onMouseMove={posPop}
                  onMouseLeave={hidePop}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 px-[18px] py-[14px] border-t border-white/[0.06] bg-black/20 font-mono text-[10px] tracking-[0.1em] uppercase text-[#f0f0f0]/45">
            <Stat strong="5" strongAccent label="active" />
            <Stat strong="2" label="businesses" />
            <Stat strong="1" label="undergrad" />
            <Stat strong="4" label="certs" />
          </div>
        </div>

        {/* Currently */}
        <div className="reveal-up relative px-5 sm:px-7 pt-6 sm:pt-7 pb-5 sm:pb-6 border border-white/[0.12] border-l-[3px] border-l-[#e63946] mb-7" style={{ background: 'linear-gradient(135deg, rgba(230,57,70,0.04), transparent 50%)' }}>
          <span className="absolute top-[18px] right-[18px] w-2 h-2 rounded-full bg-[#e63946] animate-pulse" style={{ boxShadow: '0 0 10px #e63946' }} />
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#e63946] mb-[18px]">
            Currently — active commitments
          </div>
          <div className="reveal-stagger grid gap-[18px]">
            <NowItem title="CTO" org="Baseaim" period="Jun 2025 — Present">
              Marketing agency for accountants. Built the AI chatbot, voice agent, automated CRM, and 93 n8n workflows currently running in production.
            </NowItem>
            <NowItem title="Partner" org="CoFarming-Hub" period="2025 — Present">
              Sustainable agriculture startup. Designed the website, e-commerce layer, investor decks, business systems.
            </NowItem>
            <NowItem title="BSc Computing & Software Systems" org="UniMelb" period="2024 — Present">
              Undergrad in computing. Same time as the agency work.
            </NowItem>
            <NowItem title="Web Developer" org="Freelance / RyderAgency" period="2024 — Present">
              Sites for car companies, accountants, agencies. SEO-first, responsive, conversion-focused.
            </NowItem>
          </div>
        </div>

        {/* Milestones */}
        <div className="reveal-up mb-7 px-5 sm:px-7 py-4 sm:py-[22px] border border-white/[0.06]">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0f0f0]/45 mb-[14px]">
            Recent milestones
          </div>
          <div className="reveal-stagger">
            <Milestone text="Lyra Certified · Full-Stack Engineer" badge="Top 5%" date="Mar 2026" />
            <Milestone text="HubSpot Inbound Marketing" date="Feb 2026" />
          </div>
        </div>

        {/* Path here */}
        <div className="reveal-up">
          <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0f0f0]/45 mb-[14px] pt-2">
            <span className="text-[#e63946]">— </span>Path here
          </div>
          <div className="reveal-stagger">
            <PathRow year="2024" items={[{ title: 'Waiter', org: 'Jade Stream', meta: 'Aug – Dec 2024' }]} />
            <PathRow year="2023" items={[
              { title: 'International Baccalaureate completed', org: 'Queensland Academy' },
              { title: 'Chef', org: 'Sushi Train', meta: 'until Dec 2023' },
            ]} />
            <PathRow year="2022" items={[{ title: 'Chef', org: 'Sushi Train', meta: 'from Dec 2022' }]} />
            <PathRow year="2021" items={[
              { title: 'International Baccalaureate started', org: 'Queensland Academy' },
              { title: 'Cert III · Laboratory Skills', meta: 'Jun 2021' },
              { title: 'Cert II · Sampling & Measurement', meta: 'Jun 2021' },
            ]} />
          </div>
        </div>
      </div>

      {/* Popover */}
      <div ref={popoverRef} className="role-popover">
        <div className="pop-name" />
        <div className="pop-org" />
        <div className="pop-period" />
        <div className="pop-desc" />
      </div>

      <style jsx>{`
        /* Sweep line */
        .sweep-line {
          position: absolute;
          top: 0; bottom: -800px;
          width: 2px;
          background: linear-gradient(to bottom, #e63946, transparent 95%);
          box-shadow: 0 0 12px #e63946, 0 0 24px rgba(230,57,70,0.4);
          z-index: 6;
          pointer-events: none;
          opacity: 0;
        }
        .sweep-year {
          position: absolute;
          top: 4px;
          left: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #e63946;
          letter-spacing: 0.2em;
          background: #111;
          padding: 4px 8px;
          border: 1px solid #e63946;
          border-radius: 2px;
          white-space: nowrap;
          transform: translateX(-100%);
          margin-left: -2px;
        }
        /* Sweep position + opacity are driven from JS in the RAF tick so they
           stay in sync with the bar reveal — keyframes inside styled-jsx
           combined with :global() selectors are unreliable. */

        /* Timeline bars */
        :global(.tl-bar) {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 34px;
          background: rgba(230,57,70,0.08);
          border-left: 3px solid #e63946;
          padding: 0 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          white-space: nowrap;
          z-index: 2;
          transition: background 0.2s;
          clip-path: inset(0 calc(100% * (1 - var(--reveal, 0))) 0 0);
          cursor: pointer;
        }
        :global(.tl-bar:hover) { background: rgba(230,57,70,0.18); }
        :global(.tl-bar[data-type="edu"]) {
          background: rgba(97,175,239,0.08);
          border-left-color: #61afef;
        }
        :global(.tl-bar[data-type="edu"]:hover) { background: rgba(97,175,239,0.18); }
        :global(.tl-bar[data-type="service"]) {
          background: rgba(240,165,0,0.08);
          border-left-color: #f0a500;
        }
        :global(.tl-bar[data-type="service"]:hover) { background: rgba(240,165,0,0.18); }
        :global(.tl-bar .bar-title) {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #f0f0f0;
        }
        :global(.tl-bar .bar-org) {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          color: rgba(240,240,240,0.45);
        }

        /* Cert dots */
        :global(.tl-cert-dots-row) {
          position: relative;
          height: 20px;
          margin: 4px 0;
        }
        :global(.tl-cert-dot) {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e, 0 0 0 3px rgba(34,197,94,0.15);
          z-index: 3;
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
          cursor: pointer;
        }
        :global(.tl-cert-dot.revealed) {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        :global(.tl-cert-dot:hover) {
          transform: translate(-50%, -50%) scale(1.35) !important;
        }

        /* Popover */
        :global(.role-popover) {
          position: fixed;
          pointer-events: none;
          background: rgba(20,20,20,0.98);
          border: 1px solid #e63946;
          backdrop-filter: blur(12px);
          padding: 14px 18px;
          z-index: 1000;
          min-width: 240px;
          max-width: 320px;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.15s, transform 0.15s;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        }
        :global(.role-popover.visible) {
          opacity: 1;
          transform: translateY(0);
        }
        :global(.role-popover.work) { border-color: #e63946; }
        :global(.role-popover.edu) { border-color: #61afef; }
        :global(.role-popover.service) { border-color: #f0a500; }
        :global(.role-popover.cert) { border-color: #22c55e; }
        :global(.role-popover .pop-name) {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 14px;
          color: #f0f0f0;
          margin-bottom: 2px;
        }
        :global(.role-popover .pop-org) {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #e63946;
          margin-bottom: 10px;
        }
        :global(.role-popover.work .pop-org) { color: #e63946; }
        :global(.role-popover.edu .pop-org) { color: #61afef; }
        :global(.role-popover.service .pop-org) { color: #f0a500; }
        :global(.role-popover.cert .pop-org) { color: #22c55e; }
        :global(.role-popover .pop-period) {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,240,240,0.25);
          margin-bottom: 10px;
        }
        :global(.role-popover .pop-desc) {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          line-height: 1.55;
          color: rgba(240,240,240,0.7);
        }

        /* Reveal animations */
        :global(.reveal-up) {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1),
                      transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        :global(.reveal-up.in) { opacity: 1; transform: translateY(0); }
        :global(.reveal-left) {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
                      transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        :global(.reveal-left.in) { opacity: 1; transform: translateX(0); }
        :global(.reveal-stagger > *) {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.7, 0.2, 1),
                      transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
        }
        :global(.reveal-stagger.in > *:nth-child(1)) { transition-delay: 0.05s; opacity: 1; transform: translateY(0); }
        :global(.reveal-stagger.in > *:nth-child(2)) { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
        :global(.reveal-stagger.in > *:nth-child(3)) { transition-delay: 0.25s; opacity: 1; transform: translateY(0); }
        :global(.reveal-stagger.in > *:nth-child(4)) { transition-delay: 0.35s; opacity: 1; transform: translateY(0); }
        :global(.reveal-stagger.in > *:nth-child(5)) { transition-delay: 0.45s; opacity: 1; transform: translateY(0); }
        :global(.reveal-stagger.in > *:nth-child(6)) { transition-delay: 0.55s; opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          :global(.reveal-up),
          :global(.reveal-left),
          :global(.reveal-stagger > *) {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
          :global(.tl-bar) { clip-path: none; }
          :global(.tl-cert-dot) {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* ── Mobile ──────────────────────────────────────────────── */
        @media (max-width: 720px) {
          :global(.role-popover) {
            min-width: 0;
            max-width: calc(100vw - 16px);
            padding: 12px 14px;
          }
          :global(.role-popover .pop-name) { font-size: 13px; }
          :global(.role-popover .pop-org)  { font-size: 11px; }
          :global(.role-popover .pop-desc) { font-size: 11px; line-height: 1.5; }

          /* Bars on mobile: keep the visual rhythm but drop the org sub-label
             (most bars are too narrow to render any text legibly) and shrink
             the title size. Cert dots shrink to match. */
          :global(.tl-bar) {
            height: 28px;
            padding: 0 8px;
            gap: 6px;
          }
          :global(.tl-bar .bar-title) { font-size: 11px; }
          :global(.tl-bar .bar-org)   { display: none; }
          :global(.tl-cert-dot) {
            width: 11px;
            height: 11px;
          }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────────────────────── */
/* Sub-components                                  */
/* ───────────────────────────────────────────── */

function Legend({ swatchClass, dot, color, label }: { swatchClass?: string; dot?: boolean; color?: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      {dot ? (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      ) : (
        <span className={`${swatchClass} w-[14px] h-[3px] rounded-[1px]`} />
      )}
      {label}
    </div>
  );
}

function Stat({ strong, strongAccent, label }: { strong: string; strongAccent?: boolean; label: string }) {
  return (
    <div>
      <strong
        className="font-display font-bold text-[18px] mr-2"
        style={{ color: strongAccent ? '#e63946' : '#f0f0f0' }}
      >
        {strong}
      </strong>
      {label}
    </div>
  );
}

function NowItem({ title, org, period, children }: { title: string; org: string; period: string; children: React.ReactNode }) {
  return (
    <div className="pb-[18px] border-b border-white/[0.06] last:border-b-0 last:pb-0">
      <div className="flex flex-wrap items-baseline gap-x-[14px] gap-y-1 mb-1.5">
        <span className="font-display font-bold text-[17px] text-[#f0f0f0] tracking-[-0.01em]">
          {title} <span className="text-[#e63946]">· {org}</span>
        </span>
        <span className="ml-auto font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0f0f0]/45">
          {period}
        </span>
      </div>
      <p className="text-[13px] leading-[1.65] text-[#f0f0f0]/45 max-w-[65ch]">{children}</p>
    </div>
  );
}

function Milestone({ text, badge, date }: { text: string; badge?: string; date: string }) {
  return (
    <div className="flex items-center gap-[14px] py-2 border-t border-white/[0.06] first:border-t-0">
      <span className="text-[#22c55e] font-mono">★</span>
      <span className="flex-1 text-[13px] text-[#f0f0f0]/70">
        {text}
        {badge && (
          <span className="inline-block ml-2 font-mono text-[9px] tracking-[0.15em] uppercase text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-1.5 py-[1px]">
            {badge}
          </span>
        )}
      </span>
      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0f0f0]/25">{date}</span>
    </div>
  );
}

function PathRow({ year, items }: { year: string; items: Array<{ title: string; org?: string; meta?: string }> }) {
  return (
    <div className="grid items-baseline py-2.5 border-t border-white/[0.06]" style={{ gridTemplateColumns: '56px 1fr' }}>
      <span className="font-mono text-[11px] text-[#f0f0f0]/25 tracking-[0.1em]">{year}</span>
      <div className="flex flex-col gap-1 text-[13px] text-[#f0f0f0]/70">
        {items.map((it, i) => (
          <div key={i}>
            {it.title}
            {it.org && <span className="text-[#e63946]"> · {it.org}</span>}
            {it.meta && <span className="ml-1.5 font-mono text-[10px] text-[#f0f0f0]/25 tracking-[0.05em]">{it.meta}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
