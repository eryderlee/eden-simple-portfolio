'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ───────────────────────────────────────────── */
/* Types                                          */
/* ───────────────────────────────────────────── */

type Tier = 'expert' | 'proficient' | 'familiar';
type Group = 'Languages' | 'Frontend' | 'Backend' | 'Data' | 'Automation' | 'Infra';

interface Skill {
  name: string;
  group: Group;
  tier: Tier;
  projects: string[];
}

/* ───────────────────────────────────────────── */
/* Data — edit these arrays to add/remove skills  */
/* ───────────────────────────────────────────── */

const SKILLS: Skill[] = [
  // Languages
  { name: 'TypeScript', group: 'Languages', tier: 'expert', projects: ['Baseaim', 'Airtable Clone', 'ClientHub', 'MVPcommunity', 'Portfolio'] },
  { name: 'JavaScript', group: 'Languages', tier: 'expert', projects: ['Baseaim', 'CYS', 'CoFarming', 'every web project'] },
  { name: 'HTML', group: 'Languages', tier: 'proficient', projects: ['CYS', 'CoFarming', 'most landing pages'] },
  { name: 'CSS', group: 'Languages', tier: 'proficient', projects: ['CYS', 'CoFarming', 'Portfolio'] },
  { name: 'Python', group: 'Languages', tier: 'familiar', projects: ['Coursework', 'misc scripts'] },
  { name: 'C', group: 'Languages', tier: 'familiar', projects: ['AI Puzzle Solver'] },

  // Frontend
  { name: 'React', group: 'Frontend', tier: 'expert', projects: ['Baseaim', 'ClientHub', 'Airtable Clone', 'MVPcommunity', 'Portfolio'] },
  { name: 'Next.js', group: 'Frontend', tier: 'expert', projects: ['Baseaim', 'ClientHub', 'MVPcommunity', 'RyderAgency', 'Portfolio'] },
  { name: 'Tailwind CSS', group: 'Frontend', tier: 'expert', projects: ['Baseaim', 'ClientHub', 'Portfolio'] },
  { name: 'GSAP', group: 'Frontend', tier: 'proficient', projects: ['Portfolio', 'Baseaim'] },
  { name: 'TanStack Query', group: 'Frontend', tier: 'familiar', projects: ['Airtable Clone'] },

  // Backend
  { name: 'Node.js', group: 'Backend', tier: 'expert', projects: ['Baseaim', 'ClientHub', '93 workflows'] },
  { name: 'REST APIs', group: 'Backend', tier: 'expert', projects: ['Baseaim', 'ClientHub', '93 workflows'] },
  { name: 'tRPC', group: 'Backend', tier: 'proficient', projects: ['Airtable Clone'] },
  { name: 'Prisma', group: 'Backend', tier: 'proficient', projects: ['ClientHub', 'MVPcommunity'] },
  { name: 'NextAuth', group: 'Backend', tier: 'proficient', projects: ['ClientHub', 'MVPcommunity'] },

  // Data
  { name: 'PostgreSQL', group: 'Data', tier: 'proficient', projects: ['Airtable Clone', 'ClientHub'] },
  { name: 'Supabase', group: 'Data', tier: 'expert', projects: ['Baseaim', 'MVPcommunity', 'RAG chatbot'] },
  { name: 'Vector DB (RAG)', group: 'Data', tier: 'proficient', projects: ['Baseaim Chatbot'] },
  { name: 'MongoDB', group: 'Data', tier: 'familiar', projects: ['Coursework'] },

  // Automation
  { name: 'n8n', group: 'Automation', tier: 'expert', projects: ['93 workflows shipped'] },
  { name: 'OpenAI API', group: 'Automation', tier: 'expert', projects: ['Chatbot', 'voice agent', 'content workflows'] },
  { name: 'Retell', group: 'Automation', tier: 'proficient', projects: ['Baseaim Voice Agent'] },
  { name: 'Cal.com', group: 'Automation', tier: 'proficient', projects: ['Voice Agent', 'booking workflows'] },
  { name: 'SignNow', group: 'Automation', tier: 'proficient', projects: ['Contract Generator'] },

  // Infra
  { name: 'Git', group: 'Infra', tier: 'expert', projects: ['everything'] },
  { name: 'GitHub', group: 'Infra', tier: 'expert', projects: ['everything'] },
  { name: 'Vercel', group: 'Infra', tier: 'expert', projects: ['most web projects'] },
  { name: 'Stripe', group: 'Infra', tier: 'proficient', projects: ['Baseaim', 'ClientHub'] },
  { name: 'Figma', group: 'Infra', tier: 'proficient', projects: ['design files'] },
  { name: 'Netlify', group: 'Infra', tier: 'familiar', projects: ['legacy deployments'] },
];

const HOBBIES = [
  'Gym',
  'Dragon dancing',
  'Muay thai',
  'Badminton',
  'Pickleball',
  'Jiu-jitsu',
  'PC building',
  'Beatboxing',
];

const GROUPS: Group[] = ['Languages', 'Frontend', 'Backend', 'Data', 'Automation', 'Infra'];

const TIER_ORDER: Record<Tier, number> = { expert: 0, proficient: 1, familiar: 2 };

const TIER_LABEL: Record<Tier, string> = {
  expert: 'Expert · daily driver',
  proficient: 'Proficient · shipped with',
  familiar: 'Familiar · explored',
};

const TIER_COLOR: Record<Tier, string> = {
  expert: '#e63946',
  proficient: '#f0a500',
  familiar: 'rgba(240,240,240,0.6)',
};

/* ───────────────────────────────────────────── */
/* Main component                                  */
/* ───────────────────────────────────────────── */

type ViewMode = 'rendered' | 'raw';

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popNameRef = useRef<HTMLDivElement>(null);
  const popTierLabelRef = useRef<HTMLSpanElement>(null);
  const popTierDotRef = useRef<HTMLSpanElement>(null);
  const popProjectsRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<ViewMode>('rendered');

  /* ── Popover handlers (ref-based; no re-renders) ── */
  const showPop = useCallback((e: React.MouseEvent, skill: Skill) => {
    const pop = popoverRef.current;
    if (!pop) return;
    if (popNameRef.current) popNameRef.current.textContent = skill.name;
    if (popTierLabelRef.current) popTierLabelRef.current.textContent = TIER_LABEL[skill.tier];
    if (popTierDotRef.current) {
      popTierDotRef.current.style.background = TIER_COLOR[skill.tier];
      popTierDotRef.current.style.boxShadow =
        skill.tier === 'expert' ? `0 0 8px ${TIER_COLOR[skill.tier]}` : 'none';
    }
    if (popProjectsRef.current) {
      popProjectsRef.current.innerHTML = skill.projects.length
        ? skill.projects
            .map(
              (p) =>
                `<span class="block py-0.5"><span class="text-[#e63946] mr-1">→</span>${p}</span>`,
            )
            .join('')
        : '<span class="italic text-[#f0f0f0]/25">No public project yet</span>';
    }
    positionPop(e);
    pop.classList.remove('opacity-0', 'translate-y-1');
    pop.classList.add('opacity-100', 'translate-y-0');
  }, []);

  const movePop = useCallback((e: React.MouseEvent) => {
    positionPop(e);
  }, []);

  const hidePop = useCallback(() => {
    const pop = popoverRef.current;
    if (!pop) return;
    pop.classList.add('opacity-0', 'translate-y-1');
    pop.classList.remove('opacity-100', 'translate-y-0');
  }, []);

  const positionPop = (e: React.MouseEvent) => {
    const pop = popoverRef.current;
    if (!pop) return;
    const pad = 16;
    const safe = 8;
    const w = pop.offsetWidth;
    const h = pop.offsetHeight;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    if (x + w > window.innerWidth - safe) x = e.clientX - w - pad;
    if (x < safe) x = safe;
    if (y + h > window.innerHeight - safe) y = e.clientY - h - pad;
    if (y < safe) y = safe;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
  };

  /* ── Scroll-triggered animations (match Skills.tsx pattern) ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-label', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      });

      gsap.fromTo(
        '.skills-heading',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: '.skills-heading', start: 'top 80%' },
        },
      );

      gsap.fromTo(
        '.skills-editor',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.skills-editor', start: 'top 85%' },
        },
      );

      gsap.fromTo(
        '.skill-row',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.skills-editor', start: 'top 80%', once: true },
        },
      );

      gsap.fromTo(
        '.hobbies-row',
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.hobbies-row', start: 'top 92%' },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── Fade body on view toggle ── */
  useEffect(() => {
    const panel = document.querySelector('.editor-panel') as HTMLElement | null;
    if (!panel) return;
    gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
  }, [view]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="section-grain relative bg-black border-t border-white/[0.04] pt-24 pb-16 md:pt-36 md:pb-0 px-5"
    >
      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div
        className="relative max-w-6xl mx-auto px-0 md:px-8 w-full"
        style={{ position: 'relative', zIndex: 2 }}
      >
        {/* Heading */}
        <div className="skills-label flex items-center gap-4 mb-6">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            Skills
          </span>
        </div>
        <h2 className="skills-heading font-display font-black text-[clamp(2rem,5vw,5rem)] leading-[0.88] tracking-[-0.03em] text-[#f0f0f0] mb-10 opacity-0">
          Tools of
          <br />
          <span className="text-[#e63946]">the trade</span>
        </h2>

        {/* Editor frame */}
        <div className="skills-editor rounded-md overflow-hidden border border-white/[0.12] bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.6)] opacity-0">
          {/* Chrome */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#1a1a1a] border-b border-white/[0.08] flex-wrap">
            <div className="flex gap-1.5">
              <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] opacity-65" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e] opacity-65" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#28c840] opacity-65" />
            </div>
            <div className="font-mono text-[11px] text-[#f0f0f0]/45 flex items-center gap-1">
              <span>~</span>
              <span className="text-[#f0f0f0]/25">/</span>
              <span>eden-portfolio</span>
              <span className="text-[#f0f0f0]/25">/</span>
              <span className="text-[#e63946]">skills.ts</span>
              <span className="text-[#e63946]/70 ml-1">●</span>
            </div>
            <div
              className="ml-auto inline-flex border border-white/[0.12] rounded-sm overflow-hidden"
              role="tablist"
            >
              {(['rendered', 'raw'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors ${
                    view === v
                      ? 'bg-[#e63946]/[0.12] text-[#e63946]'
                      : 'text-[#f0f0f0]/45 hover:text-[#f0f0f0]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="editor-panel min-h-[480px]">
            {view === 'rendered' ? (
              <RenderedView showPop={showPop} movePop={movePop} hidePop={hidePop} />
            ) : (
              <RawView showPop={showPop} movePop={movePop} hidePop={hidePop} />
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-5 px-4 py-2 bg-[#1a1a1a] border-t border-white/[0.08] font-mono text-[10px] text-[#f0f0f0]/30">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-pulse" />
              3 tiers
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#f0f0f0]/60">{SKILLS.length}</span> entries
            </div>
            <div>↪ hover for projects</div>
            <div className="ml-auto">View: {view === 'rendered' ? 'rendered' : 'raw · skills.ts'}</div>
          </div>
        </div>

        {/* Hobbies strip */}
        <div className="mt-16 pt-10 border-t border-white/[0.05]">
          <h3 className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/45 mb-4">
            <span className="text-[#e63946]">— </span>Outside the editor
          </h3>
          <div className="hobbies-row flex flex-wrap gap-x-6 gap-y-2.5 font-display text-[15px] text-[#f0f0f0]/70">
            {HOBBIES.map((h, i) => (
              <span key={h} className="relative">
                {h}
                {i < HOBBIES.length - 1 && (
                  <span className="absolute -right-3.5 text-[#f0f0f0]/25">·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating popover */}
      <div
        ref={popoverRef}
        className="fixed pointer-events-none bg-[rgba(20,20,20,0.98)] border border-[#e63946] backdrop-blur-md z-[1000] opacity-0 translate-y-1 transition-all duration-150 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(230,57,70,0.1)]"
        style={{
          padding: '14px 18px',
          // Stay readable on phones: shrink min-width on narrow viewports and
          // never let max-width push past the viewport edges.
          minWidth: 'min(240px, calc(100vw - 32px))',
          maxWidth: 'min(320px, calc(100vw - 16px))',
        }}
      >
        <div
          ref={popNameRef}
          className="font-display font-bold text-[14px] mb-1"
        />
        <div className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-[#f0f0f0]/45 mb-3">
          <span ref={popTierDotRef} className="w-1.5 h-1.5 rounded-full" />
          <span ref={popTierLabelRef} />
        </div>
        <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#f0f0f0]/25 mb-1.5">
          Used in
        </div>
        <div
          ref={popProjectsRef}
          className="font-sans text-[12px] text-[#f0f0f0]/70 leading-relaxed"
        />
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────── */
/* Rendered view — tiered chips by category       */
/* ───────────────────────────────────────────── */

interface PopHandlers {
  showPop: (e: React.MouseEvent, skill: Skill) => void;
  movePop: (e: React.MouseEvent) => void;
  hidePop: () => void;
}

function RenderedView({ showPop, movePop, hidePop }: PopHandlers) {
  return (
    <div className="px-4 md:px-8 py-5 md:py-7">
      {/* Legend */}
      <div className="flex gap-x-4 gap-y-2 sm:gap-6 flex-wrap pb-4 mb-5 border-b border-dashed border-white/[0.12] font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0f0f0]/45">
        <LegendItem tier="expert" label="Expert · daily driver" />
        <LegendItem tier="proficient" label="Proficient · shipped with" />
        <LegendItem tier="familiar" label="Familiar · explored" />
        <div className="hidden sm:block ml-auto text-[#f0f0f0]/25">↪ Hover any skill for projects</div>
      </div>

      {/* Rows */}
      {GROUPS.map((group, i) => {
        const items = SKILLS.filter((s) => s.group === group).sort(
          (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
        );
        if (!items.length) return null;
        return (
          <div
            key={group}
            className="skill-row flex flex-col gap-3 py-4 border-t border-white/[0.06] last:border-b last:border-white/[0.06] sm:grid sm:items-center sm:gap-4 sm:[grid-template-columns:36px_130px_1px_1fr]"
          >
            {/* Header row on mobile / number cell on desktop */}
            <div className="flex items-center gap-3 sm:contents">
              <div className="font-mono text-[10px] text-[#f0f0f0]/25 tabular-nums sm:text-right">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-px w-3.5 bg-[#e63946]/50" />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#e63946]/75">
                  {group}
                </span>
              </div>
              {/* Separator — desktop only */}
              <div className="hidden sm:block w-px h-6 bg-white/[0.06]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <Chip
                  key={skill.name}
                  skill={skill}
                  showPop={showPop}
                  movePop={movePop}
                  hidePop={hidePop}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LegendItem({ tier, label }: { tier: Tier; label: string }) {
  const segs = tier === 'expert' ? 3 : tier === 'proficient' ? 2 : 1;
  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-[1px]"
            style={{
              background:
                i < segs
                  ? TIER_COLOR[tier]
                  : 'rgba(255,255,255,0.12)',
              boxShadow:
                i < segs && tier === 'expert' ? '0 0 4px #e63946' : 'none',
            }}
          />
        ))}
      </span>
      {label}
    </div>
  );
}

function Chip({
  skill,
  showPop,
  movePop,
  hidePop,
}: {
  skill: Skill;
} & PopHandlers) {
  const segs = skill.tier === 'expert' ? 3 : skill.tier === 'proficient' ? 2 : 1;
  return (
    <div
      onMouseEnter={(e) => showPop(e, skill)}
      onMouseMove={movePop}
      onMouseLeave={hidePop}
      className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/[0.12] bg-transparent cursor-pointer transition-all duration-200 hover:border-[#e63946] hover:bg-[#e63946]/[0.05] hover:text-[#f0f0f0] hover:-translate-y-px font-sans text-[12px] text-[#f0f0f0]/70"
    >
      <span className="font-medium">{skill.name}</span>
      <span className="inline-flex gap-0.5 ml-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-[1px]"
            style={{
              background:
                i < segs
                  ? TIER_COLOR[skill.tier]
                  : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </span>
    </div>
  );
}

/* ───────────────────────────────────────────── */
/* Raw view — syntax-highlighted skills.ts        */
/* ───────────────────────────────────────────── */

function RawView({ showPop, movePop, hidePop }: PopHandlers) {
  const tiers: Tier[] = ['expert', 'proficient', 'familiar'];

  const lines: React.ReactNode[] = [];
  const pushLine = (node: React.ReactNode) => lines.push(node);

  pushLine(<span className="italic text-[#f0f0f0]/25">{`// skills.ts — what I work with daily`}</span>);
  pushLine(<span className="italic text-[#f0f0f0]/25">{`// hover any string to see what I shipped with it`}</span>);
  pushLine(<span>{''}</span>);

  tiers.forEach((tier) => {
    pushLine(
      <span>
        <span className="text-[#c678dd]">export const </span>
        <span className="text-[#61afef]">{tier}</span>
        <span className="text-[#f0f0f0]/45"> = {'{'}</span>
      </span>,
    );
    GROUPS.forEach((g) => {
      const items = SKILLS.filter((s) => s.tier === tier && s.group === g);
      if (!items.length) return;
      const keyPad = ' '.repeat(Math.max(0, 13 - g.length));
      pushLine(
        <span>
          {'  '}
          <span className="text-[#e5c07b]">{g.toLowerCase()}</span>
          <span className="text-[#f0f0f0]/45">:</span>
          {keyPad}
          <span className="text-[#f0f0f0]/45">[</span>
          {items.map((s, idx) => (
            <span key={s.name}>
              <span
                className={`cursor-pointer transition-colors ${
                  tier === 'expert'
                    ? 'text-[#e06c75] hover:text-[#ff8b95]'
                    : 'text-[#98c379] hover:text-[#b8e896]'
                }`}
                onMouseEnter={(e) => showPop(e, s)}
                onMouseMove={movePop}
                onMouseLeave={hidePop}
              >
                {`'${s.name}'`}
              </span>
              {idx < items.length - 1 && (
                <span className="text-[#f0f0f0]/45">, </span>
              )}
            </span>
          ))}
          <span className="text-[#f0f0f0]/45">],</span>
        </span>,
      );
    });
    pushLine(
      <span>
        <span className="text-[#f0f0f0]/45">{'}'}</span>
        <span className="text-[#f0f0f0]/45">;</span>
      </span>,
    );
    pushLine(<span>{''}</span>);
  });

  return (
    <div className="flex font-mono text-[13px] leading-[1.75] py-4">
      {/* Gutter */}
      <div className="flex-shrink-0 px-4 text-right text-[#f0f0f0]/25 select-none border-r border-white/[0.06] whitespace-pre">
        {lines.map((_, i) => `${i + 1}`).join('\n')}
      </div>
      {/* Code */}
      <div className="flex-1 px-5 text-[#f0f0f0]/70 whitespace-pre overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
