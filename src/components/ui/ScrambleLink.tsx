'use client';
import { useRef, useCallback, useEffect } from 'react';

const CHARS = 'ABCDEFGHJKLNOPQRSTUXYZ';
const DURATION = 320;

function scrambleTick(
  text: string,
  el: HTMLElement,
  elapsed: number,
  duration: number,
): string {
  const chars = text.split('');
  // All chars scramble for the first 35% of duration,
  // then lock left-to-right over the remaining 65%.
  const lockStart = duration * 0.35;
  return chars
    .map((ch, i) => {
      if (ch === ' ') return ' ';
      const lockAt = lockStart + (i / Math.max(chars.length - 1, 1)) * (duration - lockStart);
      return elapsed >= lockAt ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join('');
}

/** Hook: apply scramble-on-hover to any text element. Returns ref + event handlers. */
export function useScrambleHover(text: string, duration = DURATION) {
  const spanRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const onMouseEnter = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    function tick(now: number) {
      const el = spanRef.current;
      if (!el) return;
      const elapsed = now - t0;
      el.textContent = scrambleTick(text, el, elapsed, duration);
      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.textContent = text;
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  const onMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (spanRef.current) spanRef.current.textContent = text;
  }, [text]);

  return {
    spanRef: spanRef as React.RefObject<HTMLSpanElement>,
    onMouseEnter,
    onMouseLeave,
  };
}

/** Component: full <a> link where the entire label scrambles on hover. */
interface ScrambleLinkProps {
  text: string;
  href: string;
  className?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export default function ScrambleLink({
  text,
  href,
  className,
  onClick,
  target,
  rel,
}: ScrambleLinkProps) {
  const { spanRef, onMouseEnter, onMouseLeave } = useScrambleHover(text);

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      target={target}
      rel={rel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span ref={spanRef}>{text}</span>
    </a>
  );
}
