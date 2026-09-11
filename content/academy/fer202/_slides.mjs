/**
 * _slides.mjs — building blocks for the FER202 slide-by-slide lessons.
 *
 * Every slide of the teacher's FER202 decks (the .pptx files under
 * "1. Slide" of the course folder) was rendered to WebP and uploaded to R2 by
 * scripts/upload-academy-slides.mjs:
 *   images/academy/FER202/v1/<deck>/<NNN>.webp
 * Decks that FPTU ships as one file for two slots (Slot2,3 · Slot4,5 · Slot9,10 ·
 * Slot11,12 · Slot16,17) keep a single deck key (slot2_3, slot4_5, …); the slide
 * number here = the page number in the rendered deck, i.e. what students see.
 *
 * Markup reuses the live classes from globals.css (.anh-slide / .chu-thich /
 * .trich-slide, first built for LAB211 and reused by SWT301) and the bilingual
 * .ml-en / .ml-vi wrappers already used throughout FER202 — no frontend change.
 * The folder is depth 2 under content/academy, so the deploy seed loop
 * (content/academy/*.mjs) never mistakes these modules for course specs.
 */
export const CDN = 'https://media.cuongthai.com/images/academy/FER202/v1';

const W = 2001, H = 1125; // every deck is 16:9 rendered at 150 dpi

export const DECKS = {
  slot1:     { code: 'Slot 1',      en: 'What is React?',                             vi: 'React là gì?',                               total: 34, w: W, h: H },
  slot2_3:   { code: 'Slot 2–3',    en: 'ES6 & Rendering with JSX',                   vi: 'ES6 & Render bằng JSX',                       total: 42, w: W, h: H },
  slot4_5:   { code: 'Slot 4–5',    en: 'Bootstrap',                                  vi: 'Bootstrap',                                  total: 55, w: W, h: H },
  slot6:     { code: 'Slot 6',      en: 'React Component',                            vi: 'React Component',                            total: 22, w: W, h: H },
  slot7:     { code: 'Slot 7',      en: 'React-Bootstrap',                            vi: 'React-Bootstrap',                            total: 24, w: W, h: H },
  slot8:     { code: 'Slot 8',      en: 'Props, State & Context',                     vi: 'Props, State & Context',                     total: 21, w: W, h: H },
  slot9_10:  { code: 'Slot 9–10',   en: 'Hooks',                                      vi: 'Hooks',                                      total: 46, w: W, h: H },
  slot11_12: { code: 'Slot 11–12',  en: 'Event Handling & reusable components',       vi: 'Xử lý sự kiện & component tái sử dụng',       total: 33, w: W, h: H },
  slot13:    { code: 'Slot 13',     en: 'Validating Component Properties',            vi: 'Kiểm tra Props của component',               total: 21, w: W, h: H },
  slot14:    { code: 'Slot 14',     en: 'Handling Navigation with Routes',            vi: 'Điều hướng bằng Routes',                     total: 21, w: W, h: H },
  slot15:    { code: 'Slot 15',     en: 'Code Splitting Using Lazy Components',       vi: 'Tách code với Lazy Components',              total: 22, w: W, h: H },
  slot16_17: { code: 'Slot 16–17',  en: 'Flux Architecture & Introduction to Redux',  vi: 'Kiến trúc Flux & Giới thiệu Redux',          total: 36, w: W, h: H },
  slot18:    { code: 'Slot 18',     en: 'Client–Server Communication',                vi: 'Giao tiếp Client–Server',                    total: 28, w: W, h: H },
  slot19:    { code: 'Slot 19',     en: 'Fetching & Caching Data',                    vi: 'Lấy & cache dữ liệu',                        total: 21, w: W, h: H },
  slot20:    { code: 'Slot 20',     en: 'Introduction to Next.js & Tailwind CSS',     vi: 'Giới thiệu Next.js & Tailwind CSS',          total: 17, w: W, h: H },
};

/**
 * Register a deck from another module without editing this shared file.
 * Call at import time, before using slide()/walk().
 */
export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} already registered differently`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/**
 * Four slide URLs whose clean CDN path got a 404 negative-cached at Cloudflare:
 * they were probed (GET) before the object finished uploading, so a Cache-
 * Everything rule stored the 404 (cf-cache-status: HIT, age > 1h) even though
 * R2 now holds the object (HeadObject OK; the `?v=1` variant returns 200).
 * There is no Cloudflare purge token in the repo/env, so we route just these
 * keys through a version query — a fresh, un-poisoned cache key. The asset is
 * immutable, so the query is harmless and permanent. See feedback_bay_cdn_va_cache:
 * NEVER GET a CDN URL before its object exists.
 */
const BUST = new Set(['slot16_17/36', 'slot9_10/46', 'slot20/17', 'slot4_5/55']);

/** Public URL of one rendered slide. */
export const img = (deck, n) => `${CDN}/${deck}/${pad(n)}.webp${BUST.has(`${deck}/${n}`) ? '?v=1' : ''}`;

/**
 * One slide = the picture (shared by both languages, so it is fetched once)
 * followed by the paired EN/VI explanation. `title` is plain slide text.
 */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`unknown deck ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} has ${d.total} slides, got ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} slide ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
}

/** A run of slides: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Answer line for an in-class "Question / Practice" slide. */
export const ansEn = (letter, why) => `<p><strong>✅ Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p><strong>✅ Đáp án: ${letter}.</strong> ${why}</p>`;

/** Heading that opens a slide walkthrough. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>Open your own copy of <em>${d.code}</em> next to this page. Each slide is shown exactly as in class, followed by what it means, how to remember it, the code that makes it concrete and — for every <em>Practice / Question</em> slide — the answer with the reasoning. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>Mở slide <em>${d.code}</em> của thầy/cô bên cạnh trang này. Mỗi slide được giữ nguyên như trên lớp, ngay dưới là giải thích ý nghĩa, cách nhớ, đoạn code minh hoạ và — với mọi slide <em>Practice / Question</em> — đáp án kèm lập luận. ${noteVi}</p></div>`;
}

/** Wrap paired blocks: bi(en, vi). */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;

/** The reference books & docs cited by key throughout FER202. */
export const BOOKS = {
  reactdoc: 'React official docs — <em>react.dev/learn</em> (the “Learn React” track and the API reference for every Hook)',
  fullstackreact: 'Anthony Accomazzo et al. — <em>Fullstack React</em> (the “up and running” R&amp;D reference the slots draw examples from)',
  roadtoreact: 'Robin Wieruch — <em>The Road to React</em> (function components, hooks, data fetching)',
  bootstrap: 'Bootstrap 5.3 documentation — <em>getbootstrap.com/docs</em> (grid, components, utilities)',
  reactbootstrap: 'React-Bootstrap documentation — <em>react-bootstrap.github.io</em>',
  redux: 'Redux Toolkit documentation — <em>redux-toolkit.js.org</em> (the modern, official way to write Redux)',
  router: 'React Router documentation — <em>reactrouter.com</em>',
  mdn: 'MDN Web Docs — <em>developer.mozilla.org</em> (JavaScript, DOM, fetch, Promise)',
};

/** "Read it in the docs" block: refs = [[bookKey, whereEn, whereVi], …]. */
export function books(refs) {
  const li = (lang) => refs.map(([k, en, vi]) => `<li>${BOOKS[k]}: <strong>${lang === 'en' ? en : vi}</strong></li>`).join('');
  return `<div class="ml-en"><h3>📚 Read it in the docs &amp; books</h3><ul>${li('en')}</ul></div>\n` +
    `<div class="ml-vi"><h3>📚 Đọc thêm trong tài liệu &amp; sách</h3><ul>${li('vi')}</ul></div>`;
}
