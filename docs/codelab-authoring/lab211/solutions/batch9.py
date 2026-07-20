# Batch 9 — J1.S.P0057 (user management, file), J1.S.P0082 (playing cards),
# J1.S.P0084 (multiplying numbers too big for long).
import re
from solkit import solution, SOLUTIONS


# ════════════════════════════════════════════════════════════════
# J1.S.P0057 — User management system (56 LOC)
# ════════════════════════════════════════════════════════════════

P0057_ACCOUNT = '''package entity;

import java.io.Serializable;

/**
 * One user account: nothing but the two fields, and no rules about them.
 *
 * Serializable because the brief allows a binary file. This solution writes a
 * text file, but leaving the marker interface in place costs nothing and keeps
 * the door open - the class does not change if the storage format does.
 */
public class Account implements Serializable {

    private static final long serialVersionUID = 1L;

    private String username;
    private String password;

    public Account() {
    }

    public Account(String username, String password) {
        this.username = username;
        this.password = password;
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

    @Override
    public String toString() {
        return username;
    }
}
'''

P0057_BO = '''package bo;

import entity.Account;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/**
 * The accounts, the rules about them, and the file they live in.
 *
 * The brief's MARKING list is the specification of this class: check the file
 * exists before inserting, load the accounts into a Collection, search the
 * Collection. Note "search the Collection" - the search happens in memory, not
 * by re-reading the file, so a login never touches the disk.
 *
 * Nothing here prints. addAccount and find report failure by throwing, exactly
 * as the Guidelines require, and the screen layer decides how to say it.
 */
public class UserManager {

    /**
     * A single space separates the two fields.
     *
     * That is safe precisely because the validation forbids spaces inside a
     * username or a password - so a space in the line can only ever be the
     * separator. The file format and the validation rules are one decision,
     * not two.
     */
    private static final String SEPARATOR = " ";

    private final String path;
    private final List<Account> accounts = new ArrayList<>();

    public UserManager(String path) {
        this.path = path;
    }

    /** A missing user.dat on the very first run is normal, not an error. */
    public void load() throws IOException {
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
                String[] parts = line.split(SEPARATOR, 2);
                if (parts.length == 2) {
                    accounts.add(new Account(parts[0], parts[1]));
                }
            }
        }
    }

    /**
     * Adds one account and appends it to the file.
     *
     * The brief says the new account is APPENDED to the end of user.dat, so the
     * file is opened in append mode and only the new line is written. Rewriting
     * the whole file would also work, but it would put every existing account
     * at risk for the sake of adding one.
     */
    public void addAccount(Account account) throws Exception {
        if (exists(account.getUsername())) {
            throw new Exception("Username [" + account.getUsername() + "] already exists.");
        }
        accounts.add(account);
        try (PrintWriter writer = new PrintWriter(new FileWriter(path, true))) {
            writer.println(account.getUsername() + SEPARATOR + account.getPassword());
        }
    }

    public boolean exists(String username) {
        for (Account account : accounts) {
            if (account.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }

    /**
     * The account with this username AND password.
     *
     * One message for both failures on purpose: telling the caller that the
     * username exists but the password is wrong hands an attacker half the
     * answer. The brief's own wording, "Invalid user name or password", is
     * already the careful one.
     */
    public Account find(Account account) throws Exception {
        for (Account stored : accounts) {
            if (stored.getUsername().equals(account.getUsername())
                    && stored.getPassword().equals(account.getPassword())) {
                return stored;
            }
        }
        throw new Exception("Invalid user name or password");
    }

    public int size() {
        return accounts.size();
    }
}
'''

P0057_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
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
     * A field with a minimum length and no spaces - the same rule for the
     * username (5) and the password (6), so it is written once.
     *
     * The raw line is NOT trimmed before the check. Trimming first would let
     * "  abcde  " through as a five-character username, and the brief says no
     * spaces. It is the space the user actually typed that has to be rejected.
     */
    public static String getField(String message, String error, int minLength) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine();
            if (line.length() >= minLength && !line.contains(" ")) {
                return line;
            }
            System.out.println(error);
        }
    }
}
'''

P0057_MAIN = '''package ui;

import bo.UserManager;
import entity.Account;
import java.io.IOException;
import utils.Validator;

/** Menu and screen only. */
public class Main {

    private static final String FILE = "user.dat";
    private static final String USER_ERROR = "You must enter least at 5 character, and no space!";
    private static final String PASS_ERROR = "You must enter least at 6 character, and no space!";

    public static void main(String[] args) {
        UserManager manager = new UserManager(FILE);
        try {
            manager.load();
        } catch (IOException e) {
            System.out.println("Could not read " + FILE + ": " + e.getMessage());
        }
        System.out.println("Loaded " + manager.size() + " account(s) from " + FILE + ".");

        boolean running = true;
        while (running) {
            System.out.println("====== USER MANAGEMENT SYSTEM ======");
            System.out.println("1. Create a new account");
            System.out.println("2. Login system");
            System.out.println("3. Exit");

            int choice = Validator.getInt("> Choose: ", 1, 3);
            switch (choice) {
                case 1:
                    createAccount(manager);
                    break;
                case 2:
                    login(manager);
                    break;
                default:
                    running = false;
                    System.out.println("Goodbye.");
            }
        }
    }

    private static void createAccount(UserManager manager) {
        String username = Validator.getField("Enter Username: ", USER_ERROR, 5);
        String password = Validator.getField("Enter Password: ", PASS_ERROR, 6);
        try {
            manager.addAccount(new Account(username, password));
            System.out.println("Create account successfully!");
        } catch (Exception e) {
            // Duplicate username, or the file could not be written. Both are
            // reported the same way: the program says why and keeps running.
            System.out.println(e.getMessage());
        }
    }

    private static void login(UserManager manager) {
        String username = Validator.getField("Enter Username: ", USER_ERROR, 5);
        String password = Validator.getField("Enter Password: ", PASS_ERROR, 6);
        try {
            manager.find(new Account(username, password));
            System.out.println("Login successful!");
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
'''


MENU = '''====== USER MANAGEMENT SYSTEM ======
1. Create a new account
2. Login system
3. Exit
'''


solution(
    'J1.S.P0057',
    title_vi='Hệ thống quản lý tài khoản người dùng',
    files=[('src/entity/Account.java', P0057_ACCOUNT),
           ('src/bo/UserManager.java', P0057_BO),
           ('src/utils/Validator.java', P0057_VALIDATOR),
           ('src/ui/Main.java', P0057_MAIN)],
    main_class='ui.Main',
    runs=[
        # Run 1 — the brief's own screen: a username too short, then a password
        # too short, then a good account. Ends by exiting.
        ('1\n12\nNghiaNV1\n12\nspace@123\n3\n',
         'Loaded 0 account(s) from user.dat.\n' + MENU +
         '> Choose: Enter Username: You must enter least at 5 character, and no space!\n'
         'Enter Username: Enter Password: You must enter least at 6 character, and no space!\n'
         'Enter Password: Create account successfully!\n' + MENU +
         '> Choose: Goodbye.'),
        # Run 2 — a SECOND process, in the same directory. It must find the
        # account run 1 saved: this is what proves the file actually works.
        ('2\nNghiaNV1\nspace@123\n2\nNghiaNV1\nwrong123\n3\n',
         'Loaded 1 account(s) from user.dat.\n' + MENU +
         '> Choose: Enter Username: Enter Password: Login successful!\n' + MENU +
         '> Choose: Enter Username: Enter Password: Invalid user name or password\n' + MENU +
         '> Choose: Goodbye.'),
        # Run 3 — the duplicate username rule, again across a restart.
        ('1\nNghiaNV1\nanother123\n3\n',
         'Loaded 1 account(s) from user.dat.\n' + MENU +
         '> Choose: Enter Username: Enter Password: Username [NghiaNV1] already exists.\n' + MENU +
         '> Choose: Goodbye.'),
    ],
    explain_en='''<p><strong>The MARKING list is the design.</strong> The brief spells out five things the
marker checks: the file is checked for existence before an insert, the username and password are read,
the account is appended to <code>user.dat</code>, the accounts are loaded from the file into a
<em>Collection</em>, and the search happens <em>in the Collection</em>. That last word decides the
architecture: <code>load()</code> runs once at start-up, and a login then searches memory. A program
that re-opens the file on every login attempt does the same job and loses the mark.</p>
<p><strong>Append, do not rewrite.</strong> The brief says a new account is added at the end of an
existing <code>user.dat</code>, so the file is opened with <code>new FileWriter(path, true)</code> and
one line is written. Rewriting the whole file for one new account puts every existing account at risk
of a half-written file for no gain.</p>
<p><strong>The separator is a consequence of the validation, not a separate choice.</strong> A username
and a password may not contain a space, so a space is the one character that can never appear inside a
field — which makes it a safe separator. <code>split(" ", 2)</code> keeps that true even if a future
rule allowed spaces in the password.</p>
<p><strong>Why one message for two different failures.</strong> <code>find</code> throws
<code>"Invalid user name or password"</code> whether the username is unknown or the password is wrong.
Splitting them into "no such user" and "wrong password" is friendlier and tells anyone probing the
system which usernames are real. The brief's own wording is already the careful one — say so if you
are asked.</p>
<p><strong>Do not trim before checking for spaces.</strong> <code>getField</code> reads the raw line.
If it trimmed first, <code>"  abcde  "</code> would pass as a five-character username with no spaces,
which is exactly what the rule forbids. Trimming is for tidying data you have accepted, not for
deciding whether to accept it.</p>
<p><strong>How this was verified.</strong> Three separate runs of the program in the same directory.
Run 1 creates the account, run 2 is a <em>new process</em> that logs in with it, run 3 is another new
process that is refused a duplicate username. Only a file that is really written and really read back
can pass all three — a version that kept the accounts in memory would pass run 1 alone.</p>
<p><strong>A note on the binary-file option.</strong> The brief allows a binary file. If you use
<code>ObjectOutputStream</code>, appending is a trap: each new stream writes a fresh header into the
middle of the file, and <code>ObjectInputStream</code> then fails on the second header. You would have
to subclass it and override <code>writeStreamHeader()</code>, or rewrite the whole file each time. Text
avoids all of that and stays readable to a marker.</p>''',
    explain_vi='''<p><strong>Mục MARKING chính là bản thiết kế.</strong> Đề ghi rõ năm thứ người chấm
soi: kiểm tra tệp có tồn tại trước khi thêm, nhập tên và mật khẩu, <em>ghi thêm</em> tài khoản vào cuối
<code>user.dat</code>, nạp tài khoản từ tệp vào một <em>Collection</em>, và tìm kiếm <em>trong
Collection</em>. Chữ cuối cùng quyết định kiến trúc: <code>load()</code> chạy một lần lúc khởi động, và
việc đăng nhập sau đó chỉ tìm trong bộ nhớ. Chương trình mở lại tệp ở mỗi lần đăng nhập vẫn ra kết quả
đúng nhưng mất điểm đúng ý này.</p>
<p><strong>Ghi thêm, đừng ghi đè.</strong> Đề nói tài khoản mới được nối vào cuối tệp đã có, nên tệp
được mở bằng <code>new FileWriter(path, true)</code> và chỉ một dòng được ghi. Ghi lại toàn bộ tệp chỉ
để thêm một tài khoản khiến mọi tài khoản cũ chịu rủi ro tệp ghi dở, mà chẳng được gì.</p>
<p><strong>Ký tự phân cách là hệ quả của luật kiểm tra, không phải một lựa chọn riêng.</strong> Tên và
mật khẩu không được chứa dấu cách, nên dấu cách là ký tự duy nhất chắc chắn không bao giờ nằm bên trong
một trường — vì thế nó an toàn để làm dấu phân cách. <code>split(" ", 2)</code> giữ điều đó đúng ngay cả
khi sau này luật cho phép mật khẩu có dấu cách.</p>
<p><strong>Vì sao hai lỗi khác nhau lại chung một thông báo.</strong> <code>find</code> ném
<code>"Invalid user name or password"</code> dù là không có tên đó hay sai mật khẩu. Tách thành "không
có người dùng này" và "sai mật khẩu" thì thân thiện hơn, nhưng đồng thời chỉ cho người đang dò biết tên
nào có thật. Cách diễn đạt của chính đề đã là cách cẩn thận — hãy nói ra điều này nếu bị hỏi.</p>
<p><strong>Đừng cắt khoảng trắng trước khi kiểm tra dấu cách.</strong> <code>getField</code> đọc dòng
thô. Nếu cắt trước, <code>"  abcde  "</code> sẽ lọt qua như một tên 5 ký tự không có dấu cách — đúng thứ
luật cấm. Cắt khoảng trắng là để dọn dẹp dữ liệu đã nhận, không phải để quyết định có nhận hay
không.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy riêng biệt trong cùng một thư mục. Lần 1 tạo tài
khoản, lần 2 là một <em>tiến trình mới</em> đăng nhập bằng tài khoản đó, lần 3 là tiến trình mới nữa bị
từ chối vì trùng tên. Chỉ một chương trình thật sự ghi tệp và thật sự đọc lại mới qua được cả ba — bản
chỉ giữ trong bộ nhớ chỉ qua được lần 1.</p>
<p><strong>Ghi chú về lựa chọn tệp nhị phân.</strong> Đề cho phép dùng tệp nhị phân. Nếu dùng
<code>ObjectOutputStream</code>, việc ghi nối là một cái bẫy: mỗi luồng mới lại ghi một phần đầu luồng
vào giữa tệp, và <code>ObjectInputStream</code> sẽ chết ở phần đầu thứ hai. Muốn dùng thì phải kế thừa
và ghi đè <code>writeStreamHeader()</code>, hoặc ghi lại cả tệp mỗi lần. Dùng tệp văn bản né được toàn
bộ chuyện đó và người chấm vẫn đọc được tệp.</p>''',
    hints_en=[
        'Load the file once at start-up into a List; search that List, not the file.',
        'Open the file in append mode — the brief says the new account goes at the END of user.dat.',
        'A missing user.dat on the first run is normal. Return quietly instead of throwing.',
        'Check the raw typed line for spaces; trimming it first defeats the "no spaces" rule.',
        'Test it by running the program twice — the second run must find what the first one saved.',
    ],
    hints_vi=[
        'Nạp tệp một lần lúc khởi động vào một List; tìm trong List đó, không tìm trong tệp.',
        'Mở tệp ở chế độ ghi nối — đề nói tài khoản mới nằm ở CUỐI user.dat.',
        'Lần chạy đầu chưa có user.dat là bình thường. Hãy lặng lẽ trả về thay vì ném lỗi.',
        'Kiểm dấu cách trên dòng thô vừa gõ; cắt khoảng trắng trước là vô hiệu hoá luật "không dấu cách".',
        'Muốn tự kiểm, chạy chương trình hai lần — lần sau phải tìm thấy thứ lần trước đã lưu.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0082 — Playing cards (60 LOC)
# ════════════════════════════════════════════════════════════════

P0082_CARD = '''package entity;

/**
 * One playing card: a rank and a suit, and nothing else.
 *
 * Both fields are final and there are no setters, because the brief says a card
 * is immutable once created. That is not decoration - it means a Card can be
 * handed to any part of the program without the risk that someone quietly turns
 * the Ace of Spades into the Two of Clubs.
 *
 * Rank and Suit are enums nested inside Card because they have no meaning
 * anywhere else. An enum here beats a String: the compiler will not let you
 * build a "Purple" card, and values() gives the two loops that fill the deck.
 */
public class Card {

    public enum Suit {
        CLUBS("Clubs"), DIAMONDS("Diamonds"), HEARTS("Hearts"), SPADES("Spades");

        private final String label;

        Suit(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    public enum Rank {
        TWO("2"), THREE("3"), FOUR("4"), FIVE("5"), SIX("6"), SEVEN("7"),
        EIGHT("8"), NINE("9"), TEN("10"), JACK("Jack"), QUEEN("Queen"),
        KING("King"), ACE("Ace");

        private final String label;

        Rank(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    private final Rank rank;
    private final Suit suit;

    public Card(Rank rank, Suit suit) {
        this.rank = rank;
        this.suit = suit;
    }

    public Rank getRank() {
        return rank;
    }

    public Suit getSuit() {
        return suit;
    }

    /** "Queen of Hearts" - the readable form the brief asks for. */
    @Override
    public String toString() {
        return rank.getLabel() + " of " + suit.getLabel();
    }
}
'''

P0082_DECK = '''package entity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A full deck: the 52 cards, and the things you can do to a deck.
 *
 * There is no separate bo layer in this exercise, and that is deliberate. The
 * brief names exactly two classes plus a test program; a deck IS the collection
 * and its rules, so a manager class on top of it would only forward calls.
 * Add a layer where the program needs one, not to fill in a diagram.
 */
public class Deck {

    private final List<Card> cards = new ArrayList<>();

    /** 4 suits x 13 ranks = 52, built by two nested loops over values(). */
    public Deck() {
        for (Card.Suit suit : Card.Suit.values()) {
            for (Card.Rank rank : Card.Rank.values()) {
                cards.add(new Card(rank, suit));
            }
        }
    }

    public int size() {
        return cards.size();
    }

    /**
     * Read-only view.
     *
     * Returning the live list would let a caller add a 53rd card or remove one
     * without the deck knowing. Handing out an unmodifiable wrapper keeps the
     * deck's own invariant its own business.
     */
    public List<Card> getCards() {
        return Collections.unmodifiableList(cards);
    }

    public void shuffle() {
        Collections.shuffle(cards);
    }

    /**
     * Takes the top card off the deck.
     *
     * Removing from the END of an ArrayList is O(1); removing from index 0
     * shifts every remaining element. Dealing 52 cards off the front is 52
     * shifts of a shrinking array for no benefit - the "top" of a deck is
     * whichever end you decide it is.
     */
    public Card deal() {
        if (cards.isEmpty()) {
            throw new IllegalStateException("The deck is empty.");
        }
        return cards.remove(cards.size() - 1);
    }
}
'''

P0082_MAIN = '''package ui;

import entity.Card;
import entity.Deck;
import java.util.ArrayList;
import java.util.List;

/** The test program: build a deck, show it, then shuffle and deal from it. */
public class Main {

    private static final int HAND = 5;

    public static void main(String[] args) {
        Deck deck = new Deck();

        System.out.println("========= DECK OF CARDS =========");
        System.out.println("Deck created with " + deck.size() + " cards.");

        int number = 1;
        for (Card card : deck.getCards()) {
            System.out.println(number + ". " + card);
            number++;
        }
        System.out.println("=================================");
        System.out.println("Total: " + deck.size() + " cards");

        deck.shuffle();
        System.out.println("--- After shuffling, dealing " + HAND + " cards ---");
        List<Card> hand = new ArrayList<>();
        for (int i = 0; i < HAND; i++) {
            hand.add(deck.deal());
        }
        for (Card card : hand) {
            System.out.println("- " + card);
        }
        System.out.println("Cards left in the deck: " + deck.size());
    }
}
'''

P0082_DECK_LINES = [f'{i}. {r} of {s}'
                    for si, s in enumerate(['Clubs', 'Diamonds', 'Hearts', 'Spades'])
                    for ri, r in enumerate(['2', '3', '4', '5', '6', '7', '8', '9', '10',
                                            'Jack', 'Queen', 'King', 'Ace'])
                    for i in [si * 13 + ri + 1]]


def _p0082_check(out):
    """The 52 printed cards are fixed; the five dealt ones are not.

    So the fixed part is diffed exactly, and the random part is checked by its
    relationships: five DISTINCT cards, every one of them a real card from the
    deck, and 47 left afterwards. A shuffle that returned the same card twice,
    or invented one, cannot pass.
    """
    lines = [ln.rstrip() for ln in out.split('\n')]
    head = ['========= DECK OF CARDS =========', 'Deck created with 52 cards.']
    expected = head + P0082_DECK_LINES + ['=================================',
                                          'Total: 52 cards',
                                          '--- After shuffling, dealing 5 cards ---']
    if lines[:len(expected)] != expected:
        for i, (want, got) in enumerate(zip(expected, lines)):
            if want != got:
                return False, f'line {i + 1}: expected {want!r}, got {got!r}'
        return False, f'expected at least {len(expected)} lines, got {len(lines)}'

    rest = lines[len(expected):]
    dealt = [ln[2:] for ln in rest if ln.startswith('- ')]
    if len(dealt) != 5:
        return False, f'expected 5 dealt cards, got {len(dealt)}'
    if len(set(dealt)) != 5:
        return False, f'the same card was dealt twice: {dealt}'
    all_cards = {ln.split('. ', 1)[1] for ln in P0082_DECK_LINES}
    for card in dealt:
        if card not in all_cards:
            return False, f'{card!r} is not a card in a standard deck'
    if 'Cards left in the deck: 47' not in rest:
        return False, f'expected 47 cards left, got: {rest[-1]!r}'
    return True, ''


solution(
    'J1.S.P0082',
    title_vi='Bộ bài tây',
    files=[('src/entity/Card.java', P0082_CARD),
           ('src/entity/Deck.java', P0082_DECK),
           ('src/ui/Main.java', P0082_MAIN)],
    main_class='ui.Main',
    runs=[('', _p0082_check), ('', _p0082_check)],
    explain_en='''<p><strong>Two classes, and that is the whole design.</strong> The brief names a Card and
a Deck. There is no <code>bo</code> package here and that is the right answer, not a shortcut: a deck
<em>is</em> its cards plus the rules about them, so a manager class on top would do nothing but forward
calls. The rule from the sample projects is "add a layer where the program needs one" — a marker who
asks why there is no controller is asking whether you can justify a design, not whether you memorised
one.</p>
<p><strong>Enums beat Strings for rank and suit.</strong> With <code>String</code> the compiler is happy
to build a "Purple" card and you find out at run time. With an enum the mistake will not compile,
<code>values()</code> hands you exactly the two loops that fill the deck, and the count is a fact of the
type rather than a number you typed. Each constant carries the label it prints, so
<code>toString()</code> is one line and the display text lives next to the value it belongs to.</p>
<p><strong>Immutability is a design decision the brief actually states.</strong> Both fields are
<code>final</code> and there are no setters. A Card can then be passed anywhere — into a hand, into a
list, into another player's object — with no chance that some distant code turns the Ace of Spades into
the Two of Clubs behind your back.</p>
<p><strong>4 × 13 with two nested loops, never 52 lines of typing.</strong> The outer loop over suits and
the inner over ranks generates every combination exactly once. Writing the cards out by hand is not just
long, it is a list that can silently be wrong — one duplicate or one missing card and the deck still
"looks" fine.</p>
<p><strong>Why <code>deal()</code> takes from the end.</strong> <code>ArrayList.remove(size - 1)</code>
is O(1); <code>remove(0)</code> shifts every remaining element down one place. Dealing a whole deck off
the front is 52 shrinking shifts for no benefit — the "top" of a deck is whichever end you decide it
is. And <code>getCards()</code> returns an unmodifiable view so nobody can add a 53rd card without the
deck knowing.</p>
<p><strong>How this was verified with a shuffle in the program.</strong> The 52 printed cards are fixed,
so they are diffed line by line against the exact expected list. The five dealt cards are random, so
they are checked by their <em>relationships</em>: five distinct cards, every one of them a real card
from a standard deck, and 47 left afterwards. A lucky run cannot pass that, and a shuffle that returned
the same card twice cannot either.</p>''',
    explain_vi='''<p><strong>Hai lớp, và đó là toàn bộ thiết kế.</strong> Đề nêu tên một lớp Card và một
lớp Deck. Ở đây không có gói <code>bo</code>, và đó là câu trả lời đúng chứ không phải làm tắt: một bộ
bài <em>chính là</em> tập lá bài cộng với luật về chúng, nên thêm một lớp quản lý bên trên chỉ để gọi
chuyển tiếp. Quy tắc rút từ các project mẫu là "chỉ thêm tầng khi chương trình cần" — người chấm hỏi vì
sao không có controller là đang hỏi bạn có bảo vệ được thiết kế không, chứ không phải bạn có thuộc bài
không.</p>
<p><strong>Enum hơn String cho rank và suit.</strong> Với <code>String</code>, trình biên dịch vui vẻ cho
bạn tạo lá bài màu "Purple" và bạn chỉ biết khi chạy. Với enum thì sai là không biên dịch được,
<code>values()</code> đưa sẵn đúng hai vòng lặp để dựng bộ bài, và số lượng là một tính chất của kiểu chứ
không phải con số bạn gõ tay. Mỗi hằng số mang theo nhãn hiển thị của nó, nên <code>toString()</code> chỉ
một dòng và chữ hiển thị nằm ngay cạnh giá trị mà nó thuộc về.</p>
<p><strong>Bất biến là một quyết định thiết kế mà chính đề nói ra.</strong> Hai trường đều
<code>final</code> và không có setter. Nhờ vậy một lá bài có thể truyền đi bất cứ đâu — vào tay bài, vào
danh sách, vào đối tượng của người chơi khác — mà không lo có đoạn mã xa xôi nào lặng lẽ biến Át bích
thành Hai chuồn.</p>
<p><strong>4 × 13 bằng hai vòng lặp lồng, đừng bao giờ gõ tay 52 dòng.</strong> Vòng ngoài duyệt chất,
vòng trong duyệt hạng, sinh đúng một lần mỗi tổ hợp. Liệt kê tay không chỉ dài, mà còn là một danh sách
có thể sai trong im lặng — thừa một lá hoặc thiếu một lá thì bộ bài vẫn "trông" bình thường.</p>
<p><strong>Vì sao <code>deal()</code> lấy từ cuối.</strong> <code>ArrayList.remove(size - 1)</code> là
O(1); <code>remove(0)</code> phải dời mọi phần tử còn lại xuống một ô. Chia hết cả bộ bài từ đầu danh
sách là 52 lần dời, chẳng đổi lấy được gì — "mặt trên" của bộ bài là đầu nào cũng được, do bạn quy ước.
Còn <code>getCards()</code> trả về khung nhìn không sửa được, nên không ai thêm được lá thứ 53 mà bộ bài
không hay biết.</p>
<p><strong>Kiểm chứng thế nào khi chương trình có xáo bài.</strong> 52 dòng in ra là cố định nên được so
từng dòng với danh sách mong đợi chính xác. Năm lá chia ra là ngẫu nhiên nên được kiểm bằng <em>quan
hệ</em>: năm lá phải khác nhau, mỗi lá phải là một lá thật trong bộ bài chuẩn, và còn lại đúng 47 lá. Một
lần chạy may mắn không lọt qua được, và một phép xáo trả về cùng một lá hai lần cũng vậy.</p>''',
    hints_en=[
        'Build the 52 cards with two nested loops over values(); never type the list out.',
        'Make rank and suit enums — the compiler then refuses an impossible card.',
        'No setters: the brief says a card is immutable once created.',
        'Override toString() in Card and printing the whole deck becomes one loop.',
        'deal() should remove from the END of the list — removing from index 0 shifts everything.',
    ],
    hints_vi=[
        'Dựng 52 lá bằng hai vòng lặp lồng trên values(); đừng gõ tay danh sách.',
        'Cho rank và suit là enum — khi đó trình biên dịch từ chối luôn lá bài không tồn tại.',
        'Không setter: đề nói lá bài là bất biến sau khi tạo.',
        'Ghi đè toString() trong Card thì việc in cả bộ bài chỉ còn một vòng lặp.',
        'deal() nên lấy từ CUỐI danh sách — lấy ở vị trí 0 khiến mọi phần tử phải dời chỗ.',
    ],
)


# ════════════════════════════════════════════════════════════════
# J1.S.P0084 — Large number (60 LOC)
# ════════════════════════════════════════════════════════════════

P0084_BIGNUMBER = '''package entity;

/**
 * A non-negative whole number of ANY length, stored as its own digits.
 *
 * The whole point of the exercise: 123456789123456789 already needs a long, and
 * their product needs 36 digits - about 10^36, while a long stops just above
 * 9.2 x 10^18. Parsing the input into long would not fail loudly, it would
 * silently wrap around and print a confident wrong answer.
 *
 * Digits are stored LEAST SIGNIFICANT FIRST. That looks backwards until you
 * write the multiplication: digit i of A times digit j of B belongs at position
 * i + j, which is only true when index 0 is the units. Choosing the storage
 * order to match the algorithm removes every length - 1 - i from the code.
 */
public class BigNumber {

    private final int[] digits;

    public BigNumber(String text) {
        String value = text.trim();
        digits = new int[value.length()];
        for (int i = 0; i < value.length(); i++) {
            digits[i] = value.charAt(value.length() - 1 - i) - '0';
        }
    }

    private BigNumber(int[] digits) {
        this.digits = digits;
    }

    public int length() {
        return digits.length;
    }

    /**
     * Schoolbook multiplication, exactly the one done by hand.
     *
     * A number with m digits times one with n digits has at most m + n digits,
     * so a result array of that size can never overflow - that is a proof, not
     * a guess: the largest possible product is (10^m - 1)(10^n - 1), which is
     * smaller than 10^(m+n).
     *
     * The carrying is done in a second pass rather than inside the loop. During
     * the first pass a cell may hold far more than 9 (up to 81 per addition),
     * and that is fine: int has room to spare, and one clean sweep afterwards
     * is easier to get right than carrying on every step.
     */
    public BigNumber multiply(BigNumber other) {
        int[] result = new int[digits.length + other.digits.length];

        for (int i = 0; i < digits.length; i++) {
            for (int j = 0; j < other.digits.length; j++) {
                result[i + j] += digits[i] * other.digits[j];
            }
        }
        for (int k = 0; k < result.length - 1; k++) {
            result[k + 1] += result[k] / 10;
            result[k] %= 10;
        }
        return new BigNumber(result);
    }

    /**
     * Back to text, most significant digit first.
     *
     * The leading zeros have to go - the result array is deliberately one digit
     * longer than needed most of the time. But the loop must stop at index 0,
     * not at "the first non-zero", or the number zero would print as an empty
     * line.
     */
    @Override
    public String toString() {
        int top = digits.length - 1;
        while (top > 0 && digits[top] == 0) {
            top--;
        }
        StringBuilder text = new StringBuilder();
        for (int i = top; i >= 0; i--) {
            text.append(digits[i]);
        }
        return text.toString();
    }
}
'''

P0084_VALIDATOR = '''package utils;

import java.util.Scanner;

/** Every keyboard read in the program, in one place. */
public class Validator {

    private static final Scanner SCANNER = new Scanner(System.in);

    private Validator() {
    }

    /**
     * A whole number of any length, as text.
     *
     * It is checked character by character rather than with Integer.parseInt or
     * Long.parseLong: those would reject the very numbers this program exists
     * to handle. This is the exercise in miniature - the usual tool is the
     * wrong tool once the number stops fitting.
     */
    public static String getBigNumber(String message) {
        while (true) {
            System.out.print(message);
            String line = SCANNER.nextLine().trim();
            if (isDigits(line)) {
                return line;
            }
            System.out.println("You must input digit.");
        }
    }

    private static boolean isDigits(String text) {
        if (text.isEmpty()) {
            return false;
        }
        for (int i = 0; i < text.length(); i++) {
            if (!Character.isDigit(text.charAt(i))) {
                return false;
            }
        }
        return true;
    }
}
'''

P0084_MAIN = '''package ui;

import entity.BigNumber;
import utils.Validator;

/** Screen only. */
public class Main {

    public static void main(String[] args) {
        BigNumber first = new BigNumber(Validator.getBigNumber("Enter the first number : "));
        BigNumber second = new BigNumber(Validator.getBigNumber("Enter the second number: "));

        // The operands are printed through BigNumber, not as the raw text that
        // was typed, so "0012345" is echoed back as 12345. A program that shows
        // one form of a number in the question and another in the answer makes
        // the reader wonder which one it actually used.
        System.out.println(first + " x " + second + " = " + first.multiply(second));
    }
}
'''


solution(
    'J1.S.P0084',
    title_vi='Nhân hai số lớn',
    files=[('src/entity/BigNumber.java', P0084_BIGNUMBER),
           ('src/utils/Validator.java', P0084_VALIDATOR),
           ('src/ui/Main.java', P0084_MAIN)],
    main_class='ui.Main',
    runs=[
        # The brief's own example - 18 digits each, 36 digits out.
        ('123456789123456789\n987654321987654321\n',
         'Enter the first number : Enter the second number: '
         '123456789123456789 x 987654321987654321 = 121932631356500531347203169112635269'),
        # Rejection, then zero, then leading zeros on the input.
        ('12ab\n0\n0012345\n',
         'Enter the first number : You must input digit.\n'
         'Enter the first number : Enter the second number: 0 x 12345 = 0'),
        # 123 x 45 = 5535, the worked example in the Guidelines.
        ('123\n45\n',
         'Enter the first number : Enter the second number: 123 x 45 = 5535'),
    ],
    explain_en='''<p><strong>Why <code>long</code> is not an option, and why it fails quietly.</strong> The
brief's own example already needs a <code>long</code> for each operand, and their product has 36 digits
— about 10<sup>36</sup>, while <code>long</code> stops just above 9.2 × 10<sup>18</sup>. The dangerous
part is that Java does not complain: the multiplication wraps around and prints a confident wrong
answer. That is the whole reason this exercise exists.</p>
<p><strong>Store the digits least significant first.</strong> It looks backwards until you write the
multiplication. Digit <em>i</em> of A times digit <em>j</em> of B belongs at position <em>i + j</em> —
and that is only true when index 0 is the units digit. Choosing the storage order to match the
algorithm deletes every <code>length - 1 - i</code> from the code, and those expressions are where
off-by-one errors live.</p>
<p><strong>The result array can never overflow, and that is provable.</strong> A number with <em>m</em>
digits is smaller than 10<sup>m</sup>; one with <em>n</em> digits is smaller than 10<sup>n</sup>; so the
product is smaller than 10<sup>m+n</sup>, which is exactly what <em>m + n</em> digits can hold. You are
not guessing at a safe size, you can say why it is safe.</p>
<p><strong>Carry in a second pass, not inside the loop.</strong> During the first pass a cell can hold
much more than 9 — up to 81 per addition, times however many pairs land there — and that is fine,
because an <code>int</code> has room to spare. One clean right-to-left sweep afterwards
(<code>result[k+1] += result[k] / 10; result[k] %= 10;</code>) normalises the whole array. Carrying on
every step mixes two concerns and is much easier to get wrong.</p>
<p><strong>The two edge cases the marker will type.</strong> Zero, and a number with leading zeros. The
strip-leading-zeros loop must stop at index 0 rather than at "the first non-zero digit", otherwise the
number 0 prints as an empty line. And the operands are echoed back through
<code>BigNumber.toString()</code>, so <code>0012345</code> is shown as <code>12345</code> — a program
that shows one form of a number in the question and another in the answer makes the reader wonder which
one it used.</p>
<p><strong>Validate character by character, not with <code>parseLong</code>.</strong> Using
<code>Long.parseLong</code> to check "is this a number?" would reject exactly the inputs this program
exists to handle. This is the exercise in miniature: the usual tool becomes the wrong tool once the
number stops fitting.</p>
<p><strong>How this was verified.</strong> Three runs: the brief's own 18-digit example (the 36-digit
product matches the brief digit for digit), the Guidelines' worked example 123 × 45 = 5535, and a run
that types letters, then zero, then leading zeros. <code>BigInteger</code> is not used anywhere — the
brief forbids it, and the point is to implement the arithmetic yourself.</p>''',
    explain_vi='''<p><strong>Vì sao <code>long</code> không dùng được, và vì sao nó hỏng trong im
lặng.</strong> Ngay ví dụ của đề đã cần <code>long</code> cho từng số, còn tích của chúng có 36 chữ số —
khoảng 10<sup>36</sup>, trong khi <code>long</code> chỉ tới hơn 9,2 × 10<sup>18</sup> một chút. Điều nguy
hiểm là Java không hề báo lỗi: phép nhân tràn và quay vòng, rồi in ra một đáp án sai một cách rất tự
tin. Đó chính là lý do bài này tồn tại.</p>
<p><strong>Lưu chữ số theo thứ tự hàng đơn vị trước.</strong> Nhìn thì thấy ngược, cho tới khi bạn viết
phép nhân. Chữ số thứ <em>i</em> của A nhân chữ số thứ <em>j</em> của B rơi vào vị trí <em>i + j</em> — và
điều đó chỉ đúng khi chỉ số 0 là hàng đơn vị. Chọn cách lưu khớp với thuật toán xoá sạch mọi
<code>length - 1 - i</code> khỏi mã nguồn, mà chính những biểu thức ấy mới là nơi lỗi lệch-một-đơn-vị
sinh sống.</p>
<p><strong>Mảng kết quả không bao giờ tràn, và điều đó chứng minh được.</strong> Số có <em>m</em> chữ số
thì nhỏ hơn 10<sup>m</sup>; số có <em>n</em> chữ số nhỏ hơn 10<sup>n</sup>; nên tích nhỏ hơn
10<sup>m+n</sup>, đúng bằng sức chứa của <em>m + n</em> chữ số. Bạn không đoán một kích thước an toàn, bạn
nói được vì sao nó an toàn.</p>
<p><strong>Nhớ (carry) ở lượt thứ hai, không nhớ ngay trong vòng lặp.</strong> Ở lượt đầu, một ô có thể
chứa lớn hơn 9 rất nhiều — mỗi lần cộng tối đa 81, nhân với số cặp rơi vào đó — và như vậy không sao, vì
<code>int</code> còn thừa chỗ. Sau đó một lượt quét gọn từ phải sang trái
(<code>result[k+1] += result[k] / 10; result[k] %= 10;</code>) chuẩn hoá cả mảng. Nhớ ngay trong vòng lặp
là trộn hai việc vào nhau và dễ sai hơn nhiều.</p>
<p><strong>Hai trường hợp biên mà người chấm chắc chắn sẽ gõ.</strong> Số 0, và số có chữ số 0 ở đầu.
Vòng lặp bỏ số 0 dẫn đầu phải dừng ở chỉ số 0 chứ không phải ở "chữ số khác 0 đầu tiên", nếu không số 0
sẽ in ra một dòng trống. Và hai toán hạng được in lại qua <code>BigNumber.toString()</code>, nên
<code>0012345</code> hiện thành <code>12345</code> — chương trình hiện một dạng của con số ở câu hỏi và
một dạng khác ở đáp án sẽ khiến người đọc phân vân nó đã dùng dạng nào.</p>
<p><strong>Kiểm tra từng ký tự, đừng dùng <code>parseLong</code>.</strong> Dùng
<code>Long.parseLong</code> để hỏi "đây có phải số không?" sẽ loại đúng những đầu vào mà chương trình này
sinh ra để xử lý. Đây là bản thu nhỏ của cả bài học: công cụ quen thuộc trở thành công cụ sai ngay khi
con số không còn vừa kiểu dữ liệu.</p>
<p><strong>Đã kiểm chứng thế nào.</strong> Ba lần chạy: ví dụ 18 chữ số của chính đề (tích 36 chữ số khớp
với đề tới từng chữ số), ví dụ mẫu trong phần Hướng dẫn 123 × 45 = 5535, và một lần gõ chữ cái, rồi số 0,
rồi số có 0 dẫn đầu. Không dùng <code>BigInteger</code> ở bất cứ đâu — đề cấm, và mục đích là tự cài đặt
phép tính.</p>''',
    hints_en=[
        'Read each number as a String — parsing it into int or long defeats the whole exercise.',
        'Store the digits least significant first, so digit i times digit j lands at index i + j.',
        'Make the result array lenA + lenB long; that size can never overflow.',
        'Do the carrying in a separate right-to-left pass after all the products are added in.',
        'Strip leading zeros, but stop at index 0 or the number zero prints as nothing.',
    ],
    hints_vi=[
        'Đọc mỗi số dưới dạng String — ép về int hay long là phá hỏng toàn bộ mục đích bài này.',
        'Lưu chữ số theo hàng đơn vị trước, để chữ số i nhân chữ số j rơi đúng vào chỉ số i + j.',
        'Cho mảng kết quả dài lenA + lenB; kích thước đó không bao giờ tràn.',
        'Thực hiện việc nhớ ở một lượt riêng từ phải sang trái, sau khi đã cộng hết các tích.',
        'Bỏ số 0 dẫn đầu, nhưng phải dừng ở chỉ số 0, nếu không số 0 sẽ in ra rỗng.',
    ],
)


# ── Vietnamese briefs ────────────────────────────────────────────
# The English brief is the contract and stays untouched; this is the reading
# aid beside it, so the wording of every message the marker diffs is kept in
# English exactly as the brief prints it.
VI = {
    'J1.S.P0057': '''<h3>Bối cảnh</h3><p>Không có.</p>
<h3>Đặc tả chương trình</h3>
<p><strong>HỆ THỐNG QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG.</strong> Chương trình chạy theo thực đơn:</p>
<ul><li>Tạo tài khoản mới</li><li>Đăng nhập</li></ul>
<p>Mục 1 thêm một tài khoản vào tệp tên <code>user.dat</code>: hỏi tên đăng nhập và mật khẩu
(dùng tệp văn bản hoặc tệp nhị phân đều được). Nếu <code>user.dat</code> đã tồn tại, tài khoản mới
được <strong>ghi nối vào cuối tệp</strong>. Sau khi thêm xong, chương trình quay lại thực đơn.</p>
<p>Mục 2 tìm tài khoản trong <code>user.dat</code>. Đúng tên và mật khẩu thì hiện
<code>Login successfully</code>, ngược lại hiện <code>Invalid user name or password</code>.</p>
<h4>Người chấm kiểm (MARKING)</h4>
<ul>
<li>Kiểm tra <code>user.dat</code> đã tồn tại chưa trước khi thêm tài khoản.</li>
<li>Nhập tên đăng nhập và mật khẩu.</li>
<li>Thêm tài khoản vào tệp <code>user.dat</code>.</li>
<li>Nạp tài khoản từ <code>user.dat</code> vào một <strong>Collection</strong>.</li>
<li>Tìm tên đăng nhập và mật khẩu <strong>trong Collection</strong>.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>Chức năng 1: Hiện giao diện và nhập dữ liệu</h4>
<ul><li>Người dùng chạy chương trình, chương trình nhắc nhập dữ liệu.</li>
<li>Tự động chuyển sang Chức năng 2.</li></ul>
<h4>Chức năng 2: Thực hiện xử lý</h4>
<p><strong>Mục 1 — Tạo tài khoản mới.</strong> Nhập "tên đăng nhập, mật khẩu". Kiểm tra:</p>
<ul>
<li>Tên đăng nhập tối thiểu 5 ký tự và không có dấu cách.</li>
<li>Tên đăng nhập không được trùng với tên đã có trong dữ liệu.</li>
<li>Mật khẩu tối thiểu 6 ký tự và không có dấu cách.</li>
</ul>
<p><strong>Mục 2 — Đăng nhập.</strong> Nhập "tên đăng nhập, mật khẩu" với cùng hai điều kiện độ dài
và không dấu cách, rồi báo đăng nhập thành công.</p>
<p><strong>Mục 3 — Thoát chương trình.</strong></p>
<h3>Màn hình mong đợi</h3>
<pre>====== USER MANAGEMENT SYSTEM ======
1. Create a new account
2. Login system
3. Exit
&gt; Choose: 1
Enter Username: 12
You must enter least at 5 character, and no space!
Enter Username: NghiaNV1
Enter Password: 12
You must enter least at 6 character, and no space!
Enter Password: space@123
Login successful!</pre>
<h3>Hướng dẫn</h3>
<p>Sinh viên <strong>bắt buộc</strong> cài đặt <code>addAccount</code> và <code>find</code>.</p>
<h4>Chức năng 1: Thêm tài khoản</h4>
<p><code>public void addAccount(Account acc) throws Exception</code></p>
<ul><li>Đầu vào: <code>acc</code> — tài khoản người dùng.</li>
<li>Trả về: danh sách các ngoại lệ (ném ra khi vi phạm).</li></ul>
<h4>Chức năng 2: Đăng nhập</h4>
<p><code>public Account find(Account acc) throws Exception</code></p>
<ul><li>Đầu vào: <code>acc</code> — tài khoản.</li>
<li>Trả về: tài khoản tìm được, hoặc ném ngoại lệ.</li></ul>''',

    'J1.S.P0082': '''<h3>Bối cảnh</h3>
<p>Bộ bài tây là ví dụ rất tự nhiên để luyện thiết kế lớp, đóng gói và kết hợp đối tượng. Một lá bài
chỉ có hai thuộc tính — <em>hạng</em> (rank) và <em>chất</em> (suit) — còn bộ bài chỉ là vật chứa gồm
52 lá như vậy. Bài này luyện việc khai báo lớp với trường private và hành vi public, ghi đè
<code>toString()</code> để in ra dạng đọc được, và đổ đầy một tập hợp bằng mọi tổ hợp của hai dãy giá
trị. Đây cũng là điểm khởi đầu tiện lợi cho các phần sau như xáo bài và chia bài.</p>
<h3>Đặc tả chương trình</h3>
<ul>
<li>Viết một lớp mà mỗi thể hiện đại diện cho <strong>một lá bài</strong>, có hai thuộc tính phân biệt
là hạng và chất.</li>
<li>Viết một lớp mà mỗi thể hiện đại diện cho <strong>cả bộ bài</strong>.</li>
<li>Viết một chương trình nhỏ để thử hai lớp trên: tạo một bộ bài và hiển thị toàn bộ các lá.</li>
</ul>
<h3>Chi tiết chức năng</h3>
<h4>1. Thiết kế lớp Card</h4>
<ul>
<li>Hai thuộc tính private: <code>rank</code> và <code>suit</code>.</li>
<li>Constructor đặt cả hai, các getter <code>getRank()</code> / <code>getSuit()</code>, và ghi đè
<code>toString()</code> để trả về chuỗi kiểu <em>“Ace of Spades”</em>.</li>
<li>Lá bài <strong>bất biến</strong> sau khi tạo — không cần setter.</li>
</ul>
<h4>2. Thiết kế lớp Deck</h4>
<ul>
<li>Lưu các lá trong mảng <code>Card[52]</code> hoặc <code>List&lt;Card&gt;</code>.</li>
<li>Trong constructor, sinh mọi tổ hợp hạng–chất (4 chất × 13 hạng = 52 lá) bằng hai vòng lặp lồng.</li>
<li>Có phương thức hiển thị toàn bộ bộ bài. Tuỳ chọn: thêm <code>shuffle()</code> và
<code>deal()</code>.</li>
</ul>
<h4>3. Viết chương trình thử</h4>
<p>Tạo một đối tượng <code>Deck</code> và in ra toàn bộ 52 lá.</p>
<h3>Màn hình mong đợi</h3>
<pre>========= DECK OF CARDS =========
Deck created with 52 cards.
1. 2 of Clubs
2. 3 of Clubs
...
13. Ace of Clubs
14. 2 of Diamonds
...
52. Ace of Spades
=================================
Total: 52 cards</pre>
<h3>Hướng dẫn</h3>
<p>Bộ bài chuẩn có 4 chất và 13 hạng, tức 4 × 13 = 52 lá khác nhau:</p>
<ul>
<li><strong>Chất</strong>: Clubs, Diamonds, Hearts, Spades — 4 giá trị.</li>
<li><strong>Hạng</strong>: 2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace — 13 giá trị.</li>
</ul>
<p>Gợi ý thiết kế:</p>
<ul>
<li>Giữ <code>rank</code> và <code>suit</code> ở mức private và lộ ra qua getter — đó là đóng gói.</li>
<li>Có thể lưu bằng <code>String</code>, bằng chỉ số <code>int</code>, hoặc <strong>tốt nhất là
enum</strong>.</li>
<li>Ghi đè <code>toString()</code> trong <code>Card</code> để in ra dạng “Queen of Hearts”.</li>
<li>Dựng bộ bài bằng hai vòng lặp lồng — vòng ngoài duyệt chất, vòng trong duyệt hạng.</li>
<li>Mở rộng tuỳ chọn: <code>shuffle()</code> (ví dụ <code>Collections.shuffle()</code> hoặc vòng lặp
Fisher–Yates) và <code>deal()</code> lấy ra lá trên cùng.</li>
</ul>''',

    'J1.S.P0084': '''<h3>Bối cảnh</h3>
<p>Xử lý dữ liệu lớn là bài toán thường gặp trong thực tế — và có những con số đơn giản là không vừa
các kiểu số nguyên có sẵn (<code>int</code>, thậm chí <code>long</code>). Muốn xử lý chúng, ta phải
biểu diễn số bằng từng chữ số của nó và tự cài đặt phép tính.</p>
<h3>Đặc tả chương trình</h3>
<p>Viết chương trình nhân hai số nhập từ bàn phím rồi hiển thị kết quả ra màn hình.</p>
<p><strong>Lưu ý:</strong> số chữ số của mỗi số là <strong>không giới hạn</strong> — chương trình phải
chạy đúng ngay cả khi hai số lớn hơn nhiều so với sức chứa của <code>long</code>.</p>
<h3>Chi tiết chức năng</h3>
<h4>1. Đọc hai số</h4>
<ul>
<li>Đọc mỗi số dưới dạng <strong>chuỗi</strong> từ bàn phím — đừng ép về <code>int</code>/<code>long</code>
vì số có thể quá lớn.</li>
<li>Chuyển mỗi chuỗi thành một mảng các chữ số (0–9).</li>
</ul>
<h4>2. Nhân theo cách nhân tay ở trường</h4>
<ul>
<li>Tạo mảng kết quả có độ dài <code>lenA + lenB</code> (luôn đủ chỗ).</li>
<li>Với mỗi chữ số của A và mỗi chữ số của B, cộng tích hai chữ số vào đúng vị trí trong mảng kết quả,
sau đó <strong>nhớ</strong> phần ≥ 10 sang vị trí kế tiếp.</li>
</ul>
<h4>3. Hiển thị kết quả</h4>
<p>Bỏ các chữ số 0 dẫn đầu rồi in mảng kết quả thành một con số duy nhất.</p>
<h3>Màn hình mong đợi</h3>
<pre>Enter the first number : 123456789123456789
Enter the second number: 987654321987654321
123456789123456789 x 987654321987654321 = 121932631356500531347203169112635269</pre>
<h3>Hướng dẫn</h3>
<p>Dùng mảng để lưu hai số nhập vào và kết quả. Coi mỗi số là một dãy chữ số và tái hiện đúng phép nhân
bạn vẫn làm bằng tay. <strong>Không được dùng thư viện số lớn như <code>BigInteger</code></strong> —
mục tiêu là tự cài đặt phép tính.</p>
<h4>Ý tưởng cốt lõi</h4>
<p>Đánh số các chữ số <strong>từ phải sang</strong>, bắt đầu từ 0. Khi chữ số <em>i</em> của A nhân với
chữ số <em>j</em> của B, phần đóng góp rơi vào vị trí <em>i + j</em> của kết quả:</p>
<pre>result[i + j] += A[i] * B[j];
// rồi quét từ phải sang trái để nhớ:
result[k + 1] += result[k] / 10;
result[k] %= 10;</pre>
<h4>Ghi chú</h4>
<ul>
<li>Tích của hai số có <em>m</em> và <em>n</em> chữ số có nhiều nhất <em>m + n</em> chữ số, nên mảng kết
quả cỡ đó không bao giờ tràn.</li>
<li>Xử lý trường hợp nhập số 0 (kết quả là 0) và nhớ bỏ các chữ số 0 dẫn đầu trước khi in.</li>
<li>Thuật toán chạy trong O(m × n), đủ tốt cho bài này.</li>
</ul>
<h4>Ví dụ: nhân tay 123 × 45</h4>
<pre>    1 2 3
x     4 5
---------
    6 1 5     (= 123 x 5)
  4 9 2       (= 123 x 4, dịch trái một cột)
---------
  5 5 3 5     (= 123 x 45 = 5535)</pre>''',
}
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
