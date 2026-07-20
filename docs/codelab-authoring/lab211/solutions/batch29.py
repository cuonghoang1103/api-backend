# Batch 29 — J1.L.P0014 (BMLT asset management, the MANAGER's program: the
# original half of the pair — search, create, update, approve a borrow request,
# list what is out on loan. Four .dat files, three of them written).
import re
from datetime import date, timedelta
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.L.P0014 — Asset Management: the manager's program (500 LOC)
# ════════════════════════════════════════════════════════════════

P0014_PERSISTABLE = r'''package entity;

/**
 * One row of one .dat file.
 *
 * Four files, four record types, and exactly two things the file layer ever
 * needs to know about any of them: what its key is, and how it writes itself out
 * as a line. Naming those two things in an interface is what allows bo.DataStore
 * to be written once instead of four times - and "written once" is not a tidiness
 * argument. The day loading learns to skip a blank trailing line, it learns it
 * for assets, employees, requests and borrows in the same edit.
 */
public interface Persistable {

    /** The primary key as it appears in the file: A001, E160052, R001, B001. */
    String getId();

    /** This record rendered as the one line that will be stored. */
    String toDataLine();
}
'''

P0014_PERSON = r'''package entity;

/**
 * Everyone in employee.dat. The brief is explicit that the manager is stored in
 * the same file as the staff, so he is the same kind of thing here too - one
 * base class, two subclasses, one collection.
 *
 * employeeID is final and has no setter. Function 0 says the id "cannot change
 * after created"; the only way to make that true is to give callers nothing to
 * call. A comment asking politely is not a constraint.
 *
 * Notice what is NOT a field: role. The file's role column is produced by
 * getRole(), which the subclass answers, so a Manager can never be written back
 * out as EM no matter what the rest of the program does. State that cannot
 * disagree with itself is better than state that is checked.
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

    /** The two-letter code the file stores: EM or MA. */
    public abstract String getRole();

    /** What this person is called on screen. */
    public abstract String getTitle();

    /**
     * May this person run the manager's program?
     *
     * This is the question every protected menu item asks, and it is asked of
     * the OBJECT. Written instead as `"MA".equals(p.getRole())` it would have to
     * be repeated at four guards, and the day a Director role appears, all four
     * are wrong and none of them says so.
     */
    public abstract boolean canManage();

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

    /** The MD5 hash exactly as the file holds it - never a plain password. */
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

P0014_EMPLOYEE = r'''package entity;

/**
 * Role EM. He can log in here - the login screen has no way of knowing who is
 * knocking until it has looked him up - but every manager function turns him
 * away. Logging in and being authorised are two different questions, and this
 * class answers only the second one.
 */
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
    public boolean canManage() {
        return false;
    }
}
'''

P0014_MANAGER = r'''package entity;

/** Role MA: the one person this program is written for. */
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
    public boolean canManage() {
        return true;
    }
}
'''

P0014_ASSET = r'''package entity;

/**
 * One row of asset.dat: the thing the whole program is about.
 *
 * assetID is final for a harder reason than employeeID. Two other files point at
 * it - request.dat and borrow.dat both carry an assetID column and nothing
 * enforces that link. An editable key is a key that can be edited out from under
 * eight rows that will then refer to an asset that no longer exists, and no
 * error will be raised anywhere: the rows simply stop resolving.
 *
 * The other five fields have setters because Function 4 exists to change them.
 * quantity in particular is changed from two directions - the manager edits it,
 * and every approval takes from it - which is precisely why the arithmetic lives
 * in bo.AssetStore and not here.
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

P0014_TRANSACTION = r'''package entity;

import java.time.format.DateTimeFormatter;

/**
 * A request and a borrow are the same five columns: an id, which asset, which
 * employee, how many, and when. The brief prints them as two separate tables, so
 * it is tempting to write two separate classes - and then the approval screen,
 * which turns one into the other, has to copy five fields across by hand.
 *
 * Made one abstract class instead, approval is a constructor call and the
 * request/borrow tables are ONE printing method taking List&lt;? extends
 * Transaction&gt;. The subclasses exist to say which file they belong to and
 * what to call themselves on screen, and that is genuinely all the difference
 * there is between them.
 */
public abstract class Transaction implements Persistable {

    /** The exact shape of the brief's own sample rows: 23-12-2021 13:17:56. */
    public static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    private final String id;
    private final String assetID;
    private final String employeeID;
    private final int quantity;
    private final String dateTime;

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

    /**
     * Held as the text the file holds, not as a LocalDateTime.
     *
     * Nothing in this program does arithmetic on it: it is written once, read
     * back, and printed. Parsing on load and re-formatting on save would be two
     * extra opportunities to quietly rewrite somebody else's timestamps - and
     * the employee's program reads these same four files.
     */
    public String getDateTime() {
        return dateTime;
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

P0014_REQUEST = r'''package entity;

/**
 * One row of request.dat: an asset an employee has asked for and has not been
 * given. Every field is final, because a request is never edited - it is
 * approved (and becomes a Borrow) or it is cancelled.
 */
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

P0014_BORROW = r'''package entity;

/** One row of borrow.dat: stock that has left the shelf and is being held. */
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

P0014_DATASTORE = r'''package bo;

import entity.Persistable;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * The file layer, written once and inherited four times.
 *
 * A subclass supplies two things: the name of its file, and how to turn one row
 * of text into one object. Loading, saving, finding by id, adding, removing and
 * working out the next free id are character for character identical for assets,
 * people, requests and borrows - so they live here, once. That is what the
 * Persistable interface was for.
 *
 * Two rules this class enforces on behalf of every caller:
 *
 * 1. A MISSING FILE IS NOT AN ERROR. On a machine that has never run the program
 *    there are no .dat files; load() leaves the list empty and says nothing.
 *    Throwing here would mean the program could not start until somebody
 *    hand-wrote four files it is perfectly capable of creating itself.
 *
 * 2. EVERY CHANGE IS WRITTEN IMMEDIATELY - add() and remove() both save. The
 *    tempting alternative, "save once on exit", loses the entire session if the
 *    program is closed with the window button, and a marker who is halfway
 *    through a checklist WILL close it with the window button.
 *
 * load() and save() are final: a subclass that overrode either could break rule
 * 2 for its own file only, and that is the kind of bug that is found weeks later
 * by noticing that one table never remembers anything.
 */
public abstract class DataStore<T extends Persistable> {

    private final String fileName;
    private final List<T> items = new ArrayList<>();

    protected DataStore(String fileName) {
        this.fileName = fileName;
    }

    /** Build one object from one already-trimmed row of the file. */
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
                    // A file that ends with a newline - which every text editor
                    // and every PrintWriter produces - would otherwise hand
                    // parse() an array of length 1 and crash on parts[1].
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

    public boolean isEmpty() {
        return items.isEmpty();
    }

    /** Case-insensitive, because a manager types a001 and means A001. */
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
     * The next free id: the HIGHEST number already used, plus one - not
     * size() + 1.
     *
     * The brief's own request.dat is R001, R002, R003, R007. Four rows, largest
     * number seven. size() + 1 hands out R005, which is free today; approve two
     * requests and it starts handing out ids that already exist, and a
     * duplicate primary key in a flat file is not detected by anything.
     */
    public String nextId(String prefix) {
        int max = 0;
        for (T item : items) {
            try {
                max = Math.max(max, Integer.parseInt(item.getId().substring(prefix.length())));
            } catch (RuntimeException ignored) {
                // An id that is not prefix + digits simply contributes nothing.
                // It must not stop the program from issuing the next one.
            }
        }
        return String.format("%s%03d", prefix, max + 1);
    }
}
'''

P0014_ASSETSTORE = r'''package bo;

import entity.Asset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * asset.dat, plus every rule about what may be done to stock.
 *
 * This class throws and never prints, so the same rule can be enforced from the
 * create screen, the update screen and the approval screen without three copies
 * of the message and without any of them being able to skip it.
 */
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
     * Function 3's one business rule: an id is used once.
     *
     * The create screen also looks the id up before it asks for the other five
     * fields, which looks like the same check written twice. It is not. The
     * screen's lookup is a COURTESY - it saves the manager from typing a name, a
     * colour, a price and a weight only to be told the first answer was wrong.
     * This throw is the RULE. If you delete one of the two, delete the one on
     * the screen: a rule that lives on a screen is a rule that the next screen
     * does not have.
     */
    public void create(Asset asset) throws Exception {
        if (findById(asset.getAssetID()) != null) {
            throw new Exception("Asset " + asset.getAssetID() + " already exists.");
        }
        add(asset);
    }

    /**
     * Function 2. Case-insensitive "contains", the way a search box behaves.
     *
     * The brief says to show "all information of asset(descending)" without
     * saying descending BY WHAT. Price is the only column on which "descending"
     * reads naturally for a catalogue - dearest first - so that is the order,
     * and it is said out loud in the walkthrough rather than left as something
     * the examiner has to reverse-engineer from the output.
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

    /** Is there enough on the shelf? Asked before anything is written. */
    public boolean hasStock(Asset asset, int quantity) {
        return asset.getQuantity() >= quantity;
    }

    /**
     * Take stock off the shelf and commit it.
     *
     * The guard repeats hasStock() on purpose: this is the only method that can
     * make the number go down, so it is the only place where "never below zero"
     * can be guaranteed rather than hoped for. A caller that forgets to ask
     * first gets an exception, not a negative inventory.
     */
    public void takeFromStock(Asset asset, int quantity) throws Exception {
        if (!hasStock(asset, quantity)) {
            throw new Exception("Not enough " + asset.getName() + " in stock.");
        }
        asset.setQuantity(asset.getQuantity() - quantity);
        save();
    }
}
'''

P0014_EMPLOYEESTORE = r'''package bo;

import entity.Employee;
import entity.Manager;
import entity.Person;
import utils.Md5;

/** employee.dat: everyone who can log in, staff and manager in one file. */
public class EmployeeStore extends DataStore<Person> {

    public EmployeeStore() {
        super("employee.dat");
    }

    /**
     * The role COLUMN chooses the CLASS, and this is the only line in the whole
     * program where a role string is compared to anything.
     *
     * After it, text has become an object graph: nothing downstream asks what
     * role somebody has, it asks whether he canManage(). Adding a Director role
     * later is one new subclass and one more branch here - and no change at all
     * to the four guarded screens.
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
     * Returns the person, or null.
     *
     * Null deliberately covers BOTH "no such id" and "wrong password". Telling
     * the user which of the two they got wrong tells anybody at the keyboard
     * which employee ids exist. The brief's single message - "Incorrect id or
     * password" - is not the author being lazy; it is the correct answer, and
     * that is worth saying at the defence.
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

P0014_REQUESTSTORE = r'''package bo;

import entity.Request;

/** request.dat: what the staff have asked for and are waiting on. */
public class RequestStore extends DataStore<Request> {

    public RequestStore() {
        super("request.dat");
    }

    @Override
    protected Request parse(String[] parts) {
        return new Request(parts[0], parts[1], parts[2],
                Integer.parseInt(parts[3]), parts[4]);
    }
}
'''

P0014_BORROWSTORE = r'''package bo;

import entity.Borrow;

/** borrow.dat: what has actually been handed out and not yet returned. */
public class BorrowStore extends DataStore<Borrow> {

    public BorrowStore() {
        super("borrow.dat");
    }

    @Override
    protected Borrow parse(String[] parts) {
        return new Borrow(parts[0], parts[1], parts[2],
                Integer.parseInt(parts[3]), parts[4]);
    }
}
'''

P0014_MD5 = r'''package utils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * The hash the brief's own sample data is written in.
 *
 * Every password column in employee.dat reads
 * e10adc3949ba59abbe56e057f20f883e, which is MD5("123456"). So login cannot
 * compare what was typed with what is stored - it hashes what was typed and
 * compares the hashes. That is the whole idea of storing a hash: there is no
 * un-hashing, and the file is worth nothing to whoever steals it.
 *
 * (MD5 has been unfit for real password storage for twenty years. It is used
 * here because it is what the given data contains, and knowing that is a better
 * answer at the defence than not noticing.)
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
                // %02x, not toHexString: a byte whose value is 10 must be "0a",
                // and toHexString would make it "a" - a 31-character hash that
                // matches nothing and looks almost right.
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            // Every JVM is required to provide MD5. If this ever fires, the
            // machine is broken, not the program.
            throw new IllegalStateException("MD5 is unavailable on this JVM.", e);
        }
    }
}
'''

P0014_SAMPLEDATA = r'''package utils;

import java.io.File;
import java.io.PrintWriter;

/**
 * Writes the brief's own four tables the first time the program runs, and does
 * NOTHING at all if a file is already there.
 *
 * Why it exists: a marker unzips the project and presses Run. The .dat files are
 * working data, so they are usually not in the zip - and without them every
 * screen is empty and a correct submission looks broken.
 *
 * Why it checks first: after that first run these files are the user's DATA.
 * Rewriting them at every start would silently undo every approval, which is a
 * far worse bug than the one this class was written to prevent. "Create if
 * missing" and "reset to defaults" differ by one if-statement and by everything
 * that matters.
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

P0014_VALIDATOR = r'''package utils;

import java.util.Scanner;

/**
 * Every keyboard read in the program, and every constraint on what may be typed.
 *
 * One static Scanner over System.in, a private constructor, all methods static.
 * A second Scanner is the classic way to lose input in these assignments: it
 * buffers ahead and swallows lines the first one still needed, and closing
 * either of them closes System.in for good.
 *
 * The shape of this class is the interesting part. Each field has ONE
 * implementation - the optional one, which returns null for a blank line - and
 * the required version is a two-line loop around it. That matters because
 * Function 3 and Function 4 read the same six fields under opposite rules:
 * creating, a blank answer is a mistake; updating, a blank answer means "leave
 * it alone". Written as two independent sets of readers, the price rule would
 * eventually be tightened in one of them only.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    /** An id is the letter A and exactly three digits, as in the given file. */
    private static final String ASSET_ID = "A\\d{3}";

    private Validator() {
    }

    // ── optional readers: null means "the user just pressed Enter" ──

    public static String getOptionalText(String message) {
        System.out.print(message);
        String line = SCANNER.nextLine().trim();
        return line.isEmpty() ? null : line;
    }

    public static Double getOptionalPositive(String message, String tooSmall) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (line.isEmpty()) {
                return null;
            }
            try {
                double value = Double.parseDouble(line);
                if (value > 0) {
                    return value;
                }
                System.out.println(tooSmall);
            } catch (NumberFormatException e) {
                System.out.println("You must input a number.");
            }
        }
    }

    /**
     * Quantity is the one number allowed to be zero: an asset every copy of
     * which is out on loan still exists, it is simply unavailable. Negative is
     * refused, because there is no such thing as minus two projectors.
     */
    public static Integer getOptionalQuantity(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (line.isEmpty()) {
                return null;
            }
            try {
                int value = Integer.parseInt(line);
                if (value >= 0) {
                    return value;
                }
                System.out.println("The quantity cannot be negative.");
            } catch (NumberFormatException e) {
                System.out.println("You must input a whole number.");
            }
        }
    }

    // ── required readers: the same rules, plus "you must answer" ──

    public static String getText(String message) {
        while (true) {
            String line = getOptionalText(message);
            if (line != null) {
                return line;
            }
            System.out.println("This field is required.");
        }
    }

    public static double getPositive(String message, String tooSmall) {
        while (true) {
            Double value = getOptionalPositive(message, tooSmall);
            if (value != null) {
                return value;
            }
            System.out.println("This field is required.");
        }
    }

    public static int getQuantity(String message) {
        while (true) {
            Integer value = getOptionalQuantity(message);
            if (value != null) {
                return value;
            }
            System.out.println("This field is required.");
        }
    }

    /** Ids are upper case in every file, so they are upper case when typed. */
    public static String getId(String message) {
        return getText(message).toUpperCase();
    }

    public static String getAssetId(String message) {
        while (true) {
            String id = getId(message);
            if (id.matches(ASSET_ID)) {
                return id;
            }
            System.out.println("The asset id must be the letter A and 3 digits, e.g. A003.");
        }
    }

    /**
     * The Y/N question, asked the same way everywhere.
     *
     * It keeps asking until it gets one or the other. Treating "anything that is
     * not Y" as no is shorter and wrong: a typo would then silently answer a
     * confirmation, and a confirmation is exactly the place where the program
     * must be certain what was meant.
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

    /**
     * The menu choice, read as TEXT and never validated.
     *
     * The brief's last option is "7. Others- Quit": anything that is not one of
     * the six IS the seventh option. A getInt(1, 7) loop would refuse to quit on
     * "q" and would be refusing to obey the menu it just printed.
     */
    public static String getChoice(String message) {
        System.out.print(message);
        return SCANNER.nextLine().trim();
    }
}
'''

P0014_CONTROLLER = r'''package controller;

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
 * One method per menu item: ask, call the stores, report what happened.
 *
 * All four stores are held here rather than in Main because they are not
 * independent. Approving a request touches three of them, and the ORDER those
 * three writes happen in is a real decision that has to belong to somebody -
 * this class is that somebody.
 *
 * currentUser is the session. It is null until Login succeeds, and every guarded
 * screen opens by asking mustManage(). Four of the six functions say "Manager
 * must login to use this function", and a guard written once in one place cannot
 * be the one that was forgotten on the fourth screen.
 */
public class ManagerController {

    private static final String ASSET_ROW = "%-7s%-22s%-8s%10s%9s%6s%n";
    private static final String TX_ROW = "%-7s%-7s%-20s%-9s%-19s%5s  %s%n";
    private static final String LINE =
            "----------------------------------------------------------------------------";

    private final AssetStore assets = new AssetStore();
    private final EmployeeStore employees = new EmployeeStore();
    private final RequestStore requests = new RequestStore();
    private final BorrowStore borrows = new BorrowStore();

    private Person currentUser;

    /** Read all four files once, at start-up. */
    public void start() throws Exception {
        assets.load();
        employees.load();
        requests.load();
        borrows.load();
    }

    // ── Function 1 ────────────────────────────────────────────────

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

    // ── Function 2 ────────────────────────────────────────────────

    /**
     * The one screen with no login guard.
     *
     * The brief attaches "Manager must login" to Functions 3, 4, 5 and 6 and
     * pointedly not to this one. A catalogue of what the company owns is not a
     * secret from the company, and adding a guard the brief did not ask for is
     * as much a deviation as leaving one out.
     */
    public void searchAsset() {
        System.out.println("-- Search asset by name --");
        String keyword = Validator.getText("Enter asset name (or part of it): ");
        List<Asset> found = assets.searchByName(keyword);
        if (found.isEmpty()) {
            System.out.println("=> No asset matches \"" + keyword + "\".");
            return;
        }
        showAssets(found);
    }

    // ── Function 3 ────────────────────────────────────────────────

    public void createAsset() throws Exception {
        System.out.println("-- Create new asset --");
        if (!mustManage()) {
            return;
        }
        do {
            String assetID = Validator.getAssetId("Enter asset id: ");

            // Asked here so the manager is not made to type five more answers
            // before being told the first one was taken. The rule itself lives
            // in AssetStore.create() and would still fire without this.
            if (assets.findById(assetID) != null) {
                System.out.println("=> Asset " + assetID + " already exists.");
            } else {
                Asset asset = new Asset(assetID,
                        Validator.getText("Enter name    : "),
                        Validator.getText("Enter color   : "),
                        Validator.getPositive("Enter price   : ", "The price must be greater than 0."),
                        Validator.getPositive("Enter weight  : ", "The weight must be greater than 0."),
                        Validator.getQuantity("Enter quantity: "));
                assets.create(asset);
                System.out.println("=> Asset " + assetID + " has been created.");
                showAssets(java.util.Collections.singletonList(asset));
            }
        } while (Validator.confirm("Create another asset (Y/N)? "));
    }

    // ── Function 4 ────────────────────────────────────────────────

    /**
     * Update: every field optional, blank means keep.
     *
     * The old value is printed in each prompt. Without it the manager is being
     * asked to overwrite something he cannot see, and "blank keeps the old
     * value" is only a usable rule if the old value is on the screen.
     */
    public void updateAsset() throws Exception {
        System.out.println("-- Update asset information --");
        if (!mustManage()) {
            return;
        }
        String assetID = Validator.getId("Enter asset id: ");
        Asset asset = assets.findById(assetID);
        if (asset == null) {
            System.out.println("Asset does not exist");
            return;
        }
        showAssets(java.util.Collections.singletonList(asset));
        System.out.println("(press Enter to keep the current value)");

        String name = Validator.getOptionalText("Name     [" + asset.getName() + "]: ");
        String color = Validator.getOptionalText("Color    [" + asset.getColor() + "]: ");
        Double price = Validator.getOptionalPositive(
                String.format("Price    [%.2f]: ", asset.getPrice()),
                "The price must be greater than 0.");
        Double weight = Validator.getOptionalPositive(
                String.format("Weight   [%.2f]: ", asset.getWeight()),
                "The weight must be greater than 0.");
        Integer quantity = Validator.getOptionalQuantity("Quantity [" + asset.getQuantity() + "]: ");

        // Nothing has been written yet: the whole form is read first, so a
        // half-finished edit cannot leave a half-updated row in the file.
        if (name != null) {
            asset.setName(name);
        }
        if (color != null) {
            asset.setColor(color);
        }
        if (price != null) {
            asset.setPrice(price);
        }
        if (weight != null) {
            asset.setWeight(weight);
        }
        if (quantity != null) {
            asset.setQuantity(quantity);
        }
        assets.save();
        System.out.println("=> Asset " + asset.getAssetID() + " has been updated.");
        showAssets(java.util.Collections.singletonList(asset));
    }

    // ── Function 5 ────────────────────────────────────────────────

    /**
     * Approve one request: the only place in the program where three files must
     * change together, and there is no transaction to wrap them in.
     *
     * So the order is chosen deliberately, by asking what each half-finished
     * state looks like if the machine dies between two writes:
     *
     *   borrow.dat first  - a borrow exists, stock is unchanged, request still
     *                       waiting. Stock is over-stated by one item and the
     *                       borrow list SHOWS why. Visible, and correctable.
     *   asset.dat second  - now stock and the borrow agree with each other and
     *                       only the request is still lying about being open.
     *   request.dat last  - the worst case left is a request that could be
     *                       approved a second time, which the manager can see
     *                       in the borrow list before he does it.
     *
     * The reverse order - delete the request first - loses the request with
     * nothing handed out and NO record that anything happened. Between a visible
     * duplicate and an invisible loss, always leave the visible one.
     */
    public void approveRequest() throws Exception {
        System.out.println("-- Approve the request of employee --");
        if (!mustManage()) {
            return;
        }
        if (requests.isEmpty()) {
            System.out.println("=> There is no request to approve.");
            return;
        }
        showTransactions(requests.getAll(), "Requested at");

        String rID = Validator.getId("Enter request id to approve: ");
        Request request = requests.findById(rID);
        if (request == null) {
            System.out.println("=> Request " + rID + " does not exist.");
            return;
        }
        Asset asset = assets.findById(request.getAssetID());
        if (asset == null) {
            System.out.println("=> Asset " + request.getAssetID()
                    + " is no longer in the catalogue.");
            return;
        }
        if (!assets.hasStock(asset, request.getQuantity())) {
            System.out.println("=> Not enough stock: " + asset.getAssetID() + " has "
                    + asset.getQuantity() + " left but request " + rID
                    + " needs " + request.getQuantity() + ".");
            return;
        }

        Borrow borrow = new Borrow(borrows.nextId(Borrow.PREFIX), asset.getAssetID(),
                request.getEmployeeID(), request.getQuantity(), stamp());
        borrows.add(borrow);
        assets.takeFromStock(asset, request.getQuantity());
        requests.remove(request);

        System.out.println("=> Request " + rID + " approved as borrow " + borrow.getId()
                + ". " + asset.getName() + " stock is now " + asset.getQuantity() + ".");
    }

    // ── Function 6 ────────────────────────────────────────────────

    public void showBorrowList() {
        System.out.println("-- List of borrowed asset --");
        if (!mustManage()) {
            return;
        }
        if (borrows.isEmpty()) {
            System.out.println("=> No asset is being borrowed.");
            return;
        }
        showTransactions(borrows.getAll(), "Borrowed at");
    }

    // ── shared ────────────────────────────────────────────────────

    /** The login guard and the role guard, once, for four screens. */
    private boolean mustManage() {
        if (currentUser == null) {
            System.out.println("=> You must login first.");
            return false;
        }
        if (!currentUser.canManage()) {
            System.out.println("=> " + currentUser.getName()
                    + " is not a manager. This function is for the manager only.");
            return false;
        }
        return true;
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
     * came from - and does not need to. Only the heading of the last column
     * differs. That is the whole payoff for making Request and Borrow two
     * subclasses instead of two unrelated classes with the same five fields.
     *
     * It also resolves the two foreign keys, because "A001" and "E140449" are
     * not information a human can approve a request from. A row whose asset or
     * employee has vanished prints "(unknown)" rather than crashing: the manager
     * needs to SEE the orphan in order to deal with it.
     */
    private void showTransactions(List<? extends Transaction> list, String whenHeading) {
        System.out.printf(TX_ROW, "Id", "Asset", "Asset name", "Employee", "Employee name",
                "Qty", whenHeading);
        System.out.println(LINE);
        for (Transaction item : list) {
            Asset asset = assets.findById(item.getAssetID());
            Person person = employees.findById(item.getEmployeeID());
            System.out.printf(TX_ROW, item.getId(), item.getAssetID(),
                    asset == null ? "(unknown)" : asset.getName(),
                    item.getEmployeeID(),
                    person == null ? "(unknown)" : person.getName(),
                    String.valueOf(item.getQuantity()), item.getDateTime());
        }
        System.out.println(LINE);
    }
}
'''

P0014_MAIN = r'''package ui;

import controller.ManagerController;
import utils.SampleData;
import utils.Validator;

/**
 * The manager's menu, and nothing else. Seven lines of options, one dispatch,
 * and not one business decision in the file.
 *
 * The try/catch is the program's outer wall. A disk that refuses to be written
 * must not end the session: the message is shown and the menu comes back, which
 * is also what makes the message thrown by AssetStore worth writing carefully -
 * it is what the user reads.
 */
public class Main {

    private static final String TOP = "========== BMLT ASSET - MANAGER ==========";
    private static final String BOTTOM = "==========================================";

    public static void main(String[] args) throws Exception {
        SampleData.createIfMissing();
        ManagerController controller = new ManagerController();
        controller.start();

        while (true) {
            System.out.println(TOP);
            System.out.println("1. Login");
            System.out.println("2. Search asset by name");
            System.out.println("3. Create new asset");
            System.out.println("4. Updating asset's information");
            System.out.println("5. Approve the request of employee");
            System.out.println("6. Show list of borrow asset");
            System.out.println("7. Others- Quit");
            System.out.println(BOTTOM);
            String choice = Validator.getChoice("Please select an option: ");
            try {
                if ("1".equals(choice)) {
                    controller.login();
                } else if ("2".equals(choice)) {
                    controller.searchAsset();
                } else if ("3".equals(choice)) {
                    controller.createAsset();
                } else if ("4".equals(choice)) {
                    controller.updateAsset();
                } else if ("5".equals(choice)) {
                    controller.approveRequest();
                } else if ("6".equals(choice)) {
                    controller.showBorrowList();
                } else {
                    System.out.println("Goodbye.");
                    return;
                }
            } catch (Exception e) {
                System.out.println("=> " + e.getMessage());
            }
        }
    }
}
'''


# ── the two scripted runs ────────────────────────────────────────
#
# RUN 0 walks the whole program with no .dat files on disk at all: SampleData
# lays down the brief's four tables, and everything after that is real work on
# real files. RUN 1 is a SECOND JVM in the same directory, which is the only
# thing that actually proves the files were written - a program that keeps
# everything in memory passes run 0 and fails run 1 on its first line.

P0014_RUN0_IN = (
    '3\n'                                    # create before logging in
    '1\nE160052\n000000\n'                   # right id, wrong password
    '1\nE160001\n123456\n'                   # a real login - but he is an EM
    '3\n'                                    # ... so the manager screen refuses him
    '1\nE160052\n123456\n'                   # Hoa Doan, role MA
    '2\npro\n'                               # two names contain "pro", dearest first
    '2\nzzz\n'                               # nothing matches
    '3\nA001\nY\n'                           # duplicate id, then carry on
    'A3\nA003\n'                             # bad id shape, then a good one
    '\nDell projector\n'                     # name: blank is refused
    '\nBlack\n'                              # color: blank is refused
    'abc\n0\n750\n'                          # price: not a number, then zero
    '-1\n4.5\n'                              # weight: negative
    '-2\n2\n'                                # quantity: negative
    'N\n'                                    # stop creating
    '4\nA999\n'                              # "Asset does not exist"
    '4\nA003\n\nWhite\n-5\n\n\n6\n'          # blank keeps, -5 refused, qty 6
    '5\nR999\n'                              # no such request
    '4\nA001\n\n\n\n\n0\n'                   # empty the A001 shelf on purpose
    '5\nR001\n'                              # ... so the stock check has to fire
    '4\nA001\n\n\n\n\n10\n'                  # put the shelf back
    '5\nR001\n'                              # and now it may be approved
    '6\n'                                    # the borrow list, five rows
    '9\n'                                    # "Others- Quit"
)

P0014_RUN1_IN = (
    '2\nprojector\n'                         # NEW process: A001 must read 9, A003 must exist
    '6\n'                                    # ... and the guard must have forgotten him
    '1\nE160052\n123456\n'
    '6\n'                                    # B008 survived the JVM
    '5\nR002\n'                              # A002: 5 -> 4
    '5\nR003\n'                              # A001: 9 -> 8
    '5\nR007\n'                              # A002: 4 -> 3
    '5\n'                                    # request.dat is empty now
    '2\ndell\n'                              # the asset created last run, as updated
    '0\n'
)


def _normalise(text):
    """Blank out timestamps the program generated during THIS test.

    Approving a request stamps it with LocalDateTime.now(), so two of the rows
    are different every time the suite is run and cannot be diffed against fixed
    text. Only stamps carrying today's (or yesterday's, for a run that straddles
    midnight) date are replaced - the brief's own 2021 sample rows stay exactly
    as they are and are still compared character by character.
    """
    for day in (date.today(), date.today() - timedelta(days=1)):
        text = re.sub(day.strftime('%d-%m-%Y') + r' \d\d:\d\d:\d\d', '<NOW>', text)
    return text.strip()


def _expect(expected):
    def check(got):
        want = _normalise(expected)
        have = _normalise(got)
        if want == have:
            return True, ''
        want_lines = want.split('\n')
        have_lines = have.split('\n')
        for i, (a, b) in enumerate(zip(want_lines, have_lines)):
            if a != b:
                return False, f'line {i + 1} differs\n  expected: {a!r}\n  actual  : {b!r}'
        return False, (f'output has {len(have_lines)} lines, expected {len(want_lines)}\n'
                       f'--- EXPECTED ---\n{want}')
    return check


P0014_RUN0_OUT = r'''========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Create new asset --
=> You must login first.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Login --
Employee ID: Password   : Incorrect id or password
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Nguyen Hong Hiep (Employee).
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Create new asset --
=> Nguyen Hong Hiep is not a manager. This function is for the manager only.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Hoa Doan (Manager).
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Search asset by name --
Enter asset name (or part of it): Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A002   Macbook pro 2016      Sliver     1000.00     2.20     5
A001   Samsung projector     White       500.00     3.20    10
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Search asset by name --
Enter asset name (or part of it): => No asset matches "zzz".
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Create new asset --
Enter asset id: => Asset A001 already exists.
Create another asset (Y/N)? Enter asset id: The asset id must be the letter A and 3 digits, e.g. A003.
Enter asset id: Enter name    : This field is required.
Enter name    : Enter color   : This field is required.
Enter color   : Enter price   : You must input a number.
Enter price   : The price must be greater than 0.
Enter price   : Enter weight  : The weight must be greater than 0.
Enter weight  : Enter quantity: The quantity cannot be negative.
Enter quantity: => Asset A003 has been created.
Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A003   Dell projector        Black       750.00     4.50     2
----------------------------------------------------------------------------
Create another asset (Y/N)? ========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Update asset information --
Enter asset id: Asset does not exist
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Update asset information --
Enter asset id: Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A003   Dell projector        Black       750.00     4.50     2
----------------------------------------------------------------------------
(press Enter to keep the current value)
Name     [Dell projector]: Color    [Black]: Price    [750.00]: The price must be greater than 0.
Price    [750.00]: Weight   [4.50]: Quantity [2]: => Asset A003 has been updated.
Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A003   Dell projector        White       750.00     4.50     6
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R001   A001   Samsung projector   E140449  Le Buu Nhan            1  23-12-2021 13:17:56
R002   A002   Macbook pro 2016    E160001  Nguyen Hong Hiep       1  24-12-2021 12:18:56
R003   A001   Samsung projector   E160798  Truong Le Minh         1  23-12-2021 11:19:56
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Request R999 does not exist.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Update asset information --
Enter asset id: Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A001   Samsung projector     White       500.00     3.20    10
----------------------------------------------------------------------------
(press Enter to keep the current value)
Name     [Samsung projector]: Color    [White]: Price    [500.00]: Weight   [3.20]: Quantity [10]: => Asset A001 has been updated.
Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A001   Samsung projector     White       500.00     3.20     0
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R001   A001   Samsung projector   E140449  Le Buu Nhan            1  23-12-2021 13:17:56
R002   A002   Macbook pro 2016    E160001  Nguyen Hong Hiep       1  24-12-2021 12:18:56
R003   A001   Samsung projector   E160798  Truong Le Minh         1  23-12-2021 11:19:56
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Not enough stock: A001 has 0 left but request R001 needs 1.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Update asset information --
Enter asset id: Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A001   Samsung projector     White       500.00     3.20     0
----------------------------------------------------------------------------
(press Enter to keep the current value)
Name     [Samsung projector]: Color    [White]: Price    [500.00]: Weight   [3.20]: Quantity [0]: => Asset A001 has been updated.
Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A001   Samsung projector     White       500.00     3.20    10
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R001   A001   Samsung projector   E140449  Le Buu Nhan            1  23-12-2021 13:17:56
R002   A002   Macbook pro 2016    E160001  Nguyen Hong Hiep       1  24-12-2021 12:18:56
R003   A001   Samsung projector   E160798  Truong Le Minh         1  23-12-2021 11:19:56
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Request R001 approved as borrow B008. Samsung projector stock is now 9.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- List of borrowed asset --
Id     Asset  Asset name          Employee Employee name        Qty  Borrowed at
----------------------------------------------------------------------------
B001   A001   Samsung projector   E160001  Nguyen Hong Hiep       1  23-12-2021 15:13:46
B002   A001   Samsung projector   E160001  Nguyen Hong Hiep       2  25-12-2021 16:14:56
B003   A002   Macbook pro 2016    E160798  Truong Le Minh         3  15-12-2021 17:15:52
B007   A001   Samsung projector   E160240  Tran Dinh Khanh        2  26-12-2021 12:16:53
B008   A001   Samsung projector   E140449  Le Buu Nhan            1  <NOW>
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: Goodbye.'''

P0014_RUN1_OUT = r'''========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Search asset by name --
Enter asset name (or part of it): Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A003   Dell projector        White       750.00     4.50     6
A001   Samsung projector     White       500.00     3.20     9
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- List of borrowed asset --
=> You must login first.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Login --
Employee ID: Password   : Successfully
=> Welcome, Hoa Doan (Manager).
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- List of borrowed asset --
Id     Asset  Asset name          Employee Employee name        Qty  Borrowed at
----------------------------------------------------------------------------
B001   A001   Samsung projector   E160001  Nguyen Hong Hiep       1  23-12-2021 15:13:46
B002   A001   Samsung projector   E160001  Nguyen Hong Hiep       2  25-12-2021 16:14:56
B003   A002   Macbook pro 2016    E160798  Truong Le Minh         3  15-12-2021 17:15:52
B007   A001   Samsung projector   E160240  Tran Dinh Khanh        2  26-12-2021 12:16:53
B008   A001   Samsung projector   E140449  Le Buu Nhan            1  <NOW>
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R002   A002   Macbook pro 2016    E160001  Nguyen Hong Hiep       1  24-12-2021 12:18:56
R003   A001   Samsung projector   E160798  Truong Le Minh         1  23-12-2021 11:19:56
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Request R002 approved as borrow B009. Macbook pro 2016 stock is now 4.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R003   A001   Samsung projector   E160798  Truong Le Minh         1  23-12-2021 11:19:56
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Request R003 approved as borrow B010. Samsung projector stock is now 8.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
Id     Asset  Asset name          Employee Employee name        Qty  Requested at
----------------------------------------------------------------------------
R007   A002   Macbook pro 2016    E160240  Tran Dinh Khanh        1  24-12-2021 10:10:56
----------------------------------------------------------------------------
Enter request id to approve: => Request R007 approved as borrow B011. Macbook pro 2016 stock is now 3.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Approve the request of employee --
=> There is no request to approve.
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: -- Search asset by name --
Enter asset name (or part of it): Id     Name                  Color        Price   Weight   Qty
----------------------------------------------------------------------------
A003   Dell projector        White       750.00     4.50     6
----------------------------------------------------------------------------
========== BMLT ASSET - MANAGER ==========
1. Login
2. Search asset by name
3. Create new asset
4. Updating asset's information
5. Approve the request of employee
6. Show list of borrow asset
7. Others- Quit
==========================================
Please select an option: Goodbye.'''


solution(
    'J1.L.P0014',
    title_vi='Quản lý tài sản — chương trình của người quản lý',
    files=[('src/entity/Persistable.java', P0014_PERSISTABLE),
           ('src/entity/Person.java', P0014_PERSON),
           ('src/entity/Employee.java', P0014_EMPLOYEE),
           ('src/entity/Manager.java', P0014_MANAGER),
           ('src/entity/Asset.java', P0014_ASSET),
           ('src/entity/Transaction.java', P0014_TRANSACTION),
           ('src/entity/Request.java', P0014_REQUEST),
           ('src/entity/Borrow.java', P0014_BORROW),
           ('src/bo/DataStore.java', P0014_DATASTORE),
           ('src/bo/AssetStore.java', P0014_ASSETSTORE),
           ('src/bo/EmployeeStore.java', P0014_EMPLOYEESTORE),
           ('src/bo/RequestStore.java', P0014_REQUESTSTORE),
           ('src/bo/BorrowStore.java', P0014_BORROWSTORE),
           ('src/controller/ManagerController.java', P0014_CONTROLLER),
           ('src/utils/Validator.java', P0014_VALIDATOR),
           ('src/utils/Md5.java', P0014_MD5),
           ('src/utils/SampleData.java', P0014_SAMPLEDATA),
           ('src/ui/Main.java', P0014_MAIN)],
    main_class='ui.Main',
    runs=[(P0014_RUN0_IN, _expect(P0014_RUN0_OUT)),
          (P0014_RUN1_IN, _expect(P0014_RUN1_OUT))],
    explain_en='''<p><strong>The map, before anything else.</strong> This is the largest assignment in the
set, and the first thing an examiner does with a large one is look for the seams. There are eighteen
classes in five packages, and every one of them can be justified in a sentence.
<code>entity</code> holds the four kinds of row the four .dat files contain — <code>Asset</code>,
<code>Person</code> (with <code>Employee</code> and <code>Manager</code>) and <code>Transaction</code>
(with <code>Request</code> and <code>Borrow</code>) — plus the <code>Persistable</code> interface that
says what all of them have in common. <code>bo</code> holds one generic <code>DataStore</code> and the
four stores that extend it: the collection, the file, and the rules about what may be done to them.
<code>controller.ManagerController</code> has one method per menu item — ask, call the stores, report.
<code>utils</code> has the <code>Validator</code> that performs every keyboard read, <code>Md5</code>,
and the <code>SampleData</code> that lays down the brief&#39;s own tables on a machine that has never
run the program. <code>ui.Main</code> prints seven lines and dispatches, and contains no decision at
all.</p>
<p><strong>Why the layers fall exactly there.</strong> The rule that produces this shape is simple:
something that <em>throws</em> and something that <em>prints</em> must never be the same method.
<code>AssetStore.create()</code> throws when an id is taken; the screen that catches it prints. That is
what lets the same rule be enforced from the create screen and from anywhere else added later, and it
is why the duplicate-id check appears to be written twice. It is not written twice: the lookup on the
screen is a courtesy so the manager is not asked for a name, a colour, a price and a weight before
being told his first answer was already in use, and the throw in <code>bo</code> is the actual rule. If
one of the two has to go, delete the one on the screen — a rule that lives on a screen is a rule the
next screen will not have.</p>
<p><strong>The polymorphism Function 0 asks for, doing real work.</strong> It would be easy to satisfy
&quot;must implement the polymorphism properties&quot; with a hierarchy that is never used. Here it
carries three separate loads. First, the <em>role column decides the class</em>: one line in
<code>EmployeeStore.parse()</code> is the only place in the entire program that compares a role string
to anything, and after it every guard asks the object <code>canManage()</code> instead. Second,
<code>Request</code> and <code>Borrow</code> are one <code>Transaction</code>, which is why approving is
a constructor call rather than five fields copied by hand, and why the request table and the borrow
table are <em>one</em> method taking <code>List&lt;? extends Transaction&gt;</code> — the printer cannot
tell which file the rows came from, and only the last column heading differs. Third,
<code>Persistable</code> is what lets one <code>DataStore&lt;T&gt;</code> read, write, search and delete
rows of four unrelated files; a subclass supplies the file name and how to parse a line, and nothing
else.</p>
<p><strong>Two rules the file layer enforces on behalf of everybody.</strong> A missing file is
<em>not</em> an error — on a fresh machine <code>load()</code> leaves the list empty and says nothing,
because a program that refuses to start until somebody hand-writes four files it could create itself is
broken by design. And every change is written the moment it is made: <code>add()</code> and
<code>remove()</code> both save. The tempting alternative, saving once on exit, loses the whole session
if the program is closed with the window button — and a marker working through a checklist will close
it with the window button. <code>load()</code> and <code>save()</code> are <code>final</code> so no
subclass can quietly opt one file out of that.</p>
<p><strong>The id trap hidden in the brief&#39;s own data.</strong> request.dat is given as R001, R002,
R003, R007 — four rows whose largest number is seven. The obvious <code>size() + 1</code> hands out
R005, which happens to be free today; approve two requests and it starts issuing ids that already
exist, and a duplicate key in a flat file is detected by absolutely nothing. <code>nextId()</code>
therefore takes the highest number in use and adds one, which is why the first approval in the
transcript produces <strong>B008</strong> and not B005. The gap in the sample data is not a typo; it is
the test.</p>
<p><strong>Login, and why one vague message is the correct one.</strong> Every password column in the
given employee.dat is <code>e10adc3949ba59abbe56e057f20f883e</code>, which is MD5(&quot;123456&quot;).
So login cannot compare passwords: it hashes what was typed and compares hashes, because there is no
un-hashing — that is the entire point of storing a digest. <code>login()</code> returns null for
&quot;no such id&quot; and for &quot;wrong password&quot; alike, and the brief&#39;s single message,
<code>Incorrect id or password</code>, is copied exactly. That is not the author being lazy: two
different messages would tell anyone at the keyboard which employee ids exist. Worth saying out loud at
the defence, along with the fact that MD5 has been unfit for real password storage for twenty years and
is used here because it is what the given data contains.</p>
<p><strong>The guard is written once because it is asked four times.</strong> Functions 3, 4, 5 and 6
each say &quot;Manager must login to use this function&quot;, so they all open with
<code>mustManage()</code>, which answers two questions in order: is anyone logged in, and is that
person a manager. Function 2 deliberately has <em>no</em> guard — the brief attaches the sentence to
four functions and pointedly not to the search, a catalogue of what the company owns is not a secret
from the company, and adding a guard that was not asked for is as much a deviation as omitting one.
The transcript proves both halves: pressing 3 before logging in, and pressing 3 while logged in as
Nguyen Hong Hiep, who is a real user with a correct password and role EM.</p>
<p><strong>Create: every constraint refused separately.</strong> The id must be the letter A and three
digits; the name and the colour may not be blank; price and weight must be greater than zero; quantity
must not be negative — but <em>may</em> be zero, because an asset every copy of which is out on loan
still exists, it is merely unavailable. Each of those was refused on its own in the verification run,
one input at a time, so every message in the program has been seen on a real console rather than
assumed. Non-numeric text is a separate message from a number that is out of range, because &quot;abc
is not a number&quot; and &quot;0 is not a price&quot; are different mistakes and a single message for
both teaches the user nothing.</p>
<p><strong>Update: blank keeps, and the whole form is read before anything is written.</strong> The
brief says &quot;If new information is blank, then not change old information&quot;, so every prompt
shows the current value in brackets — a rule about leaving something alone is only usable if the user
can see what he would be leaving. Each field has exactly one implementation in
<code>Validator</code>: the optional reader that returns null for an empty line, with the required
version being a two-line loop around it. Function 3 and Function 4 read the same six fields under
opposite rules, and written as two independent sets of readers, the price rule would eventually be
tightened in only one of them. Nothing is assigned until every answer is in, so an edit abandoned
halfway cannot leave a half-updated row in the file, and a missing asset produces the brief&#39;s exact
words, <code>Asset does not exist</code>, with no full stop added.</p>
<p><strong>Approval is the one place three files must change together — so the order is a
decision.</strong> There is no transaction to wrap them in, so the question to ask is what each
half-finished state looks like if the machine dies between two writes. borrow.dat is written first: a
borrow exists, stock is unchanged, the request is still open — stock is over-stated by one item and the
borrow list shows exactly why. asset.dat second: now the stock and the borrow agree and only the
request is still claiming to be open. request.dat last: the worst surviving state is a request that
could be approved a second time, which the manager can see in the borrow list before he does it. The
reverse order — delete the request first — loses the request with nothing handed out and no record that
anything ever happened. Between a visible duplicate and an invisible loss, always leave the visible
one. The stock check runs before any of the three, and <code>takeFromStock()</code> repeats it, because
that method is the only thing in the program that can make the number go down and is therefore the only
place &quot;never below zero&quot; can be guaranteed rather than hoped for.</p>
<p><strong>Where the brief contradicts itself, and what was done about it.</strong> Three places. (1)
The Background says the manager can <em>delete</em> assets; the function list, which is the contract,
has no delete — so there is none, and this is worth raising rather than hiding. (2) Function 2 says to
show the result &quot;descending&quot; without saying by what; price is the only column on which
&quot;descending&quot; reads naturally for a catalogue, so the search returns dearest first and says so
here rather than leaving the examiner to reverse-engineer it from the output. (3) The manager&#39;s
program and the employee&#39;s program are both headed &quot;A.&quot; — a copy-paste slip in the sheet.
Two smaller things were copied rather than corrected: the sample data spells silver &quot;Sliver&quot;,
and the sample prices are whole numbers written without a decimal point. Both are the given data, and a
marker who diffs files does not want them improved.</p>
<p><strong>How this was verified, and why one run could not have been enough.</strong> Two runs, in
order, in the same directory. The first starts with no .dat files at all, so <code>SampleData</code>
writes the brief&#39;s four tables and everything after that is real work on real files: the two login
failures, the role refusal, a search that matches two assets and a search that matches none, a
duplicate id, a malformed id, all six creation constraints one at a time, an update of an id that does
not exist, an update where blank keeps and one field is refused before it is accepted, a request id
that does not exist, a deliberate emptying of the A001 shelf so the stock check has something to
refuse, and finally a real approval. The second run is a <strong>new JVM in the same directory</strong>
and is the only part that proves anything about files: it reads back A001 at 9 rather than 10, finds
A003 with the colour and quantity the update gave it, finds B008 in the borrow list, and finds R001 no
longer in the request list. A program that kept everything in memory passes the first run completely
and fails the second on its first line. The two rows stamped with the current time are the only thing
that cannot be diffed against fixed text, so the comparison blanks stamps carrying today&#39;s date and
leaves the brief&#39;s own 2021 rows to be compared character by character.</p>
<p><strong>What an examiner will ask.</strong> Why the id fields are final — because request.dat and
borrow.dat point at assetID and nothing enforces that link, so an editable key is a key that can be
edited out from under eight rows which then silently stop resolving. Why B008 and not B005. What
happens if the program dies between the second and third write of an approval. Why the login message
does not say which half was wrong. And where the polymorphism is, to which the answer is not
&quot;<code>Manager extends Person</code>&quot; but &quot;one printing method serves both transaction
tables, one store class serves four files, and one line converts a role column into a type&quot;.</p>''',
    explain_vi='''<p><strong>Trước hết là bản đồ.</strong> Đây là bài lớn nhất trong bộ, và việc đầu tiên
người chấm làm với một bài lớn là tìm các đường ghép. Có mười tám lớp trong năm gói, và lớp nào cũng
giải thích được bằng một câu. <code>entity</code> giữ bốn loại bản ghi ứng với bốn tệp .dat —
<code>Asset</code>, <code>Person</code> (cùng <code>Employee</code> và <code>Manager</code>) và
<code>Transaction</code> (cùng <code>Request</code> và <code>Borrow</code>) — cộng giao diện
<code>Persistable</code> nói lên điểm chung của tất cả. <code>bo</code> giữ một lớp
<code>DataStore</code> tổng quát và bốn lớp kho kế thừa nó: tập dữ liệu, tệp, và các luật về những gì
được phép làm với chúng. <code>controller.ManagerController</code> có đúng một phương thức cho mỗi mục
thực đơn — hỏi, gọi kho, báo kết quả. <code>utils</code> có <code>Validator</code> làm mọi thao tác đọc
bàn phím, <code>Md5</code>, và <code>SampleData</code> đặt sẵn chính các bảng của đề trên máy chưa từng
chạy chương trình. <code>ui.Main</code> in bảy dòng rồi điều hướng, và không chứa một quyết định
nào.</p>
<p><strong>Vì sao các tầng rơi đúng vào chỗ đó.</strong> Luật sinh ra hình dạng này rất đơn giản: thứ
<em>ném ngoại lệ</em> và thứ <em>in ra màn hình</em> không bao giờ được là cùng một phương thức.
<code>AssetStore.create()</code> ném khi mã đã bị dùng; màn hình bắt lấy và in. Nhờ đó cùng một luật có
hiệu lực ở màn hình tạo mới và ở bất cứ màn hình nào thêm sau này, và đó cũng là lý do phép kiểm trùng
mã trông như được viết hai lần. Nó không phải viết hai lần: lần tra cứu trên màn hình là <em>phép lịch
sự</em> để người quản lý khỏi phải gõ tên, màu, giá, khối lượng rồi mới bị báo rằng câu trả lời đầu tiên
đã có người dùng; còn cú ném trong <code>bo</code> mới là luật. Nếu buộc phải bỏ một trong hai, hãy bỏ
cái trên màn hình — một luật sống trên màn hình là luật mà màn hình kế tiếp sẽ không có.</p>
<p><strong>Tính đa hình mà Function 0 đòi, làm việc thật.</strong> Rất dễ thoả mãn câu &quot;phải cài
đặt tính đa hình&quot; bằng một cây kế thừa không ai dùng. Ở đây nó gánh ba việc riêng biệt. Một,
<em>cột role quyết định lớp</em>: một dòng trong <code>EmployeeStore.parse()</code> là chỗ duy nhất
trong cả chương trình so sánh chuỗi vai trò với thứ gì đó, sau dòng ấy mọi chốt chặn đều hỏi đối tượng
<code>canManage()</code>. Hai, <code>Request</code> và <code>Borrow</code> là cùng một
<code>Transaction</code>, nên duyệt yêu cầu chỉ là một lời gọi constructor thay vì chép tay năm trường,
và bảng yêu cầu với bảng mượn là <em>một</em> phương thức nhận
<code>List&lt;? extends Transaction&gt;</code> — hàm in không biết được các dòng đến từ tệp nào, và chỉ
tiêu đề cột cuối là khác. Ba, <code>Persistable</code> là thứ cho phép một
<code>DataStore&lt;T&gt;</code> đọc, ghi, tìm và xoá dòng của bốn tệp chẳng liên quan gì nhau; lớp con
chỉ cung cấp tên tệp và cách phân tích một dòng, không gì khác.</p>
<p><strong>Hai luật mà tầng tệp áp đặt thay cho tất cả.</strong> Tệp không tồn tại <em>không</em> phải
lỗi — trên máy mới tinh, <code>load()</code> để danh sách rỗng và im lặng, vì một chương trình từ chối
khởi động cho tới khi có người gõ tay bốn tệp mà chính nó tạo được là hỏng ngay từ thiết kế. Và mọi
thay đổi được ghi ngay lúc xảy ra: <code>add()</code> và <code>remove()</code> đều lưu. Phương án hấp
dẫn kia — lưu một lần lúc thoát — mất trắng cả phiên nếu chương trình bị đóng bằng nút cửa sổ, mà người
chấm đang chạy theo danh mục kiểm tra thì sẽ đóng bằng nút cửa sổ. <code>load()</code> và
<code>save()</code> để <code>final</code> để không lớp con nào lặng lẽ cho tệp của mình ra ngoài luật
đó.</p>
<p><strong>Cái bẫy mã số nằm ngay trong dữ liệu của đề.</strong> request.dat được cho là R001, R002,
R003, R007 — bốn dòng mà số lớn nhất là bảy. Cách hiển nhiên <code>size() + 1</code> phát ra R005, hôm
nay thì còn trống; duyệt hai yêu cầu là nó bắt đầu phát ra mã đã tồn tại, mà khoá trùng trong một tệp
phẳng thì tuyệt đối không có gì phát hiện được. Vì thế <code>nextId()</code> lấy số lớn nhất đang dùng
rồi cộng một, và đó là lý do lần duyệt đầu tiên trong bản ghi màn hình sinh ra <strong>B008</strong>
chứ không phải B005. Khoảng trống trong dữ liệu mẫu không phải lỗi đánh máy; nó chính là bài kiểm
tra.</p>
<p><strong>Đăng nhập, và vì sao một thông báo mơ hồ mới là thông báo đúng.</strong> Mọi cột mật khẩu
trong employee.dat được cho đều là <code>e10adc3949ba59abbe56e057f20f883e</code>, tức
MD5(&quot;123456&quot;). Nên đăng nhập không thể so sánh mật khẩu: nó băm cái vừa gõ rồi so hai chuỗi
băm, bởi không có chiều ngược lại — đó chính là toàn bộ ý nghĩa của việc lưu bản băm.
<code>login()</code> trả null cho cả &quot;không có mã này&quot; lẫn &quot;sai mật khẩu&quot;, và thông
báo duy nhất của đề, <code>Incorrect id or password</code>, được chép nguyên văn. Đó không phải tác giả
lười: hai thông báo khác nhau sẽ nói cho bất kỳ ai ngồi trước bàn phím biết mã nhân viên nào có thật.
Nên nói thẳng điều này khi bảo vệ, kèm việc MD5 đã không còn dùng được cho lưu mật khẩu thật từ hai
mươi năm nay và ở đây dùng nó chỉ vì dữ liệu đề cho là như vậy.</p>
<p><strong>Chốt chặn viết một lần vì bị hỏi bốn lần.</strong> Các Function 3, 4, 5, 6 đều ghi
&quot;Manager must login to use this function&quot;, nên cả bốn mở đầu bằng <code>mustManage()</code>,
trả lời hai câu theo thứ tự: đã có ai đăng nhập chưa, và người đó có phải quản lý không. Function 2 thì
cố ý <em>không</em> có chốt — đề gắn câu ấy vào bốn chức năng và rõ ràng không gắn vào tìm kiếm; danh
mục tài sản của công ty không phải bí mật với chính công ty, và thêm một chốt chặn đề không đòi cũng là
làm sai lệch y như bỏ sót một chốt. Bản ghi màn hình chứng minh cả hai vế: bấm 3 khi chưa đăng nhập, và
bấm 3 khi đã đăng nhập bằng Nguyen Hong Hiep — một người dùng có thật, mật khẩu đúng, vai trò EM.</p>
<p><strong>Tạo mới: từng ràng buộc bị từ chối riêng lẻ.</strong> Mã phải là chữ A và ba chữ số; tên và
màu không được để trống; giá và khối lượng phải lớn hơn 0; số lượng không được âm — nhưng <em>được
phép</em> bằng 0, vì một tài sản mà mọi bản đều đang cho mượn thì vẫn tồn tại, chỉ là không sẵn có. Từng
ràng buộc trong số đó đã bị từ chối riêng một lần trong lần chạy kiểm chứng, mỗi lần một dữ liệu vào,
nên mọi thông báo trong chương trình đều đã được nhìn thấy trên màn hình thật chứ không phải phỏng
đoán. Chữ không phải số là một thông báo khác với số nằm ngoài khoảng, vì &quot;abc không phải số&quot;
và &quot;0 không phải một cái giá&quot; là hai lỗi khác nhau, gộp một thông báo thì người dùng chẳng học
được gì.</p>
<p><strong>Cập nhật: bỏ trống là giữ nguyên, và cả biểu mẫu được đọc xong mới ghi.</strong> Đề nói
&quot;If new information is blank, then not change old information&quot;, nên mỗi lời nhắc đều hiện giá
trị hiện tại trong ngoặc vuông — một luật về việc &quot;để yên&quot; chỉ dùng được nếu người dùng nhìn
thấy cái mình sắp để yên. Mỗi trường chỉ có đúng một cài đặt trong <code>Validator</code>: bản tuỳ chọn
trả null khi dòng nhập rỗng, còn bản bắt buộc là vòng lặp hai dòng bọc quanh nó. Function 3 và Function
4 đọc cùng sáu trường theo hai luật ngược nhau; viết thành hai bộ hàm đọc độc lập thì sớm muộn luật về
giá cũng chỉ được siết ở một bộ. Không gì được gán cho tới khi đủ mọi câu trả lời, nên một lần sửa bỏ dở
giữa chừng không thể để lại một dòng sửa nửa vời trong tệp; và tài sản không tồn tại thì in đúng chữ của
đề, <code>Asset does not exist</code>, không thêm dấu chấm.</p>
<p><strong>Duyệt yêu cầu là chỗ duy nhất ba tệp phải đổi cùng nhau — nên thứ tự là một quyết
định.</strong> Không có giao dịch nào bọc chúng lại, nên câu cần hỏi là: nếu máy chết giữa hai lần ghi
thì trạng thái dở dang trông ra sao. borrow.dat ghi trước: có một phiếu mượn, tồn kho chưa đổi, yêu cầu
vẫn còn — tồn kho bị khai dư một món và danh sách mượn cho thấy đúng lý do. asset.dat thứ hai: giờ tồn
kho và phiếu mượn khớp nhau, chỉ còn yêu cầu là vẫn tự nhận mình đang chờ. request.dat cuối cùng: trạng
thái xấu nhất còn sót lại là một yêu cầu có thể bị duyệt lần thứ hai, mà người quản lý nhìn thấy được
trong danh sách mượn trước khi làm thế. Thứ tự ngược lại — xoá yêu cầu trước — làm mất yêu cầu trong khi
chưa giao gì cả và không để lại dấu vết nào rằng đã có chuyện xảy ra. Giữa một lỗi trùng nhìn thấy được
và một mất mát vô hình, luôn chọn để lại cái nhìn thấy được. Phép kiểm tồn kho chạy trước cả ba, và
<code>takeFromStock()</code> kiểm lại lần nữa, vì đó là thứ duy nhất trong chương trình có thể làm con
số giảm xuống, nên cũng là chỗ duy nhất có thể <em>bảo đảm</em> chứ không phải hy vọng rằng tồn kho
không bao giờ âm.</p>
<p><strong>Chỗ đề tự mâu thuẫn, và đã xử lý ra sao.</strong> Có ba chỗ. (1) Phần Bối cảnh nói người quản
lý <em>xoá</em> được tài sản; danh sách chức năng — mới là bản có hiệu lực — không có chức năng xoá, nên
chương trình không có, và điều này nên nói ra chứ không giấu đi. (2) Function 2 bảo hiển thị kết quả
&quot;descending&quot; mà không nói theo cột nào; giá là cột duy nhất mà &quot;giảm dần&quot; đọc lên tự
nhiên với một danh mục tài sản, nên kết quả tìm kiếm xếp đắt trước rẻ sau, và điều đó được nói thẳng ở
đây thay vì bắt người chấm tự suy ra từ màn hình. (3) Chương trình của quản lý và chương trình của nhân
viên đều được đánh đề mục &quot;A.&quot; — một lỗi chép dán trong đề. Hai chi tiết nhỏ hơn thì chép
nguyên chứ không sửa: dữ liệu mẫu viết màu bạc thành &quot;Sliver&quot;, và các mức giá mẫu là số
nguyên viết không có phần thập phân. Cả hai đều là dữ liệu đề cho, và người chấm so tệp không muốn chúng
được &quot;cải tiến&quot;.</p>
<p><strong>Đã kiểm chứng thế nào, và vì sao một lần chạy là không đủ.</strong> Hai lần chạy, theo thứ
tự, trong cùng một thư mục. Lần đầu bắt đầu khi chưa có tệp .dat nào, nên <code>SampleData</code> ghi ra
bốn bảng của đề rồi mọi thứ sau đó là công việc thật trên tệp thật: hai lần đăng nhập hỏng, một lần bị
từ chối vì sai vai trò, một lần tìm ra hai tài sản và một lần không ra gì, một mã trùng, một mã sai định
dạng, cả sáu ràng buộc khi tạo mới lần lượt từng cái, sửa một mã không tồn tại, sửa với ô bỏ trống giữ
nguyên và một trường bị từ chối trước khi được chấp nhận, một mã yêu cầu không tồn tại, một lần cố ý làm
cạn kho A001 để phép kiểm tồn kho có cái mà từ chối, và cuối cùng là một lần duyệt thật. Lần chạy thứ
hai là <strong>một tiến trình JVM mới trong cùng thư mục</strong> và là phần duy nhất chứng minh được
điều gì về tệp: nó đọc lại A001 còn 9 chứ không phải 10, thấy A003 với màu và số lượng mà lần sửa đã
đặt, thấy B008 trong danh sách mượn, và thấy R001 không còn trong danh sách yêu cầu. Một chương trình
giữ hết trong bộ nhớ sẽ qua trọn vẹn lần chạy đầu và trượt ngay dòng đầu tiên của lần chạy sau. Hai dòng
mang dấu thời gian hiện tại là thứ duy nhất không thể so với văn bản cố định, nên phép so sánh xoá trắng
các dấu thời gian mang ngày hôm nay và để nguyên các dòng 2021 của đề để so từng ký tự.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> Vì sao các trường mã để final — vì request.dat và borrow.dat
đều trỏ tới assetID mà không có gì ràng buộc mối liên kết ấy, nên một khoá sửa được là khoá có thể bị
sửa mất dưới chân tám dòng khác, và tám dòng đó lặng lẽ không còn tra ra gì nữa. Vì sao là B008 chứ
không phải B005. Chuyện gì xảy ra nếu chương trình chết giữa lần ghi thứ hai và thứ ba của một lần
duyệt. Vì sao thông báo đăng nhập không nói rõ sai ở vế nào. Và tính đa hình nằm ở đâu — câu trả lời
không phải &quot;<code>Manager extends Person</code>&quot; mà là &quot;một phương thức in phục vụ cả hai
bảng giao dịch, một lớp kho phục vụ bốn tệp, và một dòng biến cột role thành một kiểu&quot;.</p>''',
    hints_en=[
        'Four files, one file layer: put getId() and toDataLine() in an interface and write ONE generic store that every .dat file extends.',
        'The role column should choose the class (Manager or Employee); after that, ask the object canManage() instead of comparing role strings at every guard.',
        'Make Request and Borrow subclasses of one Transaction: approving is then a constructor call, and both tables print from one method.',
        'nextId is the HIGHEST number in the file plus one, not size() + 1 — the given request.dat jumps R003 to R007, so the next borrow is B008.',
        'Approving touches three files: check the stock first, then write borrow.dat, then asset.dat, then delete from request.dat — never delete the request first.',
        'Give Validator one optional reader per field (null when the line is blank) and build the required reader on top of it: create and update need the same rules with opposite blank handling.',
        'Print "Asset does not exist" exactly as the brief writes it, and save after every change rather than on exit.',
    ],
    hints_vi=[
        'Bốn tệp, một tầng tệp: đặt getId() và toDataLine() vào một interface rồi viết MỘT lớp kho tổng quát cho mọi tệp .dat kế thừa.',
        'Hãy để cột role quyết định lớp (Manager hay Employee); sau đó hỏi đối tượng canManage() thay vì so chuỗi vai trò ở từng chốt chặn.',
        'Cho Request và Borrow cùng kế thừa một lớp Transaction: khi duyệt chỉ cần gọi constructor, và cả hai bảng in ra từ một phương thức.',
        'nextId là số LỚN NHẤT trong tệp cộng một, không phải size() + 1 — request.dat của đề nhảy từ R003 sang R007, nên phiếu mượn kế tiếp là B008.',
        'Duyệt yêu cầu đụng ba tệp: kiểm tồn kho trước, rồi ghi borrow.dat, rồi asset.dat, rồi mới xoá khỏi request.dat — tuyệt đối đừng xoá yêu cầu trước.',
        'Cho Validator mỗi trường một hàm đọc tuỳ chọn (trả null khi dòng nhập rỗng) rồi dựng hàm bắt buộc trên nó: tạo mới và cập nhật dùng chung luật nhưng xử lý ô trống ngược nhau.',
        'In đúng "Asset does not exist" như đề viết, và lưu tệp ngay sau mỗi thay đổi thay vì lưu lúc thoát.',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
VI = {
    'J1.L.P0014': '''<h3>Bối cảnh</h3>
<p>BMLT là một công ty phần mềm. Nhân sự của công ty gồm các nhân viên và một người quản lý. Trong công
ty có những tài sản dùng chung như máy chiếu, laptop... Người quản lý có các chức năng như thêm, xoá,
sửa, tìm tài sản. Ngoài ra, người quản lý còn duyệt các yêu cầu mượn tài sản của nhân viên. Về phía nhân
viên, họ có các chức năng: tìm kiếm và gửi yêu cầu mượn cũng như trả tài sản.</p>
<p>Bạn cần xây dựng chương trình quản lý tài sản của công ty BMLT. Hệ thống gồm <strong>hai chương
trình</strong>: một cho nhân viên và một cho người quản lý. Bài này là <strong>chương trình của người
quản lý</strong>.</p>
<h3>Dữ liệu</h3>
<p>Thông tin tài sản lưu trong tệp <code>asset.dat</code>:</p>
<pre>assetID  name                color   price  weight  quantity
A001     Samsung projector   White   500    3.2     10
A002     Macbook pro 2016    Sliver  1000   2.2     5</pre>
<p>Tệp <code>employee.dat</code> lưu thông tin nhân viên, bao gồm cả người quản lý:</p>
<pre>employID  name               birthdate   role  sex   password
E160001   Nguyen Hong Hiep   12/06/2000  EM    male  e10adc3949ba59abbe56e057f20f883e
E160240   Tran Dinh Khanh    15/07/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E140449   Le Buu Nhan        10/07/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E160798   Truong Le Minh     03/12/2002  EM    male  e10adc3949ba59abbe56e057f20f883e
E160052   Hoa Doan           05/06/1990  MA    male  e10adc3949ba59abbe56e057f20f883e</pre>
<p>Tệp <code>request.dat</code> lưu thông tin yêu cầu mượn:</p>
<pre>rID   assetID  employeeID  quantity  requestDateTime
R001  A001     E140449     1         23-12-2021 13:17:56
R002  A002     E160001     1         24-12-2021 12:18:56
R003  A001     E160798     1         23-12-2021 11:19:56
R007  A002     E160240     1         24-12-2021 10:10:56</pre>
<p>Tệp <code>borrow.dat</code> lưu thông tin mượn:</p>
<pre>bID   assetID  employeeID  quantity  borrowDateTime
B001  A001     E160001     1         23-12-2021 15:13:46
B002  A001     E160001     2         25-12-2021 16:14:56
B003  A002     E160798     3         15-12-2021 17:15:52
B007  A001     E160240     2         26-12-2021 12:16:53</pre>
<h3>Đặc tả chương trình</h3>
<p>Xây dựng chương trình quản lý dành cho người quản lý, với các chức năng cơ bản sau:</p>
<ol>
<li>Login</li>
<li>Search asset by name</li>
<li>Create new asset</li>
<li>Updating asset&#39;s information</li>
<li>Approve the request of employee</li>
<li>Show list of borrow asset</li>
<li>Others- Quit</li>
</ol>
<p>Mỗi lựa chọn trên thực đơn phải gọi đúng chức năng tương ứng. Chương trình phải hiển thị lại thực đơn
sau mỗi tác vụ và chờ người dùng chọn tiếp cho tới khi họ chọn thoát.</p>
<h3>Chi tiết chức năng</h3>
<h4>Function 0: Xây dựng cấu trúc dữ liệu — 50 LOC</h4>
<ul>
<li>Lớp, lớp trừu tượng, interface.</li>
<li><code>assetID</code> và <code>employeeID</code> không được thay đổi sau khi đã tạo.</li>
<li>Bắt buộc thể hiện tính đa hình của lập trình hướng đối tượng.</li>
</ul>
<h4>Function 1: Login — 50 LOC</h4>
<ul>
<li>Nhân viên nhập <code>employeeID</code> và mật khẩu để đăng nhập.</li>
<li>Chương trình phải hiển thị kết quả: <code>Successfully</code> hoặc
<code>Incorrect id or password</code>.</li>
</ul>
<h4>Function 2: Tìm tài sản theo tên — 50 LOC</h4>
<ul>
<li>Người dùng nhập đoạn văn bản muốn tìm.</li>
<li>Hệ thống tìm trong công ty và trả về mọi tài sản có tên <strong>chứa</strong> chuỗi tìm kiếm.</li>
<li>Hiển thị danh sách kết quả: đầy đủ thông tin của tài sản (giảm dần).</li>
<li>Quay lại thực đơn chính.</li>
</ul>
<h4>Function 3: Tạo tài sản mới — 75 LOC</h4>
<ul>
<li>Người quản lý phải đăng nhập mới dùng được chức năng này.</li>
<li>Tạo một thực đơn con cho phép người quản lý thêm tài sản mới.</li>
<li>Nhớ kiểm tra các ràng buộc dữ liệu.</li>
<li>Thêm tài sản mới vào tập dữ liệu và cập nhật xuống tệp <code>asset.dat</code>.</li>
<li>Hỏi có tiếp tục tạo tài sản mới hay quay về thực đơn chính.</li>
</ul>
<h4>Function 4: Cập nhật thông tin tài sản — 75 LOC</h4>
<ul>
<li>Người quản lý phải đăng nhập mới dùng được chức năng này.</li>
<li>Yêu cầu nhập mã tài sản.</li>
<li>Nếu tài sản không tồn tại thì thông báo <code>Asset does not exist</code>. Ngược lại, người quản lý
bắt đầu nhập thông tin mới của tài sản và cập nhật.</li>
<li>Nếu thông tin mới để trống thì giữ nguyên thông tin cũ.</li>
<li>Nhớ kiểm tra các ràng buộc dữ liệu.</li>
<li>Sau đó hệ thống phải in ra kết quả của việc cập nhật.</li>
<li>Cập nhật xong, chương trình quay về màn hình chính.</li>
</ul>
<h4>Function 5: Duyệt yêu cầu của nhân viên — 150 LOC</h4>
<ul>
<li>Người quản lý phải đăng nhập mới dùng được chức năng này.</li>
<li>Hệ thống hiển thị danh sách yêu cầu mượn của nhân viên.</li>
<li>Người quản lý chọn yêu cầu muốn duyệt thông qua mã yêu cầu.</li>
<li>Hệ thống kiểm tra: số lượng mượn của tài sản này còn đủ trong kho (<code>asset.dat</code>) không?
Nếu không đủ thì báo lỗi. Nếu còn đủ thì:</li>
<li>Ghi dữ liệu vào tệp <code>borrow.dat</code>;</li>
<li>Xoá dòng dữ liệu tương ứng trong tệp <code>request.dat</code>;</li>
<li>Cập nhật số lượng của tài sản trong tệp <code>asset.dat</code>.</li>
<li>Duyệt xong, chương trình quay về màn hình chính.</li>
</ul>
<h4>Function 6: Hiển thị danh sách tài sản đang được mượn — 50 LOC</h4>
<ul>
<li>Người quản lý phải đăng nhập mới dùng được chức năng này.</li>
<li>Hệ thống hiển thị danh sách các tài sản đang được mượn trong công ty (tệp
<code>borrow.dat</code>).</li>
<li>Sau đó chương trình quay về màn hình chính.</li>
</ul>
<h3>Ghi chú</h3>
<p>Các đặc tả trên chỉ là thông tin cơ bản; bạn phải thực hiện bước phân tích yêu cầu và xây dựng ứng
dụng theo yêu cầu thực tế.</p>
<p>Hai điểm trong đề tự mâu thuẫn, nên nói ra khi bảo vệ thay vì lặng lẽ chọn bừa: phần Bối cảnh nói
người quản lý <em>xoá</em> được tài sản nhưng danh sách chức năng không có mục xoá (danh sách chức năng
mới là bản có hiệu lực); và Function 2 bảo hiển thị &quot;giảm dần&quot; mà không nói theo cột nào —
hãy chọn một cột, làm nhất quán, và nói rõ bạn đã chọn cột nào.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
