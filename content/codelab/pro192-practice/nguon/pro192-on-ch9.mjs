/** PRO192 · 9.2 🧪 — tệp kiểu PE và LAB211: câu 1 input.txt → output.txt, quản lý sinh viên trên students.csv (mở lại), thống kê họ tiếng Việt UTF-8, bản ghi độ dài cố định với RandomAccessFile. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-on-ch9-pe-q1-file',
  tieuDe: { en: 'PE question 1: input.txt → output.txt', vi: 'Câu 1 PE: input.txt → output.txt' },
  doKho: 'HARD', phut: 40,
  khaiNiem: ['read numbers from a file', 'write a result file', 'given skeleton', 'edge cases of the data'],
  moTa: {
    en: `<p>A file question in the shape of the real papers. ${c('input.txt')} contains integers separated by spaces and/or newlines (possibly none). Write ${c('output.txt')} with exactly these lines:</p>
<pre>count: 9
distinct sorted: 1 2 3 5 8
primes: 2 3 5
second largest: 5
sum of even positions: 14</pre>
<ul><li>${c('distinct sorted')}: the distinct values ascending; ${c('primes')}: the distinct primes ascending, or ${c('none')};</li>
<li>${c('second largest')}: the second largest <b>distinct</b> value, or ${c('none')};</li>
<li>${c('sum of even positions')}: the sum of the values at positions 0, 2, 4… in file order;</li>
<li>a token that is not an integer is ignored (and does not count as a position).</li></ul>
<p>The given ${c('Main')} calls your ${c('Q1.process("input.txt", "output.txt")')} and then prints ${c('output.txt')}.</p>`,
    vi: `<p>Câu tệp theo dạng đề thật. ${c('input.txt')} chứa số nguyên cách nhau bằng dấu cách và/hoặc xuống dòng (có thể không có số nào). Ghi ${c('output.txt')} đúng các dòng như mẫu: các giá trị khác nhau tăng dần; các số nguyên tố khác nhau tăng dần hoặc ${c('none')}; giá trị <b>khác nhau</b> lớn thứ hai hoặc ${c('none')}; tổng các giá trị ở vị trí 0, 2, 4… theo thứ tự trong tệp; mảnh không phải số nguyên bị bỏ qua (và không tính là một vị trí). ${c('Main')} cho sẵn gọi ${c('Q1.process("input.txt", "output.txt")')} rồi in ${c('output.txt')}.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'A missing input.txt → output.txt contains the single line "no input".'], vi: ['Không sửa Main.java.', 'Không có input.txt → output.txt chỉ có dòng "no input".'] },
  dauVao: { en: 'input.txt.', vi: 'input.txt.' },
  dauRa: { en: 'output.txt, printed by Main.', vi: 'output.txt, do Main in ra.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) throws IOException {
        Q1.process("input.txt", "output.txt");
        try (BufferedReader in = new BufferedReader(new FileReader("output.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }
        }
    }
}
`,
    'Q1.java': j`
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.TreeSet;

public class Q1 {
    public static void process(String inFile, String outFile) throws IOException {
        //>> try (PrintWriter out = new PrintWriter(outFile)) { ⏎     out.println("count: 0"); // TODO ⏎ }
        List<Integer> values = new ArrayList<>();
        try (Scanner in = new Scanner(new File(inFile))) {
            while (in.hasNext()) {
                String token = in.next();
                try {
                    values.add(Integer.parseInt(token));
                } catch (NumberFormatException e) {
                    continue;
                }
            }
        } catch (FileNotFoundException e) {
            try (PrintWriter out = new PrintWriter(outFile)) {
                out.println("no input");
            }
            return;
        }
        TreeSet<Integer> distinct = new TreeSet<>(values);
        StringBuilder primes = new StringBuilder();
        for (int v : distinct) {
            if (isPrime(v)) {
                primes.append(primes.length() == 0 ? "" : " ").append(v);
            }
        }
        long evenSum = 0;
        for (int i = 0; i < values.size(); i += 2) {
            evenSum += values.get(i);
        }
        Integer second = distinct.isEmpty() ? null : distinct.lower(distinct.last());
        try (PrintWriter out = new PrintWriter(outFile)) {
            out.println("count: " + values.size());
            out.println("distinct sorted: " + join(distinct));
            out.println("primes: " + (primes.length() == 0 ? "none" : primes));
            out.println("second largest: " + (second == null ? "none" : second));
            out.println("sum of even positions: " + evenSum);
        }
        //<<
    }
    //>> // TODO: helpers (isPrime, join)

    private static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int d = 2; (long) d * d <= n; d++) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
    }

    private static String join(Iterable<Integer> values) {
        StringBuilder sb = new StringBuilder();
        for (int v : values) {
            sb.append(sb.length() == 0 ? "" : " ").append(v);
        }
        return sb.toString();
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the example', vi: 'ví dụ' }, vao: '', tepCa: { 'input.txt': '5 3 8\n1 2 3\n5 8 x 1\n' } },
    { ten: { en: 'no input file', vi: 'không có tệp input' }, vao: '' },
    { ten: { en: 'empty file', vi: 'tệp rỗng' }, vao: '', tepCa: { 'input.txt': '\n' }, an: true },
    { ten: { en: 'one distinct value, negatives, junk', vi: 'một giá trị khác nhau, số âm, rác' }, vao: '', tepCa: { 'input.txt': '7 7 seven 7\n' }, an: true },
    { ten: { en: 'negative numbers and 2', vi: 'số âm và số 2' }, vao: '', tepCa: { 'input.txt': '-3 2 -10 0 11 2.5 2\n' }, an: true },
  ],
  goiY: [
    { en: 'Scanner(new File(name)).next() reads tokens across lines; try Integer.parseInt on each and skip the failures.', vi: 'Scanner(new File(name)).next() đọc từng mảnh qua nhiều dòng; thử Integer.parseInt từng mảnh và bỏ mảnh hỏng.' },
    { en: 'A TreeSet gives the distinct sorted values; treeSet.lower(treeSet.last()) is the second largest distinct value (null when there is none).', vi: 'TreeSet cho các giá trị khác nhau đã sắp; treeSet.lower(treeSet.last()) là giá trị khác nhau lớn thứ hai (null khi không có).' },
  ],
  loiHayGap: [
    { en: 'Taking the second largest from the sorted LIST — with 5 5 3 that gives 5.', vi: 'Lấy lớn thứ hai từ LIST đã sắp — với 5 5 3 ra 5.' },
    { en: 'Counting the junk token "x" as a position — the even-position sum shifts.', vi: 'Tính mảnh rác "x" là một vị trí — tổng vị trí chẵn bị lệch.' },
    { en: 'Forgetting to close the PrintWriter — output.txt stays empty and Main prints nothing.', vi: 'Quên đóng PrintWriter — output.txt rỗng và Main không in gì.' },
  ],
  giaiThich: { en: '<p>Read every token, keep only integers in file order (positions), derive the distinct sorted set with a TreeSet, then write the five lines with a PrintWriter closed by try-with-resources. Each edge case (no file, empty, one value, negatives) has a defined output.</p>', vi: '<p>Đọc mọi mảnh, chỉ giữ số nguyên theo thứ tự trong tệp (vị trí), suy ra tập khác nhau đã sắp bằng TreeSet, rồi ghi năm dòng bằng PrintWriter được try-with-resources đóng. Mỗi ca biên (không tệp, rỗng, một giá trị, số âm) đều có output xác định.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch9-students-csv',
  tieuDe: { en: 'LAB211: a student manager that saves to students.csv', vi: 'LAB211: quản lý sinh viên lưu ra students.csv' },
  doKho: 'HARD', phut: 45,
  khaiNiem: ['load on start-up', 'save after every change', 'CSV with a header', 'menu over a List'],
  moTa: {
    en: `<p>The student manager of chapter 2, now with a memory. On start-up load ${c('students.csv')} (header ${c('id,name,gpa')}; a missing file means an empty list; a broken line is skipped with ${c('Skipped line <n> of students.csv.')}). Menu:</p>
<pre>1. Add  2. List  3. Delete  0. Exit
Choice: </pre>
<ul><li>Add: id ${c('[A-Z]{2}\\d{6}')}, unique; name not blank and without commas; GPA 0..10. Delete by id.</li>
<li>List: by id, ${c('String.format("%-9s %-20s %5.2f", id, name, gpa)')}; empty → ${c('No student.')}</li>
<li><b>Save the whole file after every Add and Delete</b> (GPA with 2 decimals) so a crash never loses data.</li></ul>
<p>The grader runs the program twice in the same folder: what the first run added must be listed by the second.</p>`,
    vi: `<p>Bài quản lý sinh viên của chương 2, nay có trí nhớ. Khởi động thì nạp ${c('students.csv')} (tiêu đề ${c('id,name,gpa')}; không có tệp nghĩa là danh sách rỗng; dòng hỏng bị bỏ kèm câu ${c('Skipped line <n> of students.csv.')}). Menu như trên. Thêm: mã ${c('[A-Z]{2}\\d{6}')}, không trùng; tên không trống, không có dấu phẩy; GPA 0..10. Xoá theo mã. Liệt kê theo mã với định dạng trên; rỗng → ${c('No student.')} <b>Lưu cả tệp sau mỗi lần Thêm và Xoá</b> (GPA 2 chữ số thập phân). Máy chấm chạy chương trình hai lần trong cùng thư mục: thứ lần đầu thêm phải hiện ở lần sau.</p>`,
  },
  yeuCau: { en: ['Prompts and messages are in the given Main.java.', 'LAB211 rules L1–L7.'], vi: ['Lời nhắc và câu báo nằm trong Main.java cho sẵn.', 'Luật LAB211 L1–L7.'] },
  dauVao: { en: 'Menu input for two runs.', vi: 'Nhập menu cho hai lần chạy.' },
  dauRa: { en: 'Both runs.', vi: 'Cả hai lần chạy.' },
  main: 'Main', lab211: true,
  tep: {
    'Student.java': j`
public class Student {
    private final String id;
    private final String name;
    private final double gpa;

    public Student(String id, String name, double gpa) {
        this.id = id;
        this.name = name;
        this.gpa = gpa;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getGpa() {
        return gpa;
    }

    @Override
    public String toString() {
        return String.format("%-9s %-20s %5.2f", id, name, gpa);
    }
}
`,
    'StudentFile.java': j`
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

// Reads and writes students.csv. Returns data and messages; never prints.
public class StudentFile {
    private static final String FILE = "students.csv";
    private static final String HEADER = "id,name,gpa";

    public List<Student> load(List<String> messages) throws IOException {
        List<Student> students = new ArrayList<>();
        //>> // TODO: read the file (missing = empty), skip the header, skip broken lines with a message
        try (BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream(FILE), StandardCharsets.UTF_8))) {
            String line = in.readLine();
            int no = 1;
            while ((line = in.readLine()) != null) {
                no++;
                String[] p = line.split(",");
                try {
                    students.add(new Student(p[0].trim(), p[1].trim(), Double.parseDouble(p[2].trim())));
                } catch (ArrayIndexOutOfBoundsException | NumberFormatException e) {
                    messages.add("Skipped line " + no + " of students.csv.");
                }
            }
        } catch (FileNotFoundException e) {
            return students;
        }
        //<<
        return students;
    }

    public void save(List<Student> students) throws IOException {
        //>> // TODO: rewrite the whole file: header + one line per student, GPA with 2 decimals
        try (PrintWriter out = new PrintWriter(new OutputStreamWriter(new FileOutputStream(FILE), StandardCharsets.UTF_8))) {
            out.println(HEADER);
            for (Student s : students) {
                out.println(s.getId() + "," + s.getName() + "," + String.format("%.2f", s.getGpa()));
            }
        }
        //<<
    }
}
`,
    'Main.java': j`
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        StudentFile studentFile = new StudentFile();
        List<String> messages = new ArrayList<>();
        List<Student> studentList = studentFile.load(messages);
        for (String message : messages) {
            System.out.println(message);
        }
        System.out.println("Loaded " + studentList.size() + " student(s).");
        boolean isRunning = true;
        while (isRunning) {
            System.out.println("1. Add  2. List  3. Delete  0. Exit");
            switch (readChoice(scanner)) {
                case 1:
                    //>> System.out.println("TODO"); // TODO: read + validate, add, save, print "Added <id>." (or "Student <id> already exists.")
                    String id = readText(scanner, "ID: ", "[A-Z]{2}\\d{6}", "ID must be 2 upper-case letters + 6 digits.");
                    if (find(studentList, id) != null) {
                        System.out.println("Student " + id + " already exists.");
                        break;
                    }
                    String name = readText(scanner, "Name: ", "[^,]+", "Name cannot contain a comma.");
                    studentList.add(new Student(id, name, readGpa(scanner)));
                    studentFile.save(studentList);
                    System.out.println("Added " + id + ".");
                    //<<
                    break;
                case 2:
                    printSorted(studentList);
                    break;
                case 3:
                    //>> System.out.println("TODO"); // TODO: delete by id, save, "Deleted <id>." / "Student <id> does not exist."
                    String deleteId = readText(scanner, "ID: ", "[A-Z]{2}\\d{6}", "ID must be 2 upper-case letters + 6 digits.");
                    Student student = find(studentList, deleteId);
                    if (student == null) {
                        System.out.println("Student " + deleteId + " does not exist.");
                    } else {
                        studentList.remove(student);
                        studentFile.save(studentList);
                        System.out.println("Deleted " + deleteId + ".");
                    }
                    //<<
                    break;
                case 0:
                    isRunning = false;
                    break;
                default:
                    break;
            }
        }
    }

    private static Student find(List<Student> studentList, String id) {
        for (Student student : studentList) {
            if (student.getId().equals(id)) {
                return student;
            }
        }
        return null;
    }

    private static void printSorted(List<Student> studentList) {
        if (studentList.isEmpty()) {
            System.out.println("No student.");
            return;
        }
        List<Student> copy = new ArrayList<>(studentList);
        Collections.sort(copy, new Comparator<Student>() {
            @Override
            public int compare(Student a, Student b) {
                return a.getId().compareTo(b.getId());
            }
        });
        for (Student student : copy) {
            System.out.println(student);
        }
    }

    private static int readChoice(Scanner scanner) {
        while (true) {
            System.out.print("Choice: ");
            String line = scanner.nextLine().trim();
            if (line.matches("[0-3]")) {
                return Integer.parseInt(line);
            }
            System.out.println("Choose 0, 1, 2 or 3.");
        }
    }

    private static String readText(Scanner scanner, String prompt, String regex, String error) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            if (line.matches(regex)) {
                return line;
            }
            System.out.println(line.isEmpty() ? "This field is required." : error);
        }
    }

    private static double readGpa(Scanner scanner) {
        while (true) {
            System.out.print("GPA (0-10): ");
            String line = scanner.nextLine().trim();
            try {
                double gpa = Double.parseDouble(line);
                if (gpa >= 0 && gpa <= 10) {
                    return gpa;
                }
                System.out.println("GPA must be between 0 and 10.");
            } catch (NumberFormatException e) {
                System.out.println("GPA must be a number.");
            }
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'first run adds, second run lists and deletes', vi: 'lần đầu thêm, lần sau liệt kê và xoá' }, phien: ['2\n1\nHE200002\nTran, Binh\nTran Binh\n7.5\n1\nhe1\nHE100001\nNguyen An\nten\n11\n8.25\n1\nHE100001\n0\n', '2\n3\nHE200002\n3\nHE200002\n2\n0\n'] },
    { ten: { en: 'an existing file with a broken line', vi: 'tệp có sẵn với một dòng hỏng' }, phien: ['2\n1\nSE000003\nLe Chi\n6\n0\n', '2\n0\n'], tepCa: { 'students.csv': 'id,name,gpa\nSE000001,Pham Dung,9.00\nbroken line\nSE000002,Hoang Em,abc\n' }, an: true },
  ],
  goiY: [
    { en: 'Save the WHOLE list after every change (rewrite the file): simpler and safe for a small file.', vi: 'Lưu CẢ danh sách sau mỗi thay đổi (viết lại tệp): đơn giản và an toàn với tệp nhỏ.' },
    { en: 'FileNotFoundException on start-up is not an error — the first run simply has no data yet.', vi: 'FileNotFoundException lúc khởi động không phải lỗi — lần chạy đầu chỉ là chưa có dữ liệu.' },
  ],
  loiHayGap: [
    { en: 'Saving only on Exit — the grader’s second run is fine, but a crash or a closed window loses everything (and the task says after every change).', vi: 'Chỉ lưu khi Thoát — lần chạy thứ hai vẫn đúng, nhưng sập hay đóng cửa sổ là mất hết (và đề nói sau mỗi thay đổi).' },
    { en: 'A comma in the name breaks the CSV on the next load — refuse it at input time.', vi: 'Dấu phẩy trong tên làm hỏng CSV ở lần nạp sau — từ chối ngay lúc nhập.' },
    { en: 'Writing the GPA with %.2f on a Vietnamese-locale machine gives "7,50" — and the comma breaks the CSV. Locale.US (or the grader’s English locale) avoids it.', vi: 'Ghi GPA bằng %.2f trên máy locale tiếng Việt ra "7,50" — và dấu phẩy làm hỏng CSV. Locale.US (hoặc locale tiếng Anh của máy chấm) tránh được.' },
  ],
  giaiThich: { en: '<p>Persistence in its simplest reliable form: load once at start-up (tolerating a missing file and broken lines), keep the data in a List while running, and rewrite the whole file after each change. The second run proves the data survived.</p>', vi: '<p>Lưu bền ở dạng đơn giản mà chắc chắn nhất: nạp một lần lúc khởi động (chấp nhận thiếu tệp và dòng hỏng), giữ dữ liệu trong List khi chạy, và viết lại cả tệp sau mỗi thay đổi. Lần chạy thứ hai chứng minh dữ liệu còn nguyên.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch9-family-names',
  tieuDe: { en: 'A Vietnamese report: count students by family name (UTF-8)', vi: 'Báo cáo tiếng Việt: đếm sinh viên theo họ (UTF-8)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['UTF-8 input file', 'family name = first word', 'Map counting', 'sorting by count then name'],
  moTa: {
    en: `<p>${c('names.txt')} (UTF-8) holds one full Vietnamese name per line, e.g. ${c('Nguyễn Văn An')}. The family name is the <b>first</b> word. Print the families by number of students (most first), equal counts in alphabetical order of the family name as Java compares Strings (${c('compareTo')}):</p>
<pre>Nguyễn: 3
Trần: 2
Lê: 1
total: 6 students, 3 family names</pre>
<p>Ignore blank lines; trim spaces; a family name is compared exactly as written (do not change its case).</p>`,
    vi: `<p>${c('names.txt')} (UTF-8) chứa mỗi dòng một họ tên tiếng Việt, vd ${c('Nguyễn Văn An')}. Họ là từ <b>đầu tiên</b>. In các họ theo số sinh viên (nhiều trước), bằng nhau thì theo thứ tự ${c('compareTo')} của String, như mẫu. Bỏ dòng trống; bỏ dấu cách thừa; họ so đúng như viết (không đổi hoa thường).</p>`,
  },
  yeuCau: { en: ['Read with an explicit UTF-8 charset.'], vi: ['Đọc với bảng mã UTF-8 chỉ rõ.'] },
  dauVao: { en: 'names.txt.', vi: 'names.txt.' },
  dauRa: { en: 'One line per family name, then the total.', vi: 'Mỗi họ một dòng, rồi tổng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'explicit UTF-8 when reading', vi: 'chỉ rõ UTF-8 khi đọc', re: String.raw`UTF_8|"UTF-8"`, need: true }],
  tep: {
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) throws IOException {
        Map<String, Integer> families = new HashMap<>();
        int total = 0;
        //>> // TODO: read names.txt in UTF-8, count the first word of every non-blank line
        try (BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream("names.txt"), StandardCharsets.UTF_8))) {
            String line;
            while ((line = in.readLine()) != null) {
                String t = line.trim();
                if (t.isEmpty()) {
                    continue;
                }
                String family = t.split("\\s+")[0];
                families.put(family, families.getOrDefault(family, 0) + 1);
                total++;
            }
        }
        //<<
        List<Map.Entry<String, Integer>> rows = new ArrayList<>(families.entrySet());
        //>> // TODO: sort by count desc, then family name
        Collections.sort(rows, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> a, Map.Entry<String, Integer> b) {
                int byCount = Integer.compare(b.getValue(), a.getValue());
                return byCount != 0 ? byCount : a.getKey().compareTo(b.getKey());
            }
        });
        //<<
        for (Map.Entry<String, Integer> e : rows) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
        System.out.println("total: " + total + " students, " + families.size() + " family names");
    }
}
`,
  },
  ca: [
    { ten: { en: 'the example', vi: 'ví dụ' }, vao: '', tepCa: { 'names.txt': 'Nguyễn Văn An\nTrần Thị Bình\n\nLê Hoa\n  Nguyễn   Thị Chi \nTrần Minh\nNguyễn Đức Duy\n' } },
    { ten: { en: 'ties between families, accents', vi: 'hoà giữa các họ, dấu' }, vao: '', tepCa: { 'names.txt': 'Đỗ An\nĐặng Bình\nĐỗ Chi\nĐặng Dung\nPhạm Em\n' }, an: true },
    { ten: { en: 'an empty file', vi: 'tệp rỗng' }, vao: '', tepCa: { 'names.txt': '' }, an: true },
  ],
  goiY: [
    { en: 'new InputStreamReader(new FileInputStream("names.txt"), StandardCharsets.UTF_8) — FileReader on JDK 8–17 Windows would read the accents as garbage.', vi: 'new InputStreamReader(new FileInputStream("names.txt"), StandardCharsets.UTF_8) — FileReader trên Windows với JDK 8–17 đọc dấu thành ký tự rác.' },
    { en: 'The first word: t.trim().split("\\\\s+")[0].', vi: 'Từ đầu tiên: t.trim().split("\\\\s+")[0].' },
  ],
  loiHayGap: [
    { en: 'Reading with the platform charset — "Nguyễn" turns into "NguyÃ¡»…n" and the families do not group.', vi: 'Đọc bằng bảng mã mặc định của máy — "Nguyễn" thành "NguyÃ¡»…n" và các họ không gộp được.' },
    { en: 'Expecting "Đặng" before "Đỗ" alphabetically in Vietnamese — String.compareTo compares UTF-16 code units; a Collator is needed for true Vietnamese order (not asked here).', vi: 'Mong "Đặng" đứng trước "Đỗ" theo thứ tự tiếng Việt — String.compareTo so mã UTF-16; muốn đúng thứ tự tiếng Việt cần Collator (đề không yêu cầu).' },
  ],
  giaiThich: { en: '<p>The only hard part is the charset: read the file explicitly as UTF-8. Counting uses a Map, and the report sorts the entries by count descending, then by key with String.compareTo — a well-defined order the grader can reproduce on any machine.</p>', vi: '<p>Chỗ khó duy nhất là bảng mã: đọc tệp với UTF-8 chỉ rõ. Đếm dùng Map, báo cáo sắp các entry theo số lượng giảm dần rồi theo khoá bằng String.compareTo — thứ tự xác định mà máy chấm tái tạo được trên mọi máy.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch9-random-access',
  tieuDe: { en: 'Fixed-length records with RandomAccessFile', vi: 'Bản ghi độ dài cố định với RandomAccessFile' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['RandomAccessFile', 'seek(position)', 'fixed-size record', 'update in place'],
  moTa: {
    en: `<p>Store members in ${c('members.dat')} as fixed-length binary records: ${c('int id')} (4 bytes) + ${c('name')} as exactly 20 chars written with ${c('writeChar')} (40 bytes, padded with spaces, longer names cut) + ${c('int points')} (4 bytes) = <b>48 bytes</b> per record. Record ${c('k')} (0-based) starts at byte ${c('k * 48')}.</p>
<p>Write ${c('MemberFile')} with ${c('append(int id, String name, int points)')}, ${c('int count()')} (file length / 48), ${c('String read(int k)')} → ${c('"7 Nguyen An 120"')} (name trimmed) or ${c('"no record 9"')}, and ${c('boolean addPoints(int k, int delta)')} — updates the points <b>in place</b> (seek to the points field, read, write back).</p>`,
    vi: `<p>Lưu thành viên trong ${c('members.dat')} dưới dạng bản ghi nhị phân độ dài cố định: ${c('int id')} (4 byte) + tên đúng 20 ký tự ghi bằng ${c('writeChar')} (40 byte, thiếu thì đệm dấu cách, dài thì cắt) + ${c('int points')} (4 byte) = <b>48 byte</b> mỗi bản ghi. Bản ghi ${c('k')} (từ 0) bắt đầu ở byte ${c('k * 48')}. Viết ${c('MemberFile')} với ${c('append')}, ${c('count()')} (độ dài tệp / 48), ${c('read(int k)')} → ${c('"7 Nguyen An 120"')} (tên đã trim) hoặc ${c('"no record 9"')}, và ${c('addPoints(int k, int delta)')} — sửa điểm <b>tại chỗ</b> (seek tới trường points, đọc, ghi lại).</p>`,
  },
  yeuCau: { en: ['Use RandomAccessFile with mode "rw"; never read the whole file to change one record.'], vi: ['Dùng RandomAccessFile chế độ "rw"; không đọc cả tệp để sửa một bản ghi.'] },
  dauVao: { en: 'Commands ADD;id;name;points · READ;k · PTS;k;delta · COUNT.', vi: 'Lệnh ADD;id;tên;điểm · READ;k · PTS;k;delta · COUNT.' },
  dauRa: { en: 'Result of each command and the file size.', vi: 'Kết quả mỗi lệnh và kích thước tệp.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'uses RandomAccessFile and seek', vi: 'dùng RandomAccessFile và seek', re: String.raw`RandomAccessFile[\s\S]*\.seek\s*\(`, file: 'MemberFile', need: true }],
  tep: {
    'Main.java': j`
import java.io.File;
import java.io.IOException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        MemberFile f = new MemberFile("members.dat");
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split(";");
            String r;
            if (p[0].equals("ADD")) {
                f.append(Integer.parseInt(p[1]), p[2], Integer.parseInt(p[3]));
                r = "added";
            } else if (p[0].equals("READ")) {
                r = f.read(Integer.parseInt(p[1]));
            } else if (p[0].equals("PTS")) {
                r = String.valueOf(f.addPoints(Integer.parseInt(p[1]), Integer.parseInt(p[2])));
            } else {
                r = String.valueOf(f.count());
            }
            System.out.println(String.join(";", p) + " -> " + r + " | file " + new File("members.dat").length() + " bytes");
        }
    }
}
`,
    'MemberFile.java': j`
import java.io.IOException;
import java.io.RandomAccessFile;

// Fixed-length records: id (int) + name (20 chars) + points (int) = 48 bytes.
public class MemberFile {
    private static final int NAME_CHARS = 20;
    private static final int RECORD = 4 + NAME_CHARS * 2 + 4;
    private final String path;

    public MemberFile(String path) {
        this.path = path;
    }

    public void append(int id, String name, int points) throws IOException {
        //>> // TODO: seek to the end, write id, 20 chars of name (padded / cut), points
        try (RandomAccessFile raf = new RandomAccessFile(path, "rw")) {
            raf.seek(raf.length());
            raf.writeInt(id);
            for (int i = 0; i < NAME_CHARS; i++) {
                raf.writeChar(i < name.length() ? name.charAt(i) : ' ');
            }
            raf.writeInt(points);
        }
        //<<
    }

    public int count() throws IOException {
        //>> return 0; // TODO
        try (RandomAccessFile raf = new RandomAccessFile(path, "rw")) {
            return (int) (raf.length() / RECORD);
        }
        //<<
    }

    public String read(int k) throws IOException {
        //>> return "no record " + k; // TODO: seek to k * RECORD and read the three fields
        if (k < 0 || k >= count()) {
            return "no record " + k;
        }
        try (RandomAccessFile raf = new RandomAccessFile(path, "rw")) {
            raf.seek((long) k * RECORD);
            int id = raf.readInt();
            StringBuilder name = new StringBuilder();
            for (int i = 0; i < NAME_CHARS; i++) {
                name.append(raf.readChar());
            }
            int points = raf.readInt();
            return id + " " + name.toString().trim() + " " + points;
        }
        //<<
    }

    public boolean addPoints(int k, int delta) throws IOException {
        //>> return false; // TODO: seek to the points field of record k, read, write back
        if (k < 0 || k >= count()) {
            return false;
        }
        try (RandomAccessFile raf = new RandomAccessFile(path, "rw")) {
            long pos = (long) k * RECORD + 4 + NAME_CHARS * 2;
            raf.seek(pos);
            int points = raf.readInt();
            raf.seek(pos);
            raf.writeInt(points + delta);
        }
        return true;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'append, read, update in place', vi: 'thêm, đọc, sửa tại chỗ' }, vao: 'ADD;7;Nguyen An;120\nADD;9;Tran Thi Binh;40\nCOUNT\nREAD;1\nPTS;0;-20\nREAD;0\nREAD;2\nPTS;5;1\n' },
    { ten: { en: 'a name longer than 20 chars, many records', vi: 'tên dài hơn 20 ký tự, nhiều bản ghi' }, vao: 'ADD;1;Nguyen Thi Thanh Huong Lan;5\nADD;2;B;0\nADD;3;C;0\nPTS;2;100\nREAD;2\nREAD;0\nCOUNT\nREAD;-1\n', an: true },
  ],
  goiY: [
    { en: 'Record k starts at k * 48; its points field at k * 48 + 4 + 40.', vi: 'Bản ghi k bắt đầu ở k * 48; trường points ở k * 48 + 4 + 40.' },
    { en: 'readInt moves the file pointer forward by 4 — seek back to the same position before writeInt.', vi: 'readInt đẩy con trỏ tệp tới thêm 4 byte — seek lại đúng vị trí trước khi writeInt.' },
  ],
  loiHayGap: [
    { en: 'Writing the name with writeUTF — its length varies, so the records are no longer 48 bytes and seek lands in the wrong place.', vi: 'Ghi tên bằng writeUTF — độ dài thay đổi, bản ghi không còn 48 byte và seek rơi sai chỗ.' },
    { en: 'Forgetting to seek back before writeInt — the new points overwrite the next record’s id.', vi: 'Quên seek lại trước writeInt — điểm mới ghi đè lên id của bản ghi kế tiếp.' },
  ],
  giaiThich: { en: '<p>Fixed-size records turn a file into an array on disk: the position of record k is computed, so reading or updating it costs one seek, whatever the size of the file. Padding the name to exactly 20 chars is what keeps every record 48 bytes long.</p>', vi: '<p>Bản ghi cỡ cố định biến tệp thành một mảng trên đĩa: vị trí bản ghi k tính được, nên đọc hay sửa nó chỉ tốn một lần seek, dù tệp lớn thế nào. Đệm tên cho đúng 20 ký tự là điều giữ mọi bản ghi dài đúng 48 byte.</p>' },
});

export default moDun({ slug: 'pro192-on-ch9', ten: '9.2 🧪 Practice — files the PE and LAB211 way: input/output files, CSV, UTF-8, binary records', de: [de1, de2, de3, de4] });
