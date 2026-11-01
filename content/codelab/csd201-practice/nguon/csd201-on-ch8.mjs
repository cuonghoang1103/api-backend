/** CSD201 · 8.5 — Thực hành chương 8: vét cạn mọi vị trí + số phép so sánh (kiểu PE), nhật ký tin nhắn f1–f3 (KMP, RLE, số bit Huffman), so sánh ba cách nén trên cùng văn bản. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-8-5-brute-force',
  tieuDe: { en: 'PE style: brute-force matching, every position and the number of comparisons', vi: 'Kiểu PE: so khớp vét cạn, mọi vị trí và số phép so sánh' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['try every alignment i = 0 … n − m', 'stop an alignment at the first mismatch', 'worst case m·(n − m + 1)'],
  moTa: {
    en: `<p>Complete ${c('static String bruteForce(String a, String p)')}: for every alignment i = 0 … n − m compare ${c('p[0], p[1], …')} with ${c('a[i], a[i+1], …')}, counting <b>every</b> character comparison, and stop the alignment at the first mismatch. Return the matching positions separated by spaces, then ${c('" | comparisons C"')} (the format of the slides’ table).</p>`,
    vi: `<p>Hoàn thiện ${c('static String bruteForce(String a, String p)')}: với mọi vị trí đặt i = 0 … n − m, so ${c('p[0], p[1], …')} với ${c('a[i], a[i+1], …')}, đếm <b>mọi</b> phép so sánh ký tự, và dừng vị trí đặt đó ở chỗ không khớp đầu tiên. Trả các vị trí khớp cách nhau dấu cách, rồi ${c('" | comparisons C"')} (định dạng bảng của slide).</p>`,
  },
  yeuCau: { en: ['Count each a[i+j] == p[j] test once.', 'No library search (rule R1).'], vi: ['Đếm mỗi lần thử a[i+j] == p[j] một lần.', 'Không hàm tìm của thư viện (luật R1).'] },
  dauVao: { en: 'Lines "text | pattern".', vi: 'Các dòng "văn bản | mẫu".' },
  dauRa: { en: 'Positions and comparisons.', vi: 'Các vị trí và số so sánh.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no indexOf / contains / regex in Brute', vi: 'không indexOf / contains / regex trong Brute', re: String.raw`\.(indexOf|contains|matches|regionMatches|startsWith)\s*\(`, file: 'Brute' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int bar = line.indexOf('|');
                r = Brute.bruteForce(line.substring(0, bar).trim(), line.substring(bar + 1).trim());`,
    }),
  },
  tep: {
    'Brute.java': j`
public class Brute {

    static String bruteForce(String a, String p) {
        //>> return ""; // TODO
        StringBuilder res = new StringBuilder();
        long comparisons = 0;
        int n = a.length(), m = p.length();
        for (int i = 0; i + m <= n; i++) {
            int j = 0;
            while (j < m) {
                comparisons++;
                if (a.charAt(i + j) != p.charAt(j)) {
                    break;
                }
                j++;
            }
            if (j == m) {
                res.append(i).append(' ');
            }
        }
        return res.toString().trim() + " | comparisons " + comparisons;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example, overlapping matches', vi: 'ví dụ của slide, khớp chồng lấn' }, vao: 'abacaabaccabacabaabb | abacab\naaaaa | aa\nabc | d\n' },
    { ten: { en: 'the worst case, pattern longer than the text', vi: 'trường hợp xấu nhất, mẫu dài hơn văn bản' }, vao: 'aaaaaaaaab | aaab\nab | abc\nxyz | xyz\n', an: true },
  ],
  goiY: [
    { en: 'Two loops: i over the alignments, j over the pattern; increment the counter before each comparison.', vi: 'Hai vòng: i chạy qua các vị trí đặt, j chạy qua mẫu; tăng bộ đếm trước mỗi phép so sánh.' },
    { en: 'A match is j == m after the inner loop.', vi: 'Khớp là khi j == m sau vòng trong.' },
  ],
  loiHayGap: [
    { en: 'Looping i up to n − 1 — reads past the end of the text.', vi: 'Cho i chạy tới n − 1 — đọc vượt cuối văn bản.' },
    { en: 'Counting only the mismatches.', vi: 'Chỉ đếm các lần không khớp.' },
  ],
  giaiThich: { en: '<p>Brute force needs no preprocessing and is fine on natural text, where mismatches come early; its worst case is m·(n − m + 1) comparisons (aaaa…ab), which is what KMP avoids. Comparing the counts on the same inputs is the clearest way to see the difference.</p>', vi: '<p>Vét cạn không cần tiền xử lý và ổn với văn bản tự nhiên, nơi không khớp đến sớm; trường hợp xấu nhất của nó là m·(n − m + 1) phép so sánh (aaaa…ab), chính là điều KMP tránh. So số phép so sánh trên cùng đầu vào là cách rõ nhất để thấy khác biệt.</p>' },
});

const de2 = deJava({
  id: 'csd201-8-5-message-log',
  tieuDe: { en: 'The message log (close to a real PE): f1 KMP search, f2 RLE, f3 Huffman bits', vi: 'Nhật ký tin nhắn (gần đề thật): f1 tìm bằng KMP, f2 nén RLE, f3 số bit Huffman' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['a linked list of records', 'KMP inside a list traversal', 'RLE only when shorter', 'Huffman bits = sum of merges'],
  moTa: {
    en: `<p>Messages ${c('Msg(sender, body)')} are kept in a singly linked list ${c('MsgList')} (head, tail; ${c('addLast')} is given). Write:</p>
<ul><li><b>f1</b> ${c('int f1(String keyword)')} — how many messages contain the keyword, using your own KMP (no indexOf, rule R1);</li>
<li><b>f2</b> ${c('int f2()')} — replace a body by its RLE form only when that is <b>strictly shorter</b>; return how many bodies changed;</li>
<li><b>f3</b> ${c('int f3()')} — the number of bits needed if all bodies together were Huffman-coded (one distinct character: 1 bit each; no character at all: 0).</li></ul>
<p>(An, aaaaaabbbb), (Binh, hello world), (Chi, zzzzzzzzzzzz), (Dung, hello hello): f1("hello") = 2; f2() = 2.</p>`,
    vi: `<p>Các tin nhắn ${c('Msg(sender, body)')} nằm trong danh sách liên kết đơn ${c('MsgList')} (head, tail; ${c('addLast')} cho sẵn). Viết: <b>f1</b> ${c('f1(keyword)')} — số tin chứa từ khoá, dùng KMP tự viết (không indexOf, luật R1); <b>f2</b> ${c('f2()')} — thay nội dung bằng dạng RLE chỉ khi ngắn hơn <b>hẳn</b>, trả số tin đã đổi; <b>f3</b> ${c('f3()')} — số bit cần nếu mọi nội dung gộp lại được mã Huffman (một ký tự khác nhau: 1 bit mỗi ký tự; không có ký tự nào: 0).</p>
<p>(An, aaaaaabbbb), (Binh, hello world), (Chi, zzzzzzzzzzzz), (Dung, hello hello): f1("hello") = 2; f2() = 2.</p>`,
  },
  yeuCau: { en: ['KMP for f1 (rule R1).', 'Msg and Node are given.'], vi: ['KMP cho f1 (luật R1).', 'Msg và Node cho sẵn.'] },
  dauVao: { en: 'MSG sender body… · F1 keyword · F2 · F3 · PRINT.', vi: 'MSG người gửi nội dung… · F1 từ khoá · F2 · F3 · PRINT.' },
  dauRa: { en: 'Results and the list.', vi: 'Kết quả và danh sách.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no indexOf / contains / regex in MsgList', vi: 'không indexOf / contains / regex trong MsgList', re: String.raw`\.(indexOf|contains|matches|regionMatches|startsWith)\s*\(`, file: 'MsgList' }],
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        MsgList t = new MsgList();',
      lenh: `                if (p[0].equals("MSG")) {
                    t.addLast(p[1], line.length() > 5 + p[1].length() ? line.substring(5 + p[1].length()) : "");
                } else if (p[0].equals("F1")) {
                    r = String.valueOf(t.f1(p.length > 1 ? p[1] : ""));
                } else if (p[0].equals("F2")) {
                    r = String.valueOf(t.f2());
                } else if (p[0].equals("F3")) {
                    r = String.valueOf(t.f3());
                } else {
                    r = Kiem.chuoi(Kiem.lay(t, "head"), "next", "info", 100);
                }`,
    }),
  },
  tep: {
    'Msg.java': j`
// GIVEN — do not change.
class Msg {
    String sender, body;

    Msg(String sender, String body) {
        this.sender = sender;
        this.body = body;
    }

    @Override
    public String toString() {
        return "(" + sender + "," + body + ")";
    }
}
`,
    'Node.java': j`
// GIVEN — do not change.
class Node {
    Msg info;
    Node next;

    Node(Msg x, Node p) {
        info = x;
        next = p;
    }
}
`,
    'MsgList.java': j`
import java.util.PriorityQueue;

public class MsgList {
    Node head, tail;

    void addLast(String sender, String body) {
        Node q = new Node(new Msg(sender, body), null);
        if (head == null) {
            head = tail = q;
        } else {
            tail.next = q;
            tail = q;
        }
    }

    // f1
    int f1(String keyword) {
        //>> return 0; // TODO
        int count = 0;
        for (Node p = head; p != null; p = p.next) {
            if (contains(p.info.body, keyword)) {
                count++;
            }
        }
        return count;
        //<<
    }

    // f2
    int f2() {
        //>> return 0; // TODO
        int changed = 0;
        for (Node p = head; p != null; p = p.next) {
            String r = rle(p.info.body);
            if (r.length() < p.info.body.length()) {
                p.info.body = r;
                changed++;
            }
        }
        return changed;
        //<<
    }

    // f3
    int f3() {
        //>> return 0; // TODO
        int[] f = new int[65536];
        for (Node p = head; p != null; p = p.next) {
            for (char ch : p.info.body.toCharArray()) {
                f[ch]++;
            }
        }
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : f) {
            if (x > 0) {
                pq.add(x);
            }
        }
        if (pq.isEmpty()) {
            return 0;
        }
        if (pq.size() == 1) {
            return pq.peek();
        }
        int bits = 0;
        while (pq.size() > 1) {
            int w = pq.poll() + pq.poll();
            bits += w;
            pq.add(w);
        }
        return bits;
        //<<
    }
    //>> // TODO: helper(s)

    static boolean contains(String a, String p) { // KMP with the slides' T[]
        int m = p.length();
        if (m == 0) {
            return true;
        }
        int[] T = new int[m];
        T[0] = -1;
        for (int j = 1; j < m; j++) {
            int k = T[j - 1];
            while (k >= 0 && p.charAt(k) != p.charAt(j - 1)) {
                k = T[k];
            }
            T[j] = k + 1;
        }
        for (int i = 0, k = 0; i < a.length(); ) {
            if (a.charAt(i) == p.charAt(k)) {
                i++;
                k++;
                if (k == m) {
                    return true;
                }
            } else {
                k = T[k];
                if (k < 0) {
                    i++;
                    k = 0;
                }
            }
        }
        return false;
    }

    static String rle(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i < s.length(); i = j) {
            for (j = i; j < s.length() && s.charAt(j) == s.charAt(i); j++) {
                // find the end of the run
            }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'the lesson’s four messages', vi: 'bốn tin nhắn của bài' }, vao: 'MSG An aaaaaabbbb\nMSG Binh hello world\nMSG Chi zzzzzzzzzzzz\nMSG Dung hello hello\nF1 hello\nF1 ab\nF1 xyz\nF3\nF2\nPRINT\nF2\n' },
    { ten: { en: 'empty list, one character, ABRACADABRA', vi: 'danh sách rỗng, một ký tự, ABRACADABRA' }, vao: 'F1 a\nF2\nF3\nMSG X AAAA\nF3\nMSG Y ABR\nMSG Z ACADABRA\nF3\nF1 ABRA\nF1 CAD\n', an: true },
  ],
  goiY: [
    { en: 'f1 is a list traversal with a KMP "contains" inside; f2 is a traversal with RLE inside — reuse the code of 8.2 and 8.1.', vi: 'f1 là duyệt danh sách với "contains" bằng KMP bên trong; f2 là duyệt với RLE bên trong — dùng lại code của bài 8.2 và 8.1.' },
    { en: 'f3: count all characters of all bodies, then the sum-of-merges trick of 8.3.', vi: 'f3: đếm mọi ký tự của mọi nội dung, rồi mẹo tổng các lần gộp của bài 8.3.' },
  ],
  loiHayGap: [
    { en: 'f2 replacing every body — "hello world" becomes the longer "1h1e2l1o…".', vi: 'f2 thay mọi nội dung — "hello world" thành chuỗi dài hơn "1h1e2l1o…".' },
    { en: 'f3 counting characters per message and adding the results — Huffman over all bodies together is not the sum of separate codes.', vi: 'f3 đếm ký tự từng tin rồi cộng kết quả — Huffman trên mọi nội dung gộp lại không bằng tổng các mã riêng.' },
  ],
  giaiThich: { en: '<p>A real PE combines the chapter’s algorithms with the list traversal of chapter 1: each f is "walk the list, apply one algorithm". f3 needs only the counts — n − 1 merges of a heap, no tree.</p>', vi: '<p>Đề PE thật kết hợp các thuật toán của chương với phép duyệt danh sách của chương 1: mỗi f là "đi hết danh sách, áp một thuật toán". f3 chỉ cần các số đếm — n − 1 lần gộp trên heap, không cần cây.</p>' },
});

const de3 = deJava({
  id: 'csd201-8-5-which-compression',
  tieuDe: { en: 'Which compression wins? RLE, LZW and Huffman on the same text', vi: 'Cách nén nào thắng? RLE, LZW và Huffman trên cùng một văn bản' },
  doKho: 'MEDIUM', phut: 30,
  khaiNiem: ['comparing sizes in bits', 'fixed-width LZW codes', 'when each method shines'],
  moTa: {
    en: `<p>Complete ${c('static String compare(String text, String alphabet)')} for a non-empty text over the given alphabet. Compute, in bits:</p>
<ul><li>${c('raw')} = 8 · n;</li>
<li>${c('rle')} = 8 · (length of the RLE string of 8.1);</li>
<li>${c('lzw')} = 12 · (number of LZW codes of 8.4, dictionary numbered from 1) — 12-bit codes as in classic LZW;</li>
<li>${c('huffman')} = the Huffman bits (sum of merges; one distinct character → n).</li></ul>
<p>Return ${c('"raw R rle X lzw Y huffman Z best NAME"')} where NAME is the method with the fewest bits among rle, lzw, huffman (ties: the earlier one in that order).</p>`,
    vi: `<p>Hoàn thiện ${c('static String compare(String text, String alphabet)')} cho văn bản khác rỗng trên bảng chữ cho trước. Tính bằng bit: ${c('raw')} = 8 · n; ${c('rle')} = 8 · (độ dài chuỗi RLE của bài 8.1); ${c('lzw')} = 12 · (số mã LZW của bài 8.4, từ điển đánh số từ 1) — mã 12 bit như LZW cổ điển; ${c('huffman')} = số bit Huffman (tổng các lần gộp; một ký tự khác nhau → n).</p>
<p>Trả ${c('"raw R rle X lzw Y huffman Z best NAME"')} với NAME là phương pháp ít bit nhất trong rle, lzw, huffman (bằng nhau: phương pháp đứng trước theo thứ tự đó).</p>`,
  },
  yeuCau: { en: ['Reuse your RLE, LZW and Huffman code.', 'Exact output format.'], vi: ['Dùng lại code RLE, LZW và Huffman của bạn.', 'Đúng định dạng đầu ra.'] },
  dauVao: { en: 'Lines "alphabet : text".', vi: 'Các dòng "bảng chữ : văn bản".' },
  dauRa: { en: 'The comparison.', vi: 'Bảng so sánh.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int colon = line.indexOf(':');
                r = Compare.compare(line.substring(colon + 1).trim(), line.substring(0, colon).trim());`,
    }),
  },
  tep: {
    'Compare.java': j`
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

public class Compare {

    static String compare(String text, String alphabet) {
        //>> return ""; // TODO
        long raw = 8L * text.length();
        long rle = 8L * rle(text).length();
        long lzw = 12L * lzwCodes(text, alphabet);
        long huf = huffmanBits(text);
        String best = "rle";
        long bestBits = rle;
        if (lzw < bestBits) {
            best = "lzw";
            bestBits = lzw;
        }
        if (huf < bestBits) {
            best = "huffman";
        }
        return "raw " + raw + " rle " + rle + " lzw " + lzw + " huffman " + huf + " best " + best;
        //<<
    }
    //>> // TODO: helper(s)

    static String rle(String s) {
        StringBuilder out = new StringBuilder();
        for (int i = 0, j; i < s.length(); i = j) {
            for (j = i; j < s.length() && s.charAt(j) == s.charAt(i); j++) {
                // the end of the run
            }
            out.append(j - i).append(s.charAt(i));
        }
        return out.toString();
    }

    static int lzwCodes(String s, String alphabet) {
        Map<String, Integer> dict = new HashMap<>();
        for (int i = 0; i < alphabet.length(); i++) {
            dict.put(String.valueOf(alphabet.charAt(i)), i + 1);
        }
        int codes = 0;
        String p = "";
        for (char ch : s.toCharArray()) {
            if (dict.containsKey(p + ch)) {
                p = p + ch;
            } else {
                codes++;
                dict.put(p + ch, dict.size() + 1);
                p = String.valueOf(ch);
            }
        }
        return p.isEmpty() ? codes : codes + 1;
    }

    static long huffmanBits(String s) {
        Map<Character, Long> f = new HashMap<>();
        for (char ch : s.toCharArray()) {
            f.merge(ch, 1L, Long::sum);
        }
        if (f.size() == 1) {
            return s.length();
        }
        PriorityQueue<Long> pq = new PriorityQueue<>(f.values());
        long bits = 0;
        while (pq.size() > 1) {
            long w = pq.poll() + pq.poll();
            bits += w;
            pq.add(w);
        }
        return bits;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'long runs, two-letter repetition, ABRACADABRA, a long repeated phrase', vi: 'loạt dài, lặp hai chữ, ABRACADABRA, một cụm lặp dài' }, vao: 'AB : AAAAAAAAAAAAAAAAAAAABBBBBBBBBBBBBBBBBBBB\nAB : ABABABABABABABABABABABABABABABABABABABAB\nABCDR : ABRACADABRA\nABCDEFGH : ABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGHABCDEFGH\n' },
    { ten: { en: 'one character, no structure', vi: 'một ký tự, không có cấu trúc' }, vao: 'A : AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nABCDEFGH : HGFEDCBA\n', an: true },
  ],
  goiY: [
    { en: 'You already wrote the three pieces in 8.1, 8.3 and 8.4 — put them in helper methods and compare the numbers.', vi: 'Bạn đã viết ba phần này ở bài 8.1, 8.3 và 8.4 — đặt chúng vào các hàm phụ rồi so các con số.' },
    { en: 'For LZW only the number of codes matters here, not the codes themselves.', vi: 'Với LZW ở đây chỉ cần số lượng mã, không cần chính các mã.' },
  ],
  loiHayGap: [
    { en: 'Comparing RLE in characters with the others in bits — convert everything to bits first.', vi: 'So RLE theo ký tự với các phương pháp khác theo bit — đổi hết sang bit trước.' },
    { en: 'Forgetting the final LZW code for the last prefix.', vi: 'Quên mã LZW cuối cùng cho tiền tố cuối.' },
  ],
  giaiThich: { en: '<p>Each method exploits a different redundancy: RLE long runs of one character, Huffman skewed character frequencies (with two letters it already needs only 1 bit each), LZW repeated substrings — with 12-bit codes it only pays off once the dictionary holds long chunks, as in the 480-character repeated phrase where it beats Huffman’s 3 bits per character. Real compressors (DEFLATE in zip/gzip) combine LZ77 for repetitions with Huffman for frequencies.</p>', vi: '<p>Mỗi phương pháp khai thác một kiểu dư thừa khác: RLE loạt dài một ký tự, Huffman tần suất ký tự lệch (với hai chữ cái nó chỉ cần 1 bit mỗi ký tự), LZW chuỗi con lặp lại — với mã 12 bit nó chỉ có lợi khi từ điển đã chứa các đoạn dài, như cụm lặp 480 ký tự nơi nó thắng 3 bit/ký tự của Huffman. Các bộ nén thật (DEFLATE trong zip/gzip) kết hợp LZ77 cho phần lặp với Huffman cho tần suất.</p>' },
});

export default moDun({ slug: 'csd201-on-ch8', ten: '8.5 🧪 Practice — brute force, a PE-style message log, choosing a compression', de: [de1, de2, de3] });
