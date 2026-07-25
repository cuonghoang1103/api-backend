// CEA201 — Final Exam (FE) sample paper, imported from the school's SP26 FE.
// Real questions; correct answers + bilingual explanations authored here.
// Bilingual "EN|||VI"; options that are pure values (binary/times) are identical
// in both languages on purpose.

export default {
  course: { courseCode: 'CEA201' },
  exams: [
    {
      kind: 'FE',
      code: 'FE-SP26',
      source: 'REAL',
      title: 'Final Exam — Multiple Choice (SP26)|||Thi cuối kỳ — Trắc nghiệm (SP26)',
      description:
        'Real FE multiple-choice paper (Spring 2026). Some questions ask you to choose more than one answer.|||Đề trắc nghiệm FE thật (kỳ Xuân 2026). Một số câu yêu cầu chọn nhiều đáp án.',
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions:
        '<div class="ml-en"><p>Choose the best answer for each question. Watch for "choose two correct answers" — those need multiple selections. You can flag questions and come back. The timer auto-submits when it ends.</p></div>' +
        '<div class="ml-vi"><p>Chọn đáp án đúng nhất cho mỗi câu. Chú ý câu "choose two correct answers" cần chọn nhiều đáp án. Bạn có thể đánh dấu câu để quay lại. Hết giờ hệ thống tự nộp.</p></div>',
      questions: [
        {
          kind: 'MCQ', points: 1,
          prompt: 'What is the primary role of the IO module? (choose two correct answers)|||Vai trò chính của mô-đun I/O là gì? (chọn hai đáp án đúng)',
          options: [
            { text: 'Its role is data transfer — it transfers data to and from peripheral devices.|||Vai trò truyền dữ liệu — chuyển dữ liệu tới/từ thiết bị ngoại vi.' },
            { text: 'Its role is device communication control — it manages and controls the flow of data between the CPU and peripherals.|||Vai trò điều khiển giao tiếp thiết bị — quản lý và điều khiển luồng dữ liệu giữa CPU và ngoại vi.' },
            { text: 'Its role is data formatting and converting analog signals into digital audio data for the CPU.|||Vai trò định dạng dữ liệu và chuyển tín hiệu analog thành dữ liệu âm thanh số cho CPU.' },
            { text: 'Its role is protecting data from the user, ensuring sensitive information is not lost or intercepted.|||Vai trò bảo vệ dữ liệu khỏi người dùng, đảm bảo thông tin nhạy cảm không bị mất hay chặn.' },
          ],
          correctIndexes: [0, 1],
          explanation:
            '<div class="ml-en">An I/O module has two core jobs: <b>data transfer</b> (moving data between the system and peripherals) and <b>control &amp; timing</b> (coordinating the flow between CPU and devices). C (audio-only) and D (security) are not the general purpose of an I/O module.</div>' +
            '<div class="ml-vi">Mô-đun I/O có hai nhiệm vụ cốt lõi: <b>truyền dữ liệu</b> (di chuyển dữ liệu giữa hệ thống và ngoại vi) và <b>điều khiển &amp; định thời</b> (điều phối luồng giữa CPU và thiết bị). C (chỉ âm thanh) và D (bảo mật) không phải chức năng chung của mô-đun I/O.</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'Which of the following statements is part of the Von Neumann principle?|||Phát biểu nào sau đây thuộc nguyên lý Von Neumann?',
          options: [
            { text: 'The computer uses a program counter to indicate the location of the next statement.|||Máy tính dùng bộ đếm chương trình (PC) để chỉ vị trí lệnh kế tiếp.' },
            { text: 'A computer can control all operations with a single program.|||Máy tính có thể điều khiển mọi thao tác bằng một chương trình duy nhất.' },
            { text: 'Computer memory is not addressable.|||Bộ nhớ máy tính không thể định địa chỉ.' },
            { text: 'Each instruction must have a memory area containing the address of the next instruction.|||Mỗi lệnh phải có vùng nhớ chứa địa chỉ của lệnh kế tiếp.' },
          ],
          correctIndexes: [0],
          explanation:
            '<div class="ml-en">Von Neumann architecture = <b>stored program</b> executed sequentially. Instructions run in order and the <b>program counter (PC)</b> holds the address of the next instruction. Memory IS addressable (C wrong); D describes older non-Von-Neumann designs where each instruction stores the next address.</div>' +
            '<div class="ml-vi">Kiến trúc Von Neumann = <b>chương trình lưu trữ</b> chạy tuần tự. Lệnh thực thi theo thứ tự và <b>bộ đếm chương trình (PC)</b> giữ địa chỉ lệnh kế tiếp. Bộ nhớ CÓ thể định địa chỉ (C sai); D mô tả thiết kế cũ không theo Von Neumann.</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'Which component ensures the transfer of data between the operating environment and the control mechanism?|||Thành phần nào đảm bảo việc truyền dữ liệu giữa môi trường hoạt động và cơ chế điều khiển?',
          options: [
            { text: 'Data processing facility|||Bộ xử lý dữ liệu' },
            { text: 'Control mechanism|||Cơ chế điều khiển' },
            { text: 'Data movement apparatus|||Bộ di chuyển dữ liệu' },
            { text: 'Data storage facility|||Bộ lưu trữ dữ liệu' },
          ],
          correctIndexes: [2],
          explanation:
            '<div class="ml-en">A computer has four functions: data processing, data storage, <b>data movement</b>, and control. Transferring data to/from the outside (operating environment) is the job of the <b>data movement apparatus</b> (I/O).</div>' +
            '<div class="ml-vi">Máy tính có bốn chức năng: xử lý, lưu trữ, <b>di chuyển dữ liệu</b>, và điều khiển. Việc truyền dữ liệu ra/vào bên ngoài (môi trường hoạt động) là nhiệm vụ của <b>bộ di chuyển dữ liệu</b> (I/O).</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'Which one of the four basic functions of a computer describes this statement? "The paths among components are used to move data from memory to memory and from memory through gates to memory."|||Chức năng cơ bản nào của máy tính mô tả phát biểu sau? "Các đường đi giữa các thành phần được dùng để chuyển dữ liệu từ bộ nhớ sang bộ nhớ và từ bộ nhớ qua các cổng tới bộ nhớ."',
          options: [
            { text: 'Data storage|||Lưu trữ dữ liệu' },
            { text: 'Data processing|||Xử lý dữ liệu' },
            { text: 'Data movement|||Di chuyển dữ liệu' },
            { text: 'Control|||Điều khiển' },
          ],
          correctIndexes: [2],
          explanation:
            '<div class="ml-en">Moving data along paths between components is <b>data movement</b>. Storage keeps data, processing transforms it, control coordinates — but relocating data is movement.</div>' +
            '<div class="ml-vi">Việc chuyển dữ liệu theo các đường giữa các thành phần là <b>di chuyển dữ liệu</b>. Lưu trữ giữ dữ liệu, xử lý biến đổi dữ liệu, điều khiển điều phối — còn dời dữ liệu là di chuyển.</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'A benchmark is run 4 times on a computer with execution times: 8s, 10s, 12s, 14s. What is the arithmetic mean?|||Một benchmark chạy 4 lần với thời gian: 8s, 10s, 12s, 14s. Trung bình cộng là bao nhiêu?',
          options: [
            { text: '11s' }, { text: '10.5s' }, { text: '11.5s' }, { text: '12s' },
          ],
          correctIndexes: [0],
          explanation:
            '<div class="ml-en">Arithmetic mean = (8 + 10 + 12 + 14) / 4 = 44 / 4 = <b>11s</b>.</div>' +
            '<div class="ml-vi">Trung bình cộng = (8 + 10 + 12 + 14) / 4 = 44 / 4 = <b>11s</b>.</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'Consider the expression: 1000 0000 AND 1111 1010. What is the result?|||Xét biểu thức: 1000 0000 AND 1111 1010. Kết quả là gì?',
          options: [
            { text: '1000 0000' }, { text: '1111 0000' }, { text: '1001 1010' }, { text: '1001 0101' },
          ],
          correctIndexes: [0],
          explanation:
            '<div class="ml-en">Bitwise AND keeps a 1 only where BOTH bits are 1. 1000 0000 AND 1111 1010: only the top bit is 1 in both operands → <b>1000 0000</b>.</div>' +
            '<div class="ml-vi">Phép AND bit giữ 1 chỉ khi CẢ hai bit đều là 1. 1000 0000 AND 1111 1010: chỉ bit cao nhất là 1 ở cả hai → <b>1000 0000</b>.</div>',
        },
        {
          kind: 'MCQ', points: 1,
          prompt: 'Which of the following determines the Bus Width?|||Yếu tố nào quyết định độ rộng bus (Bus Width)?',
          options: [
            { text: 'The clock speed of the CPU|||Tốc độ xung nhịp CPU' },
            { text: 'The number of cores in the processor|||Số nhân của bộ xử lý' },
            { text: 'The size of the motherboard|||Kích thước bo mạch chủ' },
            { text: 'The number of parallel lines in the data bus|||Số đường song song trong bus dữ liệu' },
            { text: 'Number of components connected to the bus|||Số thành phần nối vào bus' },
          ],
          correctIndexes: [3],
          explanation:
            '<div class="ml-en">Bus width = how many bits can travel at once = the <b>number of parallel lines</b> in the bus. Clock speed affects transfer rate, not width.</div>' +
            '<div class="ml-vi">Độ rộng bus = số bit truyền cùng lúc = <b>số đường song song</b> trong bus. Tốc độ xung ảnh hưởng tốc độ truyền, không phải độ rộng.</div>',
        },
      ],
    },
  ],
};
