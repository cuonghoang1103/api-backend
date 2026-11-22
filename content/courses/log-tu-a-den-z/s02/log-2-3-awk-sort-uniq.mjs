/**
 * 2.3 — awk, cut, sort, uniq -c (soạn 22/11/2026).
 * Output: OUT['s02/awk'] — mawk 1.3.4 (awk mặc định của Ubuntu 24.04) trên web/access.log của gói mẫu.
 * Không trùng: lnx-3-6-awk (awk chuyên sâu) — ở đây chỉ công thức đếm-xếp-cắt cho log.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.3 — awk, cut, sort, uniq -c: top IPs, top URLs, requests per minute|||2.3 — awk, cut, sort, uniq -c: IP gọi nhiều nhất, URL nhiều nhất, số request mỗi phút',
  slug: 'log-2-3-awk-sort-uniq',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bản đồ cột của access log "combined" ($1 IP, $4 giờ, $7 URL, $9 mã, $10 byte); công thức đếm-xếp-cắt sort | uniq -c | sort -nr | head; awk lọc theo điều kiện ($9 >= 500), cộng dồn trong END (tỉ lệ 5xx, tổng MB); gom theo phút và theo giờ bằng substr — đọc ra cơn bão tải lại lúc 14:07 và giờ 02 bị vụ dò mật khẩu làm phình; tách theo dấu nháy để lấy User-Agent; cut khi cột cố định. Chạy thật.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>awk, sort, uniq: turn 4,000 lines into five numbers that matter</h2>
<p class="lead"><code>grep</code> finds lines; it cannot tell you "which IP sent the most requests" or "how many errors per minute". For that you split each line into columns and count. One pipeline — <em>extract, sort, count, sort again, cut</em> — answers most questions you will ever ask an access log. After this lesson you will type it without thinking.</p>

<h3>The everyday picture: counting votes</h3>
<p>After a class vote, someone reads every paper aloud (extract the name), you sort the papers into piles (sort), count each pile (count), arrange piles from tallest to shortest (sort again) and announce the top three (cut). That is <code>awk '{print $1}' | sort | uniq -c | sort -nr | head -n 3</code>.</p>

<h3>Step 1 — the column map of an access log</h3>
<p>awk splits a line on spaces into <code>$1</code>, <code>$2</code>… In the nginx/Apache "combined" format the useful columns are:</p>
<table>
<thead><tr><th>Column</th><th>Example</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><code>$1</code></td><td><code>192.0.2.15</code></td><td>Client IP (or the proxy's IP — Chapter 13)</td></tr>
<tr><td><code>$4</code></td><td><code>[20/Nov/2026:00:00:04</code></td><td>Time (with the opening bracket); <code>$5</code> is the offset <code>+0700]</code></td></tr>
<tr><td><code>$6</code></td><td><code>"GET</code></td><td>Method, with the opening quote</td></tr>
<tr><td><code>$7</code></td><td><code>/static/app.js</code></td><td>URL path and query</td></tr>
<tr><td><code>$9</code></td><td><code>200</code></td><td>Status code</td></tr>
<tr><td><code>$10</code></td><td><code>182000</code></td><td>Response size in bytes</td></tr>
</tbody></table>
<p>Referrer and User-Agent contain spaces, so counting space-separated columns breaks after <code>$10</code>; Step 6 handles them by splitting on quotes instead.</p>

<h3>Step 2 — the count-sort-cut recipe: who talks to us most?</h3>
${lenh('s02/awk', 0)}
<p>Read the pipeline left to right: print column 1; <code>sort</code> so identical IPs are adjacent (<code>uniq</code> only merges neighbours — without the first sort the counts are wrong); <code>uniq -c</code> prefixes each with its count; <code>sort -nr</code> sorts numerically, largest first; <code>head</code> cuts. One address sent 422 requests — more than five times the next. You already know why (lesson 0.8).</p>

<h3>Step 3 — the status code mix, and conditions</h3>
${lenh('s02/awk', 1)}
${lenh('s02/awk', 2)}
<p><code>awk '$9 &gt;= 500 {print $7}'</code> means "for lines whose 9th column is at least 500, print the 7th". The condition goes before the braces. All 137 server errors are on API paths — the static pages kept working, which already points at the backend, not nginx.</p>

<h3>Step 4 — per minute and per hour</h3>
${lenh('s02/awk', 3)}
${lenh('s02/awk', 4)}
<p><code>substr($4, 2, 17)</code> takes 17 characters starting at position 2 (skipping the bracket): <code>20/Nov/2026:14:07</code>, i.e. the minute. The busiest minutes are 14:05–14:07 — exactly the outage, because users kept pressing reload. Per hour (<code>substr($4, 14, 2)</code>, sorted by hour with <code>sort -k2n</code>), hour 02 has 442 requests against 40–60 for its neighbours: the password-guessing burst, not real users.</p>
<div class="pitfall co-tieu-de"><p><strong>"Busiest" is not "healthiest".</strong> Both peaks here are incidents: a reload storm and an attack. Before telling your team "traffic peaked at 14:07", check <em>what</em> the traffic was.</p></div>

<h3>Step 5 — sums and ratios in END</h3>
${lenh('s02/awk', 5)}
${lenh('s02/awk', 6)}
<p>The block after <code>END</code> runs once, after the last line. <code>e++</code> counts matching lines; <code>NR</code> is the number of lines read; <code>b += $10</code> sums bytes. 3.34% of the day's requests were server errors, and the server sent 77.9 MB.</p>

<h3>Step 6 — fields with spaces: split on quotes</h3>
${lenh('s02/awk', 7)}
<p><code>-F'"'</code> makes the quote the separator: <code>$2</code> is the request, <code>$4</code> the referrer, <code>$6</code> the User-Agent. Sorting by <em>smallest</em> count (<code>sort -n</code>) is the trick for finding the odd ones out: one Log4Shell probe, 30 lines from the Nikto scanner, 422 from a Python script. Real browsers appear in the hundreds.</p>

<h3>Step 7 — cut, when columns are fixed</h3>
${lenh('s02/awk', 8)}
<p><code>cut -d' ' -f1</code> is a lighter way to take one space-separated column. It cannot handle repeated spaces or conditions; awk can. Use <code>cut</code> for quick single columns, awk for everything else.</p>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>List the top 5 URLs by number of requests (any status).</li>
<li>How many requests did <code>/api/v1/feed</code> receive that were <em>not</em> errors (status below 400)?</li>
<li>Print requests per minute between 14:00 and 14:10 in time order (hint: filter with <code>$4 ~ /14:0[0-9]:/</code>, then <code>sort</code> without <code>-n</code>).</li>
<li>Compute the average response size of 200 responses with an <code>END</code> block.</li>
</ol>
<p><strong>Done when:</strong> your step-3 output shows the jump from a handful of requests per minute before 14:04 to 30+ during the outage, and you can read every part of each pipeline aloud.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['field ($1, $9…)', 'A column of the line after awk splits it.'],
  ['-F', 'Sets the field separator (space by default; -F&#39;&quot;&#39; for quotes).'],
  ['NR', 'Number of records (lines) read so far.'],
  ['END block', 'Code awk runs once after the last line — for totals and ratios.'],
  ['uniq -c', 'Collapse adjacent identical lines and prefix their count.'],
  ['sort -nr / -k2n', 'Numeric, reversed / numeric on the second column.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Combined format: <code>$1</code> IP, <code>$4</code> time, <code>$7</code> URL, <code>$9</code> status, <code>$10</code> bytes.</li>
<li>Recipe: <code>awk '{print $N}' | sort | uniq -c | sort -nr | head</code> — always sort before <code>uniq</code>.</li>
<li>Conditions (<code>$9 &gt;= 500</code>) filter; <code>END</code> computes totals and ratios.</li>
<li><code>substr($4, 2, 17)</code> = per minute, <code>substr($4, 14, 2)</code> = per hour.</li>
<li>Split on quotes for User-Agent; sort ascending to find rare, suspicious values.</li>
</ul>
${nguon('📘', 'man awk (mawk)', 'The awk shipped by default on Ubuntu; POSIX features used in this lesson', 'https://manpages.ubuntu.com/manpages/noble/man1/mawk.1.html')}
${nguon('📘', 'nginx — log_format combined', 'The exact field order of the combined format', 'https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-6-awk', title: 'Linux &amp; Bash 3.6 — awk in depth', sub: 'Variables, arrays, printf, functions', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>awk, sort, uniq: biến 4.000 dòng thành năm con số đáng giá</h2>
<p class="lead"><code>grep</code> tìm dòng; nó không cho bạn biết "IP nào gửi nhiều request nhất" hay "mỗi phút bao nhiêu lỗi". Muốn vậy phải tách mỗi dòng thành cột rồi đếm. Một đường ống — <em>rút, xếp, đếm, xếp lại, cắt</em> — trả lời được phần lớn câu hỏi bạn sẽ hỏi một access log. Hết bài, bạn sẽ gõ nó mà không cần nghĩ.</p>

<h3>Liên tưởng đời thường: kiểm phiếu</h3>
<p>Sau một cuộc bầu trong lớp, một người đọc to từng lá phiếu (rút tên), bạn chia phiếu thành từng chồng (xếp), đếm từng chồng (đếm), xếp các chồng từ cao xuống thấp (xếp lại) và công bố ba người đứng đầu (cắt). Đó chính là <code>awk '{print $1}' | sort | uniq -c | sort -nr | head -n 3</code>.</p>

<h3>Bước 1 — bản đồ cột của access log</h3>
<p>awk tách dòng theo dấu cách thành <code>$1</code>, <code>$2</code>… Trong định dạng "combined" của nginx/Apache, các cột có ích là:</p>
<table>
<thead><tr><th>Cột</th><th>Ví dụ</th><th>Ý nghĩa</th></tr></thead>
<tbody>
<tr><td><code>$1</code></td><td><code>192.0.2.15</code></td><td>IP máy khách (hoặc IP của proxy — Chương 13)</td></tr>
<tr><td><code>$4</code></td><td><code>[20/Nov/2026:00:00:04</code></td><td>Thời điểm (kèm dấu ngoặc mở); <code>$5</code> là độ lệch <code>+0700]</code></td></tr>
<tr><td><code>$6</code></td><td><code>"GET</code></td><td>Phương thức, kèm dấu nháy mở</td></tr>
<tr><td><code>$7</code></td><td><code>/static/app.js</code></td><td>Đường dẫn URL và query</td></tr>
<tr><td><code>$9</code></td><td><code>200</code></td><td>Mã trạng thái</td></tr>
<tr><td><code>$10</code></td><td><code>182000</code></td><td>Kích thước phản hồi tính bằng byte</td></tr>
</tbody></table>
<p>Referrer và User-Agent có dấu cách bên trong, nên đếm cột theo dấu cách sẽ hỏng sau <code>$10</code>; Bước 6 xử lý chúng bằng cách tách theo dấu nháy.</p>

<h3>Bước 2 — công thức đếm-xếp-cắt: ai nói chuyện với ta nhiều nhất?</h3>
${lenh('s02/awk', 0)}
<p>Đọc đường ống từ trái sang phải: in cột 1; <code>sort</code> để các IP giống nhau nằm cạnh nhau (<code>uniq</code> chỉ gộp các dòng liền kề — thiếu lần sort đầu là đếm sai); <code>uniq -c</code> thêm số đếm vào trước mỗi dòng; <code>sort -nr</code> xếp theo số, lớn nhất lên đầu; <code>head</code> cắt. Một địa chỉ gửi 422 request — gấp hơn năm lần người đứng thứ hai. Bạn đã biết vì sao (bài 0.8).</p>

<h3>Bước 3 — phân bố mã trạng thái, và điều kiện</h3>
${lenh('s02/awk', 1)}
${lenh('s02/awk', 2)}
<p><code>awk '$9 &gt;= 500 {print $7}'</code> nghĩa là "với các dòng có cột 9 từ 500 trở lên, in cột 7". Điều kiện đứng trước cặp ngoặc nhọn. Cả 137 lỗi server đều ở đường dẫn API — trang tĩnh vẫn chạy bình thường, điều này đã chỉ về phía backend chứ không phải nginx.</p>

<h3>Bước 4 — theo phút và theo giờ</h3>
${lenh('s02/awk', 3)}
${lenh('s02/awk', 4)}
<p><code>substr($4, 2, 17)</code> lấy 17 ký tự bắt đầu từ vị trí 2 (bỏ dấu ngoặc): <code>20/Nov/2026:14:07</code>, tức là phút. Những phút đông nhất là 14:05–14:07 — đúng lúc sự cố, vì người dùng cứ bấm tải lại. Theo giờ (<code>substr($4, 14, 2)</code>, xếp theo giờ bằng <code>sort -k2n</code>), giờ 02 có 442 request so với 40–60 của các giờ bên cạnh: đợt dò mật khẩu, không phải người dùng thật.</p>
<div class="pitfall co-tieu-de"><p><strong>"Đông nhất" không có nghĩa là "khoẻ nhất".</strong> Cả hai đỉnh ở đây đều là sự cố: một cơn bão tải lại và một cuộc tấn công. Trước khi báo nhóm "lưu lượng đạt đỉnh lúc 14:07", hãy kiểm lưu lượng đó <em>là gì</em>.</p></div>

<h3>Bước 5 — tổng và tỉ lệ trong END</h3>
${lenh('s02/awk', 5)}
${lenh('s02/awk', 6)}
<p>Khối sau <code>END</code> chạy một lần, sau dòng cuối cùng. <code>e++</code> đếm dòng khớp; <code>NR</code> là số dòng đã đọc; <code>b += $10</code> cộng dồn byte. 3,34% request trong ngày là lỗi server, và server đã gửi 77,9 MB.</p>

<h3>Bước 6 — trường có dấu cách: tách theo dấu nháy</h3>
${lenh('s02/awk', 7)}
<p><code>-F'"'</code> lấy dấu nháy làm dấu ngăn: <code>$2</code> là request, <code>$4</code> là referrer, <code>$6</code> là User-Agent. Xếp theo số đếm <em>nhỏ nhất</em> (<code>sort -n</code>) là mẹo tìm kẻ lạ: một lần dò Log4Shell, 30 dòng của máy quét Nikto, 422 dòng từ một script Python. Trình duyệt thật thì hiện ra cả trăm dòng.</p>

<h3>Bước 7 — cut, khi cột cố định</h3>
${lenh('s02/awk', 8)}
<p><code>cut -d' ' -f1</code> là cách nhẹ hơn để lấy một cột ngăn bằng dấu cách. Nó không xử lý được dấu cách lặp hay điều kiện; awk thì được. Dùng <code>cut</code> cho một cột nhanh, awk cho mọi thứ còn lại.</p>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê 5 URL có nhiều request nhất (mọi mã trạng thái).</li>
<li><code>/api/v1/feed</code> nhận bao nhiêu request <em>không</em> lỗi (mã dưới 400)?</li>
<li>In số request mỗi phút từ 14:00 tới 14:10 theo thứ tự thời gian (gợi ý: lọc bằng <code>$4 ~ /14:0[0-9]:/</code>, rồi <code>sort</code> không có <code>-n</code>).</li>
<li>Tính kích thước trung bình của các phản hồi 200 bằng một khối <code>END</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> output bước 3 cho thấy cú nhảy từ vài request mỗi phút trước 14:04 lên hơn 30 trong lúc sự cố, và bạn đọc to được từng phần của mỗi đường ống.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['field ($1, $9…) (trường)', 'Một cột của dòng sau khi awk tách ra.'],
  ['-F', 'Đặt dấu ngăn trường (mặc định là dấu cách; -F&#39;&quot;&#39; cho dấu nháy).'],
  ['NR', 'Số bản ghi (dòng) đã đọc tới lúc đó.'],
  ['END block (khối END)', 'Đoạn mã awk chạy một lần sau dòng cuối — để tính tổng và tỉ lệ.'],
  ['uniq -c', 'Gộp các dòng giống nhau nằm liền kề và thêm số đếm phía trước.'],
  ['sort -nr / -k2n', 'Theo số, đảo ngược / theo số ở cột thứ hai.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Định dạng combined: <code>$1</code> IP, <code>$4</code> giờ, <code>$7</code> URL, <code>$9</code> mã, <code>$10</code> byte.</li>
<li>Công thức: <code>awk '{print $N}' | sort | uniq -c | sort -nr | head</code> — luôn sort trước <code>uniq</code>.</li>
<li>Điều kiện (<code>$9 &gt;= 500</code>) để lọc; <code>END</code> để tính tổng và tỉ lệ.</li>
<li><code>substr($4, 2, 17)</code> = theo phút, <code>substr($4, 14, 2)</code> = theo giờ.</li>
<li>Tách theo dấu nháy để lấy User-Agent; xếp tăng dần để tìm giá trị hiếm, đáng ngờ.</li>
</ul>
${nguon('📘', 'man awk (mawk)', 'awk mặc định trên Ubuntu; các tính năng POSIX dùng trong bài', 'https://manpages.ubuntu.com/manpages/noble/man1/mawk.1.html')}
${nguon('📘', 'nginx — log_format combined', 'Thứ tự trường chính xác của định dạng combined', 'https://nginx.org/en/docs/http/ngx_http_log_module.html#log_format')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-6-awk', title: 'Linux &amp; Bash 3.6 — awk chuyên sâu', sub: 'Biến, mảng, printf, hàm' })}
</div>
`,
};
