/** CSD201 · 7.5 — Thực hành chương 7: dãy số liên tiếp dài nhất O(n), số đoạn con có tổng K bằng tổng tiền tố + HashMap, sổ địa chỉ sách băm dây chuyền kiểu PE (f1–f4). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-7-5-longest-consecutive',
  tieuDe: { en: 'The longest run of consecutive integers in O(n)', vi: 'Dãy số nguyên liên tiếp dài nhất trong O(n)' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['HashSet for O(1) membership', 'start counting only at the beginning of a run', 'O(n) despite the inner loop'],
  moTa: {
    en: `<p>Complete ${c('static int longest(int[] a)')}: the length of the longest set of values of the form x, x+1, …, x+L−1 that all occur in a (in any order; duplicates count once). ${c('[100,4,200,1,3,2]')} → 4. Put the values in a HashSet; start walking ${c('x, x+1, …')} only from values x for which ${c('x − 1')} is <b>not</b> in the set — every run is walked once.</p>`,
    vi: `<p>Hoàn thiện ${c('static int longest(int[] a)')}: độ dài lớn nhất của tập giá trị dạng x, x+1, …, x+L−1 mà mọi giá trị đều có trong a (thứ tự bất kỳ; trùng tính một). ${c('[100,4,200,1,3,2]')} → 4. Cho các giá trị vào HashSet; chỉ bắt đầu đi ${c('x, x+1, …')} từ những x mà ${c('x − 1')} <b>không</b> có trong tập — mỗi dãy chỉ bị đi một lần.</p>`,
  },
  yeuCau: { en: ['O(n) average; no sorting (rule R1).', 'Mind x + 1 overflow at Integer.MAX_VALUE.'], vi: ['O(n) trung bình; không sắp xếp (luật R1).', 'Cẩn thận x + 1 tràn ở Integer.MAX_VALUE.'] },
  dauVao: { en: 'One array per line ("-" = empty); PERF.', vi: 'Mỗi dòng một mảng ("-" = rỗng); PERF.' },
  dauRa: { en: 'The length.', vi: 'Độ dài.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no sorting in Runs', vi: 'không sắp xếp trong Runs', re: String.raw`\.sort\s*\(|\.sorted\s*\(|\bTree(Set|Map)\b|\bPriorityQueue\b`, file: 'Runs' }],
  hen: { n: '1,000,000 values in one long run', ms: 3000, can: 'O(n)', cham: 'O(n²) (walking every run from every value)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = (int) ((i * 7919L) % 1000000);
                    }
                    final int[] res = new int[1];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Runs.longest(a);
                        }
                    }) + ", longest " + res[0];
                } else {
                    int[] a = line.equals("-") ? new int[0] : new int[p.length];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = n(i);
                    }
                    r = String.valueOf(Runs.longest(a));
                }`,
    }),
  },
  tep: {
    'Runs.java': j`
import java.util.HashSet;
import java.util.Set;

public class Runs {

    static int longest(int[] a) {
        //>> return 0; // TODO
        Set<Integer> s = new HashSet<>();
        for (int x : a) {
            s.add(x);
        }
        int best = 0;
        for (int x : s) {
            if (x != Integer.MIN_VALUE && s.contains(x - 1)) {
                continue; // not the start of a run
            }
            int len = 1;
            for (long y = (long) x + 1; y <= Integer.MAX_VALUE && s.contains((int) y); y++) {
                len++;
            }
            best = Math.max(best, len);
        }
        return best;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example, duplicates', vi: 'ví dụ kinh điển, giá trị trùng' }, vao: '100 4 200 1 3 2\n0 3 7 2 5 8 4 6 0 1\n1 2 2 3\n-\n' },
    { ten: { en: 'negatives, extreme values', vi: 'số âm, giá trị cực trị' }, vao: '-1 -2 0 1 5\n2147483647 2147483646 -2147483648\n10\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A value x starts a run exactly when x − 1 is absent; only then count x+1, x+2, … .', vi: 'Giá trị x bắt đầu một dãy đúng khi x − 1 không có; chỉ khi đó mới đếm x+1, x+2, … .' },
    { en: 'Loop over the SET, not the array, so that duplicates do not restart the same run.', vi: 'Lặp trên TẬP, không phải mảng, để giá trị trùng không làm đếm lại cùng một dãy.' },
  ],
  loiHayGap: [
    { en: 'Counting forwards from every value — a run of length L is walked L times: O(n²).', vi: 'Đếm tới từ mọi giá trị — dãy dài L bị đi L lần: O(n²).' },
    { en: 'Sorting first — O(n log n) and forbidden here.', vi: 'Sắp trước — O(n log n) và bị cấm ở đây.' },
  ],
  giaiThich: { en: '<p>Every value is the start of at most one walk and is visited by at most one walk, so the total work is O(n) on average even though there is a loop inside a loop. The HashSet replaces the sort that the obvious solution would need.</p>', vi: '<p>Mỗi giá trị là điểm đầu của tối đa một lượt đi và bị ghé bởi tối đa một lượt đi, nên tổng công việc trung bình là O(n) dù có vòng trong vòng. HashSet thay cho phép sắp mà lời giải hiển nhiên cần.</p>' },
});

const de2 = deJava({
  id: 'csd201-7-5-subarray-sum',
  tieuDe: { en: 'How many subarrays sum to K? Prefix sums in a HashMap', vi: 'Bao nhiêu đoạn con có tổng K? Tổng tiền tố trong HashMap' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['prefix sums', 'sum(i..j) = P[j] − P[i−1]', 'count earlier prefixes equal to P − K', 'negative numbers break the two-pointer method'],
  moTa: {
    en: `<p>Complete ${c('static long countSubarrays(int[] a, long k)')}: the number of contiguous non-empty subarrays whose sum is exactly k. Values may be negative, so a sliding window does not work. Walk once keeping the running prefix sum P and a ${c('HashMap<Long, Integer>')} of how many earlier prefixes had each value (start with ${c('{0: 1}')}); each position adds ${c('count[P − k]')} to the answer.</p>`,
    vi: `<p>Hoàn thiện ${c('static long countSubarrays(int[] a, long k)')}: số đoạn con liên tiếp khác rỗng có tổng đúng bằng k. Giá trị có thể âm, nên cửa sổ trượt không dùng được. Đi một lượt, giữ tổng tiền tố P và một ${c('HashMap<Long, Integer>')} đếm số tiền tố trước đó có từng giá trị (bắt đầu ${c('{0: 1}')}); mỗi vị trí cộng ${c('count[P − k]')} vào đáp án.</p>`,
  },
  yeuCau: { en: ['O(n) average.', 'Answer and prefix sums in long.'], vi: ['O(n) trung bình.', 'Đáp án và tổng tiền tố kiểu long.'] },
  dauVao: { en: 'Lines "k : values"; PERF.', vi: 'Các dòng "k : giá trị"; PERF.' },
  dauRa: { en: 'The count.', vi: 'Số đoạn con.' },
  main: 'KiemTra',
  hen: { n: '1,000,000', ms: 3000, can: 'O(n)', cham: 'O(n²) (every pair of ends)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = Kiem.ngauNhien(1000000, 21, 141);
                    for (int i = 0; i < a.length; i++) {
                        a[i] -= 10;
                    }
                    final long[] res = new long[1];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Subarrays.countSubarrays(a, 0);
                        }
                    }) + ", count " + res[0];
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = String.valueOf(Subarrays.countSubarrays(a, Long.parseLong(p[0])));
                }`,
    }),
  },
  tep: {
    'Subarrays.java': j`
import java.util.HashMap;
import java.util.Map;

public class Subarrays {

    static long countSubarrays(int[] a, long k) {
        //>> return 0; // TODO
        Map<Long, Integer> seen = new HashMap<>();
        seen.put(0L, 1); // the empty prefix
        long prefix = 0, count = 0;
        for (int x : a) {
            prefix += x;
            count += seen.getOrDefault(prefix - k, 0);
            seen.merge(prefix, 1, Integer::sum);
        }
        return count;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small examples with negatives', vi: 'ví dụ nhỏ có số âm' }, vao: '2 : 1 1 1\n3 : 1 2 3\n0 : 1 -1 1 -1\n7 : 3 4 7 2 -3 1 4 2\n' },
    { ten: { en: 'all zeros, no answer, big sums', vi: 'toàn số 0, không có đáp án, tổng lớn' }, vao: '0 : 0 0 0 0\n100 : 1 2 3\n4000000000 : 2000000000 2000000000\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'A subarray ending at j sums to k exactly when an earlier prefix equals P[j] − k.', vi: 'Đoạn con kết thúc ở j có tổng k đúng khi có một tiền tố trước đó bằng P[j] − k.' },
    { en: 'Look up P − k BEFORE adding P itself (otherwise k = 0 counts empty subarrays).', vi: 'Tra P − k TRƯỚC khi thêm chính P (nếu không, k = 0 sẽ đếm cả đoạn rỗng).' },
  ],
  loiHayGap: [
    { en: 'A two-pointer window — only valid for non-negative values.', vi: 'Cửa sổ hai con trỏ — chỉ đúng với giá trị không âm.' },
    { en: 'Forgetting the initial {0: 1} — subarrays that start at index 0 are missed.', vi: 'Quên {0: 1} ban đầu — bỏ sót các đoạn con bắt đầu từ chỉ số 0.' },
  ],
  giaiThich: { en: '<p>sum(i..j) = P[j] − P[i−1], so counting subarrays that end at j means counting earlier prefixes equal to P[j] − k — a hash look-up. One pass, O(n) average, versus O(n²) pairs of ends.</p>', vi: '<p>sum(i..j) = P[j] − P[i−1], nên đếm các đoạn con kết thúc ở j là đếm các tiền tố trước đó bằng P[j] − k — một lần tra băm. Một lượt, trung bình O(n), so với O(n²) cặp đầu mút.</p>' },
});

const de3 = deJava({
  id: 'csd201-7-5-book-catalogue',
  tieuDe: { en: 'PE style: a book catalogue with separate chaining (f1–f4)', vi: 'Kiểu PE: danh mục sách băm dây chuyền (f1–f4)' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['hash of a String key mod m', 'chains as linked lists', 'grouping by a field', 'removing from a chain'],
  moTa: {
    en: `<p>${c('Catalogue(int m)')} stores ${c('Book(isbn, title, year)')} in m chains; the bucket of a book is ${c('Math.floorMod(isbn.hashCode(), m)')}; new books go to the head of their chain.</p>
<ul><li><b>f1</b> ${c('boolean add(Book b)')} — reject (false) a duplicate isbn or a year &lt; 1900;</li>
<li><b>f2</b> ${c('String find(String isbn)')} — ${c('"title (year)"')} or ${c('"not found"')};</li>
<li><b>f3</b> ${c('int removeOlderThan(int year)')} — remove every book published before that year from every chain, return how many;</li>
<li><b>f4</b> ${c('String longestChain()')} — ${c('"bucket b: n books"')} for the longest chain (the smallest b on ties).</li></ul>`,
    vi: `<p>${c('Catalogue(int m)')} lưu ${c('Book(isbn, title, year)')} trong m dây; ô của một cuốn sách là ${c('Math.floorMod(isbn.hashCode(), m)')}; sách mới vào đầu dây. <b>f1</b> ${c('add(b)')} — từ chối (false) isbn trùng hoặc năm &lt; 1900; <b>f2</b> ${c('find(isbn)')} — ${c('"tên (năm)"')} hoặc ${c('"not found"')}; <b>f3</b> ${c('removeOlderThan(year)')} — xoá mọi sách xuất bản trước năm đó khỏi mọi dây, trả số đã xoá; <b>f4</b> ${c('longestChain()')} — ${c('"bucket b: n books"')} cho dây dài nhất (bằng nhau thì b nhỏ nhất).</p>`,
  },
  yeuCau: { en: ['Your own chains of BookNode (no java.util collections, rule R1).', 'Book and BookNode are given.'], vi: ['Dây BookNode tự làm (không collection của java.util, luật R1).', 'Book và BookNode cho sẵn.'] },
  dauVao: { en: 'Size m, then ADD isbn year title · FIND isbn · OLDER year · LONGEST.', vi: 'Cỡ m, rồi ADD isbn năm tên · FIND isbn · OLDER năm · LONGEST.' },
  dauRa: { en: 'Results and the chains.', vi: 'Kết quả và các dây.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no java.util collections in Catalogue', vi: 'không collection của java.util trong Catalogue', re: String.raw`\b(HashMap|HashSet|ArrayList|LinkedList|List|Map|Set)\b`, file: 'Catalogue' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Catalogue t = new Catalogue(Integer.parseInt(sc.nextLine().trim()));',
      them: `
    static String chains(Catalogue t) {
        Object[] b = (Object[]) Kiem.lay(t, "buckets");
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < b.length; i++) {
            StringBuilder c = new StringBuilder();
            for (Object q = b[i]; q != null; q = Kiem.lay(q, "next")) {
                c.append(c.length() > 0 ? " " : "").append(Kiem.lay(Kiem.lay(q, "info"), "isbn"));
            }
            sb.append(i > 0 ? " | " : "").append(i).append(':').append(c.length() == 0 ? "-" : c.toString());
        }
        return sb.toString();
    }
`,
      lenh: `                if (p[0].equals("ADD")) {
                    r = String.valueOf(t.add(new Book(p[1], line.substring(line.indexOf(p[2], p[0].length() + p[1].length() + 1) + p[2].length()).trim(), n(2))));
                } else if (p[0].equals("FIND")) {
                    r = t.find(p[1]);
                } else if (p[0].equals("OLDER")) {
                    r = String.valueOf(t.removeOlderThan(n(1)));
                } else {
                    r = t.longestChain();
                }`,
      trangThai: 'chains(t)',
    }),
  },
  tep: {
    'Book.java': j`
// GIVEN — do not change.
class Book {
    String isbn;
    String title;
    int year;

    Book(String isbn, String title, int year) {
        this.isbn = isbn;
        this.title = title;
        this.year = year;
    }
}
`,
    'BookNode.java': j`
// GIVEN — do not change.
class BookNode {
    Book info;
    BookNode next;

    BookNode(Book info, BookNode next) {
        this.info = info;
        this.next = next;
    }
}
`,
    'Catalogue.java': j`
public class Catalogue {
    private final BookNode[] buckets;

    public Catalogue(int m) {
        buckets = new BookNode[m];
    }

    private int bucket(String isbn) {
        return Math.floorMod(isbn.hashCode(), buckets.length);
    }

    // f1
    public boolean add(Book b) {
        //>> return false; // TODO
        if (b.year < 1900) {
            return false;
        }
        int i = bucket(b.isbn);
        for (BookNode p = buckets[i]; p != null; p = p.next) {
            if (p.info.isbn.equals(b.isbn)) {
                return false;
            }
        }
        buckets[i] = new BookNode(b, buckets[i]);
        return true;
        //<<
    }

    // f2
    public String find(String isbn) {
        //>> return "not found"; // TODO
        for (BookNode p = buckets[bucket(isbn)]; p != null; p = p.next) {
            if (p.info.isbn.equals(isbn)) {
                return p.info.title + " (" + p.info.year + ")";
            }
        }
        return "not found";
        //<<
    }

    // f3
    public int removeOlderThan(int year) {
        //>> return 0; // TODO
        int removed = 0;
        for (int i = 0; i < buckets.length; i++) {
            while (buckets[i] != null && buckets[i].info.year < year) {
                buckets[i] = buckets[i].next;
                removed++;
            }
            for (BookNode p = buckets[i]; p != null && p.next != null; ) {
                if (p.next.info.year < year) {
                    p.next = p.next.next;
                    removed++;
                } else {
                    p = p.next;
                }
            }
        }
        return removed;
        //<<
    }

    // f4
    public String longestChain() {
        //>> return ""; // TODO
        int best = 0, bestLen = -1;
        for (int i = 0; i < buckets.length; i++) {
            int len = 0;
            for (BookNode p = buckets[i]; p != null; p = p.next) {
                len++;
            }
            if (len > bestLen) {
                best = i;
                bestLen = len;
            }
        }
        return "bucket " + best + ": " + bestLen + " books";
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a small catalogue', vi: 'một danh mục nhỏ' }, vao: '5\nADD 978-1 2001 Clean Code\nADD 978-2 1994 Design Patterns\nADD 978-3 2014 Java 8 in Action\nADD 978-6 1999 Refactoring\nADD 978-7 2005 Head First Java\nADD 978-1 2020 Duplicate\nADD 978-9 1850 Too Old\nFIND 978-2\nFIND 000-0\nLONGEST\nOLDER 2000\nLONGEST\n' },
    { ten: { en: 'one bucket, remove the whole chain', vi: 'một ô, xoá cả dây' }, vao: '1\nADD a 1990 A\nADD b 2000 B\nADD c 1980 C\nADD d 2010 D\nOLDER 1995\nOLDER 3000\nLONGEST\nFIND b\n', an: true },
  ],
  goiY: [
    { en: 'f3 has two parts per chain: first drop old books at the head, then remove old successors of the remaining nodes.', vi: 'f3 có hai phần cho mỗi dây: trước hết bỏ các sách cũ ở đầu dây, rồi xoá các nút cũ đứng sau những nút còn lại.' },
    { en: 'When you remove p.next, stay on p: the new p.next may be old too.', vi: 'Khi xoá p.next, đứng nguyên ở p: p.next mới có thể cũng là sách cũ.' },
  ],
  loiHayGap: [
    { en: 'Moving p forward after a removal — two consecutive old books: the second survives.', vi: 'Dời p tiếp sau khi xoá — hai sách cũ liên tiếp: cuốn thứ hai sống sót.' },
    { en: 'isbn.hashCode() % m — negative buckets for some ISBNs.', vi: 'isbn.hashCode() % m — ô âm với một số ISBN.' },
  ],
  giaiThich: { en: '<p>add and find touch one chain: O(1 + α). Operations by another field (year) cannot use the hash and must visit every chain: O(n + m). A real catalogue would add a second index (for example a TreeMap by year) for such queries.</p>', vi: '<p>add và find chỉ chạm một dây: O(1 + α). Thao tác theo trường khác (năm) không dùng được hàm băm và phải ghé mọi dây: O(n + m). Danh mục thật sẽ thêm một chỉ mục thứ hai (vd TreeMap theo năm) cho các truy vấn như vậy.</p>' },
});

export default moDun({ slug: 'csd201-on-ch7', ten: '7.5 🧪 Practice — consecutive runs, subarray sums, a PE-style chained catalogue', de: [de1, de2, de3] });
