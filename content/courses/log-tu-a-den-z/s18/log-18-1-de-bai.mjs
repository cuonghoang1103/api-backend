/**
 * 18.1 — Đề bài dự án cuối khoá (soạn 24/11/2026, agent lgz). Output thật: OUT['s18/de-bai'] — bộ su-co18 sinh bởi _demo/s18/tao-su-co.py (tất định),
 * chạy trong container lgz-c03 (ảnh lgz-win-mau:1, --network none, 2 GB). Số trong bài: 24 tệp; auth.log 642 + auth.log.1 985 dòng, journal 2217,
 * access.log 10 687, logread 3328, security.jsonl 55 (chạy lại tao-su-co.py ⇒ giống từng byte, xem 18.6).
 * KHÔNG lộ đáp án ở bài này: chỉ đề, nguồn, câu hỏi, luật chơi. Mã bộ sinh nằm trong <details> có cảnh báo "chứa đáp án".
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '18.1 — The brief: a small company, many machines, and something went wrong|||18.1 — Đề bài: một công ty nhỏ — máy Windows, VPS Linux chạy nginx + Node + PostgreSQL, router, Docker — và có chuyện đã xảy ra',
  slug: 'log-18-1-de-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mở đầu dự án cuối khoá: công ty du lịch nhỏ Hoa Sen Travel có một VPS Ubuntu (sshd, cron, nginx + PHP blog, Docker chạy API Node.js/pino và PostgreSQL 16), một router văn phòng kiểu OpenWrt nối WireGuard về VPS, và máy Windows 11 của lập trình viên. Sáng thứ Hai, báo cáo buổi sáng có sự kiện 4740 lúc tối thứ Bảy. Bạn nhận 24 tệp log từ 8 kiểu nguồn khác nhau (auth.log, syslog, journalctl -o json, nginx, docker json-file, PostgreSQL csvlog, OpenWrt logread, Get-WinEvent JSON) cùng output vài lệnh quản trị viên đã chạy — và 15 câu hỏi phải trả lời bằng bằng chứng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.1</span>
<h2>Monday 08:33 — an account was locked on Saturday night</h2>
<p class="lead">Everything in this course leads here. You get the logs of a whole (small) company and a vague signal. In four steps — collect &amp; preserve (18.2), investigate (18.3), timeline &amp; ATT&amp;CK (18.4), report (18.5) — you turn 19 000 log lines into a story a manager can act on.</p>

<h3>The everyday picture</h3>
<p>A shop owner finds the back door scratched on Monday. The guard's notebook, the camera at the gate, the alarm panel, the cash register and the neighbour's camera each saw a piece — some with clocks that are a bit off, one notebook with a torn page. Your job is not to guess: it is to line up the pieces and say what you can prove.</p>

<h3>The company and the trigger</h3>
${lenh('s18/de-bai', 0)}
${kv([
  ['vps01 (Ubuntu 24.04)', 'Public server: SSH, cron, rsyslog + journald, nginx (+ PHP-FPM for an old WordPress blog), Docker with <code>tour-api</code> (Node.js + pino) and <code>tour-db</code> (PostgreSQL 16). WireGuard address 10.8.0.1.'],
  ['rt01 (OpenWrt-style router)', 'Office gateway: DHCP + DNS (dnsmasq, query logging on), firewall with a logging rule for traffic from the tunnel into the LAN, WireGuard to vps01.'],
  ['PC-DEV01 (Windows 11)', 'Developer Minh’s PC. You get an export of its Security log (4624/4625/4647/4672/4740) as JSON, one event per line.'],
  ['Collected by the admin', 'Output of a few commands An ran on Monday (id, sshd -T, ls/cat of cron, stat, docker ps, uci/wg on the router). Treat them as evidence too.'],
])}

<h3>What is in the box</h3>
${lenh('s18/de-bai', 1)}
<p>Eight different source formats. Before answering anything, learn to read one line of each — and note <strong>how each writes time</strong> (you will need this in 18.2):</p>
${lenh('s18/de-bai', 2)}
${lenh('s18/de-bai', 3)}
${lenh('s18/de-bai', 4)}
${lenh('s18/de-bai', 5)}
${lenh('s18/de-bai', 6)}
${lenh('s18/de-bai', 7)}
${lenh('s18/de-bai', 8)}
${lenh('s18/de-bai', 9)}
<div class="pitfall co-tieu-de"><p><strong>Two copies of the same thing.</strong> <code>auth.log</code>/<code>syslog</code> are text files rsyslog writes <em>from</em> journald; <code>vps01-journal.json</code> is the journal itself. If both were untouched they would tell the same story. Keep that in mind.</p></div>

<h3>The 15 questions</h3>
<ol>
<li>What happened on PC-DEV01 on Saturday night — who tried to log on, how, with what result?</li>
<li>What is <code>10.8.0.1</code>, and what is the "workstation name" in those Windows events?</li>
<li>From there, what did the intruder learn about the office network?</li>
<li>Before getting in anywhere, what did they try against the website? Was the API vulnerable?</li>
<li>Was there password guessing against SSH? How many attempts, from where, against which accounts, when?</li>
<li>The first successful entry: account, source IP, method, time (UTC).</li>
<li>Does <code>auth.log</code> agree with the journal? Prove any tampering and say which period is missing.</li>
<li>How did they get root?</li>
<li>How do they come back (persistence)? What is disguised, and how many times has it run?</li>
<li>Is there a web shell? Where, when was it really created, how was it used?</li>
<li>Who connected to the database, from where, and what did they read?</li>
<li>Did data leave the company? Which file, how big, when — is it still there?</li>
<li>Was the <code>tour-api</code> application itself exploited? Prove yes or no.</li>
<li>Which logs <em>should</em> have existed and did not? What could you not answer because of that?</li>
<li>Impact (whose data, legal duties) and the five most important fixes.</li>
</ol>

<h3>Rules</h3>
<ul>
<li>Every conclusion cites at least one log line (file + line or the line itself). Questions 6–12 need evidence from <strong>at least four different sources</strong> in total.</li>
<li>All times in the report in <strong>UTC</strong>. One source has a clock that is off — finding it is part of the job.</li>
<li>Say what you are <em>not</em> sure about. "Unknown" is a valid answer; a guess presented as fact is not.</li>
<li>Do not open the solutions in 18.3–18.4 until you have your own answers. Do not read the generator's source until 18.6 — it contains the answer.</li>
</ul>

<h3>Get the data</h3>
<pre><code class="language-bash">mkdir -p ~/c18 &amp;&amp; cd ~/c18
# save the generator below as tao-su-co.py (Python 3.10+, standard library only), then:
python3 tao-su-co.py ~/c18      # → ~/c18/su-co18 (24 files, 5 MB). Same bytes every run.
cd ~/c18 &amp;&amp; cat su-co18/DE-BAI.txt</code></pre>
<details><summary><strong>⚠️ tao-su-co.py — copy it, do NOT read it now (it contains the answer)</strong></summary>
${ma('python', 's18/tao-su-co.py')}
</details>
<p>Tools you need: <code>grep/awk/sed/sort/uniq/cut</code>, <code>jq</code>, Python 3, optionally PowerShell 7 and Docker (for Loki in 18.2). Everything in this chapter was run in an Ubuntu 22.04 container with no network.</p>

<h3>🛡️ Attacker's corner — why small companies</h3>
<p>Real intrusions rarely start with movie-style exploits. Microsoft's own January 2024 incident (Midnight Blizzard) began with <strong>password spraying</strong> against a forgotten test account without MFA; ESET's 2024 report on Ebury counts 400 000 Linux servers compromised over 15 years, many via stolen SSH credentials. A small company with one VPS and default settings is exactly the kind of target that gets hit — and the kind where nobody reads the logs until something breaks.</p>
${nguon('📘', 'Microsoft Security Blog (25/1/2024) — Midnight Blizzard: guidance for responders', 'Password spray against a legacy test tenant account without MFA', 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/')}
${nguon('📘', 'ESET WeLiveSecurity (5/2024) — Ebury is alive but unseen', '400 000 Linux servers compromised over 15 years', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"You get logs from five systems and a vague alert. What do you do in the first 30 minutes?" — preserve (hash, copy, record sources), check clocks/time zones, list questions, then search from the strongest signal outward.</li>
<li>"Why keep both the text logs and the journal?" — redundancy: one can be edited, rotated or lost; disagreement between them is itself evidence.</li>
<li>"How do you avoid confirmation bias?" — write questions before answers, record negative results, mark confidence.</li>
</ul>

<h3>At work (outsourcing / OJT)</h3>
<p>At an outsourcing company you will often get exactly this: a customer zips "all the logs" and asks "were we hacked?". You do not have access to their servers, only the files — and the customer wants a written answer, in their time zone, with evidence they can forward to their own management. This capstone is that ticket.</p>

<h3>🧪 Practice (30 min)</h3>
<ol>
<li>Generate the data, run the commands above, and write down — for each of the 8 sources — its time format, time zone, and precision.</li>
<li>Write your first hypotheses for questions 1–3 using only <code>pc-dev01/security.jsonl</code> and <code>rt01/</code>. Keep them: you will check them in 18.3.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Capstone', 'Final project combining every skill of the course.'],
  ['Trigger', 'The first signal that started the investigation (here: event 4740).'],
  ['Source of truth', 'The most complete, least tamperable copy of an event (here, compare journal vs text logs).'],
  ['Negative evidence', 'Proof that something did NOT happen (e.g. no successful logon from an IP).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Three machines, eight formats, 15 questions, one rule: every claim cites a log line.</li>
<li>Start by knowing your sources — format, time zone, completeness.</li>
<li>Next: 18.2 collect &amp; preserve, normalise time, load into Loki.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-8-lab', title: 'Lesson 14.8 — Lab 14', sub: 'A single-machine investigation to warm up', cta: 'Open' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-14-4-postmortem-cuoi', title: 'Incident Response course › 14.4 Final postmortem', sub: 'The process side of the same story', cta: 'Open' })}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.1</span>
<h2>Thứ Hai 08:33 — một tài khoản bị khoá từ tối thứ Bảy</h2>
<p class="lead">Mọi chương của khoá dẫn tới đây. Bạn nhận log của cả một công ty (nhỏ) và một tín hiệu mơ hồ. Qua bốn bước — thu thập &amp; bảo toàn (18.2), điều tra (18.3), dòng thời gian &amp; ATT&amp;CK (18.4), báo cáo (18.5) — bạn biến 19 000 dòng log thành một câu chuyện mà giám đốc đọc xong biết phải làm gì.</p>

<h3>Liên tưởng đời thường</h3>
<p>Sáng thứ Hai chủ cửa hàng thấy cửa sau có vết cạy. Sổ trực của bảo vệ, camera cổng, bảng báo động, máy tính tiền và camera nhà hàng xóm mỗi thứ thấy một mẩu — vài cái có đồng hồ chạy lệch, một cuốn sổ bị xé mất trang. Việc của bạn không phải đoán: mà là xếp các mẩu lại và nói được điều gì CHỨNG MINH được.</p>

<h3>Công ty và tín hiệu ban đầu</h3>
${lenh('s18/de-bai', 0)}
${kv([
  ['vps01 (Ubuntu 24.04)', 'Máy chủ công cộng: SSH, cron, rsyslog + journald, nginx (+ PHP-FPM cho blog WordPress cũ), Docker chạy <code>tour-api</code> (Node.js + pino) và <code>tour-db</code> (PostgreSQL 16). Địa chỉ WireGuard 10.8.0.1.'],
  ['rt01 (router kiểu OpenWrt)', 'Cổng ra của văn phòng: DHCP + DNS (dnsmasq, bật ghi truy vấn), tường lửa có luật GHI LOG cho lưu lượng từ đường hầm vào LAN, WireGuard về vps01.'],
  ['PC-DEV01 (Windows 11)', 'Máy của lập trình viên Minh. Bạn nhận bản xuất Security log (4624/4625/4647/4672/4740) dạng JSON, mỗi dòng một sự kiện.'],
  ['Quản trị viên thu thập', 'Output vài lệnh An đã chạy sáng thứ Hai (id, sshd -T, ls/cat cron, stat, docker ps, uci/wg trên router). Đó cũng là bằng chứng.'],
])}

<h3>Trong hộp có gì</h3>
${lenh('s18/de-bai', 1)}
<p>Tám kiểu nguồn khác nhau. Trước khi trả lời bất cứ câu nào, hãy đọc được một dòng của từng loại — và ghi lại <strong>mỗi nguồn ghi giờ thế nào</strong> (cần ngay ở 18.2):</p>
${lenh('s18/de-bai', 2)}
${lenh('s18/de-bai', 3)}
${lenh('s18/de-bai', 4)}
${lenh('s18/de-bai', 5)}
${lenh('s18/de-bai', 6)}
${lenh('s18/de-bai', 7)}
${lenh('s18/de-bai', 8)}
${lenh('s18/de-bai', 9)}
<div class="pitfall co-tieu-de"><p><strong>Hai bản của cùng một thứ.</strong> <code>auth.log</code>/<code>syslog</code> là tệp chữ do rsyslog chép <em>từ</em> journald; <code>vps01-journal.json</code> là chính journal. Nếu không ai đụng vào, hai bên kể cùng một chuyện. Nhớ điều này.</p></div>

<h3>15 câu hỏi điều tra</h3>
<ol>
<li>Tối thứ Bảy trên PC-DEV01 đã xảy ra gì — ai thử đăng nhập, bằng cách nào, kết quả ra sao?</li>
<li><code>10.8.0.1</code> là ai, và "tên máy trạm" trong các sự kiện Windows đó là gì?</li>
<li>Từ đó, kẻ xâm nhập biết được gì về mạng văn phòng?</li>
<li>Trước khi vào được đâu đó, chúng đã thử gì vào trang web? API có lỗ hổng không?</li>
<li>Có dò mật khẩu SSH không? Bao nhiêu lần, từ đâu, vào tài khoản nào, khi nào?</li>
<li>Lần vào thành công đầu tiên: tài khoản, IP nguồn, cách đăng nhập, thời điểm (UTC).</li>
<li><code>auth.log</code> có khớp journal không? Chứng minh việc sửa log (nếu có) và nói rõ khoảng nào bị mất.</li>
<li>Chúng lên root bằng cách nào?</li>
<li>Chúng quay lại bằng gì (bám trụ)? Cái gì được nguỵ trang, đã chạy bao nhiêu lần?</li>
<li>Có webshell không? Ở đâu, thật sự được tạo lúc nào, được dùng thế nào?</li>
<li>Ai kết nối vào CSDL, từ đâu, đã đọc gì?</li>
<li>Dữ liệu có ra khỏi công ty không? Tệp nào, bao nhiêu byte, lúc nào — còn ở đó không?</li>
<li>Bản thân ứng dụng <code>tour-api</code> có bị khai thác không? Chứng minh có hoặc không.</li>
<li>Log nào <em>lẽ ra phải có</em> mà không có? Vì thiếu nó, câu nào bạn không trả lời được?</li>
<li>Tác động (dữ liệu của ai, nghĩa vụ pháp lý) và năm việc sửa quan trọng nhất.</li>
</ol>

<h3>Luật chơi</h3>
<ul>
<li>Mỗi kết luận trích ít nhất một dòng log (tệp + số dòng hoặc chính dòng đó). Các câu 6–12 cộng lại phải dùng bằng chứng từ <strong>ít nhất bốn nguồn khác nhau</strong>.</li>
<li>Mọi giờ trong báo cáo ghi theo <strong>UTC</strong>. Có một nguồn đồng hồ chạy lệch — tìm ra nó là một phần của bài.</li>
<li>Nói rõ chỗ bạn <em>chưa chắc</em>. "Không xác định được" là câu trả lời hợp lệ; đoán mà trình bày như sự thật thì không.</li>
<li>Đừng mở lời giải ở 18.3–18.4 khi chưa có đáp án của mình. Đừng đọc mã bộ sinh trước bài 18.6 — trong đó có đáp án.</li>
</ul>

<h3>Lấy dữ liệu</h3>
<pre><code class="language-bash">mkdir -p ~/c18 &amp;&amp; cd ~/c18
# lưu bộ sinh bên dưới thành tao-su-co.py (Python 3.10+, chỉ thư viện chuẩn), rồi:
python3 tao-su-co.py ~/c18      # → ~/c18/su-co18 (24 tệp, 5 MB). Chạy lần nào cũng giống từng byte.
cd ~/c18 &amp;&amp; cat su-co18/DE-BAI.txt</code></pre>
<details><summary><strong>⚠️ tao-su-co.py — chép về, ĐỪNG đọc lúc này (trong đó có đáp án)</strong></summary>
${ma('python', 's18/tao-su-co.py')}
</details>
<p>Công cụ cần: <code>grep/awk/sed/sort/uniq/cut</code>, <code>jq</code>, Python 3; thêm PowerShell 7 và Docker (để chạy Loki ở 18.2) nếu có. Mọi lệnh của chương này đã chạy thật trong container Ubuntu 22.04 không có mạng.</p>

<h3>🛡️ Góc hacker — vì sao lại là công ty nhỏ</h3>
<p>Xâm nhập thật hiếm khi bắt đầu bằng khai thác kiểu phim. Chính Microsoft bị Midnight Blizzard vào hồi 1/2024 bắt đầu từ <strong>rải mật khẩu</strong> vào một tài khoản thử nghiệm bị quên, không có MFA; báo cáo Ebury của ESET (5/2024) đếm 400 000 máy chủ Linux bị chiếm trong 15 năm, nhiều máy qua thông tin đăng nhập SSH bị lộ. Một công ty nhỏ có một VPS để cấu hình mặc định là đúng kiểu mục tiêu hay bị đánh — và cũng là nơi không ai đọc log cho tới khi có chuyện.</p>
${nguon('📘', 'Microsoft Security Blog (25/1/2024) — Midnight Blizzard: guidance for responders', 'Password spray vào tài khoản tenant thử nghiệm cũ không có MFA', 'https://www.microsoft.com/en-us/security/blog/2024/01/25/midnight-blizzard-guidance-for-responders-on-nation-state-attack/')}
${nguon('📘', 'ESET WeLiveSecurity (5/2024) — Ebury is alive but unseen', '400 000 máy chủ Linux bị chiếm trong 15 năm', 'https://www.welivesecurity.com/en/eset-research/ebury-alive-unseen-400k-linux-servers-compromised-cryptotheft-financial-gain/')}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Bạn nhận log của năm hệ thống và một cảnh báo mơ hồ. 30 phút đầu bạn làm gì?" — bảo toàn (băm, sao chép, ghi nguồn), kiểm đồng hồ/múi giờ, liệt kê câu hỏi, rồi tìm từ tín hiệu mạnh nhất lan ra.</li>
<li>"Sao phải giữ cả log chữ lẫn journal?" — dự phòng: một bên có thể bị sửa, xoay hoặc mất; hai bên lệch nhau tự nó đã là bằng chứng.</li>
<li>"Làm sao tránh thiên kiến xác nhận?" — viết câu hỏi trước câu trả lời, ghi cả kết quả âm tính, đánh dấu độ tin cậy.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Ở công ty outsourcing bạn sẽ gặp đúng cảnh này: khách hàng nén "toàn bộ log" gửi sang và hỏi "chúng tôi có bị hack không?". Bạn không vào được máy chủ của họ, chỉ có tệp — và khách muốn một câu trả lời bằng văn bản, theo múi giờ của họ, có bằng chứng để chuyển lên lãnh đạo bên họ. Dự án cuối khoá này chính là tấm vé (ticket) đó.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<ol>
<li>Sinh dữ liệu, chạy các lệnh ở trên, và ghi lại — cho từng nguồn trong 8 nguồn — định dạng giờ, múi giờ và độ chính xác.</li>
<li>Viết giả thuyết đầu tiên cho câu 1–3 chỉ bằng <code>pc-dev01/security.jsonl</code> và <code>rt01/</code>. Giữ lại: bạn sẽ kiểm chúng ở 18.3.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Capstone (dự án cuối khoá)', 'Bài tổng hợp dùng mọi kỹ năng của khoá.'],
  ['Trigger (tín hiệu khởi đầu)', 'Dấu hiệu đầu tiên khiến cuộc điều tra bắt đầu (ở đây: sự kiện 4740).'],
  ['Nguồn gốc tin cậy', 'Bản ghi đầy đủ nhất, khó sửa nhất của một sự việc (ở đây: so journal với log chữ).'],
  ['Bằng chứng âm tính', 'Chứng minh một việc KHÔNG xảy ra (vd không có lần đăng nhập thành công nào từ một IP).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba máy, tám định dạng, 15 câu hỏi, một luật: mọi khẳng định phải trích dòng log.</li>
<li>Bắt đầu bằng việc hiểu nguồn — định dạng, múi giờ, độ đầy đủ.</li>
<li>Tiếp theo: 18.2 thu thập &amp; bảo toàn, chuẩn hoá thời gian, nạp vào Loki.</li>
</ul>
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-14-8-lab', title: 'Bài 14.8 — Lab 14', sub: 'Điều tra một máy để khởi động', cta: 'Mở bài' })}
${lienKet({ khoa: 'incident-response', bai: 'ir-14-4-postmortem-cuoi', title: 'Khoá Incident Response › 14.4 Postmortem cuối', sub: 'Phía quy trình của cùng câu chuyện', cta: 'Mở bài' })}
</div>
`,
};
