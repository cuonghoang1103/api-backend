/** Node.js 18.4 — Khối nguyên hay tách dịch vụ: 2,0 ns vs 0,072 ms, ba tín hiệu sống sót qua phép đo, khối nguyên mô-đun (facade + chủ bảng), trạng thái thất bại một phần. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'What splitting buys, and the bill', kho: 'EASY', phut: 6,
  en: 'Questions on lesson 18.4.',
  vi: 'Câu hỏi về bài 18.4.',
  cau: [
    q('c1', ['Two reasons people often give for splitting: “deploys are risky” and “the code is hard to understand”. What does splitting do to them?', 'Hai lý do người ta hay đưa ra để tách: “deploy rủi ro” và “mã khó hiểu”. Tách làm gì với chúng?'],
      ['Neither: one deploy becomes several ordered ones, and confusing code spreads over six repos', 'Both are fixed, because each service is smaller, simpler and deploys on its own', 'Deploys get safer because each one is smaller, but the code stays as hard to read', 'The code gets easier to read, but every deploy becomes riskier than it was before'],
      ['Scary deploys have chapter 17’s smoke test and rollback; confusing code has the layers and facades of 18.1–18.3. Team frustration is a symptom, not a signal.', 'Deploy đáng sợ đã có smoke test và quay lui của chương 17; mã khó hiểu đã có tầng và facade của 18.1–18.3. Sự bực bội của nhóm là triệu chứng, không phải tín hiệu.']),
    q('c2', ['Inside one bank money moves or it does not. Between two banks there is a moment when it has left one and not reached the other. What is the software version?', 'Trong một ngân hàng, tiền chuyển hoặc không. Giữa hai ngân hàng có lúc tiền đã rời một bên mà chưa tới bên kia. Phiên bản phần mềm là gì?'],
      ['No transaction across two services: a state like “paid, but stock not reserved” must be designed for', 'A slower database, because two services share its connections', 'A longer deploy, because both services must be released together', 'A bigger image, because both services include the same libraries'],
      ['Idempotency, compensation, reconciliation. Chapter 13 met it once: a non-idempotent job retried 3 times charged 300,000 VND instead of 100,000.', 'Idempotency, bù trừ, đối soát. Chương 13 đã gặp một lần: một job không idempotent thử lại 3 lần tính 300.000 đồng thay vì 100.000.']),
    q('c3', ['Which one is the middle option between one file and twelve services?', 'Đâu là lựa chọn ở giữa một tệp và mười hai dịch vụ?'],
      ['A modular monolith: one deploy, narrow facades enforced by lint, tables with owners', 'A distributed monolith: services that share one database', 'Serverless functions, one per route, sharing one schema', 'A monorepo with one folder per team and no rules'],
      ['You keep transactions, JOINs and nanosecond calls, and a later split becomes a change of transport, not a rewrite — if tables have owners.', 'Bạn giữ transaction, JOIN và lời gọi tính bằng nano giây, và lần tách sau này chỉ là đổi đường truyền, không phải viết lại — nếu bảng có chủ.']),
    qn('c4', ['Which statements about the website are true? (choose all that apply)', 'Những câu nào về website là đúng? (chọn mọi câu đúng)'],
      ['7 containers, one backend process, one database, one VPS — correct on all three signals', 'embedQueue.service.ts is an in-process array queue that a second process would break', 'The 40 cron jobs share a per-process flag, so a second process would run each twice', 'It should split into services because it has 608 models'],
      [0, 1, 2],
      ['Useful boundaries already exist (R2 for files, Redis for shared state, external APIs for payments and AI), each adopted because something concrete required it. “The codebase is big” is not a signal.', 'Các ranh giới hữu ích đã có sẵn (R2 cho tệp, Redis cho trạng thái chung, API ngoài cho thanh toán và AI), mỗi cái được dùng vì có thứ cụ thể đòi hỏi. “Mã nguồn lớn” không phải tín hiệu.']),
  ],
  goiY: [['Count what each boundary costs per call.', 'Đếm giá mỗi lời gọi qua ranh giới.'], ['Ask which part needs a different number of cores, a different release day, or a different team.', 'Hỏi phần nào cần số nhân khác, ngày phát hành khác, hay một nhóm khác.']],
  loi: [['Splitting because “it scales”: for I/O-bound work more processes bought +6.7%.', 'Tách vì “nó mở rộng được”: với việc I/O, thêm tiến trình chỉ được +6,7%.'], ['Ignoring the partial-failure state until it happens in production.', 'Lờ trạng thái thất bại một phần cho tới khi nó xảy ra trên production.']],
  tns: [tn('monolith', 'khối nguyên'), tn('modular monolith', 'khối nguyên mô-đun'), tn('Conway’s law', 'định luật Conway', 'systems mirror the organisation that builds them')],
  kn: ['architecture', 'microservices'],
});

function boundaryCost(callsPerRequest, inProcNs, httpMs, rps) {
  // Mỗi lời gọi qua tiến trình khác thay 2 ns bằng ~0,07 ms (loopback, keep-alive) — trước khi tính mạng thật, TLS, lỗi.
  const extraMs = callsPerRequest * (httpMs - inProcNs / 1e6);
  return {
    ratio: Math.round((httpMs * 1e6) / inProcNs),
    addedMsPerRequest: Number(extraMs.toFixed(3)),
    addedCpuSecPerSec: Number(((extraMs * rps) / 1000).toFixed(2)),   // thời gian chờ mạng nhân lưu lượng: bao nhiêu "giây" mỗi giây
  };
}
const E2 = await jsBai({
  ten: 'boundaryCost(calls, inProcNs, httpMs, rps): a function call vs the same call over HTTP', kho: 'EASY', phut: 7,
  en: '<p>Measured: “price a note” in the same process 2.0 ns; in another process over HTTP on loopback 0.072 ms with keep-alive, 0.177 ms with a new connection. Write <code>boundaryCost(callsPerRequest, inProcNs, httpMs, rps)</code> returning <code>{ ratio, addedMsPerRequest, addedCpuSecPerSec }</code>: <code>ratio</code> = HTTP time ÷ in-process time (same unit), rounded to an integer; <code>addedMsPerRequest</code> = calls × (httpMs − inProcNs / 10<sup>6</sup>), 3 decimals; <code>addedCpuSecPerSec</code> = that × rps ÷ 1000, 2 decimals (seconds of added latency per second of traffic).</p>',
  vi: '<p>Đo được: “tính giá một ghi chú” trong cùng tiến trình 2,0 ns; ở tiến trình khác qua HTTP trên loopback 0,072 ms với keep-alive, 0,177 ms với kết nối mới. Viết <code>boundaryCost(callsPerRequest, inProcNs, httpMs, rps)</code> trả về <code>{ ratio, addedMsPerRequest, addedCpuSecPerSec }</code>: <code>ratio</code> = thời gian HTTP ÷ thời gian trong tiến trình (cùng đơn vị), làm tròn thành số nguyên; <code>addedMsPerRequest</code> = số lời gọi × (httpMs − inProcNs / 10<sup>6</sup>), 3 chữ số; <code>addedCpuSecPerSec</code> = giá trị đó × rps ÷ 1000, 2 chữ số (số giây độ trễ thêm vào mỗi giây lưu lượng).</p>',
  goiY: [['1 ms = 1,000,000 ns.', '1 ms = 1.000.000 ns.'], ['Round only the returned values.', 'Chỉ làm tròn các giá trị trả về.']],
  loi: [['Comparing ms with ns directly: the ratio comes out a million times too small.', 'So ms với ns trực tiếp: tỉ lệ nhỏ đi một triệu lần.'], ['Forgetting that this is loopback: a real network, TLS and a second machine only add to it.', 'Quên rằng đây là loopback: mạng thật, TLS và máy thứ hai chỉ cộng thêm.']],
  gt: ['Every process boundary costs about 10⁴–10⁵ times a function call (0.072 ms vs 2.0 ns), before any failure handling. Ten calls per request at 1,000 req/s add 0.72 s of waiting every second — and from then on every one of those calls can fail.', 'Mỗi ranh giới tiến trình tốn khoảng 10⁴–10⁵ lần một lời gọi hàm (0,072 ms so với 2,0 ns), chưa tính xử lý lỗi. Mười lời gọi mỗi request ở 1.000 req/s thêm 0,72 s chờ mỗi giây — và từ đó mỗi lời gọi đều có thể hỏng.'],
  kn: ['architecture', 'latency'],
  tns: [tn('loopback', 'loopback', '127.0.0.1: no real network')],
  dau: `/** the cost of a process boundary */
function boundaryCost(callsPerRequest, inProcNs, httpMs, rps) {
  // Write your solution here
  return { ratio: Math.round(httpMs / inProcNs), addedMsPerRequest: callsPerRequest * httpMs, addedCpuSecPerSec: callsPerRequest * httpMs * rps };
}
`,
  giai: '// Reference solution\n' + nguon(boundaryCost),
  cases: [
    { goi: goi('boundaryCost', 1, 2.0, 0.072, 1000), moTa: ['One call, keep-alive', 'Một lời gọi, keep-alive'] },
    { goi: goi('boundaryCost', 10, 2.0, 0.072, 1000), moTa: ['Ten calls per request', 'Mười lời gọi mỗi request'] },
    { goi: goi('boundaryCost', 3, 2.0, 0.177, 500), an: true },
    { goi: goi('boundaryCost', 0, 2.0, 0.072, 1000), an: true },
  ],
});

const E3 = cs({
  ten: 'Split, or not? The three signals that survive measurement', kho: 'MEDIUM', phut: 7, loai: 'table',
  en: 'For each situation, say whether a split is justified and by which signal.',
  vi: 'Với mỗi tình huống, cho biết việc tách có chính đáng không và theo tín hiệu nào.',
  bang: [bang1('b1', ['Decide with numbers', 'Quyết định bằng con số'], [{ ma: 'x', ten: 'Situation' }, { ma: 'd', ten: 'Decision', luaChon: ['do not split', 'split: scaling profile', 'split: release cadence', 'split: teams'] }], [
    { o: { x: 'Two developers, one Notes API, 95% of request time in the database, one release cadence' }, a: { d: 'do not split' } },
    { o: { x: 'Image resizing needs 16 cores and is CPU-bound (idle 3%); the rest of the API needs 2 and waits on the DB' }, a: { d: 'split: scaling profile' } },
    { o: { x: 'The payments part changes quarterly under audit; the rest ships several times a day' }, a: { d: 'split: release cadence' } },
    { o: { x: 'Three teams wait for each other’s deploys and hit merge conflicts every week in the same files' }, a: { d: 'split: teams' } },
    { o: { x: '“The codebase is big” — 900 files, one team, one cadence, I/O-bound' }, a: { d: 'do not split' } },
    { o: { x: '“Deploys are scary” — no smoke test, no immutable tags' }, a: { d: 'do not split' } },
  ], ['Signal 3 (teams) is decisive; the other two are often solvable without splitting. A boundary that matches a team boundary buys independence; one that matches no team is pure cost. Scary deploys and big code have chapter 17 and 18.1–18.3, not a network.', 'Tín hiệu 3 (nhóm) là quyết định; hai tín hiệu kia thường giải được mà không cần tách. Ranh giới trùng ranh giới nhóm thì mua được sự độc lập; ranh giới không trùng nhóm nào là chi phí thuần. Deploy đáng sợ và mã lớn đã có chương 17 và 18.1–18.3, không cần mạng.'])],
  goiY: [['Check with a CPU profile per route, git log per folder, and a count of merge conflicts.', 'Kiểm bằng CPU profile theo route, git log theo thư mục, và đếm số xung đột merge.'], ['None of the signals is “the codebase is big”.', 'Không tín hiệu nào là “mã nguồn lớn”.']],
  loi: [['Splitting to fix risky deploys.', 'Tách để chữa deploy rủi ro.'], ['Splitting an I/O-bound app “to scale”.', 'Tách một app I/O “để mở rộng”.']],
  tns: [tn('release cadence', 'nhịp phát hành')],
  kn: ['architecture'],
});

function facadeViolations({ imports, queries, owners }) {
  // imports: [{ from, to }] đường dẫn tệp "modules/<tên>/…"; queries: [{ module, table }]; owners: { table: module }.
  const mod = (p) => (/^modules\/([^/]+)\//.exec(p) || [])[1];
  const out = [];
  for (const { from, to } of imports) {
    const a = mod(from);
    const b = mod(to);
    // từ module khác chỉ được đi qua facade: modules/<b>/index.js
    if (a && b && a !== b && to !== `modules/${b}/index.js`) out.push(`IMPORT_INTERNAL ${from} -> ${to}`);
  }
  for (const { module, table } of queries) {
    const owner = owners[table];
    if (owner === undefined) out.push(`NO_OWNER ${table}`);
    else if (owner !== module) out.push(`FOREIGN_TABLE ${module} -> ${table} (owner: ${owner})`);
  }
  return [...new Set(out)];
}
const E4 = await jsBai({
  ten: 'facadeViolations({ imports, queries, owners }): the lint rule of a modular monolith', kho: 'HARD', phut: 20,
  en: '<p>Enforce the two walls of a modular monolith. Files of module <code>x</code> live under <code>modules/x/</code>; its facade is <code>modules/x/index.js</code>. <code>imports</code> are <code>{ from, to }</code> file paths, <code>queries</code> are <code>{ module, table }</code> (who queries which table directly), <code>owners</code> maps each table to its owning module. Return, in input order (imports first, then queries), without duplicates:</p><ul><li><code>"IMPORT_INTERNAL &lt;from&gt; -&gt; &lt;to&gt;"</code> — a file of one module imports a file of <b>another</b> module that is not its <code>index.js</code> (paths outside <code>modules/</code> are ignored);</li><li><code>"FOREIGN_TABLE &lt;module&gt; -&gt; &lt;table&gt; (owner: &lt;owner&gt;)"</code> — a module queries a table it does not own;</li><li><code>"NO_OWNER &lt;table&gt;"</code> — a queried table has no owner.</li></ul>',
  vi: '<p>Cưỡng chế hai bức tường của khối nguyên mô-đun. Tệp của module <code>x</code> nằm dưới <code>modules/x/</code>; facade của nó là <code>modules/x/index.js</code>. <code>imports</code> là các đường dẫn tệp <code>{ from, to }</code>, <code>queries</code> là <code>{ module, table }</code> (ai truy vấn trực tiếp bảng nào), <code>owners</code> ánh xạ mỗi bảng ⇒ module sở hữu. Trả về, theo thứ tự đầu vào (imports trước, rồi queries), không trùng:</p><ul><li><code>"IMPORT_INTERNAL &lt;from&gt; -&gt; &lt;to&gt;"</code> — một tệp của một module import một tệp của module <b>khác</b> mà không phải <code>index.js</code> của nó (đường dẫn ngoài <code>modules/</code> được bỏ qua);</li><li><code>"FOREIGN_TABLE &lt;module&gt; -&gt; &lt;table&gt; (owner: &lt;owner&gt;)"</code> — một module truy vấn bảng nó không sở hữu;</li><li><code>"NO_OWNER &lt;table&gt;"</code> — một bảng được truy vấn mà không có chủ.</li></ul>',
  goiY: [['Extract the module name with /^modules\\/([^/]+)\\//.', 'Lấy tên module bằng /^modules\\/([^/]+)\\//.'], ['Imports inside the same module are always allowed; only the cross-module ones must hit index.js.', 'Import trong cùng module luôn được phép; chỉ import chéo module mới phải tới index.js.']],
  loi: [['Folders without the lint rule: “a folder called domain/ that anything can import from is not a boundary; it is a wish”.', 'Thư mục mà không có luật lint: “một thư mục tên domain/ mà gì cũng import được thì không phải ranh giới; chỉ là mong ước”.'], ['Enforcing imports but not tables: every module still reaches into every table, and a later split must be rewritten from scratch.', 'Cưỡng chế import mà không cưỡng chế bảng: mọi module vẫn thò tay vào mọi bảng, và lần tách sau phải viết lại từ đầu.']],
  gt: ['With both walls, only the courses module queries course tables and everyone else asks getCourse(id) through the facade — so a future split is a change of transport (function call → network call), not a rewrite. Measured in 18.3: prisma.user is queried from 57 places, exactly what this rule would forbid.', 'Có cả hai bức tường, chỉ module courses truy vấn bảng course còn mọi bên khác hỏi getCourse(id) qua facade — nên lần tách tương lai chỉ là đổi đường truyền (lời gọi hàm → lời gọi mạng), không phải viết lại. Đo ở 18.3: prisma.user bị truy vấn từ 57 chỗ, đúng thứ luật này cấm.'],
  kn: ['modular monolith', 'lint', 'architecture'],
  tns: [tn('facade', 'mặt tiền (facade)', 'the narrow public entry of a module'), tn('table owner', 'chủ sở hữu bảng')],
  dau: `/** enforce facades and table owners */
function facadeViolations({ imports, queries, owners }) {
  // Write your solution here
  const out = [];
  for (const { from, to } of imports) if (to.includes('/internal/')) out.push('IMPORT_INTERNAL ' + from + ' -> ' + to);
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(facadeViolations),
  cases: [
    { goi: goi('facadeViolations', { imports: [{ from: 'modules/notes/service.js', to: 'modules/courses/index.js' }, { from: 'modules/notes/service.js', to: 'modules/notes/repo.js' }, { from: 'modules/stats/report.js', to: 'modules/notes/repo.js' }], queries: [{ module: 'notes', table: 'note' }, { module: 'stats', table: 'note' }], owners: { note: 'notes', course: 'courses' } }), moTa: ['stats reaches into notes', 'stats thò tay vào notes'] },
    { goi: goi('facadeViolations', { imports: [{ from: 'modules/a/x.js', to: 'modules/b/index.js' }], queries: [{ module: 'a', table: 'a_rows' }], owners: { a_rows: 'a' } }), moTa: ['Both walls hold', 'Cả hai bức tường đứng vững'] },
    { goi: goi('facadeViolations', { imports: [{ from: 'src/index.js', to: 'modules/notes/repo.js' }, { from: 'modules/cv/a.js', to: 'modules/users/internal/hash.js' }, { from: 'modules/cv/a.js', to: 'modules/users/internal/hash.js' }], queries: [{ module: 'cv', table: 'user' }, { module: 'cv', table: 'cv_draft' }, { module: 'users', table: 'user' }], owners: { user: 'users' } }), an: true },
    { goi: goi('facadeViolations', { imports: [], queries: [], owners: {} }), an: true },
  ],
});

function reconcile({ orders, payments, reservations }) {
  // Không có transaction xuyên dịch vụ ⇒ trạng thái nửa vời là CHẮC CHẮN có. Đối soát tìm chúng thay vì chờ khách báo.
  const paid = new Map();
  for (const p of payments) if (p.status === 'succeeded') paid.set(p.orderId, (paid.get(p.orderId) || 0) + p.amount);
  const reserved = new Set(reservations.map((r) => r.orderId));
  const out = { paidNotReserved: [], reservedNotPaid: [], overcharged: [] };
  for (const o of orders) {
    const got = paid.get(o.id) || 0;
    if (got > 0 && !reserved.has(o.id)) out.paidNotReserved.push(o.id);
    if (got === 0 && reserved.has(o.id)) out.reservedNotPaid.push(o.id);
    if (got > o.total) out.overcharged.push(`${o.id}: ${got} > ${o.total}`);     // bài 13.3: 300.000 thay vì 100.000
  }
  return out;
}
const E5 = await jsBai({
  ten: 'reconcile(state): find the “paid, but stock not reserved” orders', kho: 'MEDIUM', phut: 14,
  en: '<p>Across two services there is no rollback, so the half-done states will exist; reconciliation finds them. <code>orders</code> are <code>{ id, total }</code>, <code>payments</code> <code>{ orderId, amount, status }</code> (only <code>"succeeded"</code> counts; several payments for one order add up), <code>reservations</code> <code>{ orderId }</code>. Return <code>{ paidNotReserved, reservedNotPaid, overcharged }</code>, each in order of <code>orders</code>: ids paid (sum &gt; 0) with no reservation; ids reserved with nothing paid; and <code>"&lt;id&gt;: &lt;paid&gt; &gt; &lt;total&gt;"</code> for orders charged more than their total.</p>',
  vi: '<p>Giữa hai dịch vụ không có quay lui, nên các trạng thái làm dở sẽ tồn tại; đối soát tìm ra chúng. <code>orders</code> là <code>{ id, total }</code>, <code>payments</code> là <code>{ orderId, amount, status }</code> (chỉ <code>"succeeded"</code> được tính; nhiều lần thanh toán cho một đơn thì cộng dồn), <code>reservations</code> là <code>{ orderId }</code>. Trả về <code>{ paidNotReserved, reservedNotPaid, overcharged }</code>, mỗi danh sách theo thứ tự của <code>orders</code>: id đã trả (tổng &gt; 0) mà không giữ hàng; id đã giữ hàng mà chưa trả gì; và <code>"&lt;id&gt;: &lt;đã trả&gt; &gt; &lt;tổng&gt;"</code> cho đơn bị thu nhiều hơn tổng tiền.</p>',
  goiY: [['Sum succeeded payments per order in a Map; put reserved order ids in a Set.', 'Cộng các lần thanh toán thành công theo đơn trong một Map; cho id đơn đã giữ hàng vào một Set.'], ['Walk the orders once and test the three conditions.', 'Duyệt các đơn một lần và kiểm ba điều kiện.']],
  loi: [['Counting failed payment attempts as paid.', 'Tính các lần thanh toán thất bại là đã trả.'], ['Checking only one succeeded payment per order: a retried, non-idempotent charge is exactly the triple charge of chapter 13.', 'Chỉ kiểm một lần thanh toán thành công mỗi đơn: một lần trừ tiền thử lại không idempotent chính là cú trừ ba lần của chương 13.']],
  gt: ['In one process a transaction makes these states impossible; across services you design for them — idempotency keys so a retry cannot charge twice, compensation (refund or release) for a half-done step, and a reconciliation job like this one. That bill is part of the price of splitting.', 'Trong một tiến trình, transaction làm các trạng thái này bất khả; giữa các dịch vụ bạn phải thiết kế cho chúng — khoá idempotency để lần thử lại không trừ tiền hai lần, bù trừ (hoàn tiền hoặc nhả hàng) cho bước làm dở, và một job đối soát như thế này. Hoá đơn đó là một phần giá của việc tách.'],
  kn: ['distributed systems', 'consistency'],
  tns: [tn('reconciliation', 'đối soát'), tn('compensation', 'bù trừ', 'an action that undoes a completed step'), tn('idempotency key', 'khoá idempotency')],
  dau: `/** find half-done orders */
function reconcile({ orders, payments, reservations }) {
  // Write your solution here
  const paidIds = payments.map((p) => p.orderId);
  const resIds = reservations.map((r) => r.orderId);
  return {
    paidNotReserved: orders.filter((o) => paidIds.includes(o.id) && !resIds.includes(o.id)).map((o) => o.id),
    reservedNotPaid: [],
    overcharged: [],
  };
}
`,
  giai: '// Reference solution\n' + nguon(reconcile),
  cases: [
    { goi: goi('reconcile', { orders: [{ id: 'o1', total: 100000 }, { id: 'o2', total: 250000 }], payments: [{ orderId: 'o1', amount: 100000, status: 'succeeded' }, { orderId: 'o2', amount: 250000, status: 'succeeded' }], reservations: [{ orderId: 'o2' }] }), moTa: ['o1 paid, stock never reserved', 'o1 đã trả, chưa bao giờ giữ hàng'] },
    { goi: goi('reconcile', { orders: [{ id: 'o3', total: 100000 }], payments: [{ orderId: 'o3', amount: 100000, status: 'succeeded' }, { orderId: 'o3', amount: 100000, status: 'succeeded' }, { orderId: 'o3', amount: 100000, status: 'succeeded' }], reservations: [{ orderId: 'o3' }] }), moTa: ['The retried charge of chapter 13', 'Cú trừ tiền thử lại của chương 13'] },
    { goi: goi('reconcile', { orders: [{ id: 'a', total: 50 }, { id: 'b', total: 70 }, { id: 'c', total: 10 }], payments: [{ orderId: 'a', amount: 50, status: 'failed' }, { orderId: 'c', amount: 6, status: 'succeeded' }, { orderId: 'c', amount: 4, status: 'succeeded' }], reservations: [{ orderId: 'a' }, { orderId: 'b' }] }), an: true },
    { goi: goi('reconcile', { orders: [], payments: [], reservations: [] }), an: true },
  ],
});

export default modul('nodejs-18-4-monolith-hay-tach', '18.4 Monolith or services: deciding with numbers', [E1, E2, E3, E5, E4]);
