'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/eryderlee',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/eden-lee-6016a4300/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/~012a4a76ab87f6fcb6',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703 0 1.489-1.211 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.545-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@RyderDigital',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-item', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
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

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/30 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Section label */}
          <span className="contact-item text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/25 font-sans">
            05 — Contact
          </span>

          {/* Heading */}
          <h2 className="contact-item font-display font-black text-[clamp(2.8rem,8vw,7rem)] leading-none tracking-tight text-[#f0f0f0] uppercase">
            Let&apos;s Work<br />Together
          </h2>

          {/* Subtext */}
          <p className="contact-item font-sans text-[0.875rem] text-[#f0f0f0]/40 tracking-wide max-w-sm leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it.
          </p>

          {/* Red separator */}
          <div className="contact-item flex items-center gap-4">
            <div className="h-px w-12 bg-[#e63946]" />
            <div className="w-1 h-1 rounded-full bg-[#e63946]" />
            <div className="h-px w-12 bg-[#e63946]" />
          </div>

          {/* Email */}
          <a
            href="mailto:eryderlee@gmail.com"
            className="contact-item group font-display font-semibold text-[clamp(1.1rem,3.5vw,2rem)] text-[#f0f0f0]/75 hover:text-[#e63946] transition-colors duration-300 tracking-wide"
          >
            eryderlee@gmail.com
            <span className="block h-px w-0 group-hover:w-full bg-[#e63946] transition-all duration-500 mt-1 mx-auto" />
          </a>

          {/* Phone */}
          <a
            href="tel:0401708312"
            className="contact-item font-sans text-[0.8rem] tracking-[0.2em] text-[#f0f0f0]/30 hover:text-[#f0f0f0]/65 transition-colors duration-300"
          >
            0401 708 312
          </a>

          {/* Social icons */}
          <div className="contact-item flex items-center gap-7 pt-2">
            {SOCIALS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-[#f0f0f0]/25 hover:text-[#e63946] transition-all duration-300 hover:-translate-y-0.5"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Intro video link */}
          <a
            href="https://youtu.be/HAOkVh_K5Kk"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item inline-flex items-center gap-3 text-[0.65rem] tracking-[0.25em] uppercase text-[#f0f0f0]/30 hover:text-[#e63946] transition-colors duration-300 group mt-2"
          >
            <span className="w-8 h-px bg-current" />
            Watch my intro
            <span className="w-8 h-px bg-current" />
          </a>
        </div>
      </div>
    </section>
  );
}
