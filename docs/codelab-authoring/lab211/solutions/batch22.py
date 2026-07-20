# Batch 22 — J1.S.P0071 (task management for the CCRM project: fixed task types,
# a strict dd-MM-yyyy date, half-hour planning slots) and J1.S.P0072 (accounts
# with MD5-hashed passwords, and an honest note about why MD5 is the wrong tool).
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0071 — Task management program of CCRM project (150 LOC)
# ════════════════════════════════════════════════════════════════

P0071_TASK_TYPE = '''package entity;

import java.io.Serializable;

/**
 * One of the four fixed kinds of work: Code, Test, Design, Review.
 *
 * This is a class and not an enum on purpose. The brief describes the type
 * table as DATA - "ID, Name contains the following data fixed" - with an id
 * column the user types in at the Add screen. An enum would model it as a
 * language construct instead, and looking one up would mean mapping 1..4 onto
 * ordinals, which is exactly the kind of coupling that breaks the day the bank
 * adds a fifth type. As a class, adding "5 Deploy" is one more line of data.
 */
public class TaskType implements Serializable {

    private static final long serialVersionUID = 1L;

    private int id;
    private String name;

    public TaskType() {
    }

    public TaskType(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    /** The report's "Task Type" column is the name alone, so that is what this is. */
    @Override
    public String toString() {
        return name;
    }
}
'''

P0071_TASK = '''package entity;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * One task. Fields, and no opinion about them.
 *
 * There is deliberately no validation in this class. The brief hands every
 * check to addTask, which must THROW; if the constructor also refused a bad
 * date there would be two places that can reject the same task, with two
 * different messages, and no way to tell which one a marker is reading.
 *
 * The date is a real java.util.Date and not the String the user typed. Once
 * it is a Date the program can sort, compare and re-format it; once it is a
 * String it is only ever seven characters that happen to look like a date.
 * Parsing at the edge and holding the parsed value is the whole point of the
 * exercise's "use SimpleDateFormat" instruction.
 */
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    /** The one place the date format is written down. */
    public static final String DATE_PATTERN = "dd-MM-yyyy";

    private int id;
    private TaskType taskType;
    private String requirementName;
    private Date date;
    private double planFrom;
    private double planTo;
    private String assignee;
    private String reviewer;

    public Task() {
    }

    public Task(int id, TaskType taskType, String requirementName, Date date,
            double planFrom, double planTo, String assignee, String reviewer) {
        this.id = id;
        this.taskType = taskType;
        this.requirementName = requirementName;
        this.date = date;
        this.planFrom = planFrom;
        this.planTo = planTo;
        this.assignee = assignee;
        this.reviewer = reviewer;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
        this.taskType = taskType;
    }

    public String getRequirementName() {
        return requirementName;
    }

    public void setRequirementName(String requirementName) {
        this.requirementName = requirementName;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getPlanFrom() {
        return planFrom;
    }

    public void setPlanFrom(double planFrom) {
        this.planFrom = planFrom;
    }

    public double getPlanTo() {
        return planTo;
    }

    public void setPlanTo(double planTo) {
        this.planTo = planTo;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    /** dd-MM-yyyy again, from the single pattern above. */
    public String getFormattedDate() {
        return new SimpleDateFormat(DATE_PATTERN).format(date);
    }

    /**
     * "9.5-17.5" - the planned window, both ends.
     *
     * Locale.US is not decoration. String.format("%.1f") follows the default
     * locale, and on a machine set to Vietnamese or German it prints "9,5".
     * A time column that changes shape depending on who runs the program is a
     * bug that never reproduces on the developer's own machine.
     */
    public String getPlannedTime() {
        return String.format(Locale.US, "%.1f-%.1f", planFrom, planTo);
    }

    @Override
    public String toString() {
        return id + " - " + requirementName + " (" + taskType + ") " + getFormattedDate()
                + " " + getPlannedTime() + " " + assignee + "/" + reviewer;
    }
}
'''

P0071_BO = '''package bo;

import entity.Task;
import entity.TaskType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

/**
 * The task list and every rule about it. It never prints.
 *
 * The three method signatures the brief names - addTask, deleteTask,
 * getDataTasks - take Strings and throw Exception. That is not sloppiness in
 * the brief; it is the contract. The screen layer's job is to collect seven
 * lines of text, and this layer's job is to decide whether those seven lines
 * describe a task. Every parse and every rule therefore lives on this side of
 * the boundary, where failing means throwing rather than printing.
 */
public class TaskManager {

    private static final double PLAN_MIN = 8.0;
    private static final double PLAN_MAX = 17.5;

    /**
     * The fixed type table from the brief.
     *
     * It sits here rather than in its own bo class: it is four rows that never
     * change, read through one method. A TaskTypeList.java holding a constructor
     * and a findById would be a file added to reach a file count, and an empty
     * layer costs a mark rather than earning one.
     */
    private final List<TaskType> taskTypes = new ArrayList<>();

    private final List<Task> tasks = new ArrayList<>();

    /**
     * The next id to hand out.
     *
     * The brief says "ID = ID last task + 1", which is the same thing as a
     * counter right up until the moment you use the delete function the same
     * brief asks for. Delete the newest task and "last task + 1" hands its id
     * straight back to the next one, so two different tasks in one session's
     * history answer to id 3. A counter that only ever goes up costs nothing
     * and keeps an id meaning one task forever. The scripted run demonstrates
     * it: add two, delete the second, add a third, and the third is id 3.
     */
    private int nextId = 1;

    public TaskManager() {
        taskTypes.add(new TaskType(1, "Code"));
        taskTypes.add(new TaskType(2, "Test"));
        taskTypes.add(new TaskType(3, "Design"));
        taskTypes.add(new TaskType(4, "Review"));
    }

    /**
     * Required signature:
     * public int addTask(String requirementName, String assignee, String reviewer,
     *         String taskTypeID, String date, String planFrom, String planTo) throws Exception
     *
     * Everything is validated BEFORE anything is added. If the date is good and
     * the times are not, the list must be exactly as it was - a half-added task
     * is worse than a rejected one, because the report then shows a row nobody
     * typed.
     */
    public int addTask(String requirementName, String assignee, String reviewer,
            String taskTypeID, String date, String planFrom, String planTo) throws Exception {
        String name = required(requirementName, "Requirement Name cannot be empty.");
        String owner = required(assignee, "Assignee cannot be empty.");
        String checker = required(reviewer, "Reviewer cannot be empty.");
        TaskType type = parseTaskType(taskTypeID);
        Date when = parseDate(date);
        double from = parsePlan(planFrom, "Plan From");
        double to = parsePlan(planTo, "Plan To");
        if (from >= to) {
            throw new Exception("Plan From must be less than Plan To.");
        }

        int id = nextId;
        tasks.add(new Task(id, type, name, when, from, to, owner, checker));
        nextId++;
        return id;
    }

    /**
     * Required signature: public void deleteTask(String id) throws Exception
     *
     * "Id must exist in the DB" is the only rule, so a missing id is an
     * Exception and not a silently ignored request. A delete that quietly does
     * nothing is the failure a user does not notice until the report is wrong.
     */
    public void deleteTask(String id) throws Exception {
        int wanted = parseId(id);
        for (int i = 0; i < tasks.size(); i++) {
            if (tasks.get(i).getId() == wanted) {
                tasks.remove(i);
                return;
            }
        }
        throw new Exception("Task [" + wanted + "] does not exist.");
    }

    /**
     * Required signature: public List&lt;Task&gt; getDataTasks()
     *
     * A sorted COPY, never the field. Handing out the live list would let the
     * screen layer reorder or clear the program's data by accident, and the
     * whole reason the rules live in here is that nobody else can reach them.
     */
    public List<Task> getDataTasks() {
        List<Task> sorted = new ArrayList<>(tasks);
        sorted.sort(Comparator.comparingInt(Task::getId));
        return sorted;
    }

    // ── validation ───────────────────────────────────────────────

    /**
     * The brief says to catch NullPointerException. Better than catching it is
     * making it impossible: one null check at the front of every field means
     * there is no later line where a null can reach .trim() or .parse().
     */
    private static String required(String text, String message) throws Exception {
        if (text == null || text.trim().isEmpty()) {
            throw new Exception(message);
        }
        return text.trim();
    }

    private TaskType parseTaskType(String text) throws Exception {
        int id;
        try {
            id = Integer.parseInt(required(text, "Task Type cannot be empty."));
        } catch (NumberFormatException e) {
            // Integer.parseInt is the wrapper-class check the brief asks for:
            // it is the difference between "is this a number" and "does this
            // look like one to a human".
            throw new Exception("Task Type must be a number.");
        }
        for (TaskType type : taskTypes) {
            if (type.getId() == id) {
                return type;
            }
        }
        throw new Exception("Task Type [" + id + "] does not exist. It must be 1 to 4.");
    }

    /**
     * A real dd-MM-yyyy date. Two traps live here, and both are silent.
     *
     * 1. SimpleDateFormat is LENIENT by default. Lenient means 31-02-2003 is
     *    not an error - it rolls over and becomes 03-03-2003, and 32-13-2003
     *    becomes 01-02-2004. The user gets a task planned for a day they did
     *    not choose and nothing on the screen says so. setLenient(false) turns
     *    both into a ParseException.
     *
     * 2. setLenient(false) is still not enough. It accepts "1-2-2015" (the
     *    pattern says dd-MM but the parser takes one digit), and it accepts
     *    "26-06-2015rubbish", because parse() stops at the first character it
     *    cannot use and never complains about the rest. The fix is to format
     *    the parsed date back and compare it with what was typed: a date that
     *    survives the round trip unchanged is a date in the required format,
     *    and nothing else is.
     */
    private Date parseDate(String text) throws Exception {
        String value = required(text, "Date cannot be empty.");
        SimpleDateFormat format = new SimpleDateFormat(Task.DATE_PATTERN);
        format.setLenient(false);
        Date parsed;
        try {
            parsed = format.parse(value);
        } catch (ParseException e) {
            throw new Exception("Date must be a real date in the format dd-MM-yyyy.");
        }
        if (!format.format(parsed).equals(value)) {
            throw new Exception("Date must be a real date in the format dd-MM-yyyy.");
        }
        return parsed;
    }

    /**
     * 8.0, 8.5, 9.0 ... 17.5 - the working day in half-hour slots.
     *
     * The half-hour test is `value * 2` landing on a whole number rather than
     * `value % 0.5 == 0`. The remainder of a double by 0.5 is not reliably
     * zero, and the comparison uses a tolerance for the same reason: 9.5 * 2
     * is exactly 19.0 here, but writing floating-point equality without a
     * tolerance is a habit that fails on the one input nobody tested.
     */
    private double parsePlan(String text, String label) throws Exception {
        double value;
        try {
            value = Double.parseDouble(required(text, label + " cannot be empty."));
        } catch (NumberFormatException e) {
            throw new Exception(label + " must be a number.");
        }
        if (value < PLAN_MIN || value > PLAN_MAX) {
            throw new Exception(label + " must be between 8.0 and 17.5.");
        }
        if (Math.abs(value * 2 - Math.rint(value * 2)) > 1e-9) {
            throw new Exception(label + " must be a whole or half hour: 8.0, 8.5, 9.0 ... 17.5.");
        }
        return value;
    }

    private static int parseId(String text) throws Exception {
        try {
            return Integer.parseInt(required(text, "ID cannot be empty."));
        } catch (NumberFormatException e) {
            throw new Exception("ID must be a number.");
        }
    }
}
'''

P0071_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * One static Scanner over System.in, and a private constructor so nobody can
 * make a second one. Two Scanners on the same stream is the classic way to
 * lose a line of input: the first one buffers ahead, and the second reads from
 * where the buffer ends rather than from where the user is looking.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * A line of text, exactly as typed (trimmed).
     *
     * It does NOT reject an empty line. Whether an empty requirement name is
     * allowed is a rule about tasks, and rules about tasks live in bo - where
     * they can throw the brief's message instead of quietly asking again.
     */
    public static String getString(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }

    /** A menu choice: here the range IS a fact about the screen, so it lives here. */
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

P0071_CONTROLLER = '''package controller;

import bo.TaskManager;
import entity.Task;
import java.util.List;
import utils.Validator;

/**
 * Collects what the user types, calls the bo layer, reports what came back.
 *
 * This class earns its place by what it takes OUT of Main: the Add screen
 * alone is seven prompts, and with the delete screen and the report table
 * those three blocks would bury a nine-line menu loop in sixty lines of
 * printing. The count is a symptom - what actually matters is that Main can be
 * read in one screenful and each option can be read on its own.
 *
 * Note the prompt order. The screen in the brief asks for Requirement Name,
 * Task Type, Date, From, To, Assignee, Reviewer; the required addTask
 * signature takes them as requirementName, assignee, reviewer, taskTypeID,
 * date, planFrom, planTo. Both are honoured here - ask in screen order, pass
 * in signature order - and the compiler cannot help, because all seven
 * parameters are Strings. Getting this wrong swaps the assignee with the task
 * type and produces a program that runs perfectly and is wrong.
 */
public class TaskController {

    private final TaskManager manager = new TaskManager();

    public void addTask() {
        System.out.println("------------Add Task---------------");
        String requirementName = Validator.getString("Requirement Name: ");
        String taskTypeID = Validator.getString("Task Type: ");
        String date = Validator.getString("Date: ");
        String planFrom = Validator.getString("From: ");
        String planTo = Validator.getString("To: ");
        String assignee = Validator.getString("Assignee: ");
        String reviewer = Validator.getString("Reviewer: ");
        try {
            int id = manager.addTask(requirementName, assignee, reviewer,
                    taskTypeID, date, planFrom, planTo);
            System.out.println("Task [" + id + "] has been added.");
        } catch (Exception e) {
            // Nine different rules, one way of reporting them: say what was
            // wrong and go back to the menu, exactly as the brief requires.
            System.out.println(e.getMessage());
        }
    }

    public void deleteTask() {
        System.out.println("---------Del Task------");
        String id = Validator.getString("ID:");
        try {
            manager.deleteTask(id);
            System.out.println("Task [" + id + "] has been deleted.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void showTasks() {
        List<Task> tasks = manager.getDataTasks();
        System.out.println("----------------------------------------- Task ---------------------------------------");
        if (tasks.isEmpty()) {
            // Silence looks like a crash. An empty list is a normal state for a
            // program that has only just started.
            System.out.println("There is no task yet.");
            return;
        }
        // printf field widths, not tabs. A \\t table looks aligned until one
        // requirement name is longer than the tab stop, and then every column
        // after it steps sideways for that row only.
        System.out.printf("%-4s%-20s%-12s%-14s%-12s%-12s%s%n",
                "ID", "Name", "Task Type", "Date", "Time", "Assignee", "Reviewer");
        for (Task task : tasks) {
            System.out.printf("%-4d%-20s%-12s%-14s%-12s%-12s%s%n",
                    task.getId(), task.getRequirementName(), task.getTaskType().getName(),
                    task.getFormattedDate(), task.getPlannedTime(),
                    task.getAssignee(), task.getReviewer());
        }
    }
}
'''

P0071_MAIN = '''package ui;

import controller.TaskController;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * The brief's picture of the menu lists the four options without numbers, but
 * the specification says the user "selects an option", so the numbers are
 * printed. The wording is copied from the brief exactly, lower-case "exit"
 * included - a marker diffing the screen counts that, and a tidy-up here is a
 * difference against the sheet.
 */
public class Main {

    public static void main(String[] args) {
        TaskController controller = new TaskController();

        boolean running = true;
        while (running) {
            System.out.println("========= Task program =========");
            System.out.println("1. Add Task");
            System.out.println("2. Delete task");
            System.out.println("3. Display Task");
            System.out.println("4. exit");

            switch (Validator.getInt("Please choose one option: ", 1, 4)) {
                case 1:
                    controller.addTask();
                    break;
                case 2:
                    controller.deleteTask();
                    break;
                case 3:
                    controller.showTasks();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''

# The marker's keystrokes: build two tasks, prove the report and the delete,
# then prove that an id is never handed out twice.
P0071_RUN0 = ('1\nDev Program\n1\n26-06-2015\n9.5\n17.5\nDev\nLead\n'
              '1\nTest Program\n2\n28-08-2015\n8.0\n9.0\nTester\nLead\n'
              '3\n'
              '2\n2\n'
              '1\nDesign DB\n3\n01-09-2015\n13.0\n17.5\nArchitect\nLead\n'
              '3\n'
              '4\n')

# Every rule, one at a time, and the report at the end proving that not one of
# the rejected tasks reached the list.
P0071_RUN1 = ('3\n'
              '1\nNo Type\n9\n26-06-2015\n9.5\n17.5\nDev\nLead\n'
              '1\nNot A Number\nCode\n26-06-2015\n9.5\n17.5\nDev\nLead\n'
              '1\nFake Date\n1\n31-02-2003\n9.5\n17.5\nDev\nLead\n'
              '1\nSloppy Date\n1\n1-2-2015\n9.5\n17.5\nDev\nLead\n'
              '1\nOff Grid\n1\n26-06-2015\n9.7\n17.5\nDev\nLead\n'
              '1\nAfter Hours\n1\n26-06-2015\n9.5\n18.0\nDev\nLead\n'
              '1\nBackwards\n1\n26-06-2015\n17.5\n9.5\nDev\nLead\n'
              '1\n\n1\n26-06-2015\n9.5\n17.5\nDev\nLead\n'
              '2\n99\n'
              '2\nabc\n'
              '3\n'
              '4\n')

P0071_OUT0 = '''========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Task [1] has been added.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Task [2] has been added.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ----------------------------------------- Task ---------------------------------------
ID  Name                Task Type   Date          Time        Assignee    Reviewer
1   Dev Program         Code        26-06-2015    9.5-17.5    Dev         Lead
2   Test Program        Test        28-08-2015    8.0-9.0     Tester      Lead
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ---------Del Task------
ID:Task [2] has been deleted.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Task [3] has been added.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ----------------------------------------- Task ---------------------------------------
ID  Name                Task Type   Date          Time        Assignee    Reviewer
1   Dev Program         Code        26-06-2015    9.5-17.5    Dev         Lead
3   Design DB           Design      01-09-2015    13.0-17.5   Architect   Lead
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: Goodbye.'''
P0071_OUT1 = '''========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ----------------------------------------- Task ---------------------------------------
There is no task yet.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Task Type [9] does not exist. It must be 1 to 4.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Task Type must be a number.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Date must be a real date in the format dd-MM-yyyy.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Date must be a real date in the format dd-MM-yyyy.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Plan From must be a whole or half hour: 8.0, 8.5, 9.0 ... 17.5.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Plan To must be between 8.0 and 17.5.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Plan From must be less than Plan To.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ------------Add Task---------------
Requirement Name: Task Type: Date: From: To: Assignee: Reviewer: Requirement Name cannot be empty.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ---------Del Task------
ID:Task [99] does not exist.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ---------Del Task------
ID:ID must be a number.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: ----------------------------------------- Task ---------------------------------------
There is no task yet.
========= Task program =========
1. Add Task
2. Delete task
3. Display Task
4. exit
Please choose one option: Goodbye.'''


solution(
    'J1.S.P0071',
    title_vi='Chương trình quản lý công việc của dự án CCRM',
    files=[('src/entity/TaskType.java', P0071_TASK_TYPE),
           ('src/entity/Task.java', P0071_TASK),
           ('src/bo/TaskManager.java', P0071_BO),
           ('src/controller/TaskController.java', P0071_CONTROLLER),
           ('src/utils/Validator.java', P0071_VALIDATOR),
           ('src/ui/Main.java', P0071_MAIN)],
    main_class='ui.Main',
    runs=[(P0071_RUN0, P0071_OUT0), (P0071_RUN1, P0071_OUT1)],
    explain_en='''<p><strong>Why there is a controller here, and why there is no seventh file.</strong> The
measured shape of passing LAB211 projects says a <code>controller</code> appears once a project reaches
about seven files — and this exact assignment, TaskManagement, is one of the seven-file examples. The
file count is a symptom, though, not the cause. What actually forced the layer is that the Add screen is
<em>seven prompts</em>: with the delete screen and the report table beside it, those three blocks would
bury a nine-line menu loop under sixty lines of printing. So <code>Main</code> keeps the menu,
<code>TaskController</code> keeps the screens, <code>TaskManager</code> keeps the rules. What was
<em>not</em> done is inventing a <code>bo/TaskTypeList.java</code> to reach seven files. The type table
is four rows that never change, read through one loop; a class holding a constructor and a
<code>findById</code> would be a file added to hit a number, and an empty layer costs a mark rather than
earning one.</p>
<p><strong>The signature is a contract, and it is stranger than it looks.</strong> The Guidelines name
<code>public int addTask(String requirementName, String assignee, String reviewer, String taskTypeID,
String date, String planFrom, String planTo) throws Exception</code>. Every parameter is a
<code>String</code>, including the date and the two times. That is deliberate: the screen's job is to
collect seven lines of text, and <code>bo</code>'s job is to decide whether those seven lines describe a
task. Every parse therefore happens behind <code>throws Exception</code>, where failing means throwing
rather than printing.</p>
<p><strong>The trap that follows from it.</strong> The brief's Add screen asks in the order Requirement
Name, Task Type, Date, From, To, Assignee, Reviewer. The signature takes them in the order
requirementName, <em>assignee, reviewer</em>, taskTypeID, date, planFrom, planTo. The two orders are
different, and because all seven parameters are <code>String</code> the compiler cannot say a word if
you pass them straight through. A program that swaps the assignee with the task type compiles, runs, and
is wrong. The controller asks in screen order and passes in signature order, on purpose.</p>
<p><strong><code>SimpleDateFormat</code> is lenient by default, and lenient is a liar.</strong> The
brief says to use <code>SimpleDateFormat</code>. Out of the box it does not reject impossible dates — it
<em>rolls them over</em>. Run it and watch: <code>31-02-2003</code> comes back as <code>03-03-2003</code>,
and <code>32-13-2003</code> comes back as <code>01-02-2004</code>. Nothing is printed, nothing is
thrown; the user simply gets a task scheduled on a day they did not choose.
<code>format.setLenient(false)</code> turns both into a <code>ParseException</code>.</p>
<p><strong>And <code>setLenient(false)</code> is still not enough.</strong> This was measured, not
assumed. With leniency off, the same parser still accepts <code>"1-2-2015"</code> (the pattern says
<code>dd-MM</code>, the parser takes one digit) and still accepts
<code>"26-06-2015rubbish"</code> — <code>parse()</code> stops at the first character it cannot use and
never complains about the rest. The fix is one line: format the parsed date back and compare it with
what was typed. A string that survives the round trip unchanged is in the required format, and nothing
else is. The scripted run feeds <code>1-2-2015</code> in and the program answers <em>Date must be a real
date in the format dd-MM-yyyy.</em></p>
<p><strong>If you prefer <code>java.time</code>, the trap moves rather than disappearing.</strong>
<code>DateTimeFormatter</code> with the default <code>ResolverStyle.SMART</code> does not throw for
31 February either — it <em>clamps</em>, and <code>LocalDate.parse("31/02/2003", smart)</code> returns
<code>2003-02-28</code>. You need <code>ResolverStyle.STRICT</code>, and with STRICT the pattern letter
must be <code>uuuu</code> and not <code>yyyy</code>: <code>yyyy</code> is year-of-era, so a strict
resolver refuses to build a date without an era field and throws <em>Unable to obtain LocalDate from
TemporalAccessor: {YearOfEra=2016, DayOfMonth=26, MonthOfYear=6}</em> on a date that is perfectly
valid. Both of those were run before being written down.</p>
<p><strong>The half-hour grid.</strong> Plan times are 8.0, 8.5, 9.0 … 17.5, so a value is legal when it
is inside the range <em>and</em> lands on a half hour. The test is <code>value * 2</code> landing on a
whole number, not <code>value % 0.5 == 0</code>: the remainder of a double by 0.5 is not reliably zero,
and the comparison carries a tolerance for the same reason. 9.7 is rejected; so is 18.0, from the other
rule; so is From ≥ To.</p>
<p><strong>Ids, and the sentence in the brief that contradicts the brief.</strong> "ID = ID last task
+1" is the same thing as a counter right up to the moment you use the delete function the same sheet
asks for. Delete the newest task and "last task + 1" hands its id straight back to the next one, so two
different tasks answer to id 3 within one session. A counter that only goes up costs nothing and keeps
an id meaning one task forever. The first scripted run demonstrates it: add two, delete number 2, add a
third — and the third is <strong>id 3</strong>, printed in the report.</p>
<p><strong>Nothing half-added.</strong> <code>addTask</code> validates all seven fields before it
constructs anything. If the date is good and the times are not, the list is exactly as it was. The
second scripted run pushes eight different bad tasks at the program and then asks for the report: the
answer is <em>There is no task yet.</em> That line is the actual proof, and it is worth more than any of
the eight error messages above it.</p>
<p><strong>Where the brief disagrees with itself.</strong> Three places, and saying so at the defence
counts in your favour. (1) The menu picture lists the four options with no numbers at all, while the
specification says the user "selects an option" — so the numbers are printed and the wording, including
the lower-case <code>exit</code>, is copied exactly. (2) The Add screen enters <code>26-06-2015</code>
and the sample report row shows <code>28-08-2015</code> for what is meant to be the same task. (3) The
report's Time column shows a single value, <code>8.0</code>, although a task has both a Plan From and a
Plan To and the Add screen collected both; printing only one of them throws away half the data, so this
prints the window, <code>9.5-17.5</code>.</p>
<p><strong>How it was verified.</strong> Two scripted runs, diffed character for character. The first
builds two tasks with the brief's own data, prints the report, deletes a task, adds another and prints
again — proving the sort by id, the delete, and the non-reused id. The second walks every rule in turn:
type 9, type "Code", 31-02-2003, 1-2-2015, 9.7, 18.0, From > To, an empty name, delete 99, delete "abc"
— nine messages, then an empty report.</p>''',
    explain_vi='''<p><strong>Vì sao ở đây có <code>controller</code>, và vì sao không có tệp thứ bảy.</strong>
Hình dạng đo được từ các project LAB211 đã qua môn cho thấy <code>controller</code> xuất hiện khi
project chạm mốc khoảng bảy tệp — và chính bài này, TaskManagement, là một trong các ví dụ bảy tệp đó.
Nhưng số tệp là <em>triệu chứng</em>, không phải nguyên nhân. Thứ thật sự buộc phải tách tầng là màn hình
Add có <em>bảy dòng nhập</em>: cộng với màn hình xoá và bảng báo cáo, ba khối đó sẽ chôn vùi một vòng lặp
thực đơn chín dòng dưới sáu mươi dòng lệnh in. Nên <code>Main</code> giữ thực đơn,
<code>TaskController</code> giữ màn hình, <code>TaskManager</code> giữ luật. Điều <em>không</em> làm: bịa
ra <code>bo/TaskTypeList.java</code> cho đủ bảy tệp. Bảng loại công việc chỉ là bốn dòng không bao giờ
đổi, đọc qua một vòng lặp; một lớp chỉ có constructor và <code>findById</code> là tệp thêm vào để chạm
một con số, mà một tầng rỗng thì làm mất điểm chứ không kiếm được điểm.</p>
<p><strong>Chữ ký phương thức là bản hợp đồng, và nó lạ hơn bạn tưởng.</strong> Phần Hướng dẫn ghi rõ
<code>public int addTask(String requirementName, String assignee, String reviewer, String taskTypeID,
String date, String planFrom, String planTo) throws Exception</code>. Mọi tham số đều là
<code>String</code>, kể cả ngày và hai mốc giờ. Đó là chủ ý: việc của tầng màn hình là thu bảy dòng chữ,
còn việc của <code>bo</code> là quyết định bảy dòng chữ đó có mô tả một công việc hợp lệ hay không. Mọi
phép phân tích vì thế nằm sau <code>throws Exception</code>, nơi thất bại nghĩa là ném ngoại lệ chứ
không phải in ra màn hình.</p>
<p><strong>Cái bẫy đi kèm.</strong> Màn hình Add trong đề hỏi theo thứ tự Requirement Name, Task Type,
Date, From, To, Assignee, Reviewer. Chữ ký lại nhận theo thứ tự requirementName, <em>assignee,
reviewer</em>, taskTypeID, date, planFrom, planTo. Hai thứ tự khác nhau, và vì cả bảy tham số đều là
<code>String</code> nên trình biên dịch không hé một lời nếu bạn truyền thẳng. Một chương trình đổi chỗ
người thực hiện với loại công việc vẫn biên dịch, vẫn chạy, và vẫn sai. Controller ở đây hỏi theo thứ tự
màn hình và truyền theo thứ tự chữ ký, một cách có chủ ý.</p>
<p><strong><code>SimpleDateFormat</code> mặc định là LENIENT, mà lenient nghĩa là nói dối.</strong> Đề
yêu cầu dùng <code>SimpleDateFormat</code>. Mặc định nó không từ chối ngày không tồn tại — nó
<em>cộng dồn</em>. Chạy thử mà xem: <code>31-02-2003</code> trả về <code>03-03-2003</code>, còn
<code>32-13-2003</code> trả về <code>01-02-2004</code>. Không in gì, không ném gì; người dùng chỉ đơn
giản nhận một công việc xếp vào ngày họ không hề chọn. <code>format.setLenient(false)</code> biến cả hai
thành <code>ParseException</code>.</p>
<p><strong>Và <code>setLenient(false)</code> vẫn chưa đủ.</strong> Điều này được đo, không phải đoán. Đã
tắt lenient rồi, cũng chính bộ phân tích đó vẫn nhận <code>"1-2-2015"</code> (mẫu ghi <code>dd-MM</code>
nhưng bộ phân tích chấp nhận một chữ số) và vẫn nhận <code>"26-06-2015rubbish"</code> —
<code>parse()</code> dừng ở ký tự đầu tiên nó không dùng được và không hề phàn nàn về phần còn lại. Cách
sửa gọn một dòng: định dạng ngược ngày vừa phân tích rồi so với chuỗi người dùng gõ. Chuỗi nào đi trọn
vòng mà không đổi thì mới đúng định dạng yêu cầu. Lần chạy kiểm đưa <code>1-2-2015</code> vào và chương
trình trả lời <em>Date must be a real date in the format dd-MM-yyyy.</em></p>
<p><strong>Nếu bạn thích <code>java.time</code> hơn thì cái bẫy chỉ dời chỗ chứ không biến mất.</strong>
<code>DateTimeFormatter</code> với <code>ResolverStyle.SMART</code> mặc định cũng KHÔNG ném lỗi cho ngày
31 tháng 2 — nó <em>kẹp lại</em>, và <code>LocalDate.parse("31/02/2003", smart)</code> trả về
<code>2003-02-28</code>. Bạn cần <code>ResolverStyle.STRICT</code>, và với STRICT thì chữ mẫu phải là
<code>uuuu</code> chứ không phải <code>yyyy</code>: <code>yyyy</code> là năm-theo-kỷ-nguyên, nên bộ giải
nghiêm ngặt từ chối dựng ngày khi thiếu trường era và ném ra <em>Unable to obtain LocalDate from
TemporalAccessor: {YearOfEra=2016, DayOfMonth=26, MonthOfYear=6}</em> ngay trên một ngày hoàn toàn hợp
lệ. Cả hai điều này đều đã chạy thật trước khi được viết ra đây.</p>
<p><strong>Lưới nửa giờ.</strong> Mốc giờ là 8.0, 8.5, 9.0 … 17.5, nên một giá trị hợp lệ khi nó nằm
trong khoảng <em>và</em> rơi đúng vào nửa giờ. Phép kiểm là <code>value * 2</code> rơi vào số nguyên,
không phải <code>value % 0.5 == 0</code>: phần dư của một <code>double</code> chia 0.5 không chắc chắn
bằng 0, và phép so sánh cũng mang theo một sai số cho phép vì cùng lý do. 9.7 bị loại; 18.0 cũng bị loại
theo luật khoảng; From ≥ To cũng vậy.</p>
<p><strong>ID, và câu trong đề tự mâu thuẫn với chính đề.</strong> "ID = ID last task +1" đúng bằng một
bộ đếm — cho tới đúng khoảnh khắc bạn dùng chức năng xoá mà cũng chính tờ đề này yêu cầu. Xoá công việc
mới nhất rồi thì "last task + 1" trả lại id đó cho công việc kế tiếp, thành ra hai công việc khác nhau
cùng mang id 3 trong một phiên. Một bộ đếm chỉ tăng thì không tốn gì và giữ cho một id mãi mãi chỉ một
công việc. Lần chạy kiểm thứ nhất trình bày đúng điều đó: thêm hai, xoá số 2, thêm cái thứ ba — và cái
thứ ba mang <strong>id 3</strong>, in ngay trên báo cáo.</p>
<p><strong>Không có gì bị thêm dở dang.</strong> <code>addTask</code> kiểm đủ bảy trường trước khi dựng
bất cứ thứ gì. Ngày đúng mà giờ sai thì danh sách vẫn y nguyên như trước. Lần chạy kiểm thứ hai đẩy tám
công việc hỏng vào chương trình rồi mới xin báo cáo: câu trả lời là <em>There is no task yet.</em> Dòng
đó mới là bằng chứng thật, và nó đáng giá hơn cả tám thông báo lỗi phía trên.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Ba chỗ, và nói ra khi bảo vệ thì được cộng điểm. (1) Hình thực
đơn liệt kê bốn lựa chọn mà không đánh số, trong khi phần đặc tả bảo người dùng "chọn một lựa chọn" —
nên ở đây có đánh số, còn chữ nghĩa thì chép nguyên, kể cả chữ <code>exit</code> viết thường. (2) Màn
hình Add nhập <code>26-06-2015</code> nhưng dòng báo cáo mẫu lại hiện <code>28-08-2015</code> cho cùng
một công việc. (3) Cột Time trong báo cáo chỉ hiện một giá trị, <code>8.0</code>, dù một công việc có cả
Plan From lẫn Plan To và màn hình Add đã thu cả hai; in một nửa là vứt đi một nửa dữ liệu, nên ở đây in
cả khoảng: <code>9.5-17.5</code>.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy theo kịch bản, so từng ký tự. Lần đầu dựng hai
công việc bằng chính dữ liệu của đề, in báo cáo, xoá một công việc, thêm một cái nữa rồi in lại — chứng
minh sắp xếp theo id, chứng minh xoá, và chứng minh id không bị dùng lại. Lần hai đi qua từng luật: loại
9, loại "Code", 31-02-2003, 1-2-2015, 9.7, 18.0, From > To, tên rỗng, xoá 99, xoá "abc" — chín thông
báo, rồi một báo cáo rỗng.</p>''',
    hints_en=[
        'addTask takes seven Strings and throws — every parse belongs in bo, not in the screen.',
        'The Add screen asks in a different order from the signature; passing straight through swaps assignee with the task type and still compiles.',
        'SimpleDateFormat is lenient by default: 31-02-2003 becomes 03-03-2003. Call setLenient(false).',
        'Even then it accepts "1-2-2015" and trailing rubbish — format the parsed date back and compare it with what was typed.',
        'Test the half-hour grid with value * 2 landing on a whole number, and check From < To separately.',
        'Validate all seven fields BEFORE constructing the Task, so a rejected task leaves the list untouched.',
    ],
    hints_vi=[
        'addTask nhận bảy String và ném ngoại lệ — mọi phép phân tích thuộc về bo, không thuộc tầng màn hình.',
        'Màn hình Add hỏi theo thứ tự khác chữ ký; truyền thẳng là đổi chỗ assignee với loại công việc mà vẫn biên dịch được.',
        'SimpleDateFormat mặc định lenient: 31-02-2003 thành 03-03-2003. Phải gọi setLenient(false).',
        'Kể cả vậy nó vẫn nhận "1-2-2015" và phần rác phía sau — hãy định dạng ngược rồi so với chuỗi đã gõ.',
        'Kiểm lưới nửa giờ bằng value * 2 rơi vào số nguyên, và kiểm From < To riêng.',
        'Kiểm đủ bảy trường TRƯỚC khi dựng Task, để một công việc bị loại không đụng gì tới danh sách.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0072 — Login with MD5-encrypted passwords (150 LOC)
# ════════════════════════════════════════════════════════════════

P0072_ACCOUNT = '''package entity;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * One account.
 *
 * The field is called `password` because the brief calls it that, and it holds
 * the MD5 digest, never the characters the user typed. That is the single most
 * important line in this program: the plain password exists for the length of
 * one method call and is then gone. Storing it "just for now" is how real
 * breaches turn into other sites' breaches, because people reuse passwords.
 */
public class Account implements Serializable {

    private static final long serialVersionUID = 1L;

    public static final String DOB_PATTERN = "dd/MM/yyyy";

    private int id;
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String address;
    private Date dob;

    public Account() {
    }

    public Account(int id, String username, String password, String name,
            String phone, String email, String address, Date dob) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.dob = dob;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getFormattedDob() {
        return new SimpleDateFormat(DOB_PATTERN).format(dob);
    }

    /**
     * The digest is NOT in toString().
     *
     * A hash is not a secret, but it is not public either - an MD5 of a common
     * password is one lookup away from the password itself. Anything that ends
     * up in a log line, a stack trace or a debug print should not carry it.
     */
    @Override
    public String toString() {
        return id + " - " + username + " (" + name + ") " + phone + " " + email;
    }
}
'''

P0072_MD5 = r'''package utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5, as the brief requires - and the one place in the program that knows how
 * to turn a digest into text.
 *
 * READ THIS BEFORE COPYING IT ANYWHERE REAL. MD5 is the wrong function for
 * passwords, for three separate reasons, none of which is about "MD5 being
 * broken" in the collision sense you may have heard about:
 *
 *  - It is FAST. A commodity GPU computes billions of MD5s per second. Speed
 *    is a virtue in a checksum and a defect in a password hash, because the
 *    attacker's work per guess is exactly the defender's work per login.
 *  - It is UNSALTED here. Two users who both choose "123456" get byte-for-byte
 *    identical rows, so one glance at the table tells an attacker which
 *    accounts to attack together.
 *  - Because of the two above, precomputed rainbow tables for every common
 *    password already exist and are free. MD5("123456") is
 *    e10adc3949ba59abbe56e057f20f883e, and typing that into a search engine
 *    returns the password.
 *
 * What production uses instead: bcrypt, scrypt or Argon2 - each of them
 * deliberately slow, each of them salted per user, each with a cost factor you
 * raise as hardware gets faster. The assignment says MD5, so this does MD5;
 * knowing why it is wrong is the part worth carrying out of the exercise.
 */
public class MD5 {

    private MD5() {
    }

    /**
     * The hex digest, lower case, 32 characters.
     *
     * THE TRAP: MessageDigest.digest() returns a byte[], and `new String(bytes)`
     * does not convert it - it DECODES it, as if those 16 arbitrary bytes were
     * text in the platform charset. Most of them are not valid UTF-8, so they
     * are replaced by U+FFFD and the information is destroyed. Measured on this
     * JDK for the digest of "nghia": the 16-byte digest becomes a 13-character
     * String, and turning that String back into bytes gives 26 bytes that no
     * longer match. Two different passwords can decode to the same mush, so the
     * stored "hash" both fails to round-trip and stops being unique.
     *
     * %02x is the whole fix: two hex digits per byte, zero-padded. Without the
     * 0 and the 2, a byte like 0x07 prints as "7" and the digest silently
     * becomes 31 characters.
     */
    public static String hash(String text) {
        try {
            MessageDigest digester = MessageDigest.getInstance("MD5");
            // getBytes(UTF_8), not getBytes(). The no-argument version uses the
            // platform default charset, so the same password would hash to a
            // different value on a machine with a different default - and every
            // account created on one machine would fail to log in on the other.
            byte[] digest = digester.digest(text.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            // Every Java platform is required to provide MD5, so this cannot
            // happen. It is rethrown unchecked rather than swallowed: returning
            // the plain password here "so it keeps working" would be a silent
            // downgrade to storing passwords in clear text.
            throw new IllegalStateException("MD5 is required of every Java platform.", e);
        }
    }
}
'''

P0072_BO = r'''package bo;

import entity.Account;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;
import utils.MD5;

/**
 * The account list and every rule about it. It never prints.
 */
public class AccountManager {

    /**
     * 10 or 11 digits and nothing else.
     *
     * \d rather than [0-9] would also match Arabic-Indic and other Unicode
     * digits in some regex flavours; in Java \d is ASCII-only by default, which
     * is what a phone number wants. The anchors matter more: without ^ and $,
     * "abc0988666888xyz" contains a match and would pass.
     */
    private static final Pattern PHONE = Pattern.compile("^\\d{10,11}$");

    /**
     * A deliberately modest email check.
     *
     * The full RFC 5322 grammar is not something to hand-write, and a regex
     * that tries usually rejects addresses that are perfectly legal. This one
     * asks for the shape the brief's own example has (nghianv@t.com): some
     * local part, an @, a domain, a dot, and a two-letter-or-longer suffix.
     * The only real test of an address is sending mail to it.
     */
    private static final Pattern EMAIL =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final List<Account> accounts = new ArrayList<>();

    private int nextId = 1;

    /**
     * Required signature:
     * public int addAccount(String username, String password, String name,
     *         String phone, String email, String address, String dob) throws Exception
     *
     * Returns the new id. Everything is checked before anything is stored, and
     * the password is hashed on the last line before construction - there is no
     * point in the program where a plain password is held in a field.
     */
    public int addAccount(String username, String password, String name, String phone,
            String email, String address, String dob) throws Exception {
        String user = required(username, "Username cannot be empty.");
        Account clash = findByUsername(user);
        if (clash != null) {
            // The STORED spelling, not what was just typed. Telling someone who
            // typed "nghianv" that "nghianv already exists" when the account is
            // called NghiaNV hides the case-insensitive rule at the exact moment
            // they needed to know about it.
            throw new Exception("Username [" + clash.getUsername() + "] already exists.");
        }
        String secret = required(password, "Password cannot be empty.");
        String fullName = required(name, "Name cannot be empty.");

        String phoneNumber = required(phone, "Phone number cannot be empty.");
        if (!PHONE.matcher(phoneNumber).matches()) {
            throw new Exception("Phone number must be 10 or 11 number.");
        }
        String mail = required(email, "Email cannot be empty.");
        if (!EMAIL.matcher(mail).matches()) {
            throw new Exception("Email is not in the correct format.");
        }
        Date birthday = parseDob(dob);

        int id = nextId;
        accounts.add(new Account(id, user, MD5.hash(secret), fullName, phoneNumber,
                mail, address == null ? "" : address.trim(), birthday));
        nextId++;
        return id;
    }

    /**
     * Required signature: public Boolean login(String username, String password)
     *
     * The brief asks for the wrapper Boolean rather than boolean, so that is
     * what it returns - but note what the wrapper buys: nothing, and it costs
     * the possibility of null. `if (manager.login(u, p))` on a null Boolean
     * throws NullPointerException at the unboxing, which is why this method has
     * exactly one kind of answer and never returns null. If the signature were
     * yours to choose, it would be `boolean`.
     *
     * It also does not throw. "Wrong password" is not an exceptional condition;
     * it is one of the two normal answers to the question being asked.
     */
    public Boolean login(String username, String password) {
        if (username == null || password == null) {
            return false;
        }
        Account account = findByUsername(username.trim());
        if (account == null) {
            return false;
        }
        // Hash the attempt and compare digests. The stored digest is never
        // turned back into a password - that is the point of a hash, and it is
        // why "forgot password" resets rather than reminds.
        return account.getPassword().equals(MD5.hash(password));
    }

    /**
     * Usernames are matched without regard to case.
     *
     * That is a decision, not an accident: it means NghiaNV and nghianv cannot
     * both be registered, and that someone who typed their name in lower case
     * can still log in. Passwords are compared case-SENSITIVELY, because a
     * password is a secret and folding its case throws away entropy. The
     * greeting uses the stored spelling, not what was typed.
     */
    public Account findByUsername(String username) {
        if (username == null) {
            return null;
        }
        for (Account account : accounts) {
            if (account.getUsername().equalsIgnoreCase(username.trim())) {
                return account;
            }
        }
        return null;
    }

    /**
     * The change-password flow the brief's expected screen shows.
     *
     * It is not in the Guidelines - which name only addAccount and login - but
     * it is on the screen, complete with three prompts, so it is implemented.
     * The old password is verified through login() rather than by a second
     * comparison written here: one place that knows how a password is checked.
     */
    public void changePassword(String username, String oldPassword,
            String newPassword, String renewPassword) throws Exception {
        Account account = findByUsername(username);
        if (account == null) {
            throw new Exception("Account does not exist.");
        }
        if (!login(username, oldPassword)) {
            throw new Exception("Old password is not correct.");
        }
        String fresh = required(newPassword, "New password cannot be empty.");
        if (!fresh.equals(renewPassword == null ? null : renewPassword.trim())) {
            throw new Exception("The two new passwords do not match.");
        }
        account.setPassword(MD5.hash(fresh));
    }

    public List<Account> getAccounts() {
        return new ArrayList<>(accounts);
    }

    // ── validation ───────────────────────────────────────────────

    private static String required(String text, String message) throws Exception {
        if (text == null || text.trim().isEmpty()) {
            throw new Exception(message);
        }
        return text.trim();
    }

    /**
     * A real dd/MM/yyyy date of birth.
     *
     * SimpleDateFormat is LENIENT by default: 31/02/2003 is not rejected, it
     * rolls forward and becomes 03/03/2003, and the user is quietly given a
     * birthday they did not enter. setLenient(false) makes it a ParseException.
     *
     * Even then the parser accepts "1/2/2015" and ignores anything trailing, so
     * the parsed date is formatted back and compared with what was typed. Only
     * a string that survives the round trip unchanged is in the required
     * format.
     */
    private static Date parseDob(String dob) throws Exception {
        String value = required(dob, "Date of birth cannot be empty.");
        SimpleDateFormat format = new SimpleDateFormat(Account.DOB_PATTERN);
        format.setLenient(false);
        Date parsed;
        try {
            parsed = format.parse(value);
        } catch (ParseException e) {
            throw new Exception("Date of birth must be a real date in the format dd/MM/yyyy.");
        }
        if (!format.format(parsed).equals(value)) {
            throw new Exception("Date of birth must be a real date in the format dd/MM/yyyy.");
        }
        return parsed;
    }
}
'''

P0072_VALIDATOR = '''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, in one place.
 *
 * The password prompts read through here like everything else. A real program
 * would use System.console().readPassword(), which does not echo and returns a
 * char[] you can wipe; it returns null when stdin is a pipe, which is why a
 * marked console exercise cannot use it. Worth saying out loud at the defence.
 */
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

P0072_CONTROLLER = '''package controller;

import bo.AccountManager;
import entity.Account;
import utils.Validator;

/**
 * Collects what the user types, calls the bo layer, reports what came back.
 *
 * Two menu options, but three screens - Add User is seven prompts, and Login
 * runs on into the welcome screen and the three-prompt password change. Left
 * in Main those blocks would be seventy lines around a five-line menu.
 *
 * The prompt strings are copied from the brief character for character,
 * including the two inconsistencies a tidy programmer would iron out and a
 * marker diffing the screen would count: Add User has no space after its
 * colons ("Account:NghiaNV") while Login has one ("Account: NghiaNV"), and the
 * welcome banner is spelled "Wellcome".
 */
public class AccountController {

    private final AccountManager manager = new AccountManager();

    public void addAccount() {
        System.out.println("---------- Add User --------");
        String username = Validator.getString("Account:");
        String password = Validator.getString("Password:");
        String name = Validator.getString("Name:");
        String phone = Validator.getString("Phone:");
        String email = Validator.getString("Email:");
        String address = Validator.getString("Address:");
        String dob = Validator.getString("DOB:");
        try {
            int id = manager.addAccount(username, password, name, phone, email, address, dob);
            System.out.println("Account [" + username + "] has been added with id " + id + ".");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public void login() {
        System.out.println("------------- Login ----------------");
        String username = Validator.getString("Account: ");
        String password = Validator.getString("Password: ");

        if (!manager.login(username, password)) {
            // One message for "no such user" and for "wrong password", on
            // purpose. Two different messages tell an attacker which usernames
            // are real, which is half of the work of breaking in.
            System.out.println("Login fail.");
            return;
        }

        Account account = manager.findByUsername(username);
        System.out.println("------------ Wellcome -----------");
        System.out.println("Hello " + account.getUsername());
        String answer = Validator.getString(
                "Hi " + account.getName() + ", do you want change password now? Y/N:");
        if (!"Y".equalsIgnoreCase(answer)) {
            return;
        }
        changePassword(account.getUsername());
    }

    private void changePassword(String username) {
        String oldPassword = Validator.getString("Old password:");
        String newPassword = Validator.getString("new password:");
        String renewPassword = Validator.getString("renew password:");
        try {
            manager.changePassword(username, oldPassword, newPassword, renewPassword);
            System.out.println("Password has been changed.");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''

P0072_MAIN = '''package ui;

import controller.AccountController;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * "3) Exit" and "Please choice one option:" are the brief's own wording,
 * inconsistent bracket and all. They are copied rather than corrected: a
 * marker diffing this screen against the sheet is looking for the sheet.
 */
public class Main {

    public static void main(String[] args) {
        AccountController controller = new AccountController();

        boolean running = true;
        while (running) {
            System.out.println("============ Login Program =========");
            System.out.println("1. Add User");
            System.out.println("2. Login");
            System.out.println("3) Exit");

            switch (Validator.getInt("Please choice one option:", 1, 3)) {
                case 1:
                    controller.addAccount();
                    break;
                case 2:
                    controller.login();
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }
}
'''

# The brief's own sample account, then a correct login, then a wrong one.
P0072_RUN0 = ('1\nNghiaNV\nnghia\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '2\nNghiaNV\nnghia\nN\n'
              '2\nNghiaNV\nNghia\n'
              '2\nnghianv\nnghia\nN\n'
              '3\n')

# Every rule, one at a time; then a password change and a login with the old
# password (which must now fail) and the new one (which must now work).
P0072_RUN1 = ('1\n\nnghia\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '1\nNghiaNV\n\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '1\nNghiaNV\nnghia\nSkyLine\n098866688\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '1\nNghiaNV\nnghia\nSkyLine\n0988a66888\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '1\nNghiaNV\nnghia\nSkyLine\n0988666888\nnghianv.t.com\nHa Noi\n26/06/2016\n'
              '1\nNghiaNV\nnghia\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n31/02/2003\n'
              '1\nNghiaNV\nnghia\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n1/2/2015\n'
              '1\nNghiaNV\nnghia\nSkyLine\n0988666888\nnghianv@t.com\nHa Noi\n26/06/2016\n'
              '1\nnghianv\nother\nCopycat\n0912345678\nother@t.com\nHue\n01/01/2000\n'
              '2\nGhost\nnghia\n'
              '2\nNghiaNV\nnghia\nY\nwrong\nabc\nabc\n'
              '2\nNghiaNV\nnghia\nY\nnghia\nabc\nabd\n'
              '2\nNghiaNV\nnghia\nY\nnghia\nnghia2\nnghia2\n'
              '2\nNghiaNV\nnghia\n'
              '2\nNghiaNV\nnghia2\nN\n'
              '3\n')

P0072_OUT0 = '''============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Account [NghiaNV] has been added with id 1.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: Login fail.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:Goodbye.'''
P0072_OUT1 = '''============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Username cannot be empty.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Password cannot be empty.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Phone number must be 10 or 11 number.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Phone number must be 10 or 11 number.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Email is not in the correct format.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Date of birth must be a real date in the format dd/MM/yyyy.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Date of birth must be a real date in the format dd/MM/yyyy.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Account [NghiaNV] has been added with id 1.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:---------- Add User --------
Account:Password:Name:Phone:Email:Address:DOB:Username [NghiaNV] already exists.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: Login fail.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:Old password:new password:renew password:Old password is not correct.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:Old password:new password:renew password:The two new passwords do not match.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:Old password:new password:renew password:Password has been changed.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: Login fail.
============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:------------- Login ----------------
Account: Password: ------------ Wellcome -----------
Hello NghiaNV
Hi SkyLine, do you want change password now? Y/N:============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:Goodbye.'''


solution(
    'J1.S.P0072',
    title_vi='Chức năng đăng nhập mã hoá mật khẩu bằng MD5',
    files=[('src/entity/Account.java', P0072_ACCOUNT),
           ('src/bo/AccountManager.java', P0072_BO),
           ('src/controller/AccountController.java', P0072_CONTROLLER),
           ('src/utils/MD5.java', P0072_MD5),
           ('src/utils/Validator.java', P0072_VALIDATOR),
           ('src/ui/Main.java', P0072_MAIN)],
    main_class='ui.Main',
    runs=[(P0072_RUN0, P0072_OUT0), (P0072_RUN1, P0072_OUT1)],
    explain_en='''<p><strong>Say this out loud before anything else: MD5 is the wrong function for
passwords, and this program uses it because the assignment says to.</strong> Three separate reasons, and
none of them is the collision result you may have heard about. <em>It is fast.</em> A commodity GPU
computes billions of MD5s per second, and speed is a virtue in a checksum and a defect in a password
hash, because the attacker's cost per guess is exactly the defender's cost per login. <em>It is
unsalted here.</em> Two users who both choose <code>123456</code> get byte-for-byte identical rows, so
one glance at the table tells an attacker which accounts to break together. <em>And therefore the
tables already exist.</em> <code>MD5("123456")</code> is
<code>e10adc3949ba59abbe56e057f20f883e</code> — paste that into a search engine and it hands back the
password. What production uses instead is <strong>bcrypt, scrypt or Argon2</strong>: salted per user,
deliberately slow, with a cost factor you raise as hardware gets faster. Do the assignment as asked;
knowing exactly why it is wrong is the part worth carrying out of it.</p>
<p><strong>The bug that eats the digest.</strong> <code>MessageDigest.digest()</code> returns a
<code>byte[]</code>, and <code>new String(bytes)</code> does not convert it — it <em>decodes</em> it, as
if those 16 arbitrary bytes were text in the platform charset. They are mostly not valid UTF-8, so they
are replaced by U+FFFD and the information is gone. Measured, not guessed: for the digest of
<code>"nghia"</code> the 16-byte array becomes a <strong>13-character</strong> String, and calling
<code>getBytes()</code> on that String gives <strong>26 bytes</strong> that no longer equal the original
digest. Two different passwords can decode to the same mush. The fix is hex formatting —
<code>String.format("%02x", b)</code> per byte, which for <code>"nghia"</code> gives the real answer,
<code>9e87373408a6cd425ae9b19bf870d893</code>. The <code>0</code> and the <code>2</code> in
<code>%02x</code> are load-bearing: without them a byte like <code>0x07</code> prints as
<code>"7"</code> and the digest quietly becomes 31 characters.</p>
<p><strong>One more charset detail.</strong> <code>text.getBytes(StandardCharsets.UTF_8)</code>, never
the no-argument <code>getBytes()</code>. The no-argument version uses whatever the platform default
charset is, so the same password hashes to a different value on a machine configured differently — and
every account created on one machine fails to log in on the other, with no error anywhere to explain
it.</p>
<p><strong>Layers.</strong> Six files. <code>MD5</code> is its own class in <code>utils</code> because
it is the one piece here with a right answer independent of the program: it can be checked against any
other MD5 implementation, and hashing must happen in exactly one place or the login comparison will
eventually be written differently from the storage. <code>AccountManager</code> holds the list and the
rules and never prints. <code>AccountController</code> exists because two menu options turn into
<em>three</em> screens — Add User is seven prompts, and Login runs on into the welcome screen and a
three-prompt password change; left in <code>Main</code> that is seventy lines around a five-line
menu.</p>
<p><strong>Why <code>login</code> returns <code>Boolean</code> and why that is a bad idea.</strong> The
Guidelines say <code>public Boolean login(String username, String password)</code>, so that is the
signature. But notice what the wrapper buys: nothing, and it costs the possibility of
<code>null</code>. <code>if (manager.login(u, p))</code> on a null <code>Boolean</code> throws
<code>NullPointerException</code> at the unboxing — a crash on the happy path of the calling code. This
implementation therefore never returns null, and if the signature were yours to choose it would be
<code>boolean</code>. Say that at the defence.</p>
<p><strong><code>login</code> does not throw, and the two failures share a message.</strong> A wrong
password is not an exceptional condition; it is one of the two normal answers to the question being
asked, so it is a return value. And "no such user" and "wrong password" both print
<code>Login fail.</code> on purpose: two different messages tell an attacker which usernames are real,
which is half the work of breaking in.</p>
<p><strong>The date of birth carries the same lenient trap as every dated LAB211 sheet.</strong>
<code>SimpleDateFormat("dd/MM/yyyy")</code> is lenient by default, so <code>31/02/2003</code> is not
rejected — it rolls forward to <code>03/03/2003</code> and the user is handed a birthday they never
typed. <code>setLenient(false)</code> fixes that, and it is <em>still</em> not enough: the parser
accepts <code>1/2/2015</code> and ignores trailing rubbish. So the parsed date is formatted back and
compared with the input, and only an unchanged round trip is accepted. Both cases are in the second
scripted run. (If you use <code>java.time</code> instead, the default <code>ResolverStyle.SMART</code>
does not throw for 31 February either — it clamps to the 28th; you need <code>STRICT</code> plus the
pattern letter <code>uuuu</code>, because <code>yyyy</code> is year-of-era and a strict resolver refuses
to build a date without an era.)</p>
<p><strong>The other two checks.</strong> The phone pattern is <code>^\\d{10,11}$</code> — the anchors
matter more than the digits, because without <code>^</code> and <code>$</code> the string
<code>abc0988666888xyz</code> <em>contains</em> a match and passes. The email pattern is deliberately
modest: RFC 5322 is not a grammar to hand-write, and regexes that try usually reject addresses that are
perfectly legal, so this one asks for the shape of the brief's own example
(<code>nghianv@t.com</code>) and no more. The only real test of an address is sending mail to it.</p>
<p><strong>A decision worth defending: usernames are case-insensitive, passwords are not.</strong>
<code>NghiaNV</code> and <code>nghianv</code> cannot both be registered, and someone who typed their
name in lower case can still log in — both scripted runs prove it. Folding a password's case, by
contrast, would throw away entropy for no benefit. The duplicate message quotes the <em>stored</em>
spelling, not what was typed, so the rule is visible at the moment it bites.</p>
<p><strong>Where the brief disagrees with itself.</strong> The Program Specification says the greeting
is "Hello + Username", the expected screen shows <code>Hi SkyLine</code> — which is the <em>Name</em>,
not the username. Both are honoured: <code>Hello NghiaNV</code> on its own line, then the screen's
<code>Hi SkyLine, do you want change password now? Y/N:</code>. Two more: the change-password flow
appears on the screen (<em>Old password: / new password: / renew password:</em>) but is in neither the
Specification nor the Guidelines, which name only <code>addAccount</code> and <code>login</code> — it is
implemented, because a marker who is diffing the screen will press Y. And the prompt punctuation is
inconsistent between the two screens (<code>Account:NghiaNV</code> on Add User,
<code>Account: NghiaNV</code> on Login) and the banner is spelled <code>Wellcome</code>; all of it is
copied character for character rather than tidied.</p>
<p><strong>How it was verified.</strong> Two scripted runs, diffed character for character. The first
creates the brief's own account, logs in correctly, logs in with <code>Nghia</code> instead of
<code>nghia</code> (rejected — the digest comparison is case-sensitive), and logs in as
<code>nghianv</code> (accepted, and greeted as <code>NghiaNV</code>). The second walks every validation
rule, then changes the password and immediately proves the change round-tripped through MD5: the old
password now prints <code>Login fail.</code> and the new one is greeted. That is the strongest available
evidence that the hashing is real in both directions — nothing anywhere stores or compares the plain
text.</p>''',
    explain_vi='''<p><strong>Nói thẳng điều này trước đã: MD5 là hàm SAI để băm mật khẩu, và chương trình
này dùng nó chỉ vì đề bắt dùng.</strong> Ba lý do tách bạch, và không lý do nào là chuyện đụng độ
(collision) mà bạn hay nghe. <em>Nó nhanh.</em> Một GPU phổ thông tính hàng tỉ MD5 mỗi giây, mà nhanh là
ưu điểm của một checksum và là khuyết điểm của một hàm băm mật khẩu, bởi chi phí mỗi lần đoán của kẻ tấn
công đúng bằng chi phí mỗi lần đăng nhập của người phòng thủ. <em>Ở đây nó không có muối (salt).</em> Hai
người cùng chọn <code>123456</code> sẽ có hai dòng giống nhau từng byte, nên nhìn bảng một cái là biết
nên đánh chung những tài khoản nào. <em>Và vì thế các bảng tra sẵn đã tồn tại.</em>
<code>MD5("123456")</code> là <code>e10adc3949ba59abbe56e057f20f883e</code> — dán chuỗi đó vào công cụ
tìm kiếm là ra lại mật khẩu. Thứ mà hệ thống thật dùng là <strong>bcrypt, scrypt hoặc Argon2</strong>:
có muối riêng từng người, cố ý chậm, kèm hệ số chi phí mà bạn nâng dần theo phần cứng. Cứ làm đúng đề;
biết rõ vì sao nó sai mới là thứ đáng mang theo.</p>
<p><strong>Cái lỗi ăn mất bản băm.</strong> <code>MessageDigest.digest()</code> trả về
<code>byte[]</code>, và <code>new String(bytes)</code> KHÔNG chuyển đổi — nó <em>giải mã</em>, cứ như 16
byte tuỳ ý ấy là văn bản theo bảng mã mặc định của máy. Phần lớn chúng không phải UTF-8 hợp lệ nên bị
thay bằng U+FFFD, và thông tin mất luôn. Đây là số đo, không phải phỏng đoán: với bản băm của
<code>"nghia"</code>, mảng 16 byte trở thành một String <strong>13 ký tự</strong>, và gọi
<code>getBytes()</code> trên String đó cho ra <strong>26 byte</strong> không còn bằng bản băm ban đầu.
Hai mật khẩu khác nhau có thể giải mã ra cùng một đống bầy nhầy. Cách sửa là định dạng hệ mười sáu —
<code>String.format("%02x", b)</code> cho từng byte, với <code>"nghia"</code> cho ra đáp án thật là
<code>9e87373408a6cd425ae9b19bf870d893</code>. Con <code>0</code> và con <code>2</code> trong
<code>%02x</code> là phần chịu lực: thiếu chúng thì một byte như <code>0x07</code> in ra thành
<code>"7"</code> và bản băm lặng lẽ còn 31 ký tự.</p>
<p><strong>Một chi tiết bảng mã nữa.</strong> Phải là
<code>text.getBytes(StandardCharsets.UTF_8)</code>, đừng bao giờ dùng <code>getBytes()</code> không tham
số. Bản không tham số lấy bảng mã mặc định của máy, nên cùng một mật khẩu lại băm ra giá trị khác trên
máy cấu hình khác — và mọi tài khoản tạo ở máy này sẽ không đăng nhập được ở máy kia, không có thông báo
lỗi nào giải thích.</p>
<p><strong>Các tầng.</strong> Sáu tệp. <code>MD5</code> đứng riêng trong <code>utils</code> vì nó là phần
duy nhất ở đây có đáp án đúng độc lập với chương trình: có thể đối chiếu với bất kỳ cài đặt MD5 nào
khác, và việc băm phải xảy ra ở đúng một chỗ, nếu không thì sớm muộn chỗ so sánh lúc đăng nhập sẽ được
viết khác chỗ lưu. <code>AccountManager</code> giữ danh sách và luật, không in gì.
<code>AccountController</code> tồn tại vì hai lựa chọn thực đơn nở ra thành <em>ba</em> màn hình — Add
User là bảy dòng nhập, còn Login chạy tiếp sang màn hình chào và ba dòng đổi mật khẩu; để trong
<code>Main</code> thì đó là bảy mươi dòng bọc quanh một thực đơn năm dòng.</p>
<p><strong>Vì sao <code>login</code> trả <code>Boolean</code> và vì sao đó là ý tồi.</strong> Phần Hướng
dẫn ghi <code>public Boolean login(String username, String password)</code>, nên chữ ký là như vậy.
Nhưng hãy để ý kiểu bọc mang lại gì: không gì cả, mà lại thêm khả năng <code>null</code>.
<code>if (manager.login(u, p))</code> trên một <code>Boolean</code> null sẽ ném
<code>NullPointerException</code> ngay lúc mở bọc — sập ngay trên nhánh thuận lợi của bên gọi. Cài đặt
này vì thế không bao giờ trả null, và nếu được tự chọn chữ ký thì nó phải là <code>boolean</code>. Hãy
nói điều đó khi bảo vệ.</p>
<p><strong><code>login</code> không ném ngoại lệ, và hai kiểu thất bại dùng chung một thông báo.</strong>
Sai mật khẩu không phải tình huống bất thường; nó là một trong hai câu trả lời bình thường cho câu hỏi
đang hỏi, nên nó là giá trị trả về. Còn "không có người dùng này" và "sai mật khẩu" đều in
<code>Login fail.</code> một cách có chủ ý: hai thông báo khác nhau sẽ cho kẻ tấn công biết tên tài
khoản nào có thật, tức là xong một nửa việc đột nhập.</p>
<p><strong>Ngày sinh mang đúng cái bẫy lenient của mọi đề LAB211 có ngày tháng.</strong>
<code>SimpleDateFormat("dd/MM/yyyy")</code> mặc định là lenient, nên <code>31/02/2003</code> không bị từ
chối — nó cộng dồn thành <code>03/03/2003</code> và người dùng nhận một ngày sinh họ chưa từng gõ.
<code>setLenient(false)</code> chữa được chuyện đó, mà <em>vẫn</em> chưa đủ: bộ phân tích còn nhận
<code>1/2/2015</code> và bỏ qua phần rác phía sau. Nên ngày vừa phân tích được định dạng ngược lại rồi so
với chuỗi đã nhập, chỉ chấp nhận khi đi trọn vòng mà không đổi. Cả hai trường hợp đều nằm trong lần chạy
kiểm thứ hai. (Nếu bạn chuyển sang <code>java.time</code> thì <code>ResolverStyle.SMART</code> mặc định
cũng không ném lỗi cho ngày 31 tháng 2 — nó kẹp về 28; bạn cần <code>STRICT</code> kèm chữ mẫu
<code>uuuu</code>, vì <code>yyyy</code> là năm-theo-kỷ-nguyên và bộ giải nghiêm ngặt từ chối dựng ngày
khi thiếu era.)</p>
<p><strong>Hai phép kiểm còn lại.</strong> Mẫu số điện thoại là <code>^\\d{10,11}$</code> — hai cái neo
còn quan trọng hơn phần chữ số, vì thiếu <code>^</code> và <code>$</code> thì chuỗi
<code>abc0988666888xyz</code> <em>có chứa</em> một khớp và sẽ lọt. Mẫu email cố ý khiêm tốn: RFC 5322
không phải thứ ngữ pháp để viết tay, mà những biểu thức cố viết cho đủ thường lại loại nhầm các địa chỉ
hoàn toàn hợp lệ; nên mẫu ở đây chỉ đòi đúng hình dạng của ví dụ trong đề (<code>nghianv@t.com</code>),
không hơn. Phép thử thật duy nhất cho một địa chỉ là gửi thư tới đó.</p>
<p><strong>Một quyết định đáng bảo vệ: tên đăng nhập không phân biệt hoa thường, mật khẩu thì
có.</strong> <code>NghiaNV</code> và <code>nghianv</code> không thể cùng đăng ký, và người gõ tên mình
bằng chữ thường vẫn đăng nhập được — cả hai lần chạy kiểm đều chứng minh. Ngược lại, gộp hoa thường của
mật khẩu là vứt đi entropy mà chẳng được gì. Thông báo trùng tên trích <em>bản đã lưu</em> chứ không
trích cái vừa gõ, để cái luật đó hiện ra đúng lúc nó phát tác.</p>
<p><strong>Chỗ đề tự mâu thuẫn.</strong> Phần đặc tả nói lời chào là "Hello + Username", còn màn hình
mẫu hiện <code>Hi SkyLine</code> — mà SkyLine là <em>Name</em>, không phải username. Ở đây tôn trọng cả
hai: <code>Hello NghiaNV</code> trên một dòng riêng, rồi tới dòng của màn hình mẫu
<code>Hi SkyLine, do you want change password now? Y/N:</code>. Còn hai chỗ nữa: luồng đổi mật khẩu xuất
hiện trên màn hình (<em>Old password: / new password: / renew password:</em>) nhưng không có trong phần
đặc tả lẫn phần Hướng dẫn — chỗ đó chỉ nêu <code>addAccount</code> và <code>login</code>; vẫn cài đặt,
vì người chấm đang dò theo màn hình sẽ bấm Y. Và dấu câu ở hai màn hình không nhất quán
(<code>Account:NghiaNV</code> ở Add User, <code>Account: NghiaNV</code> ở Login), còn dòng chào thì viết
sai chính tả là <code>Wellcome</code>; tất cả đều chép nguyên từng ký tự chứ không sửa cho gọn.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy theo kịch bản, so từng ký tự. Lần đầu tạo đúng
tài khoản trong đề, đăng nhập đúng, đăng nhập bằng <code>Nghia</code> thay vì <code>nghia</code> (bị từ
chối — so sánh bản băm có phân biệt hoa thường), rồi đăng nhập bằng <code>nghianv</code> (được chấp
nhận, và được chào là <code>NghiaNV</code>). Lần hai đi qua từng luật kiểm tra, rồi đổi mật khẩu và
chứng minh ngay lập tức rằng thay đổi đó đi trọn vòng qua MD5: mật khẩu cũ giờ in ra
<code>Login fail.</code> còn mật khẩu mới thì được chào. Đó là bằng chứng mạnh nhất có thể có rằng việc
băm là thật ở cả hai chiều — không chỗ nào lưu hay so sánh mật khẩu dạng thô.</p>''',
    hints_en=[
        'MessageDigest.digest() returns byte[] — new String(bytes) destroys it; format each byte with %02x.',
        'Hash with getBytes(StandardCharsets.UTF_8), never the no-argument getBytes().',
        'Never store the plain password: hash it inside addAccount and compare digests inside login.',
        'login returns the Boolean the brief asks for, but must never return null — the caller unboxes it.',
        'setLenient(false) on the dd/MM/yyyy parser, then format the parsed date back and compare it with the input.',
        'Anchor the phone regex with ^ and $, or "abc0988666888xyz" passes.',
        'Print the same "Login fail." for an unknown user and a wrong password — two messages leak which usernames exist.',
    ],
    hints_vi=[
        'MessageDigest.digest() trả về byte[] — new String(bytes) phá hỏng nó; hãy định dạng từng byte bằng %02x.',
        'Băm bằng getBytes(StandardCharsets.UTF_8), đừng bao giờ dùng getBytes() không tham số.',
        'Không bao giờ lưu mật khẩu thô: băm ngay trong addAccount và so sánh bản băm trong login.',
        'login trả về Boolean như đề yêu cầu, nhưng tuyệt đối không được trả null — bên gọi sẽ mở bọc nó.',
        'Gọi setLenient(false) cho bộ phân tích dd/MM/yyyy, rồi định dạng ngược và so với chuỗi đã nhập.',
        'Neo biểu thức số điện thoại bằng ^ và $, nếu không "abc0988666888xyz" sẽ lọt.',
        'In cùng một câu "Login fail." cho cả trường hợp không có tài khoản lẫn sai mật khẩu — hai câu khác nhau là lộ tài khoản nào có thật.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
VI = {
    'J1.S.P0071': '''<h3>Bối cảnh</h3>
<p>(Phân hệ trích từ dự án ebank của TienPhong Bank.)</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình quản lý công việc và loại công việc cho nhân viên, có kèm chức năng xoá.</p>
<p><strong>Loại công việc</strong> (ID, Name) là dữ liệu cố định sau:</p>
<pre>ID   Name
1    Code
2    Test
3    Design
4    Review</pre>
<p><strong>Công việc (Task)</strong>: ID, TaskTypeID, Requirement Name, Date (dd-MM-yyyy), Plan From,
Plan To, Assignee, Reviewer.</p>
<ul>
<li>ID = ID của công việc cuối cùng + 1.</li>
<li>Plan From, Plan To tính từ 8h đến 17h30, theo bước nửa giờ: 8.0, 8.5, 9.0, 9.5 … 17.5.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và yêu cầu người dùng chọn một mục</h4>
<p>Người dùng chạy chương trình, chương trình mời chọn một mục. Người dùng chọn xong thì thực hiện
chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1: Add Task</strong></p>
<ul>
<li>Mời người dùng nhập thông tin công việc (TaskTypeID, Requirement Name, Date, Plan From, Plan To,
Assignee, Reviewer).</li>
<li>Kiểm tra dữ liệu hợp lệ với các điều kiện:
<ul>
<li>TaskTypeID phải tồn tại (1–4).</li>
<li>Thông tin ngày phải hợp lệ, theo đúng định dạng dd-MM-yyyy.</li>
<li>Plan From phải nhỏ hơn Plan To, và cả hai nằm trong khoảng 8h–17h30, tức 8.0, 8.5, 9.0, 9.5 … 17.5.</li>
</ul>
</li>
<li>Thêm công việc vào chương trình.</li>
<li>Quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 2: Delete Task</strong></p>
<ul>
<li>Yêu cầu nhập ID của công việc cần xoá.</li>
<li>Kiểm tra dữ liệu hợp lệ: ID phải tồn tại trong DB.</li>
<li>Xoá công việc, rồi quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 3: Show task</strong></p>
<ul>
<li>Hiển thị danh sách công việc theo ID tăng dần, đúng định dạng giao diện yêu cầu.</li>
<li>Quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 4: Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>------------Add Task---------------
Requirement Name: Dev Program
Task Type: 1
Date: 26-06-2015
From: 9.5
To: 17.5
Assignee: Dev
Reviewer: Lead

---------Del Task------
ID:

========= Task program =========
Add Task
Delete task
Display Task
exit

----------------------------------------- Task ---------------------------------------
ID   Name          Task Type   Date         Time    Assignee   Reviewer
1    Dev Program   Code        28-08-2015   8.0     Dev        Lead</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>addTask</code>,
<code>deleteTask</code>, <code>getDataTasks</code> trong mã nguồn khởi tạo.</p>
<ul>
<li>Dùng try-catch để bắt <code>NullPointerException</code> và <code>NumberFormatException</code>.</li>
<li>Dùng <code>SimpleDateFormat</code> để xử lý ngày tháng.</li>
<li>Dùng các lớp bao (wrapper) để kiểm tra giá trị số.</li>
</ul>
<p><strong>Mục 1 — Thêm công việc.</strong> Cài đặt hàm:</p>
<pre>public int addTask(String requirementName, String assignee, String reviewer,
        String taskTypeID, String date, String planFrom, String planTo) throws Exception</pre>
<p>Đầu vào: <code>requirementName</code> tên yêu cầu · <code>assignee</code> người được giao việc ·
<code>reviewer</code> người rà soát · <code>taskTypeID</code> loại công việc · <code>date</code> ngày
thực hiện · <code>planFrom</code> giờ bắt đầu · <code>planTo</code> giờ kết thúc. Giá trị trả về: id của
công việc; kèm danh sách ngoại lệ.</p>
<p><strong>Mục 2 — Xoá công việc.</strong> Cài đặt hàm:</p>
<pre>public void deleteTask(String id) throws Exception</pre>
<p>Đầu vào: <code>id</code> của công việc. Giá trị trả về: danh sách ngoại lệ.</p>
<p><strong>Mục 3 — Hiển thị công việc.</strong> Cài đặt hàm:</p>
<pre>public List&lt;Task&gt; getDataTasks()</pre>
<p>Giá trị trả về: danh sách công việc.</p>''',

    'J1.S.P0072': '''<h3>Bối cảnh</h3>
<p>Không có. (Phân hệ tách từ dự án phần mềm FPT Webmail.)</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chức năng đăng nhập có mã hoá mật khẩu bằng MD5.</p>
<p>Thông tin một tài khoản gồm: Username (String), Password (String), Name (String), Phone (String),
Email (String), Address (String), Date Of Birth (Date).</p>
<ul>
<li>Số điện thoại phải gồm 10 hoặc 11 chữ số.</li>
<li>Email phải đúng định dạng.</li>
<li>Ngày sinh (DOB) phải đúng định dạng dd/MM/yyyy.</li>
</ul>
<p>Viết chức năng đăng nhập dùng những thông tin đó; đăng nhập thành công thì hiển thị lời chào
“Hello + Username”.</p>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và yêu cầu người dùng chọn một mục</h4>
<p>Người dùng chạy chương trình, chương trình mời chọn một mục. Chọn xong thì thực hiện chức năng 2.</p>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1: Add account</strong></p>
<ul>
<li>Thêm thông tin tài khoản (Username, Password, Name, Phone, Email, Address, Date Of Birth).</li>
<li>Kiểm tra dữ liệu hợp lệ với các điều kiện:
<ul>
<li>Username không được null, không được rỗng, và không được trùng với tài khoản đã có trong DB.</li>
<li>Password không được null, không được rỗng.</li>
<li>Số điện thoại phải gồm 10 hoặc 11 chữ số.</li>
<li>Email đúng định dạng.</li>
<li>Ngày sinh đúng định dạng dd/MM/yyyy.</li>
</ul>
</li>
<li>Mật khẩu được mã hoá bằng hàm MD5.</li>
<li>Thêm tài khoản vào chương trình, rồi quay lại thực đơn.</li>
</ul>
<p><strong>Mục 2: Login</strong></p>
<ul>
<li>Mời người dùng nhập username và password.</li>
<li>Tra cứu tài khoản trong DB.</li>
<li>Nếu thông tin đúng thì hiển thị lời chào; nếu sai thì báo đăng nhập thất bại.</li>
<li>Quay lại màn hình chính.</li>
</ul>
<p><strong>Mục 3: Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>============ Login Program =========
1. Add User
2. Login
3) Exit
Please choice one option:

---------- Add User --------
Account:NghiaNV
Password:nghia
Name:SkyLine
Phone:0988666888
Email:nghianv@t.com
Address:Ha Noi
DOB:26/06/2016

------------- Login ----------------
Account: NghiaNV
Password: nghia

------------ Wellcome -----------
Hi SkyLine, do you want change password now? Y/N:

Old password:
new password:
renew password:</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt các phương thức <code>addAccount</code> và
<code>login</code> trong mã nguồn khởi tạo.</p>
<p><strong>Chức năng 1 — addAccount.</strong> Cài đặt hàm:</p>
<pre>public int addAccount(String username, String password, String name, String phone,
        String email, String address, String dob) throws Exception</pre>
<p>Đầu vào: thông tin tài khoản. Giá trị trả về: id của tài khoản; kèm danh sách ngoại lệ.</p>
<p><strong>Chức năng 2 — login.</strong> Cài đặt hàm:</p>
<pre>public Boolean login(String username, String password)</pre>
<p>Đầu vào: thông tin tài khoản. Giá trị trả về: trạng thái đăng nhập.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
