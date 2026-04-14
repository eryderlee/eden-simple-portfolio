'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '109+', label: 'Workflows Built' },
  { value: '13+', label: 'Web Projects' },
  { value: 'Top 5%', label: 'Lyra Challenge' },
];

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-label', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.from('.about-heading', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.about-heading',
          start: 'top 80%',
        },
      });

      gsap.from('.about-body', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.about-body',
          start: 'top 82%',
        },
      });

      gsap.from('.about-image', {
        opacity: 0,
        scale: 0.96,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-image',
          start: 'top 80%',
        },
      });

      gsap.from('.stat-item', {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.stats-row',
          start: 'top 82%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-white/[0.04] py-28 px-8"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.04 }}
      />

      {/* Subtle left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Section label */}
        <div className="about-label flex items-center gap-4 mb-14">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            About
          </span>
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-start">

          {/* Left: text block */}
          <div className="space-y-10">
            <h2 className="about-heading font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-tight text-[#f0f0f0]">
              Building at the<br />
              intersection of<br />
              <span className="text-[#e63946]">code &amp; automation</span>
            </h2>

            <div className="space-y-4">
              <p className="about-body font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/55 max-w-[52ch]">
                Computing and Software Systems major who builds web experiences
                and automates workflows. CTO at{' '}
                <span className="text-[#f0f0f0]/80">Baseaim</span> — a
                marketing agency for accountants — and Partner at{' '}
                <span className="text-[#f0f0f0]/80">CoFarming-Hub</span>, a
                sustainable agriculture startup.
              </p>
              <p className="about-body font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/55 max-w-[52ch]">
                Passionate about innovative solutions and community impact.
              </p>
            </div>

            {/* Meta grid */}
            <div className="about-body grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 pt-2 max-w-lg">
              {[
                ['Location', 'Point Cook, VIC'],
                ['Country', 'Australia'],
                ['Currently', 'BSc Computing'],
                ['University', 'UniMelb 2025'],
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

          {/* Right: profile photo */}
          <div className="about-image flex justify-center lg:justify-end">
            <div className="relative w-[260px] h-[330px] lg:w-[300px] lg:h-[390px] shrink-0">
              {/* Red offset frame — more prominent */}
              <div className="absolute inset-0 translate-x-5 translate-y-5 border-2 border-[#e63946]/50" />
              {/* Corner accent dot */}
              <div className="absolute top-[calc(100%+5px)] left-[calc(100%+5px)] w-2 h-2 bg-[#e63946]/70 translate-x-[3px] translate-y-[3px]" />
              {/* Photo box */}
              <div className="absolute inset-0 bg-[#181818] border border-[#e63946]/20 overflow-hidden">
                <Image
                  src="/images/profile.jpg"
                  alt="Eden Ryder Lee"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 240px, 280px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row mt-16 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] border border-white/[0.06]">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="stat-item px-8 py-8 hover:bg-white/[0.02] transition-colors duration-300"
            >
              <div className="font-display font-black text-[2.8rem] leading-none text-[#e63946] mb-2 tracking-tight">
                {value}
              </div>
              <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[#f0f0f0]/38 font-sans">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
