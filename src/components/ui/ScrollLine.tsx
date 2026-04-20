'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Two wide sweeps ending precisely at the CTA button's centre.
// endX lets the path land at the button's horizontal position rather than
// always at viewport centre.
function buildPath(cx: number, endY: number, amp: number, endX: number): string {
  const cp1x = cx - amp * 0.26;
  const cp2x = cx - amp;
  const mid   = endY * 0.50;
  const peak2 = endY * 0.75;
  // S control point: swing right before landing on the button (left of centre)
  const scp1x = cx + amp * 0.5;
  return (
    `M ${cx} 0 ` +
    `C ${cp1x} ${endY * 0.13}, ${cp2x} ${endY * 0.30}, ${cx} ${mid} ` +
    `S ${scp1x} ${peak2}, ${endX} ${endY}`
  );
}

export default function ScrollLine() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const svg     = svgRef.current;
    const path    = pathRef.current;
    if (!wrapper || !svg || !path) return;

    let st: ScrollTrigger | null = null;
    let prevProgress = 0;

    const setup = () => {
      st?.kill();
      prevProgress = 0;

      const cta = document.getElementById('contact-cta');
      if (!cta) return;

      const wRect = wrapper.getBoundingClientRect();
      const cRect = cta.getBoundingClientRect();
      const svgW  = wRect.width;

      // endY = vertical distance from wrapper top to top border of the CTA button
      const endY =
        (cRect.top + window.scrollY) -
        (wRect.top + window.scrollY);

      svg.setAttribute('width', String(svgW));
      svg.style.height = `${endY}px`;

      // 40 % of viewport width each side — matches reference
      const amp  = svgW * 0.40;
      const cx   = svgW * 0.5;
      // Horizontal centre of the CTA button in SVG coordinates
      const endX = cRect.left + cRect.width / 2 - wRect.left;


      path.setAttribute('d', buildPath(cx, endY, amp, endX));

      const totalLen = path.getTotalLength();
      path.style.strokeDasharray  = String(totalLen);
      path.style.strokeDashoffset = String(totalLen);

      st = ScrollTrigger.create({
        trigger: wrapper,
        start:   'top 80%',
        end:     `top+=${endY} 80%`,
        scrub:   1.2,
        onUpdate(self) {
          path.style.strokeDashoffset = String(totalLen * (1 - self.progress));
          if (prevProgress < 0.98 && self.progress >= 0.98) {
            document.dispatchEvent(new CustomEvent('cta-line-reached'));
          } else if (prevProgress >= 0.95 && self.progress < 0.95) {
            document.dispatchEvent(new CustomEvent('cta-line-left'));
          }
          prevProgress = self.progress;
        },
      });
    };

    const raf = requestAnimationFrame(setup);
    window.addEventListener('resize', setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setup);
      st?.kill();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 pointer-events-none opacity-50 md:opacity-100"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        fill="none"
      >
        <path
          ref={pathRef}
          stroke="rgba(230,57,70,0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
