/** CSD201 · 8.1 — Nén văn bản: RLE mã hoá/giải mã (số lần ≥ 10) + tỉ lệ nén, đóng gói DNA 2 bit/base, kiểm mã tiền tố và giải mã bằng bảng mã. */
import { moDun, deJava, c, j } from './_chung.mjs';
import { lopKiem } from './_ds.mjs';

const de1 = deJava({
  id: 'csd201-8-1-rle',
  tieuDe: { en: 'RLE: encode, decode, and the compression rate of the slides', vi: 'RLE: mã hoá, giải mã, và tỉ lệ nén như slide' },
  doKho: 'EASY', phut: 20, dangBai: 'pe',
  khaiNiem: ['runs of equal characters', 'counts of several digits', 'compression rate = (original − compressed) / original'],
  moTa: {
    en: `<p>Complete in ${c('Rle')} (texts are letters only, no digits):</p>
<ul><li>${c('static String encode(String s)')} — every run written as its length then the character: ${c('"FFFFOOOOFFF"')} → ${c('"4F4O3F"')};</li>
<li>${c('static String decode(String s)')} — the inverse; a count can have several digits (${c('"12W1B"')});</li>
<li>${c('static int rate(String s)')} — the compression rate in whole percent, ${c('(len(s) − len(encode(s))) · 100 / len(s)')} (integer division; it can be negative when RLE makes the text longer).</li></ul>`,
    vi: `<p>Hoàn thiện trong ${c('Rle')} (văn bản chỉ có chữ cái, không có chữ số): ${c('encode(s)')} — mỗi loạt viết là độ dài rồi ký tự: ${c('"FFFFOOOOFFF"')} → ${c('"4F4O3F"')}; ${c('decode(s)')} — phép ngược, số lần có thể nhiều chữ số (${c('"12W1B"')}); ${c('rate(s)')} — tỉ lệ nén tính bằng phần trăm nguyên, ${c('(len(s) − len(encode(s))) · 100 / len(s)')} (chia nguyên; có thể âm khi RLE làm văn bản dài ra).</p>`,
  },
  yeuCau: { en: ['One pass each way, StringBuilder.', 'Empty text: empty code, rate 0.'], vi: ['Mỗi chiều một lượt, dùng StringBuilder.', 'Văn bản rỗng: mã rỗng, tỉ lệ 0.'] },
  dauVao: { en: 'ENC text · DEC code (one per line).', vi: 'ENC văn bản · DEC mã (mỗi dòng một lệnh).' },
  dauRa: { en: 'Encoded text and rate / decoded text.', vi: 'Văn bản đã mã hoá và tỉ lệ / văn bản đã giải mã.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                String arg = p.length > 1 ? p[1] : "";
                if (p[0].equals("ENC")) {
                    r = Rle.encode(arg) + " rate " + Rle.rate(arg) + "% round-trip " + Rle.decode(Rle.encode(arg)).equals(arg);
                } else {
                    r = Rle.decode(arg);
                }`,
    }),
  },
  tep: {
    'Rle.java': j`
public class Rle {

    static String encode(String s) {
        //>> return s; // TODO
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (j < s.length() && s.charAt(j) == s.charAt(i)) {
                j++;
            }
            out.append(j - i).append(s.charAt(i)); // s[i..j-1] is one run
            i = j;
        }
        return out.toString();
        //<<
    }

    static String decode(String s) {
        //>> return s; // TODO
        StringBuilder out = new StringBuilder();
        int count = 0;
        for (char ch : s.toCharArray()) {
            if (Character.isDigit(ch)) {
                count = count * 10 + (ch - '0');
            } else {
                for (int k = 0; k < count; k++) {
                    out.append(ch);
                }
                count = 0;
            }
        }
        return out.toString();
        //<<
    }

    static int rate(String s) {
        //>> return 0; // TODO
        return s.isEmpty() ? 0 : (s.length() - encode(s).length()) * 100 / s.length();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'the slides’ example, counts above 9', vi: 'ví dụ của slide, số lần lớn hơn 9' }, vao: 'ENC FFFFOOOOFFFOOFFFFFOOOOOOO\nENC WWWWWWWWWWWWBWWWWWWWWWWWWBBB\nDEC 12W1B\nENC ABCD\n' },
    { ten: { en: 'one character, long runs, decoding', vi: 'một ký tự, loạt dài, giải mã' }, vao: 'ENC Z\nENC aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\nDEC 3a10b1c\nDEC 1x\n', an: true },
  ],
  goiY: [
    { en: 'Encode: find the end j of the run starting at i (s[j] != s[i]), append (j − i) and the character, continue from j.', vi: 'Mã hoá: tìm điểm cuối j của loạt bắt đầu ở i (s[j] != s[i]), nối (j − i) và ký tự, tiếp tục từ j.' },
    { en: 'Decode: accumulate digits into count = count·10 + digit; a letter flushes count copies of it.', vi: 'Giải mã: dồn chữ số vào count = count·10 + chữ số; gặp chữ cái thì xuất count bản của nó.' },
  ],
  loiHayGap: [
    { en: 'Decoding only one digit per count — "12W" becomes 1 × "2W"…', vi: 'Giải mã chỉ một chữ số cho mỗi số lần — "12W" thành 1 × "2W"…' },
    { en: 'Forgetting the last run (the loop ends without writing it).', vi: 'Quên loạt cuối (vòng lặp kết thúc mà chưa ghi nó).' },
  ],
  giaiThich: { en: '<p>RLE replaces a run of length L by about log₁₀ L + 1 characters: excellent for long runs (images, the slides’ FFFFOOOO…), harmful for text without runs (ABCD doubles). Both directions are O(n).</p>', vi: '<p>RLE thay một loạt dài L bằng khoảng log₁₀ L + 1 ký tự: rất tốt với loạt dài (ảnh, FFFFOOOO… của slide), có hại với văn bản không có loạt (ABCD dài gấp đôi). Cả hai chiều đều O(n).</p>' },
});

const de2 = deJava({
  id: 'csd201-8-1-dna-two-bits',
  tieuDe: { en: 'DNA in 2 bits per base: pack four bases into one byte', vi: 'DNA 2 bit mỗi base: gói bốn base vào một byte' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['fixed-length codes', 'bit shifting and masking', 'compression by a smaller alphabet'],
  moTa: {
    en: `<p>A DNA string uses only ${c('A C G T')}; 2 bits are enough per base: A=00, C=01, G=10, T=11. Complete in ${c('Dna')}:</p>
<ul><li>${c('static byte[] pack(String dna)')} — base i goes into byte ${c('i / 4')}, at bits ${c('7−2·(i%4)')} and ${c('6−2·(i%4)')} (the first base in the two highest bits); a last incomplete byte is padded with 0 bits;</li>
<li>${c('static String unpack(byte[] b, int n)')} — the first n bases back.</li></ul>
<p>The grader prints the bytes in hexadecimal: ${c('"ACGT"')} → ${c('1B')} (00 01 10 11).</p>`,
    vi: `<p>Chuỗi DNA chỉ dùng ${c('A C G T')}; mỗi base cần 2 bit: A=00, C=01, G=10, T=11. Hoàn thiện trong ${c('Dna')}: ${c('pack(dna)')} — base i vào byte ${c('i / 4')}, ở các bit ${c('7−2·(i%4)')} và ${c('6−2·(i%4)')} (base đầu ở hai bit cao nhất), byte cuối chưa đủ thì đệm bit 0; ${c('unpack(b, n)')} — trả lại n base đầu.</p>
<p>Máy chấm in các byte dạng hexa: ${c('"ACGT"')} → ${c('1B')} (00 01 10 11).</p>`,
  },
  yeuCau: { en: ['⌈n/4⌉ bytes.', 'Bit operations, no strings of "0"/"1".'], vi: ['⌈n/4⌉ byte.', 'Dùng phép toán bit, không dùng chuỗi "0"/"1".'] },
  dauVao: { en: 'One DNA string per line.', vi: 'Mỗi dòng một chuỗi DNA.' },
  dauRa: { en: 'The bytes in hex and the round trip.', vi: 'Các byte dạng hexa và kiểm khứ hồi.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      lenh: `                byte[] b = Dna.pack(line);
                StringBuilder hex = new StringBuilder();
                for (byte x : b) {
                    hex.append(String.format("%02X ", x & 0xFF));
                }
                r = b.length + " byte(s): " + hex.toString().trim() + " | back " + Dna.unpack(b, line.length());`,
    }),
  },
  tep: {
    'Dna.java': j`
public class Dna {
    private static final String BASES = "ACGT";

    static byte[] pack(String dna) {
        //>> return new byte[0]; // TODO
        byte[] b = new byte[(dna.length() + 3) / 4];
        for (int i = 0; i < dna.length(); i++) {
            int code = BASES.indexOf(dna.charAt(i)); // 0..3
            b[i / 4] |= (byte) (code << (6 - 2 * (i % 4)));
        }
        return b;
        //<<
    }

    static String unpack(byte[] b, int n) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            int code = (b[i / 4] >> (6 - 2 * (i % 4))) & 3;
            sb.append(BASES.charAt(code));
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'ACGT, one base, a full byte of T', vi: 'ACGT, một base, một byte toàn T' }, vao: 'ACGT\nA\nTTTT\nGATTACA\n' },
    { ten: { en: 'lengths 5–9 (padding)', vi: 'độ dài 5–9 (đệm)' }, vao: 'CCCCC\nGGGGGGGGG\nACGTACGTA\nTGCA\n', an: true },
  ],
  goiY: [
    { en: 'pack: b[i / 4] |= code << (6 − 2·(i % 4)). unpack: (b[i / 4] >> (6 − 2·(i % 4))) & 3.', vi: 'pack: b[i / 4] |= code << (6 − 2·(i % 4)). unpack: (b[i / 4] >> (6 − 2·(i % 4))) & 3.' },
    { en: 'A Java byte is signed: & 3 after the shift removes the copied sign bits.', vi: 'byte của Java có dấu: & 3 sau phép dịch xoá các bit dấu bị sao chép.' },
  ],
  loiHayGap: [
    { en: 'Forgetting & 3 — "T" bytes are negative and the shift brings 1s from the sign.', vi: 'Quên & 3 — byte chứa "T" là số âm và phép dịch kéo theo các bit 1 của dấu.' },
    { en: 'Allocating dna.length() / 4 bytes — the last 1–3 bases are lost.', vi: 'Cấp dna.length() / 4 byte — mất 1–3 base cuối.' },
  ],
  giaiThich: { en: '<p>An alphabet of 4 symbols needs log₂ 4 = 2 bits, not the 8 bits of a char: a fixed-length code 4× smaller. Huffman (8.3) goes further when the symbols have different frequencies; with equal frequencies, 2 bits is already optimal (entropy 2).</p>', vi: '<p>Bảng chữ 4 ký hiệu chỉ cần log₂ 4 = 2 bit, không phải 8 bit của char: mã độ dài cố định nhỏ hơn 4 lần. Huffman (8.3) đi xa hơn khi tần suất các ký hiệu khác nhau; với tần suất bằng nhau, 2 bit đã là tối ưu (entropy 2).</p>' },
});

const de3 = deJava({
  id: 'csd201-8-1-prefix-code',
  tieuDe: { en: 'Is it a prefix code? Then decode a bit string with it', vi: 'Có phải mã tiền tố không? Nếu có, giải mã một dãy bit' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['prefix-free (no codeword is a prefix of another)', 'decoding without separators', 'a binary trie of codewords'],
  moTa: {
    en: `<p>A code table maps characters to bit strings. Complete in ${c('Prefix')}:</p>
<ul><li>${c('static boolean isPrefixFree(Map<Character, String> code)')} — no codeword is a prefix of another (and no two are equal);</li>
<li>${c('static String decode(Map<Character, String> code, String bits)')} — read the bits left to right and output a character as soon as the bits read form a codeword; if the bits end in the middle of a codeword or match nothing, return ${c('"ERROR"')}.</li></ul>
<p>Build a small binary trie from the codewords (or check prefixes directly) — only prefix codes can be decoded this way without separators.</p>`,
    vi: `<p>Bảng mã ánh xạ ký tự sang dãy bit. Hoàn thiện trong ${c('Prefix')}: ${c('isPrefixFree(code)')} — không từ mã nào là tiền tố của từ mã khác (và không có hai từ mã giống nhau); ${c('decode(code, bits)')} — đọc bit từ trái sang phải, xuất một ký tự ngay khi các bit đã đọc tạo thành một từ mã; dãy bit dừng giữa chừng một từ mã hoặc không khớp gì thì trả ${c('"ERROR"')}.</p>
<p>Dựng một trie nhị phân nhỏ từ các từ mã (hoặc kiểm tiền tố trực tiếp) — chỉ mã tiền tố mới giải mã được kiểu này mà không cần dấu ngăn cách.</p>`,
  },
  yeuCau: { en: ['decode is only called with prefix-free codes.', 'O(total length).'], vi: ['decode chỉ được gọi với mã tiền tố.', 'O(tổng độ dài).'] },
  dauVao: { en: '"CODE a=0 b=10 c=11", then "CHECK" / "DEC bits".', vi: '"CODE a=0 b=10 c=11", rồi "CHECK" / "DEC bits".' },
  dauRa: { en: 'Answers.', vi: 'Câu trả lời.' },
  main: 'KiemTra',
  harness: {
    'KiemTra.java': lopKiem({
      truoc: '        Map<Character, String> code = new LinkedHashMap<>();',
      lenh: `                if (p[0].equals("CODE")) {
                    code = new LinkedHashMap<>();
                    for (int i = 1; i < p.length; i++) {
                        code.put(p[i].charAt(0), p[i].substring(2));
                    }
                    r = code.toString();
                } else if (p[0].equals("CHECK")) {
                    r = String.valueOf(Prefix.isPrefixFree(code));
                } else {
                    r = Prefix.decode(code, p.length > 1 ? p[1] : "");
                }`,
    }),
  },
  tep: {
    'Prefix.java': j`
import java.util.HashMap;
import java.util.Map;

public class Prefix {

    static boolean isPrefixFree(Map<Character, String> code) {
        //>> return false; // TODO
        for (Map.Entry<Character, String> a : code.entrySet()) {
            for (Map.Entry<Character, String> b : code.entrySet()) {
                if (a.getKey() != b.getKey() && b.getValue().startsWith(a.getValue())) {
                    return false; // a's word is a prefix of b's (or equal)
                }
            }
        }
        return true;
        //<<
    }

    static String decode(Map<Character, String> code, String bits) {
        //>> return "ERROR"; // TODO
        Map<String, Character> back = new HashMap<>();
        int longest = 0;
        for (Map.Entry<Character, String> e : code.entrySet()) {
            back.put(e.getValue(), e.getKey());
            longest = Math.max(longest, e.getValue().length());
        }
        StringBuilder out = new StringBuilder();
        StringBuilder cur = new StringBuilder();
        for (char b : bits.toCharArray()) {
            cur.append(b);
            Character ch = back.get(cur.toString());
            if (ch != null) {
                out.append(ch);
                cur.setLength(0);
            } else if (cur.length() >= longest) {
                return "ERROR"; // matches nothing
            }
        }
        return cur.length() == 0 ? out.toString() : "ERROR";
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a prefix code and decoding', vi: 'một mã tiền tố và giải mã' }, vao: 'CODE a=0 b=10 c=110 d=111\nCHECK\nDEC 0101100111\nDEC 0\nDEC 11\nCODE a=0 b=01 c=11\nCHECK\n' },
    { ten: { en: 'equal codewords, an unused pattern, empty input', vi: 'từ mã trùng nhau, mẫu bit không dùng, đầu vào rỗng' }, vao: 'CODE x=1 y=1\nCHECK\nCODE a=00 b=01 c=10\nCHECK\nDEC 0010\nDEC 11\nDEC\n', an: true },
  ],
  goiY: [
    { en: 'Prefix-free: for every pair of different symbols, the second codeword must not start with the first.', vi: 'Tiền tố: với mọi cặp ký hiệu khác nhau, từ mã thứ hai không được bắt đầu bằng từ mã thứ nhất.' },
    { en: 'Decode greedily: because no codeword is a prefix of another, the first match is the only possible one.', vi: 'Giải mã tham lam: vì không từ mã nào là tiền tố của từ khác, lần khớp đầu tiên là lần khớp duy nhất có thể.' },
  ],
  loiHayGap: [
    { en: 'Accepting a code like a=0, b=01 — "01" can be read as "a then something" or "b": not uniquely decodable.', vi: 'Chấp nhận mã như a=0, b=01 — "01" đọc được là "a rồi gì đó" hoặc "b": không giải mã duy nhất được.' },
    { en: 'Ignoring leftover bits at the end — a truncated message is reported as valid.', vi: 'Bỏ qua các bit thừa ở cuối — thông điệp bị cắt cụt lại được coi là hợp lệ.' },
  ],
  giaiThich: { en: '<p>In a prefix code every codeword ends at a leaf of the code trie, so reading bits from the root and restarting at each leaf decodes uniquely and greedily. Huffman codes are prefix codes by construction (symbols only at leaves).</p>', vi: '<p>Trong mã tiền tố, mọi từ mã kết thúc ở một lá của trie mã, nên đọc bit từ gốc và quay lại gốc ở mỗi lá cho cách giải mã duy nhất và tham lam. Mã Huffman là mã tiền tố theo cách dựng (ký hiệu chỉ nằm ở lá).</p>' },
});

export default moDun({ slug: 'csd201-nen-van-ban', ten: '8.1 Compression: Huffman, LZW, RLE', de: [de1, de2, de3] });
