/**
 * 1.7 — Lab 1: một sự cố, năm nguồn log (soạn 22/11/2026).
 * Dữ liệu: incident/ của gói mẫu (20 dòng). Đáp án kiểm bằng lệnh: CODE['s01/lab1.sh'] + OUT['s01/lab1'] (chạy thật, Ubuntu 24.04).
 * Sự thật dàn dựng: máy CSDL Windows (db-win01) mất điện 14:04:12 giờ VN (07:04:12Z), PostgreSQL trên đó; api-01 chạy app Node (journal đúng giờ);
 * proxy-01 chạy nginx, đồng hồ nhanh 180 s, error log ghi giờ địa phương không độ lệch; bản xuất Windows ghi giờ địa phương kiểu Mỹ.
 */
import { ma, lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.7 — Lab 1 — One incident, five log sources: identify fields and normalise every timestamp to UTC|||1.7 — Lab 1 — Một sự cố, năm nguồn log: nhận diện trường và quy mọi mốc giờ về UTC',
  slug: 'log-1-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab có chấm: 20 dòng từ năm nguồn (bản xuất Windows, PostgreSQL, app Node JSON, nginx error log, journald) về cùng một lần sập; quy mọi mốc giờ về UTC, xếp đúng thứ tự thật, phát hiện hai cái bẫy (nguồn ghi giờ địa phương không múi giờ, đồng hồ proxy-01 nhanh 3 phút) và viết ba câu kết luận; đáp án kèm script kiểm bằng date/jq/awk chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lab 1</span>
<h2>Lab 1 — One incident, five log sources: rebuild what really happened</h2>
<p class="lead">On 20/11/2026 at about 14:05 Vietnam time, the sample company's website started timing out and then returned errors for four minutes. You have twenty lines from five sources in <code>~/log-lab/incident/</code>. Your job is the first job of every investigation: put every line on one clock, in the true order, and say what happened. Two traps are hidden in the data. Everything you need is in Lessons 1.2–1.5.</p>

<h3>The situation</h3>
<ul>
<li><strong>db-win01</strong> — a Windows server that runs PostgreSQL (a small company's setup). You have its System events exported with PowerShell to CSV on that machine, and the PostgreSQL log (<code>log_timezone = UTC</code>).</li>
<li><strong>api-01</strong> — a Linux server running the Node.js API (<code>ctw-api.service</code>). You have the app's JSON log and an excerpt of its journal printed with <code>journalctl -o short-iso</code>.</li>
<li><strong>proxy-01</strong> — a Linux server running nginx in front of the API. You have nginx's error log.</li>
<li>All three machines are configured for Vietnam time (UTC+7).</li>
</ul>
<pre><code class="language-bash">cd ~/log-lab/incident
ls -l
cat windows-system.csv postgresql.log nginx-error.log journal-api01.txt
jq -c . app.jsonl</code></pre>

<h3>Your tasks</h3>
<ol>
<li><strong>Fields.</strong> For each of the five files write: where the timestamp is, which zone it is in (or "none stated"), and its precision (seconds, milliseconds).</li>
<li><strong>Normalise.</strong> Convert all 20 timestamps to UTC in ISO 8601 (<code>2026-11-20T07:05:15Z</code>). Use commands from Lesson 1.5 or do it by hand — but state the rule you used for each source.</li>
<li><strong>Order.</strong> Sort the 20 lines by true time. Lines with the same second may stay in any order.</li>
<li><strong>Traps.</strong> One source writes local time without saying so; one machine's clock is wrong. Name both, and for the wrong clock say by how much and how you proved it.</li>
<li><strong>Story.</strong> Write three sentences: what failed first, what the users saw, and when everything was healthy again (all in UTC and in Vietnam time).</li>
</ol>
<div class="callout warn"><p><strong>Do not peek yet.</strong> The value of this lab is the moment you notice that one line "cannot be right". Give yourself 30 minutes before opening the answer below.</p></div>

<h3>Hints (open one at a time)</h3>
<ul>
<li>Hint 1: the Windows CSV was produced on a PC set to UTC+7, with US date format. Event 12's <em>message</em> contains a UTC time you can compare with.</li>
<li>Hint 2: event 6008's message gives the time of the unexpected shutdown — the moment the power went.</li>
<li>Hint 3: nginx says "no live upstreams" — that only happens while the API is down. When, according to api-01's own journal, was the API down? Compare.</li>
</ul>

<h3>Answer — check it with commands</h3>
<p>The script below converts every source with its own rule (Windows CSV: local time, US order; PostgreSQL: already UTC; app: epoch milliseconds; journal: has an offset, correct clock; nginx error log: local time without offset, and proxy-01's clock is 180 seconds fast) and sorts the result. It uses only <code>awk</code>, <code>date</code>, <code>jq</code> and <code>sort</code>:</p>
${ma('bash', 's01/lab1.sh')}
${lenh('s01/lab1', 5)}
<h3>Reading the answer</h3>
<ul>
<li><strong>Trap 1 — local time without a zone:</strong> nginx's error log (<code>2026/11/20 14:08:15</code>) and the Windows CSV (<code>2:07:30 PM</code>) are both Vietnam time with no marker. Read as UTC, they would land seven hours away from everything else.</li>
<li><strong>Trap 2 — proxy-01's clock is 3 minutes fast:</strong> api-01's journal shows the API exited at 14:06:02 and was started again at 14:06:07 (Vietnam time); the app's last line before dying is at 07:06:01.9Z. nginx on proxy-01 claims "connection refused" at 14:09:02 and "no live upstreams" at 14:09:05 — but at 14:09 the API had been running for three minutes. Shift nginx back 180 s and both lines fall exactly inside the five seconds the API was down. Its first line (upstream timed out at 14:08:15) also becomes 14:05:15: sixty seconds after the app's first database error, which is nginx's default 60-second proxy timeout. Three independent anchors give the same 180 s. In a real case you would confirm on proxy-01 with <code>timedatectl</code> or <code>chronyc tracking</code>.</li>
<li><strong>The story:</strong> the database server lost power at 07:04:12Z (14:04:12 Vietnam time — event 6008). One second later the app's queries failed (ECONNREFUSED), nginx began timing out at 07:05:15Z, the app gave up and exited at 07:06:01Z, systemd restarted it at 07:06:07Z. The Windows server booted again (event 12 at 07:07:28Z), PostgreSQL recovered and accepted connections at 07:08:23Z, and the app reconnected at 07:08:30Z (14:08:30 Vietnam time) — about four and a half minutes of outage.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>"nginx is the front door, so its times must be right."</strong> A source is not reliable because of its position or format; it is reliable because its clock is right. Always look for a pair of events two machines both saw, and let the clocks argue.</p></div>

<h3>Done when</h3>
<div class="callout ok"><ol>
<li>Your 20 lines are in the same order as the answer (ties within one second excepted).</li>
<li>You named both traps and proved the 180-second offset with a pair of events, not with the answer key.</li>
<li>Your three-sentence story gives the power-cut time (07:04:12Z) and the recovery time (07:08:30Z).</li>
</ol>
<p><strong>Done when:</strong> all three points hold — then add a page "Lab 1" to your notebook with the rules you used for each source.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['normalise', 'Convert values from different sources into one common form (here: UTC).'],
  ['timeline', 'All events from all sources in true time order.'],
  ['anchor event', 'An event recorded by two sources, used to compare their clocks.'],
  ['clock offset', 'A constant difference between a machine’s clock and true time.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Every source needs its own conversion rule; write the rule down next to the result.</li>
<li>Local time without a zone (nginx error log, Event Viewer exports) is the most common trap.</li>
<li>Prove clock offsets with anchor events seen by two sources.</li>
<li>A good timeline makes the story obvious: power cut → database gone → app fails → nginx errors → recovery.</li>
</ul>
${nguon('📘', 'RFC 3339 — Timestamps', 'The format used for every answer in this lab', 'https://www.rfc-editor.org/rfc/rfc3339')}
${lienKet({ khoa: 'incident-response', bai: 'ir-0-8-bat-dau-tai-day', title: 'Incident Response — start here', sub: 'Timelines are the backbone of the incident process', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lab 1</span>
<h2>Lab 1 — Một sự cố, năm nguồn log: dựng lại điều thật sự đã xảy ra</h2>
<p class="lead">Ngày 20/11/2026 khoảng 14:05 giờ Việt Nam, website của công ty mẫu bắt đầu treo rồi trả lỗi suốt bốn phút. Bạn có hai mươi dòng từ năm nguồn trong <code>~/log-lab/incident/</code>. Nhiệm vụ của bạn là việc đầu tiên của mọi cuộc điều tra: đưa mọi dòng về cùng một đồng hồ, xếp đúng thứ tự thật, và nói ra chuyện gì đã xảy ra. Trong dữ liệu có giấu hai cái bẫy. Mọi thứ cần dùng đã có ở bài 1.2–1.5.</p>

<h3>Bối cảnh</h3>
<ul>
<li><strong>db-win01</strong> — một server Windows chạy PostgreSQL (kiểu hạ tầng của công ty nhỏ). Bạn có các sự kiện System của nó, xuất bằng PowerShell ra CSV ngay trên máy đó, và log PostgreSQL (<code>log_timezone = UTC</code>).</li>
<li><strong>api-01</strong> — một server Linux chạy API Node.js (<code>ctw-api.service</code>). Bạn có log JSON của app và một đoạn journal của nó in bằng <code>journalctl -o short-iso</code>.</li>
<li><strong>proxy-01</strong> — một server Linux chạy nginx đứng trước API. Bạn có error log của nginx.</li>
<li>Cả ba máy đặt giờ Việt Nam (UTC+7).</li>
</ul>
<pre><code class="language-bash">cd ~/log-lab/incident
ls -l
cat windows-system.csv postgresql.log nginx-error.log journal-api01.txt
jq -c . app.jsonl</code></pre>

<h3>Nhiệm vụ</h3>
<ol>
<li><strong>Trường.</strong> Với mỗi tệp trong năm tệp, ghi: thời điểm nằm ở đâu, thuộc múi giờ nào (hoặc "không ghi"), độ chính xác (giây, mili giây).</li>
<li><strong>Quy đổi.</strong> Đổi cả 20 mốc giờ về UTC theo ISO 8601 (<code>2026-11-20T07:05:15Z</code>). Dùng lệnh ở bài 1.5 hoặc làm tay — nhưng ghi rõ luật đã dùng cho từng nguồn.</li>
<li><strong>Thứ tự.</strong> Xếp 20 dòng theo thời gian thật. Các dòng trùng giây có thể để thứ tự bất kỳ.</li>
<li><strong>Bẫy.</strong> Một nguồn ghi giờ địa phương mà không nói; một máy có đồng hồ sai. Gọi tên cả hai, và với đồng hồ sai, cho biết sai bao nhiêu và bạn chứng minh bằng cách nào.</li>
<li><strong>Câu chuyện.</strong> Viết ba câu: cái gì hỏng trước, người dùng thấy gì, và khi nào mọi thứ khoẻ lại (ghi cả UTC lẫn giờ Việt Nam).</li>
</ol>
<div class="callout warn"><p><strong>Khoan xem đáp án.</strong> Giá trị của lab này là khoảnh khắc bạn nhận ra một dòng "không thể đúng được". Cho mình 30 phút trước khi mở phần đáp án bên dưới.</p></div>

<h3>Gợi ý (mở từng cái một)</h3>
<ul>
<li>Gợi ý 1: tệp CSV của Windows được tạo trên máy đặt UTC+7, định dạng ngày kiểu Mỹ. <em>Thông điệp</em> của sự kiện 12 có chứa một thời điểm UTC để bạn so.</li>
<li>Gợi ý 2: thông điệp của sự kiện 6008 cho biết lúc máy tắt bất thường — chính là lúc mất điện.</li>
<li>Gợi ý 3: nginx báo "no live upstreams" — chuyện đó chỉ xảy ra khi API đang chết. Theo chính journal của api-01, API chết lúc nào? So xem.</li>
</ul>

<h3>Đáp án — kiểm bằng lệnh</h3>
<p>Script dưới đây đổi mỗi nguồn theo luật riêng của nó (CSV Windows: giờ địa phương, kiểu Mỹ; PostgreSQL: đã là UTC; app: epoch mili giây; journal: có độ lệch, đồng hồ đúng; error log nginx: giờ địa phương không độ lệch, và đồng hồ proxy-01 nhanh 180 giây) rồi xếp kết quả. Chỉ dùng <code>awk</code>, <code>date</code>, <code>jq</code> và <code>sort</code>:</p>
${ma('bash', 's01/lab1.sh')}
${lenh('s01/lab1', 5)}
<h3>Đọc đáp án</h3>
<ul>
<li><strong>Bẫy 1 — giờ địa phương không ghi múi giờ:</strong> error log nginx (<code>2026/11/20 14:08:15</code>) và CSV Windows (<code>2:07:30 PM</code>) đều là giờ Việt Nam mà không có dấu hiệu nào. Đọc thành UTC thì chúng rơi cách mọi thứ khác bảy tiếng.</li>
<li><strong>Bẫy 2 — đồng hồ proxy-01 nhanh 3 phút:</strong> journal của api-01 cho thấy API thoát lúc 14:06:02 và được chạy lại lúc 14:06:07 (giờ Việt Nam); dòng cuối của app trước khi chết là 07:06:01.9Z. nginx trên proxy-01 lại nói "connection refused" lúc 14:09:02 và "no live upstreams" lúc 14:09:05 — nhưng lúc 14:09 API đã chạy lại được ba phút rồi. Lùi nginx 180 giây là cả hai dòng rơi đúng vào năm giây API chết. Dòng đầu của nó (upstream timed out lúc 14:08:15) cũng thành 14:05:15: đúng sáu mươi giây sau lỗi CSDL đầu tiên của app, bằng thời gian chờ proxy mặc định 60 giây của nginx. Ba mốc độc lập cùng cho ra 180 giây. Ở vụ thật, bạn xác nhận trên proxy-01 bằng <code>timedatectl</code> hoặc <code>chronyc tracking</code>.</li>
<li><strong>Câu chuyện:</strong> server CSDL mất điện lúc 07:04:12Z (14:04:12 giờ Việt Nam — sự kiện 6008). Một giây sau truy vấn của app thất bại (ECONNREFUSED), nginx bắt đầu hết thời gian chờ lúc 07:05:15Z, app bỏ cuộc và thoát lúc 07:06:01Z, systemd khởi động lại nó lúc 07:06:07Z. Server Windows khởi động lại (sự kiện 12 lúc 07:07:28Z), PostgreSQL phục hồi và nhận kết nối lúc 07:08:23Z, app kết nối lại lúc 07:08:30Z (14:08:30 giờ Việt Nam) — khoảng bốn phút rưỡi gián đoạn.</li>
</ul>
<div class="pitfall co-tieu-de"><p><strong>"nginx là cửa chính, nên giờ của nó phải đúng."</strong> Một nguồn đáng tin không phải vì vị trí hay định dạng của nó; nó đáng tin vì đồng hồ của nó đúng. Luôn tìm một cặp sự kiện mà hai máy cùng thấy, và để các đồng hồ tự đối chất.</p></div>

<h3>Tiêu chí đạt</h3>
<div class="callout ok"><ol>
<li>20 dòng của bạn đúng thứ tự như đáp án (trừ các dòng trùng giây).</li>
<li>Bạn gọi tên được cả hai bẫy và chứng minh độ lệch 180 giây bằng một cặp sự kiện, không phải bằng đáp án.</li>
<li>Câu chuyện ba câu của bạn có thời điểm mất điện (07:04:12Z) và thời điểm hồi phục (07:08:30Z).</li>
</ol>
<p><strong>Đạt khi:</strong> đủ cả ba điểm — rồi thêm một trang "Lab 1" vào sổ, ghi luật đã dùng cho từng nguồn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['normalise (chuẩn hoá)', 'Đổi giá trị từ nhiều nguồn về một dạng chung (ở đây: UTC).'],
  ['timeline (dòng thời gian)', 'Mọi sự kiện của mọi nguồn xếp theo đúng thứ tự thời gian thật.'],
  ['anchor event (sự kiện mốc)', 'Một sự kiện được hai nguồn cùng ghi, dùng để so đồng hồ của chúng.'],
  ['clock offset (độ lệch đồng hồ)', 'Khoảng chênh cố định giữa đồng hồ một máy và giờ thật.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi nguồn cần một luật quy đổi riêng; ghi luật ngay cạnh kết quả.</li>
<li>Giờ địa phương không ghi múi giờ (error log nginx, bản xuất Event Viewer) là bẫy hay gặp nhất.</li>
<li>Chứng minh độ lệch đồng hồ bằng sự kiện mốc mà hai nguồn cùng thấy.</li>
<li>Một dòng thời gian tốt làm câu chuyện tự lộ ra: mất điện → mất CSDL → app lỗi → nginx báo lỗi → hồi phục.</li>
</ul>
${nguon('📘', 'RFC 3339 — Timestamps', 'Định dạng dùng cho mọi đáp án trong lab này', 'https://www.rfc-editor.org/rfc/rfc3339')}
${lienKet({ khoa: 'incident-response', bai: 'ir-0-8-bat-dau-tai-day', title: 'Incident Response — bắt đầu tại đây', sub: 'Dòng thời gian là xương sống của quy trình xử lý sự cố' })}
</div>
`,
};
