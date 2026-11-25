/**
 * 8.1 — Race condition: đặt trùng, mất cập nhật, kiểm-rồi-làm (soạn 24/11/2026, máy nhà Linux).
 * Output THẬT: PostgreSQL 16 (dbg-pg), API Express 5 + Prisma 6.19.3 (Node 22, cổng 41810), dịch vụ Spring Boot 4.1.1 + Hibernate 7 (JDK 25, cổng 41812),
 * jcmd Thread.print — scratchpad/dbg/lab/ch8 (node/thu/dua.mjs, java/thu/*.java, tools/c81.sh, tools/c81-java.sh; o-81-*.txt).
 */
import { nguon, lienKet } from '../_chung.mjs';
import { APP_TS, DUA, J_APP, J_DUA, J_KHOA as MA_KHOA, J_DEM as MA_DEM, KHOANG_SQL } from './_ma-8.mjs';
import { DAT, MUON, PHIEU, UNIQUE_500, SUA, VERSION, KHOANG, J_DUA as RA_J_DUA, J_DUMP_DEM, J_DUMP, J_DUMP_DUA, J_KHOA, J_DEM } from './_ra-8.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const MA_KIEM_LAM = ma(`// LỖI kinh điển: KIỂM rồi mới LÀM — giữa hai câu là một "khoảng hở"
const trung = await prisma.datCho.findFirst({ where: { phongId, ngay, ca } });   // (1) đọc: chưa ai đặt
if (trung) return res.status(409).json({ loi: 'Ca này đã có người đặt' });
//      ← 19 request khác cũng đã qua (1) trong lúc request này đang chờ DB
await prisma.datCho.create({ data: { phongId, ngay, ca, nguoi } });               // (2) ghi: cả 20 cùng ghi`);

const MA_SUA_UNIQUE = ma(`// SỬA: để DB làm trọng tài. Ràng buộc trong schema (Prisma) …
model DatCho {
  // …
  @@unique([phongId, ngay, ca], name: "dat_cho_mot_ca")
}
// … và bắt đúng mã lỗi của nó: P2002 = vi phạm UNIQUE ⇒ 409 cho người đến sau, không phải 500
try {
  await prisma.datCho.create({ data: { phongId, ngay, ca, nguoi } });
} catch (e) {
  if (e.code === 'P2002') return res.status(409).json({ loi: 'Ca này vừa có người đặt' });
  throw e;
}`);

const MA_SUA_NGUYEN_TU = ma(`// LỖI: đọc → tính trong JS → ghi  (read-modify-write)
const tb = await prisma.thietBi.findUniqueOrThrow({ where: { id } });
if (tb.conLai <= 0) return res.status(409).end();
await prisma.thietBi.update({ where: { id }, data: { conLai: tb.conLai - 1 } });   // 50 người cùng ghi "9"

// SỬA 1 — nguyên tử: một câu UPDATE có điều kiện, DB tự trừ trên giá trị HIỆN TẠI
const { count } = await tx.thietBi.updateMany({ where: { id, conLai: { gt: 0 } }, data: { conLai: { decrement: 1 } } });
if (count === 0) return null;                 // hết kit — 0 dòng khớp điều kiện
// SQL tương đương: UPDATE "ThietBi" SET "conLai" = "conLai" - 1 WHERE id = $1 AND "conLai" &gt; 0

// SỬA 2 — khoá lạc quan: chỉ ghi nếu version chưa đổi; thua thì đọc lại, thử lại
const { count } = await prisma.thietBi.updateMany({
  where: { id, version: tb.version },
  data: { conLai: tb.conLai - 1, version: { increment: 1 } },
});`);

const MA_JAVA_SYNC = ma(`@Service
public class MuonService {
  @Transactional
  public synchronized boolean muonSync(long id, long chamMs) {   // "thêm synchronized là hết race"?
    Kit k = repo.findById(id).orElseThrow();
    if (k.conLai <= 0) return false;
    k.conLai = k.conLai - 1;          // dirty checking: UPDATE chỉ được gửi lúc COMMIT
    return true;
  }                                   // ← khoá monitor nhả Ở ĐÂY …
}                                     // … nhưng proxy @Transactional commit SAU đó ⇒ luồng kế đọc giá trị CŨ

// Spring tạo một lớp con CGLIB bọc quanh: begin → gọi muonSync() → (nhả synchronized) → commit
// Thêm nữa: synchronized chỉ khoá trong MỘT JVM — chạy 2 instance sau load balancer là vô nghĩa.`, 'java');

const MA_JAVA_VERSION = ma(`@Entity
public class KitV {
  @Id Long id;
  int conLai;
  @Version long version;      // Hibernate tự thêm "… where id=? and version=?" vào mọi UPDATE
}
// 0 dòng bị UPDATE ⇒ ObjectOptimisticLockingFailureException (Spring) ⇒ trả 409 hoặc thử lại

// Nguyên tử với Spring Data JPA:
@Modifying
@Query("update Kit k set k.conLai = k.conLai - 1 where k.id = :id and k.conLai &gt; 0")
int truNeuCon(Long id);       // 1 = mượn được, 0 = hết`, 'java');

const BANG_CHON_EN = `<table>
<thead><tr><th>Situation</th><th>Fix</th><th>What the loser sees</th></tr></thead>
<tbody>
<tr><td>"At most one row with these values" (one booking per room/day/slot, one account per email)</td><td><code>UNIQUE</code> constraint, handle <code>P2002</code> / <code>23505</code> / <code>DataIntegrityViolationException</code></td><td>409, immediately</td></tr>
<tr><td>Free time ranges that must not overlap</td><td>PostgreSQL <code>EXCLUDE USING gist (room WITH =, range WITH &amp;&amp;)</code></td><td>409 (<code>23P01</code>)</td></tr>
<tr><td>A counter / stock / balance</td><td>Atomic conditional <code>UPDATE … SET x = x - 1 WHERE x &gt; 0</code></td><td>409 when 0 rows updated</td></tr>
<tr><td>Edit form a person keeps open for minutes</td><td>Optimistic locking (<code>@Version</code>, version column)</td><td>"Someone changed this — reload"</td></tr>
<tr><td>Several rows must change together under a business rule</td><td><code>SELECT … FOR UPDATE</code> in a fixed order (lesson 7.4) or <code>SERIALIZABLE</code> + retry</td><td>waits, or retries</td></tr>
<tr><td>Memory state in one Node process</td><td>No <code>await</code> between check and mark; mark first, roll back on failure</td><td>409</td></tr>
</tbody></table>`;

const BANG_CHON_VI = `<table>
<thead><tr><th>Tình huống</th><th>Cách sửa</th><th>Người đến sau thấy gì</th></tr></thead>
<tbody>
<tr><td>"Nhiều nhất một dòng có các giá trị này" (một lượt đặt cho mỗi phòng/ngày/ca, một tài khoản cho mỗi email)</td><td>Ràng buộc <code>UNIQUE</code>, bắt <code>P2002</code> / <code>23505</code> / <code>DataIntegrityViolationException</code></td><td>409, ngay lập tức</td></tr>
<tr><td>Khoảng giờ tự do, không được chồng nhau</td><td>PostgreSQL <code>EXCLUDE USING gist (phong WITH =, khoang WITH &amp;&amp;)</code></td><td>409 (<code>23P01</code>)</td></tr>
<tr><td>Bộ đếm / tồn kho / số dư</td><td><code>UPDATE … SET x = x - 1 WHERE x &gt; 0</code> nguyên tử, có điều kiện</td><td>409 khi 0 dòng được cập nhật</td></tr>
<tr><td>Form sửa mà người dùng mở hàng phút</td><td>Khoá lạc quan (<code>@Version</code>, cột version)</td><td>"Có người vừa sửa — tải lại"</td></tr>
<tr><td>Nhiều dòng phải đổi cùng nhau theo một luật nghiệp vụ</td><td><code>SELECT … FOR UPDATE</code> theo thứ tự cố định (bài 7.4) hoặc <code>SERIALIZABLE</code> + thử lại</td><td>chờ, hoặc thử lại</td></tr>
<tr><td>Trạng thái trong bộ nhớ của một tiến trình Node</td><td>Không có <code>await</code> giữa kiểm và đánh dấu; đánh dấu trước, hoàn lại nếu thất bại</td><td>409</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐘', 'PostgreSQL 16 — Range types: constraints on ranges', 'EXCLUDE USING gist với btree_gist: cấm hai khoảng chồng nhau cho cùng một phòng.', 'https://www.postgresql.org/docs/16/rangetypes.html'),
  nguon('🌱', 'Spring Data JPA — Locking', '@Version (khoá lạc quan) và @Lock(PESSIMISTIC_WRITE) trên repository.', 'https://docs.spring.io/spring-data/jpa/reference/jpa/locking.html'),
  nguon('🌱', 'Spring Framework — Using @Transactional', 'Proxy bao quanh lời gọi: transaction bắt đầu trước và commit sau thân hàm.', 'https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html'),
  nguon('☕', 'JDK 25 — jcmd', 'Thread.print (thread dump, tự phát hiện deadlock), GC.class_histogram, GC.heap_dump.', 'https://docs.oracle.com/en/java/javase/25/docs/specs/man/jcmd.html'),
  nguon('🛡', 'PortSwigger Research — Smashing the state machine (2023)', 'Kỹ thuật "single-packet attack" bắn 20–30 request trong cùng một gói để khai thác race trên web thật.', 'https://portswigger.net/research/smashing-the-state-machine'),
  nguon('☕', 'Sakurity — Hacking Starbucks for unlimited coffee (2015)', 'Race condition khi chuyển tiền giữa hai thẻ quà tặng: gửi song song ⇒ số dư được cộng hai lần.', 'https://sakurity.com/blog/2015/05/21/starbucks.html'),
  lienKet({ khoa: 'spring-boot', bai: 'sb-7-5-khoa-lac-quan', title: 'Spring Boot 7.5 — Khoá lạc quan và bi quan', sub: 'Lý thuyết @Version / @Lock đầy đủ — bài này chỉ dạy cách tái hiện và chứng minh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'prisma-orm', bai: 'pr-7-3-khoa', title: 'Prisma ORM 7.3 — Khoá: bi quan, lạc quan, advisory', sub: 'FOR UPDATE qua $queryRaw, cột version, advisory lock.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-7-4-khoa', title: 'Bài 7.4 — Khoá và deadlock trong PostgreSQL', sub: 'Khi KHOÁ quá tay: ai đang chặn ai, deadlock giữa hai request.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '8.1 — Race conditions: double booking, lost updates, check-then-act|||8.1 — Race condition: đặt trùng, mất cập nhật, kiểm-rồi-làm',
  slug: 'dbg-8-1-race',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tái hiện race bằng script thay vì "bấm thật nhanh": 20 request cùng lúc ⇒ 10–19 lượt đặt trùng một ca, lần lượt thì chỉ 1; hai người lặp 100 vòng ⇒ 100% vòng trùng. Mất cập nhật: 50 người mượn 10 kit ⇒ 50 lượt thành công, kho còn 9. Node "đơn luồng" vẫn race qua await (phiếu dùng một lần bị dùng 2–5 lần). Sửa bằng UNIQUE (bắt P2002, không thì 19 lỗi 500), EXCLUDE cho khoảng giờ, UPDATE nguyên tử, khoá lạc quan (368 lần thử lại, 8 người bị 503). Spring: synchronized + @Transactional vẫn bán quá kho, @Version, thread dump bằng jcmd (9 luồng BLOCKED chờ một monitor), deadlock trong JVM, count++ mất 40–46%.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Two people, one room, the same millisecond</h2>
<p class="lead">A race condition is a bug whose result depends on the <em>timing</em> of two or more operations. On your laptop, clicking alone, it never happens; on Monday morning, with 200 students booking lab rooms the minute registration opens, it happens every time. The method of this course still works — but step one, <strong>reproduce</strong>, needs a tool: a script that fires many requests at the same instant and then asks the database what really happened. This lesson builds that script, uses it on three races in Node and three in Spring, and shows how to read a Java thread dump.</p>

<h3>An everyday picture: two cards, one account</h3>
<p>You and your sibling share a bank account with 500,000 VND. At the same moment you stand at two ATMs and each withdraw 400,000. Each machine reads "balance 500,000 ≥ 400,000 — OK", each pays out, each writes "balance 100,000". The bank lost 400,000 and its records look perfectly normal. Every race in this lesson is this story: <strong>read, decide, write</strong> — with someone else slipping in between the read and the write.</p>

<h3>1. Reproduce: a script, not fast fingers</h3>
<p>The sample API (Express 5 + Prisma 6.19, port 41810) books lab rooms by slot. The code checks for an existing booking, then creates one:</p>
${MA_KIEM_LAM}
<details><summary>node/thu/dua.mjs — fire N requests at once with Promise.all, then count in the database</summary>${ma(DUA)}</details>
${ra(DAT)}
<p>Three runs, three lessons. (1) Twenty simultaneous requests created ten bookings for one slot — in an earlier run it was nineteen; the number changes every time, which is itself the signature of a race. (2) The same twenty requests sent <em>one after another</em> — exactly what a manual test or a typical integration test does — behave perfectly. Your tests pass and production double-books. (3) You do not need a crowd: with only two people, 100 out of 100 rounds double-booked, because the gap between the <code>SELECT</code> and the <code>INSERT</code> is a full database round trip. Always count in the database, not from HTTP codes: the API said <code>201</code> ten times and believed every one of them.</p>
<p>Other ways to fire in parallel: <code>curl --parallel --parallel-max 20</code> with a URL list, load tools like <a href="https://grafana.com/docs/k6/latest/" target="_blank" rel="noopener">k6</a> or autocannon, Java's <code>ExecutorService</code> + <code>CountDownLatch</code> (section 5). Increase the chance of collision rather than hoping for it: more requests per round, many rounds, and report "x out of 100 rounds" — that number is your before/after evidence.</p>

<h3>2. Lost update: 50 people, 10 kits</h3>
${ra(MUON)}
<p>Fifty students borrowed from a box of ten Arduino kits; all fifty were told "OK", 50 loan rows exist, and the stock says <strong>9</strong>. The last line is the proof: every successful request had read <code>conLai = 10</code>. Each computed 10 − 1 in JavaScript and wrote 9 — forty-nine updates were lost. This is the <em>read-modify-write</em> race, and an ORM makes it look innocent: <code>update({ data: { conLai: tb.conLai - 1 } })</code> sends a constant, not "minus one".</p>

<h3>3. "Node is single-threaded, so no races" — wrong</h3>
${ra(PHIEU)}
<p>A one-time coupon kept in a plain <code>Map</code>, no database involved — and in eight runs it was used 2, 3 or 5 times. JavaScript runs one callback at a time, but every <code>await</code> is a point where the current request pauses and others run. Here the code checks <code>daDung</code>, then <code>await</code>s a user check, then marks the coupon used; the other requests run their check during that wait. Rule: no <code>await</code> between "check" and "mark". Mark first, undo if the later step fails (the <code>SUA=phieu</code> branch in <code>src/app.ts</code>).</p>
<details><summary>src/app.ts — the full sample API (bugs + fixes behind SUA=…)</summary>${ma(APP_TS, 'ts')}</details>

<h3>4. Fix it where the truth lives: the database</h3>
<p>Locks inside one process cannot protect data shared by several processes, servers or a second instance after scaling. The database sees every write, so let it be the referee.</p>
${MA_SUA_UNIQUE}
${ra(UNIQUE_500)}
<p>A half-fix worth seeing: the constraint is in place but the code does not catch the error. The data is now correct (one booking), but nineteen users get <strong>HTTP 500</strong> and the log has 19 <code>P2002</code> lines — QA will file that as a new bug. The constraint and the 409 go together.</p>
${MA_SUA_NGUYEN_TU}
${ra(SUA)}
<p>With the constraint handled, the atomic update and the coupon fix: one booking out of twenty, 0 duplicate rounds out of 100, exactly ten kits lent and the stock at 0, the coupon used once in every run. Now compare optimistic locking on the same hot row:</p>
${ra(VERSION)}
<p>Correct data — but 368 retries for 50 requests, and eight students were told "too busy" (503) while kits were still left at that moment. Optimistic locking is excellent when conflicts are <em>rare</em> (two admins editing the same record); on a hot counter that everybody hits at once it turns into a retry storm. For counters use the atomic update.</p>
<p>When bookings are free time ranges instead of fixed slots, <code>UNIQUE</code> cannot express "must not overlap". PostgreSQL can:</p>
<details><summary>tools/c81-khoang.sql</summary>${ma(KHOANG_SQL, 'sql')}</details>
${ra(KHOANG)}
<p>09:30–11:00 overlaps 08:00–10:00 and is rejected; 10:00–12:00 touches but does not overlap (ranges are <code>[start, end)</code>), so it is accepted. With Prisma, add the constraint in a migration file and map SQLSTATE <code>23P01</code> to 409.</p>
${BANG_CHON_EN}

<h3>5. The same races in Spring Boot — and a classic false fix</h3>
<p>The Java service (Spring Boot 4.1.1, Hibernate 7, port 41812) lends kits four ways. The client is plain Java: 50 threads wait at a <code>CountDownLatch</code> and start together.</p>
<details><summary>java/thu/Dua.java — ExecutorService + CountDownLatch</summary>${ma(J_DUA, 'java')}</details>
${MA_JAVA_SYNC}
${ra(RA_J_DUA)}
<p><code>loi</code>: 50 successes, stock 4 — lost updates, as in Node. <code>sync</code>: the method is <code>synchronized</code>, and still <strong>50 successes from a box of ten</strong>. The monitor is released when the method body returns, but Spring's transactional proxy commits <em>after</em> that; the next thread enters, reads the old row (the previous UPDATE is not committed yet) and decrements the same value. Even if it worked, it would only protect one JVM. <code>version</code>: correct but 41 rejections while one kit was still left — again, retry or use atomic updates for counters. <code>nguyentu</code>: exactly 10 and stock 0.</p>
${MA_JAVA_VERSION}
<details><summary>java/src/vn/labflow/c8/C8App.java — the full service</summary>${ma(J_APP, 'java')}</details>

<h3>6. Reading a thread dump: who holds the lock?</h3>
<p>When a Java service "hangs" or is slow only under load, take a <strong>thread dump</strong>: a snapshot of every thread and what it is doing. <code>jcmd &lt;pid&gt; Thread.print</code> (or <code>jstack &lt;pid&gt;</code>, or IntelliJ's <em>Get Thread Dump</em> camera icon in the Debug window) — it does not stop the JVM, so it is safe even in production. Take two or three, a few seconds apart; a thread that stays at the same line is your suspect.</p>
${ra(J_DUMP_DUA)}
${ra(J_DUMP_DEM)}
${ra(J_DUMP)}
<p>Read it like this: nine Tomcat worker threads are <code>BLOCKED (on object monitor)</code>, all <code>waiting to lock &lt;0x…5b0&gt;</code> — the same address. Search the dump for <code>locked &lt;0x…5b0&gt;</code>: thread <code>exec-27</code> holds it and is <code>sleeping</code> inside <code>muonLoi0</code> at line 66. One slow call inside a <code>synchronized</code> block turns a 60-thread server into a one-lane road. (The 40 <code>TIMED_WAITING (parking)</code> threads are idle workers — normal.)</p>
<p>A true deadlock inside the JVM is even easier, because the JVM finds it for you:</p>
<details><summary>java/thu/KhoaCheo.java</summary>${ma(MA_KHOA, 'java')}</details>
${ra(J_KHOA)}
<p>The same cure as the database deadlock in lesson 7.4: take locks in one global order (for example by room id).</p>
<p>Finally, the smallest race of all — <code>count++</code> is three steps (read, add, write):</p>
<details><summary>java/thu/DemSai.java</summary>${ma(MA_DEM, 'java')}</details>
${ra(J_DEM)}
<p>Eight threads lost 40–46% of their increments, a different amount each run. <code>AtomicInteger</code> (or <code>LongAdder</code>) is exact. Do not "debug" this with a breakpoint: pausing a thread changes the timing and the race disappears (a <em>heisenbug</em>). Measure with a script instead.</p>

<h3>🛡 Hacker's corner: races are attacks, not just bugs</h3>
<p>In 2015 Egor Homakov showed that Starbucks' gift card transfer could be raced: sending the "move balance from card A to card B" request several times in parallel credited card B more than once, creating money (Sakurity, "Hacking Starbucks for unlimited coffee"). In 2023 James Kettle (PortSwigger) published the <em>single-packet attack</em>: 20–30 HTTP/2 requests packed into one TCP packet arrive within about a millisecond, making races in coupon codes, rate limits, 2FA checks and email-change flows reliably exploitable on real sites ("Smashing the state machine"). The lesson for developers: any "use once", "at most N", "only if balance ≥ x" rule enforced with a read-then-write in application code is a security bug. Enforce it with a constraint or an atomic statement, and test it with a parallel script like the one above.</p>

<h3>On the job</h3>
<p>Race tickets usually arrive as "sometimes": <em>"Hôm qua có hai bạn cùng đặt được phòng Lab 401 ca 2, em thử lại thì không bị."</em> Do not close it as "cannot reproduce". Reply with a script that reproduces it (rounds out of 100), the evidence from the database (two rows, same slot), the fix, and the same script showing 0/100 after the fix. In code review, look for these shapes: <code>findFirst</code> then <code>create</code>; <code>findById</code> then <code>save</code> with a computed field; <code>synchronized</code> around a <code>@Transactional</code> method; any <code>await</code> between a check and a mark. Ask "what if two of these run at the same time?" — it is one of the most valuable questions an intern can ask.</p>

<h3>🧪 Practice (60 min)</h3>
<div class="callout ok">
<ol>
<li>Run <code>tools/c81.sh</code>. Change <code>dua.mjs dat 2 100</code> to 2 requests with 5 ms between them: at what gap does the race disappear on your machine?</li>
<li>Add the <code>@@unique</code> to <code>schema.prisma</code> with a real migration (<code>prisma migrate dev</code>) and handle <code>P2002</code>. Show 0/100.</li>
<li>Rewrite <code>/muon/:id</code> with <code>SELECT … FOR UPDATE</code> on the kit row inside an interactive transaction. Compare correctness and total time with the atomic version.</li>
<li>In the Spring service, remove <code>synchronized</code> and put the lock <em>outside</em> the transactional call (controller level). Does it work with one instance? Start a second instance on 41813 and run <code>Dua.java sync 50 41812,41813</code>.</li>
<li>Take three thread dumps 2 seconds apart while <code>Dua.java sync 20 41812 200</code> runs. Which thread holds the monitor in each?</li>
</ol>
<p><strong>Done when:</strong> for each race you have a script that shows "x/100 rounds wrong" before and "0/100" after, and you can explain the gap between the read and the write in one sentence.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">A result that depends on the timing of concurrent operations.</span></div>
  <div class="kv"><span class="k">Check-then-act</span><span class="v">Read a condition, then act on it — someone may change it in between.</span></div>
  <div class="kv"><span class="k">Lost update</span><span class="v">Two read-modify-write cycles overlap; one write overwrites the other.</span></div>
  <div class="kv"><span class="k">Atomic update</span><span class="v">The database computes the new value from the current one in one statement.</span></div>
  <div class="kv"><span class="k">Optimistic locking</span><span class="v">Write only if the version is unchanged; the loser retries or reloads.</span></div>
  <div class="kv"><span class="k">Thread dump</span><span class="v">Snapshot of every JVM thread, its state and the locks it holds or waits for.</span></div>
  <div class="kv"><span class="k">Heisenbug</span><span class="v">A bug that disappears when you observe it (debugger, extra logging).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reproduce races with a parallel script and count in the database; report "x out of 100 rounds".</li>
<li>Sequential tests cannot find races — two concurrent requests are often enough.</li>
<li>Node races too: every <code>await</code> lets other requests in.</li>
<li>Let the database decide: UNIQUE / EXCLUDE, atomic conditional UPDATE, and handle the error as 409.</li>
<li>Optimistic locking is for rare conflicts; on hot rows it becomes a retry storm.</li>
<li><code>synchronized</code> + <code>@Transactional</code> does not protect a read-modify-write, and never across instances.</li>
<li>Thread dump: find <code>waiting to lock &lt;X&gt;</code>, then the thread that <code>locked &lt;X&gt;</code>.</li>
</ul>
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Hai người, một phòng, cùng một mili giây</h2>
<p class="lead">Race condition là lỗi mà kết quả phụ thuộc vào <em>thời điểm</em> của hai hay nhiều thao tác. Trên máy bạn, bấm một mình, nó không bao giờ xảy ra; sáng thứ Hai, khi 200 sinh viên đặt phòng lab ngay phút mở đăng ký, nó xảy ra lần nào cũng thấy. Phương pháp của khoá vẫn đúng — nhưng bước một, <strong>tái hiện</strong>, cần một công cụ: một script bắn nhiều request cùng một lúc rồi hỏi cơ sở dữ liệu xem thật sự đã xảy ra gì. Bài này dựng script đó, dùng nó cho ba race trong Node và ba race trong Spring, và chỉ cách đọc thread dump của Java.</p>

<h3>Liên tưởng đời thường: hai thẻ, một tài khoản</h3>
<p>Bạn và em bạn dùng chung một tài khoản có 500.000 đ. Cùng một lúc, hai người đứng ở hai cây ATM, mỗi người rút 400.000. Mỗi máy đọc "số dư 500.000 ≥ 400.000 — được", mỗi máy nhả tiền, mỗi máy ghi "số dư 100.000". Ngân hàng mất 400.000 mà sổ sách trông hoàn toàn bình thường. Mọi race trong bài này đều là câu chuyện đó: <strong>đọc, quyết định, ghi</strong> — và có người chen vào giữa lúc đọc và lúc ghi.</p>

<h3>1. Tái hiện: dùng script, đừng dùng ngón tay nhanh</h3>
<p>API mẫu (Express 5 + Prisma 6.19, cổng 41810) đặt phòng lab theo ca. Mã kiểm xem đã có lượt đặt chưa, rồi tạo mới:</p>
${MA_KIEM_LAM}
<details><summary>node/thu/dua.mjs — bắn N request cùng lúc bằng Promise.all, rồi đếm trong cơ sở dữ liệu</summary>${ma(DUA)}</details>
${ra(DAT)}
<p>Ba lần chạy, ba bài học. (1) Hai mươi request đồng thời tạo ra mười lượt đặt cho một ca — ở một lần chạy trước là mười chín; con số đổi mỗi lần, và chính điều đó là dấu hiệu của race. (2) Cũng hai mươi request đó nhưng gửi <em>lần lượt</em> — đúng kiểu test tay hay test tích hợp thông thường — chạy hoàn hảo. Test của bạn qua, production thì đặt trùng. (3) Không cần đông người: chỉ hai người, 100 trên 100 vòng đều đặt trùng, vì khoảng hở giữa <code>SELECT</code> và <code>INSERT</code> là cả một vòng đi về tới cơ sở dữ liệu. Luôn đếm trong cơ sở dữ liệu, đừng đếm theo mã HTTP: API trả <code>201</code> mười lần và tin vào từng lần một.</p>
<p>Các cách bắn song song khác: <code>curl --parallel --parallel-max 20</code> với danh sách URL, công cụ tải như <a href="https://grafana.com/docs/k6/latest/" target="_blank" rel="noopener">k6</a> hay autocannon, <code>ExecutorService</code> + <code>CountDownLatch</code> của Java (mục 5). Hãy tăng xác suất va chạm thay vì trông chờ may mắn: nhiều request mỗi vòng, nhiều vòng, và báo "x trên 100 vòng" — con số đó là bằng chứng trước/sau của bạn.</p>

<h3>2. Mất cập nhật: 50 người, 10 bộ kit</h3>
${ra(MUON)}
<p>Năm mươi sinh viên mượn từ một hộp mười bộ kit Arduino; cả năm mươi được báo "OK", có 50 dòng lượt mượn, và kho ghi còn <strong>9</strong>. Dòng cuối là bằng chứng: mọi request thành công đều đã đọc được <code>conLai = 10</code>. Mỗi request tính 10 − 1 trong JavaScript rồi ghi 9 — bốn mươi chín lần cập nhật bị mất. Đây là race <em>đọc-sửa-ghi</em> (read-modify-write), và ORM làm nó trông vô hại: <code>update({ data: { conLai: tb.conLai - 1 } })</code> gửi đi một hằng số, không phải "trừ một".</p>

<h3>3. "Node đơn luồng nên không có race" — sai</h3>
${ra(PHIEU)}
<p>Một phiếu giảm giá dùng một lần giữ trong một <code>Map</code> trơn, không dính gì tới cơ sở dữ liệu — vậy mà trong tám lần chạy nó bị dùng 2, 3 hoặc 5 lần. JavaScript chạy từng callback một, nhưng mỗi <code>await</code> là một điểm request hiện tại tạm dừng và request khác được chạy. Ở đây mã kiểm <code>daDung</code>, rồi <code>await</code> một bước kiểm người dùng, rồi mới đánh dấu đã dùng; các request khác chạy bước kiểm của chúng trong lúc chờ đó. Luật: không có <code>await</code> giữa "kiểm" và "đánh dấu". Đánh dấu trước, hoàn lại nếu bước sau thất bại (nhánh <code>SUA=phieu</code> trong <code>src/app.ts</code>).</p>
<details><summary>src/app.ts — toàn bộ API mẫu (lỗi + bản sửa sau SUA=…)</summary>${ma(APP_TS, 'ts')}</details>

<h3>4. Sửa ở nơi chứa sự thật: cơ sở dữ liệu</h3>
<p>Khoá bên trong một tiến trình không bảo vệ được dữ liệu dùng chung bởi nhiều tiến trình, nhiều server hay instance thứ hai sau khi scale. Cơ sở dữ liệu thấy mọi lần ghi, nên hãy để nó làm trọng tài.</p>
${MA_SUA_UNIQUE}
${ra(UNIQUE_500)}
<p>Một nửa bản sửa đáng xem: ràng buộc đã có nhưng mã chưa bắt lỗi. Dữ liệu giờ đúng (một lượt đặt), nhưng mười chín người dùng nhận <strong>HTTP 500</strong> và log có 19 dòng <code>P2002</code> — QA sẽ mở thành một bug mới. Ràng buộc và mã 409 phải đi cùng nhau.</p>
${MA_SUA_NGUYEN_TU}
${ra(SUA)}
<p>Khi ràng buộc được bắt lỗi, có UPDATE nguyên tử và bản sửa phiếu: một lượt đặt trên hai mươi, 0 vòng trùng trên 100, đúng mười bộ kit được mượn và kho về 0, phiếu chỉ dùng một lần ở mọi lần chạy. Giờ so với khoá lạc quan trên cùng dòng "nóng" đó:</p>
${ra(VERSION)}
<p>Dữ liệu đúng — nhưng 368 lần thử lại cho 50 request, và tám sinh viên bị báo "đông quá" (503) trong khi lúc đó kho vẫn còn kit. Khoá lạc quan rất tốt khi xung đột <em>hiếm</em> (hai admin cùng sửa một bản ghi); trên một bộ đếm mà mọi người đập vào cùng lúc, nó thành cơn bão thử lại. Với bộ đếm, dùng UPDATE nguyên tử.</p>
<p>Khi lượt đặt là khoảng giờ tự do chứ không theo ca cố định, <code>UNIQUE</code> không diễn đạt được "không được chồng nhau". PostgreSQL thì được:</p>
<details><summary>tools/c81-khoang.sql</summary>${ma(KHOANG_SQL, 'sql')}</details>
${ra(KHOANG)}
<p>09:30–11:00 chồng lên 08:00–10:00 nên bị từ chối; 10:00–12:00 chạm nhưng không chồng (khoảng là <code>[bắt đầu, kết thúc)</code>) nên được nhận. Với Prisma, thêm ràng buộc trong một tệp migration và ánh xạ SQLSTATE <code>23P01</code> thành 409.</p>
${BANG_CHON_VI}

<h3>5. Cùng các race đó trong Spring Boot — và một bản sửa giả kinh điển</h3>
<p>Dịch vụ Java (Spring Boot 4.1.1, Hibernate 7, cổng 41812) cho mượn kit theo bốn cách. Client là Java thuần: 50 luồng chờ ở một <code>CountDownLatch</code> rồi xuất phát cùng lúc.</p>
<details><summary>java/thu/Dua.java — ExecutorService + CountDownLatch</summary>${ma(J_DUA, 'java')}</details>
${MA_JAVA_SYNC}
${ra(RA_J_DUA)}
<p><code>loi</code>: 50 lượt thành công, kho còn 4 — mất cập nhật, như trong Node. <code>sync</code>: hàm có <code>synchronized</code>, vậy mà vẫn <strong>50 lượt thành công từ một hộp mười bộ</strong>. Monitor được nhả khi thân hàm return, nhưng proxy transaction của Spring commit <em>sau</em> đó; luồng kế tiếp vào, đọc dòng cũ (UPDATE trước chưa commit) và trừ trên cùng giá trị. Kể cả nếu nó chạy đúng, nó cũng chỉ bảo vệ một JVM. <code>version</code>: đúng nhưng từ chối 41 người trong khi kho vẫn còn một bộ — lại nữa, với bộ đếm hãy thử lại hoặc dùng UPDATE nguyên tử. <code>nguyentu</code>: đúng 10 và kho về 0.</p>
${MA_JAVA_VERSION}
<details><summary>java/src/vn/labflow/c8/C8App.java — toàn bộ dịch vụ</summary>${ma(J_APP, 'java')}</details>

<h3>6. Đọc thread dump: ai đang giữ khoá?</h3>
<p>Khi một dịch vụ Java "treo" hoặc chỉ chậm lúc tải cao, hãy lấy <strong>thread dump</strong>: ảnh chụp mọi luồng và việc nó đang làm. <code>jcmd &lt;pid&gt; Thread.print</code> (hoặc <code>jstack &lt;pid&gt;</code>, hoặc nút máy ảnh <em>Get Thread Dump</em> trong cửa sổ Debug của IntelliJ) — nó không dừng JVM nên an toàn cả trên production. Lấy hai ba bản, cách nhau vài giây; luồng nào đứng mãi ở cùng một dòng là nghi phạm.</p>
${ra(J_DUMP_DUA)}
${ra(J_DUMP_DEM)}
${ra(J_DUMP)}
<p>Đọc như sau: chín luồng worker của Tomcat đang <code>BLOCKED (on object monitor)</code>, tất cả <code>waiting to lock &lt;0x…5b0&gt;</code> — cùng một địa chỉ. Tìm trong dump dòng <code>locked &lt;0x…5b0&gt;</code>: luồng <code>exec-27</code> đang giữ nó và đang <code>sleeping</code> trong <code>muonLoi0</code> ở dòng 66. Một lời gọi chậm bên trong khối <code>synchronized</code> biến server 60 luồng thành đường một làn. (40 luồng <code>TIMED_WAITING (parking)</code> là worker đang rảnh — bình thường.)</p>
<p>Deadlock thật trong JVM còn dễ hơn, vì JVM tự tìm giúp bạn:</p>
<details><summary>java/thu/KhoaCheo.java</summary>${ma(MA_KHOA, 'java')}</details>
${ra(J_KHOA)}
<p>Cách chữa giống deadlock trong cơ sở dữ liệu ở bài 7.4: lấy khoá theo một thứ tự chung (ví dụ theo id phòng).</p>
<p>Cuối cùng, race nhỏ nhất — <code>count++</code> là ba bước (đọc, cộng, ghi):</p>
<details><summary>java/thu/DemSai.java</summary>${ma(MA_DEM, 'java')}</details>
${ra(J_DEM)}
<p>Tám luồng làm mất 40–46% số lần cộng, mỗi lần chạy mất một lượng khác. <code>AtomicInteger</code> (hoặc <code>LongAdder</code>) thì chính xác. Đừng "debug" lỗi này bằng breakpoint: dừng một luồng làm đổi thời điểm và race biến mất (một <em>heisenbug</em>). Hãy đo bằng script.</p>

<h3>🛡 Góc hacker: race là đòn tấn công, không chỉ là bug</h3>
<p>Năm 2015 Egor Homakov chỉ ra rằng tính năng chuyển số dư thẻ quà tặng của Starbucks có thể bị "đua": gửi song song nhiều lần request "chuyển số dư từ thẻ A sang thẻ B" làm thẻ B được cộng nhiều hơn một lần, tức là tạo ra tiền (Sakurity, "Hacking Starbucks for unlimited coffee"). Năm 2023 James Kettle (PortSwigger) công bố <em>single-packet attack</em>: 20–30 request HTTP/2 nhét trong một gói TCP tới server trong khoảng một mili giây, khiến race ở mã giảm giá, giới hạn số lần, kiểm tra 2FA và luồng đổi email trở nên khai thác được một cách ổn định trên các trang thật ("Smashing the state machine"). Bài học cho dev: mọi luật "dùng một lần", "tối đa N", "chỉ khi số dư ≥ x" được thực thi bằng đọc-rồi-ghi trong mã ứng dụng đều là lỗi bảo mật. Hãy thực thi bằng ràng buộc hoặc câu lệnh nguyên tử, và kiểm bằng một script song song như ở trên.</p>

<h3>Tình huống đi làm</h3>
<p>Ticket race thường tới dưới dạng "thỉnh thoảng": <em>"Hôm qua có hai bạn cùng đặt được phòng Lab 401 ca 2, em thử lại thì không bị."</em> Đừng đóng ticket với lý do "không tái hiện được". Hãy trả lời bằng một script tái hiện (số vòng trên 100), bằng chứng từ cơ sở dữ liệu (hai dòng, cùng ca), bản sửa, và chính script đó cho ra 0/100 sau khi sửa. Khi review mã, hãy tìm các hình dạng này: <code>findFirst</code> rồi <code>create</code>; <code>findById</code> rồi <code>save</code> với một trường được tính; <code>synchronized</code> bọc quanh hàm <code>@Transactional</code>; mọi <code>await</code> nằm giữa bước kiểm và bước đánh dấu. Hỏi "nếu hai cái này chạy cùng lúc thì sao?" — đó là một trong những câu hỏi giá trị nhất một intern có thể đặt ra.</p>

<h3>🧪 Thực hành (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>tools/c81.sh</code>. Sửa <code>dua.mjs dat 2 100</code> thành 2 request cách nhau 5 ms: trên máy bạn, khoảng cách bao nhiêu thì race biến mất?</li>
<li>Thêm <code>@@unique</code> vào <code>schema.prisma</code> bằng migration thật (<code>prisma migrate dev</code>) và bắt <code>P2002</code>. Cho thấy 0/100.</li>
<li>Viết lại <code>/muon/:id</code> bằng <code>SELECT … FOR UPDATE</code> trên dòng kit trong một interactive transaction. So độ đúng và tổng thời gian với bản nguyên tử.</li>
<li>Trong dịch vụ Spring, bỏ <code>synchronized</code> và đặt khoá <em>bên ngoài</em> lời gọi có transaction (ở controller). Một instance thì chạy đúng không? Mở thêm instance thứ hai ở 41813 rồi chạy <code>Dua.java sync 50 41812,41813</code>.</li>
<li>Lấy ba thread dump cách nhau 2 giây khi <code>Dua.java sync 20 41812 200</code> đang chạy. Mỗi bản, luồng nào giữ monitor?</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi race bạn có một script cho thấy "x/100 vòng sai" trước và "0/100" sau, và giải thích được khoảng hở giữa đọc và ghi trong một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Race condition</span><span class="v">Kết quả phụ thuộc vào thời điểm của các thao tác chạy đồng thời.</span></div>
  <div class="kv"><span class="k">Kiểm-rồi-làm (check-then-act)</span><span class="v">Đọc một điều kiện rồi hành động theo nó — ai đó có thể đổi nó ở giữa.</span></div>
  <div class="kv"><span class="k">Mất cập nhật (lost update)</span><span class="v">Hai vòng đọc-sửa-ghi chồng nhau; lần ghi này đè lần ghi kia.</span></div>
  <div class="kv"><span class="k">Cập nhật nguyên tử</span><span class="v">Cơ sở dữ liệu tính giá trị mới từ giá trị hiện tại trong một câu lệnh.</span></div>
  <div class="kv"><span class="k">Khoá lạc quan</span><span class="v">Chỉ ghi nếu version chưa đổi; bên thua thử lại hoặc tải lại.</span></div>
  <div class="kv"><span class="k">Thread dump</span><span class="v">Ảnh chụp mọi luồng của JVM, trạng thái, khoá đang giữ hoặc đang chờ.</span></div>
  <div class="kv"><span class="k">Heisenbug</span><span class="v">Lỗi biến mất khi bạn quan sát nó (debugger, thêm log).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tái hiện race bằng script song song và đếm trong cơ sở dữ liệu; báo "x trên 100 vòng".</li>
<li>Test tuần tự không tìm ra race — thường hai request đồng thời là đủ.</li>
<li>Node cũng race: mỗi <code>await</code> cho request khác chen vào.</li>
<li>Để cơ sở dữ liệu quyết định: UNIQUE / EXCLUDE, UPDATE nguyên tử có điều kiện, và trả lỗi dưới dạng 409.</li>
<li>Khoá lạc quan dành cho xung đột hiếm; trên dòng nóng nó thành bão thử lại.</li>
<li><code>synchronized</code> + <code>@Transactional</code> không bảo vệ được đọc-sửa-ghi, và không bao giờ bảo vệ được giữa các instance.</li>
<li>Thread dump: tìm <code>waiting to lock &lt;X&gt;</code>, rồi tìm luồng <code>locked &lt;X&gt;</code>.</li>
</ul>
${NGUON}
</div>
`,
};
