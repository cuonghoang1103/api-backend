/**
 * Authentication · Chương 3 · 3.5 — Ba chỗ để giữ một phiên. Slug giữ: auth-3-5-phien-song-o-dau.
 * Output thật (_ma.mjs, demo3/where.mjs, PostgreSQL 17.11 + Redis 7.4.9 trong Docker Desktop, redis 6.3.0): 5.000 lần tra mỗi kiểu —
 * PostgreSQL median 470,8 µs, Redis 363,2 µs, cookie có ký 5,0 µs; cookie 68 / 68 / 129 byte; TTL Redis 1796 s; sau "đăng xuất mọi nơi":
 * PG null, Redis null, cookie có ký vẫn hợp lệ.
 */
import G from '../giang/auth-03-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const W = CODE.where.split('\n');
const WHERE = W.slice(W.findIndex((l) => l.startsWith('// 1. PostgreSQL')), W.findIndex((l) => l.startsWith('const res = ['))).join('\n').trim();

const NGUON_EN = [
  nguon('🟥', 'Redis docs — EXPIRE', 'A key with a timeout is deleted automatically; SET with EX sets value and timeout in one command (read 01/11/2026).', 'https://redis.io/docs/latest/commands/expire/'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Server-side session state, invalidation on logout and timeout, renewal at privilege changes (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🟥', 'Tài liệu Redis — EXPIRE', 'Khoá có hạn sống tự bị xoá; SET kèm EX đặt giá trị và hạn sống trong một lệnh (đọc 01/11/2026).', 'https://redis.io/docs/latest/commands/expire/'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet', 'Trạng thái phiên phía máy chủ, vô hiệu khi đăng xuất và hết hạn, làm mới ở mỗi lần đổi đặc quyền (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th></th><th>PostgreSQL row</th><th>Redis key</th><th>Signed cookie</th><th>In-process Map</th></tr></thead>
<tbody>
<tr><td>Lookup (measured here)</td><td>~470 µs</td><td>~360 µs</td><td>~5 µs</td><td>— (not shared)</td></tr>
<tr><td>Revoke one / all, now</td><td>yes / yes (index)</td><td>yes / needs a per-user set</td><td><strong>no</strong> — a denylist means a lookup again</td><td>only in that process</td></tr>
<tr><td>Idle timeout</td><td><code>last_seen_at</code> + check</td><td>TTL, built in</td><td>only the signed <code>exp</code></td><td>by hand</td></tr>
<tr><td>Survives a restart / two instances</td><td>yes / yes</td><td>with persistence / yes</td><td>yes / yes (needs the shared key)</td><td><strong>no / no</strong></td></tr>
<tr><td>Devices page, audit queries</td><td>one SELECT</td><td>harder</td><td>impossible</td><td>no</td></tr>
<tr><td>Good for</td><td>the browser session (LabFlow ID now)</td><td>high traffic, sessions shared by services</td><td>short-lived tokens (Chapters 4–5)</td><td>tests, demos</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th></th><th>Dòng PostgreSQL</th><th>Khoá Redis</th><th>Cookie có ký</th><th>Map trong tiến trình</th></tr></thead>
<tbody>
<tr><td>Tra (đo ở đây)</td><td>~470 µs</td><td>~360 µs</td><td>~5 µs</td><td>— (không dùng chung)</td></tr>
<tr><td>Thu hồi một / tất cả, ngay</td><td>có / có (chỉ mục)</td><td>có / cần một tập theo người dùng</td><td><strong>không</strong> — danh sách chặn nghĩa là lại phải tra</td><td>chỉ trong tiến trình đó</td></tr>
<tr><td>Hết hạn nhàn rỗi</td><td><code>last_seen_at</code> + kiểm</td><td>TTL, có sẵn</td><td>chỉ có <code>exp</code> đã ký</td><td>tự làm</td></tr>
<tr><td>Sống qua khởi động lại / hai bản chạy</td><td>có / có</td><td>khi bật lưu trữ / có</td><td>có / có (cần khoá dùng chung)</td><td><strong>không / không</strong></td></tr>
<tr><td>Trang thiết bị, truy vấn kiểm toán</td><td>một câu SELECT</td><td>khó hơn</td><td>không thể</td><td>không</td></tr>
<tr><td>Hợp với</td><td>phiên trình duyệt (LabFlow ID lúc này)</td><td>lưu lượng cao, phiên dùng chung giữa các dịch vụ</td><td>token sống ngắn (Chương 4–5)</td><td>test, demo</td></tr>
</tbody>
</table>`;

export default {
  title: '3.5 — Three places to keep a session|||3.5 — Ba chỗ để giữ một phiên',
  slug: 'auth-3-5-phien-song-o-dau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'PostgreSQL, Redis, hay chính cái cookie — đo thật cùng một bộ câu hỏi: 5.000 lần tra mỗi kiểu (PG ~470 µs, Redis ~360 µs qua Docker Desktop, cookie có ký ~5 µs), cookie 68 đối lại 129 byte, và "đăng xuất An khỏi mọi nơi" (PG null, Redis null, cookie có ký VẪN hợp lệ). TTL của Redis lo hết hạn nhàn rỗi, nhưng "mọi thiết bị" cần thêm một tập theo người dùng; vì sao Map trong bộ nhớ hỏng khi có hai bản chạy; bảng quyết định và lựa chọn của LabFlow ID.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Three places to keep a session</h2>
<p class="lead">Lessons 3.1–3.4 kept LabFlow ID's sessions in PostgreSQL. That is one of three reasonable designs: a row in your database, a key in Redis, or no server state at all — the session data signed inside the cookie (lesson 1.4's <code>signValue</code>). Blog posts argue about this with adjectives. This lesson measures the three on the same questions — how long a lookup takes, how big the cookie is, and whether you can sign An out <em>now</em> — and ends with a choice you can defend.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>name the one trade-off behind every session store: revocation versus a lookup per request;</li>
<li>implement the same session store interface on PostgreSQL, Redis and memory;</li>
<li>use Redis TTLs for idle timeouts and say what “sign out everywhere” costs there;</li>
<li>explain why an in-process Map fails with two instances or one restart;</li>
<li>defend LabFlow ID's choice with a table of measured properties.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> “where do you store sessions?” is a classic system-design question, and the wrong answer (a Map in memory) passes every local test and fails the first day you run two instances.</p>
</div>

<h3>An everyday picture first</h3>
<p>A cloakroom keeps your coat and gives you a meaningless ticket; it can void the ticket at any time (PostgreSQL). An express counter does the same but faster, and gives coats away by itself after 30 minutes nobody asked (Redis with a TTL). Or you carry your own coat in an envelope sealed by the cloakroom: no counter needed — but once you have it, the cloakroom cannot take it back before the date on the seal (a signed cookie). Everything else is detail; the real choice is <strong>revocation versus a lookup per request</strong>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Browser</span><span class="lz-lnote">carries a random id (PostgreSQL, Redis) — or the whole signed session (signed cookie).</span></div>
  <div class="lz-layer"><span class="lz-lname">Server process</span><span class="lz-lnote">hashes the id and looks it up — or verifies a signature without asking anyone.</span></div>
  <div class="lz-layer"><span class="lz-lname">Store</span><span class="lz-lnote">PostgreSQL row · Redis key with TTL · nothing (the cookie is the store).</span></div>
</div>

<h3>One interface, three stores</h3>
<p>The session layer of lessons 3.1–3.4 only calls <code>insert</code>, <code>get</code>, <code>update</code>, <code>delete</code> and <code>deleteByUser</code>, so the store can be swapped. The Redis version:</p>
${ma('javascript', CODE.redisStore)}
<p>Two things to notice. The idle timeout is free: every touch re-sets <code>EX 1800</code>, and Redis deletes the key by itself. “Sign out everywhere” is not free: Redis cannot search inside values, so each user needs a second structure — a set of their session digests — that must be kept in sync on every insert and delete.</p>

<h3>Measured: lookups, cookie size, revocation</h3>
<p><code>demo3/where.mjs</code> creates one session for An in each design, times 5,000 lookups, prints the cookie each design would send, then signs An out everywhere and asks again:</p>
${ma('javascript', WHERE)}
${ra(OUT['35-where'])}
<ul>
<li><strong>Lookups:</strong> PostgreSQL 470.8 µs, Redis 363.2 µs, the signed cookie 5.0 µs. Both servers run in Docker Desktop, whose port forwarding on macOS adds a network hop that dominates these numbers — on a Linux server both are lower. Next to a whole authenticated request (~1.7 ms in lesson 3.1), none of them decides anything.</li>
<li><strong>Cookie size:</strong> 68 bytes for a random id, 129 for the signed session — sent on every request, and it grows with every field you add (browsers cap one cookie at about 4 KB).</li>
<li><strong>Revocation:</strong> after “sign out everywhere”, PostgreSQL and Redis answer <code>null</code>. The signed cookie still verifies: <code>{"userId":"usr_1",…}</code> — valid until its own expiry. Making it revocable means checking a denylist on every request, which is a lookup again.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Trap — the in-memory Map.</strong> <code>new Map()</code> as a session store passes every local test. Then production runs two instances behind a load balancer: process A created the session, the next request lands on B ⇒ 401. A deploy or a crash restarts both ⇒ everyone is signed out. “Sticky sessions” at the load balancer only hide this until an instance dies. LabFlow ID has a <code>memoryStore()</code> — for tests, the Lab 3 grader and one-process demos, never for the server.</p>
</div>

<h3>When to use which</h3>
${BANG_EN}
<p><strong>LabFlow ID's choice:</strong> PostgreSQL now — it is already running, a session can be revoked or listed with one SQL statement, and Chapter 5's “your devices” page is one SELECT. Redis when a measurement says session lookups are the bottleneck, or several services must share sessions (Chapter 11 brings Redis anyway, for rate limits). Signed tokens for short-lived access between services (Chapters 4–5) — never as the browser's main session.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Where do you keep sessions?”</strong> — In a shared store every instance can reach: the database by default, Redis when lookups or sharing require it; never in process memory. Signed stateless sessions only when you accept that they cannot be revoked before expiry.</li>
<li><strong>“How do you log a user out of all devices with Redis?”</strong> — Keep a set of session ids per user, updated on every insert/delete, and delete all members.</li>
<li><strong>“Is Redis faster than Postgres for sessions?”</strong> — Usually a little; measure. The difference rarely matters next to a request; operations and revocation matter more.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start Redis (<code>docker run -d --name labflow-id-redis -p 127.0.0.1:4833:6379 redis:7</code>) and run <code>node demo3/where.mjs</code> with <code>REDIS_URL</code> and a made-up <code>SESSION_SIGNING_KEY</code>. Compare your numbers with ours.</li>
<li>Plug <code>redisStore()</code> into <code>sessionLayer</code> (one line in <code>src/server.js</code>) and rerun <code>bash demo3/devices.sh</code>. Does sign-out-everywhere still end 3 sessions?</li>
<li>Make the signed cookie revocable: a denylist of revoked session ids checked in <code>verify</code>. How many lookups per request does it now cost?</li>
</ol>
<p><strong>Solution:</strong> your microseconds will differ (machine, Docker networking); the order — signed ≪ Redis ≈ PostgreSQL — and the revocation results should not. With Redis the layer is unchanged and <code>deleteByUser</code> uses the per-user set — we ran it: <code>"ended":3</code>. A denylist costs one lookup per request — the same as a server-side session, plus the signature check: you have rebuilt a session store with extra steps.</p>
<p><strong>Done when:</strong> you can run LabFlow ID on two different stores with no change to the session layer, and explain in one sentence why its browser session is not a signed cookie.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session store</span><span class="v">Where the server keeps session state: a database table, a key-value store, or nowhere (signed cookie).</span></div>
  <div class="kv"><span class="k">TTL (time to live)</span><span class="v">A Redis key's lifetime; the key is deleted automatically when it runs out.</span></div>
  <div class="kv"><span class="k">stateless session</span><span class="v">Session data signed into the cookie; no server lookup, no revocation before expiry.</span></div>
  <div class="kv"><span class="k">denylist</span><span class="v">A list of revoked ids that every request must check — what a revocable stateless session needs.</span></div>
  <div class="kv"><span class="k">sticky sessions</span><span class="v">A load balancer sending a user to the same instance — hides in-memory sessions until that instance dies.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The decision is revocation versus a lookup per request.</li>
<li>Measured: PostgreSQL ~470 µs, Redis ~360 µs (through Docker Desktop), signed cookie ~5 µs — all small next to a request.</li>
<li>After “sign out everywhere”: PostgreSQL null, Redis null, signed cookie still valid.</li>
<li>Redis gives the idle timeout for free (TTL) but needs a per-user set for “everywhere”.</li>
<li>Never an in-memory Map in production; LabFlow ID keeps sessions in PostgreSQL.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'Also in API Design — lesson 8.3: scaling out', sub: 'Same: two instances behind a load balancer break anything kept in one process’s memory; sticky sessions only hide it. That lesson moves idempotency state out; this one does it for login sessions and measures three stores.', cta: 'OPEN API DESIGN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Ba chỗ để giữ một phiên</h2>
<p class="lead">Bài 3.1–3.4 giữ phiên của LabFlow ID trong PostgreSQL. Đó là một trong ba thiết kế hợp lý: một dòng trong cơ sở dữ liệu, một khoá trong Redis, hoặc không giữ trạng thái nào trên máy chủ — dữ liệu phiên được ký ngay trong cookie (<code>signValue</code> của bài 1.4). Các bài blog tranh cãi chuyện này bằng tính từ. Bài này đo cả ba trên cùng những câu hỏi — tra mất bao lâu, cookie lớn cỡ nào, và có đăng xuất An được <em>ngay</em> không — rồi kết thúc bằng một lựa chọn bạn bảo vệ được.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>gọi tên sự đánh đổi đằng sau mọi kho phiên: thu hồi đối lại một lần tra mỗi request;</li>
<li>cài cùng một giao diện kho phiên trên PostgreSQL, Redis và bộ nhớ;</li>
<li>dùng TTL của Redis cho hết hạn nhàn rỗi và nói được "đăng xuất mọi nơi" tốn gì ở đó;</li>
<li>giải thích vì sao một Map trong tiến trình hỏng khi có hai bản chạy hay một lần khởi động lại;</li>
<li>bảo vệ lựa chọn của LabFlow ID bằng một bảng tính chất đã đo.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> "lưu phiên ở đâu?" là câu thiết kế hệ thống kinh điển, và câu trả lời sai (một Map trong bộ nhớ) qua mọi bài test trên máy rồi hỏng ngay ngày đầu chạy hai bản.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Quầy gửi đồ giữ áo của bạn và đưa một tấm vé chẳng mang nghĩa gì; quầy huỷ vé lúc nào cũng được (PostgreSQL). Một quầy nhanh làm y vậy nhưng nhanh hơn, và tự đem áo đi sau 30 phút không ai hỏi (Redis với TTL). Hoặc bạn tự mang áo trong một phong bì có dấu niêm phong của quầy: chẳng cần quầy — nhưng một khi bạn đã cầm, quầy không thu lại được trước ngày ghi trên dấu (cookie có ký). Còn lại đều là chi tiết; lựa chọn thật là <strong>thu hồi đối lại một lần tra mỗi request</strong>.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Trình duyệt</span><span class="lz-lnote">mang một id ngẫu nhiên (PostgreSQL, Redis) — hoặc cả phiên đã ký (cookie có ký).</span></div>
  <div class="lz-layer"><span class="lz-lname">Tiến trình máy chủ</span><span class="lz-lnote">băm id rồi tra — hoặc kiểm chữ ký mà chẳng cần hỏi ai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kho</span><span class="lz-lnote">dòng PostgreSQL · khoá Redis có TTL · không gì cả (cookie chính là kho).</span></div>
</div>

<h3>Một giao diện, ba kho</h3>
<p>Lớp phiên của bài 3.1–3.4 chỉ gọi <code>insert</code>, <code>get</code>, <code>update</code>, <code>delete</code> và <code>deleteByUser</code>, nên kho đổi được. Bản Redis:</p>
${ma('javascript', CODE.redisStore)}
<p>Hai điều đáng để ý. Hết hạn nhàn rỗi là miễn phí: mỗi lần chạm đặt lại <code>EX 1800</code>, và Redis tự xoá khoá. "Đăng xuất mọi nơi" thì không miễn phí: Redis không tìm được bên trong giá trị, nên mỗi người dùng cần thêm một cấu trúc — một tập các digest phiên của họ — phải giữ khớp ở mọi lần thêm và xoá.</p>

<h3>Đo: tra, kích thước cookie, thu hồi</h3>
<p><code>demo3/where.mjs</code> tạo cho An một phiên ở mỗi thiết kế, bấm giờ 5.000 lần tra, in cookie mà mỗi thiết kế sẽ gửi, rồi đăng xuất An khỏi mọi nơi và hỏi lại:</p>
${ma('javascript', WHERE)}
${ra(OUT['35-where'])}
<ul>
<li><strong>Tra:</strong> PostgreSQL 470,8 µs, Redis 363,2 µs, cookie có ký 5,0 µs. Cả hai máy chủ chạy trong Docker Desktop, mà việc chuyển cổng trên macOS thêm một bước mạng chiếm phần lớn các con số này — trên máy chủ Linux cả hai đều thấp hơn. Đặt cạnh một request có xác thực trọn vẹn (~1,7 ms ở bài 3.1), chẳng con số nào quyết định gì.</li>
<li><strong>Kích thước cookie:</strong> 68 byte cho một id ngẫu nhiên, 129 cho phiên đã ký — gửi theo mọi request, và lớn dần theo mỗi trường bạn thêm (trình duyệt giới hạn một cookie khoảng 4 KB).</li>
<li><strong>Thu hồi:</strong> sau "đăng xuất mọi nơi", PostgreSQL và Redis trả <code>null</code>. Cookie có ký vẫn kiểm hợp lệ: <code>{"userId":"usr_1",…}</code> — còn hiệu lực tới hạn của chính nó. Muốn thu hồi được thì phải kiểm một danh sách chặn ở mọi request, nghĩa là lại phải tra.</li>
</ul>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — Map trong bộ nhớ.</strong> <code>new Map()</code> làm kho phiên qua mọi bài test trên máy. Rồi production chạy hai bản sau một bộ cân bằng tải: tiến trình A tạo phiên, request kế tiếp rơi vào B ⇒ 401. Một lần deploy hay một lần sập khởi động lại cả hai ⇒ mọi người bị đăng xuất. "Sticky session" ở bộ cân bằng tải chỉ giấu vấn đề cho tới khi một bản chết. LabFlow ID có <code>memoryStore()</code> — cho test, cho máy chấm Lab 3 và demo một tiến trình, không bao giờ cho máy chủ.</p>
</div>

<h3>Khi nào dùng cái gì</h3>
${BANG_VI}
<p><strong>Lựa chọn của LabFlow ID:</strong> PostgreSQL lúc này — nó vốn đang chạy, một phiên thu hồi hay liệt kê được bằng một câu SQL, và trang "thiết bị của bạn" ở Chương 5 là một câu SELECT. Redis khi số đo cho thấy việc tra phiên là nút thắt, hoặc nhiều dịch vụ phải dùng chung phiên (Chương 11 đằng nào cũng mang Redis vào, cho giới hạn tần suất). Token có ký cho truy cập ngắn hạn giữa các dịch vụ (Chương 4–5) — không bao giờ làm phiên chính của trình duyệt.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Lưu phiên ở đâu?"</strong> — Ở một kho dùng chung mà mọi bản chạy đều với tới: mặc định là cơ sở dữ liệu, Redis khi việc tra hay chia sẻ đòi hỏi; không bao giờ trong bộ nhớ tiến trình. Phiên không trạng thái có ký chỉ khi chấp nhận không thu hồi được trước hạn.</li>
<li><strong>"Đăng xuất một người khỏi mọi thiết bị với Redis thế nào?"</strong> — Giữ một tập session id theo người dùng, cập nhật ở mỗi lần thêm/xoá, rồi xoá mọi phần tử.</li>
<li><strong>"Redis có nhanh hơn Postgres cho phiên không?"</strong> — Thường nhanh hơn chút ít; hãy đo. Chênh lệch hiếm khi đáng kể so với một request; vận hành và thu hồi quan trọng hơn.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật Redis (<code>docker run -d --name labflow-id-redis -p 127.0.0.1:4833:6379 redis:7</code>) và chạy <code>node demo3/where.mjs</code> với <code>REDIS_URL</code> và một <code>SESSION_SIGNING_KEY</code> bịa. So số của bạn với của mình.</li>
<li>Cắm <code>redisStore()</code> vào <code>sessionLayer</code> (một dòng trong <code>src/server.js</code>) và chạy lại <code>bash demo3/devices.sh</code>. Đăng xuất mọi nơi có còn kết thúc 3 phiên?</li>
<li>Làm cookie có ký thu hồi được: một danh sách chặn các session id đã thu hồi, kiểm trong <code>verify</code>. Giờ mỗi request tốn bao nhiêu lần tra?</li>
</ol>
<p><strong>Lời giải:</strong> số micro giây của bạn sẽ khác (máy, mạng của Docker); thứ tự — có ký ≪ Redis ≈ PostgreSQL — và kết quả thu hồi thì không được khác. Với Redis, lớp phiên không đổi và <code>deleteByUser</code> dùng tập theo người dùng — mình đã chạy: <code>"ended":3</code>. Danh sách chặn tốn một lần tra mỗi request — bằng phiên phía máy chủ, cộng thêm việc kiểm chữ ký: bạn vừa dựng lại một kho phiên với nhiều bước hơn.</p>
<p><strong>Đạt khi:</strong> bạn chạy được LabFlow ID trên hai kho khác nhau mà không sửa lớp phiên, và giải thích được trong một câu vì sao phiên trình duyệt của nó không phải cookie có ký.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session store (kho phiên)</span><span class="v">Nơi máy chủ giữ trạng thái phiên: bảng cơ sở dữ liệu, kho key-value, hoặc không đâu cả (cookie có ký).</span></div>
  <div class="kv"><span class="k">TTL (thời gian sống)</span><span class="v">Tuổi thọ của một khoá Redis; hết thì khoá tự bị xoá.</span></div>
  <div class="kv"><span class="k">stateless session (phiên không trạng thái)</span><span class="v">Dữ liệu phiên được ký vào cookie; không tra máy chủ, không thu hồi được trước hạn.</span></div>
  <div class="kv"><span class="k">denylist (danh sách chặn)</span><span class="v">Danh sách id đã thu hồi mà mọi request phải kiểm — thứ một phiên không trạng thái muốn thu hồi được sẽ cần.</span></div>
  <div class="kv"><span class="k">sticky sessions</span><span class="v">Bộ cân bằng tải gửi một người dùng về cùng một bản chạy — giấu phiên trong bộ nhớ cho tới khi bản đó chết.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quyết định là thu hồi đối lại một lần tra mỗi request.</li>
<li>Đo: PostgreSQL ~470 µs, Redis ~360 µs (qua Docker Desktop), cookie có ký ~5 µs — đều nhỏ so với một request.</li>
<li>Sau "đăng xuất mọi nơi": PostgreSQL null, Redis null, cookie có ký vẫn hợp lệ.</li>
<li>Redis cho không hết hạn nhàn rỗi (TTL) nhưng cần tập theo người dùng cho "mọi nơi".</li>
<li>Không bao giờ dùng Map trong bộ nhớ trên production; LabFlow ID giữ phiên trong PostgreSQL.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-8-3-mo-rong', title: 'Cũng có ở API Design — bài 8.3: mở rộng ra nhiều bản chạy', sub: 'Giống: hai bản chạy sau bộ cân bằng tải làm hỏng mọi thứ giữ trong bộ nhớ của một tiến trình; sticky session chỉ giấu nó đi. Bài đó chuyển trạng thái idempotency ra ngoài; bài này làm vậy cho phiên đăng nhập và đo ba kho.', cta: 'MỞ BÀI API DESIGN →' })}
</div>
`,
};
