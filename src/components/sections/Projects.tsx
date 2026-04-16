'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Types ──────────────────────────────────────────────────── */
type Category = 'All' | 'Web' | 'Automation' | 'Academic';
type WorkflowCategory =
  | 'Lead Generation'
  | 'Email & CRM'
  | 'Content Creation'
  | 'AI Agents'
  | 'Client Workflows'
  | 'Finance'
  | 'Other';

type AutomationTab = 'All' | WorkflowCategory;

interface ModalContent {
  title: string;
  publication: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
  tech: string[];
  url: string;
  category: Exclude<Category, 'All'>;
  subCategory?: WorkflowCategory;
  modalContent?: ModalContent;
}

interface Workflow {
  name: string;
  category: WorkflowCategory;
  description?: string;
  tech?: string[];
}

/* ── Projects data ──────────────────────────────────────────── */
const PROJECTS: Project[] = [
  // Web
  {
    name: 'Baseaim.co',
    description:
      'Marketing agency platform with AI chatbot, voice bot, automated SEO blog, growth calculator',
    tech: ['Next.js', 'Supabase', 'n8n'],
    url: 'https://baseaim.co',
    category: 'Web',
  },
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
    name: 'CYS Accountants',
    description: 'Full redesign with funnel landing page for Meta ad campaigns',
    tech: ['HTML', 'CSS', 'Meta Pixel'],
    url: 'https://cysaccountants.baseaim.co/',
    category: 'Web',
  },
  {
    name: 'CoFarming Hub',
    description:
      'Designed website, e-commerce, digital presentations, business solutions',
    tech: ['HTML', 'CSS'],
    url: 'https://cofarminghub.com',
    category: 'Web',
  },
  {
    name: 'RyderAgency',
    description:
      'Built websites for car companies, accountants. SEO optimization, responsive design.',
    tech: ['Next.js', 'HTML', 'CSS', 'SEO'],
    url: 'https://ryderagency.com',
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
    subCategory: 'Lead Generation',
  },
  {
    name: 'AI Voice Agent',
    description:
      'Voice-first AI concierge for inbound leads, books calls via Retell + Cal.com',
    tech: ['Retell', 'n8n', 'Cal.com'],
    url: '#',
    category: 'Automation',
    subCategory: 'AI Agents',
  },
  {
    name: 'AI Chatbot (RAG)',
    description:
      'AI chatbot using OpenAI + Supabase vector DB for company document Q&A',
    tech: ['OpenAI', 'Supabase', 'RAG'],
    url: '#',
    category: 'Automation',
    subCategory: 'AI Agents',
  },
  {
    name: 'Cold Email System',
    description:
      'Automated outreach with lead enrichment, personalized emails, multi-step follow-ups',
    tech: ['n8n', 'Custom Domains'],
    url: '#',
    category: 'Automation',
    subCategory: 'Email & CRM',
  },
  {
    name: 'SEO Blog Automation',
    description:
      'n8n workflow that generates articles and pushes to GitHub repo as CMS',
    tech: ['n8n', 'GitHub', 'AI'],
    url: '#',
    category: 'Automation',
    subCategory: 'Content Creation',
  },
  {
    name: 'SignNow Contract Generator',
    description:
      'End-to-end client onboarding: form → Stripe → SignNow → email → CRM',
    tech: ['n8n', 'Stripe', 'SignNow'],
    url: '#',
    category: 'Automation',
    subCategory: 'Client Workflows',
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
    modalContent: {
      title:
        'To what extent are cryptocurrencies viable for international remittances in Myanmar to boost economic growth and welfare?',
      publication: 'METIS 2023 Compendium, Nov 2023',
      description:
        'This essay investigates the potential of cryptocurrencies and blockchain technology in transforming the landscape of international remittances in Myanmar. The issue of international remittances is of significant importance in Myanmar, contributing to about $2 billion or 2% of the country\'s GDP. However, the traditional banking methods for these transactions are fraught with challenges such as high fees, restricted access to financial services, and lack of transparency. The essay delves into the technical aspects of cryptocurrencies and blockchain technology, and their potential to offer a quicker, cheaper, and more secure method for transferring money across borders.',
    },
  },
];

/* ── All 93 n8n workflows ──────────────────────────────────── */
const WORKFLOWS: Workflow[] = [
  // Lead Generation (18)
  { name: 'AI Lead Generation - Google Maps Scraper', category: 'Lead Generation' },
  { name: 'Google Maps Lead Scraper (v2)', category: 'Lead Generation' },
  { name: 'Google Maps Lead Scraper (v3)', category: 'Lead Generation' },
  { name: 'Lead Enrichment', category: 'Lead Generation' },
  { name: 'LinkedIn Lead Builder — Apollo Method', category: 'Lead Generation' },
  { name: 'LinkedIn Lead Builder', category: 'Lead Generation' },
  { name: 'Collect LinkedIn Data', category: 'Lead Generation' },
  { name: 'Lead Gen', category: 'Lead Generation' },
  { name: 'Lead Research', category: 'Lead Generation' },
  { name: 'Find and Create Email', category: 'Lead Generation' },
  { name: 'Email Enrichment', category: 'Lead Generation' },
  { name: 'ZIP Code Checker — Google Sheets', category: 'Lead Generation' },
  { name: 'Data Enricher', category: 'Lead Generation' },
  { name: 'Data Enricher (Firecrawl)', category: 'Lead Generation' },
  { name: 'Queue Setup', category: 'Lead Generation' },
  { name: 'Queue Update', category: 'Lead Generation' },
  { name: 'Ample LinkedIn Gen', category: 'Lead Generation' },
  { name: 'Website Crawler', category: 'Lead Generation' },

  // Email & CRM (20)
  { name: 'WhatsApp Reminder', category: 'Email & CRM' },
  { name: 'Newsletter Automation', category: 'Email & CRM' },
  { name: 'Email Sequence 1 — Australia Timezone', category: 'Email & CRM' },
  { name: 'Email Sequence 2 — Australia Timezone', category: 'Email & CRM' },
  { name: 'Email Sequence 3 — Australia Timezone', category: 'Email & CRM' },
  { name: 'Opt-Out Link Handler', category: 'Email & CRM' },
  { name: 'Tally CRM', category: 'Email & CRM' },
  { name: 'Facebook CRM', category: 'Email & CRM' },
  { name: 'Email Inbox Manager', category: 'Email & CRM' },
  { name: 'Email Management Level 3', category: 'Email & CRM' },
  { name: 'Instant Confirmation', category: 'Email & CRM' },
  { name: 'Reminder — Preframe & Attend Booked Call', category: 'Email & CRM' },
  { name: 'Reminder — Leads Who Haven\'t Signed', category: 'Email & CRM' },
  { name: 'Reminder — Signed But Not Paid', category: 'Email & CRM' },
  { name: 'Perpetual Emails', category: 'Email & CRM' },
  { name: 'Reminder Sequences After Instant Confirmation', category: 'Email & CRM' },
  { name: 'Reminder Sequence — No Shows', category: 'Email & CRM' },
  { name: 'Baseaim SMS Follow-Up (Legacy)', category: 'Email & CRM' },
  { name: 'Baseaim SMS Confirmation', category: 'Email & CRM' },
  { name: 'Baseaim SMS Reminder Poller', category: 'Email & CRM' },

  // Content Creation (27)
  { name: 'Content Research with Native Nodes', category: 'Content Creation' },
  { name: 'AI Content Research Agent with Tools', category: 'Content Creation' },
  { name: 'Smart Content Generator with OpenAI', category: 'Content Creation' },
  { name: 'LinkedIn Carousel Creator & Poster', category: 'Content Creation' },
  { name: 'Perplexity Research Tool', category: 'Content Creation' },
  { name: 'LinkedIn Post Generator', category: 'Content Creation' },
  { name: 'Reddit Story Maker', category: 'Content Creation' },
  { name: 'LinkedIn Post Automation', category: 'Content Creation' },
  { name: 'TikTok Scraper', category: 'Content Creation' },
  { name: 'AI Story Generator', category: 'Content Creation' },
  { name: 'Mass Image Generator', category: 'Content Creation' },
  { name: 'YouTube Growth Automation', category: 'Content Creation' },
  { name: 'LinkedIn Parasite System — AI Content', category: 'Content Creation' },
  { name: 'Article Generator', category: 'Content Creation' },
  { name: 'Creatives Stealer / Rebrander', category: 'Content Creation' },
  { name: 'Linked Image Auto Desc Gen & Post', category: 'Content Creation' },
  { name: 'Creative Stealer Folder Mover', category: 'Content Creation' },
  { name: 'Reddit Scraper', category: 'Content Creation' },
  { name: 'Reddit Scraper 1/4 — Client Topics', category: 'Content Creation' },
  { name: 'Reddit Scraper 2/4 — Practice & Business', category: 'Content Creation' },
  { name: 'Reddit Scraper 3/4 — Operations & Day-to-Day', category: 'Content Creation' },
  { name: 'Reddit Scraper 4/4 — Industry & Career', category: 'Content Creation' },
  { name: 'Reddit Scraper — Client Audience', category: 'Content Creation' },
  { name: 'Client Audience 1/4 — Accountant Relationship', category: 'Content Creation' },
  { name: 'Client Audience 2/4 — Tax & Compliance', category: 'Content Creation' },
  { name: 'Client Audience 3/4 — Business Finance & Cash Flow', category: 'Content Creation' },
  { name: 'Client Audience 4/4 — Freelancer, Payroll & Rants', category: 'Content Creation' },

  // AI Agents (10)
  { name: 'CA Orchestrator — Complete', category: 'AI Agents' },
  { name: 'Restaurant Voice Agent — Reservations & Service', category: 'AI Agents' },
  { name: 'AI Voice Agent (Vapi + n8n)', category: 'AI Agents' },
  { name: 'Chatbot for Booking Appointments', category: 'AI Agents' },
  { name: 'Chatbot for Baseaim', category: 'AI Agents' },
  { name: 'RAG for Baseaim', category: 'AI Agents' },
  { name: 'Baseaim Voice Assistant', category: 'AI Agents' },
  { name: 'Notion AI Assistant', category: 'AI Agents' },
  { name: 'AI Day Planner', category: 'AI Agents' },
  { name: 'AI Day Planner (v2)', category: 'AI Agents' },

  // Client Workflows (11)
  { name: 'Notion Internal Docs', category: 'Client Workflows' },
  { name: 'Retell AI — Cal.com Appointment Management', category: 'Client Workflows' },
  { name: 'Proposal Generator', category: 'Client Workflows' },
  { name: 'After-Meeting Proposal Generator', category: 'Client Workflows' },
  { name: 'Proposal Generator v3', category: 'Client Workflows' },
  { name: 'Baseaim Assistant Call Report', category: 'Client Workflows' },
  { name: 'Create Audit', category: 'Client Workflows' },
  { name: 'Cal.com Event Handler', category: 'Client Workflows' },
  { name: 'Baseaim — Prefill Form to SignNow JSON', category: 'Client Workflows' },
  { name: 'Draft Guesty Booking Confirmation & Review', category: 'Client Workflows' },
  { name: 'VSL Form Handler', category: 'Client Workflows' },

  // Finance (4)
  { name: 'Bookeep AI — Weekly Equity Allocator', category: 'Finance' },
  { name: 'Crypto Market Analyzer — BTC/ETH (v1)', category: 'Finance' },
  { name: 'Crypto Market Analyzer — BTC/ETH (v2)', category: 'Finance' },
  { name: 'Crypto Market Analyzer — BTC/ETH RSS → Discord+Telegram', category: 'Finance' },

  // Other (3)
  { name: 'Error Handler', category: 'Other' },
  { name: 'Wallpaper Generator', category: 'Other' },
  { name: 'Motivation Workflow', category: 'Other' },
];

/* ── Automation subtabs ─────────────────────────────────────── */
const AUTOMATION_TABS: AutomationTab[] = [
  'All',
  'Lead Generation',
  'Email & CRM',
  'Content Creation',
  'AI Agents',
  'Client Workflows',
  'Finance',
];

const AUTOMATION_TAB_LABELS: Record<AutomationTab, string> = {
  'All': 'All Automation',
  'Lead Generation': 'Lead Gen',
  'Email & CRM': 'Email / CRM',
  'Content Creation': 'Content',
  'AI Agents': 'AI Agents',
  'Client Workflows': 'Client',
  'Finance': 'Finance',
  'Other': 'Other',
};

const CATEGORIES: Category[] = ['All', 'Web', 'Automation', 'Academic'];

const CATEGORY_LABELS: Record<Category, string> = {
  All: 'All',
  Web: 'Web',
  Automation: 'Automation',
  Academic: 'Academic',
};

/* ── Category badge colors ───────────────────────────────────── */
const CATEGORY_BADGE_COLORS: Record<Exclude<Category, 'All'>, string> = {
  Web: 'text-[#3b82f6]',
  Automation: 'text-[#22c55e]',
  Academic: 'text-[#a855f7]',
};

/* ── Sub-components ─────────────────────────────────────────── */
function TechPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[0.6rem] tracking-[0.12em] uppercase font-sans border border-[#e63946]/40 text-[#e63946]/80 rounded-sm">
      {label}
    </span>
  );
}

/* ── Workflow sub-category badge colors (reused in the unified card) ── */
const WORKFLOW_CATEGORY_BADGE_COLORS: Record<WorkflowCategory, string> = {
  'Lead Generation': 'text-[#e63946]',
  'Email & CRM': 'text-[#f0a500]',
  'Content Creation': 'text-[#4ecdc4]',
  'AI Agents': 'text-[#a855f7]',
  'Client Workflows': 'text-[#22c55e]',
  'Finance': 'text-[#3b82f6]',
  'Other': 'text-[#f0f0f0]/30',
};

/* ── Unified card item (superset of Project + Workflow) ─────── */
interface CardItem {
  name: string;
  description?: string;
  tech?: string[];
  url?: string;
  mainCategory: Exclude<Category, 'All'>;
  subCategory?: WorkflowCategory;
  modalContent?: ModalContent;
}

function projectToCardItem(p: Project): CardItem {
  return {
    name: p.name,
    description: p.description,
    tech: p.tech,
    url: p.url,
    mainCategory: p.category,
    subCategory: p.subCategory,
    modalContent: p.modalContent,
  };
}

function workflowToCardItem(w: Workflow): CardItem {
  return {
    name: w.name,
    description: w.description,
    tech: w.tech,
    mainCategory: 'Automation',
    subCategory: w.category,
  };
}

interface CardProps {
  item: CardItem;
  index: number;
  onOpenModal?: (content: ModalContent) => void;
}

function Card({ item, index, onOpenModal }: CardProps) {
  const isLive = item.url !== undefined && item.url !== '#';
  const hasModal = !!item.modalContent;
  const hasUrl = item.url !== undefined;
  const hasTech = !!item.tech && item.tech.length > 0;
  const isAutomation = item.mainCategory === 'Automation';

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

      {/* Category badge — "AUTOMATION · SUBCAT" for automation, single label otherwise */}
      <span className="inline-flex self-start mb-4 items-center gap-1.5 text-[0.55rem] tracking-[0.2em] uppercase font-sans">
        <span className={CATEGORY_BADGE_COLORS[item.mainCategory]}>
          {item.mainCategory}
        </span>
        {isAutomation && item.subCategory && (
          <>
            <span className="text-[#f0f0f0]/20">·</span>
            <span className={WORKFLOW_CATEGORY_BADGE_COLORS[item.subCategory]}>
              {item.subCategory}
            </span>
          </>
        )}
      </span>

      {/* Name */}
      <h3 className="font-display font-bold text-[1.05rem] leading-snug text-[#f0f0f0] mb-3 tracking-tight">
        {item.name}
      </h3>

      {/* Description (optional) */}
      {item.description ? (
        <p className="font-sans text-[0.8rem] leading-relaxed text-[#f0f0f0]/55 mb-5 flex-1">
          {item.description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      {/* Tech pills (optional) */}
      {hasTech && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.tech!.map((t) => (
            <TechPill key={t} label={t} />
          ))}
        </div>
      )}

      {/* Link / action — shown only when the item has a url (projects have one; workflows don't) */}
      {hasUrl && (
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          {hasModal ? (
            <button
              onClick={() => onOpenModal?.(item.modalContent!)}
              className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.1em] uppercase font-sans text-[#e63946] hover:text-[#ff4d5a] transition-colors duration-200"
            >
              Read Research
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M5 1h4v4M9 1 1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : isLive ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.1em] uppercase font-sans text-[#e63946] hover:text-[#ff4d5a] transition-colors duration-200"
            >
              View Project
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.1em] uppercase font-sans text-[#f0f0f0]/20 cursor-default select-none">
              Private / Internal
            </span>
          )}
        </div>
      )}
    </article>
  );
}

/* ── Research Modal ─────────────────────────────────────────── */
function ResearchModal({ content, onClose }: { content: ModalContent; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative max-w-2xl w-full bg-[#161616] border border-[#e63946]/30 p-8 sm:p-10 shadow-[0_0_80px_rgba(230,57,70,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[#e63946]/60 via-[#e63946]/30 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#f0f0f0]/40 hover:text-[#e63946] transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Publication badge */}
        <span className="inline-block text-[0.58rem] tracking-[0.22em] uppercase text-[#e63946]/70 font-sans border border-[#e63946]/25 px-2.5 py-1 mb-6">
          {content.publication}
        </span>

        {/* Title */}
        <h3 className="font-display font-bold text-[1rem] sm:text-[1.1rem] leading-snug text-[#f0f0f0] mb-6 pr-6">
          {content.title}
        </h3>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-6" />

        {/* Description */}
        <p className="font-sans text-[0.85rem] leading-[1.75] text-[#f0f0f0]/58">
          {content.description}
        </p>
      </div>
    </div>
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
  const [openModal, setOpenModal] = useState<ModalContent | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<AutomationTab>('All');
  const [page, setPage] = useState(1);
  const hasAnimatedRef = useRef(false);

  const PAGE_SIZE = 24;

  const automationProjects = PROJECTS.filter((p) => p.category === 'Automation');

  /* Single unified dataset. Main tabs filter by category; on Automation the
     subtabs further filter by subCategory. All tab shows everything. */
  const allItems: CardItem[] = [
    ...PROJECTS.map(projectToCardItem),
    ...WORKFLOWS.map(workflowToCardItem),
  ];

  const filtered: CardItem[] = allItems
    .filter((item) => displayCategory === 'All' || item.mainCategory === displayCategory)
    .filter(
      (item) =>
        displayCategory !== 'Automation' ||
        activeWorkflowTab === 'All' ||
        item.subCategory === activeWorkflowTab
    );

  /* Pagination (all tabs). Controls auto-hide when the filtered set fits
     on a single page — Web (7) and Academic (2) stay control-free. */
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Close modal on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenModal(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openModal]);

  /* Scroll entrance (fires once) */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { opacity: 0, x: -50 });
      gsap.set(filtersRef.current, { opacity: 0, y: 30 });
      gsap.set('.project-card', { opacity: 0, y: 40 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          hasAnimatedRef.current = true;
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          tl.to(headingRef.current, {
            opacity: 1,
            x: 0,
            duration: 0.7,
          })
          .to(filtersRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.7,
          }, '-=0.55').to(
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
      setPage(1);

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
          // Reset workflow tab when switching to Automation
          if (cat === 'Automation') setActiveWorkflowTab('All');
        },
      });
    },
    [activeCategory]
  );

  /* Change page + scroll the section back to its top so the user can see
     the new set of cards without having to scroll manually. */
  const goToPage = useCallback(
    (p: number) => {
      const next = Math.max(1, Math.min(pageCount, p));
      if (next === page) return;
      setPage(next);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [page, pageCount]
  );

  /* Animate newly rendered cards after a filter swap, subtab change, or page change */
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
  }, [displayCategory, activeWorkflowTab, page]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-grain relative min-h-screen bg-black pt-24 pb-12 md:pt-32 md:pb-10 border-t border-white/[0.04] px-5"
    >


      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        {/* Section heading */}
        <div ref={headingRef} className="mb-6">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/25 mb-4">
            Selected work
          </p>
          <div className="flex items-end gap-6">
            <h2 className="font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-[-0.03em] text-[#f0f0f0]">
              Projects
            </h2>
            <div className="mb-2 flex items-center gap-3">
              <div className="h-px w-12 bg-[#e63946]" />
              <span className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-[#f0f0f0]/20">
                {PROJECTS.length + WORKFLOWS.length} total
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
              cat === 'Automation'
                ? automationProjects.length + WORKFLOWS.length
                : cat === 'All'
                ? PROJECTS.length + WORKFLOWS.length
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

        {/* Automation subtabs (inline; only shown when Automation is active) */}
        {displayCategory === 'Automation' && (
          <div
            className="flex flex-wrap gap-2 -mt-8 mb-10"
            role="tablist"
            aria-label="Filter automation workflows"
          >
            {AUTOMATION_TABS.map((tab) => {
              const count =
                tab === 'All'
                  ? automationProjects.length + WORKFLOWS.length
                  : WORKFLOWS.filter((w) => w.category === tab).length +
                    automationProjects.filter((p) => p.subCategory === tab).length;
              const isActive = activeWorkflowTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveWorkflowTab(tab);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase font-sans transition-all duration-200 border rounded-sm ${
                    isActive
                      ? 'border-[#e63946] text-[#e63946] bg-[#e63946]/[0.08]'
                      : 'border-white/[0.07] text-[#f0f0f0]/35 hover:border-white/[0.14] hover:text-[#f0f0f0]/60'
                  }`}
                >
                  {AUTOMATION_TAB_LABELS[tab]}
                  <span className={`text-[0.5rem] tabular-nums ${isActive ? 'text-[#e63946]/60' : 'text-[#f0f0f0]/18'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Unified grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {pageItems.map((item, i) => (
            <Card
              key={`${item.mainCategory}-${item.subCategory ?? 'none'}-${item.name}`}
              item={item}
              index={(page - 1) * PAGE_SIZE + i}
              onOpenModal={setOpenModal}
            />
          ))}
        </div>

        {/* Pagination (Automation view only, multi-page only) */}
        {pageCount > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Pagination"
          >
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase font-sans border border-white/[0.08] rounded-sm text-[#f0f0f0]/50 hover:border-white/[0.2] hover:text-[#f0f0f0]/80 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-white/[0.08] disabled:hover:text-[#f0f0f0]/50"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => {
              const isActive = p === page;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1.5 text-[0.65rem] tabular-nums font-sans border rounded-sm transition-all duration-200 ${
                    isActive
                      ? 'border-[#e63946] text-[#e63946] bg-[#e63946]/[0.08]'
                      : 'border-white/[0.08] text-[#f0f0f0]/40 hover:border-white/[0.2] hover:text-[#f0f0f0]/70'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === pageCount}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase font-sans border border-white/[0.08] rounded-sm text-[#f0f0f0]/50 hover:border-white/[0.2] hover:text-[#f0f0f0]/80 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-white/[0.08] disabled:hover:text-[#f0f0f0]/50"
              aria-label="Next page"
            >
              Next →
            </button>
          </nav>
        )}
      </div>

      {/* Research Modal */}
      {openModal && (
        <ResearchModal content={openModal} onClose={() => setOpenModal(null)} />
      )}
    </section>
  );
}
