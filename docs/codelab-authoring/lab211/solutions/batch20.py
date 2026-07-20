# Batch 20 — J1.S.P0077 (list and search files by content) and J1.S.P0078
# (config-driven file copier). Both are FILE exercises, so both projects build
# their own sample data on first start: an assignment about reading files that
# ships with nothing to read cannot be marked, and cannot be tested either.
import re
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0077 — Count a word in a file / find files containing a word (100 LOC)
# ════════════════════════════════════════════════════════════════

P0077_SEARCHER = '''package bo;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * The two methods the brief names, and one definition of "a match" shared
 * between them.
 *
 * getFileNameContainsWordInDirectory() is written on top of countWordInFile()
 * rather than beside it. That is the important decision in this class: if the
 * two methods each decided for themselves what counts as a hit, option 1 could
 * report "Bout: 0" for a file that option 2 had just listed, and both answers
 * would look defensible. One definition means they can never disagree.
 *
 * The signatures - instance methods, returning a value, declaring
 * `throws Exception` - are copied from the Guidelines exactly. Nothing here
 * prints; the screen belongs to ui.Main.
 */
public class WordSearcher {

    /**
     * How many times `word` occurs in the file at `fileSource`.
     *
     * A match is a WHOLE WORD and it is CASE-SENSITIVE. Both halves of that are
     * choices, and both are visible in the demo data:
     *
     *   "The latest test result"  contains the four letters t-e-s-t, but the
     *                             word there is "latest", so it is not a hit.
     *   "Test"                    is a different word from "test".
     *
     * The alternative - counting substrings with indexOf - is shorter and
     * wrong in two ways at once: it counts "latest" as "test", and given an
     * empty search word it never advances, so the loop runs forever. That is
     * why the blank word is rejected on the first line instead of being left
     * to the loop to survive.
     */
    public int countWordInFile(String fileSource, String word) throws Exception {
        if (word == null || word.isEmpty()) {
            throw new Exception("Word must not be blank.");
        }
        File file = new File(fileSource);
        if (!file.exists()) {
            throw new Exception("File not found: " + fileSource);
        }
        if (!file.isFile()) {
            throw new Exception("Not a file: " + fileSource);
        }

        int count = 0;
        // try-with-resources: the reader is closed on the way out of the block
        // whether the loop ended, returned or threw. A plain try/catch with no
        // finally leaks the file handle on every exception, and on Windows a
        // leaked handle also keeps the file locked - the next run of the same
        // program then fails to open a file that is "already in use" by a
        // process that has long since moved on.
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                for (String token : line.split("[^A-Za-z0-9]+")) {
                    if (token.equals(word)) {
                        count++;
                    }
                }
            }
        } catch (IOException e) {
            throw new Exception("Cannot read file: " + fileSource);
        }
        return count;
    }

    /**
     * The names of the files in `source` whose content contains `word`.
     *
     * Only the folder itself is searched, not its sub-folders. The brief asks
     * for "file name" and nothing else, and a bare name is ambiguous the moment
     * two folders both hold a readme.txt - a recursive walk would have to print
     * paths, which is a different screen from the one the brief draws.
     *
     * The result is sorted before it is returned. File.listFiles() hands back
     * whatever order the file system feels like, which differs between
     * machines and even between runs after files are rewritten; a report that
     * reshuffles itself cannot be diffed, and cannot be trusted.
     */
    public List<String> getFileNameContainsWordInDirectory(String source, String word) throws Exception {
        if (word == null || word.isEmpty()) {
            throw new Exception("Word must not be blank.");
        }
        File folder = new File(source);
        if (!folder.exists()) {
            throw new Exception("Folder not found: " + source);
        }
        if (!folder.isDirectory()) {
            throw new Exception("Not a folder: " + source);
        }
        File[] children = folder.listFiles();
        if (children == null) {
            throw new Exception("Cannot read folder: " + source);
        }

        List<String> names = new ArrayList<>();
        for (File child : children) {
            if (child.isFile() && countWordInFile(child.getPath(), word) > 0) {
                names.add(child.getName());
            }
        }
        Collections.sort(names);
        return names;
    }
}
'''

P0077_SAMPLE = '''package utils;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * The demo folder the program searches.
 *
 * An assignment about searching files that ships with no files cannot be
 * marked: the first thing a marker does is press 1, and the first thing the
 * program should not do is ask for a path that exists only on the author's
 * machine. So the project carries its own data and rebuilds it on start if it
 * is missing.
 *
 * It is deliberately silent when the folder is already there. The one-line
 * notice therefore appears on the FIRST run of a fresh project and never
 * again - which is also the proof that what run one wrote, run two found.
 */
public class SampleData {

    private static final String FOLDER = "data";
    private static final String EXT = ".txt";

    private SampleData() {
    }

    public static void ensure() {
        File folder = new File(FOLDER);
        if (folder.isDirectory()) {
            return;
        }
        if (!folder.mkdirs()) {
            System.out.println("Cannot create sample folder: " + FOLDER);
            return;
        }
        // "latest" and "Test" are not accidents: they are the two cases that
        // separate a whole-word case-sensitive count from a naive one.
        write(new File(folder, "notes" + EXT),
                "The test plan is ready.",
                "test, test and Test again.",
                "Testing is not the same word as test.",
                "The latest test result is here.");
        write(new File(folder, "readme" + EXT),
                "Run the test suite before shipping.",
                "See the notes file for details.");
        write(new File(folder, "report" + EXT),
                "Quarterly report.",
                "This file mentions no keyword at all.");
        System.out.println("Sample folder created: " + FOLDER);
    }

    private static void write(File file, String... lines) {
        try (PrintWriter writer = new PrintWriter(file)) {
            for (String line : lines) {
                writer.println(line);
            }
        } catch (IOException e) {
            System.out.println("Cannot write " + file.getName());
        }
    }
}
'''

P0077_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner over System.in, never a second one: two Scanners on the
 * same stream fight over the same buffer, and the loser silently skips a line.
 * The constructor is private because this class has no state worth
 * instantiating - it is a set of functions, not an object.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please choose from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /**
     * Reads a line and trims it - and returns it even when it is empty.
     *
     * Refusing a blank here would be the easy fix and the wrong one: the brief
     * gives countWordInFile the job of validating its own arguments, and a
     * method that can only ever be called with good arguments has never had its
     * guard clause tested. The blank word is allowed through so that the guard
     * is the thing that answers.
     */
    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }
}
'''

P0077_MAIN = '''package ui;

import bo.WordSearcher;
import java.util.List;
import utils.SampleData;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * Every message the brief's screen shows is reproduced character for
 * character, including "Bout:" - see the walkthrough. The try/catch lives
 * here and only here: bo throws, ui explains.
 */
public class Main {

    public static void main(String[] args) {
        SampleData.ensure();
        WordSearcher searcher = new WordSearcher();

        boolean running = true;
        while (running) {
            System.out.println("============ Word Program =========");
            System.out.println("1. Count Word In File");
            System.out.println("2. Find File By Word");
            System.out.println("3. Exit");

            int choice = Validator.getInt("Your choice: ", 1, 3);
            switch (choice) {
                case 1:
                    countWord(searcher);
                    break;
                case 2:
                    findFile(searcher);
                    break;
                default:
                    running = false;
            }
        }
    }

    private static void countWord(WordSearcher searcher) {
        System.out.println("-------- Count Word --------");
        String path = Validator.getString("Enter Path:");
        String word = Validator.getString("Enter Word:");
        try {
            System.out.println("Bout: " + searcher.countWordInFile(path, word));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void findFile(WordSearcher searcher) {
        System.out.println("-------- Find File By Word --------");
        String path = Validator.getString("Enter Path:");
        String word = Validator.getString("Enter Word:");
        try {
            List<String> names = searcher.getFileNameContainsWordInDirectory(path, word);
            System.out.println("------------ File Name ------------");
            for (String name : names) {
                System.out.println(name);
            }
            // An empty report under a header looks like a crash. Say so.
            if (names.isEmpty()) {
                System.out.println("(no file contains this word)");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''


solution(
    'J1.S.P0077',
    title_vi='Đếm từ trong tệp và tìm tệp theo nội dung',
    files=[('src/bo/WordSearcher.java', P0077_SEARCHER),
           ('src/utils/SampleData.java', P0077_SAMPLE),
           ('src/utils/Validator.java', P0077_VALIDATOR),
           ('src/ui/Main.java', P0077_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 builds the sample folder, then walks every case that matters:
        # the same file counted for "test", "Test" and "TEST"; a blank word; a
        # file that does not exist; a folder passed where a file was asked for;
        # then the directory search, case-sensitive, empty, and on a bad folder.
        ('1\ndata/notes.txt\ntest\n'
         '1\ndata/notes.txt\nTest\n'
         '1\ndata/notes.txt\nTEST\n'
         '1\ndata/notes.txt\n\n'
         '1\ndata/nosuch.txt\ntest\n'
         '1\ndata\ntest\n'
         '2\ndata\ntest\n'
         '2\ndata\nTest\n'
         '2\ndata\nzebra\n'
         '2\nnosuchfolder\ntest\n'
         '3\n', '''Sample folder created: data
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Bout: 5
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Bout: 1
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Bout: 0
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Word must not be blank.
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:File not found: data/nosuch.txt
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Not a file: data
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Find File By Word --------
Enter Path:Enter Word:------------ File Name ------------
notes.txt
readme.txt
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Find File By Word --------
Enter Path:Enter Word:------------ File Name ------------
notes.txt
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Find File By Word --------
Enter Path:Enter Word:------------ File Name ------------
(no file contains this word)
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Find File By Word --------
Enter Path:Enter Word:Folder not found: nosuchfolder
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: '''),
        # Run 1 is a NEW process. It never creates anything - so every answer it
        # gives is read from files the previous process left on disk. The
        # missing "Sample folder created" line is the proof.
        ('2\ndata\ntest\n'
         '1\ndata/readme.txt\ntest\n'
         '3\n', '''============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Find File By Word --------
Enter Path:Enter Word:------------ File Name ------------
notes.txt
readme.txt
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: -------- Count Word --------
Enter Path:Enter Word:Bout: 1
============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit
Your choice: '''),
    ],
    explain_en='''<p><strong>The one decision this assignment turns on: what is "a word".</strong> The
brief says "count the number of occurrences of a word in a file" and then stops, which leaves three
different programs you could hand in. This one counts <em>whole words</em>, <em>case-sensitively</em>.
The demo data is built to make both halves visible: <code>notes.txt</code> contains
<code>The latest test result</code> and <code>test, test and Test again.</code> — so
<code>test</code> answers <strong>5</strong>, <code>Test</code> answers <strong>1</strong>, and
<code>TEST</code> answers <strong>0</strong>. A substring counter would have said 6 for
<code>test</code>, because "la<em>test</em>" contains the letters. Say which one you built at the
defence; being unable to say is the failure, not choosing either rule.</p>
<p><strong>Why the empty search word is refused rather than tolerated.</strong> It is not politeness.
The obvious substring implementation is <code>while ((i = line.indexOf(word, i)) >= 0) { count++; i +=
word.length(); }</code> — and with an empty word <code>word.length()</code> is 0, so <code>i</code>
never advances and the program hangs forever, at 100% CPU, with no output. The token version here does
not hang; it would quietly return 0, which is arguably worse, because a wrong answer that looks like an
answer survives testing. So <code>countWordInFile</code> refuses on its first line and the screen prints
<code>Word must not be blank.</code></p>
<p><strong>The two methods share one definition of a match.</strong>
<code>getFileNameContainsWordInDirectory</code> is written on top of <code>countWordInFile</code>, not
beside it. If each decided independently what a hit was, option 1 could report <code>Bout: 0</code> for a
file option 2 had just listed, and both answers would look defensible. Reuse here is not about saving
lines — it is about making disagreement impossible. The scripted runs prove it: searching the folder for
<code>Test</code> returns only <code>notes.txt</code>, exactly the one file whose count for
<code>Test</code> is non-zero.</p>
<p><strong>The result list is sorted, and that is not cosmetic.</strong>
<code>File.listFiles()</code> returns whatever order the file system hands over — different on macOS,
Linux and Windows, and capable of changing on the same machine after a file is rewritten. An unsorted
report cannot be compared against anything, including yesterday's run of itself. One
<code>Collections.sort</code> makes the output a fact rather than a coincidence.</p>
<p><strong>Every stream is closed by try-with-resources.</strong> The reader is released on the way out
of the block whether the loop finished, returned or threw. Without it — a plain <code>try/catch</code>
and no <code>finally</code> — every failed read leaks a file handle. On a directory search that opens
one file per entry, the leak scales with the folder; and on Windows an unclosed handle also holds a lock,
so the next run of the same program cannot open a file that is "in use" by a process that exited minutes
ago. This is the single most common invisible bug in LAB211 file assignments.</p>
<p><strong>Why the search is not recursive.</strong> The brief's screen prints
<code>file name 1.txt</code> — a bare name, no path. The moment the search descends into sub-folders,
two different <code>readme.txt</code> files produce two identical lines and the report stops being
useful. Recursion would force the output to become paths, which is a different screen from the one the
brief draws. So: this folder only, files only, directories skipped.</p>
<p><strong>Why the project ships its own data.</strong> The brief's example path is
<code>d:\\text.txt</code>. That file exists on nobody's machine, so a marker who presses 1 gets an error
before seeing anything work. <code>SampleData</code> creates a <code>data</code> folder with three text
files if it is not already there — and prints its one-line notice only when it actually creates it.
That silence is the verification trick: the second scripted run is a brand-new JVM that creates nothing,
and it still answers questions about <code>data/notes.txt</code>. What it reads, the previous process
wrote. That is the only real proof that the file half of a file assignment works.</p>
<p><strong>Where the brief contradicts itself, and what was done about it.</strong> The screen prints
<code>Bout: 12</code> for the count. "Bout" is not a word in this problem; it is almost certainly a typo
for "Count". The Guidelines say nothing about the message, so the screen is the only specification there
is — and where the marker diffs the screen character by character, the screen wins. The program prints
<code>Bout: </code>. Mention it out loud at the defence: you noticed, and you copied the contract rather
than correcting it. The same sheet also writes <code>Enter Word:test</code> in one panel and
<code>Enter Word: content</code> in another; the space is not reproducible as a prompt (it may simply be
what the user typed), so both prompts are <code>Enter Word:</code> with no trailing space.</p>
<p><strong>How it was verified.</strong> Eleven scripted operations across two processes. Option 1 on the
same file for <code>test</code>, <code>Test</code> and <code>TEST</code> (5, 1, 0 — the case rule,
demonstrated rather than asserted); a blank word; a file that does not exist; a folder handed in where a
file was expected. Then option 2 for <code>test</code> (notes.txt, readme.txt), <code>Test</code>
(notes.txt only), <code>zebra</code> (nothing found, and the program says so instead of printing a bare
header), and a folder that does not exist. Then a second JVM repeats two of them with no setup at
all.</p>
<p><strong>What an examiner will ask.</strong> "Is your search case-sensitive?" — yes, and here is the
run that shows it. "What happens if I just press Enter for the word?" — it is refused, and here is why
the naive implementation would have hung instead. "Where do you close the file?" — nowhere, explicitly;
try-with-resources does it, including when an exception is thrown.</p>''',
    explain_vi='''<p><strong>Quyết định mà cả bài này xoay quanh: thế nào là "một từ".</strong> Đề viết
"đếm số lần xuất hiện của một từ trong tệp" rồi dừng, mà như thế thì có tới ba chương trình khác nhau đều
nộp được. Bản này đếm <em>trọn từ</em> và <em>phân biệt hoa thường</em>. Dữ liệu mẫu được dựng để nhìn
thấy cả hai điều đó: <code>notes.txt</code> có dòng <code>The latest test result</code> và
<code>test, test and Test again.</code> — nên <code>test</code> ra <strong>5</strong>,
<code>Test</code> ra <strong>1</strong>, còn <code>TEST</code> ra <strong>0</strong>. Cách đếm chuỗi con
sẽ trả 6 cho <code>test</code>, vì "la<em>test</em>" có chứa đủ bốn chữ cái. Khi bảo vệ hãy nói rõ bạn
làm theo luật nào; không nói được mới là trượt, chứ chọn luật nào cũng được.</p>
<p><strong>Vì sao từ khoá rỗng bị từ chối chứ không được "chiều".</strong> Không phải vì lịch sự. Cách
cài đặt bằng chuỗi con quen thuộc là <code>while ((i = line.indexOf(word, i)) >= 0) { count++; i +=
word.length(); }</code> — với từ rỗng thì <code>word.length()</code> bằng 0, <code>i</code> không bao giờ
tiến lên, và chương trình treo vĩnh viễn, ăn 100% CPU, không in ra gì. Bản tách token ở đây không treo;
nó lặng lẽ trả 0, mà điều đó còn tệ hơn, vì một đáp án sai trông giống một đáp án thì sống sót qua khâu
kiểm thử. Nên <code>countWordInFile</code> từ chối ngay dòng đầu và màn hình in
<code>Word must not be blank.</code></p>
<p><strong>Hai phương thức dùng chung một định nghĩa "khớp".</strong>
<code>getFileNameContainsWordInDirectory</code> được viết <em>trên</em> <code>countWordInFile</code>, chứ
không viết song song. Nếu mỗi bên tự quyết thế nào là khớp, chức năng 1 có thể báo <code>Bout: 0</code>
cho đúng tệp mà chức năng 2 vừa liệt kê, và cả hai câu trả lời đều nghe có lý. Dùng lại ở đây không phải
để tiết kiệm dòng — mà để hai bên <em>không thể</em> mâu thuẫn. Các lần chạy kiểm chứng điều đó: tìm
<code>Test</code> trong thư mục chỉ ra <code>notes.txt</code>, đúng là tệp duy nhất có số đếm
<code>Test</code> khác 0.</p>
<p><strong>Danh sách kết quả được sắp xếp, và đó không phải trang trí.</strong>
<code>File.listFiles()</code> trả về theo thứ tự tuỳ hệ tệp — khác nhau giữa macOS, Linux, Windows, và có
thể đổi ngay trên cùng một máy sau khi một tệp bị ghi lại. Một báo cáo không sắp xếp thì không so được
với bất cứ thứ gì, kể cả với chính nó hôm qua. Một lệnh <code>Collections.sort</code> biến kết quả từ
chuyện may rủi thành một sự thật.</p>
<p><strong>Mọi luồng đều đóng bằng try-with-resources.</strong> Reader được giải phóng khi ra khỏi khối
lệnh, dù vòng lặp kết thúc bình thường, return, hay ném ngoại lệ. Không có nó — chỉ
<code>try/catch</code> mà không <code>finally</code> — thì mỗi lần đọc lỗi là rò một file handle. Với
chức năng tìm theo thư mục, mỗi tệp mở một handle, nên rò rỉ tăng theo kích thước thư mục; và trên
Windows handle chưa đóng còn giữ khoá tệp, khiến lần chạy sau không mở được tệp đang "bị chiếm" bởi một
tiến trình đã thoát từ lâu. Đây là lỗi vô hình phổ biến nhất trong các bài tệp của LAB211.</p>
<p><strong>Vì sao không tìm đệ quy vào thư mục con.</strong> Màn hình mẫu in <code>file name 1.txt</code>
— chỉ tên trần, không có đường dẫn. Hễ tìm xuống thư mục con là hai tệp <code>readme.txt</code> khác nhau
cho ra hai dòng giống hệt nhau và báo cáo hết còn dùng được. Muốn đệ quy thì phải in đường dẫn, và đó là
một màn hình khác với màn hình đề vẽ. Nên: chỉ thư mục này, chỉ tệp, bỏ qua thư mục con.</p>
<p><strong>Vì sao project tự mang dữ liệu theo.</strong> Đường dẫn trong ví dụ của đề là
<code>d:\\text.txt</code>. Tệp đó không tồn tại trên máy ai cả, nên người chấm bấm 1 là gặp lỗi trước khi
kịp thấy gì chạy được. <code>SampleData</code> tạo thư mục <code>data</code> với ba tệp văn bản nếu chưa
có — và chỉ in dòng thông báo khi nó thực sự tạo. Chính sự im lặng đó là mẹo kiểm chứng: lần chạy thứ hai
là một JVM hoàn toàn mới, không tạo gì cả, mà vẫn trả lời được các câu hỏi về <code>data/notes.txt</code>.
Thứ nó đọc là thứ tiến trình trước đã ghi. Đó là bằng chứng thật duy nhất cho phần "tệp" của một bài về
tệp.</p>
<p><strong>Chỗ đề tự mâu thuẫn, và đã xử lý thế nào.</strong> Màn hình in <code>Bout: 12</code> cho kết
quả đếm. "Bout" không phải một từ có nghĩa trong bài này; gần như chắc chắn là lỗi gõ của "Count". Phần
Hướng dẫn không nói gì về thông điệp này, nên màn hình là đặc tả duy nhất đang có — và ở chỗ người chấm
so từng ký tự thì màn hình thắng. Chương trình in <code>Bout: </code>. Hãy nói thẳng khi bảo vệ: bạn có
nhận ra, và bạn chép theo hợp đồng chứ không tự sửa. Cũng tờ đề đó viết <code>Enter Word:test</code> ở
khung này và <code>Enter Word: content</code> ở khung kia; dấu cách đó không tái lập được (rất có thể chỉ
là thứ người dùng gõ vào), nên cả hai lời nhắc đều là <code>Enter Word:</code> không có dấu cách
cuối.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Mười một thao tác kịch bản trải qua hai tiến trình. Chức năng
1 trên cùng một tệp với <code>test</code>, <code>Test</code> và <code>TEST</code> (5, 1, 0 — luật hoa
thường được <em>chứng minh</em> chứ không phải được <em>tuyên bố</em>); một từ rỗng; một tệp không tồn
tại; một thư mục đưa vào chỗ đáng lẽ là tệp. Rồi chức năng 2 với <code>test</code> (notes.txt,
readme.txt), <code>Test</code> (chỉ notes.txt), <code>zebra</code> (không thấy gì, và chương trình nói ra
thay vì in một cái tiêu đề trống), và một thư mục không tồn tại. Sau đó một JVM thứ hai lặp lại hai thao
tác mà không hề chuẩn bị gì.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Tìm kiếm có phân biệt hoa thường không?" — có, và đây là lần
chạy chứng minh. "Nếu tôi chỉ bấm Enter ở ô từ khoá thì sao?" — bị từ chối, và đây là lý do bản cài đặt
ngây thơ sẽ treo. "Bạn đóng tệp ở đâu?" — không ở đâu cả, một cách có chủ ý; try-with-resources làm việc
đó, kể cả khi có ngoại lệ.</p>''',
    hints_en=[
        'Copy the two signatures from the Guidelines exactly: countWordInFile returns int, '
        'getFileNameContainsWordInDirectory returns List<String>, both throw Exception.',
        'Decide whether a match is a whole word or a substring, and whether case matters — then '
        'be able to demonstrate your choice on one file.',
        'Reject a blank search word on the first line: the indexOf version of this loop never '
        'advances on an empty word and hangs forever.',
        'Write the folder search on top of the counter, so the two options can never disagree '
        'about what "contains this word" means.',
        'Sort the file names before returning them — File.listFiles() order is not stable — and '
        'read every file inside try-with-resources.',
    ],
    hints_vi=[
        'Chép nguyên hai chữ ký trong phần Hướng dẫn: countWordInFile trả int, '
        'getFileNameContainsWordInDirectory trả List<String>, cả hai throws Exception.',
        'Chốt xem "khớp" là trọn từ hay chuỗi con, có phân biệt hoa thường không — rồi phải '
        'chứng minh được lựa chọn đó trên một tệp cụ thể.',
        'Từ chối từ khoá rỗng ngay dòng đầu: vòng lặp kiểu indexOf không tiến lên với từ rỗng '
        'và sẽ treo vĩnh viễn.',
        'Viết hàm tìm theo thư mục dựa trên hàm đếm, để hai chức năng không thể hiểu khác nhau '
        'về chuyện "tệp có chứa từ này".',
        'Sắp xếp danh sách tên tệp trước khi trả về — thứ tự của File.listFiles() không ổn định — '
        'và đọc mọi tệp trong try-with-resources.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0078 — Config-driven file copier (100 LOC)
# ════════════════════════════════════════════════════════════════

P0078_CONFIG = '''package entity;

import java.io.Serializable;

/**
 * The three settings in config.properties, as one object.
 *
 * The brief's four method signatures all take or return a Config, which is
 * the point: readFileConfig, createFileConfig, checkConfig and copyFile all
 * talk about the same thing, so passing three loose Strings around would give
 * four chances to swap two of them in the argument list - and swapping source
 * with destination is a mistake that copies in the wrong direction and looks
 * like it worked.
 */
public class Config implements Serializable {

    private String copyFolder;
    private String dataType;
    private String path;

    public Config() {
        this("", "", "");
    }

    public Config(String copyFolder, String dataType, String path) {
        this.copyFolder = copyFolder;
        this.dataType = dataType;
        this.path = path;
    }

    public String getCopyFolder() {
        return copyFolder;
    }

    public void setCopyFolder(String copyFolder) {
        this.copyFolder = copyFolder;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Override
    public String toString() {
        return "COPY_FOLDER=" + copyFolder + ", DATA_TYPE=" + dataType + ", PATH=" + path;
    }
}
'''

P0078_EXCEPTION = '''package utils;

/**
 * The checked exception the Guidelines name.
 *
 * It carries nothing but a message, and that is on purpose: every message it
 * can hold is one of the fixed strings from the brief's error screen, so the
 * UI never has to translate an exception into a sentence - it prints
 * getMessage() and adds "System shutdown".
 *
 * It extends Exception, not RuntimeException. Checked is the right choice for
 * something a caller is expected to handle: a config file that is wrong is an
 * ordinary, expected outcome of running this program, not a bug in it.
 */
public class ExceptionHandle extends Exception {

    public ExceptionHandle(String message) {
        super(message);
    }
}
'''

P0078_MANAGER = '''package bo;

import entity.Config;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import utils.ExceptionHandle;

/**
 * The config file and the copy job. It never prints; it throws, or returns.
 *
 * All four methods the Guidelines name live here with the signatures the
 * Guidelines give, including copyFile's missing `throws` - see the walkthrough
 * for what that costs.
 */
public class CopyManager {

    private static final String CONFIG_FILE = "config.properties";
    private static final String KEY_COPY_FOLDER = "COPY_FOLDER";
    private static final String KEY_DATA_TYPE = "DATA_TYPE";
    private static final String KEY_PATH = "PATH";
    private static final int BUFFER = 8192;

    public boolean isConfigExisted() {
        return new File(CONFIG_FILE).isFile();
    }

    /**
     * Fills `config` from config.properties.
     *
     * Parsed by hand, splitting on the FIRST '=', rather than with
     * java.util.Properties. Properties.load() treats a backslash as an escape
     * character, and the brief's own example value is a Windows path: the line
     * COPY_FOLDER=D:[backslash]Data comes back as "D:Data", because that is
     * not a recognised escape and the backslash is simply eaten. The bug is
     * silent - the file looks right, the program says "Can't find folder
     * Source", and the student spends an evening reading the wrong method.
     * Splitting on the first '=' keeps the value exactly as written; splitting
     * on the FIRST one also matters because a path may contain one, and
     * String.split("=") would throw the tail away.
     */
    public Config readFileConfig(Config config) throws ExceptionHandle {
        try (BufferedReader reader = new BufferedReader(new FileReader(CONFIG_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                int separator = line.indexOf('=');
                if (separator < 0) {
                    continue;
                }
                String key = line.substring(0, separator).trim();
                String value = line.substring(separator + 1).trim();
                if (KEY_COPY_FOLDER.equalsIgnoreCase(key)) {
                    config.setCopyFolder(value);
                } else if (KEY_DATA_TYPE.equalsIgnoreCase(key)) {
                    config.setDataType(value);
                } else if (KEY_PATH.equalsIgnoreCase(key)) {
                    config.setPath(value);
                }
            }
        } catch (IOException e) {
            throw new ExceptionHandle("Can't read File Configure");
        }
        return config;
    }

    /** Writes the three keys back out in the order the brief lists them. */
    public void createFileConfig(Config config) throws ExceptionHandle {
        try (PrintWriter writer = new PrintWriter(new FileWriter(CONFIG_FILE))) {
            writer.println(KEY_COPY_FOLDER + "=" + config.getCopyFolder());
            writer.println(KEY_DATA_TYPE + "=" + config.getDataType());
            writer.println(KEY_PATH + "=" + config.getPath());
        } catch (IOException e) {
            throw new ExceptionHandle("File Configure cannot create");
        }
    }

    /**
     * Every rule the brief's error screen lists, in the order it lists them,
     * and one it does not.
     *
     * It throws on the FIRST problem rather than collecting all of them. The
     * error box in the brief shows six messages together, but they are a
     * catalogue, not a screen: "Folder Source is not input" and "Can't find
     * folder Source" cannot both be true at once. And the checks depend on each
     * other - there is no point testing whether a blank folder exists.
     *
     * The last check is not in the brief at all, and it is the one that
     * prevents data loss. If source and destination are the same folder, the
     * copy opens each file for reading and for writing at the same moment;
     * `new FileOutputStream(file)` truncates it to zero length before the first
     * byte is read, so the file is destroyed and the program reports success.
     * Measured, not guessed: an 11-byte file copied onto itself this way ends
     * up 11 -> 0 bytes.
     */
    public void checkConfig(Config config) throws ExceptionHandle {
        if (isBlank(config.getCopyFolder())) {
            throw new ExceptionHandle("Folder Source is not input");
        }
        File source = new File(config.getCopyFolder());
        if (!source.isDirectory()) {
            throw new ExceptionHandle("Can't find folder Source");
        }
        if (isBlank(config.getDataType())) {
            throw new ExceptionHandle("Data type is not input");
        }
        if (isBlank(config.getPath())) {
            throw new ExceptionHandle("Folder Destination is not input");
        }
        File target = new File(config.getPath());
        // The brief says: not existing -> create it. mkdirs(), not mkdir():
        // "D:/Copy Data/2026" needs the parent made too, and mkdir() returns
        // false without saying why.
        if (!target.isDirectory() && !target.mkdirs()) {
            throw new ExceptionHandle("Can't make folder Destination");
        }
        if (isSameFolder(source, target)) {
            throw new ExceptionHandle("Folder Source and Folder Destination are the same");
        }
    }

    /**
     * Copies every file in COPY_FOLDER whose extension is listed in DATA_TYPE,
     * and returns the names that arrived intact.
     *
     * The signature comes from the Guidelines and has no `throws`, so a
     * per-file failure cannot be reported by throwing. It is reported by
     * absence: a file that could not be read, written, or that did not survive
     * verification is simply not in the returned list. checkConfig has already
     * proved the destination is a writable directory, so this is a narrow gap -
     * but it is a gap, and it is the signature's, not the program's.
     */
    public List<String> copyFile(Config config) {
        List<String> copied = new ArrayList<>();
        File source = new File(config.getCopyFolder());
        File target = new File(config.getPath());
        List<String> extensions = parseDataType(config.getDataType());

        File[] children = source.listFiles();
        if (children == null) {
            return copied;
        }
        Arrays.sort(children);
        for (File child : children) {
            if (!child.isFile() || !matches(child.getName(), extensions)) {
                continue;
            }
            File destination = new File(target, child.getName());
            // The destination file may already exist - on the second run it
            // always does. It is overwritten, not skipped: this program is
            // driven by a config file with no confirmation step in it, and a
            // copier that refuses to refresh a file is useless the second time
            // it runs. The copy is then verified byte for byte, so an
            // overwrite that half-succeeded cannot be reported as a success.
            if (copyOne(child, destination) && sameContent(child, destination)) {
                copied.add(child.getName());
            }
        }
        Collections.sort(copied);
        return copied;
    }

    /**
     * The proof behind the choice of stream, runnable from the menu.
     *
     * Writes 256 bytes - every value 0x00 to 0xFF - then copies the file twice:
     * once with FileInputStream/FileOutputStream, once with
     * FileReader/FileWriter. The reader decodes bytes into characters using the
     * platform charset and the writer encodes them back; anything that is not
     * valid in that charset does not survive the round trip. The byte streams
     * never look at the content at all.
     *
     * This is not part of the marked specification. It is here because the
     * entire correctness of a copy program rests on one claim about streams,
     * and a claim you can run is worth more than a claim you assert.
     */
    public List<String> streamTest() {
        List<String> report = new ArrayList<>();
        File source = new File("streamtest.bin");
        File byteCopy = new File("streamtest-byte.bin");
        File charCopy = new File("streamtest-char.bin");
        try {
            byte[] original = new byte[256];
            for (int i = 0; i < original.length; i++) {
                original[i] = (byte) i;
            }
            try (OutputStream out = new FileOutputStream(source)) {
                out.write(original);
            }

            // The right way: bytes in, the same bytes out.
            try (InputStream in = new BufferedInputStream(new FileInputStream(source));
                    OutputStream out = new BufferedOutputStream(new FileOutputStream(byteCopy))) {
                byte[] buffer = new byte[BUFFER];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
            }

            // The wrong way: bytes decoded to text and encoded back again.
            try (Reader in = new FileReader(source);
                    Writer out = new FileWriter(charCopy)) {
                char[] buffer = new char[BUFFER];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    out.write(buffer, 0, read);
                }
            }

            report.add("Source           : " + source.getName() + ", " + source.length() + " bytes");
            report.add("Byte stream copy : " + byteCopy.length() + " bytes, " + verdict(source, byteCopy));
            report.add("Char stream copy : " + charCopy.length() + " bytes, " + verdict(source, charCopy));
        } catch (IOException e) {
            report.add("Stream test failed: " + e.getMessage());
        }
        return report;
    }

    // ── helpers ──────────────────────────────────────────────────

    private String verdict(File a, File b) throws IOException {
        int difference = firstDifference(a, b);
        return difference < 0
                ? "identical to the source"
                : "DIFFERENT - first difference at byte " + difference;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    /**
     * Are these two paths the same folder on disk?
     *
     * getCanonicalFile() and not equals() on the raw paths: "source" and
     * "./source" and "dest/../source" are three different Strings and one
     * directory. Comparing the text would let the dangerous case through.
     */
    private boolean isSameFolder(File a, File b) throws ExceptionHandle {
        try {
            return a.getCanonicalFile().equals(b.getCanonicalFile());
        } catch (IOException e) {
            throw new ExceptionHandle("Can't find folder Source");
        }
    }

    /**
     * "*.CSV,*.WAV" -> [".csv", ".wav"].
     *
     * Lower-cased, and matched lower-cased, so the config may say *.CSV while
     * the files on disk are called data1.csv - which is exactly what the
     * brief's own two screens do. Windows would not have noticed the
     * difference; Linux would have copied nothing and said nothing.
     */
    private List<String> parseDataType(String dataType) {
        List<String> extensions = new ArrayList<>();
        for (String part : dataType.split(",")) {
            String extension = part.trim().toLowerCase();
            if (extension.startsWith("*")) {
                extension = extension.substring(1);
            }
            if (!extension.isEmpty() && !extension.startsWith(".")) {
                extension = "." + extension;
            }
            if (!extension.isEmpty()) {
                extensions.add(extension);
            }
        }
        return extensions;
    }

    private boolean matches(String fileName, List<String> extensions) {
        String lower = fileName.toLowerCase();
        for (String extension : extensions) {
            if (lower.endsWith(extension)) {
                return true;
            }
        }
        return false;
    }

    /**
     * One file, copied as BYTES.
     *
     * Not FileReader/FileWriter. A character stream decodes the bytes with the
     * platform charset on the way in and encodes them again on the way out;
     * anything that is not valid text in that charset is replaced by the
     * substitution character and never comes back. DATA_TYPE in this very
     * assignment lists *.WAV - audio - so the file the brief asks for is
     * exactly the file a character stream destroys. Bytes in, the same bytes
     * out, no interpretation.
     *
     * Both streams are opened in one try-with-resources: they are closed in
     * reverse order, always, including when write() throws half-way. Without
     * that, a failed copy leaves the output handle open, the buffered tail
     * unflushed, and on Windows the destination file locked against the next
     * attempt.
     */
    private boolean copyOne(File from, File to) {
        try (InputStream in = new BufferedInputStream(new FileInputStream(from));
                OutputStream out = new BufferedOutputStream(new FileOutputStream(to))) {
            byte[] buffer = new byte[BUFFER];
            int read;
            while ((read = in.read(buffer)) != -1) {
                out.write(buffer, 0, read);
            }
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private boolean sameContent(File a, File b) {
        try {
            return firstDifference(a, b) < 0;
        } catch (IOException e) {
            return false;
        }
    }

    /** Index of the first byte that differs, or -1 when the files are equal. */
    private int firstDifference(File a, File b) throws IOException {
        try (InputStream left = new BufferedInputStream(new FileInputStream(a));
                InputStream right = new BufferedInputStream(new FileInputStream(b))) {
            int index = 0;
            while (true) {
                int x = left.read();
                int y = right.read();
                if (x != y) {
                    return index;
                }
                if (x == -1) {
                    return -1;
                }
                index++;
            }
        }
    }
}
'''

P0078_SAMPLE = '''package utils;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.FileOutputStream;
import java.io.PrintWriter;

/**
 * The folder the program copies from.
 *
 * The brief's example is COPY_FOLDER=D:\\\\Data, which exists on nobody's
 * machine. So the project brings its own: two CSV files, one TXT that must NOT
 * be copied (it proves DATA_TYPE is actually filtering rather than being
 * ignored), and one WAV.
 *
 * The WAV is real binary - all 256 byte values, including the ones that are
 * not valid text in any charset. That is deliberate: DATA_TYPE in this
 * assignment lists *.WAV, so the correctness of the whole program depends on
 * copying it byte for byte, and a file made only of letters would let a
 * character-stream copy pass unnoticed.
 */
public class SampleData {

    private static final String FOLDER = "source";
    private static final String CSV = ".csv";
    private static final String TXT = ".txt";
    private static final String WAV = ".wav";

    private SampleData() {
    }

    public static void ensure() {
        File folder = new File(FOLDER);
        if (folder.isDirectory()) {
            return;
        }
        if (!folder.mkdirs()) {
            System.out.println("Cannot create sample folder: " + FOLDER);
            return;
        }
        writeText(new File(folder, "data1" + CSV), "id,name", "1,alpha");
        writeText(new File(folder, "data2" + CSV), "id,name", "2,beta");
        writeText(new File(folder, "notes" + TXT), "This file must NOT be copied.");
        writeBinary(new File(folder, "tone" + WAV));
        System.out.println("Sample folder created: " + FOLDER);
    }

    private static void writeText(File file, String... lines) {
        try (PrintWriter writer = new PrintWriter(file)) {
            for (String line : lines) {
                writer.println(line);
            }
        } catch (IOException e) {
            System.out.println("Cannot write " + file.getName());
        }
    }

    private static void writeBinary(File file) {
        byte[] bytes = new byte[256];
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) i;
        }
        try (OutputStream out = new FileOutputStream(file)) {
            out.write(bytes);
        } catch (IOException e) {
            System.out.println("Cannot write " + file.getName());
        }
    }
}
'''

P0078_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * getString() returns whatever was typed, including an empty line. Rejecting
 * blanks here would be the easy fix and the wrong one: the Guidelines make
 * checkConfig the place where a missing value is detected, and a checkConfig
 * that can never receive a blank is dead code that has never been tested. The
 * blank is allowed through so that the mandated method is the thing that
 * answers - and the scripted runs press exactly that.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please choose from " + min + " to " + max + ".");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }
}
'''

P0078_MAIN = '''package ui;

import bo.CopyManager;
import entity.Config;
import utils.ExceptionHandle;
import utils.SampleData;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * Every message is copied from the brief's diagram character for character:
 * "File Configure is not found!", "---- Input Configure File -----",
 * "---- Check Configure File -----", "File Configure cannot create",
 * "System shutdown", "Copy is running...",
 * "------------ File Name ------------", "Copy is finished...".
 *
 * The brief draws the menu box empty, so its contents are the one thing here
 * that is not dictated. Option 2 exists because a config file that stops the
 * program on a bad value would otherwise be unfixable without deleting it by
 * hand; option 3 is the stream demonstration - see the walkthrough for why a
 * copy program should carry its own proof.
 */
public class Main {

    public static void main(String[] args) {
        SampleData.ensure();
        CopyManager manager = new CopyManager();

        while (true) {
            System.out.println("============ Copy Program =========");
            System.out.println("1. Copy File");
            System.out.println("2. Input Configure File");
            System.out.println("3. Stream Test");
            System.out.println("4. Exit");

            int choice = Validator.getInt("Your choice: ", 1, 4);
            switch (choice) {
                case 1:
                    // "show error message and stop program" - the brief is
                    // explicit, so a failed check ends the run rather than
                    // dropping back to a menu that would fail the same way.
                    if (!copy(manager)) {
                        return;
                    }
                    break;
                case 2:
                    if (!inputConfig(manager)) {
                        return;
                    }
                    break;
                case 3:
                    System.out.println("-------- Stream Test --------");
                    for (String line : manager.streamTest()) {
                        System.out.println(line);
                    }
                    break;
                default:
                    return;
            }
        }
    }

    /** Read (or ask for) the config, check it, and run the copy. */
    private static boolean copy(CopyManager manager) {
        Config config = new Config();
        try {
            if (!manager.isConfigExisted()) {
                System.out.println("File Configure is not found!");
                ask(manager, config);
            } else {
                manager.readFileConfig(config);
            }
            System.out.println("---- Check Configure File -----");
            manager.checkConfig(config);
        } catch (ExceptionHandle e) {
            System.out.println(e.getMessage());
            System.out.println("System shutdown");
            return false;
        }

        System.out.println("Copy is running...");
        System.out.println("------------ File Name ------------");
        for (String name : manager.copyFile(config)) {
            System.out.println(name);
        }
        System.out.println("Copy is finished...");
        return true;
    }

    private static boolean inputConfig(CopyManager manager) {
        try {
            ask(manager, new Config());
        } catch (ExceptionHandle e) {
            System.out.println(e.getMessage());
            System.out.println("System shutdown");
            return false;
        }
        return true;
    }

    private static void ask(CopyManager manager, Config config) throws ExceptionHandle {
        System.out.println("---- Input Configure File -----");
        config.setCopyFolder(Validator.getString("Copy Folder:"));
        config.setDataType(Validator.getString("Data Type:"));
        config.setPath(Validator.getString("Path:"));
        manager.createFileConfig(config);
    }
}
'''


def _p0078_stream_check(out):
    """The stream test is checked by what it PROVES, not by its exact text.

    The size of the character-stream copy depends on the platform charset, so
    diffing it would be diffing the JVM rather than the program. What must hold
    on any charset worth the name is the relationship: the byte-stream copy is
    identical to a 256-byte binary source, and the character-stream copy is not.
    """
    if not re.search(r'^Source\s+: streamtest\.bin, 256 bytes$', out, re.M):
        return False, 'the 256-byte binary source was not written'
    if not re.search(r'^Byte stream copy : 256 bytes, identical to the source$', out, re.M):
        return False, 'the byte-stream copy is not identical to the source'
    m = re.search(r'^Char stream copy : (\d+) bytes, (.+)$', out, re.M)
    if not m:
        return False, 'the character-stream copy was not reported'
    if 'DIFFERENT' not in m.group(2):
        return False, ('the character-stream copy came back identical - it must not; '
                       f'reported: {m.group(2)}')
    return True, ''


solution(
    'J1.S.P0078',
    title_vi='Chương trình sao chép tệp theo tệp cấu hình',
    files=[('src/entity/Config.java', P0078_CONFIG),
           ('src/bo/CopyManager.java', P0078_MANAGER),
           ('src/utils/ExceptionHandle.java', P0078_EXCEPTION),
           ('src/utils/SampleData.java', P0078_SAMPLE),
           ('src/utils/Validator.java', P0078_VALIDATOR),
           ('src/ui/Main.java', P0078_MAIN)],
    main_class='ui.Main',
    runs=[
        # 0: no config file at all -> the program asks for one, writes it, and
        #    then refuses it because the source folder does not exist.
        ('1\nnosuchfolder\n*.CSV,*.WAV\ndest\n', '''Sample folder created: source
============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: File Configure is not found!
---- Input Configure File -----
Copy Folder:Data Type:Path:---- Check Configure File -----
Can't find folder Source
System shutdown'''),
        # 1: a NEW process. The config file written by run 0 is still there, so
        #    nothing is asked - and the same error comes back. That the program
        #    did not prompt is the proof the file persisted.
        ('1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Can't find folder Source
System shutdown'''),
        # 2: all three values blank -> "Folder Source is not input"
        ('2\n\n\n\n1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Folder Source is not input
System shutdown'''),
        # 3: no data type -> "Data type is not input"
        ('2\nsource\n\ndest\n1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Data type is not input
System shutdown'''),
        # 4: no destination -> "Folder Destination is not input"
        ('2\nsource\n*.CSV,*.WAV\n\n1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Folder Destination is not input
System shutdown'''),
        # 5: a destination that cannot be made (its parent is a FILE)
        ('2\nsource\n*.CSV,*.WAV\nsource/data1.csv/nested\n1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Can't make folder Destination
System shutdown'''),
        # 6: a good config -> dest is created and three files are copied;
        #    notes.txt is not, which proves DATA_TYPE is really filtering.
        ('2\nsource\n*.CSV,*.WAV\ndest\n1\n4\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Copy is running...
------------ File Name ------------
data1.csv
data2.csv
tone.wav
Copy is finished...
============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: '''),
        # 7: run it again with the destination files ALREADY there. Same list:
        #    an existing destination is overwritten, and each copy is verified
        #    byte for byte afterwards.
        ('1\n4\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Copy is running...
------------ File Name ------------
data1.csv
data2.csv
tone.wav
Copy is finished...
============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: '''),
        # 8: the stream demonstration - binary copied both ways, bytes compared.
        ('3\n4\n', _p0078_stream_check),
        # 9: source and destination the same folder -> refused before any file
        #    is opened for writing, because that would truncate it to 0 bytes.
        ('2\nsource\n*.CSV,*.WAV\nsource\n1\n', '''============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Input Configure File -----
Copy Folder:Data Type:Path:============ Copy Program =========
1. Copy File
2. Input Configure File
3. Stream Test
4. Exit
Your choice: ---- Check Configure File -----
Folder Source and Folder Destination are the same
System shutdown'''),
    ],
    explain_en='''<p><strong>A copy program is marked on what goes wrong, not on what goes right.</strong>
Reading bytes out of one file and into another is six lines. Everything else in this assignment — and
everything in its grade — is the list of ways it can fail: no config file, a config file with a value
missing, a source folder that is not there, a destination that has to be created, a destination that
cannot be created, and a destination that is the source. Each of those has its own message in the
brief's diagram, and each of them is pressed in a scripted run below.</p>
<p><strong>The choice of stream is the whole assignment, and it is provable.</strong> DATA_TYPE in the
brief is <code>*.CSV,*.WAV</code> — audio. Copy a WAV with <code>FileReader</code>/<code>FileWriter</code>
and it arrives broken: the reader decodes the bytes into characters using the platform charset, and the
writer encodes them back, so every byte that is not valid text in that charset is replaced by U+FFFD and
never returns. Menu option 3 runs the experiment rather than describing it — it writes a 256-byte file
containing every value from 0x00 to 0xFF and copies it both ways. Measured on this JVM (UTF-8):
<strong>byte stream 256 bytes, identical; character stream 512 bytes, first difference at byte
128</strong>. Every byte from 0x80 up came back as the three bytes <code>EF BF BD</code>. The first 128
survive because they are ASCII, which is exactly why a copier tested only on a text file looks
perfect.</p>
<p><strong>Source and destination being the same folder is not a rude edge case — it is data
loss.</strong> The copy loop opens each file for reading and, at the same moment,
<code>new FileOutputStream(file)</code> for writing — and that constructor <em>truncates the file to zero
length before a single byte has been read</em>. Measured: an 11-byte file "copied onto itself" this way
is 0 bytes afterwards, and the program reports success. That is why <code>checkConfig</code> compares
<code>getCanonicalFile()</code> of the two folders and refuses. Canonical, not the raw strings:
<code>source</code>, <code>./source</code> and <code>dest/../source</code> are three different Strings
and one directory, and comparing the text would let the dangerous case straight through. The brief's
error list does not cover this case, so the message —
<code>Folder Source and Folder Destination are the same</code> — is ours; say so at the defence.</p>
<p><strong>The destination file already exists: overwrite, and here is why.</strong> On the second run it
always does. This program is a config-driven copy job with no confirmation step anywhere in the brief's
flow, and a copier that refuses to refresh a file it already copied is useless the second time it runs —
you would have to empty the folder by hand before every use. So it overwrites, and then verifies each
result byte for byte against the source; an overwrite that half-succeeded cannot be reported as a
success. Scripted run 7 does exactly this and prints an identical file list to run 6.</p>
<p><strong><code>Properties.load()</code> is the trap, and it is silent.</strong> The file is called
<code>config.properties</code>, so the obvious move is <code>java.util.Properties</code>. Do not: in a
.properties file the backslash is an escape character, and the brief's own example value is a Windows
path. <code>COPY_FOLDER=D:\\Data</code> loads back as <code>D:Data</code> — measured, not guessed — because
<code>\\D</code> is not a recognised escape and the backslash is simply eaten. Nothing warns you. The
config file looks correct on screen, the program says <code>Can't find folder Source</code>, and you
spend the evening reading <code>checkConfig</code>. Splitting each line on its <em>first</em>
<code>=</code> keeps the value exactly as written — and "first" matters on its own, because a path can
contain an <code>=</code> and <code>String.split("=")</code> would throw the tail away.</p>
<p><strong>DATA_TYPE is matched case-insensitively, and the brief is why.</strong> Its own example writes
<code>*.CSV</code> in the config and <code>file name 1.csv</code> on the result screen. On Windows nobody
would ever notice the mismatch; on Linux the program would copy nothing, print an empty file list, and
say <code>Copy is finished...</code> — a silent, confident, complete failure. Both sides are lower-cased
before the comparison.</p>
<p><strong>Why <code>checkConfig</code> stops at the first problem.</strong> The brief's error box shows
six messages stacked together, but that is a catalogue of what the method can say, not one screen:
<code>Folder Source is not input</code> and <code>Can't find folder Source</code> cannot both be true at
once. The checks are also dependent — there is nothing to learn from asking whether a blank folder
exists — so the method throws on the first failure and the UI prints it followed by
<code>System shutdown</code>, exactly as the brief's flow demands.</p>
<p><strong>What the given signature of <code>copyFile</code> costs.</strong> The Guidelines specify
<code>public List&lt;String&gt; copyFile(Config config)</code> — with no <code>throws</code>. So a
per-file failure cannot be reported by throwing, and it is reported by absence: a file that could not be
read, could not be written, or did not match its source afterwards is simply not in the returned list.
That is a weakness of the signature rather than of the program, and it is worth naming at the defence.
<code>checkConfig</code> has already proved the destination is a writable directory, which narrows the
gap, but it does not close it.</p>
<p><strong>Every stream is closed by try-with-resources — including the pair.</strong> The input and the
output are declared in one <code>try (...)</code> header and are closed in reverse order on every exit
path, including a <code>write()</code> that throws half-way through a 200 MB file. Without it: the
buffered tail is never flushed, so the destination is silently short; the handles leak, so a loop over a
large folder eventually runs out of them; and on Windows the unclosed output handle locks the
destination file against the next attempt, which then also fails, for a reason that no longer exists.</p>
<p><strong>Why the project builds its own sample folder.</strong> The brief's <code>D:\\Data</code> exists
on nobody's machine. <code>SampleData</code> creates <code>source/</code> on first start with
<code>data1.csv</code>, <code>data2.csv</code>, <code>notes.txt</code> and <code>tone.wav</code>. The TXT
is there to prove DATA_TYPE is really filtering — it never appears in a copy report. The WAV is genuine
binary, all 256 byte values, because a sample folder full of letters would let a character-stream copy
pass every test.</p>
<p><strong>The menu is the one thing the brief leaves blank.</strong> Its diagram draws the box
<code>============ Copy Program =========</code> with nothing inside it. Option 1 is the assignment.
Option 2 exists because a config file with a bad value stops the program, and without a way to re-enter
it you would have to delete the file by hand between attempts. Option 3 is the stream demonstration; it
is not part of the marked specification, and it is kept because the correctness of the entire program
rests on one claim about streams, and a claim you can run beats a claim you assert.</p>
<p><strong>How it was verified.</strong> Ten scripted runs, sharing one working directory in order.
Run 0 starts with no config at all and is refused for a source folder that does not exist; run 1 is a
brand-new JVM that asks for nothing, because the config file run 0 wrote is still on disk — that silence
is the proof the file half works. Runs 2–5 press each check in turn: blank source, blank data type, blank
destination, and a destination whose parent is a file so <code>mkdirs()</code> fails
(<code>Can't make folder Destination</code>). Run 6 copies for real and lists exactly
<code>data1.csv</code>, <code>data2.csv</code>, <code>tone.wav</code> — no <code>notes.txt</code>. Run 7
repeats it over the existing files. Run 8 is the byte-versus-character proof. Run 9 points the
destination at the source and is refused. The one message that is implemented but not exercised is
<code>Can't read File Configure</code>: making a file unreadable is not portable across operating
systems, so it is asserted here rather than demonstrated.</p>''',
    explain_vi='''<p><strong>Một chương trình sao chép được chấm ở chỗ nó hỏng, không phải ở chỗ nó
chạy.</strong> Đọc byte từ tệp này ghi sang tệp kia chỉ sáu dòng. Toàn bộ phần còn lại của bài — và toàn
bộ điểm — là danh sách các cách nó có thể hỏng: không có tệp cấu hình, tệp cấu hình thiếu giá trị, thư
mục nguồn không tồn tại, thư mục đích phải tạo mới, thư mục đích không tạo được, và thư mục đích chính là
thư mục nguồn. Mỗi trường hợp có một thông điệp riêng trong sơ đồ của đề, và mỗi trường hợp đều được bấm
thật trong các lần chạy kiểm bên dưới.</p>
<p><strong>Chọn loại luồng chính là cả bài, và điều đó chứng minh được.</strong> DATA_TYPE trong đề là
<code>*.CSV,*.WAV</code> — tệp âm thanh. Chép một tệp WAV bằng
<code>FileReader</code>/<code>FileWriter</code> thì nó tới nơi trong tình trạng hỏng: reader giải mã byte
thành ký tự theo bảng mã của nền tảng, writer mã hoá ngược lại, nên mọi byte không hợp lệ trong bảng mã
đó bị thay bằng U+FFFD và không bao giờ quay lại. Mục 3 của thực đơn <em>chạy</em> thí nghiệm chứ không
mô tả nó — ghi một tệp 256 byte chứa đủ mọi giá trị từ 0x00 tới 0xFF rồi chép bằng cả hai cách. Đo trên
JVM này (UTF-8): <strong>luồng byte 256 byte, giống hệt nguồn; luồng ký tự 512 byte, khác nhau lần đầu
tại byte thứ 128</strong>. Mọi byte từ 0x80 trở lên quay về thành ba byte <code>EF BF BD</code>. 128 byte
đầu sống sót vì chúng là ASCII — chính vì vậy một trình sao chép chỉ thử trên tệp văn bản trông hoàn hảo
tuyệt đối.</p>
<p><strong>Nguồn trùng đích không phải một trường hợp biên khó chịu — đó là mất dữ liệu.</strong> Vòng
lặp mở tệp để đọc và cùng lúc mở <code>new FileOutputStream(file)</code> để ghi — mà constructor đó
<em>cắt tệp về 0 byte trước khi đọc được một byte nào</em>. Đo thật: một tệp 11 byte "tự chép lên chính
mình" kiểu này còn 0 byte, và chương trình vẫn báo thành công. Vì thế <code>checkConfig</code> so
<code>getCanonicalFile()</code> của hai thư mục và từ chối. Phải là đường dẫn chuẩn hoá, không phải chuỗi
thô: <code>source</code>, <code>./source</code> và <code>dest/../source</code> là ba chuỗi khác nhau và
một thư mục, so văn bản là để lọt đúng trường hợp nguy hiểm nhất. Danh sách lỗi của đề không có tình
huống này, nên thông điệp <code>Folder Source and Folder Destination are the same</code> là của chúng ta;
hãy nói rõ điều đó khi bảo vệ.</p>
<p><strong>Tệp đích đã tồn tại: ghi đè, và đây là lý do.</strong> Từ lần chạy thứ hai trở đi thì luôn
tồn tại. Đây là một tác vụ sao chép do tệp cấu hình điều khiển, trong toàn bộ luồng của đề không có bước
xác nhận nào, mà một trình sao chép từ chối làm mới tệp nó đã chép thì vô dụng ngay lần chạy thứ hai —
bạn sẽ phải xoá tay thư mục đích trước mỗi lần dùng. Nên nó ghi đè, rồi kiểm lại từng tệp <em>từng
byte</em> so với nguồn; một lần ghi đè thành công nửa vời không thể được báo là thành công. Lần chạy kiểm
số 7 làm đúng như vậy và in ra danh sách y hệt lần 6.</p>
<p><strong><code>Properties.load()</code> là cái bẫy, và nó im lặng.</strong> Tệp tên là
<code>config.properties</code> nên phản xạ đầu tiên là dùng <code>java.util.Properties</code>. Đừng: trong
tệp .properties, dấu gạch chéo ngược là ký tự thoát, mà giá trị ví dụ của chính đề lại là một đường dẫn
Windows. <code>COPY_FOLDER=D:\\Data</code> đọc ra thành <code>D:Data</code> — đo thật chứ không đoán — vì
<code>\\D</code> không phải một chuỗi thoát hợp lệ nên dấu gạch chéo bị nuốt mất. Không có cảnh báo nào
cả. Tệp cấu hình nhìn trên màn hình vẫn đúng, chương trình báo <code>Can't find folder Source</code>, và
bạn ngồi cả tối đọc <code>checkConfig</code>. Tách mỗi dòng tại dấu <code>=</code> <em>đầu tiên</em> giữ
nguyên giá trị như đã ghi — và chữ "đầu tiên" tự nó cũng quan trọng, vì đường dẫn có thể chứa dấu
<code>=</code> và <code>String.split("=")</code> sẽ vứt mất phần đuôi.</p>
<p><strong>DATA_TYPE so không phân biệt hoa thường, và chính đề là lý do.</strong> Ví dụ của đề ghi
<code>*.CSV</code> trong cấu hình và <code>file name 1.csv</code> trên màn hình kết quả. Trên Windows
không ai nhận ra sự lệch đó; trên Linux chương trình sẽ không chép gì, in ra danh sách rỗng, rồi nói
<code>Copy is finished...</code> — một thất bại im lặng, tự tin và trọn vẹn. Cả hai vế đều được đưa về
chữ thường trước khi so.</p>
<p><strong>Vì sao <code>checkConfig</code> dừng ở lỗi đầu tiên.</strong> Khung lỗi trong đề xếp sáu thông
điệp chồng lên nhau, nhưng đó là <em>danh mục</em> những câu phương thức này có thể nói, không phải một
màn hình: <code>Folder Source is not input</code> và <code>Can't find folder Source</code> không thể cùng
đúng. Các bước kiểm cũng phụ thuộc nhau — hỏi xem một thư mục rỗng tên có tồn tại không thì vô nghĩa —
nên phương thức ném ngay ở lỗi đầu tiên và tầng giao diện in nó ra kèm <code>System shutdown</code>, đúng
như luồng đề mô tả.</p>
<p><strong>Chữ ký của <code>copyFile</code> phải trả giá thế nào.</strong> Hướng dẫn quy định
<code>public List&lt;String&gt; copyFile(Config config)</code> — không có <code>throws</code>. Nên một tệp
lỗi không thể báo bằng cách ném ngoại lệ, mà báo bằng sự vắng mặt: tệp không đọc được, không ghi được,
hoặc sau khi ghi không khớp với nguồn thì đơn giản là không có trong danh sách trả về. Đó là điểm yếu của
chữ ký được cho, không phải của chương trình, và đáng nói ra khi bảo vệ. <code>checkConfig</code> đã
chứng minh thư mục đích ghi được từ trước, nên khe hở hẹp lại, nhưng không bịt kín.</p>
<p><strong>Mọi luồng đóng bằng try-with-resources — kể cả cặp luồng.</strong> Luồng vào và luồng ra khai
báo trong cùng một đầu <code>try (...)</code> và được đóng theo thứ tự ngược lại trên mọi đường thoát, kể
cả khi <code>write()</code> ném ngoại lệ giữa chừng một tệp 200 MB. Không có nó: phần đuôi trong bộ đệm
không bao giờ được xả nên tệp đích ngắn đi một cách âm thầm; handle rò rỉ nên vòng lặp trên một thư mục
lớn sẽ hết handle; và trên Windows handle ghi chưa đóng còn khoá tệp đích, khiến lần thử sau cũng hỏng vì
một lý do đã không còn tồn tại.</p>
<p><strong>Vì sao project tự dựng thư mục mẫu.</strong> <code>D:\\Data</code> của đề không tồn tại trên máy
ai cả. <code>SampleData</code> tạo <code>source/</code> ở lần chạy đầu với <code>data1.csv</code>,
<code>data2.csv</code>, <code>notes.txt</code> và <code>tone.wav</code>. Tệp TXT có mặt để chứng minh
DATA_TYPE thật sự đang lọc — nó không bao giờ xuất hiện trong báo cáo sao chép. Tệp WAV là nhị phân thật,
đủ 256 giá trị byte, vì một thư mục mẫu toàn chữ cái sẽ khiến bản sao chép bằng luồng ký tự vượt qua mọi
bài kiểm tra.</p>
<p><strong>Thực đơn là thứ duy nhất đề để trống.</strong> Sơ đồ vẽ khung
<code>============ Copy Program =========</code> mà không có gì bên trong. Mục 1 là bài tập. Mục 2 tồn tại
vì một tệp cấu hình sai sẽ dừng chương trình, và nếu không có đường nhập lại thì bạn phải xoá tệp bằng
tay giữa mỗi lần thử. Mục 3 là phần chứng minh về luồng; nó không nằm trong đặc tả được chấm, và nó được
giữ lại vì tính đúng đắn của cả chương trình dựa trên đúng một khẳng định về luồng, mà một khẳng định
chạy được thì hơn hẳn một khẳng định nói suông.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Mười lần chạy kịch bản, dùng chung một thư mục làm việc theo
thứ tự. Lần 0 bắt đầu khi chưa có tệp cấu hình và bị từ chối vì thư mục nguồn không tồn tại; lần 1 là một
JVM hoàn toàn mới nhưng không hỏi gì cả, vì tệp cấu hình lần 0 ghi ra vẫn nằm trên đĩa — chính sự im lặng
đó là bằng chứng phần tệp chạy đúng. Lần 2–5 bấm lần lượt từng bước kiểm: nguồn rỗng, kiểu dữ liệu rỗng,
đích rỗng, và một thư mục đích có cha là một <em>tệp</em> nên <code>mkdirs()</code> thất bại
(<code>Can't make folder Destination</code>). Lần 6 chép thật và liệt kê đúng <code>data1.csv</code>,
<code>data2.csv</code>, <code>tone.wav</code> — không có <code>notes.txt</code>. Lần 7 chép lại đè lên
các tệp đã có. Lần 8 là phần chứng minh byte-so-với-ký-tự. Lần 9 trỏ đích vào chính nguồn và bị từ chối.
Thông điệp duy nhất có cài đặt mà chưa diễn được là <code>Can't read File Configure</code>: làm cho một
tệp không đọc được là thao tác không đồng nhất giữa các hệ điều hành, nên ở đây nó được khẳng định chứ
chưa được trình diễn.</p>''',
    hints_en=[
        'Copy with FileInputStream/FileOutputStream, never FileReader/FileWriter: DATA_TYPE '
        'includes *.WAV, and a character stream rewrites every non-text byte.',
        'Do not parse config.properties with java.util.Properties — a backslash is an escape '
        'there, so D:\\Data loads back as D:Data. Split each line on its first "=".',
        'Refuse the job when source and destination are the same folder: opening a file for '
        'output truncates it to 0 bytes before you have read any of it.',
        'Compare getCanonicalFile(), not the raw strings — "source" and "./source" are one folder.',
        'Lower-case both the DATA_TYPE extension and the file name before matching; the brief '
        'writes *.CSV in the config and .csv on disk.',
    ],
    hints_vi=[
        'Chép bằng FileInputStream/FileOutputStream, đừng bao giờ dùng FileReader/FileWriter: '
        'DATA_TYPE có *.WAV, mà luồng ký tự viết lại mọi byte không phải văn bản.',
        'Đừng đọc config.properties bằng java.util.Properties — ở đó dấu \\ là ký tự thoát, nên '
        'D:\\Data đọc ra thành D:Data. Hãy tách mỗi dòng tại dấu "=" đầu tiên.',
        'Từ chối khi nguồn và đích là cùng một thư mục: mở tệp để ghi sẽ cắt nó về 0 byte trước '
        'khi bạn kịp đọc byte nào.',
        'So bằng getCanonicalFile(), không so chuỗi thô — "source" và "./source" là một thư mục.',
        'Đưa cả phần mở rộng trong DATA_TYPE lẫn tên tệp về chữ thường rồi mới so; đề ghi *.CSV '
        'trong cấu hình nhưng .csv trên đĩa.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0077': '''<h3>Bối cảnh</h3>
<p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết các hàm liệt kê và tìm tệp theo nội dung, gồm các yêu cầu sau:</p>
<ol>
<li>Đếm số lần xuất hiện của một từ trong một tệp.</li>
<li>Tìm những tệp có nội dung chứa từ được nhập vào.</li>
<li>Thoát.</li>
</ol>
<p>Khi người dùng chọn 1:</p>
<p>Yêu cầu người dùng nhập vào một tệp .txt gồm nhiều dòng. Nhập một từ, rồi đếm số lần xuất hiện của từ
đó trong tệp.</p>
<p>Khi người dùng chọn 2:</p>
<p>Yêu cầu người dùng nhập vào đường dẫn của một thư mục. Sau đó nhập một từ, rồi liệt kê tên tất cả các
tệp có chứa từ này.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình nhắc người dùng chọn một mục.</li>
<li>Người dùng chọn một mục, thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn.</h4>
<ul>
<li>Mục 1: Đếm từ trong một tệp.</li>
<li>Nhập đường dẫn của tệp văn bản.</li>
<li>Nhập từ cần đếm.</li>
<li>In ra số lần xuất hiện của từ đó trong tệp.</li>
<li>Mục 2: Tìm các tệp có chứa từ được nhập.</li>
<li>Nhập đường dẫn thư mục.</li>
<li>Nhập từ cần tìm.</li>
<li>In ra tên các tệp có chứa từ được nhập.</li>
<li>Mục 3: Thoát chương trình.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>-------- Count Word --------
Enter Path:d:\\text.txt
Enter Word:test
Bout: 12</pre>
<pre>============ Word Program =========
1. Count Word In File
2. Find File By Word
3. Exit</pre>
<pre>-------- Find File By Word --------
Enter Path:d:\\data
Enter Word: content
------------ File Name ------------
file name 1.txt
file name 2.txt</pre>
<h3>Hướng dẫn</h3>
<p><strong>Sinh viên bắt buộc phải cài đặt các phương thức</strong></p>
<pre>countWordInFile
getFileNameContainsWordInDirectory</pre>
<p>trong mã nguồn khởi tạo.</p>
<h4>Chức năng 1: Đếm từ trong tệp</h4>
<ul>
<li>Cài đặt hàm: <code>public int countWordInFile(String fileSource, String word) throws Exception</code></li>
<li>Đầu vào: <code>fileSource</code> — đường dẫn tệp; <code>word</code> — từ khoá cần tìm.</li>
<li>Giá trị trả về: số lần xuất hiện của từ trong tệp; danh sách ngoại lệ.</li>
</ul>
<h4>Chức năng 2: Tìm tệp theo dữ liệu nhập vào</h4>
<ul>
<li>Cài đặt hàm:
<code>public List&lt;String&gt; getFileNameContainsWordInDirectory(String source, String word) throws Exception</code></li>
<li>Đầu vào: <code>source</code> — đường dẫn thư mục; <code>word</code> — từ khoá cần tìm.</li>
<li>Giá trị trả về: danh sách các tệp tìm được; danh sách ngoại lệ.</li>
</ul>
<p><em>Lưu ý về đề gốc:</em> màn hình mẫu in <code>Bout: 12</code> cho kết quả đếm — gần như chắc chắn là
lỗi gõ của "Count", nhưng phần Hướng dẫn không quy định thông điệp nào khác, nên hãy chép đúng nguyên
văn. Đề cũng viết <code>Enter Word:test</code> ở một khung và <code>Enter Word: content</code> ở khung
kia; hãy dùng thống nhất một lời nhắc.</p>''',

    'J1.S.P0078': '''<h3>Bối cảnh</h3>
<p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết một chương trình dùng tệp <code>config.properties</code> với nội dung:</p>
<pre>1. COPY_FOLDER=D:\\Data
2. DATA_TYPE=*.CSV,*.WAV
3. PATH=D:\\Copy Data</pre>
<p>Khi chương trình chạy:</p>
<p>Nếu tệp cấu hình <strong>không tồn tại</strong>, nhắc người dùng nhập cấu hình với các mục:</p>
<ul>
<li>Enter Copy Folder:</li>
<li>Enter Data Type:</li>
<li>Enter Path:</li>
</ul>
<p>Sau khi nhập, chương trình tạo tệp cấu hình rồi thực hiện các bước tiếp theo.</p>
<p>Nếu tệp cấu hình <strong>đã tồn tại</strong>, kiểm tra nội dung tệp cho các trường hợp sau:</p>
<ul>
<li><strong>COPY_FOLDER</strong>
<ul>
<li>Chưa nhập.</li>
<li>Đường dẫn tới thư mục nguồn không tồn tại.</li>
</ul>
</li>
<li><strong>DATA_TYPE</strong>
<ul>
<li>Chưa nhập.</li>
</ul>
</li>
<li><strong>PATH</strong>
<ul>
<li>Chưa nhập.</li>
<li>Đã nhập nhưng không tồn tại → tạo thư mục đó.</li>
</ul>
</li>
</ul>
<p>Nếu việc kiểm tra tệp cấu hình có lỗi, hiển thị thông báo lỗi và <strong>dừng chương trình</strong>.</p>
<p>Nếu tệp cấu hình hợp lệ thì sao chép các tệp từ COPY_FOLDER sang PATH.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình nhắc người dùng chọn một mục.</li>
<li>Người dùng chọn một mục, thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2</h4>
<ul>
<li>Nếu tệp cấu hình không tồn tại, nhắc người dùng nhập theo định dạng: <code>Copy Folder:</code>,
<code>Data Type:</code>, <code>Path:</code>.</li>
<li>Nếu tệp cấu hình đã tồn tại, kiểm tra dữ liệu trong tệp theo các trường hợp ở trên.</li>
<li>Nếu kiểm tra có lỗi, hiển thị thông báo lỗi và dừng chương trình.</li>
<li>Nếu cấu hình đầy đủ thì thực hiện sao chép từ COPY_FOLDER sang PATH.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>============ Copy Program =========</pre>
<pre>File Configure is not found!
---- Input Configure File -----
Copy Folder:
Data Type:
Path:</pre>
<pre>File Configure cannot create
System shutdown</pre>
<pre>---- Check Configure File -----
Can't read File Configure
Folder Source is not input
Can't find folder Source
Data type is not input
Folder Destination is not input
Can't make folder Destination
System shutdown</pre>
<pre>Copy is running...
------------ File Name ------------
file name 1.csv
file name 2.csv
Copy is finished...</pre>
<p><em>Khung thông báo lỗi ở trên là DANH MỤC các thông điệp có thể xuất hiện, không phải một màn hình:
"Folder Source is not input" và "Can't find folder Source" không thể cùng đúng một lúc.</em></p>
<h3>Hướng dẫn</h3>
<p><strong>Sinh viên bắt buộc phải cài đặt các phương thức</strong></p>
<pre>readFileConfig
createFileConfig
checkConfig
copyFile</pre>
<p>trong mã nguồn khởi tạo.</p>
<h4>Chức năng 1: Đọc tệp config.properties</h4>
<ul>
<li>Cài đặt hàm: <code>public Config readFileConfig(Config config) throws ExceptionHandle</code></li>
<li>Đầu vào: <code>config</code> — đối tượng chứa thông tin cấu hình.</li>
<li>Trả về: đối tượng config đã được điền đầy đủ thông tin; danh sách ExceptionHandle.</li>
</ul>
<h4>Chức năng 2: Tạo tệp cấu hình nếu chưa có</h4>
<ul>
<li>Cài đặt hàm: <code>public void createFileConfig(Config config) throws ExceptionHandle</code></li>
<li>Đầu vào: <code>config</code> — đối tượng chứa thông tin cấu hình nhập từ bàn phím.</li>
<li>Trả về: danh sách ExceptionHandle.</li>
</ul>
<h4>Chức năng 3: Kiểm tra tệp cấu hình</h4>
<ul>
<li>Cài đặt hàm: <code>public void checkConfig(Config config) throws ExceptionHandle</code></li>
<li>Đầu vào: <code>config</code> — đối tượng chứa thông tin cấu hình.</li>
<li>Trả về: danh sách ExceptionHandle.</li>
</ul>
<h4>Chức năng 4: Thực hiện sao chép nếu cấu hình hợp lệ</h4>
<ul>
<li>Cài đặt hàm: <code>public List&lt;String&gt; copyFile(Config config)</code></li>
<li>Đầu vào: <code>config</code> — đối tượng chứa thông tin cấu hình.</li>
<li>Trả về: danh sách các tệp đã sao chép xong.</li>
</ul>
<p><em>Lưu ý:</em> chữ ký của <code>copyFile</code> không có <code>throws</code>, nên lỗi ở từng tệp phải
được xử lý bên trong phương thức. Ngoài ra đề không nêu trường hợp thư mục nguồn trùng thư mục đích —
nhưng đó là trường hợp làm mất dữ liệu, nên vẫn phải chặn.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
