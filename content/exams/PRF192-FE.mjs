// PRF192 — Programming Fundamentals (C). Real FE multiple-choice papers,
// transcribed from the school's images; answers + bilingual explanations
// authored here, with every code-output answer verified by compiling and
// running the snippet. Auto-generated from the banks in _work/.
export default {
  "course": {
    "courseCode": "PRF192"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "FE-D1",
      "source": "REAL",
      "sortOrder": 0,
      "title": "Đề 1 — SP26 Block 5 Retake Exam|||Đề 1 — Thi lại Block 5 SP26",
      "description": "PRF192 real FE multiple-choice paper (Spring 2026, Block 5 retake), transcribed from the exam images; answers reasoned and code-verified here. (50 questions)|||Đề trắc nghiệm FE thật môn PRF192 (kỳ Xuân 2026, thi lại Block 5), chép từ ảnh đề; đáp án được suy luận và chạy thử mã để kiểm chứng. (50 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Some questions show C source code — read it carefully, especially operator precedence, integer division and where a loop body actually ends. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một số câu có mã nguồn C — đọc kỹ, nhất là thứ tự ưu tiên toán tử, phép chia nguyên và chỗ thân vòng lặp thực sự kết thúc. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the result when converting  0111 1011 in binary system to decimal system?|||Kết quả khi đổi số nhị phân 0111 1011 sang hệ thập phân là gì?",
          "options": [
            {
              "text": "120|||120"
            },
            {
              "text": "121|||121"
            },
            {
              "text": "122|||122"
            },
            {
              "text": "123|||123"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">0111 1011 = 64+32+16+8+0+2+1 = 123. (Weights: 64·1 + 32·1 + 16·1 + 8·1 + 4·0 + 2·1 + 1·1.)</div><div class=\"ml-vi\">0111 1011 = 64+32+16+8+0+2+1 = 123. (Trọng số: 64·1 + 32·1 + 16·1 + 8·1 + 4·0 + 2·1 + 1·1.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the line <code>scanf(&quot;%d&quot;, &amp;n);</code> do?|||Dòng lệnh <code>scanf(&quot;%d&quot;, &amp;n);</code> làm gì?",
          "options": [
            {
              "text": "Assign value to n|||Gán giá trị cho n"
            },
            {
              "text": "Print n|||In n ra màn hình"
            },
            {
              "text": "Read an integer input|||Đọc một số nguyên nhập vào"
            },
            {
              "text": "Declare n|||Khai báo n"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">scanf reads formatted input from the keyboard. <code>%d</code> reads an integer and <code>&amp;n</code> gives the address where it is stored. Declaring n happened earlier; scanf only reads.</div><div class=\"ml-vi\">scanf đọc dữ liệu nhập theo định dạng từ bàn phím. <code>%d</code> đọc một số nguyên, còn <code>&amp;n</code> là địa chỉ nơi lưu giá trị. Việc khai báo n đã làm trước đó; scanf chỉ đọc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the variable arr declared as follow<pre><code>char arr[16];</code></pre>What is the maximum number of characters you can store in arr to represent a null-terminated string?|||Cho biến arr được khai báo như sau<pre><code>char arr[16];</code></pre>Số ký tự tối đa có thể lưu trong arr để biểu diễn một chuỗi kết thúc bằng ký tự NULL là bao nhiêu?",
          "options": [
            {
              "text": "13|||13"
            },
            {
              "text": "14|||14"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A C string always ends with the terminator <code>&#x27;\\0&#x27;</code>, which occupies one slot. With 16 slots, 15 are left for real characters.</div><div class=\"ml-vi\">Chuỗi trong C luôn kết thúc bằng ký tự <code>&#x27;\\0&#x27;</code>, chiếm 1 ô. Mảng 16 ô nên chỉ còn 15 ô cho ký tự thật.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the numeric code of the NULL character?|||Mã số của ký tự NULL là bao nhiêu?",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "32|||32"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The null character <code>&#x27;\\0&#x27;</code> has ASCII code 0. (32 is the space character.)</div><div class=\"ml-vi\">Ký tự null <code>&#x27;\\0&#x27;</code> có mã ASCII bằng 0. (32 là mã của dấu cách.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following code snippet:<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a = 5;\n    {\n        int b = 10;\n        printf(&quot;%d &quot;, a);\n    }\n    // Uncommenting the line of code below will be a compilation error.\n    // printf(&quot;%d&quot;, b);\n    return 0;\n}</code></pre>Which of the following best describes the scope of a variable declared inside a block in C?|||Cho đoạn mã sau:<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a = 5;\n    {\n        int b = 10;\n        printf(&quot;%d &quot;, a);\n    }\n    // Bỏ chú thích dòng dưới sẽ gây lỗi biên dịch.\n    // printf(&quot;%d&quot;, b);\n    return 0;\n}</code></pre>Phát biểu nào mô tả ĐÚNG NHẤT phạm vi của biến khai báo bên trong một khối lệnh trong C?",
          "options": [
            {
              "text": "The variable b can be accessed only inside the inner block where it's declared.|||Biến b chỉ truy cập được bên trong khối lệnh nơi nó được khai báo."
            },
            {
              "text": "The variable b can be accessed anywhere within main() after its declaration.|||Biến b truy cập được ở bất kỳ đâu trong main() sau khi khai báo."
            },
            {
              "text": "Both variables a and b can be accessed inside the inner block.|||Cả hai biến a và b đều truy cập được bên trong khối lệnh trong."
            },
            {
              "text": "The variable b can be accessed globally throughout the program.|||Biến b truy cập được toàn cục trong cả chương trình."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A variable declared inside <code>{ }</code> is a block-local variable: it is created when the block is entered and destroyed when the block ends. So b only exists inside the inner block — that is why the commented printf would not compile. Note that option C is a trap: a IS visible inside the inner block, but b is not visible outside it, so C is not the statement being asked for.</div><div class=\"ml-vi\">Biến khai báo bên trong <code>{ }</code> là biến cục bộ của khối: nó được tạo khi vào khối và bị huỷ khi kết thúc khối. Vì vậy b chỉ tồn tại trong khối trong — đó là lý do dòng printf bị chú thích sẽ không biên dịch được. Lưu ý phương án C là bẫy: a THỰC SỰ thấy được trong khối trong, nhưng b không thấy được bên ngoài, nên C không phải phát biểu đang hỏi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the size of the char data type in bytes?|||Kiểu dữ liệu char chiếm bao nhiêu byte?",
          "options": [
            {
              "text": "1 byte|||1 byte"
            },
            {
              "text": "2 bytes|||2 byte"
            },
            {
              "text": "4 bytes|||4 byte"
            },
            {
              "text": "It depends on the system|||Tuỳ hệ thống"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By definition <code>sizeof(char) == 1</code> in C — always exactly one byte, on every platform.</div><div class=\"ml-vi\">Theo định nghĩa của C, <code>sizeof(char) == 1</code> — luôn đúng 1 byte trên mọi nền tảng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program display?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int x[] = {1, 2, 3, 4, 5};\n    int y = 1;\n    printf(&quot;%d&quot;, x[y]);\n\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int x[] = {1, 2, 3, 4, 5};\n    int y = 1;\n    printf(&quot;%d&quot;, x[y]);\n\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "An error will be raised.|||Chương trình báo lỗi."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Array indexes start at 0, so <code>x[1]</code> is the second element = 2. (Verified by running the code.)</div><div class=\"ml-vi\">Chỉ số mảng bắt đầu từ 0 nên <code>x[1]</code> là phần tử thứ hai = 2. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does this code do?<pre><code>char names[10][31];\ngets(names[0]);</code></pre>|||Đoạn mã sau làm gì?<pre><code>char names[10][31];\ngets(names[0]);</code></pre>",
          "options": [
            {
              "text": "Takes a line of input into names[0]|||Đọc một dòng nhập vào names[0]"
            },
            {
              "text": "Takes input into all 10 strings|||Đọc dữ liệu vào cả 10 chuỗi"
            },
            {
              "text": "Fails to compile|||Không biên dịch được"
            },
            {
              "text": "Only stores 1 character|||Chỉ lưu được 1 ký tự"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>names</code> is an array of 10 strings, each up to 30 characters + terminator. <code>names[0]</code> is the first string, so gets() reads one whole line into it. (gets is unsafe and removed from modern C — fgets is the correct replacement — but the exam asks what the code does.)</div><div class=\"ml-vi\"><code>names</code> là mảng 10 chuỗi, mỗi chuỗi tối đa 30 ký tự + ký tự kết thúc. <code>names[0]</code> là chuỗi đầu tiên nên gets() đọc trọn một dòng vào đó. (gets không an toàn và đã bị loại khỏi C hiện đại — nên dùng fgets — nhưng đề chỉ hỏi đoạn mã làm gì.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the <code>&#x27;\\0&#x27;</code> character in a string represent?|||Ký tự <code>&#x27;\\0&#x27;</code> trong một chuỗi biểu diễn điều gì?",
          "options": [
            {
              "text": "The null terminator in C strings|||Ký tự kết thúc chuỗi trong C"
            },
            {
              "text": "A whitespace character|||Một ký tự khoảng trắng"
            },
            {
              "text": "A printable character|||Một ký tự in được"
            },
            {
              "text": "A NULL pointer value|||Giá trị con trỏ NULL"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>&#x27;\\0&#x27;</code> (code 0) marks the end of a C string. It is a character, not a pointer — do not confuse it with <code>NULL</code>.</div><div class=\"ml-vi\"><code>&#x27;\\0&#x27;</code> (mã 0) đánh dấu kết thúc chuỗi trong C. Nó là một KÝ TỰ chứ không phải con trỏ — đừng nhầm với <code>NULL</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using DeMorgan's Law, how would you correctly negate the condition <code>(x &gt;= 10 &amp;&amp; x &lt;= 20)</code>?|||Dùng định luật De Morgan, phủ định ĐÚNG của điều kiện <code>(x &gt;= 10 &amp;&amp; x &lt;= 20)</code> là gì?",
          "options": [
            {
              "text": "<code>(x &lt; 10 || x &gt; 20)</code>|||<code>(x &lt; 10 || x &gt; 20)</code>"
            },
            {
              "text": "<code>(x &gt; 10 &amp;&amp; x &lt; 20)</code>|||<code>(x &gt; 10 &amp;&amp; x &lt; 20)</code>"
            },
            {
              "text": "<code>(x &lt; 10 &amp;&amp; x &gt; 20)</code>|||<code>(x &lt; 10 &amp;&amp; x &gt; 20)</code>"
            },
            {
              "text": "<code>!(x &gt;= 10 || x &lt;= 20)</code>|||<code>!(x &gt;= 10 || x &lt;= 20)</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">De Morgan: <code>!(A &amp;&amp; B)</code> becomes <code>!A || !B</code>. Here <code>!(x &gt;= 10)</code> is <code>x &lt; 10</code> and <code>!(x &lt;= 20)</code> is <code>x &gt; 20</code>, joined by OR. Option C is impossible (no x is both < 10 and > 20).</div><div class=\"ml-vi\">De Morgan: <code>!(A &amp;&amp; B)</code> thành <code>!A || !B</code>. Ở đây <code>!(x &gt;= 10)</code> là <code>x &lt; 10</code> và <code>!(x &lt;= 20)</code> là <code>x &gt; 20</code>, nối bằng OR. Phương án C là vô lý (không x nào vừa < 10 vừa > 20).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is the correct syntax for a for loop in C?|||Cú pháp ĐÚNG của vòng lặp for trong C là gì?",
          "options": [
            {
              "text": "<code>for (initialization, condition, increment) { statements; }</code>|||<code>for (initialization, condition, increment) { statements; }</code>"
            },
            {
              "text": "<code>for { initialization; condition; increment; } (statements;)</code>|||<code>for { initialization; condition; increment; } (statements;)</code>"
            },
            {
              "text": "<code>for (initialization; condition; increment) { statements; }</code>|||<code>for (initialization; condition; increment) { statements; }</code>"
            },
            {
              "text": "<code>for: (initialization; condition; increment) { statements; }</code>|||<code>for: (initialization; condition; increment) { statements; }</code>"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The three parts of a for header are separated by SEMICOLONS inside parentheses, and the body follows in braces. Commas (option A) would make it a single comma-expression, not three clauses.</div><div class=\"ml-vi\">Ba thành phần trong đầu vòng for được ngăn cách bằng DẤU CHẤM PHẨY trong ngoặc tròn, thân vòng lặp đặt trong ngoặc nhọn. Dùng dấu phẩy (phương án A) sẽ thành một biểu thức phẩy chứ không phải ba mệnh đề.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How to declare a variable in C language?|||Khai báo một biến trong ngôn ngữ C như thế nào?",
          "options": [
            {
              "text": "All variables must be declared before we use them in C program.|||Mọi biến phải được khai báo trước khi sử dụng trong chương trình C."
            },
            {
              "text": "To declare a variable you specify its name and data type it can store.|||Để khai báo một biến, bạn chỉ ra tên biến và kiểu dữ liệu nó lưu trữ."
            },
            {
              "text": "All variable are always stored on the stack.|||Mọi biến luôn được lưu trên vùng nhớ stack."
            },
            {
              "text": "Reading a value from keyboard or other device with a OUT statement|||Đọc một giá trị từ bàn phím hoặc thiết bị khác bằng lệnh OUT"
            },
            {
              "text": "The scope of a variable is the range of program statements that can't access that variable.|||Phạm vi của biến là tập các câu lệnh KHÔNG truy cập được biến đó."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The question asks HOW to declare: a declaration is written as <code>&lt;type&gt; &lt;name&gt;;</code> — you state the data type and the name. Option A is a true rule about C but it does not describe how to declare; C is false (globals/statics live in static storage); D describes input, not declaration; E inverts the definition of scope.</div><div class=\"ml-vi\">Câu hỏi hỏi CÁCH khai báo: một khai báo viết dạng <code>&lt;kiểu&gt; &lt;tên&gt;;</code> — nêu kiểu dữ liệu và tên biến. Phương án A là một quy tắc đúng của C nhưng không mô tả cách khai báo; C sai (biến toàn cục/static nằm ở vùng nhớ tĩnh); D mô tả việc nhập dữ liệu; E định nghĩa ngược về phạm vi biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following C code?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int x = 0;\n    if (x == 0)\n        printf(&quot;Hi&quot;);\n    else\n        printf(&quot;How are you&quot;);\n        printf(&quot;Hello&quot;);\n}</code></pre>|||Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int x = 0;\n    if (x == 0)\n        printf(&quot;Hi&quot;);\n    else\n        printf(&quot;How are you&quot;);\n        printf(&quot;Hello&quot;);\n}</code></pre>",
          "options": [
            {
              "text": "Hi|||Hi"
            },
            {
              "text": "How are you|||How are you"
            },
            {
              "text": "Hello|||Hello"
            },
            {
              "text": "HiHello|||HiHello"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Indentation does not create a block in C. Without braces, the else owns ONLY <code>printf(&quot;How are you&quot;);</code>. The last <code>printf(&quot;Hello&quot;);</code> is outside the if/else and always runs. x == 0 is true → prints \"Hi\", then \"Hello\" → HiHello. (Verified by running the code.)</div><div class=\"ml-vi\">Thụt lề KHÔNG tạo ra khối lệnh trong C. Không có ngoặc nhọn thì else chỉ bao gồm <code>printf(&quot;How are you&quot;);</code>. Lệnh <code>printf(&quot;Hello&quot;);</code> cuối nằm ngoài if/else nên luôn chạy. x == 0 đúng → in \"Hi\", rồi \"Hello\" → HiHello. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is incorrect statement in C programming?|||Phát biểu nào SAI trong lập trình C?",
          "options": [
            {
              "text": "#define is a preprocessor command often used to introduce named constants|||#define là chỉ thị tiền xử lý thường dùng để đặt hằng số có tên"
            },
            {
              "text": "double and goto are keyword for declaring data type.|||double và goto là từ khoá dùng để khai báo kiểu dữ liệu."
            },
            {
              "text": "return 0; is normally the last statement in main()|||return 0; thường là câu lệnh cuối cùng trong main()"
            },
            {
              "text": "The file stdio.h is the library where the compiler finds scanf().|||Tệp stdio.h là thư viện nơi trình biên dịch tìm thấy scanf()."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>double</code> is indeed a data type, but <code>goto</code> is a jump statement, not a data type — so B is the false statement. A, C and D are all correct.</div><div class=\"ml-vi\"><code>double</code> đúng là một kiểu dữ liệu, nhưng <code>goto</code> là câu lệnh nhảy chứ không phải kiểu dữ liệu — nên B là phát biểu sai. A, C và D đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does this code print?<pre><code>int n = 30, m = 5;\nfloat x = 3.5F, y = 8.12F;\nprintf(&quot;%d, %d\\n&quot;, (n &lt; m || x &gt;= y), !(x &gt; y));</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int n = 30, m = 5;\nfloat x = 3.5F, y = 8.12F;\nprintf(&quot;%d, %d\\n&quot;, (n &lt; m || x &gt;= y), !(x &gt; y));</code></pre>",
          "options": [
            {
              "text": "1, 0|||1, 0"
            },
            {
              "text": "0, 1|||0, 1"
            },
            {
              "text": "1, 1|||1, 1"
            },
            {
              "text": "0, 0|||0, 0"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">First value: n &lt; m is 30 &lt; 5 = 0 and x &gt;= y is 3.5 &gt;= 8.12 = 0, so 0 || 0 = 0. Second value: x &gt; y is 3.5 &gt; 8.12 = 0, so !0 = 1. Output \"0, 1\". (Verified by running the code.)</div><div class=\"ml-vi\">Giá trị đầu: n &lt; m là 30 &lt; 5 = 0 và x &gt;= y là 3.5 &gt;= 8.12 = 0, nên 0 || 0 = 0. Giá trị sau: x &gt; y là 3.5 &gt; 8.12 = 0, nên !0 = 1. Kết quả \"0, 1\". (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code?<pre><code>int a = 10, b = 20;\nprintf(&quot;%d&quot;, (a &gt; 5 &amp;&amp; b &lt; 25));</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int a = 10, b = 20;\nprintf(&quot;%d&quot;, (a &gt; 5 &amp;&amp; b &lt; 25));</code></pre>",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "20|||20"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">a &gt; 5 is true and b &lt; 25 is true, so the AND is true. In C a true relational expression evaluates to the int value 1.</div><div class=\"ml-vi\">a &gt; 5 đúng và b &lt; 25 đúng nên phép AND đúng. Trong C, biểu thức quan hệ đúng có giá trị nguyên là 1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will the following program print?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n  int x = 5, y = 10;\n\n    while(x++ &lt; y--)\n    {\n        printf(&quot;%d %d\\n&quot;, x, y);\n    }\n\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n  int x = 5, y = 10;\n\n    while(x++ &lt; y--)\n    {\n        printf(&quot;%d %d\\n&quot;, x, y);\n    }\n\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "2 5<br>3 4<br>4 3|||2 5<br>3 4<br>4 3"
            },
            {
              "text": "6 9<br>7 8<br>8 7|||6 9<br>7 8<br>8 7"
            },
            {
              "text": "5 10<br>7 8<br>8 7|||5 10<br>7 8<br>8 7"
            },
            {
              "text": "6 9<br>2 2<br>8 7|||6 9<br>2 2<br>8 7"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Post-increment compares the OLD values, then updates. Pass 1: compare 5 &lt; 10 (true) → x=6, y=9 → prints \"6 9\". Pass 2: compare 6 &lt; 9 (true) → x=7, y=8 → \"7 8\". Pass 3: compare 7 &lt; 8 (true) → x=8, y=7 → \"8 7\". Pass 4: compare 8 &lt; 7 (false) → loop ends. (Verified by running the code.)</div><div class=\"ml-vi\">Toán tử tăng sau so sánh giá trị CŨ rồi mới cập nhật. Lượt 1: so 5 &lt; 10 (đúng) → x=6, y=9 → in \"6 9\". Lượt 2: so 6 &lt; 9 (đúng) → x=7, y=8 → \"7 8\". Lượt 3: so 7 &lt; 8 (đúng) → x=8, y=7 → \"8 7\". Lượt 4: so 8 &lt; 7 (sai) → thoát vòng lặp. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main purpose of a module in programming?|||Mục đích chính của một module trong lập trình là gì?",
          "options": [
            {
              "text": "To carry out a specific function and may be used alone or combined with other modules to create a program|||Thực hiện một chức năng cụ thể, có thể dùng riêng lẻ hoặc kết hợp với các module khác để tạo thành chương trình"
            },
            {
              "text": "To store data in a database|||Lưu trữ dữ liệu trong cơ sở dữ liệu"
            },
            {
              "text": "To handle user input exclusively|||Chỉ để xử lý dữ liệu người dùng nhập"
            },
            {
              "text": "To perform arithmetic calculations only|||Chỉ để thực hiện các phép tính số học"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A module (in C: a function or a .c/.h pair) is a self-contained unit that performs one specific job and can be reused and combined. The other options describe only narrow special cases.</div><div class=\"ml-vi\">Module (trong C là một hàm, hoặc cặp file .c/.h) là một đơn vị độc lập thực hiện một nhiệm vụ cụ thể, có thể tái sử dụng và ghép nối. Các phương án còn lại chỉ là trường hợp hẹp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following switch statement will correctly compute the result for the expression 5 * 4?<pre><code>double result;\nchar op = &#x27;*&#x27;;\nint num1 = 5, num2 = 4;\nswitch (op) {\n    case &#x27;+&#x27;: result = num1 + num2; break;\n    case &#x27;-&#x27;: result = num1 - num2; break;\n    case &#x27;*&#x27;: result = num1 * num2; break;\n    case &#x27;/&#x27;: if (num2 != 0) result = num1 / num2; break;\n    default: printf(&quot;Invalid Operator&quot;);\n}\nprintf(&quot;%d&quot;, result);</code></pre>|||Đoạn switch sau in ra kết quả nào cho biểu thức 5 * 4?<pre><code>double result;\nchar op = &#x27;*&#x27;;\nint num1 = 5, num2 = 4;\nswitch (op) {\n    case &#x27;+&#x27;: result = num1 + num2; break;\n    case &#x27;-&#x27;: result = num1 - num2; break;\n    case &#x27;*&#x27;: result = num1 * num2; break;\n    case &#x27;/&#x27;: if (num2 != 0) result = num1 / num2; break;\n    default: printf(&quot;Invalid Operator&quot;);\n}\nprintf(&quot;%d&quot;, result);</code></pre>",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "9|||9"
            },
            {
              "text": "1.25|||1.25"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The switch itself is fine: result becomes 20.0. The bug is the last line — <code>%d</code> is the specifier for int, but result is a <code>double</code>. The mismatch is undefined behaviour: printf reads an integer register that never received the value, and the program prints 0, not 20. The correct specifier would be <code>%f</code> (or <code>%.0f</code>). Verified by compiling and running this exact code.</div><div class=\"ml-vi\">Bản thân switch không sai: result nhận giá trị 20.0. Lỗi nằm ở dòng cuối — <code>%d</code> là định dạng cho số nguyên, trong khi result là <code>double</code>. Sai định dạng gây hành vi không xác định: printf đọc thanh ghi số nguyên vốn không hề chứa giá trị, và chương trình in ra 0 chứ không phải 20. Định dạng đúng phải là <code>%f</code> (hoặc <code>%.0f</code>). Đã biên dịch và chạy đúng đoạn mã này để kiểm chứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following about the switch case statement is true?|||Phát biểu nào về câu lệnh switch case là ĐÚNG?",
          "options": [
            {
              "text": "It can only be used with integer or character type expressions.|||Chỉ dùng được với biểu thức kiểu số nguyên hoặc ký tự."
            },
            {
              "text": "It can be used with any data type.|||Dùng được với mọi kiểu dữ liệu."
            },
            {
              "text": "It can only be used in functions.|||Chỉ dùng được bên trong hàm."
            },
            {
              "text": "It can only have one case statement inside.|||Bên trong chỉ được có một nhãn case."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The controlling expression of a switch must have integer type — <code>int</code>, <code>char</code>, <code>enum</code> and other integer types. Floating-point values and strings are NOT allowed, which rules out B. C and D are simply false.</div><div class=\"ml-vi\">Biểu thức điều khiển của switch phải có kiểu nguyên — <code>int</code>, <code>char</code>, <code>enum</code> và các kiểu nguyên khác. KHÔNG dùng được với số thực hay chuỗi, nên B sai. C và D đều sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output when the sample code below is executed?<pre><code>#include &lt;stdio.h&gt;\nint  main()\n{\n        int x=7;\n        for(;x&gt;3;)\n          printf(&quot;Yes&quot;);\n          x--;\n    return 0;\n}</code></pre>|||Đoạn mã sau chạy ra kết quả gì?<pre><code>#include &lt;stdio.h&gt;\nint  main()\n{\n        int x=7;\n        for(;x&gt;3;)\n          printf(&quot;Yes&quot;);\n          x--;\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "Infinite loop|||Vòng lặp vô hạn"
            },
            {
              "text": "Compile time error|||Lỗi biên dịch"
            },
            {
              "text": "YesYesYesYes|||YesYesYesYes"
            },
            {
              "text": "Yes|||Yes"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The for header has no increment part, and the body — with no braces — is only <code>printf(&quot;Yes&quot;);</code>. The <code>x--;</code> is indented to look like part of the loop but is OUTSIDE it, so x stays 7 forever and <code>x &gt; 3</code> is always true → infinite loop.</div><div class=\"ml-vi\">Đầu vòng for không có phần tăng, và thân vòng — do không có ngoặc nhọn — chỉ là <code>printf(&quot;Yes&quot;);</code>. Lệnh <code>x--;</code> được thụt lề trông như thuộc vòng lặp nhưng thực tế nằm NGOÀI, nên x luôn bằng 7 và <code>x &gt; 3</code> luôn đúng → lặp vô hạn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will happen if the condition in a while loop is initially false?|||Điều gì xảy ra nếu điều kiện của vòng while sai ngay từ đầu?",
          "options": [
            {
              "text": "The loop is skipped entirely.|||Vòng lặp bị bỏ qua hoàn toàn."
            },
            {
              "text": "The loop executes indefinitely.|||Vòng lặp chạy vô hạn."
            },
            {
              "text": "The loop executes once and then terminates.|||Vòng lặp chạy đúng một lần rồi kết thúc."
            },
            {
              "text": "An error occurs.|||Chương trình báo lỗi."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <code>while</code> loop tests its condition BEFORE each pass, so a false condition means the body never runs. (Only <code>do...while</code> guarantees at least one pass — that is option C's case.)</div><div class=\"ml-vi\">Vòng <code>while</code> kiểm tra điều kiện TRƯỚC mỗi lượt, nên điều kiện sai ngay từ đầu thì thân vòng không chạy lần nào. (Chỉ <code>do...while</code> mới đảm bảo chạy ít nhất một lần — đó là trường hợp của phương án C.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the purpose of the function <code>void atoi (const char*)</code>?|||Hàm <code>void atoi (const char*)</code> dùng để làm gì?",
          "options": [
            {
              "text": "Converts a string to an integer|||Chuyển một chuỗi thành số nguyên"
            },
            {
              "text": "Converts an integer to a string|||Chuyển một số nguyên thành chuỗi"
            },
            {
              "text": "Copy a string|||Sao chép một chuỗi"
            },
            {
              "text": "Converts a string to a number|||Chuyển một chuỗi thành số"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The name says it: atoi = \"ASCII to integer\". It parses a string such as \"123\" and returns the int 123. Option D is deliberately vague — \"a number\" would be <code>atof</code> for a floating-point value; atoi returns specifically an integer.</div><div class=\"ml-vi\">Chính cái tên đã nói lên: atoi = \"ASCII to integer\". Hàm phân tích chuỗi như \"123\" và trả về số nguyên 123. Phương án D cố tình mơ hồ — \"một số\" (số thực) là việc của <code>atof</code>; atoi trả về đúng kiểu số nguyên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which library in C is used for mathematical calculations?|||Thư viện nào trong C dùng cho các phép tính toán học?",
          "options": [
            {
              "text": "math.h|||math.h"
            },
            {
              "text": "stdlib.h|||stdlib.h"
            },
            {
              "text": "time.h|||time.h"
            },
            {
              "text": "ctype.h|||ctype.h"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>math.h</code> declares sqrt, pow, sin, cos, fabs, ceil, floor… <code>stdlib.h</code> is general utilities (malloc, atoi, rand), <code>time.h</code> is dates/time, <code>ctype.h</code> is character classification.</div><div class=\"ml-vi\"><code>math.h</code> khai báo sqrt, pow, sin, cos, fabs, ceil, floor… <code>stdlib.h</code> là tiện ích chung (malloc, atoi, rand), <code>time.h</code> về thời gian, <code>ctype.h</code> phân loại ký tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which follows the function used to remove the keyboard buffer?|||Hàm nào dùng để xoá bộ đệm bàn phím?",
          "options": [
            {
              "text": "fflush()|||fflush()"
            },
            {
              "text": "clearbuffer()|||clearbuffer()"
            },
            {
              "text": "clear input()|||clear input()"
            },
            {
              "text": "clrscr()|||clrscr()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>fflush(stdin)</code> is the form taught in this course for clearing the input buffer (typically after a scanf leaves a newline behind). <code>clrscr()</code> clears the SCREEN, not the buffer; the other two do not exist.</div><div class=\"ml-vi\"><code>fflush(stdin)</code> là cách được dạy trong môn này để xoá bộ đệm nhập (thường dùng sau scanf còn sót ký tự xuống dòng). <code>clrscr()</code> xoá MÀN HÌNH chứ không phải bộ đệm; hai hàm còn lại không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be printed when the following program is executed?<pre><code>#include &lt;stdio.h&gt;\n\nint f(int a, int b, int c) {\n    int t = 2*(a+b-c)/5;\n    return t;\n}\n\nint main() {\n    int x = 5, y = 6, z = 7;\n    int t = 3*f(y,x,z);\n    printf(&quot;%d&quot;, t);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint f(int a, int b, int c) {\n    int t = 2*(a+b-c)/5;\n    return t;\n}\n\nint main() {\n    int x = 5, y = 6, z = 7;\n    int t = 3*f(y,x,z);\n    printf(&quot;%d&quot;, t);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Watch the argument order: <code>f(y,x,z)</code> means a=6, b=5, c=7. Then t = 2*(6+5-7)/5 = 2*4/5 = 8/5 = 1 by INTEGER division (the remainder is discarded). Back in main: 3*1 = 3. (Verified by running the code.)</div><div class=\"ml-vi\">Chú ý thứ tự đối số: <code>f(y,x,z)</code> nghĩa là a=6, b=5, c=7. Khi đó t = 2*(6+5-7)/5 = 2*4/5 = 8/5 = 1 do chia NGUYÊN (bỏ phần dư). Trở lại main: 3*1 = 3. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which library contains the abs() function?|||Thư viện nào chứa hàm abs()?",
          "options": [
            {
              "text": "time.h|||time.h"
            },
            {
              "text": "conio.h|||conio.h"
            },
            {
              "text": "math.h|||math.h"
            },
            {
              "text": "stdlib.h|||stdlib.h"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><code>abs()</code> (absolute value of an INT) is declared in <code>stdlib.h</code>. The floating-point version <code>fabs()</code> is the one in <code>math.h</code> — that is the trap in this question.</div><div class=\"ml-vi\"><code>abs()</code> (trị tuyệt đối của số NGUYÊN) được khai báo trong <code>stdlib.h</code>. Bản dành cho số thực là <code>fabs()</code> mới nằm trong <code>math.h</code> — đó chính là bẫy của câu này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is incorrect about function prototype?|||Nguyên mẫu hàm nào SAI?",
          "options": [
            {
              "text": "<code>void printSum(int* a, int b);</code>|||<code>void printSum(int* a, int b);</code>"
            },
            {
              "text": "<code>int printSum(int* a, int b);</code>|||<code>int printSum(int* a, int b);</code>"
            },
            {
              "text": "<code>int printSum(int a, b);</code>|||<code>int printSum(int a, b);</code>"
            },
            {
              "text": "<code>int* printSum(int* a, int b);</code>|||<code>int* printSum(int* a, int b);</code>"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In C every parameter needs its OWN type. In option C the second parameter <code>b</code> has no type, so it is invalid — you must write <code>int a, int b</code>. The other three prototypes are all legal (they differ only in return type).</div><div class=\"ml-vi\">Trong C, mỗi tham số phải có kiểu RIÊNG. Ở phương án C, tham số thứ hai <code>b</code> không có kiểu nên sai — phải viết <code>int a, int b</code>. Ba nguyên mẫu còn lại đều hợp lệ (chỉ khác kiểu trả về).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the C language, which method is used when a function receives a copy of the argument's value, ensuring that changes inside the function do not affect the original variable?|||Trong ngôn ngữ C, cách truyền tham số nào khiến hàm nhận một BẢN SAO giá trị của đối số, đảm bảo thay đổi bên trong hàm không ảnh hưởng biến gốc?",
          "options": [
            {
              "text": "Pass by value|||Truyền theo giá trị (Pass by value)"
            },
            {
              "text": "Pass by reference|||Truyền theo tham chiếu (Pass by reference)"
            },
            {
              "text": "Pass by address|||Truyền theo địa chỉ (Pass by address)"
            },
            {
              "text": "Pass by pointer|||Truyền theo con trỏ (Pass by pointer)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Pass by value copies the argument into the parameter, so the original is untouched. Passing an address/pointer (options C and D) is exactly the technique you use when you DO want the function to modify the caller's variable. (True pass-by-reference does not exist in C — that is C++.)</div><div class=\"ml-vi\">Truyền theo giá trị sao chép đối số vào tham số nên biến gốc không đổi. Truyền địa chỉ/con trỏ (phương án C và D) chính là kỹ thuật dùng khi bạn MUỐN hàm sửa được biến của nơi gọi. (C không có tham chiếu thật sự — đó là của C++.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the value of variable a after executing the following lines of codes:<pre><code>int a = 0;\nchar line1[] = &quot;Hi&quot;;\nchar line2[] = &quot;Hello&quot;;\na = strcmp(line1, line2);</code></pre>|||Giá trị của biến a sau khi chạy các dòng sau là gì:<pre><code>int a = 0;\nchar line1[] = &quot;Hi&quot;;\nchar line2[] = &quot;Hello&quot;;\na = strcmp(line1, line2);</code></pre>",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "A positive value|||Một giá trị dương"
            },
            {
              "text": "A negative value|||Một giá trị âm"
            },
            {
              "text": "NAN|||NAN"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">strcmp compares character by character. The first characters match ('H'), the second differ: 'i' (105) vs 'e' (101). Since 105 &gt; 101, strcmp returns a positive number (4 on this compiler). Verified by running the code.</div><div class=\"ml-vi\">strcmp so sánh từng ký tự. Ký tự đầu giống nhau ('H'), ký tự thứ hai khác: 'i' (105) so với 'e' (101). Vì 105 &gt; 101 nên strcmp trả về số dương (bằng 4 trên trình biên dịch này). Đã chạy thử kiểm chứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the correct way to ensure a different sequence of random numbers in each program run?|||Cách ĐÚNG để mỗi lần chạy chương trình cho một dãy số ngẫu nhiên khác nhau là gì?",
          "options": [
            {
              "text": "<code>rand(time(0));</code>|||<code>rand(time(0));</code>"
            },
            {
              "text": "<code>srand(time(NULL));</code>|||<code>srand(time(NULL));</code>"
            },
            {
              "text": "<code>srand();</code>|||<code>srand();</code>"
            },
            {
              "text": "<code>randomize();</code>|||<code>randomize();</code>"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>srand()</code> seeds the generator and <code>time(NULL)</code> gives a value that changes every second, so each run starts from a different seed. <code>rand()</code> takes no argument (option A is wrong), <code>srand()</code> requires one (option C is wrong), and <code>randomize()</code> is a non-standard Turbo C function.</div><div class=\"ml-vi\"><code>srand()</code> gieo hạt cho bộ sinh số, còn <code>time(NULL)</code> cho giá trị thay đổi từng giây nên mỗi lần chạy bắt đầu từ một hạt khác nhau. <code>rand()</code> không nhận đối số (phương án A sai), <code>srand()</code> bắt buộc phải có đối số (phương án C sai), còn <code>randomize()</code> là hàm không chuẩn của Turbo C.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is an array in C programming?|||Mảng trong lập trình C là gì?",
          "options": [
            {
              "text": "A collection of elements of the same data type stored in contiguous memory locations.|||Một tập hợp các phần tử CÙNG kiểu dữ liệu, lưu ở các ô nhớ LIÊN TIẾP nhau."
            },
            {
              "text": "A single variable that holds multiple values of different data types.|||Một biến đơn lưu nhiều giá trị thuộc các kiểu dữ liệu khác nhau."
            },
            {
              "text": "A pointer to a single element in memory|||Một con trỏ tới một phần tử đơn lẻ trong bộ nhớ"
            },
            {
              "text": "A function that performs mathematical calculations.|||Một hàm thực hiện các phép tính toán học."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Two properties define a C array: all elements share ONE data type, and they sit in CONTIGUOUS memory — which is exactly why <code>a[i]</code> can be computed as an offset from the base address. Mixed types (option B) would be a <code>struct</code>.</div><div class=\"ml-vi\">Hai đặc điểm định nghĩa mảng trong C: mọi phần tử CÙNG MỘT kiểu dữ liệu, và chúng nằm LIỀN KỀ trong bộ nhớ — chính vì thế <code>a[i]</code> được tính bằng độ dời từ địa chỉ đầu. Nhiều kiểu khác nhau (phương án B) là <code>struct</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output when the sample code below is executed?<pre><code>#include&lt;stdio.h&gt;\nvoid increment(int *ptr) {\n   (*ptr)++;\n}\nint main(){\n     int x=1005;\n     increment(&amp;x);\n     printf(&quot;%d &quot;,x);\n}</code></pre>|||Đoạn mã sau chạy ra kết quả gì?<pre><code>#include&lt;stdio.h&gt;\nvoid increment(int *ptr) {\n   (*ptr)++;\n}\nint main(){\n     int x=1005;\n     increment(&amp;x);\n     printf(&quot;%d &quot;,x);\n}</code></pre>",
          "options": [
            {
              "text": "1006|||1006"
            },
            {
              "text": "1005|||1005"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "1007|||1007"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>&amp;x</code> passes the ADDRESS of x, so <code>(*ptr)++</code> increments the variable x itself, not a copy: 1005 → 1006. Note the parentheses matter — <code>*ptr++</code> would increment the pointer instead. (Verified by running the code.)</div><div class=\"ml-vi\"><code>&amp;x</code> truyền ĐỊA CHỈ của x nên <code>(*ptr)++</code> tăng chính biến x chứ không phải bản sao: 1005 → 1006. Lưu ý cặp ngoặc rất quan trọng — <code>*ptr++</code> sẽ tăng con trỏ chứ không tăng giá trị. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code?<pre><code>int a[5] = {1, 2, 3, 4, 5};\nprintf(&quot;%d&quot;, a);</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int a[5] = {1, 2, 3, 4, 5};\nprintf(&quot;%d&quot;, a);</code></pre>",
          "options": [
            {
              "text": "Address of the first element of array a|||Địa chỉ của phần tử đầu tiên của mảng a"
            },
            {
              "text": "Compiler error|||Lỗi biên dịch"
            },
            {
              "text": "Garbage value|||Giá trị rác"
            },
            {
              "text": "Error: mismatched format specifier in printf|||Lỗi: sai định dạng trong printf"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The name of an array decays to a pointer to its first element, so <code>a</code> is the address <code>&amp;a[0]</code>. Printing it with <code>%d</code> is a type mismatch (the proper specifier is <code>%p</code>) — the compiler only warns, and the value shown is that address.</div><div class=\"ml-vi\">Tên mảng tự chuyển thành con trỏ tới phần tử đầu, nên <code>a</code> chính là địa chỉ <code>&amp;a[0]</code>. In bằng <code>%d</code> là sai kiểu (đúng ra phải dùng <code>%p</code>) — trình biên dịch chỉ cảnh báo, còn giá trị hiện ra chính là địa chỉ đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the variable \"sum\" in the following code:<pre><code>int a[] = {1, 2, 3, 4, 5}, i;\nfloat sum = 0;\nfor (i = 0; i &lt; 4; i++)  {\n     sum = sum + a[i]/a[i+1];\n}\nprintf(&quot;%.2f&quot;, sum);</code></pre>|||Biến \"sum\" trong đoạn mã sau in ra giá trị nào:<pre><code>int a[] = {1, 2, 3, 4, 5}, i;\nfloat sum = 0;\nfor (i = 0; i &lt; 4; i++)  {\n     sum = sum + a[i]/a[i+1];\n}\nprintf(&quot;%.2f&quot;, sum);</code></pre>",
          "options": [
            {
              "text": "0.00|||0.00"
            },
            {
              "text": "2.72|||2.72"
            },
            {
              "text": "2.80|||2.80"
            },
            {
              "text": "Runtime Error|||Lỗi khi chạy"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The trap is that a[i] and a[i+1] are both <code>int</code>, so <code>a[i]/a[i+1]</code> is INTEGER division and the result is truncated before it ever reaches the float: 1/2=0, 2/3=0, 3/4=0, 4/5=0. Sum stays 0.00. To get the real quotient you would need a cast, e.g. <code>(float)a[i]/a[i+1]</code>. (Verified by running the code.)</div><div class=\"ml-vi\">Bẫy nằm ở chỗ a[i] và a[i+1] đều là <code>int</code> nên <code>a[i]/a[i+1]</code> là phép chia NGUYÊN, kết quả bị cắt phần thập phân trước khi gán vào float: 1/2=0, 2/3=0, 3/4=0, 4/5=0. Tổng vẫn là 0.00. Muốn ra thương thật phải ép kiểu, ví dụ <code>(float)a[i]/a[i+1]</code>. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following code print?<pre><code>#include &lt;stdio.h&gt;\nvoid swap(int a, int *b) {\n    int temp = a;\n    a = *b;\n    *b = temp;\n}\nint main() {\n    int x = 5;\n    int y = 10;\n    swap(x, y);\n    printf(&quot;x = %d, y = %d\\n&quot;, x, y);\n    return 0;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nvoid swap(int a, int *b) {\n    int temp = a;\n    a = *b;\n    *b = temp;\n}\nint main() {\n    int x = 5;\n    int y = 10;\n    swap(x, y);\n    printf(&quot;x = %d, y = %d\\n&quot;, x, y);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "Runtime error.|||Lỗi khi chạy."
            },
            {
              "text": "Compiler error.|||Lỗi biên dịch."
            },
            {
              "text": "x = 5, y = 10|||x = 5, y = 10"
            },
            {
              "text": "x = 10, y = 5|||x = 10, y = 5"
            },
            {
              "text": "x = 10, y = 10|||x = 10, y = 10"
            },
            {
              "text": "x = 5, y = 5|||x = 5, y = 5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The second parameter is declared <code>int *b</code> but the call passes <code>y</code>, a plain <code>int</code>. Passing an int where a pointer is expected is an incompatible-type error, so the program never compiles. The correct call would be <code>swap(x, &amp;y);</code>. Verified: the compiler reports \"incompatible integer to pointer conversion passing 'int' to parameter of type 'int *'\".</div><div class=\"ml-vi\">Tham số thứ hai khai báo là <code>int *b</code> nhưng lời gọi lại truyền <code>y</code> — một <code>int</code> thường. Truyền int vào chỗ cần con trỏ là lỗi không tương thích kiểu nên chương trình không biên dịch được. Lời gọi đúng phải là <code>swap(x, &amp;y);</code>. Đã kiểm chứng: trình biên dịch báo \"incompatible integer to pointer conversion passing 'int' to parameter of type 'int *'\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will the following program output?<pre><code>#include &lt;stdio.h&gt;\n#define ANSWER 42\n\nint main() {\n    printf(&quot;%d&quot;, ANSWER);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n#define ANSWER 42\n\nint main() {\n    printf(&quot;%d&quot;, ANSWER);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "42|||42"
            },
            {
              "text": "ANSWER|||ANSWER"
            },
            {
              "text": "Compilation Error|||Lỗi biên dịch"
            },
            {
              "text": "No Output|||Không in gì"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>#define</code> is a preprocessor macro: before compilation the token <code>ANSWER</code> is textually replaced by <code>42</code>, so the line becomes <code>printf(&quot;%d&quot;, 42);</code>.</div><div class=\"ml-vi\"><code>#define</code> là macro của bộ tiền xử lý: trước khi biên dịch, tên <code>ANSWER</code> được thay thế nguyên văn bằng <code>42</code>, nên dòng lệnh thành <code>printf(&quot;%d&quot;, 42);</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In C programming, a variable is frequently used to store the address of another variable. What is the name of this variable?|||Trong lập trình C, biến dùng để lưu ĐỊA CHỈ của một biến khác được gọi là gì?",
          "options": [
            {
              "text": "Pointer|||Con trỏ (Pointer)"
            },
            {
              "text": "Address|||Địa chỉ (Address)"
            },
            {
              "text": "Integer|||Số nguyên (Integer)"
            },
            {
              "text": "Byte|||Byte"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A variable whose value is an address is called a pointer, declared with <code>*</code>, e.g. <code>int *p = &amp;x;</code>. \"Address\" is what it STORES, not the name of the variable type.</div><div class=\"ml-vi\">Biến có giá trị là một địa chỉ được gọi là con trỏ, khai báo với dấu <code>*</code>, ví dụ <code>int *p = &amp;x;</code>. \"Địa chỉ\" là thứ nó LƯU, không phải tên gọi của loại biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume we have a snippet code in C:<pre><code>int main() {\n   int *p = NULL;\n   printf(&quot;%d&quot;,p);\n   getchar();\n   return 0;\n}</code></pre>The output will be:|||Cho đoạn mã C sau:<pre><code>int main() {\n   int *p = NULL;\n   printf(&quot;%d&quot;,p);\n   getchar();\n   return 0;\n}</code></pre>Kết quả in ra là:",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "100|||100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>NULL</code> is the null pointer constant, whose value is 0, so printing it as an integer shows 0. Note the program only PRINTS the pointer — it never dereferences it, so there is no crash. (Verified by running the code.)</div><div class=\"ml-vi\"><code>NULL</code> là hằng con trỏ rỗng, giá trị bằng 0, nên in ra dưới dạng số nguyên sẽ được 0. Lưu ý chương trình chỉ IN con trỏ chứ không truy xuất nội dung nó trỏ tới nên không bị lỗi sập. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following program?<pre><code>int main()\n{\n        int i = 100;\n        int *p = &amp;i;\n        *p +=2;\n        printf(&quot;%d, %d&quot;, i, *p);\n        getchar();\n        return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>int main()\n{\n        int i = 100;\n        int *p = &amp;i;\n        *p +=2;\n        printf(&quot;%d, %d&quot;, i, *p);\n        getchar();\n        return 0;\n}</code></pre>",
          "options": [
            {
              "text": "102, 102|||102, 102"
            },
            {
              "text": "100, 102|||100, 102"
            },
            {
              "text": "100, 100|||100, 100"
            },
            {
              "text": "102, 100|||102, 100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>p</code> points at <code>i</code>, so <code>*p += 2</code> adds 2 to i itself. After that i and *p are two names for the SAME memory cell holding 102 → \"102, 102\". (Verified by running the code.)</div><div class=\"ml-vi\"><code>p</code> trỏ tới <code>i</code> nên <code>*p += 2</code> cộng 2 vào chính biến i. Sau đó i và *p là hai cách gọi CÙNG một ô nhớ chứa 102 → \"102, 102\". (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What represents dynamic allocation in C?|||Đâu là cấp phát bộ nhớ ĐỘNG trong C?",
          "options": [
            {
              "text": "<code>int* a = (int*)malloc(5*sizeof(int));</code>|||<code>int* a = (int*)malloc(5*sizeof(int));</code>"
            },
            {
              "text": "<code>int a[5];</code>|||<code>int a[5];</code>"
            },
            {
              "text": "<code>int a[5][5];</code>|||<code>int a[5][5];</code>"
            },
            {
              "text": "<code>free(a);</code>|||<code>free(a);</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>malloc</code> requests memory from the heap at RUN TIME and returns a pointer to it — that is dynamic allocation. Options B and C are static/automatic arrays whose size is fixed at compile time, and <code>free()</code> RELEASES memory rather than allocating it.</div><div class=\"ml-vi\"><code>malloc</code> xin bộ nhớ từ vùng heap khi CHƯƠNG TRÌNH CHẠY và trả về con trỏ — đó là cấp phát động. Phương án B và C là mảng tĩnh/tự động, kích thước cố định lúc biên dịch, còn <code>free()</code> là GIẢI PHÓNG bộ nhớ chứ không cấp phát.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function is used to open a text file?|||Hàm nào dùng để mở một tệp văn bản?",
          "options": [
            {
              "text": "open()|||open()"
            },
            {
              "text": "fopen()|||fopen()"
            },
            {
              "text": "fileopen()|||fileopen()"
            },
            {
              "text": "openfile()|||openfile()"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>FILE *f = fopen(&quot;data.txt&quot;, &quot;r&quot;);</code> is the standard C way to open a file; it returns a <code>FILE*</code> or NULL on failure. <code>open()</code> is a low-level POSIX system call, not standard C file I/O; the other two do not exist.</div><div class=\"ml-vi\"><code>FILE *f = fopen(&quot;data.txt&quot;, &quot;r&quot;);</code> là cách chuẩn của C để mở tệp; hàm trả về <code>FILE*</code> hoặc NULL nếu thất bại. <code>open()</code> là lời gọi hệ thống POSIX mức thấp, không thuộc I/O tệp chuẩn của C; hai hàm còn lại không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is incorrect when output a string? (Choose 2 correct answers)|||Cách nào SAI khi in ra một chuỗi? (Chọn 2 đáp án)",
          "options": [
            {
              "text": "<code>putc(s)</code>|||<code>putc(s)</code>"
            },
            {
              "text": "<code>puts(s)</code>|||<code>puts(s)</code>"
            },
            {
              "text": "<code>printf(s)</code>|||<code>printf(s)</code>"
            },
            {
              "text": "<code>printf(&quot;%s&quot;, s)</code>|||<code>printf(&quot;%s&quot;, s)</code>"
            }
          ],
          "correctIndexes": [
            0,
            2
          ],
          "explanation": "<div class=\"ml-en\"><code>putc</code> writes ONE character to a stream and needs two arguments — <code>putc(c, stdout)</code> — so <code>putc(s)</code> is wrong for a string. <code>printf(s)</code> passes the string as the FORMAT itself: any <code>%</code> inside it would be interpreted as a conversion (a well-known format-string bug), so it is not a correct way to output a string. The two correct forms are <code>puts(s)</code> and <code>printf(&quot;%s&quot;, s)</code>.</div><div class=\"ml-vi\"><code>putc</code> ghi MỘT ký tự ra luồng và cần hai đối số — <code>putc(c, stdout)</code> — nên <code>putc(s)</code> sai với chuỗi. <code>printf(s)</code> truyền chuỗi làm CHUỖI ĐỊNH DẠNG: mọi ký tự <code>%</code> bên trong sẽ bị hiểu là đặc tả chuyển đổi (lỗi format-string kinh điển), nên đây không phải cách in chuỗi đúng. Hai cách đúng là <code>puts(s)</code> và <code>printf(&quot;%s&quot;, s)</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following code print?<pre><code>float y = 3 / 2;\nprintf(&quot;%f&quot;, y);</code></pre>|||Đoạn mã sau in ra gì?<pre><code>float y = 3 / 2;\nprintf(&quot;%f&quot;, y);</code></pre>",
          "options": [
            {
              "text": "1.000000|||1.000000"
            },
            {
              "text": "1.500000|||1.500000"
            },
            {
              "text": "1.0|||1.0"
            },
            {
              "text": "1.5|||1.5"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "Compiler error|||Lỗi biên dịch"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both 3 and 2 are int literals, so <code>3 / 2</code> is integer division = 1; only THEN is it converted to the float 1.0. Assigning to a float does not undo the truncation — you would need <code>3.0 / 2</code>. <code>%f</code> prints six decimals by default → 1.000000. (Verified by running the code.)</div><div class=\"ml-vi\">Cả 3 và 2 đều là hằng nguyên nên <code>3 / 2</code> là phép chia nguyên = 1; SAU ĐÓ mới đổi thành số thực 1.0. Gán vào float không cứu được phần thập phân đã mất — phải viết <code>3.0 / 2</code>. <code>%f</code> mặc định in 6 chữ số thập phân → 1.000000. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What function is used to read a line from the specified stream and store it in the string pointed from a file?|||Hàm nào dùng để đọc một DÒNG từ luồng chỉ định và lưu vào chuỗi khi làm việc với tệp?",
          "options": [
            {
              "text": "fgets|||fgets"
            },
            {
              "text": "fgetc|||fgetc"
            },
            {
              "text": "fputs|||fputs"
            },
            {
              "text": "fpusc|||fpusc"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>fgets(buffer, size, file)</code> reads up to one line (stopping at a newline or size-1 characters) into buffer. <code>fgetc</code> reads a single CHARACTER, <code>fputs</code> WRITES a string, and <code>fpusc</code> does not exist.</div><div class=\"ml-vi\"><code>fgets(buffer, size, file)</code> đọc tối đa một dòng (dừng ở ký tự xuống dòng hoặc khi đủ size-1 ký tự) vào buffer. <code>fgetc</code> đọc MỘT ký tự, <code>fputs</code> là GHI chuỗi, còn <code>fpusc</code> không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following file modes in C will create a file if it does not already exist and allow both reading and writing? (Choose 2 answers).|||Chế độ mở tệp nào trong C sẽ TẠO tệp nếu chưa tồn tại và cho phép CẢ đọc lẫn ghi? (Chọn 2 đáp án).",
          "options": [
            {
              "text": "<code>&quot;r&quot;</code>|||<code>&quot;r&quot;</code>"
            },
            {
              "text": "<code>&quot;w+&quot;</code>|||<code>&quot;w+&quot;</code>"
            },
            {
              "text": "<code>&quot;a+&quot;</code>|||<code>&quot;a+&quot;</code>"
            },
            {
              "text": "<code>&quot;r+&quot;</code>|||<code>&quot;r+&quot;</code>"
            }
          ],
          "correctIndexes": [
            1,
            2
          ],
          "explanation": "<div class=\"ml-en\">The <code>+</code> suffix means read AND write. <code>&quot;w+&quot;</code> creates the file (truncating it if it exists) and <code>&quot;a+&quot;</code> creates it too, appending at the end. Both <code>&quot;r&quot;</code> and <code>&quot;r+&quot;</code> FAIL if the file does not exist, so they are excluded — that is the whole point of the question.</div><div class=\"ml-vi\">Hậu tố <code>+</code> nghĩa là vừa đọc vừa ghi. <code>&quot;w+&quot;</code> tạo tệp mới (xoá sạch nội dung nếu tệp đã có), còn <code>&quot;a+&quot;</code> cũng tạo tệp và ghi thêm vào cuối. Cả <code>&quot;r&quot;</code> và <code>&quot;r+&quot;</code> đều THẤT BẠI nếu tệp chưa tồn tại nên bị loại — đó chính là điểm mấu chốt của câu hỏi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following code do?<pre><code>int a = 5, b = 7;\nint *pa = &amp;a, *pb = &amp;b;\n*pa = *pa + *pb;</code></pre>|||Đoạn mã sau làm gì?<pre><code>int a = 5, b = 7;\nint *pa = &amp;a, *pb = &amp;b;\n*pa = *pa + *pb;</code></pre>",
          "options": [
            {
              "text": "Adds values at addresses a and b|||Cộng các giá trị tại địa chỉ a và b"
            },
            {
              "text": "Swaps the values|||Hoán đổi hai giá trị"
            },
            {
              "text": "Stores the address of b in a|||Lưu địa chỉ của b vào a"
            },
            {
              "text": "Multiplies both numbers|||Nhân hai số"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <code>*</code> operator reads/writes the VALUE at an address, so the line means <code>a = a + b</code>: a becomes 12 while b stays 7. Nothing is swapped, and no address is copied (that would be <code>pa = pb</code>, without the star).</div><div class=\"ml-vi\">Toán tử <code>*</code> đọc/ghi GIÁ TRỊ tại địa chỉ, nên dòng này nghĩa là <code>a = a + b</code>: a thành 12 còn b vẫn là 7. Không có hoán đổi nào, cũng không sao chép địa chỉ (muốn vậy phải viết <code>pa = pb</code>, không có dấu sao).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How are strings typically represented in C?|||Chuỗi trong C thường được biểu diễn như thế nào?",
          "options": [
            {
              "text": "As an array of characters|||Là một mảng ký tự"
            },
            {
              "text": "As an array of strings|||Là một mảng các chuỗi"
            },
            {
              "text": "As individual characters|||Là các ký tự riêng lẻ"
            },
            {
              "text": "As integers referencing ASCII values|||Là các số nguyên tham chiếu mã ASCII"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">C has no built-in string type. A string is a <code>char</code> array whose contents end with the terminator <code>&#x27;\\0&#x27;</code>, e.g. <code>char s[] = &quot;Hi&quot;;</code> occupies 3 bytes.</div><div class=\"ml-vi\">C không có kiểu chuỗi riêng. Chuỗi là một mảng <code>char</code> mà nội dung kết thúc bằng ký tự <code>&#x27;\\0&#x27;</code>, ví dụ <code>char s[] = &quot;Hi&quot;;</code> chiếm 3 byte.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT mentioned as a reason why C is selected as the first programming language?|||Đâu KHÔNG phải lý do được nêu để chọn C làm ngôn ngữ lập trình đầu tiên?",
          "options": [
            {
              "text": "C has object-oriented features.|||C có tính hướng đối tượng."
            },
            {
              "text": "C is English-like|||C gần với tiếng Anh"
            },
            {
              "text": "C is faster and more powerful than other high-level languages.|||C nhanh và mạnh hơn các ngôn ngữ bậc cao khác."
            },
            {
              "text": "C supports basic ways to understand the memory of a program|||C hỗ trợ cách cơ bản để hiểu bộ nhớ của chương trình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">C is a procedural language — it has no classes, objects, inheritance or polymorphism (those came with C++). So \"object-oriented features\" is not, and could not be, a reason for choosing C. The other three are the standard arguments given in the course introduction.</div><div class=\"ml-vi\">C là ngôn ngữ thủ tục — không có lớp, đối tượng, kế thừa hay đa hình (những thứ đó có ở C++). Vì vậy \"tính hướng đối tượng\" không phải và không thể là lý do chọn C. Ba phương án còn lại đúng là các lập luận nêu trong phần mở đầu môn học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program display?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int arr[] = {3, 6, 9, 12};\n    for (int i = 3; i &gt;= 0; i -= 2)\n        printf(&quot;%d &quot;, arr[i]);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int arr[] = {3, 6, 9, 12};\n    for (int i = 3; i &gt;= 0; i -= 2)\n        printf(&quot;%d &quot;, arr[i]);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "3 9|||3 9"
            },
            {
              "text": "12 6|||12 6"
            },
            {
              "text": "12 6 3|||12 6 3"
            },
            {
              "text": "12 9 6|||12 9 6"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The loop starts at i = 3 and steps DOWN by 2: i = 3 → arr[3] = 12, i = 1 → arr[1] = 6, then i = -1 fails the condition. Output \"12 6\". (Verified by running the code.)</div><div class=\"ml-vi\">Vòng lặp bắt đầu từ i = 3 và GIẢM 2 mỗi lượt: i = 3 → arr[3] = 12, i = 1 → arr[1] = 6, rồi i = -1 không thoả điều kiện. Kết quả \"12 6\". (Đã chạy thử kiểm chứng.)</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D2",
      "source": "REAL",
      "sortOrder": 1,
      "title": "Đề 2 — SP26 Retake Exam|||Đề 2 — Thi lại SP26",
      "description": "PRF192 real FE retake paper (Spring 2026), transcribed from the exam images; answers reasoned and code-verified here. (50 questions)|||Đề thi lại FE thật môn PRF192 (kỳ Xuân 2026), chép từ ảnh đề; đáp án được suy luận và chạy thử mã để kiểm chứng. (50 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Some questions show C source code — read it carefully, especially operator precedence, integer division and where a loop body actually ends. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một số câu có mã nguồn C — đọc kỹ, nhất là thứ tự ưu tiên toán tử, phép chia nguyên và chỗ thân vòng lặp thực sự kết thúc. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT mentioned as a reason why C is selected as the first programming language?|||Đâu KHÔNG phải lý do được nêu để chọn C làm ngôn ngữ lập trình đầu tiên?",
          "options": [
            {
              "text": "C has object-oriented features.|||C có tính hướng đối tượng."
            },
            {
              "text": "C is English-like|||C gần với tiếng Anh"
            },
            {
              "text": "C is faster and more powerful than other high-level languages.|||C nhanh và mạnh hơn các ngôn ngữ bậc cao khác."
            },
            {
              "text": "C supports basic ways to understand the memory of a program|||C hỗ trợ cách cơ bản để hiểu bộ nhớ của chương trình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">C is a procedural language — it has no classes, objects, inheritance or polymorphism (those came with C++). So \"object-oriented features\" is not, and could not be, a reason for choosing C.</div><div class=\"ml-vi\">C là ngôn ngữ thủ tục — không có lớp, đối tượng, kế thừa hay đa hình (những thứ đó có ở C++). Vì vậy \"tính hướng đối tượng\" không phải và không thể là lý do chọn C.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When a C program compiles without any errors or warnings, it means that the syntax of the program is correct, and the compiler successfully translates the code into machine-readable instructions. However, a program can still produce incorrect results if there are ________ in the code.|||Khi một chương trình C biên dịch không lỗi và không cảnh báo, nghĩa là cú pháp chương trình đúng và trình biên dịch đã dịch thành công mã sang chỉ thị máy. Tuy nhiên chương trình vẫn có thể cho kết quả SAI nếu trong mã có ________.",
          "options": [
            {
              "text": "compilation errors|||lỗi biên dịch"
            },
            {
              "text": "runtime errors|||lỗi khi chạy (runtime)"
            },
            {
              "text": "logic or semantic errors|||lỗi logic hoặc lỗi ngữ nghĩa"
            },
            {
              "text": "interpreter errors|||lỗi thông dịch"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The premise says compilation succeeded, so A is ruled out by the question itself. Runtime errors would crash the program rather than silently give a wrong answer, and C has no interpreter. A logic/semantic error means the code is valid C but does the wrong thing — e.g. writing <code>i &lt;= n</code> when you meant <code>i &lt; n</code>.</div><div class=\"ml-vi\">Đề đã nói biên dịch thành công nên A bị loại ngay. Lỗi runtime sẽ làm chương trình sập chứ không âm thầm cho kết quả sai, còn C không có trình thông dịch. Lỗi logic/ngữ nghĩa nghĩa là mã vẫn hợp lệ nhưng làm SAI việc — ví dụ viết <code>i &lt;= n</code> trong khi ý định là <code>i &lt; n</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does compilation differ from interpretation in the context of C programming language?|||Biên dịch (compilation) khác thông dịch (interpretation) như thế nào trong ngữ cảnh ngôn ngữ C?",
          "options": [
            {
              "text": "Compilation involves converting source code to machine code, while interpretation involves executing code line by line.|||Biên dịch là chuyển mã nguồn thành mã máy, còn thông dịch là thực thi mã theo từng dòng."
            },
            {
              "text": "Compilation and interpretation are two terms that are used interchangeably.|||Biên dịch và thông dịch là hai thuật ngữ dùng thay thế cho nhau."
            },
            {
              "text": "Algorithm is another term for interpretation in programming languages.|||Thuật toán là một tên gọi khác của thông dịch trong các ngôn ngữ lập trình."
            },
            {
              "text": "IDE tools are responsible for both compilation and interpretation processes.|||Công cụ IDE chịu trách nhiệm cho cả hai quá trình biên dịch và thông dịch."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A compiler translates the WHOLE source file into machine code once, producing an executable that runs on its own — this is how C works. An interpreter reads and executes the source line by line every time it runs (Python, JavaScript). They are clearly different processes, so B is false; C confuses \"algorithm\" with a translation process; an IDE merely INVOKES the compiler, it is not the compiler.</div><div class=\"ml-vi\">Trình biên dịch dịch TOÀN BỘ mã nguồn thành mã máy một lần, tạo ra file thực thi chạy độc lập — C hoạt động như vậy. Trình thông dịch đọc và thực thi mã theo từng dòng mỗi lần chạy (Python, JavaScript). Hai quá trình rõ ràng khác nhau nên B sai; C nhầm \"thuật toán\" với quá trình dịch; IDE chỉ GỌI trình biên dịch chứ bản thân không phải trình biên dịch.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What translates a C source file into machine language so that the computer can execute it?|||Cái gì dịch tệp mã nguồn C sang ngôn ngữ máy để máy tính thực thi được?",
          "options": [
            {
              "text": "A compiler|||Trình biên dịch (compiler)"
            },
            {
              "text": "A text editor|||Trình soạn thảo văn bản"
            },
            {
              "text": "A file|||Một tệp"
            },
            {
              "text": "A program|||Một chương trình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The compiler (gcc, clang, …) performs the translation. A text editor only lets you type the code; \"a file\" and \"a program\" are far too vague to be the answer.</div><div class=\"ml-vi\">Trình biên dịch (gcc, clang, …) thực hiện việc dịch. Trình soạn thảo chỉ giúp bạn gõ mã; \"một tệp\" và \"một chương trình\" quá chung chung để là đáp án.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will the following code output?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a = 7;\n    printf(&quot;%d&quot;, (a &lt;&lt; 2) | 1);\n    return 0;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a = 7;\n    printf(&quot;%d&quot;, (a &lt;&lt; 2) | 1);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "28|||28"
            },
            {
              "text": "29|||29"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "30|||30"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">7 in binary is 111. Shifting left by 2 (<code>a &lt;&lt; 2</code>) gives 11100 = 28 — each left shift multiplies by 2, so 7 × 4 = 28. Then <code>| 1</code> sets the lowest bit: 11100 | 00001 = 11101 = 29. (Verified by running the code.)</div><div class=\"ml-vi\">7 ở hệ nhị phân là 111. Dịch trái 2 bit (<code>a &lt;&lt; 2</code>) được 11100 = 28 — mỗi lần dịch trái là nhân 2, nên 7 × 4 = 28. Sau đó <code>| 1</code> bật bit thấp nhất: 11100 | 00001 = 11101 = 29. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the purpose of the sizeof operator in C?|||Toán tử sizeof trong C dùng để làm gì?",
          "options": [
            {
              "text": "To determine the value of a variable.|||Xác định giá trị của một biến."
            },
            {
              "text": "To determine the type of a variable.|||Xác định kiểu của một biến."
            },
            {
              "text": "To determine the size (in bytes) occupied by a variable or type.|||Xác định kích thước (tính bằng byte) mà một biến hoặc một kiểu chiếm."
            },
            {
              "text": "To determine the address of a variable.|||Xác định địa chỉ của một biến."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><code>sizeof</code> yields the number of bytes an object or type occupies, e.g. <code>sizeof(int)</code> is typically 4. The address of a variable is given by <code>&amp;</code>, not sizeof.</div><div class=\"ml-vi\"><code>sizeof</code> cho biết số byte mà một đối tượng hoặc một kiểu chiếm, ví dụ <code>sizeof(int)</code> thường là 4. Địa chỉ của biến lấy bằng <code>&amp;</code> chứ không phải sizeof.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is the correct syntax for declaring a structure in C?|||Cú pháp nào ĐÚNG để khai báo một cấu trúc (structure) trong C?",
          "options": [
            {
              "text": "<pre><code>typedef struct {\ndataType1 field1;\ndataType2 field2;\n} structName;</code></pre>|||<pre><code>typedef struct {\ndataType1 field1;\ndataType2 field2;\n} structName;</code></pre>"
            },
            {
              "text": "<pre><code>struct typedef {\n    dataType1 field1;\n    dataType2 field2;\n} structName;</code></pre>|||<pre><code>struct typedef {\n    dataType1 field1;\n    dataType2 field2;\n} structName;</code></pre>"
            },
            {
              "text": "<pre><code>typedef {\ndataType1 field1;\ndataType2 field2;\n} struct structName;</code></pre>|||<pre><code>typedef {\ndataType1 field1;\ndataType2 field2;\n} struct structName;</code></pre>"
            },
            {
              "text": "<pre><code>structName typedef {\n    dataType1 field1;\n    dataType2 field2;\n};</code></pre>|||<pre><code>structName typedef {\n    dataType1 field1;\n    dataType2 field2;\n};</code></pre>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The keyword order is fixed: <code>typedef</code> then <code>struct</code>, then the member list in braces, then the new type name before the semicolon. That lets you later write <code>structName s;</code> without repeating <code>struct</code>. The other three put the keywords in an order the compiler does not accept.</div><div class=\"ml-vi\">Thứ tự từ khoá là cố định: <code>typedef</code> rồi <code>struct</code>, tiếp đến danh sách thành viên trong ngoặc nhọn, cuối cùng là tên kiểu mới trước dấu chấm phẩy. Nhờ vậy về sau có thể viết <code>structName s;</code> mà không cần lặp lại <code>struct</code>. Ba phương án còn lại đặt từ khoá theo thứ tự trình biên dịch không chấp nhận.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is not a valid variable name declaration?|||Khai báo tên biến nào KHÔNG hợp lệ?",
          "options": [
            {
              "text": "<code>int _a3;</code>|||<code>int _a3;</code>"
            },
            {
              "text": "<code>int a_3;</code>|||<code>int a_3;</code>"
            },
            {
              "text": "<code>int 3_a;</code>|||<code>int 3_a;</code>"
            },
            {
              "text": "<code>int _3a</code>|||<code>int _3a</code>"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">An identifier in C may contain letters, digits and underscores, but it must NOT start with a digit. <code>3_a</code> begins with 3, so it is illegal. Starting with an underscore (options A and D) is allowed.</div><div class=\"ml-vi\">Định danh trong C có thể gồm chữ cái, chữ số và dấu gạch dưới, nhưng KHÔNG được bắt đầu bằng chữ số. <code>3_a</code> bắt đầu bằng số 3 nên không hợp lệ. Bắt đầu bằng dấu gạch dưới (phương án A và D) thì được phép.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will this code print?<pre><code>int x[5] = {0};\nprintf(&quot;%d&quot;, x[3]);</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int x[5] = {0};\nprintf(&quot;%d&quot;, x[3]);</code></pre>",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "Garbage value|||Giá trị rác"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "Error|||Lỗi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">When an array is initialised with a list shorter than its size, the REMAINING elements are set to zero automatically. <code>{0}</code> therefore zeroes the whole array, so x[3] is 0 — not garbage.</div><div class=\"ml-vi\">Khi mảng được khởi tạo bằng danh sách ngắn hơn kích thước của nó, các phần tử CÒN LẠI tự động được gán 0. Vì vậy <code>{0}</code> làm cả mảng bằng 0, nên x[3] là 0 chứ không phải giá trị rác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program display?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int a[5] = {1, 2, 3};\n    printf(&quot;%d&quot;, a[0]);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int a[5] = {1, 2, 3};\n    printf(&quot;%d&quot;, a[0]);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "An error will be raised.|||Chương trình báo lỗi."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Indexing starts at 0, so <code>a[0]</code> is the FIRST element = 1. (The array has 5 slots; a[3] and a[4] are filled with 0 automatically, but they are not printed here.)</div><div class=\"ml-vi\">Chỉ số bắt đầu từ 0 nên <code>a[0]</code> là phần tử ĐẦU TIÊN = 1. (Mảng có 5 ô; a[3] và a[4] tự động bằng 0 nhưng không được in ở đây.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code snippet?<pre><code>#include &lt;stdio.h&gt;\nint x = 9;\nvoid someFunction() {\n    int x = 8;\n    printf(&quot;%d &quot;, x);\n}\nint main() {\n    someFunction();\n    printf(&quot;%d&quot;, x);\n    return 0;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint x = 9;\nvoid someFunction() {\n    int x = 8;\n    printf(&quot;%d &quot;, x);\n}\nint main() {\n    someFunction();\n    printf(&quot;%d&quot;, x);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "8 9|||8 9"
            },
            {
              "text": "9 8|||9 8"
            },
            {
              "text": "8 8|||8 8"
            },
            {
              "text": "9 9|||9 9"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Inside someFunction the LOCAL x = 8 shadows the global x, so it prints 8. The local variable dies when the function returns, so main sees the global again and prints 9. Output: \"8 9\". (Verified by running the code.)</div><div class=\"ml-vi\">Bên trong someFunction, biến CỤC BỘ x = 8 che khuất biến toàn cục nên in ra 8. Biến cục bộ mất khi hàm kết thúc, main lại thấy biến toàn cục nên in 9. Kết quả: \"8 9\". (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the two strings have the same value, then strcmp() function returns _____|||Nếu hai chuỗi có giá trị giống nhau thì hàm strcmp() trả về _____",
          "options": [
            {
              "text": "True|||True"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "-1|||-1"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">strcmp returns the DIFFERENCE relationship: 0 when the strings are equal, a negative value when the first is smaller and a positive value when it is larger. This is why <code>strcmp(a, b) == 0</code> is the correct way to test equality — a common beginner bug is writing <code>if (strcmp(a, b))</code>, which is true exactly when they DIFFER.</div><div class=\"ml-vi\">strcmp trả về quan hệ SO SÁNH: 0 khi hai chuỗi bằng nhau, số âm khi chuỗi đầu nhỏ hơn và số dương khi lớn hơn. Vì vậy cách kiểm tra bằng nhau đúng là <code>strcmp(a, b) == 0</code> — lỗi thường gặp của người mới là viết <code>if (strcmp(a, b))</code>, vốn đúng khi hai chuỗi KHÁC nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program display?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int x = 1, y = 2, z = 3;\n\n    x = x - --y;\n    z = z + ++y;\n\n    printf(&quot;%d %d %d&quot;, x, y, z);\n\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int x = 1, y = 2, z = 3;\n\n    x = x - --y;\n    z = z + ++y;\n\n    printf(&quot;%d %d %d&quot;, x, y, z);\n\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "-1 5 3|||-1 5 3"
            },
            {
              "text": "0 2 5|||0 2 5"
            },
            {
              "text": "1 2 4|||1 2 4"
            },
            {
              "text": "1 5 3|||1 5 3"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Pre-increment/decrement changes the variable BEFORE the value is used. Line 1: <code>--y</code> makes y = 1, then x = 1 - 1 = 0. Line 2: <code>++y</code> makes y = 2 again, then z = 3 + 2 = 5. Final: x=0, y=2, z=5. (Verified by running the code.)</div><div class=\"ml-vi\">Toán tử tăng/giảm TRƯỚC thay đổi biến TRƯỚC khi giá trị được dùng. Dòng 1: <code>--y</code> làm y = 1, rồi x = 1 - 1 = 0. Dòng 2: <code>++y</code> làm y quay lại 2, rồi z = 3 + 2 = 5. Kết quả: x=0, y=2, z=5. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which header file can be used to define math function prototypes and macros?|||Tệp header nào định nghĩa nguyên mẫu hàm và macro toán học?",
          "options": [
            {
              "text": "math.h|||math.h"
            },
            {
              "text": "stdio.h|||stdio.h"
            },
            {
              "text": "conio.h|||conio.h"
            },
            {
              "text": "memory.h|||memory.h"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>math.h</code> declares sqrt, pow, sin, cos, ceil, floor, fabs and macros such as <code>M_PI</code>. <code>stdio.h</code> is input/output, <code>conio.h</code> is a non-standard DOS console header, and <code>memory.h</code> is an old alias for string/memory routines.</div><div class=\"ml-vi\"><code>math.h</code> khai báo sqrt, pow, sin, cos, ceil, floor, fabs và các macro như <code>M_PI</code>. <code>stdio.h</code> lo nhập/xuất, <code>conio.h</code> là header console DOS không chuẩn, còn <code>memory.h</code> là tên cũ cho các hàm thao tác bộ nhớ/chuỗi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does a variable represent in a program?|||Một biến biểu diễn điều gì trong chương trình?",
          "options": [
            {
              "text": "A constant value stored in memory|||Một giá trị hằng lưu trong bộ nhớ"
            },
            {
              "text": "A reference to a memory location|||Một tham chiếu tới một vị trí bộ nhớ"
            },
            {
              "text": "A function used for binary conversion|||Một hàm dùng để chuyển đổi nhị phân"
            },
            {
              "text": "A line number in the code|||Một số dòng trong mã nguồn"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A variable is a NAME for a memory location whose content can change while the program runs. Option A is wrong precisely because of the word \"constant\" — that describes <code>const</code> or <code>#define</code>, not a variable.</div><div class=\"ml-vi\">Biến là một TÊN gọi cho một vị trí bộ nhớ mà nội dung có thể thay đổi trong lúc chương trình chạy. Phương án A sai chính ở chữ \"hằng\" — đó là mô tả của <code>const</code> hoặc <code>#define</code> chứ không phải biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In C, what is the purpose of <code>|</code> operator?|||Trong C, toán tử <code>|</code> dùng để làm gì?",
          "options": [
            {
              "text": "It is a bitwise operator OR|||Là toán tử BIT OR"
            },
            {
              "text": "It is a logical operator AND|||Là toán tử LOGIC AND"
            },
            {
              "text": "It is a bitwise operator AND|||Là toán tử BIT AND"
            },
            {
              "text": "It is a logical operator OR|||Là toán tử LOGIC OR"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Watch the doubling: one <code>|</code> is bitwise OR (works bit by bit on the whole value), while two <code>||</code> is logical OR (works on true/false). Likewise <code>&amp;</code> is bitwise AND and <code>&amp;&amp;</code> is logical AND.</div><div class=\"ml-vi\">Chú ý số ký tự: một dấu <code>|</code> là OR theo BIT (tác động từng bit của giá trị), còn hai dấu <code>||</code> là OR LOGIC (tác động trên đúng/sai). Tương tự <code>&amp;</code> là AND theo bit và <code>&amp;&amp;</code> là AND logic.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of these is NOT a relational or logical operator?|||Toán tử nào KHÔNG phải toán tử quan hệ hay toán tử logic?",
          "options": [
            {
              "text": "<code>=</code>|||<code>=</code>"
            },
            {
              "text": "<code>||</code>|||<code>||</code>"
            },
            {
              "text": "<code>==</code>|||<code>==</code>"
            },
            {
              "text": "<code>!=</code>|||<code>!=</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A single <code>=</code> is the ASSIGNMENT operator — it stores a value. The comparison for equality is the double <code>==</code>. Mixing them up is the classic bug <code>if (x = 5)</code>, which assigns 5 and is always true.</div><div class=\"ml-vi\">Một dấu <code>=</code> là toán tử GÁN — nó lưu giá trị. Toán tử so sánh bằng là hai dấu <code>==</code>. Nhầm hai thứ này chính là lỗi kinh điển <code>if (x = 5)</code>, vốn gán 5 và luôn đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output?<pre><code>int x = 0, y = 5;\nprintf(&quot;%d&quot;, (x &amp;&amp; y));</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int x = 0, y = 5;\nprintf(&quot;%d&quot;, (x &amp;&amp; y));</code></pre>",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "-1|||-1"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">In C any non-zero value counts as true and 0 as false. Here x is 0 (false), so the AND is false regardless of y — in fact <code>&amp;&amp;</code> short-circuits and never even looks at y. A false expression evaluates to the int 0.</div><div class=\"ml-vi\">Trong C, mọi giá trị khác 0 được coi là đúng, còn 0 là sai. Ở đây x bằng 0 (sai) nên phép AND sai bất kể y — thực tế <code>&amp;&amp;</code> còn \"ngắn mạch\", không thèm xét y. Biểu thức sai có giá trị nguyên là 0.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will this code output?<pre><code>int a = 5, b = 10;\nprintf(&quot;%d&quot;, !(a &gt; b || b == 10));</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int a = 5, b = 10;\nprintf(&quot;%d&quot;, !(a &gt; b || b == 10));</code></pre>",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "-1|||-1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Inside the parentheses: a &gt; b is 5 &gt; 10 = false (0), but b == 10 is TRUE (1), so the OR is 1. The <code>!</code> then negates it: !1 = 0. (Verified by running the code.)</div><div class=\"ml-vi\">Trong ngoặc: a &gt; b là 5 &gt; 10 = sai (0), nhưng b == 10 là ĐÚNG (1) nên phép OR bằng 1. Toán tử <code>!</code> phủ định lại: !1 = 0. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following code?<pre><code>int i = 10;\nwhile (i &gt; 0) {\n    printf(&quot;%d &quot;, i);\n    i -= 3;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int i = 10;\nwhile (i &gt; 0) {\n    printf(&quot;%d &quot;, i);\n    i -= 3;\n}</code></pre>",
          "options": [
            {
              "text": "10 7 4 1|||10 7 4 1"
            },
            {
              "text": "10 9 8 7 6 5 4 3 2 1|||10 9 8 7 6 5 4 3 2 1"
            },
            {
              "text": "10 7 4 1 -2|||10 7 4 1 -2"
            },
            {
              "text": "10 7 4 1 -2 -5|||10 7 4 1 -2 -5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">i takes the values 10, 7, 4, 1 — each printed BEFORE the subtraction. After printing 1 the next value is -2, which fails <code>i &gt; 0</code>, so the loop stops and -2 is never printed. (Verified by running the code.)</div><div class=\"ml-vi\">i nhận các giá trị 10, 7, 4, 1 — mỗi giá trị được in TRƯỚC khi trừ. Sau khi in 1, giá trị tiếp theo là -2, không thoả <code>i &gt; 0</code> nên vòng lặp dừng và -2 không được in. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the syntax of the conditional operator in C?|||Cú pháp của toán tử điều kiện (ternary) trong C là gì?",
          "options": [
            {
              "text": "<code>condition ? expression1 : expression2</code>|||<code>condition ? expression1 : expression2</code>"
            },
            {
              "text": "<code>condition ? expression1, expression2</code>|||<code>condition ? expression1, expression2</code>"
            },
            {
              "text": "<code>condition : expression1 ? expression2</code>|||<code>condition : expression1 ? expression2</code>"
            },
            {
              "text": "<code>expression1 : condition ? expression2</code>|||<code>expression1 : condition ? expression2</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The ternary operator reads \"if condition then expression1 else expression2\": the condition comes first, <code>?</code> introduces the true branch, and <code>:</code> separates the false branch. Example: <code>max = (a &gt; b) ? a : b;</code>.</div><div class=\"ml-vi\">Toán tử ba ngôi đọc là \"nếu điều kiện thì expression1 ngược lại expression2\": điều kiện đứng trước, dấu <code>?</code> mở nhánh đúng, dấu <code>:</code> ngăn cách nhánh sai. Ví dụ: <code>max = (a &gt; b) ? a : b;</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output when the sample code below is executed?<pre><code>#include&lt;stdio.h&gt;\nint main()\n{\n     int a=10,b=20,c=30;\n     while(a&gt;1)\n     {\n          if(b%2!=0)\n                a/=10;\n          b--;\n          c*=2;\n     }\n     printf(&quot;%d ; %d ; %d&quot;,a,b,c);\n     return 0;\n}</code></pre>|||Đoạn mã sau chạy ra kết quả gì?<pre><code>#include&lt;stdio.h&gt;\nint main()\n{\n     int a=10,b=20,c=30;\n     while(a&gt;1)\n     {\n          if(b%2!=0)\n                a/=10;\n          b--;\n          c*=2;\n     }\n     printf(&quot;%d ; %d ; %d&quot;,a,b,c);\n     return 0;\n}</code></pre>",
          "options": [
            {
              "text": "1 ; 18 ; 120|||1 ; 18 ; 120"
            },
            {
              "text": "10 ; 19 ; 60|||10 ; 19 ; 60"
            },
            {
              "text": "1 ; 20 ; 60|||1 ; 20 ; 60"
            },
            {
              "text": "10 ; 19 ; 120|||10 ; 19 ; 120"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Pass 1: b = 20 is even, so a is untouched; b becomes 19, c becomes 60. Pass 2: b = 19 is odd, so a = 10/10 = 1; b becomes 18, c becomes 120. Now a = 1 fails <code>a &gt; 1</code> and the loop stops. Result 1 ; 18 ; 120. (Verified by running the code.)</div><div class=\"ml-vi\">Lượt 1: b = 20 là số chẵn nên a không đổi; b thành 19, c thành 60. Lượt 2: b = 19 lẻ nên a = 10/10 = 1; b thành 18, c thành 120. Lúc này a = 1 không thoả <code>a &gt; 1</code> nên vòng lặp dừng. Kết quả 1 ; 18 ; 120. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the result displayed on the screen of the following program?<pre><code>#include&lt;stdio.h&gt;\n\nint isTriangle(float a, float b, float c)\n{\n   if ((a&gt;0)&amp;&amp;(b&gt;0)&amp;&amp;(c&gt;0)&amp;&amp;(a&lt;b+c)&amp;&amp;(b&lt;c+a)&amp;&amp;(c&lt;a+b))\n       return 1;\n   else\n       return 0;\n}\n\nint main()\n{\n  float a = 1, b = 1, c = 1.25;\n  if (isTriangle(a, b, c))\n    printf(&quot;%.2f, %.2f, %.2f: a triangle.\\n&quot;, a, b, c);\n  else\n    printf(&quot;%.2f, %.2f, %.2f: not a triangle.\\n&quot;, a, b, c);\n  return 0;\n}</code></pre>|||Chương trình sau hiển thị kết quả nào trên màn hình?<pre><code>#include&lt;stdio.h&gt;\n\nint isTriangle(float a, float b, float c)\n{\n   if ((a&gt;0)&amp;&amp;(b&gt;0)&amp;&amp;(c&gt;0)&amp;&amp;(a&lt;b+c)&amp;&amp;(b&lt;c+a)&amp;&amp;(c&lt;a+b))\n       return 1;\n   else\n       return 0;\n}\n\nint main()\n{\n  float a = 1, b = 1, c = 1.25;\n  if (isTriangle(a, b, c))\n    printf(&quot;%.2f, %.2f, %.2f: a triangle.\\n&quot;, a, b, c);\n  else\n    printf(&quot;%.2f, %.2f, %.2f: not a triangle.\\n&quot;, a, b, c);\n  return 0;\n}</code></pre>",
          "options": [
            {
              "text": "a, b, c: a triangle|||a, b, c: a triangle"
            },
            {
              "text": "1.00, 1.00, 1.25: a triangle|||1.00, 1.00, 1.25: a triangle"
            },
            {
              "text": "1, 1, 1.25: a triangle|||1, 1, 1.25: a triangle"
            },
            {
              "text": "1.00, 1.00, 1.25: not a triangle|||1.00, 1.00, 1.25: not a triangle"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Two things to check. (1) The triangle inequality: 1 &lt; 1+1.25, 1 &lt; 1.25+1 and 1.25 &lt; 1+1 all hold, so isTriangle returns 1 — it IS a triangle, which rules out D. (2) The format <code>%.2f</code> prints each value with exactly two decimals, so 1 appears as \"1.00\" — that rules out A and C. (Verified by running the code.)</div><div class=\"ml-vi\">Cần kiểm tra hai điều. (1) Bất đẳng thức tam giác: 1 &lt; 1+1.25, 1 &lt; 1.25+1 và 1.25 &lt; 1+1 đều đúng nên isTriangle trả về 1 — ĐÚNG là tam giác, loại D. (2) Định dạng <code>%.2f</code> in mỗi giá trị với đúng hai chữ số thập phân nên 1 hiện thành \"1.00\" — loại A và C. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will happen if the loop's condition is always true?|||Điều gì xảy ra nếu điều kiện của vòng lặp LUÔN đúng?",
          "options": [
            {
              "text": "Loop infinitely|||Lặp vô hạn"
            },
            {
              "text": "No Output will be printed|||Không in ra gì"
            },
            {
              "text": "Compile time error|||Lỗi biên dịch"
            },
            {
              "text": "The loop will not work|||Vòng lặp không chạy"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A loop only stops when its condition becomes false (or a <code>break</code>/<code>return</code> is executed). If the condition can never become false, the body repeats forever. This is legal C — the compiler will not complain, which is why infinite loops are runtime bugs, not compile errors.</div><div class=\"ml-vi\">Vòng lặp chỉ dừng khi điều kiện trở thành sai (hoặc gặp <code>break</code>/<code>return</code>). Nếu điều kiện không bao giờ sai được thì thân vòng lặp lặp lại mãi mãi. Đây là mã C hợp lệ — trình biên dịch không báo gì, nên lặp vô hạn là lỗi lúc chạy chứ không phải lỗi biên dịch.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of this reverse loop?<pre><code>#define SIZE 5\nint nums[SIZE] = {5, 10, 2, -45, 6};\nfor (int i = SIZE - 1; i &gt;= 0; i--)\n    printf(&quot;%d &quot;, nums[i]);</code></pre>|||Vòng lặp ngược sau in ra gì?<pre><code>#define SIZE 5\nint nums[SIZE] = {5, 10, 2, -45, 6};\nfor (int i = SIZE - 1; i &gt;= 0; i--)\n    printf(&quot;%d &quot;, nums[i]);</code></pre>",
          "options": [
            {
              "text": "5 10 2 -45 6|||5 10 2 -45 6"
            },
            {
              "text": "6 -45 2 10 5|||6 -45 2 10 5"
            },
            {
              "text": "-45 2 10 5 6|||-45 2 10 5 6"
            },
            {
              "text": "Error|||Lỗi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">i runs from SIZE-1 = 4 down to 0, so the elements are printed from the LAST to the first: nums[4]=6, nums[3]=-45, nums[2]=2, nums[1]=10, nums[0]=5. (Verified by running the code.)</div><div class=\"ml-vi\">i chạy từ SIZE-1 = 4 xuống 0 nên các phần tử được in từ CUỐI về đầu: nums[4]=6, nums[3]=-45, nums[2]=2, nums[1]=10, nums[0]=5. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the correct order of the main components in the function?|||Thứ tự ĐÚNG của các thành phần chính trong một hàm là gì?",
          "options": [
            {
              "text": "Return type, function name, parameters, and function body.|||Kiểu trả về, tên hàm, tham số, và thân hàm."
            },
            {
              "text": "Return type, function name, return value, and function body|||Kiểu trả về, tên hàm, giá trị trả về, và thân hàm"
            },
            {
              "text": "Return type, function name, parameters, and return value|||Kiểu trả về, tên hàm, tham số, và giá trị trả về"
            },
            {
              "text": "Return value, function name, parameters, and function body|||Giá trị trả về, tên hàm, tham số, và thân hàm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A definition is written <code>int sum(int a, int b) { ... }</code>: return type → name → parameter list in parentheses → body in braces. The return VALUE is not a structural component — it is produced inside the body by <code>return</code>.</div><div class=\"ml-vi\">Định nghĩa hàm viết theo dạng <code>int sum(int a, int b) { ... }</code>: kiểu trả về → tên → danh sách tham số trong ngoặc tròn → thân hàm trong ngoặc nhọn. GIÁ TRỊ trả về không phải một thành phần cấu trúc — nó được tạo ra bên trong thân hàm bằng <code>return</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following C code?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int k = 5;\n    int *p = &amp;k;\n    int **m  = &amp;p;\n    **m = 6;\n    printf(&quot;%d\\n&quot;, k);\n}</code></pre>|||Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int k = 5;\n    int *p = &amp;k;\n    int **m  = &amp;p;\n    **m = 6;\n    printf(&quot;%d\\n&quot;, k);\n}</code></pre>",
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "Run time error|||Lỗi khi chạy"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "Junk|||Giá trị rác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Follow the chain: <code>p</code> points to k, and <code>m</code> points to p. So <code>*m</code> is p, and <code>**m</code> is k itself. Assigning <code>**m = 6</code> therefore writes 6 into k. (Verified by running the code.)</div><div class=\"ml-vi\">Lần theo chuỗi trỏ: <code>p</code> trỏ tới k, còn <code>m</code> trỏ tới p. Vậy <code>*m</code> chính là p, và <code>**m</code> chính là k. Do đó gán <code>**m = 6</code> ghi 6 vào k. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume we have a function such as:<pre><code>void swap(int a, int b){\n     int t = a;\n     a=b;\n     b=t;\n}</code></pre>What is the problem with a and b after executing the swap (a, b) function?|||Cho hàm sau:<pre><code>void swap(int a, int b){\n     int t = a;\n     a=b;\n     b=t;\n}</code></pre>Vấn đề với a và b sau khi gọi hàm swap(a, b) là gì?",
          "options": [
            {
              "text": "a and b do not change values.|||a và b KHÔNG đổi giá trị."
            },
            {
              "text": "cannot execute the swap(a,b) function.|||không gọi được hàm swap(a,b)."
            },
            {
              "text": "a has the old value of b, and b has the new value of t.|||a mang giá trị cũ của b, còn b mang giá trị mới của t."
            },
            {
              "text": "a and b change values for each other;|||a và b hoán đổi giá trị cho nhau;"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">C passes arguments BY VALUE: a and b inside the function are copies. The swap really happens — but only on the copies, which disappear when the function returns. The caller's variables are untouched. To make it work you must pass addresses: <code>void swap(int *a, int *b)</code> called as <code>swap(&amp;x, &amp;y)</code>.</div><div class=\"ml-vi\">C truyền đối số THEO GIÁ TRỊ: a và b bên trong hàm chỉ là bản sao. Việc hoán đổi có thật sự xảy ra — nhưng chỉ trên bản sao, và chúng biến mất khi hàm kết thúc. Biến của nơi gọi không hề thay đổi. Muốn hoạt động phải truyền địa chỉ: <code>void swap(int *a, int *b)</code> và gọi <code>swap(&amp;x, &amp;y)</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the value of <code>ceil(2.55)</code> from the math.h library?|||Giá trị của <code>ceil(2.55)</code> trong thư viện math.h là bao nhiêu?",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "2.5|||2.5"
            },
            {
              "text": "2.6|||2.6"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>ceil</code> rounds UP to the nearest integer, so ceil(2.55) = 3. Its counterpart <code>floor</code> rounds down (floor(2.55) = 2), and <code>round</code> goes to the nearest (round(2.55) = 3). Note ceil never rounds to a fractional value, which rules out C and D immediately. (Verified by running the code.)</div><div class=\"ml-vi\"><code>ceil</code> làm tròn LÊN số nguyên gần nhất nên ceil(2.55) = 3. Hàm đối lập <code>floor</code> làm tròn xuống (floor(2.55) = 2), còn <code>round</code> làm tròn tới số gần nhất (round(2.55) = 3). Lưu ý ceil không bao giờ cho kết quả có phần thập phân nên loại ngay C và D. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the <code>main()</code> function in C?|||Hàm <code>main()</code> trong C là gì?",
          "options": [
            {
              "text": "It is the function where the program's execution starts.|||Là hàm nơi chương trình bắt đầu thực thi."
            },
            {
              "text": "Every program has exactly one main function.|||Mỗi chương trình có đúng một hàm main."
            },
            {
              "text": "The main function always returns an integer value or void.|||Hàm main luôn trả về giá trị số nguyên hoặc void."
            },
            {
              "text": "All answers are correct.|||Tất cả các đáp án đều đúng."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Each of the first three statements is true: execution begins at main; a program has exactly one main (otherwise the linker reports a duplicate symbol); and it is written either <code>int main()</code> (standard) or <code>void main()</code> (accepted by many teaching compilers). So the correct choice is \"All answers are correct\".</div><div class=\"ml-vi\">Cả ba phát biểu đầu đều đúng: chương trình bắt đầu chạy từ main; mỗi chương trình có đúng một hàm main (nếu không trình liên kết sẽ báo trùng ký hiệu); và nó được viết là <code>int main()</code> (chuẩn) hoặc <code>void main()</code> (nhiều trình biên dịch dạy học chấp nhận). Vậy đáp án đúng là \"Tất cả các đáp án đều đúng\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following code snippets calculates the square root of 9 using the correct C library?|||Đoạn mã nào tính căn bậc hai của 9 bằng thư viện C ĐÚNG?",
          "options": [
            {
              "text": "<code>double result = sqrt(9);</code>|||<code>double result = sqrt(9);</code>"
            },
            {
              "text": "<code>int result = sqrt(9);</code>|||<code>int result = sqrt(9);</code>"
            },
            {
              "text": "<code>float result = sqrt(9);</code>|||<code>float result = sqrt(9);</code>"
            },
            {
              "text": "<code>result = power(9, 0.5);</code>|||<code>result = power(9, 0.5);</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>sqrt()</code> from <code>math.h</code> returns a <code>double</code>, so storing it in a double keeps the exact value. Options B and C truncate or narrow the result, and <code>power()</code> does not exist in C — the real function is <code>pow()</code>.</div><div class=\"ml-vi\"><code>sqrt()</code> trong <code>math.h</code> trả về kiểu <code>double</code> nên lưu vào biến double giữ nguyên giá trị. Phương án B và C làm cắt hoặc thu hẹp kết quả, còn <code>power()</code> không tồn tại trong C — hàm thật là <code>pow()</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function is specifically used to return the absolute value of an int data type in C?|||Hàm nào chuyên dùng để trả về trị tuyệt đối của kiểu dữ liệu int trong C?",
          "options": [
            {
              "text": "abs()|||abs()"
            },
            {
              "text": "labs()|||labs()"
            },
            {
              "text": "llabs()|||llabs()"
            },
            {
              "text": "fabs()|||fabs()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The C library has one absolute-value function per type: <code>abs</code> for <code>int</code>, <code>labs</code> for <code>long</code>, <code>llabs</code> for <code>long long</code> and <code>fabs</code> for floating-point. The question asks specifically about int, so abs().</div><div class=\"ml-vi\">Thư viện C có một hàm trị tuyệt đối cho mỗi kiểu: <code>abs</code> cho <code>int</code>, <code>labs</code> cho <code>long</code>, <code>llabs</code> cho <code>long long</code> và <code>fabs</code> cho số thực. Câu hỏi nêu rõ kiểu int nên chọn abs().</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(Choose 1 answer) What will be printed when the following code is executed?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a[] = {1,2,3,4,5,6};\n    int* p = a;\n    p += 3;\n    printf(&quot;%d, %d&quot;,*(a+3), *(p++));\n    return 0;\n}</code></pre>|||(Chọn 1 đáp án) Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a[] = {1,2,3,4,5,6};\n    int* p = a;\n    p += 3;\n    printf(&quot;%d, %d&quot;,*(a+3), *(p++));\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "3 3|||3 3"
            },
            {
              "text": "3 4|||3 4"
            },
            {
              "text": "4 4|||4 4"
            },
            {
              "text": "4 5|||4 5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><code>*(a+3)</code> is the same as <code>a[3]</code> = 4. After <code>p += 3</code>, p also points at a[3], and <code>*(p++)</code> uses the CURRENT target (4) before advancing p — the increment happens too late to affect what is printed. Both values are 4. (Verified by running the code.)</div><div class=\"ml-vi\"><code>*(a+3)</code> chính là <code>a[3]</code> = 4. Sau <code>p += 3</code>, p cũng trỏ tới a[3], và <code>*(p++)</code> lấy giá trị HIỆN TẠI (4) rồi mới dịch p — việc tăng xảy ra quá muộn để ảnh hưởng đến kết quả in. Cả hai giá trị đều là 4. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose the correct statement related to the array.|||Chọn phát biểu ĐÚNG về mảng.",
          "options": [
            {
              "text": "Arrays provide constant-time access to elements.|||Mảng cho phép truy cập phần tử với thời gian hằng số."
            },
            {
              "text": "Arrays allow for dynamic resizing during runtime.|||Mảng cho phép thay đổi kích thước động lúc chạy."
            },
            {
              "text": "Arrays can store elements of different data types.|||Mảng có thể lưu các phần tử thuộc các kiểu dữ liệu khác nhau."
            },
            {
              "text": "Arrays automatically adjust their size based on the number of elements.|||Mảng tự động điều chỉnh kích thước theo số phần tử."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Because elements sit in contiguous memory and all have the same size, the address of <code>a[i]</code> is computed by one multiplication and one addition — O(1), no matter how big the array is. A plain C array has a FIXED size, which makes B and D false, and all elements must share one type, which makes C false.</div><div class=\"ml-vi\">Vì các phần tử nằm liền kề trong bộ nhớ và có cùng kích thước, địa chỉ của <code>a[i]</code> được tính bằng một phép nhân và một phép cộng — O(1), bất kể mảng lớn cỡ nào. Mảng C thường có kích thước CỐ ĐỊNH nên B và D sai, và mọi phần tử phải cùng một kiểu nên C sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a pointer in C programming?|||Con trỏ trong lập trình C là gì?",
          "options": [
            {
              "text": "A variable stores anything|||Một biến lưu bất cứ thứ gì"
            },
            {
              "text": "A variable stores address of another variable or a variable stores address of the dynamically allocated memory|||Một biến lưu địa chỉ của biến khác, hoặc lưu địa chỉ vùng nhớ được cấp phát động"
            },
            {
              "text": "An address in the memory|||Một địa chỉ trong bộ nhớ"
            },
            {
              "text": "A variable stores any number|||Một biến lưu một số bất kỳ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A pointer is a VARIABLE whose value is an address — either the address of another variable (<code>&amp;x</code>) or of memory returned by <code>malloc</code>. Option C is the classic trap: an address alone is just a value, while a pointer is the variable that holds it.</div><div class=\"ml-vi\">Con trỏ là một BIẾN có giá trị là một địa chỉ — có thể là địa chỉ của biến khác (<code>&amp;x</code>) hoặc của vùng nhớ do <code>malloc</code> trả về. Phương án C là bẫy kinh điển: bản thân địa chỉ chỉ là một giá trị, còn con trỏ là biến chứa giá trị đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program print?<pre><code>#include &lt;stdio.h&gt;\n\nint main() {\n    int a = 4, *b = &amp;a;\n    a--;\n    *b=*b-1;\n    printf(&quot;%d %d&quot;, a, *b);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint main() {\n    int a = 4, *b = &amp;a;\n    a--;\n    *b=*b-1;\n    printf(&quot;%d %d&quot;, a, *b);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "2 2|||2 2"
            },
            {
              "text": "2 1|||2 1"
            },
            {
              "text": "3 1|||3 1"
            },
            {
              "text": "3 3|||3 3"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">b points at a, so <code>a</code> and <code>*b</code> are two names for the SAME cell. <code>a--</code> makes it 3, then <code>*b = *b - 1</code> makes it 2. Both printed values are therefore 2 — they can never differ. (Verified by running the code.)</div><div class=\"ml-vi\">b trỏ tới a nên <code>a</code> và <code>*b</code> là hai cách gọi CÙNG một ô nhớ. <code>a--</code> làm nó thành 3, rồi <code>*b = *b - 1</code> làm nó thành 2. Vì vậy hai giá trị in ra đều là 2 — chúng không thể khác nhau. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be printed by the code below?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;stdlib.h&gt;\nint main() {\n    int *p = (int*) malloc(sizeof(int));\n    *p = 50;\n    printf(&quot;%d&quot;, *p);\n    free(p);\n    return 0;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;stdlib.h&gt;\nint main() {\n    int *p = (int*) malloc(sizeof(int));\n    *p = 50;\n    printf(&quot;%d&quot;, *p);\n    free(p);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "Address of p|||Địa chỉ của p"
            },
            {
              "text": "Garbage value|||Giá trị rác"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "Compilation error|||Lỗi biên dịch"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><code>malloc</code> reserves room for one int and p points at it. <code>*p = 50</code> writes 50 into that memory, and <code>printf(&quot;%d&quot;, *p)</code> reads it back — 50. Note the printf happens BEFORE <code>free(p)</code>, so the memory is still valid; reading after free would be the classic use-after-free bug.</div><div class=\"ml-vi\"><code>malloc</code> xin chỗ cho một int và p trỏ tới đó. <code>*p = 50</code> ghi 50 vào vùng nhớ ấy, và <code>printf(&quot;%d&quot;, *p)</code> đọc lại — được 50. Lưu ý printf chạy TRƯỚC <code>free(p)</code> nên vùng nhớ vẫn hợp lệ; đọc sau khi free mới là lỗi use-after-free kinh điển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "<code>int *ptr = malloc( sizeof( int ) );</code><br>To reallocate ptr to be an array of 5 elements, which of the following statements generates an error?|||<code>int *ptr = malloc( sizeof( int ) );</code><br>Để cấp phát lại ptr thành mảng 5 phần tử, câu lệnh nào gây LỖI?",
          "options": [
            {
              "text": "<code>ptr = realloc( ptr, 5 * sizeof(int) );</code>|||<code>ptr = realloc( ptr, 5 * sizeof(int) );</code>"
            },
            {
              "text": "<code>realloc( ptr, 5 * sizeof(int) );</code>|||<code>realloc( ptr, 5 * sizeof(int) );</code>"
            },
            {
              "text": "<code>ptr += malloc( 5 * sizeof( int ) );</code>|||<code>ptr += malloc( 5 * sizeof( int ) );</code>"
            },
            {
              "text": "<code>realloc( ptr, 20);</code>|||<code>realloc( ptr, 20);</code>"
            },
            {
              "text": "<code>ptr = realloc( ptr, 20);</code>|||<code>ptr = realloc( ptr, 20);</code>"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Option C tries to ADD a pointer to a pointer. <code>malloc</code> returns a <code>void *</code>, and C has no <code>+</code> between two pointers — the compiler rejects it. The other four all compile: B and D ignore the return value (bad practice and a possible leak, but not an error), and 20 is simply 5 × sizeof(int) written out.</div><div class=\"ml-vi\">Phương án C cố CỘNG một con trỏ vào một con trỏ. <code>malloc</code> trả về <code>void *</code>, và C không có phép <code>+</code> giữa hai con trỏ — trình biên dịch từ chối. Bốn phương án còn lại đều biên dịch được: B và D bỏ qua giá trị trả về (thói quen xấu và có thể rò rỉ bộ nhớ nhưng không phải lỗi), còn 20 chính là 5 × sizeof(int) viết ra số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following program?<pre><code>int main()\n{\n   int i = 1;\n   int *p = &amp;i;\n   int **k = &amp;p;\n   i+=2;\n   printf(&quot;%d%d%d&quot;, *p, **k, *(*k));\n   getchar();\n   return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>int main()\n{\n   int i = 1;\n   int *p = &amp;i;\n   int **k = &amp;p;\n   i+=2;\n   printf(&quot;%d%d%d&quot;, *p, **k, *(*k));\n   getchar();\n   return 0;\n}</code></pre>",
          "options": [
            {
              "text": "333|||333"
            },
            {
              "text": "111|||111"
            },
            {
              "text": "222|||222"
            },
            {
              "text": "Compile error|||Lỗi biên dịch"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All three expressions are different routes to the SAME variable i: <code>*p</code> is i, <code>**k</code> is i, and <code>*(*k)</code> is just <code>**k</code> written with explicit parentheses. Since <code>i += 2</code> made i = 3, the output is 333. (Verified by running the code.)</div><div class=\"ml-vi\">Cả ba biểu thức đều là những đường khác nhau dẫn tới CÙNG biến i: <code>*p</code> là i, <code>**k</code> là i, và <code>*(*k)</code> chỉ là <code>**k</code> viết rõ ngoặc. Vì <code>i += 2</code> làm i = 3 nên kết quả là 333. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code snippet?<pre><code>void main(){\n     int x = 4;\n     int *p = &amp;x;\n     int *k = p++;\n     int r = p - k;\n     printf(&quot;%d&quot;, r);\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>void main(){\n     int x = 4;\n     int *p = &amp;x;\n     int *k = p++;\n     int r = p - k;\n     printf(&quot;%d&quot;, r);\n}</code></pre>",
          "options": [
            {
              "text": "1|||1"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "0|||0"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Post-increment assigns the OLD pointer to k, then advances p by one int. Subtracting two pointers gives the number of ELEMENTS between them (not bytes), so <code>p - k</code> = 1 — even though the raw addresses differ by 4 bytes. (Verified by running the code.)</div><div class=\"ml-vi\">Toán tử tăng SAU gán con trỏ CŨ cho k, rồi mới dịch p đi một phần tử int. Hiệu hai con trỏ cho số PHẦN TỬ giữa chúng (không phải số byte) nên <code>p - k</code> = 1 — dù địa chỉ thô chênh nhau 4 byte. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume we have the following codes:<pre><code>double d=9;\ndouble *p = &amp;d;</code></pre>Suppose that a double occupies the memory block of 8 bytes, and the address of d is 1200. What is the result of the following expression: <code>p + 8</code>?|||Cho đoạn mã sau:<pre><code>double d=9;\ndouble *p = &amp;d;</code></pre>Giả sử một double chiếm khối nhớ 8 byte và địa chỉ của d là 1200. Kết quả của biểu thức <code>p + 8</code> là bao nhiêu?",
          "options": [
            {
              "text": "1264|||1264"
            },
            {
              "text": "1200|||1200"
            },
            {
              "text": "1208|||1208"
            },
            {
              "text": "1209|||1209"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Pointer arithmetic counts in ELEMENTS, not bytes: adding 8 to a <code>double *</code> advances it by 8 doubles = 8 × 8 = 64 bytes. So p + 8 = 1200 + 64 = 1264. (1208 would be the answer if it moved only one double; 1209 would be plain byte arithmetic.)</div><div class=\"ml-vi\">Số học con trỏ tính theo PHẦN TỬ chứ không theo byte: cộng 8 vào một <code>double *</code> làm nó dịch đi 8 phần tử double = 8 × 8 = 64 byte. Vậy p + 8 = 1200 + 64 = 1264. (1208 là kết quả nếu chỉ dịch một double; 1209 là cộng byte thuần tuý.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is used for single character I/O?|||Cặp hàm nào dùng cho nhập/xuất MỘT ký tự?",
          "options": [
            {
              "text": "getchar() and putchar()|||getchar() và putchar()"
            },
            {
              "text": "gets() and puts()|||gets() và puts()"
            },
            {
              "text": "scanf() and printf()|||scanf() và printf()"
            },
            {
              "text": "fgets() and fputs()|||fgets() và fputs()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The names say it: <code>getchar</code>/<code>putchar</code> read and write ONE character. <code>gets</code>/<code>puts</code> and <code>fgets</code>/<code>fputs</code> work on whole strings, while <code>scanf</code>/<code>printf</code> are general formatted I/O.</div><div class=\"ml-vi\">Chính tên hàm đã nói rõ: <code>getchar</code>/<code>putchar</code> đọc và ghi MỘT ký tự. <code>gets</code>/<code>puts</code> và <code>fgets</code>/<code>fputs</code> làm việc với cả chuỗi, còn <code>scanf</code>/<code>printf</code> là nhập/xuất có định dạng tổng quát.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which character is commonly used to mark the end of a string in C?|||Ký tự nào thường dùng để đánh dấu kết thúc một chuỗi trong C?",
          "options": [
            {
              "text": "<code>&#x27;\\0&#x27;</code>|||<code>&#x27;\\0&#x27;</code>"
            },
            {
              "text": "<code>&#x27;\\n&#x27;</code>|||<code>&#x27;\\n&#x27;</code>"
            },
            {
              "text": "<code>&#x27;\\t&#x27;</code>|||<code>&#x27;\\t&#x27;</code>"
            },
            {
              "text": "<code>&#x27;\\&#x27;</code>|||<code>&#x27;\\&#x27;</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>&#x27;\\0&#x27;</code> (the null character, code 0) terminates every C string — that is how strlen, printf and friends know where to stop. <code>&#x27;\\n&#x27;</code> is a newline and <code>&#x27;\\t&#x27;</code> is a tab; both are ordinary printable-stream characters, not terminators.</div><div class=\"ml-vi\"><code>&#x27;\\0&#x27;</code> (ký tự null, mã 0) kết thúc mọi chuỗi trong C — nhờ đó strlen, printf… biết dừng ở đâu. <code>&#x27;\\n&#x27;</code> là xuống dòng và <code>&#x27;\\t&#x27;</code> là tab; cả hai là ký tự thường trong luồng xuất chứ không phải ký tự kết thúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function is used to concatenate two strings in C?|||Hàm nào dùng để NỐI hai chuỗi trong C?",
          "options": [
            {
              "text": "strcat()|||strcat()"
            },
            {
              "text": "strcomb()|||strcomb()"
            },
            {
              "text": "strmerge()|||strmerge()"
            },
            {
              "text": "strconnect()|||strconnect()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>strcat(dest, src)</code> appends src to the end of dest (\"cat\" = concatenate). The other three names do not exist in the C standard library. Remember dest must have enough room for both strings plus the terminator.</div><div class=\"ml-vi\"><code>strcat(dest, src)</code> nối src vào cuối dest (\"cat\" = concatenate, nối). Ba tên còn lại không tồn tại trong thư viện chuẩn C. Nhớ rằng dest phải đủ chỗ cho cả hai chuỗi cộng ký tự kết thúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How can you check if a file was successfully opened for writing in C?|||Làm sao kiểm tra một tệp đã được mở để GHI thành công trong C?",
          "options": [
            {
              "text": "Checking the return value of fopen()|||Kiểm tra giá trị trả về của fopen()"
            },
            {
              "text": "Using ferror()|||Dùng ferror()"
            },
            {
              "text": "Using feof()|||Dùng feof()"
            },
            {
              "text": "Using fprintf()|||Dùng fprintf()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>fopen</code> returns <code>NULL</code> when it fails, so the standard idiom is <code>FILE *f = fopen(&quot;x.txt&quot;, &quot;w&quot;); if (f == NULL) { /* handle error */ }</code>. <code>feof</code> detects end-of-file and <code>ferror</code> reports errors DURING later reads/writes — both need a valid FILE* to begin with.</div><div class=\"ml-vi\"><code>fopen</code> trả về <code>NULL</code> khi thất bại nên cách viết chuẩn là <code>FILE *f = fopen(&quot;x.txt&quot;, &quot;w&quot;); if (f == NULL) { /* xử lý lỗi */ }</code>. <code>feof</code> phát hiện hết tệp còn <code>ferror</code> báo lỗi TRONG các thao tác đọc/ghi sau đó — cả hai đều cần đã có FILE* hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function is used to read a string from a file in C?|||Hàm nào dùng để ĐỌC một chuỗi từ tệp trong C?",
          "options": [
            {
              "text": "fgets()|||fgets()"
            },
            {
              "text": "fputs()|||fputs()"
            },
            {
              "text": "ftell()|||ftell()"
            },
            {
              "text": "fopen()|||fopen()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>fgets</code> reads; <code>fputs</code> WRITES a string (note the p = put); <code>ftell</code> reports the current position in the file; <code>fopen</code> only opens it.</div><div class=\"ml-vi\"><code>fgets</code> để đọc; <code>fputs</code> để GHI chuỗi (chữ p = put); <code>ftell</code> cho biết vị trí hiện tại trong tệp; <code>fopen</code> chỉ mở tệp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code snippet?<pre><code>char words[4][11];\nstrcpy(words[0], &quot;apple&quot;);\nstrcat(words[0], &quot;juice&quot;);\nprintf(&quot;%s\\n&quot;, words[0]);</code></pre>|||Đoạn mã sau in ra gì?<pre><code>char words[4][11];\nstrcpy(words[0], &quot;apple&quot;);\nstrcat(words[0], &quot;juice&quot;);\nprintf(&quot;%s\\n&quot;, words[0]);</code></pre>",
          "options": [
            {
              "text": "applejuice|||applejuice"
            },
            {
              "text": "apple|||apple"
            },
            {
              "text": "juice|||juice"
            },
            {
              "text": "juiceapple|||juiceapple"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>strcpy</code> puts \"apple\" into words[0], then <code>strcat</code> APPENDS \"juice\" after it, giving \"applejuice\" (10 characters + terminator = 11, exactly the row size — it just fits). Order matters: strcat always appends to the FIRST argument, so \"juiceapple\" is impossible here. (Verified by running the code.)</div><div class=\"ml-vi\"><code>strcpy</code> đặt \"apple\" vào words[0], rồi <code>strcat</code> NỐI THÊM \"juice\" phía sau, được \"applejuice\" (10 ký tự + ký tự kết thúc = 11, vừa đúng kích thước mỗi dòng). Thứ tự quan trọng: strcat luôn nối vào đối số THỨ NHẤT nên \"juiceapple\" là không thể. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following code?<pre><code>printf(&quot;%c&quot;, tolower(&#x27;c&#x27;));</code></pre>|||Đoạn mã sau in ra gì?<pre><code>printf(&quot;%c&quot;, tolower(&#x27;c&#x27;));</code></pre>",
          "options": [
            {
              "text": "'c'|||'c'"
            },
            {
              "text": "'C'|||'C'"
            },
            {
              "text": "'c' or 'C' (depending on IDE)|||'c' hoặc 'C' (tuỳ IDE)"
            },
            {
              "text": "Compilation error|||Lỗi biên dịch"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>tolower</code> converts an uppercase letter to lowercase and leaves everything else UNCHANGED. <code>&#x27;c&#x27;</code> is already lowercase, so it comes back as <code>&#x27;c&#x27;</code>. The behaviour is defined by the standard, so it cannot vary by IDE.</div><div class=\"ml-vi\"><code>tolower</code> đổi chữ HOA thành chữ thường và giữ NGUYÊN mọi ký tự khác. <code>&#x27;c&#x27;</code> vốn đã là chữ thường nên trả về đúng <code>&#x27;c&#x27;</code>. Hành vi này do chuẩn quy định nên không thể thay đổi theo IDE.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which library contains the abs() function?|||Thư viện nào chứa hàm abs()?",
          "options": [
            {
              "text": "time.h|||time.h"
            },
            {
              "text": "conio.h|||conio.h"
            },
            {
              "text": "math.h|||math.h"
            },
            {
              "text": "stdlib.h|||stdlib.h"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><code>abs()</code> (absolute value of an INT) is declared in <code>stdlib.h</code>. The floating-point version <code>fabs()</code> is the one in <code>math.h</code> — that is the trap in this question.</div><div class=\"ml-vi\"><code>abs()</code> (trị tuyệt đối của số NGUYÊN) được khai báo trong <code>stdlib.h</code>. Bản dành cho số thực là <code>fabs()</code> mới nằm trong <code>math.h</code> — đó chính là bẫy của câu này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of these is NOT a relational or logical operator?|||Toán tử nào KHÔNG phải toán tử quan hệ hay toán tử logic?",
          "options": [
            {
              "text": "<code>=</code>|||<code>=</code>"
            },
            {
              "text": "<code>||</code>|||<code>||</code>"
            },
            {
              "text": "<code>==</code>|||<code>==</code>"
            },
            {
              "text": "<code>!=</code>|||<code>!=</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A single <code>=</code> is the ASSIGNMENT operator — it stores a value. <code>||</code> is logical OR, while <code>==</code> and <code>!=</code> are the relational equality operators.</div><div class=\"ml-vi\">Một dấu <code>=</code> là toán tử GÁN — nó lưu giá trị. <code>||</code> là OR logic, còn <code>==</code> và <code>!=</code> là các toán tử quan hệ so sánh bằng/khác.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D3",
      "source": "REAL",
      "sortOrder": 2,
      "title": "Đề 3 — SP26 Final Exam|||Đề 3 — Thi cuối kỳ SP26",
      "description": "PRF192 real FE multiple-choice paper (Spring 2026 final), transcribed from the exam images; answers reasoned and code-verified here. (50 questions)|||Đề trắc nghiệm FE thật môn PRF192 (thi cuối kỳ Xuân 2026), chép từ ảnh đề; đáp án được suy luận và chạy thử mã để kiểm chứng. (50 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Some questions show C source code — read it carefully, especially operator precedence, integer division and where a loop body actually ends. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một số câu có mã nguồn C — đọc kỹ, nhất là thứ tự ưu tiên toán tử, phép chia nguyên và chỗ thân vòng lặp thực sự kết thúc. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the incorrect definition?|||Định nghĩa nào SAI?",
          "options": [
            {
              "text": "Algorithm: a way to find out a solution|||Thuật toán: một cách để tìm ra lời giải"
            },
            {
              "text": "Data: Values are used to describe information. So, information can be called as the mean of data|||Dữ liệu: các giá trị dùng để mô tả thông tin. Vì vậy thông tin có thể coi là ý nghĩa của dữ liệu"
            },
            {
              "text": "Solution: A situation in which something is hidden|||Lời giải (Solution): một tình huống trong đó có thứ gì đó bị che giấu"
            },
            {
              "text": "Information: Knowledge about something|||Thông tin: hiểu biết về một điều gì đó"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A solution is the ANSWER to a problem — the thing you arrive at. \"A situation in which something is hidden\" describes a problem or a puzzle, not a solution, so C is the incorrect definition. The other three match the standard course definitions.</div><div class=\"ml-vi\">Lời giải là ĐÁP ÁN của một bài toán — thứ ta tìm ra được. \"Một tình huống trong đó có thứ gì đó bị che giấu\" mô tả một VẤN ĐỀ hay một câu đố chứ không phải lời giải, nên C là định nghĩa sai. Ba phương án còn lại đúng với định nghĩa chuẩn của môn học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is not a type of bus in a computer?|||Đâu KHÔNG phải một loại bus trong máy tính?",
          "options": [
            {
              "text": "Address bus|||Address bus (bus địa chỉ)"
            },
            {
              "text": "Signal bus|||Signal bus"
            },
            {
              "text": "Control bus|||Control bus (bus điều khiển)"
            },
            {
              "text": "Data bus|||Data bus (bus dữ liệu)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A computer has exactly three system buses: the ADDRESS bus (says where), the DATA bus (carries the value) and the CONTROL bus (says read or write, and when). \"Signal bus\" is not one of them — the control bus is what carries the control signals.</div><div class=\"ml-vi\">Máy tính có đúng ba bus hệ thống: bus ĐỊA CHỈ (cho biết ở đâu), bus DỮ LIỆU (mang giá trị) và bus ĐIỀU KHIỂN (cho biết đọc hay ghi, và khi nào). \"Signal bus\" không nằm trong số đó — chính bus điều khiển mới là nơi truyền các tín hiệu điều khiển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "During the compilation process, what will be done with comments?|||Trong quá trình biên dịch, các dòng chú thích (comment) được xử lý thế nào?",
          "options": [
            {
              "text": "The comment mark will be removed. The content of the comments will be compiled line by line.|||Dấu chú thích bị bỏ đi. Nội dung chú thích được biên dịch từng dòng."
            },
            {
              "text": "The comment is treated as an array of characters.|||Chú thích được coi như một mảng ký tự."
            },
            {
              "text": "Comments are removed in the pre-processing step.|||Chú thích bị LOẠI BỎ ở bước tiền xử lý."
            },
            {
              "text": "Each comment is compiled as a statement that does nothing.|||Mỗi chú thích được biên dịch thành một câu lệnh không làm gì cả."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The preprocessor runs before the compiler proper and strips every comment (replacing it with a single space), together with handling <code>#include</code> and <code>#define</code>. By the time the compiler sees the code the comments are simply gone — they produce no instructions at all, which is why they cost nothing at runtime.</div><div class=\"ml-vi\">Bộ tiền xử lý chạy trước trình biên dịch thật sự và XOÁ mọi chú thích (thay bằng một dấu cách), cùng lúc xử lý <code>#include</code> và <code>#define</code>. Khi trình biên dịch nhìn thấy mã thì các chú thích đã biến mất — chúng không sinh ra chỉ thị nào cả, nên không tốn gì lúc chạy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Errors that occur due to syntax errors belong to which of the following?|||Lỗi do sai cú pháp thuộc loại nào sau đây?",
          "options": [
            {
              "text": "Compile time error|||Lỗi lúc biên dịch (Compile time error)"
            },
            {
              "text": "Run time error|||Lỗi lúc chạy (Run time error)"
            },
            {
              "text": "Input error|||Lỗi nhập liệu"
            },
            {
              "text": "Linking error|||Lỗi liên kết (Linking error)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Syntax is checked by the compiler, so a missing semicolon or an unmatched brace stops compilation and no executable is produced — a compile-time error. Runtime errors (division by zero, dereferencing NULL) only appear when a successfully compiled program runs, and a linking error is about missing/duplicate symbols, not syntax.</div><div class=\"ml-vi\">Cú pháp do trình biên dịch kiểm tra, nên thiếu dấu chấm phẩy hay lệch ngoặc nhọn sẽ chặn việc biên dịch và không sinh ra file thực thi — đó là lỗi lúc biên dịch. Lỗi lúc chạy (chia cho 0, truy xuất con trỏ NULL) chỉ xuất hiện khi chương trình đã biên dịch thành công và đang chạy, còn lỗi liên kết là về ký hiệu thiếu/trùng chứ không phải cú pháp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is incorrect?|||Phát biểu nào sau đây SAI?",
          "options": [
            {
              "text": "To make our programs longer, we use higher-level languages.|||Để chương trình DÀI HƠN, ta dùng ngôn ngữ bậc cao."
            },
            {
              "text": "Program code in a high level language can not run, it must be translated to binary code (machine code) before running.|||Mã chương trình viết bằng ngôn ngữ bậc cao không chạy được, phải dịch sang mã nhị phân (mã máy) trước khi chạy."
            },
            {
              "text": "C is based on a view of structured programming.|||C dựa trên quan điểm lập trình có cấu trúc."
            },
            {
              "text": "Programs that perform relatively simple tasks and are written in assembly language typically require more lines of code than those written in higher-level languages|||Chương trình thực hiện những việc tương đối đơn giản viết bằng hợp ngữ thường cần NHIỀU dòng mã hơn so với viết bằng ngôn ngữ bậc cao"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Higher-level languages exist to make programs SHORTER and easier to read, not longer — statement A says the opposite of the truth, so it is the incorrect one. Note that D says the same idea correctly from the other side: assembly needs more lines than a high-level language for the same job.</div><div class=\"ml-vi\">Ngôn ngữ bậc cao sinh ra để chương trình NGẮN GỌN và dễ đọc hơn, chứ không phải dài hơn — phát biểu A nói ngược sự thật nên đó là phát biểu sai. Lưu ý phương án D nói đúng cùng ý đó từ phía ngược lại: hợp ngữ cần nhiều dòng hơn ngôn ngữ bậc cao cho cùng một công việc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which keyword is used to define a named constant in C? (Choose 2 correct answers)|||Từ khoá nào dùng để định nghĩa một HẰNG SỐ CÓ TÊN trong C? (Chọn 2 đáp án đúng)",
          "options": [
            {
              "text": "const|||const"
            },
            {
              "text": "define|||define"
            },
            {
              "text": "constant|||constant"
            },
            {
              "text": "named|||named"
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">C offers two ways: <code>const double PI = 3.14;</code> creates a real, typed read-only variable, while <code>#define PI 3.14</code> is a preprocessor macro that textually substitutes the value. <code>constant</code> and <code>named</code> are not C keywords at all.</div><div class=\"ml-vi\">C có hai cách: <code>const double PI = 3.14;</code> tạo ra một biến thật, có kiểu và chỉ đọc; còn <code>#define PI 3.14</code> là macro tiền xử lý thay thế giá trị theo kiểu văn bản. <code>constant</code> và <code>named</code> hoàn toàn không phải từ khoá của C.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the binary representation of 0xA2?|||Biểu diễn nhị phân của 0xA2 là gì?",
          "options": [
            {
              "text": "0b01100010|||0b01100010"
            },
            {
              "text": "0b10100010|||0b10100010"
            },
            {
              "text": "0b10010010|||0b10010010"
            },
            {
              "text": "0b10110010|||0b10110010"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Convert each hex digit to 4 bits independently: A = 10 = 1010, and 2 = 0010. Concatenating gives 1010 0010 — that is why hexadecimal is convenient, one digit maps to exactly one nibble. (Check: 0xA2 = 162 = 128 + 32 + 2. ✓)</div><div class=\"ml-vi\">Đổi từng chữ số hệ 16 thành 4 bit một cách độc lập: A = 10 = 1010, và 2 = 0010. Ghép lại được 1010 0010 — đó chính là lý do hệ 16 tiện lợi, mỗi chữ số ứng với đúng một nửa byte. (Kiểm tra: 0xA2 = 162 = 128 + 32 + 2. ✓)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the following program display?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a[5] = {1, 2, 3};\n    printf(&quot;%d %d %d %d %d&quot;, a[0], a[1], a[2], a[3], a[4]);\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    int a[5] = {1, 2, 3};\n    printf(&quot;%d %d %d %d %d&quot;, a[0], a[1], a[2], a[3], a[4]);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "1 2 3 0 0|||1 2 3 0 0"
            },
            {
              "text": "1 2 3 4 5|||1 2 3 4 5"
            },
            {
              "text": "1 2 3 a[3] a[4]|||1 2 3 a[3] a[4]"
            },
            {
              "text": "An error will be raised.|||Chương trình báo lỗi."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">When an initialiser list is SHORTER than the declared size, C fills the remaining elements with 0 — it is not an error and the values are not garbage. So a[3] and a[4] are both 0, giving \"1 2 3 0 0\". (This is also why <code>int a[5] = {0};</code> zeroes an entire array.)</div><div class=\"ml-vi\">Khi danh sách khởi tạo NGẮN HƠN kích thước khai báo, C điền 0 vào các phần tử còn lại — đây không phải lỗi và giá trị cũng không phải rác. Vậy a[3] và a[4] đều bằng 0, cho kết quả \"1 2 3 0 0\". (Đây cũng là lý do <code>int a[5] = {0};</code> làm cả mảng bằng 0.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statements are correct when copying string s1 into s2 manually? (Choose 2 correct answers)|||Phát biểu nào ĐÚNG khi sao chép chuỗi s1 sang s2 một cách THỦ CÔNG? (Chọn 2 đáp án đúng)",
          "options": [
            {
              "text": "Uses array indexing|||Dùng chỉ số mảng (array indexing)"
            },
            {
              "text": "Uses pointer arithmetic|||Dùng số học con trỏ (pointer arithmetic)"
            },
            {
              "text": "Requires memory allocation|||Bắt buộc phải cấp phát bộ nhớ"
            },
            {
              "text": "Works without checking for buffer overflow|||Chạy được mà không cần kiểm tra tràn bộ đệm"
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">A hand-written copy loop can be expressed two equivalent ways: with indexes — <code>while ((s2[i] = s1[i]) != &#x27;\\0&#x27;) i++;</code> — or with pointers — <code>while ((*p2++ = *p1++));</code>. Those are options A and B. C is false because s2 may already be a fixed array with no allocation needed, and D states a DANGER (silently overflowing s2), not something correct to rely on.</div><div class=\"ml-vi\">Vòng lặp sao chép tự viết có thể diễn đạt theo hai cách tương đương: dùng chỉ số — <code>while ((s2[i] = s1[i]) != &#x27;\\0&#x27;) i++;</code> — hoặc dùng con trỏ — <code>while ((*p2++ = *p1++));</code>. Đó là phương án A và B. C sai vì s2 có thể đã là mảng cố định không cần cấp phát, còn D nêu một MỐI NGUY (âm thầm tràn s2) chứ không phải điều đúng đắn để dựa vào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which condition increases the word count in a sentence?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;string.h&gt;\nint main() {\n    char s[1000];\n    int i, count = 0;\n    printf(&quot;Enter a sentence: &quot;);\n    fgets(s, sizeof(s), stdin);\n    for (i = 0; s[i] != &#x27;\\0&#x27;; i++) {\n        if (condition???) {\n            count++;\n        }\n    }\n    printf(&quot;Total words: %d\\n&quot;, count);\n    return 0;\n}</code></pre>|||Điều kiện nào làm tăng số ĐẾM TỪ trong một câu?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;string.h&gt;\nint main() {\n    char s[1000];\n    int i, count = 0;\n    printf(&quot;Enter a sentence: &quot;);\n    fgets(s, sizeof(s), stdin);\n    for (i = 0; s[i] != &#x27;\\0&#x27;; i++) {\n        if (condition???) {\n            count++;\n        }\n    }\n    printf(&quot;Total words: %d\\n&quot;, count);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "<code>s[i] != &#x27; &#x27;</code>|||<code>s[i] != &#x27; &#x27;</code>"
            },
            {
              "text": "<code>s[i] != &#x27;\\n&#x27;</code>|||<code>s[i] != &#x27;\\n&#x27;</code>"
            },
            {
              "text": "<code>s[i] != &#x27; &#x27; &amp;&amp; (i == 0 || s[i-1] == &#x27; &#x27;)</code>|||<code>s[i] != &#x27; &#x27; &amp;&amp; (i == 0 || s[i-1] == &#x27; &#x27;)</code>"
            },
            {
              "text": "<code>s[i] == &#x27; &#x27; &amp;&amp; s[i-1] == &#x27; &#x27;</code>|||<code>s[i] == &#x27; &#x27; &amp;&amp; s[i-1] == &#x27; &#x27;</code>"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">To count WORDS you must count each word exactly once — at its FIRST character. Option C says precisely that: the current character is not a space, AND it is either the very first character of the string or the character before it was a space. Options A and B would count every letter, not every word, and D counts pairs of consecutive spaces.</div><div class=\"ml-vi\">Để đếm TỪ, bạn phải đếm mỗi từ đúng một lần — tại ký tự ĐẦU TIÊN của nó. Phương án C nói chính xác điều đó: ký tự hiện tại không phải dấu cách, VÀ nó hoặc là ký tự đầu chuỗi hoặc ký tự liền trước là dấu cách. Phương án A và B sẽ đếm từng chữ cái chứ không phải từng từ, còn D đếm các cặp dấu cách liên tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following conditions will evaluate to true if <code>y &lt; z</code> is true?|||Điều kiện nào sau đây chắc chắn ĐÚNG nếu <code>y &lt; z</code> đúng?",
          "options": [
            {
              "text": "<code>x &lt; z &amp;&amp; y &lt; z</code>|||<code>x &lt; z &amp;&amp; y &lt; z</code>"
            },
            {
              "text": "<code>x &lt; z || y &lt; z</code>|||<code>x &lt; z || y &lt; z</code>"
            },
            {
              "text": "<code>y &gt; x || y &gt; z</code>|||<code>y &gt; x || y &gt; z</code>"
            },
            {
              "text": "<code>y &lt; z &amp;&amp; z &lt; x</code>|||<code>y &lt; z &amp;&amp; z &lt; x</code>"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">With an <code>||</code>, ONE true operand is enough for the whole expression to be true — so <code>x &lt; z || y &lt; z</code> is guaranteed true no matter what x is. The two <code>&amp;&amp;</code> options (A and D) also need a second, unknown condition to hold, and option C contains <code>y &gt; z</code>, which is the OPPOSITE of what we were told, plus <code>y &gt; x</code> about which we know nothing.</div><div class=\"ml-vi\">Với phép <code>||</code>, chỉ cần MỘT vế đúng là cả biểu thức đúng — nên <code>x &lt; z || y &lt; z</code> chắc chắn đúng bất kể x là gì. Hai phương án dùng <code>&amp;&amp;</code> (A và D) còn cần thêm một điều kiện chưa biết, còn phương án C chứa <code>y &gt; z</code> — ngược hẳn với giả thiết — cộng thêm <code>y &gt; x</code> mà ta không biết gì.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following C code?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int x = 0;\n    if (x == 0)\n        printf(&quot;Hi&quot;);\n    else\n        printf(&quot;How are you&quot;);\n        printf(&quot;Hello&quot;);\n}</code></pre>|||Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int x = 0;\n    if (x == 0)\n        printf(&quot;Hi&quot;);\n    else\n        printf(&quot;How are you&quot;);\n        printf(&quot;Hello&quot;);\n}</code></pre>",
          "options": [
            {
              "text": "Hi|||Hi"
            },
            {
              "text": "How are you|||How are you"
            },
            {
              "text": "Hello|||Hello"
            },
            {
              "text": "HiHello|||HiHello"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Indentation does not create a block in C. Without braces, the else owns ONLY <code>printf(&quot;How are you&quot;);</code>, so the final <code>printf(&quot;Hello&quot;);</code> sits outside the if/else and always runs. x == 0 is true → \"Hi\" then \"Hello\" → HiHello. (Verified by running the code.)</div><div class=\"ml-vi\">Thụt lề KHÔNG tạo ra khối lệnh trong C. Không có ngoặc nhọn thì else chỉ bao gồm <code>printf(&quot;How are you&quot;);</code>, nên lệnh <code>printf(&quot;Hello&quot;);</code> cuối nằm ngoài if/else và luôn chạy. x == 0 đúng → \"Hi\" rồi \"Hello\" → HiHello. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does a variable store in memory?|||Một biến lưu cái gì trong bộ nhớ?",
          "options": [
            {
              "text": "Compiler instructions|||Chỉ thị của trình biên dịch"
            },
            {
              "text": "Debug information|||Thông tin gỡ lỗi"
            },
            {
              "text": "Binary data|||Dữ liệu nhị phân"
            },
            {
              "text": "Memory addresses of other programs|||Địa chỉ bộ nhớ của các chương trình khác"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">At the hardware level memory holds nothing but bits. Whatever you store — an int, a float, a character — is kept as binary data; the variable's TYPE is what tells the compiler how to interpret those bits. Options A, B and D describe things the compiler or debugger manages, not the content of a variable.</div><div class=\"ml-vi\">Ở mức phần cứng, bộ nhớ chỉ chứa các bit. Bất kể bạn lưu gì — số nguyên, số thực, ký tự — đều được giữ dưới dạng dữ liệu nhị phân; chính KIỂU của biến mới cho trình biên dịch biết cách diễn giải các bit đó. Phương án A, B và D mô tả những thứ do trình biên dịch hoặc trình gỡ lỗi quản lý, không phải nội dung của một biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does a \"for\" loop differ from a \"while\" loop in C programming?|||Vòng lặp \"for\" khác vòng lặp \"while\" như thế nào trong lập trình C?",
          "options": [
            {
              "text": "A \"for\" loop is used for iterating over a sequence of elements, while a \"while\" loop is used to execute a block of code repeatedly as long as a condition is true.|||Vòng \"for\" dùng để duyệt qua một dãy phần tử, còn vòng \"while\" dùng để lặp một khối lệnh chừng nào điều kiện còn đúng."
            },
            {
              "text": "A \"for\" loop is primarily used for conditional statements, while a \"while\" loop is designed for sequential processing.|||Vòng \"for\" chủ yếu dùng cho câu lệnh điều kiện, còn vòng \"while\" thiết kế cho xử lý tuần tự."
            },
            {
              "text": "The use of \"for\" and \"while\" loops is interchangeable; there is no substantial difference between them.|||Dùng \"for\" hay \"while\" là như nhau; giữa chúng không có khác biệt đáng kể."
            },
            {
              "text": "A \"for\" loop is exclusively used with arrays, while a \"while\" loop is used with numerical calculations.|||Vòng \"for\" chỉ dùng với mảng, còn vòng \"while\" dùng với tính toán số học."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The practical distinction is about intent: <code>for</code> gathers initialisation, condition and increment in one header, which suits a KNOWN number of iterations (walking a sequence); <code>while</code> tests only a condition, which suits \"keep going until something happens\". They are technically interchangeable but option C ignores that difference in readability, and B and D invent restrictions that do not exist.</div><div class=\"ml-vi\">Khác biệt thực tế nằm ở ý định sử dụng: <code>for</code> gom khởi tạo, điều kiện và bước tăng vào một dòng đầu, hợp với số lần lặp ĐÃ BIẾT (duyệt một dãy); <code>while</code> chỉ kiểm tra điều kiện, hợp với kiểu \"cứ chạy tới khi nào xảy ra chuyện gì đó\". Về kỹ thuật chúng thay thế được cho nhau nhưng phương án C bỏ qua khác biệt về tính dễ đọc, còn B và D bịa ra những hạn chế không hề tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What term is commonly used to specify both the type and name of a variable or constant in a C programming language?|||Thuật ngữ nào thường dùng để chỉ việc nêu rõ CẢ kiểu lẫn tên của một biến hoặc hằng trong ngôn ngữ C?",
          "options": [
            {
              "text": "Identification|||Identification"
            },
            {
              "text": "Name|||Name"
            },
            {
              "text": "Declaration|||Declaration (Khai báo)"
            },
            {
              "text": "Definition|||Definition (Định nghĩa)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Writing <code>int count;</code> — a type followed by a name — is a DECLARATION. \"Definition\" is the close cousin that also reserves storage or supplies a body (for functions the distinction matters: a prototype declares, the code block defines), but the term the course uses for stating type + name is declaration.</div><div class=\"ml-vi\">Viết <code>int count;</code> — một kiểu rồi tới một tên — chính là KHAI BÁO (declaration). \"Định nghĩa\" (definition) là khái niệm họ hàng, còn cấp phát chỗ nhớ hoặc cung cấp phần thân (với hàm thì phân biệt này quan trọng: nguyên mẫu là khai báo, khối mã là định nghĩa), nhưng thuật ngữ môn học dùng cho việc nêu kiểu + tên là declaration.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What benefit does #define offer when dealing with magic values in code?|||Chỉ thị #define mang lại lợi ích gì khi xử lý các \"magic value\" trong mã?",
          "options": [
            {
              "text": "It improves code portability|||Cải thiện tính khả chuyển của mã"
            },
            {
              "text": "It makes the code shorter|||Làm cho mã ngắn hơn"
            },
            {
              "text": "It prevents the use of symbolic names|||Ngăn việc dùng tên tượng trưng"
            },
            {
              "text": "It increases code complexity|||Làm mã phức tạp hơn"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A \"magic value\" is a raw literal such as <code>3.14159</code> or <code>100</code> scattered through the code. Replacing it with <code>#define PI 3.14159</code> gives it a single symbolic name defined in one place, so a value that has to change per platform or per build is changed once — that is what makes the code portable and maintainable. Option C is the exact opposite of what #define does, and it neither shortens the code nor adds complexity.</div><div class=\"ml-vi\">\"Magic value\" là con số trần như <code>3.14159</code> hay <code>100</code> nằm rải rác trong mã. Thay bằng <code>#define PI 3.14159</code> sẽ cho nó một tên tượng trưng khai báo ở MỘT chỗ, nên giá trị cần đổi theo nền tảng hay theo bản build chỉ phải sửa một lần — đó chính là điều làm mã khả chuyển và dễ bảo trì. Phương án C nói ngược hẳn tác dụng của #define, còn #define không làm mã ngắn đi cũng không làm phức tạp thêm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the result of the following expression?<br><code>int a = 8, b = 6, c = 4;  b++ * ++c + --a;</code>|||Kết quả của biểu thức sau là gì?<br><code>int a = 8, b = 6, c = 4;  b++ * ++c + --a;</code>",
          "options": [
            {
              "text": "16|||16"
            },
            {
              "text": "28|||28"
            },
            {
              "text": "37|||37"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "-28|||-28"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><code>b++</code> is post-increment: it yields the OLD value 6 (b then becomes 7). <code>++c</code> is pre-increment: c becomes 5 and yields 5. <code>--a</code> makes a = 7 and yields 7. Multiplication binds tighter than addition, so the expression is 6 × 5 + 7 = 30 + 7 = 37.</div><div class=\"ml-vi\"><code>b++</code> là tăng SAU: nó cho giá trị CŨ là 6 (b sau đó thành 7). <code>++c</code> là tăng TRƯỚC: c thành 5 và cho giá trị 5. <code>--a</code> làm a = 7 và cho giá trị 7. Phép nhân ưu tiên hơn phép cộng nên biểu thức là 6 × 5 + 7 = 30 + 7 = 37.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output?<pre><code>int a = 8;\nint b = 3;\nint result = a % b * 2;\nprintf(&quot;%d&quot;, result);</code></pre>|||Đoạn mã sau in ra gì?<pre><code>int a = 8;\nint b = 3;\nint result = a % b * 2;\nprintf(&quot;%d&quot;, result);</code></pre>",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>%</code> and <code>*</code> have the SAME precedence and associate left to right, so the expression is <code>(a % b) * 2</code>, not <code>a % (b * 2)</code>. 8 % 3 = 2, then 2 × 2 = 4. (If it had been grouped the other way the answer would be 8 % 6 = 2 — which is exactly the distractor in option A.)</div><div class=\"ml-vi\"><code>%</code> và <code>*</code> có CÙNG độ ưu tiên và kết hợp từ trái sang phải, nên biểu thức là <code>(a % b) * 2</code> chứ không phải <code>a % (b * 2)</code>. 8 % 3 = 2, rồi 2 × 2 = 4. (Nếu nhóm theo cách kia thì kết quả là 8 % 6 = 2 — chính là phương án nhiễu A.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a C program, what happens if none of the conditions in an if-else statement are true?|||Trong chương trình C, điều gì xảy ra nếu KHÔNG điều kiện nào trong câu lệnh if-else đúng?",
          "options": [
            {
              "text": "The program will skip the if-else block and continue with the next statement.|||Chương trình bỏ qua khối if-else và chạy tiếp câu lệnh sau đó."
            },
            {
              "text": "The program will raise an error.|||Chương trình báo lỗi."
            },
            {
              "text": "The else if block will be executed.|||Khối else if sẽ được thực thi."
            },
            {
              "text": "The program will terminate abruptly.|||Chương trình kết thúc đột ngột."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <code>if</code> chain without a final <code>else</code> simply does nothing when every condition is false — that is not an error condition in C. Execution continues at the first statement after the chain. (Option C is wrong because an <code>else if</code> is itself guarded by a condition; if that condition is false too, it does not run either.)</div><div class=\"ml-vi\">Chuỗi <code>if</code> không có <code>else</code> cuối cùng thì đơn giản là không làm gì khi mọi điều kiện đều sai — đây không phải lỗi trong C. Chương trình chạy tiếp từ câu lệnh ngay sau chuỗi đó. (Phương án C sai vì bản thân <code>else if</code> cũng có điều kiện riêng; nếu điều kiện đó cũng sai thì nó cũng không chạy.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will the following program output?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int a = -5;\n\n    switch ((a &gt; 0) - (a &lt; 0)) {\n        case 1:\n            printf(&quot;a is an positive number.&quot;);\n            break;\n        case -1:\n            printf(&quot;a is an negative number.&quot;);\n            break;\n        default:\n            printf(&quot;a is zero.&quot;);\n    }\n\n    return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n\nint main()\n{\n    int a = -5;\n\n    switch ((a &gt; 0) - (a &lt; 0)) {\n        case 1:\n            printf(&quot;a is an positive number.&quot;);\n            break;\n        case -1:\n            printf(&quot;a is an negative number.&quot;);\n            break;\n        default:\n            printf(&quot;a is zero.&quot;);\n    }\n\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "a is an positive number.|||a is an positive number."
            },
            {
              "text": "a is an negative number.|||a is an negative number."
            },
            {
              "text": "a is zero.|||a is zero."
            },
            {
              "text": "An error will be raised.|||Chương trình báo lỗi."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The expression <code>(a &gt; 0) - (a &lt; 0)</code> is the classic \"sign\" trick: it gives +1 for a positive number, -1 for a negative one and 0 for zero. With a = -5, <code>(a &gt; 0)</code> is 0 and <code>(a &lt; 0)</code> is 1, so the switch value is 0 - 1 = -1 and <code>case -1</code> runs. Negative case labels are perfectly legal, so there is no error.</div><div class=\"ml-vi\">Biểu thức <code>(a &gt; 0) - (a &lt; 0)</code> là mẹo lấy \"dấu\" kinh điển: cho +1 với số dương, -1 với số âm và 0 với số không. Với a = -5, <code>(a &gt; 0)</code> bằng 0 và <code>(a &lt; 0)</code> bằng 1, nên giá trị switch là 0 - 1 = -1 và nhánh <code>case -1</code> chạy. Nhãn case âm hoàn toàn hợp lệ nên không có lỗi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Real-world example of a switch statement in C is:|||Ví dụ thực tế của câu lệnh switch trong C là:",
          "options": [
            {
              "text": "Check the day of the week.|||Kiểm tra thứ trong tuần."
            },
            {
              "text": "Sort an array ascending.|||Sắp xếp mảng tăng dần."
            },
            {
              "text": "Sort an array descending.|||Sắp xếp mảng giảm dần."
            },
            {
              "text": "Find the average value of a sequence.|||Tìm giá trị trung bình của một dãy."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A switch fits a variable that takes a small set of DISCRETE values — day 1…7, a menu choice, an operator character. Sorting and averaging are loop-and-compare algorithms with no fixed set of cases to branch on, so a switch is useless for them.</div><div class=\"ml-vi\">Switch hợp với biến nhận một tập nhỏ các giá trị RỜI RẠC — thứ 1…7, lựa chọn menu, ký tự toán tử. Sắp xếp và tính trung bình là thuật toán lặp-và-so-sánh, không có tập nhãn cố định để rẽ nhánh nên switch vô dụng với chúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output when the sample code below is executed?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int i,j,result=0;\n    for(i=3;i&lt;=5;i++){\n        for(j=5;j&gt;i;j--)\n        result+=j;\n    }\n    printf(&quot;%d&quot;,result);\n    return 0;\n}</code></pre>|||Đoạn mã sau chạy ra kết quả gì?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int i,j,result=0;\n    for(i=3;i&lt;=5;i++){\n        for(j=5;j&gt;i;j--)\n        result+=j;\n    }\n    printf(&quot;%d&quot;,result);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "14|||14"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "20|||20"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Trace the inner loop for each i. i = 3: j runs 5, 4 → adds 9. i = 4: j runs 5 only → adds 5. i = 5: the condition <code>j &gt; i</code> is false immediately → adds nothing. Total 9 + 5 + 0 = 14.</div><div class=\"ml-vi\">Lần theo vòng trong ứng với từng i. i = 3: j chạy 5, 4 → cộng 9. i = 4: j chỉ chạy 5 → cộng 5. i = 5: điều kiện <code>j &gt; i</code> sai ngay → không cộng gì. Tổng 9 + 5 + 0 = 14.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following program. What will be printed to the screen?<pre><code>#include&lt;stdio.h&gt;\n\nint main()\n{\n   char i, j;\n   for (i = &#x27;A&#x27;; i &lt;= &#x27;E&#x27;; i++)\n   {\n      for (j = &#x27;A&#x27;; j &lt;= i; j++)\n      {\n         printf(&quot;%c&quot;, i);\n      }\n      printf(&quot;\\n&quot;);\n   }\n   return 0;\n}</code></pre>|||Xét chương trình sau. Màn hình sẽ in ra gì?<pre><code>#include&lt;stdio.h&gt;\n\nint main()\n{\n   char i, j;\n   for (i = &#x27;A&#x27;; i &lt;= &#x27;E&#x27;; i++)\n   {\n      for (j = &#x27;A&#x27;; j &lt;= i; j++)\n      {\n         printf(&quot;%c&quot;, i);\n      }\n      printf(&quot;\\n&quot;);\n   }\n   return 0;\n}</code></pre>",
          "options": [
            {
              "text": "A<br>BB<br>CCC<br>DDDD<br>EEEEE|||A<br>BB<br>CCC<br>DDDD<br>EEEEE"
            },
            {
              "text": "AAAAA<br>BBBB<br>CCC<br>DD<br>E|||AAAAA<br>BBBB<br>CCC<br>DD<br>E"
            },
            {
              "text": "A<br>AB<br>ABC<br>ABCD<br>ABCDE|||A<br>AB<br>ABC<br>ABCD<br>ABCDE"
            },
            {
              "text": "A<br>AA<br>AAA<br>AAAA<br>AAAAA|||A<br>AA<br>AAA<br>AAAA<br>AAAAA"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Two things decide the answer. WHAT is printed: the inner printf prints <code>i</code>, not <code>j</code> — so every character on a row is the same letter (this rules out C). HOW MANY times: j runs from 'A' up to i, which is 1 time for 'A', 2 for 'B', … 5 for 'E' — the rows grow, not shrink (this rules out B and D). Result: A / BB / CCC / DDDD / EEEEE.</div><div class=\"ml-vi\">Hai điều quyết định đáp án. IN CÁI GÌ: printf bên trong in <code>i</code> chứ không phải <code>j</code> — nên mọi ký tự trên một dòng đều là cùng một chữ cái (loại C). IN BAO NHIÊU LẦN: j chạy từ 'A' tới i, tức 1 lần với 'A', 2 lần với 'B', … 5 lần với 'E' — các dòng DÀI DẦN chứ không ngắn dần (loại B và D). Kết quả: A / BB / CCC / DDDD / EEEEE.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What happens when you use a break statement inside a for loop?|||Điều gì xảy ra khi dùng câu lệnh break bên trong vòng for?",
          "options": [
            {
              "text": "The loop exits immediately.|||Vòng lặp thoát ngay lập tức."
            },
            {
              "text": "The loop continues with the next iteration and skips the remaining statements.|||Vòng lặp chạy tiếp lượt kế và bỏ qua các câu lệnh còn lại."
            },
            {
              "text": "The program terminates completely, and all variables are destroyed.|||Chương trình kết thúc hoàn toàn và mọi biến bị huỷ."
            },
            {
              "text": "Nothing happens; the break statement is completely ignored in for loops|||Không có gì xảy ra; break bị bỏ qua hoàn toàn trong vòng for"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>break</code> leaves the loop at once and execution resumes at the first statement after it. Option B describes <code>continue</code> — that is the pair students most often mix up — and option C describes <code>exit()</code> or <code>return</code> from main.</div><div class=\"ml-vi\"><code>break</code> thoát khỏi vòng lặp ngay lập tức và chương trình chạy tiếp từ câu lệnh ngay sau vòng lặp. Phương án B mô tả <code>continue</code> — cặp mà sinh viên hay nhầm nhất — còn phương án C mô tả <code>exit()</code> hoặc <code>return</code> từ main.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(Choose 1 answer) What will the code bellow print when executed?<pre><code>double a = -7.5, b = 7.5;\nprintf( &quot;%.0f : %.0f\\n&quot;, ceil( a ), ceil( b ) );\nprintf( &quot;%.0f : %.0f\\n&quot;, floor( a ), floor( b ) );</code></pre>|||(Chọn 1 đáp án) Đoạn mã sau in ra gì?<pre><code>double a = -7.5, b = 7.5;\nprintf( &quot;%.0f : %.0f\\n&quot;, ceil( a ), ceil( b ) );\nprintf( &quot;%.0f : %.0f\\n&quot;, floor( a ), floor( b ) );</code></pre>",
          "options": [
            {
              "text": "-7 : 8<br>-8 : 7|||-7 : 8<br>-8 : 7"
            },
            {
              "text": "-7 : 7<br>-8 : 8|||-7 : 7<br>-8 : 8"
            },
            {
              "text": "-8 : 7<br>-8 : 7|||-8 : 7<br>-8 : 7"
            },
            {
              "text": "-8 : 7<br>-7 : 8|||-8 : 7<br>-7 : 8"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>ceil</code> always rounds toward +∞ and <code>floor</code> always rounds toward -∞ — think \"up the number line\" and \"down the number line\", not \"away from zero\". So ceil(-7.5) = -7 (up), ceil(7.5) = 8; floor(-7.5) = -8 (down), floor(7.5) = 7. Line 1 is \"-7 : 8\" and line 2 is \"-8 : 7\". The negative value is where most people slip.</div><div class=\"ml-vi\"><code>ceil</code> luôn làm tròn về phía +∞ còn <code>floor</code> luôn làm tròn về phía -∞ — hãy nghĩ \"lên trục số\" và \"xuống trục số\", không phải \"ra xa số 0\". Vậy ceil(-7.5) = -7 (lên), ceil(7.5) = 8; floor(-7.5) = -8 (xuống), floor(7.5) = 7. Dòng 1 là \"-7 : 8\" và dòng 2 là \"-8 : 7\". Số âm là chỗ đa số bị nhầm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In module design, what does high \"cohesion\" mean?|||Trong thiết kế module, \"cohesion\" (độ gắn kết) CAO nghĩa là gì?",
          "options": [
            {
              "text": "A module performs a single, specific task.|||Một module thực hiện MỘT nhiệm vụ cụ thể duy nhất."
            },
            {
              "text": "A module performs multiple unrelated tasks.|||Một module thực hiện nhiều nhiệm vụ không liên quan."
            },
            {
              "text": "A module shares data with many other modules|||Một module chia sẻ dữ liệu với nhiều module khác"
            },
            {
              "text": "A module can be used in multiple programs.|||Một module có thể dùng trong nhiều chương trình."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Cohesion measures how focused a module is INTERNALLY: high cohesion = everything in it serves one purpose. Option B is exactly LOW cohesion. Option C describes high COUPLING (a separate metric — and one you want LOW), and option D describes reusability, which is a consequence of good design rather than the definition of cohesion.</div><div class=\"ml-vi\">Cohesion đo mức độ TẬP TRUNG bên trong một module: cohesion cao = mọi thứ trong module phục vụ một mục đích duy nhất. Phương án B chính là cohesion THẤP. Phương án C mô tả COUPLING cao (một chỉ số khác — và là thứ bạn muốn THẤP), còn phương án D nói về khả năng tái sử dụng, vốn là hệ quả của thiết kế tốt chứ không phải định nghĩa của cohesion.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The function which will return the average of two real numbers should be prototyped as:|||Hàm trả về giá trị trung bình của hai số thực nên được khai báo nguyên mẫu như thế nào?",
          "options": [
            {
              "text": "<code>int average( double, double);</code>|||<code>int average( double, double);</code>"
            },
            {
              "text": "<code>double average( double, double);</code>|||<code>double average( double, double);</code>"
            },
            {
              "text": "<code>char average( double, double);</code>|||<code>char average( double, double);</code>"
            },
            {
              "text": "<code>void average( double, double);</code>|||<code>void average( double, double);</code>"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The average of two real numbers is itself a real number, so the RETURN type must be floating-point — <code>double</code>. <code>int</code> and <code>char</code> would truncate the fractional part (the average of 1.0 and 2.0 would come back as 1 instead of 1.5), and <code>void</code> returns nothing at all.</div><div class=\"ml-vi\">Trung bình của hai số thực cũng là một số thực nên kiểu TRẢ VỀ phải là số thực — <code>double</code>. <code>int</code> và <code>char</code> sẽ cắt mất phần thập phân (trung bình của 1.0 và 2.0 sẽ trả về 1 thay vì 1.5), còn <code>void</code> thì không trả về gì cả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following C code?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int *ptr, a = 10;\n    ptr = &amp;a;\n    *ptr += 1;\n    printf(&quot;%d,%d\\n&quot;, *ptr, a);\n}</code></pre>|||Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nvoid main()\n{\n    int *ptr, a = 10;\n    ptr = &amp;a;\n    *ptr += 1;\n    printf(&quot;%d,%d\\n&quot;, *ptr, a);\n}</code></pre>",
          "options": [
            {
              "text": "10,10|||10,10"
            },
            {
              "text": "10,11|||10,11"
            },
            {
              "text": "11,10|||11,10"
            },
            {
              "text": "11,11|||11,11"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">After <code>ptr = &amp;a</code>, the expressions <code>*ptr</code> and <code>a</code> name the SAME memory cell. <code>*ptr += 1</code> raises that cell from 10 to 11, so both printed values are 11 — they can never disagree, which immediately rules out options B and C.</div><div class=\"ml-vi\">Sau <code>ptr = &amp;a</code>, hai biểu thức <code>*ptr</code> và <code>a</code> chỉ CÙNG một ô nhớ. <code>*ptr += 1</code> nâng ô đó từ 10 lên 11, nên hai giá trị in ra đều là 11 — chúng không thể khác nhau, điều này loại ngay phương án B và C.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of the following code snippet?<pre><code>#include &lt;stdio.h&gt;\nint num(int a, int b){\n    int sum;\n    sum = a + b;\n    return sum;\n}\n\nint main()\n{\n    int a, b, result;\n    a = 10;\n    b= 12;\n    result = num(a, b);\n    printf(&quot;%d&quot;, result);\n    return 0;\n}</code></pre>|||Đoạn mã sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint num(int a, int b){\n    int sum;\n    sum = a + b;\n    return sum;\n}\n\nint main()\n{\n    int a, b, result;\n    a = 10;\n    b= 12;\n    result = num(a, b);\n    printf(&quot;%d&quot;, result);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "22|||22"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "21|||21"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A straightforward call: <code>num(10, 12)</code> computes 10 + 12 = 22 and returns it into <code>result</code>. Note the parameters inside num are LOCAL copies that happen to share the names a and b with main's variables — that shadowing changes nothing here.</div><div class=\"ml-vi\">Một lời gọi đơn giản: <code>num(10, 12)</code> tính 10 + 12 = 22 rồi trả về cho <code>result</code>. Lưu ý các tham số bên trong num là bản sao CỤC BỘ tình cờ trùng tên a, b với biến của main — việc trùng tên này không ảnh hưởng gì ở đây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the returned type of the sqrt() function from the math.h library in C?|||Hàm sqrt() trong thư viện math.h của C trả về kiểu gì?",
          "options": [
            {
              "text": "double|||double"
            },
            {
              "text": "float|||float"
            },
            {
              "text": "int|||int"
            },
            {
              "text": "long|||long"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">All the standard math.h functions (sqrt, pow, sin, log, …) take and return <code>double</code> for maximum precision. The <code>float</code> variants exist but have an f suffix — <code>sqrtf()</code> — and the <code>long double</code> ones end in l.</div><div class=\"ml-vi\">Mọi hàm chuẩn của math.h (sqrt, pow, sin, log, …) đều nhận và trả về <code>double</code> để có độ chính xác cao nhất. Bản dùng <code>float</code> vẫn tồn tại nhưng có hậu tố f — <code>sqrtf()</code> — còn bản <code>long double</code> kết thúc bằng l.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The function islower() returns a non-zero value if a character is:|||Hàm islower() trả về giá trị khác 0 nếu ký tự là:",
          "options": [
            {
              "text": "A lowercase letter|||Chữ cái viết thường"
            },
            {
              "text": "An uppercase letter|||Chữ cái viết hoa"
            },
            {
              "text": "A digit|||Chữ số"
            },
            {
              "text": "A punctuation character|||Ký tự dấu câu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The ctype.h family is named after what it tests: <code>islower</code> → lowercase, <code>isupper</code> → uppercase, <code>isdigit</code> → digit, <code>ispunct</code> → punctuation. They return non-zero (true) on a match and 0 otherwise.</div><div class=\"ml-vi\">Họ hàm trong ctype.h được đặt tên theo đúng thứ chúng kiểm tra: <code>islower</code> → chữ thường, <code>isupper</code> → chữ hoa, <code>isdigit</code> → chữ số, <code>ispunct</code> → dấu câu. Chúng trả về khác 0 (đúng) khi khớp và 0 khi không.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which library function returns a pseudo-random number in the range 0 to RAND_MAX?|||Hàm thư viện nào trả về một số giả ngẫu nhiên trong khoảng 0 đến RAND_MAX?",
          "options": [
            {
              "text": "random()|||random()"
            },
            {
              "text": "rand()|||rand()"
            },
            {
              "text": "generate_random()|||generate_random()"
            },
            {
              "text": "getrand()|||getrand()"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>rand()</code> from <code>stdlib.h</code> is the standard C generator; it returns an int between 0 and <code>RAND_MAX</code>. Pair it with <code>srand(time(NULL))</code> to get a different sequence per run. <code>random()</code> is a POSIX extension, not standard C, and the other two do not exist.</div><div class=\"ml-vi\"><code>rand()</code> trong <code>stdlib.h</code> là bộ sinh số chuẩn của C; nó trả về một số nguyên từ 0 đến <code>RAND_MAX</code>. Dùng kèm <code>srand(time(NULL))</code> để mỗi lần chạy cho dãy khác nhau. <code>random()</code> là phần mở rộng POSIX chứ không thuộc C chuẩn, còn hai hàm kia không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is true about the isdigit() function in ctype.h?|||Phát biểu nào ĐÚNG về hàm isdigit() trong ctype.h?",
          "options": [
            {
              "text": "It checks if a character is an alphabet.|||Nó kiểm tra ký tự có phải chữ cái không."
            },
            {
              "text": "It returns to a non-zero value if the character is a digit (0-9).|||Nó trả về giá trị khác 0 nếu ký tự là chữ số (0-9)."
            },
            {
              "text": "It only works with float inputs.|||Nó chỉ làm việc với dữ liệu vào kiểu float."
            },
            {
              "text": "It converts a digit to integer.|||Nó chuyển một chữ số thành số nguyên."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>isdigit(c)</code> tests only whether the CHARACTER c is one of '0'…'9' and returns non-zero if so. Checking for a letter is <code>isalpha</code> (option A); converting a digit character to its numeric value is done with <code>c - &#x27;0&#x27;</code> or <code>atoi</code> (option D).</div><div class=\"ml-vi\"><code>isdigit(c)</code> chỉ kiểm tra xem KÝ TỰ c có nằm trong '0'…'9' hay không và trả về khác 0 nếu đúng. Kiểm tra chữ cái là việc của <code>isalpha</code> (phương án A); chuyển ký tự số thành giá trị số dùng <code>c - &#x27;0&#x27;</code> hoặc <code>atoi</code> (phương án D).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(Choose 1 answer) What is the output of this C code?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;conio.h&gt;\nint main() {\n    int n = 267, *pn = &amp;n;\n    char* pc = pn;\n    *pc = 0;\n    printf(&quot;n = %d&quot;, n);\n    return 0;\n}</code></pre>|||(Chọn 1 đáp án) Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\n#include &lt;conio.h&gt;\nint main() {\n    int n = 267, *pn = &amp;n;\n    char* pc = pn;\n    *pc = 0;\n    printf(&quot;n = %d&quot;, n);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "n = 0|||n = 0"
            },
            {
              "text": "n = 267|||n = 267"
            },
            {
              "text": "n = 256|||n = 256"
            },
            {
              "text": "error|||error"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">267 in hex is 0x0000010B, i.e. the byte pattern 0B 01 00 00 on a little-endian machine. <code>pc</code> is a <code>char*</code> aimed at the same address, so <code>*pc = 0</code> zeroes only the LOWEST byte (0x0B), leaving 0x00000100 = 256. Writing through a char pointer touches one byte, not the whole int — that is why the answer is not 0. Verified by compiling and running this code.</div><div class=\"ml-vi\">267 ở hệ 16 là 0x0000010B, tức chuỗi byte 0B 01 00 00 trên máy little-endian. <code>pc</code> là <code>char*</code> trỏ vào cùng địa chỉ nên <code>*pc = 0</code> chỉ xoá byte THẤP NHẤT (0x0B), còn lại 0x00000100 = 256. Ghi qua con trỏ char chỉ tác động MỘT byte chứ không phải cả số int — vì thế đáp án không phải 0. Đã biên dịch và chạy thử để kiểm chứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following code:<pre><code>int func(int* a, int n){\n    int S = 0;\n    for(int i = 0; i &lt; n; i++) {\n        S = S + (a[i] % 2)*a[i];\n    }\n    return S;\n}</code></pre>What does the above code snippet do?|||Xét đoạn mã sau:<pre><code>int func(int* a, int n){\n    int S = 0;\n    for(int i = 0; i &lt; n; i++) {\n        S = S + (a[i] % 2)*a[i];\n    }\n    return S;\n}</code></pre>Đoạn mã trên làm gì?",
          "options": [
            {
              "text": "Calculates the sum of the absolute value of all odd elements in the array a of size n.|||Tính tổng TRỊ TUYỆT ĐỐI của tất cả phần tử LẺ trong mảng a kích thước n."
            },
            {
              "text": "Calculates the sum of all odd elements in the array a of size n.|||Tính tổng tất cả phần tử lẻ trong mảng a kích thước n."
            },
            {
              "text": "Calculates the sum of all even elements in the array a of size n.|||Tính tổng tất cả phần tử chẵn trong mảng a kích thước n."
            },
            {
              "text": "Calculates the sum of squares of all elements in the array a of size n.|||Tính tổng bình phương tất cả phần tử trong mảng a kích thước n."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For an even element <code>a[i] % 2</code> is 0, so it contributes nothing — the sum is over odd elements only (this rules out C and D). The subtlety is the sign: in C the remainder takes the sign of the dividend, so a NEGATIVE odd number gives <code>a[i] % 2 == -1</code> and the term becomes <code>(-1) * a[i]</code> = |a[i]|. Every odd element is therefore added as its absolute value — answer A, not B. Verified by running it on {3, -5, 4, 7}, which returns 15 = 3 + 5 + 7.</div><div class=\"ml-vi\">Với phần tử chẵn thì <code>a[i] % 2</code> bằng 0 nên không đóng góp gì — tổng chỉ tính trên phần tử lẻ (loại C và D). Điểm tinh tế nằm ở DẤU: trong C, phần dư mang dấu của số bị chia, nên số lẻ ÂM cho <code>a[i] % 2 == -1</code> và số hạng thành <code>(-1) * a[i]</code> = |a[i]|. Vì vậy mọi phần tử lẻ được cộng vào dưới dạng trị tuyệt đối — đáp án A chứ không phải B. Đã chạy thử với {3, -5, 4, 7}, kết quả 15 = 3 + 5 + 7.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the expression <code>sizeof(arr) / sizeof(arr[0])</code> evaluate to, where arr is an array?|||Biểu thức <code>sizeof(arr) / sizeof(arr[0])</code> cho ra giá trị gì, với arr là một mảng?",
          "options": [
            {
              "text": "The number of elements in arr|||Số phần tử của mảng arr"
            },
            {
              "text": "The size of arr in bytes|||Kích thước của arr tính bằng byte"
            },
            {
              "text": "The number of bytes occupied by each element in arr|||Số byte mà mỗi phần tử của arr chiếm"
            },
            {
              "text": "The total size of arr in bytes|||Tổng kích thước của arr tính bằng byte"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Total bytes ÷ bytes per element = number of elements. For <code>int arr[10]</code> that is 40 / 4 = 10. This is the standard C idiom for array length. ⚠️ It only works where the real array is visible — inside a function that received <code>int arr[]</code> the parameter has decayed to a pointer and the trick silently gives the wrong answer.</div><div class=\"ml-vi\">Tổng số byte ÷ số byte mỗi phần tử = số phần tử. Với <code>int arr[10]</code> thì đó là 40 / 4 = 10. Đây là cách viết chuẩn để lấy độ dài mảng trong C. ⚠️ Nó chỉ đúng ở nơi nhìn thấy mảng thật — bên trong một hàm nhận <code>int arr[]</code> thì tham số đã suy biến thành con trỏ và mẹo này âm thầm cho kết quả sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following C code?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int a,b,c;\n    a = b = c = 10;\n    c = a++ || ++b &amp;&amp; ++c;\n    printf(&quot;%d %d %d&quot;,c, a, b);\n    return 0;\n}</code></pre>|||Đoạn mã C sau in ra gì?<pre><code>#include &lt;stdio.h&gt;\nint main()\n{\n    int a,b,c;\n    a = b = c = 10;\n    c = a++ || ++b &amp;&amp; ++c;\n    printf(&quot;%d %d %d&quot;,c, a, b);\n    return 0;\n}</code></pre>",
          "options": [
            {
              "text": "1 11 10|||1 11 10"
            },
            {
              "text": "10 11 1|||10 11 1"
            },
            {
              "text": "10 11 10|||10 11 10"
            },
            {
              "text": "1 1 10|||1 1 10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>&amp;&amp;</code> binds tighter than <code>||</code>, so the expression is <code>a++ || (++b &amp;&amp; ++c)</code>. <code>a++</code> yields the old value 10, which is TRUE, so <code>||</code> SHORT-CIRCUITS: the whole right-hand side is never evaluated and <code>++b</code> never runs — b stays 10. A logical expression evaluates to 1, so c = 1, while a was still incremented to 11. Output \"1 11 10\". (Verified by running the code.)</div><div class=\"ml-vi\"><code>&amp;&amp;</code> ưu tiên cao hơn <code>||</code> nên biểu thức là <code>a++ || (++b &amp;&amp; ++c)</code>. <code>a++</code> cho giá trị cũ là 10, tức ĐÚNG, nên <code>||</code> NGẮN MẠCH: toàn bộ vế phải không được tính và <code>++b</code> không hề chạy — b vẫn là 10. Biểu thức logic có giá trị 1 nên c = 1, còn a vẫn được tăng thành 11. Kết quả \"1 11 10\". (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the C program?<pre><code>int arr[5] = { 2, 3, 5, 4, 7 };\nint *ptr = (&amp;arr + 1);\nprintf(&quot;%d %d\\n&quot;, *(arr + 1), *(ptr - 1));</code></pre>|||Chương trình C sau in ra gì?<pre><code>int arr[5] = { 2, 3, 5, 4, 7 };\nint *ptr = (&amp;arr + 1);\nprintf(&quot;%d %d\\n&quot;, *(arr + 1), *(ptr - 1));</code></pre>",
          "options": [
            {
              "text": "2 3|||2 3"
            },
            {
              "text": "3 2|||3 2"
            },
            {
              "text": "3 7|||3 7"
            },
            {
              "text": "2 6356728|||2 6356728"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Two different pointer types are at play. <code>arr</code> decays to <code>int*</code>, so <code>*(arr + 1)</code> is simply arr[1] = 3. But <code>&amp;arr</code> has type <code>int (*)[5]</code> — a pointer to the WHOLE array — so <code>&amp;arr + 1</code> jumps 5 ints forward, one past the end. Stored in an <code>int*</code>, <code>ptr - 1</code> then steps back one int to the LAST element, arr[4] = 7. Output \"3 7\". (Verified by running the code.)</div><div class=\"ml-vi\">Có hai kiểu con trỏ khác nhau ở đây. <code>arr</code> suy biến thành <code>int*</code> nên <code>*(arr + 1)</code> chỉ là arr[1] = 3. Nhưng <code>&amp;arr</code> có kiểu <code>int (*)[5]</code> — con trỏ tới TOÀN BỘ mảng — nên <code>&amp;arr + 1</code> nhảy qua 5 phần tử int, tới ngay sau phần tử cuối. Khi lưu vào <code>int*</code>, phép <code>ptr - 1</code> lùi lại một int về phần tử CUỐI, arr[4] = 7. Kết quả \"3 7\". (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why is an array considered an efficient data structure for index-based element access?|||Vì sao mảng được coi là cấu trúc dữ liệu hiệu quả cho việc truy cập phần tử theo chỉ số?",
          "options": [
            {
              "text": "Because arrays allow fast insertion/deletion of elements|||Vì mảng cho phép chèn/xoá phần tử nhanh"
            },
            {
              "text": "Because elements in an array are allocated in scattered memory locations|||Vì các phần tử của mảng nằm rải rác trong bộ nhớ"
            },
            {
              "text": "Because elements can be accessed directly by unique index|||Vì có thể truy cập trực tiếp từng phần tử bằng chỉ số duy nhất"
            },
            {
              "text": "Because arrays automatically expand in size when new elements are added|||Vì mảng tự động mở rộng kích thước khi thêm phần tử mới"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Elements are stored CONTIGUOUSLY and are all the same size, so the machine computes the address of <code>a[i]</code> as base + i × size and reaches it in one step — O(1), no scanning. Option B states the opposite of contiguous storage; A is false (inserting in the middle means shifting everything after it); D is false for plain C arrays, whose size is fixed.</div><div class=\"ml-vi\">Các phần tử được lưu LIỀN KỀ và cùng kích thước nên máy tính địa chỉ của <code>a[i]</code> bằng địa_chỉ_đầu + i × kích_thước và tới đó trong một bước — O(1), không phải duyệt. Phương án B nói ngược với việc lưu liền kề; A sai (chèn vào giữa phải dịch toàn bộ phần sau); D sai với mảng C thường vì kích thước là cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What will be the output of the following program?<pre><code>int main()\n{\n        int i = 101;\n        int *p = &amp;i;\n        printf(&quot;%d\\n&quot;, *p++);\n        return 0;\n}</code></pre>|||Chương trình sau in ra gì?<pre><code>int main()\n{\n        int i = 101;\n        int *p = &amp;i;\n        printf(&quot;%d\\n&quot;, *p++);\n        return 0;\n}</code></pre>",
          "options": [
            {
              "text": "101|||101"
            },
            {
              "text": "102|||102"
            },
            {
              "text": "0|||0"
            },
            {
              "text": "Address of i|||Địa chỉ của i"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In <code>*p++</code> the post-increment binds to the POINTER, not to what it points at, and it happens AFTER the value is taken. So printf receives <code>*p</code> = 101; only then does p move on (to memory nobody reads). To print 102 you would need <code>++(*p)</code>, and to print the address you would need <code>p</code> with <code>%p</code>. (Verified by running the code.)</div><div class=\"ml-vi\">Trong <code>*p++</code>, phép tăng sau gắn với CON TRỎ chứ không phải giá trị nó trỏ tới, và nó xảy ra SAU khi giá trị đã được lấy. Vì vậy printf nhận <code>*p</code> = 101; chỉ sau đó p mới dịch đi (tới vùng nhớ chẳng ai đọc). Muốn in 102 phải viết <code>++(*p)</code>, còn muốn in địa chỉ phải dùng <code>p</code> với <code>%p</code>. (Đã chạy thử kiểm chứng.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which sorting algorithm repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order?|||Thuật toán sắp xếp nào lặp đi lặp lại việc duyệt danh sách, so sánh các phần tử KỀ NHAU và hoán đổi nếu sai thứ tự?",
          "options": [
            {
              "text": "Bubble sort|||Bubble sort (sắp xếp nổi bọt)"
            },
            {
              "text": "Selection sort|||Selection sort (sắp xếp chọn)"
            },
            {
              "text": "Binary sort|||Binary sort"
            },
            {
              "text": "None of the others|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The description — compare ADJACENT pairs and swap — is exactly bubble sort; large values \"bubble\" to the end pass after pass. Selection sort instead scans for the minimum of the remaining part and puts it in place with one swap per pass, and \"binary sort\" is not a standard sorting algorithm (binary SEARCH is a search, not a sort).</div><div class=\"ml-vi\">Mô tả — so sánh các cặp KỀ NHAU và hoán đổi — chính là bubble sort; các giá trị lớn \"nổi\" dần về cuối sau mỗi lượt. Selection sort thì tìm phần tử nhỏ nhất của phần còn lại rồi đặt đúng chỗ với một lần hoán đổi mỗi lượt, còn \"binary sort\" không phải thuật toán sắp xếp chuẩn (binary SEARCH là tìm kiếm chứ không phải sắp xếp).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which function in C is used to deallocate dynamically allocated memory?|||Hàm nào trong C dùng để GIẢI PHÓNG vùng nhớ đã cấp phát động?",
          "options": [
            {
              "text": "free()|||free()"
            },
            {
              "text": "malloc()|||malloc()"
            },
            {
              "text": "calloc()|||calloc()"
            },
            {
              "text": "realloc()|||realloc()"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>free(p)</code> returns the block to the heap. <code>malloc</code> and <code>calloc</code> ALLOCATE (calloc also zeroes the memory) and <code>realloc</code> resizes an existing block. Every malloc/calloc should be matched by exactly one free, or the program leaks memory.</div><div class=\"ml-vi\"><code>free(p)</code> trả khối nhớ về heap. <code>malloc</code> và <code>calloc</code> để CẤP PHÁT (calloc còn xoá vùng nhớ về 0), còn <code>realloc</code> thay đổi kích thước khối đã có. Mỗi lần malloc/calloc phải có đúng một lần free tương ứng, nếu không chương trình bị rò rỉ bộ nhớ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the purpose of \"rb\" in fopen() function used below in the code?<pre><code>FILE *fp;\nfp = fopen(&quot;demo.txt&quot;, &quot;rb&quot;);</code></pre>|||Chuỗi \"rb\" trong hàm fopen() dưới đây có tác dụng gì?<pre><code>FILE *fp;\nfp = fopen(&quot;demo.txt&quot;, &quot;rb&quot;);</code></pre>",
          "options": [
            {
              "text": "Open \"demo.txt\" in binary mode for reading|||Mở \"demo.txt\" ở chế độ nhị phân để ĐỌC"
            },
            {
              "text": "Create a new file \"demo.txt\" for reading and writing|||Tạo tệp mới \"demo.txt\" để đọc và ghi"
            },
            {
              "text": "Open \"demo.txt\" in binary mode for reading and writing|||Mở \"demo.txt\" ở chế độ nhị phân để đọc và ghi"
            },
            {
              "text": "None of these|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Read the mode string letter by letter: <code>r</code> = open for reading (and the file must already exist), <code>b</code> = binary mode, meaning no newline translation. Reading AND writing would require a <code>+</code> — <code>&quot;r+b&quot;</code> — which is why option C is wrong, and only <code>w</code> or <code>a</code> would create the file, which rules out B.</div><div class=\"ml-vi\">Đọc chuỗi chế độ từng chữ: <code>r</code> = mở để ĐỌC (và tệp phải đã tồn tại), <code>b</code> = chế độ nhị phân, tức không chuyển đổi ký tự xuống dòng. Muốn vừa đọc vừa ghi phải có dấu <code>+</code> — <code>&quot;r+b&quot;</code> — nên phương án C sai; và chỉ <code>w</code> hoặc <code>a</code> mới tạo tệp mới nên loại B.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How can you initialize a character array in C?|||Cách nào ĐÚNG để khởi tạo một mảng ký tự trong C?",
          "options": [
            {
              "text": "<code>char arr[] = &quot;Hello&quot;;</code>|||<code>char arr[] = &quot;Hello&quot;;</code>"
            },
            {
              "text": "<code>char arr[] = [&#x27;H&#x27;, &#x27;e&#x27;, &#x27;l&#x27;, &#x27;l&#x27;, &#x27;o&#x27;, &#x27;/e&#x27;];</code>|||<code>char arr[] = [&#x27;H&#x27;, &#x27;e&#x27;, &#x27;l&#x27;, &#x27;l&#x27;, &#x27;o&#x27;, &#x27;/e&#x27;];</code>"
            },
            {
              "text": "<code>Char[] arr = &quot;Hello&quot;;</code>|||<code>Char[] arr = &quot;Hello&quot;;</code>"
            },
            {
              "text": "<code>Char[] arr = {&#x27;H&#x27;, &#x27;e&#x27;, &#x27;l&#x27;, &#x27;l&#x27;, &#x27;o&#x27;, &#x27;/0&#x27;};</code>|||<code>Char[] arr = {&#x27;H&#x27;, &#x27;e&#x27;, &#x27;l&#x27;, &#x27;l&#x27;, &#x27;o&#x27;, &#x27;/0&#x27;};</code>"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Only option A is valid C. The string literal initialises the array and the compiler appends <code>&#x27;\\0&#x27;</code> automatically, sizing arr to 6. The others each break a rule: B uses square brackets instead of braces for an initialiser list (and writes <code>/e</code> instead of <code>\\0</code>); C and D use <code>Char[]</code> — capital C and Java-style brackets, neither of which exists in C.</div><div class=\"ml-vi\">Chỉ phương án A là C hợp lệ. Hằng chuỗi khởi tạo mảng và trình biên dịch tự thêm <code>&#x27;\\0&#x27;</code>, nên arr có kích thước 6. Ba phương án còn lại đều sai luật: B dùng ngoặc vuông thay vì ngoặc nhọn cho danh sách khởi tạo (và viết <code>/e</code> thay vì <code>\\0</code>); C và D dùng <code>Char[]</code> — chữ C hoa và cú pháp ngoặc kiểu Java, cả hai đều không tồn tại trong C.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main difference between opening a file with mode \"a+\" and mode \"w+\" in C?|||Khác biệt CHÍNH giữa mở tệp bằng chế độ \"a+\" và \"w+\" trong C là gì?",
          "options": [
            {
              "text": "\"w+\" truncates existing files, \"a+\" preserves them.|||\"w+\" XOÁ SẠCH nội dung tệp đang có, còn \"a+\" GIỮ NGUYÊN."
            },
            {
              "text": "\"a+\" can only append data, while \"w+\" can only write from the beginning.|||\"a+\" chỉ ghi thêm được, còn \"w+\" chỉ ghi được từ đầu tệp."
            },
            {
              "text": "\"a+\" opens binary files, while \"w+\" opens text files.|||\"a+\" mở tệp nhị phân, còn \"w+\" mở tệp văn bản."
            },
            {
              "text": "\"a+\" allows reading only, while \"w+\" allows both reading and writing.|||\"a+\" chỉ cho đọc, còn \"w+\" cho cả đọc lẫn ghi."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Both modes create the file if it is missing and both allow reading and writing (that is what the <code>+</code> means, which rules out B and D). The decisive difference is what happens to EXISTING content: <code>&quot;w+&quot;</code> truncates the file to zero length, while <code>&quot;a+&quot;</code> keeps it and writes at the end. Neither mode has anything to do with binary vs text — that is the separate <code>b</code> flag, so C is wrong too.</div><div class=\"ml-vi\">Cả hai chế độ đều tạo tệp nếu chưa có và đều cho phép vừa đọc vừa ghi (đó là ý nghĩa của dấu <code>+</code>, nên loại B và D). Khác biệt quyết định nằm ở nội dung ĐANG CÓ: <code>&quot;w+&quot;</code> cắt tệp về rỗng, còn <code>&quot;a+&quot;</code> giữ nguyên và ghi thêm vào cuối. Không chế độ nào liên quan đến nhị phân hay văn bản — đó là cờ <code>b</code> riêng biệt, nên C cũng sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What function is used to send formatted output to a file?|||Hàm nào dùng để gửi dữ liệu xuất CÓ ĐỊNH DẠNG ra tệp?",
          "options": [
            {
              "text": "fprintf|||fprintf"
            },
            {
              "text": "fwritef|||fwritef"
            },
            {
              "text": "fsendf|||fsendf"
            },
            {
              "text": "fputs|||fputs"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>fprintf(fp, &quot;%d %s\\n&quot;, n, name)</code> is printf with a FILE* as its first argument — same format specifiers, different destination. <code>fputs</code> writes a plain string with no formatting, and the other two names do not exist.</div><div class=\"ml-vi\"><code>fprintf(fp, &quot;%d %s\\n&quot;, n, name)</code> chính là printf với tham số đầu là FILE* — cùng các đặc tả định dạng, chỉ khác nơi ghi ra. <code>fputs</code> ghi một chuỗi thuần không định dạng, còn hai tên kia không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the following code snippet that writes text to a file named \"output.txt\":<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    FILE *file_ptr;\n    file_ptr = fopen(&quot;output.txt&quot;, &quot;w&quot;);\n    if (file_ptr == NULL) {\n        printf(&quot;Unable to open the file.\\n&quot;);\n        return 1;\n    }\n    fprintf(file_ptr, &quot;Hello, World!\\nThis is a test.&quot;);\n    fclose(file_ptr);\n    return 0;\n}</code></pre>Assuming the code is executed successfully, what will be the content of the \"output.txt\" file?|||Xét đoạn mã sau ghi văn bản vào tệp tên \"output.txt\":<pre><code>#include &lt;stdio.h&gt;\nint main() {\n    FILE *file_ptr;\n    file_ptr = fopen(&quot;output.txt&quot;, &quot;w&quot;);\n    if (file_ptr == NULL) {\n        printf(&quot;Unable to open the file.\\n&quot;);\n        return 1;\n    }\n    fprintf(file_ptr, &quot;Hello, World!\\nThis is a test.&quot;);\n    fclose(file_ptr);\n    return 0;\n}</code></pre>Giả sử mã chạy thành công, nội dung của tệp \"output.txt\" sẽ là gì?",
          "options": [
            {
              "text": "Hello, World!<br>This is a test.|||Hello, World!<br>This is a test."
            },
            {
              "text": "Hello, World! This is a test.|||Hello, World! This is a test."
            },
            {
              "text": "Hello, World!|||Hello, World!"
            },
            {
              "text": "This is a test.|||This is a test."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">One <code>fprintf</code> writes the WHOLE string, so both sentences land in the file (ruling out C and D). The <code>\\n</code> in the middle is a real newline character, not a space, so the second sentence starts on line 2 — that is the difference between options A and B.</div><div class=\"ml-vi\">Một lệnh <code>fprintf</code> ghi TOÀN BỘ chuỗi nên cả hai câu đều vào tệp (loại C và D). Ký tự <code>\\n</code> ở giữa là ký tự xuống dòng thật chứ không phải dấu cách, nên câu thứ hai bắt đầu ở dòng 2 — đó chính là khác biệt giữa phương án A và B.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What function is used to write data in binary format to a file?|||Hàm nào dùng để ghi dữ liệu ở dạng NHỊ PHÂN vào tệp?",
          "options": [
            {
              "text": "fprintf()|||fprintf()"
            },
            {
              "text": "fwrite()|||fwrite()"
            },
            {
              "text": "fputc()|||fputc()"
            },
            {
              "text": "fprintb()|||fprintb()"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><code>fwrite(ptr, size, count, fp)</code> copies raw bytes straight from memory to the file — no conversion to text. <code>fprintf</code> writes formatted TEXT (the number 300 becomes the three characters \"300\"), <code>fputc</code> writes a single character, and <code>fprintb</code> does not exist.</div><div class=\"ml-vi\"><code>fwrite(ptr, size, count, fp)</code> chép nguyên các byte thô từ bộ nhớ ra tệp — không chuyển đổi sang văn bản. <code>fprintf</code> ghi VĂN BẢN có định dạng (số 300 thành ba ký tự \"300\"), <code>fputc</code> ghi một ký tự, còn <code>fprintb</code> không tồn tại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the rewind () function used for?|||Hàm rewind() dùng để làm gì?",
          "options": [
            {
              "text": "To reset the file pointer to the beginning of the file.|||Đưa con trỏ tệp về ĐẦU tệp."
            },
            {
              "text": "To read the entire file into memory.|||Đọc toàn bộ tệp vào bộ nhớ."
            },
            {
              "text": "To close the file.|||Đóng tệp."
            },
            {
              "text": "To move the file pointer to the end of the file.|||Đưa con trỏ tệp về CUỐI tệp."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><code>rewind(fp)</code> is equivalent to <code>fseek(fp, 0, SEEK_SET)</code> — it puts the read/write position back at byte 0 so you can traverse the file again. Moving to the END would be <code>fseek(fp, 0, SEEK_END)</code>, and closing is <code>fclose</code>.</div><div class=\"ml-vi\"><code>rewind(fp)</code> tương đương <code>fseek(fp, 0, SEEK_SET)</code> — đưa vị trí đọc/ghi về byte 0 để bạn duyệt lại tệp từ đầu. Muốn về CUỐI tệp phải dùng <code>fseek(fp, 0, SEEK_END)</code>, còn đóng tệp là <code>fclose</code>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the purpose of this function?<pre><code>void get_a_line(char line[], int max) {\n    int n = 0;\n    char c;\n    while (&#x27;\\n&#x27; != (c = getchar()))\n        if (n &lt; max)\n            line[n++] = c;\n    line[n] = &#x27;\\0&#x27;;\n}</code></pre>|||Hàm sau dùng để làm gì?<pre><code>void get_a_line(char line[], int max) {\n    int n = 0;\n    char c;\n    while (&#x27;\\n&#x27; != (c = getchar()))\n        if (n &lt; max)\n            line[n++] = c;\n    line[n] = &#x27;\\0&#x27;;\n}</code></pre>",
          "options": [
            {
              "text": "Reads a line of input safely|||Đọc một dòng nhập vào một cách AN TOÀN"
            },
            {
              "text": "Writes a string to file|||Ghi một chuỗi ra tệp"
            },
            {
              "text": "Compares strings|||So sánh chuỗi"
            },
            {
              "text": "Reverses string|||Đảo ngược chuỗi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The loop reads characters with <code>getchar()</code> until it meets a newline, and <code>line[n] = &#x27;\\0&#x27;</code> terminates the result — so it reads one line. The word \"safely\" comes from the guard <code>if (n &lt; max)</code>: once the buffer is full, extra characters are consumed but NOT stored, so <code>line</code> can never overflow. That is exactly what the unsafe <code>gets()</code> fails to do.</div><div class=\"ml-vi\">Vòng lặp đọc từng ký tự bằng <code>getchar()</code> cho tới khi gặp ký tự xuống dòng, rồi <code>line[n] = &#x27;\\0&#x27;</code> kết thúc chuỗi — tức là nó đọc một DÒNG. Chữ \"an toàn\" đến từ điều kiện bảo vệ <code>if (n &lt; max)</code>: khi bộ đệm đã đầy, các ký tự thừa vẫn được đọc hết nhưng KHÔNG được lưu, nên <code>line</code> không bao giờ bị tràn. Đó chính là điều mà hàm <code>gets()</code> không an toàn đã không làm được.</div>"
        }
      ]
    }
  ]
};
