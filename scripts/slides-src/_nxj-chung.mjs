/**
 * _nxj-chung.mjs — khuôn slide khoá /courses/nextjs (deck nxj-NN-M; 13/11/2026). KHÔNG chép CSS: import THẲNG khuôn chuẩn
 * (`_ts-chung.mjs` ← `_pg-chung.mjs`: dáng FU + logo CuongThai.com) + bộ hình của `_pr-chung.mjs` (ico/icards/cmp/hub/bars/tiers),
 * đổi mặc định khoa/duong/bieuTuong/khau sang Next.js và THÊM:
 *   tsx(src, opts)          — mã TS/TSX/JSX tô màu Dark+ (highlight.js 'typescript' — hiểu JSX; thêm màu thẻ/thuộc tính kiểu VS Code)
 *   tn(text, opts)          — terminal output THẬT (Mac · Node 22.23.3 · Next.js 16.4.6, dự án ~/.rtq-nxj/lab của dự án video)
 *   br(deck, ten, opts)     — ảnh TRÌNH DUYỆT THẬT (Playwright, scratchpad/nxj/anh.mjs ⇒ _nxj-anh/<deck>/<ten>.webp) trong khung trình duyệt,
 *                             nhúng data URI (deck tự chứa). opts: { url, h (cắt cao, px CSS), vp: 1280, mark: [[x,y,w,h,'nhãn'], …] (px CSS) }
 *   tree(dong, opts)        — cây thư mục dự án (📁/📄, thụt bằng 2 cách; dòng bắt đầu '*' ⇒ tô sáng)
 *   seq / path / cay        — sơ đồ trình tự / đường đi / cây cha-con (chép từ _ngx-chung, màu Next.js)
 * Output trên slide CHẠY THẬT (scratchpad/nxj/chay.py), đóng băng vào từng deck (DU_LIEU) — deck tự chứa.
 * Render: node scripts/_render-slides.mjs --deck scripts/slides-src/nxj-NN-M.mjs --out <dir>
 *         node scripts/tst/kiem-slide.mjs scripts/slides-src/nxj-NN-M.mjs   ⇒ 0 slide có vấn đề
 * Ảnh lên R2 prefix NXJ/v1 (deck dựng lại sau khi đẩy ⇒ NXJ/v2 + VER trong content/courses/nextjs/_slides.mjs).
 */
import fs from 'node:fs';
import * as G from './_ts-chung.mjs';
export * from './_ts-chung.mjs';
export { ico, icards, cmp, hub, bars, tiers } from './_pr-chung.mjs';
import { bars } from './_pr-chung.mjs';

export const MOI_TRUONG = 'Next.js 16.4.6 · Node 22.23.3';
export const XANH = '#0070f3';
const DEN = '#111827';
const MAC_DINH = { khoa: 'Next.js', duong: 'courses/nextjs', bieuTuong: '▲', khau: 'the React framework, from zero to production' };

/** lamDeck của khuôn chuẩn với mặc định Next.js (meta vẫn đè được). */
export const lamDeck = (meta, items) => G.lamDeck({ ...MAC_DINH, ...meta }, items);

const esc = G.esc;
const CSS_NXJ = `<style>.pg pre.vs .hljs-tag{color:#808080}.pg pre.vs .hljs-name{color:#4ec9b0}.pg pre.vs .hljs-attr{color:#9cdcfe}.pg pre.vs .hljs-subst{color:#d4d4d4}.pg pre.vs .hljs-selector-class,.pg pre.vs .hljs-selector-tag{color:#d7ba7d}.pg pre.vs .hljs-property{color:#9cdcfe}` +
  `.pg .br{border-radius:12px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 10px 26px -14px rgba(15,23,42,.45);background:#fff}` +
  `.pg .br .bt{height:30px;background:#dfe3ea;display:flex;align-items:center;gap:7px;padding:0 12px}.pg .br .bt i{width:11px;height:11px;border-radius:6px;display:inline-block}` +
  `.pg .br .bu{flex:1;margin-left:10px;height:22px;border-radius:11px;background:#fff;font:15px/22px Consolas,monospace;color:#0f172a;padding:0 12px;white-space:nowrap;overflow:hidden}` +
  `.pg .br .bv{position:relative;overflow:hidden}.pg .br .bv img{display:block;width:100%}.pg .br .mk{position:absolute;border:3px solid #e0590b;border-radius:8px;box-shadow:0 0 0 4px rgba(224,89,11,.18)}` +
  `.pg .br .mk b{position:absolute;left:-3px;top:-30px;background:#e0590b;color:#fff;font:700 15px/24px Arial;padding:0 8px;border-radius:6px;white-space:nowrap}` +
  `.pg .tree{font:20px/1.5 Consolas,monospace;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:12px 18px;color:#1e293b}.pg .tree .d{display:block;white-space:pre}.pg .tree .d.on{background:#fff4c2;border-radius:6px}.pg .tree .c{color:#6a9955;font-style:italic}</style>`;

/** Mã TS/TSX/JSX (Dark+). opts như sql(): { sm, hl: [dòng 1-based] } */
export const tsx = (src, opts = {}) => CSS_NXJ + G.sql(src, { lang: 'typescript', ...opts });
/** Mã CSS (Dark+). */
export const css = (src, opts = {}) => CSS_NXJ + G.sql(src, { lang: 'css', ...opts });
/** Terminal output THẬT của khoá (như tc() của khuôn TS; tiêu đề = môi trường chạy). */
export const tn = (text, opts = {}) => G.tc(text, { title: `terminal — ${MOI_TRUONG}`, wrap: 100, ...opts });
/** Thanh số đo thật, màu Next mặc định. */
export const meter = (rows, opts = {}) => bars(rows.map(([t, v, m, g]) => [t, v, m || XANH, g]), opts);

const ANH = new URL('./_nxj-anh/', import.meta.url).pathname;
/** Ảnh trình duyệt THẬT (Playwright) trong khung trình duyệt. h = chiều cao CẮT (px CSS của viewport), w = bề rộng hiển thị (px slide). */
export function br(deck, ten, opts = {}) {
  const { url = 'localhost:3000', vp = 1280, h = 560, w = 1110, mark = [] } = opts;
  const p = `${ANH}${deck}/${ten}.webp`;
  if (!fs.existsSync(p)) throw new Error(`thiếu ảnh trình duyệt ${p} (chạy scratchpad/nxj/anh.mjs)`);
  const k = w / vp;
  const src = `data:image/webp;base64,${fs.readFileSync(p).toString('base64')}`;
  return CSS_NXJ + `<div class="br" style="width:${w}px"><div class="bt"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i><span class="bu">${esc(url)}</span></div>` +
    `<div class="bv" style="height:${Math.round(h * k)}px"><img src="${src}">` +
    mark.map(([x, y, mw, mh, t]) => `<div class="mk" style="left:${Math.round(x * k) - 4}px;top:${Math.round(y * k) - 4}px;width:${Math.round(mw * k) + 8}px;height:${Math.round(mh * k) + 8}px">${t ? `<b>${esc(t)}</b>` : ''}</div>`).join('') + `</div></div>`;
}
/** Cây thư mục: dong = ['my-app/', '  src/', '*    page.tsx   // route "/"', …] — '*' đầu dòng ⇒ tô sáng; '//' ⇒ chú thích xanh rêu. */
export function tree(dong, opts = {}) {
  const { fs: co } = opts;
  return CSS_NXJ + `<div class="tree"${co ? ` style="font-size:${co}px"` : ''}>` + dong.map((l) => {
    const on = l.startsWith('*'); const s = on ? l.slice(1) : l;
    const [a, b] = s.split(/\s\/\/\s?/);
    const ten = a.replace(/(\S+\/)$/, '📁 $1').replace(/^(\s*)([^\s📁][^\s]*\.[\w]+)/, '$1📄 $2');
    return `<span class="d${on ? ' on' : ''}">${esc(ten)}${b ? `<span class="c">  // ${esc(b)}</span>` : ''}</span>`;
  }).join('') + `</div>`;
}

export function seq(lanes, msgs, opts = {}) {
  const { w = 1110, rh = 46, fs = 18, top = 58 } = opts;
  const le = Math.max(90, ...lanes.map((t) => (Math.max(120, t.length * 12 + 34)) / 2 + 6));
  const n = lanes.length, lx = (i) => le + i * ((w - 2 * le) / (n - 1));
  const h = top + msgs.length * rh + 24;
  const mauDs = [...new Set(msgs.map((m) => m[3] || '#b85a2b'))];
  const mk = (m) => `sq${mauDs.indexOf(m)}`;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs>${mauDs.map((m, i) => `<marker id="sq${i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${m}"/></marker>`).join('')}</defs>`;
  lanes.forEach((t, i) => {
    const x = lx(i), bw = Math.max(120, t.length * 12 + 34);
    s += `<rect x="${x - bw / 2}" y="4" width="${bw}" height="40" rx="10" fill="${i === 1 ? '#eaf3ff' : '#f4f6f8'}" stroke="${i === 1 ? XANH : '#64748b'}" stroke-width="2.5"/>`;
    s += `<text x="${x}" y="31" text-anchor="middle" font-size="19" font-weight="800" fill="${i === 1 ? '#0b1d3a' : '#334155'}">${esc(t)}</text>`;
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

/**
 * Dòng thời gian THẬT (đo bằng log có mili-giây): rows = [[nhãn, bắt đầu ms, kết thúc ms, màu?, ghi?]] — thanh đặt đúng chỗ bắt đầu,
 * trục ms ở dưới (vạch mỗi `buoc` ms). Dùng cho waterfall vs song song, streaming (byte đầu ↔ nội dung). (thêm 13/11, Chương 10)
 * opts: { w=1110, rh=44, nhan=300, fs=18, max (ms, mặc định = kết thúc lớn nhất), buoc=100, don='ms' }
 */
export function gantt(rows, opts = {}) {
  const { w = 1110, rh = 44, nhan = 300, fs = 18, buoc = 100, don = 'ms' } = opts;
  const max = opts.max ?? Math.max(...rows.map((r) => r[2]));
  const bw = w - nhan - 30, X = (t) => nhan + (t / max) * bw, h = rows.length * rh + 40;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  for (let t = 0; t <= max + 0.5; t += buoc) s += `<line x1="${X(t)}" y1="0" x2="${X(t)}" y2="${h - 30}" stroke="#e2e8f0" stroke-width="1.5"/><text x="${X(t)}" y="${h - 10}" text-anchor="middle" font-size="${fs - 4}" fill="#64748b">${t}${t === 0 ? '' : ''}</text>`;
  s += `<text x="${w - 4}" y="${h - 10}" text-anchor="end" font-size="${fs - 4}" fill="#64748b">${don}</text>`;
  rows.forEach(([t, a, b, mau = XANH, ghi = ''], i) => {
    const y = 4 + i * rh;
    s += `<text x="${nhan - 12}" y="${y + rh / 2 + 6}" text-anchor="end" font-size="${fs}" fill="#262626">${esc(t)}</text>`;
    s += `<rect x="${X(a)}" y="${y + 7}" width="${Math.max(4, X(b) - X(a))}" height="${rh - 16}" rx="5" fill="${mau}"/>`;
    const vua = X(b) + 10 + ghi.length * (fs - 2) * 0.56 <= w;   // chữ ghi vừa bên phải thanh? không ⇒ ghi TRONG thanh (chữ trắng, căn phải)
    if (ghi) s += `<text x="${vua ? X(b) + 8 : X(b) - 10}" y="${y + rh / 2 + 6}" text-anchor="${vua ? 'start' : 'end'}" font-size="${fs - 2}" font-weight="700" fill="${vua ? mau : '#fff'}">${esc(ghi)}</text>`;
  });
  return s + '</svg>';
}

/** Slide "Không học suông" (luật 14/11/2026): 4 thẻ 2×2 — đời thật · nếu… thì sao · góc kẻ xấu · nhận ra & phòng.
 *  o = { doi, neu, xau, phong }, mỗi thẻ [emoji, tiêu đề, [dòng…]]. Mỗi thẻ là .card ⇒ toạ độ card#0…3. */
export function thucTe4(o) {
  const KIEU = [['Real life', '#2563eb', '#eff6ff'], ['What if…', '#ea580c', '#fff7ed'], ['The attacker', '#dc2626', '#fef2f2'], ['Detect & prevent', '#16a34a', '#f0fdf4']];
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${[o.doi, o.neu, o.xau, o.phong].map(([e, h, ys], i) => {
    const [nhan, m, nen] = KIEU[i];
    return `<div class="card" style="background:${nen};border:3px solid ${m};border-radius:16px;padding:14px 20px">`
      + `<div style="display:flex;justify-content:space-between;align-items:center"><span style="font:800 21px/1.2 Arial;color:${m};letter-spacing:.04em;text-transform:uppercase">${nhan}</span><span style="font-size:38px;line-height:1">${e}</span></div>`
      + `<div style="font:800 25px/1.25 Arial;color:#0f172a;margin:6px 0 6px">${h}</div>`
      + ys.map((y) => `<div style="font:500 21px/1.35 Arial;color:#334155;margin-top:3px">• ${y}</div>`).join('') + '</div>';
  }).join('')}</div>`;
}
