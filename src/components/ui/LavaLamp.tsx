// Lava-lamp particle drop — wide flat ellipses fall slowly from the ticker.
// Container is pure #000000 (matches Projects bg-black exactly).
// Top overlay bridges from About's #111111 → transparent so no hard edge.
const BLOBS = [
  { w: 300, h: 55, left: '2%',  dur: 17, delay: 0     },
  { w: 250, h: 46, left: '14%', dur: 14, delay: -5.2  },
  { w: 320, h: 60, left: '26%', dur: 19, delay: -10.8 },
  { w: 210, h: 42, left: '37%', dur: 15, delay: -3.4  },
  { w: 280, h: 52, left: '49%', dur: 18, delay: -8.0  },
  { w: 230, h: 44, left: '59%', dur: 13, delay: -1.7  },
  { w: 305, h: 57, left: '69%', dur: 20, delay: -12.5 },
  { w: 190, h: 38, left: '79%', dur: 16, delay: -6.9  },
  { w: 260, h: 50, left: '87%', dur: 14, delay: -4.1  },
  { w: 215, h: 41, left: '20%', dur: 18, delay: -15.3 },
  { w: 275, h: 52, left: '43%', dur: 16, delay: -9.6  },
  { w: 195, h: 39, left: '71%', dur: 13, delay: -7.2  },
];

export default function LavaLamp() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ height: 140, background: '#000000' }}
      aria-hidden="true"
    >
      {/* Soft particle layer — pure #000000 background so bottom = Projects black */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
        filter: 'blur(28px)',
      }}>
        {BLOBS.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: b.w,
              height: b.h,
              borderRadius: '50%',
              background: 'rgba(220, 50, 60, 0.62)',
              top: 0,
              left: b.left,
              animation: `lava-drop ${b.dur}s linear ${b.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Top bridge — covers #111111 → transparent so About section blends in */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #111111 0%, transparent 42%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {/* Bottom fade — solid #000000 from 50% so it matches Projects perfectly */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent 20%, #000000 52%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
    </div>
  );
}
