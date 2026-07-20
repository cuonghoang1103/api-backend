# Parts 11-13 — debugging, the oral defence, and the map back to the 54 briefs.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice, links


def build():
    part(13, 'Debugging in NetBeans, and reading a stack trace',
         'Debug trong NetBeans, và cách đọc stack trace',
         'Breakpoints, stepping, and the five errors you will actually meet',
         'Breakpoint, chạy từng bước, và năm lỗi bạn sẽ thật sự gặp')

    p('<p>Adding <code>System.out.println</code> everywhere is how you debug when you do not know the '
      'debugger. Learning it takes fifteen minutes and it is itself an examinable skill — being asked to '
      '"show me how you found that bug" is common.</p>',
      '<p>Rải <code>System.out.println</code> khắp nơi là cách debug của người chưa biết dùng trình gỡ '
      'lỗi. Học nó mất mười lăm phút, và bản thân nó cũng là một kỹ năng bị hỏi — câu "em tìm ra lỗi đó '
      'bằng cách nào" rất hay gặp.</p>')

    table(['Action', 'Key', 'What it does'],
          ['Thao tác', 'Phím', 'Làm gì'],
          [['Toggle breakpoint', '<code>Ctrl+F8</code>', 'the red dot; execution pauses on this line'],
           ['Debug the project', '<code>Ctrl+F5</code>', 'run until the first breakpoint'],
           ['Step over', '<code>F8</code>', 'run this line, do not enter the method'],
           ['Step into', '<code>F7</code>', 'go inside the method being called'],
           ['Step out', '<code>Ctrl+F7</code>', 'finish this method, return to the caller'],
           ['Continue', '<code>F5</code>', 'run to the next breakpoint'],
           ['Watch an expression', '<code>Ctrl+Shift+F7</code>', 'show a value as it changes']],
          [['Bật/tắt breakpoint', '<code>Ctrl+F8</code>', 'chấm đỏ; chạy tới dòng này sẽ dừng lại'],
           ['Chạy chế độ debug', '<code>Ctrl+F5</code>', 'chạy tới breakpoint đầu tiên'],
           ['Bước qua', '<code>F8</code>', 'chạy dòng này, không chui vào hàm'],
           ['Bước vào', '<code>F7</code>', 'chui vào bên trong hàm đang gọi'],
           ['Bước ra', '<code>Ctrl+F7</code>', 'chạy hết hàm này rồi quay về nơi gọi'],
           ['Chạy tiếp', '<code>F5</code>', 'chạy tới breakpoint kế tiếp'],
           ['Theo dõi biểu thức', '<code>Ctrl+Shift+F7</code>', 'hiện giá trị một biểu thức khi nó đổi']])

    p('<p><strong>Where to put the first breakpoint.</strong> Not at the top of <code>main</code> — put '
      'it on the first line <em>inside</em> the method that produces the wrong answer, then look at the '
      'Variables window. In nine cases out of ten the parameter arriving is already wrong, and the bug '
      'is in the caller.</p>',
      '<p><strong>Đặt breakpoint đầu tiên ở đâu.</strong> Đừng đặt ở đầu <code>main</code> — hãy đặt vào '
      'dòng đầu tiên <em>bên trong</em> hàm cho ra kết quả sai, rồi nhìn cửa sổ Variables. Chín trên mười '
      'lần, tham số truyền vào đã sai sẵn, và lỗi thật nằm ở nơi gọi.</p>')

    h('Reading a stack trace', 'Đọc một stack trace')

    out('A real crash, line by line', 'Một lần crash thật, đọc từng dòng',
        """Exception in thread "main" java.lang.NullPointerException: Cannot invoke
        "String.length()" because "<local1>" is null
    at doctormanagement.DoctorManager.findByCode(DoctorManager.java:23)
    at doctormanagement.Main.updateDoctor(Main.java:88)
    at doctormanagement.Main.main(Main.java:31)""",
        verify=False)

    ol(['<strong>Line 1 names the problem.</strong> Modern Java even tells you which expression was '
        'null — here something whose <code>length()</code> was called.',
        '<strong>The FIRST <code>at</code> line is where it broke</strong> — '
        '<code>DoctorManager.java</code> line 23. Start there, not at the bottom.',
        '<strong>The lines below are who called it.</strong> Read them as a story: '
        '<code>main</code> line 31 called <code>updateDoctor</code>, which at line 88 called '
        '<code>findByCode</code>.',
        '<strong>Ignore anything with <code>java.</code> or <code>jdk.</code> in it.</strong> The bug is '
        'in your package, never in the JDK.'],
       ['<strong>Dòng 1 nêu tên vấn đề.</strong> Java hiện đại còn nói rõ biểu thức nào bị null — ở đây '
        'là thứ vừa bị gọi <code>length()</code>.',
        '<strong>Dòng <code>at</code> ĐẦU TIÊN là nơi phát nổ</strong> — <code>DoctorManager.java</code> '
        'dòng 23. Hãy bắt đầu từ đó, đừng đọc từ dưới lên.',
        '<strong>Các dòng bên dưới cho biết ai đã gọi nó.</strong> Đọc như một câu chuyện: '
        '<code>main</code> dòng 31 gọi <code>updateDoctor</code>, hàm này ở dòng 88 gọi '
        '<code>findByCode</code>.',
        '<strong>Bỏ qua mọi dòng có <code>java.</code> hay <code>jdk.</code></strong> Lỗi nằm trong '
        'package của bạn, không bao giờ nằm trong JDK.'])

    h('The five errors you will actually meet',
      'Năm lỗi bạn sẽ thật sự gặp')

    table(['Message', 'It means', 'Look for'],
          ['Thông báo', 'Nghĩa là', 'Hãy tìm'],
          [['<code>cannot find symbol</code>', 'a name the compiler never saw',
            'a typo, or a missing <code>import</code>'],
           ['<code>NullPointerException</code>', 'you used something never created',
            'a <code>find…</code> that returned <code>null</code> and was not checked'],
           ['<code>ArrayIndexOutOfBoundsException: index 5 … length 5</code>', 'off by one',
            '<code>&lt;=</code> where you meant <code>&lt;</code>'],
           ['<code>InputMismatchException</code>', 'letters typed into <code>nextInt()</code>',
            'switch to <code>nextLine()</code> + <code>parseInt</code>'],
           ['<code>FileNotFoundException</code>', 'the path is wrong, not the file',
            'the file must sit next to <code>build.xml</code>']],
          [['<code>cannot find symbol</code>', 'một cái tên trình biên dịch chưa từng thấy',
            'gõ sai tên, hoặc thiếu <code>import</code>'],
           ['<code>NullPointerException</code>', 'bạn dùng một thứ chưa từng được tạo',
            'một hàm <code>find…</code> trả về <code>null</code> mà không kiểm tra'],
           ['<code>ArrayIndexOutOfBoundsException: index 5 … length 5</code>', 'lệch một đơn vị',
            '<code>&lt;=</code> ở chỗ đáng ra phải là <code>&lt;</code>'],
           ['<code>InputMismatchException</code>', 'gõ chữ vào <code>nextInt()</code>',
            'chuyển sang <code>nextLine()</code> + <code>parseInt</code>'],
           ['<code>FileNotFoundException</code>', 'sai đường dẫn, không phải mất file',
            'file phải nằm cạnh <code>build.xml</code>']])

    practice([
        (545, 'Testing and quality engineering', 'Kiểm thử và chất lượng',
         'Proving your code works instead of hoping — 10 exercises',
         'Chứng minh code chạy đúng thay vì hy vọng — 10 bài'),
        (246, 'Java fundamentals and environment', 'Nền tảng Java và môi trường',
         'The toolchain your NetBeans project sits on',
         'Bộ công cụ mà project NetBeans của bạn đứng trên'),
    ])

    part(14, 'The oral defence — what they ask, and how to answer',
         'Vấn đáp — họ hỏi gì, và trả lời thế nào',
         '25 real questions in four groups, with the shape of a good answer',
         '25 câu hỏi thật chia bốn nhóm, kèm dáng của câu trả lời tốt')

    p('<p>This is where the marks are. The examiner is checking one thing: did you write this, and do '
      'you understand it. Below are the questions that actually get asked, grouped, with the shape of a '
      'good answer. Do not memorise sentences — memorise <em>where in your own code</em> each answer '
      'lives.</p>',
      '<p>Điểm nằm ở đây. Giám khảo chỉ kiểm tra một điều: bài này có phải bạn viết không, và bạn có hiểu '
      'nó không. Dưới đây là những câu thật sự được hỏi, chia theo nhóm, kèm dáng của một câu trả lời tốt. '
      'Đừng học thuộc câu chữ — hãy nhớ <em>chỗ nào trong code của chính bạn</em> chứa câu trả lời.</p>')

    h('Group A — "explain your code"', 'Nhóm A — "giải thích code của em"')

    table(['Question', 'What a good answer contains'],
          ['Câu hỏi', 'Câu trả lời tốt phải có'],
          [['Walk me through what happens when I choose option 2.',
            'name the method, say what it validates, what it returns, and where it goes next'],
           ['Why did you use <code>ArrayList</code> and not an array?',
            'because records are added and removed while the program runs, and the size is unknown'],
           ['What does this line do?',
            'say the intent first, then the mechanics — "it stops duplicate ids; containsKey is O(1)"'],
           ['What happens if I delete this line?',
            'name the concrete failure: "duplicate ids would be accepted"'],
           ['Why is this method <code>static</code>?',
            'because it needs no object state — it is a pure helper']],
          [['Em kể xem chọn mục 2 thì chuyện gì xảy ra.',
            'gọi tên hàm, nói nó kiểm tra gì, trả về gì, rồi đi tiếp đâu'],
           ['Sao em dùng <code>ArrayList</code> mà không dùng mảng?',
            'vì bản ghi được thêm/xoá trong lúc chạy và không biết trước số lượng'],
           ['Dòng này làm gì?',
            'nói ý đồ trước, rồi mới nói cơ chế — "để chặn trùng mã; containsKey là O(1)"'],
           ['Xoá dòng này đi thì sao?',
            'nêu hỏng cụ thể: "sẽ chấp nhận cả mã bị trùng"'],
           ['Sao hàm này để <code>static</code>?',
            'vì nó không cần trạng thái của đối tượng nào — nó là hàm tiện ích thuần']])

    h('Group B — OOP', 'Nhóm B — Hướng đối tượng')

    table(['Question', 'The answer, and where to point'],
          ['Câu hỏi', 'Trả lời, và chỉ vào đâu'],
          [['Name the four pillars.',
            'encapsulation, inheritance, polymorphism, abstraction — then open the file for each'],
           ['Show me polymorphism in your code.',
            'a base-typed variable calling an <code>@Override</code>-ed method — the loop over the list'],
           ['Why is this class <code>abstract</code>?',
            '"a Shape with no kind is not a real thing; and getArea has no formula at that level"'],
           ['<code>abstract class</code> or <code>interface</code> — why this one?',
            '"is a" versus "is able to"; a class can implement many interfaces but extend one class'],
           ['What does <code>@Override</code> do?',
            'the compiler checks the signature really matches the parent — a typo becomes an error'],
           ['Why is this field <code>private</code>?',
            'so the rule protecting it cannot be bypassed — point at the method that enforces it'],
           ['Difference between overloading and overriding?',
            'overload: same name, different parameters, chosen at compile time. override: same '
            'signature in a subclass, chosen at run time']],
          [['Kể tên bốn tính chất.',
            'đóng gói, kế thừa, đa hình, trừu tượng — rồi mở đúng file minh hoạ từng cái'],
           ['Chỉ chỗ nào trong bài là đa hình.',
            'một biến kiểu lớp cha gọi phương thức đã <code>@Override</code> — vòng lặp duyệt danh sách'],
           ['Sao lớp này để <code>abstract</code>?',
            '"một Shape không thuộc loại nào thì không có thật; và ở mức đó getArea chưa có công thức"'],
           ['<code>abstract class</code> hay <code>interface</code> — vì sao chọn cái này?',
            '"là một" so với "có khả năng"; một lớp implement được nhiều interface nhưng chỉ extends một lớp'],
           ['<code>@Override</code> để làm gì?',
            'trình biên dịch kiểm tra chữ ký có khớp lớp cha thật không — gõ sai tên sẽ thành lỗi'],
           ['Sao trường này để <code>private</code>?',
            'để không ai lách được luật bảo vệ nó — chỉ vào đúng hàm áp đặt luật đó'],
           ['Khác nhau giữa overload và override?',
            'overload: cùng tên, khác tham số, chọn lúc biên dịch. override: cùng chữ ký ở lớp con, '
            'chọn lúc chạy']])

    h('Group C — algorithms and data', 'Nhóm C — thuật toán và dữ liệu')

    table(['Question', 'The answer'],
          ['Câu hỏi', 'Trả lời'],
          [['What is the complexity of your sort?',
            'O(n²) for bubble/selection/insertion; say what that costs, not the definition'],
           ['Why does binary search need a sorted array?',
            'each step throws away a half based on the comparison; unsorted, it discards the answer'],
           ['How do you stop duplicate ids?',
            '<code>containsKey</code>, or a <code>findByCode</code> that must return null first'],
           ['Where does your program stop an infinite loop?',
            'the validated reader returns only on good input; the menu exits on a flag']],
          [['Thuật toán sắp xếp của em độ phức tạp bao nhiêu?',
            'O(n²) với nổi bọt/chọn/chèn; hãy nói nó tốn bao nhiêu, đừng đọc định nghĩa'],
           ['Sao tìm nhị phân bắt buộc mảng phải sắp?',
            'mỗi bước loại đi một nửa dựa trên phép so sánh; mảng chưa sắp thì nó loại nhầm nửa chứa đáp án'],
           ['Em chặn trùng mã bằng cách nào?',
            '<code>containsKey</code>, hoặc <code>findByCode</code> phải trả về null trước đã'],
           ['Chỗ nào trong chương trình chặn vòng lặp vô tận?',
            'hàm đọc-có-kiểm-tra chỉ trả về khi dữ liệu hợp lệ; menu thoát bằng một cờ']])

    h('Group D — the questions that catch people out',
      'Nhóm D — những câu đánh bẫy')

    ul(['<strong>"Type <code>abc</code> here."</strong> They will do this. If it crashes, Part 5 is why.',
        '<strong>"Delete the data file and run it again."</strong> A missing file on first run must be '
        'handled, not fatal.',
        '<strong>"Add the same id twice."</strong> The duplicate check gets tested every single time.',
        '<strong>"Which line did you copy from the internet?"</strong> Answer honestly and then explain '
        'the line. Not knowing is the failure, not the copying.',
        '<strong>"Change this requirement — how long would it take you?"</strong> They are testing '
        'whether your layers are separate. If the answer is "I would edit one method", you designed it '
        'well.'],
       ['<strong>"Em gõ thử <code>abc</code> vào đây."</strong> Họ sẽ làm thật. Nếu chương trình chết, '
        'Phần 5 là lý do.',
        '<strong>"Xoá file dữ liệu đi rồi chạy lại."</strong> Lần chạy đầu chưa có file là chuyện phải xử '
        'lý được, không được chết.',
        '<strong>"Thêm cùng một mã hai lần xem."</strong> Phần kiểm tra trùng mã bị thử mọi lần, không '
        'trừ lần nào.',
        '<strong>"Dòng nào em chép trên mạng?"</strong> Trả lời thật rồi giải thích dòng đó. Không hiểu '
        'mới là trượt, chứ không phải chép.',
        '<strong>"Giờ đổi yêu cầu thế này, em mất bao lâu?"</strong> Họ đang kiểm tra các tầng của bạn có '
        'tách bạch không. Nếu câu trả lời là "em sửa đúng một hàm", tức là bạn thiết kế tốt.'])

    part(15, 'Before you submit — checklist and the map of 54 assignments',
         'Trước khi nộp — checklist và bản đồ 54 bài',
         'Eight checks, then which brief drills which skill',
         'Tám bước kiểm tra, rồi bài nào luyện kỹ năng nào')

    ol(['Re-read the brief with your program open. Tick every function, every message, every rule.',
        'Test the three attacks: letters where a number goes, a negative number, an empty Enter.',
        'Test the empty state: no data file, empty list — display and search must still behave.',
        'Test duplicates: add the same id twice.',
        'Delete <code>build/</code> and <code>dist/</code>, then reopen the project and build it once '
        'from clean.',
        'Check the data file is inside the project folder, next to <code>build.xml</code>.',
        'Read your own code once, out loud. Anything you cannot explain, simplify now.',
        'Check names: classes PascalCase, methods camelCase verbs, no <code>a</code>, '
        '<code>b</code>, <code>x1</code>.'],
       ['Đọc lại đề với chương trình mở bên cạnh. Tick từng chức năng, từng thông báo, từng luật.',
        'Thử ba đòn tấn công: gõ chữ vào chỗ cần số, gõ số âm, bấm Enter trống.',
        'Thử trạng thái rỗng: chưa có file dữ liệu, danh sách trống — hiển thị và tìm kiếm vẫn phải chạy đúng.',
        'Thử trùng lặp: thêm cùng một mã hai lần.',
        'Xoá <code>build/</code> và <code>dist/</code>, rồi mở lại project và build sạch một lần.',
        'Kiểm tra file dữ liệu nằm trong thư mục project, cạnh <code>build.xml</code>.',
        'Đọc to code của mình một lượt. Chỗ nào không giải thích được thì đơn giản hoá ngay.',
        'Soát tên: lớp PascalCase, hàm camelCase là động từ, không còn <code>a</code>, <code>b</code>, '
        '<code>x1</code>.'])

    h('Where each skill is exercised — the 54 assignments',
      'Mỗi kỹ năng được luyện ở bài nào — bản đồ 54 bài')

    table(['If you want to practise…', 'Do these', 'LOC'],
          ['Muốn luyện…', 'Hãy làm các bài', 'LOC'],
          [['reading input and printing neatly', 'P0060, P0063, P0062, P0064', '21–30'],
           ['sorting you write yourself', 'P0001 bubble, P0002 selection, P0003 insertion', '40'],
           ['searching', 'P0010 linear, P0006 binary', '50–70'],
           ['validation under pressure', 'P0063, P0064, P0067, P0068', '25–39'],
           ['classes and encapsulation', 'P0061, P0082 playing cards', '42–60'],
           ['divide and conquer', 'P0004 quicksort, P0005 merge sort', '70'],
           ['the full CRUD program', 'P0055 doctors, P0054 contacts, P0056 workers', '64–73'],
           ['inheritance and polymorphism', 'P0080 shapes, P0081 bees', '90'],
           ['files', 'P0059, P0075, P0077, P0078', '73–100'],
           ['a real architecture', 'P0070, P0071, P0072, P0085', '150'],
           ['everything at once', 'P0021, P0022, P0023, P0025, P0013, P0014', '350–500']],
          [['đọc dữ liệu vào và in đẹp', 'P0060, P0063, P0062, P0064', '21–30'],
           ['tự viết thuật toán sắp xếp', 'P0001 nổi bọt, P0002 chọn, P0003 chèn', '40'],
           ['tìm kiếm', 'P0010 tuyến tính, P0006 nhị phân', '50–70'],
           ['kiểm tra dữ liệu ở mức khó', 'P0063, P0064, P0067, P0068', '25–39'],
           ['lớp và đóng gói', 'P0061, P0082 bộ bài', '42–60'],
           ['chia để trị', 'P0004 quicksort, P0005 merge sort', '70'],
           ['chương trình CRUD đầy đủ', 'P0055 bác sĩ, P0054 danh bạ, P0056 công nhân', '64–73'],
           ['kế thừa và đa hình', 'P0080 hình học, P0081 ong', '90'],
           ['tệp tin', 'P0059, P0075, P0077, P0078', '73–100'],
           ['kiến trúc thật sự', 'P0070, P0071, P0072, P0085', '150'],
           ['tổng hợp tất cả', 'P0021, P0022, P0023, P0025, P0013, P0014', '350–500']])

    h('A study order that works', 'Thứ tự học hiệu quả')

    p('<p>Do not start at assignment 1 and grind downwards. Follow the LOC ladder — it is the course\'s '
      'own difficulty scale — but read the matching part of this lesson first.</p>',
      '<p>Đừng bắt đầu từ bài 1 rồi cày tuần tự. Hãy đi theo thang LOC — đó chính là thang độ khó của môn '
      '— nhưng đọc trước phần tương ứng trong bài giảng này.</p>')

    ol(['<strong>Week 1</strong> — read Parts 2–5, then do every assignment up to 50 LOC.',
        '<strong>Week 2</strong> — read Part 6 and Part 8, then do 51–99 LOC.',
        '<strong>Week 3</strong> — read Part 7 properly, then P0080 and P0081. Explain them to '
        'somebody out loud.',
        '<strong>Week 4</strong> — read Parts 9 and 10, then the 100–150 LOC assignments.',
        '<strong>Week 5</strong> — one Long assignment, done properly, with the file layout from '
        'Part 10.',
        '<strong>Day before</strong> — Part 11, Part 12, and the checklist in Part 13.'],
       ['<strong>Tuần 1</strong> — đọc Phần 2–5, rồi làm hết các bài tới 50 LOC.',
        '<strong>Tuần 2</strong> — đọc Phần 6 và Phần 8, rồi làm các bài 51–99 LOC.',
        '<strong>Tuần 3</strong> — đọc kỹ Phần 7, rồi làm P0080 và P0081. Giải thích lại cho người khác '
        'nghe bằng lời.',
        '<strong>Tuần 4</strong> — đọc Phần 9 và 10, rồi làm các bài 100–150 LOC.',
        '<strong>Tuần 5</strong> — làm một bài Long cho tử tế, theo đúng bố cục file ở Phần 10.',
        '<strong>Hôm trước ngày bảo vệ</strong> — Phần 11, Phần 12, và checklist ở Phần 13.'])

    links([
        {'url': 'https://docs.oracle.com/en/java/javase/21/docs/api/index.html',
         'label': 'Java 21 API documentation',
         'labelVi': 'Tài liệu API Java 21',
         'note': 'The official reference for every class named in this lesson.',
         'noteVi': 'Tài liệu chính thức cho mọi lớp được nhắc tới trong bài giảng này.'},
        {'url': 'https://docs.oracle.com/javase/tutorial/java/concepts/index.html',
         'label': 'Oracle: object-oriented programming concepts',
         'labelVi': 'Oracle: các khái niệm lập trình hướng đối tượng',
         'note': 'The four pillars, from the source.',
         'noteVi': 'Bốn tính chất, từ chính nhà phát hành Java.'},
        {'url': 'https://netbeans.apache.org/front/main/kb/docs/java/debug-visual/',
         'label': 'Apache NetBeans: debugging Java',
         'labelVi': 'Apache NetBeans: gỡ lỗi Java',
         'note': 'Breakpoints, stepping and the Variables window.',
         'noteVi': 'Breakpoint, chạy từng bước và cửa sổ Variables.'},
        {'url': 'https://github.com/thaycacac/java',
         'label': 'The original brief repository',
         'labelVi': 'Kho đề gốc của thầy',
         'note': 'Where the 54 assignment sheets in this track came from.',
         'noteVi': 'Nguồn của 54 đề bài trong lộ trình này.'},
    ])
