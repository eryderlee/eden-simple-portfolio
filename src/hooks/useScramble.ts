'use client';
import { useEffect, useRef } from 'react';

// Separate sets per case to match the visual width of the final character
const UPPER = 'ABCDEFGHJKLNOPQRSTUXYZ'; // omit I, M, V, W (extreme widths)
const LOWER = 'abcdefghklnopqrstuxyz';  // omit i, j, m, w (extreme widths)
const DIGIT = '2345678990';             // omit 1 (narrow in most display fonts)
const FADE_MS = 160;

export type ScrambleSegment = { text: string; red?: boolean };

export interface ScrambleOptions {
  segments: ScrambleSegment[];
  trigger?: 'mount' | 'visible';
  delay?: number;
  duration?: number;
  onComplete?: () => void;
}

function escapeHTML(ch: string): string {
  if (ch === '&') return '&amp;';
  if (ch === '<') return '&lt;';
  if (ch === '>') return '&gt;';
  return ch;
}

// Pick a random char that matches the visual width class of the final character
function randomLike(finalCh: string): string {
  if (/[A-Z]/.test(finalCh)) return UPPER[Math.floor(Math.random() * UPPER.length)];
  if (/[a-z]/.test(finalCh)) return LOWER[Math.floor(Math.random() * LOWER.length)];
  if (/[0-9]/.test(finalCh)) return DIGIT[Math.floor(Math.random() * DIGIT.length)];
  return finalCh; // punctuation/symbols keep their own width
}

export function useScramble<T extends HTMLElement = HTMLElement>({
  segments,
  trigger = 'visible',
  delay = 0,
  duration = 500,
  onComplete,
}: ScrambleOptions) {
  const ref = useRef<T>(null);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const realHTML = el.innerHTML.trim();
    if (!realHTML) return;

    const chars: Array<{ final: string; red: boolean; br: boolean; space: boolean }> = [];
    for (const seg of segments) {
      for (const ch of seg.text) {
        chars.push({ final: ch, red: seg.red ?? false, br: ch === '\n', space: ch === ' ' });
      }
    }

    function buildOverlay(scramble: boolean): string {
      let html = '';
      for (const char of chars) {
        if (char.br) { html += '<br>'; continue; }
        if (char.space) {
          html += char.red ? `<span style="color:#e63946">\u00a0</span>` : '\u00a0';
          continue;
        }
        const display = scramble
          ? escapeHTML(randomLike(char.final))
          : escapeHTML(char.final);
        html += char.red ? `<span style="color:#e63946">${display}</span>` : display;
      }
      return html;
    }

    // Real content hidden (holds layout), overlay visible on top
    el.style.position = 'relative';
    el.innerHTML = `<span style="visibility:hidden;display:block;" aria-hidden="true">${realHTML}</span>`;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;';
    overlay.innerHTML = buildOverlay(true);
    el.appendChild(overlay);

    // The hidden span (layout holder)
    const hiddenSpan = el.firstChild as HTMLElement;

    let started = false;
    function start() {
      if (started) return;
      started = true;
      const t0 = performance.now() + delay;

      function tick(now: number) {
        const elapsed = Math.max(0, now - t0);
        if (elapsed < duration) {
          overlay.innerHTML = buildOverlay(true);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // Show the final scrambled state one last frame, then crossfade
          overlay.innerHTML = buildOverlay(false);
          // Reveal real text underneath, fade overlay out
          hiddenSpan.style.visibility = 'visible';
          overlay.style.transition = `opacity ${FADE_MS}ms ease`;
          overlay.style.opacity = '0';
          timeoutRef.current = setTimeout(() => {
            if (!ref.current) return;
            ref.current.style.position = '';
            ref.current.innerHTML = realHTML;
            onComplete?.();
          }, FADE_MS);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    if (trigger === 'mount') {
      start();
    } else {
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect(); } },
        { threshold: 0.2 },
      );
      observer.observe(el);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(rafRef.current);
        clearTimeout(timeoutRef.current);
      };
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
