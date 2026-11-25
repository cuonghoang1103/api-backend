/**
 * 3.5 — Kích thước log, chính sách ghi đè, tệp .evtx (soạn 24/11/2026, agent lgz). Output thật: OUT['s03/kich-thuoc'] — bộ EVTX mẫu công khai (3.1), evtx-dau đọc tiêu đề tệp.
 * Số tất định: 4096 + n × 65536 byte; LiveId đầu 14/cuối 13 (đã quay vòng); RCM bản ghi kế #308335 nhưng chỉ còn 1795; security_big_sample 62 031 sự kiện / 30,1 MB / 31,9 giờ
 * ⇒ 1 947 sự kiện/giờ, ~508 byte/sự kiện, 20 MB ≈ 21,2 giờ; 5156 36 % + 5152 15 % + 5158 14 % + 5157 13 %; dirty: 14 495 DESKTOP-0QT8017 + 126 WIN-LL0C19JS506.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '3.5 — Log size, retention and overwrite policy, and where .evtx files live|||3.5 — Kích thước log, chính sách ghi đè, và tệp .evtx nằm ở đâu',
  slug: 'log-3-5-kich-thuoc-luu-tru',
  type: 'LESSON',
  isFreePreview: true,
  description: '%SystemRoot%\\System32\\winevt\\Logs; ba chế độ khi log đầy (Overwrite / Archive / Do not overwrite) và cách đặt bằng GUI, wevtutil sl, Group Policy; bên trong tệp .evtx (tiêu đề 4 KB, chunk 64 KB, cờ DIRTY, log đã quay vòng); đo thật một máy chủ: 20 MB Security chỉ giữ được ~21 giờ. Góc hacker: nhiễu và tràn log đẩy dấu vết ra ngoài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>How long does Windows remember? Often less than a day</h2>
<p class="lead">Each Windows log has a maximum size. When it is full, by default the oldest events are overwritten. Nobody notices — until the day someone asks "who logged on to this server last Tuesday?" and the answer is gone. This lesson shows where the files are, the three retention modes, what is inside an .evtx file, and measures on a real server how fast 20 MB fills up.</p>

<h3>The everyday picture: a dashcam</h3>
<p>A dashcam records on a small memory card in a loop: when the card is full, it records over the oldest clip. Great — until you need the clip from three days ago. Windows logs are dashcams. You choose: a bigger card (larger max size), keep old cards (archive), or stop recording when full (do not overwrite — and miss the accident).</p>

<h3>Where the files live, and how to see the settings</h3>
<pre><code class="language-powershell"># On Windows (administrator):
Get-ChildItem C:\\Windows\\System32\\winevt\\Logs | Sort-Object Length -Descending | Select-Object -First 8 Name,Length
Get-WinEvent -ListLog Application,Security,System | Format-Table LogName,MaximumSizeInBytes,LogMode,LogFilePath
wevtutil gl Security                       # logging: retention, autoBackup, maxSize
# GUI: right-click the log › Properties › "Maximum log size (KB)" + "When maximum event log size is reached"</code></pre>
<p>Default for Application, Security and System on current Windows is <strong>20 480 KB (20 MB)</strong> — the Windows Server 2025 machine of Lesson 11.3 showed exactly that. The three choices in Properties map to <code>LogMode</code> / wevtutil flags:</p>
<ul>
<li><strong>Overwrite events as needed (oldest events first)</strong> — <code>Circular</code>, <code>wevtutil sl &lt;log&gt; /rt:false</code>. The default. Never stops, forgets silently.</li>
<li><strong>Archive the log when full, do not overwrite events</strong> — <code>AutoBackup</code>, <code>/rt:true /ab:true</code>. When full, Windows renames the file to <code>Archive-&lt;Log&gt;-&lt;date-time&gt;.evtx</code> in the same folder and starts a new one. Keeps everything — until the disk fills.</li>
<li><strong>Do not overwrite events (Clear logs manually)</strong> — <code>Retain</code>, <code>/rt:true /ab:false</code>. When full, new events are <em>dropped</em>; for Security, event 1104 "The security log is now full". Only with an operator who clears it on time.</li>
</ul>
<pre><code class="language-powershell"># Set Security to 1 GB, overwrite as needed (on servers, enforce it with Group Policy:
# Computer Configuration › Administrative Templates › Windows Components › Event Log Service › Security)
wevtutil sl Security /ms:1073741824 /rt:false
Limit-EventLog -LogName Application -MaximumSize 256MB -OverflowAction OverwriteAsNeeded   # classic logs only</code></pre>

<h3>Inside an .evtx file</h3>
<p>The format is documented by the open-source <em>libevtx</em> project: a <strong>4 KB file header</strong>, then <strong>64 KB chunks</strong>, each holding many records. A tiny reader of the header:</p>
${ma('python', 's03/bin/evtx-dau')}
${lenh('s03/kich-thuoc', 0)}
${lenh('s03/kich-thuoc', 1)}
<p>What to read from this:</p>
<ul>
<li>Every file size is exactly <strong>4096 + n × 65 536</strong> bytes. A 69 632-byte file is "header + one chunk". The file grows chunk by chunk up to the maximum size, and the header's "chunks used" can be smaller than the chunks in the file (security.evtx: 26 used of 33) — preallocated space.</li>
<li><strong>"first 14, last 13"</strong> (LiveId) and <strong>"first 10, last 9"</strong> (RemoteConnectionManager): the newest chunk is <em>before</em> the oldest one — the log has wrapped around: Circular mode at work. The RDP log's next record number is <strong>#308 335</strong> but only <strong>1 795</strong> records are left in the file: more than 300 000 events were overwritten.</li>
<li><strong>DIRTY</strong> (flag 0x1): the file was copied while the Event Log service had it open, or the machine stopped without closing the log. Records at the end may be incomplete. <strong>FULL</strong> (0x2) would mean "Do not overwrite" and no space left.</li>
</ul>

<h3>How fast does 20 MB fill? Measured on a real server</h3>
${lenh('s03/kich-thuoc', 2)}
${lenh('s03/kich-thuoc', 3)}
<p><code>security_big_sample.evtx</code> comes from a real server (domain anonymised as example.co.jp) with Windows Filtering Platform auditing on: <strong>62 031 events in 31.9 hours</strong>, about 1 947 events/hour and ~508 bytes each. At the default 20 MB, the Security log of this server remembers <strong>about 21 hours</strong>. And 78 % of it is firewall connection noise (5156/5152/5158/5157); the logons you actually care about (4624, 6 %) are pushed out by noise. This is why Lesson 11.3 says "enable 5156/5157 briefly", and why central collection (Chapter 15) is not optional on servers.</p>

<h3>Damaged and dirty files</h3>
${lenh('s03/kich-thuoc', 4)}
${lenh('s03/kich-thuoc', 5)}
<p>Real-world files are not always clean: two sample files have unreadable chunks (zeroed space, a record cut in half). A good reader skips them and goes on; Event Viewer does the same and may show fewer events than the header promises. The dirty Security file also tells a small story: the PC was installed as <code>WIN-LL0C19JS506</code> (Windows setup's random name, 126 events), then renamed <code>DESKTOP-0QT8017</code>; 4616 (time changed) right after setup moves the clock backwards — record order and time order disagree for a moment. 1100 = event logging service shut down (clean shutdown), 4608 = Windows starting up.</p>

<h3>🛡️ Attacker's corner: you don't need to delete what is overwritten anyway</h3>
<p>Clearing a log leaves 1102/104 (Lesson 4.3). Flooding it does not: an attacker who generates tens of thousands of harmless events (failed connections, noisy audits) pushes their own logon out of a 20 MB circular log within hours. Defences: size logs for at least the retention you need (CIS benchmarks recommend Security ≥ 196 608 KB on servers), forward events off the machine in near real time, and alert on unusual event volume.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Where are event logs stored and what is the default size?" — winevt\\Logs, 20 MB for the main logs.</li>
<li>"What happens when the Security log is full?" — depends on retention: overwrite oldest (default), archive, or drop new events (1104).</li>
<li>"An incident happened 3 days ago but Security only has 18 hours. Why, and what do you do now?" — circular log overwritten by volume; check archives, forwarded copies/SIEM, other sources (firewall, VPN, application logs); then fix size + forwarding.</li>
</ul>

<h3>At work</h3>
<p>One of the first checks in a new customer environment: <code>Get-WinEvent -ListLog Security</code> on a few servers — size, mode, and the timestamp of the <em>oldest</em> event (<code>Get-WinEvent -LogName Security -Oldest -MaxEvents 1</code>). "Our Security log covers 19 hours" is a finding you can write in your first week.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your PC: for Application, Security, System — max size, mode, and the date of the oldest event. How many days does each cover?</li>
<li>Run <code>evtx-dau</code> (or read the header with a hex viewer) on a copy of your own System.evtx: is it DIRTY? Why?</li>
<li>Using the numbers of Step "how fast", what size would the server need to keep 90 days of Security events?</li>
</ol>
<p><strong>Pass:</strong> (1) three numbers per log + "oldest" dates; (2) a copy of a live log is usually DIRTY because the service had it open; (3) 1 947 × 24 × 90 × 508 B ≈ 2.1 GB — at that point, forward to a central store instead of growing the local file.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['winevt\\Logs', 'Folder holding the .evtx files (%SystemRoot%\\System32\\winevt\\Logs).'],
  ['Circular / AutoBackup / Retain', 'Overwrite oldest / archive when full / stop when full.'],
  ['Archive-&lt;Log&gt;-&lt;time&gt;.evtx', 'File created by AutoBackup when the log fills.'],
  ['Chunk', '64 KB block of records inside an .evtx file; header is 4 KB.'],
  ['DIRTY / FULL flag', 'Header flags: not cleanly closed / full in Retain mode.'],
  ['1104', 'Security log is full (Retain mode).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Default 20 MB + overwrite = often less than a day on a busy server. Measure your coverage.</li>
<li>Choose size and mode on purpose; enforce with Group Policy.</li>
<li>.evtx = 4 KB header + 64 KB chunks; wrapped chunks and DIRTY flags are normal clues.</li>
<li>Noise pushes evidence out; forward logs off the machine.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Eventlog key', 'MaxSize, Retention, AutoBackupLogFiles for classic logs', 'https://learn.microsoft.com/en-us/windows/win32/eventlog/eventlog-key')}
${nguon('📘', 'libevtx — Windows XML Event Log (EVTX) format', 'File header, chunks, flags (open-source documentation)', 'https://github.com/libyal/libevtx/blob/main/documentation/Windows%20XML%20Event%20Log%20(EVTX).asciidoc')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Lesson 11.3 — Windows Firewall logging', sub: 'Why 5156/5157 should only be enabled briefly', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Windows nhớ được bao lâu? Nhiều khi chưa tới một ngày</h2>
<p class="lead">Mỗi log của Windows có kích thước tối đa. Khi đầy, mặc định sự kiện cũ nhất bị ghi đè. Chẳng ai để ý — cho tới hôm có người hỏi "thứ Ba tuần trước ai đã đăng nhập máy chủ này?" và câu trả lời đã mất. Bài này chỉ chỗ các tệp nằm, ba chế độ giữ log, bên trong tệp .evtx có gì, và đo trên một máy chủ thật xem 20 MB đầy nhanh cỡ nào.</p>

<h3>Liên tưởng đời thường: camera hành trình</h3>
<p>Camera hành trình ghi vào một thẻ nhớ nhỏ theo vòng: thẻ đầy thì ghi đè đoạn cũ nhất. Rất tiện — cho tới khi bạn cần đoạn của ba hôm trước. Log Windows chính là camera hành trình. Bạn chọn: thẻ lớn hơn (tăng kích thước tối đa), cất thẻ cũ (lưu trữ), hoặc đầy thì ngừng ghi (không ghi đè — và lỡ mất vụ va chạm).</p>

<h3>Tệp nằm đâu, xem thiết lập thế nào</h3>
<pre><code class="language-powershell"># Trên Windows (quyền quản trị):
Get-ChildItem C:\\Windows\\System32\\winevt\\Logs | Sort-Object Length -Descending | Select-Object -First 8 Name,Length
Get-WinEvent -ListLog Application,Security,System | Format-Table LogName,MaximumSizeInBytes,LogMode,LogFilePath
wevtutil gl Security                       # logging: retention, autoBackup, maxSize
# Giao diện: chuột phải vào log › Properties › "Maximum log size (KB)" + "When maximum event log size is reached"</code></pre>
<p>Mặc định của Application, Security và System trên Windows hiện nay là <strong>20 480 KB (20 MB)</strong> — máy Windows Server 2025 ở Bài 11.3 cho thấy đúng như vậy. Ba lựa chọn trong Properties ứng với <code>LogMode</code> / cờ của wevtutil:</p>
<ul>
<li><strong>Overwrite events as needed (oldest events first)</strong> — <code>Circular</code>, <code>wevtutil sl &lt;log&gt; /rt:false</code>. Mặc định. Không bao giờ dừng, quên trong im lặng.</li>
<li><strong>Archive the log when full, do not overwrite events</strong> — <code>AutoBackup</code>, <code>/rt:true /ab:true</code>. Khi đầy, Windows đổi tên tệp thành <code>Archive-&lt;Log&gt;-&lt;ngày-giờ&gt;.evtx</code> trong cùng thư mục rồi bắt đầu tệp mới. Giữ được hết — cho tới khi ổ đĩa đầy.</li>
<li><strong>Do not overwrite events (Clear logs manually)</strong> — <code>Retain</code>, <code>/rt:true /ab:false</code>. Khi đầy, sự kiện mới bị <em>bỏ</em>; với Security có sự kiện 1104 "The security log is now full". Chỉ dùng khi có người vận hành dọn đúng hạn.</li>
</ul>
<pre><code class="language-powershell"># Đặt Security 1 GB, ghi đè khi cần (trên máy chủ, ép bằng Group Policy:
# Computer Configuration › Administrative Templates › Windows Components › Event Log Service › Security)
wevtutil sl Security /ms:1073741824 /rt:false
Limit-EventLog -LogName Application -MaximumSize 256MB -OverflowAction OverwriteAsNeeded   # chỉ log kiểu cũ</code></pre>

<h3>Bên trong một tệp .evtx</h3>
<p>Định dạng được dự án mã nguồn mở <em>libevtx</em> ghi lại: một <strong>tiêu đề tệp 4 KB</strong>, sau đó là các <strong>chunk 64 KB</strong>, mỗi chunk chứa nhiều bản ghi. Một bộ đọc tiêu đề nho nhỏ:</p>
${ma('python', 's03/bin/evtx-dau')}
${lenh('s03/kich-thuoc', 0)}
${lenh('s03/kich-thuoc', 1)}
<p>Đọc ra được gì:</p>
<ul>
<li>Kích thước mọi tệp đúng bằng <strong>4096 + n × 65 536</strong> byte. Tệp 69 632 byte là "tiêu đề + một chunk". Tệp lớn dần từng chunk cho tới kích thước tối đa, và số "chunk dùng" trong tiêu đề có thể nhỏ hơn số chunk trong tệp (security.evtx: dùng 26 trên 33) — chỗ đã cấp sẵn.</li>
<li><strong>"đầu 14, cuối 13"</strong> (LiveId) và <strong>"đầu 10, cuối 9"</strong> (RemoteConnectionManager): chunk mới nhất nằm <em>trước</em> chunk cũ nhất — log đã quay vòng: chế độ Circular đang làm việc. Số bản ghi kế tiếp của log RDP là <strong>#308 335</strong> nhưng trong tệp chỉ còn <strong>1 795</strong> bản ghi: hơn 300 000 sự kiện đã bị ghi đè.</li>
<li><strong>DIRTY</strong> (cờ 0x1): tệp được chép khi dịch vụ Event Log đang mở nó, hoặc máy dừng mà chưa đóng log. Vài bản ghi cuối có thể dở dang. <strong>FULL</strong> (0x2) nghĩa là chế độ "Do not overwrite" và hết chỗ.</li>
</ul>

<h3>20 MB đầy nhanh cỡ nào? Đo trên một máy chủ thật</h3>
${lenh('s03/kich-thuoc', 2)}
${lenh('s03/kich-thuoc', 3)}
<p><code>security_big_sample.evtx</code> lấy từ một máy chủ thật (tên miền đã được ẩn thành example.co.jp) có bật kiểm toán Windows Filtering Platform: <strong>62 031 sự kiện trong 31,9 giờ</strong>, khoảng 1 947 sự kiện/giờ và ~508 byte mỗi sự kiện. Với mặc định 20 MB, log Security của máy này chỉ nhớ được <strong>khoảng 21 giờ</strong>. Và 78 % trong đó là nhiễu kết nối tường lửa (5156/5152/5158/5157); những lần đăng nhập bạn thật sự quan tâm (4624, 6 %) bị nhiễu đẩy ra ngoài. Đó là lý do Bài 11.3 dặn "chỉ bật 5156/5157 trong thời gian ngắn", và lý do gom log tập trung (Chương 15) không phải tuỳ chọn trên máy chủ.</p>

<h3>Tệp hỏng và tệp "dirty"</h3>
${lenh('s03/kich-thuoc', 4)}
${lenh('s03/kich-thuoc', 5)}
<p>Tệp ngoài đời không phải lúc nào cũng sạch: hai tệp mẫu có chunk không đọc được (vùng toàn số 0, một bản ghi bị cắt đôi). Bộ đọc tốt sẽ bỏ qua và đọc tiếp; Event Viewer cũng vậy và có thể hiện ít sự kiện hơn tiêu đề hứa. Tệp Security dirty còn kể một câu chuyện nhỏ: máy được cài với tên <code>WIN-LL0C19JS506</code> (tên ngẫu nhiên lúc cài Windows, 126 sự kiện), rồi đổi thành <code>DESKTOP-0QT8017</code>; 4616 (đổi giờ) ngay sau khi cài kéo đồng hồ lùi lại — thứ tự bản ghi và thứ tự thời gian lệch nhau một lúc. 1100 = dịch vụ ghi sự kiện tắt (tắt máy sạch), 4608 = Windows đang khởi động.</p>

<h3>🛡️ Góc hacker: chẳng cần xoá thứ đằng nào cũng bị ghi đè</h3>
<p>Xoá log thì để lại 1102/104 (Bài 4.3). Làm tràn log thì không: kẻ tấn công sinh vài chục nghìn sự kiện vô hại (kết nối hỏng, kiểm toán ồn ào) là đẩy được lần đăng nhập của chính mình ra khỏi log vòng 20 MB trong vài giờ. Phòng thủ: đặt kích thước đủ cho thời gian cần giữ (bộ chuẩn CIS khuyến nghị Security ≥ 196 608 KB trên máy chủ), chuyển sự kiện ra khỏi máy gần như tức thời, và cảnh báo khi lưu lượng sự kiện bất thường.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Log sự kiện lưu ở đâu, mặc định bao lớn?" — winevt\\Logs, 20 MB với các log chính.</li>
<li>"Log Security đầy thì sao?" — tuỳ chế độ: ghi đè cái cũ (mặc định), lưu trữ, hoặc bỏ sự kiện mới (1104).</li>
<li>"Sự cố xảy ra 3 ngày trước mà Security chỉ có 18 giờ. Vì sao, giờ làm gì?" — log vòng bị lượng sự kiện ghi đè; tìm bản lưu trữ, bản đã chuyển đi/SIEM, nguồn khác (tường lửa, VPN, log ứng dụng); rồi sửa kích thước + chuyển log.</li>
</ul>

<h3>Đi làm thật</h3>
<p>Một trong những việc kiểm đầu tiên ở môi trường khách mới: chạy <code>Get-WinEvent -ListLog Security</code> trên vài máy chủ — kích thước, chế độ, và thời điểm của sự kiện <em>cũ nhất</em> (<code>Get-WinEvent -LogName Security -Oldest -MaxEvents 1</code>). "Log Security của chúng ta chỉ phủ 19 giờ" là một phát hiện bạn viết được ngay tuần đầu.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy bạn: với Application, Security, System — kích thước tối đa, chế độ, và ngày của sự kiện cũ nhất. Mỗi log phủ bao nhiêu ngày?</li>
<li>Chạy <code>evtx-dau</code> (hoặc xem tiêu đề bằng trình xem hex) trên bản chép tệp System.evtx của chính bạn: có DIRTY không? Vì sao?</li>
<li>Dùng số đo ở bước "đầy nhanh cỡ nào", máy chủ đó cần kích thước bao nhiêu để giữ 90 ngày sự kiện Security?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) mỗi log có ba con số + ngày "cũ nhất"; (2) bản chép của log đang chạy thường DIRTY vì dịch vụ đang mở nó; (3) 1 947 × 24 × 90 × 508 B ≈ 2,1 GB — tới mức đó hãy chuyển về kho tập trung thay vì phình tệp cục bộ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['winevt\\Logs', 'Thư mục chứa các tệp .evtx (%SystemRoot%\\System32\\winevt\\Logs).'],
  ['Circular / AutoBackup / Retain', 'Ghi đè cái cũ / lưu trữ khi đầy / ngừng khi đầy.'],
  ['Archive-&lt;Log&gt;-&lt;giờ&gt;.evtx', 'Tệp AutoBackup tạo ra khi log đầy.'],
  ['Chunk', 'Khối 64 KB chứa bản ghi trong tệp .evtx; tiêu đề 4 KB.'],
  ['Cờ DIRTY / FULL', 'Cờ tiêu đề: chưa đóng sạch / đầy ở chế độ Retain.'],
  ['1104', 'Log Security đã đầy (chế độ Retain).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định 20 MB + ghi đè = nhiều khi chưa tới một ngày trên máy chủ bận. Hãy đo độ phủ.</li>
<li>Chọn kích thước và chế độ có chủ đích; ép bằng Group Policy.</li>
<li>.evtx = tiêu đề 4 KB + chunk 64 KB; chunk quay vòng và cờ DIRTY là manh mối bình thường.</li>
<li>Nhiễu đẩy bằng chứng ra ngoài; chuyển log ra khỏi máy.</li>
</ul>
${nguon('📘', 'Microsoft Learn — Eventlog key', 'MaxSize, Retention, AutoBackupLogFiles của log kiểu cũ', 'https://learn.microsoft.com/en-us/windows/win32/eventlog/eventlog-key')}
${nguon('📘', 'libevtx — định dạng Windows XML Event Log (EVTX)', 'Tiêu đề tệp, chunk, cờ (tài liệu mã nguồn mở)', 'https://github.com/libyal/libevtx/blob/main/documentation/Windows%20XML%20Event%20Log%20(EVTX).asciidoc')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-11-3-firewall-windows', title: 'Bài 11.3 — Ghi log tường lửa Windows', sub: 'Vì sao chỉ nên bật 5156/5157 trong thời gian ngắn', cta: 'Mở bài' })}
</div>
`,
};
