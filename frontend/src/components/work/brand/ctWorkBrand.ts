/**
 * CT Work — NGUỒN SỰ THẬT DUY NHẤT của logo (10/10/2026).
 *
 * Mark "Flow Check": ba phần tử đi từ mờ tới đặc trên một ô squircle gradient tím → chàm → xanh —
 *   • chấm      = thẻ "To do" đang chờ (55%)
 *   • nét ngắn  = thẻ "In progress" (78%)
 *   • nét dài   = "Done" (100%)
 * ghép lại thành dấu tích: việc chảy qua bảng và về đích. Xem lý do chọn + cách dùng ở
 * frontend/public/images/ct-work/BRAND.md.
 *
 * Tệp này là TS thuần (không JSX, không phụ thuộc React/DOM) để dùng được ở cả hai nơi:
 *   - component React `CtWorkMark` (giao diện web + app desktop)
 *   - script dựng tệp tĩnh `frontend/scripts/ct-work-brand/build.mts` (chạy bằng tsx)
 * Đổi hình ở ĐÂY rồi chạy lại script — đừng sửa tay SVG/PNG trong public/images/ct-work.
 */
import { WORDMARK } from './wordmark';

/** Màu thương hiệu. `indigo` = `--w-accent` (sáng) của CT Work. */
export const CTW_COLORS = {
  violet: '#8a63ff',
  indigo: '#4f5bd5',
  azure: '#2299e0',
  /** Màu mực của chữ "CT Work" trên nền sáng / tối. */
  inkLight: '#16182d',
  inkDark: '#f4f5ff',
  /** Bóng của glyph — chàm rất tối, không dùng đen thuần (đen làm gradient bẩn). */
  shade: '#15124d',
} as const;

/** Lưới vẽ của mark: 64 × 64 đơn vị. */
export const MARK_GRID = 64;

/**
 * Squircle (siêu elip |x|^n + |y|^n = 1, n = 5 — gần dáng icon iOS hơn bo góc tròn thường), làm mượt bằng
 * Catmull-Rom → Bézier bậc ba. `inset` thu nhỏ về giữa (dùng cho icon app có chừa lề đổ bóng).
 */
export function squirclePath(size = MARK_GRID, inset = 0, n = 5, perQuadrant = 14): string {
  const a = size / 2 - inset;
  const c = size / 2;
  const pts: Array<[number, number]> = [];
  const total = perQuadrant * 4;
  for (let i = 0; i < total; i++) {
    const t = (i / total) * Math.PI * 2;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    pts.push([c + a * Math.sign(ct) * Math.abs(ct) ** (2 / n), c + a * Math.sign(st) * Math.abs(st) ** (2 / n)]);
  }
  const r = (v: number) => String(Math.round(v * 100) / 100);
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < total; i++) {
    const p0 = pts[(i - 1 + total) % total];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % total];
    const p3 = pts[(i + 2) % total];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return `${d}Z`;
}

/** Squircle 64 × 64 tính sẵn (component React dùng — khỏi tính lại mỗi lần vẽ). */
export const SQUIRCLE_64 = squirclePath();

export interface GlyphGeom {
  stroke: number;
  dot: { cx: number; cy: number; r: number; opacity: number } | null;
  short: { x1: number; y1: number; x2: number; y2: number; opacity: number };
  long: { x1: number; y1: number; x2: number; y2: number; opacity: number };
}

/** Glyph đầy đủ (≥ 28 px). */
export const GLYPH_FULL: GlyphGeom = {
  stroke: 9,
  dot: { cx: 18.4, cy: 19.6, r: 4.3, opacity: 0.55 },
  short: { x1: 17.6, y1: 33.6, x2: 27.2, y2: 43.2, opacity: 0.78 },
  long: { x1: 27.2, y1: 43.2, x2: 46, y2: 21.4, opacity: 1 },
};

/**
 * Glyph cỡ nhỏ (≤ 24 px — favicon, tab): bỏ chấm (ở 16 px nó chỉ là một hạt bụi), nét dày hơn và to hơn để dấu
 * tích vẫn đọc được trên thanh tab. Đây là "optical size", không phải hình khác.
 */
export const GLYPH_SMALL: GlyphGeom = {
  stroke: 11,
  dot: null,
  short: { x1: 15.5, y1: 33, x2: 26.5, y2: 44, opacity: 0.86 },
  long: { x1: 26.5, y1: 44, x2: 48, y2: 20, opacity: 1 },
};

export type MarkTheme = 'light' | 'dark';
export type MarkVariant = 'color' | 'mono' | 'glyph';

export interface MarkSvgOptions {
  /** color = ô gradient; mono = ô một màu, glyph khoét rỗng; glyph = chỉ glyph, một màu, không ô. */
  variant?: MarkVariant;
  /** Nền sẽ đặt lên — chỉnh viền sáng của ô cho tách khỏi nền tối. */
  theme?: MarkTheme;
  /** Cỡ hiển thị dự kiến; ≤ 24 dùng glyph cỡ nhỏ và bỏ hiệu ứng nổi. */
  px?: number;
  /** Ô vuông tràn viền (apple-touch-icon, PNG email, icon maskable) thay cho squircle. */
  fullBleed?: boolean;
  /** Màu cho bản mono/glyph (mặc định currentColor — SVG nhúng thẳng sẽ ăn màu chữ). */
  monoColor?: string;
  /** Tiền tố id (gradient/filter) — nhiều SVG nội tuyến trên cùng trang không được trùng id. */
  idPrefix?: string;
  /** Bỏ thẻ <svg> ngoài, chỉ trả phần thân (để lồng vào SVG lớn hơn). */
  bare?: boolean;
  /** Gắn class `ctw-mark-*` + pathLength=1 cho từng phần tử — để CSS (brand/ctWorkMark.css) làm logo động. */
  animatable?: boolean;
}

const f = (v: number) => String(Math.round(v * 100) / 100);

function glyphMarkup(g: GlyphGeom, fill: string, anim = false): string {
  const op = (o: number) => (o < 1 ? ` stroke-opacity="${o}"` : '');
  const cls = (name: string, line = true) => (anim ? ` class="ctw-mark-${name}"${line ? ' pathLength="1"' : ''}` : '');
  const dot = g.dot ? `<circle${cls('dot', false)} cx="${f(g.dot.cx)}" cy="${f(g.dot.cy)}" r="${f(g.dot.r)}" fill="${fill}" fill-opacity="${g.dot.opacity}"/>` : '';
  return (
    `${dot}<path${cls('short')} d="M${f(g.short.x1)} ${f(g.short.y1)}L${f(g.short.x2)} ${f(g.short.y2)}" stroke="${fill}" stroke-width="${g.stroke}" stroke-linecap="round"${op(g.short.opacity)}/>`
    + `<path${cls('long')} d="M${f(g.long.x1)} ${f(g.long.y1)}L${f(g.long.x2)} ${f(g.long.y2)}" stroke="${fill}" stroke-width="${g.stroke}" stroke-linecap="round"${op(g.long.opacity)}/>`
  );
}

/** Thân SVG của mark trong lưới 64 × 64. */
export function markBody(o: MarkSvgOptions = {}): string {
  const variant = o.variant ?? 'color';
  const theme = o.theme ?? 'light';
  const small = (o.px ?? 64) <= 24;
  const g = small ? GLYPH_SMALL : GLYPH_FULL;
  const id = o.idPrefix ?? 'ctw';
  // Squircle khai MỘT lần trong <defs>, các lớp (nền, sáng, tối, viền, clip) tham chiếu bằng <use> — tệp gọn ~3×.
  const shapeDef = o.fullBleed ? '' : `<path id="${id}-s" d="${SQUIRCLE_64}"/>`;
  const shape = o.fullBleed ? `<rect width="64" height="64"/>` : `<use href="#${id}-s"/>`;
  const shapeD = (attrs: string) => (o.fullBleed ? `<rect width="64" height="64" ${attrs}/>` : `<use href="#${id}-s" ${attrs}/>`);
  const mono = o.monoColor ?? 'currentColor';

  if (variant === 'glyph') return glyphMarkup(g, mono, o.animatable);
  if (variant === 'mono') {
    // Ô một màu, glyph khoét rỗng bằng mask. Chấm/nét ngắn vẽ đen có độ mờ ⇒ lỗ "nửa trong" — giữ được nhịp mờ → đặc.
    return `<defs>${shapeDef}<mask id="${id}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">${shapeD('fill="#fff"')}${glyphMarkup(g, '#000')}</mask></defs>`
      + `<g mask="url(#${id}-m)" fill="${mono}">${shape}</g>`;
  }

  const rim = theme === 'dark' ? 0.26 : 0.14;
  const defs = `<defs>${shapeDef}`
    + `<linearGradient id="${id}-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${CTW_COLORS.violet}"/><stop offset=".52" stop-color="${CTW_COLORS.indigo}"/><stop offset="1" stop-color="${CTW_COLORS.azure}"/></linearGradient>`
    + (small ? '' : `<radialGradient id="${id}-hl" cx="18" cy="6" r="52" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>`
      + `<linearGradient id="${id}-sd" x1="0" y1="34" x2="0" y2="64" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${CTW_COLORS.shade}" stop-opacity="0"/><stop offset="1" stop-color="${CTW_COLORS.shade}" stop-opacity=".22"/></linearGradient>`
      + `<filter id="${id}-gs" x="-30%" y="-30%" width="160%" height="170%" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="${CTW_COLORS.shade}" flood-opacity=".38"/></filter>`
      + (o.fullBleed ? '' : `<clipPath id="${id}-c"><use href="#${id}-s"/></clipPath>`))
    + `</defs>`;
  const layers = small
    ? shapeD(`fill="url(#${id}-bg)"`)
    : shapeD(`fill="url(#${id}-bg)"`) + shapeD(`fill="url(#${id}-hl)"`) + shapeD(`fill="url(#${id}-sd)"`)
      + (o.fullBleed ? '' : `<use href="#${id}-s" fill="none" stroke="#fff" stroke-opacity="${rim}" stroke-width="1.2"${o.animatable ? ' class="ctw-mark-rim"' : ''} clip-path="url(#${id}-c)"/>`);
  const glyph = small ? glyphMarkup(g, '#fff', o.animatable) : `<g filter="url(#${id}-gs)">${glyphMarkup(g, '#fff', o.animatable)}</g>`;
  return defs + layers + glyph;
}

/** SVG hoàn chỉnh của mark. */
export function markSvg(o: MarkSvgOptions = {}): string {
  const body = markBody(o);
  if (o.bare) return body;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">${body}</svg>`;
}

/**
 * Logo ngang: mark + chữ "CT Work". Chiều cao 64, chữ hoa cao 26 (≈ 40% mark), cách mark 16 (= ¼ mark).
 * `theme` quyết định màu chữ (mực tối trên nền sáng / gần trắng trên nền tối).
 */
export function logoSvg(o: { theme?: MarkTheme; variant?: MarkVariant; monoColor?: string; idPrefix?: string } = {}): { svg: string; width: number; height: number } {
  const theme = o.theme ?? 'light';
  const capPx = 26;
  const k = capPx / WORDMARK.capHeight;
  const gap = 16;
  const textW = WORDMARK.width * k;
  const width = Math.ceil(64 + gap + textW + 2);
  const baseline = 32 + capPx / 2;
  const ink = o.variant === 'mono' || o.variant === 'glyph' ? (o.monoColor ?? 'currentColor') : theme === 'dark' ? CTW_COLORS.inkDark : CTW_COLORS.inkLight;
  const mark = markBody({ variant: o.variant ?? 'color', theme, idPrefix: o.idPrefix ?? `ctw-${theme}`, monoColor: o.monoColor });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 64" width="${width}" height="64" fill="none">`
    + `<title>CT Work</title>${mark}`
    + `<path transform="translate(${f(64 + gap)} ${f(baseline)}) scale(${k.toFixed(6)})" fill="${ink}" d="${WORDMARK.d}"/></svg>`;
  return { svg, width, height: 64 };
}
