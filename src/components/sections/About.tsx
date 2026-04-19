'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrambleHover } from '@/components/ui/ScrambleLink';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 109, prefix: '', suffix: '+', label: 'Workflows Built' },
  { target: 13, prefix: '', suffix: '+', label: 'Web Projects' },
  { target: 4, prefix: '', suffix: '+', label: 'Years Full-Stack' },
  { target: 5, prefix: 'Top ', suffix: '%', label: 'Lyra Challenge' },
];

const TICKER_WORDS = [
  'Clean Code', 'Type Safety', 'RESTful APIs', 'CI/CD Pipelines',
  'Test-Driven Dev', 'Git Flow', 'Performance First', 'Security Mindset',
  'DRY Principles', 'Component Architecture', 'API Design',
  'Database Optimisation', 'Responsive Design', 'Accessibility',
  'Error Handling', 'Code Reviews', 'Scalable Systems', 'Version Control',
];

function WatchLink() {
  const { spanRef, onMouseEnter, onMouseLeave } = useScrambleHover('Watch my intro');
  return (
    <a
      href="https://youtu.be/HAOkVh_K5Kk"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#e63946]/50 group-hover:bg-[#e63946]/10 group-hover:border-[#e63946] transition-all duration-300">
        <svg width="8" height="10" viewBox="0 0 10 12" fill="none" aria-hidden="true">
          <path d="M1 1l8 5-8 5V1z" fill="#e63946" />
        </svg>
      </span>
      <span
        ref={spanRef}
        className="font-sans text-[0.78rem] text-[#f0f0f0]/45 group-hover:text-[#f0f0f0]/75 transition-colors duration-200"
      >
        Watch my intro
      </span>
    </a>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-label',
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );

      gsap.fromTo('.about-heading',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo('.about-body',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: '.about-body',
            start: 'top 82%',
          },
        }
      );

      gsap.fromTo(
        '.about-image',
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-image',
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.fromTo('.stat-item',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.stats-row',
            start: 'top 82%',
          },
        }
      );

      /* Count up each stat value from 0 → target on scroll-in */
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach((el) => {
        const target = Number(el.dataset.target ?? '0');
        const prefix = el.dataset.prefix ?? '';
        const suffix = el.dataset.suffix ?? '';
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.stats-row',
            start: 'top 82%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(counter.val)}${suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-grain relative border-t border-white/[0.04] pt-24 pb-0 md:pt-28 px-5"
    >

      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Section label */}
        <div className="about-label flex items-center gap-4 mb-14 opacity-0">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            About
          </span>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-start">

          {/* Left: text block */}
          <div className="space-y-10">
            <h2 className="about-heading font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-tight text-[#f0f0f0] opacity-0">
              Building at the<br />
              intersection of<br />
              <span className="text-[#e63946]">code &amp; automation</span>
            </h2>

            <div className="space-y-4">
              <p className="about-body font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/55 max-w-[52ch] opacity-0">
                Computing and Software Systems major who builds web experiences
                and automates workflows. CTO at{' '}
                <span className="text-[#f0f0f0]/80">Baseaim</span> — a
                marketing agency for accountants — and Partner at{' '}
                <span className="text-[#f0f0f0]/80">CoFarming-Hub</span>, a
                sustainable agriculture startup.
              </p>
              <p className="about-body font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/55 max-w-[52ch] opacity-0">
                Passionate about innovative solutions and community impact.
              </p>
            </div>

            {/* Meta grid */}
            <div className="about-body grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 pt-2 max-w-lg opacity-0">
              {[
                ['Location', 'Point Cook, VIC'],
                ['Country', 'Australia'],
                ['Currently', 'BSc Computing'],
                ['University', 'UniMelb 2024'],
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="text-[0.58rem] tracking-[0.28em] uppercase text-[#f0f0f0]/22 font-sans block mb-1">
                    {label}
                  </span>
                  <span className="text-[0.82rem] text-[#f0f0f0]/65 font-sans">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: profile photo + watch intro */}
          <div className="about-image flex flex-col items-center lg:items-end gap-5 opacity-0">
            <div className="relative w-[220px] h-[240px] lg:w-[260px] lg:h-[280px] shrink-0">
              {/* Red offset frame */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-[#e63946]/50" />
              {/* Corner accent dot */}
              <div className="absolute top-[calc(100%+4px)] left-[calc(100%+4px)] w-2 h-2 bg-[#e63946]/70 translate-x-[3px] translate-y-[3px]" />
              {/* Photo box */}
              <div className="absolute inset-0 bg-[#181818] border border-[#e63946]/20 overflow-hidden">
                <Image
                  src="/images/profile.jpg"
                  alt="Eden Ryder Lee"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 220px, 260px"
                />
              </div>
            </div>

            {/* Watch my intro — directly below photo */}
            <WatchLink />
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row mt-16 grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] border border-white/[0.06]">
          {STATS.map(({ target, prefix, suffix, label }) => (
            <div
              key={label}
              className="stat-item px-8 py-8 hover:bg-white/[0.02] transition-colors duration-300 opacity-0"
            >
              <div
                className="stat-value font-display font-black text-[2.8rem] leading-none text-[#e63946] mb-2 tracking-tight tabular-nums"
                data-target={target}
                data-prefix={prefix}
                data-suffix={suffix}
              >
                {prefix}0{suffix}
              </div>
              <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[#f0f0f0]/38 font-sans">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling ticker — full bleed, flush at section bottom */}
      <div className="ticker-wrap relative mt-16 -mx-5 border-t border-b border-[#e63946]/35 overflow-hidden">
        <div className="flex whitespace-nowrap py-3.5" style={{ animation: 'ticker 40s linear infinite' }}>
          {[...TICKER_WORDS, ...TICKER_WORDS].map((word, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6 text-[0.6rem] tracking-[0.22em] uppercase font-sans text-[#f0f0f0]/55">
              {word}
              <span className="text-[#e63946]/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
