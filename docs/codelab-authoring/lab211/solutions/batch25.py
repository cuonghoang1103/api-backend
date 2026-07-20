# Batch 25 — J1.L.P0022 (candidate management for an HR department: one
# inheritance tree, one ArrayList, five field-format rules and a search).
# A Long Assignment: 350 LOC, five slots, nine files.
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.L.P0022 — Candidate management (350 LOC)
# ════════════════════════════════════════════════════════════════

P0022_TYPE = '''package entity;

/**
 * The three kinds of candidate, and the three things the program needs to know
 * about each kind: the code the brief prints (0, 1, 2), the word the messages
 * use, and the banner that heads that group on the listing screen.
 *
 * The brief calls the candidate type an ATTRIBUTE, which invites storing an int
 * field on Candidate. That is two sources of truth for one fact: nothing would
 * stop `new Fresher(...)` being built with type 0, and every screen would then
 * disagree with the class of the object it is printing. Here the type is a
 * property OF THE CLASS - Fresher returns FRESHER and cannot return anything
 * else - so the printed code and the real subclass can never drift apart.
 *
 * The banner is carried as data rather than built with a loop because the
 * brief's three banners are not the same width and not symmetric: 11 and 12
 * '=' around EXPERIENCE, 10 and 14 around FRESHER, 11 and 14 around INTERN. A
 * marker diffs the screen character by character, so the ragged originals are
 * copied exactly rather than tidied up.
 */
public enum CandidateType {

    EXPERIENCE(0, "Experience", "===========EXPERIENCE CANDIDATE============"),
    FRESHER(1, "Fresher", "==========FRESHER CANDIDATE=============="),
    INTERN(2, "Intern", "===========INTERN CANDIDATE==============");

    private final int code;
    private final String label;
    private final String banner;

    CandidateType(int code, String label, String banner) {
        this.code = code;
        this.label = label;
        this.banner = banner;
    }

    public int getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public String getBanner() {
        return banner;
    }

    /**
     * The only door into this enum from the keyboard.
     *
     * Returns null for an unknown code instead of throwing: whether that is an
     * error, and what to say about it, is a decision for the layer that owns
     * the wording. Here the menu never lets an unknown code through anyway, so
     * this is belt and braces.
     */
    public static CandidateType fromCode(int code) {
        for (CandidateType type : values()) {
            if (type.code == code) {
                return type;
            }
        }
        return null;
    }
}
'''

P0022_CANDIDATE = '''package entity;

import java.io.Serializable;

/**
 * Everything every candidate has: id, first name, last name, birth date,
 * address, phone, email - and the type, which is asked of the subclass.
 *
 * This class is the whole point of the assignment. The Guidelines say it in one
 * sentence: "Should create Candidate as a SuperClass. Experience, Fresher and
 * Internship Candidate as SubClasses that extend Candidate". Every field that
 * is common sits here ONCE, so the search, the listing and the validation are
 * written once and keep working the day a fourth kind of candidate is added.
 *
 * No rules and no printing live here. The entity cannot refuse a duplicate id,
 * because it has no way to tell the caller why - that job belongs to the bo
 * layer, which can throw. Keeping the entity dumb is what lets every rule sit
 * in one file instead of being spread between a constructor and a manager.
 *
 * Serializable costs one word and is the shape a LAB211 marker expects in the
 * entity package.
 */
public abstract class Candidate implements Serializable {

    private String id;
    private String firstName;
    private String lastName;
    private int birthDate;
    private String address;
    private String phone;
    private String email;

    public Candidate() {
    }

    public Candidate(String id, String firstName, String lastName, int birthDate,
            String address, String phone, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.address = address;
        this.phone = phone;
        this.email = email;
    }

    /**
     * The type is ASKED, never stored.
     *
     * abstract rather than a field with a default, so a new subclass cannot be
     * written that forgets to say what it is - that becomes a compile error,
     * which is the only kind of mistake worth having.
     */
    public abstract CandidateType getCandidateType();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public int getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(int birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    /** "First Name + Last Name", the only name the brief ever prints. */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * The exact line the search result prints: name, birth date, address,
     * phone, email, type code - the six fields the brief lists, in that order,
     * and nothing a subclass added.
     *
     * It is a separate method from toString() on purpose. toString() is
     * overridden by every subclass to append its own extra attributes, which is
     * what the listing after "Do you want to continue? N" shows; the search
     * result must NOT show them, because the brief's search screen prints the
     * same six columns whatever the candidate is. Two different screens are two
     * different methods, and neither one has to know about the other.
     */
    public String getSummary() {
        return getFullName() + " | " + birthDate + " | " + address + " | "
                + phone + " | " + email + " | " + getCandidateType().getCode();
    }

    @Override
    public String toString() {
        return getSummary();
    }
}
'''

P0022_EXPERIENCE = '''package entity;

/**
 * A candidate who has worked before: years of experience and a professional
 * skill, on top of everything a Candidate already has.
 *
 * Note what is NOT here: no id, no name, no email, no phone. Every field that
 * an Experience shares with a Fresher lives in Candidate, so there is exactly
 * one copy of it to validate, print and search. A subclass that repeated those
 * seven fields would compile and would be wrong - the search would have to be
 * written three times, and two of the copies would eventually disagree.
 */
public class Experience extends Candidate {

    private int expInYear;
    private String proSkill;

    public Experience() {
    }

    public Experience(String id, String firstName, String lastName, int birthDate,
            String address, String phone, String email, int expInYear, String proSkill) {
        super(id, firstName, lastName, birthDate, address, phone, email);
        this.expInYear = expInYear;
        this.proSkill = proSkill;
    }

    @Override
    public CandidateType getCandidateType() {
        return CandidateType.EXPERIENCE;
    }

    public int getExpInYear() {
        return expInYear;
    }

    public void setExpInYear(int expInYear) {
        this.expInYear = expInYear;
    }

    public String getProSkill() {
        return proSkill;
    }

    public void setProSkill(String proSkill) {
        this.proSkill = proSkill;
    }

    /** The six common columns, then the two that only an Experience has. */
    @Override
    public String toString() {
        return super.toString() + " | " + expInYear + " | " + proSkill;
    }
}
'''

P0022_FRESHER = '''package entity;

/**
 * A new graduate: when they graduated, how well, and from where.
 *
 * graduationDate is a String rather than a number or a Date. The brief's list
 * of fields to validate is closed - birth date, phone, email, year of
 * experience, rank of graduation - and graduation date is not on it. Forcing a
 * format the brief never specified would refuse input a marker is entitled to
 * type ("06/2021", "Summer 2021"), and refusing valid input is worse than
 * accepting loose input the brief did not ask you to police.
 */
public class Fresher extends Candidate {

    private String graduationDate;
    private String graduationRank;
    private String education;

    public Fresher() {
    }

    public Fresher(String id, String firstName, String lastName, int birthDate,
            String address, String phone, String email, String graduationDate,
            String graduationRank, String education) {
        super(id, firstName, lastName, birthDate, address, phone, email);
        this.graduationDate = graduationDate;
        this.graduationRank = graduationRank;
        this.education = education;
    }

    @Override
    public CandidateType getCandidateType() {
        return CandidateType.FRESHER;
    }

    public String getGraduationDate() {
        return graduationDate;
    }

    public void setGraduationDate(String graduationDate) {
        this.graduationDate = graduationDate;
    }

    public String getGraduationRank() {
        return graduationRank;
    }

    public void setGraduationRank(String graduationRank) {
        this.graduationRank = graduationRank;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    @Override
    public String toString() {
        return super.toString() + " | " + graduationDate + " | " + graduationRank
                + " | " + education;
    }
}
'''

P0022_INTERN = '''package entity;

/**
 * A student still studying: majors, the semester they are in, and the
 * university they are at.
 *
 * semester is an int because it is counted and compared; majors and university
 * are free text because they are only ever printed. Choosing the type by what
 * the program DOES with the value, rather than by what the value looks like, is
 * the question a marker asks about every field on the sheet.
 */
public class Intern extends Candidate {

    private String majors;
    private int semester;
    private String universityName;

    public Intern() {
    }

    public Intern(String id, String firstName, String lastName, int birthDate,
            String address, String phone, String email, String majors, int semester,
            String universityName) {
        super(id, firstName, lastName, birthDate, address, phone, email);
        this.majors = majors;
        this.semester = semester;
        this.universityName = universityName;
    }

    @Override
    public CandidateType getCandidateType() {
        return CandidateType.INTERN;
    }

    public String getMajors() {
        return majors;
    }

    public void setMajors(String majors) {
        this.majors = majors;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    @Override
    public String toString() {
        return super.toString() + " | " + majors + " | " + semester + " | " + universityName;
    }
}
'''

P0022_VALIDATOR = '''package utils;

import java.time.Year;
import java.util.Scanner;

/**
 * Every keyboard read in the program, and every FORMAT rule, in one place.
 *
 * ONE static Scanner over System.in, and a private constructor so nobody can
 * accidentally make a second one. Two Scanners on the same stream is the
 * classic way to lose a line of input: the first buffers ahead, and the second
 * reads from where the buffer ended rather than from where the user is looking.
 *
 * The seam with the bo layer is deliberate and worth defending out loud. This
 * class answers "is what was typed a legal VALUE of this field?" - four digits,
 * ten digits, an @ with a domain after it, 0..100, one of four ranks. Those are
 * the five checks the brief's Requirements section lists by name, they concern
 * one field at a time, and the right answer to failing one is to ask that field
 * again rather than to throw away the other six the user has already typed. The
 * bo layer answers a different kind of question - is this id already taken, is
 * the list empty - which needs the whole collection, and which is therefore
 * thrown rather than re-prompted.
 */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    /** The brief: "1900..Current Year". */
    private static final int MIN_YEAR = 1900;

    private static final int MIN_PHONE_DIGITS = 10;

    private static final int MAX_EXPERIENCE = 100;

    /** The brief: "one of 4 values (Excellence, Good, Fair, Poor)". */
    private static final String[] RANKS = {"Excellence", "Good", "Fair", "Poor"};

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

    /** A menu choice: the range IS a fact about the screen, so it lives here. */
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
     * Birth date: "is number with length is 4 character (1900..Current Year)".
     *
     * The upper bound is read from the clock, not typed in as 2025 - a hard
     * coded year is a bug with a delivery date. Year.now() is core Java
     * (java.time), so the "core Java only" rule is respected.
     *
     * The MESSAGE says "the current year" instead of naming it. That is not
     * vagueness: a message that printed the year would make this program's
     * console change on the first of January, and a screen that cannot be
     * diffed twice cannot be marked twice.
     *
     * "Length is 4 characters" and "1900..current year" are the same rule said
     * twice - every number in that range has four digits - so one range check
     * enforces both. What it does NOT allow is "0999" or "1990 " sneaking
     * through as text; parsing to an int first is what makes that true.
     */
    public static int getBirthDate(String message) {
        int max = Year.now().getValue();
        while (true) {
            String line = getString(message);
            try {
                int year = Integer.parseInt(line);
                if (line.length() == 4 && year >= MIN_YEAR && year <= max) {
                    return year;
                }
            } catch (NumberFormatException e) {
                // fall through to the same message: "not a number" and "not a
                // year" are the same mistake from the user's point of view, and
                // two messages for one field is two things to read.
            }
            System.out.println("Birth date must be a number of 4 digits from 1900 to the current year.");
        }
    }

    /**
     * Phone: "is number with minimum 10 characters".
     *
     * Digits only, and at least ten of them. It is checked character by
     * character rather than with Integer.parseInt, because a phone number is
     * not a number you do arithmetic on: parsing "0912345678" would silently
     * lose the leading zero, and every Vietnamese mobile number starts with
     * one. Storing it as a String and checking the digits is the fix.
     */
    public static String getPhone(String message) {
        while (true) {
            String line = getString(message);
            if (line.length() >= MIN_PHONE_DIGITS && isAllDigits(line)) {
                return line;
            }
            System.out.println("Phone must be a number with at least " + MIN_PHONE_DIGITS + " digits.");
        }
    }

    /**
     * Email: "with format <account name>@<domain>".
     *
     * Written by hand rather than with a regular expression. Not because a
     * regex would be wrong, but because the reason each clause exists is
     * readable this way, and at a defence you will be asked to explain the rule
     * rather than to recite the pattern.
     *
     * The rule: something before the @, exactly one @, something after it, and
     * a dot inside the domain that is neither its first nor its last character.
     * The brief's own example - annguyen@fpt.edu.vn - is what the last clause
     * is measured against.
     */
    public static String getEmail(String message) {
        while (true) {
            String line = getString(message);
            if (isEmail(line)) {
                return line;
            }
            System.out.println("Email must have the format <account name>@<domain> (eg: annguyen@fpt.edu.vn).");
        }
    }

    /** Year of experience: "is number from 0 to 100". */
    public static int getExpInYear(String message) {
        while (true) {
            String line = getString(message);
            try {
                int years = Integer.parseInt(line);
                if (years >= 0 && years <= MAX_EXPERIENCE) {
                    return years;
                }
            } catch (NumberFormatException e) {
                // one field, one message - see getBirthDate
            }
            System.out.println("Year of experience must be a number from 0 to " + MAX_EXPERIENCE + ".");
        }
    }

    /**
     * Rank of graduation: one of Excellence, Good, Fair, Poor.
     *
     * Case-insensitive in, canonical spelling out. A marker types "good" as
     * often as "Good", and nothing in the brief says the rank must be typed
     * with the right capitals - but the REPORT should not show four spellings
     * of one rank, so what is stored is the constant from RANKS and not what
     * the user happened to type.
     */
    public static String getRank(String message) {
        while (true) {
            String line = getString(message);
            for (String rank : RANKS) {
                if (rank.equalsIgnoreCase(line)) {
                    return rank;
                }
            }
            System.out.println("Rank of graduation must be one of: " + ranks() + ".");
        }
    }

    /**
     * One of a fixed set of letters - here only Y/N.
     *
     * Case-insensitive in, upper case out, so the caller compares against "N"
     * and never has to think about the shift key. It loops until it gets one of
     * them: the brief's question has no third answer, so neither does this.
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

    /** "Excellence, Good, Fair, Poor" - built from the array, so it cannot drift. */
    public static String ranks() {
        StringBuilder all = new StringBuilder();
        for (String rank : RANKS) {
            if (all.length() > 0) {
                all.append(", ");
            }
            all.append(rank);
        }
        return all.toString();
    }

    private static boolean isAllDigits(String value) {
        if (value.isEmpty()) {
            return false;
        }
        for (int i = 0; i < value.length(); i++) {
            if (!Character.isDigit(value.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    private static boolean isEmail(String value) {
        int at = value.indexOf('@');
        if (at <= 0 || at != value.lastIndexOf('@') || at == value.length() - 1) {
            return false;
        }
        if (value.contains(" ")) {
            return false;
        }
        String domain = value.substring(at + 1);
        int dot = domain.indexOf('.');
        return dot > 0 && dot < domain.length() - 1;
    }
}
'''

P0022_BO = '''package bo;

import entity.Candidate;
import entity.CandidateType;
import java.util.ArrayList;
import java.util.List;

/**
 * The one ArrayList of candidates, and every rule that needs to see more than
 * one field at a time. It throws; it never prints.
 *
 * That sentence is the whole reason this class is separate from the
 * controller. A method that printed "id already exists" could only ever be
 * tested by a human reading the console, and it could not be reused by a screen
 * that wanted to report the failure differently. Throwing hands the decision
 * back to the caller and keeps every message string in one file, where it can
 * be checked against the brief word by word.
 *
 * ONE list holds all three kinds of candidate. The brief's Guidelines mention
 * an ArrayList per kind ("Should use ArrayList to store Fresher Candidate",
 * twice, once of them under "Create Intern Candidate" - the sheet was
 * copy-pasted). Three lists would mean writing the duplicate-id check three
 * times and then a fourth time across the three, because an id has to be unique
 * across the WHOLE company, not within one kind. One List<Candidate> makes
 * that rule a single loop, and getByType() gives back the per-kind view the
 * listing screen wants without storing anything twice.
 */
public class CandidateManagement {

    private final List<Candidate> candidates = new ArrayList<>();

    /**
     * Accept a candidate, or explain why not.
     *
     * It takes a Candidate rather than eleven loose parameters, and there is
     * exactly one add() rather than one per subclass. Both follow from the same
     * observation: everything checked here lives on the superclass. An
     * addExperience/addFresher/addIntern trio would be three copies of the same
     * four checks, and the day a fourth kind of candidate is added the rule
     * would have to be remembered a fourth time. Polymorphism is not decoration
     * here - it is what keeps the rule single.
     *
     * The checks run in the order the user meets the fields, so the first thing
     * they typed wrong is the first thing they are told about.
     */
    public void add(Candidate candidate) throws Exception {
        if (candidate == null) {
            throw new Exception("Candidate cannot be null.");
        }
        String id = trim(candidate.getId());
        if (id.isEmpty()) {
            throw new Exception("Candidate id cannot be empty.");
        }
        if (find(id) != null) {
            throw new Exception("Candidate id [" + id + "] already exists.");
        }
        if (trim(candidate.getFirstName()).isEmpty()) {
            throw new Exception("First name cannot be empty.");
        }
        if (trim(candidate.getLastName()).isEmpty()) {
            throw new Exception("Last name cannot be empty.");
        }
        candidate.setId(id);
        candidates.add(candidate);
    }

    public boolean isEmpty() {
        return candidates.isEmpty();
    }

    /**
     * The candidates of one kind, in the order they were created.
     *
     * A new list every time, so the listing screen cannot rearrange or empty
     * the real store by accident. Handing out the internal ArrayList would make
     * every caller a potential writer, and the class would no longer be able to
     * promise anything about its own contents.
     */
    public List<Candidate> getByType(CandidateType type) {
        List<Candidate> group = new ArrayList<>();
        for (Candidate candidate : candidates) {
            if (candidate.getCandidateType() == type) {
                group.add(candidate);
            }
        }
        return group;
    }

    /**
     * Search by a name and a type, exactly as the brief's example does.
     *
     * Three decisions the sheet does not spell out in words, but does spell out
     * in its sample screen:
     *
     * - contains(), not equals(). Typing "eva" returns both "Aguirre Eva" AND
     *   "Antosova Adeleva" in the brief's own example. "Adeleva" is not equal to
     *   "eva"; it contains it. A search written with equals() passes a casual
     *   read of the sheet and fails its picture.
     * - first name OR last name, each tested on its own rather than against the
     *   joined full name. The brief says "First Name or Last Name". Testing the
     *   joined string would also match a keyword that straddles the space, such
     *   as "ra ev", which is not a name anybody has.
     * - toLowerCase on both sides. The example types "eva" and matches "Eva".
     *
     * An empty RESULT is not an exception - "no candidate is called Zorro" is a
     * true and useful answer, and the caller can see it from the empty list. An
     * empty DATABASE is different: that is a precondition the user has not met
     * yet, so it throws.
     */
    public List<Candidate> search(String name, CandidateType type) throws Exception {
        requireNotEmpty();
        String keyword = trim(name);
        if (keyword.isEmpty()) {
            throw new Exception("Candidate name cannot be empty.");
        }
        if (type == null) {
            throw new Exception("Type of candidate must be 0, 1 or 2.");
        }
        String wanted = keyword.toLowerCase();
        List<Candidate> found = new ArrayList<>();
        for (Candidate candidate : candidates) {
            if (candidate.getCandidateType() != type) {
                continue;
            }
            if (candidate.getFirstName().toLowerCase().contains(wanted)
                    || candidate.getLastName().toLowerCase().contains(wanted)) {
                found.add(candidate);
            }
        }
        return found;
    }

    /** The screen asks before it prompts, so the message lives here too. */
    public void requireNotEmpty() throws Exception {
        if (candidates.isEmpty()) {
            throw new Exception("The candidate list is empty.");
        }
    }

    /** Linear scan, case-insensitive: "e01" and "E01" are the same candidate. */
    private Candidate find(String id) {
        for (Candidate candidate : candidates) {
            if (candidate.getId() != null && candidate.getId().equalsIgnoreCase(id)) {
                return candidate;
            }
        }
        return null;
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
'''

P0022_CONTROLLER = '''package controller;

import bo.CandidateManagement;
import entity.Candidate;
import entity.CandidateType;
import entity.Experience;
import entity.Fresher;
import entity.Intern;
import java.util.List;
import utils.Validator;

/**
 * One method per menu option: read the input through the Validator, call the bo
 * layer, report what came back.
 *
 * This class exists because the three create options are the same eleven
 * prompts with two or three different questions at the end. Left inside Main
 * they would bury the menu loop three times over; here Main stays a menu that
 * fits on one screen, and create() is written ONCE for all three kinds.
 *
 * Every option catches Exception and prints getMessage(). That is the seam: bo
 * decides what went wrong and owns the wording, the controller decides that the
 * program says so and carries on rather than dying.
 */
public class CandidateController {

    private final CandidateManagement management = new CandidateManagement();

    /**
     * Menu options 1, 2 and 3 - all three of them.
     *
     * The brief: "After each candidate is created, the system shows message: Do
     * you want to continue (Y/N)?. User chooses Y to continues, if you chooses
     * N, the program returns main screen and display all candidates who are
     * created."
     *
     * So the question is asked after every attempt, including a failed one: the
     * user who has just been told the id is taken is exactly the user who wants
     * another go, and answering N still shows them the list. Nothing was added
     * on a failure, so nothing needs undoing - the loop simply comes round
     * again.
     */
    public void create(CandidateType type) {
        System.out.println("---------- Create " + type.getLabel() + " Candidate ----------");
        while (true) {
            Candidate candidate = read(type);
            try {
                management.add(candidate);
                System.out.println(type.getLabel() + " candidate [" + candidate.getId()
                        + "] has been created.");
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
            if ("N".equals(Validator.getOption("Do you want to continue (Y/N)? ", "Y", "N"))) {
                showList(true);
                return;
            }
        }
    }

    /**
     * Menu option 4.
     *
     * The order is the brief's: show every candidate first, THEN ask for the
     * name and the type. Showing the list first is not decoration - it is how
     * the user knows what there is to search for, and it is why the sample
     * screen prints the three groups above the two prompts.
     *
     * requireNotEmpty() is called inside the try, before the prompts, so an
     * empty database is reported instead of asking two questions whose answer
     * cannot matter.
     */
    public void search() {
        try {
            management.requireNotEmpty();
            showList(false);

            String name = Validator.getString("Input Candidate name (First name or Last name): ");
            int code = Validator.getInt("Input type of candidate: ", 0, 2);

            List<Candidate> found = management.search(name, CandidateType.fromCode(code));
            if (found.isEmpty()) {
                // Not an error, so not an exception - but silence here would
                // look exactly like a crash.
                System.out.println("No candidate found.");
                return;
            }
            System.out.println("The candidates found:");
            for (Candidate candidate : found) {
                System.out.println(candidate.getSummary());
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * The grouped listing, in the brief's own three banners.
     *
     * `detailed` picks between the two screens the brief asks for with one
     * loop. After a create it is true, and each line is the candidate's own
     * toString() - which means an Experience shows its years and skill, and an
     * Intern shows its majors and semester, chosen by the object rather than by
     * an if. That single line of polymorphic output is what slot 1 of the
     * Guidelines is really asking you to demonstrate. In the search screen it
     * is false and only the names are printed, exactly as the sample shows.
     *
     * The banners are printed even for an empty group, because they are the map
     * of the screen: three headings that are always in the same place are
     * easier to read than headings that appear and disappear.
     */
    private void showList(boolean detailed) {
        System.out.println("List of candidate:");
        for (CandidateType type : CandidateType.values()) {
            System.out.println(type.getBanner());
            for (Candidate candidate : management.getByType(type)) {
                System.out.println(detailed ? candidate.toString() : candidate.getFullName());
            }
        }
    }

    /**
     * The eleven prompts of one candidate.
     *
     * The seven common fields are read into the object through its setters, so
     * this code never mentions Experience, Fresher or Intern while it is asking
     * for them - it is asking a Candidate. Only the last two or three questions
     * differ, and THAT is where the switch is.
     *
     * The switch lives in the controller and not in the entity on purpose: an
     * entity that read the keyboard could never be reused by a screen that gets
     * its data from a file or a test, and it could not be constructed at all
     * without a user sitting there. The one place that knows which extra
     * questions to ask is the layer whose job is asking questions.
     */
    private Candidate read(CandidateType type) {
        Candidate candidate;
        switch (type) {
            case EXPERIENCE:
                candidate = new Experience();
                break;
            case FRESHER:
                candidate = new Fresher();
                break;
            default:
                candidate = new Intern();
        }

        candidate.setId(Validator.getString("Input candidate id: "));
        candidate.setFirstName(Validator.getString("Input first name: "));
        candidate.setLastName(Validator.getString("Input last name: "));
        candidate.setBirthDate(Validator.getBirthDate("Input birth date: "));
        candidate.setAddress(Validator.getString("Input address: "));
        candidate.setPhone(Validator.getPhone("Input phone: "));
        candidate.setEmail(Validator.getEmail("Input email: "));

        switch (type) {
            case EXPERIENCE:
                Experience experience = (Experience) candidate;
                experience.setExpInYear(Validator.getExpInYear("Input year of experience: "));
                experience.setProSkill(Validator.getString("Input professional skill: "));
                break;
            case FRESHER:
                Fresher fresher = (Fresher) candidate;
                fresher.setGraduationDate(Validator.getString("Input graduation date: "));
                fresher.setGraduationRank(Validator.getRank(
                        "Input rank of graduation (" + Validator.ranks() + "): "));
                fresher.setEducation(Validator.getString("Input education: "));
                break;
            default:
                Intern intern = (Intern) candidate;
                intern.setMajors(Validator.getString("Input majors: "));
                intern.setSemester(Validator.getInt("Input semester: "));
                intern.setUniversityName(Validator.getString("Input university name: "));
        }
        return candidate;
    }
}
'''

P0022_MAIN = '''package ui;

import controller.CandidateController;
import entity.CandidateType;
import utils.Validator;

/**
 * The menu and the screen, nothing else.
 *
 * The wording is copied from the brief character for character, including the
 * parenthesised sentence and its missing "Create" before "Internship Candidate"
 * - a marker diffs this screen before reading a line of the code behind it, and
 * tidying the sheet's own words up is how a diff gains a line it should not
 * have.
 *
 * Options 1, 2 and 3 differ by one enum constant, so they are one call with
 * three arguments rather than three methods. The menu is the only place in the
 * program that knows 1 means Experience.
 */
public class Main {

    public static void main(String[] args) {
        CandidateController controller = new CandidateController();

        boolean running = true;
        while (running) {
            System.out.println("CANDIDATE MANAGEMENT SYSTEM");
            System.out.println("1. Experience");
            System.out.println("2. Fresher");
            System.out.println("3. Internship");
            System.out.println("4. Searching");
            System.out.println("5. Exit");
            System.out.println("(Please choose 1 to Create Experience Candidate, "
                    + "2 to Create Fresher Candidate, 3 to Internship Candidate, "
                    + "4 to Searching and 5 to Exit program).");

            switch (Validator.getInt("Enter your choice: ", 1, 5)) {
                case 1:
                    controller.create(CandidateType.EXPERIENCE);
                    break;
                case 2:
                    controller.create(CandidateType.FRESHER);
                    break;
                case 3:
                    controller.create(CandidateType.INTERN);
                    break;
                case 4:
                    controller.search();
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
# The data is the brief's own sample list, with the diacritics dropped
# ("Antosova"): the sheet's example searches for "eva" and expects to find both
# "Aguirre Eva" and "Antosova Adeleva", so the scripted run reproduces exactly
# that and the console can be compared with the picture in the brief.

def _common(cid, first, last, year, address, phone, email):
    return '%s\n%s\n%s\n%d\n%s\n%s\n%s\n' % (cid, first, last, year, address, phone, email)


def _exp(cid, first, last, year, address, phone, email, years, skill):
    return _common(cid, first, last, year, address, phone, email) + '%d\n%s\n' % (years, skill)


def _fre(cid, first, last, year, address, phone, email, grad, rank, education):
    return _common(cid, first, last, year, address, phone, email) + '%s\n%s\n%s\n' % (grad, rank, education)


def _int(cid, first, last, year, address, phone, email, majors, semester, university):
    return _common(cid, first, last, year, address, phone, email) + '%s\n%d\n%s\n' % (majors, semester, university)


EXP_1 = _exp('E01', 'Aelbrecht', 'Stefan', 1988, 'Brussels', '0987654321',
             'stefan@asante.com', 5, 'Java')
EXP_2 = _exp('E02', 'Aguirre', 'Eva', 1990, 'Sao paulo', '0940394123',
             'eva@asante.com', 3, 'C Sharp')
EXP_3 = _exp('E03', 'Antosova', 'Adeleva', 1989, 'Rio de janero', '0984933112',
             'adelave@janeo.com', 7, 'Testing')

FRE_1 = _fre('F01', 'Barbosa', 'De Souza', 1999, 'Ha Noi', '0912345678',
             'barbosa@fpt.edu.vn', '06/2021', 'Excellence', 'FPT University')
FRE_2 = _fre('F02', 'Cabrera', 'Cornide', 2000, 'Da Nang', '0912345679',
             'cabrera@fpt.edu.vn', '09/2022', 'Good', 'Da Nang University')

INT_1 = _int('I01', 'Maria', 'Madeleine', 2002, 'Hue', '0912345680',
             'maria@fpt.edu.vn', 'Software Engineering', 5, 'FPT University')
INT_2 = _int('I02', 'Joana', 'Filipa', 2003, 'Can Tho', '0912345681',
             'joana@fpt.edu.vn', 'Information Systems', 3, 'Hue University')


# RUN 0 — the brief's own screen, end to end: three Experience candidates, two
# Freshers, two Interns, then the search the sample sheet performs.
RUN0 = ('1\n' + EXP_1 + 'Y\n' + EXP_2 + 'Y\n' + EXP_3 + 'N\n'
        + '2\n' + FRE_1 + 'Y\n' + FRE_2 + 'N\n'
        + '3\n' + INT_1 + 'Y\n' + INT_2 + 'N\n'
        + '4\neva\n0\n'          # the brief's own search: two hits, one partial
        + '5\n')

# RUN 1 — every rule refused ONE AT A TIME, so that every message is proven by
# a real console rather than by reading the source.
RUN1 = ('abc\n'                  # the menu itself: not a number
        + '9\n'                  # the menu itself: out of range
        + '4\n'                  # search with nothing created yet
        + '1\n'
        # id, first, last, then birth date refused three ways before it is right
        + 'E01\nAelbrecht\nStefan\n'
        + '19\n'                 # not four digits
        + '2999\n'               # after the current year
        + 'nineteen\n'           # not a number at all
        + '1988\n'
        + 'Brussels\n'
        + '0912\n'               # phone: too short
        + '09-1234-5678\n'       # phone: not all digits
        + '0987654321\n'
        + 'stefan\n'             # email: no @
        + 'stefan@asante\n'      # email: no dot in the domain
        + 'stefan@asante.com\n'
        + '-1\n'                 # experience: below 0
        + '101\n'                # experience: above 100
        + 'five\n'               # experience: not a number
        + '5\nJava\n'
        + 'maybe\n'              # Y/N has no third answer
        + 'Y\n'
        + EXP_1                  # the same id again: refused by the bo layer
        + 'Y\n'
        + _exp('', 'No', 'Id', 1990, 'Hue', '0912345678', 'noid@fpt.edu.vn', 1, 'Java')
        + 'Y\n'
        + _exp('E09', '', 'NoFirstName', 1990, 'Hue', '0912345678', 'nf@fpt.edu.vn', 1, 'Java')
        + 'Y\n'
        + _exp('E09', 'NoLastName', '', 1990, 'Hue', '0912345678', 'nl@fpt.edu.vn', 1, 'Java')
        + 'N\n'
        + '2\n'                  # a Fresher, to prove the rank rule
        + 'F01\nBarbosa\nDe Souza\n1999\nHa Noi\n0912345678\nbarbosa@fpt.edu.vn\n'
        + '06/2021\n'
        + 'Average\n'            # rank: not one of the four
        + 'excellence\n'         # rank: accepted in any case, stored canonically
        + 'FPT University\n'
        + 'N\n'
        + '4\n\n0\n'             # search with no keyword
        + '4\nZorro\n0\n'        # a search that matches nothing
        + '4\nstefan\n1\n'       # the right name, the wrong type
        + '4\nstefan\n7\n0\n'    # the type prompt refuses 7, then accepts 0
        + '5\n')

# RUN 2 — the parts of the search the sample screen only hints at: the case of
# the keyword, the type filter, and a match inside a first name.
RUN2 = ('1\n' + EXP_2 + 'Y\n' + EXP_3 + 'N\n'
        + '3\n' + INT_1 + 'N\n'
        + '4\nEVA\n0\n'          # upper-case keyword, lower-case data
        + '4\nari\n2\n'          # inside the FIRST name (Maria), type 2 only
        + '4\nari\n0\n'          # the same keyword, the other type: no hit
        + '5\n')


# ── the verified consoles ────────────────────────────────────────
#
# Captured from real runs with solkit.capture(), not written by hand.

EXPECT0 = '''CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Experience Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Experience candidate [E01] has been created.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Experience candidate [E02] has been created.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Experience candidate [E03] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0 | 5 | Java
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0 | 3 | C Sharp
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0 | 7 | Testing
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Fresher Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input graduation date: Input rank of graduation (Excellence, Good, Fair, Poor): Input education: Fresher candidate [F01] has been created.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input graduation date: Input rank of graduation (Excellence, Good, Fair, Poor): Input education: Fresher candidate [F02] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0 | 5 | Java
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0 | 3 | C Sharp
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0 | 7 | Testing
==========FRESHER CANDIDATE==============
Barbosa De Souza | 1999 | Ha Noi | 0912345678 | barbosa@fpt.edu.vn | 1 | 06/2021 | Excellence | FPT University
Cabrera Cornide | 2000 | Da Nang | 0912345679 | cabrera@fpt.edu.vn | 1 | 09/2022 | Good | Da Nang University
===========INTERN CANDIDATE==============
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Intern Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input majors: Input semester: Input university name: Intern candidate [I01] has been created.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input majors: Input semester: Input university name: Intern candidate [I02] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0 | 5 | Java
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0 | 3 | C Sharp
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0 | 7 | Testing
==========FRESHER CANDIDATE==============
Barbosa De Souza | 1999 | Ha Noi | 0912345678 | barbosa@fpt.edu.vn | 1 | 06/2021 | Excellence | FPT University
Cabrera Cornide | 2000 | Da Nang | 0912345679 | cabrera@fpt.edu.vn | 1 | 09/2022 | Good | Da Nang University
===========INTERN CANDIDATE==============
Maria Madeleine | 2002 | Hue | 0912345680 | maria@fpt.edu.vn | 2 | Software Engineering | 5 | FPT University
Joana Filipa | 2003 | Can Tho | 0912345681 | joana@fpt.edu.vn | 2 | Information Systems | 3 | Hue University
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
Aguirre Eva
Antosova Adeleva
==========FRESHER CANDIDATE==============
Barbosa De Souza
Cabrera Cornide
===========INTERN CANDIDATE==============
Maria Madeleine
Joana Filipa
Input Candidate name (First name or Last name): Input type of candidate: The candidates found:
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: Goodbye.'''
EXPECT1 = '''CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: You must input a number.
Enter your choice: Please choose from 1 to 5.
Enter your choice: The candidate list is empty.
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Experience Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Birth date must be a number of 4 digits from 1900 to the current year.
Input birth date: Birth date must be a number of 4 digits from 1900 to the current year.
Input birth date: Birth date must be a number of 4 digits from 1900 to the current year.
Input birth date: Input address: Input phone: Phone must be a number with at least 10 digits.
Input phone: Phone must be a number with at least 10 digits.
Input phone: Input email: Email must have the format <account name>@<domain> (eg: annguyen@fpt.edu.vn).
Input email: Email must have the format <account name>@<domain> (eg: annguyen@fpt.edu.vn).
Input email: Input year of experience: Year of experience must be a number from 0 to 100.
Input year of experience: Year of experience must be a number from 0 to 100.
Input year of experience: Year of experience must be a number from 0 to 100.
Input year of experience: Input professional skill: Experience candidate [E01] has been created.
Do you want to continue (Y/N)? Please enter Y or N.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Candidate id [E01] already exists.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Candidate id cannot be empty.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: First name cannot be empty.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Last name cannot be empty.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0 | 5 | Java
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Fresher Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input graduation date: Input rank of graduation (Excellence, Good, Fair, Poor): Rank of graduation must be one of: Excellence, Good, Fair, Poor.
Input rank of graduation (Excellence, Good, Fair, Poor): Input education: Fresher candidate [F01] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0 | 5 | Java
==========FRESHER CANDIDATE==============
Barbosa De Souza | 1999 | Ha Noi | 0912345678 | barbosa@fpt.edu.vn | 1 | 06/2021 | Excellence | FPT University
===========INTERN CANDIDATE==============
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
==========FRESHER CANDIDATE==============
Barbosa De Souza
===========INTERN CANDIDATE==============
Input Candidate name (First name or Last name): Input type of candidate: Candidate name cannot be empty.
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
==========FRESHER CANDIDATE==============
Barbosa De Souza
===========INTERN CANDIDATE==============
Input Candidate name (First name or Last name): Input type of candidate: No candidate found.
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
==========FRESHER CANDIDATE==============
Barbosa De Souza
===========INTERN CANDIDATE==============
Input Candidate name (First name or Last name): Input type of candidate: No candidate found.
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
==========FRESHER CANDIDATE==============
Barbosa De Souza
===========INTERN CANDIDATE==============
Input Candidate name (First name or Last name): Input type of candidate: Please choose from 0 to 2.
Input type of candidate: The candidates found:
Aelbrecht Stefan | 1988 | Brussels | 0987654321 | stefan@asante.com | 0
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: Goodbye.'''
EXPECT2 = '''CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Experience Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Experience candidate [E02] has been created.
Do you want to continue (Y/N)? Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input year of experience: Input professional skill: Experience candidate [E03] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0 | 3 | C Sharp
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0 | 7 | Testing
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: ---------- Create Intern Candidate ----------
Input candidate id: Input first name: Input last name: Input birth date: Input address: Input phone: Input email: Input majors: Input semester: Input university name: Intern candidate [I01] has been created.
Do you want to continue (Y/N)? List of candidate:
===========EXPERIENCE CANDIDATE============
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0 | 3 | C Sharp
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0 | 7 | Testing
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
Maria Madeleine | 2002 | Hue | 0912345680 | maria@fpt.edu.vn | 2 | Software Engineering | 5 | FPT University
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aguirre Eva
Antosova Adeleva
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
Maria Madeleine
Input Candidate name (First name or Last name): Input type of candidate: The candidates found:
Aguirre Eva | 1990 | Sao paulo | 0940394123 | eva@asante.com | 0
Antosova Adeleva | 1989 | Rio de janero | 0984933112 | adelave@janeo.com | 0
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aguirre Eva
Antosova Adeleva
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
Maria Madeleine
Input Candidate name (First name or Last name): Input type of candidate: The candidates found:
Maria Madeleine | 2002 | Hue | 0912345680 | maria@fpt.edu.vn | 2
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: List of candidate:
===========EXPERIENCE CANDIDATE============
Aguirre Eva
Antosova Adeleva
==========FRESHER CANDIDATE==============
===========INTERN CANDIDATE==============
Maria Madeleine
Input Candidate name (First name or Last name): Input type of candidate: No candidate found.
CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).
Enter your choice: Goodbye.'''


solution(
    'J1.L.P0022',
    title_vi='Chương trình quản lý ứng viên',
    files=[('src/entity/CandidateType.java', P0022_TYPE),
           ('src/entity/Candidate.java', P0022_CANDIDATE),
           ('src/entity/Experience.java', P0022_EXPERIENCE),
           ('src/entity/Fresher.java', P0022_FRESHER),
           ('src/entity/Intern.java', P0022_INTERN),
           ('src/bo/CandidateManagement.java', P0022_BO),
           ('src/controller/CandidateController.java', P0022_CONTROLLER),
           ('src/utils/Validator.java', P0022_VALIDATOR),
           ('src/ui/Main.java', P0022_MAIN)],
    main_class='ui.Main',
    runs=[(RUN0, EXPECT0), (RUN1, EXPECT1), (RUN2, EXPECT2)],
    explain_en='''<p><strong>What is really being marked here.</strong> Not the eleven prompts — anybody can
type prompts. What is marked is how much of this program had to be written three times. The answer is
almost none of it: seven of the ten fields live on <code>Candidate</code>, so there is one validation
pass, one search, one listing and one <code>create()</code> method serving all three kinds of candidate.
Slot 1 of the Guidelines says it in one sentence — "Should create Candidate as a SuperClass. Experience,
Fresher and Internship Candidate as SubClasses that extend Candidate" — and everything below follows
from taking that sentence seriously.</p>
<p><strong>The candidate type is asked, never stored.</strong> The brief lists "Candidate type" among the
common attributes, which invites an <code>int type</code> field on <code>Candidate</code>. That is two
sources of truth for one fact: nothing then stops a <code>Fresher</code> being constructed with type 0,
and every screen would disagree with the class of the object it is printing. Here
<code>getCandidateType()</code> is <em>abstract</em> and each subclass returns its own constant, so the
printed code and the real subclass cannot drift apart — and a fourth kind of candidate that forgets to
say what it is fails to compile rather than printing a quiet 0.</p>
<p><strong>One ArrayList, not three.</strong> The Guidelines ask for "ArrayList to store Fresher
Candidate" twice — once under slot 2 and again under slot 3, where the task is <em>Create Intern
Candidate</em>. That is a copy-paste, and reading it as "one list per kind" is the expensive way to
read it. A candidate id has to be unique across the <strong>company</strong>, not within one kind, so
three lists would mean writing the duplicate check three times and then a fourth time across the three.
One <code>List&lt;Candidate&gt;</code> makes the rule a single loop, and <code>getByType()</code> hands
the listing screen the per-kind view it wants without storing anything twice.</p>
<p><strong>Where each rule lives, and why the split is not arbitrary.</strong> The
<code>Validator</code> answers "is what was typed a legal <em>value</em> of this field?" — four digits
between 1900 and now, ten digits or more, an @ with a domain after it, 0 to 100, one of four ranks.
Those are exactly the five checks the Requirements section names, each concerns one field on its own,
and the right response to failing one is to ask <em>that field</em> again. The <code>bo</code> layer
answers a different kind of question — is this id already taken, is the list empty — which needs the
whole collection and so is thrown, with the wording owned in one file. Put the format rules in
<code>bo</code> instead and a mistyped phone number throws away the six fields the user has already
typed correctly.</p>
<p><strong>The search rule is hidden in the brief's picture, not in its words.</strong> The sample types
<code>eva</code> and gets back two candidates: <em>Aguirre <strong>Eva</strong></em> and <em>Antošová
Ad<strong>ele</strong>va</em>. "Adeleva" is not equal to "eva" — it <em>contains</em> it. So the search
is <code>contains()</code>, not <code>equals()</code>, and it is case-insensitive, and it is filtered by
the type that was typed on the next line. A solution written from the prose alone passes a casual read
and fails the sheet's own screenshot. The first name and the last name are tested separately rather
than against the joined full name, because the brief says "First Name or Last Name" and matching the
joined string would also match a keyword straddling the space, like "ra ev".</p>
<p><strong>Two screens, two methods.</strong> <code>toString()</code> is overridden by every subclass to
append its own extra attributes, and that is what the listing after <em>N</em> prints — an Experience
shows its years and skill, an Intern its majors and semester, chosen by the object rather than by an
<code>if</code>. The search result must <em>not</em> show them: the brief lists exactly six columns
there whatever the candidate is, so that line is a separate method, <code>getSummary()</code>, on the
superclass. One screen changing shape is then not a reason to touch the other.</p>
<p><strong>The birth-date rule and the clock.</strong> "1900..Current Year" means the upper bound is
read from <code>Year.now()</code>, never typed in as a literal — a hard-coded year is a bug with a
delivery date. The message, though, says "the current year" instead of naming it: a message that
printed 2026 would make this program's console change on the first of January, and a screen that cannot
be diffed twice cannot be marked twice. Note also that "length is 4 characters" and "1900 to the
current year" are the same rule said twice, so one range check enforces both — but the length is still
checked, because otherwise <code>0999</code> would parse to 999 and be rejected for the wrong
reason.</p>
<p><strong>The phone is a String, and that is a decision.</strong> "Is number with minimum 10
characters" tempts you to <code>Integer.parseInt</code>. Do that and <code>0912345678</code> comes back
as 912345678 — every Vietnamese mobile number starts with a zero, and the program would silently eat
it. A phone number is not a number you do arithmetic on. It is stored as text and checked digit by
digit.</p>
<p><strong>Where the brief contradicts itself — say this at the defence.</strong> Four places. (1) The
Program Specifications say the system does "creating, updating, deleting as well as searching", but the
Main Screen, the function details and all five Guidelines slots contain only three creates, a search
and an exit. The Guidelines are the contract, so there is no update or delete here, and inventing two
menu items the marker's script does not press is not free marks. (2) The menu is numbered 2–6 by the
sheet's own list markup while the sentence underneath says "choose 1 … 5" — 1 to 5 wins, and that same
sentence's missing "Create" before "Internship Candidate" is copied as-is, because the screen is
diffed. (3) The three banners are neither the same width nor symmetric — 11 and 12 <code>=</code>
around EXPERIENCE, 10 and 14 around FRESHER, 11 and 14 around INTERN. They are copied character for
character rather than tidied. (4) The sample result rows space their separators inconsistently
(<code>Sao paulo| 940394</code>, <code>984933|</code>); those are typos in a picture rather than a
format, so every column here is separated by a consistent <code>" | "</code>.</p>
<p><strong>How this was verified.</strong> Three scripted runs, compiled and executed, console compared
character for character. Run 0 is the sheet's own screen end to end: three Experience candidates, two
Freshers, two Interns, the grouped listing after each <em>N</em>, and then the brief's own search —
<code>eva</code>, type <code>0</code> — which returns Aguirre Eva and Antosova Adeleva exactly as the
picture does. Run 1 refuses every rule <strong>one at a time</strong>, so no message is taken on trust:
the menu given a word and given 9; a search before anything exists; birth date as 19, as 2999 and as
"nineteen"; phone too short and phone with dashes; email with no @ and email with no dot in the domain;
experience as −1, as 101 and as "five"; a rank of "Average" and then "excellence" in the wrong case,
which is accepted and stored as "Excellence"; a duplicate id, an empty id, an empty first name, an
empty last name; a Y/N question answered "maybe"; a search with no keyword, a search that matches
nothing, a search for the right name under the wrong type, and a type of 7. Run 2 checks the three
things the sample only hints at: an upper-case keyword against lower-case data, a match inside a
<em>first</em> name (<code>ari</code> in Maria), and the same keyword under the other type returning
nothing.</p>
<p><strong>One question the examiner will ask.</strong> "Why is there no file?" Because the brief does
not ask for one — it says "Create Candidate and store in ArrayList", and the data lives for one run.
Being able to say that, rather than having bolted on serialisation nobody requested, is the answer;
<code>Candidate implements Serializable</code> is there so that adding it later is one line in the bo
layer and no change anywhere else.</p>''',
    explain_vi='''<p><strong>Bài này thật ra chấm cái gì.</strong> Không phải mười một câu hỏi nhập liệu —
ai gõ prompt chẳng được. Cái được chấm là bao nhiêu phần của chương trình này phải viết ba lần. Câu trả
lời là gần như không phần nào: bảy trong mười trường nằm ở <code>Candidate</code>, nên chỉ có một lượt
kiểm tra dữ liệu, một hàm tìm kiếm, một hàm hiển thị danh sách và một phương thức <code>create()</code>
phục vụ cả ba loại ứng viên. Slot 1 của phần Hướng dẫn nói gọn trong một câu — "Should create Candidate
as a SuperClass. Experience, Fresher and Internship Candidate as SubClasses that extend Candidate" — và
mọi thứ bên dưới chỉ là hệ quả của việc coi câu đó là nghiêm túc.</p>
<p><strong>Loại ứng viên được HỎI, không được LƯU.</strong> Đề liệt kê "Candidate type" trong nhóm thuộc
tính chung, điều đó mời gọi ta thêm một trường <code>int type</code> vào <code>Candidate</code>. Đó là
hai nguồn sự thật cho một dữ kiện: khi ấy chẳng gì ngăn được một <code>Fresher</code> được tạo ra với
type 0, và mọi màn hình sẽ mâu thuẫn với chính lớp của đối tượng nó đang in. Ở đây
<code>getCandidateType()</code> là <em>abstract</em> và mỗi lớp con trả về hằng số của mình, nên mã in
ra và lớp con thật không thể lệch nhau — và một loại ứng viên thứ tư mà quên khai báo mình là ai sẽ lỗi
biên dịch chứ không lặng lẽ in ra số 0.</p>
<p><strong>MỘT ArrayList, không phải ba.</strong> Phần Hướng dẫn viết "ArrayList to store Fresher
Candidate" hai lần — một ở slot 2, và một lần nữa ở slot 3, nơi nhiệm vụ là <em>Create Intern
Candidate</em>. Đó là lỗi sao chép, và hiểu nó thành "mỗi loại một list" là cách hiểu đắt giá. Mã ứng
viên phải là duy nhất trong <strong>toàn công ty</strong>, không phải trong một loại, nên ba list nghĩa
là viết phép kiểm trùng ba lần rồi lần thứ tư cho cả ba. Một <code>List&lt;Candidate&gt;</code> biến
luật đó thành một vòng lặp duy nhất, còn <code>getByType()</code> vẫn trả về đúng phần theo loại mà màn
hình danh sách cần, mà không lưu gì hai lần.</p>
<p><strong>Mỗi luật nằm ở đâu, và vì sao cách chia đó không tuỳ tiện.</strong> <code>Validator</code>
trả lời câu hỏi "cái vừa gõ có phải một <em>giá trị</em> hợp lệ của trường này không?" — bốn chữ số từ
1900 tới năm hiện tại, từ mười chữ số trở lên, có @ và có tên miền phía sau, 0 tới 100, một trong bốn
xếp loại. Đó đúng là năm phép kiểm mà phần Requirements gọi tên, mỗi phép chỉ liên quan tới một trường,
và phản ứng đúng khi sai là hỏi lại <em>đúng trường đó</em>. Tầng <code>bo</code> trả lời một loại câu
hỏi khác — mã này đã có ai dùng chưa, danh sách có rỗng không — những câu cần nhìn cả tập dữ liệu, nên
nó ném ngoại lệ, và mọi câu chữ nằm gọn trong một tệp. Đặt luật định dạng vào <code>bo</code> thì một số
điện thoại gõ sai sẽ ném đi luôn sáu trường người dùng vừa gõ đúng.</p>
<p><strong>Luật tìm kiếm giấu trong HÌNH của đề, không nằm trong lời.</strong> Ví dụ mẫu gõ
<code>eva</code> và nhận về hai ứng viên: <em>Aguirre <strong>Eva</strong></em> và <em>Antošová
Ad<strong>ele</strong>va</em>. "Adeleva" không <em>bằng</em> "eva" — nó <em>chứa</em> "eva". Vậy tìm kiếm
phải là <code>contains()</code> chứ không phải <code>equals()</code>, phải không phân biệt hoa thường,
và phải lọc theo loại được gõ ở dòng kế tiếp. Lời giải viết chỉ từ phần văn xuôi thì qua được cái liếc
mắt và trượt chính ảnh chụp màn hình của đề. Họ và tên được kiểm riêng từng cái chứ không ghép lại, vì
đề nói "First Name or Last Name"; kiểm trên chuỗi ghép sẽ khớp cả từ khoá vắt qua dấu cách như "ra ev",
vốn không phải tên của ai cả.</p>
<p><strong>Hai màn hình, hai phương thức.</strong> <code>toString()</code> được mọi lớp con ghi đè để
nối thêm các thuộc tính riêng, và đó là thứ danh sách in ra sau khi trả lời <em>N</em> — Experience khoe
số năm kinh nghiệm và kỹ năng, Intern khoe ngành và kỳ, do chính đối tượng chọn chứ không do một câu
<code>if</code>. Kết quả tìm kiếm thì <em>không</em> được in những thứ đó: đề liệt kê đúng sáu cột ở đấy
bất kể ứng viên loại nào, nên dòng đó là một phương thức riêng, <code>getSummary()</code>, đặt ở lớp
cha. Một màn hình đổi hình dạng khi ấy không còn là lý do phải sửa màn hình kia.</p>
<p><strong>Luật năm sinh và cái đồng hồ.</strong> "1900..Current Year" nghĩa là cận trên phải đọc từ
<code>Year.now()</code>, tuyệt đối không gõ cứng — một năm gõ cứng là con bug đã hẹn sẵn ngày phát nổ.
Nhưng thông báo lỗi thì viết "the current year" chứ không nêu con số: thông báo in ra 2026 sẽ làm màn
hình của chương trình đổi vào ngày 1 tháng 1, mà màn hình không so được hai lần thì không chấm được hai
lần. Cũng để ý "length is 4 characters" và "1900 tới năm hiện tại" là một luật nói hai lần, nên một phép
kiểm khoảng là đủ cho cả hai — nhưng độ dài vẫn được kiểm, vì nếu không thì <code>0999</code> sẽ được
hiểu thành 999 và bị từ chối vì một lý do sai.</p>
<p><strong>Số điện thoại là String, và đó là một quyết định.</strong> "Is number with minimum 10
characters" khiến ta muốn dùng <code>Integer.parseInt</code>. Làm thế thì <code>0912345678</code> trở
thành 912345678 — mọi số di động Việt Nam đều bắt đầu bằng số 0, và chương trình đã lặng lẽ nuốt mất nó.
Số điện thoại không phải con số để làm toán. Nó được lưu dạng chữ và kiểm từng ký tự.</p>
<p><strong>Chỗ đề tự mâu thuẫn — hãy nói thẳng khi bảo vệ.</strong> Bốn chỗ. (1) Phần Program
Specifications nói hệ thống có "creating, updating, deleting as well as searching", nhưng Main Screen,
phần function details và cả năm slot Hướng dẫn chỉ có ba chức năng tạo, một tìm kiếm và một thoát. Phần
Hướng dẫn mới là bản có hiệu lực, nên ở đây không có sửa/xoá, và tự bịa thêm hai mục thực đơn mà kịch
bản chấm không hề bấm tới thì không được điểm nào. (2) Thực đơn bị chính markup danh sách của đề đánh số
2–6 trong khi câu bên dưới nói "choose 1 … 5" — 1 tới 5 thắng, và chữ "Create" bị thiếu trước
"Internship Candidate" trong đúng câu đó được chép nguyên, vì màn hình sẽ bị so từng ký tự. (3) Ba dải
tiêu đề không cùng độ dài và không đối xứng — 11 và 12 dấu <code>=</code> quanh EXPERIENCE, 10 và 14
quanh FRESHER, 11 và 14 quanh INTERN. Chép nguyên xi, không sửa cho đẹp. (4) Các dòng kết quả mẫu đặt
dấu phân cách thiếu nhất quán (<code>Sao paulo| 940394</code>, <code>984933|</code>); đó là lỗi gõ
trong một tấm hình chứ không phải một định dạng, nên ở đây mọi cột đều ngăn bằng đúng
<code>" | "</code>.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy theo kịch bản, biên dịch và thực thi thật, so
màn hình từng ký tự. Lần 0 là đúng màn hình của đề từ đầu tới cuối: ba ứng viên Experience, hai Fresher,
hai Intern, danh sách nhóm in ra sau mỗi lần trả lời <em>N</em>, rồi chính phép tìm kiếm của đề —
<code>eva</code>, loại <code>0</code> — trả về Aguirre Eva và Antosova Adeleva y như hình. Lần 1 vi phạm
từng luật <strong>một lần một</strong>, để không thông báo nào được tin suông: thực đơn nhận một chữ và
nhận số 9; tìm kiếm khi chưa tạo gì; năm sinh gõ 19, gõ 2999 và gõ "nineteen"; điện thoại quá ngắn và
điện thoại có dấu gạch; email không có @ và email không có dấu chấm trong tên miền; kinh nghiệm −1, 101
và "five"; xếp loại "Average" rồi "excellence" viết thường, được chấp nhận và lưu thành "Excellence";
mã trùng, mã rỗng, họ rỗng, tên rỗng; câu hỏi Y/N trả lời "maybe"; tìm kiếm không nhập từ khoá, tìm
kiếm không ra kết quả, tìm đúng tên nhưng sai loại, và gõ loại 7. Lần 2 kiểm ba thứ mà hình mẫu chỉ
gợi ý: từ khoá viết hoa trên dữ liệu viết thường, khớp nằm trong <em>họ</em> (<code>ari</code> trong
Maria), và cùng từ khoá đó ở loại khác thì không ra gì.</p>
<p><strong>Một câu người chấm sẽ hỏi.</strong> "Sao không có tệp dữ liệu?" Vì đề không yêu cầu — đề viết
"Create Candidate and store in ArrayList", và dữ liệu sống trong một lần chạy. Trả lời được như thế,
thay vì gắn thêm phần ghi tệp không ai đòi, mới là câu trả lời đúng; <code>Candidate implements
Serializable</code> có ở đó để nếu sau này cần thì chỉ thêm một dòng ở tầng bo và không phải sửa chỗ nào
khác.</p>''',
    hints_en=[
        'Put all seven common fields in Candidate; Experience, Fresher and Intern add only what differs.',
        'Do not store the type as an int field — make getCandidateType() abstract so the class IS the type.',
        'One ArrayList<Candidate> holds all three kinds: an id must be unique across the company, not per kind.',
        'Field-format rules (birth date, phone, email, experience, rank) re-prompt in the Validator; collection rules (duplicate id, empty list) throw from bo.',
        'Search with contains() on first name OR last name, case-insensitive, then filter by type — the brief\'s own "eva" also finds "Adeleva".',
        'Keep the phone as a String: parseInt would eat the leading 0 of 0912345678.',
    ],
    hints_vi=[
        'Đặt cả bảy trường dùng chung vào Candidate; Experience, Fresher, Intern chỉ thêm phần khác nhau.',
        'Đừng lưu loại ứng viên bằng một trường int — để getCandidateType() abstract, lớp chính LÀ loại.',
        'Một ArrayList<Candidate> chứa cả ba loại: mã ứng viên phải duy nhất toàn công ty, không phải trong từng loại.',
        'Luật định dạng trường (năm sinh, điện thoại, email, kinh nghiệm, xếp loại) thì hỏi lại trong Validator; luật của tập dữ liệu (trùng mã, danh sách rỗng) thì ném ngoại lệ từ bo.',
        'Tìm bằng contains() trên họ HOẶC tên, không phân biệt hoa thường, rồi lọc theo loại — chính từ "eva" của đề cũng khớp "Adeleva".',
        'Giữ số điện thoại là String: parseInt sẽ nuốt mất số 0 đầu của 0912345678.',
    ],
)


# ── Vietnamese brief ─────────────────────────────────────────────
VI = {
    'J1.L.P0022': '''<h3>Bối cảnh</h3>
<p>Phần mềm quản lý ứng viên được viết cho bộ phận nhân sự (HR) của một công ty. Ở bất kỳ công ty nào,
quản lý ứng viên cũng là việc quan trọng và rất khó làm bằng tay. Đưa việc đó lên máy giúp khắc phục
được vấn đề và làm việc hiệu quả hơn.</p>
<h3>Đặc tả chương trình</h3>
<p>Hệ thống quản lý ứng viên gồm các chức năng tạo mới, cập nhật, xoá và tìm kiếm.</p>
<p>Tạo ba lớp cho ba loại ứng viên: Experience (có kinh nghiệm), Fresher (mới ra trường), Intern (thực
tập sinh).</p>
<p>Mọi ứng viên đều có các thuộc tính chung: Candidate Id, First Name, Last Name, Birth Date, Address,
Phone, Email và Candidate type. Candidate type có ba giá trị:</p>
<ul>
<li><strong>0</strong>: ứng viên Experience</li>
<li><strong>1</strong>: ứng viên Fresher</li>
<li><strong>2</strong>: ứng viên Intern</li>
</ul>
<p>Ngoài ra mỗi loại có thêm những thuộc tính riêng:</p>
<ul>
<li><strong>Experience</strong>: số năm kinh nghiệm (ExpInYear), kỹ năng chuyên môn (ProSkill).</li>
<li><strong>Fresher</strong>: thời gian tốt nghiệp (Graduation_date), xếp loại tốt nghiệp
(Graduation_rank) và trường đã tốt nghiệp (Education).</li>
<li><strong>Intern</strong>: chuyên ngành (Majors), kỳ học (Semester), tên trường (University name).</li>
</ul>
<p>Màn hình chính:</p>
<pre>CANDIDATE MANAGEMENT SYSTEM
1. Experience
2. Fresher
3. Internship
4. Searching
5. Exit
(Please choose 1 to Create Experience Candidate, 2 to Create Fresher Candidate, 3 to Internship Candidate, 4 to Searching and 5 to Exit program).</pre>
<h3>Chi tiết chức năng</h3>
<p>Tạo ứng viên và lưu vào <code>ArrayList</code>.</p>
<h4>1. Kiểm tra dữ liệu</h4>
<p>Chương trình phải kiểm tra hợp lệ cho: Date of Birth, Phone, Email, Year of Experience, Rank of
Graduation.</p>
<ul>
<li><strong>Birth Date</strong>: là số có độ dài 4 ký tự (1900..năm hiện tại).</li>
<li><strong>Phone</strong>: là số, tối thiểu 10 ký tự.</li>
<li><strong>Email</strong>: theo định dạng &lt;account name&gt;@&lt;domain&gt; (ví dụ:
annguyen@fpt.edu.vn).</li>
<li><strong>Year of Experience</strong>: là số từ 0 đến 100.</li>
<li><strong>Rank of Graduation</strong>: một trong 4 giá trị (Excellence, Good, Fair, Poor).</li>
</ul>
<h4>2. Tạo ứng viên</h4>
<p>Từ màn hình chính, người dùng chọn một mục (1, 2, 3) để tạo ứng viên. Sau mỗi ứng viên được tạo, hệ
thống hỏi: <code>Do you want to continue (Y/N)?</code>. Chọn <strong>Y</strong> để tạo tiếp; chọn
<strong>N</strong> thì chương trình quay lại màn hình chính và hiển thị toàn bộ ứng viên đã tạo.</p>
<h4>3. Chức năng tìm kiếm</h4>
<p>Người dùng chọn mục 4, chương trình hiển thị toàn bộ ứng viên rồi yêu cầu nhập tên ứng viên (First
Name hoặc Last Name) và loại ứng viên. Chương trình tìm và hiển thị kết quả gồm: tên ứng viên (First
Name + Last Name), Birth Date, Address, Phone, Email và Candidate type. Ví dụ:</p>
<pre>List of candidate:
===========EXPERIENCE CANDIDATE============
Aelbrecht Stefan
Aguirre Eva
Ahlgren Maria
Antosova Adeleva
==========FRESHER CANDIDATE==============
Barbosa De Souza
Cabrera Cornide
Calderon Cuevas
Casulari Motta
===========INTERN CANDIDATE==============
Maria Madeleine
Csokan Babett
Joana Filipa
Patricia Carine
Input Candidate name (First name or Last name): eva
Input type of candidate: 0
The candidates found:
Aguirre Eva | 1990 | Sao paulo | 940394 | eva@asante.com | 0
Antosova Adeleva | 1989 | Rio de janero | 984933 | adelave@janeo.com | 0</pre>
<p>Chú ý ví dụ trên: từ khoá <code>eva</code> khớp cả <em>Eva</em> lẫn <em>Adeleva</em> — nghĩa là tìm
theo kiểu "có chứa", không phân biệt hoa thường, rồi lọc theo đúng loại vừa nhập.</p>
<h3>Yêu cầu kỹ thuật</h3>
<ol>
<li>Lập trình hướng đối tượng: sử dụng kế thừa.</li>
<li>Chỉ dùng các lớp và hàm lõi của Java.</li>
</ol>
<h3>Hướng dẫn</h3>
<ul>
<li><strong>Slot 1 — Thiết kế &amp; tạo ứng viên Experience</strong>: nên tạo <code>Candidate</code> là
lớp cha; <code>Experience</code>, <code>Fresher</code>, <code>Intern</code> là các lớp con kế thừa
<code>Candidate</code>.</li>
<li><strong>Slot 2 — Tạo ứng viên Fresher</strong>: dùng <code>ArrayList</code> để lưu ứng viên.</li>
<li><strong>Slot 3 — Tạo ứng viên Intern</strong>: dùng <code>ArrayList</code> để lưu ứng viên.</li>
<li><strong>Slot 4 — Tìm kiếm ứng viên</strong>.</li>
<li><strong>Slot 5 — Rà soát lại chương trình</strong>.</li>
</ul>
<p><em>Lưu ý về mâu thuẫn trong đề</em>: phần đặc tả có nhắc tới "cập nhật, xoá" nhưng màn hình chính,
phần chi tiết chức năng và cả năm slot Hướng dẫn đều chỉ có ba chức năng tạo, một tìm kiếm và một thoát
— phần Hướng dẫn là bản có hiệu lực. Ba dải tiêu đề <code>=</code> trong màn hình mẫu không cùng độ dài
và không đối xứng; hãy chép nguyên văn.</p>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
