# Parts 9 and 10 — files, and how to structure a big assignment.
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice


def build():
    part(11, 'Files — text, CSV and .dat',
         'Tệp tin — văn bản, CSV và .dat',
         '17 briefs read or write one; the first run has no file at all',
         '17 đề có đọc hoặc ghi tệp; lần chạy đầu thì chưa có tệp nào cả')

    p('<p>Three formats appear in this track. Know which one a brief wants before you write anything.</p>',
      '<p>Trong lộ trình này xuất hiện ba định dạng. Hãy xác định đề muốn loại nào trước khi viết bất cứ '
      'thứ gì.</p>')

    table(['Format', 'Looks like', 'Read it with', 'Briefs'],
          ['Định dạng', 'Trông như', 'Đọc bằng', 'Đề'],
          [['plain text', 'one record per line', '<code>BufferedReader</code> + <code>split</code>',
            'most'],
           ['CSV', 'comma-separated columns', 'the same, splitting on <code>,</code>', 'P0076, P0078'],
           ['<code>.dat</code>', 'binary, unreadable in Notepad', '<code>ObjectInputStream</code>',
            'the Long assignments']],
          [['văn bản thuần', 'mỗi dòng một bản ghi', '<code>BufferedReader</code> + <code>split</code>',
            'hầu hết'],
           ['CSV', 'các cột ngăn bằng dấu phẩy', 'như trên, tách theo <code>,</code>', 'P0076, P0078'],
           ['<code>.dat</code>', 'nhị phân, mở Notepad không đọc được', '<code>ObjectInputStream</code>',
            'các bài Long']])

    h('Reading and writing text — the pattern to memorise',
      'Đọc và ghi văn bản — khuôn mẫu cần thuộc')

    p('<p>Use try-with-resources. The stream closes itself even when an exception is thrown, which is '
      'the thing hand-written <code>finally</code> blocks usually get wrong.</p>',
      '<p>Dùng try-with-resources. Luồng tự đóng ngay cả khi có ngoại lệ — đó chính là thứ mà các khối '
      '<code>finally</code> viết tay hay làm sai.</p>')

    code('Save and load a list of records',
         'Lưu và nạp một danh sách bản ghi',
         """import java.io.*;
import java.util.*;

public class FileDemo {

    private static final String FILE = "doctors.txt";

    public static void save(List<String[]> rows) throws IOException {
        // try-with-resources: the writer is closed automatically
        try (PrintWriter out = new PrintWriter(new FileWriter(FILE))) {
            for (String[] r : rows) {
                out.println(String.join(",", r));
            }
        }
    }

    public static List<String[]> load() throws IOException {
        List<String[]> rows = new ArrayList<>();
        File f = new File(FILE);
        if (!f.exists()) {
            return rows;              // first run: empty list, NOT a crash
        }
        try (BufferedReader in = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (line.trim().isEmpty()) continue;      // skip blank lines
                rows.add(line.split(","));
            }
        }
        return rows;
    }

    public static void main(String[] args) throws IOException {
        save(List.of(new String[]{"D001", "Tran Binh", "Cardiology"},
                     new String[]{"D002", "Le Hoa", "Neurology"}));

        for (String[] r : load()) {
            System.out.println(r[0] + " | " + r[1] + " | " + r[2]);
        }
        new File(FILE).delete();
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'D001 | Tran Binh | Cardiology\nD002 | Le Hoa | Neurology')

    p('<p>Three things in there earn marks:</p>',
      '<p>Ba chi tiết trong đó giúp bạn có điểm:</p>')

    ul(['<code>if (!f.exists()) return</code> — the first run of a fresh program has no data file. '
        'Returning an empty list is correct; crashing is not.',
        '<code>while ((line = in.readLine()) != null)</code> — <code>readLine</code> returns '
        '<code>null</code> at end of file, and that is the loop condition.',
        'Skipping blank lines — a trailing newline in the data file is normal and would otherwise '
        'produce a phantom record.'],
       ['<code>if (!f.exists()) return</code> — lần chạy đầu tiên của chương trình mới thì chưa có tệp '
        'dữ liệu. Trả về danh sách rỗng là đúng; văng lỗi là sai.',
        '<code>while ((line = in.readLine()) != null)</code> — <code>readLine</code> trả về '
        '<code>null</code> khi hết tệp, và đó chính là điều kiện dừng vòng lặp.',
        'Bỏ qua dòng trống — một ký tự xuống dòng ở cuối tệp là chuyện bình thường, nếu không bỏ qua sẽ '
        'sinh ra một bản ghi ma.'])

    h('The .dat files in the Long assignments',
      'Các tệp .dat trong bài Long')

    p('<p><code>J1.L.P0014</code> and <code>P0015</code> ship <code>asset.dat</code>, '
      '<code>employee.dat</code> and friends. Those are Java-serialised objects: your class must '
      '<code>implement Serializable</code>, and you read them back with <code>ObjectInputStream</code>. '
      'Give the class a <code>serialVersionUID</code>; without one, any edit to the class makes the old '
      'file unreadable.</p>',
      '<p>Bài <code>J1.L.P0014</code> và <code>P0015</code> có kèm <code>asset.dat</code>, '
      '<code>employee.dat</code>… Đó là các đối tượng Java đã tuần tự hoá: lớp của bạn phải '
      '<code>implement Serializable</code>, và bạn đọc lại bằng <code>ObjectInputStream</code>. Hãy khai '
      'báo <code>serialVersionUID</code>; thiếu nó thì chỉ cần sửa lớp một chút là tệp cũ không đọc được '
      'nữa.</p>')

    code('Serialising a list of objects', 'Tuần tự hoá một danh sách đối tượng',
         """import java.io.*;
import java.util.*;

class Asset implements Serializable {
    private static final long serialVersionUID = 1L;   // pin the format
    private final String id;
    private final String name;

    Asset(String id, String name) { this.id = id; this.name = name; }

    @Override public String toString() { return id + ":" + name; }
}

public class DatDemo {
    public static void main(String[] args) throws Exception {
        List<Asset> assets = List.of(new Asset("A01", "Laptop"),
                                     new Asset("A02", "Printer"));

        try (ObjectOutputStream out =
                     new ObjectOutputStream(new FileOutputStream("asset.dat"))) {
            out.writeObject(assets);
        }

        try (ObjectInputStream in =
                     new ObjectInputStream(new FileInputStream("asset.dat"))) {
            @SuppressWarnings("unchecked")
            List<Asset> back = (List<Asset>) in.readObject();
            System.out.println(back);
        }
        new File("asset.dat").delete();
    }
}""")

    out('Real output', 'Kết quả chạy thật', '[A01:Laptop, A02:Printer]')

    practice([
        (252, 'Exception handling, I/O and generics', 'Xử lý ngoại lệ, I/O và generic',
         'Readers, writers, try-with-resources and serialisation — 10 exercises',
         'Reader, writer, try-with-resources và tuần tự hoá — 10 bài'),
    ])

    part(12, 'Structuring a big assignment — the MVC idea',
         'Kiến trúc bài lớn — tư tưởng MVC',
         'From 150 LOC the marker asks how it is organised, not whether it runs',
         'Từ 150 LOC người chấm hỏi tổ chức thế nào, không hỏi chạy được không')

    p('<p>From 150 LOC upward the marker stops asking "does it run" and starts asking "how is it '
      'organised". The answer they are looking for is separation of concerns, usually called MVC.</p>',
      '<p>Từ 150 LOC trở lên, người chấm thôi hỏi "chạy được không" và bắt đầu hỏi "tổ chức thế nào". Câu '
      'trả lời họ chờ đợi là sự tách bạch trách nhiệm, thường gọi là MVC.</p>')

    table(['Layer', 'Holds', 'Knows about', 'Must NOT'],
          ['Tầng', 'Chứa gì', 'Biết về', 'Tuyệt đối KHÔNG'],
          [['<strong>Model</strong>', '<code>Doctor</code>, <code>Employee</code> — data + its rules',
            'nothing else', 'print anything'],
           ['<strong>View</strong>', 'menus, prompts, formatted output', 'nothing about storage',
            'contain business rules'],
           ['<strong>Controller</strong>', '<code>DoctorManager</code> — add / update / delete / search',
            'the model and the file', 'read from the keyboard']],
          [['<strong>Model</strong>', '<code>Doctor</code>, <code>Employee</code> — dữ liệu và luật của nó',
            'không biết gì khác', 'in ra màn hình'],
           ['<strong>View</strong>', 'menu, câu nhắc, kết quả có định dạng', 'không biết gì về lưu trữ',
            'chứa nghiệp vụ'],
           ['<strong>Controller</strong>', '<code>DoctorManager</code> — thêm/sửa/xoá/tìm',
            'model và tệp dữ liệu', 'đọc bàn phím']])

    mermaid("""flowchart LR
    U[User] --> V[View - Main and menu]
    V --> C[Controller - DoctorManager]
    C --> M[Model - Doctor]
    C --> F[File - doctors.txt]
    C --> V
    V --> U""")

    p('<p>The test of whether you got it right: <strong>you can delete the entire menu and the model '
      'still compiles.</strong> If removing <code>System.out</code> breaks your <code>Doctor</code> '
      'class, the layers are tangled.</p>',
      '<p>Cách kiểm tra xem bạn làm đúng chưa: <strong>xoá sạch phần menu mà tầng model vẫn biên dịch '
      'được.</strong> Nếu bỏ <code>System.out</code> đi mà lớp <code>Doctor</code> hỏng, tức là các tầng '
      'đang dính vào nhau.</p>')

    code('The three layers, complete and runnable',
         'Ba tầng, đầy đủ và chạy được',
         """import java.util.*;

// ---------- MODEL: data plus the rules that protect it ----------
class Doctor {
    private final String code;
    private String name;
    private String specialization;

    Doctor(String code, String name, String specialization) {
        this.code = code;
        this.name = name;
        this.specialization = specialization;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public void setSpecialization(String s) { this.specialization = s; }

    @Override
    public String toString() {
        return String.format("%-6s %-15s %-12s", code, name, specialization);
    }
}

// ---------- CONTROLLER: every operation on the data, no printing ----------
class DoctorManager {
    private final List<Doctor> doctors = new ArrayList<>();

    /** Returns false when the code already exists - the caller reports it. */
    public boolean add(Doctor d) {
        if (findByCode(d.getCode()) != null) {
            return false;
        }
        return doctors.add(d);
    }

    public Doctor findByCode(String code) {
        for (Doctor d : doctors) {
            if (d.getCode().equalsIgnoreCase(code)) {
                return d;
            }
        }
        return null;
    }

    public List<Doctor> searchByName(String part) {
        List<Doctor> found = new ArrayList<>();
        for (Doctor d : doctors) {
            if (d.getName().toLowerCase().contains(part.toLowerCase())) {
                found.add(d);
            }
        }
        return found;
    }

    public boolean delete(String code) {
        Doctor d = findByCode(code);
        return d != null && doctors.remove(d);
    }

    public List<Doctor> all() {
        return Collections.unmodifiableList(doctors);
    }
}

// ---------- VIEW: talks to the human, holds no rules ----------
public class MvcDemo {
    public static void main(String[] args) {
        DoctorManager manager = new DoctorManager();

        System.out.println(manager.add(new Doctor("D001", "Tran Binh", "Cardiology")));
        System.out.println(manager.add(new Doctor("D002", "Le Hoa", "Neurology")));
        System.out.println(manager.add(new Doctor("D001", "Duplicate", "X")));

        manager.all().forEach(System.out::println);
        System.out.println(manager.searchByName("le").size());
        System.out.println(manager.delete("D002"));
        System.out.println(manager.all().size());
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """true
true
false
D001   Tran Binh       Cardiology  
D002   Le Hoa          Neurology   
1
true
1""")

    p('<p>Notice what <code>DoctorManager</code> does <em>not</em> do: it never prints and it never '
      'reads. <code>add</code> returns <code>false</code> for a duplicate and lets the view choose the '
      'wording. That one decision is what makes the class testable, reusable, and easy to defend.</p>'
      '<p><code>Collections.unmodifiableList</code> in <code>all()</code> is a small touch that '
      'examiners notice: callers can read the list but cannot secretly add to it behind the manager\'s '
      'back.</p>',
      '<p>Hãy để ý những gì <code>DoctorManager</code> <em>không</em> làm: nó không in ra và không đọc '
      'vào. Hàm <code>add</code> trả về <code>false</code> khi trùng mã rồi để tầng view tự chọn câu chữ. '
      'Chính quyết định đó làm cho lớp này kiểm thử được, dùng lại được và dễ bảo vệ.</p>'
      '<p><code>Collections.unmodifiableList</code> trong <code>all()</code> là một chi tiết nhỏ mà giám '
      'khảo hay để ý: nơi gọi đọc được danh sách nhưng không thể lén thêm phần tử sau lưng lớp quản '
      'lý.</p>')

    h('Which files to create for a big assignment',
      'Bài lớn thì tạo những file nào')

    out('A 350 LOC assignment, laid out', 'Bố cục một bài 350 LOC',
        """src/fruitshop/
├── Fruit.java            MODEL       fields + getters/setters + toString
├── Order.java            MODEL
├── FruitManager.java     CONTROLLER  add / update / delete / search / sort
├── OrderManager.java     CONTROLLER
├── Validation.java       UTILITY     the reusable readers from Part 5
├── FileHelper.java       UTILITY     load() and save()
└── Main.java             VIEW        menu loop only""",
        verify=False)

    p('<p>Seven small files beat one big one at every stage: you find things faster, you can explain '
      'each file in a sentence, and when a marker asks "where do you check for a duplicate id" you open '
      'one file instead of scrolling.</p>',
      '<p>Bảy file nhỏ hơn hẳn một file to ở mọi khâu: bạn tìm nhanh hơn, bạn giải thích được từng file '
      'trong một câu, và khi người chấm hỏi "chỗ nào kiểm tra trùng mã" thì bạn mở đúng một file thay vì '
      'cuộn tìm.</p>')

    practice([
        (543, 'Advanced I/O, NIO.2 and networking', 'I/O nâng cao, NIO.2 và mạng',
         'Files, streams and paths beyond the basics — 10 exercises',
         'Tệp, luồng và đường dẫn ở mức sâu hơn — 10 bài'),
        (253, 'Design patterns, lambdas, threads', 'Design pattern, lambda, luồng',
         'The patterns behind a layered program — 10 exercises',
         'Các mẫu thiết kế đứng sau một chương trình phân tầng — 10 bài'),
    ])
