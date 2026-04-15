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
        <AsciiBackground opacity={0.24} maskBottom="100px" />
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
