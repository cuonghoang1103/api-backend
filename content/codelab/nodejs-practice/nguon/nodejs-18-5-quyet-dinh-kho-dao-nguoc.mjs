/** Node.js 18.5 — Quyết định khó đảo ngược: cửa một chiều / hai chiều, chú thích ghi VÌ SAO (+ "Revisit when"), ADR bốn mục, nợ kỹ thuật là gì và không là gì. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'One-way or two-way door?', kho: 'EASY', phut: 5, loai: 'table',
  en: 'Decide fast on two-way doors; decide slowly, and write down why, on one-way doors (lesson 18.5).',
  vi: 'Quyết nhanh với cửa hai chiều; quyết chậm, và ghi lại vì sao, với cửa một chiều (bài 18.5).',
  bang: [bang1('b1', ['Your Notes API is about to launch', 'Notes API của bạn sắp ra mắt'], [{ ma: 'x', ten: 'Decision' }, { ma: 'd', ten: 'Door', luaChon: ['one-way', 'two-way'] }], [
    { o: { x: 'The logging library (pino or console wrapper)' }, a: { d: 'two-way' } },
    { o: { x: 'Sequential note ids in public URLs (/notes/1842)' }, a: { d: 'one-way' } },
    { o: { x: 'The connection pool size' }, a: { d: 'two-way' } },
    { o: { x: 'Storing created_at as timestamp (no time zone)' }, a: { d: 'one-way' } },
    { o: { x: 'The JSON shape of GET /notes once mobile clients use it' }, a: { d: 'one-way' } },
    { o: { x: 'The compression level of the middleware' }, a: { d: 'two-way' } },
    { o: { x: 'How access tokens are signed and verified (the auth model)' }, a: { d: 'one-way' } },
    { o: { x: 'Folder names inside src/services' }, a: { d: 'two-way' } },
  ], ['Code can be rolled back in seconds (17.6); data written in the wrong shape stays written. Ids in URLs leak volumes and invite IDOR, and switching kills old links; timestamp without a zone corrupts data you cannot un-corrupt; a public contract can only be versioned; changing the auth model logs everyone out.', 'Mã quay lui trong vài giây (17.6); dữ liệu ghi sai hình dạng thì vẫn nằm đó. Id trong URL lộ quy mô và mời gọi IDOR, đổi đi thì chết link cũ; timestamp không múi giờ làm hỏng dữ liệu mà không sửa lại được; hợp đồng công khai chỉ có thể thêm phiên bản; đổi mô hình xác thực làm mọi người bị đăng xuất.'])],
  goiY: [['Ask: if this is wrong, what does undoing it cost?', 'Hỏi: nếu sai thì hoàn tác tốn bao nhiêu?'], ['Anything that writes data or that clients depend on is suspect.', 'Thứ gì ghi dữ liệu hoặc client phụ thuộc vào đều đáng nghi.']],
  loi: [['Weeks on the ORM debate, five minutes on the URL id.', 'Hàng tuần tranh luận ORM, năm phút cho id trong URL.'], ['Treating the pool size as a one-way door.', 'Coi kích thước pool là cửa một chiều.']],
  tns: [tn('one-way door', 'cửa một chiều', 'months to reverse'), tn('two-way door', 'cửa hai chiều', 'reversible in an afternoon')],
  kn: ['architecture', 'decisions'],
});

function checkDecisionComment(text) {
  // Bốn phần của một chú thích tốt: quyết định (Why), cái giá chấp nhận (Cost), biện pháp giảm (Mitigation), và khi nào xem lại.
  const LABELS = [['why', 'Why'], ['cost', 'Cost'], ['mitigation', 'Mitigation'], ['revisit', 'Revisit when']];
  const lines = text.split('\n').map((l) => l.replace(/^\s*(\/\/+|\/\*+|\*+\/?|#)\s?/, '').trim());
  const has = {};
  for (const [key, label] of LABELS) {
    const line = lines.find((l) => l.toLowerCase().startsWith(label.toLowerCase() + ':'));
    has[key] = !!line && line.slice(label.length + 1).trim().length > 0;    // nhãn có mà để trống = coi như thiếu
  }
  return { ...has, missing: LABELS.filter(([k]) => !has[k]).map(([, l]) => l) };
}
const EMBED = `/**
 * Why: no BullMQ — one process, and BullMQ adds 50 MB of dependencies.
 * Cost: if the process crashes mid-job, in-flight jobs are lost.
 * Mitigation: jobs are idempotent, documents carry embeddingStatus, a recovery scan finds stuck ones.
 */`;
const E2 = await jsBai({
  ten: 'checkDecisionComment(text): decision, cost, mitigation — and the missing “Revisit when”', kho: 'EASY', phut: 8,
  en: '<p>Code already says what; six months later the question is always why. A decision comment needs four labelled parts: <code>Why:</code>, <code>Cost:</code>, <code>Mitigation:</code>, <code>Revisit when:</code>. Write <code>checkDecisionComment(text)</code>: strip leading comment markers from each line (<code>//</code>, <code>/*</code>, <code>*</code>, <code>*/</code>, <code>#</code>, plus one following space), then a part is present when some line starts with its label followed by <code>:</code> (case-insensitive) <b>and</b> has text after the colon. Return <code>{ why, cost, mitigation, revisit, missing }</code> — four booleans and the labels that are missing, in the order above.</p>',
  vi: '<p>Mã đã nói cái gì; sáu tháng sau câu hỏi luôn là vì sao. Chú thích quyết định cần bốn phần có nhãn: <code>Why:</code>, <code>Cost:</code>, <code>Mitigation:</code>, <code>Revisit when:</code>. Viết <code>checkDecisionComment(text)</code>: bỏ ký hiệu chú thích ở đầu mỗi dòng (<code>//</code>, <code>/*</code>, <code>*</code>, <code>*/</code>, <code>#</code>, cộng một dấu cách theo sau), rồi một phần được coi là có khi có dòng bắt đầu bằng nhãn của nó kèm <code>:</code> (không phân biệt hoa thường) <b>và</b> có chữ sau dấu hai chấm. Trả về <code>{ why, cost, mitigation, revisit, missing }</code> — bốn boolean và các nhãn còn thiếu, theo thứ tự trên.</p>',
  goiY: [['Normalise each line first with one replace, then use startsWith on the lower-cased line.', 'Chuẩn hoá mỗi dòng trước bằng một lần replace, rồi dùng startsWith trên dòng viết thường.'], ['“Revisit when:” is two words — compare the whole label.', '“Revisit when:” là hai từ — so cả nhãn.']],
  loi: [['A label with nothing after it counts as written: “Revisit when:” left empty tells the next person nothing.', 'Nhãn không có gì phía sau mà vẫn tính là đã viết: “Revisit when:” để trống không nói gì với người sau.'], ['Searching anywhere in the line: “the cost: none” inside a sentence is not a labelled part.', 'Tìm ở bất kỳ đâu trong dòng: “the cost: none” giữa câu không phải một phần có nhãn.']],
  gt: ['The website’s embedding-queue comment gets three things right and misses the fourth. Without “Revisit when: a second process appears, or losing a job stops being acceptable”, a deliberate trade-off looks exactly like an oversight — and 18.4 already named that trigger.', 'Chú thích hàng đợi embedding của website làm đúng ba thứ và thiếu thứ tư. Thiếu “Revisit when: a second process appears, or losing a job stops being acceptable”, một đánh đổi có chủ ý trông y hệt một sơ suất — và 18.4 đã gọi tên đúng điều kiện đó.'],
  kn: ['documentation', 'decisions'],
  tns: [tn('trade-off', 'đánh đổi'), tn('revisit trigger', 'điều kiện xem lại')],
  dau: `/** does the comment record why, the cost, the mitigation and when to revisit? */
function checkDecisionComment(text) {
  // Write your solution here
  const t = text.toLowerCase();
  const has = { why: t.includes('why'), cost: t.includes('cost'), mitigation: t.includes('mitigation'), revisit: t.includes('revisit') };
  return { ...has, missing: [] };
}
`,
  giai: '// Reference solution\n' + nguon(checkDecisionComment),
  cases: [
    { goi: goi('checkDecisionComment', EMBED), moTa: ['The embedding queue comment', 'Chú thích hàng đợi embedding'] },
    { goi: goi('checkDecisionComment', EMBED.replace(' */', ' * Revisit when: a second process appears, or losing a job stops being acceptable.\n */')), moTa: ['With the fourth line', 'Có dòng thứ tư'] },
    { goi: goi('checkDecisionComment', '// why: cache /notes in memory, not Redis\n// COST: copies diverge with 2 processes\n// revisit when:\n// We accepted the cost: stale reads for 10 s'), an: true },
    { goi: goi('checkDecisionComment', '# Mitigation: TTL 10 s\n# Revisit when: a second container appears'), an: true },
  ],
});

function adrLint(md) {
  // ADR bốn mục, đúng thứ tự: Context · Options · Decision · Consequences (và phải nói điều GIỜ KHÔNG làm được).
  const WANT = ['Context', 'Options', 'Decision', 'Consequences'];
  const heads = [];
  const body = {};
  let cur = null;
  for (const line of md.split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) { cur = m[1]; heads.push(cur); body[cur] = []; continue; }
    if (cur) body[cur].push(line);
  }
  const problems = [];
  for (const h of WANT) if (!heads.includes(h)) problems.push(`MISSING ${h}`);
  const present = heads.filter((h) => WANT.includes(h));
  if (present.join() !== WANT.filter((h) => heads.includes(h)).join()) problems.push('WRONG ORDER');
  if (body.Options && body.Options.filter((l) => /^\s*[-*]\s+\S/.test(l)).length < 2) problems.push('ONE OPTION');
  if (body.Consequences && !/\b(cannot|can't|can no longer|no longer)\b/i.test(body.Consequences.join(' '))) problems.push('NO TRADE-OFF');
  return problems;
}
const ADR = `# ADR 7 — Cache /notes in process memory
## Context
p95 of GET /notes is 900 ms; one container, one process.
## Options
- Redis cache (chapter 12)
- In-process Map with a cap and a 10 s TTL
## Decision
In-process Map, max 1,000 entries, TTL 10 s.
## Consequences
We cannot run a second process without the copies diverging; stale reads for up to 10 s.`;
const E3 = await jsBai({
  ten: 'adrLint(markdown): four headings, and “what we now CANNOT do”', kho: 'MEDIUM', phut: 14,
  en: '<p>An ADR (Architecture Decision Record) has four <code>## </code> headings in this order: <code>Context</code>, <code>Options</code>, <code>Decision</code>, <code>Consequences</code>. Write <code>adrLint(md)</code> returning the problems, in this order:</p><ol><li><code>"MISSING &lt;heading&gt;"</code> for each required heading that is absent (in the order above);</li><li><code>"WRONG ORDER"</code> if the required headings that are present do not appear in that order;</li><li><code>"ONE OPTION"</code> if the Options section has fewer than 2 list items (lines starting with <code>-</code> or <code>*</code>);</li><li><code>"NO TRADE-OFF"</code> if the Consequences section does not contain “cannot”, “can\'t”, “can no longer” or “no longer” (case-insensitive).</li></ol><p>Other headings are allowed and ignored.</p>',
  vi: '<p>Một ADR (bản ghi quyết định kiến trúc) có bốn tiêu đề <code>## </code> theo thứ tự: <code>Context</code>, <code>Options</code>, <code>Decision</code>, <code>Consequences</code>. Viết <code>adrLint(md)</code> trả về các vấn đề, theo thứ tự:</p><ol><li><code>"MISSING &lt;tiêu đề&gt;"</code> cho mỗi tiêu đề bắt buộc bị thiếu (theo thứ tự trên);</li><li><code>"WRONG ORDER"</code> nếu các tiêu đề bắt buộc có mặt không xuất hiện đúng thứ tự đó;</li><li><code>"ONE OPTION"</code> nếu mục Options có ít hơn 2 mục danh sách (dòng bắt đầu bằng <code>-</code> hoặc <code>*</code>);</li><li><code>"NO TRADE-OFF"</code> nếu mục Consequences không chứa “cannot”, “can\'t”, “can no longer” hay “no longer” (không phân biệt hoa thường).</li></ol><p>Tiêu đề khác được phép và bị bỏ qua.</p>',
  goiY: [['Walk the lines once: a ## line starts a new section; other lines go into the current section’s body.', 'Duyệt các dòng một lần: dòng ## mở mục mới; dòng khác vào thân mục hiện tại.'], ['Order check: the present required headings, in document order, must equal WANT filtered to those present.', 'Kiểm thứ tự: các tiêu đề bắt buộc có mặt, theo thứ tự tài liệu, phải bằng WANT đã lọc còn những cái có mặt.']],
  loi: [['A one-option ADR: it records a decision nobody compared with anything.', 'ADR một phương án: nó ghi lại một quyết định không ai đem so với thứ gì.'], ['Consequences that only list benefits: writing what you can no longer do is what makes people notice a one-way door before walking through it.', 'Hệ quả chỉ liệt kê lợi ích: viết ra điều không còn làm được mới khiến người ta nhận ra cửa một chiều trước khi bước qua.']],
  gt: ['About ten minutes each, kept in the repository next to the code it explains. The point is not the document: “Consequences: we cannot run a second process” is the line that will stop someone setting WORKERS=4 next year.', 'Khoảng mười phút mỗi bản, để trong repo cạnh mã nó giải thích. Mục đích không phải là văn bản: “Consequences: we cannot run a second process” là dòng sẽ ngăn ai đó đặt WORKERS=4 vào năm sau.'],
  kn: ['ADR', 'documentation', 'parsing'],
  tns: [tn('ADR', 'ADR', 'Architecture Decision Record')],
  dau: `/** lint an ADR */
function adrLint(md) {
  // Write your solution here
  const problems = [];
  for (const h of ['Context', 'Options', 'Decision', 'Consequences']) if (!md.includes(h)) problems.push('MISSING ' + h);
  return problems;
}
`,
  giai: '// Reference solution\n' + nguon(adrLint),
  cases: [
    { goi: goi('adrLint', ADR), moTa: ['A complete ADR', 'Một ADR đầy đủ'] },
    { goi: goi('adrLint', ADR.replace('- Redis cache (chapter 12)\n', '').replace('We cannot run a second process without the copies diverging; stale reads for up to 10 s.', 'p95 drops to 40 ms.')), moTa: ['One option, benefits only', 'Một phương án, chỉ có lợi ích'] },
    { goi: goi('adrLint', '## Decision\nUse Redis.\n## Context\nslow\n## Notes\nOptions were discussed\n## Consequences\nWe can no longer deploy without Redis.'), an: true },
    { goi: goi('adrLint', ''), an: true },
  ],
});

const E4 = cs({
  ten: 'What technical debt is — and what it is not', kho: 'MEDIUM', phut: 6,
  en: 'Questions on the second half of lesson 18.5.',
  vi: 'Câu hỏi về nửa sau của bài 18.5.',
  cau: [
    q('c1', ['The 6,113-line seed file and the 50 route files that skip the service. Which is debt?', 'Tệp seed 6.113 dòng và 50 tệp route bỏ qua service. Cái nào là nợ?'],
      ['The 50 routes: a rule that must apply everywhere now costs fifty edits', 'The seed: a 6,113-line file is debt by definition, whatever it holds', 'Both, because both would fail a simple 500-line rule in review', 'Neither, because both of them work correctly in production today'],
      ['Debt is a decision that makes future change more expensive, not code you dislike. Ugly code nobody touches that blocks nothing is not debt — leave it alone.', 'Nợ là một quyết định làm thay đổi tương lai đắt hơn, không phải mã bạn không thích. Mã xấu không ai đụng tới và không chặn gì thì không phải nợ — để yên.']),
    q('c2', ['Class “dark” for the global theme was right with one theming system; later it switched on every Tailwind dark: style inside Notes. Which kind of debt?', 'Class “dark” cho theme toàn cục đúng khi chỉ có một hệ theme; về sau nó bật mọi style dark: của Tailwind trong Notes. Đây là loại nợ nào?'],
      ['Rot: a decision that was right in circumstances that changed', 'Deliberate: shipped knowing it had to be fixed', 'Accidental: only now do you see how it should have been done', 'Not debt: it was a CSS bug, not a decision'],
      ['The global class is now theme-dark. Each of the three debts the project paid (GIPHY key, dark class, schema drift → P3009) was a reasonable local decision that became expensive at a distance.', 'Class toàn cục nay là theme-dark. Mỗi khoản nợ dự án đã trả (khoá GIPHY, class dark, lược đồ trôi → P3009) đều là một quyết định cục bộ hợp lý trở nên đắt đỏ ở xa.']),
    qn('c3', ['Which statements are true? (choose all that apply)', 'Những câu nào đúng? (chọn mọi câu đúng)'],
      ['The most dangerous debt is the one that works: a subtly wrong schema serves every request for a year', 'A decision record is only useful where decisions are made, next to the code', 'The project’s CLAUDE.md keeps 21 known-error rows and 9 NEVER rules — every rule is a scar', 'Debt should be measured by counting lines that fail a style guide'],
      [0, 1, 2],
      ['The useful question is never “is this good code?” but “what does this make expensive?”. Spend your slow thinking on the schema.', 'Câu hỏi hữu ích không bao giờ là “mã này có tốt không?” mà là “nó làm cái gì trở nên đắt?”. Dành suy nghĩ chậm cho lược đồ.']),
  ],
  goiY: [['What future change does it make expensive?', 'Nó làm thay đổi nào trong tương lai trở nên đắt?'], ['Was it right when it was made?', 'Lúc đưa ra nó có đúng không?']],
  loi: [['Calling every long or ugly file debt.', 'Gọi mọi tệp dài hay xấu là nợ.'], ['Keeping decisions in a wiki nobody reads.', 'Giữ quyết định trong một wiki không ai đọc.']],
  tns: [tn('technical debt', 'nợ kỹ thuật'), tn('rot', 'mục ruỗng', 'a right decision whose circumstances changed')],
  kn: ['architecture', 'technical debt'],
});

function classifySql(sql) {
  // Mỗi câu: cửa hai chiều (hoàn tác được) hay một chiều (dữ liệu sống lâu hơn mã).
  return sql.split(';').map((s) => s.trim().replace(/\s+/g, ' ')).filter(Boolean).map((s) => {
    let door = 'two-way';
    let why = 'reversible';
    if (/^DROP (TABLE|SCHEMA|DATABASE)\b|\bDROP COLUMN\b/i.test(s)) { door = 'one-way'; why = 'drops data'; }
    else if (/\bRENAME\b/i.test(s)) { door = 'one-way'; why = 'breaks every reader of the old name'; }
    else if (/\bALTER COLUMN \S+ (SET DATA )?TYPE\b/i.test(s)) { door = 'one-way'; why = 'rewrites stored values'; }
    else if (/^(UPDATE|DELETE)\b/i.test(s) && !/\bWHERE\b/i.test(s)) { door = 'one-way'; why = 'rewrites every row'; }
    else if (/\btimestamp\b(?!\s*with time zone)/i.test(s)) { door = 'one-way'; why = 'stores time without a zone'; }
    return { sql: s, door, why };
  });
}
const E5 = await jsBai({
  ten: 'classifySql(sql): which statements of a migration are one-way doors?', kho: 'HARD', phut: 16,
  en: '<p>Split <code>sql</code> on <code>;</code>, trim each statement, collapse runs of whitespace to one space and drop empty ones. Classify each, checking in this order (case-insensitive), as <code>{ sql, door, why }</code>:</p><ol><li><code>DROP TABLE</code> / <code>DROP SCHEMA</code> / <code>DROP DATABASE</code> at the start, or <code>DROP COLUMN</code> anywhere → <code>"one-way"</code>, <code>"drops data"</code>;</li><li><code>RENAME</code> → <code>"one-way"</code>, <code>"breaks every reader of the old name"</code>;</li><li><code>ALTER COLUMN x TYPE</code> / <code>ALTER COLUMN x SET DATA TYPE</code> → <code>"one-way"</code>, <code>"rewrites stored values"</code>;</li><li><code>UPDATE</code> or <code>DELETE</code> with no <code>WHERE</code> → <code>"one-way"</code>, <code>"rewrites every row"</code>;</li><li>a <code>timestamp</code> type that is not <code>timestamptz</code> / <code>timestamp with time zone</code> → <code>"one-way"</code>, <code>"stores time without a zone"</code>;</li><li>anything else (incl. <code>DROP INDEX</code>: an index holds no data and can be rebuilt) → <code>"two-way"</code>, <code>"reversible"</code>.</li></ol>',
  vi: '<p>Tách <code>sql</code> theo <code>;</code>, cắt khoảng trắng từng câu, gộp các dãy khoảng trắng thành một dấu cách và bỏ câu rỗng. Phân loại từng câu, xét theo thứ tự (không phân biệt hoa thường), dạng <code>{ sql, door, why }</code>:</p><ol><li><code>DROP TABLE</code> / <code>DROP SCHEMA</code> / <code>DROP DATABASE</code> ở đầu, hoặc <code>DROP COLUMN</code> ở bất kỳ đâu → <code>"one-way"</code>, <code>"drops data"</code>;</li><li><code>RENAME</code> → <code>"one-way"</code>, <code>"breaks every reader of the old name"</code>;</li><li><code>ALTER COLUMN x TYPE</code> / <code>ALTER COLUMN x SET DATA TYPE</code> → <code>"one-way"</code>, <code>"rewrites stored values"</code>;</li><li><code>UPDATE</code> hoặc <code>DELETE</code> không có <code>WHERE</code> → <code>"one-way"</code>, <code>"rewrites every row"</code>;</li><li>kiểu <code>timestamp</code> không phải <code>timestamptz</code> / <code>timestamp with time zone</code> → <code>"one-way"</code>, <code>"stores time without a zone"</code>;</li><li>còn lại (kể cả <code>DROP INDEX</code>: index không chứa dữ liệu và dựng lại được) → <code>"two-way"</code>, <code>"reversible"</code>.</li></ol>',
  goiY: [['Normalise first: s.trim().replace(/\\s+/g, " ").', 'Chuẩn hoá trước: s.trim().replace(/\\s+/g, " ").'], ['For the time rule, a negative lookahead keeps “timestamp with time zone” and “timestamptz” out.', 'Với luật thời gian, lookahead phủ định loại “timestamp with time zone” và “timestamptz”.']],
  loi: [['Treating timestamp as harmless because the app “always uses UTC”: the day one server or one client does not, the stored values are ambiguous forever.', 'Coi timestamp là vô hại vì app “luôn dùng UTC”: ngày một server hay một client không như vậy, giá trị đã lưu mơ hồ mãi mãi.'], ['Missing the backfill without WHERE: it is not schema, but it rewrites every row and cannot be rolled back by code.', 'Bỏ sót lệnh backfill không có WHERE: nó không phải lược đồ, nhưng ghi đè mọi dòng và không quay lui được bằng mã.']],
  gt: ['Data outlives code: this backend has 243 migrations and 608 models, each migration a door already walked through. Two-way statements can be undone by the next migration; one-way ones need the slow thinking (and the ADR) before they run.', 'Dữ liệu sống lâu hơn mã: backend này có 243 migration và 608 model, mỗi migration là một cánh cửa đã bước qua. Câu hai chiều có thể hoàn tác bằng migration sau; câu một chiều cần suy nghĩ chậm (và một ADR) trước khi chạy.'],
  kn: ['migrations', 'decisions', 'regex'],
  tns: [tn('timestamptz', 'timestamptz', 'timestamp with time zone: an absolute instant'), tn('backfill', 'điền dữ liệu cũ')],
  dau: `/** one-way or two-way, statement by statement */
function classifySql(sql) {
  // Write your solution here
  return sql.split(';').map((s) => s.trim()).filter(Boolean).map((s) => ({ sql: s, door: /DROP/i.test(s) ? 'one-way' : 'two-way', why: /DROP/i.test(s) ? 'drops data' : 'reversible' }));
}
`,
  giai: '// Reference solution\n' + nguon(classifySql),
  cases: [
    { goi: goi('classifySql', 'CREATE TABLE note_shares (id serial PRIMARY KEY, note_id int NOT NULL, created_at timestamptz NOT NULL DEFAULT now());\nCREATE INDEX note_shares_note_idx ON note_shares(note_id);'), moTa: ['A new table and an index', 'Một bảng mới và một index'] },
    { goi: goi('classifySql', 'ALTER TABLE notes ADD COLUMN published_at timestamp;\nALTER TABLE notes DROP COLUMN legacy_slug;'), moTa: ['A time type and a drop', 'Một kiểu thời gian và một lệnh xoá'] },
    { goi: goi('classifySql', 'alter table notes   rename column body to content;\nALTER TABLE notes ALTER COLUMN views TYPE bigint;\nUPDATE notes SET status = \'draft\';\nUPDATE notes SET status = \'draft\' WHERE status IS NULL;\nDELETE FROM sessions;\nALTER TABLE events ADD COLUMN at timestamp with time zone;;'), an: true },
    { goi: goi('classifySql', 'DROP INDEX IF EXISTS old_idx;'), an: true },
  ],
});

export default modul('nodejs-18-5-quyet-dinh-kho-dao-nguoc', '18.5 Decisions you cannot take back', [E1, E2, E4, E3, E5]);
