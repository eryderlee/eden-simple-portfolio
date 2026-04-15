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

      /* Tile entrance */
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

      /* Per-tile: scan-line sweep, pill reveals, count-up
         Each tile animates in sequence with the tile entrance stagger. */
      gsap.utils.toArray<HTMLElement>('.skill-tile').forEach((tile, i) => {
        const scan = tile.querySelector<HTMLElement>('.scan-line');
        const pills = tile.querySelectorAll<HTMLElement>('.skill-pill');
        const counter = tile.querySelector<HTMLElement>('.skill-count');
        const target = Number(counter?.dataset.target ?? '0');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.skills-bento',
            start: 'top 88%',
            once: true,
          },
          delay: 0.3 + i * 0.08, // line up with the tile entrance stagger
        });

        if (scan) {
          tl.fromTo(
            scan,
            { top: '0%', opacity: 0.55 },
            { top: '100%', opacity: 0, duration: 0.75, ease: 'power2.inOut' },
            0
          );
        }

        tl.fromTo(
          pills,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            stagger: 0.035,
          },
          0.15
        );

        if (counter) {
          const obj = { v: 0 };
          tl.to(
            obj,
            {
              v: target,
              duration: 0.9,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = String(Math.round(obj.v)).padStart(2, '0');
              },
            },
            0
          );
        }
      });
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
              className={`skill-tile relative flex flex-col overflow-hidden bg-[#0d0d0d] border border-white/[0.06] p-6 md:p-7 transition-colors duration-300 hover:border-[#e63946]/35 ${span}`}
            >
              {/* Scan-line sweep (animated on scroll-in) */}
              <span
                aria-hidden="true"
                className="scan-line pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e63946]/70 to-transparent opacity-0"
                style={{ top: '0%' }}
              />

              {/* Label row */}
              <div className="relative flex items-center gap-3 mb-5">
                <div className="h-px w-4 bg-[#e63946]/60" />
                <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#e63946]/75 font-sans">
                  {label}
                </span>
                <span
                  className="skill-count text-[0.55rem] tabular-nums font-sans text-[#f0f0f0]/30 ml-auto"
                  data-target={skills.length}
                >
                  00
                </span>
              </div>

              {/* Skills */}
              <div className="relative flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-pill inline-flex items-center px-3 py-1.5 text-[0.72rem] tracking-[0.06em] font-sans border border-white/[0.08] text-[#f0f0f0]/60 hover:border-[#e63946]/40 hover:text-[#f0f0f0]/90 transition-colors duration-200"
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
