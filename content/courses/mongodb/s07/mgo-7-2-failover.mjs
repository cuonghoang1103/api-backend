/**
 * 7.2 — Chuyển dự phòng thật: giết primary, nhường chức, đứt mạng — ứng dụng thấy gì (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-2-failover'] — cụm rs1 ba container (../_demo/rs/compose.yaml), ứng dụng ../_demo/node/ghi-lien-tuc.mjs chạy TRONG mạng cụm
 * (service "app"), sự cố bằng ../_demo/rs/hon-loan.sh. MongoDB 8.0.38, Node 22, driver mongodb 7.9.1.
 * Số (đổi theo lần chạy ⇒ lời nêu khoảng): giết primary ⇒ cụm có primary mới sau ~10–11 s, ứng dụng ~10–21 s không ghi được; retryWrites=false ⇒ lộ
 * MongoNetworkError ECONNRESET; stepDown ⇒ vài chục ms; docker stop ⇒ vài chục ms nhưng Docker giết sau 10 s (mã 137) vì mongod quiesce 15 s;
 * rút primary khỏi mọi mạng ⇒ một lệnh treo ~32 s (mặc định), ~33 s với chỉ socketTimeoutMS=3000 (kẹt connectTimeoutMS 30 s), ~21 s khi thêm connectTimeoutMS=3000.
 * Phát hiện: driver Node 7.9.1 in cảnh báo timeoutMS "has no effect" (thử ở phiên soạn); ở một lượt chạy khác, có retryWrites vẫn lọt một lỗi mạng mà đơn ĐÃ ghi.
 * Kiểm trùng: rollback w:1 đã dạy ở 6.3 (chỉ nhắc); lý thuyết failover/split-brain ở distributed-systems 3.2 ⇒ liên kết.
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's07-2-failover';

const UNG_DUNG = `// _demo/node/ghi-lien-tuc.mjs (core) — one insert after another, measure what failover looks like from the application
const client = new MongoClient(URI, { retryWrites, writeConcern: { w } });
client.on('topologyDescriptionChanged', (ev) => {            // the driver watches every member; print when the primary changes
  const p = [...ev.newDescription.servers.values()].find((sv) => sv.type === 'RSPrimary')?.address ?? 'KHÔNG CÓ';
  if (p !== primary) { console.log(\`\${s()}s driver thấy primary: \${p}\`); primary = p; }
});
while (Date.now() - t0 < GIAY * 1000) {
  const id = \`\${NHAN}-\${++i}\`, b = Date.now();
  try { await don.insertOne({ _id: id, i, luc: new Date() }); ok.push(id); /* measure the gap since the last success */ }
  catch (e) { loi.push(id); /* print the first error of each outage */ }
  await new Promise((r) => setTimeout(r, NGHI));
}
// at the end: compare with the database — "reported ok but LOST", "reported error but actually WRITTEN"`;

const GIAI_EN = `<p>1. Kill: the primary is gone, sockets are closed (ECONNRESET), and nobody can write until the remaining members notice (10 s election timeout) and elect — then the driver must discover the new primary. Step-down: the primary itself hands over, the election takes a fraction of a second, and the driver is told immediately (the old primary answers "not primary"). That is why maintenance should always be "step down first, then stop".</p>
<p>2. Unknown outcome. The insert may have been applied before the connection broke. Retrying with a <em>new</em> <code>_id</code> can create a duplicate order; reporting "failed" may be a lie. Retry with the <em>same</em> unique key; E11000 means the first attempt succeeded.</p>
<p>3. A minimal set for an order API: <code>retryWrites=true</code> (default) and <code>w=majority</code> (default); <code>connectTimeoutMS</code> and <code>socketTimeoutMS</code> of a few seconds (above your slowest legitimate query, or give long reports their own client); <code>serverSelectionTimeoutMS</code> lower than the HTTP timeout of your gateway; idempotent create with a client-supplied key; and an application deadline that turns "still unknown after N seconds" into HTTP 503 with a "check your order status" message, never into "failed".</p>`;

const GIAI_VI = `<p>1. Giết: primary biến mất, socket bị đóng (ECONNRESET), và không ai ghi được tới khi các máy còn lại nhận ra (hạn bầu 10 s) và bầu — rồi driver còn phải tìm ra primary mới. Nhường chức: chính primary trao lại, việc bầu mất chưa tới một giây, và driver được báo ngay (primary cũ trả lời "not primary"). Vì thế bảo trì luôn phải "nhường chức trước, tắt sau".</p>
<p>2. Kết quả chưa biết. Lệnh chèn có thể đã được áp dụng trước khi kết nối đứt. Thử lại bằng <code>_id</code> <em>mới</em> có thể sinh đơn trùng; báo "thất bại" có thể là báo sai. Thử lại bằng <em>cùng</em> khoá duy nhất; E11000 nghĩa là lần đầu đã thành công.</p>
<p>3. Bộ tối thiểu cho một API đặt đơn: <code>retryWrites=true</code> (mặc định) và <code>w=majority</code> (mặc định); <code>connectTimeoutMS</code> và <code>socketTimeoutMS</code> vài giây (cao hơn truy vấn hợp lệ chậm nhất, hoặc cho báo cáo dài một client riêng); <code>serverSelectionTimeoutMS</code> thấp hơn timeout HTTP của cổng phía trước; tạo đơn idempotent bằng khoá do client gửi; và một hạn chót ở ứng dụng biến "sau N giây vẫn chưa biết" thành HTTP 503 kèm lời nhắn "kiểm tra trạng thái đơn", không bao giờ thành "thất bại".</p>`;

export default {
  title: '7.2 — Failover for real: kill the primary, rollback and majority|||7.2 — Chuyển dự phòng thật: giết primary, rollback và majority',
  slug: 'mgo-7-2-failover',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Một ứng dụng Node.js ghi đơn liên tục vào replica set ba container, và bảy cách mất primary: giết (SIGKILL) có và không có retryWrites, nhường chức có kế hoạch, docker stop (bị giết sau 10 giây vì mongod cần 15 giây quiesce), rút khỏi mạng im lặng với mặc định, với socketTimeoutMS, với thêm connectTimeoutMS. Đo khoảng không ghi được, lỗi nào lọt tới ứng dụng, đơn nào "báo lỗi mà đã ghi"; rollback đã học ở 6.3; bộ tham số driver nên đặt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Failover for real: kill the primary, rollback and majority</h2>
<p class="lead">"MongoDB fails over automatically in about ten seconds" is true and almost useless. What matters is what <em>your application</em> experiences in those seconds: an error, a request that hangs, a write that is reported as failed but exists. This lesson runs a Node.js application that inserts orders continuously and removes the primary in seven different ways — from a polite step-down to a cable silently pulled — and measures each one.</p>

<h3>An everyday picture: a phone call that drops</h3>
<p>When the other person hangs up, you hear the tone immediately and call back. When they walk into a lift, there is no tone — only silence, and you keep saying "hello?" until you give up. Software has the same two failures: a <strong>crash</strong> closes connections (the other side learns at once), a <strong>network loss</strong> just stops delivering packets (nobody learns anything until a timer expires). Most of this lesson is about the second one, because default timeouts are long.</p>

<h3>The application under test</h3>
<p><code>ghi-lien-tuc.mjs</code> runs as a Compose service inside the cluster's network (Lesson 7.1 explained why it cannot run on the host). It inserts one order after another, prints when the driver sees the primary change and when writes resume, and at the end compares what it reported with what is in the database. <code>hon-loan.sh</code> breaks the cluster on cue.</p>
${ma('js', UNG_DUNG)}
${lenh(K, 0)}

<h3>A. Kill the primary (SIGKILL), default driver settings</h3>
${lenh(K, 1)}
${lenh(K, 2)}
<p>Read the times. r1 was killed at 9 s. The cluster had a new primary eleven seconds later — r2, elected by <code>electionTimeout</code>. The application, however, wrote nothing for about <strong>21 seconds</strong>: after the election, the driver still had to discover the new primary, which it learns from its periodic checks of each member. No error reached the application, because <code>retryWrites</code> (on by default) retried the interrupted insert once on the new primary; one request simply took 21 seconds. r1 came back as a SECONDARY; once it has caught up, its higher priority (2) makes it take the primary role back (<code>priorityTakeover</code>) — a second, short change of primary, which you will see it has done before scenario C.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "failover takes 10 seconds, our HTTP timeout is 30, we're fine".</strong> The application's gap is election time <em>plus</em> discovery time, and it varies: across runs of this same lab it ranged from about 10 to about 21 seconds. Meanwhile every request is held open, connection pools fill, and a load balancer in front may start its own retries. Measure your own stack, with your own driver and settings — that is what this script is for.</p>
</div>

<h3>B. The same, with retryWrites turned off</h3>
${lenh(K, 4)}
<p>Now the interrupted insert surfaces as <code>MongoNetworkError: read ECONNRESET</code>. What does that error tell you about the order? <strong>Nothing</strong>: the connection broke, but the insert may or may not have been applied before it did. Here the check found it was not; in another run of this same lab, even <em>with</em> retryWrites on, one insert failed with a network error and the order was in the database. A network error during a write means <em>unknown</em> — Lab 7.6 turns that into code.</p>
${lenh(K, 5)}

<h3>C. Planned step-down</h3>
${lenh(K, 6)}
<p>A few tens of milliseconds. A step-down is cooperative: the primary picks the moment, waits for an electable secondary to be caught up, steps down, and tells clients "not primary" so the driver re-routes at once. Every planned operation — patching, resizing, upgrades (Lesson 10.6) — should begin with <code>rs.stepDown()</code>.</p>

<h3>D. docker stop (SIGTERM)</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>The application barely noticed: on SIGTERM a primary steps down first. But look at the stop line: Docker needed 10 seconds and the exit code is <strong>137</strong> — 128 + 9, killed by SIGKILL. Since 5.0 a shutting-down <code>mongod</code> enters a quiesce period of up to 15 seconds so ongoing operations can finish; Docker's default grace period is 10 seconds, after which it kills the process. The data survives (journal, Lesson 1.4), but every restart is a crash recovery. In Compose: <code>stop_grace_period: 30s</code>; with <code>docker stop</code>: <code>-t 30</code>; in Kubernetes: <code>terminationGracePeriodSeconds</code>.</p>
${nguon('📘', 'shutdown — MongoDB Docs', 'Since 5.0 mongod/mongos enter a quiesce period on shutdown; a primary first tries to step down; timeoutSecs defaults to 15 s', 'https://www.mongodb.com/docs/manual/reference/command/shutdown/')}

<h3>E. Silent network loss, default settings</h3>
<p>Now the primary is unplugged from every network: its process is fine, packets to and from it simply vanish — no reset, no error. Each member's view, three seconds and fifteen seconds after the cut:</p>
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
<p>Inside the cluster everything went by the book: after about ten seconds r1 noticed it could not see a majority and stepped down to SECONDARY on its own; r2 and r3 elected r3. The application is another story: one insert waited about <strong>32 seconds</strong>. It had been sent on a connection to r1 that will never answer, and the Node driver's default <code>socketTimeoutMS</code> is 0 — no limit. Only when the driver's monitoring marked r1 as unreachable did the operation fail internally and get retried on r3.</p>

<h3>F. Add socketTimeoutMS=3000</h3>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Surprise: a three-second socket timeout did not help — one insert still waited about 33 seconds. The first attempt did time out after 3 seconds; but the retry tried to <em>open a new connection</em> to r1, and the Node driver waits up to <code>connectTimeoutMS</code> — 30,000 ms by default — for a TCP handshake that a vanished host will never complete. Two timeouts, and the long one wins.</p>

<h3>G. Add connectTimeoutMS=3000 as well</h3>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<p>About 21 seconds: better, still long. What remains is the election (about ten seconds) plus the time the driver needs to learn about the new primary from its periodic checks. You cannot make that zero — you can make it bounded and handle it: an application deadline (say 10–15 s) after which the request answers <em>"we are confirming your order"</em> with HTTP 503, and the client polls the order status by its own order number.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>timeoutMS</code> in the connection string.</strong> The MongoDB documentation describes a single client-side <code>timeoutMS</code> option. When it was tried with the Node.js driver 7.9.1 used in this lab, the driver printed a warning that <code>timeoutMS</code> "has no effect and will be removed in a future release". Always check the documentation of <em>your</em> driver version, and test timeouts the way this lesson does: by pulling the cable, not by reading the option list.</p>
</div>
${nguon('📘', 'Connection String Options — MongoDB Docs', 'connectTimeoutMS, socketTimeoutMS (default: no timeout), serverSelectionTimeoutMS, retryWrites; drivers may use different defaults', 'https://www.mongodb.com/docs/manual/reference/connection-string-options/')}
${nguon('📘', 'Retryable Writes — MongoDB Docs', 'One retry after a network error or a "not primary" error; requires a replica set; on by default in current drivers', 'https://www.mongodb.com/docs/manual/core/retryable-writes/')}

<h3>What about rollback?</h3>
<p>None of these runs lost an acknowledged order, because every write used <code>w: "majority"</code> (the default) — and a majority-acknowledged write is never rolled back. With <code>w: 1</code>, an isolated primary keeps accepting writes for up to ten seconds that the new majority will never have, and rolls them back when it returns. Lesson 6.3 showed that with four documents; Lab 7.6 shows it with hundreds of orders and a real split-brain.</p>
${lienKet({ cta: 'Open lesson', khoa: 'distributed-systems', bai: 'dist-3-2-failover', title: 'Distributed Systems 3.2 — Failover and split-brain', sub: 'The general theory, and GitHub 2018: 43 seconds of network trouble, a day of degraded service' })}

<h3>The summary table</h3>
<table>
<thead><tr><th>How the primary disappears</th><th>Application sees (this lab)</th><th>What to set</th></tr></thead>
<tbody>
<tr><td>rs.stepDown()</td><td>tens of ms</td><td>always step down before maintenance</td></tr>
<tr><td>docker stop</td><td>tens of ms, but killed after 10 s (137)</td><td>grace period ≥ 20–30 s</td></tr>
<tr><td>crash (SIGKILL)</td><td>~10–21 s; maybe a network error with unknown outcome</td><td>retryWrites, idempotent writes</td></tr>
<tr><td>silent network loss</td><td>~32 s with defaults</td><td>socketTimeoutMS + connectTimeoutMS, app deadline</td></tr>
</tbody>
</table>

<h3>💼 At work: the failover rehearsal</h3>
<p>Before a system goes live, a good team runs a <em>failover rehearsal</em> in staging with real load: step down, kill, and cut the network of the primary, one at a time, while a load script runs — exactly the scenarios of this lesson. The deliverable is a short table: for each scenario, the longest request, the number of errors returned to clients, and the number of orders lost or duplicated (must be 0). On an OJT project you can volunteer to write that script; it is a small task with very visible value, and it finds wrong connection strings (Lesson 7.1), missing timeouts and non-idempotent endpoints before customers do.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"How long does a MongoDB failover take, from the application's point of view?"</strong> — Election (~10 s with defaults) plus driver discovery; this lab measured about 10–21 s for a crash, tens of ms for a step-down.</li>
<li><strong>"What do retryable writes do, and what don't they do?"</strong> — Retry a single write once after a network error or step-down, deduplicated by the server; they don't help if the retry also fails, and they don't make w:1 safe.</li>
<li><strong>"A write failed with a network error. Was it written?"</strong> — Unknown; retry idempotently with the same key.</li>
<li><strong>"Why can a request hang for 30+ seconds during failover?"</strong> — A silent network loss with unlimited socket timeout and a 30 s connect timeout; set both, and an application deadline.</li>
<li><strong>"How do you restart a primary for maintenance without errors?"</strong> — rs.stepDown() first; give the process a long enough stop grace period.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Explain from the outputs why a killed primary costs the application seconds while a stepped-down primary costs milliseconds.</li>
<li>With retryWrites off, an insert fails with <code>ECONNRESET</code>. What do you know about the order, and what must the code do?</li>
<li>Write the connection-string options and application rules you would put in an order API's checklist, and add <code>stop_grace_period</code> to the lab's compose file, then repeat scenario D and check the exit code.</li>
</ol>
${loiGiai('Suggested answers', GIAI_EN)}
<p><strong>Done when:</strong> you have measured at least three scenarios with your own runs, and can say for each one how long your application could not write and why.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Failover', 'Replacing a lost primary by electing a secondary; from the application\'s side: election plus driver discovery.'],
  ['Step-down', 'A primary voluntarily giving up its role (rs.stepDown, or on shutdown); the fastest, cleanest failover.'],
  ['Retryable writes', 'The driver retries a single write once after a network error or step-down; the server deduplicates it.'],
  ['Unknown outcome', 'A write interrupted by a network error may or may not have been applied.'],
  ['socketTimeoutMS', 'Limit for waiting on a send/receive on an open connection; default none.'],
  ['connectTimeoutMS', 'Limit for opening a connection; 30 s by default in the Node.js driver.'],
  ['Quiesce period', 'Up to 15 s (5.0+) during which a shutting-down mongod lets operations finish; container grace periods must be longer.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>The cluster recovers in about ten seconds; the application's gap is longer and depends on driver settings — measure it.</li>
<li>Step down before maintenance: milliseconds instead of seconds; give mongod a stop grace period over 15 s.</li>
<li>A network error during a write is "unknown": retry with the same unique key.</li>
<li>Silent network loss is the worst case: set socketTimeoutMS and connectTimeoutMS, plus an application deadline.</li>
<li>w: "majority" kept every acknowledged order through every scenario.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Chuyển dự phòng thật: giết primary, rollback và majority</h2>
<p class="lead">"MongoDB tự chuyển dự phòng trong khoảng mười giây" là đúng và gần như vô dụng. Điều quan trọng là <em>ứng dụng của bạn</em> trải qua những giây đó thế nào: một lỗi, một yêu cầu treo, một lần ghi bị báo hỏng mà thật ra đã có. Bài này chạy một ứng dụng Node.js chèn đơn liên tục và gỡ primary theo bảy cách khác nhau — từ nhường chức lịch sự tới rút dây mạng im lặng — và đo từng cách.</p>

<h3>Hình ảnh đời thường: cuộc gọi bị rớt</h3>
<p>Khi người bên kia cúp máy, bạn nghe tiếng tút ngay và gọi lại. Khi họ bước vào thang máy, không có tiếng tút nào — chỉ im lặng, và bạn cứ "alô?" mãi tới khi bỏ cuộc. Phần mềm cũng có hai kiểu hỏng đó: <strong>sập máy</strong> đóng các kết nối (phía bên kia biết ngay), <strong>mất mạng</strong> chỉ đơn giản là không chuyển gói tin nữa (không ai biết gì tới khi một bộ hẹn giờ hết hạn). Phần lớn bài này nói về kiểu thứ hai, vì timeout mặc định rất dài.</p>

<h3>Ứng dụng được thử</h3>
<p><code>ghi-lien-tuc.mjs</code> chạy như một service của Compose ngay trong mạng của cụm (Bài 7.1 đã giải thích vì sao nó không chạy được trên máy chủ). Nó chèn hết đơn này tới đơn khác, in ra lúc driver thấy primary đổi và lúc ghi được trở lại, và cuối cùng so điều nó đã báo với thứ đang có trong database. <code>hon-loan.sh</code> làm hỏng cụm theo hiệu lệnh.</p>
${ma('js', UNG_DUNG)}
${lenh(K, 0)}

<h3>A. Giết primary (SIGKILL), cấu hình driver mặc định</h3>
${lenh(K, 1)}
${lenh(K, 2)}
<p>Đọc các mốc giờ. r1 bị giết ở giây thứ 9. Cụm có primary mới sau mười một giây — r2, được bầu vì <code>electionTimeout</code>. Thế nhưng ứng dụng không ghi được gì trong khoảng <strong>21 giây</strong>: sau khi bầu xong, driver còn phải tìm ra primary mới, điều nó biết qua các lần kiểm định kỳ từng thành viên. Không lỗi nào tới được ứng dụng, vì <code>retryWrites</code> (bật mặc định) đã thử lại lệnh chèn bị ngắt một lần trên primary mới; chỉ là một yêu cầu mất 21 giây. r1 quay lại làm SECONDARY; khi đã bắt kịp, độ ưu tiên cao hơn (2) khiến nó giành lại chức primary (<code>priorityTakeover</code>) — một lần đổi primary thứ hai, ngắn, mà bạn sẽ thấy nó đã làm xong trước kịch bản C.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "chuyển dự phòng mất 10 giây, timeout HTTP của mình là 30, ổn".</strong> Khoảng trống của ứng dụng là thời gian bầu <em>cộng</em> thời gian tìm ra primary, và nó dao động: qua các lần chạy chính lab này, nó từ khoảng 10 tới khoảng 21 giây. Trong lúc đó mọi yêu cầu bị giữ mở, pool kết nối đầy dần, và bộ cân bằng tải phía trước có thể bắt đầu tự thử lại. Hãy đo hệ thống của chính bạn, với driver và cấu hình của bạn — script này sinh ra để làm việc đó.</p>
</div>

<h3>B. Cũng vậy, nhưng tắt retryWrites</h3>
${lenh(K, 4)}
<p>Giờ lệnh chèn bị ngắt lộ ra thành <code>MongoNetworkError: read ECONNRESET</code>. Lỗi đó cho bạn biết gì về đơn hàng? <strong>Không gì cả</strong>: kết nối đã đứt, nhưng lệnh chèn có thể đã hoặc chưa được áp dụng trước lúc đó. Ở đây đối chiếu cho thấy là chưa; ở một lần chạy khác của chính lab này, kể cả <em>khi bật</em> retryWrites, một lệnh chèn hỏng vì lỗi mạng mà đơn vẫn nằm trong database. Lỗi mạng giữa lúc ghi nghĩa là <em>chưa biết</em> — Lab 7.6 biến điều đó thành mã.</p>
${lenh(K, 5)}

<h3>C. Nhường chức có kế hoạch</h3>
${lenh(K, 6)}
<p>Vài chục mili giây. Nhường chức là hợp tác: primary tự chọn thời điểm, chờ một secondary đủ điều kiện bắt kịp, nhường chức, và báo client "not primary" để driver đổi đường ngay. Mọi việc có kế hoạch — vá, đổi cỡ máy, nâng cấp (Bài 10.6) — nên bắt đầu bằng <code>rs.stepDown()</code>.</p>

<h3>D. docker stop (SIGTERM)</h3>
${lenh(K, 7)}
${lenh(K, 8)}
<p>Ứng dụng gần như không thấy gì: nhận SIGTERM, primary nhường chức trước. Nhưng nhìn dòng tắt máy: Docker mất 10 giây và mã thoát là <strong>137</strong> — 128 + 9, bị giết bằng SIGKILL. Từ 5.0, <code>mongod</code> khi tắt vào một khoảng quiesce tới 15 giây cho các thao tác đang chạy xong; thời gian ân hạn mặc định của Docker là 10 giây, hết là nó giết tiến trình. Dữ liệu vẫn còn (journal, Bài 1.4), nhưng mỗi lần khởi động lại là một lần phục hồi sau sự cố. Trong Compose: <code>stop_grace_period: 30s</code>; với <code>docker stop</code>: <code>-t 30</code>; trong Kubernetes: <code>terminationGracePeriodSeconds</code>.</p>
${nguon('📘', 'shutdown — MongoDB Docs', 'Từ 5.0 mongod/mongos vào khoảng quiesce khi tắt; primary thử nhường chức trước; timeoutSecs mặc định 15 s', 'https://www.mongodb.com/docs/manual/reference/command/shutdown/')}

<h3>E. Mất mạng im lặng, cấu hình mặc định</h3>
<p>Giờ primary bị rút khỏi mọi mạng: tiến trình vẫn khoẻ, gói tin tới và đi từ nó cứ thế biến mất — không reset, không lỗi. Góc nhìn của từng thành viên, ba giây và mười lăm giây sau khi cắt:</p>
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
<p>Bên trong cụm mọi thứ đúng sách: sau chừng mười giây r1 nhận ra nó không thấy đa số và tự xuống SECONDARY; r2 và r3 bầu r3. Phía ứng dụng là chuyện khác: một lệnh chèn chờ khoảng <strong>32 giây</strong>. Nó đã được gửi trên một kết nối tới r1 sẽ không bao giờ trả lời, và <code>socketTimeoutMS</code> mặc định của driver Node là 0 — không giới hạn. Chỉ khi phần giám sát của driver đánh dấu r1 là không liên lạc được, thao tác mới hỏng bên trong và được thử lại trên r3.</p>

<h3>F. Thêm socketTimeoutMS=3000</h3>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Bất ngờ: timeout socket ba giây không giúp gì — một lệnh chèn vẫn chờ khoảng 33 giây. Lần thử đầu đúng là hết giờ sau 3 giây; nhưng lần thử lại cố <em>mở kết nối mới</em> tới r1, và driver Node chờ tới <code>connectTimeoutMS</code> — mặc định 30.000 ms — cho một cái bắt tay TCP mà máy đã biến mất sẽ không bao giờ hoàn tất. Hai timeout, và cái dài thắng.</p>

<h3>G. Thêm cả connectTimeoutMS=3000</h3>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
<p>Khoảng 21 giây: đỡ hơn, vẫn dài. Phần còn lại là thời gian bầu (chừng mười giây) cộng thời gian driver biết tới primary mới qua các lần kiểm định kỳ. Bạn không đưa được nó về không — bạn làm được cho nó có giới hạn và xử lý nó: một hạn chót ở ứng dụng (chẳng hạn 10–15 s) mà sau đó yêu cầu trả lời <em>"chúng tôi đang xác nhận đơn của bạn"</em> bằng HTTP 503, và client hỏi lại trạng thái đơn bằng chính mã đơn của nó.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>timeoutMS</code> trong chuỗi kết nối.</strong> Tài liệu MongoDB mô tả một tuỳ chọn <code>timeoutMS</code> chung phía client. Khi thử với driver Node.js 7.9.1 dùng trong lab này, driver in cảnh báo <code>timeoutMS</code> "has no effect and will be removed in a future release" (không có tác dụng và sẽ bị gỡ). Hãy luôn kiểm tài liệu của đúng phiên bản driver <em>của bạn</em>, và thử timeout theo cách bài này làm: rút dây mạng, chứ không phải đọc danh sách tuỳ chọn.</p>
</div>
${nguon('📘', 'Connection String Options — MongoDB Docs', 'connectTimeoutMS, socketTimeoutMS (mặc định: không giới hạn), serverSelectionTimeoutMS, retryWrites; driver có thể dùng mặc định khác', 'https://www.mongodb.com/docs/manual/reference/connection-string-options/')}
${nguon('📘', 'Retryable Writes — MongoDB Docs', 'Thử lại một lần sau lỗi mạng hoặc lỗi "not primary"; cần replica set; bật mặc định ở các driver hiện nay', 'https://www.mongodb.com/docs/manual/core/retryable-writes/')}

<h3>Còn rollback thì sao?</h3>
<p>Không lần chạy nào ở đây mất một đơn đã xác nhận, vì mọi lần ghi dùng <code>w: "majority"</code> (mặc định) — và lần ghi được đa số xác nhận thì không bao giờ bị rollback. Với <code>w: 1</code>, primary bị cô lập vẫn nhận ghi trong tối đa mười giây mà đa số mới sẽ không bao giờ có, rồi rollback chúng khi quay lại. Bài 6.3 đã cho thấy điều đó với bốn tài liệu; Lab 7.6 cho thấy với hàng trăm đơn hàng và một lần split-brain thật.</p>
${lienKet({ cta: 'Mở bài', khoa: 'distributed-systems', bai: 'dist-3-2-failover', title: 'Hệ thống phân tán 3.2 — Chuyển đổi dự phòng và split-brain', sub: 'Lý thuyết chung, và GitHub 2018: 43 giây trục trặc mạng, một ngày dịch vụ suy giảm' })}

<h3>Bảng tổng kết</h3>
<table>
<thead><tr><th>Primary biến mất thế nào</th><th>Ứng dụng thấy (lab này)</th><th>Cần đặt gì</th></tr></thead>
<tbody>
<tr><td>rs.stepDown()</td><td>vài chục ms</td><td>luôn nhường chức trước khi bảo trì</td></tr>
<tr><td>docker stop</td><td>vài chục ms, nhưng bị giết sau 10 s (137)</td><td>thời gian ân hạn ≥ 20–30 s</td></tr>
<tr><td>sập (SIGKILL)</td><td>~10–21 s; có thể một lỗi mạng với kết quả chưa biết</td><td>retryWrites, ghi idempotent</td></tr>
<tr><td>mất mạng im lặng</td><td>~32 s với mặc định</td><td>socketTimeoutMS + connectTimeoutMS, hạn chót ở ứng dụng</td></tr>
</tbody>
</table>

<h3>💼 Đi làm: buổi diễn tập chuyển dự phòng</h3>
<p>Trước khi hệ thống lên chạy thật, một đội tốt sẽ diễn tập chuyển dự phòng ở staging với tải thật: lần lượt nhường chức, giết, và cắt mạng primary, trong lúc một kịch bản tải đang chạy — đúng các kịch bản của bài này. Sản phẩm là một bảng ngắn: với mỗi kịch bản, yêu cầu lâu nhất, số lỗi trả cho client, và số đơn mất hoặc trùng (phải là 0). Ở dự án OJT bạn có thể xung phong viết script đó; việc nhỏ mà giá trị nhìn thấy rõ, và nó tìm ra chuỗi kết nối sai (Bài 7.1), thiếu timeout và endpoint không idempotent trước khi khách hàng tìm ra.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Nhìn từ ứng dụng, chuyển dự phòng MongoDB mất bao lâu?"</strong> — Thời gian bầu (~10 s với mặc định) cộng thời gian driver tìm ra primary; lab này đo khoảng 10–21 s khi sập máy, vài chục ms khi nhường chức.</li>
<li><strong>"Retryable writes làm gì, và không làm gì?"</strong> — Thử lại một lần một lệnh ghi sau lỗi mạng hay nhường chức, máy chủ khử trùng; không giúp nếu lần thử lại cũng hỏng, và không làm w:1 an toàn.</li>
<li><strong>"Lệnh ghi hỏng vì lỗi mạng. Đã ghi chưa?"</strong> — Chưa biết; thử lại idempotent với cùng khoá.</li>
<li><strong>"Vì sao một yêu cầu có thể treo 30+ giây khi chuyển dự phòng?"</strong> — Mất mạng im lặng với socket timeout không giới hạn và connect timeout 30 s; đặt cả hai, và một hạn chót ở ứng dụng.</li>
<li><strong>"Khởi động lại primary để bảo trì mà không lỗi thế nào?"</strong> — rs.stepDown() trước; cho tiến trình thời gian ân hạn khi tắt đủ dài.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Giải thích từ output vì sao primary bị giết làm ứng dụng mất nhiều giây còn primary nhường chức chỉ mất vài mili giây.</li>
<li>Tắt retryWrites, một lệnh chèn hỏng với <code>ECONNRESET</code>. Bạn biết gì về đơn hàng, và mã phải làm gì?</li>
<li>Viết các tuỳ chọn chuỗi kết nối và quy tắc ứng dụng bạn sẽ đưa vào danh sách kiểm của một API đặt đơn; thêm <code>stop_grace_period</code> vào tệp compose của lab, chạy lại kịch bản D và kiểm mã thoát.</li>
</ol>
${loiGiai('Gợi ý đáp án', GIAI_VI)}
<p><strong>Xong khi:</strong> bạn đã tự đo ít nhất ba kịch bản, và nói được với từng kịch bản ứng dụng của bạn không ghi được bao lâu và vì sao.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Chuyển dự phòng (failover)', 'Thay primary đã mất bằng cách bầu một secondary; từ phía ứng dụng: thời gian bầu cộng thời gian driver tìm ra.'],
  ['Nhường chức (step-down)', 'Primary tự rời vai (rs.stepDown, hoặc khi tắt máy); kiểu chuyển dự phòng nhanh và sạch nhất.'],
  ['Retryable writes', 'Driver thử lại một lệnh ghi một lần sau lỗi mạng hay nhường chức; máy chủ khử trùng.'],
  ['Kết quả chưa biết', 'Lệnh ghi bị lỗi mạng cắt ngang có thể đã hoặc chưa được áp dụng.'],
  ['socketTimeoutMS', 'Giới hạn chờ gửi/nhận trên một kết nối đang mở; mặc định không có.'],
  ['connectTimeoutMS', 'Giới hạn chờ mở kết nối; mặc định 30 s ở driver Node.js.'],
  ['Khoảng quiesce', 'Tới 15 s (5.0+) mongod dành cho các thao tác chạy xong khi tắt; thời gian ân hạn của container phải dài hơn.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Cụm hồi lại trong khoảng mười giây; khoảng trống của ứng dụng dài hơn và tuỳ cấu hình driver — hãy đo.</li>
<li>Nhường chức trước khi bảo trì: mili giây thay vì giây; cho mongod thời gian ân hạn khi tắt trên 15 s.</li>
<li>Lỗi mạng giữa lúc ghi là "chưa biết": thử lại với cùng khoá duy nhất.</li>
<li>Mất mạng im lặng là trường hợp tệ nhất: đặt socketTimeoutMS và connectTimeoutMS, cộng hạn chót ở ứng dụng.</li>
<li>w: "majority" giữ được mọi đơn đã xác nhận qua mọi kịch bản.</li>
</ul>
</div>
`,
};
