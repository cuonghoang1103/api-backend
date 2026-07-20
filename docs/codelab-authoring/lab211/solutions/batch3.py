# Batch 3 — J1.S.P0069 (write/read a file) and J1.S.P0068 (Comparator sort).
from solkit import solution

# ════════════════════════════════════════════════════════════════
# J1.S.P0069 — Write a file, then read it back (33 LOC)
# ════════════════════════════════════════════════════════════════

P0069_BO = '''package bo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * The two methods the brief names. Neither of them talks to the keyboard or
 * decides what to say — they move text between a String and a file and let
 * IOException travel up to whoever knows how to report it.
 */
public class FileManager {

    /**
     * Required: writeFile.
     *
     * try-with-resources closes the writer even when an exception is thrown,
     * which a hand-written finally block usually gets wrong. Without the close
     * the last buffer may never reach the disk and the file reads back empty.
     */
    public void writeFile(String path, String content) throws IOException {
        try (PrintWriter writer = new PrintWriter(new FileWriter(path))) {
            writer.print(content);
        }
    }

    /**
     * Required: readFile.
     *
     * Returns null when the file is not there, so the caller can tell "no file"
     * apart from "an empty file" — two different things the user must be told
     * about differently.
     */
    public String readFile(String path) throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            return null;
        }
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                if (!first) {
                    content.append(System.lineSeparator());
                }
                content.append(line);
                first = false;
            }
        }
        return content.toString();
    }
}
'''

P0069_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getLine(String message) {
        System.out.print(message);
        return SCANNER.nextLine();
    }

    public static String getNonEmpty(String message, String error) {
        while (true) {
            String line = getLine(message).trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }

    /** Y/N question. Loops until the answer really is one of the four letters. */
    public static boolean confirm(String message) {
        while (true) {
            String answer = getLine(message).trim();
            if (answer.equalsIgnoreCase("Y")) {
                return true;
            }
            if (answer.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please answer Y or N.");
        }
    }
}
'''

P0069_MAIN = '''package ui;

import bo.FileManager;
import java.io.IOException;
import utils.Validator;

/**
 * Screen and flow: ask, gather, delegate, report.
 *
 * Writing and reading are two independent questions, exactly as the brief
 * describes: answering N to the first still lets you read.
 */
public class Main {

    private static final String STOP_WORD = "save";

    public static void main(String[] args) {
        FileManager fileManager = new FileManager();

        System.out.println("============ Writer Program ===============");

        if (Validator.confirm("Do you want to write file? (Y/N or y/n):")) {
            String path = Validator.getNonEmpty("Please enter file path: ", "Path must not be empty.");
            System.out.println("Save file with content <save> or <SAVE>");
            System.out.println("Please enter file content:");

            StringBuilder content = new StringBuilder();
            while (true) {
                String line = Validator.getLine("");
                if (line.trim().equalsIgnoreCase(STOP_WORD)) {
                    break;
                }
                if (content.length() > 0) {
                    content.append(System.lineSeparator());
                }
                content.append(line);
            }
            try {
                fileManager.writeFile(path, content.toString());
            } catch (IOException e) {
                System.out.println("Could not write the file: " + e.getMessage());
            }
        }

        if (Validator.confirm("Do you want to read file? (Y/N or y/n):")) {
            String path = Validator.getNonEmpty("Please enter file path: ", "Path must not be empty.");
            try {
                String content = fileManager.readFile(path);
                if (content == null) {
                    System.out.println("File does not exist.");
                } else {
                    System.out.println(content);
                    System.out.println("Read file successfully.");
                }
            } catch (IOException e) {
                System.out.println("Could not read the file: " + e.getMessage());
            }
        }
    }
}
'''

solution(
    'J1.S.P0069',
    title_vi='Ghi nội dung ra tệp rồi đọc lại',
    files=[('src/bo/FileManager.java', P0069_BO),
           ('src/utils/Validator.java', P0069_VALIDATOR),
           ('src/ui/Main.java', P0069_MAIN)],
    main_class='ui.Main',
    runs=[
        ('Y\ntest.txt\nContent file\nsave\nY\ntest.txt\n',
         '============ Writer Program ===============\n'
         'Do you want to write file? (Y/N or y/n):Please enter file path: '
         'Save file with content <save> or <SAVE>\nPlease enter file content:\n'
         'Do you want to read file? (Y/N or y/n):Please enter file path: Content file\n'
         'Read file successfully.'),
        # read a file that was never written — must not crash
        ('N\nY\nmissing.txt\n',
         '============ Writer Program ===============\n'
         'Do you want to write file? (Y/N or y/n):Do you want to read file? (Y/N or y/n):'
         'Please enter file path: File does not exist.'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Two independent questions — do you
want to write, and do you want to read — with the two named methods
<code>writeFile</code> and <code>readFile</code> doing the actual work. Answering N to the first must
still let you reach the second, which is why they are two separate <code>if</code> blocks and not an
if/else.</p>
<p><strong>try-with-resources, and why it is not optional here.</strong>
<code>try (PrintWriter writer = ...)</code> closes the writer whatever happens. Without the close the
last buffered characters may never reach the disk, and the file you read back a second later is empty
— a bug that looks like "readFile is broken" when the fault is in writeFile.</p>
<p><strong>Why readFile returns null instead of an empty string.</strong> "The file does not exist"
and "the file exists and is empty" are different situations that deserve different messages.
Collapsing them into <code>""</code> throws that information away, and the marker who deletes the
data file before running your program is testing exactly this. The second run in this solution does
that.</p>
<p><strong>The stop word.</strong> Content is read line by line until the user types
<code>save</code>; <code>equalsIgnoreCase</code> accepts <code>SAVE</code> too, as the brief says.
Note the comparison is on the trimmed line, so a trailing space does not stop it working.</p>
<p><strong>System.lineSeparator() rather than "\\n".</strong> It writes the line ending the operating
system running your program expects, so the file opens correctly in Notepad on the marker's Windows
machine.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Hai câu hỏi độc lập — có muốn ghi không, và có
muốn đọc không — với hai phương thức được gọi tên là <code>writeFile</code> và <code>readFile</code>
làm phần việc thật. Trả lời N cho câu đầu vẫn phải đi tiếp được tới câu thứ hai, nên đây là hai khối
<code>if</code> riêng biệt chứ không phải if/else.</p>
<p><strong>try-with-resources, và vì sao ở đây nó không phải tuỳ chọn.</strong>
<code>try (PrintWriter writer = ...)</code> đóng luồng ghi dù có chuyện gì xảy ra. Không đóng thì
những ký tự cuối còn nằm trong bộ đệm có thể không bao giờ xuống đĩa, và tệp bạn đọc lại một giây sau
sẽ rỗng — một lỗi trông như "readFile bị hỏng" trong khi lỗi thật nằm ở writeFile.</p>
<p><strong>Vì sao readFile trả về null chứ không trả chuỗi rỗng.</strong> "Tệp không tồn tại" và "tệp
có tồn tại nhưng rỗng" là hai tình huống khác nhau, đáng được thông báo khác nhau. Gộp cả hai thành
<code>""</code> là vứt bỏ thông tin đó, và người chấm xoá tệp dữ liệu trước khi chạy chương trình của
bạn chính là đang thử đúng điều này. Kịch bản chạy thứ hai trong lời giải làm đúng như vậy.</p>
<p><strong>Từ khoá dừng.</strong> Nội dung được đọc từng dòng cho tới khi người dùng gõ
<code>save</code>; <code>equalsIgnoreCase</code> chấp nhận cả <code>SAVE</code> đúng như đề nói. Để ý
là phép so sánh thực hiện trên dòng đã trim, nên một dấu cách thừa ở cuối không làm hỏng nó.</p>
<p><strong>Dùng System.lineSeparator() thay cho "\\n".</strong> Nó ghi ký tự xuống dòng đúng theo hệ
điều hành đang chạy chương trình, nên tệp mở lên bằng Notepad trên máy Windows của người chấm vẫn
hiển thị đúng.</p>''',
    hints_en=[
        'Write and read are two separate if blocks, not if/else — answering N to the first must still let you read.',
        'Use try-with-resources; without the close the file can read back empty.',
        'Loop reading content lines until the trimmed line equalsIgnoreCase "save".',
        'Check file.exists() before reading and tell the user plainly when it is not there.',
    ],
    hints_vi=[
        'Ghi và đọc là hai khối if riêng, không phải if/else — trả lời N ở câu đầu vẫn phải đọc được.',
        'Dùng try-with-resources; không đóng luồng thì đọc lại có thể ra tệp rỗng.',
        'Lặp đọc từng dòng nội dung cho tới khi dòng đã trim equalsIgnoreCase "save".',
        'Kiểm tra file.exists() trước khi đọc và báo rõ cho người dùng khi tệp không tồn tại.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0068 — Sort students with a Comparator (37 LOC)
# ════════════════════════════════════════════════════════════════

P0068_ENTITY = '''package entity;

/**
 * One student. Private fields with get/set, a default and a full constructor —
 * exactly what the brief lists.
 */
public class Student {

    private String name;
    private String classes;
    private float mark;

    public Student() {
    }

    public Student(String name, String classes, float mark) {
        this.name = name;
        this.classes = classes;
        this.mark = mark;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClasses() {
        return classes;
    }

    public void setClasses(String classes) {
        this.classes = classes;
    }

    public float getMark() {
        return mark;
    }

    public void setMark(float mark) {
        this.mark = mark;
    }

    @Override
    public String toString() {
        return "Name: " + name + "\\nClasses: " + classes + "\\nMark: " + mark;
    }
}
'''

P0068_COMPARATOR = '''package bo;

import entity.Student;
import java.util.Comparator;

/**
 * The ordering rule, on its own.
 *
 * The brief asks for a class implementing Comparator rather than making Student
 * implement Comparable, and the difference is worth being able to state: a
 * Comparable class has ONE natural order baked in, while a Comparator is one
 * ordering among many that can be swapped without touching Student at all.
 */
public class StudentNameComparator implements Comparator<Student> {

    @Override
    public int compare(Student first, Student second) {
        // compareToIgnoreCase so "an" and "An" land next to each other rather
        // than in two separate blocks - uppercase sorts before lowercase in
        // plain compareTo, which surprises everyone once.
        return first.getName().compareToIgnoreCase(second.getName());
    }
}
'''

P0068_MANAGER = '''package bo;

import entity.Student;
import java.util.Collections;
import java.util.List;

/**
 * The two methods the brief names.
 */
public class StudentManager {

    /**
     * Required: sortStudent. Sorts the list in place, A to Z by name.
     *
     * The brief does NOT name a sorting algorithm here, so the library sort is
     * the right answer — and the Comparator says what "sorted" means.
     */
    public void sortStudent(List<Student> students) {
        Collections.sort(students, new StudentNameComparator());
    }

    /** Required: display. */
    public void display(List<Student> students) {
        for (int i = 0; i < students.size(); i++) {
            System.out.println("-------------Student " + (i + 1) + "-------------");
            System.out.println(students.get(i));
        }
    }
}
'''

P0068_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getNonEmpty(String message, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }

    /** A float inside [min, max]; re-asks on letters and on out-of-range. */
    public static float getFloat(String message, float min, float max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                float value = Float.parseFloat(line);
                if (value < min || value > max) {
                    System.out.println("Mark must be between " + min + " and " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    public static boolean confirm(String message) {
        while (true) {
            System.out.print(message);
            String answer = SCANNER.nextLine().trim();
            if (answer.equalsIgnoreCase("Y")) {
                return true;
            }
            if (answer.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please answer Y or N.");
        }
    }
}
'''

P0068_MAIN = '''package ui;

import bo.StudentManager;
import entity.Student;
import java.util.ArrayList;
import java.util.List;
import utils.Validator;

/** Screen and flow only. */
public class Main {

    public static void main(String[] args) {
        StudentManager manager = new StudentManager();
        List<Student> students = new ArrayList<>();

        System.out.println("====== Collection Sort Program ======");

        do {
            System.out.println("Please input student information");
            String name = Validator.getNonEmpty("Name: ", "Name must not be empty.");
            String classes = Validator.getNonEmpty("Classes: ", "Class must not be empty.");
            float mark = Validator.getFloat("Mark: ", 0, 100);
            students.add(new Student(name, classes, mark));
        } while (Validator.confirm("Do you want to enter more student information?(Y/N):"));

        manager.sortStudent(students);
        manager.display(students);
    }
}
'''

solution(
    'J1.S.P0068',
    title_vi='Nhập, sắp xếp và hiển thị thông tin sinh viên bằng Comparator',
    files=[('src/entity/Student.java', P0068_ENTITY),
           ('src/bo/StudentNameComparator.java', P0068_COMPARATOR),
           ('src/bo/StudentManager.java', P0068_MANAGER),
           ('src/utils/Validator.java', P0068_VALIDATOR),
           ('src/ui/Main.java', P0068_MAIN)],
    main_class='ui.Main',
    runs=[
        # the brief's own screen
        ('Nghia\nFU1\n100\nY\nLien\nFU1\n100\nN\n',
         '====== Collection Sort Program ======\nPlease input student information\n'
         'Name: Classes: Mark: Do you want to enter more student information?(Y/N):'
         'Please input student information\n'
         'Name: Classes: Mark: Do you want to enter more student information?(Y/N):'
         '-------------Student 1-------------\nName: Lien\nClasses: FU1\nMark: 100.0\n'
         '-------------Student 2-------------\nName: Nghia\nClasses: FU1\nMark: 100.0'),
        # letters where the mark goes, and a mark out of range
        ('Nghia\nFU1\nabc\n200\n90\nN\n',
         '====== Collection Sort Program ======\nPlease input student information\n'
         'Name: Classes: Mark: You must input a number.\n'
         'Mark: Mark must be between 0.0 and 100.0.\n'
         'Mark: Do you want to enter more student information?(Y/N):'
         '-------------Student 1-------------\nName: Nghia\nClasses: FU1\nMark: 90.0'),
    ],
    explain_en='''<p><strong>What the brief is really asking.</strong> Collect students until the user
says no, then sort them A to Z by name using a <em>Comparator class</em>, and display them numbered.
The brief names two methods — <code>sortStudent</code> and <code>display</code> — and asks explicitly
for a class that <em>implements Comparator</em>.</p>
<p><strong>Comparator or Comparable — the question you will be asked.</strong> Making
<code>Student</code> implement <code>Comparable</code> would bake ONE ordering into the class itself.
A separate <code>Comparator</code> is one ordering among many: add
<code>StudentMarkComparator</code> tomorrow and <code>Student</code> does not change at all. The brief
asks for the second, and that difference is the answer to "why did you write a whole extra class".</p>
<p><strong>Why the library sort is right here.</strong> Unlike the bubble-sort assignments, this brief
names no algorithm — it says "use collection to sort". So <code>Collections.sort</code> with a
Comparator is the correct answer, and writing a hand-rolled sort here would be more code for a worse
mark.</p>
<p><strong>compareToIgnoreCase, not compareTo.</strong> Plain <code>compareTo</code> compares
character codes, and every uppercase letter sorts before every lowercase one — so
<code>Zoe</code> would come before <code>an</code>. Ignoring case gives the A-to-Z a human reader
expects. This is a small decision that examiners like to poke at.</p>
<p><strong>do-while, not while.</strong> The first student is always entered, and only then is the
"more?" question asked. A plain <code>while</code> would ask before there was anything to add.</p>
<p><strong>The mark is validated.</strong> <code>getFloat</code> re-asks on letters and on anything
outside 0..100, so the marker typing <code>abc</code> or <code>200</code> gets a message rather than
a stack trace. The second run in this solution is exactly that test.</p>''',
    explain_vi='''<p><strong>Đề thật ra hỏi gì.</strong> Thu thập sinh viên cho tới khi người dùng nói
thôi, rồi sắp xếp theo tên từ A đến Z bằng một <em>lớp Comparator</em>, và hiển thị có đánh số. Đề gọi
tên hai phương thức — <code>sortStudent</code> và <code>display</code> — và yêu cầu rõ một lớp
<em>implements Comparator</em>.</p>
<p><strong>Comparator hay Comparable — câu bạn sẽ bị hỏi.</strong> Cho <code>Student</code> implement
<code>Comparable</code> là nhét MỘT thứ tự cố định vào bên trong lớp. Một lớp <code>Comparator</code>
riêng chỉ là một trong nhiều thứ tự: mai bạn thêm <code>StudentMarkComparator</code> mà
<code>Student</code> không phải sửa gì cả. Đề yêu cầu cách thứ hai, và chính khác biệt đó là câu trả
lời cho "sao em phải viết hẳn một lớp nữa".</p>
<p><strong>Vì sao ở đây dùng thư viện là đúng.</strong> Khác với các bài bắt tự viết bubble sort, đề
này không gọi tên thuật toán nào — nó nói "use collection to sort". Nên
<code>Collections.sort</code> kèm Comparator mới là câu trả lời đúng, còn tự viết thuật toán ở đây là
viết nhiều code hơn để nhận điểm thấp hơn.</p>
<p><strong>Dùng compareToIgnoreCase, không dùng compareTo.</strong> <code>compareTo</code> thuần so
sánh mã ký tự, và mọi chữ HOA đều đứng trước mọi chữ thường — nên <code>Zoe</code> sẽ đứng trước
<code>an</code>. Bỏ qua hoa thường mới cho ra thứ tự A-Z mà người đọc mong đợi. Đây là một quyết định
nhỏ mà giám khảo rất thích vặn.</p>
<p><strong>Dùng do-while, không dùng while.</strong> Sinh viên đầu tiên luôn được nhập, rồi mới hỏi
"nhập nữa không". Dùng <code>while</code> thường sẽ hỏi khi chưa có gì để thêm.</p>
<p><strong>Điểm số có kiểm tra.</strong> <code>getFloat</code> hỏi lại khi gặp chữ và khi giá trị nằm
ngoài 0..100, nên người chấm gõ <code>abc</code> hay <code>200</code> sẽ nhận được thông báo chứ
không phải stack trace. Kịch bản chạy thứ hai trong lời giải chính là bài kiểm tra đó.</p>''',
    hints_en=[
        'The brief says "use collection to sort" — that means Collections.sort with a Comparator, not a hand-written algorithm.',
        'Put the ordering in its own class implementing Comparator<Student>, as the brief asks.',
        'Use compareToIgnoreCase or Zoe sorts before an.',
        'do-while: enter the first student, then ask whether to continue.',
    ],
    hints_vi=[
        'Đề ghi "use collection to sort" — nghĩa là Collections.sort kèm Comparator, không phải tự viết thuật toán.',
        'Đặt luật sắp xếp vào một lớp riêng implements Comparator<Student>, đúng như đề yêu cầu.',
        'Dùng compareToIgnoreCase, nếu không Zoe sẽ đứng trước an.',
        'Dùng do-while: nhập sinh viên đầu tiên xong mới hỏi có nhập tiếp không.',
    ],
)


# ─── Vietnamese briefs ──────────────────────────────────────────
from solkit import SOLUTIONS

VI3 = {
 'J1.S.P0069': """<p><strong>Short Assignment · J1.S.P0069 · 33 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình đọc và ghi tệp như sau:</p>
<ul><li>Nhập tên tệp.</li><li>Nhập nội dung tệp.</li><li>Ghi nội dung ra tệp.</li>
<li>Đọc nội dung từ tệp và hiển thị lên màn hình.</li></ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Chương trình ghi ra tệp, đọc từ tệp, hiển thị nội dung tệp khi được yêu cầu.</li>
<li>Hiện thông báo rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>============ Writer Program ===============
Do you want to write file? (Y/N or y/n):
Please enter file path: test.txt
Save file with content &lt;save&gt; or &lt;SAVE&gt;
Please enter file content:
Content file
Do you want to read file? (Y/N or y/n):
Please enter file path: test.txt
File content
Read file successfully.</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>writeFile</code> và <code>readFile</code>.</p>
<ul>
<li><strong>Ghi tệp</strong>: chương trình hỏi người dùng có muốn ghi tệp không. Nếu có, yêu cầu nhập
đường dẫn, ghi nội dung ra tệp rồi chuyển sang phần đọc tệp. Nếu không, chuyển thẳng sang phần đọc.</li>
<li><strong>Đọc tệp</strong>: chương trình hỏi tiếp có muốn đọc tệp không. Nếu có, yêu cầu nhập đường
dẫn, đọc và hiển thị nội dung rồi kết thúc. Nếu không, kết thúc chương trình.</li>
</ul>""",

 'J1.S.P0068': """<p><strong>Short Assignment · J1.S.P0068 · 37 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình cho phép người dùng nhập thông tin sinh viên (Tên, Lớp, Điểm), sau đó dùng
collection để sắp xếp tên sinh viên từ A đến Z và hiển thị thông tin lên màn hình.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul><li>Dùng collection để sắp xếp tên sinh viên từ A đến Z.</li>
<li>Hiển thị thông tin sinh viên lên màn hình rồi kết thúc chương trình.</li></ul>
<h3>Màn hình mong đợi</h3>
<pre>====== Collection Sort Program ======
Please input student information
Name: Nghia
Classes: FU1
Mark: 100
Do you want to enter more student information?(Y/N):Y
Please input student information
Name: Lien
Classes: FU1
Mark: 100
Do you want to enter more student information?(Y/N):N
-------------Student 1-------------
Name: Lien
Classes: FU1
Mark: 100.0
-------------Student 2-------------
Name: Nghia
Classes: FU1
Mark: 100.0</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>sortStudent</code> và <code>display</code>.</p>
<p>Tạo lớp <code>Student</code> với các thuộc tính <code>private String name;</code>,
<code>private float mark;</code>, <code>private String classes;</code>; có constructor mặc định,
constructor đầy đủ tham số, và getter/setter.</p>
<p>Tạo lớp Comparator cho Student <strong>implements Comparator</strong> và ghi đè phương thức
<code>compare</code>. Dùng <code>Collections.sort()</code> để sắp xếp theo tên từ A đến Z.</p>""",
}
for s2 in SOLUTIONS:
    if s2['lab'] in VI3:
        s2['problemVi'] = VI3[s2['lab']]
