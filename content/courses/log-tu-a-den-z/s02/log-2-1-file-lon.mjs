/**
 * 2.1 — Đọc tệp khổng lồ an toàn (soạn 22/11/2026).
 * Output: OUT['s02/file-lon'], OUT['s02/tail-xoay'] (tail -f vs -F khi tệp bị đổi tên, chạy thật trên tmpfs — Ubuntu 24.04).
 * less/Get-Content -Wait là tương tác ⇒ chỉ ghi phím/lệnh, không in output giả.
 * Nguồn: man tail (GNU coreutils: -f = --follow=descriptor, -F = --follow=name --retry), man less, Microsoft Learn Get-Content.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.1 — Reading huge files safely: less, tail -f/-F, head, zcat/zgrep, Get-Content -Tail -Wait|||2.1 — Đọc tệp khổng lồ an toàn: less, tail -f/-F, head, zcat/zgrep, Get-Content -Tail -Wait',
  slug: 'log-2-1-file-lon',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vì sao không mở log 5 GB bằng Notepad; less với các phím /, n, G, F, &; head, tail, sed -n lấy đúng đoạn dòng; tail -f bám tệp đang mở còn tail -F bám theo tên nên sống sót qua logrotate — chạy thật cả hai; đọc tệp .gz đã xoay vòng bằng zcat, zgrep, zcat -f; trên Windows: Get-Content -Tail -Wait.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Reading huge files safely: look at a 5 GB log without freezing your machine</h2>
<p class="lead">A production access log can be gigabytes. Double-clicking it opens Notepad or VS Code, which tries to load everything into memory — and on a server over SSH there is no window at all. This lesson gives you the tools that read <em>a piece</em> of a file: the start, the end, a range of lines, a live stream of new lines, and the compressed files log rotation leaves behind.</p>

<h3>The everyday picture: a 1,000-page book</h3>
<p>To check the last chapter of a thick book you do not photocopy the whole book; you open it at the end. <code>head</code> is the first page, <code>tail</code> the last, <code>less</code> a bookmark you can move, and <code>tail -F</code> a reporter standing next to the printer reading each new page as it comes out.</p>

<h3>Step 1 — how big is it, and what does it start and end with?</h3>
${lenh('s02/file-lon', 0)}
${lenh('s02/file-lon', 1)}
${lenh('s02/file-lon', 2)}
<p>Check size first (<code>ls -lh</code>), then the first and last lines: they tell you the format and the time range the file covers — here 20/11/2026 from 00:00 to almost midnight. <code>cut -c1-90</code> only shortens lines for display.</p>

<h3>Step 2 — jump to a range of lines</h3>
${lenh('s02/file-lon', 3)}
<p><code>sed -n 'A,Bp'</code> prints lines A to B and nothing else. Combined with <code>grep -n</code> (which prints line numbers, lesson 2.2) it is how you show "the 20 lines around line 2000" to a teammate.</p>

<h3>Step 3 — less: the pager for logs</h3>
<p><code>less web/access.log</code> opens instantly even on huge files, because it reads only what is on screen. The keys worth knowing:</p>
<table>
<thead><tr><th>Key</th><th>Does</th></tr></thead>
<tbody>
<tr><td><code>G</code> / <code>g</code></td><td>Jump to the end / to the start</td></tr>
<tr><td><code>/pattern</code> then <code>n</code> / <code>N</code></td><td>Search forward; next / previous match</td></tr>
<tr><td><code>?pattern</code></td><td>Search backward (useful after <code>G</code>: "the last error")</td></tr>
<tr><td><code>&amp;pattern</code></td><td>Show only matching lines (a grep inside less); <code>&amp;</code> + Enter to show all again</td></tr>
<tr><td><code>F</code></td><td>Follow new lines like <code>tail -f</code>; <code>Ctrl+C</code> to stop following</td></tr>
<tr><td><code>-S</code> (option)</td><td><code>less -S</code> does not wrap long lines; scroll sideways with arrow keys</td></tr>
<tr><td><code>q</code></td><td>Quit</td></tr>
</tbody></table>
<p><code>less +F file</code> starts in follow mode; <code>less +G file</code> starts at the end.</p>

<h3>Step 4 — following a live log: tail -f versus tail -F</h3>
<p>While you watch a log, log rotation (Chapter 8) may rename <code>access.log</code> to <code>access.log.1</code> and create a new empty <code>access.log</code>. The two follow modes react differently. The demo below writes one line, then renames the file and creates a new one — exactly what logrotate does:</p>
${lenh('s02/tail-xoay', 0)}
${lenh('s02/tail-xoay', 1)}
<p><code>tail -f</code> follows the <em>open file</em> (the same inode, now called <code>a.log.1</code>): it showed line 2 and then stayed silent forever, while new lines went into the new file. <code>tail -F</code> follows the <em>name</em>: it noticed the file was replaced, said so, and continued with the new file. For watching logs, always use <code>-F</code>; <code>tail -n 100 -F</code> shows the last 100 lines first.</p>
<div class="pitfall co-tieu-de"><p><strong>"The log stopped — the service must be frozen."</strong> Before you restart anything at 2 a.m., check whether you are following a rotated file with <code>tail -f</code>. <code>ls -l</code> will show a new, growing file next to the one you are watching.</p></div>

<h3>Step 5 — rotated, compressed files</h3>
${lenh('s02/file-lon', 4)}
${lenh('s02/file-lon', 5)}
${lenh('s02/file-lon', 6)}
<p><code>zcat</code> decompresses to the screen without creating a file; <code>zgrep</code> searches inside; <code>zcat -f</code> also passes plain files through unchanged, so one command reads "today plus yesterday" across <code>.log</code> and <code>.gz</code>. Other tools: <code>zless</code>, and <code>xzcat</code>/<code>zstdcat</code> for other compression formats.</p>

<h3>Step 6 — the same on Windows (PowerShell)</h3>
<table>
<thead><tr><th>Need</th><th>PowerShell</th></tr></thead>
<tbody>
<tr><td>Last 50 lines</td><td><code>Get-Content .\\access.log -Tail 50</code></td></tr>
<tr><td>Follow new lines (like <code>tail -F</code>)</td><td><code>Get-Content .\\access.log -Tail 20 -Wait</code></td></tr>
<tr><td>First 10 lines</td><td><code>Get-Content .\\access.log -TotalCount 10</code></td></tr>
<tr><td>Size</td><td><code>(Get-Item .\\access.log).Length / 1MB</code></td></tr>
</tbody></table>
<p><code>Get-Content</code> without <code>-Tail</code> reads the whole file into memory as objects — fine for megabytes, slow for gigabytes. Lesson 2.5 shows faster ways.</p>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>less +G web/access.log</code>, search backward with <code>?504</code>: at what time is the <em>last</em> 504? Then use <code>&amp;nikto</code> and count the lines on screen.</li>
<li>Open two terminals. In one: <code>tail -n 3 -F /tmp/thu.log</code>. In the other, append lines with <code>echo dong-$RANDOM &gt;&gt; /tmp/thu.log</code>, then rename with <code>mv /tmp/thu.log /tmp/thu.log.1</code> and append again. Repeat with <code>tail -f</code>.</li>
<li>How many 404 responses were there on 19/11 (the compressed file)?</li>
</ol>
<p><strong>Done when:</strong> you found the last 504 (14:07:14), saw <code>tail -F</code> survive the rename while <code>tail -f</code> did not, and answered 9.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['pager', 'A program that shows a file one screen at a time (less).'],
  ['follow mode', 'Keep printing new lines as they are appended (tail -f/-F, less F).'],
  ['inode', 'The file’s identity on disk; renaming keeps the inode, recreating makes a new one.'],
  ['log rotation', 'Renaming and compressing old logs and starting a new file.'],
  ['zcat / zgrep', 'Read / search .gz files without unpacking them to disk.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Never open a huge log in an editor; read pieces with <code>head</code>, <code>tail</code>, <code>sed -n</code>, <code>less</code>.</li>
<li>In <code>less</code>: <code>G</code>, <code>/</code> and <code>?</code>, <code>n</code>, <code>&amp;</code> filter, <code>F</code> follow, <code>q</code>.</li>
<li><code>tail -F</code> follows the name and survives log rotation; <code>tail -f</code> silently stops.</li>
<li><code>zcat</code>, <code>zgrep</code>, <code>zcat -f</code> read rotated <code>.gz</code> files together with the current log.</li>
<li>On Windows: <code>Get-Content -Tail N -Wait</code>.</li>
</ul>
${nguon('📘', 'man tail (GNU coreutils)', '-f = --follow=descriptor, -F = --follow=name --retry', 'https://man7.org/linux/man-pages/man1/tail.1.html')}
${nguon('📘', 'man less', 'Commands: /, ?, n, &amp;, F, G and options -S, +F', 'https://man7.org/linux/man-pages/man1/less.1.html')}
${nguon('📘', 'Microsoft Learn — Get-Content', '-Tail, -Wait, -TotalCount', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-content')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-3-grep-regex', title: 'Linux &amp; Bash 3.3 — grep and regex', sub: 'The text tools in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Đọc tệp khổng lồ an toàn: xem một log 5 GB mà không làm treo máy</h2>
<p class="lead">Access log production có thể nặng hàng gigabyte. Bấm đúp là Notepad hay VS Code mở ra và cố nạp hết vào bộ nhớ — còn trên server qua SSH thì chẳng có cửa sổ nào. Bài này cho bạn những công cụ đọc <em>một phần</em> của tệp: đầu tệp, cuối tệp, một khoảng dòng, dòng mới theo thời gian thực, và các tệp nén mà việc xoay vòng log để lại.</p>

<h3>Liên tưởng đời thường: cuốn sách 1.000 trang</h3>
<p>Muốn xem chương cuối của một cuốn sách dày, bạn không photo cả cuốn; bạn lật tới cuối. <code>head</code> là trang đầu, <code>tail</code> là trang cuối, <code>less</code> là cái kẹp sách di chuyển được, còn <code>tail -F</code> là phóng viên đứng cạnh máy in đọc từng trang mới vừa ra.</p>

<h3>Bước 1 — tệp to cỡ nào, bắt đầu và kết thúc bằng gì?</h3>
${lenh('s02/file-lon', 0)}
${lenh('s02/file-lon', 1)}
${lenh('s02/file-lon', 2)}
<p>Xem dung lượng trước (<code>ls -lh</code>), rồi dòng đầu và dòng cuối: chúng cho biết định dạng và khoảng thời gian tệp bao phủ — ở đây là ngày 20/11/2026 từ 00:00 tới gần nửa đêm. <code>cut -c1-90</code> chỉ cắt ngắn dòng cho dễ nhìn.</p>

<h3>Bước 2 — nhảy tới một khoảng dòng</h3>
${lenh('s02/file-lon', 3)}
<p><code>sed -n 'A,Bp'</code> in dòng A tới B và không gì khác. Kết hợp với <code>grep -n</code> (in số dòng, bài 2.2), đó là cách gửi cho đồng đội "20 dòng quanh dòng 2000".</p>

<h3>Bước 3 — less: trình xem trang dành cho log</h3>
<p><code>less web/access.log</code> mở ngay lập tức kể cả với tệp khổng lồ, vì nó chỉ đọc phần đang hiện trên màn hình. Các phím đáng nhớ:</p>
<table>
<thead><tr><th>Phím</th><th>Làm gì</th></tr></thead>
<tbody>
<tr><td><code>G</code> / <code>g</code></td><td>Nhảy tới cuối / về đầu</td></tr>
<tr><td><code>/mẫu</code> rồi <code>n</code> / <code>N</code></td><td>Tìm xuôi; kết quả kế tiếp / trước đó</td></tr>
<tr><td><code>?mẫu</code></td><td>Tìm ngược (hữu ích sau <code>G</code>: "lỗi cuối cùng")</td></tr>
<tr><td><code>&amp;mẫu</code></td><td>Chỉ hiện dòng khớp (một kiểu grep trong less); <code>&amp;</code> + Enter để hiện lại tất cả</td></tr>
<tr><td><code>F</code></td><td>Bám theo dòng mới như <code>tail -f</code>; <code>Ctrl+C</code> để thôi bám</td></tr>
<tr><td><code>-S</code> (tuỳ chọn)</td><td><code>less -S</code> không gập dòng dài; cuộn ngang bằng phím mũi tên</td></tr>
<tr><td><code>q</code></td><td>Thoát</td></tr>
</tbody></table>
<p><code>less +F tệp</code> mở ở chế độ bám; <code>less +G tệp</code> mở ở cuối tệp.</p>

<h3>Bước 4 — bám theo log đang chạy: tail -f khác tail -F</h3>
<p>Trong lúc bạn đang xem, việc xoay vòng log (Chương 8) có thể đổi tên <code>access.log</code> thành <code>access.log.1</code> và tạo một <code>access.log</code> mới trống. Hai chế độ bám phản ứng khác nhau. Bản demo dưới đây ghi một dòng, rồi đổi tên tệp và tạo tệp mới — đúng những gì logrotate làm:</p>
${lenh('s02/tail-xoay', 0)}
${lenh('s02/tail-xoay', 1)}
<p><code>tail -f</code> bám theo <em>tệp đang mở</em> (cùng inode, giờ tên là <code>a.log.1</code>): nó hiện dòng 2 rồi im lặng mãi, trong khi dòng mới đi vào tệp mới. <code>tail -F</code> bám theo <em>tên</em>: nó nhận ra tệp đã bị thay, báo ra, rồi đọc tiếp tệp mới. Xem log thì luôn dùng <code>-F</code>; <code>tail -n 100 -F</code> hiện 100 dòng cuối trước.</p>
<div class="pitfall co-tieu-de"><p><strong>"Log đứng im rồi — chắc dịch vụ bị treo."</strong> Trước khi khởi động lại bất cứ thứ gì lúc 2 giờ sáng, kiểm xem bạn có đang bám một tệp đã bị xoay vòng bằng <code>tail -f</code> không. <code>ls -l</code> sẽ cho thấy một tệp mới đang lớn dần ngay cạnh tệp bạn đang xem.</p></div>

<h3>Bước 5 — tệp đã xoay vòng và bị nén</h3>
${lenh('s02/file-lon', 4)}
${lenh('s02/file-lon', 5)}
${lenh('s02/file-lon', 6)}
<p><code>zcat</code> giải nén ra màn hình mà không tạo tệp; <code>zgrep</code> tìm bên trong; <code>zcat -f</code> cho tệp thường đi qua nguyên vẹn, nên một lệnh đọc được "hôm nay cộng hôm qua" qua cả <code>.log</code> lẫn <code>.gz</code>. Công cụ khác: <code>zless</code>, và <code>xzcat</code>/<code>zstdcat</code> cho định dạng nén khác.</p>

<h3>Bước 6 — trên Windows (PowerShell)</h3>
<table>
<thead><tr><th>Cần</th><th>PowerShell</th></tr></thead>
<tbody>
<tr><td>50 dòng cuối</td><td><code>Get-Content .\\access.log -Tail 50</code></td></tr>
<tr><td>Bám dòng mới (như <code>tail -F</code>)</td><td><code>Get-Content .\\access.log -Tail 20 -Wait</code></td></tr>
<tr><td>10 dòng đầu</td><td><code>Get-Content .\\access.log -TotalCount 10</code></td></tr>
<tr><td>Dung lượng</td><td><code>(Get-Item .\\access.log).Length / 1MB</code></td></tr>
</tbody></table>
<p><code>Get-Content</code> không có <code>-Tail</code> sẽ đọc cả tệp vào bộ nhớ thành các đối tượng — ổn với vài megabyte, chậm với gigabyte. Bài 2.5 chỉ cách nhanh hơn.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>less +G web/access.log</code>, tìm ngược bằng <code>?504</code>: mã 504 <em>cuối cùng</em> lúc mấy giờ? Rồi dùng <code>&amp;nikto</code> và đếm số dòng trên màn hình.</li>
<li>Mở hai terminal. Ở một cái: <code>tail -n 3 -F /tmp/thu.log</code>. Ở cái kia, thêm dòng bằng <code>echo dong-$RANDOM &gt;&gt; /tmp/thu.log</code>, rồi đổi tên bằng <code>mv /tmp/thu.log /tmp/thu.log.1</code> và thêm dòng tiếp. Làm lại với <code>tail -f</code>.</li>
<li>Ngày 19/11 (tệp nén) có bao nhiêu phản hồi 404?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn tìm ra mã 504 cuối (14:07:14), thấy <code>tail -F</code> sống sót qua lần đổi tên còn <code>tail -f</code> thì không, và trả lời được 9.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['pager (trình xem trang)', 'Chương trình hiện tệp từng màn hình một (less).'],
  ['follow mode (chế độ bám)', 'Tiếp tục in dòng mới khi chúng được ghi thêm (tail -f/-F, phím F của less).'],
  ['inode', 'Danh tính của tệp trên đĩa; đổi tên giữ inode, tạo lại thì ra inode mới.'],
  ['log rotation (xoay vòng log)', 'Đổi tên, nén log cũ và mở tệp mới.'],
  ['zcat / zgrep', 'Đọc / tìm trong tệp .gz mà không cần giải nén ra đĩa.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đừng mở log khổng lồ bằng trình soạn thảo; đọc từng phần bằng <code>head</code>, <code>tail</code>, <code>sed -n</code>, <code>less</code>.</li>
<li>Trong <code>less</code>: <code>G</code>, <code>/</code> và <code>?</code>, <code>n</code>, lọc <code>&amp;</code>, bám <code>F</code>, <code>q</code>.</li>
<li><code>tail -F</code> bám theo tên và sống sót qua xoay vòng log; <code>tail -f</code> lặng lẽ đứng im.</li>
<li><code>zcat</code>, <code>zgrep</code>, <code>zcat -f</code> đọc tệp <code>.gz</code> đã xoay vòng cùng với log hiện tại.</li>
<li>Trên Windows: <code>Get-Content -Tail N -Wait</code>.</li>
</ul>
${nguon('📘', 'man tail (GNU coreutils)', '-f = --follow=descriptor, -F = --follow=name --retry', 'https://man7.org/linux/man-pages/man1/tail.1.html')}
${nguon('📘', 'man less', 'Lệnh /, ?, n, &amp;, F, G và tuỳ chọn -S, +F', 'https://man7.org/linux/man-pages/man1/less.1.html')}
${nguon('📘', 'Microsoft Learn — Get-Content', '-Tail, -Wait, -TotalCount', 'https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/get-content')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-3-grep-regex', title: 'Linux &amp; Bash 3.3 — grep và regex', sub: 'Các công cụ xử lý chữ dạy kỹ' })}
</div>
`,
};
