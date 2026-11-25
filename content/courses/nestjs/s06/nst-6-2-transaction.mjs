/**
 * 6.2 — Transaction xuyên service: $transaction, interactive transaction và CLS (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Prisma 7.10.1, nestjs-cls 7.0.2, @nestjs-cls/transactional 4.0.2 + adapter-prisma 2.0.2, PostgreSQL 16.16):
 * scratchpad/nst/lab/c6/app/src/b62/tx.ts — booking + nhật ký (action VARCHAR(20), ghi 26 ký tự ⇒ P2000): không tx còn 1 booking mồ côi;
 * tx tham số và @Transactional đều rollback; service cũ tiêm PrismaService ghi lọt "đã gửi email cho booking #1"; gọi nội bộ vẫn rollback
 * (khác Spring proxy). tx-dai.ts: gọi ngoài 6 s ⇒ P2028 ở 6.0 s, DB trống sau đó; pool 2 + hai tx 3 s ⇒ truy vấn thường chờ tới 3.0 s;
 * DB_POOL=1 + service cũ ⇒ tự chờ, P2028 sau 5 s, tổng 5.8 s, dòng NOTIFY vẫn ghi.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-1-hai-dang', title: 'Prisma ORM 7.1 — Hai dạng $transaction', sub: 'Mảng lệnh và hàm callback: phần nền, kể cả timeout và maxWait.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-2-muc-co-lap', title: 'Prisma ORM 7.2 — Mức cô lập, dựng lại tận mắt', sub: 'Read Committed, Repeatable Read, Serializable — bài này không dạy lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'spring-boot', bai: 'sb-6-5-transaction', title: 'Spring Boot 6.5 — @Transactional', sub: 'Để so: proxy, propagation và bẫy gọi nội bộ ở Spring.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'postgresql', bai: 'postgresql-11-1-giao-dich', title: 'PostgreSQL 11.1 — Giao dịch: được tất cả, hoặc không gì cả', sub: 'BEGIN/COMMIT/ROLLBACK ở tầng SQL.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'nestjs-cls — Transactional plugin', 'TransactionHost, @Transactional, propagation, adapter Prisma/TypeORM.', 'https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional'),
].join('\n');
const MA_THAMSO = "// —— cách 1 và 2: truyền tx bằng tham số ——\n@Injectable() class AuditService {\n  constructor(private readonly db: PrismaService) {}\n  log(action: string, detail: string, db: Db = this.db) { return db.auditLog.create({ data: { action, detail } }); }\n}\n@Injectable() class BookingsService {\n  constructor(private readonly db: PrismaService, private readonly audit: AuditService) {}\n  async createKhongTx() {\n    const b = await this.db.booking.create({ data: DON });\n    await this.audit.log(HANH_DONG, `booking #${b.id}`);\n  }\n  createThamSo() {\n    return this.db.$transaction(async (tx) => {           // interactive transaction: mọi lệnh đi qua tx\n      const b = await tx.booking.create({ data: DON });\n      await this.audit.log(HANH_DONG, `booking #${b.id}`, tx);   // ⚠ phải nhớ truyền tx ở MỌI tầng\n    });\n  }\n}";
const MA_CLS = "// —— cách 3: CLS — transaction đi theo ngữ cảnh, không theo tham số ——\n@Injectable() class AuditCls {\n  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}\n  log(action: string, detail: string) { return this.txHost.tx.auditLog.create({ data: { action, detail } }); }\n}\n@Injectable() class ThongBaoRoRi {                       // service cũ: vẫn tiêm PrismaService trực tiếp\n  constructor(private readonly db: PrismaService) {}\n  ghi(detail: string) { return this.db.auditLog.create({ data: { action: 'NOTIFY', detail } }); }\n}\n@Injectable() class BookingsCls {\n  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>,\n              private readonly audit: AuditCls, private readonly tb: ThongBaoRoRi) {}\n  @Transactional()\n  async create(roRi = false) {\n    const b = await this.txHost.tx.booking.create({ data: DON });\n    if (roRi) await this.tb.ghi(`đã gửi email cho booking #${b.id}`);\n    await this.audit.log(HANH_DONG, `booking #${b.id}`);\n  }\n  async goiNoiBo() { return this.create(); }            // gọi trong cùng lớp — ở Spring, @Transactional bị bỏ qua\n}\n\n@Module({\n  imports: [PrismaModule, ClsModule.forRoot({ global: true, plugins: [new ClsPluginTransactional({\n    imports: [PrismaModule],\n    adapter: new TransactionalAdapterPrisma({ prismaInjectionToken: PrismaService, sqlFlavor: 'postgresql' }),\n  })] })],\n  providers: [AuditService, BookingsService, AuditCls, ThongBaoRoRi, BookingsCls],\n})\nclass AppModule {}";
const OUT_TX = "$ KICH=khong-tx node dist/b62/tx.js\nlỗi: P2000 — The provided value for the column is too long for the column's type. Column: (not available)\nsau đó trong DB: Booking 1 hàng · AuditLog []\n$ KICH=tham-so node dist/b62/tx.js\nlỗi: P2000 — The provided value for the column is too long for the column's type. Column: (not available)\nsau đó trong DB: Booking 0 hàng · AuditLog []\n$ KICH=cls node dist/b62/tx.js\nlỗi: P2000 — The provided value for the column is too long for the column's type. Column: (not available)\nsau đó trong DB: Booking 0 hàng · AuditLog []\n$ KICH=cls-ro-ri node dist/b62/tx.js\nlỗi: P2000 — The provided value for the column is too long for the column's type. Column: (not available)\nsau đó trong DB: Booking 0 hàng · AuditLog [{\"action\":\"NOTIFY\",\"detail\":\"đã gửi email cho booking #1\"}]\n$ KICH=goi-noi-bo node dist/b62/tx.js\nlỗi: P2000 — The provided value for the column is too long for the column's type. Column: (not available)\nsau đó trong DB: Booking 0 hàng · AuditLog []";
const MA_HTTP = "@Module({\n  imports: [PrismaModule, ClsModule.forRoot({ global: true, middleware: { mount: true }, plugins: [new ClsPluginTransactional({\n    imports: [PrismaModule], adapter: new TransactionalAdapterPrisma({ prismaInjectionToken: PrismaService }) })] })],\n  controllers: [C], providers: [S],\n})";
const OUT_HTTP = "$ node dist/b62/http.js\nPOST /dat → {\"txid\":\"1864\",\"cungTx\":true}\nPOST /dat → {\"txid\":\"1865\",\"cungTx\":true}";
const MA_BT = "@Injectable() class AuditCls {\n  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>) {}\n  log(action: string, detail: string) { return this.txHost.tx.auditLog.create({ data: { action, detail } }); }\n  @Transactional(Propagation.RequiresNew)                 // transaction RIÊNG, commit độc lập với transaction đang mở\n  logThatBai(detail: string) { return this.txHost.tx.auditLog.create({ data: { action: 'BOOKING_FAILED', detail } }); }\n}\n@Injectable() class BookingsCls {\n  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>, private readonly audit: AuditCls) {}\n  @Transactional()\n  async create() {\n    const b = await this.txHost.tx.booking.create({ data: { roomId: 1, studentId: 'SE170001', start: new Date('2027-01-05T00:30:00Z'), end: new Date('2027-01-05T02:30:00Z') } });\n    try { await this.audit.log('BOOKING_CREATED_BY_STUDENT', `booking #${b.id}`); }     // 26 ký tự > VARCHAR(20)\n    catch (e) { await this.audit.logThatBai(`booking #${b.id}: ${(e as any).code}`); throw e; }\n  }\n}";
const OUT_BT = "$ node dist/b62/bt.js\nlỗi: P2000\nBooking 0 hàng · AuditLog [{\"action\":\"BOOKING_FAILED\",\"detail\":\"booking #1: P2000\"}]";
const MA_DAI = "if (process.env.KICH === 'goi-ngoai') {\n  try {\n    await db.$transaction(async (tx) => {\n      await tx.auditLog.create({ data: { action: 'BOOKING', detail: 'giữ chỗ' } });\n      await ngu(6000);                                           // \"gửi email\" qua mạng — TRONG transaction\n      await tx.auditLog.create({ data: { action: 'EMAIL', detail: 'đã gửi' } });\n    });                                                          // mặc định: timeout 5000 ms, maxWait 2000 ms\n  } catch (e: any) { console.log(`[${t()}] lỗi ${e.code}: ${e.message.split('\\n').filter(Boolean).at(-1)}`); }\n}\nif (process.env.KICH === 'can-pool') {\n  const dai = (ten: string) => db.$transaction(async (tx) => { await tx.room.count(); await ngu(3000); console.log(`[${t()}] ${ten} xong`); }, { timeout: 10000 });\n  const thuong = async () => {\n    try { await db.room.count(); console.log(`[${t()}] truy vấn thường (đếm phòng) xong`); }\n    catch (e: any) { console.log(`[${t()}] truy vấn thường lỗi ${e.code}: ${e.message.split('\\n').filter(Boolean).at(-1)}`); }\n  };\n  await Promise.all([dai('tx A'), dai('tx B'), ngu(100).then(thuong)]);\n}";
const OUT_DAI = "$ KICH=goi-ngoai node dist/b62/tx-dai.js\n[6.0 s] lỗi P2028: Transaction API error: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 6033 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.\n$ KICH=can-pool DB_POOL=2 node dist/b62/tx-dai.js\n[3.0 s] tx A xong\n[3.0 s] truy vấn thường (đếm phòng) xong\n[3.0 s] tx B xong\n$ KICH=cls-ro-ri DB_POOL=1 node dist/b62/tx.js   # service cũ cần kết nối thứ hai\nlỗi: P2028 — Transaction API error: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 5011 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.\nsau đó trong DB: Booking 0 hàng · AuditLog [{\"action\":\"NOTIFY\",\"detail\":\"đã gửi email cho booking #1\"}]\n(mất 5.8 s)\n$ psql -c 'SELECT action, detail FROM \"AuditLog\"'\n action | detail \n--------+--------\n(0 rows)";

export default {
  title: '6.2 — Transactions across services: $transaction, interactive transactions and CLS|||6.2 — Transaction xuyên service: $transaction, interactive transaction và CLS',
  slug: 'nst-6-2-transaction',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đặt phòng ở BookingsService, ghi nhật ký ở AuditService — hai service, một giao dịch. Chạy thật năm cách: không transaction để lại booking mồ côi, truyền tx qua tham số thì đúng nhưng phải nhớ ở mọi tầng, @Transactional của nestjs-cls rollback mà không cần truyền gì, một service cũ tiêm PrismaService ghi lọt ra ngoài transaction, và giữ transaction trong lúc gọi mạng 6 giây thì P2028, chặn pool, thậm chí tự chờ chính mình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>6.2 — One business action, two services, one transaction</h2>
<p class="lead">Booking a room writes a booking row and an audit row. In a Nest code base those writes live in two services — <code>BookingsService</code> and <code>AuditService</code> — because they belong to two modules. The database only knows transactions on <em>one connection</em>. The Nest-specific question is therefore: <strong>how does the second service find the connection of the transaction the first one opened?</strong> Prisma's two forms of <code>$transaction</code> and isolation levels are covered in the Prisma ORM course (links below); here we wire them through the DI container.</p>

<h3>Everyday analogy: a bank transfer slip</h3>
<p>A transfer debits account A and credits account B. Two clerks may do the two halves, but they write on the <em>same slip</em>, and the bank stamps it once. If the second clerk works from a different slip, the money leaves A and never reaches B. The slip is the transaction; the question of this lesson is how to hand the same slip to every clerk.</p>

<h3>The setup</h3>
<p>The audit column <code>action</code> is <code>VARCHAR(20)</code>, and the code writes <code>BOOKING_CREATED_BY_STUDENT</code> (26 characters) — so the audit write always fails <em>after</em> the booking was written. A realistic failure: a schema limit nobody remembered.</p>

<h3>Ways 1 and 2 — no transaction, then the transaction client as a parameter</h3>
<pre><code class="language-ts">${esc(MA_THAMSO)}</code></pre>

<h3>Way 3 — CLS: the transaction travels with the call, not with the arguments</h3>
<p>CLS (continuation-local storage) is Node's <code>AsyncLocalStorage</code>: a value attached to "this chain of async calls", visible to every function the chain reaches. <code>nestjs-cls</code> wraps it for Nest, and its transactional plugin stores the open transaction there. Services ask <code>TransactionHost.tx</code>: inside a <code>@Transactional()</code> method it is the transaction client, outside it is the normal <code>PrismaService</code>.</p>
<pre><code class="language-ts">${esc(MA_CLS)}</code></pre>
<p>Five runs, the state of the database after each:</p>
<div class="out">${esc(OUT_TX)}</div>
<ol>
<li><strong>khong-tx</strong> — the audit failed, the booking stayed: an orphan row with no audit trail. Each Prisma call is its own transaction.</li>
<li><strong>tham-so</strong> — rolled back. Correct, but the price is visible in the code: every method in the chain gains a <code>db: Prisma.TransactionClient</code> parameter, and forgetting it once silently escapes the transaction.</li>
<li><strong>cls</strong> — rolled back, and neither service has a transaction parameter.</li>
<li><strong>cls-ro-ri</strong> — the booking rolled back, yet the table contains <code>đã gửi email cho booking #1</code>: an old service injected <code>PrismaService</code> directly, so its write ran on another connection and committed. Booking #1 does not exist. With CLS, <strong>every repository/service must use <code>txHost.tx</code></strong> — grep for <code>PrismaService</code> injections when you adopt it.</li>
<li><strong>goi-noi-bo</strong> — <code>goiNoiBo()</code> calls <code>this.create()</code> inside the same class, and it still rolled back. In Spring, <code>@Transactional</code> works through a proxy, so a self-invocation skips it; <code>nestjs-cls</code> wraps the method itself, so it does not.</li>
</ol>

<h3>In an HTTP app</h3>
<p>In the scripts above we opened a CLS context by hand with <code>cls.run()</code>. In a real app, let the module mount its middleware so every request gets its own context:</p>
<pre><code class="language-ts">${esc(MA_HTTP)}</code></pre>
<div class="out">${esc(OUT_HTTP)}</div>
<p>Two requests, two different PostgreSQL transaction ids, and inside each request all statements ran in the same transaction (<code>cungTx: true</code>).</p>

<h3>Propagation — the same words as Spring</h3>
<table>
<tr><th>Propagation</th><th>When a transaction is already open</th><th>When none is open</th></tr>
<tr><td><code>Required</code> (default)</td><td>joins it</td><td>starts one</td></tr>
<tr><td><code>RequiresNew</code></td><td>starts a separate one, commits independently</td><td>starts one</td></tr>
<tr><td><code>Nested</code></td><td>savepoint inside it (needs <code>sqlFlavor</code>)</td><td>starts one</td></tr>
<tr><td><code>Mandatory</code></td><td>joins it</td><td>throws</td></tr>
<tr><td><code>Supports</code> / <code>NotSupported</code> / <code>Never</code></td><td>joins / runs outside / throws</td><td>runs without</td></tr>
</table>

<h3>The other half of the problem: holding a transaction too long</h3>
<pre><code class="language-ts">${esc(MA_DAI)}</code></pre>
<div class="out">${esc(OUT_DAI)}</div>
<ul>
<li><strong>A network call inside a transaction</strong> (6 s "email") ⇒ <code>P2028</code> at 6.0 s: Prisma's interactive transaction has a 5000 ms default timeout. The table is empty afterwards — the first insert was rolled back. But in real life the email <em>was sent</em>: the database says "no booking", the student's inbox says "booked". External side effects do not roll back. Do them after commit (or through an outbox and a queue — Chapter 9).</li>
<li><strong>Long transactions starve the pool.</strong> Pool of 2, two transactions each holding a connection for 3 s ⇒ a trivial <code>count()</code> started at 0.1 s finished at 3.0 s. Every request of the app waited behind two slow ones.</li>
<li><strong>A transaction can wait for itself.</strong> Pool of 1 + the leaking service from run 4: the transaction holds the only connection, the leaking write waits for a connection, the transaction waits for the write — until the 5 s timeout kills it. The NOTIFY row is written <em>after</em> the rollback released the connection. With a pool of 10 this hides until the day 10 requests arrive together.</li>
</ul>

<h3>🧪 Exercise</h3>
<p>Requirement from the client: "if a booking fails, the audit log must still record the failure". With <code>@Transactional()</code> on <code>create()</code>, any write in the <code>catch</code> rolls back together with the booking. Make the failure record survive — without injecting <code>PrismaService</code> directly.</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>Propagation.RequiresNew</code> opens a second transaction on another connection and commits it on its own: the booking is gone, the <code>BOOKING_FAILED</code> row stayed. A trap met while writing this solution: declaring <code>type Host = TransactionHost&lt;…&gt;</code> and using <code>Host</code> in the constructor made Nest fail with <code>Nest can't resolve dependencies of the AuditCls (?)… appears to be undefined at runtime</code> — the type alias erases the class from decorator metadata. Write the class name in the constructor.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you run writes from two services in one transaction in Nest?</strong> Pass the transaction client down explicitly, or keep it in CLS (<code>@nestjs-cls/transactional</code>) so services read <code>txHost.tx</code>. CLS removes parameter drilling but requires every data access to go through the host.</li>
<li><strong>What is CLS / AsyncLocalStorage?</strong> Storage bound to an async call chain — like a thread-local in Java, but following promises instead of threads.</li>
<li><strong>Why not call an external API inside a transaction?</strong> It holds a pooled connection and row locks for the whole network time, hits the transaction timeout, and its side effect cannot be rolled back.</li>
<li><strong>Does self-invocation break @Transactional here as in Spring?</strong> Not with nestjs-cls — it wraps the method, not a proxy around the bean (measured: rollback still happened).</li>
</ol>

<h3>💼 On the job</h3>
<p>A typical code review comment on an OJT pull request: "this <code>await mailer.send()</code> is inside the transaction". The fix is to move side effects after the commit and keep transactions to a few short statements. Measure it in review terms: a transaction that touches the network is a bug until proven otherwise.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interactive transaction</span><span class="v">prisma.$transaction(async (tx) =&gt; …): all statements on one connection; default timeout 5000 ms, maxWait 2000 ms.</span></div>
  <div class="kv"><span class="k">Prisma.TransactionClient</span><span class="v">Type of tx inside the callback — the parameter you must pass down without CLS.</span></div>
  <div class="kv"><span class="k">CLS / AsyncLocalStorage</span><span class="v">Value bound to an async call chain; nestjs-cls stores the open transaction there.</span></div>
  <div class="kv"><span class="k">TransactionHost.tx</span><span class="v">The transaction client inside @Transactional, the plain client outside.</span></div>
  <div class="kv"><span class="k">Propagation.RequiresNew</span><span class="v">Separate transaction that commits independently of the outer one.</span></div>
  <div class="kv"><span class="k">P2028</span><span class="v">Prisma: transaction expired (timeout) — the work is rolled back.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Without a transaction, a failure in the second service leaves the first write behind (an orphan booking).</li>
<li>Passing <code>tx</code> works but must reach every layer; CLS (<code>@Transactional</code> + <code>txHost.tx</code>) carries it implicitly.</li>
<li>Any service that injects <code>PrismaService</code> directly escapes the CLS transaction — and with a small pool can deadlock it.</li>
<li>Keep transactions short: no network calls, side effects after commit.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>6.2 — Một việc nghiệp vụ, hai service, một transaction</h2>
<p class="lead">Đặt một phòng là ghi một dòng booking và một dòng nhật ký. Trong mã Nest, hai lệnh ghi đó nằm ở hai service — <code>BookingsService</code> và <code>AuditService</code> — vì chúng thuộc hai module. Cơ sở dữ liệu chỉ biết transaction trên <em>một kết nối</em>. Câu hỏi riêng của Nest vì thế là: <strong>service thứ hai tìm thấy kết nối của transaction mà service thứ nhất đã mở bằng cách nào?</strong> Hai dạng <code>$transaction</code> của Prisma và mức cô lập đã dạy ở khoá Prisma ORM (liên kết bên dưới); ở đây ta nối chúng qua DI container.</p>

<h3>Liên hệ đời thường: tờ phiếu chuyển khoản</h3>
<p>Chuyển khoản là trừ tài khoản A và cộng tài khoản B. Hai giao dịch viên có thể làm hai nửa, nhưng họ ghi trên <em>cùng một tờ phiếu</em>, và ngân hàng đóng dấu một lần. Nếu người thứ hai làm trên tờ phiếu khác, tiền rời A mà không bao giờ tới B. Tờ phiếu là transaction; câu hỏi của bài là làm sao đưa đúng tờ phiếu đó cho mọi giao dịch viên.</p>

<h3>Bối cảnh</h3>
<p>Cột <code>action</code> của nhật ký là <code>VARCHAR(20)</code>, còn mã ghi <code>BOOKING_CREATED_BY_STUDENT</code> (26 ký tự) — nên lệnh ghi nhật ký luôn hỏng <em>sau khi</em> booking đã ghi. Một kiểu hỏng rất đời: giới hạn trong schema mà không ai nhớ.</p>

<h3>Cách 1 và 2 — không transaction, rồi truyền transaction client qua tham số</h3>
<pre><code class="language-ts">${esc(MA_THAMSO)}</code></pre>

<h3>Cách 3 — CLS: transaction đi theo lời gọi, không đi theo tham số</h3>
<p>CLS (continuation-local storage) chính là <code>AsyncLocalStorage</code> của Node: một giá trị gắn với "chuỗi lời gọi bất đồng bộ này", hàm nào trong chuỗi cũng thấy. <code>nestjs-cls</code> bọc nó cho Nest, và plugin transactional cất transaction đang mở vào đó. Service hỏi <code>TransactionHost.tx</code>: trong phương thức có <code>@Transactional()</code> thì đó là transaction client, ngoài ra là <code>PrismaService</code> bình thường.</p>
<pre><code class="language-ts">${esc(MA_CLS)}</code></pre>
<p>Năm lần chạy, trạng thái DB sau mỗi lần:</p>
<div class="out">${esc(OUT_TX)}</div>
<ol>
<li><strong>khong-tx</strong> — nhật ký hỏng, booking vẫn còn: một dòng mồ côi không có dấu vết kiểm toán. Mỗi lời gọi Prisma là một transaction riêng.</li>
<li><strong>tham-so</strong> — đã rollback. Đúng, nhưng cái giá hiện ngay trong mã: mọi phương thức trong chuỗi phải thêm tham số <code>db: Prisma.TransactionClient</code>, và quên một lần là lặng lẽ thoát khỏi transaction.</li>
<li><strong>cls</strong> — đã rollback, và không service nào có tham số transaction.</li>
<li><strong>cls-ro-ri</strong> — booking đã rollback, vậy mà bảng vẫn có <code>đã gửi email cho booking #1</code>: một service cũ tiêm thẳng <code>PrismaService</code>, nên lệnh ghi của nó chạy trên kết nối khác và đã commit. Booking #1 không tồn tại. Với CLS, <strong>mọi repository/service phải dùng <code>txHost.tx</code></strong> — khi áp dụng hãy grep các chỗ tiêm <code>PrismaService</code>.</li>
<li><strong>goi-noi-bo</strong> — <code>goiNoiBo()</code> gọi <code>this.create()</code> trong cùng lớp, vẫn rollback. Ở Spring, <code>@Transactional</code> chạy qua proxy nên gọi nội bộ sẽ bỏ qua nó; <code>nestjs-cls</code> bọc chính phương thức nên không bị.</li>
</ol>

<h3>Trong ứng dụng HTTP</h3>
<p>Ở các script trên ta tự mở ngữ cảnh CLS bằng <code>cls.run()</code>. Trong ứng dụng thật, để module gắn middleware của nó, mỗi request sẽ có ngữ cảnh riêng:</p>
<pre><code class="language-ts">${esc(MA_HTTP)}</code></pre>
<div class="out">${esc(OUT_HTTP)}</div>
<p>Hai request, hai mã transaction khác nhau của PostgreSQL, và trong mỗi request mọi lệnh chạy chung một transaction (<code>cungTx: true</code>).</p>

<h3>Propagation — cùng từ ngữ với Spring</h3>
<table>
<tr><th>Propagation</th><th>Khi đã có transaction đang mở</th><th>Khi chưa có</th></tr>
<tr><td><code>Required</code> (mặc định)</td><td>tham gia vào</td><td>mở mới</td></tr>
<tr><td><code>RequiresNew</code></td><td>mở transaction riêng, commit độc lập</td><td>mở mới</td></tr>
<tr><td><code>Nested</code></td><td>savepoint bên trong (cần <code>sqlFlavor</code>)</td><td>mở mới</td></tr>
<tr><td><code>Mandatory</code></td><td>tham gia vào</td><td>ném lỗi</td></tr>
<tr><td><code>Supports</code> / <code>NotSupported</code> / <code>Never</code></td><td>tham gia / chạy ngoài / ném lỗi</td><td>chạy không transaction</td></tr>
</table>

<h3>Nửa còn lại của vấn đề: giữ transaction quá lâu</h3>
<pre><code class="language-ts">${esc(MA_DAI)}</code></pre>
<div class="out">${esc(OUT_DAI)}</div>
<ul>
<li><strong>Gọi mạng trong transaction</strong> ("email" 6 s) ⇒ <code>P2028</code> ở giây 6.0: interactive transaction của Prisma có timeout mặc định 5000 ms. Bảng trống sau đó — lệnh ghi đầu đã rollback. Nhưng ngoài đời email <em>đã gửi đi</em>: DB nói "không có booking", hộp thư sinh viên nói "đã đặt". Tác dụng bên ngoài không rollback được. Làm chúng sau khi commit (hoặc qua outbox và hàng đợi — Chương 9).</li>
<li><strong>Transaction dài làm cạn pool.</strong> Pool 2, hai transaction mỗi cái giữ một kết nối 3 s ⇒ một lệnh <code>count()</code> vặt bắt đầu ở 0,1 s mà tới 3,0 s mới xong. Mọi request của ứng dụng xếp hàng sau hai cái chậm.</li>
<li><strong>Transaction có thể tự chờ chính nó.</strong> Pool 1 + service rò rỉ ở lần chạy 4: transaction giữ kết nối duy nhất, lệnh ghi rò rỉ chờ một kết nối, transaction chờ lệnh ghi — cho tới khi timeout 5 s giết nó. Dòng NOTIFY được ghi <em>sau khi</em> rollback trả kết nối. Với pool 10, lỗi này nằm im cho tới ngày 10 request tới cùng lúc.</li>
</ul>

<h3>🧪 Bài tập</h3>
<p>Yêu cầu của khách: "đặt phòng thất bại thì nhật ký vẫn phải ghi lại lần thất bại". Với <code>@Transactional()</code> trên <code>create()</code>, mọi lệnh ghi trong <code>catch</code> rollback cùng booking. Hãy làm cho bản ghi thất bại sống sót — không được tiêm thẳng <code>PrismaService</code>.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p><code>Propagation.RequiresNew</code> mở transaction thứ hai trên kết nối khác và tự commit: booking không còn, dòng <code>BOOKING_FAILED</code> ở lại. Một cái bẫy gặp khi viết lời giải này: khai <code>type Host = TransactionHost&lt;…&gt;</code> rồi dùng <code>Host</code> trong constructor khiến Nest báo <code>Nest can't resolve dependencies of the AuditCls (?)… appears to be undefined at runtime</code> — bí danh kiểu xoá mất lớp khỏi metadata của decorator. Hãy viết thẳng tên lớp trong constructor.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Làm sao cho lệnh ghi của hai service chung một transaction trong Nest?</strong> Truyền transaction client xuống tường minh, hoặc giữ nó trong CLS (<code>@nestjs-cls/transactional</code>) để service đọc <code>txHost.tx</code>. CLS bỏ được việc truyền tham số nhưng đòi mọi truy cập dữ liệu đi qua host.</li>
<li><strong>CLS / AsyncLocalStorage là gì?</strong> Kho gắn với một chuỗi lời gọi bất đồng bộ — giống thread-local của Java, nhưng đi theo promise thay vì theo luồng.</li>
<li><strong>Vì sao không gọi API bên ngoài trong transaction?</strong> Nó giữ một kết nối của pool và khoá dòng suốt thời gian mạng, chạm timeout transaction, và tác dụng của nó không rollback được.</li>
<li><strong>Gọi nội bộ có làm hỏng @Transactional như ở Spring không?</strong> Với nestjs-cls thì không — nó bọc phương thức chứ không bọc proxy quanh bean (đo được: vẫn rollback).</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Một nhận xét review rất hay gặp trên pull request của thực tập sinh: "lệnh <code>await mailer.send()</code> này nằm trong transaction". Cách sửa là đưa tác dụng bên ngoài ra sau commit và giữ transaction chỉ vài lệnh ngắn. Nói theo ngôn ngữ review: transaction nào chạm mạng thì coi là lỗi cho tới khi chứng minh được điều ngược lại.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interactive transaction</span><span class="v">prisma.$transaction(async (tx) =&gt; …): mọi lệnh trên một kết nối; timeout mặc định 5000 ms, maxWait 2000 ms.</span></div>
  <div class="kv"><span class="k">Prisma.TransactionClient</span><span class="v">Kiểu của tx trong callback — tham số bạn phải truyền xuống nếu không có CLS.</span></div>
  <div class="kv"><span class="k">CLS / AsyncLocalStorage</span><span class="v">Giá trị gắn với chuỗi lời gọi bất đồng bộ; nestjs-cls cất transaction đang mở ở đó.</span></div>
  <div class="kv"><span class="k">TransactionHost.tx</span><span class="v">Transaction client khi ở trong @Transactional, client thường khi ở ngoài.</span></div>
  <div class="kv"><span class="k">Propagation.RequiresNew</span><span class="v">Transaction riêng, commit độc lập với transaction bên ngoài.</span></div>
  <div class="kv"><span class="k">P2028</span><span class="v">Prisma: transaction hết hạn (timeout) — mọi việc trong đó bị rollback.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Không có transaction, service thứ hai hỏng thì lệnh ghi của service thứ nhất ở lại (booking mồ côi).</li>
<li>Truyền <code>tx</code> thì đúng nhưng phải tới được mọi tầng; CLS (<code>@Transactional</code> + <code>txHost.tx</code>) mang nó đi ngầm.</li>
<li>Service nào tiêm thẳng <code>PrismaService</code> là thoát khỏi transaction CLS — và với pool nhỏ có thể làm nó tự kẹt.</li>
<li>Giữ transaction ngắn: không gọi mạng, tác dụng bên ngoài làm sau commit.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
