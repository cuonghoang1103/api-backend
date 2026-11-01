/** CSD201 · 7.1 — Bảng băm & va chạm (dùng HashSet/HashMap): cặp có tổng K trong O(n), tần suất từ + top k, nhóm các từ đảo chữ. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-7-1-pair-sum',
  tieuDe: { en: 'Two values with sum K: one pass with a HashSet', vi: 'Hai giá trị có tổng K: một lượt với HashSet' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['complement K − x', 'look up before inserting', 'O(n) average'],
  moTa: {
    en: `<p>Complete ${c('static String pairWithSum(int[] a, long k)')}: scanning left to right, return the first pair ${c('"x + y = K"')} where y is the current value and x an <b>earlier</b> value with x + y = K (so the pair whose second element comes first wins), or ${c('"none"')}. Use a ${c('HashSet<Long>')} of the values seen so far: for each y ask whether K − y is in it.</p>
<p>Also complete ${c('static int distinct(int[] a)')} — the number of different values.</p>`,
    vi: `<p>Hoàn thiện ${c('static String pairWithSum(int[] a, long k)')}: quét trái sang phải, trả cặp đầu tiên ${c('"x + y = K"')} với y là giá trị hiện tại và x một giá trị <b>đứng trước</b> sao cho x + y = K (cặp có phần tử thứ hai xuất hiện sớm nhất thắng), hoặc ${c('"none"')}. Dùng ${c('HashSet<Long>')} các giá trị đã gặp: với mỗi y hỏi K − y có trong tập không.</p>
<p>Hoàn thiện thêm ${c('static int distinct(int[] a)')} — số giá trị khác nhau.</p>`,
  },
  yeuCau: { en: ['O(n) average.', 'K − y computed in long (no overflow).'], vi: ['O(n) trung bình.', 'Tính K − y bằng long (không tràn).'] },
  dauVao: { en: 'Lines "K : values"; PERF.', vi: 'Các dòng "K : giá trị"; PERF.' },
  dauRa: { en: 'The pair and the number of distinct values.', vi: 'Cặp số và số giá trị khác nhau.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 values (no pair)', ms: 3000, can: 'O(n) average', cham: 'O(n²) (every pair)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    final int[] a = new int[1000000];
                    for (int i = 0; i < a.length; i++) {
                        a[i] = 2 * i;
                    }
                    final String[] res = new String[1];
                    r = Kiem.hen("n = 1,000,000, K odd", 3000, new Runnable() {
                        public void run() {
                            res[0] = Sets.pairWithSum(a, 1999999L) + " / distinct " + Sets.distinct(a);
                        }
                    }) + ", " + res[0];
                } else {
                    int[] a = new int[p.length - 2];
                    for (int i = 2; i < p.length; i++) {
                        a[i - 2] = n(i);
                    }
                    r = Sets.pairWithSum(a, Long.parseLong(p[0])) + " | distinct " + Sets.distinct(a);
                }`,
    }),
  },
  tep: {
    'Sets.java': j`
import java.util.HashSet;
import java.util.Set;

public class Sets {

    static String pairWithSum(int[] a, long k) {
        //>> return "none"; // TODO
        Set<Long> seen = new HashSet<>();
        for (int y : a) {
            if (seen.contains(k - y)) {
                return (k - y) + " + " + y + " = " + k;
            }
            seen.add((long) y);
        }
        return "none";
        //<<
    }

    static int distinct(int[] a) {
        //>> return 0; // TODO
        Set<Integer> s = new HashSet<>();
        for (int x : a) {
            s.add(x);
        }
        return s.size();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s examples', vi: 'ví dụ của bài' }, vao: '9 : 2 7 11 15\n10 : 1 4 6 5 5\n8 : 4 4\n8 : 4\n' },
    { ten: { en: 'negatives, overflow, no pair', vi: 'số âm, tràn số, không có cặp' }, vao: '0 : -3 1 3 -1\n4294967294 : 2147483647 2147483647\n100 : 1 2 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Check BEFORE adding the current value: x and y must be two different positions (4 + 4 = 8 needs two 4s).', vi: 'Kiểm TRƯỚC khi thêm giá trị hiện tại: x và y phải ở hai vị trí khác nhau (4 + 4 = 8 cần hai số 4).' },
    { en: 'Store the values as Long so that K − y (a long) can be looked up directly.', vi: 'Lưu giá trị dạng Long để tra thẳng K − y (kiểu long).' },
  ],
  loiHayGap: [
    { en: 'Adding y before looking up K − y — a single 4 is reported as 4 + 4.', vi: 'Thêm y trước khi tra K − y — một số 4 đơn lẻ bị báo là 4 + 4.' },
    { en: 'A HashSet<Integer> looked up with a long: contains(Long) is always false — the boxed types differ.', vi: 'HashSet<Integer> tra bằng long: contains(Long) luôn false — kiểu đóng hộp khác nhau.' },
  ],
  giaiThich: { en: '<p>Each value costs one contains and one add, O(1) on average: O(n) total, against n(n−1)/2 pair checks. The hash table answers "have I seen this value?" in constant expected time — the reason it appears in so many interview solutions.</p>', vi: '<p>Mỗi giá trị tốn một contains và một add, trung bình O(1): tổng O(n), so với n(n−1)/2 lần kiểm cặp. Bảng băm trả lời "đã gặp giá trị này chưa?" trong thời gian hằng kỳ vọng — lý do nó xuất hiện trong rất nhiều lời giải phỏng vấn.</p>' },
});

const de2 = deJava({
  id: 'csd201-7-1-word-frequency',
  tieuDe: { en: 'Word frequencies with a HashMap, and the top k', vi: 'Tần suất từ bằng HashMap, và top k' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['HashMap<String, Integer> with merge/getOrDefault', 'sorting the entries by count then word', 'case-insensitive words'],
  moTa: {
    en: `<p>Complete ${c('static List<String> top(String text, int k)')}: words are maximal runs of letters, compared in lower case; return the k most frequent as ${c('"word=count"')}, by count descending and then alphabetically (fewer than k distinct words → all of them). Count with a ${c('HashMap')}, then sort the entries.</p>`,
    vi: `<p>Hoàn thiện ${c('static List<String> top(String text, int k)')}: từ là dãy chữ cái liên tiếp dài nhất, so ở dạng chữ thường; trả k từ xuất hiện nhiều nhất dạng ${c('"từ=số lần"')}, theo số lần giảm dần rồi theo thứ tự chữ cái (ít hơn k từ khác nhau thì trả hết). Đếm bằng ${c('HashMap')}, rồi sắp các mục.</p>`,
  },
  yeuCau: { en: ['One pass to count; sort only the distinct words.', 'Letters only (Character.isLetter).'], vi: ['Một lượt để đếm; chỉ sắp các từ khác nhau.', 'Chỉ chữ cái (Character.isLetter).'] },
  dauVao: { en: 'Lines "k : text".', vi: 'Các dòng "k : văn bản".' },
  dauRa: { en: 'The top k.', vi: 'Top k.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int colon = line.indexOf(':');
                r = Words.top(line.substring(colon + 1), Integer.parseInt(line.substring(0, colon).trim())).toString();`,
    }),
  },
  tep: {
    'Words.java': j`
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Words {

    static List<String> top(String text, int k) {
        //>> return new ArrayList<>(); // TODO
        Map<String, Integer> freq = new HashMap<>();
        StringBuilder w = new StringBuilder();
        for (int i = 0; i <= text.length(); i++) {
            char ch = i < text.length() ? text.charAt(i) : ' ';
            if (Character.isLetter(ch)) {
                w.append(Character.toLowerCase(ch));
            } else if (w.length() > 0) {
                freq.merge(w.toString(), 1, Integer::sum);
                w.setLength(0);
            }
        }
        List<Map.Entry<String, Integer>> es = new ArrayList<>(freq.entrySet());
        es.sort((x, y) -> !x.getValue().equals(y.getValue()) ? Integer.compare(y.getValue(), x.getValue()) : x.getKey().compareTo(y.getKey()));
        List<String> out = new ArrayList<>();
        for (int i = 0; i < Math.min(k, es.size()); i++) {
            out.add(es.get(i).getKey() + "=" + es.get(i).getValue());
        }
        return out;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a short text', vi: 'một đoạn ngắn' }, vao: '3 : the cat and the hat and THE bat\n2 : To be, or not to be: that is the question.\n' },
    { ten: { en: 'ties, punctuation, fewer words than k', vi: 'bằng nhau, dấu câu, ít từ hơn k' }, vao: '5 : b a c b a c\n2 : hello...hello,world!!\n4 : ---\n', an: true },
  ],
  goiY: [
    { en: 'freq.merge(word, 1, Integer::sum) adds 1 or inserts 1.', vi: 'freq.merge(word, 1, Integer::sum) cộng 1 hoặc chèn 1.' },
    { en: 'Compare counts with equals (Integer objects!) or unbox them before comparing.', vi: 'So số lần bằng equals (đối tượng Integer!) hoặc mở hộp trước khi so.' },
  ],
  loiHayGap: [
    { en: 'x.getValue() != y.getValue() on Integer objects — wrong for counts above 127.', vi: 'x.getValue() != y.getValue() trên đối tượng Integer — sai với số lần lớn hơn 127.' },
    { en: 'Splitting on spaces only — "be," and "be" become two different words.', vi: 'Chỉ tách theo dấu cách — "be," và "be" thành hai từ khác nhau.' },
  ],
  giaiThich: { en: '<p>Counting is O(L) for a text of length L (one O(1) map update per word); sorting the d distinct words is O(d log d). For a top k with huge d, a size-k heap would make it O(d log k).</p>', vi: '<p>Đếm tốn O(L) với văn bản dài L (mỗi từ một lần cập nhật map O(1)); sắp d từ khác nhau tốn O(d log d). Với top k khi d rất lớn, heap cỡ k sẽ cho O(d log k).</p>' },
});

const de3 = deJava({
  id: 'csd201-7-1-group-anagrams',
  tieuDe: { en: 'Group anagrams with a HashMap keyed by the sorted letters', vi: 'Nhóm các từ đảo chữ bằng HashMap có khoá là các chữ cái đã sắp' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['a canonical key', 'HashMap<String, List<String>>', 'computeIfAbsent'],
  moTa: {
    en: `<p>Complete ${c('static List<List<String>> groups(String[] words)')}: words that are anagrams of each other (same letters, same counts) form one group. Inside a group keep the input order; order the groups by the position of their first word in the input. Key each word by its letters sorted (${c('"eat"')} → ${c('"aet"')}).</p>`,
    vi: `<p>Hoàn thiện ${c('static List<List<String>> groups(String[] words)')}: các từ là đảo chữ của nhau (cùng chữ cái, cùng số lượng) tạo thành một nhóm. Trong nhóm giữ thứ tự đầu vào; các nhóm xếp theo vị trí từ đầu tiên của nhóm trong đầu vào. Lấy khoá mỗi từ là các chữ cái đã sắp (${c('"eat"')} → ${c('"aet"')}).</p>`,
  },
  yeuCau: { en: ['One pass with a map (LinkedHashMap keeps the group order).', 'O(Σ L log L).'], vi: ['Một lượt với map (LinkedHashMap giữ thứ tự nhóm).', 'O(Σ L log L).'] },
  dauVao: { en: 'One list of words per line.', vi: 'Mỗi dòng một danh sách từ.' },
  dauRa: { en: 'The groups.', vi: 'Các nhóm.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Anagrams.groups(p).toString();' }) },
  tep: {
    'Anagrams.java': j`
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Anagrams {

    static List<List<String>> groups(String[] words) {
        //>> return new ArrayList<>(); // TODO
        Map<String, List<String>> g = new LinkedHashMap<>(); // insertion order = order of the first word of each group
        for (String w : words) {
            char[] cs = w.toCharArray();
            Arrays.sort(cs);
            g.computeIfAbsent(new String(cs), x -> new ArrayList<String>()).add(w);
        }
        return new ArrayList<>(g.values());
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the classic example', vi: 'ví dụ kinh điển' }, vao: 'eat tea tan ate nat bat\nlisten silent enlist google\n' },
    { ten: { en: 'repeated words, single letters, no anagrams', vi: 'từ lặp, chữ đơn, không có đảo chữ' }, vao: 'a a b\nabc cab bca abc\nxy yz\n', an: true },
  ],
  goiY: [
    { en: 'Two words are anagrams exactly when their sorted letters are equal — use that string as the map key.', vi: 'Hai từ là đảo chữ đúng khi các chữ cái đã sắp của chúng bằng nhau — dùng chuỗi đó làm khoá của map.' },
    { en: 'A LinkedHashMap iterates in insertion order, which is the order of the first word of every group.', vi: 'LinkedHashMap duyệt theo thứ tự chèn, đúng thứ tự từ đầu tiên của mỗi nhóm.' },
  ],
  loiHayGap: [
    { en: 'Using char[] as the key — arrays use identity equals/hashCode, so every word gets its own group.', vi: 'Dùng char[] làm khoá — mảng dùng equals/hashCode theo danh tính, nên mỗi từ thành một nhóm riêng.' },
    { en: 'A plain HashMap — the groups come out in hash order.', vi: 'HashMap thường — các nhóm ra theo thứ tự băm.' },
  ],
  giaiThich: { en: '<p>Choosing a canonical key turns "is w an anagram of some earlier word?" into one hash look-up. The cost is sorting each word, O(L log L); counting letters into a 26-entry key would make it O(L).</p>', vi: '<p>Chọn một khoá chuẩn biến câu hỏi "w có là đảo chữ của từ nào trước đó?" thành một lần tra băm. Chi phí là sắp mỗi từ, O(L log L); đếm chữ cái thành khoá 26 ô sẽ cho O(L).</p>' },
});

export default moDun({ slug: 'csd201-bam', ten: '7.1 Hash tables & collisions', de: [de1, de2, de3] });
