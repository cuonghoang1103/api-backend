/**
 * SWT301 · Practical Exam (PE) — past papers & worked solutions.
 *
 * Sources: /Users/admin/Documents/SWT301/01.Materials/03.PE
 *   PE1.jpg      → deck pe1     SWT301_SU24_PE1_404208 (the jpg holds the same 4-page paper TWICE,
 *                                 once footed "Page n|n" and once "Page n|4" — only pages 1–4 were published)
 *   PE2.jpg      → deck pe2     SWT301 FALL24 — The final PE (6 pages)
 *   PE4/SP25.jpg → deck pe-sp25 SWT301 SPRING25 — The final PE, Online Travel Booking (5 pages)
 *   PE3/SWT301_FA23.docx + "SWT301_FA23 template.xlsx" (the official answer workbook) → transcribed as text
 *   SP26/        → empty folder (no paper yet)
 * The tall screenshots were cut into ~1650-px pages on white gaps (sharp, width 1280, WebP q82) and uploaded to
 * images/academy/SWT301/v1/<deck>/NNN.webp.
 * Every program output, coverage count, V(G) and boundary value below was produced by running the code
 * (JDK 21 + JUnit 4.13.2) or a script — see the "real output" blocks.
 */
import { DECKS, img, bi, books, registerDeck } from './_slides.mjs';

registerDeck('pe1', { code: 'PE paper 1', en: 'SWT301_SU24_PE1 — Fibonacci · income tax · BMI', vi: 'Đề SWT301_SU24_PE1 — Fibonacci · thuế TNCN · BMI', total: 4, w: 1280, h: 1650 });
registerDeck('pe2', { code: 'PE paper 2', en: 'SWT301 FALL24 final PE — FileProcessor · OrderCalculator · shopping use case', vi: 'Đề PE cuối kỳ FALL24 — FileProcessor · OrderCalculator · use case mua hàng', total: 6, w: 1280, h: 1650 });
registerDeck('pe-sp25', { code: 'PE SP25', en: 'SWT301 SPRING25 final PE — TravelEase', vi: 'Đề PE cuối kỳ SPRING25 — TravelEase', total: 5, w: 1280, h: 1650 });
registerDeck('pe-fa23', { code: 'FA23 docx', en: 'Pictures embedded in SWT301_FA23.docx', vi: 'Ảnh gốc trong file SWT301_FA23.docx', total: 3, w: 1386, h: 942 });

/* ───────────── helpers (all markup is plain HTML using classes that already exist) ───────────── */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const trim = (s) => s.replace(/^\n+/, '').replace(/\s+$/, '');
/** Code listing with the SAME line numbers as the paper (so "Line" in the answer sheet can be checked). */
const numbered = (src) => '<pre><code>' + trim(src).split('\n').map((l, i) => String(i + 1).padStart(2, ' ') + '  ' + esc(l)).join('\n') + '</code></pre>';
const code = (src) => '<pre><code>' + esc(trim(src)) + '</code></pre>';
const attr = (s) => String(s).replace(/<[^>]+>/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** One page of a scanned paper: the picture (shared) + EN/VI notes. */
function page(deck, n, title, en, vi) {
  const d = DECKS[deck];
  if (n < 1 || n > d.total) throw new Error(`${deck} has ${d.total} pages, got ${n}`);
  return `<div class="anh-slide"><img src="${img(deck, n)}" alt="${attr(`${d.code} page ${n}: ${title}`)}" loading="lazy" width="${d.w}" height="${d.h}" />` +
    `<p class="chu-thich">📄 <strong>${d.code}</strong> · page ${n}/${d.total} — ${title}</p></div>\n` +
    `<div class="ml-en giang">${en}</div>\n<div class="ml-vi giang">${vi}</div>`;
}
const pages = (deck, rows) => rows.map((r) => page(deck, ...r)).join('\n');

/** Shared (language-neutral) block: what you would actually type into the template — always English. */
const sheet = (label, html) => `<div class="callout ok"><strong>📝 ${label}</strong></div>\n${html}`;
const tbl = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
  rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';

/**
 * The "Q2 template" unit-test grid (sheet "Q2 template" of SWT301_FA23 template.xlsx).
 * marks strings have one char per UTCID: "O" = applies, "." = empty.
 * The summary counts (Passed/Failed/Untested, N/A/B, Total) are COMPUTED from the columns.
 */
function utGrid(s) {
  const n = s.ids.length;
  const chk = (m, what) => { if (m.length !== n) throw new Error(`${s.fname}: marks "${m}" for ${what} must have ${n} chars`); return m; };
  const marks = (m, what) => chk(m, what).split('').map((c) => `<td style="text-align:center">${c === 'O' ? 'O' : ''}</td>`).join('');
  const row = (sec, item, val, m) => `<tr><td><strong>${sec}</strong></td><td>${item}</td><td>${val}</td>${marks(m, item + ' ' + val)}</tr>`;
  const type = chk(s.type, 'type'); const res = chk(s.result || 'P'.repeat(n), 'result');
  const cnt = (str, ch) => str.split('').filter((c) => c === ch).length;
  const P = cnt(res, 'P'), F = cnt(res, 'F'), U = n - P - F;
  let body = '';
  s.pre.forEach(([t, m], i) => { body += row(i ? '' : 'Condition', 'Precondition', t, m); });
  for (const [param, vals] of s.inputs) vals.forEach(([v, m], i) => { body += row('', i ? '' : `Input: <code>${param}</code>`, v, m); });
  s.ret.forEach(([v, m], i) => { body += row(i ? '' : 'Confirm', i ? '' : 'Return', v, m); });
  (s.exc || []).forEach(([v, m], i) => { body += row('', i ? '' : 'Exception', v, m); });
  (s.log || []).forEach(([v, m], i) => { body += row('', i ? '' : 'Log message', v, m); });
  body += `<tr><td><strong>Result</strong></td><td>Type (N: Normal, A: Abnormal, B: Boundary)</td><td></td>${type.split('').map((c) => `<td style="text-align:center">${c}</td>`).join('')}</tr>`;
  body += `<tr><td></td><td>Passed/Failed</td><td></td>${res.split('').map((c) => `<td style="text-align:center">${c === 'P' ? 'P' : c === 'F' ? 'F' : ''}</td>`).join('')}</tr>`;
  body += `<tr><td></td><td>Executed Date</td><td></td>${s.ids.map(() => `<td style="text-align:center">${s.date || ''}</td>`).join('')}</tr>`;
  body += `<tr><td></td><td>Defect ID</td><td></td>${s.ids.map((_, i) => `<td style="text-align:center">${(s.defects || {})[i] || ''}</td>`).join('')}</tr>`;
  const head = `<div class="table-wrap"><table><tbody>
<tr><th>Function Code</th><td>${s.fcode}</td><th>Function Name</th><td>${s.fname}</td></tr>
<tr><th>Created By</th><td>&lt;your name&gt;</td><th>Executed By</th><td>&lt;your name&gt;</td></tr>
<tr><th>Lines of code</th><td>${s.loc}</td><th>Lack of test cases</th><td>0</td></tr>
<tr><th>Test requirement</th><td colspan="3">${s.req}</td></tr>
<tr><th>Passed / Failed / Untested</th><td>${P} / ${F} / ${U}</td><th>N / A / B · Total Test Cases</th><td>${cnt(type, 'N')} / ${cnt(type, 'A')} / ${cnt(type, 'B')} · ${n}</td></tr>
</tbody></table></div>`;
  return head + `<div class="table-wrap"><table><thead><tr><th colspan="3"></th>${s.ids.map((id) => `<th>${id}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/** Table 3.1 — returns {html, tags}. rows: {c, vp:[[text,tag]], ip, vb, ib}. */
function t31(rows) {
  const tags = [];
  let body = '';
  for (const r of rows) {
    const cols = [r.vp || [], r.ip || [], r.vb || [], r.ib || []];
    const h = Math.max(1, ...cols.map((c) => c.length));
    for (const c of cols) for (const [, t] of c) { if (tags.includes(t)) throw new Error('duplicate tag ' + t); tags.push(t); }
    for (let i = 0; i < h; i++) {
      body += '<tr>' + (i === 0 ? `<td rowspan="${h}"><strong>${r.c}</strong></td>` : '') +
        cols.map((c) => (c[i] ? `<td>${c[i][0]}</td><td>${c[i][1]}</td>` : '<td></td><td></td>')).join('') + '</tr>';
    }
  }
  const head = ['Condition', 'Valid Partitions', 'Tag', 'Invalid Partitions', 'Tag', 'Valid Boundaries', 'Tag', 'Invalid Boundaries', 'Tag'];
  return { tags, html: `<div class="table-wrap"><table><thead><tr>${head.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div>` };
}

/** Table 3.2 + an automatic tag-coverage check. cases: [[no, description, expected, 'VP1, IB2']]. */
function t32(cases, allTags, extra = []) {
  const parse = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
  const cover = (list) => { const set = new Set(); for (const c of list) for (const t of parse(c[3])) { if (!allTags.includes(t)) throw new Error('unknown tag ' + t + ' in case ' + c[0]); set.add(t); } return set; };
  const s10 = cover(cases), sAll = cover([...cases, ...extra]);
  const miss = allTags.filter((t) => !s10.has(t));
  const pct = (k) => (100 * k / allTags.length).toFixed(1);
  const table = tbl(['Test-case No', 'Description (test data)', 'Expected result', 'TAG'], cases.map((c) => [c[0], c[1], c[2], c[3]]));
  const en = `<p><strong>Tag-coverage check (computed from the table above):</strong> the ${cases.length} cases cover <strong>${s10.size} of ${allTags.length} tags (${pct(s10.size)}%)</strong>.` +
    (miss.length ? ` Not covered: ${miss.join(', ')}.` : ' Every tag is covered.') +
    (extra.length ? ` Adding the ${extra.length} extra cases below raises it to <strong>${sAll.size}/${allTags.length} (${pct(sAll.size)}%)</strong>.` : '') + '</p>';
  const vi = `<p><strong>Kiểm tra độ phủ tag (tính tự động từ bảng trên):</strong> ${cases.length} ca phủ <strong>${s10.size}/${allTags.length} tag (${pct(s10.size)}%)</strong>.` +
    (miss.length ? ` Chưa phủ: ${miss.join(', ')}.` : ' Mọi tag đều được phủ.') +
    (extra.length ? ` Thêm ${extra.length} ca bổ sung bên dưới thì lên <strong>${sAll.size}/${allTags.length} (${pct(sAll.size)}%)</strong>.` : '') + '</p>';
  const ext = extra.length ? tbl(['Extra case', 'Description (test data)', 'Expected result', 'TAG'], extra.map((c) => [c[0], c[1], c[2], c[3]])) : '';
  return { table, check: bi(en, vi), ext };
}

/** Table 3.3 — cases: [[id, description, precondition, [steps], expected]]. */
function t33(module, cases) {
  const n = cases.length;
  const head = `<div class="table-wrap"><table><tbody>
<tr><th>Module Code</th><td>${module}</td><th>Pass / Fail / Untested / N/A</th><td>0 / 0 / ${n} / 0</td></tr>
<tr><th>Tester</th><td>&lt;your name&gt;</td><th>Percent Complete · Number of cases</th><td>0% · ${n}</td></tr>
</tbody></table></div>`;
  return head + tbl(['ID', 'Test Case Description', 'Pre-Condition', 'Test Case Procedure', 'Expected Output', 'Result', 'Bug#', 'Test date', 'Note'],
    cases.map(([id, d, pre, steps, exp, note]) => [id, d, pre, steps.map((x, i) => `${i + 1}. ${x}`).join('<br>'), exp, 'Untested', '', '', note || '']));
}

/* ═════════════════════════ PE-0 How the SWT301 PE works ═════════════════════════ */
const L0 = {
  title: 'PE-0 — How the SWT301 Practical Exam works: format, templates, marking, time plan|||PE-0 — Bài thi thực hành SWT301: hình thức, template, cách chấm, chia thời gian',
  slug: 'swt301-pe-how-it-works',
  type: 'DOCUMENT',
  description: 'Toàn cảnh bài PE SWT301: 90 phút, không IDE, làm trên template Excel/Word, chấm 3+3+4, điểm 0 khi lạc đề; bản đồ 4 đề cũ ↔ phòng thi; cách làm Q1/Q2/Q3; 12 lỗi mất điểm hay gặp nhất.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-0 · four past papers from 01.Materials/03.PE</span>
<h2>How the SWT301 Practical Exam works</h2>
<p class="lead">The Practical Exam (PE) is <strong>25% of your final grade and must be ≥ 4.0</strong>, otherwise you fail the course regardless of everything else.</p>
<p>It is not a coding exam. You do three things, and you write every answer <strong>in English into an official template</strong>:</p>
<ul>
<li><strong>Review code</strong> — find the defects, with line numbers and fixes.</li>
<li><strong>Design white-box unit tests</strong> — the minimum set for a coverage target.</li>
<li><strong>Design black-box test cases</strong> — partitions, boundaries, concrete data.</li>
</ul>
<p>This lesson, in four parts:</p>
<ol>
<li>the format of the exam;</li>
<li>the answer template, sheet by sheet;</li>
<li>a minute-by-minute time plan;</li>
<li>the twelve mistakes that cost students the most marks.</li>
</ol>
<p>Lessons PE-1 to PE-4 then solve four real papers completely.</p>
<div class="callout"><strong>Learning objectives exercised by the PE.</strong>
<ul>
<li><strong>Q1</strong> — LO-3.2.4 apply a review technique to a work product (K3).</li>
<li><strong>Q2</strong> — LO-4.3.1 statement coverage and LO-4.3.2 decision coverage (K2, but in the PE you must actually <em>produce</em> the tests).</li>
<li><strong>Q3</strong> — LO-4.2.1 equivalence partitioning and LO-4.2.2 boundary value analysis (K3).</li>
<li><strong>Newer papers add</strong> — LO-4.2.5 use-case testing (K2) and LO-5.2.2 test strategies (K2).</li>
</ul></div>
<h3>The format at a glance</h3>
<table>
<thead><tr><th>Item</th><th>What the papers say</th></tr></thead>
<tbody>
<tr><td>Duration</td><td>90 min (FA23, SU24 PE1) · 85 min (FALL24; also the figure in the course syllabus) · 80 min (SPRING25)</td></tr>
<tr><td>Questions &amp; points</td><td>Classic papers: <strong>Q1 3 + Q2 3 + Q3 4</strong> = 10. FALL24: 3 + 5 + 2. SPRING25: four questions, 3 + 3 + 2 + 2.</td></tr>
<tr><td>Tools</td><td>FA23 and SU24: <strong>no IDE</strong> (NetBeans, IntelliJ…). FALL24 explicitly <em>allows</em> an IDE; SPRING25 says nothing. Prepare as if you have no IDE — you must be able to compute coverage and expected results on paper.</td></tr>
<tr><td>Answer file</td><td>FA23 / SU24: the provided <strong>Excel template</strong> (sheets Q1, Q2, Q3.1, Q3.2, Q3.3). FALL24 / SPRING25: <strong>one Word document</strong>, no other format accepted.</td></tr>
<tr><td>Zero rules</td><td>"You will get 0 for any answer which contains information irrelevant to the corresponding question." SU24 adds: answers must be in English, must reflect <em>this</em> paper, and not using the template = the whole exam gets 0.</td></tr>
<tr><td>Pass condition</td><td>PE ≥ 4.0 is a hard blocker (course rules in lesson 0); PE and TE (theory MCQ) together make up the Final (50%).</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Thi thực hành · Bài PE-0 · bốn đề cũ trong 01.Materials/03.PE</span>
<h2>Bài thi thực hành (PE) SWT301 diễn ra thế nào</h2>
<p class="lead">Bài thi thực hành (PE) chiếm <strong>25% điểm tổng kết và phải ≥ 4.0</strong>, nếu không thì trượt môn dù các cột khác cao đến đâu.</p>
<p>Đây không phải bài thi code. Bạn làm ba việc, và viết mọi câu trả lời <strong>bằng tiếng Anh vào template chính thức</strong>:</p>
<ul>
<li><strong>Review code</strong> — tìm defect, kèm số dòng và cách sửa.</li>
<li><strong>Thiết kế unit test hộp trắng</strong> — bộ test tối thiểu cho một mục tiêu độ phủ.</li>
<li><strong>Thiết kế test case hộp đen</strong> — phân vùng, giá trị biên, dữ liệu cụ thể.</li>
</ul>
<p>Bài này gồm bốn phần:</p>
<ol>
<li>hình thức thi;</li>
<li>template bài làm, từng sheet một;</li>
<li>kế hoạch chia thời gian theo từng phút;</li>
<li>mười hai lỗi làm sinh viên mất nhiều điểm nhất.</li>
</ol>
<p>Các bài PE-1 đến PE-4 sau đó giải trọn vẹn bốn đề thật.</p>
<div class="callout"><strong>Chuẩn đầu ra được kiểm tra trong PE.</strong>
<ul>
<li><strong>Q1</strong> — LO-3.2.4 áp dụng một kỹ thuật review cho sản phẩm công việc (K3).</li>
<li><strong>Q2</strong> — LO-4.3.1 statement coverage và LO-4.3.2 decision coverage (K2, nhưng trong PE bạn phải thực sự <em>tạo ra</em> bộ test).</li>
<li><strong>Q3</strong> — LO-4.2.1 phân vùng tương đương và LO-4.2.2 phân tích giá trị biên (K3).</li>
<li><strong>Các đề mới thêm</strong> — LO-4.2.5 kiểm thử theo use case (K2) và LO-5.2.2 chiến lược kiểm thử (K2).</li>
</ul></div>
<h3>Hình thức thi trong một bảng</h3>
<table>
<thead><tr><th>Mục</th><th>Các đề ghi gì</th></tr></thead>
<tbody>
<tr><td>Thời gian</td><td>90 phút (FA23, SU24 PE1) · 85 phút (FALL24; cũng là con số trong syllabus môn) · 80 phút (SPRING25)</td></tr>
<tr><td>Câu hỏi &amp; điểm</td><td>Đề kiểu cũ: <strong>Q1 3 + Q2 3 + Q3 4</strong> = 10. FALL24: 3 + 5 + 2. SPRING25: bốn câu, 3 + 3 + 2 + 2.</td></tr>
<tr><td>Công cụ</td><td>FA23 và SU24: <strong>không được dùng IDE</strong> (NetBeans, IntelliJ…). FALL24 ghi rõ <em>được</em> dùng IDE; SPRING25 không nhắc. Hãy chuẩn bị như thể không có IDE — bạn phải tự tính được độ phủ và kết quả mong đợi trên giấy.</td></tr>
<tr><td>File bài làm</td><td>FA23 / SU24: <strong>template Excel</strong> được phát (các sheet Q1, Q2, Q3.1, Q3.2, Q3.3). FALL24 / SPRING25: <strong>một file Word duy nhất</strong>, không nhận định dạng khác.</td></tr>
<tr><td>Luật điểm 0</td><td>"Câu trả lời nào chứa thông tin không liên quan tới câu hỏi sẽ bị 0 điểm." Đề SU24 thêm: phải viết tiếng Anh, phải bám đúng đề <em>này</em>, và không dùng template = cả bài 0 điểm.</td></tr>
<tr><td>Điều kiện qua</td><td>PE ≥ 4.0 là điều kiện chặn cứng (quy chế môn ở bài 0); PE cùng TE (trắc nghiệm lý thuyết) tạo thành cột Final (50%).</td></tr>
</tbody>
</table>`),
    bi(`<h2>🗂️ The four papers in this section — and where to practise them timed</h2>
<table>
<thead><tr><th>Lesson</th><th>Source file</th><th>Q1</th><th>Q2</th><th>Q3 (Q4)</th><th>Same questions in the Exam room</th></tr></thead>
<tbody>
<tr><td>PE-1</td><td>PE3/SWT301_FA23.docx + template.xlsx</td><td>AverageCalculator review (3)</td><td>countCharacters unit tests (3)</td><td>"Create the inspection decision" EP/BVA (4)</td><td><strong>SWT301-PE8</strong> "Practical Exam Đề 8 (PE - SP 2024 - Block 5)" has all three; SWT301-PE9 (FALL24 - PE3) reuses Q1+Q3; SWT301-PE18 (FA 2023 - PE1.2) reuses Q2</td></tr>
<tr><td>PE-2</td><td>PE1.jpg — SWT301_SU24_PE1</td><td>Fibonacci review (3)</td><td>fncPersonalIncomeTax flowchart (3)</td><td>BMI Calculator EP/BVA (4)</td><td><strong>SWT301-PE14</strong> "Practical Exam Đề 14 (SU 2024 - PE1)"</td></tr>
<tr><td>PE-3</td><td>PE2.jpg — FALL24 final PE</td><td>fileProcessor defect report (3)</td><td>OrderCalculator JUnit, EP/BVA + branches (5)</td><td>Online shopping use case (2)</td><td><strong>SWT301-PE11</strong> "Practical Exam Đề 11 (FA 2024 - PE1)"</td></tr>
<tr><td>PE-4</td><td>PE4/SP25.jpg — SPRING25 final PE</td><td>Test strategy (3)</td><td>TravelBooking review (3)</td><td>calculateRewardPoints (2) · system test cases (2)</td><td><strong>SWT301-PE7</strong> "Practical Exam Đề 7 (PE - SP 2025)"</td></tr>
</tbody>
</table>
<ul>
<li><strong>No Spring 2026 paper yet</strong> — the folder <code>03.PE/SP26</code> is <strong>empty</strong>.</li>
<li><strong>What the ids are</strong> — the deck files of the site's <strong>Exam room</strong>.</li>
<li><strong>How to find a paper</strong> — Exam-room pages live at <code>/exam/&lt;number&gt;</code>, and that number is a database id assigned when the exams are loaded, so there is no fixed link. Open <strong>/exam</strong>, filter by SWT301 and pick the paper by its title.</li>
<li><strong>Timing</strong> — the Exam room gives every PE 90 minutes and grades your written answers with an AI rubric. When you practise, set your own timer to the real value (85 or 80 minutes for the newer papers).</li>
</ul>
<div class="callout ok"><strong>The same questions come back.</strong> The FA23 docx questions appear again in three Exam-room papers from different semesters, and the BMI Calculator, the income-tax flowchart and the "inspection decision" form are known repeats. Master these four papers and you have seen most of the question bank's patterns.</div>`,
      `<h2>🗂️ Bốn đề trong phần này — và chỗ luyện có bấm giờ</h2>
<table>
<thead><tr><th>Bài</th><th>File nguồn</th><th>Q1</th><th>Q2</th><th>Q3 (Q4)</th><th>Cùng câu hỏi trong Phòng thi</th></tr></thead>
<tbody>
<tr><td>PE-1</td><td>PE3/SWT301_FA23.docx + template.xlsx</td><td>Review AverageCalculator (3)</td><td>Unit test countCharacters (3)</td><td>"Tạo quyết định kiểm tra" EP/BVA (4)</td><td><strong>SWT301-PE8</strong> "Đề thi thực hành số 8 (PE - SP 2024 - Block 5)" có đủ cả ba câu; SWT301-PE9 (FALL24 - PE3) dùng lại Q1+Q3; SWT301-PE18 (FA 2023 - PE1.2) dùng lại Q2</td></tr>
<tr><td>PE-2</td><td>PE1.jpg — SWT301_SU24_PE1</td><td>Review Fibonacci (3)</td><td>Lưu đồ fncPersonalIncomeTax (3)</td><td>BMI Calculator EP/BVA (4)</td><td><strong>SWT301-PE14</strong> "Đề thi thực hành số 14 (SU 2024 - PE1)"</td></tr>
<tr><td>PE-3</td><td>PE2.jpg — đề PE cuối kỳ FALL24</td><td>Báo cáo defect fileProcessor (3)</td><td>JUnit cho OrderCalculator, EP/BVA + nhánh (5)</td><td>Use case mua hàng online (2)</td><td><strong>SWT301-PE11</strong> "Đề thi thực hành số 11 (FA 2024 - PE1)"</td></tr>
<tr><td>PE-4</td><td>PE4/SP25.jpg — đề PE cuối kỳ SPRING25</td><td>Chiến lược kiểm thử (3)</td><td>Review TravelBooking (3)</td><td>calculateRewardPoints (2) · test case hệ thống (2)</td><td><strong>SWT301-PE7</strong> "Đề thi thực hành số 7 (PE - SP 2025)"</td></tr>
</tbody>
</table>
<ul>
<li><strong>Chưa có đề Spring 2026</strong> — thư mục <code>03.PE/SP26</code> <strong>trống</strong>.</li>
<li><strong>Các mã là gì</strong> — là file đề của <strong>Phòng thi</strong> trên web.</li>
<li><strong>Cách tìm đề</strong> — trang phòng thi có địa chỉ <code>/exam/&lt;số&gt;</code>, mà số đó là id trong cơ sở dữ liệu được gán lúc nạp đề, nên không có link cố định. Vào <strong>/exam</strong>, lọc môn SWT301 rồi chọn đề theo tên.</li>
<li><strong>Thời gian</strong> — Phòng thi cho mọi đề PE 90 phút và chấm câu trả lời viết bằng rubric AI. Khi luyện, hãy tự bấm giờ đúng như đề thật (85 hoặc 80 phút với các đề mới).</li>
</ul>
<div class="callout ok"><strong>Câu hỏi quay lại nhiều lần.</strong> Các câu trong file FA23 xuất hiện lại ở ba đề của phòng thi thuộc các kỳ khác nhau; BMI Calculator, lưu đồ thuế thu nhập và form "quyết định kiểm tra" là những câu lặp đã biết. Nắm chắc bốn đề này là bạn đã gặp gần hết các dạng trong ngân hàng đề.</div>`),
    bi(`<h2>🧾 The official answer template, sheet by sheet (SWT301_FA23 template.xlsx)</h2>
<table>
<thead><tr><th>Sheet</th><th>Layout</th><th>How to fill it</th></tr></thead>
<tbody>
<tr><td><strong>Q1 template</strong></td><td>Three columns <strong>Issue No | Description | Line</strong>, rows 1–7. Sample row (blue): "class-level variable x is overshadowed by local variable x | 6".</td><td>One issue per row, with the <em>exact</em> line number. Put the category and the fix in the description ("[Compile error] … Fix: …"). Add rows if you have more than 7 — more correct issues is safer than exactly six.</td></tr>
<tr><td><strong>Q2 template</strong></td><td>Header: Function Code, Function Name, Created By, Executed By, Lines of code, Lack of test cases, Test requirement, and counters Passed / Failed / Untested / N/A/B / Total Test Cases. Grid: one column per <strong>UTCID01, UTCID02…</strong>; row blocks <strong>Condition → Precondition</strong>, <strong>Input condition</strong> (one block per parameter, one row per test-data value), <strong>Confirm → Return</strong>, <strong>Exception</strong>, <strong>Log message</strong>, <strong>Result → Type (N: Normal, A: Abnormal, B: Boundary)</strong>, Passed/Failed, Executed Date, Defect ID.</td><td>Write each distinct value once in the value column and put an <strong>O</strong> under every UTCID that uses it. Every UTCID needs exactly one O per parameter, at least one O in Return or Exception, and a Type letter. "Don't edit the grey cell."</td></tr>
<tr><td><strong>Q3.1 template</strong></td><td>Table 3.1 Test Analysis: <strong>Condition | Valid Partitions | Tag | Invalid Partitions | Tag | Valid Boundaries | Tag | Invalid Boundaries | Tag</strong>. Sample: Customer name — VP1 2–64 chars, VP2 valid chars; IP1 &lt; 2 chars, IP2 &gt; 64 chars, IP3 invalid chars; VB1 2 chars, VB2 64 chars; IB1 1 char, IB2 65 chars, IB3 0 char.</td><td>One block per business rule/field. Tags are numbered continuously through the whole table (VP1…VPn, IP1…, VB1…, IB1…).</td></tr>
<tr><td><strong>Q3.2 template</strong></td><td>Table 3.2 Test case design: <strong>Test-case No | Description | Expected result | TAG</strong>, rows 1–10. Sample: "Name: John Smith / Acc. No: 123456 / Loan: 2500 / Term: 3 years" → "Repayment: 79.86 …" → "VP1, VP2, VP3, VP4, VP5,…".</td><td>Concrete test data in the description, a concrete expected result, and the list of tags this case exercises.</td></tr>
<tr><td><strong>Q3.3 template</strong></td><td>Counters Pass / Fail / Untested / N/A, Percent Complete, Number of cases; columns <strong>ID | Test Case Description | Pre-Condition | Test Case Procedure | Expected Output | Result | Bug# | Test date | Note</strong>.</td><td>The same 10 cases, now with preconditions and numbered steps a stranger could execute. Result stays "Untested" — you are designing, not running.</td></tr>
</tbody>
</table>
<div class="callout warn">Every sheet ends with "<strong>* Notes: Blue text is sample, needed to be deleted in the answer</strong>". Leaving the sample row "Customer name 2–64 chars" in your 3.1 table is exactly the kind of irrelevant content that the zero rule punishes.</div>`,
      `<h2>🧾 Template bài làm chính thức, từng sheet một (SWT301_FA23 template.xlsx)</h2>
<table>
<thead><tr><th>Sheet</th><th>Bố cục</th><th>Cách điền</th></tr></thead>
<tbody>
<tr><td><strong>Q1 template</strong></td><td>Ba cột <strong>Issue No | Description | Line</strong>, dòng 1–7. Dòng mẫu (chữ xanh): "class-level variable x is overshadowed by local variable x | 6".</td><td>Mỗi dòng một lỗi, số dòng phải <em>chính xác</em>. Ghi loại lỗi và cách sửa ngay trong mô tả ("[Compile error] … Fix: …"). Được thêm dòng nếu tìm được hơn 7 — nhiều lỗi đúng an toàn hơn đúng sáu lỗi.</td></tr>
<tr><td><strong>Q2 template</strong></td><td>Phần đầu: Function Code, Function Name, Created By, Executed By, Lines of code, Lack of test cases, Test requirement, và các ô đếm Passed / Failed / Untested / N/A/B / Total Test Cases. Lưới: mỗi cột một <strong>UTCID01, UTCID02…</strong>; các khối dòng <strong>Condition → Precondition</strong>, <strong>Input condition</strong> (mỗi tham số một khối, mỗi giá trị test một dòng), <strong>Confirm → Return</strong>, <strong>Exception</strong>, <strong>Log message</strong>, <strong>Result → Type (N: Normal, A: Abnormal, B: Boundary)</strong>, Passed/Failed, Executed Date, Defect ID.</td><td>Mỗi giá trị khác nhau viết một lần ở cột giá trị, rồi đánh <strong>O</strong> dưới mọi UTCID dùng giá trị đó. Mỗi UTCID phải có đúng một chữ O cho mỗi tham số, ít nhất một O ở Return hoặc Exception, và một chữ Type. "Không sửa ô màu xám."</td></tr>
<tr><td><strong>Q3.1 template</strong></td><td>Bảng 3.1 Test Analysis: <strong>Condition | Valid Partitions | Tag | Invalid Partitions | Tag | Valid Boundaries | Tag | Invalid Boundaries | Tag</strong>. Mẫu: Customer name — VP1 2–64 ký tự, VP2 ký tự hợp lệ; IP1 &lt; 2 ký tự, IP2 &gt; 64 ký tự, IP3 ký tự không hợp lệ; VB1 2 ký tự, VB2 64 ký tự; IB1 1 ký tự, IB2 65 ký tự, IB3 0 ký tự.</td><td>Mỗi luật nghiệp vụ/trường một khối. Tag đánh số liên tục trong cả bảng (VP1…VPn, IP1…, VB1…, IB1…).</td></tr>
<tr><td><strong>Q3.2 template</strong></td><td>Bảng 3.2 Test case design: <strong>Test-case No | Description | Expected result | TAG</strong>, dòng 1–10. Mẫu: "Name: John Smith / Acc. No: 123456 / Loan: 2500 / Term: 3 years" → "Repayment: 79.86 …" → "VP1, VP2, VP3, VP4, VP5,…".</td><td>Dữ liệu test cụ thể trong mô tả, kết quả mong đợi cụ thể, và danh sách các tag mà ca đó chạm tới.</td></tr>
<tr><td><strong>Q3.3 template</strong></td><td>Ô đếm Pass / Fail / Untested / N/A, Percent Complete, Number of cases; các cột <strong>ID | Test Case Description | Pre-Condition | Test Case Procedure | Expected Output | Result | Bug# | Test date | Note</strong>.</td><td>Vẫn 10 ca đó, giờ thêm điều kiện tiên quyết và các bước đánh số mà người lạ cũng làm theo được. Cột Result để "Untested" — bạn đang thiết kế, chưa chạy.</td></tr>
</tbody>
</table>
<div class="callout warn">Cuối mỗi sheet đều có dòng "<strong>* Notes: Blue text is sample, needed to be deleted in the answer</strong>" (chữ xanh là mẫu, phải xoá khi làm bài). Để nguyên dòng mẫu "Customer name 2–64 chars" trong bảng 3.1 chính là loại nội dung lạc đề mà luật điểm 0 trừng phạt.</div>`),
    bi(`<h2>🛠️ A method for each question</h2>
<h3>Q1 — code review (the checklist that finds 8+ issues in 15 minutes)</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Compile in your head</div><div class="lz-d">Missing imports, missing <code>new</code>, undeclared variables, wrong <code>main</code> signature, unhandled checked exceptions (<code>close()</code> throws IOException).</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Trace the logic</div><div class="lz-d">Run the code by hand for a normal value and the edge values (0, 1, negative, empty, null). Wrong operator, wrong loop bound, wrong update order.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Inputs &amp; exceptions</div><div class="lz-d">No validation, <code>nextInt()</code> without handling, null dereference, String compared with <code>==</code>, swallowed exceptions.</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Conventions &amp; practice</div><div class="lz-d">Class PascalCase, variables camelCase, constants UPPER_CASE, unused variables, magic numbers, unclosed resources, <code>double</code> for money.</div></div>
</div>
<h3>Q2 — minimum unit tests for 100% statement and decision coverage</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Draw the control-flow graph</div><div class="lz-d">One node per decision and per block of statements; an edge for each possible transfer of control.</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Count V(G)</div><div class="lz-d">V(G) = number of binary decisions + 1, and check it with E − N + 2.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">List outcomes</div><div class="lz-d">Every decision needs a True <em>and</em> a False outcome (a loop's False = the exit).</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Choose the fewest paths</div><div class="lz-d">Each test is one path; a loop lets one test visit several branches. Paths ending in a <code>return</code>/<code>throw</code> cannot be combined.</div></div>
<div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Data, expected result, grid</div><div class="lz-d">Compute expected values by hand, fill the UTCID grid, mark the Type N/A/B.</div></div>
</div>
<h3>Q3 — EP + BVA → tags → 10 test cases → procedures</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">One block per rule</div><div class="lz-d">Every field and every sentence of the business rules: length, required, allowed characters, first character, list default, file size, count of rows.</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Partitions, then boundaries</div><div class="lz-d">Range a–b: VB a and b, IB a−1 and b+1; "required": the empty value (0 chars) is an invalid boundary.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Combine valid, isolate invalid</div><div class="lz-d">Put many valid tags in the same case; give each invalid value its own case, otherwise one error hides another (error masking).</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Check the tag coverage</div><div class="lz-d">List which tags each case hits and which remain; if cases are capped at 10, say which extra cases you would add.</div></div>
</div>`,
      `<h2>🛠️ Cách làm cho từng câu</h2>
<h3>Q1 — review code (checklist tìm 8+ lỗi trong 15 phút)</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Biên dịch trong đầu</div><div class="lz-d">Thiếu import, thiếu <code>new</code>, biến chưa khai báo, sai chữ ký <code>main</code>, checked exception chưa xử lý (<code>close()</code> ném IOException).</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Lần theo logic</div><div class="lz-d">Chạy tay đoạn code với một giá trị bình thường và các giá trị biên (0, 1, số âm, rỗng, null). Sai toán tử, sai cận vòng lặp, sai thứ tự cập nhật.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đầu vào &amp; ngoại lệ</div><div class="lz-d">Không kiểm tra đầu vào, <code>nextInt()</code> không bắt lỗi, truy cập null, so sánh String bằng <code>==</code>, nuốt exception.</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Quy ước &amp; thực hành tốt</div><div class="lz-d">Tên class PascalCase, biến camelCase, hằng UPPER_CASE, biến thừa, magic number, tài nguyên không đóng, dùng <code>double</code> cho tiền.</div></div>
</div>
<h3>Q2 — bộ unit test tối thiểu đạt 100% statement và decision coverage</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Vẽ đồ thị luồng điều khiển</div><div class="lz-d">Mỗi quyết định và mỗi khối lệnh là một nút; mỗi lối chuyển điều khiển có thể xảy ra là một cạnh.</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tính V(G)</div><div class="lz-d">V(G) = số quyết định nhị phân + 1, rồi kiểm lại bằng E − N + 2.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Liệt kê kết cục</div><div class="lz-d">Mỗi quyết định cần cả kết cục True <em>và</em> False (False của vòng lặp = lối thoát).</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Chọn ít đường nhất</div><div class="lz-d">Mỗi test là một đường đi; vòng lặp cho phép một test ghé nhiều nhánh. Các đường kết thúc bằng <code>return</code>/<code>throw</code> không gộp được với nhau.</div></div>
<div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Dữ liệu, kết quả mong đợi, lưới</div><div class="lz-d">Tự tính kết quả mong đợi, điền lưới UTCID, đánh Type N/A/B.</div></div>
</div>
<h3>Q3 — EP + BVA → tag → 10 test case → thủ tục</h3>
<div class="lz-flow">
<div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Mỗi luật một khối</div><div class="lz-d">Mọi trường và mọi câu trong business rules: độ dài, bắt buộc, ký tự cho phép, ký tự đầu, giá trị mặc định của danh sách, dung lượng file, số dòng.</div></div>
<div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Phân vùng rồi đến biên</div><div class="lz-d">Khoảng a–b: VB là a và b, IB là a−1 và b+1; "bắt buộc": giá trị rỗng (0 ký tự) là một biên không hợp lệ.</div></div>
<div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gộp hợp lệ, tách không hợp lệ</div><div class="lz-d">Dồn nhiều tag hợp lệ vào cùng một ca; mỗi giá trị không hợp lệ một ca riêng, nếu không lỗi này che mất lỗi kia (error masking).</div></div>
<div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kiểm độ phủ tag</div><div class="lz-d">Ghi mỗi ca chạm tag nào và còn tag nào chưa phủ; nếu đề giới hạn 10 ca, nói rõ bạn sẽ thêm ca nào.</div></div>
</div>`),
    bi(`<h2>⏱️ Time plan (90 minutes, 3 + 3 + 4 points)</h2>
<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Output</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Read the whole paper; open the template; type your name in every "Created By / Tester" cell.</td><td>You know which question is hardest for you.</td></tr>
<tr><td>5–25</td><td>Q1: number the lines, run the four-step checklist.</td><td>8–10 issues with lines and fixes.</td></tr>
<tr><td>25–50</td><td>Q2: CFG → V(G) → outcomes → paths → data → grid.</td><td>The minimum set of UTCIDs with expected results.</td></tr>
<tr><td>50–65</td><td>Q3.1: one block per rule, partitions and boundaries, tags.</td><td>Complete table 3.1.</td></tr>
<tr><td>65–75</td><td>Q3.2: 10 cases, valid tags combined, one invalid per case.</td><td>Table 3.2 with tags.</td></tr>
<tr><td>75–85</td><td>Q3.3: preconditions and numbered steps for the same 10 cases.</td><td>Table 3.3.</td></tr>
<tr><td>85–90</td><td>Final check: blue sample text deleted, English only, every line number re-checked, file saved in the template format.</td><td>Nothing lost to the zero rules.</td></tr>
</tbody>
</table>
<p>The newer papers have a different shape:</p>
<ul>
<li><strong>FALL24</strong> (3 + 5 + 2 in 85 min) — about 20 minutes for Q1, 40 for Q2, 20 for Q3, and 5 for checking (the plan used in lesson PE-3).</li>
<li><strong>SPRING25</strong> (3 + 3 + 2 + 2 in 80 min) — roughly 20 + 20 + 15 + 20, and 5 for checking.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> about <strong>8 minutes per point</strong>, always keeping 5 minutes at the end.</p>`,
      `<h2>⏱️ Chia thời gian (90 phút, 3 + 3 + 4 điểm)</h2>
<table>
<thead><tr><th>Phút</th><th>Làm gì</th><th>Kết quả</th></tr></thead>
<tbody>
<tr><td>0–5</td><td>Đọc hết đề; mở template; gõ tên vào mọi ô "Created By / Tester".</td><td>Biết câu nào khó nhất với mình.</td></tr>
<tr><td>5–25</td><td>Q1: đánh số dòng, chạy checklist bốn bước.</td><td>8–10 lỗi kèm số dòng và cách sửa.</td></tr>
<tr><td>25–50</td><td>Q2: CFG → V(G) → kết cục → đường đi → dữ liệu → lưới.</td><td>Bộ UTCID tối thiểu kèm kết quả mong đợi.</td></tr>
<tr><td>50–65</td><td>Q3.1: mỗi luật một khối, phân vùng và biên, tag.</td><td>Bảng 3.1 đầy đủ.</td></tr>
<tr><td>65–75</td><td>Q3.2: 10 ca, gộp tag hợp lệ, mỗi ca một giá trị không hợp lệ.</td><td>Bảng 3.2 có tag.</td></tr>
<tr><td>75–85</td><td>Q3.3: điều kiện tiên quyết và các bước đánh số cho đúng 10 ca đó.</td><td>Bảng 3.3.</td></tr>
<tr><td>85–90</td><td>Soát lần cuối: đã xoá chữ xanh mẫu, chỉ tiếng Anh, kiểm lại từng số dòng, lưu đúng định dạng template.</td><td>Không mất điểm vì luật điểm 0.</td></tr>
</tbody>
</table>
<p>Các đề mới có dạng khác:</p>
<ul>
<li><strong>FALL24</strong> (3 + 5 + 2 trong 85 phút) — khoảng 20 phút cho Q1, 40 phút cho Q2, 20 phút cho Q3, và 5 phút để soát (đúng kế hoạch dùng ở bài PE-3).</li>
<li><strong>SPRING25</strong> (3 + 3 + 2 + 2 trong 80 phút) — chia khoảng 20 + 20 + 15 + 20, và 5 phút để soát.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khoảng <strong>8 phút cho mỗi điểm</strong>, luôn giữ 5 phút cuối.</p>`),
    bi(`<h2>🚫 The 12 most common ways students lose marks</h2>
<ol>
<li><strong>Not using the provided template</strong> (or submitting a different file type when a single Word file is required) — the whole exam gets 0.</li>
<li><strong>Leaving the blue sample rows</strong> ("Customer name 2–64 chars", "class-level variable x is overshadowed…") in the answer — irrelevant content, 0 for that answer.</li>
<li><strong>Pasting an answer prepared for another paper.</strong> One wrong class or field name ("OrderService" when the paper says "OrderCalculator") is a keyword "not related to this exam paper" → 0.</li>
<li><strong>Writing in Vietnamese</strong> or mixing languages in the template.</li>
<li><strong>Q1 without line numbers, or with wrong ones</strong>, or vague descriptions ("bad code", "logic error") with no fix.</li>
<li><strong>Q1 with six issues of the same kind</strong> (six naming remarks). Graders expect variety: compile errors, logic, validation, exceptions, resources, conventions.</li>
<li><strong>Q1 missing the compile errors</strong> — missing import, missing <code>new</code>, undeclared variable, wrong <code>main</code> signature. They are the easiest marks on the paper.</li>
<li><strong>Q2 forgetting the False outcomes</strong>: the loop exit, the final <code>else</code>, the "not greater than" branch of each band — that is decision coverage, not statement coverage.</li>
<li><strong>Q2 not the minimum</strong>: redundant cases that add nothing, or too few (8 cases for a flowchart that needs 10).</li>
<li><strong>Q2 data that never reaches the intended branch</strong> — e.g. choosing a salary without first computing <code>ti = sal − te − 9,000,000 − nod × 4,000,000</code> — or expected results with no calculation behind them.</li>
<li><strong>Q3 boundaries off by one</strong> (51 instead of 50, 254 instead of 255), the empty value forgotten for a required field, or a whole rule skipped (file size, dropdown default, "at least one document").</li>
<li><strong>Q3 cases that combine two invalid values</strong> (error masking), tags in 3.2 that do not match the data, or 3.3 procedures without concrete data and a concrete expected output.</li>
</ol>`,
      `<h2>🚫 12 cách mất điểm phổ biến nhất</h2>
<ol>
<li><strong>Không dùng template được phát</strong> (hoặc nộp sai loại file khi đề yêu cầu đúng một file Word) — cả bài 0 điểm.</li>
<li><strong>Để nguyên dòng mẫu chữ xanh</strong> ("Customer name 2–64 chars", "class-level variable x is overshadowed…") trong bài — nội dung lạc đề, câu đó 0 điểm.</li>
<li><strong>Dán bài chuẩn bị sẵn cho đề khác.</strong> Chỉ một tên class hay tên trường sai ("OrderService" trong khi đề ghi "OrderCalculator") là đã thành từ khoá "không liên quan tới đề này" → 0.</li>
<li><strong>Viết tiếng Việt</strong> hoặc trộn hai thứ tiếng trong template.</li>
<li><strong>Q1 không có số dòng hoặc ghi sai</strong>, hay mô tả chung chung ("code xấu", "lỗi logic") mà không có cách sửa.</li>
<li><strong>Q1 sáu lỗi cùng một loại</strong> (sáu nhận xét đặt tên). Người chấm muốn thấy đa dạng: lỗi biên dịch, logic, kiểm tra đầu vào, ngoại lệ, tài nguyên, quy ước.</li>
<li><strong>Q1 bỏ sót lỗi biên dịch</strong> — thiếu import, thiếu <code>new</code>, biến chưa khai báo, sai chữ ký <code>main</code>. Đây là những điểm dễ ăn nhất của cả đề.</li>
<li><strong>Q2 quên kết cục False</strong>: lối thoát vòng lặp, nhánh <code>else</code> cuối, nhánh "không lớn hơn" của từng bậc — đó là decision coverage, không phải statement coverage.</li>
<li><strong>Q2 không phải tối thiểu</strong>: thêm ca thừa không phủ thêm gì, hoặc thiếu ca (8 ca cho một lưu đồ cần 10).</li>
<li><strong>Q2 chọn dữ liệu không tới được nhánh mong muốn</strong> — ví dụ chọn lương mà không tính trước <code>ti = sal − te − 9.000.000 − nod × 4.000.000</code> — hoặc kết quả mong đợi không có phép tính nào đứng sau.</li>
<li><strong>Q3 lệch biên một đơn vị</strong> (51 thay vì 50, 254 thay vì 255), quên giá trị rỗng của trường bắt buộc, hoặc bỏ sót nguyên một luật (dung lượng file, giá trị mặc định của dropdown, "ít nhất một tài liệu").</li>
<li><strong>Q3 một ca chứa hai giá trị không hợp lệ</strong> (error masking), tag ở 3.2 không khớp dữ liệu, hoặc thủ tục ở 3.3 không có dữ liệu cụ thể và kết quả mong đợi cụ thể.</li>
</ol>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — the boundary cheat sheet for the rules in these papers</h3>
<p>Every value below was generated by a script from the rule text (range a–b → VB a, b; IB a−1, b+1), so you can trust it and reuse the pattern.</p>
<table>
<thead><tr><th>Rule (paper)</th><th>Valid boundaries</th><th>Invalid boundaries</th></tr></thead>
<tbody>
<tr><td>Decision name 50–255 chars (FA23)</td><td>50, 255</td><td>49, 256, and 0 (empty, required)</td></tr>
<tr><td>Details ≤ 10,000 chars, required (FA23)</td><td>1, 10,000</td><td>0, 10,001</td></tr>
<tr><td>Document name 10–100 chars (FA23)</td><td>10, 100</td><td>9, 101, 0</td></tr>
<tr><td>Document code 3–10 chars (FA23)</td><td>3, 10</td><td>2, 11, 0</td></tr>
<tr><td>File ≤ 10 MB (FA23)</td><td>10,485,760 bytes (1 MB = 1024² B)</td><td>10,485,761 bytes — or 10,000,000 / 10,000,001 if you assume decimal MB; <em>state which</em></td></tr>
<tr><td>Age 2–120 (SU24 BMI)</td><td>2, 120 (and 20 / 21, where the children table switches to the adult table)</td><td>1, 121</td></tr>
<tr><td>Height, weight &gt; 0 with two decimals (SU24 BMI)</td><td>0.01</td><td>0</td></tr>
<tr><td>Item price &gt; 0 (FALL24)</td><td>0.01</td><td>0</td></tr>
<tr><td>bookingAmount &lt; 0 → −1 (SP25)</td><td>0</td><td>−0.01</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"Between 50 and 255" is inclusive unless the paper says otherwise.</strong> If you think it could be exclusive, write the assumption in the Notes line ("Assumption: 50 and 255 are allowed") — the papers explicitly invite assumptions, and a stated assumption turns an argument about wording into a correct answer.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Coverage stronger than decisions: MC/DC and mutation testing.</strong>
<p>A decision such as <code>itemPrices == null || itemPrices.length == 0</code> reaches 100% decision coverage with two tests, yet one of its two conditions may never have decided the outcome.</p>
<ul>
<li><strong>MC/DC</strong> (<em>modified condition/decision coverage</em>, required for flight software by DO-178C) — each condition must be shown to change the outcome on its own.</li>
<li><strong>Mutation testing</strong> (e.g. PIT for Java) — goes further: it plants small bugs such as <code>&gt;</code> → <code>&gt;=</code> and checks that some test fails. A direct measure of whether your boundary tests really bite.</li>
</ul>
<p><em>Outside the syllabus because CTFL stops at statement and decision coverage.</em></p></div>`,
      `<h3>Ví dụ có lời giải · Bảng tra giá trị biên cho các luật trong bốn đề</h3>
<p>Mọi giá trị dưới đây được một script sinh ra từ nội dung luật (khoảng a–b → VB a, b; IB a−1, b+1), nên bạn có thể tin và dùng lại đúng khuôn này.</p>
<table>
<thead><tr><th>Luật (đề)</th><th>Biên hợp lệ</th><th>Biên không hợp lệ</th></tr></thead>
<tbody>
<tr><td>Tên quyết định 50–255 ký tự (FA23)</td><td>50, 255</td><td>49, 256, và 0 (rỗng, bắt buộc)</td></tr>
<tr><td>Chi tiết ≤ 10.000 ký tự, bắt buộc (FA23)</td><td>1, 10.000</td><td>0, 10.001</td></tr>
<tr><td>Tên tài liệu 10–100 ký tự (FA23)</td><td>10, 100</td><td>9, 101, 0</td></tr>
<tr><td>Mã tài liệu 3–10 ký tự (FA23)</td><td>3, 10</td><td>2, 11, 0</td></tr>
<tr><td>File ≤ 10 MB (FA23)</td><td>10.485.760 byte (1 MB = 1024² B)</td><td>10.485.761 byte — hoặc 10.000.000 / 10.000.001 nếu giả định MB thập phân; <em>ghi rõ bạn chọn cách nào</em></td></tr>
<tr><td>Tuổi 2–120 (BMI SU24)</td><td>2, 120 (và 20 / 21, chỗ bảng trẻ em chuyển sang bảng người lớn)</td><td>1, 121</td></tr>
<tr><td>Chiều cao, cân nặng &gt; 0, hai chữ số thập phân (BMI SU24)</td><td>0.01</td><td>0</td></tr>
<tr><td>Giá món hàng &gt; 0 (FALL24)</td><td>0.01</td><td>0</td></tr>
<tr><td>bookingAmount &lt; 0 → −1 (SP25)</td><td>0</td><td>−0.01</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>"Between 50 and 255" là bao gồm hai đầu, trừ khi đề nói khác.</strong> Nếu bạn nghĩ có thể là không bao gồm, hãy ghi giả định vào dòng Notes ("Assumption: 50 and 255 are allowed") — đề mời bạn ghi giả định, và một giả định được nói rõ biến cuộc tranh cãi về câu chữ thành một câu trả lời đúng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Độ phủ mạnh hơn decision: MC/DC và mutation testing.</strong>
<p>Một quyết định như <code>itemPrices == null || itemPrices.length == 0</code> đạt 100% decision coverage chỉ với hai test, nhưng có thể một trong hai điều kiện chưa bao giờ tự quyết định kết quả.</p>
<ul>
<li><strong>MC/DC</strong> (<em>modified condition/decision coverage</em>, bắt buộc với phần mềm bay theo DO-178C) — phải chứng minh từng điều kiện tự nó làm đổi kết quả.</li>
<li><strong>Mutation testing</strong> (ví dụ PIT cho Java) — còn đi xa hơn: cài những lỗi nhỏ như <code>&gt;</code> → <code>&gt;=</code> rồi kiểm xem có test nào fail không. Đây là thước đo trực tiếp cho việc test biên của bạn có thực sự "cắn" hay không.</li>
</ul>
<p><em>Ngoài giáo trình vì CTFL chỉ dừng ở statement và decision coverage.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §2 "Review process" — book p.79–99 (PDF p.93–113), for Q1; Ch.4 §2 "Black-box test techniques" p.112–131 (PDF 126–145), Table 4.1 EP/boundaries p.116; Ch.4 §3 "White-box test techniques" p.132–139 (PDF 146–153), Fig. 4.4 control flow p.139', 'Chương 3 §2 "Review process" — trang sách 79–99 (PDF 93–113), cho Q1; Chương 4 §2 "Black-box test techniques" tr.112–131 (PDF 126–145), Bảng 4.1 EP/biên tr.116; Chương 4 §3 "White-box test techniques" tr.132–139 (PDF 146–153), Hình 4.4 luồng điều khiển tr.139'],
      ['sp5', '§5.1.1 Equivalence partitioning PDF p.165, §5.1.2 Boundary value analysis PDF p.176, use-case testing PDF p.208; §5.2.1 statement testing PDF p.215, §5.2.2 decision testing PDF p.218', '§5.1.1 Phân vùng tương đương PDF tr.165, §5.1.2 Phân tích giá trị biên PDF tr.176, kiểm thử theo use case PDF tr.208; §5.2.1 statement testing PDF tr.215, §5.2.2 decision testing PDF tr.218'],
      ['sp4', '§4.2 static analysis — control flow p.99, metrics &amp; cyclomatic number p.100 (PDF p.114–115)', '§4.2 phân tích tĩnh — luồng điều khiển tr.99, độ đo &amp; số cyclomatic tr.100 (PDF 114–115)'],
      ['junit', 'Ch.2 "Exploring core JUnit" (assertions, assertThrows) PDF p.18; Ch.6 "Test quality" (code coverage) PDF p.103', 'Chương 2 "Exploring core JUnit" (assertion, assertThrows) PDF tr.18; Chương 6 "Test quality" (độ phủ code) PDF tr.103'],
    ]),
  ].join('\n'),
};

/* ═════════════════════════ PE-1 FA23 paper (docx) ═════════════════════════ */
const FA23_Q1 = `
public class AverageCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        ArrayList<Double> NUMBERS = new ArrayList<>();
        int avg;

        System.out.print("Enter the number of values to calculate the average: ");
        int NumValues = scanner.nextInt();

        double sum = 0;
        for (int i = 0; i < NumValues; i++) {
            System.out.print("Enter value #" + i + ": ");
            double value = scanner.nextDouble();
            NUMBERS.add(value);
            sum += value;
        }

        if (NumValues != 0) {
            double average = sum / NumValues;
            System.out.println("The average is: " + average);
        } else {
            System.out.println("No values provided. Cannot calculate the average.");
        }

    }
}`;
const FA23_Q2 = `
import java.util.HashMap;
public class CharacterCounter {
    public static HashMap<String, Integer> countCharacters(String input) {
        int upperCaseCount = 0;
        int lowerCaseCount = 0;
        int numericCount = 0;
        int specialCharCount = 0;

        for (char c : input.toCharArray()) {
            if (Character.isUpperCase(c)) {
                upperCaseCount++;
            } else if (Character.isLowerCase(c)) {
                lowerCaseCount++;
            } else if (Character.isDigit(c)) {
                numericCount++;
            } else {
                specialCharCount++;
            }
        }

        HashMap<String, Integer> characterCounts = new HashMap<>();
        characterCounts.put("UpperCase", upperCaseCount);
        characterCounts.put("LowerCase", lowerCaseCount);
        characterCounts.put("Numeric", numericCount);
        characterCounts.put("SpecialCharacter", specialCharCount);

        return characterCounts;
    }
}`;

const FA23_T31 = t31([
  { c: '"Tên quyết định kiểm tra" (decision name)',
    vp: [['50 – 255 chars', 'VP1'], ['first char is a letter', 'VP2'], ['only letters and digits', 'VP3']],
    ip: [['&lt; 50 chars (1 – 49)', 'IP1'], ['&gt; 255 chars', 'IP2'], ['first char is a digit', 'IP3'], ['contains a special char (@ # - _ . …)', 'IP4'], ['contains a blank (space)', 'IP5']],
    vb: [['50 chars', 'VB1'], ['255 chars', 'VB2']],
    ib: [['49 chars', 'IB1'], ['256 chars', 'IB2'], ['0 chars (empty — required)', 'IB3']] },
  { c: '"Chi tiết" (details)',
    vp: [['1 – 10,000 chars', 'VP4']], ip: [['&gt; 10,000 chars', 'IP6']],
    vb: [['1 char', 'VB3'], ['10,000 chars', 'VB4']], ib: [['0 chars (empty — required)', 'IB4'], ['10,001 chars', 'IB5']] },
  { c: '"Trường kiểm tra" (school)',
    vp: [['a school selected from the list', 'VP5']], ip: [['default "Chọn trường để kiểm tra" kept', 'IP7']] },
  { c: '"Tài liệu công văn" — number of documents',
    vp: [['≥ 1 document', 'VP6']], ip: [['no document', 'IP8']], vb: [['exactly 1 document', 'VB5']], ib: [['0 documents', 'IB6']] },
  { c: '"Tên tài liệu" (document name)',
    vp: [['10 – 100 chars', 'VP7']], ip: [['&lt; 10 chars', 'IP9'], ['&gt; 100 chars', 'IP10']],
    vb: [['10 chars', 'VB6'], ['100 chars', 'VB7']], ib: [['9 chars', 'IB7'], ['101 chars', 'IB8'], ['0 chars (empty)', 'IB9']] },
  { c: '"Mã tài liệu" (document code)',
    vp: [['3 – 10 chars', 'VP8']], ip: [['&lt; 3 chars', 'IP11'], ['&gt; 10 chars', 'IP12']],
    vb: [['3 chars', 'VB8'], ['10 chars', 'VB9']], ib: [['2 chars', 'IB10'], ['11 chars', 'IB11'], ['0 chars (empty)', 'IB12']] },
  { c: 'Attached file (each document)',
    vp: [['file attached, size ≤ 10 MB', 'VP9']], ip: [['size &gt; 10 MB', 'IP13'], ['no file attached', 'IP14']],
    vb: [['10 MB = 10,485,760 bytes', 'VB10']], ib: [['10,485,761 bytes', 'IB13']] },
]);
const OK1 = 'other fields as TC1';
const FA23_T32 = t32([
  ['1', 'Name: "QDKT2025" + 42 × "a" (50 chars) / Details: "A" (1 char) / School: Trường mầm non Ánh Sao / 1 document: name "CongVan001" (10), code "CV1" (3), file cv1.pdf = 10,485,760 bytes', 'Decision created successfully; it appears in the list with the entered data', 'VP1, VP2, VP3, VB1, VP4, VB3, VP5, VP6, VB5, VP7, VB6, VP8, VB8, VP9, VB10'],
  ['2', 'Name: "QDKT2025" + 247 × "a" (255 chars) / Details: 10,000 chars / School: Trường mầm non Ánh Sao / 2 documents: names "TaiLieu" + 93 × "x" (100 chars), codes "CV20250001" and "CV20250002" (10), files of 2 MB each', 'Decision created successfully with both documents', 'VP1, VP2, VP3, VB2, VP4, VB4, VP5, VP6, VP7, VB7, VP8, VB9, VP9'],
  ['3', 'Name: "QDKT2025" + 41 × "a" (49 chars) / ' + OK1, 'Error message at "Tên quyết định kiểm tra" (length 50–255); nothing saved', 'IP1, IB1'],
  ['4', 'Name: "QDKT2025" + 248 × "a" (256 chars) / ' + OK1, 'Error message at the name (length 50–255); nothing saved', 'IP2, IB2'],
  ['5', 'Name: "2025QDKT" + 52 × "a" (60 chars, starts with a digit) / ' + OK1, 'Error message: the first character must not be a number; nothing saved', 'IP3'],
  ['6', 'Details: 10,001 chars / ' + OK1, 'Error message at "Chi tiết" (max 10,000 chars); nothing saved', 'IP6, IB5'],
  ['7', 'School: default "Chọn trường để kiểm tra" left unchanged / ' + OK1, 'Error message: a school must be selected; nothing saved', 'IP7'],
  ['8', 'No document (the only document row left completely empty) / other fields as TC1', 'Error message: at least one document is required; nothing saved', 'IP8, IB6'],
  ['9', 'Document name: "CongVan01" (9 chars) / ' + OK1, 'Error message at "Tên tài liệu" (length 10–100); nothing saved', 'IP9, IB7'],
  ['10', 'File: cv1.pdf = 10,485,761 bytes (10 MB + 1 byte) / ' + OK1, 'Upload rejected: file larger than 10 MB; nothing saved', 'IP13, IB13'],
], FA23_T31.tags, [
  ['11', 'Name: "QDKT@2025" + 51 × "a" (60 chars, contains "@") / ' + OK1, 'Error: special characters not allowed', 'IP4'],
  ['12', 'Name: "QDKT 2025" + 51 × "a" (60 chars, contains a space) / ' + OK1, 'Error: blanks not allowed', 'IP5'],
  ['13', 'Name: empty / ' + OK1, 'Error: name is required', 'IB3'],
  ['14', 'Details: empty / ' + OK1, 'Error: details are required', 'IB4'],
  ['15', 'Document name: "TaiLieu" + 94 × "x" (101 chars) / ' + OK1, 'Error at "Tên tài liệu"', 'IP10, IB8'],
  ['16', 'Document name: empty / ' + OK1, 'Error: document name is required', 'IB9'],
  ['17', 'Document code: "CV" (2 chars) / ' + OK1, 'Error at "Mã tài liệu"', 'IP11, IB10'],
  ['18', 'Document code: "CV202500011" (11 chars) / ' + OK1, 'Error at "Mã tài liệu"', 'IP12, IB11'],
  ['19', 'Document code: empty / ' + OK1, 'Error: document code is required', 'IB12'],
  ['20', 'Document row filled but no file uploaded / ' + OK1, 'Error: a file must be attached', 'IP14'],
]);
const PRE1 = 'Logged in as Department Head; menu "Thanh tra" → screen "Tạo mới quyết định kiểm tra" is open; the school list contains "Trường mầm non Ánh Sao"; test files prepared on the PC (cv1.pdf 10,485,760 B, cv1-big.pdf 10,485,761 B, two 2 MB PDFs)';
const base1 = (name, det, school, docName, docCode, file) => [
  `Enter "Tên quyết định kiểm tra" = ${name}`, `Enter "Chi tiết" = ${det}`, `Select "Trường kiểm tra" = ${school}`,
  `Row 1: enter "Tên tài liệu" = ${docName}, "Mã tài liệu" = ${docCode}`, `Click "Tải lên" and choose ${file}`, 'Click "Lưu"'];
const N50 = 'QDKT2025 + 42×a (50 chars)';
const FA23_T33 = t33('Create the inspection decision (Tạo mới quyết định kiểm tra)', [
  ['TC1', 'Create a decision with all lower valid boundaries', PRE1, base1(N50, '"A"', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1.pdf (10,485,760 B)'), 'Success message; the new decision is listed with name, details, school and 1 document', 'VB/VP'],
  ['TC2', 'Create a decision with all upper valid boundaries and 2 documents', PRE1, ['Enter name = QDKT2025 + 247×a (255 chars)', 'Enter "Chi tiết" = 10,000 chars', 'Select school = Trường mầm non Ánh Sao', 'Row 1: name = TaiLieu + 93×x (100), code = CV20250001, upload a 2 MB PDF', 'Click "Thêm công văn"; row 2: name = TaiLieu + 93×x (100), code = CV20250002, upload a 2 MB PDF', 'Click "Lưu"'], 'Success message; decision saved with 2 documents', 'VB/VP'],
  ['TC3', 'Name shorter than 50 chars', PRE1, base1('QDKT2025 + 41×a (49 chars)', '"A"', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1.pdf'), 'Error under the name field (50–255 chars); form stays open; nothing saved', 'IB'],
  ['TC4', 'Name longer than 255 chars', PRE1, base1('QDKT2025 + 248×a (256 chars)', '"A"', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1.pdf'), 'Error under the name field (or input blocked at 255 chars); nothing saved', 'IB'],
  ['TC5', 'Name starting with a digit', PRE1, base1('2025QDKT + 52×a (60 chars)', '"A"', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1.pdf'), 'Error: first character must not be a number; nothing saved', 'IP'],
  ['TC6', 'Details longer than 10,000 chars', PRE1, base1(N50, '10,001 chars', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1.pdf'), 'Error under "Chi tiết" (max 10,000); nothing saved', 'IB'],
  ['TC7', 'School not selected', PRE1, base1(N50, '"A"', '(leave "Chọn trường để kiểm tra")', 'CongVan001', 'CV1', 'cv1.pdf'), 'Error: please select a school; nothing saved', 'IP'],
  ['TC8', 'No document attached', PRE1, [`Enter name = ${N50}`, 'Enter "Chi tiết" = "A"', 'Select school = Trường mầm non Ánh Sao', 'Leave the document row empty (no name, code or file)', 'Click "Lưu"'], 'Error: at least one document is required; nothing saved', 'The first row has no delete icon, so an empty row is the only way to reach 0 documents'],
  ['TC9', 'Document name shorter than 10 chars', PRE1, base1(N50, '"A"', 'Trường mầm non Ánh Sao', 'CongVan01 (9 chars)', 'CV1', 'cv1.pdf'), 'Error under "Tên tài liệu" (10–100); nothing saved', 'IB'],
  ['TC10', 'File larger than 10 MB', PRE1, base1(N50, '"A"', 'Trường mầm non Ánh Sao', 'CongVan001', 'CV1', 'cv1-big.pdf (10,485,761 B)'), 'Upload rejected: file exceeds 10 MB; nothing saved', 'IB'],
]);

const L1 = {
  title: 'PE-1 — FA23 paper: code review · countCharacters unit tests · inspection-decision form|||PE-1 — Đề FA23: review code · unit test countCharacters · form quyết định kiểm tra',
  slug: 'swt301-pe-fa23',
  type: 'DOCUMENT',
  description: 'Đề PE FALL23 (file docx + template Excel) giải trọn: 10 lỗi code có số dòng, CFG và V(G)=5, 1 test đủ 100% statement+decision (đã chạy JUnit), bảng 3.1 với 46 tag, 10 test case + kiểm độ phủ tag, bảng 3.3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-1 · SWT301_FA23.docx + SWT301_FA23 template.xlsx</span>
<h2>FA23 — the classic 3 + 3 + 4 paper</h2>
<p class="lead">This is the paper the answer template was made for, so it is the best one to learn the format on. Solve it here first, then do PE8 against the clock.</p>
<h4>The same questions in the Exam room</h4>
<ul>
<li><strong>SWT301-PE8</strong> ("Practical Exam Đề 8 (PE - SP 2024 - Block 5)") — contains all three questions.</li>
<li><strong>SWT301-PE9</strong> (FALL24 - PE3) — reuses Q1 and Q3.</li>
<li><strong>SWT301-PE18</strong> (FA 2023 - PE1.2) — reuses Q2.</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — apply a review technique (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement and decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP and BVA (K3).</li>
</ul></div>
<table>
<thead><tr><th>Q</th><th>Points</th><th>Task</th><th>Template sheet</th><th>Budget</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Find at least 6 issues in <code>AverageCalculator</code> (26 lines)</td><td>Q1</td><td>20 min</td></tr>
<tr><td>2</td><td>3</td><td>Minimum unit tests for 100% statement + 100% decision coverage of <code>countCharacters</code></td><td>Q2</td><td>25 min</td></tr>
<tr><td>3</td><td>4</td><td>EP/BVA table 3.1, 10 integration test cases 3.2, procedures 3.3 for "Create the inspection decision"</td><td>Q3.1, Q3.2, Q3.3</td><td>40 min</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Thi thực hành · Bài PE-1 · SWT301_FA23.docx + SWT301_FA23 template.xlsx</span>
<h2>FA23 — đề kinh điển 3 + 3 + 4</h2>
<p class="lead">Template bài làm được làm ra chính cho đề này, nên đây là đề tốt nhất để học hình thức. Hãy giải ở đây trước, rồi làm PE8 có bấm giờ.</p>
<h4>Cùng câu hỏi trong Phòng thi</h4>
<ul>
<li><strong>SWT301-PE8</strong> ("Đề thi thực hành số 8 (PE - SP 2024 - Block 5)") — có đủ cả ba câu.</li>
<li><strong>SWT301-PE9</strong> (FALL24 - PE3) — dùng lại Q1 và Q3.</li>
<li><strong>SWT301-PE18</strong> (FA 2023 - PE1.2) — dùng lại Q2.</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — áp dụng kỹ thuật review (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement và decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP và BVA (K3).</li>
</ul></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Yêu cầu</th><th>Sheet template</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Tìm ít nhất 6 lỗi trong <code>AverageCalculator</code> (26 dòng)</td><td>Q1</td><td>20 phút</td></tr>
<tr><td>2</td><td>3</td><td>Bộ unit test tối thiểu cho 100% statement + 100% decision coverage của <code>countCharacters</code></td><td>Q2</td><td>25 phút</td></tr>
<tr><td>3</td><td>4</td><td>Bảng EP/BVA 3.1, 10 integration test case 3.2, thủ tục 3.3 cho "Tạo mới quyết định kiểm tra"</td><td>Q3.1, Q3.2, Q3.3</td><td>40 phút</td></tr>
</tbody>
</table>`),
    pages('pe-fa23', [
      [1, 'Question 1 — AverageCalculator (26 numbered lines)',
        `<p class="y-chinh">🎯 The original picture of Question 1 — its line numbers are the ones you cite in the "Line" column.</p>
<ul>
<li><strong>First pass</strong> — read it once top to bottom before looking for issues.</li>
<li><strong>Below</strong> — the transcription and the full review log.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ảnh gốc câu 1 — số dòng trên ảnh chính là số bạn ghi vào cột "Line".</p>
<ul>
<li><strong>Lượt đầu</strong> — đọc một lượt từ trên xuống trước khi tìm lỗi.</li>
<li><strong>Phía dưới</strong> — bản chép lại và bảng review đầy đủ.</li>
</ul>`],
      [2, 'Question 2 — CharacterCounter.countCharacters (29 numbered lines)',
        `<p class="y-chinh">🎯 The original picture of Question 2: the method under test.</p>
<ul>
<li><strong>What to look at</strong> — the loop plus the if / else-if / else-if / else chain.</li>
<li><strong>Why</strong> — they are what the control-flow graph and V(G) below are built from.</li>
</ul>`,
        `<p class="y-chinh">🎯 Ảnh gốc câu 2: phương thức cần test.</p>
<ul>
<li><strong>Chỗ cần nhìn</strong> — vòng lặp cùng chuỗi if / else-if / else-if / else.</li>
<li><strong>Vì sao</strong> — đó chính là nguồn để dựng đồ thị luồng điều khiển và V(G) bên dưới.</li>
</ul>`],
      [3, 'Question 3 — screen "Tạo mới quyết định kiểm tra"',
        `<p class="y-chinh">🎯 The original screen of Question 3 — every field on it maps to a condition row in table 3.1.</p>
<p class="nhan">What is on the screen</p>
<ul>
<li><strong>Decision name</strong> and <strong>details</strong></li>
<li><strong>School drop-down</strong> — with a default placeholder</li>
<li><strong>Document block</strong> — document name, document code, file + upload; "Thêm công văn" adds rows, and there is a delete icon</li>
<li><strong>Save button</strong> — "Lưu"</li>
</ul>`,
        `<p class="y-chinh">🎯 Màn hình gốc của câu 3 — mỗi trường trên đó ứng với một dòng điều kiện trong bảng 3.1.</p>
<p class="nhan">Trên màn hình có gì</p>
<ul>
<li><strong>Tên quyết định</strong> và <strong>chi tiết</strong></li>
<li><strong>Ô chọn trường</strong> — có dòng mặc định</li>
<li><strong>Khối tài liệu công văn</strong> — tên tài liệu, mã tài liệu, tệp + tải lên; nút "Thêm công văn" để thêm dòng, và có biểu tượng xoá</li>
<li><strong>Nút lưu</strong> — "Lưu"</li>
</ul>`],
    ]),
    bi(`<h2>📄 The paper (transcribed from the .docx)</h2>
<p>The .docx contains the questions as text and three pictures: the two code listings and a screenshot of the form. They are transcribed below with the paper's own line numbers.</p>
<h4>The instructions</h4>
<ul>
<li><strong>Time</strong> — 90 minutes.</li>
<li><strong>Prerequisite</strong> — know at least one programming language.</li>
<li><strong>Tools</strong> — <strong>no IDE</strong> (NetBeans, IntelliJ…).</li>
<li><strong>Zero rule</strong> — "you will get 0 for any answer which contains information irrelevant to the corresponding question".</li>
</ul>`,
      `<h2>📄 Đề thi (chép lại từ file .docx)</h2>
<p>File .docx chứa câu hỏi dạng chữ và ba hình: hai đoạn code và ảnh chụp màn hình form. Tất cả được chép lại dưới đây với đúng số dòng của đề.</p>
<h4>Hướng dẫn của đề</h4>
<ul>
<li><strong>Thời gian</strong> — 90 phút.</li>
<li><strong>Yêu cầu</strong> — biết ít nhất một ngôn ngữ lập trình.</li>
<li><strong>Công cụ</strong> — <strong>không được dùng IDE</strong> (NetBeans, IntelliJ…).</li>
<li><strong>Luật điểm 0</strong> — "câu trả lời nào chứa thông tin không liên quan tới câu hỏi sẽ bị 0 điểm".</li>
</ul>`),
    `<div class="callout"><strong>Question 1 (3 points):</strong> Review the following class and find (at least) 6 issues in the code (i.e., coding practice, compile errors, potential logical issues, etc.) (Use question 1 template)</div>
${numbered(FA23_Q1)}
<div class="callout"><strong>Question 2 (3 points):</strong> Assuming you are assigned to conduct the component test for the method below, please design and create the minimum component test cases (Unit Test case) needed to achieve 100% statement coverage and 100% decision coverage. (Use question 2 template).
<p>The countCharacters method counts the number of uppercase letters, lowercase letters, numeric characters, and special characters in a given input string. It returns a HashMap containing this information.</p></div>
${numbered(FA23_Q2)}
<div class="callout"><strong>Question 3 (4 points):</strong> You are assigned to do the functional (black-box) test for function <strong>Create the inspection decision</strong>. Actors: Department Head. Purpose: provide steps to create the inspection decision.
<p><strong>Business rules:</strong></p>
<ul>
<li>"Tên quyết định kiểm tra" is a required string with a length ranging from 50 to 255 characters. The first character must not be a number. No special characters or blanks are allowed.</li>
<li>"Chi tiết" is a required string and not exceeding 10,000 chars.</li>
<li>"Trường kiểm tra" is required and selected from a list. Default value is "Chọn trường để kiểm tra".</li>
<li>"Tài liệu công văn": there must be at least one document file; "Tên tài liệu" is a required string with a length ranging from 10 to 100 characters; "Mã tài liệu" is a required string with a length ranging from 3 to 10 characters; each attached file size not exceeding 10MB.</li>
</ul>
<p><strong>Normal case:</strong> user enters information into the fields of the form and clicks "Lưu"; the system validates the information; the inspection decision is created successfully.</p>
<p><strong>Abnormal case:</strong> data input is invalid, the system reports an error asking the user to re-enter the information.</p>
<ol>
<li>Analyse test conditions using EP and BVA and fill in table 3.1.</li>
<li>Design 10 integration test cases with the test data to cover as many TAGs as possible (table 3.2).</li>
<li>Complete the 10 test cases with detailed Pre-condition and Test Case Procedure (table 3.3).</li>
</ol>
<p><em>Notes: please feel free to include any assumptions needed for your answers to be clearer and more accurate.</em></p></div>`,
    bi(`<p><strong>The screenshot</strong> (image 3 of the .docx): the web app of a school-inspection authority.</p>
<h4>Left menu</h4>
<p>Dashboard · Danh sách trường · <strong>Thanh tra</strong> (selected) · Danh sách người dùng · Kế hoạch kiểm tra · Kế hoạch thực hiện · Báo cáo · Kết luận · Hỗ trợ · Đăng xuất.</p>
<h4>Main panel "Tạo mới quyết định kiểm tra"</h4>
<ul>
<li><strong><em>Tên quyết định kiểm tra</em></strong> — a one-line text box.</li>
<li><strong><em>Chi tiết</em></strong> — a multi-line box.</li>
<li><strong><em>Trường kiểm tra</em></strong> — a dropdown (showing "Trường mầm non Ánh Sao").</li>
<li><strong><em>Tài liệu công văn</em></strong> — two rows of [Tên tài liệu] [Mã tài liệu] [Tên file | Tải lên]; only the second row has a red trash icon.</li>
<li><strong><em>Thêm công văn</em></strong> — a button to add rows.</li>
<li><strong><em>Lưu</em></strong> — the blue save button.</li>
<li><strong><em>Tạo đoàn KT</em></strong> — a button at the top right that is outside this function.</li>
</ul>`,
      `<p><strong>Ảnh màn hình</strong> (hình 3 trong file .docx): ứng dụng web của một cơ quan thanh tra trường học.</p>
<h4>Menu trái</h4>
<p>Dashboard · Danh sách trường · <strong>Thanh tra</strong> (đang chọn) · Danh sách người dùng · Kế hoạch kiểm tra · Kế hoạch thực hiện · Báo cáo · Kết luận · Hỗ trợ · Đăng xuất.</p>
<h4>Khung chính "Tạo mới quyết định kiểm tra"</h4>
<ul>
<li><strong><em>Tên quyết định kiểm tra</em></strong> — ô nhập một dòng.</li>
<li><strong><em>Chi tiết</em></strong> — ô nhập nhiều dòng.</li>
<li><strong><em>Trường kiểm tra</em></strong> — dropdown (đang hiện "Trường mầm non Ánh Sao").</li>
<li><strong><em>Tài liệu công văn</em></strong> — hai dòng [Tên tài liệu] [Mã tài liệu] [Tên file | Tải lên]; chỉ dòng thứ hai có biểu tượng thùng rác đỏ.</li>
<li><strong><em>Thêm công văn</em></strong> — nút để thêm dòng.</li>
<li><strong><em>Lưu</em></strong> — nút lưu màu xanh.</li>
<li><strong><em>Tạo đoàn KT</em></strong> — nút ở góc phải trên, nằm ngoài chức năng này.</li>
</ul>`),

    /* ── Q1 ── */
    bi(`<h2>✅ Question 1 — code review of AverageCalculator</h2>
<h4>The task</h4>
<p>Find at least 6 issues (coding practice, compile errors, potential logical issues…) in the 26-line class, and write them in the Q1 template.</p>
<h4>Run the checklist from lesson PE-0</h4>
<ol>
<li><strong>Compile</strong> — <code>Scanner</code> and <code>ArrayList</code> are used without a single import, so the class does not even compile. javac reports four "cannot find symbol" errors, two on line 3 and two on line 4 (real output below).</li>
<li><strong>Logic</strong> — add the imports and run it: a count of <code>-3</code> skips the loop, but the guard only tests <code>!= 0</code>. So the program divides 0 by −3 and proudly prints <code>The average is: -0.0</code>.</li>
<li><strong>Inputs &amp; exceptions</strong> — nothing handles non-numeric input.</li>
<li><strong>Conventions</strong> — <code>NUMBERS</code> and <code>NumValues</code> break Java naming rules, <code>avg</code> is never used, the list is filled but never read, and the Scanner is never closed.</li>
</ol>
<h4>Result</h4>
<p>Ten issues of six different kinds. Write them all: a correct seventh or tenth issue costs nothing and protects you if a grader rejects one.</p>`,
      `<h2>✅ Câu 1 — review code AverageCalculator</h2>
<h4>Đề yêu cầu</h4>
<p>Tìm ít nhất 6 lỗi (thực hành code, lỗi biên dịch, lỗi logic tiềm ẩn…) trong class 26 dòng, ghi vào template Q1.</p>
<h4>Chạy checklist của bài PE-0</h4>
<ol>
<li><strong>Biên dịch</strong> — <code>Scanner</code> và <code>ArrayList</code> được dùng mà không có dòng import nào, nên class không biên dịch nổi. javac báo bốn lỗi "cannot find symbol", hai lỗi ở dòng 3 và hai ở dòng 4 (output thật bên dưới).</li>
<li><strong>Logic</strong> — thêm import rồi chạy thử: nhập số lượng <code>-3</code> thì vòng lặp bị bỏ qua, nhưng điều kiện chỉ kiểm <code>!= 0</code>. Nên chương trình lấy 0 chia −3 và in ra <code>The average is: -0.0</code>.</li>
<li><strong>Đầu vào &amp; ngoại lệ</strong> — không có gì xử lý khi người dùng gõ chữ.</li>
<li><strong>Quy ước</strong> — <code>NUMBERS</code> và <code>NumValues</code> sai quy tắc đặt tên Java, <code>avg</code> không bao giờ được dùng, list được thêm phần tử nhưng không bao giờ được đọc, và Scanner không bao giờ được đóng.</li>
</ol>
<h4>Kết quả</h4>
<p>Mười lỗi thuộc sáu loại khác nhau. Hãy ghi hết: lỗi thứ bảy hay thứ mười nếu đúng thì không mất gì, lại đỡ cho bạn nếu người chấm không công nhận một lỗi.</p>`),
    sheet('Answer sheet — Q1 template · Bài làm mẫu cho sheet Q1', tbl(['Issue No', 'Description', 'Line'], [
      ['1', '[Compile error] <code>Scanner</code> is used but <code>java.util.Scanner</code> is not imported → "cannot find symbol". Fix: add <code>import java.util.Scanner;</code> above the class.', '3'],
      ['2', '[Compile error] <code>ArrayList</code> is used but not imported → "cannot find symbol". Fix: <code>import java.util.ArrayList;</code> (and <code>java.util.List</code>).', '4'],
      ['3', '[Naming convention] Local, mutable list named <code>NUMBERS</code> in UPPER_CASE (reserved for constants) and declared with the implementation type. Fix: <code>List&lt;Double&gt; numbers = new ArrayList&lt;&gt;();</code>', '4'],
      ['4', '[Unused variable] <code>int avg</code> is declared but never used (an int could not hold a decimal average anyway). Fix: remove it.', '5'],
      ['5', '[Naming convention] <code>NumValues</code> starts with a capital letter. Fix: rename to <code>numValues</code> (camelCase).', '8'],
      ['6', '[Logic – missing validation] A negative count is accepted: with −3 the loop is skipped, <code>NumValues != 0</code> is true and the program prints "The average is: -0.0". Fix: <code>if (numValues &lt;= 0)</code> → print "No values provided…" and stop.', '18'],
      ['7', '[Exception handling] <code>nextInt()</code> and <code>nextDouble()</code> throw <code>InputMismatchException</code> for non-numeric input and the program crashes. Fix: catch <code>InputMismatchException</code> (or check <code>hasNextInt()</code> / <code>hasNextDouble()</code>).', '8, 13'],
      ['8', '[Resource leak] The <code>Scanner</code> is never closed. Fix: <code>try (Scanner scanner = new Scanner(System.in)) { … }</code>.', '3'],
      ['9', '[Usability – off by one] The first prompt is "Enter value #0". Fix: print <code>i + 1</code> (or loop from 1 to numValues).', '12'],
      ['10', '[Redundant code] <code>NUMBERS</code> is filled but never read — <code>sum</code> already holds the total. Fix: remove the list, or compute the sum/average from it.', '14'],
    ])),
    bi(`<p><strong>Evidence (real output, JDK 21).</strong> The original file, then the same file with the two imports added, then the corrected program below it:</p>`,
      `<p><strong>Bằng chứng (output thật, JDK 21).</strong> File gốc, rồi cùng file đó sau khi thêm hai import, rồi chương trình đã sửa ngay bên dưới:</p>`),
    code(`
$ javac AverageCalculator.java            # the paper's code, unchanged
AverageCalculator.java:3: error: cannot find symbol
AverageCalculator.java:3: error: cannot find symbol
AverageCalculator.java:4: error: cannot find symbol
AverageCalculator.java:4: error: cannot find symbol
4 errors

$ (imports added) printf -- '-3\\n' | java AverageCalculator
Enter the number of values to calculate the average: The average is: -0.0
$ printf '2\\n4\\n6\\n' | java AverageCalculator
Enter the number of values to calculate the average: Enter value #0: Enter value #1: The average is: 5.0`),
    code(`
import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

public class AverageCalculator {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.print("Enter the number of values to calculate the average: ");
            int numValues = scanner.nextInt();
            if (numValues <= 0) {
                System.out.println("No values provided. Cannot calculate the average.");
                return;
            }
            List<Double> numbers = new ArrayList<>();
            for (int i = 1; i <= numValues; i++) {
                System.out.print("Enter value #" + i + ": ");
                numbers.add(scanner.nextDouble());
            }
            double sum = 0;
            for (double v : numbers) sum += v;
            System.out.println("The average is: " + sum / numValues);
        } catch (InputMismatchException e) {
            System.out.println("Please enter numbers only.");
        }
    }
}
--- real output of the corrected version ---
input -3        -> No values provided. Cannot calculate the average.
input 3, 4 6 8  -> Enter value #1: Enter value #2: Enter value #3: The average is: 6.0
input x         -> Please enter numbers only.`),

    /* ── Q2 ── */
    bi(`<h2>✅ Question 2 — unit tests for countCharacters</h2>
<h4>The task</h4>
<p>Design the <strong>minimum</strong> unit test cases that give 100% statement <em>and</em> 100% decision coverage of <code>countCharacters</code>, in the Q2 template.</p>
<h3>Step 1 — control-flow graph</h3>
<table>
<thead><tr><th>Node</th><th>Lines</th><th>Content</th><th>Out-edges</th></tr></thead>
<tbody>
<tr><td>N1</td><td>4–7</td><td>four counters = 0</td><td>→ N2</td></tr>
<tr><td>N2 (D1)</td><td>9</td><td>for-each: another character?</td><td>T → N3 · F → N10</td></tr>
<tr><td>N3 (D2)</td><td>10</td><td><code>isUpperCase(c)</code></td><td>T → N4 · F → N5</td></tr>
<tr><td>N4</td><td>11</td><td><code>upperCaseCount++</code></td><td>→ N2</td></tr>
<tr><td>N5 (D3)</td><td>12</td><td><code>isLowerCase(c)</code></td><td>T → N6 · F → N7</td></tr>
<tr><td>N6</td><td>13</td><td><code>lowerCaseCount++</code></td><td>→ N2</td></tr>
<tr><td>N7 (D4)</td><td>14</td><td><code>isDigit(c)</code></td><td>T → N8 · F → N9</td></tr>
<tr><td>N8</td><td>15</td><td><code>numericCount++</code></td><td>→ N2</td></tr>
<tr><td>N9</td><td>17</td><td><code>specialCharCount++</code></td><td>→ N2</td></tr>
<tr><td>N10</td><td>21–27</td><td>build the HashMap, <code>return</code></td><td>(exit)</td></tr>
</tbody>
</table>
<h3>Step 2 — cyclomatic complexity</h3>
<p>N = 10 nodes, E = 13 edges → <strong>V(G) = E − N + 2 = 13 − 10 + 2 = 5</strong>. Cross-check: 4 binary decisions (D1–D4) + 1 = <strong>5</strong>. The five basis paths are: empty string (loop never entered) and one path through each of N4, N6, N8, N9.</p>
<h3>Step 3 — the minimum set</h3>
<p>The 8 outcomes to cover are D1 T/F, D2 T/F, D3 T/F, D4 T/F. Because the decisions sit inside a loop, <strong>one string that contains one character of each kind</strong> visits all four increments and then leaves the loop. Trace <code>"Ab1@"</code>:</p>
<ol>
<li><strong>'A'</strong> — makes D2 true.</li>
<li><strong>'b'</strong> — makes D2 false and D3 true.</li>
<li><strong>'1'</strong> — makes D3 false and D4 true.</li>
<li><strong>'@'</strong> — makes D4 false.</li>
<li><strong>After the last character</strong> — D1 is false (every character also made D1 true).</li>
</ol>
<h4>Result</h4>
<ul>
<li><strong>Measured</strong> — a branch probe (every decision outcome instrumented) confirmed <strong>8/8 decision outcomes with the single case UTCID01</strong>.</li>
<li><strong>Minimum = 1 test case</strong>, even though V(G) is 5 — V(G) counts the basis paths you would need for <em>path</em> testing and is only an upper bound for decision coverage.</li>
<li><strong>Extras</strong> — two cheap robustness cases (empty string, <code>null</code>) are added as B and A; they add no coverage and are marked as extras.</li>
</ul>`,
      `<h2>✅ Câu 2 — unit test cho countCharacters</h2>
<h4>Đề yêu cầu</h4>
<p>Thiết kế bộ unit test <strong>tối thiểu</strong> đạt 100% statement <em>và</em> 100% decision coverage cho <code>countCharacters</code>, điền vào template Q2.</p>
<h3>Bước 1 — đồ thị luồng điều khiển</h3>
<table>
<thead><tr><th>Nút</th><th>Dòng</th><th>Nội dung</th><th>Cạnh ra</th></tr></thead>
<tbody>
<tr><td>N1</td><td>4–7</td><td>bốn biến đếm = 0</td><td>→ N2</td></tr>
<tr><td>N2 (D1)</td><td>9</td><td>for-each: còn ký tự không?</td><td>T → N3 · F → N10</td></tr>
<tr><td>N3 (D2)</td><td>10</td><td><code>isUpperCase(c)</code></td><td>T → N4 · F → N5</td></tr>
<tr><td>N4</td><td>11</td><td><code>upperCaseCount++</code></td><td>→ N2</td></tr>
<tr><td>N5 (D3)</td><td>12</td><td><code>isLowerCase(c)</code></td><td>T → N6 · F → N7</td></tr>
<tr><td>N6</td><td>13</td><td><code>lowerCaseCount++</code></td><td>→ N2</td></tr>
<tr><td>N7 (D4)</td><td>14</td><td><code>isDigit(c)</code></td><td>T → N8 · F → N9</td></tr>
<tr><td>N8</td><td>15</td><td><code>numericCount++</code></td><td>→ N2</td></tr>
<tr><td>N9</td><td>17</td><td><code>specialCharCount++</code></td><td>→ N2</td></tr>
<tr><td>N10</td><td>21–27</td><td>tạo HashMap, <code>return</code></td><td>(thoát)</td></tr>
</tbody>
</table>
<h3>Bước 2 — độ phức tạp cyclomatic</h3>
<p>N = 10 nút, E = 13 cạnh → <strong>V(G) = E − N + 2 = 13 − 10 + 2 = 5</strong>. Kiểm lại: 4 quyết định nhị phân (D1–D4) + 1 = <strong>5</strong>. Năm đường cơ sở là: chuỗi rỗng (không vào vòng lặp) và mỗi đường đi qua một trong N4, N6, N8, N9.</p>
<h3>Bước 3 — bộ test tối thiểu</h3>
<p>Có 8 kết cục cần phủ: D1 T/F, D2 T/F, D3 T/F, D4 T/F. Vì các quyết định nằm trong vòng lặp, <strong>một chuỗi chứa mỗi loại một ký tự</strong> sẽ ghé cả bốn lệnh tăng rồi thoát vòng. Lần theo <code>"Ab1@"</code>:</p>
<ol>
<li><strong>'A'</strong> — làm D2 đúng.</li>
<li><strong>'b'</strong> — làm D2 sai và D3 đúng.</li>
<li><strong>'1'</strong> — làm D3 sai và D4 đúng.</li>
<li><strong>'@'</strong> — làm D4 sai.</li>
<li><strong>Sau ký tự cuối</strong> — D1 sai (mỗi ký tự trước đó đã làm D1 đúng).</li>
</ol>
<h4>Kết quả</h4>
<ul>
<li><strong>Đã đo</strong> — một bộ đo nhánh (gắn cờ cho từng kết cục) xác nhận <strong>8/8 kết cục chỉ với một ca UTCID01</strong>.</li>
<li><strong>Tối thiểu = 1 test case</strong>, dù V(G) bằng 5 — V(G) là số đường cơ sở cần cho <em>path</em> testing và chỉ là cận trên cho decision coverage.</li>
<li><strong>Ca bổ sung</strong> — hai ca "bảo hiểm" rẻ (chuỗi rỗng, <code>null</code>) được thêm với loại B và A; chúng không phủ thêm gì và được ghi rõ là ca bổ sung.</li>
</ul>`),
    sheet('Answer sheet — Q2 template · Bài làm mẫu cho sheet Q2', utGrid({
      fcode: 'CharacterCounter', fname: 'countCharacters(String input)', loc: 29,
      req: 'Counts upper-case, lower-case, numeric and special characters of the input and returns them in a HashMap. UTCID01 alone gives 100% statement and 100% decision coverage (8/8 outcomes); UTCID02–03 are robustness extras.',
      ids: ['UTCID01', 'UTCID02', 'UTCID03'],
      pre: [['Class CharacterCounter is compiled; countCharacters is static, no object needed', 'OOO']],
      inputs: [['input', [['"Ab1@"', 'O..'], ['"" (empty string)', '.O.'], ['null', '..O']]]],
      ret: [['{UpperCase=1, LowerCase=1, Numeric=1, SpecialCharacter=1}', 'O..'], ['{UpperCase=0, LowerCase=0, Numeric=0, SpecialCharacter=0}', '.O.']],
      exc: [['NullPointerException', '..O']],
      log: [['(the method writes no log)', '...']],
      type: 'NBA', result: 'PPP', date: '11/09/2026',
    })),
    code(`
import static org.junit.Assert.*;
import java.util.HashMap;
import org.junit.Test;

public class CharacterCounterTest {
    private static void check(HashMap<String, Integer> r, int up, int low, int num, int sp) {
        assertEquals(Integer.valueOf(up), r.get("UpperCase"));
        assertEquals(Integer.valueOf(low), r.get("LowerCase"));
        assertEquals(Integer.valueOf(num), r.get("Numeric"));
        assertEquals(Integer.valueOf(sp), r.get("SpecialCharacter"));
    }
    @Test // UTCID01 (N): one string exercises all 4 branches and both loop outcomes
    public void utcid01_allFourKinds() {
        check(CharacterCounter.countCharacters("Ab1@"), 1, 1, 1, 1);
    }
    @Test // UTCID02 (B): empty string -> loop body never runs
    public void utcid02_emptyString() {
        check(CharacterCounter.countCharacters(""), 0, 0, 0, 0);
    }
    @Test(expected = NullPointerException.class) // UTCID03 (A): null input
    public void utcid03_null() {
        CharacterCounter.countCharacters(null);
    }
}
--- real output (JDK 21, JUnit 4.13.2; the test methods also print their result) ---
JUnit version 4.13.2
.UTCID02 "" -> {Numeric=0, SpecialCharacter=0, UpperCase=0, LowerCase=0}
.UTCID03 null -> expecting NullPointerException
.UTCID01 "Ab1@" -> {Numeric=1, SpecialCharacter=1, UpperCase=1, LowerCase=1}
OK (3 tests)`),

    /* ── Q3 ── */
    bi(`<h2>✅ Question 3 — "Create the inspection decision"</h2>
<h4>The task</h4>
<p>Black-box test of "Create the inspection decision": (1) EP + BVA in table 3.1, (2) 10 integration test cases covering as many tags as possible in table 3.2, (3) the same 10 cases with pre-conditions and procedures in table 3.3.</p>
<h4>Assumptions — write them in the Notes line of the template</h4>
<ol>
<li><strong>A1 — allowed characters</strong>: "No special characters or blanks" means the name may contain only letters (Vietnamese letters with diacritics included) and digits — no spaces anywhere.</li>
<li><strong>A2 — lengths</strong>: all lengths are inclusive and counted in characters.</li>
<li><strong>A3 — megabyte</strong>: 1 MB = 1,048,576 bytes, so the limit is 10,485,760 bytes.</li>
<li><strong>A4 — files</strong>: every document row needs a file.</li>
<li><strong>A5 — messages</strong>: the paper gives no message texts, so an invalid input means "an error message is shown for that field and nothing is saved".</li>
<li><strong>A6 — details</strong>: "Chi tiết" is required, so its smallest valid length is 1.</li>
</ol>
<h3>Step 1 — read the rules into table 3.1</h3>
<p>Seven conditions come out of four bullet points — do not stop at the four field names:</p>
<ul>
<li><strong>The name alone</strong> carries <em>four</em> checks — length, first character, special characters, blanks.</li>
<li><strong>"Tài liệu công văn"</strong> hides three more — at least one document, each document's name and code, each file's size.</li>
<li><strong>Each length rule</strong> gives two valid boundaries (a, b) and two invalid ones (a − 1, b + 1), plus the empty value because every field is required.</li>
<li><strong>The dropdown</strong> has no boundaries — its only invalid partition is keeping the default text.</li>
</ul>`,
      `<h2>✅ Câu 3 — "Tạo mới quyết định kiểm tra"</h2>
<h4>Đề yêu cầu</h4>
<p>Test hộp đen chức năng "Tạo mới quyết định kiểm tra": (1) EP + BVA vào bảng 3.1, (2) 10 integration test case phủ càng nhiều tag càng tốt vào bảng 3.2, (3) hoàn thiện đúng 10 ca đó với tiền điều kiện và thủ tục ở bảng 3.3.</p>
<h4>Giả định — ghi vào dòng Notes của template</h4>
<ol>
<li><strong>A1 — ký tự cho phép</strong>: "No special characters or blanks" nghĩa là tên chỉ được chứa chữ cái (kể cả chữ tiếng Việt có dấu) và chữ số — không có khoảng trắng ở đâu cả.</li>
<li><strong>A2 — độ dài</strong>: mọi độ dài đều bao gồm hai đầu và tính theo ký tự.</li>
<li><strong>A3 — megabyte</strong>: 1 MB = 1.048.576 byte, nên giới hạn là 10.485.760 byte.</li>
<li><strong>A4 — file</strong>: mỗi dòng tài liệu phải có file.</li>
<li><strong>A5 — thông báo</strong>: đề không cho nội dung thông báo, nên dữ liệu sai được hiểu là "hiện thông báo lỗi ở trường đó và không lưu gì".</li>
<li><strong>A6 — chi tiết</strong>: "Chi tiết" bắt buộc, nên độ dài hợp lệ nhỏ nhất là 1.</li>
</ol>
<h3>Bước 1 — chuyển luật thành bảng 3.1</h3>
<p>Bốn gạch đầu dòng sinh ra bảy điều kiện — đừng dừng ở bốn tên trường:</p>
<ul>
<li><strong>Riêng tên quyết định</strong> đã mang <em>bốn</em> phép kiểm — độ dài, ký tự đầu, ký tự đặc biệt, khoảng trắng.</li>
<li><strong>"Tài liệu công văn"</strong> giấu thêm ba — ít nhất một tài liệu, tên và mã của từng tài liệu, dung lượng từng file.</li>
<li><strong>Mỗi luật độ dài</strong> cho hai biên hợp lệ (a, b) và hai biên không hợp lệ (a − 1, b + 1), cộng thêm giá trị rỗng vì trường nào cũng bắt buộc.</li>
<li><strong>Dropdown</strong> không có biên — phân vùng không hợp lệ duy nhất là giữ nguyên dòng mặc định.</li>
</ul>`),
    sheet('Answer sheet — Table 3.1 Test Analysis · Bài làm mẫu bảng 3.1', FA23_T31.html),
    bi(`<h3>Step 2 — design table 3.2</h3>
<ul>
<li><strong>Two valid cases carry <em>all</em> the valid tags</strong> — TC1 sits on every lower boundary (50, 1, 10, 3, one document, a file of exactly 10 MB); TC2 on every upper boundary (255, 10,000, 100, 10, two documents).</li>
<li><strong>One invalid value per case</strong> — each of the other eight cases changes <strong>exactly one</strong> field of TC1 to an invalid value, so if the system accepts or rejects it you know why.</li>
<li><strong>One value, two tags</strong> — a single invalid value often hits two tags at once: 49 characters is both "&lt; 50" (IP1) and the boundary 49 (IB1).</li>
<li><strong>The 10-case cap</strong> — not every invalid tag fits. The check below is computed from the table, and the ten extra cases show how you would reach 100%.</li>
</ul>`,
      `<h3>Bước 2 — thiết kế bảng 3.2</h3>
<ul>
<li><strong>Hai ca hợp lệ gánh <em>toàn bộ</em> tag hợp lệ</strong> — TC1 nằm trên mọi biên dưới (50, 1, 10, 3, một tài liệu, file đúng 10 MB); TC2 trên mọi biên trên (255, 10.000, 100, 10, hai tài liệu).</li>
<li><strong>Mỗi ca một giá trị không hợp lệ</strong> — mỗi ca trong tám ca còn lại đổi <strong>đúng một</strong> trường của TC1 thành giá trị không hợp lệ, nên hệ thống nhận hay từ chối thì bạn đều biết vì sao.</li>
<li><strong>Một giá trị, hai tag</strong> — một giá trị không hợp lệ thường chạm hai tag cùng lúc: 49 ký tự vừa là "&lt; 50" (IP1) vừa là biên 49 (IB1).</li>
<li><strong>Giới hạn 10 ca</strong> — không phủ hết được tag không hợp lệ. Phần kiểm tra dưới đây được tính từ chính bảng, và mười ca bổ sung cho thấy cách đạt 100%.</li>
</ul>`),
    sheet('Answer sheet — Table 3.2 Test case design · Bài làm mẫu bảng 3.2', FA23_T32.table),
    FA23_T32.check,
    FA23_T32.ext,
    sheet('Answer sheet — Table 3.3 Test case (procedures) · Bài làm mẫu bảng 3.3', FA23_T33),
    bi(`<h3>Ví dụ có lời giải · Worked example — why "Ab1@" and not four separate tests?</h3>
<p>Many students hand in four UTCIDs ("A", "a", "1", "@"). Each one covers D1 True and False and one increment, so together they do reach 100% — but the question asks for the <strong>minimum</strong>. Count what each of the four adds beyond "Ab1@": nothing. The grader can therefore read four tests as "does not know what minimum means". Present UTCID01 as the minimum, and if you add more, label them clearly as boundary/abnormal extras, exactly as in the grid above.</p>
<div class="pitfall co-tieu-de"><strong>V(G) ≠ number of test cases for decision coverage.</strong> V(G) = 5 here, the minimum is 1. The two are equal only when every path ends in a different <code>return</code>, as in the income-tax flowchart of PE-2 (V(G) = 10, minimum = 10). Always reason from the outcomes you must cover, then use V(G) as a sanity check.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>What is a "character" for a 255-char limit?</strong>
<ul>
<li><strong>Unicode</strong> — "Quyết" can be stored as 5 code points (precomposed "ế") or 6 (e + two combining marks).</li>
<li><strong>JavaScript</strong> — <code>.length</code> counts UTF-16 units.</li>
<li><strong>MySQL</strong> — a <code>VARCHAR(255)</code> column in a non-UTF8 charset counts bytes.</li>
</ul>
<p>A name of exactly 255 characters can therefore pass the browser check and still be truncated by the database. Real testers add a boundary case with Vietnamese diacritics (255 characters, many of them "ế", "ữ") and one with an emoji.</p>
<p><em>Outside the syllabus because CTFL treats "length" as a single abstract number.</em></p></div>`,
      `<h3>Ví dụ có lời giải · Vì sao "Ab1@" mà không phải bốn test riêng?</h3>
<p>Nhiều bạn nộp bốn UTCID ("A", "a", "1", "@"). Mỗi ca phủ D1 True và False cùng một lệnh tăng, nên gộp lại cũng đạt 100% — nhưng đề hỏi bộ <strong>tối thiểu</strong>. Hãy đếm xem mỗi ca trong bốn ca đó thêm được gì so với "Ab1@": không gì cả. Người chấm vì vậy có thể đọc bốn test thành "không hiểu tối thiểu là gì". Hãy trình bày UTCID01 là bộ tối thiểu, và nếu thêm ca thì ghi rõ đó là ca biên/bất thường bổ sung, đúng như lưới ở trên.</p>
<div class="pitfall co-tieu-de"><strong>V(G) ≠ số test case cho decision coverage.</strong> Ở đây V(G) = 5 còn tối thiểu là 1. Hai con số chỉ bằng nhau khi mỗi đường đi kết thúc ở một <code>return</code> khác nhau, như lưu đồ thuế thu nhập ở bài PE-2 (V(G) = 10, tối thiểu = 10). Luôn lập luận từ các kết cục phải phủ, rồi mới dùng V(G) để kiểm tra lại.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Với giới hạn 255 ký tự, "một ký tự" là gì?</strong>
<ul>
<li><strong>Unicode</strong> — chữ "Quyết" có thể lưu thành 5 code point (chữ "ế" dựng sẵn) hoặc 6 (e + hai dấu tổ hợp).</li>
<li><strong>JavaScript</strong> — <code>.length</code> đếm đơn vị UTF-16.</li>
<li><strong>MySQL</strong> — cột <code>VARCHAR(255)</code> với bảng mã không phải UTF8 thì đếm byte.</li>
</ul>
<p>Một cái tên đúng 255 ký tự vì thế có thể qua kiểm tra ở trình duyệt mà vẫn bị cơ sở dữ liệu cắt cụt. Tester thực tế thêm một ca biên có dấu tiếng Việt (255 ký tự, nhiều chữ "ế", "ữ") và một ca có emoji.</p>
<p><em>Ngoài giáo trình vì CTFL coi "độ dài" chỉ là một con số trừu tượng.</em></p></div>`),
    books([
      ['fst4', 'Ch.3 §2.4 "Applying review techniques" (checklist-based review) — book p.94–99 (PDF p.108–113); Ch.4 §2.1–2.2 EP and BVA p.113–118, Table 4.1 p.116; Ch.4 §3.1–3.3 statement and decision coverage p.133–139', 'Chương 3 §2.4 "Applying review techniques" (review theo checklist) — trang sách 94–99 (PDF 108–113); Chương 4 §2.1–2.2 EP và BVA tr.113–118, Bảng 4.1 tr.116; Chương 4 §3.1–3.3 statement và decision coverage tr.133–139'],
      ['sp5', '§5.1.1 EP (PDF p.165), §5.1.2 BVA (PDF p.176), §5.2.1–5.2.2 statement and decision testing (PDF p.215–220)', '§5.1.1 EP (PDF tr.165), §5.1.2 BVA (PDF tr.176), §5.2.1–5.2.2 statement và decision testing (PDF tr.215–220)'],
      ['junit', 'Ch.2 "Exploring core JUnit" — assertions and expected exceptions, PDF p.18–48', 'Chương 2 "Exploring core JUnit" — assertion và exception mong đợi, PDF tr.18–48'],
    ]),
  ].join('\n'),
};

/* ═════════════════════════ PE-2 SU24 PE1 (PE1.jpg) ═════════════════════════ */
const SU24_Q1 = `
import java.util.Scanner;

class Fibonacci {
    public static void main(String args) {
        int n;
        System.out.print("Enter the number of first digits in "
                        + "the fibonacci sequence you want to output: ");
        try (Scanner scanner = Scanner(System.in)) {
            n = scanner.nextInt();
        }
        int n1 = 0; n2 = 1;
        if (n == 1) {
            System.out.print(n1);
        } else if (n == 2) {
            System.out.print(n1 + " " + n2);
        } else {
            System.out.print(n1 + " " + n2);
            int tempNthTerm;
            for (int i = 3; i <= n - 1; i++) {
                tempNthTerm = n1 - n2;
                System.out.print(" " + tempNthTerm);
                n2 = tempNthTerm;
                n1 = n2;
            }
        }
    }
}`;

const BMI_T31 = t31([
  { c: 'Age', vp: [['whole number 2 – 120', 'VP1'], ['2 – 20 → children &amp; teens table', 'VP2'], ['21 – 120 → adult table', 'VP3']],
    ip: [['blank', 'IP1'], ['number &lt; 2', 'IP2'], ['number &gt; 120', 'IP3'], ['not a number ("abc")', 'IP4']],
    vb: [['2', 'VB1'], ['120', 'VB2'], ['20 (last child age)', 'VB3'], ['21 (first adult age)', 'VB4']],
    ib: [['1', 'IB1'], ['121', 'IB2']] },
  { c: 'Gender', vp: [['Male (default)', 'VP4'], ['Female', 'VP5']] },
  { c: 'Height (cm)', vp: [['number &gt; 0', 'VP6']], ip: [['blank', 'IP5'], ['number ≤ 0', 'IP6'], ['not a number', 'IP7']], vb: [['0.01', 'VB5']], ib: [['0', 'IB3']] },
  { c: 'Weight (kg)', vp: [['number &gt; 0', 'VP7']], ip: [['blank', 'IP8'], ['number ≤ 0', 'IP9'], ['not a number', 'IP10']], vb: [['0.01', 'VB6']], ib: [['0', 'IB4']] },
  { c: 'Adult classification (age 21–120), BMI kg/m²',
    vp: [['Severe Thinness &lt; 16', 'VP8'], ['Moderate Thinness 16 – &lt; 17', 'VP9'], ['Mild Thinness 17 – &lt; 18.5', 'VP10'], ['Normal 18.5 – &lt; 25', 'VP11'], ['Overweight 25 – &lt; 30', 'VP12'], ['Obese Class I 30 – &lt; 35', 'VP13'], ['Obese Class II 35 – &lt; 40', 'VP14'], ['Obese Class III ≥ 40', 'VP15']],
    vb: [['15.99 (Severe)', 'VB7'], ['16.00 (Moderate)', 'VB8'], ['16.99 (Moderate)', 'VB9'], ['17.00 (Mild)', 'VB10'], ['18.49 (Mild)', 'VB11'], ['18.50 (Normal)', 'VB12'], ['24.99 (Normal)', 'VB13'], ['25.00 (Overweight)', 'VB14'], ['29.99 (Overweight)', 'VB15'], ['30.00 (Obese I)', 'VB16'], ['34.99 (Obese I)', 'VB17'], ['35.00 (Obese II)', 'VB18'], ['39.99 (Obese II)', 'VB19'], ['40.00 (Obese III)', 'VB20']] },
  { c: 'Child classification (age 2–20), percentile of BMI-for-age (chart, by gender)',
    vp: [['Underweight &lt; 5th', 'VP16'], ['Healthy weight 5th – &lt; 85th', 'VP17'], ['At risk of overweight 85th – &lt; 95th', 'VP18'], ['Overweight ≥ 95th', 'VP19']] },
  { c: 'Clear button', vp: [['click Clear → all inputs cleared', 'VP20']] },
]);
const AD = (age, g, w, bmi, cls) => [`Age ${age} / ${g} / Height 200 / Weight ${w}`, `"BMI for adults = ${bmi} kg/m2 ${cls}"`];
const BMI_T32 = t32([
  ['1', ...AD(21, 'Male', 64, '16.00', 'Moderate Thinness'), 'VP1, VP3, VB4, VP4, VP6, VP7, VP9, VB8'],
  ['2', ...AD(120, 'Female', 63.96, '15.99', 'Severe Thinness'), 'VP1, VP3, VB2, VP5, VP6, VP7, VP8, VB7'],
  ['3', ...AD(45, 'Male', 74, '18.50', 'Normal'), 'VP1, VP3, VP4, VP6, VP7, VP11, VB12'],
  ['4', ...AD(60, 'Female', 119.96, '29.99', 'Overweight'), 'VP1, VP3, VP5, VP6, VP7, VP12, VB15'],
  ['5', ...AD(30, 'Male', 160, '40.00', 'Obese Class III'), 'VP1, VP3, VP4, VP6, VP7, VP15, VB20'],
  ['6', 'Age 2 / Female / Height 90 / Weight 12.96 (BMI 16.00; girls, 2 y: 5th ≈ 14.4, 85th ≈ 18.0)', '"BMI for children and tens = 16.00 kg/m2 Healthy weight"', 'VP1, VP2, VB1, VP5, VP6, VP7, VP17'],
  ['7', 'Age 20 / Male / Height 175 / Weight 49 (BMI 16.00; boys, 20 y: 5th ≈ 19)', '"BMI for children and tens = 16.00 kg/m2 Underweight"', 'VP1, VP2, VB3, VP4, VP6, VP7, VP16'],
  ['8', 'Age 1 / Male / Height 200 / Weight 64', '"Input data for Age is out of range!"', 'IP2, IB1'],
  ['9', 'Age (blank) / Male / Height 200 / Weight 64', '"Please provide an age between 2 and 120"', 'IP1'],
  ['10', 'Age 30 / Male / Height 0 / Weight 70', '"Input data for Height is out of range!" (assumption A3)', 'IP6, IB3'],
], BMI_T31.tags, [
  ['11', 'Age 121 / Male / 200 / 64', '"Input data for Age is out of range!"', 'IP3, IB2'],
  ['12', 'Age "abc" / Male / 200 / 64', '"Please provide an age between 2 and 120" (A4)', 'IP4'],
  ['13', 'Age 30 / Height (blank) / Weight 70', '"Please provide a height greater than 0" (A3)', 'IP5'],
  ['14', 'Age 30 / Height "abc" / Weight 70', '"Please provide a height greater than 0" (A4)', 'IP7'],
  ['15', 'Age 30 / Height 170 / Weight (blank)', '"Please provide a weight greater than 0" (A3)', 'IP8'],
  ['16', 'Age 30 / Height 170 / Weight −5', '"Input data for Weight is out of range!"', 'IP9'],
  ['17', 'Age 30 / Height 170 / Weight "x"', '"Please provide a weight greater than 0" (A4)', 'IP10'],
  ['18', 'Age 30 / Height 170 / Weight 0', '"Input data for Weight is out of range!"', 'IB4'],
  ['19', 'Age 30 / Male / Height 0.01 / Weight 0.01', '"BMI for adults = 1000000.00 kg/m2 Obese Class III"', 'VB5, VB6'],
  ['20', 'Adult, Height 200 / Weight 67.96', 'BMI 16.99 Moderate Thinness', 'VB9'],
  ['21', 'Adult, Height 200 / Weight 68', 'BMI 17.00 Mild Thinness', 'VP10, VB10'],
  ['22', 'Adult, Height 200 / Weight 73.96', 'BMI 18.49 Mild Thinness', 'VB11'],
  ['23', 'Adult, Height 200 / Weight 99.96', 'BMI 24.99 Normal', 'VB13'],
  ['24', 'Adult, Height 200 / Weight 100', 'BMI 25.00 Overweight', 'VB14'],
  ['25', 'Adult, Height 200 / Weight 120', 'BMI 30.00 Obese Class I', 'VP13, VB16'],
  ['26', 'Adult, Height 200 / Weight 139.96', 'BMI 34.99 Obese Class I', 'VB17'],
  ['27', 'Adult, Height 200 / Weight 140', 'BMI 35.00 Obese Class II', 'VP14, VB18'],
  ['28', 'Adult, Height 200 / Weight 159.96', 'BMI 39.99 Obese Class II', 'VB19'],
  ['29', 'Age 10 / Male / Height 140 / Weight 39.2 (BMI 20.00; boys, 10 y: 85th ≈ 19.4, 95th ≈ 22)', '"BMI for children and tens = 20.00 kg/m2 At risk of overweight"', 'VP18'],
  ['30', 'Age 10 / Female / Height 140 / Weight 49 (BMI 25.00; girls, 10 y: 95th ≈ 23)', '"BMI for children and tens = 25.00 kg/m2 Overweight"', 'VP19'],
  ['31', 'Fill all fields, click Clear', 'Age, Height, Weight empty; Gender back to Male', 'VP20'],
]);
const PRE2 = 'The BMI Calculator page is open in the browser';
const bmiSteps = (age, g, h, w) => ['Click "Clear"', `Enter Age = ${age}`, `Select Gender = ${g}`, `Enter Height = ${h}`, `Enter Weight = ${w}`, 'Click "Calculate"', 'Read the message box'];
const BMI_T33 = t33('BMI Calculator', [
  ['TC1', 'First adult age, BMI exactly 16.00', PRE2, bmiSteps(21, 'Male', 200, 64), 'Message box: "BMI for adults = 16.00 kg/m2 Moderate Thinness"'],
  ['TC2', 'Maximum age, BMI just below 16', PRE2, bmiSteps(120, 'Female', 200, 63.96), '"BMI for adults = 15.99 kg/m2 Severe Thinness"'],
  ['TC3', 'Adult, BMI exactly 18.50', PRE2, bmiSteps(45, 'Male', 200, 74), '"BMI for adults = 18.50 kg/m2 Normal"'],
  ['TC4', 'Adult, BMI just below 30', PRE2, bmiSteps(60, 'Female', 200, 119.96), '"BMI for adults = 29.99 kg/m2 Overweight"'],
  ['TC5', 'Adult, BMI exactly 40', PRE2, bmiSteps(30, 'Male', 200, 160), '"BMI for adults = 40.00 kg/m2 Obese Class III"'],
  ['TC6', 'Minimum age, girl, healthy BMI', PRE2 + '; BMI-for-age chart for girls available', bmiSteps(2, 'Female', 90, 12.96), '"BMI for children and tens = 16.00 kg/m2 Healthy weight"'],
  ['TC7', 'Last child age, boy, low BMI', PRE2 + '; BMI-for-age chart for boys available', bmiSteps(20, 'Male', 175, 49), '"BMI for children and tens = 16.00 kg/m2 Underweight"'],
  ['TC8', 'Age below range', PRE2, bmiSteps(1, 'Male', 200, 64), '"Input data for Age is out of range!"; no BMI shown'],
  ['TC9', 'Age left blank', PRE2, bmiSteps('(leave blank)', 'Male', 200, 64), '"Please provide an age between 2 and 120"; no BMI shown'],
  ['TC10', 'Height zero', PRE2, bmiSteps(30, 'Male', 0, 70), '"Input data for Height is out of range!"; no BMI shown', 'Message text assumed (A3)'],
]);

const TAX_JAVA = `
/** fncPersonalIncomeTax — translated 1:1 from the flowchart (one if per diamond). */
public class IncomeTax {
    public static float fncPersonalIncomeTax(float sal, float te, int nod) {
        if (sal < 0) return -1;                          // D1
        if (te < 0) return -1;                           // D2
        if (nod < 0) return -1;                          // D3
        float ti = sal - te - 9000000 - nod * 4000000;   // taxable income
        if (ti > 0) {                                    // D4
            if (ti > 5000000) {                          // D5
                if (ti > 10000000) {                     // D6
                    if (ti > 20000000) {                 // D7
                        if (ti > 40000000) {             // D8
                            if (ti > 80000000) {         // D9
                                return 0.30f * ti - 16250000;
                            }
                            return 0.25f * ti - 6250000;
                        }
                        return 0.20f * ti - 2250000;
                    }
                    return 0.15f * ti - 750000;
                }
                return 0.10f * ti - 250000;
            }
            return 0.05f * ti;
        }
        return 0;
    }
}`;

const L2 = {
  title: 'PE-2 — SU24 PE1 paper: Fibonacci review · income-tax flowchart · BMI calculator|||PE-2 — Đề SU24 PE1: review Fibonacci · lưu đồ thuế TNCN · BMI calculator',
  slug: 'swt301-pe-su24-pe1',
  type: 'DOCUMENT',
  description: 'Đề SWT301_SU24_PE1 (4 trang ảnh) giải trọn: 10 lỗi Fibonacci có bằng chứng javac, lưu đồ thuế V(G)=10 và đúng 10 UTCID tối thiểu (đo 18/18 nhánh, bẫy float), bảng 3.1 BMI 54 tag, 10 test case + độ phủ tag, bảng 3.3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-2 · PE paper 1 (PE1.jpg) pages 1–4</span>
<h2>SU24 PE1 — Fibonacci · fncPersonalIncomeTax · BMI Calculator</h2>
<p class="lead">The paper is called <strong>SWT301_SU24_PE1_404208</strong> and uses the same 3 + 3 + 4 layout and the same Excel template as FA23. It is in the Exam room as <strong>SWT301-PE14</strong> ("Practical Exam Đề 14 (SU 2024 - PE1)").</p>
<p>Its Q2 is the paper's trickiest question: the method is given only as a <em>flowchart</em>, and the minimum number of tests is exactly V(G) = 10 — students who stop at 8 lose the decision-coverage marks.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — apply a review technique (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement and decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP and BVA (K3).</li>
</ul></div>
<table>
<thead><tr><th>Q</th><th>Points</th><th>Task</th><th>Budget</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Find ≥ 6 issues in <code>Fibonacci</code> (27 lines)</td><td>20 min</td></tr>
<tr><td>2</td><td>3</td><td>Minimum unit tests, 100% statement + decision coverage, for the flowchart <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code></td><td>25 min</td></tr>
<tr><td>3</td><td>4</td><td>Black-box test cases for the <strong>BMI Calculator</strong> (tables 3.1 / 3.2 / 3.3)</td><td>40 min</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Thi thực hành · Bài PE-2 · PE paper 1 (PE1.jpg) trang 1–4</span>
<h2>SU24 PE1 — Fibonacci · fncPersonalIncomeTax · BMI Calculator</h2>
<p class="lead">Đề có tên <strong>SWT301_SU24_PE1_404208</strong>, cùng bố cục 3 + 3 + 4 và cùng template Excel với FA23. Trong Phòng thi nó là <strong>SWT301-PE14</strong> ("Đề thi thực hành số 14 (SU 2024 - PE1)").</p>
<p>Q2 là câu khó nhất đề: phương thức chỉ được cho dưới dạng <em>lưu đồ</em>, và số test tối thiểu đúng bằng V(G) = 10 — bạn nào dừng ở 8 sẽ mất điểm decision coverage.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — áp dụng kỹ thuật review (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement và decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP và BVA (K3).</li>
</ul></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Yêu cầu</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Tìm ≥ 6 lỗi trong <code>Fibonacci</code> (27 dòng)</td><td>20 phút</td></tr>
<tr><td>2</td><td>3</td><td>Bộ unit test tối thiểu, 100% statement + decision coverage, cho lưu đồ <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code></td><td>25 phút</td></tr>
<tr><td>3</td><td>4</td><td>Test case hộp đen cho <strong>BMI Calculator</strong> (bảng 3.1 / 3.2 / 3.3)</td><td>40 phút</td></tr>
</tbody>
</table>`),
    bi(`<h2>📄 The paper page by page</h2><p>PE1.jpg is one very tall screenshot that contains this 4-page paper <strong>twice</strong> (the first copy is footed "Page 1|1 … 4|4", the second "Page 1|4 … 4|4", same content). Only the first copy is shown.</p>`,
      `<h2>📄 Đề thi từng trang</h2><p>PE1.jpg là một ảnh chụp rất dài chứa đề 4 trang này <strong>hai lần</strong> (bản đầu chân trang ghi "Page 1|1 … 4|4", bản sau ghi "Page 1|4 … 4|4", nội dung như nhau). Ở đây chỉ hiện bản đầu.</p>`),
    pages('pe1', [
      [1, 'Instructions and Question 1 — Fibonacci',
        `<p class="y-chinh">🎯 Page 1 = the zero rules in red, then Question 1 (3 points): find at least 6 issues in <code>Fibonacci</code>.</p>
<p class="nhan">The red instruction — remember it</p>
<ul>
<li><strong>Answer format</strong> — <strong>in the provided template, in English, reflecting this exam paper</strong>.</li>
<li><strong>Irrelevant keyword</strong> — any keyword not related to this paper → that answer gets zero.</li>
<li><strong>No template</strong> — the whole exam gets zero.</li>
</ul>
<p class="nhan">Question 1</p>
<ul>
<li><strong>A slip in the paper</strong> — the introduction says the sequence consists of "positive integers starting with 0 and 1"; 0 is not positive.</li>
<li><strong>Line numbers</strong> — the code is shown with its own numbers 1–27: use exactly these in the Line column.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang 1 = các luật điểm 0 màu đỏ, rồi Câu 1 (3 điểm): tìm ít nhất 6 lỗi trong <code>Fibonacci</code>.</p>
<p class="nhan">Dòng hướng dẫn màu đỏ — phải nhớ</p>
<ul>
<li><strong>Cách trả lời</strong> — <strong>trong template được phát, bằng tiếng Anh, bám đúng đề này</strong>.</li>
<li><strong>Từ khoá lạc đề</strong> — có từ khoá không liên quan tới đề → câu đó 0 điểm.</li>
<li><strong>Không dùng template</strong> — cả bài 0 điểm.</li>
</ul>
<p class="nhan">Câu 1</p>
<ul>
<li><strong>Sơ suất của đề</strong> — đoạn giới thiệu nói dãy gồm "các số nguyên dương bắt đầu bằng 0 và 1"; 0 không phải số dương.</li>
<li><strong>Số dòng</strong> — code có sẵn số dòng 1–27: dùng đúng các số này ở cột Line.</li>
</ul>`],
      [2, 'Question 2 — flowchart of fncPersonalIncomeTax; Question 3 — BMI Calculator screen',
        `<p class="y-chinh">🎯 Q2 gives no code — only a flowchart of <code>fncPersonalIncomeTax</code>; Q3 starts at the bottom with the BMI Calculator screen.</p>
<p class="nhan">Q2 — reading the flowchart</p>
<ul>
<li><strong>Legend</strong> — <em>sal = salary, te = tax-exempt amounts, nod = number of dependents</em>. (The paper spells coverage "covergage".)</li>
<li><strong>Three guards</strong> — the diamonds <code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code> each lead on "Yes" to the same box <strong>Return −1</strong>.</li>
<li><strong>Taxable income</strong> — otherwise <code>ti := sal − te − 9,000,000 − nod × 4,000,000</code>.</li>
<li><strong>No tax</strong> — if <code>ti &gt; 0</code> is "No" → <strong>Return 0</strong>.</li>
</ul>
<p class="nhan">Then a ladder of five brackets</p>
<ol>
<li>ti &gt; 5M? No → 5% × ti</li>
<li>&gt; 10M? No → 10% × ti − 250,000</li>
<li>&gt; 20M? No → 15% × ti − 750,000</li>
<li>&gt; 40M? No → 20% × ti − 2,250,000</li>
<li>&gt; 80M? No → 25% × ti − 6,250,000; Yes → 30% × ti − 16,250,000</li>
</ol>
<p class="nhan">Q3 (4 points) — the screen</p>
<p>The BMI Calculator: Age (hint "ages: 2 - 120"), Gender radio Male/Female, Height (cm), Weight (kg), and the buttons Calculate and Clear.</p>`,
        `<p class="y-chinh">🎯 Q2 không cho code — chỉ cho lưu đồ của <code>fncPersonalIncomeTax</code>; Q3 bắt đầu ở cuối trang với màn hình BMI Calculator.</p>
<p class="nhan">Q2 — đọc lưu đồ</p>
<ul>
<li><strong>Chú thích</strong> — <em>sal = lương, te = khoản miễn thuế, nod = số người phụ thuộc</em>. (Đề viết sai chính tả "covergage".)</li>
<li><strong>Ba phép chặn</strong> — ba hình thoi <code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code>, nhánh "Yes" của cả ba cùng dẫn vào một ô <strong>Return −1</strong>.</li>
<li><strong>Thu nhập tính thuế</strong> — nếu không thì <code>ti := sal − te − 9.000.000 − nod × 4.000.000</code>.</li>
<li><strong>Không phải nộp thuế</strong> — nếu <code>ti &gt; 0</code> là "No" → <strong>Return 0</strong>.</li>
</ul>
<p class="nhan">Tiếp theo là thang năm bậc</p>
<ol>
<li>ti &gt; 5 triệu? No → 5% × ti</li>
<li>&gt; 10 triệu? No → 10% × ti − 250.000</li>
<li>&gt; 20 triệu? No → 15% × ti − 750.000</li>
<li>&gt; 40 triệu? No → 20% × ti − 2.250.000</li>
<li>&gt; 80 triệu? No → 25% × ti − 6.250.000; Yes → 30% × ti − 16.250.000</li>
</ol>
<p class="nhan">Q3 (4 điểm) — màn hình</p>
<p>BMI Calculator gồm Age (gợi ý "ages: 2 - 120"), radio Gender Male/Female, Height (cm), Weight (kg), và hai nút Calculate, Clear.</p>`],
      [3, 'Function detail of the BMI Calculator and the adult BMI table',
        `<p class="y-chinh">🎯 Page 3 is the function detail of the BMI Calculator — every bullet is a test condition.</p>
<p class="nhan">The input rules</p>
<ul>
<li><strong>Age</strong> — required, number between 2 and 120.</li>
<li><strong>Gender</strong> — required, default Male.</li>
<li><strong>Height, Weight</strong> — required, number greater than 0.</li>
<li><strong>Clear</strong> — empties the fields.</li>
</ul>
<p class="nhan">What Calculate does</p>
<ul>
<li><strong>Age blank</strong> → "Please provide an age between 2 and 120".</li>
<li><strong>Age a number out of range</strong> → "Input data for Age is out of range!".</li>
<li><strong>Height and Weight</strong> — "similar validation"; their messages are not spelled out, an assumption you must state.</li>
<li><strong>Formula</strong> — BMI = Weight × 10,000 / (Height × Height).</li>
<li><strong>20 &lt; Age ≤ 120</strong> → "BMI for adults = &lt;BMI&gt; kg/m² &lt;Classification&gt;", using eight classes from Severe Thinness (&lt; 16) to Obese Class III (&gt; 40).</li>
<li><strong>2 ≤ Age ≤ 20</strong> → "BMI for children and tens …" (sic — "teens").</li>
</ul>
<div class="pitfall">The adult ranges are written "16 - 17", "17 - 18.5"…, so which class owns the value 17 exactly is not defined — state the usual lower-inclusive assumption.</div>`,
        `<p class="y-chinh">🎯 Trang 3 là mô tả chức năng của BMI Calculator — mỗi gạch đầu dòng là một điều kiện test.</p>
<p class="nhan">Luật cho các ô nhập</p>
<ul>
<li><strong>Age</strong> — bắt buộc, là số từ 2 đến 120.</li>
<li><strong>Gender</strong> — bắt buộc, mặc định Male.</li>
<li><strong>Height, Weight</strong> — bắt buộc, là số lớn hơn 0.</li>
<li><strong>Clear</strong> — xoá các ô.</li>
</ul>
<p class="nhan">Nút Calculate làm gì</p>
<ul>
<li><strong>Age để trống</strong> → "Please provide an age between 2 and 120".</li>
<li><strong>Age là số ngoài khoảng</strong> → "Input data for Age is out of range!".</li>
<li><strong>Height và Weight</strong> — "kiểm tra tương tự"; thông báo của chúng không được ghi ra, một giả định bạn phải nêu.</li>
<li><strong>Công thức</strong> — BMI = Weight × 10.000 / (Height × Height).</li>
<li><strong>20 &lt; Age ≤ 120</strong> → "BMI for adults = &lt;BMI&gt; kg/m² &lt;Classification&gt;", theo tám nhóm từ Severe Thinness (&lt; 16) đến Obese Class III (&gt; 40).</li>
<li><strong>2 ≤ Age ≤ 20</strong> → "BMI for children and tens …" (đề viết nhầm "tens" thay cho "teens").</li>
</ul>
<div class="pitfall">Các khoảng người lớn viết "16 - 17", "17 - 18.5"…, nên giá trị đúng 17 thuộc nhóm nào là không xác định — hãy nêu giả định thông dụng: tính từ cận dưới.</div>`],
      [4, 'Children & teens table and the CDC BMI-for-age percentile charts',
        `<p class="y-chinh">🎯 Children are classified by <em>percentile</em>, not by BMI — so the same BMI means different things at different ages and genders.</p>
<p class="nhan">The four classes</p>
<ul>
<li><strong>Underweight</strong> — &lt; 5%</li>
<li><strong>Healthy weight</strong> — 5%–85%</li>
<li><strong>At risk of overweight</strong> — 85%–95%</li>
<li><strong>Overweight</strong> — &gt; 95%</li>
</ul>
<p class="nhan">Where the percentile comes from</p>
<p>The two CDC charts "Body mass index-for-age percentiles: Boys / Girls, 2 to 20 years" (curves 5th…95th for boys, 3rd…97th for girls).</p>
<p class="nhan">What it means for your test cases</p>
<ul>
<li><strong>State the basis</strong> — a good test case for a child states age, gender <em>and</em> the chart values it relies on.</li>
<li><strong>Stay inside a band</strong> — exact percentile borders cannot be read precisely from a printed chart; pick values well inside a band.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trẻ em được phân loại theo <em>bách phân vị</em>, không theo BMI — nên cùng một BMI mang nghĩa khác nhau ở tuổi và giới tính khác nhau.</p>
<p class="nhan">Bốn nhóm</p>
<ul>
<li><strong>Underweight</strong> — &lt; 5%</li>
<li><strong>Healthy weight</strong> — 5%–85%</li>
<li><strong>At risk of overweight</strong> — 85%–95%</li>
<li><strong>Overweight</strong> — &gt; 95%</li>
</ul>
<p class="nhan">Bách phân vị lấy từ đâu</p>
<p>Hai biểu đồ CDC "Body mass index-for-age percentiles: Boys / Girls, 2 to 20 years" (đường 5th…95th cho nam, 3rd…97th cho nữ).</p>
<p class="nhan">Hệ quả cho test case</p>
<ul>
<li><strong>Ghi rõ căn cứ</strong> — một test case tốt cho trẻ em phải ghi tuổi, giới tính <em>và</em> các giá trị biểu đồ mà nó dựa vào.</li>
<li><strong>Chọn hẳn trong một nhóm</strong> — không thể đọc chính xác đường biên bách phân vị từ biểu đồ in; hãy chọn giá trị nằm hẳn bên trong một nhóm.</li>
</ul>`],
    ]),

    /* ── Q1 ── */
    bi(`<h2>✅ Question 1 — code review of Fibonacci</h2>
<h4>The task</h4>
<p>Find at least 6 issues in the 27-line <code>Fibonacci</code> class, with the paper's own line numbers.</p>
<h3>Step 1 — compile it first</h3>
<p>javac stops with <strong>7 errors</strong>, from two root causes:</p>
<ul>
<li><strong>Line 8</strong> — <code>Scanner(System.in)</code> without <code>new</code> is read as a call to a method named Scanner.</li>
<li><strong>Lines 11, 15, 17, 20, 22, 23</strong> — all the same root cause: <code>int n1 = 0; n2 = 1;</code> declares only <code>n1</code>.</li>
</ul>
<h3>Step 2 — run it</h3>
<ul>
<li><strong>Entry point</strong> — fix those two and it compiles, but the launcher refuses to start it because <code>main(String args)</code> is not the entry point.</li>
<li><strong>Logic</strong> — fix that too and for n = 5 it prints <code>0 1 -1 0</code> (four terms, one negative).</li>
</ul>
<h3>Step 3 — separate the faults</h3>
<p>Three separate faults cause that one output line:</p>
<ol>
<li>subtraction instead of addition;</li>
<li>the wrong update order;</li>
<li>the <code>n - 1</code> loop bound.</li>
</ol>
<p>One line = one issue in the template, so each gets its own row.</p>`,
      `<h2>✅ Câu 1 — review code Fibonacci</h2>
<h4>Đề yêu cầu</h4>
<p>Tìm ít nhất 6 lỗi trong class <code>Fibonacci</code> 27 dòng, ghi đúng số dòng của đề.</p>
<h3>Bước 1 — biên dịch trước</h3>
<p>javac dừng với <strong>7 lỗi</strong>, từ hai nguyên nhân gốc:</p>
<ul>
<li><strong>Dòng 8</strong> — <code>Scanner(System.in)</code> thiếu <code>new</code> nên bị hiểu là gọi một method tên Scanner.</li>
<li><strong>Các dòng 11, 15, 17, 20, 22, 23</strong> — cùng một nguyên nhân: <code>int n1 = 0; n2 = 1;</code> chỉ khai báo <code>n1</code>.</li>
</ul>
<h3>Bước 2 — chạy thử</h3>
<ul>
<li><strong>Điểm vào</strong> — sửa hai chỗ đó là biên dịch được, nhưng lúc chạy JVM từ chối vì <code>main(String args)</code> không phải điểm vào chương trình.</li>
<li><strong>Logic</strong> — sửa nốt thì với n = 5 chương trình in <code>0 1 -1 0</code> (bốn số hạng, có một số âm).</li>
</ul>
<h3>Bước 3 — tách từng lỗi</h3>
<p>Ba lỗi riêng biệt cùng gây ra dòng output đó:</p>
<ol>
<li>dấu trừ thay cho dấu cộng;</li>
<li>sai thứ tự cập nhật;</li>
<li>cận vòng lặp <code>n - 1</code>.</li>
</ol>
<p>Mỗi lỗi một dòng trong template, nên mỗi lỗi có dòng riêng.</p>`),
    sheet('Answer sheet — Q1 template · Bài làm mẫu cho sheet Q1', tbl(['Issue No', 'Description', 'Line'], [
      ['1', '[Compile error] <code>Scanner(System.in)</code> is missing the keyword <code>new</code> → "cannot find symbol: method Scanner". Fix: <code>new Scanner(System.in)</code>.', '8'],
      ['2', '[Compile error] <code>int n1 = 0; n2 = 1;</code> declares only n1; n2 is undeclared → "cannot find symbol" at lines 11, 15, 17, 20, 22, 23. Fix: <code>int n1 = 0, n2 = 1;</code>', '11'],
      ['3', '[Wrong entry point] <code>main(String args)</code> compiles, but the JVM reports "Main method not found in class Fibonacci". Fix: <code>public static void main(String[] args)</code>.', '4'],
      ['4', '[Logic] The next term is computed as <code>n1 - n2</code> → 0 1 -1 0 … Fix: <code>tempNthTerm = n1 + n2;</code>', '20'],
      ['5', '[Logic] Wrong update order: <code>n2 = tempNthTerm; n1 = n2;</code> makes both variables equal to the new term. Fix: <code>n1 = n2; n2 = tempNthTerm;</code>', '22–23'],
      ['6', '[Logic – off by one] <code>i &lt;= n - 1</code> prints only n − 1 terms (n = 5 prints 4). Fix: <code>i &lt;= n</code>.', '19'],
      ['7', '[Missing validation] n ≤ 0 is not handled: n = 0 or n = −3 fall into the else branch and print "0 1". Fix: <code>if (n &lt;= 0)</code> → error message and stop.', '12'],
      ['8', '[Exception handling] <code>nextInt()</code> throws InputMismatchException for non-numeric input. Fix: catch it (or use <code>hasNextInt()</code>).', '9'],
      ['9', '[Overflow] <code>int</code> overflows from the 48th term (2,971,215,073 &gt; Integer.MAX_VALUE = 2,147,483,647). Fix: use <code>long</code> (or BigInteger) and limit n.', '11, 18'],
      ['10', '[Coding practice] The prompt asks for the "number of first digits" — the program prints terms, not digits; the class is not public and two variables are declared on one line. Fix: "Enter how many Fibonacci terms to print", <code>public class</code>, one declaration per line.', '3, 6–7'],
    ])),
    code(`
$ javac Fibonacci.java                         # the paper's code, unchanged
Fibonacci.java:8: error: cannot find symbol
Fibonacci.java:11: error: cannot find symbol
Fibonacci.java:15: error: cannot find symbol
Fibonacci.java:17: error: cannot find symbol
Fibonacci.java:20: error: cannot find symbol
Fibonacci.java:22: error: cannot find symbol
Fibonacci.java:23: error: cannot find symbol
7 errors

$ (only "new" and "int n1 = 0, n2 = 1" fixed) echo 10 | java Fibonacci
Error: Main method not found in class Fibonacci, please define the main method as:
   public static void main(String[] args)

$ (main fixed too, logic untouched)
n=1 -> 0          n=2 -> 0 1          n=5 -> 0 1 -1 0
n=10 -> 0 1 -1 0 0 0 0 0 0            n=0 -> 0 1          n=-3 -> 0 1

$ (corrected version: long, i <= n, n1 = n2; n2 = next; validation; try/catch)
n=1 -> 0          n=2 -> 0 1          n=5 -> 0 1 1 2 3
n=10 -> 0 1 1 2 3 5 8 13 21 34        n=0 -> n must be a positive integer.
n=abc -> Please enter a whole number.`),

    /* ── Q2 ── */
    bi(`<h2>✅ Question 2 — the income-tax flowchart</h2>
<h4>The task</h4>
<p>Design the <strong>minimum</strong> unit test cases for 100% statement and 100% decision coverage of <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code>, given only as a flowchart.</p>
<h3>Step 1 — control-flow graph and V(G)</h3>
<p>Decisions in flowchart order:</p>
<ol class="hai-cot">
<li><strong>D1</strong> sal &lt; 0</li>
<li><strong>D2</strong> te &lt; 0</li>
<li><strong>D3</strong> nod &lt; 0</li>
<li><strong>D4</strong> ti &gt; 0</li>
<li><strong>D5</strong> ti &gt; 5,000,000</li>
<li><strong>D6</strong> ti &gt; 10,000,000</li>
<li><strong>D7</strong> ti &gt; 20,000,000</li>
<li><strong>D8</strong> ti &gt; 40,000,000</li>
<li><strong>D9</strong> ti &gt; 80,000,000</li>
</ol>
<ul>
<li><strong>Nodes</strong> — 1 start + 9 decisions + 1 assignment (ti) + 8 return boxes + 1 exit = <strong>N = 20</strong>.</li>
<li><strong>Edges</strong> — 1 (start) + 9 × 2 (decisions) + 1 (ti → D4) + 8 (returns → exit) = <strong>E = 28</strong>.</li>
<li><strong>V(G)</strong> = 28 − 20 + 2 = <strong>10</strong> = 9 decisions + 1.</li>
</ul>
<h3>Step 2 — why the minimum is exactly 10</h3>
<p>Every test ends in exactly one return, and no return box is reached by two different decision outcomes except Return −1. Count the tests each group of outcomes forces:</p>
<ol>
<li><strong>D1, D2, D3 True → 3 tests</strong> — each ends the method immediately, so no test can make two of them true.</li>
<li><strong>D4 False (→ 0) → 1 test.</strong></li>
<li><strong>D5–D9 False → 5 tests</strong> — they end at five different returns.</li>
<li><strong>D9 True (→ 30%) → 1 test.</strong></li>
</ol>
<ul>
<li><strong>Total = 10.</strong> A branch probe confirmed <strong>18/18</strong> decision outcomes with UTCID01–10 — and dropping <em>any</em> one of them leaves 17/18.</li>
<li><strong>The trap — statement coverage alone</strong>: 8 tests suffice (one per return box; the three −1 exits share one box). 8 tests give 100% statements but only 16/18 decision outcomes.</li>
</ul>
<h3>Step 3 — choose the data</h3>
<ul>
<li><strong>Work backwards from ti</strong> — with te = 0 and nod = 0, <strong>ti = sal − 9,000,000</strong>.</li>
<li><strong>One ti per bracket</strong> — pick sal = 9,000,000 + a ti in the middle of each bracket: 3M, 8M, 15M, 30M, 60M, 100M.</li>
<li><strong>ti = 0 exactly</strong> (sal = 9,000,000) — used for the "Return 0" branch because it is also the boundary of D4.</li>
</ul>
<h4>Result — the 10 test cases</h4>
<table>
<thead><tr><th>UTCID</th><th>sal / te / nod</th><th>ti</th><th>Expected (by hand)</th></tr></thead>
<tbody>
<tr><td>01</td><td>−1 / 0 / 0</td><td>—</td><td>−1</td></tr>
<tr><td>02</td><td>10,000,000 / −1 / 0</td><td>—</td><td>−1</td></tr>
<tr><td>03</td><td>10,000,000 / 0 / −1</td><td>—</td><td>−1</td></tr>
<tr><td>04</td><td>9,000,000 / 0 / 0</td><td>0</td><td>0</td></tr>
<tr><td>05</td><td>12,000,000 / 0 / 0</td><td>3,000,000</td><td>5% × 3,000,000 = 150,000</td></tr>
<tr><td>06</td><td>17,000,000 / 0 / 0</td><td>8,000,000</td><td>800,000 − 250,000 = 550,000</td></tr>
<tr><td>07</td><td>24,000,000 / 0 / 0</td><td>15,000,000</td><td>2,250,000 − 750,000 = 1,500,000</td></tr>
<tr><td>08</td><td>39,000,000 / 0 / 0</td><td>30,000,000</td><td>6,000,000 − 2,250,000 = 3,750,000</td></tr>
<tr><td>09</td><td>69,000,000 / 0 / 0</td><td>60,000,000</td><td>15,000,000 − 6,250,000 = 8,750,000</td></tr>
<tr><td>10</td><td>109,000,000 / 0 / 0</td><td>100,000,000</td><td>30,000,000 − 16,250,000 = 13,750,000</td></tr>
</tbody>
</table>`,
      `<h2>✅ Câu 2 — lưu đồ thuế thu nhập</h2>
<h4>Đề yêu cầu</h4>
<p>Thiết kế bộ unit test <strong>tối thiểu</strong> đạt 100% statement và 100% decision coverage cho <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code>, vốn chỉ được cho dưới dạng lưu đồ.</p>
<h3>Bước 1 — đồ thị luồng điều khiển và V(G)</h3>
<p>Các quyết định theo thứ tự lưu đồ:</p>
<ol class="hai-cot">
<li><strong>D1</strong> sal &lt; 0</li>
<li><strong>D2</strong> te &lt; 0</li>
<li><strong>D3</strong> nod &lt; 0</li>
<li><strong>D4</strong> ti &gt; 0</li>
<li><strong>D5</strong> ti &gt; 5.000.000</li>
<li><strong>D6</strong> ti &gt; 10.000.000</li>
<li><strong>D7</strong> ti &gt; 20.000.000</li>
<li><strong>D8</strong> ti &gt; 40.000.000</li>
<li><strong>D9</strong> ti &gt; 80.000.000</li>
</ol>
<ul>
<li><strong>Số nút</strong> — 1 nút bắt đầu + 9 quyết định + 1 phép gán (ti) + 8 ô return + 1 nút thoát = <strong>N = 20</strong>.</li>
<li><strong>Số cạnh</strong> — 1 (bắt đầu) + 9 × 2 (quyết định) + 1 (ti → D4) + 8 (return → thoát) = <strong>E = 28</strong>.</li>
<li><strong>V(G)</strong> = 28 − 20 + 2 = <strong>10</strong> = 9 quyết định + 1.</li>
</ul>
<h3>Bước 2 — vì sao tối thiểu đúng bằng 10</h3>
<p>Mỗi test kết thúc ở đúng một return, và không ô return nào được hai kết cục khác nhau dẫn tới, trừ Return −1. Đếm số test mà từng nhóm kết cục buộc phải có:</p>
<ol>
<li><strong>D1, D2, D3 True → 3 test</strong> — mỗi kết cục đều kết thúc hàm ngay, nên không test nào làm được hai trong ba cùng đúng.</li>
<li><strong>D4 False (→ 0) → 1 test.</strong></li>
<li><strong>D5–D9 False → 5 test</strong> — dừng ở năm return khác nhau.</li>
<li><strong>D9 True (→ 30%) → 1 test.</strong></li>
</ol>
<ul>
<li><strong>Tổng = 10.</strong> Một bộ đo nhánh xác nhận <strong>18/18</strong> kết cục với UTCID01–10 — và bỏ <em>bất kỳ</em> một ca nào thì chỉ còn 17/18.</li>
<li><strong>Cái bẫy — riêng statement coverage</strong>: 8 test là đủ (mỗi ô return một test; ba lối −1 dùng chung một ô). 8 test cho 100% statement nhưng chỉ 16/18 kết cục quyết định.</li>
</ul>
<h3>Bước 3 — chọn dữ liệu</h3>
<ul>
<li><strong>Tính ngược từ ti</strong> — với te = 0 và nod = 0 thì <strong>ti = sal − 9.000.000</strong>.</li>
<li><strong>Mỗi bậc một ti</strong> — chọn sal = 9.000.000 + một giá trị ti ở giữa mỗi bậc: 3 triệu, 8 triệu, 15 triệu, 30 triệu, 60 triệu, 100 triệu.</li>
<li><strong>ti = 0 đúng</strong> (sal = 9.000.000) — dùng cho nhánh "Return 0" vì nó cũng là biên của D4.</li>
</ul>
<h4>Kết quả — 10 test case</h4>
<table>
<thead><tr><th>UTCID</th><th>sal / te / nod</th><th>ti</th><th>Kết quả mong đợi (tính tay)</th></tr></thead>
<tbody>
<tr><td>01</td><td>−1 / 0 / 0</td><td>—</td><td>−1</td></tr>
<tr><td>02</td><td>10.000.000 / −1 / 0</td><td>—</td><td>−1</td></tr>
<tr><td>03</td><td>10.000.000 / 0 / −1</td><td>—</td><td>−1</td></tr>
<tr><td>04</td><td>9.000.000 / 0 / 0</td><td>0</td><td>0</td></tr>
<tr><td>05</td><td>12.000.000 / 0 / 0</td><td>3.000.000</td><td>5% × 3.000.000 = 150.000</td></tr>
<tr><td>06</td><td>17.000.000 / 0 / 0</td><td>8.000.000</td><td>800.000 − 250.000 = 550.000</td></tr>
<tr><td>07</td><td>24.000.000 / 0 / 0</td><td>15.000.000</td><td>2.250.000 − 750.000 = 1.500.000</td></tr>
<tr><td>08</td><td>39.000.000 / 0 / 0</td><td>30.000.000</td><td>6.000.000 − 2.250.000 = 3.750.000</td></tr>
<tr><td>09</td><td>69.000.000 / 0 / 0</td><td>60.000.000</td><td>15.000.000 − 6.250.000 = 8.750.000</td></tr>
<tr><td>10</td><td>109.000.000 / 0 / 0</td><td>100.000.000</td><td>30.000.000 − 16.250.000 = 13.750.000</td></tr>
</tbody>
</table>`),
    sheet('Answer sheet — Q2 template · Bài làm mẫu cho sheet Q2', utGrid({
      fcode: 'IncomeTax', fname: 'fncPersonalIncomeTax(float sal, float te, int nod)', loc: 25,
      req: 'Returns −1 for negative inputs, 0 when taxable income ti = sal − te − 9,000,000 − nod × 4,000,000 ≤ 0, otherwise the bracket formula. 10 test cases = minimum for 100% statement and 100% decision coverage (V(G) = 10, 18/18 outcomes).',
      ids: ['UTCID01', 'UTCID02', 'UTCID03', 'UTCID04', 'UTCID05', 'UTCID06', 'UTCID07', 'UTCID08', 'UTCID09', 'UTCID10'],
      pre: [['The function is implemented exactly as the flowchart (class IncomeTax)', 'OOOOOOOOOO']],
      inputs: [
        ['sal', [['-1', 'O.........'], ['10,000,000', '.OO.......'], ['9,000,000', '...O......'], ['12,000,000', '....O.....'], ['17,000,000', '.....O....'], ['24,000,000', '......O...'], ['39,000,000', '.......O..'], ['69,000,000', '........O.'], ['109,000,000', '.........O']]],
        ['te', [['0', 'O.OOOOOOOO'], ['-1', '.O........']]],
        ['nod', [['0', 'OO.OOOOOOO'], ['-1', '..O.......']]],
      ],
      ret: [['-1', 'OOO.......'], ['0', '...O......'], ['150,000', '....O.....'], ['550,000', '.....O....'], ['1,500,000', '......O...'], ['3,750,000', '.......O..'], ['8,750,000', '........O.'], ['13,750,000 (float result: 13,750,002)', '.........O']],
      exc: [['(none)', '..........']],
      log: [['(the function writes no log)', '..........']],
      type: 'AAABNNNNNN', result: 'PPPPPPPPPP', date: '11/09/2026',
    })),
    code(TAX_JAVA),
    code(`
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class IncomeTaxTest {
    private static void run(String id, float sal, float te, int nod, float expected) {
        float actual = IncomeTax.fncPersonalIncomeTax(sal, te, nod);
        System.out.printf("%s sal=%,.0f te=%,.0f nod=%d -> %,.2f (expected %,.0f)%n", id, sal, te, nod, actual, expected);
        assertEquals(expected, actual, 10f);   // float arithmetic: allow 10 VND
    }
    @Test public void utcid01() { run("UTCID01", -1f,           0f,  0, -1f); }
    @Test public void utcid02() { run("UTCID02", 10_000_000f,  -1f,  0, -1f); }
    @Test public void utcid03() { run("UTCID03", 10_000_000f,   0f, -1, -1f); }
    @Test public void utcid04() { run("UTCID04", 9_000_000f,    0f,  0,  0f); }
    @Test public void utcid05() { run("UTCID05", 12_000_000f,   0f,  0,  150_000f); }
    @Test public void utcid06() { run("UTCID06", 17_000_000f,   0f,  0,  550_000f); }
    @Test public void utcid07() { run("UTCID07", 24_000_000f,   0f,  0,  1_500_000f); }
    @Test public void utcid08() { run("UTCID08", 39_000_000f,   0f,  0,  3_750_000f); }
    @Test public void utcid09() { run("UTCID09", 69_000_000f,   0f,  0,  8_750_000f); }
    @Test public void utcid10() { run("UTCID10", 109_000_000f,  0f,  0,  13_750_000f); }
}
--- real output (JDK 21, JUnit 4.13.2) ---
UTCID01 sal=-1 te=0 nod=0 -> -1.00 (expected -1)
UTCID02 sal=10,000,000 te=-1 nod=0 -> -1.00 (expected -1)
UTCID03 sal=10,000,000 te=0 nod=-1 -> -1.00 (expected -1)
UTCID04 sal=9,000,000 te=0 nod=0 -> 0.00 (expected 0)
UTCID05 sal=12,000,000 te=0 nod=0 -> 150,000.00 (expected 150,000)
UTCID06 sal=17,000,000 te=0 nod=0 -> 550,000.00 (expected 550,000)
UTCID07 sal=24,000,000 te=0 nod=0 -> 1,500,000.00 (expected 1,500,000)
UTCID08 sal=39,000,000 te=0 nod=0 -> 3,750,000.00 (expected 3,750,000)
UTCID09 sal=69,000,000 te=0 nod=0 -> 8,750,000.00 (expected 8,750,000)
UTCID10 sal=109,000,000 te=0 nod=0 -> 13,750,002.00 (expected 13,750,000)
OK (10 tests)

--- the first run used a tolerance of 1 and FAILED on UTCID10 ---
java.lang.AssertionError: expected:<1.375E7> but was:<1.3750002E7>
float : 1.3750002E7      double: 1.375E7      0.30f is really 0.300000011920928955078125`),
    bi(`<h4>What the float failure teaches</h4>
<p>The flowchart's signature uses <code>float</code>. <code>0.30f</code> cannot be stored exactly (it is 0.300000011920928955078125), and at 100,000,000 the error becomes 2 VND: the method returns 13,750,002 instead of 13,750,000.</p>
<p>Two consequences for the exam:</p>
<ol>
<li><strong>Compare with a tolerance</strong> — floating-point results need <code>assertEquals(expected, actual, delta)</code>.</li>
<li><strong>A legitimate remark to add</strong> — money should be <code>long</code> (whole VND) or <code>BigDecimal</code>, never <code>float</code>.</li>
</ol>`,
      `<h4>Bài học từ lần fail vì float</h4>
<p>Chữ ký trong lưu đồ dùng <code>float</code>. <code>0.30f</code> không lưu được chính xác (thực chất là 0,300000011920928955078125), và ở mức 100.000.000 sai số thành 2 đồng: hàm trả 13.750.002 thay vì 13.750.000.</p>
<p>Hai hệ quả cho bài thi:</p>
<ol>
<li><strong>So sánh có dung sai</strong> — kết quả số thực phải dùng <code>assertEquals(expected, actual, delta)</code>.</li>
<li><strong>Một nhận xét hợp lệ nên ghi thêm</strong> — tiền phải dùng <code>long</code> (đồng nguyên) hoặc <code>BigDecimal</code>, không bao giờ dùng <code>float</code>.</li>
</ol>`),

    /* ── Q3 ── */
    bi(`<h2>✅ Question 3 — BMI Calculator</h2>
<h4>The task</h4>
<p>Black-box test cases for the BMI Calculator in the Q3 template: table 3.1 (EP/BVA with tags), table 3.2 (10 cases with data and tags), table 3.3 (the same cases with preconditions and steps).</p>
<h4>Assumptions — Notes line</h4>
<ol>
<li><strong>A1</strong> — Age is a whole number of years.</li>
<li><strong>A2</strong> — Height (cm) and Weight (kg) accept numbers with up to two decimals, so the smallest value &gt; 0 is 0.01; the BMI is shown with two decimals.</li>
<li><strong>A3</strong> — "Similar validation" for Height/Weight means: blank → "Please provide a height (weight) greater than 0"; number ≤ 0 → "Input data for Height (Weight) is out of range!".</li>
<li><strong>A4</strong> — Non-numeric text is rejected like a blank field.</li>
<li><strong>A5</strong> — Adult classes are lower-inclusive: 16.00 is Moderate Thinness, 18.50 Normal, 25.00 Overweight, 30.00 Obese I, 35.00 Obese II, 40.00 Obese III.</li>
<li><strong>A6</strong> — Children's classes are read from the CDC chart for the given age and gender; test values are chosen well inside a band.</li>
<li><strong>A7</strong> — Clear empties Age, Height and Weight and resets Gender to Male.</li>
</ol>
<h3>Step 1 — the test-data trick</h3>
<p>With Height = 200 cm the formula becomes BMI = Weight × 10,000 / 40,000 = <strong>Weight / 4</strong>, so every adult border is one division away (all computed by script):</p>
<ul>
<li>64 → 16.00 · 63.96 → 15.99</li>
<li>74 → 18.50 · 119.96 → 29.99</li>
<li>160 → 40.00</li>
</ul>
<h3>Step 2 — two kinds of Age boundaries</h3>
<ul>
<li><strong>The validity range</strong> — 2 / 120, with 1 / 121 invalid.</li>
<li><strong>The switch between the two tables</strong> — 20 / 21. It matters because a wrong <code>&lt;</code> vs <code>≤</code> at 20 would send a 20-year-old to the adult table.</li>
</ul>`,
      `<h2>✅ Câu 3 — BMI Calculator</h2>
<h4>Đề yêu cầu</h4>
<p>Test case hộp đen cho BMI Calculator trên template Q3: bảng 3.1 (EP/BVA kèm tag), bảng 3.2 (10 ca có dữ liệu và tag), bảng 3.3 (cùng các ca đó kèm tiền điều kiện và các bước).</p>
<h4>Giả định — dòng Notes</h4>
<ol>
<li><strong>A1</strong> — Age là số năm nguyên.</li>
<li><strong>A2</strong> — Height (cm) và Weight (kg) nhận số có tối đa hai chữ số thập phân, nên giá trị nhỏ nhất &gt; 0 là 0,01; BMI hiển thị hai chữ số thập phân.</li>
<li><strong>A3</strong> — "Kiểm tra tương tự" cho Height/Weight nghĩa là: để trống → "Please provide a height (weight) greater than 0"; số ≤ 0 → "Input data for Height (Weight) is out of range!".</li>
<li><strong>A4</strong> — Nhập chữ bị từ chối như ô trống.</li>
<li><strong>A5</strong> — Nhóm người lớn tính từ cận dưới: 16,00 là Moderate Thinness, 18,50 Normal, 25,00 Overweight, 30,00 Obese I, 35,00 Obese II, 40,00 Obese III.</li>
<li><strong>A6</strong> — Nhóm trẻ em đọc từ biểu đồ CDC theo tuổi và giới tính; giá trị test chọn nằm hẳn bên trong một nhóm.</li>
<li><strong>A7</strong> — Clear xoá Age, Height, Weight và đưa Gender về Male.</li>
</ol>
<h3>Bước 1 — mẹo chọn dữ liệu</h3>
<p>Với Height = 200 cm công thức thành BMI = Weight × 10.000 / 40.000 = <strong>Weight / 4</strong>, nên mọi biên của người lớn chỉ cách một phép chia (đều tính bằng script):</p>
<ul>
<li>64 → 16,00 · 63,96 → 15,99</li>
<li>74 → 18,50 · 119,96 → 29,99</li>
<li>160 → 40,00</li>
</ul>
<h3>Bước 2 — hai loại biên của Age</h3>
<ul>
<li><strong>Khoảng hợp lệ</strong> — 2 / 120, với 1 / 121 không hợp lệ.</li>
<li><strong>Chỗ chuyển giữa hai bảng</strong> — 20 / 21. Quan trọng vì nhầm <code>&lt;</code> với <code>≤</code> ở 20 sẽ đưa người 20 tuổi sang bảng người lớn.</li>
</ul>`),
    sheet('Answer sheet — Table 3.1 Test Analysis · Bài làm mẫu bảng 3.1', BMI_T31.html),
    sheet('Answer sheet — Table 3.2 Test case design · Bài làm mẫu bảng 3.2', BMI_T32.table),
    BMI_T32.check,
    BMI_T32.ext,
    sheet('Answer sheet — Table 3.3 Test case (procedures) · Bài làm mẫu bảng 3.3', BMI_T33),
    bi(`<h3>Ví dụ có lời giải · Worked example — the 8-test answer that loses a point</h3>
<p>A typical submission for Q2 has one test per return box: sal = −1 (→ −1), then 0, 5%, 10%, 15%, 20%, 25%, 30%. Eight tests, 100% statement coverage — but te &lt; 0 and nod &lt; 0 were never true. Decision coverage is 16/18 = 88.9%, and the paper asked for 100% of both. The two missing tests (te = −1 and nod = −1 with a valid salary) are the difference between full marks and 2 out of 3.</p>
<div class="pitfall co-tieu-de"><strong>Do not let an earlier check hide a later one.</strong> For UTCID02 (te = −1) the salary must be valid (≥ 0), otherwise D1 returns −1 first and D2 is never evaluated; likewise UTCID03 needs sal ≥ 0 and te ≥ 0. The same rule applies to invalid values in black-box cases: one invalid input per case.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>How the percentile charts are really computed.</strong>
<ul>
<li><strong>The LMS method</strong> — the CDC charts are drawn from it: for every age (in months) and sex a table gives three numbers L, M, S.</li>
<li><strong>z-score</strong> — a child's z is ((BMI/M)ᴸ − 1) / (L·S); the percentile is the normal distribution of that z.</li>
<li><strong>Why testers care</strong> — a production BMI calculator implements this table, which makes exact percentile boundaries testable. For example, boys aged 10.0 years have M ≈ 16.6 and an 85th-percentile BMI ≈ 19.4.</li>
</ul>
<p><em>Outside the syllabus because the paper only expects you to read the printed chart.</em></p></div>`,
      `<h3>Ví dụ có lời giải · Bài 8 test bị mất một điểm</h3>
<p>Một bài nộp điển hình cho Q2 có mỗi ô return một test: sal = −1 (→ −1), rồi 0, 5%, 10%, 15%, 20%, 25%, 30%. Tám test, 100% statement coverage — nhưng te &lt; 0 và nod &lt; 0 chưa từng đúng. Decision coverage chỉ 16/18 = 88,9%, trong khi đề đòi 100% cả hai. Hai test còn thiếu (te = −1 và nod = −1 với lương hợp lệ) chính là khác biệt giữa điểm tối đa và 2/3.</p>
<div class="pitfall co-tieu-de"><strong>Đừng để phép kiểm phía trước che phép kiểm phía sau.</strong> Ở UTCID02 (te = −1) lương phải hợp lệ (≥ 0), nếu không D1 trả −1 trước và D2 không bao giờ được xét; tương tự UTCID03 cần sal ≥ 0 và te ≥ 0. Quy tắc này cũng áp dụng cho giá trị không hợp lệ trong ca hộp đen: mỗi ca một đầu vào không hợp lệ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Biểu đồ bách phân vị thực ra được tính thế nào.</strong>
<ul>
<li><strong>Phương pháp LMS</strong> — biểu đồ CDC được vẽ theo nó: với mỗi tháng tuổi và giới tính có một bảng cho ba số L, M, S.</li>
<li><strong>z-score</strong> — z của trẻ là ((BMI/M)ᴸ − 1) / (L·S); bách phân vị là phân phối chuẩn của z đó.</li>
<li><strong>Vì sao tester quan tâm</strong> — một ứng dụng BMI thật cài đặt bảng này, nhờ vậy biên bách phân vị trở nên kiểm thử được chính xác. Ví dụ bé trai 10,0 tuổi có M ≈ 16,6 và BMI ở bách phân vị 85 ≈ 19,4.</li>
</ul>
<p><em>Ngoài giáo trình vì đề chỉ yêu cầu đọc biểu đồ in sẵn.</em></p></div>`),
    books([
      ['fst4', 'Ch.4 §3 "White-box test techniques" — statement and decision coverage, book p.132–139 (PDF p.146–153), Fig. 4.4 control flow p.139; Ch.4 §2.1–2.2 EP and BVA p.113–118', 'Chương 4 §3 "White-box test techniques" — statement và decision coverage, trang sách 132–139 (PDF 146–153), Hình 4.4 luồng điều khiển tr.139; Chương 4 §2.1–2.2 EP và BVA tr.113–118'],
      ['sp5', '§5.2.2 Decision testing and coverage (PDF p.218), §5.1.2 BVA (PDF p.176)', '§5.2.2 Decision testing và độ phủ (PDF tr.218), §5.1.2 BVA (PDF tr.176)'],
      ['sp4', '§5.2.2 decision/branch coverage p.148 (PDF p.163); §4.2 cyclomatic number p.100 (PDF p.115)', '§5.2.2 decision/branch coverage tr.148 (PDF 163); §4.2 số cyclomatic tr.100 (PDF 115)'],
      ['junit', 'Ch.2 core assertions incl. <code>assertEquals(double, double, delta)</code>, PDF p.18–48', 'Chương 2 các assertion cốt lõi, gồm <code>assertEquals(double, double, delta)</code>, PDF tr.18–48'],
    ]),
  ].join('\n'),
};

/* ═════════════════════════ PE-3 FALL24 (PE2.jpg) ═════════════════════════ */
const ORD_T31 = t31([
  { c: 'itemPrices (array)', vp: [['non-empty array', 'VP1']], ip: [['null', 'IP1'], ['empty array', 'IP2']], vb: [['1 item', 'VB1']], ib: [['0 items', 'IB1']] },
  { c: 'each item price', vp: [['price &gt; 0', 'VP2']], ip: [['price &lt; 0', 'IP3']], vb: [['0.01', 'VB2']], ib: [['0', 'IB2']] },
  { c: 'isVIP', vp: [['true (20%)', 'VP3'], ['false', 'VP4']] },
  { c: 'customerType (used when isVIP = false)', vp: [['"Regular", any letter case (5%)', 'VP5'], ['any other text, e.g. "Guest" (0%)', 'VP6']], ip: [['null', 'IP4']] },
  { c: 'discountCode', vp: [['no code: null or "" (+0%)', 'VP7'], ['"SALE10" (+10%)', 'VP8'], ['"WELCOME5" (+5%)', 'VP9'], ['unknown code, e.g. "SALE20" (+0%)', 'VP10'], ['right code, wrong case: "sale10" (+0%)', 'VP11']] },
]);
const ORD_T32 = t32([
  ['TC01', '{} / "VIP" / false / null', 'IllegalArgumentException "No items in the order."', 'IP2, IB1'],
  ['TC02', '{100, 200} / "VIP" / true / null', '240.0', 'VP1, VP2, VP3, VP7'],
  ['TC03', 'null / "Regular" / false / null', 'IllegalArgumentException "No items in the order."', 'IP1'],
  ['TC04', '{0} / "Regular" / false / null', 'IllegalArgumentException "Item price must be greater than zero."', 'IB2'],
  ['TC05', '{50, -10} / "Regular" / false / null', 'IllegalArgumentException "Item price must be greater than zero."', 'IP3'],
  ['TC06', '{0.01} / "Regular" / false / null', '0.0095', 'VP1, VB1, VP2, VB2, VP4, VP5, VP7'],
  ['TC07', '{100} / "regular" / false / ""', '95.0', 'VP4, VP5, VP7'],
  ['TC08', '{100} / "Guest" / false / "SALE10"', '90.0', 'VP4, VP6, VP8'],
  ['TC09', '{100, 200} / "VIP" / true / "SALE10"', '210.0', 'VP3, VP8'],
  ['TC10', '{200} / "Regular" / false / "WELCOME5"', '180.0', 'VP5, VP9'],
  ['TC11', '{50} / "Guest" / false / "SALE20"', '50.0', 'VP6, VP10'],
  ['TC12', '{100} / "Guest" / false / "sale10"', '100.0', 'VP6, VP11'],
  ['TC13', '{100} / null / false / null', 'NullPointerException — DEFECT: a missing customer type should be treated as non-regular (or rejected with a clear message)', 'IP4'],
], ORD_T31.tags);

const SHOP_T31 = t31([
  { c: 'Login', vp: [['customer logged in', 'VP1']], ip: [['not logged in', 'IP1']] },
  { c: 'Shopping cart at checkout', vp: [['≥ 1 item', 'VP2']], ip: [['empty cart (A1)', 'IP2']], vb: [['exactly 1 item', 'VB1']], ib: [['0 items', 'IB1']] },
  { c: 'Discount code (optional)', vp: [['no code entered', 'VP3'], ['SAVE10 (10% off)', 'VP4'], ['WELCOME5 by a new customer (5% off)', 'VP5']], ip: [['unknown code, e.g. "SAVE50" (A2)', 'IP3'], ['WELCOME5 by a returning customer (A2)', 'IP4']] },
  { c: 'Payment', vp: [['credit/debit card, valid, enough funds', 'VP6'], ['PayPal', 'VP7']], ip: [['insufficient funds (A3)', 'IP5'], ['invalid card details (A3)', 'IP6']] },
]);
const SHOP_T32 = t32([
  ['TC001', 'Cart: Product A ($50) + Product B ($30); no code; credit card 4111 1111 1111 1111, valid expiry and CVV', 'Total $80.00; order confirmation with the 2 items; stock of A and B reduced by 1', 'VP1, VP2, VP3, VP6'],
  ['TC002', 'Cart: A + B + C ($100); code SAVE10; PayPal', 'Discount −$10.00, total $90.00; confirmation; stock updated', 'VP1, VP2, VP4, VP7'],
  ['TC003', 'New customer; cart: 1 × Product C ($20); code WELCOME5; valid card', 'Total $19.00; confirmation', 'VP1, VP2, VB1, VP5, VP6'],
  ['TC004', 'Cart: A ($50); code "SAVE50"; valid card', 'Error "invalid discount code"; checkout continues at $50.00; confirmation', 'VP1, VP2, IP3, VP6'],
  ['TC005', 'Returning customer; cart: B ($30); code WELCOME5; valid card', 'Error: code only for new customers; order placed at $30.00', 'IP4'],
  ['TC006', 'Remove every item, click Checkout', 'Prompt "add items to your cart"; checkout page not opened', 'IP2, IB1'],
  ['TC007', 'Cart: A ($50); card with insufficient funds', 'Payment fails; message + prompt to retry; no order; stock unchanged', 'IP5'],
  ['TC008', 'Cart: A ($50); card with expired date / wrong CVV', 'Payment fails; "invalid card details"; prompt to retry; no order', 'IP6'],
  ['TC009', 'Cart: B ($30); first attempt insufficient-funds card, retry with PayPal', 'Second attempt succeeds; exactly one order and one confirmation; stock reduced once', 'IP5, VP7'],
  ['TC010', 'Not logged in; cart: A; click Checkout', 'Redirected to login; after login the cart still holds A and checkout continues', 'IP1'],
], SHOP_T31.tags);
const SHOP_T33 = t33('Place an Order (Online Shopping System)', [
  ['TC001', 'Normal flow — order without discount, card payment', 'Customer logged in; A and B in stock', ['Add Product A ($50) and Product B ($30) to the cart', 'Leave the discount code empty', 'Click Checkout; check the total shows $80.00', 'Select Credit card; enter 4111 1111 1111 1111, expiry 12/28, CVV 123', 'Click Pay'], 'Payment succeeds; confirmation lists A and B, total $80.00; inventory A −1, B −1', 'NF'],
  ['TC002', 'Normal flow — SAVE10 with PayPal', 'Customer logged in', ['Add A, B and C ($100)', 'Enter code SAVE10, click Apply', 'Click Checkout; check discount −$10.00 and total $90.00', 'Select PayPal and confirm in the PayPal window'], 'Order confirmed, total $90.00, discount shown on the confirmation', 'NF'],
  ['TC003', 'Normal flow — WELCOME5 by a new customer, one item', 'Newly registered customer, no previous order', ['Add 1 × Product C ($20)', 'Enter code WELCOME5, click Apply', 'Checkout; check total $19.00', 'Pay with a valid card'], 'Order confirmed, total $19.00', 'NF'],
  ['TC004', 'Invalid discount code, continue without it', 'Customer logged in', ['Add Product A ($50)', 'Enter code SAVE50, click Apply', 'Read the message', 'Click Checkout; check total $50.00', 'Pay with a valid card'], 'Error "invalid discount code"; order placed at $50.00', 'AL (A2)'],
  ['TC005', 'WELCOME5 used by a returning customer', 'Customer logged in with at least one earlier order', ['Add Product B ($30)', 'Enter WELCOME5, click Apply', 'Checkout; pay with a valid card'], 'Error: WELCOME5 is for new customers; order placed at $30.00', 'AL (A2), assumption'],
  ['TC006', 'Checkout with an empty cart', 'Customer logged in; cart contains Product A', ['Remove Product A from the cart', 'Click Checkout'], 'System prompts to add items; checkout not opened', 'EX (A1)'],
  ['TC007', 'Payment fails — insufficient funds', 'Customer logged in; test card with $0 balance', ['Add Product A ($50)', 'Checkout; select Credit card; enter the $0-balance card', 'Click Pay'], 'Message "payment failed: insufficient funds"; prompt to retry; no order; inventory unchanged', 'EX (A3)'],
  ['TC008', 'Payment fails — invalid card details', 'Customer logged in', ['Add Product A', 'Checkout; enter a card with expiry 01/20 and CVV 12', 'Click Pay'], 'Message "invalid card details"; prompt to retry; no order', 'EX (A3)'],
  ['TC009', 'Retry after a failed payment', 'Customer logged in; test card with $0 balance', ['Add Product B ($30); checkout', 'Pay with the $0-balance card → failure', 'Choose Retry, select PayPal, confirm'], 'Second attempt succeeds; exactly one order and one confirmation; inventory reduced once', 'AL (A3)'],
  ['TC010', 'Checkout when not logged in', 'Not logged in; Product A in the cart', ['Click Checkout', 'Log in with a valid account'], 'Redirected to login; after login the cart still holds A and checkout continues', 'EX (precondition)'],
]);

const L3 = {
  title: 'PE-3 — FALL24 paper: defect report · OrderCalculator JUnit · shopping use case|||PE-3 — Đề FALL24: defect report · JUnit OrderCalculator · use case mua hàng',
  slug: 'swt301-pe-fall24',
  type: 'DOCUMENT',
  description: 'Đề FALL24 (6 trang ảnh, 85 phút, 3+5+2): 9 defect fileProcessor theo mẫu DF có bằng chứng javac, 13 test JUnit cho OrderCalculator (đã chạy, 17/18 nhánh — nhánh còn lại không thể tới), 10 test case use case NF/AL/EX.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-3 · PE paper 2 (PE2.jpg) pages 1–6</span>
<h2>FALL24 — a different shape: 3 + 5 + 2, a Word file, and JUnit</h2>
<p class="lead">The FALL24 paper breaks the classic pattern: 85 minutes, IDEs <em>allowed</em>, one Word document instead of the Excel template, a defect-report format for Q1, a 5-point JUnit question and a 2-point use-case question. In the Exam room it is <strong>SWT301-PE11</strong> ("Practical Exam Đề 11 (FA 2024 - PE1)"). Because an IDE is allowed, the expectation rises: your tests must compile and your expected values must be right.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — apply a review technique (K3).</li>
<li><strong>LO-5.6.1</strong> — write a defect report (K3).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP and BVA (K3).</li>
<li><strong>LO-4.3.2</strong> — decision coverage (K2).</li>
<li><strong>LO-4.2.5</strong> — use-case testing (K2).</li>
</ul></div>
<table>
<thead><tr><th>Q</th><th>Points</th><th>Task</th><th>Budget</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Six defects in <code>fileProcessor</code>, each as Defect ID / Name / Line / Description / Fix</td><td>20 min</td></tr>
<tr><td>2</td><td>5</td><td>Complete the JUnit class for <code>calculateTotalPrice</code>: EP + BVA + all branches; one-line summary per test</td><td>40 min</td></tr>
<tr><td>3</td><td>2</td><td>Use-case test cases for "Place an Order": normal, alternative, exception (NF/AL/EX)</td><td>20 min</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Thi thực hành · Bài PE-3 · PE paper 2 (PE2.jpg) trang 1–6</span>
<h2>FALL24 — một dạng khác: 3 + 5 + 2, file Word, và JUnit</h2>
<p class="lead">Đề FALL24 phá khuôn cũ: 85 phút, <em>được</em> dùng IDE, nộp một file Word thay cho template Excel, Q1 theo mẫu báo cáo defect, một câu JUnit 5 điểm và một câu use case 2 điểm. Trong Phòng thi nó là <strong>SWT301-PE11</strong> ("Đề thi thực hành số 11 (FA 2024 - PE1)"). Vì được dùng IDE nên yêu cầu cao hơn: test của bạn phải biên dịch được và giá trị mong đợi phải đúng.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-3.2.4</strong> — áp dụng kỹ thuật review (K3).</li>
<li><strong>LO-5.6.1</strong> — viết báo cáo defect (K3).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP và BVA (K3).</li>
<li><strong>LO-4.3.2</strong> — decision coverage (K2).</li>
<li><strong>LO-4.2.5</strong> — kiểm thử theo use case (K2).</li>
</ul></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Yêu cầu</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Sáu defect trong <code>fileProcessor</code>, mỗi defect theo Defect ID / Name / Line / Description / Fix</td><td>20 phút</td></tr>
<tr><td>2</td><td>5</td><td>Hoàn thiện lớp JUnit cho <code>calculateTotalPrice</code>: EP + BVA + mọi nhánh; mỗi test một dòng tóm tắt</td><td>40 phút</td></tr>
<tr><td>3</td><td>2</td><td>Test case theo use case "Place an Order": luồng chính, luồng thay thế, ngoại lệ (NF/AL/EX)</td><td>20 phút</td></tr>
</tbody>
</table>`),
    bi(`<h2>📄 The paper page by page</h2>`, `<h2>📄 Đề thi từng trang</h2>`),
    pages('pe2', [
      [1, 'Title, instructions and the Q1 defect-report template',
        `<p class="y-chinh">🎯 FALL24 changes the rules: an IDE is allowed, you submit one Word file, and Q1 is a small defect report with five fixed fields.</p>
<p class="nhan">Instructions — "SWT301 FALL24 - The final PE · Duration: 85 minutes"</p>
<ul>
<li><strong>Tools</strong> — students <strong>may</strong> use IDEs like NetBeans or IntelliJ.</li>
<li><strong>Submission</strong> — <strong>a single Word document</strong>.</li>
</ul>
<p class="nhan">Question 1 (3 points) — the answer format</p>
<p>The class "contains six defects related to code standards, logic, and best practices". Each defect gets:</p>
<ol>
<li><strong>Defect ID</strong> — DF001, DF002…</li>
<li><strong>Defect Name</strong> — e.g. "Naming Convention Error"</li>
<li><strong>Line Number</strong></li>
<li><strong>Defect Description</strong> — one sentence</li>
<li><strong>Fixing Solution</strong> — the code change</li>
</ol>
<p>That is a small defect report (lesson 5.6) — use exactly these five fields.</p>`,
        `<p class="y-chinh">🎯 FALL24 đổi luật: được dùng IDE, nộp một file Word, và Q1 là một báo cáo defect thu nhỏ với năm trường cố định.</p>
<p class="nhan">Hướng dẫn — "SWT301 FALL24 - The final PE · Duration: 85 minutes"</p>
<ul>
<li><strong>Công cụ</strong> — sinh viên <strong>được</strong> dùng IDE như NetBeans hay IntelliJ.</li>
<li><strong>Bài nộp</strong> — <strong>một file Word duy nhất</strong>.</li>
</ul>
<p class="nhan">Câu 1 (3 điểm) — hình thức trả lời</p>
<p>Class "có sáu defect liên quan tới chuẩn code, logic và thực hành tốt". Mỗi defect gồm:</p>
<ol>
<li><strong>Defect ID</strong> — DF001, DF002…</li>
<li><strong>Defect Name</strong> — ví dụ "Naming Convention Error"</li>
<li><strong>Line Number</strong></li>
<li><strong>Defect Description</strong> — một câu</li>
<li><strong>Fixing Solution</strong> — thay đổi code</li>
</ol>
<p>Đó là một báo cáo defect thu nhỏ (bài 5.6) — dùng đúng năm trường này.</p>`],
      [2, 'The fileProcessor class (lines 1–35) and the start of Question 2',
        `<p class="y-chinh">🎯 Page 2 = the <code>fileProcessor</code> class to review (lines 1–35) and the start of Question 2 (5 points).</p>
<p class="nhan">The class</p>
<ul>
<li><strong>Fields</strong> — <code>BufferedReader reader</code> and <code>String FilePath</code>.</li>
<li><strong>Methods</strong> — <code>openFile(String)</code> (lines 4–13), <code>readFile()</code> (14–25), <code>processFile()</code> (26–34).</li>
<li><strong>Imports</strong> — there are no import lines at all.</li>
</ul>
<p class="nhan">Question 2 introduces OrderCalculator</p>
<p>"apply equivalence partitioning and boundary value analysis for the input parameters. Additionally, ensure that your test cases cover all branches of the code to achieve 100% code coverage."</p>`,
        `<p class="y-chinh">🎯 Trang 2 = class <code>fileProcessor</code> cần review (dòng 1–35) và phần mở đầu Câu 2 (5 điểm).</p>
<p class="nhan">Class</p>
<ul>
<li><strong>Trường</strong> — <code>BufferedReader reader</code> và <code>String FilePath</code>.</li>
<li><strong>Method</strong> — <code>openFile(String)</code> (dòng 4–13), <code>readFile()</code> (14–25), <code>processFile()</code> (26–34).</li>
<li><strong>Import</strong> — không có dòng import nào.</li>
</ul>
<p class="nhan">Câu 2 giới thiệu OrderCalculator</p>
<p>"áp dụng phân vùng tương đương và phân tích giá trị biên cho các tham số đầu vào. Ngoài ra, bảo đảm test case phủ mọi nhánh của code để đạt 100% code coverage."</p>`],
      [3, 'OrderCalculator.calculateTotalPrice (lines 1–30) and the sample JUnit class',
        `<p class="y-chinh">🎯 Page 3 = the method under test and a half-written JUnit class that you must complete.</p>
<p class="nhan">What calculateTotalPrice does (lines 3–29)</p>
<ol>
<li>Throw if the array is null or empty.</li>
<li>Sum the prices, throwing if any price ≤ 0.</li>
<li>Discount 20% for VIP, else 5% if the type equals "Regular" ignoring case.</li>
<li>+10% for code "SALE10", +5% for "WELCOME5".</li>
<li><code>finalPrice = totalPrice × (1 − discount)</code>; return 0 if negative.</li>
</ol>
<p class="nhan">The partial test class (lines 35–51)</p>
<ul>
<li><strong><code>testNoItemsInOrder</code></strong> — JUnit 4 style <code>@Test(expected = IllegalArgumentException.class)</code>.</li>
<li><strong><code>testVIPCustomerWithNoDiscountCode</code></strong> — {100, 200}, VIP → 240.0 with delta 0.01.</li>
<li><strong>Then</strong> — "// Add more test case".</li>
</ul>
<p class="nhan">Also required</p>
<p>A <strong>one-line summary per test</strong>: "ID: TC1; Test for ___; Input parameter: ___; Expected result: ___".</p>`,
        `<p class="y-chinh">🎯 Trang 3 = method cần test và một lớp JUnit viết dở mà bạn phải hoàn thiện.</p>
<p class="nhan">calculateTotalPrice làm gì (dòng 3–29)</p>
<ol>
<li>Ném ngoại lệ nếu mảng null hoặc rỗng.</li>
<li>Cộng giá, ném ngoại lệ nếu có giá ≤ 0.</li>
<li>Giảm 20% cho VIP, ngược lại 5% nếu loại khách bằng "Regular" không phân biệt hoa thường.</li>
<li>+10% với mã "SALE10", +5% với "WELCOME5".</li>
<li><code>finalPrice = totalPrice × (1 − discount)</code>; trả 0 nếu âm.</li>
</ol>
<p class="nhan">Lớp test dở dang (dòng 35–51)</p>
<ul>
<li><strong><code>testNoItemsInOrder</code></strong> — kiểu JUnit 4 <code>@Test(expected = IllegalArgumentException.class)</code>.</li>
<li><strong><code>testVIPCustomerWithNoDiscountCode</code></strong> — {100, 200}, VIP → 240.0 với delta 0.01.</li>
<li><strong>Sau đó</strong> — "// Add more test case".</li>
</ul>
<p class="nhan">Còn phải làm</p>
<p><strong>Một dòng tóm tắt cho mỗi test</strong>: "ID: TC1; Test for ___; Input parameter: ___; Expected result: ___".</p>`],
      [4, 'End of the test-code example; Question 3 — use case "Place an Order"',
        `<p class="y-chinh">🎯 Page 4 = a trap at the end of the sample test code, then Question 3 (2 points): the use case "Place an Order".</p>
<div class="pitfall">The example test code uses <code>assertThrows(IllegalArgumentException.class, () -&gt; numberProcessor.processNumbers(-1, 5, true))</code> — a leftover from <em>another</em> paper (there is no numberProcessor here). Copying it would put an irrelevant keyword in your answer.</div>
<p class="nhan">Q3 — the use case</p>
<ul>
<li><strong>System</strong> — an online shopping system; products A $50, B $30, C $20.</li>
<li><strong>Preconditions</strong> — "logged in" and "cart has at least one item".</li>
</ul>
<p class="nhan">Main success scenario — 8 steps</p>
<ol class="hai-cot">
<li>Add items</li>
<li>Optional discount code</li>
<li>System validates it</li>
<li>Checkout</li>
<li>Total with discounts</li>
<li>Payment info</li>
<li>Payment processed</li>
<li>Confirmation</li>
</ol>
<p class="nhan">Alternates and postconditions</p>
<ul>
<li><strong>A1</strong> — empty cart at checkout.</li>
<li><strong>A2</strong> — invalid code: error, continue without discount.</li>
<li><strong>A3</strong> — payment fails: notify, retry.</li>
<li><strong>Postconditions</strong> — confirmation with items and final total "including discounts and taxes"; inventory updated.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang 4 = một cái bẫy ở cuối code test mẫu, rồi Câu 3 (2 điểm): use case "Place an Order".</p>
<div class="pitfall">Code ví dụ dùng <code>assertThrows(IllegalArgumentException.class, () -&gt; numberProcessor.processNumbers(-1, 5, true))</code> — sót lại từ một đề <em>khác</em> (ở đây không có numberProcessor). Chép nguyên nó là đưa một từ khoá lạc đề vào bài.</div>
<p class="nhan">Q3 — use case</p>
<ul>
<li><strong>Hệ thống</strong> — hệ thống mua hàng online; sản phẩm A $50, B $30, C $20.</li>
<li><strong>Tiền điều kiện</strong> — "đã đăng nhập" và "giỏ có ít nhất một món".</li>
</ul>
<p class="nhan">Luồng thành công — 8 bước</p>
<ol class="hai-cot">
<li>Thêm hàng</li>
<li>Mã giảm giá tuỳ chọn</li>
<li>Hệ thống kiểm mã</li>
<li>Checkout</li>
<li>Tổng tiền đã trừ giảm giá</li>
<li>Nhập thanh toán</li>
<li>Xử lý thanh toán</li>
<li>Xác nhận</li>
</ol>
<p class="nhan">Luồng thay thế và hậu điều kiện</p>
<ul>
<li><strong>A1</strong> — giỏ trống khi checkout.</li>
<li><strong>A2</strong> — mã sai: báo lỗi, tiếp tục không giảm giá.</li>
<li><strong>A3</strong> — thanh toán lỗi: thông báo, thử lại.</li>
<li><strong>Hậu điều kiện</strong> — xác nhận đơn gồm danh sách hàng và tổng cuối "đã gồm giảm giá và thuế"; cập nhật tồn kho.</li>
</ul>`],
      [5, 'Discount codes, payment methods, what to deliver, and the example TC001',
        `<p class="y-chinh">🎯 Page 5 gives the data of the use case and exactly what each test case must contain.</p>
<p class="nhan">The data</p>
<ul>
<li><strong>SAVE10</strong> — 10% off.</li>
<li><strong>WELCOME5</strong> — 5% off for new customers.</li>
<li><strong>Payments</strong> — credit/debit card or PayPal.</li>
<li><strong>Failures</strong> — insufficient funds or invalid card details.</li>
</ul>
<p class="nhan">What to deliver</p>
<ul>
<li><strong>Coverage</strong> — normal flow, alternative flows and exception scenarios.</li>
<li><strong>Each case</strong> — ID, description, preconditions, test steps with test data, expected results and a Note NF / AL / EX.</li>
<li><strong>Level of detail</strong> — shown by the example "TC001 Normal Flow – Successful Order with Standard Delivery" (a tea cup for $2, credit card).</li>
</ul>
<div class="pitfall">The use case says <strong>SAVE10</strong>, while the Q2 code says <strong>SALE10</strong> — never mix them.</div>`,
        `<p class="y-chinh">🎯 Trang 5 cho dữ liệu của use case và nói rõ mỗi test case phải có những gì.</p>
<p class="nhan">Dữ liệu</p>
<ul>
<li><strong>SAVE10</strong> — giảm 10%.</li>
<li><strong>WELCOME5</strong> — giảm 5% cho khách mới.</li>
<li><strong>Thanh toán</strong> — thẻ tín dụng/ghi nợ hoặc PayPal.</li>
<li><strong>Lỗi thanh toán</strong> — không đủ tiền hoặc sai thông tin thẻ.</li>
</ul>
<p class="nhan">Cần giao gì</p>
<ul>
<li><strong>Độ phủ</strong> — luồng chính, luồng thay thế và tình huống ngoại lệ.</li>
<li><strong>Mỗi ca</strong> — ID, mô tả, tiền điều kiện, các bước kèm dữ liệu test, kết quả mong đợi và Note NF / AL / EX.</li>
<li><strong>Mức chi tiết</strong> — xem ví dụ "TC001 Normal Flow – Successful Order with Standard Delivery" (một cái cốc trà giá $2, thẻ tín dụng).</li>
</ul>
<div class="pitfall">Use case ghi <strong>SAVE10</strong>, còn code ở Q2 ghi <strong>SALE10</strong> — đừng bao giờ trộn lẫn.</div>`],
      [6, 'Last page — the Note of the example and the assumptions line',
        `<p class="y-chinh">🎯 The last page only closes the example and repeats the invitation to state assumptions — take it literally.</p>
<ul>
<li><strong>"Notes: Normal flow (NF)"</strong> — the end of the example.</li>
<li><strong>The usual line</strong> — "Please feel free to include any assumptions needed for your answers to be clearer and more accurate."</li>
<li><strong>Two gaps that need a written assumption</strong> — the use case mentions taxes but gives no rate, and "new customer" is not defined.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang cuối chỉ khép lại ví dụ và nhắc lời mời nêu giả định — hãy làm đúng như vậy.</p>
<ul>
<li><strong>"Notes: Normal flow (NF)"</strong> — phần cuối của ví dụ.</li>
<li><strong>Dòng quen thuộc</strong> — "Cứ thoải mái nêu giả định cần thiết để câu trả lời rõ và chính xác hơn."</li>
<li><strong>Hai chỗ trống cần giả định viết ra</strong> — use case nhắc tới thuế nhưng không cho thuế suất, và "khách mới" không được định nghĩa.</li>
</ul>`],
    ]),

    /* ── Q1 ── */
    bi(`<h2>✅ Question 1 — defect report for fileProcessor</h2>
<h4>The task</h4>
<p>Report six defects of <code>fileProcessor</code> (code standards, logic, best practices) in the paper's five fields: Defect ID, Defect Name, Line Number, Defect Description, Fixing Solution.</p>
<h3>Step 1 — let javac prove the two compile problems</h3>
<ul>
<li><strong>Without imports</strong> — the class stops with 5 "cannot find symbol" errors (lines 2, 6 twice, 10, 20).</li>
<li><strong>With the imports added</strong> — exactly one error is left: "unreported exception IOException; must be caught or declared to be thrown" for <code>reader.close()</code> at line 23.</li>
</ul>
<h3>Step 2 — follow the runtime chain</h3>
<ol>
<li><code>FilePath</code> is never assigned…</li>
<li>…so <code>processFile()</code> calls <code>openFile(null)</code>;</li>
<li><code>new FileReader(null)</code> throws <strong>NullPointerException</strong> — not IOException;</li>
<li>so the catch at line 10 does not catch it, and the null check at line 29 is never reached.</li>
</ol>
<h4>Result</h4>
<p>The paper promises six defects; nine are listed so that you have spare ones, and the six strongest come first.</p>`,
      `<h2>✅ Câu 1 — báo cáo defect cho fileProcessor</h2>
<h4>Đề yêu cầu</h4>
<p>Báo cáo sáu defect của <code>fileProcessor</code> (chuẩn code, logic, thực hành tốt) theo năm trường của đề: Defect ID, Defect Name, Line Number, Defect Description, Fixing Solution.</p>
<h3>Bước 1 — để javac chứng minh hai lỗi biên dịch</h3>
<ul>
<li><strong>Thiếu import</strong> — class dừng với 5 lỗi "cannot find symbol" (dòng 2, dòng 6 hai lỗi, 10, 20).</li>
<li><strong>Thêm import</strong> — còn đúng một lỗi: "unreported exception IOException; must be caught or declared to be thrown" cho <code>reader.close()</code> ở dòng 23.</li>
</ul>
<h3>Bước 2 — lần theo chuỗi lỗi lúc chạy</h3>
<ol>
<li><code>FilePath</code> không bao giờ được gán…</li>
<li>…nên <code>processFile()</code> gọi <code>openFile(null)</code>;</li>
<li><code>new FileReader(null)</code> ném <strong>NullPointerException</strong> — không phải IOException;</li>
<li>nên catch ở dòng 10 không bắt được, và phép kiểm null ở dòng 29 không bao giờ được chạy tới.</li>
</ol>
<h4>Kết quả</h4>
<p>Đề hứa sáu defect; ở đây liệt kê chín để bạn có dự phòng, sáu cái mạnh nhất đứng đầu.</p>`),
    sheet('Answer (Word document) — defect report · Bài làm mẫu — báo cáo defect', tbl(['Defect ID', 'Defect Name', 'Line Number', 'Defect Description', 'Fixing Solution'], [
      ['DF001', 'Missing Import (compile error)', '2, 6, 10, 20', 'BufferedReader, FileReader and IOException are used without imports, so javac reports "cannot find symbol".', 'Add <code>import java.io.BufferedReader; import java.io.FileReader; import java.io.IOException;</code>'],
      ['DF002', 'Unhandled Checked Exception (compile error)', '23', '<code>reader.close()</code> throws IOException, which the finally block neither catches nor declares (and it throws NullPointerException when reader is null).', 'Use try-with-resources: <code>try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) { … }</code>'],
      ['DF003', 'Wrong Validation Logic', '7', '<code>filePath != null || filePath.isEmpty()</code> prints "File opened successfully" for every non-null path and would throw NPE for null — and it runs after the file is already opened.', 'Check first: <code>if (filePath == null || filePath.isEmpty()) { System.err.println("Invalid file path"); return; }</code> before line 6'],
      ['DF004', 'Wrong Order of Operations', '27–29', '<code>processFile()</code> opens the file before checking <code>FilePath == null</code>; with null, line 6 throws NullPointerException and the check is never reached.', 'Move the null/empty check to the start of <code>processFile()</code>, before <code>openFile()</code>.'],
      ['DF005', 'Naming Convention Error (class)', '1', 'Class name <code>fileProcessor</code> starts with a lower-case letter; Java classes use PascalCase.', 'Rename to <code>FileProcessor</code> (file FileProcessor.java).'],
      ['DF006', 'Naming Convention Error / Uninitialised Field', '3', 'Field <code>FilePath</code> uses PascalCase and is never assigned, so it is always null.', 'Rename to <code>filePath</code> and set it in a constructor: <code>public FileProcessor(String filePath) { this.filePath = filePath; }</code>'],
      ['DF007', 'Swallowed Exception / Null Reader', '10–11, 17', 'When opening fails the error is only printed, <code>reader</code> stays null and <code>readFile()</code> then throws NullPointerException at line 17.', 'Stop when opening fails (return a boolean or rethrow) and check <code>reader != null</code> before reading.'],
      ['DF008', 'Resource Leak', '2, 6', 'The reader is a long-lived field; calling <code>openFile()</code> twice overwrites it without closing the previous stream.', 'Keep the reader local to one method inside try-with-resources.'],
      ['DF009', 'Poor Error Reporting', '11, 21', 'Errors are printed to <code>System.out</code>, mixed with the file content, and no exception reaches the caller.', 'Use <code>System.err</code> or a Logger and let the caller know (return value or exception).'],
    ])),
    code(`
$ javac fileProcessor.java                    # the paper's code, unchanged
fileProcessor.java:2: error: cannot find symbol
fileProcessor.java:6: error: cannot find symbol
fileProcessor.java:6: error: cannot find symbol
fileProcessor.java:10: error: cannot find symbol
fileProcessor.java:20: error: cannot find symbol
5 errors
$ (same file with "import java.io.*;" added as a new first line — so line 23 is reported as 24)
fileProcessor.java:24: error: unreported exception IOException; must be caught or declared to be thrown
1 error
$ new FileReader((String) null)
new FileReader(null) -> NullPointerException (not IOException)

--- corrected version (FileProcessor with a constructor, check first, try-with-resources), real output ---
new FileProcessor(null).processFile()          -> Invalid file path
new FileProcessor("").processFile()            -> Invalid file path
new FileProcessor("missing.txt").processFile() -> Processing file...
                                                  Error reading file: missing.txt (No such file or directory)
new FileProcessor("demo.txt").processFile()    -> Processing file...
                                                  line one
                                                  line two`),

    /* ── Q2 ── */
    bi(`<h2>✅ Question 2 — JUnit tests for calculateTotalPrice</h2>
<h4>The task</h4>
<p>Complete the JUnit class for <code>calculateTotalPrice</code>: EP and BVA for the input parameters, plus all branches for 100% code coverage; one-line summary per test.</p>
<h3>Step 1 — decisions and V(G)</h3>
<ol>
<li><strong>O1</strong> <code>itemPrices == null || itemPrices.length == 0</code> (line 4)</li>
<li><strong>O2</strong> the for-each loop (8)</li>
<li><strong>O3</strong> <code>price &lt;= 0</code> (9)</li>
<li><strong>O4</strong> <code>isVIP</code> (15)</li>
<li><strong>O5</strong> <code>equalsIgnoreCase("Regular")</code> (17)</li>
<li><strong>O6</strong> <code>discountCode != null &amp;&amp; !discountCode.isEmpty()</code> (20)</li>
<li><strong>O7</strong> <code>equals("SALE10")</code> (21)</li>
<li><strong>O8</strong> <code>equals("WELCOME5")</code> (23)</li>
<li><strong>O9</strong> the ternary <code>finalPrice &lt; 0</code> (28)</li>
</ol>
<p>Nine decisions, so <strong>V(G) = 9 + 1 = 10</strong>. Tools that count every <code>&amp;&amp;</code>/<code>||</code> as an extra decision (SonarQube does) report 12.</p>
<h3>Step 2 — the coverage you can actually reach</h3>
<div class="pitfall co-tieu-de"><strong>100% branch coverage is impossible here.</strong> The largest discount is 20% + 10% = 30%, and every price is &gt; 0, so <code>finalPrice = total × (1 − discount) ≥ 0.7 × total &gt; 0</code>: the True outcome of O9 can never happen.</div>
<ul>
<li><strong>Maximum</strong> — <strong>17 of 18 outcomes (94.4%)</strong>. Say so in your answer and report the unreachable branch as dead code.</li>
<li><strong>Measured</strong> — a branch probe on the 13 tests below measured exactly <strong>17/18</strong>, with only "O9 True" missing.</li>
</ul>
<h4>Result — the minimum for those 17 outcomes is 6 tests (also measured 17/18)</h4>
<ol class="hai-cot">
<li>{}</li>
<li>{−1}</li>
<li>{100, 200} VIP SALE10</li>
<li>{200} Regular WELCOME5</li>
<li>{50} Guest SALE20</li>
<li>{100} Guest no code</li>
</ol>
<p>The remaining seven tests are there because the paper also asks for EP and BVA.</p>`,
      `<h2>✅ Câu 2 — test JUnit cho calculateTotalPrice</h2>
<h4>Đề yêu cầu</h4>
<p>Hoàn thiện lớp JUnit cho <code>calculateTotalPrice</code>: EP và BVA cho các tham số đầu vào, cộng mọi nhánh để đạt 100% code coverage; mỗi test một dòng tóm tắt.</p>
<h3>Bước 1 — các quyết định và V(G)</h3>
<ol>
<li><strong>O1</strong> <code>itemPrices == null || itemPrices.length == 0</code> (dòng 4)</li>
<li><strong>O2</strong> vòng for-each (8)</li>
<li><strong>O3</strong> <code>price &lt;= 0</code> (9)</li>
<li><strong>O4</strong> <code>isVIP</code> (15)</li>
<li><strong>O5</strong> <code>equalsIgnoreCase("Regular")</code> (17)</li>
<li><strong>O6</strong> <code>discountCode != null &amp;&amp; !discountCode.isEmpty()</code> (20)</li>
<li><strong>O7</strong> <code>equals("SALE10")</code> (21)</li>
<li><strong>O8</strong> <code>equals("WELCOME5")</code> (23)</li>
<li><strong>O9</strong> toán tử ba ngôi <code>finalPrice &lt; 0</code> (28)</li>
</ol>
<p>Chín quyết định, vậy <strong>V(G) = 9 + 1 = 10</strong>. Công cụ nào đếm mỗi <code>&amp;&amp;</code>/<code>||</code> thành một quyết định riêng (SonarQube làm vậy) sẽ báo 12.</p>
<h3>Bước 2 — độ phủ thực sự đạt được</h3>
<div class="pitfall co-tieu-de"><strong>Ở đây không thể đạt 100% branch coverage.</strong> Mức giảm lớn nhất là 20% + 10% = 30%, và mọi giá đều &gt; 0, nên <code>finalPrice = total × (1 − discount) ≥ 0,7 × total &gt; 0</code>: kết cục True của O9 không bao giờ xảy ra.</div>
<ul>
<li><strong>Tối đa</strong> — <strong>17/18 kết cục (94,4%)</strong>. Hãy nói rõ điều này trong bài và báo nhánh không tới được là dead code.</li>
<li><strong>Đã đo</strong> — bộ đo nhánh chạy trên 13 test dưới đây đo được đúng <strong>17/18</strong>, chỉ thiếu "O9 True".</li>
</ul>
<h4>Kết quả — bộ tối thiểu cho 17 kết cục đó là 6 test (cũng đo được 17/18)</h4>
<ol class="hai-cot">
<li>{}</li>
<li>{−1}</li>
<li>{100, 200} VIP SALE10</li>
<li>{200} Regular WELCOME5</li>
<li>{50} Guest SALE20</li>
<li>{100} Guest không mã</li>
</ol>
<p>Bảy test còn lại có mặt vì đề còn đòi EP và BVA.</p>`),
    bi(`<h3>Step 3 — EP / BVA of the parameters</h3><p>The same table-3.1 format, applied to the method's parameters. Each test below lists the tags it covers; the check under it is computed.</p>`,
      `<h3>Bước 3 — EP / BVA cho các tham số</h3><p>Dùng lại khuôn bảng 3.1 cho các tham số của method. Mỗi test bên dưới ghi các tag nó phủ; phần kiểm tra ngay dưới được tính tự động.</p>`),
    sheet('Answer — partitions and boundaries · Bài làm mẫu — phân vùng và biên', ORD_T31.html),
    sheet('Answer — test cases (itemPrices / customerType / isVIP / discountCode) · Bài làm mẫu — test case', ORD_T32.table),
    ORD_T32.check,
    sheet('Answer — one-line summaries (the format the paper asks for) · Bài làm mẫu — tóm tắt mỗi test một dòng', `<ul>
<li>ID: TC01; Test for no items (empty array); Input parameter: itemPrices = {}, customerType = "VIP", isVIP = false, discountCode = null; Expected result: IllegalArgumentException "No items in the order."</li>
<li>ID: TC02; Test for VIP customer without discount code; Input parameter: {100, 200}, "VIP", true, null; Expected result: 240.0</li>
<li>ID: TC03; Test for null item array; Input parameter: null, "Regular", false, null; Expected result: IllegalArgumentException "No items in the order."</li>
<li>ID: TC04; Test for price = 0 (invalid boundary); Input parameter: {0}, "Regular", false, null; Expected result: IllegalArgumentException "Item price must be greater than zero."</li>
<li>ID: TC05; Test for a negative price after a valid one; Input parameter: {50, -10}, "Regular", false, null; Expected result: IllegalArgumentException "Item price must be greater than zero."</li>
<li>ID: TC06; Test for the smallest valid price, one item, regular customer; Input parameter: {0.01}, "Regular", false, null; Expected result: 0.0095</li>
<li>ID: TC07; Test for "regular" in lower case and an empty code; Input parameter: {100}, "regular", false, ""; Expected result: 95.0</li>
<li>ID: TC08; Test for other customer type with SALE10; Input parameter: {100}, "Guest", false, "SALE10"; Expected result: 90.0</li>
<li>ID: TC09; Test for VIP with SALE10 (maximum discount 30%); Input parameter: {100, 200}, "VIP", true, "SALE10"; Expected result: 210.0</li>
<li>ID: TC10; Test for regular customer with WELCOME5; Input parameter: {200}, "Regular", false, "WELCOME5"; Expected result: 180.0</li>
<li>ID: TC11; Test for an unknown discount code; Input parameter: {50}, "Guest", false, "SALE20"; Expected result: 50.0</li>
<li>ID: TC12; Test that codes are case-sensitive; Input parameter: {100}, "Guest", false, "sale10"; Expected result: 100.0</li>
<li>ID: TC13; Test for null customer type (non-VIP); Input parameter: {100}, null, false, null; Expected result: NullPointerException — reported as a defect</li>
</ul>`),
    sheet('Answer — the same tests in the UTCID grid · Bài làm mẫu — cùng bộ test trên lưới UTCID', utGrid({
      fcode: 'OrderCalculator', fname: 'calculateTotalPrice(double[] itemPrices, String customerType, boolean isVIP, String discountCode)', loc: 30,
      req: 'Total = sum of prices × (1 − discount); VIP 20% else Regular 5%; SALE10 +10%, WELCOME5 +5%; invalid arrays/prices rejected. 17/18 decision outcomes covered (O9 True is unreachable).',
      ids: ['TC01', 'TC02', 'TC03', 'TC04', 'TC05', 'TC06', 'TC07', 'TC08', 'TC09', 'TC10', 'TC11', 'TC12', 'TC13'],
      pre: [['new OrderCalculator() created', 'OOOOOOOOOOOOO']],
      inputs: [
        ['itemPrices', [['{}', 'O............'], ['{100, 200}', '.O......O....'], ['null', '..O..........'], ['{0}', '...O.........'], ['{50, -10}', '....O........'], ['{0.01}', '.....O.......'], ['{100}', '......OO...OO'], ['{200}', '.........O...'], ['{50}', '..........O..']]],
        ['customerType', [['"VIP"', 'OO......O....'], ['"Regular"', '..OOOO...O...'], ['"regular"', '......O......'], ['"Guest"', '.......O..OO.'], ['null', '............O']]],
        ['isVIP', [['true', '.O......O....'], ['false', 'O.OOOOOO.OOOO']]],
        ['discountCode', [['null', 'OOOOOO......O'], ['"" (empty)', '......O......'], ['"SALE10"', '.......OO....'], ['"WELCOME5"', '.........O...'], ['"SALE20"', '..........O..'], ['"sale10"', '...........O.']]],
      ],
      ret: [['240.0', '.O...........'], ['0.0095', '.....O.......'], ['95.0', '......O......'], ['90.0', '.......O.....'], ['210.0', '........O....'], ['180.0', '.........O...'], ['50.0', '..........O..'], ['100.0', '...........O.']],
      exc: [['IllegalArgumentException "No items in the order."', 'O.O..........'], ['IllegalArgumentException "Item price must be greater than zero."', '...OO........'], ['NullPointerException', '............O']],
      type: 'ANABABNNNNAAA', result: 'PPPPPPPPPPPPP', date: '11/09/2026', defects: { 12: 'DF-Q2-01' },
    })),
    code(`
import static org.junit.Assert.*;
import org.junit.Test;

public class OrderCalculatorTest {
    private final OrderCalculator calculator = new OrderCalculator();

    @Test(expected = IllegalArgumentException.class)          // TC01 (given in the paper)
    public void testNoItemsInOrder() {
        calculator.calculateTotalPrice(new double[]{}, "VIP", false, null);
    }
    @Test                                                     // TC02 (given in the paper)
    public void testVIPCustomerWithNoDiscountCode() {
        double total = calculator.calculateTotalPrice(new double[]{100, 200}, "VIP", true, null);
        assertEquals(240.0, total, 0.01);
    }
    @Test
    public void testNullItemArray() {                         // TC03
        IllegalArgumentException e = assertThrows(IllegalArgumentException.class,
            () -> calculator.calculateTotalPrice(null, "Regular", false, null));
        assertEquals("No items in the order.", e.getMessage());
    }
    @Test
    public void testPriceZeroBoundary() {                     // TC04
        IllegalArgumentException e = assertThrows(IllegalArgumentException.class,
            () -> calculator.calculateTotalPrice(new double[]{0}, "Regular", false, null));
        assertEquals("Item price must be greater than zero.", e.getMessage());
    }
    @Test
    public void testNegativePriceAfterValidOne() {            // TC05
        assertThrows(IllegalArgumentException.class,
            () -> calculator.calculateTotalPrice(new double[]{50, -10}, "Regular", false, null));
    }
    @Test
    public void testSmallestValidPriceRegular() {             // TC06
        assertEquals(0.0095, calculator.calculateTotalPrice(new double[]{0.01}, "Regular", false, null), 1e-9);
    }
    @Test
    public void testRegularLowerCaseEmptyCode() {             // TC07
        assertEquals(95.0, calculator.calculateTotalPrice(new double[]{100}, "regular", false, ""), 0.01);
    }
    @Test
    public void testGuestWithSale10() {                       // TC08
        assertEquals(90.0, calculator.calculateTotalPrice(new double[]{100}, "Guest", false, "SALE10"), 0.01);
    }
    @Test
    public void testVipWithSale10() {                         // TC09
        assertEquals(210.0, calculator.calculateTotalPrice(new double[]{100, 200}, "VIP", true, "SALE10"), 0.01);
    }
    @Test
    public void testRegularWithWelcome5() {                   // TC10
        assertEquals(180.0, calculator.calculateTotalPrice(new double[]{200}, "Regular", false, "WELCOME5"), 0.01);
    }
    @Test
    public void testGuestWithUnknownCode() {                  // TC11
        assertEquals(50.0, calculator.calculateTotalPrice(new double[]{50}, "Guest", false, "SALE20"), 0.01);
    }
    @Test
    public void testCodeIsCaseSensitive() {                   // TC12
        assertEquals(100.0, calculator.calculateTotalPrice(new double[]{100}, "Guest", false, "sale10"), 0.01);
    }
    @Test
    public void testNullCustomerTypeNonVip() {                // TC13 — documents a defect
        assertThrows(NullPointerException.class,
            () -> calculator.calculateTotalPrice(new double[]{100}, null, false, null));
    }
}
--- real output (JDK 21, JUnit 4.13.2; each test also printed its result) ---
TC01 empty array -> IllegalArgumentException
TC02 {100,200} VIP, null code -> 240.0
TC03 null array -> No items in the order.
TC04 {0} -> Item price must be greater than zero.
TC05 {50,-10} -> Item price must be greater than zero.
TC06 {0.01} Regular -> 0.0095
TC07 {100} "regular", code "" -> 95.0
TC08 {100} Guest SALE10 -> 90.0
TC09 {100,200} VIP SALE10 -> 210.0
TC10 {200} Regular WELCOME5 -> 180.0
TC11 {50} Guest SALE20 -> 50.0
TC12 {100} Guest sale10 -> 100.0
TC13 {100} type=null, not VIP -> NullPointerException (DEFECT)
OK (13 tests)
--- branch probe over the same 13 inputs ---
O1..O8 outcomes hit: [F, T] each      O9 finalPrice<0 outcomes hit: [F]
decision outcomes covered: 17/18`),
    bi(`<p><strong>JUnit 4 or 5?</strong> The paper's sample mixes both styles: <code>@Test(expected = …)</code> is JUnit 4, while <code>assertThrows</code> exists in JUnit 5 and in JUnit 4.13+. The class above compiles and runs with JUnit 4.13.2. For JUnit 5, change the imports to <code>org.junit.jupiter.api.Test</code> and <code>static org.junit.jupiter.api.Assertions.*</code> and replace <code>@Test(expected = …)</code> with <code>assertThrows</code>.</p>`,
      `<p><strong>JUnit 4 hay 5?</strong> Mẫu trong đề trộn cả hai: <code>@Test(expected = …)</code> là JUnit 4, còn <code>assertThrows</code> có trong JUnit 5 và JUnit 4.13 trở lên. Lớp test ở trên biên dịch và chạy được với JUnit 4.13.2. Muốn dùng JUnit 5 thì đổi import thành <code>org.junit.jupiter.api.Test</code> và <code>static org.junit.jupiter.api.Assertions.*</code>, rồi thay <code>@Test(expected = …)</code> bằng <code>assertThrows</code>.</p>`),

    /* ── Q3 ── */
    bi(`<h2>✅ Question 3 — use-case test cases for "Place an Order"</h2>
<h4>The task</h4>
<p>Test cases for the use case "Place an Order" covering the normal flow, the alternative flows and the exception scenarios, each with a Note NF / AL / EX.</p>
<h3>Step 1 — the rule of use-case testing</h3>
<p><strong>Use-case testing</strong> (lesson 4.2.5) derives at least one test from the main success scenario and one from every alternative/exception flow.</p>
<h4>Assumptions</h4>
<ul>
<li><strong>Tax</strong> — totals are shown before tax because no tax rate is given.</li>
<li><strong>New customer</strong> — one with no previous order.</li>
<li><strong>Payment sandbox</strong> — the gateway offers a card with $0 balance and accepts 4111 1111 1111 1111 as a valid test card.</li>
</ul>
<h3>Step 2 — map the paper's alternates to notes</h3>
<ul>
<li><strong>A2</strong> (invalid code, the order still completes) → <strong>AL</strong>.</li>
<li><strong>A1</strong> (empty cart) and <strong>A3</strong> (payment failure) → <strong>EX</strong>.</li>
<li><strong>A successful retry after A3</strong> → <strong>AL</strong>.</li>
</ul>
<h4>Result</h4>
<p>The partition table and the tag check make sure every rule of the use case is hit — here the 10 cases reach 100%.</p>`,
      `<h2>✅ Câu 3 — test case theo use case "Place an Order"</h2>
<h4>Đề yêu cầu</h4>
<p>Test case cho use case "Place an Order" phủ luồng chính, các luồng thay thế và tình huống ngoại lệ, mỗi ca có Note NF / AL / EX.</p>
<h3>Bước 1 — quy tắc của kiểm thử theo use case</h3>
<p><strong>Kiểm thử theo use case</strong> (bài 4.2.5) rút ít nhất một test từ luồng thành công chính và một test từ mỗi luồng thay thế/ngoại lệ.</p>
<h4>Giả định</h4>
<ul>
<li><strong>Thuế</strong> — tổng tiền hiển thị trước thuế vì đề không cho thuế suất.</li>
<li><strong>Khách mới</strong> — khách chưa có đơn nào.</li>
<li><strong>Sandbox thanh toán</strong> — cổng thanh toán có thẻ số dư $0 và nhận 4111 1111 1111 1111 là thẻ test hợp lệ.</li>
</ul>
<h3>Bước 2 — gán luồng thay thế của đề vào Note</h3>
<ul>
<li><strong>A2</strong> (mã sai, đơn vẫn hoàn tất) → <strong>AL</strong>.</li>
<li><strong>A1</strong> (giỏ trống) và <strong>A3</strong> (thanh toán lỗi) → <strong>EX</strong>.</li>
<li><strong>Thử lại thành công sau A3</strong> → <strong>AL</strong>.</li>
</ul>
<h4>Kết quả</h4>
<p>Bảng phân vùng và phần kiểm tra tag bảo đảm mọi luật của use case đều được chạm — ở đây 10 ca đạt 100%.</p>`),
    sheet('Answer — conditions and tags · Bài làm mẫu — điều kiện và tag', SHOP_T31.html),
    sheet('Answer — test case design · Bài làm mẫu — thiết kế test case', SHOP_T32.table),
    SHOP_T32.check,
    sheet('Answer — test cases in the paper\'s format (ID, description, preconditions, steps with data, expected, NF/AL/EX) · Bài làm mẫu theo đúng khuôn của đề', SHOP_T33),
    bi(`<h3>Ví dụ có lời giải · Worked example — the discount arithmetic, checked</h3>
<ul>
<li><strong>Q2 · TC09</strong> {100, 200}, VIP + SALE10 → discount 0.20 + 0.10 = 0.30 → 300 × 0.70 = <strong>210.0</strong></li>
<li><strong>Q2 · TC10</strong> {200}, Regular + WELCOME5 → 0.05 + 0.05 = 0.10 → <strong>180.0</strong></li>
<li><strong>Q2 · TC06</strong> {0.01}, Regular → 0.01 × 0.95 = <strong>0.0095</strong></li>
<li><strong>Q3</strong> — A + B + C = $100, SAVE10 → <strong>$90.00</strong>; C = $20, WELCOME5 → <strong>$19.00</strong></li>
</ul>
<p>All the Q2 values are the real outputs of the run above.</p>
<div class="pitfall co-tieu-de"><strong>SALE10 is not SAVE10.</strong> The code in Q2 checks <code>"SALE10"</code>; the use case in Q3 says <code>SAVE10</code>. Using SAVE10 in a Q2 test would take the "unknown code" branch (+0%) and your expected value would be wrong; using SALE10 in Q3 is a keyword from the wrong question. Copy names character by character from the question you are answering.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Parameterised tests.</strong>
<p>Thirteen near-identical methods are what the paper asks for, but in real projects the discount rules would be one JUnit 5 <code>@ParameterizedTest</code> with a <code>@CsvSource</code> table (items; type; vip; code; expected), one row per partition.</p>
<p>Adding a boundary becomes adding a line, and the table doubles as documentation of the business rule.</p>
<p><em>Outside the syllabus because CTFL is tool-neutral; see JUnit in Action ch.2 for the syntax.</em></p></div>`,
      `<h3>Ví dụ có lời giải · Kiểm lại phép tính giảm giá</h3>
<ul>
<li><strong>Q2 · TC09</strong> {100, 200}, VIP + SALE10 → giảm 0,20 + 0,10 = 0,30 → 300 × 0,70 = <strong>210.0</strong></li>
<li><strong>Q2 · TC10</strong> {200}, Regular + WELCOME5 → 0,05 + 0,05 = 0,10 → <strong>180.0</strong></li>
<li><strong>Q2 · TC06</strong> {0.01}, Regular → 0,01 × 0,95 = <strong>0.0095</strong></li>
<li><strong>Q3</strong> — A + B + C = $100, SAVE10 → <strong>$90.00</strong>; C = $20, WELCOME5 → <strong>$19.00</strong></li>
</ul>
<p>Mọi giá trị của Q2 đều là output thật của lần chạy ở trên.</p>
<div class="pitfall co-tieu-de"><strong>SALE10 không phải SAVE10.</strong> Code ở Q2 kiểm <code>"SALE10"</code>; use case ở Q3 ghi <code>SAVE10</code>. Dùng SAVE10 trong test của Q2 sẽ rơi vào nhánh "mã lạ" (+0%) và giá trị mong đợi của bạn sai; dùng SALE10 ở Q3 là mang từ khoá của câu khác sang. Hãy chép tên từng ký tự từ đúng câu hỏi bạn đang trả lời.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Test tham số hoá.</strong>
<p>Đề đòi mười ba method gần giống nhau, nhưng trong dự án thật các luật giảm giá sẽ là một <code>@ParameterizedTest</code> của JUnit 5 với bảng <code>@CsvSource</code> (items; type; vip; code; expected), mỗi phân vùng một dòng.</p>
<p>Thêm một giá trị biên chỉ là thêm một dòng, và bảng đó đồng thời là tài liệu của luật nghiệp vụ.</p>
<p><em>Ngoài giáo trình vì CTFL không gắn với công cụ; xem cú pháp ở JUnit in Action chương 2.</em></p></div>`),
    books([
      ['fst4', 'Ch.5 §6 "Defect management" — defect report contents, book p.190–195 (PDF p.204–209); Ch.4 §2.5 use-case testing p.130–131, Fig. 4.3; Ch.4 §3.2 decision coverage p.136–139', 'Chương 5 §6 "Defect management" — nội dung báo cáo defect, trang sách 190–195 (PDF 204–209); Chương 4 §2.5 kiểm thử theo use case tr.130–131, Hình 4.3; Chương 4 §3.2 decision coverage tr.136–139'],
      ['sp5', '§5.1.7 use-case-based testing (PDF p.208); §5.2.2 decision testing (PDF p.218)', '§5.1.7 kiểm thử dựa trên use case (PDF tr.208); §5.2.2 decision testing (PDF tr.218)'],
      ['junit', 'Ch.2 "Exploring core JUnit" incl. assertThrows and parameterised tests, PDF p.18–48; Ch.4 "Migrating from JUnit 4 to JUnit 5" PDF p.68', 'Chương 2 "Exploring core JUnit" gồm assertThrows và test tham số hoá, PDF tr.18–48; Chương 4 "Migrating from JUnit 4 to JUnit 5" PDF tr.68'],
    ]),
  ].join('\n'),
};

/* ═════════════════════════ PE-4 SPRING25 (PE4/SP25.jpg) ═════════════════════════ */
const SP25_Q2 = `
public class TravelBooking {
    String BookingId;
    double totalPrice;
    int numberOfTravelers;

    TravelBooking(String id, double price, int travelers) {
        BookingId = id;
        totalPrice = price;
        numberOfTravelers = travelers;
    }

    boolean ConfirmBooking(String paymentMethod) {
        if (paymentMethod == "CreditCard") {
            return processPayment(totalPrice);
        } else if (paymentMethod.equals("DigitalWallet")) {
            return processPayment(totalPrice * 0.98); // 2% discount
        }
        return false;
    }

    private boolean processPayment(double amount) {
        // Simulate payment processing
        return amount > 0;
    }

    String getBookingDetails() {
        return "Booking ID: " + BookingId + ", Total: " + totalPrice;
    }
}`;
const RW_T31 = t31([
  { c: 'bookingAmount', vp: [['≥ 0', 'VP1']], ip: [['&lt; 0 (returns −1)', 'IP1']],
    vb: [['0', 'VB1'], ['9.99 VIP → 0 points (int truncation)', 'VB2'], ['10 VIP → 1 point', 'VB3'], ['19.99 Regular → 0 points', 'VB4'], ['20 Regular → 1 point', 'VB5']], ib: [['−0.01', 'IB1']] },
  { c: 'customerType', vp: [['"VIP" (10%)', 'VP2'], ['"Regular" (5%)', 'VP3'], ['any other text, e.g. "Guest" (0)', 'VP4'], ['wrong case "vip" → treated as other (0)', 'VP5']], ip: [['null', 'IP2']] },
]);
const RW_T32 = t32([
  ['TC01', 'bookingAmount = −0.01, customerType = "VIP"', '−1', 'IP1, IB1'],
  ['TC02', '1000, "VIP"', '100', 'VP1, VP2'],
  ['TC03', '1000, "Regular"', '50', 'VP1, VP3'],
  ['TC04', '1000, "Guest"', '0', 'VP1, VP4'],
  ['TC05', '0, "VIP"', '0', 'VB1, VP2'],
  ['TC06', '9.99, "VIP"', '0 ((int) 0.999)', 'VB2, VP2'],
  ['TC07', '10, "VIP"', '1', 'VB3, VP2'],
  ['TC08', '19.99, "Regular"', '0 ((int) 0.9995)', 'VB4, VP3'],
  ['TC09', '20, "Regular"', '1', 'VB5, VP3'],
  ['TC10', '1000, "vip"', '0 (equals is case-sensitive)', 'VP5'],
  ['TC11', '1000, null', 'NullPointerException — DEFECT (should be 0 or a clear error)', 'IP2'],
  ['TC12', '−5, null', '−1 (the amount check runs first, null is never touched)', 'IP1'],
], RW_T31.tags);

const L4 = {
  title: 'PE-4 — SPRING25 paper (TravelEase): strategy · review · unit tests · system tests|||PE-4 — Đề SPRING25 (TravelEase): chiến lược · review · unit test · system test',
  slug: 'swt301-pe-sp25',
  type: 'DOCUMENT',
  description: 'Đề SPRING25 (5 trang ảnh, 80 phút, 4 câu 3+3+2+2): chọn chiến lược kiểm thử có lập luận, 10 lỗi TravelBooking có bằng chứng chạy thật, calculateRewardPoints V(G)=4 + EP/BVA 12 test (đã chạy JUnit), 12 test case hệ thống cho 2 quy trình.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-4 · PE SP25 (PE4/SP25.jpg) pages 1–5</span>
<h2>SPRING25 — one project context, four questions</h2>
<p class="lead">The newest paper in the folder wraps everything in one scenario: <strong>Liger Travel</strong> builds <strong>TravelEase</strong>, an online travel-booking site. It adds a question on <strong>test strategy</strong> (Chapter 5) to the familiar review, unit-test and test-case questions, and gives only 80 minutes for four questions. In the Exam room it is <strong>SWT301-PE7</strong> ("Practical Exam Đề 7 (PE - SP 2025)").</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-5.2.2</strong> — test approaches and strategies (K2).</li>
<li><strong>LO-3.2.4</strong> — apply a review technique (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement and decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP and BVA (K3).</li>
<li><strong>LO-4.2.5</strong> — use-case / process-based testing (K2).</li>
</ul></div>
<table>
<thead><tr><th>Q</th><th>Points</th><th>Task</th><th>Budget</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Choose and justify test strategies for TravelEase, and say how to implement them</td><td>20 min</td></tr>
<tr><td>2</td><td>3</td><td>6 errors in <code>TravelBooking</code> (conventions, standards, logic) with fixes</td><td>20 min</td></tr>
<tr><td>3</td><td>2</td><td>Unit tests for <code>calculateRewardPoints</code>: 100% statement, branch, EP and BVA coverage</td><td>15 min</td></tr>
<tr><td>4</td><td>2</td><td>≥ 5 system test cases each for "Booking a Travel Package" and "Searching for Available Hotels"</td><td>20 min</td></tr>
</tbody>
</table>`,
      `<span class="eyebrow">Thi thực hành · Bài PE-4 · PE SP25 (PE4/SP25.jpg) trang 1–5</span>
<h2>SPRING25 — một bối cảnh dự án, bốn câu hỏi</h2>
<p class="lead">Đề mới nhất trong thư mục gói mọi thứ vào một kịch bản: <strong>Liger Travel</strong> xây dựng <strong>TravelEase</strong>, một website đặt tour du lịch trực tuyến. Ngoài các câu quen thuộc về review, unit test và test case, đề thêm một câu về <strong>chiến lược kiểm thử</strong> (Chương 5), và chỉ cho 80 phút cho bốn câu. Trong Phòng thi nó là <strong>SWT301-PE7</strong> ("Đề thi thực hành số 7 (PE - SP 2025)").</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-5.2.2</strong> — cách tiếp cận và chiến lược kiểm thử (K2).</li>
<li><strong>LO-3.2.4</strong> — áp dụng kỹ thuật review (K3).</li>
<li><strong>LO-4.3.1 / 4.3.2</strong> — statement và decision coverage (K2).</li>
<li><strong>LO-4.2.1 / 4.2.2</strong> — EP và BVA (K3).</li>
<li><strong>LO-4.2.5</strong> — kiểm thử theo use case / quy trình (K2).</li>
</ul></div>
<table>
<thead><tr><th>Câu</th><th>Điểm</th><th>Yêu cầu</th><th>Thời gian</th></tr></thead>
<tbody>
<tr><td>1</td><td>3</td><td>Chọn và biện luận chiến lược kiểm thử cho TravelEase, nêu cách triển khai</td><td>20 phút</td></tr>
<tr><td>2</td><td>3</td><td>6 lỗi trong <code>TravelBooking</code> (quy ước, chuẩn, logic) kèm cách sửa</td><td>20 phút</td></tr>
<tr><td>3</td><td>2</td><td>Unit test cho <code>calculateRewardPoints</code>: phủ 100% statement, branch, EP và BVA</td><td>15 phút</td></tr>
<tr><td>4</td><td>2</td><td>≥ 5 test case hệ thống cho mỗi quy trình "Booking a Travel Package" và "Searching for Available Hotels"</td><td>20 phút</td></tr>
</tbody>
</table>`),
    bi(`<h2>📄 The paper page by page</h2>`, `<h2>📄 Đề thi từng trang</h2>`),
    pages('pe-sp25', [
      [1, 'Title, instructions and the project context',
        `<p class="y-chinh">🎯 Page 1 sets the scene — every word of the TravelEase context is an input to Q1.</p>
<p>"SWT301 SPRING25 - The final PE · Online Travel Booking Website" — 80 minutes, 4 questions, 10 points, one Word document.</p>
<p class="nhan">Project context</p>
<ul>
<li><strong>Product</strong> — Liger Travel's new site TravelEase lets users search destinations, book flights, hotels and tour packages, and pay by credit card, digital wallet or bank transfer.</li>
<li><strong>Agencies</strong> — travel agencies get a dashboard for bookings, promotions and inquiries.</li>
<li><strong>Project</strong> — new development, 12 months, 10 developers, 5 testers including 1 test lead.</li>
</ul>
<p class="nhan">Constraints</p>
<ol>
<li>Handle high traffic (holiday seasons).</li>
<li>Search and recommendation accurate and fast.</li>
<li>Payments secure and error-free.</li>
<li>Responsive on multiple devices.</li>
</ol>
<p><strong>Why it matters for Q1:</strong> team size and duration shape the plan; the four constraints are the top product risks.</p>`,
        `<p class="y-chinh">🎯 Trang 1 dựng bối cảnh — từng chữ về TravelEase đều là đầu vào cho Q1.</p>
<p>"SWT301 SPRING25 - The final PE · Online Travel Booking Website" — 80 phút, 4 câu, 10 điểm, nộp một file Word.</p>
<p class="nhan">Bối cảnh dự án</p>
<ul>
<li><strong>Sản phẩm</strong> — website mới TravelEase của Liger Travel cho người dùng tìm điểm đến, đặt vé máy bay, khách sạn và tour trọn gói, thanh toán bằng thẻ, ví điện tử hoặc chuyển khoản.</li>
<li><strong>Đại lý</strong> — các đại lý có dashboard quản lý booking, khuyến mãi và yêu cầu của khách.</li>
<li><strong>Dự án</strong> — phát triển mới, 12 tháng, 10 lập trình viên, 5 tester gồm 1 test lead.</li>
</ul>
<p class="nhan">Ràng buộc</p>
<ol>
<li>Chịu tải cao (mùa lễ).</li>
<li>Tìm kiếm và gợi ý chính xác, nhanh.</li>
<li>Thanh toán an toàn và không lỗi.</li>
<li>Giao diện responsive trên nhiều thiết bị.</li>
</ol>
<p><strong>Vì sao quan trọng với Q1:</strong> quy mô đội và thời gian quyết định kế hoạch; bốn ràng buộc chính là bốn rủi ro sản phẩm lớn nhất.</p>`],
      [2, 'Question 1 — Selecting Test Strategy',
        `<p class="y-chinh">🎯 Q1 asks you to choose and justify test strategies for <em>this</em> project — not to recite definitions.</p>
<p class="nhan">Choose one or more of the seven CTFL strategies (lesson 5.2)</p>
<ol class="hai-cot">
<li>Analytical</li>
<li>Model-based</li>
<li>Methodical</li>
<li>Process-/Standard-compliant</li>
<li>Directed (consultative)</li>
<li>Regression-averse</li>
<li>Reactive (dynamic)</li>
</ol>
<p class="nhan">The answer must</p>
<ol>
<li>identify the most suitable strategy;</li>
<li>explain why;</li>
<li>propose how to implement it in <em>this</em> project.</li>
</ol>
<div class="pitfall">A list of definitions scores little; the marks are in linking each choice to a constraint of page 1.</div>`,
        `<p class="y-chinh">🎯 Q1 yêu cầu chọn và biện luận chiến lược kiểm thử cho <em>chính</em> dự án này — không phải chép định nghĩa.</p>
<p class="nhan">Chọn một hoặc nhiều trong bảy chiến lược CTFL (bài 5.2)</p>
<ol class="hai-cot">
<li>Analytical</li>
<li>Model-based</li>
<li>Methodical</li>
<li>Process-/Standard-compliant</li>
<li>Directed (consultative)</li>
<li>Regression-averse</li>
<li>Reactive (dynamic)</li>
</ol>
<p class="nhan">Bài làm phải</p>
<ol>
<li>chỉ ra chiến lược phù hợp nhất;</li>
<li>giải thích vì sao;</li>
<li>đề xuất cách triển khai trong <em>chính</em> dự án này.</li>
</ol>
<div class="pitfall">Liệt kê định nghĩa được rất ít điểm; điểm nằm ở việc nối từng lựa chọn với một ràng buộc ở trang 1.</div>`],
      [3, 'Question 2 — Code Review and Bug Identification: TravelBooking',
        `<p class="y-chinh">🎯 Q2 = review a 29-line class printed <strong>without line numbers</strong> — so you number the lines yourself.</p>
<p class="nhan">What the class contains</p>
<ul>
<li><strong>Fields</strong> — <code>String BookingId</code>, <code>double totalPrice</code>, <code>int numberOfTravelers</code>; plus a constructor.</li>
<li><strong><code>boolean ConfirmBooking(String paymentMethod)</code></strong> — compares <code>paymentMethod == "CreditCard"</code>, then <code>paymentMethod.equals("DigitalWallet")</code> with a 2% discount (<code>totalPrice * 0.98</code>), else <code>false</code>.</li>
<li><strong><code>private boolean processPayment(double amount)</code></strong> — returns <code>amount &gt; 0</code>.</li>
<li><strong><code>getBookingDetails()</code></strong></li>
</ul>
<p class="nhan">The task</p>
<ul>
<li><strong>Find 6 errors</strong> — conventions, standards or logic; explain each and suggest a fix.</li>
<li><strong>Wording</strong> — the paper calls it "a Java method" though it is a class.</li>
<li><strong>Line numbers</strong> — number the lines yourself and state that line 1 is <code>public class TravelBooking {</code>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Q2 = review một class 29 dòng in <strong>không có số dòng</strong> — nên bạn phải tự đánh số.</p>
<p class="nhan">Class gồm những gì</p>
<ul>
<li><strong>Trường</strong> — <code>String BookingId</code>, <code>double totalPrice</code>, <code>int numberOfTravelers</code>; cộng một constructor.</li>
<li><strong><code>boolean ConfirmBooking(String paymentMethod)</code></strong> — so sánh <code>paymentMethod == "CreditCard"</code>, rồi <code>paymentMethod.equals("DigitalWallet")</code> với giảm 2% (<code>totalPrice * 0.98</code>), còn lại trả <code>false</code>.</li>
<li><strong><code>private boolean processPayment(double amount)</code></strong> — trả <code>amount &gt; 0</code>.</li>
<li><strong><code>getBookingDetails()</code></strong></li>
</ul>
<p class="nhan">Đề yêu cầu</p>
<ul>
<li><strong>Tìm 6 lỗi</strong> — quy ước, chuẩn hoặc logic; giải thích và đề xuất cách sửa.</li>
<li><strong>Câu chữ</strong> — đề gọi đây là "một method Java" dù thực ra là cả class.</li>
<li><strong>Số dòng</strong> — tự đánh số và ghi rõ dòng 1 là <code>public class TravelBooking {</code>.</li>
</ul>`],
      [4, 'Question 3 — calculateRewardPoints; Question 4 — Process 1 steps 1–6',
        `<p class="y-chinh">🎯 Page 4 = Q3, a four-branch reward method to unit-test, then the start of Q4 (system test cases for two processes).</p>
<p class="nhan">Q3 — int calculateRewardPoints(double bookingAmount, String customerType)</p>
<ul>
<li><strong>amount &lt; 0</strong> → −1</li>
<li><strong>"VIP"</strong> → <code>(int)(bookingAmount * 0.1)</code></li>
<li><strong>"Regular"</strong> → <code>(int)(bookingAmount * 0.05)</code></li>
<li><strong>anything else</strong> → 0</li>
</ul>
<p><strong>Required:</strong> 100% statement, 100% branch, 100% EP and 100% BVA coverage; list the cases with inputs and expected outputs and explain the coverage.</p>
<p class="nhan">Q4 — Process 1 "Booking a Travel Package", steps 1–6</p>
<ol>
<li>Log in.</li>
<li>Search a destination.</li>
<li>Select a package (flight + hotel + activities).</li>
<li>Review details and price.</li>
<li>Enter traveller information.</li>
<li>Select a payment method and pay …</li>
</ol>`,
        `<p class="y-chinh">🎯 Trang 4 = Q3, một method tính điểm thưởng bốn nhánh cần unit test, rồi phần đầu Q4 (test case hệ thống cho hai quy trình).</p>
<p class="nhan">Q3 — int calculateRewardPoints(double bookingAmount, String customerType)</p>
<ul>
<li><strong>amount &lt; 0</strong> → −1</li>
<li><strong>"VIP"</strong> → <code>(int)(bookingAmount * 0.1)</code></li>
<li><strong>"Regular"</strong> → <code>(int)(bookingAmount * 0.05)</code></li>
<li><strong>còn lại</strong> → 0</li>
</ul>
<p><strong>Yêu cầu:</strong> phủ 100% statement, 100% branch, 100% EP và 100% BVA; liệt kê các ca với đầu vào và đầu ra mong đợi rồi giải thích độ phủ.</p>
<p class="nhan">Q4 — Quy trình 1 "Booking a Travel Package", bước 1–6</p>
<ol>
<li>Đăng nhập.</li>
<li>Tìm điểm đến.</li>
<li>Chọn tour (vé máy bay + khách sạn + hoạt động).</li>
<li>Xem chi tiết và giá.</li>
<li>Nhập thông tin hành khách.</li>
<li>Chọn phương thức và thanh toán …</li>
</ol>`],
      [5, 'Question 4 — Process 1 steps 7–8, Process 2, answer requirements',
        `<p class="y-chinh">🎯 Page 5 finishes Process 1, gives Process 2, and fixes the format of the Q4 answer.</p>
<p class="nhan">Process 1 — the last two steps</p>
<ul>
<li>"System confirms the booking and sends a confirmation email"</li>
<li>"User receives an electronic itinerary"</li>
</ul>
<p class="nhan">Process 2 "Searching for Available Hotels"</p>
<ol class="hai-cot">
<li>Visit the site</li>
<li>Enter destination and travel dates</li>
<li>List of available hotels</li>
<li>Apply filters (price range, rating, amenities)</li>
<li>Results update</li>
<li>Select a hotel</li>
<li>Check availability for the dates</li>
<li>Room availability and booking options</li>
</ol>
<p class="nhan">Requirements</p>
<ul>
<li><strong>Quantity</strong> — at least 5 test cases per process, covering normal, alternative and exception flows.</li>
<li><strong>Format</strong> — Test Case ID · Test Scenario · Preconditions (if applicable) · Test Steps · Expected Result.</li>
<li><strong>Assumptions</strong> — the usual invitation to state them.</li>
</ul>`,
        `<p class="y-chinh">🎯 Trang 5 khép lại Quy trình 1, cho Quy trình 2, và quy định khuôn trả lời của Q4.</p>
<p class="nhan">Quy trình 1 — hai bước cuối</p>
<ul>
<li>"Hệ thống xác nhận booking và gửi email xác nhận"</li>
<li>"Người dùng nhận lịch trình điện tử"</li>
</ul>
<p class="nhan">Quy trình 2 "Searching for Available Hotels"</p>
<ol class="hai-cot">
<li>Vào website</li>
<li>Nhập điểm đến và ngày đi</li>
<li>Danh sách khách sạn còn phòng</li>
<li>Áp bộ lọc (khoảng giá, hạng sao, tiện nghi)</li>
<li>Kết quả cập nhật</li>
<li>Chọn một khách sạn</li>
<li>Kiểm tra phòng trống theo ngày</li>
<li>Hiển thị phòng trống và lựa chọn đặt</li>
</ol>
<p class="nhan">Yêu cầu</p>
<ul>
<li><strong>Số lượng</strong> — ít nhất 5 test case cho mỗi quy trình, phủ luồng chính, luồng thay thế và ngoại lệ.</li>
<li><strong>Khuôn</strong> — Test Case ID · Test Scenario · Preconditions (nếu có) · Test Steps · Expected Result.</li>
<li><strong>Giả định</strong> — kèm lời mời quen thuộc: cứ nêu giả định.</li>
</ul>`],
    ]),

    /* ── Q1 ── */
    bi(`<h2>✅ Question 1 — selecting the test strategy</h2>
<h4>The task</h4>
<p>Identify the most suitable test strategy (one or more) for TravelEase, explain why, and propose how to implement it in this project.</p>
<h3>Step 1 — start from the risks</h3>
<p>The syllabus says real strategies are usually <strong>blends</strong>, with one dominant approach. Each constraint on page 1 is a product risk (lesson 5.5), and a risk list naturally leads to an <strong>analytical, risk-based</strong> strategy as the backbone.</p>
<h3>Step 2 — add one supporting strategy per constraint</h3>
<p>For what risk analysis alone does not cover:</p>
<ul>
<li><strong>Peak traffic</strong> → a load <em>model</em>.</li>
<li><strong>Payments</strong> → <em>standards</em>.</li>
<li><strong>A 12-month project with frequent releases</strong> → <em>regression</em> automation.</li>
<li><strong>The recommendation feature</strong>, whose "accuracy" is hard to specify upfront → <em>reactive</em> exploratory sessions.</li>
</ul>`,
      `<h2>✅ Câu 1 — chọn chiến lược kiểm thử</h2>
<h4>Đề yêu cầu</h4>
<p>Chỉ ra chiến lược kiểm thử phù hợp nhất (một hoặc nhiều) cho TravelEase, giải thích vì sao, và đề xuất cách triển khai trong dự án này.</p>
<h3>Bước 1 — bắt đầu từ rủi ro</h3>
<p>Syllabus nói chiến lược thực tế thường là <strong>sự pha trộn</strong>, trong đó có một cách tiếp cận chủ đạo. Mỗi ràng buộc ở trang 1 là một rủi ro sản phẩm (bài 5.5), và danh sách rủi ro dẫn tự nhiên tới chiến lược <strong>analytical, dựa trên rủi ro</strong> làm xương sống.</p>
<h3>Bước 2 — thêm cho mỗi ràng buộc một chiến lược hỗ trợ</h3>
<p>Cho những gì phân tích rủi ro không tự lo được:</p>
<ul>
<li><strong>Lưu lượng đỉnh</strong> → <em>mô hình</em> tải.</li>
<li><strong>Thanh toán</strong> → <em>tiêu chuẩn</em>.</li>
<li><strong>Dự án 12 tháng phát hành liên tục</strong> → tự động hoá <em>hồi quy</em>.</li>
<li><strong>Tính năng gợi ý</strong>, vốn khó đặc tả "độ chính xác" từ đầu → các buổi khám phá <em>reactive</em>.</li>
</ul>`),
    sheet('Answer (Word document) — Q1 · Bài làm mẫu — Câu 1', `<p><strong>Most suitable strategy: Analytical (risk-based testing)</strong>, supported by Model-based, Process-/Standard-compliant, Regression-averse and Reactive testing.</p>
${tbl(['Strategy', 'Why it fits TravelEase', 'How we implement it'], [
  ['<strong>Analytical — risk-based (primary)</strong>', 'The four constraints are the main product risks: payment errors/security, performance at holiday peaks, wrong or slow search results, broken layouts on mobile. With 5 testers for 10 developers we cannot test everything equally, so effort must follow risk.', 'Risk workshop in month 1 with the product owner, agencies and developers; score each feature likelihood × impact; payment, booking and search = high, agency dashboard = medium. High-risk items get early, deep testing (EP/BVA, decision tables, state transitions for booking status), medium items fewer cases. Re-score every sprint; report residual risk in each test report.'],
  ['Model-based (performance)', '"Handle high traffic" needs a model of real usage — how many users search, book and pay per minute at peak.', 'Build an operational profile (e.g. 70% search, 20% view details, 10% book) and turn it into load, stress and spike tests with JMeter or k6 at 2–3× the expected holiday peak; response-time targets for search (e.g. p95 &lt; 2 s).'],
  ['Process-/Standard-compliant (payments)', 'Payments must be secure and error-free; card payments fall under PCI DSS, and web security has the OWASP Top 10.', 'PCI DSS and OWASP-based checklists, a security scan (OWASP ZAP) each release, penetration test before go-live, test cards and sandbox gateways for every method (card, wallet, bank transfer).'],
  ['Regression-averse', '12 months of incremental releases: every change can break booking or payment.', 'Automate the high-risk flows (search → book → pay) with Selenium/Playwright and API tests; run them in CI on every build; nightly full regression across the device matrix.'],
  ['Reactive (exploratory)', 'Recommendation "accuracy" and cross-device usability are hard to specify completely.', 'Time-boxed exploratory sessions with charters each sprint (e.g. "explore recommendations for families during Tết"), plus a device/browser matrix (methodical checklist) on real phones and BrowserStack.'],
])}
<p><strong>Team and plan:</strong> the test lead owns the risk register, the test plan and reporting; 2 testers on booking/payment and search (functional + exploratory), 1 on performance and security, 1 on automation and the device matrix. Entry criterion for system testing: build deployed and smoke tests pass; exit criteria: no open critical/high defects in payment or booking, all high-risk tests passed, performance targets met at peak load.</p>`),

    /* ── Q2 ── */
    bi(`<h2>✅ Question 2 — code review of TravelBooking</h2>
<h4>The task</h4>
<p>Identify 6 errors in <code>TravelBooking</code> (conventions, standards or logic), explain each and suggest a fix.</p>
<h3>Step 1 — it compiles, so every issue needs an argument</h3>
<p>The code compiles — so every error here is about conventions, design and logic, and each needs an argument.</p>
<h3>Step 2 — prove the key logic bug by running it</h3>
<p>The key logic bug is <strong>String comparison with ==</strong>: it compares object references, not text. A run makes it concrete:</p>
<ul>
<li><strong>Literal <code>"CreditCard"</code></strong> → <code>true</code> (both literals are the same interned object).</li>
<li><strong>Same text built at run time</strong> (as when read from a form or a request) → <code>false</code>.</li>
<li><strong>Negative price</strong> → accepted by the constructor.</li>
<li><strong><code>null</code> payment method</strong> → crashes with NullPointerException.</li>
</ul>`,
      `<h2>✅ Câu 2 — review code TravelBooking</h2>
<h4>Đề yêu cầu</h4>
<p>Tìm 6 lỗi trong <code>TravelBooking</code> (quy ước, chuẩn hoặc logic), giải thích từng lỗi và đề xuất cách sửa.</p>
<h3>Bước 1 — code biên dịch được, nên lỗi nào cũng cần lập luận</h3>
<p>Code này biên dịch được — nên mọi lỗi ở đây đều thuộc về quy ước, thiết kế và logic, và lỗi nào cũng cần lập luận.</p>
<h3>Bước 2 — chạy thử để chứng minh lỗi logic chính</h3>
<p>Lỗi logic chính là <strong>so sánh String bằng ==</strong>: nó so sánh tham chiếu đối tượng, không so sánh nội dung. Chạy thử cho thấy rõ:</p>
<ul>
<li><strong>Literal <code>"CreditCard"</code></strong> → <code>true</code> (hai literal là cùng một đối tượng đã intern).</li>
<li><strong>Cùng nội dung tạo lúc chạy</strong> (như khi đọc từ form hay request) → <code>false</code>.</li>
<li><strong>Giá âm</strong> → constructor vẫn nhận.</li>
<li><strong>Phương thức thanh toán <code>null</code></strong> → chương trình chết với NullPointerException.</li>
</ul>`),
    numbered(SP25_Q2),
    sheet('Answer (Word document) — Q2 · Bài làm mẫu — Câu 2 (line 1 = "public class TravelBooking {")', tbl(['Issue No', 'Description', 'Line'], [
      ['1', '[Logic] <code>paymentMethod == "CreditCard"</code> compares references, not text: a value read at run time with the same text returns false. Fix: <code>"CreditCard".equals(paymentMethod)</code>.', '13'],
      ['2', '[Logic – null safety] <code>paymentMethod.equals("DigitalWallet")</code> throws NullPointerException when paymentMethod is null. Fix: constant first, <code>"DigitalWallet".equals(paymentMethod)</code>, or validate the argument.', '15'],
      ['3', '[Missing validation] The constructor accepts a null/empty id, a negative or zero price and 0 or negative travellers (a booking of −50 is created and then silently fails). Fix: validate and throw IllegalArgumentException.', '6–10'],
      ['4', '[Naming convention] Field <code>BookingId</code> starts with a capital letter. Fix: <code>bookingId</code>.', '2'],
      ['5', '[Naming convention] Method <code>ConfirmBooking</code> starts with a capital letter. Fix: <code>confirmBooking</code>.', '12'],
      ['6', '[Encapsulation / coding standard] Fields, constructor and public methods have no access modifier (package-private). Fix: <code>private</code> (final) fields, <code>public</code> constructor and API methods.', '2–4, 6, 12, 26'],
      ['7', '[Magic number] <code>0.98</code> hides the business rule "2% digital-wallet discount". Fix: <code>private static final BigDecimal DIGITAL_WALLET_RATE = new BigDecimal("0.98");</code>', '16'],
      ['8', '[Money type] <code>double</code> is used for prices; binary floating point cannot represent most decimal amounts exactly. Fix: <code>BigDecimal</code> with 2 decimals (or long in the smallest currency unit).', '3, 16'],
      ['9', '[Error handling] An unsupported payment method (e.g. "BankTransfer", which the context says is allowed) just returns false with no message. Fix: support it, or throw IllegalArgumentException("Unsupported payment method").', '18'],
      ['10', '[Unused data] <code>numberOfTravelers</code> is stored but never used — not in the price and not in <code>getBookingDetails()</code>. Fix: use it (e.g. show it in the details) or remove it.', '4, 27'],
    ])),
    code(`
--- original class, driven by a small Probe program (real output) ---
literal "CreditCard"               -> true
same text built at run time        -> false
negative price (-50), DigitalWallet -> false        (the invalid booking was created)
paymentMethod = null               -> NullPointerException

--- corrected class (BigDecimal, validation, equals with the constant first, exception for unknown method) ---
built at run time -> true
DigitalWallet     -> true
null method       -> Unsupported payment method: null
negative price    -> totalPrice must be > 0
Booking ID: B1, Travelers: 2, Total: 100.00`),

    /* ── Q3 ── */
    bi(`<h2>✅ Question 3 — unit tests for calculateRewardPoints</h2>
<h4>The task</h4>
<p>Unit tests for <code>calculateRewardPoints</code> with 100% statement, branch, EP and BVA coverage; list inputs and expected outputs, and explain the coverage.</p>
<h3>Step 1 — white-box view</h3>
<ul>
<li><strong>Decisions</strong> — D1 <code>bookingAmount &lt; 0</code>, D2 <code>customerType.equals("VIP")</code>, D3 <code>customerType.equals("Regular")</code> → <strong>V(G) = 3 + 1 = 4</strong>, and four returns.</li>
<li><strong>Minimum</strong> — every test ends at one return and each return is reached by a different combination, so <strong>4 tests are the minimum</strong> for 100% statement and 100% branch coverage.</li>
</ul>
<ol>
<li>(−0.01, VIP) → −1</li>
<li>(1000, VIP) → 100</li>
<li>(1000, Regular) → 50</li>
<li>(1000, Guest) → 0</li>
</ol>
<p>A branch probe measured 6/6 outcomes.</p>
<h3>Step 2 — black-box view</h3>
<p>The paper also demands 100% EP and BVA.</p>
<ul>
<li><strong>Amount, partition border</strong> — at 0: −0.01 invalid, 0 valid.</li>
<li><strong>Amount, integer truncation of <code>(int)</code></strong> — easy to miss: a VIP needs at least 10 to earn 1 point (9.99 → 0), a Regular customer at least 20 (19.99 → 0).</li>
<li><strong>Customer type</strong> — three documented partitions plus two that expose behaviour: wrong letter case ("vip" is not "VIP", 0 points) and <code>null</code>, which crashes with NullPointerException as soon as the amount is ≥ 0 — a defect to report.</li>
<li><strong>Negative amount + null type</strong> — still returns −1, because the amount is checked first.</li>
</ul>`,
      `<h2>✅ Câu 3 — unit test cho calculateRewardPoints</h2>
<h4>Đề yêu cầu</h4>
<p>Unit test cho <code>calculateRewardPoints</code> phủ 100% statement, branch, EP và BVA; liệt kê đầu vào, đầu ra mong đợi và giải thích độ phủ.</p>
<h3>Bước 1 — góc nhìn hộp trắng</h3>
<ul>
<li><strong>Các quyết định</strong> — D1 <code>bookingAmount &lt; 0</code>, D2 <code>customerType.equals("VIP")</code>, D3 <code>customerType.equals("Regular")</code> → <strong>V(G) = 3 + 1 = 4</strong>, và bốn lệnh return.</li>
<li><strong>Tối thiểu</strong> — mỗi test kết thúc ở một return và mỗi return ứng với một tổ hợp khác nhau, nên <strong>4 test là tối thiểu</strong> cho 100% statement và 100% branch coverage.</li>
</ul>
<ol>
<li>(−0.01, VIP) → −1</li>
<li>(1000, VIP) → 100</li>
<li>(1000, Regular) → 50</li>
<li>(1000, Guest) → 0</li>
</ol>
<p>Bộ đo nhánh đo được 6/6 kết cục.</p>
<h3>Bước 2 — góc nhìn hộp đen</h3>
<p>Đề còn đòi 100% EP và BVA.</p>
<ul>
<li><strong>Số tiền, biên phân vùng</strong> — tại 0: −0.01 không hợp lệ, 0 hợp lệ.</li>
<li><strong>Số tiền, phép cắt phần thập phân của <code>(int)</code></strong> — dễ bỏ sót: khách VIP cần ít nhất 10 mới được 1 điểm (9.99 → 0), khách Regular cần ít nhất 20 (19.99 → 0).</li>
<li><strong>Loại khách</strong> — ba phân vùng theo đặc tả cộng hai phân vùng làm lộ hành vi: sai hoa thường ("vip" không phải "VIP", 0 điểm) và <code>null</code>, làm chương trình chết với NullPointerException ngay khi số tiền ≥ 0 — một defect phải báo.</li>
<li><strong>Số tiền âm + loại khách null</strong> — hàm vẫn trả −1, vì số tiền được kiểm trước.</li>
</ul>`),
    sheet('Answer — partitions and boundaries · Bài làm mẫu — phân vùng và biên', RW_T31.html),
    sheet('Answer — test cases with inputs and expected output · Bài làm mẫu — test case', RW_T32.table),
    RW_T32.check,
    sheet('Answer — the same tests in the UTCID grid · Bài làm mẫu — lưới UTCID', utGrid({
      fcode: 'RewardCalculator', fname: 'calculateRewardPoints(double bookingAmount, String customerType)', loc: 12,
      req: 'Returns −1 for a negative amount, 10% (VIP) or 5% (Regular) of the amount truncated to int, otherwise 0. TC01–TC04 = minimum for 100% statement + branch (6/6 outcomes); TC05–TC12 add EP/BVA.',
      ids: ['TC01', 'TC02', 'TC03', 'TC04', 'TC05', 'TC06', 'TC07', 'TC08', 'TC09', 'TC10', 'TC11', 'TC12'],
      pre: [['new RewardCalculator() created', 'OOOOOOOOOOOO']],
      inputs: [
        ['bookingAmount', [['-0.01', 'O...........'], ['1000', '.OOO.....OO.'], ['0', '....O.......'], ['9.99', '.....O......'], ['10', '......O.....'], ['19.99', '.......O....'], ['20', '........O...'], ['-5', '...........O']]],
        ['customerType', [['"VIP"', 'OO..OOO.....'], ['"Regular"', '..O....OO...'], ['"Guest"', '...O........'], ['"vip"', '.........O..'], ['null', '..........OO']]],
      ],
      ret: [['-1', 'O..........O'], ['100', '.O..........'], ['50', '..O.........'], ['0', '...OOO.O.O..'], ['1', '......O.O...']],
      exc: [['NullPointerException', '..........O.']],
      type: 'BNNNBBBBBAAA', result: 'PPPPPPPPPPPP', date: '11/09/2026', defects: { 10: 'DF-Q3-01' },
    })),
    code(`
public class RewardCalculatorTest {
    private final RewardCalculator c = new RewardCalculator();
    private void is(String id, double amt, String type, int expected) {
        assertEquals(expected, c.calculateRewardPoints(amt, type));
    }
    @Test public void tc01() { is("TC01", -0.01, "VIP", -1); }
    @Test public void tc02() { is("TC02", 1000, "VIP", 100); }
    @Test public void tc03() { is("TC03", 1000, "Regular", 50); }
    @Test public void tc04() { is("TC04", 1000, "Guest", 0); }
    @Test public void tc05() { is("TC05", 0, "VIP", 0); }
    @Test public void tc06() { is("TC06", 9.99, "VIP", 0); }
    @Test public void tc07() { is("TC07", 10, "VIP", 1); }
    @Test public void tc08() { is("TC08", 19.99, "Regular", 0); }
    @Test public void tc09() { is("TC09", 20, "Regular", 1); }
    @Test public void tc10() { is("TC10", 1000, "vip", 0); }
    @Test public void tc11() { assertThrows(NullPointerException.class, () -> c.calculateRewardPoints(1000, null)); }
    @Test public void tc12() { is("TC12", -5, null, -1); }
}
--- real output (JDK 21, JUnit 4.13.2; is() also printed each result) ---
TC01 amount=-0.01 type=VIP -> -1
TC02 amount=1000.0 type=VIP -> 100
TC03 amount=1000.0 type=Regular -> 50
TC04 amount=1000.0 type=Guest -> 0
TC05 amount=0.0 type=VIP -> 0
TC06 amount=9.99 type=VIP -> 0
TC07 amount=10.0 type=VIP -> 1
TC08 amount=19.99 type=Regular -> 0
TC09 amount=20.0 type=Regular -> 1
TC10 amount=1000.0 type=vip -> 0
TC11 amount=1000 type=null -> NullPointerException (defect)
TC12 amount=-5.0 type=null -> -1
OK (12 tests)
--- branch probe, TC01–TC04 only: R1 amount<0 [F, T] · R2 VIP [F, T] · R3 Regular [F, T] → 6/6 ---`),

    /* ── Q4 ── */
    bi(`<h2>✅ Question 4 — system test cases for two business processes</h2>
<h4>The task</h4>
<p>At least 5 system test cases for each process — "Booking a Travel Package" and "Searching for Available Hotels" — covering normal, alternative and exception flows.</p>
<h3>Step 1 — what a system test case is</h3>
<p>It follows the whole process end to end, through the user interface, with concrete data.</p>
<h3>Step 2 — the mix for each process</h3>
<ul>
<li><strong>Normal</strong> — one or two flows.</li>
<li><strong>Alternative</strong> — two flows: the user takes another route and still finishes.</li>
<li><strong>Exception</strong> — two or three flows: invalid input, missing data, a failing external system.</li>
</ul>
<h4>Assumptions</h4>
<ul>
<li><strong>Payments</strong> — a test environment with sandbox payment gateways (a declined test card exists).</li>
<li><strong>Email</strong> — a test mailbox for confirmation emails.</li>
<li><strong>Data</strong> — seeded hotels and packages for the destinations used; prices in VND.</li>
</ul>`,
      `<h2>✅ Câu 4 — test case hệ thống cho hai quy trình nghiệp vụ</h2>
<h4>Đề yêu cầu</h4>
<p>Ít nhất 5 test case hệ thống cho mỗi quy trình — "Booking a Travel Package" và "Searching for Available Hotels" — phủ luồng chính, luồng thay thế và ngoại lệ.</p>
<h3>Bước 1 — test case hệ thống là gì</h3>
<p>Nó đi trọn quy trình từ đầu đến cuối, qua giao diện người dùng, với dữ liệu cụ thể.</p>
<h3>Bước 2 — cơ cấu cho mỗi quy trình</h3>
<ul>
<li><strong>Luồng chính</strong> — một hai luồng.</li>
<li><strong>Luồng thay thế</strong> — hai luồng: người dùng đi đường khác nhưng vẫn hoàn tất.</li>
<li><strong>Luồng ngoại lệ</strong> — hai ba luồng: dữ liệu sai, thiếu dữ liệu, hệ thống bên ngoài lỗi.</li>
</ul>
<h4>Giả định</h4>
<ul>
<li><strong>Thanh toán</strong> — môi trường test có cổng thanh toán sandbox (có sẵn thẻ test bị từ chối).</li>
<li><strong>Email</strong> — hộp thư test để nhận email xác nhận.</li>
<li><strong>Dữ liệu</strong> — khách sạn/tour mẫu cho các điểm đến dùng trong test; giá tính bằng VND.</li>
</ul>`),
    sheet('Answer — Process 1: Booking a Travel Package · Bài làm mẫu — Quy trình 1', tbl(['Test Case ID', 'Test Scenario', 'Preconditions', 'Test Steps', 'Expected Result'], [
      ['ST-BK-01 (Normal)', 'Book a package and pay by credit card', 'Registered user; package "Đà Nẵng 3 days 2 nights" (flight + hotel + activities) has seats', '1. Log in · 2. Search "Đà Nẵng", dates D+30 to D+32 · 3. Select the package · 4. Review details and price for 2 adults · 5. Enter both travellers\' names, ID numbers, dates of birth · 6. Pay with a valid test credit card', 'Booking confirmed with a booking number; confirmation email received; e-itinerary downloadable; package availability reduced by 2 seats'],
      ['ST-BK-02 (Alternative)', 'Pay with a digital wallet', 'As ST-BK-01', 'Steps 1–5 as ST-BK-01 · 6. Choose Digital wallet and approve in the wallet sandbox', 'Booking confirmed; payment method "Digital wallet" shown on the confirmation and in the email'],
      ['ST-BK-03 (Alternative)', 'Change the number of travellers at review', 'As ST-BK-01', 'Steps 1–3 · 4. On the review page change travellers from 2 to 3 · 5. Enter 3 travellers · 6. Pay by card', 'Price recalculated for 3 before payment; the charged amount equals the new price; itinerary lists 3 travellers'],
      ['ST-BK-04 (Exception)', 'Missing / invalid traveller data', 'As ST-BK-01', 'Steps 1–4 · 5. Leave traveller 2\'s ID number empty and enter a date of birth in the future · 6. Click Continue', 'Field-level errors; the user cannot reach payment; no booking created'],
      ['ST-BK-05 (Exception)', 'Payment declined', 'As ST-BK-01; sandbox card that is always declined', 'Steps 1–5 · 6. Pay with the declined card', 'Message "payment declined"; booking not confirmed; no email; seats released; the user can retry with another method; no charge'],
      ['ST-BK-06 (Exception)', 'Package sold out during booking', 'Package with 1 remaining seat; a second session books it first', 'Steps 1–5 for 1 traveller · (other session buys the last seat) · 6. Pay', 'Message "no longer available"; no charge; the user is offered similar packages'],
    ])),
    sheet('Answer — Process 2: Searching for Available Hotels · Bài làm mẫu — Quy trình 2', tbl(['Test Case ID', 'Test Scenario', 'Preconditions', 'Test Steps', 'Expected Result'], [
      ['ST-HS-01 (Normal)', 'Search hotels by destination and dates', 'Hotels seeded for "Đà Lạt"', '1. Open the website · 2. Enter destination "Đà Lạt", check-in D+30, check-out D+32, 2 adults · 3. Click Search', 'List of hotels with free rooms for those dates, each with price per night and rating; results within the agreed response time'],
      ['ST-HS-02 (Alternative)', 'Apply filters', 'As ST-HS-01', 'Steps 1–3 · 4. Filter price 500,000–1,500,000 VND/night, rating ≥ 4★, amenity "pool"', 'Only matching hotels shown; the result count updates; removing the filters restores the full list'],
      ['ST-HS-03 (Alternative)', 'Check availability for other dates from the details page', 'As ST-HS-01', 'Steps 1–3 · 4. Open a hotel · 5. Change dates to D+40 to D+41 · 6. Click Check availability', 'Room types, free rooms and prices for the new dates; "Book" options shown'],
      ['ST-HS-04 (Exception)', 'Filters with no result', 'As ST-HS-01', 'Steps 1–3 · 4. Filter 5★ and price ≤ 200,000 VND/night', 'Message "No hotels match your filters" with a suggestion to widen them; no error page'],
      ['ST-HS-05 (Exception)', 'Check-out before check-in', 'Website open', '1. Destination "Đà Lạt" · 2. Check-in D+32, check-out D+30 · 3. Search', 'Validation error "check-out must be after check-in"; no search performed'],
      ['ST-HS-06 (Exception)', 'Empty destination / past date', 'Website open', '1. Leave destination empty, click Search · 2. Enter "Đà Lạt" with check-in yesterday, click Search', 'Step 1: "Please enter a destination"; step 2: "check-in date cannot be in the past"; no results list'],
    ])),
    bi(`<h3>Ví dụ có lời giải · Worked example — why 9.99 and 10 are the boundaries that matter</h3>
<p>For a VIP the points are <code>(int)(amount × 0.1)</code>. The cast drops the fraction, so the output changes from 0 to 1 exactly when amount × 0.1 reaches 1, i.e. at amount = 10: 9.99 × 0.1 = 0.999 → 0, 10 × 0.1 = 1.0 → 1. For a Regular customer the step is at 20 (19.99 × 0.05 = 0.9995 → 0). These are <em>output</em> boundaries: invisible in the parameter list, obvious once you ask "where does the result change?". The run above confirms both.</p>
<div class="pitfall co-tieu-de"><strong>Q1 is not a definitions question.</strong> Writing seven definitions of the seven strategies earns little. Pick one primary strategy, tie every choice to a named constraint of the context (traffic, search, payments, devices, team of 5, 12 months), and describe concrete implementation steps — that is what "explain" and "propose how to implement" mean.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Spike vs soak.</strong> "Holiday peaks" hide two different performance risks.
<ul>
<li><strong>Spike test</strong> — jumps from normal to 5× load in a minute (the Tết flash sale) and checks that the site degrades gracefully and recovers.</li>
<li><strong>Soak test</strong> — keeps a high load for hours to find memory leaks and connection-pool exhaustion that a 10-minute load test never shows.</li>
</ul>
<p>Tools such as k6 express both as small scripts that can run in CI.</p>
<p><em>Outside the syllabus because CTFL names performance testing only as a test type (Chapter 2).</em></p></div>`,
      `<h3>Ví dụ có lời giải · Vì sao 9.99 và 10 mới là biên quan trọng</h3>
<p>Với khách VIP, số điểm là <code>(int)(amount × 0.1)</code>. Phép ép kiểu bỏ phần thập phân, nên kết quả đổi từ 0 sang 1 đúng lúc amount × 0.1 chạm 1, tức amount = 10: 9.99 × 0.1 = 0.999 → 0, 10 × 0.1 = 1.0 → 1. Với khách Regular bậc thang nằm ở 20 (19.99 × 0.05 = 0.9995 → 0). Đây là các biên <em>đầu ra</em>: không thấy trong danh sách tham số, nhưng hiện ra ngay khi bạn hỏi "kết quả đổi ở đâu?". Lần chạy ở trên xác nhận cả hai.</p>
<div class="pitfall co-tieu-de"><strong>Q1 không phải câu hỏi định nghĩa.</strong> Viết bảy định nghĩa cho bảy chiến lược được rất ít điểm. Hãy chọn một chiến lược chủ đạo, gắn mỗi lựa chọn với một ràng buộc cụ thể của bối cảnh (lưu lượng, tìm kiếm, thanh toán, thiết bị, đội 5 người, 12 tháng), và mô tả các bước triển khai cụ thể — đó mới là "giải thích" và "đề xuất cách triển khai".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Spike và soak.</strong> "Mùa lễ" giấu hai rủi ro hiệu năng khác nhau.
<ul>
<li><strong>Spike test</strong> — đẩy tải từ bình thường lên gấp 5 trong một phút (đợt flash sale Tết) và kiểm tra website xuống cấp nhẹ nhàng rồi hồi phục.</li>
<li><strong>Soak test</strong> — giữ tải cao nhiều giờ để tìm rò rỉ bộ nhớ và cạn connection pool mà bài load test 10 phút không bao giờ lộ ra.</li>
</ul>
<p>Công cụ như k6 viết cả hai thành script nhỏ chạy được trong CI.</p>
<p><em>Ngoài giáo trình vì CTFL chỉ nêu performance testing như một loại kiểm thử (Chương 2).</em></p></div>`),
    books([
      ['fst4', 'Ch.5 §2.2 "Test strategy and test approach" — book p.164–167 (PDF p.178–181); Ch.5 §5 "Risks and testing" p.183–189 (PDF 197–203); Ch.4 §2.5 use-case testing p.130–131', 'Chương 5 §2.2 "Test strategy and test approach" — trang sách 164–167 (PDF 178–181); Chương 5 §5 "Risks and testing" tr.183–189 (PDF 197–203); Chương 4 §2.5 kiểm thử theo use case tr.130–131'],
      ['sp5', '§6.2 test strategies — §6.2.2 selecting a strategy (PDF p.259), §6.2.3 concrete strategies (PDF p.262), §6.2.4 testing and risk (PDF p.263)', '§6.2 chiến lược kiểm thử — §6.2.2 chọn chiến lược (PDF tr.259), §6.2.3 các chiến lược cụ thể (PDF tr.262), §6.2.4 kiểm thử và rủi ro (PDF tr.263)'],
      ['sp4', '§6.4 test strategy and risk-based testing p.184–189 (PDF p.199–204)', '§6.4 chiến lược kiểm thử và kiểm thử dựa trên rủi ro tr.184–189 (PDF 199–204)'],
    ]),
  ].join('\n'),
};

/* ═════════════════════════ PE drill quiz ═════════════════════════ */
const QUIZ_PE = {
  title: 'PE drill — 12 quick checks before the practical exam|||Luyện PE — 12 câu kiểm tra nhanh trước giờ thi thực hành',
  slug: 'swt301-pe-drill-quiz',
  type: 'QUIZ',
  description: '12 câu trắc nghiệm rút từ bốn đề PE: V(G), số test tối thiểu, biên độ dài, error masking, so sánh String, nhánh không tới được, loại N/A/B, cắt phần thập phân, chiến lược kiểm thử và luật điểm 0.',
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      { question: 'A method has 4 binary decisions (one loop and three if/else-if). What is its cyclomatic complexity V(G)?|||Một method có 4 quyết định nhị phân (một vòng lặp và ba if/else-if). Độ phức tạp cyclomatic V(G) bằng bao nhiêu?',
        options: ['4|||4', '5|||5', '8|||8', '3|||3'], correctIndex: 1, points: 1, explanation: 'V(G) = number of binary decisions + 1 = 4 + 1 = 5. For countCharacters (FA23) the graph check agrees: E - N + 2 = 13 - 10 + 2 = 5. 4 counts only the decisions, and 8 is the number of decision outcomes.|||V(G) = số quyết định nhị phân + 1 = 4 + 1 = 5. Với countCharacters (FA23) phép kiểm trên đồ thị cũng ra: E - N + 2 = 13 - 10 + 2 = 5. 4 chỉ đếm số quyết định, còn 8 là số kết cục quyết định.' },
      { question: 'countCharacters (FA23 Q2) loops over the string and classifies each char as upper, lower, digit or other. Minimum number of tests for 100% statement AND 100% decision coverage?|||countCharacters (FA23 Q2) duyệt chuỗi và phân loại mỗi ký tự thành hoa, thường, số hay khác. Số test tối thiểu để đạt 100% statement VÀ 100% decision coverage?',
        options: ['1 — a string such as "Ab1@"|||1 — một chuỗi như "Ab1@"', '4 — one per kind of character|||4 — mỗi loại ký tự một test', '5 — equal to V(G)|||5 — bằng V(G)', '8 — one per decision outcome|||8 — mỗi kết cục một test'], correctIndex: 0, points: 1, explanation: 'One input string is processed character by character, so "Ab1@" enters the loop and exits it, and A, b, 1, @ drive the upper, lower, digit and else branches: all 8 outcomes and every statement in one test (FA23 solution, run with JUnit + JaCoCo). V(G) = 5 counts basis paths, not the minimum here.|||Một chuỗi được xử lý từng ký tự, nên "Ab1@" vào vòng lặp rồi thoát, và A, b, 1, @ đi qua nhánh hoa, thường, số và else: đủ 8 kết cục và mọi câu lệnh chỉ trong một test (lời giải FA23, đã chạy JUnit + JaCoCo). V(G) = 5 là số đường cơ sở, không phải số tối thiểu ở đây.' },
      { question: 'For the income-tax flowchart (SU24 PE1: 9 decisions, the three "< 0" checks all go to Return −1), how many tests give 100% DECISION coverage at minimum?|||Với lưu đồ thuế thu nhập (SU24 PE1: 9 quyết định, ba phép kiểm "< 0" cùng dẫn tới Return −1), cần tối thiểu bao nhiêu test để đạt 100% DECISION coverage?',
        options: ['8|||8', '9|||9', '10|||10', '18|||18'], correctIndex: 2, points: 1, explanation: '9 decisions give 18 outcomes and every test ends in exactly one return. The 7 non-(-1) return boxes need one test each, and Return -1 is reached by three different "< 0" outcomes (sal, te, nod), each needing its own test: 7 + 3 = 10. A branch probe shows 18/18 with 10 tests and 17/18 if any one is dropped.|||9 quyết định cho 18 kết cục và mỗi test kết thúc ở đúng một return. 7 ô return khác -1 cần mỗi ô một test, còn Return -1 được ba kết cục "< 0" khác nhau dẫn tới (sal, te, nod), mỗi kết cục cần một test: 7 + 3 = 10. Bộ đo nhánh cho 18/18 với 10 test và 17/18 nếu bỏ bất kỳ test nào.' },
      { question: 'Same flowchart: what is the minimum for 100% STATEMENT coverage only?|||Cùng lưu đồ đó: tối thiểu bao nhiêu test cho riêng 100% STATEMENT coverage?',
        options: ['6|||6', '8 — one per return box|||8 — mỗi ô return một test', '10|||10', '3|||3'], correctIndex: 1, points: 1, explanation: 'Statement coverage only needs every box executed: one test per return box, and the three -1 exits share one box, so 8 tests. They give 100% statements but only 16/18 decision outcomes, because te < 0 and nod < 0 are never true. That is the typical PE mistake.|||Statement coverage chỉ cần mọi ô được chạy: mỗi ô return một test, và ba lối -1 dùng chung một ô, nên 8 test. Chúng cho 100% statement nhưng chỉ 16/18 kết cục quyết định, vì te < 0 và nod < 0 chưa từng đúng. Đó là lỗi điển hình khi thi PE.' },
      { question: 'A required name must be 50 to 255 characters long. Which set lists the INVALID boundary values?|||Một tên bắt buộc phải dài từ 50 đến 255 ký tự. Tập nào liệt kê các giá trị biên KHÔNG hợp lệ?',
        options: ['50 and 255|||50 và 255', '49, 256 and 0 (empty)|||49, 256 và 0 (rỗng)', '51 and 254|||51 và 254', '1 and 1000|||1 và 1000'], correctIndex: 1, points: 1, explanation: 'The valid partition is 50..255, so its boundaries 50 and 255 are valid, and the invalid boundary values are the neighbours 49 and 256. Because the name is required, the empty value (0 characters) is an extra invalid case (FA23 solution). 51 and 254 are valid.|||Phân vùng hợp lệ là 50..255, nên biên 50 và 255 là hợp lệ, còn giá trị biên không hợp lệ là hai láng giềng 49 và 256. Vì tên là bắt buộc, giá trị rỗng (0 ký tự) là thêm một ca không hợp lệ (lời giải FA23). 51 và 254 là hợp lệ.' },
      { question: 'Why should each negative test case contain only ONE invalid value?|||Vì sao mỗi test case âm chỉ nên chứa MỘT giá trị không hợp lệ?',
        options: ['Because the template has only one TAG cell|||Vì template chỉ có một ô TAG', 'Because one error can mask another, so you cannot tell which check worked|||Vì lỗi này có thể che lỗi kia, nên không biết phép kiểm nào đã chạy', 'Because invalid values are slower to test|||Vì giá trị không hợp lệ test chậm hơn', 'Because ISTQB forbids more than one input per test|||Vì ISTQB cấm hơn một đầu vào mỗi test'], correctIndex: 1, points: 1, explanation: 'Error masking: the program usually rejects the input at the first failed check, so a second invalid value is never evaluated and you cannot tell which check worked. Hence the PE rule: combine valid tags in one case, give each invalid value its own case. ISTQB does not limit a test to one input.|||Error masking: chương trình thường từ chối ngay ở phép kiểm đầu tiên bị sai, nên giá trị không hợp lệ thứ hai không bao giờ được xét và không biết phép kiểm nào đã chạy. Vì vậy luật khi thi PE: gộp tag hợp lệ vào một ca, mỗi giá trị không hợp lệ một ca riêng. ISTQB không giới hạn một test chỉ một input.' },
      { question: 'In TravelBooking (SP25), what is wrong with if (paymentMethod == "CreditCard")?|||Trong TravelBooking (SP25), if (paymentMethod == "CreditCard") sai ở đâu?',
        options: ['Nothing — == compares text in Java|||Không sai — == so sánh nội dung trong Java', 'It compares object references, so the same text created at run time gives false|||Nó so sánh tham chiếu, nên cùng nội dung tạo lúc chạy vẫn cho false', 'It does not compile|||Nó không biên dịch được', 'It is only a naming-convention issue|||Chỉ là lỗi quy ước đặt tên'], correctIndex: 1, points: 1, explanation: 'In Java, == on objects compares references. A literal "CreditCard" may pass by luck because literals are interned, but the same text read from input or built at run time gives false. Use "CreditCard".equals(paymentMethod). The code compiles, so it is a logic defect, not a naming issue.|||Trong Java, == trên object so sánh tham chiếu. Literal "CreditCard" có thể qua may nhờ literal được intern, nhưng cùng nội dung đọc từ input hay tạo lúc chạy sẽ cho false. Dùng "CreditCard".equals(paymentMethod). Code vẫn biên dịch được, nên đây là lỗi logic, không phải lỗi đặt tên.' },
      { question: 'calculateTotalPrice (FALL24) ends with return finalPrice < 0 ? 0 : finalPrice; the maximum discount is 30% and prices must be > 0. What is the best achievable decision coverage?|||calculateTotalPrice (FALL24) kết thúc bằng return finalPrice < 0 ? 0 : finalPrice; mức giảm tối đa 30% và giá phải > 0. Decision coverage cao nhất đạt được là bao nhiêu?',
        options: ['100% with enough tests|||100% nếu đủ test', '17 of 18 outcomes — finalPrice < 0 can never be true|||17/18 kết cục — finalPrice < 0 không bao giờ đúng', '50%|||50%', '9 of 18 outcomes|||9/18 kết cục'], correctIndex: 1, points: 1, explanation: 'With price > 0 and at most 30% discount, finalPrice is at least 70% of a positive amount, so finalPrice < 0 can never be true. 9 decisions give 18 outcomes and one is unreachable: 17/18 is the ceiling, confirmed by the 13 JUnit tests in the FALL24 solution. Report the unreachable branch instead of faking it.|||Với price > 0 và giảm tối đa 30%, finalPrice luôn ít nhất bằng 70% một số dương, nên finalPrice < 0 không bao giờ đúng. 9 quyết định cho 18 kết cục và một kết cục không tới được: 17/18 là mức trần, đã xác nhận bằng 13 test JUnit trong lời giải FALL24. Hãy báo nhánh không tới được thay vì làm giả.' },
      { question: 'In the Q2 unit-test template, what does Type "B" mean?|||Trong template unit test Q2, Type "B" nghĩa là gì?',
        options: ['Bug|||Bug (lỗi)', 'Blocked|||Blocked (bị chặn)', 'Boundary|||Boundary (biên)', 'Black-box|||Black-box (hộp đen)'], correctIndex: 2, points: 1, explanation: 'The template\'s Result row reads "Type (N: Normal, A: Abnormal, B: Boundary)". Blocked is a run status, not a type, and bugs go in the Defect ID row.|||Dòng Result của template ghi "Type (N: Normal, A: Abnormal, B: Boundary)". Blocked là trạng thái chạy, không phải loại, còn bug được ghi ở dòng Defect ID.' },
      { question: 'calculateRewardPoints(9.99, "VIP") returns (int)(9.99 * 0.1). What is the result?|||calculateRewardPoints(9.99, "VIP") trả (int)(9.99 * 0.1). Kết quả là gì?',
        options: ['1|||1', '0.999|||0.999', '0|||0', '-1|||-1'], correctIndex: 2, points: 1, explanation: '9.99 x 0.1 = 0.999, and a Java (int) cast truncates toward zero instead of rounding, so the result is 0. 0.999 cannot be returned as an int, and 1 would need Math.round.|||9.99 x 0.1 = 0.999, và phép ép (int) trong Java cắt về phía 0 chứ không làm tròn, nên kết quả là 0. Kiểu int không thể trả 0.999, còn muốn ra 1 thì phải dùng Math.round.' },
      { question: 'For TravelEase, which strategy directly addresses "payment transactions must be secure" through PCI DSS and OWASP checklists?|||Với TravelEase, chiến lược nào xử lý trực tiếp yêu cầu "giao dịch thanh toán phải an toàn" bằng checklist PCI DSS và OWASP?',
        options: ['Process-/Standard-compliant|||Process-/Standard-compliant', 'Reactive|||Reactive', 'Directed (consultative)|||Directed (consultative)', 'Regression-averse|||Regression-averse'], correctIndex: 0, points: 1, explanation: 'A process- or standard-compliant strategy derives tests from external rules and standards, here PCI DSS for card payments and the OWASP Top 10 for web security. Regression-averse protects existing features by rerunning tests, and directed follows the advice of stakeholders or experts.|||Chiến lược process- hoặc standard-compliant lấy test từ quy định và tiêu chuẩn bên ngoài, ở đây là PCI DSS cho thanh toán thẻ và OWASP Top 10 cho bảo mật web. Regression-averse bảo vệ tính năng cũ bằng cách chạy lại test, còn directed dựa vào ý kiến của stakeholder hay chuyên gia.' },
      { question: 'You copy the template\'s blue sample row "Customer name 2 – 64 chars" into your table 3.1 and forget to delete it. What does the rule on the paper say?|||Bạn để nguyên dòng mẫu chữ xanh "Customer name 2 – 64 chars" trong bảng 3.1. Quy định trên đề nói gì?',
        options: ['Nothing happens; extra rows are ignored|||Không sao; dòng thừa bị bỏ qua', 'Irrelevant information → that answer can be given 0|||Thông tin lạc đề → câu đó có thể bị 0 điểm', 'You get a bonus for completeness|||Được cộng điểm vì đầy đủ', 'Only the tag numbers are re-counted|||Chỉ đếm lại số tag'], correctIndex: 1, points: 1, explanation: 'Every PE paper says "You will get 0 for any answer which contains information irrelevant to the corresponding question", and each template sheet notes that blue text is a sample to be deleted. A leftover sample row is irrelevant content, so that answer can get 0.|||Mọi đề PE ghi "You will get 0 for any answer which contains information irrelevant to the corresponding question", và mỗi sheet của template ghi chú chữ xanh là mẫu, phải xoá. Dòng mẫu còn sót là nội dung lạc đề, nên câu đó có thể bị 0 điểm.' },
    ],
  },
};

export default {
  title: 'Practical Exam (PE) — past papers & worked solutions|||Thi thực hành (PE) — đề cũ & lời giải chi tiết',
  description: 'Bốn đề PE thật trong 01.Materials/03.PE (FA23, SU24 PE1, FALL24, SPRING25) giải trọn trên đúng template: review code có số dòng, unit test tối thiểu với CFG/V(G) và JUnit đã chạy, bảng EP/BVA 3.1–3.3 kèm kiểm độ phủ tag; cộng bài hướng dẫn cách thi và 12 câu luyện.',
  lessons: [L0, L1, L2, L3, L4, QUIZ_PE],
};
