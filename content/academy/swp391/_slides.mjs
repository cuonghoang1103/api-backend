/**
 * _slides.mjs — building blocks for the SWP391 slide-by-slide lessons.
 *
 * Same markup as content/academy/swt301/_slides.mjs (live CSS in globals.css:
 * .anh-slide / .chu-thich / .giang …). Every page of the teacher's guides,
 * templates and the G5 sample was rendered from the original .pptx/.docx/.pdf
 * with LibreOffice, converted to WebP and uploaded by
 * scripts/upload-academy-slides.mjs to images/academy/SWP391/v1/<deck>/NNN.webp.
 *
 * PRIVACY: pages of the G5 sample / capstone report that show real students' names, student IDs,
 * e-mails, phones or usernames were NOT uploaded (`skip`). GitLab screenshots in g-subject, g-student,
 * g-git and g-gitlab-pdf had names/usernames/e-mails BLURRED (hi-res OCR + manual boxes) → `ver: 'v2'`;
 * the unblurred v1 objects were deleted from R2. — they are listed in `skip`, and slide()
 * throws if a lesson tries to use one. Never write those details in text either.
 *
 * The folder is depth 2 under content/academy, so the deploy seed loop
 * (content/academy/*.mjs) never mistakes these modules for course specs.
 */
export const CDN_ROOT = 'https://media.cuongthai.com/images/academy/SWP391';

export const DECKS = {
  'g-subject': { code: 'Slide1 Subject Guides', en: 'Subject introduction & guides', vi: 'Giới thiệu & hướng dẫn môn học', total: 15, w: 1280, h: 960 , ver: 'v2'},
  'g-student': { code: 'SWP391 Student Guides', en: 'Student guides', vi: 'Hướng dẫn sinh viên', total: 19, w: 1280, h: 960 , ver: 'v2'},
  'g-req': { code: 'Slide2 Software Requirement', en: 'Software requirement', vi: 'Yêu cầu phần mềm', total: 32, w: 1280, h: 960 },
  'g-design': { code: 'Slide3 System Design', en: 'System design', vi: 'Thiết kế hệ thống', total: 55, w: 1280, h: 960 },
  'g-db': { code: 'Slide4 Database Design', en: 'Database design', vi: 'Thiết kế cơ sở dữ liệu', total: 25, w: 1280, h: 960 },
  'g-git': { code: 'Slide5 GitLab Guides', en: 'GitLab guides', vi: 'Hướng dẫn GitLab', total: 32, w: 1280, h: 960 , ver: 'v2'},
  'g-present': { code: 'Slide6 Presentation', en: 'Final presentation guide', vi: 'Hướng dẫn thuyết trình cuối kỳ', total: 9, w: 1280, h: 960 },
  'g-gitlab-pdf': { code: 'GitLab Student Guides (PDF)', en: 'GitLab student guide', vi: 'Hướng dẫn GitLab cho sinh viên', total: 5, w: 1280, h: 1657 , ver: 'v2'},
  't-present': { code: 'Template7 Project Presentation', en: 'Presentation template', vi: 'Mẫu slide thuyết trình', total: 9, w: 1280, h: 960 },
  't-srs': { code: 'Template1 SRS Document', en: 'SRS template', vi: 'Mẫu tài liệu SRS', total: 15, w: 1280, h: 1811 },
  't-sds': { code: 'Template2 SDS Document', en: 'SDS template', vi: 'Mẫu tài liệu SDS', total: 9, w: 1280, h: 1657 },
  'g5-present': { code: 'G5 sample — Presentation', en: 'Sample team G5 — final presentation', vi: 'Nhóm mẫu G5 — slide thuyết trình', total: 15, w: 1280, h: 720, skip: [2] },
  'g5-rds': { code: 'G5 sample — RDS Document', en: 'Sample team G5 — Requirement & Design Specification', vi: 'Nhóm mẫu G5 — tài liệu RDS', total: 213, w: 1280, h: 1657,
    // 12/09 hi-res OCR: screen designs whose sample data is a member's real name / gmail / phone.
    skip: [1, 2, 3, 30, 31, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 46, 48,
      75, 78, 79, 81, 86, 88, 89, 91, 92, 93, 94, 110, 111, 112, 114, 118, 129, 132, 134, 135, 137, 141, 147, 150, 151, 201] },
  // NOTE (12/09): for g5-rds and cap only the pages the lessons actually use are kept on R2 — every other
  // page was deleted after the review. Using a new page means: look at it, check for personal data, re-upload.
  // A real 2023 capstone final report (ISP490, scanned PDF — OCR text in the scratchpad). Report page
  // numbers are printed on the page ("Page x / 209"); `n` here is the PDF page (159 pages in the file).
  // Skipped: acknowledgement, team/contact tables, responsibility tables and every page whose OCR shows
  // an e-mail, phone number or a team member's name.
  cap: { code: 'Sample Capstone Final Report', en: 'A real final report (capstone)', vi: 'Một báo cáo cuối kỳ thật (capstone)', total: 159, w: 1280, h: 1656,
    skip: [2, 4, 6, 7, 8, 9, 16, 17, 20, 21, 24, 25, 45, 48, 52, 55, 77, 90, 91, 94, 99, 100, 102, 135, 137, 138, 139, 140, 144, 149, 150, 151, 152, 153, 156] },
};

/** Add a deck from another module (e.g. the capstone report pages) without editing this file. */
export function registerDeck(key, meta) {
  if (DECKS[key] && JSON.stringify(DECKS[key]) !== JSON.stringify(meta)) throw new Error(`deck ${key} already registered differently`);
  DECKS[key] = meta;
}

const pad = (n) => String(n).padStart(3, '0');
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Public URL of one rendered page. */
export const img = (deck, n) => `${CDN_ROOT}/${DECKS[deck]?.ver || 'v1'}/${deck}/${pad(n)}.webp`;

/**
 * One slide = the picture followed by the paired EN/VI explanation, each in a
 * .giang card. Explanations must start with <p class="y-chinh">🎯 …</p>.
 */
export function slide(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (!d) throw new Error(`unknown deck ${deck}`);
  if (n < 1 || n > d.total) throw new Error(`${deck} has ${d.total} pages, got ${n}`);
  if (d.skip?.includes(n)) throw new Error(`${deck} page ${n} shows personal data and was not published — do not use it`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} page ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📑 <strong>${d.code}</strong> · slide ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}

/** A run of slides: rows = [[n, title, en, vi], …]. */
export const walk = (deck, rows) => rows.map((r) => slide(deck, ...r)).join('\n');

/** Answer line for a question inside a slide explanation. */
export const ansEn = (letter, why) => `<p class="dap-an">✅ <strong>Answer: ${letter}.</strong> ${why}</p>`;
export const ansVi = (letter, why) => `<p class="dap-an">✅ <strong>Đáp án: ${letter}.</strong> ${why}</p>`;

/** Heading that opens a slide walkthrough. */
export function walkHead(deck, from, to, noteEn = '', noteVi = '') {
  const d = DECKS[deck];
  return `<div class="ml-en"><h2>📑 Slide by slide — ${d.code} (${d.en}), pages ${from}–${to}</h2>` +
    `<p>Open the teacher's file next to this page. Each page is shown exactly as in class, followed by what it means and what it asks your team to do. ${noteEn}</p></div>\n` +
    `<div class="ml-vi"><h2>📑 Học theo từng slide — ${d.code} (${d.vi}), trang ${from}–${to}</h2>` +
    `<p>Mở file của thầy/cô bên cạnh trang này. Mỗi trang được giữ nguyên như trên lớp, ngay dưới là ý nghĩa và việc nhóm bạn cần làm. ${noteVi}</p></div>`;
}

/** Reference books / materials, cited by key (chapter level). */
export const BOOKS = {
  sommerville: 'Ian Sommerville — <em>Software Engineering</em>, 10th ed. (Pearson, 2015)',
  wiegers: 'Karl Wiegers &amp; Joy Beatty — <em>Software Requirements</em>, 3rd ed. (Microsoft Press, 2013)',
  gomaa: 'Hassan Gomaa — <em>Software Modeling and Design: UML, Use Cases, Patterns, and Software Architectures</em> (Cambridge, 2011) — the COMET method the System/Database Design decks follow',
  progit: 'Scott Chacon &amp; Ben Straub — <em>Pro Git</em>, 2nd ed. (Apress, free at git-scm.com/book)',
  cockburn: 'Alistair Cockburn — <em>Writing Effective Use Cases</em> (Addison-Wesley, 2000)',
  fowler: 'Martin Fowler — <em>UML Distilled</em>, 3rd ed. (Addison-Wesley, 2003)',
};

/** "Read in the books" block: refs = [[bookKey, whereEn, whereVi], …]. */
export function books(refs) {
  const li = (lang) => refs.map(([k, en, vi]) => `<li>${BOOKS[k]}: <strong>${lang === 'en' ? en : vi}</strong></li>`).join('');
  return `<div class="ml-en"><h3>📚 Read it in the books</h3><ul>${li('en')}</ul></div>\n` +
    `<div class="ml-vi"><h3>📚 Đọc thêm trong sách</h3><ul>${li('vi')}</ul></div>`;
}

/** Wrap paired blocks: bi(en, vi). */
export const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
