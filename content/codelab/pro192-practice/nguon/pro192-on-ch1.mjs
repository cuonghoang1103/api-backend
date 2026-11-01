/** PRO192 · 1.H 🧪 — chuỗi, mảng, sắp xếp: câu 4 PE (IString, IUtilities, IFile, PE1) và nhập liệu LAB211 (gen/java/on-ch1). */
import { moDun, deJava, c, j, LOI_CHUNG } from './_chung.mjs';

/** Harness kiểu đề PE: đọc "TC + chuỗi" lặp tới hết input, in OUTPUT như Main đề cho. */
const peMain = (iface, impl, f1, f2, kieu2 = 'String') => j`
import java.util.Scanner;

// GIVEN by the paper (like the PE harness) — do not change.
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ${iface} t = new ${impl}();
        while (sc.hasNextLine()) {
            System.out.println("1. Test ${f1}()");
            System.out.println("2. Test ${f2}()");
            System.out.print("Enter TC (1 or 2): ");
            int tc = Integer.parseInt(sc.nextLine().trim());
            System.out.print("Enter a ${kieu2 === 'int' ? 'value' : 'string'}: ");
            String s = sc.nextLine();
            System.out.println();
            System.out.println("OUTPUT:");
            System.out.println(tc == 1 ? String.valueOf(t.${f1}(s)) : String.valueOf(t.${f2}(${kieu2 === 'int' ? 'Integer.parseInt(s.trim())' : 's'})));
        }
    }
}
`;
const PE_YC = {
  en: ['Do not change the given interface or <code>Main.java</code> — like the exam, they are the paper’s files.', 'Never print inside your methods: Main prints what they <b>return</b>.', 'Your class is in the default package, file name = class name.'],
  vi: ['Không sửa interface và <code>Main.java</code> đề cho — như phòng thi, đó là tệp của đề.', 'Không in gì trong các phương thức: Main in giá trị chúng <b>trả về</b>.', 'Lớp của bạn ở default package, tên tệp = tên lớp.'],
};
const PE_VAO = { en: 'Pairs of lines: a test case number (1 or 2) and the argument.', vi: 'Từng cặp dòng: số ca thử (1 hoặc 2) và đối số.' };
const PE_RA = { en: 'For each pair: the menu, the prompts, "OUTPUT:" and the returned value.', vi: 'Mỗi cặp: menu, lời nhắc, "OUTPUT:" và giá trị trả về.' };

const de1 = deJava({
  id: 'pro192-on-ch1-istring',
  tieuDe: { en: 'PE question 4: IString — f1 counts, f2 builds', vi: 'Câu 4 PE: IString — f1 đếm, f2 dựng chuỗi' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['implements', 'split("\\\\s+")', 'Character', 'StringBuilder.reverse'],
  moTa: {
    en: `<p>The shape of question 4 on most PRO192 PE papers. The interface ${c('IString')} and ${c('Main')} are given. Write ${c('MyString implements IString')}:</p>
<ul><li>${c('int f1(String str)')} — the number of words that contain at least one upper-case letter <b>and</b> at least one digit.</li>
<li>${c('String f2(String str)')} — every word reversed, word order kept, exactly one space between words, no space at either end.</li></ul>
<p>A word is a run of non-space characters; words may be separated by several spaces. A blank string gives ${c('0')} and ${c('""')}.</p>`,
    vi: `<p>Dạng câu 4 của phần lớn đề PE PRO192. Interface ${c('IString')} và ${c('Main')} cho sẵn. Viết ${c('MyString implements IString')}:</p>
<ul><li>${c('int f1(String str)')} — số từ chứa ít nhất một chữ hoa <b>và</b> ít nhất một chữ số.</li>
<li>${c('String f2(String str)')} — đảo từng từ, giữ thứ tự từ, giữa các từ đúng một dấu cách, không dư dấu cách hai đầu.</li></ul>
<p>Từ là một dãy ký tự không phải dấu cách; giữa các từ có thể có nhiều dấu cách. Chuỗi trống cho ${c('0')} và ${c('""')}.</p>`,
  },
  yeuCau: PE_YC, dauVao: PE_VAO, dauRa: PE_RA,
  main: 'Main',
  tep: {
    'IString.java': j`
// GIVEN by the paper — do not change.
public interface IString {
    int f1(String str);

    String f2(String str);
}
`,
    'Main.java': peMain('IString', 'MyString', 'f1', 'f2'),
    'MyString.java': j`
public class MyString implements IString {
    // f1: words with at least one upper-case letter AND at least one digit
    @Override
    public int f1(String str) {
        //>> return 0; // TODO
        if (str == null || str.trim().isEmpty()) {
            return 0;
        }
        int count = 0;
        for (String w : str.trim().split("\\s+")) {
            boolean upper = false, digit = false;
            for (char ch : w.toCharArray()) {
                if (Character.isUpperCase(ch)) {
                    upper = true;
                }
                if (Character.isDigit(ch)) {
                    digit = true;
                }
            }
            if (upper && digit) {
                count++;
            }
        }
        return count;
        //<<
    }

    // f2: reverse every word, keep the word order, one space between words
    @Override
    public String f2(String str) {
        //>> return str; // TODO
        if (str == null || str.trim().isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (String w : str.trim().split("\\s+")) {
            if (sb.length() > 0) {
                sb.append(' ');
            }
            sb.append(new StringBuilder(w).reverse());
        }
        return sb.toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'f1 on a mixed sentence', vi: 'f1 trên câu lẫn lộn' }, vao: '1\nPRO192 is Java8 and se1801 or SE1801\n' },
    { ten: { en: 'f2 with repeated spaces', vi: 'f2 với nhiều dấu cách' }, vao: '2\n  Hello   Java 8  world \n' },
    { ten: { en: 'blank strings', vi: 'chuỗi trống' }, vao: '1\n   \n2\n\n', an: true },
    { ten: { en: 'digit without upper case, upper without digit', vi: 'có số không có hoa, có hoa không có số' }, vao: '1\nabc123 ABC A1 a1B 9z\n2\nOne\n', an: true },
  ],
  goiY: [
    { en: 'str.trim().split("\\\\s+") survives leading, trailing and repeated spaces — split(" ") gives empty "words".', vi: 'str.trim().split("\\\\s+") chịu được dấu cách đầu, cuối và lặp — split(" ") sinh ra các "từ" rỗng.' },
    { en: 'f1: two boolean flags per word, one pass over its characters. f2: new StringBuilder(w).reverse(), and add the space BEFORE every word except the first.', vi: 'f1: hai cờ boolean cho mỗi từ, một lượt duyệt ký tự. f2: new StringBuilder(w).reverse(), thêm dấu cách TRƯỚC mỗi từ trừ từ đầu.' },
  ],
  loiHayGap: [
    { en: 'Blank input: "   ".split("\\\\s+") returns [""] — one empty word — unless you trim and check isEmpty() first.', vi: 'Chuỗi trống: "   ".split("\\\\s+") trả [""] — một từ rỗng — nếu không trim và kiểm isEmpty() trước.' },
    { en: 'Reversing the whole sentence instead of each word: "world 8 Java Hello" read backwards.', vi: 'Đảo cả câu thay vì từng từ: ra "dlrow 8 avaJ olleH".' },
    LOI_CHUNG.inThem,
  ],
  giaiThich: { en: '<p>Both methods start with the same guard (null or blank) and the same tokenisation <code>trim().split("\\\\s+")</code>. f1 checks two independent conditions with two flags; f2 builds the result in one StringBuilder with the separator added before every word but the first.</p>', vi: '<p>Hai phương thức mở đầu bằng cùng một phép chặn (null hoặc trống) và cùng cách tách <code>trim().split("\\\\s+")</code>. f1 kiểm hai điều kiện độc lập bằng hai cờ; f2 dựng kết quả trong một StringBuilder, dấu cách thêm trước mọi từ trừ từ đầu.</p>' },
});

const de2 = deJava({
  id: 'pro192-on-ch1-iutilities',
  tieuDe: { en: 'PE question 4: longest word and average of even digits', vi: 'Câu 4 PE: từ dài nhất và trung bình các chữ số chẵn' },
  doKho: 'MEDIUM', phut: 15,
  khaiNiem: ['String.split', 'char arithmetic', 'NaN', 'String.format'],
  moTa: {
    en: `<p>PE8 question 4 type. ${c('IUtilities')} and ${c('Main')} are given; write ${c('Utilities implements IUtilities')}:</p>
<ul><li>${c('int getLengthOfLongestWord(String sentence)')} — the length of the longest word (words separated by spaces); 0 for a blank sentence.</li>
<li>${c('String calculateAverageValue(String str)')} — the average of the <b>even digits</b> (0, 2, 4, 6, 8) in ${c('str')}, formatted with two decimals (${c('"3.50"')}); ${c('"0.00"')} when there is no even digit.</li></ul>`,
    vi: `<p>Dạng câu 4 đề PE8. ${c('IUtilities')} và ${c('Main')} cho sẵn; viết ${c('Utilities implements IUtilities')}:</p>
<ul><li>${c('int getLengthOfLongestWord(String sentence)')} — độ dài từ dài nhất (các từ cách nhau bằng dấu cách); 0 với câu trống.</li>
<li>${c('String calculateAverageValue(String str)')} — trung bình các <b>chữ số chẵn</b> (0, 2, 4, 6, 8) trong ${c('str')}, định dạng hai chữ số thập phân (${c('"3.50"')}); ${c('"0.00"')} khi không có chữ số chẵn nào.</li></ul>`,
  },
  yeuCau: PE_YC, dauVao: PE_VAO, dauRa: PE_RA,
  main: 'Main',
  tep: {
    'IUtilities.java': j`
// GIVEN by the paper — do not change.
public interface IUtilities {
    int getLengthOfLongestWord(String sentence);

    String calculateAverageValue(String str);
}
`,
    'Main.java': peMain('IUtilities', 'Utilities', 'getLengthOfLongestWord', 'calculateAverageValue'),
    'Utilities.java': j`
public class Utilities implements IUtilities {
    @Override
    public int getLengthOfLongestWord(String sentence) {
        //>> return 0; // TODO
        int best = 0;
        for (String w : sentence.trim().split("\\s+")) {
            best = Math.max(best, w.length());
        }
        return best;
        //<<
    }

    @Override
    public String calculateAverageValue(String str) {
        //>> return "0.00"; // TODO: even digits only; 0 is even
        int sum = 0, count = 0;
        for (char ch : str.toCharArray()) {
            if (Character.isDigit(ch) && (ch - '0') % 2 == 0) {
                sum += ch - '0';
                count++;
            }
        }
        return String.format("%.2f", count == 0 ? 0.0 : (double) sum / count);
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'longest word', vi: 'từ dài nhất' }, vao: '1\nObject oriented programming in Java\n' },
    { ten: { en: 'even digits including 0', vi: 'chữ số chẵn có cả 0' }, vao: '2\nab2c45x08\n' },
    { ten: { en: 'no even digit', vi: 'không có chữ số chẵn' }, vao: '2\nPRO 1 3 5 7 9\n', an: true },
    { ten: { en: 'blank sentence, repeated spaces', vi: 'câu trống, nhiều dấu cách' }, vao: '1\n    \n1\n  a   bb    ccc  \n', an: true },
    { ten: { en: 'only zeros', vi: 'toàn số 0' }, vao: '2\n000\n', an: true },
  ],
  goiY: [
    { en: 'ch - \'0\' turns a digit character into its value; (ch - \'0\') % 2 == 0 means even — 0 included.', vi: 'ch - \'0\' đổi ký tự chữ số thành giá trị; (ch - \'0\') % 2 == 0 là chẵn — tính cả 0.' },
    { en: 'Guard the division: with no even digit, 0.0 / 0 is NaN and "NaN" would be printed.', vi: 'Chặn phép chia: không có chữ số chẵn thì 0.0 / 0 là NaN và sẽ in "NaN".' },
  ],
  loiHayGap: [
    { en: 'Forgetting that 0 is even ("ab2c45x08" averages 2, 4, 0, 8 = 3.50).', vi: 'Quên rằng 0 là số chẵn ("ab2c45x08" lấy trung bình 2, 4, 0, 8 = 3.50).' },
    { en: 'Integer division sum / count — 14 / 4 = 3, printed as 3.00.', vi: 'Chia nguyên sum / count — 14 / 4 = 3, in thành 3.00.' },
    { en: 'Testing (ch % 2 == 0) on the character itself: \'0\' is 48, so it happens to work for digits but also accepts letters like \'b\' (98).', vi: 'Kiểm (ch % 2 == 0) trên chính ký tự: \'0\' là 48 nên tình cờ đúng với chữ số nhưng cũng nhận cả chữ cái như \'b\' (98).' },
  ],
  giaiThich: { en: '<p>The longest word is a running maximum over <code>split("\\\\s+")</code> after <code>trim()</code>; the average keeps a sum and a count of digits that pass <code>isDigit</code> and the parity test, and the count = 0 case is handled before dividing.</p>', vi: '<p>Từ dài nhất là giá trị lớn nhất chạy dọc <code>split("\\\\s+")</code> sau <code>trim()</code>; trung bình giữ tổng và số đếm các chữ số qua <code>isDigit</code> và phép thử chẵn, trường hợp đếm = 0 được xử lý trước khi chia.</p>' },
});

const de3 = deJava({
  id: 'pro192-on-ch1-ifile',
  tieuDe: { en: 'PE question 4: from a path to an extension and a new name', vi: 'Câu 4 PE: từ đường dẫn ra phần mở rộng và tên mới' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['lastIndexOf', 'substring', 'escape "\\\\"'],
  moTa: {
    en: `<p>PE10 question 4 type. Write ${c('MyFile implements IFile')}:</p>
<ul><li>${c('String f1(String path)')} — the extension of the file the path points to (text after the last dot of the file name).</li>
<li>${c('String f2(String path)')} — ${c('"New_"')} + the file name in upper case (with its extension).</li></ul>
<p>The path may use ${c('\\')} (Windows) or ${c('/')}. The file name is the text after the last separator; it is valid only when it contains a dot that is neither its first nor its last character. Both methods return ${c('"wrong format"')} for an invalid name.</p>`,
    vi: `<p>Dạng câu 4 đề PE10. Viết ${c('MyFile implements IFile')}:</p>
<ul><li>${c('String f1(String path)')} — phần mở rộng của tệp mà đường dẫn trỏ tới (phần sau dấu chấm cuối của tên tệp).</li>
<li>${c('String f2(String path)')} — ${c('"New_"')} + tên tệp viết hoa (kèm phần mở rộng).</li></ul>
<p>Đường dẫn có thể dùng ${c('\\')} (Windows) hoặc ${c('/')}. Tên tệp là phần sau dấu phân cách cuối; chỉ hợp lệ khi có một dấu chấm không đứng đầu cũng không đứng cuối. Cả hai trả ${c('"wrong format"')} với tên không hợp lệ.</p>`,
  },
  yeuCau: PE_YC, dauVao: PE_VAO, dauRa: PE_RA,
  main: 'Main',
  tep: {
    'IFile.java': j`
// GIVEN by the paper — do not change.
public interface IFile {
    String f1(String path);

    String f2(String path);
}
`,
    'Main.java': peMain('IFile', 'MyFile', 'f1', 'f2'),
    'MyFile.java': j`
public class MyFile implements IFile {
    // the text after the last \ or /, or null when it has no valid extension
    private String fileName(String path) {
        //>> return null; // TODO
        String p = path.trim();
        String name = p.substring(Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\')) + 1);
        int dot = name.lastIndexOf('.');
        return (dot <= 0 || dot == name.length() - 1) ? null : name;
        //<<
    }

    @Override
    public String f1(String path) {
        String name = fileName(path);
        //>> return "wrong format"; // TODO
        return name == null ? "wrong format" : name.substring(name.lastIndexOf('.') + 1);
        //<<
    }

    @Override
    public String f2(String path) {
        String name = fileName(path);
        //>> return "wrong format"; // TODO
        return name == null ? "wrong format" : "New_" + name.toUpperCase();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'Windows path', vi: 'đường dẫn Windows' }, vao: '1\nC:\\Users\\an\\Documents\\report.docx\n2\nC:\\Users\\an\\Documents\\report.docx\n' },
    { ten: { en: 'Unix path, several dots', vi: 'đường dẫn Unix, nhiều dấu chấm' }, vao: '1\n/home/an/photo.final.JPG\n2\n/home/an/photo.final.JPG\n' },
    { ten: { en: 'no dot / dot at the end / dot at the start', vi: 'không có dấu chấm / chấm cuối / chấm đầu' }, vao: '1\nD:\\notes\n2\nD:\\archive.\n1\n/home/an/.gitignore\n', an: true },
    { ten: { en: 'a dot only in a folder name', vi: 'dấu chấm chỉ nằm ở tên thư mục' }, vao: '2\n/a/b.c/readme\n1\nmain.java\n', an: true },
  ],
  goiY: [
    { en: 'Math.max(p.lastIndexOf(\'/\'), p.lastIndexOf(\'\\\\\')) handles both separators; with none, −1 + 1 = 0 takes the whole string.', vi: 'Math.max(p.lastIndexOf(\'/\'), p.lastIndexOf(\'\\\\\')) xử lý cả hai kiểu dấu phân cách; không có cái nào thì −1 + 1 = 0 lấy cả chuỗi.' },
    { en: 'In Java source a single backslash character is written \'\\\\\' and a backslash inside a string "\\\\".', vi: 'Trong mã Java một ký tự gạch chéo ngược viết là \'\\\\\', trong chuỗi là "\\\\".' },
  ],
  loiHayGap: [
    { en: 'Looking for the dot in the whole path — "/a/b.c/readme" then gets the extension "c/readme".', vi: 'Tìm dấu chấm trên cả đường dẫn — "/a/b.c/readme" thành phần mở rộng "c/readme".' },
    { en: 'Using indexOf instead of lastIndexOf — "photo.final.JPG" gives "final.JPG".', vi: 'Dùng indexOf thay vì lastIndexOf — "photo.final.JPG" ra "final.JPG".' },
    { en: 'Writing \'\\\' — it does not compile; the backslash must be escaped.', vi: 'Viết \'\\\' — không biên dịch được; gạch chéo ngược phải được escape.' },
  ],
  giaiThich: { en: '<p>A private helper extracts the file name once (last separator) and validates the dot (last dot, not first, not last). Both public methods reuse it, so the validation rule lives in one place.</p>', vi: '<p>Một hàm phụ private lấy tên tệp một lần (dấu phân cách cuối) và kiểm dấu chấm (dấu chấm cuối, không đứng đầu, không đứng cuối). Hai phương thức public dùng lại nó, nên luật kiểm tra chỉ nằm một chỗ.</p>' },
});

const de4 = deJava({
  id: 'pro192-on-ch1-pe1',
  tieuDe: { en: 'The real PE1 question 4: acronym and binary by hand', vi: 'Câu 4 thật của đề PE1: viết tắt và đổi nhị phân bằng tay' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['split(" ")', 'Character.toUpperCase', 'repeated division by 2', 'StringBuilder.reverse'],
  moTa: {
    en: `<p>Write ${c('MyStringNumberTool implements IStringNumberTool')}:</p>
<ul><li>${c('String buildAcronym(String string)')} — split the string by single spaces; for every non-empty word whose first character is a letter A–Z or a–z, take that letter in upper case. ${c('"Java virtual machine"')} → ${c('"JVM"')}; words starting with a digit are skipped.</li>
<li>${c('String decimalToBinary(int n)')} — the binary form of ${c('n ≥ 0')} <b>without</b> ${c('Integer.toBinaryString')}: divide by 2 repeatedly, the remainders read backwards.</li></ul>`,
    vi: `<p>Viết ${c('MyStringNumberTool implements IStringNumberTool')}:</p>
<ul><li>${c('String buildAcronym(String string)')} — tách chuỗi theo từng dấu cách; mỗi từ không rỗng mà ký tự đầu là chữ A–Z hoặc a–z thì lấy chữ đó viết hoa. ${c('"Java virtual machine"')} → ${c('"JVM"')}; từ bắt đầu bằng chữ số bị bỏ qua.</li>
<li>${c('String decimalToBinary(int n)')} — dạng nhị phân của ${c('n ≥ 0')} <b>không dùng</b> ${c('Integer.toBinaryString')}: chia 2 liên tiếp, đọc ngược các số dư.</li></ul>`,
  },
  yeuCau: { en: [...PE_YC.en, '<code>Integer.toBinaryString</code> / <code>Integer.toString(n, 2)</code> are not allowed (the grader checks).'], vi: [...PE_YC.vi, 'Không dùng <code>Integer.toBinaryString</code> / <code>Integer.toString(n, 2)</code> (máy chấm có kiểm).'] },
  dauVao: { en: 'Pairs of lines: 1 + a string, or 2 + a non-negative integer.', vi: 'Từng cặp dòng: 1 + chuỗi, hoặc 2 + số nguyên không âm.' },
  dauRa: PE_RA,
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'no Integer.toBinaryString / Integer.toString(n, 2)', vi: 'không dùng Integer.toBinaryString / Integer.toString(n, 2)', re: String.raw`toBinaryString|Integer\s*\.\s*toString\s*\([^)]*,\s*2\s*\)` }],
  tep: {
    'IStringNumberTool.java': j`
// GIVEN by the paper — do not change.
public interface IStringNumberTool {
    String buildAcronym(String string);

    String decimalToBinary(int n);
}
`,
    'Main.java': peMain('IStringNumberTool', 'MyStringNumberTool', 'buildAcronym', 'decimalToBinary', 'int'),
    'MyStringNumberTool.java': j`
public class MyStringNumberTool implements IStringNumberTool {
    @Override
    public String buildAcronym(String string) {
        //>> return ""; // TODO
        StringBuilder sb = new StringBuilder();
        for (String w : string.split(" ")) {
            if (w.isEmpty()) {
                continue;
            }
            char first = w.charAt(0);
            if ((first >= 'a' && first <= 'z') || (first >= 'A' && first <= 'Z')) {
                sb.append(Character.toUpperCase(first));
            }
        }
        return sb.toString();
        //<<
    }

    @Override
    public String decimalToBinary(int n) {
        //>> return ""; // TODO: remainders of n / 2, read backwards; 0 -> "0"
        if (n == 0) {
            return "0";
        }
        StringBuilder sb = new StringBuilder();
        while (n > 0) {
            sb.append(n % 2);
            n /= 2;
        }
        return sb.reverse().toString();
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'acronym and two numbers', vi: 'viết tắt và hai số' }, vao: '1\nJava virtual machine\n2\n10\n' },
    { ten: { en: 'a word starting with a digit', vi: 'từ bắt đầu bằng chữ số' }, vao: '1\n123 data structure\n2\n5\n' },
    { ten: { en: 'zero and a large number', vi: 'số 0 và số lớn' }, vao: '2\n0\n2\n1000000\n', an: true },
    { ten: { en: 'double spaces, symbols, empty', vi: 'hai dấu cách, ký hiệu, chuỗi rỗng' }, vao: '1\nobject  oriented #programming _x Yes\n1\n\n2\n1\n', an: true },
  ],
  goiY: [
    { en: 'split(" ") keeps empty strings between two spaces — skip them with if (w.isEmpty()) continue;', vi: 'split(" ") giữ các chuỗi rỗng giữa hai dấu cách — bỏ qua bằng if (w.isEmpty()) continue;' },
    { en: 'While n > 0: append n % 2, then n /= 2; reverse at the end. Handle n == 0 first.', vi: 'Khi n > 0: thêm n % 2, rồi n /= 2; cuối cùng đảo ngược. Xử lý n == 0 trước.' },
  ],
  loiHayGap: [
    { en: 'decimalToBinary(0) returning "" — the loop never runs.', vi: 'decimalToBinary(0) trả "" — vòng lặp không chạy lần nào.' },
    { en: 'Forgetting to reverse: 6 becomes "011" instead of "110".', vi: 'Quên đảo ngược: 6 thành "011" thay vì "110".' },
    { en: 'Character.isLetter accepts non-ASCII letters and "_" is not a letter — the paper says A–Z / a–z only.', vi: 'Character.isLetter nhận cả chữ ngoài ASCII; "_" không phải chữ — đề chỉ nói A–Z / a–z.' },
  ],
  giaiThich: { en: '<p>The acronym follows the paper literally: split by one space, skip empty pieces, test the first character against the ASCII ranges. Binary conversion collects remainders from the least significant bit and reverses once at the end.</p>', vi: '<p>Viết tắt làm đúng từng chữ của đề: tách theo một dấu cách, bỏ mảnh rỗng, so ký tự đầu với khoảng ASCII. Đổi nhị phân gom số dư từ bit thấp nhất rồi đảo một lần ở cuối.</p>' },
});

const de5 = deJava({
  id: 'pro192-on-ch1-nhap-so',
  tieuDe: { en: 'LAB211 input that never crashes: read, sort, binary search', vi: 'Nhập liệu LAB211 không bao giờ sập: đọc, sắp xếp, tìm nhị phân' },
  doKho: 'HARD', phut: 30,
  khaiNiem: ['nextLine + parseInt', 'try/catch NumberFormatException', 'Arrays.sort', 'Arrays.binarySearch'],
  moTa: {
    en: `<p>Every LAB211 program starts with input that survives anything the user types. Write ${c('static int readInt(String prompt, int min, int max)')}: print the prompt, read a <b>whole line</b>, and keep asking until it is an integer in ${c('[min, max]')}. Wrong input prints exactly one of these lines and asks again:</p>
<pre>  -> "abc" is not an integer, try again
  -> out of range [1, 10], try again</pre>
<p>Then the program: read ${c('n')} (1..10), then ${c('a[0]')} … ${c('a[n-1]')} (−1000..1000), print the array, min/max/average, a sorted <b>copy</b>, read a value (−1000..1000) and binary-search it in the sorted copy:</p>
<pre>Entered : [12, 5, 7, -3]
min = -3, max = 12, average = 5.25
Sorted  : [-3, 5, 7, 12]
7 found at index 2 of the sorted array</pre>
<p>Not found: ${c('8 not found (it would be inserted at index 3)')} — the insertion point that ${c('Arrays.binarySearch')} encodes as ${c('-(point) - 1')}.</p>`,
    vi: `<p>Mọi bài LAB211 mở đầu bằng phần nhập chịu được mọi thứ người dùng gõ. Viết ${c('static int readInt(String prompt, int min, int max)')}: in lời nhắc, đọc <b>nguyên dòng</b>, hỏi lại tới khi là số nguyên trong ${c('[min, max]')}. Nhập sai in đúng một trong hai dòng sau rồi hỏi lại:</p>
<pre>  -> "abc" is not an integer, try again
  -> out of range [1, 10], try again</pre>
<p>Sau đó chương trình: đọc ${c('n')} (1..10), rồi ${c('a[0]')} … ${c('a[n-1]')} (−1000..1000), in mảng, min/max/trung bình, một <b>bản sao</b> đã sắp xếp, đọc một giá trị (−1000..1000) và tìm nhị phân trong bản sao:</p>
<pre>Entered : [12, 5, 7, -3]
min = -3, max = 12, average = 5.25
Sorted  : [-3, 5, 7, 12]
7 found at index 2 of the sorted array</pre>
<p>Không thấy: ${c('8 not found (it would be inserted at index 3)')} — vị trí chèn mà ${c('Arrays.binarySearch')} mã hoá thành ${c('-(vị trí) - 1')}.</p>`,
  },
  yeuCau: {
    en: ['Prompts: <code>Number of elements (1..10): </code>, <code>a[i] = </code>, <code>Value to search: </code> (no newline after them).', 'Read only with <code>nextLine()</code>; the program never crashes, whatever is typed.', 'Sort a copy (<code>Arrays.copyOf</code>) — "Entered" keeps the input order.'],
    vi: ['Lời nhắc: <code>Number of elements (1..10): </code>, <code>a[i] = </code>, <code>Value to search: </code> (không xuống dòng sau chúng).', 'Chỉ đọc bằng <code>nextLine()</code>; gõ gì chương trình cũng không sập.', 'Sắp xếp một bản sao (<code>Arrays.copyOf</code>) — dòng "Entered" giữ thứ tự nhập.'],
  },
  dauVao: { en: 'One value per line, possibly wrong (letters, blank, out of range).', vi: 'Mỗi dòng một giá trị, có thể sai (chữ, trống, ngoài khoảng).' },
  dauRa: { en: 'The prompts, error lines and the four result lines.', vi: 'Các lời nhắc, dòng báo lỗi và bốn dòng kết quả.' },
  main: 'Main', lab211: true,
  tep: {
    'Main.java': j`
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    private static final Scanner SC = new Scanner(System.in);

    // keeps asking until the user types an integer in [min, max]
    static int readInt(String prompt, int min, int max) {
        //>> System.out.print(prompt); ⏎ return Integer.parseInt(SC.nextLine().trim()); // TODO: loop, catch, range
        while (true) {
            System.out.print(prompt);
            String line = SC.nextLine().trim();
            try {
                int x = Integer.parseInt(line);
                if (x >= min && x <= max) {
                    return x;
                }
                System.out.println("  -> out of range [" + min + ", " + max + "], try again");
            } catch (NumberFormatException e) {
                System.out.println("  -> \"" + line + "\" is not an integer, try again");
            }
        }
        //<<
    }

    public static void main(String[] args) {
        int n = readInt("Number of elements (1..10): ", 1, 10);
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            a[i] = readInt("a[" + i + "] = ", -1000, 1000);
        }
        int min = Integer.MAX_VALUE;
        int max = Integer.MIN_VALUE;
        int sum = 0;
        for (int x : a) {
            min = Math.min(min, x);
            max = Math.max(max, x);
            sum += x;
        }
        System.out.println("Entered : " + Arrays.toString(a));
        System.out.printf("min = %d, max = %d, average = %.2f%n", min, max, (double) sum / n);
        //>> // TODO: sort a copy, read the value, binary search, print the result line
        int[] sorted = Arrays.copyOf(a, n);
        Arrays.sort(sorted);
        System.out.println("Sorted  : " + Arrays.toString(sorted));
        int k = readInt("Value to search: ", -1000, 1000);
        int pos = Arrays.binarySearch(sorted, k);
        System.out.println(pos >= 0 ? k + " found at index " + pos + " of the sorted array"
                : k + " not found (it would be inserted at index " + (-pos - 1) + ")");
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'wrong inputs everywhere, value found', vi: 'nhập sai khắp nơi, tìm thấy' }, vao: 'abc\n0\n12\n4\n12\n5\n7\n-3\n7\n' },
    { ten: { en: 'value not found', vi: 'không tìm thấy' }, vao: '3\n10\n30\n20\n25\n' },
    { ten: { en: 'blank lines and boundaries', vi: 'dòng trống và giá trị biên' }, vao: '\n10\n-1000\n1000\n0\n1\n2\n3\n4\n5\n6\n7\n2000\n-1001\n-1000\n', an: true },
    { ten: { en: 'spaces around numbers, smaller than all', vi: 'dấu cách quanh số, nhỏ hơn mọi phần tử' }, vao: '  2  \n 9\nx9\n-9 \n-50\n', an: true },
  ],
  goiY: [
    { en: 'while (true) { print; read line; try { parse; if in range return; print range error } catch (NumberFormatException e) { print format error } }', vi: 'while (true) { in; đọc dòng; try { parse; nếu trong khoảng thì return; in lỗi khoảng } catch (NumberFormatException e) { in lỗi định dạng } }' },
    { en: 'Arrays.binarySearch returns −(insertion point) − 1 when the value is missing, so the insertion point is −pos − 1.', vi: 'Arrays.binarySearch trả −(vị trí chèn) − 1 khi không có giá trị, nên vị trí chèn là −pos − 1.' },
  ],
  loiHayGap: [
    { en: 'sc.nextInt() — a letter throws InputMismatchException and the program crashes (LAB211 rule L2 also fails).', vi: 'sc.nextInt() — gõ chữ là ném InputMismatchException và chương trình sập (luật L2 của LAB211 cũng trượt).' },
    { en: 'Sorting the original array — the "Entered" line then shows the sorted order.', vi: 'Sắp xếp chính mảng gốc — dòng "Entered" khi đó in thứ tự đã sắp.' },
    { en: 'Forgetting trim(): " 9" is not parsed by Integer.parseInt.', vi: 'Quên trim(): Integer.parseInt không đọc được " 9".' },
  ],
  giaiThich: { en: '<p>The input method is the LAB211 pattern: one infinite loop, read a whole line, parse inside try, return only when the value is valid, a specific message for each kind of mistake. Sorting a copy keeps the user’s order for the report, and binarySearch’s negative result is decoded into the insertion point.</p>', vi: '<p>Hàm nhập là khuôn LAB211: một vòng lặp vô hạn, đọc nguyên dòng, parse trong try, chỉ return khi giá trị hợp lệ, mỗi kiểu sai một thông báo riêng. Sắp xếp bản sao giữ thứ tự người dùng cho báo cáo, và kết quả âm của binarySearch được giải mã thành vị trí chèn.</p>' },
});

export default moDun({ slug: 'pro192-on-ch1', ten: '1.3 🧪 Practice — strings, arrays, sorting: PE question 4 and LAB211 input', de: [de1, de2, de3, de4, de5] });
