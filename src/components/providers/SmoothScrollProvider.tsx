'use client';

import { useEffect, useRef } from 'react';
import type Lenis from 'lenis';
import { gsap } from 'gsap';

type Cleanup = () => void;

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let cleanup: Cleanup | null = null;
    let cancelled = false;

    const init = async () => {
      const { default: LenisCtor } = await import('lenis');
      if (cancelled) return;

      const lenis = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      function onTick(time: number) {
        lenis.raf(time * 1000);
      }

      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
        lenisRef.current = null;
      };
    };

    const schedule = () => {
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      };
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(() => init(), { timeout: 1000 });
      } else {
        setTimeout(init, 200);
      }
    };

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', schedule);
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
