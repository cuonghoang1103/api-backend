/**
 * Lá bài vẽ SVG (05/10/2026) — mặt bài kiểu cổ điển: góc số + chất, nút chất xếp theo bố cục
 * chuẩn (nửa dưới lộn ngược), J/Q/K là khung hoa văn có vương miện/mũ đơn giản, chữ có chân.
 * Lá: '3S', 'TD' (T = 10), 'KH'… chất S♠ C♣ D♦ H♥.
 */
import { memo } from 'react';

const DO = '#c8102e';
const DEN = '#16161a';

/** Hình chất trong khung 100×100. */
export function HinhChat({ chat }: { chat: string }) {
  switch (chat) {
    case 'H':
      return <path d="M50 90 C 22 68 5 50 5 31 C 5 15 17 5 30 5 C 40 5 47 11 50 20 C 53 11 60 5 70 5 C 83 5 95 15 95 31 C 95 50 78 68 50 90 Z" />;
    case 'D':
      return <path d="M50 3 Q 66 30 88 50 Q 66 70 50 97 Q 34 70 12 50 Q 34 30 50 3 Z" />;
    case 'C':
      return (
        <>
          <circle cx="50" cy="27" r="19" />
          <circle cx="27" cy="58" r="19" />
          <circle cx="73" cy="58" r="19" />
          <path d="M45 52 C 45 74 40 86 30 96 L70 96 C 60 86 55 74 55 52 Z" />
        </>
      );
    default:
      return (
        <path d="M50 4 C 70 26 94 42 94 62 C 94 76 83 83 72 83 C 64 83 57 79 54 72 C 55 82 59 89 67 96 L33 96 C 41 89 45 82 46 72 C 43 79 36 83 28 83 C 17 83 6 76 6 62 C 6 42 30 26 50 4 Z" />
      );
  }
}

const VI_TRI: Record<number, [number, number][]> = {
  2: [[125, 78], [125, 272]],
  3: [[125, 78], [125, 175], [125, 272]],
  4: [[82, 78], [168, 78], [82, 272], [168, 272]],
  5: [[82, 78], [168, 78], [125, 175], [82, 272], [168, 272]],
  6: [[82, 78], [168, 78], [82, 175], [168, 175], [82, 272], [168, 272]],
  7: [[82, 78], [168, 78], [125, 126], [82, 175], [168, 175], [82, 272], [168, 272]],
  8: [[82, 78], [168, 78], [125, 126], [82, 175], [168, 175], [125, 224], [82, 272], [168, 272]],
  9: [[82, 78], [168, 78], [82, 143], [168, 143], [125, 175], [82, 207], [168, 207], [82, 272], [168, 272]],
  10: [[82, 78], [168, 78], [125, 110], [82, 143], [168, 143], [82, 207], [168, 207], [125, 240], [82, 272], [168, 272]],
};

const SO_HANG: Record<string, number> = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, T: 10 };

function Nut({ chat, x, y, k, lat }: { chat: string; x: number; y: number; k: number; lat?: boolean }) {
  const s = k / 100;
  return (
    <g transform={`translate(${x} ${y}) ${lat ? 'rotate(180)' : ''} translate(${-k / 2} ${-k / 2}) scale(${s})`}>
      <HinhChat chat={chat} />
    </g>
  );
}

/** Hình nhân vật J/Q/K: khung hoa văn + biểu tượng + chữ to, đối xứng trên–dưới như bài thật. */
function MatNguoi({ hang, chat, mau }: { hang: string; chat: string; mau: string }) {
  const nen = mau === DO ? '#fdf1f1' : '#f1f2f6';
  const vang = '#c99a2e';
  const bieuTuong =
    hang === 'K' ? (
      <path d="M-34 14 L-38 -16 L-19 0 L0 -26 L19 0 L38 -16 L34 14 Z" fill={vang} stroke={mau} strokeWidth="3" strokeLinejoin="round" />
    ) : hang === 'Q' ? (
      <g fill={vang} stroke={mau} strokeWidth="3" strokeLinejoin="round">
        <path d="M-32 14 C -34 -2 -26 -14 -16 -12 C -10 -24 10 -24 16 -12 C 26 -14 34 -2 32 14 Z" />
        <circle cx="0" cy="-26" r="6" />
      </g>
    ) : (
      <g fill={vang} stroke={mau} strokeWidth="3" strokeLinejoin="round">
        <path d="M-30 14 L-26 -6 C -16 -18 16 -18 26 -6 L30 14 Z" />
        <path d="M18 -12 C 30 -30 44 -28 46 -20 C 36 -22 28 -16 24 -6" fill="none" />
      </g>
    );
  const nua = (
    <g>
      <g transform="translate(125 112)">{bieuTuong}</g>
      <text x="125" y="170" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="62" fill={mau}>
        {hang}
      </text>
      <g transform="translate(150 138) scale(.2)" fill={mau}>
        <HinhChat chat={chat} />
      </g>
    </g>
  );
  return (
    <g>
      <rect x="56" y="48" width="138" height="254" rx="10" fill={nen} stroke={mau} strokeWidth="2.5" />
      <rect x="63" y="55" width="124" height="240" rx="7" fill="none" stroke={vang} strokeWidth="1.6" strokeDasharray="2 5" />
      <line x1="66" y1="175" x2="184" y2="175" stroke={mau} strokeOpacity=".35" strokeWidth="1.5" />
      {nua}
      <g transform="rotate(180 125 175)">{nua}</g>
    </g>
  );
}

function LaBaiGoc({ la, rong, mo }: { la: string; rong: number; mo?: boolean }) {
  const hang = la[0];
  const chat = la[1];
  const mau = chat === 'H' || chat === 'D' ? DO : DEN;
  const chuHang = hang === 'T' ? '10' : hang;
  const soNut = SO_HANG[hang];
  const goc = (
    <g fill={mau}>
      <text
        x="27"
        y="54"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize={chuHang.length > 1 ? 38 : 46}
        letterSpacing={chuHang.length > 1 ? -3 : 0}
      >
        {chuHang}
      </text>
      <Nut chat={chat} x={27} y={78} k={28} />
    </g>
  );
  return (
    <svg width={rong} height={rong * 1.4} viewBox="0 0 250 350" style={{ display: 'block', opacity: mo ? 0.55 : 1 }} aria-label={la}>
      <defs>
        <linearGradient id="laNen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3efe6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="246" height="346" rx="20" fill="url(#laNen)" stroke="#d6d0c4" strokeWidth="3" />
      {goc}
      <g transform="rotate(180 125 175)">{goc}</g>
      <g fill={mau}>
        {hang === 'A' ? (
          <>
            {chat === 'S' && <circle cx="125" cy="175" r="62" fill="none" stroke={mau} strokeOpacity=".18" strokeWidth="2" />}
            <Nut chat={chat} x={125} y={175} k={chat === 'S' ? 96 : 84} />
          </>
        ) : soNut ? (
          (VI_TRI[soNut] ?? []).map(([x, y], i) => <Nut key={i} chat={chat} x={x} y={y} k={42} lat={y > 180} />)
        ) : (
          <MatNguoi hang={hang} chat={chat} mau={mau} />
        )}
      </g>
    </svg>
  );
}

export const LaBai = memo(LaBaiGoc);

/** Lưng bài: nền tím than, hoa văn trám mảnh, viền vàng. */
export const LungBai = memo(function LungBai({ rong }: { rong: number }) {
  return (
    <svg width={rong} height={rong * 1.4} viewBox="0 0 250 350" style={{ display: 'block' }} aria-hidden>
      <defs>
        <pattern id="lungTram" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill="#3b1d6e" />
          <path d="M0 11 H22 M11 0 V22" stroke="#7c3aed" strokeOpacity=".55" strokeWidth="2" />
          <circle cx="11" cy="11" r="2.6" fill="#f0c66b" fillOpacity=".7" />
        </pattern>
        <linearGradient id="lungBong" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="246" height="346" rx="20" fill="#f6f1e6" stroke="#cfc6b4" strokeWidth="3" />
      <rect x="16" y="16" width="218" height="318" rx="12" fill="url(#lungTram)" stroke="#d4a23c" strokeWidth="4" />
      <circle cx="125" cy="175" r="34" fill="#2a1352" stroke="#f0c66b" strokeWidth="4" />
      <text x="125" y="188" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="36" fill="#f0c66b">
        CT
      </text>
      <rect x="16" y="16" width="218" height="318" rx="12" fill="url(#lungBong)" />
    </svg>
  );
});
