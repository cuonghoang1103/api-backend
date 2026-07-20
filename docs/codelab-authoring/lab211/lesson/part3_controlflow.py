# Part 3b — control flow, Math, StringBuilder, wrappers. The gaps the first pass left.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(4, 'Control flow — the four shapes every assignment is built from',
         'Điều khiển luồng — bốn khuôn hình dựng nên mọi bài',
         'if / switch / for / while, and which one to reach for',
         'if / switch / for / while, và khi nào dùng cái nào')

    h('if, switch, for, while — and when to use which',
      'if, switch, for, while — và khi nào dùng cái nào')

    p('<p>You already met a <code>while</code> loop in the menu. These are the rest, and the choice '
      'between them is a defence question worth rehearsing.</p>',
      '<p>Bạn đã gặp vòng <code>while</code> ở phần menu. Đây là phần còn lại, và việc chọn dùng cái nào '
      'là một câu hỏi vấn đáp đáng tập trước.</p>')

    table(['Shape', 'Use when', 'In this track'],
          ['Khuôn hình', 'Dùng khi', 'Trong lộ trình này'],
          [['<code>if / else if / else</code>', 'a few named conditions', 'validation rules'],
           ['<code>switch</code>', 'one value against many fixed options', 'the menu'],
           ['<code>for</code>', 'you know how many times, or you need the index', 'walking an array'],
           ['<code>while</code>', 'you repeat until something becomes true', 'the menu, re-prompting'],
           ['<code>do … while</code>', 'the body must run at least once', 'ask once, then re-ask']],
          [['<code>if / else if / else</code>', 'vài điều kiện có tên rõ ràng', 'các luật kiểm tra dữ liệu'],
           ['<code>switch</code>', 'một giá trị so với nhiều lựa chọn cố định', 'menu'],
           ['<code>for</code>', 'biết trước số lần, hoặc cần chỉ số', 'duyệt mảng'],
           ['<code>while</code>', 'lặp cho tới khi điều gì đó thành đúng', 'menu, hỏi lại khi nhập sai'],
           ['<code>do … while</code>', 'thân vòng lặp phải chạy ít nhất một lần', 'hỏi một lần rồi hỏi lại']])

    code('The four shapes, and the two classic mistakes',
         'Bốn khuôn hình, và hai lỗi kinh điển',
         """int score = 75;

// if / else if / else - order matters, the FIRST true branch wins
if (score >= 80)      System.out.println("Good");
else if (score >= 65) System.out.println("Fair");
else                  System.out.println("Poor");

// switch - note the break; without it execution falls through
int month = 2;
switch (month) {
    case 1: System.out.println("Jan"); break;
    case 2: System.out.println("Feb"); break;
    default: System.out.println("Other");
}

// MISTAKE 1: a semicolon right after for(...) - the body runs zero times
// for (int i = 0; i < 3; i++);  { System.out.println(i); }

// MISTAKE 2: assignment instead of comparison inside if
boolean done = false;
// if (done = true) - always true, and it ASSIGNS. Use == or just `done`.
if (!done) System.out.println("still running");

// do-while: asks first, then decides
int n = 0;
do {
    n++;
} while (n < 3);
System.out.println(n);""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', 'Fair\nFeb\nstill running\n3')

    p('<p><code>break</code> in a <code>switch</code> is not decoration. Leave it out and Java keeps '
      'running into the next case — the bug prints two menu actions for one keypress and is very hard '
      'to see by reading.</p>',
      '<p><code>break</code> trong <code>switch</code> không phải để trang trí. Bỏ nó đi là Java chạy '
      'tiếp sang case kế — lỗi này khiến một lần bấm phím lại thực hiện hai chức năng, và rất khó phát '
      'hiện bằng cách đọc code.</p>')

    h('Math — the methods the briefs need', 'Math — những hàm các đề cần')

    code('Perimeter, area, rounding', 'Chu vi, diện tích, làm tròn',
         """double r = 2.5;
System.out.printf("%.2f%n", Math.PI * r * r);      // circle area
System.out.printf("%.2f%n", 2 * Math.PI * r);      // circumference
System.out.println(Math.sqrt(16));                 // 4.0
System.out.println(Math.pow(2, 10));               // 1024.0
System.out.println(Math.abs(-7));                  // 7
System.out.println(Math.max(3, 9) + " " + Math.min(3, 9));
System.out.println(Math.round(2.567));             // 3
System.out.printf("%.2f%n", Math.round(2.567 * 100) / 100.0);   // 2.57

int random = (int) (Math.random() * 100);          // 0..99, the "generate random" briefs
System.out.println(random >= 0 && random < 100);""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        '19.63\n15.71\n4.0\n1024.0\n7\n9 3\n3\n2.57\ntrue')

    h('StringBuilder — when you build text in a loop',
      'StringBuilder — khi bạn ghép chuỗi trong vòng lặp')

    p('<p><code>String</code> is immutable: <code>s += x</code> inside a loop creates a brand-new string '
      'every pass. For a menu that is irrelevant; for the "large number" and "base conversion" briefs it '
      'is the difference between instant and sluggish — and it is a question examiners like.</p>',
      '<p><code>String</code> là bất biến: <code>s += x</code> trong vòng lặp tạo ra một chuỗi hoàn toàn '
      'mới sau mỗi lượt. Với một cái menu thì không sao; nhưng với bài "số lớn" và "chuyển hệ cơ số" thì '
      'đó là khác biệt giữa tức thì và ì ạch — và giám khảo thích hỏi chỗ này.</p>')

    code('Building a string the right way', 'Ghép chuỗi đúng cách',
         """StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    sb.append(i);
    if (i < 5) sb.append(" -> ");
}
System.out.println(sb.toString());

sb.insert(0, "[");          // used by the base-conversion algorithm
sb.append("]");
System.out.println(sb);
System.out.println(new StringBuilder("abc").reverse());""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật',
        '1 -> 2 -> 3 -> 4 -> 5\n[1 -> 2 -> 3 -> 4 -> 5]\ncba')

    h('Wrapper types, and the trap at 128',
      'Kiểu bao (wrapper), và cái bẫy ở số 128')

    p('<p>A <code>List</code> cannot hold <code>int</code>, only <code>Integer</code>. Java converts '
      'automatically, which is convenient right up to the moment you compare two of them with '
      '<code>==</code>.</p>',
      '<p><code>List</code> không chứa được <code>int</code>, chỉ chứa <code>Integer</code>. Java tự động '
      'chuyển đổi, rất tiện — cho tới lúc bạn so sánh hai đối tượng đó bằng <code>==</code>.</p>')

    code('Why the same comparison is true then false',
         'Vì sao cùng một phép so sánh lúc đúng lúc sai',
         """Integer a = 127, b = 127;
Integer c = 128, d = 128;

System.out.println(a == b);          // true  - cached small values
System.out.println(c == d);          // false - two different objects
System.out.println(c.equals(d));     // true  - compare the VALUE

int raw = c;                         // auto-unboxing back to int
System.out.println(raw == 128);      // true - primitives compare by value""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', 'true\nfalse\ntrue\ntrue')

    p('<p>Java caches <code>Integer</code> objects from −128 to 127, so small numbers appear to work '
      'with <code>==</code> and larger ones do not. <strong>Use <code>.equals()</code> for wrapper '
      'objects, <code>==</code> for primitives.</strong> Same rule as <code>String</code>, same reason.</p>',
      '<p>Java lưu sẵn các đối tượng <code>Integer</code> từ −128 đến 127, nên số nhỏ thì <code>==</code> '
      'có vẻ chạy đúng còn số lớn thì không. <strong>Dùng <code>.equals()</code> cho đối tượng bao, dùng '
      '<code>==</code> cho kiểu nguyên thuỷ.</strong> Cùng quy tắc với <code>String</code>, cùng lý do.</p>')

    practice([
        (247, 'Variables, data types and operators', 'Biến, kiểu dữ liệu và toán tử',
         '10 exercises on types, casting and operator precedence',
         '10 bài về kiểu, ép kiểu và thứ tự ưu tiên toán tử'),
        (248, 'Control flow and methods', 'Điều khiển luồng và phương thức',
         '10 exercises on if / switch / loops and writing methods',
         '10 bài về if / switch / vòng lặp và cách viết hàm'),
    ])
