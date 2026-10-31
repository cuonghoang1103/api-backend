// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-PRF193-TS-FE1.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "PRF193"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE1",
      "title": "PRF193 — Practice Final 1 (self-composed)|||PRF193 — Đề luyện cuối kỳ 1 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">3</span>; i++) {\n        <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">3</span>; j++) {\n            <span class=\"hljs-keyword\">if</span> (j + i == <span class=\"hljs-number\">3</span>) <span class=\"hljs-keyword\">break</span>;\n            c++;\n        }\n    }\n    cout &lt;&lt; c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">3</span>; i++) {\n        <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">3</span>; j++) {\n            <span class=\"hljs-keyword\">if</span> (j + i == <span class=\"hljs-number\">3</span>) <span class=\"hljs-keyword\">break</span>;\n            c++;\n        }\n    }\n    cout &lt;&lt; c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. break does not end the outer loop.<br/>B. break leaves only the inner loop: i = 0 gives 3, i = 1 gives 2, i = 2 gives 1.<br/>C. That is 3 x 3 with no break.<br/>D. The outer loop runs three times.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. break không kết thúc vòng ngoài.<br/>B. break chỉ thoát vòng trong: i = 0 cho 3, i = 1 cho 2, i = 2 cho 1.<br/>C. Đó là 3 x 3 khi không có break.<br/>D. Vòng ngoài chạy ba lần.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code not compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Shape</span> {\n<span class=\"hljs-keyword\">public</span>:\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>= <span class=\"hljs-number\">0</span>;\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Shape s;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Shape</span> {\n<span class=\"hljs-keyword\">public</span>:\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">double</span> <span class=\"hljs-title\">area</span><span class=\"hljs-params\">()</span> </span>= <span class=\"hljs-number\">0</span>;\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Shape s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A class cannot have only one function|||Lớp không thể chỉ có một hàm"
            },
            {
              "text": "virtual is not a C++ keyword|||virtual không phải từ khoá C++"
            },
            {
              "text": "Shape is abstract, so it cannot be instantiated|||Shape là lớp trừu tượng nên không tạo đối tượng được"
            },
            {
              "text": "area must not return double|||area không được trả về double"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. There is no such rule.<br/>B. It is a keyword.<br/>C. area is pure virtual, so Shape can only be used through derived classes.<br/>D. Any return type is allowed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không có luật như vậy.<br/>B. Đó là từ khoá.<br/>C. area là hàm thuần ảo nên Shape chỉ dùng được qua lớp dẫn xuất.<br/>D. Kiểu trả về nào cũng được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is the problem with the function below?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> *<span class=\"hljs-title\">makeValue</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">42</span>;\n    <span class=\"hljs-keyword\">return</span> &amp;x;\n}</code></pre></div><div class=\"ml-vi\"><p>Hàm dưới đây có vấn đề gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> *<span class=\"hljs-title\">makeValue</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">42</span>;\n    <span class=\"hljs-keyword\">return</span> &amp;x;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It returns the address of a dead local variable|||Nó trả về địa chỉ của biến cục bộ đã mất"
            },
            {
              "text": "The return type should be void|||Kiểu trả về phải là void"
            },
            {
              "text": "A function cannot return a pointer|||Hàm không được trả về con trỏ"
            },
            {
              "text": "x must be declared const|||x phải khai báo const"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. x dies when the function returns, so the pointer dangles.<br/>B. Then it could not return anything.<br/>C. It can, if the target outlives the call.<br/>D. const does not extend its lifetime here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. x mất khi hàm trả về nên con trỏ bị treo.<br/>B. Khi đó hàm không trả về được gì.<br/>C. Được, nếu đích tồn tại lâu hơn lời gọi.<br/>D. const không kéo dài đời của nó ở đây.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does the call below fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-function\">T <span class=\"hljs-title\">maxOf</span><span class=\"hljs-params\">(T a, T b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">maxOf</span>(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4.5</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao lời gọi dưới đây không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">template</span> &lt;<span class=\"hljs-keyword\">typename</span> T&gt;\n<span class=\"hljs-function\">T <span class=\"hljs-title\">maxOf</span><span class=\"hljs-params\">(T a, T b)</span> </span>{ <span class=\"hljs-keyword\">return</span> a &gt; b ? a : b; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">maxOf</span>(<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4.5</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Templates accept only class types|||Template chỉ nhận kiểu lớp"
            },
            {
              "text": "Templates cannot return a value|||Template không trả về giá trị được"
            },
            {
              "text": "maxOf is a reserved word|||maxOf là từ khoá"
            },
            {
              "text": "T is deduced as both int and double|||T bị suy ra vừa là int vừa là double"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Built-in types work too.<br/>B. They can return values.<br/>C. It is an ordinary name.<br/>D. Both parameters use the same T, and deduction must agree.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Kiểu có sẵn cũng dùng được.<br/>B. Template trả về giá trị được.<br/>C. Đây là một tên bình thường.<br/>D. Hai tham số dùng cùng T nên phép suy kiểu phải thống nhất.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why is printing the array below with cout dangerous?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">char</span> w[<span class=\"hljs-number\">4</span>] = {<span class=\"hljs-string\">&#x27;C&#x27;</span>, <span class=\"hljs-string\">&#x27;o&#x27;</span>, <span class=\"hljs-string\">&#x27;d&#x27;</span>, <span class=\"hljs-string\">&#x27;e&#x27;</span>};\ncout &lt;&lt; w;</code></pre></div><div class=\"ml-vi\"><p>Vì sao in mảng dưới đây bằng cout lại nguy hiểm?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">char</span> w[<span class=\"hljs-number\">4</span>] = {<span class=\"hljs-string\">&#x27;C&#x27;</span>, <span class=\"hljs-string\">&#x27;o&#x27;</span>, <span class=\"hljs-string\">&#x27;d&#x27;</span>, <span class=\"hljs-string\">&#x27;e&#x27;</span>};\ncout &lt;&lt; w;</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It has no null terminator, so cout may read past its end|||Nó không có ký tự kết thúc nên cout có thể đọc quá cuối mảng"
            },
            {
              "text": "A char array must have an even size|||Mảng char phải có cỡ chẵn"
            },
            {
              "text": "The array is too big for the stack|||Mảng quá lớn so với stack"
            },
            {
              "text": "cout cannot print char arrays|||cout không in được mảng char"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. All four cells hold letters, leaving no room for the terminator.<br/>B. There is no such rule.<br/>C. Four bytes is tiny.<br/>D. It can, as long as they are null-terminated.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Cả bốn ô đều chứa chữ, không còn chỗ cho ký tự kết thúc.<br/>B. Không có luật như vậy.<br/>C. Bốn byte là rất nhỏ.<br/>D. In được, miễn là có ký tự kết thúc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[<span class=\"hljs-number\">20</span>];\n    <span class=\"hljs-built_in\">strcpy</span>(a, <span class=\"hljs-string\">&quot;Lo&quot;</span>);\n    <span class=\"hljs-built_in\">strcat</span>(a, <span class=\"hljs-string\">&quot;tus&quot;</span>);\n    cout &lt;&lt; a;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> a[<span class=\"hljs-number\">20</span>];\n    <span class=\"hljs-built_in\">strcpy</span>(a, <span class=\"hljs-string\">&quot;Lo&quot;</span>);\n    <span class=\"hljs-built_in\">strcat</span>(a, <span class=\"hljs-string\">&quot;tus&quot;</span>);\n    cout &lt;&lt; a;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Lo|||Lo"
            },
            {
              "text": "Lotus|||Lotus"
            },
            {
              "text": "tusLo|||tusLo"
            },
            {
              "text": "tus|||tus"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. strcat changes the destination array.<br/>B. strcpy copies Lo, and strcat appends tus to it.<br/>C. strcat appends at the end.<br/>D. strcat does not replace the existing text.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. strcat làm đổi mảng đích.<br/>B. strcpy chép Lo, rồi strcat nối tus vào sau.<br/>C. strcat nối vào cuối.<br/>D. strcat không thay thế chuỗi cũ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum</span> <span class=\"hljs-title class_\">Color</span> { RED, GREEN = <span class=\"hljs-number\">5</span>, BLUE };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; BLUE;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">enum</span> <span class=\"hljs-title class_\">Color</span> { RED, GREEN = <span class=\"hljs-number\">5</span>, BLUE };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; BLUE;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "5|||5"
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
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. GREEN = 5 changes the count.<br/>B. That is GREEN.<br/>C. An enumerator with no value is the previous one plus 1.<br/>D. BLUE is the third name, but its value is not its position.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. GREEN = 5 làm thay đổi cách đếm.<br/>B. Đó là GREEN.<br/>C. Enumerator không gán giá trị bằng giá trị trước cộng 1.<br/>D. BLUE là tên thứ ba nhưng giá trị không phải vị trí.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Vec</span> {\n    <span class=\"hljs-type\">int</span> x, y;\n    Vec <span class=\"hljs-keyword\">operator</span>+(<span class=\"hljs-type\">const</span> Vec &amp;o) <span class=\"hljs-type\">const</span> { <span class=\"hljs-keyword\">return</span> Vec{x + o.x, y + o.y}; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Vec a{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>}, b{<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4</span>};\n    Vec c = a + b;\n    cout &lt;&lt; c.x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; c.y;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Vec</span> {\n    <span class=\"hljs-type\">int</span> x, y;\n    Vec <span class=\"hljs-keyword\">operator</span>+(<span class=\"hljs-type\">const</span> Vec &amp;o) <span class=\"hljs-type\">const</span> { <span class=\"hljs-keyword\">return</span> Vec{x + o.x, y + o.y}; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Vec a{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>}, b{<span class=\"hljs-number\">3</span>, <span class=\"hljs-number\">4</span>};\n    Vec c = a + b;\n    cout &lt;&lt; c.x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; c.y;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 4|||3 4"
            },
            {
              "text": "1 2|||1 2"
            },
            {
              "text": "3 7|||3 7"
            },
            {
              "text": "4 6|||4 6"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is b alone.<br/>B. That is a alone.<br/>C. The pairs are x with x and y with y.<br/>D. operator+ adds matching members into a new object.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó chỉ là b.<br/>B. Đó chỉ là a.<br/>C. Các cặp là x với x và y với y.<br/>D. operator+ cộng từng thành phần vào một đối tượng mới.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which line stops this code from compiling?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x;        <span class=\"hljs-comment\">// line 1</span>\n    x = <span class=\"hljs-number\">5</span>;        <span class=\"hljs-comment\">// line 2</span>\n    <span class=\"hljs-number\">5</span> = x;        <span class=\"hljs-comment\">// line 3</span>\n    cout &lt;&lt; x;    <span class=\"hljs-comment\">// line 4</span>\n}</code></pre></div><div class=\"ml-vi\"><p>Dòng nào làm đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x;        <span class=\"hljs-comment\">// line 1</span>\n    x = <span class=\"hljs-number\">5</span>;        <span class=\"hljs-comment\">// line 2</span>\n    <span class=\"hljs-number\">5</span> = x;        <span class=\"hljs-comment\">// line 3</span>\n    cout &lt;&lt; x;    <span class=\"hljs-comment\">// line 4</span>\n}</code></pre></div>",
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
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 5 is an rvalue, so it cannot stand on the left of an assignment.<br/>B. This is a normal declaration.<br/>C. Printing x is valid.<br/>D. x is an lvalue, so assigning to it is fine.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 5 là rvalue nên không đứng bên trái phép gán được.<br/>B. Đây là khai báo bình thường.<br/>C. In x là hợp lệ.<br/>D. x là lvalue nên gán được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">5</span>};\n    <span class=\"hljs-type\">int</span> *p = a;\n    <span class=\"hljs-type\">int</span> x = *p++;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; *p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a[] = {<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">5</span>};\n    <span class=\"hljs-type\">int</span> *p = a;\n    <span class=\"hljs-type\">int</span> x = *p++;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; *p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5 5|||5 5"
            },
            {
              "text": "2 1|||2 1"
            },
            {
              "text": "1 5|||1 5"
            },
            {
              "text": "1 1|||1 1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The ++ applies after the value is used.<br/>B. Here ++ moves the pointer, and does not add to the value.<br/>C. x gets the old *p, and then p moves on to a[1].<br/>D. p has already moved when *p is printed.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. ++ áp dụng sau khi giá trị được dùng.<br/>B. Ở đây ++ dời con trỏ chứ không cộng vào giá trị.<br/>C. x nhận giá trị cũ của *p, rồi p mới dời sang a[1].<br/>D. Lúc in *p thì p đã dời rồi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">double</span> r[] = {<span class=\"hljs-number\">1.5</span>, <span class=\"hljs-number\">2.5</span>, <span class=\"hljs-number\">3.5</span>, <span class=\"hljs-number\">4.5</span>, <span class=\"hljs-number\">5.5</span>};\n    <span class=\"hljs-type\">double</span> *p = r + <span class=\"hljs-number\">4</span>;\n    cout &lt;&lt; *(p - <span class=\"hljs-number\">3</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">double</span> r[] = {<span class=\"hljs-number\">1.5</span>, <span class=\"hljs-number\">2.5</span>, <span class=\"hljs-number\">3.5</span>, <span class=\"hljs-number\">4.5</span>, <span class=\"hljs-number\">5.5</span>};\n    <span class=\"hljs-type\">double</span> *p = r + <span class=\"hljs-number\">4</span>;\n    cout &lt;&lt; *(p - <span class=\"hljs-number\">3</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2.5 bytes back|||Lùi 2.5 byte"
            },
            {
              "text": "2.5|||2.5"
            },
            {
              "text": "5.5|||5.5"
            },
            {
              "text": "3.5|||3.5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Pointer arithmetic moves by whole elements.<br/>B. p starts at r[4], and p - 3 is r[1].<br/>C. That is *p, before moving back.<br/>D. That is r[2], which is one short of the move.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phép tính con trỏ dời theo cả phần tử.<br/>B. p bắt đầu ở r[4], p - 3 là r[1].<br/>C. Đó là *p, chưa lùi.<br/>D. Đó là r[2], lùi thiếu một ô.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">3</span>;\n    <span class=\"hljs-type\">int</span> &amp;r = x;\n    r += <span class=\"hljs-number\">4</span>;\n    cout &lt;&lt; x;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">3</span>;\n    <span class=\"hljs-type\">int</span> &amp;r = x;\n    r += <span class=\"hljs-number\">4</span>;\n    cout &lt;&lt; x;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. A reference to int may be bound to x.<br/>B. A reference does not copy, so x changes.<br/>C. r += 4 adds to the old value 3.<br/>D. r is another name for x.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tham chiếu int gắn vào x là hợp lệ.<br/>B. Tham chiếu không sao chép nên x bị đổi.<br/>C. r += 4 cộng vào giá trị cũ 3.<br/>D. r là một tên khác của x.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which declaration gives a value that the compiler must be able to work out at compile time?</p></div><div class=\"ml-vi\"><p>Khai báo nào cho một giá trị mà trình biên dịch bắt buộc phải tính được ngay lúc biên dịch?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "const int kSize = rand();|||const int kSize = rand();"
            },
            {
              "text": "int kSize = 10;|||int kSize = 10;"
            },
            {
              "text": "constexpr int kSize = 10;|||constexpr int kSize = 10;"
            },
            {
              "text": "extern int kSize;|||extern int kSize;"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. const only forbids later changes; this value is known at run time.<br/>B. This is an ordinary variable that can change.<br/>C. constexpr requires a compile-time value.<br/>D. This only declares a variable defined elsewhere.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. const chỉ cấm đổi về sau; giá trị này chỉ biết lúc chạy.<br/>B. Đây là biến thường, có thể đổi giá trị.<br/>C. constexpr yêu cầu giá trị tính được lúc biên dịch.<br/>D. Dòng này chỉ khai báo biến được định nghĩa ở nơi khác.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    <span class=\"hljs-type\">int</span> *p = &amp;x;\n    <span class=\"hljs-type\">int</span> **q = &amp;p;\n    **q = <span class=\"hljs-number\">8</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; *p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>;\n    <span class=\"hljs-type\">int</span> *p = &amp;x;\n    <span class=\"hljs-type\">int</span> **q = &amp;p;\n    **q = <span class=\"hljs-number\">8</span>;\n    cout &lt;&lt; x &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; *p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 1|||1 1"
            },
            {
              "text": "8 8|||8 8"
            },
            {
              "text": "8 1|||8 1"
            },
            {
              "text": "1 8|||1 8"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The write through **q changes x.<br/>B. q points at p and p points at x, so **q is x.<br/>C. *p reads x, which is now 8.<br/>D. There is only one int here, so both print the same.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phép ghi qua **q làm đổi x.<br/>B. q trỏ tới p, p trỏ tới x nên **q chính là x.<br/>C. *p đọc x, mà x đã là 8.<br/>D. Chỉ có một biến int nên hai giá trị in ra như nhau.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;nums.txt&quot;</span>)</span></span>;\n    out &lt;&lt; <span class=\"hljs-number\">7</span> &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-number\">5</span>;\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;nums.txt&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> x, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (in &gt;&gt; x) s += x;\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ofstream <span class=\"hljs-title\">out</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;nums.txt&quot;</span>)</span></span>;\n    out &lt;&lt; <span class=\"hljs-number\">7</span> &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-number\">5</span>;\n    out.<span class=\"hljs-built_in\">close</span>();\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;nums.txt&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> x, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">while</span> (in &gt;&gt; x) s += x;\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "12|||12"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "75|||75"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The file holds 7 and 5, and both are read and added.<br/>B. The file was closed before reading, so its data is there.<br/>C. The values are numbers read into ints.<br/>D. The loop reads every value.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Tệp chứa 7 và 5, cả hai được đọc và cộng lại.<br/>B. Tệp được đóng trước khi đọc nên dữ liệu đã có.<br/>C. Các giá trị được đọc vào biến int là số.<br/>D. Vòng lặp đọc mọi giá trị.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Item</span> {\n    <span class=\"hljs-type\">static</span> <span class=\"hljs-type\">int</span> count;\n    <span class=\"hljs-built_in\">Item</span>() { count++; }\n};\n<span class=\"hljs-type\">int</span> Item::count = <span class=\"hljs-number\">0</span>;\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Item a, b;\n    cout &lt;&lt; Item::count;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Item</span> {\n    <span class=\"hljs-type\">static</span> <span class=\"hljs-type\">int</span> count;\n    <span class=\"hljs-built_in\">Item</span>() { count++; }\n};\n<span class=\"hljs-type\">int</span> Item::count = <span class=\"hljs-number\">0</span>;\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Item a, b;\n    cout &lt;&lt; Item::count;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Only two objects exist.<br/>B. There is one copy of count, but two increments.<br/>C. Both constructors ran.<br/>D. A static member is shared by all objects, and each constructor adds 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Chỉ có hai đối tượng.<br/>B. Chỉ có một biến count nhưng có hai lần tăng.<br/>C. Cả hai hàm dựng đều đã chạy.<br/>D. Thành viên static dùng chung cho mọi đối tượng, mỗi hàm dựng cộng 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Vehicle</span> {\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Vehicle</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;v&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Truck</span> : Vehicle {\n    ~<span class=\"hljs-built_in\">Truck</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;k&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Tanker</span> : Truck {\n    ~<span class=\"hljs-built_in\">Tanker</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;t&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Vehicle *p = <span class=\"hljs-keyword\">new</span> Tanker;\n    <span class=\"hljs-keyword\">delete</span> p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Vehicle</span> {\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Vehicle</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;v&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Truck</span> : Vehicle {\n    ~<span class=\"hljs-built_in\">Truck</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;k&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Tanker</span> : Truck {\n    ~<span class=\"hljs-built_in\">Tanker</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;t&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Vehicle *p = <span class=\"hljs-keyword\">new</span> Tanker;\n    <span class=\"hljs-keyword\">delete</span> p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "t|||t"
            },
            {
              "text": "vkt|||vkt"
            },
            {
              "text": "v|||v"
            },
            {
              "text": "tkv|||tkv"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The other two destructors run as well.<br/>B. Destruction goes from the most derived class to the base.<br/>C. Without virtual that could happen, but this destructor is virtual.<br/>D. ~Vehicle is virtual, so the whole chain runs from the real type upward.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Hai hàm huỷ còn lại cũng chạy.<br/>B. Huỷ đi từ lớp dẫn xuất nhất lên lớp cha.<br/>C. Không có virtual mới có thể như vậy, còn ở đây là virtual.<br/>D. ~Vehicle là virtual nên cả chuỗi chạy từ kiểu thật đi lên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">0</span>, b = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-keyword\">if</span> (a &amp;&amp; b++) a = <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">0</span>, b = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-keyword\">if</span> (a &amp;&amp; b++) a = <span class=\"hljs-number\">1</span>;\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 6|||1 6"
            },
            {
              "text": "0 5|||0 5"
            },
            {
              "text": "1 5|||1 5"
            },
            {
              "text": "0 6|||0 6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Neither variable changes.<br/>B. a is 0, so the right side of &amp;&amp; never runs and b stays 5.<br/>C. a stays 0.<br/>D. b++ would run only if a were non-zero.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Không biến nào đổi.<br/>B. a bằng 0 nên vế phải của &amp;&amp; không chạy, b vẫn là 5.<br/>C. a vẫn là 0.<br/>D. b++ chỉ chạy khi a khác 0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;int&quot;</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">double</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;double&quot;</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">show</span>(<span class=\"hljs-number\">2.5f</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;int&quot;</span>; }\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">show</span><span class=\"hljs-params\">(<span class=\"hljs-type\">double</span> x)</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;double&quot;</span>; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-built_in\">show</span>(<span class=\"hljs-number\">2.5f</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "int|||int"
            },
            {
              "text": "The call is ambiguous and does not compile|||Lời gọi mơ hồ, không biên dịch được"
            },
            {
              "text": "double|||double"
            },
            {
              "text": "float|||float"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Going from float to int is a lower-ranked conversion.<br/>B. Promotion makes one candidate better.<br/>C. float converts to double by promotion, which beats converting to int.<br/>D. There is no float overload.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đổi từ float sang int có thứ hạng thấp hơn.<br/>B. Phép nâng kiểu làm một ứng viên tốt hơn hẳn.<br/>C. float đổi sang double là phép nâng kiểu, ưu tiên hơn đổi sang int.<br/>D. Không có bản nạp chồng cho float.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;no_such_file_xyz.txt&quot;</span>)</span></span>;\n    <span class=\"hljs-keyword\">if</span> (in) cout &lt;&lt; <span class=\"hljs-string\">&quot;opened&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;failed&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">ifstream <span class=\"hljs-title\">in</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;no_such_file_xyz.txt&quot;</span>)</span></span>;\n    <span class=\"hljs-keyword\">if</span> (in) cout &lt;&lt; <span class=\"hljs-string\">&quot;opened&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;failed&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "failed|||failed"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "opened|||opened"
            },
            {
              "text": "The program crashes|||Chương trình sập"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Opening a missing file for reading fails, so the stream is false.<br/>B. The code is valid.<br/>C. ifstream does not create a missing file.<br/>D. Failure is reported through the stream state.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mở tệp không tồn tại để đọc sẽ thất bại nên stream là false.<br/>B. Đoạn code hợp lệ.<br/>C. ifstream không tự tạo tệp chưa có.<br/>D. Lỗi được báo qua trạng thái stream.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">3</span>, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">malloc</span>(n * <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n; i++) p[i] = i * <span class=\"hljs-number\">10</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n; i++) s += p[i];\n    <span class=\"hljs-built_in\">free</span>(p);\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">3</span>, s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-type\">int</span> *p = (<span class=\"hljs-type\">int</span> *)<span class=\"hljs-built_in\">malloc</span>(n * <span class=\"hljs-built_in\">sizeof</span>(<span class=\"hljs-type\">int</span>));\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n; i++) p[i] = i * <span class=\"hljs-number\">10</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">0</span>; i &lt; n; i++) s += p[i];\n    <span class=\"hljs-built_in\">free</span>(p);\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "60|||60"
            },
            {
              "text": "30|||30"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is only the last element.<br/>B. That is the number of elements.<br/>C. That would be 10, 20, 30.<br/>D. The block holds 0, 10 and 20 after the loop, and these sum to 30.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó chỉ là phần tử cuối.<br/>B. Đó là số phần tử.<br/>C. Đó là tổng của 10, 20, 30.<br/>D. Khối nhớ chứa 0, 10, 20 sau vòng lặp, tổng là 30.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What is wrong with this code?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">int</span> *p = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">5</span>];\np = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">8</span>];\n<span class=\"hljs-keyword\">delete</span>[] p;</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này sai ở đâu?</p><pre><code class=\"language-cpp\"><span class=\"hljs-type\">int</span> *p = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">5</span>];\np = <span class=\"hljs-keyword\">new</span> <span class=\"hljs-type\">int</span>[<span class=\"hljs-number\">8</span>];\n<span class=\"hljs-keyword\">delete</span>[] p;</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "new[] cannot be used twice in a function|||new[] không được dùng hai lần trong một hàm"
            },
            {
              "text": "delete[] frees both blocks|||delete[] giải phóng cả hai khối"
            },
            {
              "text": "The first block is leaked when p is overwritten|||Khối đầu bị rò rỉ khi p bị ghi đè"
            },
            {
              "text": "It is a double free|||Giải phóng hai lần"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. There is no such limit.<br/>B. It frees only the block p points to now.<br/>C. Nothing can free the 5-element block after the second new.<br/>D. delete[] runs only once.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không có giới hạn đó.<br/>B. Nó chỉ giải phóng khối mà p đang trỏ tới.<br/>C. Sau lần new thứ hai không còn gì giải phóng được khối 5 phần tử.<br/>D. delete[] chỉ chạy một lần.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_unique</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    <span class=\"hljs-keyword\">auto</span> q = p;\n    cout &lt;&lt; *q;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-keyword\">auto</span> p = <span class=\"hljs-built_in\">make_unique</span>&lt;<span class=\"hljs-type\">int</span>&gt;(<span class=\"hljs-number\">5</span>);\n    <span class=\"hljs-keyword\">auto</span> q = p;\n    cout &lt;&lt; *q;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "make_unique is only for arrays|||make_unique chỉ dùng cho mảng"
            },
            {
              "text": "A unique_ptr cannot be copied, only moved|||unique_ptr không sao chép được, chỉ di chuyển được"
            },
            {
              "text": "unique_ptr cannot hold an int|||unique_ptr không giữ được int"
            },
            {
              "text": "auto cannot be used with pointers|||auto không dùng được với con trỏ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It works for single objects.<br/>B. Only one owner may exist, so q must be set with move(p).<br/>C. It holds any type.<br/>D. It can.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Nó dùng được cho một đối tượng.<br/>B. Chỉ được có một chủ sở hữu nên q phải nhận bằng move(p).<br/>C. Nó giữ được mọi kiểu.<br/>D. Được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> k = <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-keyword\">switch</span> (k) {\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">1</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">2</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">3</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">default</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>;\n    }\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> k = <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-keyword\">switch</span> (k) {\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">1</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;A&quot;</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">2</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>;\n        <span class=\"hljs-keyword\">case</span> <span class=\"hljs-number\">3</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; <span class=\"hljs-keyword\">break</span>;\n        <span class=\"hljs-keyword\">default</span>: cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>;\n    }\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "BC|||BC"
            },
            {
              "text": "BCD|||BCD"
            },
            {
              "text": "ABC|||ABC"
            },
            {
              "text": "B|||B"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Case 2 matches and, with no break, runs into case 3 until its break.<br/>B. The break in case 3 stops it before default.<br/>C. Execution starts at the matching case, not at the top.<br/>D. Case 2 has no break, so it does not stop there.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Case 2 khớp và do không có break nên chạy tiếp vào case 3 tới break.<br/>B. break ở case 3 chặn trước default.<br/>C. Thực thi bắt đầu từ case khớp, không từ đầu.<br/>D. Case 2 không có break nên không dừng ở đó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;abricot&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">substr</span>(<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">3</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    string s = <span class=\"hljs-string\">&quot;abricot&quot;</span>;\n    cout &lt;&lt; s.<span class=\"hljs-built_in\">substr</span>(<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">3</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "abr|||abr"
            },
            {
              "text": "ric|||ric"
            },
            {
              "text": "br|||br"
            },
            {
              "text": "bri|||bri"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That starts at index 0.<br/>B. That starts at index 2.<br/>C. The second argument is a length, not an end position.<br/>D. substr(1, 3) takes 3 characters from index 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách đó bắt đầu từ chỉ số 0.<br/>B. Cách đó bắt đầu từ chỉ số 2.<br/>C. Đối số thứ hai là độ dài, không phải vị trí cuối.<br/>D. substr(1, 3) lấy 3 ký tự từ chỉ số 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">10</span>, count = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">do</span> {\n        count++;\n        n++;\n    } <span class=\"hljs-keyword\">while</span> (n &lt; <span class=\"hljs-number\">5</span>);\n    cout &lt;&lt; count;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> n = <span class=\"hljs-number\">10</span>, count = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">do</span> {\n        count++;\n        n++;\n    } <span class=\"hljs-keyword\">while</span> (n &lt; <span class=\"hljs-number\">5</span>);\n    cout &lt;&lt; count;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11|||11"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "It loops forever|||Lặp vô hạn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. n becomes 11 but the output is count.<br/>B. That would be a while loop.<br/>C. A do-while body runs once before the test.<br/>D. The condition is false after one pass.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. n thành 11 nhưng thứ được in là count.<br/>B. Đó là kết quả của vòng while.<br/>C. Thân do-while chạy một lần trước khi kiểm tra.<br/>D. Điều kiện sai sau một lượt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    map&lt;string, <span class=\"hljs-type\">int</span>&gt; m;\n    m[<span class=\"hljs-string\">&quot;cat&quot;</span>] = <span class=\"hljs-number\">1</span>;\n    m[<span class=\"hljs-string\">&quot;ant&quot;</span>] = <span class=\"hljs-number\">2</span>;\n    m[<span class=\"hljs-string\">&quot;bee&quot;</span>] = <span class=\"hljs-number\">3</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-keyword\">auto</span> &amp;e : m) cout &lt;&lt; e.first &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    map&lt;string, <span class=\"hljs-type\">int</span>&gt; m;\n    m[<span class=\"hljs-string\">&quot;cat&quot;</span>] = <span class=\"hljs-number\">1</span>;\n    m[<span class=\"hljs-string\">&quot;ant&quot;</span>] = <span class=\"hljs-number\">2</span>;\n    m[<span class=\"hljs-string\">&quot;bee&quot;</span>] = <span class=\"hljs-number\">3</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-keyword\">auto</span> &amp;e : m) cout &lt;&lt; e.first &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1 2 3|||1 2 3"
            },
            {
              "text": "ant bee cat|||ant bee cat"
            },
            {
              "text": "cat bee ant|||cat bee ant"
            },
            {
              "text": "cat ant bee|||cat ant bee"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The loop prints the keys, not the values.<br/>B. A map keeps its keys sorted, whatever the insertion order.<br/>C. A map sorts in ascending order by default.<br/>D. That is the insertion order.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Vòng lặp in khoá, không in giá trị.<br/>B. map luôn giữ khoá theo thứ tự, bất kể thứ tự chèn.<br/>C. map mặc định sắp tăng dần.<br/>D. Đó là thứ tự chèn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-type\">int</span> j = i++ + <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; i &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; j;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">5</span>;\n    <span class=\"hljs-type\">int</span> j = i++ + <span class=\"hljs-number\">2</span>;\n    cout &lt;&lt; i &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; j;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "6 7|||6 7"
            },
            {
              "text": "5 7|||5 7"
            },
            {
              "text": "5 8|||5 8"
            },
            {
              "text": "6 8|||6 8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. i++ gives the old value 5 to the sum and then i becomes 6.<br/>B. i is increased by the time it is printed.<br/>C. This mixes both mistakes.<br/>D. That is what ++i would give.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. i++ đưa giá trị cũ 5 vào phép cộng rồi i mới thành 6.<br/>B. Lúc in, i đã tăng rồi.<br/>C. Cách đó gộp cả hai lỗi.<br/>D. Đó là kết quả nếu dùng ++i.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">1</span>; i &lt;= <span class=\"hljs-number\">10</span>; i++) {\n        <span class=\"hljs-keyword\">if</span> (i % <span class=\"hljs-number\">2</span> == <span class=\"hljs-number\">0</span>) <span class=\"hljs-keyword\">continue</span>;\n        s += i;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">1</span>; i &lt;= <span class=\"hljs-number\">10</span>; i++) {\n        <span class=\"hljs-keyword\">if</span> (i % <span class=\"hljs-number\">2</span> == <span class=\"hljs-number\">0</span>) <span class=\"hljs-keyword\">continue</span>;\n        s += i;\n    }\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "25|||25"
            },
            {
              "text": "55|||55"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "30|||30"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. continue skips even i, leaving 1 + 3 + 5 + 7 + 9.<br/>B. That is 1 to 10 with nothing skipped.<br/>C. That is the last value added.<br/>D. That is the sum of the even numbers.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. continue bỏ qua i chẵn, còn 1 + 3 + 5 + 7 + 9.<br/>B. Đó là tổng từ 1 đến 10, không bỏ số nào.<br/>C. Đó là giá trị cuối được cộng.<br/>D. Đó là tổng các số chẵn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>A block is created by new int[20]. How must it be released?</p></div><div class=\"ml-vi\"><p>Một khối được tạo bằng new int[20]. Phải giải phóng nó thế nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "free(p);|||free(p);"
            },
            {
              "text": "delete p;|||delete p;"
            },
            {
              "text": "p = nullptr;|||p = nullptr;"
            },
            {
              "text": "delete[] p;|||delete[] p;"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. free pairs with malloc, not new.<br/>B. Plain delete on an array is undefined behaviour.<br/>C. This only loses the address and leaks the block.<br/>D. Array new pairs with array delete.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. free đi cặp với malloc, không đi với new.<br/>B. delete thường trên mảng là hành vi không xác định.<br/>C. Việc này chỉ làm mất địa chỉ và rò rỉ khối nhớ.<br/>D. new mảng đi cặp với delete mảng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">2</span> + <span class=\"hljs-number\">3</span> * <span class=\"hljs-number\">4</span> % <span class=\"hljs-number\">5</span>;\n    cout &lt;&lt; x;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">2</span> + <span class=\"hljs-number\">3</span> * <span class=\"hljs-number\">4</span> % <span class=\"hljs-number\">5</span>;\n    cout &lt;&lt; x;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "14|||14"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. 2 is only 3 * 4 % 5, without the first 2.<br/>B. That adds first: (2 + 3) * 4 % 5.<br/>C. * and % run first, left to right: 3 * 4 = 12, 12 % 5 = 2, then 2 + 2 = 4.<br/>D. That leaves out % 5.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. 2 chỉ là 3 * 4 % 5, chưa cộng số 2 đầu.<br/>B. Cách đó cộng trước: (2 + 3) * 4 % 5.<br/>C. * và % chạy trước, từ trái sang: 3 * 4 = 12, 12 % 5 = 2, rồi 2 + 2 = 4.<br/>D. Cách đó bỏ phần % 5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Why does this code fail to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Cat</span> { <span class=\"hljs-type\">int</span> age; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Cat c;\n    c.age = <span class=\"hljs-number\">3</span>;\n    cout &lt;&lt; c.age;\n}</code></pre></div><div class=\"ml-vi\"><p>Vì sao đoạn code này không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title class_\">Cat</span> { <span class=\"hljs-type\">int</span> age; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Cat c;\n    c.age = <span class=\"hljs-number\">3</span>;\n    cout &lt;&lt; c.age;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A class must have a destructor|||Lớp bắt buộc phải có hàm huỷ"
            },
            {
              "text": "Members of a class are private by default|||Thành viên của class mặc định là private"
            },
            {
              "text": "Objects must be created with new|||Đối tượng phải tạo bằng new"
            },
            {
              "text": "int cannot be a member type|||int không làm kiểu thành viên được"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The compiler provides one.<br/>B. age cannot be reached from main.<br/>C. Stack objects are normal.<br/>D. It can.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Trình biên dịch tự tạo hàm huỷ.<br/>B. age không truy cập được từ main.<br/>C. Đối tượng trên stack là bình thường.<br/>D. Được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (<span class=\"hljs-number\">2</span> | <span class=\"hljs-number\">5</span> &amp; <span class=\"hljs-number\">4</span> ^ <span class=\"hljs-number\">1</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; (<span class=\"hljs-number\">2</span> | <span class=\"hljs-number\">5</span> &amp; <span class=\"hljs-number\">4</span> ^ <span class=\"hljs-number\">1</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That applies the operators from left to right.<br/>B. &amp; runs before ^, and ^ before |: 5 &amp; 4 = 4, 4 ^ 1 = 5, 2 | 5 = 7.<br/>C. That is 2 | 4, which leaves out the ^ 1 part.<br/>D. 4 is only the 5 &amp; 4 part.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Cách đó áp phép toán từ trái sang phải.<br/>B. &amp; chạy trước ^, ^ chạy trước |: 5 &amp; 4 = 4, 4 ^ 1 = 5, 2 | 5 = 7.<br/>C. Đó là 2 | 4, bỏ phần ^ 1.<br/>D. 4 chỉ là phần 5 &amp; 4.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">swapValues</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x, <span class=\"hljs-type\">int</span> y)</span> </span>{ <span class=\"hljs-type\">int</span> t = x; x = y; y = t; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">3</span>, b = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-built_in\">swapValues</span>(a, b);\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">swapValues</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> x, <span class=\"hljs-type\">int</span> y)</span> </span>{ <span class=\"hljs-type\">int</span> t = x; x = y; y = t; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">3</span>, b = <span class=\"hljs-number\">7</span>;\n    <span class=\"hljs-built_in\">swapValues</span>(a, b);\n    cout &lt;&lt; a &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 7|||3 7"
            },
            {
              "text": "3 3|||3 3"
            },
            {
              "text": "7 3|||7 3"
            },
            {
              "text": "7 7|||7 7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Parameters are passed by value, so only the copies are swapped.<br/>B. The originals are never assigned.<br/>C. That needs references or pointers.<br/>D. The originals are never assigned.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Tham số truyền theo giá trị nên chỉ bản sao bị đổi.<br/>B. Biến gốc không hề bị gán.<br/>C. Muốn vậy cần tham chiếu hoặc con trỏ.<br/>D. Biến gốc không hề bị gán.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> m[<span class=\"hljs-number\">2</span>][<span class=\"hljs-number\">3</span>] = {{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">3</span>}, {<span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">6</span>}};\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">3</span>; j++) s += m[<span class=\"hljs-number\">1</span>][j];\n    cout &lt;&lt; s;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> m[<span class=\"hljs-number\">2</span>][<span class=\"hljs-number\">3</span>] = {{<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">2</span>, <span class=\"hljs-number\">3</span>}, {<span class=\"hljs-number\">4</span>, <span class=\"hljs-number\">5</span>, <span class=\"hljs-number\">6</span>}};\n    <span class=\"hljs-type\">int</span> s = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> j = <span class=\"hljs-number\">0</span>; j &lt; <span class=\"hljs-number\">3</span>; j++) s += m[<span class=\"hljs-number\">1</span>][j];\n    cout &lt;&lt; s;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "21|||21"
            },
            {
              "text": "15|||15"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is 1 + 2 + 3, the first row.<br/>B. That is 3 + 6, the last column.<br/>C. That is the sum of all six numbers.<br/>D. The second row is 4, 5, 6.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là 1 + 2 + 3, hàng đầu.<br/>B. Đó là 3 + 6, cột cuối.<br/>C. Đó là tổng cả sáu số.<br/>D. Hàng thứ hai là 4, 5, 6.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">7</span>, b = <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-type\">double</span> d = a / b;\n    cout &lt;&lt; fixed &lt;&lt; <span class=\"hljs-built_in\">setprecision</span>(<span class=\"hljs-number\">1</span>) &lt;&lt; d;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> a = <span class=\"hljs-number\">7</span>, b = <span class=\"hljs-number\">2</span>;\n    <span class=\"hljs-type\">double</span> d = a / b;\n    cout &lt;&lt; fixed &lt;&lt; <span class=\"hljs-built_in\">setprecision</span>(<span class=\"hljs-number\">1</span>) &lt;&lt; d;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3.5|||3.5"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "3.0|||3.0"
            },
            {
              "text": "4.0|||4.0"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That needs a cast before dividing, as in (double)a / b.<br/>B. fixed with setprecision(1) always prints one decimal place.<br/>C. a / b is integer division, giving 3, which is then converted to 3.0.<br/>D. Integer division truncates, it does not round.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Muốn vậy phải ép kiểu trước khi chia, như (double)a / b.<br/>B. fixed và setprecision(1) luôn in một chữ số thập phân.<br/>C. a / b là chia nguyên ra 3, rồi mới đổi sang 3.0.<br/>D. Chia nguyên cắt bỏ phần lẻ, không làm tròn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Ticket</span> { <span class=\"hljs-type\">int</span> seat; <span class=\"hljs-type\">double</span> price; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Ticket t1 = {<span class=\"hljs-number\">12</span>, <span class=\"hljs-number\">8.5</span>};\n    Ticket t2 = t1;\n    t<span class=\"hljs-number\">2.</span>seat = <span class=\"hljs-number\">30</span>;\n    cout &lt;&lt; t<span class=\"hljs-number\">1.</span>seat &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; t<span class=\"hljs-number\">2.</span>seat;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Ticket</span> { <span class=\"hljs-type\">int</span> seat; <span class=\"hljs-type\">double</span> price; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Ticket t1 = {<span class=\"hljs-number\">12</span>, <span class=\"hljs-number\">8.5</span>};\n    Ticket t2 = t1;\n    t<span class=\"hljs-number\">2.</span>seat = <span class=\"hljs-number\">30</span>;\n    cout &lt;&lt; t<span class=\"hljs-number\">1.</span>seat &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; t<span class=\"hljs-number\">2.</span>seat;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "30 30|||30 30"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            },
            {
              "text": "12 12|||12 12"
            },
            {
              "text": "12 30|||12 30"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That would need a pointer or reference.<br/>B. Struct assignment is allowed.<br/>C. t2.seat was assigned 30.<br/>D. t2 is a separate copy, so changing it leaves t1 alone.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Muốn vậy cần con trỏ hoặc tham chiếu.<br/>B. Gán struct là hợp lệ.<br/>C. t2.seat đã được gán 30.<br/>D. t2 là bản sao riêng nên đổi nó không ảnh hưởng t1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;Hello&quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(s) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-built_in\">strlen</span>(s);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">char</span> s[] = <span class=\"hljs-string\">&quot;Hello&quot;</span>;\n    cout &lt;&lt; <span class=\"hljs-built_in\">sizeof</span>(s) &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; <span class=\"hljs-built_in\">strlen</span>(s);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5 6|||5 6"
            },
            {
              "text": "6 5|||6 5"
            },
            {
              "text": "5 5|||5 5"
            },
            {
              "text": "8 5|||8 5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The two values are swapped.<br/>B. sizeof counts the terminating null, and strlen does not.<br/>C. The array also stores the null terminator.<br/>D. s is an array here, not a pointer.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Hai giá trị bị đảo.<br/>B. sizeof tính cả ký tự kết thúc, strlen thì không.<br/>C. Mảng còn chứa ký tự kết thúc.<br/>D. s ở đây là mảng, không phải con trỏ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Engine</span> {\n    <span class=\"hljs-built_in\">Engine</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;E&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Engine</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;e&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Wheel</span> {\n    <span class=\"hljs-built_in\">Wheel</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;W&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Wheel</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;w&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Car</span> : Engine {\n    Wheel w;\n    <span class=\"hljs-built_in\">Car</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Car</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;c&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Car c;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Engine</span> {\n    <span class=\"hljs-built_in\">Engine</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;E&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Engine</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;e&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Wheel</span> {\n    <span class=\"hljs-built_in\">Wheel</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;W&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Wheel</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;w&quot;</span>; }\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Car</span> : Engine {\n    Wheel w;\n    <span class=\"hljs-built_in\">Car</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n    ~<span class=\"hljs-built_in\">Car</span>() { cout &lt;&lt; <span class=\"hljs-string\">&quot;c&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Car c;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Cc|||Cc"
            },
            {
              "text": "EWCewc|||EWCewc"
            },
            {
              "text": "EWCcwe|||EWCcwe"
            },
            {
              "text": "WECcew|||WECcew"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The base and the member are built and destroyed too.<br/>B. Destruction runs in exact reverse order.<br/>C. The base comes first, then members, then the class body; destruction reverses this.<br/>D. The base is built before members.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Lớp cha và thành viên cũng được dựng và huỷ.<br/>B. Việc huỷ chạy đúng theo thứ tự ngược.<br/>C. Lớp cha trước, rồi thành viên, rồi thân lớp; khi huỷ thì ngược lại.<br/>D. Lớp cha được dựng trước thành viên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ <span class=\"hljs-keyword\">return</span> n &lt;= <span class=\"hljs-number\">0</span> ? <span class=\"hljs-number\">0</span> : n + <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">1</span>); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">4</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> n)</span> </span>{ <span class=\"hljs-keyword\">return</span> n &lt;= <span class=\"hljs-number\">0</span> ? <span class=\"hljs-number\">0</span> : n + <span class=\"hljs-built_in\">f</span>(n - <span class=\"hljs-number\">1</span>); }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">4</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "24|||24"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. f(4) = 4 + f(3) = 4 + 3 + 2 + 1 + 0.<br/>B. That leaves out the 4.<br/>C. That would be multiplication.<br/>D. That stops after one call.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. f(4) = 4 + f(3) = 4 + 3 + 2 + 1 + 0.<br/>B. Cách đó bỏ số 4.<br/>C. Đó là kết quả nếu nhân.<br/>D. Cách đó dừng sau một lần gọi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which ofstream mode keeps a log file&#39;s old contents and writes new lines at the end?</p></div><div class=\"ml-vi\"><p>Chế độ ofstream nào giữ nội dung cũ của tệp nhật ký và ghi dòng mới vào cuối?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ios::app|||ios::app"
            },
            {
              "text": "ios::binary|||ios::binary"
            },
            {
              "text": "ios::trunc|||ios::trunc"
            },
            {
              "text": "ios::in|||ios::in"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Append mode writes at the end of the file.<br/>B. It only controls newline translation.<br/>C. It empties the file on opening.<br/>D. That opens for reading.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Chế độ nối ghi vào cuối tệp.<br/>B. Chế độ này chỉ liên quan đến việc dịch ký tự xuống dòng.<br/>C. Chế độ này xoá sạch tệp khi mở.<br/>D. Chế độ này mở để đọc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>Which line fails to compile?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>, y = <span class=\"hljs-number\">2</span>;          <span class=\"hljs-comment\">// line 1</span>\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">int</span> *p = &amp;x;         <span class=\"hljs-comment\">// line 2</span>\n    p = &amp;y;                    <span class=\"hljs-comment\">// line 3</span>\n    *p = <span class=\"hljs-number\">5</span>;                    <span class=\"hljs-comment\">// line 4</span>\n    x = <span class=\"hljs-number\">7</span>;                     <span class=\"hljs-comment\">// line 5</span>\n}</code></pre></div><div class=\"ml-vi\"><p>Dòng nào không biên dịch được?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> x = <span class=\"hljs-number\">1</span>, y = <span class=\"hljs-number\">2</span>;          <span class=\"hljs-comment\">// line 1</span>\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">int</span> *p = &amp;x;         <span class=\"hljs-comment\">// line 2</span>\n    p = &amp;y;                    <span class=\"hljs-comment\">// line 3</span>\n    *p = <span class=\"hljs-number\">5</span>;                    <span class=\"hljs-comment\">// line 4</span>\n    x = <span class=\"hljs-number\">7</span>;                     <span class=\"hljs-comment\">// line 5</span>\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Line 2|||Dòng 2"
            },
            {
              "text": "Line 5|||Dòng 5"
            },
            {
              "text": "Line 3|||Dòng 3"
            },
            {
              "text": "Line 4|||Dòng 4"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Pointing a const int pointer at a normal int is allowed.<br/>B. Changing x directly is allowed.<br/>C. The pointer itself is not const, so it may be moved.<br/>D. p points to const int, so the value cannot be changed through p.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cho con trỏ const int trỏ tới int thường là hợp lệ.<br/>B. Đổi x trực tiếp là hợp lệ.<br/>C. Bản thân con trỏ không const nên dời được.<br/>D. p trỏ tới const int nên không đổi được giá trị qua p.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;12 7&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> a, b;\n    ss &gt;&gt; a &gt;&gt; b;\n    cout &lt;&lt; a + b;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-function\">stringstream <span class=\"hljs-title\">ss</span><span class=\"hljs-params\">(<span class=\"hljs-string\">&quot;12 7&quot;</span>)</span></span>;\n    <span class=\"hljs-type\">int</span> a, b;\n    ss &gt;&gt; a &gt;&gt; b;\n    cout &lt;&lt; a + b;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "19|||19"
            },
            {
              "text": "127|||127"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. &gt;&gt; reads whole numbers, not single digits.<br/>B. The stream splits on whitespace, giving 12 and 7.<br/>C. The numbers are added, not joined.<br/>D. Both values are read.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. &gt;&gt; đọc cả số, không đọc từng chữ số.<br/>B. Stream tách theo khoảng trắng, được 12 và 7.<br/>C. Hai số được cộng, không nối.<br/>D. Cả hai giá trị đều được đọc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> {\n    <span class=\"hljs-built_in\">A</span>() {}\n    <span class=\"hljs-built_in\">A</span>(<span class=\"hljs-type\">const</span> A &amp;) { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n};\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(A x)</span> </span>{}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A a;\n    A b = a;\n    <span class=\"hljs-built_in\">f</span>(a);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">A</span> {\n    <span class=\"hljs-built_in\">A</span>() {}\n    <span class=\"hljs-built_in\">A</span>(<span class=\"hljs-type\">const</span> A &amp;) { cout &lt;&lt; <span class=\"hljs-string\">&quot;C&quot;</span>; }\n};\n<span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(A x)</span> </span>{}\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    A a;\n    A b = a;\n    <span class=\"hljs-built_in\">f</span>(a);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "CCC|||CCC"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "CC|||CC"
            },
            {
              "text": "Nothing is printed|||Không in gì"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A a itself uses the default constructor, which prints nothing.<br/>B. The call f(a) also copies.<br/>C. The line A b = a and the by-value parameter each call the copy constructor.<br/>D. Both copies run the printing constructor.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. A a dùng hàm dựng mặc định, không in gì.<br/>B. Lời gọi f(a) cũng sao chép.<br/>C. Dòng A b = a và tham số truyền theo giá trị đều gọi hàm dựng sao chép.<br/>D. Cả hai lần sao chép đều chạy hàm dựng có lệnh in.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> d = <span class=\"hljs-built_in\">strcmp</span>(<span class=\"hljs-string\">&quot;apple&quot;</span>, <span class=\"hljs-string\">&quot;apricot&quot;</span>);\n    <span class=\"hljs-keyword\">if</span> (d &lt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;before&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (d &gt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;after&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;same&quot;</span>;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">int</span> d = <span class=\"hljs-built_in\">strcmp</span>(<span class=\"hljs-string\">&quot;apple&quot;</span>, <span class=\"hljs-string\">&quot;apricot&quot;</span>);\n    <span class=\"hljs-keyword\">if</span> (d &lt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;before&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> <span class=\"hljs-keyword\">if</span> (d &gt; <span class=\"hljs-number\">0</span>) cout &lt;&lt; <span class=\"hljs-string\">&quot;after&quot;</span>;\n    <span class=\"hljs-keyword\">else</span> cout &lt;&lt; <span class=\"hljs-string\">&quot;same&quot;</span>;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "same|||same"
            },
            {
              "text": "before|||before"
            },
            {
              "text": "after|||after"
            },
            {
              "text": "It depends on the length only|||Chỉ phụ thuộc độ dài"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The strings differ.<br/>B. The first difference is p against r, and p comes earlier.<br/>C. That would need a positive result from strcmp.<br/>D. strcmp compares character by character.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Hai chuỗi khác nhau.<br/>B. Chỗ khác đầu tiên là p so với r, mà p đứng trước.<br/>C. Điều đó cần strcmp trả về số dương.<br/>D. strcmp so từng ký tự.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v;\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">2</span>);\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">5</span>);\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">9</span>);\n    cout &lt;&lt; v.<span class=\"hljs-built_in\">size</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; v.<span class=\"hljs-built_in\">back</span>();\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    vector&lt;<span class=\"hljs-type\">int</span>&gt; v;\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">2</span>);\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">5</span>);\n    v.<span class=\"hljs-built_in\">push_back</span>(<span class=\"hljs-number\">9</span>);\n    cout &lt;&lt; v.<span class=\"hljs-built_in\">size</span>() &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; v.<span class=\"hljs-built_in\">back</span>();\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3 2|||3 2"
            },
            {
              "text": "2 9|||2 9"
            },
            {
              "text": "3 5|||3 5"
            },
            {
              "text": "3 9|||3 9"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. 2 is the first item.<br/>B. There are three items.<br/>C. 5 is the middle item.<br/>D. Three items were pushed, and back() is the last one.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. 2 là phần tử đầu.<br/>B. Có ba phần tử.<br/>C. 5 là phần tử giữa.<br/>D. Có ba phần tử được đẩy vào, back() là phần tử cuối.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">g</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Base</span>() {}\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">g</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Base *p = <span class=\"hljs-keyword\">new</span> Derived;\n    p-&gt;<span class=\"hljs-built_in\">f</span>();\n    cout &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    p-&gt;<span class=\"hljs-built_in\">g</span>();\n    <span class=\"hljs-keyword\">delete</span> p;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Base</span> {\n    <span class=\"hljs-function\"><span class=\"hljs-keyword\">virtual</span> <span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">g</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;B&quot;</span>; }\n    <span class=\"hljs-keyword\">virtual</span> ~<span class=\"hljs-built_in\">Base</span>() {}\n};\n<span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Derived</span> : Base {\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">()</span> <span class=\"hljs-keyword\">override</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n    <span class=\"hljs-function\"><span class=\"hljs-type\">void</span> <span class=\"hljs-title\">g</span><span class=\"hljs-params\">()</span> </span>{ cout &lt;&lt; <span class=\"hljs-string\">&quot;D&quot;</span>; }\n};\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Base *p = <span class=\"hljs-keyword\">new</span> Derived;\n    p-&gt;<span class=\"hljs-built_in\">f</span>();\n    cout &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span>;\n    p-&gt;<span class=\"hljs-built_in\">g</span>();\n    <span class=\"hljs-keyword\">delete</span> p;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "B D|||B D"
            },
            {
              "text": "B B|||B B"
            },
            {
              "text": "D B|||D B"
            },
            {
              "text": "D D|||D D"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This is the reverse.<br/>B. That would be true if f were not virtual.<br/>C. f is virtual, so the object&#39;s real type decides; g is not, so the pointer type decides.<br/>D. g is not virtual.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây là ngược lại.<br/>B. Điều đó đúng nếu f không virtual.<br/>C. f là virtual nên kiểu thật của đối tượng quyết định; g không virtual nên kiểu con trỏ quyết định.<br/>D. g không virtual.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Student</span> { string name; <span class=\"hljs-type\">int</span> score; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Student list[<span class=\"hljs-number\">3</span>] = {{<span class=\"hljs-string\">&quot;Binh&quot;</span>, <span class=\"hljs-number\">7</span>}, {<span class=\"hljs-string\">&quot;Tuan&quot;</span>, <span class=\"hljs-number\">8</span>}, {<span class=\"hljs-string\">&quot;Lan&quot;</span>, <span class=\"hljs-number\">6</span>}};\n    Student best = list[<span class=\"hljs-number\">0</span>];\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">1</span>; i &lt; <span class=\"hljs-number\">3</span>; i++) {\n        <span class=\"hljs-keyword\">if</span> (list[i].score &gt; best.score) best = list[i];\n    }\n    cout &lt;&lt; best.name &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; best.score;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-keyword\">struct</span> <span class=\"hljs-title class_\">Student</span> { string name; <span class=\"hljs-type\">int</span> score; };\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    Student list[<span class=\"hljs-number\">3</span>] = {{<span class=\"hljs-string\">&quot;Binh&quot;</span>, <span class=\"hljs-number\">7</span>}, {<span class=\"hljs-string\">&quot;Tuan&quot;</span>, <span class=\"hljs-number\">8</span>}, {<span class=\"hljs-string\">&quot;Lan&quot;</span>, <span class=\"hljs-number\">6</span>}};\n    Student best = list[<span class=\"hljs-number\">0</span>];\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">int</span> i = <span class=\"hljs-number\">1</span>; i &lt; <span class=\"hljs-number\">3</span>; i++) {\n        <span class=\"hljs-keyword\">if</span> (list[i].score &gt; best.score) best = list[i];\n    }\n    cout &lt;&lt; best.name &lt;&lt; <span class=\"hljs-string\">&quot; &quot;</span> &lt;&lt; best.score;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Tuan 8|||Tuan 8"
            },
            {
              "text": "Tuan 7|||Tuan 7"
            },
            {
              "text": "Lan 6|||Lan 6"
            },
            {
              "text": "Binh 7|||Binh 7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The loop keeps the student with the highest score.<br/>B. The name and score come from the same record.<br/>C. That is the lowest score.<br/>D. That is the first row, but 8 is higher.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Vòng lặp giữ sinh viên có điểm cao nhất.<br/>B. Tên và điểm đều lấy từ cùng một bản ghi.<br/>C. Đó là điểm thấp nhất.<br/>D. Đó là hàng đầu nhưng 8 cao hơn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *s = <span class=\"hljs-string\">&quot;phase&quot;</span>;\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *p = s; *p != <span class=\"hljs-string\">&#x27;\\0&#x27;</span>; p++) {\n        <span class=\"hljs-keyword\">if</span> (*p == <span class=\"hljs-string\">&#x27;a&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;e&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;i&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;o&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;u&#x27;</span>) v++;\n    }\n    cout &lt;&lt; v;\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    <span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *s = <span class=\"hljs-string\">&quot;phase&quot;</span>;\n    <span class=\"hljs-type\">int</span> v = <span class=\"hljs-number\">0</span>;\n    <span class=\"hljs-keyword\">for</span> (<span class=\"hljs-type\">const</span> <span class=\"hljs-type\">char</span> *p = s; *p != <span class=\"hljs-string\">&#x27;\\0&#x27;</span>; p++) {\n        <span class=\"hljs-keyword\">if</span> (*p == <span class=\"hljs-string\">&#x27;a&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;e&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;i&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;o&#x27;</span> || *p == <span class=\"hljs-string\">&#x27;u&#x27;</span>) v++;\n    }\n    cout &lt;&lt; v;\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. phase has only two of the listed letters.<br/>B. *p reads the characters, so matches are found.<br/>C. The loop stops at the null terminator; a and e are counted.<br/>D. That is the length of the string.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. phase chỉ có hai chữ nằm trong danh sách.<br/>B. *p đọc các ký tự nên có tìm thấy.<br/>C. Vòng lặp dừng ở ký tự kết thúc; đếm a và e.<br/>D. Đó là độ dài chuỗi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.2,
          "prompt": "<div class=\"ml-en\"><p>What does this code print?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b = <span class=\"hljs-number\">2</span>, <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">3</span>)</span> </span>{ <span class=\"hljs-keyword\">return</span> a + b + c; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">5</span>);\n}</code></pre></div><div class=\"ml-vi\"><p>Đoạn code này in ra gì?</p><pre><code class=\"language-cpp\"><span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">f</span><span class=\"hljs-params\">(<span class=\"hljs-type\">int</span> a, <span class=\"hljs-type\">int</span> b = <span class=\"hljs-number\">2</span>, <span class=\"hljs-type\">int</span> c = <span class=\"hljs-number\">3</span>)</span> </span>{ <span class=\"hljs-keyword\">return</span> a + b + c; }\n\n<span class=\"hljs-function\"><span class=\"hljs-type\">int</span> <span class=\"hljs-title\">main</span><span class=\"hljs-params\">()</span> </span>{\n    cout &lt;&lt; <span class=\"hljs-built_in\">f</span>(<span class=\"hljs-number\">1</span>, <span class=\"hljs-number\">5</span>);\n}</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "It does not compile|||Không biên dịch được"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That uses b = 2 and c = 5, which fills from the wrong end.<br/>B. Only c takes its default: 1 + 5 + 3.<br/>C. That uses the default for b as well.<br/>D. Trailing default arguments are valid.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Cách đó gán b = 2 và c = 5, sai chiều.<br/>B. Chỉ c lấy giá trị mặc định: 1 + 5 + 3.<br/>C. Cách đó dùng cả giá trị mặc định của b.<br/>D. Đối số mặc định ở cuối là hợp lệ.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
