// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-PRF193-TS-FE2.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "PRF193"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE2",
      "title": "PRF193 — Practice Final 2 (self-composed)|||PRF193 — Đề luyện cuối kỳ 2 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    {\n        <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">2</span>;\n        cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; x;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    {\n        <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">2</span>;\n        cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; x;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2 2|||2 2"
            },
            {
              "text": "2 1|||2 1"
            },
            {
              "text": "1 1|||1 1"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The assignment changed only the inner x.<br/>B. The inner x hides the outer one until its block ends.<br/>C. Inside the block, the inner x is used.<br/>D. A nested block may reuse a name.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phép gán chỉ đổi x bên trong.<br/>B. x bên trong che x bên ngoài cho tới khi hết khối.<br/>C. Trong khối, x bên trong được dùng.<br/>D. Khối lồng được dùng lại tên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    set&lt;<span class=\"hljs-type\">int</span>&gt; s = {<span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">7</span>, <span class=\"hljs-number\">2</span>};\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    set&lt;<span class=\"hljs-type\">int</span>&gt; s = {<span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">7</span>, <span class=\"hljs-number\">2</span>};\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Duplicates are dropped.<br/>B. 2, 5 and 7 are three different values.<br/>C. Both 2 and 5 are repeated.<br/>D. A set stores each value once.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Giá trị trùng bị bỏ.<br/>B. 2, 5 và 7 là ba giá trị khác nhau.<br/>C. Cả 2 và 5 đều bị lặp.<br/>D. set chỉ lưu mỗi giá trị một lần.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the call f(3) not compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">long</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;long&quot;</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">double</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;double&quot;</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">3</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lời gọi f(3) không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">long</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;long&quot;</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">double</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;double&quot;</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">3</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 is not a valid argument|||3 không phải đối số hợp lệ"
            },
            {
              "text": "f cannot be overloaded|||f không được nạp chồng"
            },
            {
              "text": "int converts equally well to long and double|||int đổi sang long và double đều như nhau"
            },
            {
              "text": "The functions need a return value|||Các hàm cần trả về giá trị"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It is a normal int.<br/>B. Overloading on parameter type is allowed.<br/>C. Neither conversion is better, so the call is ambiguous.<br/>D. void functions are fine.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Nó là một số int bình thường.<br/>B. Được nạp chồng theo kiểu tham số.<br/>C. Không phép đổi nào tốt hơn nên lời gọi bị mơ hồ.<br/>D. Hàm void là hợp lệ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">nextId</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-type\">static</span> <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>; <span class=\"hljs-keyword\">return</span> ++c; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">nextId</span><span class=\"hljs-params\">()</span> </span>{ <span class=\"hljs-type\">static</span> <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>; <span class=\"hljs-keyword\">return</span> ++c; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">nextId</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 2 3|||1 2 3"
            },
            {
              "text": "1 1 1|||1 1 1"
            },
            {
              "text": "3 3 3|||3 3 3"
            },
            {
              "text": "0 1 2|||0 1 2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. A static local keeps its value between calls.<br/>B. That is what a normal local would do.<br/>C. Each call returns the current value.<br/>D. c is increased before it is returned.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Biến cục bộ static giữ giá trị giữa các lần gọi.<br/>B. Đó là kết quả của biến cục bộ thường.<br/>C. Mỗi lần gọi trả về giá trị hiện tại.<br/>D. c được tăng trước khi trả về.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> {\n    <span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n    ~<span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A *p = <span class=\"hljs-keyword\">new</span> A[<span class=\"hljs-number\">3</span>];\n    <span class=\"hljs-keyword\">delete</span>[] p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> {\n    <span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n    ~<span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A *p = <span class=\"hljs-keyword\">new</span> A[<span class=\"hljs-number\">3</span>];\n    <span class=\"hljs-keyword\">delete</span>[] p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "CD|||CD"
            },
            {
              "text": "CCCD|||CCCD"
            },
            {
              "text": "CCCDDD|||CCCDDD"
            },
            {
              "text": "CCC|||CCC"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Three objects are created.<br/>B. delete[] runs a destructor for every element.<br/>C. new[] builds each element and delete[] destroys each one.<br/>D. delete[] runs the destructors.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Có ba đối tượng được tạo.<br/>B. delete[] chạy hàm huỷ cho mọi phần tử.<br/>C. new[] dựng từng phần tử và delete[] huỷ từng phần tử.<br/>D. delete[] chạy các hàm huỷ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>For an int array a, which expression always means the same as a[2]?</p></div><div class=\"ml-vi\"><p>Với mảng int a, biểu thức nào luôn có nghĩa giống a[2]?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "a * 2|||a * 2"
            },
            {
              "text": "*(a + 2)|||*(a + 2)"
            },
            {
              "text": "&amp;a + 2|||&amp;a + 2"
            },
            {
              "text": "(*a) + 2|||(*a) + 2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Pointers cannot be multiplied.<br/>B. Indexing is defined as pointer addition followed by dereference.<br/>C. That moves by whole arrays, not by elements.<br/>D. That adds 2 to the value of a[0].</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Không nhân được con trỏ.<br/>B. Chỉ số được định nghĩa là cộng con trỏ rồi giải tham chiếu.<br/>C. Biểu thức đó dời theo cả mảng, không theo phần tử.<br/>D. Biểu thức đó cộng 2 vào giá trị a[0].</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">char</span>) + <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>) + <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">double</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">char</span>) + <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>) + <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">double</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 1 + 4 + 8 on the machine described in the instructions.<br/>B. Each sizeof gives a size in bytes, not a count of 1.<br/>C. This is not a struct, so no padding applies to a sum.<br/>D. That uses 4 bytes for double.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 1 + 4 + 8 trên loại máy nêu ở phần hướng dẫn.<br/>B. Mỗi sizeof cho kích thước theo byte, không phải đếm 1.<br/>C. Đây không phải struct nên phép cộng không có phần đệm.<br/>D. Cách đó coi double chỉ 4 byte.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">calloc</span>(<span class=\"hljs-number\">4</span>, <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">4</span>; i++) s += p[i];\n    <span class=\"hljs-built_in\">free</span>(p);\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">calloc</span>(<span class=\"hljs-number\">4</span>, <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">4</span>; i++) s += p[i];\n    <span class=\"hljs-built_in\">free</span>(p);\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "An unpredictable value|||Một giá trị không đoán trước"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is the block size in bytes.<br/>B. That is the number of elements.<br/>C. That would be malloc.<br/>D. calloc fills the block with zero bytes.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là cỡ khối tính bằng byte.<br/>B. Đó là số phần tử.<br/>C. Đó là trường hợp malloc.<br/>D. calloc lấp khối nhớ bằng các byte 0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;code&quot;</span>;\n    s[<span class=\"hljs-number\">2</span>] = <span class=\"hljs-string\">&#x27;\\0&#x27;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">strlen</span>(s);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;code&quot;</span>;\n    s[<span class=\"hljs-number\">2</span>] = <span class=\"hljs-string\">&#x27;\\0&#x27;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">strlen</span>(s);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. strlen does not look past the first null.<br/>B. The index of the null equals the length.<br/>C. That is the array size, including the null.<br/>D. strlen stops at the first null character, which is now at index 2.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. strlen không nhìn qua ký tự kết thúc đầu tiên.<br/>B. Chỉ số của ký tự kết thúc bằng độ dài.<br/>C. Đó là cỡ mảng, tính cả ký tự kết thúc.<br/>D. strlen dừng ở ký tự kết thúc đầu tiên, nay nằm ở chỉ số 2.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Safe</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">friend</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">peek</span><span class=\"hljs-params\">(<span class=\"hljs-type\">const</span> Safe &amp;s)</span></span>;\n};\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">peek</span><span class=\"hljs-params\">(<span class=\"hljs-type\">const</span> Safe &amp;s)</span> </span>{ cout &lt;&lt; s.v; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Safe s;\n    <span class=\"hljs-built_in\">peek</span>(s);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Safe</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">friend</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">peek</span><span class=\"hljs-params\">(<span class=\"hljs-type\">const</span> Safe &amp;s)</span></span>;\n};\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">peek</span><span class=\"hljs-params\">(<span class=\"hljs-type\">const</span> Safe &amp;s)</span> </span>{ cout &lt;&lt; s.v; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Safe s;\n    <span class=\"hljs-built_in\">peek</span>(s);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The friend declaration grants access.<br/>B. A friend function may read private members.<br/>C. The constructor sets v to 5.<br/>D. The access is normal.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Khai báo friend cấp quyền truy cập.<br/>B. Hàm friend được đọc thành viên private.<br/>C. Hàm dựng đặt v bằng 5.<br/>D. Truy cập này là bình thường.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">inc</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> &amp;x)</span> </span>{ x++; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-built_in\">inc</span>(n);\n    cout &lt;&lt; n;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">inc</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> &amp;x)</span> </span>{ x++; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-built_in\">inc</span>(n);\n    cout &lt;&lt; n;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. x is a reference, so n itself grows.<br/>B. n is an lvalue, so it binds to int&amp;.<br/>C. That would be pass by value.<br/>D. There is only one increment.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. x là tham chiếu nên chính n tăng lên.<br/>B. n là lvalue nên gắn được vào int&amp;.<br/>C. Đó là kết quả nếu truyền theo giá trị.<br/>D. Chỉ có một lần tăng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">short</span> v[] = {<span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">9</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">8</span>, <span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">6</span>};\n    <span class=\"hljs-type\">short</span> *p = &amp;v[<span class=\"hljs-number\">1</span>], *q = &amp;v[<span class=\"hljs-number\">5</span>];\n    cout &lt;&lt; q - p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">short</span> v[] = {<span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">9</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">8</span>, <span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">6</span>};\n    <span class=\"hljs-type\">short</span> *p = &amp;v[<span class=\"hljs-number\">1</span>], *q = &amp;v[<span class=\"hljs-number\">5</span>];\n    cout &lt;&lt; q - p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "-3|||-3"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the difference of the values.<br/>B. That is the distance in bytes for 2-byte short.<br/>C. Pointer subtraction counts elements, not bytes.<br/>D. Two pointers into one array may be subtracted.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là hiệu hai giá trị.<br/>B. Đó là khoảng cách theo byte, vì short 2 byte.<br/>C. Trừ con trỏ đếm phần tử, không đếm byte.<br/>D. Hai con trỏ trong cùng mảng trừ được cho nhau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> c = <span class=\"hljs-string\">&#x27;b&#x27;</span>;\n    <span class=\"hljs-keyword\">switch</span> (c) {\n        <span class=\"hljs-keyword\">default</span>:  cout &lt;&lt; <span class=\"hljs-string\">&quot;other&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&#x27;b&#x27;</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;one&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> c = <span class=\"hljs-string\">&#x27;b&#x27;</span>;\n    <span class=\"hljs-keyword\">switch</span> (c) {\n        <span class=\"hljs-keyword\">default</span>:  cout &lt;&lt; <span class=\"hljs-string\">&quot;other&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-string\">&#x27;b&#x27;</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;one&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "one|||one"
            },
            {
              "text": "oneother|||oneother"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "other|||other"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The value &#39;b&#39; matches case &#39;b&#39;, and break stops there.<br/>B. The break prevents the fall into the next label.<br/>C. default may appear before other cases.<br/>D. default runs only if no case matches.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Giá trị &#39;b&#39; khớp case &#39;b&#39;, và break dừng ở đó.<br/>B. break ngăn việc rơi xuống nhãn kế tiếp.<br/>C. default có thể đứng trước các case khác.<br/>D. default chỉ chạy khi không case nào khớp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (<span class=\"hljs-number\">1</span> &lt;&lt; <span class=\"hljs-number\">3</span> | <span class=\"hljs-number\">1</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (<span class=\"hljs-number\">1</span> &lt;&lt; <span class=\"hljs-number\">3</span> | <span class=\"hljs-number\">1</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. | 1 sets the lowest bit as well.<br/>B. That is 1 &lt;&lt; 2, and it also leaves out | 1.<br/>C. That leaves out the shift: 3 | 1 is 3.<br/>D. 1 &lt;&lt; 3 is 8, and 8 | 1 is 9.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. | 1 bật thêm bit thấp nhất.<br/>B. Đó là 1 &lt;&lt; 2, lại còn bỏ phần | 1.<br/>C. Cách đó bỏ phép dịch: 3 | 1 bằng 3.<br/>D. 1 &lt;&lt; 3 là 8, và 8 | 1 là 9.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">malloc</span>(<span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    p[<span class=\"hljs-number\">0</span>] = <span class=\"hljs-number\">7</span>;\n    p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">realloc</span>(p, <span class=\"hljs-number\">2</span> * <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    p[<span class=\"hljs-number\">1</span>] = <span class=\"hljs-number\">9</span>;\n    cout &lt;&lt; p[<span class=\"hljs-number\">0</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; p[<span class=\"hljs-number\">1</span>];\n    <span class=\"hljs-built_in\">free</span>(p);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">malloc</span>(<span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    p[<span class=\"hljs-number\">0</span>] = <span class=\"hljs-number\">7</span>;\n    p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">realloc</span>(p, <span class=\"hljs-number\">2</span> * <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    p[<span class=\"hljs-number\">1</span>] = <span class=\"hljs-number\">9</span>;\n    cout &lt;&lt; p[<span class=\"hljs-number\">0</span>] &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; p[<span class=\"hljs-number\">1</span>];\n    <span class=\"hljs-built_in\">free</span>(p);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0 9|||0 9"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            },
            {
              "text": "7 9|||7 9"
            },
            {
              "text": "7 0|||7 0"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The old value is preserved.<br/>B. p is updated to the returned pointer.<br/>C. realloc keeps the old contents up to the smaller size.<br/>D. p[1] was just assigned.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Giá trị cũ được giữ.<br/>B. p được cập nhật theo con trỏ trả về.<br/>C. realloc giữ nội dung cũ trong phạm vi cỡ nhỏ hơn.<br/>D. p[1] vừa được gán.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;t.txt&quot;</span>)</span></span>;\n    out &lt;&lt; <span class=\"hljs-string\">&quot;ABCDE&quot;</span>;\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;t.txt&quot;</span>)</span></span>;\n    in.<span class=\"hljs-built_in\">seekg</span>(<span class=\"hljs-number\">3</span>);\n    <span class=\"hljs-type\">char</span> c;\n    in.<span class=\"hljs-built_in\">get</span>(c);\n    cout &lt;&lt; c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;t.txt&quot;</span>)</span></span>;\n    out &lt;&lt; <span class=\"hljs-string\">&quot;ABCDE&quot;</span>;\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;t.txt&quot;</span>)</span></span>;\n    in.<span class=\"hljs-built_in\">seekg</span>(<span class=\"hljs-number\">3</span>);\n    <span class=\"hljs-type\">char</span> c;\n    in.<span class=\"hljs-built_in\">get</span>(c);\n    cout &lt;&lt; c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "C|||C"
            },
            {
              "text": "D|||D"
            },
            {
              "text": "E|||E"
            },
            {
              "text": "A|||A"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is position 2.<br/>B. seekg(3) moves to byte 3 counting from 0, which is the fourth letter.<br/>C. That is position 4.<br/>D. That is position 0.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là vị trí 2.<br/>B. seekg(3) dời tới byte 3 tính từ 0, tức chữ thứ tư.<br/>C. Đó là vị trí 4.<br/>D. Đó là vị trí 0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;Nguyen Van A&quot;</span>)</span></span>;\n    string s;\n    ss &gt;&gt; s;\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;Nguyen Van A&quot;</span>)</span></span>;\n    string s;\n    ss &gt;&gt; s;\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Nguyen|||Nguyen"
            },
            {
              "text": "Nguyen Van A|||Nguyen Van A"
            },
            {
              "text": "A|||A"
            },
            {
              "text": "Van|||Van"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. &gt;&gt; stops at whitespace.<br/>B. That needs getline.<br/>C. Reading starts at the beginning.<br/>D. That would be the second read.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. &gt;&gt; dừng ở khoảng trắng.<br/>B. Muốn vậy cần getline.<br/>C. Việc đọc bắt đầu từ đầu.<br/>D. Đó là lần đọc thứ hai.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_shared</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    {\n        <span class=\"hljs-keyword\">auto</span> q = p;\n        cout &lt;&lt; p.<span class=\"hljs-built_in\">use_count</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; p.<span class=\"hljs-built_in\">use_count</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_shared</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    {\n        <span class=\"hljs-keyword\">auto</span> q = p;\n        cout &lt;&lt; p.<span class=\"hljs-built_in\">use_count</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; p.<span class=\"hljs-built_in\">use_count</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2 2|||2 2"
            },
            {
              "text": "2 1|||2 1"
            },
            {
              "text": "1 0|||1 0"
            },
            {
              "text": "1 1|||1 1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. q is destroyed at the end of the block.<br/>B. A copy adds an owner; when q leaves its block, the count drops back.<br/>C. p still owns the int.<br/>D. q shares ownership inside the block.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. q bị huỷ ở cuối khối.<br/>B. Sao chép thêm một chủ sở hữu; khi q ra khỏi khối, số đếm giảm lại.<br/>C. p vẫn sở hữu số int đó.<br/>D. q cùng sở hữu trong khối.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x[])</span> </span>{ cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(x); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[<span class=\"hljs-number\">10</span>];\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(a) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-built_in\">show</span>(a);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x[])</span> </span>{ cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(x); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[<span class=\"hljs-number\">10</span>];\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(a) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-built_in\">show</span>(a);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8 8|||8 8"
            },
            {
              "text": "40 40|||40 40"
            },
            {
              "text": "10 10|||10 10"
            },
            {
              "text": "40 8|||40 8"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. sizeof sees the real array in main.<br/>B. An array parameter decays to a pointer.<br/>C. sizeof counts bytes, not elements.<br/>D. In main it is a real array; as a parameter it is just a pointer.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. sizeof thấy mảng thật ở main.<br/>B. Tham số mảng phân rã thành con trỏ.<br/>C. sizeof đếm byte, không đếm phần tử.<br/>D. Trong main nó là mảng thật; ở tham số nó chỉ là con trỏ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">8</span>, c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (<span class=\"hljs-literal\">true</span>) {\n        <span class=\"hljs-keyword\">if</span> (n == <span class=\"hljs-number\">1</span>) <span class=\"hljs-keyword\">break</span>;\n        n /= <span class=\"hljs-number\">2</span>;\n        c++;\n    }\n    cout &lt;&lt; c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">8</span>, c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (<span class=\"hljs-literal\">true</span>) {\n        <span class=\"hljs-keyword\">if</span> (n == <span class=\"hljs-number\">1</span>) <span class=\"hljs-keyword\">break</span>;\n        n /= <span class=\"hljs-number\">2</span>;\n        c++;\n    }\n    cout &lt;&lt; c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the starting value.<br/>B. That is the final n.<br/>C. The loop counts how many times n can be divided: 8, 4, 2, then it stops at 1.<br/>D. The loop ends when n reaches 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là giá trị đầu.<br/>B. Đó là giá trị cuối của n.<br/>C. Vòng lặp đếm số lần chia được n: 8, 4, 2, rồi dừng ở 1.<br/>D. Vòng lặp kết thúc khi n bằng 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this class not compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Box</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> <span class=\"hljs-type\">const</span> </span>{ v++; <span class=\"hljs-keyword\">return</span> v; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Box b;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lớp này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Box</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">get</span><span class=\"hljs-params\">()</span> <span class=\"hljs-type\">const</span> </span>{ v++; <span class=\"hljs-keyword\">return</span> v; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Box b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "const must come before the name|||const phải đứng trước tên hàm"
            },
            {
              "text": "A const member function cannot change a data member|||Hàm thành viên const không được sửa thành viên dữ liệu"
            },
            {
              "text": "A class cannot have an int member|||Lớp không có được thành viên int"
            },
            {
              "text": "get must not return int|||get không được trả về int"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. const after the parameter list is the correct form for members.<br/>B. const promises not to change the object.<br/>C. It can.<br/>D. Returning int is fine.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. const sau danh sách tham số là cách viết đúng cho hàm thành viên.<br/>B. const cam kết không đổi đối tượng.<br/>C. Được.<br/>D. Trả về int là hợp lệ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Derived d;\n    Base b = d;\n    b.<span class=\"hljs-built_in\">f</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Derived d;\n    Base b = d;\n    b.<span class=\"hljs-built_in\">f</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "B|||B"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "D|||D"
            },
            {
              "text": "BD|||BD"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Copying into a Base object slices off the Derived part, so Base::f runs.<br/>B. Copying from a derived object is allowed.<br/>C. That needs a pointer or reference to keep the real type.<br/>D. Only one function runs.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Sao chép vào đối tượng Base cắt mất phần Derived nên Base::f chạy.<br/>B. Sao chép từ đối tượng dẫn xuất là hợp lệ.<br/>C. Muốn vậy cần con trỏ hoặc tham chiếu để giữ kiểu thật.<br/>D. Chỉ một hàm chạy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">10</span>;\n    a += a * <span class=\"hljs-number\">2</span>;\n    a %= <span class=\"hljs-number\">7</span>;\n    cout &lt;&lt; a;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">10</span>;\n    a += a * <span class=\"hljs-number\">2</span>;\n    a %= <span class=\"hljs-number\">7</span>;\n    cout &lt;&lt; a;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "30|||30"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That treats a += a * 2 as a = a * 2, giving 20 % 7.<br/>B. The second statement changes a.<br/>C. a += a * 2 gives 30, and 30 % 7 = 2.<br/>D. That is 10 % 7, which ignores the first statement.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Cách đó coi a += a * 2 như a = a * 2, thành 20 % 7.<br/>B. Lệnh thứ hai làm đổi a.<br/>C. a += a * 2 ra 30, và 30 % 7 = 2.<br/>D. Đó là 10 % 7, bỏ qua lệnh đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> { <span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">B</span> { <span class=\"hljs-built_in\">B</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Pair</span> {\n    A a;\n    B b;\n    <span class=\"hljs-built_in\">Pair</span>() : <span class=\"hljs-built_in\">b</span>(), <span class=\"hljs-built_in\">a</span>() {}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Pair p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> { <span class=\"hljs-built_in\">A</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">B</span> { <span class=\"hljs-built_in\">B</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Pair</span> {\n    A a;\n    B b;\n    <span class=\"hljs-built_in\">Pair</span>() : <span class=\"hljs-built_in\">b</span>(), <span class=\"hljs-built_in\">a</span>() {}\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Pair p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "BA|||BA"
            },
            {
              "text": "A|||A"
            },
            {
              "text": "B|||B"
            },
            {
              "text": "AB|||AB"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That follows the initialiser list, which does not decide the order.<br/>B. Both members are built.<br/>C. Both members are built.<br/>D. Members are built in the order they are declared, not the order in the list.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách đó theo danh sách khởi tạo, nhưng danh sách không quyết định thứ tự.<br/>B. Cả hai thành viên đều được dựng.<br/>C. Cả hai thành viên đều được dựng.<br/>D. Thành viên được dựng theo thứ tự khai báo, không theo thứ tự trong danh sách.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">5</span>;\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;no error &quot;</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">int</span> e) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;caught &quot;</span> &lt;&lt; e &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; <span class=\"hljs-string\">&quot;end&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-number\">5</span>;\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;no error &quot;</span>;\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">int</span> e) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;caught &quot;</span> &lt;&lt; e &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    }\n    cout &lt;&lt; <span class=\"hljs-string\">&quot;end&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The program terminates|||Chương trình kết thúc"
            },
            {
              "text": "no error end|||no error end"
            },
            {
              "text": "caught 5 end|||caught 5 end"
            },
            {
              "text": "caught 5|||caught 5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The exception is caught.<br/>B. The line after throw never runs.<br/>C. The throw jumps to the matching catch, and execution goes on after it.<br/>D. After the catch the program continues.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Ngoại lệ đã được bắt.<br/>B. Dòng sau throw không chạy.<br/>C. throw nhảy tới catch khớp, rồi chạy tiếp sau khối catch.<br/>D. Sau catch chương trình chạy tiếp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">1</span>, b = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">if</span> (a)\n        <span class=\"hljs-keyword\">if</span> (b)\n            cout &lt;&lt; <span class=\"hljs-string\">&quot;X&quot;</span>;\n        <span class=\"hljs-keyword\">else</span>\n            cout &lt;&lt; <span class=\"hljs-string\">&quot;Y&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">1</span>, b = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">if</span> (a)\n        <span class=\"hljs-keyword\">if</span> (b)\n            cout &lt;&lt; <span class=\"hljs-string\">&quot;X&quot;</span>;\n        <span class=\"hljs-keyword\">else</span>\n            cout &lt;&lt; <span class=\"hljs-string\">&quot;Y&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Y|||Y"
            },
            {
              "text": "X|||X"
            },
            {
              "text": "XY|||XY"
            },
            {
              "text": "Nothing is printed|||Không in gì"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. else belongs to the nearest if, so with a = 1 and b = 0 the inner else runs.<br/>B. b is 0, so the inner test fails.<br/>C. Only one branch runs.<br/>D. The inner else is reached.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. else thuộc về if gần nhất nên với a = 1, b = 0 thì else bên trong chạy.<br/>B. b bằng 0 nên phép kiểm trong sai.<br/>C. Chỉ một nhánh chạy.<br/>D. else bên trong được chạy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">smaller</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &lt; b ? a : b; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">larger</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">int</span> (*op)(<span class=\"hljs-type\">int</span>, <span class=\"hljs-type\">int</span>) = smaller;\n    op = larger;\n    cout &lt;&lt; <span class=\"hljs-built_in\">op</span>(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">smaller</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &lt; b ? a : b; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">larger</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">int</span> (*op)(<span class=\"hljs-type\">int</span>, <span class=\"hljs-type\">int</span>) = smaller;\n    op = larger;\n    cout &lt;&lt; <span class=\"hljs-built_in\">op</span>(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the result of smaller.<br/>B. op now points at larger.<br/>C. A function name converts to a pointer.<br/>D. Neither function adds.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là kết quả của smaller.<br/>B. op giờ trỏ tới larger.<br/>C. Tên hàm đổi được thành con trỏ.<br/>D. Không hàm nào cộng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-built_in\">runtime_error</span>(<span class=\"hljs-string\">&quot;bad value&quot;</span>);\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> runtime_error &amp;e) {\n        cout &lt;&lt; e.<span class=\"hljs-built_in\">what</span>();\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> exception &amp;e) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;other&quot;</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">try</span> {\n        <span class=\"hljs-keyword\">throw</span> <span class=\"hljs-built_in\">runtime_error</span>(<span class=\"hljs-string\">&quot;bad value&quot;</span>);\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> runtime_error &amp;e) {\n        cout &lt;&lt; e.<span class=\"hljs-built_in\">what</span>();\n    } <span class=\"hljs-built_in\">catch</span> (<span class=\"hljs-type\">const</span> exception &amp;e) {\n        cout &lt;&lt; <span class=\"hljs-string\">&quot;other&quot;</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "other|||other"
            },
            {
              "text": "runtime_error|||runtime_error"
            },
            {
              "text": "bad value other|||bad value other"
            },
            {
              "text": "bad value|||bad value"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The first matching handler wins.<br/>B. what() gives the message, not the type name.<br/>C. Only one handler runs.<br/>D. what() returns the message, and the runtime_error handler is first and matches.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Khối bắt khớp đầu tiên được chọn.<br/>B. what() cho thông báo, không cho tên kiểu.<br/>C. Chỉ một khối bắt chạy.<br/>D. what() trả về thông báo, và khối bắt runtime_error đứng trước và khớp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the bug in this code?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">int</span> *p = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">int</span>(<span class=\"hljs-number\">1</span>);\n<span class=\"hljs-type\">int</span> *q = p;\n<span class=\"hljs-keyword\">delete</span> p;\n<span class=\"hljs-keyword\">delete</span> q;</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này có lỗi gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">int</span> *p = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">int</span>(<span class=\"hljs-number\">1</span>);\n<span class=\"hljs-type\">int</span> *q = p;\n<span class=\"hljs-keyword\">delete</span> p;\n<span class=\"hljs-keyword\">delete</span> q;</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "q is a new block|||q là một khối mới"
            },
            {
              "text": "new cannot take a value|||new không nhận giá trị được"
            },
            {
              "text": "The block is leaked|||Khối bị rò rỉ"
            },
            {
              "text": "The same block is deleted twice|||Cùng một khối bị delete hai lần"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. q only copies the address.<br/>B. new int(1) is valid.<br/>C. It is freed, and too many times.<br/>D. q and p hold the same address, and a double delete is undefined behaviour.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. q chỉ sao chép địa chỉ.<br/>B. new int(1) là hợp lệ.<br/>C. Khối đã được giải phóng, mà còn quá nhiều lần.<br/>D. q và p giữ cùng một địa chỉ, delete hai lần là hành vi không xác định.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">typedef</span> <span class=\"hljs-keyword\">struct</span> {\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *name;\n    <span class=\"hljs-type\">int</span> age;\n} Person;\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Person a = {<span class=\"hljs-string\">&quot;Ha&quot;</span>, <span class=\"hljs-number\">19</span>};\n    Person *p = &amp;a;\n    p-&gt;age++;\n    cout &lt;&lt; p-&gt;name &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a.age;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">typedef</span> <span class=\"hljs-keyword\">struct</span> {\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *name;\n    <span class=\"hljs-type\">int</span> age;\n} Person;\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Person a = {<span class=\"hljs-string\">&quot;Ha&quot;</span>, <span class=\"hljs-number\">19</span>};\n    Person *p = &amp;a;\n    p-&gt;age++;\n    cout &lt;&lt; p-&gt;name &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; a.age;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Ha 20|||Ha 20"
            },
            {
              "text": "Lan 20|||Lan 20"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "Ha 19|||Ha 19"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. p-&gt;age is the same as (*p).age.<br/>B. The name was never changed.<br/>C. typedef struct is valid in C++.<br/>D. The value was changed through p.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. p-&gt;age giống (*p).age.<br/>B. Tên không hề bị đổi.<br/>C. typedef struct hợp lệ trong C++.<br/>D. Giá trị đã được đổi qua p.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">setw</span>(<span class=\"hljs-number\">5</span>) &lt;&lt; <span class=\"hljs-built_in\">setfill</span>(<span class=\"hljs-string\">&#x27;0&#x27;</span>) &lt;&lt; <span class=\"hljs-number\">42</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">setw</span>(<span class=\"hljs-number\">5</span>) &lt;&lt; <span class=\"hljs-built_in\">setfill</span>(<span class=\"hljs-string\">&#x27;0&#x27;</span>) &lt;&lt; <span class=\"hljs-number\">42</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "42|||42"
            },
            {
              "text": "00042|||00042"
            },
            {
              "text": "42000|||42000"
            },
            {
              "text": "000042|||000042"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. setw and setfill change the output.<br/>B. The width is 5, filled with zeros on the left.<br/>C. Output is right-aligned by default.<br/>D. The total width is 5, not 5 extra characters.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. setw và setfill làm đổi kết quả in.<br/>B. Độ rộng 5, lấp số 0 bên trái.<br/>C. Mặc định căn phải.<br/>D. Tổng độ rộng là 5, không phải thêm 5 ký tự.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = (<span class=\"hljs-type\">int</span>)<span class=\"hljs-number\">3.99</span>;\n    <span class=\"hljs-type\">char</span> c = <span class=\"hljs-string\">&#x27;A&#x27;</span> + <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = (<span class=\"hljs-type\">int</span>)<span class=\"hljs-number\">3.99</span>;\n    <span class=\"hljs-type\">char</span> c = <span class=\"hljs-string\">&#x27;A&#x27;</span> + <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3.99 C|||3.99 C"
            },
            {
              "text": "3 67|||3 67"
            },
            {
              "text": "3 C|||3 C"
            },
            {
              "text": "4 C|||4 C"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. x is an int.<br/>B. c is a char, so cout prints a letter.<br/>C. The cast cuts off the fraction, and &#39;A&#39; + 2 is &#39;C&#39; when stored in a char.<br/>D. The cast truncates; it does not round.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. x là int.<br/>B. c là char nên cout in chữ cái.<br/>C. Phép ép kiểu cắt phần lẻ, và &#39;A&#39; + 2 là &#39;C&#39; khi lưu vào char.<br/>D. Ép kiểu cắt bỏ, không làm tròn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-function\">T <span class=\"hljs-title\">maxOf</span><span class=\"hljs-params\">(T a, T b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">maxOf</span>&lt;<span class=\"hljs-type\">double</span>&gt;(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4.5</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-function\">T <span class=\"hljs-title\">maxOf</span><span class=\"hljs-params\">(T a, T b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">maxOf</span>&lt;<span class=\"hljs-type\">double</span>&gt;(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4.5</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "4.5|||4.5"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Explicit T removes the deduction conflict.<br/>B. Giving T explicitly makes 3 convert to 3.0.<br/>C. T is double, so nothing is cut off.<br/>D. 4.5 is the larger value.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Chỉ rõ T thì hết xung đột suy kiểu.<br/>B. Chỉ rõ T thì 3 được đổi thành 3.0.<br/>C. T là double nên không bị cắt.<br/>D. 4.5 là giá trị lớn hơn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">75</span>;\n    cout &lt;&lt; (n &gt;= <span class=\"hljs-number\">80</span> ? <span class=\"hljs-string\">&quot;A&quot;</span> : n &gt;= <span class=\"hljs-number\">50</span> ? <span class=\"hljs-string\">&quot;B&quot;</span> : <span class=\"hljs-string\">&quot;C&quot;</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">75</span>;\n    cout &lt;&lt; (n &gt;= <span class=\"hljs-number\">80</span> ? <span class=\"hljs-string\">&quot;A&quot;</span> : n &gt;= <span class=\"hljs-number\">50</span> ? <span class=\"hljs-string\">&quot;B&quot;</span> : <span class=\"hljs-string\">&quot;C&quot;</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A|||A"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "B|||B"
            },
            {
              "text": "AB|||AB"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The first test fails.<br/>B. The second test passes.<br/>C. n is 75: not at least 80, but at least 50.<br/>D. The ternary picks one result.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Phép kiểm đầu sai.<br/>B. Phép kiểm thứ hai đúng.<br/>C. n là 75: không đạt 80 nhưng đạt 50.<br/>D. Toán tử ba ngôi chỉ chọn một kết quả.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum class</span> <span class=\"hljs-title class_\">Color</span> { Red, Green, Blue };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = Color::Red;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum class</span> <span class=\"hljs-title class_\">Color</span> { Red, Green, Blue };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = Color::Red;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "An enum class value does not convert to int by itself|||Giá trị enum class không tự đổi sang int"
            },
            {
              "text": "An enum class cannot have three values|||enum class không có được ba giá trị"
            },
            {
              "text": "Color:: is not valid syntax|||Color:: không đúng cú pháp"
            },
            {
              "text": "Red must be written in lowercase|||Red phải viết thường"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It needs static_cast&lt;int&gt;(Color::Red).<br/>B. There is no such limit.<br/>C. A scoped enum requires exactly that.<br/>D. Case is free here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Cần static_cast&lt;int&gt;(Color::Red).<br/>B. Không có giới hạn đó.<br/>C. Enum có phạm vi đòi đúng cú pháp đó.<br/>D. Chữ hoa thường ở đây là tuỳ ý.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Rec</span> { <span class=\"hljs-type\">int</span> id; <span class=\"hljs-type\">double</span> score; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Rec a = {<span class=\"hljs-number\">7</span>, <span class=\"hljs-number\">2.5</span>}, b;\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;r.bin&quot;</span>, ios::binary)</span></span>;\n    out.<span class=\"hljs-built_in\">write</span>(<span class=\"hljs-built_in\">reinterpret_cast</span>&lt;<span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *&gt;(&amp;a), <span class=\"hljs-built_in\">sizeof</span>(a));\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;r.bin&quot;</span>, ios::binary)</span></span>;\n    in.<span class=\"hljs-built_in\">read</span>(<span class=\"hljs-built_in\">reinterpret_cast</span>&lt;<span class=\"hljs-type\">char</span> *&gt;(&amp;b), <span class=\"hljs-built_in\">sizeof</span>(b));\n    cout &lt;&lt; b.id &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b.score;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Rec</span> { <span class=\"hljs-type\">int</span> id; <span class=\"hljs-type\">double</span> score; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Rec a = {<span class=\"hljs-number\">7</span>, <span class=\"hljs-number\">2.5</span>}, b;\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;r.bin&quot;</span>, ios::binary)</span></span>;\n    out.<span class=\"hljs-built_in\">write</span>(<span class=\"hljs-built_in\">reinterpret_cast</span>&lt;<span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *&gt;(&amp;a), <span class=\"hljs-built_in\">sizeof</span>(a));\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;r.bin&quot;</span>, ios::binary)</span></span>;\n    in.<span class=\"hljs-built_in\">read</span>(<span class=\"hljs-built_in\">reinterpret_cast</span>&lt;<span class=\"hljs-type\">char</span> *&gt;(&amp;b), <span class=\"hljs-built_in\">sizeof</span>(b));\n    cout &lt;&lt; b.id &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b.score;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0 0|||0 0"
            },
            {
              "text": "7 2|||7 2"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "7 2.5|||7 2.5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The file has the data.<br/>B. The double is stored whole.<br/>C. reinterpret_cast is valid here.<br/>D. The bytes written are read back into a struct of the same layout.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tệp đã có dữ liệu.<br/>B. Số double được lưu nguyên vẹn.<br/>C. reinterpret_cast hợp lệ ở đây.<br/>D. Các byte đã ghi được đọc lại vào struct cùng cấu trúc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Class Text owns a char* from new[] and frees it in the destructor, but has no copy constructor. What goes wrong with Text b = a;?</p></div><div class=\"ml-vi\"><p>Lớp Text sở hữu một char* cấp bằng new[] và giải phóng trong hàm huỷ, nhưng không có hàm dựng sao chép. Text b = a; gây lỗi gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Both objects end up freeing one block|||Hai đối tượng cùng giải phóng một khối"
            },
            {
              "text": "a is destroyed at once|||a bị huỷ ngay"
            },
            {
              "text": "b gets its own copy of the text|||b có bản sao chuỗi riêng"
            },
            {
              "text": "The code does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The default copy is shallow, so it copies the pointer only.<br/>B. Copying does not destroy the source.<br/>C. That would need a deep copy.<br/>D. A default copy constructor is generated.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Bản sao mặc định là nông, chỉ chép con trỏ.<br/>B. Sao chép không huỷ đối tượng nguồn.<br/>C. Muốn vậy cần sao chép sâu.<br/>D. Trình biên dịch tự tạo hàm dựng sao chép.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i, j;\n    <span class=\"hljs-keyword\">for</span> (i = <span class=\"hljs-number\">0</span>, j = <span class=\"hljs-number\">5</span>; i &lt; j; i++, j--) {\n    }\n    cout &lt;&lt; i &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; j;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i, j;\n    <span class=\"hljs-keyword\">for</span> (i = <span class=\"hljs-number\">0</span>, j = <span class=\"hljs-number\">5</span>; i &lt; j; i++, j--) {\n    }\n    cout &lt;&lt; i &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; j;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "4 1|||4 1"
            },
            {
              "text": "5 0|||5 0"
            },
            {
              "text": "3 2|||3 2"
            },
            {
              "text": "2 3|||2 3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The loop has already stopped by then.<br/>B. The two values meet near the middle.<br/>C. i and j meet: (0,5), (1,4), (2,3), then (3,2) stops the loop.<br/>D. The loop runs once more while i &lt; j is true.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Lúc đó vòng lặp đã dừng.<br/>B. Hai giá trị gặp nhau ở giữa.<br/>C. i và j gặp nhau: (0,5), (1,4), (2,3), rồi (3,2) dừng vòng lặp.<br/>D. Vòng lặp chạy thêm một lần khi i &lt; j còn đúng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;abc&quot;</span>;\n    s += <span class=\"hljs-string\">&quot;de&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;abc&quot;</span>;\n    s += <span class=\"hljs-string\">&quot;de&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">size</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the length of de.<br/>B. abc plus de has five characters.<br/>C. += changes s.<br/>D. size() does not count a terminator.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là độ dài của de.<br/>B. abc thêm de thành năm ký tự.<br/>C. += làm đổi s.<br/>D. size() không tính ký tự kết thúc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which line fails to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Parent</span> {\n<span class=\"hljs-keyword\">protected</span>:\n    <span class=\"hljs-type\">int</span> money = <span class=\"hljs-number\">0</span>;\n};\n<span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Child</span> : <span class=\"hljs-keyword\">public</span> Parent {\n<span class=\"hljs-keyword\">public</span>:\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; money; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Child c;          <span class=\"hljs-comment\">// line 1</span>\n    c.money = <span class=\"hljs-number\">5</span>;      <span class=\"hljs-comment\">// line 2</span>\n    c.<span class=\"hljs-built_in\">show</span>();         <span class=\"hljs-comment\">// line 3</span>\n}</code></pre></div><div class=\"ml-vi\"><p>Dòng nào không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Parent</span> {\n<span class=\"hljs-keyword\">protected</span>:\n    <span class=\"hljs-type\">int</span> money = <span class=\"hljs-number\">0</span>;\n};\n<span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Child</span> : <span class=\"hljs-keyword\">public</span> Parent {\n<span class=\"hljs-keyword\">public</span>:\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; money; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Child c;          <span class=\"hljs-comment\">// line 1</span>\n    c.money = <span class=\"hljs-number\">5</span>;      <span class=\"hljs-comment\">// line 2</span>\n    c.<span class=\"hljs-built_in\">show</span>();         <span class=\"hljs-comment\">// line 3</span>\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Line 1|||Dòng 1"
            },
            {
              "text": "None, it compiles|||Không dòng nào, đoạn code biên dịch được"
            },
            {
              "text": "Line 3|||Dòng 3"
            },
            {
              "text": "Line 2|||Dòng 2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Creating a Child object is fine.<br/>B. Line 2 reaches a protected member from main.<br/>C. show is public.<br/>D. Protected members are visible in derived classes, not to outside code.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tạo đối tượng Child là hợp lệ.<br/>B. Dòng 2 truy cập thành viên protected từ main.<br/>C. show là public.<br/>D. Thành viên protected thấy được ở lớp dẫn xuất, không thấy được từ bên ngoài.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Shape</span> { <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>= <span class=\"hljs-number\">0</span>; };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Rect</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">3</span> * <span class=\"hljs-number\">4</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Circle</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">3.14</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Rect a;\n    Circle b;\n    Shape *s[<span class=\"hljs-number\">2</span>] = {&amp;a, &amp;b};\n    cout &lt;&lt; s[<span class=\"hljs-number\">0</span>]-&gt;<span class=\"hljs-built_in\">area</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; s[<span class=\"hljs-number\">1</span>]-&gt;<span class=\"hljs-built_in\">area</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Shape</span> { <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>= <span class=\"hljs-number\">0</span>; };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Rect</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">3</span> * <span class=\"hljs-number\">4</span>; } };\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Circle</span> : Shape { <span class=\"hljs-function\"><span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ <span class=\"hljs-keyword\">return</span> <span class=\"hljs-number\">3.14</span>; } };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Rect a;\n    Circle b;\n    Shape *s[<span class=\"hljs-number\">2</span>] = {&amp;a, &amp;b};\n    cout &lt;&lt; s[<span class=\"hljs-number\">0</span>]-&gt;<span class=\"hljs-built_in\">area</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; s[<span class=\"hljs-number\">1</span>]-&gt;<span class=\"hljs-built_in\">area</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "12 12|||12 12"
            },
            {
              "text": "12 3.14|||12 3.14"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "0 0|||0 0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The second object is a Circle.<br/>B. Each pointer calls the area of its real object.<br/>C. Base pointers may hold derived objects.<br/>D. Both classes override area.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đối tượng thứ hai là Circle.<br/>B. Mỗi con trỏ gọi area của đối tượng thật của nó.<br/>C. Con trỏ lớp cha giữ được đối tượng lớp con.<br/>D. Cả hai lớp đều ghi đè area.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">S</span> { <span class=\"hljs-type\">char</span> c; <span class=\"hljs-type\">int</span> i; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(S);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">S</span> { <span class=\"hljs-type\">char</span> c; <span class=\"hljs-type\">int</span> i; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(S);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Only double or pointer members would need 8-byte alignment.<br/>B. Both members need room.<br/>C. int needs 4-byte alignment, so 3 padding bytes follow the char.<br/>D. That ignores padding.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Chỉ double hoặc con trỏ mới cần căn lề 8 byte.<br/>B. Cả hai thành phần đều cần chỗ.<br/>C. int cần căn lề 4 byte nên có 3 byte đệm sau char.<br/>D. Cách đó bỏ qua phần đệm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> d[<span class=\"hljs-number\">6</span>] = <span class=\"hljs-string\">&quot;xxxxx&quot;</span>;\n    <span class=\"hljs-built_in\">strncpy</span>(d, <span class=\"hljs-string\">&quot;abc&quot;</span>, <span class=\"hljs-number\">2</span>);\n    cout &lt;&lt; d;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> d[<span class=\"hljs-number\">6</span>] = <span class=\"hljs-string\">&quot;xxxxx&quot;</span>;\n    <span class=\"hljs-built_in\">strncpy</span>(d, <span class=\"hljs-string\">&quot;abc&quot;</span>, <span class=\"hljs-number\">2</span>);\n    cout &lt;&lt; d;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "xxxab|||xxxab"
            },
            {
              "text": "ab|||ab"
            },
            {
              "text": "abc|||abc"
            },
            {
              "text": "abxxx|||abxxx"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Copying starts at the first position.<br/>B. No terminator is written after the two characters.<br/>C. The count limits it to two characters.<br/>D. strncpy copies only 2 characters here and adds no null.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Việc chép bắt đầu từ vị trí đầu.<br/>B. Không có ký tự kết thúc được ghi sau hai ký tự đó.<br/>C. Số đếm giới hạn ở hai ký tự.<br/>D. strncpy chỉ chép 2 ký tự và không thêm ký tự kết thúc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[] = <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-type\">char</span> b[] = <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-keyword\">if</span> ((<span class=\"hljs-type\">void</span> *)a == (<span class=\"hljs-type\">void</span> *)b) cout &lt;&lt; <span class=\"hljs-string\">&quot;same&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;different&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[] = <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-type\">char</span> b[] = <span class=\"hljs-string\">&quot;cat&quot;</span>;\n    <span class=\"hljs-keyword\">if</span> ((<span class=\"hljs-type\">void</span> *)a == (<span class=\"hljs-type\">void</span> *)b) cout &lt;&lt; <span class=\"hljs-string\">&quot;same&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;different&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "different|||different"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            },
            {
              "text": "same|||same"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. == compares the arrays&#39; addresses here, not their text.<br/>B. Comparing addresses is safe.<br/>C. Use strcmp to compare the text of char arrays.<br/>D. Arrays decay to pointers, and comparing them compiles.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Ở đây == so địa chỉ của hai mảng, không so nội dung.<br/>B. So địa chỉ là an toàn.<br/>C. Muốn so nội dung mảng char phải dùng strcmp.<br/>D. Mảng phân rã thành con trỏ và so sánh vẫn biên dịch được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = <span class=\"hljs-literal\">nullptr</span>;\n    <span class=\"hljs-keyword\">if</span> (p &amp;&amp; *p &gt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;big&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;safe&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> *p = <span class=\"hljs-literal\">nullptr</span>;\n    <span class=\"hljs-keyword\">if</span> (p &amp;&amp; *p &gt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;big&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;safe&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "safe|||safe"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            },
            {
              "text": "big|||big"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. p is null, so &amp;&amp; stops before *p is read.<br/>B. *p is never evaluated.<br/>C. The left side is false.<br/>D. A pointer can be used as a condition.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. p là null nên &amp;&amp; dừng trước khi đọc *p.<br/>B. *p không được tính.<br/>C. Vế trái sai.<br/>D. Con trỏ dùng làm điều kiện được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">swapBoth</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> *x, <span class=\"hljs-type\">int</span> *y)</span> </span>{ <span class=\"hljs-type\">int</span> t = *x; *x = *y; *y = t; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">3</span>, b = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-built_in\">swapBoth</span>(&amp;a, &amp;b);\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">swapBoth</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> *x, <span class=\"hljs-type\">int</span> *y)</span> </span>{ <span class=\"hljs-type\">int</span> t = *x; *x = *y; *y = t; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">3</span>, b = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-built_in\">swapBoth</span>(&amp;a, &amp;b);\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 3|||3 3"
            },
            {
              "text": "3 7|||3 7"
            },
            {
              "text": "7 3|||7 3"
            },
            {
              "text": "7 7|||7 7"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The temporary keeps the old value.<br/>B. *x and *y write to a and b.<br/>C. The function reaches the originals through their addresses.<br/>D. The temporary keeps the old value.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Biến tạm giữ giá trị cũ.<br/>B. *x và *y ghi vào a và b.<br/>C. Hàm chạm tới biến gốc qua địa chỉ của chúng.<br/>D. Biến tạm giữ giá trị cũ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code not compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    <span class=\"hljs-type\">int</span> &amp;r;\n    r = x;\n    cout &lt;&lt; r;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    <span class=\"hljs-type\">int</span> &amp;r;\n    r = x;\n    cout &lt;&lt; r;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "References are only for classes|||Tham chiếu chỉ dùng cho lớp"
            },
            {
              "text": "cout cannot print a reference|||cout không in được tham chiếu"
            },
            {
              "text": "The name r is reserved|||Tên r là từ khoá"
            },
            {
              "text": "A reference must be bound when it is declared|||Tham chiếu phải được gắn ngay khi khai báo"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. int references are normal.<br/>B. It prints the value referred to.<br/>C. It is an ordinary name.<br/>D. There is no such thing as an unbound reference.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tham chiếu int là bình thường.<br/>B. Nó in giá trị được tham chiếu.<br/>C. Đó là một tên bình thường.<br/>D. Không tồn tại tham chiếu chưa gắn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;hello&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">find</span>(<span class=\"hljs-string\">&quot;lo&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (s.<span class=\"hljs-built_in\">find</span>(<span class=\"hljs-string\">&quot;xy&quot;</span>) == string::npos) cout &lt;&lt; <span class=\"hljs-string\">&quot;not found&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;hello&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">find</span>(<span class=\"hljs-string\">&quot;lo&quot;</span>) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    <span class=\"hljs-keyword\">if</span> (s.<span class=\"hljs-built_in\">find</span>(<span class=\"hljs-string\">&quot;xy&quot;</span>) == string::npos) cout &lt;&lt; <span class=\"hljs-string\">&quot;not found&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 0|||3 0"
            },
            {
              "text": "3 not found|||3 not found"
            },
            {
              "text": "0 not found|||0 not found"
            },
            {
              "text": "4 not found|||4 not found"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The second search has no match.<br/>B. find returns the index of the first match, or npos if there is none.<br/>C. lo starts at index 3.<br/>D. Indexes start at 0.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Lần tìm thứ hai không khớp.<br/>B. find trả về chỉ số chỗ khớp đầu tiên, hoặc npos nếu không có.<br/>C. lo bắt đầu ở chỉ số 3.<br/>D. Chỉ số bắt đầu từ 0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Counter</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-function\">Counter &amp;<span class=\"hljs-title\">add</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ v += n; <span class=\"hljs-keyword\">return</span> *<span class=\"hljs-keyword\">this</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Counter c;\n    c.<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">1</span>).<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">2</span>).<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">3</span>);\n    cout &lt;&lt; c.v;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Counter</span> {\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-function\">Counter &amp;<span class=\"hljs-title\">add</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ v += n; <span class=\"hljs-keyword\">return</span> *<span class=\"hljs-keyword\">this</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Counter c;\n    c.<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">1</span>).<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">2</span>).<span class=\"hljs-built_in\">add</span>(<span class=\"hljs-number\">3</span>);\n    cout &lt;&lt; c.v;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The later calls act on the same object.<br/>B. Chaining on a reference is valid.<br/>C. add returns *this by reference, so each call works on the same object.<br/>D. The third call counts as well.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Các lời gọi sau vẫn tác động lên cùng đối tượng.<br/>B. Gọi nối tiếp trên tham chiếu là hợp lệ.<br/>C. add trả *this theo tham chiếu nên mỗi lời gọi làm trên cùng đối tượng.<br/>D. Lời gọi thứ ba cũng được tính.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;abcd&quot;</span>;\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-built_in\">strlen</span>(s);\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n / <span class=\"hljs-number\">2</span>; i++) {\n        <span class=\"hljs-type\">char</span> t = s[i];\n        s[i] = s[n - <span class=\"hljs-number\">1</span> - i];\n        s[n - <span class=\"hljs-number\">1</span> - i] = t;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;abcd&quot;</span>;\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-built_in\">strlen</span>(s);\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n / <span class=\"hljs-number\">2</span>; i++) {\n        <span class=\"hljs-type\">char</span> t = s[i];\n        s[i] = s[n - <span class=\"hljs-number\">1</span> - i];\n        s[n - <span class=\"hljs-number\">1</span> - i] = t;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "dcba|||dcba"
            },
            {
              "text": "badc|||badc"
            },
            {
              "text": "abcd|||abcd"
            },
            {
              "text": "dbca|||dbca"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The two ends swap and move toward the middle.<br/>B. That swaps neighbouring pairs.<br/>C. The loop changes the string.<br/>D. That swaps only the outer pair.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Hai đầu đổi chỗ rồi tiến vào giữa.<br/>B. Cách đó đổi từng cặp kề nhau.<br/>C. Vòng lặp làm đổi chuỗi.<br/>D. Cách đó chỉ đổi cặp ngoài cùng.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
