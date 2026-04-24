# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compress video/image assets and apply code-level fixes to make the portfolio load and run smoothly without changing any design, layout, or animation timings.

**Architecture:** Asset compression is done with FFmpeg (in-place replacement). Code fixes are isolated to individual component files. No new abstractions, no new files — pure subtraction and targeted edits.

**Tech Stack:** FFmpeg 8.0, Next.js 16.2.3, React 19, TypeScript, GSAP, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-04-24-performance-optimization-design.md`

---

## File Map

| File | Change |
|---|---|
| `public/videos/featured/baseaim dashboard.mp4` | Re-encode CRF 26 +faststart -an |
| `public/videos/featured/baseaim aim landing page.mp4` | Re-encode CRF 26 +faststart -an |
| `public/videos/featured/cofarming hub.mp4` | Re-encode CRF 26 +faststart -an |
| `public/videos/featured/cys accountants.mp4` | Re-encode CRF 26 +faststart -an |
| `public/images/airtable clone.mp4` | Re-encode CRF 26 +faststart -an |
| `public/images/sign now automation.png` | Convert to WebP |
| `public/images/research cover.png` | Convert to WebP |
| `public/images/voice agent.png` | Convert to WebP |
| `src/components/sections/Projects.tsx` | Update imageSrc refs, YouTubeFacade lazy+rootMargin, FeaturedCard Image, hero preload |
| `src/components/sections/About.tsx` | IntroVideo thumbnail lazy, profile photo priority |
| `src/components/ui/AsciiBackground.tsx` | IntersectionObserver pause/resume RAF |
| `src/components/ui/CustomCursor.tsx` | visibilitychange stops lerp RAF |
| `src/components/ui/LavaLamp.tsx` | Delete |
| `next.config.ts` | Add remotePatterns for img.youtube.com |

---

## Task 1: Compress videos with FFmpeg

**Files:** `public/videos/featured/*.mp4`, `public/images/airtable clone.mp4`

Work in temp files, verify visually, then replace originals.

- [ ] **Step 1: Compress `baseaim dashboard.mp4`**

```bash
cd "e:/websites/eden-portfolio/public/videos/featured"
ffmpeg -i "baseaim dashboard.mp4" -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an "baseaim dashboard_compressed.mp4"
```

Expected: progress bar, output file appears. Takes 2–5 minutes.

- [ ] **Step 2: Replace original**

```bash
mv "baseaim dashboard.mp4" "baseaim dashboard_orig.mp4"
mv "baseaim dashboard_compressed.mp4" "baseaim dashboard.mp4"
```

- [ ] **Step 3: Compress `baseaim aim landing page.mp4`**

```bash
ffmpeg -i "baseaim aim landing page.mp4" -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an "baseaim aim landing page_compressed.mp4"
mv "baseaim aim landing page.mp4" "baseaim aim landing page_orig.mp4"
mv "baseaim aim landing page_compressed.mp4" "baseaim aim landing page.mp4"
```

- [ ] **Step 4: Compress `cofarming hub.mp4`**

```bash
ffmpeg -i "cofarming hub.mp4" -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an "cofarming hub_compressed.mp4"
mv "cofarming hub.mp4" "cofarming hub_orig.mp4"
mv "cofarming hub_compressed.mp4" "cofarming hub.mp4"
```

- [ ] **Step 5: Compress `cys accountants.mp4`**

```bash
ffmpeg -i "cys accountants.mp4" -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an "cys accountants_compressed.mp4"
mv "cys accountants.mp4" "cys accountants_orig.mp4"
mv "cys accountants_compressed.mp4" "cys accountants.mp4"
```

- [ ] **Step 6: Compress `airtable clone.mp4`**

```bash
cd "e:/websites/eden-portfolio/public/images"
ffmpeg -i "airtable clone.mp4" -vcodec libx264 -crf 26 -preset slow -movflags +faststart -an "airtable clone_compressed.mp4"
mv "airtable clone.mp4" "airtable clone_orig.mp4"
mv "airtable clone_compressed.mp4" "airtable clone.mp4"
```

- [ ] **Step 7: Verify sizes and playback**

```bash
cd "e:/websites/eden-portfolio"
ls -lh public/videos/featured/*.mp4 public/images/*.mp4
```

Expected: all new files significantly smaller than originals. Then start dev server and open the Projects section to verify Featured tab videos play correctly:

```bash
npm run dev
```

Open `http://localhost:3000` → scroll to Projects → Featured tab → confirm all video cards play (F01 Baseaim hero, F04 CYS, F05 CoFarming, F09 Airtable).

- [ ] **Step 8: Delete originals and commit**

```bash
cd "e:/websites/eden-portfolio"
rm "public/videos/featured/baseaim dashboard_orig.mp4"
rm "public/videos/featured/baseaim aim landing page_orig.mp4"
rm "public/videos/featured/cofarming hub_orig.mp4"
rm "public/videos/featured/cys accountants_orig.mp4"
rm "public/images/airtable clone_orig.mp4"
git add public/videos/featured/ public/images/
git commit -m "perf: compress all videos with H.264 CRF 26 +faststart"
```

---

## Task 2: Convert images to WebP

**Files:** `public/images/sign now automation.png`, `public/images/research cover.png`, `public/images/voice agent.png`

- [ ] **Step 1: Convert all three**

```bash
cd "e:/websites/eden-portfolio/public/images"
ffmpeg -i "sign now automation.png" -c:v libwebp -quality 82 "sign now automation.webp"
ffmpeg -i "research cover.png" -c:v libwebp -quality 82 "research cover.webp"
ffmpeg -i "voice agent.png" -c:v libwebp -quality 82 "voice agent.webp"
```

- [ ] **Step 2: Verify sizes**

```bash
ls -lh "sign now automation.png" "sign now automation.webp" "research cover.png" "research cover.webp" "voice agent.png" "voice agent.webp"
```

Expected: each `.webp` is 80–90% smaller than its `.png` counterpart.

- [ ] **Step 3: Stage WebP files (keep PNGs as fallback for now)**

```bash
cd "e:/websites/eden-portfolio"
git add public/images/
git commit -m "perf: add WebP versions of featured card images"
```

---

## Task 3: Update imageSrc references in Projects.tsx

**Files:** `src/components/sections/Projects.tsx`

Update the `FEATURED_ITEMS` array to point to the new `.webp` files. Three items: F02, F07, F08.

- [ ] **Step 1: Update F02 (voice agent)**

In `Projects.tsx`, find line ~367:
```tsx
    imageSrc: '/images/voice agent.png',
```
Change to:
```tsx
    imageSrc: '/images/voice agent.webp',
```

- [ ] **Step 2: Update F07 (research cover)**

Find line ~451:
```tsx
    imageSrc: '/images/research cover.png',
```
Change to:
```tsx
    imageSrc: '/images/research cover.webp',
```

- [ ] **Step 3: Update F08 (sign now)**

Find line ~468:
```tsx
    imageSrc: '/images/sign now automation.png',
```
Change to:
```tsx
    imageSrc: '/images/sign now automation.webp',
```

- [ ] **Step 4: Verify build**

```bash
cd "e:/websites/eden-portfolio"
npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` — no TypeScript errors.

- [ ] **Step 5: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000` → Projects → Featured → confirm F02, F07, F08 cards display images correctly.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "perf: use WebP images in featured cards (F02, F07, F08)"
```

---

## Task 4: Delete LavaLamp

**Files:** `src/components/ui/LavaLamp.tsx` (delete)

- [ ] **Step 1: Confirm no imports**

```bash
cd "e:/websites/eden-portfolio"
grep -r "LavaLamp" src/
```

Expected: only `src/components/ui/LavaLamp.tsx` itself. No other matches.

- [ ] **Step 2: Delete the file**

```bash
rm src/components/ui/LavaLamp.tsx
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/ui/LavaLamp.tsx
git commit -m "chore: delete unused LavaLamp component"
```

---

## Task 5: AsciiBackground — pause RAF when off-screen

**File:** `src/components/ui/AsciiBackground.tsx`

The background spans Hero + About only. When the user scrolls below About, the 30fps Perlin noise RAF loop keeps running. Add an `IntersectionObserver` that cancels/restarts the loop based on viewport visibility.

- [ ] **Step 1: Add IntersectionObserver after line 380 (`rafId = requestAnimationFrame(render);`)**

The insertion point is after the initial RAF kick-off block (line 380) and before the `delayedComputes` block (line 388). Add this block:

```ts
    // ── Pause loop when host is off-screen ────────────────────────────────
    // Cancels the RAF when the ASCII background scrolls out of view (e.g.
    // user is in Projects/Skills/Contact) and restarts it on re-entry.
    // 200px rootMargin keeps a small buffer so it resumes just before visible.
    const pauseObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(rafId);
        } else {
          lastFrame = 0;
          rafId = requestAnimationFrame(render);
        }
      },
      { rootMargin: '200px 0px' },
    );
    pauseObserver.observe(host);
```

- [ ] **Step 2: Add `pauseObserver.disconnect()` to the cleanup**

The cleanup `return () => {` block starts at line 400. Add `pauseObserver.disconnect();` as the second line, after `cancelAnimationFrame(rafId);`:

```ts
    return () => {
      cancelAnimationFrame(rafId);
      pauseObserver.disconnect();   // ← add this line
      clearInterval(watchdog);
      ro.disconnect();
      // ... rest unchanged
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000`. Open DevTools → Performance tab → record while scrolling down past About into Projects. Verify no continuous RAF activity from the ASCII background once it's off-screen.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/AsciiBackground.tsx
git commit -m "perf: pause AsciiBackground RAF loop when off-screen"
```

---

## Task 6: CustomCursor — stop lerp RAF when tab is hidden

**File:** `src/components/ui/CustomCursor.tsx`

The lerp loop at lines 85–96 runs unconditionally via `requestAnimationFrame`. Extend it to cancel on `visibilitychange: hidden` and restart on `visible`.

- [ ] **Step 1: Replace the lerp loop `useEffect` (lines 84–96)**

Find this exact block:
```tsx
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
```

Replace with:
```tsx
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
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CustomCursor.tsx
git commit -m "perf: stop cursor lerp RAF when tab is hidden"
```

---

## Task 7: YouTube thumbnails — lazy loading + reduced rootMargin

**Files:** `src/components/sections/About.tsx`, `src/components/sections/Projects.tsx`

### About.tsx — IntroVideo thumbnail

- [ ] **Step 1: Add `loading="lazy"` and `decoding="async"` to the thumbnail `<img>`**

In `About.tsx`, find this img in the `IntroVideo` component (line ~52):
```tsx
              <img
                src={`https://img.youtube.com/vi/${INTRO_YT_ID}/hqdefault.jpg`}
                alt="Intro video thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-300"
              />
```

Replace with:
```tsx
              <img
                src={`https://img.youtube.com/vi/${INTRO_YT_ID}/hqdefault.jpg`}
                alt="Intro video thumbnail"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-300"
              />
```

### Projects.tsx — YouTubeFacade

- [ ] **Step 2: Reduce `rootMargin` from `'600px 0px'` to `'200px 0px'`**

In `Projects.tsx`, find line 798:
```tsx
      { rootMargin: '600px 0px', threshold: 0 },
```
Change to:
```tsx
      { rootMargin: '200px 0px', threshold: 0 },
```

- [ ] **Step 3: Add `loading="lazy"` and `decoding="async"` to YouTubeFacade thumbnail `<img>` (line ~811)**

Find:
```tsx
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
```

Replace with:
```tsx
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt="Video thumbnail"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/Projects.tsx
git commit -m "perf: lazy-load YouTube thumbnails, reduce IntersectionObserver rootMargin"
```

---

## Task 8: FeaturedCard static images — Next.js Image component

**File:** `src/components/sections/Projects.tsx`

Replace the raw `<img>` for static `imageSrc` cards with Next.js `<Image fill>`. This enables lazy loading and automatic format negotiation (WebP/AVIF) via Next.js image optimization.

- [ ] **Step 1: Verify `Image` is already imported**

Check the top of `Projects.tsx` for an `import Image from 'next/image'` line. If missing, add it after the existing React import:

```tsx
import Image from 'next/image';
```

- [ ] **Step 2: Replace the `imageSrc` render branch (line 995–996)**

Find:
```tsx
        ) : imageSrc ? (
          <img src={imageSrc} alt={name} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 97%' }} />
```

Replace with:
```tsx
        ) : imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            style={{ objectPosition: '50% 97%' }}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          />
```

- [ ] **Step 3: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`. If you see a "hostname not configured" error for WebP paths, that means Step 1 of Task 11 (next.config.ts) needs to run first — jump ahead to Task 11 and come back.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Open Projects → Featured → confirm F02 (voice agent), F07 (research cover), F08 (sign now) cards display images at full quality.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "perf: use Next.js Image for featured card static images"
```

---

## Task 9: Hero video — `preload="metadata"`

**File:** `src/components/sections/Projects.tsx`

The hero card (F01) shows a dual-video player. The primary video (`videoRef`) should use `preload="metadata"` so the browser fetches the moov atom (a few KB) immediately — this lets the container size itself correctly before the video body streams. The secondary video stays `preload="none"`.

- [ ] **Step 1: Change `preload` on `videoRef` (line 951)**

Find (inside the dual-video branch, `{videoSrc && videoSrc2 ? (`):
```tsx
            <video
              ref={videoRef}
              src={videoSrc}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeVideo === 0 ? 'z-[2] opacity-100' : 'z-[1] opacity-0'}`}
              muted loop playsInline preload="none"
              onLoadedMetadata={activeVideo === 0 ? handleVideoMetadata : undefined}
            />
```

Change `preload="none"` to `preload="metadata"`:
```tsx
            <video
              ref={videoRef}
              src={videoSrc}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeVideo === 0 ? 'z-[2] opacity-100' : 'z-[1] opacity-0'}`}
              muted loop playsInline preload="metadata"
              onLoadedMetadata={activeVideo === 0 ? handleVideoMetadata : undefined}
            />
```

Leave `videoRef2` (line ~955) unchanged at `preload="none"`.

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Projects.tsx
git commit -m "perf: preload metadata for hero card primary video"
```

---

## Task 10: Profile photo — `priority` prop

**File:** `src/components/sections/About.tsx`

The profile photo is above the fold on desktop. Adding Next.js `priority` tells the framework to preload it as a high-priority resource (adds `<link rel="preload">` to `<head>`).

- [ ] **Step 1: Add `priority` to the profile `<Image>` (line ~247)**

Find:
```tsx
                <Image
                  src="/images/profile.jpg"
                  alt="Eden Ryder Lee"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 220px, 260px"
                />
```

Replace with:
```tsx
                <Image
                  src="/images/profile.jpg"
                  alt="Eden Ryder Lee"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 220px, 260px"
                />
```

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/About.tsx
git commit -m "perf: mark profile photo as high-priority resource"
```

---

## Task 11: next.config.ts — image remote patterns

**File:** `next.config.ts`

Add `remotePatterns` for `img.youtube.com` so Next.js Image optimisation can serve YouTube thumbnails and doesn't throw a hostname error.

- [ ] **Step 1: Replace entire `next.config.ts`**

Current content:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

Replace with:
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

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "perf: add YouTube thumbnail hostname to Next.js image remote patterns"
```

---

## Task 12: Final verification

- [ ] **Step 1: Full production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors and no warnings about unoptimised images.

- [ ] **Step 2: Visual smoke test — run dev server**

```bash
npm run dev
```

Check each of the following:

| Check | Expected |
|---|---|
| Hero section loads | Name animates in, no layout shift |
| AsciiBackground | Renders, pauses when scrolled to Projects |
| AsciiBackground resumes | Scroll back to Hero — background restarts |
| Profile photo | Loads quickly (high priority) |
| About IntroVideo thumbnail | Loads lazily (check Network tab — not in initial requests) |
| Projects Featured tab | F01 Baseaim hero video plays (both Landing + Dashboard) |
| Projects Featured tab | F02 voice agent WebP image displays |
| Projects Featured tab | F03, F06 YouTube cards show thumbnails lazily, iframe loads on approach |
| Projects Featured tab | F04, F05 CYS + CoFarming videos play |
| Projects Featured tab | F07 research cover WebP image displays |
| Projects Featured tab | F08 sign now WebP image displays |
| Projects Featured tab | F09 Airtable video plays |
| Custom cursor | Moves and scrambles normally |
| LavaLamp | No visual reference to it anywhere (it was unused) |

- [ ] **Step 3: Confirm video file sizes (sanity check)**

```bash
ls -lh public/videos/featured/ public/images/*.mp4
```

All compressed `.mp4` files should be under 10 MB.

- [ ] **Step 4: Delete PNG originals (optional cleanup)**

Only do this after confirming WebP images display correctly in Step 2:

```bash
rm "public/images/sign now automation.png"
rm "public/images/research cover.png"
rm "public/images/voice agent.png"
git add public/images/
git commit -m "chore: remove superseded PNG originals (replaced by WebP)"
```

---

## Self-Review Checklist

- [x] **Task 1** covers all 5 video files from the spec
- [x] **Task 2 + 3** covers all 3 PNG → WebP conversions and code reference updates
- [x] **Task 4** covers LavaLamp deletion
- [x] **Task 5** covers AsciiBackground IntersectionObserver pause (spec §3)
- [x] **Task 6** covers CustomCursor visibilitychange (spec §4)
- [x] **Task 7** covers both YouTube thumbnail `<img>` instances (About + Projects) and rootMargin reduction (spec §5)
- [x] **Task 8** covers FeaturedCard `<img>` → `<Image fill>` (spec §6)
- [x] **Task 9** covers `preload="metadata"` on hero card videoRef only (spec §8)
- [x] **Task 10** covers profile photo `priority` (spec §9)
- [x] **Task 11** covers next.config.ts remotePatterns (spec §7)
- [x] No TBDs, TODOs, or vague steps
- [x] Every code step shows the exact before/after
- [x] Exact bash commands with expected output in every verification step
