# Batch 23 — J1.S.P0085 (employee management: CRUD, validation, sort) and
# J1.L.P0015 (BMLT asset management, the EMPLOYEE half of the pair: borrow,
# cancel a request, return an asset — four .dat files that must survive the JVM).
import re
from datetime import datetime
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0085 — Employee management system (150 LOC)
# ════════════════════════════════════════════════════════════════

P0085_EMPLOYEE = r'''package entity;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * One employee record: the ten fields the brief lists, and nothing else.
 *
 * `id` is final and has NO setter, while the other nine fields have both. That
 * asymmetry is deliberate: EmployeeManager guarantees "no two employees share an
 * Id", and a guarantee that anything can quietly break by calling setId() is not
 * a guarantee. Update changes what a person IS, never which record they ARE.
 *
 * dob is a LocalDate rather than a String: the brief calls the field a Date, and
 * storing it as text would let "1994-13-40" into the list and only fail later,
 * somewhere far away from the person who typed it.
 */
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String address;
    private LocalDate dob;
    private String sex;
    private double salary;
    private String agency;

    public Employee(String id, String firstName, String lastName, String phone,
            String email, String address, LocalDate dob, String sex,
            double salary, String agency) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.dob = dob;
        this.sex = sex;
        this.salary = salary;
        this.agency = agency;
    }

    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public String getAgency() {
        return agency;
    }

    public void setAgency(String agency) {
        this.agency = agency;
    }

    /** "John Smith" — the sorted report shows one name column, not two. */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    @Override
    public String toString() {
        return String.format(
                "Employee{id=%s, name=%s, phone=%s, email=%s, address=%s, "
                + "dob=%s, sex=%s, salary=%.2f, agency=%s}",
                id, getFullName(), phone, email, address, dob, sex, salary, agency);
    }
}
'''

P0085_BO = r'''package bo;

import entity.Employee;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * The list of employees and the four rules that govern it. It never prints and
 * it never reads the keyboard: it either answers, or it throws with the message
 * the user should see.
 *
 * Keeping the messages here rather than in the controller means each rule has
 * exactly one wording, no matter which screen ran into it.
 */
public class EmployeeManager {

    private final List<Employee> employees = new ArrayList<>();

    public boolean isEmpty() {
        return employees.isEmpty();
    }

    /** null when there is no such employee — "absent" is an answer, not a fault. */
    public Employee findById(String id) {
        for (Employee employee : employees) {
            if (employee.getId().equalsIgnoreCase(id)) {
                return employee;
            }
        }
        return null;
    }

    /**
     * The uniqueness rule, written once.
     *
     * The Add screen calls this the moment the Id is typed, so the user is told
     * immediately instead of after nine more questions; add() calls it again
     * before the record goes in. One rule, one message, two call sites — and no
     * way for a future caller to slip a duplicate in by not asking first.
     */
    public void requireNewId(String id) throws Exception {
        if (findById(id) != null) {
            throw new Exception("Employee id " + id + " already exists.");
        }
    }

    /** The lookup that must succeed: Update and Remove both start with it. */
    public Employee requireById(String id) throws Exception {
        Employee employee = findById(id);
        if (employee == null) {
            throw new Exception("No employee found with id " + id + ".");
        }
        return employee;
    }

    public void add(Employee employee) throws Exception {
        requireNewId(employee.getId());
        employees.add(employee);
    }

    public void remove(String id) throws Exception {
        employees.remove(requireById(id));
    }

    /**
     * Case-insensitive "contains" over the first name AND the last name.
     *
     * The brief asks for "the first name, the last name, or a part of the name",
     * so "sm" must find Smith and "jo" must find John. Lower-casing both sides is
     * the whole of it; anything cleverer (starts-with, whole words) would fail
     * the brief's own example.
     */
    public List<Employee> searchByName(String keyword) {
        String needle = keyword.toLowerCase();
        List<Employee> found = new ArrayList<>();
        for (Employee employee : employees) {
            if (employee.getFirstName().toLowerCase().contains(needle)
                    || employee.getLastName().toLowerCase().contains(needle)) {
                found.add(employee);
            }
        }
        return found;
    }

    /**
     * A sorted COPY, ascending by salary.
     *
     * The Guidelines name the comparator, and it is used exactly as written. What
     * they do not say is whether the stored list should be reordered, and it is
     * not: sorting the master list would silently destroy the order the records
     * were entered in, which is the only order the program can never recover.
     * "Show me the list sorted" is a question, not an edit.
     */
    public List<Employee> sortBySalary() {
        List<Employee> sorted = new ArrayList<>(employees);
        sorted.sort(Comparator.comparingDouble(Employee::getSalary));
        return sorted;
    }
}
'''

P0085_VALIDATOR = r'''package utils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

/**
 * Every keyboard read in the program, and every rule about what may be typed.
 *
 * ONE static Scanner, a private constructor, all methods static. A second
 * `new Scanner(System.in)` in another class is not a second keyboard: it buffers
 * ahead and eats lines the first one still needed. Closing this one would close
 * System.in itself and break every later read.
 *
 * The design worth defending here is `ask()`. Every field follows the same
 * shape - print a label, read a line, complain, repeat - and they differ only in
 * the rule. So the loop is written once and the rule is passed in. That also
 * makes "blank keeps the current value" a property of the loop rather than nine
 * copies of an if: pass the current value for Update, pass null for Add, and the
 * same method covers both screens.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    /** The brief's own label column: 11 characters, then a colon and a space. */
    private static final String LABEL = "%-11s: ";

    private static final String EMAIL_PATTERN =
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    /** null means "this value is acceptable"; anything else is what to print. */
    private interface Rule {

        String check(String value);
    }

    private Validator() {
    }

    private static String ask(String label, String current, Rule rule) {
        while (true) {
            System.out.printf(LABEL, label);
            if (current != null) {
                System.out.print("[" + current + "] ");
            }
            String line = SCANNER.nextLine().trim();
            if (line.isEmpty()) {
                if (current != null) {
                    return current;
                }
                System.out.println("This field is required.");
                continue;
            }
            String error = rule.check(line);
            if (error != null) {
                System.out.println(error);
                continue;
            }
            return line;
        }
    }

    /** Required, otherwise unconstrained: Id, names, address, agency. */
    public static String getText(String label, String current) {
        return ask(label, current, value -> null);
    }

    public static String getPhone(String label, String current) {
        return ask(label, current, value -> value.matches("\\d+")
                ? null : "Phone must contain digits only.");
    }

    public static String getEmail(String label, String current) {
        return ask(label, current, value -> value.matches(EMAIL_PATTERN)
                ? null : "Email must look like name@domain.com.");
    }

    /**
     * A real date, not a string that looks like one.
     *
     * LocalDate.parse rejects 2024-02-31; the older SimpleDateFormat accepts it
     * and quietly hands back the 2nd of March unless you remember
     * setLenient(false). One of those two behaviours is a bug you find in the
     * demonstration.
     */
    public static LocalDate getDate(String label, LocalDate current) {
        String text = ask(label, current == null ? null : current.toString(), value -> {
            try {
                LocalDate.parse(value);
                return null;
            } catch (DateTimeParseException e) {
                return "DOB must be a real date in yyyy-MM-dd format.";
            }
        });
        return LocalDate.parse(text);
    }

    /** Male or Female, typed in any case, stored in one. */
    public static String getSex(String label, String current) {
        String text = ask(label, current, value ->
                value.equalsIgnoreCase("Male") || value.equalsIgnoreCase("Female")
                        ? null : "Sex must be Male or Female.");
        return text.equalsIgnoreCase("Male") ? "Male" : "Female";
    }

    public static double getSalary(String label, Double current) {
        String text = ask(label, current == null ? null : String.format("%.2f", current), value -> {
            try {
                return Double.parseDouble(value) > 0
                        ? null : "Salary must be greater than 0.";
            } catch (NumberFormatException e) {
                return "Salary must be a number.";
            }
        });
        return Double.parseDouble(text);
    }

    /** Free text that is allowed to be anything, including a single letter. */
    public static String getKeyword(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("Please type something to search for.");
        }
    }

    public static int getOption(String message, int min, int max) {
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
}
'''

P0085_CONTROLLER = r'''package controller;

import bo.EmployeeManager;
import entity.Employee;
import java.time.LocalDate;
import java.util.List;
import utils.Validator;

/**
 * One method per menu item: ask, call the manager, report what happened.
 *
 * This layer exists because the five screens are not one-liners - Update alone
 * is ten prompts that each have to remember an old value - and because Main
 * should be readable as a menu. The rule of thumb: if a class both draws the
 * menu and knows that a salary is entered after a sex, it is doing two jobs.
 *
 * Nothing here decides anything. Every rule lives in bo.EmployeeManager and
 * arrives as an exception message, so the wording of "already exists" is in one
 * file even though three screens can print it.
 */
public class EmployeeController {

    private static final String SEARCH_ROW = "%-7s%-12s%-11s%9s  %s%n";
    private static final String SEARCH_LINE = "-----------------------------------------------";
    private static final String SORT_ROW = "%-7s%-19s%7s  %s%n";
    private static final String SORT_LINE = "-----------------------------------------";

    private final EmployeeManager manager = new EmployeeManager();

    public void add() {
        System.out.println("-- Add employee --");

        // The Id is checked the moment it is typed. Asking the other nine
        // questions first and only then saying "that Id is taken" is technically
        // correct and infuriating.
        String id;
        while (true) {
            id = Validator.getText("Id", null);
            try {
                manager.requireNewId(id);
                break;
            } catch (Exception e) {
                System.out.println("=> " + e.getMessage());
            }
        }

        String firstName = Validator.getText("First name", null);
        String lastName = Validator.getText("Last name", null);
        String phone = Validator.getPhone("Phone", null);
        String email = Validator.getEmail("Email", null);
        String address = Validator.getText("Address", null);
        LocalDate dob = Validator.getDate("DOB", null);
        String sex = Validator.getSex("Sex", null);
        double salary = Validator.getSalary("Salary", null);
        String agency = Validator.getText("Agency", null);

        try {
            manager.add(new Employee(id, firstName, lastName, phone, email,
                    address, dob, sex, salary, agency));
            System.out.println("=> Employee " + id + " added successfully.");
        } catch (Exception e) {
            System.out.println("=> " + e.getMessage());
        }
    }

    public void update() {
        System.out.println("-- Update employee --");
        if (empty()) {
            return;
        }
        String id = Validator.getText("Id", null);
        Employee employee;
        try {
            employee = manager.requireById(id);
        } catch (Exception e) {
            System.out.println("=> " + e.getMessage());
            return;
        }

        System.out.println("Press Enter to keep the value in brackets.");
        employee.setFirstName(Validator.getText("First name", employee.getFirstName()));
        employee.setLastName(Validator.getText("Last name", employee.getLastName()));
        employee.setPhone(Validator.getPhone("Phone", employee.getPhone()));
        employee.setEmail(Validator.getEmail("Email", employee.getEmail()));
        employee.setAddress(Validator.getText("Address", employee.getAddress()));
        employee.setDob(Validator.getDate("DOB", employee.getDob()));
        employee.setSex(Validator.getSex("Sex", employee.getSex()));
        employee.setSalary(Validator.getSalary("Salary", employee.getSalary()));
        employee.setAgency(Validator.getText("Agency", employee.getAgency()));

        System.out.println("=> Employee " + employee.getId() + " updated successfully.");
        System.out.println("   " + employee);
    }

    public void remove() {
        System.out.println("-- Remove employee --");
        if (empty()) {
            return;
        }
        String id = Validator.getText("Id", null);
        try {
            manager.remove(id);
            System.out.println("=> Employee " + id + " removed successfully.");
        } catch (Exception e) {
            System.out.println("=> " + e.getMessage());
        }
    }

    public void search() {
        System.out.println("-- Search employees --");
        if (empty()) {
            return;
        }
        String keyword = Validator.getKeyword("Enter name (or part): ");
        List<Employee> found = manager.searchByName(keyword);
        if (found.isEmpty()) {
            System.out.println("=> No employee matches \"" + keyword + "\".");
            return;
        }
        System.out.printf(SEARCH_ROW, "Id", "First name", "Last name", "Salary", "Agency");
        System.out.println(SEARCH_LINE);
        for (Employee employee : found) {
            System.out.printf(SEARCH_ROW, employee.getId(), employee.getFirstName(),
                    employee.getLastName(), money(employee.getSalary()), employee.getAgency());
        }
    }

    public void sortBySalary() {
        if (empty()) {
            return;
        }
        System.out.println("Employees sorted by salary (ascending):");
        System.out.printf(SORT_ROW, "Id", "Name", "Salary", "Agency");
        System.out.println(SORT_LINE);
        for (Employee employee : manager.sortBySalary()) {
            System.out.printf(SORT_ROW, employee.getId(), employee.getFullName(),
                    money(employee.getSalary()), employee.getAgency());
        }
    }

    /** Four of the five screens are meaningless on an empty list; say so once. */
    private boolean empty() {
        if (manager.isEmpty()) {
            System.out.println("=> The employee list is empty.");
            return true;
        }
        return false;
    }

    private static String money(double salary) {
        return String.format("%.2f", salary);
    }
}
'''

P0085_MAIN = r'''package ui;

import controller.EmployeeController;
import utils.Validator;

/**
 * The menu, and nothing else. Every case is one line, which is the test of
 * whether the controller took the work it was supposed to take.
 */
public class Main {

    private static final String TOP = "========= EMPLOYEE MANAGEMENT =========";
    private static final String BOTTOM = "=======================================";

    public static void main(String[] args) {
        EmployeeController controller = new EmployeeController();
        boolean running = true;
        while (running) {
            System.out.println(TOP);
            System.out.println("1. Add employees");
            System.out.println("2. Update employees");
            System.out.println("3. Remove employees");
            System.out.println("4. Search employees");
            System.out.println("5. Sort employees by salary");
            System.out.println("6. Exit");
            System.out.println(BOTTOM);
            switch (Validator.getOption("Please select an option: ", 1, 6)) {
                case 1:
                    controller.add();
                    break;
                case 2:
                    controller.update();
                    break;
                case 3:
                    controller.remove();
                    break;
                case 4:
                    controller.search();
                    break;
                case 5:
                    controller.sortBySalary();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''

# The marker's keystrokes. RUN 0 walks the four empty-list edges first, then the
# brief's own three employees (with a duplicate Id rejected on the way in), the
# brief's own search and sort screens, an update, and a delete of something that
# has already been deleted.
P0085_RUN0_IN = (
    '4\n'                       # search, empty
    '5\n'                       # sort, empty
    '2\n'                       # update, empty
    '3\n'                       # remove, empty
    '1\nE001\nJohn\nSmith\n0901234567\njohn.smith@example.com\n'
    '12 Le Loi, Da Nang\n1994-05-20\nMale\n1500\nSales\n'
    '1\nE002\nBob\nTran\n09xx\n0912345678\nbob\nbob.tran@example.com\n'
    '7 Tran Phu, Hue\n1994-13-40\n1990-01-02\nboy\nMale\n-5\n1800\nIT\n'
    '1\nE001\nE003\nAnna\nLee\n0987654321\nanna.lee@example.com\n'
    '3 Nguyen Hue, Ha Noi\n1998-11-09\nFemale\n1200\nHR\n'
    '4\nsm\n'                   # the brief's own search screen
    '4\nzz\n'                   # nothing matches
    '5\n'                       # the brief's own sorted screen
    '2\nE009\n'                 # update something that is not there
    '2\nE002\n\n\n\n\n\n\n\n2000\n\n'   # update: blank keeps everything but the salary
    '5\n'                       # the order has changed
    '3\nE003\n'                 # remove
    '3\nE003\n'                 # remove it again
    '9\n6\n'                    # an option that does not exist, then Exit
)

P0085_RUN1_IN = (
    '4\n'
    '2\n'
    '6\n'
)


P0085_RUN0_OUT = '''========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Search employees --
=> The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: => The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Update employee --
=> The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Remove employee --
=> The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Add employee --
Id         : First name : Last name  : Phone      : Email      : Address    : DOB        : Sex        : Salary     : Agency     : => Employee E001 added successfully.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Add employee --
Id         : First name : Last name  : Phone      : Phone must contain digits only.
Phone      : Email      : Email must look like name@domain.com.
Email      : Address    : DOB        : DOB must be a real date in yyyy-MM-dd format.
DOB        : Sex        : Sex must be Male or Female.
Sex        : Salary     : Salary must be greater than 0.
Salary     : Agency     : => Employee E002 added successfully.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Add employee --
Id         : => Employee id E001 already exists.
Id         : First name : Last name  : Phone      : Email      : Address    : DOB        : Sex        : Salary     : Agency     : => Employee E003 added successfully.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Search employees --
Enter name (or part): Id     First name  Last name     Salary  Agency
-----------------------------------------------
E001   John        Smith        1500.00  Sales
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Search employees --
Enter name (or part): => No employee matches "zz".
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: Employees sorted by salary (ascending):
Id     Name                Salary  Agency
-----------------------------------------
E003   Anna Lee           1200.00  HR
E001   John Smith         1500.00  Sales
E002   Bob Tran           1800.00  IT
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Update employee --
Id         : => No employee found with id E009.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Update employee --
Id         : Press Enter to keep the value in brackets.
First name : [Bob] Last name  : [Tran] Phone      : [0912345678] Email      : [bob.tran@example.com] Address    : [7 Tran Phu, Hue] DOB        : [1990-01-02] Sex        : [Male] Salary     : [1800.00] Agency     : [IT] => Employee E002 updated successfully.
   Employee{id=E002, name=Bob Tran, phone=0912345678, email=bob.tran@example.com, address=7 Tran Phu, Hue, dob=1990-01-02, sex=Male, salary=2000.00, agency=IT}
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: Employees sorted by salary (ascending):
Id     Name                Salary  Agency
-----------------------------------------
E003   Anna Lee           1200.00  HR
E001   John Smith         1500.00  Sales
E002   Bob Tran           2000.00  IT
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Remove employee --
Id         : => Employee E003 removed successfully.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Remove employee --
Id         : => No employee found with id E003.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: Please choose from 1 to 6.
Please select an option: Goodbye.'''

P0085_RUN1_OUT = '''========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Search employees --
=> The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: -- Update employee --
=> The employee list is empty.
========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option: Goodbye.'''


solution(
    'J1.S.P0085',
    title_vi='Hệ thống quản lý nhân viên',
    files=[('src/entity/Employee.java', P0085_EMPLOYEE),
           ('src/bo/EmployeeManager.java', P0085_BO),
           ('src/controller/EmployeeController.java', P0085_CONTROLLER),
           ('src/utils/Validator.java', P0085_VALIDATOR),
           ('src/ui/Main.java', P0085_MAIN)],
    main_class='ui.Main',
    runs=[(P0085_RUN0_IN, P0085_RUN0_OUT), (P0085_RUN1_IN, P0085_RUN1_OUT)],
    explain_en='''<p><strong>What is actually being marked.</strong> Not "can you print a list" - every
submission can. A CRUD program is marked on its four edges: adding a key that is already there, updating
something that is not there, deleting something that is not there, and doing any of it to an empty list.
All four are handled deliberately here, and all four are exercised in the verified runs. The happy path
is the part you get for free.</p>
<p><strong>Five files, and the layer this program does and does not need.</strong> Counted across real
submissions that passed, a project this size carries <code>entity</code>, <code>bo</code> and
<code>ui</code> and no <code>controller</code>; controllers show up at seven files and above. This one
has a controller anyway, and the reason is Update: it is ten prompts that each have to remember an old
value, and Add is another nine. Put those in <code>Main</code> and the class that draws the menu also
knows that Sex is asked before Salary. The test to apply is whether the layer earns its keep - here
<code>ui.Main</code> is a menu where every case is one line, and that is what a reviewer should be able
to see at a glance. There is no <code>dao</code>, no <code>service</code>, no interface with a single
implementation, because nothing in the brief asks for one.</p>
<p><strong>The one design decision worth the whole exercise: <code>Validator.ask()</code>.</strong> Every
field in this program follows the same shape - print a label, read a line, complain, repeat - and they
differ only in the rule. So the loop is written once and the rule is passed in. The payoff is Update: a
blank line keeping the current value is a property of that single loop (<code>current != null</code>),
not nine copies of an <code>if</code> in the controller. Add passes <code>null</code>, Update passes the
old value, and one method serves both screens. The alternative is eighteen prompt blocks, and the day
the phone rule changes you fix nine of them.</p>
<p><strong><code>id</code> is final and has no setter; the other nine fields have both.</strong> That
asymmetry is the point. <code>EmployeeManager</code> guarantees that no two employees share an Id, and a
guarantee that any caller can break with <code>setId()</code> is not a guarantee. Update changes what a
person IS; it must never change which record they ARE. Expect to be asked why the entity is not
uniformly mutable - this is the answer.</p>
<p><strong>The duplicate Id is caught the instant it is typed, and the rule still lives in the business
layer.</strong> The controller loops on <code>manager.requireNewId(id)</code> and prints the exception
message, so the user is told at once instead of after nine more questions - and <code>add()</code> calls
the same method again before the record goes in. One rule, one wording, two call sites, and no way for a
future caller to slip a duplicate through by forgetting to ask. That is what "bo throws, ui prints" is
for; if the check had been written as an <code>if</code> in the controller, the manager would be
enforcing nothing.</p>
<p><strong>DOB is a <code>LocalDate</code>, and the reason is a bug you will not see coming.</strong> The
obvious implementation, <code>new SimpleDateFormat("yyyy-MM-dd").parse(text)</code>, <em>accepts</em>
<code>2024-02-31</code> and quietly hands back the 2nd of March, because the old formatter is lenient
until you remember <code>setLenient(false)</code>. <code>LocalDate.parse</code> throws. Storing the field
as a <code>String</code> is worse still: it lets <code>1994-13-40</code> into the list and fails much
later, a long way from the person who typed it. The scripted run types <code>1994-13-40</code> for
exactly this reason.</p>
<p><strong>Sort returns a sorted COPY.</strong> The Guidelines name the comparator and it is used exactly
as written, <code>Comparator.comparingDouble(Employee::getSalary)</code>. What they do not say is whether
the stored list should be reordered - and it is not. Sorting the master list destroys the order the
records were entered in, which is the only order the program can never reconstruct. "Show me the list
sorted" is a question, not an edit. Ask a marker to sort twice and then add someone: with an in-place
sort, the new record appears in a list that is silently no longer in entry order.</p>
<p><strong>The brief's two tables have different column widths, and both are reproduced exactly.</strong>
Search is <code>Id</code>(7) <code>First name</code>(12) <code>Last name</code>(11) <code>Salary</code>
right-aligned in 9, then two spaces and the agency - 47 characters, and the rule underneath is 47
dashes. Sort is 7, 19, right-aligned 7, two spaces - 41 characters, 41 dashes. They disagree with each
other because they show different columns, so both are kept as printed. All of it is
<code>printf</code> field widths, never tab characters: a tabbed table stays aligned exactly until one
name is longer than the tab stop, and then the whole column steps sideways.</p>
<p><strong>What the brief does NOT ask for, and why nothing is saved to disk.</strong> There is no data
file anywhere in this sheet - not in the Function details, not in the Guidelines, not in the class
diagram, which shows exactly two classes and a <code>List&lt;Employee&gt;</code> between them. So the
program keeps its records in memory and loses them on exit, and the second verified run proves precisely
that: a brand-new JVM in the same folder finds an empty list. That is the specified behaviour, not an
omission, and it is the right thing to say out loud rather than let an examiner wonder. If persistence
were added it would be one class behind the manager - <code>load()</code> at start-up,
<code>save()</code> after every change, never "save on exit", because the marker closes the window.</p>
<p><strong>How this was verified.</strong> Two scripted runs, compiled and executed, diffed character for
character. Run 1 opens on the four empty-list screens; adds the brief's own three employees; is refused a
duplicate <code>E001</code> and recovers; rejects <code>09xx</code> as a phone, <code>bob</code> as an
email, <code>1994-13-40</code> as a date, <code>boy</code> as a sex and <code>-5</code> as a salary;
reproduces the brief's search screen for "sm" and its sorted screen to the last digit (1200.00 / 1500.00
/ 1800.00); finds nothing for "zz"; updates a salary with eight blank lines and one number; deletes
<code>E003</code>, is told <code>E003</code> does not exist when it tries again; and is told to choose
from 1 to 6 when it types 9. Run 2 is the persistence statement above.</p>
<p><strong>Where the brief contradicts itself.</strong> Two places, both resolved in favour of the
Guidelines. (1) The expected-screen block has run together in the sheet - <code>6. Exit</code>, the row
of <code>=</code> and <code>Please select an option:</code> are printed on one line - which is a PDF
artefact, not a specification; they are printed on three lines here. (2) The class diagram gives
<code>EmployeeManager</code> a <code>display()</code> method, which would make the business layer write
to the screen. That is the one line of the diagram not followed: the manager returns lists and throws
messages, and every character that reaches the console is printed by the controller. Say so at the
defence - noticing it counts in your favour, and "the diagram is a sketch, the Guidelines are the
contract" is the correct reading.</p>''',
    explain_vi='''<p><strong>Bài này thực sự chấm cái gì.</strong> Không phải "in được danh sách không" -
bài nào cũng in được. Một chương trình CRUD bị chấm ở bốn cái biên: thêm một khoá đã tồn tại, sửa một
bản ghi không có, xoá một bản ghi không có, và làm tất cả những việc đó trên danh sách rỗng. Cả bốn
trường hợp đều được xử lý có chủ ý ở đây, và cả bốn đều được diễn lại trong các lần chạy đã kiểm chứng.
Phần "chạy trơn tru" là phần bạn được cho không.</p>
<p><strong>Năm tệp, và tầng mà chương trình này cần hay không cần.</strong> Đếm trên các bài nộp thật đã
qua môn, một project cỡ này có <code>entity</code>, <code>bo</code>, <code>ui</code> và KHÔNG có
<code>controller</code>; controller chỉ xuất hiện từ bảy tệp trở lên. Bài này vẫn có controller, và lý do
là chức năng Sửa: nó là mười câu hỏi mà mỗi câu phải nhớ một giá trị cũ, còn Thêm là chín câu nữa. Nhét
chúng vào <code>Main</code> thì lớp vẽ thực đơn cũng đồng thời biết rằng Giới tính được hỏi trước Lương.
Phép thử là tầng đó có xứng đáng hay không - ở đây <code>ui.Main</code> là một thực đơn mà mỗi nhánh
<code>case</code> chỉ một dòng, và người đọc phải thấy điều đó ngay từ cái nhìn đầu tiên. Không có
<code>dao</code>, không có <code>service</code>, không có interface chỉ một cài đặt, vì đề không đòi
thứ nào trong đó.</p>
<p><strong>Quyết định thiết kế đáng giá nhất cả bài: <code>Validator.ask()</code>.</strong> Mọi trường dữ
liệu trong chương trình đều cùng một hình dạng - in nhãn, đọc một dòng, càu nhàu, lặp lại - và chúng chỉ
khác nhau ở luật kiểm tra. Nên vòng lặp viết một lần, còn luật thì truyền vào. Phần thưởng nằm ở chức
năng Sửa: "bỏ trống thì giữ nguyên giá trị cũ" là tính chất của đúng cái vòng lặp đó
(<code>current != null</code>), chứ không phải chín bản sao của một câu <code>if</code> trong controller.
Thêm thì truyền <code>null</code>, Sửa thì truyền giá trị cũ, và một phương thức phục vụ cả hai màn hình.
Cách còn lại là mười tám khối hỏi đáp, và ngày luật số điện thoại đổi thì bạn sửa chín chỗ.</p>
<p><strong><code>id</code> là final và không có setter; chín trường còn lại có cả hai.</strong> Sự bất đối
xứng đó chính là điểm mấu chốt. <code>EmployeeManager</code> bảo đảm không có hai nhân viên trùng Id, mà
một bảo đảm có thể bị phá bởi bất kỳ ai gọi <code>setId()</code> thì không phải là bảo đảm. Sửa là thay
đổi con người ĐÓ LÀ AI, không bao giờ được đổi ĐÓ LÀ BẢN GHI NÀO. Chuẩn bị bị hỏi vì sao entity không
mutable đồng đều - đây là câu trả lời.</p>
<p><strong>Id trùng bị bắt ngay lúc gõ, mà luật vẫn nằm ở tầng nghiệp vụ.</strong> Controller lặp trên
<code>manager.requireNewId(id)</code> và in thông báo của ngoại lệ, nên người dùng được báo ngay thay vì
sau chín câu hỏi nữa - và <code>add()</code> vẫn gọi lại đúng phương thức đó trước khi bản ghi được đưa
vào. Một luật, một câu chữ, hai chỗ gọi, và không có đường nào cho người viết sau này lách qua bằng cách
quên kiểm tra. Đó chính là ý nghĩa của "bo ném, ui in"; nếu phép kiểm được viết thành một
<code>if</code> trong controller thì manager chẳng bảo đảm điều gì cả.</p>
<p><strong>DOB là <code>LocalDate</code>, và lý do là một lỗi bạn không nhìn thấy trước.</strong> Cách cài
đặt hiển nhiên, <code>new SimpleDateFormat("yyyy-MM-dd").parse(text)</code>, <em>chấp nhận</em>
<code>2024-02-31</code> và lặng lẽ trả về ngày 2 tháng 3, vì bộ định dạng cũ mặc định là "dễ dãi" cho tới
khi bạn nhớ gọi <code>setLenient(false)</code>. <code>LocalDate.parse</code> thì ném ngoại lệ. Lưu trường
này thành <code>String</code> còn tệ hơn: nó thả <code>1994-13-40</code> vào danh sách và chỉ vỡ ra rất
lâu sau đó, cách xa người đã gõ nó. Kịch bản chạy kiểm gõ <code>1994-13-40</code> đúng vì lý do này.</p>
<p><strong>Sắp xếp trả về một BẢN SAO đã sắp.</strong> Phần Hướng dẫn nêu đích danh comparator và nó được
dùng y nguyên: <code>Comparator.comparingDouble(Employee::getSalary)</code>. Cái đề không nói là danh
sách gốc có bị đảo thứ tự hay không - và ở đây thì không. Sắp xếp tại chỗ sẽ phá thứ tự nhập liệu, thứ
tự duy nhất mà chương trình không thể dựng lại được. "Cho tôi xem danh sách đã sắp" là một câu hỏi, không
phải một lệnh sửa. Bảo người chấm sắp hai lần rồi thêm một người: với sắp xếp tại chỗ, bản ghi mới rơi
vào một danh sách đã lặng lẽ không còn theo thứ tự nhập nữa.</p>
<p><strong>Hai cái bảng trong đề có độ rộng cột khác nhau, và cả hai đều được chép đúng.</strong> Bảng Tìm
kiếm là <code>Id</code>(7) <code>First name</code>(12) <code>Last name</code>(11) rồi
<code>Salary</code> canh phải trong 9, hai dấu cách, rồi Agency - tổng 47 ký tự, và gạch ngang bên dưới
đúng 47 dấu. Bảng Sắp xếp là 7, 19, canh phải 7, hai dấu cách - 41 ký tự, 41 dấu gạch. Chúng lệch nhau vì
hiển thị các cột khác nhau, nên cả hai đều giữ nguyên như đề in. Tất cả dùng độ rộng trường của
<code>printf</code>, tuyệt đối không dùng ký tự tab: bảng căn bằng tab thẳng hàng cho tới đúng lúc có một
cái tên dài hơn điểm dừng tab, rồi cả cột lệch sang bên.</p>
<p><strong>Cái đề KHÔNG yêu cầu, và vì sao chương trình không ghi gì xuống đĩa.</strong> Không có tệp dữ
liệu nào trong đề này - không trong phần Chi tiết chức năng, không trong Hướng dẫn, không trong sơ đồ
lớp (sơ đồ chỉ có đúng hai lớp và một <code>List&lt;Employee&gt;</code> nối chúng). Nên chương trình giữ
dữ liệu trong bộ nhớ và mất khi thoát, và lần chạy kiểm thứ hai chứng minh đúng điều đó: một JVM hoàn
toàn mới trong cùng thư mục thấy một danh sách rỗng. Đó là hành vi được đặc tả, không phải chỗ thiếu sót,
và nên nói thẳng ra thay vì để người chấm tự thắc mắc. Nếu phải thêm lưu trữ, nó là một lớp nằm sau
manager - <code>load()</code> lúc khởi động, <code>save()</code> sau mỗi thay đổi, tuyệt đối không phải
"lưu lúc thoát", vì người chấm sẽ tắt bằng nút đóng cửa sổ.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai kịch bản chạy, biên dịch và chạy thật, so từng ký tự. Lần
1 mở màn bằng bốn màn hình trên danh sách rỗng; thêm đúng ba nhân viên của đề; bị từ chối
<code>E001</code> trùng rồi gõ lại; bị bác <code>09xx</code> (điện thoại), <code>bob</code> (email),
<code>1994-13-40</code> (ngày), <code>boy</code> (giới tính) và <code>-5</code> (lương); tái hiện đúng
màn hình tìm "sm" và màn hình sắp xếp của đề tới chữ số cuối (1200.00 / 1500.00 / 1800.00); không tìm
thấy gì với "zz"; sửa lương bằng tám dòng trống và một con số; xoá <code>E003</code>, xoá lần nữa thì
được báo không tồn tại; và bị nhắc chọn từ 1 đến 6 khi gõ 9. Lần 2 chính là lời khẳng định về lưu trữ ở
trên.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Hai chỗ, đều xử theo phần Hướng dẫn. (1) Khối màn hình mẫu bị
dồn dòng trong đề - <code>6. Exit</code>, hàng dấu <code>=</code> và <code>Please select an
option:</code> nằm chung một dòng - đó là lỗi trích xuất PDF chứ không phải đặc tả; ở đây in thành ba
dòng. (2) Sơ đồ lớp gán cho <code>EmployeeManager</code> một phương thức <code>display()</code>, tức là
bắt tầng nghiệp vụ in ra màn hình. Đó là dòng duy nhất của sơ đồ không được làm theo: manager trả về danh
sách và ném thông báo, còn mọi ký tự ra màn hình đều do controller in. Hãy nói điều này khi bảo vệ - nhận
ra nó được tính điểm, và cách hiểu đúng là "sơ đồ chỉ là phác thảo, phần Hướng dẫn mới có hiệu lực".</p>''',
    hints_en=[
        'The marks are on the edges: duplicate Id, update/remove a missing Id, and every screen on an empty list.',
        'Write ONE prompt loop that takes the rule as a parameter; Update is then the same loop with a current value, and blank keeps it.',
        'Make id final with no setter - the uniqueness rule is only real if nothing can change a key.',
        'Parse DOB with LocalDate.parse: SimpleDateFormat is lenient and turns 2024-02-31 into 2 March.',
        'Sort a COPY with Comparator.comparingDouble(Employee::getSalary); reordering the stored list destroys the entry order for good.',
        'Lay both tables out with printf field widths (7/12/11/9 and 7/19/7) - the brief uses different widths for each, and tabs collapse the moment a name is long.',
    ],
    hints_vi=[
        'Điểm nằm ở các biên: Id trùng, sửa/xoá Id không tồn tại, và mọi màn hình khi danh sách rỗng.',
        'Viết MỘT vòng lặp hỏi - đáp nhận luật kiểm tra làm tham số; chức năng Sửa chính là vòng lặp đó có thêm giá trị hiện tại, bỏ trống thì giữ nguyên.',
        'Để id là final và không có setter - luật duy nhất chỉ có thật khi không gì sửa được khoá.',
        'Đọc DOB bằng LocalDate.parse: SimpleDateFormat dễ dãi và biến 2024-02-31 thành ngày 2 tháng 3.',
        'Sắp xếp trên BẢN SAO bằng Comparator.comparingDouble(Employee::getSalary); đảo danh sách gốc là mất vĩnh viễn thứ tự nhập.',
        'Căn cả hai bảng bằng độ rộng trường của printf (7/12/11/9 và 7/19/7) - đề dùng độ rộng khác nhau cho mỗi bảng, còn tab thì vỡ ngay khi có tên dài.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.L.P0015 — Asset Management, UPGRADE: the employee's program (200 LOC)
# ════════════════════════════════════════════════════════════════

P0015_PERSISTABLE = r'''package entity;

/**
 * Anything that is one line of a .dat file and can be found again by its id.
 *
 * The brief asks for interfaces, and this is the one the program actually needs:
 * it is what lets ONE generic store (bo.DataStore) read, write, search and
 * delete rows of four completely different files. Without it there would be four
 * copies of the same twenty lines of file handling, and the day one of them
 * learns to skip a blank line, the other three do not.
 */
public interface Persistable {

    /** The primary key: A001, E160001, R001, B001. */
    String getId();

    /** This record as the single line that will be written to the file. */
    String toDataLine();
}
'''

P0015_PERSON = r'''package entity;

/**
 * Everybody in employee.dat - the staff AND the manager, in one file, as the
 * brief describes it.
 *
 * employeeID is final: "employeeID cannot change after created" is a Function 0
 * requirement, and the only way to enforce it is to give the outside world no
 * setter to call. A comment saying "do not change this" is not enforcement.
 *
 * The role column is NOT stored as a field. It is asked of the object -
 * getRole() - so the subclass decides it, which means the file can never
 * disagree with the type: a Manager cannot be written out with role EM. That is
 * the polymorphism Function 0 asks for, doing real work rather than being
 * demonstrated in a comment.
 */
public abstract class Person implements Persistable {

    private final String employeeID;
    private String name;
    private String birthdate;
    private String sex;
    private String password;

    protected Person(String employeeID, String name, String birthdate,
            String sex, String password) {
        this.employeeID = employeeID;
        this.name = name;
        this.birthdate = birthdate;
        this.sex = sex;
        this.password = password;
    }

    /** The two-letter code stored in the file: EM or MA. */
    public abstract String getRole();

    /** What this person is called on screen. */
    public abstract String getTitle();

    /**
     * May this person borrow company assets?
     *
     * This is the question the three protected menu items ask. Written as a
     * method on Person it is answered by the object; written as
     * `if (person.getRole().equals("EM"))` in the controller it would have to be
     * repeated at every guard, and a third role would mean hunting them down.
     */
    public abstract boolean canBorrow();

    public String getEmployeeID() {
        return employeeID;
    }

    @Override
    public String getId() {
        return employeeID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    /** The MD5 hash as stored in the file - never the password itself. */
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toDataLine() {
        return String.join(", ", employeeID, name, birthdate, getRole(), sex, password);
    }

    @Override
    public String toString() {
        return String.format("%s %s (%s)", getTitle(), name, employeeID);
    }
}
'''

P0015_EMPLOYEE = r'''package entity;

/** Role EM: an ordinary member of staff, and the user this program is for. */
public class Employee extends Person {

    public static final String ROLE = "EM";

    public Employee(String employeeID, String name, String birthdate,
            String sex, String password) {
        super(employeeID, name, birthdate, sex, password);
    }

    @Override
    public String getRole() {
        return ROLE;
    }

    @Override
    public String getTitle() {
        return "Employee";
    }

    @Override
    public boolean canBorrow() {
        return true;
    }
}
'''

P0015_MANAGER = r'''package entity;

/**
 * Role MA. He is in the same file and can log in here, but the borrowing menu
 * is not his: he approves requests in the manager's program (J1.L.P0014), and
 * an approval he granted to himself would be no approval at all.
 */
public class Manager extends Person {

    public static final String ROLE = "MA";

    public Manager(String employeeID, String name, String birthdate,
            String sex, String password) {
        super(employeeID, name, birthdate, sex, password);
    }

    @Override
    public String getRole() {
        return ROLE;
    }

    @Override
    public String getTitle() {
        return "Manager";
    }

    @Override
    public boolean canBorrow() {
        return false;
    }
}
'''

P0015_ASSET = r'''package entity;

/**
 * One row of asset.dat.
 *
 * assetID is final for the same reason employeeID is: Function 0 says it cannot
 * change after creation, and request.dat and borrow.dat both point at it. A key
 * that can be edited is a key that can be edited out from under four other rows.
 *
 * quantity is the ONLY field this program writes. Everything else about an asset
 * belongs to the manager's program; here, returning something puts it back on
 * the shelf and that is all.
 */
public class Asset implements Persistable {

    private final String assetID;
    private String name;
    private String color;
    private double price;
    private double weight;
    private int quantity;

    public Asset(String assetID, String name, String color, double price,
            double weight, int quantity) {
        this.assetID = assetID;
        this.name = name;
        this.color = color;
        this.price = price;
        this.weight = weight;
        this.quantity = quantity;
    }

    public String getAssetID() {
        return assetID;
    }

    @Override
    public String getId() {
        return assetID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    @Override
    public String toDataLine() {
        return String.join(", ", assetID, name, color,
                String.valueOf(price), String.valueOf(weight), String.valueOf(quantity));
    }

    @Override
    public String toString() {
        return assetID + " - " + name;
    }
}
'''

P0015_TRANSACTION = r'''package entity;

import java.time.format.DateTimeFormatter;

/**
 * A request and a borrow are the same five columns: an id, an asset, an
 * employee, how many, and when. So they are one abstract class, and the two
 * concrete classes exist to say which file they belong to and what to call them
 * on screen.
 *
 * That is what makes the Cancel and Return screens the same code: both are
 * "show my Transactions, pick an id, confirm, delete" - written once, over
 * List<? extends Transaction>. Two independent classes with identical
 * fields would have needed that screen twice.
 */
public abstract class Transaction implements Persistable {

    /** The exact shape the brief's own sample rows use: 23-12-2021 13:17:56. */
    public static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    private final String id;
    private final String assetID;
    private final String employeeID;
    private int quantity;
    private String dateTime;

    protected Transaction(String id, String assetID, String employeeID,
            int quantity, String dateTime) {
        this.id = id;
        this.assetID = assetID;
        this.employeeID = employeeID;
        this.quantity = quantity;
        this.dateTime = dateTime;
    }

    /** "Request" or "Borrow" - the word the screens print. */
    public abstract String getKind();

    @Override
    public String getId() {
        return id;
    }

    public String getAssetID() {
        return assetID;
    }

    public String getEmployeeID() {
        return employeeID;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Kept as the text the file holds, not as a LocalDateTime.
     *
     * The program never does date arithmetic on it: it writes it once, reads it
     * back, and prints it. Parsing and re-formatting on every load would be two
     * extra chances to change somebody else's data - and the manager's program
     * reads the same four files.
     */
    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    @Override
    public String toDataLine() {
        return String.join(", ", id, assetID, employeeID,
                String.valueOf(quantity), dateTime);
    }

    @Override
    public String toString() {
        return getKind() + " " + id + " (" + quantity + " x " + assetID + ")";
    }
}
'''

P0015_REQUEST = r'''package entity;

/** One row of request.dat: an asset an employee has asked for, not yet approved. */
public class Request extends Transaction {

    public static final String PREFIX = "R";

    public Request(String rID, String assetID, String employeeID,
            int quantity, String requestDateTime) {
        super(rID, assetID, employeeID, quantity, requestDateTime);
    }

    @Override
    public String getKind() {
        return "Request";
    }
}
'''

P0015_BORROW = r'''package entity;

/** One row of borrow.dat: an asset the employee is actually holding. */
public class Borrow extends Transaction {

    public static final String PREFIX = "B";

    public Borrow(String bID, String assetID, String employeeID,
            int quantity, String borrowDateTime) {
        super(bID, assetID, employeeID, quantity, borrowDateTime);
    }

    @Override
    public String getKind() {
        return "Borrow";
    }
}
'''

P0015_DATASTORE = r'''package bo;

import entity.Persistable;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * The whole of the file handling, written once for four files.
 *
 * A subclass supplies two things: the file name, and how to turn a row of text
 * into an object. Everything else - reading, writing, finding by id, working out
 * the next id - is identical for assets, people, requests and borrows, and it is
 * here exactly once. That is what the Persistable interface buys.
 *
 * Two rules this class enforces on behalf of every caller:
 *
 * 1. A MISSING FILE IS NOT AN ERROR. The first run of a fresh checkout has no
 *    .dat files at all; load() leaves the list empty and says nothing. Throwing
 *    here would make the program unable to start until somebody hand-wrote four
 *    files.
 * 2. EVERY CHANGE IS WRITTEN IMMEDIATELY. add() and remove() save. The
 *    alternative - "save on exit" - loses everything if the program is closed
 *    with the window button, and the marker WILL close it with the window
 *    button.
 */
public abstract class DataStore<T extends Persistable> {

    private final String fileName;
    private final List<T> items = new ArrayList<>();

    protected DataStore(String fileName) {
        this.fileName = fileName;
    }

    /** Build one object from one already-trimmed row. */
    protected abstract T parse(String[] parts);

    public final void load() throws Exception {
        items.clear();
        File file = new File(fileName);
        if (!file.exists()) {
            return;
        }
        try (BufferedReader in = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = in.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                String[] parts = line.split(",");
                for (int i = 0; i < parts.length; i++) {
                    parts[i] = parts[i].trim();
                }
                items.add(parse(parts));
            }
        }
    }

    public final void save() throws Exception {
        try (PrintWriter out = new PrintWriter(new FileWriter(fileName))) {
            for (T item : items) {
                out.println(item.toDataLine());
            }
        }
    }

    public List<T> getAll() {
        return items;
    }

    public T findById(String id) {
        for (T item : items) {
            if (item.getId().equalsIgnoreCase(id)) {
                return item;
            }
        }
        return null;
    }

    public void add(T item) throws Exception {
        items.add(item);
        save();
    }

    public void remove(T item) throws Exception {
        items.remove(item);
        save();
    }

    /**
     * The next free id: the HIGHEST number in the file plus one, not size + 1.
     *
     * The brief's own request.dat is R001, R002, R003, R007 - four rows whose
     * largest number is 7. size + 1 would hand out R005, and once a row is
     * deleted it would start handing out ids that already exist.
     */
    public String nextId(String prefix) {
        int max = 0;
        for (T item : items) {
            try {
                max = Math.max(max, Integer.parseInt(item.getId().substring(prefix.length())));
            } catch (RuntimeException ignored) {
                // An id that is not prefix + digits contributes nothing; it must
                // not stop the program from issuing the next one.
            }
        }
        return String.format("%s%03d", prefix, max + 1);
    }
}
'''

P0015_ASSETSTORE = r'''package bo;

import entity.Asset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/** asset.dat, plus the two questions this program asks of it. */
public class AssetStore extends DataStore<Asset> {

    public AssetStore() {
        super("asset.dat");
    }

    @Override
    protected Asset parse(String[] parts) {
        return new Asset(parts[0], parts[1], parts[2],
                Double.parseDouble(parts[3]), Double.parseDouble(parts[4]),
                Integer.parseInt(parts[5]));
    }

    /**
     * Case-insensitive "contains", newest-first by price.
     *
     * The brief says the result list is shown "descending" without saying by
     * what. Price is the only field on which "descending" is a natural reading
     * for a catalogue, so that is the order used - and it is said out loud here
     * rather than left for the examiner to guess.
     */
    public List<Asset> searchByName(String keyword) {
        String needle = keyword.toLowerCase();
        List<Asset> found = new ArrayList<>();
        for (Asset asset : getAll()) {
            if (asset.getName().toLowerCase().contains(needle)) {
                found.add(asset);
            }
        }
        found.sort(Comparator.comparingDouble(Asset::getPrice).reversed());
        return found;
    }

    /** Putting stock back on the shelf - the only write this program makes here. */
    public void giveBack(Asset asset, int quantity) throws Exception {
        asset.setQuantity(asset.getQuantity() + quantity);
        save();
    }
}
'''

P0015_EMPLOYEESTORE = r'''package bo;

import entity.Employee;
import entity.Manager;
import entity.Person;
import utils.Md5;

/** employee.dat: everybody who can log in, staff and manager alike. */
public class EmployeeStore extends DataStore<Person> {

    public EmployeeStore() {
        super("employee.dat");
    }

    /**
     * The role COLUMN decides the CLASS.
     *
     * This one line is where the file becomes an object graph: after it, nothing
     * in the program ever compares a role string again - it asks the object
     * whether it canBorrow(). Adding an "Admin" role later is a new subclass and
     * one more branch here, and no change at all to the four screens.
     */
    @Override
    protected Person parse(String[] parts) {
        String employeeID = parts[0];
        String name = parts[1];
        String birthdate = parts[2];
        String role = parts[3];
        String sex = parts[4];
        String password = parts[5];
        if (Manager.ROLE.equalsIgnoreCase(role)) {
            return new Manager(employeeID, name, birthdate, sex, password);
        }
        return new Employee(employeeID, name, birthdate, sex, password);
    }

    /**
     * Returns the person, or null. Null covers BOTH "no such id" and "wrong
     * password" on purpose: telling the user which one they got wrong tells an
     * attacker which employee ids exist. The brief's single message,
     * "Incorrect id or password", is not vagueness - it is the correct answer.
     */
    public Person login(String employeeID, String password) {
        Person person = findById(employeeID);
        if (person == null) {
            return null;
        }
        return person.getPassword().equalsIgnoreCase(Md5.hash(password)) ? person : null;
    }
}
'''

P0015_REQUESTSTORE = r'''package bo;

import entity.Request;
import java.util.ArrayList;
import java.util.List;

/** request.dat: what has been asked for and is waiting for the manager. */
public class RequestStore extends DataStore<Request> {

    public RequestStore() {
        super("request.dat");
    }

    @Override
    protected Request parse(String[] parts) {
        return new Request(parts[0], parts[1], parts[2],
                Integer.parseInt(parts[3]), parts[4]);
    }

    /** Only this employee's rows: the screen must never show anyone else's. */
    public List<Request> byEmployee(String employeeID) {
        List<Request> mine = new ArrayList<>();
        for (Request request : getAll()) {
            if (request.getEmployeeID().equalsIgnoreCase(employeeID)) {
                mine.add(request);
            }
        }
        return mine;
    }
}
'''

P0015_BORROWSTORE = r'''package bo;

import entity.Borrow;
import java.util.ArrayList;
import java.util.List;

/** borrow.dat: what the company has actually handed out. */
public class BorrowStore extends DataStore<Borrow> {

    public BorrowStore() {
        super("borrow.dat");
    }

    @Override
    protected Borrow parse(String[] parts) {
        return new Borrow(parts[0], parts[1], parts[2],
                Integer.parseInt(parts[3]), parts[4]);
    }

    public List<Borrow> byEmployee(String employeeID) {
        List<Borrow> mine = new ArrayList<>();
        for (Borrow borrow : getAll()) {
            if (borrow.getEmployeeID().equalsIgnoreCase(employeeID)) {
                mine.add(borrow);
            }
        }
        return mine;
    }
}
'''

P0015_MD5 = r'''package utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * The hash the brief's own employee.dat uses.
 *
 * Every password column in the sample data is e10adc3949ba59abbe56e057f20f883e,
 * which is MD5("123456"). So login cannot compare passwords directly: it hashes
 * what was typed and compares the hashes. Hashing the input rather than
 * un-hashing the file is the whole idea - there is no un-hashing.
 *
 * (MD5 is long dead for real password storage. It is used here because it is
 * what the sample data contains, and that is worth saying at the defence.)
 */
public class Md5 {

    private Md5() {
    }

    public static String hash(String text) {
        try {
            byte[] digest = MessageDigest.getInstance("MD5")
                    .digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            // Every JVM is required to ship MD5; if this ever fires, the machine
            // is broken, not the program.
            throw new IllegalStateException("MD5 is unavailable on this JVM.", e);
        }
    }
}
'''

P0015_SAMPLEDATA = r'''package utils;

import java.io.File;
import java.io.PrintWriter;

/**
 * Lays down the brief's own four tables the first time the program runs, and
 * does NOTHING if a file is already there.
 *
 * Why this class exists: a marker unzips the project and presses Run. If the
 * .dat files are not in the zip - and they are working files, so they usually
 * are not - every screen is empty and the submission looks broken. Why it checks
 * first: after the first run these files are the user's DATA. Rewriting them on
 * every start would silently undo every borrow and every cancellation, which is
 * a far worse bug than the one it was meant to fix.
 *
 * It is one class and one call in main(). Delete both and the program behaves
 * exactly the same on any machine that already has the files.
 */
public class SampleData {

    private SampleData() {
    }

    private static final String[] ASSETS = {
        "A001, Samsung projector, White, 500.0, 3.2, 10",
        "A002, Macbook pro 2016, Sliver, 1000.0, 2.2, 5",
    };

    private static final String[] EMPLOYEES = {
        "E160001, Nguyen Hong Hiep, 12/06/2000, EM, male, e10adc3949ba59abbe56e057f20f883e",
        "E160240, Tran Dinh Khanh, 15/07/2002, EM, male, e10adc3949ba59abbe56e057f20f883e",
        "E140449, Le Buu Nhan, 10/07/2002, EM, male, e10adc3949ba59abbe56e057f20f883e",
        "E160798, Truong Le Minh, 03/12/2002, EM, male, e10adc3949ba59abbe56e057f20f883e",
        "E160052, Hoa Doan, 05/06/1990, MA, male, e10adc3949ba59abbe56e057f20f883e",
    };

    private static final String[] REQUESTS = {
        "R001, A001, E140449, 1, 23-12-2021 13:17:56",
        "R002, A002, E160001, 1, 24-12-2021 12:18:56",
        "R003, A001, E160798, 1, 23-12-2021 11:19:56",
        "R007, A002, E160240, 1, 24-12-2021 10:10:56",
    };

    private static final String[] BORROWS = {
        "B001, A001, E160001, 1, 23-12-2021 15:13:46",
        "B002, A001, E160001, 2, 25-12-2021 16:14:56",
        "B003, A002, E160798, 3, 15-12-2021 17:15:52",
        "B007, A001, E160240, 2, 26-12-2021 12:16:53",
    };

    public static void createIfMissing() throws Exception {
        write("asset.dat", ASSETS);
        write("employee.dat", EMPLOYEES);
        write("request.dat", REQUESTS);
        write("borrow.dat", BORROWS);
    }

    private static void write(String fileName, String[] lines) throws Exception {
        File file = new File(fileName);
        if (file.exists()) {
            return;
        }
        try (PrintWriter out = new PrintWriter(file)) {
            for (String line : lines) {
                out.println(line);
            }
        }
    }
}
'''

P0015_VALIDATOR = r'''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program. One static Scanner, private constructor,
 * all methods static - a second Scanner over System.in buffers ahead and eats
 * lines the first one still needed, and closing this one closes System.in.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getText(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("This field is required.");
        }
    }

    /** Ids are upper case in every file, so they are upper case when typed too. */
    public static String getId(String message) {
        return getText(message).toUpperCase();
    }

    public static int getPositiveInt(String message) {
        while (true) {
            String line = getText(message);
            try {
                int value = Integer.parseInt(line);
                if (value > 0) {
                    return value;
                }
                System.out.println("The quantity must be greater than 0.");
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /**
     * The Y/N question, asked the same way everywhere.
     *
     * It keeps asking until it gets a yes or a no. Treating anything that is not
     * "Y" as "no" is tempting and wrong: a typo would silently cancel the
     * confirmation of a delete, which is the one place a program must be sure.
     */
    public static boolean confirm(String message) {
        while (true) {
            String line = getText(message);
            if (line.equalsIgnoreCase("Y")) {
                return true;
            }
            if (line.equalsIgnoreCase("N")) {
                return false;
            }
            System.out.println("Please answer Y or N.");
        }
    }

    /** The menu: anything that is not an option is an option (Others- Quit). */
    public static String getChoice(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }
}
'''

P0015_CONTROLLER = r'''package controller;

import bo.AssetStore;
import bo.BorrowStore;
import bo.EmployeeStore;
import bo.RequestStore;
import entity.Asset;
import entity.Borrow;
import entity.Person;
import entity.Request;
import entity.Transaction;
import java.time.LocalDateTime;
import java.util.List;
import utils.Validator;

/**
 * One method per menu item: ask, call the stores, report.
 *
 * The four stores are held here rather than in Main because they belong
 * together: returning an asset touches TWO of them, and the order that happens
 * in is a decision this class is responsible for.
 *
 * currentUser is the session. It is null until Login succeeds, and every guarded
 * screen starts by asking for it - the brief says three of the five functions
 * require a login, and a guard that is written once cannot be forgotten on the
 * fourth screen.
 */
public class EmployeeController {

    private static final String ASSET_ROW = "%-7s%-22s%-8s%9s%8s%6s%n";
    private static final String TX_ROW = "%-7s%-7s%-22s%5s  %s%n";
    private static final String LINE = "------------------------------------------------------------";

    private final AssetStore assets = new AssetStore();
    private final EmployeeStore employees = new EmployeeStore();
    private final RequestStore requests = new RequestStore();
    private final BorrowStore borrows = new BorrowStore();

    private Person currentUser;

    /** Read all four files once, at startup. */
    public void start() throws Exception {
        assets.load();
        employees.load();
        requests.load();
        borrows.load();
    }

    public void login() {
        System.out.println("-- Login --");
        String employeeID = Validator.getId("Employee ID: ");
        String password = Validator.getText("Password   : ");
        Person person = employees.login(employeeID, password);
        if (person == null) {
            System.out.println("Incorrect id or password");
            return;
        }
        currentUser = person;
        System.out.println("Successfully");
        System.out.println("=> Welcome, " + person.getName() + " (" + person.getTitle() + ").");
    }

    /** Function 2 needs no login: a catalogue is not a secret. */
    public void searchAsset() {
        System.out.println("-- Search asset by name --");
        String keyword = Validator.getText("Enter asset name (or part): ");
        List<Asset> found = assets.searchByName(keyword);
        if (found.isEmpty()) {
            System.out.println("=> No asset matches \"" + keyword + "\".");
            return;
        }
        showAssets(found);
    }

    public void borrowAssets() throws Exception {
        System.out.println("-- Borrow the assets --");
        if (!canBorrow()) {
            return;
        }
        do {
            showAssets(assets.getAll());
            String assetID = Validator.getId("Enter assetID: ");
            Asset asset = assets.findById(assetID);
            if (asset == null) {
                System.out.println("=> Asset " + assetID + " does not exist.");
            } else {
                int quantity = Validator.getPositiveInt("Enter quantity: ");
                if (quantity > asset.getQuantity()) {
                    System.out.println("=> Only " + asset.getQuantity() + " of "
                            + asset.getName() + " left in stock.");
                } else {
                    Request request = new Request(requests.nextId("R"), asset.getAssetID(),
                            currentUser.getEmployeeID(), quantity, stamp());
                    requests.add(request);
                    System.out.println("=> Request " + request.getId() + " created for "
                            + quantity + " x " + asset.getName() + ".");
                }
            }
        } while (Validator.confirm("Do you want to continue (Y/N)? "));
    }

    public void cancelRequest() throws Exception {
        System.out.println("-- Cancel request --");
        if (!canBorrow()) {
            return;
        }
        do {
            List<Request> mine = requests.byEmployee(currentUser.getEmployeeID());
            if (mine.isEmpty()) {
                System.out.println("=> You have no request.");
                return;
            }
            showTransactions(mine, "Requested at");
            String rID = Validator.getId("Enter request ID: ");

            // Looked up in MY list, never in the whole file. Searching the file
            // and then checking the owner would be one `if` away from letting an
            // employee cancel somebody else's request.
            Request request = pick(mine, rID);
            if (request == null) {
                System.out.println("=> You have no request with id " + rID + ".");
            } else if (!Validator.confirm("Cancel request " + rID + " (Y/N)? ")) {
                System.out.println("=> Nothing was cancelled.");
            } else {
                requests.remove(request);
                System.out.println("=> Request " + rID + " cancelled.");
            }
        } while (Validator.confirm("Do you want to continue (Y/N)? "));
    }

    public void returnAsset() throws Exception {
        System.out.println("-- Return asset --");
        if (!canBorrow()) {
            return;
        }
        do {
            List<Borrow> mine = borrows.byEmployee(currentUser.getEmployeeID());
            if (mine.isEmpty()) {
                System.out.println("=> You have no borrowed asset.");
                return;
            }
            showTransactions(mine, "Borrowed at");
            String bID = Validator.getId("Enter borrow ID: ");
            Borrow borrow = pick(mine, bID);
            if (borrow == null) {
                System.out.println("=> You have no borrowed asset with id " + bID + ".");
            } else if (!Validator.confirm("Return borrow " + bID + " (Y/N)? ")) {
                System.out.println("=> Nothing was returned.");
            } else {
                // TWO files change here and there is no transaction to wrap them
                // in, so the ORDER is a decision. The borrow row goes first: if
                // the machine dies between the two writes, the company has lost
                // count of one item, which is recoverable. The other order leaves
                // a borrow that has already been credited to stock - and it can
                // be returned again, and again, inventing an asset each time.
                Asset asset = assets.findById(borrow.getAssetID());
                borrows.remove(borrow);
                if (asset == null) {
                    System.out.println("=> Borrow " + bID
                            + " returned, but asset " + borrow.getAssetID()
                            + " is no longer in the catalogue.");
                } else {
                    assets.giveBack(asset, borrow.getQuantity());
                    System.out.println("=> Borrow " + bID + " returned. "
                            + asset.getName() + " stock is now " + asset.getQuantity() + ".");
                }
            }
        } while (Validator.confirm("Do you want to continue (Y/N)? "));
    }

    /** The login guard and the role guard, in one place, for three screens. */
    private boolean canBorrow() {
        if (currentUser == null) {
            System.out.println("=> You must login first.");
            return false;
        }
        if (!currentUser.canBorrow()) {
            System.out.println("=> A " + currentUser.getTitle().toLowerCase()
                    + " cannot borrow assets. Please use the manager's program.");
            return false;
        }
        return true;
    }

    private static <T extends Transaction> T pick(List<T> mine, String id) {
        for (T item : mine) {
            if (item.getId().equalsIgnoreCase(id)) {
                return item;
            }
        }
        return null;
    }

    private static String stamp() {
        return LocalDateTime.now().format(Transaction.STAMP);
    }

    private void showAssets(List<Asset> list) {
        System.out.printf(ASSET_ROW, "Id", "Name", "Color", "Price", "Weight", "Qty");
        System.out.println(LINE);
        for (Asset asset : list) {
            System.out.printf(ASSET_ROW, asset.getAssetID(), asset.getName(), asset.getColor(),
                    String.format("%.2f", asset.getPrice()),
                    String.format("%.2f", asset.getWeight()),
                    String.valueOf(asset.getQuantity()));
        }
        System.out.println(LINE);
    }

    /**
     * One table for requests and for borrows.
     *
     * The rows arrive as Transaction, so this method cannot tell which file they
     * came from and does not need to - only the last column's heading differs.
     * That is the payoff for making Request and Borrow subclasses instead of two
     * unrelated classes with the same five fields.
     */
    private void showTransactions(List<? extends Transaction> list, String whenHeading) {
        System.out.printf(TX_ROW, "Id", "Asset", "Asset name", "Qty", whenHeading);
        System.out.println(LINE);
        for (Transaction item : list) {
            Asset asset = assets.findById(item.getAssetID());
            System.out.printf(TX_ROW, item.getId(), item.getAssetID(),
                    asset == null ? "(deleted)" : asset.getName(),
                    String.valueOf(item.getQuantity()), item.getDateTime());
        }
        System.out.println(LINE);
    }
}
'''

P0015_MAIN = r'''package ui;

import controller.EmployeeController;
import utils.SampleData;
import utils.Validator;

/**
 * The employee's menu, and nothing else.
 *
 * The brief writes the last option as "Others- Quit", so the choice is read as
 * TEXT and anything that is not 1-5 ends the program. That is the contract as
 * written; a getInt(1, 6) loop would refuse to quit on "q" and would be wrong.
 */
public class Main {

    private static final String TOP = "========== BMLT ASSET - EMPLOYEE ==========";
    private static final String BOTTOM = "===========================================";

    public static void main(String[] args) throws Exception {
        SampleData.createIfMissing();
        EmployeeController controller = new EmployeeController();
        controller.start();

        while (true) {
            System.out.println(TOP);
            System.out.println("1. Login");
            System.out.println("2. Search asset by name");
            System.out.println("3. Borrow the assets");
            System.out.println("4. Cancel request");
            System.out.println("5. Return asset");
            System.out.println("Others- Quit");
            System.out.println(BOTTOM);
            String choice = Validator.getChoice("Please select an option: ");
            try {
                if ("1".equals(choice)) {
                    controller.login();
                } else if ("2".equals(choice)) {
                    controller.searchAsset();
                } else if ("3".equals(choice)) {
                    controller.borrowAssets();
                } else if ("4".equals(choice)) {
                    controller.cancelRequest();
                } else if ("5".equals(choice)) {
                    controller.returnAsset();
                } else {
                    System.out.println("Goodbye.");
                    return;
                }
            } catch (Exception e) {
                // A disk that refuses to be written must not take the session
                // down: report it and go back to the menu.
                System.out.println("=> " + e.getMessage());
            }
        }
    }
}
'''

P0015_RUN0_IN = (
    '3\n'                                   # borrow before logging in
    '1\nE160001\n000000\n'                  # wrong password
    '1\nE160001\n123456\n'                  # Nguyen Hong Hiep
    '2\npro\n'                              # both assets match, dearest first
    '2\nzzz\n'                              # nothing matches
    '3\nA099\nY\n'                          # no such asset, then continue
    'A002\n99\nY\n'                         # more than the shelf holds
    'A002\n2\nN\n'                          # R008 is created
    '4\nR001\n'                             # a request that belongs to E140449
    'Y\nR008\nN\n'                          # confirm NO: nothing happens
    'Y\nR002\nY\nN\n'                       # confirm YES: R002 goes
    '5\nB003\n'                             # somebody else's borrow
    'Y\nB001\nY\nN\n'                       # return 1 x A001: stock 10 -> 11
    '9\n'                                   # "Others- Quit"
)

P0015_RUN1_IN = (
    '2\nsamsung\n'                          # a NEW process: stock must read 11
    '1\nE160001\n123456\n'
    '4\nR008\nY\nN\n'                       # R008 survived the JVM; cancel it
    '4\n'                                   # now there are none left
    '5\nB002\nY\nN\n'                       # B001 is gone; return B002 (2 -> 13)
    '5\n'                                   # and now none
    '1\nE160052\n123456\n'                  # the manager, in the wrong program
    '3\n'
    '0\n'
)


P0015_RUN0_OUT = '''========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Borrow the assets --
=> You must login first.
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Login --
Employee ID: Password   : Incorrect id or password
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Nguyen Hong Hiep (Employee).
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Search asset by name --
Enter asset name (or part): Id     Name                  Color       Price  Weight   Qty
------------------------------------------------------------
A002   Macbook pro 2016      Sliver    1000.00    2.20     5
A001   Samsung projector     White      500.00    3.20    10
------------------------------------------------------------
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Search asset by name --
Enter asset name (or part): => No asset matches "zzz".
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Borrow the assets --
Id     Name                  Color       Price  Weight   Qty
------------------------------------------------------------
A001   Samsung projector     White      500.00    3.20    10
A002   Macbook pro 2016      Sliver    1000.00    2.20     5
------------------------------------------------------------
Enter assetID: => Asset A099 does not exist.
Do you want to continue (Y/N)? Id     Name                  Color       Price  Weight   Qty
------------------------------------------------------------
A001   Samsung projector     White      500.00    3.20    10
A002   Macbook pro 2016      Sliver    1000.00    2.20     5
------------------------------------------------------------
Enter assetID: Enter quantity: => Only 5 of Macbook pro 2016 left in stock.
Do you want to continue (Y/N)? Id     Name                  Color       Price  Weight   Qty
------------------------------------------------------------
A001   Samsung projector     White      500.00    3.20    10
A002   Macbook pro 2016      Sliver    1000.00    2.20     5
------------------------------------------------------------
Enter assetID: Enter quantity: => Request R008 created for 2 x Macbook pro 2016.
Do you want to continue (Y/N)? ========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Cancel request --
Id     Asset  Asset name              Qty  Requested at
------------------------------------------------------------
R002   A002   Macbook pro 2016          1  24-12-2021 12:18:56
R008   A002   Macbook pro 2016          2  <NOW>
------------------------------------------------------------
Enter request ID: => You have no request with id R001.
Do you want to continue (Y/N)? Id     Asset  Asset name              Qty  Requested at
------------------------------------------------------------
R002   A002   Macbook pro 2016          1  24-12-2021 12:18:56
R008   A002   Macbook pro 2016          2  <NOW>
------------------------------------------------------------
Enter request ID: Cancel request R008 (Y/N)? => Nothing was cancelled.
Do you want to continue (Y/N)? Id     Asset  Asset name              Qty  Requested at
------------------------------------------------------------
R002   A002   Macbook pro 2016          1  24-12-2021 12:18:56
R008   A002   Macbook pro 2016          2  <NOW>
------------------------------------------------------------
Enter request ID: Cancel request R002 (Y/N)? => Request R002 cancelled.
Do you want to continue (Y/N)? ========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Return asset --
Id     Asset  Asset name              Qty  Borrowed at
------------------------------------------------------------
B001   A001   Samsung projector         1  23-12-2021 15:13:46
B002   A001   Samsung projector         2  25-12-2021 16:14:56
------------------------------------------------------------
Enter borrow ID: => You have no borrowed asset with id B003.
Do you want to continue (Y/N)? Id     Asset  Asset name              Qty  Borrowed at
------------------------------------------------------------
B001   A001   Samsung projector         1  23-12-2021 15:13:46
B002   A001   Samsung projector         2  25-12-2021 16:14:56
------------------------------------------------------------
Enter borrow ID: Return borrow B001 (Y/N)? => Borrow B001 returned. Samsung projector stock is now 11.
Do you want to continue (Y/N)? ========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: Goodbye.'''

P0015_RUN1_OUT = '''========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Search asset by name --
Enter asset name (or part): Id     Name                  Color       Price  Weight   Qty
------------------------------------------------------------
A001   Samsung projector     White      500.00    3.20    11
------------------------------------------------------------
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Nguyen Hong Hiep (Employee).
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Cancel request --
Id     Asset  Asset name              Qty  Requested at
------------------------------------------------------------
R008   A002   Macbook pro 2016          2  <NOW>
------------------------------------------------------------
Enter request ID: Cancel request R008 (Y/N)? => Request R008 cancelled.
Do you want to continue (Y/N)? ========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Cancel request --
=> You have no request.
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Return asset --
Id     Asset  Asset name              Qty  Borrowed at
------------------------------------------------------------
B002   A001   Samsung projector         2  25-12-2021 16:14:56
------------------------------------------------------------
Enter borrow ID: Return borrow B002 (Y/N)? => Borrow B002 returned. Samsung projector stock is now 13.
Do you want to continue (Y/N)? ========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Return asset --
=> You have no borrowed asset.
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Hoa Doan (Manager).
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: -- Borrow the assets --
=> A manager cannot borrow assets. Please use the manager's program.
========== BMLT ASSET - EMPLOYEE ==========
1. Login
2. Search asset by name
3. Borrow the assets
4. Cancel request
5. Return asset
Others- Quit
===========================================
Please select an option: Goodbye.'''


# The only thing in this program that is not the same on every run is the moment
# a NEW request is created, so that is the only thing the expectation relaxes.
# Every fresh stamp is replaced by <NOW> and the rest of the console is diffed
# character for character. The relaxation is not a hole:
#
#   * a stamp only matches if it is really dd-MM-yyyy HH:mm:ss, so a program that
#     wrote the date in some other shape fails the diff, not the regex;
#   * all three appearances of the new request must carry the SAME stamp;
#   * the eight stamps that came out of the brief's own sample files are listed
#     below and are NOT relaxed - they must survive the round trip through
#     request.dat and borrow.dat unchanged.
P0015_SAMPLE_STAMPS = {
    '23-12-2021 13:17:56', '24-12-2021 12:18:56', '23-12-2021 11:19:56',
    '24-12-2021 10:10:56', '23-12-2021 15:13:46', '25-12-2021 16:14:56',
    '15-12-2021 17:15:52', '26-12-2021 12:16:53',
}

P0015_STAMP = re.compile(r'\b\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}\b')


def _p0015_check(expected):
    def check(out):
        fresh = [s for s in P0015_STAMP.findall(out) if s not in P0015_SAMPLE_STAMPS]
        if not fresh:
            return False, 'no freshly created timestamp in dd-MM-yyyy HH:mm:ss form appeared'
        if len(set(fresh)) != 1:
            return False, f'the same record shows several different timestamps: {sorted(set(fresh))}'
        try:
            datetime.strptime(fresh[0], '%d-%m-%Y %H:%M:%S')
        except ValueError:
            return False, f'{fresh[0]} is not a real date-time'
        got = P0015_STAMP.sub(
            lambda m: m.group(0) if m.group(0) in P0015_SAMPLE_STAMPS else '<NOW>', out)
        if got.strip() != expected.strip():
            return False, ('output differs (fresh timestamps shown as <NOW>)\n'
                           '--- EXPECTED ---\n' + expected + '\n--- NORMALISED ---\n' + got)
        return True, ''
    return check



solution(
    'J1.L.P0015',
    title_vi='Quản lý tài sản — bản nâng cấp (chương trình của nhân viên)',
    files=[('src/entity/Persistable.java', P0015_PERSISTABLE),
           ('src/entity/Person.java', P0015_PERSON),
           ('src/entity/Employee.java', P0015_EMPLOYEE),
           ('src/entity/Manager.java', P0015_MANAGER),
           ('src/entity/Asset.java', P0015_ASSET),
           ('src/entity/Transaction.java', P0015_TRANSACTION),
           ('src/entity/Request.java', P0015_REQUEST),
           ('src/entity/Borrow.java', P0015_BORROW),
           ('src/bo/DataStore.java', P0015_DATASTORE),
           ('src/bo/AssetStore.java', P0015_ASSETSTORE),
           ('src/bo/EmployeeStore.java', P0015_EMPLOYEESTORE),
           ('src/bo/RequestStore.java', P0015_REQUESTSTORE),
           ('src/bo/BorrowStore.java', P0015_BORROWSTORE),
           ('src/controller/EmployeeController.java', P0015_CONTROLLER),
           ('src/utils/Validator.java', P0015_VALIDATOR),
           ('src/utils/Md5.java', P0015_MD5),
           ('src/utils/SampleData.java', P0015_SAMPLEDATA),
           ('src/ui/Main.java', P0015_MAIN)],
    main_class='ui.Main',
    runs=[(P0015_RUN0_IN, _p0015_check(P0015_RUN0_OUT)),
          (P0015_RUN1_IN, _p0015_check(P0015_RUN1_OUT))],
    explain_en='''<p><strong>Read the title before the specification: this is an UPGRADE, and of a pair.</strong>
J1.L.P0014 is the manager's program over the same four <code>.dat</code> files; this sheet is section A,
the <em>employee's</em> program. That is why two of its five functions are budgeted at <strong>0
LOC</strong>: Login and Search asset by name are the same code you already wrote, and the marker expects
to recognise them - same "Successfully" / "Incorrect id or password", same search. What is genuinely new
is that this program <em>writes</em>: it creates a request, deletes a request, and deletes a borrow while
putting the stock back on the shelf. The manager's program never gives anything back. If your
walkthrough describes asset management from scratch, you have answered the wrong sheet.</p>
<p><strong>Three of the four files are shared with another program, and that changes what you may
write.</strong> Nothing here rewrites a field it was not asked to touch. <code>asset.dat</code> is only
ever written to change <code>quantity</code>; the borrow timestamps are kept as the exact text the file
holds rather than parsed into a <code>LocalDateTime</code> and re-formatted, because reformatting is a
chance to alter data the manager's program owns. A shared file is an interface, and this program is not
its only client.</p>
<p><strong>Function 0 asks for classes, abstract classes, interfaces and polymorphism - here is where
each does real work.</strong> <code>Person</code> is abstract with <code>Employee</code> (EM) and
<code>Manager</code> (MA) beneath it, and the role is <em>not</em> a field: it is
<code>getRole()</code>, so the class decides the column and a Manager cannot be written out as an EM.
<code>Transaction</code> is abstract with <code>Request</code> and <code>Borrow</code> beneath it,
because a request and a borrow are the same five columns; that is why Cancel and Return share one table
renderer over <code>List&lt;? extends Transaction&gt;</code>. <code>Persistable</code> is the interface,
and it is what lets ONE <code>DataStore</code> read, write, search and delete rows of four different
files. None of these were added to satisfy a checklist - remove any one of them and you are writing the
same code two, three or four times.</p>
<p><strong>The best example of that polymorphism paying for itself.</strong> The three protected screens
do not ask <code>if (person.getRole().equals("EM"))</code>. They ask <code>currentUser.canBorrow()</code>,
which the object answers for itself. So the manager logging into the employee program is handled in one
guard, in one place, and a third role later is a new subclass plus one line in the parser - not a hunt
through every screen for role comparisons. The verified run logs the manager in and presses 3 to show
it.</p>
<p><strong>Eighteen files, and the shape they make.</strong> <code>entity</code> (8) holds the data and
the type hierarchy; <code>bo</code> (5) holds the files and the rules; <code>controller</code> (1) is one
method per menu item; <code>utils</code> (3) is the keyboard, the hash and the sample data;
<code>ui</code> (1) is the menu. Measured across real submissions, anything at seven files or more had a
controller, and this is the reason why: <code>returnAsset()</code> touches two stores and has to decide
the order of two writes. That decision belongs to a class that owns both, not to the menu.</p>
<p><strong>The next id is the highest one plus one - never <code>size() + 1</code>.</strong> The brief's
own <code>request.dat</code> is R001, R002, R003, <strong>R007</strong>: four rows whose largest number
is seven. <code>size() + 1</code> hands out R005 today, and the moment a row is deleted it starts handing
out ids that already exist. This is the single most common way to corrupt a file-backed assignment, and
the sample data is shaped to catch it - which is almost certainly deliberate.</p>
<p><strong>Login: the password column is a hash, so the comparison goes the other way.</strong> Every
password in the sample data is <code>e10adc3949ba59abbe56e057f20f883e</code>, which is MD5("123456").
There is no un-hashing: the program hashes what was typed and compares hashes. And there is one message
for both failures - the brief's <code>Incorrect id or password</code> is not vagueness, it is the correct
answer, because saying which half was wrong tells a stranger which employee ids exist. (MD5 itself is
long dead for real password storage; it is used because it is what the data contains, and that is worth
saying out loud at the defence.)</p>
<p><strong>Cancel and Return look up the id in YOUR list, not in the file.</strong>
<code>requests.byEmployee(me)</code> comes first and the chosen id is matched inside that list. Searching
the whole file and then checking the owner is one forgotten <code>if</code> away from letting an employee
cancel somebody else's request; and the message when it is not found - "You have no request with id
R001" - is the same whether the id belongs to a colleague or to nobody, for the same reason the login
message is. The verified run types R001, which really does exist and really does belong to E140449.</p>
<p><strong>Returning an asset writes two files, and there is no transaction. So the ORDER is a
decision.</strong> The borrow row is deleted first, then the stock is credited. If the machine dies
between the two writes, the company has lost count of one item - unpleasant, and recoverable by hand. Do
it the other way and you leave behind a borrow that has already been credited to stock, which can be
returned again, and again, inventing an asset each time. When two writes cannot be made atomic, choose
the order whose failure mode is a shortfall rather than a repeatable exploit. This is the question to
have an answer ready for.</p>
<p><strong>A missing file is not an error; a file that exists is the user's data.</strong>
<code>DataStore.load()</code> treats a missing <code>.dat</code> as an empty list, because a fresh
checkout has none and the program must still start. <code>SampleData</code> lays down the brief's own
four tables the first time and does <em>nothing at all</em> if a file is already there - rewriting them
on every start would silently undo every borrow and every cancellation, a far worse bug than the one it
was there to fix. And every change is written immediately rather than on exit, because the marker closes
the window with the window button.</p>
<p><strong>How this was verified - and why one run could not have proved anything.</strong> A program
that writes files is only proven when a DIFFERENT process finds what it wrote. Run 1 logs in, is refused
a bad password, searches, is refused a non-existent asset and a quantity larger than the shelf, creates
<strong>R008</strong>, is refused R001 (a colleague's), declines its own confirmation, cancels R002, is
refused B003 (a colleague's), and returns B001 so that A001 goes from 10 to 11. Run 2 is a brand-new JVM
in the same folder, and it proves three separate writes at once: the catalogue reads <strong>11</strong>,
R008 is <em>still there</em> and can be cancelled, and B001 is gone while B002 remains and returns to
make 13. Then both lists are emptied so the "you have no request / no borrowed asset" screens are real
rather than theoretical. Every timestamp except the one the run itself generates is diffed character for
character; the fresh one is checked for the exact <code>dd-MM-yyyy HH:mm:ss</code> shape, for being a
real date-time, and for being identical in all three places it appears.</p>
<p><strong>What the brief gets wrong, and the gaps it leaves you to fill.</strong> (1) Function 5 is
headed "Return request" but its body returns a borrowed asset from <code>borrow.dat</code> - follow the
body. (2) That same body says "show the confirm message before <em>cancel</em>", copied from Function 4;
it means before returning. (3) The sample data spells Silver as <strong>"Sliver"</strong> - it is data,
not prose, so it is stored exactly as written; correcting it would make the file disagree with the sheet
the marker is holding. (4) The column names in the brief are a table header, not a line of the file: the
<code>.dat</code> files hold data rows only. (5) The last menu item is written "Others- Quit", so the
choice is read as text and anything that is not 1-5 quits - a <code>getInt(1, 6)</code> loop would refuse
to quit on "q" and would be wrong. (6) Nothing in the sheet says whether a request may exceed what is in
stock. This program refuses it, because a request that can never be approved is a request nobody can act
on; the alternative reading - stock is only checked at approval time, in the manager's program - is
defensible too, and the point is to <em>have</em> the argument ready, not to guess silently.</p>''',
    explain_vi='''<p><strong>Đọc tiêu đề trước khi đọc đặc tả: đây là bản NÂNG CẤP, và là một nửa của
cặp bài.</strong> J1.L.P0014 là chương trình của quản lý trên cùng bốn tệp <code>.dat</code>; đề này là
mục A, chương trình của <em>nhân viên</em>. Đó là lý do hai trong năm chức năng được ghi
<strong>0 LOC</strong>: Đăng nhập và Tìm tài sản theo tên chính là đoạn mã bạn đã viết rồi, và người chấm
mong nhận ra chúng - vẫn "Successfully" / "Incorrect id or password", vẫn phép tìm đó. Cái thật sự MỚI là
chương trình này <em>ghi</em>: nó tạo yêu cầu mượn, xoá yêu cầu, và xoá một phiếu mượn đồng thời trả số
lượng về kho. Chương trình của quản lý không bao giờ trả lại thứ gì. Nếu phần trình bày của bạn mô tả
"quản lý tài sản" từ đầu, bạn đã trả lời nhầm đề.</p>
<p><strong>Ba trong bốn tệp dùng chung với một chương trình khác, và điều đó quyết định bạn được ghi
gì.</strong> Ở đây không có chỗ nào ghi đè một trường mà nó không được giao. <code>asset.dat</code> chỉ
bị ghi để đổi <code>quantity</code>; các mốc thời gian được giữ đúng như văn bản trong tệp chứ không
phân tích thành <code>LocalDateTime</code> rồi định dạng lại, vì định dạng lại là một cơ hội làm sai lệch
dữ liệu thuộc về chương trình của quản lý. Một tệp dùng chung là một giao diện, và chương trình này không
phải khách hàng duy nhất của nó.</p>
<p><strong>Chức năng 0 đòi lớp, lớp trừu tượng, interface và đa hình - đây là chỗ từng thứ làm việc
thật.</strong> <code>Person</code> trừu tượng, dưới nó là <code>Employee</code> (EM) và
<code>Manager</code> (MA), và vai trò <em>không</em> phải một trường dữ liệu: nó là
<code>getRole()</code>, nên lớp quyết định cột đó và một Manager không thể bị ghi ra thành EM.
<code>Transaction</code> trừu tượng với <code>Request</code> và <code>Borrow</code> bên dưới, vì một yêu
cầu và một phiếu mượn là cùng năm cột; nhờ vậy Huỷ yêu cầu và Trả tài sản dùng chung MỘT hàm vẽ bảng trên
<code>List&lt;? extends Transaction&gt;</code>. <code>Persistable</code> là interface, và chính nó cho
phép MỘT lớp <code>DataStore</code> đọc, ghi, tìm và xoá dòng của bốn tệp khác nhau. Không thứ nào được
thêm vào để "cho đủ danh mục" - bỏ bất kỳ thứ nào đi là bạn viết cùng một đoạn mã hai, ba hoặc bốn
lần.</p>
<p><strong>Ví dụ rõ nhất cho việc đa hình tự trả công cho nó.</strong> Ba màn hình cần đăng nhập không
hỏi <code>if (person.getRole().equals("EM"))</code>. Chúng hỏi <code>currentUser.canBorrow()</code>, và
đối tượng tự trả lời. Nhờ vậy chuyện quản lý đăng nhập vào chương trình của nhân viên được chặn ở một
chốt, một chỗ duy nhất; sau này thêm vai trò thứ ba là thêm một lớp con và một dòng trong bộ phân tích -
chứ không phải đi lùng mọi màn hình xem chỗ nào đang so chuỗi vai trò. Lần chạy kiểm cho quản lý đăng
nhập rồi bấm 3 để chứng minh.</p>
<p><strong>Mười tám tệp, và hình dạng chúng tạo ra.</strong> <code>entity</code> (8) giữ dữ liệu và cây
kiểu; <code>bo</code> (5) giữ tệp và luật; <code>controller</code> (1) là mỗi mục thực đơn một phương
thức; <code>utils</code> (3) là bàn phím, hàm băm và dữ liệu mẫu; <code>ui</code> (1) là thực đơn. Đếm
trên các bài nộp thật, project từ bảy tệp trở lên đều có controller, và đây là lý do:
<code>returnAsset()</code> đụng vào hai kho dữ liệu và phải quyết định thứ tự của hai lần ghi. Quyết định
đó thuộc về một lớp sở hữu cả hai, không thuộc về thực đơn.</p>
<p><strong>Mã kế tiếp là mã lớn nhất cộng một - không bao giờ là <code>size() + 1</code>.</strong> Chính
<code>request.dat</code> của đề là R001, R002, R003, <strong>R007</strong>: bốn dòng mà số lớn nhất là
bảy. <code>size() + 1</code> hôm nay cấp ra R005, và ngay khi có một dòng bị xoá là nó bắt đầu cấp ra
những mã đã tồn tại. Đây là cách phổ biến nhất làm hỏng một bài tập có lưu tệp, và dữ liệu mẫu được đặt
đúng hình dạng để bắt lỗi này - gần như chắc chắn là cố ý.</p>
<p><strong>Đăng nhập: cột mật khẩu là mã băm, nên phép so đi theo chiều ngược lại.</strong> Mọi mật khẩu
trong dữ liệu mẫu là <code>e10adc3949ba59abbe56e057f20f883e</code>, tức MD5("123456"). Không có chuyện
"giải băm": chương trình băm cái vừa gõ rồi so hai mã băm. Và chỉ có MỘT câu thông báo cho cả hai kiểu
sai - <code>Incorrect id or password</code> của đề không phải mơ hồ mà là câu trả lời đúng, vì nói rõ vế
nào sai là chỉ cho người lạ biết mã nhân viên nào có thật. (Bản thân MD5 đã chết từ lâu với việc lưu mật
khẩu thật; ở đây dùng vì dữ liệu mẫu là như vậy, và điều đó đáng nói thẳng khi bảo vệ.)</p>
<p><strong>Huỷ và Trả tra mã trong danh sách CỦA BẠN, không tra trong tệp.</strong>
<code>requests.byEmployee(me)</code> chạy trước, rồi mã được chọn mới được dò trong đúng danh sách đó. Dò
cả tệp rồi mới kiểm chủ sở hữu thì chỉ cách việc cho nhân viên huỷ yêu cầu của người khác đúng một câu
<code>if</code> bị quên; và câu thông báo khi không thấy - "You have no request with id R001" - giống hệt
nhau dù mã đó thuộc về đồng nghiệp hay chẳng thuộc về ai, cùng lý do với thông báo đăng nhập. Lần chạy
kiểm gõ R001, một mã có thật và thuộc về E140449.</p>
<p><strong>Trả tài sản ghi vào hai tệp, và không có giao dịch bao lấy chúng. Nên THỨ TỰ là một quyết
định.</strong> Dòng phiếu mượn bị xoá trước, rồi mới cộng số lượng vào kho. Nếu máy chết giữa hai lần
ghi, công ty đếm thiếu một món - khó chịu, nhưng sửa tay được. Làm ngược lại thì bạn để lại một phiếu
mượn đã được cộng vào kho, và nó có thể được trả lại lần nữa, rồi lần nữa, mỗi lần đẻ ra một tài sản từ
hư không. Khi hai lần ghi không thể nguyên tử, hãy chọn thứ tự mà hậu quả khi hỏng là thiếu hụt chứ không
phải một lỗ hổng lặp lại được. Đây là câu bạn nên chuẩn bị sẵn câu trả lời.</p>
<p><strong>Tệp không tồn tại không phải lỗi; tệp đã tồn tại là dữ liệu của người dùng.</strong>
<code>DataStore.load()</code> coi một tệp <code>.dat</code> vắng mặt là danh sách rỗng, vì bản mã nguồn
mới tải về chưa có tệp nào mà chương trình vẫn phải chạy được. <code>SampleData</code> đặt bốn bảng của
đề xuống đúng lần đầu tiên và <em>không làm gì cả</em> nếu tệp đã có - ghi đè mỗi lần khởi động sẽ lặng
lẽ xoá sạch mọi lần mượn và mọi lần huỷ, một lỗi còn tệ hơn lỗi mà nó sinh ra để chữa. Và mọi thay đổi
được ghi ngay lập tức chứ không phải lúc thoát, vì người chấm tắt chương trình bằng nút đóng cửa sổ.</p>
<p><strong>Đã kiểm chứng thế nào - và vì sao một lần chạy không chứng minh được gì.</strong> Một chương
trình có ghi tệp chỉ được coi là đúng khi một TIẾN TRÌNH KHÁC tìm thấy thứ nó đã ghi. Lần 1: đăng nhập,
bị từ chối vì sai mật khẩu, tìm kiếm, bị từ chối mã tài sản không tồn tại và số lượng vượt kho, tạo
<strong>R008</strong>, bị từ chối R001 (của đồng nghiệp), tự trả lời N ở câu xác nhận, huỷ R002, bị từ
chối B003 (của đồng nghiệp), và trả B001 khiến A001 từ 10 lên 11. Lần 2 là một JVM hoàn toàn mới trong
cùng thư mục, và nó chứng minh ba lần ghi khác nhau cùng lúc: danh mục hiện <strong>11</strong>, R008
<em>vẫn còn đó</em> và huỷ được, còn B001 đã biến mất trong khi B002 vẫn còn và trả về thành 13. Sau đó
cả hai danh sách được làm rỗng để hai màn hình "bạn không có yêu cầu nào / không mượn gì" là thật chứ
không phải lý thuyết. Mọi mốc thời gian trừ cái do chính lần chạy sinh ra đều được so từng ký tự; cái mới
sinh thì được kiểm đúng dạng <code>dd-MM-yyyy HH:mm:ss</code>, kiểm là một thời điểm có thật, và kiểm
giống hệt nhau ở cả ba chỗ nó xuất hiện.</p>
<p><strong>Đề sai chỗ nào, và những khoảng trống nó để bạn tự lấp.</strong> (1) Chức năng 5 mang tiêu đề
"Return request" nhưng phần thân lại trả một tài sản đang mượn trong <code>borrow.dat</code> - làm theo
phần thân. (2) Cũng phần thân đó viết "hiện thông báo xác nhận trước khi <em>huỷ</em>", chép nhầm từ
Chức năng 4; ý là trước khi trả. (3) Dữ liệu mẫu viết Silver thành <strong>"Sliver"</strong> - đó là dữ
liệu chứ không phải văn xuôi, nên lưu y nguyên; sửa lại sẽ làm tệp lệch với tờ đề trên tay người chấm.
(4) Các tên cột trong đề là dòng tiêu đề của bảng, không phải một dòng của tệp: tệp <code>.dat</code>
chỉ chứa các dòng dữ liệu. (5) Mục thực đơn cuối viết là "Others- Quit", nên lựa chọn được đọc như văn
bản và bất cứ thứ gì không phải 1-5 đều thoát - một vòng <code>getInt(1, 6)</code> sẽ không chịu thoát
khi gõ "q" và như vậy là sai. (6) Đề không nói yêu cầu mượn có được vượt quá tồn kho hay không. Chương
trình này từ chối, vì một yêu cầu không bao giờ duyệt được là một yêu cầu không ai xử lý được; cách hiểu
ngược lại - tồn kho chỉ kiểm lúc duyệt, ở chương trình của quản lý - cũng bảo vệ được, và điều quan trọng
là <em>có sẵn</em> lập luận, chứ không phải đoán bừa rồi im lặng.</p>''',
    hints_en=[
        'This is the EMPLOYEE half of J1.L.P0014: Login and Search are marked 0 LOC because they are reused. What is new is that this program writes request.dat, borrow.dat and the quantity in asset.dat.',
        'A request and a borrow are the same five columns - make them one abstract Transaction, and Cancel and Return share a screen.',
        'The next id is max(existing) + 1, not size() + 1: the sample request.dat is R001, R002, R003, R007.',
        'Never un-hash: MD5 the typed password and compare it to the column. e10adc3949ba59abbe56e057f20f883e is 123456.',
        'Look the request/borrow id up in THIS employee list, not in the whole file, or one forgotten check lets people cancel each other work.',
        'Returning writes two files with no transaction: delete the borrow first, then credit the stock - the other order can be replayed to invent assets.',
        'Treat a missing .dat as an empty list, write after every change, and never overwrite a data file that already exists.',
    ],
    hints_vi=[
        'Đây là nửa NHÂN VIÊN của J1.L.P0014: Đăng nhập và Tìm kiếm ghi 0 LOC vì được dùng lại. Cái mới là chương trình này GHI: request.dat, borrow.dat và cột quantity trong asset.dat.',
        'Yêu cầu mượn và phiếu mượn là cùng năm cột - gộp thành một lớp trừu tượng Transaction, rồi Huỷ và Trả dùng chung một màn hình.',
        'Mã kế tiếp là max(đang có) + 1, không phải size() + 1: request.dat mẫu là R001, R002, R003, R007.',
        'Không bao giờ giải băm: băm MD5 mật khẩu vừa gõ rồi so với cột trong tệp. e10adc3949ba59abbe56e057f20f883e chính là 123456.',
        'Tra mã yêu cầu/phiếu mượn trong danh sách CỦA nhân viên đang đăng nhập, đừng tra cả tệp, kẻo quên một phép kiểm là người này huỷ được việc của người kia.',
        'Trả tài sản ghi hai tệp mà không có giao dịch: xoá phiếu mượn TRƯỚC rồi mới cộng kho - thứ tự ngược lại có thể bị lặp lại để đẻ ra tài sản.',
        'Coi tệp .dat vắng mặt là danh sách rỗng, ghi ngay sau mỗi thay đổi, và không bao giờ ghi đè một tệp dữ liệu đã tồn tại.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0085': '''<h3>Bối cảnh</h3>
<p>Gần như tổ chức nào cũng cần theo dõi nhân sự của mình. Một hệ thống quản lý lưu các bản ghi, cho phép
nhân viên tạo mới, cập nhật và xoá chúng, đồng thời giúp tìm kiếm và sắp xếp dữ liệu. Bài này xây dựng
một hệ thống quản lý nhân viên nhỏ chạy trên console, vận dụng các nền tảng của lập trình hướng đối
tượng, tập hợp (collection), kiểm tra dữ liệu nhập và sắp xếp vào một tình huống CRUD (Create, Read,
Update, Delete) sát thực tế.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình cho phép người dùng nhập, quản lý và sắp xếp thông tin nhân viên — Id, First Name,
Last Name, Phone, Email, Address, DOB, Sex, Salary và Agency — rồi hiển thị các thông tin đó ra màn
hình.</p>
<h3>Chi tiết chức năng</h3>
<p><strong>1. Hiển thị thực đơn và yêu cầu người dùng chọn một mục.</strong></p>
<ul>
<li>1. Add employees</li>
<li>2. Update employees</li>
<li>3. Remove employees</li>
<li>4. Search employees</li>
<li>5. Sort employees by salary</li>
<li>6. Exit</li>
</ul>
<p><strong>2. Add employees.</strong> Hỏi lần lượt mọi thuộc tính; tất cả các trường đều bắt buộc, và Id
phải là duy nhất (từ chối Id trùng).</p>
<p><strong>3. Update employees.</strong> Tìm nhân viên theo Id, rồi cho người dùng sửa thông tin đang
lưu.</p>
<p><strong>4. Remove employees.</strong> Cho phép người dùng tìm nhân viên theo Id và xoá bản ghi đó.</p>
<p><strong>5. Search employees.</strong> Cho phép tìm nhân viên theo tên — khớp với tên (first name), họ
(last name), hoặc một phần của tên.</p>
<p><strong>6. Sort employees by salary</strong> và hiển thị danh sách đã sắp xếp.</p>
<h3>Màn hình mong đợi</h3>
<p>Thực đơn chính:</p>
<pre>========= EMPLOYEE MANAGEMENT =========
1. Add employees
2. Update employees
3. Remove employees
4. Search employees
5. Sort employees by salary
6. Exit
=======================================
Please select an option:</pre>
<p>Thêm nhân viên (mục 1):</p>
<pre>Please select an option: 1
-- Add employee --
Id         : E001
First name : John
Last name  : Smith
Phone      : 0901234567
Email      : john.smith@example.com
Address    : 12 Le Loi, Da Nang
DOB        : 1994-05-20
Sex        : Male
Salary     : 1500
Agency     : Sales
=&gt; Employee E001 added successfully.</pre>
<p>Tìm kiếm (mục 4) và sắp xếp theo lương (mục 5):</p>
<pre>Please select an option: 4
Enter name (or part): sm
Id     First name  Last name     Salary  Agency
-----------------------------------------------
E001   John        Smith        1500.00  Sales

Please select an option: 5
Employees sorted by salary (ascending):
Id     Name                Salary  Agency
-----------------------------------------
E003   Anna Lee           1200.00  HR
E001   John Smith         1500.00  Sales
E002   Bob Tran           1800.00  IT</pre>
<h3>Hướng dẫn</h3>
<h4>Các trường của Employee và luật kiểm tra</h4>
<ul>
<li><strong>Id</strong> — String. Bắt buộc; duy nhất (từ chối trùng khi Add).</li>
<li><strong>First Name</strong> — String. Bắt buộc; không rỗng.</li>
<li><strong>Last Name</strong> — String. Bắt buộc; không rỗng.</li>
<li><strong>Phone</strong> — String. Bắt buộc; chỉ gồm chữ số.</li>
<li><strong>Email</strong> — String. Bắt buộc; đúng định dạng email (ví dụ có “@” và phần tên miền).</li>
<li><strong>Address</strong> — String. Bắt buộc.</li>
<li><strong>DOB</strong> — Date. Bắt buộc; là một ngày hợp lệ (ví dụ dạng yyyy-MM-dd).</li>
<li><strong>Sex</strong> — String. Male hoặc Female.</li>
<li><strong>Salary</strong> — double. Bắt buộc; là số dương.</li>
<li><strong>Agency</strong> — String. Bắt buộc.</li>
</ul>
<h4>Gợi ý thiết kế</h4>
<ul>
<li>Tạo lớp <code>Employee</code> chứa mười trường trên, có constructor, getter/setter và
<code>toString()</code> được ghi đè.</li>
<li>Giữ toàn bộ bản ghi trong một <code>List&lt;Employee&gt;</code> (dùng <code>ArrayList</code>), và
chạy vòng lặp thực đơn lặp cho tới khi người dùng chọn Exit.</li>
<li>Kiểm tra mọi dữ liệu ngay khi nhập; ở chức năng Add, bắt buộc đủ mọi trường và bảo đảm Id chưa được
dùng.</li>
<li>Với Update và Remove, tìm bản ghi theo Id và báo cho người dùng khi không tìm thấy.</li>
<li>Với Search, so chuỗi người dùng gõ với first name và last name bằng phép “contains” không phân biệt
hoa thường.</li>
<li>Với Sort, sắp xếp danh sách theo lương bằng một <code>Comparator</code> (ví dụ
<code>list.sort(Comparator.comparingDouble(Employee::getSalary))</code>).</li>
<li>Tách phần mô hình (<code>Employee</code>), phần xử lý (<code>EmployeeManager</code>) và phần thực đơn
(chương trình chính) để thiết kế được sạch sẽ.</li>
</ul>''',

    'J1.L.P0015': '''<h3>Bối cảnh</h3>
<p>BMLT là một công ty phần mềm. Nhân sự của công ty gồm các nhân viên và một người quản lý. Trong công
ty có những tài sản dùng chung như máy chiếu, laptop… Người quản lý có các chức năng thêm, xoá, sửa, tìm
tài sản. Ngoài ra, quản lý còn duyệt các yêu cầu mượn tài sản của nhân viên. Về phía nhân viên, họ có các
chức năng: tìm kiếm, gửi yêu cầu mượn cũng như trả tài sản.</p>
<p>Bạn phải xây dựng chương trình quản lý tài sản của công ty BMLT. Hệ thống gồm <strong>2 chương
trình</strong>: một cho nhân viên và một cho quản lý. <em>(Đề này — J1.L.P0015 — là phần A: chương trình
của NHÂN VIÊN, bản nâng cấp của J1.L.P0014.)</em></p>
<p>Thông tin tài sản lưu trong tệp <code>asset.dat</code>:</p>
<pre>assetID  name                color   price  weight  quantity
A001     Samsung projector   White     500     3.2        10
A002     Macbook pro 2016    Sliver   1000     2.2         5</pre>
<p>Tệp <code>employee.dat</code> lưu thông tin nhân viên, bao gồm cả người quản lý:</p>
<pre>employID  name               birthdate   role  sex   password
E160001   Nguyen Hong Hiep   12/06/2000  EM    male  e10adc3949ba59abbe56e057f20f883e
E160240   Tran Dinh Khanh    15/07/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E140449   Le Buu Nhan        10/07/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E160798   Truong Le Minh     03/12/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E160052   Hoa Doan           05/06/1990  MA    male  e10adc3949ba59abbe56e057f20f883e</pre>
<p>Tệp <code>request.dat</code> lưu thông tin yêu cầu mượn:</p>
<pre>rID   assetID  employeeID  quantity  requestDateTime
R001  A001     E140449            1  23-12-2021 13:17:56
R002  A002     E160001            1  24-12-2021 12:18:56
R003  A001     E160798            1  23-12-2021 11:19:56
R007  A002     E160240            1  24-12-2021 10:10:56</pre>
<p>Tệp <code>borrow.dat</code> lưu thông tin mượn:</p>
<pre>bID   assetID  employeeID  quantity  borrowDateTime
B001  A001     E160001            1  23-12-2021 15:13:46
B002  A001     E160001            2  25-12-2021 16:14:56
B003  A002     E160798            3  15-12-2021 17:15:52
B007  A001     E160240            2  26-12-2021 12:16:53</pre>
<h3>A. Chương trình của nhân viên — Đặc tả</h3>
<p>Xây dựng chương trình quản lý dành cho nhân viên, với các chức năng cơ bản sau:</p>
<ul>
<li>1. Login</li>
<li>2. Search asset by name</li>
<li>3. Borrow the assets</li>
<li>4. Cancel request</li>
<li>5. Return asset</li>
<li>Others- Quit</li>
</ul>
<p>Mỗi lựa chọn trên thực đơn phải gọi đúng chức năng tương ứng. Chương trình phải hiển thị lại thực đơn
sau mỗi tác vụ và chờ người dùng chọn mục khác, cho tới khi người dùng chọn thoát.</p>
<h3>Chi tiết chức năng</h3>
<h4>Function 0: Xây dựng cấu trúc dữ liệu — 50 LOC</h4>
<ul>
<li>Lớp, lớp trừu tượng, interface.</li>
<li><code>assetID</code>, <code>employeeID</code> không được thay đổi sau khi đã tạo.</li>
<li>Phải thể hiện được tính đa hình của lập trình hướng đối tượng.</li>
</ul>
<h4>Function 1: Login — 0 LOC</h4>
<p><em>(0 LOC vì dùng lại từ J1.L.P0014: nhân viên nhập employeeID và mật khẩu; chương trình báo
<code>Successfully</code> hoặc <code>Incorrect id or password</code>.)</em></p>
<h4>Function 2: Search asset by name — 0 LOC</h4>
<p><em>(Cũng dùng lại: người dùng nhập chuỗi cần tìm, hệ thống trả về mọi tài sản có tên chứa chuỗi đó và
hiển thị đầy đủ thông tin, sắp xếp giảm dần.)</em></p>
<h4>Function 3: Borrow the assets — 50 LOC</h4>
<ul>
<li>Nhân viên phải đăng nhập mới dùng được chức năng này.</li>
<li>Hiển thị danh sách tài sản (tệp <code>asset.dat</code>).</li>
<li>Nhân viên nhập assetID và số lượng để gửi yêu cầu.</li>
<li>Thêm dữ liệu mới vào tệp <code>request.dat</code>.</li>
<li>Hỏi tiếp tục hay quay lại thực đơn chính.</li>
</ul>
<h4>Function 4: Cancel request — 50 LOC</h4>
<ul>
<li>Nhân viên phải đăng nhập mới dùng được chức năng này.</li>
<li>Hệ thống hiển thị danh sách tài sản mà nhân viên NÀY đã yêu cầu (tệp <code>request.dat</code>).</li>
<li>Nhân viên chọn mã yêu cầu muốn huỷ.</li>
<li>Hệ thống phải hiện thông báo xác nhận trước khi huỷ.</li>
<li>Xoá yêu cầu đã chọn khỏi tệp <code>request.dat</code>.</li>
<li>Hỏi tiếp tục hay quay lại thực đơn chính.</li>
</ul>
<h4>Function 5: Return asset — 50 LOC</h4>
<ul>
<li>Nhân viên phải đăng nhập mới dùng được chức năng này.</li>
<li>Hệ thống hiển thị danh sách tài sản mà nhân viên NÀY đang mượn (tệp <code>borrow.dat</code>).</li>
<li>Nhân viên chọn mã phiếu mượn muốn trả.</li>
<li>Hệ thống phải hiện thông báo xác nhận trước khi trả.</li>
<li>Xoá phiếu mượn đã chọn khỏi tệp <code>borrow.dat</code>.</li>
<li>Cập nhật lại số lượng tồn kho của tài sản (tệp <code>asset.dat</code>).</li>
<li>Hỏi tiếp tục hay quay lại thực đơn chính.</li>
</ul>
<p>Các đặc tả trên chỉ là thông tin cơ bản; bạn phải tự thực hiện bước phân tích yêu cầu và xây dựng ứng
dụng theo yêu cầu thực tế. Giảng viên chỉ giải thích yêu cầu một lần duy nhất ở buổi đầu tiên của bài
tập.</p>
<p><strong>Lưu ý khi đọc đề:</strong> tiêu đề của Function 5 trong bản gốc ghi là “Return request” nhưng
phần mô tả bên dưới lại nói về việc trả tài sản đang mượn trong <code>borrow.dat</code> — hãy làm theo
phần mô tả. Chuỗi <code>Sliver</code> trong dữ liệu mẫu là lỗi chính tả của <em>Silver</em> trong đề gốc;
vì đó là dữ liệu nên giữ nguyên. Các dòng tên cột ở trên là tiêu đề bảng, không phải một dòng nằm trong
tệp <code>.dat</code>.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
