/**
 * Kỹ năng nghề · 📝 3.5 — Tự viết "linter báo cáo": tìm từ mơ hồ (đúng cả tiếng Việt — bẫy \b ASCII), rồi lintReport(md)
 * kiểm đủ mục bắt buộc, có bảng, đủ số liệu, không từ mơ hồ, không đổ lỗi.
 */
import { moDun, baiJs, kiemVB, TN } from './_chung.mjs';

const VAGUE_SRC = `const VAGUE = ['fast', 'slow', 'quickly', 'many', 'some', 'a lot', 'lots of', 'good', 'bad', 'better', 'quite', 'fairly',
  'several', 'soon', 'etc', 'stable', 'pretty much', 'khá', 'ổn', 'nhanh', 'chậm', 'nhiều', 'một số', 'tốt', 'hơi', 'tương đối', 'vân vân'];`;
const BLAME_SRC = `const BLAME = ['careless', 'lazy', 'stupid', 'fault of', 'should have known', 'someone forgot', 'bất cẩn', 'lười', 'lỗi của bạn', 'tại bạn'];`;

/* ─────────────── L1 — findVague ─────────────── */
const DAU_L1 = `${VAGUE_SRC}

/**
 * Return the vague words/phrases of VAGUE that appear in text as whole words,
 * lower-case, each once, in order of first appearance.
 */
function findVague(text) {
  return [];
}
`;
const GIAI_L1 = `${VAGUE_SRC}

// Escape regex metacharacters in a phrase ("etc." has none here, but a list grows).
const escapeRe = (s) => s.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');

/**
 * Whole-word match in ANY language: "not preceded / followed by a letter or digit".
 * \\b would be wrong here — in JavaScript \\b only knows [A-Za-z0-9_], so /\\bổn\\b/ never matches "ổn"
 * (and /\\bt\\b/ matches the "t" at the end of "một").
 */
function findVague(text) {
  const t = String(text || '').toLowerCase();
  const hits = [];
  for (const w of VAGUE) {
    const re = new RegExp('(?<![\\\\p{L}\\\\p{N}])' + escapeRe(w) + '(?![\\\\p{L}\\\\p{N}])', 'u');
    const m = re.exec(t);
    if (m) hits.push({ w, i: m.index });
  }
  return hits.sort((a, b) => a.i - b.i).map((h) => h.w);
}
`;
const L1 = baiJs({
  tieuDe: 'Linter 1 — findVague(): vague words, in any language',
  doKho: 'MEDIUM', phut: 15,
  moTa: {
    en: `<p>Start the report linter with its most useful rule. <code>findVague(text)</code> returns the entries of the given <code>VAGUE</code> list (English + Vietnamese) that appear in <code>text</code> <b>as whole words</b>, lower-case, each <b>once</b>, in <b>order of first appearance</b>. Case-insensitive. Multi-word entries (“a lot”, “một số”) match as phrases.</p>
<p>“Whole word” means the match is not preceded or followed by a letter or a digit — so “fast” does not match “fastest”. <b>Trap:</b> JavaScript’s <code>\\b</code> only understands ASCII letters, so <code>/\\bổn\\b/</code> never matches “ổn”. This exact bug once corrupted this site’s Vietnamese subtitles (“một” became “mộti”).</p>`,
    vi: `<p>Bắt đầu linter báo cáo bằng luật hữu ích nhất. <code>findVague(text)</code> trả các mục của danh sách <code>VAGUE</code> (Anh + Việt) xuất hiện trong <code>text</code> <b>như một từ trọn vẹn</b>, chữ thường, mỗi mục <b>một lần</b>, theo <b>thứ tự xuất hiện đầu tiên</b>. Không phân biệt hoa thường. Mục nhiều chữ ("a lot", "một số") khớp cả cụm.</p>
<p>"Từ trọn vẹn" nghĩa là trước và sau chỗ khớp không phải chữ cái hay chữ số — "fast" không khớp "fastest". <b>Bẫy:</b> <code>\\b</code> của JavaScript chỉ hiểu chữ ASCII, nên <code>/\\bổn\\b/</code> không bao giờ khớp "ổn". Chính lỗi này từng làm hỏng phụ đề tiếng Việt của web ("một" thành "mộti").</p>`,
  },
  yeuCau: [
    { en: 'Use the VAGUE list as given (do not edit it).', vi: 'Dùng danh sách VAGUE như cho sẵn (đừng sửa).' },
    { en: 'Return [] when nothing is found.', vi: 'Không có gì thì trả [].' },
  ],
  viDu: [
    { input: "findVague('The API is fast and quite stable.')", output: "['fast', 'quite', 'stable']", explanation: 'Order of first appearance.|||Theo thứ tự xuất hiện.' },
    { input: "findVague('Hệ thống khá ổn, chạy nhanh.')", output: "['khá', 'ổn', 'nhanh']", explanation: 'Vietnamese words must match — \\b would miss them.|||Từ tiếng Việt phải khớp — \\b sẽ bỏ sót.' },
  ],
  goiY: [
    'Ranh giới Unicode: new RegExp("(?<![\\\\p{L}\\\\p{N}])" + từ + "(?![\\\\p{L}\\\\p{N}])", "u").',
    'Lưu vị trí khớp đầu tiên (m.index) của từng mục rồi sắp theo vị trí.',
    'Đưa cả văn bản về chữ thường một lần ở đầu hàm.',
  ],
  loiHayGap: [
    'Dùng \\b ⇒ không bắt được "ổn", "khá", "tốt"; còn bắt nhầm "t" cuối chữ "một".',
    'Dùng text.includes(w) ⇒ "fast" khớp "fastest", "tốt" khớp "tốt nghiệp"… (lỗi thứ hai thì luật từ đơn giản này vẫn mắc — ghi nhận giới hạn).',
    'Trả theo thứ tự danh sách thay vì thứ tự xuất hiện.',
  ],
  giaiThich: {
    en: '<p>One regular expression per list entry, with Unicode lookarounds instead of <code>\\b</code>. The <code>u</code> flag is required for <code>\\p{L}</code>. Known limit, worth writing in your report: a single-syllable Vietnamese entry like “tốt” also matches inside the compound “tốt nghiệp” (graduate) — a word-level rule cannot see compounds; a real linter would use an allow-list.</p>',
    vi: '<p>Mỗi mục một biểu thức chính quy, dùng lookaround Unicode thay cho <code>\\b</code>. Cờ <code>u</code> bắt buộc để <code>\\p{L}</code> hoạt động. Giới hạn đã biết, nên ghi vào báo cáo: mục một tiếng như "tốt" cũng khớp trong từ ghép "tốt nghiệp" — luật mức từ không thấy từ ghép; linter thật sẽ dùng danh sách ngoại lệ.</p>',
  },
  thuatNgu: [TN.linter, TN.vague, { en: 'lookbehind / lookahead', vi: 'điều kiện nhìn trước/sau chỗ khớp mà không "ăn" ký tự' }, { en: 'word boundary (\\b)', vi: 'ranh giới từ — trong JS chỉ hiểu ASCII' }],
  khaiNiem: ['report linter', 'Unicode regex'],
  tep: { 'find-vague.js': [DAU_L1, GIAI_L1] },
  kiem: [
    kiemVB({ en: 'example 1 (order of first appearance)', vi: 'ví dụ 1 (thứ tự xuất hiện)' }, () => { const r = findVague('The API is fast and quite stable.'); return JSON.stringify(r) === JSON.stringify(['fast', 'quite', 'stable']) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'Vietnamese words (the \\b trap)', vi: 'từ tiếng Việt (bẫy \\b)' }, () => { const r = findVague('Hệ thống khá ổn, chạy nhanh.'); return JSON.stringify(r) === JSON.stringify(['khá', 'ổn', 'nhanh']) ? 'OK' : 'got ' + JSON.stringify(r) + ' — \\b does not work with Vietnamese letters'; }),
    kiemVB({ en: 'whole words only, each once (“fastest” is not “fast”)', vi: 'chỉ từ trọn vẹn, mỗi từ một lần ("fastest" không phải "fast")' }, () => { const r = findVague('The fastest path is good, good enough.'); return JSON.stringify(r) === JSON.stringify(['good']) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'phrases and case-insensitivity', vi: 'cụm từ và không phân biệt hoa thường' }, () => { const a = findVague('We fixed A LOT of bugs, lots of them minor.'); const b = findVague('Some tests are SLOW.'); return JSON.stringify(a) === JSON.stringify(['a lot', 'lots of']) && JSON.stringify(b) === JSON.stringify(['some', 'slow']) ? 'OK' : 'got ' + JSON.stringify(a) + ' / ' + JSON.stringify(b); }),
    kiemVB({ en: 'a measurable sentence has no vague words', vi: 'câu đo được không có từ mơ hồ' }, () => { const r = findVague('p95 fell from 840 ms to 120 ms (index on bookings.user_id).'); return Array.isArray(r) && r.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'Vietnamese phrases', vi: 'cụm tiếng Việt' }, () => { const r = findVague('Một số ca test tương đối chậm.'); return JSON.stringify(r) === JSON.stringify(['một số', 'tương đối', 'chậm']) ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemVB({ en: 'no false hit at the end of “một”', vi: 'không khớp nhầm ở cuối chữ "một"' }, () => { const r = findVague('Một lần chạy, một kết quả.'); return Array.isArray(r) && r.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
  boYeu: [
    { ten: 'dùng \\b ASCII', tep: { 'find-vague.js': GIAI_L1.replace("'(?<![\\\\p{L}\\\\p{N}])' + escapeRe(w) + '(?![\\\\p{L}\\\\p{N}])', 'u'", "'\\\\b' + escapeRe(w) + '\\\\b', 'u'") }, phaiTruot: ['Vietnamese words'] },
    { ten: 'dùng includes (không ranh giới)', tep: { 'find-vague.js': GIAI_L1.replace('const m = re.exec(t);', 'const k = t.indexOf(w); const m = k >= 0 ? { index: k } : null;') }, phaiTruot: ['whole words only'] },
  ],
});

/* ─────────────── L2 — lintReport ─────────────── */
const DAU_L2 = `${VAGUE_SRC}
${BLAME_SRC}

/**
 * lintReport(md) → { ok, issues }   (issues: array of strings, any order; ok = issues.length === 0)
 *   MISSING_SECTION:<Summary|Method|Results|Conclusion>
 *   NO_TABLE
 *   FEW_NUMBERS
 *   VAGUE:<entry>
 *   BLAME:<entry>
 * See the statement for the exact rules.
 */
function lintReport(md) {
  return { ok: true, issues: [] };
}
`;
const GIAI_L2 = `${VAGUE_SRC}
${BLAME_SRC}

const SECTIONS = [
  ['Summary', ['summary', 'tóm tắt']],
  ['Method', ['method', 'phương pháp']],
  ['Results', ['results', 'kết quả']],
  ['Conclusion', ['conclusion', 'kết luận']],
];
const escapeRe = (s) => s.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
// Whole word/phrase in any language (\\b is ASCII-only in JavaScript).
const has = (text, w) => new RegExp('(?<![\\\\p{L}\\\\p{N}])' + escapeRe(w) + '(?![\\\\p{L}\\\\p{N}])', 'u').test(text);
const isHeading = (l) => /^\\s{0,3}#{1,6}\\s+/.test(l);
const isTableRow = (l) => /^\\s*\\|.*\\|\\s*$/.test(l);
const isSeparator = (l) => /^\\s*\\|?\\s*:?-{3,}:?\\s*(\\|\\s*:?-{3,}:?\\s*)*\\|?\\s*$/.test(l);

function lintReport(md) {
  const lines = String(md || '').split(/\\r?\\n/);
  const issues = [];

  // 1. required sections: a heading whose text STARTS with the name (EN or VI)
  const headings = lines.filter(isHeading).map((l) => l.replace(/^\\s*#+\\s+/, '').trim().toLowerCase());
  for (const [code, names] of SECTIONS) {
    if (!headings.some((h) => names.some((n) => h.startsWith(n)))) issues.push('MISSING_SECTION:' + code);
  }

  // 2. a table = a row "| … |" immediately followed by a separator row "|---|---|"
  const tableAt = lines.findIndex((l, i) => isTableRow(l) && i + 1 < lines.length && isSeparator(lines[i + 1]));
  if (tableAt < 0) issues.push('NO_TABLE');

  // body text = every line that is not a heading and not part of a table
  const body = lines.filter((l) => !isHeading(l) && !isTableRow(l) && !isSeparator(l)).join('\\n');

  // 3. numbers in the body text (the table alone is not enough)
  const numbers = body.match(/\\d+(?:[.,]\\d+)?%?/g) || [];
  if (numbers.length < 3) issues.push('FEW_NUMBERS');

  // 4–5. vague and blame words in the body text
  const low = body.toLowerCase();
  for (const w of VAGUE) if (has(low, w)) issues.push('VAGUE:' + w);
  for (const w of BLAME) if (has(low, w)) issues.push('BLAME:' + w);

  return { ok: issues.length === 0, issues };
}
`;
const BAO_CAO_TOT = `# Lab 3 — Integration Test Report (module A)

## Summary
16 of 22 integration cases pass in all 3 rounds (72.73%). The 6 failures are open defects.

## Method
Postman/Newman against Tomcat 10.1 and the SportShop_Test database, reset before every case.

## Results
| Round | Pass | Fail |
|---|---|---|
| R1 | 16 | 6 |
| R2 | 16 | 6 |
| R3 | 16 | 6 |

## Conclusion
Fix SS-28 first: IT17 shows one user can change another account's password.`;

const L2 = baiJs({
  tieuDe: 'Linter 2 — lintReport(): the whole report linter',
  doKho: 'HARD', phut: 35,
  moTa: {
    en: `<p>Write <code>lintReport(md)</code> for Markdown lab reports. It returns <code>{ ok, issues }</code>; <code>issues</code> is an array of codes (any order), <code>ok</code> is <code>issues.length === 0</code>.</p>
<ol>
<li><b>Required sections</b> — for each of Summary, Method, Results, Conclusion: some heading line (<code>#</code>…<code>######</code> + space) whose text, lower-cased, <b>starts with</b> the English name or its Vietnamese alias (<i>tóm tắt, phương pháp, kết quả, kết luận</i>). Otherwise <code>MISSING_SECTION:Summary</code> (English name in the code).</li>
<li><b>A results table</b> — a line <code>| … |</code> immediately followed by a separator line made of <code>|</code>, <code>-</code> (at least 3), <code>:</code> and spaces. Otherwise <code>NO_TABLE</code>.</li>
<li><b>Body text</b> = every line that is not a heading, not a table row and not a separator. If the body has fewer than <b>3 numbers</b> (matches of <code>/\\d+(?:[.,]\\d+)?%?/g</code>) ⇒ <code>FEW_NUMBERS</code> — numbers only inside the table do not count.</li>
<li>Each entry of <code>VAGUE</code> found in the body as a whole word/phrase (case-insensitive, any language) ⇒ <code>VAGUE:&lt;entry&gt;</code>; same with <code>BLAME</code> ⇒ <code>BLAME:&lt;entry&gt;</code>. Words in headings are ignored.</li>
</ol>
<p>Both lists are given in the starter. Reuse your idea from Linter 1.</p>`,
    vi: `<p>Viết <code>lintReport(md)</code> cho báo cáo lab Markdown, trả <code>{ ok, issues }</code> (issues là mảng mã, thứ tự tuỳ ý; ok = không có mã nào). Bốn luật: (1) đủ mục Summary/Method/Results/Conclusion — một dòng tiêu đề (<code>#</code>… + dấu cách) có chữ (viết thường) <b>bắt đầu bằng</b> tên tiếng Anh hoặc tên Việt (tóm tắt, phương pháp, kết quả, kết luận), thiếu ⇒ <code>MISSING_SECTION:&lt;tên Anh&gt;</code>; (2) có bảng — một dòng <code>| … |</code> ngay sau là dòng phân cách (<code>|</code>, ≥ 3 <code>-</code>, <code>:</code>, dấu cách), không có ⇒ <code>NO_TABLE</code>; (3) phần thân (bỏ tiêu đề, dòng bảng, dòng phân cách) có ít hơn <b>3 con số</b> ⇒ <code>FEW_NUMBERS</code> — số chỉ nằm trong bảng không tính; (4) mỗi mục VAGUE / BLAME có trong phần thân như từ trọn vẹn ⇒ <code>VAGUE:&lt;mục&gt;</code> / <code>BLAME:&lt;mục&gt;</code>; chữ trong tiêu đề bỏ qua.</p>`,
  },
  yeuCau: [
    { en: 'Compare codes exactly as specified (e.g. MISSING_SECTION:Results, VAGUE:a lot).', vi: 'Mã phải đúng y như đặc tả (vd MISSING_SECTION:Results, VAGUE:a lot).' },
    { en: 'Then run it on your own Report 5.3 summary before you submit it.', vi: 'Rồi chạy nó trên phần tóm tắt Report 5.3 của chính bạn trước khi nộp.' },
  ],
  viDu: [
    { input: 'lintReport(goodReport)   // the report in lint-report.js comments', output: '{ ok: true, issues: [] }', explanation: 'All four sections, a table, ≥ 3 numbers in the text, no vague or blame words.|||Đủ bốn mục, có bảng, ≥ 3 con số trong thân, không từ mơ hồ/đổ lỗi.' },
    { input: "lintReport('# Report\\n## Summary\\nTesting went fine, many tests pass.')", output: "{ ok: false, issues: ['MISSING_SECTION:Method', 'MISSING_SECTION:Results', 'MISSING_SECTION:Conclusion', 'NO_TABLE', 'FEW_NUMBERS', 'VAGUE:many'] }", explanation: '“fine” is not in the list — a linter is only as good as its word list.|||"fine" không có trong danh sách — linter chỉ giỏi bằng danh sách từ của nó.' },
  ],
  goiY: [
    'Tách dòng một lần; tạo ba hàm nhỏ isHeading / isTableRow / isSeparator rồi dùng lại.',
    'Bảng: tìm chỉ số i sao cho dòng i là hàng bảng và dòng i + 1 là dòng phân cách.',
    'Phần thân = lines.filter(dòng không phải tiêu đề, không phải bảng). Đếm số, tìm từ trên phần thân.',
    'Ranh giới từ Unicode như bài Linter 1 — \\b không dùng được với tiếng Việt.',
  ],
  loiHayGap: [
    'Đếm số trên cả văn bản ⇒ báo cáo chỉ có bảng mà vẫn qua FEW_NUMBERS.',
    'Coi mọi dòng có "|" là bảng ⇒ câu "A | B" trong văn bản thành bảng.',
    'Báo từ mơ hồ trong tiêu đề ("## Good practices") — luật nói bỏ qua tiêu đề.',
    'So khớp tiêu đề bằng "bằng" thay vì "bắt đầu bằng" ⇒ "## Results (round 3)" bị coi là thiếu.',
  ],
  giaiThich: {
    en: '<p>The linter is three small predicates and four rules over one list of lines. Excluding headings and tables from the body is what makes the rules meaningful: a report whose only numbers sit in a table still fails FEW_NUMBERS, because the reader of the summary never sees them. Remember the limit: it checks form, not truth — a report can pass with wrong numbers. That is why the capstone also checks the numbers against the real table.</p>',
    vi: '<p>Linter là ba hàm nhỏ và bốn luật trên một danh sách dòng. Loại tiêu đề và bảng khỏi phần thân là điều làm các luật có nghĩa: báo cáo chỉ có số trong bảng vẫn trượt FEW_NUMBERS, vì người đọc phần tóm tắt không thấy số nào. Nhớ giới hạn: nó kiểm hình thức, không kiểm đúng sai — báo cáo số sai vẫn qua. Vì vậy bài lớn còn đối chiếu số với bảng thật.</p>',
  },
  thuatNgu: [TN.linter, TN.vague, { en: 'Markdown table separator', vi: 'dòng phân cách bảng Markdown: |---|---|' }, { en: 'false positive', vi: 'báo nhầm — luật bắt cái không phải lỗi' }],
  khaiNiem: ['report linter', 'Markdown parsing'],
  tep: { 'lint-report.js': [`/* A report that passes:\n${BAO_CAO_TOT.replace(/\*\//g, '* /')}\n*/\n\n${DAU_L2}`, `/* A report that passes:\n${BAO_CAO_TOT.replace(/\*\//g, '* /')}\n*/\n\n${GIAI_L2}`] },
  kiem: [
    kiemVB({ en: 'a good report passes', vi: 'báo cáo tốt thì đạt' }, () => { const md = '# Lab 3 — Integration Test Report (module A)\n\n## Summary\n16 of 22 integration cases pass in all 3 rounds (72.73%). The 6 failures are open defects.\n\n## Method\nPostman/Newman against Tomcat 10.1 and the SportShop_Test database, reset before every case.\n\n## Results\n| Round | Pass | Fail |\n|---|---|---|\n| R1 | 16 | 6 |\n| R2 | 16 | 6 |\n| R3 | 16 | 6 |\n\n## Conclusion\nFix SS-28 first: IT17 shows one user can change another account\'s password.'; const r = lintReport(md); return r && r.ok === true && Array.isArray(r.issues) && r.issues.length === 0 ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'example 2: missing sections, no table, few numbers, vague word', vi: 'ví dụ 2: thiếu mục, không bảng, ít số, từ mơ hồ' }, () => { const r = lintReport('# Report\n## Summary\nTesting went fine, many tests pass.'); const w = ['MISSING_SECTION:Method', 'MISSING_SECTION:Results', 'MISSING_SECTION:Conclusion', 'NO_TABLE', 'FEW_NUMBERS', 'VAGUE:many']; return r && r.ok === false && JSON.stringify((r.issues || []).slice().sort()) === JSON.stringify(w.slice().sort()) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'Vietnamese headings and prefixes (“## Kết quả (round 3)”) count', vi: 'tiêu đề tiếng Việt và tiền tố ("## Kết quả (round 3)") được tính' }, () => { const md = '## Tóm tắt\n12 trên 18 ca đạt (66.67%) ở cả 3 round.\n## Phương pháp\nPlaywright, mỗi bước một ảnh.\n## Kết quả (round 3)\n| Ca | KQ |\n| --- | :---: |\n| RG01 | F |\n## Kết luận\nSửa SS-31 trước.'; const r = lintReport(md); return r && r.ok === true ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'numbers only inside the table ⇒ FEW_NUMBERS', vi: 'số chỉ nằm trong bảng ⇒ FEW_NUMBERS' }, () => { const md = '## Summary\nAll results are in the table.\n## Method\nPostman.\n## Results\n| R | P | F |\n|---|---|---|\n| 1 | 16 | 6 |\n| 2 | 16 | 6 |\n## Conclusion\nFix the open defects first.'; const r = lintReport(md); return r && JSON.stringify(r.issues) === JSON.stringify(['FEW_NUMBERS']) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: 'blame and phrase codes; words in headings ignored', vi: 'mã đổ lỗi và cụm từ; chữ trong tiêu đề bỏ qua' }, () => { const md = '## Summary — good news\n16 of 22 pass, 3 rounds, a lot of retesting.\n## Method\nNewman.\n## Results\n| a | b |\n|---|---|\n| 1 | 2 |\n## Conclusion\nThe failure was the fault of the dev team.'; const r = lintReport(md); const w = ['VAGUE:a lot', 'BLAME:fault of']; return r && JSON.stringify((r.issues || []).slice().sort()) === JSON.stringify(w.slice().sort()) ? 'OK' : 'got ' + JSON.stringify(r); }),
    kiemVB({ en: '“A | B” in a sentence is not a table', vi: '"A | B" trong câu không phải bảng' }, () => { const md = '## Summary\nWe compared Postman | Newman on 22 cases in 3 rounds.\n## Method\nx\n## Results\ny\n## Conclusion\nz'; const r = lintReport(md); return r && (r.issues || []).indexOf('NO_TABLE') >= 0 ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
    kiemVB({ en: 'Vietnamese vague words in the body (Unicode boundaries)', vi: 'từ mơ hồ tiếng Việt trong phần thân (ranh giới Unicode)' }, () => { const md = '## Tóm tắt\nHệ thống khá ổn: 16/22 ca, 3 round.\n## Phương pháp\nNewman.\n## Kết quả\n| a | b |\n|---|---|\n| 1 | 2 |\n## Kết luận\nMột lần chạy, một kết quả.'; const r = lintReport(md); const w = ['VAGUE:khá', 'VAGUE:ổn']; return r && JSON.stringify((r.issues || []).slice().sort()) === JSON.stringify(w.slice().sort()) ? 'OK' : 'got ' + JSON.stringify(r); }, { an: true }),
  ],
  boYeu: [
    { ten: 'đếm số trên cả văn bản (kể cả bảng)', tep: { 'lint-report.js': `/* weak */\n${GIAI_L2.replace("const numbers = body.match(", "const numbers = lines.join('\\n').match(")}` }, phaiTruot: ['numbers only inside the table'] },
    { ten: 'mọi dòng có | là bảng', tep: { 'lint-report.js': `/* weak */\n${GIAI_L2.replace("const tableAt = lines.findIndex((l, i) => isTableRow(l) && i + 1 < lines.length && isSeparator(lines[i + 1]));", "const tableAt = lines.findIndex((l) => l.indexOf('|') >= 0);")}` }, phaiTruot: ['is not a table'] },
    { ten: 'so khớp tiêu đề bằng ===', tep: { 'lint-report.js': `/* weak */\n${GIAI_L2.replace('names.some((n) => h.startsWith(n))', 'names.some((n) => h === n)')}` }, phaiTruot: ['Vietnamese headings'] },
  ],
});

export default moDun({
  slug: 'ssg105-3-5-report-linter',
  ten: '3.5 Build a report linter (vague words, sections, numbers, blame)',
  moTaModule: 'Tự viết findVague() tìm từ mơ hồ Anh–Việt bằng ranh giới Unicode (bẫy \\b ASCII từng làm hỏng phụ đề của web), rồi lintReport() cho báo cáo Markdown: đủ Summary/Method/Results/Conclusion (nhận tên Việt), có bảng, ≥ 3 con số ngoài bảng, không từ mơ hồ, không đổ lỗi.',
  baiHoc: 'ssg105-3-1-writing',
  de: [L1, L2],
});
