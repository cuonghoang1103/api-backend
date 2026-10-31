// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-CSI106-TS-FE2.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "CSI106"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE2",
      "title": "CSI106 — Practice Final 2 (self-composed)|||CSI106 — Đề luyện cuối kỳ 2 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>In which phase does a team draw data flow diagrams for a procedure-oriented system?</p></div><div class=\"ml-vi\"><p>Nhóm vẽ sơ đồ luồng dữ liệu cho hệ thống hướng thủ tục ở pha nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Testing|||Kiểm thử"
            },
            {
              "text": "Maintenance|||Bảo trì"
            },
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Implementation|||Cài đặt"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Testing checks finished code.<br/>B. That follows delivery.<br/>C. The diagrams capture what the system must do.<br/>D. By then the code is being written.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Kiểm thử kiểm mã đã viết.<br/>B. Pha đó sau khi bàn giao.<br/>C. Sơ đồ ghi lại hệ thống phải làm gì.<br/>D. Lúc đó mã đang được viết.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Write binary 1110.1 in hexadecimal.</p></div><div class=\"ml-vi\"><p>Viết số nhị phân 1110.1 ở hệ thập lục phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "E.8|||E.8"
            },
            {
              "text": "E.1|||E.1"
            },
            {
              "text": "D.8|||D.8"
            },
            {
              "text": "14.1|||14.1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 1110 is E; the fraction 1 is padded to 1000, which is 8.<br/>B. The fraction must be padded on the right to four bits.<br/>C. D is 1101.<br/>D. 14 is the decimal value of the whole part.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 1110 là E; phần lẻ 1 được đệm thành 1000, tức 8.<br/>B. Phần lẻ phải được đệm bên phải cho đủ bốn bit.<br/>C. D là 1101.<br/>D. 14 là giá trị thập phân của phần nguyên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which OS component organises disk blocks into named files and folders and checks access rights?</p></div><div class=\"ml-vi\"><p>Thành phần nào của hệ điều hành tổ chức các khối đĩa thành tệp, thư mục có tên và kiểm tra quyền truy cập?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Process manager|||Bộ quản lý tiến trình"
            },
            {
              "text": "Device manager|||Bộ quản lý thiết bị"
            },
            {
              "text": "Compiler|||Trình biên dịch"
            },
            {
              "text": "File manager|||Bộ quản lý tệp"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It schedules running programs.<br/>B. It deals with hardware devices.<br/>C. A compiler is not part of the OS.<br/>D. It controls naming, storage and access for files.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Nó lập lịch các chương trình đang chạy.<br/>B. Nó làm việc với thiết bị phần cứng.<br/>C. Trình biên dịch không thuộc hệ điều hành.<br/>D. Nó lo đặt tên, lưu trữ và truy cập tệp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does the pseudocode below print?</p><pre><code class=\"language-plaintext\">count &lt;- 0\nfor each n in [8, 3, 12, 7, 20]:\n    if n &gt; 7:\n        count &lt;- count + 1\nprint count</code></pre></div><div class=\"ml-vi\"><p>Đoạn mã giả dưới đây in ra gì?</p><pre><code class=\"language-plaintext\">count &lt;- 0\nfor each n in [8, 3, 12, 7, 20]:\n    if n &gt; 7:\n        count &lt;- count + 1\nprint count</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "40|||40"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is how many items are not above 7.<br/>B. Only 8, 12 and 20 are greater than 7.<br/>C. That is the sum of items above 7.<br/>D. That is the total number of items.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là số phần tử không lớn hơn 7.<br/>B. Chỉ 8, 12 và 20 lớn hơn 7.<br/>C. Đó là tổng các phần tử lớn hơn 7.<br/>D. Đó là tổng số phần tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A user types ls in a terminal. Which part of the OS reads that command?</p></div><div class=\"ml-vi\"><p>Người dùng gõ ls trong terminal. Phần nào của hệ điều hành đọc lệnh đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The shell|||Shell"
            },
            {
              "text": "The device driver|||Driver thiết bị"
            },
            {
              "text": "The bootstrap program|||Chương trình mồi"
            },
            {
              "text": "The ALU|||ALU"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The shell is the user interface that interprets commands.<br/>B. A driver talks to hardware.<br/>C. It runs only at start-up.<br/>D. The ALU is CPU hardware.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Shell là giao diện người dùng, diễn giải các lệnh.<br/>B. Driver làm việc với phần cứng.<br/>C. Nó chỉ chạy lúc khởi động.<br/>D. ALU là phần cứng của CPU.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A list of 500 names is in random order. Which search method can you use?</p></div><div class=\"ml-vi\"><p>Một danh sách 500 tên ở thứ tự ngẫu nhiên. Bạn dùng được phương pháp tìm nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Modulo division|||Chia lấy dư"
            },
            {
              "text": "Masking|||Tạo mặt nạ"
            },
            {
              "text": "Binary search|||Tìm nhị phân"
            },
            {
              "text": "Sequential search|||Tìm tuần tự"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is a hashing method for placing keys.<br/>B. That is a bit operation.<br/>C. It needs a sorted list.<br/>D. It checks items one by one and needs no ordering.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là cách băm để đặt khoá.<br/>B. Đó là phép toán trên bit.<br/>C. Nó cần danh sách đã sắp.<br/>D. Nó xét từng phần tử, không cần sắp thứ tự.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How does paging divide a program and memory?</p></div><div class=\"ml-vi\"><p>Phân trang chia chương trình và bộ nhớ như thế nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Into one block per user|||Thành một khối cho mỗi người dùng"
            },
            {
              "text": "Into exactly two partitions|||Thành đúng hai phân vùng"
            },
            {
              "text": "Into equal-sized pages and frames, placed anywhere|||Thành các trang và khung bằng nhau, đặt ở đâu cũng được"
            },
            {
              "text": "Into logical parts such as code and data of different sizes|||Thành các phần logic như mã và dữ liệu với cỡ khác nhau"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Pages have nothing to do with users.<br/>B. Paging uses many small pages.<br/>C. Any page can go into any free frame.<br/>D. That is segmentation.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Trang không liên quan đến người dùng.<br/>B. Phân trang dùng nhiều trang nhỏ.<br/>C. Trang nào cũng vào được khung trống bất kỳ.<br/>D. Đó là phân đoạn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How is -5 stored in 8-bit one&#39;s complement?</p></div><div class=\"ml-vi\"><p>-5 được lưu thế nào ở dạng bù một 8 bit?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11111011|||11111011"
            },
            {
              "text": "11111010|||11111010"
            },
            {
              "text": "10000101|||10000101"
            },
            {
              "text": "00000101|||00000101"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is two&#39;s complement.<br/>B. +5 is 00000101, and every bit is flipped.<br/>C. That is sign-and-magnitude.<br/>D. That is +5.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là bù hai.<br/>B. +5 là 00000101, và lật mọi bit.<br/>C. Đó là dấu-độ lớn.<br/>D. Đó là +5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which paradigm treats a program as evaluating functions and avoids changing state?</p></div><div class=\"ml-vi\"><p>Mô thức nào coi chương trình là việc tính giá trị các hàm và tránh thay đổi trạng thái?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Functional|||Hàm (functional)"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            },
            {
              "text": "Procedural|||Thủ tục"
            },
            {
              "text": "Logic|||Logic"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Lisp and Haskell follow this style.<br/>B. Objects usually hold changing state.<br/>C. Procedural code changes variables step by step.<br/>D. Logic programs use facts and rules.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Lisp và Haskell đi theo phong cách này.<br/>B. Đối tượng thường giữ trạng thái thay đổi.<br/>C. Mã thủ tục đổi biến từng bước.<br/>D. Chương trình logic dùng sự kiện và luật.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>You log in to your bank&#39;s site. Which protocol protects the page and your password in transit?</p></div><div class=\"ml-vi\"><p>Bạn đăng nhập trang ngân hàng. Giao thức nào bảo vệ trang và mật khẩu khi truyền đi?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "HTTPS|||HTTPS"
            },
            {
              "text": "DNS|||DNS"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. FTP transfers files, usually without encryption.<br/>B. HTTPS is HTTP over an encrypted channel.<br/>C. DNS only looks up names.<br/>D. Plain HTTP sends data unencrypted.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. FTP truyền tệp, thường không mã hoá.<br/>B. HTTPS là HTTP chạy trên kênh mã hoá.<br/>C. DNS chỉ tra tên.<br/>D. HTTP thường gửi dữ liệu không mã hoá.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A car&#39;s airbag controller must finish its task within a strict deadline. Which kind of OS is needed?</p></div><div class=\"ml-vi\"><p>Bộ điều khiển túi khí ô tô phải xong việc trong thời hạn nghiêm ngặt. Cần loại hệ điều hành nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Time-sharing|||Chia thời gian"
            },
            {
              "text": "Distributed|||Phân tán"
            },
            {
              "text": "Batch|||Theo lô"
            },
            {
              "text": "Real-time|||Thời gian thực"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That aims at fair sharing, not hard deadlines.<br/>B. That spreads work over many machines.<br/>C. Batch jobs run when their turn comes.<br/>D. Tasks must finish within a guaranteed time.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Kiểu đó nhắm tới chia đều, không phải hạn chót cứng.<br/>B. Kiểu đó trải việc trên nhiều máy.<br/>C. Công việc theo lô chạy khi tới lượt.<br/>D. Công việc phải xong trong thời gian được bảo đảm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which integer representation has only one pattern for zero?</p></div><div class=\"ml-vi\"><p>Cách biểu diễn số nguyên nào chỉ có một mẫu cho số 0?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "All of them have two zeros|||Tất cả đều có hai số 0"
            },
            {
              "text": "One&#39;s complement|||Bù một"
            },
            {
              "text": "Two&#39;s complement|||Bù hai"
            },
            {
              "text": "Sign-and-magnitude|||Dấu-độ lớn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Two&#39;s complement has only one.<br/>B. It has +0 and -0.<br/>C. Negating 0 gives 0 again, so there is no negative zero.<br/>D. It has +0 and -0.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Bù hai chỉ có một.<br/>B. Nó có +0 và -0.<br/>C. Đổi dấu 0 vẫn ra 0 nên không có số 0 âm.<br/>D. Nó có +0 và -0.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>The values 8, 3, 10, 1, 6 are inserted in that order into an empty binary search tree. What does an inorder traversal visit?</p></div><div class=\"ml-vi\"><p>Các giá trị 8, 3, 10, 1, 6 được chèn theo thứ tự đó vào cây nhị phân tìm kiếm rỗng. Duyệt inorder đi qua thứ tự nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8, 3, 10, 1, 6|||8, 3, 10, 1, 6"
            },
            {
              "text": "1, 3, 6, 8, 10|||1, 3, 6, 8, 10"
            },
            {
              "text": "8, 3, 1, 6, 10|||8, 3, 1, 6, 10"
            },
            {
              "text": "1, 6, 3, 10, 8|||1, 6, 3, 10, 8"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is level order.<br/>B. Inorder on a BST gives ascending order.<br/>C. That is preorder.<br/>D. That is postorder.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là duyệt theo mức.<br/>B. Duyệt inorder trên BST cho thứ tự tăng dần.<br/>C. Đó là preorder.<br/>D. Đó là postorder.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What are the three phases of the CPU&#39;s machine cycle?</p></div><div class=\"ml-vi\"><p>Ba pha của chu kỳ máy trong CPU là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Input, process, output|||Vào, xử lý, ra"
            },
            {
              "text": "Compile, link, load|||Biên dịch, liên kết, nạp"
            },
            {
              "text": "Fetch, decode, execute|||Lấy lệnh, giải mã, thực thi"
            },
            {
              "text": "Read, write, erase|||Đọc, ghi, xoá"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That describes a computer as a whole.<br/>B. Those are steps in building a program.<br/>C. The CPU repeats these for every instruction.<br/>D. Those are storage operations.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là mô tả cả máy tính.<br/>B. Đó là các bước dựng chương trình.<br/>C. CPU lặp lại ba pha này cho từng lệnh.<br/>D. Đó là thao tác lưu trữ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the main weakness of the waterfall model?</p></div><div class=\"ml-vi\"><p>Điểm yếu chính của mô hình thác nước là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It has no design phase at all|||Nó hoàn toàn không có pha thiết kế"
            },
            {
              "text": "It runs testing before any coding|||Nó kiểm thử trước khi viết bất kỳ mã nào"
            },
            {
              "text": "It releases a new version each day|||Nó phát hành bản mới mỗi ngày"
            },
            {
              "text": "A late error may force a return to earlier phases|||Lỗi muộn có thể buộc phải quay lại các pha trước"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It does have one.<br/>B. Testing comes after implementation.<br/>C. It delivers once, at the end.<br/>D. Each phase is meant to finish before the next starts.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Nó có pha thiết kế.<br/>B. Kiểm thử đến sau cài đặt.<br/>C. Nó bàn giao một lần ở cuối.<br/>D. Mỗi pha phải xong trước khi pha sau bắt đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Convert decimal 45 to binary.</p></div><div class=\"ml-vi\"><p>Đổi số thập phân 45 sang nhị phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "101101|||101101"
            },
            {
              "text": "101011|||101011"
            },
            {
              "text": "110101|||110101"
            },
            {
              "text": "100101|||100101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 45 = 32 + 8 + 4 + 1.<br/>B. That equals 43.<br/>C. That equals 53.<br/>D. That equals 37.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 45 = 32 + 8 + 4 + 1.<br/>B. Số đó bằng 43.<br/>C. Số đó bằng 53.<br/>D. Số đó bằng 37.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does a digital signature mainly give the receiver?</p></div><div class=\"ml-vi\"><p>Chữ ký số chủ yếu mang lại gì cho bên nhận?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A free software licence|||Một giấy phép phần mềm miễn phí"
            },
            {
              "text": "Proof of the signer and of an unchanged message|||Bằng chứng về người ký và thông điệp không bị sửa"
            },
            {
              "text": "Compression of the message body|||Nén phần thân thông điệp"
            },
            {
              "text": "Faster network speed for the message|||Tốc độ mạng nhanh hơn cho thông điệp"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. This has nothing to do with licences.<br/>B. It supports integrity and non-repudiation.<br/>C. It does not shrink the message.<br/>D. Signing adds work.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Điều này không liên quan giấy phép.<br/>B. Nó hỗ trợ tính toàn vẹn và chống chối bỏ.<br/>C. Nó không làm thông điệp nhỏ đi.<br/>D. Ký số còn thêm việc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Class Car reuses everything in class Vehicle and adds only what is new. Which OOP idea is this?</p></div><div class=\"ml-vi\"><p>Lớp Car dùng lại mọi thứ của lớp Vehicle và chỉ thêm phần mới. Đây là ý tưởng OOP nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Recursion|||Đệ quy"
            },
            {
              "text": "Encapsulation|||Đóng gói"
            },
            {
              "text": "Inheritance|||Kế thừa"
            },
            {
              "text": "Compilation|||Biên dịch"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a function calling itself.<br/>B. That hides data inside an object.<br/>C. A subclass takes on the members of its superclass.<br/>D. That is a translation step.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là hàm tự gọi lại chính nó.<br/>B. Đóng gói là giấu dữ liệu trong đối tượng.<br/>C. Lớp con nhận các thành phần của lớp cha.<br/>D. Đó là một bước dịch.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Why does pipelining increase the number of instructions finished per second, even though one instruction is not faster?</p></div><div class=\"ml-vi\"><p>Vì sao pipeline tăng số lệnh hoàn thành mỗi giây dù từng lệnh không nhanh hơn?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Phases of different instructions overlap in time|||Các pha của nhiều lệnh chồng lên nhau theo thời gian"
            },
            {
              "text": "It makes every program shorter|||Nó làm mọi chương trình ngắn hơn"
            },
            {
              "text": "It raises the amount of RAM in use|||Nó tăng dung lượng RAM đang dùng"
            },
            {
              "text": "It removes the decode phase entirely|||Nó bỏ hẳn pha giải mã"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. One instruction can be fetched while another executes, like an assembly line.<br/>B. Programs stay the same size.<br/>C. Pipelining is about the CPU&#39;s cycle.<br/>D. All the phases still exist.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Lệnh này được lấy trong khi lệnh kia thực thi, như dây chuyền.<br/>B. Kích thước chương trình không đổi.<br/>C. Pipeline liên quan đến chu kỳ CPU.<br/>D. Mọi pha vẫn còn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A logo must stay sharp at any size, from a business card to a banner. Which image representation fits?</p></div><div class=\"ml-vi\"><p>Một logo phải luôn sắc nét ở mọi cỡ, từ danh thiếp đến băng rôn. Cách biểu diễn ảnh nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ASCII text|||Văn bản ASCII"
            },
            {
              "text": "A low-resolution bitmap|||Ảnh bitmap độ phân giải thấp"
            },
            {
              "text": "Audio sampling|||Lấy mẫu âm thanh"
            },
            {
              "text": "Vector graphics|||Đồ hoạ vector"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That stores characters.<br/>B. Bitmaps go blocky when enlarged.<br/>C. That stores sound.<br/>D. Shapes are stored as formulas and redrawn at each size.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là cách lưu ký tự.<br/>B. Bitmap bị vỡ khi phóng to.<br/>C. Đó là cách lưu âm thanh.<br/>D. Hình được lưu bằng công thức và vẽ lại ở mỗi cỡ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A low-priority process keeps being passed over because higher-priority work always arrives first. What is this called?</p></div><div class=\"ml-vi\"><p>Một tiến trình ưu tiên thấp cứ bị bỏ qua vì việc ưu tiên cao luôn đến trước. Hiện tượng này gọi là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Masking|||Tạo mặt nạ"
            },
            {
              "text": "Booting|||Khởi động"
            },
            {
              "text": "Deadlock|||Bế tắc"
            },
            {
              "text": "Starvation|||Đói tài nguyên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Masking is a bit operation.<br/>B. Booting is starting the OS.<br/>C. In deadlock, the processes involved all stop.<br/>D. The system keeps working, but this process never gets a turn.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Tạo mặt nạ là phép toán trên bit.<br/>B. Khởi động là việc nạp hệ điều hành.<br/>C. Trong bế tắc, mọi tiến trình liên quan đều dừng.<br/>D. Hệ thống vẫn chạy nhưng tiến trình này không tới lượt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does this SQL statement return?</p><pre><code class=\"language-sql\"><span class=\"hljs-keyword\">SELECT</span> name <span class=\"hljs-keyword\">FROM</span> Student <span class=\"hljs-keyword\">WHERE</span> gpa <span class=\"hljs-operator\">&gt;</span> <span class=\"hljs-number\">3.5</span>;</code></pre></div><div class=\"ml-vi\"><p>Câu lệnh SQL này trả về gì?</p><pre><code class=\"language-sql\"><span class=\"hljs-keyword\">SELECT</span> name <span class=\"hljs-keyword\">FROM</span> Student <span class=\"hljs-keyword\">WHERE</span> gpa <span class=\"hljs-operator\">&gt;</span> <span class=\"hljs-number\">3.5</span>;</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "All columns of every student|||Mọi cột của mọi sinh viên"
            },
            {
              "text": "The names of students with a GPA above 3.5|||Tên của các sinh viên có GPA trên 3.5"
            },
            {
              "text": "It deletes students with a low GPA|||Nó xoá sinh viên có GPA thấp"
            },
            {
              "text": "The GPA of a student called name|||GPA của sinh viên tên là name"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Only name is selected, and rows are filtered.<br/>B. SELECT picks the column and WHERE filters the rows.<br/>C. SELECT never changes data.<br/>D. name is a column here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Chỉ chọn cột name và có lọc hàng.<br/>B. SELECT chọn cột và WHERE lọc hàng.<br/>C. SELECT không thay đổi dữ liệu.<br/>D. name ở đây là tên cột.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is 10011010 after one logical right shift?</p></div><div class=\"ml-vi\"><p>10011010 sau một lần dịch phải logic là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "01001101|||01001101"
            },
            {
              "text": "01100101|||01100101"
            },
            {
              "text": "00110100|||00110100"
            },
            {
              "text": "11001101|||11001101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. All bits move right and a 0 enters on the left.<br/>B. That inverts the bits.<br/>C. That is a left shift.<br/>D. That is an arithmetic shift, which repeats the sign bit.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mọi bit dịch phải và số 0 đi vào bên trái.<br/>B. Cách đó đảo bit.<br/>C. Đó là dịch trái.<br/>D. Đó là dịch số học, lặp lại bit dấu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does virtual memory let you do?</p></div><div class=\"ml-vi\"><p>Bộ nhớ ảo cho phép làm gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Make the CPU clock run faster|||Làm xung nhịp CPU nhanh hơn"
            },
            {
              "text": "Store files after power is lost|||Lưu tệp sau khi mất điện"
            },
            {
              "text": "Run programs larger than physical RAM|||Chạy các chương trình lớn hơn RAM thật"
            },
            {
              "text": "Replace the operating system|||Thay thế hệ điều hành"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It affects memory, not clock speed.<br/>B. That is what disks do by themselves.<br/>C. The disk acts as extra space, and part of each program stays there until needed.<br/>D. It is a feature of the OS.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Nó tác động đến bộ nhớ, không phải xung nhịp.<br/>B. Đĩa tự làm được điều đó.<br/>C. Đĩa làm chỗ thêm, một phần mỗi chương trình nằm ở đó tới khi cần.<br/>D. Nó là một tính năng của hệ điều hành.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A delivery app models cities and the roads between them, with some cities linked to many others. Which structure fits?</p></div><div class=\"ml-vi\"><p>Ứng dụng giao hàng mô hình hoá các thành phố và đường nối, có thành phố nối với nhiều thành phố khác. Cấu trúc nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Stack|||Ngăn xếp"
            },
            {
              "text": "Graph|||Đồ thị"
            },
            {
              "text": "Record|||Bản ghi"
            },
            {
              "text": "Queue|||Hàng đợi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A stack has only one open end.<br/>B. Nodes are cities and edges are roads, with no hierarchy.<br/>C. A record groups fields of one item.<br/>D. A queue is a single line.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Ngăn xếp chỉ có một đầu mở.<br/>B. Nút là thành phố, cạnh là đường, không có phân cấp.<br/>C. Bản ghi gom các trường của một mục.<br/>D. Hàng đợi là một hàng duy nhất.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A student plugs a keyboard, a flash drive and a phone into one computer while it is running. Which controller standard makes this normal?</p></div><div class=\"ml-vi\"><p>Sinh viên cắm bàn phím, ổ flash và điện thoại vào máy tính khi máy đang chạy. Chuẩn bộ điều khiển nào làm việc này thành bình thường?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "USB|||USB"
            },
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "DRAM|||DRAM"
            },
            {
              "text": "SCSI|||SCSI"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. USB is a serial standard that supports hot-plugging and many device types.<br/>B. The ALU is inside the CPU.<br/>C. DRAM is memory, not a controller.<br/>D. SCSI is a parallel interface used mainly for disks.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. USB là chuẩn nối tiếp hỗ trợ cắm nóng và nhiều loại thiết bị.<br/>B. ALU nằm trong CPU.<br/>C. DRAM là bộ nhớ, không phải bộ điều khiển.<br/>D. SCSI là giao diện song song, chủ yếu dùng cho đĩa.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A router forwards data between networks by reading which address?</p></div><div class=\"ml-vi\"><p>Router chuyển dữ liệu giữa các mạng bằng cách đọc địa chỉ nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The port number|||Số cổng"
            },
            {
              "text": "The user&#39;s email address|||Địa chỉ email của người dùng"
            },
            {
              "text": "The destination IP address|||Địa chỉ IP đích"
            },
            {
              "text": "The file name|||Tên tệp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Ports matter to hosts, not to routing.<br/>B. Mail addresses belong to the application layer.<br/>C. Routers work at the network layer.<br/>D. File names mean nothing to a router.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Cổng có ý nghĩa với máy, không dùng để định tuyến.<br/>B. Địa chỉ thư thuộc tầng ứng dụng.<br/>C. Router làm việc ở tầng mạng.<br/>D. Router không hiểu tên tệp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>During design of a procedure-oriented system, which chart shows how modules call each other?</p></div><div class=\"ml-vi\"><p>Khi thiết kế hệ thống hướng thủ tục, biểu đồ nào cho thấy các mô-đun gọi nhau ra sao?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ER diagram|||Sơ đồ ER"
            },
            {
              "text": "Use case diagram|||Biểu đồ use case"
            },
            {
              "text": "Truth table|||Bảng chân trị"
            },
            {
              "text": "Structure chart|||Biểu đồ cấu trúc"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is for database design.<br/>B. That is an object-oriented analysis tool.<br/>C. That is for logic operations.<br/>D. It shows the module hierarchy.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là công cụ thiết kế cơ sở dữ liệu.<br/>B. Đó là công cụ phân tích hướng đối tượng.<br/>C. Đó là công cụ cho phép toán logic.<br/>D. Nó thể hiện cây phân cấp mô-đun.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>An attacker intercepts a grade report and changes a 5 into a 9 before it arrives. Which goal is broken?</p></div><div class=\"ml-vi\"><p>Kẻ tấn công chặn bảng điểm và đổi số 5 thành 9 trước khi nó tới nơi. Mục tiêu nào bị phá?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Scalability|||Khả năng mở rộng"
            },
            {
              "text": "Integrity|||Tính toàn vẹn"
            },
            {
              "text": "Availability|||Tính sẵn sàng"
            },
            {
              "text": "Confidentiality|||Tính bí mật"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is not a security goal.<br/>B. Data was changed without permission.<br/>C. The report still arrived.<br/>D. The main harm here is the change, not the reading.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó không phải mục tiêu an toàn.<br/>B. Dữ liệu bị sửa trái phép.<br/>C. Bảng điểm vẫn tới nơi.<br/>D. Thiệt hại chính ở đây là việc sửa, không phải việc đọc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>During a video call, a lost packet is better skipped than resent, because late sound is useless. Which transport protocol suits this?</p></div><div class=\"ml-vi\"><p>Trong cuộc gọi video, gói bị mất nên bỏ qua hơn là gửi lại, vì âm thanh đến trễ là vô ích. Giao thức giao vận nào hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "DNS|||DNS"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "TCP|||TCP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. SMTP is an email protocol.<br/>B. DNS looks up names.<br/>C. UDP sends without connection setup or retransmission.<br/>D. TCP would stall to resend lost data.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. SMTP là giao thức thư.<br/>B. DNS tra tên.<br/>C. UDP gửi không cần thiết lập kết nối và không gửi lại.<br/>D. TCP sẽ dừng lại để gửi lại phần mất.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>An email that looks like it comes from your school asks you to confirm your password on a fake page. What is this?</p></div><div class=\"ml-vi\"><p>Một email trông như từ trường yêu cầu bạn xác nhận mật khẩu trên một trang giả. Đây là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Normalisation|||Chuẩn hoá"
            },
            {
              "text": "Snooping|||Nghe lén"
            },
            {
              "text": "Phishing|||Lừa đảo (phishing)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That floods a service.<br/>B. That is a database term.<br/>C. Snooping reads data in transit without any contact with the victim.<br/>D. It tricks a person into giving away secrets.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Kiểu đó làm ngập dịch vụ.<br/>B. Đó là thuật ngữ cơ sở dữ liệu.<br/>C. Nghe lén đọc dữ liệu trên đường truyền, không tiếp xúc nạn nhân.<br/>D. Nó lừa người dùng tiết lộ bí mật.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How many hexadecimal digits are needed to write a 32-bit value in full?</p></div><div class=\"ml-vi\"><p>Cần bao nhiêu chữ số thập lục phân để viết đầy đủ một giá trị 32 bit?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Each hex digit stands for 4 bits.<br/>B. That is the count of bits.<br/>C. That covers only 16 bits.<br/>D. That would be 64 bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mỗi chữ số hex ứng với 4 bit.<br/>B. Đó là số bit.<br/>C. Số đó chỉ phủ 16 bit.<br/>D. Số đó ứng với 64 bit.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A column Phones holds values like &quot;0901; 0912&quot; for one student. Which normal form does this break?</p></div><div class=\"ml-vi\"><p>Cột Phones chứa giá trị kiểu &quot;0901; 0912&quot; cho một sinh viên. Việc này vi phạm dạng chuẩn nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Second normal form|||Dạng chuẩn 2"
            },
            {
              "text": "Third normal form|||Dạng chuẩn 3"
            },
            {
              "text": "Boyce-Codd normal form|||Dạng chuẩn Boyce-Codd"
            },
            {
              "text": "First normal form|||Dạng chuẩn 1"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. 2NF deals with partial dependency on a key.<br/>B. 3NF deals with transitive dependency.<br/>C. BCNF is a stricter form of 3NF and is not the first one broken here.<br/>D. 1NF needs one atomic value in each cell.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Dạng chuẩn 2 xử lý phụ thuộc bộ phận vào khoá.<br/>B. Dạng chuẩn 3 xử lý phụ thuộc bắc cầu.<br/>C. BCNF là dạng chặt hơn của 3NF, không phải dạng bị vi phạm đầu tiên ở đây.<br/>D. Dạng chuẩn 1 yêu cầu mỗi ô một giá trị nguyên tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In monoprogramming, what limits the system?</p></div><div class=\"ml-vi\"><p>Trong đơn chương trình, điều gì giới hạn hệ thống?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Each process lives on a different machine|||Mỗi tiến trình ở một máy khác nhau"
            },
            {
              "text": "Only one program is in memory, and it must fit entirely|||Chỉ một chương trình trong bộ nhớ và phải vừa trọn"
            },
            {
              "text": "All programs share the CPU in slices|||Mọi chương trình chia CPU theo lát thời gian"
            },
            {
              "text": "Programs must be split into equal pages|||Chương trình phải chia thành các trang bằng nhau"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That describes a distributed system.<br/>B. The rest of memory holds the OS, and nothing else can run alongside it.<br/>C. That is time-sharing.<br/>D. That is paging.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là mô tả hệ phân tán.<br/>B. Phần còn lại là hệ điều hành, không gì khác chạy cùng được.<br/>C. Đó là chia thời gian.<br/>D. Đó là phân trang.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>On the way down the TCP/IP stack, what names does the data take in turn, starting at the application layer?</p></div><div class=\"ml-vi\"><p>Trên đường đi xuống chồng TCP/IP, dữ liệu lần lượt mang những tên nào, bắt đầu từ tầng ứng dụng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Message, frame, segment, datagram|||Thông điệp, frame, segment, datagram"
            },
            {
              "text": "Segment, message, frame, datagram|||Segment, thông điệp, frame, datagram"
            },
            {
              "text": "Message, segment, datagram, frame|||Thông điệp, segment, datagram, frame"
            },
            {
              "text": "Frame, datagram, segment, message|||Frame, datagram, segment, thông điệp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. The frame is made last, at the data-link layer.<br/>B. The application produces the message first.<br/>C. Each layer wraps what it gets from above and gives it a new name.<br/>D. That is the order on the way up at the receiver.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Frame được tạo sau cùng, ở tầng liên kết dữ liệu.<br/>B. Tầng ứng dụng tạo ra thông điệp trước tiên.<br/>C. Mỗi tầng bọc phần nhận từ trên và đặt tên mới.<br/>D. Đó là thứ tự đi lên ở bên nhận.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In https://campus.example.edu/lab/index.html, which part names the host?</p></div><div class=\"ml-vi\"><p>Trong https://campus.example.edu/lab/index.html, phần nào là tên máy chủ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "campus.example.edu|||campus.example.edu"
            },
            {
              "text": "/lab/index.html|||/lab/index.html"
            },
            {
              "text": "https|||https"
            },
            {
              "text": "index.html|||index.html"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It follows the protocol and comes before the path.<br/>B. That is the path.<br/>C. That is the protocol.<br/>D. That is the file name.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Phần này đứng sau giao thức và trước đường dẫn.<br/>B. Đó là đường dẫn.<br/>C. Đó là giao thức.<br/>D. Đó là tên tệp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How long is an IPv4 address?</p></div><div class=\"ml-vi\"><p>Địa chỉ IPv4 dài bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "16 bits|||16 bit"
            },
            {
              "text": "48 bits|||48 bit"
            },
            {
              "text": "128 bits|||128 bit"
            },
            {
              "text": "32 bits|||32 bit"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is the size of a port number.<br/>B. That is the size of a MAC address.<br/>C. That is IPv6.<br/>D. It is usually written as four decimal numbers.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là độ dài số cổng.<br/>B. Đó là độ dài địa chỉ MAC.<br/>C. Đó là IPv6.<br/>D. Thường được viết thành bốn số thập phân.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A signed value 10011000 is shifted right by one using an arithmetic shift. What is the result?</p></div><div class=\"ml-vi\"><p>Giá trị có dấu 10011000 được dịch phải một bit bằng dịch số học. Kết quả là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "00110000|||00110000"
            },
            {
              "text": "01001100|||01001100"
            },
            {
              "text": "11001100|||11001100"
            },
            {
              "text": "10001100|||10001100"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a left shift.<br/>B. That is a logical shift, which loses the sign.<br/>C. The sign bit is copied so the number stays negative.<br/>D. All the bits must move.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là dịch trái.<br/>B. Đó là dịch logic, làm mất dấu.<br/>C. Bit dấu được sao chép nên số vẫn âm.<br/>D. Mọi bit phải dịch chuyển.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A shop groups its customers into segments without any labels, based only on how they buy. Which kind of learning is this?</p></div><div class=\"ml-vi\"><p>Một cửa hàng chia khách thành các nhóm mà không có nhãn nào, chỉ dựa trên cách họ mua. Đây là kiểu học nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Compilation|||Biên dịch"
            },
            {
              "text": "Unsupervised learning|||Học không giám sát"
            },
            {
              "text": "Reinforcement learning|||Học tăng cường"
            },
            {
              "text": "Supervised learning|||Học có giám sát"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is not machine learning.<br/>B. It finds structure in unlabelled data.<br/>C. That learns from rewards.<br/>D. That needs labelled examples.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó không phải học máy.<br/>B. Nó tìm cấu trúc trong dữ liệu không nhãn.<br/>C. Kiểu đó học từ phần thưởng.<br/>D. Kiểu đó cần ví dụ có nhãn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>One pass of bubble sort, moving left to right and swapping neighbours out of order, is run on [5, 1, 4, 2]. What is the result?</p></div><div class=\"ml-vi\"><p>Một lượt sắp xếp nổi bọt, đi từ trái sang phải và đổi hai phần tử kề nhau bị sai thứ tự, chạy trên [5, 1, 4, 2]. Kết quả là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "[1, 4, 2, 5]|||[1, 4, 2, 5]"
            },
            {
              "text": "[1, 2, 4, 5]|||[1, 2, 4, 5]"
            },
            {
              "text": "[1, 5, 4, 2]|||[1, 5, 4, 2]"
            },
            {
              "text": "[2, 4, 1, 5]|||[2, 4, 1, 5]"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 5 keeps swapping to the right until it reaches the end.<br/>B. That is the fully sorted list, which needs more passes.<br/>C. That stops after the first swap.<br/>D. This reverses the whole list.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 5 cứ đổi sang phải tới cuối dãy.<br/>B. Đó là danh sách đã sắp xong, cần thêm vài lượt.<br/>C. Cách đó dừng sau lần đổi đầu tiên.<br/>D. Cách đó đảo ngược cả danh sách.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which task is cheaper on a linked list than on an array?</p></div><div class=\"ml-vi\"><p>Việc nào trên danh sách liên kết rẻ hơn trên mảng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Binary search|||Tìm nhị phân"
            },
            {
              "text": "Reading the item at index 500|||Đọc phần tử ở chỉ số 500"
            },
            {
              "text": "Finding the size of each element|||Tìm kích thước mỗi phần tử"
            },
            {
              "text": "Inserting a new item at a known position|||Chèn phần tử mới tại vị trí đã biết"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That needs fast index access.<br/>B. An array does that instantly.<br/>C. This does not depend on the structure.<br/>D. Only pointers change, with no shifting of elements.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Việc đó cần truy cập chỉ số nhanh.<br/>B. Mảng làm được việc đó ngay lập tức.<br/>C. Việc này không phụ thuộc cấu trúc.<br/>D. Chỉ đổi con trỏ, không phải dịch phần tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In the decimal number 2537, what is the place value of the digit 5?</p></div><div class=\"ml-vi\"><p>Trong số thập phân 2537, chữ số 5 có giá trị theo vị trí là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "5000|||5000"
            },
            {
              "text": "500|||500"
            },
            {
              "text": "50|||50"
            },
            {
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the thousands position.<br/>B. It stands in the hundreds position: 5 x 10^2.<br/>C. That is the tens position.<br/>D. That ignores its position.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là hàng nghìn.<br/>B. Nó ở hàng trăm: 5 x 10^2.<br/>C. Đó là hàng chục.<br/>D. Cách đó bỏ qua vị trí.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which of these is NOT one of the four conditions needed for deadlock?</p></div><div class=\"ml-vi\"><p>Điều nào dưới đây KHÔNG thuộc bốn điều kiện cần cho bế tắc?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Mutual exclusion|||Loại trừ tương hỗ"
            },
            {
              "text": "Hold and wait|||Giữ và chờ"
            },
            {
              "text": "Round-robin scheduling|||Lập lịch xoay vòng"
            },
            {
              "text": "Circular wait|||Chờ vòng tròn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This is one of the four.<br/>B. This is one of the four.<br/>C. It is a way to share the CPU, not a deadlock condition.<br/>D. This is one of the four.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây là một trong bốn điều kiện.<br/>B. Đây là một trong bốn điều kiện.<br/>C. Đây là cách chia CPU, không phải điều kiện bế tắc.<br/>D. Đây là một trong bốn điều kiện.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In ASCII, the letter A is 1000001. What is the code for D?</p></div><div class=\"ml-vi\"><p>Trong ASCII, chữ A là 1000001. Mã của chữ D là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1000100|||1000100"
            },
            {
              "text": "1000011|||1000011"
            },
            {
              "text": "1000101|||1000101"
            },
            {
              "text": "1100100|||1100100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. D is three letters after A: 65 + 3 = 68.<br/>B. That is C.<br/>C. That is E.<br/>D. That is lowercase d.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. D sau A ba chữ: 65 + 3 = 68.<br/>B. Đó là C.<br/>C. Đó là E.<br/>D. Đó là chữ d thường.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Bob wants to send Alice a secret using an asymmetric cipher. Which key does he encrypt with?</p></div><div class=\"ml-vi\"><p>Bob muốn gửi bí mật cho Alice bằng mã bất đối xứng. Bob mã hoá bằng khoá nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Bob&#39;s public key|||Khoá công khai của Bob"
            },
            {
              "text": "Alice&#39;s public key|||Khoá công khai của Alice"
            },
            {
              "text": "Alice&#39;s private key|||Khoá riêng của Alice"
            },
            {
              "text": "A key shared in the email subject|||Một khoá ghi ở tiêu đề email"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Only Bob could decrypt that.<br/>B. Only Alice&#39;s private key can then decrypt it.<br/>C. Bob does not have it, and nobody else should.<br/>D. That would expose the secret.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Khi đó chỉ Bob giải được.<br/>B. Khi đó chỉ khoá riêng của Alice giải được.<br/>C. Bob không có khoá này và không ai khác được có.<br/>D. Như vậy là lộ bí mật.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the key idea of a RISC design compared with CISC?</p></div><div class=\"ml-vi\"><p>Ý tưởng chính của thiết kế RISC so với CISC là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Many CPUs working on one data stream|||Nhiều CPU làm trên một luồng dữ liệu"
            },
            {
              "text": "Separate memories for program and data|||Bộ nhớ riêng cho chương trình và dữ liệu"
            },
            {
              "text": "A large set of complex instructions|||Tập lệnh lớn gồm các lệnh phức tạp"
            },
            {
              "text": "A small set of simple instructions, each running quickly|||Tập lệnh nhỏ gồm các lệnh đơn giản, mỗi lệnh chạy nhanh"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That describes a parallel organisation.<br/>B. That is the Harvard architecture.<br/>C. That is CISC.<br/>D. Complex work is built from several simple instructions.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là mô tả tổ chức song song.<br/>B. Đó là kiến trúc Harvard.<br/>C. Đó là CISC.<br/>D. Việc phức tạp được dựng từ vài lệnh đơn giản.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A process is waiting for a disk read, and the read finishes. Which state does the process enter next?</p></div><div class=\"ml-vi\"><p>Một tiến trình đang chờ đọc đĩa và việc đọc hoàn tất. Tiến trình chuyển sang trạng thái nào tiếp theo?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Ready|||Sẵn sàng (Ready)"
            },
            {
              "text": "Hold|||Hold"
            },
            {
              "text": "Running|||Đang chạy (Running)"
            },
            {
              "text": "Terminated|||Kết thúc (Terminated)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It must queue for the CPU, which may be busy with another process.<br/>B. Hold is before the job is loaded into memory.<br/>C. Waiting never goes straight to Running.<br/>D. The process still has work to do.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó phải xếp hàng chờ CPU, vì CPU có thể đang bận với tiến trình khác.<br/>B. Hold là trước khi công việc được nạp vào bộ nhớ.<br/>C. Từ Waiting không đi thẳng sang Running.<br/>D. Tiến trình vẫn còn việc phải làm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which set contains only guided (wired) transmission media?</p></div><div class=\"ml-vi\"><p>Tập nào chỉ gồm môi trường truyền có hướng (có dây)?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Radio, microwave, infrared|||Sóng vô tuyến, vi ba, hồng ngoại"
            },
            {
              "text": "Coaxial cable, Wi-Fi, Bluetooth|||Cáp đồng trục, Wi-Fi, Bluetooth"
            },
            {
              "text": "Twisted pair, coaxial cable, optical fiber|||Cáp xoắn đôi, cáp đồng trục, cáp quang"
            },
            {
              "text": "Optical fiber, radio, satellite|||Cáp quang, sóng vô tuyến, vệ tinh"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. These are all unguided.<br/>B. Wi-Fi and Bluetooth are unguided.<br/>C. All three guide the signal along a physical path.<br/>D. Radio and satellite are unguided.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây đều là truyền không dẫn hướng.<br/>B. Wi-Fi và Bluetooth không dẫn hướng.<br/>C. Cả ba dẫn tín hiệu theo một đường vật lý.<br/>D. Sóng vô tuyến và vệ tinh không dẫn hướng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Under demand paging, when is a page of a program copied into memory?</p></div><div class=\"ml-vi\"><p>Với phân trang theo yêu cầu, một trang của chương trình được chép vào bộ nhớ khi nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Once a day, on a schedule|||Mỗi ngày một lần theo lịch"
            },
            {
              "text": "All pages are copied before the program starts|||Mọi trang được chép trước khi chương trình chạy"
            },
            {
              "text": "Only after the program finishes|||Chỉ sau khi chương trình kết thúc"
            },
            {
              "text": "Only when the program actually needs that page|||Chỉ khi chương trình thật sự cần trang đó"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Loading is driven by the program, not by a clock.<br/>B. That is plain paging.<br/>C. It would be useless by then.<br/>D. Unused pages stay on disk, so programs larger than RAM can run.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Việc nạp do chương trình quyết định, không theo đồng hồ.<br/>B. Đó là phân trang thường.<br/>C. Lúc đó nạp cũng vô ích.<br/>D. Trang chưa dùng nằm trên đĩa nên chương trình lớn hơn RAM vẫn chạy được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A router&#39;s firmware chip can be erased and rewritten electrically without removing it from the board. Which kind of memory is it?</p></div><div class=\"ml-vi\"><p>Chip chứa firmware của router có thể xoá và ghi lại bằng điện mà không cần tháo khỏi bảng mạch. Đó là loại bộ nhớ nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "EPROM|||EPROM"
            },
            {
              "text": "EEPROM|||EEPROM"
            },
            {
              "text": "PROM|||PROM"
            },
            {
              "text": "DRAM|||DRAM"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. EPROM needs ultraviolet light to erase it, usually off the board.<br/>B. Electrically erasable PROM is rewritten in place.<br/>C. PROM can be written only once.<br/>D. DRAM loses its contents when the power goes off.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. EPROM cần tia cực tím để xoá, thường phải tháo khỏi mạch.<br/>B. PROM xoá được bằng điện nên ghi lại ngay trên mạch.<br/>C. PROM chỉ ghi được một lần.<br/>D. DRAM mất nội dung khi tắt điện.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>You manage a remote server from your laptop&#39;s terminal and want the session encrypted. Which application protocol fits?</p></div><div class=\"ml-vi\"><p>Bạn quản trị máy chủ từ xa bằng terminal của laptop và muốn phiên được mã hoá. Giao thức ứng dụng nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "SSH|||SSH"
            },
            {
              "text": "SNMP|||SNMP"
            },
            {
              "text": "TELNET|||TELNET"
            },
            {
              "text": "SMTP|||SMTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. SSH gives an encrypted remote shell.<br/>B. SNMP monitors network devices.<br/>C. TELNET sends everything in clear text.<br/>D. SMTP sends mail.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. SSH cho một phiên dòng lệnh từ xa được mã hoá.<br/>B. SNMP giám sát thiết bị mạng.<br/>C. TELNET gửi mọi thứ dạng rõ.<br/>D. SMTP gửi thư.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Two keys hash to the same address. What does open addressing do?</p></div><div class=\"ml-vi\"><p>Hai khoá băm ra cùng một địa chỉ. Địa chỉ mở (open addressing) làm gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Deletes the older of the two records|||Xoá bản ghi cũ hơn trong hai bản ghi"
            },
            {
              "text": "Chains the record in a separate linked list|||Nối bản ghi vào một danh sách liên kết riêng"
            },
            {
              "text": "Places the record in another free slot|||Đặt bản ghi vào một ô trống khác"
            },
            {
              "text": "Changes the key of the record|||Đổi khoá của bản ghi"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Data must not be lost.<br/>B. That is linked-list resolution.<br/>C. Linear probing is the usual example.<br/>D. Keys identify records and do not change.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Không được mất dữ liệu.<br/>B. Đó là cách giải quyết bằng danh sách liên kết.<br/>C. Dò tuyến tính là ví dụ thường gặp.<br/>D. Khoá định danh bản ghi và không đổi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is hexadecimal 3F2 in decimal?</p></div><div class=\"ml-vi\"><p>Số thập lục phân 3F2 có giá trị thập phân là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1010|||1010"
            },
            {
              "text": "20|||20"
            },
            {
              "text": "770|||770"
            },
            {
              "text": "1266|||1266"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 3 x 256 + 15 x 16 + 2 = 1010.<br/>B. This only adds the digits.<br/>C. This treats F as 0.<br/>D. That is the value of hex 4F2, not 3F2.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 3 x 256 + 15 x 16 + 2 = 1010.<br/>B. Cách này chỉ cộng các chữ số.<br/>C. Cách này coi F là 0.<br/>D. Đó là giá trị của 4F2, không phải 3F2.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What sets assembly language apart from machine language?</p></div><div class=\"ml-vi\"><p>Điều gì phân biệt hợp ngữ với ngôn ngữ máy?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It runs on any CPU unchanged|||Nó chạy trên mọi CPU không cần sửa"
            },
            {
              "text": "It uses readable mnemonics such as ADD|||Nó dùng từ gợi nhớ dễ đọc như ADD"
            },
            {
              "text": "It is a high-level language like Python|||Nó là ngôn ngữ bậc cao như Python"
            },
            {
              "text": "It is pure binary|||Nó là nhị phân thuần"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Assembly is tied to one instruction set.<br/>B. An assembler translates each mnemonic into a machine instruction.<br/>C. It is a low-level language.<br/>D. That describes machine language.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Hợp ngữ gắn với một tập lệnh.<br/>B. Trình hợp dịch dịch mỗi từ gợi nhớ ra một lệnh máy.<br/>C. Nó là ngôn ngữ bậc thấp.<br/>D. Đó là mô tả ngôn ngữ máy.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which file can you read directly in a plain text editor?</p></div><div class=\"ml-vi\"><p>Tệp nào đọc được trực tiếp bằng trình soạn thảo văn bản?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "photo.jpg|||photo.jpg"
            },
            {
              "text": "song.mp3|||song.mp3"
            },
            {
              "text": "notes.csv|||notes.csv"
            },
            {
              "text": "game.exe|||game.exe"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. JPEG is a binary format.<br/>B. MP3 is a binary format.<br/>C. CSV is a text format of lines and commas.<br/>D. An executable is binary.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. JPEG là định dạng nhị phân.<br/>B. MP3 là định dạng nhị phân.<br/>C. CSV là định dạng văn bản gồm các dòng và dấu phẩy.<br/>D. Tệp thực thi là nhị phân.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which order runs from fastest and smallest to slowest and largest?</p></div><div class=\"ml-vi\"><p>Thứ tự nào đi từ nhanh nhất, nhỏ nhất đến chậm nhất, lớn nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Cache, registers, disk, main memory|||Cache, thanh ghi, đĩa, bộ nhớ chính"
            },
            {
              "text": "Main memory, registers, disk, cache|||Bộ nhớ chính, thanh ghi, đĩa, cache"
            },
            {
              "text": "Disk, main memory, cache, registers|||Đĩa, bộ nhớ chính, cache, thanh ghi"
            },
            {
              "text": "Registers, cache, main memory, disk|||Thanh ghi, cache, bộ nhớ chính, đĩa"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Registers beat cache, and RAM beats disk.<br/>B. This order mixes the levels up.<br/>C. This is the reverse order.<br/>D. This is the memory hierarchy from top to bottom.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Thanh ghi nhanh hơn cache, RAM nhanh hơn đĩa.<br/>B. Thứ tự này trộn lẫn các mức.<br/>C. Đây là thứ tự ngược.<br/>D. Đây là phân cấp bộ nhớ từ trên xuống.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A company hires a security tester who has written permission to break into its systems and report the holes. What is this person?</p></div><div class=\"ml-vi\"><p>Một công ty thuê người kiểm tra bảo mật có giấy phép bằng văn bản để đột nhập hệ thống và báo lỗ hổng. Người này là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A grey-hat hacker|||Hacker mũ xám"
            },
            {
              "text": "A black-hat hacker|||Hacker mũ đen"
            },
            {
              "text": "A device driver|||Một driver thiết bị"
            },
            {
              "text": "A white-hat hacker|||Hacker mũ trắng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Grey hats act without permission, even with good intent.<br/>B. Black hats act without permission and for harm or gain.<br/>C. That is software.<br/>D. The authorisation is what makes it ethical.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Mũ xám làm không được phép, dù có ý tốt.<br/>B. Mũ đen làm không được phép, để phá hoại hoặc trục lợi.<br/>C. Đó là phần mềm.<br/>D. Sự cho phép là thứ làm việc này đúng đạo đức.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A program downloads an exam file that must arrive complete and in order. Which transport protocol should it use?</p></div><div class=\"ml-vi\"><p>Chương trình tải một tệp đề thi phải đến đầy đủ và đúng thứ tự. Nên dùng giao thức giao vận nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "ARP|||ARP"
            },
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "IP|||IP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. UDP gives no delivery guarantee.<br/>B. ARP is not a transport protocol.<br/>C. TCP resends lost data and keeps it in order.<br/>D. IP is at the network layer and is best-effort.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. UDP không bảo đảm giao hàng.<br/>B. ARP không phải giao thức giao vận.<br/>C. TCP gửi lại phần mất và giữ đúng thứ tự.<br/>D. IP ở tầng mạng và chỉ cố gắng giao.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Under which ethical principle is plagiarism wrong because it breaks the fair agreement that everyone in a class relies on?</p></div><div class=\"ml-vi\"><p>Theo nguyên tắc đạo đức nào thì đạo văn là sai vì phá vỡ thoả thuận công bằng mà cả lớp dựa vào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Social contract|||Khế ước xã hội"
            },
            {
              "text": "Least privilege|||Đặc quyền tối thiểu"
            },
            {
              "text": "Stored program|||Chương trình lưu sẵn"
            },
            {
              "text": "Modularity|||Tính mô-đun"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. This principle asks whether an act would be accepted by the community as a shared rule.<br/>B. That is a security practice.<br/>C. That is a computer design idea.<br/>D. That is a design principle.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nguyên tắc này hỏi liệu hành động có được cộng đồng chấp nhận như một luật chung không.<br/>B. Đó là thực hành an toàn.<br/>C. Đó là ý tưởng thiết kế máy tính.<br/>D. Đó là nguyên tắc thiết kế.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In the ANSI/SPARC architecture, which level is what one student sees in the grades portal?</p></div><div class=\"ml-vi\"><p>Trong kiến trúc ANSI/SPARC, mức nào là thứ một sinh viên thấy trên cổng xem điểm?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Conceptual level|||Mức khái niệm"
            },
            {
              "text": "External level|||Mức ngoài"
            },
            {
              "text": "Internal level|||Mức trong"
            },
            {
              "text": "Bootstrap level|||Mức mồi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the whole logical structure.<br/>B. It is a user&#39;s own view of the data.<br/>C. That is the physical storage.<br/>D. That is not part of the architecture.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là toàn bộ cấu trúc logic.<br/>B. Đó là khung nhìn riêng của người dùng.<br/>C. Đó là cách lưu vật lý.<br/>D. Mức này không có trong kiến trúc.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
