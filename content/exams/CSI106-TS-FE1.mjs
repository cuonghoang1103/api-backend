// AUTO-GENERATED từ _DE-TU-SOAN/FE/build.mjs + scripts/build-fe-exam.mjs (bank-CSI106-TS-FE1.jsonl). Nguồn: tự soạn theo dạng đề. Sửa ở nguồn rồi dựng lại, không sửa tay.
export default {
  "course": {
    "courseCode": "CSI106"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "TS-FE1",
      "title": "CSI106 — Practice Final 1 (self-composed)|||CSI106 — Đề luyện cuối kỳ 1 (tự soạn theo dạng đề)",
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
          "prompt": "<div class=\"ml-en\"><p>Which three constructs are enough to write any algorithm?</p></div><div class=\"ml-vi\"><p>Ba cấu trúc nào là đủ để viết mọi thuật toán?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Compile, link, run|||Biên dịch, liên kết, chạy"
            },
            {
              "text": "Sequence, decision, repetition|||Tuần tự, rẽ nhánh, lặp"
            },
            {
              "text": "Stack, queue, tree|||Ngăn xếp, hàng đợi, cây"
            },
            {
              "text": "Input, output, storage|||Vào, ra, lưu trữ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. These are build steps.<br/>B. Any structured algorithm can be built from these three.<br/>C. These are data structures.<br/>D. These are operations, not control constructs.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đây là các bước dựng chương trình.<br/>B. Mọi thuật toán có cấu trúc đều dựng được từ ba cấu trúc này.<br/>C. Đây là cấu trúc dữ liệu.<br/>D. Đây là thao tác, không phải cấu trúc điều khiển.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Selection sort is applied to [14, 7, 3, 9] in ascending order. What does the list look like after the first pass?</p></div><div class=\"ml-vi\"><p>Sắp xếp chọn được áp lên [14, 7, 3, 9] theo chiều tăng. Sau lượt đầu danh sách thành gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "[7, 3, 9, 14]|||[7, 3, 9, 14]"
            },
            {
              "text": "[3, 7, 9, 14]|||[3, 7, 9, 14]"
            },
            {
              "text": "[3, 14, 7, 9]|||[3, 14, 7, 9]"
            },
            {
              "text": "[3, 7, 14, 9]|||[3, 7, 14, 9]"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is one pass of bubble sort.<br/>B. That is the final sorted list.<br/>C. That shifts items as insertion would, instead of swapping.<br/>D. The smallest item 3 swaps with the first item 14.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là một lượt của sắp xếp nổi bọt.<br/>B. Đó là danh sách đã sắp hoàn toàn.<br/>C. Cách đó dịch phần tử như sắp xếp chèn, không đổi chỗ.<br/>D. Phần tử nhỏ nhất 3 đổi chỗ với phần tử đầu 14.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How is -37 stored in 8-bit two&#39;s complement?</p></div><div class=\"ml-vi\"><p>-37 được lưu thế nào ở dạng bù hai 8 bit?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11011011|||11011011"
            },
            {
              "text": "10100101|||10100101"
            },
            {
              "text": "11011010|||11011010"
            },
            {
              "text": "00100101|||00100101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 37 is 00100101; invert to 11011010 and add 1.<br/>B. This is sign-and-magnitude.<br/>C. This is only the inversion, which is one&#39;s complement.<br/>D. This is +37.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 37 là 00100101; đảo thành 11011010 rồi cộng 1.<br/>B. Đây là dạng dấu-độ lớn.<br/>C. Đây mới là đảo bit, tức bù một.<br/>D. Đây là +37.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A payroll run must process every employee record once a month. Which file access method suits it best?</p></div><div class=\"ml-vi\"><p>Đợt tính lương phải xử lý mọi bản ghi nhân viên mỗi tháng một lần. Phương pháp truy cập tệp nào phù hợp nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Stack-based|||Theo ngăn xếp"
            },
            {
              "text": "Indexed|||Chỉ mục"
            },
            {
              "text": "Sequential|||Tuần tự"
            },
            {
              "text": "Hashed|||Băm"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This is not a file access method.<br/>B. An index is for jumping to a key.<br/>C. All records are read in order, so nothing is gained by jumping.<br/>D. Hashing helps find one record fast.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây không phải phương pháp truy cập tệp.<br/>B. Chỉ mục dùng để nhảy tới một khoá.<br/>C. Mọi bản ghi được đọc theo thứ tự nên nhảy cóc không có lợi gì.<br/>D. Băm giúp tìm nhanh một bản ghi.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Several users work at terminals and each feels the machine is theirs alone, because the CPU moves quickly between them. Which kind of system is this?</p></div><div class=\"ml-vi\"><p>Nhiều người làm việc ở các thiết bị đầu cuối, ai cũng thấy như máy là của riêng mình vì CPU chuyển nhanh giữa họ. Đây là loại hệ thống nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Batch|||Theo lô"
            },
            {
              "text": "Parallel|||Song song"
            },
            {
              "text": "Time-sharing|||Chia thời gian"
            },
            {
              "text": "Single-user personal|||Cá nhân một người dùng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. Batch jobs run one after another with no interaction.<br/>B. Parallel systems use several CPUs at once.<br/>C. Each user gets short slices of CPU time.<br/>D. There are many users here.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Công việc theo lô chạy lần lượt, không tương tác.<br/>B. Hệ song song dùng nhiều CPU cùng lúc.<br/>C. Mỗi người nhận những lát thời gian CPU ngắn.<br/>D. Ở đây có nhiều người dùng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In which model does every computer both share and download files, with no central server?</p></div><div class=\"ml-vi\"><p>Trong mô hình nào mỗi máy vừa chia sẻ vừa tải tệp, không có máy chủ trung tâm?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Batch processing|||Xử lý theo lô"
            },
            {
              "text": "Peer-to-peer|||Ngang hàng (peer-to-peer)"
            },
            {
              "text": "Time-sharing|||Chia thời gian"
            },
            {
              "text": "Client-server|||Khách-chủ (client-server)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is an old way of running jobs.<br/>B. Each peer acts as client and server.<br/>C. That is a CPU-sharing method.<br/>D. That model has a central server.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là cách chạy công việc kiểu cũ.<br/>B. Mỗi máy vừa là client vừa là server.<br/>C. Đó là cách chia sẻ CPU.<br/>D. Mô hình đó có máy chủ trung tâm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A tester checks an age field with -1, 0, 120 and 121, without reading the code. Which kind of testing is this?</p></div><div class=\"ml-vi\"><p>Người kiểm thử thử ô tuổi với -1, 0, 120 và 121 mà không đọc mã. Đây là kiểu kiểm thử nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Black-box testing|||Kiểm thử hộp đen"
            },
            {
              "text": "Basis-path testing|||Kiểm thử đường cơ sở"
            },
            {
              "text": "Glass-box testing|||Kiểm thử hộp trắng"
            },
            {
              "text": "Compilation|||Biên dịch"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Tests come from the specification and focus on limits.<br/>B. That is a glass-box method.<br/>C. That needs the internal code.<br/>D. Compiling is not testing.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Ca kiểm lấy từ đặc tả và tập trung vào các biên.<br/>B. Đó là phương pháp hộp trắng.<br/>C. Kiểu đó cần xem mã bên trong.<br/>D. Biên dịch không phải kiểm thử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Start with an empty stack and run: push 5, push 8, pop, push 3, pop. What is on top now?</p></div><div class=\"ml-vi\"><p>Bắt đầu với ngăn xếp rỗng và chạy: push 5, push 8, pop, push 3, pop. Đỉnh ngăn xếp bây giờ là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The stack is empty|||Ngăn xếp rỗng"
            },
            {
              "text": "3|||3"
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
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. There were three pushes and two pops.<br/>B. 3 was popped by the last pop.<br/>C. 8 was popped by the first pop.<br/>D. 8 and 3 are each pushed and popped, so only 5 remains.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Có ba lần push và hai lần pop.<br/>B. 3 đã bị pop cuối lấy ra.<br/>C. 8 đã bị pop đầu tiên lấy ra.<br/>D. 8 và 3 đều bị đẩy vào rồi lấy ra, chỉ còn 5.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>You want to force the left four bits of a byte to 0 and keep the right four bits. Which operation and mask do that?</p></div><div class=\"ml-vi\"><p>Bạn muốn ép bốn bit trái của một byte về 0 và giữ nguyên bốn bit phải. Phép toán và mặt nạ nào làm được?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "AND with 00001111|||AND với 00001111"
            },
            {
              "text": "XOR with 11110000|||XOR với 11110000"
            },
            {
              "text": "AND with 11110000|||AND với 11110000"
            },
            {
              "text": "OR with 00001111|||OR với 00001111"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. AND with 0 clears a bit and AND with 1 keeps it.<br/>B. That flips the left four bits.<br/>C. That clears the right four bits.<br/>D. That sets the right four bits to 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. AND với 0 xoá bit, AND với 1 giữ bit.<br/>B. Phép đó lật bốn bit trái.<br/>C. Phép đó xoá bốn bit phải.<br/>D. Phép đó đặt bốn bit phải lên 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Typing a site&#39;s name into a browser works even though routers only understand IP addresses. Which service makes that possible?</p></div><div class=\"ml-vi\"><p>Gõ tên trang web vào trình duyệt vẫn chạy dù router chỉ hiểu địa chỉ IP. Dịch vụ nào làm được điều đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "ARP|||ARP"
            },
            {
              "text": "DNS|||DNS"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "FTP|||FTP"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. ARP finds the MAC of a local IP address.<br/>B. DNS translates domain names into IP addresses.<br/>C. SMTP sends email.<br/>D. FTP transfers files.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. ARP tìm MAC của một IP cục bộ.<br/>B. DNS dịch tên miền sang địa chỉ IP.<br/>C. SMTP gửi email.<br/>D. FTP truyền tệp.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which order matches the phases of the development process?</p></div><div class=\"ml-vi\"><p>Thứ tự nào đúng với các pha của quy trình phát triển?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Implementation, analysis, testing, design|||Cài đặt, phân tích, kiểm thử, thiết kế"
            },
            {
              "text": "Design, testing, analysis, implementation|||Thiết kế, kiểm thử, phân tích, cài đặt"
            },
            {
              "text": "Testing, design, analysis, implementation|||Kiểm thử, thiết kế, phân tích, cài đặt"
            },
            {
              "text": "Analysis, design, implementation, testing|||Phân tích, thiết kế, cài đặt, kiểm thử"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Coding before analysis is backwards.<br/>B. Testing needs code that has been written.<br/>C. There is nothing to test yet.<br/>D. What to build comes first, then how, then code, then checks.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Viết mã trước khi phân tích là ngược.<br/>B. Kiểm thử cần có mã đã viết.<br/>C. Lúc đó chưa có gì để kiểm thử.<br/>D. Làm cái gì trước, rồi làm thế nào, rồi viết mã, rồi kiểm tra.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Why are Roman numerals called a non-positional system?</p></div><div class=\"ml-vi\"><p>Vì sao chữ số La Mã được gọi là hệ không theo vị trí?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "They use only two different symbols|||Chúng chỉ dùng hai ký hiệu khác nhau"
            },
            {
              "text": "They cannot write numbers above ten|||Chúng không viết được số trên mười"
            },
            {
              "text": "A symbol&#39;s value does not depend on its place|||Giá trị của ký hiệu không phụ thuộc vị trí của nó"
            },
            {
              "text": "They are written from right to left|||Chúng được viết từ phải sang trái"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. They use seven main symbols.<br/>B. They can, for example L or M.<br/>C. X means ten wherever it stands; only simple add and subtract rules apply.<br/>D. This is not why they are non-positional.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Chúng dùng bảy ký hiệu chính.<br/>B. Chúng viết được, ví dụ L hoặc M.<br/>C. X luôn nghĩa là mười dù đứng đâu; chỉ có luật cộng trừ đơn giản.<br/>D. Đây không phải lý do chúng không theo vị trí.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A company links the computers on one floor of its office. Which network type is this?</p></div><div class=\"ml-vi\"><p>Một công ty nối các máy tính trên một tầng văn phòng. Đây là loại mạng nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "MAN|||MAN"
            },
            {
              "text": "WAN|||WAN"
            },
            {
              "text": "The Internet|||Internet"
            },
            {
              "text": "LAN|||LAN"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. A MAN covers a whole town or city.<br/>B. A WAN spans cities or countries.<br/>C. The Internet is a worldwide network of networks.<br/>D. A LAN covers a small area such as a floor or building.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. MAN phủ cả một thị xã hoặc thành phố.<br/>B. WAN trải khắp thành phố hoặc quốc gia.<br/>C. Internet là mạng của các mạng trên toàn cầu.<br/>D. LAN phủ vùng nhỏ như một tầng hoặc một toà nhà.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which value is stored by the 8-bit two&#39;s complement pattern 10010110?</p></div><div class=\"ml-vi\"><p>Mẫu bù hai 8 bit 10010110 biểu diễn giá trị nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "-105|||-105"
            },
            {
              "text": "-106|||-106"
            },
            {
              "text": "-22|||-22"
            },
            {
              "text": "150|||150"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the one&#39;s complement reading.<br/>B. The leading 1 means negative; invert and add 1 to get 01101010, which is 106.<br/>C. That reads the pattern as sign-and-magnitude.<br/>D. That reads the pattern as unsigned.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là cách đọc theo bù một.<br/>B. Bit đầu là 1 nên số âm; đảo rồi cộng 1 được 01101010, tức 106.<br/>C. Cách đó đọc mẫu như dấu-độ lớn.<br/>D. Cách đó đọc mẫu như số không dấu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What defines a symmetric-key cipher?</p></div><div class=\"ml-vi\"><p>Điều gì định nghĩa mã khoá đối xứng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It uses a public and a private key|||Nó dùng khoá công khai và khoá riêng"
            },
            {
              "text": "It needs no key at all|||Nó không cần khoá"
            },
            {
              "text": "The same secret key encrypts and decrypts|||Cùng một khoá bí mật dùng để mã hoá và giải mã"
            },
            {
              "text": "It only works on images|||Nó chỉ dùng được với ảnh"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is asymmetric cryptography.<br/>B. All ciphers here use a key.<br/>C. Both sides must share that key.<br/>D. It works on any bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là mật mã bất đối xứng.<br/>B. Các loại mã ở đây đều dùng khoá.<br/>C. Hai bên phải chia sẻ khoá đó.<br/>D. Nó dùng được với mọi chuỗi bit.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In 8-bit two&#39;s complement, what does the addition 100 + 50 actually give?</p></div><div class=\"ml-vi\"><p>Trong bù hai 8 bit, phép cộng 100 + 50 thực sự cho kết quả nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "-106, because the true result overflows|||-106, vì kết quả thật bị tràn"
            },
            {
              "text": "150, because the adder has spare bits|||150, vì bộ cộng còn bit dư"
            },
            {
              "text": "127, because the result is clamped|||127, vì kết quả bị chặn lại"
            },
            {
              "text": "0, because the carry clears the register|||0, vì số nhớ xoá thanh ghi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 150 is above +127, so the stored pattern 10010110 reads as -106.<br/>B. Only 8 bits are kept.<br/>C. Ordinary binary addition does not clamp.<br/>D. A carry does not clear the other bits.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 150 vượt +127 nên mẫu lưu 10010110 được đọc là -106.<br/>B. Chỉ giữ 8 bit.<br/>C. Phép cộng nhị phân thông thường không chặn.<br/>D. Số nhớ không xoá các bit khác.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Table Enrollment has a column studentId that must match an id in table Student. What is studentId in Enrollment?</p></div><div class=\"ml-vi\"><p>Bảng Enrollment có cột studentId phải khớp với id trong bảng Student. studentId trong Enrollment là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A foreign key|||Khoá ngoại"
            },
            {
              "text": "A schema|||Lược đồ"
            },
            {
              "text": "An attribute domain|||Miền giá trị thuộc tính"
            },
            {
              "text": "A view|||Khung nhìn"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It refers to the primary key of another table.<br/>B. A schema describes the structure of a database.<br/>C. A domain is the set of allowed values.<br/>D. A view is a virtual table defined by a query.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó tham chiếu khoá chính của bảng khác.<br/>B. Lược đồ mô tả cấu trúc của cơ sở dữ liệu.<br/>C. Miền là tập giá trị cho phép.<br/>D. Khung nhìn là bảng ảo được định nghĩa bằng một truy vấn.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Convert decimal 0.625 to binary.</p></div><div class=\"ml-vi\"><p>Đổi số thập phân 0.625 sang nhị phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "0.625|||0.625"
            },
            {
              "text": "0.011|||0.011"
            },
            {
              "text": "0.110|||0.110"
            },
            {
              "text": "0.101|||0.101"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. This has digits that do not exist in binary.<br/>B. That equals 0.375.<br/>C. That equals 0.75.<br/>D. Multiply by 2 and keep the whole part: 1.25, 0.5, 1.0 gives 1, 0, 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách viết này có chữ số không tồn tại trong nhị phân.<br/>B. Số đó bằng 0.375.<br/>C. Số đó bằng 0.75.<br/>D. Nhân 2 và lấy phần nguyên: 1.25, 0.5, 1.0 cho 1, 0, 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does the pseudocode below print?</p><pre><code class=\"language-plaintext\">x &lt;- 0\nfor each item in [3, 7, 2]:\n    x &lt;- x + item\nprint x</code></pre></div><div class=\"ml-vi\"><p>Đoạn mã giả dưới đây in ra gì?</p><pre><code class=\"language-plaintext\">x &lt;- 0\nfor each item in [3, 7, 2]:\n    x &lt;- x + item\nprint x</code></pre></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "12|||12"
            },
            {
              "text": "3|||3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is the last item.<br/>B. That is the largest item, not the sum.<br/>C. The values are 3, 7, 2: x ends at 3 + 7 + 2 = 12.<br/>D. That is the first item.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là phần tử cuối.<br/>B. Đó là phần tử lớn nhất, không phải tổng.<br/>C. Các giá trị là 3, 7, 2: x cuối cùng bằng 3 + 7 + 2 = 12.<br/>D. Đó là phần tử đầu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which statement about SRAM and DRAM is correct?</p></div><div class=\"ml-vi\"><p>Phát biểu nào về SRAM và DRAM là đúng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "DRAM keeps its contents with the power off|||DRAM giữ nội dung khi tắt điện"
            },
            {
              "text": "SRAM is faster and is used for cache, while DRAM must be refreshed|||SRAM nhanh hơn và dùng làm cache, còn DRAM phải được làm tươi"
            },
            {
              "text": "DRAM is a kind of read-only memory|||DRAM là một loại bộ nhớ chỉ đọc"
            },
            {
              "text": "SRAM is cheaper and is used for main memory|||SRAM rẻ hơn và dùng làm bộ nhớ chính"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Both are volatile.<br/>B. DRAM stores bits as charge that leaks, so it needs refreshing.<br/>C. DRAM can be read and written freely.<br/>D. SRAM costs more per bit.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Cả hai đều mất dữ liệu khi mất điện.<br/>B. DRAM lưu bit bằng điện tích bị rò nên phải làm tươi.<br/>C. DRAM đọc và ghi tự do.<br/>D. SRAM đắt hơn tính theo mỗi bit.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Process P1 holds the printer and waits for the scanner, while P2 holds the scanner and waits for the printer. Neither gives way. What is this?</p></div><div class=\"ml-vi\"><p>Tiến trình P1 giữ máy in và chờ máy quét, còn P2 giữ máy quét và chờ máy in. Không bên nào nhường. Đây là hiện tượng gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Deadlock|||Bế tắc (deadlock)"
            },
            {
              "text": "Overflow|||Tràn số"
            },
            {
              "text": "Starvation|||Đói tài nguyên"
            },
            {
              "text": "Paging|||Phân trang"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Each holds what the other needs, in a circular wait.<br/>B. Overflow is an arithmetic event.<br/>C. Starvation means one process is passed over repeatedly while others proceed.<br/>D. Paging is a memory technique.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mỗi bên giữ thứ bên kia cần, tạo thành vòng chờ.<br/>B. Tràn số là sự kiện số học.<br/>C. Đói nghĩa là một tiến trình bị bỏ qua liên tục trong khi các tiến trình khác chạy.<br/>D. Phân trang là kỹ thuật bộ nhớ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A spam filter is trained on thousands of emails already labelled spam or not spam. Which kind of learning is this?</p></div><div class=\"ml-vi\"><p>Một bộ lọc thư rác được huấn luyện trên hàng nghìn email đã gán nhãn thư rác hoặc không. Đây là kiểu học nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Hand-written rules|||Luật viết tay"
            },
            {
              "text": "Supervised learning|||Học có giám sát"
            },
            {
              "text": "Unsupervised learning|||Học không giám sát"
            },
            {
              "text": "Reinforcement learning|||Học tăng cường"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Rules written by a person are not learned at all.<br/>B. It learns from labelled examples.<br/>C. That works without labels.<br/>D. That learns from rewards and penalties.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Luật do người viết thì không phải học.<br/>B. Nó học từ các ví dụ có nhãn.<br/>C. Kiểu đó làm việc không có nhãn.<br/>D. Kiểu đó học từ thưởng và phạt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which part of the CPU actually works out 7 AND 3?</p></div><div class=\"ml-vi\"><p>Bộ phận nào của CPU thật sự tính 7 AND 3?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The control unit|||Khối điều khiển"
            },
            {
              "text": "The main memory|||Bộ nhớ chính"
            },
            {
              "text": "The I/O controller|||Bộ điều khiển vào/ra"
            },
            {
              "text": "The arithmetic logic unit|||Khối số học-logic (ALU)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. It decodes instructions and directs the others, but does not do the calculation.<br/>B. Memory stores values; it does not compute.<br/>C. It connects devices.<br/>D. The ALU performs arithmetic, logic and shift operations.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Nó giải mã lệnh và chỉ huy, không tự làm phép tính.<br/>B. Bộ nhớ lưu giá trị, không tính toán.<br/>C. Nó kết nối các thiết bị.<br/>D. ALU thực hiện phép số học, logic và dịch bit.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Programmers give Prolog a set of facts and rules, then ask questions. Which paradigm is this?</p></div><div class=\"ml-vi\"><p>Lập trình viên đưa cho Prolog một tập sự kiện và luật rồi đặt câu hỏi. Đây là mô thức nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Assembly|||Hợp ngữ"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            },
            {
              "text": "Logic (declarative)|||Logic (khai báo)"
            },
            {
              "text": "Procedural|||Thủ tục"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a language level, not a paradigm.<br/>B. That groups data and behaviour in objects.<br/>C. The system infers answers from facts and rules.<br/>D. Procedural code lists steps to follow.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là một mức ngôn ngữ, không phải mô thức.<br/>B. Mô thức đó gom dữ liệu và hành vi vào đối tượng.<br/>C. Hệ thống suy ra đáp án từ sự kiện và luật.<br/>D. Mã thủ tục liệt kê các bước phải làm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What makes a universal Turing machine different from a machine built for one task?</p></div><div class=\"ml-vi\"><p>Điều gì làm máy Turing phổ dụng khác với một cỗ máy chỉ làm một việc?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It runs faster than any electronic computer|||Nó chạy nhanh hơn mọi máy tính điện tử"
            },
            {
              "text": "Given the right program, it can imitate any other computing machine|||Với chương trình phù hợp, nó bắt chước được mọi máy tính toán khác"
            },
            {
              "text": "It works without needing any input data|||Nó chạy mà không cần bất kỳ dữ liệu vào nào"
            },
            {
              "text": "It stores data permanently but cannot process any of it|||Nó lưu dữ liệu lâu dài nhưng không xử lý được gì"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It is a theoretical model, and speed is not the point.<br/>B. Changing the program, not the hardware, changes what it computes.<br/>C. It still works on input data under a program.<br/>D. Processing data is its whole purpose.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đây là mô hình lý thuyết, tốc độ không phải vấn đề.<br/>B. Đổi chương trình chứ không đổi phần cứng là đổi được việc nó tính.<br/>C. Nó vẫn xử lý dữ liệu vào theo một chương trình.<br/>D. Xử lý dữ liệu chính là mục đích của nó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A team builds a basic version first and adds features in several rounds, testing each. Which model is this?</p></div><div class=\"ml-vi\"><p>Một nhóm làm bản cơ bản trước rồi thêm tính năng qua nhiều vòng, kiểm thử từng vòng. Đây là mô hình nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Client-server model|||Mô hình khách-chủ"
            },
            {
              "text": "Von Neumann model|||Mô hình von Neumann"
            },
            {
              "text": "Incremental model|||Mô hình gia tăng"
            },
            {
              "text": "Waterfall model|||Mô hình thác nước"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a network model.<br/>B. That is a computer model.<br/>C. The system grows in slices.<br/>D. Waterfall finishes each phase once, in strict order.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là mô hình mạng.<br/>B. Đó là mô hình máy tính.<br/>C. Hệ thống lớn dần theo từng lát.<br/>D. Thác nước làm xong mỗi pha một lần, theo thứ tự chặt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the octal number 345 in decimal?</p></div><div class=\"ml-vi\"><p>Số bát phân 345 có giá trị thập phân là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "345|||345"
            },
            {
              "text": "355|||355"
            },
            {
              "text": "837|||837"
            },
            {
              "text": "229|||229"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That reads the digits as if they were decimal.<br/>B. That reads the digits in reverse order.<br/>C. That uses base 16.<br/>D. 3 x 64 + 4 x 8 + 5 = 229.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách đó đọc các chữ số như hệ thập phân.<br/>B. Cách đó đọc các chữ số theo thứ tự ngược.<br/>C. Cách đó dùng cơ số 16.<br/>D. 3 x 64 + 4 x 8 + 5 = 229.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>The CPU reads a word from memory. Which bus tells memory which location is wanted?</p></div><div class=\"ml-vi\"><p>CPU đọc một từ từ bộ nhớ. Bus nào cho bộ nhớ biết ô nhớ nào đang được yêu cầu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The address bus|||Bus địa chỉ"
            },
            {
              "text": "The USB bus|||Bus USB"
            },
            {
              "text": "The control bus|||Bus điều khiển"
            },
            {
              "text": "The data bus|||Bus dữ liệu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. It carries the location number.<br/>B. USB connects external devices.<br/>C. It carries signals such as read or write.<br/>D. It carries the value being moved.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Nó mang số hiệu ô nhớ.<br/>B. USB nối thiết bị ngoài.<br/>C. Nó mang tín hiệu như đọc hoặc ghi.<br/>D. Nó mang giá trị được chuyển.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A late-1950s computer no longer glows with hot glass tubes, and it fits in one room. Which component made this possible?</p></div><div class=\"ml-vi\"><p>Một máy tính cuối thập niên 1950 không còn những ống thuỷ tinh nóng rực và gọn trong một phòng. Linh kiện nào làm được điều đó?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Microprocessors|||Vi xử lý"
            },
            {
              "text": "Transistors|||Transistor"
            },
            {
              "text": "Mechanical gears|||Bánh răng cơ khí"
            },
            {
              "text": "Integrated circuits|||Mạch tích hợp"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. Those mark the fourth generation.<br/>B. Transistors were smaller, cooler and more reliable.<br/>C. Gears came before electronic computers.<br/>D. Those mark the third generation.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là dấu mốc của thế hệ thứ tư.<br/>B. Transistor nhỏ hơn, mát hơn và bền hơn.<br/>C. Bánh răng có trước máy tính điện tử.<br/>D. Đó là dấu mốc của thế hệ thứ ba.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A byte-addressable memory holds 32 KB (1 KB = 1024 bytes). How many address bits are needed?</p></div><div class=\"ml-vi\"><p>Một bộ nhớ đánh địa chỉ theo byte chứa 32 KB (1 KB = 1024 byte). Cần bao nhiêu bit địa chỉ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10|||10"
            },
            {
              "text": "32|||32"
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
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. 10 bits address only 1 KB.<br/>B. 32 is the size in KB, not the number of bits.<br/>C. 32 x 1024 = 2^15 locations.<br/>D. 16 bits address 64 KB.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. 10 bit chỉ đánh địa chỉ được 1 KB.<br/>B. 32 là dung lượng theo KB, không phải số bit.<br/>C. 32 x 1024 = 2^15 ô nhớ.<br/>D. 16 bit đánh địa chỉ được 64 KB.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Print jobs must come out in the order they were sent. Which structure fits?</p></div><div class=\"ml-vi\"><p>Các lệnh in phải ra đúng thứ tự đã gửi. Cấu trúc nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Queue|||Hàng đợi"
            },
            {
              "text": "Binary search tree|||Cây nhị phân tìm kiếm"
            },
            {
              "text": "Stack|||Ngăn xếp"
            },
            {
              "text": "Graph|||Đồ thị"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. First in, first out.<br/>B. A BST orders by key, not by arrival.<br/>C. A stack gives the newest job first.<br/>D. A graph models links between items.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Vào trước, ra trước.<br/>B. BST sắp theo khoá, không theo thời điểm đến.<br/>C. Ngăn xếp cho lệnh mới nhất ra trước.<br/>D. Đồ thị mô hình hoá liên kết giữa các phần tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Using the grouping shortcut, what is binary 110101101 in octal?</p></div><div class=\"ml-vi\"><p>Dùng mẹo nhóm bit, số nhị phân 110101101 viết ở hệ bát phân là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "429|||429"
            },
            {
              "text": "1AD|||1AD"
            },
            {
              "text": "556|||556"
            },
            {
              "text": "655|||655"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is the decimal value.<br/>B. That is the hexadecimal form.<br/>C. The groups were taken in reverse order.<br/>D. Group from the right in threes: 110 101 101.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là giá trị thập phân.<br/>B. Đó là dạng thập lục phân.<br/>C. Các nhóm bị lấy ngược thứ tự.<br/>D. Nhóm ba bit từ phải sang: 110 101 101.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A Caesar cipher shifts each letter 3 places forward. How is CAT encrypted?</p></div><div class=\"ml-vi\"><p>Mã Caesar dịch mỗi chữ cái tiến 3 vị trí. CAT được mã hoá thành gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "TAC|||TAC"
            },
            {
              "text": "ZXQ|||ZXQ"
            },
            {
              "text": "DBU|||DBU"
            },
            {
              "text": "FDW|||FDW"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. This reverses the letters without shifting.<br/>B. This shifts backwards by 3.<br/>C. This shifts by 1.<br/>D. C to F, A to D, T to W.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Cách này đảo chữ, không dịch.<br/>B. Cách này dịch lùi 3.<br/>C. Cách này dịch 1 vị trí.<br/>D. C thành F, A thành D, T thành W.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Convert decimal 156 to hexadecimal.</p></div><div class=\"ml-vi\"><p>Đổi số thập phân 156 sang hệ thập lục phân.</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "9A|||9A"
            },
            {
              "text": "C9|||C9"
            },
            {
              "text": "9C|||9C"
            },
            {
              "text": "8C|||8C"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That equals 154.<br/>B. The digits are in reverse order.<br/>C. 156 = 9 x 16 + 12, and 12 is written C.<br/>D. That equals 140.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Số đó bằng 154.<br/>B. Các chữ số bị đảo.<br/>C. 156 = 9 x 16 + 12, và 12 viết là C.<br/>D. Số đó bằng 140.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What do good modules aim for?</p></div><div class=\"ml-vi\"><p>Các mô-đun tốt nhắm tới điều gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Low coupling and high cohesion|||Kết dính lỏng và cố kết cao"
            },
            {
              "text": "High coupling and low cohesion|||Kết dính chặt và cố kết thấp"
            },
            {
              "text": "As many global variables as possible|||Càng nhiều biến toàn cục càng tốt"
            },
            {
              "text": "High coupling and high cohesion|||Kết dính chặt và cố kết cao"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. Modules should depend little on each other, and each should do one clear job.<br/>B. This makes changes spread everywhere.<br/>C. Global variables increase coupling.<br/>D. High coupling is a problem even with focused modules.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Mô-đun nên ít phụ thuộc nhau và mỗi mô-đun làm một việc rõ ràng.<br/>B. Như vậy thay đổi sẽ lan khắp nơi.<br/>C. Biến toàn cục làm tăng kết dính.<br/>D. Kết dính chặt là vấn đề dù mô-đun có tập trung.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What range can a 6-bit unsigned integer store?</p></div><div class=\"ml-vi\"><p>Số nguyên không dấu 6 bit lưu được dải nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "-32 to 31|||-32 đến 31"
            },
            {
              "text": "0 to 63|||0 đến 63"
            },
            {
              "text": "0 to 64|||0 đến 64"
            },
            {
              "text": "1 to 63|||1 đến 63"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the two&#39;s complement range.<br/>B. 2^6 values, starting at zero.<br/>C. 64 would need a seventh bit.<br/>D. Zero can be stored.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là dải của bù hai.<br/>B. Có 2^6 giá trị, bắt đầu từ 0.<br/>C. 64 cần bit thứ bảy.<br/>D. Số 0 vẫn lưu được.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does the stored-program concept say?</p></div><div class=\"ml-vi\"><p>Khái niệm chương trình lưu sẵn nói gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Programs are kept only in the CPU|||Chương trình chỉ được giữ trong CPU"
            },
            {
              "text": "Programs and data are both kept in memory|||Cả chương trình và dữ liệu đều được giữ trong bộ nhớ"
            },
            {
              "text": "Data must be stored on paper tape|||Dữ liệu phải lưu trên băng giấy"
            },
            {
              "text": "Each program needs its own computer|||Mỗi chương trình cần một máy tính riêng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The CPU has only a few registers.<br/>B. Instructions are read from the same memory as data, so a new program needs no rewiring.<br/>C. The concept says nothing about one medium.<br/>D. One machine can load many programs.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. CPU chỉ có vài thanh ghi.<br/>B. Lệnh được đọc từ cùng bộ nhớ với dữ liệu nên đổi chương trình không cần đi lại dây.<br/>C. Khái niệm này không gắn với một phương tiện cụ thể.<br/>D. Một máy nạp được nhiều chương trình.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>With modulo division hashing on a file of 11 slots, which slot does key 1234 go to?</p></div><div class=\"ml-vi\"><p>Dùng băm chia lấy dư trên tệp 11 ô, khoá 1234 vào ô nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "112|||112"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 1234 = 112 x 11 + 2.<br/>B. That is the quotient.<br/>C. This takes the last digit of the key, which is digit extraction.<br/>D. The remainder is 2, not 1.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 1234 = 112 x 11 + 2.<br/>B. Đó là thương.<br/>C. Cách này lấy chữ số cuối, là trích chữ số.<br/>D. Số dư là 2, không phải 1.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which three subsystems make up a computer in the von Neumann view?</p></div><div class=\"ml-vi\"><p>Theo quan điểm von Neumann, máy tính gồm ba phân hệ nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Keyboard, screen, printer|||Bàn phím, màn hình, máy in"
            },
            {
              "text": "Hard disk, SSD, USB stick|||Đĩa cứng, SSD, thẻ USB"
            },
            {
              "text": "CPU, main memory, input/output|||CPU, bộ nhớ chính, vào/ra"
            },
            {
              "text": "Compiler, editor, linker|||Trình biên dịch, trình soạn thảo, trình liên kết"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. All of these are I/O devices.<br/>B. All of these are storage devices.<br/>C. These three interact to run a program.<br/>D. These are software tools.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Tất cả đều là thiết bị vào/ra.<br/>B. Tất cả đều là thiết bị lưu trữ.<br/>C. Ba phân hệ này phối hợp để chạy chương trình.<br/>D. Đây là các công cụ phần mềm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Match the address to the layer. Which pairing is correct?</p></div><div class=\"ml-vi\"><p>Ghép địa chỉ với tầng. Cặp nào đúng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "MAC address at the application layer|||Địa chỉ MAC ở tầng ứng dụng"
            },
            {
              "text": "Port number at the physical layer|||Số cổng ở tầng vật lý"
            },
            {
              "text": "IP address at the transport layer, port number at the network layer|||Địa chỉ IP ở tầng giao vận, số cổng ở tầng mạng"
            },
            {
              "text": "Port number at the transport layer, IP address at the network layer|||Số cổng ở tầng giao vận, địa chỉ IP ở tầng mạng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. MAC addresses belong to the data-link layer.<br/>B. The physical layer deals only with bits.<br/>C. The two are swapped.<br/>D. Each layer uses the address type suited to its job.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. MAC thuộc tầng liên kết dữ liệu.<br/>B. Tầng vật lý chỉ làm việc với bit.<br/>C. Hai loại bị đổi chỗ.<br/>D. Mỗi tầng dùng loại địa chỉ hợp với việc của nó.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>When a computer is switched on, RAM is empty. What loads the operating system?</p></div><div class=\"ml-vi\"><p>Khi bật máy, RAM còn trống. Cái gì nạp hệ điều hành?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A small bootstrap program stored in ROM|||Một chương trình mồi nhỏ lưu trong ROM"
            },
            {
              "text": "The user, by typing the OS into RAM|||Người dùng gõ hệ điều hành vào RAM"
            },
            {
              "text": "The compiler|||Trình biên dịch"
            },
            {
              "text": "The keyboard controller|||Bộ điều khiển bàn phím"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. ROM keeps its contents with the power off, so the CPU can start there.<br/>B. Loading is automatic.<br/>C. A compiler is a user program and runs later.<br/>D. It handles keystrokes.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. ROM giữ nội dung khi tắt điện nên CPU có thể bắt đầu từ đó.<br/>B. Việc nạp là tự động.<br/>C. Trình biên dịch là chương trình người dùng, chạy sau.<br/>D. Nó xử lý phím bấm.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>An integer array starts at address 1000 and each element takes 4 bytes. At what address is A[6], with indexes from 0?</p></div><div class=\"ml-vi\"><p>Một mảng số nguyên bắt đầu ở địa chỉ 1000, mỗi phần tử chiếm 4 byte. A[6] nằm ở địa chỉ nào, chỉ số tính từ 0?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "1020|||1020"
            },
            {
              "text": "1028|||1028"
            },
            {
              "text": "1024|||1024"
            },
            {
              "text": "1006|||1006"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This uses index 5.<br/>B. This uses index 7.<br/>C. 1000 + 6 x 4 = 1024.<br/>D. This forgets the element size.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Cách này dùng chỉ số 5.<br/>B. Cách này dùng chỉ số 7.<br/>C. 1000 + 6 x 4 = 1024.<br/>D. Cách này quên kích thước phần tử.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which relational operation keeps only certain columns of a table?</p></div><div class=\"ml-vi\"><p>Phép toán quan hệ nào chỉ giữ lại một số cột của bảng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Union|||Hợp (union)"
            },
            {
              "text": "Join|||Kết nối (join)"
            },
            {
              "text": "Select|||Chọn (select)"
            },
            {
              "text": "Project|||Chiếu (project)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. Union combines two relations.<br/>B. Join combines tables on a common attribute.<br/>C. Select picks rows.<br/>D. Project picks attributes.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Phép hợp gộp hai quan hệ.<br/>B. Phép kết nối gộp bảng theo thuộc tính chung.<br/>C. Phép chọn chọn hàng.<br/>D. Phép chiếu chọn thuộc tính.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What is the binary number 1011.01 in decimal?</p></div><div class=\"ml-vi\"><p>Số nhị phân 1011.01 có giá trị thập phân là bao nhiêu?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "11.5|||11.5"
            },
            {
              "text": "11.25|||11.25"
            },
            {
              "text": "11.01|||11.01"
            },
            {
              "text": "13.25|||13.25"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. The fraction .01 means one quarter, not one half.<br/>B. 8 + 2 + 1 + 1/4 = 11.25.<br/>C. The fraction digits cannot be copied across.<br/>D. That is 1101.01, with the two middle bits swapped.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Phần .01 là một phần tư, không phải một nửa.<br/>B. 8 + 2 + 1 + 1/4 = 11.25.<br/>C. Không chép nguyên phần lẻ sang được.<br/>D. Đó là 1101.01, hai bit giữa bị đảo chỗ.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which protocol pair is used when you send an email and later your friend downloads it?</p></div><div class=\"ml-vi\"><p>Cặp giao thức nào được dùng khi bạn gửi email rồi sau đó bạn của bạn tải thư về?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "FTP to send, TCP to retrieve|||FTP để gửi, TCP để nhận"
            },
            {
              "text": "POP3 to send, SMTP to retrieve|||POP3 để gửi, SMTP để nhận"
            },
            {
              "text": "HTTP to send, DNS to retrieve|||HTTP để gửi, DNS để nhận"
            },
            {
              "text": "SMTP to send, POP3 to retrieve|||SMTP để gửi, POP3 để nhận"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. TCP is a transport protocol, not a mail protocol.<br/>B. The roles are reversed.<br/>C. DNS does not store mail.<br/>D. SMTP pushes mail to servers, and POP3 lets a client fetch it.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. TCP là giao thức giao vận, không phải giao thức thư.<br/>B. Vai trò bị đảo.<br/>C. DNS không lưu thư.<br/>D. SMTP đẩy thư tới máy chủ, POP3 cho máy khách tải về.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which OS component talks to a printer through a driver and queues its jobs?</p></div><div class=\"ml-vi\"><p>Thành phần nào của hệ điều hành làm việc với máy in qua driver và xếp hàng công việc in?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "File manager|||Bộ quản lý tệp"
            },
            {
              "text": "Device manager|||Bộ quản lý thiết bị"
            },
            {
              "text": "User interface|||Giao diện người dùng"
            },
            {
              "text": "Memory manager|||Bộ quản lý bộ nhớ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It organises files and folders.<br/>B. It controls I/O devices through drivers and buffers.<br/>C. It takes commands from the user.<br/>D. It allocates RAM.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Nó tổ chức tệp và thư mục.<br/>B. Nó điều khiển thiết bị vào/ra qua driver và vùng đệm.<br/>C. Nó nhận lệnh từ người dùng.<br/>D. Nó cấp phát RAM.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A real number 12.5 is stored in IEEE 754 single precision. What is its 8-bit exponent field?</p></div><div class=\"ml-vi\"><p>Số thực 12.5 được lưu theo IEEE 754 độ chính xác đơn. Trường mũ 8 bit của nó là gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "10000010|||10000010"
            },
            {
              "text": "10000011|||10000011"
            },
            {
              "text": "01111111|||01111111"
            },
            {
              "text": "00000011|||00000011"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 12.5 = 1.1001 x 2^3, and 3 + 127 = 130.<br/>B. That is 131, which uses exponent 4.<br/>C. That is 127, the field for exponent 0.<br/>D. This leaves out the bias of 127.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 12.5 = 1.1001 x 2^3, và 3 + 127 = 130.<br/>B. Số đó là 131, ứng với mũ 4.<br/>C. Đó là 127, trường của mũ 0.<br/>D. Cách này quên cộng độ lệch 127.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>In one sentence, what is the job of an operating system?</p></div><div class=\"ml-vi\"><p>Nói gọn trong một câu, hệ điều hành có nhiệm vụ gì?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "To store web pages for the Internet|||Lưu trang web cho Internet"
            },
            {
              "text": "To check spelling in documents|||Kiểm tra chính tả trong tài liệu"
            },
            {
              "text": "To sit between hardware and users, and manage the machine&#39;s resources|||Đứng giữa phần cứng và người dùng, quản lý tài nguyên của máy"
            },
            {
              "text": "To translate high-level source code into machine code|||Dịch mã nguồn bậc cao sang mã máy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is a web server.<br/>B. That is an application feature.<br/>C. It shares memory, CPU time and devices among programs.<br/>D. That is a compiler.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là máy chủ web.<br/>B. Đó là tính năng của ứng dụng.<br/>C. Nó chia bộ nhớ, thời gian CPU và thiết bị cho các chương trình.<br/>D. Đó là trình biên dịch.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which term means a program that has been loaded and is running?</p></div><div class=\"ml-vi\"><p>Thuật ngữ nào chỉ một chương trình đã được nạp và đang chạy?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Bus|||Bus"
            },
            {
              "text": "Process|||Tiến trình"
            },
            {
              "text": "Compiler|||Trình biên dịch"
            },
            {
              "text": "File|||Tệp"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. A bus is a hardware path.<br/>B. A process is a program in execution.<br/>C. A compiler is one particular program.<br/>D. A file is stored data.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Bus là đường phần cứng.<br/>B. Tiến trình là chương trình đang thực thi.<br/>C. Trình biên dịch là một chương trình cụ thể.<br/>D. Tệp là dữ liệu được lưu.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>How does a compiler differ from an interpreter?</p></div><div class=\"ml-vi\"><p>Trình biên dịch khác trình thông dịch ở điểm nào?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "A compiler translates the whole program before it runs|||Trình biên dịch dịch cả chương trình trước khi chạy"
            },
            {
              "text": "There is no difference|||Không có khác biệt"
            },
            {
              "text": "An interpreter produces a stand-alone program file|||Trình thông dịch tạo tệp chương trình độc lập"
            },
            {
              "text": "A compiler runs one line at a time|||Trình biên dịch chạy từng dòng một"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. An interpreter translates and runs one line at a time.<br/>B. They differ in when translation happens.<br/>C. That is what a compiler produces.<br/>D. That describes an interpreter.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. Trình thông dịch dịch và chạy từng dòng một.<br/>B. Chúng khác nhau ở thời điểm dịch.<br/>C. Đó là sản phẩm của trình biên dịch.<br/>D. Đó là mô tả của trình thông dịch.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which layer of the TCP/IP suite delivers data from one running program to another, using port numbers?</p></div><div class=\"ml-vi\"><p>Tầng nào của bộ TCP/IP giao dữ liệu từ chương trình đang chạy này tới chương trình khác, dùng số cổng?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Physical layer|||Tầng vật lý"
            },
            {
              "text": "Network layer|||Tầng mạng"
            },
            {
              "text": "Transport layer|||Tầng giao vận"
            },
            {
              "text": "Data-link layer|||Tầng liên kết dữ liệu"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. It moves bits.<br/>B. IP delivers between hosts, not programs.<br/>C. TCP and UDP deliver between processes.<br/>D. It delivers frames across one link.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Tầng này chuyển bit.<br/>B. IP giao giữa các máy, không giữa các chương trình.<br/>C. TCP và UDP giao dữ liệu giữa các tiến trình.<br/>D. Tầng này giao khung qua một chặng.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A two-channel recording uses 48,000 samples per second and 2 bytes per sample. How many bytes does one uncompressed second need?</p></div><div class=\"ml-vi\"><p>Một bản ghi hai kênh dùng 48.000 mẫu mỗi giây, mỗi mẫu 2 byte. Một giây không nén cần bao nhiêu byte?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "96,000|||96,000"
            },
            {
              "text": "768,000|||768,000"
            },
            {
              "text": "48,000|||48,000"
            },
            {
              "text": "192,000|||192,000"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. That is one channel.<br/>B. That is one channel in bits.<br/>C. That counts samples of one channel, not bytes.<br/>D. 48,000 x 2 bytes x 2 channels.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Đó là một kênh.<br/>B. Đó là một kênh tính bằng bit.<br/>C. Đó là số mẫu của một kênh, không phải số byte.<br/>D. 48.000 x 2 byte x 2 kênh.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A sorted list has 1024 names. About how many comparisons does binary search need in the worst case?</p></div><div class=\"ml-vi\"><p>Một danh sách đã sắp có 1024 tên. Tìm nhị phân cần khoảng bao nhiêu phép so sánh trong trường hợp xấu nhất?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "About 512|||Khoảng 512"
            },
            {
              "text": "About 10|||Khoảng 10"
            },
            {
              "text": "Exactly 1|||Đúng 1"
            },
            {
              "text": "About 1024|||Khoảng 1024"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. That is the average for sequential search.<br/>B. Each step halves the range, and 2^10 = 1024.<br/>C. One comparison is only the best case.<br/>D. That is the worst case for sequential search.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Đó là mức trung bình của tìm tuần tự.<br/>B. Mỗi bước chia đôi khoảng, và 2^10 = 1024.<br/>C. Một phép so sánh chỉ là trường hợp tốt nhất.<br/>D. Đó là mức xấu nhất của tìm tuần tự.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>Which of these cannot be a valid octal number?</p></div><div class=\"ml-vi\"><p>Số nào dưới đây không thể là số bát phân hợp lệ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "7070|||7070"
            },
            {
              "text": "1727|||1727"
            },
            {
              "text": "1234|||1234"
            },
            {
              "text": "1729|||1729"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. All digits are below 8.<br/>B. All digits are below 8.<br/>C. All digits are below 8.<br/>D. Octal digits run from 0 to 7, and this one contains a 9.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Mọi chữ số đều nhỏ hơn 8.<br/>B. Mọi chữ số đều nhỏ hơn 8.<br/>C. Mọi chữ số đều nhỏ hơn 8.<br/>D. Chữ số bát phân từ 0 đến 7, số này chứa chữ số 9.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A flood of fake requests stops real customers from using a website. Which security goal is under attack?</p></div><div class=\"ml-vi\"><p>Một lượng lớn yêu cầu giả khiến khách thật không dùng được web. Mục tiêu an toàn nào bị tấn công?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Portability|||Tính di động"
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
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. This is a software quality, not a security goal.<br/>B. No data was changed.<br/>C. The service is not there when needed.<br/>D. Nothing secret was read.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đây là chất lượng phần mềm, không phải mục tiêu an toàn.<br/>B. Không dữ liệu nào bị sửa.<br/>C. Dịch vụ không còn sẵn khi cần.<br/>D. Không có gì bí mật bị đọc.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What runs Java bytecode on a machine?</p></div><div class=\"ml-vi\"><p>Cái gì chạy bytecode Java trên một máy?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "The Java Virtual Machine|||Máy ảo Java (JVM)"
            },
            {
              "text": "The assembler|||Trình hợp dịch"
            },
            {
              "text": "The BIOS|||BIOS"
            },
            {
              "text": "The Web browser&#39;s DNS cache|||Bộ đệm DNS của trình duyệt"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. The JVM interprets bytecode and may compile hot code at run time.<br/>B. An assembler translates assembly language.<br/>C. The BIOS starts the machine.<br/>D. A DNS cache stores name lookups.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. JVM thông dịch bytecode và có thể biên dịch đoạn chạy nhiều ngay lúc chạy.<br/>B. Trình hợp dịch dịch hợp ngữ.<br/>C. BIOS khởi động máy.<br/>D. Bộ đệm DNS lưu kết quả tra tên.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>What does a primary key do in a relation?</p></div><div class=\"ml-vi\"><p>Khoá chính làm gì trong một quan hệ?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "It sorts the table alphabetically|||Sắp bảng theo bảng chữ cái"
            },
            {
              "text": "It links to a table in another database|||Nối tới bảng ở cơ sở dữ liệu khác"
            },
            {
              "text": "It encrypts the row|||Mã hoá hàng"
            },
            {
              "text": "It uniquely identifies each tuple|||Định danh duy nhất mỗi bộ (tuple)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: D.</strong><br/>A. A key identifies rows; it says nothing about alphabetical order.<br/>B. Linking between tables is what a foreign key does.<br/>C. Keys here are not cryptographic.<br/>D. No two rows may have the same primary key value.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: D.</strong><br/>A. Khoá định danh hàng, không nói về thứ tự bảng chữ cái.<br/>B. Nối giữa các bảng là việc của khoá ngoại.<br/>C. Khoá ở đây không phải khoá mật mã.<br/>D. Không hai hàng nào có cùng giá trị khoá chính.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>An uncompressed bitmap image is 1024 x 768 pixels with 24-bit colour. How many bytes does it take?</p></div><div class=\"ml-vi\"><p>Một ảnh bitmap không nén 1024 x 768 điểm ảnh, màu 24 bit. Ảnh chiếm bao nhiêu byte?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "2,359,296|||2,359,296"
            },
            {
              "text": "18,874,368|||18,874,368"
            },
            {
              "text": "786,432|||786,432"
            },
            {
              "text": "1,792|||1,792"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: A.</strong><br/>A. 1024 x 768 pixels x 3 bytes each.<br/>B. That is the size in bits.<br/>C. That is one byte per pixel.<br/>D. That adds the two dimensions.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: A.</strong><br/>A. 1024 x 768 điểm ảnh x 3 byte mỗi điểm.<br/>B. Đó là kích thước tính bằng bit.<br/>C. Đó là một byte mỗi điểm ảnh.<br/>D. Cách đó cộng hai chiều.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>A program must store Vietnamese text with all its accents. Which encoding is suitable?</p></div><div class=\"ml-vi\"><p>Chương trình phải lưu tiếng Việt có đủ dấu. Bảng mã nào phù hợp?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Two&#39;s complement|||Bù hai"
            },
            {
              "text": "IEEE 754|||IEEE 754"
            },
            {
              "text": "UTF-8|||UTF-8"
            },
            {
              "text": "7-bit ASCII|||ASCII 7 bit"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: C.</strong><br/>A. That is for signed integers.<br/>B. That is for real numbers.<br/>C. UTF-8 is a Unicode encoding, and Unicode covers all major languages.<br/>D. It has only 128 symbols, with no Vietnamese letters.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: C.</strong><br/>A. Đó là cách lưu số nguyên có dấu.<br/>B. Đó là cách lưu số thực.<br/>C. Unicode có ký tự của mọi ngôn ngữ lớn.<br/>D. Chỉ có 128 ký hiệu, không có chữ Việt.</p></div>"
        },
        {
          "kind": "MCQ",
          "points": 0.17,
          "prompt": "<div class=\"ml-en\"><p>At the start of the fetch step, the CPU must know where in memory to read from. Which register tells it?</p></div><div class=\"ml-vi\"><p>Đầu bước lấy lệnh, CPU phải biết đọc ở chỗ nào trong bộ nhớ. Thanh ghi nào cho nó biết?</p></div>",
          "imageUrl": null,
          "options": [
            {
              "text": "Accumulator|||Thanh ghi tích luỹ"
            },
            {
              "text": "Program counter|||Bộ đếm chương trình"
            },
            {
              "text": "Data register|||Thanh ghi dữ liệu"
            },
            {
              "text": "Instruction register|||Thanh ghi lệnh"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><p><strong>Correct: B.</strong><br/>A. It holds intermediate results of operations.<br/>B. The PC points at the next instruction and is updated in each cycle.<br/>C. It holds data passing to or from memory.<br/>D. It holds the instruction being decoded, not an address.</p></div><div class=\"ml-vi\"><p><strong>Đáp án đúng: B.</strong><br/>A. Nó giữ kết quả trung gian của phép toán.<br/>B. PC trỏ tới lệnh kế tiếp và được cập nhật mỗi chu kỳ.<br/>C. Nó giữ dữ liệu đi tới hoặc từ bộ nhớ.<br/>D. Nó giữ lệnh đang giải mã, không giữ địa chỉ.</p></div>"
        }
      ],
      "sourceNote": "tự soạn theo dạng đề"
    }
  ]
};
