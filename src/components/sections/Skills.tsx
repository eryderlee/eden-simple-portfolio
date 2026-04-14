'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_GROUPS = [
  {
    label: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'C', 'HTML', 'CSS'],
  },
  {
    label: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'GSAP', 'TanStack Query'],
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'tRPC', 'Prisma', 'REST APIs', 'NextAuth'],
  },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'Vector DB (RAG)'],
  },
  {
    label: 'Automation',
    skills: ['n8n', 'OpenAI API', 'Retell', 'SignNow', 'Cal.com'],
  },
  {
    label: 'Tools & Platforms',
    skills: ['Git', 'Vercel', 'Netlify', 'Stripe', 'GitHub', 'Figma'],
  },
];

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skills-label', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.from('.skills-heading', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.skills-heading',
          start: 'top 80%',
        },
      });

      gsap.from('.skill-group', {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 78%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative border-t border-white/[0.04] py-36 px-8"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.04 }}
      />

      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Split layout: heading left (1fr), content right (2fr) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24 items-start">

          {/* Left: label + heading */}
          <div>
            <div className="skills-label flex items-center gap-4 mb-14">
              <div className="h-px w-8 bg-[#e63946]" />
              <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
                Skills
              </span>
            </div>
            <h2 className="skills-heading font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-tight text-[#f0f0f0]">
              Tools of<br />
              <span className="text-[#e63946]">the trade</span>
            </h2>
          </div>

          {/* Right: skills grid */}
          <div className="skills-grid grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04]">
            {SKILL_GROUPS.map(({ label, skills }) => (
              <div
                key={label}
                className="skill-group bg-[#111111] p-10 hover:bg-white/[0.015] transition-colors duration-300"
              >
                <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#e63946]/70 font-sans block mb-5">
                  {label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-2.5 py-1 text-[0.7rem] tracking-[0.06em] font-sans border border-white/[0.08] text-[#f0f0f0]/55 hover:border-[#e63946]/30 hover:text-[#f0f0f0]/80 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
