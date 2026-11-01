/**
 * _wf-bai.mjs — deck BÀI của khoá Web Foundations (wf-N-M, 01/11/2026). Khuôn = _pg-chung.mjs (KHÔNG sửa khuôn),
 * chỉ đặt sẵn tuỳ chọn khoá + vài hàm tiện: mã JS/CSS/HTML tô màu, cửa sổ console Chromium, ảnh chụp thật từ _demo/.
 *
 *   import { deckWf, js, css, html, con, anh, CODE, OUT, box, two, steps, cards, tbl, vsd, c, flow, kw } from './_wf-bai.mjs';
 *   export const deck = { key: 'wf-11-1', code: 'WF 11.1', title: 'Closure', sub: 'Web Foundations · Chapter 11' };
 *   export const slides = deckWf({ chuong: 'Chapter 11 — Advanced JavaScript', bai: '11.1' }, [ { cover: true, t, sub }, { t, body }, … ]);
 * Mã và output lấy từ content/courses/web-foundations/_ma.mjs (output CHẠY THẬT trong Chromium — scripts/wf/chay-demo.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { lamDeck, sql, psql, box, two, three, steps, cards, card, tbl, vsd, c, cap, flow, kw, esc } from './_pg-chung.mjs';
import { CODE, OUT } from '../../content/courses/web-foundations/_ma.mjs';

export { box, two, three, steps, cards, card, tbl, vsd, c, cap, flow, kw, esc, CODE, OUT };

export const deckWf = (meta, items) => lamDeck({
  khoa: 'Web Foundations', duong: 'courses/web-foundations', bieuTuong: '🌐', khau: 'from zero to your first real web app', ...meta,
}, items);

const lay = (k, bang, ten) => { if (bang[k] == null) throw new Error(`${ten}['${k}'] không có — chạy scripts/wf/chay-demo.mjs + sinh-ma.mjs`); return bang[k]; };
/** Mã: js('11-1/counter.js') lấy từ CODE; hoặc js(null, 'mã viết tay'). opts: { sm=true, hl, chi: [từ, tới] (dòng 1-based) } */
const ma = (lang) => (k, tay, opts = {}) => {
  let s = k ? lay(k, CODE, 'CODE') : tay;
  if (opts.chi) s = s.split('\n').slice(opts.chi[0] - 1, opts.chi[1]).join('\n');
  // gon: bỏ chú thích cuối dòng (// …) và dòng chỉ có chú thích — slide hẹp, bài đọc vẫn giữ đủ chú thích
  if (opts.gon !== false) s = s.split('\n').filter((l) => !/^\s*\/\/(?!\s*-)/.test(l) && !/^\s*\/\*.*\*\/\s*$/.test(l))
    .map((l) => l.replace(/\s+\/\/ .*$/, '').replace(/(\S)\s+\/\*.*\*\/\s*$/, '$1')).join('\n');
  return sql(s.replace(/\n+$/, ''), { lang, sm: opts.sm ?? true, hl: opts.hl || [] });
};
export const js = ma('javascript');
export const css = ma('css');
export const html = ma('xml');
export const ts = ma('typescript');
export const bash = ma('bash');
/** Console Chromium: con('11-1/counter') lấy từ OUT; con(null, 'chữ'). */
export const con = (k, tay, opts = {}) => psql(k ? lay(k, OUT, 'OUT') : tay, { title: opts.title || 'Chromium · console', sm: opts.sm ?? true, hl: opts.hl || [] })
  .replace('<pre>', '<pre style="white-space:pre-wrap;overflow-wrap:anywhere">');   // dòng console dài ⇒ xuống dòng, không tràn ngang
/** Terminal: term(k | null, chữ). */
export const term = (k, tay, opts = {}) => psql(k ? lay(k, OUT, 'OUT') : tay, { title: opts.title || 'terminal', sm: opts.sm ?? true, hl: opts.hl || [] });
/** Ảnh chụp thật (png trong _demo/) nhúng base64. anh('11-1/buttons.png', { w: 520 }) */
export function anh(rel, opts = {}) {
  const f = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../content/courses/web-foundations/_demo', rel);
  const b64 = fs.readFileSync(f).toString('base64');
  return `<img src="data:image/png;base64,${b64}" style="${opts.w ? `width:${opts.w}px;` : 'max-width:100%;'}border:1.5px solid #c9c9c9;border-radius:8px;display:block${opts.style ? ';' + opts.style : ''}" alt="">`;
}
