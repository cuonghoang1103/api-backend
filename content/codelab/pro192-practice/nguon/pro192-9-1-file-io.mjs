/** PRO192 · 9.1 — Reading & writing files: đọc tệp văn bản, ghi rồi đọc lại (UTF-8), CSV có dòng hỏng, ghi nối (append) sống qua lần mở lại. */
import { moDun, deJava, c, j } from './_chung.mjs';

const de1 = deJava({
  id: 'pro192-9-1-count-file',
  tieuDe: { en: 'Read a text file: lines, words, characters, the longest line', vi: 'Đọc tệp văn bản: dòng, từ, ký tự, dòng dài nhất' },
  doKho: 'EASY', phut: 20,
  khaiNiem: ['BufferedReader + FileReader', 'try-with-resources', 'readLine() returns null at the end', 'FileNotFoundException'],
  moTa: {
    en: `<p>Read the file ${c('input.txt')} from the current folder and print:</p>
<pre>lines: 4
words: 11
characters: 52
longest line: #2 (21 characters)</pre>
<ul><li>characters = the characters of every line, line breaks not counted; words = tokens separated by whitespace;</li>
<li>longest line: the first one on a tie; an empty file → ${c('lines: 0')}, ${c('words: 0')}, ${c('characters: 0')}, ${c('longest line: none')};</li>
<li>when the file does not exist print only ${c('cannot open input.txt')} — no stack trace.</li></ul>`,
    vi: `<p>Đọc tệp ${c('input.txt')} trong thư mục hiện tại và in như mẫu: ký tự = ký tự của mọi dòng, không tính dấu xuống dòng; từ = các mảnh cách nhau bởi khoảng trắng; dòng dài nhất lấy dòng đầu khi hoà; tệp rỗng → các số 0 và ${c('longest line: none')}; tệp không tồn tại thì chỉ in ${c('cannot open input.txt')} — không in stack trace.</p>`,
  },
  yeuCau: { en: ['Use try-with-resources so the file is always closed.'], vi: ['Dùng try-with-resources để tệp luôn được đóng.'] },
  dauVao: { en: 'The file input.txt (stdin is not used).', vi: 'Tệp input.txt (không dùng stdin).' },
  dauRa: { en: 'Four lines, or the error line.', vi: 'Bốn dòng, hoặc dòng báo lỗi.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'try-with-resources', vi: 'try-with-resources', re: String.raw`try\s*\(`, need: true }],
  tep: {
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        //>> System.out.println("cannot open input.txt"); // TODO: read input.txt line by line
        int lines = 0;
        int words = 0;
        int chars = 0;
        int longest = -1;
        int longestNo = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                lines++;
                chars += line.length();
                String t = line.trim();
                if (!t.isEmpty()) {
                    words += t.split("\\s+").length;
                }
                if (line.length() > longest) {
                    longest = line.length();
                    longestNo = lines;
                }
            }
        } catch (IOException e) {
            System.out.println("cannot open input.txt");
            return;
        }
        System.out.println("lines: " + lines);
        System.out.println("words: " + words);
        System.out.println("characters: " + chars);
        System.out.println("longest line: " + (lines == 0 ? "none" : "#" + longestNo + " (" + longest + " characters)"));
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'a small file', vi: 'một tệp nhỏ' }, vao: '', tepCa: { 'input.txt': 'CT Library opens at 8\nRead, borrow and return\n\n  three  spaces   here \n' } },
    { ten: { en: 'the file is missing', vi: 'không có tệp' }, vao: '' },
    { ten: { en: 'an empty file', vi: 'tệp rỗng' }, vao: '', tepCa: { 'input.txt': '' }, an: true },
    { ten: { en: 'a tie on the longest line, no final newline', vi: 'hoà dòng dài nhất, không có xuống dòng cuối' }, vao: '', tepCa: { 'input.txt': 'abc\nxyz\nab' }, an: true },
  ],
  goiY: [
    { en: 'while ((line = in.readLine()) != null) { … } — readLine strips the line break and returns null at the end of the file.', vi: 'while ((line = in.readLine()) != null) { … } — readLine bỏ dấu xuống dòng và trả null khi hết tệp.' },
    { en: 'FileReader throws FileNotFoundException (an IOException) when the file is missing — catch it and print the message.', vi: 'FileReader ném FileNotFoundException (một IOException) khi không có tệp — bắt nó và in câu báo.' },
  ],
  loiHayGap: [
    { en: 'Counting words with line.split(" ") — empty strings between double spaces are counted as words.', vi: 'Đếm từ bằng line.split(" ") — chuỗi rỗng giữa hai dấu cách bị đếm thành từ.' },
    { en: '"   ".trim().split("\\\\s+") returns [""] — one word for a blank line unless you check isEmpty() first.', vi: '"   ".trim().split("\\\\s+") trả [""] — dòng trắng thành một từ nếu không kiểm isEmpty() trước.' },
    { en: 'Forgetting to close the reader — on Windows the file then stays locked.', vi: 'Quên đóng reader — trên Windows tệp bị khoá.' },
  ],
  giaiThich: { en: '<p>BufferedReader reads line by line; the loop accumulates the counters and remembers the first longest line. try-with-resources closes the file in every case, and the IOException is turned into one friendly line.</p>', vi: '<p>BufferedReader đọc từng dòng; vòng lặp cộng dồn các bộ đếm và nhớ dòng dài nhất đầu tiên. try-with-resources đóng tệp trong mọi trường hợp, và IOException được đổi thành một dòng báo thân thiện.</p>' },
});

const de2 = deJava({
  id: 'pro192-9-1-write-report',
  tieuDe: { en: 'Write a report file in UTF-8, then read it back', vi: 'Ghi tệp báo cáo UTF-8, rồi đọc lại' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['PrintWriter', 'OutputStreamWriter + StandardCharsets.UTF_8', 'flush / close', 'reading what you wrote'],
  moTa: {
    en: `<p>Read lines ${c('name;mark')} from the keyboard and write ${c('report.txt')} in <b>UTF-8</b>:</p>
<pre>REPORT (3 students)
1. An        8.50 PASS
2. Binh      4.00 FAIL
3. Chi      10.00 PASS
average: 7.50</pre>
<p>Rows: ${c('String.format("%d. %-8s %5.2f %s", …)')}, PASS when mark ≥ 5. Skip an invalid line (not two parts, mark not a number or outside 0..10) and count it: after the average add ${c('skipped: 1')} (only when something was skipped). With no valid student write ${c('REPORT (0 students)')} and ${c('average: 0.00')}.</p>
<p>Then <b>close</b> the writer, open ${c('report.txt')} again and print it to the screen, followed by ${c('-- report.txt: 5 lines')}.</p>`,
    vi: `<p>Đọc các dòng ${c('tên;điểm')} từ bàn phím và ghi ${c('report.txt')} bằng <b>UTF-8</b> như mẫu (dòng dạng ${c('String.format("%d. %-8s %5.2f %s", …)')}, PASS khi điểm ≥ 5). Bỏ dòng sai (không đủ hai phần, điểm không phải số hay ngoài 0..10) và đếm: sau dòng trung bình thêm ${c('skipped: 1')} (chỉ khi có dòng bị bỏ). Không có sinh viên hợp lệ thì ghi ${c('REPORT (0 students)')} và ${c('average: 0.00')}. Rồi <b>đóng</b> writer, mở lại ${c('report.txt')} và in ra màn hình, kèm dòng ${c('-- report.txt: 5 lines')}.</p>`,
  },
  yeuCau: { en: ['Write with an explicit UTF-8 charset (not the platform default).', 'Print the file only after it has been closed.'], vi: ['Ghi với bảng mã UTF-8 chỉ rõ (không dùng mặc định của máy).', 'Chỉ in tệp sau khi đã đóng.'] },
  dauVao: { en: 'Lines name;mark.', vi: 'Các dòng tên;điểm.' },
  dauRa: { en: 'The content of report.txt and its line count.', vi: 'Nội dung report.txt và số dòng.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'explicit UTF-8 when writing', vi: 'chỉ rõ UTF-8 khi ghi', re: String.raw`UTF_8|"UTF-8"`, need: true }],
  tep: {
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        List<String> names = new ArrayList<>();
        List<Double> marks = new ArrayList<>();
        int skipped = 0;
        while (sc.hasNextLine()) {
            String[] p = sc.nextLine().split(";");
            try {
                double m = Double.parseDouble(p[1].trim());
                if (p.length != 2 || m < 0 || m > 10 || p[0].trim().isEmpty()) {
                    skipped++;
                    continue;
                }
                names.add(p[0].trim());
                marks.add(m);
            } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                skipped++;
            }
        }
        //>> // TODO: write report.txt (UTF-8), close it, read it back and print it
        double sum = 0;
        try (PrintWriter out = new PrintWriter(new OutputStreamWriter(new FileOutputStream("report.txt"), StandardCharsets.UTF_8))) {
            out.println("REPORT (" + names.size() + " students)");
            for (int i = 0; i < names.size(); i++) {
                double m = marks.get(i);
                sum += m;
                out.println(String.format("%d. %-8s %5.2f %s", i + 1, names.get(i), m, m >= 5 ? "PASS" : "FAIL"));
            }
            out.println(String.format("average: %.2f", names.isEmpty() ? 0 : sum / names.size()));
            if (skipped > 0) {
                out.println("skipped: " + skipped);
            }
        }
        int count = 0;
        try (BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream("report.txt"), StandardCharsets.UTF_8))) {
            String line;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
                count++;
            }
        }
        System.out.println("-- report.txt: " + count + " lines");
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three students', vi: 'ba sinh viên' }, vao: 'An;8.5\nBinh;4\nChi;10\n' },
    { ten: { en: 'invalid lines are skipped', vi: 'dòng sai bị bỏ' }, vao: 'Dung;7.25\nEm;eleven\nGiang;11\n;5\nHa\nKhoa;5\n' },
    { ten: { en: 'a skipped line and a Vietnamese name', vi: 'một dòng bị bỏ và một tên tiếng Việt' }, vao: 'x;-1\nNguyễn Ánh;9\n', an: true },
    { ten: { en: 'nobody valid', vi: 'không ai hợp lệ' }, vao: 'Lan;-0.5\n', an: true },
  ],
  goiY: [
    { en: 'new PrintWriter(new OutputStreamWriter(new FileOutputStream("report.txt"), StandardCharsets.UTF_8)) inside try-with-resources; the closing of the try flushes and closes the file.', vi: 'new PrintWriter(new OutputStreamWriter(new FileOutputStream("report.txt"), StandardCharsets.UTF_8)) trong try-with-resources; cuối khối try sẽ flush và đóng tệp.' },
    { en: 'Read it back with the SAME charset: new InputStreamReader(new FileInputStream(…), StandardCharsets.UTF_8).', vi: 'Đọc lại bằng CÙNG bảng mã: new InputStreamReader(new FileInputStream(…), StandardCharsets.UTF_8).' },
  ],
  loiHayGap: [
    { en: 'Reading the file before the writer is closed — the last lines are still in the buffer and the file looks truncated.', vi: 'Đọc tệp trước khi đóng writer — các dòng cuối còn trong bộ đệm và tệp trông như bị cắt.' },
    { en: 'new FileWriter("report.txt") on a Windows machine with JDK 8–17 writes cp1252: "Nguyễn" becomes "Nguy?n".', vi: 'new FileWriter("report.txt") trên Windows với JDK 8–17 ghi cp1252: "Nguyễn" thành "Nguy?n".' },
  ],
  giaiThich: { en: '<p>Writing goes through a PrintWriter on an explicitly UTF-8 stream, closed by try-with-resources (which also flushes). Reading back with the same charset proves the file is complete and correctly encoded.</p>', vi: '<p>Ghi đi qua PrintWriter trên luồng UTF-8 chỉ rõ, được try-with-resources đóng (đồng thời flush). Đọc lại bằng cùng bảng mã chứng minh tệp đầy đủ và đúng mã hoá.</p>' },
});

const de3 = deJava({
  id: 'pro192-9-1-csv-broken',
  tieuDe: { en: 'CSV to objects: skip broken lines and say why', vi: 'CSV thành đối tượng: bỏ dòng hỏng và nói lý do' },
  doKho: 'MEDIUM', phut: 25,
  khaiNiem: ['parsing CSV lines', 'header line', 'per-line try/catch', 'line numbers in messages'],
  moTa: {
    en: `<p>${c('books.csv')} (UTF-8) has a header ${c('code,title,year,copies')} and one book per line. Load every valid line into a ${c('List<Book>')} and report each broken one with its line number (the header is line 1):</p>
<pre>line 4 skipped: expected 4 fields, found 3
line 6 skipped: year is not a number: 20O5
line 7 skipped: copies must be >= 0: -2
loaded 3 books, skipped 3 lines (blank lines ignored)</pre>
<p>Blank lines are ignored silently (not counted). Then print the books sorted by year, then code: ${c('B002 Effective Java 2018 x2')}. A missing file → ${c('cannot open books.csv')}.</p>`,
    vi: `<p>${c('books.csv')} (UTF-8) có dòng tiêu đề ${c('code,title,year,copies')} và mỗi dòng một sách. Nạp mọi dòng hợp lệ vào ${c('List<Book>')} và báo từng dòng hỏng kèm số dòng (dòng tiêu đề là dòng 1) như mẫu. Dòng trống bỏ qua im lặng (không đếm). Rồi in sách sắp theo năm, rồi mã. Không có tệp → ${c('cannot open books.csv')}.</p>`,
  },
  yeuCau: { en: ['Book.java is given.', 'One try/catch per line: a broken line never stops the loading.'], vi: ['Book.java cho sẵn.', 'Mỗi dòng một try/catch: dòng hỏng không làm dừng việc nạp.'] },
  dauVao: { en: 'The file books.csv.', vi: 'Tệp books.csv.' },
  dauRa: { en: 'Skip messages, the summary, the sorted books.', vi: 'Các dòng báo bỏ, dòng tổng kết, sách đã sắp.' },
  main: 'Main',
  tep: {
    'Book.java': j`
// GIVEN — do not change.
public class Book {
    private final String code;
    private final String title;
    private final int year;
    private final int copies;

    public Book(String code, String title, int year, int copies) {
        this.code = code;
        this.title = title;
        this.year = year;
        this.copies = copies;
    }

    public String getCode() {
        return code;
    }

    public int getYear() {
        return year;
    }

    @Override
    public String toString() {
        return code + " " + title + " " + year + " x" + copies;
    }
}
`,
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Book> books = new ArrayList<>();
        int skipped = 0;
        //>> System.out.println("cannot open books.csv"); // TODO: read books.csv, skip broken lines with the reason, summary, sorted list
        try (BufferedReader in = new BufferedReader(new InputStreamReader(new FileInputStream("books.csv"), StandardCharsets.UTF_8))) {
            String line = in.readLine();
            int no = 1;
            while ((line = in.readLine()) != null) {
                no++;
                if (line.trim().isEmpty()) {
                    continue;
                }
                String[] p = line.split(",");
                String field = "";
                try {
                    if (p.length != 4) {
                        throw new IllegalArgumentException("expected 4 fields, found " + p.length);
                    }
                    field = "year";
                    int year = Integer.parseInt(p[2].trim());
                    field = "copies";
                    int copies = Integer.parseInt(p[3].trim());
                    if (copies < 0) {
                        throw new IllegalArgumentException("copies must be >= 0: " + copies);
                    }
                    books.add(new Book(p[0].trim(), p[1].trim(), year, copies));
                } catch (NumberFormatException e) {
                    skipped++;
                    System.out.println("line " + no + " skipped: " + field + " is not a number: " + (field.equals("year") ? p[2].trim() : p[3].trim()));
                } catch (IllegalArgumentException e) {
                    skipped++;
                    System.out.println("line " + no + " skipped: " + e.getMessage());
                }
            }
        } catch (IOException e) {
            System.out.println("cannot open books.csv");
            return;
        }
        System.out.println("loaded " + books.size() + " books, skipped " + skipped + " lines (blank lines ignored)");
        Collections.sort(books, new Comparator<Book>() {
            @Override
            public int compare(Book a, Book b) {
                int byYear = Integer.compare(a.getYear(), b.getYear());
                return byYear != 0 ? byYear : a.getCode().compareTo(b.getCode());
            }
        });
        for (Book b : books) {
            System.out.println(b);
        }
        //<<
    }
}
`,
  },
  ca: [
    { ten: { en: 'three good lines, three broken', vi: 'ba dòng tốt, ba dòng hỏng' }, vao: '', tepCa: { 'books.csv': 'code,title,year,copies\nB001,Clean Code,2008,3\nB002,Effective Java,2018,2\nB003,Refactoring,2018\n\nB004,Head First Java,20O5,4\nB005,Mystery,2020,-2\nB000,The C Programming Language,1978,1\n' } },
    { ten: { en: 'missing file', vi: 'không có tệp' }, vao: '' },
    { ten: { en: 'only the header', vi: 'chỉ có dòng tiêu đề' }, vao: '', tepCa: { 'books.csv': 'code,title,year,copies\n' }, an: true },
    { ten: { en: 'Vietnamese titles, copies not a number', vi: 'tên tiếng Việt, số bản không phải số' }, vao: '', tepCa: { 'books.csv': 'code,title,year,copies\nV01,Mắt Biếc,1990,2\nV02,Dế Mèn,1941,x\nV03,Số Đỏ,1936,0\n' }, an: true },
  ],
  goiY: [
    { en: 'Read and discard the header first; keep a line counter that starts at 1 for it.', vi: 'Đọc bỏ dòng tiêu đề trước; giữ bộ đếm dòng bắt đầu từ 1 cho nó.' },
    { en: 'Put the try/catch INSIDE the loop, around one line — a catch outside the loop would stop at the first broken line.', vi: 'Đặt try/catch BÊN TRONG vòng lặp, quanh một dòng — catch bên ngoài sẽ dừng ở dòng hỏng đầu tiên.' },
  ],
  loiHayGap: [
    { en: 'Counting the header as line 0 — every message is off by one.', vi: 'Coi dòng tiêu đề là dòng 0 — mọi câu báo lệch một.' },
    { en: 'A title that contains a comma breaks a naive split(",") — real CSV needs quotes (Lab 9 handles them).', vi: 'Tên sách có dấu phẩy làm hỏng split(",") ngây thơ — CSV thật cần ngoặc kép (Lab 9 xử lý chuyện này).' },
  ],
  giaiThich: { en: '<p>The outer try-with-resources deals with the file (cannot open → one message); an inner try/catch per line turns each parsing problem into a message with the line number, so one bad line costs one line, not the whole load.</p>', vi: '<p>try-with-resources bên ngoài lo phần tệp (không mở được → một câu báo); try/catch bên trong cho từng dòng biến mỗi lỗi parse thành câu báo có số dòng, nên một dòng hỏng chỉ mất một dòng, không mất cả lần nạp.</p>' },
});

const de4 = deJava({
  id: 'pro192-9-1-append-log',
  tieuDe: { en: 'A log that survives a restart: append mode', vi: 'Nhật ký sống qua lần mở lại: ghi nối (append)' },
  doKho: 'MEDIUM', phut: 20,
  khaiNiem: ['FileWriter(name, true)', 'append vs overwrite', 'reading on start-up', 'data that outlives the program'],
  moTa: {
    en: `<p>The program is run <b>twice in the same folder</b> (the grader restarts it). Each run:</p>
<ol><li>reads ${c('visits.log')} if it exists and prints ${c('previous visits: 3')} (0 when the file is missing);</li>
<li>reads member ids from the keyboard and <b>appends</b> one line per valid id (${c('M')} + 3 digits, stored upper-case) to ${c('visits.log')} — an invalid id prints ${c('ignored: <id>')};</li>
<li>prints ${c('this run: 2, total: 5')} and the last 3 lines of the log: ${c('last: M001, M002, M007')}.</li></ol>`,
    vi: `<p>Chương trình được chạy <b>hai lần trong cùng thư mục</b> (máy chấm mở lại nó). Mỗi lần: đọc ${c('visits.log')} nếu có và in ${c('previous visits: 3')} (0 khi chưa có tệp); đọc mã thành viên từ bàn phím và <b>ghi nối</b> mỗi mã hợp lệ (${c('M')} + 3 chữ số, lưu viết hoa) thành một dòng vào ${c('visits.log')} — mã sai in ${c('ignored: <mã>')}; in ${c('this run: 2, total: 5')} và 3 dòng cuối của nhật ký: ${c('last: M001, M002, M007')}.</p>`,
  },
  yeuCau: { en: ['Open the writer in append mode — never rewrite the whole file.'], vi: ['Mở writer ở chế độ ghi nối — không viết lại cả tệp.'] },
  dauVao: { en: 'Member ids (session 1, then session 2).', vi: 'Mã thành viên (lần 1, rồi lần 2).' },
  dauRa: { en: 'Both runs, separated by the grader’s RESTART line.', vi: 'Cả hai lần chạy, ngăn bởi dòng RESTART của máy chấm.' },
  main: 'Main',
  quyTac: [{ id: 'R1', en: 'append mode: FileWriter(…, true)', vi: 'chế độ nối: FileWriter(…, true)', re: String.raw`FileWriter\s*\([^)]*,\s*true\s*\)|StandardOpenOption\s*\.\s*APPEND`, need: true }],
  tep: {
    'Main.java': j`
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    private static final String LOG = "visits.log";

    static List<String> readLog() {
        List<String> lines = new ArrayList<>();
        //>> // TODO: read visits.log if it exists (a missing file means "no visit yet")
        try (BufferedReader in = new BufferedReader(new FileReader(LOG))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    lines.add(line.trim());
                }
            }
        } catch (IOException e) {
            return lines;
        }
        //<<
        return lines;
    }

    public static void main(String[] args) throws IOException {
        List<String> log = readLog();
        System.out.println("previous visits: " + log.size());
        Scanner sc = new Scanner(System.in);
        int added = 0;
        //>> // TODO: append each valid id to visits.log (append mode!)
        try (PrintWriter out = new PrintWriter(new FileWriter(LOG, true))) {
            while (sc.hasNextLine()) {
                String id = sc.nextLine().trim().toUpperCase();
                if (id.isEmpty()) {
                    continue;
                }
                if (!id.matches("M\\d{3}")) {
                    System.out.println("ignored: " + id);
                    continue;
                }
                out.println(id);
                log.add(id);
                added++;
            }
        }
        //<<
        System.out.println("this run: " + added + ", total: " + log.size());
        List<String> last = log.subList(Math.max(0, log.size() - 3), log.size());
        System.out.println("last: " + (last.isEmpty() ? "none" : String.join(", ", last)));
    }
}
`,
  },
  ca: [
    { ten: { en: 'two runs: the second sees the first', vi: 'hai lần chạy: lần sau thấy lần trước' }, phien: ['m001\nM002\nX9\n', 'M007\nm010\n\nm1\n'] },
    { ten: { en: 'the log already has visits', vi: 'nhật ký đã có lượt ghé' }, phien: ['M100\n', ''], tepCa: { 'visits.log': 'M050\nM051\n' }, an: true },
    { ten: { en: 'nothing valid in either run', vi: 'cả hai lần không có mã hợp lệ' }, phien: ['abc\n', 'M12\n'], an: true },
  ],
  goiY: [
    { en: 'new FileWriter("visits.log", true) — the second argument true means append; without it every run erases the previous visits.', vi: 'new FileWriter("visits.log", true) — đối số thứ hai true nghĩa là ghi nối; thiếu nó thì mỗi lần chạy xoá lượt ghé trước.' },
    { en: 'A missing file on the first run is normal: catch the IOException and start with an empty list.', vi: 'Lần chạy đầu chưa có tệp là bình thường: bắt IOException và bắt đầu với danh sách rỗng.' },
  ],
  loiHayGap: [
    { en: 'new FileWriter(LOG) without true — session 2 reports "previous visits: 2" but the log ends up with only its own lines.', vi: 'new FileWriter(LOG) thiếu true — lần 2 báo "previous visits: 2" nhưng nhật ký chỉ còn các dòng của nó.' },
    { en: 'Opening the writer BEFORE reading the old log, in overwrite mode — the old content is gone before it is read.', vi: 'Mở writer ghi đè TRƯỚC khi đọc nhật ký cũ — nội dung cũ mất trước khi kịp đọc.' },
  ],
  giaiThich: { en: '<p>Data that must outlive the program goes to a file: read it on start-up, append new records as they arrive. Append mode adds to the end instead of truncating, which is what makes the second run see the first one’s visits.</p>', vi: '<p>Dữ liệu phải sống lâu hơn chương trình thì ghi ra tệp: đọc lúc khởi động, ghi nối bản ghi mới khi có. Chế độ nối thêm vào cuối thay vì cắt bỏ — đó là điều giúp lần chạy thứ hai thấy lượt ghé của lần đầu.</p>' },
});

export default moDun({ slug: 'pro192-9-1-file-io', ten: '9.1 Reading & writing files', de: [de1, de2, de3, de4] });
