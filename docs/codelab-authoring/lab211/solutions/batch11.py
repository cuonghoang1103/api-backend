# Batch 11 — J1.S.P0054 (contact management), J1.S.P0052 (East Asia countries).
import re
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0054 — Contact Management Program (64 LOC)
# ════════════════════════════════════════════════════════════════

P0054_CONTACT = '''package entity;

import java.io.Serializable;

/**
 * One contact.
 *
 * The full name and its two halves are ONE piece of state, not three:
 * setFullName does the splitting itself, so there is no way to change the name
 * and leave firstName/lastName describing the old one. A class that CAN hold
 * two contradictory versions of the same fact eventually will.
 *
 * setFullName is final because the constructor calls it. Calling an overridable
 * method from a constructor is a classic trap - a subclass override would run
 * before the subclass's own fields were initialised. Declaring it final says
 * "this one is safe to call here" and makes the compiler keep it that way.
 */
public class Contact implements Serializable {

    private static final long serialVersionUID = 1L;

    private int id;
    private String fullName;
    private String firstName;
    private String lastName;
    private String group;
    private String address;
    private String phone;

    public Contact() {
    }

    /**
     * The ID is NOT a parameter. The brief says it is generated, so the only
     * place that may set it is the code that knows what the last one was.
     */
    public Contact(String fullName, String group, String address, String phone) {
        setFullName(fullName);
        this.group = group;
        this.address = address;
        this.phone = phone;
    }

    /**
     * Splits the name at the FIRST space, exactly as the brief says.
     *
     * "Raul Gonzalez"      -> first "Raul",  last "Gonzalez"
     * "Ronaldo de Assis"   -> first "Ronaldo", last "de Assis"  (first space only)
     * "Cher"               -> first "Cher",  last ""
     *
     * The brief does not say what a one-word name should do, and a marker will
     * type one. Rejecting it would invent a validation rule the brief never
     * states; putting the single word in the last name would print a person
     * with no first name. Everything typed before the first space is the first
     * name - and with no space, that is the whole thing - so the single word
     * becomes the first name and the last name is empty. The full name is still
     * stored intact, so nothing is lost either way.
     */
    public final void setFullName(String fullName) {
        this.fullName = fullName == null ? "" : fullName.trim();
        int space = this.fullName.indexOf(' ');
        if (space < 0) {
            this.firstName = this.fullName;
            this.lastName = "";
        } else {
            this.firstName = this.fullName.substring(0, space).trim();
            this.lastName = this.fullName.substring(space + 1).trim();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
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

    @Override
    public String toString() {
        return id + " - " + fullName;
    }
}
'''

P0054_BO = '''package bo;

import entity.Contact;
import java.util.List;

/**
 * The three methods the Guidelines name, with the signatures they name.
 *
 * The Guidelines hand the List in as a parameter rather than letting this class
 * own it, so the class is deliberately STATELESS: the list lives in the screen
 * layer and is passed down. That is not how a bo is usually built, but the
 * signature is the contract a marker checks, and inventing a private list here
 * as well would mean two places that both think they hold the contacts.
 *
 * displayAll printing is the same story: a bo should not touch the screen, but
 * the brief's own signature returns void and is called "display", so printing
 * is the only thing it can mean. Both departures are the brief's, not ours -
 * say so if you are asked, rather than pretending the layering is clean.
 */
public class ContactManager {

    /**
     * Fixed column widths, not tab stops.
     *
     * The brief's expected screen is a \\t table, and it is already broken
     * there: "Iker Casillas" is 13 characters, so it eats its tab stop and the
     * First Name column jumps left on that row alone. printf with widths cannot
     * do that - every row lines up whatever the names are. The widths are
     * generous enough that a long name pushes the row out instead of losing the
     * alignment silently.
     */
    private static final String ROW = "%-4s%-18s%-12s%-12s%-8s%-12s%s%n";

    /** The ID rule, in the one place that can see the whole list. */
    public int nextId(List<Contact> list) {
        if (list.isEmpty()) {
            return 1;
        }
        // "new contact has ID equal to last ID contact + 1" - the brief's own
        // words, so it is the LAST element that is asked, not the largest ID.
        // The difference shows after a deletion: remove the tail and the next
        // contact reuses its ID. Taking max + 1 would avoid that, but it would
        // also be a different rule from the one on the sheet.
        return list.get(list.size() - 1).getId() + 1;
    }

    /**
     * Adds one contact, stamping the generated ID on the way in.
     *
     * Stamping it here rather than in the caller means the rule cannot be
     * bypassed by a screen that forgets to ask for the next ID.
     */
    public boolean addContact(List<Contact> list, Contact contact) {
        if (list == null || contact == null) {
            return false;
        }
        contact.setId(nextId(list));
        return list.add(contact);
    }

    public void displayAll(List<Contact> list) {
        if (list == null || list.isEmpty()) {
            System.out.println("No found contact");
            return;
        }
        System.out.printf(ROW, "ID", "Name", "First Name", "Last Name", "Group", "Address", "Phone");
        for (Contact contact : list) {
            System.out.printf(ROW, contact.getId(), contact.getFullName(),
                    contact.getFirstName(), contact.getLastName(),
                    contact.getGroup(), contact.getAddress(), contact.getPhone());
        }
    }

    /**
     * Deletes by identity of the ID, not by list.remove(Object).
     *
     * remove(Object) uses equals(), and Contact does not override it, so it
     * would only ever match the very same object. Scanning for the ID keeps
     * working if the caller rebuilds a Contact carrying just the ID - which is
     * the natural thing to do when the user typed an ID, not an object.
     */
    public boolean deleteContact(List<Contact> list, Contact contact) {
        if (list == null || contact == null) {
            return false;
        }
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId() == contact.getId()) {
                list.remove(i);
                return true;
            }
        }
        return false;
    }

    /** The lookup the screen needs before it can call deleteContact. */
    public Contact findById(List<Contact> list, int id) {
        for (Contact contact : list) {
            if (contact.getId() == id) {
                return contact;
            }
        }
        return null;
    }
}
'''

P0054_VALIDATOR = '''package utils;

import java.util.Scanner;
import java.util.regex.Pattern;

/** Every keyboard read and every check in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    /**
     * The rejection message, word for word and bullet for bullet from the brief.
     *
     * The bullet is written as \\u2022 rather than pasted in. A source file that
     * carries a non-ASCII character only prints it correctly when the compiler
     * and the console agree on the encoding, and they often do not - a NetBeans
     * project handed in on another machine is exactly where that goes wrong.
     * The escape says the same thing in pure ASCII and cannot be mangled.
     */
    private static final String PHONE_FORMATS =
            "Please input Phone flow\\n"
            + "\\u2022 1234567890\\n"
            + "\\u2022 123-456-7890\\n"
            + "\\u2022 123-456-7890 x1234\\n"
            + "\\u2022 123-456-7890 ext1234\\n"
            + "\\u2022 (123)-456-7890\\n"
            + "\\u2022 123.456.7890\\n"
            + "\\u2022 123 456 7890";

    /**
     * One pattern, one branch per accepted format - the brief's list, in order.
     *
     * It is deliberately a plain alternation rather than something clever like
     * \\d{3}([-. ])\\d{3}\\1\\d{4}. The clever version is shorter, but it also
     * accepts "123.456.7890 x1234", which is not one of the seven formats. A
     * validator that quietly accepts more than it was told to is a bug you only
     * find when someone else's data arrives.
     *
     * matches() anchors the whole string, so a top-level alternation is safe
     * here; find() would happily match "1234567890" inside "call 1234567890 now".
     * Compiled once as a static final Pattern: recompiling the regex on every
     * keystroke is work done for nothing.
     */
    private static final Pattern PHONE = Pattern.compile(
            "\\\\d{10}"
            + "|\\\\d{3}-\\\\d{3}-\\\\d{4}( (x|ext)\\\\d{4})?"
            + "|\\\\(\\\\d{3}\\\\)-\\\\d{3}-\\\\d{4}"
            + "|\\\\d{3}\\\\.\\\\d{3}\\\\.\\\\d{4}"
            + "|\\\\d{3} \\\\d{3} \\\\d{4}");

    private Validator() {
    }

    public static int getInt(String message, String error, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
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

    public static String getNonBlank(String message, String error) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println(error);
        }
    }

    public static String getPhone(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (PHONE.matcher(line).matches()) {
                return line;
            }
            System.out.println(PHONE_FORMATS);
        }
    }
}
'''

P0054_MAIN = '''package ui;

import bo.ContactManager;
import entity.Contact;
import java.util.ArrayList;
import java.util.List;
import utils.Validator;

/** The menu and the screen, nothing else. */
public class Main {

    private static final String MENU_ERROR = "Please choice one option from 1 to 4.";

    public static void main(String[] args) {
        // The list lives here because the Guidelines' three methods take it as
        // a parameter - see ContactManager for why that is their decision.
        List<Contact> contacts = new ArrayList<>();
        ContactManager manager = new ContactManager();

        boolean running = true;
        while (running) {
            System.out.println("========= Contact program =========");
            System.out.println("1. Add a Contact");
            System.out.println("2. Display all Contact");
            System.out.println("3. Delete a Contact");
            System.out.println("4. Exit");

            switch (Validator.getInt("Please choice one option: Your choice: ", MENU_ERROR, 1, 4)) {
                case 1:
                    add(manager, contacts);
                    break;
                case 2:
                    System.out.println("--------------------------------- Display all Contact ----------------------------");
                    manager.displayAll(contacts);
                    break;
                case 3:
                    delete(manager, contacts);
                    break;
                default:
                    running = false;
            }
        }
    }

    private static void add(ContactManager manager, List<Contact> contacts) {
        System.out.println("-------- Add a Contact --------");
        String name = Validator.getNonBlank("Enter Name: ", "Name must not be blank.");
        String group = Validator.getNonBlank("Enter Group: ", "Group must not be blank.");
        String address = Validator.getNonBlank("Enter Address: ", "Address must not be blank.");
        String phone = Validator.getPhone("Enter Phone: ");
        if (manager.addContact(contacts, new Contact(name, group, address, phone))) {
            System.out.println("Successful");
        }
    }

    /**
     * The user types an ID; deleteContact wants a Contact. So the ID has to be
     * turned into a contact first, and THAT lookup is where "No found contact"
     * comes from - not from the delete itself.
     */
    private static void delete(ContactManager manager, List<Contact> contacts) {
        System.out.println("------- Delete a Contact -------");
        // The same message covers "not a number" and "0 or negative", because
        // IDs start at 1 - a non-positive ID can never exist either.
        int id = Validator.getInt("Enter ID: ", "ID is digit", 1, Integer.MAX_VALUE);
        Contact target = manager.findById(contacts, id);
        if (target == null) {
            System.out.println("No found contact");
            return;
        }
        if (manager.deleteContact(contacts, target)) {
            System.out.println("Successful");
        }
    }
}
'''


# The menu and its prompt. The prompt ends with print(), not println(), so the
# NEXT thing the program writes lands on the same line - that is why this
# constant has no trailing newline.
P0054_MENU = ('========= Contact program =========\n'
              '1. Add a Contact\n'
              '2. Display all Contact\n'
              '3. Delete a Contact\n'
              '4. Exit\n'
              'Please choice one option: Your choice: ')

P0054_PHONE_LIST = ('Please input Phone flow\n'
                    '• 1234567890\n'
                    '• 123-456-7890\n'
                    '• 123-456-7890 x1234\n'
                    '• 123-456-7890 ext1234\n'
                    '• (123)-456-7890\n'
                    '• 123.456.7890\n'
                    '• 123 456 7890\n')

P0054_ADD = ('-------- Add a Contact --------\n'
             'Enter Name: Enter Group: Enter Address: Enter Phone: ')

P0054_BANNER = '--------------------------------- Display all Contact ----------------------------\n'


def _row54(*cells):
    """The same column widths as the Java printf, so the two cannot drift."""
    c = [str(x) for x in cells]
    return (f'{c[0]:<4}{c[1]:<18}{c[2]:<12}{c[3]:<12}'
            f'{c[4]:<8}{c[5]:<12}{c[6]}')


P0054_HEADER = _row54('ID', 'Name', 'First Name', 'Last Name', 'Group', 'Address', 'Phone')


solution(
    'J1.S.P0054',
    title_vi='Chương trình quản lý danh bạ',
    files=[('src/entity/Contact.java', P0054_CONTACT),
           ('src/bo/ContactManager.java', P0054_BO),
           ('src/utils/Validator.java', P0054_VALIDATOR),
           ('src/ui/Main.java', P0054_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's own screen: a bad phone, then a good one; display;
        # a non-numeric ID, then a real delete; display an empty list; exit.
        ('1\nRaul Gonzalez\nStar\nSpain\n09\n1234567890\n2\n3\na\n1\n2\n4\n',
         P0054_MENU + P0054_ADD + P0054_PHONE_LIST + 'Enter Phone: Successful\n'
         + P0054_MENU + P0054_BANNER + P0054_HEADER + '\n'
         + _row54(1, 'Raul Gonzalez', 'Raul', 'Gonzalez', 'Star', 'Spain', '1234567890') + '\n'
         + P0054_MENU + '------- Delete a Contact -------\n'
         'Enter ID: ID is digit\nEnter ID: Successful\n'
         + P0054_MENU + P0054_BANNER + 'No found contact\n'
         + P0054_MENU),
        # Run 1 — all SEVEN accepted formats, one per contact, plus a value that
        # must be rejected. This is the only way to know the regex is right.
        ('1\nA One\nStar\nSpain\n1234567890\n'
         '1\nB Two\nStar\nSpain\n123-456-7890\n'
         '1\nC Three\nStar\nSpain\n123-456-7890 x1234\n'
         '1\nD Four\nStar\nSpain\n123-456-7890 ext1234\n'
         '1\nE Five\nStar\nSpain\n(123)-456-7890\n'
         '1\nF Six\nStar\nSpain\n123.456.7890\n'
         '1\nG Seven\nStar\nSpain\n123 456 7890\n'
         '1\nH Eight\nStar\nSpain\n123-45-6789\n1234567890\n'
         '2\n4\n',
         (P0054_MENU + P0054_ADD + 'Successful\n') * 7
         + P0054_MENU + P0054_ADD + P0054_PHONE_LIST + 'Enter Phone: Successful\n'
         + P0054_MENU + P0054_BANNER + P0054_HEADER + '\n'
         + '\n'.join(_row54(i + 1, name, name.split(' ')[0], name.split(' ')[1],
                            'Star', 'Spain', phone)
                     for i, (name, phone) in enumerate([
                         ('A One', '1234567890'),
                         ('B Two', '123-456-7890'),
                         ('C Three', '123-456-7890 x1234'),
                         ('D Four', '123-456-7890 ext1234'),
                         ('E Five', '(123)-456-7890'),
                         ('F Six', '123.456.7890'),
                         ('G Seven', '123 456 7890'),
                         ('H Eight', '1234567890')])) + '\n'
         + P0054_MENU),
        # Run 2 — a one-word name, a delete of an ID that does not exist, and
        # the ID rule after deleting the LAST contact.
        ('1\nCher\nSinger\nUSA\n123 456 7890\n'
         '1\nPele\nStar\nBrazil\n123.456.7890\n'
         '2\n3\n5\n3\n2\n'
         '1\nMadonna\nSinger\nUSA\n(123)-456-7890\n'
         '2\n4\n',
         (P0054_MENU + P0054_ADD + 'Successful\n') * 2
         + P0054_MENU + P0054_BANNER + P0054_HEADER + '\n'
         + _row54(1, 'Cher', 'Cher', '', 'Singer', 'USA', '123 456 7890') + '\n'
         + _row54(2, 'Pele', 'Pele', '', 'Star', 'Brazil', '123.456.7890') + '\n'
         + P0054_MENU + '------- Delete a Contact -------\nEnter ID: No found contact\n'
         + P0054_MENU + '------- Delete a Contact -------\nEnter ID: Successful\n'
         + P0054_MENU + P0054_ADD + 'Successful\n'
         + P0054_MENU + P0054_BANNER + P0054_HEADER + '\n'
         + _row54(1, 'Cher', 'Cher', '', 'Singer', 'USA', '123 456 7890') + '\n'
         # Pele was ID 2 and was deleted; Madonna is the new ID 2. That is the
         # brief's "last ID + 1" rule reusing an ID, shown rather than argued.
         + _row54(2, 'Madonna', 'Madonna', '', 'Singer', 'USA', '(123)-456-7890') + '\n'
         + P0054_MENU),
    ],
    explain_en='''<p><strong>The Guidelines decide the shape, even where they are odd.</strong> The sheet
names three methods and their signatures: <code>addContact(List&lt;Contact&gt;, Contact)</code>,
<code>displayAll(List&lt;Contact&gt;)</code>, <code>deleteContact(List&lt;Contact&gt;, Contact)</code>.
All three take the list as a <em>parameter</em>, so <code>ContactManager</code> is stateless and the list
lives in <code>Main</code>. That is not how a <code>bo</code> is normally built — it usually owns its
collection — but the signature is what a marker checks, and keeping a private list in here as well would
give the program two places that each think they hold the contacts. Same story with
<code>displayAll</code>: a <code>bo</code> should not print, but a method called "display" that returns
<code>void</code> can mean nothing else. Both departures are the brief's; name them out loud rather than
pretending the layering came out clean.</p>
<p><strong>Four files, no controller.</strong> <code>entity</code> + <code>bo</code> +
<code>utils</code> + <code>ui</code>. A controller layer here would have exactly one job — pass the list
from <code>Main</code> to <code>ContactManager</code> — and <code>Main</code> already does that in one
line. Add a layer where the program needs one.</p>
<p><strong>Name splitting belongs in the entity, and it must be <code>final</code>.</strong>
<code>setFullName</code> stores the name and derives <code>firstName</code>/<code>lastName</code> from it
in the same breath, so the three can never disagree. It is declared <code>final</code> because the
constructor calls it: an overridable method called from a constructor runs <em>before</em> a subclass's
own fields exist, and that is one of the nastiest bugs in Java. <code>final</code> makes the compiler
guarantee it stays safe.</p>
<p><strong>The one-word name — a decision the brief does not make for you.</strong> The rule is "first
name and last name are taken from the name by the first space". A marker types <code>Cher</code> and
there is no first space. Rejecting the name would invent a validation rule the sheet never states;
putting the single word into the last name would print a person with no first name. Everything before
the first space is the first name — and with no space, that is the whole string — so <code>Cher</code>
becomes the first name and the last name is empty. The full name is stored intact either way, so nothing
is lost.</p>
<p><strong>The ID rule, taken literally.</strong> The brief says the first contact has ID 1 and a new one
gets "last ID contact + 1". So <code>nextId</code> asks the <em>last element</em> of the list, not the
largest ID in it. The two only differ after a deletion: delete the contact at the end and the next one
reuses its ID. <code>max + 1</code> would never reuse an ID and is the safer rule in real software — but
it is a different rule from the one on the sheet, so this solution follows the sheet and tells you what
it costs. Run 2 shows the reuse happening. Note also that <code>addContact</code> stamps the ID itself
rather than trusting the screen to ask for it first; a rule that can be bypassed is not a rule.</p>
<p><strong>One regex, seven formats, and no cleverness.</strong> The pattern is a plain alternation with
one branch per accepted format. The shorter trick — <code>\\d{3}([-. ])\\d{3}\\1\\d{4}</code> with a
back-reference — is tempting, but it also accepts <code>123.456.7890 x1234</code>, which is not one of
the seven. A validator that quietly accepts more than it was told to is a bug you find when somebody
else's data arrives. <code>matches()</code> anchors the whole string, which is what makes a top-level
alternation safe; <code>find()</code> would happily match a phone number buried in a sentence. The
<code>Pattern</code> is compiled once into a <code>static final</code> field instead of on every
keystroke.</p>
<p><strong>Print the format list from a constant, with <code>\\u2022</code> for the bullet.</strong> The
rejection message re-prints all seven formats, copied from the brief word for word. The bullet is
written as the escape <code>\\u2022</code> rather than pasted in: a source file carrying a non-ASCII
character only prints correctly when compiler and console agree on the encoding, and a project handed in
on someone else's machine is exactly where they stop agreeing.</p>
<p><strong>printf columns, not tabs — and the brief proves why.</strong> Look closely at the expected
screen: on the first row, <code>Iker Casillas</code> is 13 characters, so it overruns its tab stop and
the First Name column jumps left on that row alone. That is not a typo in the sheet, it is what
<code>\\t</code> does. Fixed widths (<code>%-4s%-18s%-12s…</code>) line up whatever the names are, and a
name too long for its column pushes the row out visibly instead of quietly destroying the alignment.</p>
<p><strong>Delete takes a Contact, but the user types an ID.</strong> That gap is the brief's, and it
decides the flow: the screen reads the ID, looks the contact up, and it is that <em>lookup</em> that
produces "No found contact" — the delete itself only ever sees a contact that exists.
<code>deleteContact</code> then matches on the ID rather than calling <code>list.remove(Object)</code>,
because <code>remove</code> uses <code>equals()</code> and <code>Contact</code> does not override it, so
it would only match the very same object.</p>
<p><strong>How this was verified.</strong> Three runs. Run 0 replays the brief's own screen — bad phone
<code>09</code> rejected with the full format list, then accepted, displayed, a non-numeric ID answered
with "ID is digit", a real delete, and an empty list. Run 1 adds seven contacts, one per accepted phone
format, then types a value that must be refused before it will accept an eighth — so every branch of the
regex is exercised by a real program and not by reading it. Run 2 types a one-word name, deletes an ID that does not exist, and shows
the ID being reused after the tail contact is removed.</p>''',
    explain_vi='''<p><strong>Phần Hướng dẫn quyết định hình dạng chương trình, kể cả ở chỗ nó kỳ
lạ.</strong> Đề nêu tên ba phương thức kèm chữ ký: <code>addContact(List&lt;Contact&gt;, Contact)</code>,
<code>displayAll(List&lt;Contact&gt;)</code>, <code>deleteContact(List&lt;Contact&gt;, Contact)</code>.
Cả ba đều nhận danh sách như một <em>tham số</em>, nên <code>ContactManager</code> không giữ trạng thái và
danh sách nằm ở <code>Main</code>. Đó không phải cách người ta thường viết một lớp <code>bo</code> — bình
thường nó tự giữ tập dữ liệu — nhưng chữ ký mới là thứ người chấm soi, và nếu giữ thêm một danh sách
private ở đây thì chương trình có hai chỗ cùng tưởng mình đang giữ danh bạ. <code>displayAll</code> cũng
vậy: <code>bo</code> lẽ ra không in ra màn hình, nhưng một phương thức tên "display" trả về
<code>void</code> thì chẳng thể mang nghĩa nào khác. Cả hai chỗ lệch chuẩn đều là của đề — hãy nói thẳng
ra, đừng giả vờ rằng phân tầng ở đây sạch sẽ.</p>
<p><strong>Bốn tệp, không có controller.</strong> <code>entity</code> + <code>bo</code> +
<code>utils</code> + <code>ui</code>. Thêm tầng controller ở đây thì nó chỉ có đúng một việc — chuyển danh
sách từ <code>Main</code> sang <code>ContactManager</code> — mà <code>Main</code> đã làm việc đó bằng một
dòng. Chỉ thêm tầng khi chương trình cần.</p>
<p><strong>Việc tách tên thuộc về lớp entity, và phải là <code>final</code>.</strong>
<code>setFullName</code> vừa lưu tên vừa suy ra <code>firstName</code>/<code>lastName</code> trong cùng một
nhịp, nên ba giá trị không bao giờ mâu thuẫn. Nó được khai báo <code>final</code> vì constructor gọi nó:
một phương thức có thể ghi đè mà bị gọi trong constructor sẽ chạy <em>trước</em> khi các trường của lớp
con tồn tại — một trong những lỗi khó chịu nhất của Java. <code>final</code> bắt trình biên dịch bảo đảm
điều đó không xảy ra.</p>
<p><strong>Tên chỉ có một từ — quyết định mà đề không làm thay bạn.</strong> Luật là "họ và tên được tách
từ tên theo dấu cách đầu tiên". Người chấm gõ <code>Cher</code> và không có dấu cách nào. Từ chối cái tên
đó là tự bịa ra một luật kiểm tra mà đề không hề nói; đưa từ duy nhất vào phần họ thì in ra một người
không có tên. Mọi thứ trước dấu cách đầu tiên là tên — mà khi không có dấu cách thì đó là cả chuỗi — nên
<code>Cher</code> thành tên và họ để rỗng. Dù thế nào thì tên đầy đủ vẫn được lưu nguyên vẹn, không mất
gì.</p>
<p><strong>Luật sinh ID, hiểu đúng theo mặt chữ.</strong> Đề nói liên hệ đầu tiên có ID 1 và liên hệ mới
lấy "ID của liên hệ cuối + 1". Vậy nên <code>nextId</code> hỏi <em>phần tử cuối</em> của danh sách, chứ
không hỏi ID lớn nhất. Hai cách chỉ khác nhau sau khi xoá: xoá liên hệ ở cuối thì liên hệ tiếp theo dùng
lại đúng ID đó. <code>max + 1</code> sẽ không bao giờ trùng và là luật an toàn hơn trong phần mềm thật —
nhưng nó là một luật khác với luật trên đề, nên lời giải này theo đề và nói rõ cái giá phải trả. Lần chạy
thứ ba cho thấy ID bị dùng lại. Lưu ý thêm: <code>addContact</code> tự đóng dấu ID chứ không tin rằng màn
hình sẽ nhớ hỏi trước; một luật có thể bị bỏ qua thì không còn là luật.</p>
<p><strong>Một biểu thức chính quy, bảy định dạng, và không màu mè.</strong> Mẫu là một phép "hoặc" phẳng,
mỗi nhánh một định dạng được chấp nhận. Cách viết ngắn hơn —
<code>\\d{3}([-. ])\\d{3}\\1\\d{4}</code> với tham chiếu ngược — rất hấp dẫn, nhưng nó cũng nhận
<code>123.456.7890 x1234</code>, thứ không nằm trong bảy định dạng. Bộ kiểm tra lặng lẽ nhận nhiều hơn
mức được giao là một lỗi mà bạn chỉ phát hiện khi dữ liệu của người khác chạy vào. <code>matches()</code>
neo cả chuỗi, chính điều đó làm phép "hoặc" ở mức ngoài cùng an toàn; <code>find()</code> thì vui vẻ khớp
một số điện thoại nằm lọt trong câu văn. <code>Pattern</code> được biên dịch một lần vào trường
<code>static final</code>, không biên dịch lại ở mỗi lần gõ.</p>
<p><strong>In danh sách định dạng từ một hằng số, dấu đầu dòng viết bằng <code>\\u2022</code>.</strong>
Thông báo từ chối in lại đủ bảy định dạng, chép từ đề đúng từng chữ. Dấu đầu dòng được viết dưới dạng
escape <code>\\u2022</code> thay vì dán trực tiếp: tệp nguồn chứa ký tự ngoài ASCII chỉ in đúng khi trình
biên dịch và cửa sổ console thống nhất bảng mã, mà project nộp trên máy người khác đúng là chỗ chúng hết
thống nhất.</p>
<p><strong>Cột bằng printf, không dùng tab — và chính đề chứng minh vì sao.</strong> Nhìn kỹ màn hình mong
đợi: ở dòng đầu, <code>Iker Casillas</code> dài 13 ký tự nên tràn qua điểm dừng tab, khiến cột First Name
của riêng dòng đó nhảy sang trái. Đó không phải lỗi đánh máy của đề, đó là bản chất của <code>\\t</code>.
Độ rộng cố định (<code>%-4s%-18s%-12s…</code>) giữ thẳng hàng bất kể tên dài ngắn ra sao, và một cái tên
dài quá cột sẽ đẩy dòng ra cho bạn thấy chứ không âm thầm phá vỡ bố cục.</p>
<p><strong>Hàm xoá nhận một Contact, còn người dùng gõ ID.</strong> Khoảng cách đó là của đề, và nó quyết
định luồng chạy: màn hình đọc ID, tra ra liên hệ, và chính <em>bước tra</em> đó sinh ra thông báo "No
found contact" — bản thân hàm xoá chỉ nhìn thấy liên hệ đã tồn tại. <code>deleteContact</code> so khớp
theo ID chứ không gọi <code>list.remove(Object)</code>, bởi <code>remove</code> dùng
<code>equals()</code> mà <code>Contact</code> không ghi đè, nên nó chỉ khớp đúng cùng một đối tượng.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy. Lần đầu diễn lại đúng màn hình của đề — số điện
thoại <code>09</code> bị từ chối kèm đủ danh sách định dạng, rồi nhập đúng, hiển thị, gõ ID không phải số
và nhận "ID is digit", xoá thật, rồi danh sách rỗng. Lần hai thêm bảy liên hệ, mỗi liên hệ một định dạng
điện thoại được chấp nhận, rồi gõ một giá trị bắt buộc phải bị từ chối trước khi liên hệ thứ tám được
nhận — nhờ vậy mọi nhánh của biểu thức chính quy đều được một chương trình thật chạy qua chứ không phải
chỉ được đọc bằng mắt. Lần ba gõ tên một
từ, xoá một ID không tồn tại, và cho thấy ID bị dùng lại sau khi liên hệ cuối bị xoá.</p>''',
    hints_en=[
        'Keep the three Guidelines signatures exactly — the list is a parameter, not a field.',
        'Split the name inside the entity, in the setter, so name and its halves cannot disagree.',
        'Decide what a one-word name does BEFORE you code it; the brief does not say, but a marker will type one.',
        'Write one regex with a branch per accepted format and test all seven by running it.',
        'Use printf with fixed widths for the table; a \\t column breaks as soon as a name is long.',
    ],
    hints_vi=[
        'Giữ đúng ba chữ ký trong phần Hướng dẫn — danh sách là tham số, không phải trường của lớp.',
        'Tách tên ngay trong lớp entity, ở hàm setter, để tên và hai nửa của nó không thể mâu thuẫn.',
        'Quyết định trước xem tên một từ thì xử lý ra sao; đề không nói, nhưng người chấm chắc chắn sẽ gõ.',
        'Viết một biểu thức chính quy, mỗi nhánh một định dạng, rồi CHẠY thử đủ cả bảy.',
        'Dùng printf với độ rộng cố định cho bảng; cột bằng \\t vỡ ngay khi gặp một cái tên dài.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0052 — Manage the geographic / East Asia countries (69 LOC)
# ════════════════════════════════════════════════════════════════

P0052_COUNTRY = '''package entity;

import java.io.Serializable;

/**
 * A country: code, name, area. The base class the brief asks for.
 *
 * The three fields are protected because the brief says so and because a
 * subclass is coming - but the program still goes through the getters, so
 * tightening them to private later would break nothing outside this file.
 */
public class Country implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Column width for the whole report, in ONE place.
     *
     * The brief's screen is a fixed-width table (ID, Name, Total Area, Terrain
     * every 16 characters). Putting the width here means the header, the parent
     * row and the subclass row can never drift apart - change 16 and the whole
     * report moves together.
     */
    protected static final String CELL = "%-16s";

    protected String countryCode;
    protected String countryName;
    protected float totalArea;

    public Country() {
    }

    public Country(String countryCode, String countryName, float totalArea) {
        this.countryCode = countryCode;
        this.countryName = countryName;
        this.totalArea = totalArea;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public float getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(float totalArea) {
        this.totalArea = totalArea;
    }

    /**
     * The three columns this class owns, as text - not printed.
     *
     * Splitting "build the row" from "print the row" is what lets the subclass
     * EXTEND the parent's formatting instead of copying it. An override that
     * re-types the three %-16s is an override that will one day disagree with
     * its parent about how wide a column is.
     */
    protected String row() {
        return String.format(CELL + CELL + CELL, countryCode, countryName, totalArea);
    }

    public void display() {
        System.out.println(row());
    }
}
'''

P0052_EAST = '''package entity;

/**
 * A country in the East Asia report: everything a Country has, plus terrain.
 *
 * The header lives here rather than in Country because the Terrain column is
 * this class's, and a header that promises a column the base class cannot fill
 * would be a lie for anyone reusing Country on its own.
 */
public class EastAsiaCountries extends Country {

    public static final String HEADER =
            String.format(CELL + CELL + CELL + "%s", "ID", "Name", "Total Area", "Terrain");

    private String countryTerrain;

    public EastAsiaCountries() {
        super();
    }

    public EastAsiaCountries(String countryCode, String countryName, float totalArea,
            String countryTerrain) {
        super(countryCode, countryName, totalArea);
        this.countryTerrain = countryTerrain;
    }

    public String getCountryTerrain() {
        return countryTerrain;
    }

    public void setCountryTerrain(String countryTerrain) {
        this.countryTerrain = countryTerrain;
    }

    /** The parent's three columns, then the one this class adds. */
    @Override
    public void display() {
        System.out.println(row() + countryTerrain);
    }
}
'''

P0052_BO = '''package bo;

import entity.EastAsiaCountries;
import java.util.Arrays;
import java.util.Comparator;

/**
 * The countries and the rules about them. Nothing here prints.
 *
 * The store is an ARRAY, not an ArrayList, and that is the Guidelines' choice
 * rather than nostalgia: searchInformationByName and
 * sortInformationByAscendingOrder both return EastAsiaCountries[]. A fixed
 * array of 11 also turns "11 countries" from a rule someone has to remember
 * into a property of the container itself.
 */
public class ManageEastAsiaCountries {

    public static final int CAPACITY = 11;
    public static final String FULL_MESSAGE = "The list already has " + CAPACITY + " countries.";
    public static final String EMPTY_MESSAGE = "There is no country in the list.";

    private final EastAsiaCountries[] countries = new EastAsiaCountries[CAPACITY];
    private int count = 0;

    public boolean isFull() {
        return count == CAPACITY;
    }

    public int size() {
        return count;
    }

    /**
     * The area check lives here as well as in the Validator on purpose.
     *
     * The Validator stops a bad number being typed; this stops a bad number
     * being stored by any other caller. The screen can be rewritten tomorrow;
     * the rule stays true.
     */
    public void addCountryInformation(EastAsiaCountries country) throws Exception {
        if (country == null) {
            throw new Exception("There is no country to add.");
        }
        if (isFull()) {
            throw new Exception(FULL_MESSAGE);
        }
        if (country.getTotalArea() <= 0) {
            throw new Exception("Total area must be greater than 0.");
        }
        countries[count] = country;
        count++;
    }

    /** The last one stored - see the walkthrough, the brief argues with itself here. */
    public EastAsiaCountries getRecentlyEnteredInformation() throws Exception {
        if (count == 0) {
            throw new Exception(EMPTY_MESSAGE);
        }
        return countries[count - 1];
    }

    /**
     * Case-insensitive, and a substring rather than an exact match.
     *
     * A marker types "viet" or "Viet nam" as often as "Viet Nam", and an exact
     * equals() would report a country that is plainly on the screen as missing.
     * The array is built at full size and then trimmed with copyOf, so the
     * caller never has to wonder whether the trailing slots are real results.
     */
    public EastAsiaCountries[] searchInformationByName(String name) throws Exception {
        if (name == null || name.trim().isEmpty()) {
            throw new Exception("The name to search for must not be blank.");
        }
        String needle = name.trim().toLowerCase();
        EastAsiaCountries[] found = new EastAsiaCountries[count];
        int total = 0;
        for (int i = 0; i < count; i++) {
            if (countries[i].getCountryName().toLowerCase().contains(needle)) {
                found[total] = countries[i];
                total++;
            }
        }
        if (total == 0) {
            throw new Exception("No country found with the name [" + name.trim() + "].");
        }
        return Arrays.copyOf(found, total);
    }

    /**
     * Sorts a COPY, never the store.
     *
     * getRecentlyEnteredInformation means "the last element", so sorting the
     * real array in place would silently change what "recently entered" points
     * at. Two features would then be fighting over one array's order.
     */
    public EastAsiaCountries[] sortInformationByAscendingOrder() throws Exception {
        if (count == 0) {
            throw new Exception(EMPTY_MESSAGE);
        }
        EastAsiaCountries[] sorted = Arrays.copyOf(countries, count);
        Arrays.sort(sorted, Comparator.comparing(EastAsiaCountries::getCountryName,
                String.CASE_INSENSITIVE_ORDER));
        return sorted;
    }
}
'''

P0052_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read and every check, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    public static int getInt(String message, String error, int min, int max) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
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

    /**
     * The prompts in this brief sit on their own line - the screen shows the
     * value typed underneath - so these use println, not print.
     */
    public static String getNonBlank(String message) {
        while (true) {
            System.out.println(message);
            String line = SCANNER.nextLine().trim();
            if (!line.isEmpty()) {
                return line;
            }
            System.out.println("This field must not be blank.");
        }
    }

    /**
     * Float, not double: the brief's totalArea is a float, and reading a double
     * only to narrow it would round the value once for no reason.
     */
    public static float getPositiveFloat(String message, String error) {
        while (true) {
            System.out.println(message);
            String line = SCANNER.nextLine().trim();
            try {
                float value = Float.parseFloat(line);
                if (value <= 0) {
                    System.out.println(error);
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

P0052_MAIN = '''package ui;

import bo.ManageEastAsiaCountries;
import entity.EastAsiaCountries;
import utils.Validator;

/** The menu and the screen, nothing else. */
public class Main {

    private static final String AREA_ERROR = "Total area must be greater than 0.";
    private static final String MENU_ERROR = "Please choose an option from 1 to 5.";

    public static void main(String[] args) {
        ManageEastAsiaCountries manager = new ManageEastAsiaCountries();

        boolean running = true;
        while (running) {
            System.out.println("                               MENU");
            System.out.println("==========================================================================");
            System.out.println("1. Input the information of 11 countries in East Asia");
            System.out.println("2. Display the information of country you've just input");
            System.out.println("3. Search the information of country by user-entered name");
            System.out.println("4. Display the information of countries sorted name in ascending order");
            System.out.println("5. Exit");
            System.out.println("==========================================================================");

            switch (Validator.getInt("Enter your choice : ", MENU_ERROR, 1, 5)) {
                case 1:
                    input(manager);
                    break;
                case 2:
                    displayRecent(manager);
                    break;
                case 3:
                    search(manager);
                    break;
                case 4:
                    sort(manager);
                    break;
                default:
                    running = false;
            }
        }
    }

    /**
     * Asks the manager whether there is room BEFORE prompting.
     *
     * Collecting four answers and then throwing them away because the list was
     * already full is rude. The message is the manager's constant, so the guard
     * and the exception can never say two different things.
     */
    private static void input(ManageEastAsiaCountries manager) {
        if (manager.isFull()) {
            System.out.println(ManageEastAsiaCountries.FULL_MESSAGE);
            return;
        }
        String code = Validator.getNonBlank("Enter code of country:");
        String name = Validator.getNonBlank("Enter name of country:");
        float area = Validator.getPositiveFloat("Enter total Area:", AREA_ERROR);
        String terrain = Validator.getNonBlank("Enter terrain of country:");
        try {
            manager.addCountryInformation(new EastAsiaCountries(code, name, area, terrain));
            System.out.println("Successful");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    /**
     * The result is fetched BEFORE the header is printed, so a failure does not
     * leave a table heading standing over nothing.
     */
    private static void displayRecent(ManageEastAsiaCountries manager) {
        try {
            EastAsiaCountries country = manager.getRecentlyEnteredInformation();
            System.out.println(EastAsiaCountries.HEADER);
            country.display();
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void search(ManageEastAsiaCountries manager) {
        String name = Validator.getNonBlank("Enter the name you want to search for:");
        try {
            show(manager.searchInformationByName(name));
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void sort(ManageEastAsiaCountries manager) {
        try {
            show(manager.sortInformationByAscendingOrder());
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    private static void show(EastAsiaCountries[] list) {
        System.out.println(EastAsiaCountries.HEADER);
        for (EastAsiaCountries country : list) {
            country.display();
        }
    }
}
'''


def _p0052_full(out):
    """The 11-country cap, and a sort of 11 rows - checked by relationships.

    Diffing this run line by line would mean pasting the menu thirteen times,
    which hides the two facts that actually matter. So the run is checked for
    exactly the things it exists to prove: the twelfth attempt is refused, it is
    refused WITHOUT asking four questions first, and the final listing is all
    eleven countries in ascending order of name.
    """
    if out.count('The list already has 11 countries.') != 1:
        return False, 'the twelfth country was not refused exactly once'
    asked = out.count('Enter code of country:')
    if asked != 11:
        return False, f'expected 11 country prompts, got {asked} (the refusal must come first)'
    tail = out.rsplit('ID              Name', 1)[-1]
    names = re.findall(r'^K\d\d\s+(N\d\d)', tail, re.M)
    want = [f'N{i:02d}' for i in range(1, 12)]
    if names != want:
        return False, f'sorted names were {names}, expected {want}'
    return True, ''


_P0052_FILL = ''.join(f'1\nK{i:02d}\nN{12 - i:02d}\n{i * 1000}\nT{i:02d}\n' for i in range(1, 12))

# The menu, ending in a print() prompt - so whatever comes next shares its line.
P0052_MENU = ('                               MENU\n'
              '==========================================================================\n'
              '1. Input the information of 11 countries in East Asia\n'
              "2. Display the information of country you've just input\n"
              '3. Search the information of country by user-entered name\n'
              '4. Display the information of countries sorted name in ascending order\n'
              '5. Exit\n'
              '==========================================================================\n'
              'Enter your choice : ')

P0052_ASK = ('Enter code of country:\nEnter name of country:\nEnter total Area:\n'
             'Enter terrain of country:\nSuccessful\n')


def _row52(code, name, area, terrain):
    """The same four columns as the Java report, at the same widths."""
    return f'{code:<16}{name:<16}{str(area):<16}{terrain}'


P0052_HEADER = _row52('ID', 'Name', 'Total Area', 'Terrain') + '\n'
P0052_VN = _row52('VN', 'Viet Nam', '331698.0', 'Nice') + '\n'
P0052_IDN = _row52('IDN', 'Indonesia', '1860360.0', 'Nice') + '\n'
P0052_LA = _row52('LA', 'Laos', '236800.0', 'Nice') + '\n'


solution(
    'J1.S.P0052',
    title_vi='Quản lý thông tin các quốc gia Đông Á',
    files=[('src/entity/Country.java', P0052_COUNTRY),
           ('src/entity/EastAsiaCountries.java', P0052_EAST),
           ('src/bo/ManageEastAsiaCountries.java', P0052_BO),
           ('src/utils/Validator.java', P0052_VALIDATOR),
           ('src/ui/Main.java', P0052_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 0 — the brief's own data. An empty list first, then a rejected
        # area (twice: not a number, then not positive), then the four options.
        ('2\n'
         '1\nVN\nViet Nam\nabc\n-5\n331698\nNice\n'
         '2\n'
         '1\nIDN\nIndonesia\n1860360\nNice\n'
         '1\nLA\nLaos\n236800\nNice\n'
         '3\nViet Nam\n'
         '3\nnam\n'
         '3\nJapan\n'
         '4\n'
         '2\n'
         '5\n',
         P0052_MENU + 'There is no country in the list.\n'
         + P0052_MENU + 'Enter code of country:\nEnter name of country:\n'
         'Enter total Area:\nYou must input a number.\n'
         'Enter total Area:\nTotal area must be greater than 0.\n'
         'Enter total Area:\nEnter terrain of country:\nSuccessful\n'
         + P0052_MENU + P0052_HEADER + P0052_VN
         + P0052_MENU + P0052_ASK
         + P0052_MENU + P0052_ASK
         + P0052_MENU + 'Enter the name you want to search for:\n' + P0052_HEADER + P0052_VN
         # A partial, case-insensitive search: "nam" still finds Viet Nam.
         + P0052_MENU + 'Enter the name you want to search for:\n' + P0052_HEADER + P0052_VN
         + P0052_MENU + 'Enter the name you want to search for:\n'
         'No country found with the name [Japan].\n'
         + P0052_MENU + P0052_HEADER + P0052_IDN + P0052_LA + P0052_VN
         # Laos was entered LAST but sorts in the MIDDLE. So this line is the
         # proof that sorting a copy left the store's own order alone - after an
         # in-place sort it would say Viet Nam.
         + P0052_MENU + P0052_HEADER + P0052_LA
         + P0052_MENU),
        # Run 1 — the 11-country cap and a real sort, checked by a predicate.
        (_P0052_FILL + '1\n4\n5\n', _p0052_full),
    ],
    explain_en='''<p><strong>Read the Guidelines before the title.</strong> "Manage the geographic" sounds
like a map program; it is an inheritance exercise. A base <code>Country</code> with three protected
fields, a subclass <code>EastAsiaCountries</code> that adds terrain and calls <code>super(...)</code>,
and a manager with four named methods. The four signatures decide almost everything else:
<code>searchInformationByName</code> and <code>sortInformationByAscendingOrder</code> both return
<code>EastAsiaCountries[]</code>, so the store is an <em>array</em>, not an <code>ArrayList</code> — and
an array of 11 turns "11 countries" from a rule someone has to remember into a property of the container
itself.</p>
<p><strong>Where the brief argues with itself — three places.</strong> First, the Program Specifications
say "11 countries in Southeast Asia" while the menu, the class name and every other line say East Asia;
the menu wording is what gets printed, so that is what this solution prints. Second, Function details
lists "Option 4: Exit program" but the expected screen's menu has five items with 4 = sort and 5 = exit —
and the Guidelines require <code>sortInformationByAscendingOrder</code>, so the five-item menu wins.
Third, and most awkward: <code>getRecentlyEnteredInformation()</code> is declared to return a
<em>single</em> <code>EastAsiaCountries</code>, but the screen under option 2 shows two country rows. The
Guidelines are the contract, so option 2 prints the one most recently entered. Notice the disagreement
out loud — a marker counts that in your favour.</p>
<p><strong>Five files: entity ×2, bo, utils, ui.</strong> No controller: <code>Main</code> reads through
the Validator and calls the manager directly, and a controller in between would forward four calls and
add nothing. The brief describes <code>ManageEastAsiaCountries</code> as if it also owned the menu; it
does not here, because a class that holds the data, enforces the rules AND draws the screen is the one
class you cannot test without a keyboard.</p>
<p><strong>The override extends the parent's formatting instead of copying it.</strong>
<code>Country.row()</code> builds the three columns it owns and returns them as text;
<code>display()</code> prints that. <code>EastAsiaCountries.display()</code> prints
<code>row() + countryTerrain</code>. So the column width is written once, in <code>Country.CELL</code>,
and the child cannot drift out of step with the parent about how wide a column is. An override that
re-types the three <code>%-16s</code> is an override that will one day disagree with its own base
class.</p>
<p><strong>Fixed widths again, and this brief needs them more.</strong> The report is four columns of
16 characters. <code>Indonesia</code> and <code>Viet Nam</code> differ in length by one character; with
tabs they would land in different columns, with <code>%-16s</code> they cannot. The header is a
<code>public static final</code> built from the same width constant, so it is impossible for the heading
and the rows to be laid out differently.</p>
<p><strong>The area check exists twice, deliberately.</strong> The Validator loops until a positive
number is typed — that is what makes the screen behave. <code>addCountryInformation</code> checks again
and throws — that is what makes the <em>rule</em> true no matter who calls it. One is user interface,
the other is a guarantee; deleting either one deletes something different.</p>
<p><strong>Sorting returns a copy.</strong> <code>getRecentlyEnteredInformation()</code> means "the last
element", so sorting the real array in place would silently change what "recently entered" points at —
two features quietly fighting over one array's order. <code>Arrays.copyOf</code> costs eleven references
and removes the whole class of bug. The comparator uses
<code>String.CASE_INSENSITIVE_ORDER</code> so "viet nam" does not sort after "Zimbabwe" purely because a
lowercase letter has a higher code point than an uppercase one.</p>
<p><strong>Search is a case-insensitive substring, not <code>equals</code>.</strong> A marker types
"viet" at least as often as "Viet Nam", and an exact match would report a country plainly visible on the
screen as missing. The result array is built at full size and trimmed with <code>copyOf</code>, so the
caller never has to wonder whether the trailing slots hold real results.</p>
<p><strong>Ask before you prompt.</strong> Option 1 checks <code>isFull()</code> before asking for
anything: collecting four answers and then throwing them away because the list was already full is rude.
The message comes from the manager's own constant, so the guard and the exception can never say two
different things.</p>
<p><strong>How this was verified.</strong> Two runs. Run 0 uses the brief's own data — Viet Nam and
Indonesia, plus Laos — and walks every option: display when the list is still empty, an area typed as
<code>abc</code> and then as <code>-5</code>, an exact search, a partial search ("nam"), a search that
finds nothing, and the ascending sort. Laos is entered <em>last</em> but sorts in the <em>middle</em>,
which is the point: option 2 is asked again after the sort and still answers Laos. Had the sort worked
on the real array instead of a copy, it would have answered Viet Nam. Two countries could not have shown
that — you need one whose position in the sorted order is not its position in the store. Run 1 fills all eleven slots with names deliberately entered in descending
order, is refused a twelfth country, and then sorts: it is checked by a predicate that the refusal
happened exactly once, that it happened <em>without</em> asking four questions first, and that the final
listing is N01…N11 in order. Pasting thirteen copies of the menu into an expected transcript would have
hidden all three of those facts.</p>''',
    explain_vi='''<p><strong>Đọc phần Hướng dẫn trước khi tin vào cái tên đề.</strong> "Quản lý địa lý"
nghe như một chương trình bản đồ; thực ra đây là bài luyện kế thừa. Một lớp cha <code>Country</code> với
ba trường protected, một lớp con <code>EastAsiaCountries</code> thêm địa hình và gọi
<code>super(...)</code>, cùng một lớp quản lý với bốn phương thức được nêu tên. Bốn chữ ký đó quyết định
gần như mọi thứ còn lại: <code>searchInformationByName</code> và
<code>sortInformationByAscendingOrder</code> đều trả về <code>EastAsiaCountries[]</code>, nên kho dữ liệu
là một <em>mảng</em> chứ không phải <code>ArrayList</code> — và mảng 11 phần tử biến "11 quốc gia" từ một
luật phải nhớ thành một tính chất của chính vật chứa.</p>
<p><strong>Chỗ đề tự mâu thuẫn — ba chỗ.</strong> Thứ nhất, phần Đặc tả nói "11 quốc gia Đông Nam Á" trong
khi thực đơn, tên lớp và mọi dòng khác đều nói Đông Á; thứ được in ra màn hình là chữ trong thực đơn, nên
lời giải in theo đó. Thứ hai, phần Chi tiết chức năng ghi "Option 4: Thoát chương trình" nhưng thực đơn ở
màn hình mong đợi có năm mục với 4 = sắp xếp và 5 = thoát — mà phần Hướng dẫn lại bắt cài đặt
<code>sortInformationByAscendingOrder</code>, nên thực đơn năm mục thắng. Thứ ba, và khó xử nhất:
<code>getRecentlyEnteredInformation()</code> khai báo trả về <em>một</em> <code>EastAsiaCountries</code>,
nhưng màn hình của mục 2 lại hiện hai dòng quốc gia. Phần Hướng dẫn là bản hợp đồng, nên mục 2 in ra đúng
quốc gia vừa nhập gần nhất. Hãy nói thẳng chỗ mâu thuẫn này ra — người chấm tính điểm cho việc bạn nhìn
thấy nó.</p>
<p><strong>Năm tệp: entity ×2, bo, utils, ui.</strong> Không có controller: <code>Main</code> đọc dữ liệu
qua Validator rồi gọi thẳng lớp quản lý, thêm một controller ở giữa thì nó chỉ chuyển tiếp bốn lời gọi mà
chẳng thêm gì. Đề mô tả <code>ManageEastAsiaCountries</code> như thể lớp này cũng giữ luôn thực đơn; ở đây
thì không, vì một lớp vừa giữ dữ liệu, vừa gác luật, vừa vẽ màn hình chính là lớp bạn không thể kiểm thử
nếu không có bàn phím.</p>
<p><strong>Hàm ghi đè mở rộng cách trình bày của lớp cha thay vì chép lại.</strong>
<code>Country.row()</code> dựng ba cột thuộc về nó và trả về dưới dạng chuỗi; <code>display()</code> in
chuỗi đó. <code>EastAsiaCountries.display()</code> in <code>row() + countryTerrain</code>. Nhờ vậy độ rộng
cột chỉ được viết một lần, ở <code>Country.CELL</code>, và lớp con không thể lệch pha với lớp cha về chuyện
một cột rộng bao nhiêu. Một hàm ghi đè gõ lại ba cái <code>%-16s</code> là hàm ghi đè sẽ có ngày cãi nhau
với chính lớp cơ sở của nó.</p>
<p><strong>Lại là độ rộng cố định, và bài này cần nó hơn.</strong> Báo cáo gồm bốn cột rộng 16 ký tự.
<code>Indonesia</code> và <code>Viet Nam</code> lệch nhau đúng một ký tự; dùng tab thì chúng rơi vào hai
cột khác nhau, dùng <code>%-16s</code> thì không thể. Dòng tiêu đề là một hằng
<code>public static final</code> dựng từ đúng hằng độ rộng ấy, nên tiêu đề và các dòng dữ liệu không thể
được canh khác nhau.</p>
<p><strong>Phép kiểm diện tích tồn tại hai lần, một cách có chủ ý.</strong> Validator lặp cho tới khi
người dùng gõ một số dương — đó là thứ làm màn hình cư xử đúng. <code>addCountryInformation</code> kiểm
lại rồi ném ngoại lệ — đó là thứ khiến <em>luật</em> luôn đúng bất kể ai gọi. Một bên là giao diện, một bên
là bảo đảm; xoá bên nào cũng là xoá mất một thứ khác nhau.</p>
<p><strong>Sắp xếp trả về một bản sao.</strong> <code>getRecentlyEnteredInformation()</code> nghĩa là
"phần tử cuối", nên sắp xếp ngay trên mảng thật sẽ lặng lẽ đổi luôn ý nghĩa của "vừa nhập gần nhất" — hai
chức năng âm thầm giành nhau thứ tự của một mảng. <code>Arrays.copyOf</code> tốn mười một tham chiếu và
xoá sạch cả một họ lỗi. Bộ so sánh dùng <code>String.CASE_INSENSITIVE_ORDER</code> để "viet nam" không bị
xếp sau "Zimbabwe" chỉ vì chữ thường có mã lớn hơn chữ hoa.</p>
<p><strong>Tìm kiếm theo chuỗi con, không phân biệt hoa thường, không dùng <code>equals</code>.</strong>
Người chấm gõ "viet" ít nhất cũng thường xuyên như gõ "Viet Nam", mà so khớp tuyệt đối sẽ báo là không tìm
thấy một quốc gia đang hiện ngay trên màn hình. Mảng kết quả được tạo đủ cỡ rồi cắt bằng
<code>copyOf</code>, nên người gọi không bao giờ phải phân vân mấy ô cuối có phải kết quả thật hay
không.</p>
<p><strong>Hỏi trước khi bắt người ta gõ.</strong> Mục 1 kiểm <code>isFull()</code> trước khi hỏi bất cứ
điều gì: thu đủ bốn câu trả lời rồi vứt đi vì danh sách đã đầy là bất lịch sự. Thông báo lấy từ chính hằng
số của lớp quản lý, nên chốt chặn và ngoại lệ không thể nói hai điều khác nhau.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Hai lần chạy. Lần đầu dùng đúng dữ liệu của đề — Viet Nam và
Indonesia, cộng thêm Laos — và đi qua mọi mục: hiển thị khi danh sách còn rỗng, diện tích gõ là
<code>abc</code> rồi <code>-5</code>, tìm chính xác, tìm một phần ("nam"), tìm không ra, và sắp xếp tăng
dần. Laos được nhập <em>sau cùng</em> nhưng lại nằm <em>giữa</em> khi sắp xếp — đó mới là điểm mấu chốt:
mục 2 được hỏi lại sau khi sắp xếp và vẫn trả lời Laos. Nếu phép sắp xếp làm ngay trên mảng thật thay vì
trên bản sao, nó đã trả lời Viet Nam. Hai quốc gia thì không chứng minh được điều này — phải có một quốc
gia mà vị trí sau khi sắp xếp khác vị trí trong kho. Lần hai đổ đầy
cả mười một ô với các tên cố tình nhập theo thứ tự giảm dần, bị từ chối quốc gia thứ mười hai, rồi sắp xếp:
lần chạy này được kiểm bằng một vị từ rằng việc từ chối xảy ra đúng một lần, rằng nó xảy ra <em>trước</em>
khi hỏi bốn câu, và rằng danh sách cuối cùng là N01…N11 đúng thứ tự. Dán mười ba bản sao của thực đơn vào
một bản ghi mong đợi sẽ chôn vùi cả ba sự thật đó.</p>''',
    hints_en=[
        'The four Guidelines signatures return EastAsiaCountries[] — so store the countries in an array of 11.',
        'Let the subclass constructor call super(...) for the three inherited fields; do not re-assign them.',
        'Build the row as text in Country and print it in display(), so the override extends the format instead of copying it.',
        'Sort a copy (Arrays.copyOf), or "recently entered" stops meaning the last one you typed.',
        'Read the menu in the expected screen carefully: it has FIVE options, and the Function details section only lists four.',
    ],
    hints_vi=[
        'Bốn chữ ký trong phần Hướng dẫn đều trả về EastAsiaCountries[] — vậy hãy lưu bằng mảng 11 phần tử.',
        'Để constructor lớp con gọi super(...) cho ba trường kế thừa; đừng gán lại chúng bằng tay.',
        'Dựng dòng dữ liệu thành chuỗi ở lớp Country rồi in trong display(), để hàm ghi đè mở rộng định dạng thay vì chép lại.',
        'Sắp xếp trên bản sao (Arrays.copyOf), nếu không "vừa nhập gần nhất" sẽ không còn là cái bạn vừa gõ.',
        'Đọc kỹ thực đơn ở màn hình mong đợi: nó có NĂM mục, trong khi phần Chi tiết chức năng chỉ liệt kê bốn.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
# The English brief is the contract and stays untouched; this is the reading
# aid beside it, so every message the program prints stays in English exactly
# as the brief prints it.
VI = {
    'J1.S.P0054': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình quản lý danh bạ như sau. Hiện thực đơn:</p>
<pre>1. Add a contact
2. Display all contacts
3. Delete a contact
4. Exit</pre>
<p><strong>Lựa chọn của người dùng:</strong></p>
<ul>
<li><strong>Chọn 1:</strong> cho phép thêm một liên hệ gồm ID (int), fullname (String), group (String),
address (String), phone (String), lastName (String), firstname (String). Trong đó <strong>ID tự động
tăng</strong> (liên hệ mới có ID bằng ID của liên hệ cuối + 1), liên hệ đầu tiên có ID là 1;
<strong>firstname và lastname được tách từ tên theo dấu cách đầu tiên</strong>.</li>
<li><strong>Chọn 2:</strong> chương trình hiển thị danh sách dữ liệu theo dạng bảng:
ID, Name, First Name, Last Name, Group, Address, Phone.</li>
<li><strong>Chọn 3:</strong> chương trình yêu cầu nhập ID của liên hệ cần xoá; nếu ID không tồn tại thì
hiển thị thông báo <code>No found contact</code>.</li>
<li><strong>Chọn 4:</strong> thoát chương trình.</li>
</ul>
<p><strong>Lưu ý:</strong> số điện thoại chỉ được nhận một trong các định dạng sau:</p>
<pre>1234567890
123-456-7890
123-456-7890 x1234
123-456-7890 ext1234
(123)-456-7890
123.456.7890
123 456 7890</pre>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và hỏi người dùng chọn mục</h4>
<ul><li>Người dùng chạy chương trình, chương trình nhắc chọn một mục.</li>
<li>Người dùng chọn xong thì thực hiện Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1 — Thêm liên hệ.</strong> Nhập thông tin gồm "name, group, address, phone". Kiểm tra dữ
liệu: số điện thoại phải đúng một trong các định dạng trên. Thêm liên hệ vào chương trình rồi quay lại
màn hình chính.</p>
<p><strong>Mục 2 — Hiển thị danh bạ.</strong> Hiển thị toàn bộ liên hệ rồi quay lại chương trình.</p>
<p><strong>Mục 3 — Xoá liên hệ.</strong> Yêu cầu nhập ID cần xoá. Kiểm tra dữ liệu: ID phải là số và
phải tồn tại.</p>
<p><strong>Mục 4 — Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>========= Contact program =========
1. Add a Contact
2. Display all Contact
3. Delete a Contact
4. Exit
Please choice one option: Your choice:</pre>
<pre>-------- Add a Contact --------
Enter Name: Raul Gonzalez
Enter Group: Star
Enter Address: Spain
Enter Phone: 09
Please input Phone flow
&#8226; 1234567890
&#8226; 123-456-7890
&#8226; 123-456-7890 x1234
&#8226; 123-456-7890 ext1234
&#8226; (123)-456-7890
&#8226; 123.456.7890
&#8226; 123 456 7890
Enter Phone: 1234567890
Successful</pre>
<pre>--------------------------------- Display all Contact ----------------------------
ID      Name             First Name     Last Name      Group     Address   Phone
1       Iker Casillas    Iker           Casillas       Star      Spain     1234567890
2       John Terry       John           Terry          Star      England   1234567890
3       Raul Gonzalez    Raul           Gonzalez       Star      Spain     1234567890</pre>
<pre>------- Delete a Contact -------
Enter ID: a
ID is digit
Enter ID: 1
Successful</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt ba phương thức <code>addContact</code>,
<code>displayAll</code>, <code>deleteContact</code>.</p>
<h4>Chức năng 1: Thêm liên hệ</h4>
<p><code>public boolean addContact(List&lt;Contact&gt; list, Contact contact)</code></p>
<ul><li>Đầu vào: <code>list</code> — nơi chứa các liên hệ; <code>contact</code> — thông tin liên hệ.</li>
<li>Trả về: trạng thái thêm được một liên hệ hay không.</li></ul>
<h4>Chức năng 2: Hiển thị danh sách liên hệ</h4>
<p><code>public void displayAll(List&lt;Contact&gt; list)</code></p>
<ul><li>Đầu vào: <code>list</code> — danh sách liên hệ.</li><li>Trả về: void.</li></ul>
<h4>Chức năng 3: Xoá liên hệ</h4>
<p><code>public boolean deleteContact(List&lt;Contact&gt; list, Contact contact)</code></p>
<ul><li>Đầu vào: <code>list</code> — danh sách liên hệ; <code>contact</code> — liên hệ muốn xoá.</li>
<li>Trả về: trạng thái xoá.</li></ul>''',

    'J1.S.P0052': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p>Xây dựng lớp <code>Country</code> gồm các thuộc tính và phương thức sau:</p>
<pre>protected String countryCode;
protected String countryName;
protected float totalArea;</pre>
<ul>
<li>Cài đặt hai constructor: một có tham số và một không tham số.</li>
<li>Cài đặt đầy đủ các hàm set / get cho các thuộc tính.</li>
<li>Cài đặt hàm <code>display()</code> để hiển thị thông tin của một quốc gia.</li>
</ul>
<p>Xây dựng lớp <code>EastAsiaCountries</code> <strong>kế thừa</strong> lớp <code>Country</code> và thêm
thuộc tính:</p>
<pre>private String countryTerrain;</pre>
<ul>
<li>Cài đặt constructor có tham số và dùng từ khoá <code>super</code> để gọi constructor của lớp
<code>Country</code> ở trên.</li>
<li>Ghi đè <code>display()</code>.</li>
</ul>
<p>Xây dựng lớp <code>ManageEastAsiaCountries</code> thực hiện các chức năng sau:</p>
<pre>1. Nhập thông tin cho 11 quốc gia.
2. Hiển thị thông tin vừa nhập.
3. Tìm quốc gia theo tên người dùng nhập.
4. Hiển thị thông tin sắp xếp tăng dần theo tên quốc gia.
5. Thoát.</pre>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện thực đơn và hỏi người dùng chọn mục</h4>
<ul><li>Người dùng chạy chương trình, chương trình nhắc chọn một mục.</li>
<li>Người dùng chọn xong thì thực hiện Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện theo mục đã chọn</h4>
<p><strong>Mục 1 — Nhập thông tin 11 quốc gia Đông Á.</strong> Nhập gồm (code, name, total area,
terrain). Kiểm tra dữ liệu: <strong>tổng diện tích phải lớn hơn 0</strong>. Thêm dữ liệu vào chương
trình rồi quay lại màn hình chính.</p>
<p><strong>Mục 2 — Hiển thị thông tin quốc gia vừa nhập.</strong> Hiển thị rồi quay lại màn hình
chính.</p>
<p><strong>Mục 3 — Tìm quốc gia theo tên người dùng nhập.</strong> Yêu cầu nhập tên quốc gia, hiển thị
kết quả rồi quay lại màn hình chính.</p>
<p><strong>Mục 4 — Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>Enter code of country:
VN
Enter name of country:
Viet Nam
Enter total Area:
331698
Enter terrain of country:
Nice

ID              Name            Total Area      Terrain
VN              Viet Nam        331698.0        Nice</pre>
<pre>                               MENU
==========================================================================
1. Input the information of 11 countries in East Asia
2. Display the information of country you've just input
3. Search the information of country by user-entered name
4. Display the information of countries sorted name in ascending order
5. Exit
==========================================================================
Enter your choice :</pre>
<pre>Enter the name you want to search for:
Viet Nam
ID              Name            Total Area      Terrain
VN              Viet Nam        331698.0        Nice</pre>
<pre>ID              Name            Total Area      Terrain
VN              Viet Nam        331698.0        Nice
IDN             Indonesia       1860360.0       Nice</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt bốn phương thức <code>addCountryInformation</code>,
<code>getRecentlyEnteredInformation</code>, <code>searchInformationByName</code>,
<code>sortInformationByAscendingOrder</code>.</p>
<h4>Chức năng 1: Thêm thông tin một quốc gia</h4>
<p><code>public void addCountryInformation(EastAsiaCountries country) throws Exception</code></p>
<ul><li>Đầu vào: <code>country</code> — thông tin một quốc gia.</li>
<li>Trả về: danh sách ngoại lệ (ném ra khi vi phạm).</li></ul>
<h4>Chức năng 2: Hiển thị thông tin quốc gia vừa nhập</h4>
<p><code>public EastAsiaCountries getRecentlyEnteredInformation() throws Exception</code></p>
<ul><li>Đầu vào: không có.</li><li>Trả về: kết quả hoặc ngoại lệ.</li></ul>
<h4>Chức năng 3: Tìm thông tin quốc gia theo tên</h4>
<p><code>public EastAsiaCountries[] searchInformationByName(String name) throws Exception</code></p>
<ul><li>Đầu vào: <code>name</code> — tên quốc gia.</li>
<li>Trả về: kết quả tìm được.</li></ul>
<h4>Chức năng 4: Hiển thị các quốc gia theo tên tăng dần</h4>
<p><code>public EastAsiaCountries[] sortInformationByAscendingOrder() throws Exception</code></p>
<ul><li>Đầu vào: không có.</li><li>Trả về: danh sách đã được sắp xếp.</li></ul>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
