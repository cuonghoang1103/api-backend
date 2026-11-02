/**
 * _slides.mjs — nhúng bộ slide bài giảng của khoá Web Foundations.
 *
 * Slide do CuongThai tự soạn (không phải deck của trường), dựng bằng
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/wf-*.mjs --out <dir>
 * rồi đẩy lên R2 bằng scripts/upload-academy-slides.mjs --prefix WF/v1:
 *   images/academy/WF/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản (v1, v2…) CÓ CHỦ ĐÍCH: Cloudflare vẫn phục vụ
 * bytes CŨ cho một key bị ghi đè, nên dựng lại phải đi sang prefix mới chứ
 * không ghi đè — xem [[feedback_bay_cdn_va_cache]].
 *
 * Dùng lại đúng các class đang sống trong globals.css (.anh-slide /
 * .chu-thich) và cặp .ml-en / .ml-vi của khoá — không phải sửa frontend.
 */
import { GIANG } from './_giang/index.mjs';

export const CDN = 'https://media.cuongthai.com/images/academy/WF/v1';

const W = 1280, H = 720;

export const DECKS = {
  'wf-web0':  { code: 'Mục 0',     en: 'Getting started',          vi: 'Giới thiệu & nền tảng',   total: 11, w: W, h: H },
  'wf-tools': { code: 'Chương 1',  en: 'The toolbox',              vi: 'Bộ công cụ',              total: 13, w: W, h: H },
  'wf-html':  { code: 'Chương 2',  en: 'HTML',                     vi: 'HTML',                    total: 12, w: W, h: H },
  'wf-css':   { code: 'Chương 3',  en: 'CSS & responsive',         vi: 'CSS & responsive',        total: 14, w: W, h: H },
  'wf-js1':   { code: 'Chương 4',  en: 'JavaScript fundamentals',  vi: 'JavaScript nền tảng',     total: 22, w: W, h: H },
  'wf-js2':   { code: 'Chương 5',  en: 'Asynchronous JavaScript',  vi: 'JavaScript bất đồng bộ',  total: 15, w: W, h: H },
  'wf-http':  { code: 'Chương 6',  en: 'HTTP & APIs',              vi: 'HTTP & API',              total: 12, w: W, h: H },
  'wf-auth':  { code: 'Chương 7',  en: 'Auth & security',          vi: 'Xác thực & bảo mật',      total: 12, w: W, h: H },
  'wf-sql':   { code: 'Chương 8',  en: 'Data & SQL',               vi: 'Dữ liệu & SQL',           total: 13, w: W, h: H },
  'wf-ts':    { code: 'Chương 9',  en: 'TypeScript basics',        vi: 'TypeScript cơ bản',       total: 12, w: W, h: H },
  'wf-think': { code: 'Chương 10', en: 'Thinking & debugging',     vi: 'Tư duy & gỡ lỗi',         total: 12, w: W, h: H },
  'wf-js3':   { code: 'Chương 11', en: 'Advanced JavaScript',       vi: 'JavaScript nâng cao',     total: 12, w: W, h: H },
  'wf-css2':  { code: 'Chương 12', en: 'Advanced CSS',              vi: 'CSS nâng cao',            total: 12, w: W, h: H },
  'wf-test':  { code: 'Chương 13', en: 'Testing',                   vi: 'Kiểm thử',                total: 12, w: W, h: H },
  'wf-ship':  { code: 'Chương 14', en: 'Shipping it',               vi: 'Đưa lên mạng',            total: 12, w: W, h: H },
};

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN}/${deck}/${pad(n)}.webp`;

/**
 * Một slide: ảnh + một dòng chú thích.
 *
 * Khác các môn Academy (ở đó slide là của giảng viên nên phải giải thích lại
 * từng cái): slide ở đây do chính khoá soạn và bài học bên dưới đã dạy chi
 * tiết rồi. Nên chú thích cố ý NGẮN — nó là mục lục hình ảnh để ôn lại, không
 * phải bản dạy thứ hai.
 */
export function slide(deck, n, caption) {
  const d = DECKS[deck];
  if (!d) throw new Error(`deck lạ: ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${caption}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 slide ${n}/${d.total} — ${caption}</p></div>`;
}

/** Cả bộ: rows = [[n, caption], …] */
export const gallery = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Cả bộ KÈM lời giảng EN/VI dưới từng slide (02/11/2026) — lời giảng ở _giang/<deck>.mjs, đủ 1..total. */
export const galleryGiang = (deck, rows) => {
  const g = GIANG[deck];
  if (!g || g.length !== DECKS[deck].total) throw new Error(`_giang/${deck}.mjs thiếu lời giảng (cần ${DECKS[deck].total})`);
  return rows.map(([n, caption]) => slide(deck, n, caption) +
    `\n<div class="ml-en giang">${g[n - 1][0]}</div>\n<div class="ml-vi giang">${g[n - 1][1]}</div>`).join('\n');
};

/* ═══════════════ Deck BÀI (01/11/2026) — khuôn _pg-chung, slide tiếng Anh, lời giảng EN/VI ═══════════════
 * Deck mỗi bài `wf-N-M` (vd wf-11-1), dựng từ scripts/slides-src/wf-N-M.mjs, đẩy lên WF/v1/<deck>/.
 * Dựng lại một deck đã đẩy ⇒ đẩy sang WF/v2 và ghi vào VER — Cloudflare giữ bytes cũ của key bị ghi đè.
 */
export const VER = {};
const imgBai = (deck, n) => `${CDN.replace(/\/v1$/, '')}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const maDeck = (deck) => deck.replace(/^wf-(\d+)-(\d+)$/, 'WF $1.$2');

function slideBai(deck, n, title, en, vi, total) {
  if (!/^wf-\d+-\d+$/.test(deck)) throw new Error(`deck bài lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${imgBai(deck, n)}" alt="${attr(`${maDeck(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${maDeck(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Phần "học theo slide" của một bài. rows = [[n, title, en, vi], …] phủ ĐỦ 1..total, đúng thứ tự. */
export function walkWf(deck, tenEn, tenVi, rows) {
  const total = rows.length;
  rows.forEach((r, i) => { if (r[0] !== i + 1) throw new Error(`${deck}: dòng ${i + 1} mang số slide ${r[0]}`); });
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>Every slide of this lesson, each followed by a short explanation. The full written lesson — every example with its real output from Chromium — follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Toàn bộ slide của bài, mỗi slide kèm lời giảng ngắn. Bài đọc chi tiết (mọi ví dụ kèm output chạy thật trong Chromium) nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slideBai(deck, ...r, total)).join('\n') + tail;
}

const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Khối mã (nguồn lấy từ _ma.mjs — tự thoát HTML). dong = [từ, tới] (1-based, gồm cả hai đầu) ⇒ chỉ lấy đoạn đó. */
export const ma = (lang, src, dong) => {
  if (src == null) throw new Error('ma(): thiếu mã — chạy lại scripts/wf/sinh-ma.mjs?');
  let s = String(src);
  if (dong) s = s.split('\n').slice(dong[0] - 1, dong[1]).join('\n');
  return `<pre><code class="language-${lang}">${escHtml(s.replace(/^\n/, '').replace(/\n+$/, ''))}</code></pre>`;
};
/** Output chạy thật (từ _ma.mjs). */
export const ra = (text) => {
  if (text == null) throw new Error('ra(): thiếu output — chạy lại scripts/wf/chay-demo.mjs + sinh-ma.mjs?');
  return `<div class="out">${escHtml(String(text).replace(/^\n/, '').replace(/\n+$/, ''))}</div>`;
};

/** Thẻ liên kết chéo. khoa = slug khoá (Courses HOẶC Academy — trang học dùng chung /courses/<slug>/learn). */
export function lienKet({ khoa, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Thẻ nguồn tham khảo ngoài. */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;
