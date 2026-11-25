/**
 * 16.7 — Lab 16 (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s16/lab16'] (máy may16: pha-lab16.sh cài 7 lỗi ⇒ kiem-lab16.sh 2/10 ⇒ sua-lab16.sh ⇒ 10/10).
 * Lời giải (sua-lab16.sh) nằm trong <details>. Bẫy gặp thật khi soạn: log_format khai trong conf.d nhưng access_log của nginx.conf đứng TRƯỚC include ⇒
 * "unknown log format" ⇒ nginx -t hỏng; vì thế bộ kiểm có mục nginx -t và mục gửi thử ?token= đầu-cuối.
 */
import { lenh, ma, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: 'Lab 16 — Audit and fix your own lab: retention, size limits, secret leaks in logs, permissions|||Lab 16 — Rà soát và sửa lab của chính bạn: thời gian lưu, giới hạn dung lượng, bí mật lọt vào log, quyền',
  slug: 'log-16-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Tiếp quản một máy chủ có sẵn 7 lỗi vận hành log hay gặp: log ứng dụng ai cũng đọc được, mật khẩu và khoá Stripe trong log, không có logrotate, nginx ghi ?token=, journald chỉ trên RAM, dev nằm trong nhóm adm, bản sao log để ở /tmp, không gửi log ra ngoài. Bộ kiểm 10 mục chạy thật cho 2/10; tự sửa theo đúng thứ tự (chặn lọt → xử lý cái đã lọt → quyền → giữ/xoay → gửi đi) tới 10/10, rồi áp cho lab của chính bạn (Docker, journald, Windows) và viết chính sách một trang. Lời giải chạy thật trong phần ẩn.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lab 16</span>
<h2>Take over a server that gets logging wrong</h2>
<p class="lead">Your first week on a project, you get root on the staging server "that has always worked". Before you touch any feature, you check how it logs. This lab gives you exactly that server — with seven common mistakes planted — and a checker. Then you apply the same audit to your own lab from earlier chapters.</p>

<h3>Setup (5 min)</h3>
<p>The lab machine is the same <code>may16</code> as lessons 16.1–16.5 (Ubuntu 24.04 with real systemd in a container, no network; or use your Linux VM — the scripts work there too). Start it and plant the faults:</p>
${ma('bash', 's16/lab16/pha-lab16.sh')}
${lenh('s16/lab16', 0)}

<h3>Step 1 — run the checker (do not read it first)</h3>
${lenh('s16/lab16', 1)}
${lenh('s16/lab16', 2)}
<p>2 of 10. Note that "logrotate -d runs without errors" and "nginx -t is valid" pass — nothing is broken in the sense that a service is down. Everything is broken in the sense of this chapter.</p>

<h3>Step 2 — your tasks</h3>
<ol>
<li>Write down, for each ✗, the lesson that explains it and what could go wrong in a real incident.</li>
<li>Decide the <strong>order</strong> of fixes and justify it in one sentence.</li>
<li>Fix everything on the machine until the checker shows 10/10. Do not just delete files: the app must keep logging, nginx must keep serving, rsyslog must keep running.</li>
<li>For the two secrets found in the logs, write what you would do in the real world <em>before</em> editing any file.</li>
<li>Apply the same audit to your own lab (Chapters 10, 13, 15): Docker log limits (<code>docker inspect -f '{{.HostConfig.LogConfig}}'</code> for each container), journald limits, Loki retention, and on your Windows PC the size and retention of the Security log (Event Viewer → Security → Properties, Chapter 4).</li>
<li>Write your one-page logging policy (16.6) for that lab.</li>
</ol>
<p><strong>Pass:</strong> checker 10/10; a short report (five lines like Lab 10: what was wrong, evidence, fix, how verified, what remains); the policy page; and for task 5 one line per source with its limit and retention.</p>

<details>
<summary><strong>Solution (open only after trying)</strong></summary>
<p>The checker itself:</p>
${ma('bash', 's16/lab16/kiem-lab16.sh')}
<p><strong>Order:</strong> stop new leaks first (nginx format), then deal with what already leaked, then permissions, then rotation/retention, then shipping. Fixing permissions first while nginx keeps writing tokens would leave the leak running.</p>
<p><strong>Task 4:</strong> the Stripe key and the password are real secrets from the system's point of view: revoke the key in the Stripe dashboard and force a reset for that account <em>first</em>; then mask in place; then search every copy (rotated files, <code>/tmp</code> backup, central store, backups) — lesson 16.3.</p>
${ma('bash', 's16/lab16/sua-lab16.sh')}
${lenh('s16/lab16', 3)}
${lenh('s16/lab16', 4)}
${lenh('s16/lab16', 5)}
<p>The secrets are masked in place, a new request with <code>?token=</code> is logged as <code>[CHE]</code>, and the journal now lives in <code>/var/log/journal</code>. A trap met when writing this solution: putting <code>log_format che</code> in <code>conf.d/</code> and switching the existing <code>access_log</code> line in <code>nginx.conf</code> to use it fails with <em>unknown log format "che"</em>, because that <code>access_log</code> line comes <em>before</em> the <code>include conf.d/*.conf</code>. The solution comments out the old line and declares <code>access_log</code> in <code>conf.d</code>, after the format. That is why the checker tests <code>nginx -t</code> and sends a real request — a checker that only reads files would have passed a broken web server.</p>
<p><strong>Task 5 (typical findings):</strong> containers without <code>max-size</code> on a machine where <code>daemon.json</code> has no default (fix in <code>daemon.json</code> or per service in Compose — Observability 2.2); Loki from Chapter 15 with <code>retention_period: 0s</code> (16.1); Windows Security log at its default maximum of 20 MB (20 480 KB) with "overwrite as needed", which on a busy PC holds only days — the CIS Benchmark recommends at least 196 608 KB (192 MB); raise it and ship to the central store (15.4).</p>
</details>

<h3>Interview questions this lab prepares</h3>
<ul>
<li>"You inherit a server. What do you check about its logging in the first hour?"</li>
<li>"You find a live API key in a log file. Walk me through the next 30 minutes."</li>
<li>"Why is a checker that sends a real request better than one that greps config files?"</li>
</ul>

<h3>Project milestone</h3>
<p>Add <code>kiem-lab16.sh</code> (adapted to your stack) to the final project (Chapter 18) as a pre-delivery check, and keep the policy page in the repository.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['Audit', 'Systematic check against a list of rules, with evidence.'],
  ['End-to-end check', 'Testing the real behaviour (send a request, read the log) rather than the config.'],
  ['Remediation order', 'Stop the leak → handle exposure → harden → retain → ship.'],
])}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Lab 16</span>
<h2>Tiếp quản một máy chủ ghi log sai đủ kiểu</h2>
<p class="lead">Tuần đầu ở một dự án, bạn được cấp root trên máy chủ staging "xưa nay vẫn chạy". Trước khi đụng vào tính năng nào, bạn kiểm xem nó ghi log thế nào. Lab này đưa đúng chiếc máy chủ đó — cài sẵn bảy lỗi hay gặp — kèm một bộ kiểm. Rồi bạn áp cùng phép rà soát cho lab của chính mình từ các chương trước.</p>

<h3>Chuẩn bị (5 phút)</h3>
<p>Máy lab là <code>may16</code> như ở các bài 16.1–16.5 (Ubuntu 24.04 có systemd thật trong container, không mạng; hoặc dùng máy ảo Linux của bạn — các script chạy được ở đó). Bật máy và cài lỗi:</p>
${ma('bash', 's16/lab16/pha-lab16.sh')}
${lenh('s16/lab16', 0)}

<h3>Bước 1 — chạy bộ kiểm (đừng đọc nó trước)</h3>
${lenh('s16/lab16', 1)}
${lenh('s16/lab16', 2)}
<p>2 trên 10. Để ý "logrotate -d chạy không lỗi" và "nginx -t hợp lệ" đều đạt — không có gì hỏng theo nghĩa một dịch vụ bị sập. Mọi thứ đều hỏng theo nghĩa của chương này.</p>

<h3>Bước 2 — việc của bạn</h3>
<ol>
<li>Với mỗi dấu ✗, ghi bài nào giải thích nó và chuyện gì có thể xảy ra trong một sự cố thật.</li>
<li>Quyết định <strong>thứ tự</strong> sửa và giải thích trong một câu.</li>
<li>Sửa mọi thứ trên máy tới khi bộ kiểm hiện 10/10. Không được chỉ xoá tệp: ứng dụng vẫn phải ghi log, nginx vẫn phải phục vụ, rsyslog vẫn phải chạy.</li>
<li>Với hai bí mật tìm thấy trong log, ghi bạn sẽ làm gì ngoài đời thật <em>trước khi</em> sửa bất kỳ tệp nào.</li>
<li>Áp cùng phép rà soát cho lab của bạn (Chương 10, 13, 15): giới hạn log Docker (<code>docker inspect -f '{{.HostConfig.LogConfig}}'</code> cho từng container), giới hạn journald, thời gian lưu của Loki, và trên máy Windows của bạn là kích thước và cách giữ của log Security (Event Viewer → Security → Properties, Chương 4).</li>
<li>Viết chính sách log một trang (16.6) cho lab đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bộ kiểm 10/10; một báo cáo ngắn (năm dòng như Lab 10: sai gì, bằng chứng, sửa thế nào, kiểm lại ra sao, còn lại gì); trang chính sách; và với việc 5, mỗi nguồn một dòng ghi giới hạn và thời gian lưu.</p>

<details>
<summary><strong>Lời giải (chỉ mở sau khi đã thử)</strong></summary>
<p>Chính bộ kiểm:</p>
${ma('bash', 's16/lab16/kiem-lab16.sh')}
<p><strong>Thứ tự:</strong> chặn lọt mới trước (định dạng nginx), rồi xử lý cái đã lọt, rồi quyền, rồi xoay/thời gian lưu, rồi gửi đi. Sửa quyền trước trong khi nginx vẫn đang ghi token thì chỗ lọt vẫn còn chảy.</p>
<p><strong>Việc 4:</strong> khoá Stripe và mật khẩu là bí mật thật đối với hệ thống: thu hồi khoá trên trang quản trị Stripe và bắt đặt lại mật khẩu tài khoản đó <em>trước tiên</em>; rồi mới che tại chỗ; rồi tìm mọi bản sao (tệp đã xoay, bản sao ở <code>/tmp</code>, kho trung tâm, bản sao lưu) — bài 16.3.</p>
${ma('bash', 's16/lab16/sua-lab16.sh')}
${lenh('s16/lab16', 3)}
${lenh('s16/lab16', 4)}
${lenh('s16/lab16', 5)}
<p>Bí mật đã được che tại chỗ, request mới có <code>?token=</code> được ghi thành <code>[CHE]</code>, và journal giờ nằm ở <code>/var/log/journal</code>. Một cái bẫy gặp thật khi soạn lời giải này: đặt <code>log_format che</code> trong <code>conf.d/</code> rồi đổi dòng <code>access_log</code> có sẵn trong <code>nginx.conf</code> sang dùng nó sẽ lỗi <em>unknown log format "che"</em>, vì dòng <code>access_log</code> đó đứng <em>trước</em> <code>include conf.d/*.conf</code>. Lời giải tắt dòng cũ và khai <code>access_log</code> trong <code>conf.d</code>, sau định dạng. Đó là lý do bộ kiểm thử <code>nginx -t</code> và gửi một request thật — bộ kiểm chỉ đọc tệp cấu hình sẽ cho qua một web server đang hỏng.</p>
<p><strong>Việc 5 (hay gặp):</strong> container không có <code>max-size</code> trên máy mà <code>daemon.json</code> không đặt mặc định (sửa ở <code>daemon.json</code> hoặc từng service trong Compose — Observability 2.2); Loki của Chương 15 với <code>retention_period: 0s</code> (16.1); log Security của Windows để mức tối đa mặc định 20 MB (20 480 KB) với "ghi đè khi cần", trên máy bận chỉ giữ được vài ngày — CIS Benchmark khuyên ít nhất 196 608 KB (192 MB); tăng lên và gửi về kho trung tâm (15.4).</p>
</details>

<h3>Câu hỏi phỏng vấn lab này chuẩn bị cho bạn</h3>
<ul>
<li>"Bạn tiếp quản một máy chủ. Giờ đầu tiên bạn kiểm gì về log của nó?"</li>
<li>"Bạn thấy một API key đang dùng thật trong một tệp log. Kể 30 phút tiếp theo của bạn."</li>
<li>"Vì sao bộ kiểm gửi request thật tốt hơn bộ kiểm grep tệp cấu hình?"</li>
</ul>

<h3>Mốc dự án</h3>
<p>Thêm <code>kiem-lab16.sh</code> (sửa cho hợp hệ của bạn) vào dự án cuối khoá (Chương 18) làm bước kiểm trước khi bàn giao, và giữ trang chính sách trong kho mã.</p>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Rà soát (audit)', 'Kiểm có hệ thống theo danh sách quy tắc, kèm bằng chứng.'],
  ['Kiểm đầu-cuối', 'Thử hành vi thật (gửi request, đọc log) thay vì đọc cấu hình.'],
  ['Thứ tự khắc phục', 'Chặn lọt → xử lý phần đã lộ → siết quyền → giữ/xoay → gửi đi.'],
])}
${nguon('📘', 'CIS Benchmark (Tenable) — Security: Specify the maximum log file size (KB)', 'Mặc định 20 480 KB, khuyến nghị ≥ 196 608 KB', 'https://www.tenable.com/audits/items/CIS_Microsoft_Windows_Server_2019_v5.0.0_L1_MS.audit:4ce9f798a0241285d77165ed7736d9a8')}
${lienKet({ khoa: 'observability-monitoring', bai: 'obs-2-2-xoay-vong', title: 'Observability 2.2 — Xoay vòng, hoặc là đĩa đầy', sub: 'max-size/max-file của Docker', cta: 'Mở bài' })}
</div>
`,
};
