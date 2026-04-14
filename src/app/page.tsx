import Hero from '@/components/sections/Hero';

const PLACEHOLDER_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function Home() {
  return (
    <main>
      <Hero />

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
