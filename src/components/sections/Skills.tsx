'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    label: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Three.js / R3F',
      'Tailwind CSS',
      'GSAP',
      'Framer Motion',
      'HTML / CSS',
    ],
  },
  {
    label: 'Backend',
    skills: [
      'Node.js',
      'Python',
      'PHP',
      'Supabase',
      'Prisma',
      'tRPC',
      'PostgreSQL',
      'REST APIs',
    ],
  },
  {
    label: 'Automation & AI',
    skills: [
      'n8n',
      'OpenAI / LLMs',
      'RAG Architecture',
      'Retell AI',
      'Voice Agents',
      'Web Scraping',
      'Email Automation',
      'CRM Automation',
    ],
  },
  {
    label: 'Tools & Platforms',
    skills: [
      'Git / GitHub',
      'Vercel',
      'Netlify',
      'Figma',
      'Photoshop',
      'Cal.com',
      'Stripe',
      'SignNow',
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-header', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-header',
          start: 'top 85%',
        },
      });

      gsap.from('.category-card', {
        opacity: 0,
        y: 50,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
        },
      });

      gsap.from('.skill-pill', {
        opacity: 0,
        scale: 0.85,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.03,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-32 border-t border-white/[0.04]"
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        {/* Section header */}
        <div className="skills-header mb-20">
          <span className="block text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/25 font-sans mb-4">
            03 — Expertise
          </span>
          <h2 className="font-display font-black text-[clamp(3rem,8vw,7rem)] leading-none tracking-tight text-[#f0f0f0] uppercase">
            Skills
          </h2>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px w-12 bg-[#e63946]" />
            <div className="w-1 h-1 rounded-full bg-[#e63946]" />
          </div>
        </div>

        {/* Category grid — hairline separators via gap-px on tinted background */}
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
          {CATEGORIES.map(({ label, skills }) => (
            <div
              key={label}
              className="category-card bg-[#111111] p-10"
              style={{ borderTop: '2px solid rgba(230,57,70,0.25)' }}
            >
              {/* Category label */}
              <h3 className="font-display text-[0.6rem] tracking-[0.35em] uppercase text-[#e63946] mb-8 font-semibold">
                {label}
              </h3>

              {/* Skill pills */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-pill inline-flex items-center px-3.5 py-1.5 text-[0.72rem] tracking-wide font-sans font-medium text-[#f0f0f0]/65 bg-white/[0.04] border border-white/[0.08] rounded-full hover:text-[#f0f0f0] hover:border-[#e63946]/50 hover:bg-[#e63946]/[0.07] transition-all duration-200 cursor-default select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
