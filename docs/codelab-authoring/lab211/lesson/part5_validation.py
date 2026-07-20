# Part 5 — validation and exceptions: 20 briefs each.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(6, 'Input validation and exceptions',
         'Kiểm tra dữ liệu đầu vào và ngoại lệ',
         'Demanded by 20 briefs, tested by every marker without exception',
         '20 đề yêu cầu, và người chấm nào cũng thử — không trừ ai')

    p('<p>20 briefs demand it explicitly, and every marker tests it whether the brief says so or not. '
      'The test is always the same: they type <code>abc</code> where a number belongs, then a negative '
      'number, then just press Enter. If any of those produces a stack trace, you lose the mark on the '
      'spot.</p>'
      '<p>The rule that makes this easy: <strong>a validated read never returns until the value is '
      'good.</strong> Loop inside the reader, not around the caller.</p>',
      '<p>20 đề yêu cầu rõ ràng, và người chấm nào cũng thử — dù đề có ghi hay không. Bài kiểm tra luôn '
      'giống nhau: họ gõ <code>abc</code> vào chỗ cần số, rồi gõ số âm, rồi bấm thẳng Enter. Nếu một '
      'trong ba thứ đó làm văng stack trace, bạn mất điểm ngay tại chỗ.</p>'
      '<p>Quy tắc làm cho việc này trở nên dễ: <strong>một hàm đọc-có-kiểm-tra thì không trả về cho tới '
      'khi giá trị hợp lệ.</strong> Vòng lặp nằm bên trong hàm đọc, không nằm ở nơi gọi.</p>')

    mermaid("""flowchart TD
    A[Ask the user] --> B[Read a whole line]
    B --> C{Is it empty}
    C -->|yes| D[Say the field is required] --> A
    C -->|no| E{Does it parse}
    E -->|no| F[Say it must be a number] --> A
    E -->|yes| G{Is it in range}
    G -->|no| H[Say the allowed range] --> A
    G -->|yes| I[Return the value]""")

    h('A reusable Validation class', 'Một lớp Validation dùng lại được')

    p('<p>Write this once, drop it into every assignment. Notice that each method loops until it has '
      'something valid, so calling code stays clean — no <code>try</code> blocks scattered through your '
      'menu.</p>',
      '<p>Viết một lần, mang sang mọi bài. Để ý mỗi phương thức đều lặp cho tới khi có giá trị hợp lệ, '
      'nên phần code gọi nó rất gọn — không có khối <code>try</code> nào rải rác trong menu.</p>')

    code('Validation.java — the workhorse of this track',
         'Validation.java — lớp làm việc chính của cả lộ trình',
         """import java.util.Scanner;

public class Validation {

    private static final Scanner SC = new Scanner(System.in);

    /** Non-empty text. Re-asks until the user types something. */
    public static String readNonEmpty(String prompt) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim();
            if (!s.isEmpty()) {
                return s;
            }
            System.out.println("This field is required.");
        }
    }

    /** An int inside [min, max]. Rejects letters, empty input and out-of-range. */
    public static int readInt(String prompt, int min, int max) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim();
            try {
                int value = Integer.parseInt(s);
                if (value < min || value > max) {
                    System.out.println("Please enter a number between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a digit.");
            }
        }
    }

    /** A double that must be strictly greater than zero — salary, price, area. */
    public static double readPositiveDouble(String prompt) {
        while (true) {
            System.out.print(prompt);
            String s = SC.nextLine().trim();
            try {
                double value = Double.parseDouble(s);
                if (value <= 0) {
                    System.out.println("Value must be greater than zero.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a digit.");
            }
        }
    }

    /** Text that must match a pattern — ids, phone numbers, emails. */
    public static String readPattern(String prompt, String regex, String hint) {
        while (true) {
            String s = readNonEmpty(prompt);
            if (s.matches(regex)) {
                return s;
            }
            System.out.println(hint);
        }
    }

    /** A yes/no question. Returns true for y/Y. */
    public static boolean confirm(String prompt) {
        while (true) {
            String s = readNonEmpty(prompt + " (Y/N): ");
            if (s.equalsIgnoreCase("y")) return true;
            if (s.equalsIgnoreCase("n")) return false;
            System.out.println("Please answer Y or N.");
        }
    }
}""")

    p('<p>Using it turns a fragile 20-line block into four readable lines:</p>',
      '<p>Dùng nó biến một khối 20 dòng mong manh thành bốn dòng dễ đọc:</p>')

    code('How the caller looks afterwards', 'Nơi gọi trông như thế nào sau đó',
         """String id     = Validation.readPattern("ID (D + 3 digits): ", "D\\\\d{3}", "Format must be D001.");
String name   = Validation.readNonEmpty("Name: ");
double salary = Validation.readPositiveDouble("Salary: ");
int    age    = Validation.readInt("Age: ", 18, 65);
System.out.println(id + " " + name + " " + salary + " " + age);""",
         kind='fragment', deps=['Validation'])

    out('What the marker sees when they attack it',
        'Người chấm nhìn thấy gì khi họ thử phá',
        """Salary: abc
You must input a digit.
Salary: -2000
Value must be greater than zero.
Salary: 2000
""", verify=False)

    h('Regular expressions you can actually justify',
      'Biểu thức chính quy mà bạn giải thích được')

    p('<p>Use these four and no more. If you cannot explain a pattern in the defence, do not use it — '
      'a hand-written check you understand beats a clever regex you copied.</p>',
      '<p>Chỉ dùng bốn mẫu này, không cần hơn. Nếu bạn không giải thích được một mẫu lúc vấn đáp thì đừng '
      'dùng nó — một đoạn kiểm tra tự viết mà bạn hiểu vẫn hơn một regex thông minh mà bạn chép.</p>')

    table(['Pattern', 'Means', 'Matches'],
          ['Mẫu', 'Nghĩa là', 'Khớp với'],
          [['<code>\\\\d+</code>', 'one or more digits', '<code>7</code>, <code>2003</code>'],
           ['<code>D\\\\d{3}</code>', 'letter D then exactly 3 digits', '<code>D001</code>'],
           ['<code>0\\\\d{9}</code>', '0 then 9 digits — a phone number', '<code>0912345678</code>'],
           ['<code>[A-Za-z ]+</code>', 'letters and spaces only — a person name', '<code>Tran Binh</code>']],
          [['<code>\\\\d+</code>', 'một hoặc nhiều chữ số', '<code>7</code>, <code>2003</code>'],
           ['<code>D\\\\d{3}</code>', 'chữ D rồi đúng 3 chữ số', '<code>D001</code>'],
           ['<code>0\\\\d{9}</code>', 'số 0 rồi 9 chữ số — số điện thoại', '<code>0912345678</code>'],
           ['<code>[A-Za-z ]+</code>', 'chỉ chữ cái và dấu cách — tên người', '<code>Tran Binh</code>']])

    p('<p>In Java source a backslash must itself be escaped, so the pattern <code>\\d{3}</code> is '
      'written <code>"\\\\d{3}"</code> in a string literal. Forgetting the second backslash is a compile '
      'error, which is at least honest about it.</p>',
      '<p>Trong mã nguồn Java, dấu gạch chéo ngược phải được escape thêm một lần, nên mẫu '
      '<code>\\d{3}</code> phải viết là <code>"\\\\d{3}"</code> trong chuỗi. Quên gạch chéo thứ hai là '
      'lỗi biên dịch, ít nhất thì nó báo cho bạn biết ngay.</p>')

    h('Exceptions — what they are and where to catch them',
      'Ngoại lệ — là gì và bắt ở đâu')

    p('<p>An exception is Java telling you "I cannot continue on this path". You will meet exactly four '
      'in this track.</p>',
      '<p>Ngoại lệ là cách Java nói với bạn "tôi không đi tiếp được theo hướng này". Trong cả lộ trình bạn '
      'sẽ gặp đúng bốn loại.</p>')

    table(['Exception', 'Thrown when', 'Where you handle it'],
          ['Ngoại lệ', 'Ném ra khi', 'Xử lý ở đâu'],
          [['<code>NumberFormatException</code>', 'text is not a number', 'inside the validated reader'],
           ['<code>InputMismatchException</code>', '<code>nextInt()</code> meets a letter',
            'avoid it — read lines instead'],
           ['<code>IndexOutOfBoundsException</code>', 'index &lt; 0 or ≥ size', 'fix the loop bound; do not catch'],
           ['<code>NullPointerException</code>', 'you used something that was never created',
            'fix the cause; do not catch'],
           ['<code>IOException</code> / <code>FileNotFoundException</code>', 'the file is missing or unreadable',
            'around the file read, with a friendly message']],
          [['<code>NumberFormatException</code>', 'văn bản không phải là số', 'trong hàm đọc-có-kiểm-tra'],
           ['<code>InputMismatchException</code>', '<code>nextInt()</code> gặp chữ cái',
            'tránh hẳn — hãy đọc theo dòng'],
           ['<code>IndexOutOfBoundsException</code>', 'chỉ số &lt; 0 hoặc ≥ size', 'sửa cận vòng lặp; đừng bắt'],
           ['<code>NullPointerException</code>', 'bạn dùng một thứ chưa từng được tạo',
            'sửa nguyên nhân; đừng bắt'],
           ['<code>IOException</code> / <code>FileNotFoundException</code>', 'tệp không tồn tại hoặc không đọc được',
            'bọc quanh chỗ đọc tệp, kèm thông báo thân thiện']])

    p('<p><strong>Catch what you can recover from; fix everything else.</strong> A '
      '<code>NullPointerException</code> is a bug in your code, not an event — wrapping it in '
      '<code>try/catch</code> hides the bug and the examiner will ask why the program silently does '
      'nothing.</p>'
      '<p>And never write an empty catch block. It is the one thing guaranteed to be asked about.</p>',
      '<p><strong>Bắt những gì bạn có thể phục hồi; còn lại thì sửa.</strong> '
      '<code>NullPointerException</code> là lỗi trong code của bạn, không phải một sự kiện — bọc nó vào '
      '<code>try/catch</code> chỉ giấu lỗi đi, và giám khảo sẽ hỏi vì sao chương trình im lặng không làm '
      'gì cả.</p>'
      '<p>Và tuyệt đối đừng viết khối catch rỗng. Đó là thứ chắc chắn sẽ bị hỏi.</p>')

    code('The wrong way and the right way', 'Cách sai và cách đúng',
         """// WRONG - the error vanishes, the program limps on with bad data
try {
    int n = Integer.parseInt("abc");
    System.out.println(n);
} catch (NumberFormatException e) {
}

// RIGHT - say what happened, in words the user understands
try {
    int n = Integer.parseInt("abc");
    System.out.println(n);
} catch (NumberFormatException e) {
    System.out.println("You must input a digit.");
}""",
         kind='fragment')

    h('throw — when the brief asks for it', 'throw — khi đề bài yêu cầu')

    p('<p>Several briefs say things like <em>Exception("Salary is greater than zero")</em>. That means '
      'the method should refuse the bad value by throwing, and the caller decides what to tell the '
      'user. This separation — the model detects, the interface reports — is exactly what Part 10 is '
      'about.</p>',
      '<p>Vài đề viết kiểu <em>Exception("Salary is greater than zero")</em>. Nghĩa là phương thức phải '
      'từ chối giá trị sai bằng cách ném ngoại lệ, còn nơi gọi mới quyết định nói gì với người dùng. Sự '
      'tách bạch này — tầng dữ liệu phát hiện, tầng giao diện thông báo — chính là nội dung Phần 10.</p>')

    code('Throwing from the model, reporting at the surface',
         'Ném từ tầng dữ liệu, thông báo ở tầng giao diện',
         """class Person {
    private double salary;

    public void setSalary(double salary) {
        if (salary <= 0) {
            throw new IllegalArgumentException("Salary is greater than zero");
        }
        this.salary = salary;
    }

    public double getSalary() {
        return salary;
    }
}

public class ThrowDemo {
    public static void main(String[] args) {
        Person p = new Person();
        try {
            p.setSalary(-2000);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
        p.setSalary(2000);
        System.out.println(p.getSalary());
    }
}""")

    out('Real output', 'Kết quả chạy thật', 'Salary is greater than zero\n2000.0')

    practice([
        (252, 'Exception handling, I/O and generics', 'Xử lý ngoại lệ, I/O và generic',
         'try / catch / throw, custom exceptions — 10 exercises',
         'try / catch / throw, ngoại lệ tự định nghĩa — 10 bài'),
        ('generic-configuration-file-validator',
         'Exercise: a validator you can reuse', 'Bài tập: bộ kiểm tra dùng lại được',
         'The same idea as the Validation class above, graded',
         'Cùng ý tưởng với lớp Validation ở trên, có chấm điểm'),
    ])
