/** Node.js · Lab 18 — Kiểm định kiến trúc Notes API bằng số (tầng, hub, vòng, bảng dùng chung) rồi gỡ vòng notes ⇄ email bằng sự kiện. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const L1 = cs({
  ten: 'Lab 18 · 1 — The architecture review meeting', kho: 'EASY', phut: 6, dangBai: 'lab',
  en: 'Your Notes API: 12 route files (5 call Prisma directly), notes.service ⇄ email.service, stats.service runs raw SQL on notes, two developers, 95% of request time in the database.',
  vi: 'Notes API của bạn: 12 tệp route (5 tệp gọi Prisma trực tiếp), notes.service ⇄ email.service, stats.service chạy SQL thô trên bảng notes, hai lập trình viên, 95% thời gian request nằm ở CSDL.',
  cau: [
    q('c1', ['Product asks for soft-delete: deleted notes must disappear everywhere. What is the risk, and the first move?', 'Sản phẩm yêu cầu soft-delete: ghi chú đã xoá phải biến mất ở mọi nơi. Rủi ro là gì, và bước đầu tiên?'],
      ['Up to 5 route files plus stats’ raw SQL can miss the filter (an IDOR-shaped leak); route them through the notes service first', 'Prisma middleware will apply it everywhere, so only the schema must change', 'Soft-delete needs a separate service, so split notes out of the monolith first', 'None: deleted notes are rarely requested, so a missed filter is harmless'],
      ['The cost of skipping the layer arrives exactly on the day a rule must apply everywhere. Measure first (which files), then make the service the only way in.', 'Cái giá của việc bỏ tầng đến đúng vào ngày một luật phải áp ở mọi nơi. Đo trước (tệp nào), rồi biến service thành lối vào duy nhất.']),
    q('c2', ['A colleague proposes splitting auth, notes and search into three services “so it scales”. Your answer with numbers?', 'Một đồng nghiệp đề xuất tách auth, notes và search thành ba dịch vụ “để mở rộng”. Câu trả lời bằng số của bạn?'],
      ['No: none of the three signals holds, and each call would cost ~0.072 ms instead of 2 ns', 'Yes: three services triple the throughput of an I/O-bound API like this one', 'Yes, but only if each of the three services gets its own database from day one', 'No, because Node.js cannot run more than one service on the same machine'],
      ['Do a modular monolith (facades + table owners) instead; change your mind on a measured pain: a different scaling profile, a different cadence, or a separate team.', 'Hãy làm khối nguyên mô-đun (facade + chủ bảng); đổi ý khi có một nỗi đau đo được: khác cấu hình mở rộng, khác nhịp phát hành, hoặc một nhóm riêng.']),
    qn('c3', ['Which items go into the review’s written record? (choose all that apply)', 'Những gì đi vào biên bản của buổi review? (chọn mọi câu đúng)'],
      ['An ADR for “modular monolith, not services”, with what we now cannot do', '“Revisit when: a second process appears” next to the in-memory cache', 'The list of the 5 route files that skip the service, as debt with its cost', 'A rule that every file must be under 300 lines'],
      [0, 1, 2],
      ['Records live next to the code and say why; debt is listed by what it makes expensive. A line-count rule applied without judgement creates pointless refactoring (the seed file of 18.2).', 'Biên bản nằm cạnh mã và nói vì sao; nợ được liệt kê theo thứ nó làm đắt lên. Luật đếm dòng áp dụng không suy xét sinh ra tái cấu trúc vô ích (tệp seed của 18.2).']),
  ],
  goiY: [['Ask where an “everywhere” rule can be forgotten.', 'Hỏi một luật “ở mọi nơi” có thể bị quên ở đâu.'], ['Bring numbers to the split discussion.', 'Mang con số tới cuộc bàn về tách.']],
  loi: [['Splitting to fix coupling inside one codebase.', 'Tách để chữa ghép nối bên trong một codebase.'], ['Leaving decisions in a chat thread.', 'Để quyết định nằm trong một luồng chat.']],
  tns: [tn('architecture review', 'review kiến trúc')],
  kn: ['architecture'],
});

function architectureReport(files) {
  // files: [{ path, lines, imports: [paths of other files], tables: [tables it queries directly] }]
  const isRoute = (p) => p.startsWith('src/routes/');
  const isService = (p) => p.startsWith('src/services/');
  const usesDb = (f) => f.tables.length > 0;
  const routes = files.filter((f) => isRoute(f.path));
  const services = files.filter((f) => isService(f.path));
  const sum = (xs) => xs.reduce((s, f) => s + f.lines, 0);
  // 18.1 — route chạm CSDL mà không đi qua service nào
  const skipping = routes.filter((f) => usesDb(f) && !f.imports.some(isService)).map((f) => f.path).sort();
  // 18.3 — hub theo fan-in, kèm fan-out
  const fanIn = new Map(files.map((f) => [f.path, new Set()]));
  for (const f of files) for (const t of f.imports) if (fanIn.has(t) && t !== f.path) fanIn.get(t).add(f.path);
  const hub = [...fanIn].map(([p, s]) => ({ path: p, fanIn: s.size, fanOut: new Set(files.find((f) => f.path === p).imports.filter((t) => t !== p)).size }))
    .sort((a, b) => b.fanIn - a.fanIn || (a.path < b.path ? -1 : 1))[0] || null;
  // 18.3 — cặp import lẫn nhau
  const imp = new Set(files.flatMap((f) => f.imports.map((t) => `${f.path}|${t}`)));
  const cycles = [...new Set(files.flatMap((f) => f.imports.filter((t) => t !== f.path && imp.has(`${t}|${f.path}`)).map((t) => (f.path < t ? `${f.path} <-> ${t}` : `${t} <-> ${f.path}`))))].sort();
  // 18.3 — bảng bị truy vấn từ nhiều chỗ nhất (ghép nối ẩn)
  const byTable = {};
  for (const f of files) for (const t of new Set(f.tables)) byTable[t] = (byTable[t] || 0) + 1;
  const shared = Object.entries(byTable).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0] || null;
  return {
    routes: routes.length,
    routesSkippingService: skipping,
    ratio: sum(routes) ? Number((sum(services) / sum(routes)).toFixed(1)) : null,
    topHub: hub && hub.fanIn > 0 ? hub : null,
    cycles,
    mostSharedTable: shared ? { table: shared[0], places: shared[1] } : null,
  };
}
const F = (path, lines, imports = [], tables = []) => ({ path, lines, imports, tables });
const NOTES_API = [
  F('src/routes/notes.routes.ts', 160, ['src/services/notes.service.ts', 'src/middleware/auth.ts']),
  F('src/routes/categories.routes.ts', 40, [], ['category']),
  F('src/routes/admin.routes.ts', 520, ['src/middleware/auth.ts'], ['user', 'note']),
  F('src/routes/stats.routes.ts', 90, ['src/services/stats.service.ts'], []),
  F('src/services/notes.service.ts', 600, ['src/services/email.service.ts', 'src/services/pro.service.ts'], ['note', 'user']),
  F('src/services/email.service.ts', 220, ['src/services/notes.service.ts'], []),
  F('src/services/stats.service.ts', 180, ['src/services/pro.service.ts'], ['note']),
  F('src/services/pro.service.ts', 120, [], ['subscription']),
  F('src/middleware/auth.ts', 80, ['src/services/pro.service.ts'], ['user']),
];
const L2 = await jsBai({
  ten: 'Lab 18 · 2 — architectureReport(files): measure the Notes API like chapter 18 measured the website', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: '<p>One report that combines 18.1–18.3. <code>files</code> are <code>{ path, lines, imports, tables }</code>: <code>imports</code> are paths of other files of the repo, <code>tables</code> the tables the file queries directly. Routes are under <code>src/routes/</code>, services under <code>src/services/</code>. Return:</p><ul><li><code>routes</code> — number of route files;</li><li><code>routesSkippingService</code> — sorted paths of route files that query a table but import no service;</li><li><code>ratio</code> — service lines ÷ route lines, 1 decimal (<code>null</code> if no route lines);</li><li><code>topHub</code> — the file with the most distinct importers (ties by path A→Z) as <code>{ path, fanIn, fanOut }</code> (self-imports ignored; fan-out = distinct imports), or <code>null</code> if nothing is imported;</li><li><code>cycles</code> — sorted <code>"a &lt;-&gt; b"</code> for every pair importing each other (smaller path first);</li><li><code>mostSharedTable</code> — <code>{ table, places }</code> for the table queried by the most files (ties by name A→Z), or <code>null</code>.</li></ul>',
  vi: '<p>Một báo cáo gộp 18.1–18.3. <code>files</code> là <code>{ path, lines, imports, tables }</code>: <code>imports</code> là đường dẫn các tệp khác của repo, <code>tables</code> là các bảng tệp truy vấn trực tiếp. Route nằm dưới <code>src/routes/</code>, service dưới <code>src/services/</code>. Trả về:</p><ul><li><code>routes</code> — số tệp route;</li><li><code>routesSkippingService</code> — đường dẫn (đã sắp) các tệp route truy vấn bảng mà không import service nào;</li><li><code>ratio</code> — số dòng service ÷ số dòng route, 1 chữ số (<code>null</code> nếu không có dòng route);</li><li><code>topHub</code> — tệp có nhiều nơi import khác nhau nhất (hoà theo path A→Z) dạng <code>{ path, fanIn, fanOut }</code> (bỏ tự-import; fan-out = số import khác nhau), hoặc <code>null</code> nếu không gì được import;</li><li><code>cycles</code> — <code>"a &lt;-&gt; b"</code> (đã sắp) cho mọi cặp import lẫn nhau (path nhỏ trước);</li><li><code>mostSharedTable</code> — <code>{ table, places }</code> cho bảng được nhiều tệp truy vấn nhất (hoà theo tên A→Z), hoặc <code>null</code>.</li></ul>',
  goiY: [['Reuse your pieces: layerReport (18.1), hubs and mutualPairs (18.3), hiddenCoupling’s counting (18.3).', 'Dùng lại các mảnh của bạn: layerReport (18.1), hubs và mutualPairs (18.3), phần đếm của hiddenCoupling (18.3).'], ['Build fan-in only over files that exist in the list; count each importer once.', 'Chỉ dựng fan-in trên các tệp có trong danh sách; mỗi nơi import đếm một lần.']],
  loi: [['Counting middleware/auth.ts as a route that skips the service: it is middleware, outside src/routes/.', 'Tính middleware/auth.ts là route bỏ qua service: nó là middleware, nằm ngoài src/routes/.'], ['Reporting the biggest file as the hub: size is not fan-in.', 'Báo tệp to nhất là hub: kích thước không phải fan-in.']],
  gt: ['On the sample: two routes reach the database with no service (admin and categories), pro.service is the healthy hub (3 importers, 0 imports), notes ⇄ email is the one cycle, and the note/user tables are each queried from three places. Each line of the report is a decision for the review of Lab 18 · 1 — and the cycle is what Lab 18 · 3 removes.', 'Trên mẫu: hai route chạm CSDL mà không qua service (admin và categories), pro.service là hub lành (3 nơi import, 0 import), notes ⇄ email là vòng duy nhất, và bảng note/user mỗi bảng bị truy vấn từ ba chỗ. Mỗi dòng của báo cáo là một quyết định cho buổi review ở Lab 18 · 1 — và vòng chính là thứ Lab 18 · 3 gỡ bỏ.'],
  kn: ['architecture', 'measurement', 'graphs'],
  tns: [tn('fitness function', 'hàm kiểm kiến trúc', 'an automated check that an architecture rule still holds')],
  dau: `/** chapter 18 in one report */
function architectureReport(files) {
  // Write your solution here
  const routes = files.filter((f) => f.path.includes('routes'));
  return { routes: routes.length, routesSkippingService: [], ratio: null, topHub: null, cycles: [], mostSharedTable: null };
}
`,
  giai: '// Reference solution\n' + nguon(architectureReport),
  cases: [
    { goi: goi('architectureReport', NOTES_API), moTa: ['The Notes API of the lab', 'Notes API của lab'] },
    { goi: goi('architectureReport', [F('src/routes/a.routes.ts', 10, ['src/services/a.service.ts']), F('src/services/a.service.ts', 25, [], ['a'])]), moTa: ['A clean two-file feature', 'Một tính năng hai tệp sạch sẽ'] },
    { goi: goi('architectureReport', [...NOTES_API, F('src/routes/search.routes.ts', 70, ['src/routes/search.routes.ts'], ['note']), F('src/services/x.service.ts', 10, ['src/services/y.service.ts']), F('src/services/y.service.ts', 10, ['src/services/x.service.ts'])]), an: true },
    { goi: goi('architectureReport', []), an: true },
  ],
});

function createBus() {
  // Bus sự kiện trong tiến trình: bên phát không biết ai nghe; lỗi của một bên nghe không làm hỏng bên phát.
  const handlers = new Map();
  const errors = [];
  return {
    on(type, fn) { (handlers.get(type) || handlers.set(type, []).get(type)).push(fn); },
    async publish(type, payload) {
      for (const fn of handlers.get(type) || []) {
        try { await fn(payload); } catch (e) { errors.push(`${type}: ${e.message}`); }
      }
    },
    errors,
  };
}
function createNotesModule({ repo, bus }) {
  // Facade của module notes: KHÔNG import email. Nó phát một SỰ KIỆN mang dữ liệu cần thiết (title) — sự thật, không phải mệnh lệnh.
  return {
    async share(user, noteId, to) {
      const note = await repo.get(noteId);
      if (!note) { const e = new Error('NOTE_NOT_FOUND'); e.status = 404; throw e; }
      if (note.authorId !== user.id) { const e = new Error('FORBIDDEN'); e.status = 403; throw e; }   // quyền sở hữu, kiểm ở service
      await repo.addShare(noteId, to);
      await bus.publish('note.shared', { noteId, title: note.title, to, by: user.name });
      return { noteId, to };
    },
  };
}
function createEmailSubscriber(bus, send) {
  // Email chỉ biết hình dạng sự kiện — không import notes ⇒ vòng notes ⇄ email biến mất.
  bus.on('note.shared', (e) => send(e.to, `${e.by} shared a note with you`, `"${e.title}" — open it in Notes.`));
}
const SETUP = `const notes = new Map([[1, { id: 1, authorId: 7, title: 'Streams & back-pressure' }]]); const shares = [];
  const repo = { get: async (id) => notes.get(id) || null, addShare: async (id, to) => { shares.push([id, to]); } };
  const sent = []; const bus = createBus(); createEmailSubscriber(bus, async (to, subject, body) => { sent.push({ to, subject, body }); });
  const mod = createNotesModule({ repo, bus }); const an = { id: 7, name: 'An' };`;
const L3 = await jsBai({
  ten: 'Lab 18 · 3 — createBus + createNotesModule + createEmailSubscriber: break notes ⇄ email with an event', kho: 'HARD', phut: 30, dangBai: 'lab',
  en: '<p>notes.service imports email.service to send “note shared” mails, and email.service imports notes.service to put the title in the template. Break the cycle without splitting anything. Write:</p><ul><li><code>createBus()</code> → <code>{ on(type, fn), async publish(type, payload), errors }</code>: handlers run in registration order and are awaited one by one; a handler that throws or rejects does not stop the others or the publisher — push <code>"&lt;type&gt;: &lt;message&gt;"</code> into <code>errors</code>;</li><li><code>createNotesModule({ repo, bus })</code> → <code>{ async share(user, noteId, to) }</code>: <code>await repo.get(noteId)</code>; missing ⇒ throw an Error with message <code>"NOTE_NOT_FOUND"</code>; not the author (<code>authorId !== user.id</code>) ⇒ <code>"FORBIDDEN"</code>; else <code>await repo.addShare(noteId, to)</code>, publish <code>"note.shared"</code> with <code>{ noteId, title, to, by: user.name }</code>, return <code>{ noteId, to }</code>;</li><li><code>createEmailSubscriber(bus, send)</code> — on <code>"note.shared"</code> call <code>send(to, "&lt;by&gt; shared a note with you", "\\"&lt;title&gt;\\" — open it in Notes.")</code>.</li></ul><p>The notes code must not call <code>send</code>, and the email code must not call <code>repo</code>.</p>',
  vi: '<p>notes.service import email.service để gửi thư “đã chia sẻ ghi chú”, còn email.service import notes.service để đưa tiêu đề vào mẫu thư. Hãy phá vòng mà không tách gì ra. Viết:</p><ul><li><code>createBus()</code> → <code>{ on(type, fn), async publish(type, payload), errors }</code>: các handler chạy theo thứ tự đăng ký và được await lần lượt; handler ném lỗi hay reject không làm dừng các handler khác hay bên phát — đẩy <code>"&lt;type&gt;: &lt;message&gt;"</code> vào <code>errors</code>;</li><li><code>createNotesModule({ repo, bus })</code> → <code>{ async share(user, noteId, to) }</code>: <code>await repo.get(noteId)</code>; không có ⇒ ném Error với message <code>"NOTE_NOT_FOUND"</code>; không phải tác giả (<code>authorId !== user.id</code>) ⇒ <code>"FORBIDDEN"</code>; không thì <code>await repo.addShare(noteId, to)</code>, phát <code>"note.shared"</code> với <code>{ noteId, title, to, by: user.name }</code>, trả <code>{ noteId, to }</code>;</li><li><code>createEmailSubscriber(bus, send)</code> — khi có <code>"note.shared"</code> gọi <code>send(to, "&lt;by&gt; shared a note with you", "\\"&lt;title&gt;\\" — open it in Notes.")</code>.</li></ul><p>Mã notes không được gọi <code>send</code>, mã email không được gọi <code>repo</code>.</p>',
  yc: [['The event carries the data the subscriber needs (the title): the subscriber never reads the notes table.', 'Sự kiện mang dữ liệu bên nghe cần (tiêu đề): bên nghe không bao giờ đọc bảng notes.'], ['A failing email must not fail the share.', 'Thư gửi lỗi không được làm hỏng lần chia sẻ.']],
  goiY: [['The bus is a Map from type to an array of handlers; publish loops with try/await/catch.', 'Bus là một Map từ loại sự kiện tới mảng handler; publish lặp với try/await/catch.'], ['Ownership is checked in the notes service before anything is written or published.', 'Quyền sở hữu được kiểm trong service notes trước khi ghi hay phát bất cứ gì.']],
  loi: [['A “thin” event with only noteId: the email subscriber must then query notes — the cycle is back, hidden in the database.', 'Sự kiện “mỏng” chỉ có noteId: bên email khi đó phải truy vấn notes — vòng quay lại, trốn trong CSDL.'], ['Letting a subscriber error bubble up: the SMTP provider being down now breaks sharing.', 'Để lỗi của bên nghe nổi lên: nhà cung cấp SMTP sập là chia sẻ hỏng theo.']],
  gt: ['“A note was shared” is a fact; who cares about it (email, notifications, analytics) is not the note module’s business. notes now imports nothing of email and email nothing of notes — two independent modules meeting through a shape. Chapter 13’s queue makes the same boundary durable across a crash or a second process.', '“Một ghi chú đã được chia sẻ” là một sự thật; ai quan tâm tới nó (email, thông báo, phân tích) không phải việc của module notes. notes giờ không import gì của email và email không import gì của notes — hai module độc lập gặp nhau qua một hình dạng. Hàng đợi của chương 13 làm ranh giới đó bền qua cả khi sập hay có tiến trình thứ hai.'],
  kn: ['events', 'decoupling', 'architecture'],
  tns: [tn('event bus', 'bus sự kiện'), tn('publisher / subscriber', 'bên phát / bên nghe'), tn('fat event', 'sự kiện “dày”', 'carries the data subscribers need')],
  dau: `/** notes and email, still coupled */
function createBus() {
  const handlers = {};
  return { on(t, fn) { handlers[t] = fn; }, async publish(t, p) { if (handlers[t]) await handlers[t](p); }, errors: [] };
}
function createNotesModule({ repo, bus }) {
  return {
    async share(user, noteId, to) {
      // Write your solution here
      await repo.addShare(noteId, to);
      await bus.publish('note.shared', { noteId, to });
      return { noteId, to };
    },
  };
}
function createEmailSubscriber(bus, send) {
  bus.on('note.shared', async (e) => send(e.to, 'A note was shared with you', 'Open it in Notes.'));
}
`,
  giai: '// Reference solution\n' + nguon(createBus, createNotesModule, createEmailSubscriber),
  cases: [
    { chuanBi: SETUP, goi: 'await (async () => { const r = await mod.share(an, 1, "binh@example.com"); return { r, shares, sent }; })()', moTa: ['An shares her note with Bình', 'An chia sẻ ghi chú với Bình'] },
    { chuanBi: SETUP, goi: 'await (async () => { const errs = []; for (const [u, id] of [[{ id: 8, name: "Binh" }, 1], [an, 99]]) { try { await mod.share(u, id, "x@example.com"); } catch (e) { errs.push(e.message); } } return { errs, shares, sent }; })()', moTa: ['Not the author; a missing note', 'Không phải tác giả; ghi chú không tồn tại'] },
    { chuanBi: `${SETUP} bus.on('note.shared', async () => { throw new Error('SMTP down'); }); const seen = []; bus.on('note.shared', (e) => seen.push(e.noteId));`, goi: 'await (async () => { const r = await mod.share(an, 1, "chi@example.com"); return { r, sent: sent.length, seen, errors: bus.errors }; })()', an: true },
    { chuanBi: 'const bus = createBus(); const order = []; bus.on("a", async () => { await new Promise((r) => setTimeout(r, 10)); order.push(1); }); bus.on("a", () => order.push(2)); bus.on("b", () => order.push(3));', goi: 'await (async () => { await bus.publish("a", {}); await bus.publish("none", {}); return order; })()', an: true },
  ],
});

export default modul('nodejs-18-lab-kien-truc', 'Lab 18 — Reviewing the Notes API architecture with numbers', [L1, L2, L3]);
