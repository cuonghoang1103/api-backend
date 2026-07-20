# Batch 2 — J1.S.P0062 (path analyser) and J1.S.P0064 (format checker).
from solkit import solution

# ════════════════════════════════════════════════════════════════
# J1.S.P0062 — Analyse a file path (26 LOC)
# ════════════════════════════════════════════════════════════════

P0062_ENTITY = r'''package entity;

/**
 * One Windows file path, taken apart.
 *
 * The path is parsed ONCE in the constructor and the five getters just report
 * what was found. The alternative — re-parsing inside every getter — would run
 * the same indexOf five times and would let the five answers disagree if the
 * path were ever changed.
 */
public class FilePath {

    private final String fullPath;
    private final String disk;
    private final String path;
    private final String fileName;
    private final String extension;
    private final String[] folders;

    public FilePath(String fullPath) {
        this.fullPath = fullPath.trim();

        // Everything before the FIRST separator is the drive: "C:"
        int firstSlash = this.fullPath.indexOf('\\');
        this.disk = firstSlash < 0 ? this.fullPath : this.fullPath.substring(0, firstSlash);

        // Everything before the LAST separator is the folder path.
        int lastSlash = this.fullPath.lastIndexOf('\\');
        this.path = lastSlash < 0 ? "" : this.fullPath.substring(0, lastSlash);

        // The file name sits after the last separator; the extension after the
        // last dot INSIDE it - a dot in a folder name must not be mistaken for one.
        String nameWithExt = lastSlash < 0 ? this.fullPath : this.fullPath.substring(lastSlash + 1);
        int lastDot = nameWithExt.lastIndexOf('.');
        this.fileName = lastDot < 0 ? nameWithExt : nameWithExt.substring(0, lastDot);
        this.extension = lastDot < 0 ? "" : nameWithExt.substring(lastDot + 1);

        // The folders are what lies between the drive and the file name.
        if (lastSlash < 0 || firstSlash < 0 || lastSlash <= firstSlash) {
            this.folders = new String[0];
        } else {
            this.folders = this.fullPath.substring(firstSlash + 1, lastSlash).split("\\\\");
        }
    }

    /** Required: public String getPath() - folder path without the file name. */
    public String getPath() {
        return path;
    }

    /** Required: public String getFileName() - name without the extension. */
    public String getFileName() {
        return fileName;
    }

    /** Required: public String getExtension() */
    public String getExtension() {
        return extension;
    }

    /** Required: public String getDisk() */
    public String getDisk() {
        return disk;
    }

    /** Required: public String[] getFolders() */
    public String[] getFolders() {
        return folders;
    }

    public String getFullPath() {
        return fullPath;
    }
}
'''

P0062_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /** Non-empty text. Loops until the user types something. */
    public static String getNonEmpty(String message, String error) {
        while (true) {
            System.out.println(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''

P0062_MAIN = '''package ui;

import entity.FilePath;
import java.util.Arrays;
import utils.Validator;

/** Screen only: read the path, print the five answers. */
public class Main {

    public static void main(String[] args) {
        System.out.println("===== Analysis Path Program =====");

        String input = Validator.getNonEmpty("Please input Path:", "Path must not be empty.");
        FilePath filePath = new FilePath(input);

        System.out.println("----- Result Analysis -----");
        System.out.println("Disk: " + filePath.getDisk());
        System.out.println("Extension: " + filePath.getExtension());
        System.out.println("File Name: " + filePath.getFileName());
        System.out.println("Path: " + filePath.getPath());
        System.out.println("Folders: " + Arrays.toString(filePath.getFolders()));
    }
}
'''

solution(
    'J1.S.P0062',
    title_vi='Phân tích đường dẫn tệp',
    files=[('src/entity/FilePath.java', P0062_ENTITY),
           ('src/utils/Validator.java', P0062_VALIDATOR),
           ('src/ui/Main.java', P0062_MAIN)],
    main_class='ui.Main',
    runs=[
        ('C:\\Windows\\test.txt\n',
         '===== Analysis Path Program =====\nPlease input Path:\n'
         '----- Result Analysis -----\nDisk: C:\nExtension: txt\nFile Name: test\n'
         'Path: C:\\Windows\nFolders: [Windows]'),
        # a dot in a folder name and a dot inside the file name
        ('D:\\Data\\Java\\Lab211\\report.final.docx\n',
         '===== Analysis Path Program =====\nPlease input Path:\n'
         '----- Result Analysis -----\nDisk: D:\nExtension: docx\nFile Name: report.final\n'
         'Path: D:\\Data\\Java\\Lab211\nFolders: [Data, Java, Lab211]'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Five pieces of information out of
one string, using nothing but <code>indexOf</code>, <code>lastIndexOf</code>, <code>substring</code>
and <code>split</code> — the brief says so explicitly. No regex, no <code>File</code> class.</p>
<p><strong>The one idea that makes it easy.</strong> First versus last. The drive ends at the
<em>first</em> separator; the folder path ends at the <em>last</em> one. Get those two positions and
every answer falls out of them:</p>
<ul>
<li><code>disk</code> = everything before the first <code>\\</code></li>
<li><code>path</code> = everything before the last <code>\\</code></li>
<li>name + extension = everything after the last <code>\\</code></li>
<li><code>folders</code> = what lies between the two, split on <code>\\</code></li>
</ul>
<p><strong>Why the extension uses lastIndexOf on the NAME, not the path.</strong> Search the whole
path for a dot and <code>D:\\my.data\\report.docx</code> would find the dot in the folder name.
Splitting the file name off first makes that impossible. The second test run in this solution is
exactly that case — <code>report.final.docx</code> must give extension <code>docx</code> and name
<code>report.final</code>, not <code>report</code>.</p>
<p><strong>Why parse in the constructor.</strong> Each getter returns a field that was computed once.
Re-parsing inside every getter would repeat the same work five times and, worse, would let two
getters disagree. An examiner who asks "what if I call getPath twice" is asking about exactly this.</p>
<p><strong>The escaping.</strong> A backslash is written <code>'\\\\'</code> in a Java char literal
and <code>"\\\\\\\\"</code> in a regex string, because <code>split</code> takes a regular expression
and a backslash must be escaped twice — once for Java, once for the regex engine.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Rút năm mẩu thông tin ra từ một chuỗi, chỉ được
dùng <code>indexOf</code>, <code>lastIndexOf</code>, <code>substring</code> và <code>split</code> —
đề ghi rõ như vậy. Không regex, không dùng lớp <code>File</code>.</p>
<p><strong>Một ý tưởng làm mọi thứ trở nên dễ.</strong> Đầu tiên và cuối cùng. Ổ đĩa kết thúc ở dấu
phân cách <em>đầu tiên</em>; đường dẫn thư mục kết thúc ở dấu <em>cuối cùng</em>. Có hai vị trí đó thì
mọi câu trả lời đều rơi ra:</p>
<ul>
<li><code>disk</code> = phần trước dấu <code>\\</code> đầu tiên</li>
<li><code>path</code> = phần trước dấu <code>\\</code> cuối cùng</li>
<li>tên + phần mở rộng = phần sau dấu <code>\\</code> cuối cùng</li>
<li><code>folders</code> = phần nằm giữa hai vị trí đó, tách theo <code>\\</code></li>
</ul>
<p><strong>Vì sao tìm phần mở rộng trên TÊN FILE chứ không trên cả đường dẫn.</strong> Nếu tìm dấu
chấm trên toàn bộ đường dẫn thì <code>D:\\my.data\\report.docx</code> sẽ dính dấu chấm trong tên thư
mục. Tách tên file ra trước khiến chuyện đó không thể xảy ra. Kịch bản chạy thứ hai trong lời giải này
đúng là trường hợp đó — <code>report.final.docx</code> phải cho phần mở rộng <code>docx</code> và tên
<code>report.final</code>, chứ không phải <code>report</code>.</p>
<p><strong>Vì sao phân tích ngay trong constructor.</strong> Mỗi getter chỉ trả về một trường đã được
tính một lần. Phân tích lại trong từng getter sẽ lặp cùng một việc năm lần, và tệ hơn là có thể khiến
hai getter cho kết quả mâu thuẫn. Giám khảo hỏi "gọi getPath hai lần thì sao" chính là đang hỏi điều
này.</p>
<p><strong>Chuyện escape.</strong> Dấu gạch chéo ngược viết là <code>'\\\\'</code> trong hằng ký tự
Java, và <code>"\\\\\\\\"</code> trong chuỗi regex, vì <code>split</code> nhận vào một biểu thức chính
quy nên dấu này phải escape hai lần — một lần cho Java, một lần cho bộ regex.</p>''',
    hints_en=[
        'Find the position of the first backslash and the last backslash before anything else. Everything else is a substring between them.',
        'Take the file name off the path FIRST, then look for the dot inside it.',
        'split() takes a regex, so splitting on a backslash needs four backslashes in the Java string.',
        'Arrays.toString gives you the [Windows] format the brief prints.',
    ],
    hints_vi=[
        'Tìm vị trí dấu gạch chéo ngược đầu tiên và cuối cùng trước đã. Mọi thứ còn lại chỉ là substring giữa hai vị trí đó.',
        'Tách tên file ra khỏi đường dẫn TRƯỚC, rồi mới tìm dấu chấm bên trong nó.',
        'split() nhận biểu thức chính quy, nên tách theo dấu gạch chéo ngược cần bốn dấu trong chuỗi Java.',
        'Arrays.toString cho ra đúng dạng [Windows] mà đề in ra.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0064 — Check data format (30 LOC)
# ════════════════════════════════════════════════════════════════

P0064_VALIDATOR = r'''package utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * The three format checks the brief names.
 *
 * Each returns the ERROR MESSAGE, or an empty string when the value is fine.
 * That is the contract the brief specifies, and it keeps the checks free of any
 * printing: the ui layer decides what to show and when to ask again.
 */
public class FormatValidator {

    private static final String PHONE_DIGITS = "\\d+";
    private static final String EMAIL_PATTERN = "^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$";

    /** Required: public String checkPhone(String phone) */
    public String checkPhone(String phone) {
        String value = phone == null ? "" : phone.trim();
        if (!value.matches(PHONE_DIGITS)) {
            return "Phone number must be number";
        }
        if (value.length() != 10) {
            return "Phone number must be 10 digits";
        }
        return "";
    }

    /** Required: public String checkEmail(String email) */
    public String checkEmail(String email) {
        String value = email == null ? "" : email.trim();
        if (!value.matches(EMAIL_PATTERN)) {
            return "Email must be correct format";
        }
        return "";
    }

    /**
     * Required: public String checkDate(String date)
     *
     * setLenient(false) is not optional. Left lenient, SimpleDateFormat happily
     * turns 31/02/2015 into 3 March - it rolls the extra days over instead of
     * refusing. The check would pass and the stored date would be wrong.
     */
    public String checkDate(String date) {
        String value = date == null ? "" : date.trim();
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
        formatter.setLenient(false);
        try {
            formatter.parse(value);
            return "";
        } catch (ParseException e) {
            return "Date to correct format(dd/MM/yyyy)";
        }
    }
}
'''

P0064_INPUT = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class InputHelper {

    private static final Scanner SCANNER = new Scanner(System.in);

    private InputHelper() {
    }

    public static String getLine(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }
}
'''

P0064_MAIN = '''package ui;

import utils.FormatValidator;
import utils.InputHelper;
import java.util.function.Function;

/**
 * Screen and flow. The retry loop lives here because "ask again" is a
 * user-interface decision — the checks themselves only report.
 */
public class Main {

    public static void main(String[] args) {
        FormatValidator validator = new FormatValidator();

        System.out.println("====== Validate Progaram ======");

        String phone = askUntilValid("Phone number:", validator::checkPhone);
        String email = askUntilValid("Email:", validator::checkEmail);
        String date = askUntilValid("Date:", validator::checkDate);

        System.out.println("----- Result -----");
        System.out.println("Phone number: " + phone);
        System.out.println("Email: " + email);
        System.out.println("Date: " + date);
    }

    /**
     * Asks until the checker returns an empty message. One loop serves all three
     * fields, because all three checkers have the same shape.
     */
    private static String askUntilValid(String prompt, Function<String, String> check) {
        while (true) {
            String value = InputHelper.getLine(prompt);
            String error = check.apply(value);
            if (error.isEmpty()) {
                return value;
            }
            System.out.println(error);
        }
    }
}
'''

solution(
    'J1.S.P0064',
    title_vi='Kiểm tra định dạng số điện thoại, email và ngày',
    files=[('src/utils/FormatValidator.java', P0064_VALIDATOR),
           ('src/utils/InputHelper.java', P0064_INPUT),
           ('src/ui/Main.java', P0064_MAIN)],
    main_class='ui.Main',
    runs=[
        # the brief's own screen: short phone, letters, then valid; bad email; bad date
        ('099999888\nabc\n0999998888\n'
         'abc\nnghianv@ftico.com\n'
         'abc\n15/06/2015\n',
         '====== Validate Progaram ======\n'
         'Phone number:Phone number must be 10 digits\n'
         'Phone number:Phone number must be number\n'
         'Phone number:Email:Email must be correct format\n'
         'Email:Date:Date to correct format(dd/MM/yyyy)\n'
         'Date:----- Result -----\n'
         'Phone number: 0999998888\nEmail: nghianv@ftico.com\nDate: 15/06/2015'),
        # the date that lenient parsing would have accepted
        ('0999998888\na@b.com\n31/02/2015\n15/06/2015\n',
         '====== Validate Progaram ======\n'
         'Phone number:Email:Date:Date to correct format(dd/MM/yyyy)\n'
         'Date:----- Result -----\n'
         'Phone number: 0999998888\nEmail: a@b.com\nDate: 15/06/2015'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Three checks, each with a
signature the brief dictates: <code>public String checkPhone(String)</code>,
<code>checkEmail</code>, <code>checkDate</code>. Note the return type — they return the <em>error
message</em>, or an empty string when the value is good. They do not print and they do not loop.</p>
<p><strong>Why that return type is the whole design.</strong> Because a checker returns text instead
of printing it, one loop in <code>Main</code> can drive all three fields:
<code>askUntilValid(prompt, checker)</code>. Had the checks printed their own errors you would need
three nearly identical loops, and changing the wording would mean editing three places.</p>
<p><strong>Order inside checkPhone matters.</strong> "Is it digits" is tested before "is it 10 long".
Reverse them and <code>abc</code> — which is 3 characters — reports <em>must be 10 digits</em>, which
is true but useless: the real problem is that it is not a number at all.</p>
<p><strong>setLenient(false) is mandatory, not tidiness.</strong> A lenient
<code>SimpleDateFormat</code> accepts <code>31/02/2015</code> and silently rolls it forward to 3
March. Your validation would pass and the date stored would not be the one typed. The second test run
in this solution exists only to prove that <code>31/02/2015</code> is rejected.</p>
<p><strong>The email pattern, in words you can say out loud.</strong>
<code>^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$</code> — one or more letters, digits, dots, plus or minus; an
<code>@</code>; a host; then <strong>at least one</strong> dot-and-more, which is what stops
<code>a@b</code> from passing. Never use a pattern you cannot explain; a simpler one you understand is
worth more marks.</p>
<p><strong>A discrepancy in the brief, worth mentioning to your examiner.</strong> The expected-screen
picture prints <em>Phone number must is number</em> and <em>Email must is correct format</em>, while
the Guidelines section specifies <em>Phone number must be number</em> and <em>Email must be correct
format</em>. The Guidelines are the contract, so this solution uses those. Noticing it is a point in
your favour.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Ba phép kiểm tra, mỗi cái có chữ ký do đề áp
đặt: <code>public String checkPhone(String)</code>, <code>checkEmail</code>, <code>checkDate</code>.
Hãy để ý kiểu trả về — chúng trả về <em>thông điệp lỗi</em>, hoặc chuỗi rỗng khi giá trị hợp lệ. Chúng
không in ra và không lặp.</p>
<p><strong>Chính kiểu trả về đó là toàn bộ thiết kế.</strong> Vì hàm kiểm tra trả về chuỗi thay vì in
ra, nên chỉ một vòng lặp trong <code>Main</code> có thể điều khiển cả ba trường:
<code>askUntilValid(prompt, checker)</code>. Nếu các hàm kiểm tra tự in lỗi thì bạn sẽ cần ba vòng lặp
gần như giống hệt nhau, và đổi câu chữ là phải sửa ba chỗ.</p>
<p><strong>Thứ tự bên trong checkPhone rất quan trọng.</strong> Kiểm "có phải toàn chữ số không" trước
khi kiểm "có đủ 10 ký tự không". Đảo lại thì <code>abc</code> — dài 3 ký tự — sẽ báo <em>must be 10
digits</em>, đúng nhưng vô dụng: vấn đề thật là nó không phải số.</p>
<p><strong><code>setLenient(false)</code> là bắt buộc, không phải cho gọn.</strong> Ở chế độ dễ dãi,
<code>SimpleDateFormat</code> chấp nhận <code>31/02/2015</code> rồi lặng lẽ đẩy thành ngày 3 tháng 3.
Phần kiểm tra của bạn vẫn báo hợp lệ còn ngày được lưu thì không phải ngày người ta gõ. Kịch bản chạy
thứ hai trong lời giải này sinh ra chỉ để chứng minh <code>31/02/2015</code> bị từ chối.</p>
<p><strong>Mẫu email, diễn đạt bằng lời để nói ra được.</strong>
<code>^[\\w.+-]+@[\\w-]+(\\.[\\w-]+)+$</code> — một hoặc nhiều chữ cái, chữ số, dấu chấm, cộng hoặc
trừ; một dấu <code>@</code>; một tên máy chủ; rồi <strong>ít nhất một</strong> cụm chấm-và-chữ, và
chính cụm này chặn <code>a@b</code> lọt qua. Đừng bao giờ dùng mẫu mà bạn không giải thích được; một
mẫu đơn giản hơn mà bạn hiểu thì được nhiều điểm hơn.</p>
<p><strong>Một điểm vênh trong đề, đáng nói với giám khảo.</strong> Ảnh màn hình mong đợi in
<em>Phone number must is number</em> và <em>Email must is correct format</em>, trong khi mục Guidelines
ghi <em>Phone number must be number</em> và <em>Email must be correct format</em>. Guidelines mới là
hợp đồng, nên lời giải này dùng theo đó. Việc bạn phát hiện ra là một điểm cộng.</p>''',
    hints_en=[
        'The three methods return a String error message, not boolean and not void. Read the signature in the brief again.',
        'Check "is it a number" before "is it 10 digits" — otherwise the message for abc is misleading.',
        'SimpleDateFormat needs setLenient(false), or 31/02 is accepted and rolled to 3 March.',
        'Write one askUntilValid loop and pass the checker to it, instead of three copies of the same loop.',
    ],
    hints_vi=[
        'Ba phương thức trả về chuỗi thông điệp lỗi, không phải boolean và không phải void. Hãy đọc lại chữ ký trong đề.',
        'Kiểm "có phải số không" trước "có đủ 10 chữ số không" — nếu không thì thông báo cho abc sẽ gây hiểu nhầm.',
        'SimpleDateFormat phải gọi setLenient(false), nếu không 31/02 sẽ được chấp nhận và bị đẩy thành ngày 3/3.',
        'Viết một vòng lặp askUntilValid rồi truyền hàm kiểm tra vào, thay vì chép ba lần cùng một vòng lặp.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI2 = {
 'J1.S.P0062': r'''<p><strong>Short Assignment · J1.S.P0062 · 26 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình nhận vào một đường dẫn tới tệp và trả về các thông tin sau:</p>
<ul>
<li>Ổ đĩa (disk driver)</li>
<li>Tên tệp (file name)</li>
<li>Phần mở rộng (file extension)</li>
<li>Tên các thư mục (folders name)</li>
<li>Đường dẫn tới thư mục chứa tệp (path to file folder)</li>
</ul>
<p>In các thông tin đó ra màn hình.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình hiển thị: ổ đĩa, đường dẫn thư mục, phần mở rộng, tên tệp.</li>
<li>In ra màn hình rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>===== Analysis Path Program =====
Please input Path:
C:\Windows\test.txt
----- Result Analysis -----
Disk: C:
Extension: txt
File Name: test
Path: C:\Windows
Folders: [Windows]</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>getPath</code>, <code>getFileName</code>,
<code>getExtension</code>, <code>getDisk</code>, <code>getFolders</code>.</p>
<p>Gợi ý: dùng các hàm <code>lastIndexOf</code>, <code>indexOf</code>, <code>substring</code>,
<code>split</code> của lớp String.</p>
<ul>
<li><code>public String getPath()</code> — trả về đường dẫn thư mục, không kèm tên tệp.</li>
<li><code>public String getFileName()</code> — trả về tên tệp, không kèm phần mở rộng.</li>
<li><code>public String getExtension()</code> — trả về phần mở rộng.</li>
<li><code>public String getDisk()</code> — trả về tên ổ đĩa.</li>
<li><code>public String[] getFolders()</code> — trả về tên các thư mục.</li>
</ul>''',

 'J1.S.P0064': '''<p><strong>Short Assignment · J1.S.P0064 · 30 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình cho phép nhập số điện thoại, email, ngày tháng và kiểm tra định dạng của chúng.</p>
<ul>
<li>Số điện thoại nhập vào phải là chữ số.</li>
<li>Số điện thoại phải có đúng 10 chữ số.</li>
<li>Email phải đúng định dạng email chuẩn.</li>
<li>Ngày phải theo định dạng <code>dd/MM/yyyy</code>.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình kiểm tra định dạng số điện thoại, email và ngày vừa nhập.</li>
<li>Hiển thị thông báo rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>====== Validate Progaram ======
Phone number: 099999888
Phone number must be 10 digits
Phone number:abc
Phone number must be number
Phone number: 0999998888
Email: abc
Email must be correct format
Email: nghianv@ftico.com
Date: abc
Date to correct format(dd/MM/yyyy)
Date: 15/06/2015</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>checkPhone</code>, <code>checkDate</code>,
<code>checkEmail</code>.</p>
<p>Gợi ý: dùng regex để kiểm tra định dạng số điện thoại và email; dùng
<code>SimpleDateFormat</code> để kiểm tra định dạng ngày.</p>
<h4>Chức năng 1: Kiểm tra số điện thoại</h4>
<p><code>public String checkPhone(String phone)</code> — trả về thông điệp lỗi, hoặc chuỗi rỗng nếu
hợp lệ.</p>
<ul><li>Không phải số → <em>“Phone number must be number”</em>, yêu cầu nhập lại.</li>
<li>Không đủ 10 chữ số → <em>“Phone number must be 10 digits”</em>, yêu cầu nhập lại.</li></ul>
<h4>Chức năng 2: Kiểm tra ngày</h4>
<p><code>public String checkDate(String date)</code> — sai định dạng thì trả về
<em>“Date to correct format(dd/MM/yyyy)”</em>.</p>
<h4>Chức năng 3: Kiểm tra email</h4>
<p><code>public String checkEmail(String email)</code> — sai định dạng thì trả về
<em>“Email must be correct format”</em>.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI2:
        s['problemVi'] = VI2[s['lab']]
