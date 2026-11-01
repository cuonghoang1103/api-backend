/** PRO192 · ⭐ CS.2 — Stream API (Java 17): báo cáo điểm 3 pipeline, top 3 từ, toMap trùng khoá, câu 3 PE bằng stream (--release 8), sửa 3 lỗi Optional. Ý đề: gen/src/extra/cs2-on.txt + gen/java/cs2/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs2-bang-diem',
  tieuDe: { en: 'A grade report in three pipelines', vi: 'Báo cáo điểm bằng ba pipeline' },
  doKho: 'MEDIUM', phut: 30, java: 17,
  khaiNiem: ['Collectors.groupingBy(classifier, TreeMap::new, downstream)', 'averagingDouble', 'collectingAndThen + maxBy', 'counting', 'a fixed-order table with zero rows'],
  moTa: {
    en: `<p>Each input line is a student ${c('id;name;major;gpa')}. Print three reports, each built with ONE stream pipeline:</p>
<ol><li>${c('average by major:')} then one line per major in alphabetical order: ${c('  AI 8.63')} (two decimals);</li>
<li>${c('best by major: {AI=Giang, IS=Khoa, SE=Dung}')} — the name of the highest GPA per major (a tie keeps the student who comes first in the input), majors sorted;</li>
<li>${c('ranks:')} then the five ranks in this fixed order, <b>including those with 0 students</b>: ${c('  Excellent 3')} (GPA ≥ 9), ${c('Very good')} (≥ 8), ${c('Good')} (≥ 6.5), ${c('Average')} (≥ 5), ${c('Fail')}.</li></ol>`,
    vi: `<p>Mỗi dòng input là một sinh viên ${c('id;name;major;gpa')}. In ba báo cáo, mỗi báo cáo dựng bằng MỘT pipeline stream:</p>
<ol><li>${c('average by major:')} rồi mỗi ngành một dòng theo thứ tự chữ cái: ${c('  AI 8.63')} (hai chữ số thập phân);</li>
<li>${c('best by major: {AI=Giang, IS=Khoa, SE=Dung}')} — tên người GPA cao nhất mỗi ngành (hoà thì giữ người đứng trước trong input), ngành đã sắp;</li>
<li>${c('ranks:')} rồi năm hạng theo đúng thứ tự cố định, <b>kể cả hạng có 0 sinh viên</b>: ${c('  Excellent 3')} (GPA ≥ 9), ${c('Very good')} (≥ 8), ${c('Good')} (≥ 6.5), ${c('Average')} (≥ 5), ${c('Fail')}.</li></ol>`,
  },
  yeuCau: { en: ['Use groupingBy for the three reports (no hand-written accumulation loop).'], vi: ['Dùng groupingBy cho ba báo cáo (không vòng lặp cộng dồn viết tay).'] },
  dauVao: { en: 'One student per line: id;name;major;gpa.', vi: 'Mỗi dòng một sinh viên: id;name;major;gpa.' },
  dauRa: { en: 'The three reports.', vi: 'Ba báo cáo.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'built with Collectors.groupingBy', vi: 'dựng bằng Collectors.groupingBy', re: String.raw`groupingBy\s*\(`, need: true }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Main {
    record Student(String id, String name, String major, double gpa) {
    }

    static final String[] RANKS = {"Excellent", "Very good", "Good", "Average", "Fail"};

    static String rank(double gpa) {
        return gpa >= 9 ? RANKS[0] : gpa >= 8 ? RANKS[1] : gpa >= 6.5 ? RANKS[2] : gpa >= 5 ? RANKS[3] : RANKS[4];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Student> list = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (!line.isEmpty()) {
                String[] p = line.split(";");
                list.add(new Student(p[0].trim(), p[1].trim(), p[2].trim(), Double.parseDouble(p[3].trim())));
            }
        }
        System.out.println("average by major:");
        //>> // TODO 1: Map<String, Double> average per major, majors sorted, printed as "  AI 8.63"
        Map<String, Double> avg = list.stream()
                .collect(Collectors.groupingBy(Student::major, TreeMap::new, Collectors.averagingDouble(Student::gpa)));
        avg.forEach((major, a) -> System.out.printf("  %s %.2f%n", major, a));
        //<<
        //>> System.out.println("best by major: {}"); // TODO 2
        Map<String, String> best = list.stream()
                .collect(Collectors.groupingBy(Student::major, TreeMap::new,
                        Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparingDouble(Student::gpa)),
                                (Optional<Student> s) -> s.get().name())));
        System.out.println("best by major: " + best);
        //<<
        System.out.println("ranks:");
        //>> // TODO 3: the five ranks in the order of RANKS, zeros included
        Map<String, Long> counts = list.stream().collect(Collectors.groupingBy(s -> rank(s.gpa()), Collectors.counting()));
        Map<String, Long> table = new LinkedHashMap<>();
        for (String r : RANKS) {
            table.put(r, counts.getOrDefault(r, 0L));
        }
        table.forEach((r, n) -> System.out.println("  " + r + " " + n));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'eight students, three majors', vi: 'tám sinh viên, ba ngành' }, vao: 'S1;An;AI;9.1\nS2;Binh;SE;8.7\nS3;Chi;AI;7.4\nS4;Dung;SE;9.0\nS5;Em;IS;4.5\nS6;Giang;AI;9.4\nS7;Hoa;SE;6.5\nS8;Khoa;IS;5.0\n' },
    { ten: { en: 'a tie for the best, boundaries 9, 8, 6.5, 5 exactly', vi: 'hoà điểm cao nhất, đúng biên 9, 8, 6.5, 5' }, vao: 'A1;Lan;SE;9.0\nA2;Mai;SE;9.0\nA3;Nam;GD;8.0\nA4;Oanh;GD;6.5\nA5;Phu;GD;4.99\n', an: true },
    { ten: { en: 'one student', vi: 'một sinh viên' }, vao: 'X;Quy;MKT;5\n', an: true },
  ],
  goiY: [
    { en: 'groupingBy(Student::major, TreeMap::new, Collectors.averagingDouble(Student::gpa)) gives the averages already sorted by major.', vi: 'groupingBy(Student::major, TreeMap::new, Collectors.averagingDouble(Student::gpa)) cho trung bình đã sắp theo ngành.' },
    { en: 'Best per major: collectingAndThen(maxBy(comparingDouble(Student::gpa)), o -> o.get().name()).', vi: 'Giỏi nhất mỗi ngành: collectingAndThen(maxBy(comparingDouble(Student::gpa)), o -> o.get().name()).' },
    { en: 'groupingBy never creates a group with 0 elements — walk the fixed RANKS array and use getOrDefault(rank, 0L).', vi: 'groupingBy không bao giờ tạo nhóm 0 phần tử — đi theo mảng RANKS cố định và dùng getOrDefault(rank, 0L).' },
  ],
  loiHayGap: [
    { en: 'Printing the counting map directly — a HashMap’s order is not the rank order, and empty ranks are missing.', vi: 'In thẳng map đếm — thứ tự HashMap không phải thứ tự hạng, và hạng trống bị mất.' },
    { en: 'Using toMap(major, name) for the best student — it throws on the second student of the same major.', vi: 'Dùng toMap(major, name) cho người giỏi nhất — nó ném lỗi ở sinh viên thứ hai cùng ngành.' },
  ],
  giaiThich: { en: '<p>groupingBy(classifier, mapFactory, downstream) is the stream version of "a Map of accumulators": the map factory fixes the order, the downstream collector decides what each group becomes (an average, a max, a count).</p>', vi: '<p>groupingBy(classifier, mapFactory, downstream) là bản stream của "một Map các bộ cộng dồn": mapFactory quyết định thứ tự, collector downstream quyết định mỗi nhóm thành gì (trung bình, lớn nhất, số đếm).</p>' },
});

const de2 = deJava({
  id: 'pro192-cs2-top-3-tu',
  tieuDe: { en: 'The three most frequent words', vi: 'Ba từ xuất hiện nhiều nhất' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['flatMap over lines', 'groupingBy(identity, counting)', 'Map.Entry comparators', 'limit'],
  moTa: {
    en: `<p>Read all lines of text. A word is a run of letters (${c('a-z')}) and apostrophes, after lower-casing — so ${c('Don\'t')} and ${c('don\'t')} are the same word and ${c('java,')} is ${c('java')}. Print ${c('distinct: N')} and then ${c('top: [java=3, the=3, a=2]')} — the 3 most frequent words (fewer if there are fewer), by count descending, ties broken alphabetically. One pipeline for the counts, one for the top 3.</p>`,
    vi: `<p>Đọc mọi dòng văn bản. Một từ là một dãy chữ cái (${c('a-z')}) và dấu nháy đơn, sau khi đổi về chữ thường — nên ${c('Don\'t')} và ${c('don\'t')} là một từ, ${c('java,')} là ${c('java')}. In ${c('distinct: N')} rồi ${c('top: [java=3, the=3, a=2]')} — 3 từ nhiều nhất (ít hơn nếu không đủ), số lần giảm dần, hoà thì theo chữ cái. Một pipeline đếm, một pipeline lấy top 3.</p>`,
  },
  dauVao: { en: 'Any number of lines (possibly none).', vi: 'Số dòng bất kỳ (có thể không có).' },
  dauRa: { en: 'Two lines.', vi: 'Hai dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'the top 3 uses sorted(...) and limit(3)', vi: 'top 3 dùng sorted(...) và limit(3)', re: String.raw`\.limit\s*\(\s*3\s*\)`, need: true }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class Main {
    static final Pattern WORD = Pattern.compile("[a-z']+");

    static List<String> words(String line) {
        List<String> out = new ArrayList<>();
        Matcher m = WORD.matcher(line.toLowerCase());
        while (m.find()) {
            out.add(m.group());
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> lines = new ArrayList<>();
        while (sc.hasNextLine()) {
            lines.add(sc.nextLine());
        }
        //>> System.out.println("distinct: 0"); // TODO: count every word with one pipeline ⏎ System.out.println("top: []");     // TODO: the top 3, count desc then word
        Map<String, Long> counts = lines.stream()
                .flatMap(l -> words(l).stream())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        System.out.println("distinct: " + counts.size());
        List<String> top = counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry.comparingByKey()))
                .limit(3)
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.toList());
        System.out.println("top: " + top);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three lines of text', vi: 'ba dòng văn bản' }, vao: 'Java is a language. The JVM runs Java.\nthe stream API: java streams are lazy; the end.\nDon\'t mutate state in a lambda, don\'t!\n' },
    { ten: { en: 'ties everywhere and only two distinct words', vi: 'hoà khắp nơi và chỉ hai từ khác nhau' }, vao: 'b a b a\nA B\n', an: true },
    { ten: { en: 'no input', vi: 'không có input' }, vao: '', an: true },
  ],
  goiY: [
    { en: 'Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry.comparingByKey()) — the explicit type arguments help the compiler.', vi: 'Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()).thenComparing(Map.Entry.comparingByKey()) — đối số kiểu tường minh giúp trình biên dịch.' },
    { en: 'flatMap turns a stream of lines into a stream of words.', vi: 'flatMap biến stream các dòng thành stream các từ.' },
  ],
  loiHayGap: [
    { en: 'split(" ") — punctuation stays attached ("java," and "java." become different words).', vi: 'split(" ") — dấu câu dính vào từ ("java," và "java." thành hai từ khác nhau).' },
    { en: 'Sorting by count only — ties come out in HashMap order, different on another JDK.', vi: 'Chỉ sắp theo số lần — từ hoà ra theo thứ tự HashMap, khác nhau trên JDK khác.' },
  ],
  giaiThich: { en: '<p>Counting = groupingBy(identity, counting); ranking = sort the entries with a two-key comparator and limit. Each operation does one thing, which is what interviewers want to hear you say.</p>', vi: '<p>Đếm = groupingBy(identity, counting); xếp hạng = sắp các entry bằng comparator hai khoá rồi limit. Mỗi thao tác làm một việc — đúng điều người phỏng vấn muốn nghe bạn nói.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs2-tomap-trung-khoa',
  tieuDe: { en: 'A CSV with a repeated product code: toMap with a merge function', vi: 'CSV có mã sản phẩm lặp: toMap với hàm gộp' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['Collectors.toMap throws IllegalStateException on a duplicate key', 'groupingBy + counting + filter', 'toMap(key, value, merge, LinkedHashMap::new)'],
  moTa: {
    en: `<p>Each line is ${c('code,name,price')} (price in đồng, an integer). Print:</p>
<ol><li>${c('plain toMap: IllegalStateException')} if building ${c('Map<String, Product>')} with the 2-argument ${c('toMap')} fails, or ${c('plain toMap: ok (n codes)')} if the codes are unique;</li>
<li>${c('duplicated: [C07=2, P03=2]')} — codes that appear more than once with their counts, sorted by code (${c('[]')} if none);</li>
<li>then the map that keeps, for each code, the <b>more expensive</b> line (the first one on a tie), codes in the order they <b>first appear</b> in the file: one line ${c('P03 -> Mouse Pro 450000')} per code.</li></ol>`,
    vi: `<p>Mỗi dòng là ${c('code,name,price')} (giá đồng, số nguyên). In:</p>
<ol><li>${c('plain toMap: IllegalStateException')} nếu dựng ${c('Map<String, Product>')} bằng ${c('toMap')} hai tham số bị lỗi, hoặc ${c('plain toMap: ok (n codes)')} nếu mã không trùng;</li>
<li>${c('duplicated: [C07=2, P03=2]')} — các mã xuất hiện hơn một lần kèm số lần, sắp theo mã (${c('[]')} nếu không có);</li>
<li>rồi map giữ, với mỗi mã, dòng <b>đắt hơn</b> (hoà thì dòng đầu), mã theo thứ tự <b>xuất hiện lần đầu</b> trong tệp: mỗi mã một dòng ${c('P03 -> Mouse Pro 450000')}.</li></ol>`,
  },
  dauVao: { en: 'CSV lines code,name,price.', vi: 'Các dòng CSV code,name,price.' },
  dauRa: { en: 'Two lines, then one line per distinct code.', vi: 'Hai dòng, rồi mỗi mã khác nhau một dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'the kept-the-dearest map uses toMap with a merge function and LinkedHashMap::new', vi: 'map giữ dòng đắt dùng toMap có hàm gộp và LinkedHashMap::new', re: String.raw`LinkedHashMap\s*::\s*new`, need: true }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;

public class Main {
    record Product(String code, String name, long price) {
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Product> rows = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (!line.isEmpty()) {
                String[] p = line.split(",");
                rows.add(new Product(p[0].trim(), p[1].trim(), Long.parseLong(p[2].trim())));
            }
        }
        //>> // TODO: the three parts ⏎ System.out.println("plain toMap: ?");
        try {
            Map<String, Product> plain = rows.stream().collect(Collectors.toMap(Product::code, p -> p));
            System.out.println("plain toMap: ok (" + plain.size() + " codes)");
        } catch (IllegalStateException e) {
            System.out.println("plain toMap: IllegalStateException");
        }
        List<String> dup = rows.stream()
                .collect(Collectors.groupingBy(Product::code, TreeMap::new, Collectors.counting()))
                .entrySet().stream()
                .filter(e -> e.getValue() > 1)
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.toList());
        System.out.println("duplicated: " + dup);
        Map<String, Product> dearest = rows.stream()
                .collect(Collectors.toMap(Product::code, p -> p, (a, b) -> b.price() > a.price() ? b : a, LinkedHashMap::new));
        dearest.values().forEach(p -> System.out.println(p.code() + " -> " + p.name() + " " + p.price()));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'six lines, P03 and C07 repeated', vi: 'sáu dòng, P03 và C07 lặp' }, vao: 'P03,Mouse,250000\nC07,USB-C cable,90000\nK01,Keyboard,700000\nP03,Mouse Pro,450000\nC07,USB-C cable 2m,80000\nH02,Headset,550000\n' },
    { ten: { en: 'unique codes', vi: 'mã không trùng' }, vao: 'A1,Pen,5000\nB2,Book,85000\n', an: true },
    { ten: { en: 'three times the same code with a tie on price', vi: 'ba lần cùng mã, hoà giá' }, vao: 'Z9,Old,100\nY1,Ruler,7000\nZ9,New,300\nZ9,Newer,300\n', an: true },
  ],
  goiY: [
    { en: 'toMap(Product::code, p -> p, (a, b) -> b.price() > a.price() ? b : a, LinkedHashMap::new) — the merge function receives the old value first.', vi: 'toMap(Product::code, p -> p, (a, b) -> b.price() > a.price() ? b : a, LinkedHashMap::new) — hàm gộp nhận giá trị cũ trước.' },
    { en: 'Duplicates: groupingBy(code, TreeMap::new, counting()) then keep the entries whose value > 1.', vi: 'Mã trùng: groupingBy(code, TreeMap::new, counting()) rồi giữ entry có giá trị > 1.' },
  ],
  loiHayGap: [
    { en: 'A merge function (a, b) -> b — keeps the LAST line, not the dearest.', vi: 'Hàm gộp (a, b) -> b — giữ dòng CUỐI, không phải dòng đắt nhất.' },
    { en: 'Forgetting LinkedHashMap::new — the default HashMap loses the file order.', vi: 'Quên LinkedHashMap::new — HashMap mặc định làm mất thứ tự trong tệp.' },
  ],
  giaiThich: { en: '<p>The two-argument toMap assumes unique keys and fails loudly (IllegalStateException "Duplicate key …") — which is better than silently keeping one line. When duplicates are legal, say how to merge them and which map to build.</p>', vi: '<p>toMap hai tham số giả định khoá duy nhất và hỏng to tiếng (IllegalStateException "Duplicate key …") — tốt hơn lặng lẽ giữ một dòng. Khi trùng là hợp lệ, hãy nói rõ cách gộp và loại map cần dựng.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs2-pe-cau-3-stream',
  tieuDe: { en: 'PE question 3 with streams — that still compiles on JDK 8', vi: 'Câu 3 PE bằng stream — vẫn biên dịch trên JDK 8' },
  doKho: 'MEDIUM', phut: 30, java: 8,
  khaiNiem: ['interface given as in the PE', 'filter + mapToDouble + average().orElse(0)', 'List.sort with comparingInt + thenComparing', 'removeIf with the max computed first'],
  moTa: {
    en: `<p>The PE gives ${c('IBook')} (do not change it) and ${c('Book(title, price)')}. Write ${c('MyBook implements IBook')}:</p>
<ul><li>${c('f1(List<Book> t)')} — the average price of the books whose title contains ${c('"Java"')} (case-sensitive), 0 if none;</li>
<li>${c('f2(List<Book> t)')} — sort the list itself by title length ascending, then title alphabetically;</li>
<li>${c('f3(List<Book> t)')} — remove from the list itself every book having the highest price.</li></ul>
<p>Use streams / ${c('List.sort')} / ${c('removeIf')} where they help, but stay on Java 8 APIs: the exam room compiles with JDK 8 (no ${c('var')}, no ${c('List.of')}, no records). The given ${c('Main')} reads the books and runs the three functions on copies.</p>`,
    vi: `<p>Đề PE cho ${c('IBook')} (không sửa) và ${c('Book(title, price)')}. Viết ${c('MyBook implements IBook')}:</p>
<ul><li>${c('f1(List<Book> t)')} — giá trung bình của các sách có tên chứa ${c('"Java"')} (phân biệt hoa thường), không có thì 0;</li>
<li>${c('f2(List<Book> t)')} — sắp chính list đó theo độ dài tên tăng dần, rồi theo tên;</li>
<li>${c('f3(List<Book> t)')} — xoá khỏi chính list đó mọi sách có giá cao nhất.</li></ul>
<p>Dùng stream / ${c('List.sort')} / ${c('removeIf')} chỗ nào có ích, nhưng chỉ API Java 8: phòng thi biên dịch bằng JDK 8 (không ${c('var')}, không ${c('List.of')}, không record). ${c('Main')} cho sẵn đọc sách và chạy ba hàm trên các bản sao.</p>`,
  },
  yeuCau: { en: ['Do not change IBook.java, Book.java, Main.java.'], vi: ['Không sửa IBook.java, Book.java, Main.java.'] },
  dauVao: { en: 'One book per line: title;price.', vi: 'Mỗi dòng một sách: title;price.' },
  dauRa: { en: 'f1 with two decimals, then the lists after f2 and after f3.', vi: 'f1 với hai chữ số thập phân, rồi list sau f2 và sau f3.' },
  main: 'Main',
  tep: {
    'IBook.java': j`
import java.util.List;

// GIVEN (as in the PE) — do not change.
public interface IBook {
    double f1(List<Book> t);

    void f2(List<Book> t);

    void f3(List<Book> t);
}
`,
    'Book.java': j`
// GIVEN — do not change.
public class Book {
    private final String title;
    private final double price;

    public Book(String title, double price) {
        this.title = title;
        this.price = price;
    }

    public String getTitle() {
        return title;
    }

    public double getPrice() {
        return price;
    }

    @Override
    public String toString() {
        return title + "(" + price + ")";
    }
}
`,
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Book> books = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (!line.isEmpty()) {
                String[] p = line.split(";");
                books.add(new Book(p[0].trim(), Double.parseDouble(p[1].trim())));
            }
        }
        IBook my = new MyBook();
        System.out.printf("f1 = %.2f%n", my.f1(new ArrayList<>(books)));
        List<Book> a = new ArrayList<>(books);
        my.f2(a);
        System.out.println("f2 = " + a);
        List<Book> b = new ArrayList<>(books);
        my.f3(b);
        System.out.println("f3 = " + b);
    }
}
`,
    'MyBook.java': j`
import java.util.Comparator;
import java.util.List;

public class MyBook implements IBook {
    @Override
    public double f1(List<Book> t) {
        //>> return 0; // TODO
        return t.stream().filter(b -> b.getTitle().contains("Java")).mapToDouble(Book::getPrice).average().orElse(0);
        //<<
    }

    @Override
    public void f2(List<Book> t) {
        //>> // TODO
        t.sort(Comparator.comparingInt((Book b) -> b.getTitle().length()).thenComparing(Book::getTitle));
        //<<
    }

    @Override
    public void f3(List<Book> t) {
        //>> // TODO
        if (t.isEmpty()) {
            return;
        }
        final double max = t.stream().mapToDouble(Book::getPrice).max().getAsDouble();
        t.removeIf(b -> b.getPrice() == max);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'five books, two Java titles, two at the top price', vi: 'năm sách, hai tên Java, hai sách giá cao nhất' }, vao: 'Head First Java;12.5\nClean Code;30\nJava Puzzlers;8.25\nSQL;30\nC Book;4\n' },
    { ten: { en: 'no Java title (java in lower case does not count), a single top price', vi: 'không tên Java (java chữ thường không tính), một sách giá cao nhất' }, vao: 'learn java;10\nAlgorithms;99\nAI;5\nUML;5\n', an: true },
    { ten: { en: 'empty list', vi: 'list rỗng' }, vao: '', an: true },
  ],
  goiY: [
    { en: 'f1: filter → mapToDouble(Book::getPrice) → average() is an OptionalDouble ⇒ orElse(0).', vi: 'f1: filter → mapToDouble(Book::getPrice) → average() là OptionalDouble ⇒ orElse(0).' },
    { en: 'f3: compute the max FIRST (a final local), then removeIf(b -> b.getPrice() == max).', vi: 'f3: tính max TRƯỚC (biến cục bộ final), rồi removeIf(b -> b.getPrice() == max).' },
  ],
  loiHayGap: [
    { en: 'f2 returning a sorted copy (stream().sorted().collect…) — the PE checks the list it passed in, which did not change.', vi: 'f2 trả bản sao đã sắp (stream().sorted().collect…) — PE kiểm chính list đã truyền vào, mà list đó không đổi.' },
    { en: 'f3 removing only the first book with the highest price.', vi: 'f3 chỉ xoá cuốn đầu tiên có giá cao nhất.' },
    { en: 'max() on an empty list: getAsDouble() throws — guard the empty case.', vi: 'max() trên list rỗng: getAsDouble() ném lỗi — chặn trường hợp rỗng.' },
  ],
  giaiThich: { en: '<p>Streams are Java 8, so they are allowed in the exam room — but the functions that must CHANGE the list (f2, f3) use List.sort and removeIf, which work in place. The comparator needs the explicit (Book b) because thenComparing cannot infer it from a lambda alone.</p>', vi: '<p>Stream có từ Java 8 nên dùng được ở phòng thi — nhưng các hàm phải ĐỔI list (f2, f3) dùng List.sort và removeIf, làm tại chỗ. Comparator cần (Book b) tường minh vì thenComparing không suy ra được kiểu từ lambda trần.</p>' },
});

const de5 = deJava({
  id: 'pro192-cs2-sua-optional',
  tieuDe: { en: 'Fix three Optional mistakes (and count the database calls)', vi: 'Sửa ba lỗi Optional (và đếm số lần gọi cơ sở dữ liệu)' },
  doKho: 'MEDIUM', phut: 20, java: 17,
  khaiNiem: ['Optional is a return type, not a field', 'get() without a check', 'orElse evaluates its argument eagerly; orElseGet is lazy', 'map / orElse'],
  moTa: {
    en: `<p>${c('Account')} keeps the phone as an ${c('Optional<String>')} field and its ${c('phoneLabel()')} calls ${c('get()')}; ${c('Directory.find(user)')} looks in a cache and falls back with ${c('cache.lookup(user).orElse(db.load(user))')}. The given ${c('Main')} looks up users and prints the label of each, then how many times the (slow) database was called. Rewrite ${c('Account')} and ${c('Directory')} so that: the field is a plain ${c('String')} that may be null and ${c('phone()')} returns an ${c('Optional')}; nothing throws for a user without a phone (label ${c('no phone')}); the database is called <b>only</b> when the cache misses.</p>`,
    vi: `<p>${c('Account')} giữ số điện thoại trong một trường ${c('Optional<String>')} và ${c('phoneLabel()')} gọi ${c('get()')}; ${c('Directory.find(user)')} tìm trong cache rồi lùi về bằng ${c('cache.lookup(user).orElse(db.load(user))')}. ${c('Main')} cho sẵn tra từng người dùng, in nhãn của từng người, rồi in số lần gọi cơ sở dữ liệu (chậm). Viết lại ${c('Account')} và ${c('Directory')} sao cho: trường là ${c('String')} thường (có thể null) và ${c('phone()')} trả ${c('Optional')}; không gì ném lỗi với người không có số (nhãn ${c('no phone')}); cơ sở dữ liệu <b>chỉ</b> được gọi khi cache trượt.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java, Cache.java, Db.java.', 'No Optional field anywhere.'], vi: ['Không sửa Main.java, Cache.java, Db.java.', 'Không trường Optional nào.'] },
  dauVao: { en: 'User names, one per line.', vi: 'Tên người dùng, mỗi dòng một tên.' },
  dauRa: { en: 'One line per user, then the database call count.', vi: 'Mỗi người một dòng, rồi số lần gọi cơ sở dữ liệu.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'no Optional field', vi: 'không trường Optional', re: String.raw`^\s*(private|protected|public)?\s*(final\s+)?Optional\s*<[^>]*>\s+\w+\s*(=[^;]*)?;`, flags: 'gm' },
    { id: 'R2', en: 'no bare Optional.get()', vi: 'không gọi get() trần trên Optional', re: String.raw`\.get\s*\(\s*\)`, file: '^(Account|Directory)\\.java$' },
  ],
  tep: {
    'Main.java': j`
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Db db = new Db();
        Directory dir = new Directory(new Cache(), db);
        while (sc.hasNextLine()) {
            String user = sc.nextLine().trim();
            if (!user.isEmpty()) {
                System.out.println(user + ": " + dir.find(user).phoneLabel());
            }
        }
        System.out.println("database calls: " + db.calls());
    }
}
`,
    'Cache.java': j`
import java.util.Map;
import java.util.Optional;

// GIVEN — do not change. Users whose name starts with a vowel are in the cache.
public class Cache {
    private final Map<String, String> phones = Map.of("an", "0901", "em", "0933", "oanh", "");

    public Optional<Account> lookup(String user) {
        if (!phones.containsKey(user)) {
            return Optional.empty();
        }
        String phone = phones.get(user);
        return Optional.of(new Account(user, phone.isEmpty() ? null : phone));
    }
}
`,
    'Db.java': j`
// GIVEN — do not change. A slow database: every call is counted.
public class Db {
    private int calls;

    public Account load(String user) {
        calls++;
        return new Account(user, user.length() % 2 == 0 ? "09" + user.length() + "0" : null);
    }

    public int calls() {
        return calls;
    }
}
`,
    'Account.java': j`
import java.util.Optional;

public class Account {
    private final String user;
    //>> private final Optional<String> phone; // TODO: a plain String that may be null
    private final String phone;
    //<<

    public Account(String user, String phone) {
        this.user = user;
        //>> this.phone = Optional.ofNullable(phone);
        this.phone = phone;
        //<<
    }

    public String user() {
        return user;
    }

    public Optional<String> phone() {
        //>> return phone;
        return Optional.ofNullable(phone);
        //<<
    }

    public String phoneLabel() {
        //>> return "phone " + phone.get(); // TODO: "no phone" when there is none — without get()
        return phone().map(p -> "phone " + p).orElse("no phone");
        //<<
    }
}
`,
    'Directory.java': j`
public class Directory {
    private final Cache cache;
    private final Db db;

    public Directory(Cache cache, Db db) {
        this.cache = cache;
        this.db = db;
    }

    public Account find(String user) {
        //>> return cache.lookup(user).orElse(db.load(user)); // TODO: call the database only on a cache miss
        return cache.lookup(user).orElseGet(() -> db.load(user));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'cached users with and without a phone, uncached users', vi: 'người trong cache có và không có số, người ngoài cache' }, vao: 'an\nbinh\noanh\nem\nchi\n' },
    { ten: { en: 'only cache hits — zero database calls', vi: 'chỉ trúng cache — không gọi cơ sở dữ liệu lần nào' }, vao: 'an\nem\nan\n', an: true },
    { ten: { en: 'only misses', vi: 'chỉ trượt cache' }, vao: 'hung\nlong\nkhoa\n', an: true },
  ],
  goiY: [
    { en: 'orElse(x) evaluates x before the call — even when the Optional has a value. orElseGet(() -> x) evaluates it only when empty.', vi: 'orElse(x) tính x TRƯỚC khi gọi — kể cả khi Optional có giá trị. orElseGet(() -> x) chỉ tính khi rỗng.' },
    { en: 'phoneLabel: phone().map(p -> "phone " + p).orElse("no phone").', vi: 'phoneLabel: phone().map(p -> "phone " + p).orElse("no phone").' },
  ],
  loiHayGap: [
    { en: 'phone.isPresent() ? phone.get() : … — works, but it is the null check in a heavier coat.', vi: 'phone.isPresent() ? phone.get() : … — chạy được, nhưng là kiểm null mặc áo nặng hơn.' },
    { en: 'Optional fields: not Serializable, an extra object per entity, and the field itself can still be null.', vi: 'Trường Optional: không Serializable, thêm một đối tượng mỗi thực thể, và chính trường đó vẫn có thể null.' },
  ],
  giaiThich: { en: '<p>Optional was designed as a return type that forces the caller to think about "absent". As a field it costs memory and solves nothing; with get() it becomes a NoSuchElementException instead of a NullPointerException; and orElse(expensiveCall()) pays the expensive call every time.</p>', vi: '<p>Optional được thiết kế làm kiểu trả về buộc nơi gọi nghĩ tới "không có". Làm trường thì tốn bộ nhớ mà không giải quyết gì; với get() nó chỉ đổi NullPointerException thành NoSuchElementException; còn orElse(gọiĐắt()) thì trả giá lời gọi đắt mọi lần.</p>' },
});

export default moDun({ slug: 'pro192-cs2-on', ten: '⭐ CS.2 Stream API (Java 17)', de: [de1, de2, de3, de4, de5] });
