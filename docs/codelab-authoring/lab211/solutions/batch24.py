# Batch 24 — J1.L.P0021 (student management: ArrayList, Comparator, a grouped
# report). A Long Assignment: 350 LOC, five slots, eight files.
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.L.P0021 — Student management (350 LOC)
# ════════════════════════════════════════════════════════════════

P0021_COURSE = '''package entity;

/**
 * The three courses, and nothing else.
 *
 * The brief says "There are only three courses: Java, .Net, C/C++". That is a
 * CLOSED set, and a closed set typed as String is a bug waiting to be typed in:
 * "java", "JAVA", "Jaba" and " Java " are four different students as far as the
 * report is concerned, and the report groups by course. An enum makes the set
 * closed in the compiler as well as in the sentence - once a Student holds a
 * Course, there is no way for a fourth course to exist anywhere in the program.
 *
 * The label is carried as a field rather than derived from the constant name
 * because ".Net" and "C/C++" are not legal Java identifiers. DOT_NET is what the
 * compiler can accept; ".Net" is what the screen must show.
 */
public enum Course {

    JAVA("Java"),
    DOT_NET(".Net"),
    C_CPP("C/C++");

    private final String label;

    Course(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    /**
     * The only door into this enum from the keyboard.
     *
     * Case-insensitive, because a marker types "java" as often as "Java", and
     * the brief nowhere says the course must be typed with the right capitals.
     * Returns null rather than throwing: whether an unknown course is an error
     * is a decision for the bo layer, which owns the wording of every message.
     */
    public static Course fromLabel(String text) {
        if (text == null) {
            return null;
        }
        String wanted = text.trim();
        for (Course course : values()) {
            if (course.label.equalsIgnoreCase(wanted)) {
                return course;
            }
        }
        return null;
    }

    /** "Java, .Net, C/C++" — built from the constants, so it can never drift. */
    public static String labels() {
        StringBuilder all = new StringBuilder();
        for (Course course : values()) {
            if (all.length() > 0) {
                all.append(", ");
            }
            all.append(course.label);
        }
        return all.toString();
    }

    @Override
    public String toString() {
        return label;
    }
}
'''

P0021_STUDENT = '''package entity;

import java.io.Serializable;

/**
 * One student: exactly the four attributes the Guidelines name — id,
 * studentName, semester, courseName.
 *
 * No rules and no printing live here. It cannot refuse a bad semester, because
 * it has no way to tell the caller why; that job belongs to the bo layer, which
 * can throw. Keeping the entity dumb is what lets every rule sit in one file
 * instead of being split between a constructor and a manager.
 *
 * Serializable costs one word and makes the class ready for the file-backed
 * variant of this assignment; it is also the shape a LAB211 marker expects to
 * see in the entity package.
 */
public class Student implements Serializable {

    private String id;
    private String studentName;
    private int semester;
    private Course courseName;

    public Student() {
    }

    public Student(String id, String studentName, int semester, Course courseName) {
        this.id = id;
        this.studentName = studentName;
        this.semester = semester;
        this.courseName = courseName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public Course getCourseName() {
        return courseName;
    }

    public void setCourseName(Course courseName) {
        this.courseName = courseName;
    }

    @Override
    public String toString() {
        return String.format("%-8s %-20s %-10d %s", id, studentName, semester, courseName.getLabel());
    }
}
'''

P0021_COURSE_COUNT = '''package entity;

/**
 * One line of the report: a student name, a course, and how many times that
 * pair appears in the list.
 *
 * This is a type rather than a Map.Entry or an encoded "name|course" String
 * because the report is a different SHAPE from a Student - three fields, one of
 * which does not exist on a Student at all. Returning
 * Map<String, Integer> from the bo layer would force the screen to split
 * the key back apart on a separator, and the day a student is called
 * "Nguyen | Van A" that code stops working.
 *
 * total is mutable through increase() so the grouping pass can count in place;
 * everything else is final, because a report line that changes its name after
 * it has been counted is not a report line.
 */
public class CourseCount {

    private final String studentName;
    private final Course course;
    private int total;

    public CourseCount(String studentName, Course course) {
        this.studentName = studentName;
        this.course = course;
        this.total = 1;
    }

    public String getStudentName() {
        return studentName;
    }

    public Course getCourse() {
        return course;
    }

    public int getTotal() {
        return total;
    }

    public void increase() {
        total++;
    }

    /** Exactly the line the brief prints: "Nguyen Van A | Java | 2". */
    @Override
    public String toString() {
        return studentName + " | " + course.getLabel() + " | " + total;
    }
}
'''

P0021_COMPARATOR = '''package utils;

import entity.Student;
import java.util.Comparator;

/**
 * Sort by student name, exactly as the Guidelines ask ("Should Collections.sort()
 * and overwrite compare() method in Comparator interface").
 *
 * A named class, not a lambda: the Guidelines name the interface and the method,
 * and a marker reading the project should find a file with `compare` in it.
 *
 * Two decisions worth defending:
 *
 * 1. compareToIgnoreCase. Plain compareTo is ASCII order, so every capital
 *    letter sorts before every lower-case one: "anh" would land after "Binh"
 *    and the list would look unsorted to anyone who is not thinking in code
 *    points.
 *
 * 2. The tie-break on id. Two students really can share a name - the brief's own
 *    report example has "Nguyen Van A" twice. Without a tie-break their relative
 *    order is whatever the sort happened to do, and a screen that reshuffles
 *    between runs is one a marker cannot diff. The id is unique, so this
 *    comparator gives one and only one answer for any list.
 */
public class StudentNameComparator implements Comparator<Student> {

    @Override
    public int compare(Student left, Student right) {
        int byName = left.getStudentName().compareToIgnoreCase(right.getStudentName());
        if (byName != 0) {
            return byName;
        }
        return left.getId().compareToIgnoreCase(right.getId());
    }
}
'''

P0021_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * ONE static Scanner over System.in, and a private constructor so nobody can
 * accidentally make a second one. Two Scanners on the same stream is the classic
 * way to lose a line of input: the first one buffers ahead, and the second reads
 * from where the buffer ended rather than from where the user is looking.
 *
 * The split of responsibility with the bo layer is deliberate: this class only
 * decides whether what was typed has the right SHAPE (is it a number at all?).
 * Whether the number is allowed - a semester above zero, one of three courses -
 * is a rule about students, and it lives in bo where it can be thrown with the
 * brief's own wording.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /** A whole number, with no range attached. */
    public static int getInt(String message) {
        while (true) {
            String line = getString(message);
            try {
                return Integer.parseInt(line);
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

    /**
     * A number, or nothing at all.
     *
     * Update needs a third answer that getInt() cannot give: "leave this field
     * as it was". Empty line -> null, and the bo layer reads null as "unchanged".
     * Anything else still has to be a number, so a typo is caught here and not
     * silently treated as "keep the old value".
     */
    public static Integer getOptionalInt(String message) {
        while (true) {
            String line = getString(message);
            if (line.isEmpty()) {
                return null;
            }
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /**
     * One of a fixed set of letters — Y/N, U/D.
     *
     * Case-insensitive in, canonical upper-case out, so the caller compares
     * against "N" and never has to think about what the user's shift key was
     * doing. Loops until it gets one of them: the brief's Y/N question has no
     * third answer, so neither does this.
     */
    public static String getOption(String message, String... options) {
        while (true) {
            String line = getString(message);
            for (String option : options) {
                if (line.equalsIgnoreCase(option)) {
                    return option.toUpperCase();
                }
            }
            StringBuilder allowed = new StringBuilder();
            for (String option : options) {
                if (allowed.length() > 0) {
                    allowed.append(" or ");
                }
                allowed.append(option);
            }
            System.out.println("Please enter " + allowed + ".");
        }
    }
}
'''

P0021_BO = '''package bo;

import entity.Course;
import entity.CourseCount;
import entity.Student;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import utils.StudentNameComparator;

/**
 * The list of students and every rule about it. It throws; it never prints.
 *
 * That one sentence is the whole reason this class exists separately from the
 * controller. A method that printed "ID already exists" could only ever be
 * tested by a human reading the console, and it could not be reused by a screen
 * that wanted to report the same failure differently. Throwing hands the
 * decision back to the caller and keeps every message string in one file, where
 * it can be checked against the brief word by word.
 *
 * The store is an ArrayList, as the brief asks. A HashMap keyed by id would make
 * the duplicate check O(1) instead of O(n), but with ten to a few hundred
 * students that difference is unmeasurable, and the ArrayList keeps insertion
 * order — which is what makes the report reproducible and the create screen
 * behave the way the user remembers typing.
 */
public class StudentManagement {

    /** The brief: "Use has to create at least 10 students". */
    public static final int MIN_STUDENTS = 10;

    private final List<Student> students = new ArrayList<>();

    public int size() {
        return students.size();
    }

    /**
     * Validate everything, then build the Student.
     *
     * The entity is constructed HERE rather than in the controller so that no
     * Student object can exist in a state the rules forbid. If the controller
     * built one and handed it over, there would be a moment when a student with
     * an empty name was a real object - and objects leak.
     *
     * The checks run in the order a user meets the fields, so the first thing
     * they typed wrong is the first thing they are told about.
     */
    public void addStudent(String id, String studentName, int semester, String courseName)
            throws Exception {
        String cleanId = id == null ? "" : id.trim();
        if (cleanId.isEmpty()) {
            throw new Exception("ID cannot be empty.");
        }
        if (find(cleanId) != null) {
            throw new Exception("ID [" + cleanId + "] already exists.");
        }
        String cleanName = studentName == null ? "" : studentName.trim();
        if (cleanName.isEmpty()) {
            throw new Exception("Student name cannot be empty.");
        }
        if (semester <= 0) {
            throw new Exception("Semester must be greater than 0.");
        }
        Course course = Course.fromLabel(courseName);
        if (course == null) {
            throw new Exception("Course must be one of: " + Course.labels() + ".");
        }
        students.add(new Student(cleanId, cleanName, semester, course));
    }

    /**
     * Find by id, or explain why not.
     *
     * Two different failures with two different messages: an empty list is not
     * the same thing as an id that is not in a list of thirty, and telling the
     * user which one it was saves them looking for a student they never created.
     */
    public Student findById(String id) throws Exception {
        requireNotEmpty();
        String wanted = id == null ? "" : id.trim();
        if (wanted.isEmpty()) {
            throw new Exception("ID cannot be empty.");
        }
        Student found = find(wanted);
        if (found == null) {
            throw new Exception("ID [" + wanted + "] does not exist.");
        }
        return found;
    }

    /**
     * Search by a name or "a part of student name", sorted by name.
     *
     * Two decisions the brief does not spell out and a marker will test anyway:
     *
     * - contains(), not equals(). The brief says "or a part of student name", so
     *   "van" has to find "Nguyen Van A".
     * - toLowerCase on both sides. Nothing in the brief says the search is
     *   case-sensitive, and a case-sensitive partial search feels broken to
     *   everyone who has ever used one.
     *
     * The result is a NEW list, which is then sorted. Sorting `students` itself
     * would let a read-only operation permanently rearrange the data: create ten
     * students, search once, and the order you typed them in is gone forever.
     * A search should not have side effects.
     *
     * An empty result is NOT an exception. Nothing has gone wrong - the answer
     * to "which students are called Zorro" is legitimately "none", and the
     * caller can see that from the empty list. An empty DATABASE is different:
     * that is a precondition the user has not met yet, so it throws.
     */
    public List<Student> searchByName(String keyword) throws Exception {
        requireNotEmpty();
        String wanted = keyword == null ? "" : keyword.trim();
        if (wanted.isEmpty()) {
            throw new Exception("Search keyword cannot be empty.");
        }
        String lower = wanted.toLowerCase();
        List<Student> found = new ArrayList<>();
        for (Student student : students) {
            if (student.getStudentName().toLowerCase().contains(lower)) {
                found.add(student);
            }
        }
        Collections.sort(found, new StudentNameComparator());
        return found;
    }

    /**
     * Update whichever fields were given; null or blank means "leave it".
     *
     * Everything is validated BEFORE anything is written. The obvious way to
     * write this method - set the name, then set the semester, then discover the
     * course is spelled wrong and throw - leaves the student half-updated and
     * the screen saying the update failed. An update either happens or it does
     * not.
     */
    public void updateStudent(String id, String studentName, Integer semester, String courseName)
            throws Exception {
        Student student = findById(id);

        String newName = studentName == null ? "" : studentName.trim();
        Integer newSemester = semester;
        if (newSemester != null && newSemester <= 0) {
            throw new Exception("Semester must be greater than 0.");
        }
        Course newCourse = null;
        String wantedCourse = courseName == null ? "" : courseName.trim();
        if (!wantedCourse.isEmpty()) {
            newCourse = Course.fromLabel(wantedCourse);
            if (newCourse == null) {
                throw new Exception("Course must be one of: " + Course.labels() + ".");
            }
        }

        if (!newName.isEmpty()) {
            student.setStudentName(newName);
        }
        if (newSemester != null) {
            student.setSemester(newSemester);
        }
        if (newCourse != null) {
            student.setCourseName(newCourse);
        }
    }

    public void deleteStudent(String id) throws Exception {
        students.remove(findById(id));
    }

    /**
     * Group the list by (student name, course) and count each group.
     *
     * A LinkedHashMap rather than a HashMap: lookup is instant either way, but
     * this keeps the groups in the order they were first met, so the report is
     * the same list of lines on every run of the same data. A HashMap would
     * reorder the report according to hash codes - not randomly, but for no
     * reason a reader could ever predict.
     *
     * The key is lower-cased so that "Nguyen Van A" and "nguyen van a" are one
     * student, which is the same rule the search uses. The DISPLAYED name is the
     * one from the first row of the group, not the key.
     *
     * The rows are then sorted by name, then by course, so the report reads like
     * the brief's example (all of "Nguyen Van A" together, alphabetically).
     */
    public List<CourseCount> report() throws Exception {
        requireNotEmpty();
        Map<String, CourseCount> groups = new LinkedHashMap<>();
        for (Student student : students) {
            String key = student.getStudentName().toLowerCase() + "\\u0000"
                    + student.getCourseName().name();
            CourseCount row = groups.get(key);
            if (row == null) {
                groups.put(key, new CourseCount(student.getStudentName(), student.getCourseName()));
            } else {
                row.increase();
            }
        }

        List<CourseCount> rows = new ArrayList<>(groups.values());
        Collections.sort(rows, new Comparator<CourseCount>() {
            @Override
            public int compare(CourseCount left, CourseCount right) {
                int byName = left.getStudentName().compareToIgnoreCase(right.getStudentName());
                if (byName != 0) {
                    return byName;
                }
                return left.getCourse().getLabel().compareToIgnoreCase(right.getCourse().getLabel());
            }
        });
        return rows;
    }

    /** Linear scan, case-insensitive: "s001" and "S001" are the same student. */
    private Student find(String id) {
        for (Student student : students) {
            if (student.getId().equalsIgnoreCase(id)) {
                return student;
            }
        }
        return null;
    }

    private void requireNotEmpty() throws Exception {
        if (students.isEmpty()) {
            throw new Exception("The student list is empty.");
        }
    }
}
'''

P0021_CONTROLLER = '''package controller;

import bo.StudentManagement;
import entity.CourseCount;
import entity.Student;
import java.util.List;
import utils.Validator;

/**
 * One method per menu option: read input through the Validator, call the bo
 * layer, report what came back.
 *
 * This class exists because each of the four options is the same three steps,
 * and each of them is fifteen to twenty-five lines of prompts. Left inside Main
 * they would bury the menu loop; here Main stays a menu that fits on one screen
 * and each option stays readable on its own.
 *
 * Every option catches Exception and prints getMessage(). That is the seam: bo
 * decides WHAT went wrong and owns the wording, the controller decides that the
 * program says so and carries on rather than dying. One catch block per option,
 * however many rules that option can break.
 */
public class StudentController {

    private final StudentManagement management = new StudentManagement();

    /**
     * The brief: at least ten students, and once there are enough, ask
     * "Do you want to continue (Y/N)?" after every one.
     *
     * The question is only asked once the minimum is reached - asking it earlier
     * would offer an exit the brief does not allow. Below the minimum the screen
     * says how far off it is, because a loop that will not let you leave and
     * will not say why is indistinguishable from a hung program.
     *
     * A failed add does not count: the student was never added, so size() has
     * not moved and the loop asks for another one.
     */
    public void create() {
        System.out.println("---------- Create Student ----------");
        while (true) {
            addOne();
            if (management.size() < StudentManagement.MIN_STUDENTS) {
                System.out.println("At least " + StudentManagement.MIN_STUDENTS
                        + " students are required - " + management.size() + " so far.");
                continue;
            }
            if ("N".equals(Validator.getOption("Do you want to continue (Y/N)? ", "Y", "N"))) {
                return;
            }
        }
    }

    private void addOne() {
        String id = Validator.getString("Enter id: ");
        String name = Validator.getString("Enter student name: ");
        int semester = Validator.getInt("Enter semester: ");
        String course = Validator.getString("Enter course name (Java, .Net, C/C++): ");
        try {
            management.addStudent(id, name, semester, course);
            System.out.println("Student [" + id.trim() + "] has been added.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /** Option 2. The brief: show student name, semester and course name. */
    public void findAndSort() {
        System.out.println("---------- Find and Sort ----------");
        String keyword = Validator.getString("Enter student name (or a part of it): ");
        try {
            List<Student> found = management.searchByName(keyword);
            if (found.isEmpty()) {
                // Not an error, so it is not an exception - but silence here
                // would look exactly like a crash.
                System.out.println("No student found.");
                return;
            }
            System.out.printf("%-20s %-10s %s%n", "Student name", "Semester", "Course");
            for (Student student : found) {
                System.out.printf("%-20s %-10d %s%n", student.getStudentName(),
                        student.getSemester(), student.getCourseName().getLabel());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Option 3. Find by id, show what was found, then ask U or D.
     *
     * The student is shown BEFORE the question. Deleting whatever happens to be
     * behind an id you typed from memory is how a marker loses a record they
     * wanted; seeing the row first makes "D" an informed answer.
     */
    public void updateOrDelete() {
        System.out.println("---------- Update/Delete ----------");
        String id = Validator.getString("Enter student id: ");
        try {
            Student student = management.findById(id);
            System.out.printf("%-8s %-20s %-10s %s%n", "ID", "Student name", "Semester", "Course");
            System.out.println(student);

            String action = Validator.getOption(
                    "Do you want to update (U) or delete (D) student? ", "U", "D");
            if ("D".equals(action)) {
                management.deleteStudent(student.getId());
                System.out.println("Student [" + student.getId() + "] has been deleted.");
                return;
            }

            // Blank keeps the current value. Retyping four fields to fix one is
            // how a typo gets introduced into the three that were already right.
            String name = Validator.getString(
                    "Enter new student name (blank to keep " + student.getStudentName() + "): ");
            Integer semester = Validator.getOptionalInt(
                    "Enter new semester (blank to keep " + student.getSemester() + "): ");
            String course = Validator.getString("Enter new course name (blank to keep "
                    + student.getCourseName().getLabel() + "): ");

            management.updateStudent(student.getId(), name, semester, course);
            System.out.println("Student [" + student.getId() + "] has been updated.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /** Option 4. The grouped report: name, course, total. */
    public void report() {
        System.out.println("-------------- Report --------------");
        try {
            for (CourseCount row : management.report()) {
                System.out.println(row);
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''

P0021_MAIN = '''package ui;

import controller.StudentController;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * The wording is copied from the brief character for character, including the
 * parenthesised sentence under the options - a marker diffs this screen before
 * reading a line of the code behind it.
 */
public class Main {

    public static void main(String[] args) {
        StudentController controller = new StudentController();

        boolean running = true;
        while (running) {
            System.out.println("WELCOME TO STUDENT MANAGEMENT");
            System.out.println("1. Create");
            System.out.println("2. Find and Sort");
            System.out.println("3. Update/Delete");
            System.out.println("4. Report");
            System.out.println("5. Exit");
            System.out.println("(Please choose 1 to Create, 2 to Find and Sort, "
                    + "3 to Update/Delete, 4 to Report and 5 to Exit program).");

            switch (Validator.getInt("Enter your choice: ", 1, 5)) {
                case 1:
                    controller.create();
                    break;
                case 2:
                    controller.findAndSort();
                    break;
                case 3:
                    controller.updateOrDelete();
                    break;
                case 4:
                    controller.report();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''


# ── the marker's keystrokes ──────────────────────────────────────
#
# Ten students is the brief's own minimum, so every scripted run has to type ten
# before it can leave the Create screen. That is not padding: it is the rule
# being exercised.

def _add(sid, name, semester, course):
    return '%s\n%s\n%s\n%s\n' % (sid, name, semester, course)


# The brief's own report example, embedded in a list of ten:
#   Nguyen Van A / Java twice, Nguyen Van B / .Net once, Nguyen Van B / Java once.
TEN = (_add('S001', 'Nguyen Van A', 1, 'Java')
       + _add('S002', 'Nguyen Van A', 2, 'Java')
       + _add('S003', 'Nguyen Van B', 1, '.Net')
       + _add('S004', 'Nguyen Van B', 3, 'Java')
       + _add('S005', 'Tran Thi C', 1, 'C/C++')
       + _add('S006', 'Le Van D', 2, 'Java')
       + _add('S007', 'Le Van D', 3, 'Java')
       + _add('S008', 'Le Van D', 1, '.Net')
       + _add('S009', 'Pham Thi E', 2, 'C/C++')
       + _add('S010', 'Nguyen Van A', 3, '.Net'))

# Ten again, typed in a deliberately anti-alphabetical order, to prove the
# Comparator and not the order of the ArrayList.
TEN_SCRAMBLED = (_add('S001', 'Vu Van Z', 1, 'Java')
                 + _add('S002', 'anh nguyen', 2, 'Java')
                 + _add('S003', 'Tran Van M', 3, '.Net')
                 + _add('S004', 'Bui Thi B', 1, 'C/C++')
                 + _add('S005', 'ANH NGUYEN', 2, 'Java')
                 + _add('S006', 'Do Van K', 3, 'Java')
                 + _add('S007', 'Cao Thi H', 1, 'Java')
                 + _add('S008', 'Ly Van P', 2, 'C/C++')
                 + _add('S009', 'Ha Thi Q', 3, 'Java')
                 + _add('S010', 'Bui Thi B', 2, 'Java'))

RUN0 = ('1\n' + TEN + 'N\n'          # create the ten, then answer N
        + '4\n'                       # the report
        + '2\nnguyen van\n'           # partial, lower-case search
        + '5\n')

RUN1 = ('abc\n'                       # keyboard guards on the menu itself
        + '9\n'
        + '2\nany\n'                  # every option on an empty list
        + '3\nS001\n'
        + '4\n'
        + '1\n'                       # create, refusing one rule at a time
        + _add('', 'No Id', 1, 'Java')
        + _add('S001', '', 1, 'Java')
        + _add('S001', 'Bad Semester', 0, 'Java')
        + _add('S001', 'Bad Course', 1, 'Pascal')
        + 'S001\nTyped Semester\nabc\n1\nJava\n'
        + _add('S001', 'Duplicate Id', 1, 'Java')
        + TEN[len(_add('S001', 'Nguyen Van A', 1, 'Java')):]   # S002..S010
        + 'N\n'
        + '2\nZorro\n'                # a search that matches nothing
        + '2\n\n'                     # a search with no keyword
        + '3\nS999\n'                 # update/delete an id that is not there
        + '3\nS002\nD\n'              # delete, then prove it is gone
        + '2\nnguyen van a\n'
        + '4\n'
        + '5\n')

RUN2 = ('1\n' + TEN_SCRAMBLED + 'Y\n'     # Y once: the loop must keep going
        + _add('S011', 'Bui Thi B', 3, '.Net')
        + 'x\nN\n'                         # a third answer to Y/N is refused
        + '2\nB\n'                         # partial match, sorted
        + '2\nan\n'                        # case-insensitive order + the id tie-break
        + '3\nS001\nU\nChanged Name\n\nWrong\n'   # an update refused WHOLE
        + '3\nS001\nU\n\n\nC/C++\n'           # course only; name and semester kept
        + '2\nvu van z\n'
        + '4\n'                            # the two spellings of one name, grouped
        + '5\n')


# ── the verified consoles ────────────────────────────────────────
#
# Captured from real runs, not written by hand.

EXPECT0 = '''WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Create Student ----------
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S001] has been added.
At least 10 students are required - 1 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S002] has been added.
At least 10 students are required - 2 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S003] has been added.
At least 10 students are required - 3 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S004] has been added.
At least 10 students are required - 4 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S005] has been added.
At least 10 students are required - 5 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S006] has been added.
At least 10 students are required - 6 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S007] has been added.
At least 10 students are required - 7 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S008] has been added.
At least 10 students are required - 8 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S009] has been added.
At least 10 students are required - 9 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S010] has been added.
Do you want to continue (Y/N)? WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: -------------- Report --------------
Le Van D | .Net | 1
Le Van D | Java | 2
Nguyen Van A | .Net | 1
Nguyen Van A | Java | 2
Nguyen Van B | .Net | 1
Nguyen Van B | Java | 1
Pham Thi E | C/C++ | 1
Tran Thi C | C/C++ | 1
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Student name         Semester   Course
Nguyen Van A         1          Java
Nguyen Van A         2          Java
Nguyen Van A         3          .Net
Nguyen Van B         1          .Net
Nguyen Van B         3          Java
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: Goodbye.'''


EXPECT1 = '''WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: You must input a number.
Enter your choice: Please choose from 1 to 5.
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): The student list is empty.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Update/Delete ----------
Enter student id: The student list is empty.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: -------------- Report --------------
The student list is empty.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Create Student ----------
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): ID cannot be empty.
At least 10 students are required - 0 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student name cannot be empty.
At least 10 students are required - 0 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Semester must be greater than 0.
At least 10 students are required - 0 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Course must be one of: Java, .Net, C/C++.
At least 10 students are required - 0 so far.
Enter id: Enter student name: Enter semester: You must input a number.
Enter semester: Enter course name (Java, .Net, C/C++): Student [S001] has been added.
At least 10 students are required - 1 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): ID [S001] already exists.
At least 10 students are required - 1 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S002] has been added.
At least 10 students are required - 2 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S003] has been added.
At least 10 students are required - 3 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S004] has been added.
At least 10 students are required - 4 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S005] has been added.
At least 10 students are required - 5 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S006] has been added.
At least 10 students are required - 6 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S007] has been added.
At least 10 students are required - 7 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S008] has been added.
At least 10 students are required - 8 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S009] has been added.
At least 10 students are required - 9 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S010] has been added.
Do you want to continue (Y/N)? WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): No student found.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Search keyword cannot be empty.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Update/Delete ----------
Enter student id: ID [S999] does not exist.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Update/Delete ----------
Enter student id: ID       Student name         Semester   Course
S002     Nguyen Van A         2          Java
Do you want to update (U) or delete (D) student? Student [S002] has been deleted.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Student name         Semester   Course
Nguyen Van A         3          .Net
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: -------------- Report --------------
Le Van D | .Net | 1
Le Van D | Java | 2
Nguyen Van A | .Net | 1
Nguyen Van B | .Net | 1
Nguyen Van B | Java | 1
Pham Thi E | C/C++ | 1
Tran Thi C | C/C++ | 1
Typed Semester | Java | 1
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: Goodbye.'''


EXPECT2 = '''WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Create Student ----------
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S001] has been added.
At least 10 students are required - 1 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S002] has been added.
At least 10 students are required - 2 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S003] has been added.
At least 10 students are required - 3 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S004] has been added.
At least 10 students are required - 4 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S005] has been added.
At least 10 students are required - 5 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S006] has been added.
At least 10 students are required - 6 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S007] has been added.
At least 10 students are required - 7 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S008] has been added.
At least 10 students are required - 8 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S009] has been added.
At least 10 students are required - 9 so far.
Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S010] has been added.
Do you want to continue (Y/N)? Enter id: Enter student name: Enter semester: Enter course name (Java, .Net, C/C++): Student [S011] has been added.
Do you want to continue (Y/N)? Please enter Y or N.
Do you want to continue (Y/N)? WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Student name         Semester   Course
Bui Thi B            1          C/C++
Bui Thi B            2          Java
Bui Thi B            3          .Net
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Student name         Semester   Course
anh nguyen           2          Java
ANH NGUYEN           2          Java
Do Van K             3          Java
Ly Van P             2          C/C++
Tran Van M           3          .Net
Vu Van Z             1          Java
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Update/Delete ----------
Enter student id: ID       Student name         Semester   Course
S001     Vu Van Z             1          Java
Do you want to update (U) or delete (D) student? Enter new student name (blank to keep Vu Van Z): Enter new semester (blank to keep 1): Enter new course name (blank to keep Java): Course must be one of: Java, .Net, C/C++.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Update/Delete ----------
Enter student id: ID       Student name         Semester   Course
S001     Vu Van Z             1          Java
Do you want to update (U) or delete (D) student? Enter new student name (blank to keep Vu Van Z): Enter new semester (blank to keep 1): Enter new course name (blank to keep Java): Student [S001] has been updated.
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: ---------- Find and Sort ----------
Enter student name (or a part of it): Student name         Semester   Course
Vu Van Z             1          C/C++
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: -------------- Report --------------
anh nguyen | Java | 2
Bui Thi B | .Net | 1
Bui Thi B | C/C++ | 1
Bui Thi B | Java | 1
Cao Thi H | Java | 1
Do Van K | Java | 1
Ha Thi Q | Java | 1
Ly Van P | C/C++ | 1
Tran Van M | .Net | 1
Vu Van Z | C/C++ | 1
WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).
Enter your choice: Goodbye.'''

solution(
    'J1.L.P0021',
    title_vi='Chương trình quản lý sinh viên',
    files=[('src/entity/Course.java', P0021_COURSE),
           ('src/entity/Student.java', P0021_STUDENT),
           ('src/entity/CourseCount.java', P0021_COURSE_COUNT),
           ('src/bo/StudentManagement.java', P0021_BO),
           ('src/controller/StudentController.java', P0021_CONTROLLER),
           ('src/utils/Validator.java', P0021_VALIDATOR),
           ('src/utils/StudentNameComparator.java', P0021_COMPARATOR),
           ('src/ui/Main.java', P0021_MAIN)],
    main_class='ui.Main',
    runs=[(RUN0, EXPECT0), (RUN1, EXPECT1), (RUN2, EXPECT2)],
    explain_en='''<p><strong>What is really being marked here.</strong> Four menu options is not a hard
program; five slots of marking time is not spent on whether you can write a switch. What is marked is
<em>where each decision lives</em>. Every rule about students — an id may not repeat, a semester must be
above zero, there are exactly three courses — sits in <code>bo/StudentManagement</code> and is announced
by throwing. Every keyboard read sits in <code>utils/Validator</code>. The controller does nothing but
collect, call and report, and <code>Main</code> is a menu that fits on one screen. Ask of any line in
this project "could this line be somewhere else?" and the answer should be no.</p>
<p><strong>Why eight files and a controller.</strong> The project shape was counted across real
submissions that passed: two to four files need no <code>bo</code>, and everything with seven or more
files had a <code>controller</code>. This one has four options, each of which is fifteen to twenty-five
lines of prompts. Left inside <code>Main</code> they would bury the menu loop in eighty lines of
<code>System.out.print</code>; pulled into <code>StudentController</code>, each option is readable on its
own and the menu stays a menu. The controller is not decoration here — it is what stops
<code>Main</code> from becoming the program.</p>
<p><strong>The course is an enum, not a String.</strong> "There are only three courses: Java, .Net,
C/C++" describes a <em>closed set</em>, and a closed set held in a <code>String</code> is a bug waiting
to be typed: <code>"java"</code>, <code>"JAVA"</code>, <code>" Java "</code> and <code>"Jaba"</code> are
four different courses as far as the report is concerned, and the report groups <em>by course</em>. An
<code>enum Course</code> makes the set closed in the compiler as well as in the sentence. The label is
carried as a field because <code>.Net</code> and <code>C/C++</code> are not legal Java identifiers —
<code>DOT_NET</code> is what the compiler accepts, <code>.Net</code> is what the screen must show — and
<code>Course.fromLabel()</code> is the single door in from the keyboard, case-insensitive because a
marker types "java" as often as "Java".</p>
<p><strong>The report is the one real algorithm, and the brief's own example of it is wrong.</strong>
The specification is "Student name, Course and Total of Course", and the sample data is four rows:
A/Java, A/Java, B/.Net, B/Java. Grouping those by <em>name and course</em> gives three lines —
<code>Nguyen Van A | Java | 2</code>, <code>Nguyen Van B | .Net | 1</code>, <code>Nguyen Van B | Java |
1</code>. The brief instead prints <code>Nguyen Van B | Java | 1</code> and then a
<code>Nguyen Van C</code> who appears nowhere in its own input, and loses the <code>.Net</code> row
entirely. The Program Specification sentence is the contract, so it is followed and the printed example
is treated as a typo. Say this out loud at the defence: noticing it counts in your favour, and the first
scripted run deliberately contains the brief's four rows inside its ten students so you can point at
them.</p>
<p><strong>Grouping: a LinkedHashMap, and a key that is not the display name.</strong> Lookup is instant
in a <code>HashMap</code> too, but a <code>HashMap</code> would order the report by hash code — not
randomly, but for no reason a reader could predict, and a report that reshuffles itself is one nobody
trusts. The key is <code>name.toLowerCase() + course</code>, so "Nguyen Van A" and "nguyen van a" are
one student, which is exactly the rule the search already uses; the name <em>displayed</em> is the one
from the row that opened the group, never the lower-cased key. The rows are then sorted by name and then
by course, so all of one student's lines sit together the way the brief's example shows.</p>
<p><strong>The Comparator, and the two things it must get right.</strong> The Guidelines name it:
"Should <code>Collections.sort()</code> and overwrite <code>compare()</code> method in
<code>Comparator</code> interface", so it is a named class in <code>utils</code> and not a lambda — a
marker looking for <code>compare</code> should find a file with it. Inside, <code>compareToIgnoreCase</code>
rather than <code>compareTo</code>: plain <code>compareTo</code> is code-point order, so every capital
sorts before every lower-case letter and "anh nguyen" lands after "Bui Thi B", which looks broken to
anyone not thinking in ASCII. And a tie-break on id, because two students really can share a name — the
brief's own example has "Nguyen Van A" twice — and without one their order is whatever the sort happened
to do that day.</p>
<p><strong>Search sorts a copy, and that is not fussiness.</strong> <code>searchByName</code> builds a
new <code>ArrayList</code> of matches and sorts <em>that</em>. Sorting the master list instead would let
a read-only operation permanently rearrange the data: create ten students, search once, and the order
you typed them in is gone for the rest of the session. A search should have no side effects. The brief
also says "student name <em>or a part of student name</em>", so the match is
<code>contains()</code> and both sides are lower-cased first — nothing in the brief makes the search
case-sensitive, and a case-sensitive partial search feels broken to everyone who has ever used one.</p>
<p><strong>"At least 10" and "greater than 10" are the same sentence, and they disagree.</strong> The
brief says the user has to create at least ten students, and that the Y/N question appears once the
number is greater than ten. Taken literally you could never stop at ten, so the stated minimum would
really be eleven. The escape hatch therefore opens at <code>size() &gt;= 10</code>: the minimum the
brief states is the one that is enforced. Below ten the screen says how many are still needed, because a
loop that will not let you leave and will not say why is indistinguishable from a hung program. A
refused add does not count — the student was never stored, so the counter has not moved.</p>
<p><strong>An update either happens or it does not.</strong> The obvious way to write
<code>updateStudent</code> is: set the name, set the semester, then discover the course is spelled wrong
and throw. That leaves the record half-changed while the screen says the update failed — the worst of
both. Here every field is validated first and nothing is written until all of them pass. Blank means
"keep this one", which is why <code>Validator.getOptionalInt</code> exists: it needs a third answer that
<code>getInt</code> cannot give, and a typo in the semester must still be caught rather than silently
read as "leave it alone". The third scripted run proves the atomicity by trying to rename S001 and set a
nonsense course in the same breath, then showing the row still carries its old name.</p>
<p><strong>Empty list versus no match: two different situations, deliberately.</strong> An empty list
throws <code>The student list is empty.</code> — it is a precondition the user has not met, and every
one of options 2, 3 and 4 reports it the same way. A search that matched nothing is <em>not</em> an
error: "which students are called Zorro" has a legitimate answer of "none", so the bo layer returns an
empty list and the controller prints <code>No student found.</code> Exceptions are for things that went
wrong, not for answers you did not like.</p>
<p><strong>One artefact of the brief worth knowing.</strong> The five options are numbered 2 to 6 in the
brief's own markup, because the list continues the numbering from an earlier item. The sentence
underneath settles it — "choose 1 to Create … 5 to Exit" — and the menu is numbered 1 to 5 to match.
Everything else on that screen is copied character for character, including the parenthesised sentence
and its full stop after the closing bracket, because a marker diffs this screen before reading a line of
the code behind it.</p>
<p><strong>How this was verified.</strong> Three real runs, compiled and played through with a marker's
keystrokes. Run 1 creates the brief's own example data as part of ten students, answers <code>N</code>
at the Y/N gate, prints the report, and searches with a lower-case partial name. Run 2 is the edge run:
letters where the menu wants a number, a menu choice of 9, then options 2, 3 and 4 on an empty list, then
every validation rule refused <strong>one at a time</strong> — empty id, empty name, semester 0, an
unknown course, letters in the semester, a duplicate id — so each message is proved on its own screen
rather than inferred; then a search matching nothing, a search with no keyword, an update of an id that
does not exist, and a delete followed by a search proving the student is gone. Run 3 types ten students
in anti-alphabetical order to prove the sort is the Comparator's doing and not the ArrayList's, answers
<code>Y</code> once to prove the create loop continues, refuses <code>x</code> at the Y/N gate, searches
"an" to show "anh nguyen" and "ANH NGUYEN" sorted together and then split by id, and finishes with the
atomic-update pair and a report where those two spellings group into one line.</p>
<p><strong>What an examiner will ask.</strong> "Where is the duplicate-id check, and why is it not in
the Student constructor?" — because the constructor cannot tell the caller why it refused, and the
duplicate test needs the whole list, which the entity has no business knowing about. "Why an enum?" —
because three is a closed set and the report groups by it. "What happens if I sort and then look at the
report?" — nothing, the search sorted a copy. "Show me where <code>compare()</code> is." It is a file
with the interface's name in it.</p>''',
    explain_vi='''<p><strong>Bài này thật ra chấm cái gì.</strong> Bốn chức năng trong thực đơn không
phải chương trình khó; năm slot chấm không dùng để xem bạn viết được <code>switch</code> hay không. Cái
được chấm là <em>mỗi quyết định nằm ở đâu</em>. Mọi luật về sinh viên — id không trùng, học kỳ phải lớn
hơn 0, chỉ có đúng ba môn — nằm trong <code>bo/StudentManagement</code> và được báo ra bằng cách ném
ngoại lệ. Mọi thao tác đọc bàn phím nằm trong <code>utils/Validator</code>. Controller chỉ làm ba việc:
gom dữ liệu, gọi bo, báo kết quả; còn <code>Main</code> là một thực đơn gọn trong một màn hình. Hãy hỏi
với bất kỳ dòng nào trong project này: "dòng này có thể nằm chỗ khác không?" — câu trả lời phải là
không.</p>
<p><strong>Vì sao tám tệp và có controller.</strong> Hình dạng project này được đếm từ các bài nộp thật
đã qua: hai đến bốn tệp thì không cần <code>bo</code>, còn mọi bài từ bảy tệp trở lên đều có
<code>controller</code>. Bài này có bốn chức năng, mỗi chức năng mười lăm đến hai lăm dòng hỏi/đáp. Để
nguyên trong <code>Main</code> thì vòng lặp thực đơn bị chôn dưới tám mươi dòng
<code>System.out.print</code>; tách sang <code>StudentController</code> thì mỗi chức năng tự đọc được và
thực đơn vẫn là thực đơn. Controller ở đây không phải trang trí — nó là thứ ngăn <code>Main</code> biến
thành cả chương trình.</p>
<p><strong>Môn học là enum, không phải String.</strong> "Chỉ có ba môn: Java, .Net, C/C++" mô tả một
<em>tập đóng</em>, mà tập đóng để kiểu <code>String</code> là lỗi chờ được gõ ra: <code>"java"</code>,
<code>"JAVA"</code>, <code>" Java "</code> và <code>"Jaba"</code> là bốn môn khác nhau dưới mắt hàm báo
cáo, mà báo cáo lại gom nhóm <em>theo môn</em>. <code>enum Course</code> làm cho tập đó đóng ngay trong
trình biên dịch chứ không chỉ đóng trong câu chữ. Nhãn hiển thị để ở một trường riêng vì
<code>.Net</code> và <code>C/C++</code> không phải định danh Java hợp lệ — <code>DOT_NET</code> là thứ
trình biên dịch chấp nhận, <code>.Net</code> là thứ màn hình phải hiện — và
<code>Course.fromLabel()</code> là cánh cửa duy nhất đi vào từ bàn phím, không phân biệt hoa thường vì
người chấm gõ "java" cũng nhiều như gõ "Java".</p>
<p><strong>Báo cáo là thuật toán thật sự duy nhất, và chính ví dụ của đề bị sai.</strong> Đặc tả ghi
"Student name, Course and Total of Course", dữ liệu mẫu gồm bốn dòng: A/Java, A/Java, B/.Net, B/Java.
Gom theo <em>tên và môn</em> phải ra ba dòng — <code>Nguyen Van A | Java | 2</code>,
<code>Nguyen Van B | .Net | 1</code>, <code>Nguyen Van B | Java | 1</code>. Đề lại in
<code>Nguyen Van B | Java | 1</code> rồi một <code>Nguyen Van C</code> không hề có trong dữ liệu vào của
chính nó, và làm mất hẳn dòng <code>.Net</code>. Câu đặc tả mới là bản có hiệu lực, nên chương trình theo
câu đặc tả và coi ví dụ in ra là lỗi đánh máy. Hãy nói thẳng điều này khi bảo vệ: nhận ra chỗ này được
cộng điểm, và lần chạy kiểm thứ nhất cố tình đặt đúng bốn dòng của đề vào trong mười sinh viên để bạn
chỉ tận nơi.</p>
<p><strong>Gom nhóm: LinkedHashMap, và khoá không phải tên hiển thị.</strong> <code>HashMap</code> tra
cứu cũng nhanh như thế, nhưng <code>HashMap</code> sẽ sắp báo cáo theo mã băm — không ngẫu nhiên, nhưng
theo một thứ tự không ai đoán trước được, mà một báo cáo tự xáo lại thì chẳng ai tin. Khoá ở đây là
<code>tên viết thường + môn</code>, nên "Nguyen Van A" và "nguyen van a" là một sinh viên — đúng luật mà
chức năng tìm kiếm đang dùng; tên <em>hiển thị</em> là tên của dòng đã mở nhóm, không bao giờ là khoá đã
viết thường. Sau đó các dòng được sắp theo tên rồi theo môn, để mọi dòng của cùng một sinh viên nằm cạnh
nhau đúng như ví dụ trong đề.</p>
<p><strong>Comparator, và hai thứ nó bắt buộc phải đúng.</strong> Hướng dẫn gọi tên nó: "Should
<code>Collections.sort()</code> and overwrite <code>compare()</code> method in <code>Comparator</code>
interface", nên nó là một lớp có tên trong <code>utils</code> chứ không phải lambda — người chấm đi tìm
<code>compare</code> phải thấy một tệp có nó. Bên trong dùng <code>compareToIgnoreCase</code> chứ không
phải <code>compareTo</code>: <code>compareTo</code> sắp theo mã ký tự, nên mọi chữ hoa đứng trước mọi
chữ thường và "anh nguyen" rơi xuống sau "Bui Thi B", nhìn như hỏng với bất kỳ ai không nghĩ bằng bảng
mã. Và có tiêu chí phụ theo id, vì hai sinh viên hoàn toàn có thể trùng tên — chính ví dụ của đề có
"Nguyen Van A" hai lần — thiếu tiêu chí phụ thì thứ tự của chúng là thứ tự mà thuật toán sắp xếp tình
cờ tạo ra hôm đó.</p>
<p><strong>Tìm kiếm sắp xếp trên bản sao, và đó không phải chuyện cầu kỳ.</strong>
<code>searchByName</code> dựng một <code>ArrayList</code> mới chứa kết quả rồi sắp <em>bản đó</em>. Sắp
thẳng vào danh sách gốc sẽ khiến một thao tác chỉ-đọc xáo trộn dữ liệu vĩnh viễn: tạo mười sinh viên,
tìm một lần, thế là thứ tự bạn đã nhập biến mất cho đến hết phiên làm việc. Tìm kiếm không được có tác
dụng phụ. Đề cũng ghi "tên sinh viên <em>hoặc một phần tên</em>", nên phép so là <code>contains()</code>
và cả hai vế đều được đưa về chữ thường — không chỗ nào trong đề bắt tìm kiếm phân biệt hoa thường, mà
tìm kiếm một phần có phân biệt hoa thường thì ai dùng cũng thấy như hỏng.</p>
<p><strong>"Ít nhất 10" và "nhiều hơn 10" nằm trong cùng một câu, và chúng mâu thuẫn.</strong> Đề nói
người dùng phải tạo ít nhất mười sinh viên, và câu hỏi Y/N xuất hiện khi số sinh viên nhiều hơn mười.
Hiểu theo đúng chữ thì bạn không bao giờ dừng được ở mười, tức là mức tối thiểu thật sự thành mười một.
Vì vậy lối thoát mở ra tại <code>size() &gt;= 10</code>: đúng con số tối thiểu mà đề đã nêu. Khi chưa đủ
mười, màn hình cho biết còn thiếu bao nhiêu, vì một vòng lặp không cho thoát mà cũng không nói lý do thì
không khác gì chương trình treo. Một lần thêm bị từ chối thì không tính — sinh viên đó chưa hề được lưu,
nên bộ đếm không nhúc nhích.</p>
<p><strong>Cập nhật thì làm trọn vẹn, hoặc không làm gì cả.</strong> Cách viết
<code>updateStudent</code> hiển nhiên nhất là: gán tên, gán học kỳ, rồi mới phát hiện môn học gõ sai và
ném lỗi. Kết quả là bản ghi đã đổi một nửa trong khi màn hình báo cập nhật thất bại — tệ cả đôi đường. Ở
đây mọi trường được kiểm tra trước, và không ghi gì cho tới khi tất cả đều hợp lệ. Bỏ trống nghĩa là
"giữ nguyên", và đó là lý do <code>Validator.getOptionalInt</code> tồn tại: nó cần một câu trả lời thứ
ba mà <code>getInt</code> không đưa ra được, đồng thời gõ nhầm học kỳ vẫn phải bị bắt chứ không được
lặng lẽ hiểu thành "giữ nguyên". Lần chạy kiểm thứ ba chứng minh tính trọn vẹn bằng cách vừa đổi tên
S001 vừa nhập một môn học vô nghĩa, rồi cho thấy dòng đó vẫn mang tên cũ.</p>
<p><strong>Danh sách rỗng và tìm không thấy là hai chuyện khác nhau, một cách có chủ ý.</strong> Danh
sách rỗng thì ném <code>The student list is empty.</code> — đó là điều kiện tiên quyết người dùng chưa
đáp ứng, và cả ba chức năng 2, 3, 4 đều báo y như nhau. Tìm không ra kết quả thì <em>không</em> phải
lỗi: câu hỏi "có sinh viên nào tên Zorro không" có câu trả lời hợp lệ là "không có", nên tầng bo trả về
danh sách rỗng và controller in <code>No student found.</code> Ngoại lệ dành cho việc có gì đó trục
trặc, không dành cho câu trả lời mà ta không thích.</p>
<p><strong>Một chi tiết kỹ thuật của đề nên biết.</strong> Năm mục trong thực đơn được đánh số 2 đến 6
trong chính mã nguồn của đề, vì danh sách nối tiếp cách đánh số của một mục trước đó. Câu ngay bên dưới
chốt lại — "choose 1 to Create … 5 to Exit" — nên thực đơn đánh số 1 đến 5 cho khớp. Mọi thứ còn lại
trên màn hình đó được chép nguyên xi từng ký tự, kể cả câu trong ngoặc đơn và dấu chấm sau dấu ngoặc
đóng, vì người chấm so màn hình này trước khi đọc một dòng mã nào phía sau.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy thật, biên dịch và gõ vào đúng như người chấm sẽ
gõ. Lần 1 tạo dữ liệu ví dụ của chính đề nằm trong mười sinh viên, trả lời <code>N</code> ở cửa Y/N, in
báo cáo, rồi tìm bằng một phần tên viết thường. Lần 2 là lần chạy biên: gõ chữ vào chỗ thực đơn cần số,
chọn 9, rồi bấm 2, 3, 4 trên danh sách rỗng, sau đó vi phạm <strong>từng luật một</strong> — id rỗng,
tên rỗng, học kỳ 0, môn học lạ, chữ cái ở ô học kỳ, id trùng — để mỗi thông báo được chứng minh trên màn
hình của riêng nó chứ không phải suy ra; rồi tìm không khớp, tìm với từ khoá rỗng, sửa/xoá một id không
tồn tại, và xoá xong thì tìm lại để chứng minh sinh viên đó đã biến mất. Lần 3 nhập mười sinh viên theo
thứ tự ngược bảng chữ cái để chứng minh thứ tự sắp là công của Comparator chứ không phải của ArrayList,
trả lời <code>Y</code> một lần để chứng minh vòng tạo vẫn chạy tiếp, từ chối <code>x</code> ở cửa Y/N,
tìm "an" để thấy "anh nguyen" và "ANH NGUYEN" đứng cạnh nhau rồi mới tách theo id, và kết thúc bằng cặp
cập nhật trọn-vẹn cùng một báo cáo trong đó hai cách viết hoa thường ấy gộp lại thành một dòng.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Chỗ kiểm id trùng nằm đâu, sao không đặt trong constructor
của Student?" — vì constructor không có cách nào nói cho người gọi biết lý do từ chối, và phép kiểm
trùng cần cả danh sách, thứ mà entity không có việc gì phải biết. "Sao lại dùng enum?" — vì ba là một
tập đóng và báo cáo gom nhóm theo nó. "Nếu tôi sắp xếp rồi mở báo cáo thì sao?" — không sao cả, tìm kiếm
đã sắp trên bản sao. "Chỉ cho tôi chỗ có <code>compare()</code>." Nó là một tệp mang đúng tên của giao
diện đó.</p>''',
    hints_en=[
        'Only three courses exist, so make Course an enum with a display label — .Net and C/C++ are not legal identifiers, so carry the label in a field.',
        'Put every rule in bo and throw the message; the controller catches Exception once per option and prints getMessage().',
        'Group the report by BOTH name and course in a LinkedHashMap — the brief\'s printed example contradicts its own sample data; follow the specification sentence.',
        'Collections.sort() a COPY of the matches with a named Comparator: use compareToIgnoreCase and tie-break on id so the screen is reproducible.',
        'Search with contains() on both sides lower-cased — the brief says "or a part of student name".',
        'Ask "Do you want to continue (Y/N)?" only once size() >= 10, and validate every update field BEFORE writing any of them.',
    ],
    hints_vi=[
        'Chỉ có ba môn, nên để Course là enum kèm nhãn hiển thị — .Net và C/C++ không phải định danh hợp lệ, hãy giữ nhãn trong một trường.',
        'Đặt mọi luật trong bo và ném ra thông báo; controller bắt Exception một lần cho mỗi chức năng rồi in getMessage().',
        'Gom báo cáo theo CẢ tên lẫn môn bằng LinkedHashMap — ví dụ in trong đề mâu thuẫn với chính dữ liệu mẫu của nó; hãy theo câu đặc tả.',
        'Collections.sort() trên BẢN SAO kết quả tìm được, dùng Comparator có tên: compareToIgnoreCase và tiêu chí phụ theo id để màn hình lặp lại được.',
        'Tìm bằng contains() với cả hai vế viết thường — đề ghi "hoặc một phần tên sinh viên".',
        'Chỉ hỏi "Do you want to continue (Y/N)?" khi size() >= 10, và kiểm tra mọi trường cập nhật TRƯỚC khi ghi bất kỳ trường nào.',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
VI = {
    'J1.L.P0021': '''<h3>Bối cảnh</h3>
<p>Viết chương trình quản lý thông tin sinh viên. Chương trình áp dụng các khái niệm của lập trình hướng
đối tượng (OOP) — một trong những cách tổ chức phần mềm tốt nhất.</p>
<p>Trong bài này ta dùng <code>ArrayList</code> để lưu danh sách sinh viên. Trên thực tế
<code>ArrayList</code> được dùng rất phổ biến để thao tác với dữ liệu, với các phương thức tiện lợi như
<code>add()</code>, <code>remove()</code>, <code>sort()</code>…</p>
<h3>Đặc tả chương trình</h3>
<p>Thông tin một sinh viên gồm: ID, tên sinh viên (Student Name), học kỳ (Semester) và tên môn học
(Course Name — <strong>chỉ có ba môn: Java, .Net, C/C++</strong>). Chương trình cho phép người dùng tạo
danh sách sinh viên, cập nhật/xoá thông tin sinh viên. Ngoài ra người dùng có thể tìm kiếm sinh viên và
sắp xếp kết quả theo tên.</p>
<p>Màn hình chính:</p>
<pre>WELCOME TO STUDENT MANAGEMENT
1. Create
2. Find and Sort
3. Update/Delete
4. Report
5. Exit
(Please choose 1 to Create, 2 to Find and Sort, 3 to Update/Delete, 4 to Report and 5 to Exit program).</pre>
<h3>Chi tiết chức năng</h3>
<p>Màn hình quản lý sinh viên có 4 chức năng:</p>
<ul>
<li><strong>Create</strong>: người dùng nhập thông tin sinh viên từ bàn phím. Phải tạo <strong>ít nhất 10
sinh viên</strong>; khi đã đủ số lượng, chương trình hỏi <code>Do you want to continue (Y/N)?</code> —
chọn <code>Y</code> để nhập tiếp, chọn <code>N</code> để quay về màn hình chính.</li>
<li><strong>Find/Sort</strong>: tìm sinh viên theo tên và sắp xếp kết quả theo tên; hiển thị tên sinh
viên, học kỳ và tên môn học. Người dùng nhập tên sinh viên <strong>hoặc một phần của tên</strong>.</li>
<li><strong>Update/Delete</strong>: cho phép tìm một sinh viên theo ID. Sau khi tìm thấy, chương trình
hỏi <code>Do you want to update (U) or delete (D) student</code>. Chọn <code>U</code> để sửa, chọn
<code>D</code> để xoá.</li>
<li><strong>Report</strong>: hiển thị mỗi sinh viên kèm tổng số môn — gồm tên sinh viên, môn học và tổng
số (Total of Course).</li>
</ul>
<p>Ví dụ, với dữ liệu:</p>
<pre>Student name    Course
Nguyen Van A    Java
Nguyen Van A    Java
Nguyen Van B    .Net
Nguyen Van B    Java</pre>
<p>Báo cáo in ra (gom theo tên và môn, rồi đếm):</p>
<pre>Nguyen Van A | Java | 2
Nguyen Van B | .Net | 1
Nguyen Van B | Java | 1</pre>
<p><em>Lưu ý:</em> khối kết quả in trong đề gốc có ghi thêm một dòng <code>Nguyen Van C</code> không hề
xuất hiện trong bảng dữ liệu của chính nó, và làm mất dòng <code>.Net</code>. Câu đặc tả "Student name,
Course and Total of Course" mới là bản có hiệu lực — hãy làm theo câu đặc tả và nêu chỗ mâu thuẫn này
khi bảo vệ.</p>
<h3>Yêu cầu kỹ thuật</h3>
<ol>
<li>Lập trình theo phong cách hướng đối tượng.</li>
<li>Chỉ dùng các lớp và hàm lõi của Java.</li>
</ol>
<h3>Hướng dẫn (theo slot)</h3>
<ul>
<li><strong>Slot 1 — Thiết kế lớp, chức năng Create</strong>: tạo lớp <code>Student</code> với các thuộc
tính <code>id</code>, <code>studentName</code>, <code>semester</code>, <code>courseName</code>.</li>
<li><strong>Slot 2 — Tìm và sắp xếp</strong>: nên dùng <code>Collections.sort()</code> và ghi đè phương
thức <code>compare()</code> của giao diện <code>Comparator</code>.</li>
<li><strong>Slot 3 — Cập nhật/Xoá sinh viên.</strong></li>
<li><strong>Slot 4 — Báo cáo.</strong></li>
<li><strong>Slot 5 — Review</strong>: giảng viên xem lại chương trình của sinh viên.</li>
</ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
