/**
 * IAO202 — Information Assurance Overview (CyberOps). Giáo trình FLM. Không slide
 * gốc → soạn từ syllabus (CIA/threats, Windows/Linux cho phân tích, network
 * protocols & attacks, monitoring & defense) + kiến thức, song ngữ, kèm BÀI TẬP.
 * Giữ NGUYÊN slug. ⚠️ code: KHÔNG backtick/${ }; "\n" viết \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('iao202-0-1-overview', 'Course overview: Information Assurance|||Tổng quan môn: An toàn thông tin',
  'Mục tiêu, 8 CLO (VM/môi trường an toàn; vai CyberOps Analyst; Windows/Linux; network protocols; hạ tầng & tấn công; công cụ giám sát; phòng chống), lộ trình, đánh giá.',
  [[
    `<span class="eyebrow">IAO202 · Lesson 0.1 · Overview</span>
<h2>Information Assurance Overview (Cybersecurity Operations)</h2>
<p class="lead">This course trains the mindset of a <strong>Cybersecurity Operations (SOC) Analyst</strong>: understand threats, know the systems (Windows, Linux, networks) attackers target, monitor for attacks, and defend hosts, networks and data.</p>
<h3>CLOs</h3>
<ul>
<li><strong>CLO1</strong> — set up VMs as a safe lab for analyzing threats</li>
<li><strong>CLO2</strong> — the role of a Cybersecurity Operations Analyst</li>
<li><strong>CLO3–4</strong> — Windows &amp; Linux features needed for analysis</li>
<li><strong>CLO5–6</strong> — network protocols/services; network infrastructure &amp; attack types</li>
<li><strong>CLO7</strong> — network monitoring tools to identify attacks</li>
<li><strong>CLO8</strong> — preventing malicious access to networks, hosts &amp; data</li>
</ul>
<h3>The CIA triad</h3>
<p>All security aims at three goals: <strong>Confidentiality</strong> (only authorized people read data), <strong>Integrity</strong> (data isn't tampered with), <strong>Availability</strong> (systems are up when needed). Every threat and control maps to one of these — the mental model for the whole course.</p>`,
    `<span class="eyebrow">IAO202 · Bài 0.1 · Tổng quan</span>
<h2>Nhập môn An toàn thông tin (Vận hành an ninh mạng)</h2>
<p class="lead">Môn này rèn tư duy của một <strong>Chuyên viên vận hành an ninh mạng (SOC Analyst)</strong>: hiểu mối đe doạ, biết các hệ thống (Windows, Linux, mạng) kẻ tấn công nhắm tới, giám sát tấn công, và bảo vệ host, mạng, dữ liệu.</p>
<h3>CLO</h3>
<ul>
<li><strong>CLO1</strong> — dựng VM làm phòng lab an toàn để phân tích mối đe doạ</li>
<li><strong>CLO2</strong> — vai của Chuyên viên vận hành an ninh mạng</li>
<li><strong>CLO3–4</strong> — Windows &amp; Linux cần cho phân tích</li>
<li><strong>CLO5–6</strong> — network protocol/service; hạ tầng mạng &amp; các loại tấn công</li>
<li><strong>CLO7</strong> — công cụ giám sát mạng để phát hiện tấn công</li>
<li><strong>CLO8</strong> — chống truy cập trái phép vào mạng, host &amp; dữ liệu</li>
</ul>
<h3>Bộ ba CIA</h3>
<p>Mọi an ninh nhắm ba mục tiêu: <strong>Confidentiality</strong> (chỉ người được phép đọc dữ liệu), <strong>Integrity</strong> (dữ liệu không bị sửa trộm), <strong>Availability</strong> (hệ thống hoạt động khi cần). Mọi mối đe doạ và biện pháp đều quy về một trong ba — mô hình tư duy cho cả môn.</p>`,
  ]]);

const c1 = doc('iao202-1-1-fundamentals', '1.1 — Security fundamentals: threats, vulnerabilities & attacks|||1.1 — Nền tảng an ninh: mối đe doạ, lỗ hổng & tấn công',
  'Threat/vulnerability/risk, threat actor & động cơ, các loại malware (virus/worm/trojan/ransomware), social engineering (phishing), và defense in depth; vai SOC Analyst & lab VM.',
  [[
    `<span class="eyebrow">IAO202 · Chapter 1 · Lesson 1.1</span>
<h2>Security fundamentals</h2>
<h3>Threat, vulnerability, risk</h3>
<p>A <strong>vulnerability</strong> is a weakness; a <strong>threat</strong> is something that could exploit it; <strong>risk</strong> = likelihood × impact. A <strong>threat actor</strong> (script kiddie, cybercriminal, insider, nation-state) has motives (money, data, disruption).</p>
<h3>Common attack types</h3>
<ul>
<li><strong>Malware</strong> — virus (attaches to files), worm (self-spreads), trojan (disguised), ransomware (encrypts for ransom), spyware.</li>
<li><strong>Social engineering</strong> — <strong>phishing</strong>, pretexting, baiting: hacking the human, not the machine.</li>
<li><strong>Network attacks</strong> — DoS/DDoS, man-in-the-middle, spoofing (covered in Chapter 3).</li>
</ul>
<h3>Defense in depth &amp; the SOC analyst</h3>
<p><strong>Defense in depth</strong> layers controls (firewall + antivirus + patching + training) so no single failure is fatal. The <strong>SOC Analyst</strong> monitors alerts, triages incidents, and responds. To study attacks safely, build an isolated <strong>virtual machine</strong> lab (VirtualBox/VMware) — never analyze malware on your real machine.</p>`,
    `<span class="eyebrow">IAO202 · Chương 1 · Bài 1.1</span>
<h2>Nền tảng an ninh</h2>
<h3>Mối đe doạ, lỗ hổng, rủi ro</h3>
<p>Một <strong>vulnerability</strong> là điểm yếu; một <strong>threat</strong> là thứ có thể khai thác nó; <strong>risk</strong> = khả năng × tác động. Một <strong>threat actor</strong> (script kiddie, tội phạm mạng, nội gián, nhà nước) có động cơ (tiền, dữ liệu, phá hoại).</p>
<h3>Các loại tấn công phổ biến</h3>
<ul>
<li><strong>Malware</strong> — virus (bám vào file), worm (tự lan), trojan (nguỵ trang), ransomware (mã hoá đòi tiền chuộc), spyware.</li>
<li><strong>Social engineering</strong> — <strong>phishing</strong>, pretexting, baiting: hack con người, không phải máy.</li>
<li><strong>Tấn công mạng</strong> — DoS/DDoS, man-in-the-middle, spoofing (Chương 3).</li>
</ul>
<h3>Phòng thủ nhiều lớp &amp; SOC analyst</h3>
<p><strong>Defense in depth</strong> xếp lớp biện pháp (firewall + antivirus + vá lỗi + đào tạo) để không một điểm hỏng nào là chí mạng. <strong>SOC Analyst</strong> giám sát cảnh báo, phân loại sự cố, và ứng phó. Để học tấn công an toàn, dựng một phòng lab <strong>máy ảo</strong> cô lập (VirtualBox/VMware) — đừng bao giờ phân tích malware trên máy thật.</p>`,
  ]]);

const c1q = quiz('iao202-quiz-1', 'Quiz 1 — Fundamentals|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Bộ ba CIA gồm?', options: ['Confidentiality, Integrity, Availability', 'Control, Identity, Access', 'Cipher, Internet, Auth', 'Cost, Impact, Assets'], correctIndex: 0, explanation: 'CIA = Confidentiality, Integrity, Availability.' },
  { id: 'q2', question: 'Malware TỰ LAN qua mạng không cần file chủ là?', options: ['Virus', 'Worm', 'Trojan', 'Spyware'], correctIndex: 1, explanation: 'Worm tự nhân bản và lan; virus cần bám file chủ.' },
  { id: 'q3', question: 'Phishing tấn công vào?', options: ['Lỗ hổng phần mềm', 'Con người (social engineering)', 'Phần cứng', 'Mã hoá'], correctIndex: 1, explanation: 'Phishing là social engineering — lừa con người.' },
]);

const c2 = doc('iao202-2-1-os', '2.1 — Windows & Linux for analysts|||2.1 — Windows & Linux cho phân tích',
  'Windows (tiến trình, Registry, Event Viewer, quyền) và Linux (shell, file system, quyền rwx, log /var/log) — kiến thức OS cần để phân tích an ninh; lệnh cơ bản.',
  [[
    `<span class="eyebrow">IAO202 · Chapter 2 · Lesson 2.1</span>
<h2>Windows &amp; Linux for analysts</h2>
<p class="lead">Attackers and defenders both work at the OS level. An analyst must read processes, permissions and logs on both Windows and Linux.</p>
<h3>Windows</h3>
<ul>
<li><strong>Processes &amp; services</strong> — Task Manager, <code>tasklist</code>; malware often hides as a process.</li>
<li><strong>Registry</strong> — the config database; persistence mechanisms live here.</li>
<li><strong>Event Viewer</strong> — security/system logs (logons, failures) an analyst reviews.</li>
<li><strong>Permissions</strong> — NTFS ACLs, user/admin accounts, UAC.</li>
</ul>
<h3>Linux</h3>
<pre><code class="language-bash">ps aux              # running processes
ls -l file.txt      # permissions: -rwxr-xr-- owner group
chmod 640 file.txt  # set permissions (rw- r-- ---)
cat /var/log/auth.log   # authentication log (logins, sudo)
netstat -tulnp      # listening ports / connections
</code></pre>
<p>Linux permissions are <strong>rwx</strong> for owner/group/others (e.g. <code>chmod 640</code>). Logs in <code>/var/log</code> (auth.log, syslog) are where you spot suspicious logins. Both OSes: the analyst correlates <strong>processes + network + logs</strong> to find an intrusion.</p>`,
    `<span class="eyebrow">IAO202 · Chương 2 · Bài 2.1</span>
<h2>Windows &amp; Linux cho phân tích</h2>
<p class="lead">Kẻ tấn công và người phòng thủ đều làm việc ở tầng OS. Một analyst phải đọc được tiến trình, quyền và log trên cả Windows và Linux.</p>
<h3>Windows</h3>
<ul>
<li><strong>Tiến trình &amp; dịch vụ</strong> — Task Manager, <code>tasklist</code>; malware hay ẩn dưới dạng process.</li>
<li><strong>Registry</strong> — database cấu hình; cơ chế "bám trụ" (persistence) nằm đây.</li>
<li><strong>Event Viewer</strong> — log security/system (đăng nhập, thất bại) analyst xem.</li>
<li><strong>Quyền</strong> — NTFS ACL, tài khoản user/admin, UAC.</li>
</ul>
<h3>Linux</h3>
<pre><code class="language-bash">ps aux              # tiến trình đang chạy
ls -l file.txt      # quyền: -rwxr-xr-- owner group
chmod 640 file.txt  # đặt quyền (rw- r-- ---)
cat /var/log/auth.log   # log xác thực (đăng nhập, sudo)
netstat -tulnp      # cổng đang nghe / kết nối
</code></pre>
<p>Quyền Linux là <strong>rwx</strong> cho owner/group/others (vd <code>chmod 640</code>). Log ở <code>/var/log</code> (auth.log, syslog) là nơi phát hiện đăng nhập đáng ngờ. Cả hai OS: analyst đối chiếu <strong>tiến trình + mạng + log</strong> để tìm xâm nhập.</p>`,
  ]]);

const c2q = quiz('iao202-quiz-2', 'Quiz 2 — OS|||Quiz 2 — Hệ điều hành', [
  { id: 'q1', question: 'Log xác thực trên Linux thường ở?', options: ['/etc/passwd', '/var/log/auth.log', '/home', '/bin'], correctIndex: 1, explanation: '/var/log/auth.log ghi đăng nhập, sudo.' },
  { id: 'q2', question: 'chmod 640 file cho quyền?', options: ['rwx cho tất cả', 'owner rw-, group r--, others ---', 'chỉ đọc tất cả', 'rwx owner only'], correctIndex: 1, explanation: '6=rw-, 4=r--, 0=--- → owner rw, group r, others none.' },
  { id: 'q3', question: 'Trên Windows, cơ chế persistence của malware hay nằm ở?', options: ['Task Manager', 'Registry', 'Recycle Bin', 'Desktop'], correctIndex: 1, explanation: 'Registry (Run keys…) là chỗ malware bám để tự khởi động.' },
]);

const c3 = doc('iao202-3-1-network-attacks', '3.1 — Network protocols & attacks|||3.1 — Giao thức mạng & tấn công',
  'Mô hình TCP/IP, các giao thức (IP/TCP/UDP/DNS/HTTP/ARP), và các tấn công mạng (DoS/DDoS, MITM, ARP/DNS spoofing, port scan); vì sao hiểu protocol để phát hiện tấn công.',
  [[
    `<span class="eyebrow">IAO202 · Chapter 3 · Lesson 3.1</span>
<h2>Network protocols &amp; attacks</h2>
<h3>The stack &amp; key protocols</h3>
<p>The <strong>TCP/IP</strong> model: Application (HTTP, DNS) → Transport (TCP reliable, UDP fast) → Internet (IP addressing, routing) → Link (Ethernet, ARP). An analyst reads packets to see what's really happening — attacks abuse these protocols.</p>
<h3>Common network attacks</h3>
<ul>
<li><strong>DoS / DDoS</strong> — flood a service so it can't serve real users (Availability).</li>
<li><strong>Man-in-the-Middle (MITM)</strong> — intercept traffic between two parties.</li>
<li><strong>ARP spoofing</strong> — forge ARP replies to redirect LAN traffic to the attacker (enables MITM).</li>
<li><strong>DNS spoofing</strong> — return fake DNS answers to send victims to malicious sites.</li>
<li><strong>Port scanning / reconnaissance</strong> — map open ports (e.g. <code>nmap</code>) before attacking.</li>
</ul>
<p>Because these attacks manipulate protocols, <strong>knowing normal protocol behavior lets you spot the abnormal</strong> — a flood of SYN packets (SYN flood), gratuitous ARP replies, or unexpected DNS responses stand out in a capture.</p>`,
    `<span class="eyebrow">IAO202 · Chương 3 · Bài 3.1</span>
<h2>Giao thức mạng &amp; tấn công</h2>
<h3>Ngăn xếp &amp; các giao thức chính</h3>
<p>Mô hình <strong>TCP/IP</strong>: Application (HTTP, DNS) → Transport (TCP tin cậy, UDP nhanh) → Internet (địa chỉ IP, định tuyến) → Link (Ethernet, ARP). Analyst đọc gói tin để thấy thực sự đang xảy ra gì — tấn công lạm dụng các giao thức này.</p>
<h3>Các tấn công mạng phổ biến</h3>
<ul>
<li><strong>DoS / DDoS</strong> — làm ngập một dịch vụ để nó không phục vụ người dùng thật (Availability).</li>
<li><strong>Man-in-the-Middle (MITM)</strong> — chặn lưu lượng giữa hai bên.</li>
<li><strong>ARP spoofing</strong> — giả ARP reply để chuyển hướng lưu lượng LAN về kẻ tấn công (mở đường MITM).</li>
<li><strong>DNS spoofing</strong> — trả DNS giả để đưa nạn nhân tới site độc.</li>
<li><strong>Port scan / do thám</strong> — dò cổng mở (vd <code>nmap</code>) trước khi tấn công.</li>
</ul>
<p>Vì các tấn công này thao túng giao thức, <strong>biết hành vi bình thường của giao thức giúp bạn phát hiện bất thường</strong> — một trận SYN (SYN flood), ARP reply thừa, hay phản hồi DNS lạ sẽ nổi bật trong bản capture.</p>`,
  ]]);

const c3e = doc('iao202-3-2-exercise', 'Exercise 1 — read a suspicious log|||Bài tập 1 — đọc log đáng ngờ',
  'Bài tập: cho vài dòng auth.log, xác định dấu hiệu brute-force và đề xuất biện pháp; kèm lời giải.',
  [[
    `<span class="eyebrow">IAO202 · Chapter 3 · Exercise</span>
<h2>Exercise 1 — spot the attack in a log</h2>
<div class="callout"><span class="badge">Đề</span> These auth.log lines appear in seconds. What attack is this, and what would you do?</div>
<pre><code class="language-text">Failed password for root from 203.0.113.9 port 51122 ssh2
Failed password for root from 203.0.113.9 port 51124 ssh2
Failed password for admin from 203.0.113.9 port 51130 ssh2
Failed password for root from 203.0.113.9 port 51135 ssh2
... (hundreds more from the same IP) ...
</code></pre>
<h3>Worked solution</h3>
<p><strong>Diagnosis: an SSH brute-force attack.</strong> One IP (203.0.113.9) is trying many passwords for common accounts (root, admin) in rapid succession — the signature of automated credential guessing.</p>
<p><strong>Response (defense in depth):</strong></p>
<ul>
<li><strong>Block the IP</strong> at the firewall; deploy <strong>fail2ban</strong> to auto-ban IPs after N failures.</li>
<li><strong>Disable root SSH login</strong> and password auth; use <strong>SSH keys</strong> only.</li>
<li>Enforce strong passwords / MFA; move SSH off the default port; alert on repeated failures.</li>
</ul>
<p><strong>Why:</strong> the pattern (many failures, one source, common usernames, high rate) is unmistakable in the log — exactly why an analyst reads logs. The controls layer prevention (keys, MFA) with detection (fail2ban, alerts).</p>`,
    `<span class="eyebrow">IAO202 · Chương 3 · Bài tập</span>
<h2>Bài tập 1 — bắt tấn công trong log</h2>
<div class="callout"><span class="badge">Đề</span> Các dòng auth.log này xuất hiện trong vài giây. Đây là tấn công gì, và bạn sẽ làm gì?</div>
<pre><code class="language-text">Failed password for root from 203.0.113.9 port 51122 ssh2
Failed password for root from 203.0.113.9 port 51124 ssh2
Failed password for admin from 203.0.113.9 port 51130 ssh2
Failed password for root from 203.0.113.9 port 51135 ssh2
... (hàng trăm dòng nữa từ cùng IP) ...
</code></pre>
<h3>Lời giải</h3>
<p><strong>Chẩn đoán: tấn công brute-force SSH.</strong> Một IP (203.0.113.9) thử nhiều mật khẩu cho tài khoản phổ biến (root, admin) liên tiếp — dấu hiệu đoán credential tự động.</p>
<p><strong>Ứng phó (phòng thủ nhiều lớp):</strong></p>
<ul>
<li><strong>Chặn IP</strong> ở firewall; triển khai <strong>fail2ban</strong> tự cấm IP sau N lần thất bại.</li>
<li><strong>Tắt đăng nhập SSH bằng root</strong> và password; chỉ dùng <strong>SSH key</strong>.</li>
<li>Bắt mật khẩu mạnh / MFA; đổi SSH khỏi cổng mặc định; cảnh báo khi thất bại lặp.</li>
</ul>
<p><strong>Vì sao:</strong> mẫu (nhiều thất bại, một nguồn, username phổ biến, tốc độ cao) rõ mồn một trong log — đúng lý do analyst đọc log. Các biện pháp xếp lớp phòng ngừa (key, MFA) với phát hiện (fail2ban, cảnh báo).</p>`,
  ]]);

const c3q = quiz('iao202-quiz-3', 'Quiz 3 — Network attacks|||Quiz 3 — Tấn công mạng', [
  { id: 'q1', question: 'DoS/DDoS tấn công vào mục tiêu CIA nào?', options: ['Confidentiality', 'Integrity', 'Availability', 'Không cái nào'], correctIndex: 2, explanation: 'DoS làm dịch vụ không khả dụng → Availability.' },
  { id: 'q2', question: 'ARP spoofing cho phép kẻ tấn công?', options: ['Mã hoá dữ liệu', 'Chuyển hướng lưu lượng LAN về mình (mở MITM)', 'Tăng băng thông', 'Vá lỗ hổng'], correctIndex: 1, explanation: 'Giả ARP reply để traffic đi qua kẻ tấn công.' },
  { id: 'q3', question: 'Nhiều "Failed password" từ một IP trong vài giây là dấu hiệu?', options: ['Người dùng quên mật khẩu', 'Brute-force', 'Cập nhật hệ thống', 'DNS lỗi'], correctIndex: 1, explanation: 'Đoán mật khẩu tự động tốc độ cao = brute-force.' },
]);

const c4 = doc('iao202-4-1-monitoring-defense', '4.1 — Monitoring & defense|||4.1 — Giám sát & phòng thủ',
  'Firewall, IDS/IPS, SIEM & phân tích log, kiểm soát truy cập (AAA, least privilege), mã hoá & vá lỗi; quy trình ứng phó sự cố (phát hiện → ngăn chặn → khôi phục).',
  [[
    `<span class="eyebrow">IAO202 · Chapter 4 · Lesson 4.1</span>
<h2>Monitoring &amp; defense</h2>
<h3>Detect</h3>
<ul>
<li><strong>Firewall</strong> — filters traffic by rules (allow/deny by IP/port).</li>
<li><strong>IDS/IPS</strong> — Intrusion Detection/Prevention: signatures + anomalies flag or block attacks.</li>
<li><strong>SIEM</strong> — collects and correlates logs from many sources so an analyst sees the whole picture; packet tools like <strong>Wireshark</strong> inspect traffic.</li>
</ul>
<h3>Prevent</h3>
<ul>
<li><strong>Access control (AAA)</strong> — Authentication, Authorization, Accounting; apply <strong>least privilege</strong> (give the minimum access needed).</li>
<li><strong>Encryption</strong> — protect data in transit (TLS) and at rest.</li>
<li><strong>Patching &amp; hardening</strong> — close known vulnerabilities; disable unused services.</li>
</ul>
<h3>Respond — the incident lifecycle</h3>
<p><strong>Prepare → Detect → Contain → Eradicate → Recover → Lessons learned.</strong> When an attack is confirmed: isolate affected hosts, remove the threat, restore from clean backups, and improve controls so it can't recur. The SOC analyst runs this loop continuously.</p>`,
    `<span class="eyebrow">IAO202 · Chương 4 · Bài 4.1</span>
<h2>Giám sát &amp; phòng thủ</h2>
<h3>Phát hiện</h3>
<ul>
<li><strong>Firewall</strong> — lọc lưu lượng theo luật (cho/chặn theo IP/cổng).</li>
<li><strong>IDS/IPS</strong> — Phát hiện/Ngăn xâm nhập: chữ ký + bất thường để cảnh báo hoặc chặn tấn công.</li>
<li><strong>SIEM</strong> — gom và đối chiếu log từ nhiều nguồn để analyst thấy toàn cảnh; công cụ gói như <strong>Wireshark</strong> soi lưu lượng.</li>
</ul>
<h3>Phòng ngừa</h3>
<ul>
<li><strong>Kiểm soát truy cập (AAA)</strong> — Authentication, Authorization, Accounting; áp <strong>least privilege</strong> (cấp quyền tối thiểu cần).</li>
<li><strong>Mã hoá</strong> — bảo vệ dữ liệu khi truyền (TLS) và khi lưu.</li>
<li><strong>Vá &amp; hardening</strong> — bịt lỗ hổng đã biết; tắt dịch vụ không dùng.</li>
</ul>
<h3>Ứng phó — vòng đời sự cố</h3>
<p><strong>Chuẩn bị → Phát hiện → Ngăn chặn → Diệt trừ → Khôi phục → Rút kinh nghiệm.</strong> Khi xác nhận tấn công: cô lập host bị ảnh hưởng, gỡ mối đe doạ, phục hồi từ backup sạch, và cải thiện biện pháp để không tái diễn. SOC analyst chạy vòng này liên tục.</p>`,
  ]]);

const c4q = quiz('iao202-quiz-4', 'Quiz 4 — Monitoring & defense|||Quiz 4 — Giám sát & phòng thủ', [
  { id: 'q1', question: 'IDS/IPS làm gì?', options: ['Mã hoá dữ liệu', 'Phát hiện/ngăn xâm nhập (signature + anomaly)', 'Sao lưu', 'Cấp phát IP'], correctIndex: 1, explanation: 'IDS phát hiện, IPS ngăn; dùng chữ ký và bất thường.' },
  { id: 'q2', question: 'Nguyên tắc "least privilege" nghĩa là?', options: ['Cấp toàn quyền cho tiện', 'Cấp quyền TỐI THIỂU cần thiết', 'Không phân quyền', 'Chỉ admin'], correctIndex: 1, explanation: 'Least privilege giảm bề mặt tấn công khi tài khoản bị chiếm.' },
  { id: 'q3', question: 'Thứ tự đúng của vòng ứng phó sự cố?', options: ['Recover → Detect → Contain', 'Detect → Contain → Eradicate → Recover', 'Contain → Recover → Detect', 'Chỉ Recover'], correctIndex: 1, explanation: 'Phát hiện → ngăn chặn → diệt trừ → khôi phục (→ rút kinh nghiệm).' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'IAO202',
    slug: 'iao202-information-assurance-overview',
    title: 'Information Assurance Overview',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/IAO202.webp',
    shortDescription: 'Think like a SOC analyst — the CIA triad, threats & attacks, Windows/Linux, network protocols & attacks, monitoring & defense. Bilingual, with a log-analysis exercise.|||Tư duy như SOC analyst — bộ ba CIA, mối đe doạ & tấn công, Windows/Linux, giao thức & tấn công mạng, giám sát & phòng thủ. Song ngữ, có bài tập phân tích log.',
    description: 'Môn <strong>IAO202 — Nhập môn An toàn thông tin</strong> (ngành CNTT, kỳ 4), theo hướng <strong>vận hành an ninh mạng (CyberOps/SOC)</strong>. Đi từ <strong>nền tảng an ninh</strong> (bộ ba CIA, mối đe doạ, malware, social engineering, defense in depth) → <strong>Windows &amp; Linux</strong> cho phân tích → <strong>giao thức mạng &amp; tấn công</strong> (TCP/IP, DoS/MITM/ARP-DNS spoofing) → <strong>giám sát &amp; phòng thủ</strong> (firewall, IDS/IPS, SIEM, AAA, ứng phó sự cố). Bám giáo trình FLM (8 CLO), song ngữ, kèm bài tập phân tích log.',
    whatYouLearn: 'Bộ ba CIA; threat/vulnerability/risk & threat actor; malware (virus/worm/trojan/ransomware) & phishing; defense in depth; vai SOC analyst & lab VM; Windows (process/Registry/Event Viewer/quyền) & Linux (shell, quyền rwx, /var/log); TCP/IP & giao thức; tấn công mạng (DoS/DDoS, MITM, ARP/DNS spoofing, port scan); firewall, IDS/IPS, SIEM/Wireshark; access control (AAA, least privilege), mã hoá, vá lỗi; vòng ứng phó sự cố.',
    requirements: 'Nên biết mạng cơ bản và dùng máy tính thành thạo. Cần VirtualBox/VMware để dựng lab máy ảo an toàn.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'CIA triad, vai SOC analyst, 8 CLO, lộ trình.', lessons: [intro] },
    { title: 'Chương 1 — Nền tảng an ninh|||Chapter 1 — Security fundamentals', description: 'Threat/vuln/risk, malware, phishing, defense in depth.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Windows & Linux|||Chapter 2 — Windows & Linux', description: 'Process, quyền, log cho phân tích.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Giao thức & tấn công mạng|||Chapter 3 — Network protocols & attacks', description: 'TCP/IP, DoS/MITM/spoofing, đọc log.', lessons: [c3, c3e, c3q] },
    { title: 'Chương 4 — Giám sát & phòng thủ|||Chapter 4 — Monitoring & defense', description: 'Firewall, IDS/IPS, SIEM, AAA, ứng phó.', lessons: [c4, c4q] },
  ],
};
