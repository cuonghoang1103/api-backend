# Part 1 — what this course really tests, and the environment you sit in.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(1, 'Start here — what this course tests and where you sit',
         'Bắt đầu ở đây — môn này kiểm tra gì và bạn đang ngồi ở đâu',
         'The skill counts, the grading, the NetBeans project layout',
         'Thống kê kỹ năng, cách chấm điểm, cấu trúc project NetBeans')

    h('LAB211 — Read this before you write a line of code',
      'LAB211 — Đọc phần này trước khi gõ dòng code đầu tiên')

    p('<p>This lesson covers <strong>everything the 54 assignments in this track ask for</strong>, '
      'ordered the way you should learn it: the small mechanical skills first, then the design '
      'thinking the larger assignments need. It was written by reading all 54 briefs and counting '
      'what they actually require — not by guessing.</p>'
      '<p>The counts below are the number of assignments (out of 54) whose brief demands each skill. '
      'They tell you where to spend your time.</p>',
      '<p>Bài giảng này bao trùm <strong>toàn bộ những gì 54 bài trong lộ trình yêu cầu</strong>, sắp theo '
      'đúng thứ tự nên học: kỹ năng nhỏ và máy móc trước, rồi mới đến tư duy thiết kế mà các bài lớn cần. '
      'Nội dung được viết sau khi đọc cả 54 đề và <strong>đếm</strong> xem chúng thật sự đòi hỏi gì — '
      'không phải phỏng đoán.</p>'
      '<p>Con số bên dưới là số bài (trên tổng 54) có yêu cầu kỹ năng đó. Nó cho bạn biết nên dồn thời gian '
      'vào đâu.</p>')

    table(['Skill', 'Assignments', 'Where it is taught below'],
          ['Kỹ năng', 'Số bài', 'Học ở mục nào bên dưới'],
          [['Keyboard input with <code>Scanner</code>', '44', 'Part 3'],
           ['String handling', '34', 'Part 3'],
           ['Formatted output (<code>printf</code>)', '30', 'Part 3'],
           ['Menu loop', '26', 'Part 4'],
           ['<code>ArrayList</code> / <code>List</code>', '25', 'Part 6'],
           ['Input validation', '20', 'Part 5'],
           ['Exceptions', '20', 'Part 5'],
           ['File read / write', '17', 'Part 9'],
           ['Searching', '16', 'Part 8'],
           ['Arrays', '14', 'Part 3'],
           ['CRUD management program', '12', 'Part 10'],
           ['Inheritance / polymorphism', '11', 'Part 7'],
           ['Sorting you implement yourself', '7', 'Part 8'],
           ['<code>Comparator</code> sorting', '7', 'Part 6'],
           ['Encapsulation (getter/setter)', '7', 'Part 7'],
           ['Date handling', '7', 'Part 3'],
           ['<code>interface</code>', '5', 'Part 7'],
           ['<code>HashMap</code>', '5', 'Part 6'],
           ['Recursion', '3', 'Part 8'],
           ['Number-base conversion', '3', 'Part 8']],
          [['Nhập bàn phím bằng <code>Scanner</code>', '44', 'Phần 3'],
           ['Xử lý chuỗi', '34', 'Phần 3'],
           ['Xuất có định dạng (<code>printf</code>)', '30', 'Phần 3'],
           ['Vòng lặp menu', '26', 'Phần 4'],
           ['<code>ArrayList</code> / <code>List</code>', '25', 'Phần 6'],
           ['Kiểm tra dữ liệu đầu vào', '20', 'Phần 5'],
           ['Ngoại lệ', '20', 'Phần 5'],
           ['Đọc / ghi tệp', '17', 'Phần 9'],
           ['Tìm kiếm', '16', 'Phần 8'],
           ['Mảng', '14', 'Phần 3'],
           ['Chương trình quản lý CRUD', '12', 'Phần 10'],
           ['Kế thừa / đa hình', '11', 'Phần 7'],
           ['Thuật toán sắp xếp tự cài', '7', 'Phần 8'],
           ['Sắp xếp bằng <code>Comparator</code>', '7', 'Phần 6'],
           ['Đóng gói (getter/setter)', '7', 'Phần 7'],
           ['Xử lý ngày tháng', '7', 'Phần 3'],
           ['<code>interface</code>', '5', 'Phần 7'],
           ['<code>HashMap</code>', '5', 'Phần 6'],
           ['Đệ quy', '3', 'Phần 8'],
           ['Chuyển hệ cơ số', '3', 'Phần 8']])

    h('What you are actually graded on', 'Bạn thật sự bị chấm ở điểm nào')

    p('<p>Passing LAB211 is not "the program runs". Two students hand in programs that behave '
      'identically and one fails. The difference is always one of these four things.</p>',
      '<p>Qua được LAB211 không phải là "chương trình chạy được". Hai bạn nộp hai chương trình chạy '
      'giống hệt nhau mà một bạn trượt. Khác biệt luôn nằm ở một trong bốn điều dưới đây.</p>')

    ol(['<strong>The program does exactly what the brief says</strong> — every menu option, every '
        'message, every validation rule. The brief is the specification; matching it is the job.',
        '<strong>You can explain every line you wrote.</strong> The oral defence is where most marks '
        'are lost. If you copied something you cannot explain, delete it and write something simpler '
        'that you can.',
        '<strong>The code is organised.</strong> One 400-line <code>main</code> fails even when it '
        'works. Classes with clear responsibilities, short methods, sensible names.',
        '<strong>Bad input does not crash it.</strong> Typing <code>abc</code> where a number is '
        'expected must produce a polite message and a re-prompt — never a red stack trace.'],
       ['<strong>Chương trình làm đúng y như đề</strong> — đủ mọi mục menu, đúng từng thông báo, đủ mọi '
        'luật kiểm tra dữ liệu. Đề bài chính là bản đặc tả; làm khớp nó là nhiệm vụ.',
        '<strong>Bạn giải thích được từng dòng mình viết.</strong> Phần vấn đáp là chỗ mất điểm nhiều '
        'nhất. Nếu bạn chép cái gì mà không giải thích nổi, hãy xoá đi và viết lại thứ đơn giản hơn mà '
        'bạn hiểu.',
        '<strong>Code có tổ chức.</strong> Một hàm <code>main</code> dài 400 dòng vẫn trượt dù chạy '
        'đúng. Phải có các lớp với trách nhiệm rõ ràng, hàm ngắn, tên gọi hợp lý.',
        '<strong>Nhập sai không làm chương trình chết.</strong> Gõ <code>abc</code> vào chỗ cần số thì '
        'phải hiện thông báo lịch sự rồi hỏi lại — tuyệt đối không được văng stack trace đỏ.'])

    h('The shape of every assignment', 'Cấu trúc chung của mọi bài')

    p('<p>Once you have read a few briefs the pattern is always the same, and you can start every '
      'assignment by writing this skeleton before you think about the details.</p>',
      '<p>Đọc vài đề là bạn thấy khuôn mẫu luôn giống nhau, và bạn có thể bắt đầu mọi bài bằng cách '
      'dựng sẵn bộ khung này trước khi nghĩ tới chi tiết.</p>')

    mermaid("""flowchart TD
    A[Program starts] --> B[Show menu]
    B --> C{Read the option}
    C -->|1| D[Add - validate then store]
    C -->|2| E[Update - find by id then edit]
    C -->|3| F[Delete - find by id then confirm]
    C -->|4| G[Search - match then list]
    C -->|5| H[Sort and display]
    C -->|other| I[Say invalid choice]
    D --> B
    E --> B
    F --> B
    G --> B
    H --> B
    I --> B
    C -->|exit| J[Save to file and quit]""")

    h('The environment: a NetBeans project, not a loose file',
      'Môi trường: một project NetBeans, không phải file rời')

    p('<p>You submit a NetBeans project folder, not a <code>.java</code> file. Knowing what is inside '
      'it saves you from the two most common submission accidents: handing in a project that will not '
      'open, and handing in one that does not contain your data file.</p>',
      '<p>Bạn nộp cả thư mục project NetBeans, không phải một file <code>.java</code>. Biết bên trong nó '
      'có gì sẽ giúp bạn tránh hai tai nạn nộp bài phổ biến nhất: nộp project không mở được, và nộp '
      'project thiếu mất file dữ liệu.</p>')

    out('NetBeans project layout', 'Cấu trúc thư mục project NetBeans',
        """J1S P0055_DoctorManagement/
├── build.xml            <- Ant build script. NetBeans needs it. Never delete.
├── manifest.mf
├── nbproject/           <- project metadata (main class, source level, libs)
│   ├── build-impl.xml
│   └── project.properties
├── src/                 <- YOUR CODE LIVES HERE, and only here
│   └── doctormanagement/
│       ├── Doctor.java
│       ├── DoctorManager.java
│       ├── Validation.java
│       └── Main.java
├── doctors.txt          <- data files sit at the PROJECT ROOT, not in src/
├── build/               <- compiled .class files (safe to delete)
└── dist/                <- the packaged .jar (safe to delete)""")

    p('<p>Two rules that come straight from that layout:</p>'
      '<p><strong>Relative paths are resolved from the project root, not from <code>src/</code>.</strong> '
      'If your code says <code>new File("doctors.txt")</code>, the file must sit next to '
      '<code>build.xml</code>. This single fact explains most "FileNotFoundException but the file is '
      'right there" questions.</p>'
      '<p><strong>Before you zip a submission, delete <code>build/</code> and <code>dist/</code>.</strong> '
      'They are regenerated on every build and they are usually what pushes an archive over the size '
      'limit.</p>',
      '<p>Từ cấu trúc đó rút ra hai quy tắc:</p>'
      '<p><strong>Đường dẫn tương đối được tính từ thư mục gốc của project, không phải từ '
      '<code>src/</code>.</strong> Nếu code ghi <code>new File("doctors.txt")</code> thì file phải nằm '
      'cạnh <code>build.xml</code>. Chỉ riêng điều này giải thích gần hết các thắc mắc kiểu '
      '"báo FileNotFoundException mà file rõ ràng đang nằm đó".</p>'
      '<p><strong>Trước khi nén bài nộp, hãy xoá <code>build/</code> và <code>dist/</code>.</strong> '
      'Chúng được tạo lại mỗi lần build, và thường chính chúng làm file nén vượt quá dung lượng cho '
      'phép.</p>')

    h('How to use this lesson', 'Cách dùng bài giảng này')

    ul(['Read Parts 2–6 once end to end. They are the mechanics you will use in literally every '
        'assignment.',
        'Do the easy assignments (21–50 LOC) while Parts 3–5 are fresh.',
        'Read Part 7 (OOP) properly before the 90 LOC assignments — Shapes and Bees exist to test it.',
        'Read Part 10 (program architecture) before any 150+ LOC assignment.',
        'Read Part 12 (oral defence) the day before you present. Twice.'],
       ['Đọc Phần 2–6 một lượt từ đầu đến cuối. Đó là phần cơ khí bạn sẽ dùng ở đúng nghĩa mọi bài.',
        'Làm các bài dễ (21–50 LOC) ngay khi vừa đọc xong Phần 3–5.',
        'Đọc kỹ Phần 7 (OOP) trước khi làm các bài 90 LOC — bài Shapes và Bees sinh ra để kiểm tra đúng '
        'phần này.',
        'Đọc Phần 10 (kiến trúc chương trình) trước bất kỳ bài nào từ 150 LOC trở lên.',
        'Đọc Phần 12 (vấn đáp) vào hôm trước ngày bảo vệ. Đọc hai lần.'])

    p('<p>Throughout the lesson you will see <strong>Practise this in Java Core</strong> buttons. They '
      'jump straight to the matching module of the Java Core track, where the same idea has ten graded '
      'exercises and a lesson of its own. Use them when something here does not click.</p>',
      '<p>Xuyên suốt bài giảng bạn sẽ thấy các nút <strong>Luyện thêm ở Java Core</strong>. Chúng nhảy '
      'thẳng tới đúng module tương ứng của lộ trình Java Core, nơi cùng kiến thức đó có mười bài tập chấm '
      'điểm và một bài giảng riêng. Hãy dùng chúng khi có chỗ nào ở đây bạn chưa thông.</p>')

    practice([
        (246, 'Java fundamentals and environment', 'Nền tảng Java và môi trường',
         'Start here if Java itself is new — JDK, compiling, first classes',
         'Bắt đầu ở đây nếu Java còn mới với bạn — JDK, biên dịch, lớp đầu tiên'),
        (249, 'OOP fundamentals', 'Nền tảng hướng đối tượng',
         'The single most important module for passing this course',
         'Module quan trọng nhất để qua được môn này'),
    ])
