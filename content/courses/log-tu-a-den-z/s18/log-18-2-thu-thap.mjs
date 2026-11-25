/**
 * 18.2 — Thu thập & bảo toàn (soạn 24/11/2026, agent lgz). Output thật: OUT['s18/thu-thap'] — bộ su-co18 (tao-su-co.py) trong lgz-c03 + Loki 3.7.10 (lgz-c18-loki),
 * cả hai --network none (lgz-c03 dùng chung netns của Loki). Số trong bài: 24 tệp băm; auth.log.1 e1349ff0…; bản sao sửa 1 IP ⇒ access.log FAILED, mã thoát 1;
 * 8 cách ghi giờ (22:42:31+07:00 → 15:42:31Z; error.log 02:12:48 không múi giờ → 19:12:48Z); router chậm 97 s (15 cặp SPT=IpPort, −98,1…−97,2 s);
 * Loki 19 364 dòng / 7 luồng, cần POST /flush (querier.query_ingesters_within 3h); LogQL: rt01 254 PTR lúc 15:53, B0A903430D8B ở journal + 7 sự kiện win; 46/130/4/12 theo giờ.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '18.2 — Step 1 — Collect and preserve: hash every file, record sources, normalise time, load into your stack|||18.2 — Bước 1 — Thu thập và bảo toàn: băm mọi tệp, ghi nguồn, chuẩn hoá thời gian, nạp vào hệ gom log',
  slug: 'log-18-2-thu-thap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bước đầu của mọi cuộc điều tra: băm SHA-256 cả 24 tệp (sha256sum và Get-FileHash ra cùng một giá trị), chứng minh một bản sao bị sửa một IP là bị phát hiện ngay, lập bảng chuỗi lưu giữ; đưa tám cách ghi giờ khác nhau về UTC (kể cả error.log của nginx không ghi múi giờ); TỰ ĐO độ lệch đồng hồ router bằng cổng nguồn chung giữa log tường lửa và sự kiện 4625 (chậm 97 giây); rồi nạp toàn bộ 19 364 dòng vào Loki 3.7 bằng HTTP push API, gặp và xử lý bẫy "dòng cũ hơn 3 giờ không tìm thấy", và hỏi chéo nguồn bằng LogQL.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.2</span>
<h2>Before you look: freeze the evidence, fix the clocks</h2>
<p class="lead">Two mistakes ruin investigations before they start: working on evidence nobody can prove is unchanged, and comparing times that are not on the same clock. This step removes both. It takes 20 minutes and saves your report from "how do you know?".</p>

<h3>The everyday picture</h3>
<p>Police sealing a bag of evidence write the date, who handed it over, and sign across the seal. If the seal is broken later, everyone knows. A hash is that seal for files.</p>

<h3>1. Hash everything, record everything</h3>
${lenh('s18/thu-thap', 0)}
${lenh('s18/thu-thap', 1)}
<p>Windows (<code>Get-FileHash</code>) and Linux (<code>sha256sum</code>) give the same value — the hash belongs to the bytes, not the tool. Keep <code>SHA256SUMS</code> next to (not inside) the evidence and give a copy to someone else (email it to yourself, put it in the ticket).</p>
${lenh('s18/thu-thap', 2)}
${lenh('s18/thu-thap', 3)}
<p>One IP changed in one line of a 2.7 MB file — and the check fails with exit code 1. That is your proof, months later, that the logs you quote are the logs you received.</p>
${kv([
  ['Chain of custody row', 'File · SHA-256 · original location · who collected · when (UTC) · how (command) · who received.'],
  ['Example', '<code>vps01/var/log/auth.log.1</code> · e1349ff0… · vps01:/var/log/auth.log.1 · An · 2026-11-23 01:42Z · <code>sudo tar czf …</code> · you, 2026-11-23 03:00Z.'],
  ['Work on copies', 'Mount evidence read-only (this lab does: <code>-v …:ro</code>). Write your notes and outputs elsewhere.'],
])}

<h3>2. Eight ways to write the same night — normalise to UTC</h3>
${lenh('s18/thu-thap', 4)}
${lenh('s18/thu-thap', 5)}
${lenh('s18/thu-thap', 6)}
<div class="pitfall co-tieu-de"><p><strong>nginx error.log has no time zone.</strong> <code>2026/11/22 02:12:48</code> is the server's local time and says nothing about which zone. You must know the server is +07:00 and append it yourself — otherwise you are seven hours off (a wrong conversion gives 02:12:48Z).</p></div>
${lenh('s18/thu-thap', 7)}
${lenh('s18/thu-thap', 8)}
${lenh('s18/thu-thap', 9)}
${lenh('s18/thu-thap', 10)}
${lenh('s18/thu-thap', 11)}
${kv([
  ['auth.log / syslog', 'RFC 3339 with offset, µs — <code>2026-11-21T22:42:31.016171+07:00</code>.'],
  ['journal JSON', '<code>__REALTIME_TIMESTAMP</code> = µs since epoch (UTC).'],
  ['nginx access.log', '<code>[21/Nov/2026:23:06:02 +0700]</code> — seconds, offset.'],
  ['nginx error.log', '<code>2026/11/22 02:12:48</code> — local, <strong>no zone</strong>.'],
  ['docker json-file', '<code>time</code> in UTC (Z, ns); inside it pino <code>time</code> = ms since epoch.'],
  ['PostgreSQL csvlog', '<code>2026-11-21 19:14:27.353 UTC</code> — <code>log_timezone</code> = Etc/UTC in the official image (file names use the UTC weekday!).'],
  ['OpenWrt logread', '<code>Sat Nov 21 22:53:33 2026</code> — local, no zone, seconds, <strong>clock not synced</strong>.'],
  ['Windows JSON', '<code>2026-11-21T15:57:53.4420000Z</code> — UTC, 100 ns.'],
])}

<h3>3. Measure the router's clock — with the same event seen twice</h3>
<p>The router does not use NTP (<code>ntp.enabled=0</code> in <code>rt01/thu-thap/firewall.txt</code>). How wrong is it? Find one event both sides recorded: every SMB connection to PC-DEV01 appears in the router's firewall log (<code>SPT=</code> source port) <em>and</em> in Windows 4625 (<code>IpPort=</code>). Same source port = same TCP connection.</p>
<details><summary><strong>lech-dong-ho.py (≈ 25 lines)</strong></summary>
${ma('python', 's18/mau/lech-dong-ho.py')}
</details>
${lenh('s18/thu-thap', 12)}
<p>Fifteen pairs, all between −98.1 and −97.2 seconds: the router is <strong>97 seconds slow</strong>. Every router time must get +97 s before you convert to UTC. Without this, the router says the port scan happened <em>before</em> the DNS sweep that found the targets.</p>

<h3>4. Load everything into one place (Loki)</h3>
<p>Chapter 15 shipped live logs with Alloy. For evidence files, the simplest path is Loki's HTTP push API: each line keeps its <em>original text</em>, gets a <em>normalised UTC timestamp</em> and two labels (<code>may</code> = machine, <code>nguon</code> = source).</p>
<details><summary><strong>nap-loki.py, nguon18.py (parsers), loki.yaml, ct.bash</strong></summary>
${ma('python', 's18/mau/nap-loki.py')}
${ma('python', 's18/mau/nguon18.py')}
${ma('yaml', 's18/mau/loki.yaml')}
${ma('bash', 's18/cong-cu/ct.bash')}
</details>
${lenh('s18/thu-thap', 13)}
<div class="pitfall co-tieu-de"><p><strong>"I loaded 19 364 lines and every query returns nothing."</strong> This happened while preparing this lesson. Loki's querier only asks the ingesters (where fresh data sits in memory) about the last 3 hours (<code>querier.query_ingesters_within</code>, default 3h); older time ranges go to the store only. Evidence is days old ⇒ until the chunks are flushed to the store, it is invisible. The fix used here: <code>POST /flush</code>, then poll until a query answers. Also needed: <code>reject_old_samples: false</code>.</p></div>
${lenh('s18/thu-thap', 14)}
${lenh('s18/thu-thap', 15)}
${lenh('s18/thu-thap', 16)}
<p>One query, three machines: the container ID <code>b0a903430d8b</code> in the vps01 journal and the "workstation name" <code>B0A903430D8B</code> in Windows events are the same string (note <code>(?i)</code> — case differs). You will explain why in 18.3. In metric queries, each point is the count of the window <em>ending</em> at that time (15:00 = 14:00–15:00).</p>
<p><strong>No Loki?</strong> Everything in 18.3–18.4 is also done with grep/jq/Python on the files — that is the "command line" path of Chapter 2. Loki pays off when many people investigate together, or the data does not fit in your head.</p>

<h3>🛡️ Attacker's corner</h3>
<p>Attackers count on two things: that you will investigate on the live, compromised machine (where they can still edit files), and that clocks disagree so their steps look out of order. Copy off-host, hash immediately, and measure every clock against one you trust.</p>
${nguon('📘', 'RFC 3227 — Guidelines for Evidence Collection and Archiving', 'Order of volatility, chain of custody', 'https://www.rfc-editor.org/rfc/rfc3227')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Why hash logs?" — to prove later that what you analysed is what you collected; any change, even one byte, changes the hash.</li>
<li>"One device has the wrong time. What do you do?" — find an event recorded by it and by a trusted clock, measure the offset, correct and document it; never silently "fix" timestamps.</li>
<li>"Why UTC?" — one reference with no DST or zone confusion; local time only as an extra column when presenting.</li>
</ul>

<h3>At work</h3>
<p>Customers often send logs without saying the server's time zone. Ask, in writing, before you start ("Is vps01 set to Asia/Ho_Chi_Minh?"), and record the answer in the report's assumptions section.</p>

<h3>🧪 Practice (40 min)</h3>
<ol>
<li>Write the chain-of-custody table for all 24 files (script it from SHA256SUMS).</li>
<li>Re-run <code>dong-thoi-gian18.py</code> (18.4) with skew 0 and with 97 for the window 15:52–15:59Z. Which order of events changes?</li>
<li>If you use Loki: write a LogQL query counting Windows 4625 per <code>TargetUserName</code> (hint: <code>| json</code> on the Windows stream).</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Hash (SHA-256)', 'Fingerprint of a file’s bytes; any change gives a different value.'],
  ['Chain of custody', 'Record of who held the evidence, when, and how it was handled.'],
  ['Clock skew', 'Difference between a device clock and true time; measured, documented, corrected.'],
  ['Normalisation', 'Bringing all timestamps to one zone (UTC) and format.'],
  ['Flush (Loki)', 'Writing in-memory chunks from ingesters to the store.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Hash first, analyse copies, keep the hash list somewhere else.</li>
<li>Know each source’s time format; append zones that are missing; measure skew with a shared event.</li>
<li>Loading evidence into Loki: keep original text, UTC timestamps, few labels; old data needs a flush to be queryable.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Lesson 1.5 — Time in logs', sub: 'Zones, epoch, skew', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-7-3-chuoi-luu-giu', title: 'Incident Response course › 7.3 Hashes and chain of custody', sub: 'The legal side of evidence', cta: 'Open' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-4-logql', title: 'Observability course › 2.4 LogQL', sub: 'The query language in depth', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.2</span>
<h2>Trước khi nhìn: niêm phong bằng chứng, chỉnh đồng hồ</h2>
<p class="lead">Hai lỗi làm hỏng cuộc điều tra ngay từ đầu: làm việc trên bằng chứng không ai chứng minh được là còn nguyên, và so những mốc giờ không cùng một đồng hồ. Bước này xoá cả hai. Mất 20 phút, đổi lại báo cáo của bạn không bị hỏi vặn "sao anh biết?".</p>

<h3>Liên tưởng đời thường</h3>
<p>Công an niêm phong túi tang vật: ghi ngày, ai giao, rồi ký đè lên mép niêm phong. Sau này niêm phong rách là ai cũng biết. Mã băm chính là con niêm phong cho tệp.</p>

<h3>1. Băm mọi thứ, ghi lại mọi thứ</h3>
${lenh('s18/thu-thap', 0)}
${lenh('s18/thu-thap', 1)}
<p>Windows (<code>Get-FileHash</code>) và Linux (<code>sha256sum</code>) ra cùng một giá trị — mã băm thuộc về các byte, không thuộc công cụ. Để <code>SHA256SUMS</code> cạnh (không phải bên trong) bằng chứng và gửi một bản cho người khác giữ (email cho chính mình, dán vào ticket).</p>
${lenh('s18/thu-thap', 2)}
${lenh('s18/thu-thap', 3)}
<p>Đổi một IP ở một dòng của tệp 2,7 MB — phép kiểm hỏng ngay, mã thoát 1. Đó là bằng chứng, nhiều tháng sau, rằng log bạn trích dẫn đúng là log bạn đã nhận.</p>
${kv([
  ['Một hàng chuỗi lưu giữ', 'Tệp · SHA-256 · vị trí gốc · ai thu · khi nào (UTC) · bằng cách nào (lệnh) · ai nhận.'],
  ['Ví dụ', '<code>vps01/var/log/auth.log.1</code> · e1349ff0… · vps01:/var/log/auth.log.1 · An · 2026-11-23 01:42Z · <code>sudo tar czf …</code> · bạn, 2026-11-23 03:00Z.'],
  ['Làm trên bản sao', 'Gắn bằng chứng chỉ-đọc (lab này gắn <code>-v …:ro</code>). Ghi chú và kết quả để chỗ khác.'],
])}

<h3>2. Tám cách ghi cùng một đêm — đưa về UTC</h3>
${lenh('s18/thu-thap', 4)}
${lenh('s18/thu-thap', 5)}
${lenh('s18/thu-thap', 6)}
<div class="pitfall co-tieu-de"><p><strong>error.log của nginx không có múi giờ.</strong> <code>2026/11/22 02:12:48</code> là giờ địa phương của máy chủ và không nói múi nào. Bạn phải biết máy đặt +07:00 rồi tự gắn vào — nếu không sẽ lệch bảy tiếng (đổi sai sẽ ra 02:12:48Z).</p></div>
${lenh('s18/thu-thap', 7)}
${lenh('s18/thu-thap', 8)}
${lenh('s18/thu-thap', 9)}
${lenh('s18/thu-thap', 10)}
${lenh('s18/thu-thap', 11)}
${kv([
  ['auth.log / syslog', 'RFC 3339 có độ lệch múi giờ, micro giây — <code>2026-11-21T22:42:31.016171+07:00</code>.'],
  ['journal JSON', '<code>__REALTIME_TIMESTAMP</code> = micro giây kể từ 1970 (UTC).'],
  ['nginx access.log', '<code>[21/Nov/2026:23:06:02 +0700]</code> — tới giây, có độ lệch.'],
  ['nginx error.log', '<code>2026/11/22 02:12:48</code> — giờ địa phương, <strong>không múi giờ</strong>.'],
  ['docker json-file', '<code>time</code> theo UTC (Z, nano giây); bên trong, <code>time</code> của pino = mili giây kể từ 1970.'],
  ['PostgreSQL csvlog', '<code>2026-11-21 19:14:27.353 UTC</code> — ảnh chính thức đặt <code>log_timezone</code> = Etc/UTC (tên tệp theo THỨ của UTC!).'],
  ['OpenWrt logread', '<code>Sat Nov 21 22:53:33 2026</code> — giờ địa phương, không múi giờ, tới giây, <strong>đồng hồ không đồng bộ</strong>.'],
  ['Windows JSON', '<code>2026-11-21T15:57:53.4420000Z</code> — UTC, 100 nano giây.'],
])}

<h3>3. Đo đồng hồ của router — bằng một sự việc được ghi hai lần</h3>
<p>Router không dùng NTP (<code>ntp.enabled=0</code> trong <code>rt01/thu-thap/firewall.txt</code>). Nó lệch bao nhiêu? Tìm một sự việc cả hai phía cùng ghi: mỗi kết nối SMB vào PC-DEV01 vừa có trong log tường lửa của router (<code>SPT=</code> cổng nguồn) <em>vừa</em> có trong sự kiện 4625 của Windows (<code>IpPort=</code>). Cùng cổng nguồn = cùng một kết nối TCP.</p>
<details><summary><strong>lech-dong-ho.py (≈ 25 dòng)</strong></summary>
${ma('python', 's18/mau/lech-dong-ho.py')}
</details>
${lenh('s18/thu-thap', 12)}
<p>Mười lăm cặp, đều nằm giữa −98,1 và −97,2 giây: router <strong>chậm 97 giây</strong>. Mọi mốc giờ của router phải cộng 97 giây rồi mới đổi sang UTC. Không sửa, router sẽ "nói" việc quét cổng xảy ra <em>trước</em> cả lần dò DNS tìm ra mục tiêu.</p>

<h3>4. Nạp hết vào một chỗ (Loki)</h3>
<p>Chương 15 dùng Alloy gửi log đang chạy. Với tệp bằng chứng, đường đơn giản nhất là HTTP push API của Loki: mỗi dòng giữ <em>nguyên văn gốc</em>, nhận <em>mốc UTC đã chuẩn hoá</em> và hai nhãn (<code>may</code> = máy, <code>nguon</code> = nguồn).</p>
<details><summary><strong>nap-loki.py, nguon18.py (bộ đọc từng nguồn), loki.yaml, ct.bash</strong></summary>
${ma('python', 's18/mau/nap-loki.py')}
${ma('python', 's18/mau/nguon18.py')}
${ma('yaml', 's18/mau/loki.yaml')}
${ma('bash', 's18/cong-cu/ct.bash')}
</details>
${lenh('s18/thu-thap', 13)}
<div class="pitfall co-tieu-de"><p><strong>"Nạp 19 364 dòng mà truy vấn nào cũng rỗng."</strong> Chuyện này xảy ra thật lúc soạn bài. Querier của Loki chỉ hỏi ingester (nơi dữ liệu mới nằm trong bộ nhớ) cho 3 giờ gần nhất (<code>querier.query_ingesters_within</code>, mặc định 3h); khoảng thời gian cũ hơn chỉ tìm trong kho. Bằng chứng đã cũ vài ngày ⇒ chừng nào chunk chưa được đẩy xuống kho thì vô hình. Cách xử lý ở đây: <code>POST /flush</code>, rồi hỏi lại tới khi có kết quả. Cũng cần: <code>reject_old_samples: false</code>.</p></div>
${lenh('s18/thu-thap', 14)}
${lenh('s18/thu-thap', 15)}
${lenh('s18/thu-thap', 16)}
<p>Một truy vấn, ba máy: mã container <code>b0a903430d8b</code> trong journal của vps01 và "tên máy trạm" <code>B0A903430D8B</code> trong sự kiện Windows là cùng một chuỗi (chú ý <code>(?i)</code> — khác chữ hoa/thường). Vì sao — bạn sẽ giải thích ở 18.3. Với truy vấn số, mỗi điểm là số đếm của cửa sổ <em>kết thúc</em> tại mốc đó (15:00 = 14:00–15:00).</p>
<p><strong>Không có Loki?</strong> Mọi việc ở 18.3–18.4 đều làm được bằng grep/jq/Python trên tệp — đó là đường "dòng lệnh" của Chương 2. Loki đáng công khi nhiều người cùng điều tra, hoặc dữ liệu quá lớn để giữ trong đầu.</p>

<h3>🛡️ Góc hacker</h3>
<p>Kẻ tấn công trông vào hai điều: bạn điều tra ngay trên máy đang bị chiếm (nơi chúng vẫn sửa được tệp), và đồng hồ các máy lệch nhau để các bước của chúng trông lộn xộn. Chép ra khỏi máy, băm ngay, và đo mọi đồng hồ so với một đồng hồ bạn tin.</p>
${nguon('📘', 'RFC 3227 — Guidelines for Evidence Collection and Archiving', 'Thứ tự dễ mất, chuỗi lưu giữ', 'https://www.rfc-editor.org/rfc/rfc3227')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Sao phải băm log?" — để sau này chứng minh thứ bạn phân tích đúng là thứ bạn thu; đổi dù một byte, mã băm cũng đổi.</li>
<li>"Một thiết bị sai giờ, bạn làm gì?" — tìm một sự việc nó và một đồng hồ tin cậy cùng ghi, đo độ lệch, sửa và GHI LẠI; không bao giờ lặng lẽ "chỉnh" mốc giờ.</li>
<li>"Sao dùng UTC?" — một mốc chung, không giờ mùa hè, không nhầm múi; giờ địa phương chỉ là cột phụ khi trình bày.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Khách hàng hay gửi log mà không nói máy chủ đặt múi giờ nào. Hỏi bằng văn bản trước khi bắt đầu ("vps01 đặt Asia/Ho_Chi_Minh phải không?") và ghi câu trả lời vào mục giả định của báo cáo.</p>

<h3>🧪 Thực hành (40 phút)</h3>
<ol>
<li>Lập bảng chuỗi lưu giữ cho cả 24 tệp (viết script sinh từ SHA256SUMS).</li>
<li>Chạy <code>dong-thoi-gian18.py</code> (bài 18.4) với độ lệch 0 và 97 cho khoảng 15:52–15:59Z. Thứ tự sự việc nào thay đổi?</li>
<li>Nếu dùng Loki: viết truy vấn LogQL đếm 4625 theo <code>TargetUserName</code> (gợi ý: <code>| json</code> trên luồng Windows).</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Mã băm (SHA-256)', 'Dấu vân tay của các byte trong tệp; đổi bất cứ gì là ra giá trị khác.'],
  ['Chuỗi lưu giữ (chain of custody)', 'Ghi chép ai giữ bằng chứng, khi nào, xử lý thế nào.'],
  ['Lệch đồng hồ (clock skew)', 'Chênh giữa đồng hồ thiết bị và giờ thật; phải đo, ghi lại, sửa.'],
  ['Chuẩn hoá thời gian', 'Đưa mọi mốc giờ về một múi (UTC) và một định dạng.'],
  ['Flush (Loki)', 'Đẩy chunk đang ở bộ nhớ ingester xuống kho lưu trữ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Băm trước, phân tích trên bản sao, giữ danh sách mã băm ở nơi khác.</li>
<li>Thuộc định dạng giờ của từng nguồn; tự gắn múi giờ còn thiếu; đo lệch bằng một sự việc chung.</li>
<li>Nạp bằng chứng vào Loki: giữ nguyên văn, mốc UTC, ít nhãn; dữ liệu cũ phải flush mới hỏi được.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-1-5-thoi-gian', title: 'Bài 1.5 — Thời gian trong log', sub: 'Múi giờ, epoch, lệch đồng hồ', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-7-3-chuoi-luu-giu', title: 'Khoá Incident Response › 7.3 Băm và chuỗi lưu giữ', sub: 'Phía pháp lý của bằng chứng', cta: 'Mở bài' })}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-4-logql', title: 'Khoá Observability › 2.4 LogQL', sub: 'Ngôn ngữ truy vấn chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
