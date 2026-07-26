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
      "title": "Đề 3 — Final Exam (SP26)|||Đề 3 — Thi cuối kỳ (SP26)",
      "description": "Real FE multiple-choice paper (CEA201, Spring 2026), transcribed from the exam images; answers reasoned here.|||Đề trắc nghiệm FE thật (CEA201, kỳ Xuân 2026), chép từ ảnh đề; đáp án được suy luận và biên soạn tại đây.",
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
    }
  ]
};
