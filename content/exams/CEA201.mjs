// CEA201 — Đề 1 (Final Exam, SP26 Retake). Real 50-question FE paper,
// transcribed from the school's images; correct answers + bilingual
// explanations authored here. Auto-generated from the question bank.
export default {
  "course": {
    "courseCode": "CEA201"
  },
  "exams": [
    {
      "kind": "FE",
      "code": "FE-D1",
      "source": "REAL",
      "title": "Đề 1 — Final Exam (SP26 Retake)|||Đề 1 — Thi cuối kỳ (SP26 Thi lại)",
      "description": "Real FE multiple-choice paper (CEA201, Spring 2026 Retake), 50 questions. Some questions ask you to choose more than one answer.|||Đề trắc nghiệm FE thật (CEA201, kỳ Xuân 2026 - Thi lại), 50 câu. Một số câu yêu cầu chọn nhiều đáp án.",
      "durationMinutes": 60,
      "totalPoints": 10,
      "passMark": 4,
      "shuffleQuestions": true,
      "shuffleOptions": false,
      "isPublished": true,
      "instructions": "<div class=\"ml-en\"><p>Choose the best answer for each question. Watch for \"choose two correct answers\" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div><div class=\"ml-vi\"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu \"choose two correct answers\" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>",
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
    }
  ]
};
