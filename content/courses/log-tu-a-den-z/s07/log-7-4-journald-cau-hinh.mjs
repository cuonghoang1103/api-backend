/**
 * 7.4 — Cấu hình journald (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s07/cauhinh'], OUT['s07/gioi-toc'], OUT['s07/niem-phong'], OUT['s07/mat-lich-su'], OUT['s07/nhan'] (lệnh 5) — máy ảo lab7, systemd 255.
 * Nguồn: man journald.conf(5) (SystemMaxUse 10 %/SystemKeepFree 15 %, trần 4G; RateLimit 10000/30 s mỗi dịch vụ, nhân theo dung lượng trống;
 * Seal=), systemd.exec(5) (LogRateLimitIntervalSec=/LogRateLimitBurst=), LWN "Forward secure sealing" (2012), MITRE ATT&CK T1070.002.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '7.4 — journald.conf: SystemMaxUse, MaxRetentionSec, RateLimit, ForwardToSyslog; vacuum, disk usage, verify, sealing|||7.4 — journald.conf: SystemMaxUse, MaxRetentionSec, RateLimit, ForwardToSyslog; vacuum, dung lượng, verify, niêm phong',
  slug: 'log-7-4-journald-cau-hinh',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc dòng journald tự báo dung lượng và trần mặc định (10 % / 15 % / 4G), xem cấu hình thật bằng systemd-analyze cat-config, sửa bằng drop-in; thí nghiệm giới hạn tốc độ: 30 000 dòng thì giữ đúng 10 000 và báo "Suppressed 20000 messages", đặt riêng LogRateLimitBurst cho một unit; --rotate, --vacuum-size/--vacuum-time; cái giá của trần nhỏ — lịch sử các lần khởi động cũ biến mất; --verify, niêm phong Forward Secure Sealing và một byte bị sửa bị bắt quả tang; góc hacker: kẻ xấu xoá journal để lại dấu vết gì (T1070.002).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>journald.conf: how much to keep, how fast to accept, and how to know nobody edited it</h2>
<p class="lead">Default journald settings are reasonable for a laptop and surprising on a server: history silently shrinks, a noisy app can make the important lines vanish, and nothing stops root from editing the past. This lesson reads the real limits on lab7, changes them the right way, floods the journal on purpose, and seals it.</p>

<h3>The everyday picture: a CCTV recorder</h3>
<p>A shop's camera recorder has a disk of fixed size. When it is full, the oldest video is overwritten. If you set it to keep only 3 days, a theft discovered on day 5 has no footage. If a camera is pointed at a flickering light, it fills the disk with junk and pushes out the useful video sooner. And a recorder that anyone can open and edit is useless in court. journald has the same three settings: size, rate, integrity.</p>

<h3>Step 1 — what journald says about itself</h3>
${lenh('s07/cauhinh', 0)}
<p>At every start journald logs its limits. <code>Runtime Journal … is 2.4M, max 19.2M</code> = the RAM copy in <code>/run</code> during early boot. <code>System Journal … is 43.0M, max 686.9M, 643.8M free</code> = the disk journal: it may grow to 686.9 MB. Where does that number come from?</p>
${lenh('s07/cauhinh', 1)}
<p>Lines starting with <code>#</code> are the compiled-in defaults; only <code>ForwardToSyslog=yes</code> is really set (by Ubuntu). <code>SystemMaxUse=</code> is empty, so the rule from <code>man journald.conf</code> applies: use at most <strong>10 % of the file system</strong>, and leave at least <strong>15 % free</strong> (<code>SystemKeepFree=</code>), whichever is smaller, each capped at <strong>4 GB</strong>. Other defaults worth knowing: <code>MaxFileSec=1month</code> (rotate a file at least monthly), <code>MaxRetentionSec=</code> empty (no age limit — only size), <code>Compress=yes</code>, <code>Seal=yes</code> (only active once keys exist, step 5), <code>SyncIntervalSec=5m</code> (lesson 7.1).</p>

<h3>Step 2 — change it the right way: a drop-in</h3>
${lenh('s07/cauhinh', 3)}
${lenh('s07/cauhinh', 4)}
${lenh('s07/cauhinh', 5)}
<p>Never edit <code>/etc/systemd/journald.conf</code> itself — package upgrades may replace it and nobody sees what you changed. Put your settings in <code>/etc/systemd/journald.conf.d/*.conf</code> (later names win), restart journald, and read its start line to confirm: max is now 60.0M. <code>systemd-analyze cat-config systemd/journald.conf</code> prints the main file plus every drop-in in order — the first command when you inherit a server.</p>

<h3>Step 3 — rotate and vacuum</h3>
${lenh('s07/cauhinh', 6)}
${lenh('s07/cauhinh', 7)}
${lenh('s07/cauhinh', 8)}
${lenh('s07/cauhinh', 9)}
${lenh('s07/cauhinh', 10)}
<ul>
<li><code>--rotate</code> closes the active files and starts new ones; only <strong>archived</strong> files can be vacuumed.</li>
<li><code>--vacuum-size=40M</code> deletes the oldest archived files until the total is under 40 MB; <code>--vacuum-time=7d</code> deletes archived files whose newest entry is older than 7 days (none here); <code>--vacuum-files=N</code> keeps at most N archived files.</li>
<li>Vacuum is a one-off clean-up. The permanent rule is <code>SystemMaxUse=</code> / <code>MaxRetentionSec=</code>.</li>
</ul>
<p>Now the price of a small limit. After we set 60 MB and ran the flood tests of the next step (about 75 000 lines), this is what remained:</p>
${lenh('s07/mat-lich-su', 0)}
${lenh('s07/mat-lich-su', 1)}
${lenh('s07/mat-lich-su', 2)}
<p>Lesson 7.2 listed four boots. Now there is one, and even it starts at 04:13:02 instead of 04:12:53 — the boot messages of the current boot were in a file that was deleted. One noisy service plus a tight cap erased the power-cut evidence of 7.1. Decide the limit from the history you need ("we must be able to answer questions about last month"), measure how many MB per day your machine writes (<code>--disk-usage</code> today vs tomorrow), and remember that whatever you keep on the machine dies with the machine — Chapter 15 ships logs elsewhere.</p>

<h3>Step 4 — the rate limit: when journald throws your lines away</h3>
${lenh('s07/gioi-toc', 0)}
${lenh('s07/gioi-toc', 1)}
${lenh('s07/gioi-toc', 2)}
${lenh('s07/gioi-toc', 3)}
<p>30 000 lines in a second, <strong>exactly 10 000 stored</strong> (+ the final line and systemd's own), and journald's note <code>Suppressed 20000 messages from lu-mac-dinh.service</code>. Default: <code>RateLimitBurst=10000</code> per <code>RateLimitIntervalSec=30s</code>, counted <strong>per service</strong>, so one noisy service does not silence the others. The man page adds that the effective limit is multiplied by a factor based on free disk space, so on a big empty disk you may see more than 10 000 kept. One unit can get its own limit:</p>
${lenh('s07/gioi-toc', 4)}
${lenh('s07/gioi-toc', 5)}
${lenh('s07/gioi-toc', 6)}
<p>In a unit file that is <code>LogRateLimitIntervalSec=</code> and <code>LogRateLimitBurst=</code> under <code>[Service]</code>. Read the consequence carefully: journald keeps the <em>first</em> lines of a burst and drops the rest. An app that prints 50 000 warnings and then its real error at the end loses the error. When you see <code>Suppressed N messages from X</code> during an incident, the evidence you want may be in the gap — fix the noise at the source (log level, de-duplicate), and do not "solve" it by setting the limit to 0 on a small disk.</p>

<h3>Step 5 — integrity: --verify and Forward Secure Sealing</h3>
${lenh('s07/cauhinh', 11)}
<p><code>--verify</code> checks the internal structure and hashes of every file. PASS means "not corrupted". It does <em>not</em> mean "not edited": someone with root can rewrite a file and recompute the hashes. That is what sealing solves.</p>
${lenh('s07/cauhinh', 12)}
${lenh('s07/cauhinh', 13)}
${lenh('s07/niem-phong', 0)}
<p><code>--setup-keys</code> creates two things. The <strong>sealing key</strong> stays on the machine (<code>fss</code>, 482 bytes, root only); journald uses it to sign the journal at regular intervals (15 minutes by default) and then <em>evolves it forward and forgets the old one</em> — so an attacker who becomes root at 10:00 cannot re-sign anything from before 10:00. The printed <strong>verification key</strong> must leave the machine: a password manager, paper in a safe, the security team. Now test it:</p>
${lenh('s07/niem-phong', 1)}
${lenh('s07/niem-phong', 2)}
${lenh('s07/niem-phong', 3)}
${lenh('s07/niem-phong', 4)}
${lenh('s07/niem-phong', 5)}
${lenh('s07/niem-phong', 6)}
<p>We copied a sealed archive and changed 6 bytes: "failed" became "passed". The edited record reads perfectly — <code>order 1061 passed: database timeout …</code> — and any human or SIEM would believe it.</p>
${lenh('s07/niem-phong', 7)}
${lenh('s07/niem-phong', 8)}
<p>Without the key, verification refuses ("Required key not available"). With it: <strong>FAIL</strong>, with the exact offset of the damage. Limits: sealing proves <em>modification</em>; an attacker can still delete whole files, or stop journald. The answer to deletion is a copy elsewhere (Chapter 15) and alerts on the traces below. Sealing was added to systemd in 2012; LWN's article in the sources explains the cryptography in plain words.</p>

<h3>Step 6 — ForwardToSyslog and friends</h3>
<p><code>ForwardToSyslog=yes</code> (Ubuntu's choice) sends every record to a classic syslog daemon if one listens. lab7 is a minimal image without rsyslog, so nothing happens and <code>/var/log/syslog</code> does not exist; on a normal Ubuntu server rsyslog writes <code>/var/log/syslog</code> and <code>auth.log</code> from it — Chapter 8. Related options: <code>ForwardToConsole=</code>, <code>ForwardToWall=</code> (emergencies on every terminal), <code>MaxLevelStore=</code> (do not even store debug), <code>Storage=</code> (7.1).</p>

<h3>Hacker's corner: wiping the journal leaves fingerprints</h3>
<p>Clearing logs is so common that MITRE ATT&amp;CK has a technique for it: <strong>T1070.002, Clear Linux or Mac System Logs</strong>. On a journald system the quick ways are <code>journalctl --rotate --vacuum-time=1s</code>, deleting files under <code>/var/log/journal</code>, or <code>Storage=none</code>. Each leaves traces that point back at the attacker:</p>
${lenh('s07/nhan', 5)}
<ul>
<li>journald logs every vacuum: <code>Deleted archived journal …</code>, <code>Vacuuming done, freed …</code>, and <code>Received client request to rotate</code> — above, from our own clean-up.</li>
<li>sudo logs the command that did it (<code>COMMAND=/usr/bin/journalctl --vacuum-time=1s</code>) — unless the journal holding that line is the one deleted, which is why the copy elsewhere matters.</li>
<li><code>--list-boots</code> suddenly shorter, the first entry jumping forward, or a boot whose first record is not the kernel banner, are all signs.</li>
<li>Sealed journals turn a quiet edit into a FAIL.</li>
</ul>
<p>Lesson 14.4 builds the full investigation for log wiping on Linux and Windows.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"Disk full" alert on a small VPS (20 GB):</strong> <code>journalctl --disk-usage</code> says 2 GB. That is the 10 % default doing its job, not a leak — but if the app's own text log in <code>/var/log/app/</code> has no rotation, that is (Chapter 8, logrotate). Decide the cap, put it in a drop-in, document it.</li>
<li><strong>The security questionnaire of a bank customer</strong> asks "are logs protected from modification?". With FSS + off-machine shipping + restricted read access you can answer yes and show the commands.</li>
<li><strong>A teammate set <code>RateLimitBurst=0</code>…</strong> and the app now writes 2 GB a day. Rate limiting is a seat belt; take it off only with a size cap and monitoring.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your VM, read journald's start line and explain both "max" numbers from your disk size.</li>
<li>Create a drop-in limiting the journal to 200 MB and 2 weeks; prove it is active.</li>
<li>Reproduce the rate limit with a unit of your own: <code>LogRateLimitBurst=500</code>, 2 000 lines. How many are stored? Find journald's "Suppressed" line.</li>
<li>Run <code>sudo journalctl --vacuum-time=1d</code>. Then, pretending you are the investigator, find three traces of what you just did.</li>
<li>Set up sealing, wait for a rotation, verify with the key. Store the key somewhere that is not the VM.</li>
</ol>
<p><strong>Done when:</strong> 1 shows the 10 %/15 % arithmetic; 2 shows "max 200.0M" in journald's start line; 3 stores 500 (+ systemd's lines) and shows <code>Suppressed 1500 messages</code>; 4 cites the vacuum lines, the sudo line and the changed <code>--list-boots</code>; 5 shows PASS with <code>--verify-key</code>.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['SystemMaxUse= / SystemKeepFree=', 'Max disk used by the journal / disk to leave free; defaults 10 % and 15 % of the file system, each capped at 4 GB.'],
  ['MaxRetentionSec=', 'Delete archived entries older than this (no limit by default).'],
  ['drop-in', 'A file in journald.conf.d/ that overrides the main config; survives upgrades.'],
  ['vacuum', 'One-off deletion of archived files by size, age or count.'],
  ['RateLimitBurst / IntervalSec', 'Max messages per service per interval (10 000 / 30 s); the rest are dropped and counted.'],
  ['LogRateLimitBurst=', 'Per-unit override of the rate limit.'],
  ['FSS (Forward Secure Sealing)', 'Periodic signatures with a key that evolves forward; verification key kept off the machine.'],
  ['T1070.002', 'MITRE ATT&CK: clearing Linux/macOS system logs.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Read journald's start line for the real limits; configure with drop-ins, check with <code>systemd-analyze cat-config</code>.</li>
<li>A small cap plus a noisy service silently deletes old boots — size for the history you need.</li>
<li>The rate limit keeps the first lines of a flood; "Suppressed N messages" means evidence may be missing.</li>
<li><code>--verify</code> finds corruption; only sealing with an off-machine key proves nobody edited the past.</li>
<li>Wiping the journal leaves vacuum and sudo lines — and only a copy elsewhere survives it.</li>
</ul>
${nguon('📘', 'journald.conf(5)', 'Every size, rate and sealing option with defaults', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'systemd.exec(5) — LogRateLimitIntervalSec=', 'Per-unit log rate limit', 'https://man7.org/linux/man-pages/man5/systemd.exec.5.html')}
${nguon('📰', 'LWN — Forward secure sealing (2012)', 'How journald sealing works and what it protects', 'https://lwn.net/Articles/512895/')}
${nguon('🛡', 'MITRE ATT&CK T1070.002', 'Indicator Removal: Clear Linux or Mac System Logs', 'https://attack.mitre.org/techniques/T1070/002/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: '14.4 — When attackers wipe the logs', sub: 'Full investigation on Linux and Windows', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>journald.conf: giữ bao nhiêu, nhận nhanh tới đâu, và làm sao biết không ai sửa</h2>
<p class="lead">Cấu hình mặc định của journald hợp lý trên máy cá nhân nhưng gây bất ngờ trên máy chủ: lịch sử lặng lẽ co lại, một app ồn ào có thể làm biến mất những dòng quan trọng, và không có gì ngăn root sửa quá khứ. Bài này đọc các giới hạn thật trên lab7, đổi chúng đúng cách, cố ý làm ngập journal, rồi niêm phong nó.</p>

<h3>Liên tưởng đời thường: đầu ghi camera</h3>
<p>Đầu ghi camera của cửa hàng có ổ cứng cỡ cố định. Đầy thì video cũ nhất bị ghi đè. Đặt chỉ giữ 3 ngày thì vụ trộm phát hiện vào ngày thứ 5 không còn hình. Một camera chĩa vào bóng đèn nhấp nháy sẽ lấp đầy ổ bằng rác và đẩy video có ích đi sớm hơn. Và một đầu ghi ai cũng mở ra sửa được thì vô dụng trước toà. journald có đúng ba nút đó: dung lượng, tốc độ, toàn vẹn.</p>

<h3>Bước 1 — journald tự nói gì về mình</h3>
${lenh('s07/cauhinh', 0)}
<p>Mỗi lần khởi động, journald ghi lại các giới hạn của nó. <code>Runtime Journal … is 2.4M, max 19.2M</code> = bản trong RAM ở <code>/run</code> lúc mới khởi động. <code>System Journal … is 43.0M, max 686.9M, 643.8M free</code> = journal trên đĩa: được lớn tới 686,9 MB. Con số đó từ đâu ra?</p>
${lenh('s07/cauhinh', 1)}
<p>Dòng mở đầu bằng <code>#</code> là giá trị mặc định biên dịch sẵn; chỉ <code>ForwardToSyslog=yes</code> là thực sự được đặt (do Ubuntu). <code>SystemMaxUse=</code> để trống, nên luật trong <code>man journald.conf</code> áp dụng: dùng tối đa <strong>10 % hệ thống tệp</strong>, và chừa ít nhất <strong>15 % trống</strong> (<code>SystemKeepFree=</code>), lấy giá trị nhỏ hơn, mỗi giá trị có trần <strong>4 GB</strong>. Mặc định khác nên biết: <code>MaxFileSec=1month</code> (ít nhất mỗi tháng xoay tệp một lần), <code>MaxRetentionSec=</code> trống (không giới hạn tuổi — chỉ theo dung lượng), <code>Compress=yes</code>, <code>Seal=yes</code> (chỉ có tác dụng khi đã có khoá, bước 5), <code>SyncIntervalSec=5m</code> (bài 7.1).</p>

<h3>Bước 2 — sửa đúng cách: drop-in</h3>
${lenh('s07/cauhinh', 3)}
${lenh('s07/cauhinh', 4)}
${lenh('s07/cauhinh', 5)}
<p>Đừng bao giờ sửa thẳng <code>/etc/systemd/journald.conf</code> — nâng cấp gói có thể thay nó và không ai thấy bạn đã đổi gì. Đặt cấu hình vào <code>/etc/systemd/journald.conf.d/*.conf</code> (tên xếp sau thắng), khởi động lại journald, rồi đọc dòng khởi động của nó để xác nhận: max giờ là 60.0M. <code>systemd-analyze cat-config systemd/journald.conf</code> in tệp chính cùng mọi drop-in theo thứ tự — lệnh đầu tiên khi bạn nhận bàn giao một máy chủ.</p>

<h3>Bước 3 — xoay và dọn (vacuum)</h3>
${lenh('s07/cauhinh', 6)}
${lenh('s07/cauhinh', 7)}
${lenh('s07/cauhinh', 8)}
${lenh('s07/cauhinh', 9)}
${lenh('s07/cauhinh', 10)}
<ul>
<li><code>--rotate</code> đóng các tệp đang ghi và mở tệp mới; chỉ tệp <strong>đã lưu trữ</strong> mới dọn được.</li>
<li><code>--vacuum-size=40M</code> xoá các tệp lưu trữ cũ nhất tới khi tổng dưới 40 MB; <code>--vacuum-time=7d</code> xoá tệp lưu trữ có bản ghi mới nhất cũ hơn 7 ngày (ở đây không có); <code>--vacuum-files=N</code> giữ tối đa N tệp lưu trữ.</li>
<li>Vacuum là dọn một lần. Luật lâu dài là <code>SystemMaxUse=</code> / <code>MaxRetentionSec=</code>.</li>
</ul>
<p>Giờ là cái giá của một giới hạn nhỏ. Sau khi đặt 60 MB và chạy các bài thử làm ngập ở bước sau (khoảng 75 000 dòng), đây là những gì còn lại:</p>
${lenh('s07/mat-lich-su', 0)}
${lenh('s07/mat-lich-su', 1)}
${lenh('s07/mat-lich-su', 2)}
<p>Bài 7.2 liệt kê bốn lần khởi động. Giờ chỉ còn một, và ngay cả nó cũng bắt đầu lúc 04:13:02 thay vì 04:12:53 — thông điệp khởi động của lần hiện tại nằm trong một tệp đã bị xoá. Một dịch vụ ồn ào cộng một trần chật đã xoá sạch bằng chứng rút điện ở bài 7.1. Hãy chọn giới hạn theo lịch sử bạn cần ("phải trả lời được câu hỏi về tháng trước"), đo xem máy ghi bao nhiêu MB mỗi ngày (<code>--disk-usage</code> hôm nay so với ngày mai), và nhớ rằng thứ gì giữ trên máy sẽ chết cùng máy — Chương 15 gửi log đi nơi khác.</p>

<h3>Bước 4 — giới hạn tốc độ: khi journald vứt bỏ dòng của bạn</h3>
${lenh('s07/gioi-toc', 0)}
${lenh('s07/gioi-toc', 1)}
${lenh('s07/gioi-toc', 2)}
${lenh('s07/gioi-toc', 3)}
<p>30 000 dòng trong một giây, <strong>giữ đúng 10 000</strong> (+ dòng cuối và dòng của systemd), và ghi chú của journald <code>Suppressed 20000 messages from lu-mac-dinh.service</code>. Mặc định: <code>RateLimitBurst=10000</code> mỗi <code>RateLimitIntervalSec=30s</code>, tính <strong>theo từng dịch vụ</strong>, nên một dịch vụ ồn không làm câm các dịch vụ khác. Trang man nói thêm giới hạn thực tế được nhân với một hệ số theo dung lượng đĩa còn trống, nên trên đĩa lớn còn trống nhiều bạn có thể thấy giữ hơn 10 000. Một unit có thể có giới hạn riêng:</p>
${lenh('s07/gioi-toc', 4)}
${lenh('s07/gioi-toc', 5)}
${lenh('s07/gioi-toc', 6)}
<p>Trong tệp unit đó là <code>LogRateLimitIntervalSec=</code> và <code>LogRateLimitBurst=</code> dưới <code>[Service]</code>. Đọc kỹ hệ quả: journald giữ các dòng <em>đầu</em> của một đợt và bỏ phần còn lại. App in ra 50 000 cảnh báo rồi mới in lỗi thật ở cuối thì mất đúng dòng lỗi đó. Khi thấy <code>Suppressed N messages from X</code> giữa một sự cố, bằng chứng bạn cần có thể nằm trong khoảng trống — sửa nguồn ồn (mức log, gộp trùng), và đừng "giải quyết" bằng cách đặt giới hạn về 0 trên một đĩa nhỏ.</p>

<h3>Bước 5 — toàn vẹn: --verify và Forward Secure Sealing</h3>
${lenh('s07/cauhinh', 11)}
<p><code>--verify</code> kiểm cấu trúc bên trong và mã băm của mọi tệp. PASS nghĩa là "không hỏng". Nó <em>không</em> có nghĩa "không bị sửa": người có root có thể viết lại một tệp rồi tính lại mã băm. Niêm phong giải quyết đúng chỗ đó.</p>
${lenh('s07/cauhinh', 12)}
${lenh('s07/cauhinh', 13)}
${lenh('s07/niem-phong', 0)}
<p><code>--setup-keys</code> tạo hai thứ. <strong>Khoá niêm phong</strong> ở lại trên máy (<code>fss</code>, 482 byte, chỉ root); journald dùng nó để ký journal theo chu kỳ (mặc định 15 phút) rồi <em>tiến hoá nó về phía trước và quên khoá cũ</em> — nên kẻ tấn công thành root lúc 10:00 không thể ký lại bất cứ thứ gì trước 10:00. <strong>Khoá kiểm</strong> được in ra phải rời khỏi máy: trình quản lý mật khẩu, tờ giấy trong két, đội bảo mật. Giờ thử nó:</p>
${lenh('s07/niem-phong', 1)}
${lenh('s07/niem-phong', 2)}
${lenh('s07/niem-phong', 3)}
${lenh('s07/niem-phong', 4)}
${lenh('s07/niem-phong', 5)}
${lenh('s07/niem-phong', 6)}
<p>Ta chép một tệp lưu trữ đã niêm phong và đổi 6 byte: "failed" thành "passed". Bản ghi bị sửa đọc lên hoàn hảo — <code>order 1061 passed: database timeout …</code> — người hay SIEM nào cũng sẽ tin.</p>
${lenh('s07/niem-phong', 7)}
${lenh('s07/niem-phong', 8)}
<p>Không có khoá, việc kiểm từ chối ("Required key not available"). Có khoá: <strong>FAIL</strong>, kèm vị trí chính xác chỗ hỏng. Giới hạn: niêm phong chứng minh được việc <em>sửa</em>; kẻ tấn công vẫn có thể xoá cả tệp, hoặc dừng journald. Lời giải cho việc xoá là một bản sao ở nơi khác (Chương 15) và cảnh báo dựa trên các dấu vết dưới đây. Niêm phong có trong systemd từ năm 2012; bài của LWN trong phần nguồn giải thích phần mật mã bằng lời dễ hiểu.</p>

<h3>Bước 6 — ForwardToSyslog và các anh em</h3>
<p><code>ForwardToSyslog=yes</code> (lựa chọn của Ubuntu) gửi mọi bản ghi sang một syslog daemon kiểu cổ điển nếu có ai đang nghe. lab7 là ảnh tối giản không có rsyslog, nên không có gì xảy ra và <code>/var/log/syslog</code> không tồn tại; trên một máy chủ Ubuntu bình thường, rsyslog lấy từ đây để viết <code>/var/log/syslog</code> và <code>auth.log</code> — Chương 8. Tuỳ chọn liên quan: <code>ForwardToConsole=</code>, <code>ForwardToWall=</code> (tin khẩn hiện trên mọi terminal), <code>MaxLevelStore=</code> (không lưu cả debug), <code>Storage=</code> (7.1).</p>

<h3>Góc hacker: xoá journal vẫn để lại dấu tay</h3>
<p>Xoá log phổ biến tới mức MITRE ATT&amp;CK có hẳn một kỹ thuật: <strong>T1070.002, Clear Linux or Mac System Logs</strong>. Trên hệ dùng journald, cách nhanh là <code>journalctl --rotate --vacuum-time=1s</code>, xoá tệp dưới <code>/var/log/journal</code>, hoặc <code>Storage=none</code>. Cách nào cũng để lại dấu vết trỏ về kẻ làm:</p>
${lenh('s07/nhan', 5)}
<ul>
<li>journald ghi lại mọi lần dọn: <code>Deleted archived journal …</code>, <code>Vacuuming done, freed …</code>, và <code>Received client request to rotate</code> — ở trên là từ chính lần dọn của ta.</li>
<li>sudo ghi lệnh đã làm việc đó (<code>COMMAND=/usr/bin/journalctl --vacuum-time=1s</code>) — trừ khi journal chứa dòng đó chính là cái bị xoá, vì thế bản sao ở nơi khác mới quan trọng.</li>
<li><code>--list-boots</code> bỗng ngắn đi, bản ghi đầu tiên nhảy về phía sau, hay một lần khởi động mà bản ghi đầu không phải dòng chào của nhân, đều là dấu hiệu.</li>
<li>Journal đã niêm phong biến một lần sửa lặng lẽ thành FAIL.</li>
</ul>
<p>Bài 14.4 dựng trọn cuộc điều tra vụ xoá log trên Linux và Windows.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Cảnh báo "đầy đĩa" trên một VPS nhỏ (20 GB):</strong> <code>journalctl --disk-usage</code> báo 2 GB. Đó là mặc định 10 % đang làm đúng việc, không phải rò rỉ — nhưng nếu tệp log chữ riêng của app trong <code>/var/log/app/</code> không được xoay thì đó mới là thủ phạm (Chương 8, logrotate). Chốt mức trần, đặt vào drop-in, ghi vào tài liệu.</li>
<li><strong>Bảng hỏi bảo mật của một khách hàng ngân hàng</strong> hỏi "log có được bảo vệ khỏi bị sửa không?". Có FSS + gửi ra ngoài máy + giới hạn quyền đọc thì bạn trả lời có và chỉ ra được các lệnh.</li>
<li><strong>Một đồng nghiệp đặt <code>RateLimitBurst=0</code>…</strong> và giờ app ghi 2 GB mỗi ngày. Giới hạn tốc độ là dây an toàn; chỉ tháo khi đã có trần dung lượng và giám sát.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo của bạn, đọc dòng khởi động của journald và giải thích hai con số "max" từ cỡ đĩa.</li>
<li>Tạo một drop-in giới hạn journal ở 200 MB và 2 tuần; chứng minh nó đã có hiệu lực.</li>
<li>Tái hiện giới hạn tốc độ bằng unit của riêng bạn: <code>LogRateLimitBurst=500</code>, 2 000 dòng. Lưu được bao nhiêu? Tìm dòng "Suppressed" của journald.</li>
<li>Chạy <code>sudo journalctl --vacuum-time=1d</code>. Rồi, đóng vai người điều tra, tìm ba dấu vết của việc bạn vừa làm.</li>
<li>Bật niêm phong, chờ một lần xoay, kiểm bằng khoá. Cất khoá ở nơi không phải máy ảo.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 trình bày được phép tính 10 %/15 %; câu 2 thấy "max 200.0M" trong dòng khởi động của journald; câu 3 lưu 500 dòng (+ dòng của systemd) và thấy <code>Suppressed 1500 messages</code>; câu 4 trích được dòng vacuum, dòng sudo và <code>--list-boots</code> đã đổi; câu 5 ra PASS với <code>--verify-key</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['SystemMaxUse= / SystemKeepFree=', 'Dung lượng tối đa journal được dùng / phần đĩa phải chừa trống; mặc định 10 % và 15 % hệ thống tệp, mỗi giá trị trần 4 GB.'],
  ['MaxRetentionSec=', 'Xoá bản ghi lưu trữ cũ hơn mốc này (mặc định không giới hạn).'],
  ['drop-in', 'Tệp trong journald.conf.d/ ghi đè cấu hình chính; không mất khi nâng cấp.'],
  ['vacuum', 'Xoá một lần các tệp lưu trữ theo dung lượng, tuổi hoặc số tệp.'],
  ['RateLimitBurst / IntervalSec', 'Số thông điệp tối đa mỗi dịch vụ trong một khoảng (10 000 / 30 s); phần dư bị bỏ và được đếm.'],
  ['LogRateLimitBurst=', 'Giới hạn tốc độ riêng cho một unit.'],
  ['FSS (Forward Secure Sealing)', 'Chữ ký định kỳ bằng khoá tiến hoá một chiều; khoá kiểm cất ngoài máy.'],
  ['T1070.002', 'MITRE ATT&CK: xoá log hệ thống Linux/macOS.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc dòng khởi động của journald để biết giới hạn thật; cấu hình bằng drop-in, kiểm bằng <code>systemd-analyze cat-config</code>.</li>
<li>Trần nhỏ cộng một dịch vụ ồn sẽ lặng lẽ xoá các lần khởi động cũ — đặt theo lịch sử bạn cần giữ.</li>
<li>Giới hạn tốc độ giữ các dòng đầu của một đợt ngập; "Suppressed N messages" nghĩa là có thể thiếu bằng chứng.</li>
<li><code>--verify</code> tìm hỏng hóc; chỉ niêm phong với khoá cất ngoài máy mới chứng minh không ai sửa quá khứ.</li>
<li>Xoá journal để lại dòng vacuum và dòng sudo — và chỉ bản sao ở nơi khác sống sót qua việc đó.</li>
</ul>
${nguon('📘', 'journald.conf(5)', 'Mọi tuỳ chọn dung lượng, tốc độ, niêm phong kèm mặc định', 'https://man7.org/linux/man-pages/man5/journald.conf.5.html')}
${nguon('📘', 'systemd.exec(5) — LogRateLimitIntervalSec=', 'Giới hạn tốc độ log cho từng unit', 'https://man7.org/linux/man-pages/man5/systemd.exec.5.html')}
${nguon('📰', 'LWN — Forward secure sealing (2012)', 'Niêm phong journald hoạt động thế nào và bảo vệ được gì', 'https://lwn.net/Articles/512895/')}
${nguon('🛡', 'MITRE ATT&CK T1070.002', 'Indicator Removal: Clear Linux or Mac System Logs', 'https://attack.mitre.org/techniques/T1070/002/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-4-xoa-dau-vet', title: '14.4 — Khi kẻ tấn công xoá log', sub: 'Điều tra trọn vẹn trên Linux và Windows' })}
</div>
`,
};
