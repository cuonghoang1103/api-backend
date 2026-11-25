/**
 * 18.6 — Tự dựng bộ dữ liệu sự cố (soạn 24/11/2026, agent lgz). Output thật: OUT['s18/tu-dung'] — sinh su-co18 hai lần trong /lab/ra (tmpfs) ⇒ cmp giống từng byte (24 tệp);
 * chèn một ssh_vao() của người học (minh từ 203.0.113.99 lúc 03:05 giờ máy) ⇒ 3 dòng sshd trong auth.log + 3 bản ghi khớp IP trong journal.
 * Atomic Red Team: chỉ giới thiệu + liên kết khoá blue-team-siem (không chạy ở đây — dữ liệu chương này là log SINH).
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '18.6 — Bonus — Generate your own incident dataset in your lab and swap it with a friend|||18.6 — Phần thêm — Tự dựng bộ dữ liệu sự cố trong lab của bạn rồi đổi cho bạn bè điều tra',
  slug: 'log-18-6-tu-dung-kich-ban',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đổi vai: lần này bạn là người ra đề. Đọc cấu trúc của tao-su-co.py (đường nền → các bước tấn công → hành vi xoá log → ghi từng nguồn đúng định dạng), kiểm tính tất định (sinh hai lần giống từng byte — điều kiện để có đáp án ổn định), chèn một sự kiện của riêng bạn và kiểm nó hiện đúng ở auth.log lẫn journal, rồi viết đáp án TRƯỚC, đổi bộ dữ liệu với bạn bè và chấm chéo. Cách thứ hai: chạy test Atomic Red Team có sẵn trong máy ảo lab tách mạng của chính bạn — chỉ trên máy của mình.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Capstone · 18.6 (bonus)</span>
<h2>Now you write the case</h2>
<p class="lead">Making a good exercise teaches as much as solving one: to hide a clue fairly, you must know exactly which log records it, in which format, and what a careless attacker forgets. This lesson opens the generator you were told not to read, then has you build your own case for a friend.</p>

<h3>The everyday picture</h3>
<p>Writing an escape room: you design the puzzle backwards from the exit, test that every clue can be found, and write the solution sheet before anyone plays.</p>

<h3>1. How tao-su-co.py is built (now you may read it — 18.1)</h3>
${kv([
  ['Deterministic random', 'A tiny LCG with a fixed seed (<code>Lcg(1818)</code>) instead of <code>random</code>: same output on every machine and Python version.'],
  ['One writer per format', '<code>J()</code> = journald entry, also copied to auth.log or syslog by facility (like rsyslog 50-default.conf); <code>W()</code> nginx; <code>A()</code> pino inside docker json-file; <code>P()</code> PostgreSQL csvlog (26 columns, quoting checked against a real PostgreSQL 16.16); <code>R()</code> router with its slow clock; <code>E()</code> Windows JSON.'],
  ['Baseline first', 'Nine days of normal life: hourly cron, Internet SSH noise, customers, scanners, weekday logins, a weekly DBeaver report, a deploy — so the attack has something to stand out from.'],
  ['Attack as a script', 'Section 2 lists the attack step by step, each step writing to every source that would really see it.'],
  ['Tampering applied last', 'auth.log is filtered by the attacker IPs and loses the lines between <code>sed -i</code> and the logrotate HUP — the journal keeps everything.'],
])}

<h3>2. Check it is deterministic</h3>
${lenh('s18/tu-dung', 0)}
<p>Two runs, 24 files, identical bytes. Without this, your answer key ("4740 at 15:57:53Z") would be wrong for the next person who generates the data.</p>

<h3>3. Add your own event</h3>
${lenh('s18/tu-dung', 1)}
${lenh('s18/tu-dung', 2)}
<p>One line in the generator produced three sshd lines in auth.log and three matching journal records — with correct PIDs, ports and formats. Ideas for your case: a second account created with <code>useradd</code>; an attacker who forgets journald and runs <code>journalctl --vacuum-time=1s</code>; an app log with a stack trace that leaks the file path; a router that is fast instead of slow.</p>

<h3>4. Rules for a fair case</h3>
<ol>
<li><strong>Write the answer key first</strong> — questions, expected answers, the command that proves each.</li>
<li>Every answer must be provable from the files you hand out. Run your own key against the data.</li>
<li>Include baseline noise; a case where only the attack is logged teaches nothing.</li>
<li>Use documentation IP ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) and <code>.example</code> domains; never real people or real customer data.</li>
<li>Swap with a friend, time-box 3 hours, grade each other with the 18.5 rubric.</li>
</ol>

<h3>5. Real attacks in your own lab (Atomic Red Team)</h3>
<p>Atomic Red Team is a library of small, documented tests mapped to ATT&amp;CK; running an existing test in an isolated VM produces <em>real</em> logs (Sysmon, auditd, Security). Do it only on machines you own, on a lab network without access to anything else, with a snapshot to roll back. The Blue Team course walks through it.</p>
${nguon('📘', 'Red Canary — Atomic Red Team (GitHub)', 'Small, portable detection tests mapped to MITRE ATT&CK', 'https://github.com/redcanaryco/atomic-red-team')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-4-4-mo-phong', title: 'Blue Team course › 4.4 Adversary emulation', sub: 'Atomic Red Team and Caldera in the lab', cta: 'Open' })}

<h3>🛡️ Attacker's corner</h3>
<p>Designing the case shows you the attacker's checklist from the inside: which logs to edit, which ones they cannot reach. Everything they cannot reach — another machine, an append-only store, journald with sealing — is your defence.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"How would you test a detection rule without a real attack?" — replay realistic logs or run an atomic test in a lab, check the rule fires and that baseline noise does not.</li>
<li>"Why must a training dataset be deterministic?" — reproducible answers and fair grading.</li>
<li>"What are the ethics of attack simulation?" — written permission, own systems, isolation, rollback.</li>
</ul>

<h3>At work</h3>
<p>Detection engineers and SOC teams build exactly these datasets to test SIEM rules before production; QA teams in outsourcing build synthetic logs to test log pipelines without customer data.</p>

<h3>🧪 Practice (half a day)</h3>
<ol>
<li>Write a 10-question case on top of the generator (at least three new events in three sources) and its answer key.</li>
<li>Swap with a friend; grade with the 18.5 rubric; fix any question nobody could answer from the data.</li>
</ol>

<h3>🗂 Key terms</h3>
${kv([
  ['Synthetic log', 'Log generated by a program in a real format, not by a real system.'],
  ['Deterministic', 'Same input ⇒ same output, byte for byte.'],
  ['Answer key', 'Expected answers with the proof command, written before the exercise is given.'],
  ['Atomic test', 'One small, documented attack action mapped to an ATT&amp;CK technique.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A fair case: baseline + attack + tampering, every answer provable, key written first.</li>
<li>Determinism is what makes the key valid for everyone.</li>
<li>Real attack tests belong in an isolated lab you own.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Dự án cuối khoá · 18.6 (phần thêm)</span>
<h2>Giờ bạn là người ra đề</h2>
<p class="lead">Ra một đề hay dạy nhiều ngang giải một đề: muốn giấu manh mối công bằng, bạn phải biết chính xác log nào ghi nó, định dạng gì, và kẻ tấn công cẩu thả hay quên gì. Bài này mở bộ sinh mà trước đây bạn được dặn đừng đọc, rồi cho bạn dựng vụ của riêng mình để đố bạn bè.</p>

<h3>Liên tưởng đời thường</h3>
<p>Thiết kế phòng thoát hiểm (escape room): dựng câu đố ngược từ cửa ra, thử lại để chắc mọi manh mối tìm được, và viết tờ đáp án trước khi ai vào chơi.</p>

<h3>1. tao-su-co.py được dựng thế nào (giờ thì đọc được — bài 18.1)</h3>
${kv([
  ['Ngẫu nhiên tất định', 'Một bộ sinh số LCG nhỏ với hạt giống cố định (<code>Lcg(1818)</code>) thay cho <code>random</code>: máy nào, bản Python nào cũng ra cùng kết quả.'],
  ['Mỗi định dạng một hàm ghi', '<code>J()</code> = bản ghi journald, đồng thời chép sang auth.log hoặc syslog theo facility (như 50-default.conf của rsyslog); <code>W()</code> nginx; <code>A()</code> pino bọc trong docker json-file; <code>P()</code> csvlog PostgreSQL (26 cột, cách đặt nháy đã đối chiếu PostgreSQL 16.16 thật); <code>R()</code> router với đồng hồ chậm; <code>E()</code> Windows JSON.'],
  ['Đường nền trước', 'Chín ngày sinh hoạt bình thường: cron mỗi giờ, nhiễu SSH từ Internet, khách hàng, máy quét, đăng nhập ngày làm việc, báo cáo DBeaver hằng tuần, một lần deploy — để cuộc tấn công có cái mà nổi lên.'],
  ['Tấn công như kịch bản', 'Phần 2 liệt kê từng bước tấn công, bước nào cũng ghi vào mọi nguồn thật sự nhìn thấy nó.'],
  ['Xoá dấu vết áp sau cùng', 'auth.log bị lọc theo IP kẻ tấn công và mất các dòng giữa <code>sed -i</code> và lần HUP của logrotate — journal giữ đủ.'],
])}

<h3>2. Kiểm tính tất định</h3>
${lenh('s18/tu-dung', 0)}
<p>Hai lần chạy, 24 tệp, giống từng byte. Không có điều này, đáp án của bạn ("4740 lúc 15:57:53Z") sẽ sai với người sinh dữ liệu sau.</p>

<h3>3. Thêm sự kiện của riêng bạn</h3>
${lenh('s18/tu-dung', 1)}
${lenh('s18/tu-dung', 2)}
<p>Một dòng trong bộ sinh tạo ra ba dòng sshd trong auth.log và ba bản ghi journal khớp — đúng PID, cổng và định dạng. Gợi ý cho vụ của bạn: một tài khoản thứ hai tạo bằng <code>useradd</code>; kẻ tấn công nhớ cả journald và chạy <code>journalctl --vacuum-time=1s</code>; log ứng dụng có stack trace làm lộ đường dẫn tệp; router chạy nhanh thay vì chậm.</p>

<h3>4. Luật cho một đề công bằng</h3>
<ol>
<li><strong>Viết đáp án trước</strong> — câu hỏi, đáp án mong đợi, lệnh chứng minh từng câu.</li>
<li>Mọi đáp án phải chứng minh được từ các tệp bạn giao. Chạy chính đáp án của bạn trên dữ liệu.</li>
<li>Có nhiễu đường nền; đề mà chỉ có log tấn công thì không dạy được gì.</li>
<li>Dùng dải IP tài liệu (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) và tên miền <code>.example</code>; không bao giờ dùng người thật hay dữ liệu khách hàng thật.</li>
<li>Đổi đề với bạn bè, giới hạn 3 giờ, chấm chéo bằng thang của 18.5.</li>
</ol>

<h3>5. Tấn công thật trong lab của chính bạn (Atomic Red Team)</h3>
<p>Atomic Red Team là thư viện các bài thử nhỏ có tài liệu, gắn với ATT&amp;CK; chạy một bài thử có sẵn trong máy ảo tách biệt sẽ sinh log <em>thật</em> (Sysmon, auditd, Security). Chỉ làm trên máy của bạn, trong mạng lab không đi đâu được, có snapshot để quay lại. Khoá Blue Team hướng dẫn chi tiết.</p>
${nguon('📘', 'Red Canary — Atomic Red Team (GitHub)', 'Bài thử phát hiện nhỏ, gắn với MITRE ATT&CK', 'https://github.com/redcanaryco/atomic-red-team')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-4-4-mo-phong', title: 'Khoá Blue Team › 4.4 Mô phỏng đối thủ', sub: 'Atomic Red Team và Caldera trong lab', cta: 'Mở bài' })}

<h3>🛡️ Góc hacker</h3>
<p>Thiết kế đề cho bạn thấy danh sách việc của kẻ tấn công từ bên trong: log nào chúng sửa được, log nào chúng không với tới. Mọi thứ chúng không với tới — máy khác, kho chỉ-ghi-thêm, journald có niêm phong — là lớp phòng thủ của bạn.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Thử một luật phát hiện mà không có tấn công thật bằng cách nào?" — phát lại log giống thật hoặc chạy bài thử atomic trong lab, kiểm luật kêu đúng và nhiễu đường nền không làm nó kêu.</li>
<li>"Sao bộ dữ liệu luyện tập phải tất định?" — đáp án tái lập được và chấm công bằng.</li>
<li>"Đạo đức của mô phỏng tấn công?" — có cho phép bằng văn bản, hệ thống của mình, tách biệt, có đường quay lui.</li>
</ul>

<h3>Đi làm thật (outsourcing / OJT)</h3>
<p>Kỹ sư phát hiện và đội SOC dựng đúng loại bộ dữ liệu này để thử luật SIEM trước khi đưa lên production; đội QA ở công ty outsourcing dựng log tổng hợp để thử đường ống log mà không đụng dữ liệu khách hàng.</p>

<h3>🧪 Thực hành (nửa ngày)</h3>
<ol>
<li>Viết một đề 10 câu dựa trên bộ sinh (ít nhất ba sự kiện mới ở ba nguồn) kèm đáp án.</li>
<li>Đổi với bạn bè; chấm bằng thang 18.5; sửa câu nào không ai trả lời được từ dữ liệu.</li>
</ol>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Log tổng hợp (synthetic)', 'Log do chương trình sinh theo định dạng thật, không phải do hệ thống thật ghi.'],
  ['Tất định', 'Cùng đầu vào ⇒ cùng đầu ra, giống từng byte.'],
  ['Đáp án (answer key)', 'Câu trả lời mong đợi kèm lệnh chứng minh, viết trước khi giao đề.'],
  ['Bài thử atomic', 'Một hành động tấn công nhỏ có tài liệu, gắn với một kỹ thuật ATT&amp;CK.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đề công bằng: đường nền + tấn công + xoá dấu vết, đáp án nào cũng chứng minh được, viết đáp án trước.</li>
<li>Tính tất định làm đáp án đúng với mọi người.</li>
<li>Thử tấn công thật thì làm trong lab tách biệt của chính bạn.</li>
</ul>
</div>
`,
};
