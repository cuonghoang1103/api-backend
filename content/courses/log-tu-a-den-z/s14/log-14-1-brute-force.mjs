/**
 * 14.1 — Dò mật khẩu (soạn 24/11/2026, agent lgz). Output thật: OUT['s14/do-mat-khau'] — bộ log vu14 (sinh bởi _demo/s14/tao-vu.py, tất định) + EVTX công khai (Ch4: kerberos-spray-4771, local-4776-4625).
 * Số tất định: web 598 × 401 giờ 01h 19/11 (40 IP, 598 tài khoản, mỗi tài khoản 1 lần; 356 bad_password / 242 no_such_user; 2 login ok lan/hoa 18:20:45Z/18:24:54Z; 90 python-requests);
 * SSH (bản trung tâm) 74 Failed từ 203.0.113.77, 3 đợt 01:40/01:57/02:14 (25/25/24), 24 tài khoản × 3 + 1 × 2, Accepted password deploy 02:14:01; bản cục bộ 0 dòng 203.0.113.77;
 * ngưỡng ≥ 10 tài khoản/IP/giờ chỉ ra 203.0.113.77 (25 và 24); Kerberos 7 × 4768 0x6 + 2 × 4771 0x18 + 4768 0x0 "normal"; AccountRestore.exe 8 Admin + 8 Administrator 0xc000006a.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '14.1 — Spotting password guessing and password spraying in Windows, Linux and web logs|||14.1 — Phát hiện dò mật khẩu và password spraying trên log Windows, Linux và web',
  slug: 'log-14-1-brute-force',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ba kiểu đoán mật khẩu để lại ba "hình dạng" khác nhau trong log: brute force (một tài khoản, nhiều mật khẩu), password spraying (nhiều tài khoản, một mật khẩu, chậm rãi) và credential stuffing (danh sách email + mật khẩu lộ từ nơi khác). Thực hành trên bộ log vụ web01 của chương: 598 lần đăng nhập hỏng từ 40 IP mà không IP nào vượt ngưỡng 5 lần/phút, 3 đợt rải mật khẩu SSH cách nhau 17 phút trúng tài khoản deploy, và Kerberos 4768/4771 trên log Windows thật. Cách đặt ngưỡng theo IP, theo tài khoản, theo thời gian — và vì sao ngưỡng sai thì im lặng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Three ways to guess a password, three shapes in the log</h2>
<p class="lead">Chapter 14 is the investigator's chapter: you already know how to read each log (Chapters 3–13); now you use them together to answer "were we attacked, how, and what did they do?". The most common first step of an attack is still guessing a password. There are three ways to do it, and each leaves a different <em>shape</em> in the logs — recognise the shape and you know which question to ask next.</p>

${kv([
  ['Brute force / password guessing (T1110.001)', 'ONE account, MANY passwords. Fast, noisy, often from one IP. Easy to see, easy to lock out.'],
  ['Password spraying (T1110.003)', 'MANY accounts, ONE (or few) common passwords, SLOW rounds to stay under lockout. Per-account counts stay tiny.'],
  ['Credential stuffing (T1110.004)', 'Email + password PAIRS leaked from another site, tried once each, often through thousands of proxy IPs. Many accounts do not even exist here.'],
])}

<h3>The everyday picture</h3>
<p>A thief at an apartment block. Brute force: one door, a bucket of keys. Spraying: one master-key copy tried on every door, one round per hour so the guard does not notice. Stuffing: a keyring stolen from another building — each key tried once on "its" door; most doors do not even exist here, but a few neighbours reused the same lock.</p>

<h3>The data for this chapter</h3>
<p>Staging a real attack against a real server is not what a log-reading course should do, so Chapter 14 uses two <strong>generated</strong> log sets — <code>vu14</code> (the web01 incident, Lessons 14.1–14.7) and <code>lab14</code> (Lab 14) — in exact Ubuntu 24.04 / nginx / pino / auditd formats (checked against the real VM logs of Chapters 7–8). The generator is deterministic: run it and your numbers match the lesson byte for byte. Windows examples use the public EVTX samples you downloaded in Lesson 4.9.</p>
<pre><code class="language-bash">python3 tao-vu.py ~/c14      # → ~/c14/vu14 and ~/c14/lab14 (standard library only)
cd ~/c14/vu14 &amp;&amp; find . -type f | sort</code></pre>
<details><summary><strong>tao-vu.py — the generator (read it after the chapter: it is the answer key)</strong></summary>
${ma('python', 's14/tao-vu.py')}
</details>

<h3>Step 1 — the web: 598 failures and no IP over the limit</h3>
<p>Start broad: failed logins (401 on <code>POST /api/login</code>) per hour in nginx's access log.</p>
${lenh('s14/do-mat-khau', 0)}
<p>One hour stands out by two orders of magnitude. Now describe its shape from the application log (pino JSON has the user and IP of each attempt):</p>
${lenh('s14/do-mat-khau', 1)}
${lenh('s14/do-mat-khau', 2)}
${lenh('s14/do-mat-khau', 3)}
<p>598 failures, 40 IPs, 598 different accounts, <strong>every account tried exactly once</strong>, and 242 attempts on accounts that <em>do not exist</em> here. That is credential stuffing: the attacker owns a list of pairs from someone else's breach. Each IP made ~15 attempts in 30 minutes — a "5 failures per minute per IP" rule would never fire. And two attempts succeeded:</p>
${lenh('s14/do-mat-khau', 4)}
${lenh('s14/do-mat-khau', 5)}
<p>Two real customers reused a leaked password. Note the <code>reqId</code> — Lesson 14.5 follows it into nginx. 90 requests even forgot to change the default User-Agent of the Python library — a gift, not something to rely on.</p>

<h3>Step 2 — SSH: three quiet rounds</h3>
<p>Use the copy on the central log server (Lesson 8.2) — you will see in 14.4 why the server's own file is useless:</p>
${lenh('s14/do-mat-khau', 6)}
${lenh('s14/do-mat-khau', 7)}
${lenh('s14/do-mat-khau', 8)}
${lenh('s14/do-mat-khau', 9)}
<p>25 user names, each tried once per round, three rounds 17 minutes apart; 24 names × 3 attempts and one name only twice — because the third try worked. Internet background noise (bots from 198.51.100.x) is there every day, 7 tries per IP at most; the sprayer is not the loudest per account, it is the widest. Same query on the server's own auth.log:</p>
${lenh('s14/do-mat-khau', 10)}
<p>Zero. Remember this; Lesson 14.4 explains it. A threshold that measures <em>width</em> (distinct accounts per IP per hour) catches the spray and ignores the bots:</p>
${lenh('s14/do-mat-khau', 11)}

<h3>Step 3 — Windows: Kerberos tells you which accounts exist</h3>
<p>On a domain controller, spraying shows up as Kerberos pre-authentication failures. In this public sample (EVTX-ATTACK-SAMPLES), one IP asks for tickets for 10 names in 23 ms:</p>
${lenh('s14/do-mat-khau', 12)}
<p><strong>4768 status 0x6</strong> = the name does not exist; <strong>4771 status 0x18</strong> = the name exists, the password was wrong. The attacker learns which accounts are real from your own replies, then sprays them. On a single machine the same idea is 4625 with Sub Status 0xC000006A (wrong password) vs 0xC0000064 (no such user) — 16 attempts in 14 ms by a tool on the desktop:</p>
${lenh('s14/do-mat-khau', 13)}

<h3>Thresholds that work (and why they stay quiet)</h3>
${kv([
  ['Per IP, per minute', 'Catches classic brute force. Misses stuffing through proxies and slow spraying. False positives: a company behind one NAT IP, mobile carrier CGNAT.'],
  ['Per account, per hour', 'Catches guessing one account. Misses spraying (one try per account per round).'],
  ['Distinct accounts per IP per hour', 'Catches spraying from one source (Step 2). Misses spraying spread over many IPs.'],
  ['Global failure ratio + share of unknown accounts', 'Catches stuffing: failures jump, and many attempts are for accounts that do not exist (242/598 here).'],
  ['Success after many failures', 'The one that matters: any success from an IP or for an account that just had a burst of failures.'],
])}
<div class="pitfall co-tieu-de"><p><strong>Log the reason.</strong> The app here writes <code>reason: no_such_user | bad_password</code>. Without it you cannot tell stuffing from guessing — but never return that reason to the client (it tells attackers which accounts exist, exactly like Kerberos 0x6/0x18).</p></div>

<h3>🛡️ Attacker's corner: Midnight Blizzard, 2023–2024</h3>
<p>Microsoft disclosed on 19 and 25 January 2024 that the group Midnight Blizzard (APT29) got into its corporate tenant in late November 2023 with a <strong>password spray</strong> against a legacy, non-production test account that had <strong>no MFA</strong>; they used a small number of attempts from residential proxy IPs to avoid detection. Lessons for logs: spraying is deliberately low and slow, per-IP thresholds do not see it, and the success event on a forgotten account is the only loud moment. Defence: MFA everywhere, no forgotten test accounts, alerts on "first success after failures" and on width, not depth.</p>
${nguon('📘', 'Microsoft Security Blog (25/1/2024) — Midnight Blizzard: guidance for responders', 'Password spray against a legacy test tenant account without MFA', 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/')}
${nguon('📘', 'MITRE ATT&CK — T1110 Brute Force (.001/.003/.004)', 'Guessing, spraying, stuffing — v19.2', 'https://attack.mitre.org/techniques/T1110/')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Brute force vs spraying vs stuffing — how do you tell them apart in logs?" — depth per account, width per IP, share of non-existent accounts, success pattern.</li>
<li>"Why didn't our 'more than 5 failures per minute per IP' alert fire?" — stuffing via proxies and slow spraying stay under it by design.</li>
<li>"What do 4771 0x18 and 4768 0x6 mean?" — wrong password for an existing account / account does not exist.</li>
<li>"What do you do after finding a successful login in the middle of a spray?" — treat the account as compromised: sessions, what it did next (14.3), reset + MFA.</li>
</ul>

<h3>At work</h3>
<p>On an outsourcing project the customer's WAF or Cloudflare dashboard says "login attack". Your ticket should contain: time window (UTC), number of attempts, distinct IPs and accounts, share of unknown accounts, the list of <strong>successful</strong> logins in the window with request IDs — and nothing else until those accounts are checked.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>For the stuffing hour, print attempts per IP per 10 minutes. What is the maximum? Would "10 per 10 minutes" have fired?</li>
<li>List the 5 real system accounts the spray tried (they got "Failed password for X", not "invalid user").</li>
<li>Write an awk rule: an IP that has ≥ 10 failures in an hour and then any <code>Accepted</code> within 60 minutes. Run it on the central copy.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Credential stuffing', 'Trying leaked username/password pairs from another breach.'],
  ['Password spraying', 'One common password against many accounts, slowly.'],
  ['Width vs depth', 'How many accounts per source vs how many tries per account.'],
  ['4768 / 4771', 'Kerberos TGT request / pre-authentication failed (0x6 unknown name, 0x18 wrong password).'],
  ['Residential proxy', 'Attack traffic routed through home IPs so each IP looks like a normal customer.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Measure the shape: per IP, per account, distinct accounts, unknown-account share, success after failures.</li>
<li>Stuffing and spraying are built to stay under per-IP thresholds; alert on width and on the success.</li>
<li>The same logic works on nginx/app logs, auth.log and Windows 4625/4771.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Lesson 8.3 — auth.log and SSH guessing', sub: 'The sshd messages in detail, on a real VM', cta: 'Open' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-1-dang-nhap', title: 'Lesson 4.1 — 4624/4625 and Sub Status', sub: '3561 real SMB guesses in 2 minutes', cta: 'Open' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-1-brute-force', title: 'Blue Team course › 6.1 Brute force, spraying, stuffing', sub: 'Turning these shapes into SIEM rules', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Ba cách đoán mật khẩu, ba hình dạng trong log</h2>
<p class="lead">Chương 14 là chương của người điều tra: bạn đã biết đọc từng loại log (Chương 3–13), giờ dùng chúng <strong>cùng nhau</strong> để trả lời "mình có bị tấn công không, bằng cách nào, và họ đã làm gì?". Bước mở màn phổ biến nhất của một cuộc tấn công vẫn là đoán mật khẩu. Có ba cách đoán, mỗi cách để lại một <em>hình dạng</em> khác nhau trong log — nhận ra hình dạng là biết phải hỏi câu gì tiếp.</p>

${kv([
  ['Brute force / đoán mật khẩu (T1110.001)', 'MỘT tài khoản, NHIỀU mật khẩu. Nhanh, ồn, thường từ một IP. Dễ thấy, dễ khoá.'],
  ['Password spraying — rải mật khẩu (T1110.003)', 'NHIỀU tài khoản, MỘT (hoặc vài) mật khẩu phổ biến, từng ĐỢT CHẬM để không chạm ngưỡng khoá. Số lần trên mỗi tài khoản rất nhỏ.'],
  ['Credential stuffing — nhồi thông tin đăng nhập (T1110.004)', 'CẶP email + mật khẩu lộ từ trang khác, mỗi cặp thử một lần, thường qua hàng nghìn IP proxy. Nhiều tài khoản thậm chí không tồn tại ở đây.'],
])}

<h3>Liên tưởng đời thường</h3>
<p>Một tên trộm ở chung cư. Brute force: đứng trước MỘT cửa với cả xô chìa khoá. Spraying: một chiếc chìa "vạn năng" thử lần lượt mọi cửa, mỗi giờ một vòng để bảo vệ không để ý. Stuffing: chùm chìa trộm được ở toà nhà khác — mỗi chìa thử đúng một lần vào cửa "của nó"; phần lớn cửa không có ở đây, nhưng vài nhà dùng lại đúng ổ khoá cũ.</p>

<h3>Dữ liệu của chương</h3>
<p>Dựng một cuộc tấn công thật vào máy chủ thật không phải việc của khoá đọc log, nên Chương 14 dùng hai bộ log <strong>sinh ra</strong>: <code>vu14</code> (vụ máy web01, dùng cho bài 14.1–14.7) và <code>lab14</code> (Lab 14). Định dạng đúng từng ký tự của Ubuntu 24.04 (rsyslog RFC 3339, sshd, sudo, useradd, auditd), nginx và pino — đã đối chiếu với log thật của máy ảo ở Chương 7–8. Bộ sinh <strong>tất định</strong>: chạy lại ra đúng từng byte, nên con số trên máy bạn khớp với bài. Phần Windows dùng bộ EVTX mẫu công khai đã tải ở Bài 4.9.</p>
<pre><code class="language-bash">python3 tao-vu.py ~/c14      # → ~/c14/vu14 và ~/c14/lab14 (chỉ dùng thư viện chuẩn của Python)
cd ~/c14/vu14 &amp;&amp; find . -type f | sort</code></pre>
<details><summary><strong>tao-vu.py — bộ sinh log (đọc SAU khi học xong chương: nó chính là đáp án)</strong></summary>
${ma('python', 's14/tao-vu.py')}
</details>
<p>Bối cảnh: <strong>web01</strong> là máy chủ của một cửa hàng online (nginx + ứng dụng Node.js ghi log bằng pino), có SSH mở ra Internet, gửi log hệ thống về máy chủ log trung tâm <code>logsrv</code> bằng rsyslog (Bài 8.2). Sáng 19/11/2026 lúc 09:28, quản trị viên <code>an</code> thấy điều lạ. Cả chương sẽ tìm lại những gì đã xảy ra đêm đó.</p>

<h3>Bước 1 — web: 598 lần hỏng mà không IP nào vượt ngưỡng</h3>
<p>Bắt đầu rộng: số lần đăng nhập hỏng (401 trên <code>POST /api/login</code>) theo giờ trong access log của nginx.</p>
${lenh('s14/do-mat-khau', 0)}
<p>Một giờ vượt mọi giờ khác tới hai bậc độ lớn. Giờ mô tả hình dạng của nó bằng log ứng dụng (JSON của pino có tài khoản và IP của từng lần thử):</p>
${lenh('s14/do-mat-khau', 1)}
${lenh('s14/do-mat-khau', 2)}
${lenh('s14/do-mat-khau', 3)}
<p>598 lần hỏng, 40 IP, 598 tài khoản khác nhau, <strong>mỗi tài khoản đúng một lần</strong>, và 242 lần vào tài khoản <em>không hề tồn tại</em> ở đây. Đó là credential stuffing: kẻ tấn công cầm một danh sách cặp tài khoản–mật khẩu lộ từ vụ khác. Mỗi IP chỉ ~15 lần trong 30 phút — luật "quá 5 lần hỏng/phút/IP" sẽ không bao giờ kêu. Và có hai lần thành công:</p>
${lenh('s14/do-mat-khau', 4)}
${lenh('s14/do-mat-khau', 5)}
<p>Hai khách thật đã dùng lại mật khẩu bị lộ. Để ý <code>reqId</code> — Bài 14.5 sẽ lần theo nó sang nginx. 90 request còn quên đổi User-Agent mặc định của thư viện Python — đó là "quà tặng", đừng trông cậy vào nó.</p>

<h3>Bước 2 — SSH: ba đợt lặng lẽ</h3>
<p>Dùng bản đã gửi về máy chủ log trung tâm (Bài 8.2) — Bài 14.4 sẽ cho thấy vì sao tệp trên chính máy web01 vô dụng:</p>
${lenh('s14/do-mat-khau', 6)}
${lenh('s14/do-mat-khau', 7)}
${lenh('s14/do-mat-khau', 8)}
${lenh('s14/do-mat-khau', 9)}
<p>25 tên tài khoản, mỗi tên thử một lần mỗi đợt, ba đợt cách nhau 17 phút; 24 tên × 3 lần và một tên chỉ 2 lần — vì lần thứ ba đã trúng. Nhiễu nền Internet (bot từ 198.51.100.x) ngày nào cũng có, tối đa 7 lần mỗi IP; kẻ rải mật khẩu không ồn nhất theo từng tài khoản, mà <em>rộng</em> nhất. Cùng câu hỏi đó trên auth.log của chính máy chủ:</p>
${lenh('s14/do-mat-khau', 10)}
<p>Không dòng nào. Ghi nhớ điều này; Bài 14.4 sẽ giải thích. Một ngưỡng đo <em>độ rộng</em> (số tài khoản khác nhau mỗi IP mỗi giờ) bắt được đợt rải và bỏ qua bot:</p>
${lenh('s14/do-mat-khau', 11)}
<p>Đọc lệnh awk này: khoá <code>k</code> = "IP + giờ"; mảng <code>da[k, u]</code> nhớ tài khoản <code>u</code> đã đếm chưa; <code>so[k]</code> chỉ tăng khi gặp tài khoản mới. Cuối tệp in những khoá có từ 10 tài khoản trở lên.</p>

<h3>Bước 3 — Windows: Kerberos tiết lộ tài khoản nào có thật</h3>
<p>Trên domain controller, spraying hiện ra dưới dạng lỗi tiền xác thực Kerberos. Trong mẫu công khai này (EVTX-ATTACK-SAMPLES), một IP xin vé cho 10 cái tên trong 23 mili giây:</p>
${lenh('s14/do-mat-khau', 12)}
<p><strong>4768 Status 0x6</strong> = tên không tồn tại; <strong>4771 Status 0x18</strong> = tên có thật, sai mật khẩu. Kẻ tấn công học được tài khoản nào có thật từ chính câu trả lời của bạn, rồi mới rải mật khẩu vào đúng chúng. Trên một máy đơn lẻ, cùng ý đó là 4625 với Sub Status 0xC000006A (sai mật khẩu) và 0xC0000064 (không có người dùng) — 16 lần trong 14 mili giây do một công cụ trên Desktop:</p>
${lenh('s14/do-mat-khau', 13)}

<h3>Ngưỡng nào hiệu quả (và vì sao ngưỡng sai thì im lặng)</h3>
${kv([
  ['Theo IP, mỗi phút', 'Bắt brute force kinh điển. Bỏ sót stuffing qua proxy và spraying chậm. Báo nhầm: cả công ty sau một IP NAT, nhà mạng di động dùng CGNAT.'],
  ['Theo tài khoản, mỗi giờ', 'Bắt việc đoán một tài khoản. Bỏ sót spraying (mỗi đợt mỗi tài khoản một lần).'],
  ['Số tài khoản khác nhau mỗi IP mỗi giờ', 'Bắt spraying từ một nguồn (Bước 2). Bỏ sót spraying rải trên nhiều IP.'],
  ['Tỉ lệ hỏng toàn hệ thống + tỉ lệ tài khoản không tồn tại', 'Bắt stuffing: tỉ lệ hỏng vọt lên, và nhiều lần thử là tài khoản không có (242/598 ở đây).'],
  ['Thành công ngay sau nhiều lần hỏng', 'Cái quan trọng nhất: bất kỳ lần thành công nào từ một IP, hoặc cho một tài khoản, vừa có một loạt lần hỏng.'],
])}
<div class="pitfall co-tieu-de"><p><strong>Ghi lý do vào log.</strong> Ứng dụng ở đây ghi <code>reason: no_such_user | bad_password</code>. Không có trường này thì bạn không phân biệt được stuffing với đoán thường — nhưng TUYỆT ĐỐI không trả lý do đó về cho người dùng (nó cho kẻ tấn công biết tài khoản nào có thật, đúng như Kerberos 0x6/0x18).</p></div>

<h3>🛡️ Góc hacker: Midnight Blizzard, 2023–2024</h3>
<p>Ngày 19 và 25/1/2024, Microsoft công bố nhóm Midnight Blizzard (APT29) đã vào được tenant nội bộ của họ từ cuối tháng 11/2023 bằng <strong>password spray</strong> nhắm vào một tài khoản thử nghiệm cũ, không dùng cho sản xuất và <strong>không bật MFA</strong>; số lần thử được giữ rất ít, đi qua IP proxy dân dụng để tránh bị phát hiện. Bài học về log: spraying cố tình thấp và chậm, ngưỡng theo IP không thấy, và sự kiện <em>thành công</em> trên một tài khoản bị bỏ quên là khoảnh khắc duy nhất "ồn". Phòng: MFA mọi nơi, không để tài khoản thử nghiệm bị quên, cảnh báo "thành công đầu tiên sau chuỗi hỏng" và cảnh báo theo độ rộng chứ không chỉ độ sâu.</p>
${nguon('📘', 'Microsoft Security Blog (25/1/2024) — Midnight Blizzard: guidance for responders', 'Password spray vào tài khoản tenant thử nghiệm cũ không có MFA', 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/')}
${nguon('📘', 'MITRE ATT&CK — T1110 Brute Force (.001/.003/.004)', 'Đoán, rải, nhồi — phiên bản v19.2', 'https://attack.mitre.org/techniques/T1110/')}
<p><strong>Phòng ở phía bạn (lập trình viên backend):</strong> giới hạn tốc độ theo CẢ tài khoản lẫn IP; khoá mềm (chậm dần) thay vì khoá cứng (kẻ tấn công có thể cố tình khoá hàng loạt khách); kiểm mật khẩu mới với danh sách mật khẩu đã lộ (Have I Been Pwned có API k-anonymity — chỉ gửi 5 ký tự đầu của hash); bật MFA; và ghi log đủ để làm được các bước trên.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Phân biệt brute force, spraying và stuffing trong log thế nào?" — độ sâu theo tài khoản, độ rộng theo IP, tỉ lệ tài khoản không tồn tại, kiểu thành công.</li>
<li>"Vì sao cảnh báo 'quá 5 lần hỏng/phút/IP' của bọn mình không kêu?" — stuffing qua proxy và spraying chậm được thiết kế để nằm dưới ngưỡng đó.</li>
<li>"4771 0x18 và 4768 0x6 nghĩa là gì?" — sai mật khẩu của tài khoản có thật / tài khoản không tồn tại.</li>
<li>"Thấy một lần đăng nhập thành công giữa đợt rải mật khẩu thì làm gì?" — coi tài khoản đã bị chiếm: các phiên của nó, nó đã làm gì tiếp (Bài 14.3), đổi mật khẩu + bật MFA.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Ở dự án outsourcing, bảng điều khiển WAF hoặc Cloudflare của khách báo "tấn công đăng nhập". Phiếu (ticket) của bạn nên có: khung giờ (UTC), số lần thử, số IP và số tài khoản khác nhau, tỉ lệ tài khoản không tồn tại, danh sách lần đăng nhập <strong>thành công</strong> trong khung giờ kèm request id — và chưa cần gì thêm cho tới khi các tài khoản đó được kiểm tra. Khách hàng Nhật thường hỏi thêm "影響範囲" (phạm vi ảnh hưởng) — chính là danh sách tài khoản thành công đó.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Trong giờ bị nhồi, in số lần thử của mỗi IP theo từng 10 phút. Lớn nhất là bao nhiêu? Luật "10 lần/10 phút" có kêu không?</li>
<li>Liệt kê 5 tài khoản hệ thống CÓ THẬT mà đợt rải đã thử (chúng nhận "Failed password for X", không phải "invalid user").</li>
<li>Viết luật awk: một IP có ≥ 10 lần hỏng trong một giờ rồi có <code>Accepted</code> bất kỳ trong 60 phút sau. Chạy trên bản ở máy chủ log.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Credential stuffing', 'Thử các cặp tài khoản/mật khẩu lộ từ vụ khác.'],
  ['Password spraying', 'Một mật khẩu phổ biến thử trên nhiều tài khoản, chậm rãi.'],
  ['Độ rộng / độ sâu', 'Bao nhiêu tài khoản mỗi nguồn / bao nhiêu lần thử mỗi tài khoản.'],
  ['4768 / 4771', 'Xin vé TGT Kerberos / tiền xác thực hỏng (0x6 tên không có, 0x18 sai mật khẩu).'],
  ['Proxy dân dụng (residential proxy)', 'Lưu lượng tấn công đi qua IP gia đình để mỗi IP trông như một khách bình thường.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo hình dạng: theo IP, theo tài khoản, số tài khoản khác nhau, tỉ lệ tài khoản không tồn tại, thành công sau chuỗi hỏng.</li>
<li>Stuffing và spraying sinh ra để nằm dưới ngưỡng theo IP; hãy cảnh báo theo độ rộng và theo lần thành công.</li>
<li>Cùng một lối nghĩ dùng cho log nginx/ứng dụng, auth.log và 4625/4771 của Windows.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-8-3-auth-log', title: 'Bài 8.3 — auth.log và dò mật khẩu SSH', sub: 'Các thông điệp của sshd, trên máy ảo thật', cta: 'Mở bài' })}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-1-dang-nhap', title: 'Bài 4.1 — 4624/4625 và Sub Status', sub: '3561 lần đoán SMB thật trong 2 phút', cta: 'Mở bài' })}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-6-1-brute-force', title: 'Khoá Blue Team › 6.1 Brute force, spraying, stuffing', sub: 'Biến các hình dạng này thành quy tắc SIEM', cta: 'Mở bài' })}
</div>
`,
};
