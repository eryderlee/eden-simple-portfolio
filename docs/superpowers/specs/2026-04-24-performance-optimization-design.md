# Performance Optimization — Design Spec

**Date:** 2026-04-24
**Approach:** A — Balanced (CRF 26 video compression + all code fixes)
**Constraints:** No design/layout changes. No animation timing changes.

---

## Goals

- Eliminate slow initial load caused by oversized video assets (up to 41.6 MB)
- Reduce wasted CPU from AsciiBackground running off-screen
- Lazy-load all below-fold images and YouTube thumbnails
- Remove dead code (LavaLamp)
- Add streaming hints so videos begin playback before full download

---

## 1. Video Asset Compression (FFmpeg)

Re-encode all 5 videos in-place. No code changes required — filenames stay identical.

**Settings:** `libx264`, CRF 26, `preset slow`, `-movflags +faststart`, `-an` (strip audio)

| File | Path | Before | Estimated After |
|---|---|---|---|
| `baseaim dashboard.mp4` | `public/videos/featured/` | 41.6 MB | ~6–8 MB |
| `baseaim aim landing page.mp4` | `public/videos/featured/` | 16.0 MB | ~2–4 MB |
| `cofarming hub.mp4` | `public/videos/featured/` | 12.5 MB | ~1.5–3 MB |
| `cys accountants.mp4` | `public/videos/featured/` | 6.8 MB | ~1–2 MB |
| `airtable clone.mp4` | `public/images/` | 27.7 MB | ~4–6 MB |

**FFmpeg command template:**
```bash
ffmpeg -i input.mp4 -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an output.mp4
```

Work in a temp copy, verify playback, then replace originals.

---

## 2. Image Asset Conversion (FFmpeg → WebP)

Convert 3 large PNGs to WebP. Update `src` references in `Projects.tsx`.

| File | Before | Estimated After | Used in |
|---|---|---|---|
| `sign now automation.png` | 1.09 MB | ~130 KB | `Projects.tsx` F08 `imageSrc` |
| `research cover.png` | 374 KB | ~70 KB | `Projects.tsx` F07 `imageSrc` |
| `voice agent.png` | 199 KB | ~50 KB | `Projects.tsx` F02 `imageSrc` |

**FFmpeg command template:**
```bash
ffmpeg -i input.png -c:v libwebp -quality 82 output.webp
```

Keep originals as fallback (rename to `.png.bak` or leave alongside). Update the 3 `imageSrc` strings in `FEATURED_ITEMS` array in `Projects.tsx`.

---

## 3. AsciiBackground — Pause RAF When Off-Screen

**File:** `src/components/ui/AsciiBackground.tsx`

The background only covers Hero + About (the first ~200vh). It currently runs a 30fps Perlin noise RAF loop for the entire page session — wasted CPU once the user scrolls past About.

**Change:** Add an `IntersectionObserver` on the `containerRef` host element. When the host exits the viewport, call `cancelAnimationFrame(rafId)`. When it re-enters, restart via `requestAnimationFrame(render)`.

Insert inside the existing `useEffect`, after `computeGrid()` / before the RAF start:

```ts
const pauseObserver = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      cancelAnimationFrame(rafId);
    } else {
      lastFrame = 0;
      rafId = requestAnimationFrame(render);
    }
  },
  { rootMargin: '200px 0px' } // small buffer so it resumes just before re-entering
);
pauseObserver.observe(host);
```

Add `pauseObserver.disconnect()` to the cleanup return.

---

## 4. CustomCursor — Stop Lerp Loop When Tab Hidden

**File:** `src/components/ui/CustomCursor.tsx`

The lerp RAF loop runs unconditionally. Hook it into `visibilitychange` to cancel/restart:

```ts
useEffect(() => {
  const loop = () => { /* existing lerp */ };
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
```

---

## 5. YouTube Thumbnails — Lazy Loading

**Files:** `src/components/sections/About.tsx`, `src/components/sections/Projects.tsx`

### About.tsx — `IntroVideo` component
```tsx
// Before
<img src={`https://img.youtube.com/vi/${INTRO_YT_ID}/hqdefault.jpg`} ... />

// After
<img
  src={`https://img.youtube.com/vi/${INTRO_YT_ID}/hqdefault.jpg`}
  loading="lazy"
  decoding="async"
  ...
/>
```

### Projects.tsx — `YouTubeFacade` component
Same `loading="lazy"` + `decoding="async"` on the thumbnail `<img>`.

Also reduce `rootMargin` from `'600px 0px'` to `'200px 0px'` in the `IntersectionObserver` — 600px eagerly boots the YouTube iframe nearly a full viewport ahead.

---

## 6. Featured Card Static Images — Next.js `<Image>`

**File:** `src/components/sections/Projects.tsx`

The `FeaturedCard` renders static images via raw `<img>` tag with no lazy loading. Swap to Next.js `<Image>` with `loading="lazy"` and correct `sizes`.

Affected featured items: F02 (voice agent), F07 (research cover), F08 (sign now automation).

```tsx
// Before
<img src={imageSrc} alt={name} className="absolute inset-0 w-full h-full object-cover" ... />

// After
import Image from 'next/image';
<Image
  src={imageSrc}
  alt={name}
  fill
  className="object-cover"
  loading="lazy"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
/>
```

---

## 7. Next.js Config — Image Remote Patterns

**File:** `next.config.ts`

Add `remotePatterns` for YouTube thumbnail domain so Next.js Image can serve/optimise them if routed through its endpoint in future. Also enables `img.youtube.com` to not be blocked by default policies.

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;
```

---

## 8. Hero Video — `preload="metadata"`

**File:** `src/components/sections/Projects.tsx`

The hero card (F01, `isHero: true`) shows a dual-video player. The active video currently uses `preload="none"`. Change the **initially active** video (`activeVideo === 0 ? videoRef : videoRef2` — i.e., `videoRef`) to `preload="metadata"`.

This lets the browser fetch just the moov atom (a few KB) to know dimensions and duration, enabling correct container sizing before the full file streams. The inactive video stays `preload="none"`.

```tsx
// videoRef (primary / initially active)
<video
  ref={videoRef}
  src={videoSrc}
  preload="metadata"   // changed from "none"
  ...
/>

// videoRef2 (secondary / inactive)
<video
  ref={videoRef2}
  src={videoSrc2}
  preload="none"       // unchanged
  ...
/>
```

---

## 9. Profile Photo — `fetchPriority="high"`

**File:** `src/components/sections/About.tsx`

The profile photo is above the fold on desktop. It uses Next.js `<Image>` already. Add `priority` prop (Next.js equivalent of `fetchpriority="high"`):

```tsx
// Before
<Image src="/images/profile.jpg" alt="Eden Ryder Lee" fill className="object-cover" sizes="..." />

// After
<Image src="/images/profile.jpg" alt="Eden Ryder Lee" fill className="object-cover" sizes="..." priority />
```

---

## 10. Remove LavaLamp

**Delete:** `src/components/ui/LavaLamp.tsx`

The component is defined but never imported anywhere in the codebase. Safe to delete outright — no other file references it.

---

## Out of Scope

- Design changes of any kind
- Animation timing changes
- Video dimensions / resolution changes
- Section order changes
- Font changes
- Removing any functional component other than LavaLamp

---

## Verification Checklist

- [ ] All 5 videos play correctly after re-encoding
- [ ] All 3 WebP images display correctly in featured cards
- [ ] AsciiBackground stops animating when scrolled below About section
- [ ] AsciiBackground resumes when scrolling back up
- [ ] YouTube thumbnails load lazily (check Network tab — no early requests)
- [ ] Hero video card shows correct dimensions before video loads
- [ ] Profile photo loads as high-priority resource
- [ ] No visual regressions in any section
- [ ] LavaLamp.tsx deleted, no import errors
