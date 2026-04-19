'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrambleHover } from '@/components/ui/ScrambleLink';

gsap.registerPlugin(ScrollTrigger);

/* ── Types ──────────────────────────────────────────────────── */
type Category = 'Featured' | 'All' | 'Web' | 'Automation' | 'Academic';
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

interface FeaturedLink {
  label: string;
  url: string;
  isModal?: boolean; // future: trigger case study modal
}

interface FeaturedItem {
  id: string;
  label: string;
  labelColor: string;
  name: string;
  description: string;
  tech: string[];
  links: FeaturedLink[];
  status?: string;
  statusColor?: string;
  aspectRatio: string;
  mediaLabel: string;
  mediaFile: string;
  videoSrc?: string;
  videoSrc2?: string;
  videoLabel?: string;
  videoLabel2?: string;
  youtubeId?: string;
  imageSrc?: string;
  specs?: string[];
  isHero?: boolean;
  redBorder?: boolean;
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
  url?: string;
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
  // Lead Generation (19)
  { name: 'AI Lead Generation - Google Maps Scraper', category: 'Lead Generation', url: 'https://youtu.be/NeYNyZAtY28' },
  { name: 'Google Maps Lead Scraper (v2)', category: 'Lead Generation', url: 'https://youtu.be/NeYNyZAtY28' },
  { name: 'Google Maps Lead Scraper (v3)', category: 'Lead Generation', url: 'https://youtu.be/NeYNyZAtY28' },
  { name: 'Lead Enrichment', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'LinkedIn Lead Builder — Apollo Method', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'LinkedIn Lead Builder', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'Collect LinkedIn Data', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'Instagram Lead Gen', category: 'Lead Generation', url: 'https://youtu.be/_HZcGKqUxxQ' },
  { name: 'Lead Gen', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Lead Research', category: 'Lead Generation' },
  { name: 'Find and Create Email', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Email Enrichment', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'ZIP Code Checker — Google Sheets', category: 'Lead Generation' },
  { name: 'Data Enricher', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'Data Enricher (Firecrawl)', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'Queue Setup', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Queue Update', category: 'Lead Generation', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Ample LinkedIn Gen', category: 'Lead Generation', url: 'https://youtu.be/EYBaiGxH_p0' },
  { name: 'Website Crawler', category: 'Lead Generation' },

  // Email & CRM (20)
  { name: 'WhatsApp Reminder', category: 'Email & CRM' },
  { name: 'Newsletter Automation', category: 'Email & CRM' },
  { name: 'Email Sequence 1 — Australia Timezone', category: 'Email & CRM', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Email Sequence 2 — Australia Timezone', category: 'Email & CRM', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Email Sequence 3 — Australia Timezone', category: 'Email & CRM', url: 'https://youtu.be/4GZ-whzEjlM' },
  { name: 'Opt-Out Link Handler', category: 'Email & CRM', url: 'https://youtu.be/4GZ-whzEjlM' },
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
  { name: 'Smart Content Generator with OpenAI', category: 'Content Creation', url: 'https://youtu.be/jkhtsGHUk6U' },
  { name: 'LinkedIn Carousel Creator & Poster', category: 'Content Creation' },
  { name: 'Perplexity Research Tool', category: 'Content Creation' },
  { name: 'LinkedIn Post Generator', category: 'Content Creation' },
  { name: 'Reddit Story Maker', category: 'Content Creation' },
  { name: 'LinkedIn Post Automation', category: 'Content Creation' },
  { name: 'TikTok Scraper', category: 'Content Creation' },
  { name: 'AI Story Generator', category: 'Content Creation' },
  { name: 'Mass Image Generator', category: 'Content Creation', url: 'https://youtu.be/SGHVx81bmKU' },
  { name: 'YouTube Growth Automation', category: 'Content Creation' },
  { name: 'LinkedIn Parasite System — AI Content', category: 'Content Creation' },
  { name: 'Article Generator', category: 'Content Creation', url: 'https://youtu.be/jkhtsGHUk6U' },
  { name: 'Creatives Stealer / Rebrander', category: 'Content Creation', url: 'https://youtu.be/SGHVx81bmKU' },
  { name: 'Linked Image Auto Desc Gen & Post', category: 'Content Creation', url: 'https://youtu.be/SGHVx81bmKU' },
  { name: 'Creative Stealer Folder Mover', category: 'Content Creation', url: 'https://youtu.be/SGHVx81bmKU' },
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

/* ── Featured items ─────────────────────────────────────────── */
const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: 'F01',
    label: 'FLAGSHIP · WEB + AI',
    labelColor: 'text-[#3b82f6]',
    name: 'Baseaim Digital Product Suite',
    description: 'End-to-end operating surface for an accounting agency — marketing landing page, client dashboard, AI voice agent, RAG chatbot, automated SEO blog pipeline, and CRM automations all in one product.',
    tech: ['Next.js', 'Supabase', 'n8n', 'OpenAI', 'Stripe', 'Retell'],
    links: [
      { label: 'Live Site', url: 'https://baseaim.co' },
      { label: 'Dashboard Walkthrough', url: '#' },
    ],
    status: 'LIVE SITE',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '21:9',
    mediaLabel: 'Autoplays when in view',
    mediaFile: 'baseaim.co — landing page capture',
    videoSrc: '/videos/featured/baseaim%20aim%20landing%20page.mp4',
    videoLabel: 'Landing Page',
    videoSrc2: '/videos/featured/baseaim%20dashboard.mp4',
    videoLabel2: 'Dashboard',
    isHero: true,
  },
  {
    id: 'F02',
    label: 'AI · VOICE AGENT',
    labelColor: 'text-[#22c55e]',
    name: 'Baseaim AI Voice Agent',
    description: 'Voice-first AI concierge that handles inbound leads, answers questions from company docs via RAG, and books calls — all without a human in the loop.',
    tech: ['Retell', 'OpenAI', 'Supabase Vector', 'n8n', 'Cal.com'],
    links: [
      { label: 'Case Study', url: '#', isModal: true },
    ],
    status: 'LIVE AGENT',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'Voice agent demo',
    mediaFile: 'baseaim-voice-agent.mp4',
    imageSrc: '/images/voice agent.png',
  },
  {
    id: 'F03',
    label: 'AUTOMATION · LEAD GEN',
    labelColor: 'text-[#22c55e]',
    name: 'LinkedIn Lead Builder',
    description: 'n8n workflow that builds targeted LinkedIn lead lists without Apollo. Runs as a repeatable pipeline in production.',
    tech: ['n8n', 'LinkedIn', 'Google Sheets'],
    links: [
      { label: 'Watch on YouTube', url: 'https://youtu.be/EYBaiGxH_p0' },
    ],
    status: 'N8N WORKFLOW',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'YouTube walkthrough',
    mediaFile: 'linkedin-lead-builder.yt',
    youtubeId: 'JDOyEhj5dRE',
  },
  {
    id: 'F04',
    label: 'WEB · CLIENT SITE',
    labelColor: 'text-[#3b82f6]',
    name: 'CYS Accountants',
    description: 'Full redesign with high-conversion funnel landing page built for Meta ad campaigns. Delivered as part of the Baseaim agency product suite.',
    tech: ['HTML', 'CSS', 'Meta Pixel'],
    links: [
      { label: 'View Site', url: 'https://cysaccountants.baseaim.co/' },
    ],
    status: 'LIVE SITE',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'Autoplays when in view',
    mediaFile: 'cys accountants.mp4',
    videoSrc: '/videos/featured/cys%20accountants.mp4',
  },
  {
    id: 'F05',
    label: 'WEB · E-COMMERCE',
    labelColor: 'text-[#3b82f6]',
    name: 'CoFarming Hub',
    description: 'Website, e-commerce store, digital presentations and business solutions for an agricultural co-farming network.',
    tech: ['HTML', 'CSS'],
    links: [
      { label: 'View Site', url: 'https://cofarminghub.com' },
    ],
    status: 'LIVE SITE',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'Autoplays when in view',
    mediaFile: 'cofarming hub.mp4',
    videoSrc: '/videos/featured/cofarming%20hub.mp4',
  },
  {
    id: 'F06',
    label: 'AUTOMATION · CONTENT',
    labelColor: 'text-[#22c55e]',
    name: 'Automated SEO Blog Pipeline',
    description: 'n8n workflow that researches, writes, and publishes SEO-optimised blog posts to a custom-coded website — fully hands-off content generation at scale.',
    tech: ['n8n', 'OpenAI', 'Perplexity', 'Custom CMS'],
    links: [
      { label: 'Watch Demo', url: 'https://youtu.be/jkhtsGHUk6U' },
    ],
    status: 'N8N WORKFLOW',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'YouTube walkthrough',
    mediaFile: 'seo-blog-automation.yt',
    youtubeId: 'jkhtsGHUk6U',
  },
  {
    id: 'F07',
    label: 'ACADEMIC · RESEARCH',
    labelColor: 'text-[#a855f7]',
    name: 'Crypto Remittances Research',
    description: 'METIS 2023 publication on cryptocurrency viability for Myanmar remittances. Economic modelling + fieldwork.',
    tech: ['Research', 'Economics', 'Published'],
    links: [
      { label: 'Read Paper', url: 'https://docs.google.com/document/d/1r77tB9lwZQAZku50E_SEkxzufMP1kafA/edit?usp=sharing&ouid=104048869544003020764&rtpof=true&sd=true' },
    ],
    status: 'PUBLISHED',
    statusColor: 'bg-[#a855f7]',
    aspectRatio: '16:9',
    mediaLabel: 'Paper abstract / figures',
    mediaFile: 'crypto-remittances-metis2023',
    imageSrc: '/images/research cover.png',
    redBorder: true,
  },
  {
    id: 'F08',
    label: 'AUTOMATION · CLIENT',
    labelColor: 'text-[#22c55e]',
    name: 'SignNow Contract Generator',
    description: 'End-to-end client onboarding automation: form submission triggers Stripe payment, auto-generates and sends a SignNow contract, fires confirmation email, and updates the CRM — zero manual steps.',
    tech: ['n8n', 'Stripe', 'SignNow'],
    links: [],
    status: 'N8N WORKFLOW',
    statusColor: 'bg-[#22c55e]',
    aspectRatio: '16:9',
    mediaLabel: 'Workflow walkthrough',
    mediaFile: 'signnow-contract-generator.yt',
    imageSrc: '/images/sign now automation.png',
  },
  {
    id: 'F09',
    label: 'WEB · FULL-STACK',
    labelColor: 'text-[#3b82f6]',
    name: 'Airtable Clone',
    description: 'Airtable-inspired data grid with 100k+ row virtualisation, Google auth, dynamic columns, and keyboard navigation — built for speed and scale.',
    tech: ['React', 'TypeScript', 'PostgreSQL', 'tRPC', 'TanStack'],
    links: [{ label: 'View Specs', url: '#', isModal: true }],
    aspectRatio: '16:9',
    mediaLabel: 'Product demo',
    mediaFile: 'airtable-clone-demo.mp4',
    videoSrc: '/images/airtable%20clone.mp4',
    redBorder: true,
    specs: [
      'TanStack Table for all table UIs',
      'PostgreSQL database',
      'Main page only — bases, tables, columns, cells',
      '1:1 UI match with Airtable',
      'Google OAuth login — create bases, create tables per base',
      'Dynamically add columns (Text and Number types)',
      'Edit cells — arrow keys + Tab move across the table smoothly',
      'New tables pre-populated with faker.js default rows & columns',
      'Render 100k rows without lag via TanStack Virtualizer',
      'One-click button to add 100k rows to any table',
      'Virtualised infinite scroll using tRPC hooks + TanStack Virtualizer',
      'Full-text search across all cells — acts as a live row filter',
      'Saveable views — store filters, sorts, hidden columns per view',
      'Column filters: text (empty, not empty, contains, not contains, equals) and number (>, <)',
      'Column sorting: text A→Z / Z→A, number ascending / descending',
      'Search, filter, and sort executed at the database level',
      'Show / hide individual columns per view',
      'Loading states throughout',
      'Goal: 1M+ rows with no performance degradation',
    ],
  },
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

const CATEGORIES: Category[] = ['Featured', 'All', 'Web', 'Automation', 'Academic'];

const CATEGORY_LABELS: Record<Category, string> = {
  Featured: 'Featured',
  All: 'All',
  Web: 'Web',
  Automation: 'Automation',
  Academic: 'Academic',
};

/* ── Category badge colors ───────────────────────────────────── */
const CATEGORY_BADGE_COLORS: Record<Exclude<Category, 'All' | 'Featured'>, string> = {
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
    url: w.url,
    mainCategory: 'Automation',
    subCategory: w.category,
  };
}

interface CardProps {
  item: CardItem;
  index: number;
  onOpenModal?: (content: ModalContent) => void;
}

function ScrambleFilterBtn({ label, count, isActive, onClick }: {
  label: string; count: number; isActive: boolean; onClick: () => void;
}) {
  const { spanRef, onMouseEnter, onMouseLeave } = useScrambleHover(label);
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative inline-flex items-center gap-2 px-4 py-2 text-[0.65rem] tracking-[0.15em] uppercase font-sans transition-all duration-250 border rounded-sm ${
        isActive
          ? 'border-[#e63946] text-[#e63946] bg-[#e63946]/[0.08]'
          : 'border-white/[0.08] text-[#f0f0f0]/40 hover:border-white/[0.15] hover:text-[#f0f0f0]/65'
      }`}
    >
      <span ref={spanRef}>{label}</span>
      <span className={`text-[0.55rem] tabular-nums transition-colors duration-250 ${isActive ? 'text-[#e63946]/60' : 'text-[#f0f0f0]/20'}`}>
        {count}
      </span>
    </button>
  );
}

function Card({ item, index, onOpenModal }: CardProps) {
  const isLive = item.url !== undefined && item.url !== '#';
  const hasModal = !!item.modalContent;
  const hasUrl = item.url !== undefined;
  const hasTech = !!item.tech && item.tech.length > 0;
  const isAutomation = item.mainCategory === 'Automation';

  return (
    <article
      className="project-card group relative flex flex-col bg-[#1a1a1a] border border-white/[0.06] rounded-sm p-6 transition-all duration-300 hover:border-[#e63946]/40 hover:-translate-y-1 data-[center]:border-[#e63946]/50 data-[center]:-translate-y-1 data-[center]:scale-[1.02]"
      style={{
        boxShadow: '0 0 0 0 rgba(230,57,70,0)',
        transition:
          'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, scale 0.3s ease',
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
        <span className={CATEGORY_BADGE_COLORS[item.mainCategory as Exclude<Category, 'All' | 'Featured'>] ?? 'text-[#f0f0f0]/40'}>
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
              {isAutomation ? 'Watch Demo' : 'View Project'}
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
const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' seed='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

function YouTubeFacade({ youtubeId }: { youtubeId: string }) {
  const [active, setActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // On desktop: auto-activate when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { rootMargin: '300px 0px', threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {active ? (
        <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        /* Thumbnail facade — no YouTube JS loaded until active */
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => { e.preventDefault(); setActive(true); }}
        >
          <img
            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-10 flex flex-col items-center gap-2">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="18" fill="rgba(230,57,70,0.85)" />
              <path d="M15 12l10 6-10 6V12Z" fill="white" />
            </svg>
            <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/70 uppercase">Watch on YouTube</span>
          </div>
        </a>
      )}
    </div>
  );
}

function ScrambleFeaturedLink({ link, onClick }: { link: FeaturedLink; onClick?: () => void }) {
  const { spanRef, onMouseEnter, onMouseLeave } = useScrambleHover(link.label);
  const handleClick = link.isModal ? (e: React.MouseEvent) => { e.preventDefault(); onClick?.(); } : undefined;
  return (
    <a
      href={link.url}
      target={link.isModal ? undefined : '_blank'}
      rel={link.isModal ? undefined : 'noopener noreferrer'}
      className="inline-flex items-center gap-1.5 font-mono text-[0.75rem] tracking-[0.12em] uppercase text-[#e63946] hover:text-[#ff4d5a] transition-colors duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
    >
      <span ref={spanRef}>{link.label}</span>
      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function FeaturedCard({ item }: { item: FeaturedItem }) {
  const { id, label, labelColor, name, description, tech, links,
          mediaLabel, mediaFile,
          videoSrc, videoSrc2, videoLabel, videoLabel2, youtubeId, imageSrc, specs, isHero, redBorder } = item;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [showSpecs, setShowSpecs] = useState(false);
  // 0 = first video is main, 1 = second video is main
  const [activeVideo, setActiveVideo] = useState(0);
  const { spanRef: closeRef, onMouseEnter: closeEnter, onMouseLeave: closeLeave } = useScrambleHover('CLOSE');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showSpecs) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSpecs]);

  // Autoplay — observe article, play/pause all video refs
  useEffect(() => {
    const allVideos = [videoRef.current, videoRef2.current].filter((v): v is HTMLVideoElement => !!v);
    if (!allVideos.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        allVideos.forEach(v => {
          if (entry.isIntersecting) { v.play().catch(() => {}); }
          else { v.pause(); }
        });
      },
      { threshold: 0.2 },
    );
    // observe the article wrapper (parent of the videos)
    const article = videoRef.current?.closest('article');
    if (article) observer.observe(article);
    return () => observer.disconnect();
  }, [videoSrc, videoSrc2]);

  const autoRotateRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const rotateIntervalRef = useRef(20000); // fallback 20s

  const startAutoRotate = useCallback((ms?: number) => {
    clearInterval(autoRotateRef.current);
    const duration = ms ?? rotateIntervalRef.current;
    rotateIntervalRef.current = duration;
    autoRotateRef.current = setInterval(() => {
      setActiveVideo(v => v === 0 ? 1 : 0);
    }, duration);
  }, []);

  // Start auto-rotate when dual video mounts
  useEffect(() => {
    if (!videoSrc2) return;
    startAutoRotate();
    return () => clearInterval(autoRotateRef.current);
  }, [videoSrc2, startAutoRotate]);

  // When active video's duration is known, restart timer using that duration
  const handleVideoMetadata = useCallback(() => {
    const activeRef = activeVideo === 0 ? videoRef : videoRef2;
    const dur = activeRef.current?.duration;
    if (dur && isFinite(dur) && dur > 0) {
      startAutoRotate(dur * 1000);
    }
  }, [activeVideo, startAutoRotate]);

  // When active video changes: play the new main from start, reset the outgoing one
  useEffect(() => {
    const main = activeVideo === 0 ? videoRef.current : videoRef2.current;
    const other = activeVideo === 0 ? videoRef2.current : videoRef.current;
    if (main) { main.currentTime = 0; main.play().catch(() => {}); }
    if (other) { other.pause(); other.currentTime = 0; }
  }, [activeVideo]);

  return (
    <article className={`${isHero ? 'sm:col-span-2' : ''} flex flex-col`}>
      {/* Media box */}
      <div
        className={`relative w-full ${isHero ? 'aspect-[16/9]' : 'aspect-[16/9]'}
          border border-dashed ${redBorder ? 'border-[#e63946]/35' : 'border-white/15'}
          bg-[#0a0a0a] overflow-hidden mb-5 rounded-lg`}
      >
        {videoSrc && videoSrc2 ? (
          /* Both videos always mounted — stable refs, swap via z-index */
          <div className="absolute inset-0">
            {/* Video 1 */}
            <video
              ref={videoRef}
              src={videoSrc}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeVideo === 0 ? 'z-[2] opacity-100' : 'z-[1] opacity-0'}`}
              muted loop playsInline preload="none"
              onLoadedMetadata={activeVideo === 0 ? handleVideoMetadata : undefined}
            />
            {/* Video 2 */}
            <video
              ref={videoRef2}
              src={videoSrc2}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeVideo === 1 ? 'z-[2] opacity-100' : 'z-[1] opacity-0'}`}
              muted loop playsInline preload="none"
              onLoadedMetadata={activeVideo === 1 ? handleVideoMetadata : undefined}
            />
            {/* Main label */}
            <span className="absolute bottom-14 left-3.5 font-mono text-[0.55rem] tracking-widest text-white/35 uppercase z-10">
              {activeVideo === 0 ? videoLabel : videoLabel2}
            </span>
            {/* PiP thumbnail — always the other video, clicking swaps */}
            <button
              onClick={() => {
                setActiveVideo(v => v === 0 ? 1 : 0);
                startAutoRotate(); // reset timer on manual switch
              }}
              className="absolute bottom-3 left-3.5 w-[26%] aspect-video rounded border-2 border-black outline outline-1 outline-white/20 overflow-hidden group z-10 hover:outline-[#e63946]/50 transition-colors duration-200"
            >
              <div className="absolute inset-0 overflow-hidden">
                <video
                  src={activeVideo === 0 ? videoSrc2 : videoSrc}
                  className="w-full h-full object-cover"
                  muted loop playsInline preload="none"
                  ref={(el) => { if (el) el.play().catch(() => {}); }}
                />
              </div>
              {/* Label top-left of PiP */}
              <span className="absolute top-1.5 left-2 font-mono text-[0.45rem] tracking-widest text-white/70 uppercase z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {activeVideo === 0 ? videoLabel2 : videoLabel}
              </span>
              {/* Tap hint bottom */}
              <span className="absolute bottom-1.5 left-0 right-0 text-center font-mono text-[0.4rem] tracking-widest text-white/40 uppercase z-10">
                tap to switch
              </span>
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25 z-10">
                <span className="font-mono text-[0.45rem] tracking-widest text-white/90 uppercase">Switch</span>
              </span>
            </button>
          </div>
        ) : imageSrc ? (
          <img src={imageSrc} alt={name} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 97%' }} />
        ) : youtubeId ? (
          <YouTubeFacade youtubeId={youtubeId} />
        ) : videoSrc ? (
          <video ref={videoRef} src={videoSrc} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline preload="none" />
        ) : (
          <>
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: GRAIN_SVG, backgroundSize: '256px 256px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <svg width="10" height="12" viewBox="0 0 9 11" fill="currentColor" className="text-[#e63946]/60 mb-1" aria-hidden="true">
                <path d="M0 0L9 5.5L0 11V0Z" />
              </svg>
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[#e63946]/55 uppercase">{mediaLabel}</span>
              <span className="font-mono text-[0.55rem] tracking-widest text-white/25">{mediaFile}</span>
            </div>
          </>
        )}
      </div>

      {/* Meta + Links row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] text-white/25 uppercase">
          <span className="text-[#e63946]/60">{id}</span>
          {' · '}
          <span className={labelColor}>{label}</span>
        </p>
        <div className="flex flex-row items-center gap-5 flex-wrap">
          {links.map((link) => (
            <ScrambleFeaturedLink key={link.label} link={link} onClick={() => setShowSpecs(true)} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-display font-black text-[clamp(1.4rem,2.8vw,2.1rem)] leading-tight tracking-tight text-[#f0f0f0] mb-3">
          {name}
        </h3>
        <p className="font-sans text-[0.85rem] leading-relaxed text-[#f0f0f0]/50 mb-5 flex-1">
          {description}
        </p>
        <div className="flex items-end justify-between">
          <span className="font-mono text-[0.65rem] tracking-wider text-white/25 uppercase">
            {tech.join(' / ')}
          </span>
        </div>
      </div>

      {/* Specs modal — portalled to body to escape GSAP transform context */}
      {showSpecs && specs && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-sm"
          onClick={() => setShowSpecs(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/10 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header — fixed inside modal */}
            <div className="px-8 pt-7 pb-5 border-b border-white/[0.06] shrink-0 relative">
              <button
                onClick={() => setShowSpecs(false)}
                onMouseEnter={closeEnter}
                onMouseLeave={closeLeave}
                className="absolute top-5 right-6 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
              >
                <span ref={closeRef}>CLOSE</span>
              </button>
              <p className="font-mono text-[0.6rem] tracking-[0.25em] text-[#e63946]/60 uppercase mb-2">
                F09 · Requirements for Passing
              </p>
              <div className="flex items-end justify-between pr-16">
                <h2 className="font-display font-black text-[1.4rem] leading-tight text-[#f0f0f0]">
                  Airtable Clone
                </h2>
                <span className="font-mono text-[0.55rem] tracking-widest text-white/20 uppercase">
                  {specs.length} requirements
                </span>
              </div>
            </div>

            {/* Scrollable list — data-lenis-prevent stops Lenis hijacking wheel events */}
            <ul className="overflow-y-auto flex-1 px-8 py-6 space-y-0 divide-y divide-white/[0.04]" data-lenis-prevent>
              {specs.map((spec, i) => (
                <li key={i} className="flex items-start gap-4 py-4">
                  <span className="font-mono text-[0.55rem] text-[#e63946]/40 mt-[3px] shrink-0 w-5 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-[0.82rem] leading-relaxed text-[#f0f0f0]/55">{spec}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      , document.body)}
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('Featured');
  const [displayCategory, setDisplayCategory] = useState<Category>('Featured');
  const [openModal, setOpenModal] = useState<ModalContent | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<AutomationTab>('All');
  const [page, setPage] = useState(1);
  const hasAnimatedRef = useRef(false);

  const PAGE_SIZE = 12;

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

  /* Mobile: highlight the most-centered card on scroll (pop + red outline).
     Uses rAF-throttled scroll listener, only active below md (768px). */
  useEffect(() => {
    let rafId = 0;
    let prevActive: HTMLElement | null = null;

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (window.innerWidth >= 768) {
          // Desktop: clear any leftover highlight
          if (prevActive) { prevActive.removeAttribute('data-center'); prevActive = null; }
          return;
        }
        const cards = gridRef.current?.querySelectorAll<HTMLElement>('.project-card');
        if (!cards || cards.length === 0) return;

        const viewCenter = window.innerHeight / 2;
        let closest: HTMLElement | null = null;
        let closestDist = Infinity;

        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - viewCenter);
          if (dist < closestDist) { closestDist = dist; closest = card; }
        });

        const next = closest as HTMLElement | null;
        if (next !== prevActive) {
          prevActive?.removeAttribute('data-center');
          next?.setAttribute('data-center', '');
          prevActive = next;
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      prevActive?.removeAttribute('data-center');
    };
  }, [pageItems]); // re-attach when cards change

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="section-grain relative min-h-screen bg-black pt-24 pb-12 md:pt-32 md:pb-10 border-t border-white/[0.04] px-5"
    >


      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8" style={{ marginLeft: 'auto', marginRight: 'auto', position: 'relative', zIndex: 2 }}>
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
              cat === 'Featured'
                ? FEATURED_ITEMS.length
                : cat === 'Automation'
                ? automationProjects.length + WORKFLOWS.length
                : cat === 'All'
                ? PROJECTS.length + WORKFLOWS.length
                : PROJECTS.filter((p) => p.category === cat).length;
            return (
              <ScrambleFilterBtn
                key={cat}
                label={CATEGORY_LABELS[cat]}
                count={count}
                isActive={activeCategory === cat}
                onClick={() => handleFilter(cat)}
              />
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

        {/* Featured grid */}
        {displayCategory === 'Featured' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {FEATURED_ITEMS.map((item) => (
                <FeaturedCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}

        {/* Unified grid (non-Featured tabs) */}
        {displayCategory !== 'Featured' && (
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
        )}

        {/* Pagination */}
        {displayCategory !== 'Featured' && pageCount > 1 && (
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
            {(() => {
              /* Build a windowed page list: 1 … (cur-1) [cur] (cur+1) … last */
              const items: (number | 'dots')[] = [];
              if (pageCount <= 5) {
                for (let i = 1; i <= pageCount; i++) items.push(i);
              } else {
                items.push(1);
                if (page > 3) items.push('dots');
                for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) items.push(i);
                if (page < pageCount - 2) items.push('dots');
                items.push(pageCount);
              }
              return items.map((item, idx) =>
                item === 'dots' ? (
                  <span
                    key={`dots-${idx}`}
                    className="inline-flex items-center justify-center min-w-[2rem] px-1 py-1.5 text-[0.65rem] text-[#f0f0f0]/30 font-sans select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item)}
                    aria-current={item === page ? 'page' : undefined}
                    className={`inline-flex items-center justify-center min-w-[2rem] px-2.5 py-1.5 text-[0.65rem] tabular-nums font-sans border rounded-sm transition-all duration-200 ${
                      item === page
                        ? 'border-[#e63946] text-[#e63946] bg-[#e63946]/[0.08]'
                        : 'border-white/[0.08] text-[#f0f0f0]/40 hover:border-white/[0.2] hover:text-[#f0f0f0]/70'
                    }`}
                  >
                    {item}
                  </button>
                )
              );
            })()}
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
