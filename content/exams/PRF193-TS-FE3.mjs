// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-PRF193-TS-FE3.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "PRF193"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE3",
      "title": "PRF193 — Practice Final 3 (self-composed)|||PRF193 — Đề luyện cuối kỳ 3 (tự soạn theo dạng đề)",
      "description": "Practice final written from the course content, following the usual exam format. Source: tự soạn theo dạng đề.|||Đề luyện viết mới từ nội dung môn học, theo đúng dạng đề thường gặp. Nguồn: tự soạn theo dạng đề.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "source": "SAMPLE",
      "shuffleQuestions": false,
      "shuffleOptions": false,
      "instructions": "<div class=\"ml-en\"><p>This is a <b>practice final</b> for <b>Programming Fundamentals (with C/C++)</b>, <b>self-composed</b> from the course content following the usual exam format (50 questions, 60 minutes). It is not an official exam paper. Every question is <b>multiple choice</b> and auto-graded.</p><p>Code snippets assume the needed standard headers and <code>using namespace std;</code>. Assume a 64-bit machine with a 4-byte <code>int</code>.</p><ul><li>Read code, tables and diagrams carefully; several questions turn on a subtle detail.</li></ul><p>You can flag a question and come back. The timer auto-submits at the end. After you submit, every question explains each option in both languages.</p></div><div class=\"ml-vi\"><p>Đây là <b>đề luyện cuối kỳ</b> môn <b>Cơ sở lập trình (với C/C++)</b>, <b>tự soạn theo dạng đề</b> từ nội dung môn học (50 câu, 60 phút). Đây không phải đề thi chính thức. Mọi câu đều là <b>trắc nghiệm</b>, chấm tự động.</p><p>Các đoạn code ngầm hiểu đã có đủ header chuẩn cần thiết và <code>using namespace std;</code>. Giả định máy 64 bit, <code>int</code> 4 byte.</p><ul><li>Đọc kỹ code, bảng và sơ đồ; nhiều câu ăn thua ở một chi tiết nhỏ.</li></ul><p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều giải thích từng đáp án bằng hai thứ tiếng.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which line fails to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>, y = <span class=\"hljs-number\">2</span>;        <span class=\"hljs-comment\">// line 1</span>\n    <span class=\"hljs-type\">int</span> *<span class=\"hljs-type\">const</span> p = &amp;x; *p = <span class=\"hljs-number\">9</span>; <span class=\"hljs-comment\">// line 2</span>\n    p = &amp;y;                  <span class=\"hljs-comment\">// line 3</span>\n    cout &lt;&lt; *p;              <span class=\"hljs-comment\">// line 4</span>\n}</code></pre></div><div class=\"ml-vi\"><p>Dòng nào không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>, y = <span class=\"hljs-number\">2</span>;        <span class=\"hljs-comment\">// line 1</span>\n    <span class=\"hljs-type\">int</span> *<span class=\"hljs-type\">const</span> p = &amp;x; *p = <span class=\"hljs-number\">9</span>; <span class=\"hljs-comment\">// line 2</span>\n    p = &amp;y;                  <span class=\"hljs-comment\">// line 3</span>\n    cout &lt;&lt; *p;              <span class=\"hljs-comment\">// line 4</span>\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Line 3|||Dòng 3"
            },
            {
              "text": "Line 1|||Dòng 1"
            },
            {
              "text": "Line 4|||Dòng 4"
            },
            {
              "text": "Line 2|||Dòng 2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. p is a const pointer, so it cannot be aimed elsewhere.<br/>B. This is a normal declaration.<br/>C. Reading through p is fine.<br/>D. The pointed-to int is not const, so it can be changed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. p là con trỏ const nên không trỏ sang chỗ khác được.<br/>B. Đây là khai báo bình thường.<br/>C. Đọc qua p là hợp lệ.<br/>D. Số int được trỏ tới không const nên đổi được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">1.5</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> string &amp;s) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;text&quot;</span>;\n    } <span class=\"hljs-built_in\">catch</span> (...) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;any&quot;</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">1.5</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> string &amp;s) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;text&quot;</span>;\n    } <span class=\"hljs-built_in\">catch</span> (...) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;any&quot;</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1.5|||1.5"
            },
            {
              "text": "The program terminates|||Chương trình kết thúc"
            },
            {
              "text": "any|||any"
            },
            {
              "text": "text|||text"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Nothing prints the value.<br/>B. It is caught.<br/>C. catch (...) accepts any exception type.<br/>D. The thrown value is a double and is not caught as a string.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không có lệnh nào in giá trị đó.<br/>B. Nó đã được bắt.<br/>C. catch (...) nhận mọi kiểu ngoại lệ.<br/>D. Giá trị ném là double, không bị bắt như chuỗi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">down</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{\n    cout &lt;&lt; n &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (n &gt; <span class=\"hljs-number\">0</span>) <span class=\"hljs-built_in\">down</span>(n - <span class=\"hljs-number\">1</span>);\n}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">down</span>(<span class=\"hljs-number\">3</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">down</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{\n    cout &lt;&lt; n &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (n &gt; <span class=\"hljs-number\">0</span>) <span class=\"hljs-built_in\">down</span>(n - <span class=\"hljs-number\">1</span>);\n}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">down</span>(<span class=\"hljs-number\">3</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0 1 2 3|||0 1 2 3"
            },
            {
              "text": "3 2 1|||3 2 1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "3 2 1 0|||3 2 1 0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That would need the print after the recursive call.<br/>B. The call with n = 0 prints too.<br/>C. The function calls itself.<br/>D. Each call prints n first and only then goes deeper, so the numbers go down.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Muốn vậy phải in sau lời gọi đệ quy.<br/>B. Lời gọi với n = 0 cũng in.<br/>C. Hàm tự gọi lại chính nó.<br/>D. Mỗi lần gọi in n trước rồi mới gọi sâu hơn nên số giảm dần.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v = {<span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">9</span>};\n    <span class=\"hljs-built_in\">sort</span>(v.<span class=\"hljs-built_in\">begin</span>(), v.<span class=\"hljs-built_in\">end</span>(), <span class=\"hljs-built_in\">greater</span>&lt;<span class=\"hljs-type\">int</span>&gt;());\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> x : v) cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v = {<span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">9</span>};\n    <span class=\"hljs-built_in\">sort</span>(v.<span class=\"hljs-built_in\">begin</span>(), v.<span class=\"hljs-built_in\">end</span>(), <span class=\"hljs-built_in\">greater</span>&lt;<span class=\"hljs-type\">int</span>&gt;());\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> x : v) cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "4 1 9|||4 1 9"
            },
            {
              "text": "9 4 1|||9 4 1"
            },
            {
              "text": "1 4 9|||1 4 9"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the original order.<br/>B. greater&lt;int&gt;() sorts from large to small.<br/>C. That is the default ascending order.<br/>D. The comparator is valid.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là thứ tự ban đầu.<br/>B. greater&lt;int&gt;() sắp từ lớn đến nhỏ.<br/>C. Đó là thứ tự tăng mặc định.<br/>D. Bộ so sánh hợp lệ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> **m = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span> *[<span class=\"hljs-number\">2</span>];\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++) m[i] = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">2</span>];\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++)\n        <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">2</span>; j++) {\n            m[i][j] = <span class=\"hljs-number\">2</span> * i + j + <span class=\"hljs-number\">1</span>;\n            s += m[i][j];\n        }\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++) <span class=\"hljs-keyword\">delete</span>[] m[i];\n    <span class=\"hljs-keyword\">delete</span>[] m;\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> **m = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span> *[<span class=\"hljs-number\">2</span>];\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++) m[i] = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">2</span>];\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++)\n        <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">2</span>; j++) {\n            m[i][j] = <span class=\"hljs-number\">2</span> * i + j + <span class=\"hljs-number\">1</span>;\n            s += m[i][j];\n        }\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">2</span>; i++) <span class=\"hljs-keyword\">delete</span>[] m[i];\n    <span class=\"hljs-keyword\">delete</span>[] m;\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The program crashes|||Chương trình sập"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Every row is allocated before use and freed correctly.<br/>B. The cells hold 1, 2, 3 and 4, and each row has its own block.<br/>C. That is the number of cells.<br/>D. That is 2 x 3 rather than the sum.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Mỗi hàng được cấp phát trước khi dùng và giải phóng đúng.<br/>B. Các ô chứa 1, 2, 3 và 4, mỗi hàng có khối nhớ riêng.<br/>C. Đó là số ô.<br/>D. Đó là 2 x 3, không phải tổng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[] = <span class=\"hljs-string\">&quot;lab&quot;</span>;\n    <span class=\"hljs-type\">char</span> b[] = <span class=\"hljs-string\">&quot;lab&quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-built_in\">strcmp</span>(a, b) == <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;equal&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;not equal&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[] = <span class=\"hljs-string\">&quot;lab&quot;</span>;\n    <span class=\"hljs-type\">char</span> b[] = <span class=\"hljs-string\">&quot;lab&quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (<span class=\"hljs-built_in\">strcmp</span>(a, b) == <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;equal&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;not equal&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "equal|||equal"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "It depends on the addresses|||Tuỳ vào địa chỉ"
            },
            {
              "text": "not equal|||not equal"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. strcmp returns 0 when the text matches.<br/>B. The code is valid.<br/>C. strcmp compares the characters.<br/>D. The text is the same.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. strcmp trả về 0 khi nội dung giống nhau.<br/>B. Đoạn code hợp lệ.<br/>C. strcmp so các ký tự.<br/>D. Nội dung giống nhau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;practice  makes   real  progress&quot;</span>)</span></span>;\n    string w;\n    <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (ss &gt;&gt; w) c++;\n    cout &lt;&lt; c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;practice  makes   real  progress&quot;</span>)</span></span>;\n    string w;\n    <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (ss &gt;&gt; w) c++;\n    cout &lt;&lt; c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. There are four words.<br/>B. The loop reads until the stream ends.<br/>C. Extra spaces do not matter, because &gt;&gt; skips whitespace.<br/>D. That counts spaces, not words.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Có bốn từ.<br/>B. Vòng lặp đọc tới hết stream.<br/>C. Khoảng trắng thừa không quan trọng vì &gt;&gt; bỏ qua khoảng trắng.<br/>D. Cách đó đếm dấu cách, không đếm từ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does C++ do when code writes to a[10] of an array declared int a[5]?</p></div><div class=\"ml-vi\"><p>C++ làm gì khi code ghi vào a[10] của mảng khai báo int a[5]?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It always throws an exception|||Nó luôn ném ngoại lệ"
            },
            {
              "text": "The compiler always rejects it|||Trình biên dịch luôn từ chối"
            },
            {
              "text": "The array grows automatically|||Mảng tự lớn lên"
            },
            {
              "text": "No check is made, and the behaviour is undefined|||Không có kiểm tra nào, và hành vi là không xác định"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Plain arrays do no bounds checking.<br/>B. A run-time index is generally not checked.<br/>C. That describes vector with push_back.<br/>D. It may seem to work, corrupt data or crash.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Mảng thường không kiểm tra biên.<br/>B. Chỉ số lúc chạy thường không được kiểm.<br/>C. Đó là mô tả vector với push_back.<br/>D. Nó có thể trông như chạy được, làm hỏng dữ liệu hoặc sập.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the call d.hello() fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Animal</span> { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">hello</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;hi&quot;</span>; } };\n<span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Dog</span> : <span class=\"hljs-keyword\">private</span> Animal {};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Dog d;\n    d.<span class=\"hljs-built_in\">hello</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lời gọi d.hello() không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Animal</span> { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">hello</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;hi&quot;</span>; } };\n<span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Dog</span> : <span class=\"hljs-keyword\">private</span> Animal {};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Dog d;\n    d.<span class=\"hljs-built_in\">hello</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Dog has no base class|||Dog không có lớp cha"
            },
            {
              "text": "Private inheritance makes hello private in Dog|||Kế thừa private làm hello thành private trong Dog"
            },
            {
              "text": "hello must be virtual|||hello phải là virtual"
            },
            {
              "text": "struct cannot be a base class|||struct không làm lớp cha được"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It inherits from Animal.<br/>B. With public inheritance it would be visible.<br/>C. Calling it does not need virtual.<br/>D. It can.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Nó kế thừa Animal.<br/>B. Với kế thừa public thì nó thấy được.<br/>C. Gọi hàm không cần virtual.<br/>D. Được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;hello&quot;</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; s[i] != <span class=\"hljs-string\">&#x27;\\0&#x27;</span>; i++) {\n        s[i] = s[i] - <span class=\"hljs-string\">&#x27;a&#x27;</span> + <span class=\"hljs-string\">&#x27;A&#x27;</span>;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;hello&quot;</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; s[i] != <span class=\"hljs-string\">&#x27;\\0&#x27;</span>; i++) {\n        s[i] = s[i] - <span class=\"hljs-string\">&#x27;a&#x27;</span> + <span class=\"hljs-string\">&#x27;A&#x27;</span>;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "HELLO|||HELLO"
            },
            {
              "text": "Hello|||Hello"
            },
            {
              "text": "It prints numbers|||Nó in ra các con số"
            },
            {
              "text": "hello|||hello"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Subtracting &#39;a&#39; and adding &#39;A&#39; moves each lowercase letter to uppercase.<br/>B. Every letter is changed, not only the first.<br/>C. s is still a char array.<br/>D. The loop writes back into s.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Trừ &#39;a&#39; rồi cộng &#39;A&#39; đưa chữ thường thành chữ hoa.<br/>B. Mọi chữ đều đổi, không chỉ chữ đầu.<br/>C. s vẫn là mảng char.<br/>D. Vòng lặp ghi lại vào s.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Point</span> {\n    <span class=\"hljs-type\">int</span> x, y;\n    <span class=\"hljs-built_in\">Point</span>() : <span class=\"hljs-built_in\">x</span>(<span class=\"hljs-number\">0</span>), <span class=\"hljs-built_in\">y</span>(<span class=\"hljs-number\">0</span>) {}\n    <span class=\"hljs-built_in\">Point</span>(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b = <span class=\"hljs-number\">0</span>) : <span class=\"hljs-built_in\">x</span>(a), <span class=\"hljs-built_in\">y</span>(b) {}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">Point <span class=\"hljs-title\">p</span><span class=\"hljs-params\">(<span class=\"hljs-number\">3</span>)</span></span>;\n    cout &lt;&lt; p.x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; p.y;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Point</span> {\n    <span class=\"hljs-type\">int</span> x, y;\n    <span class=\"hljs-built_in\">Point</span>() : <span class=\"hljs-built_in\">x</span>(<span class=\"hljs-number\">0</span>), <span class=\"hljs-built_in\">y</span>(<span class=\"hljs-number\">0</span>) {}\n    <span class=\"hljs-built_in\">Point</span>(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b = <span class=\"hljs-number\">0</span>) : <span class=\"hljs-built_in\">x</span>(a), <span class=\"hljs-built_in\">y</span>(b) {}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">Point <span class=\"hljs-title\">p</span><span class=\"hljs-params\">(<span class=\"hljs-number\">3</span>)</span></span>;\n    cout &lt;&lt; p.x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; p.y;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0 0|||0 0"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "3 0|||3 0"
            },
            {
              "text": "3 3|||3 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. An argument was given.<br/>B. The two constructors do not clash.<br/>C. Point(3) picks the second constructor and y takes its default.<br/>D. y keeps its default of 0.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Có đối số được truyền.<br/>B. Hai hàm dựng không xung đột.<br/>C. Point(3) chọn hàm dựng thứ hai, y lấy giá trị mặc định.<br/>D. y giữ giá trị mặc định 0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Animal</span> { <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Animal</span>() {} };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Dog</span> : Animal {};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Cat</span> : Animal {};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Animal *a = <span class=\"hljs-keyword\">new</span> Dog;\n    Cat *c = <span class=\"hljs-built_in\">dynamic_cast</span>&lt;Cat *&gt;(a);\n    <span class=\"hljs-keyword\">if</span> (c) cout &lt;&lt; <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;not a Cat&quot;</span>;\n    <span class=\"hljs-keyword\">delete</span> a;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Animal</span> { <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Animal</span>() {} };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Dog</span> : Animal {};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Cat</span> : Animal {};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Animal *a = <span class=\"hljs-keyword\">new</span> Dog;\n    Cat *c = <span class=\"hljs-built_in\">dynamic_cast</span>&lt;Cat *&gt;(a);\n    <span class=\"hljs-keyword\">if</span> (c) cout &lt;&lt; <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;not a Cat&quot;</span>;\n    <span class=\"hljs-keyword\">delete</span> a;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "cat|||cat"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            },
            {
              "text": "not a Cat|||not a Cat"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Animal is polymorphic, so dynamic_cast is allowed.<br/>B. The real object is a Dog.<br/>C. A failed pointer cast gives nullptr, with no exception.<br/>D. The object is a Dog, so dynamic_cast to Cat* gives nullptr.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Animal có hàm ảo nên dùng được dynamic_cast.<br/>B. Đối tượng thật là Dog.<br/>C. Ép con trỏ thất bại cho nullptr, không có ngoại lệ.<br/>D. Đối tượng là Dog nên dynamic_cast sang Cat* cho nullptr.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-number\">5</span> / <span class=\"hljs-number\">2</span> &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-number\">5</span> / <span class=\"hljs-number\">2.0</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-number\">5</span> / <span class=\"hljs-number\">2</span> &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-number\">5</span> / <span class=\"hljs-number\">2.0</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2 2.5|||2 2.5"
            },
            {
              "text": "3 2.5|||3 2.5"
            },
            {
              "text": "2 2|||2 2"
            },
            {
              "text": "2.5 2.5|||2.5 2.5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Two ints divide as integers; 2.0 makes the second division real.<br/>B. Integer division cuts off the fraction.<br/>C. 5 / 2.0 keeps the fraction.<br/>D. 5 / 2 is integer division.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Hai số nguyên chia nguyên; 2.0 làm phép chia thứ hai thành số thực.<br/>B. Chia nguyên cắt bỏ phần lẻ.<br/>C. 5 / 2.0 giữ phần lẻ.<br/>D. 5 / 2 là chia nguyên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    map&lt;string, <span class=\"hljs-type\">int</span>&gt; m;\n    m[<span class=\"hljs-string\">&quot;a&quot;</span>] = <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">count</span>(<span class=\"hljs-string\">&quot;b&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-type\">int</span> x = m[<span class=\"hljs-string\">&quot;b&quot;</span>];\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">count</span>(<span class=\"hljs-string\">&quot;b&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    map&lt;string, <span class=\"hljs-type\">int</span>&gt; m;\n    m[<span class=\"hljs-string\">&quot;a&quot;</span>] = <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">count</span>(<span class=\"hljs-string\">&quot;b&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-type\">int</span> x = m[<span class=\"hljs-string\">&quot;b&quot;</span>];\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">count</span>(<span class=\"hljs-string\">&quot;b&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; m.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 1 2|||1 1 2"
            },
            {
              "text": "0 1 2|||0 1 2"
            },
            {
              "text": "0 0 1|||0 0 1"
            },
            {
              "text": "0 1 1|||0 1 1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. count ran before the key existed.<br/>B. count does not insert, but operator[] inserts a missing key with value 0.<br/>C. The [] access added a key.<br/>D. The map starts with one key, and the [] adds a second.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. count chạy khi khoá chưa tồn tại.<br/>B. count không chèn, còn operator[] chèn khoá chưa có với giá trị 0.<br/>C. Truy cập [] đã thêm một khoá.<br/>D. map có sẵn một khoá, [] thêm khoá thứ hai.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Count</span> {\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">0</span>;\n    Count &amp;<span class=\"hljs-keyword\">operator</span>++() { n++; <span class=\"hljs-keyword\">return</span> *<span class=\"hljs-keyword\">this</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Count c;\n    ++(++c);\n    cout &lt;&lt; c.n;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Count</span> {\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">0</span>;\n    Count &amp;<span class=\"hljs-keyword\">operator</span>++() { n++; <span class=\"hljs-keyword\">return</span> *<span class=\"hljs-keyword\">this</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Count c;\n    ++(++c);\n    cout &lt;&lt; c.n;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The operator runs twice.<br/>B. It changes n.<br/>C. Prefix ++ takes no parameter.<br/>D. Prefix ++ adds 1 twice here, and returns the object each time.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Toán tử chạy hai lần.<br/>B. Nó làm đổi n.<br/>C. ++ tiền tố không có tham số.<br/>D. ++ tiền tố cộng 1 hai lần ở đây và mỗi lần trả về đối tượng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_unique</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    <span class=\"hljs-keyword\">auto</span> q = <span class=\"hljs-built_in\">move</span>(p);\n    <span class=\"hljs-keyword\">if</span> (!p) cout &lt;&lt; <span class=\"hljs-string\">&quot;null &quot;</span>;\n    cout &lt;&lt; *q;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_unique</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    <span class=\"hljs-keyword\">auto</span> q = <span class=\"hljs-built_in\">move</span>(p);\n    <span class=\"hljs-keyword\">if</span> (!p) cout &lt;&lt; <span class=\"hljs-string\">&quot;null &quot;</span>;\n    cout &lt;&lt; *q;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "null null|||null null"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "null 5|||null 5"
            },
            {
              "text": "5 5|||5 5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. q now owns the int.<br/>B. Moving a unique_ptr is allowed.<br/>C. move transfers ownership, leaving p empty.<br/>D. A unique_ptr has only one owner.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. q giờ sở hữu số int.<br/>B. Di chuyển unique_ptr là hợp lệ.<br/>C. move chuyển quyền sở hữu, p trở thành rỗng.<br/>D. unique_ptr chỉ có một chủ sở hữu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code not compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">1</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">2.5</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">get</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">1</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">2.5</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">get</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The functions need parameters|||Các hàm phải có tham số"
            },
            {
              "text": "Functions cannot be overloaded on return type alone|||Không nạp chồng hàm chỉ bằng kiểu trả về được"
            },
            {
              "text": "get is a reserved word|||get là từ khoá"
            },
            {
              "text": "A function cannot return double|||Hàm không được trả về double"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Functions may have none.<br/>B. The parameter lists are identical, so the two collide.<br/>C. It is an ordinary name.<br/>D. It can.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Hàm có thể không có tham số.<br/>B. Hai danh sách tham số giống hệt nhau nên chúng xung đột.<br/>C. Đó là một tên bình thường.<br/>D. Được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which object stays alive after makeOne returns?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> *<span class=\"hljs-title\">makeOne</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{\n    <span class=\"hljs-type\">int</span> a = n * <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-type\">int</span> *h = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">int</span>(a);\n    <span class=\"hljs-keyword\">return</span> h;\n}</code></pre></div><div class=\"ml-vi\"><p>Đối tượng nào còn sống sau khi makeOne trả về?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> *<span class=\"hljs-title\">makeOne</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{\n    <span class=\"hljs-type\">int</span> a = n * <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-type\">int</span> *h = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">int</span>(a);\n    <span class=\"hljs-keyword\">return</span> h;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The int created with new|||Số int tạo bằng new"
            },
            {
              "text": "Both a and n|||Cả a và n"
            },
            {
              "text": "The parameter n|||Tham số n"
            },
            {
              "text": "The local variable a|||Biến cục bộ a"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Heap memory lasts until it is deleted.<br/>B. Both are on the stack.<br/>C. Parameters are locals too.<br/>D. It is on the stack and dies at return.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Bộ nhớ heap tồn tại tới khi bị delete.<br/>B. Cả hai đều nằm trên stack.<br/>C. Tham số cũng là biến cục bộ.<br/>D. Nó nằm trên stack và mất khi hàm trả về.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;AA&quot;</span>; }\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;BB&quot;</span>; }\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>;\n    string s;\n    in &gt;&gt; s;\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;AA&quot;</span>; }\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;BB&quot;</span>; }\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;x.txt&quot;</span>)</span></span>;\n    string s;\n    in &gt;&gt; s;\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "AA|||AA"
            },
            {
              "text": "BBAA|||BBAA"
            },
            {
              "text": "AABB|||AABB"
            },
            {
              "text": "BB|||BB"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The second write happens.<br/>B. Text is not put at the front.<br/>C. That needs ios::app.<br/>D. ofstream truncates by default, so the second open wipes the first text.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Lần ghi thứ hai có diễn ra.<br/>B. Chữ không được đặt lên đầu.<br/>C. Muốn vậy cần ios::app.<br/>D. ofstream mặc định xoá trắng tệp nên lần mở thứ hai xoá nội dung đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;12\\nAn Binh&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> n;\n    string name;\n    ss &gt;&gt; n;\n    <span class=\"hljs-built_in\">getline</span>(ss, name);\n    cout &lt;&lt; <span class=\"hljs-string\">&quot;[&quot;</span> &lt;&lt; name &lt;&lt; <span class=\"hljs-string\">&quot;]&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;12\\nAn Binh&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> n;\n    string name;\n    ss &gt;&gt; n;\n    <span class=\"hljs-built_in\">getline</span>(ss, name);\n    cout &lt;&lt; <span class=\"hljs-string\">&quot;[&quot;</span> &lt;&lt; name &lt;&lt; <span class=\"hljs-string\">&quot;]&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "[An Binh]|||[An Binh]"
            },
            {
              "text": "[12]|||[12]"
            },
            {
              "text": "[]|||[]"
            },
            {
              "text": "[An]|||[An]"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That needs the newline skipped first, for example with ws.<br/>B. 12 was read by &gt;&gt;.<br/>C. &gt;&gt; leaves the newline behind, and getline reads up to it at once.<br/>D. getline does not stop at a space.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Muốn vậy phải bỏ ký tự xuống dòng trước, ví dụ dùng ws.<br/>B. 12 đã được &gt;&gt; đọc.<br/>C. &gt;&gt; để lại ký tự xuống dòng, getline đọc tới đó ngay.<br/>D. getline không dừng ở dấu cách.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Two threads each run counter++ a million times on a shared int with no lock. What should you expect?</p></div><div class=\"ml-vi\"><p>Hai luồng, mỗi luồng chạy counter++ một triệu lần trên một biến int dùng chung, không khoá. Bạn nên chờ đợi điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Each thread gets its own copy of counter|||Mỗi luồng có một bản counter riêng"
            },
            {
              "text": "It is always exactly two million|||Luôn đúng hai triệu"
            },
            {
              "text": "It may end below two million, as updates can be lost|||Có thể ra dưới hai triệu vì cập nhật có thể bị mất"
            },
            {
              "text": "The compiler rejects the code|||Trình biên dịch từ chối"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The variable is shared.<br/>B. This is a data race with no guarantee.<br/>C. counter++ is read, add, write, and the steps can interleave.<br/>D. It compiles.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Biến này dùng chung.<br/>B. Đây là tranh chấp dữ liệu, không có gì bảo đảm.<br/>C. counter++ gồm đọc, cộng, ghi, các bước này có thể đan xen.<br/>D. Nó biên dịch được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">unsigned</span> <span class=\"hljs-type\">char</span> c = <span class=\"hljs-number\">255</span>;\n    c++;\n    cout &lt;&lt; (<span class=\"hljs-type\">int</span>)c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">unsigned</span> <span class=\"hljs-type\">char</span> c = <span class=\"hljs-number\">255</span>;\n    c++;\n    cout &lt;&lt; (<span class=\"hljs-type\">int</span>)c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "255|||255"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "256|||256"
            },
            {
              "text": "-1|||-1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The increment does change c.<br/>B. An 8-bit unsigned value wraps around from 255 to 0.<br/>C. 256 does not fit in 8 bits.<br/>D. An unsigned type has no negative values.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phép tăng có làm đổi c.<br/>B. Giá trị không dấu 8 bit quay vòng từ 255 về 0.<br/>C. 256 không vừa trong 8 bit.<br/>D. Kiểu không dấu không có số âm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">G</span> { ~<span class=\"hljs-built_in\">G</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;~G &quot;</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        G g;\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">1</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">int</span>) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;caught&quot;</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">G</span> { ~<span class=\"hljs-built_in\">G</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;~G &quot;</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        G g;\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">1</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">int</span>) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;caught&quot;</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "caught|||caught"
            },
            {
              "text": "~G|||~G"
            },
            {
              "text": "caught ~G|||caught ~G"
            },
            {
              "text": "~G caught|||~G caught"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The destructor still runs.<br/>B. The handler runs as well.<br/>C. Destruction comes first.<br/>D. Stack unwinding destroys g before the handler runs.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Hàm huỷ vẫn chạy.<br/>B. Khối bắt cũng chạy.<br/>C. Việc huỷ diễn ra trước.<br/>D. Tháo stack huỷ g trước khi khối bắt chạy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *p = <span class=\"hljs-string\">&quot;code&quot;</span>;\n    cout &lt;&lt; p + <span class=\"hljs-number\">1</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *p = <span class=\"hljs-string\">&quot;code&quot;</span>;\n    cout &lt;&lt; p + <span class=\"hljs-number\">1</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ode|||ode"
            },
            {
              "text": "o|||o"
            },
            {
              "text": "code|||code"
            },
            {
              "text": "An address in hexadecimal|||Một địa chỉ hệ hex"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. p + 1 points at the second character, and cout prints up to the null.<br/>B. Printing a char pointer prints a string, not one char.<br/>C. The pointer has moved by one.<br/>D. cout treats const char* as text.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. p + 1 trỏ tới ký tự thứ hai, cout in tới ký tự kết thúc.<br/>B. In con trỏ char là in chuỗi, không phải một ký tự.<br/>C. Con trỏ đã dời một ô.<br/>D. cout coi const char* là văn bản.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Pt</span> { <span class=\"hljs-type\">int</span> x, y; };\nostream &amp;<span class=\"hljs-keyword\">operator</span>&lt;&lt;(ostream &amp;os, <span class=\"hljs-type\">const</span> Pt &amp;p) {\n    <span class=\"hljs-keyword\">return</span> os &lt;&lt; <span class=\"hljs-string\">&quot;(&quot;</span> &lt;&lt; p.x &lt;&lt; <span class=\"hljs-string\">&quot;, &quot;</span> &lt;&lt; p.y &lt;&lt; <span class=\"hljs-string\">&quot;)&quot;</span>;\n}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Pt p{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>};\n    cout &lt;&lt; p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Pt</span> { <span class=\"hljs-type\">int</span> x, y; };\nostream &amp;<span class=\"hljs-keyword\">operator</span>&lt;&lt;(ostream &amp;os, <span class=\"hljs-type\">const</span> Pt &amp;p) {\n    <span class=\"hljs-keyword\">return</span> os &lt;&lt; <span class=\"hljs-string\">&quot;(&quot;</span> &lt;&lt; p.x &lt;&lt; <span class=\"hljs-string\">&quot;, &quot;</span> &lt;&lt; p.y &lt;&lt; <span class=\"hljs-string\">&quot;)&quot;</span>;\n}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Pt p{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>};\n    cout &lt;&lt; p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 2|||1 2"
            },
            {
              "text": "(1, 2)|||(1, 2)"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The function prints brackets and a comma.<br/>B. operator&lt;&lt; writes the format chosen in the class.<br/>C. The overload is valid.<br/>D. The operator adds separators.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Hàm in ngoặc và dấu phẩy.<br/>B. operator&lt;&lt; ghi theo định dạng viết trong lớp.<br/>C. Bản nạp chồng hợp lệ.<br/>D. Toán tử có thêm dấu phân cách.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">48</span>, b = <span class=\"hljs-number\">18</span>;\n    <span class=\"hljs-keyword\">while</span> (b != <span class=\"hljs-number\">0</span>) {\n        <span class=\"hljs-type\">int</span> t = a % b;\n        a = b;\n        b = t;\n    }\n    cout &lt;&lt; a;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">48</span>, b = <span class=\"hljs-number\">18</span>;\n    <span class=\"hljs-keyword\">while</span> (b != <span class=\"hljs-number\">0</span>) {\n        <span class=\"hljs-type\">int</span> t = a % b;\n        a = b;\n        b = t;\n    }\n    cout &lt;&lt; a;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "18|||18"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. 12 is the first remainder.<br/>B. b becomes 0, but a is printed.<br/>C. This is Euclid&#39;s algorithm for the greatest common divisor of 48 and 18.<br/>D. 18 does not divide 48.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. 12 là số dư đầu tiên.<br/>B. b thành 0, nhưng thứ được in là a.<br/>C. Đây là thuật toán Euclid tìm ước chung lớn nhất của 48 và 18.<br/>D. 18 không chia hết 48.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum</span> <span class=\"hljs-title class_\">Light</span> { Red, Yellow, Green };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Light l = Yellow;\n    <span class=\"hljs-keyword\">switch</span> (l) {\n        <span class=\"hljs-keyword\">case</span> Red:    cout &lt;&lt; <span class=\"hljs-string\">&quot;stop&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> Yellow: cout &lt;&lt; <span class=\"hljs-string\">&quot;wait&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> Green:  cout &lt;&lt; <span class=\"hljs-string\">&quot;go&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum</span> <span class=\"hljs-title class_\">Light</span> { Red, Yellow, Green };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Light l = Yellow;\n    <span class=\"hljs-keyword\">switch</span> (l) {\n        <span class=\"hljs-keyword\">case</span> Red:    cout &lt;&lt; <span class=\"hljs-string\">&quot;stop&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> Yellow: cout &lt;&lt; <span class=\"hljs-string\">&quot;wait&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> Green:  cout &lt;&lt; <span class=\"hljs-string\">&quot;go&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "stop|||stop"
            },
            {
              "text": "go|||go"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "wait|||wait"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The value is not Red.<br/>B. The value is not Green.<br/>C. The switch prints text, not the value.<br/>D. The value is Yellow, so the matching case prints wait.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Giá trị không phải Red.<br/>B. Giá trị không phải Green.<br/>C. switch in chữ, không in giá trị.<br/>D. Giá trị là Yellow nên case khớp in wait.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> &amp;<span class=\"hljs-title\">at</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> *a, <span class=\"hljs-type\">int</span> i)</span> </span>{ <span class=\"hljs-keyword\">return</span> a[i]; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">3</span>};\n    <span class=\"hljs-built_in\">at</span>(a, <span class=\"hljs-number\">1</span>) = <span class=\"hljs-number\">9</span>;\n    cout &lt;&lt; a[<span class=\"hljs-number\">0</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a[<span class=\"hljs-number\">1</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a[<span class=\"hljs-number\">2</span>];\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> &amp;<span class=\"hljs-title\">at</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> *a, <span class=\"hljs-type\">int</span> i)</span> </span>{ <span class=\"hljs-keyword\">return</span> a[i]; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">3</span>};\n    <span class=\"hljs-built_in\">at</span>(a, <span class=\"hljs-number\">1</span>) = <span class=\"hljs-number\">9</span>;\n    cout &lt;&lt; a[<span class=\"hljs-number\">0</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a[<span class=\"hljs-number\">1</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a[<span class=\"hljs-number\">2</span>];\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 9 3|||1 9 3"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "9 2 3|||9 2 3"
            },
            {
              "text": "1 2 3|||1 2 3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. at returns a reference, so assigning to it changes a[1].<br/>B. A returned reference is an lvalue.<br/>C. The index is 1, not 0.<br/>D. The element itself is changed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. at trả về tham chiếu nên gán vào nó làm đổi a[1].<br/>B. Tham chiếu trả về là một lvalue.<br/>C. Chỉ số là 1, không phải 0.<br/>D. Chính phần tử bị đổi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{\n        Base::<span class=\"hljs-built_in\">f</span>();\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>;\n    }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Derived d;\n    Base &amp;b = d;\n    b.<span class=\"hljs-built_in\">f</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{\n        Base::<span class=\"hljs-built_in\">f</span>();\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>;\n    }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Derived d;\n    Base &amp;b = d;\n    b.<span class=\"hljs-built_in\">f</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DB|||DB"
            },
            {
              "text": "BD|||BD"
            },
            {
              "text": "D|||D"
            },
            {
              "text": "It loops forever|||Lặp vô hạn"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The base call comes first in the body.<br/>B. Base::f() calls the base version explicitly, and then Derived adds its part.<br/>C. The base version is called too.<br/>D. The qualified call does not recurse.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Lời gọi lớp cha đứng trước trong thân hàm.<br/>B. Base::f() gọi rõ bản của lớp cha, rồi Derived thêm phần của nó.<br/>C. Bản của lớp cha cũng được gọi.<br/>D. Lời gọi có tiền tố không đệ quy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v = {<span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">8</span>};\n    v.<span class=\"hljs-built_in\">erase</span>(v.<span class=\"hljs-built_in\">begin</span>() + <span class=\"hljs-number\">1</span>);\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> x : v) cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v = {<span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">8</span>};\n    v.<span class=\"hljs-built_in\">erase</span>(v.<span class=\"hljs-built_in\">begin</span>() + <span class=\"hljs-number\">1</span>);\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> x : v) cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2 8|||2 8"
            },
            {
              "text": "2 5 8|||2 5 8"
            },
            {
              "text": "5 8|||5 8"
            },
            {
              "text": "2 5|||2 5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. erase removes the element at index 1, and later ones shift left.<br/>B. One element is erased.<br/>C. 2 is at index 0 and stays.<br/>D. 5 is the element removed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. erase xoá phần tử ở chỉ số 1, các phần tử sau dịch trái.<br/>B. Có một phần tử bị xoá.<br/>C. 2 ở chỉ số 0 nên vẫn còn.<br/>D. 5 là phần tử bị xoá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i;\n    <span class=\"hljs-keyword\">for</span> (i = <span class=\"hljs-number\">1</span>; i &lt;= <span class=\"hljs-number\">4</span>; i += <span class=\"hljs-number\">2</span>);\n    cout &lt;&lt; i;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i;\n    <span class=\"hljs-keyword\">for</span> (i = <span class=\"hljs-number\">1</span>; i &lt;= <span class=\"hljs-number\">4</span>; i += <span class=\"hljs-number\">2</span>);\n    cout &lt;&lt; i;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "13|||13"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The loop runs before cout.<br/>B. The loop stops only when i passes 4.<br/>C. cout is not inside the loop.<br/>D. The semicolon after for is an empty body; i goes 1, 3, 5, and cout runs once afterwards.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Vòng lặp chạy trước cout.<br/>B. Vòng lặp chỉ dừng khi i vượt 4.<br/>C. cout không nằm trong vòng lặp.<br/>D. Dấu chấm phẩy sau for là thân rỗng; i đi qua 1, 3, 5 rồi cout chạy một lần.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x, y, z;\n    x = y = <span class=\"hljs-number\">3</span>;\n    z = y + <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; y &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; z;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x, y, z;\n    x = y = <span class=\"hljs-number\">3</span>;\n    z = y + <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; y &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; z;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0 3 4|||0 3 4"
            },
            {
              "text": "3 3 3|||3 3 3"
            },
            {
              "text": "3 3 4|||3 3 4"
            },
            {
              "text": "3 0 1|||3 0 1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. x also receives 3.<br/>B. z adds 1 to y.<br/>C. Assignment runs right to left, then z takes the new y + 1.<br/>D. y is assigned before x.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. x cũng nhận 3.<br/>B. z cộng thêm 1 vào y.<br/>C. Phép gán chạy từ phải sang trái, rồi z nhận y mới cộng 1.<br/>D. y được gán trước x.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Shape</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">0</span>; }\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Shape</span>() {}\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">10</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">B</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">20</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A a;\n    B b;\n    vector&lt;Shape *&gt; v = {&amp;a, &amp;b};\n    <span class=\"hljs-type\">int</span> total = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (Shape *s : v) total += s-&gt;<span class=\"hljs-built_in\">area</span>();\n    cout &lt;&lt; total;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Shape</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">0</span>; }\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Shape</span>() {}\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">10</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">B</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">20</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A a;\n    B b;\n    vector&lt;Shape *&gt; v = {&amp;a, &amp;b};\n    <span class=\"hljs-type\">int</span> total = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (Shape *s : v) total += s-&gt;<span class=\"hljs-built_in\">area</span>();\n    cout &lt;&lt; total;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the last object only.<br/>B. The total adds each object&#39;s own area: 10 + 20.<br/>C. That is the number of shapes.<br/>D. The base version is not used.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó chỉ là đối tượng cuối.<br/>B. Tổng cộng diện tích riêng của mỗi đối tượng: 10 + 20.<br/>C. Đó là số hình.<br/>D. Bản của lớp cha không được dùng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> x = <span class=\"hljs-number\">1.5f</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(x);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> x = <span class=\"hljs-number\">1.5f</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(x);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The f suffix makes the literal a float, so auto deduces float.<br/>B. That would be a double literal, 1.5 with no suffix.<br/>C. 1 is the size of a char.<br/>D. auto may deduce float.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Hậu tố f làm hằng thành float nên auto suy ra float.<br/>B. Đó là hằng double, viết 1.5 không có hậu tố.<br/>C. 1 là cỡ của char.<br/>D. auto suy ra float được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;y.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;ABCDE&quot;</span>; }\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;y.txt&quot;</span>, ios::binary)</span></span>;\n    in.<span class=\"hljs-built_in\">seekg</span>(<span class=\"hljs-number\">0</span>, ios::end);\n    cout &lt;&lt; in.<span class=\"hljs-built_in\">tellg</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    { <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;y.txt&quot;</span>)</span></span>; f &lt;&lt; <span class=\"hljs-string\">&quot;ABCDE&quot;</span>; }\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;y.txt&quot;</span>, ios::binary)</span></span>;\n    in.<span class=\"hljs-built_in\">seekg</span>(<span class=\"hljs-number\">0</span>, ios::end);\n    cout &lt;&lt; in.<span class=\"hljs-built_in\">tellg</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. seekg moved the position.<br/>B. The stream is in a good state.<br/>C. Seeking to the end and asking the position gives the size in bytes.<br/>D. The position after the last byte is 5.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. seekg đã dời vị trí.<br/>B. Stream đang ở trạng thái tốt.<br/>C. Dời tới cuối rồi hỏi vị trí cho biết cỡ tệp theo byte.<br/>D. Vị trí sau byte cuối là 5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the call inc(5) fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">inc</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> &amp;x)</span> </span>{ x++; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">inc</span>(<span class=\"hljs-number\">5</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lời gọi inc(5) không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">inc</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> &amp;x)</span> </span>{ x++; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">inc</span>(<span class=\"hljs-number\">5</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "References cannot be parameters|||Tham chiếu không làm tham số được"
            },
            {
              "text": "The function should return int|||Hàm phải trả về int"
            },
            {
              "text": "5 is too large for int|||5 quá lớn so với int"
            },
            {
              "text": "A non-const int&amp; cannot bind to a literal|||int&amp; không const không gắn vào hằng được"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. They often are.<br/>B. void is allowed.<br/>C. It fits easily.<br/>D. 5 is an rvalue, so there is nothing to modify.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Chúng thường là tham số.<br/>B. void là hợp lệ.<br/>C. Nó vừa dễ dàng.<br/>D. 5 là rvalue nên không có gì để sửa.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ <span class=\"hljs-keyword\">return</span> n &lt; <span class=\"hljs-number\">2</span> ? n : <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">1</span>) + <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">2</span>); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">5</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ <span class=\"hljs-keyword\">return</span> n &lt; <span class=\"hljs-number\">2</span> ? n : <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">1</span>) + <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">2</span>); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">5</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is f(4).<br/>B. That is 5 factorial.<br/>C. That is f(6).<br/>D. 0, 1, 1, 2, 3, 5: f(5) is 5.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là f(4).<br/>B. Đó là 5 giai thừa.<br/>C. Đó là f(6).<br/>D. 0, 1, 1, 2, 3, 5: f(5) bằng 5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the first line in main fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Meter</span> {\n    <span class=\"hljs-type\">int</span> v;\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">explicit</span> <span class=\"hljs-title\">Meter</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x)</span> : v(x) {</span>}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Meter m = <span class=\"hljs-number\">5</span>;\n    cout &lt;&lt; m.v;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao dòng đầu trong main không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Meter</span> {\n    <span class=\"hljs-type\">int</span> v;\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">explicit</span> <span class=\"hljs-title\">Meter</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x)</span> : v(x) {</span>}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Meter m = <span class=\"hljs-number\">5</span>;\n    cout &lt;&lt; m.v;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "m must be a pointer|||m phải là con trỏ"
            },
            {
              "text": "int cannot be a parameter|||int không làm tham số được"
            },
            {
              "text": "explicit blocks this implicit conversion|||explicit chặn phép đổi ngầm này"
            },
            {
              "text": "Meter has no constructor|||Meter không có hàm dựng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Stack objects are fine.<br/>B. It can.<br/>C. Meter m(5); would work.<br/>D. It has one that takes an int.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đối tượng trên stack là hợp lệ.<br/>B. Được.<br/>C. Meter m(5); thì được.<br/>D. Nó có một hàm dựng nhận int.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">1234</span>, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (n &gt; <span class=\"hljs-number\">0</span>) {\n        s += n % <span class=\"hljs-number\">10</span>;\n        n /= <span class=\"hljs-number\">10</span>;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">1234</span>, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (n &gt; <span class=\"hljs-number\">0</span>) {\n        s += n % <span class=\"hljs-number\">10</span>;\n        n /= <span class=\"hljs-number\">10</span>;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "1234|||1234"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The loop adds the digits 4, 3, 2 and 1.<br/>B. That is the product of the digits.<br/>C. That is the starting number.<br/>D. That is how many digits there are.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Vòng lặp cộng các chữ số 4, 3, 2 và 1.<br/>B. Đó là tích các chữ số.<br/>C. Đó là số ban đầu.<br/>D. Đó là số chữ số.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">4</span>, b = <span class=\"hljs-number\">7</span>;\n    a = a ^ b;\n    b = a ^ b;\n    a = a ^ b;\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">4</span>, b = <span class=\"hljs-number\">7</span>;\n    a = a ^ b;\n    b = a ^ b;\n    a = a ^ b;\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 3|||3 3"
            },
            {
              "text": "7 4|||7 4"
            },
            {
              "text": "4 7|||4 7"
            },
            {
              "text": "0 0|||0 0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. 3 is 4 XOR 7, an intermediate value only.<br/>B. Three XORs swap the two values with no temporary.<br/>C. The sequence does change them.<br/>D. The variables are distinct, so they do not cancel out.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. 3 là 4 XOR 7, chỉ là giá trị trung gian.<br/>B. Ba lần XOR đổi hai giá trị mà không cần biến tạm.<br/>C. Chuỗi phép toán có làm đổi chúng.<br/>D. Hai biến khác nhau nên không triệt tiêu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; fixed &lt;&lt; <span class=\"hljs-built_in\">setprecision</span>(<span class=\"hljs-number\">2</span>) &lt;&lt; <span class=\"hljs-number\">3.14159</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; fixed &lt;&lt; <span class=\"hljs-built_in\">setprecision</span>(<span class=\"hljs-number\">2</span>) &lt;&lt; <span class=\"hljs-number\">3.14159</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3.1|||3.1"
            },
            {
              "text": "3.14|||3.14"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "3.14159|||3.14159"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is one decimal place.<br/>B. fixed with setprecision(2) gives two digits after the point.<br/>C. fixed shows the decimals.<br/>D. The precision limits the digits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là một chữ số thập phân.<br/>B. fixed và setprecision(2) cho hai chữ số sau dấu chấm.<br/>C. fixed hiện phần thập phân.<br/>D. Độ chính xác giới hạn số chữ số.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Room</span> { <span class=\"hljs-type\">int</span> floor; <span class=\"hljs-type\">int</span> number; };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Office</span> { string city; Room room; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Office o = {<span class=\"hljs-string\">&quot;Hue&quot;</span>, {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">12</span>}};\n    o.city = <span class=\"hljs-string\">&quot;Da Nang&quot;</span>;\n    o.room.floor = <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; o.city &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; o.room.floor;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Room</span> { <span class=\"hljs-type\">int</span> floor; <span class=\"hljs-type\">int</span> number; };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Office</span> { string city; Room room; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Office o = {<span class=\"hljs-string\">&quot;Hue&quot;</span>, {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">12</span>}};\n    o.city = <span class=\"hljs-string\">&quot;Da Nang&quot;</span>;\n    o.room.floor = <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; o.city &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; o.room.floor;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Da Nang 1|||Da Nang 1"
            },
            {
              "text": "Hue 2|||Hue 2"
            },
            {
              "text": "Da Nang 2|||Da Nang 2"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The floor was changed.<br/>B. The city was changed.<br/>C. Member access goes through both structs.<br/>D. Nesting structs is allowed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Tầng đã bị đổi.<br/>B. Thành phố đã bị đổi.<br/>C. Truy cập thành viên đi qua cả hai struct.<br/>D. Lồng struct là hợp lệ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *w[] = {<span class=\"hljs-string\">&quot;hi&quot;</span>, <span class=\"hljs-string\">&quot;yo&quot;</span>};\n    cout &lt;&lt; w[<span class=\"hljs-number\">1</span>][<span class=\"hljs-number\">0</span>];\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *w[] = {<span class=\"hljs-string\">&quot;hi&quot;</span>, <span class=\"hljs-string\">&quot;yo&quot;</span>};\n    cout &lt;&lt; w[<span class=\"hljs-number\">1</span>][<span class=\"hljs-number\">0</span>];\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "h|||h"
            },
            {
              "text": "i|||i"
            },
            {
              "text": "yo|||yo"
            },
            {
              "text": "y|||y"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is w[0][0].<br/>B. That is w[0][1].<br/>C. The second index picks one character.<br/>D. w[1] is &quot;yo&quot;, and its first character is y.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là w[0][0].<br/>B. Đó là w[0][1].<br/>C. Chỉ số thứ hai chọn một ký tự.<br/>D. w[1] là &quot;yo&quot;, ký tự đầu là y.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the call c.run() fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">run</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Car</span> : Base { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">run</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span>)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Car c;\n    c.<span class=\"hljs-built_in\">run</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lời gọi c.run() không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">run</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Car</span> : Base { <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">run</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span>)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Car c;\n    c.<span class=\"hljs-built_in\">run</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Car::run(int) hides every run in Base|||Car::run(int) che mọi hàm run trong Base"
            },
            {
              "text": "The parameter name is missing|||Thiếu tên tham số"
            },
            {
              "text": "run must be virtual|||run phải là virtual"
            },
            {
              "text": "A derived class cannot add a function|||Lớp con không được thêm hàm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Name lookup stops at Car, where no zero-argument run exists.<br/>B. An unused parameter needs no name.<br/>C. Hiding has nothing to do with virtual here.<br/>D. It can.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Việc tìm tên dừng ở Car, nơi không có run nào không tham số.<br/>B. Tham số không dùng thì không cần tên.<br/>C. Việc che tên ở đây không liên quan virtual.<br/>D. Được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Item</span> { <span class=\"hljs-type\">int</span> qty; };\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">byValue</span><span class=\"hljs-params\">(Item i)</span> </span>{ i.qty = <span class=\"hljs-number\">99</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">byPointer</span><span class=\"hljs-params\">(Item *i)</span> </span>{ i-&gt;qty = <span class=\"hljs-number\">99</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Item it = {<span class=\"hljs-number\">10</span>};\n    <span class=\"hljs-built_in\">byValue</span>(it);\n    cout &lt;&lt; it.qty &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-built_in\">byPointer</span>(&amp;it);\n    cout &lt;&lt; it.qty;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Item</span> { <span class=\"hljs-type\">int</span> qty; };\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">byValue</span><span class=\"hljs-params\">(Item i)</span> </span>{ i.qty = <span class=\"hljs-number\">99</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">byPointer</span><span class=\"hljs-params\">(Item *i)</span> </span>{ i-&gt;qty = <span class=\"hljs-number\">99</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Item it = {<span class=\"hljs-number\">10</span>};\n    <span class=\"hljs-built_in\">byValue</span>(it);\n    cout &lt;&lt; it.qty &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-built_in\">byPointer</span>(&amp;it);\n    cout &lt;&lt; it.qty;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10 99|||10 99"
            },
            {
              "text": "99 10|||99 10"
            },
            {
              "text": "10 10|||10 10"
            },
            {
              "text": "99 99|||99 99"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. byValue changes a copy, while byPointer changes the original.<br/>B. This reverses the two calls.<br/>C. The second call uses the address.<br/>D. The first call works on a copy.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. byValue đổi bản sao, còn byPointer đổi bản gốc.<br/>B. Cách đó đảo hai lời gọi.<br/>C. Lời gọi hai dùng địa chỉ.<br/>D. Lời gọi đầu làm trên bản sao.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (!(<span class=\"hljs-number\">3</span> &gt; <span class=\"hljs-number\">2</span>) || <span class=\"hljs-number\">4</span> == <span class=\"hljs-number\">4</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (!(<span class=\"hljs-number\">3</span> &gt; <span class=\"hljs-number\">2</span>) || <span class=\"hljs-number\">4</span> == <span class=\"hljs-number\">4</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "true|||true"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The result of || is a bool.<br/>B. !(3 &gt; 2) is false, but 4 == 4 is true, and bool prints as 1.<br/>C. One side of || is true.<br/>D. Without boolalpha, cout prints 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Kết quả của || là bool.<br/>B. !(3 &gt; 2) là sai, còn 4 == 4 là đúng, bool in ra 1.<br/>C. Một vế của || là đúng.<br/>D. Không có boolalpha thì cout in 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[<span class=\"hljs-number\">5</span>] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>};\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">5</span>; i++) s += a[i];\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[<span class=\"hljs-number\">5</span>] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>};\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">5</span>; i++) s += a[i];\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "An unpredictable value|||Một giá trị không đoán trước"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The first two elements are set.<br/>B. That is the array size.<br/>C. The remaining elements of a partly initialised array are 0.<br/>D. Partial initialisation zeroes the rest.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Hai phần tử đầu đã được gán.<br/>B. Đó là cỡ mảng.<br/>C. Các phần tử còn lại của mảng khởi tạo một phần là 0.<br/>D. Khởi tạo một phần sẽ đặt 0 cho phần còn lại.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Box</span> { T v; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Box&lt;<span class=\"hljs-type\">int</span>&gt; a{<span class=\"hljs-number\">7</span>};\n    Box&lt;string&gt; b{<span class=\"hljs-string\">&quot;hi&quot;</span>};\n    cout &lt;&lt; a.v &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b.v;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Box</span> { T v; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Box&lt;<span class=\"hljs-type\">int</span>&gt; a{<span class=\"hljs-number\">7</span>};\n    Box&lt;string&gt; b{<span class=\"hljs-string\">&quot;hi&quot;</span>};\n    cout &lt;&lt; a.v &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b.v;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "hi 7|||hi 7"
            },
            {
              "text": "7 7|||7 7"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "7 hi|||7 hi"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. a holds the int, and it is printed first.<br/>B. b holds a string.<br/>C. A class template is instantiated for each type.<br/>D. Each Box instance works with the type given in the angle brackets.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. a giữ số int và được in trước.<br/>B. b giữ một chuỗi.<br/>C. Lớp template được tạo riêng cho từng kiểu.<br/>D. Mỗi Box dùng kiểu nêu trong ngoặc nhọn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Tag</span> {\n    <span class=\"hljs-type\">int</span> id;\n    <span class=\"hljs-built_in\">Tag</span>(<span class=\"hljs-type\">int</span> i) : <span class=\"hljs-built_in\">id</span>(i) {}\n    ~<span class=\"hljs-built_in\">Tag</span>() { cout &lt;&lt; id; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">Tag <span class=\"hljs-title\">a</span><span class=\"hljs-params\">(<span class=\"hljs-number\">1</span>)</span></span>;\n    <span class=\"hljs-function\">Tag <span class=\"hljs-title\">b</span><span class=\"hljs-params\">(<span class=\"hljs-number\">2</span>)</span></span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Tag</span> {\n    <span class=\"hljs-type\">int</span> id;\n    <span class=\"hljs-built_in\">Tag</span>(<span class=\"hljs-type\">int</span> i) : <span class=\"hljs-built_in\">id</span>(i) {}\n    ~<span class=\"hljs-built_in\">Tag</span>() { cout &lt;&lt; id; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">Tag <span class=\"hljs-title\">a</span><span class=\"hljs-params\">(<span class=\"hljs-number\">1</span>)</span></span>;\n    <span class=\"hljs-function\">Tag <span class=\"hljs-title\">b</span><span class=\"hljs-params\">(<span class=\"hljs-number\">2</span>)</span></span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "21|||21"
            },
            {
              "text": "Nothing is printed|||Không in gì"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Local objects are destroyed in reverse order of creation.<br/>B. Destructors run when main ends.<br/>C. Both are destroyed.<br/>D. The last one built is the first destroyed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Đối tượng cục bộ bị huỷ theo thứ tự ngược với khi tạo.<br/>B. Hàm huỷ chạy khi main kết thúc.<br/>C. Cả hai đều bị huỷ.<br/>D. Cái tạo sau cùng bị huỷ trước.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-keyword\">if</span> (n &gt; <span class=\"hljs-number\">10</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (n % <span class=\"hljs-number\">2</span> == <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-keyword\">if</span> (n &gt; <span class=\"hljs-number\">10</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (n % <span class=\"hljs-number\">2</span> == <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "AC|||AC"
            },
            {
              "text": "B|||B"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "A|||A"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Only one branch of an else-if chain runs.<br/>B. n is not even.<br/>C. n is not above 10, and it is odd, so the final else runs.<br/>D. n is not above 10.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Chỉ một nhánh của chuỗi else-if chạy.<br/>B. n không chẵn.<br/>C. n không lớn hơn 10, lại lẻ nên else cuối chạy.<br/>D. n không lớn hơn 10.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
