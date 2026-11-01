/** PRO192 · ⭐ CS.1 — Generics & lambda (Java 17): max với Comparable<? super T>, hàm PECS, sắp nhiều khoá, kho generic kiểu Spring Data, lớp ẩn danh → lambda. Ý đề: gen/src/extra/cs1-on.txt + gen/java/cs1/Bt*.java. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-cs1-max-generic',
  tieuDe: { en: 'A generic max that accepts List<LocalDate>, any Collection and inherited ordering', vi: 'Hàm max generic nhận List<LocalDate>, mọi Collection và thứ tự kế thừa' },
  doKho: 'MEDIUM', phut: 20, java: 17, khoiDauLoi: true,
  khaiNiem: ['bounded type parameter', 'Comparable<? super T>', 'Collection<? extends T>', 'LocalDate is Comparable<ChronoLocalDate>'],
  moTa: {
    en: `<p>${c('Util.max')} was written the textbook way: ${c('static <T extends Comparable<T>> T max(List<T> xs)')}. The given ${c('Main')} (do not change it) calls it with a ${c('List<LocalDate>')}, a ${c('List<Integer>')}, a ${c('TreeSet<String>')} and a ${c('List<LabGrade>')} where ${c('LabGrade extends Grade')} and only ${c('Grade')} implements ${c('Comparable<Grade>')}. Three of those calls do not compile — read the errors: ${c('LocalDate')} is ${c('Comparable<ChronoLocalDate>')}, not ${c('Comparable<LocalDate>')}, and ${c('LabGrade')} inherits ${c('Comparable<Grade>')}.</p>
<p>Rewrite the signature (and the body) so that every call compiles and returns the right type — the shape of ${c('Collections.max')}. An empty collection throws ${c('NoSuchElementException("empty collection")')}; Main prints its message.</p>`,
    vi: `<p>${c('Util.max')} được viết theo kiểu sách giáo khoa: ${c('static <T extends Comparable<T>> T max(List<T> xs)')}. ${c('Main')} cho sẵn (không sửa) gọi nó với ${c('List<LocalDate>')}, ${c('List<Integer>')}, ${c('TreeSet<String>')} và ${c('List<LabGrade>')} trong đó ${c('LabGrade extends Grade')} và chỉ ${c('Grade')} hiện thực ${c('Comparable<Grade>')}. Ba lời gọi không biên dịch được — đọc lỗi: ${c('LocalDate')} là ${c('Comparable<ChronoLocalDate>')}, không phải ${c('Comparable<LocalDate>')}, còn ${c('LabGrade')} kế thừa ${c('Comparable<Grade>')}.</p>
<p>Viết lại chữ ký (và thân) để mọi lời gọi biên dịch được và trả đúng kiểu — hình dạng của ${c('Collections.max')}. Collection rỗng ném ${c('NoSuchElementException("empty collection")')}; Main in thông điệp của nó.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Do not call Collections.max — write the loop.'], vi: ['Không sửa Main.java.', 'Không gọi Collections.max — tự viết vòng lặp.'] },
  dauVao: { en: 'Lines "date …", "int …", "set …", "lab …" followed by values (possibly none).', vi: 'Các dòng "date …", "int …", "set …", "lab …" theo sau là các giá trị (có thể không có).' },
  dauRa: { en: 'One line per input line.', vi: 'Mỗi dòng input một dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no Collections.max / stream max — write the loop', vi: 'không Collections.max / stream max — tự viết vòng lặp', re: String.raw`Collections\s*\.\s*max|\.max\s*\(`, file: '^Util\\.java$' }],
  tep: {
    'Main.java': j`
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

// GIVEN — do not change.
public class Main {
    static class Grade implements Comparable<Grade> {
        final double value;

        Grade(double value) {
            this.value = value;
        }

        @Override
        public int compareTo(Grade other) {
            return Double.compare(value, other.value);
        }
    }

    // inherits Comparable<Grade> — it is NOT Comparable<LabGrade>
    static class LabGrade extends Grade {
        LabGrade(double value) {
            super(value);
        }

        @Override
        public String toString() {
            return "lab " + value;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split("\\s+");
            List<String> values = Arrays.asList(p).subList(1, p.length);
            try {
                switch (p[0]) {
                    case "date" -> {
                        List<LocalDate> dates = new ArrayList<>();
                        for (String v : values) {
                            dates.add(LocalDate.parse(v));
                        }
                        LocalDate latest = Util.max(dates);
                        System.out.println("latest date : " + latest);
                    }
                    case "int" -> {
                        List<Integer> ints = new ArrayList<>();
                        for (String v : values) {
                            ints.add(Integer.parseInt(v));
                        }
                        int best = Util.max(ints);
                        System.out.println("max int     : " + best);
                    }
                    case "set" -> {
                        Set<String> names = new TreeSet<>(values);
                        String last = Util.max(names);
                        System.out.println("max of set  : " + last);
                    }
                    case "lab" -> {
                        List<LabGrade> labs = new ArrayList<>();
                        for (String v : values) {
                            labs.add(new LabGrade(Double.parseDouble(v)));
                        }
                        LabGrade best = Util.max(labs);
                        System.out.println("best lab    : " + best);
                    }
                    default -> System.out.println("unknown: " + p[0]);
                }
            } catch (NoSuchElementException e) {
                System.out.println(p[0] + ": " + e.getMessage());
            }
        }
    }
}
`,
    'Util.java': j`
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

public class Util {
    //>> // TODO: this signature only accepts List<T> with T extends Comparable<T> — fix it (and the body) ⏎ public static <T extends Comparable<T>> T max(List<T> xs) { ⏎     return xs.get(0); ⏎ }
    public static <T extends Comparable<? super T>> T max(Collection<? extends T> xs) {
        Iterator<? extends T> it = xs.iterator();
        if (!it.hasNext()) {
            throw new NoSuchElementException("empty collection");
        }
        T best = it.next();
        while (it.hasNext()) {
            T x = it.next();
            if (x.compareTo(best) > 0) {
                best = x;
            }
        }
        return best;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the four kinds of collection', vi: 'bốn loại collection' }, vao: 'date 2026-10-20 2026-12-01 2026-11-05\nint 3 9 4\nset Binh An Hoa\nlab 7.5 9.25 8\n' },
    { ten: { en: 'empty collections and a single element', vi: 'collection rỗng và một phần tử' }, vao: 'date\nint -5\nset\nlab 6\nlab\n' },
    { ten: { en: 'max first, duplicates, negative numbers, dates across years', vi: 'lớn nhất ở đầu, trùng, số âm, ngày khác năm' }, vao: 'date 2027-01-01 2026-12-31 2026-02-28\nint -1 -9 -1 -3\nset zeta Alpha beta\nlab 10 10 2.5\n', an: true },
  ],
  goiY: [
    { en: 'Comparable<? super T>: "T can be compared with T or with one of its supertypes" — LocalDate (compareTo(ChronoLocalDate)) and LabGrade (compareTo(Grade)) both qualify.', vi: 'Comparable<? super T>: "T so sánh được với T hoặc một kiểu cha của T" — LocalDate (compareTo(ChronoLocalDate)) và LabGrade (compareTo(Grade)) đều thoả.' },
    { en: 'Collection<? extends T> reads from any collection (List, TreeSet…) of T or a subtype — use its iterator().', vi: 'Collection<? extends T> đọc từ mọi collection (List, TreeSet…) của T hoặc kiểu con — dùng iterator() của nó.' },
  ],
  loiHayGap: [
    { en: 'Changing Main (List<ChronoLocalDate>…) instead of the signature — every caller would have to adapt to a too-strict method.', vi: 'Sửa Main (List<ChronoLocalDate>…) thay vì sửa chữ ký — mọi nơi gọi phải chiều theo một hàm quá khắt khe.' },
    { en: 'Returning Comparable or Object: the caller then needs a cast — the type parameter T must stay the return type.', vi: 'Trả về Comparable hoặc Object: nơi gọi lại phải ép kiểu — tham số kiểu T phải là kiểu trả về.' },
  ],
  giaiThich: { en: '<p><code>&lt;T extends Comparable&lt;? super T&gt;&gt; T max(Collection&lt;? extends T&gt; xs)</code> is exactly the JDK’s <code>Collections.max</code>. The bound is a consumer of T (it takes T values to compare) ⇒ <code>super</code>; the collection is a producer of T ⇒ <code>extends</code> — PECS.</p>', vi: '<p><code>&lt;T extends Comparable&lt;? super T&gt;&gt; T max(Collection&lt;? extends T&gt; xs)</code> chính là <code>Collections.max</code> của JDK. Cận là nơi tiêu thụ T (nhận giá trị T để so) ⇒ <code>super</code>; collection là nơi sản xuất T ⇒ <code>extends</code> — PECS.</p>' },
});

const de2 = deJava({
  id: 'pro192-cs1-pecs',
  tieuDe: { en: 'A PECS utility: move the passing marks into one List<Number>', vi: 'Hàm PECS: chuyển điểm đạt vào một List<Number>' },
  doKho: 'MEDIUM', phut: 25, java: 17, khoiDauLoi: true,
  khaiNiem: ['? extends T (producer)', '? super T (consumer)', 'Predicate<? super T>', 'Collection<? extends Number>'],
  moTa: {
    en: `<p>${c('Marks.move(source, destination, condition)')} adds to ${c('destination')} every element of ${c('source')} that satisfies ${c('condition')} and returns how many it moved; ${c('Marks.average(xs)')} is the average of any collection of numbers (0 when empty). The given ${c('Main')} moves the passing lab marks (${c('List<Integer>')}) and PE marks (${c('List<Double>')}) into the same ${c('List<Number>')} with ONE ${c('Predicate<Number>')} "mark ≥ 5", averages three different lists, and moves the even lab marks into a ${c('Set<Object>')} with a ${c('Predicate<Integer>')}.</p>
<p>The starter signatures have no wildcards, so ${c('Main')} does not compile. Write the right wildcards (Producer Extends, Consumer Super) and the two bodies.</p>`,
    vi: `<p>${c('Marks.move(source, destination, condition)')} thêm vào ${c('destination')} mọi phần tử của ${c('source')} thoả ${c('condition')} và trả về số phần tử đã chuyển; ${c('Marks.average(xs)')} là trung bình của mọi collection số (rỗng thì 0). ${c('Main')} cho sẵn chuyển điểm lab đạt (${c('List<Integer>')}) và điểm PE đạt (${c('List<Double>')}) vào cùng một ${c('List<Number>')} bằng MỘT ${c('Predicate<Number>')} "điểm ≥ 5", lấy trung bình ba list khác kiểu, và chuyển điểm lab chẵn vào ${c('Set<Object>')} bằng ${c('Predicate<Integer>')}.</p>
<p>Chữ ký khởi đầu không có wildcard nên ${c('Main')} không biên dịch. Viết đúng wildcard (Producer Extends, Consumer Super) và hai thân hàm.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Keep the method names and parameter order.'], vi: ['Không sửa Main.java.', 'Giữ tên hàm và thứ tự tham số.'] },
  dauVao: { en: 'Line 1: lab marks (integers). Line 2: PE marks (decimals). Either may be empty.', vi: 'Dòng 1: điểm lab (số nguyên). Dòng 2: điểm PE (số thực). Có thể trống.' },
  dauRa: { en: 'Six lines (see the example).', vi: 'Sáu dòng (xem ví dụ).' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.function.Predicate;

// GIVEN — do not change.
public class Main {
    static List<String> tokens(Scanner sc) {
        List<String> out = new ArrayList<>();
        if (sc.hasNextLine()) {
            for (String t : sc.nextLine().trim().split("\\s+")) {
                if (!t.isEmpty()) {
                    out.add(t);
                }
            }
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> lab = new ArrayList<>();
        for (String t : tokens(sc)) {
            lab.add(Integer.parseInt(t));
        }
        List<Double> pe = new ArrayList<>();
        for (String t : tokens(sc)) {
            pe.add(Double.parseDouble(t));
        }
        List<Number> passed = new ArrayList<>();
        Predicate<Number> pass = n -> n.doubleValue() >= 5;
        int fromLab = Marks.move(lab, passed, pass);
        int fromPe = Marks.move(pe, passed, pass);
        System.out.println("moved from lab: " + fromLab + ", from PE: " + fromPe);
        System.out.println("passed: " + passed);
        System.out.printf("average lab %.2f | PE %.2f | passed %.2f%n", Marks.average(lab), Marks.average(pe), Marks.average(passed));
        Set<Object> evens = new LinkedHashSet<>();
        Predicate<Integer> even = n -> n % 2 == 0;
        System.out.println("even lab marks moved: " + Marks.move(lab, evens, even));
        System.out.println("set: " + evens);
        System.out.println("lab list unchanged: " + lab);
    }
}
`,
    'Marks.java': j`
import java.util.Collection;
import java.util.function.Predicate;

public class Marks {
    //>> // TODO: add the wildcards so that Main compiles, then write the body ⏎ public static <T> int move(Collection<T> source, Collection<T> destination, Predicate<T> condition) { ⏎     return 0; ⏎ }
    public static <T> int move(Collection<? extends T> source, Collection<? super T> destination, Predicate<? super T> condition) {
        int moved = 0;
        for (T x : source) {
            if (condition.test(x)) {
                destination.add(x);
                moved++;
            }
        }
        return moved;
    }
    //<<

    //>> // TODO: any collection of numbers; 0 when empty ⏎ public static double average(Collection<Number> xs) { ⏎     return 0; ⏎ }
    public static double average(Collection<? extends Number> xs) {
        if (xs.isEmpty()) {
            return 0;
        }
        double sum = 0;
        for (Number n : xs) {
            sum += n.doubleValue();
        }
        return sum / xs.size();
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'lab and PE marks', vi: 'điểm lab và PE' }, vao: '8 4 6 10 3\n7.5 4.75 9.25\n' },
    { ten: { en: 'no PE marks, nothing passes', vi: 'không có điểm PE, không ai đạt' }, vao: '1 2 3\n\n' },
    { ten: { en: 'boundaries 5 and 4.99, odd marks only', vi: 'biên 5 và 4.99, chỉ điểm lẻ' }, vao: '5 7 9 1\n4.99 5.0 10\n', an: true },
  ],
  goiY: [
    { en: 'move reads T from source ⇒ Collection<? extends T>; it writes T into destination ⇒ Collection<? super T>; the condition consumes T ⇒ Predicate<? super T>.', vi: 'move đọc T từ source ⇒ Collection<? extends T>; ghi T vào destination ⇒ Collection<? super T>; điều kiện tiêu thụ T ⇒ Predicate<? super T>.' },
    { en: 'average only reads ⇒ Collection<? extends Number>, then n.doubleValue().', vi: 'average chỉ đọc ⇒ Collection<? extends Number>, rồi n.doubleValue().' },
  ],
  loiHayGap: [
    { en: 'Writing Collection<?> for the destination — nothing (except null) can be added to it.', vi: 'Viết Collection<?> cho đích — không thêm được gì (trừ null).' },
    { en: 'Removing from source while moving — Main checks that the lab list is unchanged.', vi: 'Xoá khỏi source khi chuyển — Main kiểm list lab vẫn nguyên.' },
  ],
  giaiThich: { en: '<p>With the wildcards, the call with Predicate&lt;Number&gt; infers T = Integer (then Double) and destination List&lt;Number&gt; accepts it as a consumer of a supertype; the Set&lt;Object&gt; call infers T = Integer too. This is the signature of Collections.copy and of Stream.filter’s Predicate&lt;? super T&gt;.</p>', vi: '<p>Có wildcard, lời gọi với Predicate&lt;Number&gt; suy ra T = Integer (rồi Double) và đích List&lt;Number&gt; nhận vì là nơi tiêu thụ kiểu cha; lời gọi Set&lt;Object&gt; cũng suy ra T = Integer. Đây là chữ ký của Collections.copy và Predicate&lt;? super T&gt; của Stream.filter.</p>' },
});

const de3 = deJava({
  id: 'pro192-cs1-sap-nhieu-khoa',
  tieuDe: { en: 'Sort a class list by four keys — and the TreeSet that drops students', vi: 'Sắp danh sách lớp theo bốn khoá — và TreeSet làm rơi sinh viên' },
  doKho: 'MEDIUM', phut: 25, java: 17,
  khaiNiem: ['record', 'Comparator.comparing / thenComparing', 'Comparator.nullsLast', 'reverseOrder for one key only', 'TreeSet uses compare() == 0 as "duplicate"'],
  moTa: {
    en: `<p>Each input line is a student ${c('code;name;major;gpa')} (major ${c('-')} = none). Build ONE ${c('Comparator<Student>')} that orders by: major A→Z with students without a major <b>last</b>, then GPA high→low, then name ignoring case, then code. Print the sorted list as ${c('%-6s %-12s %-5s %.1f')} (a missing major prints ${c('-')}), then how many students a ${c('TreeSet')} keeps when ordered by GPA only, and when ordered by your full comparator:</p>
<pre>AI02   An           AI    9.0
...
TreeSet by GPA keeps 4 of 6
TreeSet by ORDER keeps 6 of 6</pre>`,
    vi: `<p>Mỗi dòng input là một sinh viên ${c('code;name;major;gpa')} (major ${c('-')} = không có). Dựng MỘT ${c('Comparator<Student>')} sắp theo: ngành A→Z, sinh viên không có ngành nằm <b>cuối</b>, rồi GPA cao→thấp, rồi tên không phân biệt hoa thường, rồi mã. In danh sách đã sắp theo ${c('%-6s %-12s %-5s %.1f')} (không có ngành in ${c('-')}), rồi số sinh viên một ${c('TreeSet')} giữ lại khi sắp chỉ theo GPA, và khi sắp theo comparator đầy đủ của bạn (như mẫu).</p>`,
  },
  yeuCau: { en: ['Store students in record Student(String code, String name, String major, double gpa) with major == null when the input says "-".', 'One comparator chain in the constant ORDER.'], vi: ['Lưu sinh viên trong record Student(String code, String name, String major, double gpa), major == null khi input là "-".', 'Một chuỗi comparator trong hằng ORDER.'] },
  dauVao: { en: 'One student per line: code;name;major;gpa.', vi: 'Mỗi dòng một sinh viên: code;name;major;gpa.' },
  dauRa: { en: 'The sorted list, then two TreeSet lines.', vi: 'Danh sách đã sắp, rồi hai dòng TreeSet.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'nulls handled with Comparator.nullsLast', vi: 'null xử lý bằng Comparator.nullsLast', re: String.raw`nullsLast\s*\(`, need: true }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

public class Main {
    record Student(String code, String name, String major, double gpa) {
    }

    //>> static final Comparator<Student> ORDER = Comparator.comparing(Student::code); // TODO: major (nulls last), GPA desc, name ignoring case, code
    static final Comparator<Student> ORDER = Comparator
            .comparing(Student::major, Comparator.nullsLast(Comparator.<String>naturalOrder()))
            .thenComparing(Student::gpa, Comparator.reverseOrder())
            .thenComparing(Student::name, String.CASE_INSENSITIVE_ORDER)
            .thenComparing(Student::code);
    //<<

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Student> list = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split(";");
            String major = p[2].trim().equals("-") ? null : p[2].trim();
            list.add(new Student(p[0].trim(), p[1].trim(), major, Double.parseDouble(p[3].trim())));
        }
        list.sort(ORDER);
        for (Student s : list) {
            System.out.printf("%-6s %-12s %-5s %.1f%n", s.code(), s.name(), s.major() == null ? "-" : s.major(), s.gpa());
        }
        Set<Student> byGpa = new TreeSet<>(Comparator.comparingDouble(Student::gpa));
        byGpa.addAll(list);
        Set<Student> byOrder = new TreeSet<>(ORDER);
        byOrder.addAll(list);
        System.out.println("TreeSet by GPA keeps " + byGpa.size() + " of " + list.size());
        System.out.println("TreeSet by ORDER keeps " + byOrder.size() + " of " + list.size());
    }
}
`,
  },
  ca: [
    { ten: { en: 'six students, two without a major', vi: 'sáu sinh viên, hai người không có ngành' }, vao: 'SE05;binh;SE;8.5\nAI02;An;AI;9.0\nXX09;Dung;-;9.5\nSE01;Binh;SE;8.5\nAI07;Chi;AI;9.0\nXX03;Em;-;7.0\n' },
    { ten: { en: 'same name in different case, same GPA everywhere', vi: 'cùng tên khác hoa thường, cùng GPA' }, vao: 'B2;hoa;IS;8.0\nB1;Hoa;IS;8.0\nA9;hoa;IS;8.0\nC1;An;-;8.0\nC0;an;-;8.0\n', an: true },
    { ten: { en: 'one student', vi: 'một sinh viên' }, vao: 'Z1;Zed;-;5.5\n', an: true },
  ],
  goiY: [
    { en: 'Comparator.comparing(Student::major, Comparator.nullsLast(Comparator.naturalOrder())) — the key extractor may return null, the inner comparator decides where null goes.', vi: 'Comparator.comparing(Student::major, Comparator.nullsLast(Comparator.naturalOrder())) — hàm lấy khoá có thể trả null, comparator bên trong quyết định null nằm đâu.' },
    { en: 'Reverse ONE key: .thenComparing(Student::gpa, Comparator.reverseOrder()).', vi: 'Đảo MỘT khoá: .thenComparing(Student::gpa, Comparator.reverseOrder()).' },
  ],
  loiHayGap: [
    { en: 'A .reversed() at the END of the chain reverses every key, not only the GPA.', vi: '.reversed() ở CUỐI chuỗi đảo mọi khoá, không chỉ GPA.' },
    { en: 'Comparator.comparing(Student::major) alone — a null major throws NullPointerException inside sort.', vi: 'Chỉ Comparator.comparing(Student::major) — ngành null ném NullPointerException trong sort.' },
    { en: 'Believing a TreeSet keeps every element — it treats compare(a, b) == 0 as "the same element".', vi: 'Tưởng TreeSet giữ mọi phần tử — nó coi compare(a, b) == 0 là "cùng một phần tử".' },
  ],
  giaiThich: { en: '<p>Each thenComparing only breaks ties of the previous keys. The last key (the unique code) makes the comparator consistent with equals for this data, so the TreeSet keeps everyone; ordered by GPA alone it keeps one student per GPA value.</p>', vi: '<p>Mỗi thenComparing chỉ phá thế hoà của các khoá trước. Khoá cuối (mã duy nhất) làm comparator nhất quán với equals trên dữ liệu này nên TreeSet giữ đủ; sắp chỉ theo GPA thì mỗi giá trị GPA giữ một sinh viên.</p>' },
});

const de4 = deJava({
  id: 'pro192-cs1-kho-generic',
  tieuDe: { en: 'A generic repository Repo<T, ID> — Spring Data’s shape in plain Java', vi: 'Kho generic Repo<T, ID> — hình dạng Spring Data bằng Java thuần' },
  doKho: 'HARD', phut: 35, java: 17,
  khaiNiem: ['generic class with two type parameters', 'Function<? super T, ? extends ID> as id extractor', 'Optional<T>', 'generic method <R> map', 'orElseThrow'],
  moTa: {
    en: `<p>Write ${c('Repo<T, ID>')}, an in-memory store that works for any entity: the constructor receives a function that reads the id of an entity. Methods: ${c('save(T)')} (insert or replace by id, returns the entity), ${c('findById(ID)')} → ${c('Optional<T>')}, ${c('findAll()')} (insertion order), ${c('findAll(Predicate<? super T>)')}, ${c('findAll(Comparator<? super T>)')}, ${c('<R> List<R> map(Function<? super T, ? extends R>)')}, ${c('deleteById(ID)')} → ${c('boolean')}, ${c('count()')}. ${c('findAll')} returns a new list — changing it must not change the store.</p>
<p>The given ${c('Main')} drives a ${c('Repo<Lab, Long>')} with commands (${c('add id name seats')}, ${c('get id')}, ${c('find id')}, ${c('big n')}, ${c('sorted')}, ${c('names')}, ${c('delete id')}, ${c('count')}) and finally a ${c('Repo<Book, String>')} to prove the class is really generic.</p>`,
    vi: `<p>Viết ${c('Repo<T, ID>')}, kho trong bộ nhớ dùng được cho mọi thực thể: constructor nhận một hàm đọc id của thực thể. Các hàm: ${c('save(T)')} (thêm hoặc thay theo id, trả thực thể), ${c('findById(ID)')} → ${c('Optional<T>')}, ${c('findAll()')} (thứ tự thêm), ${c('findAll(Predicate<? super T>)')}, ${c('findAll(Comparator<? super T>)')}, ${c('<R> List<R> map(Function<? super T, ? extends R>)')}, ${c('deleteById(ID)')} → ${c('boolean')}, ${c('count()')}. ${c('findAll')} trả list mới — sửa list đó không được làm đổi kho.</p>
<p>${c('Main')} cho sẵn điều khiển một ${c('Repo<Lab, Long>')} bằng lệnh (${c('add id name seats')}, ${c('get id')}, ${c('find id')}, ${c('big n')}, ${c('sorted')}, ${c('names')}, ${c('delete id')}, ${c('count')}) và cuối cùng một ${c('Repo<Book, String>')} để chứng minh lớp thật sự generic.</p>`,
  },
  yeuCau: { en: ['Do not change Main.java.', 'Keep the entities in a LinkedHashMap&lt;ID, T&gt; so that findAll() keeps insertion order (a replaced entity keeps its place).'], vi: ['Không sửa Main.java.', 'Giữ thực thể trong LinkedHashMap&lt;ID, T&gt; để findAll() giữ thứ tự thêm (thực thể bị thay giữ chỗ cũ).'] },
  dauVao: { en: 'Commands, one per line.', vi: 'Các lệnh, mỗi dòng một lệnh.' },
  dauRa: { en: 'One or more lines per command, then the Book check.', vi: 'Mỗi lệnh một hay vài dòng, rồi phần kiểm Book.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

// GIVEN — do not change.
public class Main {
    record Lab(Long id, String name, int seats) {
    }

    record Book(String isbn, String title) {
    }

    static class LabNotFound extends RuntimeException {
        LabNotFound(long id) {
            super("lab " + id + " not found");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Repo<Lab, Long> labs = new Repo<>(Lab::id);
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().trim().split("\\s+");
            switch (p[0]) {
                case "add" -> System.out.println("saved " + labs.save(new Lab(Long.parseLong(p[1]), p[2], Integer.parseInt(p[3]))));
                case "get" -> {
                    long id = Long.parseLong(p[1]);
                    try {
                        System.out.println(labs.findById(id).orElseThrow(() -> new LabNotFound(id)));
                    } catch (LabNotFound e) {
                        System.out.println("error: " + e.getMessage());
                    }
                }
                case "find" -> System.out.println(labs.findById(Long.parseLong(p[1])).map(Lab::name).orElse("(none)"));
                case "big" -> {
                    int n = Integer.parseInt(p[1]);
                    System.out.println("seats >= " + n + ": " + labs.findAll(l -> l.seats() >= n));
                }
                case "sorted" -> System.out.println(labs.findAll(Comparator.comparingInt(Lab::seats).reversed().thenComparing(Lab::name)));
                case "names" -> {
                    List<String> names = labs.map(Lab::name);
                    System.out.println(names);
                }
                case "delete" -> System.out.println("delete " + p[1] + ": " + labs.deleteById(Long.parseLong(p[1])));
                case "count" -> System.out.println("count = " + labs.count());
                default -> {
                }
            }
        }
        List<Lab> copy = labs.findAll();
        copy.clear();
        System.out.println("after clearing a copy: " + labs.count());
        Repo<Book, String> books = new Repo<>(Book::isbn);
        books.save(new Book("978-0134685991", "Effective Java"));
        books.save(new Book("978-0132350884", "Clean Code"));
        books.save(new Book("978-0134685991", "Effective Java 3rd"));
        List<Integer> lengths = books.map(b -> b.title().length());
        System.out.println("books " + books.count() + " " + books.findAll() + " " + lengths);
    }
}
`,
    'Repo.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Predicate;

public class Repo<T, ID> {
    private final Map<ID, T> data = new LinkedHashMap<>();
    private final Function<? super T, ? extends ID> idOf;

    public Repo(Function<? super T, ? extends ID> idOf) {
        this.idOf = idOf;
    }

    public T save(T entity) {
        //>> return entity; // TODO: store it under its id
        data.put(idOf.apply(entity), entity);
        return entity;
        //<<
    }

    public Optional<T> findById(ID id) {
        //>> return Optional.empty(); // TODO
        return Optional.ofNullable(data.get(id));
        //<<
    }

    public List<T> findAll() {
        //>> return new ArrayList<>(); // TODO: a NEW list, insertion order
        return new ArrayList<>(data.values());
        //<<
    }

    public List<T> findAll(Predicate<? super T> condition) {
        //>> return new ArrayList<>(); // TODO
        List<T> out = new ArrayList<>();
        for (T t : data.values()) {
            if (condition.test(t)) {
                out.add(t);
            }
        }
        return out;
        //<<
    }

    public List<T> findAll(Comparator<? super T> order) {
        //>> return new ArrayList<>(); // TODO
        List<T> out = findAll();
        out.sort(order);
        return out;
        //<<
    }

    public <R> List<R> map(Function<? super T, ? extends R> f) {
        //>> return new ArrayList<>(); // TODO
        List<R> out = new ArrayList<>();
        for (T t : data.values()) {
            out.add(f.apply(t));
        }
        return out;
        //<<
    }

    public boolean deleteById(ID id) {
        //>> return false; // TODO
        return data.remove(id) != null;
        //<<
    }

    public int count() {
        //>> return 0; // TODO
        return data.size();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'labs: add, get, filters, sort, map, delete', vi: 'phòng lab: thêm, lấy, lọc, sắp, map, xoá' }, vao: 'add 1 LAB-A 30\nadd 2 LAB-B 45\nadd 3 LAB-C 30\nget 2\nget 9\nfind 3\nbig 40\nsorted\nnames\ndelete 1\ndelete 1\ncount\n' },
    { ten: { en: 'replace an entity by id (keeps its place), empty store', vi: 'thay thực thể theo id (giữ chỗ), kho rỗng' }, vao: 'count\nnames\nget 1\nadd 7 R7 10\nadd 5 R5 50\nadd 7 R7-new 60\nnames\nsorted\nbig 60\ncount\n', an: true },
  ],
  goiY: [
    { en: 'findById: Optional.ofNullable(data.get(id)).', vi: 'findById: Optional.ofNullable(data.get(id)).' },
    { en: 'Return new ArrayList<>(data.values()) — never data.values() itself.', vi: 'Trả new ArrayList<>(data.values()) — không bao giờ trả chính data.values().' },
  ],
  loiHayGap: [
    { en: 'Storing entities in a List and searching it linearly — a replaced id then appears twice.', vi: 'Lưu thực thể trong List rồi tìm tuần tự — id bị thay sẽ xuất hiện hai lần.' },
    { en: 'Returning null instead of Optional.empty() — Main’s orElseThrow would get a NullPointerException.', vi: 'Trả null thay vì Optional.empty() — orElseThrow của Main nhận NullPointerException.' },
  ],
  giaiThich: { en: '<p>This is the shape of Spring Data’s CrudRepository&lt;T, ID&gt;: an id extractor, Optional for "maybe absent", and every function parameter written with PECS wildcards so that a Predicate&lt;Object&gt; or a Comparator of a supertype is accepted too.</p>', vi: '<p>Đây là hình dạng CrudRepository&lt;T, ID&gt; của Spring Data: hàm lấy id, Optional cho "có thể không có", và mọi tham số hàm viết wildcard PECS để Predicate&lt;Object&gt; hay Comparator của kiểu cha cũng dùng được.</p>' },
});

const de5 = deJava({
  id: 'pro192-cs1-an-danh-sang-lambda',
  tieuDe: { en: 'From anonymous classes to lambdas and method references — same output', vi: 'Từ lớp ẩn danh sang lambda và method reference — output giữ nguyên' },
  doKho: 'EASY', phut: 20, java: 17,
  khaiNiem: ['anonymous class', 'lambda', 'method reference', 'Comparator.comparing', 'Predicate.and / negate'],
  moTa: {
    en: `<p>A LAB211-style subject manager sorts subjects by code with an anonymous ${c('Comparator')}, keeps the Java subjects with an anonymous ${c('Filter<Subject>')} (its own one-method interface) and sums the credits with an anonymous ${c('Runnable')} plus an ${c('int[]')} to dodge "effectively final". It works. Rewrite it with <b>no anonymous class at all</b>: ${c('Comparator.comparing')}, method references, lambdas, ${c('Predicate')} — the output must stay identical. Then finish the last step that is still a TODO: remove the subjects whose code starts with ${c('MAE')} and that are not 2-credit, using ONE combined predicate (${c('and')} / ${c('negate')}) and ${c('removeIf')}.</p>`,
    vi: `<p>Một chương trình quản lý môn kiểu LAB211 sắp môn theo mã bằng ${c('Comparator')} ẩn danh, giữ các môn Java bằng ${c('Filter<Subject>')} ẩn danh (interface một hàm tự viết) và cộng tín chỉ bằng ${c('Runnable')} ẩn danh kèm ${c('int[]')} để né "effectively final". Nó chạy đúng. Viết lại <b>không còn lớp ẩn danh nào</b>: ${c('Comparator.comparing')}, method reference, lambda, ${c('Predicate')} — output giữ nguyên. Rồi làm nốt bước cuối còn TODO: xoá các môn có mã bắt đầu bằng ${c('MAE')} mà không phải 2 tín chỉ, bằng MỘT predicate ghép (${c('and')} / ${c('negate')}) và ${c('removeIf')}.</p>`,
  },
  yeuCau: { en: ['No anonymous class (new X() { … }) anywhere.', 'Same output lines as the anonymous version.'], vi: ['Không còn lớp ẩn danh (new X() { … }) nào.', 'Cùng các dòng output như bản ẩn danh.'] },
  dauVao: { en: 'One subject per line: code;name;credits.', vi: 'Mỗi dòng một môn: code;name;credits.' },
  dauRa: { en: 'Sorted list, Java subjects, total credits, the list after removeIf.', vi: 'Danh sách đã sắp, các môn Java, tổng tín chỉ, danh sách sau removeIf.' },
  main: 'Main',
  quyTac: [
    { id: 'R1', en: 'no anonymous class — use lambdas / method references', vi: 'không lớp ẩn danh — dùng lambda / method reference', re: String.raw`\bnew\s+[\w.<>, ]+\(\s*\)\s*\{` },
    { id: 'R2', en: 'removeIf is used for the last step', vi: 'bước cuối dùng removeIf', re: String.raw`\.removeIf\s*\(`, need: true },
  ],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    record Subject(String code, String name, int credits) {
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Subject> subjects = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (!line.isEmpty()) {
                String[] p = line.split(";");
                subjects.add(new Subject(p[0].trim(), p[1].trim(), Integer.parseInt(p[2].trim())));
            }
        }
        //>> subjects.sort(new Comparator<Subject>() { ⏎     @Override ⏎     public int compare(Subject a, Subject b) { ⏎         return a.code().compareTo(b.code()); ⏎     } ⏎ });
        subjects.sort(Comparator.comparing(Subject::code));
        //<<
        System.out.println("sorted: " + codes(subjects));
        //>> Predicate<Subject> isJava = new Predicate<Subject>() { ⏎     @Override ⏎     public boolean test(Subject s) { ⏎         return s.name().contains("Java"); ⏎     } ⏎ };
        Predicate<Subject> isJava = s -> s.name().contains("Java");
        //<<
        List<Subject> java = new ArrayList<>();
        for (Subject s : subjects) {
            if (isJava.test(s)) {
                java.add(s);
            }
        }
        System.out.println("java: " + codes(java));
        //>> final int[] total = {0}; ⏎ Runnable sum = new Runnable() { ⏎     @Override ⏎     public void run() { ⏎         for (Subject s : subjects) { ⏎             total[0] += s.credits(); ⏎         } ⏎     } ⏎ }; ⏎ sum.run(); ⏎ System.out.println("credits: " + total[0]);
        int total = subjects.stream().mapToInt(Subject::credits).sum();
        System.out.println("credits: " + total);
        //<<
        //>> // TODO: remove the subjects whose code starts with "MAE" and that are NOT 2-credit — one combined Predicate + removeIf
        Predicate<Subject> isMae = s -> s.code().startsWith("MAE");
        Predicate<Subject> twoCredits = s -> s.credits() == 2;
        subjects.removeIf(isMae.and(twoCredits.negate()));
        //<<
        System.out.println("after removeIf: " + codes(subjects));
    }

    static String codes(List<Subject> list) {
        StringBuilder sb = new StringBuilder();
        for (Subject s : list) {
            sb.append(sb.length() == 0 ? "" : ", ").append(s.code()).append('(').append(s.credits()).append(')');
        }
        return "[" + sb + "]";
    }
}
`,
  },
  ca: [
    { ten: { en: 'six subjects', vi: 'sáu môn' }, vao: 'PRO192;Object-Oriented Programming with Java;3\nMAE101;Mathematics for Engineering;3\nCSD201;Data Structures;3\nPRJ301;Java Web Application;3\nMAE102;Discrete Maths;2\nLAB211;OOP with Java Lab;2\n' },
    { ten: { en: 'only MAE subjects, all 2-credit or not', vi: 'chỉ môn MAE, có và không 2 tín chỉ' }, vao: 'MAE201;Statistics;4\nMAE001;Maths Prep;2\nMAE101;Calculus;3\nJPD113;Japanese 1;3\n', an: true },
  ],
  goiY: [
    { en: 'Comparator.comparing(Subject::code) replaces the whole anonymous comparator.', vi: 'Comparator.comparing(Subject::code) thay cả comparator ẩn danh.' },
    { en: 'A lambda cannot change a local int — compute the sum with a stream (mapToInt(Subject::credits).sum()) or a plain for loop.', vi: 'Lambda không đổi được biến int cục bộ — tính tổng bằng stream (mapToInt(Subject::credits).sum()) hoặc vòng for thường.' },
  ],
  loiHayGap: [
    { en: 'Keeping the int[] trick inside a lambda — it compiles, but it is the same hack in shorter clothes.', vi: 'Giữ mẹo int[] bên trong lambda — biên dịch được, nhưng vẫn là mẹo cũ mặc áo ngắn hơn.' },
    { en: 'isMae.and(twoCredits).negate() — negates the whole conjunction and removes every non-MAE subject too.', vi: 'isMae.and(twoCredits).negate() — phủ định cả phép "và", xoá luôn mọi môn không phải MAE.' },
  ],
  giaiThich: { en: '<p>A lambda is an instance of a functional interface written without the ceremony; a method reference is a lambda that only forwards to one method. Combining predicates with and/or/negate keeps each rule named and testable.</p>', vi: '<p>Lambda là một thể hiện của functional interface viết không cần nghi thức; method reference là lambda chỉ chuyển tiếp tới một hàm. Ghép predicate bằng and/or/negate giữ mỗi luật có tên và kiểm được riêng.</p>' },
});

export default moDun({ slug: 'pro192-cs1-on', ten: '⭐ CS.1 Generics & lambdas (Java 17)', de: [de1, de2, de3, de4, de5] });
