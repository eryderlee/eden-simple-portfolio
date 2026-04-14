'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Types ──────────────────────────────────────────────────── */
type Category = 'All' | 'Web' | 'Automation' | 'Academic';

interface Project {
  name: string;
  description: string;
  tech: string[];
  url: string;
  category: Exclude<Category, 'All'>;
}

/* ── Data ───────────────────────────────────────────────────── */
const PROJECTS: Project[] = [
  // Web
  {
    name: 'Airtable Clone',
    description:
      'Airtable-inspired data grid with 100k+ row virtualization, Google auth, dynamic columns, keyboard navigation',
    tech: ['React', 'TypeScript', 'PostgreSQL', 'tRPC', 'TanStack'],
    url: '#',
    category: 'Web',
  },
  {
    name: 'BaseAim ClientHub',
    description:
      'Secure agency-client dashboard with role-based auth, Stripe billing, doc sharing, analytics',
    tech: ['Next.js', 'Prisma', 'Stripe', 'NextAuth'],
    url: '#',
    category: 'Web',
  },
  {
    name: 'Baseaim.co',
    description:
      'Marketing agency platform with AI chatbot, voice bot, automated SEO blog, growth calculator',
    tech: ['Next.js', 'Supabase', 'n8n'],
    url: 'https://baseaim.co',
    category: 'Web',
  },
  {
    name: 'CYS Accountants',
    description: 'Full redesign with funnel landing page for Meta ad campaigns',
    tech: ['HTML', 'CSS', 'Meta Pixel'],
    url: 'https://cysaccountants.baseaim.co/',
    category: 'Web',
  },
  {
    name: 'CoFarming Hub',
    description:
      'Eco-friendly products website, 100 speed score, maps, analytics, newsletters',
    tech: ['HTML', 'CSS'],
    url: 'https://cofarminghub.com',
    category: 'Web',
  },
  {
    name: 'MVPcommunity',
    description:
      'SaaS community platform with courses, forum, live video, progress tracking',
    tech: ['Next.js', 'Prisma', 'LiveKit', 'Supabase'],
    url: '#',
    category: 'Web',
  },
  // Automation
  {
    name: 'Google Maps Lead Scraper',
    description:
      'Automated n8n workflow scraping 144k leads/day from Google Maps into CRM',
    tech: ['n8n', 'API'],
    url: '#',
    category: 'Automation',
  },
  {
    name: 'AI Voice Agent',
    description:
      'Voice-first AI concierge for inbound leads, books calls via Retell + Cal.com',
    tech: ['Retell', 'n8n', 'Cal.com'],
    url: '#',
    category: 'Automation',
  },
  {
    name: 'AI Chatbot (RAG)',
    description:
      'AI chatbot using OpenAI + Supabase vector DB for company document Q&A',
    tech: ['OpenAI', 'Supabase', 'RAG'],
    url: '#',
    category: 'Automation',
  },
  {
    name: 'Cold Email System',
    description:
      'Automated outreach with lead enrichment, personalized emails, multi-step follow-ups',
    tech: ['n8n', 'Custom Domains'],
    url: '#',
    category: 'Automation',
  },
  {
    name: 'SEO Blog Automation',
    description:
      'n8n workflow that generates articles and pushes to GitHub repo as CMS',
    tech: ['n8n', 'GitHub', 'AI'],
    url: '#',
    category: 'Automation',
  },
  {
    name: 'SignNow Contract Generator',
    description:
      'End-to-end client onboarding: form → Stripe → SignNow → email → CRM',
    tech: ['n8n', 'Stripe', 'SignNow'],
    url: '#',
    category: 'Automation',
  },
  // Academic
  {
    name: 'AI Puzzle Solver',
    description:
      'C-based solver with BFS, radix tree, iterated width search — benchmarked across configs',
    tech: ['C', 'Algorithms', 'Data Structures'],
    url: '#',
    category: 'Academic',
  },
  {
    name: 'Crypto Remittances Research',
    description:
      'METIS 2023 publication on cryptocurrency viability for Myanmar remittances',
    tech: ['Research', 'Economics'],
    url: '#',
    category: 'Academic',
  },
];

const CATEGORIES: Category[] = ['All', 'Web', 'Automation', 'Academic'];

const CATEGORY_LABELS: Record<Category, string> = {
  All: 'All',
  Web: 'Web',
  Automation: 'Automation',
  Academic: 'Academic',
};

/* ── Sub-components ─────────────────────────────────────────── */
function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[0.6rem] tracking-[0.12em] uppercase font-sans border border-[#e63946]/40 text-[#e63946]/80 rounded-sm">
      {label}
    </span>
  );
}

interface CardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: CardProps) {
  const isLive = project.url !== '#';

  return (
    <article
      className="project-card group relative flex flex-col bg-[#1a1a1a] border border-white/[0.06] rounded-sm p-6 transition-all duration-300 hover:border-[#e63946]/40 hover:-translate-y-1"
      style={{
        boxShadow: '0 0 0 0 rgba(230,57,70,0)',
        transition:
          'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 32px rgba(230,57,70,0.12), 0 0 0 1px rgba(230,57,70,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 0 0 0 rgba(230,57,70,0)';
      }}
    >
      {/* Index label */}
      <span className="absolute top-4 right-5 text-[0.55rem] tracking-[0.2em] uppercase text-[#f0f0f0]/15 font-sans tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Category badge */}
      <span className="inline-flex self-start mb-4 text-[0.55rem] tracking-[0.2em] uppercase text-[#f0f0f0]/25 font-sans">
        {project.category}
      </span>

      {/* Name */}
      <h3 className="font-display font-bold text-[1.05rem] leading-snug text-[#f0f0f0] mb-3 tracking-tight">
        {project.name}
      </h3>

      {/* Description */}
      <p className="font-sans text-[0.8rem] leading-relaxed text-[#f0f0f0]/55 mb-5 flex-1">
        {project.description}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.map((t) => (
          <TechPill key={t} label={t} />
        ))}
      </div>

      {/* Link */}
      <div className="mt-auto pt-4 border-t border-white/[0.05]">
        {isLive ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.1em] uppercase font-sans text-[#e63946] hover:text-[#ff4d5a] transition-colors duration-200"
          >
            View Project
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 9L9 1M9 1H3M9 1V7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.1em] uppercase font-sans text-[#f0f0f0]/20 cursor-default select-none">
            Private / Internal
          </span>
        )}
      </div>
    </article>
  );
}

/* ── Main Section ───────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [displayCategory, setDisplayCategory] = useState<Category>('All');
  const hasAnimatedRef = useRef(false);

  const filtered = PROJECTS.filter(
    (p) => displayCategory === 'All' || p.category === displayCategory
  );

  /* Scroll entrance (fires once) */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, filtersRef.current], {
        opacity: 0,
        y: 30,
      });
      gsap.set('.project-card', { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          hasAnimatedRef.current = true;
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.to([headingRef.current, filtersRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
          }).to(
            '.project-card',
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
            },
            '-=0.3'
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* Filter change: fade out → swap → fade in */
  const handleFilter = useCallback(
    (cat: Category) => {
      if (cat === activeCategory) return;
      setActiveCategory(cat);

      if (!hasAnimatedRef.current) {
        setDisplayCategory(cat);
        return;
      }

      const cards = gridRef.current?.querySelectorAll('.project-card');
      if (!cards) {
        setDisplayCategory(cat);
        return;
      }

      gsap.to(cards, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        stagger: 0.02,
        ease: 'power2.in',
        onComplete: () => {
          setDisplayCategory(cat);
          // Cards are replaced by React; new ones animate in via useEffect below
        },
      });
    },
    [activeCategory]
  );

  /* Animate newly rendered cards after a filter swap */
  useEffect(() => {
    if (!hasAnimatedRef.current) return;
    const cards = gridRef.current?.querySelectorAll('.project-card');
    if (!cards || cards.length === 0) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: 'power3.out',
      }
    );
  }, [displayCategory]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative min-h-screen bg-[#111111] py-32 px-6 border-t border-white/[0.04]"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.04,
        }}
      />

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent" />

      <div className="relative max-w-screen-xl mx-auto">
        {/* Section heading */}
        <div ref={headingRef} className="mb-14">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/25 mb-4">
            Selected work
          </p>
          <div className="flex items-end gap-6">
            <h2 className="font-display font-black text-[clamp(2.8rem,7vw,6rem)] leading-none tracking-[-0.03em] text-[#f0f0f0]">
              Projects
            </h2>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-12 bg-[#e63946]" />
              <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-[#f0f0f0]/20">
                {PROJECTS.length} total
              </span>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div
          ref={filtersRef}
          className="flex flex-wrap gap-2 mb-12"
          role="tablist"
          aria-label="Filter projects by category"
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleFilter(cat)}
                className={`relative inline-flex items-center gap-2 px-4 py-2 text-[0.65rem] tracking-[0.15em] uppercase font-sans transition-all duration-250 border rounded-sm ${
                  isActive
                    ? 'border-[#e63946] text-[#e63946] bg-[#e63946]/[0.08]'
                    : 'border-white/[0.08] text-[#f0f0f0]/40 hover:border-white/[0.15] hover:text-[#f0f0f0]/65'
                }`}
              >
                {CATEGORY_LABELS[cat]}
                <span
                  className={`text-[0.55rem] tabular-nums transition-colors duration-250 ${
                    isActive ? 'text-[#e63946]/60' : 'text-[#f0f0f0]/20'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
