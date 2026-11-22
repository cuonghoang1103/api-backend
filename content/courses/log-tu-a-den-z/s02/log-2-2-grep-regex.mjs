/**
 * 2.2 — grep và ripgrep cho log, kèm regex vừa đủ (soạn 22/11/2026).
 * Output: OUT['s02/grep'] — GNU grep 3.11 + ripgrep trên Ubuntu 24.04, gói log mẫu.
 * Không trùng: lnx-3-3-grep-regex, wf-11-5-regex (regex dạy sâu) — ở đây chỉ cờ và mẫu dùng cho log.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '2.2 — grep and ripgrep for logs, with just enough regex for IPs, timestamps and status codes|||2.2 — grep và ripgrep cho log, kèm regex vừa đủ để bắt IP, mốc giờ, mã trạng thái',
  slug: 'log-2-2-grep-regex',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cờ grep dùng hằng ngày với log: -c -i -v -o -E -F -n -A/-B/-C, -h/-H khi tìm nhiều tệp; năm mẫu regex dùng lại (IPv4, mốc giờ ISO 8601, mã 5xx đặt đúng chỗ, chuỗi trong ngoặc kép, che IP bằng sed); bẫy " 502 " trùng số byte, bẫy regex tham lam ".*", bẫy ký tự đặc biệt "${" phải dùng -F; ripgrep cho cả thư mục — tất cả chạy thật trên gói log mẫu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>grep and ripgrep for logs: the flags you use every day, and five patterns worth keeping</h2>
<p class="lead"><code>grep</code> is the first tool anyone reaches for, and the one most often used slightly wrong — a count that includes lines it should not, a pattern that swallows half the line. This lesson covers the flags that matter for logs, five regular expressions you will reuse all course, and the three traps that produce confidently wrong numbers.</p>

<h3>The everyday picture: a highlighter pen</h3>
<p>Reading a contract, you highlight every line that mentions "penalty". <code>grep</code> does exactly that for millions of lines in a second — but it highlights the <em>letters</em> you gave it, not the <em>meaning</em> you had in mind. "502" also appears inside "15020 bytes". Most grep mistakes come from that gap.</p>

<h3>Step 1 — counting, ignoring case, inverting</h3>
${lenh('s02/grep', 0)}
${lenh('s02/grep', 1)}
${lenh('s02/grep', 2)}
<p><code>-c</code> counts matching lines; <code>-i</code> ignores case (the scanner writes "Nikto", your pattern says "nikto"); <code>-v</code> inverts. Here 921 lines are not plain 200s — but that includes 304 "not modified" responses, which are perfectly healthy. Inverting is quick, and it is also where wrong conclusions start: decide what you are really counting.</p>
<div class="pitfall co-tieu-de"><p><strong>The " 502 " trap.</strong> In an access log the status code is followed by the response size, and a size can be 502 bytes too. <code>grep ' 502 '</code> happens to give the right answer in this pack, but the safe ways are to anchor on the surrounding quote — <code>grep -E '" 5[0-9]{2} '</code> (the status always follows the closing quote of the request) — or to use the column with <code>awk '$9 == 502'</code> (lesson 2.3).</p></div>

<h3>Step 2 — extended regex: one pattern for all 5xx</h3>
${lenh('s02/grep', 3)}
<p><code>-E</code> enables extended regular expressions, where <code>{2}</code> means "exactly two of the previous thing". <code>5[0-9]{2}</code> = 500 to 599. The quote and spaces around it place the match exactly in the status column.</p>

<h3>Step 3 — extract only the match: unique client IPs</h3>
${lenh('s02/grep', 4)}
<p><code>-o</code> prints only the matching part, one per line. The pattern reads: at the start of the line (<code>^</code>), 1–3 digits, then three times "a dot and 1–3 digits". The dot is escaped (<code>\\.</code>) because a bare <code>.</code> means "any character". Piped to <code>sort -u | wc -l</code>: 63 different addresses talked to this server.</p>

<h3>Step 4 — context around a match</h3>
${lenh('s02/grep', 5)}
<p><code>-n</code> adds line numbers; <code>-B 2</code> and <code>-A 2</code> add two lines before and after (<code>-C 2</code> does both). Lines that match are marked with <code>:</code>, context lines with <code>-</code>. Context is how you answer "what happened just before?" — here, the last failed guesses from a scanner seven hours before a legitimate key login by <code>deploy</code>, who then used <code>sudo</code>.</p>

<h3>Step 5 — several files at once</h3>
${lenh('s02/grep', 6)}
${lenh('s02/grep', 7)}
<p>With several files grep prefixes each line (or count) with the file name; <code>-h</code> hides the names, <code>-H</code> forces them even for one file. Use <code>-h</code> when you pipe lines onward, <code>-H</code> when you need to know where each line came from.</p>

<h3>Step 6 — five patterns to keep in your notebook</h3>
<table>
<thead><tr><th>Matches</th><th>Pattern (use with <code>grep -E</code> / <code>-oE</code>)</th></tr></thead>
<tbody>
<tr><td>IPv4 address (loose)</td><td><code>[0-9]{1,3}(\\.[0-9]{1,3}){3}</code></td></tr>
<tr><td>ISO 8601 time with offset</td><td><code>[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[+-][0-9]{2}:[0-9]{2}</code></td></tr>
<tr><td>HTTP 4xx/5xx in an access log</td><td><code>" [45][0-9]{2} </code></td></tr>
<tr><td>A quoted string, without overshooting</td><td><code>"[^"]*"</code></td></tr>
<tr><td>An e-mail address (to find and then mask)</td><td><code>[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}</code></td></tr>
</tbody></table>
${lenh('s02/grep', 8)}
<p>"Loose" matters: the IPv4 pattern also accepts <code>999.1.1.1</code>. For logs that is fine — you are finding, not validating.</p>

<h3>Step 7 — two traps: greedy matches and special characters</h3>
${lenh('s02/grep', 10)}
${lenh('s02/grep', 11)}
<p><code>.*</code> is <em>greedy</em>: it runs from the first quote to the <strong>last</strong> quote on the line, swallowing three fields. <code>[^"]*</code> ("any characters except a quote") stops at the next quote and gives each quoted field separately.</p>
${lenh('s02/grep', 9)}
<p>To search for text full of regex symbols — <code>$</code>, <code>{</code>, <code>.</code>, <code>(</code> — use <code>-F</code> (fixed string): no character is special. This line is a <strong>Log4Shell probe</strong>: someone sent a JNDI lookup string as their User-Agent, hoping a vulnerable Java logger would execute it (Chapter 10 explains). Here the server answered 200 with the normal page — a probe, not proof of compromise.</p>

<h3>Step 8 — masking before you share, and ripgrep</h3>
${lenh('s02/grep', 12)}
<p><code>sed -E 's/…/…/'</code> replaces the last octet with <code>x</code>; <code>\\1</code> puts back what the first parentheses captured. This is the one-liner promised in lesson 0.2. For whole directories, <a href="https://github.com/BurntSushi/ripgrep">ripgrep</a> (<code>rg</code>) is faster, recursive by default and respects <code>.gitignore</code>; it accepts the same patterns (<code>-z</code> also searches inside compressed files):</p>
${lenh('s02/grep', 13)}

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok"><ol>
<li>Count 4xx and 5xx responses with one <code>grep -cE</code> using the status-code pattern from Step 6.</li>
<li>Find every line in <code>linux/auth.log</code> where a login attempt used a user name that does not exist on the server, and count the distinct names (<code>-oE 'invalid user [a-z]+'</code> then <code>sort -u</code>).</li>
<li>Print <code>web/access.log</code> lines from 03:15 with <code>-n</code> and show the scanner's first request with one line of context after it.</li>
<li>Mask all IPs in <code>incident/nginx-error.log</code> and save to <code>/tmp/chia-se.log</code> (each line has two IPs — remember the <code>g</code> flag); prove with <code>grep -cE '([0-9]{1,3}\\.){3}[0-9]{1,3}' /tmp/chia-se.log</code> that no full IP remains.</li>
</ol>
<p><strong>Done when:</strong> step 1 gives 628, step 2 lists 6 invalid user names, the scanner's first request is <code>/.env</code>, and step 4 prints 0.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['regular expression (regex)', 'A pattern language for matching text.'],
  ['extended regex (-E)', 'The regex dialect where + ? {} | () work without backslashes.'],
  ['fixed string (-F)', 'Search for the literal text, no special characters.'],
  ['greedy', 'A pattern like .* that matches as much as possible.'],
  ['context lines', 'Lines printed before/after a match (-B, -A, -C).'],
  ['octet', 'One of the four numbers in an IPv4 address.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Daily flags: <code>-c -i -v -o -E -F -n -A/-B/-C -h/-H</code>.</li>
<li>Anchor patterns to the right column (<code>'" 5[0-9]{2} '</code>) or use <code>awk</code> columns — loose patterns count the wrong lines.</li>
<li>Prefer <code>[^"]*</code> to <code>.*</code>; use <code>-F</code> for text full of symbols like <code>&#36;{jndi:</code>.</li>
<li>Keep five patterns: IPv4, ISO time, 4xx/5xx, quoted string, e-mail.</li>
<li>Mask before sharing with <code>sed -E</code>; use <code>rg</code> for whole directories.</li>
</ul>
${nguon('📘', 'man grep (GNU grep)', 'Options, regex syntax (basic vs extended), exit status', 'https://man7.org/linux/man-pages/man1/grep.1.html')}
${nguon('📗', 'ripgrep — README and user guide', 'Recursive search, -z for compressed files, differences from grep', 'https://github.com/BurntSushi/ripgrep')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-3-grep-regex', title: 'Linux &amp; Bash 3.3 — grep and regex in depth', sub: 'Character classes, anchors, back-references, BRE vs ERE', cta: 'Open lesson' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-5-regex', title: 'Web Foundations 11.5 — regular expressions', sub: 'The same ideas in JavaScript', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>grep và ripgrep cho log: các cờ dùng hằng ngày, và năm mẫu đáng giữ lại</h2>
<p class="lead"><code>grep</code> là công cụ ai cũng với tới đầu tiên, và cũng là thứ hay bị dùng hơi sai — một con số đếm lẫn cả dòng không đáng đếm, một mẫu nuốt mất nửa dòng. Bài này nói về các cờ quan trọng với log, năm biểu thức chính quy bạn sẽ dùng lại suốt khoá, và ba cái bẫy sinh ra những con số sai mà trông rất chắc chắn.</p>

<h3>Liên tưởng đời thường: cây bút dạ quang</h3>
<p>Đọc một hợp đồng, bạn tô sáng mọi dòng có chữ "phạt". <code>grep</code> làm đúng việc đó với hàng triệu dòng trong một giây — nhưng nó tô những <em>ký tự</em> bạn đưa, không phải <em>ý nghĩa</em> trong đầu bạn. "502" cũng nằm trong "15020 byte". Phần lớn lỗi khi dùng grep đến từ khoảng cách đó.</p>

<h3>Bước 1 — đếm, bỏ qua hoa thường, đảo ngược</h3>
${lenh('s02/grep', 0)}
${lenh('s02/grep', 1)}
${lenh('s02/grep', 2)}
<p><code>-c</code> đếm số dòng khớp; <code>-i</code> bỏ qua hoa thường (máy quét viết "Nikto", mẫu của bạn viết "nikto"); <code>-v</code> đảo ngược. Ở đây 921 dòng không phải 200 — nhưng trong đó có cả phản hồi 304 "not modified", hoàn toàn khoẻ mạnh. Đảo ngược thì nhanh, và cũng là chỗ kết luận sai bắt đầu: hãy xác định rõ mình thật sự đang đếm cái gì.</p>
<div class="pitfall co-tieu-de"><p><strong>Cái bẫy " 502 ".</strong> Trong access log, mã trạng thái đứng ngay trước kích thước phản hồi, mà kích thước cũng có thể là 502 byte. <code>grep ' 502 '</code> tình cờ cho đúng với gói mẫu này, nhưng cách an toàn là neo vào dấu nháy xung quanh — <code>grep -E '" 5[0-9]{2} '</code> (mã trạng thái luôn đứng sau dấu nháy đóng của request) — hoặc dùng cột với <code>awk '$9 == 502'</code> (bài 2.3).</p></div>

<h3>Bước 2 — regex mở rộng: một mẫu cho mọi mã 5xx</h3>
${lenh('s02/grep', 3)}
<p><code>-E</code> bật biểu thức chính quy mở rộng, trong đó <code>{2}</code> nghĩa là "đúng hai lần thứ đứng trước". <code>5[0-9]{2}</code> = 500 tới 599. Dấu nháy và dấu cách xung quanh đặt chỗ khớp đúng vào cột mã trạng thái.</p>

<h3>Bước 3 — chỉ lấy phần khớp: các IP máy khách khác nhau</h3>
${lenh('s02/grep', 4)}
<p><code>-o</code> chỉ in phần khớp, mỗi chỗ một dòng. Đọc mẫu: ở đầu dòng (<code>^</code>), 1–3 chữ số, rồi ba lần "một dấu chấm và 1–3 chữ số". Dấu chấm được thoát (<code>\\.</code>) vì <code>.</code> trần nghĩa là "ký tự bất kỳ". Nối qua <code>sort -u | wc -l</code>: 63 địa chỉ khác nhau đã nói chuyện với server này.</p>

<h3>Bước 4 — ngữ cảnh quanh một chỗ khớp</h3>
${lenh('s02/grep', 5)}
<p><code>-n</code> thêm số dòng; <code>-B 2</code> và <code>-A 2</code> thêm hai dòng trước và sau (<code>-C 2</code> làm cả hai). Dòng khớp có dấu <code>:</code>, dòng ngữ cảnh có dấu <code>-</code>. Ngữ cảnh là cách trả lời "ngay trước đó chuyện gì xảy ra?" — ở đây là mấy lần đoán sai cuối cùng của một máy quét, bảy tiếng trước một lần đăng nhập hợp lệ bằng khoá của <code>deploy</code>, người sau đó dùng <code>sudo</code>.</p>

<h3>Bước 5 — nhiều tệp một lúc</h3>
${lenh('s02/grep', 6)}
${lenh('s02/grep', 7)}
<p>Với nhiều tệp, grep thêm tên tệp vào đầu mỗi dòng (hay mỗi số đếm); <code>-h</code> giấu tên đi, <code>-H</code> bắt in tên kể cả khi chỉ có một tệp. Dùng <code>-h</code> khi nối dòng sang lệnh khác, <code>-H</code> khi cần biết dòng nào từ đâu ra.</p>

<h3>Bước 6 — năm mẫu nên chép vào sổ</h3>
<table>
<thead><tr><th>Bắt</th><th>Mẫu (dùng với <code>grep -E</code> / <code>-oE</code>)</th></tr></thead>
<tbody>
<tr><td>Địa chỉ IPv4 (lỏng)</td><td><code>[0-9]{1,3}(\\.[0-9]{1,3}){3}</code></td></tr>
<tr><td>Thời điểm ISO 8601 có độ lệch</td><td><code>[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[+-][0-9]{2}:[0-9]{2}</code></td></tr>
<tr><td>HTTP 4xx/5xx trong access log</td><td><code>" [45][0-9]{2} </code></td></tr>
<tr><td>Một chuỗi trong ngoặc kép, không lấn sang</td><td><code>"[^"]*"</code></td></tr>
<tr><td>Một địa chỉ email (để tìm rồi che)</td><td><code>[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}</code></td></tr>
</tbody></table>
${lenh('s02/grep', 8)}
<p>Chữ "lỏng" quan trọng: mẫu IPv4 cũng chấp nhận <code>999.1.1.1</code>. Với log thì không sao — bạn đang tìm, không phải kiểm tra hợp lệ.</p>

<h3>Bước 7 — hai cái bẫy: khớp tham lam và ký tự đặc biệt</h3>
${lenh('s02/grep', 10)}
${lenh('s02/grep', 11)}
<p><code>.*</code> là <em>tham lam (greedy)</em>: nó chạy từ dấu nháy đầu tiên tới dấu nháy <strong>cuối cùng</strong> của dòng, nuốt ba trường. <code>[^"]*</code> ("mọi ký tự trừ dấu nháy") dừng ở dấu nháy kế tiếp và cho từng trường trong ngoặc riêng ra.</p>
${lenh('s02/grep', 9)}
<p>Muốn tìm chữ đầy ký hiệu regex — <code>$</code>, <code>{</code>, <code>.</code>, <code>(</code> — hãy dùng <code>-F</code> (chuỗi cố định): không ký tự nào đặc biệt cả. Dòng này là một <strong>lần dò Log4Shell</strong>: ai đó gửi một chuỗi tra cứu JNDI làm User-Agent, mong một bộ ghi log Java có lỗ hổng sẽ thực thi nó (Chương 10 giải thích). Ở đây server trả 200 với trang bình thường — là một lần dò, chưa phải bằng chứng bị xâm nhập.</p>

<h3>Bước 8 — che trước khi chia sẻ, và ripgrep</h3>
${lenh('s02/grep', 12)}
<p><code>sed -E 's/…/…/'</code> thay số cuối bằng <code>x</code>; <code>\\1</code> đặt lại phần mà cặp ngoặc đầu tiên đã bắt được. Đây là lệnh một dòng đã hứa ở bài 0.2. Với cả thư mục, <a href="https://github.com/BurntSushi/ripgrep">ripgrep</a> (<code>rg</code>) nhanh hơn, mặc định tìm đệ quy và tôn trọng <code>.gitignore</code>; nó nhận cùng kiểu mẫu (<code>-z</code> tìm cả trong tệp nén):</p>
${lenh('s02/grep', 13)}

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Đếm phản hồi 4xx và 5xx bằng một lệnh <code>grep -cE</code> với mẫu mã trạng thái ở Bước 6.</li>
<li>Tìm mọi dòng trong <code>linux/auth.log</code> mà lần thử đăng nhập dùng tên không tồn tại trên server, rồi đếm số tên khác nhau (<code>-oE 'invalid user [a-z]+'</code> rồi <code>sort -u</code>).</li>
<li>In các dòng <code>web/access.log</code> lúc 03:15 kèm <code>-n</code> và cho thấy request đầu tiên của máy quét cùng một dòng ngữ cảnh sau nó.</li>
<li>Che mọi IP trong <code>incident/nginx-error.log</code> và lưu ra <code>/tmp/chia-se.log</code> (mỗi dòng có hai IP — nhớ cờ <code>g</code>); chứng minh bằng <code>grep -cE '([0-9]{1,3}\\.){3}[0-9]{1,3}' /tmp/chia-se.log</code> rằng không còn IP đầy đủ nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bước 1 ra 628, bước 2 liệt kê 6 tên không tồn tại, request đầu tiên của máy quét là <code>/.env</code>, và bước 4 in ra 0.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['regular expression (biểu thức chính quy, regex)', 'Ngôn ngữ mẫu để khớp chữ.'],
  ['extended regex (-E, regex mở rộng)', 'Kiểu regex mà + ? {} | () dùng được không cần gạch chéo ngược.'],
  ['fixed string (-F, chuỗi cố định)', 'Tìm đúng nguyên văn, không ký tự đặc biệt nào.'],
  ['greedy (tham lam)', 'Mẫu như .* khớp được càng nhiều càng tốt.'],
  ['context lines (dòng ngữ cảnh)', 'Các dòng in trước/sau chỗ khớp (-B, -A, -C).'],
  ['octet', 'Một trong bốn con số của địa chỉ IPv4.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cờ hằng ngày: <code>-c -i -v -o -E -F -n -A/-B/-C -h/-H</code>.</li>
<li>Neo mẫu vào đúng cột (<code>'" 5[0-9]{2} '</code>) hoặc dùng cột của <code>awk</code> — mẫu lỏng sẽ đếm nhầm dòng.</li>
<li>Ưu tiên <code>[^"]*</code> hơn <code>.*</code>; dùng <code>-F</code> cho chữ đầy ký hiệu như <code>&#36;{jndi:</code>.</li>
<li>Giữ năm mẫu: IPv4, giờ ISO, 4xx/5xx, chuỗi trong ngoặc kép, email.</li>
<li>Che trước khi chia sẻ bằng <code>sed -E</code>; dùng <code>rg</code> cho cả thư mục.</li>
</ul>
${nguon('📘', 'man grep (GNU grep)', 'Tuỳ chọn, cú pháp regex (cơ bản và mở rộng), mã thoát', 'https://man7.org/linux/man-pages/man1/grep.1.html')}
${nguon('📗', 'ripgrep — README và hướng dẫn', 'Tìm đệ quy, -z cho tệp nén, khác biệt với grep', 'https://github.com/BurntSushi/ripgrep')}
${lienKet({ khoa: 'linux-bash', bai: 'lnx-3-3-grep-regex', title: 'Linux &amp; Bash 3.3 — grep và regex chuyên sâu', sub: 'Lớp ký tự, neo, tham chiếu ngược, BRE và ERE' })}
${lienKet({ khoa: 'web-foundations', bai: 'wf-11-5-regex', title: 'Web Foundations 11.5 — biểu thức chính quy', sub: 'Cùng ý tưởng trong JavaScript' })}
</div>
`,
};
