'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Tile {
  label: string;
  skills: string[];
  /** Tailwind col-span on md+ */
  span: string;
}

const TILES: Tile[] = [
  {
    label: 'Languages',
    skills: ['JavaScript', 'TypeScript', 'Python', 'C', 'HTML', 'CSS'],
    span: 'md:col-span-4',
  },
  {
    label: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'GSAP', 'TanStack Query'],
    span: 'md:col-span-2',
  },
  {
    label: 'Backend',
    skills: ['Node.js', 'tRPC', 'Prisma', 'REST APIs', 'NextAuth'],
    span: 'md:col-span-3',
  },
  {
    label: 'Databases',
    skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'Vector DB (RAG)'],
    span: 'md:col-span-3',
  },
  {
    label: 'Automation',
    skills: ['n8n', 'OpenAI API', 'Retell', 'SignNow', 'Cal.com'],
    span: 'md:col-span-4',
  },
  {
    label: 'Tools & Platforms',
    skills: ['Git', 'Vercel', 'Netlify', 'Stripe', 'GitHub', 'Figma'],
    span: 'md:col-span-2',
  },
  {
    label: 'Hobbies',
    skills: ['Gym', 'Dragon Dancing', 'Muay Thai', 'Badminton', 'PickleBall', 'Jiu-jitsu', 'PC Building', 'BeatBoxing'],
    span: 'md:col-span-6',
  },
];

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
        '.skill-tile',
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: '.skills-bento',
            start: 'top 88%',
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
      className="section-grain relative bg-black border-t border-white/[0.04] pt-24 pb-20 md:pt-36 md:pb-24 px-5"
    >
      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 w-full">
        {/* Heading */}
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

        {/* Bento grid */}
        <div className="skills-bento grid grid-cols-1 md:grid-cols-6 gap-3 auto-rows-fr">
          {TILES.map(({ label, skills, span }) => (
            <article
              key={label}
              className={`skill-tile group relative flex flex-col bg-[#0d0d0d] border border-white/[0.06] p-6 md:p-7 transition-colors duration-300 hover:border-[#e63946]/35 ${span}`}
            >
              {/* Corner bracket — top-right */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-[#e63946]/40 transition-colors duration-300 group-hover:border-[#e63946]"
              />
              {/* Corner bracket — bottom-left */}
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-[#e63946]/25 transition-colors duration-300 group-hover:border-[#e63946]/70"
              />

              {/* Label row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-4 bg-[#e63946]/60" />
                <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#e63946]/75 font-sans">
                  {label}
                </span>
                <span className="text-[0.55rem] tabular-nums font-sans text-[#f0f0f0]/30 ml-auto">
                  {String(skills.length).padStart(2, '0')}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1.5 text-[0.72rem] tracking-[0.06em] font-sans border border-white/[0.08] text-[#f0f0f0]/60 hover:border-[#e63946]/40 hover:text-[#f0f0f0]/90 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
