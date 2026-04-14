'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORK = [
  {
    title: 'CTO',
    org: 'Baseaim',
    period: '2025 – Present',
    desc: 'Marketing agency for accountants. Built AI chatbots, voice agents, automated CRM systems, 109+ n8n workflows.',
  },
  {
    title: 'Partner',
    org: 'CoFarming-Hub',
    period: '2025 – Present',
    desc: 'Sustainable agriculture startup. Business development, e-commerce, social media.',
  },
  {
    title: 'Web Developer',
    org: 'Freelance / RyderAgency',
    period: '2024 – Present',
    desc: 'Responsive websites, SEO optimisation, full project lifecycle.',
  },
  {
    title: 'Waiter',
    org: 'Jade Stream',
    period: 'Aug – Dec 2024',
    desc: null,
  },
  {
    title: 'Chef',
    org: 'Sushi Train',
    period: 'Dec 2022 – Jul 2023',
    desc: null,
  },
];

const EDUCATION = [
  {
    degree: 'BSc Computing & Software Systems',
    institution: 'University of Melbourne',
    period: '2025',
    note: null,
    activities: null,
  },
  {
    degree: 'International Baccalaureate',
    institution: 'Queensland Academy of Health Science',
    period: '2021 – 2023',
    note: 'Grade: High',
    activities: 'Dragon dancing · Tai chi · Badminton · Volleyball · Jiu-jitsu',
  },
];

const CERTIFICATIONS = [
  { name: 'Lyra Certified Full-Stack Engineer', badge: 'Top 5%', date: 'Mar 2026' },
  { name: 'HubSpot Inbound Marketing', badge: null, date: 'Feb 2026' },
  { name: 'Cert III Laboratory Skills', badge: null, date: 'Jun 2021' },
  { name: 'Cert II Sampling & Measurement', badge: null, date: 'Jun 2021' },
];

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp-label', {
        opacity: 0,
        x: -16,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
        },
      });

      gsap.from('.exp-heading', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.exp-heading',
          start: 'top 80%',
        },
      });

      gsap.from('.timeline-entry', {
        opacity: 0,
        x: -24,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.11,
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 72%',
        },
      });

      gsap.from('.edu-item', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.edu-section',
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from('.cert-item', {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.cert-section',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative border-t border-white/[0.04] py-36 px-8"
    >
      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SVG, opacity: 0.04 }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

        {/* Section label */}
        <div className="exp-label flex items-center gap-4 mb-14">
          <div className="h-px w-8 bg-[#e63946]" />
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
            Experience
          </span>
        </div>

        {/* Heading */}
        <h2 className="exp-heading font-display font-black text-[clamp(2.4rem,5vw,5rem)] leading-[0.88] tracking-tight text-[#f0f0f0] mb-20">
          Where I&apos;ve<br />
          <span className="text-[#e63946]">Been</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">

          {/* Left: work timeline */}
          <div>
            <span className="text-[0.6rem] tracking-[0.28em] uppercase text-[#f0f0f0]/25 font-sans block mb-8">
              Work
            </span>

            <div className="timeline-container relative pl-7">
              {/* Red vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#e63946]/50 via-[#e63946]/20 to-transparent" />

              <div className="space-y-0">
                {WORK.map((item, i) => (
                  <div key={i} className="timeline-entry relative pb-10 last:pb-0">
                    {/* Dot */}
                    <div
                      className="absolute top-[0.45rem] rounded-full bg-[#e63946]"
                      style={{ left: '-1.85rem', width: 7, height: 7 }}
                    />

                    <div className="border border-white/[0.06] p-6 hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300">
                      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-2">
                        <div>
                          <span className="font-display font-bold text-[0.95rem] text-[#f0f0f0]">
                            {item.title}
                          </span>
                          <span className="font-sans text-[0.82rem] text-[#e63946] ml-2">
                            — {item.org}
                          </span>
                        </div>
                        <span className="text-[0.62rem] tracking-[0.16em] uppercase text-[#f0f0f0]/28 font-sans shrink-0">
                          {item.period}
                        </span>
                      </div>
                      {item.desc && (
                        <p className="font-sans text-[0.82rem] leading-relaxed text-[#f0f0f0]/46">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: education + certs */}
          <div className="space-y-16">

            {/* Education */}
            <div className="edu-section">
              <span className="text-[0.6rem] tracking-[0.28em] uppercase text-[#f0f0f0]/25 font-sans block mb-6">
                Education
              </span>
              <div className="space-y-4">
                {EDUCATION.map((item, i) => (
                  <div
                    key={i}
                    className="edu-item border border-white/[0.06] p-6 hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-300"
                  >
                    <div className="font-display font-bold text-[0.9rem] text-[#f0f0f0] mb-1 leading-snug">
                      {item.degree}
                    </div>
                    <div className="font-sans text-[0.78rem] text-[#f0f0f0]/48 mb-3">
                      {item.institution}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[#f0f0f0]/28 font-sans">
                        {item.period}
                      </span>
                      {item.note && (
                        <span className="text-[0.6rem] tracking-[0.16em] uppercase text-[#e63946]/65 font-sans">
                          {item.note}
                        </span>
                      )}
                    </div>
                    {item.activities && (
                      <p className="font-sans text-[0.72rem] leading-relaxed text-[#f0f0f0]/32 mt-2">
                        {item.activities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="cert-section">
              <span className="text-[0.6rem] tracking-[0.28em] uppercase text-[#f0f0f0]/25 font-sans block mb-6">
                Certifications
              </span>
              <div className="divide-y divide-white/[0.05]">
                {CERTIFICATIONS.map((cert, i) => (
                  <div
                    key={i}
                    className="cert-item flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-[0.82rem] text-[#f0f0f0]/62">
                        {cert.name}
                      </span>
                      {cert.badge && (
                        <span className="text-[0.55rem] tracking-[0.18em] uppercase text-[#e63946] font-sans border border-[#e63946]/30 px-1.5 py-0.5">
                          {cert.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[0.6rem] tracking-[0.12em] uppercase text-[#f0f0f0]/24 font-sans whitespace-nowrap shrink-0">
                      {cert.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
