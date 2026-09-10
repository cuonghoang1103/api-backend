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

    p('<p>MVC has three words, but the projects on this track create <strong>five</strong> folders '
      'under <code>src/</code>. Model splits in two — <code>entity</code> carries the data, '
      '<code>bo</code> carries the rules that guard it — and the readers from Part 5 get a folder of '
      'their own. Measured across the 54 reference solutions: <code>ui</code> 54/54, '
      '<code>utils</code> 50, <code>bo</code> 42, <code>entity</code> 34, <code>controller</code> 11. '
      '<strong>Not one of the 54 puts every class in a single flat package.</strong></p>',
      '<p>MVC có ba chữ, nhưng các project trong lộ trình này tạo <strong>năm</strong> thư mục dưới '
      '<code>src/</code>. Model tách làm đôi — <code>entity</code> giữ dữ liệu, <code>bo</code> giữ '
      'luật bảo vệ dữ liệu đó — còn mấy hàm đọc ở Phần 5 được ở riêng một thư mục. Đo trên 54 lời giải '
      'mẫu: <code>ui</code> 54/54, <code>utils</code> 50, <code>bo</code> 42, <code>entity</code> 34, '
      '<code>controller</code> 11. <strong>Không một bài nào trong 54 bài dồn hết lớp vào một gói '
      'phẳng.</strong></p>')

    table(['Folder under <code>src/</code>', 'Holds', 'Talks to', 'Must NOT'],
          ['Thư mục trong <code>src/</code>', 'Chứa gì', 'Nói chuyện với', 'Tuyệt đối KHÔNG'],
          [['<code>entity/</code> <strong>= M</strong>',
            '<code>Fruit</code>, <code>Doctor</code> — fields, constructor, getters, <code>toString</code>',
            'nothing — it is the leaf', 'print, or open a file'],
           ['<code>bo/</code> <strong>= M</strong>',
            'the collection, the rules, and on this track the load/save too',
            '<code>entity</code> and the data file',
            'print — the one rule stated with no exception'],
           ['<code>controller/</code> <strong>= C</strong>',
            'one method per menu choice: read → call <code>bo</code> → report the outcome',
            '<code>bo</code>, <code>utils</code>, the screen', 'hold a rule of its own'],
           ['<code>ui/Main</code> <strong>= V</strong>', 'the menu and the loop',
            '<code>controller</code>, or <code>bo</code> directly when there is none',
            'contain business rules'],
           ['<code>utils/</code>',
            '<code>Validator</code> — every keyboard read in one place — plus tiny helpers',
            'the keyboard and the screen', 'own the data, or the rules']],
          [['<code>entity/</code> <strong>= M</strong>',
            '<code>Fruit</code>, <code>Doctor</code> — thuộc tính, hàm dựng, getter, <code>toString</code>',
            'không ai cả — nó là lá', 'in ra màn hình, hay mở tệp'],
           ['<code>bo/</code> <strong>= M</strong>',
            'danh sách, các luật, và trong lộ trình này gánh luôn phần đọc/ghi tệp',
            '<code>entity</code> và tệp dữ liệu',
            'in ra màn hình — quy tắc duy nhất không có ngoại lệ'],
           ['<code>controller/</code> <strong>= C</strong>',
            'mỗi lựa chọn menu một phương thức: đọc → gọi <code>bo</code> → báo kết quả',
            '<code>bo</code>, <code>utils</code>, màn hình', 'tự giữ luật nghiệp vụ'],
           ['<code>ui/Main</code> <strong>= V</strong>', 'menu và vòng lặp',
            '<code>controller</code>, hoặc gọi thẳng <code>bo</code> khi không có controller',
            'chứa nghiệp vụ'],
           ['<code>utils/</code>',
            '<code>Validator</code> — gom mọi lần đọc bàn phím về một chỗ — cùng vài hàm phụ nhỏ',
            'bàn phím và màn hình', 'giữ dữ liệu, hay giữ luật']])

    p('<p>One line there surprises people, so it is worth saying plainly: on this track '
      '<strong>the controller reads the keyboard and prints</strong>. All eleven controllers in the 54 '
      'solutions do — they call <code>Validator</code> for the input and print the result. It is '
      '<code>bo</code> that must stay silent, not the controller. Where a project has no controller — '
      '43 of the 54 — <code>Main</code> does that job itself and calls <code>bo</code> directly, which '
      '31 of those 43 do.</p>',
      '<p>Có một dòng hay làm người đọc bất ngờ, nên nói thẳng: trong lộ trình này '
      '<strong>controller ĐƯỢC đọc bàn phím và ĐƯỢC in</strong>. Cả 11 controller trong 54 lời giải đều '
      'làm thế — gọi <code>Validator</code> để đọc rồi in kết quả ra. Thứ phải im lặng là '
      '<code>bo</code>, không phải controller. Bài nào không có controller — 43/54 — thì '
      '<code>Main</code> tự làm việc đó và gọi thẳng <code>bo</code>, đúng như 31 trong 43 bài ấy.</p>')

    mermaid("""flowchart LR
    U[User] --> V[ui.Main - menu loop]
    V --> C[controller.ShopController]
    C --> B[bo.FruitManager - rules]
    B --> E[entity.Fruit - data]
    B --> F[fruits.txt]
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

// ---------- entity: data plus the rules that protect it ----------
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

// ---------- bo: every operation on the data, and it never prints ----------
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

// ---------- ui: talks to the human, holds no rules ----------
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

    p('<p>This is not a sketch. It is <code>J1.L.P0023</code> "Fruit Shop" — a real 350 LOC brief from '
      'this track — as the reference solution actually lays it out: nine files, 594 lines of real '
      'code.</p>',
      '<p>Đây không phải hình vẽ minh hoạ. Đây là <code>J1.L.P0023</code> "Fruit Shop" — một đề 350 LOC '
      'có thật trong lộ trình này — đúng như lời giải mẫu xếp nó: chín tệp, 594 dòng mã thật.</p>')

    out('P0023 Fruit Shop, as the reference solution lays it out',
        'P0023 Fruit Shop, đúng bố cục của lời giải mẫu',
        """src/
├── entity/
│   ├── Fruit.java             fields + getters/setters + toString
│   ├── Item.java              one line of a cart
│   └── Cart.java              what one customer is buying
├── bo/
│   ├── FruitManager.java      add/update/delete/search  +  fruits.txt
│   └── OrderManager.java      the order book            +  orders.txt
├── controller/
│   └── ShopController.java    one method per menu choice
├── utils/
│   ├── Validator.java         the reusable readers from Part 5
│   └── Money.java             one place that formats a price
└── ui/
    └── Main.java              the menu loop — 54 lines, nothing else""",
        verify=False)

    p('<p>Nine small files beat one big one at every stage: you find things faster, you can explain '
      'each file in a sentence, and when a marker asks "where do you check for a duplicate id" you open '
      'one file instead of scrolling.</p>',
      '<p>Chín file nhỏ hơn hẳn một file to ở mọi khâu: bạn tìm nhanh hơn, bạn giải thích được từng file '
      'trong một câu, và khi người chấm hỏi "chỗ nào kiểm tra trùng mã" thì bạn mở đúng một file thay vì '
      'cuộn tìm.</p>')

    h('Where the file reading and writing goes',
      'Phần đọc/ghi tệp thì để ở đâu')

    p('<p>Notice that <code>FruitManager</code> above owns <code>fruits.txt</code> itself — there is no '
      'separate <code>FileHelper</code>. Both shapes pass, and the 54 solutions were counted rather '
      'than guessed. Fifteen of them touch a file at all. Of those fifteen, '
      '<strong>eleven keep a separate class for the file and four merge it into the business class</strong> '
      '— and in all eleven that separate class lives in <code>bo/</code>, never in <code>utils/</code>: '
      '<code>VehicleFile</code>, <code>DataStore</code>, <code>FileProcessor</code>, '
      '<code>CSVFormatter</code>, <code>CopyManager</code>, <code>ZipManager</code>, '
      '<code>WordSearcher</code>, <code>DocumentFileManager</code>, <code>FileManager</code>, '
      '<code>FileProcessing</code> — ten names for eleven projects, because <code>DataStore</code> '
      'serves both <code>P0014</code> and <code>P0015</code>.</p>',
      '<p>Để ý <code>FruitManager</code> ở trên tự giữ luôn <code>fruits.txt</code> — không có lớp '
      '<code>FileHelper</code> riêng nào cả. Cả hai cách đều qua được, và 54 lời giải đã được ĐẾM chứ '
      'không đoán. Mười lăm bài có đụng tới tệp. Trong mười lăm bài đó, '
      '<strong>mười một bài tách riêng một lớp lo tệp, bốn bài gộp vào lớp nghiệp vụ</strong> — và cả '
      'mười một lần lớp tách riêng ấy đều nằm trong <code>bo/</code>, không lần nào ở '
      '<code>utils/</code>: <code>VehicleFile</code>, <code>DataStore</code>, '
      '<code>FileProcessor</code>, <code>CSVFormatter</code>, <code>CopyManager</code>, '
      '<code>ZipManager</code>, <code>WordSearcher</code>, <code>DocumentFileManager</code>, '
      '<code>FileManager</code>, <code>FileProcessing</code> — mười cái tên cho mười một bài, vì '
      '<code>DataStore</code> dùng chung cho cả <code>P0014</code> lẫn <code>P0015</code>.</p>')

    ul(['<strong>Merge it</strong> when one <code>bo</code> owns one file for one entity — '
        '<code>FruitManager</code> and <code>fruits.txt</code>, <code>DictionaryManager</code> and '
        '<code>dictionary.txt</code>. A <code>FileHelper</code> there would be one indirection with '
        'nothing to justify it, and you would have to defend it out loud.',
        '<strong>Split it out</strong> when several <code>bo</code> classes share one file — '
        '<code>DataStore</code> in <code>P0014</code>/<code>P0015</code> serves <code>AssetStore</code>, '
        '<code>EmployeeStore</code>, <code>RequestStore</code> and <code>BorrowStore</code> — or when '
        'the file format <em>is</em> the assignment: zipping, CSV, copying, word-searching.',
        '<strong>Never in <code>utils/</code>.</strong> The only file writing that appears there across '
        'all 54 is <code>SampleData</code>, which creates the demo input so the first run has something '
        'to read. The program\'s own load and save are not utilities.'],
       ['<strong>Gộp</strong> khi một lớp <code>bo</code> giữ một tệp của một entity — '
        '<code>FruitManager</code> với <code>fruits.txt</code>, <code>DictionaryManager</code> với '
        '<code>dictionary.txt</code>. Nhét thêm <code>FileHelper</code> vào đó chỉ là một lớp trung '
        'gian không có gì biện minh, và bạn sẽ phải tự bảo vệ nó khi bị hỏi.',
        '<strong>Tách riêng</strong> khi nhiều lớp <code>bo</code> dùng chung một tệp — '
        '<code>DataStore</code> ở <code>P0014</code>/<code>P0015</code> phục vụ '
        '<code>AssetStore</code>, <code>EmployeeStore</code>, <code>RequestStore</code> và '
        '<code>BorrowStore</code> — hoặc khi <em>chính định dạng tệp</em> mới là đề bài: nén zip, CSV, '
        'sao chép, tìm từ trong tệp.',
        '<strong>Đừng bao giờ để trong <code>utils/</code>.</strong> Thứ duy nhất ghi tệp ở đó trong cả '
        '54 bài là <code>SampleData</code>, lớp tạo sẵn dữ liệu mẫu để lần chạy đầu có cái mà đọc. '
        'Phần đọc/ghi của chính chương trình không phải là tiện ích.'])

    practice([
        (543, 'Advanced I/O, NIO.2 and networking', 'I/O nâng cao, NIO.2 và mạng',
         'Files, streams and paths beyond the basics — 10 exercises',
         'Tệp, luồng và đường dẫn ở mức sâu hơn — 10 bài'),
        (253, 'Design patterns, lambdas, threads', 'Design pattern, lambda, luồng',
         'The patterns behind a layered program — 10 exercises',
         'Các mẫu thiết kế đứng sau một chương trình phân tầng — 10 bài'),
    ])
