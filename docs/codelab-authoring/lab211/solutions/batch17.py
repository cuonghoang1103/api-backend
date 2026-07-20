# Batch 17 — J1.S.P0059 (text files: filter people by salary, copy the unique
# words of a file) and J1.S.P0011 (convert a number between base 2, 10 and 16).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0059 — The program handles files (73 LOC)
# ════════════════════════════════════════════════════════════════

P0059_PERSON = r'''package entity;

import java.io.Serializable;

/**
 * One line of the data file, after it has been parsed.
 *
 * salary is a double and not a String: the whole point of Function 1 is to
 * COMPARE salaries and to sort by them, and "1000" sorts before "700" when they
 * are text. Parsing once, at the edge of the program, means every later
 * comparison is arithmetic instead of guesswork.
 *
 * The class knows nothing about files, minimum salaries or menus. It is the
 * shape of a row, and nothing else.
 */
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private String address;
    private double salary;

    public Person() {
    }

    public Person(String name, String address, double salary) {
        this.name = name;
        this.address = address;
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    /**
     * The row as the report shows it.
     *
     * Fixed field widths, not tab characters. A '\t' table looks aligned until
     * one name is longer than the tab stop and then the whole column steps
     * sideways - and names are exactly the kind of data that varies in length.
     */
    @Override
    public String toString() {
        return String.format("%-10s %-15s %10.1f", name, address, salary);
    }
}
'''

P0059_BO = r'''package bo;

import entity.Person;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Both file jobs the brief names, and nothing else. This class never prints:
 * it returns a list, or it throws with the brief's own wording, and the screen
 * layer decides what the user sees.
 *
 * The two signatures are copied from the Guidelines character for character -
 * getPerson is an instance method, copyWordOneTimes is static. That asymmetry
 * is not a typo in this file; it is what the sheet asks for, and a marker who
 * greps for the signature has to find it exactly.
 */
public class FileProcessor {

    // The brief spells these three messages out, and a marker diffs them. Two
    // of them contain a curly apostrophe (U+2019), not the ASCII one - so they
    // are written as Unicode escapes. javac turns the escape into the character
    // before it even looks at the syntax, which means the message survives being
    // saved, e-mailed or compiled under a different file encoding. A literal
    // curly quote pasted into the source would not.
    private static final String NO_PATH = "Path doesn't exist";
    private static final String NO_READ = "Can\u2019t read file";
    private static final String NO_WRITE = "Can\u2019t write file";

    /**
     * Function 1: every person in the file earning at least `money`, sorted so
     * the poorest is first and the richest is last.
     *
     * The sort is not decoration. The brief defines the output as "person who
     * have the least money on the head of list, person who have the most money
     * on the last list", so Max and Min are simply the two ends of the returned
     * list and the screen layer never has to search for them.
     */
    public List<Person> getPerson(String path, double money) throws Exception {
        File file = new File(path);
        if (!file.exists() || !file.isFile()) {
            throw new Exception(NO_PATH);
        }

        List<Person> found = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                Person person = parse(line);
                if (person.getSalary() >= money) {
                    found.add(person);
                }
            }
        } catch (IOException e) {
            // "It is not there" and "it is there but I could not read it" are
            // different failures with different messages in the brief, so they
            // are detected in different places: existence above, I/O here.
            throw new Exception(NO_READ);
        }

        // Collections.sort is a STABLE sort, which matters here: several people
        // can share a salary (everyone whose salary was unreadable ends up on
        // 0), and a stable sort leaves those in file order instead of shuffling
        // them differently on every run.
        Collections.sort(found, Comparator.comparingDouble(Person::getSalary));
        return found;
    }

    /**
     * One line -> one Person.
     *
     * split(";", -1) with the negative limit keeps trailing empty fields. With
     * the default limit "Lan;Hue;" collapses to two parts and the missing salary
     * looks like a two-field line; with -1 it stays three parts, the third one
     * empty, which is what it really is.
     */
    private Person parse(String line) {
        String[] parts = line.split(";", -1);
        String name = parts[0].trim();
        String address = parts.length > 1 ? parts[1].trim() : "";
        String salary = parts.length > 2 ? parts[2].trim() : "";
        return new Person(name, address, toSalary(salary));
    }

    /**
     * The brief's rule: a salary that is not a number, or is not there at all,
     * becomes zero. So the failure is CAUGHT and turned into data - the file is
     * still read to the end, and one broken line does not lose the other four.
     */
    private double toSalary(String text) {
        try {
            double value = Double.parseDouble(text);
            return value < 0 ? 0 : value;
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * Function 2: write every distinct word of `source` into `destination`, one
     * per line.
     *
     * A LinkedHashSet rather than a HashSet: both make "have I seen this word?"
     * instant, but the linked one keeps the order the words first appeared in.
     * A file that reshuffles its own lines between two runs of the same program
     * is very hard to trust, and impossible to diff.
     *
     * A word here is whatever whitespace separates. The brief gives no rule for
     * punctuation, and a program that quietly strips characters out of the
     * user's text is doing more than it was asked to - so "Hello," is copied as
     * "Hello,". Say this out loud at the defence; it is a decision, not an
     * oversight.
     */
    public static boolean copyWordOneTimes(String source, String destination) throws Exception {
        File file = new File(source);
        if (!file.exists() || !file.isFile()) {
            throw new Exception(NO_PATH);
        }

        Set<String> words = new LinkedHashSet<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                for (String word : line.trim().split("\\s+")) {
                    if (!word.isEmpty()) {
                        words.add(word);
                    }
                }
            }
        } catch (IOException e) {
            throw new Exception(NO_READ);
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(destination))) {
            for (String word : words) {
                writer.write(word);
                writer.newLine();
            }
        } catch (IOException e) {
            throw new Exception(NO_WRITE);
        }
        return true;
    }
}
'''

P0059_SAMPLE = r'''package utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

/**
 * Lays down a small data file the first time the program runs, and does nothing
 * at all on every run after that.
 *
 * Why this class exists: the brief's screen types the path "d:\test.txt", a file
 * that only ever existed on the author's machine. A submission that cannot be
 * run by the person marking it is a submission that scores nothing, so the
 * program brings its own test data. The behaviour is deliberately invisible -
 * if the file is already there it is left exactly as it is, so the marker can
 * edit it, or point the program at a completely different file, and this class
 * will never overwrite their work.
 *
 * It is also one call in Main and one class here: delete both lines and the
 * program is unchanged. That is the test for whether a convenience has been
 * bolted on cleanly.
 */
public class SampleData {

    public static final String DEFAULT_FILE = "test.txt";

    private static final String[] LINES = {
        "Nghia;Ha Noi;1000",
        "Thanh;Ha Noi;1200",
        "Phuong;Ha Noi;1300",
        "Hoang;Da Nang;abc",
        "Lan;Hue;700",
    };

    private SampleData() {
    }

    public static void createIfMissing(String path) {
        File file = new File(path);
        if (file.exists()) {
            return;
        }
        try (FileWriter writer = new FileWriter(file)) {
            for (String line : LINES) {
                writer.write(line);
                writer.write(System.lineSeparator());
            }
        } catch (IOException e) {
            // A missing sample file is not an error: the user may be about to
            // type the path of their own file, and the menu works either way.
            // Crashing on start-up because a convenience failed would be the
            // tail wagging the dog.
        }
    }
}
'''

P0059_VALIDATOR = r'''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner, never closed: closing a Scanner over System.in closes
 * System.in itself, and the next read anywhere in the program then throws. A
 * second `new Scanner(System.in)` in another class is the same bug wearing a
 * different hat - it buffers ahead and swallows lines the first one needed.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getString(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("You must input something.");
        }
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
     * The minimum salary typed at the keyboard.
     *
     * This one re-asks instead of defaulting to zero. The "wrong format becomes
     * zero" rule in the brief is about the DATA FILE, which cannot be asked
     * again; a person at a keyboard can be, and silently searching from 0
     * because they mistyped would hand them a wrong answer that looks right.
     */
    public static double getMoney(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(line);
                if (value < 0) {
                    System.out.println("Money must not be less than 0.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }
}
'''

P0059_MAIN = r'''package ui;

import bo.FileProcessor;
import entity.Person;
import java.util.List;
import utils.SampleData;
import utils.Validator;

/**
 * The menu and the screen. Every message the brief prints is in this file, and
 * every decision about files is in bo - which is why the two can be marked
 * separately.
 */
public class Main {

    public static void main(String[] args) {
        // First run only: put a small test.txt beside the program so the menu
        // has something to open. See utils.SampleData for why.
        SampleData.createIfMissing(SampleData.DEFAULT_FILE);

        FileProcessor processor = new FileProcessor();
        boolean running = true;
        while (running) {
            System.out.println("========== File Processing =========");
            System.out.println("1. Find person info");
            System.out.println("2. Copy Text to new file");
            System.out.println("3. Exit");
            int choice = Validator.getInt("Enter your choice: ", 1, 3);
            switch (choice) {
                case 1:
                    findPerson(processor);
                    break;
                case 2:
                    copyText();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }

    private static void findPerson(FileProcessor processor) {
        System.out.println("--------- Person info ---------");
        String path = Validator.getString("Enter Path:");
        double money = Validator.getMoney("Enter Money:");
        try {
            List<Person> people = processor.getPerson(path, money);
            System.out.println("------------- Result ----------");
            if (people.isEmpty()) {
                System.out.println("No person found.");
                return;
            }
            System.out.printf("%-10s %-15s %10s%n", "Name", "Address", "Money");
            for (Person person : people) {
                System.out.println(person);
            }
            System.out.println();
            // The list arrived sorted, so the extremes are its two ends. No
            // second pass, and no chance of the two answers disagreeing with
            // the table printed above them.
            System.out.println("Max: " + people.get(people.size() - 1).getName());
            System.out.println("Min: " + people.get(0).getName());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void copyText() {
        System.out.println("------------- Copy text --------------");
        String source = Validator.getString("Enter Source: ");
        String destination = Validator.getString("Enter new file name: ");
        try {
            // copyWordOneTimes returns the copy status the brief asks for, so
            // the message is printed off the returned value rather than off
            // "we got this far without an exception".
            if (FileProcessor.copyWordOneTimes(source, destination)) {
                System.out.println("Copy done...");
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''


# The verified consoles. Captured from real runs, never typed from memory.
P0059_RUN0 = '''========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: --------- Person info ---------
Enter Path:Enter Money:Path doesn't exist
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: --------- Person info ---------
Enter Path:Enter Money:------------- Result ----------
Name       Address              Money
Nghia      Ha Noi              1000.0
Thanh      Ha Noi              1200.0
Phuong     Ha Noi              1300.0

Max: Phuong
Min: Nghia
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: --------- Person info ---------
Enter Path:Enter Money:------------- Result ----------
Name       Address              Money
Hoang      Da Nang                0.0
Lan        Hue                  700.0
Nghia      Ha Noi              1000.0
Thanh      Ha Noi              1200.0
Phuong     Ha Noi              1300.0

Max: Phuong
Min: Hoang
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: ------------- Copy text --------------
Enter Source: Enter new file name: Copy done...
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: Goodbye.'''

P0059_RUN1 = '''========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: Please choose from 1 to 3.
Enter your choice: --------- Person info ---------
Enter Path:Enter Money:------------- Result ----------
Name       Address              Money
Nghia      Ha                     0.0
Noi        1000                   0.0
Thanh      Ha                     0.0
Noi        1200                   0.0
Phuong     Ha                     0.0
Noi        1300                   0.0
Hoang      Da                     0.0
Nang       abc                    0.0
Lan        Hue                  700.0

Max: Lan
Min: Nghia
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: ------------- Copy text --------------
Enter Source: Enter new file name: Copy done...
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: ------------- Copy text --------------
Enter Source: Enter new file name: Path doesn't exist
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: ------------- Copy text --------------
Enter Source: Enter new file name: Can’t write file
========== File Processing =========
1. Find person info
2. Copy Text to new file
3. Exit
Enter your choice: Goodbye.'''


solution(
    'J1.S.P0059',
    title_vi='Chương trình xử lý tệp văn bản',
    files=[('src/entity/Person.java', P0059_PERSON),
           ('src/bo/FileProcessor.java', P0059_BO),
           ('src/utils/SampleData.java', P0059_SAMPLE),
           ('src/utils/Validator.java', P0059_VALIDATOR),
           ('src/ui/Main.java', P0059_MAIN)],
    main_class='ui.Main',
    runs=[
        # RUN 0 — the first process. words.txt does not exist yet, so asking for
        # it must fail; then the brief's own screen; then the file is written.
        ('1\nwords.txt\n0\n'
         '1\ntest.txt\n800\n'
         '1\ntest.txt\n0\n'
         '2\ntest.txt\nwords.txt\n'
         '3\n', P0059_RUN0),
        # RUN 1 — a SECOND process in the same directory. The very same request
        # that failed in run 0 now succeeds and prints the file's contents: the
        # only thing that changed is that run 0 wrote it.
        ('9\n1\nwords.txt\n0\n'
         '2\nwords.txt\nwords2.txt\n'
         '2\nnothing.txt\nx.txt\n'
         '2\ntest.txt\nno_such_dir/out.txt\n'
         '3\n', P0059_RUN1),
    ],
    explain_en='''<p><strong>The Guidelines pin down two signatures, and they are not symmetrical.</strong>
The sheet asks for <code>public List&lt;Person&gt; getPerson(String path, double money) throws
Exception</code> and <code>public static boolean copyWordOneTimes(String source, String destination)
throws Exception</code>. One is an instance method, the other is static. That is odd, and it is copied
anyway: a marker greps for the signature, and "I improved it" is not a defence when the sheet is the
contract. Both live in <code>bo.FileProcessor</code>, which returns a list or throws, and never
prints.</p>
<p><strong>The three exception messages, character for character — including the apostrophe.</strong>
The brief writes <code>Path doesn't exist</code> with an ordinary ASCII apostrophe and <code>Can’t read
file</code> / <code>Can’t write file</code> with a curly one (U+2019, the character Word inserts
automatically). They are different characters, and a marker diffing the console sees the difference. The
two curly ones are therefore written as Unicode escapes in the source: javac turns the escape into the
character before it even parses, so the message survives being e-mailed, zipped, or compiled on a
machine whose default file encoding is not UTF-8. A literal ’ pasted into the file does not always
survive that trip.</p>
<p><strong>Sorting is not decoration here — it IS the answer to Max and Min.</strong> The brief defines
the output as "person who have the least money on the head of list, person who have the most money on
the last list". So <code>getPerson</code> returns the list sorted ascending by salary, and the screen
reads the two extremes off the two ends: <code>get(0)</code> and <code>get(size - 1)</code>. No second
pass over the data, and — more importantly — no way for the table and the two summary lines to disagree
with each other, which is exactly what happens when Max is computed separately from the list that gets
printed.</p>
<p><strong>Why <code>Collections.sort</code> and not a hand-rolled bubble sort.</strong> Beyond being
shorter: it is documented as a <em>stable</em> sort. That matters in this program because a broken
salary becomes 0, so several people can end up sharing a salary, and a stable sort leaves those in the
order the file listed them instead of reshuffling them differently on each run. A report that changes
its own row order between two runs over identical data is very hard to trust.</p>
<p><strong>A bad salary is caught and turned into data, not thrown.</strong> The rule in the brief is
"if the salary of some person is in wrong format (not a number, not inputted) to set it to default value
zero". So <code>NumberFormatException</code> is swallowed on purpose and becomes <code>0</code>. This is
the one place in the program where swallowing an exception is right: throwing would lose the other four
people because of one damaged line. A negative number in the file is clamped to 0 too — the sheet says
"the amount not less than 0".</p>
<p><strong>Two kinds of failure, two messages, two places to detect them.</strong> "The file is not
there" and "the file is there but I could not read it" are separate outcomes in the brief with separate
wording, so they are found separately: <code>File.exists()</code> before opening gives <code>Path
doesn't exist</code>, and any <code>IOException</code> during the read gives <code>Can’t read
file</code>. Catching everything in one place and printing one message would be smaller code and a
worse answer.</p>
<p><strong>Function 2: a <code>LinkedHashSet</code>, and a definition of "word" you must be able to
defend.</strong> The set gives "have I already seen this word?" for free; the <em>linked</em> variant
keeps the words in the order they first appeared, so running the program twice over the same input
produces byte-identical output. As for what a word is: the brief gives no rule about punctuation, so a
word is whatever whitespace separates, and <code>Hello,</code> is copied as <code>Hello,</code>. A
program that silently strips characters out of the user's text is doing more than it was asked to. Say
this out loud at the defence — it is a decision, not an oversight.</p>
<p><strong>The test-data problem, and how it is solved without touching the design.</strong> The brief's
screen types <code>d:\\test.txt</code>, a path that only ever existed on the author's machine. A
submission the marker cannot run scores nothing, so <code>utils.SampleData</code> lays down a five-line
<code>test.txt</code> beside the program the first time it starts, and does <em>nothing at all</em> if
the file is already there — so the marker can edit it, or point the program at a completely different
file, and it will never be overwritten. It is one class and one call in <code>main</code>: delete both
and the program is unchanged. That is the test of whether a convenience was bolted on cleanly.</p>
<p><strong>How this was verified, and why one run could not have proved it.</strong> A program that
writes files is only proven when a <em>different process</em> finds what it wrote. So there are two
scripted runs in the same directory. Run 1 asks for <code>words.txt</code> and is told <code>Path
doesn't exist</code>; it then reads <code>test.txt</code> (reproducing the brief's own screen exactly:
Nghia 1000.0, Thanh 1200.0, Phuong 1300.0, Max Phuong, Min Nghia) and finally writes
<code>words.txt</code>. Run 2 is a brand-new JVM that asks the <em>identical</em> question that failed
before — and gets nine rows of data. Nothing in the program changed between those two runs; only the
disk did. That is the proof.</p>
<p><strong>Reading the word file back as a person file is a deliberate cross-check.</strong> It is not
a mistake in the script. <code>words.txt</code> contains lines such as <code>Nghia;Ha</code> and
<code>Noi;1000</code> — two fields, no third — so every row comes back with salary <code>0.0</code>
except <code>Lan;Hue;700</code>. That single screen simultaneously demonstrates that run 1's output file
really is on disk with the content expected, and that the "salary not inputted → zero" rule fires on
real data rather than only in theory.</p>
<p><strong>One <code>Scanner</code>, static, never closed.</strong> Closing a <code>Scanner</code> that
wraps <code>System.in</code> closes <code>System.in</code> itself, and the next keyboard read anywhere
in the program throws. A second <code>new Scanner(System.in)</code> in another class is the same bug in
a different costume: it buffers ahead and swallows lines the first one still needed. One instance in
<code>utils.Validator</code>, private constructor, all methods static.</p>
<p><strong>What the marker will actually try.</strong> A menu choice of 9 (re-asked, not crashed); a
source file that does not exist (<code>Path doesn't exist</code>); and a destination inside a folder
that does not exist, which is how <code>Can’t write file</code> is reached — the scripted second run
does all three, in that order, before exiting.</p>
<p><strong>Where the brief disagrees with itself.</strong> Four places, all resolved in favour of the
Guidelines. (1) The expected screen prints the menu without numbers while the Function details number
the options 1, 2, 3 — the numbers are printed, because the user has to type one. (2) The screen aligns
its table with tab characters; this solution uses <code>printf</code> field widths, because a tabbed
table stays aligned only until a name is longer than the tab stop. (3) The prompt is <code>Enter
Path:</code> with no space but <code>Enter Source: </code> with one — copied exactly as written,
inconsistency included, because that is what gets diffed. (4) The suggested import list contains
<code>java.io.BufferedReade</code>, which is not a class; the intended
<code>java.io.BufferedReader</code> is used.</p>''',
    explain_vi='''<p><strong>Phần Hướng dẫn chốt cứng hai chữ ký, và chúng không đối xứng.</strong> Đề
yêu cầu <code>public List&lt;Person&gt; getPerson(String path, double money) throws Exception</code> và
<code>public static boolean copyWordOneTimes(String source, String destination) throws Exception</code>.
Một cái là phương thức của đối tượng, cái kia là static. Nghe kỳ, và vẫn phải chép y nguyên: người chấm
dò theo chữ ký, và "em cải tiến cho đẹp hơn" không phải là lý do bào chữa khi đề là bản có hiệu lực. Cả
hai nằm trong <code>bo.FileProcessor</code> — lớp này trả về danh sách hoặc ném ngoại lệ, và không bao
giờ in ra màn hình.</p>
<p><strong>Ba câu thông báo lỗi, đúng từng ký tự — kể cả dấu nháy.</strong> Đề viết <code>Path doesn't
exist</code> bằng dấu nháy ASCII thường, còn <code>Can’t read file</code> / <code>Can’t write file</code>
bằng dấu nháy cong (U+2019, ký tự Word tự động thay vào). Đó là hai ký tự khác nhau, và người chấm so
màn hình sẽ thấy khác. Vì vậy hai câu có dấu nháy cong được viết bằng Unicode escape trong mã nguồn:
javac đổi escape thành ký tự trước cả khi phân tích cú pháp, nên câu thông báo sống sót qua việc gửi
mail, nén zip, hay biên dịch trên máy có bảng mã mặc định không phải UTF-8. Một dấu ’ dán thẳng vào tệp
thì không phải lúc nào cũng sống sót chuyến đi đó.</p>
<p><strong>Sắp xếp ở đây không phải để trang trí — nó CHÍNH LÀ đáp án cho Max và Min.</strong> Đề định
nghĩa đầu ra là "người ít tiền nhất ở đầu danh sách, người nhiều tiền nhất ở cuối danh sách". Nên
<code>getPerson</code> trả về danh sách đã sắp tăng dần theo lương, và tầng màn hình chỉ việc lấy hai
đầu: <code>get(0)</code> và <code>get(size - 1)</code>. Không phải duyệt lại lần hai, và quan trọng hơn:
bảng dữ liệu và hai dòng tổng kết không thể mâu thuẫn nhau — điều luôn xảy ra khi Max được tính riêng,
tách khỏi chính danh sách được in.</p>
<p><strong>Vì sao dùng <code>Collections.sort</code> chứ không tự viết bubble sort.</strong> Ngoài
chuyện ngắn hơn: nó được tài liệu bảo đảm là sắp xếp <em>ổn định</em>. Điều đó quan trọng trong bài này
vì lương hỏng bị quy về 0, nên nhiều người có thể cùng một mức lương; sắp xếp ổn định giữ họ đúng thứ tự
trong tệp thay vì xáo lại khác nhau mỗi lần chạy. Một báo cáo tự đổi thứ tự dòng giữa hai lần chạy trên
cùng dữ liệu là báo cáo rất khó tin.</p>
<p><strong>Lương hỏng thì bắt lấy và biến thành dữ liệu, không ném đi.</strong> Luật trong đề là "nếu
lương của ai đó sai định dạng (không phải số, hoặc bỏ trống) thì đặt về giá trị mặc định 0". Nên
<code>NumberFormatException</code> bị nuốt một cách có chủ ý và trở thành <code>0</code>. Đây là chỗ duy
nhất trong chương trình mà nuốt ngoại lệ là đúng: ném ra sẽ làm mất bốn người còn lại chỉ vì một dòng
hỏng. Số âm trong tệp cũng bị kéo về 0 — đề ghi "số tiền không nhỏ hơn 0".</p>
<p><strong>Hai kiểu hỏng, hai câu thông báo, hai chỗ phát hiện.</strong> "Tệp không tồn tại" và "tệp có
đó nhưng không đọc được" là hai kết cục riêng với hai câu chữ riêng trong đề, nên chúng được phát hiện
riêng: <code>File.exists()</code> trước khi mở cho ra <code>Path doesn't exist</code>, còn mọi
<code>IOException</code> trong lúc đọc cho ra <code>Can’t read file</code>. Gộp tất cả vào một chỗ và in
một câu thì mã ngắn hơn nhưng bài kém hơn.</p>
<p><strong>Chức năng 2: một <code>LinkedHashSet</code>, và một định nghĩa "từ" mà bạn phải bảo vệ
được.</strong> Set cho ta "đã gặp từ này chưa?" gần như miễn phí; bản <em>linked</em> giữ các từ đúng
thứ tự xuất hiện lần đầu, nên chạy hai lần trên cùng đầu vào cho ra tệp giống hệt nhau từng byte. Còn
"từ" là gì: đề không nói gì về dấu câu, nên từ là thứ được ngăn cách bởi khoảng trắng, và
<code>Hello,</code> được chép nguyên là <code>Hello,</code>. Một chương trình lặng lẽ cắt bớt ký tự
trong văn bản của người dùng là làm nhiều hơn phần được giao. Hãy nói thẳng điều này khi bảo vệ — đó là
một lựa chọn, không phải sơ suất.</p>
<p><strong>Bài toán dữ liệu thử, và cách giải mà không đụng vào thiết kế.</strong> Màn hình mẫu của đề
gõ đường dẫn <code>d:\\test.txt</code>, một tệp chỉ từng tồn tại trên máy tác giả. Bài nộp mà người chấm
không chạy được thì bằng không, nên <code>utils.SampleData</code> đặt sẵn một <code>test.txt</code> năm
dòng bên cạnh chương trình trong lần chạy đầu tiên, và <em>không làm gì cả</em> nếu tệp đã có — để người
chấm có thể sửa nó, hoặc trỏ chương trình sang một tệp hoàn toàn khác, mà không bao giờ bị ghi đè. Nó
chỉ là một lớp và một lời gọi trong <code>main</code>: xoá cả hai thì chương trình vẫn nguyên vẹn. Đó là
phép thử xem một tiện ích có được gắn vào một cách sạch sẽ hay không.</p>
<p><strong>Đã kiểm chứng thế nào, và vì sao một lần chạy không thể chứng minh được.</strong> Một chương
trình ghi tệp chỉ được coi là đúng khi một <em>tiến trình khác</em> tìm thấy thứ nó đã ghi. Nên có hai
lần chạy được kịch bản hoá trong cùng một thư mục. Lần 1 hỏi <code>words.txt</code> và nhận
<code>Path doesn't exist</code>; sau đó đọc <code>test.txt</code> (tái hiện đúng màn hình mẫu của đề:
Nghia 1000.0, Thanh 1200.0, Phuong 1300.0, Max Phuong, Min Nghia); cuối cùng ghi ra
<code>words.txt</code>. Lần 2 là một JVM hoàn toàn mới, hỏi <em>đúng câu hỏi</em> vừa thất bại lúc nãy —
và nhận về chín dòng dữ liệu. Không có gì trong chương trình thay đổi giữa hai lần chạy; chỉ có đĩa thay
đổi. Đó mới là bằng chứng.</p>
<p><strong>Việc đọc ngược tệp từ vựng như một tệp danh sách người là cố ý.</strong> Không phải nhầm lẫn
trong kịch bản. <code>words.txt</code> chứa những dòng như <code>Nghia;Ha</code> và <code>Noi;1000</code>
— hai trường, không có trường thứ ba — nên mọi dòng trả về đều có lương <code>0.0</code>, trừ
<code>Lan;Hue;700</code>. Một màn hình đó cùng lúc chứng minh hai việc: tệp lần 1 ghi ra thật sự nằm
trên đĩa với đúng nội dung mong đợi, và luật "lương bỏ trống → 0" thật sự chạy trên dữ liệu thật chứ
không chỉ trên lý thuyết.</p>
<p><strong>Một <code>Scanner</code> duy nhất, static, không bao giờ đóng.</strong> Đóng một
<code>Scanner</code> bọc <code>System.in</code> là đóng luôn <code>System.in</code>, và lần đọc bàn phím
kế tiếp ở bất cứ đâu trong chương trình sẽ ném ngoại lệ. Tạo thêm một <code>new Scanner(System.in)</code>
ở lớp khác là cùng một lỗi khoác áo khác: nó đọc đệm trước và nuốt mất những dòng mà cái thứ nhất còn
cần. Một thực thể duy nhất trong <code>utils.Validator</code>, constructor private, mọi phương thức
static.</p>
<p><strong>Người chấm sẽ thử những gì.</strong> Chọn menu số 9 (hỏi lại, không chết); nguồn là tệp không
tồn tại (<code>Path doesn't exist</code>); và đích nằm trong thư mục không tồn tại — đó chính là cách
chạm tới <code>Can’t write file</code>. Lần chạy kiểm thứ hai làm đủ cả ba, theo đúng thứ tự đó, rồi mới
thoát.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Bốn chỗ, đều xử theo phần Hướng dẫn. (1) Màn hình mẫu in thực
đơn không có số thứ tự trong khi phần Chi tiết chức năng đánh số 1, 2, 3 — ở đây có in số, vì người dùng
phải gõ một con số. (2) Màn hình mẫu căn bảng bằng ký tự tab; lời giải này dùng độ rộng trường của
<code>printf</code>, vì bảng căn bằng tab chỉ thẳng hàng cho tới khi có cái tên dài hơn điểm dừng tab.
(3) Lời nhắc là <code>Enter Path:</code> không có dấu cách nhưng <code>Enter Source: </code> lại có —
chép y nguyên, giữ cả sự thiếu nhất quán, vì đó là thứ bị đem ra so. (4) Danh sách import gợi ý ghi
<code>java.io.BufferedReade</code>, một lớp không tồn tại; ở đây dùng <code>java.io.BufferedReader</code>
như ý đề định nói.</p>''',
    hints_en=[
        'Copy the two signatures from the Guidelines exactly — one is an instance method, the other is static.',
        'Sort the found list ascending by salary; then Max is the last element and Min is the first.',
        'A salary that is not a number, or is missing, becomes 0 — catch it, do not throw, or one bad line loses the whole file.',
        'Check the file exists yourself for "Path doesn\'t exist"; let an IOException become "Can\u2019t read file".',
        'Use a LinkedHashSet for the words so the new file keeps the order they first appeared in.',
    ],
    hints_vi=[
        'Chép nguyên hai chữ ký trong phần Hướng dẫn — một cái là phương thức đối tượng, cái kia là static.',
        'Sắp danh sách tìm được tăng dần theo lương; khi đó Max là phần tử cuối, Min là phần tử đầu.',
        'Lương không phải số hoặc bỏ trống thì thành 0 — bắt lấy chứ đừng ném, kẻo một dòng hỏng làm mất cả tệp.',
        'Tự kiểm tra tệp có tồn tại để ra "Path doesn\'t exist"; để IOException thành "Can\u2019t read file".',
        'Dùng LinkedHashSet cho các từ để tệp mới giữ đúng thứ tự chúng xuất hiện lần đầu.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0011 — Change base number system (16, 10, 2) (100 LOC)
# ════════════════════════════════════════════════════════════════

P0011_BASE = r'''package entity;

/**
 * The three numeral systems the brief allows, each carrying its own radix and
 * the short name the report prints.
 *
 * An enum rather than three int constants: with an int, `convert(value, 2, 16)`
 * and `convert(value, 16, 2)` are the same call with the arguments swapped and
 * the compiler cannot tell them apart from a typo. With Base, a wrong value is
 * not a wrong number - it does not exist, so it does not compile.
 */
public enum Base {

    // The order is load-bearing: the menu offers 1/2/3 and fromChoice() maps
    // straight onto it, so BINARY must stay first. Anyone inserting a base here
    // has to renumber the menu in the same breath - which is why the mapping is
    // written down in one method instead of being spread over a switch.
    BINARY(2, "BIN"),
    DECIMAL(10, "DEC"),
    HEXADECIMAL(16, "HEX");

    private final int radix;
    private final String label;

    Base(int radix, String label) {
        this.radix = radix;
        this.label = label;
    }

    public int getRadix() {
        return radix;
    }

    public String getLabel() {
        return label;
    }

    /** Menu number (1, 2, 3) -> the base it stands for. */
    public static Base fromChoice(int choice) {
        return values()[choice - 1];
    }
}
'''

P0011_BO = r'''package bo;

import entity.Base;

/**
 * The conversion itself, done by hand.
 *
 * Java can do this in two library calls - Integer.parseInt(text, radix) and
 * Integer.toString(value, radix) - and in production code that is the right
 * answer. It is not the answer here: those two calls ARE the exercise, and
 * handing them to the library leaves nothing to mark. They are named in the
 * comments beside each method so you can say at the defence that you know they
 * exist and why you did not use them.
 *
 * Everything goes through decimal. Converting base 2 straight to base 16 needs
 * a separate rule for every ordered pair of bases; converting to a long in the
 * middle needs exactly two rules for any number of bases, and long IS a number,
 * not "the decimal one" - the base only exists in the text at each end.
 */
public class BaseConverter {

    /**
     * Digit character -> value, by position. Index 10 is 'A', which is the whole
     * answer to "why does hexadecimal use letters": base 16 needs sixteen
     * distinct one-character digits and the Arabic numerals only supply ten, so
     * six more symbols had to be borrowed. There is nothing numeric about A-F;
     * they are simply the next six symbols that were lying around.
     */
    private static final String DIGITS = "0123456789ABCDEF";

    public String convert(String value, Base from, Base to) throws Exception {
        return fromDecimal(toDecimal(value, from), to);
    }

    /**
     * Text in some base -> the number it denotes. (Library equivalent:
     * Long.parseLong(text, base.getRadix()).)
     *
     * Horner's method: start at 0 and, for every digit left to right, multiply
     * what you have by the radix and add the new digit. That is the same thing
     * as summing digit * radix^position, but with no powers to compute and no
     * position index to get wrong.
     */
    public long toDecimal(String value, Base base) throws Exception {
        String text = value.trim().toUpperCase();

        // The sign is handled here and nowhere else. The digits after it are an
        // ordinary unsigned number in the chosen base, so the rest of the loop
        // never has to think about it.
        boolean negative = text.startsWith("-");
        if (negative || text.startsWith("+")) {
            text = text.substring(1);
        }
        if (text.isEmpty()) {
            throw new Exception(reject(value, base));
        }

        long result = 0;
        for (int i = 0; i < text.length(); i++) {
            int digit = DIGITS.indexOf(text.charAt(i));

            // TWO different ways to be an invalid digit, and both must be
            // caught. 'G' is not a digit in any of these systems at all
            // (indexOf returns -1). '2' IS a digit - it just does not exist in
            // base 2, where the only legal symbols are 0 and 1. Checking only
            // for -1 would happily read "2" as binary and print a confident
            // wrong answer, which is far worse than a refusal.
            if (digit < 0 || digit >= base.getRadix()) {
                throw new Exception(reject(value, base));
            }

            // Overflow in Java is silent: the value wraps round and the program
            // prints a plausible lie. Checking BEFORE multiplying is the only
            // way to notice, because afterwards the evidence is gone.
            if (result > (Long.MAX_VALUE - digit) / base.getRadix()) {
                throw new Exception("The value is too big for this program.");
            }
            result = result * base.getRadix() + digit;
        }
        return negative ? -result : result;
    }

    /**
     * A number -> its text in some base. (Library equivalent:
     * Long.toString(value, base.getRadix()).)
     *
     * Divide by the radix, keep the remainder, repeat until nothing is left.
     * The remainders come out least significant FIRST, so the string is built
     * backwards and reversed once at the end - cheaper and clearer than
     * inserting at index 0 on every step.
     */
    public String fromDecimal(long value, Base base) {
        // Zero has to be written out by hand: the loop below runs zero times
        // for it and would return an empty string. Every base writes zero as
        // the single symbol "0", so there is no special case beyond this line.
        if (value == 0) {
            return "0";
        }

        boolean negative = value < 0;
        // Math.abs is safe here only because toDecimal's overflow guard makes
        // Long.MIN_VALUE unreachable - abs(Long.MIN_VALUE) is still negative.
        long left = Math.abs(value);

        StringBuilder digits = new StringBuilder();
        while (left > 0) {
            digits.append(DIGITS.charAt((int) (left % base.getRadix())));
            left /= base.getRadix();
        }
        if (negative) {
            digits.append('-');
        }
        return digits.reverse().toString();
    }

    private String reject(String value, Base base) {
        return value + " is not a valid " + base.getLabel() + " number.";
    }
}
'''

P0011_VALIDATOR = r'''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place: one static Scanner that is
 * never closed, because closing a Scanner over System.in closes System.in and
 * every later read in the program throws.
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
     * The value to convert is read as TEXT and checked by the converter, not
     * here. "1G" is a perfectly good hexadecimal-looking string and a perfectly
     * bad hexadecimal number - only something that knows the chosen base can
     * tell, and that knowledge lives in bo.
     */
    public static String getString(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("You must input something.");
        }
    }
}
'''

P0011_MAIN = r'''package ui;

import bo.BaseConverter;
import entity.Base;
import utils.Validator;

/**
 * The menu and the screen, nothing else. The loop repeats until 0 is chosen,
 * which is what "repetitive until users close the program" means.
 */
public class Main {

    public static void main(String[] args) {
        BaseConverter converter = new BaseConverter();
        boolean running = true;

        while (running) {
            System.out.println("======= CHANGE BASE NUMBER SYSTEM =======");
            System.out.println("1. Binary (base 2)");
            System.out.println("2. Decimal (base 10)");
            System.out.println("3. Hexadecimal (base 16)");
            System.out.println("0. Exit");
            System.out.println("=========================================");

            int input = Validator.getInt("Choose the INPUT base: ", 0, 3);
            if (input == 0) {
                running = false;
                System.out.println("Goodbye.");
                continue;
            }
            int output = Validator.getInt("Choose the OUTPUT base: ", 1, 3);

            Base from = Base.fromChoice(input);
            Base to = Base.fromChoice(output);
            String value = Validator.getString("Enter the input value: ");

            try {
                String result = converter.convert(value, from, to);
                System.out.println(value + " (" + from.getLabel() + ") = "
                        + result + " (" + to.getLabel() + ")");
            } catch (Exception e) {
                // A bad digit is the user's mistake, not the program's: report
                // it and go straight back to the menu, still running.
                System.out.println(e.getMessage());
            }
        }
    }
}
'''


P0011_RUN0 = '''======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: You must input a number.
Choose the INPUT base: Please choose from 0 to 3.
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 535 (DEC) = 217 (HEX)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 217 (HEX) = 535 (DEC)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 27 (DEC) = 11011 (BIN)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 11011 (BIN) = 27 (DEC)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 1G is not a valid HEX number.
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 2 is not a valid BIN number.
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 0 (DEC) = 0 (BIN)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: -27 (DEC) = -11011 (BIN)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: ff (HEX) = 11111111 (BIN)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Choose the OUTPUT base: Enter the input value: 007 (DEC) = 7 (DEC)
======= CHANGE BASE NUMBER SYSTEM =======
1. Binary (base 2)
2. Decimal (base 10)
3. Hexadecimal (base 16)
0. Exit
=========================================
Choose the INPUT base: Goodbye.'''


solution(
    'J1.S.P0011',
    title_vi='Chuyển đổi hệ cơ số (16, 10, 2)',
    files=[('src/entity/Base.java', P0011_BASE),
           ('src/bo/BaseConverter.java', P0011_BO),
           ('src/utils/Validator.java', P0011_VALIDATOR),
           ('src/ui/Main.java', P0011_MAIN)],
    main_class='ui.Main',
    runs=[
        ('x\n5\n'          # not a number, then out of range
         '2\n3\n535\n'     # the brief's example 1
         '3\n2\n217\n'     # the brief's example 2
         '2\n1\n27\n'      # the brief's example 3
         '1\n2\n11011\n'   # the brief's example 4
         '3\n2\n1G\n'      # G is not a digit anywhere
         '1\n2\n2\n'       # 2 IS a digit, but not in base 2
         '2\n1\n0\n'       # zero
         '2\n1\n-27\n'     # negative
         '3\n1\nff\n'      # lower case hex
         '2\n2\n007\n'     # leading zeros, same base in and out
         '0\n', P0011_RUN0),
    ],
    explain_en='''<p><strong>The brief has no expected screen at all — and that changes what is being
marked.</strong> The "Expectation of User interface" heading is followed by nothing; the only concrete
things on the sheet are four hand-worked conversions in the Guidelines. So the menu wording is yours to
design, and those four numbers are the contract. All four were checked before a line was written: 535
(DEC) = 217 (HEX) and 217 (HEX) = 535 (DEC) are the same fact stated twice (2·256 + 1·16 + 7 = 535), and
27 (DEC) = 11011 (BIN) with 11011 (BIN) = 27 (DEC) likewise (16 + 8 + 2 + 1 = 27). The sheet is
arithmetically sound; its only slip is writing "HEC" for HEX.</p>
<p><strong>Everything goes through a <code>long</code>, and that is the design decision.</strong> Three
bases give six ordered pairs, and writing a rule for each is six chances to be wrong. Converting text →
number → text needs exactly <em>two</em> rules no matter how many bases exist, and adding base 8
tomorrow is one extra enum constant and no new algorithm. It is worth being precise about what the
middle value is: a <code>long</code> is not "the decimal one". It is a number. Base is a property of
<em>writing</em> a number down, not of the number itself, and it only exists in the <code>String</code>
at each end of the conversion.</p>
<p><strong>Why hexadecimal uses letters, which is the question the examiner asks.</strong> Base 16 needs
sixteen distinct one-character digits. The Arabic numerals supply ten. So six more symbols had to be
borrowed, and A–F were simply the next six symbols lying around; there is nothing numeric about them.
<code>A</code> is a symbol standing for ten in exactly the way <code>5</code> is a symbol standing for
five. In the code this is not a special case at all — it is one string,
<code>"0123456789ABCDEF"</code>, in which a digit's value <em>is</em> its index.</p>
<p><strong>And why base 16 is the one people picked.</strong> 16 = 2⁴, so one hex digit is exactly four
bits, always, with no carrying between them. Converting binary to hex is regrouping the bits in fours
and looking each group up — not arithmetic. The verified run shows it: <code>ff</code> (HEX) =
<code>11111111</code> (BIN), which is <code>f</code> = <code>1111</code> written twice. That is why a
colour is <code>#FF0000</code> and not <code>#111111110000000000000000</code>.</p>
<p><strong>Reading a number: Horner's method, not powers.</strong> Start at 0 and, for each digit left
to right, multiply what you have by the radix and add the new digit. It computes the same sum as
Σ digit × radix<sup>position</sup> but with no <code>Math.pow</code>, no floating point anywhere near an
integer answer, and no position index to get off by one. Writing a number is the mirror image: divide by
the radix and keep the remainder until nothing is left. The remainders come out least significant first,
so the string is built backwards and reversed once at the end — cheaper and clearer than inserting at
index 0 on every step.</p>
<p><strong>There are TWO ways to be an invalid digit, and only catching one is the classic bug.</strong>
A marker will type <code>1G</code> in hexadecimal: <code>G</code> is not a digit in any of these systems,
so <code>indexOf</code> returns −1 and it is rejected. But a marker will also type <code>2</code> in
binary — and <code>2</code> <em>is</em> a digit, a perfectly ordinary one, that simply does not exist in
base 2. A program that only checks for −1 reads it happily and prints a confident wrong answer, which is
far worse than a refusal. Hence the single condition <code>digit &lt; 0 || digit &gt;=
base.getRadix()</code>: unknown symbol, or known symbol too big for this base.</p>
<p><strong>Zero has to be written out by hand.</strong> The divide-and-remainder loop runs zero times
for it and would return an empty string — a bug that never shows up until someone types 0, which is
exactly what a marker does. Every base writes zero as the single symbol <code>0</code>, so the special
case is one line long and there is nothing else to it.</p>
<p><strong>Negative input: the sign is stripped once and put back once.</strong> After the minus is
removed, the digits are an ordinary unsigned number in the chosen base, so no other line in either loop
has to think about signs. The deliberate choice is <em>sign-and-magnitude</em>: −27 (DEC) prints as
<code>-11011</code> (BIN), not as a two's-complement pattern. Two's complement is a width-dependent
representation — the same −27 is <code>11100101</code> in 8 bits and something much longer in 32 — and
this program has no width to speak of. Sign-and-magnitude is what "write 27 in binary and it is
negative" means on paper, and it round-trips: convert it back and you get −27.</p>
<p><strong>Overflow is checked before the multiply, not after.</strong> Java does not complain when a
<code>long</code> overflows; the value silently wraps round and the program prints a plausible lie.
Afterwards the evidence is gone, so the guard <code>result &gt; (Long.MAX_VALUE - digit) / radix</code>
runs first. That check is also what makes <code>Math.abs</code> safe later:
<code>Math.abs(Long.MIN_VALUE)</code> is still negative, and the guard is what keeps
<code>Long.MIN_VALUE</code> unreachable.</p>
<p><strong>The two library calls that were deliberately not used.</strong>
<code>Long.parseLong(text, radix)</code> and <code>Long.toString(value, radix)</code> do this whole
assignment in two lines, and in production code they are the right answer. They are not the answer here:
they <em>are</em> the exercise, and handing it to the library leaves nothing to mark. Both are named in
the comments above the methods that replace them — an examiner counts knowing the library and choosing
not to use it as a point in your favour, and not knowing it as a point against.</p>
<p><strong>Why an enum and not three ints.</strong> With <code>int</code> parameters,
<code>convert(value, 2, 16)</code> and <code>convert(value, 16, 2)</code> are the same call with the
arguments swapped, and the compiler cannot tell a deliberate one from a typo. With <code>Base</code>, a
wrong value does not compile because it does not exist; the radix and the printed label
(<code>BIN</code>/<code>DEC</code>/<code>HEX</code>) travel with the constant instead of living in a
lookup somewhere else. The one coupling worth stating out loud is that the enum's declaration order is
what makes menu choice 1/2/3 map onto it, so that mapping is written down in a single method,
<code>fromChoice</code>, rather than smeared over a switch.</p>
<p><strong>How this was verified.</strong> One scripted session covers, in order: a non-numeric menu
choice and an out-of-range one; the brief's four worked examples; <code>1G</code> in hexadecimal;
<code>2</code> in binary; <code>0</code>; <code>-27</code>; lower-case <code>ff</code> (input is
upper-cased before it is read, so case never reaches the digit lookup); and <code>007</code> converted
decimal-to-decimal, which prints <code>7</code> and shows that leading zeros are consumed rather than
copied. The console was captured from a real run, not written from memory.</p>
<p><strong>The one thing invented here, said plainly.</strong> The brief specifies no wording for a
rejected value, so the message is this solution's own: <code>1G is not a valid HEX number.</code> It
names the offending input and the base it was judged against, because "Invalid input" tells a user
nothing about which of the two things they got wrong.</p>''',
    explain_vi='''<p><strong>Đề không có màn hình mẫu nào cả — và điều đó đổi luôn thứ được chấm.</strong>
Mục "Expectation of User interface" bỏ trống; thứ cụ thể duy nhất trên đề là bốn phép đổi làm tay trong
phần Hướng dẫn. Vậy nên phần chữ nghĩa của thực đơn là do bạn thiết kế, còn bốn con số kia là bản có
hiệu lực. Cả bốn đã được kiểm trước khi viết dòng mã đầu tiên: 535 (DEC) = 217 (HEX) và 217 (HEX) = 535
(DEC) là cùng một sự thật nói hai lần (2·256 + 1·16 + 7 = 535), tương tự 27 (DEC) = 11011 (BIN) và 11011
(BIN) = 27 (DEC) (16 + 8 + 2 + 1 = 27). Số học của đề chuẩn; lỗi duy nhất là gõ "HEC" thay vì HEX.</p>
<p><strong>Mọi thứ đi qua một <code>long</code>, và đó chính là quyết định thiết kế.</strong> Ba hệ cơ số
cho sáu cặp có thứ tự, viết riêng một luật cho mỗi cặp là sáu cơ hội sai. Đổi văn bản → số → văn bản chỉ
cần đúng <em>hai</em> luật bất kể có bao nhiêu hệ cơ số, và mai thêm hệ 8 thì chỉ là một hằng enum nữa,
không thêm thuật toán nào. Cũng nên nói chính xác giá trị ở giữa là gì: một <code>long</code> không phải
"số hệ thập phân". Nó là một con số. Cơ số là tính chất của việc <em>viết</em> một con số ra, không phải
của bản thân con số, và nó chỉ tồn tại trong chuỗi <code>String</code> ở hai đầu phép đổi.</p>
<p><strong>Vì sao hệ 16 phải dùng chữ cái — đây đúng là câu người chấm sẽ hỏi.</strong> Cơ số 16 cần mười
sáu ký hiệu một chữ khác nhau. Chữ số Ả Rập chỉ cho mười. Nên phải mượn thêm sáu ký hiệu nữa, và A–F đơn
giản là sáu ký hiệu có sẵn ngay cạnh đó; chúng chẳng có gì "số học" cả. <code>A</code> là ký hiệu đại
diện cho mười đúng theo cái cách <code>5</code> là ký hiệu đại diện cho năm. Trong mã nguồn đây thậm chí
không phải trường hợp đặc biệt — chỉ là một chuỗi <code>"0123456789ABCDEF"</code>, trong đó giá trị của
một chữ số <em>chính là</em> vị trí của nó.</p>
<p><strong>Và vì sao người ta chọn đúng cơ số 16.</strong> 16 = 2⁴, nên một chữ số hex đúng bằng bốn
bit, luôn luôn, không có nhớ qua lại. Đổi nhị phân sang hex là gom bit thành từng nhóm bốn rồi tra bảng
— không phải phép tính. Lần chạy đã kiểm chứng cho thấy điều đó: <code>ff</code> (HEX) =
<code>11111111</code> (BIN), tức là <code>f</code> = <code>1111</code> viết hai lần. Đó là lý do một mã
màu được viết <code>#FF0000</code> chứ không phải <code>#111111110000000000000000</code>.</p>
<p><strong>Đọc một con số: dùng lược đồ Horner, không dùng luỹ thừa.</strong> Bắt đầu từ 0, với mỗi chữ
số từ trái sang phải thì nhân cái đang có với cơ số rồi cộng chữ số mới. Nó tính ra đúng tổng
Σ chữ_số × cơ_số<sup>vị_trí</sup> nhưng không cần <code>Math.pow</code>, không có số thực lảng vảng gần
một kết quả nguyên, và không có chỉ số vị trí nào để lệch một đơn vị. Viết một con số ra là ảnh gương của
việc đó: chia cho cơ số và giữ phần dư cho tới khi hết. Các phần dư ra theo thứ tự từ hàng thấp nhất
trước, nên chuỗi được dựng ngược rồi đảo một lần ở cuối — rẻ hơn và rõ hơn là chèn vào vị trí 0 ở mỗi
bước.</p>
<p><strong>Có HAI cách để một chữ số là không hợp lệ, và chỉ bắt một cách là lỗi kinh điển.</strong>
Người chấm sẽ gõ <code>1G</code> ở hệ 16: <code>G</code> không phải chữ số trong bất kỳ hệ nào ở đây, nên
<code>indexOf</code> trả −1 và nó bị từ chối. Nhưng người chấm cũng sẽ gõ <code>2</code> ở hệ 2 — mà
<code>2</code> <em>là</em> một chữ số, hoàn toàn bình thường, chỉ là không tồn tại trong cơ số 2. Chương
trình chỉ kiểm −1 sẽ đọc nó ngon lành rồi in ra một đáp án sai đầy tự tin, còn tệ hơn nhiều so với việc
từ chối. Vì thế mới có một điều kiện duy nhất <code>digit &lt; 0 || digit &gt;= base.getRadix()</code>:
ký hiệu lạ, hoặc ký hiệu quen nhưng quá lớn so với cơ số này.</p>
<p><strong>Số 0 phải viết riêng bằng tay.</strong> Vòng lặp chia-lấy-dư chạy 0 lần với nó và sẽ trả về
chuỗi rỗng — một lỗi không bao giờ lộ ra cho tới khi có người gõ số 0, mà đó đúng là việc người chấm
làm. Mọi hệ cơ số đều viết số không bằng một ký hiệu <code>0</code>, nên trường hợp đặc biệt này dài đúng
một dòng và không có gì hơn.</p>
<p><strong>Đầu vào âm: dấu được tách ra một lần và gắn lại một lần.</strong> Sau khi bỏ dấu trừ, phần
chữ số là một số không dấu bình thường trong cơ số đã chọn, nên không dòng nào khác trong hai vòng lặp
phải bận tâm về dấu. Lựa chọn có chủ ý ở đây là <em>dấu-và-độ-lớn</em>: −27 (DEC) in ra
<code>-11011</code> (BIN), không phải một mẫu bù hai. Bù hai là cách biểu diễn <em>phụ thuộc độ
rộng</em> — cùng số −27 là <code>11100101</code> với 8 bit và dài hơn hẳn với 32 bit — mà chương trình
này không có khái niệm độ rộng nào cả. Dấu-và-độ-lớn đúng với nghĩa "viết 27 ở hệ nhị phân, và nó âm"
khi làm trên giấy, và nó đổi ngược lại được: đổi về là ra đúng −27.</p>
<p><strong>Tràn số được kiểm TRƯỚC phép nhân, không phải sau.</strong> Java không kêu ca gì khi một
<code>long</code> tràn; giá trị lặng lẽ quay vòng và chương trình in ra một lời nói dối rất hợp lý. Sau
đó thì chứng cứ không còn nữa, nên chốt chặn <code>result &gt; (Long.MAX_VALUE - digit) / cơ_số</code>
phải chạy trước. Chính chốt chặn đó cũng là thứ khiến <code>Math.abs</code> về sau an toàn:
<code>Math.abs(Long.MIN_VALUE)</code> vẫn là số âm, và chốt chặn giữ cho <code>Long.MIN_VALUE</code>
không bao giờ với tới được.</p>
<p><strong>Hai lời gọi thư viện bị cố ý không dùng.</strong> <code>Long.parseLong(text, radix)</code> và
<code>Long.toString(value, radix)</code> làm xong cả bài này trong hai dòng, và trong mã sản phẩm thật
thì đó mới là đáp án đúng. Ở đây thì không: chúng <em>chính là</em> bài tập, giao cho thư viện thì không
còn gì để chấm. Cả hai đều được nêu tên trong ghi chú ngay trên phương thức thay thế chúng — người chấm
tính việc bạn biết thư viện mà chọn không dùng là một điểm cộng, còn không biết là một điểm trừ.</p>
<p><strong>Vì sao dùng enum chứ không phải ba số nguyên.</strong> Với tham số <code>int</code>,
<code>convert(value, 2, 16)</code> và <code>convert(value, 16, 2)</code> là cùng một lời gọi đảo tham số,
và trình biên dịch không phân biệt được cái cố ý với cái gõ nhầm. Với <code>Base</code>, một giá trị sai
thì không biên dịch được vì nó không tồn tại; cơ số và nhãn in ra
(<code>BIN</code>/<code>DEC</code>/<code>HEX</code>) đi kèm luôn với hằng số thay vì nằm trong một bảng
tra ở đâu đó. Ràng buộc duy nhất đáng nói thẳng ra là thứ tự khai báo trong enum chính là thứ khiến lựa
chọn 1/2/3 của thực đơn ánh xạ được sang nó, nên phép ánh xạ đó được viết gọn trong một phương thức
<code>fromChoice</code> chứ không rải ra khắp một câu switch.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Một phiên kịch bản duy nhất bao gồm, theo thứ tự: một lựa
chọn thực đơn không phải số và một lựa chọn ngoài khoảng; bốn ví dụ mẫu của đề; <code>1G</code> ở hệ 16;
<code>2</code> ở hệ 2; số <code>0</code>; số <code>-27</code>; chuỗi <code>ff</code> viết thường (đầu vào
được chuyển hoa trước khi đọc, nên chữ hoa/thường không bao giờ chạm tới bảng tra chữ số); và
<code>007</code> đổi từ hệ 10 sang hệ 10, in ra <code>7</code>, cho thấy các số 0 đứng đầu bị tiêu thụ
chứ không được chép lại. Màn hình được chụp từ lần chạy thật, không phải viết theo trí nhớ.</p>
<p><strong>Thứ duy nhất được tự nghĩ ra ở đây, xin nói thẳng.</strong> Đề không quy định câu chữ nào cho
giá trị bị từ chối, nên thông báo này là của riêng lời giải: <code>1G is not a valid HEX number.</code>
Nó nêu cả đầu vào có lỗi lẫn hệ cơ số dùng để phán xét, vì "Invalid input" chẳng nói cho người dùng biết
họ sai ở cái nào trong hai thứ đó.</p>''',
    hints_en=[
        'Route everything through one long: text -> number -> text is two rules for any number of bases.',
        'Read digits with Horner\'s method (result = result * radix + digit) — no Math.pow, no position index.',
        'A digit can be invalid two ways: not a digit at all (G), or a real digit too big for the base (2 in binary).',
        'Zero needs its own line: the divide-and-remainder loop never runs for it and would return "".',
        'Strip the sign once, convert the magnitude, put the sign back — and write the conversion yourself, not with Long.toString(v, radix).',
    ],
    hints_vi=[
        'Cho mọi thứ đi qua một long: văn bản -> số -> văn bản là hai luật, dùng được cho bao nhiêu hệ cơ số cũng vậy.',
        'Đọc chữ số bằng lược đồ Horner (result = result * cơ_số + chữ_số) — không Math.pow, không chỉ số vị trí.',
        'Một chữ số sai theo hai kiểu: không phải chữ số (G), hoặc là chữ số thật nhưng quá lớn với cơ số (số 2 ở hệ nhị phân).',
        'Số 0 cần một dòng riêng: vòng chia-lấy-dư chạy 0 lần và sẽ trả về chuỗi rỗng.',
        'Tách dấu một lần, đổi phần độ lớn, rồi gắn dấu lại — và tự viết phép đổi, đừng dùng Long.toString(v, radix).',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0059': """<h3>Bối cảnh</h3>
<p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Sinh viên viết một chương trình cho phép người dùng:</p>
<p>1) Đọc một tệp văn bản trên đĩa, trong đó chứa danh sách người gồm tên, địa chỉ và lương, ngăn cách
nhau bằng ký tự &ldquo;;&rdquo; (dấu chấm phẩy). Mỗi dòng chứa thông tin của một người.</p>
<p>Yêu cầu người dùng nhập đường dẫn tới tệp văn bản và mức lương tối thiểu. Chương trình đọc danh sách
người trong tệp và hiển thị những người có lương <strong>lớn hơn hoặc bằng</strong> số đã nhập. Nếu lương
của người nào đó sai định dạng (không phải số, hoặc bỏ trống) thì đặt về giá trị mặc định là 0.</p>
<p>Hiển thị danh sách những người tìm được lên màn hình theo dạng cột (xem phần yêu cầu giao diện).</p>
<p>2) Đọc một tệp văn bản trên đĩa và tìm tất cả các từ đơn trong nội dung của nó, mỗi từ chỉ tính một
lần. Ghi tất cả các từ tìm được vào một tệp văn bản mới.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình nhắc người dùng chọn một mục.</li>
<li>Người dùng chọn một mục, thực hiện Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn.</h4>
<ul>
<li><strong>Mục 1: Find person info</strong>
<ul>
<li>Yêu cầu nhập đường dẫn đầy đủ của tệp văn bản và mức lương tối thiểu cần tìm.</li>
<li>Dữ liệu thử hợp lệ theo các điều kiện sau:
<ul>
<li>Số tiền không nhỏ hơn 0; sai định dạng thì mặc định bằng 0.</li>
<li>Các trường trong tệp văn bản ngăn cách bằng dấu <code>;</code></li>
</ul>
</li>
<li>Hiển thị và phân loại những người có số tiền lớn hơn số đã nhập.</li>
<li>Hiển thị người có số tiền nhỏ nhất và lớn nhất.</li>
<li>Quay lại màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 2: Copy Text to new file</strong>
<ul>
<li>Yêu cầu nhập đường dẫn tệp .txt.</li>
<li>Ghi tất cả các từ đơn vào tệp mới.</li>
<li>Quay lại màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 3: Thoát chương trình.</strong></li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>========== File Processing =========
Find person info
Copy Text to new file
Exit</pre>
<pre>--------- Person info ---------
Enter Path:d:\test.txt
Enter Money:800
------------- Result ----------
Name		Address	Money
Nghia		Ha Noi		1000.0
Thanh		Ha Noi		1200.0
Phuong		Ha Noi		1300.0

Max: Phuong
Min: Nghia</pre>
<pre>------------- Copy text --------------
Enter Source: d:\test.txt
Enter new file name: test2.txt
Copy done...</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> phải cài đặt các phương thức <code>getPerson</code> và
<code>copyWordOneTimes</code> trong mã nguồn.</p>
<p>Gợi ý: dùng các lớp <code>java.io.BufferedReader</code>, <code>java.io.BufferedWriter</code>,
<code>java.io.File</code>, <code>java.io.FileReader</code>, <code>java.io.FileWriter</code>,
<code>java.io.IOException</code>, <code>java.util.ArrayList</code>, <code>java.util.List</code> để làm
việc với tệp; dùng <code>java.util.Collections</code> và <code>java.util.Comparator</code> để sắp xếp
danh sách.</p>
<h4>Chức năng 1: Hiển thị thông tin theo số tiền đã nhập</h4>
<ul>
<li>Bắt buộc đúng chữ ký: <code>public List&lt;Person&gt; getPerson(String path, double money) throws
Exception</code></li>
<li><strong>Đầu vào</strong>: <code>path</code> — đường dẫn tệp; <code>money</code> — số tiền.</li>
<li><strong>Đầu ra</strong>: danh sách người, trong đó người nhiều tiền nhất nằm ở
<strong>cuối</strong> danh sách và người ít tiền nhất nằm ở <strong>đầu</strong> danh sách.</li>
<li>Ngoại lệ: <code>Exception("Path doesn\'t exist")</code>, <code>Exception("Can\u2019t read
file")</code>.</li>
</ul>
<h4>Chức năng 2: Chép và loại bỏ từ trùng lặp từ một tệp sang tệp khác</h4>
<ul>
<li>Bắt buộc đúng chữ ký: <code>public static boolean copyWordOneTimes(String source, String
destination) throws Exception</code></li>
<li><strong>Đầu vào</strong>: <code>source</code> — đường dẫn nguồn; <code>destination</code> — đường
dẫn đích.</li>
<li><strong>Đầu ra</strong>: trạng thái chép.</li>
<li>Ngoại lệ: <code>Exception("Path doesn\'t exist")</code>, <code>Exception("Can\u2019t read
file")</code>, <code>Exception("Can\u2019t write file")</code>.</li>
</ul>""",

    'J1.S.P0011': """<h3>Bối cảnh</h3>
<p>Hệ đếm (hay hệ ghi số) là một cách viết để biểu diễn số, tức một ký pháp toán học biểu diễn các số
của một tập cho trước bằng chữ số hoặc ký hiệu khác theo một quy tắc nhất quán. Có thể xem nó là ngữ
cảnh cho phép hiểu hai ký hiệu &ldquo;11&rdquo; là ký hiệu nhị phân của số ba, ký hiệu thập phân của số
mười một, hoặc một số khác trong các cơ số khác.</p>
<p>Hệ nhị phân là hệ đếm biểu diễn giá trị số bằng hai chữ số duy nhất (0 và 1). Hầu hết thiết bị máy
tính dùng nhị phân để biểu diễn trạng thái điện áp của mạch (kiểu công tắc bật/tắt), coi mức 0 là tắt và
mức 1 là bật.</p>
<p>Hệ thập lục phân dùng tổ hợp của 16 ký tự chữ số để biểu diễn mọi giá trị số. Hệ 16 dùng cả mười chữ
số của hệ thập phân (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) cùng các chữ cái từ A đến F. Ai từng thiết kế trang
web đều đã gặp giá trị thập lục phân khi làm màu sắc. Ví dụ, để có chữ màu đỏ ta dùng mã màu HTML
<code>#FF0000</code>, tương ứng với 255 Đỏ, 0 Lục, 0 Lam trong hệ 16.</p>
<p>Tính toán nhị phân tuy đơn giản nhưng rất dài. Hệ thập phân lại không hợp với máy tính. Người ta
thường dùng hệ 16 để viết số cho ngắn, mà việc chuyển đổi sang hệ nhị phân thì rất đơn giản.</p>
<h3>Đặc tả chương trình</h3>
<p>Thiết kế một chương trình cho phép người dùng chọn hệ cơ số đầu vào (2, 10, 16) và hệ cơ số đầu ra
(2, 10, 16), sau đó nhập giá trị đầu vào; chương trình in ra giá trị tương đương ở hệ cơ số đầu ra.</p>
<p>Chương trình phải lặp lại cho tới khi người dùng đóng chương trình.</p>
<h3>Chi tiết chức năng</h3>
<ol>
<li>Yêu cầu người dùng chọn hệ cơ số đầu vào (ví dụ 1 là nhị phân, 2 là thập phân, 3 là thập lục
phân).</li>
<li>Yêu cầu người dùng chọn hệ cơ số đầu ra (ví dụ 1 là nhị phân, 2 là thập phân, 3 là thập lục
phân).</li>
<li>Yêu cầu người dùng nhập giá trị đầu vào.</li>
<li>Chương trình xử lý và in ra giá trị kết quả.</li>
</ol>
<h3>Màn hình mong đợi</h3>
<p>Đề gốc không kèm màn hình mẫu ở mục này — phần chữ nghĩa của thực đơn do bạn tự thiết kế, miễn là
đúng luồng bốn bước ở trên và lặp lại cho tới khi người dùng thoát.</p>
<h3>Hướng dẫn</h3>
<p>Bốn ví dụ minh hoạ trong đề (các phép tính này đã được kiểm lại và đều đúng):</p>
<ul>
<li>Ví dụ 1: đổi <strong>535</strong> (hệ 10) sang hệ 16 → <strong>217</strong>
(2·256 + 1·16 + 7 = 535).</li>
<li>Ví dụ 2: đổi <strong>217</strong> (hệ 16) sang hệ 10 → <strong>535</strong>.</li>
<li>Ví dụ 3: đổi <strong>27</strong> (hệ 10) sang hệ 2 → <strong>11011</strong>
(16 + 8 + 2 + 1 = 27).</li>
<li>Ví dụ 4: đổi <strong>11011</strong> (hệ 2) sang hệ 10 → <strong>27</strong>.</li>
</ul>
<p>Lưu ý: đề gốc gõ nhầm &ldquo;HEC&rdquo; thay cho &ldquo;HEX&rdquo; ở ví dụ 1.</p>"""
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
