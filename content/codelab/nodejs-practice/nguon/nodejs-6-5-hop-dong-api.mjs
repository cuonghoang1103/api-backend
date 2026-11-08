/** Node.js 6.5 — Hợp đồng API: thay đổi phá vỡ, ETag + If-Match (412/428), Idempotency-Key (phát lại, chống đua), so hợp đồng. */
import { modul, cs, bang1, tn, jsBai, goi, TRO_GIUP } from './_node-c6-8.mjs';

/* ── 1. Phá vỡ hay an toàn ── */
const KQ = ['breaking', 'safe'];
const E1 = cs({
  ten: '6.5 · 1 — Breaking or safe? Changes to a contract you do not control', kho: 'EASY', phut: 7, loai: 'table',
  en: 'A mobile app sits on phones running a version from eight months ago. For each change to the Notes API, decide whether that old app can break. Lesson 6.5’s rule: loosening is safe, tightening is not — and neither shows up in a code review as “breaking”.',
  vi: 'Một app di động nằm trên điện thoại với bản từ tám tháng trước. Với mỗi thay đổi của Notes API, quyết định app cũ đó có thể hỏng không. Luật của bài 6.5: nới lỏng thì an toàn, siết chặt thì không — và cả hai đều không hiện ra là "phá vỡ" khi review code.',
  bang: [bang1('b1', ['Change → breaking or safe?', 'Thay đổi → phá vỡ hay an toàn?'], [{ ma: 'x', ten: 'Change' }, { ma: 'k', ten: 'Verdict', luaChon: KQ }], [
    { o: { x: 'Add an optional response field "wordCount"' }, a: { k: 'safe' } },
    { o: { x: 'Rename response field "body" to "content"' }, a: { k: 'breaking' } },
    { o: { x: 'Send id as 42 instead of "42"' }, a: { k: 'breaking' } },
    { o: { x: 'Add .max(200) to title (it accepted anything before)' }, a: { k: 'breaking' } },
    { o: { x: 'Add an optional request field "color" with a default' }, a: { k: 'safe' } },
    { o: { x: 'Make the request field "tags" required' }, a: { k: 'breaking' } },
    { o: { x: 'Add a new endpoint GET /notes/:id/history' }, a: { k: 'safe' } },
    { o: { x: 'Return 200 instead of 201 after POST /notes' }, a: { k: 'breaking' } },
    { o: { x: 'Raise the title limit from 200 to 500 characters' }, a: { k: 'safe' } },
  ], ['Removing, renaming, changing a type, adding a required field, tightening validation and changing a status code all make an old client that worked yesterday fail today. Adding optional things and loosening never do — provided clients ignore unknown keys (tolerant readers are a contract requirement).', 'Xoá, đổi tên, đổi kiểu, thêm trường bắt buộc, siết kiểm tra và đổi mã trạng thái đều làm client cũ chạy được hôm qua hỏng hôm nay. Thêm thứ tuỳ chọn và nới lỏng thì không bao giờ — miễn client bỏ qua khoá lạ (đọc khoan dung là yêu cầu của hợp đồng).'])],
  goiY: [['Imagine the 8-month-old app sends exactly the request it sent yesterday. Does it still succeed, and can it still read the answer?', 'Hình dung app 8 tháng tuổi gửi đúng request hôm qua nó gửi. Nó còn thành công không, và còn đọc được câu trả lời không?'], ['A stricter validator rejects requests that worked before — that is breaking.', 'Bộ kiểm chặt hơn từ chối request trước đây chạy được — đó là phá vỡ.']],
  loi: [['Marking “add .max(200)” as safe because it is “just validation”.', 'Đánh "thêm .max(200)" là an toàn vì "chỉ là kiểm dữ liệu".'], ['Marking a rename as safe because the data is the same.', 'Đánh đổi tên là an toàn vì dữ liệu vẫn vậy.']],
  tns: [tn('breaking change', 'thay đổi phá vỡ', 'Làm client cũ đang chạy bị hỏng.'), tn('tolerant reader', 'đọc khoan dung', 'Client bỏ qua trường lạ.')],
  kn: ['API contract', 'versioning'],
});

/* ── 2. ETag + If-Match ── */
function etagOf(note) {
  // provided in helpers.js too — a short hash of the representation, quoted like a real ETag
  return '"' + hex(sha256(utf8(JSON.stringify(note)))).slice(0, 12) + '"';
}
function createNoteResource(store) {
  const json = (status, body, etag) => ({ status, headers: etag ? { etag } : {}, body });
  return {
    get(id) {
      const note = store.get(id);
      if (!note) return json(404, { error: { code: 'NOTE_NOT_FOUND' } });
      return json(200, note, etagOf(note));                 // set YOUR ETag — the identity of this version
    },
    patch(id, headers, body) {
      const note = store.get(id);
      if (!note) return json(404, { error: { code: 'NOTE_NOT_FOUND' } });
      const ifMatch = headers['if-match'];
      // 428: you sent no precondition, and this endpoint requires one — the safe path is the only path
      if (!ifMatch) return json(428, { error: { code: 'PRECONDITION_REQUIRED' } });
      // 412: you sent one, and someone changed the note since you loaded it
      if (ifMatch !== etagOf(note)) return json(412, { error: { code: 'PRECONDITION_FAILED', message: 'Someone else edited this note, reload' } });
      const next = { ...note, version: note.version + 1 };
      for (const f of ['title', 'body']) if (f in body) next[f] = body[f];
      store.set(id, next);
      return json(200, next, etagOf(next));                 // the new version gets a new ETag
    },
  };
}
const E2 = jsBai({
  ten: '6.5 · 2 — Write createNoteResource(store): ETag on GET, If-Match on PATCH, 412 and 428', kho: 'MEDIUM', phut: 20,
  en: `<p>Lesson 6.1’s lost update, fixed with one header in each direction. <code>store</code> is a <code>Map</code> id → note <code>{ id, title, body, version }</code>. <code>etagOf(note)</code> is provided in <code>helpers.js</code> (a quoted 12-character hash, like the lesson’s). Write <code>createNoteResource(store)</code> returning <code>{ get(id), patch(id, headers, body) }</code>; each returns <code>{ status, headers, body }</code>:</p>
<ul><li>Unknown id (both) ⇒ 404 <code>{ error: { code: "NOTE_NOT_FOUND" } }</code>, headers <code>{}</code>.</li>
<li><code>get</code> ⇒ 200, body = note, headers <code>{ etag: etagOf(note) }</code>.</li>
<li><code>patch</code>: no <code>headers['if-match']</code> ⇒ <b>428</b> <code>{ error: { code: "PRECONDITION_REQUIRED" } }</code>; an If-Match that differs from the current ETag ⇒ <b>412</b> <code>{ error: { code: "PRECONDITION_FAILED", message: "Someone else edited this note, reload" } }</code> (headers <code>{}</code> for both).</li>
<li>Matching ⇒ copy only <code>title</code>/<code>body</code> that are present in <code>body</code>, <code>version + 1</code>, save, 200 with the new note and its new ETag.</li></ul>
<p>The first check replays the lesson: A and B both hold <code>"…"</code> from one GET; A’s PATCH ⇒ 200, B’s ⇒ 412, C without If-Match ⇒ 428, final note = A’s edit.</p>`,
  vi: `<p>Mất cập nhật của bài 6.1, sửa bằng một header mỗi chiều. <code>store</code> là <code>Map</code> id → ghi chú <code>{ id, title, body, version }</code>. <code>etagOf(note)</code> có sẵn trong <code>helpers.js</code> (chuỗi băm 12 ký tự trong ngoặc kép, như của bài). Viết <code>createNoteResource(store)</code> trả <code>{ get(id), patch(id, headers, body) }</code>; mỗi hàm trả <code>{ status, headers, body }</code>:</p>
<ul><li>Id không có (cả hai) ⇒ 404 <code>{ error: { code: "NOTE_NOT_FOUND" } }</code>, headers <code>{}</code>.</li>
<li><code>get</code> ⇒ 200, body = ghi chú, headers <code>{ etag: etagOf(note) }</code>.</li>
<li><code>patch</code>: không có <code>headers['if-match']</code> ⇒ <b>428</b> <code>{ error: { code: "PRECONDITION_REQUIRED" } }</code>; If-Match khác ETag hiện tại ⇒ <b>412</b> <code>{ error: { code: "PRECONDITION_FAILED", message: "Someone else edited this note, reload" } }</code> (cả hai headers <code>{}</code>).</li>
<li>Khớp ⇒ chỉ chép <code>title</code>/<code>body</code> có mặt trong <code>body</code>, <code>version + 1</code>, lưu, 200 với ghi chú mới và ETag mới.</li></ul>
<p>Kiểm đầu tiên diễn lại bài: A và B cùng giữ <code>"…"</code> từ một lần GET; PATCH của A ⇒ 200, của B ⇒ 412, C không có If-Match ⇒ 428, ghi chú cuối = bản sửa của A.</p>`,
  yc: [['Compare the If-Match with the ETag of the CURRENT note, computed now.', 'So If-Match với ETag của ghi chú HIỆN TẠI, tính ngay lúc đó.'], ['412 and 428 never change the store.', '412 và 428 không bao giờ đổi store.'], ['A successful PATCH returns the new ETag.', 'PATCH thành công trả ETag mới.']],
  goiY: [['Order inside <code>patch</code>: 404 → 428 → 412 → apply.', 'Thứ tự trong <code>patch</code>: 404 → 428 → 412 → áp dụng.'], ['Header names arrive lower-case: <code>headers["if-match"]</code>.', 'Tên header tới ở dạng chữ thường: <code>headers["if-match"]</code>.']],
  loi: [['Treating a missing If-Match as “no conflict” and saving — that is exactly the lost update again.', 'Coi thiếu If-Match là "không xung đột" rồi lưu — chính là mất cập nhật lần nữa.'], ['Computing the ETag of the note AFTER applying the patch, so every If-Match fails.', 'Tính ETag của ghi chú SAU khi áp patch, nên If-Match nào cũng trượt.'], ['Mutating the stored note before the precondition passed.', 'Sửa ghi chú đã lưu trước khi điều kiện qua.']],
  gt: ['An ETag is the identity of one version of the representation. If-Match says “apply this only to the version I saw”. If someone else saved in between, the current ETag differs and the server answers 412 instead of silently destroying their work — optimistic concurrency, with no lock held while a human types. Requiring the header (428) makes the safe path the only path.', 'ETag là danh tính của một phiên bản biểu diễn. If-Match nói "chỉ áp dụng cho phiên bản tôi đã thấy". Nếu ai đó lưu xen giữa, ETag hiện tại khác và server trả 412 thay vì lặng lẽ xoá công sức của họ — đồng thời lạc quan, không giữ khoá trong lúc người gõ. Bắt buộc header (428) khiến đường an toàn là đường duy nhất.'],
  kn: ['ETag', 'optimistic concurrency'],
  tns: [tn('ETag', 'ETag', 'Định danh một phiên bản của tài nguyên.'), tn('If-Match', 'If-Match', 'Chỉ làm nếu ETag còn khớp.'), tn('412 Precondition Failed', '412', 'Điều kiện gửi kèm không còn đúng.'), tn('428 Precondition Required', '428', 'Endpoint đòi phải gửi điều kiện.')],
  tro: `${TRO_GIUP}\n// provided: the ETag of a note (quoted, 12 hex characters)\n${etagOf.toString()}\n`,
  dau: `function createNoteResource(store) {
  return {
    get(id) {
      // Write your solution here
      return { status: 200, headers: {}, body: store.get(id) };
    },
    patch(id, headers, body) {
      const note = store.get(id);
      Object.assign(note, body, { version: note.version + 1 });
      return { status: 200, headers: {}, body: note };
    },
  };
}
`,
  giai: createNoteResource,
  chung: `const mk = () => new Map([[1, { id: 1, title: 'Original', body: 'original content', version: 1 }]]);`,
  cases: [
    { goi: `(() => { const s = mk(); const r = createNoteResource(s); const e = r.get(1).headers.etag;
  const a = r.patch(1, { 'if-match': e }, { title: 'A edited' });
  const b = r.patch(1, { 'if-match': e }, { body: 'B edited' });
  const c = r.patch(1, {}, { title: 'C' });
  return { a: a.status, b: b.status, bBody: b.body, c: c.status, cBody: c.body, final: s.get(1) }; })()`, moTa: ['The two-editor scenario: 200, 412, 428', 'Kịch bản hai người sửa: 200, 412, 428'] },
    { goi: `(() => { const r = createNoteResource(mk()); const g = r.get(1); return [g.status, g.headers.etag === etagOf(g.body), r.get(9)]; })()`, moTa: ['GET sends the ETag; unknown id ⇒ 404', 'GET gửi ETag; id lạ ⇒ 404'] },
    { goi: `(() => { const r = createNoteResource(mk()); const e1 = r.get(1).headers.etag; const p = r.patch(1, { 'if-match': e1 }, { title: 'v2' }); const p2 = r.patch(1, { 'if-match': p.headers.etag }, { title: 'v3' }); return [p.status, p2.status, p2.body, p.headers.etag !== e1]; })()`, an: true, moTa: ['Chained edits with the new ETag succeed', 'Sửa nối tiếp bằng ETag mới thành công'] },
    { goi: `(() => { const s = mk(); const r = createNoteResource(s); const x = r.patch(1, { 'if-match': '"000000000000"' }, { title: 'x' }); const y = r.patch(2, { 'if-match': '"x"' }, {}); return [x.status, x.headers, y.status, s.get(1).version]; })()`, an: true },
    { goi: `(() => { const s = mk(); const r = createNoteResource(s); const e = r.get(1).headers.etag; r.patch(1, { 'if-match': e }, { version: 99, id: 5, body: '' }); return s.get(1); })()`, an: true },
  ],
  saiMau: [
    createNoteResource.toString().replace("if (!ifMatch) return json(428, { error: { code: 'PRECONDITION_REQUIRED' } });", ''),
  ],
});

/* ── 3. Idempotency-Key — tuần tự ── */
function createPaymentsRoute(charge) {
  const store = new Map();   // demo store; production: a table or Redis key with a TTL (24h)
  return async function handle(req) {
    const key = req.headers['idempotency-key'];
    if (!key) return { status: 400, headers: {}, body: { error: { code: 'IDEMPOTENCY_KEY_REQUIRED' } } };
    if (store.has(key)) {
      // seen it — replay the SAVED response, do NOT charge again
      const saved = store.get(key);
      return { status: saved.status, headers: { 'idempotent-replay': 'true' }, body: saved.body };
    }
    const payment = await charge(req.body.amount);
    store.set(key, { status: 201, body: payment });           // save the RESPONSE, not just the key
    return { status: 201, headers: {}, body: payment };
  };
}
const CHARGE = `const mkCharge = () => { let n = 0; const f = (amount) => new Promise((ok) => setTimeout(() => { n++; ok({ id: 'pay_' + n, amount, charged: true }); }, 100)); f.count = () => n; return f; };`;
const E3 = jsBai({
  ten: '6.5 · 3 — Write createPaymentsRoute(charge): the Idempotency-Key that prevents the double charge', kho: 'MEDIUM', phut: 15,
  en: `<p>A mobile client sends <code>POST /payments</code>, the response is lost, the SDK retries — and without protection a second payment is created. Write <code>createPaymentsRoute(charge)</code> returning <code>async handle(req)</code>, <code>req = { headers, body: { amount } }</code>, result <code>{ status, headers, body }</code>. <code>charge(amount)</code> is a fake async payment provider (100 ms) returning <code>{ id, amount, charged: true }</code>.</p>
<ul><li>No <code>headers['idempotency-key']</code> ⇒ 400 <code>{ error: { code: "IDEMPOTENCY_KEY_REQUIRED" } }</code>, headers <code>{}</code>.</li>
<li>A key seen before ⇒ the <b>saved</b> status and body, with header <code>idempotent-replay: "true"</code>, and <b>no new charge</b>.</li>
<li>A new key ⇒ charge, save <code>{ status: 201, body: payment }</code> under the key, return 201 with headers <code>{}</code>.</li></ul>
<p>The real run of the lesson: call 1 and call 2 with key <code>7f3a…</code> ⇒ the same payment id, charged ONCE; call 3 with key <code>91b2…</code> ⇒ a new payment.</p>`,
  vi: `<p>Client di động gửi <code>POST /payments</code>, phản hồi bị mất, SDK thử lại — không có bảo vệ thì một khoản thanh toán thứ hai được tạo. Viết <code>createPaymentsRoute(charge)</code> trả <code>async handle(req)</code>, <code>req = { headers, body: { amount } }</code>, kết quả <code>{ status, headers, body }</code>. <code>charge(amount)</code> là cổng thanh toán GIẢ bất đồng bộ (100 ms) trả <code>{ id, amount, charged: true }</code>.</p>
<ul><li>Không có <code>headers['idempotency-key']</code> ⇒ 400 <code>{ error: { code: "IDEMPOTENCY_KEY_REQUIRED" } }</code>, headers <code>{}</code>.</li>
<li>Khoá đã thấy ⇒ mã và body <b>đã lưu</b>, kèm header <code>idempotent-replay: "true"</code>, và <b>không trừ tiền lần nữa</b>.</li>
<li>Khoá mới ⇒ trừ tiền, lưu <code>{ status: 201, body: payment }</code> theo khoá, trả 201 với headers <code>{}</code>.</li></ul>
<p>Lần chạy thật của bài: lần 1 và lần 2 với khoá <code>7f3a…</code> ⇒ cùng mã thanh toán, trừ tiền MỘT lần; lần 3 với khoá <code>91b2…</code> ⇒ thanh toán mới.</p>`,
  yc: [['The store lives inside the closure — one per route.', 'Kho nằm trong closure — mỗi route một kho.'], ['A replay returns the first response, not a 409.', 'Phát lại trả phản hồi đầu tiên, không phải 409.']],
  goiY: [['<code>const store = new Map()</code> outside <code>handle</code>, keyed by the header value.', '<code>const store = new Map()</code> ngoài <code>handle</code>, khoá theo giá trị header.'], ['Save <code>{ status, body }</code> after the charge, and read it back on a repeat.', 'Lưu <code>{ status, body }</code> sau khi trừ tiền, và đọc lại khi lặp.']],
  loi: [['Answering 409 to the retry: the client cannot tell “lost response” from “never sent”, so it needs the same body.', 'Trả 409 cho lần thử lại: client không phân biệt được "mất phản hồi" và "chưa gửi", nên nó cần cùng body.'], ['Storing only the key (a Set) — then the replay has nothing to return.', 'Chỉ lưu khoá (một Set) — khi phát lại không có gì để trả.'], ['Generating the key inside the client’s retry loop: a fresh key per attempt defeats the whole mechanism.', 'Sinh khoá trong vòng thử lại của client: mỗi lần một khoá mới phá hỏng cả cơ chế.']],
  gt: ['POST is not idempotent, so the server must recognise the repeat itself. The client-generated key names one user intent; the server stores the outcome against it and returns that same outcome to every retry of that intent. Different key, different intent, new payment.', 'POST không idempotent, nên server phải tự nhận ra lần lặp. Khoá do client sinh gọi tên một ý định của người dùng; server lưu kết quả theo khoá đó và trả đúng kết quả ấy cho mọi lần thử lại của ý định đó. Khác khoá, khác ý định, thanh toán mới.'],
  kn: ['idempotency key', 'retries'],
  tns: [tn('Idempotency-Key', 'khoá idempotent', 'Một UUID cho mỗi ý định của người dùng.'), tn('replay', 'phát lại', 'Trả lại phản hồi đã lưu.')],
  dau: `function createPaymentsRoute(charge) {
  return async function handle(req) {
    // Write your solution here
    const payment = await charge(req.body.amount);
    return { status: 201, headers: {}, body: payment };
  };
}
`,
  giai: createPaymentsRoute,
  chung: CHARGE,
  cases: [
    { goi: `await (async () => { const c = mkCharge(); const h = createPaymentsRoute(c); const k = { 'idempotency-key': '7f3a' };
  const r1 = await h({ headers: k, body: { amount: 250000 } }); const r2 = await h({ headers: k, body: { amount: 250000 } }); const r3 = await h({ headers: { 'idempotency-key': '91b2' }, body: { amount: 250000 } });
  return { r1, r2, r3, charges: c.count() }; })()`, moTa: ['Lesson run: same key twice, then a new key', 'Lần chạy của bài: cùng khoá hai lần, rồi khoá mới'] },
    { goi: `await createPaymentsRoute(mkCharge())({ headers: {}, body: { amount: 1 } })`, moTa: ['No key ⇒ 400', 'Không có khoá ⇒ 400'] },
    { goi: `await (async () => { const c = mkCharge(); const h = createPaymentsRoute(c); for (let i = 0; i < 5; i++) await h({ headers: { 'idempotency-key': 'same' }, body: { amount: 9 } }); return c.count(); })()`, an: true },
    { goi: `await (async () => { const c = mkCharge(); const a = createPaymentsRoute(c), b = createPaymentsRoute(c); const k = { 'idempotency-key': 'k' }; await a({ headers: k, body: { amount: 1 } }); const x = await b({ headers: k, body: { amount: 1 } }); return [x.status, x.headers, c.count()]; })()`, an: true, moTa: ['Two routes (= two processes) do not share a Map', 'Hai route (= hai tiến trình) không chung một Map'] },
  ],
});

/* ── 4. Idempotency-Key — hai lần thử lại tới CÙNG LÚC ── */
function createSafePaymentsRoute(charge) {
  const store = new Map();   // key -> { promise } while in flight, then { status, body }
  return async function handle(req) {
    const key = req.headers['idempotency-key'];
    if (!key) return { status: 400, headers: {}, body: { error: { code: 'IDEMPOTENCY_KEY_REQUIRED' } } };
    const seen = store.get(key);
    if (seen) {
      // in flight or done: wait for THE one outcome, never start a second charge
      const outcome = await seen.promise;
      return { status: outcome.status, headers: { 'idempotent-replay': 'true' }, body: outcome.body };
    }
    // claim the key BEFORE doing the work — synchronously, so a second request in the same instant sees it
    let finish;
    const entry = { promise: new Promise((ok) => { finish = ok; }) };
    store.set(key, entry);
    try {
      const payment = await charge(req.body.amount);
      const outcome = { status: 201, body: payment };
      finish(outcome);
      return { status: 201, headers: {}, body: payment };
    } catch (err) {
      // the charge did not happen: forget the key so a later retry can really try again
      store.delete(key);
      const outcome = { status: 502, body: { error: { code: 'CHARGE_FAILED' } } };
      finish(outcome);
      return { status: 502, headers: {}, body: outcome.body };
    }
  };
}
const E4 = jsBai({
  ten: '6.5 · 4 — Guard the race: two retries with the same key arrive at the same instant', kho: 'HARD', phut: 25,
  en: `<p>“Guard the race too. Two retries can arrive simultaneously.” With the version of exercise 3, both requests check the store <i>before</i> either charge has finished — both miss, both charge. Write <code>createSafePaymentsRoute(charge)</code> with the same contract as exercise 3, plus:</p>
<ul><li>Claim the key <b>before</b> awaiting <code>charge</code>, synchronously: a second request with the same key that arrives while the first is still in flight must <b>wait for the first outcome</b> and return it with <code>idempotent-replay: "true"</code> — exactly one charge.</li>
<li>If <code>charge</code> rejects ⇒ 502 <code>{ error: { code: "CHARGE_FAILED" } }</code> (headers <code>{}</code>) for the first request; requests that were waiting on that key get the same status and body (with the replay header). Then <b>forget the key</b>, so a retry that comes later really tries again.</li></ul>
<p>The grader’s fake provider takes 100 virtual ms; <code>mkFlaky()</code> fails its first call. Tests fire requests with <code>Promise.all</code>.</p>`,
  vi: `<p>"Chặn cả cuộc đua. Hai lần thử lại có thể tới cùng lúc." Với bản của bài 3, cả hai request xem kho <i>trước khi</i> lần trừ tiền nào xong — cả hai đều trượt, cả hai đều trừ tiền. Viết <code>createSafePaymentsRoute(charge)</code> cùng hợp đồng với bài 3, thêm:</p>
<ul><li>Giữ chỗ cho khoá <b>trước khi</b> await <code>charge</code>, đồng bộ: request thứ hai cùng khoá tới khi request đầu còn đang chạy phải <b>chờ kết quả của request đầu</b> rồi trả nó kèm <code>idempotent-replay: "true"</code> — đúng một lần trừ tiền.</li>
<li><code>charge</code> reject ⇒ 502 <code>{ error: { code: "CHARGE_FAILED" } }</code> (headers <code>{}</code>) cho request đầu; các request đang chờ khoá đó nhận cùng mã và body (kèm header phát lại). Rồi <b>quên khoá</b>, để lần thử lại tới sau thật sự thử lại.</li></ul>
<p>Cổng thanh toán giả mất 100 ms ảo; <code>mkFlaky()</code> hỏng ở lần gọi đầu. Kiểm gửi request bằng <code>Promise.all</code>.</p>`,
  yc: [['Exactly one charge per key, even with concurrent requests.', 'Mỗi khoá đúng một lần trừ tiền, kể cả request đồng thời.'], ['A failed charge is not remembered as a success, and not remembered forever.', 'Lần trừ tiền hỏng không được nhớ như thành công, và không bị nhớ mãi.']],
  goiY: [['Store a Promise for the outcome the moment you see a new key: <code>store.set(key, { promise })</code> — before any <code>await</code>.', 'Lưu một Promise cho kết quả ngay khi thấy khoá mới: <code>store.set(key, { promise })</code> — trước mọi <code>await</code>.'], ['Create it with an exposed resolver: <code>let finish; const promise = new Promise((ok) => { finish = ok; });</code> and call <code>finish(outcome)</code> in both the success and the catch branch.', 'Tạo nó với hàm resolve lộ ra: <code>let finish; const promise = new Promise((ok) => { finish = ok; });</code> và gọi <code>finish(outcome)</code> ở cả nhánh thành công lẫn catch.']],
  loi: [['Checking <code>store.has(key)</code>, awaiting the charge, and only then <code>store.set</code> — the window in which both retries pass.', 'Kiểm <code>store.has(key)</code>, await trừ tiền, rồi mới <code>store.set</code> — đúng khe hở cho cả hai lần thử lại lọt qua.'], ['Leaving a failed key in the store: every later retry replays the failure forever.', 'Để khoá hỏng nằm lại trong kho: mọi lần thử lại sau phát lại thất bại mãi mãi.'], ['Forgetting to settle the waiting promise on failure: the second request hangs.', 'Quên kết thúc promise đang chờ khi hỏng: request thứ hai treo.']],
  gt: ['Node runs your handler’s synchronous part without interruption, so whatever you write to the Map before the first <code>await</code> is visible to every request that starts afterwards. Storing the in-flight Promise turns “check, then act” into “claim, then act”: the second request finds the claim and waits for the same outcome. In production the claim is an INSERT with a UNIQUE constraint — the database plays the role of the synchronous section across processes.', 'Node chạy phần đồng bộ của handler không bị ngắt, nên thứ bạn ghi vào Map trước <code>await</code> đầu tiên được mọi request bắt đầu sau đó nhìn thấy. Lưu Promise đang chạy biến "kiểm rồi làm" thành "giữ chỗ rồi làm": request thứ hai thấy chỗ đã giữ và chờ cùng kết quả. Trên production, giữ chỗ là một INSERT có ràng buộc UNIQUE — CSDL đóng vai đoạn đồng bộ giữa nhiều tiến trình.'],
  kn: ['idempotency key', 'race condition', 'promises'],
  tns: [tn('race condition', 'tranh chấp', 'Kết quả phụ thuộc thứ tự hai việc chạy chồng.'), tn('in flight', 'đang chạy', 'Đã bắt đầu, chưa xong.')],
  dau: `function createSafePaymentsRoute(charge) {
  const store = new Map();
  return async function handle(req) {
    // Write your solution here
    const key = req.headers['idempotency-key'];
    if (!key) return { status: 400, headers: {}, body: { error: { code: 'IDEMPOTENCY_KEY_REQUIRED' } } };
    if (store.has(key)) { const s = store.get(key); return { status: s.status, headers: { 'idempotent-replay': 'true' }, body: s.body }; }
    const payment = await charge(req.body.amount);
    store.set(key, { status: 201, body: payment });
    return { status: 201, headers: {}, body: payment };
  };
}
`,
  giai: createSafePaymentsRoute,
  chung: CHARGE + `
const mkFlaky = () => { let calls = 0, ok = 0; const f = (amount) => new Promise((res, rej) => setTimeout(() => { calls++; if (calls === 1) rej(new Error('gateway timeout')); else { ok++; res({ id: 'pay_' + ok, amount, charged: true }); } }, 100)); f.calls = () => calls; return f; };
const R = (key, amount = 250000) => ({ headers: key ? { 'idempotency-key': key } : {}, body: { amount } });`,
  cases: [
    { goi: `await (async () => { const c = mkCharge(); const h = createSafePaymentsRoute(c); const [a, b] = await Promise.all([h(R('7f3a')), h(R('7f3a'))]); return { a, b, charges: c.count() }; })()`, moTa: ['Two simultaneous retries ⇒ one charge', 'Hai lần thử lại đồng thời ⇒ một lần trừ tiền'] },
    { goi: `await (async () => { const c = mkCharge(); const h = createSafePaymentsRoute(c); await h(R('a')); const r = await h(R('a')); const n = await h(R('b')); return [r.status, r.headers, r.body.id, n.body.id, c.count()]; })()`, moTa: ['Sequential replay still works', 'Phát lại tuần tự vẫn chạy'] },
    { goi: `await createSafePaymentsRoute(mkCharge())(R(null))` },
    { goi: `await (async () => { const f = mkFlaky(); const h = createSafePaymentsRoute(f); const [a, b] = await Promise.all([h(R('k')), h(R('k'))]); const later = await h(R('k')); return { a, b, later, calls: f.calls() }; })()`, an: true, moTa: ['Failed charge: waiters get 502, a later retry charges', 'Trừ tiền hỏng: người chờ nhận 502, lần thử sau trừ được'] },
    { goi: `await (async () => { const c = mkCharge(); const h = createSafePaymentsRoute(c); const rs = await Promise.all([h(R('x')), h(R('y')), h(R('x')), h(R('y')), h(R('x'))]); return [rs.map((r) => r.body.id), rs.map((r) => r.headers['idempotent-replay'] || '-'), c.count()]; })()`, an: true },
    { goi: `await (async () => { const c = mkCharge(); const h = createSafePaymentsRoute(c); const t0 = Date.now(); await Promise.all([h(R('t')), h(R('t')), h(R('t'))]); return [Date.now() - t0, c.count()]; })()`, an: true, moTa: ['Waiters do not add time: 100 ms total', 'Người chờ không cộng thêm thời gian: tổng 100 ms'] },
  ],
  saiMau: [
    createSafePaymentsRoute.toString().replace('      store.delete(key);\n', ''),
  ],
});

/* ── 5. So hai hợp đồng ── */
function breakingChanges(before, after) {
  const out = [];
  // response: a client READS these — removing or retyping breaks it; adding is safe (tolerant readers)
  for (const [f, type] of Object.entries(before.response)) {
    if (!(f in after.response)) out.push('response.' + f + ': removed');
    else if (after.response[f] !== type) out.push('response.' + f + ': type ' + type + ' -> ' + after.response[f]);
  }
  // request: a client SENDS these — anything that rejects yesterday's request breaks it
  for (const [f, rule] of Object.entries(after.request)) {
    const old = before.request[f];
    if (!old) {
      if (rule.required) out.push('request.' + f + ': now required');    // a new REQUIRED field
      continue;                                                           // a new optional field is safe
    }
    if (rule.required && !old.required) out.push('request.' + f + ': now required');
    if (rule.type !== old.type) out.push('request.' + f + ': type ' + old.type + ' -> ' + rule.type);
    const was = old.max ?? Infinity, now = rule.max ?? Infinity;
    if (now < was) out.push('request.' + f + ': max ' + (old.max ?? 'none') + ' -> ' + rule.max);   // tightening
  }
  return out.sort();
}
const V1 = { response: { id: 'string', title: 'string', body: 'string', pinned: 'boolean' }, request: { title: { type: 'string', required: true }, body: { type: 'string', required: false, max: 10000 } } };
const E5 = jsBai({
  ten: '6.5 · 5 — Write breakingChanges(before, after): catch what code review does not', kho: 'MEDIUM', phut: 20,
  en: `<p>“Tightening validation is a breaking change … and neither shows up in a code review as ‘breaking’.” Make the computer look. A contract is <code>{ response: { field: type }, request: { field: { type, required, max? } } }</code>. Return the sorted list of breaking changes between <code>before</code> and <code>after</code>:</p>
<ul><li>Response field removed ⇒ <code>"response.&lt;f&gt;: removed"</code> (a rename shows up as a removal); type changed ⇒ <code>"response.&lt;f&gt;: type &lt;old&gt; -&gt; &lt;new&gt;"</code>. Added response fields are safe.</li>
<li>Request field that is required in <code>after</code> but was absent or optional before ⇒ <code>"request.&lt;f&gt;: now required"</code>. A new optional request field is safe. A request field removed from <code>after</code> is safe (old clients sending it are tolerated).</li>
<li>Request type changed ⇒ <code>"request.&lt;f&gt;: type &lt;old&gt; -&gt; &lt;new&gt;"</code>.</li>
<li>Request <code>max</code> lowered, or added where there was none ⇒ <code>"request.&lt;f&gt;: max &lt;old or none&gt; -&gt; &lt;new&gt;"</code>. Raising or removing a max is loosening — safe.</li></ul>
<p>Return <code>list.sort()</code> (plain string sort).</p>`,
  vi: `<p>"Siết kiểm tra là thay đổi phá vỡ … và cả hai đều không hiện ra là 'phá vỡ' khi review code." Hãy để máy tính nhìn. Một hợp đồng là <code>{ response: { field: type }, request: { field: { type, required, max? } } }</code>. Trả danh sách đã sắp các thay đổi phá vỡ giữa <code>before</code> và <code>after</code>:</p>
<ul><li>Trường response bị xoá ⇒ <code>"response.&lt;f&gt;: removed"</code> (đổi tên hiện ra như xoá); đổi kiểu ⇒ <code>"response.&lt;f&gt;: type &lt;cũ&gt; -&gt; &lt;mới&gt;"</code>. Thêm trường response là an toàn.</li>
<li>Trường request bắt buộc trong <code>after</code> nhưng trước đó vắng hoặc tuỳ chọn ⇒ <code>"request.&lt;f&gt;: now required"</code>. Thêm trường request tuỳ chọn là an toàn. Trường request bị bỏ khỏi <code>after</code> là an toàn (client cũ gửi lên vẫn được khoan dung).</li>
<li>Đổi kiểu request ⇒ <code>"request.&lt;f&gt;: type &lt;cũ&gt; -&gt; &lt;mới&gt;"</code>.</li>
<li><code>max</code> của request giảm, hoặc thêm mới khi trước không có ⇒ <code>"request.&lt;f&gt;: max &lt;cũ hoặc none&gt; -&gt; &lt;mới&gt;"</code>. Tăng hay bỏ max là nới lỏng — an toàn.</li></ul>
<p>Trả về <code>list.sort()</code> (sắp chuỗi thường).</p>`,
  yc: [['Report only breaking changes.', 'Chỉ báo thay đổi phá vỡ.'], ['Treat a missing <code>max</code> as “no limit”.', 'Coi thiếu <code>max</code> là "không giới hạn".']],
  goiY: [['Loop over <code>before.response</code> for removals and retypes; loop over <code>after.request</code> for new requirements and tightening.', 'Lặp qua <code>before.response</code> để tìm xoá và đổi kiểu; lặp qua <code>after.request</code> để tìm yêu cầu mới và siết chặt.'], ['<code>old.max ?? Infinity</code> vs <code>rule.max ?? Infinity</code> turns “none” into a number you can compare.', '<code>old.max ?? Infinity</code> so với <code>rule.max ?? Infinity</code> biến "none" thành số so sánh được.']],
  loi: [['Flagging an added optional field as breaking — that would block every additive change, the cheapest kind of migration.', 'Đánh dấu trường tuỳ chọn mới là phá vỡ — như vậy chặn mọi thay đổi bổ sung, loại di trú rẻ nhất.'], ['Missing “max none → 200”: the exact change the lesson calls the one everybody underestimates.', 'Bỏ sót "max none → 200": đúng thay đổi mà bài gọi là thứ ai cũng xem nhẹ.']],
  gt: ['The asymmetry is the whole rule: a client reads responses and sends requests. For what it reads, removing or retyping breaks it and adding does not. For what it sends, anything that would reject yesterday’s request — a new required field, a stricter limit, a new type — breaks it, and loosening does not. Running a check like this in CI is how “additive by default” stays true without relying on reviewers.', 'Sự bất đối xứng chính là cả luật: client đọc response và gửi request. Với thứ nó đọc, xoá hay đổi kiểu làm hỏng còn thêm thì không. Với thứ nó gửi, bất cứ gì từ chối request của hôm qua — trường bắt buộc mới, giới hạn chặt hơn, kiểu mới — làm hỏng, còn nới lỏng thì không. Chạy phép kiểm này trong CI là cách giữ "mặc định chỉ bổ sung" mà không phải trông vào người review.'],
  kn: ['API contract', 'breaking changes'],
  tns: [tn('additive change', 'thay đổi bổ sung', 'Chỉ thêm, không bớt.'), tn('tightening', 'siết chặt', 'Từ chối thứ trước đây được nhận.')],
  dau: `function breakingChanges(before, after) {
  // Write your solution here
  const out = [];
  for (const f of Object.keys(after.response)) if (!(f in before.response)) out.push('response.' + f + ': added');
  return out;
}
`,
  giai: breakingChanges,
  cases: [
    { goi: goi('breakingChanges', V1, { response: { ...V1.response, wordCount: 'number' }, request: { ...V1.request, color: { type: 'string', required: false } } }), moTa: ['Additive changes only ⇒ []', 'Chỉ bổ sung ⇒ []'] },
    { goi: goi('breakingChanges', V1, { response: { id: 'number', title: 'string', content: 'string', pinned: 'boolean' }, request: V1.request }), moTa: ['Rename body→content and id string→number', 'Đổi tên body→content và id string→number'] },
    { goi: goi('breakingChanges', V1, { response: V1.response, request: { title: { type: 'string', required: true, max: 200 }, body: V1.request.body } }), moTa: ['Adding .max(200) to title', 'Thêm .max(200) cho title'] },
    { goi: goi('breakingChanges', V1, { response: V1.response, request: { title: V1.request.title, body: { type: 'string', required: true, max: 20000 }, tags: { type: 'array', required: true } } }), an: true },
    { goi: goi('breakingChanges', V1, { response: { title: 'string' }, request: { title: { type: 'array', required: false } } }), an: true },
    { goi: goi('breakingChanges', { response: {}, request: { q: { type: 'string', required: false, max: 50 } } }, { response: { items: 'array' }, request: { q: { type: 'string', required: false, max: 49 } } }), an: true },
    { goi: goi('breakingChanges', V1, V1), an: true },
  ],
  saiMau: [
    breakingChanges.toString().replace("if (now < was)", 'if (old.max != null && now < was)'),
  ],
});

export default modul('nodejs-6-5-hop-dong-api', '6.5 The API contract: versions, ETag, idempotency', [E1, E2, E3, E4, E5]);
