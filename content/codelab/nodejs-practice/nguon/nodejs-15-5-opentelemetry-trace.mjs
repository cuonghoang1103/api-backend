/** Node.js 15.5 — Trace: span, cây span, traceparent, hình dạng N+1, thời gian tự thân, bẫy của OpenTelemetry 3.x, giá của tracing. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Spans, the three silent traps, and what sampling really saves', kho: 'EASY', phut: 8,
  en: 'Questions on lesson 15.5. (The import-order fact was re-run on Node 22: a static import placed AFTER a console.log still runs BEFORE it.)',
  vi: 'Câu hỏi về bài 15.5. (Chuyện thứ tự import đã chạy lại trên Node 22: một import tĩnh đặt SAU console.log vẫn chạy TRƯỚC nó.)',
  cau: [
    q('c1', ['tracing.mjs calls sdk.start() on line 1 and the file has import express from "express" further down. Only 2 spans arrive, no express or pg spans, no error. Why?', 'tracing.mjs gọi sdk.start() ở dòng 1 và tệp có import express from "express" ở dưới. Chỉ 2 span tới, không có span express hay pg, không lỗi. Vì sao?'],
      ['Static imports are hoisted: express and pg were loaded before sdk.start() could patch them', 'The exporter drops spans whose name does not start with “http”, so express spans vanish', 'OpenTelemetry needs a restart of PostgreSQL to see its queries for the first time', 'Express 5 removed the hooks OpenTelemetry uses, so only manual spans can be recorded'],
      ['Every import at the top level runs before line 1 of your code. Fix: await import("express") after sdk.start(), or node --import ./tracing.mjs app.js.', 'Mọi import cấp cao nhất chạy trước dòng 1 của mã bạn. Sửa: await import("express") sau sdk.start(), hoặc node --import ./tracing.mjs app.js.']),
    q('c2', ['A guide writes new NodeSDK({ spanProcessor: new BatchSpanProcessor(exporter) }). With sdk-node 0.301, what happens?', 'Một hướng dẫn viết new NodeSDK({ spanProcessor: new BatchSpanProcessor(exporter) }). Với sdk-node 0.301 chuyện gì xảy ra?'],
      ['0 spans reach the exporter and nothing reports an error', 'npm refuses to install the package with an ERESOLVE error', 'Spans are exported twice, once per processor', 'The SDK throws “unknown option spanProcessor” at start'],
      ['3.x expects spanProcessors: [ new BatchSpanProcessor({ exporter }) ] — plural, and an object. The old shapes are silently ignored. Pin the versions of the example you copy.', '3.x cần spanProcessors: [ new BatchSpanProcessor({ exporter }) ] — số nhiều, và một object. Các dạng cũ bị bỏ qua âm thầm. Ghim phiên bản của ví dụ bạn chép.']),
    q('c3', ['Your manual span service.listNotes ends up with 0 children; the pg spans sit beside it. What did the code forget?', 'Span tự tạo service.listNotes có 0 con; các span pg nằm bên cạnh nó. Mã đã quên gì?'],
      ['context.with(trace.setSpan(context.active(), span), fn) around the work', 'span.setAttribute("notes.count", n) before the first query', 'A ParentBasedSampler, so children inherit the sampling decision', 'span.end() in a finally block, so the span is closed on errors'],
      ['startSpan() creates a span that is NOT active, so every child created inside attaches to the wrong parent. The tree comes out flat — all the right spans, none of the nesting.', 'startSpan() tạo span KHÔNG hoạt động, nên mọi span con tạo bên trong gắn nhầm cha. Cây ra phẳng — đủ span, mất hết lồng nhau.']),
    q('c4', ['OpenTelemetry cost −17.6% req/s. Sampler 0.01 exported 73× fewer spans. What happened to throughput and memory?', 'OpenTelemetry làm giảm 17,6% req/s. Sampler 0.01 xuất ít hơn 73 lần span. Thông lượng và bộ nhớ ra sao?'],
      ['Throughput moved about 3.4%, memory did not move (209 → 208 MB)', 'Throughput returned to the baseline, because no spans are built any more', 'Memory fell by 80 MB, because the SDK unloads unused instrumentation', 'Both got worse, because the sampler itself is the expensive part'],
      ['Every library call is still patched and context still propagated; only recording and exporting are skipped. Sampling saves the bill and the bandwidth, not the CPU.', 'Mọi lời gọi thư viện vẫn bị vá và ngữ cảnh vẫn được truyền; chỉ phần ghi và xuất bị bỏ. Lấy mẫu tiết kiệm hoá đơn và băng thông, không tiết kiệm CPU.']),
    qn('c5', ['A request crosses 3 services. Which statements are true? (choose all that apply)', 'Một request đi qua 3 dịch vụ. Những câu nào đúng? (chọn mọi câu đúng)'],
      ['With a bare 10% ratio sampler in each service it is fully recorded about 1 time in 1,000', 'With ParentBasedSampler the entry decides once and every service follows', 'The trace id travels between the services in the traceparent header', 'A user.id span attribute creates one new time series per user'],
      [0, 1, 2],
      ['0.1³ = 0.001: independent decisions produce fragments. new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(0.1) }). Span attributes have no cardinality limit (but never secrets).', '0,1³ = 0,001: quyết định độc lập sinh ra mảnh vụn. new ParentBasedSampler({ root: new TraceIdRatioBasedSampler(0.1) }). Thuộc tính span không có giới hạn cardinality (nhưng không bao giờ chứa bí mật).']),
  ],
  goiY: [['When does an imported module run, relative to the importing file’s first line?', 'Một module được import chạy lúc nào so với dòng đầu của tệp import nó?'], ['Separate “what is patched” from “what is recorded”.', 'Tách “cái gì bị vá” khỏi “cái gì được ghi”.']],
  loi: [['Concluding “tracing does not work” when the SDK simply started after the imports.', 'Kết luận “tracing không chạy” khi SDK chỉ đơn giản là khởi động sau các import.'], ['Expecting sampling to fix a p95 that doubled with tracing on.', 'Mong lấy mẫu sửa được p95 tăng gấp đôi khi bật tracing.']],
  tns: [tn('span', 'span', 'a named, timed interval with attributes'), tn('trace', 'trace', 'the span tree of one request, joined by trace_id'), tn('context propagation', 'truyền ngữ cảnh'), tn('sampler', 'bộ lấy mẫu')],
  kn: ['tracing', 'OpenTelemetry', 'ES modules'],
});

function parseTraceparent(header) {
  // W3C Trace Context: version-traceid-parentid-flags, chữ thường hex, đúng độ dài.
  if (typeof header !== 'string') return null;
  const m = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/.exec(header.trim());
  if (!m) return null;
  const [, version, traceId, parentId, flags] = m;
  if (version === 'ff') return null;                                   // phiên bản bị cấm
  if (/^0+$/.test(traceId) || /^0+$/.test(parentId)) return null;      // toàn số 0 = không hợp lệ
  return { traceId, parentId, sampled: (parseInt(flags, 16) & 1) === 1 };
}
const E2 = await jsBai({
  ten: 'parseTraceparent(header): read the header that carries a trace between services', kho: 'MEDIUM', phut: 12,
  en: '<p>Context propagation between processes uses the W3C <code>traceparent</code> header: <code>00-&lt;trace-id&gt;-&lt;parent-id&gt;-&lt;flags&gt;</code>, e.g. <code>00-da3c8ecc0f6a4d1b9e2f7a1c3b5d7e90-3d6c53080ac3f634-01</code>. Write <code>parseTraceparent(header)</code> returning <code>{ traceId, parentId, sampled }</code>, or <code>null</code> when the header is invalid. Valid means: exactly four dash-separated fields of <b>lower-case</b> hex — version 2 chars (not <code>ff</code>), trace id 32, parent id 16, flags 2; trace id and parent id not all zeros; surrounding spaces may be trimmed. <code>sampled</code> is bit 0 of the flags (<code>01</code> → true).</p>',
  vi: '<p>Truyền ngữ cảnh giữa các tiến trình dùng header W3C <code>traceparent</code>: <code>00-&lt;trace-id&gt;-&lt;parent-id&gt;-&lt;flags&gt;</code>, vd <code>00-da3c8ecc0f6a4d1b9e2f7a1c3b5d7e90-3d6c53080ac3f634-01</code>. Viết <code>parseTraceparent(header)</code> trả về <code>{ traceId, parentId, sampled }</code>, hoặc <code>null</code> khi header không hợp lệ. Hợp lệ nghĩa là: đúng bốn trường phân tách bằng gạch ngang, hex <b>chữ thường</b> — version 2 ký tự (khác <code>ff</code>), trace id 32, parent id 16, flags 2; trace id và parent id không toàn số 0; khoảng trắng hai đầu được cắt. <code>sampled</code> là bit 0 của flags (<code>01</code> → true).</p>',
  goiY: [['One anchored regex with four capture groups does most of the work.', 'Một regex neo hai đầu với bốn nhóm bắt làm gần hết việc.'], ['parseInt(flags, 16) & 1 gives the sampled bit; /^0+$/ detects all zeros.', 'parseInt(flags, 16) & 1 cho bit sampled; /^0+$/ phát hiện toàn số 0.']],
  loi: [['Splitting on "-" and trusting the pieces: an upper-case or 31-char id slips through and breaks the trace in the next service.', 'Tách theo "-" rồi tin các mảnh: id viết hoa hay dài 31 ký tự lọt qua và làm gãy trace ở dịch vụ sau.'], ['Treating flags "00" as invalid: it is valid, it just means “not sampled”.', 'Coi flags "00" là không hợp lệ: nó hợp lệ, chỉ nghĩa là “không lấy mẫu”.']],
  gt: ['traceparent is what lets one trace_id join the spans of several services — lesson 15.2’s request id one level up. An inbound header is attacker-controlled; when it is invalid the receiver must start a new trace instead of propagating garbage.', 'traceparent là thứ cho phép một trace_id nối các span của nhiều dịch vụ — request id của bài 15.2 nâng lên một tầng. Header gửi tới do kẻ tấn công kiểm soát; khi không hợp lệ, bên nhận phải bắt đầu trace mới thay vì truyền rác đi tiếp.'],
  kn: ['tracing', 'W3C Trace Context', 'regex'],
  tns: [tn('traceparent', 'traceparent', 'W3C header: version-trace-parent-flags'), tn('trace flags', 'cờ trace', 'bit 0 = sampled')],
  dau: `/** parse a W3C traceparent header */
function parseTraceparent(header) {
  // Write your solution here
  const [version, traceId, parentId, flags] = String(header).split('-');
  return { traceId, parentId, sampled: flags === '01' };
}
`,
  giai: '// Reference solution\n' + nguon(parseTraceparent),
  cases: [
    { goi: goi('parseTraceparent', '00-da3c8ecc0f6a4d1b9e2f7a1c3b5d7e90-3d6c53080ac3f634-01'), moTa: ['A sampled trace', 'Một trace được lấy mẫu'] },
    { goi: goi('parseTraceparent', 'garbage'), moTa: ['Not a traceparent at all', 'Không phải traceparent'] },
    { goi: goi('parseTraceparent', '00-DA3C8ECC0F6A4D1B9E2F7A1C3B5D7E90-3d6c53080ac3f634-01'), an: true },
    { goi: goi('parseTraceparent', '00-00000000000000000000000000000000-3d6c53080ac3f634-01'), an: true },
    { goi: goi('parseTraceparent', ' 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00 '), an: true },
    { goi: goi('parseTraceparent', 'ff-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'), an: true },
    { goi: goi('parseTraceparent', '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b-01'), an: true },
  ],
});

function buildTree(spans) {
  // Danh sách phẳng ⇒ cây: mỗi span gắn vào cha theo parentId; không có cha (hoặc cha không có trong danh sách) ⇒ gốc.
  const nodes = new Map(spans.map((s) => [s.id, { name: s.name, ms: Number((s.end - s.start).toFixed(2)), start: s.start, children: [] }]));
  const roots = [];
  for (const s of spans) {
    const n = nodes.get(s.id);
    const p = s.parentId ? nodes.get(s.parentId) : undefined;
    (p ? p.children : roots).push(n);
  }
  const tidy = (list) => list.sort((a, b) => a.start - b.start).map(({ name, ms, children }) => ({ name, ms, children: tidy(children) }));
  return tidy(roots);
}
const SP = [
  { id: 'a', name: 'GET /notes/:author', start: 0, end: 41.8 },
  { id: 'b', parentId: 'a', name: 'request handler - /notes/:author', start: 0.5, end: 41.2 },
  { id: 'd', parentId: 'b', name: 'pg.query', start: 26, end: 30.1 },
  { id: 'c', parentId: 'b', name: 'pg-pool.connect', start: 1, end: 25.47 },
  { id: 'e', parentId: 'c', name: 'tcp.connect', start: 2, end: 9 },
  { id: 'f', parentId: 'b', name: 'pg.query', start: 31, end: 33.5 },
];
const E3 = await jsBai({
  ten: 'buildTree(spans): from the exporter’s flat list to the tree you can diagnose', kho: 'MEDIUM', phut: 14,
  en: '<p>An exporter receives spans as a flat list <code>{ id, parentId?, name, start, end }</code> (times in ms). Write <code>buildTree(spans)</code> returning an array of root nodes <code>{ name, ms, children }</code>, where <code>ms = end − start</code> rounded to 2 decimals (<code>Number(x.toFixed(2))</code>). A span is a root when it has no <code>parentId</code> or its parent is not in the list. Children (and roots) are ordered by <code>start</code>. The input may list children before their parents.</p>',
  vi: '<p>Exporter nhận span dạng danh sách phẳng <code>{ id, parentId?, name, start, end }</code> (thời gian tính bằng ms). Viết <code>buildTree(spans)</code> trả về mảng nút gốc <code>{ name, ms, children }</code>, với <code>ms = end − start</code> làm tròn 2 chữ số (<code>Number(x.toFixed(2))</code>). Một span là gốc khi không có <code>parentId</code> hoặc cha không có trong danh sách. Con (và gốc) được sắp theo <code>start</code>. Đầu vào có thể liệt kê con trước cha.</p>',
  goiY: [['Two passes: first create every node in a Map by id, then attach each one to its parent.', 'Hai lượt: tạo mọi nút vào một Map theo id trước, rồi gắn từng nút vào cha.'], ['Sort recursively at the end and drop the helper field start from the output.', 'Sắp đệ quy ở cuối và bỏ trường phụ start khỏi kết quả.']],
  loi: [['Attaching in one pass in input order: a child listed before its parent is lost or becomes a root.', 'Gắn trong một lượt theo thứ tự đầu vào: con đứng trước cha bị mất hoặc thành gốc.'], ['Sorting the flat list by time and calling it a trace: every shape the lesson diagnoses (N+1, cold pool, gaps) is only visible as a tree.', 'Sắp danh sách phẳng theo thời gian rồi gọi đó là trace: mọi hình dạng bài chẩn đoán (N+1, pool nguội, khoảng trống) chỉ thấy được khi là cây.']],
  gt: ['A trace is a tree, not a list: parent/child nesting is what turns 33 spans into a diagnosis. In the sample, pg-pool.connect (24.47 ms) with tcp.connect inside it is the cold-pool tax of chapter 7, visible as its own block instead of smeared into the total.', 'Trace là cây, không phải danh sách: lồng cha/con là thứ biến 33 span thành một chẩn đoán. Trong mẫu, pg-pool.connect (24,47 ms) chứa tcp.connect là “thuế pool nguội” của chương 7, hiện thành một khối riêng thay vì bị trộn vào tổng.'],
  kn: ['tracing', 'trees', 'Map'],
  tns: [tn('root span', 'span gốc'), tn('parent / child', 'cha / con')],
  dau: `/** flat spans -> tree */
function buildTree(spans) {
  // Write your solution here
  const out = [];
  const byId = {};
  for (const s of spans) {
    const node = { name: s.name, ms: s.end - s.start, children: [] };
    byId[s.id] = node;
    if (s.parentId && byId[s.parentId]) byId[s.parentId].children.push(node);
    else out.push(node);
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(buildTree),
  cases: [
    { goi: goi('buildTree', SP), moTa: ['The cold first request, children listed out of order', 'Request đầu (pool nguội), con liệt kê lộn xộn'] },
    { goi: goi('buildTree', [{ id: 'x', name: 'GET /a', start: 0, end: 3 }]), moTa: ['One span', 'Một span'] },
    { goi: goi('buildTree', [...SP].reverse()), an: true },
    { goi: goi('buildTree', [{ id: 'k', parentId: 'gone', name: 'orphan', start: 5, end: 6.333 }, { id: 'r', name: 'GET /b', start: 1, end: 2 }]), an: true },
  ],
});

function findNPlusOne(spans, min) {
  // Hình dạng N+1: dưới CÙNG một cha có ≥ min span con trùng tên. Không câu nào chậm — vấn đề là SỐ LƯỢNG.
  const byId = new Map(spans.map((s) => [s.id, s]));
  const groups = new Map();
  for (const s of spans) {
    if (!s.parentId || !byId.has(s.parentId)) continue;
    const k = `${s.parentId}\u0000${s.name}`;
    const g = groups.get(k) || { parent: byId.get(s.parentId).name, name: s.name, count: 0, totalMs: 0, worstMs: 0 };
    const d = s.end - s.start;
    g.count++; g.totalMs += d; g.worstMs = Math.max(g.worstMs, d);
    groups.set(k, g);
  }
  return [...groups.values()]
    .filter((g) => g.count >= min)
    .map((g) => ({ ...g, totalMs: Number(g.totalMs.toFixed(2)), worstMs: Number(g.worstMs.toFixed(2)) }))
    .sort((a, b) => b.count - a.count);
}
const nq = (n, parent, d0) => Array.from({ length: n }, (_, i) => ({ id: `${parent}q${i}`, parentId: parent, name: 'pg.query', start: 10 + i * 6, end: 10 + i * 6 + d0 + (i % 3) }));
const AUTHOR = [{ id: 'h', name: 'request handler - /notes/:author', start: 0, end: 86.21 }, { id: 'u', parentId: 'h', name: 'pg.query', start: 1, end: 4 }, ...nq(11, 'h', 3.32)];
const E4 = await jsBai({
  ten: 'findNPlusOne(spans, min): many short identical children — the shape is the diagnosis', kho: 'MEDIUM', phut: 15,
  en: '<p>Nobody wrote code to detect N+1 in the lesson: the 12 <code>pg.query</code> spans under one request were visible by their shape, while the worst single query was 6.32 ms (a slow-query log at 100 ms reports nothing). Write <code>findNPlusOne(spans, min)</code>: group spans that have a parent in the list by <b>(parent, name)</b>; return every group with at least <code>min</code> spans as <code>{ parent: &lt;parent name&gt;, name, count, totalMs, worstMs }</code> (durations <code>end − start</code>, sums and maxima rounded with <code>Number(x.toFixed(2))</code>), sorted by <code>count</code> descending.</p>',
  vi: '<p>Trong bài không ai viết mã phát hiện N+1: 12 span <code>pg.query</code> dưới một request hiện ra nhờ hình dạng, còn câu chậm nhất chỉ 6,32 ms (log truy vấn chậm ngưỡng 100 ms không báo gì). Viết <code>findNPlusOne(spans, min)</code>: nhóm các span có cha trong danh sách theo <b>(cha, tên)</b>; trả về mọi nhóm có ít nhất <code>min</code> span dạng <code>{ parent: &lt;tên cha&gt;, name, count, totalMs, worstMs }</code> (thời lượng <code>end − start</code>, tổng và lớn nhất làm tròn bằng <code>Number(x.toFixed(2))</code>), sắp theo <code>count</code> giảm dần.</p>',
  goiY: [['The group key is parentId + name: the same name under two different parents is two groups.', 'Khoá nhóm là parentId + tên: cùng tên dưới hai cha khác nhau là hai nhóm.'], ['Accumulate count, total and worst in one pass, round only at the end.', 'Cộng dồn count, tổng và lớn nhất trong một lượt, chỉ làm tròn ở cuối.']],
  loi: [['Looking for slow spans: N+1 hides precisely because each query is fast.', 'Đi tìm span chậm: N+1 trốn được chính vì từng câu đều nhanh.'], ['Counting by name across the whole trace: 12 queries spread over 12 different requests is not N+1.', 'Đếm theo tên trên toàn trace: 12 câu rải trên 12 request khác nhau không phải N+1.']],
  gt: ['Four shapes, four fixes: many short identical children = N+1 (batch with = ANY($1) or an include); one long child = one slow thing; a gap with no child = your own CPU work; a long connect at the top = cold pool. Counting identical siblings is the first of these, made automatic.', 'Bốn hình dạng, bốn cách sửa: nhiều con ngắn giống nhau = N+1 (gộp bằng = ANY($1) hoặc include); một con dài = một thứ chậm; khoảng trống không con = việc CPU của chính bạn; connect dài ở đầu = pool nguội. Đếm anh em giống nhau là cái đầu tiên, được tự động hoá.'],
  kn: ['tracing', 'N+1', 'grouping'],
  tns: [tn('N+1', 'N+1', 'one query for the list, then one per item'), tn('sibling spans', 'span anh em', 'children of the same parent')],
  dau: `/** find N+1 shapes */
function findNPlusOne(spans, min) {
  // Write your solution here — this reports SLOW queries instead
  return spans.filter((s) => s.end - s.start > 100).map((s) => ({ parent: s.parentId, name: s.name, count: 1, totalMs: s.end - s.start, worstMs: s.end - s.start }));
}
`,
  giai: '// Reference solution\n' + nguon(findNPlusOne),
  cases: [
    { goi: goi('findNPlusOne', AUTHOR, 5), moTa: ['GET /notes/:author: 12 queries under one handler', 'GET /notes/:author: 12 câu dưới một handler'] },
    { goi: goi('findNPlusOne', SP, 5), moTa: ['A healthy request: no group of 5', 'Request khoẻ: không nhóm nào đủ 5'] },
    { goi: goi('findNPlusOne', [...AUTHOR, { id: 'r2', name: 'GET /feed', start: 0, end: 30 }, ...nq(6, 'r2', 0.6), ...Array.from({ length: 6 }, (_, i) => ({ id: `rd${i}`, parentId: 'r2', name: 'redis.get', start: i, end: i + 0.25 }))], 6), an: true },
    { goi: goi('findNPlusOne', [], 2), an: true },
  ],
});

function selfTime(spans) {
  // Thời gian tự thân = thời lượng − phần HỢP của các khoảng con (cắt trong khoảng của cha).
  // Con chạy song song chồng lên nhau chỉ tính một lần — đó là lý do phải lấy hợp, không cộng.
  const out = {};
  for (const s of spans) {
    const kids = spans.filter((k) => k.parentId === s.id)
      .map((k) => [Math.max(k.start, s.start), Math.min(k.end, s.end)])
      .filter(([a, b]) => b > a)
      .sort((x, y) => x[0] - y[0]);
    let covered = 0;
    let curA = null;
    let curB = null;
    for (const [a, b] of kids) {
      if (curB === null || a > curB) { if (curB !== null) covered += curB - curA; curA = a; curB = b; }
      else curB = Math.max(curB, b);
    }
    if (curB !== null) covered += curB - curA;
    out[s.id] = Number((s.end - s.start - covered).toFixed(2));
  }
  return out;
}
const E5 = await jsBai({
  ten: 'selfTime(spans): find the gap with no child — time spent in your own code', kho: 'HARD', phut: 20,
  en: '<p>One of the four shapes is “a gap with no child”: time inside a span that no child explains — CPU work, JSON, a blocking call — so you profile it (16.1). Write <code>selfTime(spans)</code> returning <code>{ [id]: selfMs }</code> for every span: its duration minus the length of the <b>union</b> of its direct children’s intervals, each child clipped to the parent’s own interval. Children that run in parallel and overlap count once. Round with <code>Number(x.toFixed(2))</code>.</p>',
  vi: '<p>Một trong bốn hình dạng là “khoảng trống không có con”: thời gian bên trong một span mà không span con nào giải thích — việc CPU, JSON, một lời gọi chặn — nên phải profile nó (16.1). Viết <code>selfTime(spans)</code> trả về <code>{ [id]: selfMs }</code> cho mọi span: thời lượng của nó trừ độ dài phần <b>hợp</b> các khoảng của con trực tiếp, mỗi con bị cắt trong khoảng của cha. Con chạy song song chồng nhau chỉ tính một lần. Làm tròn bằng <code>Number(x.toFixed(2))</code>.</p>',
  goiY: [['Collect each span’s children as [start, end] pairs clipped to the parent, sort by start, then merge overlapping pairs.', 'Gom con của mỗi span thành cặp [start, end] đã cắt theo cha, sắp theo start, rồi gộp các cặp chồng nhau.'], ['Merging: keep a current interval; a pair starting after its end closes it, otherwise extend the end with Math.max.', 'Gộp: giữ một khoảng hiện tại; cặp bắt đầu sau điểm cuối của nó thì đóng lại, không thì kéo dài điểm cuối bằng Math.max.']],
  loi: [['Subtracting the SUM of children: Promise.all children overlap, so the sum exceeds the parent and self time goes negative.', 'Trừ TỔNG thời lượng con: các con của Promise.all chồng nhau, nên tổng vượt cha và thời gian tự thân thành âm.'], ['Subtracting grandchildren too: they are already inside their own parent’s interval.', 'Trừ cả cháu: chúng đã nằm trong khoảng của cha chúng rồi.']],
  gt: ['Self time is what a CPU profile’s “self” column means, computed from a trace. A route handler with 40 ms of self time and three short queries is not a database problem: the time is in your own code, and no amount of query tuning will move it.', 'Thời gian tự thân chính là cột “self” của CPU profile, tính từ trace. Một handler có 40 ms tự thân và ba câu truy vấn ngắn không phải vấn đề CSDL: thời gian nằm trong mã của bạn, và tối ưu truy vấn bao nhiêu cũng không xê dịch nó.'],
  kn: ['tracing', 'intervals', 'profiling'],
  tns: [tn('self time', 'thời gian tự thân', 'time in the span itself, not in its children'), tn('interval union', 'hợp các khoảng')],
  dau: `/** self time of every span */
function selfTime(spans) {
  // Write your solution here
  const out = {};
  for (const s of spans) {
    const kids = spans.filter((k) => k.parentId === s.id);
    const sum = kids.reduce((t, k) => t + (k.end - k.start), 0);
    out[s.id] = s.end - s.start - sum;
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(selfTime),
  cases: [
    { goi: goi('selfTime', [{ id: 'h', name: 'handler', start: 0, end: 50 }, { id: 'q1', parentId: 'h', name: 'pg.query', start: 2, end: 6 }, { id: 'q2', parentId: 'h', name: 'pg.query', start: 7, end: 10 }]), moTa: ['43 ms not explained by any query', '43 ms không câu truy vấn nào giải thích'] },
    { goi: goi('selfTime', [{ id: 'h', name: 'handler', start: 0, end: 20 }, { id: 'a', parentId: 'h', name: 'redis.get', start: 1, end: 11 }, { id: 'b', parentId: 'h', name: 'pg.query', start: 2, end: 12 }, { id: 'c', parentId: 'h', name: 'fetch', start: 3, end: 9 }]), moTa: ['Promise.all: three overlapping children', 'Promise.all: ba con chồng nhau'] },
    { goi: goi('selfTime', SP), an: true },
    { goi: goi('selfTime', [{ id: 'p', name: 'p', start: 10, end: 20 }, { id: 'k', parentId: 'p', name: 'late', start: 15, end: 30 }, { id: 'g', parentId: 'k', name: 'grand', start: 16, end: 29 }]), an: true },
  ],
});

export default modul('nodejs-15-5-opentelemetry-trace', '15.5 Tracing with OpenTelemetry: trees, shapes, traceparent', [E1, E2, E3, E4, E5]);
