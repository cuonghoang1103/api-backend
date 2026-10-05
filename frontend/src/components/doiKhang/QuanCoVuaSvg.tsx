/**
 * Quân cờ vua vẽ SVG (05/10/2026) — không dùng ký tự Unicode ♔♕… (mỗi máy một font, trông thô).
 * Khung 100×100, đế chung, thân tô chuyển màu ngà (Trắng) / gỗ mun (Đen), viền đậm vừa phải.
 */
import type { QuanCoVua } from '@/lib/doiKhang/luat';

const DE = (
  <>
    <path d="M22 89 Q22 80 31 79 L69 79 Q78 80 78 89 Z" />
    <path d="M29 79 Q29 73.5 35 73 L65 73 Q71 73.5 71 79 Z" />
  </>
);

function Than({ loai, chiTiet }: { loai: string; chiTiet: string }) {
  switch (loai) {
    case 'p':
      return (
        <>
          <path d="M37.5 73 C 40 62 44 53 45 45 L55 45 C 56 53 60 62 62.5 73 Z" />
          <ellipse cx="50" cy="44" rx="13" ry="4.2" />
          <circle cx="50" cy="28" r="11.5" />
        </>
      );
    case 'r':
      return (
        <>
          <path d="M33 73 L36.5 42 L63.5 42 L67 73 Z" />
          <rect x="31" y="38.5" width="38" height="6" rx="2.2" />
          <path d="M30 40 L30 19 L38.5 19 L38.5 26 L45.5 26 L45.5 19 L54.5 19 L54.5 26 L61.5 26 L61.5 19 L70 19 L70 40 Z" />
          <path d="M37 55 L63 55" fill="none" stroke={chiTiet} strokeWidth="1.6" strokeOpacity=".55" />
        </>
      );
    case 'b':
      return (
        <>
          <path d="M38.5 73 C 41 64 44 58 45 54 L55 54 C 56 58 59 64 61.5 73 Z" />
          <ellipse cx="50" cy="53" rx="12.5" ry="4.2" />
          <path d="M50 17 C 38 26 33.5 36 35.5 43.5 C 37.5 50 44 52 50 52 C 56 52 62.5 50 64.5 43.5 C 66.5 36 62 26 50 17 Z" />
          <circle cx="50" cy="13" r="4.6" />
          <path d="M55 27 L46.5 38.5" fill="none" stroke={chiTiet} strokeWidth="2.4" strokeLinecap="round" />
        </>
      );
    case 'n':
      return (
        <>
          <path d="M30.5 73 C 31 64 36 57 42.5 51.5 C 38 52.5 32.5 54.5 27.5 52.5 C 22 50 21 44.5 25.5 39.5 C 31.5 33 35.5 28.5 38 22 L 36.5 11.5 L 44 17.5 L 48.5 11.5 L 51.5 18.5 C 64.5 21.5 72.5 33.5 72.5 51.5 C 72.5 61 70.5 67 70 73 Z" />
          <circle cx="43" cy="29" r="2.6" fill={chiTiet} stroke="none" />
          <circle cx="28.5" cy="46" r="1.5" fill={chiTiet} stroke="none" />
          <path d="M53 22.5 C 62 28 66.5 39 66.5 54" fill="none" stroke={chiTiet} strokeWidth="1.8" strokeOpacity=".55" strokeLinecap="round" />
        </>
      );
    case 'q':
      return (
        <>
          <path d="M32 73 L35.5 47 L26 27.5 L38.5 40 L39.5 20.5 L46.5 37 L50 16.5 L53.5 37 L60.5 20.5 L61.5 40 L74 27.5 L64.5 47 L68 73 Z" />
          <ellipse cx="50" cy="47.5" rx="16" ry="4.2" />
          <circle cx="26" cy="26" r="3.6" />
          <circle cx="39.5" cy="19" r="3.6" />
          <circle cx="50" cy="14.5" r="3.8" />
          <circle cx="60.5" cy="19" r="3.6" />
          <circle cx="74" cy="26" r="3.6" />
        </>
      );
    default: // vua
      return (
        <>
          <path d="M32 73 C 33 62 36 55 38 48.5 L62 48.5 C 64 55 67 62 68 73 Z" />
          <path d="M36.5 48.5 C 29.5 41 33 30 41.5 30.5 C 45 30.7 48 33 50 36.5 C 52 33 55 30.7 58.5 30.5 C 67 30 70.5 41 63.5 48.5 Z" />
          <ellipse cx="50" cy="48.5" rx="15.5" ry="4.2" />
          <rect x="47" y="10" width="6" height="22" rx="1.6" />
          <rect x="41.5" y="15.5" width="17" height="6" rx="1.6" />
        </>
      );
  }
}

export default function QuanCoVuaSvg({ quan, kich }: { quan: QuanCoVua; kich: number }) {
  const trang = quan === quan.toUpperCase();
  const loai = quan.toLowerCase();
  const id = trang ? 'cvTrang' : 'cvDen';
  return (
    <svg
      width={kich}
      height={kich}
      viewBox="0 0 100 100"
      aria-hidden
      style={{ filter: 'drop-shadow(0 3px 2.5px rgba(0,0,0,.45))', display: 'block' }}
    >
      <defs>
        {trang ? (
          <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#fffdf6" />
            <stop offset=".55" stopColor="#ecdcbc" />
            <stop offset="1" stopColor="#c4ab80" />
          </linearGradient>
        ) : (
          <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0" stopColor="#6b6672" />
            <stop offset=".45" stopColor="#2c2a31" />
            <stop offset="1" stopColor="#0f0e12" />
          </linearGradient>
        )}
      </defs>
      <g
        fill={`url(#${id})`}
        stroke={trang ? '#2a1f14' : '#030304'}
        strokeWidth="2.6"
        strokeLinejoin="round"
      >
        {DE}
        <Than loai={loai} chiTiet={trang ? '#2a1f14' : '#e9e1d4'} />
      </g>
      {/* ánh sáng mép trái — cảm giác khối tròn */}
      <path
        d={loai === 'p' ? 'M42 22 Q 44 18 49 17.5' : 'M34 86 Q 34 82 38 81.5'}
        fill="none"
        stroke="#fff"
        strokeOpacity={trang ? 0.8 : 0.28}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
