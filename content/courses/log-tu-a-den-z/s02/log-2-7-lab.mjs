/**
 * 2.7 — Lab 2: 24 giờ access log, 10 câu hỏi, hai shell (soạn 22/11/2026).
 * Đáp án chạy thật: CODE/OUT['s02/lab2'] (bash: GNU coreutils + mawk, Ubuntu 24.04) và CODE['s02/lab2.ps1'] / OUT['s02/lab2.ps'] (PowerShell 7.7).
 * Hai bên ra cùng đáp số; câu 2 khác thứ tự ở hàng hoà (68 request) — dùng để dạy chuyện "hoà" khi xếp hạng.
 */
import { ma, ra, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.7 — Lab 2 — 24 hours of access log: answer 10 questions with one-liners on Linux and on Windows|||2.7 — Lab 2 — 24 giờ access log: trả lời 10 câu hỏi bằng lệnh một dòng trên Linux và trên Windows',
  slug: 'log-2-7-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab có chấm: mười câu hỏi thật về một ngày access log (tổng request, top 10 IP, URL lỗi nhiều nhất, phút đông nhất, tỉ lệ 5xx, User-Agent lạ, IP bị 401 nhiều nhất và nó có vào được không, giờ đông nhất, tổng dung lượng) — làm hai lần, bash và PowerShell, mỗi câu một dòng lệnh; đáp án chạy thật ở cả hai shell, kèm bài học về hàng hoà khi xếp hạng và "giờ đông nhất là giờ bị tấn công".',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab 2</span>
<h2>Lab 2 — One day of access log, ten questions, two shells</h2>
<p class="lead">Your team lead forwards <code>web/access.log</code> from 20/11/2026 and writes: "Something happened yesterday — two things, maybe. Give me numbers by lunch." Answer the ten questions below, each with <strong>one line</strong> of commands, first in bash, then in PowerShell. Then write the two-sentence summary your lead asked for.</p>

<h3>The ten questions</h3>
<ol>
<li>How many requests did the server receive in total?</li>
<li>Which 10 IP addresses sent the most requests?</li>
<li>Which 5 (status, URL) pairs with status ≥ 400 are most frequent?</li>
<li>Which single minute had the most requests, and how many?</li>
<li>What percentage of all requests were server errors (5xx)?</li>
<li>Which 3 User-Agents appear the <em>fewest</em> times — and what are they?</li>
<li>Which IP received the most 401 responses?</li>
<li>Did that IP ever get a 200? When, and on which URLs?</li>
<li>Which hour of the day (00–23) had the most requests?</li>
<li>How much data (MB) did the server send in total?</li>
</ol>
<div class="callout warn"><p><strong>Rules.</strong> One line per answer (pipes allowed). No editors, no scripts. Do bash first; then redo all ten in PowerShell without looking at your bash lines. Time yourself — the target is under 45 minutes for both.</p></div>

<h3>Hints</h3>
<ul>
<li>Q3, Q5, Q7: the status is column 9 (<code>$9</code> in awk; element 8 after <code>-split ' '</code> in PowerShell, which counts from 0).</li>
<li>Q4, Q9: substrings of column 4 (lesson 2.3, Step 4).</li>
<li>Q6: split on the double quote — User-Agent is quoted field 6 in awk (<code>-F'"'</code>), element 5 in PowerShell.</li>
<li>Q8: filter the IP first, then the status.</li>
</ul>

<h3>Answer key — bash (run for real)</h3>
${ma('bash', 's02/lab2.sh')}
${ra('s02/lab2')}

<h3>Answer key — PowerShell (run for real, PowerShell 7)</h3>
${ma('powershell', 's02/lab2.ps1')}
${ra('s02/lab2.ps')}

<h3>Reading the answers</h3>
<ul>
<li><strong>Same numbers, two shells</strong> — 4105 requests, 3.34% 5xx, 77.9 MB, the same top IP, minute and hour. If yours differ, you probably counted a different column (for example <code>' 502 '</code> anywhere in the line) — check the column.</li>
<li><strong>Ties.</strong> In Q2, places 9–10 hold IPs with 69 and 68 requests; bash lists <code>198.51.100.114</code> tenth, PowerShell <code>192.0.2.33</code> — both have 68. Sorting by count alone leaves ties in an arbitrary order. When you report a "top 10", say "ties at 68" or sort by a second key (bash: <code>sort -k1,1nr -k2,2</code>).</li>
<li><strong>The busiest hour is an attack.</strong> Q9 says 02 (442 requests), but Q7–Q8 show 420 of them were one script guessing passwords from <code>203.0.113.66</code> — and at 02:41:07 it succeeded, then called <code>/api/v1/me</code>. The busiest minute (Q4, 14:07) is the outage, when users kept reloading. Neither peak is "real traffic".</li>
<li><strong>Q6 is the security question:</strong> the rarest User-Agents are a Log4Shell probe (one line), the Nikto scanner (30) and <code>python-requests</code> (422 — the password guesser). Rare values are where attackers hide.</li>
</ul>
<p>A good summary for your lead: <em>"Two incidents on 20/11. (1) 02:10–02:41: 420 failed logins from 203.0.113.66, then one successful login at 02:41:07 — that account must be checked and its password reset. (2) 14:04–14:08: about 140 API requests failed with 502/504 (3.3% of the day), consistent with the backend losing its database; static pages stayed up."</em></p>
<div class="pitfall co-tieu-de"><p><strong>Numbers without context mislead.</strong> "Peak traffic at 02:00" in a report would send people looking for a marketing campaign. Always say what the traffic <em>was</em> before reporting how much of it there was.</p></div>

<h3>Done when</h3>
<div class="callout ok"><ol>
<li>All ten answers match the key in both shells (ties excepted, if you explain them).</li>
<li>Each answer is one line, typed by you.</li>
<li>You wrote a two-sentence summary that names both incidents with times and the compromised login.</li>
</ol>
<p><strong>Done when:</strong> the three points hold. Copy your best line for each question into your notebook — you will reuse them in Chapters 10 and 14.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['one-liner', 'A single command line, usually a pipeline, that answers one question.'],
  ['tie', 'Two items with the same count; their order after sorting is arbitrary.'],
  ['secondary sort key', 'A second column used to order ties (sort -k1,1nr -k2,2).'],
  ['baseline', 'What normal looks like — needed before calling something a peak.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Ten real questions, each one line, in bash and in PowerShell — the same numbers.</li>
<li>Count the right column; sort before <code>uniq</code>; handle ties explicitly.</li>
<li>Peaks need context: the busiest hour was an attack, the busiest minute an outage.</li>
<li>Rare values (User-Agents, URLs) are where suspicious activity shows up.</li>
<li>Finish with a short summary for a human: what, when, impact, next step.</li>
</ul>
${nguon('📘', 'nginx — log_format combined', 'The column order every answer here depends on', 'https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-0-8-bat-dau-tai-day', title: 'Blue Team &amp; SIEM — start here', sub: 'Where questions like Q7–Q8 become automatic detections', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab 2</span>
<h2>Lab 2 — Một ngày access log, mười câu hỏi, hai shell</h2>
<p class="lead">Trưởng nhóm chuyển cho bạn <code>web/access.log</code> của ngày 20/11/2026 và nhắn: "Hôm qua có chuyện — chắc là hai chuyện. Trước giờ ăn trưa gửi anh số liệu nhé." Hãy trả lời mười câu dưới đây, mỗi câu <strong>một dòng</strong> lệnh, trước bằng bash, sau bằng PowerShell. Rồi viết bản tóm tắt hai câu mà trưởng nhóm cần.</p>

<h3>Mười câu hỏi</h3>
<ol>
<li>Server nhận tổng cộng bao nhiêu request?</li>
<li>10 địa chỉ IP nào gửi nhiều request nhất?</li>
<li>5 cặp (mã trạng thái, URL) nào với mã ≥ 400 hay gặp nhất?</li>
<li>Phút nào đông request nhất, và bao nhiêu?</li>
<li>Bao nhiêu phần trăm request là lỗi server (5xx)?</li>
<li>3 User-Agent nào xuất hiện <em>ít</em> nhất — và chúng là gì?</li>
<li>IP nào nhận nhiều phản hồi 401 nhất?</li>
<li>IP đó có bao giờ nhận được 200 không? Lúc nào, ở URL nào?</li>
<li>Giờ nào trong ngày (00–23) đông request nhất?</li>
<li>Server đã gửi tổng cộng bao nhiêu dữ liệu (MB)?</li>
</ol>
<div class="callout warn"><p><strong>Luật chơi.</strong> Mỗi câu một dòng (được dùng ống |). Không trình soạn thảo, không script. Làm bash trước; rồi làm lại cả mười câu bằng PowerShell mà không nhìn các dòng bash. Bấm giờ — mục tiêu là dưới 45 phút cho cả hai.</p></div>

<h3>Gợi ý</h3>
<ul>
<li>Câu 3, 5, 7: mã trạng thái là cột 9 (<code>$9</code> trong awk; phần tử 8 sau <code>-split ' '</code> trong PowerShell, vì đếm từ 0).</li>
<li>Câu 4, 9: các chuỗi con của cột 4 (bài 2.3, Bước 4).</li>
<li>Câu 6: tách theo dấu nháy kép — User-Agent là trường trong nháy thứ 6 với awk (<code>-F'"'</code>), phần tử 5 với PowerShell.</li>
<li>Câu 8: lọc theo IP trước, rồi theo mã.</li>
</ul>

<h3>Đáp án — bash (chạy thật)</h3>
${ma('bash', 's02/lab2.sh')}
${ra('s02/lab2')}

<h3>Đáp án — PowerShell (chạy thật, PowerShell 7)</h3>
${ma('powershell', 's02/lab2.ps1')}
${ra('s02/lab2.ps')}

<h3>Đọc đáp án</h3>
<ul>
<li><strong>Cùng con số, hai shell</strong> — 4105 request, 3,34% lỗi 5xx, 77,9 MB, cùng IP đứng đầu, cùng phút và giờ. Nếu của bạn khác, nhiều khả năng bạn đếm nhầm cột (ví dụ tìm <code>' 502 '</code> ở bất kỳ đâu trong dòng) — kiểm lại cột.</li>
<li><strong>Hàng hoà.</strong> Ở câu 2, vị trí 9–10 là các IP có 69 và 68 request; bash xếp <code>198.51.100.114</code> thứ mười, PowerShell lại là <code>192.0.2.33</code> — cả hai cùng 68. Chỉ xếp theo số đếm thì các hàng hoà có thứ tự tuỳ ý. Khi báo "top 10", hãy ghi "hoà ở 68" hoặc xếp thêm theo khoá thứ hai (bash: <code>sort -k1,1nr -k2,2</code>).</li>
<li><strong>Giờ đông nhất là giờ bị tấn công.</strong> Câu 9 ra giờ 02 (442 request), nhưng câu 7–8 cho thấy 420 trong số đó là một script đoán mật khẩu từ <code>203.0.113.66</code> — và lúc 02:41:07 nó đã thành công, rồi gọi <code>/api/v1/me</code>. Phút đông nhất (câu 4, 14:07) là lúc sự cố, khi người dùng cứ bấm tải lại. Cả hai đỉnh đều không phải "lưu lượng thật".</li>
<li><strong>Câu 6 là câu bảo mật:</strong> các User-Agent hiếm nhất là một lần dò Log4Shell (một dòng), máy quét Nikto (30) và <code>python-requests</code> (422 — kẻ đoán mật khẩu). Giá trị hiếm là chỗ kẻ tấn công ẩn mình.</li>
</ul>
<p>Một bản tóm tắt tốt gửi trưởng nhóm: <em>"Ngày 20/11 có hai sự cố. (1) 02:10–02:41: 420 lần đăng nhập sai từ 203.0.113.66, rồi một lần đăng nhập thành công lúc 02:41:07 — phải kiểm tài khoản đó và đặt lại mật khẩu. (2) 14:04–14:08: khoảng 140 request API lỗi 502/504 (3,3% cả ngày), khớp với việc backend mất kết nối CSDL; các trang tĩnh vẫn chạy."</em></p>
<div class="pitfall co-tieu-de"><p><strong>Con số thiếu ngữ cảnh thì đánh lừa.</strong> Một báo cáo ghi "lưu lượng đỉnh lúc 02:00" sẽ khiến mọi người đi tìm một chiến dịch quảng cáo. Luôn nói lưu lượng đó <em>là gì</em> trước khi báo nó nhiều bao nhiêu.</p></div>

<h3>Tiêu chí đạt</h3>
<div class="callout ok"><ol>
<li>Cả mười đáp án khớp với đáp án ở cả hai shell (trừ hàng hoà, nếu bạn giải thích được).</li>
<li>Mỗi đáp án là một dòng, do chính bạn gõ.</li>
<li>Bạn viết được bản tóm tắt hai câu có đủ hai sự cố, thời gian và lần đăng nhập bị chiếm.</li>
</ol>
<p><strong>Đạt khi:</strong> đủ ba điểm. Chép dòng lệnh tốt nhất của mỗi câu vào sổ — bạn sẽ dùng lại ở Chương 10 và 14.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['one-liner (lệnh một dòng)', 'Một dòng lệnh, thường là một đường ống, trả lời một câu hỏi.'],
  ['tie (hàng hoà)', 'Hai mục cùng số đếm; thứ tự của chúng sau khi xếp là tuỳ ý.'],
  ['secondary sort key (khoá xếp thứ hai)', 'Cột thứ hai dùng để xếp các hàng hoà (sort -k1,1nr -k2,2).'],
  ['baseline (mức nền)', 'Bình thường trông thế nào — cần biết trước khi gọi cái gì đó là đỉnh.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mười câu hỏi thật, mỗi câu một dòng, bằng bash và PowerShell — cùng con số.</li>
<li>Đếm đúng cột; sort trước <code>uniq</code>; xử lý hàng hoà rõ ràng.</li>
<li>Đỉnh cần ngữ cảnh: giờ đông nhất là tấn công, phút đông nhất là sự cố.</li>
<li>Giá trị hiếm (User-Agent, URL) là nơi hoạt động đáng ngờ lộ ra.</li>
<li>Kết thúc bằng bản tóm tắt ngắn cho người đọc: cái gì, lúc nào, ảnh hưởng, bước tiếp theo.</li>
</ul>
${nguon('📘', 'nginx — log_format combined', 'Thứ tự cột mà mọi đáp án ở đây dựa vào', 'https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format')}
${lienKet({ khoa: 'blue-team-siem', bai: 'siem-0-8-bat-dau-tai-day', title: 'Blue Team &amp; SIEM — bắt đầu tại đây', sub: 'Nơi các câu như câu 7–8 thành luật phát hiện tự động' })}
</div>
`,
};
