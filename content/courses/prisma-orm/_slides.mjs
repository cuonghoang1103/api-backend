/**
 * _slides.mjs — nhúng ảnh slide của khoá "Prisma ORM" vào bài học (12/11/2026). Chép từ content/courses/typescript/_slides.mjs:
 * slide TIẾNG ANH, dáng slide trường FU, logo CuongThai.com (khuôn scripts/slides-src/_pr-chung.mjs ← _ts-chung.mjs).
 * Deck = đúng deck của video bài giảng (output chạy thật Prisma 6.19.3 · PostgreSQL 16.14, đóng băng trong từng deck).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/pr-NN-M.mjs --out <dir>
 *   node scripts/tst/kiem-slide.mjs scripts/slides-src/pr-NN-M.mjs        ⇒ phải "0 slide có vấn đề"
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix PR/v1 --decks pr-NN-M
 *   ⇒ images/academy/PR/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang số phiên bản CÓ CHỦ ĐÍCH: Cloudflare giữ bytes CŨ cho key bị ghi đè. Dựng lại một deck đã đẩy ⇒ đẩy sang
 * PR/v2 và ghi deck đó vào VER — đừng ghi đè v1. Đừng GET URL ảnh trước khi đẩy (Cloudflare cache luôn cái 404).
 *
 * Tên deck theo slug bài: pr-0-8-bat-dau-tai-day ⇒ pr-00-8 · pr-1-2-generate-viet-gi ⇒ pr-01-2 · lab chương N ⇒ pr-lab-N.
 * Mỗi bài có tệp giảng `giang/<deck>.mjs` = walkPr(deck, tênEN, tênVI, [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]).
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/PR';

/** Deck nào đã phải dựng lại thì ghi phiên bản ở đây, vd { 'pr-01-1': 'v2' }. */
const VER = { 'pr-03-5': 'v2', 'pr-05-4': 'v2' };  // 12/11: slide 12 đính chính @@map (A/B theo tên model)

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const code = (deck) => deck.toUpperCase().replace(/^PR-0?(\d+)-(\d+)$/, 'PR $1.$2').replace(/^PR-LAB-(\d+)$/, 'PR Lab $1');

/** Một slide + giảng EN/VI ngay dưới. */
export function slide(deck, n, title, en, vi, total) {
  if (!/^pr-(\d\d-\d+|lab-\d+)$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${code(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Cả phần "học theo slide" của một bài. rows phải phủ ĐỦ 1..total, đúng thứ tự, mỗi số một lần. */
export function walkPr(deck, tenEn, tenVi, rows) {
  const total = rows.length;
  const nums = rows.map((r) => r[0]);
  for (let i = 1; i <= total; i++) if (nums.filter((x) => x === i).length !== 1) throw new Error(`${deck}: slide ${i} phải có đúng một dòng giảng`);
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>Every slide of this lesson, each followed by what it means in plain words. The slides are the deck of the video lesson, with output from real runs (Prisma 6.19.3, PostgreSQL 16.14). The full written lesson follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Toàn bộ slide của bài, mỗi slide kèm lời giảng dễ hiểu bằng tiếng Việt (slide viết tiếng Anh để bạn quen thuật ngữ đi làm). Đây là bộ slide của video bài giảng, output lấy từ lần chạy thật (Prisma 6.19.3, PostgreSQL 16.14). Bài đọc chi tiết nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slide(deck, ...r, total)).join('\n') + tail;
}

/** Khối mã: tự thoát < > & — mã mẫu của khoá cố ý KHÔNG dùng backtick, ${ hay gạch chéo ngược. */
const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const ma = (lang, src) => `<pre><code class="language-${lang}">${escHtml(src.replace(/^\n/, '').replace(/\n$/, ''))}</code></pre>`;
/** Output chạy thật. */
export const ra = (text) => `<div class="out">${escHtml(text.replace(/^\n/, '').replace(/\n$/, ''))}</div>`;

/** Thẻ liên kết chéo (mặc định sang khoá khác trên /courses; Academy: khoa = slug khoá Academy). */
export function lienKet({ khoa, bai, title, sub, cta }) {
  return `<a class="link-card lien-ket-cheo" href="/courses/${khoa}/learn?lessonSlug=${bai}" target="_blank" rel="noopener">\n` +
    `  <span class="lc-ico">🔗</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n` +
    `  <span class="lc-cta">${cta}</span>\n</a>`;
}

/** Thẻ nguồn tham khảo (link ngoài đã GET thật → 200). */
export const nguon = (ico, title, sub, url) => `<a class="link-card" href="${url}" target="_blank" rel="noopener">\n` +
  `  <span class="lc-ico">${ico}</span>\n  <span class="lc-body"><span class="lc-title">${title}</span><span class="lc-sub">${sub}</span></span>\n</a>`;
