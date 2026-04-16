'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/edenryderlee',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/eryderlee',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/eryderlee',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.546-1.405 0-2.543-1.14-2.545-2.546V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtu.be/HAOkVh_K5Kk',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
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

      gsap.fromTo('.contact-heading',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.contact-heading',
            start: 'top 80%',
          },
        }
      );

      gsap.from('.contact-email', {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-email',
          start: 'top 90%',
        },
      });

      gsap.fromTo(
        '.contact-social-btn',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.contact-socials',
            start: 'top 95%',
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
      id="contact"
      className="section-grain relative bg-black border-t border-white/[0.04] pt-24 pb-16 md:pt-36 md:pb-15 px-5"
    >

      {/* Left accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#e63946]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 w-full" style={{ marginLeft: 'auto', marginRight: 'auto' }}>

          {/* Heading — full width, above content */}
          <div className="contact-label flex items-center gap-4 mb-6">
            <div className="h-px w-8 bg-[#e63946]" />
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/30 font-sans">
              Contact
            </span>
          </div>
          <h2 className="contact-heading font-display font-black text-[clamp(2rem,5vw,5rem)] leading-[0.88] tracking-[-0.03em] text-[#f0f0f0] mb-16 opacity-0">
            Let&apos;s build<br />
            <span className="text-[#e63946]">something.</span>
          </h2>

          {/* Content */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-20">

                {/* Left: description + email */}
                <div className="space-y-10">
                  <p className="font-sans text-[0.92rem] leading-relaxed text-[#f0f0f0]/50 max-w-[44ch]">
                    Open to freelance projects, full-time roles, and interesting
                    collaborations. Based in Point Cook, VIC — available remotely
                    worldwide.
                  </p>

                  {/* Email display link */}
                  <a
                    href="mailto:eden@ryderlee.me"
                    className="contact-email group block"
                  >
                    <span className="text-[0.6rem] tracking-[0.28em] uppercase text-[#f0f0f0]/25 font-sans block mb-2">
                      Email
                    </span>
                    <span className="font-display font-bold text-[clamp(1.1rem,2.5vw,1.65rem)] text-[#f0f0f0]/80 group-hover:text-[#e63946] transition-colors duration-300 relative">
                      eden@ryderlee.me
                      <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#e63946] group-hover:w-full transition-all duration-400" />
                    </span>
                  </a>

                  {/* CTA email button — red outlined, hover fills */}
                  <div className="flex justify-center md:justify-start mt-8">
                    <a
                      href="mailto:eden@ryderlee.me"
                      className="inline-flex items-center gap-2.5 group px-6 py-3 border border-[#e63946] text-[#e63946] hover:bg-[#e63946] hover:text-white transition-all duration-300"
                    >
                      <svg
                        width="13"
                        height="10"
                        viewBox="0 0 13 10"
                        fill="none"
                        aria-hidden="true"
                        className="transition-colors duration-300"
                      >
                        <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h10A1.5 1.5 0 0 1 13 1.5v7A1.5 1.5 0 0 1 11.5 10h-10A1.5 1.5 0 0 1 0 8.5v-7zm1.5 0L6.5 5l5-3.5M1.5 8.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="font-sans text-[0.73rem] tracking-[0.12em] uppercase font-medium transition-colors duration-300">
                        Send me an email
                      </span>
                    </a>
                  </div>
                </div>

                {/* Right: socials */}
                <div>
                  <span className="text-[0.6rem] tracking-[0.28em] uppercase text-[#f0f0f0]/25 font-sans block mb-5">
                    Socials
                  </span>
                  <div className="contact-socials grid grid-cols-2 gap-3">
                    {SOCIALS.map(({ label, href, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ opacity: 1 }}
                        className="contact-social-btn group flex flex-col items-center justify-center gap-3 py-7 border border-white/[0.07] hover:border-[#e63946]/60 hover:bg-[#e63946]/[0.05] transition-all duration-300"
                      >
                        <span className="text-[#f0f0f0]/35 group-hover:text-[#e63946] transition-colors duration-300">
                          {icon}
                        </span>
                        <span className="text-[0.62rem] tracking-[0.18em] uppercase font-sans text-[#f0f0f0]/30 group-hover:text-[#f0f0f0]/60 transition-colors duration-300">
                          {label}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>

              {/* Divider */}
              <div className="mt-20 flex items-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-[#e63946]/30 to-transparent" />
                <span className="font-display font-black text-[0.65rem] tracking-[0.4em] uppercase text-[#e63946]/25 select-none">
                  ERL
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-[#e63946]/30 to-transparent" />
              </div>

              {/* Location strip */}
              <div className="mt-6 flex justify-center">
                <span className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-[#f0f0f0]/15">
                  Point Cook, VIC · Australia · Available Remotely
                </span>
              </div>

            </div>
        </div>
    </section>
  );
}
