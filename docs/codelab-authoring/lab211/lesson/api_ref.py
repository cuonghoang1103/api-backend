# Module: Java API reference for LAB211.
# Every "used in" list is computed from the 54 briefs, not guessed.
import json
from kit import h, p, ul, ol, table, code, out, mermaid, part, practice

USE = json.load(open('../api-usage.json'))


def used(key, en_extra='', vi_extra=''):
    """Render the honest 'which assignments need this' line."""
    labs = USE.get(key, [])
    shown = ', '.join(f'<code>{x}</code>' for x in labs[:10])
    more = f' … and {len(labs) - 10} more' if len(labs) > 10 else ''
    more_vi = f' … và {len(labs) - 10} bài nữa' if len(labs) > 10 else ''
    p(f'<p><strong>Needed by {len(labs)} of the 54 assignments</strong>{en_extra} — {shown}{more}.</p>',
      f'<p><strong>{len(labs)}/54 bài cần đến</strong>{vi_extra} — {shown}{more_vi}.</p>')


def build():
    part(1, 'How to use this reference', 'Cách dùng phần tra cứu này',
         'Every entry: what it does, a runnable example, the trap, and which assignments need it',
         'Mỗi mục: nó làm gì, ví dụ chạy được, cái bẫy, và bài nào cần đến nó')

    p('<p>This is the standard library, filtered down to what the LAB211 assignments actually use. '
      'Everything else in the JDK you can ignore for this course.</p>'
      '<p>Each entry ends with the exact list of assignments that need it. Those lists were produced by '
      'scanning all 54 briefs, so "needed by 51 of 54" is a measurement, not an impression. Every code '
      'example on this page was compiled with <code>javac</code> and run; the printed output is what the '
      'program really produced.</p>',
      '<p>Đây là thư viện chuẩn của Java, đã lọc xuống chỉ còn những gì các bài LAB211 thật sự dùng. Phần '
      'còn lại của JDK bạn có thể bỏ qua trong môn này.</p>'
      '<p>Cuối mỗi mục là danh sách chính xác những bài cần đến nó. Danh sách này được quét từ cả 54 đề, '
      'nên "51/54 bài cần" là số đo, không phải cảm nhận. Mọi ví dụ code trên trang này đều đã được biên '
      'dịch bằng <code>javac</code> và chạy thật; kết quả in ra là thứ chương trình thực sự sinh ra.</p>')

    # ── 1. INPUT ───────────────────────────────────────────────────
    part(2, 'Reading from the keyboard — Scanner',
         'Đọc từ bàn phím — Scanner',
         'The single most-used class in the whole track',
         'Lớp được dùng nhiều nhất trong cả lộ trình')

    used('scanner')

    table(['Method', 'Returns', 'Use it'],
          ['Phương thức', 'Trả về', 'Dùng khi'],
          [['<code>nextLine()</code>', 'the whole line as <code>String</code>', 'always — then convert'],
           ['<code>nextInt()</code>', 'an <code>int</code>', 'avoid: crashes on letters, leaves the newline'],
           ['<code>nextDouble()</code>', 'a <code>double</code>', 'same problem'],
           ['<code>hasNextLine()</code>', '<code>boolean</code>', 'reading a file line by line']],
          [['<code>nextLine()</code>', 'cả dòng, kiểu <code>String</code>', 'luôn dùng cái này — rồi tự chuyển kiểu'],
           ['<code>nextInt()</code>', 'một <code>int</code>', 'nên tránh: gặp chữ là chết, còn để lại ký tự xuống dòng'],
           ['<code>nextDouble()</code>', 'một <code>double</code>', 'cùng vấn đề'],
           ['<code>hasNextLine()</code>', '<code>boolean</code>', 'khi đọc tệp theo từng dòng']])

    code('One Scanner for the whole program', 'Một Scanner dùng cho cả chương trình',
         """import java.util.Scanner;

public class ScannerRef {
    // ONE instance, shared. Creating a second Scanner on System.in loses buffered
    // input, and closing one closes System.in for good.
    private static final Scanner SC = new Scanner(System.in);

    public static String ask(String prompt) {
        System.out.print(prompt);
        return SC.nextLine().trim();
    }

    public static void main(String[] args) {
        // Demonstrated without real input so the example is reproducible:
        Scanner fake = new Scanner("Tran Binh\\n25\\n");
        String name = fake.nextLine().trim();
        int age = Integer.parseInt(fake.nextLine().trim());
        System.out.println(name + " is " + age);
    }
}""")

    out('Real output', 'Kết quả chạy thật', 'Tran Binh is 25')

    p('<p><strong>Trap.</strong> Never call <code>SC.close()</code> in a menu program. Closing a Scanner '
      'closes the underlying <code>System.in</code>, and every later read throws '
      '<code>NoSuchElementException</code>. Open one, keep it, let the JVM clean up at exit.</p>',
      '<p><strong>Bẫy.</strong> Đừng bao giờ gọi <code>SC.close()</code> trong chương trình có menu. Đóng '
      'Scanner là đóng luôn <code>System.in</code> bên dưới, và mọi lần đọc sau đó sẽ ném '
      '<code>NoSuchElementException</code>. Mở một cái, giữ nguyên, để JVM tự dọn khi thoát.</p>')

    # ── 2. OUTPUT ──────────────────────────────────────────────────
    part(3, 'Printing — printf and String.format',
         'In ra màn hình — printf và String.format',
         'Making your screen match the picture in the brief',
         'Làm màn hình của bạn khớp với ảnh trong đề')

    used('printf', ' by name', ' nêu đích danh')

    table(['Specifier', 'Means', 'Example → result'],
          ['Ký hiệu', 'Nghĩa', 'Ví dụ → kết quả'],
          [['<code>%s</code>', 'text', '<code>%s</code> → <code>Binh</code>'],
           ['<code>%d</code>', 'integer', '<code>%d</code> → <code>7</code>'],
           ['<code>%.2f</code>', '2 decimals', '<code>%.2f</code> → <code>1234.50</code>'],
           ['<code>%-15s</code>', 'left-aligned, width 15', 'pads on the right'],
           ['<code>%10.2f</code>', 'right-aligned, width 10', 'pads on the left'],
           ['<code>%n</code>', 'newline', 'portable — prefer over <code>\\n</code>']],
          [['<code>%s</code>', 'văn bản', '<code>%s</code> → <code>Binh</code>'],
           ['<code>%d</code>', 'số nguyên', '<code>%d</code> → <code>7</code>'],
           ['<code>%.2f</code>', '2 chữ số thập phân', '<code>%.2f</code> → <code>1234.50</code>'],
           ['<code>%-15s</code>', 'canh trái, rộng 15', 'đệm khoảng trắng bên phải'],
           ['<code>%10.2f</code>', 'canh phải, rộng 10', 'đệm khoảng trắng bên trái'],
           ['<code>%n</code>', 'xuống dòng', 'đa nền tảng — nên dùng thay <code>\\n</code>']])

    code('printf builds the table; String.format returns it',
         'printf in ra bảng; String.format trả về chuỗi',
         """public class PrintRef {
    public static void main(String[] args) {
        String[][] rows = {{"D001", "Tran Binh", "1200"}, {"D002", "Le Hoa", "980.5"}};

        System.out.printf("%-6s %-12s %10s%n", "CODE", "NAME", "SALARY");
        for (String[] r : rows) {
            System.out.printf("%-6s %-12s %10.2f%n", r[0], r[1], Double.parseDouble(r[2]));
        }

        // String.format does the same but hands you the text — use it in toString()
        String line = String.format("%-6s %-12s %10.2f", "D003", "An", 500.0);
        System.out.println("[" + line + "]");
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """CODE   NAME             SALARY
D001   Tran Binh       1200.00
D002   Le Hoa           980.50
[D003   An               500.00]""")

    # ── 3. STRING ──────────────────────────────────────────────────
    part(4, 'String — the methods the briefs name',
         'String — những phương thức đề nhắc tới',
         'Searching by part of a name, splitting a data line, cleaning input',
         'Tìm theo một phần tên, tách dòng dữ liệu, làm sạch dữ liệu nhập')

    used('contains', ' for partial-name search', ' cho chức năng tìm theo một phần tên')

    code('Every String call this course needs',
         'Mọi lời gọi String mà môn này cần',
         """public class StringRef {
    public static void main(String[] args) {
        String raw = "  D001,Tran Binh,Cardiology  ";
        String s = raw.trim();

        System.out.println("[" + s + "]");
        System.out.println(s.length());
        System.out.println(s.isEmpty() + " " + "".isEmpty());

        String[] cols = s.split(",");                 // reading one data line
        System.out.println(cols.length + " | " + cols[1]);

        // case-insensitive partial search — the "search by part of name" rule
        String needle = "BINH";
        System.out.println(cols[1].toLowerCase().contains(needle.toLowerCase()));

        System.out.println(cols[1].substring(0, 4));  // Tran
        System.out.println(cols[1].indexOf("Binh"));  // 5
        System.out.println(cols[1].replace(" ", "_"));
        System.out.println(String.join(" | ", cols));

        System.out.println("abc".equals("ABC") + " " + "abc".equalsIgnoreCase("ABC"));
        System.out.println("D001".matches("D\\\\d{3}"));
        System.out.println("D1".matches("D\\\\d{3}"));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """[D001,Tran Binh,Cardiology]
25
false true
3 | Tran Binh
true
Tran
5
Tran_Binh
D001 | Tran Binh | Cardiology
false true
true
false""")

    p('<p><strong>Trap.</strong> <code>split(",")</code> on <code>"a,,b"</code> gives three parts with an '
      'empty middle; on <code>"a,b,"</code> it gives <strong>two</strong>, because trailing empties are '
      'dropped. If your file has an optional last column, check <code>cols.length</code> before touching '
      '<code>cols[3]</code> or you will meet <code>ArrayIndexOutOfBoundsException</code> on exactly one '
      'row of the marker\'s test data.</p>',
      '<p><strong>Bẫy.</strong> <code>split(",")</code> trên <code>"a,,b"</code> cho ba phần với phần giữa '
      'rỗng; nhưng trên <code>"a,b,"</code> lại chỉ cho <strong>hai</strong>, vì các phần rỗng ở cuối bị '
      'bỏ. Nếu tệp của bạn có cột cuối không bắt buộc, hãy kiểm tra <code>cols.length</code> trước khi '
      'chạm vào <code>cols[3]</code>, nếu không bạn sẽ gặp <code>ArrayIndexOutOfBoundsException</code> ở '
      'đúng một dòng trong dữ liệu thử của người chấm.</p>')

    code('Proving the split trap', 'Chứng minh cái bẫy của split',
         """System.out.println(java.util.Arrays.toString("a,,b".split(",")));
System.out.println("a,,b".split(",").length);
System.out.println(java.util.Arrays.toString("a,b,".split(",")));
System.out.println("a,b,".split(",").length);
System.out.println("a,b,".split(",", -1).length);   // -1 keeps the empties""",
         kind='fragment')

    out('Real output', 'Kết quả chạy thật', '[a, , b]\n3\n[a, b]\n2\n3')

    # ── 4. PARSING ─────────────────────────────────────────────────
    part(5, 'Turning text into numbers safely',
         'Chuyển văn bản thành số một cách an toàn',
         'Integer.parseInt, Double.parseDouble, and the exception that saves you',
         'Integer.parseInt, Double.parseDouble, và cái ngoại lệ cứu bạn')

    used('parse', ' explicitly (every brief that says “You must input digit”)',
         ' nêu rõ (mọi đề có câu “You must input digit”)')

    code('Parsing, and the guard around it', 'Chuyển kiểu, và lớp bảo vệ quanh nó',
         """public class ParseRef {
    /** null when the text is not an int — the caller decides what to say. */
    public static Integer toInt(String s) {
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static void main(String[] args) {
        System.out.println(toInt("42"));
        System.out.println(toInt("  42  "));   // trim saves you
        System.out.println(toInt("4.2"));      // null - not an int
        System.out.println(toInt("abc"));      // null
        System.out.println(toInt(""));         // null

        System.out.println(Double.parseDouble("1234.5"));
        System.out.println(Integer.parseInt("FF", 16));      // base 16
        System.out.println(Integer.toBinaryString(10));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '42\n42\nnull\nnull\nnull\n1234.5\n255\n1010')

    # ── 5. COLLECTIONS ─────────────────────────────────────────────
    part(6, 'Collections — List and Map',
         'Collections — List và Map',
         'Where your records live while the program runs',
         'Nơi các bản ghi của bạn nằm trong lúc chương trình chạy')

    used('list')

    code('List: the operations a CRUD program needs',
         'List: các thao tác một chương trình CRUD cần',
         """import java.util.*;

public class ListRef {
    public static void main(String[] args) {
        List<String> ids = new ArrayList<>();

        ids.add("D001");
        ids.add("D002");
        ids.add(1, "D003");                  // insert at a position

        System.out.println(ids + " size=" + ids.size());
        System.out.println(ids.get(0) + " " + ids.contains("D002") + " " + ids.indexOf("D002"));

        ids.set(0, "D009");                  // update
        ids.remove("D003");                  // delete by value
        System.out.println(ids);

        // iterate safely while deleting: go backwards
        List<Integer> nums = new ArrayList<>(List.of(1, 2, 2, 3));
        for (int i = nums.size() - 1; i >= 0; i--) {
            if (nums.get(i) == 2) nums.remove(i);
        }
        System.out.println(nums);

        List<String> copy = new ArrayList<>(ids);      // defensive copy
        Collections.reverse(copy);
        System.out.println(copy);
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '[D001, D003, D002] size=3\nD001 true 2\n[D009, D002]\n[1, 3]\n[D002, D009]')

    used('map', ' — the “check duplicate Id” rule', ' — dùng cho luật “check duplicate Id”')

    code('Map: instant lookup by id', 'Map: tra cứu tức thì theo mã',
         """import java.util.*;

public class MapRef {
    public static void main(String[] args) {
        Map<String, Double> salary = new LinkedHashMap<>();   // keeps insertion order

        salary.put("E001", 1200.0);
        salary.put("E002", 900.0);
        System.out.println(salary.containsKey("E001"));       // the duplicate check
        System.out.println(salary.get("E999"));               // null, NOT an error
        System.out.println(salary.getOrDefault("E999", 0.0));

        salary.put("E001", 1500.0);                           // same key replaces
        System.out.println(salary.size());

        for (Map.Entry<String, Double> e : salary.entrySet()) {
            System.out.printf("%s -> %.1f%n", e.getKey(), e.getValue());
        }
        salary.remove("E002");
        System.out.println(salary.keySet());
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'true\nnull\n0.0\n2\nE001 -> 1500.0\nE002 -> 900.0\n[E001]')

    p('<p><code>HashMap</code> has no order at all; <code>LinkedHashMap</code> keeps insertion order and '
      'costs nothing extra. Use the second one whenever you will print the contents — otherwise your '
      'listing comes out in a different order on the marker\'s machine than on yours.</p>',
      '<p><code>HashMap</code> không có thứ tự gì cả; <code>LinkedHashMap</code> giữ đúng thứ tự thêm vào '
      'mà không tốn thêm gì. Hãy dùng cái thứ hai mỗi khi bạn định in nội dung ra — nếu không, danh sách '
      'của bạn sẽ hiện ra theo thứ tự khác trên máy người chấm so với trên máy bạn.</p>')

    # ── 6. SORTING ─────────────────────────────────────────────────
    part(7, 'Sorting with the library', 'Sắp xếp bằng thư viện',
         'When the brief does NOT name an algorithm, use these',
         'Khi đề KHÔNG chỉ định thuật toán, hãy dùng những cái này')

    used('comparator')

    code('Arrays.sort, Collections.sort, Comparator',
         'Arrays.sort, Collections.sort, Comparator',
         """import java.util.*;

public class SortRef {
    record Doctor(String code, String name, double salary) {}

    public static void main(String[] args) {
        int[] nums = {5, 1, 12, -5};
        Arrays.sort(nums);                       // primitives, ascending only
        System.out.println(Arrays.toString(nums));

        List<String> names = new ArrayList<>(List.of("Le", "An", "Binh"));
        Collections.sort(names);                 // natural order
        System.out.println(names);
        names.sort(Comparator.reverseOrder());
        System.out.println(names);

        List<Doctor> ds = new ArrayList<>(List.of(
                new Doctor("D2", "Hoa", 900), new Doctor("D1", "An", 1500),
                new Doctor("D3", "Binh", 900)));

        ds.sort(Comparator.comparingDouble(Doctor::salary));
        System.out.println(ds.stream().map(Doctor::name).toList());

        ds.sort(Comparator.comparingDouble(Doctor::salary).reversed()
                          .thenComparing(Doctor::name));
        System.out.println(ds.stream().map(Doctor::name).toList());
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '[-5, 1, 5, 12]\n[An, Binh, Le]\n[Le, Binh, An]\n[Hoa, Binh, An]\n[An, Binh, Hoa]')

    p('<p><strong>Read the brief first.</strong> Seven assignments name the algorithm — for those, '
      '<code>Collections.sort</code> is a zero. Everywhere else it is the right answer and shows you know '
      'the library.</p>',
      '<p><strong>Đọc đề trước đã.</strong> Bảy bài chỉ đích danh thuật toán — với những bài đó, dùng '
      '<code>Collections.sort</code> là không điểm. Còn ở mọi chỗ khác thì nó là câu trả lời đúng và cho '
      'thấy bạn nắm được thư viện.</p>')

    # ── 7. MATH ────────────────────────────────────────────────────
    part(8, 'Math — geometry and random data',
         'Math — hình học và sinh dữ liệu ngẫu nhiên',
         'Areas, volumes, and the random arrays the sorting briefs ask for',
         'Diện tích, thể tích, và mảng ngẫu nhiên mà các đề sắp xếp yêu cầu')

    used('random', ' with a randomly generated array', ' có yêu cầu sinh mảng ngẫu nhiên')
    used('geometry', ' for geometry', ' cho phần hình học')

    code('Math in the two shapes this course needs',
         'Math ở hai dạng môn này cần',
         """import java.util.Arrays;

public class MathRef {
    public static void main(String[] args) {
        // 1. Random test data — "generate random integer in number range"
        int n = 8;
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = (int) (Math.random() * 100);      // 0..99
        }
        System.out.println(a.length + " values, all in range: "
                + Arrays.stream(a).allMatch(v -> v >= 0 && v < 100));

        // 2. Geometry
        double r = 2.0, side = 3.0;
        System.out.printf("circle area      %.2f%n", Math.PI * r * r);
        System.out.printf("circle perimeter %.2f%n", 2 * Math.PI * r);
        System.out.printf("sphere volume    %.2f%n", 4.0 / 3.0 * Math.PI * Math.pow(r, 3));
        System.out.printf("cube surface     %.2f%n", 6 * side * side);
        System.out.println(Math.sqrt(16) + " " + Math.abs(-7) + " " + Math.round(2.567));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        """8 values, all in range: true
circle area      12.57
circle perimeter 12.57
sphere volume    33.51
cube surface     54.00
4.0 7 3""")

    p('<p>Look at the first two numbers: a circle of radius 2 has the same area and perimeter to two '
      'decimals. That is a real coincidence at r=2, not a bug — but it is exactly the kind of thing that '
      'makes you doubt correct code at 1am, so it is worth having seen once.</p>',
      '<p>Nhìn hai con số đầu: hình tròn bán kính 2 có diện tích và chu vi bằng nhau tới hai chữ số thập '
      'phân. Đó là trùng hợp thật ở r=2, không phải lỗi — nhưng đúng là kiểu chuyện làm bạn nghi ngờ code '
      'đang đúng lúc 1 giờ sáng, nên gặp trước một lần là đáng.</p>')

    # ── 8. DATES ───────────────────────────────────────────────────
    part(9, 'Dates', 'Ngày tháng', 'Parsing, validating and formatting dd/MM/yyyy',
         'Đọc, kiểm tra hợp lệ và in ngày dạng dd/MM/yyyy')

    used('date')

    p('<p><strong>Read this before you write a date check.</strong> By default '
      '<code>DateTimeFormatter</code> resolves dates in SMART mode, which quietly <em>clamps</em> an '
      'impossible day instead of refusing it: <code>31/02/2003</code> comes back as '
      '<code>2003-02-28</code>. Your validation passes and the stored date is not the one the user '
      'typed. To make it refuse, ask for STRICT mode — and STRICT requires the year pattern '
      '<code>uuuu</code> rather than <code>yyyy</code>, because <code>yyyy</code> means "year of era" '
      'and is ambiguous without an era.</p>',
      '<p><strong>Đọc phần này trước khi viết kiểm tra ngày.</strong> Mặc định '
      '<code>DateTimeFormatter</code> phân giải ngày ở chế độ SMART, tức là nó lặng lẽ <em>nắn</em> một '
      'ngày không tồn tại thay vì từ chối: <code>31/02/2003</code> trả về thành <code>2003-02-28</code>. '
      'Phần kiểm tra của bạn vẫn báo hợp lệ còn ngày được lưu thì không phải ngày người dùng gõ. Muốn nó '
      'từ chối thì phải bật chế độ STRICT — và STRICT đòi mẫu năm là <code>uuuu</code> chứ không phải '
      '<code>yyyy</code>, vì <code>yyyy</code> nghĩa là "năm trong kỷ nguyên" và sẽ nhập nhằng khi không '
      'nêu kỷ nguyên.</p>')

    code('LocalDate, and the two resolver modes',
         'LocalDate, và hai chế độ phân giải',
         """import java.time.*;
import java.time.format.*;

public class DateRef {
    // SMART (the default) clamps 31/02 to 28/02. STRICT refuses it.
    private static final DateTimeFormatter LOOSE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd/MM/uuuu").withResolverStyle(ResolverStyle.STRICT);

    /** null when the text is not a real date — 31/02 included. */
    public static LocalDate parse(String s) {
        try {
            return LocalDate.parse(s.trim(), FMT);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    public static void main(String[] args) {
        LocalDate d = parse("03/11/2003");
        System.out.println(d + " | " + d.format(FMT) + " | year " + d.getYear());
        System.out.println(LocalDate.parse("31/02/2003", LOOSE));   // 2003-02-28 - CLAMPED!
        System.out.println(parse("31/02/2003"));      // null - STRICT refuses it
        System.out.println(parse("29/02/2024"));      // 2024-02-29 - a real leap day
        System.out.println(parse("2003-11-03"));      // null - wrong pattern
        System.out.println(d.isBefore(LocalDate.of(2010, 1, 1)));
        System.out.println(Period.between(d, LocalDate.of(2026, 7, 21)).getYears() + " years old");
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '2003-11-03 | 03/11/2003 | year 2003\n2003-02-28\nnull\n2024-02-29\nnull\ntrue\n22 years old')

    p('<p>Line two is the warning: the default formatter turned an impossible date into a valid one '
      'without a word. Line three is the fix. Line four shows STRICT is not merely fussy — it accepts '
      '29 February 2024 because 2024 really is a leap year, so you never write that rule yourself.</p>',
      '<p>Dòng hai là lời cảnh báo: bộ định dạng mặc định đã biến một ngày không tồn tại thành một ngày '
      'hợp lệ mà không nói gì. Dòng ba là cách sửa. Dòng bốn cho thấy STRICT không phải khó tính vô cớ — '
      'nó vẫn nhận ngày 29/02/2024 vì 2024 đúng là năm nhuận, nên bạn không bao giờ phải tự viết luật '
      'đó.</p>')

    # ── 9. FILES ───────────────────────────────────────────────────
    part(10, 'Files', 'Tệp tin', 'Text, CSV and the .dat archives of the Long assignments',
         'Văn bản, CSV và các tệp .dat của bài Long')

    used('read', ' read a file', ' có đọc tệp')
    used('write', ' write a file', ' có ghi tệp')

    table(['Class', 'Direction', 'Use it for'],
          ['Lớp', 'Chiều', 'Dùng cho'],
          [['<code>BufferedReader</code> + <code>FileReader</code>', 'in', 'text, line by line'],
           ['<code>PrintWriter</code> + <code>FileWriter</code>', 'out', 'text, with <code>println</code>'],
           ['<code>ObjectInputStream</code>', 'in', 'a <code>.dat</code> of serialised objects'],
           ['<code>ObjectOutputStream</code>', 'out', 'the same'],
           ['<code>File</code>', '—', '<code>exists()</code>, <code>delete()</code>, <code>length()</code>']],
          [['<code>BufferedReader</code> + <code>FileReader</code>', 'vào', 'văn bản, từng dòng'],
           ['<code>PrintWriter</code> + <code>FileWriter</code>', 'ra', 'văn bản, dùng <code>println</code>'],
           ['<code>ObjectInputStream</code>', 'vào', 'tệp <code>.dat</code> chứa đối tượng đã tuần tự hoá'],
           ['<code>ObjectOutputStream</code>', 'ra', 'như trên'],
           ['<code>File</code>', '—', '<code>exists()</code>, <code>delete()</code>, <code>length()</code>']])

    code('The complete load/save pair, with the empty-first-run case',
         'Cặp nạp/lưu đầy đủ, có xử lý lần chạy đầu chưa có tệp',
         """import java.io.*;
import java.util.*;

public class FileRef {
    private static final String PATH = "ref-demo.txt";

    public static void save(List<String[]> rows) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter(PATH))) {
            for (String[] r : rows) out.println(String.join(",", r));
        }
    }

    public static List<String[]> load() throws IOException {
        List<String[]> rows = new ArrayList<>();
        File f = new File(PATH);
        if (!f.exists()) return rows;             // first run: empty, not a crash
        try (BufferedReader in = new BufferedReader(new FileReader(f))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (!line.isBlank()) rows.add(line.split(","));
            }
        }
        return rows;
    }

    public static void main(String[] args) throws IOException {
        System.out.println("before any file: " + load().size());
        save(List.of(new String[]{"D001", "Tran Binh"}, new String[]{"D002", "Le Hoa"}));
        for (String[] r : load()) System.out.println(r[0] + " " + r[1]);
        System.out.println(new File(PATH).length() > 0);
        new File(PATH).delete();
        System.out.println("after delete: " + load().size());
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'before any file: 0\nD001 Tran Binh\nD002 Le Hoa\ntrue\nafter delete: 0')

    # ── 10. EXCEPTIONS + REGEX ─────────────────────────────────────
    part(11, 'Exceptions and regular expressions',
         'Ngoại lệ và biểu thức chính quy',
         'The two tools every validation rule is built from',
         'Hai công cụ dựng nên mọi luật kiểm tra dữ liệu')

    used('exception')
    used('regex', ' state a format rule', ' có nêu luật về định dạng')

    table(['Exception', 'Thrown by', 'Catch it?'],
          ['Ngoại lệ', 'Ném ra bởi', 'Có bắt không?'],
          [['<code>NumberFormatException</code>', '<code>parseInt</code>', 'yes — this is normal input'],
           ['<code>DateTimeParseException</code>', '<code>LocalDate.parse</code>', 'yes'],
           ['<code>IOException</code>', 'file reads and writes', 'yes'],
           ['<code>NullPointerException</code>', 'your own bug', 'no — fix the cause'],
           ['<code>IndexOutOfBoundsException</code>', 'your own bug', 'no — fix the bound']],
          [['<code>NumberFormatException</code>', '<code>parseInt</code>', 'có — đây là dữ liệu nhập bình thường'],
           ['<code>DateTimeParseException</code>', '<code>LocalDate.parse</code>', 'có'],
           ['<code>IOException</code>', 'đọc/ghi tệp', 'có'],
           ['<code>NullPointerException</code>', 'lỗi của chính bạn', 'không — sửa nguyên nhân'],
           ['<code>IndexOutOfBoundsException</code>', 'lỗi của chính bạn', 'không — sửa lại cận']])

    code('Regex patterns you can defend', 'Các mẫu regex bạn bảo vệ được',
         """public class RegexRef {
    public static void main(String[] args) {
        System.out.println("D001".matches("D\\\\d{3}"));            // id: letter + 3 digits
        System.out.println("D01".matches("D\\\\d{3}"));

        System.out.println("0912345678".matches("0\\\\d{9}"));      // VN phone
        System.out.println("912345678".matches("0\\\\d{9}"));

        System.out.println("Tran Binh".matches("[A-Za-z ]+"));    // letters and spaces
        System.out.println("Tran B1nh".matches("[A-Za-z ]+"));

        System.out.println("a@b.com".matches("^[\\\\w.]+@[\\\\w]+\\\\.[a-z]{2,}$"));
        System.out.println("a@b".matches("^[\\\\w.]+@[\\\\w]+\\\\.[a-z]{2,}$"));

        System.out.println("42".matches("\\\\d+") + " " + "-42".matches("-?\\\\d+"));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        'true\nfalse\ntrue\nfalse\ntrue\nfalse\ntrue\nfalse\ntrue true')

    p('<p>In Java source each backslash is written twice: the pattern <code>\\d{3}</code> becomes the '
      'literal <code>"\\\\d{3}"</code>. Miss the second one and the compiler rejects it, which is the '
      'kindest possible failure.</p>',
      '<p>Trong mã nguồn Java, mỗi dấu gạch chéo ngược phải viết hai lần: mẫu <code>\\d{3}</code> trở '
      'thành chuỗi <code>"\\\\d{3}"</code>. Quên cái thứ hai thì trình biên dịch từ chối ngay, và đó là '
      'kiểu lỗi tử tế nhất có thể.</p>')

    # ── 11. OOP contracts ──────────────────────────────────────────
    part(12, 'Class contracts — abstract, interface, Object methods',
         'Hợp đồng của lớp — abstract, interface, các hàm của Object',
         'What the hierarchy briefs are actually checking',
         'Thứ mà các đề về cây phân cấp thật sự kiểm tra')

    used('abstract')
    used('interface')

    code('Object methods worth overriding', 'Các hàm của Object đáng ghi đè',
         """import java.util.*;

public class ObjectRef {
    static class Fruit {
        private final String id;
        private final String name;
        Fruit(String id, String name) { this.id = id; this.name = name; }

        @Override public String toString() { return id + ":" + name; }

        @Override public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Fruit other)) return false;
            return id.equals(other.id);            // identity is the id
        }

        @Override public int hashCode() { return id.hashCode(); }
    }

    public static void main(String[] args) {
        List<Fruit> basket = new ArrayList<>(List.of(new Fruit("F1", "Apple"),
                                                     new Fruit("F2", "Mango")));
        System.out.println(basket);                                  // toString
        System.out.println(basket.contains(new Fruit("F1", "any")));  // equals
        System.out.println(new HashSet<>(basket).size());             // hashCode

        Set<Fruit> set = new HashSet<>(basket);
        set.add(new Fruit("F1", "Apple again"));   // same id -> not added
        System.out.println(set.size());
    }
}""")

    out('Real output', 'Kết quả chạy thật', '[F1:Apple, F2:Mango]\ntrue\n2\n2')

    p('<p>The last line is the reason <code>hashCode</code> must be overridden with '
      '<code>equals</code>: the set refused the duplicate id. Override only <code>equals</code> and the '
      'set would have accepted it, because it looks in the wrong bucket first.</p>',
      '<p>Dòng cuối chính là lý do phải ghi đè <code>hashCode</code> cùng với <code>equals</code>: tập hợp '
      'đã từ chối mã bị trùng. Nếu chỉ ghi đè <code>equals</code>, tập hợp sẽ nhận nó vào, vì nó tìm nhầm '
      'ngăn trước đã.</p>')

    # ── 12. rarities ───────────────────────────────────────────────
    part(13, 'The rare ones — StringBuilder, MD5, zip',
         'Những thứ hiếm gặp — StringBuilder, MD5, zip',
         'Needed by only a handful of assignments, but needed exactly',
         'Chỉ vài bài cần, nhưng bài nào cần thì phải đúng')

    used('sb', ' build text in a loop', ' có ghép chuỗi trong vòng lặp')
    used('md5')
    used('zip')

    code('StringBuilder and MD5', 'StringBuilder và MD5',
         """import java.security.MessageDigest;

public class RareRef {
    /** The MD5 hex digest — what the login brief means by "MD5 encryption". */
    public static String md5(String text) throws Exception {
        byte[] digest = MessageDigest.getInstance("MD5").digest(text.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : digest) {
            sb.append(String.format("%02x", b));     // two hex digits per byte
        }
        return sb.toString();
    }

    public static void main(String[] args) throws Exception {
        StringBuilder sb = new StringBuilder();
        for (int i = 3; i >= 1; i--) sb.append(i).append(i > 1 ? "-" : "");
        System.out.println(sb + " | " + sb.reverse());

        System.out.println(md5("123456"));
        System.out.println(md5("123456").length());
        System.out.println(md5("123456").equals(md5("123456")));
    }
}""")

    out('Real output', 'Kết quả chạy thật',
        '3-2-1 | 1-2-3\ne10adc3949ba59abbe56e057f20f883e\n32\ntrue')

    p('<p>MD5 always produces 32 hex characters, and the same input always gives the same digest — which '
      'is exactly why a login can compare hashes without ever storing the password. It is also why MD5 is '
      'not considered secure any more; say that in a defence and you have answered the follow-up before '
      'it was asked.</p>',
      '<p>MD5 luôn cho ra 32 ký tự hex, và cùng một đầu vào luôn cho cùng một kết quả — đó chính là lý do '
      'chức năng đăng nhập có thể so sánh mã băm mà không bao giờ phải lưu mật khẩu. Đó cũng là lý do MD5 '
      'ngày nay không còn được coi là an toàn; nói câu đó lúc vấn đáp là bạn đã trả lời xong câu hỏi tiếp '
      'theo trước khi nó được hỏi.</p>')

    practice([
        (251, 'Collections framework', 'Collections framework',
         'Drill List, Map and Set until they are automatic',
         'Luyện List, Map và Set tới mức thành phản xạ'),
        (252, 'Exception handling, I/O and generics', 'Xử lý ngoại lệ, I/O và generic',
         'The file and exception APIs on this page, with graded exercises',
         'Các API tệp và ngoại lệ trên trang này, kèm bài tập có chấm'),
    ])
