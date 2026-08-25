/**
 * build-fe-exam.mjs — GENERIC builder for a Final-Exam (FE) MCQ deck.
 *
 * Reads a BILINGUAL "bank" JSONL (one solved question per line) plus an
 * image-URL map, then emits a content/exams/<CODE>.mjs spec ready for
 * scripts/academy-seed-exam.mjs. Generalized from build-pro192-exam.mjs so it
 * works for ANY subject (FER202, ITE302c, SWR302, SWT301, …) without a
 * per-deck script.
 *
 * Bank line schema (all text is plain — escaping/highlighting done here):
 *   {
 *     "n": 1,                       // question number, matches image "01 [id]"
 *     "q_en": "…", "q_vi": "…",     // question stem (\n allowed → <br/>)
 *     "code": "…",                  // OPTIONAL fenced code, shared by both langs
 *     "lang": "javascript",         // OPTIONAL highlight language (auto if absent)
 *     "opts_en": ["A","B",…],          // plain text/HTML option, OR:
 *     "opts_en": [{"code":"…","lang":"js"}, …],  // a per-option code snippet
 *                                        // (each option gets its OWN highlighted
 *                                        // <pre><code> block — matches the
 *                                        // established WF-PT2/NODEJS-FE pattern.
 *                                        // Mix plain strings and code objects
 *                                        // freely within the same options array.)
 *     "opts_vi": ["A","B",…],           // omit to reuse opts_en (code options
 *                                        // are language-agnostic already)
 *     "ans": [1],                   // 0-based correct index(es)
 *     "multi": false,               // true → "choose N" question
 *     "expl_en": "…", "expl_vi": "…",
 *     "conf": "high"                // high|med|low (low → flagged in stderr)
 *   }
 *
 * Math: write it as LaTeX ($…$, $$…$$) in q_/expl_ — the frontend runs KaTeX.
 * Diagrams: put a mermaid block in `code` with lang "mermaid".
 *
 *   node scripts/build-fe-exam.mjs \
 *     --bank scratch/fer202-fe1.jsonl \
 *     --images scratch/fer202-fe1-image-urls.json \
 *     --course FER202 \
 *     --code FE1-SP26-B5FE \
 *     --title "FER202 — Final Exam Đề 1 (SP26 B5FE)|||FER202 — Đề thi cuối kỳ số 1 (SP26 B5FE)" \
 *     --desc "EN desc|||VI desc" \
 *     --duration 60 --points 10 --pass 4 \
 *     --instructions-subject "React / Front-end development" \
 *     --out content/exams/FER202-FE1.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import hljs from 'highlight.js';

const args = process.argv.slice(2);
const val = (f, d) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : d; };

const BANK = val('--bank');
const IMAGES = val('--images');
const COURSE = val('--course');
const CODE = val('--code');
const TITLE = val('--title');
const DESC = val('--desc', '');
const OUT = val('--out');
const DURATION = parseInt(val('--duration', '60'), 10);
const POINTS = parseFloat(val('--points', '10'));
const PASS = parseFloat(val('--pass', '4'));
const SOURCE = val('--source', 'REAL');
const SUBJECT = val('--instructions-subject', 'this subject');
const KIND = val('--kind', 'FE'); // FE | PT | ME — nhãn loại đề
const EXAM_LABEL_EN = KIND === 'PT' ? 'Progress Test' : KIND === 'ME' ? 'Mid-term Exam' : 'Final Exam';
const EXAM_LABEL_VI = KIND === 'PT' ? 'bài kiểm tra tiến độ (Progress Test)' : KIND === 'ME' ? 'thi giữa kỳ (Mid-term Exam)' : 'thi cuối kỳ (Final Exam)';

if (!BANK || !COURSE || !CODE || !TITLE || !OUT) {
  console.error('cần --bank --course --code --title --out (tuỳ chọn --images --desc --duration --points --pass --source --instructions-subject)');
  process.exit(1);
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Escape HTML but KEEP $…$ / $$…$$ math segments verbatim so KaTeX can render
// them (escaping < > inside math would corrupt e.g. \lt, and escaping is not
// needed there anyway — KaTeX reads raw text).
const MATH_SEG = /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g;
function escKeepMath(s) {
  return String(s).split(MATH_SEG).map((part, i) => (i % 2 ? part : esc(part))).join('');
}

function textToHtml(s) {
  // paragraphs on blank lines, <br/> on single newlines
  return String(s).trim().split(/\n{2,}/).map((p) =>
    `<p>${escKeepMath(p).replace(/\n/g, '<br/>')}</p>`).join('');
}

function codeBlockHtml(code, lang) {
  if (lang === 'mermaid') {
    return `<pre class="mermaid">${esc(code)}</pre>`;
  }
  let highlighted;
  try {
    highlighted = lang
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value;
  } catch {
    highlighted = esc(code);
  }
  const cls = lang && lang !== 'mermaid' ? ` class="language-${esc(lang)}"` : '';
  return `<pre><code${cls}>${highlighted}</code></pre>`;
}

function promptHtml(q) {
  const build = (text) => {
    let html = textToHtml(text);
    if (q.code) html += codeBlockHtml(q.code, q.lang);
    return html;
  };
  // ml-en / ml-vi blocks (no "|||" split hazard when code contains pipes).
  return `<div class="ml-en">${build(q.q_en)}</div><div class="ml-vi">${build(q.q_vi || q.q_en)}</div>`;
}

function optionText(en, vi) {
  // A code-snippet option: { code, lang } → its own highlighted <pre><code>
  // block, one per option (matches the established WF-PT2/NODEJS-FE pattern).
  // Code is language content, not prose, so EN/VI render identically.
  if (en && typeof en === 'object' && 'code' in en) {
    const html = codeBlockHtml(en.code, en.lang);
    return `${html}|||${html}`;
  }
  // options are short → pipe form; render inline. Keep math, escape rest.
  return `${escKeepMath(en)}|||${escKeepMath(vi || en)}`;
}

function explHtml(q) {
  const en = q.expl_en ? `<div class="ml-en">${textToHtml(q.expl_en)}</div>` : '';
  const vi = q.expl_vi ? `<div class="ml-vi">${textToHtml(q.expl_vi)}</div>` : '';
  return (en + vi) || null;
}

function instructions() {
  return (
    '<div class="ml-en">' +
    `<p>This is a real FPTU <b>${EXAM_LABEL_EN}</b> paper for <b>${esc(SUBJECT)}</b>. Every question is <b>multiple choice</b> and auto-graded.</p>` +
    '<ul>' +
    '<li>Some questions say "choose TWO" — they are only correct when both right answers are selected.</li>' +
    '<li>Read code, tables and diagrams carefully; several questions turn on a subtle detail.</li>' +
    '<li>The original scanned question is available under <b>"Show original image"</b> on each question.</li>' +
    '</ul>' +
    '<p>You can flag a question and come back. The timer auto-submits at the end. After you submit, every question shows a bilingual explanation.</p>' +
    '</div>' +
    '<div class="ml-vi">' +
    `<p>Đây là đề <b>${EXAM_LABEL_VI}</b> thật của FPTU môn <b>${esc(SUBJECT)}</b>. Mọi câu đều là <b>trắc nghiệm</b>, chấm tự động.</p>` +
    '<ul>' +
    '<li>Một số câu ghi "chọn HAI" — chỉ đúng khi chọn đủ cả hai đáp án đúng.</li>' +
    '<li>Đọc kỹ code, bảng và sơ đồ; nhiều câu ăn thua ở một chi tiết nhỏ.</li>' +
    '<li>Ảnh đề gốc đã quét nằm ở nút <b>"Xem ảnh đề gốc"</b> trên mỗi câu.</li>' +
    '</ul>' +
    '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều có lời giải song ngữ.</p>' +
    '</div>'
  );
}

const lines = fs.readFileSync(BANK, 'utf8').split('\n').filter((l) => l.trim());
const bank = lines.map((l, i) => { try { return JSON.parse(l); } catch (e) { throw new Error(`bank line ${i + 1} không phải JSON: ${e.message}`); } });
bank.sort((a, b) => (a.n || 0) - (b.n || 0));

const imgMap = IMAGES && fs.existsSync(IMAGES) ? JSON.parse(fs.readFileSync(IMAGES, 'utf8')) : {};

const pointsPer = +(POINTS / bank.length).toFixed(4);

const questions = bank.map((q) => {
  if (!Array.isArray(q.ans) || !q.ans.length) console.error(`⚠ câu ${q.n}: thiếu ans`);
  if (q.conf === 'low') console.error(`⚠ câu ${q.n}: độ tin cậy THẤP — nên xem lại`);
  const nOpts = (q.opts_en || []).length;
  const bad = (q.ans || []).some((a) => a < 0 || a >= nOpts);
  if (bad) console.error(`✗ câu ${q.n}: ans nằm ngoài số phương án (${nOpts})`);
  return {
    kind: 'MCQ',
    points: pointsPer,
    prompt: promptHtml(q),
    imageUrl: imgMap[String(q.n)] || null,
    options: (q.opts_en || []).map((en, i) => ({ text: optionText(en, (q.opts_vi || [])[i]) })),
    correctIndexes: q.ans || [],
    explanation: explHtml(q),
  };
});

const spec = {
  course: { courseCode: COURSE },
  exams: [{
    // Frontend chỉ render kind 'FE' (MCQ tự chấm) và 'PE' (thực hành). PT/ME
    // vẫn là đề trắc nghiệm nên LƯU kind='FE' và phân biệt bằng code/title —
    // đúng quy ước WF-PT1 (kind='FE', code='PT1') và Reading (code='READ-').
    // --kind chỉ đổi CHỮ trong hướng dẫn (Final Exam / Progress Test), không
    // đổi kind lưu xuống.
    kind: 'FE',
    code: CODE,
    title: TITLE,
    description: DESC || undefined,
    durationMinutes: DURATION,
    totalPoints: POINTS,
    passMark: PASS,
    source: SOURCE,
    shuffleQuestions: false,
    shuffleOptions: false,
    instructions: instructions(),
    isPublished: true,
    questions,
  }],
};

const banner = `// AUTO-GENERATED by scripts/build-fe-exam.mjs from ${path.basename(BANK)} — re-run the builder, do not hand-edit.\n`;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, banner + 'export default ' + JSON.stringify(spec, null, 2) + ';\n');

const withImg = questions.filter((q) => q.imageUrl).length;
console.log(`✓ ${OUT} — ${questions.length} câu, ${withImg} có ảnh gốc, ${pointsPer}đ/câu`);
const low = bank.filter((q) => q.conf === 'low').map((q) => q.n);
if (low.length) console.log(`  ⚠ câu tin cậy thấp: ${low.join(', ')}`);
