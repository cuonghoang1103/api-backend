/** CSD201 · 8.4 — LZW & RLE: mã hoá LZW với từ điển đánh số từ (1) như slide (kiểm O(n)), giải mã LZW có ca đặc biệt KwKwK, RLE cho dòng ảnh đen trắng (độ dài loạt xen kẽ). */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-8-4-lzw-encode',
  tieuDe: { en: 'LZW encoding with the slides’ numbering (codes start at 1)', vi: 'Mã hoá LZW đánh số như slide (mã bắt đầu từ 1)' },
  doKho: 'MEDIUM', phut: 25, dangBai: 'pe',
  khaiNiem: ['the longest prefix P already in the dictionary', 'output code(P), add P + C', 'a HashMap dictionary for O(1) look-ups'],
  moTa: {
    en: `<p>Complete ${c('static String encode(String s, String alphabet)')}: the dictionary starts with the single characters of ${c('alphabet')} numbered 1, 2, 3, … (slide 35). Read C one by one: if ${c('P + C')} is in the dictionary, P = P + C; otherwise output ${c('code(P)')}, add ${c('P + C')} with the next free number, and P = C. At the end output ${c('code(P)')}. Return the codes separated by spaces: ${c('encode("ABBABABAC", "ABC")')} = ${c('"1 2 2 4 7 3"')}.</p>
<p>Use a ${c('HashMap<String, Integer>')}: the complexity check encodes 500,000 characters (a list searched linearly would be far too slow).</p>`,
    vi: `<p>Hoàn thiện ${c('static String encode(String s, String alphabet)')}: từ điển bắt đầu với các ký tự đơn của ${c('alphabet')} đánh số 1, 2, 3, … (slide 35). Đọc từng C: nếu ${c('P + C')} có trong từ điển thì P = P + C; ngược lại xuất ${c('code(P)')}, thêm ${c('P + C')} với số trống kế tiếp, và P = C. Cuối cùng xuất ${c('code(P)')}. Trả các mã cách nhau dấu cách: ${c('encode("ABBABABAC", "ABC")')} = ${c('"1 2 2 4 7 3"')}.</p>
<p>Dùng ${c('HashMap<String, Integer>')}: kiểm độ phức tạp mã hoá 500.000 ký tự (danh sách tìm tuần tự sẽ quá chậm).</p>`,
  },
  yeuCau: { en: ['Dictionary as a HashMap; never remove entries.', 'Empty input → empty output.'], vi: ['Từ điển là HashMap; không bao giờ xoá mục.', 'Đầu vào rỗng → đầu ra rỗng.'] },
  dauVao: { en: 'Lines "alphabet : text"; PERF.', vi: 'Các dòng "bảng chữ : văn bản"; PERF.' },
  dauRa: { en: 'The codes.', vi: 'Các mã.' },
  main: 'KiemTra',
  hen: { n: '500,000 characters', ms: 3000, can: 'O(n) expected (hash look-ups; strings stay short)', cham: 'a linear search in a list dictionary of up to n entries' },
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("PERF")) {
                    int[] v = Kiem.ngauNhien(500000, 4, 161);
                    StringBuilder sb = new StringBuilder();
                    for (int x : v) {
                        sb.append("ACGT".charAt(x));
                    }
                    final String s = sb.toString();
                    final String[] res = new String[1];
                    r = Kiem.hen("500,000 random DNA characters", 3000, new Runnable() {
                        public void run() {
                            res[0] = Lzw.encode(s, "ACGT");
                        }
                    });
                    if (res[0] != null) {
                        r += ", codes " + res[0].split(" ").length + ", hash " + res[0].hashCode();
                    }
                } else {
                    int colon = line.indexOf(':');
                    r = "[" + Lzw.encode(line.substring(colon + 1).trim(), line.substring(0, colon).trim()) + "]";
                }`,
    }),
  },
  tep: {
    'Lzw.java': j`
import java.util.HashMap;
import java.util.Map;

public class Lzw {

    static String encode(String s, String alphabet) {
        //>> return ""; // TODO
        Map<String, Integer> dict = new HashMap<>();
        for (int i = 0; i < alphabet.length(); i++) {
            dict.put(String.valueOf(alphabet.charAt(i)), i + 1);
        }
        StringBuilder out = new StringBuilder();
        String prefix = "";
        for (char ch : s.toCharArray()) {
            String pc = prefix + ch;
            if (dict.containsKey(pc)) {
                prefix = pc;
            } else {
                out.append(dict.get(prefix)).append(' ');
                dict.put(pc, dict.size() + 1); // the next free code
                prefix = String.valueOf(ch);
            }
        }
        if (!prefix.isEmpty()) {
            out.append(dict.get(prefix));
        }
        return out.toString().trim();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example and a run of one letter', vi: 'ví dụ của slide và một dãy cùng một chữ' }, vao: 'ABC : ABBABABAC\nA : AAAA\nAB : ABABABA\n' },
    { ten: { en: 'a text in which the dictionary grows fast, empty text', vi: 'văn bản làm từ điển lớn nhanh, văn bản rỗng' }, vao: 'ABRCD : ABRACADABRA\nab : abababababababab\nxy :\n', an: true },
    { ten: { en: 'complexity check', vi: 'kiểm độ phức tạp' }, vao: 'PERF\n', an: true },
  ],
  goiY: [
    { en: 'P grows while P + C is known; the moment it is not, P is the longest known prefix: output it and learn P + C.', vi: 'P lớn dần khi P + C đã biết; ngay khi không biết, P là tiền tố dài nhất đã biết: xuất nó và học P + C.' },
    { en: 'The next code is dict.size() + 1 because the numbering starts at 1.', vi: 'Mã kế tiếp là dict.size() + 1 vì đánh số bắt đầu từ 1.' },
  ],
  loiHayGap: [
    { en: 'Forgetting to output the last P after the loop — the end of the text is lost.', vi: 'Quên xuất P cuối cùng sau vòng lặp — mất phần cuối văn bản.' },
    { en: 'Numbering from 0 — every code is one less than the slides’.', vi: 'Đánh số từ 0 — mọi mã nhỏ hơn mã của slide một đơn vị.' },
  ],
  giaiThich: { en: '<p>LZW learns repeated substrings on the fly: each output code stands for a longer and longer string, and the decoder can rebuild the same dictionary from the codes alone, so no dictionary is transmitted. With a hash map each step is O(1) expected (strings stay short on random data), O(n) overall.</p>', vi: '<p>LZW học các chuỗi con lặp lại ngay khi đọc: mỗi mã xuất ra đại diện cho chuỗi ngày càng dài, và bộ giải mã dựng lại được đúng từ điển đó chỉ từ các mã, nên không cần gửi từ điển. Với bảng băm, mỗi bước O(1) kỳ vọng (chuỗi ngắn với dữ liệu ngẫu nhiên), tổng O(n).</p>' },
});

const de2 = deJava({
  id: 'csd201-8-4-lzw-decode',
  tieuDe: { en: 'LZW decoding — including the special case cW = the code being created', vi: 'Giải mã LZW — kể cả ca đặc biệt cW = mã đang được tạo' },
  doKho: 'HARD', phut: 30, dangBai: 'pe',
  khaiNiem: ['rebuilding the dictionary while decoding', 'add prev + first char of current', 'the KwKwK case: cur = prev + prev[0]'],
  moTa: {
    en: `<p>Complete ${c('static String decode(String codes, String alphabet)')} (codes separated by spaces, numbered from 1 as in the encoder). Output the string of the first code. Then for every next code cW, with prev = the string of the previous code: if cW is already in the dictionary, ${c('cur = dict[cW]')}; otherwise (it is the code being created right now — the "KwKwK" case) ${c('cur = prev + prev.charAt(0)')}. Output cur and add ${c('prev + cur.charAt(0)')} to the dictionary.</p>`,
    vi: `<p>Hoàn thiện ${c('static String decode(String codes, String alphabet)')} (các mã cách nhau dấu cách, đánh số từ 1 như bộ mã hoá). Xuất chuỗi của mã đầu tiên. Rồi với mỗi mã kế tiếp cW, gọi prev là chuỗi của mã trước: nếu cW đã có trong từ điển thì ${c('cur = dict[cW]')}; ngược lại (đó là mã đang được tạo ngay lúc này — ca "KwKwK") ${c('cur = prev + prev.charAt(0)')}. Xuất cur và thêm ${c('prev + cur.charAt(0)')} vào từ điển.</p>`,
  },
  yeuCau: { en: ['A list dictionary indexed by code (index 0 unused).', 'Empty input → empty output.'], vi: ['Từ điển dạng danh sách theo chỉ số mã (bỏ trống ô 0).', 'Đầu vào rỗng → đầu ra rỗng.'] },
  dauVao: { en: 'Lines "alphabet : codes".', vi: 'Các dòng "bảng chữ : các mã".' },
  dauRa: { en: 'The decoded text.', vi: 'Văn bản đã giải mã.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                int colon = line.indexOf(':');
                r = "[" + LzwDecode.decode(line.substring(colon + 1).trim(), line.substring(0, colon).trim()) + "]";`,
    }),
  },
  tep: {
    'LzwDecode.java': j`
import java.util.ArrayList;
import java.util.List;

public class LzwDecode {

    static String decode(String codes, String alphabet) {
        //>> return ""; // TODO
        if (codes.trim().isEmpty()) {
            return "";
        }
        List<String> dict = new ArrayList<>();
        dict.add(null); // code 0 is not used
        for (char ch : alphabet.toCharArray()) {
            dict.add(String.valueOf(ch));
        }
        String[] w = codes.trim().split("\\s+");
        int cW = Integer.parseInt(w[0]);
        StringBuilder out = new StringBuilder(dict.get(cW));
        for (int k = 1; k < w.length; k++) {
            String prev = dict.get(cW);
            cW = Integer.parseInt(w[k]);
            String cur = cW < dict.size() ? dict.get(cW) : prev + prev.charAt(0); // KwKwK: not in the dictionary yet
            dict.add(prev + cur.charAt(0));
            out.append(cur);
        }
        return out.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example and the special case', vi: 'ví dụ của slide và ca đặc biệt' }, vao: 'ABC : 1 2 2 4 7 3\nA : 1 2 1\nAB : 1 2 3 5\n' },
    { ten: { en: 'only the first codes, long special cases, empty', vi: 'chỉ vài mã đầu, ca đặc biệt dài, rỗng' }, vao: 'ABC : 1 2 2 4 7\nab : 1 2 3 5 4 7\nA : 1 2 3 4\nxy :\n', an: true },
  ],
  goiY: [
    { en: 'The decoder is always one step behind the encoder: it learns prev + cur[0] only once it knows cur.', vi: 'Bộ giải mã luôn chậm hơn bộ mã hoá một bước: nó chỉ học prev + cur[0] khi đã biết cur.' },
    { en: 'If cW is not in the list yet, it must be exactly that pending entry, which starts with prev and ends with prev[0].', vi: 'Nếu cW chưa có trong danh sách, nó phải đúng là mục đang chờ đó, bắt đầu bằng prev và kết thúc bằng prev[0].' },
  ],
  loiHayGap: [
    { en: 'dict.get(cW) without the special case — IndexOutOfBoundsException on "1 2 1" with alphabet "A".', vi: 'dict.get(cW) mà không có ca đặc biệt — IndexOutOfBoundsException với "1 2 1" và bảng chữ "A".' },
    { en: 'Adding prev + cur (the whole cur) instead of prev + cur[0].', vi: 'Thêm prev + cur (cả cur) thay vì prev + cur[0].' },
  ],
  giaiThich: { en: '<p>The encoder adds P + C right after outputting P, so the decoder can rebuild the entry only after reading the next code. When the encoder immediately reuses the entry it has just created (a pattern like KwKwK), the decoder meets a code it has not added yet — and it can only be prev + prev[0].</p>', vi: '<p>Bộ mã hoá thêm P + C ngay sau khi xuất P, nên bộ giải mã chỉ dựng lại được mục đó sau khi đọc mã kế tiếp. Khi bộ mã hoá dùng ngay mục vừa tạo (mẫu dạng KwKwK), bộ giải mã gặp một mã nó chưa kịp thêm — và mã đó chỉ có thể là prev + prev[0].</p>' },
});

const de3 = deJava({
  id: 'csd201-8-4-bitmap-rle',
  tieuDe: { en: 'RLE for black-and-white images: alternating run lengths', vi: 'RLE cho ảnh đen trắng: độ dài loạt xen kẽ' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['only two symbols ⇒ store lengths only', 'runs alternate white / black, starting with white', 'a first run of length 0'],
  moTa: {
    en: `<p>A row of a black-and-white image is a string of ${c("'0'")} (white) and ${c("'1'")} (black). Fax machines store only the run lengths, alternating white, black, white, … and always <b>starting with white</b> (a row that starts with black begins with a white run of length 0). Complete ${c('static String encode(String row)')} (${c('"0001100"')} → ${c('"3 2 2"')}, ${c('"1100"')} → ${c('"0 2 2"')}) and ${c('static String decode(String runs)')}.</p>`,
    vi: `<p>Một dòng của ảnh đen trắng là chuỗi ${c("'0'")} (trắng) và ${c("'1'")} (đen). Máy fax chỉ lưu độ dài các loạt, xen kẽ trắng, đen, trắng, … và luôn <b>bắt đầu bằng trắng</b> (dòng bắt đầu bằng đen thì có loạt trắng dài 0 ở đầu). Hoàn thiện ${c('static String encode(String row)')} (${c('"0001100"')} → ${c('"3 2 2"')}, ${c('"1100"')} → ${c('"0 2 2"')}) và ${c('static String decode(String runs)')}.</p>`,
  },
  yeuCau: { en: ['Lengths separated by single spaces.', 'An empty row encodes to "0".'], vi: ['Các độ dài cách nhau một dấu cách.', 'Dòng rỗng mã hoá thành "0".'] },
  dauVao: { en: 'ENC row · DEC runs.', vi: 'ENC dòng · DEC các độ dài.' },
  dauRa: { en: 'The runs / the row.', vi: 'Các độ dài / dòng.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                if (p[0].equals("ENC")) {
                    String row = p.length > 1 ? p[1] : "";
                    String enc = Bitmap.encode(row);
                    r = enc + " | back " + Bitmap.decode(enc).equals(row);
                } else {
                    r = Bitmap.decode(line.substring(3).trim());
                }`,
    }),
  },
  tep: {
    'Bitmap.java': j`
public class Bitmap {

    static String encode(String row) {
        //>> return ""; // TODO
        StringBuilder out = new StringBuilder();
        char colour = '0'; // runs start with white
        int i = 0;
        do {
            int j = i;
            while (j < row.length() && row.charAt(j) == colour) {
                j++;
            }
            out.append(out.length() > 0 ? " " : "").append(j - i);
            i = j;
            colour = colour == '0' ? '1' : '0';
        } while (i < row.length());
        return out.toString();
        //<<
    }

    static String decode(String runs) {
        //>> return ""; // TODO
        StringBuilder out = new StringBuilder();
        char colour = '0';
        for (String r : runs.trim().split("\\s+")) {
            int n = Integer.parseInt(r);
            for (int k = 0; k < n; k++) {
                out.append(colour);
            }
            colour = colour == '0' ? '1' : '0';
        }
        return out.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'rows starting with white and with black', vi: 'dòng bắt đầu bằng trắng và bằng đen' }, vao: 'ENC 0001100\nENC 1100\nENC 0000\nDEC 3 2 2\nDEC 0 1 1 1\n' },
    { ten: { en: 'all black, alternating pixels, empty row', vi: 'toàn đen, điểm ảnh xen kẽ, dòng rỗng' }, vao: 'ENC 1111\nENC 01010101\nENC\nDEC 0\nDEC 0 3\n', an: true },
  ],
  goiY: [
    { en: 'Track the colour of the current run, starting with white; a run may have length 0 only at the very beginning.', vi: 'Theo dõi màu của loạt hiện tại, bắt đầu từ trắng; loạt chỉ có thể dài 0 ở ngay đầu.' },
    { en: 'Decoding: alternate the colour after every length, whatever the length.', vi: 'Giải mã: đổi màu sau mỗi độ dài, dù độ dài bằng bao nhiêu.' },
  ],
  loiHayGap: [
    { en: 'Starting with the colour of the first pixel — the decoder cannot know it.', vi: 'Bắt đầu bằng màu của điểm ảnh đầu — bộ giải mã không thể biết điều đó.' },
    { en: 'Writing the character as in text RLE ("3 0 2 1 …") — twice as long as needed for two colours.', vi: 'Ghi cả ký tự như RLE văn bản ("3 0 2 1 …") — dài gấp đôi mức cần với hai màu.' },
  ],
  giaiThich: { en: '<p>With only two symbols and an agreed starting colour, the symbol of each run is implied by its position, so only lengths are stored — the idea behind fax (CCITT Group 3) compression, which then Huffman-codes the lengths.</p>', vi: '<p>Chỉ có hai ký hiệu và màu bắt đầu đã thoả thuận, nên ký hiệu của mỗi loạt suy ra từ vị trí của nó, chỉ cần lưu độ dài — ý tưởng nén của máy fax (CCITT Group 3), sau đó còn mã Huffman các độ dài.</p>' },
});

export default moDun({ slug: 'csd201-lzw-rle', ten: '8.4 LZW & RLE, encoded and decoded', de: [de1, de2, de3] });
