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

const HOBBIES_SKILLS = ['Gym', 'Dragon Dancing', 'Muay Thai', 'Badminton', 'PickleBall', 'Jiu-jitsu', 'PC Building', 'BeatBoxing'];

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

      gsap.fromTo(
        '.skill-row',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: '.skills-rows',
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative bg-black border-t border-white/[0.04] pt-24 pb-28 md:pt-36 md:pb-44 px-5"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.04 }}
      />

      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

          {/* Heading — full width, above content */}
          <div className="skills-label flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#e63946]" />
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
              Skills
            </span>
          </div>
          <h2 className="skills-heading font-display font-black text-[clamp(2rem,5vw,5rem)] leading-[0.88] tracking-[-0.03em] text-[#f0f0f0] mb-12">
            Tools of<br />
            <span className="text-[#e63946]">the trade</span>
          </h2>

          {/* Skills rows + hobbies */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">

              {/* Main skill rows */}
              <div className="skills-rows">
                {SKILL_GROUPS.map(({ label, skills }) => (
                  <div
                    key={label}
                    className="skill-row group border-t border-white/[0.05] hover:bg-white/[0.015] transition-colors duration-300 last:border-b last:border-white/[0.05]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0 py-8">
                      {/* Category label */}
                      <div className="sm:w-40 shrink-0 flex items-center gap-3">
                        <div className="h-px w-4 bg-[#e63946]/50 hidden sm:block" />
                        <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#e63946]/70 font-sans">
                          {label}
                        </span>
                      </div>

                      {/* Separator — desktop only */}
                      <div className="hidden sm:block w-px bg-white/[0.05] self-stretch mx-6" />

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 flex-1">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1.5 text-[0.72rem] tracking-[0.06em] font-sans border border-white/[0.08] text-[#f0f0f0]/55 hover:border-[#e63946]/30 hover:text-[#f0f0f0]/85 transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hobbies column */}
              <div className="lg:border-l lg:border-white/[0.05] lg:pl-10 pt-8 lg:pt-0">
                <div className="border-t border-white/[0.05] pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-4 bg-[#e63946]/50" />
                    <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#e63946]/70 font-sans">
                      Hobbies
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {HOBBIES_SKILLS.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1.5 text-[0.72rem] tracking-[0.06em] font-sans border border-white/[0.08] text-[#f0f0f0]/55 hover:border-[#e63946]/30 hover:text-[#f0f0f0]/85 transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

        </div>
    </section>
  );
}
