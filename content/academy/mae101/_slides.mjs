/**
 * _slides.mjs — khối dựng bài học "theo từng slide" cho MAE101.
 *
 * MAE101 KHÔNG có bộ slide gốc của trường (FLM không đăng), nên bộ slide này
 * được TỰ THIẾT KẾ bám syllabus FLM (sylID 13137, 60 buổi, 9 CLO) + giáo trình
 * Stewart "Essential Calculus" và Nicholson "Linear Algebra with Applications",
 * render bằng scripts/_render-slides.mjs (playwright + KaTeX) rồi upload bằng
 * scripts/upload-academy-slides.mjs:
 *   images/academy/MAE101/v1/<deck>/<NNN>.webp
 * Nguồn slide: scripts/slides-src/mae101-<chương>.mjs — sửa ở đó rồi render lại
 * vào prefix MỚI (v2, v3…) vì Cloudflare giữ cache bytes cũ của key đã ghi đè.
 *
 * Markup dùng lại đúng class đang sống trong globals.css: .anh-slide / .chu-thich
 * và .giang (🎯 .y-chinh · .nhan · .meo · .dap-an · .pitfall). Thư mục ở độ sâu 2
 * dưới content/academy nên vòng seed (content/academy/*.mjs) không nhận nhầm là
 * spec môn học.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/MAE101';

export const DECKS = {
  mae1: { code: 'MAE1', en: 'Ch.1 Limits', vi: 'Ch.1 Giới hạn', total: 17, w: 1280, h: 720 },
  mae2: { code: 'MAE2', en: 'Ch.2 Derivatives', vi: 'Ch.2 Đạo hàm', total: 17, w: 1280, h: 720 },
  mae3: { code: 'MAE3', en: 'Ch.3 Applications of Derivatives', vi: 'Ch.3 Ứng dụng đạo hàm', total: 17, w: 1280, h: 720 },
  mae4: { code: 'MAE4', en: 'Ch.4 Integrals', vi: 'Ch.4 Tích phân', total: 17, w: 1280, h: 720 },
  mae5: { code: 'MAE5', en: 'Ch.5 Linear Systems', vi: 'Ch.5 Hệ phương trình tuyến tính', total: 16, w: 1280, h: 720 },
};

export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} đã đăng ký khác`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

/** Một slide = ảnh (dùng chung 2 ngôn ngữ) + phần giảng EN/VI. */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`deck lạ: ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} có ${d.total} slide, nhận ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** Một dãy slide: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Tiêu đề mở đầu phần học theo slide. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>Each slide is shown first, then what it means, how to remember it, and the traps. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>Mỗi slide hiện trước, ngay dưới là giải thích ý nghĩa, cách nhớ và bẫy hay gặp. ${noteVi}</p></div>`;
}

export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
