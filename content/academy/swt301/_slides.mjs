/**
 * _slides.mjs — building blocks for the SWT301 slide-by-slide lessons.
 *
 * Every slide of the teacher's decks was rendered from the .pptx (NOT the
 * older PDFs: SWT3/SWT5/Topic 8 PDFs miss 11–31 slides that the .pptx has),
 * converted to WebP and uploaded to R2 by scripts/upload-academy-slides.mjs:
 *   images/academy/SWT301/v1/<deck>/<NNN>.webp
 * Slide numbers here = the number of the VISIBLE slide in the deck (hidden
 * slides are not exported), so "slide 37" is what students see in class.
 *
 * Markup reuses the live classes from globals.css (.anh-slide / .chu-thich /
 * .trich-slide, first built for LAB211) — no frontend change needed.
 * The folder is depth 2 under content/academy, so the deploy seed loop
 * (content/academy/*.mjs) never mistakes these modules for course specs.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/SWT301';
export const CDN = `${CDN_ROOT}/v1`;

export const DECKS = {
  swt0: { code: 'SWT0', en: 'Introduction to the course', vi: 'Giới thiệu môn học', total: 21, w: 1280, h: 720 },
  swt1: { code: 'SWT1', en: 'Ch.1 Fundamentals of Testing', vi: 'Ch.1 Nền tảng kiểm thử', total: 114, w: 1280, h: 887 },
  swt2: { code: 'SWT2', en: 'Ch.2 Testing throughout the SDLC', vi: 'Ch.2 Kiểm thử trong vòng đời phát triển', total: 143, w: 1280, h: 887 },
  swt3: { code: 'SWT3', en: 'Ch.3 Static Testing', vi: 'Ch.3 Kiểm thử tĩnh', total: 106, w: 1280, h: 887 },
  swt4: { code: 'SWT4', en: 'Ch.4 Test Techniques', vi: 'Ch.4 Kỹ thuật thiết kế test', total: 112, w: 1280, h: 887 },
  swt5: { code: 'SWT5', en: 'Ch.5 Test Management', vi: 'Ch.5 Quản lý kiểm thử', total: 101, w: 1280, h: 887 },
  swt6: { code: 'SWT6', en: 'Ch.6 Tool Support for Testing', vi: 'Ch.6 Công cụ hỗ trợ kiểm thử', total: 54, w: 1280, h: 887 },
  agile: { code: 'Topic 8', en: 'ISTQB CTFL Agile Tester', vi: 'ISTQB CTFL Agile Tester', total: 74, w: 1280, h: 887 },
  addl: { code: 'Additional Content', en: 'ISTQB exam FAQ & test-case anatomy', vi: 'Hỏi đáp thi ISTQB & giải phẫu test case', total: 26, w: 1280, h: 720 },
  'lab1-review': { code: 'Lab1_Review', en: 'Lab 1 — Code review', vi: 'Lab 1 — Review code', total: 2, w: 1280, h: 720 },
  'lab1-source': { code: 'sourcecode.pdf', en: 'Lab 1 — source code to review', vi: 'Lab 1 — mã nguồn cần review', total: 2, w: 1280, h: 1657 },
  'lab1-static': { code: 'Lab1_static_analysis', en: 'Lab 1 — Static analysis', vi: 'Lab 1 — Phân tích tĩnh', total: 6, w: 1280, h: 720 },
  // v2 (lab2-utguide, lab2-pcl): re-rendered with Japanese fonts installed in the LibreOffice profile —
  // the v1 images had every Japanese character missing (LibreOffice headless
  // did not see the macOS system fonts and fell back to Liberation Sans).
  'lab2-utguide': { code: 'A Guide for Unit Testing', en: 'Lab 2 — Unit-testing guide', vi: 'Lab 2 — Hướng dẫn unit test', total: 88, w: 1280, h: 960, ver: 'v2' },
  'lab2-pcl': { code: 'How to write PCL', en: 'Lab 2 — How to write a PCL', vi: 'Lab 2 — Cách viết PCL', total: 32, w: 1280, h: 721, ver: 'v2' },
  'lab2-structural': { code: 'Lab2 Structural', en: 'Lab 2 — Component (structural) testing', vi: 'Lab 2 — Component test cấu trúc', total: 13, w: 1280, h: 960 },
  'lab2-functional': { code: 'Lab2 Functional', en: 'Lab 2 — Component (functional) testing', vi: 'Lab 2 — Component test chức năng', total: 14, w: 1280, h: 960 },
};

/**
 * Add a deck from another module (e.g. cropped practical-exam papers) without
 * editing this shared file. Call at import time, before using slide()/walk().
 */
export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} already registered differently`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Public URL of one rendered slide. */
export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

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

/** Answer line for an in-class "Question" slide. */
export const ansEn = (letter, why) => `<p><strong>✅ Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p><strong>✅ Đáp án: ${letter}.</strong> ${why}</p>`;

/** Heading that opens a slide walkthrough. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), slides ${from}–${to}</h2>` +
    `<p>Open your own copy of <em>${d.code}</em> next to this page. Each slide is shown exactly as in class, followed by what it means, how to remember it and — for every <em>Question</em> slide — the answer with the reasoning. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), slide ${from}–${to}</h2>` +
    `<p>Mở slide <em>${d.code}</em> của thầy/cô bên cạnh trang này. Mỗi slide được giữ nguyên như trên lớp, ngay dưới là giải thích ý nghĩa, cách nhớ, và — với mọi slide <em>Question</em> — đáp án kèm lập luận. ${noteVi}</p></div>`;
}

/** The six books in 01.Materials/02.Books, cited by key. */
export const BOOKS = {
  fst4: 'Black, van Veenendaal & Graham — <em>Foundations of Software Testing: ISTQB Certification</em>, 4th ed. (Cengage 2019/2020) — file “Foundations of SW Testing ISTQB Certification by Erik van Veenendaal 2019.pdf”',
  fst: 'Graham, van Veenendaal, Evans & Black — <em>Foundations of Software Testing: ISTQB Certification</em> (older edition) — file “Foundations of Software Testing_ISTQB Certification.pdf”',
  sp5: 'Spillner & Linz — <em>Software Testing Foundations</em>, 5th ed. (2021, CTFL 2018) — file “Andreas-Spillner…2021.pdf”',
  sp4: 'Spillner, Linz & Schaefer — <em>Software Testing Foundations</em>, 4th ed. (CTFL 2011) — file “Software Testing Foundations…[5309302].PDF”',
  agile: '<em>ISTQB Agile Tester in a Nutshell</em> (2014) — file “ISTQB_Agile_Tester_Nutshell_2014_May.pdf”',
  junit: 'Tudose — <em>JUnit in Action</em>, 3rd ed. (Manning 2020) — file “JUnit in Action, Third Edition.pdf”',
};

/** "Read in the books" block: refs = [[bookKey, whereEn, whereVi], …]. */
export function books(refs) {
  const li = (lang) => refs.map(([k, en, vi]) => `<li>${BOOKS[k]}: <strong>${lang === 'en' ? en : vi}</strong></li>`).join('');
  return `<div class="ml-en"><h3>📚 Read it in the books</h3><ul>${li('en')}</ul></div>\n` +
    `<div class="ml-vi"><h3>📚 Đọc thêm trong sách (đúng chương, đúng trang)</h3><ul>${li('vi')}</ul></div>`;
}

/** Wrap paired blocks: bi(en, vi). */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
