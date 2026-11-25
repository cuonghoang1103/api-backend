/**
 * 7.3 — Loại thành viên: hidden, delayed, bẫy arbiter, priority (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s07-3-thanh-vien'] — cụm rs1 ba container (../_demo/rs/compose.yaml), MongoDB 8.0.38. Cuối kịch bản xoá cụm.
 * Số tất định: r3 → priority 0, hidden, trễ 60 s ⇒ hello().hosts chỉ còn r1, r2; ghi 1000 khách, chờ 70 s, lỡ tay xoá 1000 ⇒ r2 còn 0, r3 còn 1000
 * ⇒ mongodump từ r3 + mongorestore ⇒ primary có lại 1000; tắt r2 khi r3 trễ còn phiếu ⇒ w:majority wtimeout 8000 ⇒ WriteConcernFailed sau ~8 s;
 * votes 0 cho r3; PSA: rs.addArb bị từ chối tới khi setDefaultRWConcern; tắt r2 ⇒ r1 vẫn PRIMARY (nhờ arbiter), w:1 ~25 ms, majority hết giờ 5 s,
 * điểm commit majority đứng yên.
 * Kiểm trùng: sao lưu/khôi phục đầy đủ dạy ở Chương 10 (10.1) ⇒ ở đây chỉ dùng thành viên trễ như lưới an toàn; GitLab 31/01/2017 đã kể ở khoá
 * incident-response ⇒ chỉ nhắc ngắn.
 */
import { lenh, nguon, kv, loiGiai } from '../_chung.mjs';

const K = 's07-3-thanh-vien';

const GIAI_EN = `<p>1. Five data-bearing members in three sites: site A (primary's usual home) 2 members, site B 2 members, site C 1 member — every single site can be lost and the other two still have 3 of 5 votes. Set <code>priority</code> higher in A so the primary normally stays near the application. If only two sites exist, put the fifth vote in a third location (a small cloud region) — otherwise losing the bigger site stops writes.</p>
<p>2. Add a <em>sixth</em> member with <code>priority: 0, hidden: true, secondaryDelaySecs: 3600, votes: 0</code>. Votes 0 keeps it out of the majority (it cannot slow down majority writes); hidden keeps applications from reading hour-old data; priority 0 means it can never become primary. Check that the oplog window is well over one hour, otherwise the delayed member falls off the oplog.</p>
<p>3. Replace the arbiter by a data-bearing secondary (PSS). If budget truly forbids it, keep PSA but know the consequences: with one data member down, majority writes cannot succeed and the majority commit point stops, which builds cache pressure on the primary; set an explicit default write concern; monitor the secondary closely and treat its loss as urgent.</p>`;

const GIAI_VI = `<p>1. Năm thành viên mang dữ liệu ở ba nơi: nơi A (chỗ primary thường ở) 2 máy, nơi B 2 máy, nơi C 1 máy — mất trọn một nơi bất kỳ thì hai nơi còn lại vẫn có 3 trên 5 phiếu. Đặt <code>priority</code> cao hơn ở A để primary bình thường ở gần ứng dụng. Nếu chỉ có hai nơi, đặt phiếu thứ năm ở nơi thứ ba (một vùng đám mây nhỏ) — nếu không, mất nơi lớn hơn là dừng ghi.</p>
<p>2. Thêm thành viên <em>thứ sáu</em> với <code>priority: 0, hidden: true, secondaryDelaySecs: 3600, votes: 0</code>. Votes 0 giữ nó ngoài đa số (nó không làm chậm lệnh ghi majority); hidden giữ ứng dụng khỏi đọc dữ liệu cũ một giờ; priority 0 nghĩa là nó không bao giờ thành primary. Kiểm cửa sổ oplog lớn hơn hẳn một giờ, nếu không thành viên trễ sẽ rơi khỏi oplog.</p>
<p>3. Thay arbiter bằng một secondary mang dữ liệu (PSS). Nếu ngân sách thật sự không cho, giữ PSA nhưng phải biết hậu quả: một máy dữ liệu sập là lệnh ghi majority không thể thành công và điểm commit majority dừng lại, dồn áp lực lên cache của primary; đặt rõ write concern mặc định; giám sát secondary thật sát và coi việc mất nó là khẩn cấp.</p>`;

export default {
  title: '7.3 — Member types: hidden, delayed, arbiter traps, priority|||7.3 — Loại thành viên: hidden, delayed, bẫy arbiter, priority',
  slug: 'mgo-7-3-thanh-vien',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Không phải thành viên nào cũng như nhau: priority, votes, hidden, secondaryDelaySecs, arbiter. Biến r3 thành bản sao trễ 60 giây rồi cứu một lần xoá nhầm 1.000 khách bằng mongodump từ nó; bẫy thành viên trễ còn phiếu làm ghi majority phải chờ; bẫy arbiter (PSA): MongoDB 8.0 từ chối thêm arbiter tới khi đặt write concern mặc định, và khi secondary duy nhất sập thì w:1 vẫn chạy còn majority hết giờ. Cách đặt máy ở nhiều nơi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Member types: hidden, delayed, arbiter traps, priority</h2>
<p class="lead">In Lessons 7.1–7.2 the three members were equal except for one priority. Real replica sets mix roles: a member that can never become primary, one that applications never see, one that is deliberately an hour behind, one that votes but stores nothing. Each option solves a real problem — and each has a trap that shows up only on the bad day. This lesson tries them on the three-container cluster, including the one that rescues an accidental delete.</p>

<h3>An everyday picture: a company's board</h3>
<p>A board has members who can become chair, members who vote but will never be chair (priority 0), an archivist who keeps last week's minutes in a locked drawer and attends no meeting (hidden, delayed), and an outside member who only votes and has no files at all (arbiter). A tie-breaker without files sounds cheap and harmless — until the only other member with files is ill, and the board can vote but nobody can produce the documents.</p>
<table>
<thead><tr><th>Option</th><th>What it does</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td><code>priority</code> (0–1000)</td><td>preference in elections; 0 = never primary</td><td>keep the primary in the main data centre; reporting nodes</td></tr>
<tr><td><code>votes</code> (0 or 1)</td><td>counts toward elections and majority writes</td><td>more than 7 members; delayed members (votes 0)</td></tr>
<tr><td><code>hidden</code></td><td>not in <code>hello().hosts</code>: drivers never send reads there; requires priority 0</td><td>backups, analytics, delayed copies</td></tr>
<tr><td><code>secondaryDelaySecs</code></td><td>applies the oplog N seconds late; requires priority 0, should be hidden and votes 0</td><td>safety net against human error</td></tr>
<tr><td>arbiter</td><td>votes, holds no data</td><td>almost never a good idea (see below)</td></tr>
<tr><td><code>tags</code></td><td>labels such as <code>{ dc: 'hn' }</code> for read preference and custom write concerns</td><td>read from the local site, write to two sites</td></tr>
</tbody>
</table>

<h3>A delayed, hidden member</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>r3 is now <code>priority 0</code> (can never be elected), <code>hidden</code> (it disappeared from <code>hello().hosts</code>, so no driver will ever route a read to it) and 60 seconds behind on purpose. A real setup would use an hour or more; the lab uses one minute so you can watch it.</p>

<h3>The accidental delete</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Somebody ran <code>deleteMany</code> with a condition that matches everything — the classic "I thought I was on staging". With <code>w: "majority"</code> it was replicated to r2 within milliseconds: a normal secondary is a copy of your mistakes too. But r3 applies the oplog one minute late:</p>
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
<p>Within the delay window, dump the collection from the delayed member and restore it to the primary — 1,000 customers back. The window is the catch: you have <code>secondaryDelaySecs</code> to notice, decide and dump, and the delayed member must also be stopped from applying the delete (in real life: <code>db.fsyncLock()</code> or shut it down) if the dump will take longer. A delayed member is a quick net, not a backup — point-in-time recovery from real backups is Lesson 10.1.</p>
${nguon('📘', 'Delayed Replica Set Members — MongoDB Docs', 'Must be priority 0, should be hidden and non-voting; delay must fit in the oplog window; votes: 0 to avoid majority-write delays', 'https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/')}

<h3>Trap: a delayed member that still votes</h3>
${lenh(K, 10)}
${lenh(K, 11)}
<p>With r2 down, the voting members are r1 and r3. A majority of three votes is two, so every <code>w: "majority"</code> write must now wait until <em>r3</em> has it — and r3 applies writes 60 seconds late. The insert timed out after its 8-second <code>wtimeout</code>; without a <code>wtimeout</code> it would have waited a full minute, or an hour with a realistic delay. That is why the documentation says delayed members should be non-voting:</p>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Note the cost of the fix on a three-member set: with r3 at votes 0 only two members vote, and losing either stops writes. In production a delayed member is an <em>extra</em> member — five voting data members plus one delayed, non-voting copy.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — "priority 0 so it can't be primary" is not "harmless".</strong> A priority-0 or hidden member with <code>votes: 1</code> still counts toward elections and majority writes. Every member you add with a vote changes the arithmetic of Lesson 7.1. Before adding a reporting or backup node, write down the number of voters and how many failures the set survives — before and after.</p>
</div>

<h3>Trap: the arbiter (PSA)</h3>
<p>An <strong>arbiter</strong> votes but stores no data. It is tempting: three votes for the price of two data servers. Build one — remove r3, add r4 as an arbiter:</p>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
<p>MongoDB 8.0 refused the arbiter at first: adding it would change the <em>implicit</em> default write concern (with an arbiter the formula falls back to <code>w: 1</code>), so you must state a cluster-wide default explicitly. Now stop the only secondary:</p>
${lenh(K, 20)}
${lenh(K, 21)}
${lenh(K, 22)}
${lenh(K, 23)}
<p>The arbiter did its job: r1 + arbiter are two of three votes, so r1 stays primary and <code>w: 1</code> writes succeed in milliseconds. But only one member now <em>holds data</em>. A majority write cannot be satisfied by an arbiter, so it times out; and the <strong>majority commit point</strong> stops moving while new writes keep arriving. The primary must keep every change since that point in its cache — over hours that becomes memory pressure and slowdowns. And every write acknowledged with <code>w: 1</code> during that time exists on one disk only. The cluster looks "up" on the dashboard; durability is gone.</p>
${nguon('📘', 'Replica Set Arbiter — MongoDB Docs', 'Arbiters vote but hold no data; PSA performance issues with majority write concern when a secondary is unavailable; avoid arbiters on the same host', 'https://www.mongodb.com/docs/manual/core/replica-set-arbiter/')}

<h3>Placing members across sites</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 site</span><span class="lz-t">3 members in one data centre</span><span class="lz-d">survives a machine, not a power cut of the building</span></div>
  <div class="lz-step"><span class="lz-k">2 sites</span><span class="lz-t">2 + 1</span><span class="lz-d">losing the site with 2 stops writes — the other side has 1 of 3</span></div>
  <div class="lz-step"><span class="lz-k">3 sites</span><span class="lz-t">2 + 2 + 1 (5 members)</span><span class="lz-d">any one site can go; the primary prefers site A by priority</span></div>
</div>
<p>Managed services such as MongoDB Atlas place the members of a replica set in different availability zones of a region where the region has them, for exactly this reason. Tags let you go further: read preference with <code>{ dc: 'hn' }</code> reads from the nearest site; a custom write concern can require "a copy in two sites" for payments.</p>

<h3>🔎 Real incident: GitLab, 31 January 2017</h3>
<p>An engineer cleaning up a replication problem ran a delete meant for the secondary on the primary instead, and around 300 GB of production data was gone within a second or two. Looking for backups, the team found that the mechanisms they relied on did not give them a usable copy; the restore came from a snapshot an engineer had made manually about six hours before the outage. It was PostgreSQL, not MongoDB — but the lesson for this page is the same: a replica copies your mistakes in milliseconds, and the protections against human error (delayed copies, tested backups) must be checked before the bad day. The Incident Response course tells the full story.</p>
${nguon('🔬', 'Postmortem of database outage of January 31 — GitLab blog (10/02/2017)', 'Delete meant for a secondary ran on the primary (~300 GB); backups unusable; restore from a manual snapshot ~6 hours old', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/')}

<h3>💼 At work: "we saved a server with an arbiter"</h3>
<p>A small outsourcing client runs PSA to save one VM. One weekend the secondary's disk fills up and the process stops. Nobody notices: the dashboard shows a primary, the application writes with the default write concern — which, with an arbiter, the team had set to <code>w: 1</code> to make writes work. On Monday the primary's VM is restarted by the provider. Data written over the weekend existed on one disk; luckily it survived. Your report to the client: the arbiter saved one VM and removed the only protection that mattered; the fix is a second data-bearing secondary (PSS), an alert on "number of healthy data-bearing members &lt; 3", and a monthly failover rehearsal.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li><strong>"What is a hidden member for?"</strong> — Workloads that must not receive application reads: backups, analytics, delayed copies. It is invisible to drivers and has priority 0.</li>
<li><strong>"How do you protect against an accidental delete with replication?"</strong> — A delayed hidden member (priority 0, votes 0) as a short-term net, plus real backups with point-in-time recovery.</li>
<li><strong>"Why avoid arbiters?"</strong> — With one data member down, majority writes cannot succeed and the commit point stalls; durability drops to one copy while the set looks healthy.</li>
<li><strong>"Why should a delayed member have votes: 0?"</strong> — Otherwise it can become part of the majority and make every majority write wait for the delay.</li>
<li><strong>"How do you place a replica set across data centres?"</strong> — So that losing any one site leaves a majority: e.g. 2 + 2 + 1 over three sites.</li>
</ul>

<h3>🧪 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>You have three sites (Hà Nội, Đà Nẵng, TP.HCM) and the application runs in Hà Nội. Design a replica set that survives the loss of any one site and normally keeps the primary in Hà Nội.</li>
<li>Add protection against "someone deletes a collection by mistake" with one hour of delay, without making any write slower.</li>
<li>A client runs primary–secondary–arbiter and refuses to pay for a third data server. Write the three sentences you would put in your recommendation.</li>
</ol>
${loiGiai('Suggested answers', GIAI_EN)}
<p><strong>Done when:</strong> you have recovered deleted data from a delayed member, and seen why both a voting delayed member and an arbiter make majority writes fail when one ordinary secondary is gone.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Priority', 'Election preference, 0–1000; priority 0 can never become primary.'],
  ['Votes', '1 or 0; voters decide elections and count toward majority writes; at most 7.'],
  ['Hidden member', 'Not advertised to drivers, so it never serves application reads; priority 0.'],
  ['Delayed member', 'Applies the oplog secondaryDelaySecs late; should be hidden, priority 0 and votes 0.'],
  ['Arbiter', 'Votes without data; in PSA, losing the secondary leaves majority writes impossible.'],
  ['Majority commit point', 'The newest write known to be on a majority; if it stalls, the primary accumulates history in cache.'],
  ['Tags', 'Labels on members for read preference and custom write concerns (e.g. one copy per site).'],
])}
<h3>📌 Summary</h3>
<ul>
<li>priority decides who leads, votes decide who counts, hidden decides who serves reads.</li>
<li>A delayed hidden member can undo an accidental delete — within its delay window; real backups still needed.</li>
<li>Delayed members must not vote, or majority writes wait for the delay.</li>
<li>Arbiters keep a primary elected but not your data safe; prefer three data-bearing members.</li>
<li>Place members so losing any one site leaves a majority.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Loại thành viên: hidden, delayed, bẫy arbiter, priority</h2>
<p class="lead">Ở Bài 7.1–7.2 ba thành viên như nhau, chỉ khác một độ ưu tiên. Replica set thật trộn nhiều vai: một máy không bao giờ được làm primary, một máy ứng dụng không bao giờ nhìn thấy, một máy cố ý chậm một giờ, một máy chỉ bỏ phiếu mà không giữ gì. Mỗi tuỳ chọn giải một bài toán thật — và mỗi tuỳ chọn có một cái bẫy chỉ lộ ra vào ngày xấu. Bài này thử từng cái trên cụm ba container, kể cả cái cứu được một lần xoá nhầm.</p>

<h3>Hình ảnh đời thường: hội đồng quản trị</h3>
<p>Hội đồng có thành viên có thể làm chủ tịch, thành viên bỏ phiếu nhưng không bao giờ làm chủ tịch (priority 0), một người lưu trữ giữ biên bản tuần trước trong ngăn kéo khoá và không dự họp (hidden, delayed), và một thành viên bên ngoài chỉ bỏ phiếu, không giữ hồ sơ nào (arbiter). Một người phân xử không giữ hồ sơ nghe có vẻ rẻ và vô hại — cho tới khi người duy nhất còn lại giữ hồ sơ bị ốm, và hội đồng vẫn bỏ phiếu được nhưng không ai đưa ra được giấy tờ.</p>
<table>
<thead><tr><th>Tuỳ chọn</th><th>Làm gì</th><th>Dùng khi</th></tr></thead>
<tbody>
<tr><td><code>priority</code> (0–1000)</td><td>độ ưu tiên khi bầu; 0 = không bao giờ là primary</td><td>giữ primary ở trung tâm dữ liệu chính; máy làm báo cáo</td></tr>
<tr><td><code>votes</code> (0 hoặc 1)</td><td>được tính khi bầu và khi ghi majority</td><td>hơn 7 thành viên; thành viên trễ (votes 0)</td></tr>
<tr><td><code>hidden</code></td><td>không có trong <code>hello().hosts</code>: driver không bao giờ gửi lệnh đọc tới; cần priority 0</td><td>sao lưu, phân tích, bản sao trễ</td></tr>
<tr><td><code>secondaryDelaySecs</code></td><td>áp dụng oplog chậm N giây; cần priority 0, nên hidden và votes 0</td><td>lưới an toàn chống lỗi của người</td></tr>
<tr><td>arbiter</td><td>bỏ phiếu, không giữ dữ liệu</td><td>gần như không bao giờ là ý hay (xem dưới)</td></tr>
<tr><td><code>tags</code></td><td>nhãn như <code>{ dc: 'hn' }</code> cho read preference và write concern tự định nghĩa</td><td>đọc từ nơi gần, ghi sang hai nơi</td></tr>
</tbody>
</table>

<h3>Một thành viên trễ, ẩn</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>r3 giờ là <code>priority 0</code> (không bao giờ được bầu), <code>hidden</code> (đã biến khỏi <code>hello().hosts</code>, nên không driver nào gửi lệnh đọc tới nó) và cố ý chậm 60 giây. Hệ thật sẽ dùng một giờ hoặc hơn; lab dùng một phút để bạn kịp nhìn.</p>

<h3>Lần xoá nhầm</h3>
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
<p>Ai đó chạy <code>deleteMany</code> với điều kiện khớp tất cả — kiểu kinh điển "tưởng đang ở staging". Với <code>w: "majority"</code>, lệnh xoá được chép sang r2 trong vài mili giây: secondary bình thường cũng là bản sao của lỗi lầm của bạn. Nhưng r3 áp dụng oplog chậm một phút:</p>
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
<p>Trong cửa sổ trễ, xuất collection từ thành viên trễ rồi khôi phục vào primary — 1.000 khách quay lại. Cái khó là cửa sổ: bạn có đúng <code>secondaryDelaySecs</code> để phát hiện, quyết định và xuất dữ liệu, và nếu xuất lâu hơn thế thì phải chặn thành viên trễ áp dụng lệnh xoá (đời thật: <code>db.fsyncLock()</code> hoặc tắt nó đi). Thành viên trễ là tấm lưới nhanh, không phải bản sao lưu — khôi phục tới một thời điểm từ bản sao lưu thật ở Bài 10.1.</p>
${nguon('📘', 'Delayed Replica Set Members — MongoDB Docs', 'Phải priority 0, nên hidden và không có phiếu; độ trễ phải nằm trong cửa sổ oplog; votes: 0 để không làm chậm ghi majority', 'https://www.mongodb.com/docs/manual/core/replica-set-delayed-member/')}

<h3>Bẫy: thành viên trễ vẫn còn phiếu</h3>
${lenh(K, 10)}
${lenh(K, 11)}
<p>r2 sập, các thành viên có phiếu là r1 và r3. Đa số của ba phiếu là hai, nên mọi lệnh ghi <code>w: "majority"</code> giờ phải chờ tới khi <em>r3</em> có nó — mà r3 áp dụng lệnh ghi chậm 60 giây. Lệnh chèn hết giờ sau 8 giây <code>wtimeout</code>; không có <code>wtimeout</code> thì nó đã chờ trọn một phút, hay một giờ với độ trễ thật. Vì thế tài liệu nói thành viên trễ nên không có phiếu:</p>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
<p>Hãy để ý giá của cách sửa trên set ba thành viên: r3 votes 0 thì chỉ còn hai máy có phiếu, mất máy nào cũng dừng ghi. Ở production, thành viên trễ là một thành viên <em>thêm</em> — năm thành viên dữ liệu có phiếu cộng một bản sao trễ không phiếu.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "priority 0 để nó không làm primary" không có nghĩa là "vô hại".</strong> Thành viên priority 0 hay hidden mà <code>votes: 1</code> vẫn được tính khi bầu và khi ghi majority. Mỗi thành viên có phiếu bạn thêm vào đều đổi phép tính ở Bài 7.1. Trước khi thêm một máy báo cáo hay máy sao lưu, hãy ghi ra số thành viên có phiếu và set chịu được bao nhiêu máy hỏng — trước và sau.</p>
</div>

<h3>Bẫy: arbiter (PSA)</h3>
<p><strong>Arbiter</strong> bỏ phiếu nhưng không giữ dữ liệu. Nó hấp dẫn: ba phiếu với giá của hai máy dữ liệu. Dựng thử — gỡ r3, thêm r4 làm arbiter:</p>
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
<p>MongoDB 8.0 từ chối arbiter lúc đầu: thêm nó sẽ đổi write concern mặc định <em>ngầm</em> (có arbiter thì công thức lùi về <code>w: 1</code>), nên bạn phải tự nói rõ mặc định cho cả cụm. Giờ tắt secondary duy nhất:</p>
${lenh(K, 20)}
${lenh(K, 21)}
${lenh(K, 22)}
${lenh(K, 23)}
<p>Arbiter làm đúng việc của nó: r1 + arbiter là hai trên ba phiếu, nên r1 vẫn là primary và lệnh ghi <code>w: 1</code> xong trong vài mili giây. Nhưng giờ chỉ một thành viên <em>giữ dữ liệu</em>. Arbiter không đáp ứng được lệnh ghi majority, nên lệnh đó hết giờ; và <strong>điểm commit majority</strong> đứng yên trong khi lệnh ghi mới vẫn tới. Primary phải giữ mọi thay đổi kể từ điểm đó trong cache — qua nhiều giờ, việc này thành áp lực bộ nhớ và chậm đi. Và mọi lần ghi xác nhận bằng <code>w: 1</code> trong lúc đó chỉ tồn tại trên một ổ đĩa. Cụm trông "vẫn sống" trên dashboard; độ bền thì đã mất.</p>
${nguon('📘', 'Replica Set Arbiter — MongoDB Docs', 'Arbiter bỏ phiếu nhưng không giữ dữ liệu; vấn đề hiệu năng của PSA với write concern majority khi secondary không có mặt; không đặt arbiter chung máy', 'https://www.mongodb.com/docs/manual/core/replica-set-arbiter/')}

<h3>Đặt thành viên ở nhiều nơi</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 nơi</span><span class="lz-t">3 thành viên trong một trung tâm dữ liệu</span><span class="lz-d">sống qua hỏng một máy, không qua mất điện cả toà nhà</span></div>
  <div class="lz-step"><span class="lz-k">2 nơi</span><span class="lz-t">2 + 1</span><span class="lz-d">mất nơi có 2 máy là dừng ghi — phía kia chỉ có 1 trên 3</span></div>
  <div class="lz-step"><span class="lz-k">3 nơi</span><span class="lz-t">2 + 2 + 1 (5 thành viên)</span><span class="lz-d">mất nơi nào cũng được; primary ưu tiên nơi A nhờ priority</span></div>
</div>
<p>Các dịch vụ được quản lý như MongoDB Atlas đặt các thành viên của một replica set ở các vùng sẵn sàng (availability zone) khác nhau của một region khi region đó có, vì đúng lý do này. Tag cho bạn đi xa hơn: read preference với <code>{ dc: 'hn' }</code> đọc từ nơi gần nhất; write concern tự định nghĩa có thể đòi "một bản ở hai nơi" cho thanh toán.</p>

<h3>🔎 Sự cố thật: GitLab, 31/01/2017</h3>
<p>Một kỹ sư đang xử lý sự cố nhân bản đã chạy lệnh xoá định dành cho secondary lên nhầm primary, và chừng 300 GB dữ liệu production mất trong một hai giây. Đi tìm bản sao lưu, đội phát hiện các cơ chế họ trông cậy không cho ra bản nào dùng được; việc khôi phục phải lấy từ một snapshot do một kỹ sư làm tay khoảng sáu giờ trước sự cố. Đó là PostgreSQL, không phải MongoDB — nhưng bài học cho trang này là một: bản sao chép lỗi lầm của bạn trong vài mili giây, và các lớp bảo vệ chống lỗi của người (bản sao trễ, bản sao lưu đã thử khôi phục) phải được kiểm trước ngày xấu. Khoá Ứng phó sự cố kể đầy đủ câu chuyện.</p>
${nguon('🔬', 'Postmortem of database outage of January 31 — GitLab blog (10/02/2017)', 'Lệnh xoá dành cho secondary chạy trên primary (~300 GB); bản sao lưu không dùng được; khôi phục từ snapshot làm tay cũ ~6 giờ', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/')}

<h3>💼 Đi làm: "bọn em tiết kiệm được một máy nhờ arbiter"</h3>
<p>Một khách hàng outsourcing nhỏ chạy PSA để bớt một máy ảo. Một cuối tuần, ổ đĩa của secondary đầy và tiến trình dừng. Không ai biết: dashboard vẫn thấy primary, ứng dụng ghi với write concern mặc định — mà đội đã đặt thành <code>w: 1</code> cho lệnh ghi chạy được khi có arbiter. Sáng thứ Hai nhà cung cấp khởi động lại máy ảo của primary. Dữ liệu ghi suốt cuối tuần chỉ nằm trên một ổ đĩa; may mà nó còn. Báo cáo của bạn gửi khách: arbiter tiết kiệm một máy ảo và gỡ mất lớp bảo vệ duy nhất có ý nghĩa; cách sửa là thêm một secondary mang dữ liệu (PSS), cảnh báo khi "số thành viên dữ liệu khoẻ &lt; 3", và diễn tập chuyển dự phòng hằng tháng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li><strong>"Thành viên hidden dùng làm gì?"</strong> — Cho các tải không được nhận lệnh đọc của ứng dụng: sao lưu, phân tích, bản sao trễ. Driver không thấy nó, và nó có priority 0.</li>
<li><strong>"Dùng nhân bản để chống xoá nhầm thế nào?"</strong> — Một thành viên trễ, ẩn (priority 0, votes 0) làm lưới ngắn hạn, cộng bản sao lưu thật có khôi phục tới thời điểm.</li>
<li><strong>"Vì sao nên tránh arbiter?"</strong> — Một máy dữ liệu sập là lệnh ghi majority không thể thành công và điểm commit dừng lại; độ bền còn một bản trong khi set trông vẫn khoẻ.</li>
<li><strong>"Vì sao thành viên trễ nên có votes: 0?"</strong> — Nếu không, nó có thể thành một phần của đa số và bắt mọi lệnh ghi majority chờ đúng độ trễ.</li>
<li><strong>"Đặt replica set qua nhiều trung tâm dữ liệu thế nào?"</strong> — Sao cho mất một nơi bất kỳ vẫn còn đa số: vd 2 + 2 + 1 trên ba nơi.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Bạn có ba nơi (Hà Nội, Đà Nẵng, TP.HCM) và ứng dụng chạy ở Hà Nội. Thiết kế replica set sống qua việc mất một nơi bất kỳ và bình thường giữ primary ở Hà Nội.</li>
<li>Thêm lớp bảo vệ chống "ai đó xoá nhầm một collection" với độ trễ một giờ, mà không làm lệnh ghi nào chậm đi.</li>
<li>Một khách hàng chạy primary–secondary–arbiter và không chịu trả tiền cho máy dữ liệu thứ ba. Viết ba câu bạn sẽ đưa vào khuyến nghị.</li>
</ol>
${loiGiai('Gợi ý đáp án', GIAI_VI)}
<p><strong>Xong khi:</strong> bạn đã khôi phục dữ liệu bị xoá từ một thành viên trễ, và thấy được vì sao cả thành viên trễ còn phiếu lẫn arbiter đều làm ghi majority hỏng khi mất một secondary bình thường.</p></div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Priority', 'Độ ưu tiên khi bầu, 0–1000; priority 0 không bao giờ thành primary.'],
  ['Votes', '1 hoặc 0; người có phiếu quyết định bầu chọn và được tính khi ghi majority; tối đa 7.'],
  ['Thành viên hidden', 'Không được báo cho driver, nên không bao giờ phục vụ lệnh đọc của ứng dụng; priority 0.'],
  ['Thành viên trễ', 'Áp dụng oplog chậm secondaryDelaySecs; nên hidden, priority 0 và votes 0.'],
  ['Arbiter', 'Bỏ phiếu không có dữ liệu; ở PSA, mất secondary là lệnh ghi majority không thể thành công.'],
  ['Điểm commit majority', 'Lần ghi mới nhất đã chắc chắn nằm trên đa số; nếu nó dừng, primary dồn lịch sử trong cache.'],
  ['Tags', 'Nhãn trên thành viên cho read preference và write concern tự định nghĩa (vd mỗi nơi một bản).'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>priority quyết định ai dẫn, votes quyết định ai được tính, hidden quyết định ai phục vụ lệnh đọc.</li>
<li>Thành viên trễ, ẩn cứu được một lần xoá nhầm — trong cửa sổ trễ; vẫn cần bản sao lưu thật.</li>
<li>Thành viên trễ không được có phiếu, nếu không ghi majority phải chờ đúng độ trễ.</li>
<li>Arbiter giữ được việc bầu primary chứ không giữ được dữ liệu; hãy dùng ba thành viên mang dữ liệu.</li>
<li>Đặt thành viên sao cho mất một nơi bất kỳ vẫn còn đa số.</li>
</ul>
</div>
`,
};
