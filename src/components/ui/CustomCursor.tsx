'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const CHARS = 'ABCDEFGHJKLNOPQRSTUXYZ';
const SCRAMBLE_DURATION = 500;
const LABEL_LERP = 0.08; // how much the label lags (lower = more lag)

function scrambleText(text: string, elapsed: number): string {
  if (!text) return '';
  const lockStart = SCRAMBLE_DURATION * 0.35;
  return text
    .split('')
    .map((ch, i) => {
      if (ch === ' ') return ' ';
      const lockAt = lockStart + (i / Math.max(text.length - 1, 1)) * (SCRAMBLE_DURATION - lockStart);
      return elapsed >= lockAt ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join('');
}

type CursorLabel = ':)' | 'HELLO' | 'SCROLL' | 'VISIT' | 'OPEN' | 'READ' | 'VIEW' | 'CLOSE' | 'PLAY';

function getLabelFromElement(el: Element | null): CursorLabel {
  if (!el) return ':)';
  const target = el.closest('a, button, video, iframe, [data-cursor]') as HTMLElement | null;
  if (!target) return ':)';
  const attr = target.getAttribute('data-cursor') as CursorLabel | null;
  if (attr) return attr;
  if (target.tagName === 'A') return 'VISIT';
  if (target.tagName === 'BUTTON') return 'OPEN';
  if (target.tagName === 'VIDEO' || target.tagName === 'IFRAME') return 'PLAY';
  return ':)';
}

export default function CustomCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [labelPos, setLabelPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [displayLabel, setDisplayLabel] = useState('HELLO');
  const [clicked, setClicked] = useState(false);

  const labelPosRef = useRef({ x: -200, y: -200 });
  const cursorPosRef = useRef({ x: -200, y: -200 });
  const labelRef = useRef<CursorLabel>('HELLO');
  const helloPhaseRef = useRef(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const scrambleRafRef = useRef<number>(0);
  const lerpRafRef = useRef<number>(0);

  const animateTo = useCallback((newLabel: string) => {
    cancelAnimationFrame(scrambleRafRef.current);
    if (!newLabel) {
      setDisplayLabel('');
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      setDisplayLabel(scrambleText(newLabel, elapsed));
      if (elapsed < SCRAMBLE_DURATION) {
        scrambleRafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayLabel(newLabel);
      }
    };
    scrambleRafRef.current = requestAnimationFrame(tick);
  }, []);

  const setLabel = useCallback((next: CursorLabel) => {
    if (next === labelRef.current) return;
    labelRef.current = next;
    animateTo(next);
  }, [animateTo]);

  // Lerp loop for label position
  useEffect(() => {
    const loop = () => {
      labelPosRef.current = {
        x: labelPosRef.current.x + (cursorPosRef.current.x - labelPosRef.current.x) * LABEL_LERP,
        y: labelPosRef.current.y + (cursorPosRef.current.y - labelPosRef.current.y) * LABEL_LERP,
      };
      setLabelPos({ ...labelPosRef.current });
      lerpRafRef.current = requestAnimationFrame(loop);
    };
    lerpRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(lerpRafRef.current);
  }, []);

  // HELLO intro
  useEffect(() => {
    animateTo('HELLO');
    const t = setTimeout(() => {
      helloPhaseRef.current = false;
      setLabel(':)');
    }, 5000);
    return () => clearTimeout(t);
  }, [animateTo, setLabel]);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const resetIdleTimer = () => {
      clearTimeout(idleTimerRef.current);
      if (labelRef.current === 'SCROLL') setLabel(':)');
      idleTimerRef.current = setTimeout(() => {
        if (!helloPhaseRef.current) setLabel('SCROLL');
      }, 2500);
    };

    const updateLabelFromCurrentPos = () => {
      if (helloPhaseRef.current) return;
      const { x, y } = cursorPosRef.current;
      const el = document.elementFromPoint(x, y);
      const next = getLabelFromElement(el);
      setLabel(next);
    };

    const onMove = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      updateLabelFromCurrentPos();
    };

    const onScroll = () => {
      if (!helloPhaseRef.current) {
        resetIdleTimer();
        updateLabelFromCurrentPos();
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const prevLabelRef = { current: ':)' as CursorLabel };
    const onDown = () => {
      setClicked(true);
      prevLabelRef.current = labelRef.current;
      labelRef.current = ':0' as CursorLabel;
      cancelAnimationFrame(scrambleRafRef.current);
      setDisplayLabel(':0');
    };
    const onUp = () => {
      setClicked(false);
      labelRef.current = prevLabelRef.current;
      cancelAnimationFrame(scrambleRafRef.current);
      setDisplayLabel(prevLabelRef.current);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      clearTimeout(idleTimerRef.current);
      cancelAnimationFrame(scrambleRafRef.current);
    };
  }, [setLabel]);

  return (
    <>
      {/* Crosshair — snaps to cursor */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: clicked ? 'scale(0.6)' : 'scale(1)',
          transition: 'opacity 300ms, transform 120ms ease-out',
        }}
        aria-hidden="true"
      >
        <div className="absolute" style={{ width: 20, height: 20, left: -10, top: -10 }}>
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2" style={{ height: 1, background: '#e63946' }} />
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: 1, background: '#e63946' }} />
        </div>
      </div>

      {/* Label — lags behind, positioned upper-right */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ left: labelPos.x, top: labelPos.y }}
        aria-hidden="true"
      >
        <span
          className="absolute font-mono text-[0.7rem] tracking-[0.2em] text-[#f0f0f0] whitespace-nowrap"
          style={{ left: 10, top: -20, textShadow: '0 0 4px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
        >
          {displayLabel}
        </span>
      </div>
    </>
  );
}
