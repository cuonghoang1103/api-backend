/** CSD201 · 8.3 — Huffman: dựng cây theo quy ước slide (phá hoà bằng thứ tự tạo, con lớn bên trái) + mã hoá/giải mã, tổng số bit = tổng các lần gộp (kiểm O(n log n)), entropy và độ dài mã trung bình. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const HNODE = j`
// GIVEN — do not change. A Huffman tree node; id = creation order, used to break ties.
class HNode implements Comparable<HNode> {
    char ch;
    int freq, id;
    HNode left, right;

    HNode(char ch, int freq, int id, HNode left, HNode right) {
        this.ch = ch;
        this.freq = freq;
        this.id = id;
        this.left = left;
        this.right = right;
    }

    boolean isLeaf() {
        return left == null;
    }

    @Override
    public int compareTo(HNode o) {
        return freq != o.freq ? Integer.compare(freq, o.freq) : Integer.compare(id, o.id);
    }
}
`;

const de1 = deJava({
  id: 'csd201-8-3-huffman-codes',
  tieuDe: { en: 'Build the Huffman tree the slides’ way, then encode and decode', vi: 'Dựng cây Huffman theo cách của slide, rồi mã hoá và giải mã' },
  doKho: 'HARD', phut: 35, dangBai: 'pe',
  khaiNiem: ['repeatedly merge the two lightest trees', 'ties broken by creation order', 'left = 0, right = 1', 'decoding by walking the tree'],
  moTa: {
    en: `<p>Symbols get leaves in the order given (ids 0, 1, 2, …); with a ${c('PriorityQueue<HNode>')} (ordered by frequency, then id) repeatedly poll x then y (x ≤ y) and add a new node of weight x + y, the next id, with <b>left child y</b> (the heavier) and <b>right child x</b> — as on slide 29. Then the code of a symbol is the path from the root (left 0, right 1); a tree with one symbol gives it the code ${c('"0"')}. Complete in ${c('Huffman')}: ${c('build(String symbols, int[] freq)')}, ${c('String code(char c)')}, ${c('String encode(String text)')}, ${c('String decode(String bits)')}.</p>`,
    vi: `<p>Các ký hiệu nhận lá theo thứ tự cho (id 0, 1, 2, …); với ${c('PriorityQueue<HNode>')} (xếp theo tần suất rồi id) lặp: lấy x rồi y (x ≤ y) và thêm nút mới trọng số x + y, id kế tiếp, <b>con trái y</b> (nặng hơn) và <b>con phải x</b> — như slide 29. Mã của một ký hiệu là đường đi từ gốc (trái 0, phải 1); cây chỉ có một ký hiệu thì nó nhận mã ${c('"0"')}. Hoàn thiện trong ${c('Huffman')}: ${c('build(symbols, freq)')}, ${c('code(c)')}, ${c('encode(text)')}, ${c('decode(bits)')}.</p>`,
  },
  yeuCau: { en: ['Exactly this tie rule and child order (the codes depend on them).', 'HNode is given.'], vi: ['Đúng luật phá hoà và thứ tự con này (mã phụ thuộc vào chúng).', 'HNode cho sẵn.'] },
  dauVao: { en: '"BUILD symbols freq freq …", then CODES / ENC text / DEC bits.', vi: '"BUILD các ký hiệu tần suất …", rồi CODES / ENC văn bản / DEC bit.' },
  dauRa: { en: 'Codes, bit strings, decoded text.', vi: 'Các mã, dãy bit, văn bản đã giải mã.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Huffman t = new Huffman();\n        String syms = "";',
      lenh: `                if (p[0].equals("BUILD")) {
                    syms = p[1];
                    int[] f = new int[syms.length()];
                    for (int i = 0; i < f.length; i++) {
                        f[i] = n(2 + i);
                    }
                    t.build(syms, f);
                    r = "tree " + Kiem.cay(Kiem.lay(t, "root"), "left", "right", "freq");
                } else if (p[0].equals("CODES")) {
                    StringBuilder sb = new StringBuilder();
                    for (char ch : syms.toCharArray()) {
                        sb.append(ch).append('=').append(t.code(ch)).append(' ');
                    }
                    r = sb.toString().trim();
                } else if (p[0].equals("ENC")) {
                    String bits = t.encode(p[1]);
                    r = bits + " (" + bits.length() + " bits)";
                } else {
                    r = t.decode(p[1]);
                }`,
    }),
  },
  tep: {
    'HNode.java': HNODE,
    'Huffman.java': j`
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

public class Huffman {
    private HNode root;
    private final Map<Character, String> codes = new HashMap<>();

    public void build(String symbols, int[] freq) {
        //>> // TODO
        PriorityQueue<HNode> pq = new PriorityQueue<>();
        int id = 0;
        for (int i = 0; i < symbols.length(); i++) {
            pq.add(new HNode(symbols.charAt(i), freq[i], id++, null, null));
        }
        while (pq.size() > 1) {
            HNode x = pq.poll(), y = pq.poll(); // x <= y
            pq.add(new HNode('\0', x.freq + y.freq, id++, y, x)); // the heavier one on the left
        }
        root = pq.poll();
        codes.clear();
        assign(root, "");
        //<<
    }
    //>> // TODO: helper(s)

    private void assign(HNode x, String s) {
        if (x.isLeaf()) {
            codes.put(x.ch, s.isEmpty() ? "0" : s);
            return;
        }
        assign(x.left, s + "0");
        assign(x.right, s + "1");
    }
    //<<

    public String code(char c) {
        //>> return ""; // TODO
        return codes.get(c);
        //<<
    }

    public String encode(String text) {
        //>> return ""; // TODO
        StringBuilder b = new StringBuilder();
        for (char ch : text.toCharArray()) {
            b.append(codes.get(ch));
        }
        return b.toString();
        //<<
    }

    public String decode(String bits) {
        //>> return ""; // TODO
        StringBuilder out = new StringBuilder();
        HNode x = root;
        for (char b : bits.toCharArray()) {
            if (!root.isLeaf()) {
                x = b == '0' ? x.left : x.right;
            }
            if (x.isLeaf()) {
                out.append(x.ch);
                x = root;
            }
        }
        return out.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'ABRACADABRA and the slides’ example', vi: 'ABRACADABRA và ví dụ của slide' }, vao: 'BUILD ABRCD 5 2 2 1 1\nCODES\nENC ABRACADABRA\nDEC 0110111000\nBUILD ABCDE 15 7 6 6 5\nCODES\nENC ABCDE\n' },
    { ten: { en: 'one symbol, two symbols, equal weights', vi: 'một ký hiệu, hai ký hiệu, trọng số bằng nhau' }, vao: 'BUILD Z 9\nCODES\nENC ZZZ\nDEC 000\nBUILD XY 1 1\nCODES\nBUILD abcd 1 1 1 1\nCODES\nENC dcba\nDEC 00011011\n', an: true },
  ],
  goiY: [
    { en: 'HNode.compareTo already orders by (freq, id): poll twice, create the parent with the next id, add it back.', vi: 'HNode.compareTo đã xếp theo (tần suất, id): lấy ra hai lần, tạo nút cha với id kế tiếp, cho lại vào.' },
    { en: 'Collect the codes once by a recursive walk (left adds "0", right adds "1"); decoding walks the tree and restarts at the root at every leaf.', vi: 'Thu các mã một lần bằng duyệt đệ quy (trái thêm "0", phải thêm "1"); giải mã đi trên cây và quay lại gốc ở mỗi lá.' },
  ],
  loiHayGap: [
    { en: 'Putting the lighter child on the left — a valid Huffman code, but not the slides’ codes.', vi: 'Đặt con nhẹ hơn bên trái — vẫn là mã Huffman hợp lệ nhưng không phải mã của slide.' },
    { en: 'A one-symbol tree: the root is a leaf, the empty code "" cannot be decoded — give it "0".', vi: 'Cây một ký hiệu: gốc là lá, mã rỗng "" không giải mã được — gán "0".' },
  ],
  giaiThich: { en: '<p>Merging the two lightest trees first puts rare symbols deep and frequent ones near the root; this greedy choice minimises Σ freq·depth (the encoded length). With n symbols there are n − 1 merges of O(log n) each. ABRACADABRA becomes 23 bits instead of 88 with 8-bit characters.</p>', vi: '<p>Gộp hai cây nhẹ nhất trước đưa ký hiệu hiếm xuống sâu và ký hiệu thường gặp lên gần gốc; lựa chọn tham lam này cực tiểu Σ tần suất·độ sâu (độ dài sau mã hoá). Với n ký hiệu có n − 1 lần gộp, mỗi lần O(log n). ABRACADABRA còn 23 bit thay vì 88 bit với ký tự 8 bit.</p>' },
});

const de2 = deJava({
  id: 'csd201-8-3-huffman-cost',
  tieuDe: { en: 'The total Huffman length without building codes: the sum of the merges', vi: 'Tổng độ dài Huffman mà không cần dựng mã: tổng các lần gộp' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['each merge adds one bit to every symbol below it', 'cost = Σ merged weights', 'PriorityQueue<Long>', 'O(n log n)'],
  moTa: {
    en: `<p>Complete ${c('static long huffmanBits(long[] freq)')}: the total number of bits of a Huffman encoding where symbol i occurs ${c('freq[i]')} times. No tree is needed: every merge of two weights x and y adds one bit to each of the x + y symbol occurrences below the new node, so the answer is the <b>sum of all merged weights</b> (ABRACADABRA: 2 + 4 + 6 + 11 = 23). A single symbol costs 1 bit per occurrence; no symbol costs 0.</p>
<p>The complexity check has a million symbols — repeatedly scanning for the two smallest weights would be O(n²).</p>`,
    vi: `<p>Hoàn thiện ${c('static long huffmanBits(long[] freq)')}: tổng số bit của mã Huffman khi ký hiệu i xuất hiện ${c('freq[i]')} lần. Không cần cây: mỗi lần gộp hai trọng số x và y thêm một bit cho mỗi lần xuất hiện trong x + y lần nằm dưới nút mới, nên đáp án là <b>tổng mọi trọng số đã gộp</b> (ABRACADABRA: 2 + 4 + 6 + 11 = 23). Một ký hiệu duy nhất tốn 1 bit mỗi lần xuất hiện; không có ký hiệu nào thì 0.</p>
<p>Kiểm độ phức tạp có một triệu ký hiệu — mỗi lần quét tìm hai trọng số nhỏ nhất là O(n²).</p>`,
  },
  yeuCau: { en: ['A min-heap of weights: O(n log n).', 'long arithmetic.'], vi: ['Min-heap các trọng số: O(n log n).', 'Tính bằng long.'] },
  dauVao: { en: 'One list of frequencies per line ("-" = none); PERF.', vi: 'Mỗi dòng một danh sách tần suất ("-" = không có); PERF.' },
  dauRa: { en: 'The total number of bits.', vi: 'Tổng số bit.' },
  main: 'KiemTra',
  hen: { n: '1,000,000 symbols', ms: 3000, can: 'O(n log n)', cham: 'O(n²) (scanning for the two smallest each time)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    int[] v = Kiem.ngauNhien(1000000, 1000000, 151);
                    final long[] f = new long[v.length];
                    for (int i = 0; i < f.length; i++) {
                        f[i] = v[i] + 1;
                    }
                    final long[] res = new long[1];
                    r = Kiem.hen("n = 1,000,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = HuffmanCost.huffmanBits(f);
                        }
                    }) + ", bits " + res[0];
                } else {
                    long[] f = line.equals("-") ? new long[0] : new long[p.length];
                    for (int i = 0; i < f.length; i++) {
                        f[i] = Long.parseLong(p[i]);
                    }
                    r = String.valueOf(HuffmanCost.huffmanBits(f));
                }`,
    }),
  },
  tep: {
    'HuffmanCost.java': j`
import java.util.PriorityQueue;

public class HuffmanCost {

    static long huffmanBits(long[] freq) {
        //>> return 0; // TODO
        if (freq.length == 1) {
            return freq[0]; // one symbol: one bit per occurrence
        }
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (long f : freq) {
            pq.add(f);
        }
        long total = 0;
        while (pq.size() > 1) {
            long w = pq.poll() + pq.poll();
            total += w; // every occurrence below the new node gets one more bit
            pq.add(w);
        }
        return total;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'ABRACADABRA, the slides’ example, one symbol', vi: 'ABRACADABRA, ví dụ của slide, một ký hiệu' }, vao: '5 2 2 1 1\n15 7 6 6 5\n4\n-\n' },
    { ten: { en: 'equal weights, big counts', vi: 'trọng số bằng nhau, số đếm lớn' }, vao: '1 1 1 1 1 1 1 1\n1000000000000 1 1\n3 3\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'You only need the weights: poll two, add their sum to the answer, push the sum back.', vi: 'Chỉ cần các trọng số: lấy hai cái, cộng tổng của chúng vào đáp án, đẩy tổng trở lại.' },
    { en: 'Σ freq·depth = Σ over internal nodes of their weight — each internal node is counted once per occurrence below it.', vi: 'Σ tần suất·độ sâu = Σ trọng số các nút trong — mỗi nút trong được đếm một lần cho mỗi lần xuất hiện bên dưới nó.' },
  ],
  loiHayGap: [
    { en: 'Returning 0 for a single symbol — it still needs 1 bit per occurrence.', vi: 'Trả 0 cho một ký hiệu duy nhất — nó vẫn cần 1 bit mỗi lần xuất hiện.' },
    { en: 'int weights — sums above 2³¹ overflow.', vi: 'Trọng số int — tổng vượt 2³¹ thì tràn.' },
  ],
  giaiThich: { en: '<p>The encoded length is Σ freq(s)·depth(s); grouping by internal nodes gives Σ weight(v) over the n − 1 merges. With a heap each merge is O(log n): O(n log n) total, without ever building the tree.</p>', vi: '<p>Độ dài sau mã hoá là Σ tần suất(s)·độ sâu(s); gom theo nút trong được Σ trọng số(v) trên n − 1 lần gộp. Với heap, mỗi lần gộp O(log n): tổng O(n log n), mà không bao giờ dựng cây.</p>' },
});

const de3 = deJava({
  id: 'csd201-8-3-entropy',
  tieuDe: { en: 'Entropy, average code length and compression rate of a text', vi: 'Entropy, độ dài mã trung bình và tỉ lệ nén của một văn bản' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['H = −Σ p·log₂ p', 'average Huffman code length L', 'H ≤ L < H + 1', 'rate vs 8-bit characters'],
  moTa: {
    en: `<p>Complete ${c('static String report(String text)')} for a non-empty text: count the characters, compute the entropy ${c('H = −Σ p·log₂ p')}, the average Huffman code length ${c('L = (Huffman bits) / n')} (use the sum-of-merges trick; a text with one distinct character has L = 1), and the compression rate against 8-bit characters ${c('1 − L/8')} in percent. Return ${c('String.format(Locale.US, "H=%.3f L=%.3f rate=%.1f%%", …)')}.</p>`,
    vi: `<p>Hoàn thiện ${c('static String report(String text)')} cho văn bản khác rỗng: đếm ký tự, tính entropy ${c('H = −Σ p·log₂ p')}, độ dài mã Huffman trung bình ${c('L = (số bit Huffman) / n')} (dùng mẹo tổng các lần gộp; văn bản chỉ có một ký tự khác nhau thì L = 1), và tỉ lệ nén so với ký tự 8 bit ${c('1 − L/8')} theo phần trăm. Trả ${c('String.format(Locale.US, "H=%.3f L=%.3f rate=%.1f%%", …)')}.</p>`,
  },
  yeuCau: { en: ['Locale.US formatting (a dot as decimal separator).', 'L must satisfy H ≤ L < H + 1 — a good self-check.'], vi: ['Định dạng Locale.US (dấu chấm thập phân).', 'L phải thoả H ≤ L < H + 1 — một cách tự kiểm tốt.'] },
  dauVao: { en: 'One text per line.', vi: 'Mỗi dòng một văn bản.' },
  dauRa: { en: 'H, L and the rate.', vi: 'H, L và tỉ lệ.' },
  main: 'KiemTra',
  harness: { 'KiemTra.java': lopKiem({ lenh: '                r = Entropy.report(line);' }) },
  tep: {
    'Entropy.java': j`
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.PriorityQueue;

public class Entropy {

    static String report(String text) {
        //>> return ""; // TODO
        Map<Character, Long> count = new HashMap<>();
        for (char ch : text.toCharArray()) {
            count.merge(ch, 1L, Long::sum);
        }
        int n = text.length();
        double h = 0;
        for (long c : count.values()) {
            double pr = (double) c / n;
            h -= pr * Math.log(pr) / Math.log(2);
        }
        long bits;
        if (count.size() == 1) {
            bits = n;
        } else {
            PriorityQueue<Long> pq = new PriorityQueue<>(count.values());
            bits = 0;
            while (pq.size() > 1) {
                long w = pq.poll() + pq.poll();
                bits += w;
                pq.add(w);
            }
        }
        double l = (double) bits / n;
        return String.format(Locale.US, "H=%.3f L=%.3f rate=%.1f%%", h, l, (1 - l / 8) * 100);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'ABRACADABRA, a uniform text, one repeated character', vi: 'ABRACADABRA, văn bản đều, một ký tự lặp' }, vao: 'ABRACADABRA\nABCDABCD\nAAAAAA\n' },
    { ten: { en: 'a skewed text and a sentence', vi: 'một văn bản lệch và một câu' }, vao: 'AAAAAAAB\nthe quick brown fox jumps over the lazy dog\n', an: true },
  ],
  goiY: [
    { en: 'log₂ x = Math.log(x) / Math.log(2).', vi: 'log₂ x = Math.log(x) / Math.log(2).' },
    { en: 'H is a lower bound for any uniquely decodable code; Huffman is within one bit of it.', vi: 'H là cận dưới của mọi mã giải mã duy nhất được; Huffman cách nó không quá một bit.' },
  ],
  loiHayGap: [
    { en: 'String.format without Locale.US — on a Vietnamese system "2,040" appears instead of "2.040".', vi: 'String.format không có Locale.US — trên máy tiếng Việt ra "2,040" thay vì "2.040".' },
    { en: 'Integer division c / n — every probability becomes 0.', vi: 'Chia nguyên c / n — mọi xác suất thành 0.' },
  ],
  giaiThich: { en: '<p>Shannon’s entropy is the minimum average number of bits per symbol for a source with these frequencies; Huffman reaches H exactly when all probabilities are powers of 1/2 and is always below H + 1. Comparing L with 8 gives the saving over plain bytes.</p>', vi: '<p>Entropy Shannon là số bit trung bình tối thiểu mỗi ký hiệu cho một nguồn có các tần suất này; Huffman đạt đúng H khi mọi xác suất là luỹ thừa của 1/2 và luôn nhỏ hơn H + 1. So L với 8 cho biết mức tiết kiệm so với byte thường.</p>' },
});

export default moDun({ slug: 'csd201-huffman', ten: '8.3 Huffman coding, built step by step', de: [de1, de2, de3] });
