/**
 * 8.3 — Đọc auth.log và secure (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s08/auth'] + OUT['s08/auth2'] — lab7 (Ubuntu 24.04, OpenSSH 9.6, sudo 1.9.15) nhận đăng nhập từ máy ảo thứ hai
 * "keodo" trong mạng lab 192.168.56.0/24 (keodo có nhiều IP: .20 = máy quản trị "quen", .88/.77/.66 = "kẻ dò"). 172.17.0.1 là kênh
 * điều khiển của chính người soạn (người dùng hv, bằng khoá) — lọc bỏ khi đọc. Rocky 9 trong docker run --rm.
 * Lưu ý: auth.bash đã chạy 2 lượt (05:14 và 05:15) nên một số lệnh đếm gộp cả hai lượt; auth2 lọc đúng cửa sổ lượt 2.
 * Nguồn: sshd_config(5) (OpenBSD man), sudoers(5), pam_unix(8); Threatpost 08/2020 (FritzFrog — Guardicore Labs);
 * ESET WeLiveSecurity 05/2024 (Ebury); MITRE T1110.003.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '8.3 — Reading auth.log and secure: sshd Accepted/Failed/Invalid user, sudo, su, PAM|||8.3 — Đọc auth.log và secure: sshd Accepted/Failed/Invalid user, sudo, su, PAM',
  slug: 'log-8-3-auth-log',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đọc từng phần của dòng sshd (Accepted password/publickey, dấu vân tay khoá, Failed password for invalid user, Connection closed [preauth]), dòng sudo (lệnh nào, với quyền gì, sai mật khẩu, NOT in sudoers), su và PAM, phiên đăng nhập systemd-logind. Đếm IP dò mật khẩu, tên bị thử, số kết nối — và cái bẫy thật: lệnh sudo grep tự ghi vào auth.log nên số đếm tăng mỗi lần chạy. Bắt dòng "vào được sau chuỗi thất bại". Góc hacker: FritzFrog 2020 dò SSH rồi cài khoá vào authorized_keys; Ebury 2024 — 400.000 máy chủ, log trông bình thường.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Reading auth.log: who came in, who tried, who became root</h2>
<p class="lead"><code>auth.log</code> (Debian/Ubuntu) and <code>secure</code> (RHEL) collect everything about identity: SSH logins, sudo, su, account changes, PAM. In this lesson a second VM, <strong>keodo</strong>, logs in to lab7 from several addresses: <code>192.168.56.20</code> plays the admin's usual machine, <code>.88</code> plays a stranger guessing passwords. (Lines from <code>172.17.0.1</code> are the lab's own control channel and are filtered out.)</p>

<h3>The everyday picture: the security guard's book</h3>
<p>At the gate a guard writes: "08:02 — Mr An, badge checked, entered. 08:05 — unknown man said he was 'Oracle from IT', no badge, refused. 08:06 — same man, tried again." auth.log is that book. The skill is not reading one line — it is noticing that the man refused at 08:05 came back at 08:20 and was let in.</p>

<h3>Step 1 — set the scene: two accounts</h3>
${lenh('s08/auth', 0)}
${lenh('s08/auth', 1)}
<p>Account creation is logged too: who ran it (<code>sudo: hv : … COMMAND=/usr/sbin/useradd …</code>), what was created (<code>new user: name=dev, UID=1002 …</code>) and that a password was set (<code>chpasswd … password changed for dev</code>). An unexpected <code>useradd</code> on a server is one of the reddest lines in this file.</p>

<h3>Step 2 — logins, good and bad</h3>
${lenh('s08/auth', 2)}
${lenh('s08/auth', 3)}
${lenh('s08/auth', 4)}
${lenh('s08/auth', 5)}
${lenh('s08/auth', 6)}
${lenh('s08/auth', 7)}
${lenh('s08/auth', 10)}
<p>Read the sshd lines field by field:</p>
<table>
<tr><th>Line</th><th>Means</th></tr>
<tr><td><code>Accepted password for dev from 192.168.56.88 port 46175 ssh2</code></td><td>Logged in with a <strong>password</strong>. The port is the client's random source port — useless for identity, useful to match the later <code>Disconnected</code> line.</td></tr>
<tr><td><code>Accepted publickey for hv … ssh2: ED25519 SHA256:fxala9…</code></td><td>Logged in with a <strong>key</strong>; the fingerprint tells you <em>which</em> key. Compare with <code>ssh-keygen -lf ~/.ssh/authorized_keys</code> (Lab 8 does this).</td></tr>
<tr><td><code>Failed password for root from …</code></td><td>The account exists, the password was wrong. Note: this server has <code>permitrootlogin without-password</code> — a password for root is refused <em>even if it is correct</em>.</td></tr>
<tr><td><code>Invalid user postgres from …</code> then <code>Failed password for invalid user postgres</code></td><td>The account <strong>does not exist</strong>: someone is guessing names. sshd still asks for a password so the attacker cannot tell which names are real.</td></tr>
<tr><td><code>Connection closed by invalid user … [preauth]</code></td><td>The client gave up before authentication finished.</td></tr>
<tr><td><code>Disconnected from user dev …</code></td><td>Normal end of a session that had logged in.</td></tr>
</table>

<h3>Step 3 — sudo and su: who became root, and for what</h3>
${lenh('s08/auth', 8)}
${lenh('s08/auth', 9)}
${lenh('s08/auth', 11)}
<p>The sudo line format is: <code>WHO : [problem ;] TTY=… ; PWD=… ; USER=as-whom ; COMMAND=what</code>.</p>
<ul>
<li><code>an : TTY=pts/0 ; … USER=root ; COMMAND=/usr/bin/systemctl restart rsyslog</code> — allowed and run. This is your audit trail of admin actions.</li>
<li><code>an : 1 incorrect password attempt ; … COMMAND=/usr/bin/cat /etc/shadow</code> — a sudoer typed the wrong password.</li>
<li><code>dev : user NOT in sudoers ; … COMMAND=/usr/bin/cat /etc/shadow</code> — <strong>a non-admin tried to become root</strong>. On a real server, investigate every one.</li>
<li><code>su: pam_unix(su:auth): authentication failure; logname=dev … user=an</code> + <code>FAILED SU (to an) dev</code> — dev tried to switch to an's account.</li>
</ul>
<p>The sudo lines show the whole command line. That is great for auditing — and a trap: anything typed on a sudo command line (a password in <code>mysql -pSecret</code>, a token in a curl header) ends up in auth.log.</p>
${lenh('s08/auth', 12)}
<p>Sessions: <code>pam_unix(sshd:session): session opened for user dev(uid=1002) by dev(uid=0)</code> and <code>systemd-logind: New session 334 of user dev</code>. The session number lets you join with <code>loginctl</code> and with auditd's <code>ses=</code> field (8.4).</p>

<h3>Step 4 — counting, and the trap that inflates your numbers</h3>
${lenh('s08/auth2', 0)}
<p>Same command three times, three different answers: 196, 197, 198. Why?</p>
${lenh('s08/auth2', 1)}
<p>The last "Failed password" line is <strong>our own grep</strong>: sudo logs its full command line, which contains the words we searched for. Every investigation command adds a matching line. In a report, "196 failed logins" would be wrong. Two fixes: anchor the pattern on the program (<code>sshd\\[[0-9]*\\]: Failed password</code>), and take a copy of the time window first, then work on the copy without sudo:</p>
${lenh('s08/auth2', 2)}
<p>In this 26-second window: 12 lines contain the words, only 7 are real sshd failures. Now count properly:</p>
${lenh('s08/auth2', 3)}
${lenh('s08/auth2', 4)}
${lenh('s08/auth2', 5)}
${lenh('s08/auth2', 6)}
<p>Three different counts answer three different questions: <strong>lines</strong> (7 failed passwords), <strong>connections</strong> (4 sshd PIDs — one connection may try several passwords, up to <code>MaxAuthTries</code> = 6) and <strong>names</strong> (oracle and postgres do not exist). Say which one you mean.</p>

<h3>Step 5 — the red line: success after failures</h3>
${lenh('s08/auth2', 7)}
<p>An IP that failed 7 times and then <strong>got in</strong> is the most important pattern in this file: either a user who forgot a password (call them) or a guessed password (incident). The awk program remembers failures per IP and prints every later <code>Accepted</code> from the same IP. The original lab run over both rounds shows the same thing:</p>
${lenh('s08/auth', 16)}

<h3>Step 6 — the same data from the journal, and on Red Hat</h3>
${lenh('s08/auth', 17)}
${lenh('s08/auth', 18)}
<p>The journal has the same lines with trusted fields: <code>_COMM=sudo</code> cannot be faked by another program (7.1), and <code>-o json | jq</code> gives the PID for free. (These two commands covered the last 10 minutes, so they include both lab rounds.) On RHEL, the rule <code>authpriv.*</code> sends the same lines to <code>/var/log/secure</code>, and sshd's own settings decide what gets logged:</p>
${lenh('s08/auth', 19)}
${lenh('s08/auth', 20)}
<p><code>LogLevel INFO</code> is the default; <code>VERBOSE</code> adds more detail on key authentication. <code>SyslogFacility AUTH</code> is why sshd lines land in auth.log.</p>

<h3>Hacker's corner: what a successful brute force looks like afterwards</h3>
<p><strong>FritzFrog (Guardicore Labs, August 2020):</strong> a peer-to-peer botnet that brute-forced SSH servers since January 2020 — governments, universities, banks, medical centres, telecoms. After getting in, it <strong>added its own public key to <code>authorized_keys</code></strong> so it could return without a password even if the password was changed. In auth.log that is a chain: many <code>Failed password</code> → one <code>Accepted password</code> → later <code>Accepted publickey</code> with an unknown fingerprint. Lab 8 rebuilds exactly this chain.</p>
<p><strong>Ebury (ESET, May 2024):</strong> an OpenSSH backdoor and credential stealer, about <strong>400,000</strong> Linux/BSD servers compromised since 2009, more than 100,000 still infected at the end of 2023. Attackers logged in with <em>stolen real passwords</em> — the log shows a normal <code>Accepted password</code>. Lesson: "no failed logins" does not mean "safe". Compare logins with a baseline: usual source IPs, usual hours, password vs key.</p>
<p>Guessing one common password against many accounts — what our <code>.88</code> did with <code>123456</code> — is MITRE ATT&amp;CK <strong>T1110.003 Password Spraying</strong>.</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>Customer asks: "Was our server hacked?"</strong> Never answer from one grep. Answer with: time window, number of failed attempts and sources, every <code>Accepted</code> in the window with method and IP, any success after failures, any <code>useradd</code>/<code>NOT in sudoers</code>, and whether the counts were taken without self-matching.</li>
<li><strong>OJT on a shared dev server:</strong> a teammate's script runs <code>sudo mysql -p'…'</code>. Show them the auth.log line with the password and move the secret to a config file readable only by the service.</li>
<li><strong>Morning check on a VPS:</strong> <code>grep -c 'sshd\\[[0-9]*\\]: Failed password'</code> on yesterday's file is noise if password login is off; what matters is the list of <code>Accepted</code> lines.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>On your VM: list every <code>Accepted</code> line of today with method, user and IP (one awk line).</li>
<li>Reproduce the self-matching trap: run <code>sudo grep -c 'Failed password' /var/log/auth.log</code> three times. Then write a version that gives the same number every time.</li>
<li>From a second machine, try one wrong password for a non-existent user and one for an existing user. Find both pairs of lines and explain the difference.</li>
<li>Run <code>sudo -l</code> as a user without sudo rights and find the line it produced.</li>
</ol>
<p><strong>Done when:</strong> your counts are stable across runs, and you can say for each line whether the account exists and which authentication method was used.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['Accepted password / publickey', 'Successful SSH login and its method; publickey lines carry the key fingerprint (SHA256:…).'],
  ['Invalid user', 'The username does not exist on this machine — name guessing.'],
  ['[preauth]', 'Event before authentication completed (client gave up or was cut off).'],
  ['NOT in sudoers', 'A user without sudo rights tried to run a command as root.'],
  ['MaxAuthTries', 'Max password/key attempts per connection (default 6) — lines ≠ connections.'],
  ['self-matching', 'A sudo grep logs its own command line, so the search finds itself.'],
  ['password spraying (T1110.003)', 'One common password tried against many accounts.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>sshd lines tell you method (password/key), user, existence of the account and source IP.</li>
<li>sudo lines are an audit trail of commands — and leak anything typed on the command line.</li>
<li>Anchor patterns on the program name and work on a copy, or your own commands inflate the counts.</li>
<li>Lines, connections and names are different counts; state which one.</li>
<li>Success after failures from the same IP is the red line; a quiet log is not proof of safety.</li>
</ul>
${nguon('📘', 'sshd_config(5)', 'LogLevel, SyslogFacility, MaxAuthTries, PermitRootLogin', 'https://man.openbsd.org/sshd_config')}
${nguon('📘', 'sudoers(5) — logging', 'What sudo writes for each command', 'https://www.sudo.ws/docs/man/sudoers.man/')}
${nguon('📰', 'Threatpost (2020) — FritzFrog botnet', 'Guardicore Labs: SSH brute force + authorized_keys backdoor', 'https://threatpost.com/fritzfrog-botnet-millions-ssh-servers/158489/')}
${nguon('📰', 'ESET WeLiveSecurity (2024) — Ebury', '400,000 servers compromised since 2009', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}
${nguon('🛡', 'MITRE ATT&CK T1110.003', 'Brute Force: Password Spraying', 'https://attack.mitre.org/techniques/T1110/003/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-4-5-chong-do', title: 'Network Security 4.5 — Stopping password guessing', sub: 'fail2ban / CrowdSec — blocking, not just reading' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-1-brute-force', title: 'Lesson 14.1 — Brute force across sources', sub: 'The same pattern in Windows, web and VPN logs' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Đọc auth.log: ai đã vào, ai đã thử, ai đã thành root</h2>
<p class="lead"><code>auth.log</code> (Debian/Ubuntu) và <code>secure</code> (RHEL) gom mọi thứ về danh tính: đăng nhập SSH, sudo, su, thay đổi tài khoản, PAM. Trong bài này, máy ảo thứ hai <strong>keodo</strong> đăng nhập vào lab7 từ nhiều địa chỉ: <code>192.168.56.20</code> đóng vai máy quen của quản trị viên, <code>.88</code> đóng vai người lạ đoán mật khẩu. (Các dòng từ <code>172.17.0.1</code> là kênh điều khiển của chính lab, được lọc bỏ.)</p>

<h3>Liên tưởng đời thường: sổ của bảo vệ</h3>
<p>Ở cổng, bác bảo vệ ghi: "08:02 — anh An, kiểm thẻ, cho vào. 08:05 — một người lạ xưng 'Oracle bên IT', không có thẻ, từ chối. 08:06 — vẫn người đó, thử lại." auth.log chính là cuốn sổ ấy. Kỹ năng không nằm ở đọc một dòng — mà ở chỗ nhận ra người bị từ chối lúc 08:05 quay lại lúc 08:20 và được cho vào.</p>

<h3>Bước 1 — dựng bối cảnh: hai tài khoản</h3>
${lenh('s08/auth', 0)}
${lenh('s08/auth', 1)}
<p>Việc tạo tài khoản cũng được ghi: ai chạy (<code>sudo: hv : … COMMAND=/usr/sbin/useradd …</code>), tạo ra cái gì (<code>new user: name=dev, UID=1002 …</code>) và mật khẩu đã được đặt (<code>chpasswd … password changed for dev</code>). Một dòng <code>useradd</code> không ai dự kiến trên máy chủ là một trong những dòng đỏ nhất của tệp này.</p>

<h3>Bước 2 — đăng nhập, tốt và xấu</h3>
${lenh('s08/auth', 2)}
${lenh('s08/auth', 3)}
${lenh('s08/auth', 4)}
${lenh('s08/auth', 5)}
${lenh('s08/auth', 6)}
${lenh('s08/auth', 7)}
${lenh('s08/auth', 10)}
<p>Đọc từng trường của dòng sshd:</p>
<table>
<tr><th>Dòng</th><th>Nghĩa là</th></tr>
<tr><td><code>Accepted password for dev from 192.168.56.88 port 46175 ssh2</code></td><td>Vào bằng <strong>mật khẩu</strong>. Port là cổng nguồn ngẫu nhiên của máy khách — vô dụng để nhận diện, hữu ích để ghép với dòng <code>Disconnected</code> sau đó.</td></tr>
<tr><td><code>Accepted publickey for hv … ssh2: ED25519 SHA256:fxala9…</code></td><td>Vào bằng <strong>khoá</strong>; dấu vân tay cho biết <em>khoá nào</em>. Đối chiếu với <code>ssh-keygen -lf ~/.ssh/authorized_keys</code> (Lab 8 sẽ làm).</td></tr>
<tr><td><code>Failed password for root from …</code></td><td>Tài khoản có thật, mật khẩu sai. Để ý: máy này đặt <code>permitrootlogin without-password</code> — mật khẩu của root bị từ chối <em>kể cả khi đúng</em>.</td></tr>
<tr><td><code>Invalid user postgres from …</code> rồi <code>Failed password for invalid user postgres</code></td><td>Tài khoản <strong>không tồn tại</strong>: ai đó đang đoán tên. sshd vẫn hỏi mật khẩu để kẻ dò không biết tên nào là thật.</td></tr>
<tr><td><code>Connection closed by invalid user … [preauth]</code></td><td>Máy khách bỏ cuộc trước khi xác thực xong.</td></tr>
<tr><td><code>Disconnected from user dev …</code></td><td>Kết thúc bình thường của một phiên đã vào được.</td></tr>
</table>

<h3>Bước 3 — sudo và su: ai thành root, để làm gì</h3>
${lenh('s08/auth', 8)}
${lenh('s08/auth', 9)}
${lenh('s08/auth', 11)}
<p>Khuôn của dòng sudo: <code>AI : [vấn đề ;] TTY=… ; PWD=… ; USER=với-quyền-ai ; COMMAND=lệnh-gì</code>.</p>
<ul>
<li><code>an : TTY=pts/0 ; … USER=root ; COMMAND=/usr/bin/systemctl restart rsyslog</code> — được phép và đã chạy. Đây là dấu vết kiểm toán các thao tác quản trị.</li>
<li><code>an : 1 incorrect password attempt ; … COMMAND=/usr/bin/cat /etc/shadow</code> — một người có quyền sudo gõ sai mật khẩu.</li>
<li><code>dev : user NOT in sudoers ; … COMMAND=/usr/bin/cat /etc/shadow</code> — <strong>một người không phải quản trị cố lên root</strong>. Trên máy chủ thật, điều tra từng dòng như vậy.</li>
<li><code>su: pam_unix(su:auth): authentication failure; logname=dev … user=an</code> + <code>FAILED SU (to an) dev</code> — dev cố chuyển sang tài khoản của an.</li>
</ul>
<p>Dòng sudo ghi nguyên dòng lệnh. Rất tốt cho kiểm toán — và là một cái bẫy: bất cứ gì gõ trên dòng lệnh sudo (mật khẩu trong <code>mysql -pSecret</code>, token trong header của curl) đều nằm lại trong auth.log.</p>
${lenh('s08/auth', 12)}
<p>Phiên: <code>pam_unix(sshd:session): session opened for user dev(uid=1002) by dev(uid=0)</code> và <code>systemd-logind: New session 334 of user dev</code>. Số phiên giúp ghép với <code>loginctl</code> và với trường <code>ses=</code> của auditd (Bài 8.4).</p>

<h3>Bước 4 — đếm, và cái bẫy làm phình con số</h3>
${lenh('s08/auth2', 0)}
<p>Cùng một lệnh chạy ba lần, ba đáp số: 196, 197, 198. Vì sao?</p>
${lenh('s08/auth2', 1)}
<p>Dòng "Failed password" cuối cùng chính là <strong>lệnh grep của ta</strong>: sudo ghi nguyên dòng lệnh, mà dòng lệnh chứa đúng cụm từ ta đang tìm. Mỗi lệnh điều tra lại thêm một dòng khớp. Viết "196 lần đăng nhập hỏng" vào báo cáo là sai. Hai cách sửa: neo mẫu vào tên chương trình (<code>sshd\\[[0-9]*\\]: Failed password</code>), và chép cửa sổ thời gian ra trước rồi làm việc trên bản chép, không cần sudo nữa:</p>
${lenh('s08/auth2', 2)}
<p>Trong cửa sổ 26 giây này: 12 dòng chứa cụm từ, chỉ 7 dòng là lần hỏng thật của sshd. Giờ đếm cho đúng:</p>
${lenh('s08/auth2', 3)}
${lenh('s08/auth2', 4)}
${lenh('s08/auth2', 5)}
${lenh('s08/auth2', 6)}
<p>Ba cách đếm trả lời ba câu hỏi khác nhau: <strong>số dòng</strong> (7 lần sai mật khẩu), <strong>số kết nối</strong> (4 PID sshd — một kết nối có thể thử nhiều mật khẩu, tối đa <code>MaxAuthTries</code> = 6) và <strong>số tên</strong> (oracle và postgres không tồn tại). Nói rõ bạn đang đếm cái nào.</p>

<h3>Bước 5 — dòng đỏ: vào được sau chuỗi thất bại</h3>
${lenh('s08/auth2', 7)}
<p>Một IP sai 7 lần rồi <strong>vào được</strong> là mẫu quan trọng nhất của tệp này: hoặc là người dùng quên mật khẩu (gọi điện hỏi), hoặc mật khẩu đã bị đoán trúng (sự cố). Chương trình awk ghi nhớ số lần sai theo IP và in mọi dòng <code>Accepted</code> về sau từ cùng IP đó. Lần chạy gốc gộp cả hai lượt lab cũng cho thấy đúng điều này:</p>
${lenh('s08/auth', 16)}

<h3>Bước 6 — cùng dữ liệu đó từ journal, và trên Red Hat</h3>
${lenh('s08/auth', 17)}
${lenh('s08/auth', 18)}
<p>Journal có đúng các dòng đó kèm trường tin cậy: <code>_COMM=sudo</code> không chương trình nào khác giả được (Bài 7.1), và <code>-o json | jq</code> cho luôn PID. (Hai lệnh này lấy 10 phút gần nhất nên gồm cả hai lượt lab.) Trên RHEL, luật <code>authpriv.*</code> gửi các dòng này vào <code>/var/log/secure</code>, còn chính cấu hình của sshd quyết định ghi những gì:</p>
${lenh('s08/auth', 19)}
${lenh('s08/auth', 20)}
<p><code>LogLevel INFO</code> là mặc định; <code>VERBOSE</code> ghi thêm chi tiết khi xác thực bằng khoá. <code>SyslogFacility AUTH</code> là lý do dòng sshd rơi vào auth.log.</p>

<h3>Góc hacker: một vụ dò mật khẩu thành công trông thế nào về sau</h3>
<p><strong>FritzFrog (Guardicore Labs, 08/2020):</strong> một botnet ngang hàng dò mật khẩu SSH từ tháng 1/2020 — cơ quan chính phủ, trường đại học, ngân hàng, bệnh viện, nhà mạng. Vào được rồi, nó <strong>thêm khoá công khai của nó vào <code>authorized_keys</code></strong> để quay lại mà không cần mật khẩu, kể cả khi mật khẩu đã bị đổi. Trong auth.log đó là một chuỗi: nhiều <code>Failed password</code> → một <code>Accepted password</code> → về sau <code>Accepted publickey</code> với dấu vân tay lạ. Lab 8 dựng lại đúng chuỗi này.</p>
<p><strong>Ebury (ESET, 05/2024):</strong> một cửa sau trong OpenSSH kiêm công cụ trộm mật khẩu, khoảng <strong>400.000</strong> máy chủ Linux/BSD bị nhiễm từ năm 2009, hơn 100.000 máy vẫn còn nhiễm cuối 2023. Kẻ tấn công đăng nhập bằng <em>mật khẩu thật đã trộm</em> — log chỉ hiện một dòng <code>Accepted password</code> bình thường. Bài học: "không có lần đăng nhập hỏng" không có nghĩa là "an toàn". Hãy so mọi lần đăng nhập với đường nền: IP nguồn quen, giờ quen, mật khẩu hay khoá.</p>
<p>Thử một mật khẩu phổ biến trên nhiều tài khoản — đúng việc <code>.88</code> làm với <code>123456</code> — là MITRE ATT&amp;CK <strong>T1110.003 Password Spraying</strong>.</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>Khách hàng hỏi: "Máy chủ của chúng tôi có bị hack không?"</strong> Đừng bao giờ trả lời từ một lệnh grep. Trả lời bằng: cửa sổ thời gian, số lần thử hỏng và nguồn, mọi dòng <code>Accepted</code> trong cửa sổ kèm phương thức và IP, có ca vào được sau thất bại không, có <code>useradd</code>/<code>NOT in sudoers</code> không, và các con số đã loại tự khớp chưa.</li>
<li><strong>OJT trên máy chủ dev dùng chung:</strong> script của một đồng nghiệp chạy <code>sudo mysql -p'…'</code>. Cho họ xem dòng auth.log chứa mật khẩu và chuyển bí mật vào một tệp cấu hình chỉ dịch vụ đọc được.</li>
<li><strong>Kiểm buổi sáng trên VPS:</strong> <code>grep -c 'sshd\\[[0-9]*\\]: Failed password'</code> trên tệp hôm qua chỉ là tiếng ồn nếu đã tắt đăng nhập bằng mật khẩu; điều đáng xem là danh sách các dòng <code>Accepted</code>.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Trên máy ảo của bạn: liệt kê mọi dòng <code>Accepted</code> hôm nay kèm phương thức, người dùng và IP (một dòng awk).</li>
<li>Tái hiện bẫy tự khớp: chạy <code>sudo grep -c 'Failed password' /var/log/auth.log</code> ba lần. Rồi viết phiên bản cho cùng một con số mọi lần.</li>
<li>Từ máy thứ hai, thử một mật khẩu sai cho một tên không tồn tại và một mật khẩu sai cho tên có thật. Tìm cả hai cặp dòng và giải thích khác biệt.</li>
<li>Chạy <code>sudo -l</code> bằng một người dùng không có quyền sudo và tìm dòng nó sinh ra.</li>
</ol>
<p><strong>Đạt khi:</strong> con số của bạn ổn định qua các lần chạy, và với mỗi dòng bạn nói được tài khoản có tồn tại không và dùng phương thức xác thực nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Accepted password / publickey', 'Đăng nhập SSH thành công và phương thức; dòng publickey kèm dấu vân tay khoá (SHA256:…).'],
  ['Invalid user', 'Tên người dùng không tồn tại trên máy — đang đoán tên.'],
  ['[preauth]', 'Sự kiện xảy ra trước khi xác thực xong (máy khách bỏ cuộc hoặc bị cắt).'],
  ['NOT in sudoers', 'Người không có quyền sudo cố chạy lệnh với quyền root.'],
  ['MaxAuthTries', 'Số lần thử tối đa mỗi kết nối (mặc định 6) — số dòng ≠ số kết nối.'],
  ['tự khớp', 'Lệnh sudo grep ghi chính dòng lệnh của nó, nên tìm ra chính nó.'],
  ['password spraying (T1110.003)', 'Một mật khẩu phổ biến thử trên nhiều tài khoản.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dòng sshd cho biết phương thức (mật khẩu/khoá), người dùng, tài khoản có tồn tại không, và IP nguồn.</li>
<li>Dòng sudo là dấu vết kiểm toán các lệnh — và làm lộ mọi thứ gõ trên dòng lệnh.</li>
<li>Neo mẫu vào tên chương trình và làm việc trên bản chép, không thì lệnh của chính bạn làm phình con số.</li>
<li>Số dòng, số kết nối và số tên là ba phép đếm khác nhau; nói rõ đang đếm gì.</li>
<li>Vào được sau chuỗi thất bại từ cùng IP là dòng đỏ; log yên lặng không phải bằng chứng an toàn.</li>
</ul>
${nguon('📘', 'sshd_config(5)', 'LogLevel, SyslogFacility, MaxAuthTries, PermitRootLogin', 'https://man.openbsd.org/sshd_config')}
${nguon('📘', 'sudoers(5) — ghi log', 'sudo ghi gì cho mỗi lệnh', 'https://www.sudo.ws/docs/man/sudoers.man/')}
${nguon('📰', 'Threatpost (2020) — botnet FritzFrog', 'Guardicore Labs: dò SSH + cửa sau authorized_keys', 'https://threatpost.com/fritzfrog-botnet-millions-ssh-servers/158489/')}
${nguon('📰', 'ESET WeLiveSecurity (2024) — Ebury', '400.000 máy chủ bị nhiễm từ 2009', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}
${nguon('🛡', 'MITRE ATT&CK T1110.003', 'Dò mật khẩu: rải một mật khẩu', 'https://attack.mitre.org/techniques/T1110/003/')}
${lienKet({ khoa: 'network-security', bai: 'netsec-4-5-chong-do', title: 'Network Security 4.5 — Chống dò mật khẩu', sub: 'fail2ban / CrowdSec — chặn, không chỉ đọc' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-1-brute-force', title: 'Bài 14.1 — Dò mật khẩu trên nhiều nguồn', sub: 'Cùng mẫu đó trong log Windows, web và VPN' })}
</div>
`,
};
