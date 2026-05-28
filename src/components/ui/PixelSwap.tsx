'use client';

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

type Props = {
  /** When this flips true, the two-phase pixel transition fires. */
  playing: boolean;
  cols?: number;
  rows?: number;
  /** Seconds spent staggering pixels in. */
  appearDur?: number;
  /** Seconds the screen is fully covered (good time to swap content). */
  holdDur?: number;
  /** Seconds spent staggering pixels out. */
  disappearDur?: number;
  color?: string;
  /** Fires once when pixels are fully covering (midpoint of the transition). */
  onMidpoint?: () => void;
  /** Fires when the transition finishes (pixels fully gone). */
  onDone?: () => void;
  zIndex?: number;
};

export default function PixelSwap({
  playing,
  cols = 14,
  rows = 9,
  appearDur = 0.35,
  holdDur = 0.15,
  disappearDur = 0.4,
  color = '#e63946',
  onMidpoint,
  onDone,
  zIndex = 30,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const midpointRef = useRef(onMidpoint);
  const doneRef = useRef(onDone);
  midpointRef.current = onMidpoint;
  doneRef.current = onDone;

  const pixels = useMemo(() => {
    const arr: { left: number; top: number; w: number; h: number; key: string }[] = [];
    const w = 100 / cols;
    const h = 100 / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({ left: c * w, top: r * h, w, h, key: `${r}-${c}` });
      }
    }
    return arr;
  }, [cols, rows]);

  useEffect(() => {
    if (!playing || !overlayRef.current) return;
    const overlay = overlayRef.current;
    const pxEls = Array.from(overlay.querySelectorAll<HTMLDivElement>('.pxs-px'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      midpointRef.current?.();
      doneRef.current?.();
      return;
    }

    gsap.set(pxEls, { autoAlpha: 0 });

    // Phase 1: appear (random stagger to visible)
    gsap.to(pxEls, {
      autoAlpha: 1,
      duration: 0.001,
      stagger: { each: appearDur / pxEls.length, from: 'random' },
    });

    // Midpoint callback — fully covered, safe time to swap underlying content
    const midpointCall = gsap.delayedCall(appearDur, () => midpointRef.current?.());

    // Phase 2: disappear (random stagger to hidden)
    gsap.to(pxEls, {
      autoAlpha: 0,
      duration: 0.001,
      delay: appearDur + holdDur,
      stagger: { each: disappearDur / pxEls.length, from: 'random' },
      onComplete: () => doneRef.current?.(),
    });

    return () => {
      gsap.killTweensOf(pxEls);
      midpointCall.kill();
    };
  }, [playing, appearDur, holdDur, disappearDur]);

  if (!playing) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex }}
    >
      {pixels.map((p) => (
        <div
          key={p.key}
          className="pxs-px absolute"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.w}%`,
            height: `${p.h}%`,
            background: color,
            opacity: 0,
            visibility: 'hidden',
          }}
        />
      ))}
    </div>
  );
}
