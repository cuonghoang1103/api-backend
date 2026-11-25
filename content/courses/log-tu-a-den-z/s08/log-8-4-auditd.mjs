/**
 * 8.4 — auditd (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s08/auditd'], ['s08/auditd2'], ['s08/auditd3'], ['s08/auditd4'] — lab7 (Ubuntu 24.04, audit 3.1.2, nhân 6.8).
 * Sau auditctl -e 2 (bất biến) máy ảo được khởi động lại để gỡ chế độ đó. auditd4 chạy sau Lab 8 nên số đếm gồm cả Lab 8.
 * Bộ quy tắc: _demo/s08/vm/50-lab.rules. Rocky 9 trong docker run --rm (chỉ đọc unit và auditd.conf mặc định).
 * Nguồn: auditctl(8), audit.rules(7), ausearch(8), aureport(8), auditd.conf(5) (man7.org); Neo23x0/auditd;
 * MITRE ATT&CK T1562.012, T1548.003.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '8.4 — auditd: watch rules, syscall rules, keys, ausearch and aureport|||8.4 — auditd: quy tắc theo dõi tệp, theo syscall, khoá, ausearch và aureport',
  slug: 'log-8-4-auditd',
  type: 'LESSON',
  isFreePreview: true,
  description: 'auditd ghi những gì NHÂN thấy, không phải những gì chương trình tự kể: ai mở /etc/shadow, ai sửa sudoers, ai chạy lệnh gì — kể cả sau khi đã sudo lên root (auid). Viết quy tắc -w … -p wa -k và -a always,exit -S execve, nạp bền bằng augenrules, đọc bản ghi thô (SYSCALL/PATH/PROCTITLE hex), rồi ausearch -k/-ua/-sv/-i/--format text và aureport. Thí nghiệm thật: một người dùng sudo tạo cửa sau NOPASSWD trong sudoers.d; quy tắc đọc shadow ngập 460 sự kiện nhiễu; auditctl -e 0 bị ghi lại, -e 2 khoá cấu hình; nhưng dừng auditd trên Ubuntu tạo một khoảng mù thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>auditd: what the kernel saw, not what the program said</h2>
<p class="lead">Everything so far was written <em>by programs about themselves</em>: sshd says "Accepted", sudo says "COMMAND=…". A program that does not log, or lies, leaves nothing. The Linux <strong>audit</strong> subsystem is different: the kernel records system calls that match your rules — file opens, program executions, permission changes — and the <code>auditd</code> daemon writes them to <code>/var/log/audit/audit.log</code>. It is the tool compliance teams ask for (PCI DSS, CIS Benchmarks) and the one attackers try to switch off.</p>

<h3>The everyday picture: the door sensor vs the visitor book</h3>
<p>auth.log is the visitor book: people write their own name. auditd is the door sensor and the badge reader wired to the building: it records that badge #1001 opened the server room door at 22:41, whoever claims otherwise. And it remembers <em>whose badge it was</em> even if that person borrowed the master key (sudo).</p>

<h3>Step 1 — install and look at the state</h3>
${lenh('s08/auditd', 0)}
${lenh('s08/auditd', 1)}
${lenh('s08/auditd', 2)}
<p><code>enabled 1</code>: auditing on. <code>failure 1</code>: if the kernel cannot deliver a record it prints a warning (2 would panic the machine — used only where losing audit is worse than downtime). <code>backlog_limit 8192</code>: records waiting for auditd. <code>lost 1349</code>: records already dropped — here before auditd was installed. A <code>lost</code> that keeps growing on a server means your audit trail has holes. And: <code>No rules</code> — installed is not the same as watching anything.</p>

<h3>Step 2 — write rules</h3>
${lenh('s08/auditd', 3)}
<ul>
<li><code>-w /etc/shadow -p rwa -k shadow</code> — <strong>watch</strong> a file: permissions <code>r</code>ead, <code>w</code>rite, e<code>x</code>ecute, <code>a</code>ttribute change; <code>-k</code> is a <strong>key</strong>, a label to find the events later.</li>
<li><code>-w /etc/sudoers.d/ -p wa</code> — a folder watch covers files inside it.</li>
<li><code>-a always,exit -F arch=b64 -S execve -F auid&gt;=1000 -F auid!=unset -k exec_nguoi</code> — a <strong>syscall rule</strong>: at the exit of every <code>execve</code> (start a program), if the <strong>login</strong> UID is a real user. <code>auid!=unset</code> skips daemons that never logged in.</li>
<li>Watches on <code>/etc/audit/</code> and <code>auditctl</code> itself: who touches the auditing.</li>
</ul>
${lenh('s08/auditd', 4)}
<p>Rules in <code>/etc/audit/rules.d/*.rules</code> are merged by <code>augenrules</code> into <code>/etc/audit/audit.rules</code> and survive reboots; <code>auditctl -w …</code> typed by hand is lost at reboot. Note the kernel rewrote <code>unset</code> as <code>-1</code>.</p>

<h3>Step 3 — two users do something</h3>
${lenh('s08/auditd', 5)}
${lenh('s08/auditd', 6)}
<p><code>dev</code> tries to read <code>/etc/shadow</code> (denied). <code>an</code>, a sudoer, creates an account <code>backup2</code> and writes <code>/etc/sudoers.d/dev</code> with <code>dev ALL=(ALL) NOPASSWD:ALL</code> — a quiet way to give a friend permanent root. auth.log sees only "an ran bash -c '…'" with sudo. Let us see what audit saw.</p>

<h3>Step 4 — a raw record, decoded by hand once</h3>
${lenh('s08/auditd', 7)}
${lenh('s08/auditd', 8)}
<p>One <strong>event</strong> = several records with the same <code>msg=audit(1795472665.677:10376)</code>: epoch time + serial number. <code>SYSCALL</code> (what call, success, exit code, every UID), <code>CWD</code>, <code>PATH</code> (which file, owner, mode), <code>PROCTITLE</code> (the command line in hex). Decode two of them by hand:</p>
${lenh('s08/auditd4', 0)}
${lenh('s08/auditd4', 1)}
<p>So this event is <code>openat</code> of <code>/etc/shadow</code> by… <code>sudo grep -E key="shadow" /var/log/audit/audit.log</code> — <strong>our own investigation command</strong>, same self-matching trap as in 8.3: sudo reads <code>/etc/shadow</code> to check our password, and the <code>r</code> watch catches it. You will not decode by hand again: <code>ausearch -i</code> does it.</p>

<h3>Step 5 — ausearch: find events by key, user, result</h3>
${lenh('s08/auditd', 9)}
${lenh('s08/auditd', 10)}
${lenh('s08/auditd', 11)}
${lenh('s08/auditd', 12)}
<p><code>--format text</code> turns events into sentences. Read the sudoers line: <strong>"an, acting as root, successfully opened-file /etc/sudoers.d/dev using bash"</strong>. That is the key idea of audit: <strong>auid</strong> (the login UID, set once at login) stays <code>an</code> after sudo, while <code>uid</code>/<code>euid</code> become root. You always know which human was behind a root action.</p>
${lenh('s08/auditd2', 0)}
${lenh('s08/auditd2', 1)}
<p>Filter by login user (<code>-ua 1002</code>) and failure (<code>-sv no</code>): dev's denied attempt, with <code>exit=EACCES</code>. And the programs a user ran, with arguments (<code>EXECVE</code> records):</p>
${lenh('s08/auditd2', 3)}
${lenh('s08/auditd', 14)}

<h3>Step 6 — aureport: the one-page overview</h3>
${lenh('s08/auditd', 15)}
${lenh('s08/auditd', 16)}
${lenh('s08/auditd', 18)}
${lenh('s08/auditd', 19)}
<p>Start a review with reports (<code>--summary</code>, <code>-au</code> authentications, <code>--failed</code>, <code>-x</code> executables, <code>-k</code> keys), then drill down with ausearch. The key summary already shows a design problem: <code>exec_nguoi</code> 458 and <code>shadow</code> 58 events in three seconds. After a whole lab night:</p>
${lenh('s08/auditd4', 2)}
<p>Of about 460 shadow events, <strong>2</strong> are interesting (<code>/usr/bin/cat</code>: dev in this lesson, the intruder in Lab 8). The rest are sshd and sudo doing their job. A <code>-p r</code> watch on a file that login programs read is mostly noise; in production use <code>-p wa</code> for shadow, or exclude known programs (<code>-F exe!=/usr/sbin/sshd</code>). Rule sets from the community, like Neo23x0/auditd, are tuned for this — read them before copying, they are large.</p>

<h3>Step 7 — switching audit off, and making that hard</h3>
${lenh('s08/auditd', 20)}
${lenh('s08/auditd', 21)}
<p>Turning audit off is itself the last thing audit records: <code>CONFIG_CHANGE … op=set audit_enabled=0 old=1 auid=an</code>. Lock it:</p>
${lenh('s08/auditd', 22)}
${lenh('s08/auditd', 23)}
<p><code>-e 2</code> = <strong>immutable</strong>: no rule changes and no disabling until reboot (that is why the lab VM was rebooted after this). Put <code>-e 2</code> as the last line of your rules in production. But there is a door left open on Ubuntu:</p>
${lenh('s08/auditd', 24)}
${lenh('s08/auditd2', 4)}
${lenh('s08/auditd2', 5)}
${lenh('s08/auditd2', 6)}
${lenh('s08/auditd2', 7)}
${lenh('s08/auditd3', 0)}
${lenh('s08/auditd3', 1)}
<p>Ubuntu's unit allows <code>systemctl stop auditd</code> (<code>RefuseManualStop=no</code>). The kernel keeps auditing (<code>enabled 2</code>) but nobody is writing to audit.log: records go to the kernel log, rate-limited (<code>kauditd_printk_skb: 206 callbacks suppressed</code>). The file we touched in <code>/etc/sudoers.d</code> while auditd was stopped is <strong>nowhere</strong> — ausearch finds only the deletion after restart. What remains is the gap itself:</p>
${lenh('s08/auditd2', 8)}
<p><code>DAEMON_END</code> at 05:24:28, <code>DAEMON_START</code> at 05:25:07: 39 seconds of blindness, and the gap is the evidence. Rocky/RHEL refuse the manual stop:</p>
${lenh('s08/auditd2', 9)}
${lenh('s08/auditd2', 10)}
<p>Also read the retention: <code>max_log_file = 8</code> (MB) × <code>num_logs = 5</code> = about <strong>40 MB</strong> of audit history, then the oldest is deleted. With the noisy rules above, that can be hours. Size it, and ship audit records off the machine (auditd's <code>audisp</code> plugins or a log agent — Chapter 15).</p>

<h3>Hacker's corner</h3>
<ul>
<li><strong>T1562.012 — Disable or Modify Linux Audit System</strong> (MITRE ATT&amp;CK): <code>auditctl -e 0</code>, <code>auditctl -D</code>, stopping the daemon, editing rules. Defences from this lesson: <code>-e 2</code>, watches on <code>/etc/audit/</code> and <code>auditctl</code>, alerting on <code>DAEMON_END</code>/<code>CONFIG_CHANGE</code>, and a remote copy.</li>
<li><strong>T1548.003 — Sudo and Sudo Caching</strong>: a line in <code>/etc/sudoers.d/</code> with <code>NOPASSWD:ALL</code> is a permanent, quiet root door. Our <code>-w /etc/sudoers.d/ -p wa -k sudoers</code> rule caught it with the human's name.</li>
</ul>

<h3>Real-life situations</h3>
<ul>
<li><strong>Bank or insurance client (outsourcing):</strong> the security team sends a CIS Benchmark checklist with an auditd section. You will be asked to show the rules (<code>auditctl -l</code>), that they persist (<code>rules.d</code>), that <code>-e 2</code> is set, and the retention settings.</li>
<li><strong>"Who changed this config file on prod at night?"</strong> If the file was watched: <code>ausearch -f /etc/nginx/nginx.conf -i</code> gives auid, time and program. If it was not, you only have guesses — add the watch today.</li>
<li><strong>Performance complaint:</strong> an <code>execve</code> rule without <code>auid</code> filters on a busy build server can produce millions of records. Measure with <code>aureport -k --summary</code> and narrow the rule.</li>
</ul>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok"><ol>
<li>Add <code>-w /etc/hosts -p wa -k hosts</code>; edit the file through sudo; find the event with <code>ausearch -k hosts -i</code> and name the auid.</li>
<li>As a normal user run <code>cat /etc/shadow</code>; find it with <code>-ua &lt;uid&gt; -sv no</code>.</li>
<li>Count shadow events by program (the awk line of step 6) on your VM; rewrite the rule so cat-like reads still show but sshd does not.</li>
<li>Read your <code>auditd.conf</code> and compute how many MB of audit history you keep.</li>
</ol>
<p><strong>Done when:</strong> each event you found shows the human (auid) behind it, and your tuned rule produces fewer events for the same test.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['-w path -p rwxa -k key', 'File/folder watch: which accesses, and a label to search by.'],
  ['-a always,exit -S execve', 'Syscall rule: record at the exit of the call, filtered by -F fields.'],
  ['auid', 'Login UID: set at login, unchanged by sudo/su — the human behind the action.'],
  ['augenrules', 'Merges /etc/audit/rules.d/*.rules into the persistent rule file and loads it.'],
  ['ausearch -k/-ua/-sv/-f/-i', 'Find events by key, login user, success, file; -i decodes numbers and hex.'],
  ['aureport', 'Summaries: --summary, -au, --failed, -x, -k.'],
  ['-e 2', 'Immutable audit config until reboot.'],
  ['lost · backlog_limit', 'Records dropped · queue size between kernel and auditd.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>auditd records what the kernel saw; installed with no rules records almost nothing.</li>
<li>auid keeps the human's identity through sudo — the reason audit beats auth.log for "who did it".</li>
<li>Use keys, then ausearch -i / --format text; start reviews with aureport.</li>
<li>Read watches on files that login programs read are noise; tune rules and check <code>lost</code>.</li>
<li><code>-e 2</code> locks rules, but a stopped daemon on Ubuntu is a blind gap — alert on DAEMON_END and keep a remote copy.</li>
</ul>
${nguon('📘', 'auditctl(8)', 'Rules, -e, -s, -l', 'https://man7.org/linux/man-pages/man8/auditctl.8.html')}
${nguon('📘', 'audit.rules(7)', 'Rule syntax, -F fields, keys', 'https://man7.org/linux/man-pages/man7/audit.rules.7.html')}
${nguon('📘', 'ausearch(8) · aureport(8)', 'Searching and reports', 'https://man7.org/linux/man-pages/man8/ausearch.8.html')}
${nguon('📘', 'auditd.conf(5)', 'max_log_file, num_logs, disk_full_action', 'https://man7.org/linux/man-pages/man5/auditd.conf.5.html')}
${nguon('🧰', 'Neo23x0/auditd', 'Community rule set — read before using', 'https://github.com/Neo23x0/auditd')}
${nguon('🛡', 'MITRE ATT&CK T1562.012', 'Disable or Modify Linux Audit System', 'https://attack.mitre.org/techniques/T1562/012/')}
${nguon('🛡', 'MITRE ATT&CK T1548.003', 'Sudo and Sudo Caching', 'https://attack.mitre.org/techniques/T1548/003/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-3-leo-thang', title: 'Lesson 14.3 — Privilege escalation in logs', sub: 'auditd + auth.log + Windows 4672 together' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>auditd: điều nhân thấy, không phải điều chương trình kể</h2>
<p class="lead">Mọi thứ tới giờ đều do <em>chương trình tự viết về mình</em>: sshd nói "Accepted", sudo nói "COMMAND=…". Chương trình không ghi log, hoặc nói dối, thì không để lại gì. Hệ thống <strong>audit</strong> của Linux thì khác: nhân ghi lại các lời gọi hệ thống khớp với quy tắc của bạn — mở tệp, chạy chương trình, đổi quyền — và dịch vụ <code>auditd</code> ghi chúng vào <code>/var/log/audit/audit.log</code>. Đây là công cụ mà đội tuân thủ yêu cầu (PCI DSS, CIS Benchmark) và cũng là thứ kẻ tấn công tìm cách tắt.</p>

<h3>Liên tưởng đời thường: cảm biến cửa so với sổ khách</h3>
<p>auth.log là sổ khách: người ta tự ghi tên mình. auditd là cảm biến cửa và đầu đọc thẻ nối thẳng vào toà nhà: nó ghi rằng thẻ số 1001 mở cửa phòng máy lúc 22:41, ai nói khác cũng mặc. Và nó nhớ <em>thẻ đó của ai</em> kể cả khi người đó mượn chìa khoá tổng (sudo).</p>

<h3>Bước 1 — cài và nhìn trạng thái</h3>
${lenh('s08/auditd', 0)}
${lenh('s08/auditd', 1)}
${lenh('s08/auditd', 2)}
<p><code>enabled 1</code>: đang kiểm toán. <code>failure 1</code>: nếu nhân không giao được bản ghi thì in cảnh báo (2 là cho máy panic — chỉ dùng nơi mất kiểm toán còn tệ hơn ngừng máy). <code>backlog_limit 8192</code>: số bản ghi chờ auditd. <code>lost 1349</code>: số bản ghi đã rơi — ở đây là trước khi cài auditd. Trên máy chủ, <code>lost</code> cứ tăng nghĩa là dấu vết kiểm toán có lỗ. Và: <code>No rules</code> — cài rồi không có nghĩa là đang theo dõi gì.</p>

<h3>Bước 2 — viết quy tắc</h3>
${lenh('s08/auditd', 3)}
<ul>
<li><code>-w /etc/shadow -p rwa -k shadow</code> — <strong>theo dõi</strong> một tệp: quyền <code>r</code> đọc, <code>w</code> ghi, <code>x</code> chạy, <code>a</code> đổi thuộc tính; <code>-k</code> là <strong>khoá</strong>, một nhãn để tìm lại sự kiện về sau.</li>
<li><code>-w /etc/sudoers.d/ -p wa</code> — theo dõi thư mục thì bao luôn các tệp bên trong.</li>
<li><code>-a always,exit -F arch=b64 -S execve -F auid&gt;=1000 -F auid!=unset -k exec_nguoi</code> — một <strong>quy tắc syscall</strong>: ở lúc kết thúc mọi lời gọi <code>execve</code> (chạy một chương trình), nếu UID <strong>đăng nhập</strong> là người dùng thật. <code>auid!=unset</code> bỏ qua các dịch vụ chưa từng đăng nhập.</li>
<li>Theo dõi <code>/etc/audit/</code> và chính <code>auditctl</code>: ai đụng vào bộ kiểm toán.</li>
</ul>
${lenh('s08/auditd', 4)}
<p>Quy tắc trong <code>/etc/audit/rules.d/*.rules</code> được <code>augenrules</code> gộp vào <code>/etc/audit/audit.rules</code> và tồn tại qua khởi động lại; gõ tay <code>auditctl -w …</code> thì mất khi khởi động lại. Để ý nhân đã viết lại <code>unset</code> thành <code>-1</code>.</p>

<h3>Bước 3 — hai người dùng làm vài việc</h3>
${lenh('s08/auditd', 5)}
${lenh('s08/auditd', 6)}
<p><code>dev</code> thử đọc <code>/etc/shadow</code> (bị từ chối). <code>an</code>, người có quyền sudo, tạo tài khoản <code>backup2</code> và ghi <code>/etc/sudoers.d/dev</code> với nội dung <code>dev ALL=(ALL) NOPASSWD:ALL</code> — một cách lặng lẽ cho bạn mình quyền root vĩnh viễn. auth.log chỉ thấy "an chạy bash -c '…'" qua sudo. Xem audit thấy gì.</p>

<h3>Bước 4 — một bản ghi thô, giải mã bằng tay một lần</h3>
${lenh('s08/auditd', 7)}
${lenh('s08/auditd', 8)}
<p>Một <strong>sự kiện</strong> = nhiều bản ghi có cùng <code>msg=audit(1795472665.677:10376)</code>: thời gian epoch + số thứ tự. <code>SYSCALL</code> (lời gọi gì, thành công không, mã thoát, mọi UID), <code>CWD</code>, <code>PATH</code> (tệp nào, chủ, quyền), <code>PROCTITLE</code> (dòng lệnh ở dạng hex). Giải mã hai thứ bằng tay:</p>
${lenh('s08/auditd4', 0)}
${lenh('s08/auditd4', 1)}
<p>Vậy sự kiện này là <code>openat</code> tệp <code>/etc/shadow</code> bởi… <code>sudo grep -E key="shadow" /var/log/audit/audit.log</code> — <strong>chính lệnh điều tra của ta</strong>, đúng cái bẫy tự khớp ở Bài 8.3: sudo đọc <code>/etc/shadow</code> để kiểm mật khẩu của ta, và quy tắc theo dõi <code>r</code> bắt được. Bạn sẽ không phải giải mã tay nữa: <code>ausearch -i</code> làm hộ.</p>

<h3>Bước 5 — ausearch: tìm sự kiện theo khoá, người dùng, kết quả</h3>
${lenh('s08/auditd', 9)}
${lenh('s08/auditd', 10)}
${lenh('s08/auditd', 11)}
${lenh('s08/auditd', 12)}
<p><code>--format text</code> biến sự kiện thành câu. Đọc dòng sudoers: <strong>"an, acting as root, successfully opened-file /etc/sudoers.d/dev using bash"</strong>. Đó là ý tưởng cốt lõi của audit: <strong>auid</strong> (UID đăng nhập, đặt một lần lúc đăng nhập) vẫn là <code>an</code> sau sudo, trong khi <code>uid</code>/<code>euid</code> đã thành root. Bạn luôn biết con người nào đứng sau một thao tác root.</p>
${lenh('s08/auditd2', 0)}
${lenh('s08/auditd2', 1)}
<p>Lọc theo người đăng nhập (<code>-ua 1002</code>) và thất bại (<code>-sv no</code>): lần thử bị từ chối của dev, với <code>exit=EACCES</code>. Và các chương trình một người dùng đã chạy, kèm đối số (bản ghi <code>EXECVE</code>):</p>
${lenh('s08/auditd2', 3)}
${lenh('s08/auditd', 14)}

<h3>Bước 6 — aureport: bức tranh một trang</h3>
${lenh('s08/auditd', 15)}
${lenh('s08/auditd', 16)}
${lenh('s08/auditd', 18)}
${lenh('s08/auditd', 19)}
<p>Bắt đầu một lần rà soát bằng báo cáo (<code>--summary</code>, <code>-au</code> xác thực, <code>--failed</code>, <code>-x</code> chương trình, <code>-k</code> khoá), rồi đào sâu bằng ausearch. Bảng khoá đã lộ một lỗi thiết kế: <code>exec_nguoi</code> 458 và <code>shadow</code> 58 sự kiện trong ba giây. Sau cả một đêm lab:</p>
${lenh('s08/auditd4', 2)}
<p>Trong khoảng 460 sự kiện shadow, chỉ <strong>2</strong> đáng quan tâm (<code>/usr/bin/cat</code>: dev ở bài này, kẻ đột nhập ở Lab 8). Phần còn lại là sshd và sudo làm đúng việc của chúng. Quy tắc theo dõi <code>-p r</code> trên tệp mà chương trình đăng nhập phải đọc phần lớn là nhiễu; trên production dùng <code>-p wa</code> cho shadow, hoặc loại chương trình quen (<code>-F exe!=/usr/sbin/sshd</code>). Bộ quy tắc cộng đồng như Neo23x0/auditd đã được chỉnh cho chuyện này — đọc kỹ trước khi chép, chúng rất lớn.</p>

<h3>Bước 7 — tắt kiểm toán, và làm cho việc đó khó</h3>
${lenh('s08/auditd', 20)}
${lenh('s08/auditd', 21)}
<p>Tắt kiểm toán chính là điều cuối cùng kiểm toán ghi lại: <code>CONFIG_CHANGE … op=set audit_enabled=0 old=1 auid=an</code>. Khoá lại:</p>
${lenh('s08/auditd', 22)}
${lenh('s08/auditd', 23)}
<p><code>-e 2</code> = <strong>bất biến</strong>: không sửa quy tắc, không tắt được cho tới khi khởi động lại (vì thế máy ảo lab đã được khởi động lại sau bước này). Đặt <code>-e 2</code> làm dòng cuối của bộ quy tắc trên production. Nhưng trên Ubuntu vẫn còn một cánh cửa mở:</p>
${lenh('s08/auditd', 24)}
${lenh('s08/auditd2', 4)}
${lenh('s08/auditd2', 5)}
${lenh('s08/auditd2', 6)}
${lenh('s08/auditd2', 7)}
${lenh('s08/auditd3', 0)}
${lenh('s08/auditd3', 1)}
<p>Unit của Ubuntu cho phép <code>systemctl stop auditd</code> (<code>RefuseManualStop=no</code>). Nhân vẫn kiểm toán (<code>enabled 2</code>) nhưng không còn ai ghi vào audit.log: bản ghi chảy sang log của nhân, bị giới hạn tốc độ (<code>kauditd_printk_skb: 206 callbacks suppressed</code>). Tệp ta tạo trong <code>/etc/sudoers.d</code> lúc auditd dừng <strong>không có ở đâu cả</strong> — ausearch chỉ thấy lần xoá sau khi bật lại. Thứ còn lại là chính khoảng trống:</p>
${lenh('s08/auditd2', 8)}
<p><code>DAEMON_END</code> lúc 05:24:28, <code>DAEMON_START</code> lúc 05:25:07: 39 giây mù, và khoảng trống ấy là bằng chứng. Rocky/RHEL từ chối dừng bằng tay:</p>
${lenh('s08/auditd2', 9)}
${lenh('s08/auditd2', 10)}
<p>Đọc luôn phần lưu giữ: <code>max_log_file = 8</code> (MB) × <code>num_logs = 5</code> = khoảng <strong>40 MB</strong> lịch sử kiểm toán, sau đó tệp cũ nhất bị xoá. Với bộ quy tắc ồn như trên, đó có thể chỉ là vài giờ. Hãy tính cỡ, và gửi bản ghi kiểm toán ra khỏi máy (plugin <code>audisp</code> của auditd hoặc một agent gom log — Chương 15).</p>

<h3>Góc hacker</h3>
<ul>
<li><strong>T1562.012 — Disable or Modify Linux Audit System</strong> (MITRE ATT&amp;CK): <code>auditctl -e 0</code>, <code>auditctl -D</code>, dừng dịch vụ, sửa quy tắc. Phòng thủ từ bài này: <code>-e 2</code>, theo dõi <code>/etc/audit/</code> và <code>auditctl</code>, cảnh báo khi có <code>DAEMON_END</code>/<code>CONFIG_CHANGE</code>, và bản sao ở máy khác.</li>
<li><strong>T1548.003 — Sudo and Sudo Caching</strong>: một dòng trong <code>/etc/sudoers.d/</code> có <code>NOPASSWD:ALL</code> là cánh cửa root vĩnh viễn và lặng lẽ. Quy tắc <code>-w /etc/sudoers.d/ -p wa -k sudoers</code> đã bắt được nó kèm tên người thật.</li>
</ul>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Khách hàng ngân hàng, bảo hiểm (outsourcing):</strong> đội bảo mật gửi bảng kiểm CIS Benchmark có hẳn một mục auditd. Bạn sẽ được yêu cầu cho xem quy tắc (<code>auditctl -l</code>), chứng minh chúng bền (<code>rules.d</code>), đã đặt <code>-e 2</code>, và các tham số lưu giữ.</li>
<li><strong>"Ai sửa tệp cấu hình này trên production lúc nửa đêm?"</strong> Nếu tệp đã được theo dõi: <code>ausearch -f /etc/nginx/nginx.conf -i</code> cho auid, giờ và chương trình. Nếu chưa, bạn chỉ có phỏng đoán — thêm quy tắc ngay hôm nay.</li>
<li><strong>Than phiền về hiệu năng:</strong> một quy tắc <code>execve</code> không lọc <code>auid</code> trên máy build bận rộn có thể sinh hàng triệu bản ghi. Đo bằng <code>aureport -k --summary</code> và thu hẹp quy tắc.</li>
</ul>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm <code>-w /etc/hosts -p wa -k hosts</code>; sửa tệp qua sudo; tìm sự kiện bằng <code>ausearch -k hosts -i</code> và gọi tên auid.</li>
<li>Bằng một người dùng thường, chạy <code>cat /etc/shadow</code>; tìm nó bằng <code>-ua &lt;uid&gt; -sv no</code>.</li>
<li>Đếm sự kiện shadow theo chương trình (dòng awk ở bước 6) trên máy của bạn; viết lại quy tắc sao cho lệnh kiểu cat vẫn hiện còn sshd thì không.</li>
<li>Đọc <code>auditd.conf</code> của bạn và tính bạn giữ được bao nhiêu MB lịch sử kiểm toán.</li>
</ol>
<p><strong>Đạt khi:</strong> mỗi sự kiện bạn tìm được đều chỉ ra con người (auid) đứng sau, và quy tắc đã chỉnh sinh ít sự kiện hơn cho cùng phép thử.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['-w đường -p rwxa -k khoá', 'Theo dõi tệp/thư mục: loại truy cập nào, và nhãn để tìm.'],
  ['-a always,exit -S execve', 'Quy tắc syscall: ghi lúc lời gọi kết thúc, lọc bằng các trường -F.'],
  ['auid', 'UID đăng nhập: đặt khi đăng nhập, không đổi qua sudo/su — con người đứng sau thao tác.'],
  ['augenrules', 'Gộp /etc/audit/rules.d/*.rules thành tệp quy tắc bền và nạp vào.'],
  ['ausearch -k/-ua/-sv/-f/-i', 'Tìm theo khoá, người đăng nhập, thành công, tệp; -i giải mã số và hex.'],
  ['aureport', 'Báo cáo tóm tắt: --summary, -au, --failed, -x, -k.'],
  ['-e 2', 'Cấu hình kiểm toán bất biến cho tới khi khởi động lại.'],
  ['lost · backlog_limit', 'Số bản ghi đã rơi · cỡ hàng đợi giữa nhân và auditd.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>auditd ghi điều nhân thấy; cài mà không có quy tắc thì gần như không ghi gì.</li>
<li>auid giữ danh tính con người qua sudo — lý do audit hơn auth.log khi hỏi "ai làm".</li>
<li>Dùng khoá, rồi ausearch -i / --format text; bắt đầu rà soát bằng aureport.</li>
<li>Theo dõi đọc trên tệp mà chương trình đăng nhập phải đọc là nhiễu; chỉnh quy tắc và canh <code>lost</code>.</li>
<li><code>-e 2</code> khoá quy tắc, nhưng dừng dịch vụ trên Ubuntu tạo khoảng mù — cảnh báo DAEMON_END và giữ bản sao ở xa.</li>
</ul>
${nguon('📘', 'auditctl(8)', 'Quy tắc, -e, -s, -l', 'https://man7.org/linux/man-pages/man8/auditctl.8.html')}
${nguon('📘', 'audit.rules(7)', 'Cú pháp quy tắc, trường -F, khoá', 'https://man7.org/linux/man-pages/man7/audit.rules.7.html')}
${nguon('📘', 'ausearch(8) · aureport(8)', 'Tìm kiếm và báo cáo', 'https://man7.org/linux/man-pages/man8/ausearch.8.html')}
${nguon('📘', 'auditd.conf(5)', 'max_log_file, num_logs, disk_full_action', 'https://man7.org/linux/man-pages/man5/auditd.conf.5.html')}
${nguon('🧰', 'Neo23x0/auditd', 'Bộ quy tắc cộng đồng — đọc trước khi dùng', 'https://github.com/Neo23x0/auditd')}
${nguon('🛡', 'MITRE ATT&CK T1562.012', 'Tắt hoặc sửa hệ thống audit của Linux', 'https://attack.mitre.org/techniques/T1562/012/')}
${nguon('🛡', 'MITRE ATT&CK T1548.003', 'Lạm dụng sudo', 'https://attack.mitre.org/techniques/T1548/003/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-3-leo-thang', title: 'Bài 14.3 — Leo thang quyền trong log', sub: 'auditd + auth.log + Windows 4672 cùng lúc' })}
</div>
`,
};
