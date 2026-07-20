# Part 2/3 — the mechanics used in almost every assignment.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(2, 'Types, operators and the traps that cost marks',
         'Kiểu dữ liệu, toán tử và những cái bẫy làm mất điểm',
         'Integer division, == on text, floating point, Scanner, printf, String, dates',
         'Chia số nguyên, == với chuỗi, số thực, Scanner, printf, chuỗi, ngày tháng')

    p('<p>You do not need every Java type. Across all 54 briefs only these appear.</p>',
      '<p>Bạn không cần biết mọi kiểu của Java. Trong cả 54 đề chỉ xuất hiện những kiểu sau.</p>')

    table(['Type', 'Use it for', 'Appears in'],
          ['Kiểu', 'Dùng cho', 'Xuất hiện ở'],
          [['<code>int</code>', 'quantities, ids, counters, menu choice', 'nearly every brief'],
           ['<code>double</code>', 'salary, price, area, average', 'Shapes, Doctor, Expense'],
           ['<code>String</code>', 'names, codes, addresses, any text', '34 briefs'],
           ['<code>boolean</code>', 'flags — is it dead, is it valid', 'Bees, validation'],
           ['<code>char</code>', 'one letter — Y/N answers, a suit symbol', 'Playing cards'],
           ['<code>long</code>', 'file sizes, big counters', 'file assignments']],
          [['<code>int</code>', 'số lượng, mã số, biến đếm, lựa chọn menu', 'gần như mọi đề'],
           ['<code>double</code>', 'lương, giá, diện tích, trung bình', 'Shapes, Doctor, Expense'],
           ['<code>String</code>', 'tên, mã, địa chỉ, mọi văn bản', '34 đề'],
           ['<code>boolean</code>', 'cờ đúng/sai — đã chết chưa, hợp lệ chưa', 'Bees, kiểm tra dữ liệu'],
           ['<code>char</code>', 'một ký tự — câu trả lời Y/N, ký hiệu chất bài', 'Playing cards'],
           ['<code>long</code>', 'kích thước tệp, biến đếm lớn', 'các bài về tệp']])

    h('Trap 1 — integer division silently truncates',
      'Bẫy 1 — phép chia số nguyên tự cắt phần thập phân')

    p('<p>This is the single most common wrong-answer bug in the "calculate the average / the total" '
      'assignments. Java looks at the <em>types of the operands</em>, not at the type of the variable '
      'you are assigning into.</p>',
      '<p>Đây là lỗi sai kết quả phổ biến nhất ở các bài "tính trung bình / tính tổng". Java nhìn vào '
      '<em>kiểu của hai toán hạng</em>, chứ không nhìn kiểu của biến bạn gán vào.</p>')

    code('Integer division — and the three ways to fix it',
         'Chia số nguyên — và ba cách sửa',
         """int total = 7;
int count = 2;

double wrong = total / count;              // 3.0  <- both sides are int
double fixA  = (double) total / count;     // 3.5  cast one side
double fixB  = total / (double) count;     // 3.5  cast the other side
double fixC  = 1.0 * total / count;        // 3.5  multiply by 1.0 first

System.out.println(wrong + " " + fixA + " " + fixB + " " + fixC);""",
         kind='fragment',
         src_vi="""int tong = 7;
int soLuong = 2;

// Cả hai vế đều là int nên Java làm phép chia nguyên rồi mới đổi sang double
double sai   = tong / soLuong;               // 3.0  <- SAI
double dung1 = (double) tong / soLuong;      // 3.5  ép kiểu vế trái
double dung2 = tong / (double) soLuong;      // 3.5  ép kiểu vế phải
double dung3 = 1.0 * tong / soLuong;         // 3.5  nhân 1.0 trước

System.out.println(sai + " " + dung1 + " " + dung2 + " " + dung3);""")

    out('Real output', 'Kết quả chạy thật', '3.0 3.5 3.5 3.5')

    h('Trap 2 — comparing text with == ', 'Bẫy 2 — so sánh văn bản bằng ==')

    p('<p><code>==</code> asks "are these the same object in memory". For text you almost always mean '
      '"do these contain the same characters", which is <code>.equals()</code>. It appears to work in '
      'small tests because Java reuses identical literals — and then fails the moment the text comes '
      'from <code>Scanner</code>. That is why it survives your testing and dies in the demo.</p>',
      '<p><code>==</code> hỏi "hai cái này có phải cùng một đối tượng trong bộ nhớ không". Với văn bản '
      'bạn gần như luôn muốn hỏi "hai cái này có cùng nội dung không", tức là <code>.equals()</code>. '
      'Nó có vẻ chạy đúng khi bạn thử nhỏ vì Java dùng lại các hằng chuỗi giống nhau — rồi hỏng ngay khi '
      'chuỗi đến từ <code>Scanner</code>. Đó là lý do nó sống sót qua lúc bạn tự test và chết đúng lúc '
      'demo.</p>')

    code('Why == passes your test and fails the demo',
         'Vì sao == qua được lúc bạn test nhưng chết lúc demo',
         """String a = "exit";
String b = "exit";
String typed = new String("exit");        // stands in for Scanner input

System.out.println(a == b);               // true  - same literal, reused
System.out.println(a == typed);           // false - different object!
System.out.println(a.equals(typed));      // true  - same characters
System.out.println(a.equalsIgnoreCase("EXIT"));   // true - use for menus""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', 'true\nfalse\ntrue\ntrue')

    p('<p><strong>Rule:</strong> use <code>.equals()</code> for text, always. Use '
      '<code>.equalsIgnoreCase()</code> when the user types the answer. Reserve <code>==</code> for '
      'numbers, <code>char</code> and <code>boolean</code>.</p>',
      '<p><strong>Quy tắc:</strong> với văn bản, luôn dùng <code>.equals()</code>. Dùng '
      '<code>.equalsIgnoreCase()</code> khi người dùng tự gõ câu trả lời. Chỉ dành <code>==</code> cho '
      'số, <code>char</code> và <code>boolean</code>.</p>')

    h('Trap 3 — comparing double with ==', 'Bẫy 3 — so sánh double bằng ==')

    code('0.1 + 0.2 is not 0.3', '0.1 + 0.2 không bằng 0.3',
         """double x = 0.1 + 0.2;
System.out.println(x);              // 0.30000000000000004
System.out.println(x == 0.3);       // false

// Compare with a tolerance instead
System.out.println(Math.abs(x - 0.3) < 1e-9);   // true""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', '0.30000000000000004\nfalse\ntrue')

    practice([
        (247, 'Variables, data types and operators', 'Biến, kiểu dữ liệu và toán tử',
         'Casting, precedence and the primitive types — 10 exercises',
         'Ép kiểu, thứ tự ưu tiên và các kiểu nguyên thuỷ — 10 bài'),
    ])

    part(3, 'Reading input and printing output',
         'Đọc dữ liệu vào và in kết quả ra',
         'Scanner, the nextInt trap, printf, String methods, dates',
         'Scanner, cái bẫy nextInt, printf, các hàm chuỗi, ngày tháng')

    p('<p>44 of the 54 assignments read from the keyboard. There is one bug here that catches every '
      'student exactly once, and you should meet it now rather than at 2am.</p>',
      '<p>44 trong 54 bài có đọc dữ liệu từ bàn phím. Ở đây có đúng một lỗi mà sinh viên nào cũng dính '
      'một lần, và bạn nên gặp nó ngay bây giờ thay vì lúc 2 giờ sáng.</p>')

    h('The nextInt / nextLine trap', 'Cái bẫy nextInt / nextLine')

    p('<p><code>nextInt()</code> reads the digits and <strong>leaves the Enter key in the buffer</strong>. '
      'The next <code>nextLine()</code> reads that leftover newline, returns an empty string, and your '
      'program appears to "skip" the question.</p>',
      '<p><code>nextInt()</code> đọc các chữ số và <strong>để lại phím Enter trong bộ đệm</strong>. '
      'Lệnh <code>nextLine()</code> ngay sau đó đọc phải cái xuống dòng thừa này, trả về chuỗi rỗng, và '
      'chương trình của bạn trông như "bỏ qua" câu hỏi.</p>')

    code('The bug, and the fix', 'Lỗi, và cách sửa',
         """Scanner sc = new Scanner(System.in);

System.out.print("Age: ");
int age = sc.nextInt();          // reads 20, leaves "\\n" behind

// System.out.print("Name: ");
// String name = sc.nextLine();  // <- WOULD return "" immediately

sc.nextLine();                   // THE FIX: consume the leftover newline
System.out.print("Name: ");
String name = sc.nextLine();     // now waits properly

System.out.println(age + " / " + name);""",
         kind='fragment')

    p('<p>Two reliable habits, pick one and keep it:</p>',
      '<p>Có hai thói quen an toàn, chọn một và giữ nguyên:</p>')

    ol(['Call <code>sc.nextLine()</code> immediately after every <code>nextInt()</code> / '
        '<code>nextDouble()</code>.',
        '<strong>Never use <code>nextInt()</code> at all.</strong> Read everything with '
        '<code>nextLine()</code> and convert with <code>Integer.parseInt()</code>. This is the approach '
        'used in Part 5, because it also gives you validation for free.'],
       ['Gọi <code>sc.nextLine()</code> ngay sau mỗi lần <code>nextInt()</code> / '
        '<code>nextDouble()</code>.',
        '<strong>Không dùng <code>nextInt()</code> nữa.</strong> Đọc mọi thứ bằng <code>nextLine()</code> '
        'rồi chuyển đổi bằng <code>Integer.parseInt()</code>. Phần 5 dùng cách này, vì nó còn cho bạn '
        'khả năng kiểm tra dữ liệu miễn phí.'])

    h('printf — making the output look like the brief',
      'printf — làm cho kết quả giống hệt trong đề')

    p('<p>30 briefs show an expected screen with aligned columns. <code>println</code> cannot produce '
      'those; <code>printf</code> can. Markers compare your screen against the brief, so this is worth '
      'ten minutes.</p>',
      '<p>30 đề có kèm ảnh màn hình mong đợi với các cột thẳng hàng. <code>println</code> không làm được '
      'điều đó; <code>printf</code> thì có. Người chấm so màn hình của bạn với đề, nên chỗ này đáng bỏ ra '
      'mười phút.</p>')

    code('The five format specifiers you need',
         'Năm ký hiệu định dạng bạn cần',
         """String name = "Nguyen Van A";
double salary = 1234.5;
int id = 7;

System.out.printf("%s%n", name);            // text, then newline
System.out.printf("%d%n", id);              // integer
System.out.printf("%.2f%n", salary);        // 2 decimal places -> 1234.50
System.out.printf("%-15s|%n", name);        // left-aligned in 15 columns
System.out.printf("%10.2f|%n", salary);     // right-aligned in 10 columns

// A table header plus one row, the way the briefs draw it
System.out.printf("%-5s %-20s %10s%n", "ID", "Name", "Salary");
System.out.printf("%-5d %-20s %10.2f%n", id, name, salary);""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        """Nguyen Van A
7
1234.50
Nguyen Van A   |
   1234.50|
ID    Name                     Salary
7     Nguyen Van A            1234.50""")

    p('<p>Use <code>%n</code> rather than <code>\\n</code> — it emits the correct line ending on any '
      'operating system, and it is what the marker sees when they run your project on their machine.</p>',
      '<p>Hãy dùng <code>%n</code> thay cho <code>\\n</code> — nó sinh ra ký tự xuống dòng đúng với mọi '
      'hệ điều hành, và đó là thứ người chấm nhìn thấy khi họ chạy project của bạn trên máy họ.</p>')

    h('Strings — the methods that appear in the briefs',
      'Chuỗi — những phương thức có xuất hiện trong đề')

    code('String operations you will actually use',
         'Các thao tác chuỗi bạn sẽ thật sự dùng',
         """String raw = "  Nguyen Van A  ";

String s = raw.trim();                       // "Nguyen Van A" - ALWAYS trim input
System.out.println("[" + s + "]");
System.out.println(s.length());              // 12
System.out.println(s.toUpperCase());         // NGUYEN VAN A
System.out.println(s.charAt(0));             // N
System.out.println(s.contains("Van"));       // true  - "search by part of name"
System.out.println(s.indexOf("Van"));        // 7
System.out.println(s.substring(7));          // Van A
System.out.println(s.substring(0, 6));       // Nguyen
System.out.println(s.replace(" ", "_"));     // Nguyen_Van_A
System.out.println(String.join("-", "a", "b", "c"));   // a-b-c

String csvLine = "D001,Tran Binh,Cardiology";
String[] parts = csvLine.split(",");         // reading a data file
System.out.println(parts.length + " -> " + parts[1]);

System.out.println(s.isEmpty());             // false
System.out.println("".isEmpty());            // true - the empty-input check""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        """[Nguyen Van A]
12
NGUYEN VAN A
N
true
7
Van A
Nguyen
Nguyen_Van_A
a-b-c
3 -> Tran Binh
false
true""")

    p('<p><strong>Always <code>.trim()</code> what the user types.</strong> A trailing space is '
      'invisible on screen and turns <code>"5"</code> into <code>"5 "</code>, which '
      '<code>Integer.parseInt</code> rejects. Half the mysterious "but I typed it correctly" bugs are '
      'this.</p>',
      '<p><strong>Luôn <code>.trim()</code> thứ người dùng gõ vào.</strong> Một dấu cách thừa ở cuối thì '
      'nhìn trên màn hình không thấy, nhưng nó biến <code>"5"</code> thành <code>"5 "</code>, và '
      '<code>Integer.parseInt</code> sẽ từ chối. Một nửa số lỗi bí ẩn kiểu "nhưng em gõ đúng mà" là do '
      'cái này.</p>')

    h('Dates', 'Ngày tháng')

    p('<p>Seven briefs store a date of birth or a transaction date. Use <code>LocalDate</code> with an '
      'explicit pattern; it parses and validates in one step — <code>32/01/2000</code> throws, which is '
      'exactly the validation you were going to have to write by hand.</p>',
      '<p>Bảy đề có lưu ngày sinh hoặc ngày giao dịch. Hãy dùng <code>LocalDate</code> với một mẫu định '
      'dạng rõ ràng; nó vừa phân tích vừa kiểm tra hợp lệ trong một bước — <code>32/01/2000</code> sẽ ném '
      'lỗi, đúng bằng phần kiểm tra mà bạn định phải tự viết tay.</p>')

    code('Parsing and formatting a dd/MM/yyyy date',
         'Đọc và in ngày theo dạng dd/MM/yyyy',
         """DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy");

LocalDate dob = LocalDate.parse("03/11/2003", fmt);
System.out.println(dob);                   // 2003-11-03  (ISO form)
System.out.println(dob.format(fmt));       // 03/11/2003  (display form)
System.out.println(dob.getYear());         // 2003

try {
    LocalDate.parse("32/01/2000", fmt);    // day 32 does not exist
} catch (DateTimeParseException e) {
    System.out.println("Invalid date");
}""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', '2003-11-03\n03/11/2003\n2003\nInvalid date')

    practice([
        (246, 'Java fundamentals and environment', 'Nền tảng Java và môi trường',
         'Compiling, running, the JDK, your first classes — 10 exercises',
         'Biên dịch, chạy, JDK, những lớp đầu tiên — 10 bài'),
    ])
