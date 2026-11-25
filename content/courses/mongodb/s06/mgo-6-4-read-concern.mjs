/**
 * 6.4 — Read concern, read preference và nhất quán nhân quả (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s06-4-rc'] — tiếp tục cụm mgo-rs3 của s06-3 (_demo/rs3.sh, failpoint stopReplProducer), xoá cụm ở cuối. MongoDB 8.0.38.
 * Số tất định: secondary ngừng chép, giá 100 → 200 bằng w:1 ⇒ local 200 / majority 100 / secondary 100 / snapshot tại t1 100;
 * linearizable trên primary bị cô lập ⇒ MaxTimeMSExpired sau ~3000 ms; replLag vài giây; giá 300 bằng w:1 trong session nhân quả ⇒ đọc secondary không session 100,
 * cùng session ⇒ MaxTimeMSExpired (chờ afterClusterTime); chép tiếp ⇒ cùng session đọc secondary 301, majority 301.
 * Thực hành 3 đã chạy thật trên mgo-lab: hai lần find snapshot cùng atClusterTime thấy A/B trước khi chuyển.
 * Kiểm trùng: mô hình nhất quán tổng quát ở distributed-systems 5.4 ⇒ liên kết; read preference khi failover/đọc secondary ở cụm thật dạy tiếp ở Chương 7.
 */
import { lenh, ma, nguon, kv, lienKet } from '../_chung.mjs';

const K = 's06-4-rc';

const CAUSAL = `// Trích _demo/node/nhan-qua.mjs — đọc lại thứ mình vừa ghi, kể cả khi đọc từ secondary
const session = client.startSession({ causalConsistency: true });
const ho = client.db('shop').collection('hoSo', {
  readConcern: { level: 'majority' }, writeConcern: { w: 'majority' }, readPreference: 'secondaryPreferred' });
await ho.updateOne({ _id: userId }, { $set: { ten: 'Cường' } }, { session });
const moi = await ho.findOne({ _id: userId }, { session });   // chờ tới khi secondary đã có lần ghi trên
await session.endSession();`;

export default {
  title: '6.4 — Read concern, read preference and causal consistency|||6.4 — Read concern, read preference và nhất quán nhân quả',
  slug: 'mgo-6-4-read-concern',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Đọc cũng có lựa chọn: đọc ảnh chụp nào (read concern: local, majority, snapshot, linearizable) và đọc ở máy nào (read preference). Trên replica set ba thành viên đang đứt nhân bản, cùng một tài liệu cho bốn câu trả lời: local 200, majority 100, secondary 100, snapshot tại thời điểm cũ 100; linearizable từ chối trả lời khi primary bị cô lập; session nhân quả chờ secondary đuổi kịp thay vì trả dữ liệu cũ. Bẫy "lưu xong tải lại thấy cũ" khi đọc từ secondary, maxStalenessSeconds, báo cáo nhất quán bằng atClusterTime.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Read concern, read preference and causal consistency</h2>
<p class="lead">Lesson 6.3 asked "when is a write safe?". This lesson asks the mirror question: "how fresh, and how safe, is what I read?". Two settings answer it. <strong>Read concern</strong> chooses <em>which version</em> of the data a read may see — anything the server has, or only what a majority has made permanent. <strong>Read preference</strong> chooses <em>which member</em> answers — the primary or a secondary that may be behind. Combine them wrongly and a user saves their profile, reloads the page, and sees the old name.</p>

<h3>An everyday picture: exchange rates at the bank</h3>
<p>A bank's head office sets the USD rate. The big board in the head office lobby updates the moment the dealer types it — even a figure the dealer might still correct (<code>local</code>). The official rate sheet is only printed once the head office has confirmed it (<code>majority</code>). The small branch across town shows the rate it received by email this morning, perhaps an hour old (<code>readPreference: secondary</code>). If you need the rate <em>right now, guaranteed</em>, you phone the head office and the dealer confirms with the supervisor before answering — slow, and impossible if the phone line is down (<code>linearizable</code>). And "the rate at exactly 9:00 for all currencies together" is a photo of the board taken at 9:00 (<code>snapshot</code> at a cluster time).</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">local (default for reads)</span><span class="lz-lnote">the newest data on the member you ask — may include writes that will be rolled back (Lesson 6.3)</span></div>
  <div class="lz-layer"><span class="lz-lname">available</span><span class="lz-lnote">like local on replica sets; on sharded clusters may return orphan documents — rarely what you want</span></div>
  <div class="lz-layer"><span class="lz-lname">majority</span><span class="lz-lnote">only data acknowledged by a majority — never rolled back, but may be slightly older</span></div>
  <div class="lz-layer"><span class="lz-lname">snapshot</span><span class="lz-lnote">a majority-committed snapshot at one point in time — inside transactions, or outside with atClusterTime</span></div>
  <div class="lz-layer"><span class="lz-lname">linearizable</span><span class="lz-lnote">confirms with a majority that this primary is still primary before answering — newest and safe, slowest, primary only</span></div>
</div>

<h3>One document, four answers</h3>
<p>The three-member set of Lesson 6.3 again (<code>bash rs3.sh up</code> if you stopped it). Product <code>SP001</code> costs 100; the secondaries stop replicating; the price becomes 200 with <code>w: 1</code>. Now read the same document four ways:</p>
${lenh(K, 0)}
${lenh(K, 1)}
<ul>
<li><strong>local → 200.</strong> The primary has 200 and shows it — but only the primary has it. If a failover happened now, 200 would be rolled back. A <code>local</code> read can show a value that, a minute later, never existed.</li>
<li><strong>majority → 100.</strong> The newest value a majority has is 100, so that is what majority returns, even on the primary. Older, but it will not be taken back.</li>
<li><strong>secondary → 100.</strong> The secondary simply has not received 200. Reading from secondaries means reading the past.</li>
<li><strong>snapshot at t1 → 100.</strong> <code>t1</code> is the cluster time of the last write before the change. A snapshot read "as of t1" returns the world at that instant — useful for reports that must be consistent across several queries.</li>
</ul>
${nguon('📘', 'Read Concern — MongoDB Docs', 'local, available, majority, linearizable, snapshot; what each guarantees, defaults', 'https://www.mongodb.com/docs/manual/reference/read-concern/')}

<h3>linearizable: newest, or no answer</h3>
${lenh(K, 2)}
<p>The primary is cut off from the majority. A <code>local</code> read would happily answer 200; a <code>linearizable</code> read must first prove, with a write acknowledged by a majority, that this server is still the primary — it cannot, so it waits until the time limit. That is the point: an isolated old primary must never serve a "latest" value that the new primary has already overwritten. Use linearizable for the few reads where acting on a stale value is costly (a leader lock, the last check before a large payment), always with <code>maxTimeMS</code>, and only on single-document reads by a unique field.</p>
${nguon('📘', 'Read Concern "linearizable" — MongoDB Docs', 'Primary only; confirms majority; combine with maxTimeMS; single-document reads', 'https://www.mongodb.com/docs/manual/reference/read-concern-linearizable/')}

<h3>Read preference: which member answers</h3>
<p>How far behind are the secondaries right now?</p>
${lenh(K, 3)}
<p>A few seconds here because replication is stopped; on a healthy set usually under a second, but minutes during a heavy batch job or when a secondary is under-sized. The read preference modes: <code>primary</code> (default), <code>primaryPreferred</code>, <code>secondary</code>, <code>secondaryPreferred</code>, <code>nearest</code>. <code>maxStalenessSeconds</code> lets the driver avoid secondaries that lag too much — but it must be at least 90 seconds, so it protects against a badly broken secondary, not against "a few seconds old".</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "read from secondaries to scale reads".</strong> It sounds like free capacity. But every secondary applies every write too, so it is not idle; reads on secondaries return old data; and if one member fails, the others must carry its reads plus their own. Read from secondaries on purpose — analytics that tolerate minutes of lag, a secondary in the user's region — and keep user-facing "I just changed this" reads on the primary. To scale reads, first add indexes (Chapter 4) and a cache (Redis); to scale writes, sharding (Chapter 7).</p>
</div>
${nguon('📘', 'Read Preference — MongoDB Docs', 'Modes, tag sets, maxStalenessSeconds (minimum 90 s), hedged reads', 'https://www.mongodb.com/docs/manual/core/read-preference/')}

<h3>Causal consistency: read your own writes, even on a secondary</h3>
<p>The bug in the introduction: save, reload, see the old value. A <em>causally consistent session</em> fixes it. Every operation in the session returns the cluster time it happened at; the next read in the same session tells the server "do not answer with anything older than that". Same isolated set, price changed to 300 inside a causal session:</p>
${lenh(K, 4)}
<p>Without the session, the secondary answers immediately with 100 — the old value, no error. Inside the session, the secondary knows it has not yet reached the session's last write, so it <em>waits</em> instead of lying; here it can never catch up (replication is stopped), so the read times out. Now replication resumes:</p>
${lenh(K, 5)}
${lenh(K, 6)}
<p>The session writes 301 with majority and immediately reads it back from a secondary: 301. Read-your-writes, monotonic reads, and writes-follow-reads — the guarantees MongoDB calls <em>causal consistency</em> — hold across members, provided you use a session and, for the full guarantees even through failovers, <code>readConcern: "majority"</code> with <code>writeConcern: "majority"</code>. In application code:</p>
${ma('js', CAUSAL)}
${nguon('📘', 'Causal Consistency and Read and Write Concerns — MongoDB Docs', 'Which guarantees hold for each read/write concern combination, with and without failures', 'https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/')}
${lenh(K, 7)}

<div class="pitfall co-tieu-de">
<p><strong>Trap — a session per request is not a session per user.</strong> Causal consistency lives in the session object on one client. If a user's "save" goes to one API instance and the "reload" to another, they are two sessions and the guarantee is gone. Either read user-facing data from the primary, or pass the cluster time along (the response carries it; the next request can call <code>session.advanceClusterTime</code>/<code>advanceOperationTime</code> with it). Most teams simply keep those reads on the primary.</p>
</div>

<h3>Consistent reports with snapshot reads</h3>
<p>A dashboard runs several queries — total revenue, revenue by city, number of orders — while orders keep arriving. Run them one after another with <code>local</code> and the numbers do not add up, because each query saw a different moment. Run each with <code>readConcern: { level: 'snapshot', atClusterTime: t }</code> using the same <code>t</code>, and they all describe the same instant. The server keeps old versions for <code>minSnapshotHistoryWindowInSeconds</code> (300 by default), so the whole report must finish within that window. A transaction with read concern snapshot gives the same consistency for reads inside it.</p>
${nguon('📘', 'Read Concern "snapshot" — MongoDB Docs', 'atClusterTime outside transactions, minSnapshotHistoryWindowInSeconds', 'https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/')}

<h3>Choosing: a small table</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">user sees own change</span><span class="lz-t">primary + default concerns</span><span class="lz-d">or a causal session with majority/majority if reads must go to secondaries</span></div>
  <div class="lz-step"><span class="lz-k">money, stock, decisions</span><span class="lz-t">primary + readConcern majority (or inside a transaction)</span><span class="lz-d">never act on data that may be rolled back</span></div>
  <div class="lz-step"><span class="lz-k">reports, exports</span><span class="lz-t">snapshot at one atClusterTime; secondaryPreferred is fine</span><span class="lz-d">consistent numbers; tolerate seconds of lag</span></div>
  <div class="lz-step"><span class="lz-k">leader lock, final check</span><span class="lz-t">linearizable + maxTimeMS</span><span class="lz-d">slow, primary only, rare</span></div>
</div>

<h3>💼 At work: "I saved, and the page shows the old data"</h3>
<p>A bug that appears only in production: after editing their profile, users sometimes see the old version for a second or two. Locally it never happens — locally there is one member. In the repository you find <code>readPreference=secondaryPreferred</code> in the connection string, added by someone "to reduce load on the primary". The fix you propose: remove it for the user-facing service (keep it, explicitly, for the reporting job); if the team insists on secondary reads, use causal sessions with majority read and write concern and explain the cross-instance limit above. To prove the diagnosis, reproduce it: the lab's <code>ngung-chep</code> makes a secondary lag on demand.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-5-4-isolation', title: 'Distributed Systems 5.4 — Isolation levels vs consistency models', sub: 'Linearizable, causal, read-your-writes — the vocabulary behind these settings' })}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"Read concern vs read preference?"</strong> — Which version of the data (local, majority, snapshot, linearizable) vs which member serves it (primary, secondary, nearest…).</li>
<li><strong>"Can a read return data that later disappears?"</strong> — Yes, with local: it can see writes not yet on a majority, which a failover rolls back. Majority prevents that.</li>
<li><strong>"How do you guarantee read-your-writes with secondary reads?"</strong> — A causally consistent session, ideally with majority read and write concern; or read from the primary.</li>
<li><strong>"When would you use linearizable?"</strong> — Rare single-document reads where a stale value from an isolated old primary is unacceptable; with maxTimeMS.</li>
<li><strong>"Why not read from secondaries to scale?"</strong> — Stale reads, secondaries already do all the writes, and failure of one member overloads the others; use indexes, caching, sharding.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>For each, choose read concern + read preference: (a) the balance shown before a withdrawal; (b) the nightly sales export; (c) the "my orders" page right after checkout; (d) a job that must run on exactly one server (leader election by a lock document).</li>
<li>On the isolated set, a client reads with <code>readConcern: 'majority'</code> from the <em>primary</em> and gets 100 although the primary has 200. Is that a bug? What would happen to an application that showed 200 and the failover then happened?</li>
<li>On <code>mgo-lab</code>, take <code>t = db.adminCommand({ ping: 1 }).operationTime</code>, then move 500 đ from A to B in <code>ch6.tk</code>, then read <code>tk</code> with <code>readConcern: { level: 'snapshot', atClusterTime: t }</code>. What balances do you see, and what does a normal read show?</li>
</ol>
<details><summary>Suggested answers</summary>
<p>1. (a) primary + majority (or inside the withdrawal's transaction). (b) snapshot at one cluster time, <code>secondaryPreferred</code> to keep load off the primary. (c) primary with defaults, or a causal session if reads go to secondaries. (d) linearizable read of the lock document on the primary, with <code>maxTimeMS</code> — plus a majority write to take the lock.</p>
<p>2. Not a bug — that is what majority means: 200 is only on one member and may be rolled back. An application that showed 200 and acted on it ("price confirmed: 200") would have acted on a value that, after the failover, never existed.</p>
<p>3. Run for real: the snapshot read shows the balances <em>before</em> the transfer (A 1,000,000 / B 1,000,000 in that run); a normal read shows A 999,500 / B 1,000,500. Several snapshot reads with the same <code>t</code> all agree with each other.</p>
</details>
<p><strong>Done when:</strong> given a screen or a job, you can name its read concern and read preference and say what it could show in the worst case.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Read concern', 'Which version of data a read may return: local, available, majority, snapshot, linearizable.'],
  ['Read preference', 'Which member serves a read: primary, primaryPreferred, secondary, secondaryPreferred, nearest.'],
  ['Replication lag', 'How far a secondary is behind the primary (rs.printSecondaryReplicationInfo()).'],
  ['maxStalenessSeconds', 'Driver avoids secondaries lagging more than this; minimum 90 seconds.'],
  ['Cluster time / operationTime', 'Logical time of an operation in the replica set; used for snapshot reads and causal sessions.'],
  ['Causal consistency', 'Within a session: read your writes, monotonic reads, writes follow reads — across members.'],
  ['atClusterTime', 'Snapshot read at a given cluster time; consistent across several queries.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Read concern = which version; read preference = which member. They are independent choices.</li>
<li>local can show writes that a failover will roll back; majority shows only what will stay.</li>
<li>Secondaries serve the past; maxStalenessSeconds only guards against lag of 90 s or more.</li>
<li>linearizable refuses to answer from an isolated primary — use it rarely, with maxTimeMS.</li>
<li>Causal sessions make a secondary wait until it has your last write instead of answering stale.</li>
<li>Reports that run several queries should read one snapshot at one atClusterTime.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Read concern, read preference và nhất quán nhân quả</h2>
<p class="lead">Bài 6.3 hỏi "khi nào một lần ghi là an toàn?". Bài này hỏi câu đối xứng: "thứ tôi đọc mới tới đâu, và an toàn tới đâu?". Hai thiết lập trả lời câu đó. <strong>Read concern</strong> chọn lần đọc được thấy <em>phiên bản nào</em> của dữ liệu — mọi thứ máy chủ đang có, hay chỉ những gì đa số đã làm cho vĩnh viễn. <strong>Read preference</strong> chọn <em>thành viên nào</em> trả lời — primary, hay một secondary có thể đang chậm. Ghép sai thì người dùng lưu hồ sơ, tải lại trang, và thấy tên cũ.</p>

<h3>Hình ảnh đời thường: tỉ giá ở ngân hàng</h3>
<p>Hội sở một ngân hàng đặt tỉ giá USD. Bảng điện lớn ở sảnh hội sở cập nhật ngay khi người giao dịch gõ vào — kể cả con số họ có thể còn sửa (<code>local</code>). Tờ tỉ giá chính thức chỉ được in khi hội sở đã chốt (<code>majority</code>). Phòng giao dịch nhỏ bên kia thành phố hiện tỉ giá nhận qua email sáng nay, có thể cũ một tiếng (<code>readPreference: secondary</code>). Nếu bạn cần tỉ giá <em>ngay bây giờ, có bảo đảm</em>, bạn gọi lên hội sở và người giao dịch xác nhận với trưởng phòng trước khi trả lời — chậm, và bất khả nếu đường dây đứt (<code>linearizable</code>). Còn "tỉ giá đúng 9 giờ của mọi ngoại tệ cùng lúc" là tấm ảnh chụp bảng điện lúc 9 giờ (<code>snapshot</code> tại một thời điểm cụm).</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">local (mặc định khi đọc)</span><span class="lz-lnote">dữ liệu mới nhất trên thành viên được hỏi — có thể gồm cả lần ghi sẽ bị rollback (Bài 6.3)</span></div>
  <div class="lz-layer"><span class="lz-lname">available</span><span class="lz-lnote">giống local trên replica set; trên cụm sharding có thể trả tài liệu mồ côi — hiếm khi là thứ bạn muốn</span></div>
  <div class="lz-layer"><span class="lz-lname">majority</span><span class="lz-lnote">chỉ dữ liệu đã được đa số xác nhận — không bao giờ bị rollback, nhưng có thể cũ hơn một chút</span></div>
  <div class="lz-layer"><span class="lz-lname">snapshot</span><span class="lz-lnote">ảnh chụp đã commit đa số tại một thời điểm — trong transaction, hoặc ngoài transaction với atClusterTime</span></div>
  <div class="lz-layer"><span class="lz-lname">linearizable</span><span class="lz-lnote">xác nhận với đa số rằng primary này vẫn là primary rồi mới trả lời — mới nhất và an toàn, chậm nhất, chỉ trên primary</span></div>
</div>

<h3>Một tài liệu, bốn câu trả lời</h3>
<p>Lại bộ ba thành viên của Bài 6.3 (<code>bash rs3.sh up</code> nếu bạn đã tắt). Sản phẩm <code>SP001</code> giá 100; các secondary ngừng chép; giá đổi thành 200 bằng <code>w: 1</code>. Giờ đọc cùng tài liệu bằng bốn cách:</p>
${lenh(K, 0)}
${lenh(K, 1)}
<ul>
<li><strong>local → 200.</strong> Primary có 200 và cho xem — nhưng chỉ primary có. Nếu lúc này chuyển dự phòng, 200 sẽ bị rollback. Một lần đọc <code>local</code> có thể cho thấy một giá trị mà một phút sau như chưa từng tồn tại.</li>
<li><strong>majority → 100.</strong> Giá trị mới nhất mà đa số có là 100, nên majority trả 100, kể cả trên primary. Cũ hơn, nhưng sẽ không bị lấy lại.</li>
<li><strong>secondary → 100.</strong> Secondary đơn giản là chưa nhận được 200. Đọc từ secondary là đọc quá khứ.</li>
<li><strong>snapshot tại t1 → 100.</strong> <code>t1</code> là thời điểm cụm của lần ghi cuối trước khi đổi. Đọc snapshot "tại t1" trả về thế giới ở khoảnh khắc đó — hữu ích cho báo cáo phải nhất quán qua nhiều truy vấn.</li>
</ul>
${nguon('📘', 'Read Concern — MongoDB Docs', 'local, available, majority, linearizable, snapshot; mỗi mức bảo đảm gì, mặc định', 'https://www.mongodb.com/docs/manual/reference/read-concern/')}

<h3>linearizable: mới nhất, hoặc không trả lời</h3>
${lenh(K, 2)}
<p>Primary đang bị cắt khỏi đa số. Một lần đọc <code>local</code> sẵn lòng trả 200; một lần đọc <code>linearizable</code> trước hết phải chứng minh, bằng một lần ghi được đa số xác nhận, rằng máy này vẫn là primary — nó không làm được, nên chờ tới hết giới hạn thời gian. Đó chính là mục đích: một primary cũ bị cô lập không bao giờ được trả giá trị "mới nhất" mà primary mới đã ghi đè. Dùng linearizable cho số ít lần đọc mà hành động theo giá trị cũ là đắt (khoá chọn người dẫn đầu, lần kiểm cuối trước một khoản thanh toán lớn), luôn kèm <code>maxTimeMS</code>, và chỉ cho lần đọc một tài liệu theo trường duy nhất.</p>
${nguon('📘', 'Read Concern "linearizable" — MongoDB Docs', 'Chỉ trên primary; xác nhận đa số; dùng kèm maxTimeMS; đọc một tài liệu', 'https://www.mongodb.com/docs/manual/reference/read-concern-linearizable/')}

<h3>Read preference: thành viên nào trả lời</h3>
<p>Lúc này các secondary chậm bao xa?</p>
${lenh(K, 3)}
<p>Ở đây vài giây vì nhân bản đang bị dừng; trên một bộ khoẻ thường dưới một giây, nhưng có thể vài phút khi chạy tác vụ lô nặng hoặc khi secondary bị cấp máy yếu. Các chế độ read preference: <code>primary</code> (mặc định), <code>primaryPreferred</code>, <code>secondary</code>, <code>secondaryPreferred</code>, <code>nearest</code>. <code>maxStalenessSeconds</code> cho driver tránh các secondary chậm quá — nhưng phải từ 90 giây trở lên, nên nó chống được một secondary hỏng nặng, không chống được "cũ vài giây".</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "đọc từ secondary để mở rộng lượng đọc".</strong> Nghe như có thêm sức chứa miễn phí. Nhưng secondary nào cũng phải áp dụng mọi lần ghi, nên nó không rảnh; đọc trên secondary trả dữ liệu cũ; và nếu một thành viên hỏng, các máy còn lại phải gánh phần đọc của nó cộng phần của mình. Hãy đọc từ secondary có chủ đích — thống kê chịu được trễ vài phút, một secondary đặt ở vùng của người dùng — và giữ các lần đọc kiểu "tôi vừa đổi cái này" của người dùng ở primary. Muốn mở rộng lượng đọc, trước hết thêm index (Chương 4) và cache (Redis); muốn mở rộng lượng ghi thì sharding (Chương 7).</p>
</div>
${nguon('📘', 'Read Preference — MongoDB Docs', 'Các chế độ, tag set, maxStalenessSeconds (tối thiểu 90 s), hedged reads', 'https://www.mongodb.com/docs/manual/core/read-preference/')}

<h3>Nhất quán nhân quả: đọc thấy thứ mình vừa ghi, kể cả trên secondary</h3>
<p>Lỗi ở phần mở đầu: lưu, tải lại, thấy giá trị cũ. Một <em>session nhất quán nhân quả</em> sửa được nó. Mỗi thao tác trong session trả về thời điểm cụm mà nó xảy ra; lần đọc sau trong cùng session nói với máy chủ "đừng trả lời bằng thứ gì cũ hơn thời điểm đó". Cùng bộ đang bị cô lập, giá đổi thành 300 bên trong một session nhân quả:</p>
${lenh(K, 4)}
<p>Không có session, secondary trả lời ngay bằng 100 — giá trị cũ, không lỗi gì. Trong session, secondary biết nó chưa tới được lần ghi cuối của session, nên nó <em>chờ</em> thay vì nói sai; ở đây nó không bao giờ đuổi kịp (nhân bản đang dừng), nên lần đọc hết giờ. Giờ nhân bản chạy lại:</p>
${lenh(K, 5)}
${lenh(K, 6)}
<p>Session ghi 301 với majority và đọc lại ngay từ một secondary: 301. Đọc thấy lần ghi của mình, đọc đơn điệu, và ghi theo sau đọc — các bảo đảm MongoDB gọi chung là <em>nhất quán nhân quả</em> (causal consistency) — giữ được xuyên các thành viên, với điều kiện bạn dùng session và, để có đủ bảo đảm kể cả qua chuyển dự phòng, dùng <code>readConcern: "majority"</code> cùng <code>writeConcern: "majority"</code>. Trong mã ứng dụng:</p>
${ma('js', CAUSAL)}
${nguon('📘', 'Causal Consistency and Read and Write Concerns — MongoDB Docs', 'Bảo đảm nào giữ được với từng tổ hợp read/write concern, có và không có sự cố', 'https://www.mongodb.com/docs/manual/core/causal-consistency-read-write-concerns/')}
${lenh(K, 7)}

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — mỗi request một session không phải mỗi người dùng một session.</strong> Nhất quán nhân quả sống trong đối tượng session ở một client. Nếu lần "lưu" của người dùng đi tới một instance API và lần "tải lại" tới instance khác, đó là hai session và bảo đảm biến mất. Hoặc đọc dữ liệu hiển thị cho người dùng từ primary, hoặc chuyển thời điểm cụm đi theo (phản hồi có mang nó; request sau gọi <code>session.advanceClusterTime</code>/<code>advanceOperationTime</code> với nó). Phần lớn các nhóm đơn giản là giữ các lần đọc đó ở primary.</p>
</div>

<h3>Báo cáo nhất quán bằng đọc snapshot</h3>
<p>Một bảng điều khiển chạy nhiều truy vấn — tổng doanh thu, doanh thu theo thành phố, số đơn — trong lúc đơn vẫn đổ về. Chạy lần lượt với <code>local</code> thì các con số không cộng khớp, vì mỗi truy vấn thấy một khoảnh khắc khác. Chạy mỗi truy vấn với <code>readConcern: { level: 'snapshot', atClusterTime: t }</code> dùng cùng một <code>t</code>, chúng cùng mô tả một khoảnh khắc. Máy chủ giữ các phiên bản cũ trong <code>minSnapshotHistoryWindowInSeconds</code> (mặc định 300), nên cả báo cáo phải xong trong khoảng đó. Một transaction với read concern snapshot cho cùng độ nhất quán cho các lần đọc bên trong nó.</p>
${nguon('📘', 'Read Concern "snapshot" — MongoDB Docs', 'atClusterTime ngoài transaction, minSnapshotHistoryWindowInSeconds', 'https://www.mongodb.com/docs/manual/reference/read-concern-snapshot/')}

<h3>Chọn thế nào: một bảng nhỏ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">người dùng thấy thay đổi của mình</span><span class="lz-t">primary + concern mặc định</span><span class="lz-d">hoặc session nhân quả với majority/majority nếu buộc phải đọc ở secondary</span></div>
  <div class="lz-step"><span class="lz-k">tiền, tồn kho, quyết định</span><span class="lz-t">primary + readConcern majority (hoặc trong transaction)</span><span class="lz-d">không bao giờ hành động theo dữ liệu có thể bị rollback</span></div>
  <div class="lz-step"><span class="lz-k">báo cáo, xuất dữ liệu</span><span class="lz-t">snapshot tại một atClusterTime; secondaryPreferred cũng được</span><span class="lz-d">số liệu nhất quán; chịu trễ vài giây</span></div>
  <div class="lz-step"><span class="lz-k">khoá chọn người dẫn đầu, lần kiểm cuối</span><span class="lz-t">linearizable + maxTimeMS</span><span class="lz-d">chậm, chỉ trên primary, hiếm dùng</span></div>
</div>

<h3>💼 Đi làm: "tôi lưu rồi mà trang vẫn hiện dữ liệu cũ"</h3>
<p>Một lỗi chỉ xuất hiện trên production: sau khi sửa hồ sơ, đôi khi người dùng thấy bản cũ trong một hai giây. Ở máy dev không bao giờ bị — ở máy dev chỉ có một thành viên. Trong repo bạn thấy <code>readPreference=secondaryPreferred</code> trong chuỗi kết nối, ai đó thêm vào "cho đỡ tải primary". Cách sửa bạn đề xuất: bỏ nó ở dịch vụ phục vụ người dùng (giữ lại, ghi rõ, cho tác vụ báo cáo); nếu nhóm nhất quyết đọc secondary, dùng session nhân quả với read/write concern majority và giải thích giới hạn khi đi qua nhiều instance ở trên. Để chứng minh chẩn đoán, hãy tái hiện: lệnh <code>ngung-chep</code> của lab làm một secondary chậm theo ý bạn.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-5-4-isolation', title: 'Hệ phân tán 5.4 — Mức cô lập và mô hình nhất quán', sub: 'Linearizable, nhân quả, đọc thấy lần ghi của mình — bộ từ vựng phía sau các thiết lập này' })}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Read concern khác read preference thế nào?"</strong> — Phiên bản nào của dữ liệu (local, majority, snapshot, linearizable) so với thành viên nào phục vụ (primary, secondary, nearest…).</li>
<li><strong>"Một lần đọc có thể trả dữ liệu sau đó biến mất không?"</strong> — Có, với local: nó thấy được lần ghi chưa tới đa số, thứ mà chuyển dự phòng sẽ rollback. Majority ngăn điều đó.</li>
<li><strong>"Bảo đảm đọc thấy lần ghi của mình khi đọc từ secondary thế nào?"</strong> — Session nhất quán nhân quả, tốt nhất kèm read và write concern majority; hoặc đọc từ primary.</li>
<li><strong>"Khi nào dùng linearizable?"</strong> — Số ít lần đọc một tài liệu mà giá trị cũ từ một primary cũ bị cô lập là không chấp nhận được; luôn kèm maxTimeMS.</li>
<li><strong>"Sao không đọc từ secondary để mở rộng?"</strong> — Đọc dữ liệu cũ, secondary vốn đã làm mọi lần ghi, và một máy hỏng làm quá tải các máy còn lại; dùng index, cache, sharding.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Với mỗi trường hợp, chọn read concern + read preference: (a) số dư hiện trước khi rút tiền; (b) bản xuất doanh số hằng đêm; (c) trang "đơn của tôi" ngay sau khi thanh toán; (d) một tác vụ chỉ được chạy trên đúng một máy (chọn người dẫn đầu bằng một tài liệu khoá).</li>
<li>Trên bộ đang bị cô lập, một client đọc với <code>readConcern: 'majority'</code> từ <em>primary</em> và nhận 100 dù primary có 200. Có phải lỗi không? Chuyện gì xảy ra với một ứng dụng đã hiện 200 rồi sau đó chuyển dự phòng?</li>
<li>Trên <code>mgo-lab</code>, lấy <code>t = db.adminCommand({ ping: 1 }).operationTime</code>, rồi chuyển 500 đ từ A sang B trong <code>ch6.tk</code>, rồi đọc <code>tk</code> với <code>readConcern: { level: 'snapshot', atClusterTime: t }</code>. Bạn thấy số dư nào, và một lần đọc thường cho thấy gì?</li>
</ol>
<details><summary>Gợi ý đáp án</summary>
<p>1. (a) primary + majority (hoặc bên trong transaction của lần rút). (b) snapshot tại một thời điểm cụm, <code>secondaryPreferred</code> để đỡ tải primary. (c) primary với mặc định, hoặc session nhân quả nếu đọc từ secondary. (d) đọc linearizable tài liệu khoá trên primary, kèm <code>maxTimeMS</code> — cộng một lần ghi majority để lấy khoá.</p>
<p>2. Không phải lỗi — đó chính là nghĩa của majority: 200 chỉ có trên một thành viên và có thể bị rollback. Một ứng dụng đã hiện 200 và hành động theo nó ("đã xác nhận giá: 200") là đã hành động theo một giá trị mà sau chuyển dự phòng chưa từng tồn tại.</p>
<p>3. Đã chạy thật: lần đọc snapshot cho thấy số dư <em>trước</em> khi chuyển (lần chạy đó là A 1.000.000 / B 1.000.000); lần đọc thường cho thấy A 999.500 / B 1.000.500. Nhiều lần đọc snapshot cùng một <code>t</code> đều khớp nhau.</p>
</details>
<p><strong>Xong khi:</strong> đưa cho bạn một màn hình hay một tác vụ, bạn gọi tên được read concern và read preference của nó và nói được trường hợp tệ nhất nó có thể hiện ra gì.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Read concern', 'Phiên bản dữ liệu mà lần đọc được trả: local, available, majority, snapshot, linearizable.'],
  ['Read preference', 'Thành viên phục vụ lần đọc: primary, primaryPreferred, secondary, secondaryPreferred, nearest.'],
  ['Độ trễ nhân bản', 'Secondary chậm hơn primary bao xa (rs.printSecondaryReplicationInfo()).'],
  ['maxStalenessSeconds', 'Driver tránh secondary chậm hơn mức này; tối thiểu 90 giây.'],
  ['Thời điểm cụm / operationTime', 'Thời gian logic của một thao tác trong replica set; dùng cho đọc snapshot và session nhân quả.'],
  ['Nhất quán nhân quả', 'Trong một session: đọc thấy lần ghi của mình, đọc đơn điệu, ghi theo sau đọc — xuyên các thành viên.'],
  ['atClusterTime', 'Đọc snapshot tại một thời điểm cụm cho trước; nhất quán qua nhiều truy vấn.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Read concern = phiên bản nào; read preference = thành viên nào. Hai lựa chọn độc lập.</li>
<li>local có thể cho thấy lần ghi mà chuyển dự phòng sẽ rollback; majority chỉ cho thấy thứ sẽ ở lại.</li>
<li>Secondary phục vụ quá khứ; maxStalenessSeconds chỉ chặn được độ trễ từ 90 giây trở lên.</li>
<li>linearizable từ chối trả lời từ một primary bị cô lập — dùng hiếm, kèm maxTimeMS.</li>
<li>Session nhân quả bắt secondary chờ tới khi có lần ghi cuối của bạn thay vì trả dữ liệu cũ.</li>
<li>Báo cáo chạy nhiều truy vấn nên đọc một ảnh chụp tại một atClusterTime.</li>
</ul>
</div>
`,
};
