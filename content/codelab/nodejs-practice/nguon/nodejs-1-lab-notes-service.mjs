// Node.js — Lab chương 1: một service Notes viết bằng JavaScript thuần (closure, tham chiếu, async, ES modules).
import { modul, jsBai, modBai, tn, pre, bi, KHO_GIA } from './_node.mjs';

const TN = [
  tn('service layer', 'tầng service', 'Business rules as plain functions — no HTTP, so they can be tested with fakes.'),
  tn('closure', 'closure', 'The service keeps its repo and id counter in the factory\'s scope.'),
  tn('defensive copy', 'bản sao phòng vệ', 'Return a new object so callers cannot change stored data.'),
  tn('batch', 'lô', 'A group of items processed together; batches run one after another.'),
  tn('timeout with Promise.race', 'hết giờ bằng Promise.race', 'Race the work against a timer that rejects.'),
];

const L1 = jsBai({
  ten: 'Lab 1.1 — createNoteService: closures, copies and awaits in one service',
  kho: 'MEDIUM', phut: 30, diem: 30, dangBai: 'lab',
  en: `<p>Everything from chapter 1 in one service — the shape the Notes API's <code>src/services/notes.js</code> will have. Write <code>createNoteService(repo)</code>. <code>repo</code> is async: <code>await repo.findById(id)</code> ⇒ a <b>copy</b> of the stored note or <code>null</code>; <code>await repo.save(note)</code> stores a copy. Return an object with three async methods:</p>
<ol>
<li><code>create(ownerId, input)</code> — <code>input</code> is a request body:
<ul><li><code>title</code>: trimmed; missing or empty ⇒ throw <code>Error('title is required')</code>; longer than 100 ⇒ throw <code>Error('title too long')</code>.</li>
<li><code>text</code>: missing <b>or <code>null</code></b> ⇒ <code>''</code> (a destructuring default would keep null — lesson 1.3).</li>
<li><code>tags</code>: missing ⇒ <code>[]</code>; otherwise a NEW array, lowercased, duplicates removed, first-seen order.</li>
<li>Stored note: <code>{ id, ownerId, title, text, tags, createdAt: Date.now(), shareToken }</code> with ids <code>'n1'</code>, <code>'n2'</code>… from a counter private to this service, and <code>shareToken = 'tok-' + id</code>.</li>
<li>Await the save, then return the <b>public</b> note: everything except <code>shareToken</code>.</li></ul></li>
<li><code>get(id)</code> — the public note, or <code>null</code>.</li>
<li><code>update(id, ownerId, changes)</code> — <code>null</code> if missing; <code>Error('forbidden')</code> if <code>ownerId</code> is not the owner; otherwise apply only <code>title</code> (same validation), <code>text</code> and <code>tags</code> (same normalisation) from <code>changes</code> — never <code>id</code>, <code>ownerId</code>, <code>shareToken</code> — set <code>updatedAt: Date.now()</code>, save, return the public note.</li>
</ol>${pre("const svc = createNoteService(repo);\nawait svc.create(9, { title: '  Buy milk ', text: null, tags: ['Home', 'home', 'todo'] });\n// { id: 'n1', ownerId: 9, title: 'Buy milk', text: '', tags: ['home', 'todo'], createdAt: 1767225600000 }\nawait svc.update('n1', 7, { title: 'x' });     // throws Error: forbidden")}<p>The starter "works" on the happy path but has five chapter-1 bugs: no await on save, the null text, shared tag arrays, the leaked <code>shareToken</code>, and <code>Object.assign</code> on the stored note.</p>`,
  vi: `<p>Toàn bộ chương 1 trong một service — đúng dạng src/services/notes.js của Notes API. Viết createNoteService(repo) (repo async) trả ba hàm async: create(ownerId, input) — title trim, thiếu/rỗng ⇒ Error('title is required'), > 100 ⇒ Error('title too long'); text thiếu HOẶC null ⇒ ''; tags thiếu ⇒ [], còn lại mảng MỚI, chữ thường, bỏ trùng, giữ thứ tự gặp đầu; id 'n1', 'n2'… từ bộ đếm riêng của service, shareToken = 'tok-' + id; await save rồi trả note CÔNG KHAI (mọi thứ trừ shareToken). get(id) — note công khai hoặc null. update(id, ownerId, changes) — thiếu ⇒ null; sai chủ ⇒ Error('forbidden'); chỉ áp title (cùng kiểm), text, tags (cùng chuẩn hoá), đặt updatedAt, save, trả note công khai. Code khởi đầu chạy được đường đẹp nhưng có năm bug của chương 1.</p>`,
  yc: [
    ['Validation and normalisation exactly as listed; errors are thrown (the async method rejects).', 'Kiểm và chuẩn hoá đúng như liệt kê; lỗi được ném (hàm async reject).'],
    ['Every save is awaited; the counter is private to each service.', 'Mọi lần save đều được await; bộ đếm riêng cho từng service.'],
    ['Never return <code>shareToken</code>; never mutate inputs or what <code>findById</code> returned.', 'Không bao giờ trả shareToken; không sửa đầu vào hay thứ findById trả.'],
    ['<code>update</code> can only change title/text/tags.', 'update chỉ đổi được title/text/tags.'],
  ],
  goiY: [
    ['Write small helpers first: <code>normTitle(t)</code>, <code>normTags(tags)</code>, <code>toPublic(note)</code> (rest destructuring).', 'Viết hàm nhỏ trước: normTitle(t), normTags(tags), toPublic(note) (rest destructuring).'],
    ['Tags: <code>[...new Set(tags.map((t) =&gt; String(t).toLowerCase()))]</code> — a Set keeps first-seen order.', 'Tags: [...new Set(tags.map((t) => String(t).toLowerCase()))] — Set giữ thứ tự gặp đầu.'],
    ['Update: build <code>const next = { ...note, updatedAt: Date.now() }</code> and set only the allowed fields that are present in <code>changes</code> (<code>\'title\' in changes</code>).', 'Update: dựng next = { ...note, updatedAt: Date.now() } và chỉ gán các trường được phép có trong changes.'],
  ],
  loi: [
    ['<code>repo.save(note)</code> without <code>await</code> — a failed save goes unnoticed and <code>get</code> right after may not see it.', 'repo.save(note) không await — save lỗi không ai biết.'],
    ['<code>const { text = \'\' } = input</code> — a client sending <code>"text": null</code> stores null.', 'const { text = \'\' } = input — client gửi "text": null là lưu null.'],
    ['<code>Object.assign(note, changes)</code> — lets <code>changes.ownerId</code> steal the note.', 'Object.assign(note, changes) — cho changes.ownerId cướp ghi chú.'],
    ['Keeping the id counter at the top of the file — two services (two tests) then share ids.', 'Để bộ đếm id ở đầu tệp — hai service (hai kiểm) dùng chung id.'],
  ],
  gt: ['The factory\'s scope holds the repo and the counter (lesson 1.2), so each service is independent. Each method <code>await</code>s the repo (1.4) and throws on bad input, which an async function turns into a rejection the route will map to 400/403. Normalisation uses <code>??</code> and a Set instead of defaults that skip <code>null</code> (1.3), and every value that leaves the service is a new object without the secret — callers can neither leak <code>shareToken</code> nor mutate stored data, and <code>update</code> copies only the whitelisted fields so <code>id</code>/<code>ownerId</code> cannot be overwritten.',
    'Phạm vi factory giữ repo và bộ đếm (bài 1.2) nên mỗi service độc lập. Mỗi hàm await repo (1.4) và ném lỗi khi đầu vào sai — hàm async biến nó thành reject để route đổi thành 400/403. Chuẩn hoá dùng ?? và Set thay cho giá trị mặc định bỏ sót null (1.3), và mọi giá trị rời service là object mới không có bí mật — bên gọi không làm rò shareToken, không sửa được dữ liệu đã lưu, còn update chỉ chép các trường trong danh sách trắng nên id/ownerId không bị ghi đè.'],
  kn: ['closures', 'references and copies', 'async/await', 'validation'],
  tns: TN,
  viDu: [{ input: "await svc.create(9, { title: '  Buy milk ', text: null, tags: ['Home', 'home', 'todo'] })", output: '{"id":"n1","ownerId":9,"title":"Buy milk","text":"","tags":["home","todo"],"createdAt":1767225600000}', explanation: 'No shareToken in the public note.|||Note công khai không có shareToken.' }],
  chung: `${KHO_GIA}\nconst sleep = (ms) => new Promise((r) => setTimeout(r, ms));\nconst errOf = async (p) => { try { await p; return 'no error'; } catch (e) { return e.message; } };`,
  dau: `function createNoteService(repo) {
  let nextId = 1;
  return {
    async create(ownerId, input) {
      const { title, text = '', tags = [] } = input;
      if (!title) throw new Error('title is required');
      const note = { id: 'n' + nextId++, ownerId, title, text, tags, createdAt: Date.now() };
      note.shareToken = 'tok-' + note.id;
      repo.save(note);
      return note;
    },
    async get(id) {
      return repo.findById(id);
    },
    async update(id, ownerId, changes) {
      const note = await repo.findById(id);
      if (!note) return null;
      Object.assign(note, changes, { updatedAt: Date.now() });
      await repo.save(note);
      return note;
    },
  };
}
`,
  giai: `// Chapter 1 in one service: closure state, safe copies, awaited I/O.
function normTitle(raw) {
  const title = typeof raw === 'string' ? raw.trim() : '';
  if (title === '') throw new Error('title is required');
  if (title.length > 100) throw new Error('title too long');
  return title;
}

function normTags(raw) {
  // a NEW array: lowercased, duplicates removed, first-seen order (Set keeps order)
  return [...new Set((raw ?? []).map((t) => String(t).toLowerCase()))];
}

function toPublic(note) {
  const { shareToken, ...pub } = note; // strip the secret, keep everything else
  return pub;
}

function createNoteService(repo) {
  let nextId = 1; // private to THIS service (closure), not shared through the file

  return {
    async create(ownerId, input) {
      const title = normTitle(input.title);
      const text = input.text ?? '';          // null and undefined both -> ''
      const tags = normTags(input.tags);
      const id = 'n' + nextId++;
      const note = { id, ownerId, title, text, tags, createdAt: Date.now(), shareToken: 'tok-' + id };
      await repo.save(note);                  // await: a failed save rejects create()
      return toPublic(note);
    },

    async get(id) {
      const note = await repo.findById(id);
      return note ? toPublic(note) : null;
    },

    async update(id, ownerId, changes) {
      const note = await repo.findById(id);
      if (!note) return null;
      if (note.ownerId !== ownerId) throw new Error('forbidden');
      const next = { ...note, updatedAt: Date.now() };           // new object, stored copy untouched
      if ('title' in changes) next.title = normTitle(changes.title);
      if ('text' in changes) next.text = changes.text ?? '';
      if ('tags' in changes) next.tags = normTags(changes.tags);
      // id, ownerId and shareToken are never read from changes
      await repo.save(next);
      return toPublic(next);
    },
  };
}
`,
  cases: [
    { moTa: ['create: trims, null text ⇒ "", tags normalised, no shareToken', 'create: trim, text null ⇒ "", chuẩn hoá tags, không shareToken'], chuanBi: 'const svc = createNoteService(mkRepo([]));', goi: "await svc.create(9, { title: '  Buy milk ', text: null, tags: ['Home', 'home', 'todo'] })" },
    { moTa: ['create awaits the save: the note is stored when create resolves', 'create await save'], chuanBi: "const repo = mkRepo([]); const svc = createNoteService(repo); await svc.create(1, { title: 'A' }); const stored = repo._peek('n1');", goi: '[stored && stored.shareToken, stored && stored.text, stored && stored.tags]' },
    { moTa: ['validation errors', 'lỗi kiểm dữ liệu'], chuanBi: 'const svc = createNoteService(mkRepo([]));', goi: "[await errOf(svc.create(1, {})), await errOf(svc.create(1, { title: '   ' })), await errOf(svc.create(1, { title: 'x'.repeat(101) }))]" },
    { moTa: ['update by a non-owner ⇒ forbidden', 'update bởi người không phải chủ ⇒ forbidden'], chuanBi: "const svc = createNoteService(mkRepo([])); await svc.create(9, { title: 'Mine' });", goi: "[await errOf(svc.update('n1', 7, { title: 'stolen' })), (await svc.get('n1')).title]" },
    { an: true, chuanBi: "const repo = mkRepo([]); const svc = createNoteService(repo); await svc.create(9, { title: 'Old', tags: ['a'] }); await sleep(500); const u = await svc.update('n1', 9, { title: ' New ', ownerId: 1, id: 'zz', shareToken: 'x', tags: ['B', 'b'], text: null });", goi: "[u, repo._peek('n1').shareToken, repo._peek('n1').ownerId]" },
    { an: true, chuanBi: "const input = { title: 'T', tags: ['X'] }; const a = createNoteService(mkRepo([])); const b = createNoteService(mkRepo([])); const n1 = await a.create(1, input); const n2 = await b.create(2, input); n1.tags.push('hack');", goi: "[n1.id, n2.id, input.tags, (await a.get('n1')).tags, await a.get('nope'), await a.update('nope', 1, {})]" },
    { an: true, chuanBi: "const svc = createNoteService(mkRepo([])); await svc.create(3, { title: 'Keep', text: 'body' }); const u = await svc.update('n1', 3, { tags: ['Z'] });", goi: "[u.title, u.text, u.tags, 'shareToken' in u, await errOf(svc.update('n1', 3, { title: '' }))]" },
  ],
});

const L2 = jsBai({
  ten: 'Lab 1.2 — importNotes: batches, timeouts and partial failure',
  kho: 'HARD', phut: 35, diem: 30, dangBai: 'lab',
  en: `<p>A user uploads a CSV of old notes. The rows must be saved through <code>save(row)</code> (async; it may reject, and on a bad day it may <b>never answer</b>). Lesson 1.4 gave you every piece: parallel work, its limits ("parallel means a handful at once, not everything"), <code>allSettled</code> for partial failure and <code>Promise.race</code> for timeouts. Write <code>importNotes(rows, save, { batchSize, timeoutMs })</code>:</p>
<ul><li>Split <code>rows</code> into batches of <code>batchSize</code>. Inside a batch, all saves run <b>in parallel</b>; the next batch starts only after the whole current batch settled.</li>
<li>Each save gets <code>timeoutMs</code>: if it has not settled by then, count it as failed with reason <code>'timeout after &lt;timeoutMs&gt;ms'</code>.</li>
<li>One failing row never stops the import. Return <code>{ saved: [indexes], failed: [{ index, reason }] }</code> — indexes into <code>rows</code>, ascending; <code>reason</code> is the error message.</li></ul>${pre("// rows 0..4, batchSize 2, timeoutMs 1000; row 1 rejects 'duplicate id', row 3 never answers\nawait importNotes(rows, save, { batchSize: 2, timeoutMs: 1000 })\n// { saved: [0, 2, 4], failed: [{ index: 1, reason: 'duplicate id' }, { index: 3, reason: 'timeout after 1000ms' }] }")}<p>The starter awaits rows one by one with no timeout: slow, and stuck forever on the first row that never answers.</p>`,
  vi: `<p>Người dùng tải lên CSV ghi chú cũ. Mỗi dòng phải lưu qua save(row) (async; có thể reject, và có ngày KHÔNG BAO GIỜ trả lời). Viết importNotes(rows, save, { batchSize, timeoutMs }): chia lô batchSize; trong lô chạy SONG SONG, lô sau chỉ bắt đầu khi cả lô trước xong; mỗi lần save có timeoutMs, quá giờ ⇒ lỗi 'timeout after &lt;timeoutMs&gt;ms'; một dòng lỗi không dừng việc nhập; trả { saved, failed: [{ index, reason }] } theo chỉ số tăng dần. Code khởi đầu await từng dòng, không có hết giờ: chậm, và kẹt mãi ở dòng đầu tiên không trả lời.</p>`,
  yc: [
    ['Batches of <code>batchSize</code>, parallel inside, sequential between batches.', 'Lô batchSize, song song trong lô, tuần tự giữa các lô.'],
    ['Per-row timeout with the exact reason text.', 'Hết giờ cho từng dòng với đúng chuỗi lý do.'],
    ['Never reject; report every row exactly once, indexes ascending.', 'Không bao giờ reject; báo mỗi dòng đúng một lần, chỉ số tăng dần.'],
  ],
  goiY: [
    ['<code>withTimeout(p, ms)</code>: <code>Promise.race([p, new Promise((_, reject) =&gt; setTimeout(() =&gt; reject(new Error(\'timeout after \' + ms + \'ms\')), ms))])</code>.', 'withTimeout(p, ms) bằng Promise.race với một Promise reject sau ms.'],
    ['Loop <code>for (let start = 0; start &lt; rows.length; start += batchSize)</code>; inside, <code>await Promise.allSettled(batch.map((row) =&gt; withTimeout(save(row), timeoutMs)))</code>.', 'Lặp theo lô; trong lô, await Promise.allSettled(batch.map(... withTimeout ...)).'],
    ['The index of result <code>k</code> of a batch is <code>start + k</code>.', 'Chỉ số của kết quả k trong lô là start + k.'],
  ],
  loi: [
    ['<code>Promise.all(rows.map(save))</code> — all 5 000 rows at once (the lesson\'s pool-exhaustion warning), and one failure loses the whole report.', 'Promise.all(rows.map(save)) — 5 000 dòng cùng lúc (cảnh báo cạn pool của bài), và một lỗi mất cả báo cáo.'],
    ['No timeout — a save that never answers keeps the import pending forever (the starter).', 'Không có hết giờ — một save không bao giờ trả lời giữ việc nhập treo mãi (code khởi đầu).'],
    ['Starting all batches at once with <code>map</code> — the batches overlap and the limit means nothing.', 'Bắt đầu mọi lô cùng lúc bằng map — các lô chồng nhau và giới hạn vô nghĩa.'],
  ],
  gt: ['Batching gives a hard upper bound on concurrent saves (the database pool stays healthy) while keeping most of the speed of parallel work: total time ≈ number of batches × the slowest save of each batch. <code>allSettled</code> turns each row into a record instead of letting the first rejection abort everything, and racing every save against a rejecting timer guarantees each batch settles within <code>timeoutMs</code> even if a save never answers. Mapping results back with <code>start + k</code> keeps the report in input order.',
    'Chia lô cho một trần cứng về số lần lưu đồng thời (pool CSDL khoẻ) mà vẫn giữ phần lớn tốc độ song song: tổng thời gian ≈ số lô × lần lưu chậm nhất mỗi lô. allSettled biến mỗi dòng thành một bản ghi thay vì để reject đầu tiên huỷ tất cả, và đua mỗi lần lưu với một hẹn giờ reject bảo đảm mỗi lô xong trong timeoutMs dù có lần lưu không trả lời. Ghép kết quả bằng start + k giữ báo cáo đúng thứ tự đầu vào.'],
  kn: ['Promise.allSettled', 'Promise.race timeouts', 'bounded concurrency'],
  tns: TN,
  viDu: [{ input: "await importNotes(rows /* row 1 rejects, row 3 hangs */, save, { batchSize: 2, timeoutMs: 1000 })", output: '{"saved":[0,2,4],"failed":[{"index":1,"reason":"duplicate id"},{"index":3,"reason":"timeout after 1000ms"}]}', explanation: 'Batches [0,1] [2,3] [4]; the starter never finishes.|||Các lô [0,1] [2,3] [4]; code khởi đầu không bao giờ xong.' }],
  chung: `const mkSave = () => { const s = { inFlight: 0, peak: 0, starts: [] };
  s.save = (row) => { s.inFlight++; s.peak = Math.max(s.peak, s.inFlight); s.starts.push(row.id + '@' + (Date.now() - 1767225600000));
    if (row.hang) return new Promise(() => {});
    return new Promise((ok, ko) => setTimeout(() => { s.inFlight--; row.err ? ko(new Error(row.err)) : ok({ id: row.id }); }, row.ms ?? 100)); };
  return s; };
const rows5 = [{ id: 'a' }, { id: 'b', err: 'duplicate id' }, { id: 'c', ms: 300 }, { id: 'd', hang: true }, { id: 'e' }];`,
  dau: `async function importNotes(rows, save, { batchSize, timeoutMs }) {
  const saved = [], failed = [];
  for (let i = 0; i < rows.length; i++) {
    try {
      await save(rows[i]);
      saved.push(i);
    } catch (e) {
      failed.push({ index: i, reason: e.message });
    }
  }
  return { saved, failed };
}
`,
  giai: `// Race the work against a timer that rejects: whichever settles first wins.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout after ' + ms + 'ms')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer)); // no stray timer
}

async function importNotes(rows, save, { batchSize, timeoutMs }) {
  const saved = [];
  const failed = [];
  // batches run one after another: at most batchSize saves in flight
  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize);
    // inside a batch: parallel, partial failure allowed, every save bounded in time
    const results = await Promise.allSettled(batch.map((row) => withTimeout(save(row), timeoutMs)));
    results.forEach((r, k) => {
      const index = start + k;               // back to the position in "rows"
      if (r.status === 'fulfilled') saved.push(index);
      else failed.push({ index, reason: r.reason.message });
    });
  }
  return { saved, failed };                  // never rejects
}
`,
  cases: [
    { moTa: ['the brief example: one rejection, one hang', 'ví dụ trong đề: một reject, một treo'], chuanBi: 'const s = mkSave();', goi: 'await importNotes(rows5, s.save, { batchSize: 2, timeoutMs: 1000 })' },
    { moTa: ['batches: parallel inside, one after another (start times)', 'lô: song song bên trong, lần lượt giữa các lô'], chuanBi: "const s = mkSave(); await importNotes([{ id: 'a' }, { id: 'b', ms: 300 }, { id: 'c' }, { id: 'd' }, { id: 'e' }], s.save, { batchSize: 2, timeoutMs: 1000 });", goi: '[s.starts, s.peak]' },
    { moTa: ['total time ≈ batches × slowest save (virtual ms)', 'tổng thời gian ≈ số lô × lần chậm nhất'], chuanBi: 'const s = mkSave(); const t = Date.now(); await importNotes(Array.from({ length: 6 }, (_, i) => ({ id: i })), s.save, { batchSize: 3, timeoutMs: 1000 });', goi: 'Date.now() - t' },
    { an: true, chuanBi: "const s = mkSave(); const t = Date.now(); const r = await importNotes([{ id: 1, hang: true }, { id: 2, hang: true }, { id: 3, err: 'bad title' }], s.save, { batchSize: 5, timeoutMs: 250 });", goi: '[r, Date.now() - t]' },
    { an: true, chuanBi: "const s = mkSave(); const r = await importNotes(Array.from({ length: 7 }, (_, i) => ({ id: i, ms: 50 + i * 10, err: i % 3 === 2 ? 'row ' + i + ' invalid' : undefined })), s.save, { batchSize: 3, timeoutMs: 1000 });", goi: '[r, s.peak, s.starts.length]' },
    { an: true, chuanBi: 'const s = mkSave();', goi: 'await importNotes([], s.save, { batchSize: 3, timeoutMs: 100 })' },
  ],
});

const L3 = modBai({
  ten: 'Lab 1.3 — Ship the list endpoint logic as ES modules',
  kho: 'MEDIUM', phut: 25, diem: 30, dangBai: 'lab',
  tepChinh: 'src/index.js',
  en: `<p>Wire three files the way this website's backend is written ("type": "module", pure ESM). The starter was half-converted from CommonJS and does not even load.</p>
<ul>
<li><code>src/config.js</code> — a <b>named</b> export <code>LIMITS = { titleMax: 100, page: { defaultLimit: 20, maxLimit: 100 } }</code>, frozen at <b>every</b> level (lesson 1.1: freeze is shallow).</li>
<li><code>src/lib/pagination.js</code> — a named export <code>readPagination(query)</code> that reads <code>LIMITS</code> from <code>../config.js</code>: page missing/invalid ⇒ 1 (whole number ≥ 1 kept); limit missing ⇒ <code>defaultLimit</code>, a whole number ≥ 0 kept (<code>'0'</code> stays 0 — lesson 1.3), capped at <code>maxLimit</code>, invalid ⇒ <code>defaultLimit</code>.</li>
<li><code>src/index.js</code> — a <b>default</b> export <code>listNotes(notes, query)</code> returning <code>{ page, limit, total, items }</code> where <code>items</code> is the requested page of <code>notes</code> (a new array), and it re-exports <code>readPagination</code> as a named export.</li>
</ul>${pre("import listNotes from './src/index.js';\nlistNotes([n1, n2, n3, n4, n5], { page: '2', limit: '2' })\n// { page: 2, limit: 2, total: 5, items: [n3, n4] }")}`,
  vi: `<p>Nối ba tệp đúng kiểu backend của web này ("type": "module", ESM thuần). Code khởi đầu chuyển dở từ CommonJS nên còn không nạp được. config.js: export có tên LIMITS đóng băng MỌI tầng. lib/pagination.js: export có tên readPagination(query) đọc LIMITS từ ../config.js (page thiếu/sai ⇒ 1; limit thiếu ⇒ defaultLimit, số nguyên ≥ 0 giữ nguyên — '0' giữ 0, trần maxLimit, sai ⇒ defaultLimit). index.js: export mặc định listNotes(notes, query) trả { page, limit, total, items } và export lại readPagination.</p>`,
  yc: [
    ['All three files load as ES modules (relative imports with <code>.js</code>, no require/module.exports).', 'Ba tệp nạp được như ES module (import tương đối có .js, không require/module.exports).'],
    ['<code>LIMITS</code> and <code>LIMITS.page</code> are both frozen.', 'LIMITS và LIMITS.page đều bị đóng băng.'],
    ['Pagination rules as listed; <code>listNotes</code> returns a new <code>items</code> array.', 'Luật phân trang như liệt kê; listNotes trả mảng items mới.'],
  ],
  goiY: [
    ['From <code>src/lib/pagination.js</code>, the config is one folder up: <code>\'../config.js\'</code>. From <code>src/index.js</code>, the helper is <code>\'./lib/pagination.js\'</code>.', 'Từ src/lib/pagination.js, config ở trên một cấp: \'../config.js\'. Từ src/index.js, helper là \'./lib/pagination.js\'.'],
    ['Re-export in one line: <code>export { readPagination } from \'./lib/pagination.js\';</code> (you may also import it for use).', 'Export lại một dòng: export { readPagination } from \'./lib/pagination.js\';'],
    ['Items: <code>notes.slice((page - 1) * limit, page * limit)</code>.', 'Items: notes.slice((page - 1) * limit, page * limit).'],
  ],
  loi: [
    ['Leaving one <code>module.exports</code> behind — ReferenceError at load time, nothing works.', 'Để sót một module.exports — ReferenceError lúc nạp, không gì chạy.'],
    ['<code>Object.freeze(LIMITS)</code> only — <code>LIMITS.page.maxLimit = 1e9</code> still works.', 'Chỉ Object.freeze(LIMITS) — LIMITS.page.maxLimit = 1e9 vẫn được.'],
    ['<code>Number(q.limit) || defaultLimit</code> — limit 0 becomes 20.', 'Number(q.limit) || defaultLimit — limit 0 thành 20.'],
  ],
  gt: ['Three lessons meet here. ESM (1.5): static named/default exports, relative specifiers with extensions, and a re-export line that forwards a binding without copying it. References (1.1/1.3): freezing each level makes the shared config truly read-only for every importer — and every importer gets the same object, because a module is evaluated once. Pagination checks "missing" before converting, so a deliberate 0 survives and invalid input falls back to the configured default.',
    'Ba bài gặp nhau ở đây. ESM (1.5): export có tên/mặc định tĩnh, đường dẫn tương đối có đuôi, và dòng export lại chuyển tiếp một ràng buộc mà không sao chép. Tham chiếu (1.1/1.3): đóng băng từng tầng làm cấu hình dùng chung thật sự chỉ-đọc với mọi bên import — và mọi bên nhận cùng một object vì module chỉ được thực thi một lần. Phân trang kiểm "thiếu" trước khi đổi kiểu nên số 0 cố ý được giữ và đầu vào sai rơi về mặc định đã cấu hình.'],
  kn: ['ES modules', 'Object.freeze', 'pagination'],
  tns: TN,
  viDu: [{ input: "listNotes([n1, n2, n3, n4, n5], { page: '2', limit: '2' })", output: '{"page":2,"limit":2,"total":5,"items":[n3,n4]}', explanation: 'The starter fails to load.|||Code khởi đầu không nạp được.' }],
  dau: {
    'src/index.js': `import { readPagination } from './lib/pagination';

function listNotes(notes, query) {
  const { page, limit } = readPagination(query);
  return { page, limit, total: notes.length, items: notes.slice((page - 1) * limit, page * limit) };
}

module.exports = listNotes;
`,
    'src/lib/pagination.js': `const { LIMITS } = require('../config.js');

export function readPagination(query) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || LIMITS.page.defaultLimit, LIMITS.page.maxLimit);
  return { page, limit };
}
`,
    'src/config.js': `export const LIMITS = Object.freeze({
  titleMax: 100,
  page: { defaultLimit: 20, maxLimit: 100 },
});
`,
  },
  giai: {
    'src/index.js': `// ESM entry: default export + a named re-export (relative paths WITH .js).
import { readPagination } from './lib/pagination.js';

export { readPagination } from './lib/pagination.js';

export default function listNotes(notes, query) {
  const { page, limit } = readPagination(query);
  return {
    page,
    limit,
    total: notes.length,
    items: notes.slice((page - 1) * limit, page * limit), // slice = a NEW array
  };
}
`,
    'src/lib/pagination.js': `// Reads the shared, frozen config one folder up.
import { LIMITS } from '../config.js';

function toInt(raw, fallback, min) {
  if (raw === undefined || raw === null || raw === '') return fallback; // "missing" on the RAW value
  const n = Number(raw);
  return Number.isInteger(n) && n >= min ? n : fallback;
}

export function readPagination(query) {
  const { defaultLimit, maxLimit } = LIMITS.page;
  const page = toInt(query.page, 1, 1);
  const limit = Math.min(toInt(query.limit, defaultLimit, 0), maxLimit); // '0' stays 0
  return { page, limit };
}
`,
    'src/config.js': `// Frozen at EVERY level: Object.freeze alone is shallow (lesson 1.1).
const page = Object.freeze({ defaultLimit: 20, maxLimit: 100 });

export const LIMITS = Object.freeze({
  titleMax: 100,
  page,
});
`,
  },
  kiem: [
    { moTa: bi('src/index.js loads as an ES module', 'src/index.js nạp được'), kiem: 'nap-duoc' },
    { moTa: bi('listNotes returns the requested page', 'listNotes trả đúng trang'), goi: "__module('./index.js').default([1, 2, 3, 4, 5].map((id) => ({ id })), { page: '2', limit: '2' })", mongDoi: { page: 2, limit: 2, total: 5, items: [{ id: 3 }, { id: 4 }] } },
    { moTa: bi('LIMITS is frozen at every level', 'LIMITS đóng băng mọi tầng'), goi: "(() => { const L = __module('./config.js').LIMITS; try { L.page.maxLimit = 1e9; } catch (e) {} return [Object.isFrozen(L), Object.isFrozen(L.page), L.page.maxLimit]; })()", mongDoi: [true, true, 100] },
    { moTa: bi('readPagination is re-exported; limit 0 survives', 'readPagination được export lại; limit 0 giữ nguyên'), goi: "[__module('./index.js').readPagination({ limit: '0' }), __module('./index.js').readPagination({})]", mongDoi: [{ page: 1, limit: 0 }, { page: 1, limit: 20 }] },
    { moTa: bi('hidden: caps, invalid values, items is a new array', 'ẩn: trần, giá trị sai, items là mảng mới'), an: true, goi: "(() => { const m = __module('./index.js'); const notes = [{ id: 1 }, { id: 2 }]; const r = m.default(notes, { page: '0', limit: '500' }); r.items.push({ id: 99 }); return [r.page, r.limit, notes.length, m.readPagination({ page: 'x', limit: '-1' }), m.default(notes, { page: '3', limit: '1' }).items]; })()", mongDoi: [1, 100, 2, { page: 1, limit: 20 }, []] },
    { moTa: bi('no CommonJS left', 'không còn CommonJS'), kiem: 'ma-nguon', khop: '\\brequire\\s*\\(|module\\.exports', phuDinh: true },
  ],
});

export default modul('nodejs-1-lab-notes-service', 'Lab 1 — A Notes service in plain JavaScript', [L1, L2, L3], 'nodejs-1-5-module');
