/**
 * Vở viết tay (iPad) — "AI vẽ bằng nét".
 * ─────────────────────────────────────────────────────────────────────
 * Người học gõ "con mèo ngồi" hay "chu trình nước" → app vẽ từng nét lên
 * trang như có người cầm bút vẽ. Nét đó là PKStroke thật: tẩy, sửa, đổi màu
 * được như nét của chính người dùng.
 *
 * Vì sao đi đường SVG chứ không sinh ảnh: khoá của cổng KHÔNG sinh được ảnh
 * (403 "Image generation is not enabled for this group", đo 17/08/2026), và
 * một ảnh dán lên trang thì không tẩy được từng nét. Model viết SVG nét đơn
 * rất tốt — đo 28/09/2026 cùng một đề: `gpt-6-sol` vẽ mèo cân đối, dễ thương;
 * `claude-sonnet-5` vẽ mèo như cái hộp và chu trình nước rời rạc. Nên việc
 * này ghim `gpt-6-sol` (xem `ve_net` trong `gateway.ts`).
 *
 * Máy chủ đổi SVG ra MẢNG ĐIỂM: app iPad chỉ việc nối điểm thành nét, không
 * phải mang theo bộ đọc SVG (cung tròn, Bézier, toạ độ tương đối…).
 */
import { llmComplete, checkTokenQuota, isAiAvailable } from './interview/llm/index.js';
import { AppError, BadRequestError } from '../middleware/errorHandler.js';

type Diem = [number, number];

const KIEU = {
  hinh: 'Vẽ minh hoạ dễ thương, tối giản, rõ hình, đúng tỉ lệ — như người vẽ tay giỏi phác nhanh bằng bút bi.',
  sodo: 'Vẽ SƠ ĐỒ HỌC TẬP rõ ràng như trong vở ghi của học sinh giỏi: khối, mũi tên chỉ hướng, trục, hình học chính xác. Chừa khoảng trống cạnh mỗi bộ phận để người học tự viết nhãn.',
} as const;
export type KieuVe = keyof typeof KIEU;

const SYSTEM = (kieu: KieuVe) => [
  'Bạn là họa sĩ vẽ NÉT (line art) bằng bút mực trong vở học sinh.',
  'Trả về DUY NHẤT một thẻ <svg viewBox="0 0 1000 1000"> chỉ gồm <path d>, <circle>, <ellipse>, <line>, <polyline>, <polygon>, <rect>.',
  'Không fill, không màu, không <text>, không gradient, không transform, không <g> lồng transform.',
  'Mỗi phần tử là MỘT nét bút liền. 15–70 nét. Dùng Bézier (C, Q) cho đường cong mềm.',
  KIEU[kieu],
  'Sau thẻ </svg>, viết MỘT dòng bắt đầu bằng "NHAN:" liệt kê các bộ phận nên ghi nhãn (tiếng Việt, cách nhau dấu ·), hoặc "NHAN:" trống nếu là tranh.',
].join('\n');

// ── Đọc SVG ────────────────────────────────────────────────────────────

const soTrong = (s: string) => (s.match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) ?? []).map(Number);
const thuocTinh = (the: string, ten: string) => {
  const m = the.match(new RegExp(`\\s${ten}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : undefined;
};
const so = (the: string, ten: string, macDinh = 0) => {
  const v = thuocTinh(the, ten);
  const n = v === undefined ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : macDinh;
};

function elip(cx: number, cy: number, rx: number, ry: number): Diem[] {
  const n = Math.max(24, Math.min(96, Math.round((rx + ry) / 4)));
  const d: Diem[] = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    d.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
  }
  return d;
}

function bezier(p0: Diem, p1: Diem, p2: Diem, p3: Diem): Diem[] {
  const dai = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    + Math.hypot(p3[0] - p2[0], p3[1] - p2[1]);
  const n = Math.max(4, Math.min(64, Math.round(dai / 6)));
  const d: Diem[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n, u = 1 - t;
    d.push([
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]);
  }
  return d;
}

/** Cung tròn SVG (A) → điểm, theo công thức đổi tham số đầu-cuối → tâm của W3C. */
function cung(p0: Diem, rx: number, ry: number, goc: number, lon: number, chieu: number, p: Diem): Diem[] {
  if (!rx || !ry) return [p];
  rx = Math.abs(rx); ry = Math.abs(ry);
  const phi = (goc * Math.PI) / 180, c = Math.cos(phi), s = Math.sin(phi);
  const dx = (p0[0] - p[0]) / 2, dy = (p0[1] - p[1]) / 2;
  const x1 = c * dx + s * dy, y1 = -s * dx + c * dy;
  const lam = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const tu = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1;
  const mau = rx * rx * y1 * y1 + ry * ry * x1 * x1;
  const k = (lon === chieu ? -1 : 1) * Math.sqrt(Math.max(0, tu / mau));
  const cx1 = (k * rx * y1) / ry, cy1 = (-k * ry * x1) / rx;
  const cx = c * cx1 - s * cy1 + (p0[0] + p[0]) / 2, cy = s * cx1 + c * cy1 + (p0[1] + p[1]) / 2;
  const gocVec = (ux: number, uy: number, vx: number, vy: number) =>
    Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = gocVec(1, 0, (x1 - cx1) / rx, (y1 - cy1) / ry);
  let dt = gocVec((x1 - cx1) / rx, (y1 - cy1) / ry, (-x1 - cx1) / rx, (-y1 - cy1) / ry);
  if (!chieu && dt > 0) dt -= 2 * Math.PI;
  if (chieu && dt < 0) dt += 2 * Math.PI;
  const n = Math.max(6, Math.min(72, Math.round((Math.abs(dt) * (rx + ry)) / 12)));
  const d: Diem[] = [];
  for (let i = 1; i <= n; i++) {
    const t = t1 + (dt * i) / n;
    const ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    d.push([c * ex - s * ey + cx, s * ex + c * ey + cy]);
  }
  return d;
}

/** Một thuộc tính `d` → các nét (mỗi lệnh M mới là một nét mới). */
export function docPath(d: string): Diem[][] {
  const lenh = d.match(/[a-df-z][^a-df-z]*/gi) ?? [];
  const cacNet: Diem[][] = [];
  let net: Diem[] = [];
  let cur: Diem = [0, 0], dau: Diem = [0, 0];
  let dkTruoc: Diem | null = null, lenhTruoc = '';
  const xong = () => { if (net.length > 1) cacNet.push(net); net = []; };

  for (const l of lenh) {
    const ma = l[0], hoa = ma.toUpperCase(), tuongDoi = ma !== hoa;
    const a = soTrong(l.slice(1));
    const ab = (x: number, y: number): Diem => (tuongDoi ? [cur[0] + x, cur[1] + y] : [x, y]);
    let i = 0;
    const con = (n: number) => i + n <= a.length;
    if (hoa === 'Z') {
      if (net.length) net.push([...dau] as Diem);
      cur = [...dau] as Diem; xong(); lenhTruoc = 'Z'; continue;
    }
    // Lặp theo nhóm tham số: "L 1 2 3 4" là hai đoạn thẳng.
    do {
      if (hoa === 'M' && con(2)) {
        xong(); cur = ab(a[i], a[i + 1]); dau = cur; net = [cur]; i += 2;
        // Cặp toạ độ tiếp sau M là L ngầm.
        while (con(2)) { cur = ab(a[i], a[i + 1]); net.push(cur); i += 2; }
      } else if (hoa === 'L' && con(2)) {
        cur = ab(a[i], a[i + 1]); net.push(cur); i += 2;
      } else if (hoa === 'H' && con(1)) {
        cur = [tuongDoi ? cur[0] + a[i] : a[i], cur[1]]; net.push(cur); i += 1;
      } else if (hoa === 'V' && con(1)) {
        cur = [cur[0], tuongDoi ? cur[1] + a[i] : a[i]]; net.push(cur); i += 1;
      } else if (hoa === 'C' && con(6)) {
        const p1 = ab(a[i], a[i + 1]), p2 = ab(a[i + 2], a[i + 3]), p3 = ab(a[i + 4], a[i + 5]);
        if (!net.length) net = [cur];
        net.push(...bezier(cur, p1, p2, p3)); dkTruoc = p2; cur = p3; i += 6;
      } else if (hoa === 'S' && con(4)) {
        const p1: Diem = dkTruoc && 'CS'.includes(lenhTruoc) ? [2 * cur[0] - dkTruoc[0], 2 * cur[1] - dkTruoc[1]] : cur;
        const p2 = ab(a[i], a[i + 1]), p3 = ab(a[i + 2], a[i + 3]);
        if (!net.length) net = [cur];
        net.push(...bezier(cur, p1, p2, p3)); dkTruoc = p2; cur = p3; i += 4;
      } else if (hoa === 'Q' && con(4)) {
        const q = ab(a[i], a[i + 1]), p3 = ab(a[i + 2], a[i + 3]);
        const p1: Diem = [cur[0] + (2 / 3) * (q[0] - cur[0]), cur[1] + (2 / 3) * (q[1] - cur[1])];
        const p2: Diem = [p3[0] + (2 / 3) * (q[0] - p3[0]), p3[1] + (2 / 3) * (q[1] - p3[1])];
        if (!net.length) net = [cur];
        net.push(...bezier(cur, p1, p2, p3)); dkTruoc = q; cur = p3; i += 4;
      } else if (hoa === 'T' && con(2)) {
        const q: Diem = dkTruoc && 'QT'.includes(lenhTruoc) ? [2 * cur[0] - dkTruoc[0], 2 * cur[1] - dkTruoc[1]] : cur;
        const p3 = ab(a[i], a[i + 1]);
        const p1: Diem = [cur[0] + (2 / 3) * (q[0] - cur[0]), cur[1] + (2 / 3) * (q[1] - cur[1])];
        const p2: Diem = [p3[0] + (2 / 3) * (q[0] - p3[0]), p3[1] + (2 / 3) * (q[1] - p3[1])];
        if (!net.length) net = [cur];
        net.push(...bezier(cur, p1, p2, p3)); dkTruoc = q; cur = p3; i += 2;
      } else if (hoa === 'A' && con(7)) {
        const p = ab(a[i + 5], a[i + 6]);
        if (!net.length) net = [cur];
        net.push(...cung(cur, a[i], a[i + 1], a[i + 2], a[i + 3], a[i + 4], p)); cur = p; i += 7;
      } else break;
      lenhTruoc = hoa;
    } while (i < a.length);
    if (!'CSQT'.includes(hoa)) dkTruoc = null;
  }
  xong();
  return cacNet;
}

/** Cả thẻ <svg> → các nét, theo thứ tự model đã vẽ (thứ tự đó là thứ tự "vẽ ra"). */
export function docSvg(svg: string): Diem[][] {
  const kq: Diem[][] = [];
  for (const m of svg.matchAll(/<(path|circle|ellipse|line|polyline|polygon|rect)\b[^>]*>/gi)) {
    const the = m[0], loai = m[1].toLowerCase();
    if (loai === 'path') kq.push(...docPath(thuocTinh(the, 'd') ?? ''));
    else if (loai === 'circle') { const r = so(the, 'r'); if (r > 0) kq.push(elip(so(the, 'cx'), so(the, 'cy'), r, r)); }
    else if (loai === 'ellipse') { const rx = so(the, 'rx'), ry = so(the, 'ry'); if (rx > 0 && ry > 0) kq.push(elip(so(the, 'cx'), so(the, 'cy'), rx, ry)); }
    else if (loai === 'line') kq.push([[so(the, 'x1'), so(the, 'y1')], [so(the, 'x2'), so(the, 'y2')]]);
    else if (loai === 'rect') {
      const x = so(the, 'x'), y = so(the, 'y'), w = so(the, 'width'), h = so(the, 'height');
      if (w > 0 && h > 0) kq.push([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]);
    } else {
      const s = soTrong(thuocTinh(the, 'points') ?? '');
      const d: Diem[] = [];
      for (let i = 0; i + 1 < s.length; i += 2) d.push([s[i], s[i + 1]]);
      if (loai === 'polygon' && d.length) d.push([...d[0]] as Diem);
      if (d.length > 1) kq.push(d);
    }
  }
  return kq.filter((n) => n.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
}

/** Bỏ điểm thừa trên đoạn gần thẳng (Ramer–Douglas–Peucker) — nhẹ gói gửi về máy. */
function gon(d: Diem[], eps = 1.2): Diem[] {
  if (d.length < 3) return d;
  const [a, b] = [d[0], d[d.length - 1]];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  // ⚠️ Nét KHÉP KÍN (vòng tròn, đám mây, mọi path kết thúc bằng Z) có đầu
  // trùng cuối ⇒ "khoảng cách tới đoạn đầu–cuối" bằng 0 với mọi điểm và cả
  // nét sụp thành một chấm. Đo thật 28/09: mặt trời và viền tế bào biến mất.
  // Cắt đôi ở điểm xa đầu nhất rồi lược từng nửa.
  if (L < 1) {
    let xa = -1, iXa = 1;
    for (let i = 1; i < d.length - 1; i++) {
      const kc = Math.hypot(d[i][0] - a[0], d[i][1] - a[1]);
      if (kc > xa) { xa = kc; iXa = i; }
    }
    if (xa < 1) return [a, b];
    return [...gon(d.slice(0, iXa + 1), eps).slice(0, -1), ...gon(d.slice(iXa), eps)];
  }
  let xa = -1, iMax = 0;
  for (let i = 1; i < d.length - 1; i++) {
    const kc = Math.abs((b[0] - a[0]) * (a[1] - d[i][1]) - (a[0] - d[i][0]) * (b[1] - a[1])) / L;
    if (kc > xa) { xa = kc; iMax = i; }
  }
  if (xa <= eps) return [a, b];
  return [...gon(d.slice(0, iMax + 1), eps).slice(0, -1), ...gon(d.slice(iMax), eps)];
}

/** SVG → nét đã co về khung 1000 theo cạnh dài và lược điểm. `null` nếu không có nét nào. */
export function hauXuLy(svg: string) {
  const cacNet = docSvg(svg).slice(0, 160);
  if (!cacNet.length) return null;

  // Co về khung thật của nét (model hay chừa lề lệch một bên), giữ tỉ lệ.
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const n of cacNet) for (const [x, y] of n) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  const rong = Math.max(1, x1 - x0), cao = Math.max(1, y1 - y0);
  const tl = 1000 / Math.max(rong, cao);
  const lam = (v: number) => Math.round(v * 10) / 10;
  const net = cacNet.map((n) => gon(n.map(([x, y]) => [(x - x0) * tl, (y - y0) * tl] as Diem))
    .map(([x, y]) => [lam(x), lam(y)] as Diem));

  return { net, rong: lam(rong * tl), cao: lam(cao * tl) };
}

// ── Việc chính ─────────────────────────────────────────────────────────

export async function veBangNet(userId: number, b: { de?: unknown; kieu?: unknown }) {
  const de = String(b.de ?? '').trim().slice(0, 300);
  if (de.length < 2) throw new BadRequestError('Bạn muốn vẽ gì?');
  const kieu: KieuVe = b.kieu === 'sodo' ? 'sodo' : 'hinh';

  if (!isAiAvailable()) throw new BadRequestError('Tính năng AI chưa được cấu hình hoặc đang tạm ngắt.', 'AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) {
    throw new AppError('Đã hết hạn mức AI hôm nay. Thử lại vào ngày mai.', 429, 'QUOTA_EXCEEDED');
  }

  const kq = await llmComplete({
    step: 'generation',
    feature: 'chat',
    purpose: 've_net',
    userId,
    system: SYSTEM(kieu),
    messages: [{ role: 'user', content: `Vẽ: ${de}` }],
    // Đo 28/09: một bức 20–35 nét ≈ 1.200–2.200 token ra. 7.000 đủ cho bức
    // dày nhất mà không để một lượt lạc đề đốt vô hạn.
    maxTokens: 7000,
    maxRetries: 1,
    timeoutMs: 120_000,
  });
  const chu = kq?.text ?? '';
  const svg = chu.match(/<svg[\s\S]*?<\/svg>/i)?.[0];
  if (!svg) throw new AppError('AI chưa vẽ được hình này — thử mô tả khác một chút.', 502, 'VE_RONG');

  const hinh = hauXuLy(svg);
  if (!hinh) throw new AppError('AI chưa vẽ được hình này — thử mô tả khác một chút.', 502, 'VE_RONG');

  // Tranh thì không cần nhãn. Sơ đồ thì lọc ký tự lạ: đo 28/09 có lượt model
  // dán đuôi chữ Kirin vào nhãn ("chânацарт").
  const nhan = kieu === 'hinh' ? [] : (chu.match(/NHAN:\s*(.*)/)?.[1] ?? '')
    .split('·')
    .map((s) => s.replace(/[^\p{Script=Latin}\p{N}\s()\-–,/]/gu, '').trim())
    .filter((s) => s.length > 1)
    .slice(0, 12);

  return { ...hinh, nhan, model: kq.model,
    ...(process.env.VO_VE_DEBUG ? { svg } : {}) };
}
