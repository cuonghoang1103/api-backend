# Batch 18 — J1.S.P0073 (Handy Expense: a menu over a file, and money in a
# double) and J1.S.P0074 (the "calculator" that is really matrix arithmetic).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0073 — Handy Expense (100 LOC)
# ════════════════════════════════════════════════════════════════

P0073_ENTITY = '''package entity;

import java.io.Serializable;
import java.util.Date;

/**
 * One line of the expense book: what was spent, when, and on what.
 *
 * The field is a java.util.Date rather than the String the Program
 * Specifications mention, because the Guidelines - which are the contract -
 * declare addExpense(List, Date, double, String). Keeping a real Date also
 * means an unparseable "31-Feb-2009" is rejected at the moment it is typed
 * instead of being stored and discovered later by whoever prints the report.
 *
 * The class carries no formatting: how a date or an amount LOOKS on screen is
 * a decision of the screen, and an entity that formats itself quietly becomes
 * impossible to reuse in a report that wants a different layout.
 */
public class Expense implements Serializable {

    private int id;
    private Date date;
    private double amount;
    private String content;

    public Expense() {
    }

    public Expense(int id, Date date, double amount, String content) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "Expense[id=" + id + ", amount=" + amount + ", content=" + content + "]";
    }
}
'''

P0073_BO = r'''package bo;

import entity.Expense;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
import java.util.List;
import utils.Validator;

/**
 * The expense book and every rule about it, including the file it lives in.
 *
 * The brief calls this "a file processing program" but puts no Save or Load on
 * the menu, so saving is not a command the user gives: the file is read once at
 * start-up and rewritten after every change that succeeded. A user who quits
 * with the window's X button still loses nothing, which is the whole reason a
 * program keeps its data in a file at all.
 *
 * Nothing here prints. The three methods the Guidelines name keep their exact
 * signatures - the list is passed in even though this object owns it - so a
 * marker can find them by name and by parameter list.
 */
public class ExpenseManager {

    /**
     * A pipe separates the fields, and the content is read with a limit of 4,
     * so a content of "Rent | May" survives a save/load round trip: everything
     * after the third pipe is content by definition. A comma would have been
     * the obvious choice and the wrong one - commas are common inside the text
     * a user types.
     */
    private static final String SEPARATOR = "|";

    private final String path;
    private String lastError = "";

    public ExpenseManager(String path) {
        this.path = path;
    }

    /** Why the last add or delete returned false, for the screen to report. */
    public String getLastError() {
        return lastError;
    }

    /**
     * Reads the file into the list. A missing file on the very first run is
     * the normal state of a new expense book, not an error.
     */
    public void load(List<Expense> list) throws IOException {
        File file = new File(path);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                String[] parts = line.split("\\" + SEPARATOR, 4);
                if (parts.length < 4) {
                    continue;
                }
                Date date = Validator.parseDate(parts[1]);
                if (date == null) {
                    continue;
                }
                // Double.parseDouble, never a NumberFormat: parseDouble always
                // reads a dot as the decimal point, while a formatter follows
                // the machine's locale and would read "100.10" as 10010 on a
                // machine set to Vietnamese. A data file must not change
                // meaning when it is carried to another computer.
                list.add(new Expense(Integer.parseInt(parts[0]), date,
                        Double.parseDouble(parts[2]), parts[3]));
            }
        }
    }

    /**
     * The next ID is the largest ID in use plus one, exactly as the Guidelines
     * put it ("ID = ID Max + 1"), computed from the list rather than kept in a
     * counter field. A counter would be wrong after a reload: the file knows
     * the IDs, a field initialised to 0 does not.
     */
    public int nextId(List<Expense> list) {
        int max = 0;
        for (Expense expense : list) {
            if (expense.getId() > max) {
                max = expense.getId();
            }
        }
        return max + 1;
    }

    public Expense findById(List<Expense> list, int id) {
        for (Expense expense : list) {
            if (expense.getId() == id) {
                return expense;
            }
        }
        return null;
    }

    public double getTotal(List<Expense> list) {
        double total = 0;
        for (Expense expense : list) {
            total += expense.getAmount();
        }
        return total;
    }

    /**
     * The Guidelines' signature, unchanged - and the boolean it returns is not
     * decoration. It is false when the expense could not be written to disk,
     * which is the only failure this operation actually has. No `throws` clause
     * is added, because the brief fixes the signature; the IOException is
     * turned into that status here and its message is kept in lastError so the
     * screen can say what went wrong instead of just that something did.
     */
    public boolean addExpense(List<Expense> list, Date date, double amount, String content) {
        Expense expense = new Expense(nextId(list), date, amount, content);
        list.add(expense);
        if (save(list)) {
            return true;
        }
        list.remove(expense);   // the book in memory must not disagree with the file
        return false;
    }

    /**
     * Takes the Expense, not the id, because that is the signature the brief
     * gives. The screen turns the typed id into an Expense first, so "no such
     * id" is answered before this method is ever called.
     */
    public boolean deleteExpense(List<Expense> list, Expense exp) {
        if (exp == null || !list.remove(exp)) {
            lastError = "Delete an expense fail";
            return false;
        }
        if (save(list)) {
            return true;
        }
        list.add(exp);
        return false;
    }

    /**
     * Rewrites the whole file. Appending is cheaper, but a delete cannot be
     * appended - the only way to remove a line from a text file is to write the
     * file again without it - and one saving routine used by both operations is
     * one routine that can be wrong, instead of two.
     */
    private boolean save(List<Expense> list) {
        try (PrintWriter writer = new PrintWriter(path)) {
            for (Expense expense : list) {
                writer.println(expense.getId() + SEPARATOR
                        + Validator.formatDate(expense.getDate()) + SEPARATOR
                        + expense.getAmount() + SEPARATOR
                        + expense.getContent());
            }
            return true;
        } catch (IOException e) {
            lastError = e.getMessage();
            return false;
        }
    }
}
'''

P0073_VALIDATOR = '''package utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Scanner;

/**
 * Every keyboard read and every check in the program, in one place.
 *
 * One Scanner for the whole program, held in a static final field: a second
 * `new Scanner(System.in)` in another class reads from the same stream, and
 * whichever one buffered first swallows lines the other will never see. That
 * bug looks like "the program skipped my input" and is very hard to find.
 *
 * The date format lives here too, and it is the SAME object used to read the
 * user's typing, to print the screen and to write the file. If the file were
 * written in one pattern and read back in another, the program would work
 * perfectly until it was restarted.
 */
public class Validator {

    public static final String DATE_PATTERN = "dd-MMM-yyyy";

    private static final Scanner SCANNER = new Scanner(System.in);
    private static final SimpleDateFormat DATE_FORMAT =
            new SimpleDateFormat(DATE_PATTERN, Locale.ENGLISH);

    static {
        // Without this, SimpleDateFormat is happy to "understand" 31-Feb-2009
        // and hand back 3 March. Lenient parsing is the reason invalid dates
        // reach a database.
        DATE_FORMAT.setLenient(false);
    }

    private Validator() {
    }

    /** Locale.ENGLISH is not optional: on a Vietnamese machine "Apr" is not a month name. */
    public static String formatDate(Date date) {
        return DATE_FORMAT.format(date);
    }

    /** Returns null instead of throwing: an unreadable line in a data file is a fact, not an accident. */
    public static Date parseDate(String text) {
        try {
            return DATE_FORMAT.parse(text.trim());
        } catch (ParseException e) {
            return null;
        }
    }

    public static String getString(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("This field must not be empty.");
        }
    }

    public static int getInt(String message, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please input a number in [" + min + ", " + max + "].");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /** An expense of 0 or of -50 is a typo, not a purchase, so it is refused here. */
    public static double getDouble(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                double value = Double.parseDouble(line);
                if (value <= 0) {
                    System.out.println("Amount must be greater than 0.");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println("Amount must be a number.");
            }
        }
    }

    public static Date getDate(String message) {
        while (true) {
            System.out.print(message);
            Date date = parseDate(SCANNER.nextLine());
            if (date != null) {
                return date;
            }
            System.out.println("Date must be in format " + DATE_PATTERN + ", e.g. 11-Apr-2009.");
        }
    }
}
'''

P0073_MAIN = '''package ui;

import bo.ExpenseManager;
import entity.Expense;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import utils.Validator;

/**
 * The menu and the screen, and nothing else.
 *
 * displayAll() is here rather than in bo, although the Guidelines list it
 * beside addExpense and deleteExpense. Its signature gives it away: it returns
 * void and its whole job is to draw a table. A business layer that prints
 * cannot be reused by anything that does not want console output, so the two
 * methods that DECIDE live in bo and the one that DRAWS lives here - with the
 * exact name and parameter list the brief asked for.
 */
public class Main {

    private static final String DATA_FILE = "expenses.txt";

    public static void main(String[] args) {
        List<Expense> list = new ArrayList<>();
        ExpenseManager manager = new ExpenseManager(DATA_FILE);
        try {
            manager.load(list);
        } catch (IOException e) {
            System.out.println("Cannot read " + DATA_FILE + ": " + e.getMessage());
        }

        boolean running = true;
        while (running) {
            System.out.println("=======Handy Expense program======");
            System.out.println("1. Add an expense");
            System.out.println("2. Display all expenses");
            System.out.println("3. Delete an expense");
            System.out.println("4. Quit");
            switch (Validator.getInt("Your choice: ", 1, 4)) {
                case 1:
                    add(manager, list);
                    break;
                case 2:
                    displayAll(list);
                    break;
                case 3:
                    delete(manager, list);
                    break;
                default:
                    running = false;
                    System.out.println("Bye.");
            }
        }
    }

    private static void add(ExpenseManager manager, List<Expense> list) {
        System.out.println("-------- Add an expense--------");
        // Read everything BEFORE touching the list: a half-entered expense that
        // is abandoned at the third prompt must leave no trace behind it.
        Date date = Validator.getDate("Enter Date: ");
        double amount = Validator.getDouble("Enter Amount: ");
        String content = Validator.getString("Enter Content: ");
        if (manager.addExpense(list, date, amount, content)) {
            System.out.println("Add an expense successful");
        } else {
            System.out.println("Add an expense fail: " + manager.getLastError());
        }
    }

    /** The Guidelines' signature, exactly: public void displayAll(List<Expense> list). */
    public static void displayAll(List<Expense> list) {
        System.out.println("---------Display all expenses------------");
        if (list.isEmpty()) {
            System.out.println("There is no expense to display.");
            return;
        }
        System.out.printf("%-4s %-13s %-12s %s%n", "ID", "Date", "Amount", "Content");
        double total = 0;
        for (Expense expense : list) {
            System.out.printf("%-4d %-13s %-12s %s%n", expense.getId(),
                    Validator.formatDate(expense.getDate()),
                    money(expense.getAmount()), expense.getContent());
            total += expense.getAmount();
        }
        System.out.println("Total: " + money(total));
    }

    private static void delete(ExpenseManager manager, List<Expense> list) {
        System.out.println("--------Delete an expense------");
        int id = Validator.getInt("Enter ID: ", 1, Integer.MAX_VALUE);
        Expense expense = manager.findById(list, id);
        // The brief's message is "Delete an expense fail" - not "failed", and
        // with no full stop. It is copied character for character, because the
        // marker diffs the screen and this is the string being diffed.
        if (expense == null) {
            System.out.println("Delete an expense fail");
            return;
        }
        if (manager.deleteExpense(list, expense)) {
            System.out.println("Delete an expense successful");
        } else {
            System.out.println("Delete an expense fail");
        }
    }

    /**
     * Locale.US is deliberate. String.format("%.2f", 100.1) prints "100,10" on
     * a machine whose locale uses a decimal comma, and the same program would
     * then produce a different report on the marker's laptop than on yours.
     */
    private static String money(double amount) {
        return String.format(Locale.US, "%.2f", amount);
    }
}
'''


solution(
    'J1.S.P0073',
    title_vi='Chương trình quản lý chi tiêu Handy Expense',
    files=[('src/entity/Expense.java', P0073_ENTITY),
           ('src/bo/ExpenseManager.java', P0073_BO),
           ('src/utils/Validator.java', P0073_VALIDATOR),
           ('src/ui/Main.java', P0073_MAIN)],
    main_class='ui.Main',
    runs=[
        # First process: a bad menu key, a bad date, a bad amount, three
        # expenses, a delete that misses, a delete that hits.
        ('''x
9
2
1
31-Feb-2009
11-Apr-2009
abc
100.10
Tuition fee
1
20-Apr-2009
250.20
Rent house
1
30-Apr-2009
200.30
Food
2
3
9
3
2
2
4
''', '''=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: You must input a number.
Your choice: Please input a number in [1, 4].
Your choice: ---------Display all expenses------------
There is no expense to display.
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: -------- Add an expense--------
Enter Date: Date must be in format dd-MMM-yyyy, e.g. 11-Apr-2009.
Enter Date: Enter Amount: Amount must be a number.
Enter Amount: Enter Content: Add an expense successful
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: -------- Add an expense--------
Enter Date: Enter Amount: Enter Content: Add an expense successful
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: -------- Add an expense--------
Enter Date: Enter Amount: Enter Content: Add an expense successful
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: ---------Display all expenses------------
ID   Date          Amount       Content
1    11-Apr-2009   100.10       Tuition fee
2    20-Apr-2009   250.20       Rent house
3    30-Apr-2009   200.30       Food
Total: 550.60
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: --------Delete an expense------
Enter ID: Delete an expense fail
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: --------Delete an expense------
Enter ID: Delete an expense successful
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: ---------Display all expenses------------
ID   Date          Amount       Content
1    11-Apr-2009   100.10       Tuition fee
3    30-Apr-2009   200.30       Food
Total: 300.40
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: Bye.'''),
        # Second process, same folder: nothing was typed in, so everything on
        # screen came out of expenses.txt - and the new ID continues from 3.
        ('''2
1
05-May-2009
75.50
Coffee
2
4
''', '''=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: ---------Display all expenses------------
ID   Date          Amount       Content
1    11-Apr-2009   100.10       Tuition fee
3    30-Apr-2009   200.30       Food
Total: 300.40
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: -------- Add an expense--------
Enter Date: Enter Amount: Enter Content: Add an expense successful
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: ---------Display all expenses------------
ID   Date          Amount       Content
1    11-Apr-2009   100.10       Tuition fee
3    30-Apr-2009   200.30       Food
4    05-May-2009   75.50        Coffee
Total: 375.90
=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice: Bye.'''),
    ],
    explain_en='''<p><strong>Four files, and why not five.</strong> <code>entity/Expense</code> holds the
data, <code>bo/ExpenseManager</code> holds the list rules and the file, <code>utils/Validator</code>
holds every keyboard read, <code>ui/Main</code> holds the menu. There is no <code>controller</code>
because there is nothing for it to do: a controller earns its place when several screens need the same
sequence of "read, validate, call, report", and this program has one screen. An empty controller in a
100-line assignment is a mark lost, not gained — and it is one more file for a marker to open and find
nothing in.</p>
<p><strong>The brief contradicts itself about the date, and the Guidelines win.</strong> The Program
Specifications say an expense has "date (String)". The Guidelines then declare
<code>addExpense(List&lt;Expense&gt; list, Date date, double amount, String content)</code>. The
Guidelines are the contract, so the field is a real <code>java.util.Date</code> — which is also the
better answer: a String date accepts <code>31-Feb-2009</code> and nobody finds out until the report is
sorted. Say this out loud at the defence; noticing a contradiction counts in your favour.</p>
<p><strong>Money in a <code>double</code> — the part you must be able to defend.</strong> The
Guidelines fix the parameter as <code>double</code>, so <code>double</code> is what this program uses.
But <code>double</code> is binary floating point, and 0.1 has no exact binary form, exactly as ⅓ has no
exact decimal form. Java prints <code>0.1 + 0.2</code> as <code>0.30000000000000004</code>, and
<code>0.1</code> added to itself ten times as <code>0.9999999999999999</code>. This is not a Java
defect; it is IEEE-754, and it is the same in C, Python and JavaScript.</p>
<p><strong>It bites this very program.</strong> Take the brief's own three expenses with cents —
100.10, 250.20, 200.30. Add them in a <code>double</code> and the total is
<code>550.5999999999999</code>, not 550.60. The report prints <code>550.60</code> only because
<code>%.2f</code> rounds the error out of sight; the wrong value is still the one in memory, and one
<code>if (total == 550.60)</code> anywhere would be false. Real accounting code therefore uses
<code>BigDecimal</code> built from <em>Strings</em> (<code>new BigDecimal("100.10")</code>, never
<code>new BigDecimal(100.10)</code>, which copies the error in), or stores integer minor units — the
amount in cents as a <code>long</code> — and divides only when printing. Either way the arithmetic is
exact. Follow the brief here; know the answer when you are asked.</p>
<p><strong>"A file processing program" with no Save on the menu.</strong> The menu has four options and
none of them is Save or Load, so persistence cannot be a command the user gives: the file is read once
at start-up and rewritten after every change that succeeded. The whole file is rewritten rather than
appended to, because a delete cannot be appended — the only way to remove a line from a text file is to
write the file again without it — and one save routine shared by add and delete is one routine that can
be wrong instead of two.</p>
<p><strong>The list and the file must never disagree.</strong> <code>addExpense</code> adds to the list,
saves, and <em>removes the expense again</em> if the save failed; <code>deleteExpense</code> puts it back
in the same situation. Without that, a full disk leaves a program showing a row that is not in the file,
and the row disappears at the next restart with no explanation. The boolean the Guidelines ask for —
"Add expense status" — is exactly this status, which is why no <code>throws</code> clause was added to
their fixed signature; the <code>IOException</code> becomes the return value, and its message is kept in
<code>lastError</code> so the screen can say more than "it failed".</p>
<p><strong>Two locale traps, both silent.</strong> <code>new SimpleDateFormat("dd-MMM-yyyy")</code>
without <code>Locale.ENGLISH</code> does not know the word "Apr" on a machine set to Vietnamese, so the
program works on your laptop and rejects every date on the marker's. And
<code>String.format("%.2f", 100.1)</code> prints <code>100,10</code> under a decimal-comma locale, which
would then be written into the data file and fail to load. Amounts are written with
<code>Double.toString</code> and read with <code>Double.parseDouble</code>, which are locale-independent
by definition, and only the screen formats with <code>Locale.US</code>.</p>
<p><strong>Where <code>displayAll</code> lives.</strong> The Guidelines list it beside the other two, but
its signature gives it away: it returns <code>void</code> and its entire job is to draw a table. So the
two methods that decide are in <code>bo</code> and the one that draws is in <code>ui</code>, with the
exact name and parameter list the brief asked for. <code>deleteExpense(List, Expense)</code> also keeps
its signature — it takes the object, not the id, so the screen turns the typed number into an
<code>Expense</code> first and answers "Delete an expense fail" before the business method is ever
called.</p>
<p><strong>How this was verified — and this is the interesting part.</strong> The program was run
<em>twice, in two separate JVMs, in the same folder</em>. The first run adds three expenses and deletes
one. The second run types no expense data at all and still prints the two survivors, then adds one that
receives ID 4 — proving both that the file was really written and that <code>nextId</code> is
<code>max + 1</code> computed from the loaded data, not a counter field that would have restarted at 1
and produced a duplicate ID. Compiling proves none of that; only the second process does.</p>
<p><strong>What a marker types first.</strong> A letter at "Your choice", a 9 at "Your choice",
<code>31-Feb-2009</code> at the date, <code>abc</code> at the amount, option 2 on an empty book, and a
delete of an ID that does not exist. All six are in the verified transcript. The fifth is the one most
solutions crash on, because an empty list plus a total of 0 is a case nobody tests by hand.</p>''',
    explain_vi='''<p><strong>Bốn tệp, và vì sao không phải năm.</strong> <code>entity/Expense</code> giữ
dữ liệu, <code>bo/ExpenseManager</code> giữ luật danh sách và tệp, <code>utils/Validator</code> giữ mọi
thao tác đọc bàn phím, <code>ui/Main</code> giữ thực đơn. Không có <code>controller</code> vì nó chẳng có
việc gì làm: controller chỉ đáng có khi nhiều màn hình cùng cần một chuỗi "đọc, kiểm, gọi, báo", mà
chương trình này chỉ có một màn hình. Một controller rỗng trong bài 100 dòng là mất điểm chứ không phải
được điểm — và là thêm một tệp để người chấm mở ra rồi thấy trống.</p>
<p><strong>Đề tự mâu thuẫn về kiểu ngày, và phần Hướng dẫn thắng.</strong> Phần Đặc tả nói chi tiêu có
"date (String)". Phần Hướng dẫn lại khai báo
<code>addExpense(List&lt;Expense&gt; list, Date date, double amount, String content)</code>. Hướng dẫn
là bản có hiệu lực, nên trường này là <code>java.util.Date</code> thật — mà đó cũng là đáp án tốt hơn:
ngày kiểu String nhận cả <code>31-Feb-2009</code> và không ai phát hiện cho tới lúc sắp xếp báo cáo. Hãy
nói thẳng điều này khi bảo vệ; nhận ra mâu thuẫn được tính là điểm cộng.</p>
<p><strong>Tiền để trong <code>double</code> — phần bạn phải bảo vệ được.</strong> Hướng dẫn đã chốt tham
số là <code>double</code>, nên chương trình dùng <code>double</code>. Nhưng <code>double</code> là số
thực dấu phẩy động nhị phân, và 0.1 không có dạng nhị phân hữu hạn, đúng như ⅓ không có dạng thập phân
hữu hạn. Java in <code>0.1 + 0.2</code> ra <code>0.30000000000000004</code>, và cộng <code>0.1</code>
mười lần ra <code>0.9999999999999999</code>. Đây không phải lỗi của Java; đó là chuẩn IEEE-754, và C,
Python, JavaScript đều y hệt.</p>
<p><strong>Và nó cắn đúng chương trình này.</strong> Lấy chính ba khoản chi của đề nhưng có phần lẻ —
100.10, 250.20, 200.30. Cộng bằng <code>double</code> thì tổng là <code>550.5999999999999</code>, không
phải 550.60. Báo cáo in ra <code>550.60</code> chỉ vì <code>%.2f</code> làm tròn che sai số đi; giá trị
sai vẫn nằm nguyên trong bộ nhớ, và một câu <code>if (total == 550.60)</code> ở bất cứ đâu cũng sẽ sai.
Vì thế mã kế toán thật dùng <code>BigDecimal</code> khởi tạo từ <em>chuỗi</em>
(<code>new BigDecimal("100.10")</code>, không bao giờ <code>new BigDecimal(100.10)</code> vì như vậy là
sao chép luôn sai số vào), hoặc lưu số nguyên đơn vị nhỏ nhất — số tiền tính bằng xu, kiểu
<code>long</code> — và chỉ chia khi in ra. Cách nào cũng cho phép tính chính xác tuyệt đối. Ở bài này cứ
theo đề; nhưng phải biết câu trả lời khi bị hỏi.</p>
<p><strong>"Chương trình xử lý tệp" mà thực đơn không có Save.</strong> Thực đơn có bốn mục và không mục
nào là Save hay Load, nên lưu trữ không thể là một lệnh người dùng gõ: tệp được đọc một lần lúc khởi
động và ghi lại sau mỗi thay đổi thành công. Ghi lại cả tệp chứ không ghi nối, vì một thao tác xoá không
thể ghi nối được — cách duy nhất để bỏ một dòng khỏi tệp văn bản là ghi lại tệp mà không có dòng đó — và
một hàm lưu dùng chung cho thêm và xoá là một chỗ có thể sai, thay vì hai.</p>
<p><strong>Danh sách và tệp không được phép lệch nhau.</strong> <code>addExpense</code> thêm vào danh
sách, lưu, và <em>gỡ khoản chi ra lại</em> nếu lưu thất bại; <code>deleteExpense</code> trả lại khoản
vừa xoá trong tình huống tương tự. Không làm vậy thì lúc đầy đĩa chương trình vẫn hiện một dòng không có
trong tệp, và dòng đó biến mất ở lần khởi động sau mà chẳng ai hiểu vì sao. Giá trị boolean mà Hướng dẫn
yêu cầu — "Add expense status" — chính là trạng thái này, và đó là lý do không thêm mệnh đề
<code>throws</code> vào chữ ký đã bị đề chốt cứng; <code>IOException</code> được biến thành giá trị trả
về, còn thông điệp của nó giữ trong <code>lastError</code> để màn hình nói được nhiều hơn hai chữ "thất
bại".</p>
<p><strong>Hai cái bẫy locale, cả hai đều im lặng.</strong> <code>new SimpleDateFormat("dd-MMM-yyyy")</code>
mà thiếu <code>Locale.ENGLISH</code> thì trên máy đặt tiếng Việt sẽ không hiểu chữ "Apr", nên chương
trình chạy ngon trên máy bạn và từ chối mọi ngày trên máy người chấm. Còn
<code>String.format("%.2f", 100.1)</code> trên locale dùng dấu phẩy thập phân sẽ in <code>100,10</code>,
rồi chuỗi đó bị ghi vào tệp dữ liệu và lần sau không đọc lại được. Số tiền được ghi bằng
<code>Double.toString</code> và đọc bằng <code>Double.parseDouble</code> — hai thứ độc lập với locale
theo định nghĩa — và chỉ màn hình mới định dạng, với <code>Locale.US</code>.</p>
<p><strong><code>displayAll</code> nằm ở đâu.</strong> Hướng dẫn xếp nó cạnh hai phương thức kia, nhưng
chữ ký của nó tự khai: trả về <code>void</code> và toàn bộ công việc là vẽ một cái bảng. Nên hai phương
thức <em>quyết định</em> nằm ở <code>bo</code>, còn phương thức <em>vẽ</em> nằm ở <code>ui</code>, giữ
đúng tên và đúng danh sách tham số đề yêu cầu. <code>deleteExpense(List, Expense)</code> cũng giữ nguyên
chữ ký — nó nhận đối tượng chứ không nhận id, nên màn hình phải đổi con số người dùng gõ thành một
<code>Expense</code> trước, và trả lời "Delete an expense fail" trước khi phương thức nghiệp vụ được gọi
tới.</p>
<p><strong>Đã kiểm chứng thế nào — và đây mới là phần đáng nói.</strong> Chương trình được chạy
<em>hai lần, ở hai tiến trình JVM khác nhau, trong cùng một thư mục</em>. Lần một thêm ba khoản chi và
xoá một khoản. Lần hai không gõ vào một dữ liệu chi tiêu nào mà vẫn in ra hai khoản còn lại, rồi thêm
một khoản và khoản đó nhận ID 4 — chứng minh cả hai điều: tệp thật sự đã được ghi, và <code>nextId</code>
là <code>max + 1</code> tính từ dữ liệu vừa nạp chứ không phải một biến đếm (biến đếm sẽ khởi động lại
từ 1 và sinh ra ID trùng). Biên dịch không chứng minh được gì trong số đó; chỉ tiến trình thứ hai mới
chứng minh được.</p>
<p><strong>Người chấm sẽ gõ gì trước tiên.</strong> Một chữ cái ở "Your choice", số 9 ở "Your choice",
<code>31-Feb-2009</code> ở ô ngày, <code>abc</code> ở ô tiền, chọn mục 2 khi sổ còn rỗng, và xoá một ID
không tồn tại. Cả sáu tình huống đều nằm trong bản ghi màn hình đã kiểm. Tình huống thứ năm là chỗ nhiều
bài chết nhất, vì danh sách rỗng cộng tổng bằng 0 là ca chẳng ai thử bằng tay.</p>''',
    hints_en=[
        'The Guidelines say Date, the specification says String — the Guidelines are the contract.',
        'The menu has no Save: load the file once at start-up and rewrite it after every change.',
        'nextId is max(id) + 1 computed from the loaded list, not a counter field that restarts at 1.',
        'deleteExpense takes an Expense: find it by id first and print "Delete an expense fail" if it is missing.',
        'Give SimpleDateFormat Locale.ENGLISH and setLenient(false), then prove the file works by running the program a SECOND time.',
    ],
    hints_vi=[
        'Hướng dẫn ghi Date, phần đặc tả ghi String — Hướng dẫn mới là bản có hiệu lực.',
        'Thực đơn không có Save: nạp tệp một lần lúc khởi động và ghi lại sau mỗi thay đổi.',
        'nextId là max(id) + 1 tính từ danh sách vừa nạp, không phải biến đếm khởi động lại từ 1.',
        'deleteExpense nhận một Expense: tìm theo id trước, không thấy thì in "Delete an expense fail".',
        'SimpleDateFormat phải có Locale.ENGLISH và setLenient(false); rồi chạy chương trình LẦN THỨ HAI để chứng minh tệp hoạt động.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0074 — "Calculator" (matrix arithmetic) (100 LOC)
# ════════════════════════════════════════════════════════════════

P0074_ENTITY = '''package entity;

import java.io.Serializable;

/**
 * A matrix: the numbers, and the two facts that always travel with them.
 *
 * A bare int[][] knows its own shape (`data.length`, `data[0].length`) right up
 * to the moment it is empty or ragged, and then `data[0]` throws. Wrapping it
 * means the shape is asked once, at construction, and every later question -
 * can these two be added? multiplied? - is answered by reading a field.
 *
 * The arithmetic is NOT here. The Guidelines fix the three operations as
 * methods taking int[][], so they live in bo and this class stays what an
 * entity should be: data plus the way it looks written down.
 */
public class Matrix implements Serializable {

    private final int[][] data;
    private final int rows;
    private final int columns;

    public Matrix(int[][] data) {
        this.data = data;
        this.rows = data.length;
        this.columns = data.length == 0 ? 0 : data[0].length;
    }

    public Matrix(int rows, int columns) {
        this(new int[rows][columns]);
    }

    public int[][] getData() {
        return data;
    }

    public int getRows() {
        return rows;
    }

    public int getColumns() {
        return columns;
    }

    public int getCell(int row, int column) {
        return data[row][column];
    }

    public void setCell(int row, int column, int value) {
        data[row][column] = value;
    }

    /**
     * Every column is as wide as the widest number IN THE WHOLE MATRIX, so the
     * columns line up. Separating cells with a tab looks identical for single
     * digits and falls apart the moment one cell is -1000: printing is the only
     * part of this program the user actually sees, and a crooked matrix reads
     * as a wrong matrix.
     */
    @Override
    public String toString() {
        int width = 1;
        for (int[] row : data) {
            for (int value : row) {
                width = Math.max(width, String.valueOf(value).length());
            }
        }
        StringBuilder text = new StringBuilder();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < columns; c++) {
                text.append(String.format("%" + width + "d", data[r][c]));
                if (c < columns - 1) {
                    text.append(' ');
                }
            }
            if (r < rows - 1) {
                text.append(System.lineSeparator());
            }
        }
        return text.toString();
    }
}
'''

P0074_BO = '''package bo;

/**
 * The three operations the Guidelines name, with the signatures they give.
 *
 * Nothing here reads the keyboard and nothing here prints - which is what makes
 * these three methods the only part of the program that can be tested without a
 * console. Each one checks the shapes it was handed before it starts, and
 * refuses with an IllegalArgumentException: unchecked, so the required
 * signatures stay exactly as the brief wrote them, with no `throws` bolted on.
 */
public class MatrixCalculator {

    public static final String ERR_SAME_SIZE =
            "Two matrixes must have the same number of rows and columns.";
    public static final String ERR_MULTIPLY =
            "Number of columns of matrix 1 must equal number of rows of matrix 2.";

    /** Asked BEFORE the values are typed in - see the note in Main. */
    public boolean canAddOrSubtract(int rows1, int columns1, int rows2, int columns2) {
        return rows1 == rows2 && columns1 == columns2;
    }

    public boolean canMultiply(int columns1, int rows2) {
        return columns1 == rows2;
    }

    public int[][] additionMatrix(int[][] matrix1, int[][] matrix2) {
        requireSameSize(matrix1, matrix2);
        int[][] result = new int[matrix1.length][matrix1[0].length];
        for (int r = 0; r < matrix1.length; r++) {
            for (int c = 0; c < matrix1[0].length; c++) {
                result[r][c] = matrix1[r][c] + matrix2[r][c];
            }
        }
        return result;
    }

    /**
     * Subtraction is addition with one sign changed, and it is still written
     * out in full. Calling additionMatrix on a negated copy would allocate a
     * whole extra matrix to save four characters, and it would put the answer
     * one indirection away from the marker looking for "subtractionMatrix".
     */
    public int[][] subtractionMatrix(int[][] matrix1, int[][] matrix2) {
        requireSameSize(matrix1, matrix2);
        int[][] result = new int[matrix1.length][matrix1[0].length];
        for (int r = 0; r < matrix1.length; r++) {
            for (int c = 0; c < matrix1[0].length; c++) {
                result[r][c] = matrix1[r][c] - matrix2[r][c];
            }
        }
        return result;
    }

    /**
     * (m x n) * (n x p) = (m x p).
     *
     * The result is NOT the same shape as the inputs, which is what separates
     * this from the other two: rows come from matrix1, columns come from
     * matrix2, and the shared dimension n is the one that disappears into the
     * sum. Writing `new int[matrix1.length][matrix1[0].length]` here is the
     * classic mistake - it compiles, and then throws
     * ArrayIndexOutOfBoundsException on any non-square input, or silently
     * returns the wrong shape on a square one.
     *
     * `sum` is declared INSIDE the c loop on purpose. A sum declared outside it
     * keeps the previous cell's total and every answer after the first is too
     * big - a bug that leaves the first row of the result correct, which is
     * exactly the row people check.
     */
    public int[][] multiplicationMatrix(int[][] matrix1, int[][] matrix2) {
        if (matrix1[0].length != matrix2.length) {
            throw new IllegalArgumentException(ERR_MULTIPLY);
        }
        int[][] result = new int[matrix1.length][matrix2[0].length];
        for (int r = 0; r < matrix1.length; r++) {
            for (int c = 0; c < matrix2[0].length; c++) {
                int sum = 0;
                for (int k = 0; k < matrix2.length; k++) {
                    sum += matrix1[r][k] * matrix2[k][c];
                }
                result[r][c] = sum;
            }
        }
        return result;
    }

    private void requireSameSize(int[][] matrix1, int[][] matrix2) {
        if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length) {
            throw new IllegalArgumentException(ERR_SAME_SIZE);
        }
    }
}
'''

P0074_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * getInt takes the message to print when the text is not a number, because the
 * brief dictates one exact wording for matrix values - "Values of matrix must
 * be the number" - and that string must not be shown when the user mistypes a
 * menu choice. One reading method, one error message per caller: the
 * alternative is three near-identical loops that drift apart.
 *
 * nextLine() rather than nextInt(): nextInt leaves the newline in the buffer,
 * and the next nextLine() returns an empty string without waiting. That is the
 * single most common "my program skipped a prompt" bug in LAB211.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, int min, int max, String errorMessage) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println("Please input a number in [" + min + ", " + max + "].");
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                // Integer.parseInt also throws this on "12.5" and on
                // "99999999999" - too big for an int is just as much "not a
                // valid value" as a letter is, and both land here.
                System.out.println(errorMessage);
            }
        }
    }
}
'''

P0074_MAIN = '''package ui;

import bo.MatrixCalculator;
import entity.Matrix;
import utils.Validator;

/** The menu and the screen, nothing else. */
public class Main {

    /**
     * The brief's wording, character for character. It is the one string a
     * marker will look for, so it is a constant used in exactly one place
     * rather than a literal typed into three loops.
     */
    private static final String NOT_A_NUMBER = "Values of matrix must be the number";

    private static final String SIZE_ERROR = "Size must be a positive number.";

    /** 20 is not in the brief; it stops a typo like 9999 from asking for 99,980,001 values. */
    private static final int MAX_SIZE = 20;

    public static void main(String[] args) {
        MatrixCalculator calculator = new MatrixCalculator();
        boolean running = true;
        while (running) {
            System.out.println("========= Matrix Calculator =========");
            System.out.println("1. Addition two matrixes");
            System.out.println("2. Subtraction two matrixes");
            System.out.println("3. Multiplication two matrixes");
            System.out.println("4. Exit");
            int choice = Validator.getInt("Your choice: ", 1, 4, "Your choice must be a number.");
            if (choice == 4) {
                running = false;
                System.out.println("Bye.");
            } else {
                calculate(calculator, choice);
            }
        }
    }

    private static void calculate(MatrixCalculator calculator, int choice) {
        int rows1 = Validator.getInt("Enter number of rows of matrix 1: ", 1, MAX_SIZE, SIZE_ERROR);
        int columns1 = Validator.getInt("Enter number of columns of matrix 1: ", 1, MAX_SIZE, SIZE_ERROR);
        int rows2 = Validator.getInt("Enter number of rows of matrix 2: ", 1, MAX_SIZE, SIZE_ERROR);
        int columns2 = Validator.getInt("Enter number of columns of matrix 2: ", 1, MAX_SIZE, SIZE_ERROR);

        // The shapes are checked here, BEFORE a single value is typed. The
        // methods in bo check them again, because a business rule may not
        // depend on the screen having been polite - but asking first is the
        // difference between one line of typing wasted and eighteen.
        if (choice == 3) {
            if (!calculator.canMultiply(columns1, rows2)) {
                System.out.println(MatrixCalculator.ERR_MULTIPLY);
                return;
            }
        } else if (!calculator.canAddOrSubtract(rows1, columns1, rows2, columns2)) {
            System.out.println(MatrixCalculator.ERR_SAME_SIZE);
            return;
        }

        Matrix matrix1 = readMatrix("matrix 1", rows1, columns1);
        Matrix matrix2 = readMatrix("matrix 2", rows2, columns2);

        int[][] result;
        String title;
        if (choice == 1) {
            result = calculator.additionMatrix(matrix1.getData(), matrix2.getData());
            title = "Matrix 1 + Matrix 2";
        } else if (choice == 2) {
            result = calculator.subtractionMatrix(matrix1.getData(), matrix2.getData());
            title = "Matrix 1 - Matrix 2";
        } else {
            result = calculator.multiplicationMatrix(matrix1.getData(), matrix2.getData());
            title = "Matrix 1 * Matrix 2";
        }

        System.out.println("Matrix 1:");
        System.out.println(matrix1);
        System.out.println("Matrix 2:");
        System.out.println(matrix2);
        System.out.println(title + ":");
        System.out.println(new Matrix(result));
    }

    private static Matrix readMatrix(String name, int rows, int columns) {
        System.out.println("--- Enter values of " + name + " ---");
        Matrix matrix = new Matrix(rows, columns);
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < columns; c++) {
                // Rows and columns are shown from 1, because that is how the
                // user was asked for the size. Speaking to the user in 0-based
                // indexes is speaking to them in the language of the array.
                matrix.setCell(r, c, Validator.getInt(
                        "Element [" + (r + 1) + "][" + (c + 1) + "]: ",
                        Integer.MIN_VALUE, Integer.MAX_VALUE, NOT_A_NUMBER));
            }
        }
        return matrix;
    }
}
'''


solution(
    'J1.S.P0074',
    title_vi='Chương trình máy tính ma trận',
    files=[('src/entity/Matrix.java', P0074_ENTITY),
           ('src/bo/MatrixCalculator.java', P0074_BO),
           ('src/utils/Validator.java', P0074_VALIDATOR),
           ('src/ui/Main.java', P0074_MAIN)],
    main_class='ui.Main',
    runs=[
        # Addition with a non-numeric value, then subtraction with negatives.
        ('''1
2
2
2
2
1
2
3
4
x
5
6
7
8
2
2
2
2
2
1
2
3
4
10
20
30
40
4
''', '''========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Enter number of rows of matrix 1: Enter number of columns of matrix 1: Enter number of rows of matrix 2: Enter number of columns of matrix 2: --- Enter values of matrix 1 ---
Element [1][1]: Element [1][2]: Element [2][1]: Element [2][2]: --- Enter values of matrix 2 ---
Element [1][1]: Values of matrix must be the number
Element [1][1]: Element [1][2]: Element [2][1]: Element [2][2]: Matrix 1:
1 2
3 4
Matrix 2:
5 6
7 8
Matrix 1 + Matrix 2:
 6  8
10 12
========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Enter number of rows of matrix 1: Enter number of columns of matrix 1: Enter number of rows of matrix 2: Enter number of columns of matrix 2: --- Enter values of matrix 1 ---
Element [1][1]: Element [1][2]: Element [2][1]: Element [2][2]: --- Enter values of matrix 2 ---
Element [1][1]: Element [1][2]: Element [2][1]: Element [2][2]: Matrix 1:
1 2
3 4
Matrix 2:
10 20
30 40
Matrix 1 - Matrix 2:
 -9 -18
-27 -36
========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Bye.'''),
        # Multiplication: first with shapes that cannot multiply, then a real
        # 2x3 * 3x2, then an addition with mismatched shapes.
        ('''3
2
2
3
3
3
2
3
3
2
1
2
3
4
5
6
1
2
3
4
5
6
1
2
2
3
3
4
''', '''========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Enter number of rows of matrix 1: Enter number of columns of matrix 1: Enter number of rows of matrix 2: Enter number of columns of matrix 2: Number of columns of matrix 1 must equal number of rows of matrix 2.
========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Enter number of rows of matrix 1: Enter number of columns of matrix 1: Enter number of rows of matrix 2: Enter number of columns of matrix 2: --- Enter values of matrix 1 ---
Element [1][1]: Element [1][2]: Element [1][3]: Element [2][1]: Element [2][2]: Element [2][3]: --- Enter values of matrix 2 ---
Element [1][1]: Element [1][2]: Element [2][1]: Element [2][2]: Element [3][1]: Element [3][2]: Matrix 1:
1 2 3
4 5 6
Matrix 2:
1 2
3 4
5 6
Matrix 1 * Matrix 2:
22 28
49 64
========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Enter number of rows of matrix 1: Enter number of columns of matrix 1: Enter number of rows of matrix 2: Enter number of columns of matrix 2: Two matrixes must have the same number of rows and columns.
========= Matrix Calculator =========
1. Addition two matrixes
2. Subtraction two matrixes
3. Multiplication two matrixes
4. Exit
Your choice: Bye.'''),
    ],
    explain_en='''<p><strong>Read the specification, not the title.</strong> The sheet is called "Write a
calculator program", and a calculator is what most students start writing — until the Program
Specifications say "addition, subtraction, multiplication functions <em>for matrix</em>" and the
Guidelines fix all three signatures as <code>int[][]</code> in, <code>int[][]</code> out. There is no
division here, so there is no divide-by-zero, and there is no expression to parse, so there is no
operator precedence. The title is the least reliable sentence on the page.</p>
<p><strong>Four files, and no controller.</strong> <code>entity/Matrix</code> holds the numbers and
knows how to write itself down, <code>bo/MatrixCalculator</code> holds the three operations and the
shape rules, <code>utils/Validator</code> holds the only keyboard read in the program,
<code>ui/Main</code> holds the menu. A controller would sit between a menu with three branches and a
class with three methods, forwarding each to the other — a layer whose whole content is
<code>return calculator.additionMatrix(a, b);</code> is a file a marker opens and closes again.</p>
<p><strong>Why a <code>Matrix</code> entity at all, when the contract is <code>int[][]</code>.</strong>
Because a bare <code>int[][]</code> answers "how many columns?" with <code>data[0].length</code>, which
throws the day the array is empty and lies the day it is ragged. The wrapper asks once, at construction,
and keeps the two numbers. It also owns the printing: every column is padded to the width of the widest
number <em>in the whole matrix</em>. A <code>\\t</code> between cells looks perfect for single digits and
collapses the first time a cell is <code>-1000</code>, and a crooked matrix reads as a wrong matrix. The
arithmetic deliberately stays out of this class, in <code>bo</code>, with the exact signatures the brief
dictates.</p>
<p><strong>The one line that makes multiplication different.</strong> (m×n)·(n×p) = (m×p). The result is
not the shape of either input: the rows come from matrix 1, the columns from matrix 2, and the shared
dimension n vanishes into the sum. Writing <code>new int[matrix1.length][matrix1[0].length]</code> — the
line that is correct for addition — compiles here too, then throws
<code>ArrayIndexOutOfBoundsException</code> on any non-square input, or quietly returns the wrong shape
on a square one. Verified in the transcript with a 2×3 multiplied by a 3×2, which gives a 2×2:
neither input's shape.</p>
<p><strong>The second multiplication trap is invisible.</strong> <code>int sum = 0;</code> is declared
<em>inside</em> the column loop. Declare it outside and each cell keeps the previous cell's total, so
every value after the first is too large — and the very first cell of the result is still right, which
is precisely the cell a person spot-checks. The verified run does the arithmetic in full: [[1,2,3],
[4,5,6]] × [[1,2],[3,4],[5,6]] = [[22,28],[49,64]].</p>
<p><strong>Shapes are checked before the values are typed.</strong> The program asks for four numbers —
rows and columns of both matrices — and rejects an impossible pairing immediately, rather than after
eighteen values have been keyed in. The methods in <code>bo</code> check again anyway, because a
business rule that only holds when the screen remembered to ask is not a rule. Both refusals are
<code>IllegalArgumentException</code>, which is unchecked: that keeps the Guidelines' signatures exactly
as written, with no <code>throws</code> clause bolted onto them.</p>
<p><strong>The brief supplies one message and needs three.</strong> "Values of matrix must be the
number" is given word for word and is copied that way, ungrammatical and without a full stop, because
that is the string a marker diffs. Nothing is said about what to print when the shapes do not fit, or
when the menu choice is a letter, so those two messages were written — and they are worth mentioning at
the defence as decisions rather than leaving them to look like sloppy copying.</p>
<p><strong>Where the input handling actually gets you marks.</strong> One <code>Scanner</code>, static
and final, read only through <code>nextLine()</code>. Mixing <code>nextInt()</code> with
<code>nextLine()</code> leaves the newline in the buffer and the next prompt appears to be skipped — the
most common bug of the whole course. And <code>Integer.parseInt</code> throws
<code>NumberFormatException</code> not only for <code>x</code> but also for <code>12.5</code> and for
<code>99999999999</code>: too big for an <code>int</code> is just as invalid as a letter, and one
<code>catch</code> covers all three.</p>
<p><strong>How this was verified.</strong> Two scripted runs. The first adds two 2×2 matrices with a
letter typed into the middle of the values, so the refusal message and the re-prompt appear in the
transcript, then subtracts to negative results. The second asks to multiply a 2×2 by a 3×3 and is
refused, then multiplies 2×3 by 3×2 and prints a 2×2, then asks to add a 2×2 to a 3×3 and is refused.
Every number on screen was produced by running the program, not by hand.</p>
<p><strong>What is left unsaid, and worth saying.</strong> <code>int</code> arithmetic overflows in
silence: two matrices of large values multiply into numbers past 2,147,483,647 and the result wraps to
negative with no exception at all. The brief mandates <code>int[][]</code>, so <code>int</code> it is —
but knowing that <code>long</code> or <code>BigInteger</code> is where a real implementation would go is
the difference between following a signature and understanding it.</p>''',
    explain_vi='''<p><strong>Đọc phần đặc tả, đừng đọc cái tên.</strong> Đề tên là "Write a calculator
program", và phần lớn sinh viên bắt đầu viết đúng một cái máy tính bỏ túi — cho tới khi phần Đặc tả nói
"cộng, trừ, nhân <em>cho ma trận</em>" và phần Hướng dẫn chốt cả ba chữ ký là vào <code>int[][]</code>,
ra <code>int[][]</code>. Ở đây không có phép chia nên không có chia cho 0, cũng không có biểu thức để
phân tích nên không có thứ tự ưu tiên toán tử. Cái tên bài là câu kém tin cậy nhất trên tờ đề.</p>
<p><strong>Bốn tệp, không có controller.</strong> <code>entity/Matrix</code> giữ các con số và biết tự
viết mình ra, <code>bo/MatrixCalculator</code> giữ ba phép toán và luật về kích thước,
<code>utils/Validator</code> giữ thao tác đọc bàn phím duy nhất của chương trình, <code>ui/Main</code>
giữ thực đơn. Một controller ở đây sẽ nằm giữa một thực đơn ba nhánh và một lớp ba phương thức, chỉ để
chuyển tiếp qua lại — một tầng mà toàn bộ nội dung là
<code>return calculator.additionMatrix(a, b);</code> là tệp người chấm mở ra rồi đóng lại ngay.</p>
<p><strong>Vì sao vẫn cần lớp <code>Matrix</code> khi hợp đồng là <code>int[][]</code>.</strong> Vì một
<code>int[][]</code> trần trụi trả lời câu "có bao nhiêu cột?" bằng <code>data[0].length</code> — câu trả
lời đó ném ngoại lệ vào ngày mảng rỗng và nói dối vào ngày mảng răng cưa. Lớp bọc hỏi một lần lúc khởi
tạo rồi giữ luôn hai con số. Nó cũng lo phần in: mỗi cột được đệm theo bề rộng của số dài nhất
<em>trong cả ma trận</em>. Dùng <code>\\t</code> giữa các ô thì trông hoàn hảo với số một chữ số và vỡ
ngay lần đầu có ô <code>-1000</code>, mà một ma trận in lệch bị đọc thành một ma trận sai. Phần tính toán
cố ý không nằm trong lớp này, nó ở <code>bo</code>, với đúng các chữ ký đề bắt buộc.</p>
<p><strong>Một dòng duy nhất làm phép nhân khác hẳn hai phép kia.</strong> (m×n)·(n×p) = (m×p). Kết quả
không mang hình dạng của ma trận nào cả: số hàng lấy từ ma trận 1, số cột lấy từ ma trận 2, còn chiều
chung n biến mất vào trong tổng. Viết <code>new int[matrix1.length][matrix1[0].length]</code> — dòng
hoàn toàn đúng cho phép cộng — thì ở đây vẫn biên dịch được, rồi ném
<code>ArrayIndexOutOfBoundsException</code> với mọi đầu vào không vuông, hoặc lặng lẽ trả về sai hình
dạng với đầu vào vuông. Bản ghi màn hình đã kiểm bằng 2×3 nhân 3×2, ra 2×2: không phải hình dạng của
đầu vào nào.</p>
<p><strong>Cái bẫy thứ hai của phép nhân thì vô hình.</strong> <code>int sum = 0;</code> được khai báo
<em>bên trong</em> vòng lặp cột. Khai báo bên ngoài thì mỗi ô giữ lại tổng của ô trước, nên mọi giá trị
sau giá trị đầu tiên đều lớn hơn thực tế — mà ô đầu tiên của kết quả thì vẫn đúng, đúng cái ô mà người ta
hay dò tay. Lần chạy đã kiểm làm trọn phép tính: [[1,2,3],[4,5,6]] × [[1,2],[3,4],[5,6]] =
[[22,28],[49,64]].</p>
<p><strong>Kích thước được kiểm trước khi gõ giá trị.</strong> Chương trình hỏi bốn con số — số hàng và
số cột của cả hai ma trận — rồi từ chối ngay cặp không hợp lệ, thay vì để người dùng gõ xong mười tám giá
trị mới báo. Các phương thức trong <code>bo</code> vẫn kiểm lại lần nữa, vì một luật nghiệp vụ chỉ đúng
khi màn hình nhớ hỏi trước thì không phải là luật. Cả hai lần từ chối đều dùng
<code>IllegalArgumentException</code>, loại unchecked: nhờ vậy chữ ký trong Hướng dẫn được giữ nguyên
từng chữ, không phải gắn thêm mệnh đề <code>throws</code>.</p>
<p><strong>Đề cho một thông báo nhưng chương trình cần ba.</strong> "Values of matrix must be the
number" được cho nguyên văn và được chép lại y nguyên, sai ngữ pháp và không có dấu chấm, vì đó là chuỗi
người chấm đem đi so. Đề không nói gì về việc in gì khi kích thước không khớp, hay khi lựa chọn thực đơn
là một chữ cái, nên hai thông báo đó là do mình viết — và nên nói rõ khi bảo vệ rằng đó là quyết định,
chứ đừng để nó trông như chép ẩu.</p>
<p><strong>Phần nhập liệu mới là chỗ ăn điểm.</strong> Một <code>Scanner</code> duy nhất, static final,
và chỉ đọc bằng <code>nextLine()</code>. Trộn <code>nextInt()</code> với <code>nextLine()</code> sẽ để
lại ký tự xuống dòng trong bộ đệm và lời nhắc kế tiếp trông như bị bỏ qua — lỗi phổ biến nhất của cả môn
học. Và <code>Integer.parseInt</code> ném <code>NumberFormatException</code> không chỉ với <code>x</code>
mà còn với <code>12.5</code> và với <code>99999999999</code>: vượt quá <code>int</code> cũng không hợp lệ
y như một chữ cái, và một khối <code>catch</code> lo cả ba.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy có kịch bản. Lần đầu cộng hai ma trận 2×2 với
một chữ cái gõ vào giữa dãy giá trị, để thông báo từ chối và lời nhắc lặp lại hiện ra trong bản ghi, rồi
trừ ra kết quả âm. Lần hai yêu cầu nhân 2×2 với 3×3 và bị từ chối, rồi nhân 2×3 với 3×2 và in ra 2×2,
rồi yêu cầu cộng 2×2 với 3×3 và bị từ chối. Mọi con số trên màn hình đều do chạy thật mà ra, không có số
nào viết tay.</p>
<p><strong>Điều đề không nói, nhưng nên nói.</strong> Số học <code>int</code> tràn số trong im lặng: hai
ma trận giá trị lớn nhân nhau sẽ vượt 2.147.483.647 và kết quả quấn về số âm mà không hề có ngoại lệ.
Đề bắt buộc <code>int[][]</code> nên ta dùng <code>int</code> — nhưng biết rằng một cài đặt thật sẽ đi
tới <code>long</code> hoặc <code>BigInteger</code> chính là khác biệt giữa làm theo một chữ ký và hiểu
chữ ký đó.</p>''',
    hints_en=[
        'The title says "calculator" but the specification says matrices — read the Guidelines signatures.',
        'The product of (m x n) and (n x p) is (m x p): the result is not the shape of either input.',
        'Declare the accumulator inside the inner loops, or every cell after the first is too big.',
        'Ask for both sizes first and refuse an impossible pair before any value is typed.',
        'Copy "Values of matrix must be the number" exactly, and read every line with nextLine().',
    ],
    hints_vi=[
        'Tên đề ghi "calculator" nhưng đặc tả là ma trận — hãy đọc chữ ký hàm trong phần Hướng dẫn.',
        'Tích của (m x n) và (n x p) là (m x p): kết quả không mang hình dạng của đầu vào nào.',
        'Khai báo biến tổng bên trong vòng lặp trong cùng, nếu không mọi ô sau ô đầu đều bị cộng dồn.',
        'Hỏi kích thước cả hai ma trận trước, và từ chối cặp không hợp lệ trước khi gõ bất kỳ giá trị nào.',
        'Chép đúng nguyên văn "Values of matrix must be the number", và đọc mọi dòng bằng nextLine().',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0073': '''<h3>Bối cảnh</h3>
<p>(Đề tách ra từ dự án TTS.)</p>
<h3>Đặc tả chương trình</h3>
<p>Viết một chương trình <strong>có xử lý tệp</strong> để quản lý chi tiêu, đặt tên là
<em>Handy Expense</em>.</p>
<p>Hiển thị thực đơn:</p>
<pre>1. Add an expense
2. Display all expenses
3. Remove an expense
4. Exit</pre>
<p>Xử lý theo lựa chọn của người dùng:</p>
<ul>
<li><strong>Chọn 1</strong> — thêm một khoản chi. Mỗi khoản chi gồm ID (int), ngày (String), số tiền
(double), nội dung (String). ID tăng tự động (ID khoản chi = ID khoản chi cuối + 1), khoản chi đầu tiên
có ID bằng 1.</li>
<li><strong>Chọn 2</strong> — chương trình hiển thị danh sách dữ liệu như sau:</li>
</ul>
<pre>ID   Date          Amount of money   Content
1    11-Apr-2009   100               Tuition fee
2    20-Apr-2009   250               Rent house
3    30-Apr-2009   200               Food
Total: 550</pre>
<ul>
<li><strong>Chọn 3</strong> — yêu cầu người dùng nhập ID của khoản chi cần xoá; nếu ID không tồn tại,
hiển thị thông báo: <code>Delete an expense fail</code>.</li>
<li><strong>Chọn 4</strong> — thoát chương trình.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và hỏi người dùng chọn một mục</h4>
<p>Người dùng chạy chương trình, chương trình mời chọn một mục; chọn xong thì thực hiện Chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<ul>
<li><strong>Mục 1 — Thêm một khoản chi.</strong> Yêu cầu nhập thông tin khoản chi (ID, Ngày, Số tiền,
Nội dung). ID tự tăng, lần sau ID = ID lớn nhất + 1.</li>
<li><strong>Mục 2 — Hiển thị tất cả khoản chi.</strong> Hiển thị danh sách và tổng số tiền của toàn bộ
khoản chi đã nhập.</li>
<li><strong>Mục 3 — Xoá một khoản chi.</strong> Yêu cầu nhập ID của khoản chi muốn xoá. Nếu ID không tồn
tại, hiển thị lên màn hình: <code>Delete an expense fail</code>. Nếu ID tồn tại, xoá và hiển thị:
<code>Delete an expense successful</code>.</li>
<li><strong>Mục 4 — Thoát chương trình.</strong></li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>=======Handy Expense program======
1. Add an expense
2. Display all expenses
3. Delete an expense
4. Quit
Your choice:

-------- Add an expense--------
Enter Date:
Enter Amount:
Enter Content:

---------Display all expenses------------
ID   Date          Amount    Content
1    11-Apr-2009   100       Tuition fee
2    20-Apr-2009   250       Rent house
3    30-Apr-2009   200       Food
Total:   550

--------Delete an expense------
Enter ID:</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên phải cài đặt các phương thức <code>addExpense</code>, <code>displayAll</code>,
<code>deleteExpense</code> trong mã nguồn khởi tạo.</p>
<h4>Chức năng 1: Thêm khoản chi</h4>
<pre>public boolean addExpense(List&lt;Expense&gt; list, Date date, double amount, String content)</pre>
<ul>
<li><code>list</code>: danh sách toàn bộ khoản chi.</li>
<li><code>date</code>: ngày/tháng/năm.</li>
<li><code>amount</code>: số tiền.</li>
<li><code>content</code>: nội dung.</li>
<li>Giá trị trả về: trạng thái thêm khoản chi.</li>
</ul>
<h4>Chức năng 2: Hiển thị danh sách khoản chi</h4>
<pre>public void displayAll(List&lt;Expense&gt; list)</pre>
<ul>
<li><code>list</code>: danh sách toàn bộ khoản chi.</li>
<li>Giá trị trả về: không có (void).</li>
</ul>
<h4>Chức năng 3: Xoá một khoản chi</h4>
<pre>public boolean deleteExpense(List&lt;Expense&gt; list, Expense exp)</pre>
<ul>
<li><code>list</code>: danh sách toàn bộ khoản chi.</li>
<li><code>exp</code>: khoản chi người dùng muốn xoá.</li>
<li>Giá trị trả về: trạng thái xoá khoản chi.</li>
</ul>
<p><em>Lưu ý mâu thuẫn trong đề:</em> phần đặc tả ghi ngày kiểu <code>String</code>, còn phần Hướng dẫn
khai báo tham số kiểu <code>Date</code>. Phần Hướng dẫn là bản có hiệu lực. Thực đơn ở đầu đề ghi
<code>4. Exit</code> còn màn hình mẫu ghi <code>4. Quit</code>; hãy chép theo màn hình mẫu và nói rõ điều
này khi bảo vệ.</p>''',

    'J1.S.P0074': '''<h3>Bối cảnh</h3>
<p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết một chương trình máy tính có các chức năng cộng, trừ, nhân <strong>cho ma trận</strong>.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và hỏi người dùng chọn một mục</h4>
<p>Người dùng chạy chương trình, chương trình mời chọn một mục; chọn xong thì thực hiện Chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<ul>
<li>Yêu cầu người dùng nhập số hàng, số cột của 2 ma trận.</li>
<li>Yêu cầu người dùng nhập các giá trị của ma trận, phải là số. Nếu người dùng nhập giá trị không phải
số, hiển thị thông báo lên màn hình: <code>Values of matrix must be the number</code>.</li>
<li><strong>Mục 1 — Cộng hai ma trận</strong>: hiển thị kết quả.</li>
<li><strong>Mục 2 — Trừ hai ma trận</strong>: hiển thị kết quả.</li>
<li><strong>Mục 3 — Nhân hai ma trận</strong>: hiển thị kết quả.</li>
<li><strong>Mục 4 — Thoát chương trình.</strong></li>
</ul>
<h3>Hướng dẫn</h3>
<p>Sinh viên phải cài đặt các phương thức <code>additionMatrix</code>, <code>subtractionMatrix</code>,
<code>multiplicationMatrix</code> trong mã nguồn khởi tạo.</p>
<h4>Chức năng 1: Cộng ma trận</h4>
<pre>public int[][] additionMatrix(int[][] matrix1, int[][] matrix2)</pre>
<ul>
<li><code>matrix1</code>: ma trận thứ nhất · <code>matrix2</code>: ma trận thứ hai.</li>
<li>Giá trị trả về: ma trận kết quả.</li>
</ul>
<h4>Chức năng 2: Trừ ma trận</h4>
<pre>public int[][] subtractionMatrix(int[][] matrix1, int[][] matrix2)</pre>
<ul>
<li><code>matrix1</code>: ma trận thứ nhất · <code>matrix2</code>: ma trận thứ hai.</li>
<li>Giá trị trả về: ma trận kết quả.</li>
</ul>
<h4>Chức năng 3: Nhân ma trận</h4>
<pre>public int[][] multiplicationMatrix(int[][] matrix1, int[][] matrix2)</pre>
<ul>
<li><code>matrix1</code>: ma trận thứ nhất · <code>matrix2</code>: ma trận thứ hai.</li>
<li>Giá trị trả về: ma trận kết quả.</li>
</ul>
<h4>Quy tắc kích thước (đề không nói, nhưng toán học bắt buộc)</h4>
<ul>
<li>Cộng và trừ: hai ma trận phải <strong>cùng số hàng và cùng số cột</strong>.</li>
<li>Nhân: <strong>số cột của ma trận 1 phải bằng số hàng của ma trận 2</strong>; kết quả có kích thước
(số hàng ma trận 1) × (số cột ma trận 2).</li>
</ul>
<p><em>Lưu ý:</em> tên đề ghi là "chương trình máy tính" nhưng toàn bộ đặc tả và cả ba chữ ký hàm đều là
ma trận — ở đây không có phép chia và không có thứ tự ưu tiên toán tử.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
