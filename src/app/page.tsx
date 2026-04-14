import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';

const PLACEHOLDER_SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />

      {PLACEHOLDER_SECTIONS.map(({ id, label }) => (
        <section
          key={id}
          id={id}
          className="min-h-screen flex items-center justify-center border-t border-white/[0.04]"
        >
          <h2 className="font-display font-black text-[clamp(4rem,12vw,12rem)] leading-none tracking-tight text-[#f0f0f0]/[0.06] uppercase select-none">
            {label}
          </h2>
        </section>
      ))}
    </main>
  );
}
