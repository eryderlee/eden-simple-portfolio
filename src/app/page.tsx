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
        {/* Vignette: gentler falloff so About doesn't get too dark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 25%, transparent 0%, transparent 40%, rgba(0,0,0,0.35) 100%)',
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
