'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

const LINKS = [
  {
    label: 'Email',
    value: 'eden@ryderagency.com',
    href: 'mailto:eden@ryderagency.com',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/edenryderlee',
    href: 'https://linkedin.com/in/edenryderlee',
  },
  {
    label: 'GitHub',
    value: 'github.com/eryderlee',
    href: 'https://github.com/eryderlee',
  },
  {
    label: 'Agency',
    value: 'ryderagency.com',
    href: 'https://ryderagency.com',
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-label', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.from('.contact-heading', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.contact-heading',
          start: 'top 80%',
        },
      });

      gsap.from('.contact-link-item', {
        opacity: 0,
        y: 20,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.contact-links',
          start: 'top 80%',
        },
      });

      gsap.from('.contact-cta', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-cta',
          start: 'top 84%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative border-t border-white/[0.04] py-28 px-8"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.04 }}
      />

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto w-full">

        {/* Section label */}
        <div className="contact-label flex items-center gap-4 mb-14">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            Contact
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading + copy */}
          <div>
            <h2 className="contact-heading font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-tight text-[#f0f0f0] mb-8">
              Let&apos;s build<br />
              <span className="text-[#e63946]">something</span>
            </h2>
            <p className="font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/50 max-w-[44ch]">
              Open to freelance projects, full-time roles, and interesting
              collaborations. Based in Point Cook, VIC — available remotely
              worldwide.
            </p>
          </div>

          {/* Right: links */}
          <div className="contact-links divide-y divide-white/[0.05]">
            {LINKS.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="contact-link-item group flex items-center justify-between py-5 first:pt-0 last:pb-0 hover:pl-2 transition-all duration-300"
              >
                <div>
                  <span className="text-[0.58rem] tracking-[0.26em] uppercase text-[#f0f0f0]/22 font-sans block mb-0.5">
                    {label}
                  </span>
                  <span className="font-sans text-[0.88rem] text-[#f0f0f0]/65 group-hover:text-[#f0f0f0]/90 transition-colors duration-200">
                    {value}
                  </span>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                >
                  <path
                    d="M1 13L13 1M13 1H5M13 1V9"
                    stroke="#e63946"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="contact-cta mt-20 pt-10 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-sans text-[0.72rem] tracking-[0.14em] uppercase text-[#f0f0f0]/20">
            Point Cook, VIC · Australia · Available Remotely
          </span>
          <a
            href="mailto:eden@ryderagency.com"
            className="inline-flex items-center gap-2 px-5 py-3 border border-[#e63946]/50 text-[0.72rem] tracking-[0.14em] uppercase font-sans text-[#e63946] hover:bg-[#e63946]/[0.08] hover:border-[#e63946] transition-all duration-300"
          >
            Get in touch
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
