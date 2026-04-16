import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';
import AsciiBackground from '@/components/ui/AsciiBackground';

export default function Home() {
  return (
    <main>
      {/* Single ASCII instance spans Hero + About seamlessly, fades before ticker */}
      <div className="relative">
        <AsciiBackground opacity={0.24} maskBottom="130px" />

        {/* Dramatic lighting — spans Hero + About as one continuous effect */}
        {/* Vignette: darkness only at the very edges, large transparent center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse 90% 70% at 50% 25%, transparent 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />
        {/* Spotlight: large soft white/warm glow centered on the Hero name area */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 65%)',
          }}
        />

        <Hero />
        <About />
      </div>
      <Projects />
      <Experience />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
