# Batch 28 — J1.L.P0013 "The Vehicle Management" (500 LOC), the joint-largest
# assignment in the track: an inheritance hierarchy, one polymorphic collection,
# a full CRUD menu, two sort orders, and a text file that must survive the
# program exiting.
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# entity — the data and the shape of the hierarchy
# ════════════════════════════════════════════════════════════════

P0013_SOUNDABLE = r'''package entity;

/**
 * Something that can be heard.
 *
 * The brief asks for an interface, and this is the one the program actually
 * uses: Function 6.2 has to make a noise "if vehicle is a motorbike type", and
 * the report is written against Vehicle, not against Motorbike. An interface
 * lets the report ask a question about CAPABILITY ("can this thing be heard?")
 * instead of a question about identity ("is this thing a Motorbike?").
 *
 * The difference shows up the day a Truck with an air horn is added: it
 * implements Soundable and the report starts honking without being edited. Had
 * the report said `instanceof Motorbike`, the truck would be silent and the bug
 * would live in a class nobody thought to look at.
 */
public interface Soundable {

    /** Print this vehicle's own noise. */
    void makeSound();
}
'''

P0013_VEHICLE = r'''package entity;

import java.io.Serializable;
import java.util.Locale;

/**
 * Everything every vehicle in the show room has, and nothing else.
 *
 * id, name, color, price and brand appear in BOTH lists in the brief, so they
 * are declared once here. A car's type/year and a motorbike's speed/licence do
 * not, so they are not here - a field that is meaningless for half its subclasses
 * is a field sitting one level too high.
 *
 * The class is abstract because "a vehicle in general" is not something the show
 * room can own. Every object in the collection is a Car or a Motorbike; Vehicle
 * exists so that ONE ArrayList<Vehicle> can hold both, which is exactly what
 * Function 0 asks for ("use only one collection").
 *
 * Serializable is implemented even though the data file is plain text. It costs
 * one word, it is the marker's habit, and it keeps the door open for an
 * ObjectOutputStream version of Function 7 without touching the hierarchy.
 */
public abstract class Vehicle implements Serializable, Comparable<Vehicle> {

    /**
     * ONE format string for the header and for every row.
     *
     * If the header were written with its own literal spacing, the two would
     * drift apart the first time a column width changed, and a table whose
     * header does not line up with its body is the first thing a marker sees.
     */
    private static final String ROW = "%-6s %-16s %-8s %12s %-10s %-10s %s";

    private String id;
    private String name;
    private String color;
    private double price;
    private String brand;

    protected Vehicle(String id, String name, String color, double price, String brand) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.price = price;
        this.brand = brand;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    /** The word in the "Kind" column: Car, Motorbike, ... */
    public abstract String getKind();

    /** The properties this kind has and the other kinds do not. */
    public abstract String getDetails();

    /** This record as the single line that goes into vehicles.txt. */
    public abstract String toDataLine();

    /** The column header, built from the same format string as the rows. */
    public static String header() {
        return String.format(ROW, "ID", "Name", "Color", "Price", "Brand", "Kind", "Details");
    }

    /**
     * One table row.
     *
     * Locale.US is not decoration. "%,.2f" asks the DEFAULT locale for its
     * grouping and decimal separators, so the same code prints 35,000.00 on one
     * machine and 35.000,00 on another. A marker running the program on a
     * machine configured for Vietnamese would see a different screen from the
     * one submitted, and the difference would look like a bug in the code.
     */
    @Override
    public String toString() {
        return String.format(Locale.US, ROW, id, name, color,
                String.format(Locale.US, "%,.2f", price), brand, getKind(), getDetails());
    }

    /**
     * The natural order is by id, and it is here so that every other comparison
     * has a stable tie-breaker to fall back on.
     *
     * Two vehicles at the same price would otherwise come out in whatever order
     * the sort happened to leave them in, and a list that reshuffles itself
     * between two identical runs is impossible to diff and impossible to trust.
     */
    @Override
    public int compareTo(Vehicle other) {
        return this.id.compareToIgnoreCase(other.id);
    }
}
'''

P0013_CAR = r'''package entity;

/**
 * A car: everything a Vehicle has, plus the two properties only a car has.
 *
 * Note what is NOT here - no id, no name, no price, no getters for them, no
 * copy of toString(). Writing a subclass that repeats its parent's fields is the
 * commonest way to "use inheritance" without getting anything from it.
 */
public class Car extends Vehicle {

    private String type;
    private int yearOfManufacture;

    public Car(String id, String name, String color, double price, String brand,
            String type, int yearOfManufacture) {
        super(id, name, color, price, brand);
        this.type = type;
        this.yearOfManufacture = yearOfManufacture;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getYearOfManufacture() {
        return yearOfManufacture;
    }

    public void setYearOfManufacture(int yearOfManufacture) {
        this.yearOfManufacture = yearOfManufacture;
    }

    @Override
    public String getKind() {
        return "Car";
    }

    @Override
    public String getDetails() {
        return "Type: " + type + ", Year: " + yearOfManufacture;
    }

    @Override
    public String toDataLine() {
        return "CAR," + getId() + "," + getName() + "," + getColor() + ","
                + getPrice() + "," + getBrand() + "," + type + "," + yearOfManufacture;
    }
}
'''

P0013_MOTORBIKE = r'''package entity;

import java.util.Locale;

/**
 * A motorbike: a Vehicle that can also be heard.
 *
 * makeSound() is required by the brief and arrives through the Soundable
 * interface rather than being invented on this class alone, so the report in
 * Function 6.2 can call it without knowing this class exists.
 */
public class Motorbike extends Vehicle implements Soundable {

    private double speed;
    private boolean requireLicense;

    public Motorbike(String id, String name, String color, double price, String brand,
            double speed, boolean requireLicense) {
        super(id, name, color, price, brand);
        this.speed = speed;
        this.requireLicense = requireLicense;
    }

    public double getSpeed() {
        return speed;
    }

    public void setSpeed(double speed) {
        this.speed = speed;
    }

    public boolean isRequireLicense() {
        return requireLicense;
    }

    public void setRequireLicense(boolean requireLicense) {
        this.requireLicense = requireLicense;
    }

    @Override
    public String getKind() {
        return "Motorbike";
    }

    @Override
    public String getDetails() {
        return String.format(Locale.US, "Speed: %.1fkm/h, License: %s",
                speed, requireLicense ? "Yes" : "No");
    }

    @Override
    public void makeSound() {
        System.out.println("Tin tin tin");
    }

    @Override
    public String toDataLine() {
        return "MOTORBIKE," + getId() + "," + getName() + "," + getColor() + ","
                + getPrice() + "," + getBrand() + "," + speed + "," + requireLicense;
    }
}
'''


# ════════════════════════════════════════════════════════════════
# bo — the collection, the rules, and the file
# ════════════════════════════════════════════════════════════════

P0013_MANAGER = r'''package bo;

import entity.Vehicle;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * The show room: ONE collection of vehicles, and every rule about it.
 *
 * This class never prints and never reads the keyboard. That is what makes the
 * rules testable: a method that both decides and displays can only be checked by
 * a human staring at a console.
 *
 * The collection is List<Vehicle>, not two lists and not List<Object>. One list
 * is what Function 0 asks for; the element type Vehicle is what lets Function
 * 6.2 sort cars and motorbikes against each other by price without a cast.
 *
 * ArrayList rather than LinkedList: this program searches and sorts far more
 * often than it inserts in the middle, and get(i) on an ArrayList is one array
 * access.
 */
public class VehicleManager {

    private final List<Vehicle> vehicles = new ArrayList<>();

    /**
     * Ids are compared case-insensitively everywhere, so "c001" typed at the
     * search prompt finds the vehicle stored as "C001". Doing the fold in ONE
     * place stops "add" and "search" from quietly disagreeing about what equal
     * means.
     */
    public Vehicle findById(String id) {
        if (id == null) {
            return null;
        }
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getId().equalsIgnoreCase(id.trim())) {
                return vehicle;
            }
        }
        return null;
    }

    /**
     * @throws Exception when the id is already taken - the one invariant of the
     *     whole program. The controller checks for a duplicate before it asks
     *     for the other six fields, purely so the user is not made to type them
     *     for nothing; this throw is what makes the rule TRUE rather than merely
     *     usually observed, because it also guards the file loader.
     */
    public void add(Vehicle vehicle) throws Exception {
        if (findById(vehicle.getId()) != null) {
            throw new Exception("Vehicle ID already exists.");
        }
        vehicles.add(vehicle);
    }

    public boolean remove(String id) {
        Vehicle found = findById(id);
        return found != null && vehicles.remove(found);
    }

    public boolean isEmpty() {
        return vehicles.isEmpty();
    }

    public int size() {
        return vehicles.size();
    }

    /**
     * A copy, not the field.
     *
     * Handing out the internal list would let the ui add to the show room
     * without going through add(), and the duplicate-id rule would become a
     * suggestion.
     */
    public List<Vehicle> getAll() {
        return new ArrayList<>(vehicles);
    }

    /** Used by Function 1 after a successful load: replace, never append. */
    public void replaceAll(List<Vehicle> loaded) {
        vehicles.clear();
        vehicles.addAll(loaded);
    }

    /**
     * Function 5.1 - every vehicle whose name CONTAINS the text, newest sort
     * order first ("descending", as the brief's own heading says).
     *
     * toLowerCase on both sides: a show room where searching "camry" fails to
     * find "Camry" is not a search feature.
     */
    public List<Vehicle> searchByName(String text) {
        String needle = text.toLowerCase();
        List<Vehicle> found = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getName().toLowerCase().contains(needle)) {
                found.add(vehicle);
            }
        }
        Collections.sort(found, byNameDescending());
        return found;
    }

    /** Function 6.2 - the whole show room, most expensive first. */
    public List<Vehicle> sortByPriceDescending() {
        List<Vehicle> sorted = getAll();
        Collections.sort(sorted, byPriceDescending());
        return sorted;
    }

    /**
     * Name Z->A, then id as the tie-breaker.
     *
     * The tie-breaker is the part that is easy to leave out and expensive to
     * leave out: two vehicles called "Vision" would otherwise appear in
     * whichever order the previous operation happened to leave them, and the
     * list would change between two runs that did the same thing.
     */
    private static Comparator<Vehicle> byNameDescending() {
        return new Comparator<Vehicle>() {
            @Override
            public int compare(Vehicle a, Vehicle b) {
                int byName = b.getName().compareToIgnoreCase(a.getName());
                return byName != 0 ? byName : a.compareTo(b);
            }
        };
    }

    /**
     * Price high -> low.
     *
     * Double.compare, never `(int) (b.getPrice() - a.getPrice())`. Subtracting
     * two doubles and casting to int reports "equal" for any pair less than 1.00
     * apart, so a 35,000.50 car and a 35,000.00 car sort at random - and it
     * overflows outright on large differences.
     */
    private static Comparator<Vehicle> byPriceDescending() {
        return new Comparator<Vehicle>() {
            @Override
            public int compare(Vehicle a, Vehicle b) {
                int byPrice = Double.compare(b.getPrice(), a.getPrice());
                return byPrice != 0 ? byPrice : a.compareTo(b);
            }
        };
    }
}
'''

P0013_FILE = r'''package bo;

import entity.Car;
import entity.Motorbike;
import entity.Vehicle;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * vehicles.txt: how a Vehicle becomes a line and how a line becomes a Vehicle.
 *
 * It is separate from VehicleManager because they answer different questions.
 * VehicleManager knows the RULES of the show room; this class knows the FORMAT
 * of one particular file. Changing to a database later replaces this class and
 * leaves the rules untouched, which is the test of whether a split was worth
 * making.
 *
 * The file lives at the project root, next to build.xml - not inside src/. A
 * relative path is resolved against the working directory, and NetBeans runs a
 * project from its root.
 */
public class VehicleFile {

    private static final String FILE_NAME = "vehicles.txt";

    /** Lines that were not a valid record; reported, not silently swallowed. */
    private int skipped;

    public int getSkipped() {
        return skipped;
    }

    /**
     * @throws Exception when the file is not there. That is a message for the
     *     user, not a stack trace: a show room that has never saved anything is
     *     an ordinary situation on the first run.
     */
    public List<Vehicle> load() throws Exception {
        skipped = 0;
        File file = new File(FILE_NAME);
        if (!file.exists()) {
            throw new Exception("Data file " + FILE_NAME + " does not exist.");
        }
        List<Vehicle> loaded = new ArrayList<>();
        // try-with-resources: the reader is closed even if a line throws
        // half-way through, and on Windows an unclosed reader keeps a lock on
        // the file that makes the very next "store" fail.
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                Vehicle vehicle = parse(line);
                if (vehicle == null) {
                    skipped++;
                } else {
                    loaded.add(vehicle);
                }
            }
        }
        return loaded;
    }

    public void save(List<Vehicle> vehicles) throws Exception {
        // `new FileWriter(file)` truncates. Appending would be the classic bug
        // here: every save would double the file, and the next load would fail
        // on the duplicate ids it had just written itself.
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_NAME))) {
            for (Vehicle vehicle : vehicles) {
                writer.write(vehicle.toDataLine());
                writer.newLine();
            }
        }
    }

    /**
     * One line -> one Vehicle, or null if the line is damaged.
     *
     * split(",", -1) keeps trailing empty fields, so a line ending in a comma is
     * seen as having a blank last column rather than one column too few. The
     * length check is exact: a line with the right count but the wrong kind word
     * still falls through to the default and returns null.
     *
     * Nothing here trusts the file. A hand-edited vehicles.txt is the normal way
     * this program meets bad data, and one bad line must cost one line, not the
     * whole load.
     */
    private static Vehicle parse(String line) {
        String[] parts = line.split(",", -1);
        if (parts.length != 8) {
            return null;
        }
        try {
            String kind = parts[0].trim().toUpperCase();
            String id = parts[1].trim();
            String name = parts[2].trim();
            String color = parts[3].trim();
            double price = Double.parseDouble(parts[4].trim());
            String brand = parts[5].trim();
            if (id.isEmpty() || name.isEmpty()) {
                return null;
            }
            if ("CAR".equals(kind)) {
                return new Car(id, name, color, price, brand,
                        parts[6].trim(), Integer.parseInt(parts[7].trim()));
            }
            if ("MOTORBIKE".equals(kind)) {
                return new Motorbike(id, name, color, price, brand,
                        Double.parseDouble(parts[6].trim()),
                        Boolean.parseBoolean(parts[7].trim()));
            }
            return null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
'''


# ════════════════════════════════════════════════════════════════
# utils — every keyboard read and every constraint, in one place
# ════════════════════════════════════════════════════════════════

P0013_VALIDATOR = r'''package utils;

import java.util.NoSuchElementException;
import java.util.Scanner;

/**
 * Every keyboard read in the program, and every constraint on what may be typed.
 *
 * ONE static Scanner over System.in. Opening a second Scanner on the same stream
 * is the classic LAB211 disappearing-input bug: the first one has already
 * buffered the rest of the line, and the second one blocks forever on input the
 * user has already typed.
 *
 * A private constructor because there is nothing to instantiate. `new
 * Validator()` compiling is a small invitation to a design mistake.
 *
 * The re-asking loops live here, so the controller never contains a `while` that
 * exists only to cope with a typo. Notice the shape of every method: it does not
 * return until it has a value the rest of the program can use, which is why no
 * caller in this project checks for null unless it deliberately asked for an
 * optional value.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    /** One letter and three digits: C001, M001. */
    public static final String ID_PATTERN = "[A-Za-z]\\d{3}";
    public static final String ID_ERROR =
            "ID must be one letter followed by 3 digits, for example C001.";

    public static final String NAME_PATTERN = "[A-Za-z0-9][A-Za-z0-9 \\-]{1,29}";
    public static final String NAME_ERROR =
            "Name must be 2 to 30 letters, digits, spaces or hyphens.";

    public static final String COLOR_PATTERN = "[A-Za-z][A-Za-z ]{1,14}";
    public static final String COLOR_ERROR = "Color must be 2 to 15 letters.";

    public static final String BRAND_PATTERN = "[A-Za-z0-9][A-Za-z0-9 \\-]{1,19}";
    public static final String BRAND_ERROR =
            "Brand must be 2 to 20 letters, digits, spaces or hyphens.";

    public static final String TYPE_PATTERN = "(?i)(Sport|Travel|Family|Pickup)";
    public static final String TYPE_ERROR = "Type must be one of: Sport, Travel, Family, Pickup.";

    public static final String PRICE_ERROR = "Price must be a positive number.";
    public static final String SPEED_ERROR = "Speed must be a positive number, at most 400 km/h.";
    public static final String YEAR_ERROR = "Year of manufacture must be from 1900 to 2100.";
    public static final String YES_NO_ERROR = "Please answer Y (yes) or N (no).";

    /**
     * The manufacture year is bounded by a CONSTANT, not by
     * java.time.Year.now().getValue().
     *
     * "No later than this year" sounds more correct, and it makes the program's
     * own error message change on 1 January - so the screen a marker diffs
     * against the submitted transcript stops matching, for a reason that is
     * nowhere in the code. A show room selling next year's models in December is
     * also perfectly ordinary. Where a rule has no deadline in the brief, prefer
     * the version that behaves the same tomorrow.
     */
    public static final int MIN_YEAR = 1900;
    public static final int MAX_YEAR = 2100;
    public static final double MAX_SPEED = 400;

    private Validator() {
    }

    /**
     * The single point where a line is read.
     *
     * On end-of-input (Ctrl-D, or a script that runs out of keystrokes) Scanner
     * throws NoSuchElementException, which reaches the user as a stack trace -
     * exactly the "interrupt the program" the brief forbids. Treating a closed
     * stdin as Quit is the only sane reading: there is nobody left to ask.
     */
    private static String nextLine() {
        try {
            if (!SCANNER.hasNextLine()) {
                System.out.println();
                System.exit(0);
            }
            return SCANNER.nextLine().trim();
        } catch (NoSuchElementException e) {
            System.exit(0);
            return "";
        }
    }

    // ── text ────────────────────────────────────────────────────

    private static String readPattern(String prompt, String pattern, String error, boolean required) {
        while (true) {
            System.out.print(prompt);
            String line = nextLine();
            if (line.isEmpty()) {
                if (!required) {
                    return null;
                }
                System.out.println(error);
                continue;
            }
            if (!line.matches(pattern)) {
                System.out.println(error);
                continue;
            }
            return line;
        }
    }

    public static String getPattern(String prompt, String pattern, String error) {
        return readPattern(prompt, pattern, error, true);
    }

    /** Update only: a blank line means "keep the old value" and returns null. */
    public static String getOptionalPattern(String prompt, String pattern, String error) {
        return readPattern(prompt, pattern, error, false);
    }

    // ── numbers ─────────────────────────────────────────────────

    private static Double readDouble(String prompt, double min, double max,
            String error, boolean required) {
        while (true) {
            System.out.print(prompt);
            String line = nextLine();
            if (line.isEmpty()) {
                if (!required) {
                    return null;
                }
                System.out.println(error);
                continue;
            }
            try {
                double value = Double.parseDouble(line);
                // The range check has to be inside the try: a value that parsed
                // but is out of range gets the SAME message as one that did not
                // parse, because from the user's point of view they made the
                // same mistake - they typed something that is not a price.
                if (value < min || value > max) {
                    System.out.println(error);
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println(error);
            }
        }
    }

    private static Integer readInt(String prompt, int min, int max, String error, boolean required) {
        while (true) {
            System.out.print(prompt);
            String line = nextLine();
            if (line.isEmpty()) {
                if (!required) {
                    return null;
                }
                System.out.println(error);
                continue;
            }
            try {
                int value = Integer.parseInt(line);
                if (value < min || value > max) {
                    System.out.println(error);
                    continue;
                }
                return value;
            } catch (NumberFormatException e) {
                System.out.println(error);
            }
        }
    }

    public static double getDouble(String prompt, double min, double max, String error) {
        return readDouble(prompt, min, max, error, true);
    }

    public static Double getOptionalDouble(String prompt, double min, double max, String error) {
        return readDouble(prompt, min, max, error, false);
    }

    public static int getInt(String prompt, int min, int max, String error) {
        return readInt(prompt, min, max, error, true);
    }

    public static Integer getOptionalInt(String prompt, int min, int max, String error) {
        return readInt(prompt, min, max, error, false);
    }

    // ── yes / no ────────────────────────────────────────────────

    private static Boolean readYesNo(String prompt, boolean required) {
        while (true) {
            System.out.print(prompt);
            String line = nextLine();
            if (line.isEmpty()) {
                if (!required) {
                    return null;
                }
                System.out.println(YES_NO_ERROR);
                continue;
            }
            if (line.equalsIgnoreCase("Y") || line.equalsIgnoreCase("YES")) {
                return Boolean.TRUE;
            }
            if (line.equalsIgnoreCase("N") || line.equalsIgnoreCase("NO")) {
                return Boolean.FALSE;
            }
            System.out.println(YES_NO_ERROR);
        }
    }

    public static boolean getYesNo(String prompt) {
        return readYesNo(prompt, true);
    }

    public static Boolean getOptionalYesNo(String prompt) {
        return readYesNo(prompt, false);
    }
}
'''


# ════════════════════════════════════════════════════════════════
# controller — reads input through the validator, calls bo, reports
# ════════════════════════════════════════════════════════════════

P0013_CONTROLLER = r'''package controller;

import bo.VehicleFile;
import bo.VehicleManager;
import entity.Car;
import entity.Motorbike;
import entity.Soundable;
import entity.Vehicle;
import java.util.List;
import utils.Validator;

/**
 * One method per menu item. Each one gathers input through Validator, asks
 * VehicleManager to do the work, and reports what happened.
 *
 * This is the layer that exists so the other two can stay clean: the ui knows
 * only which method a key press maps to, and bo knows only the rules. If you
 * deleted this class the input-gathering would have to move somewhere, and the
 * only two candidates are a bo that reads the keyboard or a ui full of business
 * logic.
 *
 * `unsaved` is the one piece of state that belongs here rather than in bo,
 * because it is a fact about this SESSION, not about the show room: the
 * collection cannot tell you whether anybody has looked at it since it changed.
 */
public class VehicleController {

    private final VehicleManager manager = new VehicleManager();
    private final VehicleFile file = new VehicleFile();

    private static final String LINE =
            "----------------------------------------------------------------------------------------";

    private boolean unsaved = false;

    public boolean hasUnsavedChanges() {
        return unsaved;
    }

    // ── Function 1 ──────────────────────────────────────────────

    public void loadFromFile() {
        System.out.println("--- Load data from file ---");
        try {
            List<Vehicle> loaded = file.load();
            manager.replaceAll(loaded);
            unsaved = false;
            System.out.println("Loaded " + loaded.size() + " vehicle(s) from vehicles.txt");
            if (file.getSkipped() > 0) {
                System.out.println(file.getSkipped() + " damaged line(s) were ignored.");
            }
        } catch (Exception e) {
            // Every message the user sees comes out of an exception raised by the
            // layer that knows the fact. The controller decides where it is
            // printed; it does not invent the words.
            System.out.println(e.getMessage());
        }
    }

    // ── Function 2 ──────────────────────────────────────────────

    /**
     * @param car true to add a Car, false to add a Motorbike. The two flows share
     *     five prompts and differ in two, so they share a method and branch at
     *     the end rather than being copied.
     */
    public void addVehicle(boolean car) {
        System.out.println("--- Add new " + (car ? "car" : "motorbike") + " ---");
        String id = Validator.getPattern("Enter id: ", Validator.ID_PATTERN, Validator.ID_ERROR)
                .toUpperCase();

        // Asked FIRST, before the other six prompts. The rule is enforced in
        // bo.add() as well; this check is here purely so a user who mistypes an
        // id is not made to fill in a whole form before being told.
        if (manager.findById(id) != null) {
            System.out.println("Vehicle ID already exists.");
            return;
        }

        String name = Validator.getPattern("Enter name: ",
                Validator.NAME_PATTERN, Validator.NAME_ERROR);
        String color = Validator.getPattern("Enter color: ",
                Validator.COLOR_PATTERN, Validator.COLOR_ERROR);
        double price = Validator.getDouble("Enter price: ",
                0.01, Double.MAX_VALUE, Validator.PRICE_ERROR);
        String brand = Validator.getPattern("Enter brand: ",
                Validator.BRAND_PATTERN, Validator.BRAND_ERROR);

        Vehicle vehicle;
        if (car) {
            String type = Validator.getPattern("Enter type (Sport/Travel/Family/Pickup): ",
                    Validator.TYPE_PATTERN, Validator.TYPE_ERROR);
            int year = Validator.getInt("Enter year of manufacture: ",
                    Validator.MIN_YEAR, Validator.MAX_YEAR, Validator.YEAR_ERROR);
            vehicle = new Car(id, name, color, price, brand, capitalise(type), year);
        } else {
            double speed = Validator.getDouble("Enter speed (km/h): ",
                    1, Validator.MAX_SPEED, Validator.SPEED_ERROR);
            boolean license = Validator.getYesNo("Require license? (Y/N): ");
            vehicle = new Motorbike(id, name, color, price, brand, speed, license);
        }

        try {
            manager.add(vehicle);
            unsaved = true;
            System.out.println("Add successfully!");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // ── Function 3 ──────────────────────────────────────────────

    /**
     * Blank keeps the old value, which is why every prompt here uses the
     * getOptional* family and every assignment is guarded by a null check.
     *
     * The current value is shown in brackets on each prompt. Without it the user
     * has to remember what they are choosing to keep, and "blank = no change" is
     * an invitation to blank the wrong field.
     */
    public void updateVehicle() {
        System.out.println("--- Update vehicle by ID ---");
        String id = Validator.getPattern("Enter id: ", Validator.ID_PATTERN, Validator.ID_ERROR);
        Vehicle vehicle = manager.findById(id);
        if (vehicle == null) {
            System.out.println("Vehicle does not exist");
            return;
        }

        System.out.println(Vehicle.header());
        System.out.println(LINE);
        System.out.println(vehicle);
        System.out.println("Leave a field blank to keep the current value.");

        String name = Validator.getOptionalPattern("Name [" + vehicle.getName() + "]: ",
                Validator.NAME_PATTERN, Validator.NAME_ERROR);
        if (name != null) {
            vehicle.setName(name);
        }
        String color = Validator.getOptionalPattern("Color [" + vehicle.getColor() + "]: ",
                Validator.COLOR_PATTERN, Validator.COLOR_ERROR);
        if (color != null) {
            vehicle.setColor(color);
        }
        Double price = Validator.getOptionalDouble("Price [" + vehicle.getPrice() + "]: ",
                0.01, Double.MAX_VALUE, Validator.PRICE_ERROR);
        if (price != null) {
            vehicle.setPrice(price);
        }
        String brand = Validator.getOptionalPattern("Brand [" + vehicle.getBrand() + "]: ",
                Validator.BRAND_PATTERN, Validator.BRAND_ERROR);
        if (brand != null) {
            vehicle.setBrand(brand);
        }

        // The two kind-specific fields. instanceof is unavoidable here and it is
        // honest: this is the one place in the program that is genuinely asking
        // "which form should I show?", not "how do I behave?".
        if (vehicle instanceof Car) {
            Car car = (Car) vehicle;
            String type = Validator.getOptionalPattern("Type [" + car.getType() + "]: ",
                    Validator.TYPE_PATTERN, Validator.TYPE_ERROR);
            if (type != null) {
                car.setType(capitalise(type));
            }
            Integer year = Validator.getOptionalInt(
                    "Year [" + car.getYearOfManufacture() + "]: ",
                    Validator.MIN_YEAR, Validator.MAX_YEAR, Validator.YEAR_ERROR);
            if (year != null) {
                car.setYearOfManufacture(year);
            }
        } else if (vehicle instanceof Motorbike) {
            Motorbike bike = (Motorbike) vehicle;
            Double speed = Validator.getOptionalDouble("Speed [" + bike.getSpeed() + "]: ",
                    1, Validator.MAX_SPEED, Validator.SPEED_ERROR);
            if (speed != null) {
                bike.setSpeed(speed);
            }
            Boolean license = Validator.getOptionalYesNo(
                    "Require license [" + (bike.isRequireLicense() ? "Y" : "N") + "] (Y/N): ");
            if (license != null) {
                bike.setRequireLicense(license);
            }
        }

        unsaved = true;
        System.out.println("Update successfully!");
        System.out.println(Vehicle.header());
        System.out.println(LINE);
        System.out.println(vehicle);
    }

    // ── Function 4 ──────────────────────────────────────────────

    public void deleteVehicle() {
        System.out.println("--- Delete vehicle by ID ---");
        String id = Validator.getPattern("Enter id: ", Validator.ID_PATTERN, Validator.ID_ERROR);
        Vehicle vehicle = manager.findById(id);
        if (vehicle == null) {
            System.out.println("Vehicle does not exist");
            return;
        }
        // Show WHAT is about to be deleted, not just the id that was typed. A
        // confirmation that only repeats the user's own keystroke confirms
        // nothing.
        System.out.println(Vehicle.header());
        System.out.println(LINE);
        System.out.println(vehicle);
        if (!Validator.getYesNo("Delete this vehicle? (Y/N): ")) {
            System.out.println("Delete cancelled.");
            return;
        }
        if (manager.remove(id)) {
            unsaved = true;
            System.out.println("Delete successfully!");
        } else {
            System.out.println("Delete failed!");
        }
    }

    // ── Function 5.1 / 5.2 ──────────────────────────────────────

    public void searchByName() {
        System.out.println("--- Search vehicle by name ---");
        String text = Validator.getPattern("Enter a part of the name: ",
                Validator.NAME_PATTERN, Validator.NAME_ERROR);
        List<Vehicle> found = manager.searchByName(text);
        if (found.isEmpty()) {
            System.out.println("No vehicle found.");
            return;
        }
        printTable(found, false);
        System.out.println("Found " + found.size() + " vehicle(s).");
    }

    public void searchById() {
        System.out.println("--- Search vehicle by id ---");
        String id = Validator.getPattern("Enter id: ", Validator.ID_PATTERN, Validator.ID_ERROR);
        Vehicle vehicle = manager.findById(id);
        if (vehicle == null) {
            System.out.println("Vehicle does not exist");
            return;
        }
        System.out.println(Vehicle.header());
        System.out.println(LINE);
        System.out.println(vehicle);
    }

    // ── Function 6.1 / 6.2 ──────────────────────────────────────

    public void showAll() {
        System.out.println("--- All vehicles in the show room ---");
        if (manager.isEmpty()) {
            System.out.println("The show room is empty.");
            return;
        }
        printTable(manager.getAll(), false);
    }

    public void showAllByPriceDescending() {
        System.out.println("--- All vehicles, most expensive first ---");
        if (manager.isEmpty()) {
            System.out.println("The show room is empty.");
            return;
        }
        printTable(manager.sortByPriceDescending(), true);
    }

    // ── Function 7 ──────────────────────────────────────────────

    public void storeToFile() {
        System.out.println("--- Store data to file ---");
        try {
            file.save(manager.getAll());
            unsaved = false;
            System.out.println("Stored " + manager.size() + " vehicle(s) to vehicles.txt");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    // ── shared ──────────────────────────────────────────────────

    /**
     * @param sound true only for Function 6.2, where the brief asks a motorbike
     *     to be heard. The test is `instanceof Soundable`, on the INTERFACE, so
     *     a future noisy vehicle joins in without this method being edited.
     */
    private void printTable(List<Vehicle> vehicles, boolean sound) {
        System.out.println(Vehicle.header());
        System.out.println(LINE);
        for (Vehicle vehicle : vehicles) {
            System.out.println(vehicle);
            if (sound && vehicle instanceof Soundable) {
                ((Soundable) vehicle).makeSound();
            }
        }
        System.out.println(LINE);
        System.out.println("Total: " + vehicles.size() + " vehicle(s)");
    }

    /** "travel" and "TRAVEL" are both accepted; "Travel" is what gets stored. */
    private static String capitalise(String word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
    }
}
'''


# ════════════════════════════════════════════════════════════════
# ui — the menus and the screen, and nothing else
# ════════════════════════════════════════════════════════════════

P0013_MENU = r'''package ui;

import java.util.ArrayList;
import java.util.List;
import utils.Validator;

/**
 * A menu that draws itself and returns a valid choice.
 *
 * There are four menus in this program (main, add, search, show) and they differ
 * only in their title and their lines. Written out longhand that is four copies
 * of the same print-and-validate block, and four places where the range check
 * can be wrong by one. Here the range cannot be wrong: it is derived from the
 * number of options that were added.
 */
public class Menu {

    private final String title;
    private final List<String> options = new ArrayList<>();

    public Menu(String title) {
        this.title = title;
    }

    /** Returns this so a menu can be built in one statement. */
    public Menu add(String option) {
        options.add(option);
        return this;
    }

    public int getChoice() {
        String heading = "===== " + title + " =====";
        System.out.println();
        System.out.println(heading);
        for (int i = 0; i < options.size(); i++) {
            System.out.println((i + 1) + ". " + options.get(i));
        }
        System.out.println(rule(heading.length()));
        return Validator.getInt("Your choice: ", 1, options.size(),
                "Please choose an option from 1 to " + options.size() + ".");
    }

    /**
     * String.repeat exists only from Java 11. LAB211 is marked on whatever JDK
     * the examiner has installed, and a loop compiles everywhere.
     */
    private static String rule(int width) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < width; i++) {
            builder.append('=');
        }
        return builder.toString();
    }
}
'''

P0013_MAIN = r'''package ui;

import controller.VehicleController;
import utils.Validator;

/**
 * The screen: which key press means which controller call, and nothing else.
 *
 * Every branch of every switch here is one line long. That is the test of
 * whether the layering worked - the moment a case needs an `if`, some rule has
 * leaked out of bo and into the menu.
 */
public class Main {

    public static void main(String[] args) {
        VehicleController controller = new VehicleController();

        Menu menu = new Menu("VEHICLE MANAGEMENT")
                .add("Load data from file")
                .add("Add new vehicle")
                .add("Update vehicle by ID")
                .add("Delete vehicle by ID")
                .add("Search vehicle")
                .add("Show vehicle list")
                .add("Store data to file")
                .add("Quit");

        while (true) {
            switch (menu.getChoice()) {
                case 1:
                    controller.loadFromFile();
                    break;
                case 2:
                    addMenu(controller);
                    break;
                case 3:
                    controller.updateVehicle();
                    break;
                case 4:
                    controller.deleteVehicle();
                    break;
                case 5:
                    searchMenu(controller);
                    break;
                case 6:
                    showMenu(controller);
                    break;
                case 7:
                    controller.storeToFile();
                    break;
                default:
                    quit(controller);
                    return;
            }
        }
    }

    /**
     * "Ask to continuous create new vehicle or go back to the main menu" -
     * Function 2, word for word. The question is asked after every attempt,
     * successful or not, because a user whose id was rejected almost always
     * wants to try again.
     */
    private static void addMenu(VehicleController controller) {
        Menu menu = new Menu("ADD NEW VEHICLE")
                .add("Car")
                .add("Motorbike")
                .add("Back to main menu");
        while (true) {
            int choice = menu.getChoice();
            if (choice == 3) {
                return;
            }
            controller.addVehicle(choice == 1);
            if (!Validator.getYesNo("Add another vehicle? (Y/N): ")) {
                return;
            }
        }
    }

    private static void searchMenu(VehicleController controller) {
        Menu menu = new Menu("SEARCH VEHICLE")
                .add("Search by name")
                .add("Search by id")
                .add("Back to main menu");
        while (true) {
            switch (menu.getChoice()) {
                case 1:
                    controller.searchByName();
                    break;
                case 2:
                    controller.searchById();
                    break;
                default:
                    return;
            }
        }
    }

    private static void showMenu(VehicleController controller) {
        Menu menu = new Menu("SHOW VEHICLE LIST")
                .add("Show all")
                .add("Show all (descending by price)")
                .add("Back to main menu");
        while (true) {
            switch (menu.getChoice()) {
                case 1:
                    controller.showAll();
                    break;
                case 2:
                    controller.showAllByPriceDescending();
                    break;
                default:
                    return;
            }
        }
    }

    /**
     * The brief does not ask for this, and a show room that silently throws away
     * an afternoon's data entry because the user pressed 8 instead of 7 is the
     * kind of thing "you must perform a requirements analysis step" is pointing
     * at. The question is only asked when there is something to lose.
     */
    private static void quit(VehicleController controller) {
        if (controller.hasUnsavedChanges()
                && Validator.getYesNo("There are unsaved changes. Store them before quitting? (Y/N): ")) {
            controller.storeToFile();
        }
        System.out.println("Goodbye.");
    }
}
'''


# ── the marker's keystrokes ──────────────────────────────────────
#
# Run 0 starts in an empty project directory: no vehicles.txt exists yet. It
# walks every refusable rule ONE AT A TIME (so each message is proven by a real
# console line and not by reading the source), then saves three vehicles.
#
# Run 1 is a NEW PROCESS in the SAME directory. It loads, and what it prints is
# the only real proof that Function 7 wrote something Function 1 can read back.
#
# Run 2 is a third process, and proves the delete performed in run 1 reached the
# file rather than only the collection.

P0013_RUN0_IN = (
    '99\n'                      # menu range check
    '1\n'                       # F1: load, but there is no file yet
    '6\n1\n3\n'                 # F6.1 on an empty show room
    '2\n'                       # F2: add submenu
    '1\n'                       # ... a car
    'c1\nC001\n'                # id refused, then accepted
    'A\nCamry\n'                # name refused, then accepted
    'Bl4ck\nBlack\n'            # color refused, then accepted
    '-5\n35000\n'               # price refused, then accepted
    '!\nToyota\n'               # brand refused, then accepted
    'Racing\ntravel\n'          # type refused, then accepted lower-case
    '1800\n2020\n'              # year refused, then accepted
    'y\n'                       # add another
    '2\n'                       # ... a motorbike
    'M001\nExciter 150\nBlue\n2500\nYamaha\n'
    '500\n150\n'                # speed refused, then accepted
    'maybe\ny\n'                # licence answer refused, then accepted
    'y\n'                       # add another
    '1\nC001\n'                 # ... duplicate id, refused before the other fields
    'y\n'                       # add another
    '1\nC002\nRanger\nWhite\n48000\nFord\nPickup\n2022\n'
    'n\n'                       # back to the main menu
    '3\nX999\n'                 # F3: update an id that does not exist
    '3\nC002\n'                 # F3: update a real one
    '\nSilver\n\n\nTravel\n\n'  # blank = keep, for four of the six fields
    '4\nZ001\n'                 # F4: delete an id that does not exist
    '4\nM001\nn\n'              # F4: confirmed with N
    '5\n'                       # F5 submenu
    '1\nzzz\n'                  # F5.1: no match
    '1\ner\n'                   # F5.1: two matches, descending
    '2\nC999\n'                 # F5.2: no match
    '2\nc001\n'                 # F5.2: found, lower-case id
    '3\n'
    '6\n1\n2\n3\n'              # F6.1 then F6.2
    '7\n'                       # F7: store
    '8\n'                       # quit - nothing unsaved, so no question
)

P0013_RUN1_IN = (
    '1\n'                       # F1: load what run 0 saved
    '6\n1\n3\n'                 # F6.1: the proof
    '4\nM001\ny\n'              # F4: delete, confirmed
    '8\n'                       # quit with unsaved changes ...
    'y\n'                       # ... and store on the way out
)

P0013_RUN2_IN = (
    '1\n'                       # F1: two vehicles now, not three
    '6\n1\n3\n'
    '8\n'
)

P0013_RUN0_OUT = r'''
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: Please choose an option from 1 to 8.
Your choice: --- Load data from file ---
Data file vehicles.txt does not exist.

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: --- All vehicles in the show room ---
The show room is empty.

===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== ADD NEW VEHICLE =====
1. Car
2. Motorbike
3. Back to main menu
===========================
Your choice: --- Add new car ---
Enter id: ID must be one letter followed by 3 digits, for example C001.
Enter id: Enter name: Name must be 2 to 30 letters, digits, spaces or hyphens.
Enter name: Enter color: Color must be 2 to 15 letters.
Enter color: Enter price: Price must be a positive number.
Enter price: Enter brand: Brand must be 2 to 20 letters, digits, spaces or hyphens.
Enter brand: Enter type (Sport/Travel/Family/Pickup): Type must be one of: Sport, Travel, Family, Pickup.
Enter type (Sport/Travel/Family/Pickup): Enter year of manufacture: Year of manufacture must be from 1900 to 2100.
Enter year of manufacture: Add successfully!
Add another vehicle? (Y/N): 
===== ADD NEW VEHICLE =====
1. Car
2. Motorbike
3. Back to main menu
===========================
Your choice: --- Add new motorbike ---
Enter id: Enter name: Enter color: Enter price: Enter brand: Enter speed (km/h): Speed must be a positive number, at most 400 km/h.
Enter speed (km/h): Require license? (Y/N): Please answer Y (yes) or N (no).
Require license? (Y/N): Add successfully!
Add another vehicle? (Y/N): 
===== ADD NEW VEHICLE =====
1. Car
2. Motorbike
3. Back to main menu
===========================
Your choice: --- Add new car ---
Enter id: Vehicle ID already exists.
Add another vehicle? (Y/N): 
===== ADD NEW VEHICLE =====
1. Car
2. Motorbike
3. Back to main menu
===========================
Your choice: --- Add new car ---
Enter id: Enter name: Enter color: Enter price: Enter brand: Enter type (Sport/Travel/Family/Pickup): Enter year of manufacture: Add successfully!
Add another vehicle? (Y/N): 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Update vehicle by ID ---
Enter id: Vehicle does not exist

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Update vehicle by ID ---
Enter id: ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C002   Ranger           White       48,000.00 Ford       Car        Type: Pickup, Year: 2022
Leave a field blank to keep the current value.
Name [Ranger]: Color [White]: Price [48000.0]: Brand [Ford]: Type [Pickup]: Year [2022]: Update successfully!
ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Delete vehicle by ID ---
Enter id: Vehicle does not exist

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Delete vehicle by ID ---
Enter id: ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
Delete this vehicle? (Y/N): Delete cancelled.

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== SEARCH VEHICLE =====
1. Search by name
2. Search by id
3. Back to main menu
==========================
Your choice: --- Search vehicle by name ---
Enter a part of the name: No vehicle found.

===== SEARCH VEHICLE =====
1. Search by name
2. Search by id
3. Back to main menu
==========================
Your choice: --- Search vehicle by name ---
Enter a part of the name: ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
----------------------------------------------------------------------------------------
Total: 2 vehicle(s)
Found 2 vehicle(s).

===== SEARCH VEHICLE =====
1. Search by name
2. Search by id
3. Back to main menu
==========================
Your choice: --- Search vehicle by id ---
Enter id: Vehicle does not exist

===== SEARCH VEHICLE =====
1. Search by name
2. Search by id
3. Back to main menu
==========================
Your choice: --- Search vehicle by id ---
Enter id: ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C001   Camry            Black       35,000.00 Toyota     Car        Type: Travel, Year: 2020

===== SEARCH VEHICLE =====
1. Search by name
2. Search by id
3. Back to main menu
==========================
Your choice: 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: --- All vehicles in the show room ---
ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C001   Camry            Black       35,000.00 Toyota     Car        Type: Travel, Year: 2020
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022
----------------------------------------------------------------------------------------
Total: 3 vehicle(s)

===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: --- All vehicles, most expensive first ---
ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022
C001   Camry            Black       35,000.00 Toyota     Car        Type: Travel, Year: 2020
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
Tin tin tin
----------------------------------------------------------------------------------------
Total: 3 vehicle(s)

===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Store data to file ---
Stored 3 vehicle(s) to vehicles.txt

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: Goodbye.'''
P0013_RUN1_OUT = r'''
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Load data from file ---
Loaded 3 vehicle(s) from vehicles.txt

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: --- All vehicles in the show room ---
ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C001   Camry            Black       35,000.00 Toyota     Car        Type: Travel, Year: 2020
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022
----------------------------------------------------------------------------------------
Total: 3 vehicle(s)

===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Delete vehicle by ID ---
Enter id: ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
M001   Exciter 150      Blue         2,500.00 Yamaha     Motorbike  Speed: 150.0km/h, License: Yes
Delete this vehicle? (Y/N): Delete successfully!

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: There are unsaved changes. Store them before quitting? (Y/N): --- Store data to file ---
Stored 2 vehicle(s) to vehicles.txt
Goodbye.'''
P0013_RUN2_OUT = r'''
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: --- Load data from file ---
Loaded 2 vehicle(s) from vehicles.txt

===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: 
===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: --- All vehicles in the show room ---
ID     Name             Color           Price Brand      Kind       Details
----------------------------------------------------------------------------------------
C001   Camry            Black       35,000.00 Toyota     Car        Type: Travel, Year: 2020
C002   Ranger           Silver      48,000.00 Ford       Car        Type: Travel, Year: 2022
----------------------------------------------------------------------------------------
Total: 2 vehicle(s)

===== SHOW VEHICLE LIST =====
1. Show all
2. Show all (descending by price)
3. Back to main menu
=============================
Your choice: 
===== VEHICLE MANAGEMENT =====
1. Load data from file
2. Add new vehicle
3. Update vehicle by ID
4. Delete vehicle by ID
5. Search vehicle
6. Show vehicle list
7. Store data to file
8. Quit
==============================
Your choice: Goodbye.'''


solution(
    'J1.L.P0013',
    title_vi='Quản lý phương tiện trong showroom',
    files=[('src/entity/Soundable.java', P0013_SOUNDABLE),
           ('src/entity/Vehicle.java', P0013_VEHICLE),
           ('src/entity/Car.java', P0013_CAR),
           ('src/entity/Motorbike.java', P0013_MOTORBIKE),
           ('src/bo/VehicleManager.java', P0013_MANAGER),
           ('src/bo/VehicleFile.java', P0013_FILE),
           ('src/controller/VehicleController.java', P0013_CONTROLLER),
           ('src/utils/Validator.java', P0013_VALIDATOR),
           ('src/ui/Menu.java', P0013_MENU),
           ('src/ui/Main.java', P0013_MAIN)],
    main_class='ui.Main',
    runs=[(P0013_RUN0_IN, P0013_RUN0_OUT),
          (P0013_RUN1_IN, P0013_RUN1_OUT),
          (P0013_RUN2_IN, P0013_RUN2_OUT)],
    explain_en='''<p><strong>Ten classes is a lot to meet at once, so here is the map first.</strong>
<code>entity</code> holds four types and no behaviour worth the name: <code>Vehicle</code> (abstract —
id, name, color, price, brand, the table row, the natural order), <code>Car</code> (type, year),
<code>Motorbike</code> (speed, licence, <code>makeSound()</code>) and the <code>Soundable</code>
interface. <code>bo</code> holds two: <code>VehicleManager</code> is the show room — one
<code>List&lt;Vehicle&gt;</code>, find/add/remove, the two sort orders — and <code>VehicleFile</code>
knows one thing only, the layout of <code>vehicles.txt</code>. <code>controller</code> holds
<code>VehicleController</code>: one method per menu item, each gathering input, calling
<code>bo</code>, and reporting. <code>utils/Validator</code> owns the single <code>Scanner</code> and
every constraint. <code>ui</code> holds <code>Menu</code> (a menu that draws itself and returns a valid
choice) and <code>Main</code> (four menus wired to controller calls).</p>
<p><strong>Why the layers fall exactly there.</strong> The test for each boundary is the question it
answers. <code>entity</code> answers "what is a vehicle?" — so it has no <code>Scanner</code> and no
<code>System.out</code> except the one line the brief demands, <code>makeSound()</code>.
<code>bo</code> answers "what is legal in the show room?" — so it throws
<code>Exception("Vehicle ID already exists.")</code> and never prints, which is what makes the rule
testable by something other than a human reading a console. <code>controller</code> answers "what
happens when the user presses 3?" — it is the only layer allowed to know both the keyboard and the
rules. <code>ui</code> answers "what is on the screen?"; every branch of every <code>switch</code> in
<code>Main</code> is one line long, and the moment a branch needs an <code>if</code>, a rule has leaked
upwards. Splitting <code>bo</code> in two is the one decision worth defending out loud:
<code>VehicleManager</code> knows the rules, <code>VehicleFile</code> knows a file format, and
swapping the text file for a database later replaces one class and leaves the other untouched. That is
the test of whether a split earned its keep.</p>
<p><strong>Why this is a hierarchy and not one class with a <code>type</code> String.</strong> The
tempting shortcut is a single <code>Vehicle</code> carrying every field — id, name, colour, price,
brand, carType, year, speed, requiresLicence — plus a <code>String kind</code> that says which half is
real. It compiles, and it is wrong in four ways that all show up in this exact assignment. Every car
carries a meaningless <code>speed</code> and every motorbike a meaningless <code>year</code>, so the
table has to decide what to print by testing a string, and a typo in that string is a run-time
mystery rather than a compile error. Function 6.2 asks a motorbike to sound; with a type field the
report grows an <code>if (v.getKind().equals("Motorbike"))</code>, which is the same test the
constructor already did and the same test the file parser already did — three copies of one fact. The
brief's own headline requirement, "designed so that adding a new vehicle is easy", becomes false:
adding a Truck means opening <code>Vehicle</code>, adding two fields, then hunting every
<code>equals("...")</code> in the project. And nothing stops a caller building a motorbike with a
manufacture year. With the hierarchy, all four disappear: the compiler will not let a
<code>Car</code> have a speed, the report calls <code>getDetails()</code> and does not care, and a
Truck is one new file.</p>
<p><strong>The interface is the part most solutions skip.</strong> Function 6.2 says "if vehicle is a
motorbike type then call the makeSound function", and the obvious translation is
<code>if (v instanceof Motorbike)</code>. This solution writes <code>if (v instanceof Soundable)</code>
instead. The difference is which question is being asked: identity ("is this the class I know about?")
versus capability ("can this thing be heard?"). Ask the second and a Truck with an air horn joins in the
day it is written, by implementing one interface; ask the first and the truck is silent, and the bug
lives in a report file nobody thinks to open. The brief asks for interfaces in Function 0 — this is one
that the program genuinely needs, rather than an empty <code>IManageable</code> added to satisfy a
checklist.</p>
<p><strong>One collection, and it is <code>List&lt;Vehicle&gt;</code>.</strong> Function 0 is explicit,
and the payoff is Function 6.2: sorting cars and motorbikes against each other by price is a single
<code>Collections.sort</code> on a single list. Two lists — one of cars, one of motorbikes — would make
that function a merge, would make "search by name" two loops, and would make the duplicate-id rule need
checking twice. <code>ArrayList</code> rather than <code>LinkedList</code> because this program searches
and sorts constantly and inserts in the middle never. <code>getAll()</code> hands back a
<strong>copy</strong>: give the ui the field itself and it can add to the show room without going
through <code>add()</code>, and the one invariant in the program becomes a suggestion.</p>
<p><strong>The comparator trap.</strong> Sorting by price descending is where this assignment quietly
fails people. <code>(int) (b.getPrice() - a.getPrice())</code> looks fine and is broken twice over: any
two prices less than 1.00 apart cast to 0 and are reported equal, so 35,000.50 and 35,000.00 sort at
random; and a large difference overflows <code>int</code> outright and reverses the order.
<code>Double.compare(b.getPrice(), a.getPrice())</code> is the correct form. Both comparators then fall
back on id (<code>compareTo</code>, the class's natural order) as a tie-breaker — without it, two
vehicles at the same price appear in whatever order the previous operation happened to leave them, and a
list that reshuffles itself between two identical runs cannot be diffed and cannot be trusted.</p>
<p><strong>The file, which is where marks are actually lost.</strong> <code>vehicles.txt</code> lives at
the <em>project root</em>, beside <code>build.xml</code>, not inside <code>src/</code> — a relative path
is resolved against the working directory and NetBeans runs a project from its root. <code>save()</code>
opens <code>new FileWriter(name)</code>, which truncates; the classic bug is opening it in append mode,
after which every save doubles the file and the next load fails on duplicate ids the program wrote to
itself. <code>load()</code> throws a <em>message</em>, not a stack trace, when the file is absent,
because a show room that has never saved anything is an ordinary first run.
<code>split(",", -1)</code> keeps trailing empty fields, so a line ending in a comma reads as a blank
last column instead of one column too few. And the parser trusts nothing: a damaged line costs one line,
not the whole load, and the count of skipped lines is reported rather than swallowed. That path is the
one thing here the scripted runs cannot reach, because the program itself only ever writes well-formed
lines — it is reached by hand-editing the file, which is exactly how this program will meet bad data in
real life.</p>
<p><strong>"Remember that the constraints must be checked" — and the brief never says what they
are.</strong> That is the requirements-analysis step the last paragraph of the sheet is pointing at, so
they are defined here and stated on screen: id is one letter and three digits and must be unique; name
2–30 letters, digits, spaces or hyphens; colour 2–15 letters; price a positive number; brand 2–20
characters; a car's type one of Sport/Travel/Family/Pickup; year 1900–2100; speed positive and at most
400 km/h; the licence answer Y or N. Every rule has exactly ONE message and every message is printed by
<code>Validator</code>, so the same mistake reads the same way wherever it is made. Note the name rule
excludes commas on purpose — the CSV separator is a comma, and a name containing one would produce a
line the parser cannot read back. Choosing the validation to protect the file format is a decision, not
an accident, and it is worth saying so.</p>
<p><strong>Why the year limit is a constant and not <code>Year.now()</code>.</strong> "No later than
this year" sounds more correct and is worse: the program's own error message changes on 1 January, so a
transcript submitted in December stops matching the program in January for a reason that appears nowhere
in the code. A show room advertising next year's models in December is also entirely normal. Where a
rule has no deadline in the brief, prefer the version that behaves the same tomorrow.</p>
<p><strong>Two small traps that cost whole afternoons.</strong> First, <code>Locale</code>:
<code>String.format("%,.2f", price)</code> asks the <em>default</em> locale for its separators, so the
same code prints <code>35,000.00</code> on one machine and <code>35.000,00</code> on another — the
marker's screen differs from the submitted one and it looks like a code bug.
<code>String.format(Locale.US, ...)</code> pins it. Second, the <code>Scanner</code>: there is exactly
one, <code>private static final</code> in <code>Validator</code>. Opening a second <code>Scanner</code>
on <code>System.in</code> is the classic LAB211 disappearing-input bug — the first has already buffered
the rest of the stream and the second blocks on input the user already typed. <code>Validator</code>
also treats a closed stdin as Quit rather than letting <code>NoSuchElementException</code> print a stack
trace, which is the "must not interrupt the program" rule taken seriously.</p>
<p><strong>Update means "blank keeps the old value", and that shapes the whole method.</strong> Every
prompt uses the <code>getOptional*</code> family, which returns <code>null</code> for an empty line, and
every assignment is guarded by a null check. Each prompt also shows the current value in brackets —
without it the user has to remember what they are choosing to keep, and "blank = no change" turns into
an invitation to blank the wrong field. The one <code>instanceof</code> in the controller is here, and it
is honest: this is genuinely the question "which form do I show?", not "how do I behave?", and forms are
not polymorphic.</p>
<p><strong>Where the brief contradicts itself.</strong> Four places, and noticing them counts in your
favour. (1) Function 0 says "use only one collection to store <em>animals</em>" — a copy-paste from a
sibling assignment; it means vehicles, and one collection is what was built. (2) Function 6's prose says
the submenu offers "show all or <em>by type</em>", but its own sub-functions and the menu list at the top
of the sheet both say <em>show all</em> and <em>show all descending by price</em>; the enumerated list is
the contract, so that is what the submenu offers. (3) Both search sub-functions are numbered
"F.5.1" — the second is 5.2. (4) Quit is listed as "Others- Quit" with no number; it is option 8 here.
The one literal message string the sheet does give is <code>Vehicle does not exist</code>, with no full
stop, and it is copied exactly — including into the delete and search-by-id paths, where the sheet only
implies it.</p>
<p><strong>One thing added that the brief does not ask for.</strong> Quitting with unsaved changes asks
whether to store first. The sheet says "you must perform a requirements analysis step and build the
application according to real requirements", and a show room that throws away an afternoon of data entry
because the user pressed 8 instead of 7 does not meet a real requirement. The question is asked only when
there is something to lose, which is why a dirty flag lives in the controller and not in
<code>bo</code>: whether anyone has saved is a fact about this session, not about the show room.</p>
<p><strong>How this was verified — and why it took three processes.</strong> Compiling proves nothing
about a file. Run 0 starts in an empty directory: it presses 99 at the menu, loads with no file present,
shows an empty list, then adds a car with <em>every one of the seven rules refused one at a time</em> so
that every message is proven by a real console line, adds a motorbike refusing the speed and the Y/N
answer, is refused a duplicate id before being asked for the other six fields, updates a vehicle leaving
four fields blank, is told <code>Vehicle does not exist</code> for update, delete and search-by-id,
cancels a delete at the confirmation, searches a name with no match and one with two matches (returned
Z→A), shows both listings — the motorbike sounds <code>Tin tin tin</code> in the descending-price one and
not in the plain one — and stores three vehicles. Run 1 is a <strong>new JVM in the same directory</strong>:
it loads and prints those three back, which is the only real proof that Function 7 wrote something
Function 1 can read. It then deletes the motorbike, quits, and answers the unsaved-changes question.
Run 2 is a third process and loads <em>two</em> vehicles, proving the deletion reached the file and not
just the collection. All three transcripts are diffed character by character.</p>
<p><strong>What an examiner will ask.</strong> "Why an abstract class rather than an interface for
<code>Vehicle</code>?" — because the five shared fields need an implementation to live in, and an
interface cannot hold state; <code>Soundable</code> is an interface precisely because it holds none.
"Show me where the duplicate-id rule is enforced" — <code>bo.VehicleManager.add()</code>, which throws;
the controller's earlier check is a courtesy so the user is not made to fill in a form for nothing.
"What happens if I edit vehicles.txt and break a line?" — that line is skipped and counted, the rest
loads. "Where would you add a Truck?" — one new class in <code>entity</code>, one branch in the add
submenu, one word in the file parser; nothing in <code>VehicleManager</code>, nothing in the two
sorts, nothing in the report.</p>''',
    explain_vi='''<p><strong>Mười lớp là hơi nhiều để gặp cùng lúc, nên hãy xem bản đồ trước.</strong>
<code>entity</code> giữ bốn kiểu và gần như không có hành vi: <code>Vehicle</code> (trừu tượng — id, tên,
màu, giá, hãng, dòng bảng, thứ tự tự nhiên), <code>Car</code> (loại xe, năm sản xuất),
<code>Motorbike</code> (tốc độ, bằng lái, <code>makeSound()</code>) và giao diện
<code>Soundable</code>. <code>bo</code> giữ hai lớp: <code>VehicleManager</code> là cái showroom — một
<code>List&lt;Vehicle&gt;</code>, tìm/thêm/xoá, hai kiểu sắp xếp — còn <code>VehicleFile</code> chỉ biết
đúng một việc: định dạng của <code>vehicles.txt</code>. <code>controller</code> giữ
<code>VehicleController</code>: mỗi mục thực đơn một phương thức, mỗi phương thức nhận dữ liệu vào, gọi
<code>bo</code>, rồi báo kết quả. <code>utils/Validator</code> sở hữu <code>Scanner</code> duy nhất và
toàn bộ ràng buộc. <code>ui</code> giữ <code>Menu</code> (thực đơn tự vẽ và trả về lựa chọn hợp lệ) và
<code>Main</code> (bốn thực đơn nối tới các lời gọi controller).</p>
<p><strong>Vì sao các tầng nằm đúng chỗ đó.</strong> Phép thử cho mỗi ranh giới là câu hỏi mà tầng đó
trả lời. <code>entity</code> trả lời "phương tiện là gì?" — nên nó không có <code>Scanner</code> và
không có <code>System.out</code>, trừ đúng một dòng đề bắt buộc là <code>makeSound()</code>.
<code>bo</code> trả lời "điều gì là hợp lệ trong showroom?" — nên nó ném
<code>Exception("Vehicle ID already exists.")</code> và không bao giờ in, chính điều đó khiến luật kiểm
được bằng thứ khác ngoài mắt người đọc màn hình. <code>controller</code> trả lời "người dùng bấm 3 thì
chuyện gì xảy ra?" — đây là tầng duy nhất được phép biết cả bàn phím lẫn luật. <code>ui</code> trả lời
"trên màn hình có gì?"; mọi nhánh của mọi <code>switch</code> trong <code>Main</code> đều dài đúng một
dòng, và ngay khi một nhánh cần đến <code>if</code> là đã có luật rò lên trên. Việc tách
<code>bo</code> làm hai là quyết định đáng nói thành lời khi bảo vệ: <code>VehicleManager</code> biết
luật, <code>VehicleFile</code> biết một định dạng tệp, và sau này đổi tệp văn bản sang cơ sở dữ liệu thì
chỉ thay một lớp còn lớp kia nguyên vẹn. Đó mới là phép thử xem một lần tách có đáng hay không.</p>
<p><strong>Vì sao phải là cây kế thừa chứ không phải một lớp với trường <code>type</code> kiểu
String.</strong> Lối tắt hấp dẫn là một lớp <code>Vehicle</code> duy nhất mang đủ mọi trường — id, tên,
màu, giá, hãng, loại xe, năm, tốc độ, cần bằng lái — kèm một <code>String kind</code> cho biết nửa nào
là thật. Nó biên dịch được, và nó sai theo bốn cách mà cả bốn đều lộ ra ngay trong chính bài này. Mọi xe
hơi phải mang một <code>speed</code> vô nghĩa và mọi xe máy mang một <code>year</code> vô nghĩa, nên bảng
phải quyết định in gì bằng cách so chuỗi, và gõ sai chuỗi đó thành một bí ẩn lúc chạy chứ không phải lỗi
biên dịch. Chức năng 6.2 bắt xe máy kêu; với trường kiểu chuỗi thì báo cáo mọc thêm
<code>if (v.getKind().equals("Motorbike"))</code>, đúng phép thử mà constructor đã làm và bộ đọc tệp
cũng đã làm — ba bản sao của một sự thật. Yêu cầu ở ngay đầu đề, "thiết kế sao cho thêm loại phương tiện
mới thật dễ", trở thành sai: thêm xe tải nghĩa là mở <code>Vehicle</code>, thêm hai trường, rồi đi lùng
từng chỗ <code>equals("...")</code> trong cả project. Và chẳng có gì ngăn ai đó dựng một xe máy có năm sản
xuất. Với cây kế thừa, cả bốn biến mất: trình biên dịch không cho <code>Car</code> có tốc độ, báo cáo chỉ
gọi <code>getDetails()</code> và không cần quan tâm, còn xe tải là một tệp mới.</p>
<p><strong>Cái giao diện là phần mà đa số lời giải bỏ qua.</strong> Chức năng 6.2 viết "nếu là xe máy
thì gọi hàm makeSound", và cách dịch hiển nhiên là <code>if (v instanceof Motorbike)</code>. Lời giải
này viết <code>if (v instanceof Soundable)</code>. Khác nhau ở câu hỏi đang được đặt ra: danh tính ("cái
này có phải lớp mà tôi biết không?") hay khả năng ("cái này có phát ra tiếng được không?"). Hỏi kiểu thứ
hai thì một chiếc xe tải có còi hơi sẽ kêu ngay ngày nó ra đời, chỉ bằng cách cài đặt một giao diện; hỏi
kiểu thứ nhất thì xe tải câm lặng, và lỗi nằm trong một tệp báo cáo chẳng ai nghĩ tới việc mở ra. Đề yêu
cầu có interface ở Chức năng 0 — đây là interface mà chương trình <em>thật sự cần</em>, chứ không phải
một <code>IManageable</code> rỗng thêm vào cho đủ mục.</p>
<p><strong>Một tập hợp duy nhất, và nó là <code>List&lt;Vehicle&gt;</code>.</strong> Chức năng 0 nói
rõ điều này, và phần thưởng nằm ở Chức năng 6.2: xếp xe hơi và xe máy chung với nhau theo giá chỉ là một
lệnh <code>Collections.sort</code> trên một danh sách. Hai danh sách — một cho xe hơi, một cho xe máy —
sẽ biến chức năng đó thành phép trộn, biến "tìm theo tên" thành hai vòng lặp, và bắt luật trùng id phải
kiểm hai lần. Dùng <code>ArrayList</code> chứ không <code>LinkedList</code> vì chương trình này tìm và
sắp xếp liên tục còn chèn giữa thì không bao giờ. <code>getAll()</code> trả về một <strong>bản
sao</strong>: đưa thẳng trường ra cho tầng ui thì ui có thể thêm xe vào showroom mà không qua
<code>add()</code>, và bất biến duy nhất của chương trình tụt xuống thành lời khuyên.</p>
<p><strong>Cái bẫy ở bộ so sánh.</strong> Sắp xếp giảm dần theo giá là chỗ bài này lặng lẽ đánh trượt
người làm. <code>(int) (b.getPrice() - a.getPrice())</code> trông ổn mà sai tới hai lần: hai giá cách
nhau dưới 1.00 đều ép về 0 và bị coi là bằng nhau, nên 35,000.50 và 35,000.00 xếp ngẫu nhiên; còn chênh
lệch lớn thì tràn <code>int</code> và lật ngược thứ tự. Dạng đúng là
<code>Double.compare(b.getPrice(), a.getPrice())</code>. Sau đó cả hai bộ so sánh đều lấy id
(<code>compareTo</code>, thứ tự tự nhiên của lớp) làm tiêu chí phá hoà — thiếu nó thì hai xe cùng giá sẽ
hiện theo thứ tự mà thao tác trước đó tình cờ để lại, và một danh sách tự xáo trộn giữa hai lần chạy
giống hệt nhau thì không thể so sánh và không thể tin.</p>
<p><strong>Phần tệp tin, nơi thật sự mất điểm.</strong> <code>vehicles.txt</code> nằm ở <em>gốc
project</em>, cạnh <code>build.xml</code>, không nằm trong <code>src/</code> — đường dẫn tương đối được
tính từ thư mục làm việc, và NetBeans chạy project từ gốc. <code>save()</code> mở
<code>new FileWriter(name)</code>, tức là ghi đè; lỗi kinh điển là mở ở chế độ nối thêm, sau đó mỗi lần
lưu tệp lại dài gấp đôi và lần nạp kế tiếp chết vì những id trùng do chính chương trình ghi ra.
<code>load()</code> ném một <em>thông báo</em> chứ không phải stack trace khi không có tệp, vì một
showroom chưa từng lưu gì là chuyện bình thường ở lần chạy đầu. <code>split(",", -1)</code> giữ lại các
cột rỗng ở cuối, nên dòng kết thúc bằng dấu phẩy được hiểu là có cột cuối rỗng thay vì thiếu một cột. Và
bộ đọc không tin gì cả: một dòng hỏng chỉ mất một dòng, không mất cả lần nạp, và số dòng bị bỏ qua được
báo ra chứ không nuốt lặng. Đó cũng là nhánh duy nhất ở đây mà các lần chạy kiểm không chạm tới được, vì
chính chương trình chỉ ghi ra những dòng đúng khuôn — nhánh đó chỉ tới khi có người sửa tay tệp dữ liệu,
mà đó đúng là cách chương trình này gặp dữ liệu hỏng ngoài đời.</p>
<p><strong>"Nhớ kiểm tra các ràng buộc" — mà đề không hề nói ràng buộc là gì.</strong> Đó chính là bước
phân tích yêu cầu mà đoạn cuối đề nhắc tới, nên ở đây các ràng buộc được định nghĩa và nói rõ ra màn
hình: id là một chữ cái và ba chữ số, phải là duy nhất; tên 2–30 ký tự chữ, số, khoảng trắng hoặc gạch
nối; màu 2–15 chữ cái; giá là số dương; hãng 2–20 ký tự; loại xe hơi thuộc Sport/Travel/Family/Pickup;
năm sản xuất 1900–2100; tốc độ dương và không quá 400 km/h; câu bằng lái trả lời Y hoặc N. Mỗi luật có
đúng MỘT thông báo và mọi thông báo đều do <code>Validator</code> in ra, nên cùng một lỗi thì đọc lên
giống nhau ở mọi chỗ. Chú ý luật về tên cố tình loại dấu phẩy — dấu phân cách trong tệp là dấu phẩy, và
một cái tên có dấu phẩy sẽ tạo ra dòng mà bộ đọc không đọc lại được. Chọn ràng buộc để bảo vệ định dạng
tệp là một quyết định, không phải tình cờ, và nên nói ra điều đó.</p>
<p><strong>Vì sao giới hạn năm là hằng số chứ không phải <code>Year.now()</code>.</strong> "Không muộn
hơn năm nay" nghe đúng hơn nhưng tệ hơn: thông báo lỗi của chính chương trình đổi vào ngày 1 tháng 1, nên
bản ghi màn hình nộp hồi tháng 12 sang tháng 1 là hết khớp, vì một lý do không nằm ở đâu trong mã nguồn.
Một showroom quảng cáo đời xe năm sau ngay từ tháng 12 cũng là chuyện hoàn toàn bình thường. Khi một luật
không có mốc thời gian trong đề, hãy chọn cách cư xử giống hệt nhau vào ngày mai.</p>
<p><strong>Hai cái bẫy nhỏ ngốn nguyên cả buổi chiều.</strong> Thứ nhất là <code>Locale</code>:
<code>String.format("%,.2f", price)</code> hỏi locale <em>mặc định</em> về dấu phân nhóm và dấu thập
phân, nên cùng một đoạn mã in ra <code>35,000.00</code> trên máy này và <code>35.000,00</code> trên máy
khác — màn hình của người chấm khác với bản đã nộp, mà trông thì y như một lỗi lập trình.
<code>String.format(Locale.US, ...)</code> ghim nó lại. Thứ hai là <code>Scanner</code>: chỉ có đúng
một, <code>private static final</code> trong <code>Validator</code>. Mở <code>Scanner</code> thứ hai
trên <code>System.in</code> là lỗi "mất dữ liệu nhập" kinh điển của LAB211 — cái thứ nhất đã đệm sẵn
phần còn lại của luồng, cái thứ hai đứng chờ thứ mà người dùng đã gõ rồi. <code>Validator</code> cũng
coi stdin đóng là lệnh Thoát thay vì để <code>NoSuchElementException</code> in stack trace, đó là cách
hiểu nghiêm túc yêu cầu "không được để chương trình bị ngắt".</p>
<p><strong>Sửa nghĩa là "để trống thì giữ nguyên", và điều đó định hình cả phương thức.</strong> Mọi lời
nhắc đều dùng nhóm <code>getOptional*</code>, trả về <code>null</code> khi dòng nhập rỗng, và mọi phép
gán đều có kiểm null bảo vệ. Mỗi lời nhắc còn hiện giá trị hiện tại trong ngoặc vuông — thiếu nó thì
người dùng phải tự nhớ mình đang chọn giữ cái gì, và "để trống = không đổi" biến thành lời mời xoá nhầm
trường. Chỗ duy nhất dùng <code>instanceof</code> trong controller nằm ở đây, và nó lương thiện: đây thật
sự là câu hỏi "tôi phải hiện biểu mẫu nào?", không phải "tôi phải cư xử ra sao?", mà biểu mẫu thì không
đa hình được.</p>
<p><strong>Những chỗ đề tự mâu thuẫn.</strong> Bốn chỗ, và nhận ra chúng được tính điểm cho bạn. (1)
Chức năng 0 viết "chỉ dùng một tập hợp để lưu <em>động vật</em>" — dán nhầm từ một bài khác; ý là phương
tiện, và một tập hợp là đúng thứ đã dựng. (2) Phần lời của Chức năng 6 nói thực đơn con cho chọn "hiện
tất cả hoặc <em>theo loại</em>", nhưng chính các mục con của nó và danh sách thực đơn ở đầu đề đều ghi là
<em>hiện tất cả</em> và <em>hiện tất cả giảm dần theo giá</em>; danh sách đánh số mới là bản có hiệu lực,
nên thực đơn con làm theo đó. (3) Cả hai mục tìm kiếm đều được đánh số "F.5.1" — mục thứ hai phải là 5.2.
(4) Thoát được ghi là "Others- Quit", không đánh số; ở đây nó là lựa chọn 8. Chuỗi thông báo duy nhất mà
đề cho nguyên văn là <code>Vehicle does not exist</code>, không có dấu chấm, và nó được chép y nguyên —
kể cả sang nhánh xoá và tìm theo id, nơi đề chỉ ngụ ý.</p>
<p><strong>Một thứ được thêm mà đề không đòi.</strong> Thoát khi còn thay đổi chưa lưu thì hỏi có lưu
trước không. Đề viết "bạn phải thực hiện bước phân tích yêu cầu và xây dựng ứng dụng theo yêu cầu thực
tế", mà một showroom vứt đi cả buổi chiều nhập liệu chỉ vì người dùng bấm 8 thay vì 7 thì không đáp ứng
yêu cầu thực tế nào cả. Câu hỏi chỉ hiện khi có thứ để mất, và đó là lý do cờ "chưa lưu" nằm ở controller
chứ không ở <code>bo</code>: đã lưu hay chưa là sự thật về <em>phiên làm việc này</em>, không phải về
showroom.</p>
<p><strong>Đã kiểm chứng thế nào — và vì sao phải ba tiến trình.</strong> Biên dịch được không chứng
minh gì về tệp tin. Lần chạy 0 bắt đầu trong thư mục rỗng: bấm 99 ở thực đơn, nạp khi chưa có tệp, hiện
danh sách rỗng, rồi thêm một xe hơi với <em>cả bảy luật đều bị từ chối từng luật một</em> để mọi thông
báo đều được chứng minh bằng một dòng console thật, thêm một xe máy với tốc độ và câu Y/N bị từ chối, bị
chặn vì id trùng ngay trước khi phải nhập sáu trường còn lại, sửa một xe với bốn trường để trống, nhận
<code>Vehicle does not exist</code> ở cả sửa, xoá và tìm theo id, huỷ một lệnh xoá ở bước xác nhận, tìm
tên không ra kết quả rồi tìm tên ra hai kết quả (trả về Z→A), hiện cả hai kiểu danh sách — xe máy kêu
<code>Tin tin tin</code> ở bản giảm dần theo giá và không kêu ở bản thường — rồi lưu ba xe. Lần chạy 1 là
<strong>một JVM mới trong cùng thư mục</strong>: nó nạp và in lại đúng ba xe đó, đây mới là bằng chứng
thật rằng Chức năng 7 đã ghi ra thứ mà Chức năng 1 đọc được. Sau đó nó xoá xe máy, thoát, và trả lời câu
hỏi về thay đổi chưa lưu. Lần chạy 2 là tiến trình thứ ba và nạp <em>hai</em> xe, chứng minh lệnh xoá đã
xuống tới tệp chứ không chỉ nằm trong bộ nhớ. Cả ba bản ghi màn hình đều được so từng ký tự.</p>
<p><strong>Người chấm sẽ hỏi gì.</strong> "Vì sao <code>Vehicle</code> là lớp trừu tượng chứ không phải
interface?" — vì năm trường dùng chung cần một chỗ để tồn tại, mà interface thì không giữ được trạng
thái; <code>Soundable</code> là interface đúng vì nó không giữ trạng thái nào. "Chỉ ra chỗ luật trùng id
được thi hành" — <code>bo.VehicleManager.add()</code>, chỗ ném ngoại lệ; lần kiểm sớm ở controller chỉ là
phép lịch sự để người dùng khỏi phải điền cả biểu mẫu vô ích. "Nếu tôi sửa tay vehicles.txt cho hỏng một
dòng thì sao?" — dòng đó bị bỏ qua và được đếm, phần còn lại vẫn nạp. "Thêm xe tải thì sửa ở đâu?" — một
lớp mới trong <code>entity</code>, một nhánh trong thực đơn thêm xe, một từ trong bộ đọc tệp; không đụng
gì tới <code>VehicleManager</code>, không đụng hai phép sắp xếp, không đụng báo cáo.</p>''',
    hints_en=[
        'Put id, name, color, price and brand in ONE abstract Vehicle; only type/year go in Car and only speed/licence in Motorbike.',
        'Keep every vehicle in a single List<Vehicle> — that is what lets Function 6.2 sort cars and motorbikes against each other.',
        'Give Motorbike a Soundable interface and test `instanceof Soundable` in the report, not `instanceof Motorbike`.',
        'Sort with Double.compare(b.getPrice(), a.getPrice()); casting a price difference to int reports "equal" for anything under 1.00 apart.',
        'Add an id tie-breaker to both comparators, or vehicles at the same price will reshuffle between runs.',
        'vehicles.txt sits at the PROJECT ROOT, and save() must truncate — appending doubles the file and breaks the next load.',
        'In update, read every field with a method that returns null on a blank line, and guard each setter with a null check.',
        'Format money with String.format(Locale.US, "%,.2f", price) — the default locale prints 35.000,00 on some machines.',
        'One static Scanner in Validator, never a second one on System.in.',
    ],
    hints_vi=[
        'Đặt id, tên, màu, giá, hãng vào MỘT lớp trừu tượng Vehicle; chỉ loại xe/năm nằm ở Car và chỉ tốc độ/bằng lái nằm ở Motorbike.',
        'Giữ mọi phương tiện trong một List<Vehicle> duy nhất — nhờ đó Chức năng 6.2 mới xếp chung xe hơi với xe máy được.',
        'Cho Motorbike cài đặt interface Soundable rồi kiểm `instanceof Soundable` trong báo cáo, đừng kiểm `instanceof Motorbike`.',
        'Sắp xếp bằng Double.compare(b.getPrice(), a.getPrice()); ép hiệu hai giá về int sẽ báo "bằng nhau" với mọi chênh lệch dưới 1.00.',
        'Thêm tiêu chí phá hoà theo id cho cả hai bộ so sánh, nếu không hai xe cùng giá sẽ đảo chỗ giữa các lần chạy.',
        'vehicles.txt nằm ở GỐC PROJECT, và save() phải ghi đè — nối thêm sẽ làm tệp dài gấp đôi và hỏng lần nạp sau.',
        'Ở chức năng sửa, đọc mỗi trường bằng phương thức trả về null khi dòng nhập rỗng, và bọc mỗi setter bằng một phép kiểm null.',
        'Định dạng tiền bằng String.format(Locale.US, "%,.2f", price) — locale mặc định in ra 35.000,00 trên một số máy.',
        'Chỉ một Scanner static trong Validator, tuyệt đối không mở cái thứ hai trên System.in.',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
VI = {
    'J1.L.P0013': '''<h3>Bối cảnh</h3>
<p>Anh QuanMX muốn viết một chương trình quản lý các phương tiện trong showroom của mình. Các phương
tiện có nhiều thuộc tính chung. Chương trình quản lý này cần có các chức năng cơ bản như: thêm, sửa,
xoá, tìm kiếm. Chương trình phải được thiết kế sao cho việc <strong>thêm một loại phương tiện mới là dễ
dàng</strong>. Hãy xây dựng ý tưởng của bạn dựa trên mô hình hướng đối tượng.</p>
<h3>Đặc tả chương trình</h3>
<p>Xây dựng một chương trình quản lý với các chức năng cơ bản sau:</p>
<ul>
<li>0. Xây dựng cấu trúc dữ liệu</li>
<li>1. Nạp dữ liệu từ tệp</li>
<li>2. Thêm phương tiện mới</li>
<li>3. Cập nhật phương tiện theo ID</li>
<li>4. Xoá phương tiện theo ID</li>
<li>5. Tìm kiếm phương tiện — 5.1 Tìm theo tên (kết quả sắp giảm dần) · 5.2 Tìm theo id</li>
<li>6. Hiển thị danh sách phương tiện — 6.1 Hiện tất cả · 6.2 Hiện tất cả (giảm dần theo giá)</li>
<li>7. Lưu dữ liệu ra tệp</li>
<li>Còn lại — Thoát</li>
</ul>
<p>Mỗi lựa chọn trên thực đơn phải gọi đúng hàm thực hiện mục đó. Chương trình phải hiển thị lại thực
đơn sau mỗi tác vụ và chờ người dùng chọn mục khác, cho tới khi người dùng chọn thoát. Toàn bộ thông tin
phương tiện trong showroom nằm trong tệp <code>vehicles.txt</code>.</p>
<p>Ở giai đoạn hiện tại, showroom có <strong>2 nhóm phương tiện</strong>:</p>
<ul>
<li><strong>Car</strong> (xe hơi): có các thuộc tính id, tên, màu, giá, hãng, loại (sport, travel, …),
năm sản xuất.</li>
<li><strong>Motorbike</strong> (xe máy): có các thuộc tính id, tên, màu, giá, hãng, tốc độ, có yêu cầu
bằng lái hay không. Nhóm này có thêm một hàm đặc biệt là <code>makeSound</code>, in ra thông báo
<code>Tin tin tin</code>.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 0: Xây dựng cấu trúc dữ liệu — 50 LOC</h4>
<ul>
<li>Dùng lớp, lớp trừu tượng, interface.</li>
<li>Chỉ dùng <strong>một tập hợp duy nhất</strong> để lưu toàn bộ phương tiện.</li>
</ul>
<h4>Chức năng 1: Nạp dữ liệu từ tệp — 50 LOC</h4>
<ul><li>Nạp toàn bộ dữ liệu trong tệp vào tập hợp.</li></ul>
<h4>Chức năng 2: Thêm phương tiện mới — 50 LOC</h4>
<ul>
<li>Tạo một thực đơn con cho phép người dùng chọn loại phương tiện muốn thêm vào showroom.</li>
<li>Nhớ rằng <strong>các ràng buộc phải được kiểm tra</strong>.</li>
<li>Thêm phương tiện mới vào tập hợp.</li>
<li>Hỏi người dùng có tiếp tục thêm nữa hay quay về thực đơn chính.</li>
</ul>
<h4>Chức năng 3: Cập nhật phương tiện — 50 LOC</h4>
<ul>
<li>Yêu cầu nhập id của phương tiện.</li>
<li>Nếu phương tiện không tồn tại thì thông báo <code>Vehicle does not exist</code>. Ngược lại, người
dùng bắt đầu nhập thông tin mới và cập nhật.</li>
<li>Nếu thông tin mới để trống thì <strong>giữ nguyên</strong> thông tin cũ.</li>
<li>Nhớ rằng các ràng buộc phải được kiểm tra.</li>
<li>Sau đó hệ thống phải in ra kết quả của việc cập nhật.</li>
<li>Cập nhật xong, chương trình quay về màn hình chính.</li>
</ul>
<h4>Chức năng 4: Xoá phương tiện — 50 LOC</h4>
<ul>
<li>Người dùng có thể xoá phương tiện bất kỳ trong showroom theo id.</li>
<li>Trước khi xoá, hệ thống phải hiện thông báo <strong>xác nhận</strong>.</li>
<li>Hiện kết quả xoá: thành công hay thất bại.</li>
<li>Xoá xong, chương trình quay về màn hình chính.</li>
</ul>
<h4>Chức năng 5: Tìm kiếm phương tiện</h4>
<p>Tạo thực đơn con cho phép chọn cách tìm: theo tên hoặc theo id.</p>
<p><strong>5.1 Tìm theo tên — 50 LOC</strong></p>
<ul>
<li>Người dùng nhập đoạn văn bản muốn tìm.</li>
<li>Hệ thống tìm trong showroom và trả về mọi phương tiện có tên <strong>chứa</strong> chuỗi tìm
kiếm.</li>
<li>Hiện danh sách kết quả: đầy đủ thông tin của phương tiện (sắp giảm dần).</li>
</ul>
<p><strong>5.2 Tìm theo id — 50 LOC</strong></p>
<ul>
<li>Người dùng nhập id của phương tiện.</li>
<li>Hệ thống tìm trong showroom và trả về phương tiện có id trùng với chuỗi tìm kiếm.</li>
<li>Hiện kết quả: đầy đủ thông tin của phương tiện.</li>
</ul>
<h4>Chức năng 6: Hiển thị danh sách phương tiện</h4>
<p>Tạo thực đơn con cho phép chọn cách hiển thị.</p>
<p><strong>6.1 Hiện tất cả — 50 LOC</strong></p>
<ul>
<li>Hệ thống hiện danh sách phương tiện trong showroom, đầy đủ thông tin.</li>
</ul>
<p><strong>6.2 Hiện tất cả (giảm dần theo giá) — 50 LOC</strong></p>
<ul>
<li>Hệ thống hiện danh sách phương tiện trong showroom, đầy đủ thông tin, sắp giảm dần theo giá.</li>
<li>Nếu phương tiện thuộc loại xe máy thì gọi hàm <code>makeSound</code>.</li>
</ul>
<h4>Chức năng 7: Lưu dữ liệu ra tệp — 50 LOC</h4>
<ul><li>Lưu dữ liệu trong tập hợp ra tệp.</li></ul>
<h3>Hướng dẫn</h3>
<p>Đặc tả ở trên chỉ là thông tin cơ bản; bạn <strong>phải tự thực hiện bước phân tích yêu cầu</strong>
và xây dựng ứng dụng theo yêu cầu thực tế. Giảng viên chỉ giải thích yêu cầu một lần duy nhất ở buổi
đầu của bài assignment. <strong>Mọi lỗi đều phải được xử lý, không được để chương trình bị ngắt.</strong></p>
<p>Gợi ý thiết kế: đặt các thuộc tính dùng chung (id, tên, màu, giá, hãng) vào một lớp trừu tượng
<code>Vehicle</code>; <code>Car</code> và <code>Motorbike</code> kế thừa và chỉ thêm phần riêng của
mình; giữ tất cả trong MỘT <code>List&lt;Vehicle&gt;</code>. Cho <code>Motorbike</code> cài đặt một
interface (ví dụ <code>Soundable</code>) để báo cáo ở 6.2 gọi <code>makeSound()</code> mà không cần
biết lớp cụ thể. Đặt phần đọc bàn phím và kiểm tra ràng buộc vào một lớp <code>Validator</code> duy
nhất với một <code>Scanner</code> static. Tệp <code>vehicles.txt</code> nằm ở gốc project (cạnh
<code>build.xml</code>), không nằm trong <code>src/</code>. Khi sắp xếp theo giá, dùng
<code>Double.compare</code> chứ đừng ép hiệu hai số thực về <code>int</code>.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
