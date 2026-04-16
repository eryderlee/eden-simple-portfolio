'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const NAME = 'EDEN RYDER LEE';

function LetterSpans({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ paddingBottom: '0.05em' }}
          aria-hidden="true"
        >
          <span
            className={`char inline-block${char === ' ' ? ' w-[0.28em]' : ''}`}
            style={{ transform: 'translateY(105%)' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Set initial states
      gsap.set('.char', { y: '105%' });
      gsap.set([subtitleRef.current, taglineRef.current, separatorRef.current], {
        opacity: 0,
        y: 20,
      });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      // Animate
      tl.to('.char', {
        y: '0%',
        duration: 0.9,
        stagger: 0.03,
      })
        .to(
          separatorRef.current,
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.3'
        )
        .to(
          subtitleRef.current,
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .to(
          taglineRef.current,
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        )
        .to(
          scrollIndicatorRef.current,
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-grain relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
    >

      {/* Left architectural accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />

      {/* Right architectural accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f0f0f0]/5 to-transparent" />

      {/* Corner labels */}
      <span className="absolute top-[5.5rem] left-8 text-[0.6rem] tracking-[0.25em] uppercase text-[#f0f0f0]/20 font-sans">
        Portfolio v3 Simple
      </span>
      <span className="absolute top-[5.5rem] right-8 text-[0.6rem] tracking-[0.25em] uppercase text-[#f0f0f0]/20 font-sans">
        2026
      </span>

      {/* Main content */}
      <div className="relative text-center px-6 max-w-[95vw]">
        {/* Name */}
        <h1
          className="font-display font-black leading-[0.85] tracking-[-0.03em] text-[#f0f0f0] mb-6 select-none"
          style={{
            textShadow: '0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          <div className="text-[clamp(0.95rem,6.5vw,10rem)] whitespace-nowrap" style={{ whiteSpace: 'nowrap' }}>
            <LetterSpans text={NAME} />
          </div>
        </h1>

        {/* Separator */}
        <div
          ref={separatorRef}
          className="flex items-center gap-4 justify-center mb-6 opacity-0"
        >
          <div className="h-px w-16 bg-[#e63946]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#e63946]" />
          <div className="h-px w-16 bg-[#e63946]" />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-display text-[clamp(1rem,2.5vw,1.5rem)] font-semibold tracking-wide text-[#f0f0f0]/85 mb-3 opacity-0"
        >
          Full-Stack Developer{' '}
          <span className="text-[#e63946]">&amp;</span> Automation Architect
        </p>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-sans text-[0.65rem] tracking-[0.3em] uppercase text-[#f0f0f0]/35 opacity-0"
        >
          Building web experiences and automating workflows
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
          Scroll
        </span>
        <div className="relative w-px h-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#e63946] to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
