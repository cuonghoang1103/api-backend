/** CSD201 · 7.2 — Hàm băm & hợp đồng hashCode/equals: băm đa thức (Horner, như String.hashCode) + đếm va chạm, lớp khoá tự viết equals/hashCode, Rabin–Karp băm cuộn (kiểm O(n + m)). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-7-2-polynomial-hash',
  tieuDe: { en: 'Polynomial hashing by Horner’s rule — and counting collisions', vi: 'Băm đa thức theo Horner — và đếm va chạm' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['h = h·31 + c', 'int overflow is part of String.hashCode', 'compression with mod m', 'collisions'],
  moTa: {
    en: `<p>Complete in ${c('Hashing')}:</p>
<ul><li>${c('static int javaHash(String s)')} — exactly ${c('String.hashCode()')}: ${c('h = 31·h + s.charAt(i)')} in <b>int</b> arithmetic (overflow wraps around) — without calling hashCode;</li>
<li>${c('static int bucket(String s, int m)')} — the bucket in a table of size m: ${c('Math.floorMod(javaHash(s), m)')} (the hash can be negative);</li>
<li>${c('static int collisions(String[] words, int m)')} — the number of words that land in a bucket already used by an earlier, <b>different</b> word.</li></ul>`,
    vi: `<p>Hoàn thiện trong ${c('Hashing')}: ${c('javaHash(s)')} — đúng như ${c('String.hashCode()')}: ${c('h = 31·h + s.charAt(i)')} bằng phép tính <b>int</b> (tràn thì quay vòng) — không gọi hashCode; ${c('bucket(s, m)')} — ô trong bảng cỡ m: ${c('Math.floorMod(javaHash(s), m)')} (giá trị băm có thể âm); ${c('collisions(words, m)')} — số từ rơi vào ô đã có một từ <b>khác</b> trước đó.</p>`,
  },
  yeuCau: { en: ['Do not call hashCode() on the String (rule R1).', 'Equal words are not collisions.'], vi: ['Không gọi hashCode() trên String (luật R1).', 'Từ giống nhau không phải va chạm.'] },
  dauVao: { en: 'HASH word · COLL m : words.', vi: 'HASH từ · COLL m : các từ.' },
  dauRa: { en: 'Hash values, buckets, collision counts.', vi: 'Giá trị băm, ô, số va chạm.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no hashCode() call in Hashing', vi: 'không gọi hashCode() trong Hashing', re: String.raw`\.hashCode\s*\(|Objects\s*\.\s*hash`, file: 'Hashing' }],
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("HASH")) {
                    r = Hashing.javaHash(p[1]) + " (String.hashCode " + p[1].hashCode() + ") bucket13=" + Hashing.bucket(p[1], 13);
                } else {
                    r = String.valueOf(Hashing.collisions(Arrays.copyOfRange(p, 3, p.length), n(1)));
                }`,
    }),
  },
  tep: {
    'Hashing.java': j`
import java.util.HashMap;
import java.util.Map;

public class Hashing {

    static int javaHash(String s) {
        //>> return 0; // TODO
        int h = 0;
        for (int i = 0; i < s.length(); i++) {
            h = 31 * h + s.charAt(i); // int overflow wraps around, exactly like String.hashCode
        }
        return h;
        //<<
    }

    static int bucket(String s, int m) {
        //>> return 0; // TODO
        return Math.floorMod(javaHash(s), m);
        //<<
    }

    static int collisions(String[] words, int m) {
        //>> return 0; // TODO
        Map<Integer, String> owner = new HashMap<>(); // bucket -> the first word stored there
        int c = 0;
        for (String w : words) {
            int b = bucket(w, m);
            String first = owner.get(b);
            if (first == null) {
                owner.put(b, w);
            } else if (!first.equals(w)) {
                c++;
            }
        }
        return c;
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'short words, a known collision pair', vi: 'từ ngắn, một cặp va chạm nổi tiếng' }, vao: 'HASH a\nHASH abc\nHASH Aa\nHASH BB\nCOLL 13 : Aa BB cat dog cat\n' },
    { ten: { en: 'long words that overflow, negative hashes', vi: 'từ dài bị tràn số, giá trị băm âm' }, vao: 'HASH polygenelubricants\nHASH hashtable\nCOLL 7 : one two three four five six seven eight\nCOLL 1000 : alpha beta gamma\n', an: true },
  ],
  goiY: [
    { en: 'Horner: start with 0 and for each character h = 31 * h + c. Keep h an int — the wrap-around is intended.', vi: 'Horner: bắt đầu 0, với mỗi ký tự h = 31 * h + c. Giữ h là int — việc quay vòng là có chủ đích.' },
    { en: 'h % m is negative for negative h in Java; Math.floorMod(h, m) is always in 0..m−1.', vi: 'Trong Java h % m âm khi h âm; Math.floorMod(h, m) luôn trong 0..m−1.' },
  ],
  loiHayGap: [
    { en: 'Using long and taking the result mod 2³² by hand — easy to get the sign wrong; int arithmetic matches Java exactly.', vi: 'Dùng long rồi tự lấy mod 2³² — dễ sai dấu; tính bằng int khớp Java chính xác.' },
    { en: 'Math.abs(h) % m — Math.abs(Integer.MIN_VALUE) is still negative.', vi: 'Math.abs(h) % m — Math.abs(Integer.MIN_VALUE) vẫn âm.' },
  ],
  giaiThich: { en: '<p>The polynomial hash weighs every character by a power of 31, so permutations of the same letters usually differ; "Aa" and "BB" collide because 31·65 + 97 = 31·66 + 66. A hash table compresses the 2³² possible values into m buckets, so collisions are unavoidable — the table design must handle them.</p>', vi: '<p>Băm đa thức gán cho mỗi ký tự một luỹ thừa của 31, nên các hoán vị cùng chữ cái thường khác nhau; "Aa" và "BB" va chạm vì 31·65 + 97 = 31·66 + 66. Bảng băm nén 2³² giá trị có thể vào m ô, nên va chạm là không tránh được — thiết kế bảng phải xử lý chúng.</p>' },
});

const de2 = deJava({
  id: 'csd201-7-2-equals-hashcode',
  tieuDe: { en: 'Your own key class: equals and hashCode that agree', vi: 'Lớp khoá tự viết: equals và hashCode khớp nhau' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['equal objects must have equal hash codes', 'case-insensitive keys', 'HashSet/HashMap rely on both'],
  moTa: {
    en: `<p>${c('Plate')} is a licence plate like ${c('"29A-123.45"')}: two plates are the same when they have the same characters <b>ignoring case, spaces and dashes/dots</b> (${c('"29a 12345"')} equals ${c('"29A-123.45"')}). Complete ${c('equals(Object o)')} and ${c('hashCode()')} so that a ${c('HashSet<Plate>')} and a ${c('HashMap<Plate, String>')} behave correctly.</p>
<p>The grader inserts plates written in different ways and asks the set and the map; it also checks that equal plates have equal hash codes.</p>`,
    vi: `<p>${c('Plate')} là biển số như ${c('"29A-123.45"')}: hai biển là một khi có cùng các ký tự <b>bỏ qua hoa thường, dấu cách và dấu gạch/chấm</b> (${c('"29a 12345"')} bằng ${c('"29A-123.45"')}). Hoàn thiện ${c('equals(Object o)')} và ${c('hashCode()')} để ${c('HashSet<Plate>')} và ${c('HashMap<Plate, String>')} chạy đúng.</p>
<p>Máy chấm chèn các biển viết theo nhiều cách rồi hỏi tập và map; nó còn kiểm các biển bằng nhau có hashCode bằng nhau.</p>`,
  },
  yeuCau: { en: ['Normalise once (in the constructor) and compare/hash the normal form.', '@Override on both methods.'], vi: ['Chuẩn hoá một lần (trong constructor) rồi so/băm dạng chuẩn.', '@Override cho cả hai hàm.'] },
  dauVao: { en: 'ADD plate owner · HAS plate · OWNER plate · SAME a b.', vi: 'ADD biển chủ · HAS biển · OWNER biển · SAME a b.' },
  dauRa: { en: 'Set/map answers and the size.', vi: 'Câu trả lời của tập/map và kích thước.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Set<Plate> set = new HashSet<>();\n        Map<Plate, String> map = new HashMap<>();',
      lenh: `                String a = p[1].replace('_', ' ');
                if (p[0].equals("ADD")) {
                    r = String.valueOf(set.add(new Plate(a)));
                    map.put(new Plate(a), p[2]);
                } else if (p[0].equals("HAS")) {
                    r = String.valueOf(set.contains(new Plate(a)));
                } else if (p[0].equals("OWNER")) {
                    r = String.valueOf(map.get(new Plate(a)));
                } else {
                    Plate x = new Plate(a), y = new Plate(p[2].replace('_', ' '));
                    r = "equals " + x.equals(y) + ", same hash " + (x.hashCode() == y.hashCode()) + ", equals(null) " + x.equals(null) + ", equals(String) " + x.equals(a);
                }`,
      trangThai: '"set size " + set.size() + ", map size " + map.size()',
    }),
  },
  tep: {
    'Plate.java': j`
public class Plate {
    private final String text; // as written
    //>> // TODO: a normalised form
    private final String key; // upper case, letters and digits only
    //<<

    public Plate(String text) {
        this.text = text;
        //>> // TODO
        StringBuilder sb = new StringBuilder();
        for (char ch : text.toCharArray()) {
            if (Character.isLetterOrDigit(ch)) {
                sb.append(Character.toUpperCase(ch));
            }
        }
        key = sb.toString();
        //<<
    }

    @Override
    public boolean equals(Object o) {
        //>> return super.equals(o); // TODO
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plate)) {
            return false;
        }
        return key.equals(((Plate) o).key);
        //<<
    }

    @Override
    public int hashCode() {
        //>> return super.hashCode(); // TODO
        return key.hashCode();
        //<<
    }

    @Override
    public String toString() {
        return text;
    }
}
`,
  },
  ca: [
    { ten: { en: 'the same plate written three ways', vi: 'cùng một biển viết ba cách' }, vao: 'ADD 29A-123.45 An\nADD 29a_12345 Binh\nHAS 29A12345\nOWNER 29a-123.45\nADD 30E-999.99 Chi\nHAS 30e99999\nHAS 29A-123.46\nSAME 29A-123.45 29a_123_45\n' },
    { ten: { en: 'different plates with the same letters reordered, null and String comparisons', vi: 'biển khác nhau có cùng chữ cái đảo thứ tự, so với null và String' }, vao: 'ADD 51F-100.00 X\nADD 51F-001.00 Y\nHAS 51f10000\nOWNER 51F00100\nSAME 51F-100.00 51F-001.00\nSAME a-b A_B\n', an: true },
  ],
  goiY: [
    { en: 'Compute the normal form once in the constructor (upper case, letters and digits only), then both methods use it.', vi: 'Tính dạng chuẩn một lần trong constructor (chữ hoa, chỉ chữ và số), rồi cả hai hàm dùng nó.' },
    { en: 'equals: same object → true; not a Plate (or null) → false; otherwise compare the normal forms. hashCode: the normal form’s hashCode.', vi: 'equals: cùng đối tượng → true; không phải Plate (hoặc null) → false; ngược lại so dạng chuẩn. hashCode: hashCode của dạng chuẩn.' },
  ],
  loiHayGap: [
    { en: 'Overriding equals but not hashCode — equal plates land in different buckets and HashSet keeps both.', vi: 'Ghi đè equals mà không ghi đè hashCode — các biển bằng nhau rơi vào ô khác nhau và HashSet giữ cả hai.' },
    { en: 'Hashing the original text while equals compares the normal form — equal objects with different hash codes.', vi: 'Băm chuỗi gốc trong khi equals so dạng chuẩn — hai đối tượng bằng nhau mà hashCode khác nhau.' },
  ],
  giaiThich: { en: '<p>HashSet first goes to the bucket of hashCode() and only then compares with equals(); if equal objects can have different hash codes, the search looks in the wrong bucket. Deriving both methods from the same normalised field guarantees the contract.</p>', vi: '<p>HashSet tới ô của hashCode() trước rồi mới so bằng equals(); nếu hai đối tượng bằng nhau có thể có hashCode khác nhau, phép tìm sẽ nhìn nhầm ô. Suy ra cả hai hàm từ cùng một trường đã chuẩn hoá bảo đảm hợp đồng.</p>' },
});

const de3 = deJava({
  id: 'csd201-7-2-rabin-karp',
  tieuDe: { en: 'Rabin–Karp: find every occurrence with a rolling hash', vi: 'Rabin–Karp: tìm mọi lần xuất hiện bằng băm cuộn' },
  doKho: 'HARD', phut: 35,
  khaiNiem: ['rolling hash: remove the first character, add the next', 'B^(m−1) precomputed', 'verify on equal hashes', 'O(n + m) expected'],
  moTa: {
    en: `<p>Complete ${c('static List<Integer> find(String text, String pat)')}: every index where ${c('pat')} occurs in ${c('text')} (overlaps allowed), in increasing order. Hash each window of length m with base B = 256 modulo a large prime (e.g. 1,000,000,007) and update it in O(1) when the window slides: remove ${c('text[i]·B^(m−1)')}, multiply by B, add ${c('text[i+m]')}. When the window’s hash equals the pattern’s, compare the characters to confirm.</p>
<p>The complexity check searches a pattern of 50,000 characters in a text of a million — the naive comparison at every position costs about 5·10¹⁰.</p>`,
    vi: `<p>Hoàn thiện ${c('static List<Integer> find(String text, String pat)')}: mọi chỉ số mà ${c('pat')} xuất hiện trong ${c('text')} (được chồng lấn), theo thứ tự tăng. Băm mỗi cửa sổ dài m với cơ số B = 256 modulo một số nguyên tố lớn (vd 1.000.000.007) và cập nhật O(1) khi cửa sổ trượt: bỏ ${c('text[i]·B^(m−1)')}, nhân B, cộng ${c('text[i+m]')}. Khi băm của cửa sổ bằng băm của mẫu thì so từng ký tự để xác nhận.</p>
<p>Kiểm độ phức tạp tìm một mẫu 50.000 ký tự trong văn bản một triệu ký tự — so ngây thơ ở mọi vị trí tốn khoảng 5·10¹⁰.</p>`,
  },
  yeuCau: { en: ['O(n + m) expected; no indexOf/regex (rule R1).', 'The pattern is not empty; a pattern longer than the text has no occurrence.'], vi: ['O(n + m) kỳ vọng; không indexOf/regex (luật R1).', 'Mẫu không rỗng; mẫu dài hơn văn bản thì không xuất hiện.'] },
  dauVao: { en: 'Lines "text | pattern"; PERF.', vi: 'Các dòng "văn bản | mẫu"; PERF.' },
  dauRa: { en: 'The positions.', vi: 'Các vị trí.' },
  main: 'KiemTra',
  quyTac: [{ id: 'R1', en: 'no indexOf / contains / regex / substring comparisons in RabinKarp', vi: 'không indexOf / contains / regex / so substring trong RabinKarp', re: String.raw`\.(indexOf|contains|matches|regionMatches|startsWith)\s*\(|\bPattern\b`, file: 'RabinKarp' }],
  hen: { n: 'a text of 1,000,000 characters, a pattern of 50,000', ms: 3000, can: 'O(n + m) expected', cham: 'O(n·m) (comparing at every position)' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    StringBuilder t = new StringBuilder();
                    for (int i = 0; i < 1000000; i++) {
                        t.append(i % 100000 == 99999 ? 'b' : 'a');
                    }
                    StringBuilder q = new StringBuilder();
                    for (int i = 0; i < 49999; i++) {
                        q.append('a');
                    }
                    q.append('b');
                    final String text = t.toString(), pat = q.toString();
                    final List<?>[] res = new List<?>[1];
                    r = Kiem.hen("n = 1,000,000, m = 50,000", 3000, new Runnable() {
                        public void run() {
                            res[0] = RabinKarp.find(text, pat);
                        }
                    }) + ", found " + (res[0] == null ? "-" : res[0].toString());
                } else {
                    int bar = line.indexOf('|');
                    r = RabinKarp.find(line.substring(0, bar).trim(), line.substring(bar + 1).trim()).toString();
                }`,
    }),
  },
  tep: {
    'RabinKarp.java': j`
import java.util.ArrayList;
import java.util.List;

public class RabinKarp {
    static final long MOD = 1_000_000_007L;
    static final long B = 256;

    static List<Integer> find(String text, String pat) {
        //>> return new ArrayList<>(); // TODO
        List<Integer> out = new ArrayList<>();
        int n = text.length(), m = pat.length();
        if (m > n) {
            return out;
        }
        long high = 1; // B^(m-1) mod MOD
        for (int i = 1; i < m; i++) {
            high = high * B % MOD;
        }
        long hp = 0, ht = 0;
        for (int i = 0; i < m; i++) {
            hp = (hp * B + pat.charAt(i)) % MOD;
            ht = (ht * B + text.charAt(i)) % MOD;
        }
        for (int i = 0; ; i++) {
            if (hp == ht && same(text, i, pat)) {
                out.add(i);
            }
            if (i + m >= n) {
                break;
            }
            ht = (ht - text.charAt(i) * high % MOD + MOD) % MOD; // remove the first character
            ht = (ht * B + text.charAt(i + m)) % MOD; // add the next one
        }
        return out;
        //<<
    }
    //>> // TODO: helper(s)

    private static boolean same(String t, int at, String p) {
        for (int k = 0; k < p.length(); k++) {
            if (t.charAt(at + k) != p.charAt(k)) {
                return false;
            }
        }
        return true;
    }
    //<<
}
`,
  },
  ca: [
    { ten: { en: 'overlapping matches, no match', vi: 'khớp chồng lấn, không khớp' }, vao: 'abracadabra | abra\naaaaa | aa\nhello world | xyz\nabc | abc\n' },
    { ten: { en: 'pattern longer than the text, one character', vi: 'mẫu dài hơn văn bản, một ký tự' }, vao: 'ab | abc\nbanana | a\nmississippi | issi\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'Keep every intermediate value in [0, MOD): after subtracting, add MOD before taking % again.', vi: 'Giữ mọi giá trị trung gian trong [0, MOD): sau phép trừ, cộng MOD rồi mới lấy % lần nữa.' },
    { en: 'Equal hashes do not prove equal strings — always confirm character by character.', vi: 'Băm bằng nhau chưa chứng minh chuỗi bằng nhau — luôn xác nhận từng ký tự.' },
  ],
  loiHayGap: [
    { en: 'Recomputing the hash of every window from scratch — O(m) per window, O(n·m) total.', vi: 'Tính lại băm mỗi cửa sổ từ đầu — O(m) mỗi cửa sổ, tổng O(n·m).' },
    { en: 'A negative hash after the subtraction — windows never match again.', vi: 'Băm âm sau phép trừ — các cửa sổ không bao giờ khớp nữa.' },
  ],
  giaiThich: { en: '<p>The rolling update makes each window’s hash O(1), so scanning is O(n); verifications happen only on real matches or (rare) collisions, giving O(n + m) expected. On the test text the pattern occurs ten times; the naive scan compares up to 50,000 characters at each of 950,000 positions.</p>', vi: '<p>Cập nhật cuộn làm băm của mỗi cửa sổ tốn O(1), nên lượt quét là O(n); việc xác nhận chỉ xảy ra khi khớp thật hoặc va chạm (hiếm), cho O(n + m) kỳ vọng. Trên văn bản thử, mẫu xuất hiện mười lần; bản ngây thơ so tới 50.000 ký tự ở mỗi trong 950.000 vị trí.</p>' },
});

export default moDun({ slug: 'csd201-ham-bam', ten: '7.2 Hash functions & the hashCode/equals contract', de: [de1, de2, de3] });
