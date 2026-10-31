// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-CSI106-TS-FE3.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "CSI106"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE3",
      "title": "CSI106 — Practice Final 3 (self-composed)|||CSI106 — Đề luyện cuối kỳ 3 (tự soạn theo dạng đề)",
      "description": "Practice final written from the course content, following the usual exam format. Source: tự soạn theo dạng đề.|||Đề luyện viết mới từ nội dung môn học, theo đúng dạng đề thường gặp. Nguồn: tự soạn theo dạng đề.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "source": "SAMPLE",
      "shuffleQuestions": false,
      "shuffleOptions": false,
      "instructions": "<div class=\"ml-en\"><p>This is a <b>practice final</b> for <b>Introduction to Computer Science</b>, <b>self-composed</b> from the course content following the usual exam format (60 questions, 60 minutes). It is not an official exam paper. Every question is <b>multiple choice</b> and auto-graded.</p><ul><li>Read code, tables and diagrams carefully; several questions turn on a subtle detail.</li></ul><p>You can flag a question and come back. The timer auto-submits at the end. After you submit, every question explains each option in both languages.</p></div><div class=\"ml-vi\"><p>Đây là <b>đề luyện cuối kỳ</b> môn <b>Nhập môn Khoa học Máy tính</b>, <b>tự soạn theo dạng đề</b> từ nội dung môn học (60 câu, 60 phút). Đây không phải đề thi chính thức. Mọi câu đều là <b>trắc nghiệm</b>, chấm tự động.</p><ul><li>Đọc kỹ code, bảng và sơ đồ; nhiều câu ăn thua ở một chi tiết nhỏ.</li></ul><p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp. Nộp xong, mỗi câu đều giải thích từng đáp án bằng hai thứ tiếng.</p></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A recipe says &quot;add some salt, then keep stirring&quot;. Why does it fail as an algorithm?</p></div><div class=\"ml-vi\"><p>Một công thức ghi &quot;thêm chút muối rồi cứ khuấy mãi&quot;. Vì sao đây không phải thuật toán đạt yêu cầu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It has only two short steps|||Nó chỉ có hai bước ngắn"
            },
            {
              "text": "It uses too few variables|||Nó dùng quá ít biến"
            },
            {
              "text": "It is not written in binary|||Nó không viết bằng nhị phân"
            },
            {
              "text": "Its steps are vague and it may never stop|||Các bước mơ hồ và có thể không bao giờ dừng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. A short algorithm is still an algorithm.<br/>B. The number of variables is not a requirement.<br/>C. An algorithm need not be in binary.<br/>D. An algorithm must be unambiguous and finish in finite time.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Thuật toán ngắn vẫn là thuật toán.<br/>B. Số biến không phải yêu cầu.<br/>C. Thuật toán không cần viết bằng nhị phân.<br/>D. Thuật toán phải rõ ràng và kết thúc sau hữu hạn bước.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which list orders running times from slowest growth to fastest growth?</p></div><div class=\"ml-vi\"><p>Danh sách nào xếp thời gian chạy từ tăng chậm nhất đến tăng nhanh nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "O(log n), O(n), O(n log n), O(n^2)|||O(log n), O(n), O(n log n), O(n^2)"
            },
            {
              "text": "O(n^2), O(n log n), O(n), O(log n)|||O(n^2), O(n log n), O(n), O(log n)"
            },
            {
              "text": "O(log n), O(n log n), O(n), O(n^2)|||O(log n), O(n log n), O(n), O(n^2)"
            },
            {
              "text": "O(n), O(log n), O(n^2), O(n log n)|||O(n), O(log n), O(n^2), O(n log n)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. For large n, each one in this list overtakes the one before it.<br/>B. That is the reverse order.<br/>C. O(n) grows more slowly than O(n log n).<br/>D. O(log n) grows more slowly than O(n).</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Với n lớn, mỗi bậc trong danh sách vượt bậc đứng trước.<br/>B. Đó là thứ tự ngược.<br/>C. O(n) tăng chậm hơn O(n log n).<br/>D. O(log n) tăng chậm hơn O(n).</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>An Account class keeps its balance private and exposes only deposit() and withdraw(). Which OOP idea does this show?</p></div><div class=\"ml-vi\"><p>Lớp Account giữ số dư ở dạng private và chỉ mở deposit() với withdraw(). Điều này thể hiện ý tưởng OOP nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Inheritance|||Kế thừa"
            },
            {
              "text": "Multiprogramming|||Đa chương trình"
            },
            {
              "text": "Encapsulation|||Đóng gói"
            },
            {
              "text": "Recursion|||Đệ quy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. No class is extending another here.<br/>B. That is an OS idea.<br/>C. Data is reached only through controlled methods.<br/>D. No method calls itself here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Ở đây không có lớp nào kế thừa lớp khác.<br/>B. Đó là ý tưởng về hệ điều hành.<br/>C. Dữ liệu chỉ được truy cập qua các phương thức có kiểm soát.<br/>D. Không phương thức nào tự gọi chính nó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does the pseudocode below print?</p><pre><code class=\"language-plaintext\">n &lt;- 16\nsteps &lt;- 0\nwhile n &gt; 1:\n    n &lt;- n / 2\n    steps &lt;- steps + 1\nprint steps</code></pre></div><div class=\"ml-vi\"><p>Đoạn mã giả dưới đây in ra gì?</p><pre><code class=\"language-plaintext\">n &lt;- 16\nsteps &lt;- 0\nwhile n &gt; 1:\n    n &lt;- n / 2\n    steps &lt;- steps + 1\nprint steps</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5|||5"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That counts the values of n, not the loop passes.<br/>B. n goes 16, 8, 4, 2, 1 and the loop runs four times.<br/>C. That is the final n.<br/>D. That is the starting value of n.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Cách đó đếm số giá trị của n, không đếm số lần lặp.<br/>B. n đi qua 16, 8, 4, 2, 1 và vòng lặp chạy bốn lần.<br/>C. Đó là giá trị cuối của n.<br/>D. Đó là giá trị đầu của n.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Students take many courses, and each course has many students. How is this usually stored in a relational database?</p></div><div class=\"ml-vi\"><p>Sinh viên học nhiều môn, mỗi môn có nhiều sinh viên. Quan hệ này thường được lưu thế nào trong cơ sở dữ liệu quan hệ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A Courses column in Student listing many codes|||Một cột Courses trong Student liệt kê nhiều mã"
            },
            {
              "text": "A third table with one row per student-course pair|||Một bảng thứ ba, mỗi hàng là một cặp sinh viên-môn"
            },
            {
              "text": "One primary key shared by the two tables|||Một khoá chính dùng chung cho hai bảng"
            },
            {
              "text": "Repeating every student&#39;s details in Course|||Lặp lại thông tin sinh viên trong Course"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That breaks first normal form.<br/>B. Each row holds two foreign keys.<br/>C. That cannot model many-to-many.<br/>D. That causes redundancy and update anomalies.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Như vậy vi phạm dạng chuẩn 1.<br/>B. Mỗi hàng giữ hai khoá ngoại.<br/>C. Cách đó không mô hình hoá được nhiều-nhiều.<br/>D. Như vậy gây dư thừa và bất thường khi cập nhật.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A cashier&#39;s account can record sales but cannot change salaries. Which security principle is applied?</p></div><div class=\"ml-vi\"><p>Tài khoản thu ngân ghi được doanh số nhưng không sửa được lương. Nguyên tắc an toàn nào được áp dụng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Least privilege|||Đặc quyền tối thiểu"
            },
            {
              "text": "Virtual memory|||Bộ nhớ ảo"
            },
            {
              "text": "Normalisation|||Chuẩn hoá"
            },
            {
              "text": "Time-sharing|||Chia thời gian"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Each account gets only what its job needs.<br/>B. That extends RAM.<br/>C. That organises tables.<br/>D. That shares the CPU.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mỗi tài khoản chỉ có đúng quyền công việc cần.<br/>B. Đó là mở rộng RAM.<br/>C. Đó là tổ chức bảng.<br/>D. Đó là chia CPU.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A hiring model was trained on past decisions that favoured one group, and it now repeats that pattern. What explains this?</p></div><div class=\"ml-vi\"><p>Một mô hình tuyển dụng được huấn luyện trên các quyết định cũ thiên về một nhóm, nay lặp lại mẫu đó. Điều gì giải thích hiện tượng này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Machine learning cannot use data|||Học máy không dùng được dữ liệu"
            },
            {
              "text": "The computer&#39;s RAM is too small|||RAM của máy quá nhỏ"
            },
            {
              "text": "A model is only as fair as the data it learned from|||Mô hình chỉ công bằng bằng dữ liệu nó đã học"
            },
            {
              "text": "The model understands the law|||Mô hình hiểu luật"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Data is exactly what it learns from.<br/>B. Memory size does not create this pattern.<br/>C. Biased data leads to biased predictions.<br/>D. It finds patterns; it does not understand them.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Dữ liệu chính là thứ nó học.<br/>B. Dung lượng bộ nhớ không tạo ra mẫu này.<br/>C. Dữ liệu thiên lệch dẫn đến dự đoán thiên lệch.<br/>D. Nó tìm mẫu, không thật sự hiểu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In object-oriented analysis, which diagram shows who uses the system and for what?</p></div><div class=\"ml-vi\"><p>Trong phân tích hướng đối tượng, biểu đồ nào cho thấy ai dùng hệ thống và để làm gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Structure chart|||Biểu đồ cấu trúc"
            },
            {
              "text": "Truth table|||Bảng chân trị"
            },
            {
              "text": "Memory map|||Bản đồ bộ nhớ"
            },
            {
              "text": "Use case diagram|||Biểu đồ use case"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That belongs to procedure-oriented design.<br/>B. That lists logic results.<br/>C. That shows memory layout.<br/>D. It shows actors and the goals they reach.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Biểu đồ đó thuộc thiết kế hướng thủ tục.<br/>B. Bảng đó liệt kê kết quả logic.<br/>C. Bản đồ đó thể hiện bố trí bộ nhớ.<br/>D. Nó thể hiện tác nhân và mục tiêu của họ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Insertion sort has sorted the first three items of [4, 6, 9, 5, 1]. What does the list look like after the next pass?</p></div><div class=\"ml-vi\"><p>Sắp xếp chèn đã sắp xong ba phần tử đầu của [4, 6, 9, 5, 1]. Sau lượt kế tiếp danh sách thành gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "[1, 4, 6, 9, 5]|||[1, 4, 6, 9, 5]"
            },
            {
              "text": "[1, 4, 5, 6, 9]|||[1, 4, 5, 6, 9]"
            },
            {
              "text": "[4, 5, 9, 6, 1]|||[4, 5, 9, 6, 1]"
            },
            {
              "text": "[4, 5, 6, 9, 1]|||[4, 5, 6, 9, 1]"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That handles 1 instead of 5.<br/>B. That is the end result.<br/>C. That swaps instead of shifting, so the sorted part is broken.<br/>D. 5 is taken and inserted before 6, and larger items move right.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách đó xử lý 1 thay vì 5.<br/>B. Đó là kết quả cuối cùng.<br/>C. Cách đó đổi chỗ thay vì dịch nên phần đã sắp bị hỏng.<br/>D. 5 được lấy ra và chèn trước 6, các phần tử lớn hơn dịch phải.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A computer has a 16-bit address bus and each address holds one byte. What is the largest memory it can address?</p></div><div class=\"ml-vi\"><p>Một máy tính có bus địa chỉ 16 bit và mỗi địa chỉ giữ một byte. Bộ nhớ lớn nhất nó đánh địa chỉ được là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "256 bytes|||256 byte"
            },
            {
              "text": "65,536 bytes|||65.536 byte"
            },
            {
              "text": "4,294,967,296 bytes|||4.294.967.296 byte"
            },
            {
              "text": "16 bytes|||16 byte"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That needs only 8 address bits.<br/>B. 16 address lines give 2^16 locations.<br/>C. That needs 32 address bits.<br/>D. This confuses lines with locations.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Số đó chỉ cần 8 bit địa chỉ.<br/>B. 16 đường địa chỉ cho 2^16 ô nhớ.<br/>C. Số đó cần 32 bit địa chỉ.<br/>D. Cách này nhầm số đường với số ô.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does the recursive function below return for f(4)?</p><pre><code class=\"language-plaintext\">f(n):\n    if n = 1: return 1\n    return n * f(n - 1)</code></pre></div><div class=\"ml-vi\"><p>Hàm đệ quy dưới đây trả về gì với f(4)?</p><pre><code class=\"language-plaintext\">f(n):\n    if n = 1: return 1\n    return n * f(n - 1)</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "24|||24"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. f(4) = 4 x 3 x 2 x 1.<br/>B. That stops at f(2) with a wrong base case.<br/>C. That adds the numbers.<br/>D. That stops after the first call.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. f(4) = 4 x 3 x 2 x 1.<br/>B. Cách đó dừng ở f(2) với điều kiện dừng sai.<br/>C. Cách đó cộng các số.<br/>D. Cách đó dừng ở lần gọi đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A web developer uploads many files to a hosting server. Which classic protocol exists for this kind of file transfer?</p></div><div class=\"ml-vi\"><p>Lập trình viên web tải nhiều tệp lên máy chủ. Giao thức kinh điển nào dành cho việc truyền tệp này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ARP|||ARP"
            },
            {
              "text": "POP3|||POP3"
            },
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "DNS|||DNS"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. ARP resolves local addresses.<br/>B. POP3 fetches mail.<br/>C. FTP is designed for transferring files.<br/>D. DNS resolves names.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. ARP phân giải địa chỉ cục bộ.<br/>B. POP3 lấy thư.<br/>C. FTP được thiết kế để truyền tệp.<br/>D. DNS phân giải tên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A module named ReportAndEmailAndBackup does three unrelated jobs. Which quality is poor here?</p></div><div class=\"ml-vi\"><p>Mô-đun tên ReportAndEmailAndBackup làm ba việc không liên quan. Chất lượng nào đang kém?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Throughput|||Thông lượng"
            },
            {
              "text": "Cohesion|||Tính cố kết"
            },
            {
              "text": "Volatility|||Tính bay hơi"
            },
            {
              "text": "Bandwidth|||Băng thông"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is a performance measure.<br/>B. A cohesive module does one clear job.<br/>C. That is a memory property.<br/>D. That is a network measure.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là thước đo hiệu năng.<br/>B. Mô-đun cố kết làm một việc rõ ràng.<br/>C. Đó là thuộc tính của bộ nhớ.<br/>D. Đó là thước đo của mạng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the preorder traversal of the binary tree below?</p><pre class=\"mermaid\">flowchart TD\n  A --&gt; B\n  A --&gt; C\n  B --&gt; D\n  B --&gt; E</pre></div><div class=\"ml-vi\"><p>Duyệt preorder của cây nhị phân dưới đây cho thứ tự nào?</p><pre class=\"mermaid\">flowchart TD\n  A --&gt; B\n  A --&gt; C\n  B --&gt; D\n  B --&gt; E</pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A, B, D, E, C|||A, B, D, E, C"
            },
            {
              "text": "A, B, C, D, E|||A, B, C, D, E"
            },
            {
              "text": "D, E, B, C, A|||D, E, B, C, A"
            },
            {
              "text": "D, B, E, A, C|||D, B, E, A, C"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Visit the root, then the left subtree, then the right subtree.<br/>B. That is breadth-first.<br/>C. That is postorder.<br/>D. That is inorder.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Thăm gốc, rồi cây con trái, rồi cây con phải.<br/>B. Đó là duyệt theo chiều rộng.<br/>C. Đó là postorder.<br/>D. Đó là inorder.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is octal 72 in binary?</p></div><div class=\"ml-vi\"><p>Số bát phân 72 viết ở nhị phân là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11110|||11110"
            },
            {
              "text": "1001000|||1001000"
            },
            {
              "text": "111010|||111010"
            },
            {
              "text": "010111|||010111"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That equals 30.<br/>B. That is decimal 72.<br/>C. 7 is 111 and 2 is 010.<br/>D. The groups are swapped.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Số đó bằng 30.<br/>B. Đó là số thập phân 72.<br/>C. 7 là 111 và 2 là 010.<br/>D. Hai nhóm bị đảo.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Why does a CPU have a cache?</p></div><div class=\"ml-vi\"><p>Vì sao CPU có bộ nhớ cache?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "To replace the disk in the long run|||Để thay thế đĩa về lâu dài"
            },
            {
              "text": "To translate source code|||Để dịch mã nguồn"
            },
            {
              "text": "To store files after power is turned off|||Để lưu tệp sau khi tắt điện"
            },
            {
              "text": "To keep recently used data close to the CPU|||Để giữ dữ liệu vừa dùng ở gần CPU"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. A cache is far too small for that.<br/>B. That is a compiler&#39;s work.<br/>C. Cache is volatile.<br/>D. Most accesses are repeated, so a small fast memory helps a lot.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cache quá nhỏ để làm việc đó.<br/>B. Đó là việc của trình biên dịch.<br/>C. Cache mất dữ liệu khi tắt điện.<br/>D. Phần lớn truy cập lặp lại nên bộ nhớ nhỏ mà nhanh giúp rất nhiều.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A running process uses up its time slice. Where does it go?</p></div><div class=\"ml-vi\"><p>Một tiến trình đang chạy dùng hết lát thời gian của nó. Nó đi đâu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Back to the job queue on disk|||Trở lại hàng đợi job trên đĩa"
            },
            {
              "text": "To Terminated|||Sang Terminated"
            },
            {
              "text": "To the I/O queue|||Sang hàng đợi vào/ra"
            },
            {
              "text": "Back to the ready queue|||Trở lại hàng đợi sẵn sàng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It stays in memory.<br/>B. It has not finished.<br/>C. That happens when it needs a device.<br/>D. It can still run, so it waits for its next turn.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Nó vẫn ở trong bộ nhớ.<br/>B. Nó chưa xong việc.<br/>C. Việc đó xảy ra khi nó cần thiết bị.<br/>D. Nó vẫn chạy được nên chờ tới lượt kế.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A student entry stores an id (int), a name (text) and a gpa (real). Which structure groups them?</p></div><div class=\"ml-vi\"><p>Một mục sinh viên lưu id (số nguyên), tên (chuỗi) và gpa (số thực). Cấu trúc nào gom chúng lại?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Stack|||Ngăn xếp"
            },
            {
              "text": "Record|||Bản ghi"
            },
            {
              "text": "Array|||Mảng"
            },
            {
              "text": "Graph|||Đồ thị"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A stack controls the order of access.<br/>B. A record groups related fields of different types.<br/>C. An array holds elements of the same type.<br/>D. A graph models links between items.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Ngăn xếp quy định thứ tự truy cập.<br/>B. Bản ghi gom các trường liên quan có kiểu khác nhau.<br/>C. Mảng chứa các phần tử cùng kiểu.<br/>D. Đồ thị mô hình hoá liên kết giữa các phần tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Shape has a method draw(). Circle and Square each provide their own version, and the right one runs for each object. Which OOP idea is this?</p></div><div class=\"ml-vi\"><p>Shape có phương thức draw(). Circle và Square đều có phiên bản riêng, và bản đúng được chạy theo từng đối tượng. Đây là ý tưởng OOP nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Normalisation|||Chuẩn hoá"
            },
            {
              "text": "Paging|||Phân trang"
            },
            {
              "text": "Polymorphism|||Đa hình"
            },
            {
              "text": "Encapsulation|||Đóng gói"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a database idea.<br/>B. That is a memory idea.<br/>C. One call behaves differently depending on the object.<br/>D. That hides internal details.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là ý tưởng về cơ sở dữ liệu.<br/>B. Đó là ý tưởng về bộ nhớ.<br/>C. Một lời gọi hoạt động khác nhau tuỳ đối tượng.<br/>D. Đóng gói giấu chi tiết bên trong.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A compiler reports that a closing bracket is missing. Which stage noticed the broken grammar?</p></div><div class=\"ml-vi\"><p>Trình biên dịch báo thiếu dấu ngoặc đóng. Giai đoạn nào phát hiện lỗi ngữ pháp này?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Syntax analysis|||Phân tích cú pháp"
            },
            {
              "text": "Code generation|||Sinh mã"
            },
            {
              "text": "Linking|||Liên kết"
            },
            {
              "text": "Lexical analysis|||Phân tích từ vựng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The parser checks that tokens follow the grammar.<br/>B. That comes after the structure is known to be valid.<br/>C. Linking joins compiled parts.<br/>D. That splits the text into tokens.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Bộ phân tích cú pháp kiểm các từ tố có đúng ngữ pháp không.<br/>B. Giai đoạn đó đến sau khi cấu trúc đã hợp lệ.<br/>C. Liên kết nối các phần đã biên dịch.<br/>D. Giai đoạn đó tách văn bản thành từ tố.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A graphics chip applies one brightness instruction to thousands of pixels at the same time. Which class of parallel processing is this?</p></div><div class=\"ml-vi\"><p>Một chip đồ hoạ áp một lệnh tăng sáng lên hàng nghìn điểm ảnh cùng lúc. Đây là lớp xử lý song song nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "MIMD|||MIMD"
            },
            {
              "text": "SIMD|||SIMD"
            },
            {
              "text": "SISD|||SISD"
            },
            {
              "text": "RAID|||RAID"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That runs different instructions on different data.<br/>B. Single instruction, multiple data.<br/>C. That is one instruction on one data item at a time.<br/>D. RAID is about disks, not instruction streams.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là chạy các lệnh khác nhau trên dữ liệu khác nhau.<br/>B. Một lệnh, nhiều dữ liệu.<br/>C. Đó là một lệnh trên một dữ liệu mỗi lúc.<br/>D. RAID nói về đĩa, không nói về luồng lệnh.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A queue runs: enqueue 4, enqueue 9, dequeue, enqueue 2. Which item is at the front now?</p></div><div class=\"ml-vi\"><p>Một hàng đợi chạy: enqueue 4, enqueue 9, dequeue, enqueue 2. Phần tử nào đang ở đầu hàng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "9|||9"
            },
            {
              "text": "The queue is empty|||Hàng đợi rỗng"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 4 left first, so 9 is now at the front.<br/>B. There are two items left.<br/>C. 2 is at the back.<br/>D. 4 was removed by dequeue.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 4 ra trước nên bây giờ 9 ở đầu hàng.<br/>B. Còn hai phần tử.<br/>C. 2 đang ở cuối hàng.<br/>D. 4 đã bị dequeue lấy ra.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which path below is an absolute path on Linux?</p></div><div class=\"ml-vi\"><p>Đường dẫn nào dưới đây là đường dẫn tuyệt đối trên Linux?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "notes.txt|||notes.txt"
            },
            {
              "text": "docs/notes.txt|||docs/notes.txt"
            },
            {
              "text": "/home/an/notes.txt|||/home/an/notes.txt"
            },
            {
              "text": "../notes.txt|||../notes.txt"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is relative to the current directory.<br/>B. That is relative as well.<br/>C. It starts at the root directory.<br/>D. That is relative to the parent directory.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đường dẫn đó tính từ thư mục hiện tại.<br/>B. Đường dẫn đó cũng là tương đối.<br/>C. Nó bắt đầu từ thư mục gốc.<br/>D. Đường dẫn đó tính từ thư mục cha.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Convert decimal 23.5 to binary.</p></div><div class=\"ml-vi\"><p>Đổi số thập phân 23.5 sang nhị phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11011.1|||11011.1"
            },
            {
              "text": "10111.01|||10111.01"
            },
            {
              "text": "10111.5|||10111.5"
            },
            {
              "text": "10111.1|||10111.1"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That equals 27.5.<br/>B. .01 means a quarter.<br/>C. 5 is not a binary digit.<br/>D. 23 = 16 + 4 + 2 + 1, and 0.5 is one half.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Số đó bằng 27.5.<br/>B. .01 nghĩa là một phần tư.<br/>C. 5 không phải chữ số nhị phân.<br/>D. 23 = 16 + 4 + 2 + 1, và 0.5 là một nửa.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which normalised form equals decimal 0.15625?</p></div><div class=\"ml-vi\"><p>Dạng chuẩn hoá nào bằng số thập phân 0.15625?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1.01 x 2^-3|||1.01 x 2^-3"
            },
            {
              "text": "1.1 x 2^-3|||1.1 x 2^-3"
            },
            {
              "text": "1.01 x 2^3|||1.01 x 2^3"
            },
            {
              "text": "101 x 2^-5|||101 x 2^-5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 0.15625 = 0.00101 in binary; moving the point 3 places gives 1.01.<br/>B. That equals 0.1875.<br/>C. The exponent must be negative, because the value is below 1.<br/>D. The value is right, but it is not normalised.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 0.15625 = 0.00101 ở nhị phân; dời dấu chấm 3 vị trí được 1.01.<br/>B. Số đó bằng 0.1875.<br/>C. Mũ phải âm vì giá trị nhỏ hơn 1.<br/>D. Giá trị đúng nhưng chưa chuẩn hoá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In an indexed file, what does the index hold?</p></div><div class=\"ml-vi\"><p>Trong tệp chỉ mục, chỉ mục chứa gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Only the file&#39;s name|||Chỉ tên tệp"
            },
            {
              "text": "A full copy of every record|||Bản sao đầy đủ của mọi bản ghi"
            },
            {
              "text": "Keys and the location of each matching record|||Các khoá và vị trí của bản ghi tương ứng"
            },
            {
              "text": "The CPU&#39;s register values|||Giá trị thanh ghi của CPU"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A name alone cannot locate records.<br/>B. That would waste space.<br/>C. Look up the key, then jump straight to the record.<br/>D. These are unrelated to files.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Chỉ tên thì không định vị được bản ghi.<br/>B. Như vậy rất phí chỗ.<br/>C. Tra khoá rồi nhảy thẳng tới bản ghi.<br/>D. Chúng không liên quan đến tệp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which document explains to customers how to use a finished program?</p></div><div class=\"ml-vi\"><p>Tài liệu nào giải thích cho khách hàng cách dùng chương trình đã hoàn thiện?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "System documentation|||Tài liệu hệ thống"
            },
            {
              "text": "User documentation|||Tài liệu người dùng"
            },
            {
              "text": "A DFD|||Sơ đồ DFD"
            },
            {
              "text": "Source code comments|||Chú thích trong mã nguồn"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That describes how the software was built, for maintainers.<br/>B. It is written for end users.<br/>C. That is an analysis diagram.<br/>D. Those are for programmers.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Tài liệu đó mô tả phần mềm được dựng thế nào, dành cho người bảo trì.<br/>B. Nó viết cho người dùng cuối.<br/>C. Đó là sơ đồ phân tích.<br/>D. Chúng dành cho lập trình viên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does an abstract data type specify?</p></div><div class=\"ml-vi\"><p>Kiểu dữ liệu trừu tượng quy định điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The CPU that must be used|||CPU bắt buộc phải dùng"
            },
            {
              "text": "The colour of a window|||Màu của cửa sổ"
            },
            {
              "text": "The exact memory address of each item|||Địa chỉ bộ nhớ chính xác của từng phần tử"
            },
            {
              "text": "The operations available, not how they are implemented|||Các thao tác có sẵn, không nói cách cài đặt"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. An ADT is hardware-independent.<br/>B. That has nothing to do with data types.<br/>C. That is hidden on purpose.<br/>D. The implementation can change without affecting its users.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. ADT không phụ thuộc phần cứng.<br/>B. Điều đó không liên quan kiểu dữ liệu.<br/>C. Điều đó được giấu có chủ ý.<br/>D. Cách cài đặt có thể đổi mà không ảnh hưởng người dùng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>When the CPU switches processes, what does the OS save so the first can resume later?</p></div><div class=\"ml-vi\"><p>Khi CPU chuyển tiến trình, hệ điều hành lưu gì để tiến trình đầu chạy tiếp được sau đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Its state, in a process control block|||Trạng thái của nó, trong khối điều khiển tiến trình"
            },
            {
              "text": "Nothing, because the process restarts from the beginning|||Không gì cả, vì tiến trình chạy lại từ đầu"
            },
            {
              "text": "A copy of the whole hard disk|||Bản sao cả đĩa cứng"
            },
            {
              "text": "The BIOS settings|||Cài đặt BIOS"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The PCB records registers, program counter and more.<br/>B. It continues where it stopped.<br/>C. That would be far too slow.<br/>D. These are unrelated to processes.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. PCB ghi các thanh ghi, bộ đếm chương trình và nhiều thứ khác.<br/>B. Nó tiếp tục từ chỗ đã dừng.<br/>C. Việc đó quá chậm.<br/>D. Chúng không liên quan tiến trình.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which operation flips the right four bits of a byte and leaves the left four alone?</p></div><div class=\"ml-vi\"><p>Phép toán nào lật bốn bit phải của một byte và giữ nguyên bốn bit trái?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "OR with 00001111|||OR với 00001111"
            },
            {
              "text": "XOR with 00001111|||XOR với 00001111"
            },
            {
              "text": "NOT of the whole byte|||NOT cả byte"
            },
            {
              "text": "AND with 00001111|||AND với 00001111"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That sets the right four bits to 1.<br/>B. XOR with 1 flips a bit and XOR with 0 keeps it.<br/>C. That flips all eight bits.<br/>D. That clears the left four bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phép đó đặt bốn bit phải lên 1.<br/>B. XOR với 1 lật bit, XOR với 0 giữ bit.<br/>C. Phép đó lật cả tám bit.<br/>D. Phép đó xoá bốn bit trái.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A long algorithm is broken into smaller named parts that can each be reused. What are these parts called?</p></div><div class=\"ml-vi\"><p>Một thuật toán dài được chia thành các phần nhỏ có tên, dùng lại được. Các phần đó gọi là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Registers|||Thanh ghi"
            },
            {
              "text": "Pixels|||Điểm ảnh"
            },
            {
              "text": "Subalgorithms|||Thuật toán con"
            },
            {
              "text": "Sectors|||Cung từ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Registers are CPU storage.<br/>B. Pixels make up images.<br/>C. They are the idea behind functions and procedures.<br/>D. Sectors are parts of a disk.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Thanh ghi là ô nhớ của CPU.<br/>B. Điểm ảnh tạo nên hình.<br/>C. Chúng là ý tưởng đằng sau hàm và thủ tục.<br/>D. Cung từ là phần của đĩa.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A small microcontroller keeps its instructions and its data in two separate memories with separate paths. Which architecture is this?</p></div><div class=\"ml-vi\"><p>Một vi điều khiển nhỏ giữ lệnh và dữ liệu ở hai bộ nhớ riêng với đường đi riêng. Đây là kiến trúc nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Client-server|||Khách-chủ"
            },
            {
              "text": "Peer-to-peer|||Ngang hàng"
            },
            {
              "text": "Von Neumann|||Von Neumann"
            },
            {
              "text": "Harvard|||Harvard"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is a network model.<br/>B. That is a network model.<br/>C. Von Neumann keeps both in one memory.<br/>D. Harvard splits instruction memory and data memory.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là mô hình mạng.<br/>B. Đó là mô hình mạng.<br/>C. Von Neumann giữ cả hai trong một bộ nhớ.<br/>D. Harvard tách bộ nhớ lệnh và bộ nhớ dữ liệu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Your browser asks a web server for a page. Which roles do the two programs play?</p></div><div class=\"ml-vi\"><p>Trình duyệt yêu cầu một trang từ máy chủ web. Hai chương trình này đóng vai trò gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Both are peers with no roles|||Cả hai ngang hàng, không có vai trò"
            },
            {
              "text": "The router is the client of both|||Router là client của cả hai"
            },
            {
              "text": "The browser is the client, the web server replies|||Trình duyệt là client và máy chủ web trả lời"
            },
            {
              "text": "The browser is the server and answers|||Trình duyệt là server và trả lời"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The web is client-server.<br/>B. Routers only forward packets here.<br/>C. The client starts the request and the server answers.<br/>D. It requests rather than provides the service.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Web theo mô hình khách-chủ.<br/>B. Router ở đây chỉ chuyển gói.<br/>C. Client bắt đầu yêu cầu và server trả lời.<br/>D. Nó xin dịch vụ chứ không cung cấp dịch vụ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the main output of the analysis phase?</p></div><div class=\"ml-vi\"><p>Sản phẩm chính của pha phân tích là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The finished and compiled source code|||Mã nguồn đã hoàn chỉnh và biên dịch"
            },
            {
              "text": "The final test report|||Báo cáo kiểm thử cuối cùng"
            },
            {
              "text": "The product installer|||Bộ cài sản phẩm"
            },
            {
              "text": "A specification of what the system must do|||Đặc tả hệ thống phải làm gì"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That comes from implementation.<br/>B. That comes from testing.<br/>C. That comes near delivery.<br/>D. It is the input to the design phase.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là sản phẩm của pha cài đặt.<br/>B. Đó là sản phẩm của pha kiểm thử.<br/>C. Bộ cài có ở gần lúc bàn giao.<br/>D. Đây là đầu vào của pha thiết kế.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which legal right automatically protects the source code you write?</p></div><div class=\"ml-vi\"><p>Quyền pháp lý nào tự động bảo vệ mã nguồn bạn viết?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Firewall|||Tường lửa"
            },
            {
              "text": "Copyright|||Quyền tác giả"
            },
            {
              "text": "Patent|||Bằng sáng chế"
            },
            {
              "text": "Trademark|||Nhãn hiệu"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is a security tool.<br/>B. It arises when the work is created.<br/>C. A patent must be applied for and covers inventions.<br/>D. That protects names and logos.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là công cụ an toàn.<br/>B. Quyền này phát sinh khi tác phẩm được tạo ra.<br/>C. Bằng sáng chế phải đăng ký và bảo hộ phát minh.<br/>D. Nhãn hiệu bảo hộ tên và logo.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which language level does the CPU execute directly?</p></div><div class=\"ml-vi\"><p>CPU trực tiếp thực thi mức ngôn ngữ nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Machine language|||Ngôn ngữ máy"
            },
            {
              "text": "Assembly language|||Hợp ngữ"
            },
            {
              "text": "Java|||Java"
            },
            {
              "text": "Python|||Python"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Everything else must be translated down to it.<br/>B. An assembler must translate it first.<br/>C. It goes through bytecode and a virtual machine.<br/>D. It needs an interpreter.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mọi thứ khác đều phải dịch xuống mức này.<br/>B. Trình hợp dịch phải dịch nó trước.<br/>C. Nó đi qua bytecode và máy ảo.<br/>D. Nó cần trình thông dịch.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A program adds 0.1 and 0.2 in double-precision floating point, and the equality test with 0.3 fails. What is the cause?</p></div><div class=\"ml-vi\"><p>Chương trình cộng 0.1 và 0.2 bằng số thực độ chính xác kép, và phép so bằng với 0.3 lại sai. Nguyên nhân là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Two&#39;s complement cannot store positive numbers|||Bù hai không lưu được số dương"
            },
            {
              "text": "Floats cannot be added together|||Số thực không cộng với nhau được"
            },
            {
              "text": "The CPU has a broken adder|||CPU có bộ cộng hỏng"
            },
            {
              "text": "These decimals have no exact binary form|||Các số thập phân này không có dạng nhị phân chính xác"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Floats do not use two&#39;s complement here, and it stores positives fine.<br/>B. They can be added.<br/>C. This is normal behaviour on every machine.<br/>D. Floating point stores the nearest value, so rounding error appears.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Số thực ở đây không dùng bù hai, và bù hai vẫn lưu được số dương.<br/>B. Chúng cộng được.<br/>C. Đây là hành vi bình thường trên mọi máy.<br/>D. Dấu phẩy động lưu giá trị gần nhất nên có sai số làm tròn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which relational operation combines rows of two tables on a matching column?</p></div><div class=\"ml-vi\"><p>Phép toán quan hệ nào ghép các hàng của hai bảng theo một cột khớp nhau?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Select|||Chọn (select)"
            },
            {
              "text": "Difference|||Hiệu (difference)"
            },
            {
              "text": "Join|||Kết nối (join)"
            },
            {
              "text": "Project|||Chiếu (project)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Select picks rows of one table.<br/>B. Difference removes rows found in another relation.<br/>C. Join pairs rows that share a value.<br/>D. Project picks columns of one table.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Phép chọn chọn hàng của một bảng.<br/>B. Phép hiệu loại các hàng có trong quan hệ khác.<br/>C. Join ghép các hàng có chung giá trị.<br/>D. Phép chiếu chọn cột của một bảng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which pair matches a language with its usual way of running?</p></div><div class=\"ml-vi\"><p>Cặp nào ghép đúng ngôn ngữ với cách chạy thường gặp của nó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Java runs without any translation|||Java chạy không cần dịch"
            },
            {
              "text": "C is compiled, and Python is interpreted|||C được biên dịch, Python được thông dịch"
            },
            {
              "text": "Assembly needs a JVM|||Hợp ngữ cần JVM"
            },
            {
              "text": "C is interpreted, and Python is compiled to a .exe by default|||C được thông dịch, Python mặc định biên dịch ra .exe"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Java source is compiled to bytecode.<br/>B. This matches how the two usually run.<br/>C. A JVM runs bytecode.<br/>D. This reverses the usual situation.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Mã nguồn Java được biên dịch ra bytecode.<br/>B. Đây đúng là cách hai ngôn ngữ thường chạy.<br/>C. JVM chạy bytecode.<br/>D. Câu này đảo ngược thực tế thường gặp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How does segmentation differ from paging?</p></div><div class=\"ml-vi\"><p>Phân đoạn khác phân trang ở điểm nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Segments follow logical parts and vary in size|||Đoạn theo các phần logic và có cỡ khác nhau"
            },
            {
              "text": "Segmentation does not use memory|||Phân đoạn không dùng bộ nhớ"
            },
            {
              "text": "Paging needs a printer attached|||Phân trang cần gắn máy in"
            },
            {
              "text": "Segments are always exactly 4 KB in size|||Đoạn luôn đúng 4 KB"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Pages are all the same size, regardless of meaning.<br/>B. It is a memory management method.<br/>C. Paging here has nothing to do with printing.<br/>D. That sounds like a page size.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Trang có cỡ bằng nhau, không xét ý nghĩa.<br/>B. Đây là phương pháp quản lý bộ nhớ.<br/>C. Trang ở đây không liên quan việc in.<br/>D. Điều đó giống cỡ trang hơn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A photo is saved as a JPEG, and a source file is packed into a ZIP. Which statement is right?</p></div><div class=\"ml-vi\"><p>Một ảnh được lưu thành JPEG, còn tệp mã nguồn được nén thành ZIP. Phát biểu nào đúng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Both are lossy|||Cả hai đều mất dữ liệu"
            },
            {
              "text": "ZIP is lossy, and JPEG is lossless|||ZIP mất dữ liệu, còn JPEG không mất"
            },
            {
              "text": "Both are lossless|||Cả hai đều không mất dữ liệu"
            },
            {
              "text": "JPEG is lossy, and ZIP is lossless|||JPEG nén mất dữ liệu, còn ZIP nén không mất dữ liệu"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. ZIP restores the original exactly.<br/>B. This reverses the two.<br/>C. JPEG discards some detail.<br/>D. Code must come back bit for bit, while small image detail may be dropped.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. ZIP khôi phục đúng bản gốc.<br/>B. Câu này đảo ngược hai loại.<br/>C. JPEG bỏ một số chi tiết.<br/>D. Mã phải khôi phục đúng từng bit, còn chi tiết nhỏ của ảnh có thể bỏ đi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How many different patterns can 5 bits represent?</p></div><div class=\"ml-vi\"><p>5 bit biểu diễn được bao nhiêu mẫu khác nhau?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "32|||32"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "31|||31"
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 2^5 = 32.<br/>B. That is the number of bits.<br/>C. That is the largest value, not the number of patterns.<br/>D. That doubles 5 instead of raising 2 to the fifth power.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 2^5 = 32.<br/>B. Đó là số bit.<br/>C. Đó là giá trị lớn nhất, không phải số mẫu.<br/>D. Cách đó nhân đôi 5 thay vì tính 2 mũ 5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Why does UTF-8 use a variable number of bytes per character?</p></div><div class=\"ml-vi\"><p>Vì sao UTF-8 dùng số byte thay đổi cho mỗi ký tự?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Each character takes exactly 4 bytes|||Mỗi ký tự đúng 4 byte"
            },
            {
              "text": "English letters stay one byte, others take more|||Chữ cái tiếng Anh vẫn một byte, chữ khác dùng nhiều hơn"
            },
            {
              "text": "It only stores numbers, not text|||Nó chỉ lưu số, không lưu chữ"
            },
            {
              "text": "It compresses images inside text|||Nó nén ảnh nằm trong văn bản"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That would be fixed length.<br/>B. This keeps ASCII text compact and still covers every language.<br/>C. It is a text encoding.<br/>D. Image compression is a different field.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Như vậy là độ dài cố định.<br/>B. Nhờ vậy văn bản ASCII vẫn gọn mà vẫn phủ mọi ngôn ngữ.<br/>C. Nó là bảng mã văn bản.<br/>D. Nén ảnh là lĩnh vực khác.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In a flowchart or UML activity diagram, what does a diamond show?</p></div><div class=\"ml-vi\"><p>Trong lưu đồ hoặc sơ đồ hoạt động UML, hình thoi thể hiện điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A stored file|||Một tệp đã lưu"
            },
            {
              "text": "A printed output|||Một kết quả in ra"
            },
            {
              "text": "A decision between paths|||Một lựa chọn giữa các nhánh"
            },
            {
              "text": "The start of the algorithm|||Điểm bắt đầu thuật toán"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. A diamond is not used for files.<br/>B. Output has its own box.<br/>C. The flow splits according to a condition.<br/>D. Start is shown by a filled circle or an oval.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Hình thoi không dùng cho tệp.<br/>B. Kết quả ra có hình riêng.<br/>C. Luồng rẽ theo một điều kiện.<br/>D. Điểm bắt đầu vẽ bằng hình tròn đặc hoặc hình bầu dục.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Table Enroll has primary key (studentId, courseId), plus a courseName column that depends only on courseId. Which normal form does this break?</p></div><div class=\"ml-vi\"><p>Bảng Enroll có khoá chính (studentId, courseId) và cột courseName chỉ phụ thuộc courseId. Việc này vi phạm dạng chuẩn nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Boyce-Codd normal form|||Dạng chuẩn Boyce-Codd"
            },
            {
              "text": "First normal form|||Dạng chuẩn 1"
            },
            {
              "text": "Third normal form|||Dạng chuẩn 3"
            },
            {
              "text": "Second normal form|||Dạng chuẩn 2"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. The problem appears earlier than BCNF.<br/>B. All values here are atomic.<br/>C. 3NF is about dependence through a non-key column.<br/>D. courseName depends on part of the key.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Vấn đề xuất hiện sớm hơn BCNF.<br/>B. Mọi giá trị ở đây đều nguyên tử.<br/>C. Dạng chuẩn 3 nói về phụ thuộc qua cột không phải khoá.<br/>D. courseName phụ thuộc một phần của khoá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which software lets many users query and update shared data safely?</p></div><div class=\"ml-vi\"><p>Phần mềm nào cho nhiều người dùng truy vấn và cập nhật dữ liệu chung một cách an toàn?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A text editor|||Một trình soạn thảo văn bản"
            },
            {
              "text": "A device driver|||Một driver thiết bị"
            },
            {
              "text": "A DBMS|||Một DBMS"
            },
            {
              "text": "A compiler|||Một trình biên dịch"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It offers no shared query control.<br/>B. A driver controls hardware.<br/>C. A database management system controls shared access.<br/>D. A compiler translates code.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Nó không có kiểm soát truy vấn chung.<br/>B. Driver điều khiển phần cứng.<br/>C. Hệ quản trị cơ sở dữ liệu kiểm soát truy cập chung.<br/>D. Trình biên dịch dịch mã.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A file on disk has been chosen to run, but is not yet in memory. Using the textbook&#39;s terms, what is it now?</p></div><div class=\"ml-vi\"><p>Một tệp trên đĩa đã được chọn để chạy nhưng chưa vào bộ nhớ. Theo thuật ngữ giáo trình, nó bây giờ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A process|||Một tiến trình"
            },
            {
              "text": "A job|||Một job (công việc)"
            },
            {
              "text": "A thread|||Một luồng"
            },
            {
              "text": "A frame|||Một khung"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A process is already in memory.<br/>B. A job is a program selected for execution; it becomes a process once loaded.<br/>C. A thread lives inside a running process.<br/>D. A frame is a unit of memory.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Tiến trình đã nằm trong bộ nhớ.<br/>B. Job là chương trình được chọn để chạy; vào bộ nhớ rồi mới thành tiến trình.<br/>C. Luồng nằm trong một tiến trình đang chạy.<br/>D. Khung là đơn vị bộ nhớ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A student moves to a new address. Which SQL statement should change the row?</p></div><div class=\"ml-vi\"><p>Một sinh viên đổi địa chỉ. Câu lệnh SQL nào nên sửa hàng đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "UPDATE|||UPDATE"
            },
            {
              "text": "SELECT|||SELECT"
            },
            {
              "text": "INSERT|||INSERT"
            },
            {
              "text": "DROP|||DROP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. UPDATE changes values in existing rows.<br/>B. SELECT only reads.<br/>C. INSERT adds a new row.<br/>D. DROP removes a whole table.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. UPDATE đổi giá trị trong hàng đã có.<br/>B. SELECT chỉ đọc.<br/>C. INSERT thêm hàng mới.<br/>D. DROP xoá cả bảng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which of these is a glass-box testing technique?</p></div><div class=\"ml-vi\"><p>Kỹ thuật nào dưới đây thuộc kiểm thử hộp trắng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Boundary-value testing|||Kiểm thử giá trị biên"
            },
            {
              "text": "Basis-path testing|||Kiểm thử đường cơ sở"
            },
            {
              "text": "Equivalence partitioning|||Phân lớp tương đương"
            },
            {
              "text": "Random testing from the specification|||Kiểm thử ngẫu nhiên theo đặc tả"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is black-box.<br/>B. It is built from the control flow inside the code.<br/>C. That is black-box.<br/>D. That is black-box.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là hộp đen.<br/>B. Nó dựa trên luồng điều khiển bên trong mã.<br/>C. Đó là hộp đen.<br/>D. Đó là hộp đen.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which early device showed that a machine could follow a pattern stored on punched cards?</p></div><div class=\"ml-vi\"><p>Thiết bị đời đầu nào cho thấy máy móc có thể làm theo một mẫu lưu trên thẻ đục lỗ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The hard disk|||Đĩa cứng"
            },
            {
              "text": "The microprocessor|||Vi xử lý"
            },
            {
              "text": "The Jacquard loom|||Khung dệt Jacquard"
            },
            {
              "text": "The transistor radio|||Đài bán dẫn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That came long after punched cards.<br/>B. That is a fourth-generation invention.<br/>C. Its cards controlled the weaving pattern, an early form of programming.<br/>D. That has nothing to do with stored patterns.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đĩa cứng ra đời sau thẻ đục lỗ rất lâu.<br/>B. Đó là phát minh của thế hệ thứ tư.<br/>C. Thẻ của nó điều khiển mẫu dệt, một dạng lập trình sơ khai.<br/>D. Thiết bị đó không liên quan đến mẫu lưu sẵn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In the domain name lab.example.edu, what is edu?</p></div><div class=\"ml-vi\"><p>Trong tên miền lab.example.edu, edu là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A top-level domain|||Tên miền cấp cao nhất"
            },
            {
              "text": "A hostname of a single PC|||Tên của một máy tính cụ thể"
            },
            {
              "text": "A port number|||Một số cổng"
            },
            {
              "text": "A protocol|||Một giao thức"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It is the rightmost label in the name.<br/>B. The leftmost label usually names a host.<br/>C. Ports are numbers.<br/>D. Protocols such as https appear in a URL, not in the domain name.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Đó là nhãn ngoài cùng bên phải của tên.<br/>B. Nhãn bên trái thường mới là tên máy.<br/>C. Cổng là số.<br/>D. Giao thức như https nằm trong URL, không nằm trong tên miền.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which address is burned into a network card and used at the data-link layer?</p></div><div class=\"ml-vi\"><p>Địa chỉ nào gắn sẵn trong card mạng và dùng ở tầng liên kết dữ liệu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "IP address|||Địa chỉ IP"
            },
            {
              "text": "Email address|||Địa chỉ email"
            },
            {
              "text": "Port number|||Số cổng"
            },
            {
              "text": "MAC address|||Địa chỉ MAC"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. IP addresses belong to the network layer and can change.<br/>B. That belongs to the application layer.<br/>C. Port numbers belong to the transport layer.<br/>D. It is a 48-bit physical address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Địa chỉ IP thuộc tầng mạng và có thể đổi.<br/>B. Địa chỉ đó thuộc tầng ứng dụng.<br/>C. Số cổng thuộc tầng giao vận.<br/>D. Đây là địa chỉ vật lý 48 bit.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Up to which layer does a router normally process an IP packet passing through it?</p></div><div class=\"ml-vi\"><p>Router thường xử lý một gói IP đi qua nó tới tầng nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The network layer|||Tầng mạng"
            },
            {
              "text": "The physical layer only|||Chỉ tầng vật lý"
            },
            {
              "text": "The application layer|||Tầng ứng dụng"
            },
            {
              "text": "The transport layer|||Tầng giao vận"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It reads the IP header, chooses the next hop, and builds a new frame.<br/>B. That describes a repeater.<br/>C. Applications live on the end hosts.<br/>D. Ordinary routing does not read transport data.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó đọc phần đầu IP, chọn chặng kế và dựng khung mới.<br/>B. Đó là mô tả bộ lặp.<br/>C. Ứng dụng nằm trên máy đầu cuối.<br/>D. Định tuyến thông thường không đọc dữ liệu giao vận.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A system&#39;s quality report measures the mean time between failures. Which quality factor is that?</p></div><div class=\"ml-vi\"><p>Báo cáo chất lượng của một hệ thống đo thời gian trung bình giữa các lần hỏng. Đó là yếu tố chất lượng nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Portability|||Tính di động"
            },
            {
              "text": "Reliability|||Độ tin cậy"
            },
            {
              "text": "Readability|||Tính dễ đọc"
            },
            {
              "text": "Accuracy|||Độ chính xác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is about moving to another platform.<br/>B. It measures how often the system fails.<br/>C. That is about the code.<br/>D. That is about correct results.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là khả năng chuyển sang nền tảng khác.<br/>B. Nó đo tần suất hệ thống hỏng.<br/>C. Đó là đặc tính của mã.<br/>D. Đó là việc kết quả có đúng không.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Add the binary numbers 1011 and 0110.</p></div><div class=\"ml-vi\"><p>Cộng hai số nhị phân 1011 và 0110.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10011|||10011"
            },
            {
              "text": "1111|||1111"
            },
            {
              "text": "1121|||1121"
            },
            {
              "text": "10001|||10001"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That equals 19.<br/>B. That ignores the carries.<br/>C. A binary number cannot contain the digit 2.<br/>D. 11 + 6 = 17.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Số đó bằng 19.<br/>B. Cách đó bỏ qua số nhớ.<br/>C. Số nhị phân không có chữ số 2.<br/>D. 11 + 6 = 17.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which list gives the five TCP/IP layers from top to bottom?</p></div><div class=\"ml-vi\"><p>Danh sách nào cho năm tầng TCP/IP từ trên xuống dưới?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Physical, data-link, network, transport, application|||Vật lý, liên kết dữ liệu, mạng, giao vận, ứng dụng"
            },
            {
              "text": "Application, network, transport, physical, data-link|||Ứng dụng, mạng, giao vận, vật lý, liên kết dữ liệu"
            },
            {
              "text": "Application, transport, network, data-link, physical|||Ứng dụng, giao vận, mạng, liên kết dữ liệu, vật lý"
            },
            {
              "text": "Application, session, presentation, network, physical|||Ứng dụng, phiên, trình diễn, mạng, vật lý"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is bottom to top.<br/>B. Transport sits above network.<br/>C. Applications sit on top and physical signals at the bottom.<br/>D. Session and presentation are OSI layers, not TCP/IP layers.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là từ dưới lên.<br/>B. Giao vận nằm trên tầng mạng.<br/>C. Ứng dụng ở trên cùng và tín hiệu vật lý ở dưới cùng.<br/>D. Phiên và trình diễn là tầng OSI, không thuộc TCP/IP.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which common operating system has an open-source kernel that also powers most web servers?</p></div><div class=\"ml-vi\"><p>Hệ điều hành thông dụng nào có nhân mã nguồn mở và chạy phần lớn máy chủ web?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "MS-DOS|||MS-DOS"
            },
            {
              "text": "Windows|||Windows"
            },
            {
              "text": "Linux|||Linux"
            },
            {
              "text": "macOS|||macOS"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It is an old proprietary system.<br/>B. Its kernel is proprietary.<br/>C. Its kernel source is public and it dominates servers.<br/>D. It is mostly proprietary and not common on web servers.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây là hệ thống độc quyền đời cũ.<br/>B. Nhân của nó là độc quyền.<br/>C. Mã nguồn nhân của nó công khai và nó chiếm ưu thế ở máy chủ.<br/>D. Nó chủ yếu độc quyền và không phổ biến trên máy chủ web.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Module A calls module B and passes only the two numbers B needs. Module C reads a global variable that module D also writes. Which pair is more tightly coupled?</p></div><div class=\"ml-vi\"><p>Mô-đun A gọi mô-đun B và chỉ truyền hai số B cần. Mô-đun C đọc biến toàn cục mà mô-đun D cũng ghi. Cặp nào kết dính chặt hơn?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "C and D, because they depend on shared global data|||C và D, vì chúng phụ thuộc dữ liệu toàn cục dùng chung"
            },
            {
              "text": "A and B, because one calls the other|||A và B, vì mô-đun này gọi mô-đun kia"
            },
            {
              "text": "Both pairs are the same|||Hai cặp như nhau"
            },
            {
              "text": "Neither pair has any coupling|||Cả hai cặp đều không kết dính"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Shared data means a change in one can break the other silently.<br/>B. Passing only what is needed is the loosest useful link.<br/>C. Data coupling is weaker than global coupling.<br/>D. Both pairs depend on each other somehow.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Dữ liệu dùng chung nghĩa là sửa một bên có thể âm thầm làm hỏng bên kia.<br/>B. Chỉ truyền thứ cần thiết là mối nối lỏng nhất còn hữu ích.<br/>C. Kết dính qua tham số yếu hơn kết dính qua biến toàn cục.<br/>D. Cả hai cặp đều phụ thuộc nhau theo cách nào đó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does multiprogramming add to monoprogramming?</p></div><div class=\"ml-vi\"><p>Đa chương trình bổ sung gì so với đơn chương trình?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The CPU is removed from the system|||Bỏ CPU khỏi hệ thống"
            },
            {
              "text": "More than one program is in memory at a time|||Nhiều chương trình trong bộ nhớ cùng lúc"
            },
            {
              "text": "Programs no longer need memory|||Chương trình không còn cần bộ nhớ"
            },
            {
              "text": "Only one user may log in|||Chỉ một người được đăng nhập"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The CPU is still essential.<br/>B. The CPU switches among them.<br/>C. They still need memory.<br/>D. That is a separate idea.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. CPU vẫn là thiết yếu.<br/>B. CPU chuyển qua lại giữa chúng.<br/>C. Chúng vẫn cần bộ nhớ.<br/>D. Đó là ý khác.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Student IDs run from 1 to 1000 with no gaps, so ID n is stored at address n. Which hashing method is this?</p></div><div class=\"ml-vi\"><p>Mã sinh viên chạy từ 1 đến 1000 không có khoảng trống, nên mã n được lưu ở địa chỉ n. Đây là phương pháp băm nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Linear probing|||Dò tuyến tính"
            },
            {
              "text": "Sequential access|||Truy cập tuần tự"
            },
            {
              "text": "Modulo division hashing|||Băm chia lấy dư"
            },
            {
              "text": "Direct hashing|||Băm trực tiếp"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That resolves collisions.<br/>B. That reads records in order.<br/>C. That divides the key by the file size.<br/>D. The key itself is the address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là cách giải quyết đụng độ.<br/>B. Cách đó đọc bản ghi theo thứ tự.<br/>C. Cách đó chia khoá cho cỡ tệp.<br/>D. Chính khoá là địa chỉ.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
