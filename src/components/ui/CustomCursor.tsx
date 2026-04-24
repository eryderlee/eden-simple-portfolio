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

type CursorLabel = ':)' | 'HELLO' | 'SCROLL' | 'VISIT' | 'OPEN' | 'READ' | 'VIEW' | 'CLOSE' | 'PLAY' | 'CONTACT ME!' | 'GO THIS WAY!';

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
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [labelPos, setLabelPos] = useState({ x: -200, y: -200 });
  const [visible, setVisible] = useState(false);
  const [displayLabel, setDisplayLabel] = useState('HELLO');
  const [clicked, setClicked] = useState(false);
  const [inContact, setInContact] = useState(false);
  const [arrowAngle, setArrowAngle] = useState(0);

  useEffect(() => {
    setIsPointerFine(window.matchMedia('(pointer: fine)').matches);
  }, []);

  const labelPosRef = useRef({ x: -200, y: -200 });
  const cursorPosRef = useRef({ x: -200, y: -200 });
  const labelRef = useRef<CursorLabel>('HELLO');
  const helloPhaseRef = useRef(true);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrambleRafRef = useRef<number>(0);
  const lerpRafRef = useRef<number>(0);
  const inContactRef = useRef(false);

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

  // Lerp loop for label position — pauses when tab is hidden
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

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(lerpRafRef.current);
      } else {
        lerpRafRef.current = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(lerpRafRef.current);
      document.removeEventListener('visibilitychange', onVis);
    };
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
    if (!isPointerFine) return;

    // true while the sticky idle label (SCROLL / GO THIS WAY!) is showing
    const stickyRef = { current: false };

    const computeArrowAngle = (clientX: number, clientY: number) => {
      const ctaEl = document.getElementById('contact-cta');
      if (!ctaEl) return;
      const rect = ctaEl.getBoundingClientRect();
      const dx = (rect.left + rect.width / 2) - clientX;
      const dy = (rect.top + rect.height / 2) - clientY;
      setArrowAngle(Math.atan2(dy, dx) * (180 / Math.PI));
    };

    const resetIdleTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!helloPhaseRef.current) {
          stickyRef.current = true;
          setLabel(inContactRef.current ? 'GO THIS WAY!' : 'SCROLL');
        }
      }, 2500);
    };

    const updateLabelFromCurrentPos = () => {
      if (helloPhaseRef.current) return;
      const { x, y } = cursorPosRef.current;
      const el = document.elementFromPoint(x, y);
      let next = getLabelFromElement(el);
      if (inContactRef.current && next !== 'CONTACT ME!') {
        next = 'GO THIS WAY!';
      }

      if (stickyRef.current) {
        // Interactive element → exit sticky and show its label
        const interactive = next !== ':)' && next !== 'GO THIS WAY!';
        if (interactive) {
          stickyRef.current = false;
          setLabel(next);
        } else {
          // Stay sticky but allow switching between SCROLL ↔ GO THIS WAY!
          setLabel(inContactRef.current ? 'GO THIS WAY!' : 'SCROLL');
        }
        return;
      }

      setLabel(next);
    };

    const onMove = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
      setVisible(true);

      // Track whether cursor is inside the #contact section
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        const nowIn = e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (nowIn !== inContactRef.current) {
          inContactRef.current = nowIn;
          setInContact(nowIn);
        }
        if (nowIn) computeArrowAngle(e.clientX, e.clientY);
      }

      const wasStickyBefore = stickyRef.current;
      updateLabelFromCurrentPos();
      // Restart idle timer only when not sticky, or when sticky just ended
      if (!stickyRef.current) resetIdleTimer();
      else if (wasStickyBefore) { /* still sticky — leave timer alone */ }
    };

    const onScroll = () => {
      if (!helloPhaseRef.current) {
        if (stickyRef.current) {
          stickyRef.current = false;
          setLabel(':)');
        }
        resetIdleTimer();
        updateLabelFromCurrentPos();
        if (inContactRef.current) {
          computeArrowAngle(cursorPosRef.current.x, cursorPosRef.current.y);
        }
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
  }, [setLabel, isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <>
      {/* Crosshair / Arrow — snaps to cursor */}
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
        {inContact ? (
          /* Arrow pointing toward CTA */
          <div
            className="absolute"
            style={{
              width: 22,
              height: 22,
              left: -11,
              top: -11,
              transform: `rotate(${arrowAngle}deg)`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 11H19M19 11L13 5M19 11L13 17"
                stroke="#e63946"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          /* Default crosshair */
          <div className="absolute" style={{ width: 20, height: 20, left: -10, top: -10 }}>
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2" style={{ height: 1, background: '#e63946' }} />
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: 1, background: '#e63946' }} />
          </div>
        )}
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
