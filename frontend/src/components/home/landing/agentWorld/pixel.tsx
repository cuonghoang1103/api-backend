/**
 * Pixel-art bằng SVG: vẽ từ lưới chữ, gộp các ô liền nhau trên một hàng thành một vệt ⇒ mỗi màu chỉ MỘT <path>.
 * `shape-rendering: crispEdges` giữ cạnh vuông ở mọi cỡ. Màu là biến CSS (đổi theo sáng/tối, theo mùa).
 *
 * Bảng màu: một ký tự ⇒ một hoặc nhiều lớp. Lớp `snow` chỉ hiện khi web đang ở chủ đề mùa đông
 * (`html[data-mua="dong"]`, xem agentWorld.css) — vì thế ô tuyết luôn vẽ CHỒNG lên một màu nền
 * (vd. 'S' = lá sáng + tuyết), tắt tuyết thì cây/mái vẫn liền.
 */
import type { CSSProperties } from 'react';

type Layer = string; // tên biến màu, vd. 'fol' ⇒ var(--aw-fol); 'snow' là lớp đặc biệt
export type Palette = Record<string, Layer | Layer[]>;

export interface PixelArt {
  w: number;
  h: number;
  layers: { layer: Layer; d: string }[];
}

export function pixelArt(rows: string[], palette: Palette): PixelArt {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const byLayer = new Map<Layer, string[]>();
  const order: Layer[] = [];
  for (const v of Object.values(palette)) {
    for (const l of Array.isArray(v) ? v : [v]) if (!order.includes(l)) order.push(l);
  }
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const pal = palette[ch];
      if (!pal) {
        x++;
        continue;
      }
      let run = 1;
      while (row[x + run] === ch) run++;
      for (const l of Array.isArray(pal) ? pal : [pal]) {
        if (!byLayer.has(l)) byLayer.set(l, []);
        byLayer.get(l)!.push(`M${x} ${y}h${run}v1h-${run}z`);
      }
      x += run;
    }
  });
  // Lớp tuyết luôn vẽ sau cùng để chồng lên màu nền của nó.
  const sorted = order.filter((l) => l !== 'snow').concat(order.includes('snow') ? ['snow'] : []);
  return { w, h, layers: sorted.filter((l) => byLayer.has(l)).map((l) => ({ layer: l, d: byLayer.get(l)!.join('') })) };
}

export function Pix({
  art,
  scale = 1,
  className = '',
  style,
}: {
  art: PixelArt;
  /** Bội số so với `--aw-px` (cỡ một "điểm ảnh" của làng). */
  scale?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`aw-pix ${className}`}
      viewBox={`0 0 ${art.w} ${art.h}`}
      shapeRendering="crispEdges"
      aria-hidden
      style={{
        width: `calc(${art.w * scale} * var(--aw-px))`,
        height: `calc(${art.h * scale} * var(--aw-px))`,
        ...style,
      }}
    >
      {art.layers.map(({ layer, d }) => (
        <path key={layer} d={d} className={`aw-c-${layer}`} />
      ))}
    </svg>
  );
}

/* ─── Cây thông: ba tầng, viền sáng bên trái (trăng ở bên trái), tuyết trên đỉnh mỗi tầng ─── */
export const PINE = pixelArt(
  [
    '......S......',
    '.....SaS.....',
    '....laaad....',
    '...laaaaad...',
    '.....SSS.....',
    '....SaaaS....',
    '...laaaaad...',
    '..laaaaaaad..',
    '....SSSSS....',
    '...SaaaaaS...',
    '..laaaaaaad..',
    '.laaaaaaaaad.',
    'laaaaaaaaaaad',
    '.....ttt.....',
    '.....ttt.....',
  ],
  { S: ['fol-l', 'snow'], l: 'fol-l', a: 'fol', d: 'fol-d', t: 'trunk' },
);

/* ─── Cây tròn nhỏ (bụi) ─── */
export const BUSH = pixelArt(
  ['..SSSS...', '.SllaaS..', 'Slaaaaad.', 'laaaaaadd', '.aaaaadd.'],
  { S: ['fol-l', 'snow'], l: 'fol-l', a: 'fol', d: 'fol-d' },
);

/* ─── Nhà gỗ: mái tam giác, ống khói, hai cửa sổ sáng ấm, cửa ra vào ─── */
export const CABIN = pixelArt(
  [
    '..........S.....cc...',
    '.........SrS....cc...',
    '........SrrrS...cc...',
    '.......SrrrrrS..cc...',
    '......SrrrrrrrS.cc...',
    '.....SrrrrrrrrrScc...',
    '....SrrrrrrrrrrrSc...',
    '...SrrrrrrrrrrrrrS...',
    '..SrrrrrrrrrrrrrrrS..',
    '.RRRRRRRRRRRRRRRRRRR.',
    '..wwwwwwwwwwwwwwwww..',
    '..wffffwwwDDDwwffffw.',
    '..wfyyfwwwDDDwwfyyfw.',
    '..xfyyfxxxDDDxxfyyfx.',
    '..wffffwwwDDkwwffffw.',
    '..wwwwwwwwDDDwwwwwww.',
    '..xxxxxxxxDDDxxxxxxx.',
  ],
  { S: ['roof', 'snow'], r: 'roof', R: 'roof-d', c: 'stone', w: 'wall', x: 'wall-d', f: 'frame', y: 'win', D: 'door', k: 'win' },
);

/* ─── Kho nhỏ (xưởng của Builder): mái bằng, cửa cuốn, tấm biển ─── */
export const SHED = pixelArt(
  [
    'SSSSSSSSSSSSSSS',
    'RRRRRRRRRRRRRRR',
    '.wwwwwwwwwwwww.',
    '.wbbbbbbbbbbbw.',
    '.wwwwwwwwwwwww.',
    '.wffffwgggggww.',
    '.wfyyfwgggggww.',
    '.wffffwgggggww.',
    '.xxxxxxgggggxx.',
  ],
  { S: ['roof', 'snow'], R: 'roof-d', w: 'wall', x: 'wall-d', b: 'sign', f: 'frame', y: 'win', g: 'stone' },
);

/* ─── Trăng: khuyết nhẹ bên phải, có hố ─── */
export const MOON = pixelArt(
  [
    '....mmmmm....',
    '..mmmmmmmmm..',
    '.mmmkmmmmmnn.',
    '.mmkkmmmmmmn.',
    'mmmmmmmmmkmnn',
    'mmmmmmmmmmmnn',
    'mmmmmmkkmmmnn',
    'mmmmmmkkmmmnn',
    'mmkmmmmmmmmnn',
    '.mmmmmmmmmnn.',
    '.mmmmmmmmmnn.',
    '..mmmmmmmnn..',
    '....mmmmn....',
  ],
  { m: 'moon', k: 'moon-k', n: 'moon-n' },
);

/* ─── Khinh khí cầu: sọc tím–hổ phách, giỏ mây, một hành khách gấu trúc tí hon ─── */
export const BALLOON = pixelArt(
  [
    '....ppoopp....',
    '..hppooppoop..',
    '.hhppooppoopp.',
    'hhppooppooppoo',
    'hppooppooppoop',
    'hppooppooppoop',
    'pppooppooppooo',
    '.ppooppooppoo.',
    '.ppooppooppoo.',
    '..pooppooppo..',
    '...ooppoopp...',
    '....q....q....',
    '....q....q....',
    '.....q..q.....',
    '.....WKKW.....',
    '....BWWWWB....',
    '....BBBBBB....',
    '.....BBBB.....',
  ],
  { p: 'bal-a', o: 'bal-b', h: 'bal-h', q: 'rope', W: 'panda-w', K: 'panda-k', B: 'basket' },
);

/* ─── Cột đèn ─── */
export const LAMP = pixelArt(
  ['.SSS.', 'PPPPP', 'PYYYP', 'PYYYP', 'PPPPP', '..P..', '..P..', '..P..', '..P..', '..P..', '..P..', '..P..', '..P..', '..P..', '..P..', '.PPP.', 'PPPPP'],
  { S: ['post', 'snow'], P: 'post', Y: 'lamp' },
);

/* ─── Đống lửa: đá + củi; ngọn lửa là hai khung (agentWorld.css đổi khung bằng steps()) ─── */
export const FIRE_BASE = pixelArt(
  ['..LL...LL..', '...LLLLL...', 'gg.LLLLL.gg', 'ggggggggggg'],
  { L: 'log', g: 'stone' },
);
export const FLAME_A = pixelArt(
  ['....a....', '...aa....', '...aba...', '..abbba..', '..abyba..', '.abbybba.', '.abyyyba.', '..abyba..'],
  { a: 'fire-a', b: 'fire-b', y: 'fire-c' },
);
export const FLAME_B = pixelArt(
  ['.....a...', '....aa...', '...aba...', '..abba...', '..abybaa.', '.abbyyba.', '.abyyyba.', '..abyba..'],
  { a: 'fire-a', b: 'fire-b', y: 'fire-c' },
);

/* ─── Biển chỉ đường gỗ ─── */
export const SIGN = pixelArt(
  ['SSSSSSSSS', 'bbbbbbbbb', 'bkkbkbkkb', 'bbbbbbbbb', '....P....', '....P....', '....P....', '...PPP...'],
  { S: ['sign', 'snow'], b: 'sign', k: 'sign-k', P: 'post' },
);

/* ─── Code Buddy: viên tròn màu mật ong có hai râu ăng-ten, ngồi gõ laptop (nhìn nghiêng 3/4 sang phải) ───
   Tay gõ phím + dòng code chạy trên màn hình là lớp riêng trong sprites.tsx (BuddySprite). */
export const BUDDY = pixelArt(
  [
    '.g........g...............',
    '.k........k...............',
    '..k......k................',
    '...LLLLLL.................',
    '..LLLLLLLLL...............',
    '.LLLaaaaaaaa..............',
    '.LLaaaaaaaaaa...ffffffffff',
    'LLaaaaaaaaaaaa..fssssssssf',
    'LaaaaaaIWaIWaa..fssssssssf',
    'LaaaaaaIIaIIaa..fssssssssf',
    'LaaaaapaaoaapaE.fssssssssf',
    'Laaabbbbbbaaa...fssssssssf',
    'Laabbbbbbbbaa...fssssssssf',
    '.aabbbbbbbbad...ffffffffff',
    '.daabbbbbbadd.mmmmmmmmmmmm',
    '..ddaaaaaadd..MMMMMMMMMMMM',
    '...dddddddd...............',
  ],
  {
    g: 'bud-g', k: 'bud-d', L: 'bud-l', a: 'bud-a', d: 'bud-d', b: 'bud-b', I: 'bud-eye', W: 'bud-glint',
    p: 'bud-p', o: 'bud-ink', E: 'bud-a', f: 'lap-f', s: 'lap-s', m: 'lap-m', M: 'lap-M',
  },
);
