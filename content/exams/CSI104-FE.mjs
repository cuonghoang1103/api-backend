// CSI104 — Introduction to Computer Science. Real FE multiple-choice papers,
// transcribed from the school's images; answers + bilingual explanations
// authored here. Auto-generated from the banks.
export default {
  "course": {
    "courseCode": "CSI104"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "CSI-D1",
      "source": "REAL",
      "sortOrder": 0,
      "title": "Đề 1 — SP2024 Block 5 Final Exam|||Đề 1 — Thi cuối kỳ SP2024 Block 5",
      "description": "CSI104 real FE multiple-choice paper (Spring 2024, Block 5), transcribed from the exam images; no answer key was shown, answers reasoned here. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2024, Block 5), chép từ ảnh đề; ảnh không có đáp án, được suy luận và biên soạn tại đây. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In peripheral device management, what is the principle of hierarchical work on OS of third-generation computers?|||Trong quản lý thiết bị ngoại vi, nguyên tắc làm việc phân cấp trên hệ điều hành của máy tính thế hệ thứ ba là gì?",
          "options": [
            {
              "text": "Processor - Peripheral device - Control device|||Bộ xử lý - Thiết bị ngoại vi - Bộ điều khiển"
            },
            {
              "text": "Processor - Control device - Peripheral device|||Bộ xử lý - Bộ điều khiển - Thiết bị ngoại vi"
            },
            {
              "text": "Control device - Peripheral device - Processor|||Bộ điều khiển - Thiết bị ngoại vi - Bộ xử lý"
            },
            {
              "text": "None of the answers are correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The CPU issues a command to a <b>control device</b> (device controller), which in turn drives the physical <b>peripheral device</b> — a strict top-down chain of command.</div><div class=\"ml-vi\">CPU phát lệnh tới <b>bộ điều khiển</b> (device controller), rồi bộ điều khiển mới thao tác <b>thiết bị ngoại vi</b> vật lý — một chuỗi điều khiển từ trên xuống nghiêm ngặt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____are unwanted programs that are hidden within other programs (host). When the user executes the host program|||_____ là những chương trình không mong muốn ẩn bên trong chương trình khác (chương trình chủ). Khi người dùng chạy chương trình chủ",
          "options": [
            {
              "text": "DoS|||DoS"
            },
            {
              "text": "Trojan horses|||Ngựa thành Troy (Trojan horses)"
            },
            {
              "text": "Worms|||Sâu máy tính (Worms)"
            },
            {
              "text": "Viruses|||Virus"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>Trojan horse</b> hides inside a legitimate host program and activates when the user runs that host — unlike a worm (self-propagating, no host) or a virus (attaches to files and self-replicates).</div><div class=\"ml-vi\"><b>Trojan horse</b> ẩn bên trong một chương trình chủ hợp lệ và kích hoạt khi người dùng chạy chương trình chủ đó — khác với worm (tự lan truyền, không cần chương trình chủ) hay virus (gắn vào file và tự nhân bản).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Testing a software system can involve _______ testing.|||Kiểm thử một hệ thống phần mềm có thể bao gồm kiểm thử _______.",
          "options": [
            {
              "text": "Black-box|||Hộp đen (black-box)"
            },
            {
              "text": "Glass-box|||Hộp kính (glass-box)"
            },
            {
              "text": "Neither black-box nor glass-box|||Không phải hộp đen cũng không phải hộp kính"
            },
            {
              "text": "Both black-box and glass-box|||Cả hộp đen lẫn hộp kính"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Software testing uses <b>both</b> approaches: black-box testing checks behaviour against specifications without looking at the code, while glass-box (white-box) testing examines the internal logic and code paths.</div><div class=\"ml-vi\">Kiểm thử phần mềm dùng <b>cả hai</b> cách tiếp cận: kiểm thử hộp đen kiểm tra hành vi theo đặc tả mà không nhìn vào mã nguồn, còn kiểm thử hộp kính (hộp trắng) xem xét logic nội bộ và các nhánh mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The role of the physical layer is to transfer the bits received from the data-link layer and convert them to _______for transmission.|||Vai trò của tầng vật lý là truyền các bit nhận từ tầng liên kết dữ liệu và chuyển chúng thành _______ để truyền đi.",
          "options": [
            {
              "text": "Analog signals|||Tín hiệu tương tự"
            },
            {
              "text": "Electromagnetic signals|||Tín hiệu điện từ"
            },
            {
              "text": "Digital signals|||Tín hiệu số"
            },
            {
              "text": "Electronic signals|||Tín hiệu điện tử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">To be transmitted over any medium (wire, fibre or air), data must be transformed into <b>electromagnetic signals</b> — the physical layer's job, regardless of whether the signal ends up analog or digital.</div><div class=\"ml-vi\">Để truyền qua bất kỳ môi trường nào (dây dẫn, cáp quang hay không khí), dữ liệu phải được chuyển thành <b>tín hiệu điện từ</b> — đây là nhiệm vụ của tầng vật lý, bất kể tín hiệu cuối cùng là tương tự hay số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A stack is a _________ structure.|||Ngăn xếp (stack) là cấu trúc _________.",
          "options": [
            {
              "text": "FIFO|||FIFO"
            },
            {
              "text": "LIFO|||LIFO"
            },
            {
              "text": "DIFO|||DIFO"
            },
            {
              "text": "SIFO|||SIFO"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A stack is <b>LIFO</b> (Last In, First Out): the most recently pushed item is the first one popped.</div><div class=\"ml-vi\">Ngăn xếp là <b>LIFO</b> (Vào sau, Ra trước): phần tử được đẩy vào gần nhất sẽ là phần tử lấy ra đầu tiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The enqueue operation ____ an item at the ___of the queue.|||Thao tác enqueue ____ một phần tử ở ___ của hàng đợi.",
          "options": [
            {
              "text": "Delete/front|||Xoá/đầu"
            },
            {
              "text": "Delete/end|||Xoá/cuối"
            },
            {
              "text": "Inserts/front|||Chèn/đầu"
            },
            {
              "text": "Insert/rear|||Chèn/cuối"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Enqueue</b> inserts a new item at the <b>rear</b> of the queue; dequeue removes from the front — this is what makes a queue FIFO.</div><div class=\"ml-vi\"><b>Enqueue</b> chèn một phần tử mới vào <b>cuối</b> hàng đợi; dequeue lấy ra từ đầu hàng đợi — đó là lý do hàng đợi hoạt động theo kiểu FIFO.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To define the processes in transport layer, we need two identifiers, called IP and _________|||Để định danh các tiến trình ở tầng vận chuyển, ta cần hai định danh, gọi là địa chỉ IP và _________",
          "options": [
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "Port numbers|||Số hiệu cổng (port numbers)"
            },
            {
              "text": "IP datagram|||Gói tin IP (IP datagram)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The IP address identifies the <b>host</b>; the <b>port number</b> identifies the specific process (application) on that host, together forming a socket address.</div><div class=\"ml-vi\">Địa chỉ IP định danh <b>máy chủ</b>; <b>số hiệu cổng</b> định danh tiến trình (ứng dụng) cụ thể trên máy đó, kết hợp lại tạo thành địa chỉ socket.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following attacks is threatening confidentiality?|||Kiểu tấn công nào sau đây đe doạ tính bí mật (confidentiality)?",
          "options": [
            {
              "text": "Masquerading|||Giả mạo (masquerading)"
            },
            {
              "text": "Repudiation|||Chối bỏ (repudiation)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ (denial of service)"
            },
            {
              "text": "Traffic analysis|||Phân tích lưu lượng (traffic analysis)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Traffic analysis</b> is a passive attack: the attacker observes patterns/volume of traffic to infer confidential information, without altering anything — a classic confidentiality threat. Masquerading and denial of service threaten authentication/availability instead.</div><div class=\"ml-vi\"><b>Phân tích lưu lượng</b> là tấn công thụ động: kẻ tấn công quan sát mẫu/khối lượng lưu lượng để suy ra thông tin bí mật mà không thay đổi gì cả — một đe doạ điển hình với tính bí mật. Giả mạo và từ chối dịch vụ đe doạ tính xác thực/tính sẵn sàng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One of the first computers based on the von Neumann model was called ________.|||Một trong những máy tính đầu tiên dựa trên mô hình von Neumann được gọi là ________.",
          "options": [
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Pascaline|||Pascaline"
            },
            {
              "text": "ABC|||ABC"
            },
            {
              "text": "EDVAC|||EDVAC"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>EDVAC</b> was designed following von Neumann's 1945 report describing the stored-program concept, making it one of the first computers built on the von Neumann model.</div><div class=\"ml-vi\"><b>EDVAC</b> được thiết kế theo báo cáo năm 1945 của von Neumann mô tả khái niệm chương trình lưu trữ, nên đây là một trong những máy tính đầu tiên xây dựng theo mô hình von Neumann.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "__________ cryptography is often used for short messages.|||Mật mã __________ thường được dùng cho các thông điệp ngắn.",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Secret-key|||Khoá bí mật"
            },
            {
              "text": "Open-key|||Khoá mở"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> (public-key) cryptography is computationally expensive, so it is typically reserved for short messages (e.g. key exchange, digital signatures); symmetric-key is used for long messages/bulk data.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> (khoá công khai) tốn nhiều tính toán nên thường chỉ dùng cho thông điệp ngắn (như trao đổi khoá, chữ ký số); khoá đối xứng dùng cho thông điệp dài/khối lượng dữ liệu lớn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In CISC (complex instruction set compute), an instruction in machine language is not executed directly by the CPU–the CPU performs only simple operations, that is called ___|||Trong CISC (tập lệnh phức tạp), một lệnh mã máy không được CPU thực thi trực tiếp – CPU chỉ thực hiện các thao tác đơn giản, kỹ thuật đó gọi là ___",
          "options": [
            {
              "text": "Microoperations|||Vi thao tác"
            },
            {
              "text": "Micromemory|||Vi bộ nhớ"
            },
            {
              "text": "Microcomputer|||Vi máy tính"
            },
            {
              "text": "Microprogramming|||Vi lập trình"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Microprogramming</b> implements each complex machine instruction as a sequence of simple micro-operations controlled by microcode, rather than hard-wired control logic.</div><div class=\"ml-vi\"><b>Vi lập trình</b> hiện thực mỗi lệnh máy phức tạp thành một chuỗi vi thao tác đơn giản do vi mã điều khiển, thay vì dùng logic điều khiển nối cứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a three-level DBMS architecture, the ________ level determines where data is actually stored on storage devices.|||Trong kiến trúc DBMS ba mức, mức ________ xác định dữ liệu thực sự được lưu ở đâu trên thiết bị lưu trữ.",
          "options": [
            {
              "text": "External|||Ngoài (external)"
            },
            {
              "text": "Conceptual|||Khái niệm (conceptual)"
            },
            {
              "text": "Internal|||Trong (internal)"
            },
            {
              "text": "Physical|||Vật lý"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The ANSI-SPARC three-level architecture is External, Conceptual and <b>Internal</b>; the internal (physical) level describes how data is actually stored on disk.</div><div class=\"ml-vi\">Kiến trúc ba mức ANSI-SPARC gồm External, Conceptual và <b>Internal</b>; mức internal (vật lý) mô tả cách dữ liệu thực sự được lưu trên đĩa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The organization and interconnection of the various components of a computer system is|||Sự tổ chức và kết nối giữa các thành phần khác nhau của một hệ thống máy tính được gọi là",
          "options": [
            {
              "text": "Architecture|||Kiến trúc (architecture)"
            },
            {
              "text": "Networks|||Mạng máy tính"
            },
            {
              "text": "Graphics|||Đồ hoạ"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the textbook definition of computer <b>architecture</b>: how the components of a computer are organized and interconnected.</div><div class=\"ml-vi\">Đây là định nghĩa kinh điển của <b>kiến trúc máy tính</b>: cách các thành phần của máy tính được tổ chức và kết nối với nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is equivalent to 12 in decimal?|||Giá trị nào sau đây tương đương với 12 trong hệ thập phân?",
          "options": [
            {
              "text": "(1110)2|||(1110)2"
            },
            {
              "text": "(C)16|||(C)16"
            },
            {
              "text": "(15)8|||(15)8"
            },
            {
              "text": "None of the above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Hex digit C = 12 in decimal, so (C)16 = 12. (1110)2 = 14 and (15)8 = 13, so neither matches.</div><div class=\"ml-vi\">Chữ số hex C = 12 trong hệ thập phân, nên (C)16 = 12. (1110)2 = 14 và (15)8 = 13, không khớp giá trị 12.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A byte consists of ________ bits.|||Một byte gồm ________ bit.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">By definition, 1 <b>byte</b> = <b>8 bits</b>.</div><div class=\"ml-vi\">Theo định nghĩa, 1 <b>byte</b> = <b>8 bit</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the relational database model, data is organized in ______called relations.|||Trong mô hình cơ sở dữ liệu quan hệ, dữ liệu được tổ chức thành ______ gọi là các quan hệ.",
          "options": [
            {
              "text": "Two-dimensional array|||Mảng hai chiều"
            },
            {
              "text": "Two-dimensional tables|||Bảng hai chiều"
            },
            {
              "text": "Two-dimensional record|||Bản ghi hai chiều"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the relational model, data is organized into <b>two-dimensional tables</b> (rows and columns), formally called relations.</div><div class=\"ml-vi\">Trong mô hình quan hệ, dữ liệu được tổ chức thành các <b>bảng hai chiều</b> (dòng và cột), gọi chính thức là các quan hệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A____ is a predetermined value used in a program and it may change value with time. (Choose 2 answers)|||A____ là một giá trị định trước dùng trong chương trình và nó có thể thay đổi giá trị theo thời gian. (Chọn 2 đáp án)",
          "options": [
            {
              "text": "Constants|||Hằng số (constants)"
            },
            {
              "text": "Literals|||Giá trị chữ (literals)"
            },
            {
              "text": "Input/output|||Vào/ra (input/output)"
            },
            {
              "text": "Variables|||Biến (variables)"
            }
          ],
          "correctIndexes": [
            0,
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>constant</b> holds a predetermined value that never changes, while a <b>variable</b> is initialized with a value and may change over time — together the two terms this compound description covers.</div><div class=\"ml-vi\"><b>Hằng số</b> giữ một giá trị định trước không bao giờ đổi, còn <b>biến</b> được khởi tạo với một giá trị và có thể thay đổi theo thời gian — hai khái niệm này khớp với mô tả ghép trong câu hỏi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a _____ the project team needs to choose a language or a set of languages from among procedural languages|||Trong _____ nhóm dự án cần chọn một ngôn ngữ hoặc một tập ngôn ngữ trong số các ngôn ngữ thủ tục",
          "options": [
            {
              "text": "Analysis phase|||Giai đoạn phân tích"
            },
            {
              "text": "Design phase|||Giai đoạn thiết kế"
            },
            {
              "text": "Implementation phase|||Giai đoạn cài đặt"
            },
            {
              "text": "Testing phase|||Giai đoạn kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Choosing the implementation language/technology is a technical decision made during the <b>design phase</b>, before actual coding (implementation) begins.</div><div class=\"ml-vi\">Việc chọn ngôn ngữ/công nghệ cài đặt là quyết định kỹ thuật được đưa ra trong <b>giai đoạn thiết kế</b>, trước khi bắt đầu viết mã (giai đoạn cài đặt).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____these are the “bad guys”. They are the types of hackers who break into computer networks with purely negative motives such as monetary gain or reputation.|||____ đây là những kẻ “xấu”. Đó là loại hacker đột nhập mạng máy tính hoàn toàn vì động cơ tiêu cực như trục lợi hoặc danh tiếng.",
          "options": [
            {
              "text": "Black Hat Hacker|||Hacker mũ đen (Black Hat)"
            },
            {
              "text": "Grey Hat Hacker|||Hacker mũ xám (Grey Hat)"
            },
            {
              "text": "Red Hat Hacker|||Hacker mũ đỏ (Red Hat)"
            },
            {
              "text": "Blue Hat Hacker|||Hacker mũ lam (Blue Hat)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Black Hat</b> hackers break into systems with malicious/criminal intent, unlike White Hat (ethical) or Grey Hat (in-between) hackers.</div><div class=\"ml-vi\"><b>Hacker mũ đen</b> đột nhập hệ thống với ý đồ xấu/phạm pháp, khác với mũ trắng (đạo đức) hay mũ xám (trung gian).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An error in computer data is called|||Một lỗi trong dữ liệu máy tính được gọi là",
          "options": [
            {
              "text": "Chip|||Chip"
            },
            {
              "text": "Bug|||Lỗi (bug)"
            },
            {
              "text": "Bit|||Bit"
            },
            {
              "text": "Byte|||Byte"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An error in a program or its data is commonly called a <b>bug</b>.</div><div class=\"ml-vi\">Một lỗi trong chương trình hoặc dữ liệu của nó thường được gọi là <b>bug</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which data structure is a suitable structure if a large number of insertions and deletions are needed but searching it is slower that searching an array?|||Cấu trúc dữ liệu nào phù hợp khi cần nhiều thao tác chèn và xoá, nhưng việc tìm kiếm trên nó chậm hơn tìm kiếm trên mảng?",
          "options": [
            {
              "text": "An array|||Mảng (array)"
            },
            {
              "text": "A record|||Bản ghi (record)"
            },
            {
              "text": "A linked list|||Danh sách liên kết (linked list)"
            },
            {
              "text": "A file|||Tệp (file)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>linked list</b> allows O(1) insertion/deletion at a known position (no shifting like an array), at the cost of only sequential (slower) search.</div><div class=\"ml-vi\"><b>Danh sách liên kết</b> cho phép chèn/xoá O(1) tại vị trí đã biết (không cần dịch chuyển như mảng), đổi lại tìm kiếm chỉ có thể tuần tự (chậm hơn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ____________, the identity of a party is verified once for the entire duration of system access.|||Trong ____________, danh tính của một bên được xác minh một lần cho toàn bộ thời gian truy cập hệ thống.",
          "options": [
            {
              "text": "entity authentication|||xác thực thực thể (entity authentication)"
            },
            {
              "text": "message integrity|||toàn vẹn thông điệp"
            },
            {
              "text": "message authentication|||xác thực thông điệp"
            },
            {
              "text": "message encryption|||mã hoá thông điệp"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Entity authentication</b> verifies identity once (e.g. at login) for the whole session, whereas message authentication verifies each individual message.</div><div class=\"ml-vi\"><b>Xác thực thực thể</b> xác minh danh tính một lần (ví dụ lúc đăng nhập) cho cả phiên làm việc, còn xác thực thông điệp xác minh từng thông điệp riêng lẻ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ model is the basis for today's computers.|||Mô hình ________ là nền tảng cho các máy tính ngày nay.",
          "options": [
            {
              "text": "Leibnitz|||Leibnitz"
            },
            {
              "text": "Von Neumann|||Von Neumann"
            },
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Charles Babbage|||Charles Babbage"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Nearly all modern computers follow the <b>von Neumann</b> architecture: a single memory holding both program and data, executed sequentially by the CPU.</div><div class=\"ml-vi\">Hầu hết máy tính hiện đại đều theo kiến trúc <b>von Neumann</b>: một bộ nhớ duy nhất chứa cả chương trình lẫn dữ liệu, được CPU thực thi tuần tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A database management system (DBMS) is a combination of _____components|||Hệ quản trị cơ sở dữ liệu (DBMS) là sự kết hợp của _____ thành phần",
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A DBMS environment is typically described as a combination of <b>5</b> components: hardware, software, data, procedures and people.</div><div class=\"ml-vi\">Môi trường DBMS thường được mô tả gồm <b>5</b> thành phần: phần cứng, phần mềm, dữ liệu, quy trình và con người.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The binary equivalent of the Octal number 13.54 is|||Số nhị phân tương đương của số bát phân 13.54 là",
          "options": [
            {
              "text": "1011.1011|||1011.1011"
            },
            {
              "text": "1101.1110|||1101.1110"
            },
            {
              "text": "1001.1110|||1001.1110"
            },
            {
              "text": "All of the others|||Tất cả đáp án khác"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Convert each octal digit to 3 bits: 1=001, 3=011 &rarr; integer part 001011 = 1011; 5=101, 4=100 &rarr; fraction 101100, trailing zeros dropped = 1011. Result: <b>1011.1011</b>.</div><div class=\"ml-vi\">Đổi từng chữ số bát phân sang 3 bit: 1=001, 3=011 &rarr; phần nguyên 001011 = 1011; 5=101, 4=100 &rarr; phần thập phân 101100, bỏ số 0 cuối = 1011. Kết quả: <b>1011.1011</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A _____WAN is a network that connects two communicating devices through a transmission medium (cable or air)|||Một WAN _____ là mạng kết nối hai thiết bị truyền thông qua một môi trường truyền (cáp hoặc không khí)",
          "options": [
            {
              "text": "Peer-to-peer|||Ngang hàng (peer-to-peer)"
            },
            {
              "text": "Node -to-node|||Nút-tới-nút"
            },
            {
              "text": "Point-to-point|||Điểm-tới-điểm (point-to-point)"
            },
            {
              "text": "Data link|||Liên kết dữ liệu"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>point-to-point</b> WAN directly connects exactly two devices through a transmission medium, with no intermediate switching.</div><div class=\"ml-vi\">WAN <b>điểm-tới-điểm</b> kết nối trực tiếp đúng hai thiết bị qua một môi trường truyền, không qua chuyển mạch trung gian.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a simple right shift operation on the bit pattern 1001 1000.|||Áp dụng phép dịch phải đơn giản (logic) lên chuỗi bit 1001 1000.",
          "options": [
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            },
            {
              "text": "0100 1101|||0100 1101"
            },
            {
              "text": "0100 1100|||0100 1100"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A simple (logical) right shift moves every bit one position right and fills the new MSB with 0: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b> (the rightmost 0 is dropped).</div><div class=\"ml-vi\">Dịch phải đơn giản (logic) đẩy mọi bit sang phải một vị trí và điền 0 vào bit cao nhất mới: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b> (bit thấp nhất cũ bị loại bỏ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is a set of characters that is treated like an array in some languages and as a type in others.|||_____ là một tập ký tự được xem như mảng trong một số ngôn ngữ và như một kiểu dữ liệu trong các ngôn ngữ khác.",
          "options": [
            {
              "text": "A string|||Chuỗi (string)"
            },
            {
              "text": "A record|||Bản ghi (record)"
            },
            {
              "text": "A symbol|||Ký hiệu (symbol)"
            },
            {
              "text": "A link|||Liên kết (link)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>string</b> is treated as a character array in languages like C, but as a dedicated built-in type in languages like Python or Java.</div><div class=\"ml-vi\"><b>Chuỗi (string)</b> được xem như mảng ký tự trong các ngôn ngữ như C, nhưng là kiểu dữ liệu dựng sẵn riêng trong các ngôn ngữ như Python hay Java.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use an arithmetic right shift operation on the bit pattern 10011001. The pattern is an integer in two's complement format.|||Áp dụng phép dịch phải số học lên chuỗi bit 10011001. Chuỗi này là số nguyên ở dạng bù hai.",
          "options": [
            {
              "text": "10001100|||10001100"
            },
            {
              "text": "11001100|||11001100"
            },
            {
              "text": "11001101|||11001101"
            },
            {
              "text": "10011001|||10011001"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An arithmetic right shift preserves the sign bit: shift right and duplicate the sign bit (1) into the new MSB: 1001&thinsp;1001 &rarr; <b>1100&thinsp;1100</b> (dropping the rightmost bit).</div><div class=\"ml-vi\">Dịch phải số học giữ nguyên bit dấu: dịch phải rồi lặp lại bit dấu (1) vào bit cao nhất mới: 1001&thinsp;1001 &rarr; <b>1100&thinsp;1100</b> (bỏ bit thấp nhất cũ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What type of OS evolution that need for more speed and efficiency led to the design with multiple CPUs on the same machine?|||Kiểu tiến hoá hệ điều hành nào, do nhu cầu tốc độ và hiệu năng, dẫn tới thiết kế nhiều CPU trên cùng một máy?",
          "options": [
            {
              "text": "Personal systems|||Hệ thống cá nhân"
            },
            {
              "text": "Distributed systems|||Hệ thống phân tán"
            },
            {
              "text": "Parallel systems|||Hệ thống song song"
            },
            {
              "text": "Real-time systems|||Hệ thống thời gian thực"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Parallel (multiprocessor) systems</b> put multiple CPUs in one machine to increase throughput and efficiency beyond what a single processor can achieve.</div><div class=\"ml-vi\"><b>Hệ thống song song</b> (đa xử lý) đặt nhiều CPU trong cùng một máy để tăng thông lượng và hiệu năng vượt quá khả năng của một bộ xử lý đơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One phase in system development is ________.|||Một giai đoạn trong phát triển hệ thống là ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Application|||Ứng dụng"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "Collecting|||Thu thập"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The standard SDLC phases include <b>Analysis</b>, Design, Implementation and Testing/Maintenance; the other options are not standard phase names.</div><div class=\"ml-vi\">Các giai đoạn SDLC chuẩn gồm <b>Phân tích</b>, Thiết kế, Cài đặt và Kiểm thử/Bảo trì; các đáp án còn lại không phải tên giai đoạn chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a positional number system with base b, we can always find the number of digits of an integer. So how many digits can we find in the decimal number 20 in hexadecimal system?|||Trong hệ đếm vị trí cơ số b, ta luôn tìm được số chữ số của một số nguyên. Vậy số 20 trong hệ thập phân có bao nhiêu chữ số khi biểu diễn ở hệ thập lục phân?",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">20 in decimal = 14 in hexadecimal, which has <b>2</b> digits.</div><div class=\"ml-vi\">20 trong hệ thập phân = 14 trong hệ thập lục phân, có <b>2</b> chữ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A computer language that is written in binary codes only is ______|||Một ngôn ngữ máy tính chỉ được viết bằng mã nhị phân là ______",
          "options": [
            {
              "text": "machine language|||Ngôn ngữ máy (machine language)"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "C#|||C#"
            },
            {
              "text": "pascal|||Pascal"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Machine language</b> is the only language executed directly by the CPU, written purely as binary codes; C, C#, and Pascal are high-level languages that must be compiled/translated.</div><div class=\"ml-vi\"><b>Ngôn ngữ máy</b> là ngôn ngữ duy nhất được CPU thực thi trực tiếp, viết hoàn toàn bằng mã nhị phân; C, C# và Pascal là ngôn ngữ bậc cao cần được biên dịch/chuyển đổi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ construct uses a set of actions one after another.|||Cấu trúc ________ sử dụng một tập hành động thực hiện lần lượt cái này sau cái kia.",
          "options": [
            {
              "text": "Sequence|||Tuần tự (sequence)"
            },
            {
              "text": "Decision|||Rẽ nhánh (decision)"
            },
            {
              "text": "Repetition|||Lặp (repetition)"
            },
            {
              "text": "Flow|||Luồng (flow)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Sequence</b> is the basic control structure where actions execute one after another in order, with no branching or looping.</div><div class=\"ml-vi\"><b>Tuần tự</b> là cấu trúc điều khiển cơ bản, các hành động thực hiện lần lượt theo thứ tự, không rẽ nhánh hay lặp lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is a unit representing the no bits of discrete.|||Đơn vị nào biểu diễn một giá trị rời rạc (0 hoặc 1)?",
          "options": [
            {
              "text": "Baud|||Baud"
            },
            {
              "text": "Byte|||Byte"
            },
            {
              "text": "Bit|||Bit"
            },
            {
              "text": "All of the others|||Tất cả đáp án khác"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>bit</b> (binary digit) is the fundamental unit of a single discrete (0 or 1) value.</div><div class=\"ml-vi\"><b>Bit</b> (chữ số nhị phân) là đơn vị cơ bản nhất biểu diễn một giá trị rời rạc (0 hoặc 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the ________ graphic method of representing an image in a computer, each pixel is assigned a bit patterns.|||Trong phương pháp đồ hoạ ________ biểu diễn ảnh trên máy tính, mỗi điểm ảnh được gán một chuỗi bit.",
          "options": [
            {
              "text": "Bitmap|||Ảnh điểm (bitmap)"
            },
            {
              "text": "Vector|||Ảnh vector"
            },
            {
              "text": "Quantized|||Lượng tử hoá"
            },
            {
              "text": "Binary|||Nhị phân"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Bitmap (raster)</b> graphics represent an image as a grid of pixels, each assigned its own bit pattern (colour value); vector graphics instead store mathematical shape descriptions.</div><div class=\"ml-vi\">Đồ hoạ <b>bitmap (raster)</b> biểu diễn ảnh bằng lưới điểm ảnh, mỗi điểm được gán riêng một chuỗi bit (giá trị màu); đồ hoạ vector thì lưu mô tả hình học bằng công thức toán.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is language of procedural paradigm that is high level language and  also has some low-level instructions?|||Ngôn ngữ nào theo mô hình thủ tục, là ngôn ngữ bậc cao nhưng vẫn có một số lệnh cấp thấp?",
          "options": [
            {
              "text": "COBOL|||COBOL"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Ada|||Ada"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>C</b> is known as a high-level language that still allows low-level operations such as pointer arithmetic and direct memory/bit manipulation.</div><div class=\"ml-vi\"><b>C</b> nổi tiếng là ngôn ngữ bậc cao nhưng vẫn cho phép các thao tác cấp thấp như số học con trỏ và thao tác trực tiếp bộ nhớ/bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular left shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch trái vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0001 1001|||0001 1001"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A circular left shift moves every bit one position left and wraps the old MSB around to become the new LSB: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div><div class=\"ml-vi\">Dịch trái vòng đẩy mọi bit sang trái một vị trí và đưa bit cao nhất cũ vòng xuống thành bit thấp nhất mới: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The base of the binary number system is ____.|||Cơ số của hệ đếm nhị phân là ____.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>binary</b> number system has base <b>2</b> (digits 0 and 1).</div><div class=\"ml-vi\">Hệ đếm <b>nhị phân</b> có cơ số <b>2</b> (chỉ có chữ số 0 và 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ are keys that hash to the same location in the data file.|||________ là các khoá cùng băm (hash) tới cùng một vị trí trong tệp dữ liệu.",
          "options": [
            {
              "text": "Collisions|||Va chạm (collisions)"
            },
            {
              "text": "Buckets|||Nhóm chứa (buckets)"
            },
            {
              "text": "Synonyms|||Từ đồng nghĩa (synonyms)"
            },
            {
              "text": "Linked lists|||Danh sách liên kết"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Keys that hash to the same slot are called <b>synonyms</b>; a <b>collision</b> is the event of two synonyms mapping to the same location, and a <b>bucket</b> is the storage slot itself.</div><div class=\"ml-vi\">Các khoá cùng băm tới một vị trí được gọi là <b>synonyms</b>; <b>collision</b> (va chạm) là sự kiện hai synonym cùng ánh xạ tới một vị trí, còn <b>bucket</b> là chính vị trí lưu trữ đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ ciphers are sometimes called public-key ciphers|||Mật mã _____ đôi khi còn được gọi là mật mã khoá công khai",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> ciphers use a public/private key pair, so they are also called public-key ciphers.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> dùng một cặp khoá công khai/riêng tư, nên còn được gọi là mật mã khoá công khai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_________between modules in a software system must be minimized.|||_________ giữa các mô-đun trong một hệ thống phần mềm phải được giảm thiểu.",
          "options": [
            {
              "text": "Coupling|||Sự kết dính giữa mô-đun (coupling)"
            },
            {
              "text": "Cohesion|||Tính liên kết nội bộ (cohesion)"
            },
            {
              "text": "Neither coupling nor cohesion|||Không phải cả hai"
            },
            {
              "text": "Both coupling and cohesion|||Cả hai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Good software design minimizes <b>coupling</b> (dependency between modules) while maximizing cohesion (relatedness within a module) — the opposite of what this question's other options suggest.</div><div class=\"ml-vi\">Thiết kế phần mềm tốt cần giảm thiểu <b>coupling</b> (sự phụ thuộc giữa các mô-đun) trong khi tăng tối đa cohesion (sự liên kết nội bộ trong một mô-đun) — ngược với các phương án còn lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ scheduler creates a process from a job and changes a process back to a job.|||Bộ lập lịch ________ tạo một tiến trình từ một công việc (job) và có thể đổi một tiến trình trở lại thành công việc.",
          "options": [
            {
              "text": "Job|||Công việc (job)"
            },
            {
              "text": "Process|||Tiến trình (process)"
            },
            {
              "text": "Virtual|||Ảo (virtual)"
            },
            {
              "text": "Queue|||Hàng đợi (queue)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>job scheduler</b> (long-term scheduler) selects jobs from the job pool and admits them into memory as processes.</div><div class=\"ml-vi\"><b>Bộ lập lịch công việc</b> (long-term scheduler) chọn công việc từ nhóm chờ và đưa vào bộ nhớ dưới dạng tiến trình.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A unary operator is applied to ________ relation(s) and creates an output of _________relation(s).|||Toán tử một ngôi (unary) áp dụng lên ________ quan hệ và tạo ra kết quả là _________ quan hệ.",
          "options": [
            {
              "text": "One, one|||Một, một"
            },
            {
              "text": "One, two|||Một, hai"
            },
            {
              "text": "Two, one|||Hai, một"
            },
            {
              "text": "Two, two|||Hai, hai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By definition, a <b>unary</b> operator takes exactly <b>one</b> relation as input and produces exactly <b>one</b> relation as output.</div><div class=\"ml-vi\">Theo định nghĩa, toán tử <b>một ngôi</b> nhận vào đúng <b>một</b> quan hệ và tạo ra đúng <b>một</b> quan hệ kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ file can be accessed randomly.|||Tệp _______ có thể được truy cập ngẫu nhiên.",
          "options": [
            {
              "text": "A sequential|||Tuần tự (sequential)"
            },
            {
              "text": "An indexed|||Có chỉ mục (indexed)"
            },
            {
              "text": "A hashed|||Băm (hashed)"
            },
            {
              "text": "Any|||Bất kỳ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>hashed (direct)</b> file computes a record's storage location directly from its key, giving true random/direct access; a sequential file must be read in order.</div><div class=\"ml-vi\">Tệp <b>băm (direct)</b> tính trực tiếp vị trí lưu trữ của bản ghi từ khoá của nó, cho phép truy cập ngẫu nhiên/trực tiếp thật sự; tệp tuần tự phải đọc theo thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ______ sort, the smallest item moves to the beginning of the unsorted list. There is no one-to-one swapping.|||Trong sắp xếp ______, phần tử nhỏ nhất được chuyển tới đầu danh sách chưa sắp xếp. Không có việc hoán đổi từng cặp một.",
          "options": [
            {
              "text": "Selection|||Chọn (selection)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Every|||Mọi loại"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Selection sort</b> repeatedly finds the smallest remaining item and places it at the front with a single swap per pass, unlike bubble sort's repeated adjacent swaps.</div><div class=\"ml-vi\"><b>Sắp xếp chọn</b> liên tục tìm phần tử nhỏ nhất còn lại và đặt nó lên đầu chỉ với một lần hoán đổi mỗi vòng, khác với sắp xếp nổi bọt phải hoán đổi liền kề nhiều lần.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If A is the first data element input into a queue, followed by B, C, and D, then______is the first element to be removed.|||Nếu A là phần tử dữ liệu đầu tiên được đưa vào hàng đợi, tiếp theo là B, C, D, thì______ là phần tử đầu tiên bị lấy ra.",
          "options": [
            {
              "text": "A|||A"
            },
            {
              "text": "B|||B"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "D|||D"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A queue is <b>FIFO</b> (First In, First Out), so <b>A</b>, being first in, is also first out.</div><div class=\"ml-vi\">Hàng đợi hoạt động theo kiểu <b>FIFO</b> (Vào trước, Ra trước), nên <b>A</b> vào trước cũng sẽ ra trước.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ is a protocol for accessing and transferring documents on the WWW.|||_______ là giao thức để truy cập và truyền tài liệu trên WWW.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "TELNET|||TELNET"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>HTTP</b> (HyperText Transfer Protocol) is the protocol used to access and transfer web documents.</div><div class=\"ml-vi\"><b>HTTP</b> (HyperText Transfer Protocol) là giao thức dùng để truy cập và truyền tài liệu web.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A computer has 32 MB (megabytes) of memory. How many bits are needed to address any single byte in memory?|||Một máy tính có 32 MB bộ nhớ. Cần bao nhiêu bit để định địa chỉ cho một byte bất kỳ trong bộ nhớ?",
          "options": [
            {
              "text": "5 bits|||5 bit"
            },
            {
              "text": "20 bits|||20 bit"
            },
            {
              "text": "25 bits|||25 bit"
            },
            {
              "text": "32 bits|||32 bit"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">32 MB = 2^5 &times; 2^20 = 2^25 bytes, so <b>25 bits</b> are needed to address every byte.</div><div class=\"ml-vi\">32 MB = 2^5 &times; 2^20 = 2^25 byte, nên cần <b>25 bit</b> để định địa chỉ cho mọi byte.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A _____ is simply an arrangement where multiple disk drives appear as a single disk drive to the user.|||Một _____ đơn giản là một cách sắp xếp trong đó nhiều ổ đĩa xuất hiện như một ổ đĩa duy nhất đối với người dùng.",
          "options": [
            {
              "text": "Disk|||Đĩa (disk)"
            },
            {
              "text": "Disk array|||Mảng đĩa (disk array)"
            },
            {
              "text": "Bunch of disks|||Nhóm đĩa (bunch of disks)"
            },
            {
              "text": "Disk pack|||Bộ đĩa (disk pack)"
            },
            {
              "text": "Spanned drive|||Ổ đĩa gộp (spanned drive)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>disk array</b> is an arrangement of several physical disks presented to the user as a single, large, reliable logical disk (the basis of RAID).</div><div class=\"ml-vi\"><b>Mảng đĩa (disk array)</b> là cách sắp xếp nhiều đĩa vật lý để trình hiện cho người dùng như một đĩa logic lớn, tin cậy duy nhất (nền tảng của RAID).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ is a process in which an algorithm calls itself.|||________ là quá trình trong đó một thuật toán tự gọi lại chính nó.",
          "options": [
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Searching|||Tìm kiếm (searching)"
            },
            {
              "text": "Recursion|||Đệ quy (recursion)"
            },
            {
              "text": "Iteration|||Lặp (iteration)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Recursion</b> is when an algorithm/function calls itself to solve smaller instances of the same problem.</div><div class=\"ml-vi\"><b>Đệ quy</b> là khi một thuật toán/hàm tự gọi lại chính nó để giải các bài toán con nhỏ hơn cùng loại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Each row in a relation is called ________.|||Mỗi dòng trong một quan hệ được gọi là ________.",
          "options": [
            {
              "text": "An attribute|||Thuộc tính (attribute)"
            },
            {
              "text": "A tuple|||Bộ (tuple)"
            },
            {
              "text": "A union|||Phép hợp (union)"
            },
            {
              "text": "An attitude|||Thái độ (attitude)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Each row of a relation (table) is called a <b>tuple</b>; each column is called an attribute.</div><div class=\"ml-vi\">Mỗi dòng của một quan hệ (bảng) được gọi là một <b>bộ (tuple)</b>; mỗi cột được gọi là một thuộc tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To search for elements, we can use ____ on sorted arrays that can help to decrease time complexity|||Để tìm kiếm phần tử, ta có thể dùng ____ trên mảng đã sắp xếp giúp giảm độ phức tạp thời gian",
          "options": [
            {
              "text": "Sequential search|||Tìm kiếm tuần tự"
            },
            {
              "text": "Insertion sort|||Sắp xếp chèn"
            },
            {
              "text": "Selection sort|||Sắp xếp chọn"
            },
            {
              "text": "Binary search|||Tìm kiếm nhị phân"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search</b> exploits a sorted array to cut the search space in half each step, giving O(log n) instead of O(n) for sequential search.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân</b> tận dụng mảng đã sắp xếp để giảm một nửa không gian tìm kiếm mỗi bước, cho độ phức tạp O(log n) thay vì O(n) như tìm kiếm tuần tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The parts of central processing unit (CPU) (Choose 3 answers)|||Các thành phần của bộ xử lý trung tâm (CPU) (Chọn 3 đáp án)",
          "options": [
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "Control unit|||Bộ điều khiển (control unit)"
            },
            {
              "text": "Registers|||Thanh ghi (registers)"
            },
            {
              "text": "I/O devices|||Thiết bị vào/ra"
            },
            {
              "text": "Magnetic device|||Thiết bị từ tính"
            },
            {
              "text": "Optical device|||Thiết bị quang học"
            }
          ],
          "correctIndexes": [
            0,
            1,
            2
          ],
          "explanation": "<div class=\"ml-en\">The CPU consists of the <b>ALU</b> (arithmetic/logic operations), the <b>Control unit</b> (fetch-decode-execute control) and <b>Registers</b> (fast internal storage); I/O and storage devices are peripherals, not part of the CPU.</div><div class=\"ml-vi\">CPU gồm <b>ALU</b> (thực hiện phép toán/logic), <b>Bộ điều khiển</b> (điều khiển chu trình nạp-giải mã-thực thi) và <b>Thanh ghi</b> (bộ nhớ nội bộ tốc độ cao); thiết bị vào/ra và thiết bị lưu trữ là ngoại vi, không thuộc CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ is an English-language-like representation of an algorithm. There is no standard for it- some people use a lot of detail|||____ là cách biểu diễn thuật toán gần giống ngôn ngữ tiếng Anh. Không có chuẩn chung cho nó - một số người dùng rất nhiều chi tiết",
          "options": [
            {
              "text": "Pseudocode|||Mã giả (pseudocode)"
            },
            {
              "text": "Unified Modeling Language (UML)|||Ngôn ngữ mô hình hoá thống nhất (UML)"
            },
            {
              "text": "Flowchart|||Lưu đồ (flowchart)"
            },
            {
              "text": "State diagram|||Sơ đồ trạng thái"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Pseudocode</b> is an informal, English-like description of an algorithm with no fixed standard, unlike formal notations such as UML or flowcharts.</div><div class=\"ml-vi\"><b>Mã giả (pseudocode)</b> là cách mô tả thuật toán không chính thức, gần giống tiếng Anh, không có chuẩn cố định, khác với các ký hiệu chính thức như UML hay lưu đồ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ____nonswapping technique memory is divided into equally sized sections called frames|||Trong kỹ thuật không hoán đổi ____, bộ nhớ được chia thành các phần bằng nhau gọi là khung (frames)",
          "options": [
            {
              "text": "Partitioning|||Phân vùng (partitioning)"
            },
            {
              "text": "Paging|||Phân trang (paging)"
            },
            {
              "text": "Demand paging|||Phân trang theo yêu cầu"
            },
            {
              "text": "Demand segmentation|||Phân đoạn theo yêu cầu"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Paging</b> divides physical memory into fixed-size <b>frames</b> (and logical memory into same-size pages), unlike segmentation which uses variable-sized segments.</div><div class=\"ml-vi\"><b>Phân trang (paging)</b> chia bộ nhớ vật lý thành các <b>khung (frames)</b> kích thước bằng nhau (và bộ nhớ logic thành các trang cùng kích thước), khác với phân đoạn dùng các đoạn kích thước thay đổi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If personal information about each employee in a company is stored in a file we can use _______ access to retrieve each record at the end of the month to print the paychecks|||Nếu thông tin cá nhân của mỗi nhân viên trong công ty được lưu trong một tệp, ta có thể dùng truy cập _______ để lấy từng bản ghi vào cuối tháng nhằm in phiếu lương",
          "options": [
            {
              "text": "Hashed file|||Tệp băm"
            },
            {
              "text": "Sequential file|||Tệp tuần tự"
            },
            {
              "text": "EOF|||EOF"
            },
            {
              "text": "Index file|||Tệp chỉ mục"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Printing paychecks at month-end processes <b>every</b> employee record in order, which is exactly the use case that <b>sequential</b> file access is designed for.</div><div class=\"ml-vi\">In phiếu lương cuối tháng cần xử lý <b>mọi</b> bản ghi nhân viên theo thứ tự, đây chính là tình huống phù hợp với truy cập <b>tuần tự</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is quality referring to the ability to move data and/or a system from one platform to another and to reuse code?|||Chất lượng nào đề cập tới khả năng di chuyển dữ liệu và/hoặc hệ thống từ nền tảng này sang nền tảng khác và tái sử dụng mã?",
          "options": [
            {
              "text": "Flexibility|||Tính linh hoạt"
            },
            {
              "text": "Interoperability|||Khả năng tương tác (interoperability)"
            },
            {
              "text": "Resusability|||Khả năng tái sử dụng (reusability)"
            },
            {
              "text": "Changeability|||Khả năng thay đổi"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Reusability</b> is the software quality describing components/code that can be reused across systems and platforms, minimizing rework.</div><div class=\"ml-vi\"><b>Khả năng tái sử dụng</b> là chất lượng phần mềm mô tả các thành phần/mã có thể tái sử dụng qua nhiều hệ thống và nền tảng, giảm thiểu công sức làm lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In storing audio, the quantized sample values need to be ________ as bit patterns|||Khi lưu trữ âm thanh, các giá trị mẫu đã lượng tử hoá cần được ________ thành các chuỗi bit",
          "options": [
            {
              "text": "Quantization|||Lượng tử hoá"
            },
            {
              "text": "Sampled|||Lấy mẫu"
            },
            {
              "text": "Decoded|||Giải mã"
            },
            {
              "text": "Encoded|||Mã hoá"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">After quantization, the sample values must be <b>encoded</b> into binary bit patterns for storage (the sample &rarr; quantize &rarr; encode pipeline of PCM).</div><div class=\"ml-vi\">Sau khi lượng tử hoá, các giá trị mẫu phải được <b>mã hoá</b> thành các chuỗi bit để lưu trữ (quy trình lấy mẫu &rarr; lượng tử hoá &rarr; mã hoá của PCM).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ______ layer of the TCP/IP protocol suite is responsible for source-to-destination delivery of the entire message.|||Tầng ______ trong bộ giao thức TCP/IP chịu trách nhiệm truyền toàn bộ thông điệp từ nguồn tới đích.",
          "options": [
            {
              "text": "Transport|||Vận chuyển (transport)"
            },
            {
              "text": "Network|||Mạng (network)"
            },
            {
              "text": "Data-link|||Liên kết dữ liệu"
            },
            {
              "text": "Session|||Phiên (session)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>transport layer</b> is responsible for source-to-destination (end-to-end) delivery of the entire message; the network layer only delivers individual packets.</div><div class=\"ml-vi\"><b>Tầng vận chuyển</b> chịu trách nhiệm truyền toàn bộ thông điệp từ nguồn tới đích (end-to-end); tầng mạng chỉ truyền từng gói tin riêng lẻ.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D2",
      "source": "REAL",
      "sortOrder": 1,
      "title": "Đề 2 — SP2024 Retake Exam|||Đề 2 — Thi lại SP2024",
      "description": "CSI104 real FE multiple-choice paper (Spring 2024, Retake), transcribed from the exam images; answers reasoned here. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2024, Thi lại), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Personnel who design, program, operate and maintain computer equipment refers to|||Nhân sự thiết kế, lập trình, vận hành và bảo trì thiết bị máy tính được gọi là",
          "options": [
            {
              "text": "Console-operator|||Người vận hành bảng điều khiển (console-operator)"
            },
            {
              "text": "Programmer|||Lập trình viên"
            },
            {
              "text": "Peopleware|||Nhân sự máy tính (peopleware)"
            },
            {
              "text": "System Analyst|||Chuyên viên phân tích hệ thống"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Peopleware</b> is the textbook term for all personnel involved with computer systems collectively — design, programming, operation and maintenance — one of the standard components of a computer system alongside hardware and software.</div><div class=\"ml-vi\"><b>Peopleware</b> là thuật ngữ chỉ chung toàn bộ nhân sự liên quan tới hệ thống máy tính — thiết kế, lập trình, vận hành và bảo trì — một trong các thành phần chuẩn của hệ thống máy tính bên cạnh phần cứng và phần mềm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In storing audio, the quantized sample values need to be ________ as bit patterns|||Khi lưu trữ âm thanh, các giá trị mẫu đã lượng tử hoá cần được ________ thành các chuỗi bit",
          "options": [
            {
              "text": "Quantization|||Lượng tử hoá"
            },
            {
              "text": "Sampled|||Lấy mẫu"
            },
            {
              "text": "Decoded|||Giải mã"
            },
            {
              "text": "Encoded|||Mã hoá"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">After quantization, sample values must be <b>encoded</b> into binary bit patterns for storage — the sample &rarr; quantize &rarr; encode pipeline of PCM.</div><div class=\"ml-vi\">Sau khi lượng tử hoá, các giá trị mẫu phải được <b>mã hoá</b> thành chuỗi bit để lưu trữ — quy trình lấy mẫu &rarr; lượng tử hoá &rarr; mã hoá của PCM.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Defining the users, requirements, and methods is part of the ________ phase.|||Xác định người dùng, yêu cầu và phương pháp là một phần của giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Gathering and defining users, requirements and methods is exactly the work of the <b>analysis</b> phase, before any design decisions are made.</div><div class=\"ml-vi\">Việc xác định người dùng, yêu cầu và phương pháp chính là công việc của giai đoạn <b>phân tích</b>, trước khi đưa ra bất kỳ quyết định thiết kế nào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ (or current directory) is the directory we are 'in' at any point in a user session|||________ (hay thư mục hiện hành) là thư mục mà ta đang 'ở trong đó' tại bất kỳ thời điểm nào trong phiên làm việc",
          "options": [
            {
              "text": "Root directory|||Thư mục gốc"
            },
            {
              "text": "Home directory|||Thư mục home"
            },
            {
              "text": "Working directory|||Thư mục làm việc (working directory)"
            },
            {
              "text": "Sub directory|||Thư mục con"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>working directory</b> (current directory) is whichever directory the user session is currently positioned in; it changes as the user navigates.</div><div class=\"ml-vi\"><b>Thư mục làm việc</b> (thư mục hiện hành) là thư mục mà phiên làm việc của người dùng đang đứng tại đó; nó thay đổi khi người dùng di chuyển qua lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A data structure can be ________.|||Một cấu trúc dữ liệu có thể là ________.",
          "options": [
            {
              "text": "An array|||Mảng (array)"
            },
            {
              "text": "A record|||Bản ghi (record)"
            },
            {
              "text": "A linked list|||Danh sách liên kết (linked list)"
            },
            {
              "text": "Any of the others|||Bất kỳ đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"Data structure\" is a general umbrella term covering arrays, records, linked lists and more — <b>any of the others</b> qualifies.</div><div class=\"ml-vi\">\"Cấu trúc dữ liệu\" là thuật ngữ tổng quát bao trùm mảng, bản ghi, danh sách liên kết và nhiều loại khác — <b>bất kỳ đáp án nào ở trên</b> đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In preorder traversal of a binary tree, the ________.|||Trong duyệt cây nhị phân theo thứ tự trước (preorder), ________.",
          "options": [
            {
              "text": "Left subtree is processed first|||Cây con trái được xử lý trước"
            },
            {
              "text": "Right subtree is processed first|||Cây con phải được xử lý trước"
            },
            {
              "text": "Root is processed first|||Gốc được xử lý trước"
            },
            {
              "text": "Root is processed last|||Gốc được xử lý sau cùng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Preorder</b> visits Root, then Left subtree, then Right subtree — the root is always processed first.</div><div class=\"ml-vi\"><b>Preorder</b> duyệt Gốc, rồi tới cây con Trái, rồi cây con Phải — gốc luôn được xử lý trước tiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _____ the development process flows in only one direction. This means that a phase cannot be started until the previous phase is completed.|||Trong _____ quy trình phát triển chỉ chảy theo một hướng. Nghĩa là một giai đoạn không thể bắt đầu cho tới khi giai đoạn trước hoàn tất.",
          "options": [
            {
              "text": "The waterfall model|||Mô hình thác nước (waterfall)"
            },
            {
              "text": "The spiral model|||Mô hình xoắn ốc (spiral)"
            },
            {
              "text": "Agile development|||Phát triển linh hoạt (Agile)"
            },
            {
              "text": "Rapid prototyping|||Tạo mẫu nhanh"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>waterfall model</b> is strictly sequential and one-directional: each phase must finish before the next begins, unlike iterative models such as spiral or Agile.</div><div class=\"ml-vi\"><b>Mô hình thác nước</b> hoàn toàn tuần tự và một chiều: mỗi giai đoạn phải hoàn tất trước khi giai đoạn kế tiếp bắt đầu, khác với các mô hình lặp như xoắn ốc hay Agile.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A digital device that processes data is known as _____|||Một thiết bị số xử lý dữ liệu được gọi là _____",
          "options": [
            {
              "text": "Data processor|||Bộ xử lý dữ liệu (data processor)"
            },
            {
              "text": "Data entry|||Nhập liệu (data entry)"
            },
            {
              "text": "DBMS|||DBMS"
            },
            {
              "text": "Database|||Cơ sở dữ liệu (database)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A digital device whose job is to process data is generically called a <b>data processor</b> — the classic term for a computer in electronic data processing (EDP) terminology.</div><div class=\"ml-vi\">Một thiết bị số có nhiệm vụ xử lý dữ liệu được gọi chung là <b>bộ xử lý dữ liệu (data processor)</b> — thuật ngữ kinh điển chỉ máy tính trong thuật ngữ xử lý dữ liệu điện tử (EDP).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ is a basic algorithm that adds a list of numbers.|||_______ là một thuật toán cơ bản dùng để cộng một danh sách các số.",
          "options": [
            {
              "text": "Summation|||Tính tổng (summation)"
            },
            {
              "text": "Sorting|||Sắp xếp"
            },
            {
              "text": "Searching|||Tìm kiếm"
            },
            {
              "text": "Recursion|||Đệ quy"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Summation</b> is the basic algorithm of iterating through a list and accumulating a running total.</div><div class=\"ml-vi\"><b>Tính tổng (summation)</b> là thuật toán cơ bản duyệt qua danh sách và cộng dồn kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The total number of uniquely identifiable address locations in memory is called the ____?|||Tổng số vị trí địa chỉ có thể định danh duy nhất trong bộ nhớ được gọi là ____?",
          "options": [
            {
              "text": "Address space|||Không gian địa chỉ (address space)"
            },
            {
              "text": "Byte space|||Không gian byte"
            },
            {
              "text": "Memory space|||Không gian bộ nhớ"
            },
            {
              "text": "Word length|||Độ dài từ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>address space</b> is the total number of distinct, addressable memory locations a system can reference.</div><div class=\"ml-vi\"><b>Không gian địa chỉ</b> là tổng số vị trí bộ nhớ khác nhau, có thể định địa chỉ mà hệ thống có thể tham chiếu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ who exploit the internet systems only to make public certain vast datasets of information that would be of benefit to everyone.|||_____ là những kẻ khai thác hệ thống internet chỉ để công khai một số tập dữ liệu khổng lồ mà họ tin là có lợi cho mọi người.",
          "options": [
            {
              "text": "White Hat Hacker|||Hacker mũ trắng"
            },
            {
              "text": "Grey Hat Hacker|||Hacker mũ xám (Grey Hat)"
            },
            {
              "text": "Black Hat Hacker|||Hacker mũ đen"
            },
            {
              "text": "Blue Hat Hacker|||Hacker mũ lam"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Grey Hat</b> hackers break rules (illegal access) but without purely malicious intent — often believing their actions (e.g. exposing data) serve the public good, unlike Black Hat's purely criminal motives.</div><div class=\"ml-vi\"><b>Hacker mũ xám</b> vi phạm luật (truy cập trái phép) nhưng không hoàn toàn vì ý đồ xấu — thường tin rằng hành động của họ (như công khai dữ liệu) phục vụ lợi ích công chúng, khác với động cơ hoàn toàn phạm tội của mũ đen.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, structure charts are tools used in the ________ phase.|||Trong quy trình phát triển hệ thống, sơ đồ cấu trúc (structure chart) là công cụ dùng trong giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Structure charts</b> show the module hierarchy and data flow between modules — a <b>design</b>-phase tool, used after requirements are analyzed but before coding.</div><div class=\"ml-vi\"><b>Sơ đồ cấu trúc</b> thể hiện phân cấp mô-đun và luồng dữ liệu giữa các mô-đun — công cụ của giai đoạn <b>thiết kế</b>, dùng sau khi phân tích yêu cầu nhưng trước khi viết mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ___________ cryptography, everyone has access to everyone's public key.|||Trong mật mã ___________, mọi người đều có thể truy cập khoá công khai của người khác.",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Secret-key|||Khoá bí mật"
            },
            {
              "text": "Session-key|||Khoá phiên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> (public-key) cryptography makes each party's public key openly available to everyone, while the private key stays secret.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> (khoá công khai) làm cho khoá công khai của mỗi bên được công bố rộng rãi, trong khi khoá riêng vẫn được giữ bí mật.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The translated program in machine language is called the_______.|||Chương trình đã được dịch sang ngôn ngữ máy được gọi là_______.",
          "options": [
            {
              "text": "Object program|||Chương trình đối tượng (object program)"
            },
            {
              "text": "Source program|||Chương trình nguồn (source program)"
            },
            {
              "text": "Compiler|||Trình biên dịch (compiler)"
            },
            {
              "text": "Interpreter|||Trình thông dịch (interpreter)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The original code is the <b>source program</b>; once translated into machine language it becomes the <b>object program</b>.</div><div class=\"ml-vi\">Mã gốc là <b>chương trình nguồn</b>; sau khi được dịch sang ngôn ngữ máy, nó trở thành <b>chương trình đối tượng (object program)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "IP addresses are currently ________ bits in length.|||Địa chỉ IP hiện nay dài ________ bit.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "40|||40"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The classic (IPv4) address is <b>32 bits</b> long, the length assumed by default in intro networking courses.</div><div class=\"ml-vi\">Địa chỉ IP cổ điển (IPv4) dài <b>32 bit</b>, độ dài mặc định trong các môn nhập môn mạng máy tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The operator of arithmetic operators are increment (add 1 to the value of the variable)|||Toán tử số học biểu diễn phép tăng (cộng thêm 1 vào giá trị biến) là",
          "options": [
            {
              "text": "--|||--"
            },
            {
              "text": "+=|||+="
            },
            {
              "text": "++|||++"
            },
            {
              "text": "**|||**"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>++</b> operator increments a variable's value by 1; <b>--</b> is its decrement counterpart.</div><div class=\"ml-vi\">Toán tử <b>++</b> tăng giá trị của biến thêm 1; <b>--</b> là toán tử giảm tương ứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ________ sort, the item that goes into the sorted list is always the first item in the unsorted list.|||Trong sắp xếp ________, phần tử được đưa vào danh sách đã sắp xếp luôn là phần tử đầu tiên của danh sách chưa sắp xếp.",
          "options": [
            {
              "text": "Selection|||Chọn (selection)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Merge|||Trộn (merge)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Insertion sort</b> always takes the next (first remaining) item from the unsorted part and inserts it into its correct position in the sorted part.</div><div class=\"ml-vi\"><b>Sắp xếp chèn</b> luôn lấy phần tử kế tiếp (đầu tiên còn lại) từ phần chưa sắp xếp và chèn nó vào đúng vị trí trong phần đã sắp xếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A billionth of a second is defined as a:|||Một phần tỷ giây được định nghĩa là:",
          "options": [
            {
              "text": "Millisecond|||Mili giây"
            },
            {
              "text": "Microsecond|||Micro giây"
            },
            {
              "text": "Nanosecond|||Nano giây"
            },
            {
              "text": "Picosecond|||Pico giây"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>nanosecond</b> = 10^-9 second = one billionth of a second.</div><div class=\"ml-vi\"><b>Nano giây</b> = 10^-9 giây = một phần tỷ giây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An index register that is automatically incremented or decremented with each use is|||Một thanh ghi chỉ số tự động tăng hoặc giảm sau mỗi lần sử dụng được gọi là",
          "options": [
            {
              "text": "An auto index|||Chỉ số tự động (auto index)"
            },
            {
              "text": "A base register|||Thanh ghi cơ sở"
            },
            {
              "text": "A stack pointer|||Con trỏ ngăn xếp"
            },
            {
              "text": "A program counter|||Bộ đếm chương trình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An index register that auto-increments/decrements on each use is called an <b>auto index</b> register, useful for stepping through arrays without extra instructions.</div><div class=\"ml-vi\">Thanh ghi chỉ số tự tăng/giảm sau mỗi lần dùng được gọi là <b>chỉ số tự động (auto index)</b>, hữu ích khi duyệt qua mảng mà không cần thêm lệnh riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The file structure allows random access is _____|||Cấu trúc tệp cho phép truy cập ngẫu nhiên là _____",
          "options": [
            {
              "text": "A hashed file|||Tệp băm (hashed file)"
            },
            {
              "text": "A sequential file|||Tệp tuần tự"
            },
            {
              "text": "A tape file|||Tệp băng từ"
            },
            {
              "text": "A log file|||Tệp nhật ký"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>hashed (direct)</b> file computes a record's location directly from its key, allowing true random access; sequential and tape files must be read in order.</div><div class=\"ml-vi\"><b>Tệp băm (direct)</b> tính trực tiếp vị trí bản ghi từ khoá của nó, cho phép truy cập ngẫu nhiên thật sự; tệp tuần tự và băng từ phải đọc theo thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Of the various database models, the ________ model is the most prevalent today.|||Trong các mô hình cơ sở dữ liệu, mô hình ________ phổ biến nhất hiện nay.",
          "options": [
            {
              "text": "Hierarchical|||Phân cấp (hierarchical)"
            },
            {
              "text": "Network|||Mạng (network)"
            },
            {
              "text": "Relational|||Quan hệ (relational)"
            },
            {
              "text": "Linked list|||Danh sách liên kết"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>relational</b> model (tables/relations) has dominated database systems since the 1980s, displacing the older hierarchical and network models.</div><div class=\"ml-vi\">Mô hình <b>quan hệ</b> (bảng/quan hệ) đã thống trị các hệ cơ sở dữ liệu từ thập niên 1980, thay thế các mô hình phân cấp và mạng cũ hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The organization and interconnection of the various components of a computer system is|||Sự tổ chức và kết nối giữa các thành phần khác nhau của một hệ thống máy tính được gọi là",
          "options": [
            {
              "text": "Architecture|||Kiến trúc (architecture)"
            },
            {
              "text": "Networks|||Mạng máy tính"
            },
            {
              "text": "Graphics|||Đồ hoạ"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the textbook definition of computer <b>architecture</b>: how the components of a computer are organized and interconnected.</div><div class=\"ml-vi\">Đây là định nghĩa kinh điển của <b>kiến trúc máy tính</b>: cách các thành phần của máy tính được tổ chức và kết nối với nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Each row in a relation is called ________.|||Mỗi dòng trong một quan hệ được gọi là ________.",
          "options": [
            {
              "text": "An attribute|||Thuộc tính (attribute)"
            },
            {
              "text": "A tuple|||Bộ (tuple)"
            },
            {
              "text": "A union|||Phép hợp (union)"
            },
            {
              "text": "An attitude|||Thái độ (attitude)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Each row of a relation (table) is called a <b>tuple</b>; each column is called an attribute.</div><div class=\"ml-vi\">Mỗi dòng của một quan hệ (bảng) được gọi là một <b>bộ (tuple)</b>; mỗi cột được gọi là một thuộc tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In CISC (complex instruction set compute), an instruction in machine language is not executed directly by the CPU–the CPU performs only simple operations, that is called ___|||Trong CISC (tập lệnh phức tạp), một lệnh mã máy không được CPU thực thi trực tiếp – CPU chỉ thực hiện các thao tác đơn giản, kỹ thuật đó gọi là ___",
          "options": [
            {
              "text": "Microoperations|||Vi thao tác"
            },
            {
              "text": "Micromemory|||Vi bộ nhớ"
            },
            {
              "text": "Microcomputer|||Vi máy tính"
            },
            {
              "text": "Microprogramming|||Vi lập trình"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Microprogramming</b> implements each complex machine instruction as a sequence of simple micro-operations controlled by microcode.</div><div class=\"ml-vi\"><b>Vi lập trình</b> hiện thực mỗi lệnh máy phức tạp thành một chuỗi vi thao tác đơn giản do vi mã điều khiển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Who is credited with the idea of using punch cards to control patterns in a weaving machine?|||Ai được ghi nhận là người đưa ra ý tưởng dùng thẻ đục lỗ để điều khiển hoa văn trên máy dệt?",
          "options": [
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Hollerith|||Hollerith"
            },
            {
              "text": "Babbage|||Babbage"
            },
            {
              "text": "Jacquard|||Jacquard"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Jacquard</b> invented the punch-card-controlled loom in 1801, an idea later borrowed by Hollerith for census tabulation and by early computer pioneers for program/data input.</div><div class=\"ml-vi\"><b>Jacquard</b> phát minh máy dệt điều khiển bằng thẻ đục lỗ năm 1801, ý tưởng này sau đó được Hollerith mượn dùng cho máy lập bảng điều tra dân số và được các nhà tiên phong máy tính dùng để nhập chương trình/dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The _____ of ethics says that an act is ethical if it brings about a useful for society|||Học thuyết đạo đức _____ nói rằng một hành động là có đạo đức nếu nó mang lại lợi ích cho xã hội",
          "options": [
            {
              "text": "Moral rules|||Quy tắc đạo đức"
            },
            {
              "text": "Social contract|||Khế ước xã hội"
            },
            {
              "text": "Utilitization|||Chủ nghĩa vị lợi (utilitarianism)"
            },
            {
              "text": "Nonmaleficence|||Nguyên tắc không gây hại"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">This describes <b>utilitarianism</b> (spelled \"utilization\" in the source): an act is ethical if it produces the greatest good/usefulness for society as a whole.</div><div class=\"ml-vi\">Đây là mô tả của <b>chủ nghĩa vị lợi (utilitarianism)</b> (ảnh gốc ghi \"utilization\"): một hành động có đạo đức nếu nó mang lại lợi ích/điều tốt lớn nhất cho toàn xã hội.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "___ is an ordered set of unambiguous steps that produces a result and terminates in a finite time.|||___ là một tập hợp có thứ tự các bước rõ ràng, tạo ra kết quả và kết thúc trong thời gian hữu hạn.",
          "options": [
            {
              "text": "A construct|||Một cấu trúc (construct)"
            },
            {
              "text": "A recursion|||Đệ quy"
            },
            {
              "text": "An iteration|||Lặp (iteration)"
            },
            {
              "text": "An algorithm|||Thuật toán (algorithm)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is the standard definition of an <b>algorithm</b>: an ordered, unambiguous, finite sequence of steps producing a result.</div><div class=\"ml-vi\">Đây là định nghĩa chuẩn của <b>thuật toán</b>: một chuỗi bước có thứ tự, rõ ràng, hữu hạn, tạo ra kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The dequeue operation ___ the item at the ___ of the queue|||Thao tác dequeue ___ phần tử ở ___ của hàng đợi",
          "options": [
            {
              "text": "delete/front|||Xoá/đầu"
            },
            {
              "text": "delete/end|||Xoá/cuối"
            },
            {
              "text": "inserts/front|||Chèn/đầu"
            },
            {
              "text": "insert/rear|||Chèn/cuối"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Dequeue</b> removes (deletes) the item at the <b>front</b> of the queue; enqueue inserts at the rear — this is what makes a queue FIFO.</div><div class=\"ml-vi\"><b>Dequeue</b> lấy ra (xoá) phần tử ở <b>đầu</b> hàng đợi; enqueue chèn vào cuối — đó là lý do hàng đợi hoạt động theo kiểu FIFO.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The unit of a computer system that executes program, communicates with and often controls the operation of other subsystems of the computer is known as_____|||Thành phần của hệ thống máy tính thực thi chương trình, giao tiếp với và thường điều khiển hoạt động của các hệ thống con khác của máy tính được gọi là_____",
          "options": [
            {
              "text": "CPU|||CPU"
            },
            {
              "text": "Control Unit|||Bộ điều khiển (control unit)"
            },
            {
              "text": "I/O unit|||Thiết bị vào/ra"
            },
            {
              "text": "Peripheral unit|||Thiết bị ngoại vi"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>CPU</b> is the unit that executes programs and coordinates/controls the operation of all other subsystems (memory, I/O, etc.) of the computer.</div><div class=\"ml-vi\"><b>CPU</b> là thành phần thực thi chương trình và điều phối/điều khiển hoạt động của mọi hệ thống con khác (bộ nhớ, I/O, v.v.) của máy tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______is the process by which a given set of relations are transformed to a new set of relations with a more solid structure.|||______ là quá trình biến đổi một tập quan hệ cho trước thành một tập quan hệ mới có cấu trúc chặt chẽ hơn.",
          "options": [
            {
              "text": "Relational database|||Cơ sở dữ liệu quan hệ"
            },
            {
              "text": "Database system|||Hệ cơ sở dữ liệu"
            },
            {
              "text": "Atomic operations|||Thao tác nguyên tử"
            },
            {
              "text": "Normalization|||Chuẩn hoá (normalization)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Normalization</b> transforms relations into a new set with a more solid (less redundant, anomaly-free) structure, typically through a series of normal forms.</div><div class=\"ml-vi\"><b>Chuẩn hoá</b> biến đổi các quan hệ thành một tập mới có cấu trúc chặt chẽ hơn (ít dư thừa, không còn dị thường), thường qua một chuỗi các dạng chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Each element in a record is called ________.|||Mỗi phần tử trong một bản ghi được gọi là ________.",
          "options": [
            {
              "text": "A variable|||Biến (variable)"
            },
            {
              "text": "An index|||Chỉ số (index)"
            },
            {
              "text": "A field|||Trường (field)"
            },
            {
              "text": "A node|||Nút (node)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each individual element of a record is called a <b>field</b> (e.g. name, age, address inside an employee record).</div><div class=\"ml-vi\">Mỗi phần tử riêng lẻ của một bản ghi được gọi là một <b>trường (field)</b> (ví dụ: tên, tuổi, địa chỉ trong bản ghi nhân viên).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ___________cryptography, the same key is used by the sender and the receiver.|||Trong mật mã ___________, cùng một khoá được dùng bởi cả người gửi và người nhận.",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Open-key|||Khoá mở"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Symmetric-key</b> cryptography uses one shared key for both encryption (sender) and decryption (receiver).</div><div class=\"ml-vi\">Mật mã <b>khoá đối xứng</b> dùng chung một khoá cho cả mã hoá (người gửi) và giải mã (người nhận).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following representations is erroneous?|||Cách biểu diễn nào sau đây là sai?",
          "options": [
            {
              "text": "(111)2|||(111)2"
            },
            {
              "text": "(346)8|||(346)8"
            },
            {
              "text": "(EEG)16|||(EEG)16"
            },
            {
              "text": "221|||221"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Hexadecimal digits only go up to F (0-9, A-F); <b>\"G\" is not a valid hex digit</b>, so (EEG)16 is erroneous. (346)8 is valid octal (digits 0-7) and (111)2 is valid binary.</div><div class=\"ml-vi\">Chữ số thập lục phân chỉ tới F (0-9, A-F); <b>\"G\" không phải chữ số hex hợp lệ</b>, nên (EEG)16 sai. (346)8 là bát phân hợp lệ (chữ số 0-7) và (111)2 là nhị phân hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the attacks threatent integrity ______ happens when the attacker impersonates somebody else|||Trong các tấn công đe doạ tính toàn vẹn, ______ xảy ra khi kẻ tấn công giả danh người khác",
          "options": [
            {
              "text": "Snooping|||Nghe lén (snooping)"
            },
            {
              "text": "Repudiation|||Chối bỏ (repudiation)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Masquerading|||Giả mạo (masquerading)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Masquerading</b> is impersonating another entity to gain unauthorized access or trust — an integrity/authentication attack.</div><div class=\"ml-vi\"><b>Giả mạo (masquerading)</b> là hành vi giả danh một thực thể khác để chiếm quyền truy cập hoặc lòng tin trái phép — một dạng tấn công vào tính toàn vẹn/xác thực.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is a method in which each statement in the software is executed at least once.|||_____ là phương pháp trong đó mỗi câu lệnh trong phần mềm được thực thi ít nhất một lần.",
          "options": [
            {
              "text": "Basis path testing|||Kiểm thử đường cơ sở (basis path testing)"
            },
            {
              "text": "Condition testing|||Kiểm thử điều kiện"
            },
            {
              "text": "Loop testing|||Kiểm thử vòng lặp"
            },
            {
              "text": "Boundary testing|||Kiểm thử biên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Basis path testing</b> derives a set of linearly independent test paths that together guarantee every statement is executed at least once.</div><div class=\"ml-vi\"><b>Kiểm thử đường cơ sở</b> xây dựng một tập đường kiểm thử độc lập tuyến tính, đảm bảo mọi câu lệnh được thực thi ít nhất một lần.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A system program which helps the execution of user programs is known as|||Một chương trình hệ thống hỗ trợ việc thực thi các chương trình người dùng được gọi là",
          "options": [
            {
              "text": "System software|||Phần mềm hệ thống (system software)"
            },
            {
              "text": "Application program|||Chương trình ứng dụng"
            },
            {
              "text": "Batch operating system|||Hệ điều hành theo lô"
            },
            {
              "text": "Utilities|||Tiện ích"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>System software</b> (including the OS) manages computer resources and supports/enables the execution of user (application) programs.</div><div class=\"ml-vi\"><b>Phần mềm hệ thống</b> (bao gồm hệ điều hành) quản lý tài nguyên máy tính và hỗ trợ/cho phép thực thi các chương trình người dùng (ứng dụng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The Stack operation returns a/an _____.|||Các thao tác trên Stack trả về một _____.",
          "options": [
            {
              "text": "Full stack|||Ngăn xếp đầy"
            },
            {
              "text": "Empty stack|||Ngăn xếp rỗng"
            },
            {
              "text": "Check status of stack|||Trạng thái của ngăn xếp"
            },
            {
              "text": "All of the others|||Tất cả đáp án trên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Depending on which stack operation is called (isFull, isEmpty, peek/status), it can return a full-stack indication, an empty-stack indication, or a general status check — <b>all of the others</b>.</div><div class=\"ml-vi\">Tuỳ vào thao tác stack nào được gọi (isFull, isEmpty, peek/kiểm tra trạng thái), nó có thể trả về báo hiệu đầy, báo hiệu rỗng, hoặc kiểm tra trạng thái chung — <b>tất cả đáp án trên</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular left shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch trái vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0001 1001|||0001 1001"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A circular left shift moves every bit one position left and wraps the old MSB around to the new LSB: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div><div class=\"ml-vi\">Dịch trái vòng đẩy mọi bit sang trái một vị trí và đưa bit cao nhất cũ vòng xuống thành bit thấp nhất mới: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the domain name in the e mail address kayla@nasa.gov?|||Tên miền trong địa chỉ email kayla@nasa.gov là gì?",
          "options": [
            {
              "text": "kayla|||kayla"
            },
            {
              "text": "kayla@nasa.gov|||kayla@nasa.gov"
            },
            {
              "text": "nasa.gov|||nasa.gov"
            },
            {
              "text": "gov|||gov"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In an email address, everything after the @ symbol is the <b>domain name</b>: here, <b>nasa.gov</b>.</div><div class=\"ml-vi\">Trong địa chỉ email, phần sau ký hiệu @ là <b>tên miền</b>: ở đây là <b>nasa.gov</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A mechanism for arranging controlled access to a shared resource is|||Một cơ chế sắp xếp việc truy cập có kiểm soát tới một tài nguyên dùng chung là",
          "options": [
            {
              "text": "Retrieving|||Truy xuất (retrieving)"
            },
            {
              "text": "Sorting|||Sắp xếp (sorting)"
            },
            {
              "text": "Balleting|||Balleting"
            },
            {
              "text": "Lock-out|||Khoá loại trừ (lock-out)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>lock-out</b> mechanism (mutual exclusion / locking) arranges controlled, exclusive access to a shared resource so only one process/thread uses it at a time.</div><div class=\"ml-vi\">Cơ chế <b>khoá loại trừ (lock-out)</b> (loại trừ lẫn nhau / khoá) sắp xếp việc truy cập có kiểm soát, độc quyền tới tài nguyên dùng chung để chỉ một tiến trình/luồng sử dụng tại một thời điểm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The union database operation is taking two relations and creating a new relation. What is a result of this operation?|||Thao tác hợp (union) trong cơ sở dữ liệu lấy hai quan hệ và tạo ra một quan hệ mới. Kết quả của thao tác này là gì?",
          "options": [
            {
              "text": "Neither the first relation nor the second.|||Không phải quan hệ thứ nhất cũng không phải thứ hai."
            },
            {
              "text": "Both of the first relation and the second.|||Cả quan hệ thứ nhất và thứ hai."
            },
            {
              "text": "The first relation but not the second.|||Quan hệ thứ nhất nhưng không phải thứ hai."
            },
            {
              "text": "The second but not the first|||Quan hệ thứ hai nhưng không phải thứ nhất"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>union</b> operation combines all rows from both relations (removing duplicates) into one result — <b>both</b> relations contribute.</div><div class=\"ml-vi\">Thao tác <b>hợp (union)</b> gộp tất cả các dòng từ cả hai quan hệ (loại trùng) thành một kết quả — <b>cả hai</b> quan hệ đều đóng góp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is the standard protocol provided by TCP/IP for copying a file from one host to another andtransferring files from one system to another seems simple and straightforward.|||_____ là giao thức chuẩn do TCP/IP cung cấp để sao chép tệp từ máy này sang máy khác, việc truyền tệp giữa các hệ thống có vẻ đơn giản và trực tiếp.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "URL|||URL"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>FTP</b> (File Transfer Protocol) is the standard TCP/IP protocol specifically designed for copying/transferring files between hosts.</div><div class=\"ml-vi\"><b>FTP</b> (File Transfer Protocol) là giao thức chuẩn của TCP/IP được thiết kế riêng để sao chép/truyền tệp giữa các máy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a arithmetic right shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch phải số học lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0100 1100|||0100 1100"
            },
            {
              "text": "1100 1100|||1100 1100"
            },
            {
              "text": "1101 1001|||1101 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Arithmetic right shift preserves the sign bit: shift right and duplicate the sign bit (1) into the new MSB: 1001&thinsp;1000 &rarr; <b>1100&thinsp;1100</b> (dropping the rightmost bit).</div><div class=\"ml-vi\">Dịch phải số học giữ nguyên bit dấu: dịch phải rồi lặp lại bit dấu (1) vào bit cao nhất mới: 1001&thinsp;1000 &rarr; <b>1100&thinsp;1100</b> (bỏ bit thấp nhất cũ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a positional number system with base b, we can always find the number of digits of an integer. So how many digits can we find in the decimal number 20 in hexadecimal system?|||Trong hệ đếm vị trí cơ số b, ta luôn tìm được số chữ số của một số nguyên. Vậy số 20 trong hệ thập phân có bao nhiêu chữ số khi biểu diễn ở hệ thập lục phân?",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">20 in decimal = 14 in hexadecimal, which has <b>2</b> digits.</div><div class=\"ml-vi\">20 trong hệ thập phân = 14 trong hệ thập lục phân, có <b>2</b> chữ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A 7-bit code called ________ represents symbols in languages.|||Một mã 7-bit gọi là ________ biểu diễn các ký hiệu trong ngôn ngữ.",
          "options": [
            {
              "text": "ANSI|||ANSI"
            },
            {
              "text": "Unicode|||Unicode"
            },
            {
              "text": "ASCII|||ASCII"
            },
            {
              "text": "Extended ASCII|||ASCII mở rộng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Standard <b>ASCII</b> is a 7-bit code (128 characters); Extended ASCII uses 8 bits and Unicode uses variable/16+ bits.</div><div class=\"ml-vi\"><b>ASCII</b> chuẩn là mã 7-bit (128 ký tự); ASCII mở rộng dùng 8 bit và Unicode dùng số bit thay đổi/16+.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a______, the directory system listing of the peers and what they offer uses the client-server paradigm, but the storing and downloading of the files are done using the peer-to-peer paradigm.|||Trong một ______, hệ thống thư mục liệt kê các peer và những gì họ chia sẻ dùng mô hình client-server, nhưng việc lưu trữ và tải tệp lại dùng mô hình peer-to-peer.",
          "options": [
            {
              "text": "WWW|||WWW"
            },
            {
              "text": "Centralized network|||Mạng tập trung"
            },
            {
              "text": "Hybrid network|||Mạng lai (hybrid)"
            },
            {
              "text": "Decentralized network|||Mạng phi tập trung"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>hybrid</b> P2P network (like early Napster) uses a centralized client-server directory to find peers, but the actual file transfer happens directly peer-to-peer.</div><div class=\"ml-vi\">Mạng P2P <b>lai (hybrid)</b> (như Napster thời kỳ đầu) dùng thư mục client-server tập trung để tìm peer, nhưng việc truyền tệp thực sự diễn ra trực tiếp peer-to-peer.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is taking the one's complement of of the integer 00110110?|||Cách nào sau đây là lấy bù một (one's complement) của số nguyên 00110110?",
          "options": [
            {
              "text": "11001100|||11001100"
            },
            {
              "text": "11001111|||11001111"
            },
            {
              "text": "11001001|||11001001"
            },
            {
              "text": "11100110|||11100110"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">One's complement simply <b>flips every bit</b>: 00110110 &rarr; <b>11001001</b>.</div><div class=\"ml-vi\">Bù một chỉ đơn giản là <b>đảo mọi bit</b>: 00110110 &rarr; <b>11001001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the binary system, the base b = 2 and we use only two symbols to represent numbers. The symbols in this system are often referred to as binary digits or ______?|||Trong hệ nhị phân, cơ số b = 2 và ta chỉ dùng hai ký hiệu để biểu diễn số. Các ký hiệu này thường được gọi là chữ số nhị phân hay ______?",
          "options": [
            {
              "text": "Bits|||Bit"
            },
            {
              "text": "Byte|||Byte"
            },
            {
              "text": "Bitmap|||Bitmap"
            },
            {
              "text": "Digits|||Chữ số (digits)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The symbols of the binary system (0 and 1) are called <b>bits</b> (binary digits).</div><div class=\"ml-vi\">Các ký hiệu của hệ nhị phân (0 và 1) được gọi là <b>bit</b> (chữ số nhị phân).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We use the ________ search for an ordered list.|||Ta dùng tìm kiếm ________ cho một danh sách đã sắp xếp.",
          "options": [
            {
              "text": "Sequential|||Tuần tự (sequential)"
            },
            {
              "text": "Binary|||Nhị phân (binary)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search</b> requires (and exploits) an ordered list to repeatedly halve the search space.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân</b> yêu cầu (và tận dụng) danh sách đã sắp xếp để liên tục chia đôi không gian tìm kiếm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A process in the ________ state can go to either the ready, terminated, or waiting states.|||Một tiến trình ở trạng thái ________ có thể chuyển sang trạng thái sẵn sàng, kết thúc, hoặc chờ.",
          "options": [
            {
              "text": "Hold|||Giữ (hold)"
            },
            {
              "text": "Virtual|||Ảo (virtual)"
            },
            {
              "text": "Running|||Đang chạy (running)"
            },
            {
              "text": "Hold or running|||Giữ hoặc đang chạy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>running</b> process can be preempted (&rarr; ready), finish (&rarr; terminated), or block for I/O (&rarr; waiting) — the three natural exits from the running state.</div><div class=\"ml-vi\">Một tiến trình đang <b>chạy</b> có thể bị chiếm quyền (&rarr; sẵn sàng), kết thúc (&rarr; terminated), hoặc chờ I/O (&rarr; waiting) — ba lối ra tự nhiên từ trạng thái chạy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What kind of state does a process execute until it needs I/O resources when I/O is complete?|||Tiến trình thực thi ở trạng thái nào cho tới khi nó cần tài nguyên I/O, và trở lại trạng thái đó khi I/O hoàn tất?",
          "options": [
            {
              "text": "Hold state|||Trạng thái giữ"
            },
            {
              "text": "Ready state|||Trạng thái sẵn sàng"
            },
            {
              "text": "Running state|||Trạng thái đang chạy"
            },
            {
              "text": "Waiting state|||Trạng thái chờ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A process <b>runs</b> until it needs I/O (then moves to waiting), and returns to the <b>running</b> state after I/O completes and it is scheduled again.</div><div class=\"ml-vi\">Một tiến trình <b>chạy</b> cho tới khi cần I/O (chuyển sang chờ), và quay lại trạng thái <b>đang chạy</b> sau khi I/O hoàn tất và được lập lịch lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the _____ we can think of a program as an active agent that manipulates passive objects.|||Trong _____ ta có thể xem chương trình như một tác nhân chủ động thao túng các đối tượng thụ động.",
          "options": [
            {
              "text": "Procedural paradigm|||Mô hình thủ tục (procedural)"
            },
            {
              "text": "Functional paradigm|||Mô hình hàm (functional)"
            },
            {
              "text": "Declarative paradigm|||Mô hình khai báo (declarative)"
            },
            {
              "text": "Object-oriented paradigm|||Mô hình hướng đối tượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In the <b>procedural paradigm</b>, procedures/functions (active agent) operate on passive data structures — unlike OOP, where objects bundle data and behavior together.</div><div class=\"ml-vi\">Trong <b>mô hình thủ tục</b>, các thủ tục/hàm (tác nhân chủ động) thao tác trên các cấu trúc dữ liệu thụ động — khác với OOP, nơi đối tượng gộp chung dữ liệu và hành vi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An indexed file consists of ________.|||Một tệp có chỉ mục (indexed file) bao gồm ________.",
          "options": [
            {
              "text": "Only a sequential data file|||Chỉ một tệp dữ liệu tuần tự"
            },
            {
              "text": "Only an index|||Chỉ một chỉ mục"
            },
            {
              "text": "Only a random data file|||Chỉ một tệp dữ liệu ngẫu nhiên"
            },
            {
              "text": "An index and random data file|||Một chỉ mục và một tệp dữ liệu truy cập ngẫu nhiên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">An <b>indexed file</b> is made of two parts: the <b>index</b> (for fast lookup) plus the actual <b>data file</b>, which the index lets you access randomly.</div><div class=\"ml-vi\"><b>Tệp có chỉ mục</b> gồm hai phần: <b>chỉ mục</b> (để tra cứu nhanh) cộng với <b>tệp dữ liệu</b> thực sự, mà chỉ mục cho phép truy cập ngẫu nhiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the software quality, what factor measures can be mentioned for transferability??|||Trong chất lượng phần mềm, yếu tố nào có thể được nhắc tới cho khả năng chuyển đổi (transferability)?",
          "options": [
            {
              "text": "Accuracy|||Độ chính xác"
            },
            {
              "text": "Timeliness|||Tính kịp thời"
            },
            {
              "text": "Resusability|||Khả năng tái sử dụng (reusability)"
            },
            {
              "text": "Changeability|||Khả năng thay đổi"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Reusability</b> (transferability of code/components across platforms and systems) is the quality factor that measures how easily software can move to a new environment.</div><div class=\"ml-vi\"><b>Khả năng tái sử dụng</b> (chuyển đổi mã/thành phần qua các nền tảng và hệ thống khác nhau) là yếu tố chất lượng đo mức độ dễ dàng phần mềm có thể chuyển sang môi trường mới.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a______the relationship between a character in the plaintext to a character in the ciphertext is one-to-many|||Trong một______mối quan hệ giữa một ký tự trong bản rõ và một ký tự trong bản mã là một-nhiều",
          "options": [
            {
              "text": "Monoalphabetic cipher|||Mật mã đơn bảng (monoalphabetic)"
            },
            {
              "text": "Substitution cipher|||Mật mã thay thế (substitution)"
            },
            {
              "text": "Polyalphabetic cipher|||Mật mã đa bảng (polyalphabetic)"
            },
            {
              "text": "Transposition cipher|||Mật mã hoán vị (transposition)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In a <b>polyalphabetic</b> cipher, the same plaintext letter maps to different ciphertext letters at different positions (one-to-many), unlike monoalphabetic where the mapping is fixed (one-to-one).</div><div class=\"ml-vi\">Trong mật mã <b>đa bảng (polyalphabetic)</b>, cùng một chữ cái bản rõ có thể ánh xạ tới các chữ cái bản mã khác nhau ở các vị trí khác nhau (một-nhiều), khác với đơn bảng có ánh xạ cố định (một-một).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The CD-ROM is read using a _____beam. The beam is reflected by the aluminum surface when passing through a land. It is reflected twice when it encounters a pit, once by the pit boundary and once by the aluminum boundary.|||Đĩa CD-ROM được đọc bằng một chùm _____. Chùm tia phản xạ qua bề mặt nhôm khi đi qua vùng phẳng (land). Nó phản xạ hai lần khi gặp một hố lõm (pit), một lần ở biên hố và một lần ở biên nhôm.",
          "options": [
            {
              "text": "Laser|||Laser"
            },
            {
              "text": "Red laser|||Laser đỏ"
            },
            {
              "text": "Low-power laser|||Laser công suất thấp (low-power)"
            },
            {
              "text": "Ultraviolet light|||Tia cực tím"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">CD-ROM reading uses a <b>low-power laser</b> beam (as opposed to the high-power laser used for writing/burning discs) to avoid damaging the disc surface while sensing pit/land reflections.</div><div class=\"ml-vi\">Đọc đĩa CD-ROM dùng chùm <b>laser công suất thấp</b> (khác với laser công suất cao dùng để ghi/đốt đĩa) để tránh làm hỏng bề mặt đĩa trong khi cảm nhận phản xạ pit/land.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the storing images, the number of bits used to represent a pixel, its____, depends on how a pixel's color is handled by different encoding techniques.|||Khi lưu trữ ảnh, số bit dùng để biểu diễn một điểm ảnh, tức là____, phụ thuộc vào cách màu của điểm ảnh được xử lý bởi các kỹ thuật mã hoá khác nhau.",
          "options": [
            {
              "text": "Bit map|||Bản đồ bit (bit map)"
            },
            {
              "text": "Pixels|||Điểm ảnh (pixels)"
            },
            {
              "text": "Resolution|||Độ phân giải"
            },
            {
              "text": "Color depth|||Độ sâu màu (color depth)"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The number of bits per pixel is called <b>color depth</b>, and it determines how many distinct colors a pixel can represent.</div><div class=\"ml-vi\">Số bit trên mỗi điểm ảnh được gọi là <b>độ sâu màu (color depth)</b>, quyết định số lượng màu khác nhau mà một điểm ảnh có thể biểu diễn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The role of the physical layer is to transfer the bits received from the data-link layer and convert them to ______for transmission.|||Vai trò của tầng vật lý là truyền các bit nhận từ tầng liên kết dữ liệu và chuyển chúng thành ______ để truyền đi.",
          "options": [
            {
              "text": "Analog signals|||Tín hiệu tương tự"
            },
            {
              "text": "Electromagnetic signals|||Tín hiệu điện từ"
            },
            {
              "text": "Digital signals|||Tín hiệu số"
            },
            {
              "text": "Electronic signals|||Tín hiệu điện tử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">To be transmitted over any medium, data must be transformed into <b>electromagnetic signals</b> — the physical layer's job.</div><div class=\"ml-vi\">Để truyền qua bất kỳ môi trường nào, dữ liệu phải được chuyển thành <b>tín hiệu điện từ</b> — đây là nhiệm vụ của tầng vật lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An empty linked list consists of ________.|||Một danh sách liên kết rỗng bao gồm ________.",
          "options": [
            {
              "text": "A node|||Một nút"
            },
            {
              "text": "Two nodes|||Hai nút"
            },
            {
              "text": "Data and a link|||Dữ liệu và một liên kết"
            },
            {
              "text": "A null head pointer|||Một con trỏ đầu (head) rỗng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">An empty linked list has no nodes at all — just a <b>head pointer set to null</b>, indicating there is nothing to traverse.</div><div class=\"ml-vi\">Danh sách liên kết rỗng không có nút nào cả — chỉ có <b>con trỏ đầu (head) được đặt là null</b>, cho biết không có gì để duyệt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A group contains ______ bits in the binary system are represented as one digit in the octal system.|||Một nhóm gồm ______ bit trong hệ nhị phân được biểu diễn thành một chữ số trong hệ bát phân.",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Octal is base 8 = 2^3, so each octal digit corresponds to exactly <b>3</b> binary bits.</div><div class=\"ml-vi\">Bát phân có cơ số 8 = 2^3, nên mỗi chữ số bát phân tương ứng với đúng <b>3</b> bit nhị phân.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D3",
      "source": "REAL",
      "sortOrder": 2,
      "title": "Đề 3 — SP2024 Final Exam|||Đề 3 — Thi cuối kỳ SP2024",
      "description": "CSI104 real FE multiple-choice paper (Spring 2024), transcribed from the exam images; answers reasoned here. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2024), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is the breaking up of a large project into smaller parts.|||_____ là việc chia một dự án lớn thành các phần nhỏ hơn.",
          "options": [
            {
              "text": "Structuring|||Cấu trúc hoá (structuring)"
            },
            {
              "text": "Abstraction|||Trừu tượng hoá (abstraction)"
            },
            {
              "text": "Encapsulation|||Đóng gói (encapsulation)"
            },
            {
              "text": "Modularization|||Mô-đun hoá (modularization)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Modularization</b> is the process of dividing a large project/program into smaller, independent, manageable modules.</div><div class=\"ml-vi\"><b>Mô-đun hoá</b> là quá trình chia một dự án/chương trình lớn thành các mô-đun nhỏ hơn, độc lập, dễ quản lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is used to store firmware.|||Loại bộ nhớ nào dùng để lưu firmware.",
          "options": [
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "ROM|||ROM"
            },
            {
              "text": "Cache|||Bộ nhớ đệm (cache)"
            },
            {
              "text": "Register|||Thanh ghi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Firmware</b> (low-level software controlling hardware) is classically stored in <b>ROM</b> (or its variants: PROM/EPROM/EEPROM/Flash), which retains data without power.</div><div class=\"ml-vi\"><b>Firmware</b> (phần mềm cấp thấp điều khiển phần cứng) theo cách hiểu kinh điển được lưu trong <b>ROM</b> (hoặc các biến thể PROM/EPROM/EEPROM/Flash), giữ dữ liệu không cần nguồn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "During this time, computers were used only by professional programmers, computers were built with vacuum tubes, magnetic drums for internal storage. What is this time?|||Trong thời kỳ này, máy tính chỉ được dùng bởi các lập trình viên chuyên nghiệp, máy tính được chế tạo bằng đèn điện tử chân không, trống từ để lưu trữ nội bộ. Đây là thời kỳ nào?",
          "options": [
            {
              "text": "First generation|||Thế hệ thứ nhất"
            },
            {
              "text": "Second generation|||Thế hệ thứ hai"
            },
            {
              "text": "Third generation|||Thế hệ thứ ba"
            },
            {
              "text": "Fourth generation|||Thế hệ thứ tư"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Vacuum tubes and magnetic drum storage, plus restricted access to trained professionals, are the hallmarks of the <b>first generation</b> of computers.</div><div class=\"ml-vi\">Đèn điện tử chân không, trống từ lưu trữ, và chỉ dành cho chuyên gia được đào tạo là đặc trưng của <b>thế hệ máy tính thứ nhất</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Defining the users, requirements, and methods is part of the ________ phase.|||Xác định người dùng, yêu cầu và phương pháp là một phần của giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Gathering and defining users, requirements and methods is exactly the work of the <b>analysis</b> phase.</div><div class=\"ml-vi\">Việc xác định người dùng, yêu cầu và phương pháp chính là công việc của giai đoạn <b>phân tích</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the network database model, the entities are organized in a _______ in which some entities can be accessed through several paths|||Trong mô hình cơ sở dữ liệu mạng, các thực thể được tổ chức thành một _______ trong đó một số thực thể có thể được truy cập qua nhiều đường",
          "options": [
            {
              "text": "Graph|||Đồ thị (graph)"
            },
            {
              "text": "Tree|||Cây (tree)"
            },
            {
              "text": "Table|||Bảng (table)"
            },
            {
              "text": "Stack|||Ngăn xếp (stack)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The network model organizes entities as a <b>graph</b>, allowing many-to-many relationships and multiple access paths, unlike the strictly tree-shaped hierarchical model.</div><div class=\"ml-vi\">Mô hình mạng tổ chức thực thể thành một <b>đồ thị</b>, cho phép quan hệ nhiều-nhiều và nhiều đường truy cập, khác với mô hình phân cấp có dạng cây nghiêm ngặt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ______ sort, the smallest item moves to the beginning of the unsorted list. There is no one-to-one swapping.|||Trong sắp xếp ______, phần tử nhỏ nhất được chuyển tới đầu danh sách chưa sắp xếp. Không có việc hoán đổi từng cặp một.",
          "options": [
            {
              "text": "Selection|||Chọn (selection)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Every|||Mọi loại"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Selection sort</b> repeatedly finds the smallest remaining item and places it at the front with a single swap per pass.</div><div class=\"ml-vi\"><b>Sắp xếp chọn</b> liên tục tìm phần tử nhỏ nhất còn lại và đặt nó lên đầu chỉ với một lần hoán đổi mỗi vòng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The push operation ________ of the stack.|||Thao tác push ________ của ngăn xếp.",
          "options": [
            {
              "text": "Deletes an item at the top|||Xoá một phần tử ở đỉnh"
            },
            {
              "text": "Deletes an item at the bottom|||Xoá một phần tử ở đáy"
            },
            {
              "text": "Inserts an item at the top|||Chèn một phần tử vào đỉnh"
            },
            {
              "text": "Inserts an item at the bottom|||Chèn một phần tử vào đáy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Push</b> inserts (adds) a new item at the <b>top</b> of the stack; pop removes the top item.</div><div class=\"ml-vi\"><b>Push</b> chèn (thêm) một phần tử mới vào <b>đỉnh</b> ngăn xếp; pop lấy phần tử ở đỉnh ra.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Main memory in a computer usually consists of large amounts of ______ speed memory.|||Bộ nhớ chính trong máy tính thường bao gồm một lượng lớn bộ nhớ tốc độ ______.",
          "options": [
            {
              "text": "High|||Cao"
            },
            {
              "text": "Medium|||Trung bình"
            },
            {
              "text": "Low|||Thấp"
            },
            {
              "text": "Very high|||Rất cao"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Main memory (RAM) sits in the <b>medium</b> tier of the memory hierarchy: much faster than disk but slower than cache/registers, trading speed for large, affordable capacity.</div><div class=\"ml-vi\">Bộ nhớ chính (RAM) nằm ở tầng <b>trung bình</b> trong phân cấp bộ nhớ: nhanh hơn nhiều so với đĩa nhưng chậm hơn cache/thanh ghi, đánh đổi tốc độ lấy dung lượng lớn, giá phải chăng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An error in computer data is called|||Một lỗi trong dữ liệu máy tính được gọi là",
          "options": [
            {
              "text": "Chip|||Chip"
            },
            {
              "text": "Bug|||Lỗi (bug)"
            },
            {
              "text": "Bit|||Bit"
            },
            {
              "text": "Byte|||Byte"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An error in a program or its data is commonly called a <b>bug</b>.</div><div class=\"ml-vi\">Một lỗi trong chương trình hoặc dữ liệu của nó thường được gọi là <b>bug</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a three-level DBMS architecture, the layer that interacts directly with the hardware is the ________ level.|||Trong kiến trúc DBMS ba mức, mức tương tác trực tiếp với phần cứng là mức ________.",
          "options": [
            {
              "text": "External|||Ngoài (external)"
            },
            {
              "text": "Conceptual|||Khái niệm (conceptual)"
            },
            {
              "text": "Internal|||Trong (internal)"
            },
            {
              "text": "Physical|||Vật lý"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The ANSI-SPARC three-level architecture is External, Conceptual and <b>Internal</b>; the internal level is the one that deals directly with physical storage on hardware.</div><div class=\"ml-vi\">Kiến trúc ba mức ANSI-SPARC gồm External, Conceptual và <b>Internal</b>; mức internal là mức tương tác trực tiếp với lưu trữ vật lý trên phần cứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ___________cryptography, the same key is used by the sender and the receiver.|||Trong mật mã ___________, cùng một khoá được dùng bởi cả người gửi và người nhận.",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Open-key|||Khoá mở"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Symmetric-key</b> cryptography uses one shared key for both encryption (sender) and decryption (receiver).</div><div class=\"ml-vi\">Mật mã <b>khoá đối xứng</b> dùng chung một khoá cho cả mã hoá (người gửi) và giải mã (người nhận).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Each element in a record is called ________.|||Mỗi phần tử trong một bản ghi được gọi là ________.",
          "options": [
            {
              "text": "A variable|||Biến (variable)"
            },
            {
              "text": "An index|||Chỉ số (index)"
            },
            {
              "text": "A field|||Trường (field)"
            },
            {
              "text": "A node|||Nút (node)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each individual element of a record is called a <b>field</b>.</div><div class=\"ml-vi\">Mỗi phần tử riêng lẻ của một bản ghi được gọi là một <b>trường (field)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Personnel who design, program, operate and maintain computer equipment refers to|||Nhân sự thiết kế, lập trình, vận hành và bảo trì thiết bị máy tính được gọi là",
          "options": [
            {
              "text": "Console-operator|||Người vận hành bảng điều khiển (console-operator)"
            },
            {
              "text": "Programmer|||Lập trình viên"
            },
            {
              "text": "Peopleware|||Nhân sự máy tính (peopleware)"
            },
            {
              "text": "System Analyst|||Chuyên viên phân tích hệ thống"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Peopleware</b> is the textbook term for all personnel involved with computer systems collectively — design, programming, operation and maintenance.</div><div class=\"ml-vi\"><b>Peopleware</b> là thuật ngữ chỉ chung toàn bộ nhân sự liên quan tới hệ thống máy tính — thiết kế, lập trình, vận hành và bảo trì.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______are unwanted programs that are hidden within other programs (host). When the user executes the host program|||______ là những chương trình không mong muốn ẩn bên trong chương trình khác (chương trình chủ). Khi người dùng chạy chương trình chủ",
          "options": [
            {
              "text": "DoS|||DoS"
            },
            {
              "text": "Trojan horses|||Ngựa thành Troy (Trojan horses)"
            },
            {
              "text": "Worms|||Sâu máy tính (Worms)"
            },
            {
              "text": "Viruses|||Virus"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>Trojan horse</b> hides inside a legitimate host program and activates when the user runs that host.</div><div class=\"ml-vi\"><b>Trojan horse</b> ẩn bên trong một chương trình chủ hợp lệ và kích hoạt khi người dùng chạy chương trình chủ đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A group contains ______ bits in the binary system are represented as one digit in the octal system.|||Một nhóm gồm ______ bit trong hệ nhị phân được biểu diễn thành một chữ số trong hệ bát phân.",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Octal is base 8 = 2^3, so each octal digit corresponds to exactly <b>3</b> binary bits.</div><div class=\"ml-vi\">Bát phân có cơ số 8 = 2^3, nên mỗi chữ số bát phân tương ứng với đúng <b>3</b> bit nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____________is the standard protocol provided by TCP/IP for copying a file from one host to another andtransferring files from one system to another seems simple and straightforward.|||____________ là giao thức chuẩn do TCP/IP cung cấp để sao chép tệp từ máy này sang máy khác.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "URL|||URL"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>FTP</b> (File Transfer Protocol) is the standard TCP/IP protocol specifically designed for copying/transferring files between hosts.</div><div class=\"ml-vi\"><b>FTP</b> (File Transfer Protocol) là giao thức chuẩn của TCP/IP được thiết kế riêng để sao chép/truyền tệp giữa các máy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The CD-ROM is read using a _____beam. The beam is reflected by the aluminum surface when passing through a land. It is reflected twice when it encounters a pit, once by the pit boundary and once by the aluminum boundary.|||Đĩa CD-ROM được đọc bằng một chùm _____. Chùm tia phản xạ qua bề mặt nhôm khi đi qua vùng phẳng (land). Nó phản xạ hai lần khi gặp một hố lõm (pit).",
          "options": [
            {
              "text": "Laser|||Laser"
            },
            {
              "text": "Red laser|||Laser đỏ"
            },
            {
              "text": "Low-power laser|||Laser công suất thấp (low-power)"
            },
            {
              "text": "Ultraviolet light|||Tia cực tím"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">CD-ROM reading uses a <b>low-power laser</b> beam (as opposed to the high-power laser used for writing/burning) to avoid damaging the disc surface.</div><div class=\"ml-vi\">Đọc đĩa CD-ROM dùng chùm <b>laser công suất thấp</b> (khác với laser công suất cao dùng để ghi/đốt đĩa) để tránh làm hỏng bề mặt đĩa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In data storage, text is an example of _______ data and audio is an example of _____ data.|||Trong lưu trữ dữ liệu, văn bản là ví dụ của dữ liệu _______ và âm thanh là ví dụ của dữ liệu _____.",
          "options": [
            {
              "text": "Analog, digital|||Tương tự, số"
            },
            {
              "text": "Digital, analog|||Số, tương tự"
            },
            {
              "text": "Digital, digital|||Số, số"
            },
            {
              "text": "Analog, analog|||Tương tự, tương tự"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Text is inherently made of discrete symbols/characters — <b>digital</b> by nature. Sound is a continuous wave — <b>analog</b> by nature, before it gets digitized.</div><div class=\"ml-vi\">Văn bản vốn được cấu tạo từ các ký hiệu/ký tự rời rạc — bản chất là <b>số (digital)</b>. Âm thanh là sóng liên tục — bản chất là <b>tương tự (analog)</b>, trước khi được số hoá.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a linked list, each element contains ________.|||Trong một danh sách liên kết, mỗi phần tử chứa ________.",
          "options": [
            {
              "text": "Only data|||Chỉ dữ liệu"
            },
            {
              "text": "Only a link|||Chỉ một liên kết"
            },
            {
              "text": "Neither data nor a link|||Không dữ liệu cũng không liên kết"
            },
            {
              "text": "Data and a link|||Dữ liệu và một liên kết"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Each node of a linked list holds both a <b>data</b> field and a <b>link</b> (pointer) to the next node.</div><div class=\"ml-vi\">Mỗi nút của danh sách liên kết chứa cả trường <b>dữ liệu</b> và một <b>liên kết</b> (con trỏ) tới nút kế tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is NOT a standard of vector graphic?|||Đâu KHÔNG phải là một chuẩn đồ hoạ vector?",
          "options": [
            {
              "text": "CAD|||CAD"
            },
            {
              "text": "FLASH|||FLASH"
            },
            {
              "text": "TrueType|||TrueType"
            },
            {
              "text": "PostScript|||PostScript"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">CAD, Flash (SWF) and PostScript are general-purpose vector graphics standards. <b>TrueType</b> is specifically a font outline technology, categorized separately from general vector graphic formats.</div><div class=\"ml-vi\">CAD, Flash (SWF) và PostScript là các chuẩn đồ hoạ vector đa dụng. <b>TrueType</b> thực chất là công nghệ đường viền phông chữ, được xếp loại riêng khỏi các định dạng đồ hoạ vector nói chung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In physical layer, an ______ has infinitely many levels of intensity over a period of time|||Trong tầng vật lý, một ______ có vô số mức cường độ trong một khoảng thời gian",
          "options": [
            {
              "text": "Analog signals|||Tín hiệu tương tự"
            },
            {
              "text": "Electromagnetic signals|||Tín hiệu điện từ"
            },
            {
              "text": "Digital signals|||Tín hiệu số"
            },
            {
              "text": "Electronic signals|||Tín hiệu điện tử"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>analog</b> signal can take infinitely many values (continuous), unlike a digital signal which has a finite number of discrete levels.</div><div class=\"ml-vi\">Tín hiệu <b>tương tự (analog)</b> có thể nhận vô số giá trị (liên tục), khác với tín hiệu số vốn chỉ có một số hữu hạn mức rời rạc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "IP addresses are currently ________ bits in length.|||Địa chỉ IP hiện nay dài ________ bit.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "40|||40"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The classic (IPv4) address is <b>32 bits</b> long.</div><div class=\"ml-vi\">Địa chỉ IP cổ điển (IPv4) dài <b>32 bit</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A(n) ________ list is also known as a queue.|||Một danh sách ________ còn được gọi là hàng đợi.",
          "options": [
            {
              "text": "LIFO|||LIFO"
            },
            {
              "text": "FIFO|||FIFO"
            },
            {
              "text": "unordered|||không có thứ tự"
            },
            {
              "text": "ordered|||có thứ tự"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A queue processes items <b>FIFO</b> (First In, First Out) — the same order property that defines a FIFO list.</div><div class=\"ml-vi\">Hàng đợi xử lý phần tử theo <b>FIFO</b> (Vào trước, Ra trước) — đúng tính chất định nghĩa một danh sách FIFO.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _______ cryptography symbols are permuted or substituted; in asymmetric-key cryptography numbers are manipulated|||Trong mật mã _______ các ký hiệu được hoán vị hoặc thay thế; trong mật mã khoá bất đối xứng các con số được thao túng",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Classical <b>symmetric-key</b> ciphers work by permuting or substituting symbols (letters); asymmetric-key cryptography instead relies on mathematical manipulation of numbers.</div><div class=\"ml-vi\">Mật mã <b>khoá đối xứng</b> cổ điển hoạt động bằng cách hoán vị hoặc thay thế ký hiệu (chữ cái); mật mã khoá bất đối xứng lại dựa vào thao tác toán học trên các con số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We use the ________ search for an ordered list.|||Ta dùng tìm kiếm ________ cho một danh sách đã sắp xếp.",
          "options": [
            {
              "text": "Sequential|||Tuần tự (sequential)"
            },
            {
              "text": "Binary|||Nhị phân (binary)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search</b> requires (and exploits) an ordered list to repeatedly halve the search space.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân</b> yêu cầu (và tận dụng) danh sách đã sắp xếp để liên tục chia đôi không gian tìm kiếm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ____ is a protocol that is used to define how the client-server programs can be written to retrieve web pages from the Web.|||____ là giao thức dùng để định nghĩa cách viết chương trình client-server để lấy trang web từ Web.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "TELNET|||TELNET"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>HTTP</b> defines how web client-server programs (browsers/servers) communicate to retrieve web pages.</div><div class=\"ml-vi\"><b>HTTP</b> định nghĩa cách các chương trình client-server trên web (trình duyệt/máy chủ) giao tiếp để lấy trang web.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______ is an English-language-like representation of code.|||______ là cách biểu diễn mã gần giống ngôn ngữ tiếng Anh.",
          "options": [
            {
              "text": "A UML diagram|||Sơ đồ UML"
            },
            {
              "text": "A program|||Một chương trình"
            },
            {
              "text": "Pseudocode|||Mã giả (pseudocode)"
            },
            {
              "text": "An algorithm|||Thuật toán"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Pseudocode</b> is an informal, English-like way of representing code/algorithm logic without a fixed syntax standard.</div><div class=\"ml-vi\"><b>Mã giả (pseudocode)</b> là cách biểu diễn logic mã/thuật toán không chính thức, gần giống tiếng Anh, không có cú pháp chuẩn cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When there is memory space available to load the program totally or partially the job moves to the _____. It now becomes a process.|||Khi có đủ không gian bộ nhớ để nạp toàn bộ hoặc một phần chương trình, công việc chuyển sang _____. Lúc này nó trở thành một tiến trình.",
          "options": [
            {
              "text": "Hold state|||Trạng thái giữ"
            },
            {
              "text": "Ready state|||Trạng thái sẵn sàng"
            },
            {
              "text": "Running state|||Trạng thái đang chạy"
            },
            {
              "text": "Waiting state|||Trạng thái chờ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Once admitted into memory, a job becomes a process and moves to the <b>ready</b> state, waiting to be scheduled onto the CPU.</div><div class=\"ml-vi\">Sau khi được nạp vào bộ nhớ, một công việc trở thành tiến trình và chuyển sang trạng thái <b>sẵn sàng</b>, chờ được lập lịch vào CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ ciphers are sometimes called public-key ciphers|||Mật mã _____ đôi khi còn được gọi là mật mã khoá công khai",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> ciphers use a public/private key pair, so they are also called public-key ciphers.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> dùng một cặp khoá công khai/riêng tư, nên còn được gọi là mật mã khoá công khai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the analysis process in the system implementation phase that will use a program as an active agent that manipulates passive object?|||Đâu là phương pháp phân tích trong giai đoạn cài đặt hệ thống, xem chương trình là tác nhân chủ động thao túng đối tượng thụ động?",
          "options": [
            {
              "text": "Procedure-oriented analysis|||Phân tích hướng thủ tục"
            },
            {
              "text": "Structured analysis|||Phân tích có cấu trúc"
            },
            {
              "text": "Classical analysis|||Phân tích cổ điển"
            },
            {
              "text": "All of others|||Tất cả đáp án khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Viewing the program as an active agent manipulating passive data is exactly the procedural paradigm's perspective — matched here by <b>procedure-oriented analysis</b>.</div><div class=\"ml-vi\">Xem chương trình là tác nhân chủ động thao túng dữ liệu thụ động chính là góc nhìn của mô hình thủ tục — khớp với <b>phân tích hướng thủ tục</b> ở đây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the software quality, what factor measures can be mentioned for maintainability?|||Trong chất lượng phần mềm, yếu tố nào có thể được nhắc tới cho khả năng bảo trì (maintainability)?",
          "options": [
            {
              "text": "Accuracy|||Độ chính xác"
            },
            {
              "text": "Timeliness|||Tính kịp thời"
            },
            {
              "text": "Resusability|||Khả năng tái sử dụng"
            },
            {
              "text": "Changeability|||Khả năng thay đổi (changeability)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Changeability</b> — how easily software can be modified — is a core sub-factor of maintainability.</div><div class=\"ml-vi\"><b>Khả năng thay đổi (changeability)</b> — mức độ dễ dàng sửa đổi phần mềm — là yếu tố con cốt lõi của khả năng bảo trì.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a positional number system with base b, we can always find the number of digits of an integer. So how many digits can we find in the decimal number 20 in hexadecimal system?|||Trong hệ đếm vị trí cơ số b, ta luôn tìm được số chữ số của một số nguyên. Vậy số 20 trong hệ thập phân có bao nhiêu chữ số khi biểu diễn ở hệ thập lục phân?",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">20 in decimal = 14 in hexadecimal, which has <b>2</b> digits.</div><div class=\"ml-vi\">20 trong hệ thập phân = 14 trong hệ thập lục phân, có <b>2</b> chữ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ supervises the activity of each component in a computer system.|||________ giám sát hoạt động của từng thành phần trong một hệ thống máy tính.",
          "options": [
            {
              "text": "An operating system|||Một hệ điều hành"
            },
            {
              "text": "Hardware|||Phần cứng"
            },
            {
              "text": "A queue|||Một hàng đợi"
            },
            {
              "text": "An application program|||Một chương trình ứng dụng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>operating system</b> supervises and manages the activity of every hardware and software component in the system.</div><div class=\"ml-vi\"><b>Hệ điều hành</b> giám sát và quản lý hoạt động của mọi thành phần phần cứng và phần mềm trong hệ thống.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use an arithmetic left shift operation on the bit pattern 10011001. The pattern is an integer in two's complement format.|||Áp dụng phép dịch trái số học lên chuỗi bit 10011001. Chuỗi này là số nguyên ở dạng bù hai.",
          "options": [
            {
              "text": "00110010|||00110010"
            },
            {
              "text": "01100100|||01100100"
            },
            {
              "text": "10011001|||10011001"
            },
            {
              "text": "11001001|||11001001"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Left shift moves every bit one position left, dropping the old MSB and filling 0 at the LSB: 1001&thinsp;1001 &rarr; <b>0011&thinsp;0010</b>.</div><div class=\"ml-vi\">Dịch trái đẩy mọi bit sang trái một vị trí, bỏ bit cao nhất cũ và điền 0 vào bit thấp nhất mới: 1001&thinsp;1001 &rarr; <b>0011&thinsp;0010</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ___is the highest level in the file system hierarchy. This does not have a parent directory|||___ là mức cao nhất trong phân cấp hệ thống tệp. Nó không có thư mục cha",
          "options": [
            {
              "text": "Root directory|||Thư mục gốc (root)"
            },
            {
              "text": "Home directory|||Thư mục home"
            },
            {
              "text": "Working directory|||Thư mục làm việc"
            },
            {
              "text": "Parent directory|||Thư mục cha"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>root directory</b> is the top of the file system hierarchy and has no parent directory.</div><div class=\"ml-vi\"><b>Thư mục gốc (root)</b> là đỉnh của phân cấp hệ thống tệp và không có thư mục cha.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ who exploit the internet systems only to make public certain vast datasets of information that would be of benefit to everyone.|||_____ là những kẻ khai thác hệ thống internet chỉ để công khai một số tập dữ liệu khổng lồ mà họ tin là có lợi cho mọi người.",
          "options": [
            {
              "text": "Black Hat Hacker|||Hacker mũ đen"
            },
            {
              "text": "Grey Hat Hacker|||Hacker mũ xám (Grey Hat)"
            },
            {
              "text": "Red Hat Hacker|||Hacker mũ đỏ"
            },
            {
              "text": "Blue Hat Hacker|||Hacker mũ lam"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Grey Hat</b> hackers break rules but without purely malicious intent — often believing their actions serve the public good.</div><div class=\"ml-vi\"><b>Hacker mũ xám</b> vi phạm luật nhưng không hoàn toàn vì ý đồ xấu — thường tin rằng hành động của họ phục vụ lợi ích công chúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why OS is responsible for the efficient use of input/output devices?|||Vì sao hệ điều hành chịu trách nhiệm sử dụng hiệu quả các thiết bị vào/ra?",
          "options": [
            {
              "text": "Because need to maintains a queue for each input/output device|||Vì cần duy trì một hàng đợi cho mỗi thiết bị vào/ra"
            },
            {
              "text": "Because these devices are slower in speed compared with the CPU and memory|||Vì các thiết bị này chậm hơn nhiều so với CPU và bộ nhớ"
            },
            {
              "text": "It may use FIFO for one device|||Nó có thể dùng FIFO cho một thiết bị"
            },
            {
              "text": "The manager also needs to know when a device has finished serving one process|||Bộ quản lý cũng cần biết khi nào thiết bị đã phục vụ xong một tiến trình"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The fundamental reason is the huge <b>speed gap</b> between slow I/O devices and the fast CPU/memory — this mismatch is exactly why the OS must manage I/O efficiently (buffering, queuing, spooling all stem from it).</div><div class=\"ml-vi\">Lý do căn bản là <b>chênh lệch tốc độ</b> rất lớn giữa thiết bị I/O chậm và CPU/bộ nhớ nhanh — chính sự lệch pha này là lý do hệ điều hành phải quản lý I/O hiệu quả (đệm, hàng đợi, spool đều xuất phát từ đây).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "C++ and C# language are a(n) ________ language|||C++ và C# là ngôn ngữ ________",
          "options": [
            {
              "text": "Procedural|||Thủ tục"
            },
            {
              "text": "Functional|||Hàm"
            },
            {
              "text": "Declarative|||Khai báo"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Both C++ and C# are primarily classified as <b>object-oriented</b> languages, built around classes and objects.</div><div class=\"ml-vi\">Cả C++ và C# đều được xếp loại chủ yếu là ngôn ngữ <b>hướng đối tượng</b>, xây dựng quanh khái niệm lớp và đối tượng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ is a basic algorithm that adds a list of numbers.|||_______ là một thuật toán cơ bản dùng để cộng một danh sách các số.",
          "options": [
            {
              "text": "Summation|||Tính tổng (summation)"
            },
            {
              "text": "Product|||Tích (product)"
            },
            {
              "text": "Smallest|||Nhỏ nhất"
            },
            {
              "text": "Largest|||Lớn nhất"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Summation</b> is the basic algorithm of iterating through a list and accumulating a running total.</div><div class=\"ml-vi\"><b>Tính tổng (summation)</b> là thuật toán cơ bản duyệt qua danh sách và cộng dồn kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many symbols can be represented by a bit pattern with ten bits?|||Một chuỗi bit gồm mười bit có thể biểu diễn được bao nhiêu ký hiệu?",
          "options": [
            {
              "text": "128|||128"
            },
            {
              "text": "256|||256"
            },
            {
              "text": "512|||512"
            },
            {
              "text": "1024|||1024"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">10 bits can represent 2^10 = <b>1024</b> distinct symbols.</div><div class=\"ml-vi\">10 bit có thể biểu diễn 2^10 = <b>1024</b> ký hiệu khác nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use an arithmetic right shift operation on the bit pattern 10011001. The pattern is an integer in two's complement format.|||Áp dụng phép dịch phải số học lên chuỗi bit 10011001. Chuỗi này là số nguyên ở dạng bù hai.",
          "options": [
            {
              "text": "10001100|||10001100"
            },
            {
              "text": "11001100|||11001100"
            },
            {
              "text": "11001101|||11001101"
            },
            {
              "text": "10011001|||10011001"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Arithmetic right shift preserves the sign bit: shift right and duplicate the sign bit (1) into the new MSB: 1001&thinsp;1001 &rarr; <b>1100&thinsp;1100</b>.</div><div class=\"ml-vi\">Dịch phải số học giữ nguyên bit dấu: dịch phải rồi lặp lại bit dấu (1) vào bit cao nhất mới: 1001&thinsp;1001 &rarr; <b>1100&thinsp;1100</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "IP addresses are currently ________ bits in length.|||Địa chỉ IP hiện nay dài ________ bit.",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "32|||32"
            },
            {
              "text": "40|||40"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The classic (IPv4) address is <b>32 bits</b> long.</div><div class=\"ml-vi\">Địa chỉ IP cổ điển (IPv4) dài <b>32 bit</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A(n) ________ list is also known as a queue.|||Một danh sách ________ còn được gọi là hàng đợi.",
          "options": [
            {
              "text": "LIFO|||LIFO"
            },
            {
              "text": "FIFO|||FIFO"
            },
            {
              "text": "unordered|||không có thứ tự"
            },
            {
              "text": "ordered|||có thứ tự"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A queue is <b>FIFO</b> (First In, First Out).</div><div class=\"ml-vi\">Hàng đợi hoạt động theo kiểu <b>FIFO</b> (Vào trước, Ra trước).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _______ cryptography symbols are permuted or substituted; in asymmetric-key cryptography numbers are manipulated|||Trong mật mã _______ các ký hiệu được hoán vị hoặc thay thế; trong mật mã khoá bất đối xứng các con số được thao túng",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Classical <b>symmetric-key</b> ciphers permute or substitute symbols; asymmetric-key cryptography manipulates numbers mathematically.</div><div class=\"ml-vi\">Mật mã <b>khoá đối xứng</b> cổ điển hoán vị hoặc thay thế ký hiệu; mật mã khoá bất đối xứng thao túng con số bằng toán học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We use the ________ search for an ordered list.|||Ta dùng tìm kiếm ________ cho một danh sách đã sắp xếp.",
          "options": [
            {
              "text": "Sequential|||Tuần tự (sequential)"
            },
            {
              "text": "Binary|||Nhị phân (binary)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search</b> requires (and exploits) an ordered list.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân</b> yêu cầu (và tận dụng) danh sách đã sắp xếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ____ is a protocol that is used to define how the client-server programs can be written to retrieve web pages from the Web.|||____ là giao thức dùng để định nghĩa cách viết chương trình client-server để lấy trang web từ Web.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "TELNET|||TELNET"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>HTTP</b> defines how web client-server programs communicate to retrieve web pages.</div><div class=\"ml-vi\"><b>HTTP</b> định nghĩa cách các chương trình client-server trên web giao tiếp để lấy trang web.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______ is an English-language-like representation of code.|||______ là cách biểu diễn mã gần giống ngôn ngữ tiếng Anh.",
          "options": [
            {
              "text": "A UML diagram|||Sơ đồ UML"
            },
            {
              "text": "A program|||Một chương trình"
            },
            {
              "text": "Pseudocode|||Mã giả (pseudocode)"
            },
            {
              "text": "An algorithm|||Thuật toán"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Pseudocode</b> is an informal, English-like way of representing code/algorithm logic.</div><div class=\"ml-vi\"><b>Mã giả (pseudocode)</b> là cách biểu diễn logic mã/thuật toán không chính thức, gần giống tiếng Anh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When there is memory space available to load the program totally or partially the job moves to the _____. It now becomes a process.|||Khi có đủ không gian bộ nhớ để nạp toàn bộ hoặc một phần chương trình, công việc chuyển sang _____. Lúc này nó trở thành một tiến trình.",
          "options": [
            {
              "text": "Hold state|||Trạng thái giữ"
            },
            {
              "text": "Ready state|||Trạng thái sẵn sàng"
            },
            {
              "text": "Running state|||Trạng thái đang chạy"
            },
            {
              "text": "Waiting state|||Trạng thái chờ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Once admitted into memory, a job becomes a process and moves to the <b>ready</b> state.</div><div class=\"ml-vi\">Sau khi được nạp vào bộ nhớ, một công việc trở thành tiến trình và chuyển sang trạng thái <b>sẵn sàng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ ciphers are sometimes called public-key ciphers|||Mật mã _____ đôi khi còn được gọi là mật mã khoá công khai",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> ciphers use a public/private key pair, so they are also called public-key ciphers.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> dùng một cặp khoá công khai/riêng tư, nên còn được gọi là mật mã khoá công khai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the analysis process in the system implementation phase that will use a program as an active agent that manipulates passive object?|||Đâu là phương pháp phân tích trong giai đoạn cài đặt hệ thống, xem chương trình là tác nhân chủ động thao túng đối tượng thụ động?",
          "options": [
            {
              "text": "Procedure-oriented analysis|||Phân tích hướng thủ tục"
            },
            {
              "text": "Structured analysis|||Phân tích có cấu trúc"
            },
            {
              "text": "Classical analysis|||Phân tích cổ điển"
            },
            {
              "text": "All of others|||Tất cả đáp án khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This matches the procedural paradigm's perspective — <b>procedure-oriented analysis</b>.</div><div class=\"ml-vi\">Điều này khớp với góc nhìn của mô hình thủ tục — <b>phân tích hướng thủ tục</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The format of an IPv4 address is referred to as_______.|||Định dạng của một địa chỉ IPv4 được gọi là_______.",
          "options": [
            {
              "text": "Dotted-binary notation|||Ký hiệu chấm-nhị phân"
            },
            {
              "text": "Dotted-octal notation|||Ký hiệu chấm-bát phân"
            },
            {
              "text": "Dotted-decimal notation|||Ký hiệu chấm-thập phân"
            },
            {
              "text": "Dotted-hexadecimal notation|||Ký hiệu chấm-thập lục phân"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">IPv4 addresses are written as four decimal numbers separated by dots — <b>dotted-decimal notation</b> (e.g. 192.168.1.1).</div><div class=\"ml-vi\">Địa chỉ IPv4 được viết dưới dạng bốn số thập phân cách nhau bằng dấu chấm — <b>ký hiệu chấm-thập phân</b> (VD 192.168.1.1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A binary operator is applied to ________ relations (s) and creates an output of ________ relation(s).|||Toán tử hai ngôi (binary) áp dụng lên ________ quan hệ và tạo ra kết quả là ________ quan hệ.",
          "options": [
            {
              "text": "One, one|||Một, một"
            },
            {
              "text": "One, two|||Một, hai"
            },
            {
              "text": "Two, one|||Hai, một"
            },
            {
              "text": "Two, two|||Hai, hai"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">By definition, a <b>binary</b> operator takes exactly <b>two</b> relations as input and produces exactly <b>one</b> relation as output.</div><div class=\"ml-vi\">Theo định nghĩa, toán tử <b>hai ngôi</b> nhận vào đúng <b>hai</b> quan hệ và tạo ra đúng <b>một</b> quan hệ kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In an inorder traversal of a binary tree, the root is processed ________.|||Trong duyệt cây nhị phân theo thứ tự giữa (inorder), gốc được xử lý ________.",
          "options": [
            {
              "text": "First|||Đầu tiên"
            },
            {
              "text": "Second|||Thứ hai"
            },
            {
              "text": "Last|||Cuối cùng"
            },
            {
              "text": "Two times|||Hai lần"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Inorder</b> visits Left subtree, then Root, then Right subtree — the root is processed second, in between the two subtrees.</div><div class=\"ml-vi\"><b>Inorder</b> duyệt cây con Trái, rồi tới Gốc, rồi cây con Phải — gốc được xử lý ở vị trí thứ hai, giữa hai cây con.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the modulo division hashing the reason for adding a 1 to the mod operation result is ____|||Trong băm chia lấy dư, lý do cộng thêm 1 vào kết quả phép mod là ____",
          "options": [
            {
              "text": "That our list starts with 1 instead of 0|||Vì danh sách của ta bắt đầu từ 1 thay vì 0"
            },
            {
              "text": "That the key starts from 1|||Vì khoá bắt đầu từ 1"
            },
            {
              "text": "That the prime number more than 1|||Vì số nguyên tố lớn hơn 1"
            },
            {
              "text": "All of others|||Tất cả đáp án khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">h(key) = (key mod D) gives a result in [0, D-1]; adding 1 shifts it to [1, D] so it matches a storage list that is <b>1-indexed instead of 0-indexed</b>.</div><div class=\"ml-vi\">h(key) = (key mod D) cho kết quả trong khoảng [0, D-1]; cộng thêm 1 dịch chuyển thành [1, D] để khớp với danh sách lưu trữ <b>đánh số từ 1 thay vì từ 0</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the attacks threaten the confidentiality of information ____ refers to unauthorized access to or interception of data.|||Trong các tấn công đe doạ tính bí mật của thông tin, ____ đề cập tới việc truy cập trái phép hoặc chặn bắt dữ liệu.",
          "options": [
            {
              "text": "Snooping|||Nghe lén (snooping)"
            },
            {
              "text": "Repudiation|||Chối bỏ (repudiation)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Traffic analysis|||Phân tích lưu lượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Snooping</b> is unauthorized access to or interception of data — a direct passive confidentiality attack, distinct from traffic analysis which infers information from patterns rather than reading content directly.</div><div class=\"ml-vi\"><b>Nghe lén (snooping)</b> là truy cập trái phép hoặc chặn bắt dữ liệu — một tấn công thụ động trực tiếp vào tính bí mật, khác với phân tích lưu lượng vốn suy luận thông tin từ mẫu lưu lượng chứ không đọc trực tiếp nội dung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______is the process by which a given set of relations are transformed to a new set of relations with a more solid structure.|||______ là quá trình biến đổi một tập quan hệ cho trước thành một tập quan hệ mới có cấu trúc chặt chẽ hơn.",
          "options": [
            {
              "text": "Relational database|||Cơ sở dữ liệu quan hệ"
            },
            {
              "text": "Database system|||Hệ cơ sở dữ liệu"
            },
            {
              "text": "Atomic operations|||Thao tác nguyên tử"
            },
            {
              "text": "Normalization|||Chuẩn hoá (normalization)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Normalization</b> transforms relations into a new set with a more solid (less redundant) structure.</div><div class=\"ml-vi\"><b>Chuẩn hoá</b> biến đổi các quan hệ thành một tập mới có cấu trúc chặt chẽ hơn (ít dư thừa hơn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is language of procedural paradigm that is high level language and also has some low-level instructions?|||Ngôn ngữ nào theo mô hình thủ tục, là ngôn ngữ bậc cao nhưng vẫn có một số lệnh cấp thấp?",
          "options": [
            {
              "text": "COBOL|||COBOL"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Ada|||Ada"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>C</b> is known as a high-level language that still allows low-level operations such as pointer arithmetic.</div><div class=\"ml-vi\"><b>C</b> nổi tiếng là ngôn ngữ bậc cao nhưng vẫn cho phép các thao tác cấp thấp như số học con trỏ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A(n)____ is a suitable structure when a small number of insertions and deletions are required but a lot of searching and retrieval is needed|||A(n)____ là cấu trúc phù hợp khi cần ít thao tác chèn/xoá nhưng cần tìm kiếm và truy xuất nhiều",
          "options": [
            {
              "text": "Array|||Mảng (array)"
            },
            {
              "text": "Record|||Bản ghi (record)"
            },
            {
              "text": "Linked list|||Danh sách liên kết"
            },
            {
              "text": "Tree|||Cây (tree)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>array</b> gives fast indexed/searching access (especially sorted + binary search); insertions/deletions are costly (shifting) but that's acceptable when they are rare.</div><div class=\"ml-vi\"><b>Mảng (array)</b> cho truy cập/tìm kiếm nhanh (đặc biệt khi đã sắp xếp + tìm nhị phân); chèn/xoá tốn kém (phải dịch chuyển) nhưng chấp nhận được vì ít xảy ra.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following representations is erroneous?|||Cách biểu diễn nào sau đây là sai?",
          "options": [
            {
              "text": "(110)2|||(110)2"
            },
            {
              "text": "(141)8|||(141)8"
            },
            {
              "text": "(EF)16|||(EF)16"
            },
            {
              "text": "22A|||22A"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(110)2, (141)8 and (EF)16 are all valid within their stated base. <b>22A</b> has no base marker (implying decimal) but contains \"A\", which is not a valid decimal digit — erroneous.</div><div class=\"ml-vi\">(110)2, (141)8 và (EF)16 đều hợp lệ trong cơ số được ghi rõ. <b>22A</b> không ghi cơ số (ngầm định thập phân) nhưng có chữ \"A\", không phải chữ số thập phân hợp lệ — sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Human beings are referred to as Homosapiens. Which device is called Silico sapiens?|||Con người được gọi là Homosapiens. Thiết bị nào được gọi là Silico sapiens?",
          "options": [
            {
              "text": "Calculator|||Máy tính bỏ túi"
            },
            {
              "text": "Smartphone|||Điện thoại thông minh"
            },
            {
              "text": "Robot|||Robot"
            },
            {
              "text": "Computer|||Máy tính (computer)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">\"Silico sapiens\" (silicon-based \"wise one\") is a playful nickname for the <b>computer</b>, echoing \"Homo sapiens\" for humans — silicon chips being the computer's foundation the way biology is ours.</div><div class=\"ml-vi\">\"Silico sapiens\" (loài \"khôn ngoan\" gốc silicon) là biệt danh vui chỉ <b>máy tính (computer)</b>, nhại theo \"Homo sapiens\" của loài người — chip silicon là nền tảng của máy tính giống như sinh học là nền tảng của con người.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D4",
      "source": "REAL",
      "sortOrder": 3,
      "title": "Đề 4 — SP2024 Final Exam|||Đề 4 — Thi cuối kỳ SP2024",
      "description": "CSI104 real FE multiple-choice paper (Spring 2024), transcribed from the exam images. 5 of the 60 question images were missing from the source scan (Q6, Q35, Q56, Q57's sibling, Q58) and were replaced by equivalent authored questions on the same syllabus topics not covered elsewhere in this paper. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2024), chép từ ảnh đề. 5 trong 60 ảnh câu hỏi bị thiếu trong bản quét gốc (câu 6, 35, 56, 58 và một câu liên quan) đã được thay bằng câu tương đương do biên soạn, cùng chủ đề giáo trình. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is the user programmed semiconductor memory?|||Loại bộ nhớ bán dẫn nào có thể được người dùng lập trình?",
          "options": [
            {
              "text": "SRAM|||SRAM"
            },
            {
              "text": "DRAM|||DRAM"
            },
            {
              "text": "EPROM|||EPROM"
            },
            {
              "text": "Cache|||Bộ nhớ đệm (cache)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>EPROM</b> (Erasable Programmable ROM) can be programmed by the user (with a special programmer device) and erased with UV light; SRAM/DRAM/cache are read-write volatile memory, not user-\"programmed\" ROM.</div><div class=\"ml-vi\"><b>EPROM</b> (ROM có thể xoá và lập trình lại) có thể được người dùng lập trình (bằng thiết bị lập trình chuyên dụng) và xoá bằng tia UV; SRAM/DRAM/cache là bộ nhớ đọc-ghi khả biến, không phải ROM được \"lập trình\".</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Each column in a relation is called ________.|||Mỗi cột trong một quan hệ được gọi là ________.",
          "options": [
            {
              "text": "An attribute|||Thuộc tính (attribute)"
            },
            {
              "text": "A tuple|||Bộ (tuple)"
            },
            {
              "text": "A union|||Phép hợp (union)"
            },
            {
              "text": "A key|||Khoá (key)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Each column of a relation (table) is called an <b>attribute</b>; each row is called a tuple.</div><div class=\"ml-vi\">Mỗi cột của một quan hệ (bảng) được gọi là một <b>thuộc tính</b>; mỗi dòng được gọi là một bộ (tuple).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ is a declarative language used on relational databases.|||________ là ngôn ngữ khai báo được dùng trên các cơ sở dữ liệu quan hệ.",
          "options": [
            {
              "text": "C|||C"
            },
            {
              "text": "SQL|||SQL"
            },
            {
              "text": "Python|||Python"
            },
            {
              "text": "Assembly|||Hợp ngữ"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>SQL</b> (Structured Query Language) is the standard declarative language for querying and managing relational databases — you state WHAT you want, not HOW to get it.</div><div class=\"ml-vi\"><b>SQL</b> (Structured Query Language) là ngôn ngữ khai báo chuẩn để truy vấn và quản lý cơ sở dữ liệu quan hệ — bạn nói CÁI GÌ mình muốn, không cần nói LÀM SAO để lấy được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In peripheral device management, what is the principle of hierarchical work on OS of third-generation computers?|||Trong quản lý thiết bị ngoại vi, nguyên tắc làm việc phân cấp trên hệ điều hành của máy tính thế hệ thứ ba là gì?",
          "options": [
            {
              "text": "Processor - Peripheral device - Control device|||Bộ xử lý - Thiết bị ngoại vi - Bộ điều khiển"
            },
            {
              "text": "Processor - Control device - Peripheral device|||Bộ xử lý - Bộ điều khiển - Thiết bị ngoại vi"
            },
            {
              "text": "Control device - Peripheral device - Processor|||Bộ điều khiển - Thiết bị ngoại vi - Bộ xử lý"
            },
            {
              "text": "None of the answers are correct|||Không đáp án nào đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The CPU issues a command to a <b>control device</b> (device controller), which in turn drives the physical <b>peripheral device</b> — a strict top-down chain of command.</div><div class=\"ml-vi\">CPU phát lệnh tới <b>bộ điều khiển</b> (device controller), rồi bộ điều khiển mới thao tác <b>thiết bị ngoại vi</b> vật lý — một chuỗi điều khiển từ trên xuống nghiêm ngặt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The maximum value of a hexadecimal integer with K digits is Nmax = ________?|||Giá trị lớn nhất của một số nguyên thập lục phân có K chữ số là Nmax = ________?",
          "options": [
            {
              "text": "16 x K|||16 x K"
            },
            {
              "text": "16^K|||16^K"
            },
            {
              "text": "16^K - 1|||16^K - 1"
            },
            {
              "text": "K^16|||K^16"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">K hex digits give 16^K distinct values (0 to 16^K - 1), so the maximum representable value is <b>16^K - 1</b> (e.g. K=2 digits &rarr; max FF = 255 = 16^2 - 1).</div><div class=\"ml-vi\">K chữ số hex tạo được 16^K giá trị khác nhau (từ 0 đến 16^K - 1), nên giá trị lớn nhất biểu diễn được là <b>16^K - 1</b> (VD K=2 chữ số &rarr; max FF = 255 = 16^2 - 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which pair of logic gates are called universal gates, since each one alone can implement any Boolean function?|||Cặp cổng logic nào được gọi là cổng vạn năng, vì mỗi cổng đứng riêng cũng đủ để hiện thực mọi hàm Boole?",
          "options": [
            {
              "text": "AND, OR|||AND, OR"
            },
            {
              "text": "NAND, NOR|||NAND, NOR"
            },
            {
              "text": "XOR, XNOR|||XOR, XNOR"
            },
            {
              "text": "NOT, AND|||NOT, AND"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>NAND</b> and <b>NOR</b> are each functionally complete on their own — either one alone can build NOT, AND and OR, so any circuit can be constructed from just one gate type.</div><div class=\"ml-vi\"><b>NAND</b> và <b>NOR</b> mỗi cổng đều đầy đủ về mặt hàm — chỉ riêng một loại cũng dựng được NOT, AND và OR, nên có thể xây mọi mạch chỉ từ một loại cổng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the asymmetric-key method used for confidentiality, which key(s) is (are) publicly known?|||Trong phương pháp khoá bất đối xứng dùng cho tính bí mật, khoá nào được công khai?",
          "options": [
            {
              "text": "Encryption key only|||Chỉ khoá mã hoá"
            },
            {
              "text": "Decryption key only|||Chỉ khoá giải mã"
            },
            {
              "text": "Both encryption and decryption keys|||Cả khoá mã hoá và khoá giải mã"
            },
            {
              "text": "Neither key|||Không khoá nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For confidentiality, everyone knows the recipient's <b>public encryption key</b> to send them a secret message, but only the recipient holds the <b>private decryption key</b> needed to read it.</div><div class=\"ml-vi\">Để đảm bảo bí mật, mọi người đều biết <b>khoá mã hoá công khai</b> của người nhận để gửi thông điệp bí mật, nhưng chỉ người nhận giữ <b>khoá giải mã riêng tư</b> cần để đọc được nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which parallel processing organization just shows the concept and it has never been implemented?|||Loại tổ chức xử lý song song nào chỉ mang tính khái niệm và chưa từng được hiện thực?",
          "options": [
            {
              "text": "SIMD - Single Instruction-stream, Multiple Data-stream|||SIMD - Một dòng lệnh, Nhiều dòng dữ liệu"
            },
            {
              "text": "MISD -  Multiple Instruction-stream, Single Data-stream|||MISD - Nhiều dòng lệnh, Một dòng dữ liệu"
            },
            {
              "text": "MIMD - Multiple Instruction-stream, Multiple Data-stream|||MIMD - Nhiều dòng lệnh, Nhiều dòng dữ liệu"
            },
            {
              "text": "All of others|||Tất cả đáp án khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>MISD</b> is a theoretical category in Flynn's taxonomy with essentially no practical general-purpose implementations, unlike SIMD (GPUs/vector processors) and MIMD (multiprocessors), which are widely used.</div><div class=\"ml-vi\"><b>MISD</b> là một loại lý thuyết trong phân loại Flynn, gần như không có hiện thực thực tế nào cho mục đích chung, khác với SIMD (GPU/bộ xử lý vector) và MIMD (đa xử lý) vốn được dùng rộng rãi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which I/O device allow the CPU/memory to communicate with the outside world, but they cannot store information?|||Thiết bị I/O nào cho phép CPU/bộ nhớ giao tiếp với thế giới bên ngoài, nhưng không thể lưu trữ thông tin?",
          "options": [
            {
              "text": "Printers|||Máy in"
            },
            {
              "text": "Magnetic disks|||Đĩa từ"
            },
            {
              "text": "Magnetic tape|||Băng từ"
            },
            {
              "text": "Compact disk|||Đĩa quang (compact disk)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Printers</b> are output-only devices that communicate results to the outside world (paper) but store nothing internally; disks, tape and CDs are all storage media.</div><div class=\"ml-vi\"><b>Máy in</b> là thiết bị chỉ xuất, giao tiếp kết quả ra thế giới bên ngoài (giấy) nhưng không lưu trữ gì bên trong; đĩa từ, băng từ và đĩa quang đều là phương tiện lưu trữ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the relational database model, data is organized in ______called relations.|||Trong mô hình cơ sở dữ liệu quan hệ, dữ liệu được tổ chức thành ______ gọi là các quan hệ.",
          "options": [
            {
              "text": "Two-dimensional array|||Mảng hai chiều"
            },
            {
              "text": "Two-dimensional tables|||Bảng hai chiều"
            },
            {
              "text": "Two-dimensional record|||Bản ghi hai chiều"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the relational model, data is organized into <b>two-dimensional tables</b> (rows and columns), formally called relations.</div><div class=\"ml-vi\">Trong mô hình quan hệ, dữ liệu được tổ chức thành các <b>bảng hai chiều</b> (dòng và cột), gọi chính thức là các quan hệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Compression of digital data for efficient storage is|||Nén dữ liệu số để lưu trữ hiệu quả được gọi là",
          "options": [
            {
              "text": "Buffer|||Bộ đệm (buffer)"
            },
            {
              "text": "CPU|||CPU"
            },
            {
              "text": "Packing|||Đóng gói (packing)"
            },
            {
              "text": "Field|||Trường (field)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Packing</b> is the general term for compressing digital data so it takes less storage space.</div><div class=\"ml-vi\"><b>Packing (đóng gói)</b> là thuật ngữ chung chỉ việc nén dữ liệu số để chiếm ít không gian lưu trữ hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, writing the program is part of the ________ phase.|||Trong quy trình phát triển hệ thống, việc viết chương trình là một phần của giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Actually writing the code (coding) is the work of the <b>implementation</b> phase, after analysis and design are complete.</div><div class=\"ml-vi\">Việc thực sự viết mã (coding) là công việc của giai đoạn <b>cài đặt</b>, sau khi phân tích và thiết kế đã hoàn tất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "There are ______ basic constructs in computer -science.|||Có ______ cấu trúc cơ bản trong khoa học máy tính.",
          "options": [
            {
              "text": "One|||Một"
            },
            {
              "text": "Two|||Hai"
            },
            {
              "text": "Three|||Ba"
            },
            {
              "text": "Four|||Bốn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>three</b> basic control constructs of structured programming are sequence, selection (decision) and repetition (iteration).</div><div class=\"ml-vi\"><b>Ba</b> cấu trúc điều khiển cơ bản của lập trình có cấu trúc là tuần tự, rẽ nhánh (lựa chọn) và lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Instructions and memory addresses are represented by|||Các lệnh và địa chỉ bộ nhớ được biểu diễn bằng",
          "options": [
            {
              "text": "Character codes|||Mã ký tự"
            },
            {
              "text": "Binary codes|||Mã nhị phân"
            },
            {
              "text": "Binary word|||Từ nhị phân"
            },
            {
              "text": "Parity bit|||Bit chẵn lẻ"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">At the hardware level, every instruction and every memory address is ultimately represented as <b>binary codes</b> (sequences of 0s and 1s).</div><div class=\"ml-vi\">Ở mức phần cứng, mọi lệnh và mọi địa chỉ bộ nhớ cuối cùng đều được biểu diễn bằng <b>mã nhị phân</b> (chuỗi 0 và 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "__________ means that the data must arrive at the receiver exactly as they were sent.|||__________ nghĩa là dữ liệu phải đến nơi nhận đúng y hệt như lúc được gửi đi.",
          "options": [
            {
              "text": "Nonrepudiation|||Không thể chối bỏ (nonrepudiation)"
            },
            {
              "text": "Message integrity|||Toàn vẹn thông điệp (message integrity)"
            },
            {
              "text": "Authentication|||Xác thực (authentication)"
            },
            {
              "text": "Secrecy|||Bí mật (secrecy)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Message integrity</b> guarantees the content arrives unchanged — exactly as sent — detecting any tampering along the way.</div><div class=\"ml-vi\"><b>Toàn vẹn thông điệp</b> đảm bảo nội dung đến nơi không bị thay đổi — đúng y hệt lúc gửi — phát hiện được mọi can thiệp trên đường truyền.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a computer, the ________ subsystem accepts data and programs and sends processing results to output devices.|||Trong máy tính, hệ thống con ________ nhận dữ liệu và chương trình rồi gửi kết quả xử lý tới thiết bị xuất.",
          "options": [
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "Input/output|||Vào/ra (input/output)"
            },
            {
              "text": "Memory|||Bộ nhớ"
            },
            {
              "text": "Control unit|||Bộ điều khiển"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>input/output</b> subsystem is the interface that brings data/programs into the computer and carries processing results back out to output devices.</div><div class=\"ml-vi\">Hệ thống con <b>vào/ra (input/output)</b> là giao diện đưa dữ liệu/chương trình vào máy tính và mang kết quả xử lý ra thiết bị xuất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a positional number system with base b, we can always find the number of digits of an integer. So how many digits can we find in the decimal number 20 in octal system?|||Trong hệ đếm vị trí cơ số b, ta luôn tìm được số chữ số của một số nguyên. Vậy số 20 trong hệ thập phân có bao nhiêu chữ số khi biểu diễn ở hệ bát phân?",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">20 in decimal = 24 in octal (2&times;8 + 4 = 20), which has <b>2</b> digits.</div><div class=\"ml-vi\">20 trong hệ thập phân = 24 trong hệ bát phân (2&times;8 + 4 = 20), có <b>2</b> chữ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a block cipher a _____is used to encrypt the whole block even if the key is made of multiple values|||Trong mật mã khối, một _____ được dùng để mã hoá toàn bộ khối cho dù khoá gồm nhiều giá trị",
          "options": [
            {
              "text": "Key block|||Khối khoá (key block)"
            },
            {
              "text": "Single key|||Khoá đơn"
            },
            {
              "text": "Key stream|||Dòng khoá (key stream)"
            },
            {
              "text": "Auto key|||Khoá tự sinh (auto key)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Whether it is a single value or built from several sub-keys, the whole key applied to encrypt one block at once is treated as one <b>key block</b>.</div><div class=\"ml-vi\">Dù là một giá trị đơn hay gồm nhiều khoá con, toàn bộ khoá dùng để mã hoá một khối cùng lúc được xem như một <b>khối khoá (key block)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The main principles of ethics are ______|||Các học thuyết chính của đạo đức học là ______",
          "options": [
            {
              "text": "Moral rules, social contract, ultilization|||Quy tắc đạo đức, khế ước xã hội, chủ nghĩa vị lợi"
            },
            {
              "text": "Ethical decision, social justice, procedural justice|||Quyết định đạo đức, công bằng xã hội, công bằng thủ tục"
            },
            {
              "text": "Beneficence, procedural justice, fidelity|||Lòng nhân từ, công bằng thủ tục, lòng trung thành"
            },
            {
              "text": "Nonmaleficence, social justice, fidelity|||Không gây hại, công bằng xã hội, lòng trung thành"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The course frames <b>moral rules (deontology), social contract theory, and utilitarianism</b> as the three main ethical theories/principles taught; the other options mix in bioethics-specific principles (beneficence, nonmaleficence) that are not part of this core trio.</div><div class=\"ml-vi\">Môn học coi <b>quy tắc đạo đức (nghĩa vụ luận), thuyết khế ước xã hội và chủ nghĩa vị lợi</b> là ba học thuyết/nguyên tắc đạo đức chính; các đáp án khác pha trộn nguyên tắc đặc thù của đạo đức y sinh (lòng nhân từ, không gây hại) vốn không thuộc bộ ba cốt lõi này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following translate back from machine code something resembling the source language|||Công cụ nào sau đây dịch ngược từ mã máy trở về thứ gì đó giống với ngôn ngữ nguồn",
          "options": [
            {
              "text": "Interpreter|||Trình thông dịch (interpreter)"
            },
            {
              "text": "Compiler|||Trình biên dịch (compiler)"
            },
            {
              "text": "Assembler|||Trình hợp dịch (assembler)"
            },
            {
              "text": "Decompiler|||Trình dịch ngược (decompiler)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>decompiler</b> takes machine code and reconstructs something resembling the original higher-level source language — the reverse direction of a compiler.</div><div class=\"ml-vi\"><b>Trình dịch ngược (decompiler)</b> nhận mã máy và tái tạo lại thứ gì đó giống ngôn ngữ nguồn bậc cao ban đầu — ngược chiều với trình biên dịch.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What kind of state does a program load into memory and CPU execute?|||Chương trình được nạp vào bộ nhớ và được CPU thực thi ở trạng thái nào?",
          "options": [
            {
              "text": "Hold state|||Trạng thái giữ"
            },
            {
              "text": "Ready state|||Trạng thái sẵn sàng"
            },
            {
              "text": "Running state|||Trạng thái đang chạy"
            },
            {
              "text": "Waiting state|||Trạng thái chờ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Once loaded into memory and actively being executed by the CPU, a process is in the <b>running</b> state.</div><div class=\"ml-vi\">Khi đã được nạp vào bộ nhớ và đang được CPU thực thi, tiến trình ở trạng thái <b>đang chạy</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ASCII code for the character J is:|||Mã ASCII của ký tự J là:",
          "options": [
            {
              "text": "1001 0001|||1001 0001"
            },
            {
              "text": "1001 1010|||1001 1010"
            },
            {
              "text": "0100 1010|||0100 1010"
            },
            {
              "text": "1010 0001|||1010 0001"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">J is the 10th uppercase letter: ASCII('A')=65, so ASCII('J')=65+9=74 decimal = <b>0100 1010</b> binary.</div><div class=\"ml-vi\">J là chữ cái in hoa thứ 10: ASCII('A')=65, nên ASCII('J')=65+9=74 thập phân = <b>0100 1010</b> nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The intersection of a column and row in a spreadsheet is called a bon or|||Giao điểm của một cột và một hàng trong bảng tính được gọi là",
          "options": [
            {
              "text": "Key|||Khoá (key)"
            },
            {
              "text": "Field|||Trường (field)"
            },
            {
              "text": "Cell|||Ô (cell)"
            },
            {
              "text": "Menu|||Menu"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In a spreadsheet, the intersection of a column and a row is called a <b>cell</b>.</div><div class=\"ml-vi\">Trong bảng tính, giao điểm của một cột và một hàng được gọi là <b>ô (cell)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "All the instructions and procedures needed to start up a computer, to the point it can load an operating system, are stored in ROM chips. In IBM compatible PCs this is called the _____|||Mọi lệnh và thủ tục cần thiết để khởi động máy tính, tới khi nó nạp được hệ điều hành, được lưu trong chip ROM. Trong PC tương thích IBM, đây gọi là _____",
          "options": [
            {
              "text": "RAM BIOS|||RAM BIOS"
            },
            {
              "text": "ROM BIOS|||ROM BIOS"
            },
            {
              "text": "EPROM|||EPROM"
            },
            {
              "text": "POST|||POST"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">This boot firmware stored in ROM on IBM-compatible PCs is called the <b>ROM BIOS</b> (Basic Input/Output System).</div><div class=\"ml-vi\">Firmware khởi động lưu trong ROM trên PC tương thích IBM được gọi là <b>ROM BIOS</b> (Basic Input/Output System).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In postorder traversal of a binary tree, the root is processed ________.|||Trong duyệt cây nhị phân theo thứ tự sau (postorder), gốc được xử lý ________.",
          "options": [
            {
              "text": "First|||Đầu tiên"
            },
            {
              "text": "Second|||Thứ hai"
            },
            {
              "text": "Last|||Cuối cùng"
            },
            {
              "text": "After the left subtree|||Sau cây con trái"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Postorder</b> visits Left subtree, then Right subtree, then Root — the root is always processed <b>last</b>.</div><div class=\"ml-vi\"><b>Postorder</b> duyệt cây con Trái, rồi cây con Phải, rồi Gốc — gốc luôn được xử lý <b>cuối cùng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An image can be represented in a computer using the ________ method.|||Một hình ảnh có thể được biểu diễn trong máy tính bằng phương pháp ________.",
          "options": [
            {
              "text": "Bitmap graphic only|||Chỉ ảnh bitmap"
            },
            {
              "text": "Vector graphic only|||Chỉ ảnh vector"
            },
            {
              "text": "Excess system only|||Chỉ hệ excess"
            },
            {
              "text": "Either bitmap or vector graphic|||Ảnh bitmap hoặc vector đều được"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Images can be represented <b>either as bitmap (raster) graphics or as vector graphics</b> — both are valid representation methods, each with different trade-offs.</div><div class=\"ml-vi\">Ảnh có thể được biểu diễn <b>bằng bitmap (raster) hoặc bằng vector</b> — cả hai đều là phương pháp hợp lệ, mỗi cách có đánh đổi riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a ____ the project team needs to choose a language or a set of languages from among the procedural languages|||Trong ____ nhóm dự án cần chọn một ngôn ngữ hoặc một tập ngôn ngữ trong số các ngôn ngữ thủ tục",
          "options": [
            {
              "text": "Analysis phase|||Giai đoạn phân tích"
            },
            {
              "text": "Design phase|||Giai đoạn thiết kế"
            },
            {
              "text": "Implementation phase|||Giai đoạn cài đặt"
            },
            {
              "text": "Testing phase|||Giai đoạn kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Choosing the implementation language/technology is a technical decision made during the <b>design phase</b>, before actual coding begins.</div><div class=\"ml-vi\">Việc chọn ngôn ngữ/công nghệ cài đặt là quyết định kỹ thuật được đưa ra trong <b>giai đoạn thiết kế</b>, trước khi bắt đầu viết mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A technique used by codes to convert an analog signal into a digital bit stream is known as|||Kỹ thuật dùng để chuyển tín hiệu tương tự thành dòng bit số được gọi là",
          "options": [
            {
              "text": "Pulse code modulation|||Điều chế xung mã (pulse code modulation)"
            },
            {
              "text": "Pulse stretcher|||Bộ kéo dài xung"
            },
            {
              "text": "Query processing|||Xử lý truy vấn"
            },
            {
              "text": "Queue management|||Quản lý hàng đợi"
            },
            {
              "text": "None of the above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Pulse Code Modulation (PCM)</b> is the standard technique (sample &rarr; quantize &rarr; encode) for converting an analog signal into a digital bit stream.</div><div class=\"ml-vi\"><b>Điều chế xung mã (PCM)</b> là kỹ thuật chuẩn (lấy mẫu &rarr; lượng tử hoá &rarr; mã hoá) để chuyển tín hiệu tương tự thành dòng bit số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The TCP/IP model has _______ layers.|||Mô hình TCP/IP có _______ tầng.",
          "options": [
            {
              "text": "Five|||Năm"
            },
            {
              "text": "Six|||Sáu"
            },
            {
              "text": "Seven|||Bảy"
            },
            {
              "text": "Eight|||Tám"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">As taught in this course (Forouzan's networking framework), the TCP/IP suite has <b>five</b> layers: Physical, Data link, Network, Transport, Application.</div><div class=\"ml-vi\">Theo giáo trình môn học (khung mạng của Forouzan), bộ giao thức TCP/IP có <b>năm</b> tầng: Vật lý, Liên kết dữ liệu, Mạng, Vận chuyển, Ứng dụng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the modulo division hashing assume we have key = 614, file size = 307. The result of address is ___|||Trong băm chia lấy dư, giả sử khoá = 614, kích thước tệp = 307. Kết quả địa chỉ là ___",
          "options": [
            {
              "text": "001|||001"
            },
            {
              "text": "002|||002"
            },
            {
              "text": "003|||003"
            },
            {
              "text": "004|||004"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">614 mod 307 = 0 (614 = 2 &times; 307). Adding 1 (so the list starts at 1 instead of 0) gives address <b>001</b>.</div><div class=\"ml-vi\">614 mod 307 = 0 (614 = 2 &times; 307). Cộng thêm 1 (để danh sách bắt đầu từ 1 thay vì 0) cho ra địa chỉ <b>001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Inside the ADT are two different parts of the model that are ___ and __|||Bên trong ADT có hai phần khác nhau của mô hình là ___ và __",
          "options": [
            {
              "text": "Data structure and operations|||Cấu trúc dữ liệu và các thao tác"
            },
            {
              "text": "Application program and public operations|||Chương trình ứng dụng và thao tác công khai"
            },
            {
              "text": "Application program and private operations|||Chương trình ứng dụng và thao tác riêng tư"
            },
            {
              "text": "Data struture and application program|||Cấu trúc dữ liệu và chương trình ứng dụng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An Abstract Data Type (ADT) consists of a <b>data structure</b> plus the <b>operations</b> that can be performed on it, with the internal representation hidden from the user.</div><div class=\"ml-vi\">Kiểu dữ liệu trừu tượng (ADT) gồm một <b>cấu trúc dữ liệu</b> cộng với các <b>thao tác</b> có thể thực hiện trên nó, ẩn đi cách biểu diễn nội bộ khỏi người dùng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Pascal is a(n) _______ language.|||Pascal là ngôn ngữ _______.",
          "options": [
            {
              "text": "Procedural|||Thủ tục"
            },
            {
              "text": "Functional|||Hàm"
            },
            {
              "text": "Declarative|||Khai báo"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Pascal</b> is a classic <b>procedural</b> language, built around procedures and step-by-step instructions.</div><div class=\"ml-vi\"><b>Pascal</b> là ngôn ngữ <b>thủ tục</b> kinh điển, xây dựng quanh các thủ tục và chỉ dẫn từng bước.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, structure charts are tools used in the ________ phase.|||Trong quy trình phát triển hệ thống, sơ đồ cấu trúc là công cụ dùng trong giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Structure charts</b> show module hierarchy and data flow — a <b>design</b>-phase tool used before coding.</div><div class=\"ml-vi\"><b>Sơ đồ cấu trúc</b> thể hiện phân cấp mô-đun và luồng dữ liệu — công cụ của giai đoạn <b>thiết kế</b>, dùng trước khi viết mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One phase in system development is ________.|||Một giai đoạn trong phát triển hệ thống là ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Application|||Ứng dụng"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "Collecting|||Thu thập"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The standard SDLC phases include <b>Analysis</b>, Design, Implementation and Testing; the other options are not standard phase names.</div><div class=\"ml-vi\">Các giai đoạn SDLC chuẩn gồm <b>Phân tích</b>, Thiết kế, Cài đặt và Kiểm thử; các đáp án còn lại không phải tên giai đoạn chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which sorting algorithm has the best average-case time complexity among Bubble sort, Selection sort and Insertion sort — all three are actually the same order?|||Trong ba thuật toán Bubble sort, Selection sort và Insertion sort, độ phức tạp thời gian trung bình của cả ba thực ra cùng bậc nào?",
          "options": [
            {
              "text": "O(n)|||O(n)"
            },
            {
              "text": "O(n log n)|||O(n log n)"
            },
            {
              "text": "O(n^2)|||O(n^2)"
            },
            {
              "text": "O(log n)|||O(log n)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Bubble sort, selection sort and insertion sort are all simple comparison sorts with average and worst-case time complexity <b>O(n^2)</b> — none of them scales as well as O(n log n) algorithms like merge sort or quicksort.</div><div class=\"ml-vi\">Bubble sort, selection sort và insertion sort đều là các thuật toán sắp xếp so sánh đơn giản với độ phức tạp trung bình và xấu nhất là <b>O(n^2)</b> — không thuật toán nào trong ba thuật toán này mở rộng tốt bằng các thuật toán O(n log n) như merge sort hay quicksort.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A _____WAN is a network that connects two communicating devices through a transmission medium (cable or air)|||Một WAN _____ là mạng kết nối hai thiết bị truyền thông qua một môi trường truyền (cáp hoặc không khí)",
          "options": [
            {
              "text": "Peer-to-peer|||Ngang hàng (peer-to-peer)"
            },
            {
              "text": "Node -to-node|||Nút-tới-nút"
            },
            {
              "text": "Point-to-point|||Điểm-tới-điểm (point-to-point)"
            },
            {
              "text": "Data link|||Liên kết dữ liệu"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>point-to-point</b> WAN directly connects exactly two devices through a transmission medium, with no intermediate switching.</div><div class=\"ml-vi\">WAN <b>điểm-tới-điểm</b> kết nối trực tiếp đúng hai thiết bị qua một môi trường truyền, không qua chuyển mạch trung gian.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the transaction file key is 20 and the first master file key is 25, then we ________.|||Nếu khoá tệp giao dịch là 20 và khoá đầu tiên của tệp chủ là 25, thì ta ________.",
          "options": [
            {
              "text": "Add the new record to the new master file|||Thêm bản ghi mới vào tệp chủ mới"
            },
            {
              "text": "Revise the contents of the old master file|||Sửa nội dung tệp chủ cũ"
            },
            {
              "text": "Delete the data|||Xoá dữ liệu"
            },
            {
              "text": "Write the old master file record to the new master file|||Ghi bản ghi tệp chủ cũ vào tệp chủ mới"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Since the transaction key (20) is <b>less than</b> the current master key (25), the old master file has no matching record yet at this point in the sorted sequence, so the transaction represents a new record to be <b>added</b> to the new master file.</div><div class=\"ml-vi\">Vì khoá giao dịch (20) <b>nhỏ hơn</b> khoá tệp chủ hiện tại (25), tệp chủ cũ chưa có bản ghi khớp tại vị trí này trong dãy đã sắp xếp, nên giao dịch này là một bản ghi mới cần được <b>thêm</b> vào tệp chủ mới.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The base of the hexadecimal number system is ____.|||Cơ số của hệ đếm thập lục phân là ____.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>hexadecimal</b> number system has base <b>16</b> (digits 0-9, A-F).</div><div class=\"ml-vi\">Hệ đếm <b>thập lục phân</b> có cơ số <b>16</b> (chữ số 0-9, A-F).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The first computing machine to use the idea of storage and programming was called ________.|||Máy tính đầu tiên sử dụng ý tưởng lưu trữ và lập trình được gọi là ________.",
          "options": [
            {
              "text": "The Madeline|||The Madeline"
            },
            {
              "text": "EDVAC|||EDVAC"
            },
            {
              "text": "The Babbage machine|||Máy Babbage"
            },
            {
              "text": "The Jacquard loom|||Máy dệt Jacquard"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>EDVAC</b> was designed following von Neumann's stored-program concept, making it the first computing machine built around storing both program and data together.</div><div class=\"ml-vi\"><b>EDVAC</b> được thiết kế theo khái niệm chương trình lưu trữ của von Neumann, là máy tính đầu tiên xây dựng quanh việc lưu trữ cả chương trình lẫn dữ liệu cùng nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The search algorithm for a linked list can be _____|||Thuật toán tìm kiếm cho danh sách liên kết có thể là _____",
          "options": [
            {
              "text": "Both of sequential and binary search|||Cả tìm kiếm tuần tự và nhị phân"
            },
            {
              "text": "Sequential search|||Tìm kiếm tuần tự"
            },
            {
              "text": "Neither sequential nor binary search|||Không phải tuần tự cũng không phải nhị phân"
            },
            {
              "text": "Binary search|||Tìm kiếm nhị phân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A linked list only supports <b>sequential search</b> — binary search needs random (indexed) access to jump to the middle element, which a linked list cannot do efficiently.</div><div class=\"ml-vi\">Danh sách liên kết chỉ hỗ trợ <b>tìm kiếm tuần tự</b> — tìm kiếm nhị phân cần truy cập ngẫu nhiên (theo chỉ số) để nhảy tới phần tử giữa, điều mà danh sách liên kết không làm hiệu quả được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An IPv4 address is a ______address that uniquely and universally defines the connection of a host or a router to the Internet|||Địa chỉ IPv4 là một địa chỉ ______ định danh duy nhất và toàn cầu cho kết nối của một máy chủ hoặc bộ định tuyến tới Internet",
          "options": [
            {
              "text": "32-bit|||32-bit"
            },
            {
              "text": "64-bit|||64-bit"
            },
            {
              "text": "128-bit|||128-bit"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>IPv4</b> address is <b>32 bits</b> long; IPv6 (128-bit) was created to address IPv4's exhaustion.</div><div class=\"ml-vi\">Địa chỉ <b>IPv4</b> dài <b>32-bit</b>; IPv6 (128-bit) được tạo ra để giải quyết việc cạn kiệt địa chỉ IPv4.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Testing a software system can involve ________ testing.|||Kiểm thử một hệ thống phần mềm có thể bao gồm kiểm thử ________.",
          "options": [
            {
              "text": "Black-box|||Hộp đen (black-box)"
            },
            {
              "text": "Glass-box|||Hộp kính (glass-box)"
            },
            {
              "text": "Neither black-box nor glass-box|||Không phải cả hai"
            },
            {
              "text": "Both black-box and glass-box|||Cả hộp đen lẫn hộp kính"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Software testing uses <b>both</b> approaches: black-box testing checks behaviour against specs without looking at code, while glass-box (white-box) testing examines internal logic.</div><div class=\"ml-vi\">Kiểm thử phần mềm dùng <b>cả hai</b> cách: kiểm thử hộp đen kiểm tra hành vi theo đặc tả mà không nhìn vào mã, còn kiểm thử hộp kính (hộp trắng) xem xét logic nội bộ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is equivalent to 12 in decimal?|||Giá trị nào sau đây tương đương với 12 trong hệ thập phân?",
          "options": [
            {
              "text": "(1110)2|||(1110)2"
            },
            {
              "text": "(C)16|||(C)16"
            },
            {
              "text": "(15)8|||(15)8"
            },
            {
              "text": "None of the above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Hex digit C = 12 in decimal, so (C)16 = 12. (1110)2 = 14 and (15)8 = 13, so neither matches.</div><div class=\"ml-vi\">Chữ số hex C = 12 trong hệ thập phân, nên (C)16 = 12. (1110)2 = 14 và (15)8 = 13, không khớp giá trị 12.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular left shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch trái vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0001 1001|||0001 1001"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A circular left shift moves every bit one position left and wraps the old MSB around to the new LSB: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div><div class=\"ml-vi\">Dịch trái vòng đẩy mọi bit sang trái một vị trí và đưa bit cao nhất cũ vòng xuống thành bit thấp nhất mới: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "___ is an ordered set of unambiguous steps that produces a result and terminates in a finite time.|||___ là một tập hợp có thứ tự các bước rõ ràng, tạo ra kết quả và kết thúc trong thời gian hữu hạn.",
          "options": [
            {
              "text": "A construct|||Một cấu trúc (construct)"
            },
            {
              "text": "A recursion|||Đệ quy"
            },
            {
              "text": "An iteration|||Lặp (iteration)"
            },
            {
              "text": "An algorithm|||Thuật toán (algorithm)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is the standard definition of an <b>algorithm</b>: an ordered, unambiguous, finite sequence of steps producing a result.</div><div class=\"ml-vi\">Đây là định nghĩa chuẩn của <b>thuật toán</b>: một chuỗi bước có thứ tự, rõ ràng, hữu hạn, tạo ra kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ________ is a collection of related elements possibly of different types having a single name|||Một ________ là tập hợp các phần tử liên quan, có thể khác kiểu, mang một tên duy nhất",
          "options": [
            {
              "text": "Array|||Mảng (array)"
            },
            {
              "text": "Record|||Bản ghi (record)"
            },
            {
              "text": "Linked list|||Danh sách liên kết"
            },
            {
              "text": "Tree|||Cây (tree)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>record</b> groups related fields, possibly of different data types, under a single name (e.g. a Student record with name:string, age:int).</div><div class=\"ml-vi\"><b>Bản ghi (record)</b> nhóm các trường liên quan, có thể khác kiểu dữ liệu, dưới một tên duy nhất (VD bản ghi Student gồm name:string, age:int).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An array that consists of just rows and columns is a ________ array.|||Một mảng chỉ gồm hàng và cột là mảng ________.",
          "options": [
            {
              "text": "One-dimensional|||Một chiều"
            },
            {
              "text": "Two-dimensional|||Hai chiều"
            },
            {
              "text": "Three-dimensional|||Ba chiều"
            },
            {
              "text": "Multidimensional|||Đa chiều"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An array organized as rows and columns (a grid/matrix) is a <b>two-dimensional</b> array.</div><div class=\"ml-vi\">Một mảng tổ chức theo hàng và cột (dạng lưới/ma trận) là mảng <b>hai chiều</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To define the processes in transport layer, we need two identifiers, called IP and ________|||Để định danh các tiến trình ở tầng vận chuyển, ta cần hai định danh, gọi là địa chỉ IP và ________",
          "options": [
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "Port numbers|||Số hiệu cổng (port numbers)"
            },
            {
              "text": "IP datagram|||Gói tin IP (IP datagram)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The IP address identifies the <b>host</b>; the <b>port number</b> identifies the specific process on that host.</div><div class=\"ml-vi\">Địa chỉ IP định danh <b>máy chủ</b>; <b>số hiệu cổng</b> định danh tiến trình cụ thể trên máy đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which language was devised by Dr. Seymour Aubrey Papert?|||Ngôn ngữ nào được sáng lập bởi Tiến sĩ Seymour Aubrey Papert?",
          "options": [
            {
              "text": "APL|||APL"
            },
            {
              "text": "COBOL|||COBOL"
            },
            {
              "text": "LOGO|||LOGO"
            },
            {
              "text": "FORTRAN|||FORTRAN"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>LOGO</b> (famous for turtle graphics) was devised by Dr. Seymour Papert, designed to teach programming concepts to children.</div><div class=\"ml-vi\"><b>LOGO</b> (nổi tiếng với đồ hoạ rùa) được sáng lập bởi Tiến sĩ Seymour Papert, thiết kế để dạy khái niệm lập trình cho trẻ em.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A____ is a predetermined value used in a program and it may change value with time.|||A____ là một giá trị định trước dùng trong chương trình và nó có thể thay đổi giá trị theo thời gian.",
          "options": [
            {
              "text": "Constants|||Hằng số (constants)"
            },
            {
              "text": "Literals|||Giá trị chữ (literals)"
            },
            {
              "text": "Input/output|||Vào/ra (input/output)"
            },
            {
              "text": "Variables|||Biến (variables)"
            }
          ],
          "correctIndexes": [
            0,
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>constant</b> holds a predetermined value that never changes, while a <b>variable</b> is initialized with a value and may change over time — together the two terms this compound description covers.</div><div class=\"ml-vi\"><b>Hằng số</b> giữ một giá trị định trước không bao giờ đổi, còn <b>biến</b> được khởi tạo với một giá trị và có thể thay đổi theo thời gian — hai khái niệm này khớp với mô tả ghép trong câu hỏi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "______is the amateur. Usually their techniques are deployed out of ill motives such as revenge attacks|||______ là dạng nghiệp dư. Kỹ thuật của họ thường được triển khai vì động cơ xấu như trả thù",
          "options": [
            {
              "text": "Black Hat Hacker|||Hacker mũ đen"
            },
            {
              "text": "Grey Hat Hacker|||Hacker mũ xám"
            },
            {
              "text": "Red Hat Hacker|||Hacker mũ đỏ"
            },
            {
              "text": "Blue Hat Hacker|||Hacker mũ lam (Blue Hat)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Blue Hat</b> hackers (in the colloquial sense, distinct from Microsoft's BlueHat conference usage) are amateur outsiders who use hacking to seek revenge on those who angered them, rather than for profit or ideology.</div><div class=\"ml-vi\"><b>Hacker mũ lam (Blue Hat)</b> (theo nghĩa thông tục, khác với hội nghị BlueHat của Microsoft) là những kẻ nghiệp dư bên ngoài dùng hack để trả thù người đã khiến họ tức giận, không vì lợi nhuận hay lý tưởng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ________ is an arrangement where multiple physical disk drives appear as a single, large, reliable disk drive to the user.|||Một ________ là cách sắp xếp nhiều ổ đĩa vật lý để trình hiện cho người dùng như một ổ đĩa logic lớn, tin cậy duy nhất.",
          "options": [
            {
              "text": "Disk pack|||Bộ đĩa (disk pack)"
            },
            {
              "text": "Disk array|||Mảng đĩa (disk array)"
            },
            {
              "text": "Spanned drive|||Ổ đĩa gộp (spanned drive)"
            },
            {
              "text": "Bunch of disks|||Nhóm đĩa (bunch of disks)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>disk array</b> is an arrangement of several physical disks presented to the user as a single, large, reliable logical disk — the foundation of RAID.</div><div class=\"ml-vi\"><b>Mảng đĩa (disk array)</b> là cách sắp xếp nhiều đĩa vật lý để trình hiện cho người dùng như một đĩa logic lớn, tin cậy duy nhất — nền tảng của RAID.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Off-line operation is the operation of devices without the control of______|||Hoạt động off-line là hoạt động của thiết bị mà không có sự điều khiển của______",
          "options": [
            {
              "text": "Memory|||Bộ nhớ"
            },
            {
              "text": "CPU|||CPU"
            },
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "Control unit|||Bộ điều khiển"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Off-line</b> operation means a peripheral device works independently, without being directly controlled by the <b>CPU</b> at that moment (e.g. print spooling).</div><div class=\"ml-vi\">Hoạt động <b>off-line</b> nghĩa là thiết bị ngoại vi hoạt động độc lập, không chịu sự điều khiển trực tiếp của <b>CPU</b> tại thời điểm đó (VD spool in ấn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular right shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch phải vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0100 1100|||0100 1100"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A circular right shift moves every bit one position right and wraps the old LSB around to the new MSB: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div><div class=\"ml-vi\">Dịch phải vòng đẩy mọi bit sang phải một vị trí và đưa bit thấp nhất cũ vòng lên thành bit cao nhất mới: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In____ paradigm, there is no need for a server process to be running all the time and waiting for the client processes to connect.|||Trong mô hình ____, không cần một tiến trình server phải chạy liên tục chờ các tiến trình client kết nối.",
          "options": [
            {
              "text": "P2P|||P2P (ngang hàng)"
            },
            {
              "text": "Tranditional|||Truyền thống"
            },
            {
              "text": "Client-server|||Client-server"
            },
            {
              "text": "Model|||Mô hình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In a <b>P2P (peer-to-peer)</b> network, every node can act as both client and server, so there's no need for a dedicated always-on server process, unlike the traditional client-server model.</div><div class=\"ml-vi\">Trong mạng <b>P2P (ngang hàng)</b>, mỗi nút vừa có thể là client vừa là server, nên không cần một tiến trình server chuyên biệt phải chạy liên tục, khác với mô hình client-server truyền thống.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the attacks that threaten integrity, ____ occurs when an attacker intercepts a message and alters its content for their own benefit.|||Trong các tấn công đe doạ tính toàn vẹn, ____ xảy ra khi kẻ tấn công chặn thông điệp và sửa đổi nội dung để trục lợi.",
          "options": [
            {
              "text": "Snooping|||Nghe lén (snooping)"
            },
            {
              "text": "Modification|||Sửa đổi (modification)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Traffic analysis|||Phân tích lưu lượng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Modification</b> is exactly this: the attacker intercepts a message in transit and changes its content to their own advantage before forwarding it — a direct attack on integrity.</div><div class=\"ml-vi\"><b>Sửa đổi (modification)</b> đúng là như vậy: kẻ tấn công chặn thông điệp đang truyền và thay đổi nội dung có lợi cho mình trước khi chuyển tiếp — một tấn công trực tiếp vào tính toàn vẹn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the attacks threatent integrity with ______ attack the attacker modifies the information to make it beneficial to them|||Trong các tấn công đe doạ tính toàn vẹn, kiểu tấn công ______ khiến kẻ tấn công sửa đổi thông tin để trục lợi",
          "options": [
            {
              "text": "Snooping|||Nghe lén (snooping)"
            },
            {
              "text": "Repudiation|||Chối bỏ (repudiation)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Traffic analysis|||Phân tích lưu lượng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Among the four choices given, only <b>repudiation</b> belongs to the integrity-attack family (the other three are confidentiality/availability attacks); the exact behaviour described (modifying content for gain) is textbook \"modification\", but repudiation is the closest/only integrity-category option offered here.</div><div class=\"ml-vi\">Trong bốn lựa chọn, chỉ <b>repudiation (chối bỏ)</b> thuộc nhóm tấn công toàn vẹn (ba đáp án còn lại là tấn công bí mật/sẵn sàng); hành vi được mô tả chính xác (sửa đổi nội dung để trục lợi) đúng ra là \"modification\" theo giáo trình, nhưng repudiation là lựa chọn duy nhất/gần nhất thuộc nhóm toàn vẹn được đưa ra ở đây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many inputs and outputs does a full adder circuit have?|||Mạch cộng đầy đủ (full adder) có bao nhiêu đầu vào và bao nhiêu đầu ra?",
          "options": [
            {
              "text": "2 inputs and 1 output|||2 đầu vào và 1 đầu ra"
            },
            {
              "text": "3 inputs and 2 outputs|||3 đầu vào và 2 đầu ra"
            },
            {
              "text": "2 inputs and 2 outputs|||2 đầu vào và 2 đầu ra"
            },
            {
              "text": "3 inputs and 1 output|||3 đầu vào và 1 đầu ra"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A full adder takes two data bits plus a carry-in (<b>3 inputs</b>) and produces a sum bit and a carry-out (<b>2 outputs</b>); a half adder is the simpler 2-input, 2-output version with no carry-in.</div><div class=\"ml-vi\">Mạch cộng đầy đủ nhận hai bit dữ liệu cộng với số nhớ vào (<b>3 đầu vào</b>) và cho ra bit tổng cùng số nhớ ra (<b>2 đầu ra</b>); mạch cộng bán phần là phiên bản đơn giản hơn 2 vào 2 ra, không có số nhớ vào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The operation that takes two relations and combines them based on common attributes is the __________ operation.|||Thao tác lấy hai quan hệ và kết hợp chúng dựa trên thuộc tính chung là thao tác __________.",
          "options": [
            {
              "text": "Join|||Kết nối (join)"
            },
            {
              "text": "Project|||Chiếu (project)"
            },
            {
              "text": "Union|||Hợp (union)"
            },
            {
              "text": "Intersection|||Giao (intersection)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>join</b> operation combines rows from two relations based on a related (common) attribute — the foundation of relational queries across tables.</div><div class=\"ml-vi\">Thao tác <b>kết nối (join)</b> gộp các dòng từ hai quan hệ dựa trên thuộc tính liên quan (chung) — nền tảng của truy vấn quan hệ giữa các bảng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ is a process in which an algorithm calls itself.|||________ là quá trình trong đó một thuật toán tự gọi lại chính nó.",
          "options": [
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Searching|||Tìm kiếm (searching)"
            },
            {
              "text": "Recursion|||Đệ quy (recursion)"
            },
            {
              "text": "Iteration|||Lặp (iteration)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Recursion</b> is when an algorithm/function calls itself to solve smaller instances of the same problem.</div><div class=\"ml-vi\"><b>Đệ quy</b> là khi một thuật toán/hàm tự gọi lại chính nó để giải các bài toán con nhỏ hơn cùng loại.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D5",
      "source": "REAL",
      "sortOrder": 4,
      "title": "Đề 5 — FA2023 Final Exam|||Đề 5 — Thi cuối kỳ FA2023",
      "description": "CSI104 real FE multiple-choice paper (Fall 2023), transcribed from the exam images; answers reasoned here (pre-filled checkboxes in the source were inconsistent/unreliable and were disregarded). (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Thu 2023), chép từ ảnh đề; đáp án được suy luận tại đây (một số ô chọn có sẵn trong ảnh gốc không nhất quán/không đáng tin nên đã bỏ qua). (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ is a protocol for e mail services.|||_______ là giao thức cho dịch vụ e-mail.",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "TELNET|||TELNET"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>SMTP</b> (Simple Mail Transfer Protocol) is the standard protocol used to send e-mail between servers.</div><div class=\"ml-vi\"><b>SMTP</b> (Simple Mail Transfer Protocol) là giao thức chuẩn dùng để gửi email giữa các máy chủ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ compare data to see if a value is greater than, less than or equal to another value|||_____ so sánh dữ liệu để xem một giá trị có lớn hơn, nhỏ hơn hay bằng một giá trị khác",
          "options": [
            {
              "text": "Expression|||Biểu thức (expression)"
            },
            {
              "text": "Operator|||Toán tử (operator)"
            },
            {
              "text": "Variables|||Biến (variables)"
            },
            {
              "text": "Input/output|||Vào/ra (input/output)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Comparison <b>operators</b> (&gt;, &lt;, =) compare two values to determine their relative order or equality.</div><div class=\"ml-vi\"><b>Toán tử</b> so sánh (&gt;, &lt;, =) so sánh hai giá trị để xác định thứ tự tương đối hoặc sự bằng nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The _______ construct uses a set of actions one after another.|||Cấu trúc _______ sử dụng một tập hành động thực hiện lần lượt cái này sau cái kia.",
          "options": [
            {
              "text": "Sequence|||Tuần tự (sequence)"
            },
            {
              "text": "Decision|||Rẽ nhánh (decision)"
            },
            {
              "text": "Repetition|||Lặp (repetition)"
            },
            {
              "text": "Flow|||Luồng (flow)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Sequence</b> is the basic control structure where actions execute one after another in order.</div><div class=\"ml-vi\"><b>Tuần tự</b> là cấu trúc điều khiển cơ bản, các hành động thực hiện lần lượt theo thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the method in black-box testing that a subset of values in the input domain is selected for testing?|||Phương pháp nào trong kiểm thử hộp đen chọn một tập con giá trị trong miền đầu vào để kiểm thử?",
          "options": [
            {
              "text": "Boundary-value testing|||Kiểm thử giá trị biên"
            },
            {
              "text": "Random testing|||Kiểm thử ngẫu nhiên"
            },
            {
              "text": "Exhaustive testing|||Kiểm thử toàn bộ (exhaustive)"
            },
            {
              "text": "Data flow testing|||Kiểm thử luồng dữ liệu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Boundary-value testing</b> selects a representative subset — the edge/boundary values of the input domain — instead of testing every possible value (which would be exhaustive testing).</div><div class=\"ml-vi\"><b>Kiểm thử giá trị biên</b> chọn một tập con đại diện — các giá trị biên/cạnh của miền đầu vào — thay vì kiểm thử mọi giá trị có thể (đó sẽ là kiểm thử toàn bộ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ explicitly defines connection establishment, data transfer, connection teardown phases to provide a connection-oriented service AND reliable protocol|||_____ định nghĩa rõ ràng các giai đoạn thiết lập kết nối, truyền dữ liệu, huỷ kết nối để cung cấp dịch vụ hướng kết nối VÀ giao thức tin cậy",
          "options": [
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "IP|||IP"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>TCP</b> is connection-oriented and reliable: it explicitly defines connection establishment, data transfer and teardown phases (unlike UDP, which is connectionless and unreliable).</div><div class=\"ml-vi\"><b>TCP</b> hướng kết nối và tin cậy: định nghĩa rõ các giai đoạn thiết lập kết nối, truyền dữ liệu và huỷ kết nối (khác với UDP là phi kết nối và không tin cậy).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ ciphers are sometimes called public-key ciphers|||Mật mã _____ đôi khi còn được gọi là mật mã khoá công khai",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Asymmetric-key</b> ciphers use a public/private key pair, so they are also called public-key ciphers.</div><div class=\"ml-vi\">Mật mã <b>khoá bất đối xứng</b> dùng một cặp khoá công khai/riêng tư, nên còn được gọi là mật mã khoá công khai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The octal equivalent of 1100101.001010 is _______|||Số bát phân tương đương của 1100101.001010 là _______",
          "options": [
            {
              "text": "624.12|||624.12"
            },
            {
              "text": "145.12|||145.12"
            },
            {
              "text": "154.12|||154.12"
            },
            {
              "text": "145.21|||145.21"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Group into 3 bits from the binary point: integer 1100101 &rarr; 001,100,101 = 1,4,5 = \"145\"; fraction 001010 &rarr; 001,010 = 1,2 = \"12\". Result: <b>145.12</b>.</div><div class=\"ml-vi\">Nhóm 3 bit tính từ dấu chấm nhị phân: phần nguyên 1100101 &rarr; 001,100,101 = 1,4,5 = \"145\"; phần thập phân 001010 &rarr; 001,010 = 1,2 = \"12\". Kết quả: <b>145.12</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is required to allow any relation in the database to be represented, to allow a query language|||_____ cần thiết để cho phép biểu diễn mọi quan hệ trong cơ sở dữ liệu, cho phép ngôn ngữ truy vấn",
          "options": [
            {
              "text": "Relational database|||Cơ sở dữ liệu quan hệ"
            },
            {
              "text": "Database system|||Hệ cơ sở dữ liệu"
            },
            {
              "text": "Atomic operations|||Thao tác nguyên tử"
            },
            {
              "text": "Normalization|||Chuẩn hoá (normalization)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Normalization</b> ensures any relation can be properly represented and allows query languages like SQL to compose powerful retrieval operations from atomic ones.</div><div class=\"ml-vi\"><b>Chuẩn hoá</b> đảm bảo mọi quan hệ đều có thể được biểu diễn đúng đắn và cho phép ngôn ngữ truy vấn như SQL kết hợp các thao tác truy xuất mạnh từ các thao tác nguyên tử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, writing the program is part of the ________ phase.|||Trong quy trình phát triển hệ thống, việc viết chương trình là một phần của giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Actually writing the code is the work of the <b>implementation</b> phase, after analysis and design are complete.</div><div class=\"ml-vi\">Việc thực sự viết mã là công việc của giai đoạn <b>cài đặt</b>, sau khi phân tích và thiết kế đã hoàn tất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "All the instructions and procedures needed to start up a computer, to the point it can load an operating system, are stored in ROM chips. In IBM compatible PCs this is called the _____|||Mọi lệnh và thủ tục cần thiết để khởi động máy tính, tới khi nó nạp được hệ điều hành, được lưu trong chip ROM. Trong PC tương thích IBM, đây gọi là _____",
          "options": [
            {
              "text": "RAM BIOS|||RAM BIOS"
            },
            {
              "text": "ROM BIOS|||ROM BIOS"
            },
            {
              "text": "EPROM|||EPROM"
            },
            {
              "text": "POST|||POST"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">This boot firmware stored in ROM on IBM-compatible PCs is called the <b>ROM BIOS</b>.</div><div class=\"ml-vi\">Firmware khởi động lưu trong ROM trên PC tương thích IBM được gọi là <b>ROM BIOS</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is a unit representing the no bits of discrete.|||Đơn vị nào biểu diễn một giá trị rời rạc (0 hoặc 1)?",
          "options": [
            {
              "text": "Baud|||Baud"
            },
            {
              "text": "Byte|||Byte"
            },
            {
              "text": "Bit|||Bit"
            },
            {
              "text": "All of the others|||Tất cả đáp án khác"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>bit</b> (binary digit) is the fundamental unit of a single discrete (0 or 1) value.</div><div class=\"ml-vi\"><b>Bit</b> (chữ số nhị phân) là đơn vị cơ bản nhất biểu diễn một giá trị rời rạc (0 hoặc 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The physic-layer addresses, sometimes called_____, are locally defined addresses, each of which defines a specific host or router in a network (LAN or WAN).|||Địa chỉ tầng vật lý, đôi khi gọi là _____, là địa chỉ được định nghĩa cục bộ, mỗi địa chỉ xác định một máy chủ hoặc bộ định tuyến cụ thể trong mạng (LAN hoặc WAN).",
          "options": [
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "Port numbers|||Số hiệu cổng (port numbers)"
            },
            {
              "text": "MAC addresses|||Địa chỉ MAC"
            },
            {
              "text": "IP address|||Địa chỉ IP"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Physical/link-layer addresses are also called <b>MAC addresses</b> — locally defined, burned into the network interface hardware.</div><div class=\"ml-vi\">Địa chỉ tầng vật lý/liên kết còn được gọi là <b>địa chỉ MAC</b> — được định nghĩa cục bộ, gắn cố định vào phần cứng giao diện mạng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is a computer program that does perform a legitimate task but which also contains code to carry out malicious attacks such as deleting or corrupting files|||_____ là chương trình máy tính thực hiện một nhiệm vụ hợp pháp nhưng cũng chứa mã để thực hiện các tấn công độc hại như xoá hoặc phá hoại tệp",
          "options": [
            {
              "text": "DoS|||DoS"
            },
            {
              "text": "Trojan horses|||Ngựa thành Troy (Trojan horses)"
            },
            {
              "text": "Worms|||Sâu máy tính (Worms)"
            },
            {
              "text": "Viruses|||Virus"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>Trojan horse</b> performs a seemingly legitimate task while secretly carrying hidden malicious code.</div><div class=\"ml-vi\"><b>Trojan horse</b> thực hiện một nhiệm vụ có vẻ hợp pháp trong khi bí mật mang theo mã độc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The program in a high-level language is called the _______|||Chương trình viết bằng ngôn ngữ bậc cao được gọi là _______",
          "options": [
            {
              "text": "Programming language|||Ngôn ngữ lập trình"
            },
            {
              "text": "Source program|||Chương trình nguồn (source program)"
            },
            {
              "text": "Translation|||Dịch (translation)"
            },
            {
              "text": "Interpretation|||Thông dịch (interpretation)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Code written in a high-level language before translation is the <b>source program</b>.</div><div class=\"ml-vi\">Mã viết bằng ngôn ngữ bậc cao trước khi dịch được gọi là <b>chương trình nguồn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The CD-ROM is read using a _____beam. The beam is reflected by the aluminum surface when passing through a land. It is reflected twice when it encounters a pit, once by the pit boundary and once by the aluminum boundary.|||Đĩa CD-ROM được đọc bằng một chùm _____. Chùm tia phản xạ qua bề mặt nhôm khi đi qua vùng phẳng (land). Nó phản xạ hai lần khi gặp một hố lõm (pit).",
          "options": [
            {
              "text": "Laser|||Laser"
            },
            {
              "text": "Red laser|||Laser đỏ"
            },
            {
              "text": "Low-power laser|||Laser công suất thấp (low-power)"
            },
            {
              "text": "Ultraviolet light|||Tia cực tím"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">CD-ROM reading uses a <b>low-power laser</b> beam to avoid damaging the disc surface.</div><div class=\"ml-vi\">Đọc đĩa CD-ROM dùng chùm <b>laser công suất thấp</b> để tránh làm hỏng bề mặt đĩa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A memory that holds micro programs is|||Bộ nhớ lưu giữ các vi chương trình (micro programs) là",
          "options": [
            {
              "text": "Core memory|||Bộ nhớ lõi (core memory)"
            },
            {
              "text": "ROM|||ROM"
            },
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "Control memory|||Bộ nhớ điều khiển (control memory)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Control memory</b> (microprogram control store) holds the microprograms used by a microprogrammed control unit to implement machine instructions.</div><div class=\"ml-vi\"><b>Bộ nhớ điều khiển (control memory)</b> lưu giữ các vi chương trình mà bộ điều khiển vi lập trình dùng để hiện thực các lệnh máy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An array that consists of just rows and columns is a ________ array.|||Một mảng chỉ gồm hàng và cột là mảng ________.",
          "options": [
            {
              "text": "One-dimensional|||Một chiều"
            },
            {
              "text": "Two-dimensional|||Hai chiều"
            },
            {
              "text": "Three-dimensional|||Ba chiều"
            },
            {
              "text": "Multidimensional|||Đa chiều"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An array organized as rows and columns is a <b>two-dimensional</b> array.</div><div class=\"ml-vi\">Một mảng tổ chức theo hàng và cột là mảng <b>hai chiều</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ________ traversal of a binary tree, the right subtree is processed last. (Choose 2 answers)|||Trong duyệt cây nhị phân theo thứ tự ________, cây con phải được xử lý sau cùng. (Chọn 2 đáp án)",
          "options": [
            {
              "text": "Preorder|||Trước (preorder)"
            },
            {
              "text": "Inorder|||Giữa (inorder)"
            },
            {
              "text": "Postorder|||Sau (postorder)"
            },
            {
              "text": "Any order|||Bất kỳ thứ tự nào"
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Preorder</b> (Root, Left, Right) and <b>Inorder</b> (Left, Root, Right) both process the right subtree last. <b>Postorder</b> (Left, Right, Root) processes the root last instead.</div><div class=\"ml-vi\"><b>Preorder</b> (Gốc, Trái, Phải) và <b>Inorder</b> (Trái, Gốc, Phải) đều xử lý cây con phải sau cùng. <b>Postorder</b> (Trái, Phải, Gốc) lại xử lý gốc sau cùng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _____ the development process flows in only one direction. This means that a phase cannot be started until the previous phase is completed.|||Trong _____ quy trình phát triển chỉ chảy theo một hướng. Nghĩa là một giai đoạn không thể bắt đầu cho tới khi giai đoạn trước hoàn tất.",
          "options": [
            {
              "text": "Waterfall model|||Mô hình thác nước (waterfall)"
            },
            {
              "text": "Incremental model|||Mô hình tăng dần (incremental)"
            },
            {
              "text": "Development proces|||Quy trình phát triển"
            },
            {
              "text": "Software engineering|||Kỹ nghệ phần mềm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>waterfall model</b> is strictly sequential and one-directional: each phase must finish before the next begins.</div><div class=\"ml-vi\"><b>Mô hình thác nước</b> hoàn toàn tuần tự và một chiều: mỗi giai đoạn phải hoàn tất trước khi giai đoạn kế tiếp bắt đầu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A unary operator is applied to ________ relation(s) and creates an output of ________ relation(s).|||Toán tử một ngôi (unary) áp dụng lên ________ quan hệ và tạo ra kết quả là ________ quan hệ.",
          "options": [
            {
              "text": "One, one|||Một, một"
            },
            {
              "text": "One, two|||Một, hai"
            },
            {
              "text": "Two, one|||Hai, một"
            },
            {
              "text": "Two, two|||Hai, hai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">By definition, a <b>unary</b> operator takes exactly <b>one</b> relation as input and produces exactly <b>one</b> relation as output.</div><div class=\"ml-vi\">Theo định nghĩa, toán tử <b>một ngôi</b> nhận vào đúng <b>một</b> quan hệ và tạo ra đúng <b>một</b> quan hệ kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The software used to convert source program instructions to object instruction is known as|||Phần mềm dùng để chuyển các lệnh chương trình nguồn thành lệnh đối tượng (object) được gọi là",
          "options": [
            {
              "text": "Compiler|||Trình biên dịch (compiler)"
            },
            {
              "text": "Assembler|||Trình hợp dịch (assembler)"
            },
            {
              "text": "Interpreter|||Trình thông dịch (interpreter)"
            },
            {
              "text": "Language processor|||Bộ xử lý ngôn ngữ"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>compiler</b> translates an entire source program into object (machine) instructions before execution.</div><div class=\"ml-vi\"><b>Trình biên dịch (compiler)</b> dịch toàn bộ chương trình nguồn thành các lệnh đối tượng (mã máy) trước khi thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In cryptography _____ is ordinary readable text before being encrypted into ciphertext or after being decrypted.|||Trong mật mã học, _____ là văn bản đọc được thông thường trước khi được mã hoá thành bản mã hoặc sau khi được giải mã.",
          "options": [
            {
              "text": "Plain text|||Bản rõ (plain text)"
            },
            {
              "text": "Cipher text|||Bản mã (cipher text)"
            },
            {
              "text": "Encryption|||Mã hoá (encryption)"
            },
            {
              "text": "Decryption|||Giải mã (decryption)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Plain text</b> is the original readable message, before encryption or after decryption; cipher text is the encrypted, unreadable form.</div><div class=\"ml-vi\"><b>Bản rõ (plain text)</b> là thông điệp gốc đọc được, trước khi mã hoá hoặc sau khi giải mã; bản mã (cipher text) là dạng đã mã hoá, không đọc được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Sending a virus to a computer is called an ________ attack.|||Việc gửi virus vào một máy tính được gọi là tấn công ________.",
          "options": [
            {
              "text": "Penetration|||Xâm nhập (penetration)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Either a or b|||Cả a và b đều đúng"
            },
            {
              "text": "Neither a nor b|||Không phải a cũng không phải b"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Delivering a virus into a system to compromise it is classified as a <b>penetration</b> attack — gaining unauthorized entry with malicious payload.</div><div class=\"ml-vi\">Việc đưa virus vào hệ thống để xâm hại nó được xếp vào tấn công <b>xâm nhập (penetration)</b> — chiếm quyền truy cập trái phép kèm tải trọng độc hại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the _____ we can think of a program as an active agent that manipulates passive objects.|||Trong _____ ta có thể xem chương trình như một tác nhân chủ động thao túng các đối tượng thụ động.",
          "options": [
            {
              "text": "Procedural paradigm|||Mô hình thủ tục (procedural)"
            },
            {
              "text": "Functional paradigm|||Mô hình hàm (functional)"
            },
            {
              "text": "Declarative paradigm|||Mô hình khai báo (declarative)"
            },
            {
              "text": "Object-oriented paradigm|||Mô hình hướng đối tượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In the <b>procedural paradigm</b>, procedures/functions (active agent) operate on passive data structures.</div><div class=\"ml-vi\">Trong <b>mô hình thủ tục</b>, các thủ tục/hàm (tác nhân chủ động) thao tác trên các cấu trúc dữ liệu thụ động.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular right shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch phải vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0100 1100|||0100 1100"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A circular right shift moves every bit one position right and wraps the old LSB around to the new MSB: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div><div class=\"ml-vi\">Dịch phải vòng đẩy mọi bit sang phải một vị trí và đưa bit thấp nhất cũ vòng lên thành bit cao nhất mới: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An empty linked list consists of ________.|||Một danh sách liên kết rỗng bao gồm ________.",
          "options": [
            {
              "text": "A node|||Một nút"
            },
            {
              "text": "Two nodes|||Hai nút"
            },
            {
              "text": "Data and a link|||Dữ liệu và một liên kết"
            },
            {
              "text": "A null head pointer|||Một con trỏ đầu (head) rỗng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">An empty linked list has no nodes at all — just a <b>head pointer set to null</b>.</div><div class=\"ml-vi\">Danh sách liên kết rỗng không có nút nào cả — chỉ có <b>con trỏ đầu (head) được đặt là null</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, structure charts are tools used in the ________ phase.|||Trong quy trình phát triển hệ thống, sơ đồ cấu trúc là công cụ dùng trong giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Structure charts</b> show module hierarchy and data flow — a <b>design</b>-phase tool.</div><div class=\"ml-vi\"><b>Sơ đồ cấu trúc</b> thể hiện phân cấp mô-đun và luồng dữ liệu — công cụ của giai đoạn <b>thiết kế</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a block cipher a _____is used to encrypt the whole block even if the key is made of multiple values|||Trong mật mã khối, một _____ được dùng để mã hoá toàn bộ khối cho dù khoá gồm nhiều giá trị",
          "options": [
            {
              "text": "Key block|||Khối khoá (key block)"
            },
            {
              "text": "Single key|||Khoá đơn"
            },
            {
              "text": "Key stream|||Dòng khoá (key stream)"
            },
            {
              "text": "Auto key|||Khoá tự sinh (auto key)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Whether single value or built from sub-keys, the whole key applied to encrypt one block at once is a <b>key block</b>.</div><div class=\"ml-vi\">Dù là một giá trị đơn hay gồm nhiều khoá con, toàn bộ khoá dùng để mã hoá một khối cùng lúc được xem như một <b>khối khoá (key block)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A(n) ________ list is also known as a queue.|||Một danh sách ________ còn được gọi là hàng đợi.",
          "options": [
            {
              "text": "LIFO|||LIFO"
            },
            {
              "text": "FIFO|||FIFO"
            },
            {
              "text": "unordered|||không có thứ tự"
            },
            {
              "text": "ordered|||có thứ tự"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A queue is <b>FIFO</b> (First In, First Out).</div><div class=\"ml-vi\">Hàng đợi hoạt động theo kiểu <b>FIFO</b> (Vào trước, Ra trước).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We use the ________ search for an ordered list.|||Ta dùng tìm kiếm ________ cho một danh sách đã sắp xếp.",
          "options": [
            {
              "text": "Sequential|||Tuần tự (sequential)"
            },
            {
              "text": "Binary|||Nhị phân (binary)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search</b> requires (and exploits) an ordered list.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân</b> yêu cầu (và tận dụng) danh sách đã sắp xếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A group includes ______ bits in the binary system are represented as one digit in the hexadecimal system.|||Một nhóm gồm ______ bit trong hệ nhị phân được biểu diễn thành một chữ số trong hệ thập lục phân.",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Hexadecimal is base 16 = 2^4, so each hex digit corresponds to exactly <b>4</b> binary bits.</div><div class=\"ml-vi\">Thập lục phân có cơ số 16 = 2^4, nên mỗi chữ số hex tương ứng với đúng <b>4</b> bit nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the exponent in Excess_127 is binary 10000101, the exponent in decimal is ________.|||Nếu số mũ ở dạng Excess_127 là nhị phân 10000101, số mũ ở hệ thập phân là ________.",
          "options": [
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">10000101 binary = 133 decimal. Excess-127: actual exponent = stored - 127 = 133 - 127 = <b>6</b>.</div><div class=\"ml-vi\">10000101 nhị phân = 133 thập phân. Excess-127: số mũ thật = giá trị lưu - 127 = 133 - 127 = <b>6</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When converting a decimal fraction to base b, we repeatedly _____b.|||Khi chuyển một phân số thập phân sang cơ số b, ta lặp lại việc _____ b.",
          "options": [
            {
              "text": "Divide by|||Chia cho"
            },
            {
              "text": "Multiply by|||Nhân với"
            },
            {
              "text": "Add to|||Cộng vào"
            },
            {
              "text": "Subtract from|||Trừ đi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Converting a fraction to base b requires repeatedly <b>multiplying by b</b> and taking the integer part as the next digit (the reverse of dividing, which is used for converting the integer part).</div><div class=\"ml-vi\">Chuyển phần thập phân sang cơ số b cần lặp lại việc <b>nhân với b</b> rồi lấy phần nguyên làm chữ số tiếp theo (ngược với chia, vốn dùng để chuyển phần nguyên).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the hierarchical database model, data is organized as an inverted ________.|||Trong mô hình cơ sở dữ liệu phân cấp, dữ liệu được tổ chức thành một ________ lộn ngược.",
          "options": [
            {
              "text": "Graph|||Đồ thị (graph)"
            },
            {
              "text": "Tree|||Cây (tree)"
            },
            {
              "text": "Array|||Mảng (array)"
            },
            {
              "text": "Record|||Bản ghi (record)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The hierarchical model organizes data as an inverted <b>tree</b> — a single root with parent-child relationships branching downward.</div><div class=\"ml-vi\">Mô hình phân cấp tổ chức dữ liệu thành một <b>cây</b> lộn ngược — một gốc duy nhất với quan hệ cha-con phân nhánh xuống dưới.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For each entity set in the E-R diagram we create a relation (table) in which there are n columns related to the _____ attributes defined for that set.|||Với mỗi tập thực thể trong sơ đồ E-R, ta tạo một quan hệ (bảng) có n cột tương ứng với _____ thuộc tính được định nghĩa cho tập đó.",
          "options": [
            {
              "text": "n-1|||n-1"
            },
            {
              "text": "n|||n"
            },
            {
              "text": "n+1|||n+1"
            },
            {
              "text": "1-n|||1-n"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Each attribute defined for an entity set becomes exactly one column, so a set with <b>n</b> attributes produces a relation with n columns.</div><div class=\"ml-vi\">Mỗi thuộc tính định nghĩa cho một tập thực thể trở thành đúng một cột, nên tập có <b>n</b> thuộc tính sẽ tạo ra quan hệ có n cột.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the attacks threatent integrity with ______ attack the attacker modifies the information to make it beneficial to them|||Trong các tấn công đe doạ tính toàn vẹn, kiểu tấn công ______ khiến kẻ tấn công sửa đổi thông tin để trục lợi",
          "options": [
            {
              "text": "Snooping|||Nghe lén (snooping)"
            },
            {
              "text": "Repudiation|||Chối bỏ (repudiation)"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Traffic analysis|||Phân tích lưu lượng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Among the four choices given, only <b>repudiation</b> belongs to the integrity-attack family (the other three are confidentiality/availability attacks); strictly, the behaviour described matches \"modification\", but repudiation is the closest/only integrity-category option offered here.</div><div class=\"ml-vi\">Trong bốn lựa chọn, chỉ <b>repudiation (chối bỏ)</b> thuộc nhóm tấn công toàn vẹn (ba đáp án còn lại là tấn công bí mật/sẵn sàng); về đúng nghĩa hành vi mô tả là \"modification\", nhưng repudiation là lựa chọn duy nhất/gần nhất thuộc nhóm toàn vẹn được đưa ra ở đây.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A mechanism for arranging controlled access to a shared resource is|||Một cơ chế sắp xếp việc truy cập có kiểm soát tới một tài nguyên dùng chung là",
          "options": [
            {
              "text": "Retrieving|||Truy xuất (retrieving)"
            },
            {
              "text": "Sorting|||Sắp xếp (sorting)"
            },
            {
              "text": "Balleting|||Balleting"
            },
            {
              "text": "Lock-out|||Khoá loại trừ (lock-out)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>lock-out</b> mechanism arranges controlled, exclusive access to a shared resource.</div><div class=\"ml-vi\">Cơ chế <b>khoá loại trừ (lock-out)</b> sắp xếp việc truy cập có kiểm soát, độc quyền tới tài nguyên dùng chung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _______ sort, the smallest item moves to the beginning of the unsorted list. There is no one-to-one swapping.|||Trong sắp xếp _______, phần tử nhỏ nhất được chuyển tới đầu danh sách chưa sắp xếp. Không có việc hoán đổi từng cặp một.",
          "options": [
            {
              "text": "Selection|||Chọn (selection)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Every|||Mọi loại"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Selection sort</b> repeatedly finds the smallest remaining item and places it at the front with a single swap per pass.</div><div class=\"ml-vi\"><b>Sắp xếp chọn</b> liên tục tìm phần tử nhỏ nhất còn lại và đặt nó lên đầu chỉ với một lần hoán đổi mỗi vòng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If we cannot record all the values of an audio signal over an interval, we can record some of them. _____ means that we select only a finite number of points on the analog signal, measure their values, and record them|||Nếu không thể ghi lại mọi giá trị của tín hiệu âm thanh trong một khoảng thời gian, ta có thể ghi lại một số điểm. _____ nghĩa là ta chỉ chọn một số hữu hạn điểm trên tín hiệu tương tự, đo giá trị của chúng và ghi lại",
          "options": [
            {
              "text": "digital|||số (digital)"
            },
            {
              "text": "analog|||tương tự (analog)"
            },
            {
              "text": "sampling|||lấy mẫu (sampling)"
            },
            {
              "text": "binary|||nhị phân (binary)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Sampling</b> is exactly this: selecting a finite number of points on a continuous analog signal to measure and record.</div><div class=\"ml-vi\"><b>Lấy mẫu (sampling)</b> đúng là như vậy: chọn một số hữu hạn điểm trên tín hiệu tương tự liên tục để đo và ghi lại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A _____is a collection of related logically coherent data used by the application programs in an organization.|||Một _____ là một tập hợp dữ liệu liên quan, mạch lạc về logic, được các chương trình ứng dụng trong một tổ chức sử dụng.",
          "options": [
            {
              "text": "Database|||Cơ sở dữ liệu (database)"
            },
            {
              "text": "File|||Tệp (file)"
            },
            {
              "text": "Directory|||Thư mục (directory)"
            },
            {
              "text": "Flat-file|||Tệp phẳng (flat-file)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the standard definition of a <b>database</b>: a collection of related, logically coherent data shared by an organization's application programs.</div><div class=\"ml-vi\">Đây là định nghĩa chuẩn của <b>cơ sở dữ liệu (database)</b>: một tập hợp dữ liệu liên quan, mạch lạc về logic, dùng chung cho các chương trình ứng dụng của một tổ chức.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The _____image encoding method, but it does not store the bit patterns for each pixel|||Phương pháp mã hoá ảnh _____ nhưng không lưu chuỗi bit cho từng điểm ảnh",
          "options": [
            {
              "text": "Bitmap|||Bitmap"
            },
            {
              "text": "Quantized|||Lượng tử hoá"
            },
            {
              "text": "Vector graphic|||Đồ hoạ vector"
            },
            {
              "text": "Binary|||Nhị phân"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Vector graphics</b> store mathematical shape descriptions rather than a bit pattern for every pixel, unlike bitmap (raster) graphics.</div><div class=\"ml-vi\"><b>Đồ hoạ vector</b> lưu mô tả hình học bằng công thức toán thay vì lưu chuỗi bit cho từng điểm ảnh, khác với đồ hoạ bitmap (raster).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What kind of state does a process execute until it needs I/O resources when I/O is complete?|||Tiến trình thực thi ở trạng thái nào cho tới khi nó cần tài nguyên I/O, và trở lại trạng thái đó khi I/O hoàn tất?",
          "options": [
            {
              "text": "Hold state|||Trạng thái giữ"
            },
            {
              "text": "Ready state|||Trạng thái sẵn sàng"
            },
            {
              "text": "Running state|||Trạng thái đang chạy"
            },
            {
              "text": "Waiting state|||Trạng thái chờ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A process <b>runs</b> until it needs I/O, and returns to the <b>running</b> state after I/O completes.</div><div class=\"ml-vi\">Một tiến trình <b>chạy</b> cho tới khi cần I/O, và quay lại trạng thái <b>đang chạy</b> sau khi I/O hoàn tất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One phase in system development is ________.|||Một giai đoạn trong phát triển hệ thống là ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Application|||Ứng dụng"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "Collecting|||Thu thập"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The standard SDLC phases include <b>Analysis</b>, Design, Implementation and Testing.</div><div class=\"ml-vi\">Các giai đoạn SDLC chuẩn gồm <b>Phân tích</b>, Thiết kế, Cài đặt và Kiểm thử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____is the smallest element of named data that has meaning in a record.|||_____ là phần tử nhỏ nhất của dữ liệu có tên mang ý nghĩa trong một bản ghi.",
          "options": [
            {
              "text": "Name of record|||Tên bản ghi"
            },
            {
              "text": "Pointer|||Con trỏ (pointer)"
            },
            {
              "text": "A field|||Trường (field)"
            },
            {
              "text": "Index|||Chỉ mục (index)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>field</b> is the smallest named, meaningful unit of data within a record (e.g. \"name\", \"age\").</div><div class=\"ml-vi\"><b>Trường (field)</b> là đơn vị dữ liệu nhỏ nhất có tên, mang ý nghĩa trong một bản ghi (VD \"tên\", \"tuổi\").</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "IBM-PC is an example of|||IBM-PC là một ví dụ của",
          "options": [
            {
              "text": "A main frame|||Máy tính lớn (mainframe)"
            },
            {
              "text": "Machine-in-built|||Machine-in-built"
            },
            {
              "text": "Micro computer|||Máy vi tính (micro computer)"
            },
            {
              "text": "Special purpose|||Máy chuyên dụng"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The IBM-PC is a classic example of a <b>microcomputer</b> — a small, general-purpose personal computer.</div><div class=\"ml-vi\">IBM-PC là ví dụ kinh điển của <b>máy vi tính (microcomputer)</b> — máy tính cá nhân nhỏ gọn, đa dụng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In positional number systems, ________in an integer in the number systems that can be illustrated by form: b0, b1,b2,...,bK-1 where: b is base, K is the number of digits.|||Trong hệ đếm vị trí, ________ trong một số nguyên có thể minh hoạ bằng dạng: b0, b1, b2,..., bK-1 với b là cơ số, K là số chữ số.",
          "options": [
            {
              "text": "Numbers|||Các con số"
            },
            {
              "text": "Place values|||Giá trị vị trí (place values)"
            },
            {
              "text": "Values|||Các giá trị"
            },
            {
              "text": "All of others|||Tất cả đáp án khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Each digit position has a <b>place value</b> that is a power of the base (b0, b1, b2, ...) — this is exactly what positional notation means.</div><div class=\"ml-vi\">Mỗi vị trí chữ số có một <b>giá trị vị trí (place value)</b> là một luỹ thừa của cơ số (b0, b1, b2,...) — đây chính là ý nghĩa của ký hiệu vị trí.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Different sets of bit patterns have been designed to represent text symbols. Each set is called a ____?|||Các bộ chuỗi bit khác nhau đã được thiết kế để biểu diễn ký hiệu văn bản. Mỗi bộ được gọi là một ____?",
          "options": [
            {
              "text": "bit patterns|||chuỗi bit"
            },
            {
              "text": "binary|||nhị phân"
            },
            {
              "text": "code|||mã (code)"
            },
            {
              "text": "binary text file|||tệp văn bản nhị phân"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A designed set of bit patterns representing characters is called a <b>code</b> (e.g. ASCII code, Unicode).</div><div class=\"ml-vi\">Một bộ chuỗi bit được thiết kế để biểu diễn ký tự được gọi là một <b>mã (code)</b> (VD mã ASCII, Unicode).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ hides all the details of an algorithm in an attempt to give the 'big picture' and to show how the algorithm flows from beginning to end.|||____ ẩn đi mọi chi tiết của thuật toán nhằm cho thấy 'bức tranh tổng thể' và thể hiện luồng chạy của thuật toán từ đầu tới cuối.",
          "options": [
            {
              "text": "Pseudocode|||Mã giả (pseudocode)"
            },
            {
              "text": "Unified Modeling Language (UML)|||Ngôn ngữ mô hình hoá thống nhất (UML)"
            },
            {
              "text": "Flowchart|||Lưu đồ (flowchart)"
            },
            {
              "text": "State diagram|||Sơ đồ trạng thái"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>flowchart</b> gives a high-level, big-picture visual of how an algorithm flows from start to end, hiding low-level statement detail (unlike pseudocode, which is more detailed).</div><div class=\"ml-vi\"><b>Lưu đồ (flowchart)</b> cho cái nhìn tổng thể, trực quan về luồng chạy của thuật toán từ đầu tới cuối, ẩn đi chi tiết từng câu lệnh (khác với pseudocode chi tiết hơn).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A modern electronic computer is a machine that is meant for|||Một máy tính điện tử hiện đại là một cỗ máy được tạo ra nhằm mục đích",
          "options": [
            {
              "text": "Doing quick mathematical calculations|||Thực hiện tính toán nhanh"
            },
            {
              "text": "Input storage, manipulation of outputting of data|||Nhập, lưu trữ, thao tác và xuất dữ liệu"
            },
            {
              "text": "Electronic data processing|||Xử lý dữ liệu điện tử (electronic data processing)"
            },
            {
              "text": "Performing repetitive tasks accurately|||Thực hiện các tác vụ lặp lại chính xác"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The broad, classic definition of a modern computer is a machine for <b>electronic data processing</b> — encompassing calculation, storage, manipulation and output as sub-tasks of this overall purpose.</div><div class=\"ml-vi\">Định nghĩa tổng quát, kinh điển của máy tính hiện đại là một cỗ máy để <b>xử lý dữ liệu điện tử</b> — bao gồm tính toán, lưu trữ, thao tác và xuất dữ liệu như các tác vụ con của mục đích tổng thể này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An IPv4 address is a _______address that uniquely and universally defines the connection of a host or a router to the Internet|||Địa chỉ IPv4 là một địa chỉ _______ định danh duy nhất và toàn cầu cho kết nối của một máy chủ hoặc bộ định tuyến tới Internet",
          "options": [
            {
              "text": "32-bit|||32-bit"
            },
            {
              "text": "64-bit|||64-bit"
            },
            {
              "text": "128-bit|||128-bit"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>IPv4</b> address is <b>32 bits</b> long.</div><div class=\"ml-vi\">Địa chỉ <b>IPv4</b> dài <b>32-bit</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A program may need files located in different parts of the world. Networking and internetworking have created a new dimension in operating system that is ____|||Một chương trình có thể cần các tệp nằm ở nhiều nơi khác nhau trên thế giới. Mạng và liên mạng đã tạo ra một chiều hướng mới trong hệ điều hành, đó là ____",
          "options": [
            {
              "text": "Personal systems|||Hệ thống cá nhân"
            },
            {
              "text": "Distributed systems|||Hệ thống phân tán (distributed)"
            },
            {
              "text": "Parallel systems|||Hệ thống song song"
            },
            {
              "text": "Real-time systems|||Hệ thống thời gian thực"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Distributed systems</b> let programs access files and resources spread across a network of machines around the world.</div><div class=\"ml-vi\"><b>Hệ thống phân tán</b> cho phép chương trình truy cập tệp và tài nguyên trải rộng trên mạng lưới máy tính khắp thế giới.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When Minicomputers appeared on the market?|||Máy tính mini (minicomputer) xuất hiện trên thị trường vào thời kỳ nào?",
          "options": [
            {
              "text": "First generation|||Thế hệ thứ nhất"
            },
            {
              "text": "Second generation|||Thế hệ thứ hai"
            },
            {
              "text": "Third generation|||Thế hệ thứ ba"
            },
            {
              "text": "Fourth generation|||Thế hệ thứ tư"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Minicomputers</b> emerged during the <b>third generation</b> of computers (the IC era, 1960s-70s), offering smaller, cheaper alternatives to mainframes.</div><div class=\"ml-vi\"><b>Máy tính mini</b> xuất hiện vào <b>thế hệ thứ ba</b> của máy tính (kỷ nguyên IC, thập niên 1960-70), là lựa chọn nhỏ gọn, rẻ hơn so với máy tính lớn (mainframe).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the sequential file we process the records one by one. After the operating system processes the last record the _____is detected and the loop is exited.|||Trong tệp tuần tự, ta xử lý từng bản ghi một. Sau khi hệ điều hành xử lý bản ghi cuối cùng, _____ được phát hiện và vòng lặp kết thúc.",
          "options": [
            {
              "text": "Hashed file|||Tệp băm"
            },
            {
              "text": "Sequential file|||Tệp tuần tự"
            },
            {
              "text": "EOF|||EOF"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>EOF</b> (End-Of-File) marker is detected after the last record, signaling the processing loop to exit.</div><div class=\"ml-vi\">Dấu hiệu <b>EOF</b> (kết thúc tệp) được phát hiện sau bản ghi cuối cùng, báo hiệu vòng lặp xử lý kết thúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A digital device that processes data is known as ______|||Một thiết bị số xử lý dữ liệu được gọi là ______",
          "options": [
            {
              "text": "Data processor|||Bộ xử lý dữ liệu (data processor)"
            },
            {
              "text": "Data entry|||Nhập liệu (data entry)"
            },
            {
              "text": "DBMS|||DBMS"
            },
            {
              "text": "Database|||Cơ sở dữ liệu (database)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A digital device whose job is to process data is generically called a <b>data processor</b>.</div><div class=\"ml-vi\">Một thiết bị số có nhiệm vụ xử lý dữ liệu được gọi chung là <b>bộ xử lý dữ liệu (data processor)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "After a sequential file is updated, the ________ file contains the most current data.|||Sau khi tệp tuần tự được cập nhật, tệp ________ chứa dữ liệu mới nhất.",
          "options": [
            {
              "text": "New master|||Chủ mới (new master)"
            },
            {
              "text": "Old master|||Chủ cũ (old master)"
            },
            {
              "text": "Transaction|||Giao dịch (transaction)"
            },
            {
              "text": "Error report|||Báo cáo lỗi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>new master</b> file, produced by merging the old master with the transaction file, contains the most current data.</div><div class=\"ml-vi\">Tệp <b>chủ mới</b>, tạo ra bằng cách gộp tệp chủ cũ với tệp giao dịch, chứa dữ liệu mới nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A program becomes a ________ when it is selected by the operating system and brought to the hold state.|||Một chương trình trở thành ________ khi được hệ điều hành chọn và đưa vào trạng thái giữ (hold).",
          "options": [
            {
              "text": "Job|||Công việc (job)"
            },
            {
              "text": "Process|||Tiến trình (process)"
            },
            {
              "text": "Deadlock|||Bế tắc (deadlock)"
            },
            {
              "text": "Partition|||Phân vùng (partition)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A program submitted for execution and selected by the OS (before being loaded into memory) becomes a <b>job</b>, sitting in the hold/job-queue state.</div><div class=\"ml-vi\">Một chương trình được gửi để thực thi và được hệ điều hành chọn (trước khi nạp vào bộ nhớ) trở thành một <b>công việc (job)</b>, nằm ở trạng thái giữ/hàng đợi công việc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The Stack operation returns a/an ______.|||Các thao tác trên Stack trả về một ______.",
          "options": [
            {
              "text": "Full stack|||Ngăn xếp đầy"
            },
            {
              "text": "Empty stack|||Ngăn xếp rỗng"
            },
            {
              "text": "Check status of stack|||Trạng thái của ngăn xếp"
            },
            {
              "text": "All of the others|||Tất cả đáp án trên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Depending on which stack operation is called (isFull, isEmpty, peek/status), it can return a full-stack indication, empty-stack indication, or general status — <b>all of the others</b>.</div><div class=\"ml-vi\">Tuỳ vào thao tác stack nào được gọi (isFull, isEmpty, peek/kiểm tra trạng thái), nó có thể trả về báo hiệu đầy, rỗng, hoặc trạng thái chung — <b>tất cả đáp án trên</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ___is the highest level in the file system hierarchy.This does not have a parent directory|||___ là mức cao nhất trong phân cấp hệ thống tệp. Nó không có thư mục cha",
          "options": [
            {
              "text": "Root directory|||Thư mục gốc (root)"
            },
            {
              "text": "Home directory|||Thư mục home"
            },
            {
              "text": "Working directory|||Thư mục làm việc"
            },
            {
              "text": "Parent directory|||Thư mục cha"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>root directory</b> is the top of the file system hierarchy and has no parent directory.</div><div class=\"ml-vi\"><b>Thư mục gốc (root)</b> là đỉnh của phân cấp hệ thống tệp và không có thư mục cha.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are used to quickly accept, store, and transfer data and instructions that are being used immediately by the CPU?|||Thành phần nào dùng để nhanh chóng nhận, lưu và truyền dữ liệu, lệnh đang được CPU sử dụng ngay lập tức?",
          "options": [
            {
              "text": "Microprocessors|||Vi xử lý"
            },
            {
              "text": "Registers|||Thanh ghi (registers)"
            },
            {
              "text": "ROM chips|||Chip ROM"
            },
            {
              "text": "Data buses|||Bus dữ liệu"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Registers</b> are the fastest storage inside the CPU, holding data and instructions currently being used immediately by the processor.</div><div class=\"ml-vi\"><b>Thanh ghi (registers)</b> là bộ nhớ nhanh nhất bên trong CPU, giữ dữ liệu và lệnh đang được bộ xử lý dùng ngay lập tức.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a circular left shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch trái vòng (circular) lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0001 1001|||0001 1001"
            },
            {
              "text": "0011 0001|||0011 0001"
            },
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A circular left shift moves every bit one position left and wraps the old MSB around to the new LSB: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div><div class=\"ml-vi\">Dịch trái vòng đẩy mọi bit sang trái một vị trí và đưa bit cao nhất cũ vòng xuống thành bit thấp nhất mới: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0001</b>.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D6",
      "source": "REAL",
      "sortOrder": 5,
      "title": "Đề 6 — SP26 Block 5 Final Exam (CSI106)|||Đề 6 — Thi cuối kỳ SP26 Block 5 (CSI106)",
      "description": "CSI104 real FE multiple-choice paper (Spring 2026, Block 5 — school renamed the course CSI106 by this term), transcribed from the exam images; a newer question bank covering refactoring, algorithms, TCP/IP and OS topics not seen in earlier papers. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2026, Block 5 — trường đổi mã môn thành CSI106 ở kỳ này), chép từ ảnh đề; ngân hàng câu hỏi mới hơn, phủ các chủ đề refactoring, thuật toán, TCP/IP và hệ điều hành chưa xuất hiện ở các đề trước. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of software development, what does the term \"refactoring\" refer to?|||Trong phát triển phần mềm, thuật ngữ \"refactoring\" (tái cấu trúc) đề cập tới điều gì?",
          "options": [
            {
              "text": "Rewriting code from scratch to improve performance|||Viết lại mã từ đầu để cải thiện hiệu năng"
            },
            {
              "text": "Adding new features to existing software without changing its external behavior|||Thêm tính năng mới vào phần mềm hiện có mà không đổi hành vi bên ngoài"
            },
            {
              "text": "Optimizing code to reduce memory usage|||Tối ưu mã để giảm dung lượng bộ nhớ"
            },
            {
              "text": "Restructuring existing code to improve readability, maintainability, and efficiency|||Tái cấu trúc mã hiện có để cải thiện khả năng đọc, bảo trì và hiệu quả"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Refactoring</b> means restructuring existing code to improve internal quality (readability, maintainability, efficiency) <i>without changing its external behavior</i> — not rewriting from scratch or adding features.</div><div class=\"ml-vi\"><b>Refactoring</b> nghĩa là tái cấu trúc mã hiện có để cải thiện chất lượng nội bộ (khả năng đọc, bảo trì, hiệu quả) <i>mà không thay đổi hành vi bên ngoài</i> — không phải viết lại từ đầu hay thêm tính năng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which model completes each phase before moving to the next?|||Mô hình nào hoàn thành từng giai đoạn trước khi chuyển sang giai đoạn kế tiếp?",
          "options": [
            {
              "text": "Waterfall|||Thác nước (waterfall)"
            },
            {
              "text": "Spiral|||Xoắn ốc (spiral)"
            },
            {
              "text": "Agile|||Linh hoạt (agile)"
            },
            {
              "text": "Prototype|||Tạo mẫu (prototype)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>waterfall</b> model is strictly sequential: each phase must complete before the next begins.</div><div class=\"ml-vi\">Mô hình <b>thác nước</b> hoàn toàn tuần tự: mỗi giai đoạn phải hoàn thành trước khi giai đoạn kế tiếp bắt đầu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the ____________ phase, all components of the system are defined|||Trong giai đoạn ____________, mọi thành phần của hệ thống được định nghĩa",
          "options": [
            {
              "text": "analysis|||phân tích"
            },
            {
              "text": "design|||thiết kế"
            },
            {
              "text": "implementation|||cài đặt"
            },
            {
              "text": "testing|||kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>design</b> phase defines all system components and their structure, before implementation (coding) begins.</div><div class=\"ml-vi\">Giai đoạn <b>thiết kế</b> định nghĩa mọi thành phần hệ thống và cấu trúc của chúng, trước khi cài đặt (viết mã) bắt đầu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does \"coupling\" refer to in the context of software modularity?|||Thuật ngữ \"coupling\" (kết dính) trong bối cảnh mô-đun hoá phần mềm đề cập tới điều gì?",
          "options": [
            {
              "text": "The internal logical structure of a module|||Cấu trúc logic nội bộ của một mô-đun"
            },
            {
              "text": "The reusability of a module in different projects.|||Khả năng tái sử dụng của một mô-đun ở các dự án khác nhau"
            },
            {
              "text": "The dependency between different modules, which should be minimized|||Sự phụ thuộc giữa các mô-đun khác nhau, cần được giảm thiểu"
            },
            {
              "text": "The efficiency of a module's execution.|||Hiệu quả thực thi của một mô-đun"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Coupling</b> is the degree of dependency between different modules; good design keeps coupling low (minimized) so modules can change independently.</div><div class=\"ml-vi\"><b>Coupling</b> là mức độ phụ thuộc giữa các mô-đun khác nhau; thiết kế tốt giữ coupling thấp (tối thiểu) để các mô-đun có thể thay đổi độc lập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In an E-R diagram, which geometric shape is used to represent an entity set?|||Trong sơ đồ E-R, hình học nào được dùng để biểu diễn một tập thực thể?",
          "options": [
            {
              "text": "Rectangle|||Hình chữ nhật"
            },
            {
              "text": "Ellipse|||Hình elip"
            },
            {
              "text": "Diamond|||Hình thoi"
            },
            {
              "text": "Line|||Đường thẳng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In an E-R diagram, a <b>rectangle</b> represents an entity set; an ellipse represents an attribute; a diamond represents a relationship.</div><div class=\"ml-vi\">Trong sơ đồ E-R, <b>hình chữ nhật</b> biểu diễn tập thực thể; hình elip biểu diễn thuộc tính; hình thoi biểu diễn mối quan hệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary key in a relational database table?|||Khoá chính trong một bảng cơ sở dữ liệu quan hệ là gì?",
          "options": [
            {
              "text": "A column that can store null values|||Một cột có thể lưu giá trị null"
            },
            {
              "text": "A column or combination of columns that uniquely identify each row in the table|||Một cột hoặc tổ hợp cột định danh duy nhất mỗi dòng trong bảng"
            },
            {
              "text": "A column used for indexing|||Một cột dùng để đánh chỉ mục"
            },
            {
              "text": "A foreign key reference in another table|||Một tham chiếu khoá ngoại ở bảng khác"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>primary key</b> is a column (or combination of columns) that uniquely identifies every row in a table — it cannot contain nulls or duplicates.</div><div class=\"ml-vi\"><b>Khoá chính</b> là một cột (hoặc tổ hợp cột) định danh duy nhất mọi dòng trong bảng — không được chứa null hoặc trùng lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which database model organizes data in two-dimensional tables?|||Mô hình cơ sở dữ liệu nào tổ chức dữ liệu thành các bảng hai chiều?",
          "options": [
            {
              "text": "Relational model|||Mô hình quan hệ"
            },
            {
              "text": "Hierarchical model|||Mô hình phân cấp"
            },
            {
              "text": "Network model|||Mô hình mạng"
            },
            {
              "text": "Distributed model|||Mô hình phân tán"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>relational model</b> organizes data as two-dimensional tables (rows and columns), formally called relations.</div><div class=\"ml-vi\"><b>Mô hình quan hệ</b> tổ chức dữ liệu thành các bảng hai chiều (dòng và cột), gọi chính thức là các quan hệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a relational database, which of the following is a unary operation?|||Trong cơ sở dữ liệu quan hệ, thao tác nào sau đây là thao tác một ngôi (unary)?",
          "options": [
            {
              "text": "union|||hợp (union)"
            },
            {
              "text": "join|||kết nối (join)"
            },
            {
              "text": "project|||chiếu (project)"
            },
            {
              "text": "all of these above|||tất cả đáp án trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Project</b> operates on a single relation (unary); union and join both combine two relations (binary), so \"all of these\" is wrong.</div><div class=\"ml-vi\"><b>Chiếu (project)</b> chỉ tác động lên một quan hệ (một ngôi); union và join đều kết hợp hai quan hệ (hai ngôi), nên \"tất cả đáp án trên\" sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following database models is designed specifically for handling data structures and organized as an inverted tree?|||Mô hình cơ sở dữ liệu nào được thiết kế riêng để xử lý cấu trúc dữ liệu và tổ chức thành cây lộn ngược?",
          "options": [
            {
              "text": "Relational database model|||Mô hình quan hệ"
            },
            {
              "text": "Object-oriented database model|||Mô hình hướng đối tượng"
            },
            {
              "text": "Network database model|||Mô hình mạng"
            },
            {
              "text": "Hierarchical database model|||Mô hình phân cấp"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>hierarchical</b> model organizes data as an inverted tree — a single root with parent-child branches.</div><div class=\"ml-vi\">Mô hình <b>phân cấp</b> tổ chức dữ liệu thành cây lộn ngược — một gốc duy nhất với các nhánh cha-con.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which scenario is a binary search algorithm ineffective?|||Trong tình huống nào thuật toán tìm kiếm nhị phân không hiệu quả?",
          "options": [
            {
              "text": "When the data is sorted|||Khi dữ liệu đã sắp xếp"
            },
            {
              "text": "When the data is unsorted|||Khi dữ liệu chưa sắp xếp"
            },
            {
              "text": "When the data is in an array|||Khi dữ liệu ở dạng mảng"
            },
            {
              "text": "When the data is in a linked list|||Khi dữ liệu ở dạng danh sách liên kết"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Binary search fundamentally requires sorted data to correctly halve the search space each step; on <b>unsorted data</b> it simply does not work.</div><div class=\"ml-vi\">Tìm kiếm nhị phân về bản chất yêu cầu dữ liệu đã sắp xếp để chia đôi không gian tìm kiếm đúng đắn mỗi bước; trên <b>dữ liệu chưa sắp xếp</b> nó đơn giản là không hoạt động.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following examples demonstrates the \"repetition\" construct in an algorithm?|||Ví dụ nào sau đây minh hoạ cấu trúc \"lặp\" (repetition) trong thuật toán?",
          "options": [
            {
              "text": "Assigning a value to a variable|||Gán giá trị cho biến"
            },
            {
              "text": "Evaluating a condition once|||Đánh giá một điều kiện một lần"
            },
            {
              "text": "Using a for loop to iterate over a list|||Dùng vòng lặp for để duyệt qua danh sách"
            },
            {
              "text": "Breaking out of a loop|||Thoát khỏi vòng lặp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>for loop iterating over a list</b> repeats the same action for each element — the definition of the repetition construct.</div><div class=\"ml-vi\"><b>Vòng lặp for duyệt qua danh sách</b> lặp lại cùng một hành động cho mỗi phần tử — đúng định nghĩa của cấu trúc lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which case would an iterative algorithm be preferred over a recursive algorithm?|||Trong trường hợp nào thuật toán lặp (iterative) được ưu tiên hơn thuật toán đệ quy?",
          "options": [
            {
              "text": "When solving problems that require backtracking|||Khi giải bài toán cần quay lui (backtracking)"
            },
            {
              "text": "When stack overflow is a concern|||Khi lo ngại tràn ngăn xếp (stack overflow)"
            },
            {
              "text": "When the problem involves tree traversal|||Khi bài toán liên quan tới duyệt cây"
            },
            {
              "text": "When solving problems with divide-and-conquer techniques|||Khi giải bài toán bằng kỹ thuật chia để trị"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Recursion consumes call-stack space with each call; when <b>stack overflow is a concern</b> (e.g. very deep recursion), an iterative version avoids that risk.</div><div class=\"ml-vi\">Đệ quy tốn không gian ngăn xếp lời gọi mỗi lần gọi; khi <b>lo ngại tràn ngăn xếp</b> (VD đệ quy quá sâu), phiên bản lặp tránh được rủi ro đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary difference between sequential search and binary search algorithms?|||Điểm khác biệt chính giữa tìm kiếm tuần tự và tìm kiếm nhị phân là gì?",
          "options": [
            {
              "text": "Sequential search requires the data to be sorted in ascending order, while binary search can work on unsorted data as well|||Tìm kiếm tuần tự yêu cầu dữ liệu sắp xếp tăng dần, còn tìm kiếm nhị phân có thể làm việc trên dữ liệu chưa sắp xếp"
            },
            {
              "text": "Binary search divides the search space into halves, while sequential search checks elements one by one|||Tìm kiếm nhị phân chia không gian tìm kiếm thành các nửa, còn tìm kiếm tuần tự kiểm tra từng phần tử một"
            },
            {
              "text": "Sequential search exhibits greater efficiency and speed compared to binary search when applied to large datasets containing a significant number of elements|||Tìm kiếm tuần tự hiệu quả và nhanh hơn tìm kiếm nhị phân khi áp dụng cho tập dữ liệu lớn có nhiều phần tử"
            },
            {
              "text": "Binary search is a versatile algorithm that can be applied to various types of data structures, including arrays, linked lists, and trees, while sequential search is specifically designed to work only with arrays|||Tìm kiếm nhị phân là thuật toán đa năng áp dụng được cho nhiều cấu trúc dữ liệu (mảng, danh sách liên kết, cây), còn tìm kiếm tuần tự chỉ dùng được cho mảng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Binary search halves the search space</b> each step (needs sorted, indexed data); sequential search simply checks every element in order — the other three options reverse or misstate these facts.</div><div class=\"ml-vi\"><b>Tìm kiếm nhị phân chia đôi không gian tìm kiếm</b> mỗi bước (cần dữ liệu đã sắp xếp, có chỉ số); tìm kiếm tuần tự chỉ đơn giản kiểm tra từng phần tử theo thứ tự — ba đáp án còn lại đảo ngược hoặc nói sai sự thật này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What command do you use to iterate through each element in the array?|||Lệnh nào dùng để duyệt qua từng phần tử trong mảng?",
          "options": [
            {
              "text": "for|||for"
            },
            {
              "text": "if else|||if else"
            },
            {
              "text": "switch case|||switch case"
            },
            {
              "text": "return|||return"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>for</b> loop is the standard construct for iterating through each element of an array.</div><div class=\"ml-vi\">Vòng lặp <b>for</b> là cấu trúc chuẩn để duyệt qua từng phần tử của mảng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In computer science, what is a \"stack\" data structure, and what is the primary characteristic that defines how data is added to and removed from it?|||Trong khoa học máy tính, ngăn xếp (stack) là gì, và đặc điểm chính quyết định cách dữ liệu được thêm/lấy ra là gì?",
          "options": [
            {
              "text": "A linear list; First In, First Out (FIFO).|||Một danh sách tuyến tính; Vào trước, Ra trước (FIFO)."
            },
            {
              "text": "A restricted linear list; Last In, First Out (LIFO).|||Một danh sách tuyến tính hạn chế; Vào sau, Ra trước (LIFO)."
            },
            {
              "text": "A collection of related elements of different types.|||Một tập hợp các phần tử liên quan, khác kiểu."
            },
            {
              "text": "A sorted collection of elements accessed by index.|||Một tập hợp đã sắp xếp, truy cập theo chỉ số."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>stack</b> is a restricted linear list operating as <b>LIFO</b> (Last In, First Out): insertions and removals both happen only at the top.</div><div class=\"ml-vi\"><b>Stack</b> là danh sách tuyến tính hạn chế hoạt động theo kiểu <b>LIFO</b> (Vào sau, Ra trước): chèn và lấy ra đều chỉ diễn ra ở đỉnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Suppose the following sequence of values is pushed into a stack: 5, 15, 10, 20. What would be the order of removal?|||Giả sử dãy giá trị sau được push vào một ngăn xếp: 5, 15, 10, 20. Thứ tự lấy ra sẽ là gì?",
          "options": [
            {
              "text": "20, 10, 15, 5|||20, 10, 15, 5"
            },
            {
              "text": "5, 10, 15, 20|||5, 10, 15, 20"
            },
            {
              "text": "10, 15, 20, 5|||10, 15, 20, 5"
            },
            {
              "text": "15, 10, 5, 20|||15, 10, 5, 20"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A stack pops in reverse push order (<b>LIFO</b>): pushed 5, 15, 10, 20 &rarr; popped <b>20, 10, 15, 5</b>.</div><div class=\"ml-vi\">Ngăn xếp lấy ra theo thứ tự ngược với lúc đẩy vào (<b>LIFO</b>): đẩy vào 5, 15, 10, 20 &rarr; lấy ra <b>20, 10, 15, 5</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the two parts of a node in a linked list?|||Hai phần của một nút trong danh sách liên kết là gì?",
          "options": [
            {
              "text": "Data and a pointer to the next node|||Dữ liệu và một con trỏ tới nút kế tiếp"
            },
            {
              "text": "Data and an index of the current node|||Dữ liệu và chỉ số của nút hiện tại"
            },
            {
              "text": "Data and the next node's value|||Dữ liệu và giá trị của nút kế tiếp"
            },
            {
              "text": "Data and the size of the list|||Dữ liệu và kích thước của danh sách"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Each linked-list node has <b>data</b> and a <b>pointer to the next node</b> — the two fundamental parts.</div><div class=\"ml-vi\">Mỗi nút danh sách liên kết có <b>dữ liệu</b> và một <b>con trỏ tới nút kế tiếp</b> — hai phần cơ bản.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is Queue used for?|||Hàng đợi (Queue) dùng để làm gì?",
          "options": [
            {
              "text": "Keep the same order|||Giữ nguyên thứ tự"
            },
            {
              "text": "Reverse the order of elements|||Đảo ngược thứ tự các phần tử"
            },
            {
              "text": "Random elements|||Ngẫu nhiên hoá phần tử"
            },
            {
              "text": "Sort the elements|||Sắp xếp các phần tử"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A queue is FIFO, so it preserves (<b>keeps the same</b>) arrival order, unlike a stack which reverses order.</div><div class=\"ml-vi\">Hàng đợi hoạt động FIFO, nên nó <b>giữ nguyên</b> thứ tự đến, khác với ngăn xếp vốn đảo ngược thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What components make up an element in a linked list?|||Các thành phần cấu tạo nên một phần tử trong danh sách liên kết là gì?",
          "options": [
            {
              "text": "Data value and the address of the next element|||Giá trị dữ liệu và địa chỉ của phần tử kế tiếp"
            },
            {
              "text": "Data value and the index of the element|||Giá trị dữ liệu và chỉ số của phần tử"
            },
            {
              "text": "Index of the previous and next element|||Chỉ số của phần tử trước và sau"
            },
            {
              "text": "Only the data value|||Chỉ giá trị dữ liệu"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An element (node) consists of a <b>data value</b> and the <b>address of the next element</b>.</div><div class=\"ml-vi\">Một phần tử (nút) gồm <b>giá trị dữ liệu</b> và <b>địa chỉ của phần tử kế tiếp</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To un-set (force to 0) all the bits of a bit pattern, we _____|||Để ép tất cả các bit của một chuỗi bit về 0, ta _____",
          "options": [
            {
              "text": "make a mask of all 0s and then AND the bit pattern and the mask.|||Tạo một mặt nạ toàn 0 rồi AND chuỗi bit với mặt nạ."
            },
            {
              "text": "make a mask exactly the same as the bit pattern and then XOR the bit pattern and the mask.|||Tạo một mặt nạ giống hệt chuỗi bit rồi XOR chuỗi bit với mặt nạ."
            },
            {
              "text": "Both a and b are correct|||Cả a và b đều đúng"
            },
            {
              "text": "Both a and b are incorrect|||Cả a và b đều sai"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">ANDing with all-0s always yields all 0s (a), and XORing a pattern with itself also always yields all 0s (b) — <b>both methods work</b>.</div><div class=\"ml-vi\">AND với toàn 0 luôn cho ra toàn 0 (a), và XOR một chuỗi với chính nó cũng luôn cho ra toàn 0 (b) — <b>cả hai cách đều đúng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the True-Color (RGB) model for encoding pixels in digital image storage, where the color Red is represented by the tuple (255, 0, 0), determine the RGB encoding for the color White.|||Trong mô hình True-Color (RGB) mã hoá điểm ảnh, màu Đỏ được biểu diễn bằng bộ ba (255, 0, 0). Xác định mã RGB cho màu Trắng.",
          "options": [
            {
              "text": "(0, 0, 0)|||(0, 0, 0)"
            },
            {
              "text": "(255, 255, 255)|||(255, 255, 255)"
            },
            {
              "text": "(0, 255, 0)|||(0, 255, 0)"
            },
            {
              "text": "(0, 0, 255)|||(0, 0, 255)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">White is the maximum intensity of all three channels combined: <b>(255, 255, 255)</b>; (0,0,0) is black.</div><div class=\"ml-vi\">Trắng là cường độ tối đa của cả ba kênh màu cộng lại: <b>(255, 255, 255)</b>; (0,0,0) là đen.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If you want to store the decimal number 15 in an 8-bit unsigned integer, what is the binary representation?|||Nếu muốn lưu số thập phân 15 vào một số nguyên không dấu 8-bit, biểu diễn nhị phân là gì?",
          "options": [
            {
              "text": "00001111|||00001111"
            },
            {
              "text": "00001110|||00001110"
            },
            {
              "text": "11110000|||11110000"
            },
            {
              "text": "11111111|||11111111"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">15 = 8+4+2+1 = <b>00001111</b> in 8-bit binary.</div><div class=\"ml-vi\">15 = 8+4+2+1 = <b>00001111</b> ở dạng nhị phân 8-bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is equivalent to the 8-bit two's complement representation of -31?|||Cách biểu diễn nào sau đây tương đương với số bù hai 8-bit của -31?",
          "options": [
            {
              "text": "(0001 1111)2|||(0001 1111)2"
            },
            {
              "text": "(301)8|||(301)8"
            },
            {
              "text": "(E1)16|||(E1)16"
            },
            {
              "text": "(32)10|||(32)10"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">31 = 0001&thinsp;1111; invert = 1110&thinsp;0000; +1 = 1110&thinsp;0001 = <b>0xE1</b>, i.e. <b>(E1)16</b>.</div><div class=\"ml-vi\">31 = 0001&thinsp;1111; đảo bit = 1110&thinsp;0000; +1 = 1110&thinsp;0001 = <b>0xE1</b>, tức <b>(E1)16</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "According to operator precedence, which operation is performed first in the expression (A OR B) AND C?|||Theo thứ tự ưu tiên toán tử, phép toán nào được thực hiện trước trong biểu thức (A OR B) AND C?",
          "options": [
            {
              "text": "OR, then AND|||OR, rồi AND"
            },
            {
              "text": "AND, then OR|||AND, rồi OR"
            },
            {
              "text": "Both at the same time|||Cả hai cùng lúc"
            },
            {
              "text": "Depends on the hardware|||Tuỳ vào phần cứng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Parentheses are evaluated first, so <b>OR</b> (inside the parens) happens before <b>AND</b>.</div><div class=\"ml-vi\">Biểu thức trong ngoặc được tính trước, nên <b>OR</b> (trong ngoặc) được thực hiện trước <b>AND</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How is the letter 'A' stored using ASCII in a computer?|||Chữ 'A' được lưu bằng ASCII trong máy tính như thế nào?",
          "options": [
            {
              "text": "As a 7-bit pattern 1000001.|||Dưới dạng chuỗi 7-bit 1000001."
            },
            {
              "text": "As an 8-bit pattern 01000001.|||Dưới dạng chuỗi 8-bit 01000001."
            },
            {
              "text": "As a 16-bit Unicode pattern.|||Dưới dạng chuỗi Unicode 16-bit."
            },
            {
              "text": "As a 32-bit graphical symbol.|||Dưới dạng ký hiệu đồ hoạ 32-bit."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Standard ASCII is a <b>7-bit</b> code; 'A' = decimal 65 = binary <b>1000001</b>.</div><div class=\"ml-vi\">ASCII chuẩn là mã <b>7-bit</b>; 'A' = 65 thập phân = nhị phân <b>1000001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the range of decimal numbers that can be stored in a 4-bit memory location using two's complement signed integer representation?|||Khoảng giá trị thập phân có thể lưu trong ô nhớ 4-bit dùng biểu diễn số nguyên có dấu bù hai là gì?",
          "options": [
            {
              "text": "0 to 15|||0 đến 15"
            },
            {
              "text": "-7 to +7|||-7 đến +7"
            },
            {
              "text": "-8 to +7|||-8 đến +7"
            },
            {
              "text": "-15 to +15|||-15 đến +15"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">n-bit two's complement covers -2^(n-1) to 2^(n-1)-1; for n=4: <b>-8 to +7</b>.</div><div class=\"ml-vi\">Bù hai n bit biểu diễn từ -2^(n-1) đến 2^(n-1)-1; với n=4: <b>-8 đến +7</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many ethical principles are there?|||Có bao nhiêu học thuyết đạo đức?",
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
              "text": "5|||5"
            },
            {
              "text": "1|||1"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">This course covers <b>3</b> ethical principles/theories: moral rules, social contract, and utilization (utilitarianism).</div><div class=\"ml-vi\">Môn học này đề cập <b>3</b> học thuyết/nguyên tắc đạo đức: quy tắc đạo đức, khế ước xã hội, và chủ nghĩa vị lợi (utilization).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cipher replaces each letter with another based on a fixed rule?|||Loại mật mã nào thay thế mỗi chữ cái bằng một chữ khác theo một quy tắc cố định?",
          "options": [
            {
              "text": "Substitution cipher|||Mật mã thay thế (substitution)"
            },
            {
              "text": "Transposition cipher|||Mật mã hoán vị (transposition)"
            },
            {
              "text": "Stream cipher|||Mật mã dòng (stream)"
            },
            {
              "text": "Block cipher|||Mật mã khối (block)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>substitution cipher</b> replaces each letter with another according to a fixed rule (e.g. Caesar cipher); a transposition cipher instead rearranges letter positions.</div><div class=\"ml-vi\"><b>Mật mã thay thế</b> thay mỗi chữ cái bằng chữ khác theo quy tắc cố định (VD mật mã Caesar); mật mã hoán vị lại sắp xếp lại vị trí chữ cái.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which ethical principle states that an act is ethical if it brings about a good result for society?|||Học thuyết đạo đức nào nói rằng một hành động có đạo đức nếu nó mang lại kết quả tốt cho xã hội?",
          "options": [
            {
              "text": "Moral rules.|||Quy tắc đạo đức."
            },
            {
              "text": "Social contract.|||Khế ước xã hội."
            },
            {
              "text": "Utilization|||Chủ nghĩa vị lợi (utilization)"
            },
            {
              "text": "Intellectual property|||Sở hữu trí tuệ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Utilization</b> (utilitarianism): an act is ethical if it produces a good/beneficial outcome for society as a whole.</div><div class=\"ml-vi\"><b>Chủ nghĩa vị lợi (utilization)</b>: một hành động có đạo đức nếu nó mang lại kết quả tốt/có lợi cho toàn xã hội.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following ethical principles states that an act is ethical if it is in accordance with a universally accepted principle of morality?|||Học thuyết đạo đức nào nói rằng một hành động có đạo đức nếu nó tuân theo một nguyên tắc đạo đức được chấp nhận phổ quát?",
          "options": [
            {
              "text": "Moral rules|||Quy tắc đạo đức"
            },
            {
              "text": "Utilization|||Chủ nghĩa vị lợi"
            },
            {
              "text": "Social contract|||Khế ước xã hội"
            },
            {
              "text": "None of the other options are correct|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Moral rules</b> (deontology): an act is ethical if it conforms to a universally accepted moral rule/duty, regardless of its outcome.</div><div class=\"ml-vi\"><b>Quy tắc đạo đức</b> (nghĩa vụ luận): một hành động có đạo đức nếu nó tuân theo một quy tắc/nghĩa vụ đạo đức được chấp nhận phổ quát, bất kể kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ means protecting a message from being modified.|||_____ nghĩa là bảo vệ một thông điệp khỏi bị sửa đổi.",
          "options": [
            {
              "text": "confidentiality|||Tính bí mật (confidentiality)"
            },
            {
              "text": "integrity|||Tính toàn vẹn (integrity)"
            },
            {
              "text": "availability|||Tính sẵn sàng (availability)"
            },
            {
              "text": "None of these above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Integrity</b> means ensuring a message is not modified/tampered with; confidentiality protects against unauthorized reading, availability against denial of access.</div><div class=\"ml-vi\"><b>Tính toàn vẹn</b> nghĩa là đảm bảo thông điệp không bị sửa đổi/can thiệp; tính bí mật bảo vệ khỏi việc đọc trái phép, tính sẵn sàng bảo vệ khỏi bị từ chối truy cập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the earliest form of programming language?|||Dạng ngôn ngữ lập trình sớm nhất là gì?",
          "options": [
            {
              "text": "Machine Language|||Ngôn ngữ máy"
            },
            {
              "text": "High-Level Language|||Ngôn ngữ bậc cao"
            },
            {
              "text": "Assembly Language|||Hợp ngữ (assembly)"
            },
            {
              "text": "Symbolic Language|||Ngôn ngữ ký hiệu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Machine language</b> (raw binary instructions) is the earliest and most fundamental form, executed directly by hardware.</div><div class=\"ml-vi\"><b>Ngôn ngữ máy</b> (lệnh nhị phân thô) là dạng sớm nhất và cơ bản nhất, được phần cứng thực thi trực tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a computer language paradigm?|||Đâu KHÔNG phải là một mô hình ngôn ngữ máy tính?",
          "options": [
            {
              "text": "Procedural|||Thủ tục"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            },
            {
              "text": "Functional|||Hàm"
            },
            {
              "text": "Declarative|||Khai báo"
            },
            {
              "text": "Mathematical|||Toán học"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Procedural, object-oriented, functional and declarative are all standard programming paradigms; \"<b>Mathematical</b>\" is not a recognized language paradigm category.</div><div class=\"ml-vi\">Thủ tục, hướng đối tượng, hàm và khai báo đều là các mô hình lập trình chuẩn; \"<b>Toán học</b>\" không phải một phạm trù mô hình ngôn ngữ được công nhận.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which style of programming is the software viewed as an entity that initiates actions and controls other entities that remain inactive unless acted upon?|||Trong phong cách lập trình nào, phần mềm được xem là một thực thể chủ động khởi xướng hành động và điều khiển các thực thể khác vốn thụ động trừ khi bị tác động?",
          "options": [
            {
              "text": "Procedural paradigm|||Mô hình thủ tục"
            },
            {
              "text": "Object-oriented paradigm|||Mô hình hướng đối tượng"
            },
            {
              "text": "Functional paradigm|||Mô hình hàm"
            },
            {
              "text": "Declarative paradigm|||Mô hình khai báo"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This describes the <b>procedural paradigm</b>: the program (active agent) initiates and controls actions on passive data objects.</div><div class=\"ml-vi\">Đây là mô tả của <b>mô hình thủ tục</b>: chương trình (tác nhân chủ động) khởi xướng và điều khiển hành động trên các đối tượng dữ liệu thụ động.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the \"procedural paradigm,\" how is a program primarily structured?|||Trong \"mô hình thủ tục,\" chương trình được cấu trúc chủ yếu như thế nào?",
          "options": [
            {
              "text": "As a collection of active objects that react to stimuli|||Là tập hợp các đối tượng chủ động phản ứng với kích thích"
            },
            {
              "text": "As a set of facts and rules to answer queries|||Là tập hợp các sự kiện và quy tắc để trả lời truy vấn"
            },
            {
              "text": "As a series of function calls where the algorithm calls itself.|||Là chuỗi lời gọi hàm nơi thuật toán tự gọi lại chính nó."
            },
            {
              "text": "As a set of procedure calls, separating procedures from passive data objects|||Là tập hợp lời gọi thủ tục, tách biệt thủ tục khỏi các đối tượng dữ liệu thụ động"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>procedural paradigm</b> structures a program as a set of procedure/function calls, keeping procedures (active) separate from the passive data they operate on.</div><div class=\"ml-vi\"><b>Mô hình thủ tục</b> cấu trúc chương trình thành tập hợp lời gọi thủ tục/hàm, giữ thủ tục (chủ động) tách biệt khỏi dữ liệu thụ động mà chúng thao tác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Computers built on the Von Neumann model divide the computer hardware into _____subsystems|||Máy tính xây dựng theo mô hình Von Neumann chia phần cứng máy tính thành _____ hệ thống con",
          "options": [
            {
              "text": "3|||3"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The classic Von Neumann architecture divides hardware into <b>5</b> subsystems: memory, ALU, control unit, input and output.</div><div class=\"ml-vi\">Kiến trúc Von Neumann kinh điển chia phần cứng thành <b>5</b> hệ thống con: bộ nhớ, ALU, bộ điều khiển, thiết bị vào và thiết bị ra.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What model is the foundation of modern computers?|||Mô hình nào là nền tảng của máy tính hiện đại?",
          "options": [
            {
              "text": "Leibnitz|||Leibnitz"
            },
            {
              "text": "von Neumann|||von Neumann"
            },
            {
              "text": "Pascal|||Pascal"
            },
            {
              "text": "Charles Babbage|||Charles Babbage"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>von Neumann</b> model (stored-program architecture) is the foundation of nearly all modern computers.</div><div class=\"ml-vi\">Mô hình <b>von Neumann</b> (kiến trúc chương trình lưu trữ) là nền tảng của hầu hết máy tính hiện đại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The second generation of computers replaced vacuum tubes with which technology, leading to smaller, more reliable, and less power-hungry machines?|||Thế hệ máy tính thứ hai thay đèn điện tử chân không bằng công nghệ nào, dẫn tới máy nhỏ hơn, tin cậy hơn, tốn ít điện hơn?",
          "options": [
            {
              "text": "Transistors|||Transistor"
            },
            {
              "text": "Microprocessors|||Vi xử lý"
            },
            {
              "text": "Integrated circuits|||Mạch tích hợp"
            },
            {
              "text": "Hard disks|||Ổ đĩa cứng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The second generation replaced vacuum tubes with <b>transistors</b> — smaller, more reliable, and far less power-hungry.</div><div class=\"ml-vi\">Thế hệ thứ hai thay đèn điện tử chân không bằng <b>transistor</b> — nhỏ hơn, tin cậy hơn, và tốn ít điện hơn nhiều.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If a memory has an address space that ranges from 0 to 4095, and each addressable location stores 1 byte, what is the total memory?|||Nếu bộ nhớ có không gian địa chỉ từ 0 đến 4095, mỗi vị trí lưu 1 byte, tổng dung lượng bộ nhớ là bao nhiêu?",
          "options": [
            {
              "text": "4 KB|||4 KB"
            },
            {
              "text": "2 KB|||2 KB"
            },
            {
              "text": "1 KB|||1 KB"
            },
            {
              "text": "6 KB|||6 KB"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Addresses 0 to 4095 = <b>4096</b> locations &times; 1 byte = 4096 bytes = <b>4 KB</b> (4096 = 4 &times; 1024).</div><div class=\"ml-vi\">Địa chỉ 0 tới 4095 = <b>4096</b> vị trí &times; 1 byte = 4096 byte = <b>4 KB</b> (4096 = 4 &times; 1024).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a memory hierarchy, which memory type has the highest access speed?|||Trong phân cấp bộ nhớ, loại bộ nhớ nào có tốc độ truy cập nhanh nhất?",
          "options": [
            {
              "text": "Cache memory|||Bộ nhớ đệm (cache)"
            },
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "Registers|||Thanh ghi (registers)"
            },
            {
              "text": "Hard disk|||Ổ đĩa cứng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Registers</b> inside the CPU have the highest access speed in the memory hierarchy, faster than cache, RAM, or disk.</div><div class=\"ml-vi\"><b>Thanh ghi</b> bên trong CPU có tốc độ truy cập nhanh nhất trong phân cấp bộ nhớ, nhanh hơn cache, RAM, hay đĩa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which component of the CPU is responsible for performing arithmetic and logical operations?|||Thành phần nào của CPU chịu trách nhiệm thực hiện các phép toán số học và logic?",
          "options": [
            {
              "text": "Control Unit|||Bộ điều khiển"
            },
            {
              "text": "Memory Unit|||Bộ nhớ"
            },
            {
              "text": "Arithmetic Logic Unit (ALU)|||ALU (Arithmetic Logic Unit)"
            },
            {
              "text": "Input/Output Unit|||Thiết bị vào/ra"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>ALU</b> (Arithmetic Logic Unit) performs all arithmetic and logical operations in the CPU.</div><div class=\"ml-vi\"><b>ALU</b> (Arithmetic Logic Unit) thực hiện mọi phép toán số học và logic trong CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In hashing there is a possibility that more than one key will hash to the same address in the file, resulting in a _____|||Trong băm, có khả năng nhiều khoá cùng băm tới cùng một địa chỉ trong tệp, gây ra một _____",
          "options": [
            {
              "text": "Duplication|||Bản sao (duplication)"
            },
            {
              "text": "Synonym|||Từ đồng nghĩa (synonym)"
            },
            {
              "text": "Hazard|||Nguy cơ (hazard)"
            },
            {
              "text": "Collision|||Va chạm (collision)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">When two or more keys hash to the same address, that event is called a <b>collision</b>; the keys involved are called synonyms.</div><div class=\"ml-vi\">Khi hai hay nhiều khoá cùng băm tới một địa chỉ, sự kiện đó gọi là <b>va chạm (collision)</b>; các khoá liên quan gọi là synonym.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which access method is best suited for retrieving records based on a key value in a file with a large number of records?|||Phương pháp truy cập nào phù hợp nhất để lấy bản ghi theo giá trị khoá trong tệp có số lượng bản ghi lớn?",
          "options": [
            {
              "text": "Sequential access|||Truy cập tuần tự"
            },
            {
              "text": "Direct access|||Truy cập trực tiếp"
            },
            {
              "text": "Indexed sequential access|||Truy cập tuần tự có chỉ mục"
            },
            {
              "text": "Hashing|||Băm (hashing)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Hashing</b> computes the record's location directly from its key, giving near O(1) retrieval regardless of how large the file is.</div><div class=\"ml-vi\"><b>Băm (hashing)</b> tính trực tiếp vị trí bản ghi từ khoá của nó, cho tốc độ truy xuất gần O(1) bất kể tệp lớn đến đâu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a \"binary file,\" how is data typically interpreted by an application program?|||Trong một \"tệp nhị phân,\" dữ liệu thường được chương trình ứng dụng diễn giải như thế nào?",
          "options": [
            {
              "text": "Always as individual characters.|||Luôn là các ký tự riêng lẻ."
            },
            {
              "text": "As plain, human-readable text.|||Là văn bản thuần, đọc được bằng mắt người."
            },
            {
              "text": "As a collection of data meaningful only if properly interpreted by the program (e.g., two bytes as one integer)|||Là tập dữ liệu chỉ có ý nghĩa nếu được chương trình diễn giải đúng (VD hai byte thành một số nguyên)"
            },
            {
              "text": "As a sorted list of alphanumeric symbols|||Là danh sách chữ-số đã sắp xếp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A binary file's bytes have <b>no inherent meaning</b> outside the program's own interpretation (e.g. two bytes might represent one 16-bit integer) — unlike text files, which are human-readable.</div><div class=\"ml-vi\">Các byte trong tệp nhị phân <b>không có ý nghĩa cố hữu</b> ngoài cách chương trình tự diễn giải (VD hai byte có thể là một số nguyên 16-bit) — khác với tệp văn bản vốn đọc được bằng mắt người.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the correct statement about User Datagram Protocol (UDP)?|||Phát biểu nào đúng về giao thức UDP (User Datagram Protocol)?",
          "options": [
            {
              "text": "UDP is preferred when time constraints matter.|||UDP được ưa dùng khi ràng buộc thời gian quan trọng."
            },
            {
              "text": "UDP is a reliable protocol that is robust to DDOS attacks.|||UDP là giao thức tin cậy, chống được tấn công DDOS."
            },
            {
              "text": "UDP can handle failure messages with high reliability.|||UDP xử lý thông báo lỗi với độ tin cậy cao."
            },
            {
              "text": "UDP suffers from latency phenomena since it uses long data frames.|||UDP bị hiện tượng trễ vì dùng khung dữ liệu dài."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>UDP</b> has no handshake/acknowledgment overhead, making it faster and preferred when <b>time constraints</b> (low latency) matter more than guaranteed delivery (e.g. video streaming, gaming).</div><div class=\"ml-vi\"><b>UDP</b> không có chi phí bắt tay/xác nhận, nên nhanh hơn và được ưa dùng khi <b>ràng buộc thời gian</b> (độ trễ thấp) quan trọng hơn việc đảm bảo gửi tới (VD streaming video, game).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a key feature provided by TCP that UDP does not inherently offer?|||Đặc tính nào sau đây là điểm chính TCP cung cấp mà UDP vốn không có?",
          "options": [
            {
              "text": "Multicasting capabilities|||Khả năng multicast"
            },
            {
              "text": "Reliable data transfer|||Truyền dữ liệu tin cậy"
            },
            {
              "text": "Fixed header size|||Kích thước header cố định"
            },
            {
              "text": "None of the above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>TCP</b> guarantees <b>reliable data transfer</b> (acknowledgments, retransmission, ordering); UDP offers none of that by design, trading reliability for speed.</div><div class=\"ml-vi\"><b>TCP</b> đảm bảo <b>truyền dữ liệu tin cậy</b> (xác nhận, truyền lại, đúng thứ tự); UDP vốn không có những cơ chế đó, đánh đổi độ tin cậy lấy tốc độ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which layer of the TCP/IP model is responsible for logical addressing and routing of packets between different networks?|||Tầng nào trong mô hình TCP/IP chịu trách nhiệm định địa chỉ logic và định tuyến gói tin giữa các mạng khác nhau?",
          "options": [
            {
              "text": "Network Access Layer|||Tầng truy cập mạng"
            },
            {
              "text": "Transport Layer|||Tầng vận chuyển"
            },
            {
              "text": "Internet Layer|||Tầng Internet"
            },
            {
              "text": "Application Layer|||Tầng ứng dụng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>Internet layer</b> (network layer) handles logical (IP) addressing and routing packets across different networks.</div><div class=\"ml-vi\"><b>Tầng Internet</b> (tầng mạng) xử lý định địa chỉ logic (IP) và định tuyến gói tin qua các mạng khác nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The network layer is responsible for?|||Tầng mạng chịu trách nhiệm cho việc gì?",
          "options": [
            {
              "text": "Host-to-host delivery|||Truyền từ máy chủ tới máy chủ"
            },
            {
              "text": "Application-to-application communication|||Giao tiếp ứng dụng-tới-ứng dụng"
            },
            {
              "text": "Process-to-process communication|||Giao tiếp tiến trình-tới-tiến trình"
            },
            {
              "text": "Physical transmission|||Truyền vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>network layer</b> delivers packets from source host to destination <b>host-to-host</b>; process-to-process is the transport layer's job.</div><div class=\"ml-vi\"><b>Tầng mạng</b> truyền gói tin từ máy nguồn tới máy đích, tức <b>máy-tới-máy (host-to-host)</b>; tiến trình-tới-tiến trình là việc của tầng vận chuyển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cryptographic protocol forms the foundation of HTTPS for secure communication over the internet?|||Giao thức mật mã nào là nền tảng của HTTPS để giao tiếp an toàn qua internet?",
          "options": [
            {
              "text": "RSA|||RSA"
            },
            {
              "text": "SSL/TLS|||SSL/TLS"
            },
            {
              "text": "AES|||AES"
            },
            {
              "text": "SHA-256|||SHA-256"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>SSL/TLS</b> is the protocol layer that HTTPS is built on, providing encrypted, authenticated communication (RSA/AES/SHA are algorithms used within it).</div><div class=\"ml-vi\"><b>SSL/TLS</b> là tầng giao thức mà HTTPS được xây dựng trên đó, cung cấp giao tiếp mã hoá, có xác thực (RSA/AES/SHA là các thuật toán được dùng bên trong nó).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Router is operating at ______ layer in the TCP/IP protocol suite|||Router hoạt động ở tầng ______ trong bộ giao thức TCP/IP",
          "options": [
            {
              "text": "Transport|||Vận chuyển"
            },
            {
              "text": "Network|||Mạng"
            },
            {
              "text": "Data link|||Liên kết dữ liệu"
            },
            {
              "text": "Physical|||Vật lý"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>router</b> makes forwarding decisions based on IP addresses, operating at the <b>network</b> layer.</div><div class=\"ml-vi\"><b>Router</b> đưa ra quyết định chuyển tiếp dựa trên địa chỉ IP, hoạt động ở tầng <b>mạng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert the binary number 1011011011 to decimal.|||Đổi số nhị phân 1011011011 sang thập phân.",
          "options": [
            {
              "text": "721|||721"
            },
            {
              "text": "731|||731"
            },
            {
              "text": "739|||739"
            },
            {
              "text": "743|||743"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">1011011011&#8322; = 512+128+64+16+8+2+1 = <b>731</b>.</div><div class=\"ml-vi\">1011011011&#8322; = 512+128+64+16+8+2+1 = <b>731</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the octal system, the base is:|||Trong hệ bát phân, cơ số là:",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>octal</b> system has base <b>8</b> (digits 0-7).</div><div class=\"ml-vi\">Hệ <b>bát phân</b> có cơ số <b>8</b> (chữ số 0-7).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the hexadecimal representation of the decimal number 234?|||Biểu diễn thập lục phân của số thập phân 234 là gì?",
          "options": [
            {
              "text": "EF|||EF"
            },
            {
              "text": "AE|||AE"
            },
            {
              "text": "EA|||EA"
            },
            {
              "text": "AA|||AA"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">234 = 14&times;16 + 10; 14=E, 10=A &rarr; <b>EA</b>.</div><div class=\"ml-vi\">234 = 14&times;16 + 10; 14=E, 10=A &rarr; <b>EA</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If a byte represents a binary number, how many different values can it represent?|||Nếu một byte biểu diễn một số nhị phân, nó có thể biểu diễn được bao nhiêu giá trị khác nhau?",
          "options": [
            {
              "text": "64|||64"
            },
            {
              "text": "128|||128"
            },
            {
              "text": "256|||256"
            },
            {
              "text": "512|||512"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A byte is 8 bits, so it can represent 2^8 = <b>256</b> different values.</div><div class=\"ml-vi\">Một byte là 8 bit, nên có thể biểu diễn 2^8 = <b>256</b> giá trị khác nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of memory is generally faster than main memory but slower than CPU registers, and is placed between them?|||Loại bộ nhớ nào thường nhanh hơn bộ nhớ chính nhưng chậm hơn thanh ghi CPU, và được đặt giữa chúng?",
          "options": [
            {
              "text": "Read Only Memory (ROM)|||ROM"
            },
            {
              "text": "Dynamic Random Access Memory (DRAM)|||DRAM"
            },
            {
              "text": "Cache Memory|||Bộ nhớ đệm (cache)"
            },
            {
              "text": "Electrically Erasable Programmable Read-Only Memory (EEPROM)|||EEPROM"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Cache memory</b> sits between registers (fastest) and main memory (slower), bridging the speed gap.</div><div class=\"ml-vi\"><b>Bộ nhớ đệm (cache)</b> nằm giữa thanh ghi (nhanh nhất) và bộ nhớ chính (chậm hơn), bắc cầu khoảng cách tốc độ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of device management, what does \"policies for accessing input/output devices\" refer to?|||Trong quản lý thiết bị, \"chính sách truy cập thiết bị vào/ra\" đề cập tới điều gì?",
          "options": [
            {
              "text": "Rules for assigning devices to processes|||Quy tắc cấp phát thiết bị cho các tiến trình"
            },
            {
              "text": "Strategies for repairing malfunctioning devices|||Chiến lược sửa chữa thiết bị hỏng"
            },
            {
              "text": "Methods for tracking device temperature|||Phương pháp theo dõi nhiệt độ thiết bị"
            },
            {
              "text": "Techniques for managing CPU resources|||Kỹ thuật quản lý tài nguyên CPU"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Device-access policies are the OS's <b>rules for assigning devices to processes</b> (who gets the device, in what order, exclusive or shared).</div><div class=\"ml-vi\">Chính sách truy cập thiết bị là <b>quy tắc của hệ điều hành để cấp phát thiết bị cho các tiến trình</b> (ai được dùng, theo thứ tự nào, độc quyền hay chia sẻ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What happens when a program finishes running in a monoprogramming environment?|||Điều gì xảy ra khi một chương trình chạy xong trong môi trường đơn chương trình (monoprogramming)?",
          "options": [
            {
              "text": "The program's memory space is reallocated to another program.|||Không gian bộ nhớ của chương trình được cấp lại cho chương trình khác."
            },
            {
              "text": "The program remains in memory indefinitely.|||Chương trình vẫn ở trong bộ nhớ vô thời hạn."
            },
            {
              "text": "The operating system's memory space is expanded.|||Không gian bộ nhớ của hệ điều hành được mở rộng."
            },
            {
              "text": "A new memory module is added to accommodate more programs.|||Một module bộ nhớ mới được thêm vào để chứa thêm chương trình."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In monoprogramming only one user program runs at a time; when it finishes, its <b>memory space becomes free and is reallocated</b> to the next program to be loaded.</div><div class=\"ml-vi\">Trong đơn chương trình chỉ một chương trình người dùng chạy tại một thời điểm; khi nó chạy xong, <b>không gian bộ nhớ của nó được giải phóng và cấp lại</b> cho chương trình tiếp theo được nạp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Multi-programming requires a ________ operating-system.|||Đa chương trình (multi-programming) yêu cầu một hệ điều hành ________.",
          "options": [
            {
              "text": "batch|||theo lô (batch)"
            },
            {
              "text": "Time-sharing|||chia sẻ thời gian (time-sharing)"
            },
            {
              "text": "parallel|||song song"
            },
            {
              "text": "distributed|||phân tán"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Multiprogramming historically originated with <b>batch</b> operating systems — keeping several jobs in memory to keep the CPU busy while one waits on I/O.</div><div class=\"ml-vi\">Đa chương trình về lịch sử bắt nguồn từ hệ điều hành <b>theo lô (batch)</b> — giữ nhiều công việc trong bộ nhớ để CPU luôn bận trong khi một công việc chờ I/O.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the two major design goals of an operating system?|||Hai mục tiêu thiết kế chính của hệ điều hành là gì?",
          "options": [
            {
              "text": "Efficient hardware use and ease of resource use.|||Sử dụng phần cứng hiệu quả và dễ dàng sử dụng tài nguyên."
            },
            {
              "text": "Data compression and user authentication.|||Nén dữ liệu và xác thực người dùng."
            },
            {
              "text": "High-speed processing and minimal memory use.|||Xử lý tốc độ cao và dùng ít bộ nhớ."
            },
            {
              "text": "Application development and network connectivity.|||Phát triển ứng dụng và kết nối mạng."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The two classic OS design goals are <b>efficiency</b> (making the best use of hardware resources) and <b>convenience/ease of use</b> for the user — as taught in standard OS textbooks.</div><div class=\"ml-vi\">Hai mục tiêu thiết kế kinh điển của hệ điều hành là <b>hiệu quả</b> (tận dụng tốt nhất tài nguyên phần cứng) và <b>sự tiện lợi/dễ dùng</b> cho người dùng — theo giáo trình hệ điều hành chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which category of software includes programs like word processors, web browsers, and video editing software?|||Danh mục phần mềm nào bao gồm trình soạn thảo văn bản, trình duyệt web, và phần mềm dựng phim?",
          "options": [
            {
              "text": "Application programs|||Chương trình ứng dụng"
            },
            {
              "text": "Operating system|||Hệ điều hành"
            },
            {
              "text": "System utilities|||Tiện ích hệ thống"
            },
            {
              "text": "Firmware|||Firmware"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Word processors, browsers and video editors are all <b>application programs</b> — software that helps users perform specific tasks, as opposed to system software (OS, utilities, firmware).</div><div class=\"ml-vi\">Trình soạn thảo văn bản, trình duyệt và phần mềm dựng phim đều là <b>chương trình ứng dụng</b> — phần mềm giúp người dùng thực hiện tác vụ cụ thể, khác với phần mềm hệ thống (OS, tiện ích, firmware).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D7",
      "source": "REAL",
      "sortOrder": 6,
      "title": "Đề 7 — SP26 Retake Exam (CSI106)|||Đề 7 — Thi lại SP26 (CSI106)",
      "description": "CSI104 real FE multiple-choice paper (Spring 2026 Retake), transcribed from the exam images. 2 of the 61 scanned images were duplicate captures of question 1, leaving 59 unique questions; 1 authored question on the same syllabus (DBMS advantages) was added to complete 60. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2026, Thi lại), chép từ ảnh đề. 2 trong 61 ảnh quét là bản chụp trùng của câu 1, chỉ còn 59 câu duy nhất; đã thêm 1 câu tự soạn cùng giáo trình (ưu điểm DBMS) để đủ 60 câu. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary outcome of the \"analysis phase\" in software development?|||Kết quả chính của \"giai đoạn phân tích\" trong phát triển phần mềm là gì?",
          "options": [
            {
              "text": "The completed code for the software.|||Mã hoàn chỉnh của phần mềm."
            },
            {
              "text": "A specification document outlining what the software will do, not how|||Một tài liệu đặc tả nêu rõ phần mềm sẽ làm GÌ, không phải LÀM THẾ NÀO"
            },
            {
              "text": "A detailed architecture diagram of the system|||Sơ đồ kiến trúc chi tiết của hệ thống"
            },
            {
              "text": "A plan for software testing and deployment|||Một kế hoạch kiểm thử và triển khai phần mềm"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The analysis phase produces a <b>specification document</b> describing WHAT the software must do (requirements), leaving HOW (design/architecture) for later phases.</div><div class=\"ml-vi\">Giai đoạn phân tích tạo ra một <b>tài liệu đặc tả</b> mô tả phần mềm phải làm GÌ (yêu cầu), để lại phần LÀM THẾ NÀO (thiết kế/kiến trúc) cho các giai đoạn sau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which testing technique focuses on identifying defects and vulnerabilities of the software by examining its internal structure, code, and logic?|||Kỹ thuật kiểm thử nào tập trung phát hiện lỗi và lỗ hổng bằng cách xem xét cấu trúc nội bộ, mã và logic của phần mềm?",
          "options": [
            {
              "text": "Black-box testing|||Kiểm thử hộp đen"
            },
            {
              "text": "Integration testing|||Kiểm thử tích hợp"
            },
            {
              "text": "White-box testing|||Kiểm thử hộp trắng"
            },
            {
              "text": "User acceptance testing|||Kiểm thử chấp nhận người dùng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>White-box testing</b> examines the internal code structure and logic, unlike black-box testing which only checks external behavior.</div><div class=\"ml-vi\"><b>Kiểm thử hộp trắng</b> xem xét cấu trúc mã và logic nội bộ, khác với kiểm thử hộp đen chỉ kiểm tra hành vi bên ngoài.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In software development, how would you explain the concept of coupling?|||Trong phát triển phần mềm, bạn giải thích khái niệm coupling như thế nào?",
          "options": [
            {
              "text": "The degree of dependency between modules.|||Mức độ phụ thuộc giữa các mô-đun."
            },
            {
              "text": "The number of lines of code in a module.|||Số dòng mã trong một mô-đun."
            },
            {
              "text": "The speed of program execution.|||Tốc độ thực thi chương trình."
            },
            {
              "text": "The total number of coupled modules in a system.|||Tổng số mô-đun bị kết dính trong hệ thống."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Coupling</b> is the degree of dependency between different modules; lower coupling means modules can change independently.</div><div class=\"ml-vi\"><b>Coupling</b> là mức độ phụ thuộc giữa các mô-đun khác nhau; coupling thấp nghĩa là các mô-đun có thể thay đổi độc lập với nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The development process in the software lifecycle involves_____|||Quy trình phát triển trong vòng đời phần mềm bao gồm_____",
          "options": [
            {
              "text": "2 phases: implementation and testing|||2 giai đoạn: cài đặt và kiểm thử"
            },
            {
              "text": "3 phases: design, implementation and testing|||3 giai đoạn: thiết kế, cài đặt và kiểm thử"
            },
            {
              "text": "4 phases: analysis, design, implementation and testing|||4 giai đoạn: phân tích, thiết kế, cài đặt và kiểm thử"
            },
            {
              "text": "5 phases: planning, analysis, design, implementation and testing|||5 giai đoạn: lập kế hoạch, phân tích, thiết kế, cài đặt và kiểm thử"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The most complete listing taught in this course is the <b>5-phase</b> lifecycle: planning, analysis, design, implementation and testing.</div><div class=\"ml-vi\">Cách liệt kê đầy đủ nhất được dạy trong môn học là vòng đời <b>5 giai đoạn</b>: lập kế hoạch, phân tích, thiết kế, cài đặt và kiểm thử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What describes the hierarchical model?|||Điều gì mô tả mô hình phân cấp?",
          "options": [
            {
              "text": "Data is organized as a binary tree and each entity can have several children|||Dữ liệu tổ chức thành cây nhị phân, mỗi thực thể có thể có nhiều con"
            },
            {
              "text": "Data is organized as a binary tree and each entity have only one children|||Dữ liệu tổ chức thành cây nhị phân, mỗi thực thể chỉ có một con"
            },
            {
              "text": "Data is organized as an inverted tree and each entity can have several children|||Dữ liệu tổ chức thành cây lộn ngược, mỗi thực thể có thể có nhiều con"
            },
            {
              "text": "Data is organized as an inverted tree and each entity have only one child|||Dữ liệu tổ chức thành cây lộn ngược, mỗi thực thể chỉ có một con"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>hierarchical model</b> organizes data as an inverted tree where each entity (parent) can have <b>several children</b> — not restricted to binary (max 2) like a binary tree.</div><div class=\"ml-vi\"><b>Mô hình phân cấp</b> tổ chức dữ liệu thành cây lộn ngược, mỗi thực thể (cha) có thể có <b>nhiều con</b> — không giới hạn tối đa 2 như cây nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a key restriction for performing a UNION operation between two relations in SQL?|||Ràng buộc chính để thực hiện phép UNION giữa hai quan hệ trong SQL là gì?",
          "options": [
            {
              "text": "They must have different primary keys|||Chúng phải có khoá chính khác nhau"
            },
            {
              "text": "They must be sorted in the same order|||Chúng phải được sắp xếp cùng thứ tự"
            },
            {
              "text": "They must have the same attributes (columns).|||Chúng phải có cùng thuộc tính (cột)."
            },
            {
              "text": "They must contain unique data|||Chúng phải chứa dữ liệu duy nhất"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>UNION</b> requires both relations to have the <b>same attributes/columns</b> (union-compatible) — same number and matching data types, in order to combine rows meaningfully.</div><div class=\"ml-vi\"><b>UNION</b> yêu cầu cả hai quan hệ phải có <b>cùng thuộc tính/cột</b> (tương thích hợp) — cùng số lượng và kiểu dữ liệu khớp nhau, để gộp các dòng một cách có ý nghĩa.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is true about organizing relational data storage?|||Điều nào đúng về việc tổ chức lưu trữ dữ liệu quan hệ?",
          "options": [
            {
              "text": "The physical storage of the data is independent of the way in which the data is logically organized|||Lưu trữ vật lý của dữ liệu độc lập với cách dữ liệu được tổ chức logic"
            },
            {
              "text": "The abstract storage of the data is independent of the way in which the data is logically organized|||Lưu trữ trừu tượng của dữ liệu độc lập với cách dữ liệu được tổ chức logic"
            },
            {
              "text": "The logical storage of the data is independent of the way in which the data is logically organized|||Lưu trữ logic của dữ liệu độc lập với cách dữ liệu được tổ chức logic"
            },
            {
              "text": "The virtual storage of the data is independent of the way in which the data is logically organized|||Lưu trữ ảo của dữ liệu độc lập với cách dữ liệu được tổ chức logic"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the principle of <b>physical data independence</b>: how data is physically stored on disk can change without affecting its logical (relational) organization seen by users.</div><div class=\"ml-vi\">Đây là nguyên lý <b>độc lập dữ liệu vật lý</b>: cách dữ liệu được lưu trữ vật lý trên đĩa có thể thay đổi mà không ảnh hưởng tới cách tổ chức logic (quan hệ) mà người dùng thấy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are some geometric shapes that an entity-relationship (E-R) diagram uses?|||Sơ đồ E-R sử dụng những hình học nào?",
          "options": [
            {
              "text": "Rectangles, circles, diamonds, lines|||Hình chữ nhật, hình tròn, hình thoi, đường thẳng"
            },
            {
              "text": "Rectangles, ellipses, diamonds, lines|||Hình chữ nhật, hình elip, hình thoi, đường thẳng"
            },
            {
              "text": "Squares, ellipses, diamonds, lines|||Hình vuông, hình elip, hình thoi, đường thẳng"
            },
            {
              "text": "It is up to the designer which geometry to use|||Tuỳ người thiết kế chọn hình học nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Standard E-R notation uses <b>rectangles</b> (entities), <b>ellipses</b> (attributes), <b>diamonds</b> (relationships) and <b>lines</b> (connections).</div><div class=\"ml-vi\">Ký hiệu E-R chuẩn dùng <b>hình chữ nhật</b> (thực thể), <b>hình elip</b> (thuộc tính), <b>hình thoi</b> (mối quan hệ) và <b>đường thẳng</b> (kết nối).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When manipulating relational data, which SQL command allows the user to introduce an additional row into an existing table?|||Khi thao tác dữ liệu quan hệ, lệnh SQL nào cho phép người dùng thêm một dòng mới vào bảng hiện có?",
          "options": [
            {
              "text": "Insert|||Insert"
            },
            {
              "text": "Delete|||Delete"
            },
            {
              "text": "Join|||Join"
            },
            {
              "text": "Select|||Select"
            },
            {
              "text": "Add|||Add"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>INSERT</b> adds a new row into an existing table.</div><div class=\"ml-vi\"><b>INSERT</b> thêm một dòng mới vào bảng hiện có.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A sorting algorithm where the list is divided into sorted and unsorted sublists, and the smallest element from the unsorted part is repeatedly swapped with the first element of the unsorted part is known as a:|||Thuật toán sắp xếp mà danh sách được chia thành hai phần đã sắp xếp và chưa sắp xếp, phần tử nhỏ nhất trong phần chưa sắp xếp liên tục được hoán đổi với phần tử đầu tiên của phần chưa sắp xếp, được gọi là:",
          "options": [
            {
              "text": "Bubble sort|||Sắp xếp nổi bọt (bubble sort)"
            },
            {
              "text": "Insertion sort|||Sắp xếp chèn (insertion sort)"
            },
            {
              "text": "Selection sort|||Sắp xếp chọn (selection sort)"
            },
            {
              "text": "Binary sort|||Sắp xếp nhị phân"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">This describes <b>selection sort</b> exactly: repeatedly find the smallest unsorted element and swap it to the front of the unsorted region.</div><div class=\"ml-vi\">Đây chính là mô tả của <b>sắp xếp chọn (selection sort)</b>: liên tục tìm phần tử nhỏ nhất chưa sắp xếp và hoán đổi nó lên đầu vùng chưa sắp xếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When is a \"sequential search\" typically used for a list?|||Khi nào tìm kiếm tuần tự thường được dùng cho một danh sách?",
          "options": [
            {
              "text": "For very large, sorted lists.|||Cho danh sách rất lớn, đã sắp xếp."
            },
            {
              "text": "When the list is organized hierarchically|||Khi danh sách tổ chức theo phân cấp"
            },
            {
              "text": "Only for small lists, or lists that are not searched often, and are not ordered.|||Chỉ cho danh sách nhỏ, hoặc danh sách ít được tìm kiếm, và chưa sắp xếp."
            },
            {
              "text": "When the exact position of the target is known|||Khi biết chính xác vị trí của mục tiêu"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Sequential search</b> is appropriate for small lists or lists rarely searched and not ordered — for large/sorted lists, binary search is far more efficient.</div><div class=\"ml-vi\"><b>Tìm kiếm tuần tự</b> phù hợp cho danh sách nhỏ hoặc ít được tìm kiếm và chưa sắp xếp — với danh sách lớn/đã sắp xếp, tìm kiếm nhị phân hiệu quả hơn nhiều.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the core mechanism of the \"bubble sort\" algorithm for ordering data?|||Cơ chế cốt lõi của thuật toán bubble sort để sắp xếp dữ liệu là gì?",
          "options": [
            {
              "text": "Dividing the list into two parts and inserting elements from unsorted to sorted|||Chia danh sách thành hai phần và chèn phần tử từ chưa sắp xếp vào đã sắp xếp"
            },
            {
              "text": "Finding the smallest element and swapping it to the correct position|||Tìm phần tử nhỏ nhất và hoán đổi nó vào đúng vị trí"
            },
            {
              "text": "Repeatedly comparing adjacent elements and swapping them if they are in the wrong order.|||Liên tục so sánh các phần tử liền kề và hoán đổi nếu chúng sai thứ tự."
            },
            {
              "text": "Dividing the list in half and searching|||Chia đôi danh sách và tìm kiếm"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Bubble sort</b> repeatedly compares adjacent pairs and swaps them if out of order, letting larger elements \"bubble\" to the end.</div><div class=\"ml-vi\"><b>Bubble sort</b> liên tục so sánh các cặp phần tử liền kề và hoán đổi nếu sai thứ tự, khiến phần tử lớn \"nổi bọt\" dần về cuối.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a type of transmission medium used at the physical layer?|||Đâu KHÔNG phải là loại môi trường truyền dùng ở tầng vật lý?",
          "options": [
            {
              "text": "Fiber optic cables|||Cáp quang"
            },
            {
              "text": "Coaxial cables|||Cáp đồng trục"
            },
            {
              "text": "Wi-Fi signals|||Tín hiệu Wi-Fi"
            },
            {
              "text": "UDP packets|||Gói tin UDP"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Fiber, coaxial cables and Wi-Fi are all physical transmission media; <b>UDP packets</b> are a transport-layer data unit, not a physical medium.</div><div class=\"ml-vi\">Cáp quang, cáp đồng trục và Wi-Fi đều là môi trường truyền vật lý; <b>gói tin UDP</b> là đơn vị dữ liệu tầng vận chuyển, không phải môi trường vật lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What characteristic makes a stack a \"Last In, First Out (LIFO)\" data structure?|||Đặc điểm nào khiến ngăn xếp trở thành cấu trúc \"Vào sau, Ra trước (LIFO)\"?",
          "options": [
            {
              "text": "Elements are retrieved based on their priority|||Phần tử được lấy ra dựa theo độ ưu tiên"
            },
            {
              "text": "Elements can be accessed directly by their memory address|||Phần tử có thể truy cập trực tiếp qua địa chỉ bộ nhớ"
            },
            {
              "text": "If data is inserted into a stack and then removed, the order of the data is reversed|||Nếu dữ liệu được đưa vào ngăn xếp rồi lấy ra, thứ tự dữ liệu bị đảo ngược"
            },
            {
              "text": "The oldest element is always removed first.|||Phần tử cũ nhất luôn bị lấy ra trước"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Because the <b>last</b> item pushed is the <b>first</b> popped, the retrieval order is the exact reverse of the insertion order.</div><div class=\"ml-vi\">Vì phần tử <b>đẩy vào sau cùng</b> lại là phần tử <b>lấy ra đầu tiên</b>, thứ tự lấy ra hoàn toàn ngược với thứ tự đưa vào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which data structure uses the Last In, First Out (LIFO) principle?|||Cấu trúc dữ liệu nào dùng nguyên lý Vào sau, Ra trước (LIFO)?",
          "options": [
            {
              "text": "Queue|||Hàng đợi (Queue)"
            },
            {
              "text": "Stack|||Ngăn xếp (Stack)"
            },
            {
              "text": "Linked List|||Danh sách liên kết"
            },
            {
              "text": "Binary Tree|||Cây nhị phân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>stack</b> operates on the LIFO principle.</div><div class=\"ml-vi\"><b>Ngăn xếp (Stack)</b> hoạt động theo nguyên lý LIFO.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a \"linked list\" primarily characterized by?|||Danh sách liên kết được đặc trưng chủ yếu bởi điều gì?",
          "options": [
            {
              "text": "Elements stored in contiguous memory locations|||Phần tử lưu trong các vị trí bộ nhớ liền kề"
            },
            {
              "text": "Each element containing a data part and a link (pointer) to the next element.|||Mỗi phần tử chứa một phần dữ liệu và một liên kết (con trỏ) tới phần tử kế tiếp."
            },
            {
              "text": "Direct access to any element using an integer index|||Truy cập trực tiếp bất kỳ phần tử nào bằng chỉ số nguyên"
            },
            {
              "text": "Elements always being of the same data type|||Các phần tử luôn cùng một kiểu dữ liệu"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A linked list node holds <b>data plus a pointer to the next node</b> — the defining characteristic, unlike arrays (contiguous memory, indexed access).</div><div class=\"ml-vi\">Nút của danh sách liên kết chứa <b>dữ liệu cộng với con trỏ tới nút kế tiếp</b> — đặc điểm định nghĩa, khác với mảng (bộ nhớ liền kề, truy cập theo chỉ số).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If an undirected graph has N vertices, what is the maximum number of edges it can have?|||Nếu một đồ thị vô hướng có N đỉnh, số cạnh tối đa nó có thể có là bao nhiêu?",
          "options": [
            {
              "text": "N(N-1)/2|||N(N-1)/2"
            },
            {
              "text": "N|||N"
            },
            {
              "text": "N+1|||N+1"
            },
            {
              "text": "2N|||2N"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A complete undirected graph connects every pair of vertices exactly once: C(N,2) = <b>N(N-1)/2</b> edges.</div><div class=\"ml-vi\">Đồ thị vô hướng đầy đủ nối mọi cặp đỉnh đúng một lần: C(N,2) = <b>N(N-1)/2</b> cạnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Inside the ADT (abstract data type) are two different parts of the model:|||Bên trong ADT (kiểu dữ liệu trừu tượng) có hai phần khác nhau của mô hình:",
          "options": [
            {
              "text": "Hardware and software|||Phần cứng và phần mềm"
            },
            {
              "text": "Database and operations|||Cơ sở dữ liệu và thao tác"
            },
            {
              "text": "Data structure and algorithms|||Cấu trúc dữ liệu và thuật toán"
            },
            {
              "text": "Data structure and operations|||Cấu trúc dữ liệu và thao tác"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">An ADT consists of a <b>data structure</b> and the <b>operations</b> defined on it, with implementation details hidden from the user.</div><div class=\"ml-vi\">ADT gồm một <b>cấu trúc dữ liệu</b> và các <b>thao tác</b> được định nghĩa trên nó, ẩn chi tiết hiện thực khỏi người dùng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is TRUE about an undirected graph?|||Điều nào sau đây ĐÚNG về đồ thị vô hướng?",
          "options": [
            {
              "text": "The edges have no direction|||Các cạnh không có hướng"
            },
            {
              "text": "It has one-way connections between nodes.|||Nó có kết nối một chiều giữa các nút"
            },
            {
              "text": "The edges have a specific starting and ending point|||Các cạnh có điểm bắt đầu và kết thúc cụ thể"
            },
            {
              "text": "A node only has one parent|||Một nút chỉ có một cha"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In an <b>undirected</b> graph, edges have <b>no direction</b> — they simply connect two vertices symmetrically, unlike a directed graph.</div><div class=\"ml-vi\">Trong đồ thị <b>vô hướng</b>, các cạnh <b>không có hướng</b> — chúng chỉ đơn giản nối hai đỉnh một cách đối xứng, khác với đồ thị có hướng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a 2's complement representation, what is the binary representation of -5 if 4 bits are used?|||Trong biểu diễn bù hai, biểu diễn nhị phân của -5 dùng 4 bit là gì?",
          "options": [
            {
              "text": "1011|||1011"
            },
            {
              "text": "1101|||1101"
            },
            {
              "text": "1110|||1110"
            },
            {
              "text": "1100|||1100"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">5 = 0101; invert = 1010; +1 = <b>1011</b>.</div><div class=\"ml-vi\">5 = 0101; đảo bit = 1010; +1 = <b>1011</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ is the mask to unset (clear) the four leftmost bits of the pattern 1010 0111?|||________ là mặt nạ để xoá (clear) bốn bit ngoài cùng bên trái của chuỗi 1010 0111?",
          "options": [
            {
              "text": "0000 1111|||0000 1111"
            },
            {
              "text": "1111 0000|||1111 0000"
            },
            {
              "text": "0101 1000|||0101 1000"
            },
            {
              "text": "1010 0000|||1010 0000"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">ANDing with a mask that has <b>0s in the four leftmost positions</b> (and 1s elsewhere) clears exactly those four bits: <b>0000 1111</b>.</div><div class=\"ml-vi\">AND với mặt nạ có <b>0 ở bốn vị trí ngoài cùng bên trái</b> (và 1 ở các vị trí còn lại) sẽ xoá đúng bốn bit đó: <b>0000 1111</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following best describes a unary operation?|||Điều nào mô tả đúng nhất một phép toán một ngôi (unary)?",
          "options": [
            {
              "text": "An operation involving multiple operands.|||Phép toán liên quan tới nhiều toán hạng."
            },
            {
              "text": "An operation that always results in zero.|||Phép toán luôn cho kết quả bằng 0."
            },
            {
              "text": "An operation with a single operand.|||Phép toán chỉ có một toán hạng."
            },
            {
              "text": "An operation performed on two different data types.|||Phép toán thực hiện trên hai kiểu dữ liệu khác nhau."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>unary</b> operation acts on exactly <b>one operand</b> (e.g. NOT, negation).</div><div class=\"ml-vi\">Phép toán <b>một ngôi (unary)</b> tác động trên đúng <b>một toán hạng</b> (VD NOT, phủ định).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A floating-point value after normalization is (1.1101) x 2^-7. What is the value of exponent section in the Excess-127 representation?|||Một giá trị dấu chấm động sau chuẩn hoá là (1.1101) x 2^-7. Giá trị trường số mũ trong biểu diễn Excess-127 là bao nhiêu?",
          "options": [
            {
              "text": "-7|||-7"
            },
            {
              "text": "7|||7"
            },
            {
              "text": "120|||120"
            },
            {
              "text": "134|||134"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Excess-127 stores exponent + 127: -7 + 127 = <b>120</b>.</div><div class=\"ml-vi\">Excess-127 lưu số mũ + 127: -7 + 127 = <b>120</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In two's complement representation, the leftmost bit defines the sign of the integer. If it is ________, the integer is negative.|||Trong biểu diễn bù hai, bit ngoài cùng bên trái xác định dấu của số nguyên. Nếu nó là ________, số nguyên đó âm.",
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
              "text": "2|||2"
            },
            {
              "text": "None of the other answers|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In two's complement, a leftmost (sign) bit of <b>1</b> indicates a negative number; <b>0</b> indicates non-negative.</div><div class=\"ml-vi\">Trong bù hai, bit ngoài cùng bên trái (bit dấu) là <b>1</b> chỉ số âm; <b>0</b> chỉ số không âm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following processes is NOT involved in storing audio in a computer?|||Quá trình nào sau đây KHÔNG liên quan tới việc lưu trữ âm thanh trong máy tính?",
          "options": [
            {
              "text": "Sampling|||Lấy mẫu (sampling)"
            },
            {
              "text": "Quantization|||Lượng tử hoá (quantization)"
            },
            {
              "text": "Encryption|||Mã hoá bảo mật (encryption)"
            },
            {
              "text": "Encoding|||Mã hoá (encoding)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Storing audio uses the PCM pipeline: <b>sampling, quantization, encoding</b>. <b>Encryption</b> (security) is unrelated to this digitization process.</div><div class=\"ml-vi\">Lưu trữ âm thanh dùng quy trình PCM: <b>lấy mẫu, lượng tử hoá, mã hoá</b>. <b>Mã hoá bảo mật (encryption)</b> không liên quan tới quy trình số hoá này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the two primary techniques for storing images in computers?|||Hai kỹ thuật chính để lưu trữ hình ảnh trong máy tính là gì?",
          "options": [
            {
              "text": "Raster graphics and vector graphics|||Đồ hoạ raster và đồ hoạ vector"
            },
            {
              "text": "Raster graphics and animation|||Đồ hoạ raster và hoạt hình"
            },
            {
              "text": "Vector graphics and text encoding|||Đồ hoạ vector và mã hoá văn bản"
            },
            {
              "text": "Image scanning and color depth|||Quét ảnh và độ sâu màu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Images are stored using either <b>raster (bitmap) graphics</b> (pixel grid) or <b>vector graphics</b> (mathematical shape descriptions).</div><div class=\"ml-vi\">Hình ảnh được lưu bằng <b>đồ hoạ raster (bitmap)</b> (lưới điểm ảnh) hoặc <b>đồ hoạ vector</b> (mô tả hình học bằng công thức).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "According to the social contract theory, what makes an act ethical?|||Theo thuyết khế ước xã hội, điều gì khiến một hành động có đạo đức?",
          "options": [
            {
              "text": "The act is approved by a majority of people in society|||Hành động được đa số người trong xã hội chấp thuận"
            },
            {
              "text": "The act aligns with universally accepted moral principles|||Hành động phù hợp với các nguyên tắc đạo đức được chấp nhận phổ quát"
            },
            {
              "text": "The act results in beneficial consequences for society|||Hành động mang lại hậu quả có lợi cho xã hội"
            },
            {
              "text": "The act is based on personal secrecy|||Hành động dựa trên sự bí mật cá nhân"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Social contract theory</b> holds that an act is ethical if it is approved by the collective agreement (majority) of society.</div><div class=\"ml-vi\"><b>Thuyết khế ước xã hội</b> cho rằng một hành động có đạo đức nếu được sự đồng thuận tập thể (đa số) của xã hội chấp thuận.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which security principle ensures that sensitive information is not disclosed?|||Nguyên tắc bảo mật nào đảm bảo thông tin nhạy cảm không bị tiết lộ?",
          "options": [
            {
              "text": "Confidentiality|||Tính bí mật (confidentiality)"
            },
            {
              "text": "Integrity|||Tính toàn vẹn"
            },
            {
              "text": "Availability|||Tính sẵn sàng"
            },
            {
              "text": "Authentication|||Xác thực"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Confidentiality</b> ensures sensitive information is not disclosed to unauthorized parties.</div><div class=\"ml-vi\"><b>Tính bí mật (confidentiality)</b> đảm bảo thông tin nhạy cảm không bị tiết lộ cho bên trái phép.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many types of cyber attacks exist?|||Có bao nhiêu loại tấn công mạng?",
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The basic classification taught here is <b>2</b> types: active attacks and passive attacks.</div><div class=\"ml-vi\">Cách phân loại cơ bản được dạy ở đây là <b>2</b> loại: tấn công chủ động và tấn công thụ động.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a key feature of a copyright?|||Đặc điểm chính của bản quyền (copyright) là gì?",
          "options": [
            {
              "text": "It is automatically granted with a statement.|||Nó được cấp tự động kèm một tuyên bố."
            },
            {
              "text": "It requires registration with a government agency.|||Nó cần đăng ký với cơ quan nhà nước."
            },
            {
              "text": "It protects inventions for a limited period.|||Nó bảo vệ phát minh trong thời gian giới hạn."
            },
            {
              "text": "It identifies a company's products or services.|||Nó định danh sản phẩm/dịch vụ của công ty."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Copyright</b> is granted automatically upon creation (with a copyright statement/notice), unlike patents (registration, protects inventions) or trademarks (identifies products).</div><div class=\"ml-vi\"><b>Bản quyền</b> được cấp tự động ngay khi tạo ra tác phẩm (kèm tuyên bố/ký hiệu bản quyền), khác với bằng sáng chế (cần đăng ký, bảo vệ phát minh) hay nhãn hiệu (định danh sản phẩm).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does a hash function primarily ensure?|||Hàm băm (hash function) chủ yếu đảm bảo điều gì?",
          "options": [
            {
              "text": "Integrity|||Tính toàn vẹn"
            },
            {
              "text": "Confidentiality|||Tính bí mật"
            },
            {
              "text": "Availability|||Tính sẵn sàng"
            },
            {
              "text": "Authentication|||Xác thực"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>hash function</b> produces a fingerprint of data; any change to the data changes the hash, so it primarily ensures <b>integrity</b> (detecting tampering).</div><div class=\"ml-vi\"><b>Hàm băm</b> tạo ra dấu vân tay của dữ liệu; bất kỳ thay đổi nào cũng làm đổi giá trị băm, nên nó chủ yếu đảm bảo <b>tính toàn vẹn</b> (phát hiện can thiệp).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ________ reads the source code, symbol by symbol, and creates a list of tokens in the source language.|||Một ________ đọc mã nguồn theo từng ký hiệu và tạo ra danh sách token trong ngôn ngữ nguồn.",
          "options": [
            {
              "text": "Lexical analyzer|||Bộ phân tích từ vựng (lexical analyzer)"
            },
            {
              "text": "Syntax analyzer|||Bộ phân tích cú pháp"
            },
            {
              "text": "Semantic analyzer|||Bộ phân tích ngữ nghĩa"
            },
            {
              "text": "Code generator|||Bộ sinh mã"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>lexical analyzer</b> (scanner) reads source code symbol-by-symbol and groups characters into tokens.</div><div class=\"ml-vi\"><b>Bộ phân tích từ vựng (lexical analyzer)</b> đọc mã nguồn theo từng ký hiệu và nhóm các ký tự thành token.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is not a high-level language?|||Đâu KHÔNG phải ngôn ngữ bậc cao?",
          "options": [
            {
              "text": "Ruby|||Ruby"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "Assembly|||Hợp ngữ (Assembly)"
            },
            {
              "text": "Pascal|||Pascal"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Assembly</b> is a low-level language (one step above machine code); Ruby, C and Pascal are all high-level languages.</div><div class=\"ml-vi\"><b>Hợp ngữ (Assembly)</b> là ngôn ngữ cấp thấp (chỉ trên mã máy một bậc); Ruby, C và Pascal đều là ngôn ngữ bậc cao.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What was the first type of programming language?|||Loại ngôn ngữ lập trình đầu tiên là gì?",
          "options": [
            {
              "text": "Assembly language|||Hợp ngữ"
            },
            {
              "text": "High-level language|||Ngôn ngữ bậc cao"
            },
            {
              "text": "Machine language|||Ngôn ngữ máy"
            },
            {
              "text": "Object-oriented language|||Ngôn ngữ hướng đối tượng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Machine language</b> (raw binary) was the first and most fundamental type, predating assembly and high-level languages.</div><div class=\"ml-vi\"><b>Ngôn ngữ máy</b> (nhị phân thô) là loại đầu tiên và cơ bản nhất, có trước cả hợp ngữ và ngôn ngữ bậc cao.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of these is not a loop?|||Đâu KHÔNG phải là vòng lặp?",
          "options": [
            {
              "text": "For|||For"
            },
            {
              "text": "While|||While"
            },
            {
              "text": "Switch|||Switch"
            },
            {
              "text": "Do-While|||Do-While"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Switch</b> is a selection/branching construct, not a loop; For, While and Do-While are all loop constructs.</div><div class=\"ml-vi\"><b>Switch</b> là cấu trúc rẽ nhánh/lựa chọn, không phải vòng lặp; For, While và Do-While đều là cấu trúc lặp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary function of the motherboard in a computer?|||Chức năng chính của bo mạch chủ (motherboard) trong máy tính là gì?",
          "options": [
            {
              "text": "To store data permanently|||Lưu trữ dữ liệu vĩnh viễn"
            },
            {
              "text": "To supply power to the computer|||Cung cấp nguồn điện cho máy tính"
            },
            {
              "text": "To connect all the parts of the computer together|||Kết nối tất cả các bộ phận của máy tính lại với nhau"
            },
            {
              "text": "To cool down the components|||Làm mát các linh kiện"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>motherboard</b> is the central circuit board that <b>connects all components</b> (CPU, RAM, storage, expansion cards) together.</div><div class=\"ml-vi\"><b>Bo mạch chủ</b> là bảng mạch trung tâm <b>kết nối mọi thành phần</b> (CPU, RAM, lưu trữ, card mở rộng) lại với nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "According to the Von Neumann model, which one is NOT a computer hardware subsystem?|||Theo mô hình Von Neumann, đâu KHÔNG phải là hệ thống con phần cứng máy tính?",
          "options": [
            {
              "text": "Arithmetic logic unit (ALU)|||ALU (bộ số học logic)"
            },
            {
              "text": "Input/Output (I/O)|||I/O (vào/ra)"
            },
            {
              "text": "Control unit (CU)|||CU (bộ điều khiển)"
            },
            {
              "text": "Power supply unit (PSU)|||PSU (bộ cấp nguồn)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The classic Von Neumann subsystems are memory, ALU, control unit and I/O; the <b>power supply unit</b> is not one of them (it's a supporting hardware component, not a Von Neumann subsystem).</div><div class=\"ml-vi\">Các hệ thống con Von Neumann kinh điển là bộ nhớ, ALU, bộ điều khiển và I/O; <b>bộ cấp nguồn (PSU)</b> không thuộc nhóm này (nó là linh kiện hỗ trợ, không phải hệ thống con Von Neumann).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the role and main function of the control unit within the Central Processing Unit, and how does it manage and coordinate the execution of instructions?|||Vai trò và chức năng chính của bộ điều khiển (control unit) trong CPU là gì, và nó quản lý/điều phối việc thực thi lệnh như thế nào?",
          "options": [
            {
              "text": "To perform arithmetic and logical operations.|||Thực hiện các phép toán số học và logic."
            },
            {
              "text": "To store data and program instructions.|||Lưu trữ dữ liệu và lệnh chương trình."
            },
            {
              "text": "Coordinate memory, ALU, and I/O operations.|||Điều phối bộ nhớ, ALU và các thao tác I/O."
            },
            {
              "text": "To connect the CPU to external networks.|||Kết nối CPU với mạng bên ngoài."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>control unit</b> orchestrates the fetch-decode-execute cycle, <b>coordinating memory, the ALU, and I/O operations</b> — it doesn't itself do arithmetic (ALU's job) or store data long-term (memory's job).</div><div class=\"ml-vi\"><b>Bộ điều khiển</b> điều phối chu trình nạp-giải mã-thực thi, <b>phối hợp bộ nhớ, ALU và các thao tác I/O</b> — bản thân nó không làm phép toán (việc của ALU) hay lưu trữ dữ liệu lâu dài (việc của bộ nhớ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Where are programs and data stored during processing in the Von Neumann architecture?|||Chương trình và dữ liệu được lưu ở đâu trong khi xử lý theo kiến trúc Von Neumann?",
          "options": [
            {
              "text": "Memory|||Bộ nhớ (Memory)"
            },
            {
              "text": "Arithmetic Logic Unit (ALU)|||ALU"
            },
            {
              "text": "Control Unit|||Bộ điều khiển"
            },
            {
              "text": "Input/Output|||Vào/ra"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The defining feature of the Von Neumann architecture is storing both <b>programs and data together in memory</b>.</div><div class=\"ml-vi\">Đặc trưng của kiến trúc Von Neumann là lưu cả <b>chương trình và dữ liệu cùng trong bộ nhớ</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of computer language was exclusively used at the very beginning of the computer age?|||Loại ngôn ngữ máy tính nào được dùng độc quyền vào thời kỳ đầu của kỷ nguyên máy tính?",
          "options": [
            {
              "text": "High-level languages|||Ngôn ngữ bậc cao"
            },
            {
              "text": "Symbolic languages|||Ngôn ngữ ký hiệu"
            },
            {
              "text": "Machine language using binary patterns|||Ngôn ngữ máy dùng mẫu nhị phân"
            },
            {
              "text": "Object-oriented languages|||Ngôn ngữ hướng đối tượng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">At the very beginning, only <b>machine language using binary patterns</b> existed — assembly, symbolic and high-level languages came later.</div><div class=\"ml-vi\">Vào thời kỳ đầu, chỉ có <b>ngôn ngữ máy dùng mẫu nhị phân</b> tồn tại — hợp ngữ, ngôn ngữ ký hiệu và ngôn ngữ bậc cao xuất hiện sau đó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the term 'bus' refer to in a computer system?|||Thuật ngữ 'bus' trong hệ thống máy tính đề cập tới điều gì?",
          "options": [
            {
              "text": "A physical path used for data transmission between components|||Một đường vật lý dùng để truyền dữ liệu giữa các thành phần"
            },
            {
              "text": "A type of memory|||Một loại bộ nhớ"
            },
            {
              "text": "A backup storage system|||Một hệ thống lưu trữ dự phòng"
            },
            {
              "text": "A processor's internal clock|||Đồng hồ nội bộ của bộ xử lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>bus</b> is the physical pathway (set of wires) that carries data, addresses, and control signals between computer components.</div><div class=\"ml-vi\"><b>Bus</b> là đường vật lý (bộ dây dẫn) mang dữ liệu, địa chỉ và tín hiệu điều khiển giữa các thành phần máy tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the bit string '0110000101100011' mean?|||Chuỗi bit '0110000101100011' có nghĩa là gì?",
          "options": [
            {
              "text": "It represents the two characters 'A' and 'C'|||Nó biểu diễn hai ký tự 'A' và 'C'"
            },
            {
              "text": "It represents the two characters 'A' and 'b'|||Nó biểu diễn hai ký tự 'A' và 'b'"
            },
            {
              "text": "It represents the two characters 'a' and 'c'|||Nó biểu diễn hai ký tự 'a' và 'c'"
            },
            {
              "text": "It represents the decimal number 24903|||Nó biểu diễn số thập phân 24903"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Split into two bytes: 01100001 = 97 = <b>'a'</b>, 01100011 = 99 = <b>'c'</b> (lowercase ASCII).</div><div class=\"ml-vi\">Tách thành hai byte: 01100001 = 97 = <b>'a'</b>, 01100011 = 99 = <b>'c'</b> (ASCII chữ thường).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the File Structure, Hashing works by:|||Trong cấu trúc tệp, Hashing hoạt động bằng cách:",
          "options": [
            {
              "text": "Sorting files by Index|||Sắp xếp tệp theo chỉ mục"
            },
            {
              "text": "Compress a normal file|||Nén một tệp thông thường"
            },
            {
              "text": "Calculating a key|||Tính toán một khoá"
            },
            {
              "text": "Adding lines to the file|||Thêm dòng vào tệp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Hashing</b> computes (calculates) a key/address from the record's key value to directly determine its storage location.</div><div class=\"ml-vi\"><b>Hashing</b> tính toán (calculate) một khoá/địa chỉ từ giá trị khoá của bản ghi để xác định trực tiếp vị trí lưu trữ của nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why must a floating-point number be converted to a character format when stored in a text file?|||Vì sao một số dấu chấm động phải được chuyển sang định dạng ký tự khi lưu trong tệp văn bản?",
          "options": [
            {
              "text": "To store data as character sequences|||Để lưu dữ liệu dưới dạng chuỗi ký tự"
            },
            {
              "text": "To reduce the file size for storage efficiency|||Để giảm dung lượng tệp cho hiệu quả lưu trữ"
            },
            {
              "text": "To enable random access to the data|||Để cho phép truy cập ngẫu nhiên tới dữ liệu"
            },
            {
              "text": "To prevent collisions during retrieval|||Để tránh va chạm khi truy xuất"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A text file stores everything as <b>character sequences</b> (readable text); a raw binary float must be converted to its character/digit representation first.</div><div class=\"ml-vi\">Tệp văn bản lưu mọi thứ dưới dạng <b>chuỗi ký tự</b> (văn bản đọc được); số thực nhị phân thô phải được chuyển sang biểu diễn ký tự/chữ số trước.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following accurately describes the differences between TCP and UDP in the Transport layer of the TCP/IP model?|||Điều nào mô tả đúng sự khác biệt giữa TCP và UDP ở tầng Vận chuyển của mô hình TCP/IP?",
          "options": [
            {
              "text": "TCP provides error recovery, congestion control, and flow control, while UDP provides none of these features|||TCP cung cấp khôi phục lỗi, kiểm soát tắc nghẽn và kiểm soát luồng, trong khi UDP không có tính năng nào trong số đó"
            },
            {
              "text": "UDP is connection-oriented and ensures data reliability, while TCP is connectionless and faster|||UDP hướng kết nối và đảm bảo độ tin cậy dữ liệu, còn TCP phi kết nối và nhanh hơn"
            },
            {
              "text": "Both TCP and UDP are connection-oriented protocols but differ in flow control mechanisms|||Cả TCP và UDP đều là giao thức hướng kết nối nhưng khác nhau ở cơ chế kiểm soát luồng"
            },
            {
              "text": "TCP is primarily used for real-time communication, while UDP is used for file transfers|||TCP chủ yếu dùng cho giao tiếp thời gian thực, còn UDP dùng cho truyền tệp"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>TCP</b> is reliable and connection-oriented, providing error recovery, congestion and flow control; <b>UDP</b> is connectionless and provides none of these, trading reliability for speed.</div><div class=\"ml-vi\"><b>TCP</b> tin cậy và hướng kết nối, cung cấp khôi phục lỗi, kiểm soát tắc nghẽn và luồng; <b>UDP</b> phi kết nối và không có bất kỳ tính năng nào trong số đó, đánh đổi độ tin cậy lấy tốc độ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What type of network device operates at the Data Link layer of the OSI model?|||Loại thiết bị mạng nào hoạt động ở tầng Liên kết dữ liệu của mô hình OSI?",
          "options": [
            {
              "text": "Router|||Router"
            },
            {
              "text": "Switch|||Switch"
            },
            {
              "text": "Firewall|||Firewall"
            },
            {
              "text": "Hub|||Hub"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>switch</b> operates at the Data Link layer, forwarding frames based on MAC addresses; a router operates at the Network layer.</div><div class=\"ml-vi\"><b>Switch</b> hoạt động ở tầng Liên kết dữ liệu, chuyển tiếp khung dựa trên địa chỉ MAC; router hoạt động ở tầng Mạng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is not a type of network topology?|||Đâu KHÔNG phải là loại hình topology mạng?",
          "options": [
            {
              "text": "Star|||Hình sao (star)"
            },
            {
              "text": "Mesh|||Lưới (mesh)"
            },
            {
              "text": "Ring|||Vòng (ring)"
            },
            {
              "text": "Switch|||Switch"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Star, mesh and ring are all network <b>topologies</b> (layout patterns); a <b>switch</b> is a network device, not a topology.</div><div class=\"ml-vi\">Star, mesh và ring đều là <b>hình topology</b> mạng (kiểu bố trí); <b>switch</b> là thiết bị mạng, không phải topology.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following IP addresses is a valid IPv4 address?|||Địa chỉ IP nào sau đây là địa chỉ IPv4 hợp lệ?",
          "options": [
            {
              "text": "300.168.0.1|||300.168.0.1"
            },
            {
              "text": "192.168.1.256|||192.168.1.256"
            },
            {
              "text": "172.16.254.1|||172.16.254.1"
            },
            {
              "text": "123.456.78.90|||123.456.78.90"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Each octet of an IPv4 address must be 0-255. Only <b>172.16.254.1</b> satisfies this; the others have an octet exceeding 255 (300, 256, 456).</div><div class=\"ml-vi\">Mỗi octet của địa chỉ IPv4 phải trong khoảng 0-255. Chỉ <b>172.16.254.1</b> thoả điều kiện này; các đáp án khác có octet vượt quá 255 (300, 256, 456).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which layer of the TCP/IP model ensures reliable data transfer?|||Tầng nào của mô hình TCP/IP đảm bảo truyền dữ liệu tin cậy?",
          "options": [
            {
              "text": "Physical layer|||Tầng vật lý"
            },
            {
              "text": "Transport layer|||Tầng vận chuyển"
            },
            {
              "text": "Application layer|||Tầng ứng dụng"
            },
            {
              "text": "Data link layer|||Tầng liên kết dữ liệu"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>transport layer</b> (via TCP) ensures reliable data transfer with acknowledgments, retransmission and ordering.</div><div class=\"ml-vi\"><b>Tầng vận chuyển</b> (qua TCP) đảm bảo truyền dữ liệu tin cậy với xác nhận, truyền lại và đúng thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which protocol is used to send email over the Internet?|||Giao thức nào dùng để gửi email qua Internet?",
          "options": [
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "HTTP|||HTTP"
            },
            {
              "text": "SMTP|||SMTP"
            },
            {
              "text": "POP3|||POP3"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>SMTP</b> (Simple Mail Transfer Protocol) is used to send email; POP3/IMAP are used to retrieve/receive it.</div><div class=\"ml-vi\"><b>SMTP</b> (Simple Mail Transfer Protocol) dùng để gửi email; POP3/IMAP dùng để lấy/nhận email.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________ is an arithmetic operation.|||________ là một phép toán số học.",
          "options": [
            {
              "text": "The exclusive OR|||XOR (exclusive OR)"
            },
            {
              "text": "The unary NOT|||NOT một ngôi"
            },
            {
              "text": "Subtraction|||Phép trừ (subtraction)"
            },
            {
              "text": "The binary AND|||AND"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Subtraction</b> is an arithmetic operation; XOR, NOT and AND are logical/bitwise operations, not arithmetic.</div><div class=\"ml-vi\"><b>Phép trừ</b> là phép toán số học; XOR, NOT và AND là phép toán logic/bit, không phải số học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert the decimal number 345 to octal.|||Đổi số thập phân 345 sang bát phân.",
          "options": [
            {
              "text": "521|||521"
            },
            {
              "text": "531|||531"
            },
            {
              "text": "505|||505"
            },
            {
              "text": "515|||515"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">345 &divide; 8 = 43 r1; 43 &divide; 8 = 5 r3; 5 &divide; 8 = 0 r5 &rarr; reading remainders bottom-up: <b>531</b>.</div><div class=\"ml-vi\">345 &divide; 8 = 43 dư 1; 43 &divide; 8 = 5 dư 3; 5 &divide; 8 = 0 dư 5 &rarr; đọc số dư từ dưới lên: <b>531</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT true for a nonpositional number system?|||Điều nào sau đây KHÔNG đúng với hệ đếm phi vị trí (nonpositional)?",
          "options": [
            {
              "text": "It does not depend on the position of digits.|||Nó không phụ thuộc vào vị trí chữ số."
            },
            {
              "text": "It can represent numbers using symbols only.|||Nó có thể biểu diễn số chỉ bằng ký hiệu."
            },
            {
              "text": "The value of a digit is determined by its position and base.|||Giá trị một chữ số được xác định bởi vị trí và cơ số của nó."
            },
            {
              "text": "Roman numerals are an example of nonpositional systems.|||Số La Mã là ví dụ của hệ phi vị trí."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">\"Value determined by position and base\" describes a <b>positional</b> system (like decimal/binary), NOT a nonpositional one (like Roman numerals) — so this statement is false for nonpositional systems.</div><div class=\"ml-vi\">\"Giá trị xác định bởi vị trí và cơ số\" mô tả hệ <b>vị trí</b> (như thập phân/nhị phân), KHÔNG phải hệ phi vị trí (như số La Mã) — nên phát biểu này sai đối với hệ phi vị trí.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Convert the decimal number 213.75 to octal|||Đổi số thập phân 213.75 sang bát phân",
          "options": [
            {
              "text": "325.6|||325.6"
            },
            {
              "text": "225.7|||225.7"
            },
            {
              "text": "235.6|||235.6"
            },
            {
              "text": "322.5|||322.5"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Integer 213: 213&divide;8=26 r5; 26&divide;8=3 r2; 3&divide;8=0 r3 &rarr; 325. Fraction .75: 0.75&times;8=6.0 &rarr; digit 6. Result: <b>325.6</b>.</div><div class=\"ml-vi\">Phần nguyên 213: 213&divide;8=26 dư 5; 26&divide;8=3 dư 2; 3&divide;8=0 dư 3 &rarr; 325. Phần thập phân .75: 0.75&times;8=6.0 &rarr; chữ số 6. Kết quả: <b>325.6</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which file system is most commonly associated with Linux?|||Hệ thống tệp nào thường gắn liền với Linux nhất?",
          "options": [
            {
              "text": "NTFS|||NTFS"
            },
            {
              "text": "FAT32|||FAT32"
            },
            {
              "text": "ext4|||ext4"
            },
            {
              "text": "HFS+|||HFS+"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>ext4</b> is the most common native Linux file system; NTFS is Windows, HFS+ is macOS.</div><div class=\"ml-vi\"><b>ext4</b> là hệ thống tệp Linux gốc phổ biến nhất; NTFS là của Windows, HFS+ là của macOS.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a significant limitation of monoprogramming in terms of CPU utilization?|||Hạn chế đáng kể của đơn chương trình (monoprogramming) về mặt sử dụng CPU là gì?",
          "options": [
            {
              "text": "The CPU remains idle during input/output operations because no other program is in memory|||CPU nhàn rỗi trong lúc thao tác vào/ra vì không có chương trình nào khác trong bộ nhớ"
            },
            {
              "text": "The CPU continuously runs multiple programs, leading to overheating|||CPU liên tục chạy nhiều chương trình, gây quá nhiệt"
            },
            {
              "text": "The CPU is only able to process user requests but cannot manage system resources efficiency|||CPU chỉ xử lý được yêu cầu người dùng nhưng không quản lý tài nguyên hệ thống hiệu quả"
            },
            {
              "text": "The CPU cannot perform arithmetic operations when a program is executing or waiting|||CPU không thể thực hiện phép toán số học khi chương trình đang chạy hoặc chờ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">With only <b>one</b> program in memory, when it blocks on I/O the CPU has nothing else to run and sits <b>idle</b> — the core inefficiency multiprogramming was invented to fix.</div><div class=\"ml-vi\">Vì chỉ có <b>một</b> chương trình trong bộ nhớ, khi nó chờ I/O thì CPU không còn việc gì khác để làm và <b>nhàn rỗi</b> — đây chính là sự kém hiệu quả mà đa chương trình ra đời để khắc phục.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which memory management technique divides the memory into variable-sized segments?|||Kỹ thuật quản lý bộ nhớ nào chia bộ nhớ thành các đoạn (segment) có kích thước thay đổi?",
          "options": [
            {
              "text": "Paging|||Phân trang (paging)"
            },
            {
              "text": "Segmentation|||Phân đoạn (segmentation)"
            },
            {
              "text": "Virtual memory|||Bộ nhớ ảo"
            },
            {
              "text": "Swapping|||Hoán đổi (swapping)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Segmentation</b> divides memory into variable-sized logical segments (e.g. code, stack, heap); paging uses fixed-size frames instead.</div><div class=\"ml-vi\"><b>Phân đoạn (segmentation)</b> chia bộ nhớ thành các đoạn logic kích thước thay đổi (VD code, stack, heap); phân trang dùng khung kích thước cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a common definition of an operating system?|||Định nghĩa phổ biến nào của hệ điều hành sau đây là đúng?",
          "options": [
            {
              "text": "An interface between hardware and users|||Một giao diện giữa phần cứng và người dùng"
            },
            {
              "text": "A specific application program|||Một chương trình ứng dụng cụ thể"
            },
            {
              "text": "A document outlining system policies|||Một tài liệu nêu chính sách hệ thống"
            },
            {
              "text": "A type of computer hardware|||Một loại phần cứng máy tính"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>operating system</b> is commonly defined as the intermediary <b>interface between hardware and users</b> (and their application programs), managing resources on their behalf.</div><div class=\"ml-vi\"><b>Hệ điều hành</b> thường được định nghĩa là <b>giao diện trung gian giữa phần cứng và người dùng</b> (cùng chương trình ứng dụng của họ), quản lý tài nguyên thay cho họ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of demand paging and demand segmentation, a memory size of 100 MB can execute ten programs, each of size 30 MB, for a total of 300 MB. At any moment, 100 MB of the ten programs are in memory and 200 MB are on disk. There is therefore a virtual memory size of ________ MB.|||Trong ngữ cảnh phân trang/phân đoạn theo yêu cầu, bộ nhớ 100 MB có thể chạy mười chương trình, mỗi chương trình 30 MB, tổng 300 MB. Tại một thời điểm, 100 MB của mười chương trình nằm trong bộ nhớ và 200 MB nằm trên đĩa. Vậy kích thước bộ nhớ ảo là ________ MB.",
          "options": [
            {
              "text": "300|||300"
            },
            {
              "text": "100|||100"
            },
            {
              "text": "200|||200"
            },
            {
              "text": "400|||400"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Virtual memory</b> represents the total logical memory needed by all programs, regardless of whether currently in RAM or on disk: 10 &times; 30 MB = <b>300</b> MB.</div><div class=\"ml-vi\"><b>Bộ nhớ ảo</b> biểu thị tổng bộ nhớ logic mà tất cả chương trình cần, bất kể hiện đang ở RAM hay trên đĩa: 10 &times; 30 MB = <b>300</b> MB.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a primary advantage of a DBMS (database management system) over a traditional file-based system?|||Ưu điểm chính của DBMS (hệ quản trị cơ sở dữ liệu) so với hệ thống dựa trên tệp truyền thống là gì?",
          "options": [
            {
              "text": "It eliminates the need for any data storage|||Loại bỏ hoàn toàn nhu cầu lưu trữ dữ liệu"
            },
            {
              "text": "It reduces data redundancy and inconsistency through centralized control|||Giảm dư thừa và không nhất quán dữ liệu nhờ kiểm soát tập trung"
            },
            {
              "text": "It removes the need for a computer network|||Loại bỏ nhu cầu dùng mạng máy tính"
            },
            {
              "text": "It guarantees the software never needs updating|||Đảm bảo phần mềm không bao giờ cần cập nhật"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>DBMS</b> centralizes data control, so the same fact is stored once and shared by all applications — <b>reducing redundancy and the inconsistency</b> that plagues traditional file-based systems where each application keeps its own copy.</div><div class=\"ml-vi\"><b>DBMS</b> kiểm soát dữ liệu tập trung, nên một sự kiện chỉ được lưu một lần và dùng chung cho mọi ứng dụng — <b>giảm dư thừa và sự không nhất quán</b> vốn là vấn đề của hệ thống dựa trên tệp truyền thống khi mỗi ứng dụng giữ bản sao riêng.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D8",
      "source": "REAL",
      "sortOrder": 7,
      "title": "Đề 8 — SP26 Final Exam (CSI106)|||Đề 8 — Thi cuối kỳ SP26 (CSI106)",
      "description": "CSI104 real FE multiple-choice paper (Spring 2026), transcribed from the exam images; same newer question bank as Đề 6-7, covering algorithms, OOP, networking and security topics. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Xuân 2026), chép từ ảnh đề; cùng ngân hàng câu hỏi mới như Đề 6-7, phủ thuật toán, OOP, mạng máy tính và bảo mật. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When developing software, how would you describe the concept of modularity in software design?|||Khi phát triển phần mềm, bạn mô tả khái niệm mô-đun hoá (modularity) trong thiết kế phần mềm như thế nào?",
          "options": [
            {
              "text": "Dividing a project into small parts that are easier to manage.|||Chia một dự án thành các phần nhỏ dễ quản lý hơn."
            },
            {
              "text": "Writing code without documentation as whole but focus on documentation of small parts of the project.|||Viết mã không tài liệu hoá toàn bộ mà chỉ tập trung tài liệu hoá từng phần nhỏ."
            },
            {
              "text": "Testing the whole system at once.|||Kiểm thử toàn bộ hệ thống cùng lúc."
            },
            {
              "text": "Combining all code into one large file.|||Gộp toàn bộ mã vào một tệp lớn duy nhất."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Modularity</b> means dividing a project into small, manageable parts (modules) that can be developed, tested and maintained independently.</div><div class=\"ml-vi\"><b>Mô-đun hoá</b> nghĩa là chia một dự án thành các phần nhỏ, dễ quản lý (mô-đun) có thể phát triển, kiểm thử và bảo trì độc lập.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a measure of software operability?|||Đâu KHÔNG phải là thước đo khả năng vận hành (operability) của phần mềm?",
          "options": [
            {
              "text": "Flexibility|||Tính linh hoạt"
            },
            {
              "text": "Accuracy|||Độ chính xác (accuracy)"
            },
            {
              "text": "Efficiency|||Hiệu quả"
            },
            {
              "text": "Reliability|||Độ tin cậy"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Accuracy</b> is a correctness-related quality measure, not an operability measure; flexibility, efficiency and reliability all relate to how practically the software can be operated.</div><div class=\"ml-vi\"><b>Độ chính xác</b> là thước đo liên quan tới tính đúng đắn, không phải khả năng vận hành; tính linh hoạt, hiệu quả và độ tin cậy đều liên quan tới việc vận hành phần mềm trên thực tế.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the final stage of the four phases of the software life cycle?|||Giai đoạn cuối cùng trong bốn giai đoạn của vòng đời phần mềm là gì?",
          "options": [
            {
              "text": "Testing|||Kiểm thử"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Implementation|||Cài đặt"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The four phases in order are Analysis, Design, Implementation, and finally <b>Testing</b>.</div><div class=\"ml-vi\">Bốn giai đoạn theo thứ tự là Phân tích, Thiết kế, Cài đặt, và cuối cùng là <b>Kiểm thử</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We divide computer languages into _____ paradigms|||Ta chia ngôn ngữ máy tính thành _____ mô hình (paradigm)",
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
              "text": "5|||5"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Computer languages are commonly divided into <b>4</b> paradigms: procedural, object-oriented, functional and declarative.</div><div class=\"ml-vi\">Ngôn ngữ máy tính thường được chia thành <b>4</b> mô hình: thủ tục, hướng đối tượng, hàm và khai báo.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If a database relation has 5 rows and 4 columns, how many individual data values are stored in the relation?|||Nếu một quan hệ cơ sở dữ liệu có 5 dòng và 4 cột, có bao nhiêu giá trị dữ liệu riêng lẻ được lưu trong quan hệ đó?",
          "options": [
            {
              "text": "20|||20"
            },
            {
              "text": "25|||25"
            },
            {
              "text": "15|||15"
            },
            {
              "text": "9|||9"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Total values = rows &times; columns = 5 &times; 4 = <b>20</b>.</div><div class=\"ml-vi\">Tổng số giá trị = số dòng &times; số cột = 5 &times; 4 = <b>20</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the five necessary components of a Database Management System (DBMS)?|||Năm thành phần cần thiết của DBMS là gì?",
          "options": [
            {
              "text": "CPU, Memory, I/O devices, Network, Operating System|||CPU, bộ nhớ, thiết bị I/O, mạng, hệ điều hành"
            },
            {
              "text": "Hardware, Software, Data, Users, and Procedures|||Phần cứng, phần mềm, dữ liệu, người dùng và quy trình"
            },
            {
              "text": "Application programs, End users, Database administrators, Data analysts, and System architects|||Chương trình ứng dụng, người dùng cuối, quản trị viên CSDL, nhà phân tích dữ liệu, kiến trúc sư hệ thống"
            },
            {
              "text": "Tables, Rows, Columns, Keys, and Indexes|||Bảng, dòng, cột, khoá và chỉ mục"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The standard 5 components of a DBMS environment are <b>Hardware, Software, Data, Users, and Procedures</b>.</div><div class=\"ml-vi\">5 thành phần chuẩn của môi trường DBMS là <b>Phần cứng, Phần mềm, Dữ liệu, Người dùng và Quy trình</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a limitation of the network database model?|||Đâu là hạn chế của mô hình cơ sở dữ liệu mạng?",
          "options": [
            {
              "text": "It does not support relationships between records.|||Nó không hỗ trợ mối quan hệ giữa các bản ghi."
            },
            {
              "text": "It has a complex structure that makes it difficult to query.|||Nó có cấu trúc phức tạp gây khó khăn khi truy vấn."
            },
            {
              "text": "It does not allow more than one parent for a record.|||Nó không cho phép bản ghi có nhiều hơn một cha."
            },
            {
              "text": "It only works for relational data.|||Nó chỉ hoạt động với dữ liệu quan hệ."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The network model's main limitation is its <b>complex structure</b> (many-to-many pointer-based relationships), which makes writing queries difficult — the opposite of options A/C which describe advantages it actually has over hierarchical.</div><div class=\"ml-vi\">Hạn chế chính của mô hình mạng là <b>cấu trúc phức tạp</b> (quan hệ nhiều-nhiều dựa trên con trỏ), khiến việc viết truy vấn khó khăn — ngược với A/C vốn mô tả những ưu điểm mà nó thực sự có so với mô hình phân cấp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why is it important to transform a relation into the first normal form (1NF) during database normalization?|||Vì sao quan trọng phải chuyển một quan hệ về dạng chuẩn 1 (1NF) khi chuẩn hoá cơ sở dữ liệu?",
          "options": [
            {
              "text": "To eliminate repeating groups of data in a relation|||Để loại bỏ các nhóm dữ liệu lặp lại trong quan hệ"
            },
            {
              "text": "To ensure that all attributes depend on a composite key|||Để đảm bảo mọi thuộc tính phụ thuộc vào khoá phức hợp"
            },
            {
              "text": "To reduce the need for complex SQL queries|||Để giảm nhu cầu dùng truy vấn SQL phức tạp"
            },
            {
              "text": "To establish relationships between multiple relations|||Để thiết lập quan hệ giữa nhiều quan hệ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>1NF</b> specifically requires <b>eliminating repeating groups</b> so each cell holds a single atomic value.</div><div class=\"ml-vi\"><b>1NF</b> yêu cầu cụ thể là <b>loại bỏ các nhóm lặp</b> để mỗi ô chỉ chứa một giá trị nguyên tử duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT one of the common operations on relations in SQL?|||Đâu KHÔNG phải một trong các thao tác phổ biến trên quan hệ trong SQL?",
          "options": [
            {
              "text": "Encrype|||Encrype (mã hoá, sai chính tả)"
            },
            {
              "text": "Select|||Select (chọn)"
            },
            {
              "text": "Project|||Project (chiếu)"
            },
            {
              "text": "Join|||Join (kết nối)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Select, Project and Join are the classic relational algebra operations; <b>\"Encrype\"</b> (encrypt) is not a relational operation at all.</div><div class=\"ml-vi\">Select, Project và Join là các phép toán đại số quan hệ kinh điển; <b>\"Encrype\"</b> (mã hoá) hoàn toàn không phải phép toán quan hệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One of the most common applications in computer science is ____, which is the process by which data is arranged according to its values|||Một trong những ứng dụng phổ biến nhất trong khoa học máy tính là ____, quá trình sắp xếp dữ liệu theo giá trị của nó",
          "options": [
            {
              "text": "Classifying|||Phân loại (classifying)"
            },
            {
              "text": "Re-structuring|||Tái cấu trúc"
            },
            {
              "text": "Searching|||Tìm kiếm (searching)"
            },
            {
              "text": "Sorting|||Sắp xếp (sorting)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Sorting</b> is exactly this: arranging data according to its values (ascending or descending).</div><div class=\"ml-vi\"><b>Sắp xếp (sorting)</b> đúng là như vậy: sắp xếp dữ liệu theo giá trị của nó (tăng dần hoặc giảm dần).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________construct tests a condition.|||Cấu trúc ________ kiểm tra một điều kiện.",
          "options": [
            {
              "text": "sequence|||tuần tự (sequence)"
            },
            {
              "text": "decision|||rẽ nhánh (decision)"
            },
            {
              "text": "repetition|||lặp (repetition)"
            },
            {
              "text": "flow|||luồng (flow)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>decision</b> (selection) construct evaluates a condition to choose between branches.</div><div class=\"ml-vi\">Cấu trúc <b>rẽ nhánh (decision)</b> đánh giá một điều kiện để chọn giữa các nhánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which sorting algorithm compares adjacent items and swaps them?|||Thuật toán sắp xếp nào so sánh các phần tử liền kề và hoán đổi chúng?",
          "options": [
            {
              "text": "Bubble Sort|||Sắp xếp nổi bọt (Bubble Sort)"
            },
            {
              "text": "Quick Sort|||Sắp xếp nhanh (Quick Sort)"
            },
            {
              "text": "Merge Sort|||Sắp xếp trộn (Merge Sort)"
            },
            {
              "text": "Selection Sort|||Sắp xếp chọn (Selection Sort)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Bubble Sort</b> repeatedly compares adjacent items and swaps them if out of order.</div><div class=\"ml-vi\"><b>Bubble Sort</b> liên tục so sánh các phần tử liền kề và hoán đổi nếu sai thứ tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which sorting algorithm is the most efficient in terms of space complexity, requiring only a constant amount of additional memory?|||Thuật toán sắp xếp nào hiệu quả nhất về độ phức tạp không gian, chỉ cần một lượng bộ nhớ phụ hằng số?",
          "options": [
            {
              "text": "Bubble Sort|||Bubble Sort"
            },
            {
              "text": "Selection Sort|||Selection Sort"
            },
            {
              "text": "Insertion Sort|||Insertion Sort"
            },
            {
              "text": "They all require the same amount of additional memory|||Cả ba đều cần lượng bộ nhớ phụ như nhau"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Bubble, Selection and Insertion sort are all simple in-place algorithms requiring only <b>O(1) constant extra memory</b> — they all tie.</div><div class=\"ml-vi\">Bubble, Selection và Insertion sort đều là thuật toán tại chỗ đơn giản, chỉ cần <b>bộ nhớ phụ hằng số O(1)</b> — cả ba ngang nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following best describes an array?|||Đâu mô tả đúng nhất một mảng (array)?",
          "options": [
            {
              "text": "A collection of functions|||Tập hợp các hàm"
            },
            {
              "text": "A data structure that stores a list of data items in contiguous memory locations|||Cấu trúc dữ liệu lưu danh sách các mục dữ liệu ở các vị trí bộ nhớ liền kề"
            },
            {
              "text": "A sequence of characters|||Một chuỗi ký tự"
            },
            {
              "text": "A method for sorting data|||Một phương pháp sắp xếp dữ liệu"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>array</b> stores a list of items in <b>contiguous memory locations</b>, allowing indexed access.</div><div class=\"ml-vi\"><b>Mảng (array)</b> lưu danh sách các mục ở <b>các vị trí bộ nhớ liền kề</b>, cho phép truy cập theo chỉ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Array traversal refers to_____|||Duyệt mảng (array traversal) đề cập tới_____",
          "options": [
            {
              "text": "an operation that search a specific element of the array|||thao tác tìm một phần tử cụ thể của mảng"
            },
            {
              "text": "an operation that search and edit a specific element of the array|||thao tác tìm và sửa một phần tử cụ thể của mảng"
            },
            {
              "text": "an operation that search and delete specific element of the array|||thao tác tìm và xoá một phần tử cụ thể của mảng"
            },
            {
              "text": "an operation that is applied to all elements of the array|||thao tác áp dụng lên mọi phần tử của mảng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Traversal</b> means visiting/processing <b>every element</b> of the array in order, not searching for one specific item.</div><div class=\"ml-vi\"><b>Duyệt (traversal)</b> nghĩa là truy cập/xử lý <b>mọi phần tử</b> của mảng theo thứ tự, không phải tìm một mục cụ thể.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the enqueue operation do in a queue ADT?|||Thao tác enqueue làm gì trong ADT hàng đợi?",
          "options": [
            {
              "text": "Removes the item at the front of the queue.|||Xoá phần tử ở đầu hàng đợi."
            },
            {
              "text": "Checks if the queue is empty|||Kiểm tra hàng đợi có rỗng không"
            },
            {
              "text": "Creates a new empty queue|||Tạo một hàng đợi rỗng mới"
            },
            {
              "text": "Inserts an item at the rear of the queue, making it the last item|||Chèn một phần tử vào cuối hàng đợi, biến nó thành phần tử cuối cùng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Enqueue</b> inserts an item at the <b>rear</b> of the queue.</div><div class=\"ml-vi\"><b>Enqueue</b> chèn một phần tử vào <b>cuối</b> hàng đợi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is a type of non-volatile storage?|||Đâu là loại lưu trữ không bay hơi (non-volatile)?",
          "options": [
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "ROM|||ROM"
            },
            {
              "text": "Cache|||Bộ nhớ đệm (cache)"
            },
            {
              "text": "Register|||Thanh ghi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>ROM</b> retains data without power (non-volatile); RAM, cache and registers all lose data when power is removed (volatile).</div><div class=\"ml-vi\"><b>ROM</b> giữ dữ liệu không cần nguồn điện (không bay hơi); RAM, cache và thanh ghi đều mất dữ liệu khi ngắt nguồn (bay hơi).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is one significant advantage of choosing a linked list instead of an array as a data structure, particularly in terms of memory management and the efficiency of inserting or deleting elements?|||Ưu điểm đáng kể của việc chọn danh sách liên kết thay vì mảng, đặc biệt về quản lý bộ nhớ và hiệu quả chèn/xoá phần tử, là gì?",
          "options": [
            {
              "text": "Faster searching.|||Tìm kiếm nhanh hơn."
            },
            {
              "text": "Easier random access to elements.|||Truy cập ngẫu nhiên phần tử dễ hơn."
            },
            {
              "text": "More efficient memory usage per node.|||Sử dụng bộ nhớ hiệu quả hơn trên mỗi nút."
            },
            {
              "text": "More efficient insertions and deletions.|||Chèn và xoá hiệu quả hơn."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A linked list allows O(1) insertion/deletion at a known position (no shifting elements like an array needs) — <b>more efficient insertions and deletions</b>.</div><div class=\"ml-vi\">Danh sách liên kết cho phép chèn/xoá O(1) tại vị trí đã biết (không cần dịch chuyển phần tử như mảng) — <b>chèn và xoá hiệu quả hơn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When is an array considered a suitable data structure to use?|||Khi nào mảng được coi là cấu trúc dữ liệu phù hợp để sử dụng?",
          "options": [
            {
              "text": "When a large number of insertions and deletions are expected after creation|||Khi dự kiến có nhiều thao tác chèn và xoá sau khi tạo"
            },
            {
              "text": "When data items are completely unrelated|||Khi các mục dữ liệu hoàn toàn không liên quan"
            },
            {
              "text": "When the number of deletions and insertions is small, but a lot of searching and retrieval activities are expected.|||Khi số lần xoá và chèn ít, nhưng dự kiến có nhiều hoạt động tìm kiếm và truy xuất."
            },
            {
              "text": "When elements need to be accessed non-sequentially only|||Khi phần tử chỉ cần truy cập không tuần tự"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Arrays excel at fast indexed <b>search/retrieval</b>; they are best when insert/delete is rare (since those require shifting elements).</div><div class=\"ml-vi\">Mảng nổi bật ở khả năng <b>tìm kiếm/truy xuất</b> nhanh theo chỉ số; phù hợp nhất khi chèn/xoá hiếm khi xảy ra (vì cần dịch chuyển phần tử).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In two's complement representation, what is a key advantage for arithmetic operations?|||Trong biểu diễn bù hai, ưu điểm chính cho các phép toán số học là gì?",
          "options": [
            {
              "text": "There are two representations for zero.|||Có hai cách biểu diễn số 0."
            },
            {
              "text": "Simplifies addition and subtraction.|||Đơn giản hoá phép cộng và trừ."
            },
            {
              "text": "It uses floating-point numbers.|||Nó dùng số dấu chấm động."
            },
            {
              "text": "It uses more bits for the sign.|||Nó dùng nhiều bit hơn cho dấu."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Two's complement <b>simplifies addition and subtraction</b>: the same adder circuit works for both positive and negative numbers, and subtraction becomes addition of the negation.</div><div class=\"ml-vi\">Bù hai <b>đơn giản hoá phép cộng và trừ</b>: cùng một mạch cộng hoạt động cho cả số dương lẫn âm, và phép trừ trở thành phép cộng với số đối.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____is stored as \"1000\" in two's complement representation|||Số _____ được lưu là \"1000\" trong biểu diễn bù hai",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "-0|||-0"
            },
            {
              "text": "-7|||-7"
            },
            {
              "text": "-8|||-8"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">In 4-bit two's complement, <b>1000</b> is the special minimum value <b>-8</b> (it has no positive counterpart since the range is -8 to +7).</div><div class=\"ml-vi\">Trong bù hai 4-bit, <b>1000</b> là giá trị nhỏ nhất đặc biệt <b>-8</b> (không có số dương tương ứng vì khoảng biểu diễn là -8 đến +7).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When storing the unsigned integer 12 in an 8-bit memory location, why are leading zeros added?|||Khi lưu số nguyên không dấu 12 vào ô nhớ 8-bit, vì sao phải thêm các số 0 ở đầu?",
          "options": [
            {
              "text": "To fill the memory location to its full capacity|||Để lấp đầy ô nhớ tới đúng dung lượng"
            },
            {
              "text": "To indicate the number is negative|||Để chỉ ra số đó âm"
            },
            {
              "text": "To align the decimal point for floating-point representation|||Để căn chỉnh dấu thập phân cho biểu diễn dấu chấm động"
            },
            {
              "text": "To compress the data for storage efficiency|||Để nén dữ liệu cho hiệu quả lưu trữ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Since the memory location has a fixed 8-bit capacity, unused high-order bits must be <b>filled with leading zeros</b> to occupy the full width.</div><div class=\"ml-vi\">Vì ô nhớ có dung lượng cố định 8 bit, các bit bậc cao chưa dùng phải được <b>lấp đầy bằng số 0 ở đầu</b> để chiếm đủ độ rộng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Computers use the____language to process data|||Máy tính dùng ngôn ngữ____để xử lý dữ liệu",
          "options": [
            {
              "text": "Processing|||Xử lý (Processing)"
            },
            {
              "text": "Kilobyte|||Kilobyte"
            },
            {
              "text": "Binary|||Nhị phân (Binary)"
            },
            {
              "text": "Representational|||Biểu diễn (Representational)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Computers process data using the <b>binary</b> language (0s and 1s) at the hardware level.</div><div class=\"ml-vi\">Máy tính xử lý dữ liệu bằng ngôn ngữ <b>nhị phân</b> (0 và 1) ở mức phần cứng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which base is commonly used to represent numbers in computers?|||Cơ số nào thường được dùng để biểu diễn số trong máy tính?",
          "options": [
            {
              "text": "Base 2 (binary)|||Cơ số 2 (nhị phân)"
            },
            {
              "text": "Base 8 (octal)|||Cơ số 8 (bát phân)"
            },
            {
              "text": "Base 10 (decimal)|||Cơ số 10 (thập phân)"
            },
            {
              "text": "Base 16 (hexadecimal)|||Cơ số 16 (thập lục phân)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Computers fundamentally represent numbers in <b>base 2 (binary)</b>; octal and hex are just convenient human-readable groupings of binary.</div><div class=\"ml-vi\">Máy tính về bản chất biểu diễn số ở <b>cơ số 2 (nhị phân)</b>; bát phân và thập lục phân chỉ là cách nhóm nhị phân cho con người dễ đọc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If we are adding two numbers, one of which has an exponent value of 7 and the other an exponent value of 9, we need to shift the decimal point of the smaller number to align the exponents ________.|||Nếu cộng hai số, một số có số mũ 7 và số kia có số mũ 9, ta cần dịch dấu thập phân của số nhỏ hơn để căn chỉnh số mũ ________.",
          "options": [
            {
              "text": "One place to the left|||Một chỗ sang trái"
            },
            {
              "text": "One place to the right|||Một chỗ sang phải"
            },
            {
              "text": "Two places to the left|||Hai chỗ sang trái"
            },
            {
              "text": "Two places to the right|||Hai chỗ sang phải"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">To raise the smaller exponent (7) up to match the larger (9), a difference of 2, the decimal point of its mantissa shifts <b>two places to the left</b> (reducing the mantissa while increasing the exponent).</div><div class=\"ml-vi\">Để tăng số mũ nhỏ hơn (7) lên bằng số mũ lớn hơn (9), chênh lệch 2, dấu thập phân của phần định trị dịch <b>hai chỗ sang trái</b> (giảm định trị trong khi tăng số mũ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Based on the sampling process, if an audio signal is sampled at 44,100 samples per second with a bit depth of 16 bits per sample, how many bits are required to store 1 second of audio?|||Dựa trên quá trình lấy mẫu, nếu tín hiệu âm thanh được lấy mẫu ở 44.100 mẫu/giây với độ sâu bit 16 bit/mẫu, cần bao nhiêu bit để lưu 1 giây âm thanh?",
          "options": [
            {
              "text": "705,600 bits|||705.600 bit"
            },
            {
              "text": "352,800 bits|||352.800 bit"
            },
            {
              "text": "1,411,200 bits|||1.411.200 bit"
            },
            {
              "text": "282,240 bits|||282.240 bit"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">44,100 samples/s &times; 16 bits/sample = <b>705,600 bits</b> per second (per channel).</div><div class=\"ml-vi\">44.100 mẫu/giây &times; 16 bit/mẫu = <b>705.600 bit</b> mỗi giây (mỗi kênh).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A company stores customer data in a database that is updated daily. Which security goal is most critical when ensuring that authorized employees can access and update this data without delays?|||Một công ty lưu dữ liệu khách hàng trong cơ sở dữ liệu được cập nhật hàng ngày. Mục tiêu bảo mật nào quan trọng nhất để đảm bảo nhân viên được uỷ quyền có thể truy cập và cập nhật dữ liệu này không bị trễ?",
          "options": [
            {
              "text": "Availability|||Tính sẵn sàng (availability)"
            },
            {
              "text": "Confidentiality|||Tính bí mật"
            },
            {
              "text": "Integrity|||Tính toàn vẹn"
            },
            {
              "text": "Encryption|||Mã hoá"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Availability</b> ensures authorized users can access and use data/resources whenever needed, without delay.</div><div class=\"ml-vi\"><b>Tính sẵn sàng</b> đảm bảo người dùng được uỷ quyền có thể truy cập và sử dụng dữ liệu/tài nguyên bất cứ khi nào cần, không bị trễ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When it comes to protecting information within computer systems, what is the main purpose of confidentiality?|||Khi bảo vệ thông tin trong hệ thống máy tính, mục đích chính của tính bí mật (confidentiality) là gì?",
          "options": [
            {
              "text": "To keep data secret from unauthorized users.|||Giữ dữ liệu bí mật khỏi người dùng trái phép."
            },
            {
              "text": "To ensure data can be accessed by everyone for maximum transparency at all times regardless of user permission.|||Đảm bảo dữ liệu ai cũng truy cập được để minh bạch tối đa mọi lúc bất kể quyền hạn."
            },
            {
              "text": "To allow users to modify data freely without any controls or logging.|||Cho phép người dùng sửa dữ liệu tự do mà không cần kiểm soát hay ghi log."
            },
            {
              "text": "To speed up encryption processes significantly even if it compromises data safety.|||Tăng tốc mã hoá đáng kể dù đánh đổi an toàn dữ liệu."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Confidentiality</b> means keeping data secret from unauthorized users — only those with permission can read it.</div><div class=\"ml-vi\"><b>Tính bí mật</b> nghĩa là giữ dữ liệu bí mật khỏi người dùng trái phép — chỉ những ai có quyền mới đọc được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In cryptographic systems where a single piece of confidential information controls both the process of converting plain data into secured form and reversing it back, what key-related mechanism is typically employed?|||Trong hệ mật mã mà một mẩu thông tin bí mật duy nhất điều khiển cả việc chuyển dữ liệu rõ sang dạng bảo mật và ngược lại, cơ chế khoá nào thường được dùng?",
          "options": [
            {
              "text": "The same secret key for both operations.|||Cùng một khoá bí mật cho cả hai thao tác."
            },
            {
              "text": "Public and private keys exchanged via secured network to ensure trustworthiness.|||Khoá công khai và riêng tư trao đổi qua mạng an toàn để đảm bảo tin cậy."
            },
            {
              "text": "No key at all.|||Không dùng khoá nào cả."
            },
            {
              "text": "Public and private keys.|||Khoá công khai và riêng tư."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This describes <b>symmetric-key</b> cryptography: <b>the same secret key</b> is used for both encryption and decryption.</div><div class=\"ml-vi\">Đây là mô tả của mật mã <b>khoá đối xứng</b>: <b>cùng một khoá bí mật</b> dùng cho cả mã hoá và giải mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of hacker is known for fighting back against black hat hackers, often using aggressive methods such as disabling or destroying the attackers' systems?|||Loại hacker nào nổi tiếng với việc chống lại hacker mũ đen, thường dùng phương pháp tấn công mạnh như vô hiệu hoá hoặc phá huỷ hệ thống của kẻ tấn công?",
          "options": [
            {
              "text": "White Hat|||Mũ trắng"
            },
            {
              "text": "Black Hat|||Mũ đen"
            },
            {
              "text": "Red Hat|||Mũ đỏ (Red Hat)"
            },
            {
              "text": "Gray Hat|||Mũ xám"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Red Hat</b> hackers actively fight back against black hats using aggressive, sometimes destructive counter-attacks — a vigilante approach.</div><div class=\"ml-vi\"><b>Hacker mũ đỏ (Red Hat)</b> chủ động chống lại hacker mũ đen bằng các phản công mạnh mẽ, đôi khi mang tính phá huỷ — cách tiếp cận kiểu tự xử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When considering encryption techniques that use asymmetric-key cryptography, which of the following statements represents their practical limitations?|||Khi xét kỹ thuật mã hoá dùng khoá bất đối xứng, phát biểu nào thể hiện hạn chế thực tế của nó?",
          "options": [
            {
              "text": "It is slower for encrypting large messages.|||Mã hoá thông điệp lớn chậm hơn."
            },
            {
              "text": "It requires no keys but only lucky guesses to decrypt.|||Không cần khoá nào mà chỉ cần đoán may mắn để giải mã."
            },
            {
              "text": "It can never be implemented on mobile devices.|||Không bao giờ triển khai được trên thiết bị di động."
            },
            {
              "text": "It automatically deletes messages after 10 seconds to improve secrecy.|||Tự động xoá thông điệp sau 10 giây để tăng bí mật."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Asymmetric-key cryptography is computationally expensive, making it <b>slower for large messages</b> — the reason it's typically used only for short data (like key exchange) while symmetric keys handle bulk data.</div><div class=\"ml-vi\">Mật mã khoá bất đối xứng tốn nhiều tính toán, nên <b>chậm hơn khi mã hoá thông điệp lớn</b> — đó là lý do nó thường chỉ dùng cho dữ liệu ngắn (như trao đổi khoá) còn khoá đối xứng xử lý dữ liệu lớn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main characteristic of the procedural programming paradigm?|||Đặc điểm chính của mô hình lập trình thủ tục là gì?",
          "options": [
            {
              "text": "It structures programs as a sequence of instructions acting on passive data|||Cấu trúc chương trình thành chuỗi lệnh tác động lên dữ liệu thụ động"
            },
            {
              "text": "It focuses on objects and their interactions|||Tập trung vào đối tượng và tương tác giữa chúng"
            },
            {
              "text": "It defines functions based on mathematical logic|||Định nghĩa hàm dựa trên logic toán học"
            },
            {
              "text": "It allows programs to make decisions based on logical rules and focuses on objects|||Cho phép chương trình quyết định dựa trên quy tắc logic và tập trung vào đối tượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>procedural paradigm</b> structures a program as a sequence of instructions/procedures acting on passive data structures.</div><div class=\"ml-vi\"><b>Mô hình thủ tục</b> cấu trúc chương trình thành chuỗi lệnh/thủ tục tác động lên các cấu trúc dữ liệu thụ động.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Java is a(n) ________ language.|||Java là ngôn ngữ ________.",
          "options": [
            {
              "text": "procedural|||thủ tục"
            },
            {
              "text": "functional|||hàm"
            },
            {
              "text": "declarative|||khai báo"
            },
            {
              "text": "object-oriented|||hướng đối tượng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Java</b> is a classic <b>object-oriented</b> language, built around classes and objects.</div><div class=\"ml-vi\"><b>Java</b> là ngôn ngữ <b>hướng đối tượng</b> kinh điển, xây dựng quanh lớp và đối tượng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In pass by value, what happens to the main program's variable?|||Trong truyền tham trị (pass by value), điều gì xảy ra với biến của chương trình chính?",
          "options": [
            {
              "text": "Its value is copied to the subprogram|||Giá trị của nó được sao chép vào chương trình con"
            },
            {
              "text": "It is shared with the subprogram|||Nó được chia sẻ với chương trình con"
            },
            {
              "text": "It is modified by the subprogram|||Nó bị chương trình con sửa đổi"
            },
            {
              "text": "It is destroyed after the subprogram call|||Nó bị huỷ sau khi gọi chương trình con"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In <b>pass by value</b>, only a <b>copy</b> of the variable's value is passed to the subprogram; changes inside the subprogram don't affect the original.</div><div class=\"ml-vi\">Trong <b>truyền tham trị</b>, chỉ một <b>bản sao</b> giá trị của biến được truyền vào chương trình con; thay đổi bên trong chương trình con không ảnh hưởng tới biến gốc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following describes inheritance in object-oriented programming?|||Điều nào mô tả tính kế thừa (inheritance) trong lập trình hướng đối tượng?",
          "options": [
            {
              "text": "A class deriving properties from another class.|||Một lớp kế thừa thuộc tính từ lớp khác."
            },
            {
              "text": "Procedures calling other procedures in a program.|||Các thủ tục gọi thủ tục khác trong chương trình."
            },
            {
              "text": "A program interpreting each line of source code.|||Chương trình thông dịch từng dòng mã nguồn."
            },
            {
              "text": "Using functions without side effects.|||Dùng hàm không có tác dụng phụ."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Inheritance</b> lets a class derive (inherit) properties and behaviors from another (parent/base) class.</div><div class=\"ml-vi\"><b>Kế thừa</b> cho phép một lớp kế thừa thuộc tính và hành vi từ lớp khác (lớp cha/cơ sở).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true in the context of different architectures of computers?|||Phát biểu nào đúng trong bối cảnh các kiến trúc máy tính khác nhau?",
          "options": [
            {
              "text": "Programming in RISC is more difficult and time-consuming than in the other design|||Lập trình trên RISC khó và tốn thời gian hơn thiết kế còn lại"
            },
            {
              "text": "Programming in CISC is more difficult and time-consuming than in the other design|||Lập trình trên CISC khó và tốn thời gian hơn thiết kế còn lại"
            },
            {
              "text": "The strategy behind CISC architectures is to have a small set of instructions|||Chiến lược của kiến trúc CISC là có một tập lệnh nhỏ"
            },
            {
              "text": "Programs executed on RISC architecture tend to have more bugs because there are not enough instructions available for the programmer|||Chương trình chạy trên RISC thường có nhiều lỗi hơn vì không đủ lệnh cho lập trình viên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">CISC provides fewer, more powerful instructions that do more per line (easier for the programmer); <b>RISC</b>'s simpler instructions mean more instructions are needed to accomplish the same task, making assembly-level programming <b>more difficult and time-consuming</b>.</div><div class=\"ml-vi\">CISC cung cấp ít lệnh hơn nhưng mạnh hơn, làm được nhiều việc hơn mỗi dòng (dễ hơn cho lập trình viên); lệnh đơn giản của <b>RISC</b> nghĩa là cần nhiều lệnh hơn để hoàn thành cùng một việc, khiến lập trình cấp hợp ngữ <b>khó và tốn thời gian hơn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a computer based on the Turing model, what is the specific role of a \"program\"?|||Trong máy tính dựa trên mô hình Turing, vai trò cụ thể của một \"chương trình\" là gì?",
          "options": [
            {
              "text": "To define the hardware architecture.|||Định nghĩa kiến trúc phần cứng."
            },
            {
              "text": "To manage memory allocation.|||Quản lý cấp phát bộ nhớ."
            },
            {
              "text": "To provide a set of instructions that dictates what to do with data|||Cung cấp tập lệnh chỉ dẫn phải làm gì với dữ liệu"
            },
            {
              "text": "To establish communication protocols between devices|||Thiết lập giao thức giao tiếp giữa các thiết bị"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">In the Turing model, a <b>program</b> is a set of instructions dictating what operations to perform on data.</div><div class=\"ml-vi\">Trong mô hình Turing, <b>chương trình</b> là tập lệnh chỉ dẫn phải thực hiện thao tác gì trên dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which CPU component stores temporary data and instructions?|||Thành phần CPU nào lưu trữ tạm thời dữ liệu và lệnh?",
          "options": [
            {
              "text": "Registers|||Thanh ghi (registers)"
            },
            {
              "text": "Decoder|||Bộ giải mã"
            },
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "Control unit|||Bộ điều khiển"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Registers</b> are small, extremely fast storage locations inside the CPU that temporarily hold data and instructions being processed.</div><div class=\"ml-vi\"><b>Thanh ghi</b> là các vị trí lưu trữ nhỏ, cực nhanh bên trong CPU, tạm thời giữ dữ liệu và lệnh đang được xử lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A program is a set of instructions that tells the computer what to do with ______|||Một chương trình là tập lệnh chỉ dẫn máy tính phải làm gì với ______",
          "options": [
            {
              "text": "Computer|||Máy tính"
            },
            {
              "text": "Program|||Chương trình"
            },
            {
              "text": "Algorithm|||Thuật toán"
            },
            {
              "text": "Data|||Dữ liệu"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A program's instructions dictate what to do with <b>data</b> — the input/output that the program processes.</div><div class=\"ml-vi\">Các lệnh của chương trình chỉ dẫn phải làm gì với <b>dữ liệu</b> — đầu vào/đầu ra mà chương trình xử lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of memory is typically the fastest and used to temporarily store frequently accessed data?|||Loại bộ nhớ nào thường nhanh nhất và dùng để tạm lưu dữ liệu được truy cập thường xuyên?",
          "options": [
            {
              "text": "Hard disk drive.|||Ổ đĩa cứng."
            },
            {
              "text": "Cache memory.|||Bộ nhớ đệm (cache)."
            },
            {
              "text": "Random Access Memory (RAM).|||RAM."
            },
            {
              "text": "Read Only Memory (ROM).|||ROM."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Cache memory</b> is the fastest tier used specifically to hold frequently/recently accessed data close to the CPU.</div><div class=\"ml-vi\"><b>Bộ nhớ đệm (cache)</b> là tầng nhanh nhất, dùng riêng để giữ dữ liệu được truy cập thường xuyên/gần đây gần CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is considered an input/output storage device?|||Đâu được coi là thiết bị lưu trữ vào/ra (input/output)?",
          "options": [
            {
              "text": "Keyboard|||Bàn phím"
            },
            {
              "text": "Monitor|||Màn hình"
            },
            {
              "text": "Magnetic disk|||Đĩa từ"
            },
            {
              "text": "Printer|||Máy in"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>magnetic disk</b> can both be written to (input/output of data) and read from, serving as a storage medium; keyboard is input-only, monitor and printer are output-only.</div><div class=\"ml-vi\"><b>Đĩa từ</b> vừa có thể ghi vào (vào/ra dữ liệu) vừa đọc ra, đóng vai trò lưu trữ; bàn phím chỉ vào, màn hình và máy in chỉ ra.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which file structure allows direct access to a specific record without retrieving all preceding records?|||Cấu trúc tệp nào cho phép truy cập trực tiếp một bản ghi cụ thể mà không cần lấy hết các bản ghi trước đó?",
          "options": [
            {
              "text": "Indexed file structure|||Cấu trúc tệp có chỉ mục"
            },
            {
              "text": "Sequential file structure|||Cấu trúc tệp tuần tự"
            },
            {
              "text": "Text file structure|||Cấu trúc tệp văn bản"
            },
            {
              "text": "Stream file structure|||Cấu trúc tệp luồng (stream)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>indexed</b> file uses an index to jump directly to a record's location, unlike sequential access which must read through preceding records.</div><div class=\"ml-vi\">Tệp <b>có chỉ mục</b> dùng chỉ mục để nhảy thẳng tới vị trí bản ghi, khác với truy cập tuần tự phải đọc qua các bản ghi trước.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following best describes hashed files?|||Đâu mô tả đúng nhất tệp băm (hashed files)?",
          "options": [
            {
              "text": "Files that store data in a fixed order|||Tệp lưu dữ liệu theo thứ tự cố định"
            },
            {
              "text": "Files where data is stored based on a computed hash value, which determines the location of the data|||Tệp mà dữ liệu được lưu dựa trên giá trị băm tính toán, xác định vị trí dữ liệu"
            },
            {
              "text": "Files that are encrypted for security purposes|||Tệp được mã hoá vì mục đích bảo mật"
            },
            {
              "text": "Files that contain only textual information|||Tệp chỉ chứa thông tin văn bản"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Hashed files</b> compute a hash value from the key to directly determine where each record is stored.</div><div class=\"ml-vi\"><b>Tệp băm</b> tính giá trị băm từ khoá để xác định trực tiếp vị trí lưu mỗi bản ghi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is used to separate directories in an absolute pathname in UNIX?|||Ký tự nào dùng để phân cách thư mục trong đường dẫn tuyệt đối trên UNIX?",
          "options": [
            {
              "text": "Slash (/)|||Dấu gạch chéo (/)"
            },
            {
              "text": "Backslash (\\)|||Dấu gạch chéo ngược (\\)"
            },
            {
              "text": "Dash (-)|||Dấu gạch ngang (-)"
            },
            {
              "text": "Underscore (_)|||Dấu gạch dưới (_)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">UNIX/Linux paths use the forward <b>slash (/)</b> to separate directories; Windows uses backslash.</div><div class=\"ml-vi\">Đường dẫn UNIX/Linux dùng <b>dấu gạch chéo (/)</b> để phân cách thư mục; Windows dùng gạch chéo ngược.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following IP addresses is invalid?|||Địa chỉ IP nào sau đây không hợp lệ?",
          "options": [
            {
              "text": "192.168.1.256|||192.168.1.256"
            },
            {
              "text": "127.0.0.1|||127.0.0.1"
            },
            {
              "text": "0.0.0.0|||0.0.0.0"
            },
            {
              "text": "172.16.0.1|||172.16.0.1"
            },
            {
              "text": "None of the other answers|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Each IPv4 octet must be 0-255; <b>256</b> exceeds this range, making <b>192.168.1.256</b> invalid.</div><div class=\"ml-vi\">Mỗi octet IPv4 phải trong khoảng 0-255; <b>256</b> vượt quá khoảng này, khiến <b>192.168.1.256</b> không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ layer of the TCP/IP protocol suite is responsible for source-to-destination delivery of the entire message.|||Tầng ________ trong bộ giao thức TCP/IP chịu trách nhiệm truyền toàn bộ thông điệp từ nguồn tới đích.",
          "options": [
            {
              "text": "transport|||vận chuyển"
            },
            {
              "text": "network|||mạng"
            },
            {
              "text": "data-link|||liên kết dữ liệu"
            },
            {
              "text": "session|||phiên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>transport</b> layer delivers the entire message end-to-end from source to destination.</div><div class=\"ml-vi\">Tầng <b>vận chuyển</b> truyền toàn bộ thông điệp từ nguồn tới đích theo kiểu đầu-cuối.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a computer network?|||Mạng máy tính là gì?",
          "options": [
            {
              "text": "A group of computers connected to share data|||Một nhóm máy tính kết nối để chia sẻ dữ liệu"
            },
            {
              "text": "A single computer running multiple programs|||Một máy tính chạy nhiều chương trình"
            },
            {
              "text": "A type of software|||Một loại phần mềm"
            },
            {
              "text": "A storage device|||Một thiết bị lưu trữ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>computer network</b> is a group of interconnected computers that share data and resources.</div><div class=\"ml-vi\"><b>Mạng máy tính</b> là một nhóm máy tính kết nối với nhau để chia sẻ dữ liệu và tài nguyên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In Transmission Control Protocol (TCP), what is a WRONG statement?|||Trong TCP, phát biểu nào SAI?",
          "options": [
            {
              "text": "TCP is a high latency protocol|||TCP là giao thức độ trễ cao"
            },
            {
              "text": "TCP is a connectionless protocol|||TCP là giao thức phi kết nối"
            },
            {
              "text": "TCP has checking error field in the packet|||TCP có trường kiểm tra lỗi trong gói tin"
            },
            {
              "text": "TCP will try to resend corrupted segments if there is any failure.|||TCP sẽ gửi lại các đoạn bị hỏng nếu có lỗi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">TCP is <b>connection-oriented</b> (not connectionless) — this makes \"TCP is a connectionless protocol\" the <b>wrong</b> statement; UDP is the connectionless one.</div><div class=\"ml-vi\">TCP <b>hướng kết nối</b> (không phải phi kết nối) — vì vậy \"TCP là giao thức phi kết nối\" là phát biểu <b>sai</b>; UDP mới là giao thức phi kết nối.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The first duty of a transport-layer protocol is to provide process-to-process communication. To define the processes, we need identifiers, called _____|||Nhiệm vụ đầu tiên của giao thức tầng vận chuyển là cung cấp giao tiếp tiến trình-tới-tiến trình. Để định danh tiến trình, ta cần định danh gọi là _____",
          "options": [
            {
              "text": "MAC addresses|||Địa chỉ MAC"
            },
            {
              "text": "IP addresses|||Địa chỉ IP"
            },
            {
              "text": "Process names|||Tên tiến trình"
            },
            {
              "text": "Port numbers|||Số hiệu cổng (port numbers)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Port numbers</b> identify specific processes on a host, enabling process-to-process communication at the transport layer.</div><div class=\"ml-vi\"><b>Số hiệu cổng</b> định danh tiến trình cụ thể trên một máy chủ, cho phép giao tiếp tiến trình-tới-tiến trình ở tầng vận chuyển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following representations is incorrect?|||Cách biểu diễn nào sau đây là sai?",
          "options": [
            {
              "text": "(101)2|||(101)2"
            },
            {
              "text": "(131)8|||(131)8"
            },
            {
              "text": "(DEC)16|||(DEC)16"
            },
            {
              "text": "(22A)10|||(22A)10"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">(101)2 and (131)8 use valid digits for their base, and (DEC)16 is valid hex (D, E, C are all valid hex digits). <b>(22A)10</b> claims base 10 but contains \"A\", which is not a valid decimal digit — incorrect.</div><div class=\"ml-vi\">(101)2 và (131)8 dùng chữ số hợp lệ cho cơ số của chúng, và (DEC)16 là hex hợp lệ (D, E, C đều là chữ số hex hợp lệ). <b>(22A)10</b> ghi cơ số 10 nhưng có chữ \"A\", không phải chữ số thập phân hợp lệ — sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To convert the integral part of a decimal number to another base, what repetitive procedure is used?|||Để chuyển phần nguyên của số thập phân sang cơ số khác, thủ tục lặp nào được dùng?",
          "options": [
            {
              "text": "Repetitive multiplication|||Nhân lặp lại"
            },
            {
              "text": "Repetitive addition|||Cộng lặp lại"
            },
            {
              "text": "Repetitive division|||Chia lặp lại"
            },
            {
              "text": "Repetitive subtraction|||Trừ lặp lại"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Converting an integer to another base uses <b>repetitive division</b> by the target base, collecting remainders.</div><div class=\"ml-vi\">Chuyển số nguyên sang cơ số khác dùng <b>chia lặp lại</b> cho cơ số đích, thu thập các số dư.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If the ASCII code for F (70) is 100 0110, then the ASCII code for f (102) is|||Nếu mã ASCII của F (70) là 100 0110, thì mã ASCII của f (102) là",
          "options": [
            {
              "text": "110 0110|||110 0110"
            },
            {
              "text": "110 0101|||110 0101"
            },
            {
              "text": "110 0111|||110 0111"
            },
            {
              "text": "110 1000|||110 1000"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Lowercase = uppercase + 32 (0010 0000). 100 0110 + 010 0000 = <b>110 0110</b> (70 + 32 = 102).</div><div class=\"ml-vi\">Chữ thường = chữ hoa + 32 (0010 0000). 100 0110 + 010 0000 = <b>110 0110</b> (70 + 32 = 102).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of memory management, what is \"memory allocation\"?|||Trong quản lý bộ nhớ, \"cấp phát bộ nhớ\" (memory allocation) là gì?",
          "options": [
            {
              "text": "The process of allocating memory resources to programs|||Quá trình cấp phát tài nguyên bộ nhớ cho chương trình"
            },
            {
              "text": "The process of writing data to disk storage|||Quá trình ghi dữ liệu vào lưu trữ đĩa"
            },
            {
              "text": "The encryption of sensitive data in memory|||Mã hoá dữ liệu nhạy cảm trong bộ nhớ"
            },
            {
              "text": "The utilization of secondary storage for temporary data storage|||Sử dụng bộ nhớ phụ để lưu dữ liệu tạm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Memory allocation</b> is the process of assigning memory resources to programs so they can store their data and instructions.</div><div class=\"ml-vi\"><b>Cấp phát bộ nhớ</b> là quá trình gán tài nguyên bộ nhớ cho chương trình để chúng lưu dữ liệu và lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "________, which implies demand paging, demand segmentation, or both, is used in almost all operating systems today.|||________, ngụ ý phân trang theo yêu cầu, phân đoạn theo yêu cầu, hoặc cả hai, được dùng trong hầu hết hệ điều hành ngày nay.",
          "options": [
            {
              "text": "Physical memory|||Bộ nhớ vật lý"
            },
            {
              "text": "Semiconductor memory|||Bộ nhớ bán dẫn"
            },
            {
              "text": "Virtual memory|||Bộ nhớ ảo"
            },
            {
              "text": "All of these above|||Tất cả đáp án trên"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Virtual memory</b> is implemented via demand paging and/or demand segmentation, and is used in nearly all modern operating systems.</div><div class=\"ml-vi\"><b>Bộ nhớ ảo</b> được hiện thực qua phân trang theo yêu cầu và/hoặc phân đoạn theo yêu cầu, được dùng trong hầu hết hệ điều hành hiện đại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the role of the job scheduler?|||Vai trò của bộ lập lịch công việc (job scheduler) là gì?",
          "options": [
            {
              "text": "Creates and terminates processes|||Tạo và kết thúc tiến trình"
            },
            {
              "text": "Moves processes between ready and running states|||Chuyển tiến trình giữa trạng thái sẵn sàng và đang chạy"
            },
            {
              "text": "Manages I/O device queues|||Quản lý hàng đợi thiết bị I/O"
            },
            {
              "text": "Allocates memory to programs|||Cấp phát bộ nhớ cho chương trình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>job scheduler</b> (long-term scheduler) admits jobs into the system, creating processes from them, and removes them upon completion — i.e. <b>creates and terminates processes</b>.</div><div class=\"ml-vi\"><b>Bộ lập lịch công việc</b> (long-term scheduler) tiếp nhận công việc vào hệ thống, tạo tiến trình từ chúng, và loại bỏ khi hoàn tất — tức <b>tạo và kết thúc tiến trình</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the file manager NOT control?|||Trình quản lý tệp KHÔNG kiểm soát điều gì?",
          "options": [
            {
              "text": "CPU scheduling|||Lập lịch CPU"
            },
            {
              "text": "File access permissions|||Quyền truy cập tệp"
            },
            {
              "text": "File creation and deletion|||Tạo và xoá tệp"
            },
            {
              "text": "File storage and backups|||Lưu trữ và sao lưu tệp"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>CPU scheduling</b> is handled by the process scheduler, not the file manager, which instead controls file permissions, creation/deletion, and storage.</div><div class=\"ml-vi\"><b>Lập lịch CPU</b> do bộ lập lịch tiến trình xử lý, không phải trình quản lý tệp, vốn kiểm soát quyền truy cập, tạo/xoá và lưu trữ tệp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a monoprogramming system, if a computer has 1 GB of RAM and 10% of it is reserved for the operating system, how much memory (in MB) is available for the user program?|||Trong hệ đơn chương trình, nếu máy tính có 1 GB RAM và 10% dành cho hệ điều hành, còn bao nhiêu MB cho chương trình người dùng?",
          "options": [
            {
              "text": "900 MB|||900 MB"
            },
            {
              "text": "100 MB|||100 MB"
            },
            {
              "text": "1024 MB|||1024 MB"
            },
            {
              "text": "90 MB|||90 MB"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">1 GB = 1000 MB (as used in this problem); 10% (100 MB) reserved for the OS leaves <b>900 MB</b> for the user program.</div><div class=\"ml-vi\">1 GB = 1000 MB (theo cách dùng trong bài); 10% (100 MB) dành cho hệ điều hành, còn lại <b>900 MB</b> cho chương trình người dùng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A system expected to perform a task within specific time constraints, often found in traffic control or patient monitoring, is known as a:|||Hệ thống dự kiến thực hiện tác vụ trong ràng buộc thời gian cụ thể, thường thấy trong điều khiển giao thông hoặc theo dõi bệnh nhân, được gọi là:",
          "options": [
            {
              "text": "Batch operating system|||Hệ điều hành theo lô"
            },
            {
              "text": "Single-user operating system|||Hệ điều hành đơn người dùng"
            },
            {
              "text": "Distributed system|||Hệ thống phân tán"
            },
            {
              "text": "Real-time system.|||Hệ thống thời gian thực."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A <b>real-time system</b> must complete tasks within strict time constraints — critical for traffic control, patient monitoring, and similar applications.</div><div class=\"ml-vi\"><b>Hệ thống thời gian thực</b> phải hoàn thành tác vụ trong ràng buộc thời gian nghiêm ngặt — thiết yếu cho điều khiển giao thông, theo dõi bệnh nhân, và các ứng dụng tương tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which transport layer protocol is connectionless?|||Giao thức tầng vận chuyển nào phi kết nối?",
          "options": [
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "FTP|||FTP"
            },
            {
              "text": "HTTP|||HTTP"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>UDP</b> is connectionless (no handshake); TCP is connection-oriented, while FTP and HTTP are application-layer protocols (which run over TCP).</div><div class=\"ml-vi\"><b>UDP</b> phi kết nối (không bắt tay); TCP hướng kết nối, còn FTP và HTTP là giao thức tầng ứng dụng (chạy trên TCP).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In sign-and-magnitude representation, how is the number -5 stored in 4 bits?|||Trong biểu diễn dấu-độ lớn (sign-and-magnitude), số -5 được lưu như thế nào trong 4 bit?",
          "options": [
            {
              "text": "1101|||1101"
            },
            {
              "text": "0101|||0101"
            },
            {
              "text": "1010|||1010"
            },
            {
              "text": "1001|||1001"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Sign-and-magnitude: sign bit 1 (negative) + magnitude of 5 (101) = <b>1101</b>.</div><div class=\"ml-vi\">Dấu-độ lớn: bit dấu 1 (âm) + độ lớn của 5 (101) = <b>1101</b>.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "CSI-D9",
      "source": "REAL",
      "sortOrder": 8,
      "title": "Đề 9 — SU25 Retake Exam (CSI106)|||Đề 9 — Thi lại SU25 (CSI106)",
      "description": "CSI104 real FE multiple-choice paper (Summer 2025 Retake), transcribed from the exam images. 1 of the 61 scanned images (position 28) was a duplicate capture of question 27, leaving exactly 60 unique real questions — no authored filler needed. (60 questions)|||Đề trắc nghiệm FE thật môn CSI104 (kỳ Hè 2025, Thi lại), chép từ ảnh đề. 1 trong 61 ảnh quét (vị trí 28) là bản chụp trùng của câu 27, còn lại đúng 60 câu duy nhất thật — không cần bù câu tự soạn. (60 câu)",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 5,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. A few questions ask you to choose 2 or 3 correct answers — read the instruction line above the options carefully. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Một vài câu yêu cầu chọn 2 hoặc 3 đáp án đúng — đọc kỹ dòng hướng dẫn phía trên các lựa chọn. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ separated the programming task from computer operation tasks.|||_______ tách biệt công việc lập trình khỏi công việc vận hành máy tính.",
          "options": [
            {
              "text": "Algorithms|||Thuật toán"
            },
            {
              "text": "Data processors|||Bộ xử lý dữ liệu"
            },
            {
              "text": "High-level programming languages|||Ngôn ngữ lập trình bậc cao"
            },
            {
              "text": "Operating systems|||Hệ điều hành"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Operating systems</b> took over hardware operation tasks (scheduling, I/O, etc.), letting programmers focus purely on writing programs rather than operating the machine directly.</div><div class=\"ml-vi\"><b>Hệ điều hành</b> đảm nhận các tác vụ vận hành phần cứng (lập lịch, I/O, v.v.), giúp lập trình viên chỉ tập trung viết chương trình thay vì trực tiếp vận hành máy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When Minicomputers appeared on the market?|||Máy tính mini xuất hiện trên thị trường vào thời kỳ nào?",
          "options": [
            {
              "text": "First generation|||Thế hệ thứ nhất"
            },
            {
              "text": "Second generation|||Thế hệ thứ hai"
            },
            {
              "text": "Third generation|||Thế hệ thứ ba"
            },
            {
              "text": "Fourth generation|||Thế hệ thứ tư"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Minicomputers</b> emerged during the <b>third generation</b> (IC era), offering smaller, cheaper alternatives to mainframes.</div><div class=\"ml-vi\"><b>Máy tính mini</b> xuất hiện ở <b>thế hệ thứ ba</b> (kỷ nguyên IC), là lựa chọn nhỏ gọn, rẻ hơn so với mainframe.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A path by which communication is achieved between a central processor and other devices is called______|||Một đường truyền thông giữa bộ xử lý trung tâm và các thiết bị khác được gọi là______",
          "options": [
            {
              "text": "Audit trail|||Dấu vết kiểm toán"
            },
            {
              "text": "Network|||Mạng"
            },
            {
              "text": "Bus|||Bus"
            },
            {
              "text": "Channel|||Kênh (channel)"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>bus</b> is the communication path connecting the central processor to other devices/components.</div><div class=\"ml-vi\"><b>Bus</b> là đường truyền thông kết nối bộ xử lý trung tâm với các thiết bị/thành phần khác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A computer has 32 MB (megabytes) of memory. How many bits are needed to address any single byte in memory?|||Một máy tính có 32 MB bộ nhớ. Cần bao nhiêu bit để định địa chỉ cho một byte bất kỳ trong bộ nhớ?",
          "options": [
            {
              "text": "5 bits|||5 bit"
            },
            {
              "text": "20 bits|||20 bit"
            },
            {
              "text": "25 bits|||25 bit"
            },
            {
              "text": "32 bits|||32 bit"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">32 MB = 2^25 bytes, so <b>25 bits</b> are needed to address every byte.</div><div class=\"ml-vi\">32 MB = 2^25 byte, nên cần <b>25 bit</b> để định địa chỉ cho mọi byte.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The device that can both feed data into and accept data from a computer is|||Thiết bị vừa có thể đưa dữ liệu vào vừa nhận dữ liệu từ máy tính là",
          "options": [
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "CPU|||CPU"
            },
            {
              "text": "Input-Output device|||Thiết bị vào/ra"
            },
            {
              "text": "All of the others|||Tất cả đáp án trên"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">An <b>input-output device</b> (e.g. a modem or touchscreen) both feeds data into and accepts data from the computer.</div><div class=\"ml-vi\"><b>Thiết bị vào/ra</b> (VD modem hay màn hình cảm ứng) vừa đưa dữ liệu vào vừa nhận dữ liệu từ máy tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many connections (in the data bus) do we need to transfer 4 bytes of a word at the same time?|||Cần bao nhiêu đường kết nối (trong bus dữ liệu) để truyền 4 byte của một từ cùng lúc?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "32|||32"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">4 bytes = 32 bits; transferring all bits simultaneously (in parallel) needs <b>32</b> connections, one per bit.</div><div class=\"ml-vi\">4 byte = 32 bit; truyền tất cả bit cùng lúc (song song) cần <b>32</b> đường kết nối, mỗi đường một bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Instructions and memory addresses are represented by|||Các lệnh và địa chỉ bộ nhớ được biểu diễn bằng",
          "options": [
            {
              "text": "Character codes|||Mã ký tự"
            },
            {
              "text": "Binary codes|||Mã nhị phân"
            },
            {
              "text": "Binary word|||Từ nhị phân"
            },
            {
              "text": "Parity bit|||Bit chẵn lẻ"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">At the hardware level, instructions and memory addresses are represented as <b>binary codes</b>.</div><div class=\"ml-vi\">Ở mức phần cứng, lệnh và địa chỉ bộ nhớ được biểu diễn bằng <b>mã nhị phân</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The base of the hexadecimal number system is ____.|||Cơ số của hệ thập lục phân là ____.",
          "options": [
            {
              "text": "2|||2"
            },
            {
              "text": "8|||8"
            },
            {
              "text": "10|||10"
            },
            {
              "text": "16|||16"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>hexadecimal</b> system has base <b>16</b>.</div><div class=\"ml-vi\">Hệ <b>thập lục phân</b> có cơ số <b>16</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is equivalent to 24 in decimal?|||Giá trị nào sau đây tương đương với 24 trong hệ thập phân?",
          "options": [
            {
              "text": "(11000)2|||(11000)2"
            },
            {
              "text": "(1A)16|||(1A)16"
            },
            {
              "text": "(31)8|||(31)8"
            },
            {
              "text": "None of the above|||Không đáp án nào ở trên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(11000)2 = 16+8 = <b>24</b>. (1A)16 = 26 and (31)8 = 25, so neither matches.</div><div class=\"ml-vi\">(11000)2 = 16+8 = <b>24</b>. (1A)16 = 26 và (31)8 = 25, không khớp giá trị 24.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A group contains ______ bits in the binary system are represented as one digit in the octal system.|||Một nhóm gồm ______ bit trong hệ nhị phân được biểu diễn thành một chữ số trong hệ bát phân.",
          "options": [
            {
              "text": "1|||1"
            },
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
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Octal is base 8 = 2^3, so each octal digit corresponds to <b>3</b> binary bits.</div><div class=\"ml-vi\">Bát phân có cơ số 8 = 2^3, nên mỗi chữ số bát phân tương ứng với <b>3</b> bit nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Conversion of binary number 1010101000010111 to hexadecimal number is_________|||Chuyển số nhị phân 1010101000010111 sang số thập lục phân là_________",
          "options": [
            {
              "text": "D8F9|||D8F9"
            },
            {
              "text": "A8B9|||A8B9"
            },
            {
              "text": "AA17|||AA17"
            },
            {
              "text": "D9F8|||D9F8"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Group into 4-bit nibbles: 1010=A, 1010=A, 0001=1, 0111=7 &rarr; <b>AA17</b>.</div><div class=\"ml-vi\">Nhóm 4 bit: 1010=A, 1010=A, 0001=1, 0111=7 &rarr; <b>AA17</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In an Excess conversion, we ________ the number to be converted.|||Trong chuyển đổi Excess (thừa số), ta ________ số cần chuyển.",
          "options": [
            {
              "text": "Add the bias number to|||Cộng số bias vào"
            },
            {
              "text": "Subtract the bias number from|||Trừ số bias từ"
            },
            {
              "text": "Multiply the bias number by|||Nhân số bias với"
            },
            {
              "text": "Divide the bias number by|||Chia số bias cho"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Excess-N representation stores <b>actual value + bias</b>, so converting to the stored form means <b>adding the bias number to</b> the actual exponent.</div><div class=\"ml-vi\">Biểu diễn Excess-N lưu <b>giá trị thật + bias</b>, nên chuyển sang dạng lưu trữ nghĩa là <b>cộng số bias vào</b> số mũ thật.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many symbols can be represented by a bit pattern with ten bits?|||Một chuỗi mười bit có thể biểu diễn được bao nhiêu ký hiệu?",
          "options": [
            {
              "text": "128|||128"
            },
            {
              "text": "256|||256"
            },
            {
              "text": "512|||512"
            },
            {
              "text": "1024|||1024"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">10 bits can represent 2^10 = <b>1024</b> distinct symbols.</div><div class=\"ml-vi\">10 bit có thể biểu diễn 2^10 = <b>1024</b> ký hiệu khác nhau.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If we call the bit depth or number of bits per sample B, the number of samples per second S, so how to calculate BIT RATE (R)?|||Nếu gọi độ sâu bit (số bit trên mỗi mẫu) là B, số mẫu trên giây là S, thì TỐC ĐỘ BIT (R) tính thế nào?",
          "options": [
            {
              "text": "B x 2S|||B x 2S"
            },
            {
              "text": "2B x S|||2B x S"
            },
            {
              "text": "B x S|||B x S"
            },
            {
              "text": "B2 x S2|||B2 x S2"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Bit rate is simply bits-per-sample times samples-per-second: <b>R = B x S</b>.</div><div class=\"ml-vi\">Tốc độ bit đơn giản là số bit mỗi mẫu nhân số mẫu mỗi giây: <b>R = B x S</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the storing images, the number of bits used to represent a pixel, its____, depends on how a pixel's color is handled by different encoding techniques.|||Khi lưu trữ ảnh, số bit dùng để biểu diễn một điểm ảnh, tức là____, phụ thuộc vào cách màu điểm ảnh được xử lý bởi các kỹ thuật mã hoá khác nhau.",
          "options": [
            {
              "text": "Bit map|||Bản đồ bit"
            },
            {
              "text": "Pixels|||Điểm ảnh"
            },
            {
              "text": "Resolution|||Độ phân giải"
            },
            {
              "text": "Color depth|||Độ sâu màu (color depth)"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The number of bits per pixel is called <b>color depth</b>.</div><div class=\"ml-vi\">Số bit trên mỗi điểm ảnh được gọi là <b>độ sâu màu (color depth)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a simple right shift operation on the bit pattern 1001 1000.|||Áp dụng phép dịch phải đơn giản lên chuỗi bit 1001 1000.",
          "options": [
            {
              "text": "1001 1001|||1001 1001"
            },
            {
              "text": "1001 1000|||1001 1000"
            },
            {
              "text": "0100 1101|||0100 1101"
            },
            {
              "text": "0100 1100|||0100 1100"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A simple (logical) right shift moves every bit one position right, filling 0 at the MSB: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div><div class=\"ml-vi\">Dịch phải đơn giản (logic) đẩy mọi bit sang phải một vị trí, điền 0 vào bit cao nhất: 1001&thinsp;1000 &rarr; <b>0100&thinsp;1100</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Use a simple left shift operation on the bit pattern 1001 1000|||Áp dụng phép dịch trái đơn giản lên chuỗi bit 1001 1000",
          "options": [
            {
              "text": "0001 1001|||0001 1001"
            },
            {
              "text": "0001 1010|||0001 1010"
            },
            {
              "text": "0011 0000|||0011 0000"
            },
            {
              "text": "0011 0001|||0011 0001"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A simple (logical) left shift moves every bit one position left, filling 0 at the LSB, dropping the old MSB: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0000</b>.</div><div class=\"ml-vi\">Dịch trái đơn giản (logic) đẩy mọi bit sang trái một vị trí, điền 0 vào bit thấp nhất, bỏ bit cao nhất cũ: 1001&thinsp;1000 &rarr; <b>0011&thinsp;0000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A _____defines the rules that both the sender and receiver and all intermediate devices need to follow to be able to communicate effectively.|||Một _____ định nghĩa các quy tắc mà cả bên gửi, bên nhận và mọi thiết bị trung gian cần tuân theo để giao tiếp hiệu quả.",
          "options": [
            {
              "text": "Protocol|||Giao thức (protocol)"
            },
            {
              "text": "Layers|||Các tầng"
            },
            {
              "text": "Provider networks|||Mạng nhà cung cấp"
            },
            {
              "text": "Hardware and sofware|||Phần cứng và phần mềm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>protocol</b> defines the rules that all parties in communication must follow.</div><div class=\"ml-vi\"><b>Giao thức</b> định nghĩa các quy tắc mà mọi bên trong giao tiếp phải tuân theo.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In physical layer, an _____ has infinitely many levels of intensity over a period of time|||Trong tầng vật lý, một _____ có vô số mức cường độ trong một khoảng thời gian",
          "options": [
            {
              "text": "Analog signals|||Tín hiệu tương tự"
            },
            {
              "text": "Electromagnetic signals|||Tín hiệu điện từ"
            },
            {
              "text": "Digital signals|||Tín hiệu số"
            },
            {
              "text": "Electronic signals|||Tín hiệu điện tử"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>analog</b> signal is continuous, with infinitely many intensity levels, unlike digital signals which have finite discrete levels.</div><div class=\"ml-vi\">Tín hiệu <b>tương tự</b> liên tục, có vô số mức cường độ, khác với tín hiệu số vốn chỉ có hữu hạn mức rời rạc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "At the transport layer, addresses are called______, and these define the application-layer programs at the source and destination.|||Ở tầng vận chuyển, địa chỉ được gọi là______, và chúng định danh chương trình tầng ứng dụng tại nguồn và đích.",
          "options": [
            {
              "text": "TCP|||TCP"
            },
            {
              "text": "Port numbers|||Số hiệu cổng (port numbers)"
            },
            {
              "text": "UDP|||UDP"
            },
            {
              "text": "IP address|||Địa chỉ IP"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Port numbers</b> identify the application-layer processes at source and destination for the transport layer.</div><div class=\"ml-vi\"><b>Số hiệu cổng</b> định danh các tiến trình tầng ứng dụng tại nguồn và đích cho tầng vận chuyển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ____ acts as a liaison between a client program and a server program, a process-to-process connection.|||Tầng ____ đóng vai trò trung gian giữa chương trình client và chương trình server, một kết nối tiến trình-tới-tiến trình.",
          "options": [
            {
              "text": "Physical|||Vật lý"
            },
            {
              "text": "Data-link|||Liên kết dữ liệu"
            },
            {
              "text": "Network|||Mạng"
            },
            {
              "text": "Transport|||Vận chuyển"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>transport</b> layer provides the process-to-process connection linking client and server programs.</div><div class=\"ml-vi\"><b>Tầng vận chuyển</b> cung cấp kết nối tiến trình-tới-tiến trình liên kết chương trình client và server.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Communication by phone is indeed a _____ activity; no party needs to be running forever waiting for the other party to call|||Giao tiếp qua điện thoại thực chất là hoạt động _____; không bên nào cần chạy mãi mãi chờ bên kia gọi tới",
          "options": [
            {
              "text": "P2P|||P2P (ngang hàng)"
            },
            {
              "text": "Tranditional|||Truyền thống"
            },
            {
              "text": "Client-server|||Client-server"
            },
            {
              "text": "Model|||Mô hình"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A phone call is <b>P2P</b> (peer-to-peer): either party can initiate, unlike client-server where the server must always be running and waiting.</div><div class=\"ml-vi\">Cuộc gọi điện thoại là <b>P2P</b> (ngang hàng): bên nào cũng có thể khởi xướng, khác với client-server nơi server phải luôn chạy chờ sẵn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The organization and interconnection of the various components of a computer system is|||Sự tổ chức và kết nối giữa các thành phần khác nhau của một hệ thống máy tính được gọi là",
          "options": [
            {
              "text": "Architecture|||Kiến trúc (architecture)"
            },
            {
              "text": "Networks|||Mạng máy tính"
            },
            {
              "text": "Graphics|||Đồ hoạ"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the textbook definition of computer <b>architecture</b>.</div><div class=\"ml-vi\">Đây là định nghĩa kinh điển của <b>kiến trúc máy tính</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ were designed in the 1950s to control mainframe computers.|||_____ được thiết kế vào thập niên 1950 để điều khiển máy tính lớn (mainframe).",
          "options": [
            {
              "text": "Time-sharing systems|||Hệ thống chia sẻ thời gian"
            },
            {
              "text": "Batch operating system|||Hệ điều hành theo lô (batch)"
            },
            {
              "text": "Personal systems|||Hệ thống cá nhân"
            },
            {
              "text": "Parallel systems|||Hệ thống song song"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Batch operating systems</b> were the first OS type, designed in the 1950s to control mainframes by running jobs in batches without interactive intervention.</div><div class=\"ml-vi\"><b>Hệ điều hành theo lô (batch)</b> là loại hệ điều hành đầu tiên, thiết kế vào thập niên 1950 để điều khiển mainframe bằng cách chạy các công việc theo lô mà không cần can thiệp tương tác.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The difference between memory and storages is that memory is _____ and storage is _____|||Sự khác biệt giữa bộ nhớ và lưu trữ là bộ nhớ _____ còn lưu trữ _____",
          "options": [
            {
              "text": "Temporary, permanent|||Tạm thời, vĩnh viễn"
            },
            {
              "text": "Permanent, temporary|||Vĩnh viễn, tạm thời"
            },
            {
              "text": "Slow, fast|||Chậm, nhanh"
            },
            {
              "text": "All of the others|||Tất cả đáp án trên"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Memory</b> (RAM) is <b>temporary</b> (volatile), losing data on power loss; <b>storage</b> (disk) is <b>permanent</b> (non-volatile).</div><div class=\"ml-vi\"><b>Bộ nhớ</b> (RAM) <b>tạm thời</b> (bay hơi), mất dữ liệu khi mất điện; <b>lưu trữ</b> (đĩa) <b>vĩnh viễn</b> (không bay hơi).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________ scheduler moves a process from one process state to another.|||Bộ lập lịch ________ chuyển một tiến trình từ trạng thái này sang trạng thái khác.",
          "options": [
            {
              "text": "Job|||Công việc (job)"
            },
            {
              "text": "Process|||Tiến trình (process)"
            },
            {
              "text": "Virtual|||Ảo"
            },
            {
              "text": "Queue|||Hàng đợi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>process (short-term) scheduler</b> moves a process between states (ready, running, waiting).</div><div class=\"ml-vi\"><b>Bộ lập lịch tiến trình</b> (short-term) chuyển tiến trình giữa các trạng thái (sẵn sàng, chạy, chờ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The device manager will be tracking every device constantly to ensure that the device is ________|||Trình quản lý thiết bị sẽ theo dõi mọi thiết bị liên tục để đảm bảo thiết bị ________",
          "options": [
            {
              "text": "Ready|||Sẵn sàng"
            },
            {
              "text": "Finished|||Đã xong"
            },
            {
              "text": "Functioning properly|||Hoạt động đúng cách"
            },
            {
              "text": "Running|||Đang chạy"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The device manager continuously monitors devices to ensure they are <b>functioning properly</b> (detecting malfunctions).</div><div class=\"ml-vi\">Trình quản lý thiết bị liên tục theo dõi thiết bị để đảm bảo chúng <b>hoạt động đúng cách</b> (phát hiện trục trặc).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ________construct tests a condition.|||Cấu trúc ________ kiểm tra một điều kiện.",
          "options": [
            {
              "text": "sequence|||tuần tự"
            },
            {
              "text": "decision|||rẽ nhánh (decision)"
            },
            {
              "text": "repetition|||lặp"
            },
            {
              "text": "flow|||luồng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>decision</b> construct evaluates a condition to branch.</div><div class=\"ml-vi\">Cấu trúc <b>rẽ nhánh (decision)</b> đánh giá một điều kiện để rẽ nhánh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "___ is an ordered set of unambiguous steps that produces a result and terminates in a finite time.|||___ là một tập hợp có thứ tự các bước rõ ràng, tạo ra kết quả và kết thúc trong thời gian hữu hạn.",
          "options": [
            {
              "text": "A construct|||Một cấu trúc"
            },
            {
              "text": "A recursion|||Đệ quy"
            },
            {
              "text": "An iteration|||Lặp"
            },
            {
              "text": "An algorithm|||Thuật toán"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">This is the standard definition of an <b>algorithm</b>.</div><div class=\"ml-vi\">Đây là định nghĩa chuẩn của <b>thuật toán</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ is a basic algorithm in which we want to find the location of a target in a list of items.|||_______ là thuật toán cơ bản mà ta muốn tìm vị trí của một mục tiêu trong danh sách các phần tử.",
          "options": [
            {
              "text": "Sorting|||Sắp xếp"
            },
            {
              "text": "Searching|||Tìm kiếm (searching)"
            },
            {
              "text": "Product|||Tích"
            },
            {
              "text": "Summation|||Tính tổng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Searching</b> is exactly this: finding the location of a target item in a list.</div><div class=\"ml-vi\"><b>Tìm kiếm</b> đúng là như vậy: tìm vị trí của một mục tiêu trong danh sách.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ________ sort, the item that goes into the sorted list is always the first item in the unsorted list.|||Trong sắp xếp ________, phần tử được đưa vào danh sách đã sắp xếp luôn là phần tử đầu tiên của danh sách chưa sắp xếp.",
          "options": [
            {
              "text": "Selection|||Chọn (selection)"
            },
            {
              "text": "Bubble|||Nổi bọt (bubble)"
            },
            {
              "text": "Insertion|||Chèn (insertion)"
            },
            {
              "text": "Every|||Mọi loại"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Insertion sort</b> always takes the next (first remaining) item from the unsorted part.</div><div class=\"ml-vi\"><b>Sắp xếp chèn</b> luôn lấy phần tử kế tiếp (đầu tiên còn lại) từ phần chưa sắp xếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Codes consisting of light and dark marks which may be optically read is known as|||Mã gồm các vạch sáng và tối có thể đọc bằng quang học được gọi là",
          "options": [
            {
              "text": "Memonics|||Memonics"
            },
            {
              "text": "Bar code|||Mã vạch (bar code)"
            },
            {
              "text": "Decoder|||Bộ giải mã"
            },
            {
              "text": "All of the others|||Tất cả đáp án trên"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>bar code</b> consists of light and dark marks that can be optically scanned/read.</div><div class=\"ml-vi\"><b>Mã vạch (bar code)</b> gồm các vạch sáng và tối có thể quét/đọc bằng quang học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The language that is an input for statement translation is called|||Ngôn ngữ là đầu vào cho việc dịch câu lệnh được gọi là",
          "options": [
            {
              "text": "Assembly language|||Hợp ngữ"
            },
            {
              "text": "Source language|||Ngôn ngữ nguồn (source language)"
            },
            {
              "text": "High-level language|||Ngôn ngữ bậc cao"
            },
            {
              "text": "Object language|||Ngôn ngữ đối tượng"
            },
            {
              "text": "None of the others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>source language</b> is the input language fed into a translator (compiler/assembler) for statement translation.</div><div class=\"ml-vi\"><b>Ngôn ngữ nguồn</b> là ngôn ngữ đầu vào đưa vào trình dịch (compiler/assembler) để dịch câu lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "FORTRAN is a(n) ________ language.|||FORTRAN là ngôn ngữ ________.",
          "options": [
            {
              "text": "Procedural|||Thủ tục"
            },
            {
              "text": "Functional|||Hàm"
            },
            {
              "text": "Declarative|||Khai báo"
            },
            {
              "text": "Object-oriented|||Hướng đối tượng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>FORTRAN</b> (FORmula TRANslation) is a classic <b>procedural</b> language, one of the earliest high-level languages.</div><div class=\"ml-vi\"><b>FORTRAN</b> (FORmula TRANslation) là ngôn ngữ <b>thủ tục</b> kinh điển, một trong những ngôn ngữ bậc cao đầu tiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which data of the following cannot change value with time?|||Dữ liệu nào sau đây không thể thay đổi giá trị theo thời gian?",
          "options": [
            {
              "text": "Constants|||Hằng số (constants)"
            },
            {
              "text": "Literals|||Giá trị chữ (literals)"
            },
            {
              "text": "Input/output|||Vào/ra"
            },
            {
              "text": "Variables|||Biến (variables)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Constants</b> hold a fixed value that never changes throughout program execution, unlike variables.</div><div class=\"ml-vi\"><b>Hằng số</b> giữ một giá trị cố định không bao giờ đổi trong suốt quá trình chạy chương trình, khác với biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In _____ the development process flows in only one direction. This means that a phase cannot be started until the previous phase is completed.|||Trong _____ quy trình phát triển chỉ chảy theo một hướng. Nghĩa là một giai đoạn không thể bắt đầu cho tới khi giai đoạn trước hoàn tất.",
          "options": [
            {
              "text": "Waterfall model|||Mô hình thác nước"
            },
            {
              "text": "Incremental model|||Mô hình tăng dần"
            },
            {
              "text": "Development proces|||Quy trình phát triển"
            },
            {
              "text": "Software engineering|||Kỹ nghệ phần mềm"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>waterfall model</b> is strictly sequential and one-directional.</div><div class=\"ml-vi\"><b>Mô hình thác nước</b> hoàn toàn tuần tự và một chiều.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "One phase in system development is ________.|||Một giai đoạn trong phát triển hệ thống là ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Application|||Ứng dụng"
            },
            {
              "text": "Designing|||Thiết kế"
            },
            {
              "text": "Collecting|||Thu thập"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The standard SDLC phases include <b>Analysis</b>, Design, Implementation and Testing.</div><div class=\"ml-vi\">Các giai đoạn SDLC chuẩn gồm <b>Phân tích</b>, Thiết kế, Cài đặt và Kiểm thử.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the system development process, structure charts are tools used in the ________ phase.|||Trong quy trình phát triển hệ thống, sơ đồ cấu trúc là công cụ dùng trong giai đoạn ________.",
          "options": [
            {
              "text": "Analysis|||Phân tích"
            },
            {
              "text": "Design|||Thiết kế"
            },
            {
              "text": "Implementation|||Cài đặt"
            },
            {
              "text": "Testing|||Kiểm thử"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Structure charts</b> are a <b>design</b>-phase tool.</div><div class=\"ml-vi\"><b>Sơ đồ cấu trúc</b> là công cụ của giai đoạn <b>thiết kế</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "___ refers to the ability to move data and/or a system from one platform to another and to reuse code.|||___ đề cập tới khả năng di chuyển dữ liệu và/hoặc hệ thống từ nền tảng này sang nền tảng khác và tái sử dụng mã.",
          "options": [
            {
              "text": "Maintainability|||Khả năng bảo trì"
            },
            {
              "text": "Operability|||Khả năng vận hành"
            },
            {
              "text": "Correctability|||Khả năng sửa lỗi"
            },
            {
              "text": "Transferability|||Khả năng chuyển đổi (transferability)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Transferability</b> (as named in this course's quality factor list) is the ability to move data/systems across platforms and reuse code.</div><div class=\"ml-vi\"><b>Khả năng chuyển đổi (transferability)</b> (theo cách gọi trong danh sách yếu tố chất lượng của môn học này) là khả năng di chuyển dữ liệu/hệ thống qua các nền tảng và tái sử dụng mã.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Testing a software system can involve ________ testing.|||Kiểm thử một hệ thống phần mềm có thể bao gồm kiểm thử ________.",
          "options": [
            {
              "text": "Black-box|||Hộp đen"
            },
            {
              "text": "Glass-box|||Hộp kính"
            },
            {
              "text": "Neither black-box nor glass-box|||Không phải cả hai"
            },
            {
              "text": "Both black-box and glass-box|||Cả hộp đen lẫn hộp kính"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Software testing uses <b>both</b> black-box and glass-box (white-box) approaches.</div><div class=\"ml-vi\">Kiểm thử phần mềm dùng <b>cả hai</b> cách tiếp cận hộp đen và hộp kính (hộp trắng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A(n)____ is a suitable structure when a small number of insertions and deletions are required but a lot of searching and retrieval is needed|||A(n)____ là cấu trúc phù hợp khi cần ít thao tác chèn/xoá nhưng cần tìm kiếm và truy xuất nhiều",
          "options": [
            {
              "text": "Array|||Mảng (array)"
            },
            {
              "text": "Record|||Bản ghi"
            },
            {
              "text": "Linked list|||Danh sách liên kết"
            },
            {
              "text": "Tree|||Cây"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>array</b> gives fast search/retrieval; best when insert/delete is rare.</div><div class=\"ml-vi\"><b>Mảng</b> cho tìm kiếm/truy xuất nhanh; phù hợp nhất khi chèn/xoá hiếm khi xảy ra.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____is the smallest element of named data that has meaning in a record.|||_____ là phần tử nhỏ nhất của dữ liệu có tên mang ý nghĩa trong một bản ghi.",
          "options": [
            {
              "text": "Name of record|||Tên bản ghi"
            },
            {
              "text": "Pointer|||Con trỏ"
            },
            {
              "text": "A field|||Trường (field)"
            },
            {
              "text": "Index|||Chỉ mục"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A <b>field</b> is the smallest named, meaningful unit of data within a record.</div><div class=\"ml-vi\"><b>Trường (field)</b> là đơn vị dữ liệu nhỏ nhất có tên, mang ý nghĩa trong một bản ghi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "An array is normally a _______and so is more suitable when the number of data items is fixed|||Một mảng thường là _______ nên phù hợp hơn khi số lượng mục dữ liệu cố định",
          "options": [
            {
              "text": "Dynamic data structure|||Cấu trúc dữ liệu động"
            },
            {
              "text": "Static data structure|||Cấu trúc dữ liệu tĩnh (static)"
            },
            {
              "text": "Same data|||Dữ liệu giống nhau"
            },
            {
              "text": "Related data|||Dữ liệu liên quan"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An array has a fixed size once created, making it a <b>static data structure</b> — best suited for a fixed number of items.</div><div class=\"ml-vi\">Mảng có kích thước cố định sau khi tạo, khiến nó là <b>cấu trúc dữ liệu tĩnh</b> — phù hợp nhất khi số lượng mục cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Inside the ADT are two different parts of the model that are ___ and __|||Bên trong ADT có hai phần khác nhau của mô hình là ___ và __",
          "options": [
            {
              "text": "Data structure and operations|||Cấu trúc dữ liệu và các thao tác"
            },
            {
              "text": "Application program and public operations|||Chương trình ứng dụng và thao tác công khai"
            },
            {
              "text": "Application program and private operations|||Chương trình ứng dụng và thao tác riêng tư"
            },
            {
              "text": "Data struture and application program|||Cấu trúc dữ liệu và chương trình ứng dụng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An ADT consists of a <b>data structure</b> and the <b>operations</b> defined on it.</div><div class=\"ml-vi\">ADT gồm một <b>cấu trúc dữ liệu</b> và các <b>thao tác</b> định nghĩa trên nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If A is the first data element input into a queue, followed by B, C, and D, then_____is the first element to be removed.|||Nếu A là phần tử dữ liệu đầu tiên đưa vào hàng đợi, tiếp theo là B, C, D, thì_____là phần tử đầu tiên bị lấy ra.",
          "options": [
            {
              "text": "A|||A"
            },
            {
              "text": "B|||B"
            },
            {
              "text": "C|||C"
            },
            {
              "text": "D|||D"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A queue is FIFO, so <b>A</b> (first in) is also first out.</div><div class=\"ml-vi\">Hàng đợi là FIFO, nên <b>A</b> (vào trước) cũng ra trước.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The dequeue operation ___ the item at the ___ of the queue|||Thao tác dequeue ___ phần tử ở ___ của hàng đợi",
          "options": [
            {
              "text": "delete/front|||xoá/đầu"
            },
            {
              "text": "delete/end|||xoá/cuối"
            },
            {
              "text": "inserts/front|||chèn/đầu"
            },
            {
              "text": "insert/rear|||chèn/cuối"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Dequeue</b> removes the item at the <b>front</b> of the queue.</div><div class=\"ml-vi\"><b>Dequeue</b> lấy phần tử ở <b>đầu</b> hàng đợi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The file structure allows random access is _____|||Cấu trúc tệp cho phép truy cập ngẫu nhiên là _____",
          "options": [
            {
              "text": "Hashed file|||Tệp băm"
            },
            {
              "text": "Sequential file|||Tệp tuần tự"
            },
            {
              "text": "EOF|||EOF"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>hashed</b> file computes a record's location directly from its key, allowing random access.</div><div class=\"ml-vi\"><b>Tệp băm</b> tính trực tiếp vị trí bản ghi từ khoá của nó, cho phép truy cập ngẫu nhiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ file can be accessed sequentially.|||Tệp _______ có thể được truy cập tuần tự.",
          "options": [
            {
              "text": "A sequential|||Tuần tự"
            },
            {
              "text": "An indexed|||Có chỉ mục"
            },
            {
              "text": "A hashed|||Băm"
            },
            {
              "text": "No|||Không tệp nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>sequential</b> file is read in order, record by record — this is its defining access method.</div><div class=\"ml-vi\"><b>Tệp tuần tự</b> được đọc theo thứ tự, từng bản ghi một — đây là phương thức truy cập đặc trưng của nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The address produced by a hashing algorithm is the ________ address.|||Địa chỉ do thuật toán băm tạo ra được gọi là địa chỉ ________.",
          "options": [
            {
              "text": "Probe|||Probe (dò)"
            },
            {
              "text": "Synonym|||Đồng nghĩa (synonym)"
            },
            {
              "text": "Collision|||Va chạm (collision)"
            },
            {
              "text": "Home|||Nhà (home)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The address directly computed by the hash function (before any collision resolution) is called the <b>home</b> address.</div><div class=\"ml-vi\">Địa chỉ được tính trực tiếp bởi hàm băm (trước khi xử lý va chạm) được gọi là địa chỉ <b>home</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a three-level DBMS architecture, the ________ level determines where data is actually stored on storage devices.|||Trong kiến trúc DBMS ba mức, mức ________ xác định dữ liệu thực sự được lưu ở đâu trên thiết bị lưu trữ.",
          "options": [
            {
              "text": "External|||Ngoài"
            },
            {
              "text": "Conceptual|||Khái niệm"
            },
            {
              "text": "Internal|||Trong (internal)"
            },
            {
              "text": "Physical|||Vật lý"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The ANSI-SPARC three-level architecture's <b>Internal</b> level determines physical storage.</div><div class=\"ml-vi\">Mức <b>Internal</b> trong kiến trúc ba mức ANSI-SPARC xác định lưu trữ vật lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the relational database model, data is organized in ______called relations.|||Trong mô hình cơ sở dữ liệu quan hệ, dữ liệu được tổ chức thành ______ gọi là các quan hệ.",
          "options": [
            {
              "text": "Two-dimensional array|||Mảng hai chiều"
            },
            {
              "text": "Two-dimensional tables|||Bảng hai chiều"
            },
            {
              "text": "Two-dimensional record|||Bản ghi hai chiều"
            },
            {
              "text": "None of others|||Không đáp án nào khác đúng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Data in the relational model is organized as <b>two-dimensional tables</b>.</div><div class=\"ml-vi\">Dữ liệu trong mô hình quan hệ được tổ chức thành <b>bảng hai chiều</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is needed to allow any relation in the database to be represented, to allow a language like SQL to use powerful retrieval operations composed of atomic operations, to remove anomalies in insertion, deletion, and updating, and reduce the need for restructuring the database as new data type are added.|||_____ cần thiết để cho phép biểu diễn mọi quan hệ, cho phép SQL dùng các thao tác truy xuất mạnh ghép từ thao tác nguyên tử, loại bỏ dị thường chèn/xoá/cập nhật, giảm nhu cầu tái cấu trúc CSDL khi thêm kiểu dữ liệu mới.",
          "options": [
            {
              "text": "Relational database|||Cơ sở dữ liệu quan hệ"
            },
            {
              "text": "Database system|||Hệ cơ sở dữ liệu"
            },
            {
              "text": "Atomic operations|||Thao tác nguyên tử"
            },
            {
              "text": "Normalization|||Chuẩn hoá (normalization)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Normalization</b> achieves all of these goals: proper representation, powerful queries, anomaly removal, and reduced restructuring.</div><div class=\"ml-vi\"><b>Chuẩn hoá</b> đạt được tất cả các mục tiêu này: biểu diễn đúng đắn, truy vấn mạnh, loại bỏ dị thường, giảm tái cấu trúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the result of difference database operation from 2 relation tables?|||Kết quả của phép toán hiệu (difference) giữa hai bảng quan hệ là gì?",
          "options": [
            {
              "text": "Neither the first relation nor the second.|||Không phải quan hệ thứ nhất cũng không phải thứ hai."
            },
            {
              "text": "Both of the first relation and the second.|||Cả quan hệ thứ nhất và thứ hai."
            },
            {
              "text": "The first relation but not the second.|||Quan hệ thứ nhất nhưng không phải thứ hai."
            },
            {
              "text": "The second but not the first|||Quan hệ thứ hai nhưng không phải thứ nhất"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>difference (minus)</b> operation A-B returns rows in <b>the first relation but not the second</b>.</div><div class=\"ml-vi\">Thao tác <b>hiệu (minus)</b> A-B trả về các dòng thuộc <b>quan hệ thứ nhất nhưng không phải thứ hai</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The term users in a DBMS has a broad meaning. We can divide users into:|||Thuật ngữ người dùng trong DBMS có nghĩa rộng. Ta có thể chia người dùng thành:",
          "options": [
            {
              "text": "End users and database asministrators|||Người dùng cuối và quản trị viên cơ sở dữ liệu"
            },
            {
              "text": "End users and normal users|||Người dùng cuối và người dùng thường"
            },
            {
              "text": "Application programs and end users|||Chương trình ứng dụng và người dùng cuối"
            },
            {
              "text": "Application programs and database adminitrators|||Chương trình ứng dụng và quản trị viên cơ sở dữ liệu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">DBMS users are broadly divided into <b>end users</b> (who query/use the data) and <b>database administrators</b> (who manage the system).</div><div class=\"ml-vi\">Người dùng DBMS được chia rộng thành <b>người dùng cuối</b> (truy vấn/dùng dữ liệu) và <b>quản trị viên cơ sở dữ liệu</b> (quản lý hệ thống).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_______ can be threatened by security attacks.|||_______ có thể bị đe doạ bởi các tấn công bảo mật.",
          "options": [
            {
              "text": "Confidentiality, cryptography, nonrepudiation|||Bí mật, mật mã học, không thể chối bỏ"
            },
            {
              "text": "Confidentiality, encryption, decryption|||Bí mật, mã hoá, giải mã"
            },
            {
              "text": "Confidentiality, integrity, availability|||Bí mật, toàn vẹn, sẵn sàng"
            },
            {
              "text": "Confidentiality, denial of service, masquerading|||Bí mật, từ chối dịch vụ, giả mạo"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The three security goals threatened by attacks are the CIA triad: <b>Confidentiality, Integrity, Availability</b>.</div><div class=\"ml-vi\">Ba mục tiêu bảo mật bị đe doạ bởi tấn công là bộ ba CIA: <b>Bí mật, Toàn vẹn, Sẵn sàng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____________ means that the data must arrive at the receiver exactly as they were sent.|||_____________ nghĩa là dữ liệu phải đến nơi nhận đúng y hệt như lúc gửi.",
          "options": [
            {
              "text": "Nonrepudiation|||Không thể chối bỏ"
            },
            {
              "text": "Message integrity|||Toàn vẹn thông điệp"
            },
            {
              "text": "Authentication|||Xác thực"
            },
            {
              "text": "Secrecy|||Bí mật"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Message integrity</b> guarantees data arrives unchanged, exactly as sent.</div><div class=\"ml-vi\"><b>Toàn vẹn thông điệp</b> đảm bảo dữ liệu đến nơi không đổi, đúng y hệt lúc gửi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "_____ is an attack that reduce the capability of a computer system to function correctly or bring the system down altogether by exhausting its resources.|||_____ là tấn công làm giảm khả năng hoạt động đúng của hệ thống máy tính hoặc khiến hệ thống sập hoàn toàn bằng cách làm cạn kiệt tài nguyên.",
          "options": [
            {
              "text": "DoS|||DoS (từ chối dịch vụ)"
            },
            {
              "text": "Trojan horses|||Ngựa thành Troy"
            },
            {
              "text": "Worms|||Sâu máy tính"
            },
            {
              "text": "Viruses|||Virus"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>DoS</b> (Denial of Service) exhausts system resources to degrade or crash it.</div><div class=\"ml-vi\"><b>DoS</b> (từ chối dịch vụ) làm cạn kiệt tài nguyên hệ thống để làm suy giảm hoặc sập hệ thống.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The attack that reduces the capability of a computer is called a ________ attack.|||Tấn công làm giảm khả năng hoạt động của máy tính được gọi là tấn công ________.",
          "options": [
            {
              "text": "Penetration|||Xâm nhập"
            },
            {
              "text": "Denial of service|||Từ chối dịch vụ"
            },
            {
              "text": "Either a or b|||Cả a và b"
            },
            {
              "text": "Neither a nor b|||Không phải a cũng không phải b"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Reducing a computer's capability to function is exactly a <b>denial of service</b> attack.</div><div class=\"ml-vi\">Làm giảm khả năng hoạt động của máy tính chính là tấn công <b>từ chối dịch vụ</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In ________ cryptography symbols are permuted or substituted; in asymmetric-key cryptography numbers are manipulated|||Trong mật mã ________ các ký hiệu được hoán vị hoặc thay thế; trong mật mã khoá bất đối xứng các con số được thao túng",
          "options": [
            {
              "text": "Symmetric-key|||Khoá đối xứng"
            },
            {
              "text": "Asymmetric-key|||Khoá bất đối xứng"
            },
            {
              "text": "Public-key|||Khoá công khai"
            },
            {
              "text": "Private-key|||Khoá riêng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Classical <b>symmetric-key</b> ciphers permute or substitute symbols; asymmetric-key cryptography manipulates numbers mathematically.</div><div class=\"ml-vi\">Mật mã <b>khoá đối xứng</b> cổ điển hoán vị hoặc thay thế ký hiệu; mật mã khoá bất đối xứng thao túng con số bằng toán học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the asymmetric-key method used for confidentiality, which key(s) is (are) publicly known?|||Trong phương pháp khoá bất đối xứng dùng cho tính bí mật, khoá nào được công khai?",
          "options": [
            {
              "text": "Encryption key only|||Chỉ khoá mã hoá"
            },
            {
              "text": "Decryption key only|||Chỉ khoá giải mã"
            },
            {
              "text": "Both encryption and decryption keys|||Cả khoá mã hoá và giải mã"
            },
            {
              "text": "Neither encryption key nor decryption key|||Không khoá nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">For confidentiality, the <b>encryption key</b> (public key) is known to everyone; only the recipient holds the private decryption key.</div><div class=\"ml-vi\">Để đảm bảo bí mật, <b>khoá mã hoá</b> (khoá công khai) được mọi người biết; chỉ người nhận giữ khoá giải mã riêng tư.</div>"
        }
      ]
    }
  ]
};
