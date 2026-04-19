'use client';

import { useEffect, useState } from 'react';
import ScrambleLink from '@/components/ui/ScrambleLink';

const NAV_LINKS = ['About', 'Projects', 'Skills', 'Experience', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#111111]/90 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <nav className="w-full px-8 py-5 grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Col 1: Logo — left-aligned */}
        <ScrambleLink
          text="Eden"
          href="#"
          className="font-display text-xl font-black tracking-[0.25em] text-[#f0f0f0] hover:text-[#e63946] transition-colors duration-300 uppercase"
        />

        {/* Col 2: Desktop links — naturally centered */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <ScrambleLink
                text={link}
                href={`#${link.toLowerCase()}`}
                className="relative text-[0.7rem] tracking-[0.2em] uppercase text-[#f0f0f0]/50 hover:text-[#e63946] transition-colors duration-250 group"
              />
            </li>
          ))}
        </ul>

        {/* Col 3: Right placeholder — mobile hamburger only */}
        <div className="flex justify-end col-start-3">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 p-0.5 [transform:scaleX(-1)]"
          >
            <span
              className={`block h-px bg-[#f0f0f0] transition-all duration-300 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-[6px]' : 'w-full'
              }`}
            />
            <span
              className={`block h-px bg-[#f0f0f0] transition-all duration-300 ${
                mobileOpen ? 'opacity-0 w-0' : 'w-2/3'
              }`}
            />
            <span
              className={`block h-px bg-[#f0f0f0] transition-all duration-300 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-[6px]' : 'w-full'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="bg-[#111111]/95 backdrop-blur-md border-t border-white/[0.06] px-8 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <ScrambleLink
                text={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="block text-[0.7rem] tracking-[0.2em] uppercase text-[#f0f0f0]/50 hover:text-[#e63946] transition-colors duration-250"
              />
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
