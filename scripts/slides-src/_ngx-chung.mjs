/**
 * _ngx-chung.mjs — khuôn slide khoá /courses/nginx (deck ngx-NN-M; 12/11/2026). KHÔNG chép CSS: import THẲNG khuôn chuẩn
 * (`_ts-chung.mjs` ← `_pg-chung.mjs`: dáng FU + logo CuongThai.com) + bộ hình của `_pr-chung.mjs` (ico/icards/cmp/hub/bars/tiers),
 * chỉ đổi mặc định khoa/duong/bieuTuong/khau sang Nginx và THÊM:
 *   ngc(src, opts)        — khối cấu hình nginx tô màu Dark+ (highlight.js 'nginx'; thêm màu cho .hljs-section/.hljs-attribute)
 *   tn(text, opts)        — terminal output THẬT (container ngx-lab: Ubuntu 24.04 · nginx/1.24.0)
 *   seq(lanes, msgs, o)   — sơ đồ trình tự (client ⇄ nginx ⇄ upstream; bắt tay TLS…) bằng SVG
 *   path(nodes, o)        — sơ đồ đường đi của MỘT request qua các chặng (có nhãn từng chặng, chặng được chọn tô đậm)
 *   meter(rows, o)        — thanh so sánh số đo (bọc bars của _pr-chung, mặc định màu nginx)
 * Output trên slide CHẠY THẬT (scratchpad/ngx/chay.py trong dự án video), đóng băng vào từng deck (DU_LIEU) — deck tự chứa.
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/ngx-NN-M.mjs --out <dir>
 *         node scripts/tst/kiem-slide.mjs scripts/slides-src/ngx-NN-M.mjs   ⇒ 0 slide có vấn đề
 * Ảnh lên R2 prefix NGX/v1 (deck dựng lại sau khi đẩy ⇒ NGX/v2 + VER trong content/courses/nginx/_slides.mjs).
 */
import * as G from './_ts-chung.mjs';
export * from './_ts-chung.mjs';
export { ico, icards, cmp, hub, bars, tiers } from './_pr-chung.mjs';
import { bars } from './_pr-chung.mjs';

export const MOI_TRUONG = 'nginx/1.24.0 · Ubuntu 24.04';
export const XANH = '#009639';
const MAC_DINH = { khoa: 'Nginx', duong: 'courses/nginx', bieuTuong: '🚦', khau: 'from one request to production' };

/** lamDeck của khuôn chuẩn với mặc định Nginx (meta vẫn đè được). */
export const lamDeck = (meta, items) => G.lamDeck({ ...MAC_DINH, ...meta }, items);

const esc = G.esc;
const CSS_NGX = `<style>.pg pre.vs .hljs-section{color:#c586c0}.pg pre.vs .hljs-attribute{color:#dcdcaa}.pg pre.vs .hljs-regexp{color:#d16969}.pg pre.vs .hljs-variable{color:#9cdcfe}</style>`;
/** Khối cấu hình nginx. opts: { sm, hl: [dòng 1-based] } — cùng dáng <pre class="vs"> với sql(). */
export const ngc = (src, opts = {}) => CSS_NGX + G.sql(src, { lang: 'nginx', ...opts });
/** Terminal output THẬT của khoá (như tc() của khuôn TS; tiêu đề = môi trường chạy). */
export const tn = (text, opts = {}) => G.tc(text, { title: `terminal — ${MOI_TRUONG}`, wrap: 100, ...opts });
/** Thanh số đo thật, màu nginx mặc định. */
export const meter = (rows, opts = {}) => bars(rows.map(([t, v, m, g]) => [t, v, m || XANH, g]), opts);

/**
 * Sơ đồ trình tự: lanes = ['Client', 'nginx', 'app :3000'] · msgs = [[từ, đến, 'nhãn', mau?, nét đứt?]] (chỉ số lane).
 * opts: { w=1110, rh=46 (cao mỗi thông điệp), fs=18, ghi: [[sau-msg-i, 'chú thích ở cột phải']] }
 */
export function seq(lanes, msgs, opts = {}) {
  const { w = 1110, rh = 46, fs = 18, top = 58 } = opts;
  const n = lanes.length, lx = (i) => 90 + i * ((w - 180) / (n - 1));
  const h = top + msgs.length * rh + 24;
  const mauDs = [...new Set(msgs.map((m) => m[3] || '#b85a2b'))];
  const mk = (m) => `sq${mauDs.indexOf(m)}`;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs>${mauDs.map((m, i) => `<marker id="sq${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`).join('')}</defs>`;
  lanes.forEach((t, i) => {
    const x = lx(i), bw = Math.max(120, t.length * 12 + 34);
    s += `<rect x="${x - bw / 2}" y="4" width="${bw}" height="40" rx="10" fill="${i === 1 ? '#e6f6ec' : '#f4f6f8'}" stroke="${i === 1 ? XANH : '#64748b'}" stroke-width="2.5"/>`;
    s += `<text x="${x}" y="31" text-anchor="middle" font-size="19" font-weight="800" fill="${i === 1 ? '#14532d' : '#334155'}">${esc(t)}</text>`;
    s += `<line x1="${x}" y1="46" x2="${x}" y2="${h - 6}" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 5"/>`;
  });
  msgs.forEach(([a, b, t, mau = '#b85a2b', dut = false], k) => {
    const y = top + k * rh + rh / 2, x1 = lx(a), x2 = lx(b);
    if (a === b) {
      s += `<path d="M${x1} ${y - 10} h46 v20 h-44" fill="none" stroke="${mau}" stroke-width="2.5" marker-end="url(#${mk(mau)})"/>`;
      s += `<text x="${x1 + 56}" y="${y + 6}" font-size="${fs}" fill="${mau}" font-weight="700">${esc(t)}</text>`;
      return;
    }
    s += `<line x1="${x1}" y1="${y + 8}" x2="${x2 + (x2 > x1 ? -4 : 4)}" y2="${y + 8}" stroke="${mau}" stroke-width="2.8"${dut ? ' stroke-dasharray="7 5"' : ''} marker-end="url(#${mk(mau)})"/>`;
    s += `<text x="${(x1 + x2) / 2}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${mau}">${esc(t)}</text>`;
  });
  return s + '</svg>';
}

/**
 * Đường đi của một request: nodes = [{ t, s?, mau?, on? }] trái → phải; `on: true` ⇒ chặng được chọn (đậm, viền dày).
 * nhan = ['nhãn trên mũi tên 0→1', …]. opts: { w=1110, h=170, fs=20 }
 */
export function path(nodes, opts = {}) {
  const { w = 1110, h = 170, fs = 20, nhan = [] } = opts;
  const n = nodes.length, gap = 64, bw = (w - gap * (n - 1)) / n;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="pa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  nodes.forEach((it, i) => {
    const x = i * (bw + gap), m = it.mau || (it.on ? XANH : '#475569'), y0 = h / 2 - 50;
    s += `<rect x="${x + 2}" y="${y0}" width="${bw - 4}" height="100" rx="14" fill="${m}${it.on ? '22' : '10'}" stroke="${m}" stroke-width="${it.on ? 4 : 2.2}"/>`;
    s += `<text x="${x + bw / 2}" y="${h / 2 - (it.s ? 6 : -7)}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${m}">${esc(it.t)}</text>`;
    if (it.s) s += `<text x="${x + bw / 2}" y="${h / 2 + 24}" text-anchor="middle" font-size="${fs - 4}" fill="#555">${esc(it.s)}</text>`;
    if (i < n - 1) {
      s += `<line x1="${x + bw + 2}" y1="${h / 2}" x2="${x + bw + gap - 4}" y2="${h / 2}" stroke="#b85a2b" stroke-width="3" marker-end="url(#pa)"/>`;
      if (nhan[i]) s += `<text x="${x + bw + gap / 2}" y="${h / 2 - 14}" text-anchor="middle" font-size="15" fill="#8a3d12" font-weight="700">${esc(nhan[i])}</text>`;
    }
  });
  return s + '</svg>';
}

/**
 * Cây cha → con (SVG): goc = { t, s?, mau? } ở trên, con = [{ t, s?, mau? }] một hàng bên dưới, nối bằng đường gấp khúc.
 * Dùng cho cây tiến trình (master → worker), cây ngữ cảnh cấu hình (http → server → location)… opts: { w=560, h=300, fs=19 }
 */
export function cay(goc, con, opts = {}) {
  const { w = 560, h = 300, fs = 19 } = opts;
  const n = con.length, gap = 14, bw = (w - gap * (n - 1)) / n, bh = 76, gw = Math.min(w * 0.6, 300);
  const gx = (w - gw) / 2, yC = h - bh - 4;
  const m0 = goc.mau || '#b85a2b';
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<rect x="${gx}" y="4" width="${gw}" height="${bh}" rx="12" fill="${m0}18" stroke="${m0}" stroke-width="3"/>`;
  s += `<text x="${w / 2}" y="${goc.s ? 36 : 50}" text-anchor="middle" font-size="${fs + 2}" font-weight="800" fill="${m0}">${esc(goc.t)}</text>`;
  if (goc.s) s += `<text x="${w / 2}" y="62" text-anchor="middle" font-size="${fs - 3}" fill="#555">${esc(goc.s)}</text>`;
  const yM = (bh + 4 + yC) / 2;
  s += `<line x1="${w / 2}" y1="${bh + 4}" x2="${w / 2}" y2="${yM}" stroke="#94a3b8" stroke-width="2.5"/>`;
  con.forEach((k, i) => {
    const x = i * (bw + gap), m = k.mau || '#336791', cx = x + bw / 2;
    s += `<polyline points="${w / 2},${yM} ${cx},${yM} ${cx},${yC}" fill="none" stroke="#94a3b8" stroke-width="2.5"/>`;
    s += `<rect x="${x + 1}" y="${yC}" width="${bw - 2}" height="${bh}" rx="12" fill="${m}12" stroke="${m}" stroke-width="2.5"/>`;
    s += `<text x="${cx}" y="${yC + (k.s ? 32 : 46)}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${m}">${esc(k.t)}</text>`;
    if (k.s) s += `<text x="${cx}" y="${yC + 58}" text-anchor="middle" font-size="${fs - 4}" fill="#555">${esc(k.s)}</text>`;
  });
  return s + '</svg>';
}
