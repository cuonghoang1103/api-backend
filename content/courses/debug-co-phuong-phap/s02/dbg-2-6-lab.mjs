/**
 * 2.6 — Lab Chương 2: mười stack trace thật, mười dòng gốc (soạn 22/11/2026).
 * Mã + output THẬT trong _out-2-6.mjs (4 Java · 3 Node · 3 Python). Đáp án ở cuối bài, khối riêng.
 * Phát hiện khi chạy: int(" 4") của Python tự bỏ khoảng trắng nên "DH02, 4" KHÔNG lỗi — đưa vào đáp án câu 9.
 */
import { P } from './_out-2-6.mjs';

const LANG = { 1: 'java', 2: 'java', 3: 'java', 4: 'java', 5: 'js', 6: 'js', 7: 'js', 8: 'python', 9: 'python', 10: 'python' };
const TRACE = (n) => `<h3>Trace ${n}</h3>
<pre><code class="language-${LANG[n]}">${P['S' + n]}</code></pre>
<div class="out">${P['O' + n]}</div>`;
const TAT_CA = Array.from({ length: 10 }, (_, i) => TRACE(i + 1)).join('\n');

const DAP_AN = (en) => en ? `<table>
<thead><tr><th>#</th><th>Root line</th><th>Cause (2 sentences)</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>T1.java:2</code></td><td>The last index of an array of length 3 is 2, but the code reads <code>diem[diem.length]</code> = index 3. Use <code>diem.length - 1</code>.</td></tr>
<tr><td>2</td><td><code>T2.java:4</code> (in the Caused by)</td><td>The root is <code>NumberFormatException</code> for "hai mươi" — a number written in words; <code>" 21 "</code> worked thanks to <code>trim()</code>. Validate input where the profile is entered; the wrapper message is good, keep it.</td></tr>
<tr><td>3</td><td><code>T3.java:6</code></td><td>The map holds the String "3" (the API sent a string), and a cast cannot convert types. Parse with <code>Integer.parseInt</code> or fix the API contract.</td></tr>
<tr><td>4</td><td><code>T4.java:5</code></td><td>Removing from an <code>ArrayList</code> while a for-each loop iterates over it breaks the iterator. Use <code>ds.removeIf(String::isEmpty)</code>.</td></tr>
<tr><td>5</td><td><code>t5.js:2:30</code> (caused by the data at line 1)</td><td><code>onClick</code> is the string <code>'luu()'</code> read from JSON, not a function. JSON cannot carry functions — map a name to a function in code.</td></tr>
<tr><td>6</td><td><code>t6.js:1:50</code>, called from line 3</td><td><code>new Date('30/11/2026')</code> is an Invalid Date (not ISO), and <code>toISOString()</code> throws <code>RangeError</code> on it. Parse day/month/year explicitly or require ISO input.</td></tr>
<tr><td>7</td><td><code>t7.js:3:18</code> — the data written at line 2</td><td>JSON requires double quotes; <code>{ 'cong': … }</code> fails at position 2. Note the top line says <code>&lt;anonymous_script&gt;</code>: the excerpt is the JSON text, not your file — your line is the first frame of yours.</td></tr>
<tr><td>8</td><td><code>t8.py</code> line 3, called from line 5</td><td><code>top3</code> assumes at least three scores; with two, <code>ds[2]</code> does not exist. Return <code>ds[:3]</code> or define what "top 3" means for short lists.</td></tr>
<tr><td>9</td><td><code>t9.py</code> line 3 (first block)</td><td><code>int('ba')</code> fails — "ba" is "three" written in words; the <code>raise … from</code> adds the CSV line. "DH02, 4" did <em>not</em> fail: Python's <code>int()</code> ignores surrounding spaces (checked by running).</td></tr>
<tr><td>10</td><td><code>t10.py</code> line 6 — cause in <code>tim_nguoi</code></td><td><code>tim_nguoi</code> returns <code>None</code> when nobody matches (the loop ends without <code>return</code>), and <code>None["lop"]</code> fails. Handle "not found" explicitly — same lesson as Java's "return value of … is null".</td></tr>
</tbody>
</table>` : `<table>
<thead><tr><th>#</th><th>Dòng gốc</th><th>Nguyên nhân (2 câu)</th></tr></thead>
<tbody>
<tr><td>1</td><td><code>T1.java:2</code></td><td>Mảng dài 3 thì chỉ số cuối là 2, nhưng code đọc <code>diem[diem.length]</code> = chỉ số 3. Dùng <code>diem.length - 1</code>.</td></tr>
<tr><td>2</td><td><code>T2.java:4</code> (trong Caused by)</td><td>Gốc là <code>NumberFormatException</code> với "hai mươi" — số viết bằng chữ; <code>" 21 "</code> chạy được nhờ <code>trim()</code>. Kiểm dữ liệu ngay lúc nhập hồ sơ; thông điệp bọc ngoài tốt, giữ lại.</td></tr>
<tr><td>3</td><td><code>T3.java:6</code></td><td>Map đang giữ String "3" (API gửi chuỗi), mà ép kiểu không đổi được kiểu dữ liệu. Dùng <code>Integer.parseInt</code> hoặc sửa hợp đồng API.</td></tr>
<tr><td>4</td><td><code>T4.java:5</code></td><td>Xoá phần tử khỏi <code>ArrayList</code> trong lúc vòng for-each đang duyệt làm hỏng iterator. Dùng <code>ds.removeIf(String::isEmpty)</code>.</td></tr>
<tr><td>5</td><td><code>t5.js:2:30</code> (do dữ liệu ở dòng 1)</td><td><code>onClick</code> là chuỗi <code>'luu()'</code> đọc từ JSON, không phải hàm. JSON không chở được hàm — ánh xạ tên sang hàm ở trong code.</td></tr>
<tr><td>6</td><td><code>t6.js:1:50</code>, được gọi từ dòng 3</td><td><code>new Date('30/11/2026')</code> là Invalid Date (không phải dạng ISO), và <code>toISOString()</code> ném <code>RangeError</code> với nó. Tách ngày/tháng/năm tường minh hoặc bắt buộc đầu vào ISO.</td></tr>
<tr><td>7</td><td><code>t7.js:3:18</code> — dữ liệu ghi ở dòng 2</td><td>JSON bắt buộc nháy kép; <code>{ 'cong': … }</code> hỏng ở vị trí 2. Để ý dòng đầu ghi <code>&lt;anonymous_script&gt;</code>: đoạn trích là chữ JSON, không phải tệp của bạn — dòng của bạn là frame đầu tiên của bạn.</td></tr>
<tr><td>8</td><td><code>t8.py</code> dòng 3, gọi từ dòng 5</td><td><code>top3</code> giả định có ít nhất ba điểm; có hai thì <code>ds[2]</code> không tồn tại. Trả <code>ds[:3]</code> hoặc quy định "top 3" nghĩa là gì với danh sách ngắn.</td></tr>
<tr><td>9</td><td><code>t9.py</code> dòng 3 (khối đầu)</td><td><code>int('ba')</code> hỏng — "ba" là số viết bằng chữ; <code>raise … from</code> bổ sung dòng CSV. "DH02, 4" <em>không</em> hỏng: <code>int()</code> của Python tự bỏ khoảng trắng hai đầu (đã kiểm bằng chạy thật).</td></tr>
<tr><td>10</td><td><code>t10.py</code> dòng 6 — nguyên nhân trong <code>tim_nguoi</code></td><td><code>tim_nguoi</code> trả <code>None</code> khi không ai khớp (vòng lặp hết mà không <code>return</code>), và <code>None["lop"]</code> hỏng. Xử lý "không tìm thấy" tường minh — cùng bài học với "return value of … is null" của Java.</td></tr>
</tbody>
</table>`;

export default {
  title: '2.6 — Lab: Ten real stack traces, ten root lines|||2.6 — Lab: Mười stack trace thật, mười dòng gốc',
  slug: 'dbg-2-6-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mười trace chạy thật trộn Java (chỉ số mảng, Caused by, ép kiểu, sửa list khi duyệt), Node (không phải hàm, Invalid Date, JSON nháy đơn) và Python (IndexError, raise … from, NoneType); mỗi trace chỉ đúng dòng gốc và giải thích nguyên nhân trong 2 câu; đáp án đối chiếu ở cuối.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lab</span>
<h2>Ten traces, ten root lines — against the clock</h2>
<p class="lead">Every trace below was produced by actually running the program shown above it (OpenJDK 21, Node 26, Python 3.15). For each one, find the <strong>root line</strong> — the line you would change — and explain the cause in at most two sentences. Target: under two minutes per trace. Answers are at the very end; do not scroll there first.</p>
<h3>How to work</h3>
<ul>
<li>Use the reading routine: Java/JS from the top, Python from the bottom; in chains, find the root (Java: last <code>Caused by</code>; Python: first block).</li>
<li>Skip library and runtime frames (<code>java.base/…</code>, <code>node:internal/…</code>, the Python install).</li>
<li>Distinguish "where it exploded" from "where it was caused" (lesson 2.1) — several traces below explode in one line and are caused in another.</li>
<li>Write your answers in <code>~/dbg-lab/nhat-ky/ch2-lab.md</code> before you check.</li>
</ul>
${TAT_CA}
<h3>🧪 Done when</h3>
<div class="callout ok">
<p><strong>Done when:</strong> for all ten traces you wrote the root line and a two-sentence cause, at least 8/10 match the answer table (same line, same cause), and for the ones you missed you wrote which reading rule you broke. Bonus: fix all ten programs and run them again without a trace.</p>
</div>
<h3>Answers (check only after writing yours)</h3>
${DAP_AN(true)}
<h3>📌 Summary</h3>
<ul>
<li>Three of ten traces exploded in one place and were caused in another (5, 7, 10) — always ask "what value arrived here, and from where?".</li>
<li>Chains: Java's root is the last Caused by, Python's is the first block.</li>
<li>Data from outside (JSON, CSV, forms, APIs) caused most of these bugs — validate at the boundary.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Lab</span>
<h2>Mười trace, mười dòng gốc — bấm giờ</h2>
<p class="lead">Mỗi trace dưới đây được tạo ra bằng cách chạy thật chương trình in ngay phía trên nó (OpenJDK 21, Node 26, Python 3.15). Với từng trace, tìm <strong>dòng gốc</strong> — dòng bạn sẽ sửa — và giải thích nguyên nhân trong tối đa hai câu. Mục tiêu: dưới hai phút mỗi trace. Đáp án ở cuối cùng; đừng kéo xuống đó trước.</p>
<h3>Cách làm</h3>
<ul>
<li>Dùng thứ tự đọc: Java/JS đọc từ trên, Python đọc từ dưới; với chuỗi lỗi, tìm gốc (Java: <code>Caused by</code> cuối; Python: khối đầu tiên).</li>
<li>Bỏ qua frame thư viện và môi trường chạy (<code>java.base/…</code>, <code>node:internal/…</code>, thư mục cài Python).</li>
<li>Phân biệt "nổ ở đâu" và "sinh ra ở đâu" (bài 2.1) — vài trace dưới đây nổ ở một dòng mà nguyên nhân ở dòng khác.</li>
<li>Viết câu trả lời vào <code>~/dbg-lab/nhat-ky/ch2-lab.md</code> trước khi đối chiếu.</li>
</ul>
${TAT_CA}
<h3>🧪 Đạt khi</h3>
<div class="callout ok">
<p><strong>Đạt khi:</strong> cả mười trace bạn đều đã viết dòng gốc và nguyên nhân hai câu, ít nhất 8/10 khớp bảng đáp án (cùng dòng, cùng nguyên nhân), và với những câu sai bạn ghi rõ mình đã phá luật đọc nào. Thêm điểm: sửa cả mười chương trình rồi chạy lại không còn trace.</p>
</div>
<h3>Đáp án (chỉ xem sau khi đã viết câu trả lời của mình)</h3>
${DAP_AN(false)}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Ba trong mười trace nổ ở một chỗ và sinh ra ở chỗ khác (5, 7, 10) — luôn hỏi "giá trị nào tới đây, và từ đâu tới?".</li>
<li>Chuỗi lỗi: gốc của Java là Caused by cuối, của Python là khối đầu.</li>
<li>Dữ liệu từ bên ngoài (JSON, CSV, form, API) gây ra phần lớn các lỗi này — kiểm dữ liệu ngay ở ranh giới.</li>
</ul>
</div>
`,
};
