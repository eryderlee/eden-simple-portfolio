'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  opacity?: number;
  /**
   * Height of the bottom fade overlay as a CSS length (e.g. "120px").
   * A black gradient is layered over the ASCII at the bottom of the host,
   * transparent at the top of the ramp → solid black at the very bottom.
   * Using an overlay (rather than a mask) avoids iOS Safari's spotty
   * mask-composite behaviour.
   */
  maskBottom?: string;
}

export default function AsciiBackground({ opacity = 0.18, maskBottom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  /* Double-rAF: guarantees the initial opacity:0 frame paints before we
     flip the state, so the CSS transition reliably fires regardless of
     hydration timing. */
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setRevealed(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    // Respect reduced-motion: render one static frame, keep DOM stable so
    // the fade-in overlay logic above still works.
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // ── Config ────────────────────────────────────────────────────────────
    const CFG = {
      frequency:       11,
      contrast:        0.35,
      edgeWidth:       0.04,
      gapLevel:        0.3,
      angleDeg:        0,
      driftX:          0,
      driftY:          -0.018,
      warpAmp:         0.42,
      warpScale:       1.4,
      warpSpeed:       0.001,
      bandJitter:      { enabled: true, amp: 0.2, scale: 0.85, speed: 0.05 },
      randomSet:       Array.from(' .,:;*+![]{}<>-~=/\\'),
      lineSet:         Array.from('    EDEN RYDER LEE    '),
      gapSet:          Array.from('@'),
      randomChangeHz:  1.5,
      lineThreshold:   0,
      gapThreshold:    1,
      gapFan:          { enabled: true, strength: 0.5 },
      gapClouds:       { enabled: true, density: 0.08, scale: 1.6, speed: 0.03, octaves: 3, hardness: 0.85 },
      erase:           { enabled: true, radiusCells: 12, durationSec: 0.9, jitter: 0.35, hardness: 0.6 },
      fpsCap:          30,
    };

    const FONT_SIZE   = 13;
    const LINE_HEIGHT = 1.15;
    const FONT        = `${FONT_SIZE}px "Courier New", Courier, monospace`;

    // ── Create <canvas> ───────────────────────────────────────────────────
    // Previously this rendered into a <pre> via textContent — which forced
    // the browser to re-layout + repaint ~40k glyphs of DOM text at 30fps,
    // the single biggest cost on the page. Canvas fillText (one call per
    // row) produces the same glyph output with zero DOM layout.
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
    });
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return () => {
        if (host.contains(canvas)) host.removeChild(canvas);
      };
    }

    // ── Perlin noise setup ────────────────────────────────────────────────
    const G: { x: number; y: number }[] = [];
    for (let i = 0; i < 256; i++) {
      const a = (i / 256) * Math.PI * 2;
      G[i] = { x: Math.cos(a), y: Math.sin(a) };
    }
    const P = new Uint8Array(512);
    {
      let seed = 1234567;
      const rnd = () => ((seed = ((seed * 1664525 + 1013904223) >>> 0)) / 0xffffffff);
      const base = new Uint8Array(256);
      for (let i = 0; i < 256; i++) base[i] = i;
      for (let i = 255; i > 0; i--) {
        const j = (rnd() * (i + 1)) | 0;
        const tmp = base[i]; base[i] = base[j]; base[j] = tmp;
      }
      for (let i = 0; i < 512; i++) P[i] = base[i & 255];
    }

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

    function grad(ix: number, iy: number, x: number, y: number) {
      const g = G[P[(ix & 255) + P[iy & 255]]];
      return g.x * (x - ix) + g.y * (y - iy);
    }

    function perlin(x: number, y: number) {
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const x1 = x0 + 1, y1 = y0 + 1;
      const sx = fade(x - x0), sy = fade(y - y0);
      const n00 = grad(x0, y0, x, y), n10 = grad(x1, y0, x, y);
      const n01 = grad(x0, y1, x, y), n11 = grad(x1, y1, x, y);
      return (n00 + sx * (n10 - n00)) + sy * ((n01 + sx * (n11 - n01)) - (n00 + sx * (n10 - n00)));
    }

    function fbm(x: number, y: number, oct = 3, gain = 0.5, lac = 2) {
      let v = 0, amp = 1, f = 1, norm = 0;
      for (let i = 0; i < oct; i++) {
        v += amp * perlin(x * f, y * f);
        norm += amp; amp *= gain; f *= lac;
      }
      return v / (norm || 1);
    }

    function hash32(n: number) {
      n = (n >>> 0) + 0x9e3779b9;
      n ^= n >>> 16; n = Math.imul(n, 0x85ebca6b);
      n ^= n >>> 13; n = Math.imul(n, 0xc2b2ae35);
      n ^= n >>> 16; return n >>> 0;
    }

    function hash3(x: number, y: number, z: number) {
      let h = 2166136261;
      h ^= x | 0; h = Math.imul(h, 16777619);
      h ^= y | 0; h = Math.imul(h, 16777619);
      h ^= z | 0; h = Math.imul(h, 16777619);
      return h >>> 0;
    }

    const pickFrom = (arr: string[], h: number) => arr[h % arr.length];

    // ── Grid state ────────────────────────────────────────────────────────
    let cols = 0, rows = 0, sShort = 1;
    let cellW = 8, cellH = FONT_SIZE * LINE_HEIGHT;
    let cssW = 0, cssH = 0;
    let eraseBuf = new Float32Array(1);
    // Cached noise-field result per cell: 0 = random shimmer, 1 = line char,
    // 2 = gap char, 3 = blank (gap cloud). Chars for kinds 1/2 are stored in
    // fieldChar. The field drifts extremely slowly (warpSpeed 0.001, drift
    // 0.018 rows/s), so it's re-sampled at FIELD_INTERVAL instead of every
    // frame — that's where all the expensive fbm/perlin calls live.
    //
    // Double-buffered + incrementally scanned: a full-grid noise pass in one
    // frame is a ~20-40ms spike that visibly stutters anything animating at
    // the same time (the Hero entrance, scrolling). Instead each frame fills
    // a few rows of the back buffer within a small time budget and the
    // buffers swap when the scan completes — same work, constant cost.
    let kindBuf = new Uint8Array(1);   // front (displayed)
    let fieldChar: string[] = [];
    let kindBack = new Uint8Array(1);  // back (being filled)
    let charBack: string[] = [];
    let hasField = false;              // front buffer has valid data
    let scanY = -1;                    // -1 = no scan in progress
    let scanT = 0;                     // t captured at scan start (field coherence)
    let fieldDirty = true;
    const FIELD_INTERVAL = 0.125;      // min seconds between field scans
    const FIELD_BUDGET_MS = 3;         // per-frame time budget for field rows
    let lastFieldT = -Infinity;

    let loopStarted = false;

    function computeGrid() {
      if (!host || !ctx) return;
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      // No-op when the host hasn't actually changed size. Critical: setting
      // canvas.width (even to the same value) CLEARS the canvas, and this
      // runs from ResizeObserver + several delayed safety recomputes — each
      // needless clear left the canvas blank until the next 30fps tick,
      // which read as a flicker during page load.
      if (Math.abs(rect.width - cssW) < 0.5 && Math.abs(rect.height - cssH) < 0.5) return;
      cssW = rect.width;
      cssH = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      // Setting canvas.width resets all ctx state — restore it here.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT;
      ctx.textBaseline = 'top';
      cellW = ctx.measureText('M').width || 8;
      cellH = FONT_SIZE * LINE_HEIGHT;
      const c = Math.max(1, Math.floor(cssW / cellW - 0.15));
      const r = Math.max(1, Math.ceil(cssH / cellH) + 1);
      if (c !== cols || r !== rows) {
        cols = c; rows = r;
        sShort = Math.min(cols, rows);
        eraseBuf  = new Float32Array(cols * rows);
        kindBuf   = new Uint8Array(cols * rows);
        fieldChar = new Array(cols * rows).fill(' ');
        kindBack  = new Uint8Array(cols * rows);
        charBack  = new Array(cols * rows).fill(' ');
        hasField = false;
        scanY = -1; // abort any in-flight scan — buffer geometry changed
      }
      fieldDirty = true;
      // Repaint in the same task as the resize so the cleared canvas is
      // never shown blank while waiting for the next rAF tick.
      if (reduceMotion || loopStarted) drawStatic();
    }

    // ── Erase trail ───────────────────────────────────────────────────────
    function applyErase(cx: number, cy: number) {
      if (!CFG.erase.enabled) return;
      const R = CFG.erase.radiusCells | 0;
      const hard = Math.max(0, Math.min(1, CFG.erase.hardness));
      const jit  = Math.max(0, Math.min(1, CFG.erase.jitter));
      const dur  = CFG.erase.durationSec;
      const r2 = R * R;
      for (let y = Math.max(0, cy - R); y <= Math.min(rows - 1, cy + R); y++) {
        for (let x = Math.max(0, cx - R); x <= Math.min(cols - 1, cx + R); x++) {
          const dx = x - cx, dy = y - cy;
          if (dx * dx + dy * dy > r2) continue;
          const d = Math.sqrt(dx * dx + dy * dy) / R;
          const falloff = Math.pow(1 - d, hard * 3 + 0.01);
          const h = hash3(x * 131 + y * 911, y * 521 + x * 173, cx * 7 + cy * 13) % 1000 / 1000;
          const accept = h < falloff * (1 - jit) + (falloff > 0.5 ? jit * 0.6 : jit * 0.2);
          if (accept) {
            const idx = y * cols + x;
            eraseBuf[idx] = Math.max(eraseBuf[idx], dur * falloff);
          }
        }
      }
    }

    // Mousemove events fire far more often than frames render (100s/sec on
    // high-Hz mice), and each erase pass loops 25×25 cells — so coalesce to
    // the latest position and apply it once per rendered frame instead.
    let pendingErase = false;
    let pendingEraseX = 0;
    let pendingEraseY = 0;
    function onMouseMove(ev: MouseEvent) {
      pendingEraseX = ev.clientX;
      pendingEraseY = ev.clientY;
      pendingErase = true;
    }
    function flushErase() {
      if (!pendingErase) return;
      pendingErase = false;
      const rect = canvas.getBoundingClientRect();
      const cx = Math.max(0, Math.min(cols - 1, Math.floor((pendingEraseX - rect.left) / cellW)));
      const cy = Math.max(0, Math.min(rows - 1, Math.floor((pendingEraseY - rect.top)  / cellH)));
      applyErase(cx, cy);
    }
    // Listen on window so pointer-events:none doesn't block it
    if (!reduceMotion) window.addEventListener('mousemove', onMouseMove);

    // ── Gap clouds ────────────────────────────────────────────────────────
    function inGapCloud(u: number, v: number, t: number) {
      if (!CFG.gapClouds.enabled) return false;
      const c = CFG.gapClouds;
      const n = fbm(u * c.scale + t * c.speed + 11.3, v * c.scale - t * c.speed - 7.9, c.octaves, 0.55, 2);
      const hardened = Math.pow(Math.abs(n), c.hardness);
      const cellJit = (hash3(u * 9999 | 0, v * 9999 | 0, Math.floor(t)) % 997 / 997) * 0.02;
      return hardened + cellJit > 1 - c.density;
    }

    // ── Band sampling ─────────────────────────────────────────────────────
    function sampleBands(x: number, y: number, t: number, rowNorm: number) {
      const s = sShort || 1;
      const u = x / s - CFG.driftX * t;
      const v = y / s - CFG.driftY * t;
      const wt = t * CFG.warpSpeed;
      const wx = CFG.warpAmp * fbm(u * CFG.warpScale + 10.1 + wt, v * CFG.warpScale - 9.3 - wt, 3, 0.55, 2);
      const wy = CFG.warpAmp * fbm(u * CFG.warpScale - 30.9 - wt, v * CFG.warpScale + 19.7 + wt, 3, 0.8, 2);
      const ang = CFG.angleDeg * Math.PI / 180;
      const rx = (u + wx) * Math.cos(ang) + (v + wy) * Math.sin(ang);
      const bandWave = 0.5 + 0.5 * Math.sin(rx * Math.PI * 2 * (CFG.frequency / 2));
      const ink = Math.pow(bandWave, CFG.contrast);
      const gap = 1 - ink;
      let gLevel = CFG.gapLevel;
      if (CFG.gapFan.enabled) gLevel += (1 - rowNorm) * CFG.gapFan.strength;
      if (CFG.bandJitter.enabled) {
        const j = fbm(u * CFG.bandJitter.scale + 77.1, v * CFG.bandJitter.scale - 99.8, 3, 0.55, 2);
        gLevel += CFG.bandJitter.amp * (j - 0.5) * 2 + Math.sin(t * CFG.bandJitter.speed) * 0.02;
      }
      const aL = gLevel - CFG.edgeWidth;
      const bL = gLevel + CFG.edgeWidth;
      const tLine = Math.max(0, Math.min(1, 1 - (gap - aL) / (bL - aL)));
      const tGap  = Math.max(0, Math.min(1, (gap - aL) / (bL - aL)));
      const bandIndex = Math.floor(rx * CFG.frequency);
      return { u: u + wx, v: v + wy, bandIndex, tLine, tGap };
    }

    // Re-sample one row of the noise field into the BACK buffers — the
    // expensive part, amortized across frames by the scan in render().
    function computeFieldRow(y: number, t: number) {
      const rowNorm = rows <= 1 ? 0 : y / (rows - 1);
      let i = y * cols;
      for (let x = 0; x < cols; x++, i++) {
        const b = sampleBands(x, y, t, rowNorm);
        if (inGapCloud(b.u, b.v, t)) { kindBack[i] = 3; continue; }
        if (b.tLine > CFG.lineThreshold) {
          kindBack[i] = 1;
          charBack[i] = pickFrom(CFG.lineSet, hash32(b.bandIndex * 73856093));
        } else if (b.tGap > CFG.gapThreshold) {
          kindBack[i] = 2;
          charBack[i] = pickFrom(CFG.gapSet, hash32(b.bandIndex * 19349663));
        } else {
          kindBack[i] = 0;
        }
      }
    }

    function swapFieldBuffers() {
      const k = kindBuf; kindBuf = kindBack; kindBack = k;
      const f = fieldChar; fieldChar = charBack; charBack = f;
      hasField = true;
    }

    // Full synchronous pass — only for resizes and the reduced-motion
    // static frame, where a one-off blocking pass is acceptable.
    function computeFieldFull(t: number) {
      for (let y = 0; y < rows; y++) computeFieldRow(y, t);
      swapFieldBuffers();
      lastFieldT = t;
      fieldDirty = false;
      scanY = -1;
    }

    // Paint the cached field + per-frame dynamics (erase trail, shimmer).
    function drawGrid(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#e63946';
      const slice = Math.floor(t * CFG.randomChangeHz);
      let i = 0;
      for (let y = 0; y < rows; y++) {
        let line = '';
        for (let x = 0; x < cols; x++, i++) {
          if (eraseBuf[i] > 0 || kindBuf[i] === 3) { line += ' '; continue; }
          if (kindBuf[i] === 0) {
            const h = hash32((x + 1) * 15485863 ^ (y + 1) * 32452843 ^ slice * 49979687);
            line += CFG.randomSet[h % CFG.randomSet.length];
          } else {
            line += fieldChar[i];
          }
        }
        ctx.fillText(line, 0, y * cellH);
      }
    }

    function drawStatic() {
      const t = (performance.now() - t0) / 1000;
      computeFieldFull(t);
      drawGrid(t);
    }

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId = 0;
    let t0 = performance.now();
    let lastFrame = performance.now();
    let lastT = 0;
    let inView = true; // updated by IntersectionObserver below

    function render(now: number) {
      if (now - lastFrame < 1000 / CFG.fpsCap) { rafId = requestAnimationFrame(render); return; }
      const t  = (now - t0) / 1000;
      const dt = t - lastT;
      lastT = t; lastFrame = now;

      // decay erase buffer
      if (CFG.erase.enabled) {
        for (let i = 0; i < eraseBuf.length; i++) {
          const v = eraseBuf[i] - dt;
          eraseBuf[i] = v > 0 ? v : 0;
        }
      }
      flushErase();

      // Incremental field scan: start a new scan when due, then fill rows
      // of the back buffer until the per-frame budget runs out. Swapping
      // only on completion keeps the displayed field coherent.
      if (scanY < 0 && (fieldDirty || t - lastFieldT >= FIELD_INTERVAL)) {
        scanY = 0;
        scanT = t;
        fieldDirty = false;
      }
      if (scanY >= 0) {
        const budgetEnd = performance.now() + FIELD_BUDGET_MS;
        while (scanY < rows && performance.now() < budgetEnd) {
          computeFieldRow(scanY, scanT);
          scanY++;
        }
        if (scanY >= rows) {
          swapFieldBuffers();
          lastFieldT = scanT;
          scanY = -1;
        }
      }

      // Until the very first scan completes the front buffer is all zeros
      // (= random shimmer everywhere) — skip drawing rather than flash it.
      if (hasField) drawGrid(t);
      rafId = requestAnimationFrame(render);
    }

    // ── Pause when tab hidden / resume when visible ───────────────────────
    let pausedAt: number | null = null;
    function onVisibility() {
      if (document.visibilityState === 'hidden' || !inView) {
        cancelAnimationFrame(rafId);
        pausedAt = performance.now();
      } else {
        // Resume (covers both: after a hide, and the occasional case where
        // the browser fires visibilitychange on focus even without a prior hide).
        if (pausedAt !== null) {
          t0 += performance.now() - pausedAt;
          pausedAt = null;
        }
        lastFrame = 0;
        cancelAnimationFrame(rafId);
        computeGrid(); // layout may have shifted while hidden
        if (!reduceMotion && inView) {
          rafId = requestAnimationFrame(render);
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    // ── BFCache restore ───────────────────────────────────────────────────
    // When the page is restored from the back-forward cache, React doesn't
    // re-run the effect but the RAF loop is dead. Restart it here.
    function onPageShow(e: PageTransitionEvent) {
      if (!e.persisted) return;
      cancelAnimationFrame(rafId);
      lastFrame = 0;
      pausedAt = null;
      computeGrid();
      if (!reduceMotion && inView) {
        rafId = requestAnimationFrame(render);
      }
    }
    window.addEventListener('pageshow', onPageShow);

    const ro = new ResizeObserver(computeGrid);
    ro.observe(host);

    // ── Pause RAF when the ASCII host scrolls offscreen ──────────────────
    // Big perf + battery win on long pages: skip ~30 fps of full-grid work
    // while the user is reading the Projects section below.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? true;
        if (visible === inView) return;
        inView = visible;
        if (!inView) {
          cancelAnimationFrame(rafId);
          pausedAt = performance.now();
        } else if (document.visibilityState === 'visible') {
          if (pausedAt !== null) {
            t0 += performance.now() - pausedAt;
            pausedAt = null;
          }
          lastFrame = 0;
          cancelAnimationFrame(rafId);
          computeGrid();
          if (!reduceMotion) rafId = requestAnimationFrame(render);
        }
      },
      { rootMargin: '200px 0px' }, // start ramp-up just before it scrolls in
    );
    io.observe(host);

    // Also listen on window — catches iOS address-bar collapse / orientation
    // changes where ResizeObserver on the host alone sometimes fires too early
    // with stale dimensions.
    const onWinResize = () => computeGrid();
    window.addEventListener('resize', onWinResize);
    window.addEventListener('orientationchange', onWinResize);

    // ── Watchdog ──────────────────────────────────────────────────────────
    // Defensive: if the render loop hasn't ticked in >2s while the tab is
    // visible, something stopped it (long background throttle, laptop sleep,
    // browser freeze/resume without visibilitychange, etc.) — restart.
    const watchdog = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (reduceMotion || !inView) return;
      if (performance.now() - lastFrame < 2000) return;
      cancelAnimationFrame(rafId);
      lastFrame = performance.now();
      pausedAt = null;
      computeGrid();
      rafId = requestAnimationFrame(render);
    }, 3000);

    // Window focus — extra safety net for browsers that swallow the
    // visibilitychange event when returning from long inactivity.
    function onFocus() {
      if (reduceMotion || !inView) return;
      if (performance.now() - lastFrame < 500) return;
      cancelAnimationFrame(rafId);
      lastFrame = performance.now();
      pausedAt = null;
      computeGrid();
      rafId = requestAnimationFrame(render);
    }
    window.addEventListener('focus', onFocus);

    // Size the canvas now, but defer the first (expensive) field computation
    // and loop start to idle time: the layer fades in from opacity 0 over
    // 1.5s, so starting a few hundred ms late is invisible — and it keeps
    // the initial noise pass off the hydration-critical path at page load.
    computeGrid();
    function startLoop() {
      loopStarted = true;
      cancelAnimationFrame(rafId);
      if (reduceMotion) {
        drawStatic();
        return;
      }
      lastFrame = 0; // draw on the very first tick
      rafId = requestAnimationFrame(render);
    }
    let idleId = 0;
    let idleTimer = 0;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(startLoop, { timeout: 600 });
    } else {
      idleTimer = window.setTimeout(startLoop, 250);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => computeGrid()).catch(() => {});
    }

    // Belt-and-braces recomputes to catch late layout shifts that the
    // ResizeObserver sometimes misses on mobile (lazy-loaded images, iOS
    // address-bar animations, content stacking post-hydration).
    const delayedComputes = [
      window.setTimeout(() => computeGrid(), 500),
      window.setTimeout(() => computeGrid(), 1500),
      window.setTimeout(() => computeGrid(), 3000),
    ];
    const onLoad = () => computeGrid();
    if (document.readyState === 'complete') {
      // already loaded; the timeouts above cover it
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (idleId && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId);
      clearTimeout(idleTimer);
      clearInterval(watchdog);
      ro.disconnect();
      io.disconnect();
      delayedComputes.forEach(clearTimeout);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('resize', onWinResize);
      window.removeEventListener('orientationchange', onWinResize);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('load', onLoad);
      document.removeEventListener('visibilitychange', onVisibility);
      if (host.contains(canvas)) host.removeChild(canvas);
    };
  }, []);

  const sideMask =
    'linear-gradient(to right, black 0%, black 18%, transparent 36%, transparent 64%, black 82%, black 100%)';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{
          opacity: revealed ? opacity : 0,
          transition: 'opacity 1.5s linear',
          maskImage: sideMask,
          WebkitMaskImage: sideMask,
        }}
      />

      {maskBottom && (
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 bottom-0 pointer-events-none"
          style={{
            height: maskBottom,
            background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          }}
        />
      )}
    </div>
  );
}
