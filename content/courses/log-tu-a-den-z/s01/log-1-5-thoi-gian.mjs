/**
 * 1.5 — Thời gian là trường khó nhất (soạn 22/11/2026).
 * Output: OUT['s01/thoi-gian'] (GNU date + jq, Ubuntu 24.04, TZ=Asia/Ho_Chi_Minh) và OUT['s01/thoi-gian.ps'] (PowerShell 7.7, Linux arm64).
 * Nguồn: RFC 3339; nginx ngx_http_log_module ($time_local, $time_iso8601); PostgreSQL log_timezone; Microsoft Learn (w32tm,
 * sự kiện 4616); chrony docs (chronyc tracking); man journalctl (--utc).
 * Không trùng: wf-15-5-dates-timezones (múi giờ trong code JS), postgresql-2-3 (kiểu ngày giờ trong CSDL).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '1.5 — Time is the hardest field: UTC, time zones, ISO 8601/RFC 3339, epoch, clock drift and NTP|||1.5 — Thời gian là trường khó nhất: UTC, múi giờ, ISO 8601/RFC 3339, epoch, lệch đồng hồ và NTP',
  slug: 'log-1-5-thoi-gian',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mọi mốc giờ trong log quy về UTC trước khi so: Event Viewer hiện giờ máy dù EVTX lưu UTC, nginx $time_local vs $time_iso8601, PostgreSQL log_timezone, journalctl --utc; đổi epoch giây/mili giây bằng date, jq, PowerShell (bẫy 1000 lần ra năm 58856); bẫy date -u -d coi chuỗi không múi giờ là UTC; bẫy tháng/ngày kiểu Mỹ; lệch đồng hồ làm sai dòng thời gian — kiểm bằng w32tm, timedatectl, chronyc; góc hacker: đổi giờ hệ thống (Windows 4616) và timestomping.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Time is the hardest field: get it right before you compare anything</h2>
<p class="lead">An investigation is a story told in time order. If one source prints local time without saying so, another prints UTC, a third prints a number of milliseconds, and a fourth runs on a clock that is three minutes fast, the story you build is wrong — and it looks right. This lesson teaches the four rules that keep timelines honest, with real conversions on the incident files from the sample pack.</p>

<h3>The everyday picture: a group call across countries</h3>
<p>Your group has a member studying in Japan. "Meet at 8" — whose 8? Everyone has learned to say "8 p.m. Vietnam time". Logs need the same discipline, except the "people" are machines that never explain themselves. The standard answer in every operations team: <strong>convert everything to UTC</strong>, the one clock with no daylight saving and no politics, and only convert back to local time when you present to a person.</p>

<h3>Rule 1 — know what each source writes</h3>
<table>
<thead><tr><th>Source</th><th>What it stores</th><th>What you see</th><th>How to get UTC</th></tr></thead>
<tbody>
<tr><td>Windows Event Log</td><td>UTC (<code>SystemTime="…Z"</code> in the XML)</td><td>Event Viewer and CSV exports show <strong>the viewing PC's local time</strong>, no zone</td><td>Look at the XML view, or convert with the PC's zone</td></tr>
<tr><td>systemd journal</td><td>Microseconds since epoch (UTC)</td><td>Local time of the machine reading it</td><td><code>journalctl --utc</code>, or <code>-o short-iso</code> to at least see the offset</td></tr>
<tr><td>nginx access log</td><td>Text</td><td><code>$time_local</code> = <code>20/Nov/2026:14:05:31 +0700</code> (with offset)</td><td>Use the offset; or configure <code>$time_iso8601</code></td></tr>
<tr><td>nginx error log</td><td>Text</td><td><code>2026/11/20 14:05:15</code> — server local time, <strong>no offset</strong></td><td>You must know the server's zone</td></tr>
<tr><td>PostgreSQL</td><td>Text</td><td>Whatever <code>log_timezone</code> says (<code>UTC</code> in the pack)</td><td>Read the zone name printed in each line</td></tr>
<tr><td>JSON app logs</td><td>Often epoch milliseconds or ISO 8601 with <code>Z</code></td><td>A number like <code>1795158253088</code></td><td>Convert the epoch (Step 2)</td></tr>
<tr><td>RFC 3164 syslog</td><td>Text, no year, no zone</td><td><code>Nov 20 02:10:03</code></td><td>Assume the host's zone and the current year — and write the assumption down</td></tr>
</tbody></table>

<h3>Rule 2 — convert epochs carefully (seconds or milliseconds?)</h3>
<p>An epoch is a count from 1970-01-01 00:00:00 UTC. Ten digits ≈ seconds; thirteen digits = milliseconds. Feed milliseconds to a tool that expects seconds and you land 56,000 years in the future:</p>
${lenh('s01/thoi-gian', 0)}
${lenh('s01/thoi-gian', 1)}
${lenh('s01/thoi-gian', 9)}
${lenh('s01/thoi-gian', 2)}
<p><code>-u</code> prints UTC; without it <code>date</code> prints the machine's zone (<code>+07</code>). Same instant, two clocks — and in New York it was still 02:04 in the morning:</p>
${lenh('s01/thoi-gian', 8)}
<p><code>jq</code> can convert the whole app log at once (it wants seconds, hence <code>/ 1000 | floor</code>):</p>
${lenh('s01/thoi-gian', 6)}
<p>And back again, from a human time to an epoch, so you can compare numbers:</p>
${lenh('s01/thoi-gian', 7)}
<p>PowerShell does the same with <code>DateTimeOffset</code> (output from PowerShell 7):</p>
${lenh('s01/thoi-gian.ps', 0)}
${lenh('s01/thoi-gian.ps', 1)}

<h3>Rule 3 — never let a tool guess the zone</h3>
<p>This trap catches experienced people. With <code>-u</code>, GNU <code>date</code> reads a time <em>without</em> a zone as UTC too — so a local nginx error-log time comes out unchanged and wrong:</p>
${lenh('s01/thoi-gian', 10)}
${lenh('s01/thoi-gian', 11)}
${lenh('s01/thoi-gian', 12)}
<p>Correct answers need the zone stated: either an offset in the string (<code>+0700</code>, see below) or <code>TZ="Asia/Ho_Chi_Minh"</code> inside the date string. The same is true of US-style Windows exports — <code>11/20/2026 2:07:30 PM</code> is the 20th of November only if you read it month-first:</p>
${lenh('s01/thoi-gian', 3)}
${lenh('s01/thoi-gian', 4)}
${lenh('s01/thoi-gian.ps', 2)}
${lenh('s01/thoi-gian.ps', 3)}
${lenh('s01/thoi-gian.ps', 4)}
<p>Three lessons in the PowerShell output: a parsed time has <code>Kind = Unspecified</code> (PowerShell does not know the zone either); converting needs an explicit zone (on older Windows the id is <code>SE Asia Standard Time</code> rather than <code>Asia/Ho_Chi_Minh</code>); and the same string under Vietnamese culture (day/month) is not a valid date at all — "11/20" has no month 20. Had the day been 05, it would silently have become the 11th of May.</p>
<div class="callout warn"><p><strong>Write times in ISO 8601 / RFC 3339 in your notes:</strong> <code>2026-11-20T07:05:15Z</code> or <code>2026-11-20T14:05:15+07:00</code>. Year-month-day, 24-hour clock, explicit zone — impossible to misread, and it sorts correctly as text.</p></div>

<h3>Rule 4 — clocks drift; check them before you trust them</h3>
<p>Every machine keeps time with a crystal that runs slightly fast or slow. NTP (Network Time Protocol) corrects it continuously — if it works. A machine whose time service is broken can be minutes off after a few weeks, and its logs will place events in the wrong order relative to other machines. In the pack, nginx on <code>proxy-01</code> says connections to the API were refused at 14:09:02 — yet the API's own journal on <code>api-01</code> shows the service was down only between 14:06:02 and 14:06:07. Once you know proxy-01's clock was 180 seconds fast, the two agree to the second:</p>
${lenh('s01/thoi-gian', 5)}
<table>
<thead><tr><th>System</th><th>Check the clock and its sync</th><th>Look for</th></tr></thead>
<tbody>
<tr><td>Windows</td><td><code>w32tm /query /status</code></td><td><code>Source:</code> (a real server, not "Local CMOS Clock"), <code>Last Successful Sync Time</code></td></tr>
<tr><td>Linux (systemd)</td><td><code>timedatectl</code></td><td><code>System clock synchronized: yes</code>, <code>NTP service: active</code></td></tr>
<tr><td>Linux (chrony)</td><td><code>chronyc tracking</code></td><td><code>System time</code> offset, <code>Leap status: Normal</code></td></tr>
<tr><td>macOS</td><td><code>sntp time.apple.com</code></td><td>The offset printed</td></tr>
</tbody></table>
<p>How do you detect drift <em>after the fact</em>, when you only have logs? Find an event that two machines both recorded — one request seen by nginx and by the app, one connection seen by both ends — and compare their times. A constant gap is a clock offset.</p>

<h3>🕵️ Hacker's corner — changing time to hide</h3>
<ul>
<li><strong>Changing the system time</strong> makes new log entries appear in the past or future, breaking timelines. Windows records it as event <strong>4616</strong> ("The system time was changed") in the Security log, with the old and new time and the process responsible. Normal time sync also creates 4616, so check which process did it.</li>
<li><strong>Timestomping</strong>: attackers change the "modified" date of their files to blend in with system files. File times are therefore weaker evidence than log entries recorded centrally.</li>
<li><strong>Defence:</strong> keep NTP healthy everywhere, alert on large time changes, and ship logs to a central server that stamps its own receive time — a second clock the attacker does not control.</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Convert by command: <code>1795158331</code> (seconds) and <code>1795158390015</code> (milliseconds) to UTC in ISO 8601. Then convert <code>2026/11/20 14:06:05</code> (nginx error log, server in Vietnam) to UTC the <em>correct</em> way.</li>
<li>Check the clock of your own machine with the command for your system from Rule 4. Write the time source and whether it is synchronised.</li>
<li>In the pack, run <code>jq -r '.time' incident/app.jsonl</code>, convert the last value, and compare it with the PostgreSQL line "ready to accept connections". How many seconds after the database was ready did the app reconnect?</li>
</ol>
<p><strong>Done when:</strong> you got <code>2026-11-20T07:05:31Z</code>, <code>2026-11-20T07:06:30Z</code> and <code>2026-11-20T07:06:05Z</code>, wrote your machine's time source, and found about 7 seconds (07:08:23 → 07:08:30).</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['UTC', 'Coordinated Universal Time — the reference clock with no time zone offset.'],
  ['offset', 'The difference from UTC written in a time, like +07:00.'],
  ['ISO 8601 / RFC 3339', 'The year-month-dayThh:mm:ss±offset format for unambiguous times.'],
  ['epoch', 'Seconds (or milliseconds) since 1970-01-01T00:00:00Z.'],
  ['clock drift', 'A clock slowly running fast or slow.'],
  ['NTP', 'Network Time Protocol — keeps clocks synchronised over the network.'],
  ['timestomping', 'Changing file timestamps to hide activity.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Convert every timestamp to UTC before comparing; convert back to local only for people.</li>
<li>Know each source: Windows stores UTC but shows local; nginx error log has no offset; PostgreSQL follows <code>log_timezone</code>.</li>
<li>Ten-digit epochs are seconds, thirteen-digit ones are milliseconds — divide by 1000 or land in year 58856.</li>
<li>Never let a tool guess a zone: <code>date -u -d</code> treats zone-less input as UTC; US exports are month-first.</li>
<li>Check clocks (<code>w32tm</code>, <code>timedatectl</code>, <code>chronyc</code>) and detect drift by comparing one event seen by two machines.</li>
</ul>
${nguon('📘', 'RFC 3339 — Date and Time on the Internet: Timestamps', 'The profile of ISO 8601 used by syslog, JSON logs and APIs', 'https://www.rfc-editor.org/rfc/rfc3339')}
${nguon('📘', 'nginx — ngx_http_log_module', '$time_local and $time_iso8601 in access logs', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${nguon('📘', 'PostgreSQL — log_timezone', 'Which zone the server log uses', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📘', 'Microsoft Learn — Windows Time service tools (w32tm)', 'Checking time source and synchronisation on Windows', 'https://learn.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings')}
${nguon('📘', 'chrony — chronyc tracking', 'Reading the offset and sync state on Linux', 'https://chrony-project.org/doc/4.6/chronyc.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-15-5-dates-timezones', title: 'Web Foundations 15.5 — dates and time zones', sub: 'The same problem inside JavaScript code', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Thời gian là trường khó nhất: làm đúng nó trước khi so sánh bất cứ thứ gì</h2>
<p class="lead">Một cuộc điều tra là một câu chuyện kể theo thứ tự thời gian. Nếu một nguồn in giờ địa phương mà không nói, nguồn khác in UTC, nguồn thứ ba in một con số mili giây, còn nguồn thứ tư chạy trên một đồng hồ nhanh ba phút, thì câu chuyện bạn dựng sẽ sai — mà trông vẫn đúng. Bài này dạy bốn luật giữ cho dòng thời gian trung thực, với các phép đổi chạy thật trên tệp sự cố của gói log mẫu.</p>

<h3>Liên tưởng đời thường: một cuộc gọi nhóm qua nhiều nước</h3>
<p>Nhóm bạn có một thành viên đang du học Nhật. "Họp lúc 8 giờ" — 8 giờ của ai? Ai cũng đã quen nói "8 giờ tối giờ Việt Nam". Log cần đúng kỷ luật đó, có điều "người" ở đây là những cỗ máy không bao giờ tự giải thích. Câu trả lời chuẩn của mọi đội vận hành: <strong>đổi hết về UTC</strong> — chiếc đồng hồ duy nhất không có giờ mùa hè, không có chuyện chính trị — và chỉ đổi lại giờ địa phương khi trình bày cho người đọc.</p>

<h3>Luật 1 — biết mỗi nguồn ghi gì</h3>
<table>
<thead><tr><th>Nguồn</th><th>Lưu gì</th><th>Bạn nhìn thấy gì</th><th>Lấy UTC bằng cách nào</th></tr></thead>
<tbody>
<tr><td>Windows Event Log</td><td>UTC (<code>SystemTime="…Z"</code> trong XML)</td><td>Event Viewer và bản xuất CSV hiện <strong>giờ địa phương của máy đang xem</strong>, không ghi múi giờ</td><td>Xem tab XML, hoặc đổi theo múi giờ của máy</td></tr>
<tr><td>Journal của systemd</td><td>Số micro giây kể từ epoch (UTC)</td><td>Giờ địa phương của máy đang đọc</td><td><code>journalctl --utc</code>, hoặc <code>-o short-iso</code> để ít nhất thấy độ lệch</td></tr>
<tr><td>Access log của nginx</td><td>Chữ</td><td><code>$time_local</code> = <code>20/Nov/2026:14:05:31 +0700</code> (có độ lệch)</td><td>Dùng độ lệch; hoặc cấu hình <code>$time_iso8601</code></td></tr>
<tr><td>Error log của nginx</td><td>Chữ</td><td><code>2026/11/20 14:05:15</code> — giờ địa phương của server, <strong>không có độ lệch</strong></td><td>Phải tự biết múi giờ của server</td></tr>
<tr><td>PostgreSQL</td><td>Chữ</td><td>Theo tham số <code>log_timezone</code> (gói mẫu là <code>UTC</code>)</td><td>Đọc tên múi giờ in trong mỗi dòng</td></tr>
<tr><td>Log JSON của app</td><td>Hay là epoch mili giây hoặc ISO 8601 có <code>Z</code></td><td>Một con số như <code>1795158253088</code></td><td>Đổi epoch (Luật 2)</td></tr>
<tr><td>Syslog RFC 3164</td><td>Chữ, không năm, không múi giờ</td><td><code>Nov 20 02:10:03</code></td><td>Giả định múi giờ của máy và năm hiện tại — và ghi rõ giả định đó ra</td></tr>
</tbody></table>

<h3>Luật 2 — đổi epoch cẩn thận (giây hay mili giây?)</h3>
<p>Epoch là số đếm từ 1970-01-01 00:00:00 UTC. Mười chữ số ≈ giây; mười ba chữ số = mili giây. Đưa mili giây cho công cụ chờ giây là bạn rơi xuống tương lai 56.000 năm sau:</p>
${lenh('s01/thoi-gian', 0)}
${lenh('s01/thoi-gian', 1)}
${lenh('s01/thoi-gian', 9)}
${lenh('s01/thoi-gian', 2)}
<p><code>-u</code> in theo UTC; bỏ nó đi thì <code>date</code> in theo múi giờ của máy (<code>+07</code>). Cùng một khoảnh khắc, hai đồng hồ — còn ở New York lúc đó mới 02:04 sáng:</p>
${lenh('s01/thoi-gian', 8)}
<p><code>jq</code> đổi được cả tệp log của app một lượt (nó cần giây, nên mới có <code>/ 1000 | floor</code>):</p>
${lenh('s01/thoi-gian', 6)}
<p>Và chiều ngược lại, từ giờ người đọc sang epoch, để so bằng con số:</p>
${lenh('s01/thoi-gian', 7)}
<p>PowerShell làm y như vậy với <code>DateTimeOffset</code> (output từ PowerShell 7):</p>
${lenh('s01/thoi-gian.ps', 0)}
${lenh('s01/thoi-gian.ps', 1)}

<h3>Luật 3 — đừng bao giờ để công cụ đoán múi giờ</h3>
<p>Cái bẫy này bắt cả người có kinh nghiệm. Với <code>-u</code>, <code>date</code> của GNU đọc một thời điểm <em>không có</em> múi giờ cũng là UTC — nên giờ địa phương trong error log của nginx đi ra không đổi, và sai:</p>
${lenh('s01/thoi-gian', 10)}
${lenh('s01/thoi-gian', 11)}
${lenh('s01/thoi-gian', 12)}
<p>Muốn đúng phải nói rõ múi giờ: hoặc độ lệch trong chuỗi (<code>+0700</code>, xem dưới), hoặc <code>TZ="Asia/Ho_Chi_Minh"</code> ngay trong chuỗi ngày giờ. Bản xuất Windows kiểu Mỹ cũng thế — <code>11/20/2026 2:07:30 PM</code> chỉ là ngày 20 tháng 11 khi bạn đọc tháng trước:</p>
${lenh('s01/thoi-gian', 3)}
${lenh('s01/thoi-gian', 4)}
${lenh('s01/thoi-gian.ps', 2)}
${lenh('s01/thoi-gian.ps', 3)}
${lenh('s01/thoi-gian.ps', 4)}
<p>Ba bài học trong output của PowerShell: thời điểm vừa đọc có <code>Kind = Unspecified</code> (PowerShell cũng không biết múi giờ); muốn đổi phải đưa múi giờ rõ ràng (trên Windows đời cũ, mã múi giờ là <code>SE Asia Standard Time</code> chứ không phải <code>Asia/Ho_Chi_Minh</code>); và cùng chuỗi đó theo văn hoá Việt Nam (ngày/tháng) thì chẳng phải ngày hợp lệ — "11/20" làm gì có tháng 20. Giá mà ngày là 05, nó đã lặng lẽ thành ngày 11 tháng 5.</p>
<div class="callout warn"><p><strong>Ghi thời gian trong sổ theo ISO 8601 / RFC 3339:</strong> <code>2026-11-20T07:05:15Z</code> hoặc <code>2026-11-20T14:05:15+07:00</code>. Năm-tháng-ngày, đồng hồ 24 giờ, múi giờ rõ ràng — không thể đọc nhầm, và sắp xếp theo chữ cũng ra đúng thứ tự.</p></div>

<h3>Luật 4 — đồng hồ bị lệch; kiểm trước khi tin</h3>
<p>Máy nào cũng giữ giờ bằng một tinh thể thạch anh chạy hơi nhanh hoặc hơi chậm. NTP (giao thức đồng bộ thời gian qua mạng) liên tục chỉnh lại — nếu nó hoạt động. Một máy hỏng dịch vụ đồng bộ giờ có thể lệch vài phút sau vài tuần, và log của nó sẽ xếp sự kiện sai thứ tự so với các máy khác. Trong gói mẫu, nginx trên <code>proxy-01</code> báo kết nối tới API bị từ chối lúc 14:09:02 — vậy mà journal của chính API trên <code>api-01</code> cho thấy dịch vụ chỉ chết trong khoảng 14:06:02 tới 14:06:07. Một khi biết đồng hồ proxy-01 nhanh 180 giây, hai nguồn khớp nhau tới từng giây:</p>
${lenh('s01/thoi-gian', 5)}
<table>
<thead><tr><th>Hệ thống</th><th>Kiểm đồng hồ và trạng thái đồng bộ</th><th>Tìm gì</th></tr></thead>
<tbody>
<tr><td>Windows</td><td><code>w32tm /query /status</code></td><td><code>Source:</code> (một server thật, không phải "Local CMOS Clock"), <code>Last Successful Sync Time</code></td></tr>
<tr><td>Linux (systemd)</td><td><code>timedatectl</code></td><td><code>System clock synchronized: yes</code>, <code>NTP service: active</code></td></tr>
<tr><td>Linux (chrony)</td><td><code>chronyc tracking</code></td><td>Độ lệch <code>System time</code>, <code>Leap status: Normal</code></td></tr>
<tr><td>macOS</td><td><code>sntp time.apple.com</code></td><td>Độ lệch được in ra</td></tr>
</tbody></table>
<p>Phát hiện lệch giờ <em>sau khi sự việc đã xảy ra</em>, khi chỉ còn log, bằng cách nào? Tìm một sự kiện mà hai máy cùng ghi — một request mà cả nginx lẫn app đều thấy, một kết nối mà hai đầu đều ghi — rồi so giờ. Khoảng chênh cố định chính là độ lệch đồng hồ.</p>

<h3>🕵️ Góc hacker — đổi giờ để ẩn mình</h3>
<ul>
<li><strong>Đổi giờ hệ thống</strong> làm bản ghi mới hiện ra như ở quá khứ hay tương lai, phá dòng thời gian. Windows ghi việc này thành sự kiện <strong>4616</strong> ("The system time was changed") trong nhật ký Security, kèm giờ cũ, giờ mới và tiến trình gây ra. Đồng bộ giờ bình thường cũng tạo 4616, nên hãy xem tiến trình nào đã làm.</li>
<li><strong>Timestomping (sửa dấu thời gian tệp)</strong>: kẻ tấn công đổi ngày "sửa lần cuối" của tệp chúng mang vào cho lẫn với tệp hệ thống. Vì thế giờ của tệp là bằng chứng yếu hơn bản ghi log được gom tập trung.</li>
<li><strong>Phòng thủ:</strong> giữ NTP khoẻ ở mọi máy, cảnh báo khi giờ bị đổi lớn, và đẩy log về một server trung tâm có đóng dấu giờ nhận của chính nó — một chiếc đồng hồ thứ hai mà kẻ tấn công không điều khiển được.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Đổi bằng lệnh: <code>1795158331</code> (giây) và <code>1795158390015</code> (mili giây) sang UTC theo ISO 8601. Rồi đổi <code>2026/11/20 14:06:05</code> (error log nginx, server ở Việt Nam) sang UTC theo cách <em>đúng</em>.</li>
<li>Kiểm đồng hồ máy bạn bằng lệnh của hệ thống mình ở Luật 4. Ghi nguồn giờ và có đang đồng bộ không.</li>
<li>Trong gói mẫu, chạy <code>jq -r '.time' incident/app.jsonl</code>, đổi giá trị cuối cùng, rồi so với dòng PostgreSQL "ready to accept connections". App kết nối lại sau khi CSDL sẵn sàng bao nhiêu giây?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn ra <code>2026-11-20T07:05:31Z</code>, <code>2026-11-20T07:06:30Z</code> và <code>2026-11-20T07:06:05Z</code>, đã ghi nguồn giờ của máy mình, và tìm ra khoảng 7 giây (07:08:23 → 07:08:30).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['UTC (giờ phối hợp quốc tế)', 'Đồng hồ chuẩn không có độ lệch múi giờ.'],
  ['offset (độ lệch)', 'Khoảng chênh so với UTC ghi trong thời điểm, như +07:00.'],
  ['ISO 8601 / RFC 3339', 'Định dạng năm-tháng-ngàyThh:mm:ss±độ lệch, không thể hiểu nhầm.'],
  ['epoch', 'Số giây (hoặc mili giây) kể từ 1970-01-01T00:00:00Z.'],
  ['clock drift (lệch đồng hồ)', 'Đồng hồ chạy nhanh hay chậm dần.'],
  ['NTP', 'Network Time Protocol — giữ đồng hồ đồng bộ qua mạng.'],
  ['timestomping', 'Sửa dấu thời gian của tệp để che giấu hoạt động.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đổi mọi mốc giờ về UTC trước khi so; chỉ đổi lại giờ địa phương khi trình bày cho người.</li>
<li>Biết từng nguồn: Windows lưu UTC nhưng hiện giờ máy; error log nginx không có độ lệch; PostgreSQL theo <code>log_timezone</code>.</li>
<li>Epoch mười chữ số là giây, mười ba chữ số là mili giây — chia 1000 nếu không muốn tới năm 58856.</li>
<li>Đừng để công cụ đoán múi giờ: <code>date -u -d</code> coi chuỗi không múi giờ là UTC; bản xuất kiểu Mỹ đọc tháng trước.</li>
<li>Kiểm đồng hồ (<code>w32tm</code>, <code>timedatectl</code>, <code>chronyc</code>) và phát hiện lệch bằng cách so một sự kiện mà hai máy cùng thấy.</li>
</ul>
${nguon('📘', 'RFC 3339 — Date and Time on the Internet: Timestamps', 'Hồ sơ ISO 8601 mà syslog, log JSON và API dùng', 'https://www.rfc-editor.org/rfc/rfc3339')}
${nguon('📘', 'nginx — ngx_http_log_module', '$time_local và $time_iso8601 trong access log', 'https://nginx.org/en/docs/http/ngx_http_log_module.html')}
${nguon('📘', 'PostgreSQL — log_timezone', 'Log của server dùng múi giờ nào', 'https://www.postgresql.org/docs/current/runtime-config-logging.html')}
${nguon('📘', 'Microsoft Learn — công cụ Windows Time (w32tm)', 'Kiểm nguồn giờ và trạng thái đồng bộ trên Windows', 'https://learn.microsoft.com/en-us/windows-server/networking/windows-time-service/windows-time-service-tools-and-settings')}
${nguon('📘', 'chrony — chronyc tracking', 'Đọc độ lệch và trạng thái đồng bộ trên Linux', 'https://chrony-project.org/doc/4.6/chronyc.html')}
${lienKet({ khoa: 'web-foundations', bai: 'wf-15-5-dates-timezones', title: 'Web Foundations 15.5 — ngày giờ và múi giờ', sub: 'Cùng vấn đề này bên trong mã JavaScript' })}
</div>
`,
};
