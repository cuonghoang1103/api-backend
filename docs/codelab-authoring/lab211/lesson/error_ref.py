# Module: the error handbook. Every message here was produced by a real javac /
# java run — none of them are typed from memory.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(1, 'How to read an error before you fix it',
         'Đọc lỗi trước khi sửa lỗi',
         'Every message below came out of a real javac or java run',
         'Mọi thông báo dưới đây đều lấy từ một lần chạy javac hoặc java thật')

    p('<p>Java error messages are unusually good: they name the file, the line, the column with a caret, '
      'and often the exact symbol it could not find. Most of the time the message already contains the '
      'fix — the skill is reading all of it instead of only the first line.</p>'
      '<p>Two families, and you must be able to tell them apart instantly:</p>',
      '<p>Thông báo lỗi của Java tốt một cách khác thường: nó nêu tên tệp, số dòng, dấu mũ chỉ đúng cột, '
      'và thường nêu luôn ký hiệu mà nó không tìm thấy. Phần lớn thời gian thông báo đã chứa sẵn cách sửa '
      '— kỹ năng ở đây là đọc hết nó chứ không chỉ đọc dòng đầu.</p>'
      '<p>Có hai họ lỗi, và bạn phải phân biệt được ngay lập tức:</p>')

    table(['', 'Compile error', 'Runtime error'],
          ['', 'Lỗi biên dịch', 'Lỗi lúc chạy'],
          [['When', 'before the program starts', 'while it is running'],
           ['Looks like', '<code>Filename.java:12: error: …</code>', '<code>Exception in thread "main" …</code>'],
           ['Means', 'the code is not valid Java', 'the code is valid but did something impossible'],
           ['Marker sees', 'nothing — it will not run at all', 'a red stack trace during your demo'],
           ['Cost', 'you cannot submit', 'you lose the validation marks']],
          [['Xảy ra khi', 'trước khi chương trình chạy', 'trong lúc đang chạy'],
           ['Trông như', '<code>TenTep.java:12: error: …</code>', '<code>Exception in thread "main" …</code>'],
           ['Nghĩa là', 'code không phải Java hợp lệ', 'code hợp lệ nhưng làm một việc bất khả thi'],
           ['Người chấm thấy', 'không thấy gì — chương trình không chạy nổi', 'stack trace đỏ ngay giữa buổi demo'],
           ['Cái giá', 'bạn không nộp được bài', 'bạn mất điểm phần kiểm tra dữ liệu']])

    # ── COMPILE ERRORS ────────────────────────────────────────────
    part(2, 'Compile errors', 'Lỗi biên dịch',
         'The nine javac refuses to build, with the message it really prints',
         'Chín lỗi javac từ chối biên dịch, kèm thông báo nó thật sự in ra')

    p('<p>Each block below shows the message <strong>exactly</strong> as <code>javac</code> printed it, '
      'then the cause and the fix.</p>',
      '<p>Mỗi khối dưới đây là thông báo <strong>y nguyên</strong> như <code>javac</code> đã in ra, rồi '
      'đến nguyên nhân và cách sửa.</p>')

    def err(title_en, title_vi, message, cause_en, cause_vi, fix_en, fix_vi):
        out(title_en, title_vi, message, verify=False)
        p(f'<p><strong>Cause.</strong> {cause_en}<br/><strong>Fix.</strong> {fix_en}</p>',
          f'<p><strong>Nguyên nhân.</strong> {cause_vi}<br/><strong>Cách sửa.</strong> {fix_vi}</p>')

    h('cannot find symbol — a class', 'cannot find symbol — một lớp')
    err('javac says', 'javac báo',
        """B.java:1: error: cannot find symbol
        Scanner s = new Scanner(System.in);
        ^
  symbol:   class Scanner
  location: class B""",
        'The class exists but you never imported it. <code>symbol: class Scanner</code> tells you which one.',
        'Lớp đó có tồn tại nhưng bạn chưa import. Dòng <code>symbol: class Scanner</code> nói rõ là lớp nào.',
        'Add <code>import java.util.Scanner;</code> at the top — or in NetBeans press <code>Ctrl+Shift+I</code> to add every missing import at once.',
        'Thêm <code>import java.util.Scanner;</code> ở đầu tệp — hoặc trong NetBeans bấm <code>Ctrl+Shift+I</code> để thêm hết import còn thiếu một lượt.')

    h('cannot find symbol — a variable or method',
      'cannot find symbol — một biến hoặc phương thức')
    err('javac says', 'javac báo',
        """H.java:1: error: cannot find symbol
        String s="x"; s.lenght();
                       ^
  symbol:   method lenght()
  location: variable s of type String""",
        'A typo, or the name is out of scope. Here <code>lenght</code> should be <code>length</code>.',
        'Gõ sai tên, hoặc cái tên đó nằm ngoài phạm vi. Ở đây <code>lenght</code> đáng ra là <code>length</code>.',
        'Read the <code>symbol:</code> line — it prints the name you actually typed. Compare it letter by letter with the one you meant.',
        'Đọc dòng <code>symbol:</code> — nó in ra đúng cái tên bạn đã gõ. So từng chữ với cái tên bạn định viết.')

    h('incompatible types', 'incompatible types')
    err('javac says', 'javac báo',
        """A.java:1: error: incompatible types: String cannot be converted to int
        int x = "5";
                ^

J.java:1: error: incompatible types: void cannot be converted to int
        int x = f();      // where f() is declared void
                 ^""",
        'You assigned a value of one type to a variable of another. The second form is the common one: '
        'calling a method that returns nothing and trying to keep the result.',
        'Bạn gán giá trị kiểu này vào biến kiểu khác. Dạng thứ hai mới hay gặp: gọi một hàm không trả về gì '
        'rồi lại định giữ kết quả.',
        'For text to number use <code>Integer.parseInt(s)</code>. For the void case, change the method to '
        '<code>return</code> a value — or stop assigning it.',
        'Từ chữ sang số thì dùng <code>Integer.parseInt(s)</code>. Với trường hợp void, hãy sửa hàm để nó '
        '<code>return</code> một giá trị — hoặc thôi đừng gán nữa.')

    h("';' expected", "';' expected")
    err('javac says', 'javac báo',
        """D.java:1: error: ';' expected
        int n = 5 }
                 ^""",
        'A missing semicolon, or an unbalanced brace earlier in the file. The caret points at where javac '
        'noticed, which is usually just AFTER the real mistake.',
        'Thiếu dấu chấm phẩy, hoặc lệch dấu ngoặc nhọn ở đâu đó phía trên. Dấu mũ chỉ vào chỗ javac phát '
        'hiện ra, mà chỗ đó thường nằm NGAY SAU lỗi thật.',
        'Look at the line above the one reported. In NetBeans <code>Alt+Shift+F</code> reformats the file — '
        'if the indentation suddenly goes wrong, your missing brace is right there.',
        'Nhìn dòng ngay TRÊN dòng được báo. Trong NetBeans bấm <code>Alt+Shift+F</code> để định dạng lại — '
        'chỗ nào thụt lề đột nhiên sai thì dấu ngoặc thiếu nằm ở đó.')

    h('missing return statement', 'missing return statement')
    err('javac says', 'javac báo',
        """F.java:1: error: missing return statement
        static int f(){ }
                      ^""",
        'A method declared to return something has a path that returns nothing — often an <code>if</code> '
        'with no <code>else</code>.',
        'Một hàm khai báo có trả về nhưng lại tồn tại nhánh không trả về gì — thường là <code>if</code> mà '
        'không có <code>else</code>.',
        'Make sure every branch returns. The usual shape is: return inside the loop when found, and return '
        '<code>null</code> or <code>-1</code> after the loop.',
        'Đảm bảo mọi nhánh đều trả về. Khuôn quen thuộc là: tìm thấy thì return ngay trong vòng lặp, và '
        'return <code>null</code> hoặc <code>-1</code> sau vòng lặp.')

    h('class X is public, should be declared in a file named X.java',
      'class X is public, should be declared in a file named X.java')
    err('javac says', 'javac báo',
        """G.java:1: error: class Wrong is public, should be declared in a file named Wrong.java
        public class Wrong { … }
                     ^""",
        'A public class must live in a file of exactly the same name, including capitals.',
        'Một lớp public bắt buộc phải nằm trong tệp trùng tên y hệt, kể cả chữ hoa chữ thường.',
        'Rename the file or the class. In NetBeans, right-click the class name → Refactor → Rename renames both together.',
        'Đổi tên tệp hoặc tên lớp. Trong NetBeans, chuột phải vào tên lớp → Refactor → Rename để đổi cả hai cùng lúc.')

    h('cannot assign a value to final variable length',
      'cannot assign a value to final variable length')
    err('javac says', 'javac báo',
        """E.java:1: error: cannot assign a value to final variable length
        if (a.length = 1) {}
             ^
E.java:1: error: incompatible types: int cannot be converted to boolean
        if (a.length = 1) {}
                     ^""",
        'You wrote <code>=</code> (assign) where you meant <code>==</code> (compare). Java catches it here '
        'only because the target is final and the result is not a boolean — with a plain <code>int</code> '
        'variable this compiles and silently does the wrong thing.',
        'Bạn viết <code>=</code> (gán) ở chỗ đáng ra phải là <code>==</code> (so sánh). Java bắt được ở đây '
        'chỉ vì đích đến là final và kết quả không phải boolean — với một biến <code>int</code> thường thì '
        'nó biên dịch được và lặng lẽ làm sai.',
        'Inside an <code>if</code>, <code>=</code> is almost always a bug. Read every condition once looking '
        'only for single equals signs.',
        'Bên trong <code>if</code>, dấu <code>=</code> gần như luôn là lỗi. Hãy đọc lại mọi điều kiện một '
        'lượt, chỉ để soi dấu bằng đơn.')

    # ── RUNTIME ERRORS ────────────────────────────────────────────
    part(3, 'Runtime errors', 'Lỗi lúc chạy',
         'The program compiled, then fell over — these are the six you will meet',
         'Chương trình biên dịch xong rồi mới đổ — đây là sáu lỗi bạn sẽ gặp')

    p('<p>These messages were produced by running a program that triggers each one, so they are the exact '
      'text you will see in the NetBeans output window.</p>',
      '<p>Những thông báo này được sinh ra bằng cách chạy một chương trình cố tình kích hoạt từng lỗi, nên '
      'chúng đúng là dòng chữ bạn sẽ thấy trong cửa sổ output của NetBeans.</p>')

    out('The six, as Java prints them', 'Sáu lỗi, đúng như Java in ra',
        """java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 3
java.lang.NullPointerException: Cannot invoke "String.length()" because "<local0>" is null
java.lang.NumberFormatException: For input string: "abc"
java.lang.ArithmeticException: / by zero
java.util.InputMismatchException
java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0""",
        verify=False)

    table(['Exception', 'What it really means', 'The fix in this course'],
          ['Ngoại lệ', 'Thật ra nghĩa là gì', 'Cách sửa trong môn này'],
          [['<code>ArrayIndexOutOfBounds: Index 5 … length 3</code>',
            'the index is past the end — read the two numbers, they tell you by how much',
            'loop to <code>&lt; length</code>, never <code>&lt;=</code>'],
           ['<code>NullPointerException: … because "x" is null</code>',
            'you used something that was never created; modern Java names it for you',
            'a <code>findById</code> returned null and you did not check'],
           ['<code>NumberFormatException: For input string: "abc"</code>',
            'the user typed letters where a number was expected',
            'this is EXPECTED input — catch it and re-prompt'],
           ['<code>ArithmeticException: / by zero</code>',
            'integer division by zero (doubles give Infinity instead)',
            'guard the divisor: an empty list has size 0'],
           ['<code>InputMismatchException</code>',
            '<code>nextInt()</code> met something that is not an int',
            'stop using <code>nextInt()</code>; read lines and parse'],
           ['<code>IndexOutOfBoundsException: Index 0 … length 0</code>',
            'you read from an empty list',
            'check <code>isEmpty()</code> before <code>get(0)</code>']],
          [['<code>ArrayIndexOutOfBounds: Index 5 … length 3</code>',
            'chỉ số vượt quá cuối mảng — đọc hai con số là biết vượt bao nhiêu',
            'lặp tới <code>&lt; length</code>, đừng bao giờ <code>&lt;=</code>'],
           ['<code>NullPointerException: … because "x" is null</code>',
            'bạn dùng một thứ chưa từng được tạo; Java hiện đại nêu tên luôn cho bạn',
            'một hàm <code>findById</code> trả về null mà bạn không kiểm tra'],
           ['<code>NumberFormatException: For input string: "abc"</code>',
            'người dùng gõ chữ vào chỗ cần số',
            'đây là đầu vào ĐƯỢC DỰ ĐOÁN — hãy bắt nó và hỏi lại'],
           ['<code>ArithmeticException: / by zero</code>',
            'chia số nguyên cho 0 (còn double thì ra Infinity)',
            'kiểm tra mẫu số: danh sách rỗng có size bằng 0'],
           ['<code>InputMismatchException</code>',
            '<code>nextInt()</code> gặp thứ không phải số nguyên',
            'thôi dùng <code>nextInt()</code>; hãy đọc theo dòng rồi parse'],
           ['<code>IndexOutOfBoundsException: Index 0 … length 0</code>',
            'bạn đọc từ một danh sách rỗng',
            'kiểm tra <code>isEmpty()</code> trước khi <code>get(0)</code>']])

    part(4, 'The error that only appears sometimes',
         'Lỗi chỉ thỉnh thoảng mới xuất hiện',
         'ConcurrentModificationException, and why your test missed it',
         'ConcurrentModificationException, và vì sao lúc bạn test lại không thấy')

    p('<p>Deleting from a list while a for-each walks it is supposed to throw '
      '<code>ConcurrentModificationException</code>. Sometimes it does not — and the case where it stays '
      'silent is the one most students test with.</p>',
      '<p>Xoá phần tử khỏi danh sách trong lúc for-each đang duyệt thì đáng ra phải ném '
      '<code>ConcurrentModificationException</code>. Có lúc nó không ném — và đúng trường hợp im lặng đó '
      'lại là trường hợp phần lớn sinh viên đem ra thử.</p>')

    code('Same bug, three list sizes', 'Cùng một lỗi, ba kích thước danh sách',
         """import java.util.*;

public class WhenCme {
    public static void main(String[] args) {
        for (int n : new int[]{2, 3, 4}) {
            List<Integer> l = new ArrayList<>();
            for (int i = 1; i <= n; i++) l.add(i);
            try {
                for (Integer x : l) if (x == 1) l.remove(x);
                System.out.println("n=" + n + " -> no error, left " + l);
            } catch (Throwable t) {
                System.out.println("n=" + n + " -> " + t);
            }
        }
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """n=2 -> no error, left [2]
n=3 -> java.util.ConcurrentModificationException
n=4 -> java.util.ConcurrentModificationException""")

    p('<p>With two elements the loop removes the first, the list shrinks to one, and the iterator\'s '
      '<code>hasNext()</code> decides it is finished before it ever notices the change. So the bug passes '
      'a two-item test and fails the moment the marker adds a third record.</p>'
      '<p>This is the strongest argument in this whole handbook for testing with more data than you think '
      'you need.</p>',
      '<p>Với hai phần tử, vòng lặp xoá phần tử đầu, danh sách còn một, và <code>hasNext()</code> của '
      'iterator kết luận là đã duyệt xong trước cả khi kịp phát hiện có thay đổi. Thế là lỗi vượt qua bài '
      'test hai phần tử, rồi hỏng ngay khi người chấm thêm bản ghi thứ ba.</p>'
      '<p>Đây là lập luận mạnh nhất trong cả cuốn sổ tay này cho việc test với nhiều dữ liệu hơn mức bạn '
      'nghĩ là cần.</p>')

    part(5, 'A procedure that always works',
         'Quy trình lúc nào cũng dùng được',
         'What to do in the first sixty seconds after an error appears',
         'Làm gì trong sáu mươi giây đầu sau khi lỗi hiện ra')

    ol(['<strong>Read the whole message, not the first line.</strong> The <code>symbol:</code> and '
        '<code>because "x" is null</code> parts usually name the fix.',
        '<strong>Go to the FIRST <code>at</code> line that mentions your own package.</strong> Anything '
        'with <code>java.</code> or <code>jdk.</code> is the library reporting your mistake, not making one.',
        '<strong>Open that line and read the one above it too.</strong> For syntax errors the real mistake '
        'is usually earlier than the caret.',
        '<strong>Put a breakpoint on that line and run in debug.</strong> Look at the Variables window: in '
        'most cases a parameter is already wrong when it arrives, and the bug is in the caller.',
        '<strong>Fix one thing, then recompile.</strong> Fixing three things at once means you no longer '
        'know which one mattered.',
        '<strong>If it still fails, delete <code>build/</code> and rebuild.</strong> A stale class file can '
        'keep an error alive after you have fixed it.'],
       ['<strong>Đọc hết thông báo, đừng chỉ đọc dòng đầu.</strong> Phần <code>symbol:</code> và phần '
        '<code>because "x" is null</code> thường đã nêu luôn cách sửa.',
        '<strong>Nhảy tới dòng <code>at</code> ĐẦU TIÊN có nhắc tới package của bạn.</strong> Mọi dòng có '
        '<code>java.</code> hay <code>jdk.</code> là thư viện đang báo lỗi của bạn, không phải nó sai.',
        '<strong>Mở dòng đó và đọc luôn dòng ngay trên.</strong> Với lỗi cú pháp, lỗi thật thường nằm '
        'trước vị trí dấu mũ.',
        '<strong>Đặt breakpoint vào dòng đó rồi chạy debug.</strong> Nhìn cửa sổ Variables: phần lớn '
        'trường hợp tham số đã sai ngay khi vừa truyền vào, và lỗi thật nằm ở nơi gọi.',
        '<strong>Sửa một thứ rồi biên dịch lại.</strong> Sửa ba thứ cùng lúc thì bạn không còn biết thứ '
        'nào mới là nguyên nhân.',
        '<strong>Nếu vẫn hỏng, xoá <code>build/</code> rồi build lại.</strong> Một tệp .class cũ còn sót '
        'có thể giữ lỗi sống dai sau khi bạn đã sửa xong.'])

    practice([
        (246, 'Java fundamentals and environment', 'Nền tảng Java và môi trường',
         'Compiling and running from scratch — where most of these errors come from',
         'Biên dịch và chạy từ đầu — nơi phần lớn các lỗi này sinh ra'),
        (252, 'Exception handling, I/O and generics', 'Xử lý ngoại lệ, I/O và generic',
         'Turning the runtime errors above into handled cases',
         'Biến các lỗi lúc chạy ở trên thành những tình huống đã xử lý'),
    ])
