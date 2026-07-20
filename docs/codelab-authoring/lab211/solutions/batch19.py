# Batch 19 — J1.S.P0075 (file handling: paths, filters, append, word count) and
# J1.S.P0076 (standardising a CSV file with plain String manipulation).
#
# Both are FILE exercises, so both are verified with TWO scripted runs that share
# one working directory: the second run is a NEW process, and it reads back what
# the first one wrote. Compiling proves nothing about a file; only a second
# process finding the bytes proves it.
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0075 — Handle file program (100 LOC)
# ════════════════════════════════════════════════════════════════

P0075_BO = '''package bo;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileFilter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * The five operations the Guidelines name, and nothing else.
 *
 * Every method here throws with the brief's own message and never prints: the
 * screen belongs to ui.Main. That split is what lets the same checkInputPath()
 * be reused by a GUI, a test, or the menu, without one of them learning to
 * write to System.out.
 */
public class FileProcessing {

    /** A kilobyte, as the size option means it. */
    private static final long KILOBYTE = 1024L;

    /**
     * Reports what the path is - by THROWING, in all three cases.
     *
     * This is the brief's contract, not a design choice: the Guidelines list
     * Exception("Path doesn't exist"), Exception("Path to file") and
     * Exception("Path to Directory") as the RETURN VALUES of this method. Using
     * an exception to report success is bad design (an exception should mean
     * "I could not do what you asked"), and it is worth saying so out loud at
     * the defence - but the Guidelines are the contract, so it is implemented
     * exactly as written, and the caller's catch block prints all three.
     */
    public void checkInputPath(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("Path doesn't exist");
        }
        if (file.isFile()) {
            throw new Exception("Path to file");
        }
        throw new Exception("Path to Directory");
    }

    /**
     * The names of the .java files sitting directly in one directory.
     *
     * FilenameFilter rather than FileFilter, because the question being asked is
     * about the NAME. The pair is easy to confuse; the rule that keeps them
     * straight is that FilenameFilter is handed (directory, name) and
     * FileFilter is handed a whole File, so a name test wants the first and a
     * size test wants the second.
     *
     * list() returns null - not an empty array - when the path is not a
     * directory or cannot be read, and exists() is happily true for a plain
     * file. Skipping the null check is therefore not a theoretical NPE: it is
     * the one a marker gets by typing a file name into option 2.
     */
    public List<String> getAllFileNameJavaInDirectory(String path) throws Exception {
        File directory = new File(path);
        if (!directory.exists()) {
            throw new Exception("Path doesn't exist");
        }
        List<String> names = new ArrayList<>();
        String[] found = directory.list(new FilenameFilter() {
            @Override
            public boolean accept(File current, String name) {
                return new File(current, name).isFile()
                        && name.toLowerCase().endsWith(".java");
            }
        });
        if (found != null) {
            names.addAll(Arrays.asList(found));
            // listFiles()/list() return entries in filesystem order, which is
            // not alphabetical and differs between machines. Sorting costs
            // nothing and makes the screen the same everywhere - which matters
            // when the expected output is the thing being marked.
            Collections.sort(names);
        }
        return names;
    }

    /**
     * Every file in one directory bigger than `size` KILOBYTES.
     *
     * `(long) size * KILOBYTE` and not `size * 1024`: the second is int
     * arithmetic and overflows above 2_097_151 KB, so a 3 GB threshold silently
     * becomes a negative number and the method returns every file in the
     * folder. Widening one operand before multiplying costs nothing.
     *
     * Declared static because the Guidelines declare it static, while the other
     * four are instance methods. That inconsistency is the brief's, not ours.
     */
    public static File[] getFileWithSizeGreaterThanInput(String path, final int size) throws Exception {
        File directory = new File(path);
        if (!directory.exists()) {
            throw new Exception("Path doesn't exist");
        }
        File[] found = directory.listFiles(new FileFilter() {
            @Override
            public boolean accept(File file) {
                return file.isFile() && file.length() > (long) size * KILOBYTE;
            }
        });
        if (found == null) {
            return new File[0];
        }
        Arrays.sort(found);
        return found;
    }

    /**
     * Adds one line to the END of an existing file.
     *
     * new FileWriter(file, true) - the second argument is the whole exercise.
     * Without it the constructor TRUNCATES the file, so "add more content"
     * quietly deletes everything that was there, and the bug is invisible until
     * someone reopens the file.
     *
     * The file must already exist, because the brief says so: a missing path is
     * Exception("Path doesn't exist"), never a silently created file.
     */
    public boolean appendContentToFile(String path, String contentInput) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("Path doesn't exist");
        }
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, true))) {
            writer.write(contentInput);
            writer.newLine();
        } catch (IOException e) {
            // A disk error is not "the path doesn't exist" - keep the two apart
            // so the screen never tells the user a lie about which went wrong.
            throw new Exception("Cannot write to file: " + e.getMessage());
        }
        return true;
    }

    /**
     * Counts the words in a text file - despite the name.
     *
     * The Guidelines call the method countCharacter and then define it as "the
     * number of character which are separated by a whitespace", which is a word
     * count; the Program Specifications say "count the number of word" outright.
     * The name is kept because a marker looks for it by name.
     *
     * The blank-line trap: "".split("\\\\s+") does NOT return an empty array, it
     * returns one element that is the empty string (run it - it surprises
     * everybody). Counting split().length per line would therefore score one
     * word for every blank line in the file. Skipping blank lines first is the
     * cheapest cure.
     */
    public int countCharacter(String path) throws Exception {
        File file = new File(path);
        if (!file.exists()) {
            throw new Exception("Path doesn't exist");
        }
        int total = 0;
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                // trim() also removes the stray \\r left by a file written on
                // Windows, so a CRLF file does not glue \\r onto the last word.
                String trimmed = line.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                total += trimmed.split("\\\\s+").length;
            }
        } catch (IOException e) {
            throw new Exception("Cannot read file: " + e.getMessage());
        }
        return total;
    }
}
'''

P0075_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner over System.in for the whole program: a second Scanner on
 * the same stream buffers ahead and eats input the first one was going to read,
 * which shows up as a prompt that "skips itself".
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /** A line of text. Trimmed - a trailing space on a pasted path is invisible and fatal. */
    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /**
     * An integer, re-asked until it is one. The caller supplies the complaint
     * because the brief words it differently per option.
     */
    public static int getInt(String message, String notANumber) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println(notANumber);
            }
        }
    }

    /** A menu choice inside a closed range. */
    public static int getInt(String message, int min, int max) {
        while (true) {
            int value = getInt(message, "You must input a number.");
            if (value >= min && value <= max) {
                return value;
            }
            System.out.println("Please choose from " + min + " to " + max + ".");
        }
    }
}
'''

P0075_MAIN = '''package ui;

import bo.FileProcessing;
import java.io.File;
import java.io.IOException;
import java.util.List;
import utils.Validator;

/**
 * The menu and the screen. Every string a marker diffs is in this file, and
 * every decision about files is in bo.FileProcessing.
 */
public class Main {

    private static final String DEMO_FILE = "test.txt";

    public static void main(String[] args) {
        ensureDemoFile();
        FileProcessing processing = new FileProcessing();
        boolean running = true;
        while (running) {
            printMenu();
            int choice = Validator.getInt("Please choice one option:", 1, 6);
            switch (choice) {
                case 1:
                    checkPath(processing);
                    break;
                case 2:
                    listJavaFiles(processing);
                    break;
                case 3:
                    listBigFiles();
                    break;
                case 4:
                    appendContent(processing);
                    break;
                case 5:
                    countWords(processing);
                    break;
                default:
                    running = false;
            }
        }
    }

    /**
     * Options 4 and 5 need a file that already exists, and a project that has
     * just been unzipped has none - option 4 is forbidden to create one, since
     * a missing path is an error by contract. So the program makes the demo
     * file itself, once, and says so. On the next run the file is already there
     * and this line does not appear: that difference is the proof that the data
     * survived the process, and it costs one line of code to show it.
     */
    private static void ensureDemoFile() {
        File file = new File(DEMO_FILE);
        try {
            if (file.createNewFile()) {
                System.out.println("Demo data file created: " + DEMO_FILE);
            }
        } catch (IOException e) {
            System.out.println("Cannot create " + DEMO_FILE + ": " + e.getMessage());
        }
    }

    private static void printMenu() {
        System.out.println("============ File Processing =========");
        System.out.println("1. Check Path");
        System.out.println("2. Get file name with type java");
        System.out.println("3. Get file with size greater than input");
        System.out.println("4. Write more content to file");
        System.out.println("5. Read file and count characters");
        System.out.println("6. Exit");
    }

    /** All three answers arrive as exceptions, so one catch prints all three. */
    private static void checkPath(FileProcessing processing) {
        System.out.println("---------- Check Path ---------");
        String path = Validator.getString("Enter Path:");
        try {
            processing.checkInputPath(path);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void listJavaFiles(FileProcessing processing) {
        System.out.println("------- Get file name with type java --------");
        String path = Validator.getString("Enter Path:");
        try {
            List<String> names = processing.getAllFileNameJavaInDirectory(path);
            for (String name : names) {
                System.out.println(name);
            }
            System.out.println("Result " + names.size() + " file!");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * The size is asked for FIRST, exactly as the brief's screen shows, and the
     * path is asked again until it exists because the brief says "Please Try
     * again" - a one-shot prompt would end the option on a typo.
     */
    private static void listBigFiles() {
        System.out.println("--------- Get file with size greater than input --------");
        int size = Validator.getInt("Enter Size(Integer):", "Value of size is digit");
        while (true) {
            String path = Validator.getString("Enter Path:");
            try {
                File[] files = FileProcessing.getFileWithSizeGreaterThanInput(path, size);
                for (File file : files) {
                    System.out.println(file.getName());
                }
                System.out.println("Result " + files.length + " files!");
                return;
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    /** Content first, then path - the order the brief's screen uses. */
    private static void appendContent(FileProcessing processing) {
        System.out.println("------ Write more content to file ----");
        String content = Validator.getString("Enter Content:");
        while (true) {
            String path = Validator.getString("Enter Path:");
            try {
                if (processing.appendContentToFile(path, content)) {
                    System.out.println("Write done");
                }
                return;
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    private static void countWords(FileProcessing processing) {
        System.out.println("---- Read file an count characters ----");
        String path = Validator.getString("Enter Path:");
        try {
            System.out.println("Total:" + processing.countCharacter(path));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''


solution(
    'J1.S.P0075',
    title_vi='Chương trình xử lý tệp tin',
    files=[('src/bo/FileProcessing.java', P0075_BO),
           ('src/utils/Validator.java', P0075_VALIDATOR),
           ('src/ui/Main.java', P0075_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — a fresh project directory. The demo file is created, a bad
        # path, a directory, the .java listing, the size filter, an append to a
        # name that does not exist and then to one that does, and a word count.
        ('1\nabc\n'
         '1\nsrc\n'
         '2\nsrc/bo\n'
         '3\na\n1\nsrc/ui\n'
         '4\nHello LAB211\ntext.txt\ntest.txt\n'
         '5\ntest.txt\n'
         '6\n',
         '''Demo data file created: test.txt
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---------- Check Path ---------
Enter Path:Path doesn't exist
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---------- Check Path ---------
Enter Path:Path to Directory
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:------- Get file name with type java --------
Enter Path:FileProcessing.java
Result 1 file!
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:--------- Get file with size greater than input --------
Enter Size(Integer):Value of size is digit
Enter Size(Integer):Enter Path:Main.java
Result 1 files!
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:------ Write more content to file ----
Enter Content:Enter Path:Path doesn't exist
Enter Path:Write done
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---- Read file an count characters ----
Enter Path:Total:2
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:'''),

        # Run 1 — a NEW process in the same directory. test.txt is no longer
        # created (no "Demo data file created" line), option 1 finds it, option 5
        # reads back the two words run 0 wrote, and a second append proves the
        # writer appends instead of truncating: 2 words become 6.
        ('1\ntest.txt\n'
         '5\ntest.txt\n'
         '4\nfrom the second run\ntest.txt\n'
         '5\ntest.txt\n'
         '6\n',
         '''============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---------- Check Path ---------
Enter Path:Path to file
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---- Read file an count characters ----
Enter Path:Total:2
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:------ Write more content to file ----
Enter Content:Enter Path:Write done
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:---- Read file an count characters ----
Enter Path:Total:6
============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:'''),
    ],
    explain_en='''<p><strong>What is actually being marked.</strong> Five method signatures and five message
strings. The Guidelines spell out <code>checkInputPath</code>,
<code>getAllFileNameJavaInDirectory</code>, <code>getFileWithSizeGreaterThanInput</code>,
<code>appendContentToFile</code> and <code>countCharacter</code>, with their parameter lists and their
exception texts. Rename one of them, or write <em>"Path does not exist"</em> where the brief wrote
<em>"Path doesn't exist"</em>, and the work is invisible to whatever the marker greps for. Everything
else in this solution is negotiable; those ten things are not.</p>
<p><strong>The strangest thing in the brief, and why it was obeyed anyway.</strong>
<code>checkInputPath</code> reports <em>success</em> by throwing:
<code>Exception("Path to file")</code> and <code>Exception("Path to Directory")</code> are listed as its
return values alongside <code>Exception("Path doesn't exist")</code>. That is not how exceptions are
meant to be used — an exception should mean "I could not do what you asked", not "here is your answer".
It is implemented exactly as written because the Guidelines are the contract, which is why the caller is
a single <code>try</code> with one <code>catch</code> that prints all three outcomes. Say this out loud
at the defence: noticing a bad contract and still honouring it is worth more than quietly improving
it.</p>
<p><strong>Three files, and why there is no <code>entity</code>.</strong> This program has no record
type — no student, no product, nothing with fields to hold. It has rules about files
(<code>bo</code>), one place that reads the keyboard (<code>utils</code>) and a screen
(<code>ui</code>). An <code>entity</code> package here would contain a class wrapping a
<code>File</code> for no reason, and an empty <code>controller</code> between a menu and five methods is
a mark lost, not gained. Add a layer where the program needs one.</p>
<p><strong><code>FilenameFilter</code> and <code>FileFilter</code> are not interchangeable.</strong> The
brief names both, and each fits exactly one of the two options. <code>FilenameFilter.accept(File
dir, String name)</code> is handed the <em>name</em>, so it is the natural fit for "does this end in
<code>.java</code>". <code>FileFilter.accept(File f)</code> is handed the whole <code>File</code>, so it
is the one that can ask <code>f.length()</code>. Choosing by what the question is <em>about</em> is the
rule that keeps the pair straight.</p>
<p><strong>The <code>null</code> that ends most attempts at this lab.</strong> <code>File.list()</code>
and <code>File.listFiles()</code> return <code>null</code> — not an empty array — when the path is not a
directory or cannot be read. And <code>exists()</code> is perfectly happy about a plain file. So typing
a file name into option 2 produces a <code>NullPointerException</code> two lines later in any solution
that skips the check. Both methods here guard it and answer "0 files" instead of dying.</p>
<p><strong>Kilobytes, and an overflow worth knowing about.</strong> The comparison is
<code>file.length() &gt; (long) size * 1024L</code>. Written as <code>size * 1024</code> it is
<code>int</code> arithmetic, which overflows above 2 097 151 KB: a 3 GB threshold becomes a negative
number and the option cheerfully lists every file in the folder. Widening one operand before the
multiply costs nothing and removes the whole class of bug.</p>
<p><strong>Sorted output, on purpose.</strong> <code>list()</code> returns entries in filesystem order,
which is neither alphabetical nor the same on two machines. When the thing being marked is a screen, an
output that reshuffles itself between runs is a liability, so both listings are sorted before
printing.</p>
<p><strong>The one character that decides option 4.</strong> <code>new FileWriter(file, true)</code>.
Without the <code>true</code>, the constructor truncates: "add more content to the file" silently
deletes everything that was already in it, and nothing on the screen says so. The second scripted run
proves the right behaviour rather than asserting it — the file holds two words, one more line is
appended, and the count becomes six.</p>
<p><strong><code>countCharacter</code> counts words.</strong> The brief's own Program Specifications say
"count the number of word in the file (each word is separated by a whitespace)", and the Guidelines then
describe the same method as "the number of character which are separated by a whitespace" while naming
it <code>countCharacter</code>. Those are the same operation described twice; the name is simply wrong.
It is kept, because a marker searches for the name given in the Guidelines.</p>
<p><strong>The blank-line trap, which was run before it was written about.</strong>
<code>"".split("\\\\s+")</code> does not return an empty array — it returns an array of length <strong>1</strong>
holding the empty string, and so does <code>"   ".trim().split("\\\\s+")</code>. A word counter that adds
<code>split().length</code> for every line therefore scores one extra word for every blank line in the
file. Skipping blank lines before splitting is the cure. Related and also verified:
<code>"a\\r".trim()</code> has length 1, so the <code>trim()</code> that removes the indentation also
removes the stray carriage return left by a file written on Windows — a CRLF file does not glue
<code>\\r</code> onto its last word.</p>
<p><strong>The demo file, which is a decision and not an accident.</strong> Options 4 and 5 need a file
that already exists, a freshly unzipped project has none, and option 4 is forbidden to create one
because a missing path is an error by contract. So <code>Main</code> creates <code>test.txt</code> once,
on first start, and prints one line saying it did. On every later run the file is already there and the
line does not appear — which is exactly the difference the two verification runs demonstrate.</p>
<p><strong>How this was verified.</strong> Two scripted runs sharing one working directory. Run 0 starts
in an empty project: it creates the demo file, gets "Path doesn't exist" for <code>abc</code>, "Path to
Directory" for <code>src</code>, lists the one <code>.java</code> file in <code>src/bo</code>, is told
"Value of size is digit" for a size of <code>a</code>, lists the file over 1 KB in <code>src/ui</code>,
is refused on the mistyped <code>text.txt</code> and accepted on <code>test.txt</code>, and counts two
words. Run 1 is a <strong>new JVM</strong> in the same directory: no "created" line, option 1 answers
"Path to file", option 5 reads back <code>Total:2</code>, a second append raises it to
<code>Total:6</code>. A program that truncated instead of appending, or wrote to the wrong directory,
cannot produce that pair of numbers.</p>
<p><strong>Where the brief contradicts itself.</strong> Three places, all worth mentioning at the
defence. (1) The Function details say the non-numeric size must print <em>"Value of size is digit"</em>;
the screenshot shows <em>"Size is digit"</em>. The written specification wins, as always. (2) The
screenshot's own heading reads <em>"Read file an count characters"</em> while the menu line reads
<em>"and"</em>; both are copied exactly where they appear, because that is what gets diffed. (3) The
list of classes to use contains <code>java.io.BufferedReade</code>, which does not exist — it is
<code>BufferedReader</code>. And a fourth, smaller one: <code>getFileWithSizeGreaterThanInput</code> is
declared <code>static</code> while the other four are instance methods, so <code>Main</code> calls it on
the class and the rest on an object.</p>
<p><strong>What an examiner will ask.</strong> "Show me what happens if I type a file path into option
2" (answer: the <code>null</code> from <code>list()</code>, handled). "What if I run option 4 twice?"
(answer: run it — the file grows, it is not overwritten). "Why is your success reported by an
exception?" (answer: because the Guidelines define it that way, and here is why that is unusual).</p>''',
    explain_vi='''<p><strong>Bài này thực sự chấm cái gì.</strong> Năm chữ ký phương thức và năm chuỗi thông
báo. Phần Hướng dẫn ghi rõ <code>checkInputPath</code>, <code>getAllFileNameJavaInDirectory</code>,
<code>getFileWithSizeGreaterThanInput</code>, <code>appendContentToFile</code> và
<code>countCharacter</code>, kèm danh sách tham số và nội dung ngoại lệ. Đổi tên một phương thức, hoặc
viết <em>"Path does not exist"</em> trong khi đề viết <em>"Path doesn't exist"</em>, là công sức của bạn
trở nên vô hình với thứ mà người chấm dò tìm. Mọi thứ khác trong lời giải này đều có thể bàn; mười thứ
đó thì không.</p>
<p><strong>Điều kỳ lạ nhất trong đề, và vì sao vẫn phải làm theo.</strong> <code>checkInputPath</code>
báo <em>thành công</em> bằng cách ném ngoại lệ: <code>Exception("Path to file")</code> và
<code>Exception("Path to Directory")</code> được liệt kê là giá trị trả về của nó, ngang hàng với
<code>Exception("Path doesn't exist")</code>. Đó không phải cách dùng ngoại lệ — ngoại lệ phải có nghĩa
"tôi không làm được việc bạn yêu cầu", chứ không phải "đây là câu trả lời của bạn". Ta vẫn cài đặt đúng
như đề vì phần Hướng dẫn là bản có hiệu lực; cũng vì thế mà bên gọi chỉ có một <code>try</code> với một
<code>catch</code> in ra cả ba kết quả. Hãy nói thẳng điều này khi bảo vệ: nhận ra một hợp đồng dở mà vẫn
tôn trọng nó có giá hơn việc lặng lẽ "sửa cho đẹp".</p>
<p><strong>Ba tệp, và vì sao không có <code>entity</code>.</strong> Chương trình này không có kiểu bản ghi
nào — không sinh viên, không sản phẩm, không có gì cần trường dữ liệu. Nó có luật về tệp
(<code>bo</code>), một chỗ duy nhất đọc bàn phím (<code>utils</code>) và một màn hình (<code>ui</code>).
Gói <code>entity</code> ở đây sẽ chỉ chứa một lớp bọc <code>File</code> mà chẳng để làm gì, còn một
<code>controller</code> rỗng nằm giữa thực đơn và năm phương thức là mất điểm chứ không được điểm. Chỉ
thêm tầng ở chỗ chương trình thật sự cần.</p>
<p><strong><code>FilenameFilter</code> và <code>FileFilter</code> không thay nhau được.</strong> Đề nêu
cả hai, và mỗi cái vừa khít một tuỳ chọn. <code>FilenameFilter.accept(File dir, String name)</code> nhận
<em>tên</em>, nên hợp với câu hỏi "cái này có kết thúc bằng <code>.java</code> không".
<code>FileFilter.accept(File f)</code> nhận cả đối tượng <code>File</code>, nên nó mới hỏi được
<code>f.length()</code>. Chọn theo việc câu hỏi <em>nói về cái gì</em> — đó là quy tắc giúp không bao giờ
lẫn hai cái này.</p>
<p><strong>Cái <code>null</code> giết phần lớn bài nộp của lab này.</strong> <code>File.list()</code> và
<code>File.listFiles()</code> trả về <code>null</code> — chứ không phải mảng rỗng — khi đường dẫn không
phải thư mục hoặc không đọc được. Trong khi <code>exists()</code> lại rất vui vẻ với một tệp thường. Nên
gõ tên một tệp vào tuỳ chọn 2 sẽ sinh <code>NullPointerException</code> hai dòng sau đó ở mọi lời giải bỏ
qua bước kiểm tra. Ở đây cả hai phương thức đều chặn và trả lời "0 file" thay vì chết.</p>
<p><strong>Kilobyte, và một lỗi tràn số đáng biết.</strong> Phép so sánh là
<code>file.length() &gt; (long) size * 1024L</code>. Viết <code>size * 1024</code> là số học
<code>int</code>, tràn khi vượt 2 097 151 KB: ngưỡng 3 GB biến thành một số âm và tuỳ chọn này liệt kê
hồn nhiên mọi tệp trong thư mục. Nới rộng một toán hạng trước khi nhân chẳng tốn gì mà xoá sạch cả một
họ lỗi.</p>
<p><strong>Sắp xếp kết quả, một cách có chủ ý.</strong> <code>list()</code> trả về theo thứ tự của hệ
thống tệp, vốn không theo bảng chữ cái và không giống nhau giữa hai máy. Khi thứ bị chấm là màn hình,
một kết quả tự xáo trộn giữa các lần chạy là điểm yếu, nên cả hai danh sách đều được sắp xếp trước khi
in.</p>
<p><strong>Một ký tự quyết định tuỳ chọn 4.</strong> <code>new FileWriter(file, true)</code>. Thiếu
<code>true</code>, hàm dựng sẽ <em>cắt trắng</em> tệp: "ghi thêm nội dung vào tệp" lặng lẽ xoá sạch những
gì đã có, và trên màn hình không có gì báo. Lần chạy kiểm thứ hai <em>chứng minh</em> hành vi đúng chứ
không tuyên bố suông — tệp đang có hai từ, ghi thêm một dòng nữa, số đếm thành sáu.</p>
<p><strong><code>countCharacter</code> đếm từ.</strong> Phần Đặc tả của chính đề viết "count the number
of word in the file (each word is separated by a whitespace)", rồi phần Hướng dẫn mô tả đúng phương thức
ấy là "the number of character which are separated by a whitespace" nhưng lại đặt tên
<code>countCharacter</code>. Hai câu đó mô tả cùng một việc; chỉ có cái tên là sai. Vẫn giữ tên, vì người
chấm tìm theo tên trong phần Hướng dẫn.</p>
<p><strong>Bẫy dòng trống — đã chạy thử trước khi viết ra đây.</strong>
<code>"".split("\\\\s+")</code> không trả về mảng rỗng — nó trả về mảng dài <strong>1</strong> chứa chuỗi
rỗng, và <code>"   ".trim().split("\\\\s+")</code> cũng vậy. Một bộ đếm từ cộng
<code>split().length</code> cho mỗi dòng sẽ tính dư một từ cho mỗi dòng trống trong tệp. Cách chữa là bỏ
qua dòng trống trước khi tách. Liên quan và cũng đã kiểm chứng: <code>"a\\r".trim()</code> có độ dài 1,
nên chính <code>trim()</code> đó cũng gỡ luôn ký tự xuống dòng thừa của tệp viết trên Windows — tệp CRLF
không bị dính <code>\\r</code> vào từ cuối.</p>
<p><strong>Tệp demo là một quyết định, không phải tình cờ.</strong> Tuỳ chọn 4 và 5 cần một tệp có sẵn,
một project vừa giải nén thì chưa có, và tuỳ chọn 4 bị cấm tự tạo tệp vì theo hợp đồng, đường dẫn không
tồn tại là lỗi. Nên <code>Main</code> tạo <code>test.txt</code> đúng một lần lúc khởi động đầu tiên và in
một dòng báo. Những lần chạy sau tệp đã có sẵn nên dòng đó không xuất hiện — đúng bằng sự khác biệt mà
hai lần chạy kiểm thể hiện.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy theo kịch bản, dùng chung một thư mục làm việc.
Lần 0 bắt đầu trong project rỗng: tạo tệp demo, nhận "Path doesn't exist" với <code>abc</code>, "Path to
Directory" với <code>src</code>, liệt kê một tệp <code>.java</code> trong <code>src/bo</code>, bị mắng
"Value of size is digit" khi nhập kích thước là <code>a</code>, liệt kê tệp lớn hơn 1 KB trong
<code>src/ui</code>, bị từ chối với tên gõ nhầm <code>text.txt</code> rồi được chấp nhận với
<code>test.txt</code>, và đếm được hai từ. Lần 1 là một <strong>JVM mới</strong> trong cùng thư mục:
không còn dòng "created", tuỳ chọn 1 trả lời "Path to file", tuỳ chọn 5 đọc lại <code>Total:2</code>, ghi
thêm lần nữa thì thành <code>Total:6</code>. Một chương trình cắt trắng thay vì ghi thêm, hoặc ghi nhầm
thư mục, không thể tạo ra cặp số đó.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Ba chỗ, đều đáng nêu khi bảo vệ. (1) Phần Function details nói
kích thước không phải số thì in <em>"Value of size is digit"</em>; ảnh màn hình lại ghi <em>"Size is
digit"</em>. Phần đặc tả bằng chữ luôn thắng. (2) Tiêu đề trong ảnh ghi <em>"Read file an count
characters"</em> còn dòng thực đơn ghi <em>"and"</em>; cả hai đều được chép nguyên văn ở đúng chỗ của
chúng, vì đó là thứ bị so từng ký tự. (3) Danh sách lớp cần dùng ghi
<code>java.io.BufferedReade</code>, một lớp không tồn tại — đúng ra là <code>BufferedReader</code>. Và
một chỗ nhỏ thứ tư: <code>getFileWithSizeGreaterThanInput</code> được khai báo <code>static</code> trong
khi bốn phương thức còn lại là phương thức thể hiện, nên <code>Main</code> gọi nó qua tên lớp còn các
phương thức kia qua đối tượng.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Gõ đường dẫn tới một tệp vào tuỳ chọn 2 thì sao?" (đáp: cái
<code>null</code> từ <code>list()</code>, đã chặn). "Chạy tuỳ chọn 4 hai lần thì sao?" (đáp: cứ chạy —
tệp dài thêm chứ không bị ghi đè). "Vì sao thành công lại báo bằng ngoại lệ?" (đáp: vì Hướng dẫn định
nghĩa như vậy, và đây là lý do điều đó bất thường).</p>''',
    hints_en=[
        'Copy the five method names and the three exception texts letter by letter — "Path doesn\'t exist", "Path to file", "Path to Directory".',
        'File.list() returns null, not an empty array, when the path is not a directory — and exists() is true for a plain file.',
        'FilenameFilter is handed (dir, name) so it fits the .java test; FileFilter is handed a File so it fits the size test.',
        'new FileWriter(path, true) appends; without the true it truncates the file you were told to add to.',
        'Run "".split("\\\\s+") before you trust it: length 1, not 0 — so skip blank lines when counting words.',
    ],
    hints_vi=[
        'Chép đúng từng chữ năm tên phương thức và ba chuỗi ngoại lệ — "Path doesn\'t exist", "Path to file", "Path to Directory".',
        'File.list() trả về null chứ không phải mảng rỗng khi đường dẫn không phải thư mục — mà exists() vẫn đúng với tệp thường.',
        'FilenameFilter nhận (thư mục, tên) nên hợp với việc kiểm .java; FileFilter nhận File nên hợp với việc kiểm kích thước.',
        'new FileWriter(path, true) là ghi thêm; thiếu true là cắt trắng chính tệp bạn được yêu cầu ghi thêm vào.',
        'Chạy thử "".split("\\\\s+") trước khi tin nó: độ dài 1 chứ không phải 0 — nên phải bỏ qua dòng trống khi đếm từ.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0076 — Building module csv file format (100 LOC)
# ════════════════════════════════════════════════════════════════

P0076_BO = '''package bo;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

/**
 * The CSV being standardised, and the four operations the Guidelines name.
 *
 * The brief's signatures decide the design: importCSV(String), formatAddress
 * (String dataCSV), formatName(String dataCSV) and exportCSV(String) all hand
 * the WHOLE FILE around as a single String, and every one of them "sets the
 * global variable dataCSV in class". A List<Customer> would be the better
 * model - it would make the columns typed and the code shorter - but that is
 * not the contract, and this is a String-manipulation exercise by instruction.
 */
public class CSVFormatter {

    /** Columns as the brief numbers them: ID, Name, Email, Phone, Address. */
    private static final int NAME_COLUMN = 1;
    private static final int ADDRESS_COLUMN = 4;

    private static final String NEW_LINE = System.lineSeparator();

    /** The "global variable dataCSV": the whole file as one String. */
    private String dataCSV;

    public String getDataCSV() {
        return dataCSV;
    }

    /**
     * Reads the file into dataCSV.
     *
     * readLine() is used rather than reading raw characters because it accepts
     * \\n, \\r\\n and \\r alike and hands back the line without any of them; the
     * lines are then re-joined with this machine's own separator. A file that
     * came from Windows therefore stops being a Windows file the moment it is
     * imported, and no \\r survives into a field.
     */
    public void importCSV(String path) throws Exception {
        File file = new File(path);
        if (!file.exists() || !file.isFile()) {
            throw new Exception("Path doesn't exist");
        }
        StringBuilder content = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (content.length() > 0) {
                    content.append(NEW_LINE);
                }
                content.append(line);
            }
        } catch (IOException e) {
            throw new Exception("Cannot read file: " + e.getMessage());
        }
        dataCSV = content.toString();
    }

    /** Squeezes the redundant whitespace out of the Address column. */
    public void formatAddress(String dataCSV) throws Exception {
        this.dataCSV = format(dataCSV, ADDRESS_COLUMN, false);
    }

    /**
     * Squeezes the Name column and capitalises the first letter of each word.
     *
     * Returns String while formatAddress returns void - the brief declares the
     * two that way, so they are written that way. It also sets the global, as
     * the brief requires of both.
     */
    public String formatName(String dataCSV) throws Exception {
        this.dataCSV = format(dataCSV, NAME_COLUMN, true);
        return this.dataCSV;
    }

    /** Writes dataCSV out. FileWriter without `true` - an export replaces. */
    public void exportCSV(String path) throws Exception {
        if (dataCSV == null) {
            throw new Exception("No CSV file has been imported");
        }
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(path))) {
            writer.write(dataCSV);
            writer.newLine();
        } catch (IOException e) {
            throw new Exception("Cannot write file: " + e.getMessage());
        }
    }

    private String format(String data, int column, boolean capitalise) throws Exception {
        if (data == null) {
            throw new Exception("No CSV file has been imported");
        }
        String[] lines = data.split("\\\\r?\\\\n", -1);
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < lines.length; i++) {
            if (i > 0) {
                result.append(NEW_LINE);
            }
            // Line 0 is the ID, Name, Email, Phone, Address header the brief
            // shows. Capitalising it would be harmless today and wrong the day
            // someone ships a header in lower case.
            result.append(formatLine(lines[i], column, capitalise && i > 0));
        }
        return result.toString();
    }

    private String formatLine(String line, int column, boolean capitalise) {
        if (line.trim().isEmpty()) {
            return "";
        }
        // split(",", -1) and never split(","). With the default limit Java
        // DROPS the trailing empty fields: "a,b," gives 2 elements, not 3 - so
        // a row whose Address is empty loses its last column and the very next
        // line throws ArrayIndexOutOfBoundsException. The -1 keeps it.
        String[] fields = line.split(",", -1);
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < fields.length; i++) {
            String field = fields[i].trim();
            if (i == column) {
                field = squeeze(field);
                if (capitalise) {
                    field = capitaliseWords(field);
                }
            }
            if (i > 0) {
                result.append(", ");
            }
            result.append(field);
        }
        return result.toString();
    }

    /** "Cau Giay     -   Ha    Noi" -> "Cau Giay - Ha Noi". */
    private String squeeze(String field) {
        return field.trim().replaceAll("\\\\s+", " ");
    }

    /**
     * "nguyen van a" -> "Nguyen Van A".
     *
     * Only the first character of each word is touched; the rest is left
     * exactly as typed, because that is literally what the brief asks for.
     * Lower-casing the tail as well would turn a deliberate "McDonald" into
     * "Mcdonald", which is a different requirement nobody wrote down.
     *
     * The string is squeezed first, so split(" ") cannot produce an empty word
     * and charAt(0) is always safe.
     */
    private String capitaliseWords(String field) {
        if (field.isEmpty()) {
            return field;
        }
        String[] words = field.split(" ");
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                result.append(' ');
            }
            result.append(Character.toUpperCase(words[i].charAt(0)))
                  .append(words[i].substring(1));
        }
        return result.toString();
    }
}
'''

P0076_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value >= min && value <= max) {
                    return value;
                }
                System.out.println("Please choose from " + min + " to " + max + ".");
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }
}
'''

P0076_MAIN = '''package ui;

import bo.CSVFormatter;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import utils.Validator;

/** The menu and the screen. */
public class Main {

    private static final String DEMO_FILE = "import.csv";

    /**
     * The customer's file, with the two faults the brief describes: redundant
     * whitespace in Name and Address. Row 3 has no space after its commas and
     * row 4 has an EMPTY Address - the trailing empty field that split(",")
     * throws away.
     */
    private static final String[] DEMO_ROWS = {
        "ID, Name, Email, Phone, Address",
        "1, Nguyen   van a, anv@gmail.com, 098889999, Cau Giay     -   Ha    Noi    - Viet Nam",
        "2, tran  thi   b, ttb@gmail.com, 0912345678, Thanh   Xuan   - Ha Noi - Viet Nam",
        "3,le  van   c ,lvc@gmail.com,0987654321,Hai   Chau  - Da  Nang - Viet Nam",
        "4, pham van d, pvd@gmail.com, 0900000000,",
    };

    public static void main(String[] args) {
        ensureDemoFile();
        CSVFormatter formatter = new CSVFormatter();
        boolean running = true;
        while (running) {
            printMenu();
            int choice = Validator.getInt("Please choice one option:", 1, 5);
            switch (choice) {
                case 1:
                    importCSV(formatter);
                    break;
                case 2:
                    formatAddress(formatter);
                    break;
                case 3:
                    formatName(formatter);
                    break;
                case 4:
                    exportCSV(formatter);
                    break;
                default:
                    running = false;
            }
        }
    }

    /**
     * A project that has just been unzipped has no CSV to import, so the
     * program writes the customer's sample file once and says so. On the second
     * run the file is already there and this line does not appear.
     */
    private static void ensureDemoFile() {
        File file = new File(DEMO_FILE);
        if (file.exists()) {
            return;
        }
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            for (String row : DEMO_ROWS) {
                writer.write(row);
                writer.newLine();
            }
            System.out.println("Demo data file created: " + DEMO_FILE);
        } catch (IOException e) {
            System.out.println("Cannot create " + DEMO_FILE + ": " + e.getMessage());
        }
    }

    private static void printMenu() {
        System.out.println("======= Format CSV Program =======");
        System.out.println("1. Import CSV");
        System.out.println("2. Format Address");
        System.out.println("3. Format Name");
        System.out.println("4. Export CSV");
        System.out.println("5. Exit");
    }

    private static void importCSV(CSVFormatter formatter) {
        System.out.println("--------- Import CSV -------");
        String path = Validator.getString("Enter Path:");
        try {
            formatter.importCSV(path);
            System.out.println("Import: Done");
            show(formatter);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void formatAddress(CSVFormatter formatter) {
        System.out.println("--------- Format Address -------");
        try {
            formatter.formatAddress(formatter.getDataCSV());
            System.out.println("Format: Done");
            show(formatter);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void formatName(CSVFormatter formatter) {
        System.out.println("--------- Format Name -------");
        try {
            formatter.formatName(formatter.getDataCSV());
            System.out.println("Format: Done");
            show(formatter);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void exportCSV(CSVFormatter formatter) {
        System.out.println("--------- Export CSV ------");
        String path = Validator.getString("Enter Path:");
        try {
            formatter.exportCSV(path);
            System.out.println("Export: Done");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * The brief's screen prints nothing but "Done", which means the user can
     * never see whether the standardising worked. The data is printed after
     * every step that changes it; the four lines the brief specifies are still
     * there, untouched and in order.
     */
    private static void show(CSVFormatter formatter) {
        System.out.println(formatter.getDataCSV());
    }
}
'''


solution(
    'J1.S.P0076',
    title_vi='Chuẩn hoá tệp CSV',
    files=[('src/bo/CSVFormatter.java', P0076_BO),
           ('src/utils/Validator.java', P0076_VALIDATOR),
           ('src/ui/Main.java', P0076_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — fresh directory: write the customer's messy file, import it,
        # format Name, format Address, export the result.
        ('1\nimport.csv\n'
         '3\n'
         '2\n'
         '4\nexport.csv\n'
         '5\n',
         'Demo data file created: import.csv\n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Import CSV -------\nEnter Path:Import: Done\nID, Name, Email, Phone, Address\n1, Nguyen   van a, anv@gmail.com, 098889999, Cau Giay     -   Ha    Noi    - Viet Nam\n2, tran  thi   b, ttb@gmail.com, 0912345678, Thanh   Xuan   - Ha Noi - Viet Nam\n3,le  van   c ,lvc@gmail.com,0987654321,Hai   Chau  - Da  Nang - Viet Nam\n4, pham van d, pvd@gmail.com, 0900000000,\n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Format Name -------\nFormat: Done\nID, Name, Email, Phone, Address\n1, Nguyen Van A, anv@gmail.com, 098889999, Cau Giay     -   Ha    Noi    - Viet Nam\n2, Tran Thi B, ttb@gmail.com, 0912345678, Thanh   Xuan   - Ha Noi - Viet Nam\n3, Le Van C, lvc@gmail.com, 0987654321, Hai   Chau  - Da  Nang - Viet Nam\n4, Pham Van D, pvd@gmail.com, 0900000000, \n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Format Address -------\nFormat: Done\nID, Name, Email, Phone, Address\n1, Nguyen Van A, anv@gmail.com, 098889999, Cau Giay - Ha Noi - Viet Nam\n2, Tran Thi B, ttb@gmail.com, 0912345678, Thanh Xuan - Ha Noi - Viet Nam\n3, Le Van C, lvc@gmail.com, 0987654321, Hai Chau - Da Nang - Viet Nam\n4, Pham Van D, pvd@gmail.com, 0900000000, \n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Export CSV ------\nEnter Path:Export: Done\n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:'),
        # Run 1 — a NEW process in the same directory. Formatting before
        # importing must not crash; then export.csv is imported and printed
        # back, which is the only real proof that run 0 wrote what it claimed.
        ('2\n'
         '1\nnosuch.csv\n'
         '1\nexport.csv\n'
         '5\n',
         "======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Format Address -------\nNo CSV file has been imported\n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Import CSV -------\nEnter Path:Path doesn't exist\n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:--------- Import CSV -------\nEnter Path:Import: Done\nID, Name, Email, Phone, Address\n1, Nguyen Van A, anv@gmail.com, 098889999, Cau Giay - Ha Noi - Viet Nam\n2, Tran Thi B, ttb@gmail.com, 0912345678, Thanh Xuan - Ha Noi - Viet Nam\n3, Le Van C, lvc@gmail.com, 0987654321, Hai Chau - Da Nang - Viet Nam\n4, Pham Van D, pvd@gmail.com, 0900000000, \n======= Format CSV Program =======\n1. Import CSV\n2. Format Address\n3. Format Name\n4. Export CSV\n5. Exit\nPlease choice one option:"),
    ],
    explain_en='''<p><strong>The design is not yours to choose here.</strong> The Guidelines give four
signatures — <code>importCSV(String path)</code>, <code>formatAddress(String dataCSV)</code>,
<code>formatName(String dataCSV)</code>, <code>exportCSV(String path)</code> — and every one of them
"sets the global variable dataCSV in class". So the whole file travels as a single
<code>String</code> and the class keeps one field. A <code>List&lt;Customer&gt;</code> would be the
better model: the columns would be typed, the formatting would be two one-line methods, and nothing
would depend on counting commas. It is not what was asked for, and "Use String manipulation" is an
instruction, not a hint. Notice it, honour the contract, and say both at the defence.</p>
<p><strong>The one line that decides whether this program works:
<code>line.split(",", -1)</code>.</strong> Run it before you believe it: <code>"a,b,".split(",")</code>
returns <strong>2</strong> elements, and <code>"a,b,".split(",", -1)</code> returns <strong>3</strong>.
Java's default limit of 0 throws away every trailing empty field. This file has five columns and Address
is the last one, so the first customer with no address recorded arrives as a four-element array and
<code>fields[4]</code> is an <code>ArrayIndexOutOfBoundsException</code> — on the customer's real data,
never on the sample. Row 4 of the demo file is exactly that row, so the crash is in the test set rather
than in the demonstration.</p>
<p><strong>Redundant whitespace, in one expression.</strong>
<code>field.trim().replaceAll("\\\\s+", " ")</code>: <code>trim()</code> removes the ends,
<code>\\s+</code> collapses every internal run of spaces, tabs and stray characters into one space.
"Cau Giay     -   Ha    Noi    - Viet Nam" becomes "Cau Giay - Ha Noi - Viet Nam", and the
<code>-</code> separators survive untouched because they are ordinary words as far as the split is
concerned — which is why the address rule can be pure whitespace work and needs to know nothing about
the punctuation.</p>
<p><strong>Capitalising, read literally.</strong> The brief says "change the first character of words to
uppercase" and its example is "Nguyen van a" → "Nguyen Van A". So only the first character is touched
and the rest of each word is left exactly as typed. The other reading — Title Case, lower-casing the
tail — gives the same answer for the brief's example and a different one for "McDonald", which it would
quietly turn into "Mcdonald". Where two readings agree on the example, take the one the words actually
say. Because the field has already been squeezed, <code>split(" ")</code> cannot produce an empty word,
so <code>charAt(0)</code> is safe without a length check.</p>
<p><strong>Carriage returns.</strong> <code>importCSV</code> reads with <code>readLine()</code>, which
accepts <code>\\n</code>, <code>\\r\\n</code> and <code>\\r</code> alike and returns the line without any of
them; the lines are then re-joined with this machine's separator. A file that came from Windows stops
being a Windows file the moment it is imported. Belt and braces: every field is <code>trim()</code>ed,
and <code>"a\\r".trim()</code> has length 1 — verified by running it — so even a stray
<code>\\r</code> reaching a field would not survive into the output.</p>
<p><strong>What was deliberately NOT handled, and why.</strong> Quoted fields. In real CSV,
<code>1,"Nguyen, van a",x</code> is three fields, and <code>split(",")</code> makes four of them — run
it and you get <code>[1, "Nguyen,  van a",  x]</code>, because <code>split</code> has never heard of
quotation marks. Handling that properly means RFC 4180: quotes around any field containing a comma, a
quote or a newline, and doubled <code>""</code> inside. The brief's stated format has no quoting at all,
so implementing it would be answering a different question — but knowing the limit of your own parser is
exactly what an examiner is probing when they ask "what if a name contains a comma?" The honest answer
is "this parser would split it in two, and here is what I would change".</p>
<p><strong>Why fields are re-joined with ", ".</strong> The customer's file mixes both conventions —
some rows have a space after the comma, row 3 has none. Trimming every field and rejoining with a single
<code>", "</code> makes the exported file consistent, which is the whole point of a program called
"Standardize CSV". The empty Address on row 4 stays empty: five columns in, five columns out.</p>
<p><strong>Two things the brief left out, and the choices made.</strong> Nothing is said about pressing 2
before 1, so <code>format()</code> throws <code>Exception("No CSV file has been imported")</code>
rather than a <code>NullPointerException</code>; and nothing is said about the message for a missing
import path, so it reuses <em>"Path doesn't exist"</em>, the wording the rest of this LAB211 set uses.
Both are invented, and both are the kind of thing worth flagging rather than hiding.</p>
<p><strong>One addition to the screen, made on purpose.</strong> The brief's expected screen prints
<code>Import: Done</code>, <code>Format: Done</code>, <code>Export: Done</code> and nothing else — which
means a user can run the whole program and never find out whether the standardising worked. The data is
printed after every step that changes it. The four specified lines are still there, character for
character and in order.</p>
<p><strong>The signatures disagree with each other.</strong> <code>formatAddress</code> is declared
<code>void</code> and <code>formatName</code> is declared to return <code>String</code>, although the
brief describes both as setting the same global. They are implemented exactly as declared —
<code>formatName</code> sets the field <em>and</em> returns it. Copying a contract faithfully, including
its inconsistencies, is what makes a marker's checklist tick.</p>
<p><strong>How this was verified.</strong> Two scripted runs sharing one working directory. Run 0 starts
in an empty project: it writes the customer's messy file, imports it, formats Name, formats Address, and
exports to <code>export.csv</code>. Run 1 is a <strong>new JVM</strong>: it presses 2 with nothing
imported (and is told so instead of crashing), asks for a file that does not exist, and then imports
<code>export.csv</code> — the file the previous process wrote — and prints it back. Every squeezed
address, every capitalised name and the empty fifth column of row 4 are visible in that second
transcript, which is the only proof that the export contained what the screen claimed.</p>
<p><strong>A word on encoding, tested rather than assumed.</strong> <code>FileReader</code> and
<code>FileWriter</code> use the platform default charset. Written and read by the same program on the
same machine they always agree, and a round trip of accented Vietnamese text was run to confirm it on
the JDK used here (21, where the default is UTF-8 since JEP 400). What must <em>not</em> be claimed is
that the exported file is UTF-8 everywhere: on JDK 17 or older on a Windows machine the same code writes
windows-1252, and the file will not open correctly elsewhere. The demo data is ASCII, exactly like the
brief's own sample, so nothing here depends on it — and if it did, the fix is to name the charset
explicitly instead of trusting the default.</p>''',
    explain_vi='''<p><strong>Ở bài này thiết kế không phải do bạn chọn.</strong> Phần Hướng dẫn đưa bốn chữ
ký — <code>importCSV(String path)</code>, <code>formatAddress(String dataCSV)</code>,
<code>formatName(String dataCSV)</code>, <code>exportCSV(String path)</code> — và tất cả đều "set to the
global variable dataCSV in class". Vậy nên cả tệp được truyền đi dưới dạng một <code>String</code> duy
nhất và lớp giữ đúng một trường. Một <code>List&lt;Customer&gt;</code> sẽ là mô hình tốt hơn: các cột có
kiểu, việc định dạng còn hai phương thức một dòng, và chẳng gì phụ thuộc vào việc đếm dấu phẩy. Nhưng đề
không hỏi thế, và "Use String manipulation" là một mệnh lệnh chứ không phải gợi ý. Hãy nhận ra điều đó,
tôn trọng hợp đồng, và nói cả hai khi bảo vệ.</p>
<p><strong>Một dòng quyết định chương trình này chạy được hay không:
<code>line.split(",", -1)</code>.</strong> Hãy chạy thử trước khi tin: <code>"a,b,".split(",")</code>
trả về <strong>2</strong> phần tử, còn <code>"a,b,".split(",", -1)</code> trả về <strong>3</strong>.
Giới hạn mặc định 0 của Java vứt bỏ mọi trường rỗng ở cuối. Tệp này có năm cột và Address là cột cuối,
nên khách hàng đầu tiên không ghi địa chỉ sẽ tới dưới dạng mảng bốn phần tử và <code>fields[4]</code> là
một <code>ArrayIndexOutOfBoundsException</code> — xảy ra trên dữ liệu thật của khách, không bao giờ trên
dữ liệu mẫu. Dòng 4 của tệp demo chính là dòng đó, nên cú đổ vỡ nằm trong bộ kiểm thử chứ không nằm
trong buổi trình bày.</p>
<p><strong>Khoảng trắng thừa, gói trong một biểu thức.</strong>
<code>field.trim().replaceAll("\\\\s+", " ")</code>: <code>trim()</code> cắt hai đầu, còn
<code>\\s+</code> gộp mọi cụm dấu cách, tab và ký tự trắng bên trong thành một dấu cách.
"Cau Giay     -   Ha    Noi    - Viet Nam" thành "Cau Giay - Ha Noi - Viet Nam", và các dấu
<code>-</code> vẫn nguyên vì với phép tách chúng chỉ là những "từ" bình thường — nhờ vậy luật cho địa chỉ
thuần tuý là chuyện khoảng trắng và không cần biết gì về dấu câu.</p>
<p><strong>Viết hoa, hiểu theo đúng chữ.</strong> Đề nói "change the first character of words to
uppercase" và ví dụ là "Nguyen van a" → "Nguyen Van A". Vậy chỉ ký tự đầu được đụng tới, phần còn lại của
mỗi từ giữ nguyên như đã gõ. Cách hiểu kia — Title Case, hạ chữ thường phần đuôi — cho cùng kết quả với
ví dụ của đề nhưng khác kết quả với "McDonald", nó sẽ lặng lẽ biến thành "Mcdonald". Khi hai cách hiểu
cho cùng đáp án trên ví dụ, hãy chọn cách đúng với câu chữ. Vì trường đã được nén khoảng trắng trước,
<code>split(" ")</code> không thể sinh ra từ rỗng, nên <code>charAt(0)</code> luôn an toàn mà không cần
kiểm độ dài.</p>
<p><strong>Ký tự xuống dòng của Windows.</strong> <code>importCSV</code> đọc bằng
<code>readLine()</code>, vốn chấp nhận cả <code>\\n</code>, <code>\\r\\n</code> lẫn <code>\\r</code> và trả
về dòng đã bỏ hết chúng; sau đó các dòng được nối lại bằng ký tự phân dòng của máy hiện tại. Một tệp đến
từ Windows thôi là tệp Windows ngay khi được nhập vào. Thêm một lớp bảo hiểm: mọi trường đều được
<code>trim()</code>, và <code>"a\\r".trim()</code> có độ dài 1 — đã chạy thử — nên dù một
<code>\\r</code> lọt được vào trường thì cũng không sống sót ra tới kết quả.</p>
<p><strong>Cái cố ý KHÔNG xử lý, và vì sao.</strong> Trường có dấu nháy kép. Trong CSV thật,
<code>1,"Nguyen, van a",x</code> là ba trường, còn <code>split(",")</code> cắt thành bốn — chạy thử sẽ
thấy <code>[1, "Nguyen,  van a",  x]</code>, vì <code>split</code> chưa từng nghe nói đến dấu nháy. Làm
cho đúng nghĩa là theo RFC 4180: bọc nháy quanh mọi trường chứa dấu phẩy, dấu nháy hay ký tự xuống dòng,
và nhân đôi <code>""</code> ở bên trong. Định dạng mà đề nêu hoàn toàn không có dấu nháy, nên cài đặt
phần đó là trả lời một câu hỏi khác — nhưng biết giới hạn bộ phân tích của chính mình đúng là thứ người
chấm dò khi hỏi "nếu tên có dấu phẩy thì sao?". Câu trả lời trung thực là "bộ này sẽ cắt nó làm đôi, và
đây là chỗ tôi sẽ sửa".</p>
<p><strong>Vì sao nối lại các trường bằng ", ".</strong> Tệp của khách trộn cả hai kiểu — vài dòng có dấu
cách sau dấu phẩy, dòng 3 thì không. Cắt hai đầu mọi trường rồi nối lại bằng đúng một <code>", "</code>
làm tệp xuất ra nhất quán, mà đó chính là mục đích của một chương trình tên là "Standardize CSV". Địa chỉ
rỗng ở dòng 4 vẫn rỗng: vào năm cột, ra năm cột.</p>
<p><strong>Hai chỗ đề bỏ ngỏ, và lựa chọn đã dùng.</strong> Đề không nói gì về việc bấm 2 trước khi bấm
1, nên <code>format()</code> ném <code>Exception("No CSV file has been imported")</code> thay vì một
<code>NullPointerException</code>; và đề cũng không nói thông báo cho đường dẫn nhập không tồn tại, nên
ta dùng lại <em>"Path doesn't exist"</em>, đúng cách diễn đạt mà cả bộ LAB211 này dùng. Cả hai đều là do
ta tự đặt, và đều thuộc loại nên nói ra chứ không nên giấu.</p>
<p><strong>Một bổ sung có chủ ý vào màn hình.</strong> Màn hình mẫu của đề chỉ in <code>Import:
Done</code>, <code>Format: Done</code>, <code>Export: Done</code> và không gì khác — nghĩa là người dùng
chạy hết chương trình mà vẫn không biết việc chuẩn hoá có chạy đúng không. Ở đây dữ liệu được in ra sau
mỗi bước làm nó thay đổi. Bốn dòng mà đề quy định vẫn còn nguyên, đúng từng ký tự và đúng thứ tự.</p>
<p><strong>Các chữ ký mâu thuẫn với nhau.</strong> <code>formatAddress</code> khai báo
<code>void</code> còn <code>formatName</code> khai báo trả về <code>String</code>, dù đề mô tả cả hai
đều đặt vào cùng một biến toàn cục. Ta cài đặt đúng như khai báo — <code>formatName</code> vừa gán
trường <em>vừa</em> trả về nó. Chép hợp đồng một cách trung thành, kể cả những chỗ nó tự mâu thuẫn, mới
là thứ làm người chấm tích đủ ô.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy theo kịch bản dùng chung một thư mục làm việc.
Lần 0 bắt đầu trong project rỗng: ghi ra tệp lộn xộn của khách, nhập vào, định dạng Name, định dạng
Address, rồi xuất ra <code>export.csv</code>. Lần 1 là một <strong>JVM mới</strong>: bấm 2 khi chưa nhập
gì (và được báo lỗi tử tế thay vì chết), hỏi một tệp không tồn tại, rồi nhập <code>export.csv</code> —
chính tệp mà tiến trình trước đã ghi — và in nó ra. Mọi địa chỉ đã nén, mọi tên đã viết hoa và cột thứ
năm rỗng của dòng 4 đều hiện ra trong bản ghi màn hình lần hai, và đó là bằng chứng duy nhất cho việc
tệp xuất ra đúng là thứ màn hình đã tuyên bố.</p>
<p><strong>Vài lời về bảng mã, có chạy thử chứ không phỏng đoán.</strong> <code>FileReader</code> và
<code>FileWriter</code> dùng bảng mã mặc định của nền tảng. Ghi và đọc bởi cùng một chương trình trên
cùng một máy thì chúng luôn khớp nhau, và một vòng ghi–đọc chữ Việt có dấu đã được chạy thử để xác nhận
trên JDK dùng ở đây (21, nơi mặc định là UTF-8 kể từ JEP 400). Điều <em>không</em> được phép tuyên bố là
tệp xuất ra luôn là UTF-8: trên JDK 17 trở về trước, trên máy Windows, cùng đoạn mã ấy ghi ra
windows-1252, và tệp sẽ mở sai ở nơi khác. Dữ liệu demo ở đây là ASCII, đúng như mẫu của chính đề, nên
không có gì phụ thuộc vào chuyện này — còn nếu có, cách sửa là chỉ định bảng mã tường minh thay vì tin
vào mặc định.</p>''',
    hints_en=[
        'Run "a,b,".split(",") and "a,b,".split(",", -1) — 2 elements versus 3. An empty Address needs the -1.',
        'trim() then replaceAll("\\\\s+", " ") turns "Ha    Noi" into "Ha Noi" and leaves the - separators alone.',
        'The brief says uppercase the FIRST character only — do not lower-case the rest of the word.',
        'Keep the declared signatures exactly: formatAddress is void, formatName returns String, both set the global dataCSV.',
        'Pressing 2 before 1 must not throw NullPointerException — check that dataCSV was imported first.',
    ],
    hints_vi=[
        'Chạy thử "a,b,".split(",") và "a,b,".split(",", -1) — 2 phần tử so với 3. Địa chỉ rỗng cần tham số -1.',
        'trim() rồi replaceAll("\\\\s+", " ") biến "Ha    Noi" thành "Ha Noi" và không đụng tới các dấu -.',
        'Đề yêu cầu viết hoa ký tự ĐẦU TIÊN thôi — đừng hạ chữ thường phần còn lại của từ.',
        'Giữ nguyên chữ ký như đề khai báo: formatAddress là void, formatName trả về String, cả hai đều gán biến toàn cục dataCSV.',
        'Bấm 2 trước khi bấm 1 không được ném NullPointerException — hãy kiểm tra dataCSV đã được nhập chưa.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0075': '''<h3>Bối cảnh</h3>
<p>Bài này tách ra từ dự án CBDT: một module xử lý tệp tin chạy trên console. Nó luyện các thao tác cơ
bản nhất với hệ thống tệp trong Java — kiểm tra một đường dẫn, duyệt thư mục có lọc, đọc và ghi thêm nội
dung — và luyện thói quen tách phần thao tác tệp (ném ngoại lệ, không in) khỏi phần màn hình.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình xử lý tệp gồm các chức năng:</p>
<ul>
<li>Nhập một đường dẫn rồi kiểm tra nó có tồn tại không? Nếu có, đó là đường dẫn tới tệp hay tới thư
mục?</li>
<li>Nhập đường dẫn một thư mục rồi liệt kê tất cả tệp có phần mở rộng <code>.java</code>.</li>
<li>Nhập đường dẫn một thư mục và một số nguyên <em>n</em> (KB). Tìm mọi tệp trong thư mục có kích thước
&gt; <em>n</em> và in ra màn hình.</li>
<li>Nhập đường dẫn một tệp rồi ghi thêm nội dung nhập từ bàn phím vào tệp đó.</li>
<li>Nhập đường dẫn một tệp <code>.txt</code>, đếm số từ trong tệp (mỗi từ cách nhau bởi khoảng
trắng).</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn</h4>
<p>Người dùng chạy chương trình, chương trình hiện thực đơn và mời chọn. Người dùng chọn xong thì thực
hiện Chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo lựa chọn</h4>
<ul>
<li><strong>Tuỳ chọn 1 — Kiểm tra đường dẫn</strong>: nhập một đường dẫn và kiểm tra nó có tồn tại
không. Nếu không, báo <code>Path doesn't exist</code>. Nếu có, báo đó là đường dẫn tệp hay thư mục.</li>
<li><strong>Tuỳ chọn 2 — Liệt kê tệp .java</strong>: nhập một đường dẫn và kiểm tra tồn tại. Nếu không,
báo <code>Path doesn't exist</code>. Hiển thị số lượng tệp <code>.java</code>.</li>
<li><strong>Tuỳ chọn 3 — Liệt kê tệp lớn hơn kích thước nhập vào</strong>: nhập kích thước <em>n</em>
(KB), kiểm tra <em>n</em> phải là số; nếu là kiểu khác thì báo <code>Value of size is digit</code>. Nhập
một đường dẫn; nếu không tồn tại thì báo <code>Path doesn't exist</code> và mời nhập lại. Hiển thị số
lượng tệp và in tên các tệp có kích thước &gt; <em>n</em> trong thư mục.</li>
<li><strong>Tuỳ chọn 4 — Ghi thêm nội dung từ bàn phím vào tệp</strong>: nhập nội dung muốn thêm, rồi
nhập đường dẫn tệp; nếu không tồn tại thì báo <code>Path doesn't exist</code> và mời nhập lại. Báo đã
ghi thêm thành công.</li>
<li><strong>Tuỳ chọn 5 — Đếm từ trong tệp .txt</strong>: nhập đường dẫn tới tệp <code>.txt</code>, in ra
tổng số từ của tệp.</li>
<li><strong>Tuỳ chọn 6 — Thoát chương trình.</strong></li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>============ File Processing =========
1. Check Path
2. Get file name with type java
3. Get file with size greater than input
4. Write more content to file
5. Read file and count characters
6. Exit
Please choice one option:1
---------- Check Path ---------
Enter Path:d:\\
Path to Directory

Please choice one option:1
---------- Check Path ---------
Enter Path:abc
Path doesn't exist

Please choice one option:3
--------- Get file with size greater than input --------
Enter Size(Integer):a
Value of size is digit
Enter Size(Integer):4
Enter Path:D:\\
av.rar
nfsc.exe
Result 7 files!

Please choice one option:4
------ Write more content to file ----
Enter Content:input data
Enter Path:d:\\text.txt
Path doesn't exist
Enter Path:d:\\test.txt
Write done

Please choice one option:5
---- Read file an count characters ----
Enter Path:d:\\test.txt
Total:3</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức sau: <code>checkInputPath</code>,
<code>getAllFileNameJavaInDirectory</code>, <code>getFileWithSizeGreaterThanInput</code>,
<code>appendContentToFile</code>, <code>countCharacter</code>.</p>
<p>Dùng các lớp <code>java.io.BufferedReader</code>, <code>java.io.BufferedWriter</code>,
<code>java.io.File</code>, <code>java.io.FileFilter</code>, <code>java.io.FileReader</code>,
<code>java.io.FileWriter</code>, <code>java.io.FilenameFilter</code>, <code>java.io.IOException</code>,
<code>java.util.ArrayList</code>, <code>java.util.List</code> để thao tác tệp.</p>
<h4>Hàm 1: Kiểm tra đường dẫn</h4>
<ul>
<li>Cài đặt: <code>public void checkInputPath(String path) throws Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn tệp hoặc thư mục.</li>
<li>Giá trị trả về: <code>Exception("Path doesn't exist")</code> · <code>Exception("Path to file")</code>
· <code>Exception("Path to Directory")</code>.</li>
</ul>
<h4>Hàm 2: Liệt kê mọi tệp .java</h4>
<ul>
<li>Cài đặt: <code>List&lt;String&gt; getAllFileNameJavaInDirectory(String path) throws Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn.</li>
<li>Giá trị trả về: danh sách tên tệp · <code>Exception("Path doesn't exist")</code>.</li>
</ul>
<h4>Hàm 3: Tìm tệp có kích thước lớn hơn n</h4>
<ul>
<li>Cài đặt: <code>public static File[] getFileWithSizeGreaterThanInput(String path, int size) throws
Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn; <code>size</code> — kích thước tệp.</li>
<li>Giá trị trả về: danh sách tệp · <code>Exception("Path doesn't exist")</code>.</li>
</ul>
<h4>Hàm 4: Ghi thêm nội dung nhập từ bàn phím</h4>
<ul>
<li>Cài đặt: <code>public boolean appendContentToFile(String path, String contentInput) throws
Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn tệp; <code>contentInput</code> — nội dung nhập từ bàn
phím.</li>
<li>Giá trị trả về: trạng thái ghi tệp · <code>Exception("Path doesn't exist")</code>.</li>
</ul>
<h4>Hàm 5: Đếm số từ ngăn cách bởi khoảng trắng trong tệp</h4>
<ul>
<li>Cài đặt: <code>public int countCharacter(String path) throws Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn tệp.</li>
<li>Giá trị trả về: số lượng từ · <code>Exception("Path doesn't exist")</code>.</li>
</ul>
<p><em>Lưu ý về mâu thuẫn trong đề gốc</em>: ảnh màn hình mẫu in <code>Size is digit</code> trong khi
phần đặc tả yêu cầu <code>Value of size is digit</code> — phần đặc tả bằng chữ là bản có hiệu lực. Tên
hàm là <code>countCharacter</code> nhưng cả đặc tả lẫn mô tả đều là <em>đếm từ</em>; vẫn giữ nguyên tên
vì người chấm dò theo tên. Danh sách lớp trong đề gốc ghi <code>java.io.BufferedReade</code>, đúng ra là
<code>java.io.BufferedReader</code>.</p>''',

    'J1.S.P0076': '''<h3>Bối cảnh</h3>
<p>Khách hàng gửi tới một tệp CSV gồm các cột: <code>ID, Name, Email, Phone, Address</code>.</p>
<ul>
<li>Cột <strong>Name</strong> yêu cầu mỗi từ cách nhau đúng một khoảng trắng và ký tự đầu của mỗi từ viết
hoa.</li>
<li>Cột <strong>Address</strong> yêu cầu mỗi từ cách nhau đúng một khoảng trắng.</li>
</ul>
<p>Tuy nhiên tệp CSV đang có 2 lỗi ở hai cột <strong>Name</strong> và <strong>Address</strong>.</p>
<pre>Name:    Nguyen   van a                              đúng ra phải là: Nguyen Van A
Address: Cau Giay     - Ha    Noi    - Viet Nam       đúng ra phải là: Cau Giay - Ha Noi - Viet Nam</pre>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình chuẩn hoá tệp CSV với thực đơn: 1. Import CSV · 2. Format Address · 3. Format Name ·
4. Export CSV · 5. Exit.</p>
<ul>
<li>Chọn <strong>1</strong>: yêu cầu người dùng nhập đường dẫn tệp csv; kiểm tra tệp có tồn tại
không.</li>
<li>Chọn <strong>2</strong>: bỏ khoảng trắng thừa ở cột địa chỉ.</li>
<li>Chọn <strong>3</strong>: bỏ khoảng trắng thừa và viết hoa ký tự đầu mỗi từ ở cột tên.</li>
<li>Chọn <strong>4</strong>: yêu cầu nhập tên tệp rồi xuất ra tệp theo định dạng mà người dùng đã
chọn.</li>
<li>Chọn <strong>5</strong>: kết thúc chương trình.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn</h4>
<p>Người dùng chạy chương trình, chương trình hiện thực đơn và mời chọn; chọn xong thì thực hiện Chức
năng 2.</p>
<h4>Chức năng 2: Thực hiện theo lựa chọn</h4>
<ul>
<li><strong>Tuỳ chọn 1 — Import CSV</strong>: nhập đường dẫn tệp, kiểm tra tệp tồn tại hay không.</li>
<li><strong>Tuỳ chọn 2 — Kiểm tra định dạng Address</strong>: bỏ khoảng trắng thừa ở các trường địa
chỉ.</li>
<li><strong>Tuỳ chọn 3 — Kiểm tra định dạng Name</strong>: bỏ khoảng trắng thừa và đổi ký tự đầu mỗi từ
thành chữ hoa.</li>
<li><strong>Tuỳ chọn 4 — Export CSV</strong>: nhập tên tệp, xuất ra tệp theo định dạng người dùng đã
chọn.</li>
<li><strong>Tuỳ chọn 5 — Thoát chương trình.</strong></li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>======= Format CSV Program =======
1. Import CSV
2. Format Address
3. Format Name
4. Export CSV
5. Exit
Please choice one option:1
--------- Import CSV -------
Enter Path:d:\\import.csv
Import: Done

Please choice one option:2
--------- Format Address -------
Format: Done

Please choice one option:3
--------- Format Name -------
Format: Done

Please choice one option:4
--------- Export CSV ------
Enter Path:d:\\export.csv
Export: Done

Please choice one option:5</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>importCSV</code>,
<code>formatAddress</code>, <code>formatName</code>, <code>exportCSV</code>. Dùng các thao tác trên
chuỗi (String manipulation).</p>
<p>Định dạng tệp csv như sau:</p>
<pre>ID, Name, Email, Phone, Address
1, Nguyen van a, anv@gmail.com, 098889999, Cau Giay  -   Ha Noi - Viet Nam</pre>
<h4>Hàm 1: Đọc tệp csv</h4>
<ul>
<li>Cài đặt: <code>void importCSV(String path) throws Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn tệp.</li>
<li>Đầu ra: gán vào biến toàn cục <code>dataCSV</code> của lớp · danh sách ngoại lệ.</li>
</ul>
<h4>Hàm 2: Định dạng cột Address</h4>
<ul>
<li>Cài đặt: <code>void formatAddress(String dataCSV) throws Exception</code></li>
<li>Đầu vào: <code>dataCSV</code> — dữ liệu trong tệp csv.</li>
<li>Đầu ra: gán vào biến toàn cục <code>dataCSV</code> của lớp · danh sách ngoại lệ.</li>
</ul>
<h4>Hàm 3: Định dạng cột Name</h4>
<ul>
<li>Cài đặt: <code>String formatName(String dataCSV) throws Exception</code></li>
<li>Đầu vào: <code>dataCSV</code> — dữ liệu trong tệp csv.</li>
<li>Đầu ra: gán vào biến toàn cục <code>dataCSV</code> của lớp · danh sách ngoại lệ.</li>
</ul>
<h4>Hàm 4: Xuất tệp CSV</h4>
<ul>
<li>Cài đặt: <code>void exportCSV(String path) throws Exception</code></li>
<li>Đầu vào: <code>path</code> — đường dẫn tệp mới; dữ liệu lấy từ biến toàn cục <code>dataCSV</code>
của lớp.</li>
<li>Đầu ra: danh sách ngoại lệ.</li>
</ul>
<p><em>Lưu ý về mâu thuẫn trong đề gốc</em>: <code>formatAddress</code> khai báo trả về
<code>void</code> còn <code>formatName</code> khai báo trả về <code>String</code>, dù đề mô tả cả hai
đều gán vào cùng biến toàn cục. Đề cũng không quy định thông báo khi tệp nhập không tồn tại, và không
nói điều gì xảy ra nếu người dùng bấm 2 hoặc 3 trước khi bấm 1.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
