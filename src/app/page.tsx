import Hero from '@/components/sections/Hero';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';

const PLACEHOLDER_SECTIONS = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'projects', label: 'Projects', num: '02' },
  { id: 'experience', label: 'Experience', num: '04' },
];

export default function Home() {
  return (
    <main>
      <Hero />

      {PLACEHOLDER_SECTIONS.map(({ id, label, num }) => (
        <section
          key={id}
          id={id}
          className="min-h-screen flex items-center justify-center border-t border-white/[0.04]"
        >
          <div className="w-full max-w-6xl mx-auto px-6 md:px-8 flex flex-col items-center justify-center gap-4 py-32">
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[#f0f0f0]/20 font-sans">
              {num} — Coming soon
            </span>
            <h2 className="font-display font-black text-[clamp(4rem,12vw,12rem)] leading-none tracking-tight text-[#f0f0f0]/[0.06] uppercase select-none">
              {label}
            </h2>
          </div>
        </section>
      ))}

      <Skills />
      <Contact />

      <footer className="border-t border-white/[0.04] py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex justify-center">
          <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-[#f0f0f0]/15 select-none">
            &copy; 2026 Eden Ryder Lee
          </p>
        </div>
      </footer>
    </main>
  );
}
