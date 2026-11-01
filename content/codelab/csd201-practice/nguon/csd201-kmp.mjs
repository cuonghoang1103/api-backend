/** CSD201 · 8.2 — So khớp chuỗi: bảng T[] của KMP (quy ước slide) + mọi vị trí + số phép so sánh, KMP trên 2·10⁶ ký tự (kiểm so với vét cạn), chu kỳ ngắn nhất từ T[m]. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-8-2-kmp-table',
  tieuDe: { en: 'The KMP table T[] of the slides, and every occurrence with the comparisons', vi: 'Bảng T[] của KMP như slide, và mọi lần xuất hiện kèm số phép so sánh' },
  doKho: 'MEDIUM', phut: 30, dangBai: 'pe',
  khaiNiem: ['T[0] = −1, T[j] = longest proper border of p[0..j−1]', 'the text index never moves back', 'continue with T[m] after a full match'],
  moTa: {
    en: `<p>Complete in ${c('Kmp')}:</p>
<ul><li>${c('static int[] table(String p)')} — m + 1 entries: ${c('T[0] = −1')} and, for j ≥ 1, ${c('T[j]')} = the length of the longest proper prefix of ${c('p[0..j−1]')} that is also its suffix (the slides print T[0..m−1]; the extra ${c('T[m]')} is used after a full match);</li>
<li>${c('static String search(String a, String p)')} — every starting index of p in a (overlaps allowed) separated by spaces, then ${c('" | comparisons C"')}: one comparison per test ${c('a[i] == p[k]')}. On a mismatch ${c('k = T[k]')}; if k becomes −1, move to the next text character with k = 0; after a full match continue with ${c('k = T[m]')}.</li></ul>`,
    vi: `<p>Hoàn thiện trong ${c('Kmp')}: ${c('table(p)')} — m + 1 ô: ${c('T[0] = −1')} và với j ≥ 1, ${c('T[j]')} = độ dài tiền tố thật dài nhất của ${c('p[0..j−1]')} đồng thời là hậu tố của nó (slide in T[0..m−1]; ô thêm ${c('T[m]')} dùng sau khi khớp trọn); ${c('search(a, p)')} — mọi chỉ số bắt đầu của p trong a (được chồng lấn) cách nhau dấu cách, rồi ${c('" | comparisons C"')}: mỗi lần thử ${c('a[i] == p[k]')} tính một phép so sánh. Không khớp thì ${c('k = T[k]')}; k thành −1 thì sang ký tự kế tiếp của văn bản với k = 0; khớp trọn thì tiếp tục với ${c('k = T[m]')}.</p>`,
  },
  yeuCau: { en: ['The text index i never decreases (rule: no indexOf).', 'Exactly the comparison rule above.'], vi: ['Chỉ số văn bản i không bao giờ giảm (luật: không indexOf).', 'Đúng luật đếm so sánh ở trên.'] },
  dauVao: { en: 'TABLE p · FIND text | pattern.', vi: 'TABLE p · FIND văn bản | mẫu.' },
  dauRa: { en: 'The table / the positions and comparisons.', vi: 'Bảng / các vị trí và số so sánh.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no indexOf / contains / regex in Kmp', vi: 'không indexOf / contains / regex trong Kmp', re: String.raw`\.(indexOf|contains|matches|regionMatches|startsWith|lastIndexOf)\s*\(`, file: 'Kmp' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("TABLE")) {
                    r = Arrays.toString(Kmp.table(p[1]));
                } else {
                    int bar = line.indexOf('|');
                    r = Kmp.search(line.substring(5, bar).trim(), line.substring(bar + 1).trim());
                }`,
    }),
  },
  tep: {
    'Kmp.java': j`
public class Kmp {

    static int[] table(String p) {
        //>> return new int[p.length() + 1]; // TODO
        int m = p.length();
        int[] T = new int[m + 1];
        T[0] = -1;
        for (int j = 1; j <= m; j++) {
            int k = T[j - 1];
            while (k >= 0 && p.charAt(k) != p.charAt(j - 1)) {
                k = T[k];
            }
            T[j] = k + 1;
        }
        return T;
        //<<
    }

    static String search(String a, String p) {
        //>> return ""; // TODO
        int[] T = table(p);
        StringBuilder res = new StringBuilder();
        long comparisons = 0;
        int i = 0, k = 0;
        while (i < a.length()) {
            comparisons++;
            if (a.charAt(i) == p.charAt(k)) {
                i++;
                k++;
                if (k == p.length()) {
                    res.append(i - k).append(' ');
                    k = T[k]; // keep the border of the whole pattern
                }
            } else {
                k = T[k];
                if (k < 0) {
                    i++;
                    k = 0;
                }
            }
        }
        return res.toString().trim() + " | comparisons " + comparisons;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ patterns', vi: 'các mẫu của slide' }, vao: 'TABLE abacab\nTABLE aaaa\nTABLE abcd\nFIND abacaabaccabacabaabb | abacab\nFIND aaaaa | aa\n' },
    { ten: { en: 'no match, the pattern equals the text', vi: 'không khớp, mẫu bằng văn bản' }, vao: 'TABLE ababaca\nFIND abcabcabd | abd\nFIND xyz | xyz\nFIND aaaa | b\n', an: true },
  ],
  goiY: [
    { en: 'T[j] is built from T[j−1]: try to extend the border k = T[j−1] by p[j−1]; if p[k] != p[j−1], fall back k = T[k] (a border of a border).', vi: 'T[j] dựng từ T[j−1]: thử nối dài biên k = T[j−1] bằng p[j−1]; nếu p[k] != p[j−1] thì lùi k = T[k] (biên của biên).' },
    { en: 'In the search, i only moves forward: a mismatch shifts the pattern (k = T[k]), never the text.', vi: 'Khi tìm, i chỉ tiến: không khớp thì dời mẫu (k = T[k]), không bao giờ dời văn bản.' },
  ],
  loiHayGap: [
    { en: 'Restarting k at 0 after a full match — overlapping occurrences ("aa" in "aaaaa") are missed.', vi: 'Đặt lại k = 0 sau khi khớp trọn — bỏ sót các lần xuất hiện chồng lấn ("aa" trong "aaaaa").' },
    { en: 'A table of size m without T[m] — the search reads past the end after a full match.', vi: 'Bảng cỡ m thiếu T[m] — sau khi khớp trọn, phép tìm đọc vượt cuối mảng.' },
  ],
  giaiThich: { en: '<p>Every comparison either advances i or shifts the pattern right, and both can happen at most n times: at most 2n comparisons, O(n + m) with the O(m) table. The table records how much of the pattern still matches after a mismatch, so no text character is read twice.</p>', vi: '<p>Mỗi phép so sánh hoặc tăng i hoặc dời mẫu sang phải, và mỗi việc xảy ra tối đa n lần: tối đa 2n phép so sánh, O(n + m) cùng bảng O(m). Bảng ghi lại phần nào của mẫu vẫn còn khớp sau khi không khớp, nên không ký tự văn bản nào bị đọc hai lần.</p>' },
});

const de2 = deJava({
  id: 'csd201-8-2-kmp-big',
  tieuDe: { en: 'KMP against brute force on two million characters', vi: 'KMP đối đầu vét cạn trên hai triệu ký tự' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['worst case of brute force: O(n·m)', 'KMP: O(n + m) always', 'counting occurrences'],
  moTa: {
    en: `<p>Complete ${c('static int count(String text, String pat)')}: the number of (possibly overlapping) occurrences, in O(n + m) with the KMP table — no ${c('indexOf')} (rule R1). The complexity check uses the brute-force killer: the text ${c('aaaa…a')} (2,000,000 a’s) and the pattern ${c('aaa…ab')} (100,000 characters). Brute force compares about 2·10¹¹ characters; KMP about 4·10⁶.</p>`,
    vi: `<p>Hoàn thiện ${c('static int count(String text, String pat)')}: số lần xuất hiện (được chồng lấn), trong O(n + m) bằng bảng KMP — không ${c('indexOf')} (luật R1). Kiểm độ phức tạp dùng "sát thủ" của vét cạn: văn bản ${c('aaaa…a')} (2.000.000 chữ a) và mẫu ${c('aaa…ab')} (100.000 ký tự). Vét cạn so khoảng 2·10¹¹ ký tự; KMP khoảng 4·10⁶.</p>`,
  },
  yeuCau: { en: ['O(n + m).', 'No library search (rule R1).'], vi: ['O(n + m).', 'Không hàm tìm của thư viện (luật R1).'] },
  dauVao: { en: 'Lines "text | pattern"; PERF.', vi: 'Các dòng "văn bản | mẫu"; PERF.' },
  dauRa: { en: 'The number of occurrences.', vi: 'Số lần xuất hiện.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no indexOf / contains / regex in KmpCount', vi: 'không indexOf / contains / regex trong KmpCount', re: String.raw`\.(indexOf|contains|matches|regionMatches|startsWith|lastIndexOf)\s*\(|\bPattern\b`, file: 'KmpCount' }],
  hen: { n: '2,000,000 characters, a pattern of 100,000', ms: 3000, can: 'O(n + m)', cham: 'O(n·m) (brute force)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    char[] t = new char[2000000];
                    Arrays.fill(t, 'a');
                    char[] q = new char[100000];
                    Arrays.fill(q, 'a');
                    q[q.length - 1] = 'b';
                    final String text = new String(t), pat = new String(q);
                    final String all = text + pat.substring(1) + "b";
                    final int[] c = new int[2];
                    r = Kiem.hen("aaa...a vs aaa...ab", 3000, new Runnable() {
                        public void run() {
                            c[0] = KmpCount.count(text, pat);
                            c[1] = KmpCount.count(all, pat);
                        }
                    }) + ", counts " + c[0] + " " + c[1];
                } else {
                    int bar = line.indexOf('|');
                    r = String.valueOf(KmpCount.count(line.substring(0, bar).trim(), line.substring(bar + 1).trim()));
                }`,
    }),
  },
  tep: {
    'KmpCount.java': j`
public class KmpCount {

    static int count(String text, String pat) {
        //>> return 0; // TODO
        int m = pat.length();
        int[] T = new int[m + 1];
        T[0] = -1;
        for (int j = 1; j <= m; j++) {
            int k = T[j - 1];
            while (k >= 0 && pat.charAt(k) != pat.charAt(j - 1)) {
                k = T[k];
            }
            T[j] = k + 1;
        }
        int found = 0, i = 0, k = 0;
        while (i < text.length()) {
            if (text.charAt(i) == pat.charAt(k)) {
                i++;
                k++;
                if (k == m) {
                    found++;
                    k = T[k];
                }
            } else {
                k = T[k];
                if (k < 0) {
                    i++;
                    k = 0;
                }
            }
        }
        return found;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'small texts', vi: 'văn bản nhỏ' }, vao: 'abababab | abab\nmississippi | ss\nhello | world\n' },
    { ten: { en: 'pattern longer than the text, single characters', vi: 'mẫu dài hơn văn bản, ký tự đơn' }, vao: 'ab | abc\naaaaaaaaaa | a\nabcabcab | cab\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Reuse the T[] table of the previous exercise; count instead of recording positions.', vi: 'Dùng lại bảng T[] của bài trước; đếm thay vì ghi vị trí.' },
    { en: 'A pattern longer than the text simply never reaches k == m — no special case needed.', vi: 'Mẫu dài hơn văn bản đơn giản là không bao giờ tới k == m — không cần trường hợp riêng.' },
  ],
  loiHayGap: [
    { en: 'text.indexOf(pat, from) in a loop — the JDK uses a brute-force search: O(n·m) on this input.', vi: 'text.indexOf(pat, from) trong vòng lặp — JDK dùng tìm vét cạn: O(n·m) với đầu vào này.' },
    { en: 'Building T[] with a quadratic loop over all prefixes — slow for a 100,000-character pattern.', vi: 'Dựng T[] bằng vòng lặp bậc hai trên mọi tiền tố — chậm với mẫu 100.000 ký tự.' },
  ],
  giaiThich: { en: '<p>Brute force restarts the comparison at every position and on this input matches almost the whole pattern each time: (n − m)·m ≈ 2·10¹¹ comparisons. KMP never re-reads the text and the amortised analysis of the table bounds the work by 2(n + m).</p>', vi: '<p>Vét cạn so lại từ đầu ở mọi vị trí và với đầu vào này khớp gần hết mẫu mỗi lần: (n − m)·m ≈ 2·10¹¹ phép so sánh. KMP không đọc lại văn bản và phân tích khấu hao của bảng chặn công việc bởi 2(n + m).</p>' },
});

const de3 = deJava({
  id: 'csd201-8-2-period',
  tieuDe: { en: 'The shortest period of a string, read from the KMP table', vi: 'Chu kỳ ngắn nhất của một chuỗi, đọc từ bảng KMP' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['border and period: period = m − T[m]', 'a string is a repetition when m is divisible by its period'],
  moTa: {
    en: `<p>For a non-empty string s of length m, ${c('T[m]')} (the longest proper border of the whole string) gives its shortest period ${c('m − T[m]')}. Complete in ${c('Period')}:</p>
<ul><li>${c('static int period(String s)')} — e.g. ${c('"abcabcab"')} → 3;</li>
<li>${c('static String repeatedUnit(String s)')} — the shortest u with ${c('s = u + u + … + u')} (at least two copies), or ${c('"none"')}: ${c('"abab"')} → ${c('"ab"')}, ${c('"abcabcab"')} → none.</li></ul>`,
    vi: `<p>Với chuỗi s khác rỗng dài m, ${c('T[m]')} (biên thật dài nhất của cả chuỗi) cho chu kỳ ngắn nhất ${c('m − T[m]')}. Hoàn thiện trong ${c('Period')}: ${c('period(s)')} — vd ${c('"abcabcab"')} → 3; ${c('repeatedUnit(s)')} — chuỗi u ngắn nhất sao cho ${c('s = u + u + … + u')} (ít nhất hai bản), hoặc ${c('"none"')}: ${c('"abab"')} → ${c('"ab"')}, ${c('"abcabcab"')} → none.</p>`,
  },
  yeuCau: { en: ['O(m) with the table.', 'No brute force over all candidate lengths.'], vi: ['O(m) với bảng.', 'Không vét cạn mọi độ dài ứng viên.'] },
  dauVao: { en: 'One string per line; PERF.', vi: 'Mỗi dòng một chuỗi; PERF.' },
  dauRa: { en: 'The period and the repeated unit.', vi: 'Chu kỳ và đơn vị lặp.' },
  main: 'KiemTra',
  hen: { n: '2,000,000 characters', ms: 3000, can: 'O(m)', cham: 'trying every length d and comparing (O(m·divisors) or O(m²))' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    StringBuilder sb = new StringBuilder();
                    while (sb.length() < 1999999) {
                        sb.append("ab");
                    }
                    sb.append('c');
                    final String s = sb.toString();
                    final Object[] res = new Object[2];
                    r = Kiem.hen("m = 2,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = Period.period(s);
                            res[1] = Period.repeatedUnit(s);
                        }
                    }) + ", period " + res[0] + ", unit " + res[1];
                } else {
                    r = "period " + Period.period(line) + ", unit " + Period.repeatedUnit(line);
                }`,
    }),
  },
  tep: {
    'Period.java': j`
public class Period {

    static int period(String s) {
        //>> return s.length(); // TODO
        int m = s.length();
        return m - border(s);
        //<<
    }

    static String repeatedUnit(String s) {
        //>> return "none"; // TODO
        int p = period(s);
        return p < s.length() && s.length() % p == 0 ? s.substring(0, p) : "none";
        //<<
    }
    //>> // TODO: helper(s)

    // T[m]: the longest proper border of s
    private static int border(String s) {
        int m = s.length();
        int[] T = new int[m + 1];
        T[0] = -1;
        for (int j = 1; j <= m; j++) {
            int k = T[j - 1];
            while (k >= 0 && s.charAt(k) != s.charAt(j - 1)) {
                k = T[k];
            }
            T[j] = k + 1;
        }
        return T[m];
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'repetitions and near-repetitions', vi: 'chuỗi lặp và gần lặp' }, vao: 'abab\nabcabcab\naaaa\nabcd\nabaaba\n' },
    { ten: { en: 'one character, two equal halves', vi: 'một ký tự, hai nửa bằng nhau' }, vao: 'z\nxyzxyz\nabcabca\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'If s has a border of length b, then s[i] = s[i + (m − b)] for all valid i: m − b is a period, and the longest border gives the shortest period.', vi: 'Nếu s có biên dài b thì s[i] = s[i + (m − b)] với mọi i hợp lệ: m − b là một chu kỳ, và biên dài nhất cho chu kỳ ngắn nhất.' },
    { en: 's is a repetition of its first p characters exactly when p divides m (and p < m).', vi: 's là sự lặp lại của p ký tự đầu đúng khi p chia hết m (và p < m).' },
  ],
  loiHayGap: [
    { en: 'Answering "abcabcab" with "abc": the period is 3 but 8 is not a multiple of 3.', vi: 'Trả lời "abcabcab" là "abc": chu kỳ là 3 nhưng 8 không chia hết cho 3.' },
    { en: 'Treating a single character as a repetition of itself (one copy is not a repetition).', vi: 'Coi một ký tự là sự lặp của chính nó (một bản không phải là lặp).' },
  ],
  giaiThich: { en: '<p>Borders and periods are two views of the same thing: a border of length b ⇔ a period m − b. The KMP table gives the longest border in O(m), hence the shortest period, and the divisibility test decides whether the string is a power of a smaller word (LeetCode 459).</p>', vi: '<p>Biên và chu kỳ là hai cách nhìn cùng một điều: biên dài b ⇔ chu kỳ m − b. Bảng KMP cho biên dài nhất trong O(m), từ đó chu kỳ ngắn nhất, và phép thử chia hết quyết định chuỗi có là luỹ thừa của một từ ngắn hơn không (LeetCode 459).</p>' },
});

export default moDun({ slug: 'csd201-kmp', ten: '8.2 Pattern matching: brute force & KMP', de: [de1, de2, de3] });
