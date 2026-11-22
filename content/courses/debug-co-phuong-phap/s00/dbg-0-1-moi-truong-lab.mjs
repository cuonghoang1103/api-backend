/**
 * 0.1 — Dựng môi trường lab (soạn 22/11/2026). Output chạy THẬT trong /tmp/dbg-lab (macOS 27.2 arm64 · Node v26.8.1 ·
 * Python 3.15.2 · OpenJDK 21.0.9 · git 2.51.1 · Docker 29.8.0 / Compose v5.5.1).
 * Tiêu đề bài đổi cho đúng thực tế: ứng dụng mẫu Docker Compose (Spring + Node + React + PostgreSQL) CHƯA dựng — sẽ soạn cùng
 * Chương 3 (dbg-3-*), bài này dựng thư mục dbg-lab + kiểm công cụ + ba lỗi mẫu dùng cho Chương 1–2. Slug giữ nguyên.
 */
import { nguon } from '../_chung.mjs';

const MA_KIEM = `<pre><code class="language-bash">#!/usr/bin/env bash
<span class="tok-comment"># Check every tool this course needs. Missing ones print THIẾU (missing); the script never stops halfway.</span>
for cmd in node npm python3 java javac git curl docker; do
  if command -v "$cmd" &gt;/dev/null 2&gt;&amp;1; then
    printf '%-8s OK   %s\\n' "$cmd" "&#36;("$cmd" --version 2&gt;&amp;1 | head -1)"
  else
    printf '%-8s THIẾU\\n' "$cmd"
  fi
done</code></pre>`;

const OUT_KIEM = `<div class="out">$ chmod +x kiem-moi-truong.sh &amp;&amp; ./kiem-moi-truong.sh
node     OK   v26.8.1
npm      OK   11.19.0
python3  OK   Python 3.15.2
java     OK   openjdk 21.0.9 2025-10-21
javac    OK   javac 21.0.9
git      OK   git version 2.51.1
curl     OK   curl 8.7.1 (x86_64-apple-darwin26.0) libcurl/8.7.1 (SecureTransport) LibreSSL/3.3.6 zlib/1.2.12 nghttp2/1.69.0
docker   OK   Docker version 29.8.0, build 88096ef</div>`;

const MA_PY = `<pre><code class="language-python">users = [
    {"name": "An", "email": "an@example.com"},
    {"name": "Binh", "email": "binh@example.com"},
    {"name": "Chi"},                      # old data, no email yet
]

def gui_thong_bao(u):
    return "Gửi tới " + u["email"]

for u in users:
    print(gui_thong_bao(u))</code></pre>`;

const OUT_PY = `<div class="out">$ python3 nguoi_dung.py
Gửi tới an@example.com
Gửi tới binh@example.com
Traceback (most recent call last):
  File "/private/tmp/dbg-lab/muc0/nguoi_dung.py", line 11, in &lt;module&gt;
    print(gui_thong_bao(u))
          ~~~~~~~~~~~~~^^^
  File "/private/tmp/dbg-lab/muc0/nguoi_dung.py", line 8, in gui_thong_bao
    return "Gửi tới " + u["email"]
                        ~^^^^^^^^^
KeyError: 'email'</div>`;

const MA_JAVA = `<pre><code class="language-java">public class DonHang {
    static class KhachHang { String ten; String diaChi; KhachHang(String t) { ten = t; } }
    static class Don { KhachHang khach; Don(KhachHang k) { khach = k; } }

    public static void main(String[] args) {
        Don don = new Don(new KhachHang("Chi"));   // customer has not entered an address
        System.out.println("Giao tới: " + don.khach.diaChi.toUpperCase());
    }
}</code></pre>`;

const OUT_JAVA = `<div class="out">$ java DonHang.java
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "&lt;local1&gt;.khach.diaChi" is null
	at DonHang.main(DonHang.java:7)
$ javac -g -d out DonHang.java &amp;&amp; java -cp out DonHang
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "don.khach.diaChi" is null
	at DonHang.main(DonHang.java:7)</div>`;

const CAY = `<div class="out">~/dbg-lab/
├── kiem-moi-truong.sh     tool check (this lesson)
├── nhat-ky/               one Markdown file per bug: 2026-11-22-tong-tien.md …
├── muc0/                  tong-tien.js, diem-tb.js, nguoi_dung.py, DonHang.java
├── ch1/                   Chapter 1 programs
└── ch2/                   Chapter 2 programs</div>`;

const NGUON = [
  nguon('🟢', 'Node.js — Download', 'Cài bản LTS (khoá chạy thử trên v26.8.1; v22 LTS trở lên đều được).', 'https://nodejs.org/en/download'),
  nguon('☕', 'Eclipse Temurin (Adoptium) — OpenJDK 21', 'JDK miễn phí cho Mac/Windows/Linux.', 'https://adoptium.net/'),
  nguon('🐍', 'Python — Downloads', 'Python 3.11 trở lên là đủ để đọc traceback trong khoá.', 'https://www.python.org/downloads/'),
  nguon('🐳', 'Docker Desktop', 'Cần từ Chương 3 cho ứng dụng mẫu nhiều dịch vụ.', 'https://docs.docker.com/desktop/'),
].join('\n');

export default {
  title: '0.1 — Lab setup: the dbg-lab workspace, a tool check and three bugs to observe|||0.1 — Dựng môi trường lab: thư mục dbg-lab, kiểm công cụ và ba lỗi mẫu để quan sát',
  slug: 'dbg-0-1-moi-truong-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dựng thư mục ~/dbg-lab, chạy script kiểm đủ Node/Python/Java/git/curl/Docker, khác biệt Mac và Windows/WSL2, rồi chạy ba lỗi mẫu (JS, Python, Java) và chỉ ghi triệu chứng — chưa sửa. Ứng dụng mẫu Docker Compose dùng từ Chương 3.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Set up the lab once, then every chapter starts in five seconds</h2>
<p class="lead">Every lesson in this course has something you run. This lesson builds the workspace those programs live in, checks that every tool is installed with one script, and ends with the most underrated debugging skill of all: running three broken programs and <strong>describing the symptom precisely without fixing anything</strong>.</p>

<h3>What you install, and why each tool is here</h3>
<table>
<thead><tr><th>Tool</th><th>Used for</th><th>From chapter</th></tr></thead>
<tbody>
<tr><td>Node.js (LTS, v22+)</td><td>JavaScript/TypeScript bugs, the VS Code debugger</td><td>0</td></tr>
<tr><td>Python 3.11+</td><td>Reading tracebacks (only that)</td><td>0</td></tr>
<tr><td>JDK 21</td><td>Java stack traces, IntelliJ debugger, Spring Boot</td><td>0</td></tr>
<tr><td>Git, curl</td><td>Bisecting history; replaying HTTP requests</td><td>1</td></tr>
<tr><td>VS Code, IntelliJ IDEA Community, Chrome</td><td>Debuggers and DevTools</td><td>3</td></tr>
<tr><td>Docker Desktop (+ Compose)</td><td>The multi-service sample app (Spring + Node + React + PostgreSQL)</td><td>3</td></tr>
<tr><td>Postman or Bruno, psql/DBeaver</td><td>API and database chapters</td><td>6–7</td></tr>
</tbody>
</table>
<p>About the sample app: the bookable-lab-room app in Docker Compose, where each planted bug is switched on with a flag, is built together with Chapter 3 — the first chapter that needs a debugger attached to several services. Chapters 1 and 2 deliberately use tiny single-file programs, because the method is easier to see without a framework in the way.</p>

<h3>Step 1 — the workspace</h3>
${CAY}
<p>Create it with <code>mkdir -p ~/dbg-lab/{nhat-ky,muc0,ch1,ch2}</code>. The <code>nhat-ky</code> (logbook) folder holds your debugging logs; name each file by date and bug so you can find it for an interview story later.</p>

<h3>Step 2 — check every tool with one script</h3>
<p>Instead of running eight version commands by hand and forgetting one, save this as <code>~/dbg-lab/kiem-moi-truong.sh</code>:</p>
${MA_KIEM}
${OUT_KIEM}
<p>Reading it: every line should say OK. Your version numbers will differ — anything at or above the table's minimum is fine. Note <code>command -v</code> checks that a program exists <em>before</em> calling it, so a missing tool prints one clear line instead of a confusing "command not found" in the middle. That is a small debugging habit in itself: make failures loud and specific.</p>

<h3>Mac vs Windows/WSL2 — the differences that bite</h3>
<ul>
<li><strong>Paths in traces.</strong> On a Mac, <code>/tmp</code> is a shortcut to <code>/private/tmp</code>, so traces show <code>/private/tmp/…</code> (you will see that in the outputs below — they were run in <code>/tmp/dbg-lab</code>). On Windows you will see <code>C:\\Users\\…</code>, in WSL2 <code>/home/&lt;you&gt;/…</code>. Same bug, different-looking text — strip the path when you search (lesson 2.5).</li>
<li><strong>Python's name.</strong> Mac/Linux: <code>python3</code>. Windows: often <code>py</code> or <code>python</code>. Change the script's list if needed.</li>
<li><strong>Line endings.</strong> A <code>.sh</code> file saved on Windows with CRLF fails in WSL2 with an error that names <code>bash\\r</code> — the invisible <code>\\r</code> became part of the program name. Fix with VS Code's "CRLF/LF" switch in the status bar. Chapter 9 returns to this.</li>
<li><strong>Run the course in WSL2</strong>, not in PowerShell, if you are on Windows — the commands are written for bash/zsh.</li>
</ul>

<h3>Step 3 — three bugs to observe, not to fix</h3>
<p>Type these three programs into <code>~/dbg-lab/muc0</code> (the JavaScript one, <code>tong-tien.js</code>, you already have from Start here 1/2). Run each one and write only the <strong>symptom</strong>: what you expected, what you saw, the exact last line of the error. No fixing yet — Chapter 2 is where you will read these traces properly.</p>
<p><strong>Bug B — Python</strong> (<code>nguoi_dung.py</code>):</p>
${MA_PY}
${OUT_PY}
<p><strong>Bug C — Java</strong> (<code>DonHang.java</code>, runnable directly with <code>java DonHang.java</code> since JDK 11):</p>
${MA_JAVA}
${OUT_JAVA}
<p>Look at the difference between the two Java runs. Without debug information the JVM can only say <code>&lt;local1&gt;</code>; compiled with <code>javac -g</code> it names the variable: <code>don.khach.diaChi</code>. That is the "Helpful NullPointerException" feature (JEP 358) you will use in lesson 2.2 — and a first hint that <strong>how you build and run a program changes how much it can tell you</strong>.</p>

<h3>🧪 Practice (20 min) — set up and write three symptom lines</h3>
<div class="callout ok">
<ol>
<li>Create the workspace from Step 1 and run <code>kiem-moi-truong.sh</code>. Install whatever prints THIẾU, and run it again.</li>
<li>Type the three programs (A: <code>tong-tien.js</code>, B: <code>nguoi_dung.py</code>, C: <code>DonHang.java</code>) and run them.</li>
<li>Create <code>~/dbg-lab/nhat-ky/muc0-trieu-chung.md</code>. For each bug write one line: <em>expected … / actual … / last error line …</em>. Do not fix anything.</li>
<li>Run bug C both ways (<code>java DonHang.java</code> and <code>javac -g</code>) and copy the two different "because …" parts into your file.</li>
</ol>
<p><strong>Done when:</strong> the script prints OK for all eight tools, and your file has three symptom lines plus the <code>&lt;local1&gt;</code> vs <code>don.khach.diaChi</code> pair — with every program still unfixed.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workspace</span><span class="v">One folder where all lab programs and logs live.</span></div>
  <div class="kv"><span class="k">symptom</span><span class="v">What you observe: expected vs actual, plus the exact error text.</span></div>
  <div class="kv"><span class="k">traceback / stack trace</span><span class="v">The list of calls that led to an error, with file and line.</span></div>
  <div class="kv"><span class="k">debug information (-g)</span><span class="v">Extra data in compiled code (like variable names) that tools use to explain errors.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows vs Unix line endings; the wrong one breaks shell scripts.</span></div>
  <div class="kv"><span class="k">WSL2</span><span class="v">Linux running inside Windows; the recommended way to follow this course on Windows.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One workspace (<code>~/dbg-lab</code>) with a <code>nhat-ky</code> folder for debugging logs.</li>
<li>A check script that names missing tools beats eight manual version commands.</li>
<li>Paths, Python's name and line endings differ between Mac, Windows and WSL2 — the bug does not.</li>
<li>Describing the symptom precisely, before fixing, is the first debugging skill.</li>
<li>Compiling Java with <code>-g</code> turns <code>&lt;local1&gt;</code> into a real variable name in the NPE message.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Dựng lab một lần, sau đó chương nào cũng bắt đầu trong năm giây</h2>
<p class="lead">Bài nào trong khoá cũng có thứ để chạy. Bài này dựng thư mục làm việc chứa các chương trình đó, kiểm đủ công cụ bằng một script, và kết thúc bằng kỹ năng gỡ lỗi bị xem nhẹ nhất: chạy ba chương trình hỏng và <strong>mô tả triệu chứng thật chính xác mà không sửa gì</strong>.</p>

<h3>Cài gì, và vì sao có từng công cụ</h3>
<table>
<thead><tr><th>Công cụ</th><th>Dùng để</th><th>Từ chương</th></tr></thead>
<tbody>
<tr><td>Node.js (LTS, v22+)</td><td>Lỗi JavaScript/TypeScript, debugger VS Code</td><td>0</td></tr>
<tr><td>Python 3.11+</td><td>Đọc traceback (chỉ vậy thôi)</td><td>0</td></tr>
<tr><td>JDK 21</td><td>Stack trace Java, debugger IntelliJ, Spring Boot</td><td>0</td></tr>
<tr><td>Git, curl</td><td>Chia đôi lịch sử; phát lại request HTTP</td><td>1</td></tr>
<tr><td>VS Code, IntelliJ IDEA Community, Chrome</td><td>Debugger và DevTools</td><td>3</td></tr>
<tr><td>Docker Desktop (+ Compose)</td><td>Ứng dụng mẫu nhiều dịch vụ (Spring + Node + React + PostgreSQL)</td><td>3</td></tr>
<tr><td>Postman hoặc Bruno, psql/DBeaver</td><td>Các chương API và cơ sở dữ liệu</td><td>6–7</td></tr>
</tbody>
</table>
<p>Về ứng dụng mẫu: ứng dụng đặt lịch phòng lab chạy bằng Docker Compose, mỗi lỗi cài sẵn bật bằng một cờ, được dựng cùng Chương 3 — chương đầu tiên cần gắn debugger vào nhiều dịch vụ. Chương 1 và 2 cố ý dùng chương trình một tệp thật nhỏ, vì phương pháp dễ thấy hơn khi không có framework che phía trước.</p>

<h3>Bước 1 — thư mục làm việc</h3>
${CAY}
<p>Tạo bằng <code>mkdir -p ~/dbg-lab/{nhat-ky,muc0,ch1,ch2}</code>. Thư mục <code>nhat-ky</code> chứa nhật ký gỡ lỗi; đặt tên mỗi tệp theo ngày và tên lỗi để sau này tìm lại làm chuyện kể khi phỏng vấn.</p>

<h3>Bước 2 — kiểm mọi công cụ bằng một script</h3>
<p>Thay vì gõ tay tám lệnh xem phiên bản rồi quên một cái, lưu đoạn này thành <code>~/dbg-lab/kiem-moi-truong.sh</code>:</p>
${MA_KIEM}
${OUT_KIEM}
<p>Đọc kết quả: dòng nào cũng phải OK. Số phiên bản của bạn sẽ khác — bằng hoặc cao hơn mức tối thiểu trong bảng là được. Để ý <code>command -v</code> kiểm chương trình có tồn tại <em>trước khi</em> gọi nó, nên thiếu công cụ thì in đúng một dòng rõ ràng thay vì một câu "command not found" khó hiểu ở giữa chừng. Bản thân đó đã là một thói quen gỡ lỗi nhỏ: làm cho lỗi ồn ào và cụ thể.</p>

<h3>Mac và Windows/WSL2 — những khác biệt hay cắn</h3>
<ul>
<li><strong>Đường dẫn trong trace.</strong> Trên Mac, <code>/tmp</code> là lối tắt tới <code>/private/tmp</code>, nên trace hiện <code>/private/tmp/…</code> (bạn sẽ thấy trong output dưới — chúng được chạy trong <code>/tmp/dbg-lab</code>). Trên Windows bạn thấy <code>C:\\Users\\…</code>, trong WSL2 là <code>/home/&lt;tên-bạn&gt;/…</code>. Cùng một lỗi, chữ trông khác — bỏ đường dẫn đi khi tra cứu (bài 2.5).</li>
<li><strong>Tên lệnh Python.</strong> Mac/Linux: <code>python3</code>. Windows: thường là <code>py</code> hoặc <code>python</code>. Sửa danh sách trong script nếu cần.</li>
<li><strong>Ký tự xuống dòng.</strong> Tệp <code>.sh</code> lưu trên Windows với CRLF sẽ chết trong WSL2 với một lỗi nhắc tới <code>bash\\r</code> — ký tự <code>\\r</code> vô hình bị dính vào tên chương trình. Sửa bằng nút "CRLF/LF" ở thanh trạng thái của VS Code. Chương 9 quay lại chuyện này.</li>
<li><strong>Trên Windows, chạy khoá trong WSL2</strong>, không trong PowerShell — các lệnh viết cho bash/zsh.</li>
</ul>

<h3>Bước 3 — ba lỗi để quan sát, chưa sửa</h3>
<p>Gõ ba chương trình này vào <code>~/dbg-lab/muc0</code> (bản JavaScript <code>tong-tien.js</code> bạn đã có từ bài Bắt đầu 1/2). Chạy từng cái và chỉ ghi <strong>triệu chứng</strong>: mong đợi gì, thấy gì, nguyên văn dòng lỗi cuối. Chưa sửa — Chương 2 mới là lúc đọc kỹ các trace này.</p>
<p><strong>Lỗi B — Python</strong> (<code>nguoi_dung.py</code>):</p>
${MA_PY}
${OUT_PY}
<p><strong>Lỗi C — Java</strong> (<code>DonHang.java</code>, chạy thẳng bằng <code>java DonHang.java</code> từ JDK 11):</p>
${MA_JAVA}
${OUT_JAVA}
<p>Nhìn khác biệt giữa hai lần chạy Java. Không có thông tin debug, JVM chỉ nói được <code>&lt;local1&gt;</code> (biến cục bộ số 1); biên dịch với <code>javac -g</code> thì nó gọi đúng tên biến: <code>don.khach.diaChi</code>. Đó là tính năng "Helpful NullPointerException" (JEP 358) bạn sẽ dùng ở bài 2.2 — và là gợi ý đầu tiên rằng <strong>cách bạn build và chạy chương trình quyết định nó kể được cho bạn bao nhiêu</strong>.</p>

<h3>🧪 Thực hành (20 phút) — dựng lab và viết ba dòng triệu chứng</h3>
<div class="callout ok">
<ol>
<li>Tạo thư mục ở Bước 1 và chạy <code>kiem-moi-truong.sh</code>. Cài cái nào in THIẾU, rồi chạy lại.</li>
<li>Gõ ba chương trình (A: <code>tong-tien.js</code>, B: <code>nguoi_dung.py</code>, C: <code>DonHang.java</code>) và chạy.</li>
<li>Tạo <code>~/dbg-lab/nhat-ky/muc0-trieu-chung.md</code>. Mỗi lỗi một dòng: <em>mong đợi … / thực tế … / dòng lỗi cuối …</em>. Không sửa gì.</li>
<li>Chạy lỗi C theo cả hai cách (<code>java DonHang.java</code> và <code>javac -g</code>), chép hai phần "because …" khác nhau vào tệp.</li>
</ol>
<p><strong>Đạt khi:</strong> script in OK cho cả tám công cụ, tệp của bạn có ba dòng triệu chứng cùng cặp <code>&lt;local1&gt;</code> / <code>don.khach.diaChi</code> — và chưa chương trình nào bị sửa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">workspace (thư mục làm việc)</span><span class="v">Một thư mục chứa mọi chương trình lab và nhật ký.</span></div>
  <div class="kv"><span class="k">symptom (triệu chứng)</span><span class="v">Cái quan sát được: mong đợi so với thực tế, kèm nguyên văn lỗi.</span></div>
  <div class="kv"><span class="k">traceback / stack trace (dấu vết lời gọi)</span><span class="v">Danh sách lời gọi dẫn tới lỗi, kèm tệp và dòng.</span></div>
  <div class="kv"><span class="k">debug information (thông tin gỡ lỗi, -g)</span><span class="v">Dữ liệu thêm trong code đã biên dịch (như tên biến) để công cụ giải thích lỗi.</span></div>
  <div class="kv"><span class="k">CRLF / LF (ký tự xuống dòng)</span><span class="v">Kiểu xuống dòng của Windows và Unix; sai kiểu là script shell hỏng.</span></div>
  <div class="kv"><span class="k">WSL2</span><span class="v">Linux chạy bên trong Windows; cách nên dùng để học khoá này trên Windows.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một thư mục làm việc (<code>~/dbg-lab</code>) với thư mục <code>nhat-ky</code> cho nhật ký gỡ lỗi.</li>
<li>Script kiểm công cụ gọi đúng tên thứ còn thiếu tốt hơn tám lệnh gõ tay.</li>
<li>Đường dẫn, tên lệnh Python, ký tự xuống dòng khác nhau giữa Mac, Windows, WSL2 — lỗi thì vẫn là lỗi đó.</li>
<li>Mô tả triệu chứng thật chính xác, trước khi sửa, là kỹ năng gỡ lỗi đầu tiên.</li>
<li>Biên dịch Java với <code>-g</code> biến <code>&lt;local1&gt;</code> thành tên biến thật trong thông báo NPE.</li>
</ul>
${NGUON}
</div>
`,
};
