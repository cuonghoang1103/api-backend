/**
 * _slides.mjs — slide của khoá "Operating Systems for Developers" (28/10/2026). Khuôn chuẩn = khuôn PostgreSQL
 * (scripts/slides-src/_pg-chung.mjs: slide TIẾNG ANH, dáng slide trường FU, logo CuongThai.com), deck từng bài
 * `scripts/slides-src/os-NN-X.mjs` (NN = chương có đệm, X = số bài hoặc chữ: os-00-a, os-01-2, os-lab-1).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/os-01-2.mjs --out <dir>
 *   node --env-file=.env scripts/upload-academy-slides.mjs --dir <dir> --prefix OS/v1 --decks os-01-2
 *   ⇒ https://media.cuongthai.com/images/academy/OS/v1/<deck>/<NNN>.webp
 *
 * ⚠️ Prefix mang phiên bản CÓ CHỦ ĐÍCH (Cloudflare giữ bytes cũ của key bị ghi đè 1 năm): dựng lại deck đã đẩy ⇒ đẩy
 * sang OS/v2 và ghi deck vào VER — đừng ghi đè v1.
 *
 * Mỗi bài có tệp giảng `giang/<deck>.mjs`:
 *   import { walk } from '../_slides.mjs';
 *   export default walk('os-01-2', 'English title', 'Tên tiếng Việt', [[n, 'Slide title', '<p>EN…</p>', '<p>VI…</p>'], …]);
 * rồi bài chèn `${G}` ở ĐẦU content. rows phải phủ đủ mọi slide của deck, đúng một lần mỗi số.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/OS';
const VER = {
  'os-10-1': 'v2', // 28/10: ảnh 001 của v1 bị Cloudflare giữ 404 (bị dò trước khi đẩy) ⇒ đẩy lại cả deck sang v2
  'os-11-1': 'v3', // 29/10: 001 của v1 (và v2 — bị dò khi kiểm) bị Cloudflare giữ 404 ⇒ đẩy lại sang v3. ĐỪNG curl ảnh trước khi đẩy.
};
const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
export const img = (deck, n) => `${CDN_ROOT}/${VER[deck] || 'v1'}/${deck}/${pad(n)}.webp`;
const code = (deck) => deck.toUpperCase().replace(/^OS-0?(\d+)-([A-Z0-9]+)$/, 'OS $1.$2').replace(/^OS-LAB-(\d+)$/, 'OS LAB $1');

export function slide(deck, n, title, en, vi, total) {
  if (!/^os-(\d\d-[a-z0-9]+|lab-\d+)$/.test(deck)) throw new Error(`deck lạ: ${deck}`);
  if (!Number.isInteger(n) || n < 1 || n > total) throw new Error(`${deck} có ${total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${code(deck)} slide ${n}: ${title}`)}" loading="lazy" width="1280" height="720" />` +
    `<p class="chu-thich">📑 <strong>${code(deck)}</strong> · slide ${n}/${total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

export function walk(deck, tenEn, tenVi, rows) {
  const total = rows.length;
  const nums = rows.map((r) => r[0]);
  for (let i = 1; i <= total; i++) if (nums.filter((x) => x === i).length !== 1) throw new Error(`${deck}: slide ${i} phải có đúng một dòng giảng`);
  const head = `<div class="ml-en"><h2>📑 Slides — ${tenEn}</h2><p>The lesson in ${total} slides, each followed by what it means. The full written lesson — every command with its real output, the interactive lab, practice, key terms and summary — follows after the slides.</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo slide — ${tenVi}</h2><p>Cả bài trong ${total} slide, mỗi slide kèm lời giảng. Bài đọc chi tiết — mọi lệnh kèm output chạy thật, phòng lab trực quan, bài thực hành, thuật ngữ và tóm tắt — nằm ngay sau phần slide.</p></div>\n`;
  const tail = `\n<div class="ml-en"><h2>📖 Full written lesson</h2></div>\n<div class="ml-vi"><h2>📖 Bài đọc chi tiết</h2></div>\n`;
  return head + rows.map((r) => slide(deck, ...r, total)).join('\n') + tail;
}
