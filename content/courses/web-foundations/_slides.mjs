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
