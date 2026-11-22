/**
 * 2.4 — Python: traceback đọc từ dưới lên, ngoại lệ lồng nhau (soạn 22/11/2026).
 * Output chạy THẬT /tmp/dbg-lab/ch2/2-4 (Python 3.15.2, macOS arm64): o1–o5.txt chép NGUYÊN vào chỗ @@Pn@@ bằng script.
 */
import { nguon } from '../_chung.mjs';
import { P } from './_out-2-4.mjs';

const MA1 = `<pre><code class="language-python"># diem_danh.py — absence rate per class
import json

def doc_cau_hinh(duong_dan):
    with open(duong_dan, encoding="utf-8") as f:
        return json.load(f)

def lay_si_so(cau_hinh, lop):
    return cau_hinh["lop"][lop]["si_so"]

def ty_le_vang(so_vang, cau_hinh, lop):
    return so_vang / lay_si_so(cau_hinh, lop)

if __name__ == "__main__":
    import sys
    cfg = doc_cau_hinh("lop.json")
    print("SE1801:", ty_le_vang(3, cfg, "SE1801"))
    print(sys.argv[1] + ":", ty_le_vang(3, cfg, sys.argv[1]))</code></pre>
<p><code>lop.json</code>: <code>{"lop": {"SE1801": {"si_so": 30}, "SE1802": {"si_so": 0}}}</code></p>`;

const MA2 = `<pre><code class="language-python"># chuoi_loi.py
import json

class LoiCauHinh(Exception):
    pass

def nap_ngam(duong_dan):              # style 1: a NEW error happens inside except
    try:
        return json.load(open(duong_dan, encoding="utf-8"))
    except FileNotFoundError:
        print("Không thấy " + duong_dan + ", dùng mặc định: " + MAC_DINH)   # MAC_DINH is not defined

def nap_ro(duong_dan):                # style 2: wrap on purpose with "raise ... from"
    try:
        return json.load(open(duong_dan, encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise LoiCauHinh(f"Tệp cấu hình {duong_dan} hỏng") from e

import sys
if sys.argv[1] == "ngam":
    nap_ngam("khong-co.json")
else:
    nap_ro("hong.json")</code></pre>
<p><code>hong.json</code> has a trailing comma: <code>{"lop": {"SE1801": {"si_so": 30},}}</code></p>`;

const O = (k) => `<div class="out">${P[k]}</div>`;

const BANG = (en) => en ? `<table>
<thead><tr><th></th><th>Java</th><th>JavaScript / Node</th><th>Python</th></tr></thead>
<tbody>
<tr><td>Newest call</td><td>Top</td><td>Top</td><td><strong>Bottom</strong> ("most recent call last")</td></tr>
<tr><td>Error type + message</td><td>First line</td><td>Line after the source excerpt</td><td><strong>Last line</strong></td></tr>
<tr><td>Wrapped causes</td><td><code>Caused by:</code> — last one is the root</td><td><code>[cause]:</code> when <code>new Error(msg, { cause })</code> is used</td><td>"The above exception was the direct cause…" / "During handling…" — the <strong>first</strong> block is the root</td></tr>
<tr><td>Frame format</td><td><code>at pkg.Class.method(File.java:11)</code></td><td><code>at fn (path:line:col)</code></td><td><code>File "path", line 8, in fn</code> + the source line</td></tr>
<tr><td>Filter your code by</td><td>package name</td><td>project folder, not <code>node_modules</code>/<code>node:</code></td><td>project folder, not <code>site-packages</code>/the Python install</td></tr>
</tbody>
</table>` : `<table>
<thead><tr><th></th><th>Java</th><th>JavaScript / Node</th><th>Python</th></tr></thead>
<tbody>
<tr><td>Lời gọi mới nhất</td><td>Trên cùng</td><td>Trên cùng</td><td><strong>Dưới cùng</strong> ("most recent call last")</td></tr>
<tr><td>Loại lỗi + thông điệp</td><td>Dòng đầu</td><td>Dòng ngay sau đoạn trích mã</td><td><strong>Dòng cuối</strong></td></tr>
<tr><td>Nguyên nhân bị bọc</td><td><code>Caused by:</code> — cái cuối là gốc</td><td><code>[cause]:</code> khi dùng <code>new Error(msg, { cause })</code></td><td>"The above exception was the direct cause…" / "During handling…" — khối <strong>đầu tiên</strong> là gốc</td></tr>
<tr><td>Dạng một frame</td><td><code>at pkg.Lop.ham(Tep.java:11)</code></td><td><code>at ham (đường-dẫn:dòng:cột)</code></td><td><code>File "đường-dẫn", line 8, in ham</code> + dòng mã</td></tr>
<tr><td>Lọc code của mình theo</td><td>tên package</td><td>thư mục dự án, bỏ <code>node_modules</code>/<code>node:</code></td><td>thư mục dự án, bỏ <code>site-packages</code>/thư mục cài Python</td></tr>
</tbody>
</table>`;

const NGUON = [
  nguon('🐍', 'Python Tutorial — Errors and Exceptions', 'Traceback, raise … from, và chuỗi ngoại lệ (exception chaining).', 'https://docs.python.org/3/tutorial/errors.html'),
  nguon('🐍', 'Python Docs — traceback module', 'Định dạng traceback và hai câu nối "direct cause" / "during handling".', 'https://docs.python.org/3/library/traceback.html'),
].join('\n');

export default {
  title: '2.4 — Python: tracebacks read bottom-up, chained exceptions|||2.4 — Python: traceback đọc từ dưới lên, ngoại lệ lồng nhau',
  slug: 'dbg-2-4-python',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Traceback Python ngược chiều Java/JS: dòng cuối là loại lỗi, frame cuối là nơi nổ; dấu ~~~^^^ chỉ đúng biểu thức; hai câu nối "During handling…" và "The above exception was the direct cause…" (raise … from); KeyError, ZeroDivisionError, AttributeError, TypeError, NameError chạy thật trên Python 3.15; bảng so ba ngôn ngữ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Python writes the story in the other direction — start at the last line</h2>
<p class="lead">You may never write Python at work, but you will read its tracebacks: build scripts, data jobs, AI tools, a teammate's automation. Python prints the call chain <em>oldest first</em> and the error <em>last</em>, the opposite of Java and JavaScript. Once you flip your reading direction, Python tracebacks are among the most helpful of the three — modern versions even underline the exact expression that failed.</p>

<h3>An everyday picture: a diary</h3>
<p>A Java trace is a news report: headline first, background after. A Python traceback is a diary: "first I did this, then this, then this… and then it broke." The ending — the last line — is the headline.</p>

<h3>1. Reading one traceback</h3>
${MA1}
${O('P1')}
<p>Read from the bottom: <code>KeyError: 'SE1899'</code> — a dictionary had no key <code>'SE1899'</code>. The frame just above is where it exploded: <code>diem_danh.py</code>, line 8, in <code>lay_si_so</code>, and the <code>~~~^^^^^</code> marks under the source line point at <code>[lop]</code> — the missing key is the class code, not <code>"lop"</code> or <code>"si_so"</code>. Going up shows who called it (<code>ty_le_vang</code>, line 11) and finally the top level (<code>&lt;module&gt;</code>, line 17). Note the first <code>print</code> ran fine: <code>SE1801: 0.1</code>.</p>
<p>The same program with a class that exists but has 0 students:</p>
${O('P2')}
<p>Now the markers point at the <code>/</code> itself (<code>^</code> under the operator), and the traceback is one frame shorter: <code>lay_si_so</code> returned normally (0); the division in <code>ty_le_vang</code> failed. Two different bugs in the same line of output — the markers told them apart.</p>

<h3>2. Chained exceptions: two different sentences</h3>
<p>When an exception happens while another one is being handled, Python prints <strong>both</strong> tracebacks, joined by one of two sentences. The sentence tells you whether the chain was an accident or on purpose.</p>
${MA2}
${O('P3')}
<p><strong>"During handling of the above exception, another exception occurred"</strong> = an accident: while handling <code>FileNotFoundError</code>, the handler itself crashed (<code>NameError: MAC_DINH</code>). There are two bugs: the file is missing (expected, that is why the <code>except</code> exists) and the fallback code is broken (the real bug to fix). Beginners fix only the last error and wonder why the first is still there.</p>
${O('P4')}
<p><strong>"The above exception was the direct cause of the following exception"</strong> = on purpose: <code>raise LoiCauHinh(...) from e</code> wrapped a low-level error in a meaningful one. The bottom line gives the meaning (<code>Tệp cấu hình hong.json hỏng</code>), the <em>first</em> block gives the root detail: <code>Illegal trailing comma before end of object: line 1 column 33</code>. Also notice the four frames in <code>/opt/homebrew/…/json/</code>: that is the standard library — skip them, exactly as you skip <code>node_modules</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reading only the last line of a chain.</strong> In a chained traceback the last line is the <em>last</em> exception, not the first cause. In Java the root is at the bottom; in a Python chain the root is the <strong>first</strong> block. Read the sentence between blocks to know which is which.</p></div>

<h3>3. Errors you will meet most</h3>
${O('P5')}
<ul>
<li><code>KeyError: 'x'</code> — a dict has no key <code>'x'</code>. Use <code>d.get('x')</code> when missing is normal.</li>
<li><code>AttributeError: 'list' object has no attribute 'push'. Did you mean '.append'?</code> — JavaScript habits in Python; recent versions suggest the right name.</li>
<li><code>AttributeError: 'dict' object has no attribute 'ten'</code> — dicts use <code>d["ten"]</code>, not <code>d.ten</code>.</li>
<li><code>TypeError: can only concatenate str (not "int") to str</code> — Python does not convert silently (JavaScript would have printed <code>Tuổi: 20</code>). Use an f-string.</li>
<li><code>NameError</code>, <code>ZeroDivisionError</code> — as above.</li>
</ul>

<h3>The three languages side by side</h3>
${BANG(true)}

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<ol>
<li>Create <code>diem_danh.py</code> and <code>lop.json</code>; run with <code>SE1802</code> and <code>SE1899</code>. For each, write: error type, the line, and what the <code>~^</code> markers point at.</li>
<li>Create <code>chuoi_loi.py</code> and <code>hong.json</code>; run <code>ngam</code> and <code>ro</code>. For each chain, write which block is the root and which sentence joined them.</li>
<li>Fix <code>nap_ngam</code> so a missing file really falls back to a default dict, and make <code>ty_le_vang</code> return a clear message for a class with 0 students.</li>
</ol>
<p><strong>Done when:</strong> you identified <code>[lop]</code> vs <code>/</code> as the failing expressions, named "During handling" as an accident and "direct cause" as deliberate, and both programs run without a traceback for all three class codes.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">traceback</span><span class="v">Python's stack trace, oldest call first, error last.</span></div>
  <div class="kv"><span class="k">&lt;module&gt;</span><span class="v">The top level of a Python file.</span></div>
  <div class="kv"><span class="k">exception chaining</span><span class="v">One exception linked to another: implicit ("During handling") or explicit (<code>raise … from</code>).</span></div>
  <div class="kv"><span class="k">KeyError</span><span class="v">A dictionary key that does not exist.</span></div>
  <div class="kv"><span class="k">AttributeError</span><span class="v">An attribute or method the object does not have.</span></div>
  <div class="kv"><span class="k">standard library</span><span class="v">Modules shipped with Python (<code>json</code>…); skip their frames first.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Python: read from the bottom — the last line is type and message, the frame above it is where it exploded.</li>
<li>The <code>~~~^^^</code> markers point at the exact sub-expression that failed.</li>
<li>"During handling…" = a second, accidental error inside <code>except</code>; fix both.</li>
<li>"…direct cause…" = deliberate wrapping with <code>raise … from</code>; the first block holds the root detail.</li>
<li>Skip standard-library and <code>site-packages</code> frames, as you skip <code>node_modules</code>.</li>
</ul>
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Python kể chuyện theo chiều ngược lại — bắt đầu từ dòng cuối</h2>
<p class="lead">Có thể bạn không bao giờ viết Python ở chỗ làm, nhưng bạn sẽ đọc traceback của nó: script build, job xử lý dữ liệu, công cụ AI, script tự động của đồng nghiệp. Python in chuỗi lời gọi <em>cũ nhất trước</em> và lỗi <em>sau cùng</em>, ngược với Java và JavaScript. Đổi chiều đọc rồi thì traceback Python thuộc loại dễ hiểu nhất trong ba ngôn ngữ — bản mới còn gạch chân đúng biểu thức bị hỏng.</p>

<h3>Liên tưởng đời thường: cuốn nhật ký</h3>
<p>Trace Java như một bản tin: tít trước, bối cảnh sau. Traceback Python như cuốn nhật ký: "đầu tiên tôi làm việc này, rồi việc này, rồi việc này… rồi nó hỏng." Đoạn kết — dòng cuối — mới là cái tít.</p>

<h3>1. Đọc một traceback</h3>
${MA1}
${O('P1')}
<p>Đọc từ dưới lên: <code>KeyError: 'SE1899'</code> — một dict không có khoá <code>'SE1899'</code>. Frame ngay trên là nơi nổ: <code>diem_danh.py</code>, dòng 8, trong <code>lay_si_so</code>, và dấu <code>~~~^^^^^</code> dưới dòng mã chỉ vào <code>[lop]</code> — khoá bị thiếu là mã lớp, không phải <code>"lop"</code> hay <code>"si_so"</code>. Đi lên thấy ai đã gọi (<code>ty_le_vang</code>, dòng 11) và cuối cùng là cấp cao nhất (<code>&lt;module&gt;</code>, dòng 17). Để ý lệnh <code>print</code> đầu vẫn chạy được: <code>SE1801: 0.1</code>.</p>
<p>Cùng chương trình với một lớp có tồn tại nhưng sĩ số 0:</p>
${O('P2')}
<p>Giờ dấu chỉ vào chính phép <code>/</code> (dấu <code>^</code> dưới toán tử), và traceback ngắn hơn một frame: <code>lay_si_so</code> trả về bình thường (0); phép chia trong <code>ty_le_vang</code> mới hỏng. Hai lỗi khác nhau trên cùng một dòng output — dấu gạch chân đã phân biệt chúng.</p>

<h3>2. Ngoại lệ lồng nhau: hai câu nối khác nhau</h3>
<p>Khi một ngoại lệ xảy ra trong lúc đang xử lý một ngoại lệ khác, Python in <strong>cả hai</strong> traceback, nối bằng một trong hai câu. Câu nối cho biết chuỗi lỗi là tai nạn hay có chủ đích.</p>
${MA2}
${O('P3')}
<p><strong>"During handling of the above exception, another exception occurred"</strong> (trong lúc xử lý lỗi trên, một lỗi khác xảy ra) = tai nạn: đang xử lý <code>FileNotFoundError</code> thì chính đoạn xử lý sập (<code>NameError: MAC_DINH</code>). Có hai lỗi: thiếu tệp (đã lường trước, nên mới có <code>except</code>) và đoạn dự phòng hỏng (lỗi thật cần sửa). Người mới chỉ sửa lỗi cuối rồi thắc mắc sao lỗi đầu vẫn còn.</p>
${O('P4')}
<p><strong>"The above exception was the direct cause of the following exception"</strong> (lỗi trên là nguyên nhân trực tiếp của lỗi sau) = có chủ đích: <code>raise LoiCauHinh(...) from e</code> bọc một lỗi cấp thấp trong một lỗi có nghĩa. Dòng cuối cho ý nghĩa (<code>Tệp cấu hình hong.json hỏng</code>), khối <em>đầu tiên</em> cho chi tiết gốc: <code>Illegal trailing comma before end of object: line 1 column 33</code> (dấu phẩy thừa ở cột 33). Để ý thêm bốn frame trong <code>/opt/homebrew/…/json/</code>: đó là thư viện chuẩn — bỏ qua, y như bỏ qua <code>node_modules</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ đọc dòng cuối của một chuỗi.</strong> Trong traceback lồng nhau, dòng cuối là lỗi <em>sau cùng</em>, không phải nguyên nhân đầu tiên. Trong Java gốc nằm dưới cùng; trong chuỗi Python gốc là khối <strong>đầu tiên</strong>. Đọc câu nối giữa các khối để biết cái nào là cái nào.</p></div>

<h3>3. Những lỗi bạn gặp nhiều nhất</h3>
${O('P5')}
<ul>
<li><code>KeyError: 'x'</code> — dict không có khoá <code>'x'</code>. Dùng <code>d.get('x')</code> khi thiếu là chuyện bình thường.</li>
<li><code>AttributeError: 'list' object has no attribute 'push'. Did you mean '.append'?</code> — thói quen JavaScript mang sang Python; bản mới gợi ý luôn tên đúng.</li>
<li><code>AttributeError: 'dict' object has no attribute 'ten'</code> — dict dùng <code>d["ten"]</code>, không phải <code>d.ten</code>.</li>
<li><code>TypeError: can only concatenate str (not "int") to str</code> — Python không tự đổi kiểu (JavaScript sẽ in <code>Tuổi: 20</code>). Dùng f-string.</li>
<li><code>NameError</code>, <code>ZeroDivisionError</code> — như ở trên.</li>
</ul>

<h3>So ba ngôn ngữ cạnh nhau</h3>
${BANG(false)}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Tạo <code>diem_danh.py</code> và <code>lop.json</code>; chạy với <code>SE1802</code> và <code>SE1899</code>. Mỗi lần ghi: loại lỗi, dòng, và dấu <code>~^</code> chỉ vào đâu.</li>
<li>Tạo <code>chuoi_loi.py</code> và <code>hong.json</code>; chạy <code>ngam</code> và <code>ro</code>. Mỗi chuỗi ghi: khối nào là gốc, câu nối nào nối chúng.</li>
<li>Sửa <code>nap_ngam</code> để thiếu tệp thì thật sự dùng một dict mặc định, và cho <code>ty_le_vang</code> trả về thông báo rõ ràng với lớp sĩ số 0.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra <code>[lop]</code> và <code>/</code> là hai biểu thức hỏng, gọi đúng "During handling" là tai nạn và "direct cause" là có chủ đích, và cả hai chương trình chạy không traceback với cả ba mã lớp.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">traceback</span><span class="v">Stack trace của Python, lời gọi cũ nhất trước, lỗi sau cùng.</span></div>
  <div class="kv"><span class="k">&lt;module&gt;</span><span class="v">Cấp cao nhất của một tệp Python.</span></div>
  <div class="kv"><span class="k">exception chaining (chuỗi ngoại lệ)</span><span class="v">Ngoại lệ nối với ngoại lệ khác: ngầm ("During handling") hoặc rõ ràng (<code>raise … from</code>).</span></div>
  <div class="kv"><span class="k">KeyError</span><span class="v">Khoá dict không tồn tại.</span></div>
  <div class="kv"><span class="k">AttributeError</span><span class="v">Thuộc tính hoặc phương thức mà đối tượng không có.</span></div>
  <div class="kv"><span class="k">standard library (thư viện chuẩn)</span><span class="v">Các module đi kèm Python (<code>json</code>…); bỏ qua frame của chúng trước.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Python: đọc từ dưới lên — dòng cuối là loại và thông điệp, frame ngay trên là nơi nổ.</li>
<li>Dấu <code>~~~^^^</code> chỉ đúng biểu thức con bị hỏng.</li>
<li>"During handling…" = lỗi thứ hai, ngẫu nhiên, bên trong <code>except</code>; sửa cả hai.</li>
<li>"…direct cause…" = bọc có chủ đích bằng <code>raise … from</code>; khối đầu chứa chi tiết gốc.</li>
<li>Bỏ qua frame của thư viện chuẩn và <code>site-packages</code>, như bỏ qua <code>node_modules</code>.</li>
</ul>
${NGUON}
</div>
`,
};
