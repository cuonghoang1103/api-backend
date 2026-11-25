/**
 * 8.3 — Mongoose khi chạy thật: transaction, discriminator, index (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s08-3-mg-prod'] (Mongoose 9.13.0 + 8.8.2 trong thư mục lab riêng, MongoDB 8.0.38; kịch bản demo/s08/s08-3-mg-prod.txt).
 * Khối: 0 transaction đủ/quên session/AsyncLocalStorage · 1 discriminator + autoIndex/syncIndexes + 409 + optimisticConcurrency · 2 bufferCommands
 * · 3 npm audit 8.8.2 (9 cảnh báo) · 4 npm audit 9.13 (0) · 5 CVE-2024-53900 trên 8.8.2 · 6 cùng tệp trên 9.13.
 * Số tất định: quên session ⇒ đơn D2 mồ côi; syncIndexes xoá dba_city_sdt; E11000 ⇒ 409 truong email; __v không chặn sửa khác trường, optimisticConcurrency ⇒ VersionError;
 * buffering 10,0 s; 8.8.2: $where sleep(300) trên 5 đơn ≈ 1,5 s, dò email 'kh8' ⇒ 1/5; 9.13: "Cannot use $where filter with populate() match".
 * Sự cố thật có nguồn (API NVD GET kiểm 24/11): CVE-2024-53900 (02/12/2024, CVSS 9.1, Mongoose < 8.8.3), CVE-2025-23061 (15/01/2025, < 8.9.5, vá thiếu).
 * Kiểm trùng: transaction lý thuyết + withTransaction ở 6.2 (chỉ dạy phần Mongoose); N+1 đã đo ở 8.2; NoSQL injection đầy đủ ở 9.3.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's08-3-mg-prod';

const TX = `// Trích _demo/node/s08-mg-tx.mjs
await mongoose.connection.transaction(async (session) => {     // tự thử lại TransientTransactionError, tự hủy khi callback ném lỗi
  await Don.create([{ ma, sp, sl }], { session });                 // create trong transaction: tham số đầu là MẢNG
  const r = await Kho.updateOne({ _id: sp, ton: { $gte: sl } }, { $inc: { ton: -sl } }, { session });
  if (r.modifiedCount === 0) throw new Error(\`hết hàng \${sp}\`);  // ném ⇒ abort ⇒ đơn vừa tạo cũng biến mất
});
// Bản lỗi: Don.create([{ ma, sp, sl }])  ← quên { session }  ⇒ đơn được ghi NGOÀI transaction
// Cách vá thứ hai (Mongoose ≥ 8.4): mongoose.set('transactionAsyncLocalStorage', true)`;

const LOI409 = `// Middleware lỗi Express 5 — ánh xạ lỗi thư viện thành HTTP có nghĩa
app.use((err, req, res, next) => {
  if (err?.code === 11000) return res.status(409).json({ loi: 'da-ton-tai', truong: Object.keys(err.keyValue ?? {})[0] });
  if (err?.name === 'ValidationError') return res.status(400).json({ loi: 'du-lieu-sai', truong: Object.keys(err.errors) });
  if (err?.name === 'CastError') return res.status(400).json({ loi: 'sai-kieu', truong: err.path });
  if (err?.name === 'VersionError') return res.status(409).json({ loi: 'da-bi-sua' });
  console.error(err); res.status(500).json({ loi: 'loi-may-chu' });   // không trả err.message ra ngoài (lộ tên collection, truy vấn)
});`;

const CVE = `// Trích _demo/cve-2024-53900/thu.mjs — API giả định "lọc đơn theo thành phố của khách"
// GET /don?loc={"city":"Huế"}
const r = await Don.find({ _id: { $lte: 5 } })
  .populate({ path: 'customerId', match: JSON.parse(req.query.loc), select: 'name city' })   // ✘ JSON người dùng vào thẳng match
  .lean();`;

export default {
  title: '8.3 — Mongoose in production: transactions, discriminators, indexes|||8.3 — Mongoose khi chạy thật: transaction, discriminator, index',
  slug: 'mgo-8-3-mongoose-nang-cao',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Những thứ chỉ lộ ra khi Mongoose chạy ở production, đo thật trên Mongoose 9.13: transaction quên truyền session để lại đơn mồ côi dù đã hủy (và cách vá bằng transactionAsyncLocalStorage); discriminator gom nhiều loại tài liệu vào một collection; autoIndex dựng index lúc khởi động và syncIndexes XOÁ index do DBA tạo tay; E11000/ValidationError/CastError/VersionError ánh xạ thành 400/409 thay vì 500; __v mặc định không chặn hai người sửa cùng hồ sơ, optimisticConcurrency thì chặn; bufferCommands treo request 10 giây khi mất kết nối. Góc hacker: tái hiện CVE-2024-53900 (CVSS 9.1) — $where lọt qua populate match của Mongoose 8.8.2 làm chậm máy chủ và dò được email không được chọn; npm audit báo 9 lỗ hổng, bản 9.13 chặn hẳn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Mongoose in production: transactions, discriminators, indexes</h2>
<p class="lead">Lesson 8.2 showed which paths a schema protects. This lesson collects what only shows up when a Mongoose application runs for real: a transaction that commits half of its work, an index a deploy silently drops, a request that hangs for ten seconds during a database restart, a 500 where the user deserved a 409 — and a published vulnerability in Mongoose itself, reproduced on the lab. Transactions as a concept, <code>withTransaction</code> and retries were covered in Lesson 6.2; here we only add the Mongoose side.</p>

<h3>An everyday picture: a notary and the folder</h3>
<p>At a notary's office every page of a contract goes into one folder; the notary stamps the folder or throws the whole folder away. If a clerk files one page in the cabinet <em>outside</em> the folder, that page survives even when the contract is cancelled. In Mongoose, the folder is the <em>session</em>. Every operation that should belong to the transaction must carry it. Forget it on one call and that call is a page in the cabinet.</p>

<h3>1. Transactions: the forgotten session</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">connection.transaction(cb)</span><span class="lz-t">startSession + startTransaction</span><span class="lz-d">the folder is opened; Mongoose may run cb several times on TransientTransactionError</span></div>
  <div class="lz-step"><span class="lz-k">Don.create([...], { session })</span><span class="lz-t">inside the folder</span><span class="lz-d">invisible to others until commit; discarded on abort</span></div>
  <div class="lz-step"><span class="lz-k">Don.create([...])  ← no session</span><span class="lz-t">outside the folder</span><span class="lz-d">auto-committed immediately; survives the abort — the orphan order D2</span></div>
  <div class="lz-step"><span class="lz-k">cb throws / returns</span><span class="lz-t">abort / commit</span><span class="lz-d">only operations that carried the session are undone or published together</span></div>
</div>
${ma('js', TX)}
${lenh(K, 0)}
<p>Three orders against a stock of 3: D1 takes 2, D2 asks for 2 and must fail, D3 takes the last one. With every call on the session, D2's order is rolled back together with its failed stock update: orders D1 and D3, stock 0. Forget <code>{ session }</code> on <code>Don.create</code> and the outcome reported to the user is identical — "cancelled" — but the database now contains an order <strong>D2</strong> that was never paid and never reserved stock. No error anywhere. The Mongoose docs call it out: if you don't set the session option on an operation, <em>"your operation will execute outside of the transaction"</em>.</p>
<p>Since Mongoose 8.4, <code>mongoose.set('transactionAsyncLocalStorage', true)</code> uses Node's <code>AsyncLocalStorage</code> to attach the session to every Mongoose operation inside the <code>connection.transaction()</code> callback — the third run, with the session still forgotten, is correct again. Turn it on in every new project. It does not help raw driver calls (<code>Model.collection.…</code>) or work started outside the callback.</p>
${nguon('📘', 'Transactions in Mongoose', 'Mongoose 8.4 is able to set the session operation on all operations within a Connection.prototype.transaction() executor function using AsyncLocalStorage', 'https://mongoosejs.com/docs/transactions.html')}
<div class="pitfall co-tieu-de">
<p><strong>Trap — side effects inside the callback.</strong> <code>connection.transaction()</code> may run your callback several times (Lesson 6.2 counted ~270 runs for 40 orders). Sending an email, calling a payment gateway or publishing to a queue inside it can happen two or three times for one order. Do side effects <em>after</em> the transaction resolves, or record them in an outbox collection inside the transaction and send them later.</p>
</div>
${lienKet({ cta: 'Open lesson', khoa: 'mongodb', bai: 'mgo-6-2-transaction', title: 'Lesson 6.2 — Multi-document transactions', sub: 'WriteConflict, the 60-second limit, retries and when not to use a transaction' })}

<h3>2. Discriminators: several kinds, one collection</h3>
${lenh(K, 1)}
<p>Card payments and e-wallet payments share <code>don</code> and <code>soTien</code> but differ in the rest. A discriminator stores them in one collection with a <code>kind</code> field (section 1 of the output); <code>The.find()</code> automatically adds <code>{ kind: 'the' }</code>, while the base model sees all kinds. This is the <em>polymorphic pattern</em> of Lesson 3.4 implemented by the library. Two production notes: put <code>kind</code> first in compound indexes used by per-kind queries (Lesson 4.3), and treat the discriminator value as data — it ends up in every document and cannot be renamed without a migration.</p>

<h3>3. autoIndex and syncIndexes: the deploy that drops an index</h3>
<p>Section 2 of the same output. When a model initialises, Mongoose calls <code>createIndex</code> for every index in the schema (<code>autoIndex</code>, on by default). On 50,000 documents that took a fraction of a second; on a 200-million-document production collection, every new pod starting up would trigger an index build that competes with live traffic. Then <code>syncIndexes()</code> — often added to the startup script "to keep indexes in sync" — compared the database with the schema and <strong>dropped</strong> <code>dba_city_sdt</code>, the index a DBA had created by hand to fix a slow query. The docs are explicit: it <em>"will drop any indexes that are not defined in the model's schema except the _id index"</em>. The slow query comes back after the next deploy and nobody knows why.</p>
${nguon('📘', 'Model.syncIndexes() — Mongoose API', 'This function will drop any indexes that are not defined in the model\'s schema except the _id index', 'https://mongoosejs.com/docs/api/model.html')}
<p>A production setup that teams use: <code>autoIndex: false</code> in production; indexes declared in the schema <em>and</em> applied by a migration step in the deploy pipeline (Lesson 3.4 schema versioning); <code>diffIndexes()</code> in CI to show what would change; and every index the DBA adds goes back into the schema, so the schema is the single source of truth.</p>

<h3>4. Errors that mean something: 400 and 409, not 500</h3>
<p>Section 3: a duplicate email surfaces as <code>code 11000</code> with <code>keyValue</code>. Map library errors once, in the error middleware:</p>
${ma('js', LOI409)}
<p>That turns a race between two sign-ups with the same email into a clean 409 for the loser — the unique index decides, not a <code>findOne</code> check (Lesson 8.2). And it stops leaking internals: a raw <code>err.message</code> contains collection names, index names and sometimes the duplicate value itself.</p>

<h3>5. __v is not optimistic locking</h3>
<p>Section 4. Two tabs load the same profile; tab A changes the phone, tab B the address. With default settings both saves succeed and <em>both</em> changes survive — Mongoose's <code>save()</code> only <code>$set</code>s the paths you modified, unlike Spring Data's <code>save()</code> which replaces the whole document (spring-boot 20.2). But if both tabs changed the <em>same</em> field, the later one would win silently, and the default <code>__v</code> does not stop it: it is only incremented for some array changes. With <code>optimisticConcurrency: true</code>, the second save fails with <code>VersionError</code> — map it to 409 and let the client reload. Same idea as the version field of Lesson 6.1.</p>

<h3>6. bufferCommands: the ten-second hang</h3>
${lenh(K, 2)}
<p>When Mongoose is not connected — at startup before <code>connect()</code> resolves, or after the connection is lost — it does not fail queries; it <em>buffers</em> them and waits, by default up to 10 seconds. During a database restart every request hangs for 10 s and then fails with "buffering timed out"; your load balancer's health check and your users see a frozen service, and the backlog piles up. With <code>bufferCommands: false</code> the call fails immediately, so you can answer 503 at once. The usual production choice: <code>await mongoose.connect()</code> before <code>listen()</code>, <code>bufferCommands: false</code> (or a small <code>bufferTimeoutMS</code>), and a health endpoint that checks <code>mongoose.connection.readyState</code>. Note also the collection name <code>xes</code>: Mongoose pluralised the model name <code>X</code> — always pass the collection name explicitly, as every model in this chapter does.</p>

<h3>🕵️ Hacker corner: CVE-2024-53900 — $where through populate match</h3>
<p>On 2 December 2024 NVD published <strong>CVE-2024-53900</strong> (CVSS 9.1, critical): <em>"Mongoose before 8.8.3 can improperly use $where in match, leading to search injection."</em> Six weeks later, <strong>CVE-2025-23061</strong> (15 January 2025): the fix was incomplete — a <em>nested</em> <code>$where</code> still got through, fixed in 8.9.5. The vulnerable pattern is an API that lets the client choose a populate filter:</p>
${ma('js', CVE)}
<p>We installed the vulnerable Mongoose 8.8.2 in its own lab folder and ran the same file on both versions:</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>On 8.8.2 the attacker's <code>$where</code> reached the server: <code>sleep(300)</code> made one request take 1.5 s (five customers × 300 ms) — repeat it in parallel and the database's JavaScript engine and read tickets are exhausted (Lesson 8.1). The second payload is worse: <code>this.email.startsWith('kh8')</code> tests a field the API never selects, so by trying prefixes one character at a time an attacker reads every customer's email through yes/no answers — a classic <em>blind injection</em>. On 9.13 Mongoose refuses <code>$where</code> in populate match. And <code>npm audit</code> on the old version listed nine advisories, from this one to prototype pollution and sanitizeFilter bypasses; on 9.13, zero.</p>
${nguon('🛡️', 'NVD — CVE-2024-53900', 'Mongoose before 8.8.3 can improperly use $where in match, leading to search injection (CVSS 9.1, published 2024-12-02)', 'https://nvd.nist.gov/vuln/detail/CVE-2024-53900')}
${nguon('🛡️', 'NVD — CVE-2025-23061', 'Incomplete fix for CVE-2024-53900: a nested $where filter with a populate() match; fixed in 8.9.5', 'https://nvd.nist.gov/vuln/detail/CVE-2025-23061')}
<p>Three defences, all needed: never put a client-supplied object into a filter (build the filter from validated fields — Lesson 9.3); keep libraries current and run <code>npm audit</code> in CI; and disable server-side JavaScript on servers that do not need it (<code>--noscripting</code>, Lesson 5.5) so that even an injected <code>$where</code> cannot run.</p>

<h3>💼 At work: the first week on an existing Mongoose project</h3>
<p>When you join a project (OJT, a new client), a one-hour audit finds most of this chapter's problems: <code>grep -rn "transaction(\\|startSession" src/</code> and check every call inside for a session (or that transactionAsyncLocalStorage is on); <code>grep -rn "syncIndexes\\|autoIndex" src/</code>; read the error middleware for 11000/ValidationError/CastError; check <code>bufferCommands</code> and how the app starts; <code>npm ls mongoose</code> and <code>npm audit</code>; search for <code>req.query</code> or <code>req.body</code> passed into <code>find</code>, <code>match</code> or <code>populate</code>. Write the findings as a short list with severity. It is the kind of contribution that gets a newcomer trusted quickly — and each item comes with a reproduction from this lesson.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How do you run a transaction in Mongoose, and what is the most common bug?"</strong> — connection.transaction(async session =&gt; …) with { session } on every call; forgetting it runs that call outside the transaction. Use transactionAsyncLocalStorage.</li>
<li><strong>"What are discriminators for?"</strong> — Several document types in one collection with a type key; base-model queries see all, child-model queries filter by kind.</li>
<li><strong>"Should autoIndex be on in production?"</strong> — Usually off; build indexes in a controlled migration; syncIndexes drops indexes not in the schema.</li>
<li><strong>"What does __v do?"</strong> — Version key incremented for certain array modifications; it is not full optimistic locking — use optimisticConcurrency for that.</li>
<li><strong>"Have you seen a vulnerability in an ODM?"</strong> — CVE-2024-53900 / CVE-2025-23061: $where via populate match in Mongoose &lt; 8.9.5; fix by upgrading, not passing client objects into filters, and disabling server-side JS.</li>
</ul>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>In <code>s08-mg-tx.mjs</code>, add an <code>Email.create(...)</code> "order confirmation" record inside the callback and make the transaction fail on the first attempt (throw a fake <code>TransientTransactionError</code> once). How many confirmation records exist at the end, with and without the session?</li>
<li>Write a CI check script that prints <code>diffIndexes()</code> for every model and exits with code 1 if <code>toDrop</code> is not empty.</li>
<li>Change <code>s08-mg-dem.mjs</code> to use <code>bufferTimeoutMS: 500</code>. What does a request see now? Which of the three options would you choose for an API behind a load balancer, and why?</li>
<li>Fix the vulnerable API from the hacker corner without upgrading Mongoose: accept only <code>?city=Huế</code>, validate it as a string from a known list, and build the match yourself.</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. With the session, the confirmation of a failed attempt is rolled back together with everything else: exactly one record per committed order. Without it, each attempt leaves a record — retries create duplicates. The lesson: every write in the callback on the session, side effects after it.</p>
<p>2. <code>for (const m of Object.values(mongoose.models)) { const d = await m.diffIndexes(); if (d.toDrop.length) { console.log(m.modelName, d); bad = true; } } process.exit(bad ? 1 : 0);</code> — run it against a staging copy of production, where the DBA's indexes exist.</p>
<p>3. The request fails after about 0.5 s with "buffering timed out after 500ms". Behind a load balancer, fail fast (bufferCommands false or a small timeout) and make the health check report "not ready", so traffic moves to healthy instances instead of piling up.</p>
<p>4. <code>const THANH_PHO = ['Hà Nội', 'Huế', 'Đà Nẵng', 'TP.HCM']; const c = req.query.city; if (typeof c !== 'string' || !THANH_PHO.includes(c)) return res.status(400).end(); … populate({ path: 'customerId', match: { city: c } })</code> — the client chooses a value, never an operator.</p>
</details>
<p><strong>Done when:</strong> your project's transactions carry their session, indexes are owned by the schema and a migration, library errors map to proper status codes, and npm audit is clean.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['connection.transaction()', 'Mongoose helper over the driver\'s withTransaction: retries transient errors, aborts when the callback throws.'],
  ['transactionAsyncLocalStorage', 'Mongoose ≥ 8.4 option that attaches the transaction session to every Mongoose call in the callback.'],
  ['Discriminator', 'A child model sharing the base model\'s collection, distinguished by a key (kind / __t).'],
  ['autoIndex / syncIndexes', 'Create schema indexes on model init / make DB indexes exactly match the schema (drops extras).'],
  ['optimisticConcurrency', 'Schema option: save() checks and increments the version; stale save ⇒ VersionError.'],
  ['bufferCommands', 'Queue operations while disconnected (default, up to bufferTimeoutMS = 10 s) instead of failing fast.'],
  ['Blind injection', 'Extracting data through yes/no or timing differences of injected conditions.'],
  ['CVE-2024-53900', 'Mongoose < 8.8.3: $where in populate match reached the server (search injection), CVSS 9.1; incomplete fix ⇒ CVE-2025-23061.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Every operation in a transaction needs the session; turn on transactionAsyncLocalStorage; keep side effects out of the callback.</li>
<li>Discriminators implement the polymorphic pattern in one collection.</li>
<li>Turn autoIndex off in production, manage indexes with migrations; syncIndexes drops indexes that are not in the schema.</li>
<li>Map 11000/Validation/Cast/Version errors to 409/400 in one middleware; never return raw messages.</li>
<li>__v is not optimistic locking; use optimisticConcurrency. Fail fast instead of buffering 10 s.</li>
<li>CVE-2024-53900: never pass client objects into filters, keep Mongoose current, run npm audit, disable server-side JS.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Mongoose khi chạy thật: transaction, discriminator, index</h2>
<p class="lead">Bài 8.2 chỉ ra schema bảo vệ những đường nào. Bài này gom những thứ chỉ lộ ra khi ứng dụng Mongoose chạy thật: một transaction commit được nửa công việc, một index bị lần triển khai lặng lẽ xoá, một request treo mười giây khi database khởi động lại, một lỗi 500 trong khi người dùng đáng nhận 409 — và một lỗ hổng đã công bố của chính Mongoose, tái hiện trên lab. Transaction ở mức khái niệm, <code>withTransaction</code> và việc thử lại đã học ở Bài 6.2; ở đây chỉ thêm phần Mongoose.</p>

<h3>Hình ảnh đời thường: phòng công chứng và tập hồ sơ</h3>
<p>Ở phòng công chứng, mọi trang của một hợp đồng đi vào một tập hồ sơ; công chứng viên đóng dấu cả tập hoặc huỷ cả tập. Nếu một nhân viên cất một trang vào tủ <em>ngoài</em> tập hồ sơ, trang đó vẫn còn dù hợp đồng bị huỷ. Trong Mongoose, tập hồ sơ là <em>session</em>. Mọi thao tác thuộc về transaction phải mang nó theo. Quên ở một lệnh là lệnh đó thành một trang nằm trong tủ.</p>

<h3>1. Transaction: session bị quên</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">connection.transaction(cb)</span><span class="lz-t">startSession + startTransaction</span><span class="lz-d">tập hồ sơ được mở; Mongoose có thể chạy cb nhiều lần khi gặp TransientTransactionError</span></div>
  <div class="lz-step"><span class="lz-k">Don.create([...], { session })</span><span class="lz-t">trong tập hồ sơ</span><span class="lz-d">người khác không thấy tới khi commit; bị bỏ khi abort</span></div>
  <div class="lz-step"><span class="lz-k">Don.create([...])  ← không session</span><span class="lz-t">ngoài tập hồ sơ</span><span class="lz-d">tự commit ngay; sống sót qua abort — đơn mồ côi D2</span></div>
  <div class="lz-step"><span class="lz-k">cb ném lỗi / trả về</span><span class="lz-t">abort / commit</span><span class="lz-d">chỉ thao tác mang session mới được hoàn tác hoặc công bố cùng nhau</span></div>
</div>
${ma('js', TX)}
${lenh(K, 0)}
<p>Ba đơn trên tồn kho 3: D1 lấy 2, D2 xin 2 và phải hỏng, D3 lấy cái cuối. Khi mọi lệnh mang session, đơn của D2 bị hoàn tác cùng lệnh trừ kho thất bại: còn đơn D1 và D3, tồn 0. Quên <code>{ session }</code> ở <code>Don.create</code> thì kết quả báo cho người dùng y hệt — "đã hủy" — nhưng database giờ chứa đơn <strong>D2</strong> chưa thanh toán và chưa giữ hàng. Không lỗi ở đâu cả. Tài liệu Mongoose nói rõ: nếu không đặt tuỳ chọn session cho một thao tác, <em>"thao tác đó sẽ chạy ngoài transaction"</em>.</p>
<p>Từ Mongoose 8.4, <code>mongoose.set('transactionAsyncLocalStorage', true)</code> dùng <code>AsyncLocalStorage</code> của Node để gắn session vào mọi thao tác Mongoose bên trong callback của <code>connection.transaction()</code> — lượt chạy thứ ba, vẫn quên session, lại đúng. Hãy bật nó ở mọi dự án mới. Nó không cứu được lệnh gọi driver thô (<code>Model.collection.…</code>) hay việc bắt đầu bên ngoài callback.</p>
${nguon('📘', 'Transactions in Mongoose', 'Mongoose 8.4 tự gắn session cho mọi thao tác trong hàm của Connection.prototype.transaction() bằng AsyncLocalStorage', 'https://mongoosejs.com/docs/transactions.html')}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tác dụng phụ trong callback.</strong> <code>connection.transaction()</code> có thể chạy callback của bạn nhiều lần (Bài 6.2 đếm được ~270 lần cho 40 đơn). Gửi email, gọi cổng thanh toán hay đẩy vào hàng đợi bên trong nó có thể xảy ra hai ba lần cho một đơn. Làm tác dụng phụ <em>sau</em> khi transaction xong, hoặc ghi chúng vào một collection outbox bên trong transaction rồi gửi sau.</p>
</div>
${lienKet({ khoa: 'mongodb', bai: 'mgo-6-2-transaction', title: 'Bài 6.2 — Transaction nhiều tài liệu', sub: 'WriteConflict, giới hạn 60 giây, thử lại và khi nào không nên dùng transaction' })}

<h3>2. Discriminator: nhiều loại, một collection</h3>
${lenh(K, 1)}
<p>Thanh toán thẻ và thanh toán ví chung <code>don</code> và <code>soTien</code> nhưng khác phần còn lại. Discriminator lưu chúng trong một collection với trường <code>kind</code> (mục 1 của output); <code>The.find()</code> tự thêm <code>{ kind: 'the' }</code>, còn model gốc thấy mọi loại. Đây là <em>polymorphic pattern</em> của Bài 3.4 do thư viện làm giúp. Hai lưu ý production: đặt <code>kind</code> đầu tiên trong index ghép dùng cho truy vấn theo loại (Bài 4.3), và coi giá trị discriminator là dữ liệu — nó nằm trong mọi tài liệu và không đổi tên được nếu không di trú.</p>

<h3>3. autoIndex và syncIndexes: lần triển khai xoá mất index</h3>
<p>Mục 2 của cùng output. Khi model khởi tạo, Mongoose gọi <code>createIndex</code> cho mọi index trong schema (<code>autoIndex</code>, mặc định bật). Trên 50.000 tài liệu việc đó tốn chưa tới một giây; trên collection production 200 triệu tài liệu, mỗi pod mới khởi động lại kích hoạt dựng index tranh tài nguyên với lưu lượng thật. Rồi <code>syncIndexes()</code> — hay được thêm vào script khởi động "cho index luôn đồng bộ" — so database với schema và <strong>xoá</strong> <code>dba_city_sdt</code>, index một DBA đã tạo tay để chữa một truy vấn chậm. Tài liệu nói thẳng: nó <em>"sẽ xoá mọi index không khai báo trong schema của model, trừ index _id"</em>. Truy vấn chậm quay lại sau lần triển khai tiếp theo và không ai biết vì sao.</p>
${nguon('📘', 'Model.syncIndexes() — Mongoose API', 'Hàm này xoá mọi index không khai báo trong schema của model, trừ index _id', 'https://mongoosejs.com/docs/api/model.html')}
<p>Cách thiết lập production các nhóm hay dùng: <code>autoIndex: false</code> ở production; index khai báo trong schema <em>và</em> được áp bởi một bước di trú trong quy trình triển khai (schema versioning ở Bài 3.4); <code>diffIndexes()</code> trong CI để thấy cái gì sẽ đổi; và mọi index DBA thêm đều được đưa ngược vào schema, để schema là nguồn sự thật duy nhất.</p>

<h3>4. Lỗi có nghĩa: 400 và 409, không phải 500</h3>
<p>Mục 3: email trùng hiện ra dưới dạng <code>code 11000</code> kèm <code>keyValue</code>. Ánh xạ lỗi thư viện một lần, trong middleware lỗi:</p>
${ma('js', LOI409)}
<p>Nhờ vậy cuộc đua giữa hai lần đăng ký cùng email thành một lỗi 409 gọn gàng cho người thua — index duy nhất quyết định, không phải một lần kiểm <code>findOne</code> (Bài 8.2). Và nó chặn việc lộ ruột: <code>err.message</code> thô chứa tên collection, tên index và có khi chính giá trị bị trùng.</p>

<h3>5. __v không phải khoá lạc quan</h3>
<p>Mục 4. Hai tab mở cùng một hồ sơ; tab A đổi số điện thoại, tab B đổi địa chỉ. Với thiết lập mặc định cả hai lần save đều thành công và <em>cả hai</em> thay đổi đều còn — <code>save()</code> của Mongoose chỉ <code>$set</code> những đường bạn đã sửa, khác <code>save()</code> của Spring Data vốn thay cả tài liệu (spring-boot 20.2). Nhưng nếu cả hai tab sửa <em>cùng</em> một trường, lần sau sẽ thắng lặng lẽ, và <code>__v</code> mặc định không chặn được: nó chỉ tăng với một số thay đổi mảng. Với <code>optimisticConcurrency: true</code>, lần save thứ hai hỏng với <code>VersionError</code> — ánh xạ thành 409 và để client tải lại. Cùng ý tưởng với trường version ở Bài 6.1.</p>

<h3>6. bufferCommands: mười giây treo</h3>
${lenh(K, 2)}
<p>Khi Mongoose chưa kết nối — lúc khởi động trước khi <code>connect()</code> xong, hoặc sau khi mất kết nối — nó không làm hỏng truy vấn; nó <em>giữ lại</em> và chờ, mặc định tới 10 giây. Trong lúc database khởi động lại, mọi request treo 10 giây rồi hỏng với "buffering timed out"; health check của bộ cân bằng tải và người dùng thấy một dịch vụ đứng hình, còn việc tồn đọng chất đống. Với <code>bufferCommands: false</code> lệnh hỏng ngay, nên bạn trả 503 được liền. Lựa chọn production thường gặp: <code>await mongoose.connect()</code> trước <code>listen()</code>, <code>bufferCommands: false</code> (hoặc <code>bufferTimeoutMS</code> nhỏ), và một endpoint sức khoẻ kiểm <code>mongoose.connection.readyState</code>. Để ý cả tên collection <code>xes</code>: Mongoose đã chuyển tên model <code>X</code> sang số nhiều — luôn ghi rõ tên collection, như mọi model trong chương này.</p>

<h3>🕵️ Góc hacker: CVE-2024-53900 — $where lọt qua populate match</h3>
<p>Ngày 02/12/2024, NVD công bố <strong>CVE-2024-53900</strong> (CVSS 9.1, nghiêm trọng): <em>"Mongoose before 8.8.3 can improperly use $where in match, leading to search injection."</em> Sáu tuần sau là <strong>CVE-2025-23061</strong> (15/01/2025): bản vá chưa đủ — <code>$where</code> <em>lồng</em> vẫn lọt, vá ở 8.9.5. Mẫu mã dễ bị tấn công là API cho client tự chọn bộ lọc populate:</p>
${ma('js', CVE)}
<p>Ta cài Mongoose 8.8.2 có lỗi vào một thư mục lab riêng và chạy cùng tệp trên cả hai phiên bản:</p>
${lenh(K, 3)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Trên 8.8.2, <code>$where</code> của kẻ tấn công tới được máy chủ: <code>sleep(300)</code> làm một request mất 1,5 giây (năm khách × 300 ms) — bắn song song nhiều lần là cạn kiệt bộ máy JavaScript và vé đọc của database (Bài 8.1). Payload thứ hai còn tệ hơn: <code>this.email.startsWith('kh8')</code> thử một trường mà API không bao giờ chọn, nên bằng cách thử từng ký tự đầu, kẻ tấn công đọc được email mọi khách qua câu trả lời có/không — kiểu <em>tiêm mù</em> kinh điển. Trên 9.13, Mongoose từ chối <code>$where</code> trong populate match. Còn <code>npm audit</code> trên bản cũ liệt kê chín cảnh báo, từ lỗi này tới prototype pollution và lách sanitizeFilter; trên 9.13 là không.</p>
${nguon('🛡️', 'NVD — CVE-2024-53900', 'Mongoose trước 8.8.3 cho $where lọt vào match, dẫn tới search injection (CVSS 9.1, công bố 02/12/2024)', 'https://nvd.nist.gov/vuln/detail/CVE-2024-53900')}
${nguon('🛡️', 'NVD — CVE-2025-23061', 'Vá thiếu của CVE-2024-53900: $where lồng trong populate() match; vá ở 8.9.5', 'https://nvd.nist.gov/vuln/detail/CVE-2025-23061')}
<p>Ba lớp phòng thủ, cần cả ba: không bao giờ đưa object do client gửi vào bộ lọc (dựng bộ lọc từ các trường đã kiểm — Bài 9.3); giữ thư viện luôn mới và chạy <code>npm audit</code> trong CI; và tắt JavaScript phía máy chủ ở máy không cần (<code>--noscripting</code>, Bài 5.5) để ngay cả <code>$where</code> lọt vào cũng không chạy được.</p>

<h3>💼 Đi làm: tuần đầu ở một dự án Mongoose có sẵn</h3>
<p>Khi vào một dự án (OJT, khách hàng mới), một giờ soát mã tìm ra phần lớn vấn đề của chương này: <code>grep -rn "transaction(\\|startSession" src/</code> rồi kiểm mọi lệnh bên trong có session (hoặc đã bật transactionAsyncLocalStorage); <code>grep -rn "syncIndexes\\|autoIndex" src/</code>; đọc middleware lỗi xem có xử lý 11000/ValidationError/CastError; kiểm <code>bufferCommands</code> và cách ứng dụng khởi động; <code>npm ls mongoose</code> và <code>npm audit</code>; tìm <code>req.query</code> hay <code>req.body</code> bị đưa vào <code>find</code>, <code>match</code> hay <code>populate</code>. Viết kết quả thành danh sách ngắn có mức độ nghiêm trọng. Đây là kiểu đóng góp giúp người mới được tin tưởng nhanh — và mỗi mục đều có bản tái hiện lấy từ bài này.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Chạy transaction trong Mongoose thế nào, lỗi hay gặp nhất là gì?"</strong> — connection.transaction(async session =&gt; …) với { session } ở mọi lệnh; quên thì lệnh đó chạy ngoài transaction. Dùng transactionAsyncLocalStorage.</li>
<li><strong>"Discriminator dùng làm gì?"</strong> — Nhiều loại tài liệu trong một collection với khoá loại; truy vấn model gốc thấy tất cả, truy vấn model con lọc theo kind.</li>
<li><strong>"autoIndex có nên bật ở production không?"</strong> — Thường là tắt; dựng index trong bước di trú có kiểm soát; syncIndexes xoá index không có trong schema.</li>
<li><strong>"__v làm gì?"</strong> — Khoá phiên bản tăng với một số thay đổi mảng; không phải khoá lạc quan đầy đủ — dùng optimisticConcurrency cho việc đó.</li>
<li><strong>"Bạn từng thấy lỗ hổng trong ODM chưa?"</strong> — CVE-2024-53900 / CVE-2025-23061: $where qua populate match ở Mongoose &lt; 8.9.5; vá bằng nâng cấp, không đưa object client vào bộ lọc, và tắt JS phía máy chủ.</li>
</ul>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>s08-mg-tx.mjs</code>, thêm một bản ghi "xác nhận đơn" <code>Email.create(...)</code> trong callback và làm transaction hỏng ở lần chạy đầu (ném một lỗi giả <code>TransientTransactionError</code> một lần). Cuối cùng có bao nhiêu bản ghi xác nhận, khi có và khi không có session?</li>
<li>Viết script kiểm cho CI in <code>diffIndexes()</code> của mọi model và thoát mã 1 nếu <code>toDrop</code> khác rỗng.</li>
<li>Sửa <code>s08-mg-dem.mjs</code> dùng <code>bufferTimeoutMS: 500</code>. Request giờ thấy gì? Với API đứng sau bộ cân bằng tải, bạn chọn tuỳ chọn nào trong ba, vì sao?</li>
<li>Vá API dễ bị tấn công ở góc hacker mà không nâng cấp Mongoose: chỉ nhận <code>?city=Huế</code>, kiểm nó là chuỗi thuộc một danh sách biết trước, và tự dựng match.</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. Có session thì bản xác nhận của lần chạy hỏng bị hoàn tác cùng mọi thứ khác: đúng một bản ghi cho mỗi đơn commit. Không có thì mỗi lần chạy để lại một bản — thử lại sinh bản trùng. Bài học: mọi lệnh ghi trong callback mang session, tác dụng phụ để sau.</p>
<p>2. <code>for (const m of Object.values(mongoose.models)) { const d = await m.diffIndexes(); if (d.toDrop.length) { console.log(m.modelName, d); bad = true; } } process.exit(bad ? 1 : 0);</code> — chạy trên bản sao staging của production, nơi có các index của DBA.</p>
<p>3. Request hỏng sau khoảng 0,5 giây với "buffering timed out after 500ms". Sau bộ cân bằng tải, hãy hỏng nhanh (bufferCommands false hoặc thời gian chờ nhỏ) và cho health check báo "chưa sẵn sàng", để lưu lượng chuyển sang bản khoẻ thay vì chất đống.</p>
<p>4. <code>const THANH_PHO = ['Hà Nội', 'Huế', 'Đà Nẵng', 'TP.HCM']; const c = req.query.city; if (typeof c !== 'string' || !THANH_PHO.includes(c)) return res.status(400).end(); … populate({ path: 'customerId', match: { city: c } })</code> — client chọn một giá trị, không bao giờ chọn toán tử.</p>
</details>
<p><strong>Xong khi:</strong> transaction trong dự án của bạn mang session, index thuộc về schema và bước di trú, lỗi thư viện ánh xạ đúng mã trạng thái, và npm audit sạch.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['connection.transaction()', 'Hàm tiện ích Mongoose bọc withTransaction của driver: thử lại lỗi tạm thời, hủy khi callback ném lỗi.'],
  ['transactionAsyncLocalStorage', 'Tuỳ chọn Mongoose ≥ 8.4 tự gắn session của transaction vào mọi lệnh Mongoose trong callback.'],
  ['Discriminator', 'Model con dùng chung collection với model gốc, phân biệt bằng một khoá (kind / __t).'],
  ['autoIndex / syncIndexes', 'Tạo index của schema khi model khởi tạo / làm index trong DB khớp đúng schema (xoá phần dư).'],
  ['optimisticConcurrency', 'Tuỳ chọn schema: save() kiểm và tăng phiên bản; save bản cũ ⇒ VersionError.'],
  ['bufferCommands', 'Giữ thao tác lại khi mất kết nối (mặc định, tới bufferTimeoutMS = 10 giây) thay vì hỏng nhanh.'],
  ['Tiêm mù (blind injection)', 'Moi dữ liệu qua câu trả lời có/không hoặc độ chênh thời gian của điều kiện bị chèn.'],
  ['CVE-2024-53900', 'Mongoose < 8.8.3: $where trong populate match tới được máy chủ (search injection), CVSS 9.1; vá thiếu ⇒ CVE-2025-23061.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi thao tác trong transaction cần session; bật transactionAsyncLocalStorage; để tác dụng phụ ra ngoài callback.</li>
<li>Discriminator hiện thực polymorphic pattern trong một collection.</li>
<li>Tắt autoIndex ở production, quản lý index bằng di trú; syncIndexes xoá index không có trong schema.</li>
<li>Ánh xạ lỗi 11000/Validation/Cast/Version thành 409/400 trong một middleware; không trả thông báo thô.</li>
<li>__v không phải khoá lạc quan; dùng optimisticConcurrency. Hỏng nhanh thay vì giữ lệnh 10 giây.</li>
<li>CVE-2024-53900: không đưa object client vào bộ lọc, giữ Mongoose mới, chạy npm audit, tắt JS phía máy chủ.</li>
</ul>
</div>
`,
};
