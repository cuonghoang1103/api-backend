// CEA201 — Đề 1, 2, 3 (Final Exam, SP26). Real FE 50-question papers,
// transcribed from the school's images; correct answers + bilingual
// explanations authored here. Auto-generated from the question banks.
export default {
  "course": {
    "courseCode": "CEA201"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "FE-D1",
      "source": "REAL",
      "sortOrder": 0,
      "title": "Đề 1 — Final Exam (SP26 Retake)|||Đề 1 — Thi cuối kỳ (SP26 Thi lại)",
      "description": "Real FE multiple-choice paper (CEA201, Spring 2026 Retake), 50 questions. Some questions ask you to choose more than one answer.|||Đề trắc nghiệm FE thật (CEA201, kỳ Xuân 2026 - Thi lại), 50 câu. Một số câu yêu cầu chọn nhiều đáp án.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary role of the IO module? (choose two correct answers)|||Vai trò chính của mô-đun I/O là gì? (chọn hai đáp án đúng)",
          "options": [
            {
              "text": "Its role is data transfer, it will transfer data to and from peripheral devices.|||Vai trò truyền dữ liệu — chuyển dữ liệu tới/từ thiết bị ngoại vi."
            },
            {
              "text": "Its role is device communication control, it manages and controls the flow of data between the CPU and peripherals.|||Vai trò điều khiển giao tiếp thiết bị — quản lý và điều khiển luồng dữ liệu giữa CPU và ngoại vi."
            },
            {
              "text": "Its role is data formatting and converting analog signals into digital audio data for CPU.|||Vai trò định dạng dữ liệu và chuyển tín hiệu analog thành dữ liệu âm thanh số cho CPU."
            },
            {
              "text": "Its role is protecting data from user, ensuring that sensitive information is not lost or intercepted.|||Vai trò bảo vệ dữ liệu khỏi người dùng, đảm bảo thông tin nhạy cảm không bị mất hay bị chặn."
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">An I/O module has two core jobs: <b>data transfer</b> and <b>control &amp; timing</b> between the CPU and peripherals. Audio-only (C) and security (D) are not its general role.</div><div class=\"ml-vi\">Mô-đun I/O có hai nhiệm vụ cốt lõi: <b>truyền dữ liệu</b> và <b>điều khiển &amp; định thời</b> giữa CPU và ngoại vi. Chỉ âm thanh (C) và bảo mật (D) không phải chức năng chung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is part of the Von Neumann principle?|||Phát biểu nào sau đây thuộc nguyên lý Von Neumann?",
          "options": [
            {
              "text": "The computer uses a program counter to indicate the location of the next statement.|||Máy tính dùng bộ đếm chương trình (PC) để chỉ vị trí lệnh kế tiếp."
            },
            {
              "text": "Computer can control all operations with a single program.|||Máy tính có thể điều khiển mọi thao tác bằng một chương trình duy nhất."
            },
            {
              "text": "Computer memory is not addressable.|||Bộ nhớ máy tính không thể định địa chỉ."
            },
            {
              "text": "Each instruction must have a memory area containing the address of the next instruction.|||Mỗi lệnh phải có vùng nhớ chứa địa chỉ của lệnh kế tiếp."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Von Neumann = <b>stored program</b> run sequentially; the <b>program counter</b> holds the next instruction's address. Memory IS addressable (C wrong).</div><div class=\"ml-vi\">Von Neumann = <b>chương trình lưu trữ</b> chạy tuần tự; <b>bộ đếm chương trình</b> giữ địa chỉ lệnh kế tiếp. Bộ nhớ CÓ định địa chỉ (C sai).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which component ensures the transfer of data between the operating environment and the control mechanism?|||Thành phần nào đảm bảo việc truyền dữ liệu giữa môi trường hoạt động và cơ chế điều khiển?",
          "options": [
            {
              "text": "Data processing facility|||Bộ xử lý dữ liệu"
            },
            {
              "text": "Control mechanism|||Cơ chế điều khiển"
            },
            {
              "text": "Data movement apparatus|||Bộ di chuyển dữ liệu"
            },
            {
              "text": "Data storage facility|||Bộ lưu trữ dữ liệu"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Transferring data to/from the outside world is the job of the <b>data movement apparatus</b> (I/O).</div><div class=\"ml-vi\">Truyền dữ liệu ra/vào bên ngoài là nhiệm vụ của <b>bộ di chuyển dữ liệu</b> (I/O).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which one of four basic functions of computer describes the following statement? \"The paths among components are used to move data from memory to memory and from memory through gates to memory\".|||Chức năng cơ bản nào của máy tính mô tả phát biểu sau? \"Các đường đi giữa các thành phần được dùng để chuyển dữ liệu từ bộ nhớ sang bộ nhớ và từ bộ nhớ qua các cổng tới bộ nhớ\".",
          "options": [
            {
              "text": "Data storage|||Lưu trữ dữ liệu"
            },
            {
              "text": "Data processing|||Xử lý dữ liệu"
            },
            {
              "text": "Data movement|||Di chuyển dữ liệu"
            },
            {
              "text": "Control|||Điều khiển"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Relocating data along paths between components is <b>data movement</b>.</div><div class=\"ml-vi\">Dời dữ liệu theo các đường giữa các thành phần là <b>di chuyển dữ liệu</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A benchmark is run 4 times on a computer with execution times: 8s, 10s, 12s, 14s. What is the arithmetic mean?|||Một benchmark chạy 4 lần với thời gian: 8s, 10s, 12s, 14s. Trung bình cộng là bao nhiêu?",
          "options": [
            {
              "text": "11s|||11s"
            },
            {
              "text": "10.5s|||10.5s"
            },
            {
              "text": "11.5s|||11.5s"
            },
            {
              "text": "12s|||12s"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Arithmetic mean = (8+10+12+14)/4 = 44/4 = <b>11s</b>.</div><div class=\"ml-vi\">Trung bình cộng = (8+10+12+14)/4 = 44/4 = <b>11s</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider an expression: 1000 0000 AND 1111 1010. What is the result of this expression?|||Xét biểu thức: 1000 0000 AND 1111 1010. Kết quả là gì?",
          "options": [
            {
              "text": "1000 0000|||1000 0000"
            },
            {
              "text": "1111 0000|||1111 0000"
            },
            {
              "text": "1001 1010|||1001 1010"
            },
            {
              "text": "1001 0101|||1001 0101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Bitwise AND keeps 1 only where BOTH bits are 1 → only the top bit → <b>1000 0000</b>.</div><div class=\"ml-vi\">Phép AND bit giữ 1 chỉ khi CẢ hai bit là 1 → chỉ bit cao nhất → <b>1000 0000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following determines the Bus Width?|||Yếu tố nào quyết định độ rộng bus (Bus Width)?",
          "options": [
            {
              "text": "The clock speed of the CPU|||Tốc độ xung nhịp CPU"
            },
            {
              "text": "The number of cores in the processor|||Số nhân của bộ xử lý"
            },
            {
              "text": "The size of the motherboard|||Kích thước bo mạch chủ"
            },
            {
              "text": "The number of parallel lines in the data bus|||Số đường song song trong bus dữ liệu"
            },
            {
              "text": "Number of components connected to Bus|||Số thành phần nối vào bus"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Bus width = how many bits travel at once = the <b>number of parallel lines</b> in the bus.</div><div class=\"ml-vi\">Độ rộng bus = số bit truyền cùng lúc = <b>số đường song song</b> trong bus.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When an interrupt is about to execute next, where is the Program Counter (PC) positioned?|||Khi một ngắt (interrupt) sắp được thực thi kế tiếp, Bộ đếm chương trình (PC) trỏ tới đâu?",
          "options": [
            {
              "text": "Add 1 to PC|||Cộng 1 vào PC"
            },
            {
              "text": "At the address of the last executed instruction|||Địa chỉ của lệnh vừa thực thi"
            },
            {
              "text": "Jump to random unknown position|||Nhảy tới vị trí ngẫu nhiên"
            },
            {
              "text": "At the started address of an interrupt handler routine|||Địa chỉ bắt đầu của thủ tục xử lý ngắt (interrupt handler)"
            },
            {
              "text": "At the beginning of the memory address space|||Đầu không gian địa chỉ bộ nhớ"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">On an interrupt, the PC is loaded with the <b>start address of the interrupt handler</b> routine.</div><div class=\"ml-vi\">Khi có ngắt, PC được nạp <b>địa chỉ bắt đầu của thủ tục xử lý ngắt</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ interprets the instructions in memory and causes them to be executed.|||____ thông dịch (interpret) các lệnh trong bộ nhớ và khiến chúng được thực thi.",
          "options": [
            {
              "text": "Registers|||Thanh ghi (Registers)"
            },
            {
              "text": "CPU interconnection|||Liên kết CPU (CPU interconnection)"
            },
            {
              "text": "Arithmetic and Logic Unit (ALU)|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "I/O Modules|||Mô-đun I/O"
            },
            {
              "text": "Control Unit (CU)|||Đơn vị điều khiển (CU)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The <b>Control Unit (CU)</b> interprets instructions and causes them to be executed.</div><div class=\"ml-vi\"><b>Đơn vị điều khiển (CU)</b> thông dịch lệnh và khiến chúng được thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a computer system bus, the control lines are responsible for:|||Trong bus hệ thống của máy tính, các đường điều khiển (control lines) chịu trách nhiệm:",
          "options": [
            {
              "text": "Transferring actual binary data between components.|||Truyền dữ liệu nhị phân thực tế giữa các thành phần."
            },
            {
              "text": "Specifying the location in memory to read/write.|||Chỉ định vị trí trong bộ nhớ để đọc/ghi."
            },
            {
              "text": "Coordinating and managing the use of the data and address lines.|||Điều phối và quản lý việc sử dụng các đường dữ liệu và địa chỉ."
            },
            {
              "text": "Storing frequently accessed instructions.|||Lưu các lệnh hay truy cập."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Control lines <b>coordinate and manage</b> the use of the data and address lines (read/write, timing…).</div><div class=\"ml-vi\">Đường điều khiển <b>điều phối và quản lý</b> việc dùng đường dữ liệu và địa chỉ (đọc/ghi, định thời…).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the correct order of memory access speed from fastest to slowest?|||Thứ tự tốc độ truy cập bộ nhớ từ nhanh nhất tới chậm nhất là gì?",
          "options": [
            {
              "text": "Registers > Cache > RAM > SSD|||Registers > Cache > RAM > SSD"
            },
            {
              "text": "Cache > Registers > RAM > SSD|||Cache > Registers > RAM > SSD"
            },
            {
              "text": "Registers > Cache > SSD > RAM|||Registers > Cache > SSD > RAM"
            },
            {
              "text": "Cache > Registers > SSD > RAM|||Cache > Registers > SSD > RAM"
            },
            {
              "text": "All of the mentioned are wrong|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Fastest→slowest: <b>Registers &gt; Cache &gt; RAM &gt; SSD</b>.</div><div class=\"ml-vi\">Nhanh→chậm: <b>Registers &gt; Cache &gt; RAM &gt; SSD</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which mapping technique allows a main memory block to be placed in only one possible cache line?|||Kỹ thuật ánh xạ nào cho phép một khối bộ nhớ chính chỉ được đặt vào MỘT dòng cache duy nhất?",
          "options": [
            {
              "text": "Direct mapping|||Ánh xạ trực tiếp (Direct mapping)"
            },
            {
              "text": "Fully associative mapping|||Ánh xạ liên kết đầy đủ (Fully associative)"
            },
            {
              "text": "Set-associative mapping|||Ánh xạ liên kết tập hợp (Set-associative)"
            },
            {
              "text": "Random mapping|||Ánh xạ ngẫu nhiên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Direct mapping</b>: each memory block maps to exactly one cache line.</div><div class=\"ml-vi\"><b>Ánh xạ trực tiếp</b>: mỗi khối nhớ chỉ vào đúng một dòng cache.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cache mapping technique divides the cache into a number of sets, and each main memory block can map into any line within a specific set?|||Kỹ thuật ánh xạ cache nào chia cache thành nhiều tập (set), mỗi khối bộ nhớ chính có thể ánh xạ vào bất kỳ dòng nào trong một tập cụ thể?",
          "options": [
            {
              "text": "Set-associative mapping|||Ánh xạ liên kết tập hợp (Set-associative)"
            },
            {
              "text": "Direct mapping|||Ánh xạ trực tiếp"
            },
            {
              "text": "Associative mapping|||Ánh xạ liên kết (Associative)"
            },
            {
              "text": "Fully-associative mapping|||Ánh xạ liên kết đầy đủ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Set-associative</b>: cache split into sets; a block maps to any line within its set.</div><div class=\"ml-vi\"><b>Liên kết tập hợp</b>: cache chia thành tập; khối vào bất kỳ dòng nào trong tập của nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The basic element of a semiconductor memory is ____?|||Phần tử cơ bản của bộ nhớ bán dẫn là ____?",
          "options": [
            {
              "text": "the memory cell|||ô nhớ (memory cell)"
            },
            {
              "text": "the memory patten|||mẫu nhớ (memory patten)"
            },
            {
              "text": "the memory word|||từ nhớ (memory word)"
            },
            {
              "text": "the memory block|||khối nhớ (memory block)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The basic building block of semiconductor memory is the <b>memory cell</b> (stores one bit).</div><div class=\"ml-vi\">Phần tử cơ bản của bộ nhớ bán dẫn là <b>ô nhớ</b> (lưu một bit).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The primary purpose of Hamming code is to:|||Mục đích chính của mã Hamming là:",
          "options": [
            {
              "text": "Detect single-bit errors only.|||Chỉ phát hiện lỗi một bit."
            },
            {
              "text": "Correct single-bit errors and detect double-bit errors.|||Sửa lỗi một bit và phát hiện lỗi hai bit."
            },
            {
              "text": "Detect burst errors.|||Phát hiện lỗi chùm (burst)."
            },
            {
              "text": "Increase memory capacity.|||Tăng dung lượng bộ nhớ."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Hamming SEC-DED code <b>corrects single-bit errors and detects double-bit errors</b>.</div><div class=\"ml-vi\">Mã Hamming (SEC-DED) <b>sửa lỗi một bit và phát hiện lỗi hai bit</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A DDR memory transfers 64 bits per clock cycle at 200 MHz. What is the peak bandwidth?|||Một bộ nhớ DDR truyền 64 bit mỗi chu kỳ xung tại 200 MHz. Băng thông đỉnh là bao nhiêu?",
          "options": [
            {
              "text": "3.2 GB/s|||3.2 GB/s"
            },
            {
              "text": "1.6 GB/s|||1.6 GB/s"
            },
            {
              "text": "2.4 GB/s|||2.4 GB/s"
            },
            {
              "text": "6.4 GB/s|||6.4 GB/s"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">DDR = double data rate → 200 MHz × 2 = 400 MT/s. 64 bit = 8 byte. 400M × 8 = <b>3.2 GB/s</b>.</div><div class=\"ml-vi\">DDR = truyền dữ liệu gấp đôi → 200 MHz × 2 = 400 MT/s. 64 bit = 8 byte. 400M × 8 = <b>3.2 GB/s</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which factor has the most significant impact on the average access time of a magnetic disk drive?|||Yếu tố nào ảnh hưởng lớn nhất tới thời gian truy cập trung bình của ổ đĩa từ?",
          "options": [
            {
              "text": "The rotational speed of the disk|||Tốc độ quay của đĩa"
            },
            {
              "text": "The size of the disk platter|||Kích thước đĩa (platter)"
            },
            {
              "text": "The type of file system used|||Loại hệ thống tập tin"
            },
            {
              "text": "The material composition of the disk surface|||Vật liệu bề mặt đĩa"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Average access time is dominated by rotational latency → the <b>rotational speed</b>.</div><div class=\"ml-vi\">Thời gian truy cập trung bình chủ yếu do độ trễ quay → <b>tốc độ quay</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a typical requirement of an I/O module?|||Điều nào sau đây KHÔNG phải là yêu cầu điển hình của một mô-đun I/O?",
          "options": [
            {
              "text": "Device communication.|||Giao tiếp thiết bị."
            },
            {
              "text": "Error detection.|||Phát hiện lỗi."
            },
            {
              "text": "Processor communication.|||Giao tiếp với bộ xử lý."
            },
            {
              "text": "Memory management.|||Quản lý bộ nhớ."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">I/O module functions: device &amp; processor communication, control, buffering, error detection. <b>Memory management</b> is not one.</div><div class=\"ml-vi\">Chức năng mô-đun I/O: giao tiếp thiết bị &amp; bộ xử lý, điều khiển, đệm, phát hiện lỗi. <b>Quản lý bộ nhớ</b> thì không.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is the correct choice for sorting in increasing speed average of memory?|||Đâu là lựa chọn đúng khi sắp xếp theo tốc độ trung bình TĂNG DẦN của bộ nhớ?",
          "options": [
            {
              "text": "SSD < Main Memory < Cache Memory < Magnetic Tape|||SSD < Main Memory < Cache Memory < Magnetic Tape"
            },
            {
              "text": "Magnetic Tape < SSD < Cache Memory < Main Memory|||Magnetic Tape < SSD < Cache Memory < Main Memory"
            },
            {
              "text": "Magnetic Disk < SSD < Main Memory < Cache Memory|||Magnetic Disk < SSD < Main Memory < Cache Memory"
            },
            {
              "text": "Magnetic Disk < Magnetic Tape < Main Memory < Cache Memory|||Magnetic Disk < Magnetic Tape < Main Memory < Cache Memory"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Increasing speed: Magnetic Disk &lt; SSD &lt; Main Memory &lt; Cache. (Tape is slower than disk, so options with tape after disk are wrong.)</div><div class=\"ml-vi\">Tốc độ tăng dần: Đĩa từ &lt; SSD &lt; Bộ nhớ chính &lt; Cache. (Băng từ chậm hơn đĩa nên các phương án đặt băng sau đĩa đều sai.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider an expression: A + (B.C). What expression is equal to the given expression?|||Xét biểu thức: A + (B.C). Biểu thức nào bằng biểu thức đã cho?",
          "options": [
            {
              "text": "(A + B).(A + C)|||(A + B).(A + C)"
            },
            {
              "text": "(A+B).C|||(A+B).C"
            },
            {
              "text": "A.(B+C)|||A.(B+C)"
            },
            {
              "text": "NOT (A.(B+C))|||NOT (A.(B+C))"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Distributive law: A + (B·C) = <b>(A+B)·(A+C)</b>.</div><div class=\"ml-vi\">Luật phân phối: A + (B·C) = <b>(A+B)·(A+C)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which I/O technique does an I/O channel or processor manage transfer of data, thus freeing the CPU?|||Trong kỹ thuật I/O nào, một kênh I/O hoặc bộ xử lý quản lý việc truyền dữ liệu, giải phóng CPU?",
          "options": [
            {
              "text": "Programmed I/O|||Programmed I/O"
            },
            {
              "text": "Interrupt-driven I/O|||Interrupt-driven I/O"
            },
            {
              "text": "Channel I/O|||Channel I/O"
            },
            {
              "text": "Memory-mapped I/O|||Memory-mapped I/O"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">With <b>Channel I/O</b>, a dedicated I/O processor/channel handles the transfer, freeing the CPU.</div><div class=\"ml-vi\">Với <b>Channel I/O</b>, một bộ xử lý/kênh I/O riêng lo việc truyền, giải phóng CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is an interrupt vector?|||Vector ngắt (interrupt vector) là gì?",
          "options": [
            {
              "text": "Part of memory which contains the addresses of interrupt handlers|||Phần bộ nhớ chứa địa chỉ của các thủ tục xử lý ngắt"
            },
            {
              "text": "A signal an I/O device sends to CPU|||Tín hiệu thiết bị I/O gửi tới CPU"
            },
            {
              "text": "A signal an I/O software sends to CPU|||Tín hiệu phần mềm I/O gửi tới CPU"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>interrupt vector</b> is the area of memory holding the addresses of the interrupt handlers.</div><div class=\"ml-vi\"><b>Vector ngắt</b> là vùng nhớ chứa địa chỉ của các thủ tục xử lý ngắt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____: If the operation involves reference to an operand in memory or available via I/O, then determine the address of the operand.|||____: Nếu thao tác cần tham chiếu tới một toán hạng trong bộ nhớ hoặc qua I/O thì xác định địa chỉ của toán hạng đó.",
          "options": [
            {
              "text": "Operand fetch|||Lấy toán hạng (Operand fetch)"
            },
            {
              "text": "Data operation|||Thao tác dữ liệu (Data operation)"
            },
            {
              "text": "Operand store|||Lưu toán hạng (Operand store)"
            },
            {
              "text": "Operand address calculation|||Tính địa chỉ toán hạng (Operand address calculation)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>Operand address calculation</b> determines the operand's address before fetching it.</div><div class=\"ml-vi\"><b>Tính địa chỉ toán hạng</b> xác định địa chỉ toán hạng trước khi lấy nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When a program is executed, what is the first step which is carried out by an operating system?|||Khi một chương trình được thực thi, bước đầu tiên do hệ điều hành thực hiện là gì?",
          "options": [
            {
              "text": "Program's instructions and data must be loaded to the computer's main memory.|||Lệnh và dữ liệu của chương trình phải được nạp vào bộ nhớ chính của máy tính."
            },
            {
              "text": "Program's instructions and data must be loaded to the Operator System's monitor memory.|||Lệnh và dữ liệu phải được nạp vào bộ nhớ giám sát của Operator System."
            },
            {
              "text": "Program's instructions and data must be splitted into frames and loaded into level 1 cache memory.|||Lệnh và dữ liệu phải được chia thành các khung (frame) và nạp vào cache mức 1."
            },
            {
              "text": "Program's instructions and data must be loaded to long-term queue.|||Lệnh và dữ liệu phải được nạp vào hàng đợi dài hạn."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">To run a program, its instructions and data must first be <b>loaded into main memory</b>.</div><div class=\"ml-vi\">Để chạy chương trình, lệnh và dữ liệu trước tiên phải được <b>nạp vào bộ nhớ chính</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which scheduling algorithm would be least effective in a system that requires real-time task execution with strict deadlines?|||Thuật toán định thời (scheduling) nào KÉM hiệu quả nhất trong hệ thống yêu cầu thực thi thời gian thực với hạn chót nghiêm ngặt?",
          "options": [
            {
              "text": "First-Come, First-Served (FCFS)|||First-Come, First-Served (FCFS)"
            },
            {
              "text": "Earliest Deadline First (EDF)|||Earliest Deadline First (EDF)"
            },
            {
              "text": "Rate Monotonic Scheduling (RMS)|||Rate Monotonic Scheduling (RMS)"
            },
            {
              "text": "Round-Robin (RR)|||Round-Robin (RR)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>FCFS</b> ignores deadlines/priorities, so it is least effective for hard real-time tasks.</div><div class=\"ml-vi\"><b>FCFS</b> bỏ qua hạn chót/ưu tiên nên kém hiệu quả nhất cho tác vụ thời gian thực.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which technique involves dividing physical memory into fixed-size or variable-size blocks to allocate memory to processes?|||Kỹ thuật nào chia bộ nhớ vật lý thành các khối kích thước cố định hoặc thay đổi để cấp phát bộ nhớ cho các tiến trình?",
          "options": [
            {
              "text": "Partitioning|||Phân vùng (Partitioning)"
            },
            {
              "text": "Swapping|||Hoán đổi (Swapping)"
            },
            {
              "text": "Paging|||Phân trang (Paging)"
            },
            {
              "text": "Translation Lookaside Buffer|||Bộ đệm dịch địa chỉ (TLB)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Partitioning</b> divides memory into fixed- or variable-size blocks for processes (paging is fixed-size only).</div><div class=\"ml-vi\"><b>Phân vùng</b> chia bộ nhớ thành khối cố định hoặc thay đổi cho tiến trình (phân trang chỉ cố định).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Boolean algebra involves treating x and y as numeric variables. Choose the option that contains two equivalent expressions.|||Đại số Boole coi x và y là biến số. Chọn phương án chứa hai biểu thức tương đương.",
          "options": [
            {
              "text": "NOT ( x > 10 AND y > 15 ), x <= 10 OR y <= 15|||NOT ( x > 10 AND y > 15 ), x <= 10 OR y <= 15"
            },
            {
              "text": "NOT ( x > 10 AND y > 15 ), x <= 10 AND y <= 15|||NOT ( x > 10 AND y > 15 ), x <= 10 AND y <= 15"
            },
            {
              "text": "NOT ( x > 10 AND y > 15 ), x < 10 OR y < 15|||NOT ( x > 10 AND y > 15 ), x < 10 OR y < 15"
            },
            {
              "text": "NOT ( x > 10 AND y > 15 ), x < 10 AND y < 15|||NOT ( x > 10 AND y > 15 ), x < 10 AND y < 15"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">De Morgan: NOT(x&gt;10 AND y&gt;15) = (NOT x&gt;10) OR (NOT y&gt;15) = <b>x&lt;=10 OR y&lt;=15</b>.</div><div class=\"ml-vi\">De Morgan: NOT(x&gt;10 AND y&gt;15) = (NOT x&gt;10) OR (NOT y&gt;15) = <b>x&lt;=10 OR y&lt;=15</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which logic gate produces a high output (1) only when all of its inputs are high?|||Cổng logic nào cho đầu ra cao (1) chỉ khi TẤT CẢ đầu vào đều cao?",
          "options": [
            {
              "text": "XOR|||XOR"
            },
            {
              "text": "AND|||AND"
            },
            {
              "text": "OR|||OR"
            },
            {
              "text": "NOT|||NOT"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>AND</b> gate outputs 1 only when every input is 1.</div><div class=\"ml-vi\">Cổng <b>AND</b> cho ra 1 chỉ khi mọi đầu vào đều là 1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If you have an integer number +18 in sign magnitude representation, which is 00010010, what is the correct option for -18?|||Nếu số nguyên +18 ở dạng dấu-độ lớn (sign magnitude) là 00010010, thì -18 là gì?",
          "options": [
            {
              "text": "00010010|||00010010"
            },
            {
              "text": "10010010|||10010010"
            },
            {
              "text": "11110010|||11110010"
            },
            {
              "text": "01110010|||01110010"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sign-magnitude: keep the magnitude, flip the sign bit to 1 → <b>1</b>0010010.</div><div class=\"ml-vi\">Dấu-độ lớn: giữ nguyên độ lớn, đổi bit dấu thành 1 → <b>1</b>0010010.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The ____ of two logical operands is 1 if and only if exactly one of the operands has the value 1.|||____ của hai toán hạng logic bằng 1 khi và chỉ khi đúng một toán hạng có giá trị 1.",
          "options": [
            {
              "text": "NOR|||NOR"
            },
            {
              "text": "OR|||OR"
            },
            {
              "text": "AND|||AND"
            },
            {
              "text": "XOR|||XOR"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>XOR</b> is 1 iff exactly one operand is 1.</div><div class=\"ml-vi\"><b>XOR</b> bằng 1 khi và chỉ khi đúng một toán hạng bằng 1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A combinational circuit receives two 4-bit binary numbers as inputs and produces a single-bit output. Which of the following circuit types must be used if the output represents whether the first number is greater than the second?|||Một mạch tổ hợp nhận hai số nhị phân 4 bit và cho một đầu ra 1 bit. Loại mạch nào phải dùng nếu đầu ra biểu thị số thứ nhất có lớn hơn số thứ hai không?",
          "options": [
            {
              "text": "Full Adder|||Bộ cộng đầy đủ (Full Adder)"
            },
            {
              "text": "Multiplexer|||Bộ dồn kênh (Multiplexer)"
            },
            {
              "text": "Comparator|||Bộ so sánh (Comparator)"
            },
            {
              "text": "Decoder|||Bộ giải mã (Decoder)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Comparing two numbers (greater/less/equal) is the job of a <b>comparator</b>.</div><div class=\"ml-vi\">So sánh hai số (lớn/nhỏ/bằng) là nhiệm vụ của <b>bộ so sánh</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is not an operand type?|||Điều nào sau đây KHÔNG phải là một kiểu toán hạng?",
          "options": [
            {
              "text": "Addresses|||Địa chỉ (Addresses)"
            },
            {
              "text": "Logical data|||Dữ liệu logic (Logical data)"
            },
            {
              "text": "Value|||Giá trị (Value)"
            },
            {
              "text": "Characters|||Ký tự (Characters)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Operand types are addresses, numbers, characters, logical data. <b>Value</b> is not a distinct operand type.</div><div class=\"ml-vi\">Các kiểu toán hạng: địa chỉ, số, ký tự, dữ liệu logic. <b>Giá trị</b> không phải một kiểu riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a branch instruction?|||Lệnh rẽ nhánh (branch instruction) là gì?",
          "options": [
            {
              "text": "The instructions that are used to divide a program into multiple subprograms|||Lệnh dùng để chia chương trình thành nhiều chương trình con"
            },
            {
              "text": "The instructions that have as one of its operands the address of the next instruction to be executed|||Lệnh có một toán hạng là địa chỉ của lệnh kế tiếp cần thực thi"
            },
            {
              "text": "The instructions that are used to pause the program|||Lệnh dùng để tạm dừng chương trình"
            },
            {
              "text": "The instructions that are used to return to the beginning of the program|||Lệnh dùng để quay về đầu chương trình"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>branch</b> instruction carries the address of the next instruction to execute as one of its operands.</div><div class=\"ml-vi\">Lệnh <b>rẽ nhánh</b> mang một toán hạng là địa chỉ của lệnh kế tiếp cần thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of addressing modes with both indirect addressing and indexing, what is postindexing?|||Trong ngữ cảnh chế độ địa chỉ có cả địa chỉ gián tiếp và chỉ số (indexing), postindexing là gì?",
          "options": [
            {
              "text": "Indexing is performed after the indirection|||Chỉ số được thực hiện SAU khi gián tiếp (indirection)"
            },
            {
              "text": "Indexing is performed before the indirection|||Chỉ số được thực hiện TRƯỚC khi gián tiếp"
            },
            {
              "text": "Both indexing and indirection are avoided|||Cả chỉ số và gián tiếp đều bị bỏ qua"
            },
            {
              "text": "Indexing and indirection occur simultaneously|||Chỉ số và gián tiếp xảy ra đồng thời"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Postindexing</b>: the indirection is applied first, then the index is added.</div><div class=\"ml-vi\"><b>Postindexing</b>: gián tiếp được áp dụng trước, sau đó mới cộng chỉ số.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following PDP series computers is known for its use of 12-bit instructions and a single general-purpose register, the accumulator?|||Dòng máy PDP nào nổi tiếng vì dùng lệnh 12 bit và một thanh ghi đa dụng duy nhất là accumulator?",
          "options": [
            {
              "text": "PDP-8|||PDP-8"
            },
            {
              "text": "PDP-10|||PDP-10"
            },
            {
              "text": "PDP-11|||PDP-11"
            },
            {
              "text": "PDP-6|||PDP-6"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>PDP-8</b> used 12-bit instructions and a single accumulator register.</div><div class=\"ml-vi\"><b>PDP-8</b> dùng lệnh 12 bit và một thanh ghi accumulator duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In MASM32, which command is incorrect?|||Trong MASM32, lệnh nào KHÔNG hợp lệ?",
          "options": [
            {
              "text": "ADD EAX, a|||ADD EAX, a"
            },
            {
              "text": "ADD EAX, EBX|||ADD EAX, EBX"
            },
            {
              "text": "ADD a, EAX|||ADD a, EAX"
            },
            {
              "text": "ADD a, b|||ADD a, b"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">x86 cannot add memory to memory: <b>ADD a, b</b> (both operands are memory variables) is invalid.</div><div class=\"ml-vi\">x86 không cộng bộ nhớ với bộ nhớ: <b>ADD a, b</b> (cả hai toán hạng đều là biến nhớ) là không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Steps for executing a machine instruction are concerned, given an assembly code: ADD EAX, V. What step will access the variable V?|||Xét các bước thực thi một lệnh máy với mã hợp ngữ: ADD EAX, V. Bước nào sẽ truy cập biến V?",
          "options": [
            {
              "text": "The fetch data step.|||Bước lấy dữ liệu (fetch data)."
            },
            {
              "text": "The fetch instruction step.|||Bước lấy lệnh (fetch instruction)."
            },
            {
              "text": "The process data step.|||Bước xử lý dữ liệu (process data)."
            },
            {
              "text": "The interpret instruction step.|||Bước thông dịch lệnh (interpret instruction)."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Reading the operand V from memory happens in the <b>fetch data</b> (operand fetch) step.</div><div class=\"ml-vi\">Đọc toán hạng V từ bộ nhớ diễn ra ở bước <b>lấy dữ liệu</b> (operand fetch).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The PC, IR, MAR, MBR registers belong to which of the following groups?|||Các thanh ghi PC, IR, MAR, MBR thuộc nhóm nào sau đây?",
          "options": [
            {
              "text": "Control and Status Registers|||Thanh ghi điều khiển và trạng thái (Control and Status)"
            },
            {
              "text": "User-Visible Registers|||Thanh ghi người dùng thấy được (User-Visible)"
            },
            {
              "text": "General Registers|||Thanh ghi đa dụng (General)"
            },
            {
              "text": "Handle Registers|||Thanh ghi Handle"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">PC, IR, MAR, MBR are <b>control and status registers</b> used by the CU, not visible to programmers.</div><div class=\"ml-vi\">PC, IR, MAR, MBR là <b>thanh ghi điều khiển và trạng thái</b> do CU dùng, lập trình viên không thấy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the significance of the program counter (PC) in the fetch phase of the instruction cycle?|||Ý nghĩa của bộ đếm chương trình (PC) trong pha lấy lệnh (fetch) của chu kỳ lệnh là gì?",
          "options": [
            {
              "text": "The program counter (PC) is not used in the fetch phase, and its role is limited to tracking the number of instructions executed by the CPU|||PC không được dùng trong pha fetch, vai trò của nó chỉ là đếm số lệnh CPU đã thực thi"
            },
            {
              "text": "The program counter (PC) in the fetch phase holds the memory address of the next instruction to be fetched and executed|||PC trong pha fetch giữ địa chỉ bộ nhớ của lệnh kế tiếp cần lấy và thực thi"
            },
            {
              "text": "The program counter (PC) is responsible for executing instructions and has no specific role during the fetch phase|||PC chịu trách nhiệm thực thi lệnh và không có vai trò cụ thể trong pha fetch"
            },
            {
              "text": "The program counter (PC) is only relevant in multi-core processors and does not contribute to the fetch phase of the instruction cycle in single-core systems|||PC chỉ liên quan tới bộ xử lý đa nhân, không đóng góp vào pha fetch trong hệ đơn nhân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the fetch phase the <b>PC holds the address of the next instruction</b> to fetch and execute.</div><div class=\"ml-vi\">Trong pha fetch, <b>PC giữ địa chỉ của lệnh kế tiếp</b> cần lấy và thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When considering the number of pipeline stages, what trade-offs must be made in computer architecture?|||Khi xét số tầng của pipeline, phải cân nhắc đánh đổi (trade-off) nào trong kiến trúc máy tính?",
          "options": [
            {
              "text": "Trade-offs between potential speedup and increased cost and delays|||Đánh đổi giữa tốc độ tăng thêm và chi phí, độ trễ tăng lên"
            },
            {
              "text": "Trade-offs between software and hardware|||Đánh đổi giữa phần mềm và phần cứng"
            },
            {
              "text": "Trade-offs between speed and efficiency|||Đánh đổi giữa tốc độ và hiệu suất"
            },
            {
              "text": "Trade-offs between branching and executing instructions with conditions|||Đánh đổi giữa rẽ nhánh và thực thi lệnh có điều kiện"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">More pipeline stages give more <b>speedup</b> but add <b>cost and control/hazard delays</b>.</div><div class=\"ml-vi\">Nhiều tầng pipeline cho <b>tốc độ</b> cao hơn nhưng tăng <b>chi phí và độ trễ điều khiển/hazard</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement is incorrect about RISC and CISC architecture?|||Phát biểu nào sau đây SAI về kiến trúc RISC và CISC?",
          "options": [
            {
              "text": "CISC architecture is more convenient for programmers than RISC architecture.|||Kiến trúc CISC thuận tiện cho lập trình viên hơn RISC."
            },
            {
              "text": "CISC architecture has more operands in a instruction compared to RISC architecture.|||Kiến trúc CISC có nhiều toán hạng trong một lệnh hơn RISC."
            },
            {
              "text": "CISC architecture has a more flexible instruction set than RISC architecture.|||Kiến trúc CISC có tập lệnh linh hoạt hơn RISC."
            },
            {
              "text": "CISC architecture requires more general-purpose registers than RISC architecture.|||Kiến trúc CISC cần nhiều thanh ghi đa dụng hơn RISC."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">It is <b>RISC</b> that has more general-purpose registers, not CISC — so option D is the false statement.</div><div class=\"ml-vi\">Chính <b>RISC</b> mới có nhiều thanh ghi đa dụng, không phải CISC — nên phương án D là phát biểu sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is one of the advantages of using a register file in computer architecture?|||Một trong những lợi ích của việc dùng tệp thanh ghi (register file) trong kiến trúc máy tính là gì?",
          "options": [
            {
              "text": "Reduction in memory accesses, saving time|||Giảm số lần truy cập bộ nhớ, tiết kiệm thời gian"
            },
            {
              "text": "More efficient use of space due to dynamic adaptation|||Dùng không gian hiệu quả hơn nhờ thích ứng động"
            },
            {
              "text": "Efficient handling of both local and global variables|||Xử lý hiệu quả cả biến cục bộ và toàn cục"
            },
            {
              "text": "Easier management of cache residency|||Quản lý cache dễ hơn"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A register file keeps operands on-chip, <b>reducing slow memory accesses</b> and saving time.</div><div class=\"ml-vi\">Tệp thanh ghi giữ toán hạng ngay trên chip, <b>giảm truy cập bộ nhớ chậm</b> và tiết kiệm thời gian.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which RISC feature simplifies instruction decoding?|||Đặc điểm nào của RISC giúp đơn giản hóa việc giải mã lệnh?",
          "options": [
            {
              "text": "Variable instruction format|||Định dạng lệnh thay đổi"
            },
            {
              "text": "Large instruction set|||Tập lệnh lớn"
            },
            {
              "text": "Fixed-length instructions|||Lệnh có độ dài cố định"
            },
            {
              "text": "Multiple addressing modes|||Nhiều chế độ địa chỉ"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Fixed-length instructions</b> make decoding simple and uniform.</div><div class=\"ml-vi\"><b>Lệnh độ dài cố định</b> khiến việc giải mã đơn giản và đồng nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a scalar instruction?|||Lệnh vô hướng (scalar instruction) là gì?",
          "options": [
            {
              "text": "An instruction in which all operands must be single values.|||Lệnh mà mọi toán hạng phải là giá trị đơn."
            },
            {
              "text": "An instruction in which all operands must be groups such as arrays.|||Lệnh mà mọi toán hạng phải là nhóm như mảng."
            },
            {
              "text": "An instruction in which all operands can be single values or groups.|||Lệnh mà toán hạng có thể là giá trị đơn hoặc nhóm."
            },
            {
              "text": "An instruction in which has no operand.|||Lệnh không có toán hạng."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>scalar</b> instruction operates on single data values (vs vector, which operates on arrays).</div><div class=\"ml-vi\">Lệnh <b>vô hướng</b> thao tác trên các giá trị đơn (khác lệnh vector thao tác trên mảng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ is (are) determined by the number of instructions that can be fetched and executed at the same time (the number of parallel pipelines) and by the speed and sophistication of the mechanisms that the processor uses to find independent instructions.|||____ được quyết định bởi số lệnh có thể được lấy và thực thi cùng lúc (số pipeline song song) và bởi tốc độ, độ tinh vi của cơ chế mà bộ xử lý dùng để tìm các lệnh độc lập.",
          "options": [
            {
              "text": "Instruction-level parallelism|||Song song mức lệnh (Instruction-level parallelism)"
            },
            {
              "text": "Machine parallelism|||Song song máy (Machine parallelism)"
            },
            {
              "text": "Both instruction-level parallelism and machine parallelism|||Cả hai"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Machine parallelism</b> is the processor's ability to exploit ILP, set by parallel pipelines and instruction-issue mechanisms.</div><div class=\"ml-vi\"><b>Song song máy</b> là khả năng của bộ xử lý khai thác ILP, quyết định bởi số pipeline song song và cơ chế phát lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following types of processors typically offer better performance for parallel processing?|||Loại bộ xử lý nào thường cho hiệu năng tốt hơn cho xử lý song song?",
          "options": [
            {
              "text": "Single-core processors|||Bộ xử lý đơn nhân"
            },
            {
              "text": "Multi-core processors|||Bộ xử lý đa nhân"
            },
            {
              "text": "Microelectronics|||Vi điện tử (Microelectronics)"
            },
            {
              "text": "Digital signal processors (DSPs)|||Bộ xử lý tín hiệu số (DSP)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Multi-core</b> processors run multiple threads truly in parallel.</div><div class=\"ml-vi\">Bộ xử lý <b>đa nhân</b> chạy nhiều luồng song song thực sự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which write technique in which all write operations are made to main memory as well as to the cache, ensuring that main memory is always valid.|||Kỹ thuật ghi nào mà mọi thao tác ghi đều được ghi vào cả bộ nhớ chính lẫn cache, đảm bảo bộ nhớ chính luôn hợp lệ?",
          "options": [
            {
              "text": "Write through|||Write through"
            },
            {
              "text": "Write back|||Write back"
            },
            {
              "text": "Write around|||Write around"
            },
            {
              "text": "No write allocate|||No write allocate"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Write-through</b> writes to cache AND main memory at once, so memory is always up to date.</div><div class=\"ml-vi\"><b>Write-through</b> ghi vào cache VÀ bộ nhớ chính cùng lúc nên bộ nhớ luôn cập nhật.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In parallel ALUs, what is the primary factor determining performance improvement?|||Ở các ALU song song, yếu tố chính quyết định cải thiện hiệu năng là gì?",
          "options": [
            {
              "text": "The number of registers in the system.|||Số thanh ghi trong hệ thống."
            },
            {
              "text": "The size of the instruction cache.|||Kích thước cache lệnh."
            },
            {
              "text": "The ability to execute multiple operations simultaneously.|||Khả năng thực thi nhiều thao tác đồng thời."
            },
            {
              "text": "The clock speed of the processor.|||Tốc độ xung nhịp của bộ xử lý."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Parallel ALUs speed things up through their <b>ability to execute multiple operations simultaneously</b>.</div><div class=\"ml-vi\">ALU song song tăng tốc nhờ <b>khả năng thực thi nhiều thao tác đồng thời</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Follow the Amdahl's law for multiprocessors, if only 10% of the code is inherently serial (f = 0.9), running the program on a multicore system with 4 processors, a performance gain (speedup factor) would be ____.|||Theo định luật Amdahl cho đa xử lý, nếu chỉ 10% mã là tuần tự cố hữu (f = 0.9), chạy chương trình trên hệ đa nhân với 4 bộ xử lý thì độ lợi hiệu năng (hệ số tăng tốc) là ____.",
          "options": [
            {
              "text": "307%|||307%"
            },
            {
              "text": "297%|||297%"
            },
            {
              "text": "317%|||317%"
            },
            {
              "text": "327%|||327%"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Speedup = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08× → about <b>307%</b>.</div><div class=\"ml-vi\">Tăng tốc = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08 lần → khoảng <b>307%</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main performance benefit of multicore processors?|||Lợi ích hiệu năng chính của bộ xử lý đa nhân là gì?",
          "options": [
            {
              "text": "Reduced power consumption|||Giảm tiêu thụ điện"
            },
            {
              "text": "Higher LOck speed|||Tốc độ xung cao hơn"
            },
            {
              "text": "Improved serial performance|||Cải thiện hiệu năng tuần tự"
            },
            {
              "text": "Parallel task execution|||Thực thi tác vụ song song"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The main benefit of multicore is <b>parallel task execution</b> across cores.</div><div class=\"ml-vi\">Lợi ích chính của đa nhân là <b>thực thi tác vụ song song</b> trên nhiều nhân.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D2",
      "source": "REAL",
      "sortOrder": 1,
      "title": "Đề 2 — Final Exam (SP26)|||Đề 2 — Thi cuối kỳ (SP26)",
      "description": "Real FE multiple-choice paper (CEA201, Spring 2026), 50 questions with the school's own answer key.|||Đề trắc nghiệm FE thật (CEA201, kỳ Xuân 2026), 50 câu kèm đáp án chính thức của trường.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ refers to the operational units and their interconnections that realize the architectural specifications.|||____ đề cập tới các đơn vị vận hành và sự kết nối giữa chúng nhằm hiện thực hóa các đặc tả kiến trúc.",
          "options": [
            {
              "text": "Computer architecture|||Kiến trúc máy tính (Computer architecture)"
            },
            {
              "text": "Computer function|||Chức năng máy tính (Computer function)"
            },
            {
              "text": "Computer organization|||Tổ chức máy tính (Computer organization)"
            },
            {
              "text": "Instruction set architecture|||Kiến trúc tập lệnh (Instruction set architecture)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Computer <b>organization</b> is the operational units and their interconnections that realize the architecture (the 'how'); architecture is what the programmer sees.</div><div class=\"ml-vi\"><b>Tổ chức máy tính</b> là các đơn vị vận hành và cách chúng nối với nhau để hiện thực hóa kiến trúc (cái 'làm thế nào'); kiến trúc là cái lập trình viên nhìn thấy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A benchmark program is run on a 40 MHz processor. The executed program consists of 100,000 instruction executions, with the following instruction mix and clock cycle count. What is MIPS (Million Instructions per Second) rate?<table class=\"exam-table\"><thead><tr><th>Instruction Type</th><th>CPI</th><th>Instruction Mix (%)</th></tr></thead><tbody><tr><td>Arithmetic and logic</td><td>1</td><td>45</td></tr><tr><td>Data transfer</td><td>2</td><td>32</td></tr><tr><td>Floating point</td><td>2</td><td>15</td></tr><tr><td>Control transfer</td><td>2</td><td>8</td></tr></tbody></table>|||Một chương trình benchmark chạy trên bộ xử lý 40 MHz. Chương trình thực thi gồm 100.000 lần thực thi lệnh, với tỉ lệ lệnh và số chu kỳ như bảng dưới. Tốc độ MIPS (triệu lệnh mỗi giây) là bao nhiêu?<table class=\"exam-table\"><thead><tr><th>Loại lệnh</th><th>CPI</th><th>Tỉ lệ lệnh (%)</th></tr></thead><tbody><tr><td>Số học và logic</td><td>1</td><td>45</td></tr><tr><td>Truyền dữ liệu</td><td>2</td><td>32</td></tr><tr><td>Dấu chấm động</td><td>2</td><td>15</td></tr><tr><td>Rẽ nhánh/điều khiển</td><td>2</td><td>8</td></tr></tbody></table>",
          "options": [
            {
              "text": "22.8|||22.8"
            },
            {
              "text": "23.8|||23.8"
            },
            {
              "text": "24.8|||24.8"
            },
            {
              "text": "25.8|||25.8"
            },
            {
              "text": "26.8|||26.8"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Average CPI = 1·0.45 + 2·0.32 + 2·0.15 + 2·0.08 = 1.55. MIPS = clock/(CPI×10⁶) = 40×10⁶/(1.55×10⁶) ≈ <b>25.8</b>.</div><div class=\"ml-vi\">CPI trung bình = 1·0.45 + 2·0.32 + 2·0.15 + 2·0.08 = 1.55. MIPS = xung/(CPI×10⁶) = 40×10⁶/(1.55×10⁶) ≈ <b>25.8</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which mechanism enables communication between the CPU, main memory, and I/O in a computer system?|||Cơ chế nào cho phép giao tiếp giữa CPU, bộ nhớ chính và I/O trong hệ thống máy tính?",
          "options": [
            {
              "text": "USB Port|||Cổng USB"
            },
            {
              "text": "Buffer|||Bộ đệm (Buffer)"
            },
            {
              "text": "System Interconnection|||Kết nối hệ thống (System Interconnection)"
            },
            {
              "text": "Data Bus|||Bus dữ liệu (Data Bus)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>system interconnection</b> (the bus structure) links CPU, memory, and I/O. The data bus is only one part of it.</div><div class=\"ml-vi\"><b>Kết nối hệ thống</b> (cấu trúc bus) nối CPU, bộ nhớ và I/O. Bus dữ liệu chỉ là một phần của nó.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The stored-program concept means a computer could get its instructions by reading them from memory, and a program could be set or altered by setting the values of a portion of memory.|||Khái niệm chương trình lưu trữ (stored-program) nghĩa là máy tính có thể lấy lệnh bằng cách đọc từ bộ nhớ, và một chương trình có thể được thiết lập hoặc thay đổi bằng cách đặt giá trị cho một phần bộ nhớ.",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is the definition of the <b>stored-program concept</b> (von Neumann) — <b>True</b>.</div><div class=\"ml-vi\">Đây chính là định nghĩa của <b>khái niệm chương trình lưu trữ</b> (von Neumann) — <b>Đúng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is Memory Address Register (MAR)?|||Thanh ghi địa chỉ bộ nhớ (MAR) là gì?",
          "options": [
            {
              "text": "Contains a word to be stored in memory or sent to the I/O unit, or is used to receive a word from memory or from the I/O unit.|||Chứa một từ (word) sẽ được lưu vào bộ nhớ hoặc gửi tới đơn vị I/O, hoặc dùng để nhận một từ từ bộ nhớ/I/O."
            },
            {
              "text": "Employed to hold temporarily the righthand instruction from a word in memory.|||Dùng để tạm giữ lệnh bên phải trong một từ nhớ."
            },
            {
              "text": "Contains the address in memory of the word to be written from or read into the MBR.|||Chứa địa chỉ trong bộ nhớ của từ cần ghi ra từ MBR hoặc đọc vào MBR."
            },
            {
              "text": "Contains the address of the next instruction pair to be fetched from memory.|||Chứa địa chỉ của cặp lệnh kế tiếp cần lấy từ bộ nhớ."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">MAR holds the <b>memory address</b> of the word to be read into or written from the MBR. (Option A describes the MBR.)</div><div class=\"ml-vi\">MAR giữ <b>địa chỉ bộ nhớ</b> của từ cần đọc vào hoặc ghi ra từ MBR. (Phương án A mô tả MBR.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are two roles of the instruction register (IR) during the instruction cycle?|||Hai vai trò của thanh ghi lệnh (IR) trong chu kỳ lệnh là gì?",
          "options": [
            {
              "text": "To store the next instruction to be executed.|||Lưu lệnh kế tiếp cần thực thi."
            },
            {
              "text": "To hold the fetched instruction from memory.|||Giữ lệnh vừa được lấy từ bộ nhớ."
            },
            {
              "text": "To interpret the fetched instruction.|||Thông dịch lệnh vừa được lấy."
            },
            {
              "text": "To calculate the address of the next instruction.|||Tính địa chỉ của lệnh kế tiếp."
            },
            {
              "text": "To transfer instructions to the program counter (PC).|||Chuyển lệnh sang bộ đếm chương trình (PC)."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The IR <b>holds the fetched instruction</b> so the control unit can decode it. (The answer key marks B.)</div><div class=\"ml-vi\">IR <b>giữ lệnh vừa được lấy</b> để đơn vị điều khiển giải mã. (Đáp án của đề chọn B.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of interrupt is exemplified by \"division by zero, attempt to execute an illegal machine instruction\"?|||Loại ngắt nào được minh họa bởi \"chia cho 0, cố thực thi một lệnh máy bất hợp lệ\"?",
          "options": [
            {
              "text": "Program|||Chương trình (Program)"
            },
            {
              "text": "Timer|||Bộ định thời (Timer)"
            },
            {
              "text": "I/O|||I/O"
            },
            {
              "text": "Hardware failure|||Hỏng phần cứng (Hardware failure)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Errors caused by executing an instruction (divide-by-zero, illegal opcode) are <b>program interrupts</b>.</div><div class=\"ml-vi\">Lỗi do thực thi lệnh (chia 0, mã lệnh bất hợp lệ) là <b>ngắt chương trình</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following component does not belong to central processing unit?|||Thành phần nào sau đây KHÔNG thuộc bộ xử lý trung tâm (CPU)?",
          "options": [
            {
              "text": "Arithmetic and logic unit|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "Set of general-purpose registers|||Tập thanh ghi đa dụng"
            },
            {
              "text": "Main Memory|||Bộ nhớ chính (Main Memory)"
            },
            {
              "text": "Control unit|||Đơn vị điều khiển (CU)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Main memory</b> is outside the CPU. The CPU contains the ALU, registers, and control unit.</div><div class=\"ml-vi\"><b>Bộ nhớ chính</b> nằm ngoài CPU. CPU gồm ALU, thanh ghi và đơn vị điều khiển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which component connects CPU, memory, and I/O devices in a computer system?|||Thành phần nào kết nối CPU, bộ nhớ và các thiết bị I/O trong hệ thống máy tính?",
          "options": [
            {
              "text": "Control Unit|||Đơn vị điều khiển (CU)"
            },
            {
              "text": "ALU|||ALU"
            },
            {
              "text": "Bus|||Bus"
            },
            {
              "text": "Register File|||Tệp thanh ghi (Register File)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>bus</b> is the shared pathway connecting CPU, memory, and I/O.</div><div class=\"ml-vi\"><b>Bus</b> là đường truyền chung nối CPU, bộ nhớ và I/O.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following algorithms is not typically used in cache memory replacement?|||Thuật toán nào sau đây KHÔNG thường được dùng trong thay thế cache?",
          "options": [
            {
              "text": "Least Recently Used (LRU)|||Ít được dùng gần đây nhất (LRU)"
            },
            {
              "text": "First-In-First-Out (FIFO)|||Vào trước ra trước (FIFO)"
            },
            {
              "text": "Least Frequently Used (LFU)|||Ít được dùng thường xuyên nhất (LFU)"
            },
            {
              "text": "Round Robin (RR)|||Xoay vòng (Round Robin)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Cache replacement uses LRU, FIFO, LFU (and random). <b>Round-Robin</b> is a CPU scheduling policy, not a cache replacement one.</div><div class=\"ml-vi\">Thay thế cache dùng LRU, FIFO, LFU (và ngẫu nhiên). <b>Round-Robin</b> là chính sách định thời CPU, không phải thay thế cache.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a memory hierarchy system, which factor primarily influences the decision to implement a multi-level cache rather than a single-level cache?|||Trong hệ phân cấp bộ nhớ, yếu tố nào chủ yếu quyết định việc dùng cache nhiều mức thay vì cache một mức?",
          "options": [
            {
              "text": "The complexity of the cache replacement algorithm|||Độ phức tạp của thuật toán thay thế cache"
            },
            {
              "text": "The need to reduce the cache hit rate|||Nhu cầu giảm tỉ lệ trúng cache (hit rate)"
            },
            {
              "text": "The trade-off between access time and cache capacity|||Sự đánh đổi giữa thời gian truy cập và dung lượng cache"
            },
            {
              "text": "The cost of DRAM compared to SRAM|||Chi phí DRAM so với SRAM"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Multi-level caches balance the <b>trade-off between access time and capacity</b>: a small fast L1 plus a larger slower L2/L3.</div><div class=\"ml-vi\">Cache nhiều mức cân bằng <b>đánh đổi giữa thời gian truy cập và dung lượng</b>: L1 nhỏ-nhanh cùng L2/L3 lớn-chậm hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a set-associative cache design, what is the primary reason for increasing the number of cache sets (higher associativity)?|||Trong thiết kế cache liên kết-tập hợp, lý do chính để tăng độ liên kết (associativity) là gì?",
          "options": [
            {
              "text": "To decrease the cache size|||Giảm kích thước cache"
            },
            {
              "text": "To improve cache replacement policy performance|||Cải thiện hiệu năng chính sách thay thế"
            },
            {
              "text": "To reduce conflict misses|||Giảm lỗi xung đột (conflict misses)"
            },
            {
              "text": "To increase cache access speed|||Tăng tốc độ truy cập cache"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Higher associativity gives a block more candidate lines, <b>reducing conflict misses</b>.</div><div class=\"ml-vi\">Độ liên kết cao hơn cho mỗi khối nhiều dòng ứng cử hơn, <b>giảm lỗi xung đột</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A byte addressable microprocessor has 24 bit address. What is maximum memory capacity?|||Một vi xử lý định địa chỉ theo byte có địa chỉ 24 bit. Dung lượng bộ nhớ tối đa là bao nhiêu?",
          "options": [
            {
              "text": "4 MegaByte|||4 MegaByte"
            },
            {
              "text": "8 MegaByte|||8 MegaByte"
            },
            {
              "text": "16 MegaByte|||16 MegaByte"
            },
            {
              "text": "32 MegaByte|||32 MegaByte"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">2²⁴ bytes = <b>16 MB</b> of addressable memory.</div><div class=\"ml-vi\">2²⁴ byte = <b>16 MB</b> bộ nhớ định địa chỉ được.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In error correcting code (single ECC), how many bits are used to correct one bit in 8-bit data?|||Trong mã sửa lỗi đơn (single ECC), cần bao nhiêu bit để sửa một bit lỗi trong dữ liệu 8 bit?",
          "options": [
            {
              "text": "4.|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Hamming needs 2ᵏ ≥ m+k+1. For m=8, k=<b>4</b> (2⁴=16 ≥ 13).</div><div class=\"ml-vi\">Mã Hamming cần 2ᵏ ≥ m+k+1. Với m=8, k=<b>4</b> (2⁴=16 ≥ 13).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using Hamming Code with one error correction to store a 12-bit word in memory, the stored word 101001011101 consists of 8 bits data and 4 bits parity check. What are the data bits?|||Dùng mã Hamming sửa một lỗi để lưu một từ 12 bit trong bộ nhớ, từ đã lưu 101001011101 gồm 8 bit dữ liệu và 4 bit parity. Các bit dữ liệu là gì?",
          "options": [
            {
              "text": "01001101|||01001101"
            },
            {
              "text": "10100100|||10100100"
            },
            {
              "text": "10101011|||10101011"
            },
            {
              "text": "01011101|||01011101"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Removing the parity bits at positions 1, 2, 4, 8 from the stored word does not match options A–D, so the answer is <b>None of the mentioned</b>.</div><div class=\"ml-vi\">Bỏ các bit parity ở vị trí 1, 2, 4, 8 khỏi từ đã lưu không khớp phương án A–D, nên đáp án là <b>Không đáp án nào</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which component inside an HDD is responsible for reading and writing data?|||Thành phần nào bên trong ổ cứng HDD chịu trách nhiệm đọc và ghi dữ liệu?",
          "options": [
            {
              "text": "The platter|||Đĩa từ (platter)"
            },
            {
              "text": "The spindle motor|||Động cơ trục quay (spindle motor)"
            },
            {
              "text": "Read/Write Head|||Đầu đọc/ghi (Read/Write Head)"
            },
            {
              "text": "The power supply|||Bộ nguồn"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The <b>read/write head</b> reads and writes data on the platter surface.</div><div class=\"ml-vi\"><b>Đầu đọc/ghi</b> đọc và ghi dữ liệu trên bề mặt đĩa từ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does RAID stand for in the context of disk storage systems?|||RAID là viết tắt của gì trong hệ thống lưu trữ đĩa?",
          "options": [
            {
              "text": "Redundant Array of Independent Disks.|||Redundant Array of Independent Disks (Mảng đĩa độc lập dư thừa)."
            },
            {
              "text": "Reliable Array of Integrated Drives.|||Reliable Array of Integrated Drives."
            },
            {
              "text": "Random Access Integrated Database.|||Random Access Integrated Database."
            },
            {
              "text": "Redundant Access Independent Database.|||Redundant Access Independent Database."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>RAID = Redundant Array of Independent Disks</b>.</div><div class=\"ml-vi\"><b>RAID = Redundant Array of Independent Disks</b> (mảng đĩa độc lập dư thừa).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In terms of performance, what is the main advantage of a solid state drive over a magnetic disk?|||Về hiệu năng, ưu điểm chính của ổ SSD so với đĩa từ là gì?",
          "options": [
            {
              "text": "A solid state drive has faster access time, lower latency, and higher reliability|||SSD có thời gian truy cập nhanh hơn, độ trễ thấp hơn và độ tin cậy cao hơn"
            },
            {
              "text": "A solid state drive has larger capacity, lower power consumption, and lower cost|||SSD có dung lượng lớn hơn, tiêu thụ điện thấp hơn và chi phí thấp hơn"
            },
            {
              "text": "A solid state drive has better compatibility, longer lifespan, and higher security|||SSD tương thích tốt hơn, tuổi thọ dài hơn và bảo mật cao hơn"
            },
            {
              "text": "A solid state drive has none of the mentioned advantages over a magnetic disk|||SSD không có ưu điểm nào nêu trên so với đĩa từ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">SSDs win on <b>faster access time, lower latency, and higher reliability</b> (no moving parts).</div><div class=\"ml-vi\">SSD thắng ở <b>thời gian truy cập nhanh, độ trễ thấp và độ tin cậy cao</b> (không có bộ phận chuyển động).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In any Boolean algebra, what values are used for all variables and operations? (Choose two correct answers)|||Trong đại số Boole, các biến và phép toán dùng những giá trị nào? (chọn hai đáp án đúng)",
          "options": [
            {
              "text": "Values are 1, 0|||Giá trị là 1, 0"
            },
            {
              "text": "Values are true, false|||Giá trị là true, false"
            },
            {
              "text": "Values are decimal numbers|||Giá trị là số thập phân"
            },
            {
              "text": "Values are 1, 0, true, false, and others|||Giá trị là 1, 0, true, false và khác"
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">Boolean algebra uses two values, expressed as <b>1/0</b> or equivalently <b>true/false</b>.</div><div class=\"ml-vi\">Đại số Boole dùng hai giá trị, biểu diễn là <b>1/0</b> hoặc tương đương <b>true/false</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(1) An I/O module must recognize one unique address for each peripheral it controls. (2) I/O channels are commonly seen on microcomputers, whereas I/O controllers are used on mainframes. The statement (1) is ____ and (2) is ____|||(1) Một mô-đun I/O phải nhận diện một địa chỉ duy nhất cho mỗi ngoại vi nó điều khiển. (2) Kênh I/O (I/O channel) thường thấy trên máy vi tính, còn bộ điều khiển I/O (I/O controller) dùng trên mainframe. Phát biểu (1) là ____ và (2) là ____",
          "options": [
            {
              "text": "true, false|||đúng, sai"
            },
            {
              "text": "true, true|||đúng, đúng"
            },
            {
              "text": "false, true|||sai, đúng"
            },
            {
              "text": "false, false|||sai, sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">(1) is <b>true</b>. (2) is <b>false</b> — it is reversed: I/O channels are on mainframes, controllers on microcomputers.</div><div class=\"ml-vi\">(1) <b>đúng</b>. (2) <b>sai</b> — bị đảo: kênh I/O ở mainframe, còn bộ điều khiển ở máy vi tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The I/O technique where the processor busy waits for an I/O operation to complete is called ____.|||Kỹ thuật I/O mà bộ xử lý bận-chờ (busy wait) cho tới khi thao tác I/O hoàn tất được gọi là ____.",
          "options": [
            {
              "text": "Programmed I/O or DMA|||Programmed I/O hoặc DMA"
            },
            {
              "text": "Interrupt-driven I/O|||Interrupt-driven I/O"
            },
            {
              "text": "Direct Memory Access (DMA)|||Truy cập bộ nhớ trực tiếp (DMA)"
            },
            {
              "text": "Programmed I/O|||Programmed I/O"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">In <b>programmed I/O</b> the CPU polls (busy-waits) until the operation completes.</div><div class=\"ml-vi\">Trong <b>programmed I/O</b>, CPU thăm dò (bận-chờ) tới khi thao tác xong.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement best describes the role of an I/O processor (IOP) in a computer system?|||Phát biểu nào mô tả đúng nhất vai trò của bộ xử lý I/O (IOP)?",
          "options": [
            {
              "text": "An IOP executes complex arithmetic and logic operations to offload the CPU|||IOP thực thi các phép số học-logic phức tạp để giảm tải cho CPU"
            },
            {
              "text": "An IOP acts as an independent processor dedicated to handling I/O operations|||IOP là một bộ xử lý độc lập chuyên xử lý các thao tác I/O"
            },
            {
              "text": "An IOP is a simple buffer between peripherals and the CPU, managing only data flow|||IOP chỉ là bộ đệm đơn giản giữa ngoại vi và CPU, chỉ quản lý luồng dữ liệu"
            },
            {
              "text": "An IOP is used only in embedded systems where real-time processing is required|||IOP chỉ dùng trong hệ nhúng cần xử lý thời gian thực"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>IOP is a dedicated, independent processor</b> that handles I/O, offloading the CPU.</div><div class=\"ml-vi\"><b>IOP là một bộ xử lý độc lập chuyên dụng</b> lo I/O, giảm tải cho CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What role does an Application Programming Interface (API) play in software development?|||Giao diện lập trình ứng dụng (API) đóng vai trò gì trong phát triển phần mềm?",
          "options": [
            {
              "text": "It allows program access to hardware resources using high-level language libraries|||Cho phép chương trình truy cập tài nguyên phần cứng qua thư viện ngôn ngữ bậc cao"
            },
            {
              "text": "It defines low-level machine instructions|||Định nghĩa các lệnh máy mức thấp"
            },
            {
              "text": "It provides a standard for binary portability|||Cung cấp chuẩn cho tính khả chuyển nhị phân"
            },
            {
              "text": "It manages system resources for the operating system and machine language instructions|||Quản lý tài nguyên hệ thống cho HĐH và lệnh ngôn ngữ máy"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>API</b> lets programs access resources through high-level language libraries. (Binary portability is the ABI's job.)</div><div class=\"ml-vi\"><b>API</b> cho phép chương trình truy cập tài nguyên qua thư viện ngôn ngữ bậc cao. (Khả chuyển nhị phân là việc của ABI.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A parallel system completes 500 tasks in 50 seconds. What is the throughput?|||Một hệ song song hoàn thành 500 tác vụ trong 50 giây. Thông lượng (throughput) là bao nhiêu?",
          "options": [
            {
              "text": "10 tasks/sec|||10 tác vụ/giây"
            },
            {
              "text": "5 tasks/sec|||5 tác vụ/giây"
            },
            {
              "text": "15 tasks/sec|||15 tác vụ/giây"
            },
            {
              "text": "20 tasks/sec|||20 tác vụ/giây"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Throughput = 500/50 = <b>10 tasks/sec</b>.</div><div class=\"ml-vi\">Thông lượng = 500/50 = <b>10 tác vụ/giây</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The task of subdivision is carried out dynamically by the OS and is known as ____ ?|||Việc phân chia (subdivision) do HĐH thực hiện động được gọi là ____?",
          "options": [
            {
              "text": "Scheduling|||Định thời (Scheduling)"
            },
            {
              "text": "Memory management|||Quản lý bộ nhớ"
            },
            {
              "text": "Virtual Memory|||Bộ nhớ ảo"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Dynamically subdividing work/time among processes is <b>scheduling</b>.</div><div class=\"ml-vi\">Phân chia công việc/thời gian động giữa các tiến trình là <b>định thời</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(R1) = 01110110, (R2) = 11011111, the result of (R1) XOR (R2) is:|||(R1) = 01110110, (R2) = 11011111, kết quả của (R1) XOR (R2) là:",
          "options": [
            {
              "text": "11011011|||11011011"
            },
            {
              "text": "00010110|||00010110"
            },
            {
              "text": "10101001|||10101001"
            },
            {
              "text": "11001101|||11001101"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">XOR gives 1 where bits differ: 01110110 ⊕ 11011111 = <b>10101001</b>.</div><div class=\"ml-vi\">XOR cho 1 ở vị trí bit khác nhau: 01110110 ⊕ 11011111 = <b>10101001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which memory management technique provides the best trade-off between efficient memory utilization and performance in a system with high process variability?|||Kỹ thuật quản lý bộ nhớ nào cho sự đánh đổi tốt nhất giữa tận dụng bộ nhớ và hiệu năng trong hệ có độ biến thiên tiến trình cao?",
          "options": [
            {
              "text": "Contiguous memory allocation|||Cấp phát bộ nhớ liên tục (contiguous)"
            },
            {
              "text": "Paging|||Phân trang (Paging)"
            },
            {
              "text": "Fixed-size partitioning|||Phân vùng cố định"
            },
            {
              "text": "Single-user system allocation|||Cấp phát hệ đơn người dùng"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Paging</b> uses fixed-size frames, avoiding external fragmentation and adapting well to variable process sizes.</div><div class=\"ml-vi\"><b>Phân trang</b> dùng khung cố định, tránh phân mảnh ngoài và thích ứng tốt với kích thước tiến trình biến thiên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "We have a long-term queue of process requests, typically stored on ____.|||Ta có một hàng đợi dài hạn (long-term queue) chứa các yêu cầu tiến trình, thường được lưu ở ____.",
          "options": [
            {
              "text": "main memory|||bộ nhớ chính"
            },
            {
              "text": "disk|||đĩa (disk)"
            },
            {
              "text": "cache memory|||bộ nhớ cache"
            },
            {
              "text": "registers|||thanh ghi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The long-term queue of pending process requests is typically held on <b>disk</b>.</div><div class=\"ml-vi\">Hàng đợi dài hạn các yêu cầu tiến trình chờ thường lưu trên <b>đĩa</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the simplified form of the Boolean expression AB'C + A'B'C + ABC' + A'BC' using Karnaugh Maps? (Note: A' = NOT A)|||Dạng rút gọn của biểu thức Boole AB'C + A'B'C + ABC' + A'BC' dùng bìa Karnaugh là gì? (A' = NOT A)",
          "options": [
            {
              "text": "B'C + BC'|||B'C + BC'"
            },
            {
              "text": "AB'C + A'BC' + A'BC|||AB'C + A'BC' + A'BC"
            },
            {
              "text": "A'B + A'C' + BC + BC'|||A'B + A'C' + BC + BC'"
            },
            {
              "text": "BC + AC|||BC + AC"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Group: AB'C + A'B'C = B'C; ABC' + A'BC' = BC'. Result = <b>B'C + BC'</b>.</div><div class=\"ml-vi\">Gộp: AB'C + A'B'C = B'C; ABC' + A'BC' = BC'. Kết quả = <b>B'C + BC'</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a common advantage of a larger instruction set architecture (ISA)?|||Ưu điểm phổ biến của một kiến trúc tập lệnh (ISA) lớn hơn là gì?",
          "options": [
            {
              "text": "Simpler compiler design|||Thiết kế trình biên dịch đơn giản hơn"
            },
            {
              "text": "Improved performance across all applications|||Cải thiện hiệu năng cho mọi ứng dụng"
            },
            {
              "text": "More complex programming|||Lập trình phức tạp hơn"
            },
            {
              "text": "Greater expressive power for programming|||Sức biểu đạt mạnh hơn cho lập trình"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">A larger ISA gives <b>greater expressive power</b> — more specialized instructions for programmers.</div><div class=\"ml-vi\">ISA lớn hơn cho <b>sức biểu đạt mạnh hơn</b> — nhiều lệnh chuyên biệt cho lập trình viên.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A ____ is a mechanism that provides for communication among CPU, main memory and I/O.|||Một ____ là cơ chế cung cấp giao tiếp giữa CPU, bộ nhớ chính và I/O.",
          "options": [
            {
              "text": "system interconnection|||kết nối hệ thống (system interconnection)"
            },
            {
              "text": "CPU interconnection|||kết nối CPU"
            },
            {
              "text": "peripheral|||ngoại vi"
            },
            {
              "text": "processor|||bộ xử lý"
            },
            {
              "text": "memory|||bộ nhớ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>system interconnection</b> (bus) provides communication among CPU, memory, and I/O.</div><div class=\"ml-vi\"><b>Kết nối hệ thống</b> (bus) cung cấp giao tiếp giữa CPU, bộ nhớ và I/O.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following components was used in the first ENIAC computer?|||Linh kiện nào được dùng trong máy tính ENIAC đầu tiên?",
          "options": [
            {
              "text": "Bipolar transistors|||Transistor lưỡng cực"
            },
            {
              "text": "Field transistors|||Transistor trường"
            },
            {
              "text": "Vacuum tubes|||Đèn chân không (Vacuum tubes)"
            },
            {
              "text": "Semiconductor ICs|||Vi mạch bán dẫn (IC)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">ENIAC (1st generation) used <b>vacuum tubes</b>.</div><div class=\"ml-vi\">ENIAC (thế hệ 1) dùng <b>đèn chân không</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is NOT a characteristic of instruction sets?|||Điều nào sau đây KHÔNG phải là một đặc trưng của tập lệnh?",
          "options": [
            {
              "text": "Size|||Kích thước (Size)"
            },
            {
              "text": "Complexity|||Độ phức tạp (Complexity)"
            },
            {
              "text": "Execution speed|||Tốc độ thực thi (Execution speed)"
            },
            {
              "text": "Op-code format|||Định dạng mã lệnh (Op-code format)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Instruction-set traits include size, complexity, and op-code format. <b>Execution speed</b> depends on the implementation, not the instruction set itself.</div><div class=\"ml-vi\">Đặc trưng tập lệnh gồm kích thước, độ phức tạp, định dạng mã lệnh. <b>Tốc độ thực thi</b> phụ thuộc cách hiện thực, không phải bản thân tập lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of Left Shift Operator << on (00011000<<2)?|||Kết quả của phép dịch trái (Left Shift) << trên (00011000<<2) là gì?",
          "options": [
            {
              "text": "01100000|||01100000"
            },
            {
              "text": "11000000|||11000000"
            },
            {
              "text": "00000110|||00000110"
            },
            {
              "text": "00000011|||00000011"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Left shift by 2 moves bits left, filling zeros: 00011000 → <b>01100000</b>.</div><div class=\"ml-vi\">Dịch trái 2 bit đẩy các bit sang trái, chèn 0: 00011000 → <b>01100000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The effective address of Register indirect addressing mode is ____.|||Địa chỉ hiệu dụng (effective address) của chế độ địa chỉ gián tiếp qua thanh ghi là ____.",
          "options": [
            {
              "text": "EA = R|||EA = R"
            },
            {
              "text": "EA = (R)|||EA = (R)"
            },
            {
              "text": "EA = (R)+A|||EA = (R)+A"
            },
            {
              "text": "EA = (R)+(A)|||EA = (R)+(A)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Register-indirect: the register holds the operand's address, so <b>EA = (R)</b>.</div><div class=\"ml-vi\">Gián tiếp qua thanh ghi: thanh ghi chứa địa chỉ toán hạng, nên <b>EA = (R)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the immediate addressing mode of a machine instruction, if this field is allocated a 10-bit length, what is the valid range of signed integer?|||Trong chế độ địa chỉ tức thời (immediate) của một lệnh máy, nếu trường này dài 10 bit thì phạm vi số nguyên có dấu hợp lệ là bao nhiêu?",
          "options": [
            {
              "text": "[-512, 511]|||[-512, 511]"
            },
            {
              "text": "[-108, 107]|||[-108, 107]"
            },
            {
              "text": "[-32768, 32767]|||[-32768, 32767]"
            },
            {
              "text": "Any integral value.|||Bất kỳ giá trị nguyên nào."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">10-bit two's-complement range = [−2⁹, 2⁹−1] = <b>[−512, 511]</b>.</div><div class=\"ml-vi\">Phạm vi bù hai 10 bit = [−2⁹, 2⁹−1] = <b>[−512, 511]</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main difference between x86 and ARM instruction formats?|||Khác biệt chính giữa định dạng lệnh x86 và ARM là gì?",
          "options": [
            {
              "text": "x86 instructions are variable in length, while ARM instructions are fixed|||Lệnh x86 có độ dài thay đổi, còn ARM cố định"
            },
            {
              "text": "x86 instructions are fixed in length, while ARM instructions are variable|||Lệnh x86 cố định, còn ARM thay đổi"
            },
            {
              "text": "Both x86 and ARM instructions are fixed in length|||Cả x86 và ARM đều cố định"
            },
            {
              "text": "Both x86 and ARM instructions are variable in length|||Cả x86 và ARM đều thay đổi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">x86 (CISC) has <b>variable-length</b> instructions; ARM (RISC) has <b>fixed-length</b> instructions.</div><div class=\"ml-vi\">x86 (CISC) có lệnh <b>độ dài thay đổi</b>; ARM (RISC) có lệnh <b>độ dài cố định</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary function of the Arithmetic and Logic Unit (ALU) in a processor?|||Chức năng chính của Đơn vị số học-logic (ALU) trong bộ xử lý là gì?",
          "options": [
            {
              "text": "Perform actual computations and data processing|||Thực hiện các phép tính và xử lý dữ liệu thực tế"
            },
            {
              "text": "Control the movement of data and instructions|||Điều khiển sự di chuyển của dữ liệu và lệnh"
            },
            {
              "text": "Act as an interface to the system bus|||Làm giao diện với bus hệ thống"
            },
            {
              "text": "Manage the internal processor memory|||Quản lý bộ nhớ trong của bộ xử lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>ALU performs the actual computations</b> (arithmetic and logic) and data processing.</div><div class=\"ml-vi\"><b>ALU thực hiện các phép tính thực tế</b> (số học và logic) và xử lý dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The Program Status Word (PSW) typically contains condition codes, the sign of the last result, and other status information like interrupt enable/disable flags.|||Từ trạng thái chương trình (PSW) thường chứa các mã điều kiện, dấu của kết quả gần nhất, và các thông tin trạng thái khác như cờ bật/tắt ngắt.",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>True</b> — the PSW holds condition codes, the sign flag, and interrupt enable/disable bits.</div><div class=\"ml-vi\"><b>Đúng</b> — PSW giữ mã điều kiện, cờ dấu và bit bật/tắt ngắt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the instruction cycle, what of the following describes the indirect cycle?|||Trong chu kỳ lệnh, phát biểu nào mô tả chu kỳ gián tiếp (indirect cycle)?",
          "options": [
            {
              "text": "In this cycle, the instruction points to a memory address that holds the actual address of the operand.|||Trong chu kỳ này, lệnh trỏ tới một địa chỉ bộ nhớ chứa địa chỉ thực của toán hạng."
            },
            {
              "text": "In this cycle, the address of the specific instruction is determined, and then the instruction is loaded into the IR register to be decoded by the Control Unit.|||Trong chu kỳ này, địa chỉ của lệnh được xác định, rồi lệnh được nạp vào thanh ghi IR để CU giải mã."
            },
            {
              "text": "In this cycle, a executing hardware module in Control Unit is determined for executing.|||Trong chu kỳ này, một mô-đun phần cứng trong CU được xác định để thực thi."
            },
            {
              "text": "In this cycle, operands are stored in the stack pointer register, and then they is loaded into ALU for executing.|||Trong chu kỳ này, toán hạng được lưu vào thanh ghi con trỏ ngăn xếp, rồi nạp vào ALU để thực thi."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>indirect cycle</b> resolves indirect addressing: the instruction points to a memory location that holds the operand's real address.</div><div class=\"ml-vi\"><b>Chu kỳ gián tiếp</b> giải quyết địa chỉ gián tiếp: lệnh trỏ tới ô nhớ chứa địa chỉ thực của toán hạng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of instruction execution, how is a product on an assembly line conceptually similar to an instruction in a pipeline?|||Trong ngữ cảnh thực thi lệnh, một sản phẩm trên dây chuyền lắp ráp giống một lệnh trong pipeline ở điểm nào?",
          "options": [
            {
              "text": "Both undergo multiple stages of production|||Cả hai đều trải qua nhiều giai đoạn sản xuất"
            },
            {
              "text": "Both are executed in a single clock cycle|||Cả hai được thực thi trong một chu kỳ xung"
            },
            {
              "text": "Both follow a linear sequence of tasks|||Cả hai đi theo một chuỗi tác vụ tuyến tính"
            },
            {
              "text": "Both are processed by the control unit|||Cả hai được xử lý bởi đơn vị điều khiển"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Like a product on an assembly line, a pipelined instruction <b>passes through multiple stages</b>, each doing part of the work.</div><div class=\"ml-vi\">Giống sản phẩm trên dây chuyền, lệnh trong pipeline <b>đi qua nhiều giai đoạn</b>, mỗi giai đoạn làm một phần việc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the following issues related to CPU organization, which of them determines the control and pipeline organization?|||Trong các vấn đề về tổ chức CPU sau, yếu tố nào quyết định tổ chức điều khiển và pipeline?",
          "options": [
            {
              "text": "Execution sequencing.|||Trình tự thực thi (Execution sequencing)."
            },
            {
              "text": "Operands used.|||Toán hạng được dùng."
            },
            {
              "text": "Operations performed.|||Các phép toán được thực hiện."
            },
            {
              "text": "Statement types in a high-level programming language.|||Kiểu câu lệnh trong ngôn ngữ bậc cao."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Execution sequencing</b> — the order in which operations are carried out — determines the control and pipeline organization.</div><div class=\"ml-vi\"><b>Trình tự thực thi</b> — thứ tự tiến hành các thao tác — quyết định tổ chức điều khiển và pipeline.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which control signal is responsible for temporarily opening the gate to allow data to pass in the data path?|||Tín hiệu điều khiển nào chịu trách nhiệm tạm thời mở cổng (gate) để cho dữ liệu đi qua trong đường dữ liệu?",
          "options": [
            {
              "text": "System bus data transfer signal.|||Tín hiệu truyền dữ liệu của bus hệ thống."
            },
            {
              "text": "Memory buffer control signal.|||Tín hiệu điều khiển bộ đệm bộ nhớ."
            },
            {
              "text": "ALU activation signal.|||Tín hiệu kích hoạt ALU."
            },
            {
              "text": "Gate control signal from the control unit.|||Tín hiệu điều khiển cổng từ đơn vị điều khiển."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The <b>control unit's gate control signal</b> opens gates to route data along the data path.</div><div class=\"ml-vi\"><b>Tín hiệu điều khiển cổng từ đơn vị điều khiển</b> mở các cổng để dẫn dữ liệu theo đường dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main benefit of using RISC over CISC?|||Lợi ích chính của việc dùng RISC so với CISC là gì?",
          "options": [
            {
              "text": "RISC has more instructions and addressing modes than CISC|||RISC có nhiều lệnh và chế độ địa chỉ hơn CISC"
            },
            {
              "text": "RISC has faster instruction execution and simpler instruction decoding than CISC|||RISC thực thi lệnh nhanh hơn và giải mã lệnh đơn giản hơn CISC"
            },
            {
              "text": "RISC has variable-length instruction formats and direct memory access than CISC|||RISC có định dạng lệnh độ dài thay đổi và truy cập bộ nhớ trực tiếp hơn CISC"
            },
            {
              "text": "RISC has more registers and pipelines than CISC|||RISC có nhiều thanh ghi và pipeline hơn CISC"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">RISC's simple, fixed-length instructions give <b>faster execution and simpler decoding</b>.</div><div class=\"ml-vi\">Lệnh đơn giản, độ dài cố định của RISC cho <b>thực thi nhanh hơn và giải mã đơn giản hơn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In parallel processor architectures, what type do uni-processor computers fall into?|||Trong phân loại kiến trúc bộ xử lý song song, máy đơn xử lý (uni-processor) thuộc loại nào?",
          "options": [
            {
              "text": "Multiple instruction streams, single data stream.|||Nhiều luồng lệnh, một luồng dữ liệu (MISD)."
            },
            {
              "text": "Multiple instruction streams, multiple data streams.|||Nhiều luồng lệnh, nhiều luồng dữ liệu (MIMD)."
            },
            {
              "text": "Single instruction stream, single data stream.|||Một luồng lệnh, một luồng dữ liệu (SISD)."
            },
            {
              "text": "Single instruction stream, multiple data streams.|||Một luồng lệnh, nhiều luồng dữ liệu (SIMD)."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A uni-processor is <b>SISD</b> — single instruction stream, single data stream.</div><div class=\"ml-vi\">Máy đơn xử lý là <b>SISD</b> — một luồng lệnh, một luồng dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "During microinstruction execution, which of the following is generated by the control unit?|||Trong quá trình thực thi vi lệnh (microinstruction), thành phần nào sau đây do đơn vị điều khiển tạo ra?",
          "options": [
            {
              "text": "The next address for the control memory.|||Địa chỉ kế tiếp cho bộ nhớ điều khiển."
            },
            {
              "text": "Control signals required to execute the microinstruction.|||Các tín hiệu điều khiển cần để thực thi vi lệnh."
            },
            {
              "text": "Data signals for the system bus.|||Tín hiệu dữ liệu cho bus hệ thống."
            },
            {
              "text": "The instruction register contents.|||Nội dung thanh ghi lệnh."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Executing a microinstruction makes the control unit generate the <b>control signals</b> needed to carry it out.</div><div class=\"ml-vi\">Thực thi một vi lệnh khiến đơn vị điều khiển tạo ra các <b>tín hiệu điều khiển</b> cần thiết.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of a computer's internal structure, which component is responsible for communication among the CPU, main memory, and I/O?|||Trong cấu trúc bên trong máy tính, thành phần nào chịu trách nhiệm giao tiếp giữa CPU, bộ nhớ chính và I/O?",
          "options": [
            {
              "text": "Control Unit|||Đơn vị điều khiển (CU)"
            },
            {
              "text": "System Bus|||Bus hệ thống (System Bus)"
            },
            {
              "text": "Arithmetic Logic Unit (ALU)|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "Registers|||Thanh ghi"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>system bus</b> carries communication among CPU, memory, and I/O.</div><div class=\"ml-vi\"><b>Bus hệ thống</b> đảm nhận giao tiếp giữa CPU, bộ nhớ và I/O.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is one advantage of Nonuniform Memory Access (NUMA) over Uniform Memory Access (UMA)?|||Ưu điểm của Truy cập bộ nhớ không đồng nhất (NUMA) so với Truy cập bộ nhớ đồng nhất (UMA) là gì?",
          "options": [
            {
              "text": "NUMA provides each processor with its own local memory, reducing memory access times|||NUMA cấp cho mỗi bộ xử lý bộ nhớ cục bộ riêng, giảm thời gian truy cập bộ nhớ"
            },
            {
              "text": "NUMA allows all processors to access the same memory location simultaneously|||NUMA cho phép mọi bộ xử lý truy cập cùng một ô nhớ đồng thời"
            },
            {
              "text": "NUMA is easier to implement than UMA|||NUMA dễ hiện thực hơn UMA"
            },
            {
              "text": "NUMA provides limited memory capacity|||NUMA cho dung lượng bộ nhớ hạn chế"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>NUMA gives each processor local memory</b>, so local accesses are much faster than in UMA.</div><div class=\"ml-vi\"><b>NUMA cho mỗi bộ xử lý bộ nhớ cục bộ</b>, nên truy cập cục bộ nhanh hơn nhiều so với UMA.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In a heterogeneous multicore processor, some cores are high-performance (big cores) while others are low-power (small cores). What is the primary challenge in efficiently utilizing this architecture?|||Trong bộ xử lý đa nhân không đồng nhất, một số nhân mạnh (big) và một số nhân tiết kiệm điện (small). Thách thức chính khi tận dụng hiệu quả kiến trúc này là gì?",
          "options": [
            {
              "text": "Balancing workload distribution between big and small cores.|||Cân bằng phân bổ khối lượng công việc giữa nhân lớn và nhỏ."
            },
            {
              "text": "Increasing the number of small cores to match the performance of big cores.|||Tăng số nhân nhỏ để bằng hiệu năng nhân lớn."
            },
            {
              "text": "Using identical instruction sets for all cores.|||Dùng tập lệnh giống nhau cho mọi nhân."
            },
            {
              "text": "Reducing the physical size of big cores.|||Giảm kích thước vật lý của nhân lớn."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The key challenge is <b>scheduling/balancing the workload</b> between big and small cores to use each efficiently.</div><div class=\"ml-vi\">Thách thức chính là <b>cân bằng/định thời khối lượng công việc</b> giữa nhân lớn và nhỏ để dùng hiệu quả từng loại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why does segmented address space lend itself well to sharing among processes?|||Vì sao không gian địa chỉ phân đoạn (segmented) thuận lợi cho việc chia sẻ giữa các tiến trình?",
          "options": [
            {
              "text": "It requires all processes to be recompiled before sharing data.|||Nó yêu cầu mọi tiến trình phải biên dịch lại trước khi chia sẻ dữ liệu."
            },
            {
              "text": "It forces all processes to use the same memory segment.|||Nó buộc mọi tiến trình dùng cùng một đoạn nhớ."
            },
            {
              "text": "It allows a programmer to place shared utilities or data in a segment accessible by other processes.|||Nó cho phép lập trình viên đặt các tiện ích/dữ liệu dùng chung vào một đoạn (segment) mà tiến trình khác truy cập được."
            },
            {
              "text": "It allows a programmer to place shared utilities or data in a segment accessible by other processes.|||Nó cho phép lập trình viên đặt các tiện ích/dữ liệu dùng chung vào một đoạn mà tiến trình khác truy cập được."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Segmentation lets a programmer put shared utilities/data in a <b>segment that other processes can access</b>.</div><div class=\"ml-vi\">Phân đoạn cho phép lập trình viên đặt tiện ích/dữ liệu dùng chung vào một <b>đoạn mà các tiến trình khác truy cập được</b>.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D3",
      "source": "REAL",
      "sortOrder": 2,
      "title": "Đề 3 — Final Exam (SU24)|||Đề 3 — Thi cuối kỳ (SU24)",
      "description": "Real FE multiple-choice paper (CEA201, Summer 2024), transcribed from the exam images; answers reasoned here.|||Đề trắc nghiệm FE thật (CEA201, kỳ Hè 2024), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following components was used in the first ENIAC computer?|||Linh kiện nào được dùng trong máy tính ENIAC đầu tiên?",
          "options": [
            {
              "text": "Bipolar transistors|||Transistor lưỡng cực"
            },
            {
              "text": "Field transistors|||Transistor trường"
            },
            {
              "text": "Vacuum tubes|||Đèn chân không (Vacuum tubes)"
            },
            {
              "text": "Semiconductor ICs|||Vi mạch bán dẫn (IC)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">ENIAC used <b>vacuum tubes</b> (first generation).</div><div class=\"ml-vi\">ENIAC dùng <b>đèn chân không</b> (thế hệ 1).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is true for Von Neumann architecture?|||Phát biểu nào đúng với kiến trúc Von Neumann?",
          "options": [
            {
              "text": "Shared bus between the program memory and data memory|||Dùng chung bus giữa bộ nhớ chương trình và bộ nhớ dữ liệu"
            },
            {
              "text": "Separate bus between the program memory and data memory|||Bus riêng giữa bộ nhớ chương trình và bộ nhớ dữ liệu"
            },
            {
              "text": "External bus for program memory and data memory|||Bus ngoài cho cả bộ nhớ chương trình và dữ liệu"
            },
            {
              "text": "External bus for data memory only|||Bus ngoài chỉ cho bộ nhớ dữ liệu"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Von Neumann uses a <b>single shared bus</b> for both program and data memory (unlike Harvard's separate buses).</div><div class=\"ml-vi\">Von Neumann dùng <b>một bus chung</b> cho cả bộ nhớ chương trình và dữ liệu (khác Harvard có bus riêng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following component does not belong to central processing unit?|||Thành phần nào sau đây KHÔNG thuộc bộ xử lý trung tâm (CPU)?",
          "options": [
            {
              "text": "System interconnection|||Kết nối hệ thống (System interconnection)"
            },
            {
              "text": "Arithmetic and logic unit|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "Registers|||Thanh ghi (Registers)"
            },
            {
              "text": "Control unit|||Đơn vị điều khiển (Control unit)"
            },
            {
              "text": "CPU interconnection|||Kết nối CPU (CPU interconnection)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>System interconnection</b> (the bus linking CPU/memory/I/O) is outside the CPU. The CPU has the ALU, registers, control unit, and internal CPU interconnection.</div><div class=\"ml-vi\"><b>Kết nối hệ thống</b> (bus nối CPU/bộ nhớ/I/O) nằm ngoài CPU. CPU gồm ALU, thanh ghi, đơn vị điều khiển và kết nối nội bộ CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Central processing unit (CPU) of IAS computer consists of ____.|||Bộ xử lý trung tâm (CPU) của máy tính IAS gồm ____.",
          "options": [
            {
              "text": "Main memory and ALU (arithmetic and logic unit)|||Bộ nhớ chính và ALU"
            },
            {
              "text": "ALU (Arithmetic and Logic Unit) and CU (Control Unit)|||ALU (đơn vị số học-logic) và CU (đơn vị điều khiển)"
            },
            {
              "text": "CU (Control Unit) and IO Module|||CU (đơn vị điều khiển) và mô-đun I/O"
            },
            {
              "text": "ALU (Arithmetic and Logic Unit) and IO Module|||ALU (đơn vị số học-logic) và mô-đun I/O"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The IAS CPU consists of the <b>ALU and the control unit</b>.</div><div class=\"ml-vi\">CPU của máy IAS gồm <b>ALU và đơn vị điều khiển</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The first generation of computers used ____ for digital logic elements and memory?|||Thế hệ máy tính đầu tiên dùng ____ cho các phần tử logic số và bộ nhớ?",
          "options": [
            {
              "text": "Transistor|||Transistor"
            },
            {
              "text": "Integrated Circuits|||Vi mạch tích hợp (IC)"
            },
            {
              "text": "Large-scale integration|||Tích hợp quy mô lớn (LSI)"
            },
            {
              "text": "Vacuum Tubes|||Đèn chân không (Vacuum Tubes)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">First-generation computers used <b>vacuum tubes</b> for logic and memory.</div><div class=\"ml-vi\">Máy tính thế hệ đầu dùng <b>đèn chân không</b> cho logic và bộ nhớ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the computer, what categories do external devices include? (choose 3 correct answers)|||Trong máy tính, thiết bị ngoài (external devices) gồm những loại nào? (chọn 3 đáp án đúng)",
          "options": [
            {
              "text": "Human readable|||Đọc được bởi người (Human readable)"
            },
            {
              "text": "Communication|||Giao tiếp (Communication)"
            },
            {
              "text": "Data Conversion|||Chuyển đổi dữ liệu (Data Conversion)"
            },
            {
              "text": "Machine readable|||Đọc được bởi máy (Machine readable)"
            }
          ],
          "correctIndexes": [
            0,
            1,
            3
          ],
          "explanation": "<div class=\"ml-en\">External devices are grouped as <b>human-readable, machine-readable, and communication</b>. 'Data conversion' is not a category.</div><div class=\"ml-vi\">Thiết bị ngoài chia thành <b>đọc-được-bởi-người, đọc-được-bởi-máy và giao tiếp</b>. 'Chuyển đổi dữ liệu' không phải một loại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following determines the Bus Width?|||Yếu tố nào quyết định độ rộng bus (Bus Width)?",
          "options": [
            {
              "text": "The clock speed of the CPU|||Tốc độ xung nhịp CPU"
            },
            {
              "text": "The number of cores in the processor|||Số nhân của bộ xử lý"
            },
            {
              "text": "The size of the motherboard|||Kích thước bo mạch chủ"
            },
            {
              "text": "The number of parallel lines in the data bus|||Số đường song song trong bus dữ liệu"
            },
            {
              "text": "Number of components connected to Bus|||Số thành phần nối vào bus"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Bus width = the <b>number of parallel lines</b> in the data bus.</div><div class=\"ml-vi\">Độ rộng bus = <b>số đường song song</b> trong bus dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the CPU, what is the functionality of the control unit?|||Trong CPU, chức năng của đơn vị điều khiển (control unit) là gì?",
          "options": [
            {
              "text": "To decode program instructions|||Giải mã lệnh chương trình"
            },
            {
              "text": "To controls the sequence of operations|||Điều khiển trình tự các thao tác"
            },
            {
              "text": "To store program instructions|||Lưu trữ lệnh chương trình"
            },
            {
              "text": "To transfer data to primary storage|||Chuyển dữ liệu tới bộ nhớ chính"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The control unit <b>controls the sequence of operations</b>, directing the rest of the CPU.</div><div class=\"ml-vi\">Đơn vị điều khiển <b>điều khiển trình tự các thao tác</b>, chỉ huy phần còn lại của CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The basic components of a computer are:|||Các thành phần cơ bản của một máy tính là:",
          "options": [
            {
              "text": "Main memory, CPU, I/O modules and system interconnection|||Bộ nhớ chính, CPU, mô-đun I/O và kết nối hệ thống"
            },
            {
              "text": "Main memory, CPU, I/O modules and Storage device|||Bộ nhớ chính, CPU, mô-đun I/O và thiết bị lưu trữ"
            },
            {
              "text": "Main Memory, CPU, Peripherals and Storage device|||Bộ nhớ chính, CPU, ngoại vi và thiết bị lưu trữ"
            },
            {
              "text": "Main memory, CPU, I/O modules and Storage device|||Bộ nhớ chính, CPU, mô-đun I/O và thiết bị lưu trữ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The four basic components are <b>main memory, CPU, I/O modules, and the system interconnection</b>.</div><div class=\"ml-vi\">Bốn thành phần cơ bản là <b>bộ nhớ chính, CPU, mô-đun I/O và kết nối hệ thống</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the correct order of memory access speed from fastest to slowest?|||Thứ tự tốc độ truy cập bộ nhớ từ nhanh nhất tới chậm nhất là gì?",
          "options": [
            {
              "text": "Registers > Cache > RAM > SSD|||Registers > Cache > RAM > SSD"
            },
            {
              "text": "Cache > Registers > RAM > SSD|||Cache > Registers > RAM > SSD"
            },
            {
              "text": "Registers > Cache > SSD > RAM|||Registers > Cache > SSD > RAM"
            },
            {
              "text": "Cache > Registers > SSD > RAM|||Cache > Registers > SSD > RAM"
            },
            {
              "text": "All of the mentioned are wrong|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Fastest→slowest: <b>Registers &gt; Cache &gt; RAM &gt; SSD</b>.</div><div class=\"ml-vi\">Nhanh→chậm: <b>Registers &gt; Cache &gt; RAM &gt; SSD</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the cache memory level that is integrated into the processor chip and has the lowest latency?|||Mức cache nào được tích hợp vào chip bộ xử lý và có độ trễ thấp nhất?",
          "options": [
            {
              "text": "L1 cache|||Cache L1"
            },
            {
              "text": "L2 cache|||Cache L2"
            },
            {
              "text": "L3 cache|||Cache L3"
            },
            {
              "text": "L4 cache|||Cache L4"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>L1 cache</b> is on-chip and closest to the core, giving the lowest latency.</div><div class=\"ml-vi\"><b>Cache L1</b> nằm trên chip và gần nhân nhất nên độ trễ thấp nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following components of CPU is responsible to direct the system to execute instructions?|||Thành phần nào của CPU chịu trách nhiệm chỉ huy hệ thống thực thi các lệnh?",
          "options": [
            {
              "text": "Arithmetic and Logic Unit (ALU)|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "Control Unit (CU)|||Đơn vị điều khiển (CU)"
            },
            {
              "text": "Registers|||Thanh ghi"
            },
            {
              "text": "Random Access Memory (RAM)|||Bộ nhớ truy cập ngẫu nhiên (RAM)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>control unit</b> directs the system to execute instructions.</div><div class=\"ml-vi\"><b>Đơn vị điều khiển</b> chỉ huy hệ thống thực thi các lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a machine with a byte addressable main memory of 2^16 bytes and block size of 8 bytes. Assume that a direct mapped cache consisting of 32 lines is used with this machine. How many bits are there in the line field of the cache?|||Cho một máy có bộ nhớ chính định địa chỉ theo byte 2¹⁶ byte, kích thước khối 8 byte. Dùng cache ánh xạ trực tiếp gồm 32 dòng. Trường 'dòng' (line field) của cache có bao nhiêu bit?",
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
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">32 cache lines → line field = log₂(32) = <b>5</b> bits.</div><div class=\"ml-vi\">32 dòng cache → trường dòng = log₂(32) = <b>5</b> bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "For reads to and writes from main memory, ____ translates each virtual address into a physical address in main memory.|||Với các lần đọc/ghi bộ nhớ chính, ____ dịch mỗi địa chỉ ảo thành địa chỉ vật lý trong bộ nhớ chính.",
          "options": [
            {
              "text": "MAR|||MAR"
            },
            {
              "text": "MMU|||MMU"
            },
            {
              "text": "Overlays|||Overlays"
            },
            {
              "text": "TLB|||TLB"
            },
            {
              "text": "Accumulator|||Accumulator"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The <b>MMU</b> (Memory Management Unit) translates virtual addresses to physical addresses.</div><div class=\"ml-vi\"><b>MMU</b> (đơn vị quản lý bộ nhớ) dịch địa chỉ ảo sang địa chỉ vật lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main idea of using Hamming code for error correction?|||Ý tưởng chính của việc dùng mã Hamming để sửa lỗi là gì?",
          "options": [
            {
              "text": "Adding extra parity bits to the data bits such that the number of 1s in each subset of bits is even|||Thêm bit parity sao cho số bit 1 trong mỗi tập con là chẵn"
            },
            {
              "text": "Adding extra parity bits to the data bits such that the number of 1s in each subset of bits is odd|||Thêm bit parity sao cho số bit 1 trong mỗi tập con là lẻ"
            },
            {
              "text": "Adding extra parity bits to the data bits such that the parity bits form a binary number indicating the position of the error bit|||Thêm bit parity sao cho các bit parity tạo thành một số nhị phân chỉ vị trí bit lỗi"
            },
            {
              "text": "Adding extra parity bits to the data bits such that the parity bits form a binary number indicating the number of error bits|||Thêm bit parity sao cho các bit parity tạo thành một số nhị phân chỉ số lượng bit lỗi"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Hamming code adds parity bits so that together they form a binary number giving the <b>position of the erroneous bit</b>.</div><div class=\"ml-vi\">Mã Hamming thêm các bit parity sao cho chúng tạo thành một số nhị phân chỉ ra <b>vị trí bit lỗi</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the key differences in the architecture of NOR and NAND flash memory?|||Khác biệt then chốt trong kiến trúc bộ nhớ flash NOR và NAND là gì?",
          "options": [
            {
              "text": "NOR flash memory cells are connected in series, while NAND flash memory cells are connected in parallel|||Ô NOR nối tiếp, ô NAND song song"
            },
            {
              "text": "NOR flash memory cells are connected in parallel, while NAND flash memory cells are connected in series|||Ô NOR nối song song, ô NAND nối tiếp"
            },
            {
              "text": "Both NOR and NAND flash memory cells are connected in series|||Cả NOR và NAND đều nối tiếp"
            },
            {
              "text": "Both NOR and NAND flash memory cells are connected in parallel|||Cả NOR và NAND đều song song"
            },
            {
              "text": "All of the mentioned are wrong|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>NOR</b> cells are wired in <b>parallel</b> (fast random read); <b>NAND</b> cells in <b>series</b> (dense, cheap).</div><div class=\"ml-vi\">Ô <b>NOR</b> nối <b>song song</b> (đọc ngẫu nhiên nhanh); ô <b>NAND</b> nối <b>tiếp</b> (mật độ cao, rẻ).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which memory has the fastest speed and smallest capacity?|||Bộ nhớ nào có tốc độ nhanh nhất và dung lượng nhỏ nhất?",
          "options": [
            {
              "text": "Cache|||Cache"
            },
            {
              "text": "Main memory|||Bộ nhớ chính"
            },
            {
              "text": "HDD|||HDD"
            },
            {
              "text": "Magnetic Disk|||Đĩa từ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Among these, <b>cache</b> is the fastest and smallest.</div><div class=\"ml-vi\">Trong số này, <b>cache</b> nhanh nhất và nhỏ nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ is a set of physical disk drives viewed by the operating system as a single logical drive.|||____ là một tập các ổ đĩa vật lý được HĐH xem như một ổ đĩa logic duy nhất.",
          "options": [
            {
              "text": "CLV|||CLV"
            },
            {
              "text": "SSD|||SSD"
            },
            {
              "text": "RAID|||RAID"
            },
            {
              "text": "CAV|||CAV"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>RAID</b> presents multiple physical disks to the OS as one logical drive.</div><div class=\"ml-vi\"><b>RAID</b> trình bày nhiều ổ đĩa vật lý cho HĐH như một ổ logic duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Sort the following memory types in ascending order by access speed:|||Sắp xếp các loại bộ nhớ sau theo tốc độ truy cập TĂNG DẦN:",
          "options": [
            {
              "text": "HDD - Main Memory - L2 cache - L1 cache|||HDD - Bộ nhớ chính - Cache L2 - Cache L1"
            },
            {
              "text": "HDD - Main Memory - L1 cache - L2 cache|||HDD - Bộ nhớ chính - Cache L1 - Cache L2"
            },
            {
              "text": "HDD - L2 cache - L1 cache - Main Memory|||HDD - Cache L2 - Cache L1 - Bộ nhớ chính"
            },
            {
              "text": "Main Memory - L2 cache - L1 cache - HDD|||Bộ nhớ chính - Cache L2 - Cache L1 - HDD"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Increasing speed: <b>HDD &lt; Main Memory &lt; L2 &lt; L1</b>.</div><div class=\"ml-vi\">Tốc độ tăng dần: <b>HDD &lt; Bộ nhớ chính &lt; L2 &lt; L1</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is the correct choice for sorting in increasing speed average of memory?|||Phương án nào đúng khi sắp xếp theo tốc độ trung bình TĂNG DẦN của bộ nhớ?",
          "options": [
            {
              "text": "SSD < Main Memory < Cache Memory < Magnetic Tape|||SSD < Bộ nhớ chính < Cache < Băng từ"
            },
            {
              "text": "Magnetic Tape < SSD < Cache Memory < Main Memory|||Băng từ < SSD < Cache < Bộ nhớ chính"
            },
            {
              "text": "Magnetic Disk < SSD < Cache Memory < Main Memory|||Đĩa từ < SSD < Cache < Bộ nhớ chính"
            },
            {
              "text": "Magnetic Disk < Magnetic Tape < Main Memory < Cache Memory|||Đĩa từ < Băng từ < Bộ nhớ chính < Cache"
            },
            {
              "text": "Magnetic Disk < SSD < Main Memory < Cache Memory|||Đĩa từ < SSD < Bộ nhớ chính < Cache"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Increasing speed: <b>Magnetic Disk &lt; SSD &lt; Main Memory &lt; Cache</b>.</div><div class=\"ml-vi\">Tốc độ tăng dần: <b>Đĩa từ &lt; SSD &lt; Bộ nhớ chính &lt; Cache</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If you have a boolean function with 3 variables, how many rows are there in the truth table?|||Nếu một hàm Boole có 3 biến, bảng chân trị có bao nhiêu dòng?",
          "options": [
            {
              "text": "8 rows|||8 dòng"
            },
            {
              "text": "3 rows|||3 dòng"
            },
            {
              "text": "6 rows|||6 dòng"
            },
            {
              "text": "12 rows|||12 dòng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">n variables → 2ⁿ rows. 2³ = <b>8 rows</b>.</div><div class=\"ml-vi\">n biến → 2ⁿ dòng. 2³ = <b>8 dòng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In isolated I/O, ____|||Trong I/O tách biệt (isolated I/O), ____",
          "options": [
            {
              "text": "The I/O devices and the memory share the same address space|||Thiết bị I/O và bộ nhớ dùng chung không gian địa chỉ"
            },
            {
              "text": "The I/O devices have a separate address space from memory|||Thiết bị I/O có không gian địa chỉ riêng tách khỏi bộ nhớ"
            },
            {
              "text": "The memory and I/O devices have an associated address space|||Bộ nhớ và thiết bị I/O có chung một không gian địa chỉ liên kết"
            },
            {
              "text": "A part of the memory is specifically set aside for the I/O operation|||Một phần bộ nhớ được dành riêng cho thao tác I/O"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In <b>isolated I/O</b>, I/O ports have a <b>separate address space</b> from memory (accessed via special IN/OUT instructions).</div><div class=\"ml-vi\">Trong <b>I/O tách biệt</b>, cổng I/O có <b>không gian địa chỉ riêng</b> tách khỏi bộ nhớ (truy cập bằng lệnh IN/OUT riêng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which component defines the system call interface to the operating system and facilitates binary portability?|||Thành phần nào định nghĩa giao diện lời gọi hệ thống (system call) tới HĐH và hỗ trợ tính khả chuyển nhị phân?",
          "options": [
            {
              "text": "Application Binary Interface|||Giao diện nhị phân ứng dụng (ABI)"
            },
            {
              "text": "Application Programming Interface|||Giao diện lập trình ứng dụng (API)"
            },
            {
              "text": "Instruction Set Architecture|||Kiến trúc tập lệnh (ISA)"
            },
            {
              "text": "Central Processing Unit|||Bộ xử lý trung tâm (CPU)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>ABI</b> (Application Binary Interface) defines the system-call interface and enables binary portability.</div><div class=\"ml-vi\"><b>ABI</b> (giao diện nhị phân ứng dụng) định nghĩa giao diện lời gọi hệ thống và cho phép khả chuyển nhị phân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the initial state of a process when it is admitted by the high-level scheduler, but not yet ready to execute?|||Trạng thái ban đầu của một tiến trình khi được bộ định thời mức cao chấp nhận nhưng chưa sẵn sàng thực thi là gì?",
          "options": [
            {
              "text": "New|||Mới (New)"
            },
            {
              "text": "Ready|||Sẵn sàng (Ready)"
            },
            {
              "text": "Running|||Đang chạy (Running)"
            },
            {
              "text": "Halted|||Đã dừng (Halted)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A just-admitted process that is not ready to run yet is in the <b>New</b> state.</div><div class=\"ml-vi\">Tiến trình vừa được chấp nhận nhưng chưa sẵn sàng chạy ở trạng thái <b>New</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The chunks of a program, known as pages, could be assigned to available chunks of memory, known as frames, is called ____.|||Việc các mảnh của chương trình (gọi là trang - pages) được gán vào các mảnh bộ nhớ khả dụng (gọi là khung - frames) được gọi là ____.",
          "options": [
            {
              "text": "Swapping|||Hoán đổi (Swapping)"
            },
            {
              "text": "Partitioning|||Phân vùng (Partitioning)"
            },
            {
              "text": "Paging|||Phân trang (Paging)"
            },
            {
              "text": "Virtual Memory|||Bộ nhớ ảo"
            },
            {
              "text": "Segmentation|||Phân đoạn (Segmentation)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Mapping fixed-size <b>pages</b> onto memory <b>frames</b> is <b>paging</b>.</div><div class=\"ml-vi\">Ánh xạ các <b>trang</b> kích thước cố định vào các <b>khung</b> bộ nhớ là <b>phân trang</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does Boolean algebra contribute to the design of digital circuits?|||Đại số Boole đóng góp thế nào vào thiết kế mạch số?",
          "options": [
            {
              "text": "It simplifies the implementation of desired functions|||Nó đơn giản hóa việc hiện thực các hàm mong muốn"
            },
            {
              "text": "It helps in the analysis of economic data|||Nó giúp phân tích dữ liệu kinh tế"
            },
            {
              "text": "It facilitates the design of analog circuits|||Nó hỗ trợ thiết kế mạch analog"
            },
            {
              "text": "It is primarily used for chemical engineering and physical engineering|||Nó chủ yếu dùng cho kỹ thuật hóa học và vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Boolean algebra <b>simplifies logic expressions</b>, making digital circuit implementation cheaper and smaller.</div><div class=\"ml-vi\">Đại số Boole <b>đơn giản hóa biểu thức logic</b>, giúp hiện thực mạch số rẻ và nhỏ hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When both inputs are 1, what is the result of a NAND gate?|||Khi cả hai đầu vào đều là 1, kết quả của cổng NAND là gì?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "Undefined|||Không xác định"
            },
            {
              "text": "#NA|||#NA"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">NAND = NOT(AND). AND(1,1) = 1, so NAND = <b>0</b>.</div><div class=\"ml-vi\">NAND = NOT(AND). AND(1,1) = 1, nên NAND = <b>0</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Express a sign integer number (+18) in the sign magnitude representation.|||Biểu diễn số nguyên có dấu (+18) ở dạng dấu-độ lớn (sign magnitude).",
          "options": [
            {
              "text": "00010010|||00010010"
            },
            {
              "text": "10010010|||10010010"
            },
            {
              "text": "11110010|||11110010"
            },
            {
              "text": "01110010|||01110010"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">+18 = 0010010 with sign bit 0 → <b>00010010</b>.</div><div class=\"ml-vi\">+18 = 0010010 với bit dấu 0 → <b>00010010</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why is it essential to use symbolic representation of machine instructions?|||Vì sao cần dùng biểu diễn ký hiệu (symbolic) cho các lệnh máy?",
          "options": [
            {
              "text": "It makes machine instructions more human-readable and understandable|||Giúp lệnh máy dễ đọc và dễ hiểu hơn với con người"
            },
            {
              "text": "It reduces the overall complexity of computer systems and user programs|||Giảm độ phức tạp tổng thể của hệ thống và chương trình"
            },
            {
              "text": "It minimizes the need for memory storage for the user programs|||Giảm nhu cầu lưu trữ bộ nhớ cho chương trình"
            },
            {
              "text": "It enables fastest execution of high level language instructions|||Cho phép thực thi nhanh nhất các lệnh ngôn ngữ bậc cao"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Symbolic (assembly) representation makes machine instructions <b>human-readable and understandable</b>.</div><div class=\"ml-vi\">Biểu diễn ký hiệu (hợp ngữ) giúp lệnh máy <b>dễ đọc và dễ hiểu với con người</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The hardware mechanism that allows a device to notify the CPU is called ____.|||Cơ chế phần cứng cho phép một thiết bị thông báo cho CPU được gọi là ____.",
          "options": [
            {
              "text": "polling|||thăm dò (polling)"
            },
            {
              "text": "interrupt|||ngắt (interrupt)"
            },
            {
              "text": "driver|||trình điều khiển (driver)"
            },
            {
              "text": "controlling|||điều khiển (controlling)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>interrupt</b> is the hardware mechanism a device uses to notify the CPU.</div><div class=\"ml-vi\"><b>Ngắt</b> là cơ chế phần cứng thiết bị dùng để thông báo cho CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a branch instruction?|||Lệnh rẽ nhánh (branch instruction) là gì?",
          "options": [
            {
              "text": "The instructions that are used to divide a program into multiple subprograms|||Lệnh dùng để chia chương trình thành nhiều chương trình con"
            },
            {
              "text": "The instructions that have as one of its operands the address of the next instruction to be executed|||Lệnh có một toán hạng là địa chỉ của lệnh kế tiếp cần thực thi"
            },
            {
              "text": "The instructions that are used to pause the program|||Lệnh dùng để tạm dừng chương trình"
            },
            {
              "text": "The instructions that are used to return to the beginning of the program|||Lệnh dùng để quay về đầu chương trình"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>branch</b> carries the address of the next instruction to execute as one of its operands.</div><div class=\"ml-vi\">Lệnh <b>rẽ nhánh</b> mang một toán hạng là địa chỉ của lệnh kế tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The effective address of ____ is EA = A + (R); (R) → (R) + 1.|||Địa chỉ hiệu dụng của ____ là EA = A + (R); (R) → (R) + 1.",
          "options": [
            {
              "text": "relative addressing|||địa chỉ tương đối (relative)"
            },
            {
              "text": "autoindexing|||tự động chỉ số (autoindexing)"
            },
            {
              "text": "postindexing|||hậu chỉ số (postindexing)"
            },
            {
              "text": "preindexing|||tiền chỉ số (preindexing)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Autoindexing</b>: EA = A + (R), and the register is auto-incremented, (R)→(R)+1.</div><div class=\"ml-vi\"><b>Tự động chỉ số</b>: EA = A + (R), và thanh ghi tự tăng, (R)→(R)+1.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In MASM32, which OPCODE is used to compare two values?|||Trong MASM32, mã lệnh (OPCODE) nào dùng để so sánh hai giá trị?",
          "options": [
            {
              "text": "COM|||COM"
            },
            {
              "text": "CMP|||CMP"
            },
            {
              "text": "IF ... ELSE|||IF ... ELSE"
            },
            {
              "text": "TEST|||TEST"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>CMP</b> compares two values (by subtracting and setting flags) in x86 assembly.</div><div class=\"ml-vi\"><b>CMP</b> so sánh hai giá trị (trừ và đặt cờ) trong hợp ngữ x86.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the role of the control unit in a processor?|||Vai trò của đơn vị điều khiển (control unit) trong bộ xử lý là gì?",
          "options": [
            {
              "text": "The control unit's primary role is to perform arithmetic and logical operations within the processor, orchestrating the manipulation of data|||Vai trò chính là thực hiện các phép số học và logic, điều phối thao tác dữ liệu"
            },
            {
              "text": "The control unit only manages the flow of data between the CPU and external devices and does not play a significant role in executing instructions|||Chỉ quản lý luồng dữ liệu giữa CPU và thiết bị ngoài, không đóng vai trò quan trọng trong thực thi lệnh"
            },
            {
              "text": "The control unit is solely responsible for managing the flow of instructions from secondary storage to RAM and does not have a role in the internal operation of the CPU|||Chỉ chịu trách nhiệm quản lý luồng lệnh từ lưu trữ thứ cấp vào RAM, không có vai trò trong hoạt động nội bộ CPU"
            },
            {
              "text": "The control unit in a processor directs and coordinates the execution of instructions, interpreting and managing the flow of operations within the CPU|||Đơn vị điều khiển chỉ huy và điều phối việc thực thi lệnh, thông dịch và quản lý luồng thao tác trong CPU"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The control unit <b>directs and coordinates instruction execution</b>, interpreting and managing operations within the CPU.</div><div class=\"ml-vi\">Đơn vị điều khiển <b>chỉ huy và điều phối việc thực thi lệnh</b>, thông dịch và quản lý các thao tác trong CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How do data registers and address registers differ in some computer systems?|||Thanh ghi dữ liệu và thanh ghi địa chỉ khác nhau thế nào trong một số hệ máy tính?",
          "options": [
            {
              "text": "Address registers can be employed in calculating operand addresses, while data registers hold data.|||Thanh ghi địa chỉ có thể dùng để tính địa chỉ toán hạng, còn thanh ghi dữ liệu giữ dữ liệu."
            },
            {
              "text": "Data registers are only used for stack-related operations|||Thanh ghi dữ liệu chỉ dùng cho các thao tác liên quan ngăn xếp"
            },
            {
              "text": "Data registers are used for indexed addressing, while address registers are used for data storage|||Thanh ghi dữ liệu dùng cho địa chỉ chỉ số, còn thanh ghi địa chỉ dùng để lưu dữ liệu"
            },
            {
              "text": "Address registers are reserved for segmented addressing, while data registers are general-purpose|||Thanh ghi địa chỉ dành cho địa chỉ phân đoạn, còn thanh ghi dữ liệu là đa dụng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Address registers</b> help compute operand addresses; <b>data registers</b> hold data values.</div><div class=\"ml-vi\"><b>Thanh ghi địa chỉ</b> giúp tính địa chỉ toán hạng; <b>thanh ghi dữ liệu</b> giữ giá trị dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main benefit of using ARM processors over other processors?|||Lợi ích chính của việc dùng bộ xử lý ARM so với bộ xử lý khác là gì?",
          "options": [
            {
              "text": "Low cost and low power consumption|||Chi phí thấp và tiêu thụ điện thấp"
            },
            {
              "text": "Higher degree of multi-tasking|||Mức độ đa nhiệm cao hơn"
            },
            {
              "text": "Lower error or glitches|||Ít lỗi hay trục trặc hơn"
            },
            {
              "text": "Efficient memory management|||Quản lý bộ nhớ hiệu quả"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">ARM's main advantage is <b>low cost and low power consumption</b> (ideal for mobile/embedded).</div><div class=\"ml-vi\">Ưu điểm chính của ARM là <b>chi phí thấp và tiêu thụ điện thấp</b> (lý tưởng cho di động/nhúng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement is incorrect about RISC and CISC architecture?|||Phát biểu nào SAI về kiến trúc RISC và CISC?",
          "options": [
            {
              "text": "CISC architecture is more convenient for programmers than RISC architecture.|||Kiến trúc CISC thuận tiện cho lập trình viên hơn RISC."
            },
            {
              "text": "CISC architecture has more operands in a instruction compared to RISC architecture.|||Kiến trúc CISC có nhiều toán hạng trong một lệnh hơn RISC."
            },
            {
              "text": "CISC architecture has a more flexible instruction set than RISC architecture.|||Kiến trúc CISC có tập lệnh linh hoạt hơn RISC."
            },
            {
              "text": "CISC architecture requires more general-purpose registers than RISC architecture.|||Kiến trúc CISC cần nhiều thanh ghi đa dụng hơn RISC."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">It is <b>RISC</b> that needs more general-purpose registers, so 'CISC requires more GPRs' (D) is the false statement.</div><div class=\"ml-vi\">Chính <b>RISC</b> mới cần nhiều thanh ghi đa dụng, nên phát biểu 'CISC cần nhiều thanh ghi hơn' (D) là sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the concept of Register Windows, how many register groups are there?|||Trong khái niệm Cửa sổ thanh ghi (Register Windows), có bao nhiêu nhóm thanh ghi?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "No distinction|||Không phân biệt"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A register window has <b>3</b> groups: parameter, local, and temporary registers.</div><div class=\"ml-vi\">Một cửa sổ thanh ghi có <b>3</b> nhóm: thanh ghi tham số, cục bộ và tạm thời.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main benefit of using RISC over CISC?|||Lợi ích chính của việc dùng RISC so với CISC là gì?",
          "options": [
            {
              "text": "RISC has more instructions and addressing modes than CISC|||RISC có nhiều lệnh và chế độ địa chỉ hơn CISC"
            },
            {
              "text": "RISC has faster instruction execution and simpler instruction decoding than CISC|||RISC thực thi lệnh nhanh hơn và giải mã lệnh đơn giản hơn CISC"
            },
            {
              "text": "RISC has variable-length instruction formats and direct memory access than CISC|||RISC có định dạng lệnh độ dài thay đổi và truy cập bộ nhớ trực tiếp hơn CISC"
            },
            {
              "text": "RISC has more registers and pipelines than CISC|||RISC có nhiều thanh ghi và pipeline hơn CISC"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">RISC gives <b>faster execution and simpler decoding</b> thanks to simple fixed-length instructions.</div><div class=\"ml-vi\">RISC cho <b>thực thi nhanh hơn và giải mã đơn giản hơn</b> nhờ lệnh đơn giản, độ dài cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the benefit of using a superscalar organization over a scalar organization?|||Lợi ích của tổ chức siêu vô hướng (superscalar) so với vô hướng (scalar) là gì?",
          "options": [
            {
              "text": "It increases the instruction throughput and improves the performance|||Tăng thông lượng lệnh và cải thiện hiệu năng"
            },
            {
              "text": "It reduces the power consumption and the heat dissipation|||Giảm tiêu thụ điện và tỏa nhiệt"
            },
            {
              "text": "It simplifies the instruction set and the compiler design|||Đơn giản hóa tập lệnh và thiết kế trình biên dịch"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A superscalar processor issues multiple instructions per cycle, <b>increasing throughput and performance</b>.</div><div class=\"ml-vi\">Bộ xử lý siêu vô hướng phát nhiều lệnh mỗi chu kỳ, <b>tăng thông lượng và hiệu năng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What does the term \"instruction-level parallelism\" refer to in computer architecture?|||Thuật ngữ 'song song mức lệnh' (instruction-level parallelism) chỉ điều gì trong kiến trúc máy tính?",
          "options": [
            {
              "text": "The degree to which instructions in a program can be executed in parallel|||Mức độ mà các lệnh trong chương trình có thể được thực thi song song"
            },
            {
              "text": "The number of processor cores in a multi-core CPU with multiple resources|||Số nhân bộ xử lý trong một CPU đa nhân"
            },
            {
              "text": "The complexity of the instruction set architecture|||Độ phức tạp của kiến trúc tập lệnh"
            },
            {
              "text": "The length of an instruction cycle with high level programing language|||Độ dài của một chu kỳ lệnh"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>ILP</b> is the degree to which a program's instructions can be executed in parallel.</div><div class=\"ml-vi\"><b>ILP</b> là mức độ mà các lệnh của chương trình có thể thực thi song song.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To enhance performance in a superscalar processor, which method(s) should we apply?|||Để tăng hiệu năng trong bộ xử lý siêu vô hướng, nên áp dụng phương pháp nào?",
          "options": [
            {
              "text": "Duplication of resources.|||Nhân đôi tài nguyên (Duplication of resources)."
            },
            {
              "text": "Out-of-order issue.|||Phát lệnh không theo thứ tự (Out-of-order issue)."
            },
            {
              "text": "Renaming registers|||Đổi tên thanh ghi (Renaming registers)."
            },
            {
              "text": "All of the mentioned.|||Tất cả các đáp án."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">All three — <b>resource duplication, out-of-order issue, and register renaming</b> — boost superscalar performance.</div><div class=\"ml-vi\">Cả ba — <b>nhân đôi tài nguyên, phát lệnh không thứ tự và đổi tên thanh ghi</b> — đều tăng hiệu năng siêu vô hướng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many common classifications of parallel systems are there as proposed by Flynn?|||Theo Flynn, có bao nhiêu phân loại hệ song song phổ biến?",
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
          "explanation": "<div class=\"ml-en\">Flynn's taxonomy has <b>4</b> classes: SISD, SIMD, MISD, MIMD.</div><div class=\"ml-vi\">Phân loại Flynn có <b>4</b> loại: SISD, SIMD, MISD, MIMD.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which write technique in which all write operations are made to main memory as well as to the cache, ensuring that main memory is always valid.|||Kỹ thuật ghi nào mà mọi thao tác ghi đều được thực hiện vào cả bộ nhớ chính lẫn cache, đảm bảo bộ nhớ chính luôn hợp lệ?",
          "options": [
            {
              "text": "Write through|||Write through"
            },
            {
              "text": "Write back|||Write back"
            },
            {
              "text": "Write around|||Write around"
            },
            {
              "text": "No write allocate|||No write allocate"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Write-through</b> writes to cache and main memory simultaneously, keeping memory always valid.</div><div class=\"ml-vi\"><b>Write-through</b> ghi vào cache và bộ nhớ chính cùng lúc, giữ bộ nhớ luôn hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does multithreading improve the performance of a processor?|||Đa luồng (multithreading) cải thiện hiệu năng bộ xử lý thế nào?",
          "options": [
            {
              "text": "It increases the instruction-level parallelism by issuing multiple instructions from different threads in the same cycle|||Tăng song song mức lệnh bằng cách phát nhiều lệnh từ các luồng khác nhau trong cùng chu kỳ"
            },
            {
              "text": "It increases the thread-level parallelism by executing multiple threads on different cores or processors|||Tăng song song mức luồng bằng cách chạy nhiều luồng trên các nhân/bộ xử lý khác nhau"
            },
            {
              "text": "It increases the utilization of the processor resources by hiding the latency of long-latency events such as cache misses or branch mispredictions|||Tăng tận dụng tài nguyên bằng cách che độ trễ của sự kiện độ trễ dài như cache miss hay dự đoán rẽ nhánh sai"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Multithreading helps in <b>all these ways</b> — boosting ILP, TLP, and hiding long-latency stalls.</div><div class=\"ml-vi\">Đa luồng giúp theo <b>tất cả các cách này</b> — tăng ILP, TLP và che độ trễ dài.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Follow the Amdahl's law for multiprocessors, if only 10% of the code is inherently serial (f = 0.9), running the program on a multicore system with 4 processors, a performance gain (speedup factor) would be ____.|||Theo định luật Amdahl cho đa xử lý, nếu chỉ 10% mã là tuần tự cố hữu (f = 0.9), chạy trên hệ đa nhân 4 bộ xử lý thì độ lợi hiệu năng (hệ số tăng tốc) là ____.",
          "options": [
            {
              "text": "307%|||307%"
            },
            {
              "text": "297%|||297%"
            },
            {
              "text": "317%|||317%"
            },
            {
              "text": "327%|||327%"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Speedup = 1/(0.1 + 0.9/4) = 1/0.325 ≈ 3.08× ≈ <b>307%</b>.</div><div class=\"ml-vi\">Tăng tốc = 1/(0.1 + 0.9/4) = 1/0.325 ≈ 3.08 lần ≈ <b>307%</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cache is not a shared cache?|||Cache nào KHÔNG phải là cache dùng chung?",
          "options": [
            {
              "text": "L4 cache|||Cache L4"
            },
            {
              "text": "L3 cache|||Cache L3"
            },
            {
              "text": "L2 cache|||Cache L2"
            },
            {
              "text": "L1 cache|||Cache L1"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>L1</b> is private per core (not shared); L2/L3/L4 are typically shared.</div><div class=\"ml-vi\"><b>L1</b> riêng cho từng nhân (không dùng chung); L2/L3/L4 thường dùng chung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the significance of the program counter (PC) in the fetch phase of the instruction cycle?|||Ý nghĩa của bộ đếm chương trình (PC) trong pha lấy lệnh (fetch) của chu kỳ lệnh là gì?",
          "options": [
            {
              "text": "The program counter (PC) is not used in the fetch phase, and its role is limited to tracking the number of instructions executed by the CPU|||PC không được dùng trong pha fetch, vai trò của nó chỉ là đếm số lệnh CPU đã thực thi"
            },
            {
              "text": "The program counter (PC) in the fetch phase holds the memory address of the next instruction to be fetched and executed|||PC trong pha fetch giữ địa chỉ bộ nhớ của lệnh kế tiếp cần lấy và thực thi"
            },
            {
              "text": "The program counter (PC) is responsible for executing instructions and has no specific role during the fetch phase|||PC chịu trách nhiệm thực thi lệnh và không có vai trò cụ thể trong pha fetch"
            },
            {
              "text": "The program counter (PC) is only relevant in multi-core processors and does not contribute to the fetch phase of the instruction cycle in single-core systems|||PC chỉ liên quan tới bộ xử lý đa nhân, không đóng góp vào pha fetch trong hệ đơn nhân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the fetch phase the <b>PC holds the address of the next instruction</b> to fetch and execute.</div><div class=\"ml-vi\">Trong pha fetch, <b>PC giữ địa chỉ của lệnh kế tiếp</b> cần lấy và thực thi.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D4",
      "source": "REAL",
      "sortOrder": 3,
      "title": "Đề 4 — Final Exam (FA25 Retake)|||Đề 4 — Thi cuối kỳ (FA25 Thi lại)",
      "description": "Real FE multiple-choice paper (CEA201, Fall 2025 Retake), 50 questions transcribed from the exam images; answers reasoned here.|||Đề trắc nghiệm FE thật (CEA201, kỳ Thu 2025 - Thi lại), 50 câu chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is NOT part of the Von Neumann principle?|||Phát biểu nào sau đây KHÔNG thuộc nguyên lý Von Neumann?",
          "options": [
            {
              "text": "Computers can operate according to a stored program|||Máy tính có thể hoạt động theo một chương trình lưu trữ"
            },
            {
              "text": "The computer uses a program counter to indicate the location of the next statement|||Máy tính dùng bộ đếm chương trình để chỉ vị trí của lệnh kế tiếp"
            },
            {
              "text": "A computer's memory is addressable|||Bộ nhớ máy tính có thể định địa chỉ"
            },
            {
              "text": "Each statement must have a memory area containing the address of the next instruction|||Mỗi lệnh phải có vùng nhớ chứa địa chỉ của lệnh kế tiếp"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Von Neumann uses a program counter to sequence instructions; an instruction does NOT store the address of the next one — that describes older non-von-Neumann machines. So option D is not part of the principle.</div><div class=\"ml-vi\">Von Neumann dùng bộ đếm chương trình để tuần tự hóa lệnh; một lệnh KHÔNG chứa địa chỉ của lệnh kế tiếp — đó là mô tả máy cũ không theo Von Neumann. Nên phương án D không thuộc nguyên lý.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary role of the IO module? (choose two correct answers)|||Vai trò chính của mô-đun I/O là gì? (chọn hai đáp án đúng)",
          "options": [
            {
              "text": "Its role is data transfer, it will transfer data to and from peripheral devices.|||Vai trò truyền dữ liệu — chuyển dữ liệu tới/từ thiết bị ngoại vi."
            },
            {
              "text": "Its role is device communication control, it manages and controls the flow of data between the CPU and peripherals|||Vai trò điều khiển giao tiếp thiết bị — quản lý và điều khiển luồng dữ liệu giữa CPU và ngoại vi"
            },
            {
              "text": "Its role is data formatting and converting analog signals into digital audio data for CPU|||Vai trò định dạng dữ liệu và chuyển tín hiệu analog thành dữ liệu âm thanh số cho CPU"
            },
            {
              "text": "Its role is protecting data from user, ensuring that sensitive information is not lost or intercepted.|||Vai trò bảo vệ dữ liệu khỏi người dùng, đảm bảo thông tin nhạy cảm không bị mất hay bị chặn."
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">An I/O module has two core jobs: <b>data transfer</b> and <b>control &amp; communication</b> between the CPU and peripherals.</div><div class=\"ml-vi\">Mô-đun I/O có hai nhiệm vụ cốt lõi: <b>truyền dữ liệu</b> và <b>điều khiển &amp; giao tiếp</b> giữa CPU và ngoại vi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the most important function of the control unit (CU)?|||Chức năng quan trọng nhất của đơn vị điều khiển (CU) là gì?",
          "options": [
            {
              "text": "It manages the order of running instructions.|||Nó quản lý thứ tự chạy các lệnh."
            },
            {
              "text": "It will read and process data from main memory.|||Nó đọc và xử lý dữ liệu từ bộ nhớ chính."
            },
            {
              "text": "It directs the operation of the other CPU components.|||Nó chỉ huy hoạt động của các thành phần khác trong CPU."
            },
            {
              "text": "It will read instructions from main memory then decoding them.|||Nó đọc lệnh từ bộ nhớ chính rồi giải mã chúng."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The CU's central role is to <b>direct and coordinate the other CPU components</b> (ALU, registers, buses).</div><div class=\"ml-vi\">Vai trò trung tâm của CU là <b>chỉ huy và điều phối các thành phần khác trong CPU</b> (ALU, thanh ghi, bus).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The stored-program concept means a computer could get its instructions by reading them from memory, and a program could be set or altered by setting the values of a portion of memory.|||Khái niệm chương trình lưu trữ (stored-program) nghĩa là máy tính có thể lấy lệnh bằng cách đọc từ bộ nhớ, và một chương trình có thể được thiết lập hoặc thay đổi bằng cách đặt giá trị cho một phần bộ nhớ.",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is exactly the definition of the <b>stored-program concept</b> — <b>True</b>.</div><div class=\"ml-vi\">Đây chính là định nghĩa của <b>khái niệm chương trình lưu trữ</b> — <b>Đúng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is Memory Address Register (MAR)?|||Thanh ghi địa chỉ bộ nhớ (MAR) là gì?",
          "options": [
            {
              "text": "Contains a word to be stored in memory or sent to the I/O unit, or is used to receive a word from memory or from the I/O unit.|||Chứa một từ sẽ được lưu vào bộ nhớ hoặc gửi tới đơn vị I/O, hoặc dùng để nhận một từ từ bộ nhớ/I/O."
            },
            {
              "text": "Employed to hold temporarily the righthand instruction from a word in memory.|||Dùng để tạm giữ lệnh bên phải trong một từ nhớ."
            },
            {
              "text": "Contains the address in memory of the word to be written from or read into the MBR.|||Chứa địa chỉ trong bộ nhớ của từ cần ghi ra từ MBR hoặc đọc vào MBR."
            },
            {
              "text": "Contains the address of the next instruction pair to be fetched from memory.|||Chứa địa chỉ của cặp lệnh kế tiếp cần lấy từ bộ nhớ."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">MAR holds the <b>memory address</b> of the word to be read into or written from the MBR. (Option A describes the MBR.)</div><div class=\"ml-vi\">MAR giữ <b>địa chỉ bộ nhớ</b> của từ cần đọc vào hoặc ghi ra từ MBR. (Phương án A mô tả MBR.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider an expression: 1000 0000 AND 1111 1010. What is the result of this expression?|||Xét biểu thức: 1000 0000 AND 1111 1010. Kết quả của biểu thức này là gì?",
          "options": [
            {
              "text": "1000 0000|||1000 0000"
            },
            {
              "text": "1111 0000|||1111 0000"
            },
            {
              "text": "1001 1010|||1001 1010"
            },
            {
              "text": "1001 0101|||1001 0101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Bitwise AND keeps 1 only where BOTH bits are 1 → only the top bit → <b>1000 0000</b>.</div><div class=\"ml-vi\">Phép AND bit giữ 1 chỉ khi CẢ hai bit là 1 → chỉ bit cao nhất → <b>1000 0000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which register is the memory address register?|||Thanh ghi nào là thanh ghi địa chỉ bộ nhớ?",
          "options": [
            {
              "text": "MAR|||MAR"
            },
            {
              "text": "MBR|||MBR"
            },
            {
              "text": "IR|||IR"
            },
            {
              "text": "PC|||PC"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>MAR</b> (Memory Address Register) holds the address for a memory access.</div><div class=\"ml-vi\"><b>MAR</b> (thanh ghi địa chỉ bộ nhớ) giữ địa chỉ cho một lần truy cập bộ nhớ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "When an interrupt is about to execute next, where is the Program Counter (PC) positioned?|||Khi một ngắt sắp được thực thi kế tiếp, Bộ đếm chương trình (PC) trỏ tới đâu?",
          "options": [
            {
              "text": "Add 1 to PC|||Cộng 1 vào PC"
            },
            {
              "text": "At the address of the last executed instruction|||Địa chỉ của lệnh vừa thực thi"
            },
            {
              "text": "Jump to random unknown position|||Nhảy tới vị trí ngẫu nhiên"
            },
            {
              "text": "At the started address of an interrupt handler routine|||Địa chỉ bắt đầu của thủ tục xử lý ngắt (interrupt handler)"
            },
            {
              "text": "At the beginning of the memory address space|||Đầu không gian địa chỉ bộ nhớ"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">On an interrupt, the PC is loaded with the <b>start address of the interrupt handler</b> routine.</div><div class=\"ml-vi\">Khi có ngắt, PC được nạp <b>địa chỉ bắt đầu của thủ tục xử lý ngắt</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following determines the Bus Width?|||Yếu tố nào quyết định độ rộng bus (Bus Width)?",
          "options": [
            {
              "text": "The clock speed of the CPU|||Tốc độ xung nhịp CPU"
            },
            {
              "text": "The number of cores in the processor|||Số nhân của bộ xử lý"
            },
            {
              "text": "The size of the motherboard|||Kích thước bo mạch chủ"
            },
            {
              "text": "The number of parallel lines in the data bus|||Số đường song song trong bus dữ liệu"
            },
            {
              "text": "Number of components connected to Bus|||Số thành phần nối vào bus"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Bus width = the <b>number of parallel lines</b> in the data bus.</div><div class=\"ml-vi\">Độ rộng bus = <b>số đường song song</b> trong bus dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following memory devices has the lowest access speed?|||Thiết bị nhớ nào sau đây có tốc độ truy cập THẤP nhất?",
          "options": [
            {
              "text": "ROM|||ROM"
            },
            {
              "text": "Flash memory|||Bộ nhớ flash"
            },
            {
              "text": "Magnetic tape|||Băng từ (Magnetic tape)"
            },
            {
              "text": "HDD|||HDD"
            },
            {
              "text": "Cache|||Cache"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Magnetic tape</b> is a sequential-access medium and has the lowest access speed of these.</div><div class=\"ml-vi\"><b>Băng từ</b> là môi trường truy cập tuần tự và có tốc độ truy cập thấp nhất trong số này.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A two-way set-associative cache has lines of 16 bytes and a total size of 8 Kbytes. The 64-Mbyte main memory is byte addressable. How many bits are there in the set field of the cache?|||Một cache liên kết-tập hợp hai chiều (two-way) có dòng 16 byte và tổng dung lượng 8 Kbyte. Bộ nhớ chính 64 MB định địa chỉ theo byte. Trường 'tập' (set field) của cache có bao nhiêu bit?",
          "options": [
            {
              "text": "5|||5"
            },
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
            3
          ],
          "explanation": "<div class=\"ml-en\">Lines = 8KB/16B = 512. Two-way → sets = 512/2 = 256 = 2⁸ → set field = <b>8</b> bits.</div><div class=\"ml-vi\">Số dòng = 8KB/16B = 512. Hai chiều → số tập = 512/2 = 256 = 2⁸ → trường tập = <b>8</b> bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In one-cache system using direct mapping technique, with the cache containing 10 lines, which memory block's data can be transferred to the cache line 7?|||Trong hệ một cache dùng ánh xạ trực tiếp, cache có 10 dòng, dữ liệu của khối bộ nhớ nào có thể chuyển vào dòng cache số 7?",
          "options": [
            {
              "text": "7, 17, 27, 37. .....|||7, 17, 27, 37. ....."
            },
            {
              "text": "0, 1, 2, 3, 4, 5, 6, 7, ...|||0, 1, 2, 3, 4, 5, 6, 7, ..."
            },
            {
              "text": "0, 7, 17, 27, 37, ...|||0, 7, 17, 27, 37, ..."
            },
            {
              "text": "0, 7, 77, 777, ...|||0, 7, 77, 777, ..."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Direct mapping: block j → line (j mod 10). Line 7 receives blocks where j mod 10 = 7 → <b>7, 17, 27, 37, …</b>.</div><div class=\"ml-vi\">Ánh xạ trực tiếp: khối j → dòng (j mod 10). Dòng 7 nhận các khối có j mod 10 = 7 → <b>7, 17, 27, 37, …</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The use of Hamming code on 4-bit words (M = 4) is illustrated by a Venn diagram of three intersecting circles A, B, C (seven compartments). The 4 data bits occupy the inner overlapping compartments: A∩B = 1, the center A∩B∩C = 1, A∩C = 1, B∩C = 0. Each parity bit (in the outer-only compartment of each circle) is chosen so the total number of 1s in its circle is even. Choose the correct value of the parity bit in circles A, B, C.|||Việc dùng mã Hamming cho từ 4 bit (M = 4) được minh họa bằng sơ đồ Venn ba vòng tròn giao nhau A, B, C (bảy ngăn). 4 bit dữ liệu nằm ở các ngăn giao nhau bên trong: A∩B = 1, tâm A∩B∩C = 1, A∩C = 1, B∩C = 0. Mỗi bit parity (ở ngăn riêng của từng vòng) được chọn sao cho tổng số bit 1 trong vòng đó là chẵn. Chọn giá trị đúng của bit parity trong các vòng A, B, C.",
          "options": [
            {
              "text": "1; 0; 0|||1; 0; 0"
            },
            {
              "text": "0; 1; 0|||0; 1; 0"
            },
            {
              "text": "0; 0; 1|||0; 0; 1"
            },
            {
              "text": "1; 0; 1|||1; 0; 1"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Circle A data = {A∩B, A∩C, center} = 1+1+1 = 3 → parity 1. Circle B = {A∩B, B∩C, center} = 1+0+1 = 2 → parity 0. Circle C = {A∩C, B∩C, center} = 1+0+1 = 2 → parity 0. So <b>1; 0; 0</b>.</div><div class=\"ml-vi\">Vòng A gồm {A∩B, A∩C, tâm} = 1+1+1 = 3 → parity 1. Vòng B = {A∩B, B∩C, tâm} = 1+0+1 = 2 → parity 0. Vòng C = {A∩C, B∩C, tâm} = 1+0+1 = 2 → parity 0. Vậy <b>1; 0; 0</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In error correcting code (single ECC), how many bits are used to correct one bit in 8-bit data?|||Trong mã sửa lỗi đơn (single ECC), cần bao nhiêu bit để sửa một bit lỗi trong dữ liệu 8 bit?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "5|||5"
            },
            {
              "text": "6|||6"
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Hamming needs 2ᵏ ≥ m+k+1. For m=8, k=<b>4</b> (2⁴=16 ≥ 13).</div><div class=\"ml-vi\">Mã Hamming cần 2ᵏ ≥ m+k+1. Với m=8, k=<b>4</b> (2⁴=16 ≥ 13).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using Hamming Code with one error correction to store a 12-bit word in memory, the stored word 101001011101 consists of 8 bits data and 4 bits parity check. What are the data bits?|||Dùng mã Hamming sửa một lỗi để lưu một từ 12 bit trong bộ nhớ, từ đã lưu 101001011101 gồm 8 bit dữ liệu và 4 bit parity. Các bit dữ liệu là gì?",
          "options": [
            {
              "text": "01001101|||01001101"
            },
            {
              "text": "10100100|||10100100"
            },
            {
              "text": "10101011|||10101011"
            },
            {
              "text": "01011101|||01011101"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">Removing the parity bits at positions 1, 2, 4, 8 does not match options A–D, so the answer is <b>None of the mentioned</b>.</div><div class=\"ml-vi\">Bỏ các bit parity ở vị trí 1, 2, 4, 8 không khớp phương án A–D, nên đáp án là <b>Không đáp án nào</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "With the hard disk data layout, the set of all the tracks in the same relative position on the platter, is called ____.|||Trong bố cục dữ liệu ổ cứng, tập hợp tất cả các track ở cùng vị trí tương đối trên các mặt đĩa được gọi là ____.",
          "options": [
            {
              "text": "Cylinder|||Cylinder (trụ)"
            },
            {
              "text": "Tracks|||Tracks (rãnh)"
            },
            {
              "text": "Inter-track gap|||Inter-track gap (khe giữa rãnh)"
            },
            {
              "text": "Sector|||Sector (cung)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The set of tracks at the same position across all platters forms a <b>cylinder</b>.</div><div class=\"ml-vi\">Tập các track ở cùng vị trí trên mọi mặt đĩa tạo thành một <b>cylinder (trụ)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In modern computers, which devices among the memory types usually have the smallest capacity?|||Trong máy tính hiện đại, loại bộ nhớ nào thường có dung lượng nhỏ nhất?",
          "options": [
            {
              "text": "RAM|||RAM"
            },
            {
              "text": "Magnetic Tape|||Băng từ (Magnetic Tape)"
            },
            {
              "text": "Hard Disk Drive|||Ổ đĩa cứng (HDD)"
            },
            {
              "text": "Cache Memory|||Bộ nhớ Cache"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Among these, <b>cache memory</b> has the smallest capacity (fastest, closest to the CPU).</div><div class=\"ml-vi\">Trong số này, <b>bộ nhớ cache</b> có dung lượng nhỏ nhất (nhanh nhất, gần CPU nhất).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In terms of performance, what is the main advantage of a solid state drive over a magnetic disk?|||Về hiệu năng, ưu điểm chính của ổ SSD so với đĩa từ là gì?",
          "options": [
            {
              "text": "A solid state drive has faster access time, lower latency, and higher reliability|||SSD có thời gian truy cập nhanh hơn, độ trễ thấp hơn và độ tin cậy cao hơn"
            },
            {
              "text": "A solid state drive has larger capacity, lower power consumption, and lower cost|||SSD có dung lượng lớn hơn, tiêu thụ điện thấp hơn và chi phí thấp hơn"
            },
            {
              "text": "A solid state drive has better compatibility, longer lifespan, and higher security|||SSD tương thích tốt hơn, tuổi thọ dài hơn và bảo mật cao hơn"
            },
            {
              "text": "A solid state drive has none of the mentioned advantages over a magnetic disk|||SSD không có ưu điểm nào nêu trên so với đĩa từ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">SSDs win on <b>faster access time, lower latency, and higher reliability</b> (no moving parts).</div><div class=\"ml-vi\">SSD thắng ở <b>thời gian truy cập nhanh, độ trễ thấp và độ tin cậy cao</b> (không có bộ phận chuyển động).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the truth table (A, B, F): (0,0,1), (0,1,0), (1,0,0), (1,1,0). Choose the correct Algebraic Function that matches the given truth table.|||Cho bảng chân trị (A, B, F): (0,0,1), (0,1,0), (1,0,0), (1,1,0). Chọn hàm đại số Boole khớp với bảng chân trị đã cho.",
          "options": [
            {
              "text": "F = NOT (A + B)|||F = NOT (A + B)"
            },
            {
              "text": "F = A XOR B|||F = A XOR B"
            },
            {
              "text": "F = A AND NOT B|||F = A AND NOT B"
            },
            {
              "text": "F = NOT A AND B|||F = NOT A AND B"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">F = 1 only when A=0 and B=0 → that is NOR = <b>NOT(A + B)</b>.</div><div class=\"ml-vi\">F = 1 chỉ khi A=0 và B=0 → đó là NOR = <b>NOT(A + B)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which statement is correct in memory-mapped I/O?|||Phát biểu nào đúng với I/O ánh xạ bộ nhớ (memory-mapped I/O)?",
          "options": [
            {
              "text": "The I/O devices and the memory share the same address space|||Thiết bị I/O và bộ nhớ dùng chung không gian địa chỉ"
            },
            {
              "text": "The I/O devices have a separate address space|||Thiết bị I/O có không gian địa chỉ riêng"
            },
            {
              "text": "The memory and I/O devices have an associated address space|||Bộ nhớ và thiết bị I/O có một không gian địa chỉ liên kết"
            },
            {
              "text": "A part of the memory is specifically set aside for the I/O operation|||Một phần bộ nhớ được dành riêng cho thao tác I/O"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">In <b>memory-mapped I/O</b>, I/O devices and memory <b>share the same address space</b>, so ordinary load/store instructions access I/O.</div><div class=\"ml-vi\">Trong <b>I/O ánh xạ bộ nhớ</b>, thiết bị I/O và bộ nhớ <b>dùng chung không gian địa chỉ</b>, nên lệnh nạp/ghi thông thường truy cập được I/O.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The advantage of interrupt driven I/O over programmed I/O is ____.|||Ưu điểm của I/O điều khiển bằng ngắt (interrupt-driven) so với programmed I/O là ____.",
          "options": [
            {
              "text": "the latter offers faster transfer of data|||cái sau (programmed I/O) truyền dữ liệu nhanh hơn"
            },
            {
              "text": "the former does not have to wait until I/O operation is complete|||cái trước (interrupt-driven) không phải chờ tới khi thao tác I/O hoàn tất"
            },
            {
              "text": "the devices have to deal with fewer address lines|||thiết bị phải xử lý ít đường địa chỉ hơn"
            },
            {
              "text": "no advantage as such|||không có ưu điểm gì"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">With interrupt-driven I/O the CPU <b>does not busy-wait</b> for I/O to finish — it works on other tasks and is interrupted when I/O is ready.</div><div class=\"ml-vi\">Với I/O điều khiển bằng ngắt, CPU <b>không phải bận-chờ</b> I/O xong — nó làm việc khác và được ngắt khi I/O sẵn sàng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main advantage of using DMA over Programmed I/O or Interrupt-Driven I/O?|||Ưu điểm chính của việc dùng DMA so với Programmed I/O hoặc Interrupt-Driven I/O là gì?",
          "options": [
            {
              "text": "DMA reduces the CPU involvement and overhead in data transfer|||DMA giảm sự tham gia và chi phí của CPU trong truyền dữ liệu"
            },
            {
              "text": "DMA increases the data transfer rate and efficiency|||DMA tăng tốc độ và hiệu suất truyền dữ liệu"
            },
            {
              "text": "DMA allows concurrent execution of CPU and I/O operations|||DMA cho phép CPU và thao tác I/O chạy đồng thời"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">DMA offloads transfers from the CPU, raises throughput, and lets CPU and I/O run concurrently — <b>all of the mentioned</b>.</div><div class=\"ml-vi\">DMA giảm tải truyền cho CPU, tăng thông lượng và cho CPU và I/O chạy song song — <b>tất cả các đáp án</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If a program accesses data in a specified file, how to manage the file's properties such as disk position, file's attributes?|||Nếu một chương trình truy cập dữ liệu trong một tệp cụ thể, thuộc tính của tệp (vị trí trên đĩa, thuộc tính tệp) được quản lý thế nào?",
          "options": [
            {
              "text": "They are managed by the current operating system.|||Được quản lý bởi hệ điều hành hiện tại."
            },
            {
              "text": "They are managed using variables of the running program.|||Được quản lý bằng các biến của chương trình đang chạy."
            },
            {
              "text": "They are stored on the hard disk.|||Được lưu trên đĩa cứng."
            },
            {
              "text": "They are managed by the programmer.|||Được quản lý bởi lập trình viên."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">File metadata (disk location, attributes) is managed by the <b>operating system</b>, not the application.</div><div class=\"ml-vi\">Siêu dữ liệu tệp (vị trí trên đĩa, thuộc tính) do <b>hệ điều hành</b> quản lý, không phải ứng dụng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the initial state of a process when it is admitted by the high-level scheduler, but not yet ready to execute?|||Trạng thái ban đầu của một tiến trình khi được bộ định thời mức cao chấp nhận nhưng chưa sẵn sàng thực thi là gì?",
          "options": [
            {
              "text": "New|||Mới (New)"
            },
            {
              "text": "Ready|||Sẵn sàng (Ready)"
            },
            {
              "text": "Running|||Đang chạy (Running)"
            },
            {
              "text": "Halted|||Đã dừng (Halted)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A just-admitted process that is not ready to run yet is in the <b>New</b> state.</div><div class=\"ml-vi\">Tiến trình vừa được chấp nhận nhưng chưa sẵn sàng chạy ở trạng thái <b>New</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is incorrect about Translation Look-aside Buffer (TLB)?|||Phát biểu nào sau đây SAI về Bộ đệm dịch địa chỉ (TLB)?",
          "options": [
            {
              "text": "The use of TLB eliminates the need for keeping a page table in memory|||Việc dùng TLB loại bỏ nhu cầu giữ bảng trang trong bộ nhớ"
            },
            {
              "text": "TLB only maintains a subset of the entries stored in the full memory-based page table|||TLB chỉ giữ một tập con các mục của bảng trang đầy đủ trong bộ nhớ"
            },
            {
              "text": "When there is a TLB miss the system needs to access the page table|||Khi TLB miss, hệ thống cần truy cập bảng trang"
            },
            {
              "text": "A translation lookaside buffer (TLB) is a memory cache that stores the recent translations of virtual memory to physical memory|||TLB là một cache bộ nhớ lưu các bản dịch gần đây từ địa chỉ ảo sang địa chỉ vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The TLB is only a <b>cache</b> of page-table entries; the full page table still lives in memory. So statement A is false.</div><div class=\"ml-vi\">TLB chỉ là một <b>cache</b> các mục bảng trang; bảng trang đầy đủ vẫn nằm trong bộ nhớ. Nên phát biểu A sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "(R1) = 01110110, (R2) = 11011111, the result of (R1) XOR (R2) is:|||(R1) = 01110110, (R2) = 11011111, kết quả của (R1) XOR (R2) là:",
          "options": [
            {
              "text": "11011011|||11011011"
            },
            {
              "text": "00010110|||00010110"
            },
            {
              "text": "10101001|||10101001"
            },
            {
              "text": "11001101|||11001101"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">XOR gives 1 where bits differ: 01110110 ⊕ 11011111 = <b>10101001</b>.</div><div class=\"ml-vi\">XOR cho 1 ở vị trí bit khác nhau: 01110110 ⊕ 11011111 = <b>10101001</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of a NOT gate when the input is 0?|||Đầu ra của cổng NOT khi đầu vào là 0 là gì?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "Undefined|||Không xác định"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A NOT gate inverts its input: NOT 0 = <b>1</b>.</div><div class=\"ml-vi\">Cổng NOT đảo đầu vào: NOT 0 = <b>1</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The operation ____ yields true (binary value 1) if and only if both of its operands are true.|||Phép toán ____ cho ra true (giá trị nhị phân 1) khi và chỉ khi cả hai toán hạng đều true.",
          "options": [
            {
              "text": "OR|||OR"
            },
            {
              "text": "AND|||AND"
            },
            {
              "text": "XOR|||XOR"
            },
            {
              "text": "NAND|||NAND"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>AND</b> operation is true only when both operands are true.</div><div class=\"ml-vi\">Phép <b>AND</b> chỉ đúng khi cả hai toán hạng đều đúng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following Karnaugh map, what is the optimal expression in the sum of product format (X' means Not X)?<table class=\"exam-table\"><thead><tr><th></th><th>BC=00</th><th>BC=01</th><th>BC=11</th><th>BC=10</th></tr></thead><tbody><tr><td>A=0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr><tr><td>A=1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr></tbody></table>|||Cho bìa Karnaugh sau, biểu thức tối ưu ở dạng tổng các tích (sum of products) là gì? (X' nghĩa là NOT X)<table class=\"exam-table\"><thead><tr><th></th><th>BC=00</th><th>BC=01</th><th>BC=11</th><th>BC=10</th></tr></thead><tbody><tr><td>A=0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr><tr><td>A=1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr></tbody></table>",
          "options": [
            {
              "text": "B + AC'|||B + AC'"
            },
            {
              "text": "B + AB'C'|||B + AB'C'"
            },
            {
              "text": "B + AC|||B + AC"
            },
            {
              "text": "AB + B'C|||AB + B'C"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The four cells with B=1 (columns 11 and 10) group into <b>B</b>. The remaining 1 at A=1, BC=00 pairs with A=1, BC=10 to give <b>AC'</b>. So F = <b>B + AC'</b>.</div><div class=\"ml-vi\">Bốn ô có B=1 (cột 11 và 10) gộp thành <b>B</b>. Ô 1 còn lại ở A=1, BC=00 ghép với A=1, BC=10 cho <b>AC'</b>. Vậy F = <b>B + AC'</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "With respect to elements of a machine instruction, what does the instruction code mean?|||Về các thành phần của một lệnh máy, mã lệnh (instruction code / opcode) nghĩa là gì?",
          "options": [
            {
              "text": "It specifies the operation to be performed.|||Nó xác định phép toán cần thực hiện."
            },
            {
              "text": "It specifies data which will be processed.|||Nó xác định dữ liệu sẽ được xử lý."
            },
            {
              "text": "It specifies memory access.|||Nó xác định truy cập bộ nhớ."
            },
            {
              "text": "It specifies an IO device.|||Nó xác định một thiết bị I/O."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>opcode</b> (instruction code) specifies the <b>operation to be performed</b>.</div><div class=\"ml-vi\"><b>Mã lệnh</b> (opcode) xác định <b>phép toán cần thực hiện</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The hardware mechanism that allows a device to notify the CPU is called ____.|||Cơ chế phần cứng cho phép một thiết bị thông báo cho CPU được gọi là ____.",
          "options": [
            {
              "text": "polling|||thăm dò (polling)"
            },
            {
              "text": "interrupt|||ngắt (interrupt)"
            },
            {
              "text": "driver|||trình điều khiển (driver)"
            },
            {
              "text": "controlling|||điều khiển (controlling)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>interrupt</b> is the hardware mechanism a device uses to notify the CPU.</div><div class=\"ml-vi\"><b>Ngắt</b> là cơ chế phần cứng thiết bị dùng để thông báo cho CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of Left Shift Operator << on (00011000<<2)?|||Kết quả của phép dịch trái (Left Shift) << trên (00011000<<2) là gì?",
          "options": [
            {
              "text": "01100000|||01100000"
            },
            {
              "text": "11000000|||11000000"
            },
            {
              "text": "00000110|||00000110"
            },
            {
              "text": "00000011|||00000011"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Left shift by 2 moves bits left, filling zeros: 00011000 → <b>01100000</b>.</div><div class=\"ml-vi\">Dịch trái 2 bit đẩy các bit sang trái, chèn 0: 00011000 → <b>01100000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The effective address of Register indirect addressing mode is ____.|||Địa chỉ hiệu dụng của chế độ địa chỉ gián tiếp qua thanh ghi là ____.",
          "options": [
            {
              "text": "EA = R|||EA = R"
            },
            {
              "text": "EA = (R)|||EA = (R)"
            },
            {
              "text": "EA = (R)+A|||EA = (R)+A"
            },
            {
              "text": "EA = (R)+(A)|||EA = (R)+(A)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Register-indirect: the register holds the operand's address, so <b>EA = (R)</b>.</div><div class=\"ml-vi\">Gián tiếp qua thanh ghi: thanh ghi chứa địa chỉ toán hạng, nên <b>EA = (R)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following PDP series computers is known for its use of 12-bit instructions and a single general-purpose register, the accumulator?|||Dòng máy PDP nào nổi tiếng vì dùng lệnh 12 bit và một thanh ghi đa dụng duy nhất là accumulator?",
          "options": [
            {
              "text": "PDP-8|||PDP-8"
            },
            {
              "text": "PDP-10|||PDP-10"
            },
            {
              "text": "PDP-11|||PDP-11"
            },
            {
              "text": "PDP-6|||PDP-6"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>PDP-8</b> used 12-bit instructions and a single accumulator register.</div><div class=\"ml-vi\"><b>PDP-8</b> dùng lệnh 12 bit và một thanh ghi accumulator duy nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In MASM32, which command is incorrect?|||Trong MASM32, lệnh nào KHÔNG hợp lệ?",
          "options": [
            {
              "text": "ADD EAX, a|||ADD EAX, a"
            },
            {
              "text": "ADD EAX, EBX|||ADD EAX, EBX"
            },
            {
              "text": "ADD a, EAX|||ADD a, EAX"
            },
            {
              "text": "ADD a, b|||ADD a, b"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">x86 cannot add memory to memory: <b>ADD a, b</b> (both operands are memory variables) is invalid.</div><div class=\"ml-vi\">x86 không cộng bộ nhớ với bộ nhớ: <b>ADD a, b</b> (cả hai toán hạng đều là biến nhớ) là không hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Steps for executing a machine instruction are concerned, choose the most suitable statement for the role of the interpret instruction step.|||Xét các bước thực thi một lệnh máy, chọn phát biểu phù hợp nhất cho vai trò của bước thông dịch lệnh (interpret instruction).",
          "options": [
            {
              "text": "The instruction is decoded to determine what action is required.|||Lệnh được giải mã để xác định hành động cần thực hiện."
            },
            {
              "text": "The processor reads an instruction from memory (cache, main memory).|||Bộ xử lý đọc một lệnh từ bộ nhớ (cache, bộ nhớ chính)."
            },
            {
              "text": "The execution of an instruction may require performing some arithmetic or logical operation on data.|||Việc thực thi lệnh có thể cần thực hiện phép số học hoặc logic trên dữ liệu."
            },
            {
              "text": "The results of an execution may require writing data to memory or an I/O module.|||Kết quả thực thi có thể cần ghi dữ liệu ra bộ nhớ hoặc mô-đun I/O."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>interpret (decode)</b> step decodes the instruction to determine what action is required.</div><div class=\"ml-vi\">Bước <b>thông dịch (giải mã)</b> giải mã lệnh để xác định hành động cần thực hiện.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many general-purpose registers are there in the Microprocessor Register Organizations of Intel 80386-Pentium 4?|||Có bao nhiêu thanh ghi đa dụng trong tổ chức thanh ghi của vi xử lý Intel 80386-Pentium 4?",
          "options": [
            {
              "text": "8|||8"
            },
            {
              "text": "16|||16"
            },
            {
              "text": "4|||4"
            },
            {
              "text": "12|||12"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The Intel 80386–Pentium 4 register organization provides <b>8</b> general-purpose registers (EAX, EBX, ECX, EDX, ESI, EDI, EBP, ESP).</div><div class=\"ml-vi\">Tổ chức thanh ghi Intel 80386–Pentium 4 có <b>8</b> thanh ghi đa dụng (EAX, EBX, ECX, EDX, ESI, EDI, EBP, ESP).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a drawback of Instruction Pipelining?|||Nhược điểm của pipeline lệnh (instruction pipelining) là gì?",
          "options": [
            {
              "text": "It increases the instruction throughput|||Nó tăng thông lượng lệnh"
            },
            {
              "text": "It allows more CPU throughput than a multicycle computer at a given ck rate|||Nó cho thông lượng CPU cao hơn máy đa chu kỳ ở cùng tốc độ xung"
            },
            {
              "text": "It may increase latency due to the added overhead of the pipelining process itself|||Nó có thể tăng độ trễ do chi phí phát sinh của chính quá trình pipeline"
            },
            {
              "text": "It decreases the complexity of the computer system|||Nó giảm độ phức tạp của hệ thống máy tính"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">A drawback of pipelining is that per-instruction <b>latency can increase</b> due to the overhead of the pipeline itself (A and B are benefits, D is false).</div><div class=\"ml-vi\">Nhược điểm của pipeline là <b>độ trễ của từng lệnh có thể tăng</b> do chi phí của chính pipeline (A, B là ưu điểm; D sai).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose an INCORRECT statement about high-level programming languages (HLLs).|||Chọn phát biểu SAI về ngôn ngữ lập trình bậc cao (HLL).",
          "options": [
            {
              "text": "HLLs support directives for accessing the CPU's registers.|||HLL hỗ trợ các chỉ thị để truy cập trực tiếp thanh ghi của CPU."
            },
            {
              "text": "HLLs allow the programmer to express algorithms more concisely.|||HLL cho phép lập trình viên biểu diễn thuật toán cô đọng hơn."
            },
            {
              "text": "HLLs allow the compiler to take care of details that are not important in the programmer's expression of algorithms.|||HLL cho phép trình biên dịch lo các chi tiết không quan trọng trong việc diễn đạt thuật toán."
            },
            {
              "text": "HLLs often support the use of structured programming and/or object-oriented design.|||HLL thường hỗ trợ lập trình cấu trúc và/hoặc thiết kế hướng đối tượng."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Directly accessing CPU registers is a feature of <b>assembly</b>, not high-level languages — so statement A is false.</div><div class=\"ml-vi\">Truy cập trực tiếp thanh ghi CPU là đặc điểm của <b>hợp ngữ</b>, không phải ngôn ngữ bậc cao — nên phát biểu A sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is one of the advantages of using a register file in computer architecture?|||Một trong những lợi ích của việc dùng tệp thanh ghi (register file) trong kiến trúc máy tính là gì?",
          "options": [
            {
              "text": "Reduction in memory accesses, saving time|||Giảm số lần truy cập bộ nhớ, tiết kiệm thời gian"
            },
            {
              "text": "More efficient use of space due to dynamic adaptation|||Dùng không gian hiệu quả hơn nhờ thích ứng động"
            },
            {
              "text": "Efficient handling of both local and global variables|||Xử lý hiệu quả cả biến cục bộ và toàn cục"
            },
            {
              "text": "Easier management of cache residency|||Quản lý cache dễ hơn"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A register file keeps operands on-chip, <b>reducing slow memory accesses</b> and saving time.</div><div class=\"ml-vi\">Tệp thanh ghi giữ toán hạng ngay trên chip, <b>giảm truy cập bộ nhớ chậm</b> và tiết kiệm thời gian.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main benefit of using RISC over CISC?|||Lợi ích chính của việc dùng RISC so với CISC là gì?",
          "options": [
            {
              "text": "RISC has more instructions and addressing modes than CISC|||RISC có nhiều lệnh và chế độ địa chỉ hơn CISC"
            },
            {
              "text": "RISC has faster instruction execution and simpler instruction decoding than CISC|||RISC thực thi lệnh nhanh hơn và giải mã lệnh đơn giản hơn CISC"
            },
            {
              "text": "RISC has variable-length instruction formats and direct memory access than CISC|||RISC có định dạng lệnh độ dài thay đổi và truy cập bộ nhớ trực tiếp hơn CISC"
            },
            {
              "text": "RISC has more registers and pipelines than CISC|||RISC có nhiều thanh ghi và pipeline hơn CISC"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">RISC's simple, fixed-length instructions give <b>faster execution and simpler decoding</b>.</div><div class=\"ml-vi\">Lệnh đơn giản, độ dài cố định của RISC cho <b>thực thi nhanh hơn và giải mã đơn giản hơn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In SuperScalar computer architecture, the primary goal of utilizing multiple processors concurrently is to ____.|||Trong kiến trúc siêu vô hướng (superscalar), mục tiêu chính của việc dùng nhiều đơn vị xử lý đồng thời là gì?",
          "options": [
            {
              "text": "Increase processing speed by increasing CPU frequency.|||Tăng tốc độ xử lý bằng cách tăng tần số CPU."
            },
            {
              "text": "Improve performance by executing more than one instruction per machine cycle.|||Cải thiện hiệu năng bằng cách thực thi hơn một lệnh mỗi chu kỳ máy."
            },
            {
              "text": "Reduce the size of the CPU to conserve energy.|||Giảm kích thước CPU để tiết kiệm điện."
            },
            {
              "text": "Enhance computational power by increasing the number of CPU cores.|||Tăng sức tính toán bằng cách tăng số nhân CPU."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A superscalar processor's goal is to <b>execute more than one instruction per clock cycle</b> via multiple execution units.</div><div class=\"ml-vi\">Mục tiêu của bộ xử lý siêu vô hướng là <b>thực thi hơn một lệnh mỗi chu kỳ xung</b> nhờ nhiều đơn vị thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To enhance performance in a superscalar processor, which method(s) should we apply?|||Để tăng hiệu năng trong bộ xử lý siêu vô hướng, nên áp dụng phương pháp nào?",
          "options": [
            {
              "text": "Duplication of resources.|||Nhân đôi tài nguyên."
            },
            {
              "text": "Out-of-order issue.|||Phát lệnh không theo thứ tự (Out-of-order issue)."
            },
            {
              "text": "Renaming registers|||Đổi tên thanh ghi (Renaming registers)"
            },
            {
              "text": "All of the mentioned.|||Tất cả các đáp án."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">All three — <b>resource duplication, out-of-order issue, and register renaming</b> — boost superscalar performance.</div><div class=\"ml-vi\">Cả ba — <b>nhân đôi tài nguyên, phát lệnh không thứ tự và đổi tên thanh ghi</b> — đều tăng hiệu năng siêu vô hướng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "With respect to multi-threading technique, choose an INCORRECT statement.|||Về kỹ thuật đa luồng (multi-threading), chọn phát biểu SAI.",
          "options": [
            {
              "text": "A thread is a dispatchable unit of work within a process.|||Một luồng (thread) là đơn vị công việc có thể điều phối trong một tiến trình."
            },
            {
              "text": "Each thread needs an individual program counter and stack pointer.|||Mỗi luồng cần một bộ đếm chương trình và con trỏ ngăn xếp riêng."
            },
            {
              "text": "Each thread has its own data area for a stack (to enable subroutine branching).|||Mỗi luồng có vùng dữ liệu riêng cho ngăn xếp (để cho phép rẽ nhánh chương trình con)."
            },
            {
              "text": "A thread executes sequentially and interrupts cannot be allowed.|||Một luồng thực thi tuần tự và không được phép ngắt."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Threads can absolutely be interrupted; statement D is false — a thread does not run uninterruptibly.</div><div class=\"ml-vi\">Luồng hoàn toàn có thể bị ngắt; phát biểu D sai — luồng không chạy bất khả ngắt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is one advantage of Nonuniform Memory Access (NUMA) over Uniform Memory Access (UMA)?|||Ưu điểm của Truy cập bộ nhớ không đồng nhất (NUMA) so với Truy cập bộ nhớ đồng nhất (UMA) là gì?",
          "options": [
            {
              "text": "NUMA provides each processor with its own local memory, reducing memory access times|||NUMA cấp cho mỗi bộ xử lý bộ nhớ cục bộ riêng, giảm thời gian truy cập bộ nhớ"
            },
            {
              "text": "NUMA allows all processors to access the same memory location simultaneously|||NUMA cho phép mọi bộ xử lý truy cập cùng một ô nhớ đồng thời"
            },
            {
              "text": "NUMA is easier to implement than UMA|||NUMA dễ hiện thực hơn UMA"
            },
            {
              "text": "NUMA provides limited memory capacity|||NUMA cho dung lượng bộ nhớ hạn chế"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>NUMA gives each processor local memory</b>, so local accesses are much faster than in UMA.</div><div class=\"ml-vi\"><b>NUMA cho mỗi bộ xử lý bộ nhớ cục bộ</b>, nên truy cập cục bộ nhanh hơn nhiều so với UMA.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In modern processors, why is cache memory typically organized into multiple levels, such as L1, L2, and L3 caches?|||Trong bộ xử lý hiện đại, vì sao cache thường được tổ chức thành nhiều mức như L1, L2, L3?",
          "options": [
            {
              "text": "To balance the trade-off between speed and size by having different cache levels|||Để cân bằng đánh đổi giữa tốc độ và dung lượng bằng cách có nhiều mức cache khác nhau"
            },
            {
              "text": "To conserve chip area by reducing the cache size and increasing the memory size|||Để tiết kiệm diện tích chip bằng cách giảm kích thước cache và tăng bộ nhớ"
            },
            {
              "text": "To provide redundancy in case of cache failures|||Để dự phòng khi cache hỏng"
            },
            {
              "text": "To improve cache coherence in multi-processor systems|||Để cải thiện tính nhất quán cache trong hệ đa xử lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Multi-level caches <b>balance speed against size</b>: a small fast L1 plus larger, slower L2/L3.</div><div class=\"ml-vi\">Cache nhiều mức <b>cân bằng tốc độ với dung lượng</b>: L1 nhỏ-nhanh cùng L2/L3 lớn-chậm hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Follow the Amdahl's law for multiprocessors, if only 10% of the code is inherently serial (f = 0.9), running the program on a multicore system with 4 processors, a performance gain (speedup factor) would be ____.|||Theo định luật Amdahl cho đa xử lý, nếu chỉ 10% mã là tuần tự cố hữu (f = 0.9), chạy trên hệ đa nhân 4 bộ xử lý thì độ lợi hiệu năng (hệ số tăng tốc) là ____.",
          "options": [
            {
              "text": "307%|||307%"
            },
            {
              "text": "297%|||297%"
            },
            {
              "text": "317%|||317%"
            },
            {
              "text": "327%|||327%"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Speedup = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08× ≈ <b>307%</b>.</div><div class=\"ml-vi\">Tăng tốc = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08 lần ≈ <b>307%</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose the register that controls sequential execution.|||Chọn thanh ghi điều khiển việc thực thi tuần tự.",
          "options": [
            {
              "text": "Program counter (PC)|||Bộ đếm chương trình (PC)"
            },
            {
              "text": "Instruction register (IR)|||Thanh ghi lệnh (IR)"
            },
            {
              "text": "Memory address register (MAR)|||Thanh ghi địa chỉ bộ nhớ (MAR)"
            },
            {
              "text": "Memory buffer register (MBR)|||Thanh ghi đệm bộ nhớ (MBR)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>program counter (PC)</b> holds the address of the next instruction and thus controls sequential execution.</div><div class=\"ml-vi\"><b>Bộ đếm chương trình (PC)</b> giữ địa chỉ lệnh kế tiếp nên điều khiển việc thực thi tuần tự.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume an instruction set that uses a fixed 16-bit instruction length. Operand specifiers are 6 bits in length. What is the maximum number of one-operand instructions that can be supported?|||Giả sử một tập lệnh dùng độ dài lệnh cố định 16 bit. Trường toán hạng dài 6 bit. Số lệnh một-toán-hạng tối đa có thể hỗ trợ là bao nhiêu?",
          "options": [
            {
              "text": "256|||256"
            },
            {
              "text": "512|||512"
            },
            {
              "text": "1024|||1024"
            },
            {
              "text": "2048|||2048"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">16-bit instruction − 6-bit operand = 10 bits for the opcode → 2¹⁰ = <b>1024</b> one-operand instructions.</div><div class=\"ml-vi\">Lệnh 16 bit − 6 bit toán hạng = 10 bit cho mã lệnh → 2¹⁰ = <b>1024</b> lệnh một-toán-hạng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In an arithmetic left shift operation, what is appended to the rightmost bits?|||Trong phép dịch trái số học (arithmetic left shift), bit nào được chèn vào phía phải?",
          "options": [
            {
              "text": "Zeros|||Các bit 0 (Zeros)"
            },
            {
              "text": "Ones|||Các bit 1 (Ones)"
            },
            {
              "text": "The original leftmost bit|||Bit trái nhất ban đầu"
            },
            {
              "text": "Random bits|||Các bit ngẫu nhiên"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An arithmetic (or logical) left shift appends <b>zeros</b> at the least-significant (rightmost) end.</div><div class=\"ml-vi\">Dịch trái số học (hoặc logic) chèn <b>bit 0</b> ở phía bit thấp nhất (bên phải).</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D5",
      "source": "REAL",
      "sortOrder": 4,
      "title": "Đề 5 — Final Exam (FA25)|||Đề 5 — Thi cuối kỳ (FA25)",
      "description": "Real FE multiple-choice paper (CEA201, Fall 2025 Final Exam), 49 questions transcribed from the exam images; answers reasoned here.|||Đề trắc nghiệm FE thật (CEA201, kỳ Thu 2025 - Thi cuối kỳ), 49 câu chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following attributes do not belong to computer architecture? (Choose 2 answers)|||Thuộc tính nào sau đây KHÔNG thuộc kiến trúc máy tính (computer architecture)? (Chọn 2 đáp án)",
          "options": [
            {
              "text": "Number of bits used to represent data types|||Số bit dùng để biểu diễn kiểu dữ liệu"
            },
            {
              "text": "The instruction set|||Tập lệnh"
            },
            {
              "text": "Interface between the computer and peripherals|||Giao diện giữa máy tính và ngoại vi"
            },
            {
              "text": "Techniques for addressing memory|||Kỹ thuật định địa chỉ bộ nhớ"
            },
            {
              "text": "The memory technology used|||Công nghệ bộ nhớ được dùng"
            },
            {
              "text": "I/O mechanisms|||Cơ chế I/O"
            }
          ],
          "correctIndexes": [
            2,
            4
          ],
          "explanation": "<div class=\"ml-en\">Architecture = what a programmer sees (instruction set, data-type widths, addressing, I/O mechanisms). The <b>peripheral interface</b> and the <b>memory technology</b> are organization (implementation) attributes.</div><div class=\"ml-vi\">Kiến trúc = cái lập trình viên thấy (tập lệnh, độ rộng kiểu dữ liệu, định địa chỉ, cơ chế I/O). <b>Giao diện ngoại vi</b> và <b>công nghệ bộ nhớ</b> là thuộc tính tổ chức (cách hiện thực).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is part of the Von Neumann principle?|||Phát biểu nào sau đây thuộc nguyên lý Von Neumann?",
          "options": [
            {
              "text": "The computer uses a program counter to indicate the location of the next statement|||Máy tính dùng bộ đếm chương trình để chỉ vị trí lệnh kế tiếp"
            },
            {
              "text": "Computer can control all operations with a single program|||Máy tính có thể điều khiển mọi thao tác bằng một chương trình duy nhất"
            },
            {
              "text": "Computer memory is not addressable|||Bộ nhớ máy tính không thể định địa chỉ"
            },
            {
              "text": "Each instruction must have a memory area containing the address of the next instruction|||Mỗi lệnh phải có vùng nhớ chứa địa chỉ của lệnh kế tiếp"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Von Neumann uses a <b>program counter</b> to point to the next instruction (stored-program, sequential). Memory IS addressable (C wrong); an instruction does not store the next address (D wrong).</div><div class=\"ml-vi\">Von Neumann dùng <b>bộ đếm chương trình</b> để trỏ tới lệnh kế tiếp (chương trình lưu trữ, tuần tự). Bộ nhớ CÓ định địa chỉ (C sai); lệnh không chứa địa chỉ lệnh kế (D sai).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are the four basic functions that a computer performs?|||Đâu là bốn chức năng cơ bản mà một máy tính thực hiện?",
          "options": [
            {
              "text": "Data processing, Data storage, Data movement, Control|||Xử lý dữ liệu, Lưu trữ dữ liệu, Di chuyển dữ liệu, Điều khiển"
            },
            {
              "text": "Data processing, Data storage, Data movement, Interrupt|||Xử lý dữ liệu, Lưu trữ dữ liệu, Di chuyển dữ liệu, Ngắt"
            },
            {
              "text": "Data processing, Data storage, Interrupt, Control|||Xử lý dữ liệu, Lưu trữ dữ liệu, Ngắt, Điều khiển"
            },
            {
              "text": "Data processing, Interrupt, Data movement, Control|||Xử lý dữ liệu, Ngắt, Di chuyển dữ liệu, Điều khiển"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The four basic computer functions are <b>data processing, data storage, data movement, and control</b>.</div><div class=\"ml-vi\">Bốn chức năng cơ bản là <b>xử lý dữ liệu, lưu trữ dữ liệu, di chuyển dữ liệu và điều khiển</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What electronic component is used to govern operations such as fetching, decoding, and performing arithmetic operations executed by a processor?|||Linh kiện điện tử nào được dùng để điều phối các thao tác như lấy lệnh, giải mã và thực hiện phép số học của bộ xử lý?",
          "options": [
            {
              "text": "Using a system clock|||Dùng xung nhịp hệ thống (system clock)"
            },
            {
              "text": "Using a quartz crystal|||Dùng thạch anh (quartz crystal)"
            },
            {
              "text": "Using a analog to digital converter|||Dùng bộ chuyển đổi analog sang số"
            },
            {
              "text": "Using a counter|||Dùng bộ đếm (counter)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>system clock</b> generates the timing pulses that synchronize fetch, decode, and execute operations.</div><div class=\"ml-vi\"><b>Xung nhịp hệ thống</b> tạo các nhịp định thời đồng bộ hóa các thao tác lấy lệnh, giải mã và thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the computer, what categories do external devices include? (choose 3 correct answers)|||Trong máy tính, thiết bị ngoài (external devices) gồm những loại nào? (chọn 3 đáp án đúng)",
          "options": [
            {
              "text": "Human readable|||Đọc được bởi người (Human readable)"
            },
            {
              "text": "Communication|||Giao tiếp (Communication)"
            },
            {
              "text": "Data Conversion|||Chuyển đổi dữ liệu (Data Conversion)"
            },
            {
              "text": "Machine readable|||Đọc được bởi máy (Machine readable)"
            }
          ],
          "correctIndexes": [
            0,
            1,
            3
          ],
          "explanation": "<div class=\"ml-en\">External devices are grouped as <b>human-readable, machine-readable, and communication</b>. 'Data conversion' is not a category.</div><div class=\"ml-vi\">Thiết bị ngoài chia thành <b>đọc-được-bởi-người, đọc-được-bởi-máy và giao tiếp</b>. 'Chuyển đổi dữ liệu' không phải một loại.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The instruction, which adds 1 to the value in a memory location, has five stages: fetch opcode (four cycles), fetch operand address (three cycles), fetch operand (three cycles), add 1 to operand (three cycles), and store operand (three cycles). An interrupt sends request at beginning of fetch operand stage. How many cycles does the processor enter the interrupt processing cycle?|||Một lệnh cộng 1 vào giá trị ở một ô nhớ có năm giai đoạn: lấy mã lệnh (4 chu kỳ), lấy địa chỉ toán hạng (3 chu kỳ), lấy toán hạng (3 chu kỳ), cộng 1 vào toán hạng (3 chu kỳ) và lưu toán hạng (3 chu kỳ). Một ngắt gửi yêu cầu vào đầu giai đoạn lấy toán hạng. Sau bao nhiêu chu kỳ thì bộ xử lý bước vào chu kỳ xử lý ngắt?",
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
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The interrupt is serviced only after the current instruction finishes. From the start of 'fetch operand': 3 + 3 + 3 = <b>9</b> cycles remain until completion.</div><div class=\"ml-vi\">Ngắt chỉ được xử lý sau khi lệnh hiện tại hoàn tất. Tính từ đầu giai đoạn 'lấy toán hạng': 3 + 3 + 3 = <b>9</b> chu kỳ còn lại tới khi xong.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which representation is most efficient to perform arithmetic operations on the signed integer numbers?|||Cách biểu diễn nào hiệu quả nhất để thực hiện các phép số học trên số nguyên có dấu?",
          "options": [
            {
              "text": "Sign-magnitude|||Dấu-độ lớn (Sign-magnitude)"
            },
            {
              "text": "2's complement|||Bù hai (2's complement)"
            },
            {
              "text": "1's & 2's compliment|||Bù một & bù hai"
            },
            {
              "text": "1's complement|||Bù một (1's complement)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>2's complement</b> lets addition and subtraction use the same hardware with a single representation of zero — most efficient for signed arithmetic.</div><div class=\"ml-vi\"><b>Bù hai</b> cho phép cộng và trừ dùng chung phần cứng với một biểu diễn duy nhất của số 0 — hiệu quả nhất cho số học có dấu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ interprets the instructions in memory and causes them to be executed.|||____ thông dịch các lệnh trong bộ nhớ và khiến chúng được thực thi.",
          "options": [
            {
              "text": "Registers|||Thanh ghi (Registers)"
            },
            {
              "text": "CPU interconnection|||Liên kết CPU (CPU interconnection)"
            },
            {
              "text": "Arithmetic and Logic Unit (ALU)|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "I/O Modules|||Mô-đun I/O"
            },
            {
              "text": "Control Unit (CU)|||Đơn vị điều khiển (CU)"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The <b>Control Unit (CU)</b> interprets instructions and causes them to be executed.</div><div class=\"ml-vi\"><b>Đơn vị điều khiển (CU)</b> thông dịch lệnh và khiến chúng được thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the function of the bus system in the computer?|||Chức năng của hệ thống bus trong máy tính là gì?",
          "options": [
            {
              "text": "Extend the communication function of the computer|||Mở rộng chức năng giao tiếp của máy tính"
            },
            {
              "text": "Connect components in the computer|||Kết nối các thành phần trong máy tính"
            },
            {
              "text": "Control peripherals|||Điều khiển ngoại vi"
            },
            {
              "text": "Transform signals in the computer|||Biến đổi tín hiệu trong máy tính"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">The bus system <b>connects the components</b> (CPU, memory, I/O) so they can exchange data, addresses, and control signals.</div><div class=\"ml-vi\">Hệ thống bus <b>kết nối các thành phần</b> (CPU, bộ nhớ, I/O) để trao đổi dữ liệu, địa chỉ và tín hiệu điều khiển.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What methods can be used to access units of data in memory?|||Những phương pháp nào có thể dùng để truy cập đơn vị dữ liệu trong bộ nhớ?",
          "options": [
            {
              "text": "Indirect access, Direct access, Random access, Associative|||Truy cập gián tiếp, trực tiếp, ngẫu nhiên, liên kết"
            },
            {
              "text": "Sequential access, Indirect access, Random access, Associative|||Truy cập tuần tự, gián tiếp, ngẫu nhiên, liên kết"
            },
            {
              "text": "Sequential access, Direct access, Random access, Associative|||Truy cập tuần tự, trực tiếp, ngẫu nhiên, liên kết"
            },
            {
              "text": "Sequential access, Direct access, Random access, Indirect access|||Truy cập tuần tự, trực tiếp, ngẫu nhiên, gián tiếp"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The four memory access methods are <b>sequential, direct, random, and associative</b>.</div><div class=\"ml-vi\">Bốn phương pháp truy cập bộ nhớ là <b>tuần tự, trực tiếp, ngẫu nhiên và liên kết</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ is made with cells that store data as charge on capacitors.|||____ được làm từ các ô nhớ lưu dữ liệu dưới dạng điện tích trên tụ điện.",
          "options": [
            {
              "text": "SRAM|||SRAM"
            },
            {
              "text": "DRAM|||DRAM"
            },
            {
              "text": "RDRAM|||RDRAM"
            },
            {
              "text": "CDRAM|||CDRAM"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>DRAM</b> stores each bit as charge on a capacitor (needs periodic refresh). SRAM uses flip-flops.</div><div class=\"ml-vi\"><b>DRAM</b> lưu mỗi bit bằng điện tích trên tụ điện (cần làm tươi định kỳ). SRAM dùng flip-flop.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many techniques are there for dealing with an update to a cache line? What are their names?|||Có bao nhiêu kỹ thuật để xử lý việc cập nhật một dòng cache? Tên chúng là gì?",
          "options": [
            {
              "text": "There are 2 techniques and their names are written through, write back|||Có 2 kỹ thuật: write through, write back"
            },
            {
              "text": "There are 3 techniques and their names are written through, write back, and write allocate|||Có 3 kỹ thuật: write through, write back và write allocate"
            },
            {
              "text": "There is only one technique and its name is \"write not allocate\"|||Chỉ có một kỹ thuật tên là \"write not allocate\""
            },
            {
              "text": "There are 4 techniques and their names are written through, write back, write allocate, write not allocate|||Có 4 kỹ thuật: write through, write back, write allocate, write not allocate"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">There are <b>two</b> cache write-update policies: <b>write-through</b> and <b>write-back</b>. (Write allocate/no-write allocate concern write misses, a different choice.)</div><div class=\"ml-vi\">Có <b>hai</b> chính sách cập nhật ghi cache: <b>write-through</b> và <b>write-back</b>. (Write allocate/no-write allocate là lựa chọn khác, về write miss.)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "A EPROM has 20 address lines and 8 bit data lines, what is maximum memory capacity of this chip?|||Một EPROM có 20 đường địa chỉ và 8 đường dữ liệu, dung lượng bộ nhớ tối đa của chip này là bao nhiêu?",
          "options": [
            {
              "text": "1 Mbits|||1 Mbits"
            },
            {
              "text": "2 Mbits|||2 Mbits"
            },
            {
              "text": "4 Mbits|||4 Mbits"
            },
            {
              "text": "8 Mbits|||8 Mbits"
            },
            {
              "text": "16 Mbits|||16 Mbits"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">2²⁰ addresses × 8 bits = 1M × 8 = <b>8 Mbits</b>.</div><div class=\"ml-vi\">2²⁰ địa chỉ × 8 bit = 1M × 8 = <b>8 Mbits</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using Hamming Code with one error correction to store an 12-bit word in memory, the stored word 111001001101 consists of 8 bits data and 4 bit bits parity check. What are the parity bits?|||Dùng mã Hamming sửa một lỗi để lưu một từ 12 bit trong bộ nhớ, từ đã lưu 111001001101 gồm 8 bit dữ liệu và 4 bit parity. Các bit parity là gì?",
          "options": [
            {
              "text": "0110|||0110"
            },
            {
              "text": "0111|||0111"
            },
            {
              "text": "1110|||1110"
            },
            {
              "text": "0101|||0101"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            4
          ],
          "explanation": "<div class=\"ml-en\">The parity bits sit at positions 1, 2, 4, 8. Extracting them from the stored word does not match options A–D, so the answer is <b>None of the mentioned</b>.</div><div class=\"ml-vi\">Các bit parity ở vị trí 1, 2, 4, 8. Trích chúng từ từ đã lưu không khớp phương án A–D, nên đáp án là <b>Không đáp án nào</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is correct about increasing performance and endurance?|||Điều nào đúng khi sắp xếp theo hiệu năng và độ bền tăng dần?",
          "options": [
            {
              "text": "Hard Disk - DRAM - NAND Flash - SRAM|||Hard Disk - DRAM - NAND Flash - SRAM"
            },
            {
              "text": "Hard Disk - NAND Flash - DRAM - SRAM|||Hard Disk - NAND Flash - DRAM - SRAM"
            },
            {
              "text": "NAND Flash - Hard Disk - SRAM - DRAM|||NAND Flash - Hard Disk - SRAM - DRAM"
            },
            {
              "text": "Hard Disk - DRAM - SRAM - NAND Flash|||Hard Disk - DRAM - SRAM - NAND Flash"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">By increasing speed/performance: <b>Hard Disk &lt; NAND Flash &lt; DRAM &lt; SRAM</b>.</div><div class=\"ml-vi\">Theo hiệu năng/tốc độ tăng dần: <b>Đĩa cứng &lt; NAND Flash &lt; DRAM &lt; SRAM</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which memory has the fastest speed and smallest capacity?|||Bộ nhớ nào có tốc độ nhanh nhất và dung lượng nhỏ nhất?",
          "options": [
            {
              "text": "Cache|||Cache"
            },
            {
              "text": "Main memory|||Bộ nhớ chính"
            },
            {
              "text": "HDD|||HDD"
            },
            {
              "text": "Magnetic Disk|||Đĩa từ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Among these, <b>cache</b> is the fastest and smallest.</div><div class=\"ml-vi\">Trong số này, <b>cache</b> nhanh nhất và nhỏ nhất.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Sort the following memory types in ascending order by access speed:|||Sắp xếp các loại bộ nhớ sau theo tốc độ truy cập TĂNG DẦN:",
          "options": [
            {
              "text": "HDD - Main Memory - L2 cache - L1 cache|||HDD - Bộ nhớ chính - Cache L2 - Cache L1"
            },
            {
              "text": "HDD - Main Memory - L1 cache - L2 cache|||HDD - Bộ nhớ chính - Cache L1 - Cache L2"
            },
            {
              "text": "HDD - L2 cache - L1 cache - Main Memory|||HDD - Cache L2 - Cache L1 - Bộ nhớ chính"
            },
            {
              "text": "Main Memory - L2 cache - L1 cache - HDD|||Bộ nhớ chính - Cache L2 - Cache L1 - HDD"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Increasing speed: <b>HDD &lt; Main Memory &lt; L2 &lt; L1</b>.</div><div class=\"ml-vi\">Tốc độ tăng dần: <b>HDD &lt; Bộ nhớ chính &lt; L2 &lt; L1</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is the correct choice for sorting in increasing speed average of memory?|||Phương án nào đúng khi sắp xếp theo tốc độ trung bình TĂNG DẦN của bộ nhớ?",
          "options": [
            {
              "text": "SSD < Main Memory < Cache Memory < Magnetic Tape|||SSD < Bộ nhớ chính < Cache < Băng từ"
            },
            {
              "text": "Magnetic Tape < SSD < Cache Memory < Main Memory|||Băng từ < SSD < Cache < Bộ nhớ chính"
            },
            {
              "text": "Magnetic Disk < SSD < Main Memory < Cache Memory|||Đĩa từ < SSD < Bộ nhớ chính < Cache"
            },
            {
              "text": "Magnetic Disk < Magnetic Tape < Main Memory < Cache Memory|||Đĩa từ < Băng từ < Bộ nhớ chính < Cache"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Increasing speed: <b>Magnetic Disk &lt; SSD &lt; Main Memory &lt; Cache</b>.</div><div class=\"ml-vi\">Tốc độ tăng dần: <b>Đĩa từ &lt; SSD &lt; Bộ nhớ chính &lt; Cache</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider the expression: NOT(A + B) = ? Apply DeMorgan's Theorem to replace at \"?\"|||Xét biểu thức: NOT(A + B) = ? Áp dụng định lý DeMorgan để thay vào \"?\"",
          "options": [
            {
              "text": "NOT A AND NOT B|||NOT A AND NOT B"
            },
            {
              "text": "NOT A OR NOT B|||NOT A OR NOT B"
            },
            {
              "text": "NOT A AND B|||NOT A AND B"
            },
            {
              "text": "A OR NOT B|||A OR NOT B"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">De Morgan: NOT(A + B) = <b>(NOT A) AND (NOT B)</b>.</div><div class=\"ml-vi\">DeMorgan: NOT(A + B) = <b>(NOT A) AND (NOT B)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which I/O technique does an I/O channel or processor manage transfer of data, thus freeing the CPU?|||Trong kỹ thuật I/O nào, một kênh I/O hoặc bộ xử lý quản lý việc truyền dữ liệu, giải phóng CPU?",
          "options": [
            {
              "text": "Programmed I/O|||Programmed I/O"
            },
            {
              "text": "Interrupt-driven I/O|||Interrupt-driven I/O"
            },
            {
              "text": "Channel I/O|||Channel I/O"
            },
            {
              "text": "Memory-mapped I/O|||Memory-mapped I/O"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">With <b>Channel I/O</b>, a dedicated I/O processor/channel handles the transfer, freeing the CPU.</div><div class=\"ml-vi\">Với <b>Channel I/O</b>, một bộ xử lý/kênh I/O riêng lo việc truyền, giải phóng CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is an interrupt vector?|||Vector ngắt (interrupt vector) là gì?",
          "options": [
            {
              "text": "Part of memory which contains the addresses of interrupt handlers|||Phần bộ nhớ chứa địa chỉ của các thủ tục xử lý ngắt"
            },
            {
              "text": "A signal an I/O device sends to CPU|||Tín hiệu thiết bị I/O gửi tới CPU"
            },
            {
              "text": "A signal an I/O software sends to CPU|||Tín hiệu phần mềm I/O gửi tới CPU"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>interrupt vector</b> is the area of memory holding the addresses of the interrupt handlers.</div><div class=\"ml-vi\"><b>Vector ngắt</b> là vùng nhớ chứa địa chỉ của các thủ tục xử lý ngắt.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main distinction between Interrupt-Driven I/O and Direct Memory Access (DMA)?|||Khác biệt chính giữa I/O điều khiển bằng ngắt (Interrupt-Driven I/O) và Truy cập bộ nhớ trực tiếp (DMA) là gì?",
          "options": [
            {
              "text": "Interrupt-Driven I/O involves the CPU in every data transfer, while DMA bypasses the CPU and transfers data directly between I/O device and memory|||Interrupt-Driven I/O có CPU tham gia mọi lần truyền, còn DMA bỏ qua CPU và truyền trực tiếp giữa thiết bị I/O và bộ nhớ"
            },
            {
              "text": "Interrupt-Driven I/O requires special hardware and software support, while DMA does not need any additional components|||Interrupt-Driven I/O cần phần cứng/phần mềm đặc biệt, còn DMA không cần thành phần bổ sung"
            },
            {
              "text": "Interrupt-Driven I/O is suitable for small and frequent data transfers, while DMA is suitable for large and infrequent data transfers|||Interrupt-Driven I/O phù hợp truyền nhỏ và thường xuyên, còn DMA phù hợp truyền lớn và không thường xuyên"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">All the statements capture real distinctions between interrupt-driven I/O (CPU-involved, small transfers) and DMA (CPU-bypassing, large transfers) — <b>all of the mentioned</b>.</div><div class=\"ml-vi\">Cả các phát biểu đều nêu khác biệt thật giữa I/O ngắt (CPU tham gia, truyền nhỏ) và DMA (bỏ qua CPU, truyền lớn) — <b>tất cả các đáp án</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Choose an operation in which no operating system's utility is called.|||Chọn thao tác mà KHÔNG gọi tiện ích nào của hệ điều hành.",
          "options": [
            {
              "text": "Y=10+7;|||Y=10+7;"
            },
            {
              "text": "Read an integer from the keyboard.|||Đọc một số nguyên từ bàn phím."
            },
            {
              "text": "Print data to monitor.|||In dữ liệu ra màn hình."
            },
            {
              "text": "Read data from a file.|||Đọc dữ liệu từ tệp."
            },
            {
              "text": "None of the others|||Không đáp án nào khác"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A pure computation like <b>Y = 10 + 7</b> runs on the CPU alone. The others (keyboard, monitor, file) require OS I/O services.</div><div class=\"ml-vi\">Một phép tính thuần như <b>Y = 10 + 7</b> chạy hoàn toàn trên CPU. Các thao tác khác (bàn phím, màn hình, tệp) cần dịch vụ I/O của hệ điều hành.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which state indicates that a process is currently being executed by the processor?|||Trạng thái nào cho biết một tiến trình đang được bộ xử lý thực thi?",
          "options": [
            {
              "text": "Running|||Đang chạy (Running)"
            },
            {
              "text": "Ready|||Sẵn sàng (Ready)"
            },
            {
              "text": "NewBorn|||NewBorn"
            },
            {
              "text": "Halted|||Đã dừng (Halted)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A process actively executing on the CPU is in the <b>Running</b> state.</div><div class=\"ml-vi\">Tiến trình đang thực thi trên CPU ở trạng thái <b>Running</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which technique involves dividing physical memory into fixed-size or variable-size blocks to allocate memory to processes?|||Kỹ thuật nào chia bộ nhớ vật lý thành các khối kích thước cố định hoặc thay đổi để cấp phát bộ nhớ cho các tiến trình?",
          "options": [
            {
              "text": "Partitioning|||Phân vùng (Partitioning)"
            },
            {
              "text": "Swapping|||Hoán đổi (Swapping)"
            },
            {
              "text": "Paging|||Phân trang (Paging)"
            },
            {
              "text": "Translation Lookaside Buffer|||Bộ đệm dịch địa chỉ (TLB)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Partitioning</b> divides memory into fixed- or variable-size blocks for processes (paging is fixed-size only).</div><div class=\"ml-vi\"><b>Phân vùng</b> chia bộ nhớ thành khối cố định hoặc thay đổi cho tiến trình (phân trang chỉ cố định).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does Boolean algebra contribute to the design of digital circuits?|||Đại số Boole đóng góp thế nào vào thiết kế mạch số?",
          "options": [
            {
              "text": "It simplifies the implementation of desired functions|||Nó đơn giản hóa việc hiện thực các hàm mong muốn"
            },
            {
              "text": "It helps in the analysis of economic data|||Nó giúp phân tích dữ liệu kinh tế"
            },
            {
              "text": "It facilitates the design of analog circuits|||Nó hỗ trợ thiết kế mạch analog"
            },
            {
              "text": "It is primarily used for chemical engineering and physical engineering|||Nó chủ yếu dùng cho kỹ thuật hóa học và vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Boolean algebra <b>simplifies logic expressions</b>, making digital circuit implementation cheaper and smaller.</div><div class=\"ml-vi\">Đại số Boole <b>đơn giản hóa biểu thức logic</b>, giúp hiện thực mạch số rẻ và nhỏ hơn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which gate can be used to create an inverted output of an input signal in digital logic?|||Cổng nào có thể dùng để tạo đầu ra đảo của một tín hiệu vào trong logic số?",
          "options": [
            {
              "text": "NOT gate|||Cổng NOT"
            },
            {
              "text": "OR gate|||Cổng OR"
            },
            {
              "text": "AND gate|||Cổng AND"
            },
            {
              "text": "XOR gate|||Cổng XOR"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>NOT</b> gate (inverter) produces the inverted output of its input.</div><div class=\"ml-vi\">Cổng <b>NOT</b> (bộ đảo) cho ra đầu ra đảo của tín hiệu vào.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following Karnaugh map, what is the optimal expression in the sum of product format (X' means Not X)?<table class=\"exam-table\"><thead><tr><th></th><th>BC=00</th><th>BC=01</th><th>BC=11</th><th>BC=10</th></tr></thead><tbody><tr><td>A=0</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>A=1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr></tbody></table>|||Cho bìa Karnaugh sau, biểu thức tối ưu ở dạng tổng các tích (sum of products) là gì? (X' nghĩa là NOT X)<table class=\"exam-table\"><thead><tr><th></th><th>BC=00</th><th>BC=01</th><th>BC=11</th><th>BC=10</th></tr></thead><tbody><tr><td>A=0</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>A=1</td><td>1</td><td>0</td><td>0</td><td>1</td></tr></tbody></table>",
          "options": [
            {
              "text": "A' + C'|||A' + C'"
            },
            {
              "text": "A + B|||A + B"
            },
            {
              "text": "B + C'|||B + C'"
            },
            {
              "text": "A + B'C' + BC'|||A + B'C' + BC'"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The whole A=0 row is 1 → term <b>A'</b>. The two 1s at A=1 (BC=00 and BC=10) share C=0 with the A=0 row → term <b>C'</b>. So F = <b>A' + C'</b>.</div><div class=\"ml-vi\">Cả hàng A=0 đều 1 → hạng tử <b>A'</b>. Hai ô 1 ở A=1 (BC=00 và BC=10) cùng C=0 với hàng A=0 → hạng tử <b>C'</b>. Vậy F = <b>A' + C'</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Given the following Karnaugh map, what is the optimal expression in the sum of product format (X' means Not X)?<table class=\"exam-table\"><thead><tr><th></th><th>CD=00</th><th>CD=01</th><th>CD=11</th><th>CD=10</th></tr></thead><tbody><tr><td>AB=00</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>AB=01</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>AB=11</td><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>AB=10</td><td>0</td><td>1</td><td>0</td><td>1</td></tr></tbody></table>|||Cho bìa Karnaugh sau, biểu thức tối ưu ở dạng tổng các tích (sum of products) là gì? (X' nghĩa là NOT X)<table class=\"exam-table\"><thead><tr><th></th><th>CD=00</th><th>CD=01</th><th>CD=11</th><th>CD=10</th></tr></thead><tbody><tr><td>AB=00</td><td>0</td><td>0</td><td>0</td><td>0</td></tr><tr><td>AB=01</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>AB=11</td><td>0</td><td>1</td><td>0</td><td>1</td></tr><tr><td>AB=10</td><td>0</td><td>1</td><td>0</td><td>1</td></tr></tbody></table>",
          "options": [
            {
              "text": "A'B + AC'D + ACD'|||A'B + AC'D + ACD'"
            },
            {
              "text": "AB + AC' + ACD'|||AB + AC' + ACD'"
            },
            {
              "text": "AB' + AD + ACD'|||AB' + AD + ACD'"
            },
            {
              "text": "A'B + C'D + BCD'|||A'B + C'D + BCD'"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The full AB=01 row → <b>A'B</b>. The A=1 cells at CD=01 group to <b>AC'D</b>, and at CD=10 to <b>ACD'</b>. So F = <b>A'B + AC'D + ACD'</b>.</div><div class=\"ml-vi\">Cả hàng AB=01 → <b>A'B</b>. Các ô A=1 ở CD=01 gộp thành <b>AC'D</b>, ở CD=10 thành <b>ACD'</b>. Vậy F = <b>A'B + AC'D + ACD'</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which type of instruction format is more flexible but can lead to inefficient use of memory?|||Loại định dạng lệnh nào linh hoạt hơn nhưng có thể dẫn tới dùng bộ nhớ kém hiệu quả?",
          "options": [
            {
              "text": "Fixed-Length Instruction Format|||Định dạng lệnh độ dài cố định"
            },
            {
              "text": "Variable-Length Instruction Format|||Định dạng lệnh độ dài thay đổi"
            },
            {
              "text": "Compact Instruction Format|||Định dạng lệnh nén"
            },
            {
              "text": "Standardized Instruction Format|||Định dạng lệnh chuẩn hóa"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Variable-length</b> instruction formats are flexible but can waste or fragment memory and complicate decoding.</div><div class=\"ml-vi\">Định dạng lệnh <b>độ dài thay đổi</b> linh hoạt nhưng có thể lãng phí/phân mảnh bộ nhớ và làm giải mã phức tạp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following is not an operand type?|||Điều nào sau đây KHÔNG phải là một kiểu toán hạng?",
          "options": [
            {
              "text": "Addresses|||Địa chỉ (Addresses)"
            },
            {
              "text": "Logical data|||Dữ liệu logic (Logical data)"
            },
            {
              "text": "Value|||Giá trị (Value)"
            },
            {
              "text": "Characters|||Ký tự (Characters)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Operand types are addresses, numbers, characters, logical data. <b>Value</b> is not a distinct operand type.</div><div class=\"ml-vi\">Các kiểu toán hạng: địa chỉ, số, ký tự, dữ liệu logic. <b>Giá trị</b> không phải một kiểu riêng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a branch instruction?|||Lệnh rẽ nhánh (branch instruction) là gì?",
          "options": [
            {
              "text": "The instructions that are used to divide a program into multiple subprograms|||Lệnh dùng để chia chương trình thành nhiều chương trình con"
            },
            {
              "text": "The instructions that have as one of its operands the address of the next instruction to be executed|||Lệnh có một toán hạng là địa chỉ của lệnh kế tiếp cần thực thi"
            },
            {
              "text": "The instructions that are used to pause the program|||Lệnh dùng để tạm dừng chương trình"
            },
            {
              "text": "The instructions that are used to return to the beginning of the program|||Lệnh dùng để quay về đầu chương trình"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>branch</b> carries the address of the next instruction to execute as one of its operands.</div><div class=\"ml-vi\">Lệnh <b>rẽ nhánh</b> mang một toán hạng là địa chỉ của lệnh kế tiếp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Indirect addressing, the length of the address field is usually greater than the word length, because unlimiting the address range.|||Trong địa chỉ gián tiếp (indirect addressing), độ dài trường địa chỉ thường lớn hơn độ dài từ (word) vì để không giới hạn phạm vi địa chỉ.",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>False</b> — indirect addressing lets a <b>small</b> address field reach a full-length address stored in memory; the field is not larger than the word.</div><div class=\"ml-vi\"><b>Sai</b> — địa chỉ gián tiếp cho phép một trường địa chỉ <b>nhỏ</b> vẫn tới được một địa chỉ đầy đủ lưu trong bộ nhớ; trường này không lớn hơn từ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Assume an instruction set that uses a fixed 16-bit instruction length. Operand specifiers are 6 bits in length. What is the maximum number of one-operand instructions that can be supported?|||Giả sử một tập lệnh dùng độ dài lệnh cố định 16 bit. Trường toán hạng dài 6 bit. Số lệnh một-toán-hạng tối đa có thể hỗ trợ là bao nhiêu?",
          "options": [
            {
              "text": "256|||256"
            },
            {
              "text": "512|||512"
            },
            {
              "text": "1024|||1024"
            },
            {
              "text": "2048|||2048"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">16-bit instruction − 6-bit operand = 10 bits for the opcode → 2¹⁰ = <b>1024</b> one-operand instructions.</div><div class=\"ml-vi\">Lệnh 16 bit − 6 bit toán hạng = 10 bit cho mã lệnh → 2¹⁰ = <b>1024</b> lệnh một-toán-hạng.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which instruction is used by MASM32 to return from a procedure?|||Lệnh nào được MASM32 dùng để trở về từ một thủ tục (procedure)?",
          "options": [
            {
              "text": "RET|||RET"
            },
            {
              "text": "EXIT|||EXIT"
            },
            {
              "text": "END|||END"
            },
            {
              "text": "RES|||RES"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>RET</b> returns from a procedure (pops the return address and jumps back).</div><div class=\"ml-vi\"><b>RET</b> trở về từ một thủ tục (lấy địa chỉ trả về khỏi ngăn xếp và nhảy về).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Steps for executing a machine instruction are concerned, choose the correct statement which specifies the role of the fetching instruction step.|||Xét các bước thực thi một lệnh máy, chọn phát biểu đúng cho vai trò của bước lấy lệnh (fetch).",
          "options": [
            {
              "text": "The processor reads an instruction from memory (cache, main memory).|||Bộ xử lý đọc một lệnh từ bộ nhớ (cache, bộ nhớ chính)."
            },
            {
              "text": "The instruction is decoded to determine what action is required.|||Lệnh được giải mã để xác định hành động cần thực hiện."
            },
            {
              "text": "The execution of an instruction may require performing some arithmetic or logical operation on data.|||Việc thực thi lệnh có thể cần thực hiện phép số học hoặc logic trên dữ liệu."
            },
            {
              "text": "The results of an execution may require writing data to memory or an I/O module.|||Kết quả thực thi có thể cần ghi dữ liệu ra bộ nhớ hoặc mô-đun I/O."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>fetch</b> step reads the next instruction from memory into the CPU.</div><div class=\"ml-vi\">Bước <b>lấy lệnh</b> đọc lệnh kế tiếp từ bộ nhớ vào CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Control and status registers are used by which entities to control the operation of the processor?|||Thanh ghi điều khiển và trạng thái (control and status registers) được những đối tượng nào dùng để điều khiển hoạt động của bộ xử lý?",
          "options": [
            {
              "text": "Privileged, operating system programs|||Chương trình đặc quyền, chương trình của hệ điều hành"
            },
            {
              "text": "Machine or assembly language programmers|||Lập trình viên ngôn ngữ máy hoặc hợp ngữ"
            },
            {
              "text": "External I/O devices|||Thiết bị I/O bên ngoài"
            },
            {
              "text": "Main memory modules|||Các mô-đun bộ nhớ chính"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Control/status registers are used by <b>privileged, operating-system programs</b>, not ordinary programmers.</div><div class=\"ml-vi\">Thanh ghi điều khiển/trạng thái do <b>chương trình đặc quyền của hệ điều hành</b> dùng, không phải lập trình viên thường.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the significance of the program counter (PC) in the fetch phase of the instruction cycle?|||Ý nghĩa của bộ đếm chương trình (PC) trong pha lấy lệnh (fetch) của chu kỳ lệnh là gì?",
          "options": [
            {
              "text": "The program counter (PC) is not used in the fetch phase, and its role is limited to tracking the number of instructions executed by the CPU|||PC không được dùng trong pha fetch, vai trò của nó chỉ là đếm số lệnh CPU đã thực thi"
            },
            {
              "text": "The program counter (PC) in the fetch phase holds the memory address of the next instruction to be fetched and executed|||PC trong pha fetch giữ địa chỉ bộ nhớ của lệnh kế tiếp cần lấy và thực thi"
            },
            {
              "text": "The program counter (PC) is responsible for executing instructions and has no specific role during the fetch phase|||PC chịu trách nhiệm thực thi lệnh và không có vai trò cụ thể trong pha fetch"
            },
            {
              "text": "The program counter (PC) is only relevant in multi-core processors and does not contribute to the fetch phase of the instruction cycle in single-core systems|||PC chỉ liên quan tới bộ xử lý đa nhân, không đóng góp vào pha fetch trong hệ đơn nhân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the fetch phase the <b>PC holds the address of the next instruction</b> to fetch and execute.</div><div class=\"ml-vi\">Trong pha fetch, <b>PC giữ địa chỉ của lệnh kế tiếp</b> cần lấy và thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statement is correct in the context of Instruction Pipelining?|||Phát biểu nào sau đây đúng trong ngữ cảnh pipeline lệnh (Instruction Pipelining)?",
          "options": [
            {
              "text": "Instruction Pipelining reduces the efficiency of instruction execution by introducing delays and dependencies between instructions|||Pipeline làm giảm hiệu suất thực thi lệnh do gây trễ và phụ thuộc giữa các lệnh"
            },
            {
              "text": "Instruction Pipelining is only effective for specific types of instructions and has no impact on the overall efficiency of instruction execution|||Pipeline chỉ hiệu quả với một số loại lệnh cụ thể và không ảnh hưởng tới hiệu suất chung"
            },
            {
              "text": "Instruction Pipelining enhances efficiency by enabling simultaneous execution of multiple instructions in different stages, boosting overall throughput|||Pipeline tăng hiệu suất nhờ thực thi đồng thời nhiều lệnh ở các giai đoạn khác nhau, tăng thông lượng chung"
            },
            {
              "text": "Instruction Pipelining improves efficiency by processing multiple instructions simultaneously, reducing execution time. However, it can face challenges like hazards, introducing delays and impacting overall performance|||Pipeline cải thiện hiệu suất bằng cách xử lý đồng thời nhiều lệnh, giảm thời gian thực thi. Tuy nhiên nó có thể gặp thách thức như hazard, gây trễ và ảnh hưởng hiệu năng chung"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The most complete and correct statement: pipelining boosts throughput by overlapping instructions <b>but can suffer hazards</b> that add delays. (D)</div><div class=\"ml-vi\">Phát biểu đầy đủ và đúng nhất: pipeline tăng thông lượng nhờ chồng lấn lệnh <b>nhưng có thể gặp hazard</b> gây trễ. (D)</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In various statement types in a high-level programming language, what is not the most common statement?|||Trong các loại câu lệnh của ngôn ngữ lập trình bậc cao, đâu KHÔNG phải là câu lệnh phổ biến nhất?",
          "options": [
            {
              "text": "GOTO statement.|||Câu lệnh GOTO."
            },
            {
              "text": "IF statement.|||Câu lệnh IF."
            },
            {
              "text": "CLOOP statement.|||Câu lệnh CLOOP."
            },
            {
              "text": "CALL procedure statement.|||Câu lệnh gọi thủ tục (CALL procedure)."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">GOTO, IF, and CALL are common HLL statement types. <b>CLOOP</b> is not a standard statement type.</div><div class=\"ml-vi\">GOTO, IF và CALL là các loại câu lệnh HLL phổ biến. <b>CLOOP</b> không phải một loại câu lệnh chuẩn.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the concept of Register Windows, how many register groups are there?|||Trong khái niệm Cửa sổ thanh ghi (Register Windows), có bao nhiêu nhóm thanh ghi?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "No distinction|||Không phân biệt"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A register window has <b>3</b> groups: parameter, local, and temporary registers.</div><div class=\"ml-vi\">Một cửa sổ thanh ghi có <b>3</b> nhóm: thanh ghi tham số, cục bộ và tạm thời.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does pipelining in a RISC architecture handle branch instruction?|||Pipeline trong kiến trúc RISC xử lý lệnh rẽ nhánh (branch) như thế nào?",
          "options": [
            {
              "text": "By using NOOP instructions inserted by the compiler or assembler|||Bằng cách chèn lệnh NOOP do trình biên dịch hoặc hợp ngữ thêm vào"
            },
            {
              "text": "By eliminating branch instructions from the instruction stream|||Bằng cách loại bỏ lệnh rẽ nhánh khỏi luồng lệnh"
            },
            {
              "text": "By executing branch instructions in a separate pipeline|||Bằng cách thực thi lệnh rẽ nhánh ở một pipeline riêng"
            },
            {
              "text": "By delaying all instructions until branch instructions are executed|||Bằng cách trì hoãn mọi lệnh cho tới khi lệnh rẽ nhánh được thực thi"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">RISC uses the <b>delayed-branch</b> technique: the compiler/assembler fills the branch delay slot with <b>NOOP</b> (or useful) instructions.</div><div class=\"ml-vi\">RISC dùng kỹ thuật <b>rẽ nhánh trì hoãn</b>: trình biên dịch/hợp ngữ điền khe trễ rẽ nhánh bằng lệnh <b>NOOP</b> (hoặc lệnh có ích).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the benefit of using a superscalar organization over a scalar organization?|||Lợi ích của tổ chức siêu vô hướng (superscalar) so với vô hướng (scalar) là gì?",
          "options": [
            {
              "text": "It increases the instruction throughput and improves the performance|||Tăng thông lượng lệnh và cải thiện hiệu năng"
            },
            {
              "text": "It reduces the power consumption and the heat dissipation|||Giảm tiêu thụ điện và tỏa nhiệt"
            },
            {
              "text": "It simplifies the instruction set and the compiler design|||Đơn giản hóa tập lệnh và thiết kế trình biên dịch"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A superscalar processor issues multiple instructions per cycle, <b>increasing throughput and performance</b>.</div><div class=\"ml-vi\">Bộ xử lý siêu vô hướng phát nhiều lệnh mỗi chu kỳ, <b>tăng thông lượng và hiệu năng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____ is (are) determined by the number of instructions that can be fetched and executed at the same time (the number of parallel pipelines) and by the speed and sophistication of the mechanisms that the processor uses to find independent instructions.|||____ được quyết định bởi số lệnh có thể được lấy và thực thi cùng lúc (số pipeline song song) và bởi tốc độ, độ tinh vi của cơ chế mà bộ xử lý dùng để tìm các lệnh độc lập.",
          "options": [
            {
              "text": "Instruction-level parallelism|||Song song mức lệnh (Instruction-level parallelism)"
            },
            {
              "text": "Machine parallelism|||Song song máy (Machine parallelism)"
            },
            {
              "text": "Both instruction-level parallelism and machine parallelism|||Cả hai"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>Machine parallelism</b> is the processor's ability to exploit ILP, set by parallel pipelines and instruction-issue mechanisms.</div><div class=\"ml-vi\"><b>Song song máy</b> là khả năng của bộ xử lý khai thác ILP, quyết định bởi số pipeline song song và cơ chế phát lệnh.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following are examples of architectural attributes in computer systems? (Choose 2 answers)|||Điều nào sau đây là ví dụ về thuộc tính kiến trúc (architectural attributes) trong hệ máy tính? (Chọn 2 đáp án)",
          "options": [
            {
              "text": "Instruction set|||Tập lệnh"
            },
            {
              "text": "Control signals|||Tín hiệu điều khiển"
            },
            {
              "text": "Memory technology|||Công nghệ bộ nhớ"
            },
            {
              "text": "Number of bits used for data types|||Số bit dùng cho kiểu dữ liệu"
            },
            {
              "text": "Interfaces between peripherals and the computer|||Giao diện giữa ngoại vi và máy tính"
            }
          ],
          "correctIndexes": [
            0,
            3
          ],
          "explanation": "<div class=\"ml-en\">Architectural attributes are what the programmer sees: the <b>instruction set</b> and the <b>number of bits for data types</b>. Control signals, memory technology, and interfaces are organization.</div><div class=\"ml-vi\">Thuộc tính kiến trúc là cái lập trình viên thấy: <b>tập lệnh</b> và <b>số bit cho kiểu dữ liệu</b>. Tín hiệu điều khiển, công nghệ bộ nhớ và giao diện là tổ chức.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which write technique in which all write operations are made to main memory as well as to the cache, ensuring that main memory is always valid.|||Kỹ thuật ghi nào mà mọi thao tác ghi đều được thực hiện vào cả bộ nhớ chính lẫn cache, đảm bảo bộ nhớ chính luôn hợp lệ?",
          "options": [
            {
              "text": "Write through|||Write through"
            },
            {
              "text": "Write back|||Write back"
            },
            {
              "text": "Write around|||Write around"
            },
            {
              "text": "No write allocate|||No write allocate"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Write-through</b> writes to cache and main memory simultaneously, keeping memory always valid.</div><div class=\"ml-vi\"><b>Write-through</b> ghi vào cache và bộ nhớ chính cùng lúc, giữ bộ nhớ luôn hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does multithreading improve the performance of a processor?|||Đa luồng (multithreading) cải thiện hiệu năng bộ xử lý thế nào?",
          "options": [
            {
              "text": "It increases the instruction-level parallelism by issuing multiple instructions from different threads in the same cycle|||Tăng song song mức lệnh bằng cách phát nhiều lệnh từ các luồng khác nhau trong cùng chu kỳ"
            },
            {
              "text": "It increases the thread-level parallelism by executing multiple threads on different cores or processors|||Tăng song song mức luồng bằng cách chạy nhiều luồng trên các nhân/bộ xử lý khác nhau"
            },
            {
              "text": "It increases the utilization of the processor resources by hiding the latency of long-latency events such as cache misses or branch mispredictions|||Tăng tận dụng tài nguyên bằng cách che độ trễ của sự kiện độ trễ dài như cache miss hay dự đoán rẽ nhánh sai"
            },
            {
              "text": "All of the mentioned|||Tất cả các đáp án"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Multithreading helps in <b>all these ways</b> — boosting ILP, TLP, and hiding long-latency stalls.</div><div class=\"ml-vi\">Đa luồng giúp theo <b>tất cả các cách này</b> — tăng ILP, TLP và che độ trễ dài.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Follow the Amdahl's law for multiprocessors, if only 10% of the code is inherently serial (f = 0.9), running the program on a multicore system with 4 processors, a performance gain (speedup factor) would be ____.|||Theo định luật Amdahl cho đa xử lý, nếu chỉ 10% mã là tuần tự cố hữu (f = 0.9), chạy trên hệ đa nhân 4 bộ xử lý thì độ lợi hiệu năng (hệ số tăng tốc) là ____.",
          "options": [
            {
              "text": "307%|||307%"
            },
            {
              "text": "297%|||297%"
            },
            {
              "text": "317%|||317%"
            },
            {
              "text": "327%|||327%"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Speedup = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08× ≈ <b>307%</b>.</div><div class=\"ml-vi\">Tăng tốc = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08 lần ≈ <b>307%</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cache is not a shared cache?|||Cache nào KHÔNG phải là cache dùng chung?",
          "options": [
            {
              "text": "L4 cache|||Cache L4"
            },
            {
              "text": "L3 cache|||Cache L3"
            },
            {
              "text": "L2 cache|||Cache L2"
            },
            {
              "text": "L1 cache|||Cache L1"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>L1</b> is private per core (not shared); L2/L3/L4 are typically shared.</div><div class=\"ml-vi\"><b>L1</b> riêng cho từng nhân (không dùng chung); L2/L3/L4 thường dùng chung.</div>"
        }
      ]
    },
    {
      "kind": "FE",
      "code": "FE-D6",
      "source": "REAL",
      "sortOrder": 5,
      "title": "Đề 6 — Final Exam (SU25)|||Đề 6 — Thi cuối kỳ (SU25)",
      "description": "Real FE multiple-choice paper (CEA201, Summer 2025), 50 questions transcribed from the exam images; answers reasoned here.|||Đề trắc nghiệm FE thật (CEA201, kỳ Hè 2025), 50 câu chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two/three correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two/three correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
      "questions": [
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the primary role of the IO module? (choose two correct answers)|||Vai trò chính của mô-đun I/O là gì? (chọn hai đáp án đúng)",
          "options": [
            {
              "text": "Its role is data transfer, it will transfer data to and from peripheral devices.|||Vai trò truyền dữ liệu — chuyển dữ liệu tới/từ thiết bị ngoại vi."
            },
            {
              "text": "Its role is device communication control, it manages and controls the flow of data between the CPU and peripherals|||Vai trò điều khiển giao tiếp thiết bị — quản lý và điều khiển luồng dữ liệu giữa CPU và ngoại vi."
            },
            {
              "text": "Its role is data formatting and converting analog signals into digital audio data for CPU|||Vai trò định dạng dữ liệu và chuyển tín hiệu analog thành dữ liệu âm thanh số cho CPU."
            },
            {
              "text": "Its role is protecting data from user, ensuring that sensitive information is not lost or intercepted.|||Vai trò bảo vệ dữ liệu khỏi người dùng, đảm bảo thông tin nhạy cảm không bị mất hay bị chặn."
            }
          ],
          "correctIndexes": [
            0,
            1
          ],
          "explanation": "<div class=\"ml-en\">An I/O module has two core jobs: <b>data transfer</b> and <b>control &amp; timing</b> between the CPU and peripherals. Audio-only (C) and security (D) are not its general role.</div><div class=\"ml-vi\">Mô-đun I/O có hai nhiệm vụ cốt lõi: <b>truyền dữ liệu</b> và <b>điều khiển &amp; định thời</b> giữa CPU và ngoại vi. Chỉ âm thanh (C) và bảo mật (D) không phải chức năng chung.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following attributes do not belong to computer architecture? (choose two correct answers)|||Thuộc tính nào sau đây KHÔNG thuộc về kiến trúc máy tính (computer architecture)? (chọn hai đáp án đúng)",
          "options": [
            {
              "text": "Number of bits used to represent data types|||Số bit dùng để biểu diễn các kiểu dữ liệu"
            },
            {
              "text": "The instruction set|||Tập lệnh (instruction set)"
            },
            {
              "text": "Interface between the computer and peripherals|||Giao tiếp giữa máy tính và ngoại vi"
            },
            {
              "text": "Techniques for addressing memory|||Kỹ thuật định địa chỉ bộ nhớ"
            },
            {
              "text": "The memory technology used|||Công nghệ bộ nhớ được sử dụng"
            },
            {
              "text": "I/O mechanisms|||Cơ chế I/O"
            }
          ],
          "correctIndexes": [
            2,
            4
          ],
          "explanation": "<div class=\"ml-en\">Architecture = attributes visible to the programmer (instruction set, data types, addressing, I/O mechanisms). The <b>interface to peripherals</b> and the <b>memory technology</b> are organization, not architecture.</div><div class=\"ml-vi\">Kiến trúc = thuộc tính lập trình viên thấy được (tập lệnh, kiểu dữ liệu, định địa chỉ, cơ chế I/O). <b>Giao tiếp với ngoại vi</b> và <b>công nghệ bộ nhớ</b> thuộc về tổ chức (organization), không phải kiến trúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Performs the computer's data processing functions is ____?|||____ thực hiện các chức năng xử lý dữ liệu của máy tính?",
          "options": [
            {
              "text": "Arithmetic and logic unit (ALU)|||Đơn vị số học-logic (ALU)"
            },
            {
              "text": "Control unit|||Đơn vị điều khiển (Control unit)"
            },
            {
              "text": "CPU interconnection|||Liên kết CPU (CPU interconnection)"
            },
            {
              "text": "Registers|||Thanh ghi (Registers)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>ALU</b> performs the computer's data processing (arithmetic and logic) functions.</div><div class=\"ml-vi\"><b>ALU</b> thực hiện các chức năng xử lý dữ liệu (số học và logic) của máy tính.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The stored-program concept means a computer could get its instructions by reading them from memory, and a program could be set or altered by setting the values of a portion of memory.|||Khái niệm chương trình lưu trữ (stored-program) nghĩa là máy tính có thể lấy lệnh bằng cách đọc chúng từ bộ nhớ, và chương trình có thể được đặt hoặc thay đổi bằng cách đặt giá trị của một phần bộ nhớ.",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">This is exactly the <b>stored-program concept</b> (von Neumann): instructions live in memory and can be altered like data → <b>True</b>.</div><div class=\"ml-vi\">Đây chính là <b>khái niệm chương trình lưu trữ</b> (von Neumann): lệnh nằm trong bộ nhớ và có thể thay đổi như dữ liệu → <b>Đúng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What electronic component is used to govern operations such as fetching, decoding, and performing arithmetic operations executed by a processor?|||Thành phần điện tử nào được dùng để điều phối các thao tác như lấy lệnh (fetch), giải mã (decode) và thực hiện phép toán số học do bộ xử lý thực thi?",
          "options": [
            {
              "text": "Using a system clock|||Dùng xung nhịp hệ thống (system clock)"
            },
            {
              "text": "Using a quartz crystal|||Dùng tinh thể thạch anh (quartz crystal)"
            },
            {
              "text": "Using a analog to digital converter|||Dùng bộ chuyển đổi analog sang số"
            },
            {
              "text": "Using a counter|||Dùng một bộ đếm (counter)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>system clock</b> generates the timing signals that govern (synchronize) fetch, decode and arithmetic operations.</div><div class=\"ml-vi\"><b>Xung nhịp hệ thống</b> tạo tín hiệu định thời để điều phối (đồng bộ) việc lấy lệnh, giải mã và phép toán số học.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider an expression: 1000 0000 AND 1111 1010. What is the result of this expression?|||Xét biểu thức: 1000 0000 AND 1111 1010. Kết quả của biểu thức này là gì?",
          "options": [
            {
              "text": "1000 0000|||1000 0000"
            },
            {
              "text": "1111 0000|||1111 0000"
            },
            {
              "text": "1001 1010|||1001 1010"
            },
            {
              "text": "1001 0101|||1001 0101"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Bitwise AND keeps 1 only where BOTH bits are 1 → only the top bit survives → <b>1000 0000</b>.</div><div class=\"ml-vi\">Phép AND bit giữ 1 chỉ khi CẢ hai bit là 1 → chỉ bit cao nhất còn lại → <b>1000 0000</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The instruction, which adds 1 to the value in a memory location, has five stages: fetch opcode (four cycles), fetch operand address (three cycles), fetch operand (three cycles), add 1 to operand (three cycles), and store operand (three cycles). An interrupt sends request at beginning of fetch operand stage. How many cycles does the processor enter the interrupt processing cycle?|||Lệnh cộng 1 vào giá trị trong một vùng nhớ có năm giai đoạn: lấy opcode (4 chu kỳ), lấy địa chỉ toán hạng (3 chu kỳ), lấy toán hạng (3 chu kỳ), cộng 1 vào toán hạng (3 chu kỳ), và lưu toán hạng (3 chu kỳ). Một ngắt gửi yêu cầu ngay đầu giai đoạn lấy toán hạng. Sau bao nhiêu chu kỳ thì bộ xử lý bước vào chu kỳ xử lý ngắt?",
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
            },
            {
              "text": "10|||10"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">The interrupt is only serviced after the current instruction finishes. From the start of the fetch-operand stage: fetch operand (3) + add 1 (3) + store operand (3) = <b>9</b> cycles.</div><div class=\"ml-vi\">Ngắt chỉ được phục vụ sau khi lệnh hiện tại hoàn tất. Tính từ đầu giai đoạn lấy toán hạng: lấy toán hạng (3) + cộng 1 (3) + lưu toán hạng (3) = <b>9</b> chu kỳ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the benefit of cache memory in terms of computer performance?|||Lợi ích của bộ nhớ cache về mặt hiệu năng máy tính là gì?",
          "options": [
            {
              "text": "It reduces the computer's power consumption.|||Giảm mức tiêu thụ điện của máy tính."
            },
            {
              "text": "It speeds up data access and improves system performance.|||Tăng tốc truy cập dữ liệu và cải thiện hiệu năng hệ thống."
            },
            {
              "text": "It increases the storage capacity of the computer.|||Tăng dung lượng lưu trữ của máy tính."
            },
            {
              "text": "It serves as a backup storage for critical files.|||Đóng vai trò lưu trữ dự phòng cho các tệp quan trọng."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Cache holds frequently used data close to the CPU, <b>speeding up access and improving performance</b>.</div><div class=\"ml-vi\">Cache giữ dữ liệu hay dùng gần CPU, <b>tăng tốc truy cập và cải thiện hiệu năng</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following determines the Bus Width?|||Yếu tố nào sau đây quyết định độ rộng bus (Bus Width)?",
          "options": [
            {
              "text": "The clock speed of the CPU|||Tốc độ xung nhịp CPU"
            },
            {
              "text": "The number of cores in the processor|||Số nhân của bộ xử lý"
            },
            {
              "text": "The size of the motherboard|||Kích thước bo mạch chủ"
            },
            {
              "text": "The number of parallel lines in the data bus|||Số đường song song trong bus dữ liệu"
            },
            {
              "text": "Number of components connected to Bus|||Số thành phần nối vào bus"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Bus width = how many bits travel at once = the <b>number of parallel lines</b> in the data bus.</div><div class=\"ml-vi\">Độ rộng bus = số bit truyền cùng lúc = <b>số đường song song</b> trong bus dữ liệu.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which method of accessing units of data is used to copy a block in main memory into cache memory?|||Phương pháp truy cập đơn vị dữ liệu nào được dùng để sao chép một khối từ bộ nhớ chính vào bộ nhớ cache?",
          "options": [
            {
              "text": "Direct access|||Truy cập trực tiếp (Direct access)"
            },
            {
              "text": "Random access|||Truy cập ngẫu nhiên (Random access)"
            },
            {
              "text": "Sequential access|||Truy cập tuần tự (Sequential access)"
            },
            {
              "text": "Associative|||Truy cập liên kết (Associative)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Cache memory uses <b>associative</b> access: a block is located by matching a tag rather than by a fixed address.</div><div class=\"ml-vi\">Bộ nhớ cache dùng truy cập <b>liên kết (associative)</b>: định vị khối bằng cách so khớp tag chứ không theo địa chỉ cố định.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following algorithms is not typically used in cache memory replacement?|||Thuật toán nào sau đây KHÔNG thường được dùng trong thay thế bộ nhớ cache?",
          "options": [
            {
              "text": "Least Recently Used (LRU)|||Least Recently Used (LRU)"
            },
            {
              "text": "First-In-First-Out (FIFO)|||First-In-First-Out (FIFO)"
            },
            {
              "text": "Least Frequently Used (LFU)|||Least Frequently Used (LFU)"
            },
            {
              "text": "Round Robin (RR)|||Round Robin (RR)"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">LRU, FIFO and LFU are common cache replacement policies. <b>Round Robin</b> is a CPU scheduling algorithm, not a cache replacement one.</div><div class=\"ml-vi\">LRU, FIFO và LFU là các chính sách thay thế cache thông dụng. <b>Round Robin</b> là thuật toán định thời CPU, không phải thay thế cache.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Consider a machine with a byte addressable main memory of 2^16 bytes and block size of 8 bytes. Assume that a direct mapped cache consisting of 32 lines is used with this machine. How many bits are there in the line field of the cache?|||Xét một máy có bộ nhớ chính định địa chỉ theo byte kích thước 2^16 byte và khối 8 byte. Giả sử dùng cache ánh xạ trực tiếp gồm 32 dòng. Trường dòng (line field) của cache có bao nhiêu bit?",
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
            },
            {
              "text": "7|||7"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Number of line-field bits = log2(number of lines) = log2(32) = <b>5</b>.</div><div class=\"ml-vi\">Số bit trường dòng = log2(số dòng) = log2(32) = <b>5</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In terms of organization, what is the basic element of semiconductor memory?|||Về mặt tổ chức, phần tử cơ bản của bộ nhớ bán dẫn là gì?",
          "options": [
            {
              "text": "Memory capacity|||Dung lượng nhớ (Memory capacity)"
            },
            {
              "text": "Memory block|||Khối nhớ (Memory block)"
            },
            {
              "text": "Memory cell|||Ô nhớ (Memory cell)"
            },
            {
              "text": "Memory location|||Vị trí nhớ (Memory location)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">The basic building block of semiconductor memory is the <b>memory cell</b>, which stores one bit.</div><div class=\"ml-vi\">Phần tử cơ bản của bộ nhớ bán dẫn là <b>ô nhớ (memory cell)</b>, lưu một bit.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Using Hamming Code with one error correction to store an 12-bit word in memory, the stored word 111001001101 consists of 8 bits data and 4 bit bits parity check. What are the parity bits?|||Dùng mã Hamming với sửa một lỗi để lưu một từ 12 bit trong bộ nhớ, từ đã lưu 111001001101 gồm 8 bit dữ liệu và 4 bit kiểm tra chẵn lẻ (parity). Các bit parity là gì?",
          "options": [
            {
              "text": "0110|||0110"
            },
            {
              "text": "0111|||0111"
            },
            {
              "text": "1110|||1110"
            },
            {
              "text": "0101|||0101"
            },
            {
              "text": "None of the mentioned|||Không đáp án nào"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Parity bits sit at positions 1, 2, 4, 8 (powers of two). Extracting them from the stored word gives <b>0101</b>.</div><div class=\"ml-vi\">Các bit parity nằm ở vị trí 1, 2, 4, 8 (luỹ thừa của 2). Rút chúng từ từ đã lưu cho ra <b>0101</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What are the key differences in the architecture of NOR and NAND flash memory?|||Khác biệt chính trong kiến trúc của bộ nhớ flash NOR và NAND là gì?",
          "options": [
            {
              "text": "NOR flash memory cells are connected in series, while NAND flash memory cells are connected in parallel|||Ô nhớ NOR nối nối tiếp, còn ô nhớ NAND nối song song"
            },
            {
              "text": "NOR flash memory cells are connected in parallel, while NAND flash memory cells are connected in series|||Ô nhớ NOR nối song song, còn ô nhớ NAND nối nối tiếp"
            },
            {
              "text": "Both NOR and NAND flash memory cells are connected in series|||Cả NOR và NAND đều nối nối tiếp"
            },
            {
              "text": "Both NOR and NAND flash memory cells are connected in parallel|||Cả NOR và NAND đều nối song song"
            },
            {
              "text": "All of the mentioned are wrong|||Tất cả đều sai"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\"><b>NOR</b> flash cells are wired in <b>parallel</b> (fast random read), while <b>NAND</b> cells are wired in <b>series</b> (dense, block access).</div><div class=\"ml-vi\">Ô <b>NOR</b> nối <b>song song</b> (đọc ngẫu nhiên nhanh), còn ô <b>NAND</b> nối <b>nối tiếp</b> (mật độ cao, truy cập theo khối).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "With the hard disk data layout, the set of all the tracks in the same relative position on the platter, is called ____.|||Trong cách bố trí dữ liệu ổ đĩa cứng, tập hợp tất cả các rãnh (track) ở cùng vị trí tương đối trên các mặt đĩa được gọi là ____.",
          "options": [
            {
              "text": "Cylinder|||Cylinder (trụ)"
            },
            {
              "text": "Tracks|||Tracks (rãnh)"
            },
            {
              "text": "Inter-track gap|||Inter-track gap (khe giữa rãnh)"
            },
            {
              "text": "Sector|||Sector (cung)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The set of all tracks at the same radius across every platter surface forms a <b>cylinder</b>.</div><div class=\"ml-vi\">Tập hợp mọi rãnh ở cùng bán kính trên mọi mặt đĩa tạo thành một <b>cylinder (trụ)</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which is incorrect about RAID?|||Điều nào sau đây SAI về RAID?",
          "options": [
            {
              "text": "RAID is a set of physical disk drives viewed by the operating system as a single logical drive.|||RAID là tập hợp các ổ đĩa vật lý được hệ điều hành xem như một ổ logic duy nhất."
            },
            {
              "text": "Data are distributed across the physical drives of an array in a scheme known as striping, described subsequently.|||Dữ liệu được phân bố trên các ổ vật lý của mảng theo cơ chế gọi là striping."
            },
            {
              "text": "RAID is only used for Windows OS|||RAID chỉ được dùng cho hệ điều hành Windows"
            },
            {
              "text": "Redundant disk capacity is used to store parity information, which guarantees data recoverability in case of a disk failure.|||Dung lượng đĩa dư thừa được dùng để lưu thông tin parity, đảm bảo khôi phục dữ liệu khi ổ hỏng."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">RAID is OS-independent — it works on Linux, Windows, etc. So \"<b>RAID is only used for Windows OS</b>\" is the incorrect statement.</div><div class=\"ml-vi\">RAID không phụ thuộc hệ điều hành — chạy trên Linux, Windows… Nên \"<b>RAID chỉ dùng cho Windows</b>\" là phát biểu sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In terms of data storage, what is the main distinction between a solid state drive and a magnetic disk?|||Về lưu trữ dữ liệu, khác biệt chính giữa ổ SSD và đĩa từ là gì?",
          "options": [
            {
              "text": "A magnetic disk uses a spinning platter and a read/write head, while a solid state drive uses flash memory chips|||Đĩa từ dùng đĩa quay và đầu đọc/ghi, còn SSD dùng chip nhớ flash"
            },
            {
              "text": "A magnetic disk uses flash memory chips, while a solid state drive uses a spinning platter and a read/write head|||Đĩa từ dùng chip nhớ flash, còn SSD dùng đĩa quay và đầu đọc/ghi"
            },
            {
              "text": "A magnetic disk and a solid state drive both use flash memory chips, but with different interfaces|||Cả đĩa từ và SSD đều dùng chip nhớ flash nhưng khác giao tiếp"
            },
            {
              "text": "A magnetic disk and a solid state drive both use a spinning platter and a read/write head, but with different speeds|||Cả đĩa từ và SSD đều dùng đĩa quay và đầu đọc/ghi nhưng khác tốc độ"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">A <b>magnetic disk</b> uses a spinning platter + read/write head; an <b>SSD</b> has no moving parts and stores data in flash memory chips.</div><div class=\"ml-vi\"><b>Đĩa từ</b> dùng đĩa quay + đầu đọc/ghi; <b>SSD</b> không có bộ phận chuyển động, lưu dữ liệu trong chip nhớ flash.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "____: Determine the address of the next instruction to be executed. Usually, this involves adding a fixed number to the address of the previous instruction.|||____: Xác định địa chỉ của lệnh kế tiếp cần thực thi. Thường việc này gồm cộng một số cố định vào địa chỉ của lệnh trước đó.",
          "options": [
            {
              "text": "Instruction fetch|||Lấy lệnh (Instruction fetch)"
            },
            {
              "text": "Instruction operation decoding|||Giải mã thao tác lệnh (Instruction operation decoding)"
            },
            {
              "text": "Instruction address calculation|||Tính địa chỉ lệnh (Instruction address calculation)"
            },
            {
              "text": "Operand fetch|||Lấy toán hạng (Operand fetch)"
            },
            {
              "text": "Operand address calculation|||Tính địa chỉ toán hạng (Operand address calculation)"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Computing where the next instruction lives (usually PC + fixed length) is the <b>instruction address calculation</b> substep.</div><div class=\"ml-vi\">Tính xem lệnh kế tiếp nằm ở đâu (thường PC + độ dài cố định) là bước con <b>tính địa chỉ lệnh</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In which I/O technique does an I/O channel or processor manage transfer of data, thus freeing the CPU?|||Trong kỹ thuật I/O nào, một kênh I/O hoặc bộ xử lý quản lý việc truyền dữ liệu, nhờ đó giải phóng CPU?",
          "options": [
            {
              "text": "Programmed I/O|||Programmed I/O"
            },
            {
              "text": "Interrupt-driven I/O|||Interrupt-driven I/O"
            },
            {
              "text": "Channel I/O|||Channel I/O"
            },
            {
              "text": "Memory-mapped I/O|||Memory-mapped I/O"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">With <b>Channel I/O</b>, a dedicated I/O channel/processor manages the whole transfer, freeing the CPU.</div><div class=\"ml-vi\">Với <b>Channel I/O</b>, một kênh/bộ xử lý I/O riêng quản lý toàn bộ việc truyền, giải phóng CPU.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The I/O technique where the processor busy waits for an I/O operation to complete is called ____.|||Kỹ thuật I/O trong đó bộ xử lý bận-chờ (busy wait) cho tới khi thao tác I/O hoàn tất được gọi là ____.",
          "options": [
            {
              "text": "Programmed I/O or DMA|||Programmed I/O hoặc DMA"
            },
            {
              "text": "Interrupt-driven I/O|||Interrupt-driven I/O"
            },
            {
              "text": "Direct Memory Access (DMA)|||Direct Memory Access (DMA)"
            },
            {
              "text": "Programmed I/O|||Programmed I/O"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">In <b>Programmed I/O</b> the CPU polls the status and busy-waits until the I/O operation completes.</div><div class=\"ml-vi\">Trong <b>Programmed I/O</b>, CPU liên tục kiểm tra trạng thái và bận-chờ đến khi thao tác I/O xong.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main distinction between Interrupt-Driven I/O and Direct Memory Access (DMA)?|||Khác biệt chính giữa Interrupt-Driven I/O và Direct Memory Access (DMA) là gì?",
          "options": [
            {
              "text": "Interrupt-Driven I/O involves the CPU in every data transfer, while DMA bypasses the CPU and transfers data directly between I/O device and memory|||Interrupt-Driven I/O có CPU tham gia mọi lần truyền, còn DMA vượt qua CPU và truyền dữ liệu trực tiếp giữa thiết bị I/O và bộ nhớ"
            },
            {
              "text": "Interrupt-Driven I/O requires special hardware and software support, while DMA does not need any additional components|||Interrupt-Driven I/O cần phần cứng và phần mềm đặc biệt, còn DMA không cần thành phần bổ sung"
            },
            {
              "text": "Interrupt-Driven I/O is suitable for small and frequent data transfers, while DMA is suitable for large and infrequent data transfers|||Interrupt-Driven I/O phù hợp truyền nhỏ và thường xuyên, còn DMA phù hợp truyền lớn và không thường xuyên"
            },
            {
              "text": "All of the mentioned|||Tất cả đều đúng"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Key difference: interrupt-driven I/O still moves each word through the CPU, whereas <b>DMA bypasses the CPU</b> and transfers directly between device and memory.</div><div class=\"ml-vi\">Khác biệt chính: interrupt-driven I/O vẫn chuyển từng từ qua CPU, còn <b>DMA vượt qua CPU</b> và truyền trực tiếp giữa thiết bị và bộ nhớ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What role does an Application Programming Interface (API) play in software development?|||Giao diện lập trình ứng dụng (API) đóng vai trò gì trong phát triển phần mềm?",
          "options": [
            {
              "text": "It allows program access to hardware resources using high-level language libraries|||Cho phép chương trình truy cập tài nguyên phần cứng thông qua các thư viện ngôn ngữ bậc cao"
            },
            {
              "text": "It defines low-level machine instructions|||Định nghĩa các lệnh máy bậc thấp"
            },
            {
              "text": "It provides a standard for binary portability|||Cung cấp chuẩn cho tính khả chuyển nhị phân"
            },
            {
              "text": "It manages system resources for the operating system and machine language instructions|||Quản lý tài nguyên hệ thống cho hệ điều hành và lệnh ngôn ngữ máy"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">An <b>API</b> lets programs use hardware/system resources through high-level language libraries, hiding low-level details.</div><div class=\"ml-vi\"><b>API</b> cho phép chương trình dùng tài nguyên phần cứng/hệ thống qua thư viện ngôn ngữ bậc cao, che giấu chi tiết bậc thấp.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which state indicates that a process is currently being executed by the processor?|||Trạng thái nào cho biết một tiến trình đang được bộ xử lý thực thi?",
          "options": [
            {
              "text": "Running|||Running (đang chạy)"
            },
            {
              "text": "Ready|||Ready (sẵn sàng)"
            },
            {
              "text": "NewBorn|||NewBorn (mới sinh)"
            },
            {
              "text": "Halted|||Halted (dừng)"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The <b>Running</b> state means the process is currently executing on the processor.</div><div class=\"ml-vi\">Trạng thái <b>Running</b> nghĩa là tiến trình đang được bộ xử lý thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which of the following statements is incorrect about Translation Look-aside Buffer (TLB)?|||Phát biểu nào sau đây SAI về Bộ đệm dịch địa chỉ (Translation Look-aside Buffer - TLB)?",
          "options": [
            {
              "text": "The use of TLB eliminates the need for keeping a page table in memory|||Việc dùng TLB loại bỏ nhu cầu giữ một bảng trang trong bộ nhớ"
            },
            {
              "text": "TLB only maintains a subset of the entries stored in the full memory-based page table|||TLB chỉ giữ một tập con các mục được lưu trong bảng trang đầy đủ trong bộ nhớ"
            },
            {
              "text": "When there is a TLB miss the system needs to access the page table|||Khi có TLB miss, hệ thống cần truy cập bảng trang"
            },
            {
              "text": "A translation lookaside buffer (TLB) is a memory cache that stores the recent translations of virtual memory to physical memory|||TLB là một cache bộ nhớ lưu các bản dịch gần đây từ bộ nhớ ảo sang bộ nhớ vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">The TLB is only a cache of recent translations — the full page table still lives in memory. So \"<b>TLB eliminates the need for a page table in memory</b>\" is false.</div><div class=\"ml-vi\">TLB chỉ là cache của các bản dịch gần đây — bảng trang đầy đủ vẫn nằm trong bộ nhớ. Nên \"<b>TLB loại bỏ nhu cầu giữ bảng trang trong bộ nhớ</b>\" là sai.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does Boolean algebra contribute to the design of digital circuits?|||Đại số Boole đóng góp thế nào cho việc thiết kế mạch số?",
          "options": [
            {
              "text": "It simplifies the implementation of desired functions|||Nó đơn giản hóa việc hiện thực các hàm mong muốn"
            },
            {
              "text": "It helps in the analysis of economic data|||Nó giúp phân tích dữ liệu kinh tế"
            },
            {
              "text": "It facilitates the design of analog circuits|||Nó hỗ trợ thiết kế mạch analog"
            },
            {
              "text": "It is primarily used for chemical engineering and physical engineering|||Nó chủ yếu dùng cho kỹ thuật hóa học và vật lý"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Boolean algebra lets designers minimize logic expressions, <b>simplifying the implementation of the desired functions</b>.</div><div class=\"ml-vi\">Đại số Boole cho phép tối giản biểu thức logic, <b>đơn giản hóa việc hiện thực các hàm mong muốn</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the output of a NOT gate when the input is 0?|||Đầu ra của cổng NOT khi đầu vào là 0 là gì?",
          "options": [
            {
              "text": "0|||0"
            },
            {
              "text": "1|||1"
            },
            {
              "text": "Undefined|||Không xác định"
            },
            {
              "text": "2|||2"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A NOT gate inverts its input: NOT 0 = <b>1</b>.</div><div class=\"ml-vi\">Cổng NOT đảo đầu vào: NOT 0 = <b>1</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is result logical right shift of 10110000 by 2 bit?|||Kết quả dịch phải logic (logical right shift) của 10110000 đi 2 bit là gì?",
          "options": [
            {
              "text": "00101100|||00101100"
            },
            {
              "text": "01011000|||01011000"
            },
            {
              "text": "01001100|||01001100"
            },
            {
              "text": "00110000|||00110000"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Logical right shift by 2 moves every bit right and fills the top with 0s: 10110000 → <b>00101100</b>.</div><div class=\"ml-vi\">Dịch phải logic 2 bit: mọi bit dời sang phải và điền 0 ở đầu: 10110000 → <b>00101100</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "If you have an integer number +18 in sign magnitude representation, which is 00010010, what is the correct option for -18?|||Nếu số nguyên +18 ở dạng dấu-độ lớn (sign magnitude) là 00010010, thì phương án đúng cho -18 là gì?",
          "options": [
            {
              "text": "00010010|||00010010"
            },
            {
              "text": "10010010|||10010010"
            },
            {
              "text": "11110010|||11110010"
            },
            {
              "text": "01110010|||01110010"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">Sign-magnitude: keep the magnitude bits, just flip the sign bit to 1 → <b>1</b>0010010.</div><div class=\"ml-vi\">Dấu-độ lớn: giữ nguyên các bit độ lớn, chỉ đổi bit dấu thành 1 → <b>1</b>0010010.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Why is it essential to use symbolic representation of machine instructions?|||Vì sao việc dùng biểu diễn ký hiệu (symbolic) cho lệnh máy là cần thiết?",
          "options": [
            {
              "text": "It makes machine instructions more human-readable and understandable|||Nó làm lệnh máy dễ đọc và dễ hiểu hơn với con người"
            },
            {
              "text": "It reduces the overall complexity of computer systems and user programs|||Nó giảm độ phức tạp tổng thể của hệ thống máy tính và chương trình người dùng"
            },
            {
              "text": "It minimizes the need for memory storage for the user programs|||Nó giảm tối thiểu nhu cầu lưu trữ bộ nhớ cho chương trình người dùng"
            },
            {
              "text": "It enables fastest execution of high level language instructions|||Nó giúp thực thi nhanh nhất các lệnh ngôn ngữ bậc cao"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Symbolic (assembly) names like ADD, MOV make machine instructions <b>human-readable and understandable</b> instead of raw binary.</div><div class=\"ml-vi\">Ký hiệu (hợp ngữ) như ADD, MOV khiến lệnh máy <b>dễ đọc và dễ hiểu</b> thay vì nhị phân thô.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The hardware mechanism that allows a device to notify the CPU is called ____.|||Cơ chế phần cứng cho phép một thiết bị thông báo cho CPU được gọi là ____.",
          "options": [
            {
              "text": "polling|||polling (thăm dò)"
            },
            {
              "text": "interrupt|||interrupt (ngắt)"
            },
            {
              "text": "driver|||driver (trình điều khiển)"
            },
            {
              "text": "controlling|||controlling (điều khiển)"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">An <b>interrupt</b> is the hardware signal a device raises to notify the CPU that it needs attention.</div><div class=\"ml-vi\"><b>Interrupt (ngắt)</b> là tín hiệu phần cứng thiết bị phát ra để báo CPU rằng nó cần được phục vụ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is a branch instruction?|||Lệnh rẽ nhánh (branch instruction) là gì?",
          "options": [
            {
              "text": "The instructions that are used to divide a program into multiple subprograms|||Lệnh dùng để chia chương trình thành nhiều chương trình con"
            },
            {
              "text": "The instructions that have as one of its operands the address of the next instruction to be executed|||Lệnh có một trong các toán hạng là địa chỉ của lệnh kế tiếp cần thực thi"
            },
            {
              "text": "The instructions that are used to pause the program|||Lệnh dùng để tạm dừng chương trình"
            },
            {
              "text": "The instructions that are used to return to the beginning of the program|||Lệnh dùng để quay về đầu chương trình"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A <b>branch</b> instruction carries, as one of its operands, the address of the next instruction to execute (it changes the flow).</div><div class=\"ml-vi\">Lệnh <b>rẽ nhánh</b> mang một toán hạng là địa chỉ của lệnh kế tiếp cần thực thi (nó thay đổi luồng).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of addressing modes with both indirect addressing and indexing, what is postindexing?|||Trong ngữ cảnh chế độ địa chỉ có cả địa chỉ gián tiếp (indirect) và chỉ số (indexing), postindexing là gì?",
          "options": [
            {
              "text": "Indexing is performed after the indirection|||Chỉ số được thực hiện SAU khi gián tiếp (indirection)"
            },
            {
              "text": "Indexing is performed before the indirection|||Chỉ số được thực hiện TRƯỚC khi gián tiếp"
            },
            {
              "text": "Both indexing and indirection are avoided|||Cả chỉ số và gián tiếp đều bị bỏ qua"
            },
            {
              "text": "Indexing and indirection occur simultaneously|||Chỉ số và gián tiếp xảy ra đồng thời"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Postindexing</b>: the indirection is done first, then the index is added to the result.</div><div class=\"ml-vi\"><b>Postindexing</b>: gián tiếp được thực hiện trước, sau đó mới cộng chỉ số vào kết quả.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "EEPROM is read-mostly-memory and volatile|||EEPROM là bộ nhớ đọc-là-chủ-yếu (read-mostly) và khả biến (volatile).",
          "options": [
            {
              "text": "True|||Đúng"
            },
            {
              "text": "False|||Sai"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">EEPROM is read-mostly memory but it is <b>non-volatile</b> (it keeps data without power) → the statement is <b>False</b>.</div><div class=\"ml-vi\">EEPROM là bộ nhớ đọc-là-chủ-yếu nhưng <b>không khả biến</b> (giữ dữ liệu khi mất điện) → phát biểu <b>Sai</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which architectural concept involves replicating register banks to facilitate the sharing of pipeline resources among multiple threads?|||Khái niệm kiến trúc nào liên quan tới việc nhân bản các bank thanh ghi để hỗ trợ chia sẻ tài nguyên pipeline giữa nhiều luồng (thread)?",
          "options": [
            {
              "text": "Pipelining|||Pipelining"
            },
            {
              "text": "Superscalar|||Superscalar"
            },
            {
              "text": "Simultaneous multithreading|||Đa luồng đồng thời (Simultaneous multithreading)"
            },
            {
              "text": "Superpipelining|||Superpipelining"
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\"><b>Simultaneous multithreading (SMT)</b> replicates register banks so multiple threads share the pipeline resources at once.</div><div class=\"ml-vi\"><b>Đa luồng đồng thời (SMT)</b> nhân bản các bank thanh ghi để nhiều luồng cùng chia sẻ tài nguyên pipeline.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Steps for executing a machine instruction are concerned, given an assembly code: ADD EAX, V. What step will access the variable V?|||Xét các bước thực thi một lệnh máy với mã hợp ngữ: ADD EAX, V. Bước nào sẽ truy cập biến V?",
          "options": [
            {
              "text": "The fetch data step.|||Bước lấy dữ liệu (fetch data)."
            },
            {
              "text": "The fetch instruction step.|||Bước lấy lệnh (fetch instruction)."
            },
            {
              "text": "The process data step.|||Bước xử lý dữ liệu (process data)."
            },
            {
              "text": "The interpret instruction step.|||Bước thông dịch lệnh (interpret instruction)."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Reading the operand V from memory happens in the <b>fetch data</b> (operand fetch) step.</div><div class=\"ml-vi\">Đọc toán hạng V từ bộ nhớ diễn ra ở bước <b>lấy dữ liệu</b> (operand fetch).</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "The PC, IR, MAR, MBR registers belong to which of the following groups?|||Các thanh ghi PC, IR, MAR, MBR thuộc nhóm nào sau đây?",
          "options": [
            {
              "text": "Control and Status Registers|||Thanh ghi điều khiển và trạng thái (Control and Status)"
            },
            {
              "text": "User-Visible Registers|||Thanh ghi người dùng thấy được (User-Visible)"
            },
            {
              "text": "General Registers|||Thanh ghi đa dụng (General)"
            },
            {
              "text": "Handle Registers|||Thanh ghi Handle"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">PC, IR, MAR, MBR are <b>control and status registers</b> used internally by the CU, not visible to the programmer.</div><div class=\"ml-vi\">PC, IR, MAR, MBR là <b>thanh ghi điều khiển và trạng thái</b> do CU dùng nội bộ, lập trình viên không thấy.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the significance of the program counter (PC) in the fetch phase of the instruction cycle?|||Ý nghĩa của bộ đếm chương trình (PC) trong pha lấy lệnh (fetch) của chu kỳ lệnh là gì?",
          "options": [
            {
              "text": "The program counter (PC) is not used in the fetch phase, and its role is limited to tracking the number of instructions executed by the CPU|||PC không được dùng trong pha fetch, vai trò của nó chỉ là đếm số lệnh CPU đã thực thi"
            },
            {
              "text": "The program counter (PC) in the fetch phase holds the memory address of the next instruction to be fetched and executed|||PC trong pha fetch giữ địa chỉ bộ nhớ của lệnh kế tiếp cần lấy và thực thi"
            },
            {
              "text": "The program counter (PC) is responsible for executing instructions and has no specific role during the fetch phase|||PC chịu trách nhiệm thực thi lệnh và không có vai trò cụ thể trong pha fetch"
            },
            {
              "text": "The program counter (PC) is only relevant in multi-core processors and does not contribute to the fetch phase of the instruction cycle in single-core systems|||PC chỉ liên quan tới bộ xử lý đa nhân, không đóng góp vào pha fetch trong hệ đơn nhân"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">In the fetch phase the <b>PC holds the address of the next instruction</b> to fetch and execute.</div><div class=\"ml-vi\">Trong pha fetch, <b>PC giữ địa chỉ của lệnh kế tiếp</b> cần lấy và thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the context of instruction execution, how is a product on an assembly line conceptually similar to an instruction in a pipeline?|||Trong ngữ cảnh thực thi lệnh, một sản phẩm trên dây chuyền lắp ráp giống về mặt khái niệm với một lệnh trong pipeline như thế nào?",
          "options": [
            {
              "text": "Both undergo multiple stages of production|||Cả hai đều trải qua nhiều giai đoạn sản xuất/xử lý"
            },
            {
              "text": "Both are executed in a single clock cycle|||Cả hai được thực thi trong một chu kỳ xung nhịp"
            },
            {
              "text": "Both follow a linear sequence of tasks|||Cả hai theo một chuỗi tác vụ tuyến tính"
            },
            {
              "text": "Both are processed by the control unit|||Cả hai được xử lý bởi đơn vị điều khiển"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Like a product moving through assembly-line stations, a pipelined instruction <b>passes through multiple stages</b>, with several in progress at once.</div><div class=\"ml-vi\">Giống sản phẩm đi qua các trạm trên dây chuyền, lệnh trong pipeline <b>trải qua nhiều giai đoạn</b>, nhiều lệnh cùng được xử lý một lúc.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In various statement types in a high-level programming language, what is not the most common statement?|||Trong các kiểu câu lệnh của ngôn ngữ lập trình bậc cao, đâu KHÔNG phải câu lệnh phổ biến nhất?",
          "options": [
            {
              "text": "GOTO statement.|||Câu lệnh GOTO."
            },
            {
              "text": "IF statement.|||Câu lệnh IF."
            },
            {
              "text": "CLOOP statement.|||Câu lệnh CLOOP."
            },
            {
              "text": "CALL procedure statement.|||Câu lệnh CALL procedure."
            }
          ],
          "correctIndexes": [
            2
          ],
          "explanation": "<div class=\"ml-en\">Common statement types are assignment, IF, LOOP and CALL. <b>CLOOP</b> is not a real/common statement type.</div><div class=\"ml-vi\">Các kiểu câu lệnh phổ biến là gán, IF, LOOP và CALL. <b>CLOOP</b> không phải kiểu câu lệnh thật/phổ biến.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the concept of Register Windows, how many register groups are there?|||Trong khái niệm Cửa sổ thanh ghi (Register Windows), có bao nhiêu nhóm thanh ghi?",
          "options": [
            {
              "text": "4|||4"
            },
            {
              "text": "3|||3"
            },
            {
              "text": "2|||2"
            },
            {
              "text": "No distinction|||Không phân biệt"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A register window is split into <b>three</b> groups: parameter registers, local registers, and temporary registers.</div><div class=\"ml-vi\">Một cửa sổ thanh ghi được chia thành <b>ba</b> nhóm: thanh ghi tham số, thanh ghi cục bộ, và thanh ghi tạm.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "What is the main benefit of using RISC over CISC?|||Lợi ích chính của việc dùng RISC so với CISC là gì?",
          "options": [
            {
              "text": "RISC has more instructions and addressing modes than CISC|||RISC có nhiều lệnh và chế độ địa chỉ hơn CISC"
            },
            {
              "text": "RISC has faster instruction execution and simpler instruction decoding than CISC|||RISC thực thi lệnh nhanh hơn và giải mã lệnh đơn giản hơn CISC"
            },
            {
              "text": "RISC has variable-length instruction formats and direct memory access than CISC|||RISC có định dạng lệnh độ dài thay đổi và truy cập bộ nhớ trực tiếp hơn CISC"
            },
            {
              "text": "RISC has more registers and pipelines than CISC|||RISC có nhiều thanh ghi và pipeline hơn CISC"
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">RISC uses simple, fixed-length instructions, giving <b>faster execution and simpler decoding</b> than CISC.</div><div class=\"ml-vi\">RISC dùng lệnh đơn giản, độ dài cố định, cho <b>thực thi nhanh hơn và giải mã đơn giản hơn</b> CISC.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In SuperScalar computer architecture, the primary goal of utilizing multiple processors concurrently is to|||Trong kiến trúc SuperScalar, mục tiêu chính của việc dùng nhiều đơn vị xử lý đồng thời là gì?",
          "options": [
            {
              "text": "Increase processing speed by increasing CPU frequency.|||Tăng tốc xử lý bằng cách tăng tần số CPU."
            },
            {
              "text": "Improve performance by executing more than one instruction per machine cycle.|||Cải thiện hiệu năng bằng cách thực thi nhiều hơn một lệnh trong mỗi chu kỳ máy."
            },
            {
              "text": "Reduce the size of the CPU to conserve energy.|||Giảm kích thước CPU để tiết kiệm năng lượng."
            },
            {
              "text": "Enhance computational power by increasing the number of CPU cores.|||Tăng sức mạnh tính toán bằng cách tăng số nhân CPU."
            }
          ],
          "correctIndexes": [
            1
          ],
          "explanation": "<div class=\"ml-en\">A superscalar processor issues and completes <b>more than one instruction per clock cycle</b> using multiple execution units.</div><div class=\"ml-vi\">Bộ xử lý superscalar phát và hoàn tất <b>nhiều hơn một lệnh mỗi chu kỳ xung</b> nhờ nhiều đơn vị thực thi.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "To enhance performance in a superscalar processor, which method(s) should we apply?|||Để nâng cao hiệu năng trong bộ xử lý superscalar, ta nên áp dụng phương pháp nào?",
          "options": [
            {
              "text": "Duplication of resources.|||Nhân bản tài nguyên (Duplication of resources)."
            },
            {
              "text": "Out-of-order issue.|||Phát lệnh không theo thứ tự (Out-of-order issue)."
            },
            {
              "text": "Renaming registers|||Đổi tên thanh ghi (Renaming registers)"
            },
            {
              "text": "All of the mentioned.|||Tất cả các phương án trên."
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Superscalar performance is boosted by all three: <b>duplicating resources, out-of-order issue, and register renaming</b>.</div><div class=\"ml-vi\">Hiệu năng superscalar được tăng nhờ cả ba: <b>nhân bản tài nguyên, phát lệnh không theo thứ tự, và đổi tên thanh ghi</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How many common classifications of parallel systems are there as proposed by Flynn?|||Có bao nhiêu phân loại phổ biến của hệ thống song song theo đề xuất của Flynn?",
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
          "explanation": "<div class=\"ml-en\">Flynn's taxonomy has <b>4</b> classes: SISD, SIMD, MISD, MIMD.</div><div class=\"ml-vi\">Phân loại Flynn có <b>4</b> lớp: SISD, SIMD, MISD, MIMD.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which write technique in which all write operations are made to main memory as well as to the cache, ensuring that main memory is always valid.|||Kỹ thuật ghi nào mà mọi thao tác ghi đều được ghi vào cả bộ nhớ chính lẫn cache, đảm bảo bộ nhớ chính luôn hợp lệ?",
          "options": [
            {
              "text": "Write through|||Write through"
            },
            {
              "text": "Write back|||Write back"
            },
            {
              "text": "Write around|||Write around"
            },
            {
              "text": "No write allocate|||No write allocate"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\"><b>Write-through</b> writes to cache AND main memory at the same time, so main memory is always valid.</div><div class=\"ml-vi\"><b>Write-through</b> ghi vào cache VÀ bộ nhớ chính cùng lúc nên bộ nhớ chính luôn hợp lệ.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "How does multithreading improve the performance of a processor?|||Đa luồng (multithreading) cải thiện hiệu năng bộ xử lý như thế nào?",
          "options": [
            {
              "text": "It increases the instruction-level parallelism by issuing multiple instructions from different threads in the same cycle|||Tăng song song mức lệnh bằng cách phát nhiều lệnh từ các luồng khác nhau trong cùng chu kỳ"
            },
            {
              "text": "It increases the thread-level parallelism by executing multiple threads on different cores or processors|||Tăng song song mức luồng bằng cách chạy nhiều luồng trên các nhân/bộ xử lý khác nhau"
            },
            {
              "text": "It increases the utilization of the processor resources by hiding the latency of long-latency events such as cache misses or branch mispredictions|||Tăng mức tận dụng tài nguyên bộ xử lý bằng cách che độ trễ của các sự kiện độ trễ cao như cache miss hay dự đoán rẽ nhánh sai"
            },
            {
              "text": "All of the mentioned|||Tất cả các phương án trên"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\">Multithreading helps in all these ways: more ILP, more thread-level parallelism, and hiding long-latency stalls → <b>all of the mentioned</b>.</div><div class=\"ml-vi\">Đa luồng giúp theo cả ba cách: tăng ILP, tăng song song mức luồng, và che các độ trễ dài → <b>tất cả các phương án</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Follow the Amdahl's law for multiprocessors, if only 10% of the code is inherently serial (f = 0.9), running the program on a multicore system with 4 processors, a performance gain (speedup factor) would be ____.|||Theo định luật Amdahl cho đa xử lý, nếu chỉ 10% mã là tuần tự cố hữu (f = 0.9), chạy chương trình trên hệ đa nhân với 4 bộ xử lý thì độ lợi hiệu năng (hệ số tăng tốc) là ____.",
          "options": [
            {
              "text": "307%|||307%"
            },
            {
              "text": "297%|||297%"
            },
            {
              "text": "317%|||317%"
            },
            {
              "text": "327%|||327%"
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Speedup = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08× → about <b>307%</b>.</div><div class=\"ml-vi\">Tăng tốc = 1/((1−f)+f/N) = 1/(0.1+0.9/4) = 1/0.325 ≈ 3.08 lần → khoảng <b>307%</b>.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "Which cache is not a shared cache?|||Cache nào KHÔNG phải là cache dùng chung (shared)?",
          "options": [
            {
              "text": "L4 cache|||L4 cache"
            },
            {
              "text": "L3 cache|||L3 cache"
            },
            {
              "text": "L2 cache|||L2 cache"
            },
            {
              "text": "L1 cache|||L1 cache"
            }
          ],
          "correctIndexes": [
            3
          ],
          "explanation": "<div class=\"ml-en\"><b>L1 cache</b> is private to each core; L2/L3/L4 are typically shared across cores.</div><div class=\"ml-vi\"><b>L1 cache</b> là riêng của từng nhân; L2/L3/L4 thường dùng chung giữa các nhân.</div>"
        },
        {
          "kind": "MCQ",
          "points": 1,
          "prompt": "In the MASM, how to receive numbers from user?|||Trong MASM, làm thế nào để nhận số từ người dùng?",
          "options": [
            {
              "text": "Raw data from keyboard are string. The function sval(num-string) will convert num-string to signed number.|||Dữ liệu thô từ bàn phím là chuỗi. Hàm sval(num-string) sẽ chuyển num-string thành số có dấu."
            },
            {
              "text": "Raw data from keyboard are string. The function str$(num-string) will convert num-string to signed number.|||Dữ liệu thô từ bàn phím là chuỗi. Hàm str$(num-string) sẽ chuyển num-string thành số có dấu."
            },
            {
              "text": "Raw data from keyboard are string. The function chr$(num-string) will convert num-string to signed number.|||Dữ liệu thô từ bàn phím là chuỗi. Hàm chr$(num-string) sẽ chuyển num-string thành số có dấu."
            },
            {
              "text": "Raw data from keyboard are string. The function chr$(num-string) will convert num-string to unsigned number.|||Dữ liệu thô từ bàn phím là chuỗi. Hàm chr$(num-string) sẽ chuyển num-string thành số không dấu."
            }
          ],
          "correctIndexes": [
            0
          ],
          "explanation": "<div class=\"ml-en\">Keyboard input arrives as a string; the <b>sval</b> function converts that number-string into a signed integer.</div><div class=\"ml-vi\">Nhập từ bàn phím là chuỗi; hàm <b>sval</b> chuyển chuỗi-số đó thành số nguyên có dấu.</div>"
        }
      ]
    }
  ]
};
