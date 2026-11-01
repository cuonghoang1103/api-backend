/** PRO192 · 8.1 — List, Set & Map: ArrayList theo lệnh, phép toán tập hợp, đếm tần suất bằng Map, Map của các List. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-8-1-arraylist',
  tieuDe: { en: 'ArrayList by commands: a reading queue', vi: 'ArrayList theo lệnh: hàng đợi đọc sách' },
  doKho: 'EASY', phut: 15,
  khaiNiem: ['List<String> / ArrayList', 'add(index, e)', 'remove(Object) vs remove(int)', 'indexOf / contains'],
  moTa: {
    en: `<p>Keep a reading queue in a ${c('List<String>')} (declared as ${c('List')}, created as ${c('new ArrayList<>()')}). Commands, one per line:</p>
<ul><li>${c('ADD title')} — append; ${c('FIRST title')} — insert at the front; ${c('DONE')} — remove the first title (print ${c('read <title>')} or ${c('queue is empty')});</li>
<li>${c('DROP title')} — remove that title (by value!) → ${c('dropped <title>')} / ${c('<title> not in queue')};</li>
<li>${c('POS title')} → ${c('<title> is #3')} (1-based) or ${c('<title> not in queue')}; ${c('SHOW')} → ${c('[a, b, c] (3)')}.</li></ul>
<p>Titles may contain spaces (everything after the command word).</p>`,
    vi: `<p>Giữ hàng đợi đọc sách trong ${c('List<String>')} (khai báo ${c('List')}, tạo bằng ${c('new ArrayList<>()')}). Lệnh như danh sách trên (ADD, FIRST, DONE, DROP theo GIÁ TRỊ, POS đếm từ 1, SHOW). Tên sách có thể có dấu cách (mọi thứ sau từ lệnh).</p>`,
  },
  yeuCau: { en: ['Declare with the interface: List&lt;String&gt; queue = new ArrayList&lt;&gt;();'], vi: ['Khai báo bằng interface: List&lt;String&gt; queue = new ArrayList&lt;&gt;();'] },
  dauVao: { en: 'Commands, one per line.', vi: 'Các lệnh, mỗi dòng một lệnh.' },
  dauRa: { en: 'One line per command (ADD/FIRST print nothing).', vi: 'Mỗi lệnh một dòng (ADD/FIRST không in gì).' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'declared as List, not ArrayList', vi: 'khai báo List, không ArrayList', re: String.raw`(?<!new\s)\bArrayList\s*<[^>]*>\s+\w+\s*[=;]` }],
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> queue = new ArrayList<>();
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            int sp = line.indexOf(' ');
            String cmd = sp < 0 ? line : line.substring(0, sp);
            String title = sp < 0 ? "" : line.substring(sp + 1).trim();
            //>> System.out.println("? " + cmd); // TODO: ADD, FIRST, DONE, DROP, POS, SHOW
            switch (cmd) {
                case "ADD":
                    queue.add(title);
                    break;
                case "FIRST":
                    queue.add(0, title);
                    break;
                case "DONE":
                    System.out.println(queue.isEmpty() ? "queue is empty" : "read " + queue.remove(0));
                    break;
                case "DROP":
                    System.out.println(queue.remove(title) ? "dropped " + title : title + " not in queue");
                    break;
                case "POS":
                    int i = queue.indexOf(title);
                    System.out.println(i < 0 ? title + " not in queue" : title + " is #" + (i + 1));
                    break;
                default:
                    System.out.println(queue + " (" + queue.size() + ")");
            }
            //<<
        }
    }
}
`,
  },
  ca: [
    { ten: { en: 'queue operations', vi: 'các thao tác hàng đợi' }, vao: 'ADD Clean Code\nADD Refactoring\nFIRST Head First Java\nSHOW\nPOS Refactoring\nDONE\nDROP Clean Code\nDROP Clean Code\nSHOW\n' },
    { ten: { en: 'empty queue, duplicates', vi: 'hàng đợi rỗng, trùng tên' }, vao: 'DONE\nADD A\nADD B\nADD A\nPOS A\nDROP A\nSHOW\nDONE\nDONE\nDONE\nSHOW\n', an: true },
  ],
  goiY: [
    { en: 'queue.remove(0) removes by INDEX and returns the element; queue.remove(title) removes by VALUE (first occurrence) and returns a boolean.', vi: 'queue.remove(0) xoá theo CHỈ SỐ và trả phần tử; queue.remove(title) xoá theo GIÁ TRỊ (lần xuất hiện đầu) và trả boolean.' },
    { en: 'indexOf returns −1 when absent — add 1 for a human position.', vi: 'indexOf trả −1 khi không có — cộng 1 để ra vị trí cho người đọc.' },
  ],
  loiHayGap: [
    { en: 'List<Integer> pitfall: list.remove(5) removes index 5, not the value 5 — use remove(Integer.valueOf(5)). With String the call is unambiguous.', vi: 'Bẫy List<Integer>: list.remove(5) xoá chỉ số 5, không phải giá trị 5 — dùng remove(Integer.valueOf(5)). Với String thì không nhập nhằng.' },
    { en: 'Splitting the line on spaces — "Clean Code" becomes two tokens.', vi: 'Tách dòng theo dấu cách — "Clean Code" thành hai mảnh.' },
  ],
  giaiThich: { en: '<p>ArrayList gives index-based operations (add at 0, remove at 0) and value-based ones (remove(Object), indexOf, contains) that use equals(). Declaring the variable as List keeps the code independent of the implementation.</p>', vi: '<p>ArrayList có thao tác theo chỉ số (thêm ở 0, xoá ở 0) và theo giá trị (remove(Object), indexOf, contains) dùng equals(). Khai báo biến kiểu List giữ code độc lập với lớp cài đặt.</p>' },
});

const de2 = deJava({
  id: 'pro192-8-1-sets',
  tieuDe: { en: 'Sets: unique visitors and set operations', vi: 'Set: người ghé thăm duy nhất và phép toán tập hợp' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['HashSet / TreeSet / LinkedHashSet', 'add returns false for a duplicate', 'retainAll / removeAll / addAll'],
  moTa: {
    en: `<p>Two lines of member ids (separated by spaces): who visited on Monday and who visited on Tuesday. Ids are case-insensitive (store them upper-case). Print:</p>
<pre>Monday unique: 4 (duplicates ignored: 2)
Monday in visit order: [M03, M01, M07, M02]
Both days: [M01, M07]
Only Monday: [M02, M03]
Either day: [M01, M02, M03, M05, M07]</pre>
<p>Visit order = first appearance (${c('LinkedHashSet')}); the three last lines are sorted (${c('TreeSet')}).</p>`,
    vi: `<p>Hai dòng mã thành viên (cách nhau bằng dấu cách): ai ghé thứ Hai và ai ghé thứ Ba. Mã không phân biệt hoa thường (lưu viết hoa). In như mẫu. Thứ tự ghé = lần xuất hiện đầu (${c('LinkedHashSet')}); ba dòng cuối được sắp (${c('TreeSet')}).</p>`,
  },
  yeuCau: { en: ['Count duplicates with the boolean returned by add().', 'Do not modify the Monday set when computing the operations (work on copies).'], vi: ['Đếm trùng bằng boolean mà add() trả về.', 'Không sửa tập thứ Hai khi tính các phép toán (làm trên bản sao).'] },
  dauVao: { en: 'Two lines of ids.', vi: 'Hai dòng mã.' },
  dauRa: { en: 'Five lines.', vi: 'Năm dòng.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.LinkedHashSet;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

public class Main {
    static Set<String> read(String line, int[] duplicates) {
        Set<String> ids = new LinkedHashSet<>();
        //>> // TODO: add every token upper-cased; count the ones add() refuses
        for (String token : line.trim().split("\\s+")) {
            if (!token.isEmpty() && !ids.add(token.toUpperCase())) {
                duplicates[0]++;
            }
        }
        //<<
        return ids;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] dup = {0};
        Set<String> monday = read(sc.nextLine(), dup);
        Set<String> tuesday = read(sc.hasNextLine() ? sc.nextLine() : "", new int[1]);
        System.out.println("Monday unique: " + monday.size() + " (duplicates ignored: " + dup[0] + ")");
        System.out.println("Monday in visit order: " + monday);
        //>> // TODO: Both days, Only Monday, Either day — sorted copies
        Set<String> both = new TreeSet<>(monday);
        both.retainAll(tuesday);
        Set<String> onlyMonday = new TreeSet<>(monday);
        onlyMonday.removeAll(tuesday);
        Set<String> either = new TreeSet<>(monday);
        either.addAll(tuesday);
        System.out.println("Both days: " + both);
        System.out.println("Only Monday: " + onlyMonday);
        System.out.println("Either day: " + either);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the example', vi: 'ví dụ' }, vao: 'M03 M01 m03 M07 M02 m01\nM07 M05 M01\n' },
    { ten: { en: 'no common visitor, extra spaces', vi: 'không ai chung, dấu cách thừa' }, vao: '  a1   b2  \nC3 c3 d4\n', an: true },
    { ten: { en: 'nobody on Tuesday', vi: 'thứ Ba không ai' }, vao: 'X9 x9 X9\n\n', an: true },
  ],
  goiY: [
    { en: 'set.add(x) returns false when x is already there — that is your duplicate counter.', vi: 'set.add(x) trả false khi x đã có — đó là bộ đếm trùng của bạn.' },
    { en: 'new TreeSet<>(monday) copies AND sorts; then retainAll = intersection, removeAll = difference, addAll = union.', vi: 'new TreeSet<>(monday) vừa chép VỪA sắp; rồi retainAll = giao, removeAll = hiệu, addAll = hợp.' },
  ],
  loiHayGap: [
    { en: 'monday.retainAll(tuesday) directly — the Monday set is destroyed and the next line is wrong.', vi: 'Gọi thẳng monday.retainAll(tuesday) — tập thứ Hai bị phá và dòng sau sai.' },
    { en: 'HashSet for the visit order — its iteration order is not the insertion order.', vi: 'Dùng HashSet cho thứ tự ghé — thứ tự duyệt của nó không phải thứ tự thêm.' },
  ],
  giaiThich: { en: '<p>The three Set implementations differ only in iteration order: HashSet (none guaranteed), LinkedHashSet (insertion), TreeSet (sorted). Bulk operations on copies give the classic set algebra without touching the originals.</p>', vi: '<p>Ba lớp Set chỉ khác thứ tự duyệt: HashSet (không bảo đảm), LinkedHashSet (thứ tự thêm), TreeSet (đã sắp). Phép toán hàng loạt trên bản sao cho ra đại số tập hợp kinh điển mà không đụng bản gốc.</p>' },
});

const de3 = deJava({
  id: 'pro192-8-1-word-count',
  tieuDe: { en: 'Map: word frequency and the top 3', vi: 'Map: tần suất từ và top 3' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['Map<String, Integer>', 'getOrDefault / merge', 'TreeMap for sorted keys', 'sorting entries by value'],
  moTa: {
    en: `<p>Read a text (several lines). A word is a run of letters (${c('[a-zA-Z]+')}), compared in lower case. Print:</p>
<ul><li>${c('words: 12, distinct: 8')};</li>
<li>every word with its count, <b>alphabetically</b>, one per line: ${c('java=3')};</li>
<li>${c('top 3: java=3, the=2, a=1')} — highest count first, ties alphabetical; fewer than 3 distinct words → as many as exist.</li></ul>`,
    vi: `<p>Đọc một văn bản (nhiều dòng). Từ là một dãy chữ cái (${c('[a-zA-Z]+')}), so ở dạng chữ thường. In: tổng số từ và số từ khác nhau; mọi từ kèm số lần, theo <b>bảng chữ cái</b>; dòng ${c('top 3')} — nhiều nhất trước, hoà thì theo bảng chữ cái; ít hơn 3 từ khác nhau thì in bấy nhiêu.</p>`,
  },
  yeuCau: { en: ['Use a Map&lt;String, Integer&gt;.'], vi: ['Dùng Map&lt;String, Integer&gt;.'] },
  dauVao: { en: 'Text lines.', vi: 'Các dòng văn bản.' },
  dauRa: { en: 'Counts, the alphabetical list, the top 3.', vi: 'Số đếm, danh sách theo chữ cái, top 3.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Map<String, Integer> counts = new TreeMap<>();
        int total = 0;
        Pattern word = Pattern.compile("[a-zA-Z]+");
        while (sc.hasNextLine()) {
            Matcher m = word.matcher(sc.nextLine());
            while (m.find()) {
                //>> total++; // TODO: count m.group() in lower case
                counts.put(m.group().toLowerCase(), counts.getOrDefault(m.group().toLowerCase(), 0) + 1);
                total++;
                //<<
            }
        }
        System.out.println("words: " + total + ", distinct: " + counts.size());
        //>> // TODO: alphabetical lines, then "top 3: …"
        for (Map.Entry<String, Integer> e : counts.entrySet()) {
            System.out.println(e.getKey() + "=" + e.getValue());
        }
        List<Map.Entry<String, Integer>> entries = new ArrayList<>(counts.entrySet());
        Collections.sort(entries, new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> a, Map.Entry<String, Integer> b) {
                int byCount = Integer.compare(b.getValue(), a.getValue());
                return byCount != 0 ? byCount : a.getKey().compareTo(b.getKey());
            }
        });
        StringBuilder sb = new StringBuilder("top 3:");
        for (int i = 0; i < Math.min(3, entries.size()); i++) {
            sb.append(i == 0 ? " " : ", ").append(entries.get(i).getKey()).append('=').append(entries.get(i).getValue());
        }
        System.out.println(sb);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a short text', vi: 'văn bản ngắn' }, vao: 'Java is a language. Java runs on the JVM;\nthe JVM runs Java bytecode.\n' },
    { ten: { en: 'ties and digits inside words', vi: 'hoà và chữ số trong từ' }, vao: 'b2b a A c C c b\n' },
    { ten: { en: 'one word only, and no word', vi: 'chỉ một từ, và không có từ nào' }, vao: 'Hello!!! hello\n', an: true },
    { ten: { en: 'punctuation only', vi: 'chỉ có dấu câu' }, vao: '... 123 ,,, !!!\n', an: true },
  ],
  goiY: [
    { en: 'counts.put(w, counts.getOrDefault(w, 0) + 1) — or counts.merge(w, 1, Integer::sum).', vi: 'counts.put(w, counts.getOrDefault(w, 0) + 1) — hoặc counts.merge(w, 1, Integer::sum).' },
    { en: 'A TreeMap iterates its keys in sorted order; for the top 3 copy the entries into a List and sort by value descending, key ascending.', vi: 'TreeMap duyệt khoá theo thứ tự đã sắp; với top 3 chép các entry vào List rồi sắp theo giá trị giảm, khoá tăng.' },
  ],
  loiHayGap: [
    { en: 'counts.get(w) + 1 for a new word — get returns null and unboxing throws NullPointerException.', vi: 'counts.get(w) + 1 với từ mới — get trả null và mở hộp ném NullPointerException.' },
    { en: 'Sorting a HashMap’s entrySet in place — a HashMap cannot be sorted; copy the entries into a List.', vi: 'Sắp tại chỗ entrySet của HashMap — HashMap không sắp được; chép entry ra một List.' },
  ],
  giaiThich: { en: '<p>A Map counts in one pass; a TreeMap gives the alphabetical listing for free; the top-k needs a different order, so the entries are copied into a list and sorted with a value-then-key comparator.</p>', vi: '<p>Map đếm trong một lượt; TreeMap cho danh sách theo chữ cái miễn phí; top-k cần thứ tự khác, nên các entry được chép ra list và sắp bằng comparator giá trị-rồi-khoá.</p>' },
});

const de4 = deJava({
  id: 'pro192-8-1-map-of-lists',
  tieuDe: { en: 'A map of lists: books grouped by author', vi: 'Map của các List: sách nhóm theo tác giả' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['Map<String, List<String>>', 'computeIfAbsent / get-then-put', 'sorted keys', 'nested iteration'],
  moTa: {
    en: `<p>Read lines ${c('author;title;year')}. Group the titles by author in a ${c('Map<String, List<String>>')} and print, authors A–Z (case-insensitive key: store the author as first typed), each author’s titles sorted by year then title:</p>
<pre>Joshua Bloch (2): Java Puzzlers (2005), Effective Java (2018)
Martin Fowler (1): Refactoring (2018)</pre>
<p>Then ${c('most prolific: Joshua Bloch (2)')} (first alphabetically on a tie).</p>`,
    vi: `<p>Đọc các dòng ${c('tác giả;tên;năm')}. Nhóm tên sách theo tác giả trong ${c('Map<String, List<String>>')} và in tác giả A–Z (khoá không phân biệt hoa thường: lưu tên tác giả như lần gõ đầu), sách của mỗi tác giả sắp theo năm rồi tên, như mẫu. Cuối cùng ${c('most prolific: …')} (hoà thì lấy tác giả đứng trước theo chữ cái).</p>`,
  },
  yeuCau: { en: ['Use a Map whose values are Lists.'], vi: ['Dùng Map có giá trị là List.'] },
  dauVao: { en: 'Lines author;title;year.', vi: 'Các dòng tác giả;tên;năm.' },
  dauRa: { en: 'One line per author, then the most prolific.', vi: 'Mỗi tác giả một dòng, rồi người viết nhiều nhất.' },
  main: 'Main',
  tep: {
    'Main.java': j`
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Map<String, List<String[]>> byAuthor = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        while (sc.hasNextLine()) {
            String line = sc.nextLine().trim();
            if (line.isEmpty()) {
                continue;
            }
            String[] p = line.split(";");
            //>> // TODO: add {title, year} to the author's list (create the list the first time)
            List<String[]> books = byAuthor.get(p[0].trim());
            if (books == null) {
                books = new ArrayList<>();
                byAuthor.put(p[0].trim(), books);
            }
            books.add(new String[] {p[1].trim(), p[2].trim()});
            //<<
        }
        String best = null;
        int bestCount = 0;
        for (Map.Entry<String, List<String[]>> e : byAuthor.entrySet()) {
            List<String[]> books = e.getValue();
            //>> // TODO: sort by year then title, print the line, track the most prolific
            Collections.sort(books, new Comparator<String[]>() {
                @Override
                public int compare(String[] a, String[] b) {
                    int byYear = Integer.compare(Integer.parseInt(a[1]), Integer.parseInt(b[1]));
                    return byYear != 0 ? byYear : a[0].compareTo(b[0]);
                }
            });
            StringBuilder sb = new StringBuilder(e.getKey() + " (" + books.size() + "): ");
            for (int i = 0; i < books.size(); i++) {
                sb.append(i == 0 ? "" : ", ").append(books.get(i)[0]).append(" (").append(books.get(i)[1]).append(')');
            }
            System.out.println(sb);
            if (books.size() > bestCount) {
                best = e.getKey();
                bestCount = books.size();
            }
            //<<
        }
        System.out.println(best == null ? "most prolific: none" : "most prolific: " + best + " (" + bestCount + ")");
    }
}
`,
  },
  ca: [
    { ten: { en: 'three authors', vi: 'ba tác giả' }, vao: 'Joshua Bloch;Effective Java;2018\nMartin Fowler;Refactoring;2018\njoshua bloch;Java Puzzlers;2005\nKent Beck;TDD by Example;2002\nKent Beck;Extreme Programming Explained;1999\n' },
    { ten: { en: 'same year sorted by title, tie for most prolific', vi: 'cùng năm sắp theo tên, hoà người viết nhiều nhất' }, vao: 'Zed;B;2000\nAmy;Y;2001\nzed;A;2000\nAMY;X;2001\n', an: true },
    { ten: { en: 'no book', vi: 'không có sách' }, vao: '\n', an: true },
  ],
  goiY: [
    { en: 'new TreeMap<>(String.CASE_INSENSITIVE_ORDER) keeps keys sorted and treats "Joshua Bloch" and "joshua bloch" as the same key (the first spelling stays).', vi: 'new TreeMap<>(String.CASE_INSENSITIVE_ORDER) giữ khoá đã sắp và coi "Joshua Bloch" với "joshua bloch" là một khoá (giữ cách viết đầu).' },
    { en: 'get → null → create the list and put it; then add to the list you hold (it IS the list inside the map).', vi: 'get → null → tạo list và put; rồi thêm vào list đang giữ (nó CHÍNH LÀ list trong map).' },
  ],
  loiHayGap: [
    { en: 'Creating a new list every time (put(author, new ArrayList<>()) before adding) — only the last book survives.', vi: 'Tạo list mới mỗi lần (put(author, new ArrayList<>()) trước khi thêm) — chỉ cuốn cuối còn lại.' },
    { en: 'Sorting years as strings — "999" comes after "2005".', vi: 'Sắp năm như chuỗi — "999" đứng sau "2005".' },
  ],
  giaiThich: { en: '<p>A Map from a key to a List is the standard "group by". The list taken out of the map is the same object stored in it, so adding to it updates the map; a TreeMap with a case-insensitive comparator merges different spellings of the same author.</p>', vi: '<p>Map từ khoá tới một List là cách "nhóm theo" chuẩn. List lấy ra từ map chính là đối tượng nằm trong nó, nên thêm vào list là cập nhật map; TreeMap với comparator không phân biệt hoa thường gộp các cách viết khác nhau của cùng một tác giả.</p>' },
});

export default moDun({ slug: 'pro192-8-1-collections', ten: '8.1 List, Set & Map', de: [de1, de2, de3, de4] });
