'use client';

import { useEffect, useRef } from 'react';

interface Props {
  opacity?: number;
}

export default function AsciiBackground({ opacity = 0.18 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;

    // ── Config ────────────────────────────────────────────────────────────
    const CFG = {
      frequency:       10,
      contrast:        0.38,
      edgeWidth:       0.04,
      gapLevel:        0.32,
      angleDeg:        0,
      driftX:          0,
      driftY:          -0.02,
      warpAmp:         0.42,
      warpScale:       1.4,
      warpSpeed:       0.001,
      bandJitter:      { enabled: true, amp: 0.2, scale: 0.85, speed: 0.05 },
      randomSet:       Array.from(' .,:;*+![]{}<>-~=/\\'),
      lineSet:         Array.from('  <>/{};:=+-*|#!()  '),
      gapSet:          Array.from('@'),
      randomChangeHz:  1.5,
      lineThreshold:   0,
      gapThreshold:    1,
      gapFan:          { enabled: true, strength: 0.5 },
      gapClouds:       { enabled: true, density: 0.08, scale: 1.6, speed: 0.03, octaves: 3, hardness: 0.85 },
      fpsCap:          30,
    };

    // ── Create <pre> ──────────────────────────────────────────────────────
    const pre = document.createElement('pre');
    pre.setAttribute('aria-hidden', 'true');
    Object.assign(pre.style, {
      position: 'absolute',
      inset: '0',
      margin: '0',
      padding: '0',
      color: '#e63946',
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '13px',
      lineHeight: '1.15',
      whiteSpace: 'pre',
      overflow: 'hidden',
      background: 'transparent',
      userSelect: 'none',
      pointerEvents: 'none',
    });
    host.appendChild(pre);

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
      const n00 = grad(x0, y0, x, y);
      const n10 = grad(x1, y0, x, y);
      const n01 = grad(x0, y1, x, y);
      const n11 = grad(x1, y1, x, y);
      const ix0 = n00 + sx * (n10 - n00);
      const ix1 = n01 + sx * (n11 - n01);
      return ix0 + sy * (ix1 - ix0);
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
    let cellW = 8, cellH = 14;
    const SAFE_PAD_X = 0.15, SAFE_PAD_Y = 0.05;

    function measureCell() {
      const probe = document.createElement('span');
      probe.textContent = 'M'.repeat(200);
      Object.assign(probe.style, {
        position: 'absolute', left: '-9999px', top: '-9999px',
        whiteSpace: 'pre', pointerEvents: 'none', visibility: 'hidden',
      });
      const cs = getComputedStyle(pre);
      probe.style.font = cs.font;
      probe.style.letterSpacing = cs.letterSpacing;
      host.appendChild(probe);
      const w = probe.getBoundingClientRect().width / 200 || 8;
      const lh = parseFloat(cs.lineHeight) || 14;
      host.removeChild(probe);
      return { cw: w, lh };
    }

    function computeGrid() {
      const m = measureCell();
      cellW = m.cw; cellH = m.lh;
      const rect = host.getBoundingClientRect();
      const c = Math.max(1, Math.floor(rect.width  / cellW - SAFE_PAD_X));
      const r = Math.max(1, Math.floor(rect.height / cellH - SAFE_PAD_Y));
      cols = c; rows = r;
      sShort = Math.min(cols, rows);
    }

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
      let u = x / s - CFG.driftX * t;
      let v = y / s - CFG.driftY * t;
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

    function chooseChar(x: number, y: number, t: number, b: ReturnType<typeof sampleBands>) {
      if (inGapCloud(b.u, b.v, t)) return ' ';
      if (b.tLine > CFG.lineThreshold) {
        return pickFrom(CFG.lineSet, hash32(b.bandIndex * 73856093));
      }
      if (b.tGap > CFG.gapThreshold) {
        return pickFrom(CFG.gapSet, hash32(b.bandIndex * 19349663));
      }
      const slice = Math.floor(t * CFG.randomChangeHz);
      const h = hash32((x + 1) * 15485863 ^ (y + 1) * 32452843 ^ slice * 49979687);
      return CFG.randomSet[h % CFG.randomSet.length];
    }

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId = 0;
    let t0 = performance.now();
    let lastFrame = 0;

    function render(now: number) {
      if (now - lastFrame < 1000 / CFG.fpsCap) {
        rafId = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;
      const t = (now - t0) / 1000;
      let out = '';
      for (let y = 0; y < rows; y++) {
        const rowNorm = rows <= 1 ? 0 : y / (rows - 1);
        for (let x = 0; x < cols; x++) {
          const b = sampleBands(x, y, t, rowNorm);
          out += chooseChar(x, y, t, b);
        }
        if (y < rows - 1) out += '\n';
      }
      pre.textContent = out;
      rafId = requestAnimationFrame(render);
    }

    // ── Pause when tab hidden ─────────────────────────────────────────────
    let pausedAt: number | null = null;
    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        pausedAt = performance.now();
      } else if (pausedAt !== null) {
        t0 += performance.now() - pausedAt;
        pausedAt = null;
        lastFrame = 0;
        rafId = requestAnimationFrame(render);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    // ── ResizeObserver ────────────────────────────────────────────────────
    const ro = new ResizeObserver(computeGrid);
    ro.observe(host);

    // ── Start ─────────────────────────────────────────────────────────────
    const start = () => {
      computeGrid();
      rafId = requestAnimationFrame(render);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      if (host.contains(pre)) host.removeChild(pre);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    />
  );
}
