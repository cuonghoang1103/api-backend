# Batch 14 — J1.S.P0056 (worker management, salary history),
# J1.S.P0065 (student marks: validate, classify, per-type statistics).
import datetime
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0056 — Program to manage worker information (70 LOC)
# ════════════════════════════════════════════════════════════════

P0056_WORKER = '''package entity;

import java.io.Serializable;

/**
 * One worker. Fields, and no opinion about them.
 *
 * There is deliberately no validation in here: the brief hands the checks to
 * addWorker, which must THROW. If the constructor also refused a bad age you
 * would have two places that can reject the same worker, with two different
 * error messages, and no way to tell which one a marker is reading.
 */
public class Worker implements Serializable {

    private static final long serialVersionUID = 1L;

    private String code;
    private String name;
    private int age;
    private double salary;
    private String workLocation;

    public Worker() {
    }

    public Worker(String code, String name, int age, double salary, String workLocation) {
        this.code = code;
        this.name = name;
        this.age = age;
        this.salary = salary;
        this.workLocation = workLocation;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getWorkLocation() {
        return workLocation;
    }

    public void setWorkLocation(String workLocation) {
        this.workLocation = workLocation;
    }

    @Override
    public String toString() {
        return code + " - " + name;
    }
}
'''

P0056_STATUS = '''package entity;

/**
 * Whether an adjustment raised the salary or cut it.
 *
 * The brief's own signature asks for a SalaryStatus parameter rather than a
 * boolean, and it is right to: changeSalary(UP, ...) reads as what it does,
 * while changeSalary(true, ...) forces the reader to go and look up which way
 * round true was meant.
 *
 * Each constant carries the sign it applies. That is the whole reason the enum
 * earns its place: adding and subtracting become ONE line of arithmetic in the
 * bo layer instead of an if/else with two nearly identical branches - and two
 * nearly identical branches are where the copy-paste bug lives.
 */
public enum SalaryStatus {

    UP(1), DOWN(-1);

    private final int sign;

    SalaryStatus(int sign) {
        this.sign = sign;
    }

    public int getSign() {
        return sign;
    }
}
'''

P0056_HISTORY = '''package entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * One line of the salary log: who, how much they earned AFTERWARDS, which way
 * it moved, and when.
 *
 * The salary is COPIED into this object; the worker is only referenced. That
 * split is the point of the class. Salary is the one field an adjustment
 * changes, so a log that read it back off the Worker would show every past line
 * at today's figure - the brief's own sample shows W1 at 1100 and then at 1500,
 * which is impossible unless the older line kept its own number. Name and age
 * do not move, so referencing them keeps the log honest if a name is corrected.
 *
 * The date is produced here by LocalDate.now(), never parsed from typed text,
 * so none of the SimpleDateFormat leniency traps apply to this program.
 */
public class SalaryHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private Worker worker;
    private double salary;
    private SalaryStatus status;
    private LocalDate date;

    public SalaryHistory() {
    }

    public SalaryHistory(Worker worker, double salary, SalaryStatus status, LocalDate date) {
        this.worker = worker;
        this.salary = salary;
        this.status = status;
        this.date = date;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public SalaryStatus getStatus() {
        return status;
    }

    public void setStatus(SalaryStatus status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    /** dd/MM/yyyy, the format the brief's sample table prints. */
    public String getFormattedDate() {
        return date.format(DATE_FORMAT);
    }

    @Override
    public String toString() {
        return worker.getCode() + " " + salary + " " + status + " " + getFormattedDate();
    }
}
'''

P0056_BO = '''package bo;

import entity.SalaryHistory;
import entity.SalaryStatus;
import entity.Worker;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * The workers, the salary log, and every rule about both.
 *
 * The three method names come straight from the Guidelines - addWorker,
 * changeSalary, getInfomationSalary (the brief's own spelling of "Information";
 * a marker searches for that exact name, so it is kept). Nothing here prints:
 * a rule that is broken is reported by throwing with the brief's own wording,
 * and the controller decides how it reaches the screen.
 */
public class Management {

    private static final int MIN_AGE = 18;
    private static final int MAX_AGE = 50;

    /**
     * A LinkedHashMap keyed by code, not a List.
     *
     * The duplicate-code check and the lookup in changeSalary are the two things
     * this program does over and over, and a map answers both in one step
     * instead of walking the list. "Linked" rather than plain HashMap because it
     * keeps the workers in the order they were entered, so a screen printed from
     * it does not reshuffle itself between runs - a list that changes order for
     * no reason is a list nobody trusts.
     */
    private final Map<String, Worker> workers = new LinkedHashMap<>();

    /** Append-only: an adjustment already made is a fact, never edited. */
    private final List<SalaryHistory> history = new ArrayList<>();

    /**
     * Required: public boolean addWorker(Worker worker) throws Exception
     *
     * The order of the checks is the order the brief lists them, and that order
     * is also the useful one: an empty code cannot be tested for duplication.
     */
    public boolean addWorker(Worker worker) throws Exception {
        String code = worker.getCode() == null ? "" : worker.getCode().trim();
        if (code.isEmpty()) {
            throw new Exception("Code cannot be null.");
        }
        if (workers.containsKey(code)) {
            throw new Exception("Code [" + code + "] already exists.");
        }
        if (worker.getAge() < MIN_AGE || worker.getAge() > MAX_AGE) {
            throw new Exception("Age must be in range " + MIN_AGE + " to " + MAX_AGE);
        }
        if (worker.getSalary() <= 0) {
            throw new Exception("Salary must be greater than 0");
        }
        worker.setCode(code);
        workers.put(code, worker);
        return true;
    }

    /**
     * Required: public boolean changeSalary(SalaryStatus status, String code, double amount)
     *
     * One method for both menu options, because raising and cutting differ by a
     * single sign that the enum already carries. Writing increase() and
     * decrease() side by side would duplicate the two lookups, both validations
     * and the logging, and a fix applied to one of them would be forgotten in
     * the other.
     *
     * The new salary is computed and CHECKED before anything is stored: a cut
     * that would leave a worker on zero is refused with the brief's own "Salary
     * must be greater than 0", and nothing is written. A method that half
     * applies a change and then complains is worse than one that refuses.
     */
    public boolean changeSalary(SalaryStatus status, String code, double amount) throws Exception {
        Worker worker = workers.get(code == null ? "" : code.trim());
        if (worker == null) {
            throw new Exception("Code [" + code + "] does not exist.");
        }
        if (amount <= 0) {
            throw new Exception("Amount of money must be > 0");
        }
        double updated = worker.getSalary() + status.getSign() * amount;
        if (updated <= 0) {
            throw new Exception("Salary must be greater than 0");
        }
        worker.setSalary(updated);
        history.add(new SalaryHistory(worker, updated, status, LocalDate.now()));
        return true;
    }

    /**
     * Required: public List<SalaryHistory> getInfomationSalary()
     *
     * The brief says "sort by id", and the sample shows W1's two adjustments in
     * the order they happened. Both are satisfied by ONE sort, because
     * List.sort is guaranteed stable: rows with the same code keep the order
     * they were added in, which for an append-only log is chronological order.
     * Sorting by code and then by date would work too - and would be a second
     * comparator to get wrong for no gain.
     *
     * A copy is sorted and returned, never the field itself. Handing out the
     * live list would let a caller reorder the log by accident.
     */
    public List<SalaryHistory> getInfomationSalary() {
        List<SalaryHistory> sorted = new ArrayList<>(history);
        sorted.sort(Comparator.comparing(line -> line.getWorker().getCode()));
        return sorted;
    }
}
'''

P0056_VALIDATOR = '''package utils;

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

    /**
     * A whole number, with no range attached.
     *
     * This is the deliberate split in the program: the utils layer only decides
     * whether what was typed IS a number, and the bo layer decides whether the
     * number is allowed. "18 to 50" is a rule about employment, not about the
     * keyboard, and the brief puts it behind addWorker's throws clause.
     */
    public static int getInt(String message) {
        while (true) {
            System.out.print(message);
            try {
                return Integer.parseInt(SCANNER.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /** A menu choice: here the range IS a fact about the screen, so it lives here. */
    public static int getInt(String message, int min, int max) {
        while (true) {
            int value = getInt(message);
            if (value >= min && value <= max) {
                return value;
            }
            System.out.println("Please choose from " + min + " to " + max + ".");
        }
    }

    public static double getDouble(String message) {
        while (true) {
            System.out.print(message);
            try {
                return Double.parseDouble(SCANNER.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }
}
'''

P0056_CONTROLLER = '''package controller;

import bo.Management;
import entity.SalaryHistory;
import entity.SalaryStatus;
import entity.Worker;
import java.util.List;
import utils.Validator;

/**
 * Reads what the user types, calls the bo layer, reports what came back.
 *
 * This class exists because the menu has five options and each one is the same
 * three steps - collect, call, report. Left in Main they would bury the menu
 * loop in fifty lines of prompts; here Main stays a menu and each option stays
 * readable on its own.
 */
public class WorkerController {

    private final Management management = new Management();

    public void addWorker() {
        System.out.println("--------- Add Worker ----------");
        String code = Validator.getString("Enter Code:");
        String name = Validator.getString("Enter Name:");
        int age = Validator.getInt("Enter Age:");
        double salary = Validator.getDouble("Enter Salary: ");
        String workLocation = Validator.getString("Enter work location:");
        try {
            management.addWorker(new Worker(code, name, age, salary, workLocation));
            System.out.println("Worker [" + code + "] has been added.");
        } catch (Exception e) {
            // Empty code, duplicate code, age out of range, salary not positive:
            // four different rules, one way of reporting them. The program says
            // what was wrong and goes back to the menu, as the brief requires.
            System.out.println(e.getMessage());
        }
    }

    /** Options 2 and 3 both land here; only the enum differs. */
    public void changeSalary(SalaryStatus status) {
        System.out.println("------- Up/Down Salary --------");
        String code = Validator.getString("Enter Code:");
        double amount = Validator.getDouble("Enter Salary:");
        try {
            management.changeSalary(status, code, amount);
            System.out.println("Salary has been adjusted.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void showSalaryHistory() {
        List<SalaryHistory> lines = management.getInfomationSalary();
        System.out.println("--------------------Display Information Salary-----------------------");
        if (lines.isEmpty()) {
            // Silence would look like a crash. An empty log is a normal state on
            // a program that has only just started.
            System.out.println("No salary has been adjusted yet.");
            return;
        }
        System.out.printf("%-8s%-12s%-6s%-12s%-8s%s%n",
                "Code", "Name", "Age", "Salary", "Status", "Date");
        for (SalaryHistory line : lines) {
            Worker worker = line.getWorker();
            System.out.printf("%-8s%-12s%-6d%-12.1f%-8s%s%n",
                    worker.getCode(), worker.getName(), worker.getAge(),
                    line.getSalary(), line.getStatus(), line.getFormattedDate());
        }
    }
}
'''

P0056_MAIN = '''package ui;

import controller.WorkerController;
import entity.SalaryStatus;
import utils.Validator;

/** The menu and the screen, nothing else. */
public class Main {

    public static void main(String[] args) {
        WorkerController controller = new WorkerController();

        boolean running = true;
        while (running) {
            System.out.println("======== Worker Management =========");
            System.out.println("1. Add Worker");
            System.out.println("2. Up salary");
            System.out.println("3. Down salary");
            System.out.println("4. Display Information salary");
            System.out.println("5. Exit");

            switch (Validator.getInt("Enter your choice:", 1, 5)) {
                case 1:
                    controller.addWorker();
                    break;
                case 2:
                    controller.changeSalary(SalaryStatus.UP);
                    break;
                case 3:
                    controller.changeSalary(SalaryStatus.DOWN);
                    break;
                case 4:
                    controller.showSalaryHistory();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''

P0056_MENU = '''======== Worker Management =========
1. Add Worker
2. Up salary
3. Down salary
4. Display Information salary
5. Exit
'''


def _dated(template):
    """Expectation for a screen that contains the date the program stamped.

    The salary log records LocalDate.now(), so the transcript cannot be a fixed
    string. {DATE} is filled in with TODAY at check time - which is a stronger
    test than a wildcard, because a program that stamped the wrong day would
    still match a wildcard and fails here.
    """
    def check(out):
        today = datetime.date.today().strftime('%d/%m/%Y')
        want = template.replace('{DATE}', today)
        if out.strip() != want.strip():
            return False, 'output differs\n--- EXPECTED ---\n' + want
        return True, ''
    return check


solution(
    'J1.S.P0056',
    title_vi='Chương trình quản lý thông tin công nhân',
    files=[('src/entity/Worker.java', P0056_WORKER),
           ('src/entity/SalaryStatus.java', P0056_STATUS),
           ('src/entity/SalaryHistory.java', P0056_HISTORY),
           ('src/bo/Management.java', P0056_BO),
           ('src/controller/WorkerController.java', P0056_CONTROLLER),
           ('src/utils/Validator.java', P0056_VALIDATOR),
           ('src/ui/Main.java', P0056_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's own sample table, reproduced exactly: W1 raised
        # twice (1000 -> 1100 -> 1500) and W3 cut once (1400 -> 1300).
        ('1\nW1\nNghia\n20\n1000\nHanoi\n'
         '1\nW3\nLien\n20\n1400\nDanang\n'
         '2\nW1\n100\n'
         '2\nW1\n400\n'
         '3\nW3\n100\n'
         '4\n5\n',
         _dated(
             P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W1] has been added.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W3] has been added.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:--------------------Display Information Salary-----------------------\n'
             'Code    Name        Age   Salary      Status  Date\n'
             'W1      Nghia       20    1100.0      UP      {DATE}\n'
             'W1      Nghia       20    1500.0      UP      {DATE}\n'
             'W3      Lien        20    1300.0      DOWN    {DATE}\n' + P0056_MENU +
             'Enter your choice:Goodbye.')),
        # Run 1 — every rule the brief states, refused one at a time, plus the
        # empty log and the two keyboard-level guards (a menu choice out of
        # range, and letters where a number belongs).
        ('9\nabc\n4\n'
         '1\nW1\nNghia\n20\n1000\nHanoi\n'
         '1\nW1\nOther\n30\n900\nHue\n'
         '1\n\nNoCode\n30\n900\nHue\n'
         '1\nW9\nOld\n60\n900\nHue\n'
         '1\nW8\nZero\nabc\n25\n0\nHue\n'
         '2\nW2\n100\n'
         '2\nW1\n-5\n'
         '3\nW1\n2000\n'
         '5\n',
         _dated(
             P0056_MENU +
             'Enter your choice:Please choose from 1 to 5.\n'
             'Enter your choice:You must input a number.\n'
             'Enter your choice:--------------------Display Information Salary-----------------------\n'
             'No salary has been adjusted yet.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W1] has been added.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Code [W1] already exists.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Code cannot be null.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Age must be in range 18 to 50\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:You must input a number.\n'
             'Enter Age:Enter Salary: Enter work location:'
             'Salary must be greater than 0\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Code [W2] does not exist.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Amount of money must be > 0\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary must be greater than 0\n' + P0056_MENU +
             'Enter your choice:Goodbye.')),
        # Run 2 — the sort. Codes are entered W3, W1, W2 and adjusted in a
        # deliberately scrambled order; the log must come out grouped by code
        # AND chronological inside each code. That is the stable-sort claim,
        # tested rather than asserted.
        ('1\nW3\nLien\n30\n1000\nHue\n'
         '1\nW1\nNghia\n20\n1000\nHanoi\n'
         '1\nW2\nAnh\n40\n1000\nDanang\n'
         '2\nW3\n30\n'
         '2\nW1\n10\n'
         '3\nW2\n20\n'
         '2\nW1\n11\n'
         '3\nW3\n33\n'
         '4\n5\n',
         _dated(
             P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W3] has been added.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W1] has been added.\n' + P0056_MENU +
             'Enter your choice:--------- Add Worker ----------\n'
             'Enter Code:Enter Name:Enter Age:Enter Salary: Enter work location:'
             'Worker [W2] has been added.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:------- Up/Down Salary --------\n'
             'Enter Code:Enter Salary:Salary has been adjusted.\n' + P0056_MENU +
             'Enter your choice:--------------------Display Information Salary-----------------------\n'
             'Code    Name        Age   Salary      Status  Date\n'
             'W1      Nghia       20    1010.0      UP      {DATE}\n'
             'W1      Nghia       20    1021.0      UP      {DATE}\n'
             'W2      Anh         40    980.0       DOWN    {DATE}\n'
             'W3      Lien        30    1030.0      UP      {DATE}\n'
             'W3      Lien        30    997.0       DOWN    {DATE}\n' + P0056_MENU +
             'Enter your choice:Goodbye.')),
    ],
    explain_en='''<p><strong>Seven files, and the seventh is the point.</strong> Counted across the
sample projects that passed, every submission with seven or more files had a <code>controller</code>,
and the biggest of them was a worker manager. This program is the same shape: five menu options, each
of them the same three steps — collect what the user typed, call the business layer, report what came
back. Left inside <code>Main</code> those fifty lines of prompts bury the menu loop. So
<code>entity</code> holds three classes, <code>bo</code> holds the one that owns the rules,
<code>controller</code> holds the five options, <code>utils</code> holds every keyboard read, and
<code>Main</code> is a menu and nothing else.</p>
<p><strong>The three method names are dictated, spelling mistake included.</strong> The Guidelines
name <code>addWorker</code>, <code>changeSalary</code> and <code>getInfomationSalary</code> — that
last one is missing an "r", and it is kept exactly as written. A marker searches for the name in the
brief; a correctly spelled <code>getInformationSalary</code> is a method they will not find.</p>
<p><strong>Why <code>SalaryStatus</code> is an enum with a sign in it.</strong> The brief could have
asked for a boolean and did not, which is the right call: <code>changeSalary(UP, "W1", 100)</code>
says what it does, while <code>changeSalary(true, ...)</code> makes the reader go and look up which
way round <code>true</code> was meant. Giving each constant its sign (<code>UP(1)</code>,
<code>DOWN(-1)</code>) earns the enum its keep a second time: raising and cutting collapse into one
line, <code>salary + status.getSign() * amount</code>, instead of an if/else with two nearly identical
branches — and near-identical branches are exactly where a fix gets applied to one side and forgotten
on the other.</p>
<p><strong>The history stores the salary but only references the worker.</strong> That asymmetry is
the whole design of <code>SalaryHistory</code>, and the brief's own sample proves it is needed: W1
appears at 1100 and then at 1500. If the log read the salary back off the <code>Worker</code>, both
lines would print 1500, because there is only one worker object and its salary has moved on. Salary is
the field an adjustment changes, so it is the field that must be copied; name and age do not move, so
referencing them means a corrected name fixes the whole log at once.</p>
<p><strong>One stable sort does the work of two comparators.</strong> The brief asks for the list
sorted by code, and its sample shows W1's two raises still in the order they happened.
<code>List.sort</code> is <em>guaranteed</em> stable, so sorting by code alone leaves rows with equal
codes in the order they were added — and on an append-only log, insertion order <em>is</em>
chronological order. Adding a second comparator on the date would produce the same screen and give you
one more thing to get wrong. Run 2 exists only to prove this: the workers are entered W3, W1, W2 and
adjusted in a scrambled order, and the log still comes out grouped by code and chronological inside
each group.</p>
<p><strong>Where a rule lives is a decision, not a detail.</strong> <code>Validator</code> decides
whether what was typed <em>is</em> a number; <code>Management</code> decides whether the number is
<em>allowed</em>. "Age must be in range 18 to 50" is a fact about employment, not about the keyboard,
and the brief puts it behind <code>addWorker</code>'s <code>throws</code> clause. Push it into the
input loop and <code>addWorker</code> becomes a method that can no longer fail — at which point the
signature the brief insisted on is decoration.</p>
<p><strong>Validate the result, not just the input.</strong> A cut of 2000 from a salary of 1000 has
two perfectly valid inputs — the code exists, the amount is positive — and an invalid outcome.
<code>changeSalary</code> computes the new salary, checks it, and only then stores anything, so a
refused adjustment leaves neither the salary nor the log touched. A method that half-applies a change
and then complains is worse than one that refuses.</p>
<p><strong>Two places where the brief contradicts itself.</strong> First, the Guidelines write
<code>public boolean changeSalary(SalaryStatus status, String code, double amount)</code> with no
<code>throws</code> clause, yet the return-values list under it says "Exception list" — as
<code>addWorker</code> does with the clause present. This solution declares <code>throws
Exception</code>, because a method that must report a non-existent code has no other way to; a marker
matching the method by name is unaffected either way. Second, the expected-screen block prints the
five menu entries with no numbers beside them while the sample keystrokes are <code>1</code>,
<code>2</code>, <code>4</code>, <code>3</code>, <code>5</code> — the numbering was lost when the sheet
was converted. They are printed here. The prompt <code>Enter Salary: </code> keeping a trailing space
that the other four prompts do not have is copied from the brief as-is, on the same principle that
governs every screen a marker diffs.</p>
<p><strong>How this was verified.</strong> Three scripted runs. The first reproduces the brief's own
sample table line for line — 1100 UP, 1500 UP, 1300 DOWN. The second walks every rule the brief states
and has it refused one at a time: empty code, duplicate code, age 60, salary 0, unknown code, a
negative amount, and a cut that would zero a salary — plus the empty log, letters typed where a number
belongs, and a menu choice out of range. The third proves the sort. The date column cannot be a fixed
string because the program stamps <code>LocalDate.now()</code>, so the expectation fills today's date
in at check time — stricter than a wildcard, which a program stamping the wrong day would still
match.</p>''',
    explain_vi='''<p><strong>Bảy tệp, và chính tệp thứ bảy mới là điều đáng nói.</strong> Đếm trên các
project mẫu đã đạt, mọi bài từ bảy tệp trở lên đều có gói <code>controller</code>, và bài lớn nhất
trong số đó chính là một chương trình quản lý công nhân. Bài này cùng hình dạng: năm mục thực đơn, mục
nào cũng gồm đúng ba bước — nhận dữ liệu người dùng gõ, gọi tầng nghiệp vụ, báo lại kết quả. Nếu để
nguyên trong <code>Main</code>, năm chục dòng nhắc nhập sẽ chôn vùi vòng lặp thực đơn. Vì thế
<code>entity</code> giữ ba lớp, <code>bo</code> giữ lớp nắm luật, <code>controller</code> giữ năm mục,
<code>utils</code> giữ mọi thao tác đọc bàn phím, còn <code>Main</code> chỉ là một thực đơn.</p>
<p><strong>Ba tên phương thức là do đề áp đặt, kể cả lỗi chính tả.</strong> Phần Guidelines nêu
<code>addWorker</code>, <code>changeSalary</code> và <code>getInfomationSalary</code> — cái cuối thiếu
một chữ "r", và ở đây được giữ nguyên. Người chấm tìm đúng cái tên ghi trong đề; một
<code>getInformationSalary</code> viết đúng chính tả là cái tên họ sẽ không tìm thấy.</p>
<p><strong>Vì sao <code>SalaryStatus</code> là enum mang sẵn dấu.</strong> Đề đã có thể yêu cầu một
tham số boolean nhưng không làm thế, và đó là lựa chọn đúng:
<code>changeSalary(UP, "W1", 100)</code> tự nói ra nó làm gì, còn <code>changeSalary(true, ...)</code>
bắt người đọc đi tra xem <code>true</code> nghĩa là tăng hay giảm. Cho mỗi hằng số mang dấu của nó
(<code>UP(1)</code>, <code>DOWN(-1)</code>) khiến enum đáng giá thêm lần nữa: tăng và giảm gộp lại
thành một dòng, <code>salary + status.getSign() * amount</code>, thay vì một if/else gồm hai nhánh gần
giống hệt nhau — mà hai nhánh gần giống nhau chính là chỗ người ta sửa bên này rồi quên bên kia.</p>
<p><strong>Nhật ký lưu bản sao của lương nhưng chỉ tham chiếu tới công nhân.</strong> Sự bất đối xứng
ấy là toàn bộ thiết kế của <code>SalaryHistory</code>, và chính bảng mẫu của đề chứng minh nó cần
thiết: W1 xuất hiện ở mức 1100 rồi ở mức 1500. Nếu nhật ký đọc lương ngược từ đối tượng
<code>Worker</code>, cả hai dòng sẽ in 1500, vì chỉ có một đối tượng công nhân và lương của nó đã đổi.
Lương là trường mà mỗi lần điều chỉnh làm thay đổi, nên đó là trường phải sao chép; tên và tuổi không
đổi, nên tham chiếu tới chúng có nghĩa là sửa tên một lần là cả nhật ký đúng theo.</p>
<p><strong>Một phép sắp xếp ổn định làm thay việc của hai bộ so sánh.</strong> Đề yêu cầu danh sách
sắp theo mã, còn bảng mẫu cho thấy hai lần tăng của W1 vẫn giữ đúng thứ tự đã xảy ra.
<code>List.sort</code> được <em>bảo đảm</em> là ổn định, nên chỉ cần sắp theo mã là những dòng cùng mã
giữ nguyên thứ tự đã thêm vào — và với một nhật ký chỉ ghi nối, thứ tự thêm vào <em>chính là</em> thứ
tự thời gian. Thêm một bộ so sánh thứ hai theo ngày cũng cho ra đúng màn hình ấy, chỉ tặng thêm cho
bạn một thứ nữa để làm sai. Kịch bản chạy thứ ba sinh ra chỉ để chứng minh điều này: công nhân được
nhập theo thứ tự W3, W1, W2 và được điều chỉnh xáo trộn, mà nhật ký vẫn ra đúng nhóm theo mã và đúng
thời gian trong từng nhóm.</p>
<p><strong>Đặt luật ở đâu là một quyết định, không phải chuyện vặt.</strong> <code>Validator</code>
quyết định thứ vừa gõ <em>có phải</em> một con số; <code>Management</code> quyết định con số đó
<em>có được phép</em> hay không. "Tuổi từ 18 đến 50" là một sự thật về việc tuyển dụng, không phải về
bàn phím, và đề đặt nó sau mệnh đề <code>throws</code> của <code>addWorker</code>. Đẩy nó vào vòng lặp
nhập liệu thì <code>addWorker</code> trở thành một phương thức không còn khả năng thất bại — và khi đó
cái chữ ký mà đề khăng khăng đòi chỉ còn là đồ trang trí.</p>
<p><strong>Kiểm tra kết quả, không chỉ kiểm tra đầu vào.</strong> Trừ 2000 từ mức lương 1000 có hai
đầu vào hoàn toàn hợp lệ — mã có thật, số tiền dương — nhưng cho ra một kết quả không hợp lệ.
<code>changeSalary</code> tính mức lương mới, kiểm tra nó, rồi mới ghi bất cứ thứ gì, nên một điều
chỉnh bị từ chối không đụng tới cả lương lẫn nhật ký. Một phương thức áp dụng nửa vời rồi mới kêu ca
còn tệ hơn một phương thức từ chối thẳng.</p>
<p><strong>Hai chỗ đề tự mâu thuẫn.</strong> Thứ nhất, Guidelines viết
<code>public boolean changeSalary(SalaryStatus status, String code, double amount)</code> không có
mệnh đề <code>throws</code>, nhưng ngay dưới đó phần giá trị trả về lại ghi "Exception list" — giống
như <code>addWorker</code>, chỗ mệnh đề ấy có mặt. Lời giải này khai báo <code>throws
Exception</code>, vì một phương thức phải báo được "mã không tồn tại" thì không còn cách nào khác;
người chấm dò theo tên phương thức thì đằng nào cũng không ảnh hưởng. Thứ hai, khối màn hình mong đợi
in năm mục thực đơn mà không có số thứ tự, trong khi các phím mẫu lại là <code>1</code>,
<code>2</code>, <code>4</code>, <code>3</code>, <code>5</code> — phần đánh số đã mất khi đề được
chuyển đổi định dạng. Ở đây chúng được in ra. Còn dòng nhắc <code>Enter Salary: </code> có thừa một
dấu cách ở cuối mà bốn dòng nhắc kia không có thì được chép nguyên từ đề, theo đúng nguyên tắc áp dụng
cho mọi màn hình mà người chấm so từng ký tự.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba kịch bản chạy. Kịch bản đầu tái hiện đúng bảng mẫu của
đề từng dòng — 1100 UP, 1500 UP, 1300 DOWN. Kịch bản thứ hai đi qua từng luật đề nêu và bắt chương
trình từ chối lần lượt: mã rỗng, mã trùng, tuổi 60, lương 0, mã không tồn tại, số tiền âm, và một lần
trừ làm lương về không — cộng thêm nhật ký rỗng, gõ chữ vào chỗ cần số, và chọn mục ngoài khoảng. Kịch
bản thứ ba chứng minh phép sắp xếp. Cột ngày không thể là chuỗi cố định vì chương trình đóng dấu
<code>LocalDate.now()</code>, nên phần mong đợi điền ngày hôm nay vào lúc kiểm — chặt hơn một ký tự
đại diện, thứ mà một chương trình đóng dấu sai ngày vẫn khớp được.</p>''',
    hints_en=[
        'Keep the brief\'s spelling: getInfomationSalary, not getInformationSalary.',
        'Store the workers in a Map keyed by code — the duplicate check and the lookup are then one step.',
        'SalaryHistory must copy the salary; if it reads it back off the Worker, every old line shows today\'s figure.',
        'One changeSalary for both options: give the enum a sign (+1 / -1) instead of writing if/else twice.',
        'Sorting by code alone is enough — List.sort is stable, so equal codes stay in the order they happened.',
    ],
    hints_vi=[
        'Giữ đúng chính tả của đề: getInfomationSalary, không phải getInformationSalary.',
        'Lưu công nhân trong Map khoá theo mã — khi đó kiểm trùng và tra cứu chỉ còn một bước.',
        'SalaryHistory phải sao chép mức lương; nếu đọc ngược từ Worker thì mọi dòng cũ đều hiện con số hôm nay.',
        'Một changeSalary cho cả hai mục: cho enum mang sẵn dấu (+1 / -1) thay vì viết if/else hai lần.',
        'Chỉ cần sắp theo mã — List.sort là ổn định, nên các dòng cùng mã giữ nguyên thứ tự đã xảy ra.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0065 — Check data format (70 LOC)
# ════════════════════════════════════════════════════════════════

P0065_STUDENT = '''package entity;

import java.io.Serializable;

/**
 * One student: the five things that are typed in, and the two that are worked
 * out from them.
 *
 * average and type are fields rather than getters that recompute, because the
 * brief's own design says so: averageStudent takes "the list of students not
 * classified yet" and returns them classified, and getPercentTypeStudent then
 * counts the types on "the list of students already classified". A student
 * object therefore has two states, and holding the results is what makes the
 * second method able to trust the first.
 *
 * "classes" and not "class": class is a Java keyword, so the brief's own
 * parameter name is the only one that will compile.
 */
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;
    private String classes;
    private double maths;
    private double chemistry;
    private double physics;
    private double average;
    private String type;

    public Student() {
    }

    public Student(String name, String classes, double maths, double chemistry, double physics) {
        this.name = name;
        this.classes = classes;
        this.maths = maths;
        this.chemistry = chemistry;
        this.physics = physics;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClasses() {
        return classes;
    }

    public void setClasses(String classes) {
        this.classes = classes;
    }

    public double getMaths() {
        return maths;
    }

    public void setMaths(double maths) {
        this.maths = maths;
    }

    public double getChemistry() {
        return chemistry;
    }

    public void setChemistry(double chemistry) {
        this.chemistry = chemistry;
    }

    public double getPhysics() {
        return physics;
    }

    public void setPhysics(double physics) {
        this.physics = physics;
    }

    public double getAverage() {
        return average;
    }

    public void setAverage(double average) {
        this.average = average;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return name + " (" + classes + ") " + average + " " + type;
    }
}
'''

P0065_BO = '''package bo;

import entity.Student;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * The three methods the Guidelines name, and the rules behind them.
 *
 * createStudent, averageStudent and getPercentTypeStudent are copied from the
 * brief with their exact signatures - including the HashMap return type, which
 * is more specific than the Map an ordinary design would return. When a brief
 * dictates a signature it is because something is matching on it.
 */
public class MarkCalculation {

    /** The four ranks, in the order they are always displayed. */
    private static final String[] TYPES = {"A", "B", "C", "D"};

    /**
     * Required: Student createStudent(String, String, double, double, double)
     *
     * A factory, not a classifier. It fills in the five typed values and leaves
     * average and type empty, because the brief hands those to averageStudent -
     * which it describes as receiving "the list of students not classified yet".
     * Classifying here would make that method's whole reason for existing
     * disappear.
     */
    public Student createStudent(String name, String classes, double maths,
                                 double chemistry, double physics) {
        return new Student(name, classes, maths, chemistry, physics);
    }

    /**
     * Required: List<Student> averageStudent(List<Student> students)
     *
     * The average is ROUNDED to one decimal place before the rank is decided,
     * not after. That is deliberate and it changes answers: marks of 7.4, 7.6
     * and 7.6 average to 7.533..., which is above 7.5 and would be an A, while
     * the screen would print AVG:7.5 next to it. A student looking at 7.5 marked
     * A cannot check their own grade against the rule they were given. Deciding
     * on the number that is actually shown keeps the screen self-consistent.
     */
    public List<Student> averageStudent(List<Student> students) {
        for (Student student : students) {
            double average = round1((student.getMaths() + student.getChemistry()
                    + student.getPhysics()) / 3);
            student.setAverage(average);
            student.setType(classify(average));
        }
        return students;
    }

    /**
     * Required: HashMap<String, Double> getPercentTypeStudent(List<Student>)
     *
     * All four keys are always present, even when nobody scored a D. A map that
     * only contains the ranks somebody achieved forces every caller to handle a
     * missing key, and the brief's own screen prints all four lines including
     * the zeros.
     *
     * An empty list returns four zeros rather than dividing by it. The menu loop
     * cannot produce an empty list today, but a method that crashes only when
     * called from somewhere else is a trap left for the next person.
     */
    public HashMap<String, Double> getPercentTypeStudent(List<Student> students) {
        HashMap<String, Double> percents = new HashMap<>();
        for (String type : TYPES) {
            percents.put(type, 0.0);
        }
        if (students == null || students.isEmpty()) {
            return percents;
        }
        for (Student student : students) {
            String type = student.getType();
            percents.put(type, percents.get(type) + 1);
        }
        for (String type : TYPES) {
            percents.put(type, round1(percents.get(type) * 100 / students.size()));
        }
        return percents;
    }

    public static String[] getTypes() {
        return TYPES.clone();
    }

    /**
     * The brief's four bands, written as a falling staircase.
     *
     * Each test only needs its lower bound because everything above it has
     * already returned. Spelling out "average >= 6 && average <= 7.5" as well
     * would restate a fact the control flow has already established, and gives
     * the boundary two chances to be typed wrong instead of one.
     */
    private String classify(double average) {
        if (average > 7.5) {
            return "A";
        }
        if (average >= 6) {
            return "B";
        }
        if (average >= 4) {
            return "C";
        }
        return "D";
    }

    /**
     * One decimal place.
     *
     * Math.round returns a long, so the * 10 and / 10.0 have to straddle it -
     * and the 10.0 must be a double, or integer division quietly throws the
     * decimal away and every average comes out whole.
     */
    private double round1(double value) {
        return Math.round(value * 10) / 10.0;
    }
}
'''

P0065_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private static final double MIN_MARK = 0;
    private static final double MAX_MARK = 10;

    private Validator() {
    }

    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /**
     * One mark, asked again until it is acceptable.
     *
     * The label is a parameter because the brief's screen prefixes every message
     * with the subject it belongs to - "Maths is digit", "Physics is less than
     * equal ten". One method with a label produces all nine messages; three
     * copies of it would produce the same nine and three chances to mistype one.
     *
     * The order of the tests is dictated by the screen: an empty line is
     * reported as "is digit", so "is this a number at all" has to be asked
     * before either bound. Testing the bounds first would need a number that
     * does not exist yet.
     */
    public static double getMark(String label) {
        while (true) {
            System.out.print(label + ":");
            String line = SCANNER.nextLine().trim();
            double mark;
            try {
                mark = Double.parseDouble(line);
            } catch (NumberFormatException e) {
                System.out.println(label + " is digit");
                continue;
            }
            if (mark > MAX_MARK) {
                System.out.println(label + " is less than equal ten");
            } else if (mark < MIN_MARK) {
                System.out.println(label + " is greater than equal zero");
            } else {
                return mark;
            }
        }
    }

    /**
     * Y or N, asked again until it is one of them.
     *
     * Anything else loops silently rather than printing an error, because the
     * brief defines no message for it and inventing one puts a line on the
     * screen that the marker's transcript does not have.
     */
    public static boolean getYesNo(String message) {
        while (true) {
            String line = getString(message);
            if (line.equalsIgnoreCase("Y")) {
                return true;
            }
            if (line.equalsIgnoreCase("N")) {
                return false;
            }
        }
    }
}
'''

P0065_MAIN = '''package ui;

import bo.MarkCalculation;
import entity.Student;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import utils.Validator;

/** The screen: ask for students, then show the results. Nothing is decided here. */
public class Main {

    public static void main(String[] args) {
        MarkCalculation calculator = new MarkCalculation();
        List<Student> students = new ArrayList<>();

        System.out.println("====== Management Student Program ======");
        do {
            String name = Validator.getString("Name:");
            String classes = Validator.getString("Classes:");
            double maths = Validator.getMark("Maths");
            double chemistry = Validator.getMark("Chemistry");
            double physics = Validator.getMark("Physics");
            students.add(calculator.createStudent(name, classes, maths, chemistry, physics));
        } while (Validator.getYesNo("Do you want to enter more student information?(Y/N):"));

        calculator.averageStudent(students);

        // The Y/N question is printed with print(), so without this the answer
        // and the first result heading share a line. The brief's screen shows
        // the results starting on a line of their own.
        System.out.println();

        for (int i = 0; i < students.size(); i++) {
            Student student = students.get(i);
            System.out.println("------ Student" + (i + 1) + " Info ------");
            System.out.println("Name:" + student.getName());
            System.out.println("Classes:" + student.getClasses());
            System.out.println("AVG:" + student.getAverage());
            System.out.println("Type:" + student.getType());
        }

        HashMap<String, Double> percents = calculator.getPercentTypeStudent(students);
        System.out.println("--------Classification Info -----");
        // The ranks are printed from a fixed list of keys, never by iterating
        // the map. A HashMap has no order at all - it is free to hand back
        // D, B, A, C, and the fact that four one-letter keys happen to come out
        // alphabetically today is luck, not a promise.
        for (String type : MarkCalculation.getTypes()) {
            System.out.println(type + ": " + percents.get(type) + "%");
        }
    }
}
'''


solution(
    'J1.S.P0065',
    title_vi='Kiểm tra định dạng dữ liệu điểm và xếp loại sinh viên',
    files=[('src/entity/Student.java', P0065_STUDENT),
           ('src/bo/MarkCalculation.java', P0065_BO),
           ('src/utils/Validator.java', P0065_VALIDATOR),
           ('src/ui/Main.java', P0065_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's expected screen, keystroke for keystroke: each of
        # the three subjects refuses 11, then -1, then an empty line, and the
        # second student is entered clean.
        ('Nghia\nFU1\n11\n-1\n\n10\n11\n-1\n\n10\n11\n-1\n\n10\n'
         'Y\nNghia 2\nFU1\n10\n10\n10\nN\n',
         '====== Management Student Program ======\n'
         'Name:Classes:Maths:Maths is less than equal ten\n'
         'Maths:Maths is greater than equal zero\n'
         'Maths:Maths is digit\n'
         'Maths:Chemistry:Chemistry is less than equal ten\n'
         'Chemistry:Chemistry is greater than equal zero\n'
         'Chemistry:Chemistry is digit\n'
         'Chemistry:Physics:Physics is less than equal ten\n'
         'Physics:Physics is greater than equal zero\n'
         'Physics:Physics is digit\n'
         'Physics:Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):\n'
         '------ Student1 Info ------\n'
         'Name:Nghia\nClasses:FU1\nAVG:10.0\nType:A\n'
         '------ Student2 Info ------\n'
         'Name:Nghia 2\nClasses:FU1\nAVG:10.0\nType:A\n'
         '--------Classification Info -----\n'
         'A: 100.0%\nB: 0.0%\nC: 0.0%\nD: 0.0%'),
        # Run 1 — one student of each rank, so all four bands and a clean 25%
        # each are exercised at once. Also checks that an invalid answer to the
        # Y/N question is simply asked again.
        ('An\nFU1\n10\n10\n10\nY\n'
         'Binh\nFU2\n7\n7\n7\nY\n'
         'Chi\nFU3\n5\n5\n5\nY\n'
         'Dung\nFU4\n3\n3\n3\nmaybe\nN\n',
         '====== Management Student Program ======\n'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Do you want to enter more student information?(Y/N):\n'
         '------ Student1 Info ------\n'
         'Name:An\nClasses:FU1\nAVG:10.0\nType:A\n'
         '------ Student2 Info ------\n'
         'Name:Binh\nClasses:FU2\nAVG:7.0\nType:B\n'
         '------ Student3 Info ------\n'
         'Name:Chi\nClasses:FU3\nAVG:5.0\nType:C\n'
         '------ Student4 Info ------\n'
         'Name:Dung\nClasses:FU4\nAVG:3.0\nType:D\n'
         '--------Classification Info -----\n'
         'A: 25.0%\nB: 25.0%\nC: 25.0%\nD: 25.0%'),
        # Run 2 — the boundaries. 7.6 is an A, exactly 7.5 is a B (the band is
        # 6 <= mark <= 7.5), and 3.9 is a D. Three students also show what
        # rounding a third of a hundred does to the total.
        ('Ha\nFU1\n7.6\n7.6\n7.6\nY\n'
         'Khanh\nFU1\n7.5\n7.5\n7.5\nY\n'
         'Linh\nFU1\n3.9\n3.9\n3.9\nN\n',
         '====== Management Student Program ======\n'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):\n'
         '------ Student1 Info ------\n'
         'Name:Ha\nClasses:FU1\nAVG:7.6\nType:A\n'
         '------ Student2 Info ------\n'
         'Name:Khanh\nClasses:FU1\nAVG:7.5\nType:B\n'
         '------ Student3 Info ------\n'
         'Name:Linh\nClasses:FU1\nAVG:3.9\nType:D\n'
         '--------Classification Info -----\n'
         'A: 33.3%\nB: 33.3%\nC: 0.0%\nD: 33.3%'),
        # Run 3 — the case that justifies rounding BEFORE classifying. The raw
        # average of 7.4, 7.6, 7.6 is 7.5333..., which is above 7.5; the screen
        # shows 7.5, and the rank shown agrees with the number shown.
        ('Mai\nFU1\n7.4\n7.6\n7.6\nN\n',
         '====== Management Student Program ======\n'
         'Name:Classes:Maths:Chemistry:Physics:'
         'Do you want to enter more student information?(Y/N):\n'
         '------ Student1 Info ------\n'
         'Name:Mai\nClasses:FU1\nAVG:7.5\nType:B\n'
         '--------Classification Info -----\n'
         'A: 0.0%\nB: 100.0%\nC: 0.0%\nD: 0.0%'),
    ],
    explain_en='''<p><strong>The same title as P0064, and almost nothing in common with it.</strong>
Both sheets are called "Check data format", and P0064 is the small one: three independent checks on
three strings typed once, no storage, no arithmetic, and each check answers on its own. This one keeps
the validating and adds everything that makes a program a program — an unknown number of records
gathered in a loop, a derived value computed from three others, a classification with four bands and
two exact boundaries, and a statistic over the whole set that cannot exist until the last record is
in. P0064's checks return a message and stop; here the input is only the first of three stages, and
the last stage's answer depends on every record that came before it.</p>
<p><strong>Four files: entity, bo, utils, ui.</strong> Measured across the sample projects, four to six
files is where <code>bo</code> appears and <code>controller</code> does not — and that matches what
this program actually is. There is no menu, so nothing needs orchestrating: <code>Main</code> gathers,
then calls the two methods, then prints. Adding a controller here would give it one caller and one
line to forward, and an empty layer is a mark lost rather than gained.</p>
<p><strong>The three signatures are dictated, and one of them is unusual.</strong>
<code>getPercentTypeStudent</code> must return <code>HashMap&lt;String, Double&gt;</code>, not
<code>Map</code>. Returning the concrete class is not what you would normally design — it ties the
caller to one implementation — but the brief names it, so it is what the method returns. When a brief
dictates a signature it is because something is matching on it.</p>
<p><strong>Never print a HashMap by iterating it.</strong> A <code>HashMap</code> has no order
whatsoever; it is entitled to hand back D, B, A, C. Four one-letter keys happening to come out
alphabetically on your machine is luck, not a promise, and it is luck that breaks the day a fifth rank
is added. <code>Main</code> prints from a fixed list of keys and looks each one up, so the order on
screen is a decision rather than an accident.</p>
<p><strong>All four keys exist even when nobody scored a D.</strong> The brief's own screen prints
<code>D: 0.0%</code>, and a map holding only the ranks somebody achieved would force every caller to
handle a missing key. Filling in the zeros first and then overwriting the counts costs one loop and
removes a whole class of null checks.</p>
<p><strong>Round the average before deciding the rank, not after.</strong> Marks of 7.4, 7.6 and 7.6
average to 7.5333…, which is above 7.5 and therefore an A — while the screen, printing one decimal
place, would show <code>AVG:7.5</code> beside it. A student cannot then check their own grade against
the rule they were given. Deciding the rank from the number that is actually displayed keeps the screen
self-consistent, and the last verified run in this solution is that exact case.</p>
<p><strong>The bands are a falling staircase, not four independent tests.</strong> Once
<code>average &gt; 7.5</code> has returned, the next test only needs its own lower bound: writing
<code>average &gt;= 6 &amp;&amp; average &lt;= 7.5</code> restates something the control flow has
already established and gives the 7.5 boundary two chances to be typed wrong instead of one. The
boundaries themselves are verified rather than argued: 7.6 comes out A, exactly 7.5 comes out B.</p>
<p><strong>One <code>getMark</code> with a label, not three copies.</strong> The brief prefixes every
message with the subject — "Maths is digit", "Physics is less than equal ten" — which is nine messages
across three subjects. Passing the label in produces all nine from one method; three near-identical
copies produce the same nine plus three chances to mistype one. The order of the tests inside it is
dictated by the brief's screen: an empty line is reported as "is digit", so "is this a number at all"
has to be asked before either bound — which is also the only order that can work, since the bounds
need a number that does not exist yet.</p>
<p><strong>Where the brief contradicts itself, and what was chosen.</strong> The specification says the
marks are "in the range from 1 to 10", but the expected screen rejects <code>-1</code> with <em>is
greater than equal zero</em> — a message that only makes sense for a lower bound of 0, and one that
would never appear if the bound were 1. The screen is the only place either bound is stated concretely,
so 0 to 10 is implemented and 1 to 10 is not. The same screen is also where every message string comes
from, ungrammatical as they are: <em>Maths is digit</em> means "must be a number", and it is copied
exactly, because the marker diffs the screen. A smaller mismatch: the specification lists the subjects
as "Math, Physical and Chemistry" while both the screen and the required <code>createStudent</code>
signature order them maths, chemistry, physics — the two that agree win.</p>
<p><strong>An honest caveat about the percentages.</strong> Three students of three different ranks
give 33.3% each, which adds up to 99.9%. Rounding each share independently cannot be made to total
100% without deciding which rank absorbs the remainder, and the brief asks for no such rule. Verified
run 2 shows this happening rather than hiding it; if an examiner raises it, that is the answer.</p>
<p><strong>How this was verified.</strong> Four runs. The first replays the brief's expected screen
keystroke for keystroke, including all nine rejection messages. The second enters one student of each
rank and gets 25% four times. The third pins the boundaries — 7.6 → A, exactly 7.5 → B, 3.9 → D — and
shows the 33.3% rounding. The fourth is the 7.4/7.6/7.6 student whose displayed average and rank would
disagree if the rounding happened in the other order.</p>''',
    explain_vi='''<p><strong>Cùng tên với P0064, mà gần như không có gì chung.</strong> Hai đề đều tên
là "Check data format", và P0064 là bản nhỏ: ba phép kiểm tra độc lập trên ba chuỗi nhập một lần,
không lưu trữ, không tính toán, mỗi phép tự trả lời được. Bài này giữ lại phần kiểm tra và thêm vào
mọi thứ khiến một chương trình trở thành chương trình — số bản ghi không biết trước, gom bằng vòng
lặp; một giá trị dẫn xuất tính từ ba giá trị khác; một phép xếp loại bốn mức với hai biên chính xác;
và một thống kê trên toàn bộ tập dữ liệu, thứ không thể tồn tại cho tới khi bản ghi cuối cùng được
nhập. Các phép kiểm của P0064 trả về thông điệp rồi dừng; ở đây khâu nhập chỉ là chặng đầu trong ba
chặng, và câu trả lời của chặng cuối phụ thuộc vào mọi bản ghi đứng trước nó.</p>
<p><strong>Bốn tệp: entity, bo, utils, ui.</strong> Đo trên các project mẫu, khoảng bốn tới sáu tệp là
chỗ <code>bo</code> xuất hiện còn <code>controller</code> thì chưa — và điều đó khớp với đúng bản chất
chương trình này. Không có thực đơn nên chẳng có gì cần điều phối: <code>Main</code> gom dữ liệu, gọi
hai phương thức, rồi in. Thêm một controller ở đây thì nó chỉ có một nơi gọi và một dòng chuyển tiếp,
mà một tầng rỗng là mất điểm chứ không phải được điểm.</p>
<p><strong>Ba chữ ký là do đề áp đặt, và một trong số đó khá lạ.</strong>
<code>getPercentTypeStudent</code> phải trả về <code>HashMap&lt;String, Double&gt;</code> chứ không
phải <code>Map</code>. Trả về lớp cụ thể không phải cách thiết kế thông thường — nó trói người gọi vào
một cài đặt — nhưng đề ghi rõ như vậy, nên phương thức trả về đúng như vậy. Khi một đề bài áp đặt chữ
ký, ấy là vì có thứ gì đó đang dò theo nó.</p>
<p><strong>Đừng bao giờ in một HashMap bằng cách duyệt nó.</strong> <code>HashMap</code> hoàn toàn
không có thứ tự; nó có quyền trả về D, B, A, C. Việc bốn khoá một chữ cái tình cờ ra đúng thứ tự bảng
chữ cái trên máy bạn là may mắn, không phải lời hứa, và cái may đó vỡ ngay ngày có thêm mức thứ năm.
<code>Main</code> in theo một danh sách khoá cố định và tra từng khoá, nên thứ tự trên màn hình là một
quyết định chứ không phải tai nạn.</p>
<p><strong>Cả bốn khoá đều có mặt kể cả khi không ai xếp loại D.</strong> Chính màn hình của đề in
<code>D: 0.0%</code>, và một map chỉ chứa những mức có người đạt sẽ buộc mọi nơi gọi phải xử lý khoá
thiếu. Điền số 0 trước rồi ghi đè bằng số đếm chỉ tốn một vòng lặp và xoá sạch cả một loại lỗi
null.</p>
<p><strong>Làm tròn điểm trung bình trước khi xếp loại, không phải sau.</strong> Ba điểm 7,4 – 7,6 –
7,6 có trung bình 7,5333…, lớn hơn 7,5 nên là loại A — trong khi màn hình in một chữ số thập phân sẽ
hiện <code>AVG:7.5</code> ngay bên cạnh. Sinh viên khi đó không thể tự đối chiếu xếp loại của mình với
đúng cái luật họ được cho. Quyết định xếp loại dựa trên con số thật sự hiển thị giữ cho màn hình nhất
quán với chính nó, và kịch bản chạy cuối cùng trong lời giải này chính là trường hợp đó.</p>
<p><strong>Bốn mức là một bậc thang đi xuống, không phải bốn phép kiểm độc lập.</strong> Một khi
<code>average &gt; 7.5</code> đã trả về, phép kiểm tiếp theo chỉ cần cận dưới của nó: viết
<code>average &gt;= 6 &amp;&amp; average &lt;= 7.5</code> là nhắc lại điều mà luồng điều khiển đã bảo
đảm, và cho cái biên 7,5 hai cơ hội bị gõ sai thay vì một. Bản thân các biên thì được kiểm chứng chứ
không phải lý luận suông: 7,6 ra A, đúng 7,5 ra B.</p>
<p><strong>Một <code>getMark</code> có nhãn, không phải ba bản sao.</strong> Đề gắn tên môn vào trước
mọi thông điệp — "Maths is digit", "Physics is less than equal ten" — tức chín thông điệp cho ba môn.
Truyền nhãn vào thì một phương thức sinh ra cả chín; ba bản sao gần giống nhau sinh ra đúng chín ấy
cộng ba cơ hội gõ sai. Thứ tự các phép kiểm bên trong do màn hình của đề quy định: dòng trống bị báo
là "is digit", nên câu hỏi "đây có phải một con số không" phải đặt trước cả hai cận — và đó cũng là
thứ tự duy nhất chạy được, vì hai cận cần một con số còn chưa tồn tại.</p>
<p><strong>Chỗ đề tự mâu thuẫn, và lựa chọn ở đây.</strong> Phần đặc tả nói điểm "trong khoảng từ 1
đến 10", nhưng màn hình mong đợi lại từ chối <code>-1</code> bằng câu <em>is greater than equal
zero</em> — một thông điệp chỉ có nghĩa khi cận dưới là 0, và sẽ không bao giờ xuất hiện nếu cận dưới
là 1. Màn hình là nơi duy nhất nêu cận một cách cụ thể, nên 0 đến 10 được cài đặt còn 1 đến 10 thì
không. Cũng chính màn hình ấy là nguồn của mọi chuỗi thông điệp, dù chúng sai ngữ pháp: <em>Maths is
digit</em> ý là "phải là một con số", và nó được chép nguyên xi, vì người chấm so từng ký tự. Một chỗ
vênh nhỏ hơn: phần đặc tả liệt kê các môn là "Math, Physical and Chemistry" trong khi cả màn hình lẫn
chữ ký bắt buộc của <code>createStudent</code> đều xếp theo maths, chemistry, physics — hai bên đồng ý
với nhau thì thắng.</p>
<p><strong>Một lưu ý thành thật về phần trăm.</strong> Ba sinh viên thuộc ba loại khác nhau cho ra
33,3% mỗi loại, cộng lại thành 99,9%. Làm tròn từng phần một cách độc lập thì không thể ép tổng về
100% nếu không quyết định mức nào gánh phần dư, mà đề không đưa ra luật nào như vậy. Kịch bản chạy thứ
ba cho thấy điều đó xảy ra thay vì giấu đi; nếu giám khảo hỏi tới, đó là câu trả lời.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Bốn lần chạy. Lần đầu diễn lại đúng màn hình mong đợi của
đề theo từng phím gõ, gồm cả chín thông điệp từ chối. Lần hai nhập mỗi loại một sinh viên và nhận về
25% bốn lần. Lần ba ghim các biên — 7,6 → A, đúng 7,5 → B, 3,9 → D — và cho thấy phép làm tròn 33,3%.
Lần bốn là sinh viên 7,4/7,6/7,6, người mà điểm trung bình hiển thị và xếp loại sẽ đá nhau nếu làm
tròn ở thứ tự ngược lại.</p>''',
    hints_en=[
        'Copy the message strings from the brief exactly, odd grammar included — "Maths is digit" is the text.',
        'Ask "is it a number" before either bound: an empty line has no value to compare.',
        'Pass the subject name into one getMark method instead of writing the same loop three times.',
        'Round the average to one decimal BEFORE choosing the rank, so the screen and the rank agree.',
        'Put all four keys A, B, C, D in the map up front, and print them from a fixed list — a HashMap has no order.',
    ],
    hints_vi=[
        'Chép nguyên chuỗi thông điệp từ đề, kể cả chỗ sai ngữ pháp — "Maths is digit" chính là câu đó.',
        'Hỏi "có phải số không" trước cả hai cận: một dòng trống thì chẳng có giá trị nào để so.',
        'Truyền tên môn vào một phương thức getMark thay vì viết cùng một vòng lặp ba lần.',
        'Làm tròn điểm trung bình một chữ số thập phân TRƯỚC khi xếp loại, để màn hình và xếp loại khớp nhau.',
        'Đặt sẵn cả bốn khoá A, B, C, D vào map, và in theo danh sách cố định — HashMap không có thứ tự.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
# The English brief is the contract and stays untouched; this is the reading
# aid beside it, so every message string the program prints stays in English
# exactly as the brief prints it.
VI = {
    'J1.S.P0056': '''<p><strong>Short Assignment · J1.S.P0056 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình quản lý công nhân:</p>
<ol>
<li>Thêm một công nhân.</li>
<li>Tăng lương cho công nhân.</li>
<li>Giảm lương cho công nhân.</li>
<li>Hiển thị thông tin những công nhân đã được điều chỉnh lương.</li>
</ol>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và yêu cầu người dùng chọn một mục.</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình nhắc chọn một mục.</li>
<li>Người dùng chọn một mục, chuyển sang Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn.</h4>
<ul>
<li><strong>Mục 1: Thêm công nhân</strong>
<ul>
<li>Nhắc người dùng nhập thông tin (mã, tên, tuổi, lương, nơi làm việc).</li>
<li>Kiểm tra dữ liệu nhập vào hợp lệ theo các điều kiện:
<ul>
<li>Mã (id) không được rỗng và không được trùng với mã đã có trong dữ liệu.</li>
<li>Tuổi phải trong khoảng 18 đến 50.</li>
<li>Lương phải lớn hơn 0.</li>
</ul>
</li>
<li>Thêm công nhân vào dữ liệu.</li>
<li>Quay về màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 2: Tăng lương</strong>
<ul>
<li>Nhắc nhập mã và số tiền muốn tăng.</li>
<li>Dữ liệu phải hợp lệ: mã phải tồn tại trong dữ liệu; số tiền phải &gt; 0.</li>
<li>Cộng vào lương của công nhân và lưu lại lịch sử điều chỉnh lương.</li>
<li>Quay về màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 3: Giảm lương</strong>
<ul>
<li>Nhắc nhập mã và số tiền muốn trừ.</li>
<li>Dữ liệu phải hợp lệ: mã phải tồn tại trong dữ liệu; số tiền phải &gt; 0.</li>
<li>Trừ vào lương của công nhân và lưu lại lịch sử điều chỉnh lương.</li>
<li>Quay về màn hình chính.</li>
</ul>
</li>
<li><strong>Mục 4:</strong> Hiển thị tất cả công nhân đã được điều chỉnh lương, sắp theo mã công nhân.</li>
<li><strong>Mục 5:</strong> Thoát chương trình.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>======== Worker Management =========
Add Worker
Up salary
Down salary
Display Information salary
Exit</pre>
<pre>--------- Add Worker ----------
Enter Code:
Enter Name:
Enter Age:
Enter Salary:
Enter work location:</pre>
<pre>------- Up/Down Salary --------
Enter Code:
Enter Salary:</pre>
<pre>--------------------Display Information Salary-----------------------
Code 	Name	 	Age    	Salary		Status  	Date
W 1 	Nghia 		20	    	1100		UP		23/06/2015
W 1 	Nghia		20	    	1500		UP		23/07/2015
W 3 	Lien		20	    	1300		DOWN		23/07/2015</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>addWorker</code>,
<code>changeSalary</code>, <code>getInfomationSalary</code> trong mã nguồn.</p>
<h4>Ví dụ</h4>
<p>Lớp <code>Management</code> chứa các hàm thêm, hiển thị, tăng và giảm lương công nhân.</p>
<h4>Mục 1: Thêm công nhân</h4>
<ul>
<li>Tên hàm: <code>public boolean addWorker(Worker worker) throws Exception</code></li>
<li>Đầu vào: <code>worker</code> — thông tin công nhân.</li>
<li>Trả về: trạng thái thêm được hay không; kèm danh sách ngoại lệ.</li>
</ul>
<h4>Mục 2 &amp; Mục 3: Điều chỉnh lương</h4>
<ul>
<li>Tên hàm: <code>public boolean changeSalary(SalaryStatus status, String code, double amount)</code></li>
<li>Đầu vào: <code>status</code> — tăng hay giảm; <code>code</code> — mã công nhân;
<code>amount</code> — số tiền.</li>
<li>Trả về: trạng thái điều chỉnh; kèm danh sách ngoại lệ.</li>
</ul>
<h4>Mục 4: Hiển thị danh sách công nhân đã điều chỉnh lương</h4>
<ul>
<li>Tên hàm: <code>public List&lt;SalaryHistory&gt; getInfomationSalary()</code></li>
<li>Đầu vào: không có.</li>
<li>Trả về: danh sách sắp xếp theo mã công nhân.</li>
</ul>''',

    'J1.S.P0065': '''<p><strong>Short Assignment · J1.S.P0065 · 70 LOC · 1 slot</strong></p>
<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình cho phép nhập:</p>
<ul>
<li>Thông tin sinh viên gồm: tên sinh viên, tên lớp, điểm Toán, Lý và Hoá trong khoảng từ 1 đến 10.</li>
</ul>
<p>Hiển thị ra màn hình:</p>
<ul>
<li>Xếp loại sinh viên theo các điều kiện:
<ul>
<li>A: điểm &gt; 7.5</li>
<li>B: 6 &lt;= điểm &lt;= 7.5</li>
<li>C: 4 &lt;= điểm &lt; 6</li>
<li>D: điểm &lt; 4</li>
</ul>
</li>
<li>Thống kê xếp loại theo %.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul>
<li>Người dùng chạy chương trình. Chương trình nhắc nhập dữ liệu sinh viên.</li>
<li>Khi người dùng dừng nhập, chuyển sang Chức năng 2.</li>
</ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<ul>
<li>Chương trình xếp loại sinh viên và thống kê tỉ lệ % theo từng loại.</li>
<li>Hiển thị kết quả của từng sinh viên cùng kết quả thống kê, rồi kết thúc chương trình.</li>
</ul>
<h3>Màn hình mong đợi</h3>
<pre>====== Management Student Program ======
Name:Nghia
Classes:FU1
Maths:11
Maths is less than equal ten
Maths:-1
Maths is greater than equal zero
Maths:
Maths is digit
Maths:10
Chemistry:11
Chemistry is less than equal ten
Chemistry:-1
Chemistry is greater than equal zero
Chemistry:
Chemistry is digit
Chemistry:10
Physics:11
Physics is less than equal ten
Physics:-1
Physics is greater than equal zero
Physics:
Physics is digit
Physics:10
Do you want to enter more student information?(Y/N):Y
Name:Nghia 2
Classes:FU1
Maths:10
Chemistry:10
Physics:10
Do you want to enter more student information?(Y/N):N</pre>
<pre>------ Student1 Info ------
Name:Nghia
Classes:FU1
AVG:10.0
Type:A
------ Student2 Info ------
Name:Nghia 2
Classes:FU1
AVG:10.0
Type:A
--------Classification Info -----
A: 100.0%
B: 0.0%
C: 0.0%
D: 0.0%</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>createStudent</code>,
<code>averageStudent</code>, <code>getPercentTypeStudent</code> trong mã nguồn.</p>
<h4>Gợi ý</h4>
<p>Tạo lớp <code>Student</code> với các thuộc tính: tên sinh viên, lớp, điểm Toán, Lý, Hoá, điểm trung
bình, xếp loại.</p>
<p>Tạo một lớp tính điểm (Mark Calculation) để xếp loại sinh viên, tính thống kê theo % và gán kết quả
vào đối tượng <code>Student</code>.</p>
<h4>Chức năng 1: Nhập thông tin sinh viên</h4>
<ul>
<li>Bắt buộc tạo hàm:
<code>Student createStudent(String name, String classes, double maths, double chemistry, double physics)</code></li>
<li>Đầu vào: <code>name</code> — tên sinh viên; <code>classes</code> — lớp; <code>maths</code> — điểm
Toán; <code>chemistry</code> — điểm Hoá; <code>physics</code> — điểm Lý.</li>
<li>Trả về: một đối tượng <code>Student</code>.</li>
</ul>
<h4>Chức năng 2: Xếp loại sinh viên</h4>
<ul>
<li>Bắt buộc tạo hàm: <code>List&lt;Student&gt; averageStudent(List&lt;Student&gt; students)</code></li>
<li>Đầu vào: danh sách sinh viên chưa xếp loại.</li>
<li>Trả về: danh sách sinh viên đã xếp loại.</li>
</ul>
<h4>Chức năng 3: Thống kê xếp loại</h4>
<ul>
<li>Bắt buộc tạo hàm:
<code>HashMap&lt;String, Double&gt; getPercentTypeStudent(List&lt;Student&gt; students)</code></li>
<li>Đầu vào: danh sách sinh viên đã xếp loại.</li>
<li>Trả về: thống kê % theo các khoá A, B, C, D.</li>
</ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
